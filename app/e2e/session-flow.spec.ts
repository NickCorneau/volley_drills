import { test, expect } from '@playwright/test'
import { clearIndexedDB, goToOnboardingTodaysSetup } from './helpers'

async function setupAndStart(
  page: import('@playwright/test').Page,
  opts: { net?: boolean; wall?: boolean; time?: string } = {},
) {
  const { net = false, wall = false, time = '15 min' } = opts

  await goToOnboardingTodaysSetup(page)
  await expect(page.getByText("Today's setup")).toBeVisible()

  await page.getByRole('radio', { name: 'Solo' }).click()
  await page
    .getByLabel('Net available')
    .getByRole('radio', { name: net ? 'Yes' : 'No' })
    .click()
  if (!net) {
    await page
      .getByRole('radiogroup', { name: /wall or fence nearby/i })
      .getByRole('radio', { name: wall ? 'Yes' : 'No' })
      .click()
  }
  await page.getByRole('radio', { name: time }).click()
  await page.getByRole('button', { name: /build session/i }).click()

  await expect(page.getByText('Before we start')).toBeVisible()
}

async function passSafety(page: import('@playwright/test').Page) {
  await page.getByRole('radio', { name: 'No' }).click()
  await page.getByRole('radio', { name: 'Yesterday' }).click()
  await page.getByRole('button', { name: 'Start session' }).click()
}

async function waitForLiveBlock(page: import('@playwright/test').Page) {
  // The first block auto-prerolls straight into the live cockpit from
  // Safety, so the live control (Pause) is the readiness signal. The 15s
  // timeout covers the 3-2-1 count-in before Pause appears.
  await expect(page.getByRole('button', { name: /pause/i })).toBeVisible({ timeout: 15_000 })
}

async function completeCurrentBlock(page: import('@playwright/test').Page) {
  await waitForLiveBlock(page)
  await page.getByRole('button', { name: /^next$/i }).click()
}

async function startGetReadyBlock(page: import('@playwright/test').Page) {
  // Run-flow beat contract Stage 4 (D167): between blocks the athlete lands
  // on the read-first get-ready beat and taps Start (the forced Transition
  // hop is gone); the count-in then runs into the live block.
  const start = page.getByRole('button', { name: /^start$/i })
  await expect(start).toBeVisible({ timeout: 10_000 })
  await start.click()
  await waitForLiveBlock(page)
}

async function completeDrillCheck(page: import('@playwright/test').Page) {
  await expect(page.getByText('Drill check')).toBeVisible({ timeout: 10_000 })
  await page.getByRole('radio', { name: /still learning/i }).click()
  await page.getByRole('button', { name: /^continue$/i }).click()
}

async function completeDrillCheckIfPresent(page: import('@playwright/test').Page) {
  const drillCheck = page.getByText('Drill check')
  try {
    await expect(drillCheck).toBeVisible({ timeout: 1_000 })
  } catch {
    return
  }
  await page.getByRole('radio', { name: /still learning/i }).click()
  await page.getByRole('button', { name: /^continue$/i }).click()
}

async function endSessionEarly(page: import('@playwright/test').Page) {
  await waitForLiveBlock(page)
  await page.getByRole('button', { name: /pause/i }).click()
  await page
    .getByRole('button', { name: /end session/i })
    .first()
    .click()
  const confirmDialog = page.locator('.fixed')
  await confirmDialog.getByRole('button', { name: /end session/i }).click()
  await expect(page.getByText(/quick review/i)).toBeVisible({ timeout: 5000 })
}

test.describe('v0b session flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await clearIndexedDB(page)
    await page.reload()
  })

  test('new user can build and start a session', async ({ page }) => {
    // D128: cold-state heading is solo voice.
    await expect(page.getByRole('heading', { name: /where are you today/i })).toBeVisible()
    await setupAndStart(page)
    await passSafety(page)
    await waitForLiveBlock(page)
  })

  test('solo+net reaches safety without asking for a wall choice', async ({ page }) => {
    await setupAndStart(page, { net: true, time: '25 min' })
    await expect(page.getByText('Before we start')).toBeVisible()
  })

  test('end session early navigates to review', async ({ page }) => {
    await setupAndStart(page)
    await passSafety(page)
    await endSessionEarly(page)
  })

  test('returning user sees review prompt after ending a session', async ({ page }) => {
    await setupAndStart(page)
    await passSafety(page)
    await endSessionEarly(page)

    await page.goto('/')
    // C-4/F11: the review-pending primary card renders the tightened
    // "Review pending" eyebrow + the plan name.
    await expect(page.getByText(/^Review pending$/)).toBeVisible({ timeout: 5000 })
    await expect(page.getByRole('button', { name: /finish review/i })).toBeVisible()
  })

  test('can complete through Run, Drill Check, Review, and Complete', async ({ page }) => {
    await setupAndStart(page)
    await passSafety(page)

    // 15-min solo sessions run warmup -> technique -> main_skill -> wrap.
    // Block 0 (warmup) auto-starts from Safety and bypasses Drill Check.
    // Stage 4 (D167): every later block lands on the read-first get-ready
    // beat (Start tap) instead of the old forced Transition hop. Count-eligible
    // support slots may capture on Drill Check; main_skill always renders it.
    await completeCurrentBlock(page)
    await completeDrillCheckIfPresent(page)
    await startGetReadyBlock(page)

    await completeCurrentBlock(page)
    await completeDrillCheckIfPresent(page)
    await startGetReadyBlock(page)

    await completeCurrentBlock(page)
    await completeDrillCheck(page)
    await startGetReadyBlock(page)

    await completeCurrentBlock(page)

    await expect(page.getByRole('heading', { name: /quick review/i })).toBeVisible({
      timeout: 10_000,
    })
    await page.getByRole('radio', { name: /^right$/i }).click()
    await page.getByRole('button', { name: /^done$/i }).click()

    await expect(page.getByText('Session recap')).toBeVisible({ timeout: 10_000 })
    await expect(page.getByTestId('recap-difficulty')).toContainText(/still learning/i)
  })
})
