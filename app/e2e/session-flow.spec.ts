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
  await page
    .getByLabel('Wall available')
    .getByRole('radio', { name: wall ? 'Yes' : 'No' })
    .click()
  await page.getByRole('radio', { name: time }).click()
  await page.getByRole('button', { name: /build session/i }).click()

  await expect(page.getByText('Before we start')).toBeVisible()
}

async function passSafety(page: import('@playwright/test').Page) {
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

async function completeCurrentBlock(page: import('@playwright/test').Page) {
  await waitForRunControls(page)
  await page.getByRole('button', { name: /^next$/i }).click()
}

async function startNextBlock(page: import('@playwright/test').Page) {
  const startNext = page.getByRole('button', { name: /start next block/i })
  await expect(startNext).toBeVisible({ timeout: 10_000 })
  await startNext.click()
  await expect(startNext).toBeHidden({ timeout: 5_000 })
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
  await waitForRunControls(page)
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
    await expect(page.getByText(/Solo \+ Open/)).toBeVisible()
    await passSafety(page)
    await waitForRunControls(page)
  })

  test('solo+net selects the Solo + Net archetype', async ({ page }) => {
    await setupAndStart(page, { net: true, time: '25 min' })
    await expect(page.getByText(/Solo \+ Net/)).toBeVisible()
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
    // Warmup bypasses Drill Check; count-eligible support slots may now
    // capture there too, and main_skill always renders the capture beat.
    await completeCurrentBlock(page)
    await completeDrillCheckIfPresent(page)
    await startNextBlock(page)

    await completeCurrentBlock(page)
    await completeDrillCheckIfPresent(page)
    await startNextBlock(page)

    await completeCurrentBlock(page)
    await completeDrillCheck(page)

    await startNextBlock(page)
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
