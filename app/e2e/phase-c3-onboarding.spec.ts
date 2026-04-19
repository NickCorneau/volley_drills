import { test, expect, type BrowserContext, type Page } from '@playwright/test'

/**
 * Phase C-3 onboarding smoke (D-C4 / D121 / V0B-16 / H15).
 *
 * Real-browser proof that:
 * - A fresh install routes through Skill Level -> Today's Setup -> Safety
 *   -> Run (no Home bounce until onboarding completes).
 * - An existing tester (seeded `ExecutionLog` + `onboarding.completedAt`
 *   sentinel, simulating a post-C-0-backfill device) skips onboarding
 *   and lands on Home directly.
 *
 * Uses the CDP + route-interception pattern established by
 * `phase-c0-schema-v4.spec.ts` to wipe state between tests and to reach
 * the app origin without the React bundle when seeding v4 records.
 */

const DB_NAME = 'volley-drills'
const DB_VERSION_V4 = 4

async function clearOriginStorage(
  context: BrowserContext,
  page: Page,
): Promise<void> {
  const origin = new URL(
    page.url() !== 'about:blank' ? page.url() : 'http://127.0.0.1:4173',
  ).origin
  const client = await context.newCDPSession(page)
  try {
    await client.send('Storage.clearDataForOrigin', {
      origin,
      storageTypes: 'indexeddb,service_workers,cache_storage',
    })
  } finally {
    await client.detach()
  }
}

async function gotoBlankOnAppOrigin(page: Page): Promise<void> {
  await page.route('**/*', async (route) => {
    if (route.request().resourceType() === 'document') {
      await route.fulfill({
        status: 200,
        contentType: 'text/html',
        body: '<!doctype html><html><head><title>test</title></head><body></body></html>',
      })
    } else {
      await route.continue()
    }
  })
  await page.goto('/')
  await page.unroute('**/*')
}

async function seedV4ExistingTester(
  page: Page,
  completedAt: number,
): Promise<void> {
  // Simulate the post-C-0-backfill device: executionLogs has one record
  // AND storageMeta.onboarding.completedAt is set. FirstOpenGate should
  // recognize this and let the tester land on Home.
  await page.evaluate(
    async ({ dbName, version, completedAt }) => {
      const dbInstance = await new Promise<IDBDatabase>(
        (resolve, reject) => {
          const req = indexedDB.open(dbName, version)
          req.onupgradeneeded = () => {
            const dbInst = req.result
            // Recreate the full v4 store shape so the app can open
            // cleanly at v4 on the next load without re-running upgrades.
            if (!dbInst.objectStoreNames.contains('sessionPlans')) {
              dbInst.createObjectStore('sessionPlans', { keyPath: 'id' })
            }
            if (!dbInst.objectStoreNames.contains('executionLogs')) {
              const execs = dbInst.createObjectStore('executionLogs', {
                keyPath: 'id',
              })
              execs.createIndex('planId', 'planId')
              execs.createIndex('status', 'status')
            }
            if (!dbInst.objectStoreNames.contains('sessionReviews')) {
              const r = dbInst.createObjectStore('sessionReviews', {
                keyPath: 'id',
              })
              r.createIndex('executionLogId', 'executionLogId')
            }
            if (!dbInst.objectStoreNames.contains('timerState')) {
              dbInst.createObjectStore('timerState', { keyPath: 'id' })
            }
            if (!dbInst.objectStoreNames.contains('sessionDrafts')) {
              dbInst.createObjectStore('sessionDrafts', { keyPath: 'id' })
            }
            if (!dbInst.objectStoreNames.contains('storageMeta')) {
              dbInst.createObjectStore('storageMeta', { keyPath: 'key' })
            }
          }
          req.onsuccess = () => resolve(req.result)
          req.onerror = () => reject(req.error)
        },
      )

      await new Promise<void>((resolve, reject) => {
        const tx = dbInstance.transaction(
          ['executionLogs', 'storageMeta'],
          'readwrite',
        )
        tx.oncomplete = () => resolve()
        tx.onerror = () => reject(tx.error)
        tx.objectStore('executionLogs').put({
          id: 'exec-existing',
          planId: 'plan-existing',
          status: 'completed',
          activeBlockIndex: 0,
          blockStatuses: [],
          startedAt: completedAt - 60_000,
          completedAt,
        })
        tx.objectStore('storageMeta').put({
          key: 'onboarding.completedAt',
          value: completedAt,
          updatedAt: completedAt,
        })
      })

      dbInstance.close()
    },
    { dbName: DB_NAME, version: DB_VERSION_V4, completedAt },
  )
}

