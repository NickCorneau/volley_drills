import { expect, test, type Page } from '@playwright/test'
import { clearIndexedDB, seedOnboardingAndOpenHome } from './helpers'

/**
 * Post-D158 Home plan-path Playwright smoke (formerly
 * phase-c5-repeat.spec.ts — the Repeat cases were retired with the
 * affordance itself, D158 2026-06-12).
 *
 * Cases covered:
 * 1. Plan CTA: Home LastComplete renders the v2-04 plan-only card
 *    (Recommended eyebrow + "Start {focus} session" focal CTA) and NO
 *    repeat buttons. The CTA routes to /safety directly (pain/recency
 *    default per D83) → /run. The draft is rebuilt silently from the
 *    last plan's SetupContext, steered to the plan's next focus.
 * 2. Start a different session (Phase F Unit 1, page-level since
 *    D158): the quiet link below the focal cluster routes to fresh
 *    `/setup` (no banner, physical chips pre-filled silently). This is
 *    the explicit escape when today's conditions actually changed.
 *
 * Seeding happens via `page.evaluate` after the first `/` navigation so
 * the Dexie schema is already in place; no version gymnastics like
 * phase-c0 needs.
 */

const DB_NAME = 'volley-drills'

async function seedLastComplete(page: Page): Promise<void> {
  await page.evaluate(
    ({ name }) => {
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
            status: 'completed',
            activeBlockIndex: 0,
            blockStatuses: blocks.map((b) => ({
              blockId: b.id,
              status: 'completed' as const,
            })),
            startedAt: twoDaysAgo - 20 * 60_000,
            completedAt: twoDaysAgo,
          })

          tx.objectStore('sessionReviews').put({
            id: 'review-exec-c5-smoke',
            executionLogId: 'exec-c5-smoke',
            sessionRpe: 5,
            goodPasses: 10,
            totalAttempts: 15,
            submittedAt: twoDaysAgo,
            status: 'submitted',
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
    { name: DB_NAME },
  )
}

test.describe('phase-c5 home plan path', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await clearIndexedDB(page)
    await page.reload()
    // Seed onboarding so FirstOpenGate routes to Home, not /onboarding/*.
    await seedOnboardingAndOpenHome(page)
  })

  test('plan CTA: Start {focus} session -> /safety (defaults per D83) -> /run', async ({
    page,
  }) => {
    await seedLastComplete(page)
    await page.reload()

    // v2-04 plan-only card: focal CTA inside the "Train again" region.
    const card = page.getByRole('region', { name: /train again/i })
    const startPlan = card.getByRole('button', { name: /^start \w+ session$/i })
    await expect(startPlan).toBeVisible({ timeout: 10_000 })

    // D158: every repeat affordance is retired — nothing on the page
    // may offer a Repeat action.
    await expect(page.getByRole('button', { name: /repeat/i })).toHaveCount(0)

    await startPlan.click()

    // Direct to /safety, no Setup detour, no banner. The draft was
    // rebuilt silently from the last plan's SetupContext.
    await expect(page).toHaveURL(/\/safety/, { timeout: 10_000 })
    await expect(page.getByRole('status')).toHaveCount(0)

    // /safety: pain + recency are in default state — the plan shortcut
    // must not leak any prior safety answers (D83 contract).
    await expect(page.getByText(/before we start/i)).toBeVisible()
    await expect(page.getByRole('button', { name: /^start session$/i })).toBeDisabled()

    // Answer safety and proceed to /run.
    await page.getByRole('radio', { name: /^no$/i }).click()
    await page.getByRole('radio', { name: /^yesterday$/i }).click()
    await page.getByRole('button', { name: /^start session$/i }).click()
    // /run uses a query-string id (`/run?id=...`) in v0b, not a path segment.
    await expect(page).toHaveURL(/\/run\?id=/, { timeout: 15_000 })
  })

  test('Start a different session: page-level link routes to fresh /setup', async ({
    page,
  }) => {
    await seedLastComplete(page)
    await page.reload()

    // The escape link is page-level (outside the card) since D158; the
    // card itself carries only the plan.
    const card = page.getByRole('region', { name: /train again/i })
    await expect(
      card.getByRole('button', { name: /^start \w+ session$/i }),
    ).toBeVisible({ timeout: 10_000 })
    const different = page.getByRole('button', { name: /start a different session/i })
    await expect(different).toBeVisible()

    await different.click()

    // Lands on fresh /setup (no banner) — Setup reads the last context
    // silently as a pre-fill convenience only.
    await expect(page).toHaveURL(/\/setup$/, { timeout: 10_000 })
    await expect(page.getByRole('status')).toHaveCount(0)
  })
})
