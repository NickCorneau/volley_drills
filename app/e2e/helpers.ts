import type { Page } from '@playwright/test'

const DB_NAME = 'volley-drills'

/**
 * Clears the app IndexedDB for the current origin.
 *
 * Use CDP instead of `indexedDB.deleteDatabase()`: the app opens Dexie during
 * boot, so deleteDatabase can hit `onblocked` and leave the DB intact while
 * the helper reports success. CDP origin clearing matches the schema e2e spec
 * and gives every flow test a real cold start.
 */
export async function clearIndexedDB(page: Page) {
  const origin = new URL(page.url() !== 'about:blank' ? page.url() : 'http://127.0.0.1:4173').origin
  const client = await page.context().newCDPSession(page)
  try {
    await client.send('Storage.clearDataForOrigin', {
      origin,
      storageTypes: 'indexeddb',
    })
  } finally {
    await client.detach()
  }
}

/**
 * Writes `onboarding.completedAt` so FirstOpenGate and `/setup` allow the
 * legacy “home → start workout” e2e path without walking onboarding UI.
 * Call after a navigation that has opened the DB at least once.
 */
export async function seedOnboardingCompletedAt(page: Page) {
  await page.evaluate((name) => {
    return new Promise<void>((resolve, reject) => {
      const open = indexedDB.open(name)
      open.onsuccess = () => {
        const dbInst = open.result
        if (!dbInst.objectStoreNames.contains('storageMeta')) {
          dbInst.close()
          resolve()
          return
        }
        const tx = dbInst.transaction('storageMeta', 'readwrite')
        const now = Date.now()
        tx.objectStore('storageMeta').put({
          key: 'onboarding.completedAt',
          value: now,
          updatedAt: now,
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
  }, DB_NAME)
}

/**
 * After seeding, navigate to `/` so the address bar is not left on
 * `/onboarding/*` (a plain reload would keep that URL and still render
 * onboarding even though `completedAt` is set).
 */
export async function seedOnboardingAndOpenHome(page: Page) {
  await seedOnboardingCompletedAt(page)
  await page.goto('/')
}

/** C-3 first-run: Skill Level → Today's Setup (URL), ready for the usual setup taps. */
export async function goToOnboardingTodaysSetup(page: Page) {
  await page.waitForURL(/\/onboarding\/skill-level/, { timeout: 15_000 })
  await page
    .getByRole('button', { name: /Foundations/i })
    .first()
    .click()
  await page.getByText("Today's setup").waitFor({ state: 'visible', timeout: 10_000 })
}
