import { expect, test, type Page } from '@playwright/test'
import { clearIndexedDB, seedOnboardingAndOpenHome } from './helpers'

/**
 * V0B-15 / Phase E Unit 2 Playwright smoke.
 *
 * Covers the full founder-readout click path in a real browser:
 *   Home footer (`Settings` link) -> `/settings` -> tap Export
 *   -> success status toast renders without error.
 *
 * Download dialogs are suppressed by the browser engine during
 * `page.on('download')` interception, so this smoke asserts:
 *   1. the anchor click fired (captured via page instrumentation),
 *   2. the filename follows `volley-drills-export-YYYY-MM-DD.json`,
 *   3. the success toast replaces the button's Exporting… state.
 *
 * Unit tests (`export.test.ts`, `SettingsScreen.test.tsx`) already
 * cover the JSON payload shape and the double-tap guard; this spec
 * catches anything real-browser-specific (Blob creation, anchor
 * download attribute, CSP interference, etc).
 */

async function instrumentAnchorClicks(page: Page) {
  // Capture `a[download]` click filenames so we can assert the export
  // anchor fires with the expected name without relying on a native
  // download dialog (which browser engines silently suppress under
  // test automation).
  await page.addInitScript(() => {
    const w = window as Window & {
      __downloadFilenames?: string[]
    }
    w.__downloadFilenames = []
    const origCreate = document.createElement.bind(document)
    document.createElement = function (tag: string, ...rest: unknown[]) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const el = origCreate(tag, ...(rest as [any]))
      if (tag.toLowerCase() === 'a') {
        const anchor = el as HTMLAnchorElement
        const origClick = anchor.click.bind(anchor)
        anchor.click = () => {
          if (anchor.download) {
            w.__downloadFilenames?.push(anchor.download)
          }
          origClick()
        }
      }
      return el
    }
  })
}

async function readCapturedFilenames(page: Page): Promise<string[]> {
  return await page.evaluate(() => {
    const w = window as Window & { __downloadFilenames?: string[] }
    return w.__downloadFilenames ?? []
  })
}

test.describe('phase-e settings + export', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await clearIndexedDB(page)
    await page.reload()
    // FirstOpenGate would otherwise bounce us into /onboarding/*.
    await seedOnboardingAndOpenHome(page)
  })

  test('Home footer Settings -> /settings -> Export fires success state', async ({ page }) => {
    await instrumentAnchorClicks(page)
    // Reload so the init script takes effect for the test's navigation.
    await page.reload()

    // Home renders with the Settings footer link.
    const settingsLink = page.getByRole('link', { name: /^settings$/i })
    await expect(settingsLink).toBeVisible({ timeout: 10_000 })
    await settingsLink.click()

    // SettingsScreen.
    await expect(page).toHaveURL(/\/settings$/)
    const exportBtn = page.getByRole('button', {
      name: /export training records/i,
    })
    await expect(exportBtn).toBeVisible()

    await exportBtn.click()

    // Success toast appears (role=status, aria-live=polite).
    await expect(page.getByText(/export saved.*check your downloads/i)).toBeVisible({
      timeout: 5_000,
    })

    // Anchor was created with the expected filename format.
    const captured = await readCapturedFilenames(page)
    expect(captured).toHaveLength(1)
    expect(captured[0]).toMatch(/^volley-drills-export-\d{4}-\d{2}-\d{2}\.json$/)
  })

  test('Settings Back button returns to Home without mutating state', async ({ page }) => {
    await page.getByRole('link', { name: /^settings$/i }).click()
    await expect(page).toHaveURL(/\/settings$/)

    await page.getByRole('button', { name: /back/i }).click()
    await expect(page).toHaveURL(/\/$/)
    // NewUser empty state (no seeded LastComplete) still renders.
    await expect(page.getByRole('button', { name: /start first workout/i })).toBeVisible()
  })
})
