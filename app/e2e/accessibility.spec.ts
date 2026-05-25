import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
import { clearIndexedDB, seedOnboardingAndOpenHome } from './helpers'

async function checkA11y(page: import('@playwright/test').Page, label: string) {
  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
    .analyze()

  const summary = results.violations.map(
    (v) => `[${v.impact}] ${v.id}: ${v.help} (${v.nodes.length} nodes)`,
  )
  expect(summary, `a11y violations on "${label}"`).toEqual([])
}

test.describe('accessibility – WCAG 2.1 AA', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await clearIndexedDB(page)
    await page.reload()
  })

  test('onboarding – skill level (first-run)', async ({ page }) => {
    // D128: cold-state heading is solo voice.
    await expect(page.getByRole('heading', { name: /where are you today/i })).toBeVisible()
    await checkA11y(page, 'onboarding – skill level')
  })

  test('home screen (new user, onboarding complete)', async ({ page }) => {
    await seedOnboardingAndOpenHome(page)
    await expect(page.getByRole('button', { name: /start first session/i })).toBeVisible()
    await checkA11y(page, 'home – new user')
  })

  test('setup screen', async ({ page }) => {
    await seedOnboardingAndOpenHome(page)
    await page.getByRole('button', { name: /start.*session/i }).click()
    await expect(page.getByText("Today's setup")).toBeVisible()
    await checkA11y(page, 'setup')
  })

  test('safety check screen', async ({ page }) => {
    await seedOnboardingAndOpenHome(page)
    await page.getByRole('button', { name: /start.*session/i }).click()
    await page.getByRole('radio', { name: 'Solo' }).click()
    await page.getByLabel('Net available').getByRole('radio', { name: 'No' }).click()
    await page
      .getByRole('radiogroup', { name: /wall or fence nearby/i })
      .getByRole('radio', { name: 'No' })
      .click()
    await page.getByRole('radio', { name: '15 min' }).click()
    await page.getByRole('button', { name: /build session/i }).click()

    await expect(page.getByText('Before we start')).toBeVisible()
    await checkA11y(page, 'safety check')
  })

  // Audit 2026-05-24 (M1 / A6): the scans above only exercise the
  // *unselected* default, so they never caught that a selected
  // `warning`-tone ToggleChip rendered `text-warning` (#dc2626) on
  // `bg-warning-surface` (#fee2e2) at ~3.95:1 — below the WCAG 2.1 AA
  // 4.5:1 floor. These two tests pin the *selected* and *conditional*
  // warning states so the regression class fails loudly if the
  // `--color-warning-strong` wiring is ever reverted.
  async function goToSafety(page: import('@playwright/test').Page) {
    await seedOnboardingAndOpenHome(page)
    await page.getByRole('button', { name: /start.*session/i }).click()
    await page.getByRole('radio', { name: 'Solo' }).click()
    await page.getByLabel('Net available').getByRole('radio', { name: 'No' }).click()
    await page
      .getByRole('radiogroup', { name: /wall or fence nearby/i })
      .getByRole('radio', { name: 'No' })
      .click()
    await page.getByRole('radio', { name: '15 min' }).click()
    await page.getByRole('button', { name: /build session/i }).click()
    await expect(page.getByText('Before we start')).toBeVisible()
  }

  test('safety – selected warning-tone chip', async ({ page }) => {
    await goToSafety(page)
    // "Today" is the `0 days` recency chip — the one chip rendered with
    // `tone="warning"`. Selecting it puts a selected-warning chip on
    // screen for axe to scan.
    const today = page
      .getByRole('radiogroup', { name: /When did you last train/i })
      .getByRole('radio', { name: 'Today' })
    await today.click()
    await expect(today).toHaveAttribute('aria-checked', 'true')
    await checkA11y(page, 'safety – selected warning chip')
  })

  test('safety – pain override confirm state', async ({ page }) => {
    await goToSafety(page)
    // Recency must be answered first, otherwise `canAct` is false and the
    // override-confirm UI (the danger button + consequence copy) never
    // renders (`isConfirming = confirming && canAct`).
    await page
      .getByRole('radiogroup', { name: /When did you last train/i })
      .getByRole('radio', { name: 'Yesterday' })
      .click()
    await page
      .getByRole('radiogroup', { name: /Sharp pain or guarding/i })
      .getByRole('radio', { name: 'Yes' })
      .click()
    await page.getByRole('button', { name: /Override: use my original session/i }).click()
    // Reveals the `text-warning`-class danger button + consequence copy
    // on the warning-surface Callout.
    await expect(page.getByRole('button', { name: /Yes, use original session/i })).toBeVisible()
    await checkA11y(page, 'safety – pain override confirm')
  })

  test('safety – heat & safety tips expanded', async ({ page }) => {
    await goToSafety(page)
    // The expanded panel is a warning-tone Callout (bg-warning-surface)
    // whose "Stop immediately if you notice:" heading is text-warning(-strong).
    await page.getByRole('button', { name: /heat & safety tips/i }).click()
    await expect(page.getByText(/stop immediately if you notice/i)).toBeVisible()
    await checkA11y(page, 'safety – heat tips expanded')
  })

  // Drives a real run to the paused state, where the destructive
  // "End session" control + its confirm modal use the Button `danger`
  // variant (bg-warning-surface + warning text) — another state the
  // default scans never reached.
  async function goToRunPaused(page: import('@playwright/test').Page) {
    await goToSafety(page)
    await page
      .getByRole('radiogroup', { name: /Sharp pain or guarding/i })
      .getByRole('radio', { name: 'No' })
      .click()
    await page
      .getByRole('radiogroup', { name: /When did you last train/i })
      .getByRole('radio', { name: 'Yesterday' })
      .click()
    await page.getByRole('button', { name: /^Start session$/i }).click()

    const pause = page.getByRole('button', { name: /pause/i })
    const startNext = page.getByRole('button', { name: /start next block/i })
    await expect(pause.or(startNext)).toBeVisible({ timeout: 15_000 })
    if (await startNext.isVisible()) {
      await startNext.click()
      await expect(pause).toBeVisible({ timeout: 10_000 })
    }
    await pause.click()
    await expect(page.getByText('Paused', { exact: true })).toBeVisible()
  }

  test('run – end session confirm modal', async ({ page }) => {
    await goToRunPaused(page)
    await page.getByRole('button', { name: /end session/i }).click()
    await expect(page.getByRole('heading', { name: /end session early/i })).toBeVisible()
    await checkA11y(page, 'run – end session confirm')
  })

  test('run screen', async ({ page }) => {
    await seedOnboardingAndOpenHome(page)
    await page.getByRole('button', { name: /start.*session/i }).click()
    await page.getByRole('radio', { name: 'Solo' }).click()
    await page.getByLabel('Net available').getByRole('radio', { name: 'No' }).click()
    await page
      .getByRole('radiogroup', { name: /wall or fence nearby/i })
      .getByRole('radio', { name: 'No' })
      .click()
    await page.getByRole('radio', { name: '15 min' }).click()
    await page.getByRole('button', { name: /build session/i }).click()

    await page
      .getByRole('radiogroup', { name: /Sharp pain or guarding/i })
      .getByRole('radio', { name: 'No' })
      .click()
    await page
      .getByRole('radiogroup', { name: /When did you last train/i })
      .getByRole('radio', { name: 'Yesterday' })
      .click()
    await page.getByRole('button', { name: /^Start session$/i }).click()

    const pause = page.getByRole('button', { name: /pause/i })
    const startNext = page.getByRole('button', { name: /start next block/i })
    await expect(pause.or(startNext)).toBeVisible({ timeout: 15_000 })

    if (await startNext.isVisible()) {
      await startNext.click()
      await expect(pause).toBeVisible({ timeout: 10_000 })
    }

    await checkA11y(page, 'run – active')
  })

  test('run screen – paused state', async ({ page }) => {
    await seedOnboardingAndOpenHome(page)
    await page.getByRole('button', { name: /start.*session/i }).click()
    await page.getByRole('radio', { name: 'Solo' }).click()
    await page.getByLabel('Net available').getByRole('radio', { name: 'No' }).click()
    await page
      .getByRole('radiogroup', { name: /wall or fence nearby/i })
      .getByRole('radio', { name: 'No' })
      .click()
    await page.getByRole('radio', { name: '15 min' }).click()
    await page.getByRole('button', { name: /build session/i }).click()

    await page
      .getByRole('radiogroup', { name: /Sharp pain or guarding/i })
      .getByRole('radio', { name: 'No' })
      .click()
    await page
      .getByRole('radiogroup', { name: /When did you last train/i })
      .getByRole('radio', { name: 'Yesterday' })
      .click()
    await page.getByRole('button', { name: /^Start session$/i }).click()

    const pause = page.getByRole('button', { name: /pause/i })
    const startNext = page.getByRole('button', { name: /start next block/i })
    await expect(pause.or(startNext)).toBeVisible({ timeout: 15_000 })

    if (await startNext.isVisible()) {
      await startNext.click()
      await expect(pause).toBeVisible({ timeout: 10_000 })
    }

    await pause.click()
    await expect(page.getByText('Paused', { exact: true })).toBeVisible()
    await checkA11y(page, 'run – paused')
  })

  test('error state – /run without session', async ({ page }) => {
    await page.goto('/run')
    await expect(page.getByText(/session not found/i)).toBeVisible()
    await checkA11y(page, 'error – no session')
  })

  test('complete screen – solo submitted verdict', async ({ page }) => {
    // Founder test-run pass 2026-04-21 (round 2): the CompleteScreen
    // wasn't covered by the axe spec. The round-2 redesign moves the
    // `<h1>` eyebrow into a three-column top bar with an
    // `aria-hidden` invisible spacer on the right. Pin the surface
    // here so any future regression (unlabeled spacer, heading-order
    // skip, low-contrast verdict text) fails loudly. Seed a minimal
    // completed session + submitted review directly via IndexedDB,
    // then navigate straight to /complete so the test isn't hostage
    // to the full run loop.
    await seedOnboardingAndOpenHome(page)
    const execId = 'a11y-complete-solo'
    await page.evaluate(
      async ({ dbName, execId }) => {
        await new Promise<void>((resolve, reject) => {
          const open = indexedDB.open(dbName)
          open.onsuccess = () => {
            const dbInst = open.result
            const stores = ['sessionPlans', 'executionLogs', 'sessionReviews'] as const
            if (!stores.every((s) => dbInst.objectStoreNames.contains(s))) {
              dbInst.close()
              resolve()
              return
            }
            const tx = dbInst.transaction([...stores], 'readwrite')
            const now = Date.now()
            tx.objectStore('sessionPlans').put({
              id: `plan-${execId}`,
              presetId: 'solo_wall',
              presetName: 'Solo + Wall',
              playerCount: 1,
              blocks: [
                {
                  id: 'b-1',
                  type: 'main_skill',
                  drillName: 'Passing',
                  shortName: 'Pass',
                  durationMinutes: 15,
                  coachingCue: '',
                  courtsideInstructions: '',
                  required: true,
                },
              ],
              safetyCheck: {
                painFlag: false,
                heatCta: false,
                painOverridden: false,
              },
              createdAt: now - 60_000,
            })
            tx.objectStore('executionLogs').put({
              id: execId,
              planId: `plan-${execId}`,
              status: 'completed',
              activeBlockIndex: 1,
              blockStatuses: [{ blockId: 'b-1', status: 'completed' }],
              startedAt: now - 20 * 60_000,
              completedAt: now - 5 * 60_000,
            })
            tx.objectStore('sessionReviews').put({
              id: `review-${execId}`,
              executionLogId: execId,
              sessionRpe: 6,
              goodPasses: 40,
              totalAttempts: 60,
              submittedAt: now,
              status: 'submitted',
            })
            tx.oncomplete = () => {
              dbInst.close()
              resolve()
            }
            tx.onerror = () => {
              reject(tx.error)
              dbInst.close()
            }
          }
          open.onerror = () => reject(open.error)
        })
      },
      { dbName: 'volley-drills', execId },
    )

    await page.goto(`/complete?id=${execId}`)
    // 2026-04-26 pre-D91 editorial polish (`F10`): the solo eyebrow
    // `Today's verdict` <h1> was dropped to let the verdict word
    // stand alone (the eyebrow was redundant with the giant <h2>
    // verdict word below). Pair sessions still render the
    // `Today's pair verdict` <h1>. On solo, the verdict <h2>
    // remains the focal heading; the page is a valid single-
    // heading-outline page (HTML5 permits `<h2>` as the document's
    // top heading). a11y scan must continue to pass with this
    // structure.
    await expect(page.getByRole('heading', { name: /today's verdict/i, level: 1 })).toHaveCount(0)
    await expect(page.getByRole('heading', { name: /keep building/i, level: 2 })).toBeVisible()
    await checkA11y(page, 'complete – solo submitted verdict')
  })
})