test.describe('Phase C-3 onboarding first-open flow', () => {
  test.beforeEach(async ({ context, page }) => {
    await gotoBlankOnAppOrigin(page)
    await clearOriginStorage(context, page)
  })

  test('fresh install routes to Skill Level, then Today\u2019s Setup, then Safety (D121 / D-C4)', async ({
    page,
  }) => {
    await page.goto('/')

    // FirstOpenGate -> /onboarding/skill-level
    await expect(
      page.getByText(/welcome\. let.?s get you started\./i),
    ).toBeVisible({ timeout: 10_000 })
    await expect(
      page.getByRole('heading', { level: 1, name: /where.?s the pair today\?/i }),
    ).toBeVisible()

    // Pick a band -> /onboarding/todays-setup
    await page.getByRole('button', { name: /foundations/i }).click()
    await expect(page).toHaveURL(/\/onboarding\/todays-setup$/)
    await expect(
      page.getByRole('heading', { level: 1, name: /today.?s setup/i }),
    ).toBeVisible()

    // Fill in the Setup form; default wind (Calm) stays.
    await page.getByRole('radio', { name: 'Solo' }).click()
    await page
      .getByRole('radiogroup', { name: 'Net available' })
      .getByRole('radio', { name: 'No' })
      .click()
    await page
      .getByRole('radiogroup', { name: 'Wall available' })
      .getByRole('radio', { name: 'No' })
      .click()
    await page.getByRole('radio', { name: '15 min' }).click()

    // Tap Build Session -> writes draft + onboarding.completedAt, routes
    // to /safety.
    await page.getByRole('button', { name: /build session/i }).click()
    await expect(page).toHaveURL(/\/safety$/)

    // Verify onboarding.completedAt was written (the sentinel the gate
    // uses to skip future onboarding routes).
    const completedAt = await page.evaluate(
      ({ dbName }) => {
        return new Promise<number | null>((resolve, reject) => {
          const req = indexedDB.open(dbName)
          req.onsuccess = () => {
            const dbInst = req.result
            const tx = dbInst.transaction('storageMeta', 'readonly')
            const getReq = tx
              .objectStore('storageMeta')
              .get('onboarding.completedAt')
            getReq.onsuccess = () => {
              const row = getReq.result as
                | { value: unknown }
                | undefined
              dbInst.close()
              resolve(
                row && typeof row.value === 'number' ? row.value : null,
              )
            }
            getReq.onerror = () => {
              dbInst.close()
              reject(getReq.error)
            }
          }
          req.onerror = () => reject(req.error)
        })
      },
      { dbName: DB_NAME },
    )
    expect(typeof completedAt).toBe('number')
    expect(completedAt).toBeGreaterThan(0)
  })

  test('existing tester (ExecutionLog + completedAt seeded) skips onboarding and lands on Home (H15)', async ({
    context,
    page,
  }) => {
    // Reset and seed v4 records directly (blank HTML origin so Dexie
    // doesn't auto-open and fight the seed).
    await gotoBlankOnAppOrigin(page)
    await clearOriginStorage(context, page)
    await gotoBlankOnAppOrigin(page)
    await seedV4ExistingTester(page, Date.now())

    // Navigate to the real app; FirstOpenGate should recognize the
    // sentinel and NOT bounce to /onboarding/*.
    await page.goto('/')
    await expect(page).toHaveURL(/\/$/)

    // Home headline ("Volley Drills") renders, and there is NO Skill
    // Level welcome preamble.
    await expect(
      page.getByRole('heading', { level: 1, name: /volley drills/i }),
    ).toBeVisible({ timeout: 10_000 })
    await expect(
      page.getByText(/welcome\. let.?s get you started\./i),
    ).toHaveCount(0)
  })
})
