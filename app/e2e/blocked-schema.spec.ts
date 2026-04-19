import { test, expect, type Page } from '@playwright/test'
import { seedOnboardingAndOpenHome } from './helpers'

/**
 * V0B-22: blocked-schema overlay smoke test (Phase B, Unit 4).
 *
 * Verifies that when a second IndexedDB connection attempts to open
 * `volley-drills` at a HIGHER schema version than Dexie currently holds,
 * Dexie's existing connection fires `versionchange`, which in turn calls
 * `emitSchemaBlocked()` and causes `<SchemaBlockedOverlay />` to render.
 *
 * Strategy: same-page simulation. We open a second IndexedDB connection via
 * `page.evaluate` at version 99. The browser does not distinguish "different
 * tab" from "different JS execution context" — two open connections at
 * different versions is sufficient to fire `versionchange` on the old one.
 */

const DB_NAME = 'volley-drills'
const HIGHER_VERSION = 99

async function clearIndexedDB(page: Page) {
  await page.evaluate((name) => {
    return new Promise<void>((resolve, reject) => {
      const req = indexedDB.deleteDatabase(name)
      req.onsuccess = () => resolve()
      req.onerror = () => reject(req.error)
      req.onblocked = () => resolve()
    })
  }, DB_NAME)
}

test.describe('blocked-schema overlay (V0B-22)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await clearIndexedDB(page)
    await page.reload()
    await seedOnboardingAndOpenHome(page)
  })

  test('versionchange from a second higher-version connection shows the overlay', async ({
    page,
  }) => {
    // HomeScreen's resolve() dynamically imports `../db/schema` and calls
    // `db.sessionPlans.count()`, so once the home UI renders Dexie has
    // opened its connection at the current version.
    await expect(page.getByText(/volleycraft/i).first()).toBeVisible({
      timeout: 10_000,
    })

    // Wait until the browser reports the DB exists at its current version
    // (>= 3 — Dexie's `version(3).stores(...)` is the highest declared).
    await page.waitForFunction(
      (name) => {
        return new Promise<boolean>((resolve) => {
          const req = indexedDB.open(name)
          req.onsuccess = () => {
            const version = req.result.version
            req.result.close()
            resolve(version >= 3)
          }
          req.onerror = () => resolve(false)
          // If another connection is holding it blocked, we've effectively
          // confirmed Dexie is open.
          req.onblocked = () => resolve(true)
        })
      },
      DB_NAME,
      { timeout: 5_000 },
    )

    // Open a second connection at a HIGHER version. This fires
    // `versionchange` on Dexie's existing connection synchronously from
    // the browser's perspective; our handler calls `db.close()` then
    // `emitSchemaBlocked()`. Return a discriminator so we can assert
    // `db.close()` actually ran (onsuccess path) rather than silently
    // regressing (onblocked would still fire versionchange on the old
    // connection but would indicate Dexie did NOT release the lock).
    const path = await page.evaluate(
      ([name, version]) => {
        return new Promise<'success' | 'blocked' | 'error'>((resolve) => {
          const req = indexedDB.open(name as string, version as number)
          req.onupgradeneeded = () => {
            const d = req.result
            if (!d.objectStoreNames.contains('__test_probe')) {
              d.createObjectStore('__test_probe')
            }
          }
          req.onsuccess = () => {
            req.result.close()
            resolve('success')
          }
          req.onerror = () => resolve('error')
          req.onblocked = () => resolve('blocked')
        })
      },
      [DB_NAME, HIGHER_VERSION] as const,
    )

    // Assert Dexie's `versionchange` handler actually closed the connection
    // so the upgrade could proceed. If this ever regresses to 'blocked',
    // the overlay would still appear but the new-version tab would be
    // locked out in production.
    expect(path).toBe('success')

    // Overlay should appear. Prefer role-based query for a11y signal.
    const overlay = page.getByRole('alertdialog')
    await expect(overlay).toBeVisible({ timeout: 5_000 })
    await expect(
      overlay.getByRole('heading', {
        name: /reload to continue/i,
      }),
    ).toBeVisible()
    await expect(
      overlay.getByRole('button', { name: /reload/i }),
    ).toBeVisible()
  })
})
