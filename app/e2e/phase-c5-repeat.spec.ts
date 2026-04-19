import { expect, test, type Page } from '@playwright/test'
import {
  clearIndexedDB,
  seedOnboardingAndOpenHome,
} from './helpers'

/**
 * Phase C-5 + Phase F Unit 1 Playwright smoke: repeat path end-to-end.
 *
 * Three cases covered (updated 2026-04-19 for Phase F):
 * 1. Normal Repeat: Home LastComplete → /setup (with stale-context banner)
 *    → /safety (pain/recency default per D83) → /run.
 * 2. Ended-early Repeat: Home shows BOTH buttons. "Repeat what you did"
 *    routes directly to /safety with a subset draft.
 * 3. Start a different session (Phase F Unit 1, 2026-04-19): Home
 *    tertiary text link on LastComplete routes to fresh `/setup` (no
 *    `?from=repeat`, no banner, no pre-fill). Replaces the pre-Phase-F
 *    `Same as last time` case which bypassed Setup entirely — that
 *    shortcut was cut per the 2026-04-19 red-team because it bypassed
 *    the StaleContextBanner's "Adjust if today's different" nudge.
 *
 * Seeding happens via `page.evaluate` after the first `/` navigation so
 * the Dexie v4 schema is already in place; no version gymnastics like
 * phase-c0 needs.
 */

const DB_NAME = 'volley-drills'

interface SeedOptions {
  ended_early?: boolean
}

async function seedLastComplete(
  page: Page,
  { ended_early = false }: SeedOptions = {},
): Promise<void> {
  await page.evaluate(
    ({ name, ended_early }) => {
      return new Promise<void>((resolve, reject) => {
        const open = indexedDB.open(name)
        open.onsuccess = () => {
          const dbInst = open.result
          const stores = ['sessionPlans', 'executionLogs', 'sessionReviews']
          for (const s of stores) {
            if (!dbInst.objectStoreNames.contains(s)) {
              dbInst.close()
              reject(new Error(`store missing: ${s}`))
              return
            }
          }

          const now = Date.now()
          const twoDaysAgo = now - 2 * 24 * 60 * 60 * 1000
          const tx = dbInst.transaction(stores, 'readwrite')

          const blocks = [
            {
              id: 'b-1',
              type: 'warmup',
              drillName: 'Warm up',
              shortName: 'Warm',
              durationMinutes: 3,
              coachingCue: '',
              courtsideInstructions: '',
              required: true,
            },
            {
              id: 'b-2',
              type: 'main_skill',
              drillName: 'Wall pass',
              shortName: 'Pass',
              durationMinutes: 11,
              coachingCue: '',
              courtsideInstructions: '',
              required: true,
            },
            {
              id: 'b-3',
              type: 'main_skill',
              drillName: 'Serve',
              shortName: 'Serve',
              durationMinutes: 11,
              coachingCue: '',
              courtsideInstructions: '',
              required: true,
            },
          ]

          tx.objectStore('sessionPlans').put({
            id: 'plan-c5-smoke',
            presetId: 'solo_wall',
            presetName: 'Solo + Wall',
            playerCount: 1,
            blocks,
            safetyCheck: {
              painFlag: false,
              heatCta: false,
              painOverridden: false,
            },
            context: {
              playerMode: 'solo',
              timeProfile: 25,
              netAvailable: false,
              wallAvailable: true,
            },
            createdAt: twoDaysAgo - 60_000,
          })

          tx.objectStore('executionLogs').put({
            id: 'exec-c5-smoke',
            planId: 'plan-c5-smoke',
            status: ended_early ? 'ended_early' : 'completed',
            activeBlockIndex: ended_early ? 2 : 0,
            blockStatuses: ended_early
              ? [
                  { blockId: 'b-1', status: 'completed' },
                  { blockId: 'b-2', status: 'completed' },
                  { blockId: 'b-3', status: 'skipped' },
                ]
              : blocks.map((b) => ({
                  blockId: b.id,
                  status: 'completed' as const,
                })),
            startedAt: twoDaysAgo - 20 * 60_000,
            completedAt: twoDaysAgo,
            ...(ended_early ? { endedEarlyReason: 'time' } : {}),
          })

          tx.objectStore('sessionReviews').put({
            id: 'review-exec-c5-smoke',
            executionLogId: 'exec-c5-smoke',
            sessionRpe: 5,
            goodPasses: 10,
            totalAttempts: 15,
            submittedAt: twoDaysAgo,
            status: 'submitted',
            ...(ended_early ? { incompleteReason: 'time' } : {}),
          })

          tx.oncomplete = () => {
            dbInst.close()
            resolve()
          }
          tx.onerror = () => {
            const err = tx.error
            dbInst.close()
            reject(err)
          }
        }
        open.onerror = () => reject(open.error)
      })
    },
    { name: DB_NAME, ended_early },
  )
}

