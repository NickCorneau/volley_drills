import { test, expect } from '@playwright/test'

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

async function setupAndStart(
  page: import('@playwright/test').Page,
  opts: { net?: boolean; wall?: boolean; time?: string } = {},
) {
  const { net = false, wall = false, time = '15 min' } = opts

  await page.getByRole('button', { name: /start.*workout/i }).click()
  await expect(page.getByText("Today's Setup")).toBeVisible()

  await page.getByRole('radio', { name: 'Solo' }).click()
  await page.getByLabel('Net available').getByRole('radio', { name: net ? 'Yes' : 'No' }).click()
  await page.getByLabel('Wall available').getByRole('radio', { name: wall ? 'Yes' : 'No' }).click()
  await page.getByRole('radio', { name: time }).click()
  await page.getByRole('button', { name: /build session/i }).click()

  await expect(page.getByText('Before we start')).toBeVisible()
}

async function passSafety(page: import('@playwright/test').Page) {
  await page.getByRole('button', { name: 'No' }).click()
  await page.locator('button', { hasText: '1 day' }).click()
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

async function endSessionEarly(page: import('@playwright/test').Page) {
  await waitForRunControls(page)
  await page.getByRole('button', { name: /pause/i }).click()
  await page.getByRole('button', { name: /end session/i }).first().click()
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
    await expect(page.getByRole('button', { name: /start first workout/i })).toBeVisible()
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
    await expect(page.getByText(/unreviewed session/i)).toBeVisible({ timeout: 5000 })
    await expect(page.getByRole('button', { name: /finish review/i })).toBeVisible()
  })
})
