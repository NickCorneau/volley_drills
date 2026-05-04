import { expect, test, type Page, type TestInfo } from '@playwright/test'
import { clearIndexedDB, goToOnboardingTodaysSetup } from './helpers'

test.describe('typography visual evidence matrix', () => {
  test.setTimeout(90_000)

  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto('/')
    await clearIndexedDB(page)
    await page.reload()
  })

  test('captures browser-verified typography surfaces across the main session path', async ({
    page,
  }, testInfo) => {
    await setupAndStart(page)

    await expect(page.getByText('Before we start')).toBeVisible()
    await attachScreenshot(page, testInfo, 'typography-safety-consequence')

    await passSafety(page)
    await waitForRunControls(page)
    await expect(page.getByRole('timer')).toBeVisible()
    await attachScreenshot(page, testInfo, 'typography-run-active')

    await completeCurrentBlock(page)
    await completeDrillCheckIfPresent(page)
    await startNextBlock(page)

    await completeCurrentBlock(page)
    await completeDrillCheckIfPresent(page)
    await startNextBlock(page)

    await completeCurrentBlock(page)
    await expect(page.getByTestId('per-drill-capture')).toBeVisible({ timeout: 10_000 })
    await attachScreenshot(page, testInfo, 'typography-run-check-helper')
    await completeDrillCheck(page)

    await startNextBlock(page)
    await completeCurrentBlock(page)

    await expect(page.getByRole('heading', { name: /quick review/i })).toBeVisible({
      timeout: 10_000,
    })
    await attachScreenshot(page, testInfo, 'typography-review-helper')

    await page.getByRole('radio', { name: /^right$/i }).click()
    await page.getByRole('button', { name: /^done$/i }).click()

    await expect(page.getByText('Session recap')).toBeVisible({ timeout: 10_000 })
    await attachScreenshot(page, testInfo, 'typography-complete-receipt')

    await page.goto('/')
    await expect(page.getByText(/last session/i)).toBeVisible({ timeout: 10_000 })
    await attachScreenshot(page, testInfo, 'typography-home-trust')
  })

  test('captures a blocked or recovery state', async ({ page }, testInfo) => {
    await page.goto('/review')
    await expect(page.getByText(/missing session|session not found/i)).toBeVisible({ timeout: 10_000 })
    await attachScreenshot(page, testInfo, 'typography-review-recovery')
  })
})

async function setupAndStart(page: Page) {
  await goToOnboardingTodaysSetup(page)
  await expect(page.getByText("Today's setup")).toBeVisible()

  await page.getByRole('radio', { name: 'Solo' }).click()
  await page.getByLabel('Net available').getByRole('radio', { name: 'No' }).click()
  await page.getByLabel('Wall available').getByRole('radio', { name: 'No' }).click()
  await page.getByRole('radio', { name: '15 min' }).click()
  await page.getByRole('button', { name: /build session/i }).click()
  await expect(page.getByRole('heading', { name: /today.s focus/i })).toBeVisible()
  await page.getByRole('button', { name: /continue/i }).click()
}

async function passSafety(page: Page) {
  await page.getByRole('radio', { name: 'No' }).click()
  await page.locator('button', { hasText: 'Yesterday' }).click()
  await page.getByRole('button', { name: /start session/i }).click()
}

async function waitForRunControls(page: Page) {
  const pause = page.getByRole('button', { name: /pause/i })
  const startNext = page.getByRole('button', { name: /start next block/i })

  await expect(pause.or(startNext)).toBeVisible({ timeout: 15_000 })

  if (await startNext.isVisible()) {
    await startNext.click()
    await expect(pause).toBeVisible({ timeout: 10_000 })
  }
}

async function completeCurrentBlock(page: Page) {
  await waitForRunControls(page)
  await page.getByRole('button', { name: /^next$/i }).click()
}

async function startNextBlock(page: Page) {
  const startNext = page.getByRole('button', { name: /start next block/i })
  await expect(startNext).toBeVisible({ timeout: 10_000 })
  await startNext.click()
  await expect(startNext).toBeHidden({ timeout: 5_000 })
}

async function completeDrillCheck(page: Page) {
  await expect(page.getByTestId('per-drill-capture')).toBeVisible({ timeout: 10_000 })
  await page.getByRole('radio', { name: /still learning/i }).click()
  await page.getByRole('button', { name: /^continue$/i }).click()
}

async function completeDrillCheckIfPresent(page: Page) {
  const drillCheck = page.getByTestId('per-drill-capture')
  try {
    await expect(drillCheck).toBeVisible({ timeout: 5_000 })
  } catch {
    return
  }
  await page.getByRole('radio', { name: /still learning/i }).click()
  await page.getByRole('button', { name: /^continue$/i }).click()
}

async function attachScreenshot(page: Page, testInfo: TestInfo, name: string) {
  const path = testInfo.outputPath(`${name}.png`)
  await page.screenshot({ fullPage: false, path })
  await testInfo.attach(name, { path, contentType: 'image/png' })
}
