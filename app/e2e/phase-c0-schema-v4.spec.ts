import { test, expect, type BrowserContext, type Page } from '@playwright/test'

/**
 * Phase C-0 schema verification (D-C7 / A5 / H15).
 *
 * Real-browser proof that the v4 Dexie upgrade:
 * - backfills `SessionReview.status` from legacy `sessionRpe` values,
 *   preserving the critical `sessionRpe === 0 -> 'submitted'` edge,
 * - creates the `storageMeta` table,
 * - backfills `storageMeta.onboarding.completedAt` when an `ExecutionLog`
 *   exists (H15 defense-in-depth), and skips the onboarding backfill when
 *   no `ExecutionLog` is present.
 *
 * Unit tests cover the backfill logic directly against `fake-indexeddb`;
 * this spec catches real-browser IDB semantics the unit tests cannot.
 *
 * IDB semantics: to seed a v3 DB we need to reach the app's origin
 * WITHOUT the React bundle running (otherwise Dexie opens at the current
 * version and blocks the seed). We accomplish this by intercepting the
 * HTML document request via `page.route()` and serving a blank page on
 * the first navigation; the seed runs there, then we unroute and
 * navigate to `/` to trigger the real v4 upgrade.
 *
 * We also clear IndexedDB at the CDP level per test so accumulated state
 * from prior `npx playwright test` invocations (for example the elevated
 * version left by `blocked-schema.spec.ts`) cannot leak across specs.
 */

const DB_NAME = 'volley-drills'

async function clearOriginStorage(
  context: BrowserContext,
  page: Page,
): Promise<void> {
  const origin = new URL(page.url() !== 'about:blank' ? page.url() : 'http://127.0.0.1:4173').origin
  const client = await context.newCDPSession(page)
  try {
    await client.send('Storage.clearDataForOrigin', {
      origin,
      storageTypes: 'indexeddb',
    })
  } finally {
    await client.detach()
  }
}

