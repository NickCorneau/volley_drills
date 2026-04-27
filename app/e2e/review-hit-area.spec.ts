import { test, expect, type Locator, type Page } from '@playwright/test'
import { clearIndexedDB } from './helpers'

const DB_NAME = 'volley-drills'

async function seedCompletedCountSession(page: Page, execId: string) {
  await page.evaluate(
    async ({ dbName, execId }) => {
      await new Promise<void>((resolve, reject) => {
        const open = indexedDB.open(dbName)
        open.onsuccess = () => {
          const dbInst = open.result
          const stores = ['sessionPlans', 'executionLogs', 'storageMeta'] as const
          if (!stores.every((s) => dbInst.objectStoreNames.contains(s))) {
            dbInst.close()
            resolve()
            return
          }
          const tx = dbInst.transaction([...stores], 'readwrite')
          const now = Date.now()
          tx.objectStore('storageMeta').put({
            key: 'onboarding.completedAt',
            value: now - 7 * 24 * 60 * 60 * 1000,
            updatedAt: now - 7 * 24 * 60 * 60 * 1000,
          })
          tx.objectStore('sessionPlans').put({
            id: `plan-${execId}`,
            presetId: 'pair_net',
            presetName: 'Pair + Net',
            playerCount: 2,
            blocks: [
              {
                id: 'block-main',
                type: 'main_skill',
                drillId: 'd02',
                variantId: 'd02-pair',
                drillName: 'Towel Platform Passing',
                shortName: 'Towel Pass',
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
            context: {
              playerMode: 'pair',
              timeProfile: 15,
              netAvailable: true,
              wallAvailable: false,
            },
            createdAt: now - 20 * 60_000,
          })
          tx.objectStore('executionLogs').put({
            id: execId,
            planId: `plan-${execId}`,
            status: 'completed',
            activeBlockIndex: 1,
            blockStatuses: [{ blockId: 'block-main', status: 'completed' }],
            startedAt: now - 20 * 60_000,
            completedAt: now - 2 * 60_000,
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
    { dbName: DB_NAME, execId },
  )
}

async function expectHitAreaAtLeast44(locator: Locator, label: string) {
  await expect(locator, `${label} should be visible`).toBeVisible()
  const box = await locator.boundingBox()
  expect(box, `${label} should have a measurable bounding box`).not.toBeNull()
  expect(box!.width, `${label} width`).toBeGreaterThanOrEqual(44)
  expect(box!.height, `${label} height`).toBeGreaterThanOrEqual(44)
}

test.describe('review hit areas', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await clearIndexedDB(page)
    await page.reload()
  })

  test('current review controls meet 44px hit-area floor at 375px width', async ({ page }) => {
    const execId = 'review-hit-area'
    await seedCompletedCountSession(page, execId)
    await page.setViewportSize({ width: 375, height: 844 })

    await page.goto(`/review?id=${execId}`)
    await expect(page.getByRole('heading', { name: /quick review/i })).toBeVisible()

    await expectHitAreaAtLeast44(page.getByRole('radio', { name: 'Easy' }), 'Easy RPE chip')
    await expectHitAreaAtLeast44(page.getByRole('radio', { name: 'Right' }), 'Right RPE chip')
    await expectHitAreaAtLeast44(page.getByRole('radio', { name: 'Hard' }), 'Hard RPE chip')
    await expectHitAreaAtLeast44(page.getByLabel('Good'), 'Good count input')
    await expectHitAreaAtLeast44(page.getByLabel('Total'), 'Total count input')
    await expectHitAreaAtLeast44(
      page.getByRole('button', { name: /couldn.t capture reps this time/i }),
      "Couldn't capture reps button",
    )
    await expectHitAreaAtLeast44(page.getByLabel(/short note/i), 'Short note textarea')
    await expectHitAreaAtLeast44(page.getByRole('button', { name: 'Done' }), 'Done button')
    await expectHitAreaAtLeast44(
      page.getByRole('button', { name: /finish later/i }),
      'Finish later button',
    )
  })
})
