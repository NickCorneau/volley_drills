import { test, expect } from '@playwright/test'
import { goToOnboardingTodaysSetup } from './helpers'

/**
 * Phase A schema verification (V0B-12, V0B-23, V0B-29).
 *
 * Confirms in a real browser that:
 * - `ExecutionLog.actualDurationMinutes` is persisted to IndexedDB when
 *   a session ends early (V0B-23).
 * - `SessionReview.borderlineCount` and `SessionReview.drillScores`
 *   round-trip through Dexie when present (V0B-12, V0B-29).
 *
 * Unit tests cover the logic; these specs guard against real-browser
 * Dexie / structured-clone surprises that `fake-indexeddb` may not catch.
 */

interface ExecutionLogShape {
  id: string
  status: string
  actualDurationMinutes?: number
  startedAt: number
  completedAt?: number
}

interface SessionReviewShape {
  id: string
  executionLogId: string
  borderlineCount?: number
  drillScores?: Array<{
    drillId: string
    variantId: string
    goodPasses: number
    totalAttempts: number
  }>
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

async function writeSessionReviewDirect(
  page: import('@playwright/test').Page,
  review: SessionReviewShape & { sessionRpe: number; goodPasses: number; totalAttempts: number; submittedAt: number },
) {
  await page.evaluate((payload) => {
    return new Promise<void>((resolve, reject) => {
      const open = indexedDB.open('volley-drills')
      open.onsuccess = () => {
        const dbInst = open.result
        const tx = dbInst.transaction('sessionReviews', 'readwrite')
        const store = tx.objectStore('sessionReviews')
        const req = store.put(payload)
        req.onsuccess = () => {
          resolve()
          dbInst.close()
        }
        req.onerror = () => {
          reject(req.error)
          dbInst.close()
        }
      }
      open.onerror = () => reject(open.error)
    })
  }, review)
}

async function readSessionReview(
  page: import('@playwright/test').Page,
  id: string,
): Promise<SessionReviewShape | undefined> {
  return page.evaluate<SessionReviewShape | undefined, string>((reviewId) => {
    return new Promise((resolve, reject) => {
      const open = indexedDB.open('volley-drills')
      open.onsuccess = () => {
        const dbInst = open.result
        const tx = dbInst.transaction('sessionReviews', 'readonly')
        const store = tx.objectStore('sessionReviews')
        const req = store.get(reviewId)
        req.onsuccess = () => {
          resolve(req.result as SessionReviewShape | undefined)
          dbInst.close()
        }
        req.onerror = () => {
          reject(req.error)
          dbInst.close()
        }
      }
      open.onerror = () => reject(open.error)
    })
  }, id)
}

async function buildAndStartSoloOpen(page: import('@playwright/test').Page) {
  await goToOnboardingTodaysSetup(page)
  await page.getByRole('radio', { name: 'Solo' }).click()
  await page.getByLabel('Net available').getByRole('radio', { name: 'No' }).click()
  await page.getByLabel('Wall available').getByRole('radio', { name: 'No' }).click()
  await page.getByRole('radio', { name: '15 min' }).click()
  await page.getByRole('button', { name: /build session/i }).click()

  await page.getByRole('button', { name: 'No' }).click()
  await page.locator('button', { hasText: 'Yesterday' }).click()
  await page.getByRole('button', { name: 'Continue' }).click()
}

async function waitForRunControls(page: import('@playwright/test').Page) {
  const pause = page.getByRole('button', { name: /pause/i })
  const startNext = page.getByRole('button', { name: /start next block/i })

  await expect(pause.or(startNext)).toBeVisible({ timeout: 15_000 })

  if (await startNext.isVisible()) {
    await startNext.click()
    await expect(pause).toBeVisible({ timeout: 10_000 })
  }
}

test.describe('Phase A schema verification', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await clearIndexedDB(page)
    await page.reload()
  })

  test('actualDurationMinutes is persisted on ended-early ExecutionLog (V0B-23)', async ({ page }) => {
    await buildAndStartSoloOpen(page)
    await waitForRunControls(page)

    // Let the timer run briefly so there is something to measure.
    await page.waitForTimeout(2500)

    await page.getByRole('button', { name: /pause/i }).click()
    await page.getByRole('button', { name: /end session/i }).first().click()
    const confirmDialog = page.locator('.fixed')
    await confirmDialog.getByRole('button', { name: /end session/i }).click()
    await expect(page.getByText(/quick review/i)).toBeVisible({ timeout: 5000 })

    const logs = await readAllExecutionLogs(page)
    expect(logs.length).toBe(1)
    const log = logs[0]
    expect(log.status).toBe('ended_early')
    expect(log.actualDurationMinutes).toBeDefined()
    expect(typeof log.actualDurationMinutes).toBe('number')
    expect(log.actualDurationMinutes).toBeGreaterThanOrEqual(0)
    // Rounded to 0.1 minute granularity — value should have at most one decimal place.
    const scaled = (log.actualDurationMinutes ?? 0) * 10
    expect(Math.abs(scaled - Math.round(scaled))).toBeLessThan(1e-9)
  })

  test('borderlineCount and drillScores round-trip through real IndexedDB (V0B-12, V0B-29)', async ({ page }) => {
    // Phase A does not have a UI path for these fields yet (populated in Phase C).
    // This test writes a review directly through the real browser IndexedDB
    // to confirm the schema accepts and returns both fields intact.
    const reviewId = 'phase-a-schema-test-review'
    await writeSessionReviewDirect(page, {
      id: reviewId,
      executionLogId: 'phase-a-schema-test-exec',
      sessionRpe: 6,
      goodPasses: 12,
      totalAttempts: 18,
      borderlineCount: 3,
      drillScores: [
        { drillId: 'drill-a', variantId: 'var-1', goodPasses: 7, totalAttempts: 10 },
        { drillId: 'drill-b', variantId: 'var-2', goodPasses: 5, totalAttempts: 8 },
      ],
      submittedAt: Date.now(),
    })

    const readBack = await readSessionReview(page, reviewId)
    expect(readBack).toBeDefined()
    expect(readBack!.borderlineCount).toBe(3)
    expect(readBack!.drillScores).toHaveLength(2)
    expect(readBack!.drillScores![0]).toEqual({
      drillId: 'drill-a',
      variantId: 'var-1',
      goodPasses: 7,
      totalAttempts: 10,
    })
  })
})