async function gotoBlankOnAppOrigin(page: Page): Promise<void> {
  // Intercept the root document once so we land on the app's origin with
  // an empty HTML shell (no React bundle, no Dexie auto-open).
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

interface V3ReviewSeed {
  id: string
  executionLogId: string
  sessionRpe: number | null
  goodPasses: number
  totalAttempts: number
  submittedAt: number
}

interface V3ExecLogSeed {
  id: string
  planId: string
  status: string
  activeBlockIndex: number
  blockStatuses: unknown[]
  startedAt: number
  completedAt: number
}

async function seedV3Database(
  page: Page,
  {
    reviews,
    execLogs,
  }: { reviews: V3ReviewSeed[]; execLogs: V3ExecLogSeed[] },
): Promise<void> {
  await page.evaluate(
    async ({ dbName, reviews, execLogs }) => {
      // Step 1: open at version 3 and create the v3 store shape.
      const dbInstance = await new Promise<IDBDatabase>((resolve, reject) => {
        const req = indexedDB.open(dbName, 3)
        req.onupgradeneeded = () => {
          const dbInst = req.result
          dbInst.createObjectStore('sessionPlans', { keyPath: 'id' })
          const execs = dbInst.createObjectStore('executionLogs', {
            keyPath: 'id',
          })
          execs.createIndex('planId', 'planId')
          execs.createIndex('status', 'status')
          const r = dbInst.createObjectStore('sessionReviews', {
            keyPath: 'id',
          })
          r.createIndex('executionLogId', 'executionLogId')
          dbInst.createObjectStore('timerState', { keyPath: 'id' })
          dbInst.createObjectStore('sessionDrafts', { keyPath: 'id' })
        }
        req.onsuccess = () => resolve(req.result)
        req.onerror = () => reject(req.error)
      })

      // Step 2: seed review + exec log fixtures inside a single tx.
      await new Promise<void>((resolve, reject) => {
        const tx = dbInstance.transaction(
          ['sessionReviews', 'executionLogs'],
          'readwrite',
        )
        tx.oncomplete = () => resolve()
        tx.onerror = () => reject(tx.error)
        const reviewStore = tx.objectStore('sessionReviews')
        for (const r of reviews) reviewStore.put(r)
        const execStore = tx.objectStore('executionLogs')
        for (const e of execLogs) execStore.put(e)
      })

      // Step 3: close so the next page-load can run the v4 upgrade.
      dbInstance.close()
    },
    { dbName: DB_NAME, reviews, execLogs },
  )
}

async function waitForV4(page: Page): Promise<void> {
  await page.waitForFunction(
    async (dbName) => {
      const version = await new Promise<number>((resolve, reject) => {
        const req = indexedDB.open(dbName)
        req.onsuccess = () => {
          const v = req.result.version
          req.result.close()
          resolve(v)
        }
        req.onerror = () => reject(req.error)
      })
      return version === 4
    },
    DB_NAME,
    { timeout: 5000 },
  )
}

async function readAllReviews(page: Page): Promise<
  Array<{ id: string; status?: string; sessionRpe: number | null }>
> {
  return page.evaluate((dbName) => {
    return new Promise((resolve, reject) => {
      const open = indexedDB.open(dbName)
      open.onsuccess = () => {
        const dbInst = open.result
        const tx = dbInst.transaction('sessionReviews', 'readonly')
        const store = tx.objectStore('sessionReviews')
        const req = store.getAll()
        req.onsuccess = () => {
          resolve(
            (req.result as Array<{
              id: string
              status?: string
              sessionRpe: number | null
            }>),
          )
          dbInst.close()
        }
        req.onerror = () => {
          reject(req.error)
          dbInst.close()
        }
      }
      open.onerror = () => reject(open.error)
    })
  }, DB_NAME)
}

async function readStorageMetaKey(
  page: Page,
  key: string,
): Promise<{ key: string; value: unknown; updatedAt: number } | undefined> {
  return page.evaluate(
    ({ dbName, key }) => {
      return new Promise<
        { key: string; value: unknown; updatedAt: number } | undefined
      >((resolve, reject) => {
        const open = indexedDB.open(dbName)
        open.onsuccess = () => {
          const dbInst = open.result
          if (!dbInst.objectStoreNames.contains('storageMeta')) {
            dbInst.close()
            resolve(undefined)
            return
          }
          const tx = dbInst.transaction('storageMeta', 'readonly')
          const store = tx.objectStore('storageMeta')
          const req = store.get(key)
          req.onsuccess = () => {
            resolve(
              req.result as
                | { key: string; value: unknown; updatedAt: number }
                | undefined,
            )
            dbInst.close()
          }
          req.onerror = () => {
            reject(req.error)
            dbInst.close()
          }
        }
        open.onerror = () => reject(open.error)
      })
    },
    { dbName: DB_NAME, key },
  )
}

test.describe('Phase C-0 schema v4 migration', () => {
  test.beforeEach(async ({ context, page }) => {
    // Land on the app origin via a blank shell so IndexedDB is reachable
    // without the React bundle opening Dexie.
    await gotoBlankOnAppOrigin(page)
    // Wipe any IDB state accumulated from prior spec runs (blocked-schema
    // leaves the DB at version 99; other specs leave it at v4 with
    // records).
    await clearOriginStorage(context, page)
  })

  test('backfills SessionReview.status and storageMeta.onboarding.completedAt when ExecutionLog exists', async ({
    page,
  }) => {
    const now = 1_700_000_000_000
    await seedV3Database(page, {
      reviews: [
        {
          id: 'review-rpe-5',
          executionLogId: 'exec-rpe-5',
          sessionRpe: 5,
          goodPasses: 10,
          totalAttempts: 15,
          submittedAt: now,
        },
        {
          id: 'review-rpe-0',
          executionLogId: 'exec-rpe-0',
          sessionRpe: 0,
          goodPasses: 0,
          totalAttempts: 3,
          submittedAt: now,
        },
        {
          id: 'review-rpe-null',
          executionLogId: 'exec-rpe-null',
          sessionRpe: null,
          goodPasses: 0,
          totalAttempts: 0,
          submittedAt: now,
        },
        {
          id: 'review-rpe-neg1',
          executionLogId: 'exec-rpe-neg1',
          sessionRpe: -1,
          goodPasses: 0,
          totalAttempts: 0,
          submittedAt: now,
        },
      ],
      execLogs: [
        {
          id: 'exec-seed',
          planId: 'plan-seed',
          status: 'completed',
          activeBlockIndex: 0,
          blockStatuses: [],
          startedAt: now - 60_000,
          completedAt: now,
        },
      ],
    })

    await page.reload()
    await waitForV4(page)

    const reviews = await readAllReviews(page)
    const byId = new Map(reviews.map((r) => [r.id, r]))

    expect(byId.get('review-rpe-5')?.status).toBe('submitted')
    expect(byId.get('review-rpe-0')?.status).toBe('submitted')
    expect(byId.get('review-rpe-null')?.status).toBe('skipped')
    expect(byId.get('review-rpe-neg1')?.status).toBe('skipped')

    const completedAt = await readStorageMetaKey(
      page,
      'onboarding.completedAt',
    )
    expect(completedAt).toBeDefined()
    expect(typeof completedAt?.value).toBe('number')
  })

  test('does NOT backfill onboarding.completedAt when no ExecutionLog exists', async ({
    page,
  }) => {
    const now = 1_700_000_000_000
    await seedV3Database(page, {
      reviews: [
        {
          id: 'review-solo',
          executionLogId: 'exec-solo',
          sessionRpe: 7,
          goodPasses: 4,
          totalAttempts: 6,
          submittedAt: now,
        },
      ],
      execLogs: [],
    })

    await page.reload()
    await waitForV4(page)

    const completedAt = await readStorageMetaKey(
      page,
      'onboarding.completedAt',
    )
    expect(completedAt).toBeUndefined()

    const reviews = await readAllReviews(page)
    expect(reviews[0]?.status).toBe('submitted')
  })
})
