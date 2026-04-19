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
    await expect(
      page.getByRole('heading', { name: /where.*pair today/i }),
    ).toBeVisible()
    await checkA11y(page, 'onboarding – skill level')
  })

  test('home screen (new user, onboarding complete)', async ({ page }) => {
    await seedOnboardingAndOpenHome(page)
    await expect(page.getByRole('button', { name: /start first workout/i })).toBeVisible()
    await checkA11y(page, 'home – new user')
  })

  test('setup screen', async ({ page }) => {
    await seedOnboardingAndOpenHome(page)
    await page.getByRole('button', { name: /start.*workout/i }).click()
    await expect(page.getByText("Today's setup")).toBeVisible()
    await checkA11y(page, 'setup')
  })

  test('safety check screen', async ({ page }) => {
    await seedOnboardingAndOpenHome(page)
    await page.getByRole('button', { name: /start.*workout/i }).click()
    await page.getByRole('radio', { name: 'Solo' }).click()
    await page.getByLabel('Net available').getByRole('radio', { name: 'No' }).click()
    await page.getByLabel('Wall available').getByRole('radio', { name: 'No' }).click()
    await page.getByRole('radio', { name: '15 min' }).click()
    await page.getByRole('button', { name: /build session/i }).click()

    await expect(page.getByText('Before we start')).toBeVisible()
    await checkA11y(page, 'safety check')
  })

  test('run screen', async ({ page }) => {
    await seedOnboardingAndOpenHome(page)
    await page.getByRole('button', { name: /start.*workout/i }).click()
    await page.getByRole('radio', { name: 'Solo' }).click()
    await page.getByLabel('Net available').getByRole('radio', { name: 'No' }).click()
    await page.getByLabel('Wall available').getByRole('radio', { name: 'No' }).click()
    await page.getByRole('radio', { name: '15 min' }).click()
    await page.getByRole('button', { name: /build session/i }).click()

    await page.getByRole('button', { name: 'No' }).click()
    await page.locator('button', { hasText: '1 day' }).click()
    await page.getByRole('button', { name: 'Continue' }).click()

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
    await page.getByRole('button', { name: /start.*workout/i }).click()
    await page.getByRole('radio', { name: 'Solo' }).click()
    await page.getByLabel('Net available').getByRole('radio', { name: 'No' }).click()
    await page.getByLabel('Wall available').getByRole('radio', { name: 'No' }).click()
    await page.getByRole('radio', { name: '15 min' }).click()
    await page.getByRole('button', { name: /build session/i }).click()

    await page.getByRole('button', { name: 'No' }).click()
    await page.locator('button', { hasText: '1 day' }).click()
    await page.getByRole('button', { name: 'Continue' }).click()

    const pause = page.getByRole('button', { name: /pause/i })
    const startNext = page.getByRole('button', { name: /start next block/i })
    await expect(pause.or(startNext)).toBeVisible({ timeout: 15_000 })

    if (await startNext.isVisible()) {
      await startNext.click()
      await expect(pause).toBeVisible({ timeout: 10_000 })
    }

    await pause.click()
    await expect(page.getByText(/paused/i)).toBeVisible()
    await checkA11y(page, 'run – paused')
  })

  test('error state – /run without session', async ({ page }) => {
    await page.goto('/run')
    await expect(page.getByText(/session not found/i)).toBeVisible()
    await checkA11y(page, 'error – no session')
  })
})
