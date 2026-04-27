import { test, expect } from '@playwright/test'
import { goToOnboardingTodaysSetup } from './helpers'

/**
 * Warm-offline PWA shell smoke (V0B-21).
 *
 * Proves in a real browser that:
 * - The PWA shell is served from the service-worker cache after going offline.
 * - Dexie data written during a session survives an offline reload.
 *
 * Mirrors the helper patterns used by `session-flow.spec.ts` and
 * `phase-a-schema.spec.ts`. Kept self-contained — no shared helpers between
 * spec files, matching the existing project convention.
 */

interface ExecutionLogShape {
  id: string
  status: string
  actualDurationMinutes?: number
  startedAt: number
  completedAt?: number
}

async function clearIndexedDB(page: import('@playwright/test').Page) {
  await page.evaluate(() => {
    const req = indexedDB.deleteDatabase('volley-drills')
    return new Promise<void>((resolve, reject) => {
      req.onsuccess = () => resolve()
      req.onerror = () => reject(req.error)
      req.onblocked = () => resolve()
    })
  })
}

async function readAllExecutionLogs(
  page: import('@playwright/test').Page,
): Promise<ExecutionLogShape[]> {
  return page.evaluate<ExecutionLogShape[]>(() => {
    return new Promise((resolve, reject) => {
      const open = indexedDB.open('volley-drills')
      open.onsuccess = () => {
        const dbInst = open.result
        const tx = dbInst.transaction('executionLogs', 'readonly')
        const store = tx.objectStore('executionLogs')
        const req = store.getAll()
        req.onsuccess = () => {
          resolve(req.result as ExecutionLogShape[])
          dbInst.close()
        }
        req.onerror = () => {
          reject(req.error)
          dbInst.close()
        }
      }
      open.onerror = () => reject(open.error)
    })
  })
}

async function waitForServiceWorkerControl(page: import('@playwright/test').Page) {
  // First load registers the SW; the second load is controlled by it. This is
  // standard PWA behaviour — `navigator.serviceWorker.controller` is null on
  // the very first navigation of a fresh origin.
  await page.evaluate(() => navigator.serviceWorker.ready)
  if (await page.evaluate(() => navigator.serviceWorker.controller === null)) {
    await page.reload()
  }
  await page.waitForFunction(() => navigator.serviceWorker.controller !== null, null, {
    timeout: 30_000,
  })
}

async function setupBuildAndEndEarly(page: import('@playwright/test').Page) {
  await goToOnboardingTodaysSetup(page)
  await expect(page.getByText("Today's setup")).toBeVisible()

  await page.getByRole('radio', { name: 'Solo' }).click()
  await page.getByLabel('Net available').getByRole('radio', { name: 'No' }).click()
  await page.getByLabel('Wall available').getByRole('radio', { name: 'No' }).click()
  await page.getByRole('radio', { name: '15 min' }).click()
  await page.getByRole('button', { name: /build session/i }).click()

  await expect(page.getByText('Before we start')).toBeVisible()
  await page.getByRole('button', { name: 'No' }).click()
  await page.locator('button', { hasText: 'Yesterday' }).click()
  await page.getByRole('button', { name: 'Continue' }).click()

  const pause = page.getByRole('button', { name: /pause/i })
  const startNext = page.getByRole('button', { name: /start next block/i })
  await expect(pause.or(startNext)).toBeVisible({ timeout: 15_000 })
  if (await startNext.isVisible()) {
    await startNext.click()
    await expect(pause).toBeVisible({ timeout: 10_000 })
  }

  await page.getByRole('button', { name: /pause/i }).click()
  await page
    .getByRole('button', { name: /end session/i })
    .first()
    .click()
  const confirmDialog = page.locator('.fixed')
  await confirmDialog.getByRole('button', { name: /end session/i }).click()
  await expect(page.getByText(/quick review/i)).toBeVisible({ timeout: 5000 })
}

test.describe('warm-offline PWA shell (V0B-21)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await clearIndexedDB(page)
    await page.reload()
  })

  test('shell and Dexie data survive offline reload after session end-early', async ({
    page,
    context,
  }) => {
    await waitForServiceWorkerControl(page)

    await setupBuildAndEndEarly(page)

    await page.goto('/')
    // C-4 (Surface 2): review-pending primary card renders "Review your
    // last session" + plan name instead of the pre-C-4 "unreviewed
    // session" sentence.
    await expect(page.getByText(/review your last session/i)).toBeVisible({ timeout: 5000 })
    await expect(page.getByRole('button', { name: /finish review/i })).toBeVisible()

    await context.setOffline(true)
    try {
      await page.reload()

      await expect(page.getByText(/Volleycraft/i)).toBeVisible({ timeout: 10_000 })
      // C-4 (Surface 2): see note above — review-pending primary card
      // uses "Review pending" eyebrow + plan name. Eyebrow voice was
      // tightened on 2026-04-26 (`F11`) to match the card's
      // `aria-label` and the SoftBlockModal copy; the original
      // "Review your last session" wording read as a polite
      // invitation instead of an unfinished-obligation state.
      await expect(page.getByText(/^Review pending$/)).toBeVisible({ timeout: 5000 })
      await expect(page.getByRole('button', { name: /finish review/i })).toBeVisible()

      const logs = await readAllExecutionLogs(page)
      expect(logs.length).toBeGreaterThanOrEqual(1)
      expect(logs[0].status).toBe('ended_early')
    } finally {
      // Restore connectivity so Playwright teardown does not hang on a network
      // request that can never complete.
      await context.setOffline(false)
    }
  })
})