test.describe('phase-c5 repeat path', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await clearIndexedDB(page)
    await page.reload()
    // Seed onboarding so FirstOpenGate routes to Home, not /onboarding/*.
    await seedOnboardingAndOpenHome(page)
  })

  test('normal case: Repeat -> /setup (banner) -> /safety (defaults) -> /run', async ({
    page,
  }) => {
    await seedLastComplete(page)
    await page.reload()

    await expect(
      page.getByRole('button', { name: /repeat this session/i }),
    ).toBeVisible({ timeout: 10_000 })

    await page.getByRole('button', { name: /repeat this session/i }).click()

    // /setup with the stale-context banner.
    await expect(page).toHaveURL(/\/setup\?from=repeat/)
    const banner = page.getByRole('status')
    await expect(banner).toBeVisible()
    await expect(banner).toHaveAttribute('aria-live', 'polite')
    await expect(banner).toContainText(/setup pre-?filled/i)

    // Context pre-filled: Solo / net=No / wall=Yes / 25 min.
    await expect(page.getByRole('radio', { name: 'Solo' })).toHaveAttribute(
      'aria-checked',
      'true',
    )

    await page.getByRole('button', { name: /build session/i }).click()

    // /safety: pain + recency are in default state. PainOverrideCard
    // and Continue button do not render until pain is answered.
    await expect(page.getByText(/any pain that changes/i)).toBeVisible()
    await expect(
      page.getByRole('button', { name: /^continue$/i }),
    ).toHaveCount(0)

    // Answer safety and proceed to /run.
    await page.getByRole('button', { name: 'No' }).click()
    await page.locator('button', { hasText: '1 day' }).click()
    await page.getByRole('button', { name: 'Continue' }).click()
    // /run uses a query-string id (`/run?id=...`) in v0b, not a path segment.
    await expect(page).toHaveURL(/\/run\?id=/, { timeout: 15_000 })
  })

  test('ended-early: card shows TWO buttons and "Repeat what you did" routes to /safety', async ({
    page,
  }) => {
    await seedLastComplete(page, { ended_early: true })
    await page.reload()

    // Primary: Repeat full 25-min plan. Secondary: Repeat what you did (14 min).
    const full = page.getByRole('button', {
      name: /repeat full 25-min plan/i,
    })
    const partial = page.getByRole('button', {
      name: /repeat what you did \(14 min\)/i,
    })
    await expect(full).toBeVisible({ timeout: 10_000 })
    await expect(partial).toBeVisible()

    await partial.click()

    // Lands on /safety directly (skips Setup).
    await expect(page).toHaveURL(/\/safety/, { timeout: 10_000 })
    await expect(page.getByText(/any pain that changes/i)).toBeVisible()
  })

  test('Start a different session (Phase F Unit 1): tertiary link routes to fresh /setup', async ({
    page,
  }) => {
    await seedLastComplete(page)
    await page.reload()

    // LastComplete primary renders Repeat + the Phase F tertiary
    // "Start a different session" link. The pre-Phase-F `Edit` and
    // `Same as last time` affordances must NOT render — the single-
    // choice model (same-as-last or different) is the whole point of
    // the Phase F cleanup.
    await expect(
      page.getByRole('button', { name: /repeat this session/i }),
    ).toBeVisible({ timeout: 10_000 })
    await expect(
      page.getByRole('button', { name: /start a different session/i }),
    ).toBeVisible()
    await expect(
      page.getByRole('button', { name: /^edit$/i }),
    ).toHaveCount(0)
    await expect(
      page.getByRole('button', { name: /same as last time/i }),
    ).toHaveCount(0)

    await page
      .getByRole('button', { name: /start a different session/i })
      .click()

    // Lands on fresh /setup (no `?from=repeat`, no banner). The
    // stale-context banner must NOT render — this is the "today is
    // different" path.
    await expect(page).toHaveURL(/\/setup$/, { timeout: 10_000 })
    await expect(page.getByRole('status')).toHaveCount(0)
  })
})
