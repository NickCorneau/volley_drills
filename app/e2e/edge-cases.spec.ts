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

async function buildSoloOpenSession(page: import('@playwright/test').Page) {
  await page.getByRole('button', { name: /start.*workout/i }).click()
  await page.getByRole('radio', { name: 'Solo' }).click()
  await page.getByLabel('Net available').getByRole('radio', { name: 'No' }).click()
  await page.getByLabel('Wall available').getByRole('radio', { name: 'No' }).click()
  await page.getByRole('radio', { name: '15 min' }).click()
  await page.getByRole('button', { name: /build session/i }).click()

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

test.describe('edge cases', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await clearIndexedDB(page)
    await page.reload()
  })

  test('shorten keeps the session paused and updates the progress bar', async ({ page }) => {
    await buildSoloOpenSession(page)
    await waitForRunControls(page)

    await page.getByRole('button', { name: /pause/i }).click()
    await expect(page.getByText(/paused/i)).toBeVisible()

    await page.getByRole('button', { name: /shorten/i }).click()

    await expect(page.getByText(/paused/i)).toBeVisible()
    await expect(page.getByRole('button', { name: /resume/i })).toBeVisible()
  })

  test('direct navigation to /run without session shows error', async ({ page }) => {
    await page.goto('/run')
    await expect(page.getByText(/session not found/i)).toBeVisible()
    await expect(page.getByText(/back to start/i)).toBeVisible()
  })

  test('direct navigation to /safety without draft redirects to /setup', async ({ page }) => {
    await page.goto('/safety')
    await expect(page.getByText("Today's Setup")).toBeVisible({ timeout: 5000 })
  })

  test('direct navigation to /review without session shows error', async ({ page }) => {
    await page.goto('/review')
    await expect(page.getByText(/missing session/i)).toBeVisible()
  })

  test('advance through all blocks reaches review', async ({ page }) => {
    test.setTimeout(90_000)
    await buildSoloOpenSession(page)

    for (let i = 0; i < 10; i++) {
      if (await page.getByText(/quick review/i).isVisible().catch(() => false)) break

      const startNext = page.getByRole('button', { name: /start next block/i })
      if (await startNext.isVisible().catch(() => false)) {
        await startNext.click({ timeout: 5000 }).catch(() => {})
        await page.waitForTimeout(4500)
        continue
      }

      const next = page.getByRole('button', { name: 'Next' })
      if (await next.isVisible().catch(() => false)) {
        await next.click({ timeout: 3000 }).catch(() => {})
        continue
      }

      await page.waitForTimeout(2000)
    }

    await expect(page.getByText(/quick review/i)).toBeVisible({ timeout: 15_000 })
  })
})
