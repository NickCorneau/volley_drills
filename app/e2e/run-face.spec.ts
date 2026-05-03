import { expect, test, type Page, type TestInfo } from '@playwright/test'
import { clearIndexedDB } from './helpers'

const DB_NAME = 'volley-drills'

type SeedOptions = {
  execId: string
  paused?: boolean
  segmented?: boolean
  required?: boolean
}

test.describe('Run Face v1 visual evidence', () => {
  for (const viewport of [
    { name: 'short-phone', width: 360, height: 640 },
    { name: 'large-phone', width: 390, height: 844 },
  ]) {
    test(`active run face at ${viewport.name}`, async ({ page }, testInfo) => {
      await page.setViewportSize({ width: viewport.width, height: viewport.height })
      await seedRunSession(page, { execId: `run-face-${viewport.name}` })

      await expect(page.getByText(/^Now$/)).toBeVisible()
      await expect(page.getByText('Caller names short or deep')).toBeVisible()
      await expect(page.getByRole('timer')).toBeVisible()
      await expect(page.getByRole('button', { name: /pause/i })).toBeVisible()
      await expect(page.getByRole('button', { name: /next/i })).toBeVisible()

      await attachScreenshot(page, testInfo, `run-face-active-${viewport.name}`)
    })
  }

  test('segmented run face keeps SegmentList as the cue owner', async ({ page }, testInfo) => {
    await page.setViewportSize({ width: 360, height: 640 })
    await seedRunSession(page, {
      execId: 'run-face-segments',
      segmented: true,
    })

    const list = page.getByRole('list', { name: 'Segments' })
    await expect(list).toBeVisible()
    await expect(list.getByText(/Jog or A-skip/i)).toBeVisible()
    await expect(page.getByText(/^Now$/)).toHaveCount(0)
    await expect(page.getByRole('timer')).toBeVisible()

    await attachScreenshot(page, testInfo, 'run-face-segmented-360')
  })

  test('paused dense controls remain reachable on short phone', async ({ page }, testInfo) => {
    await page.setViewportSize({ width: 360, height: 640 })
    await seedRunSession(page, {
      execId: 'run-face-paused',
      paused: true,
      required: false,
    })

    await expect(page.getByRole('timer', { name: /paused/i })).toBeVisible()
    await expect(page.getByRole('button', { name: /resume/i })).toBeVisible()
    await expect(page.getByRole('button', { name: /shorten/i })).toBeVisible()
    await expect(page.getByRole('button', { name: /skip block/i })).toBeVisible()
    await expect(page.getByRole('button', { name: /end session/i })).toBeVisible()

    await attachScreenshot(page, testInfo, 'run-face-paused-dense-360')
  })
})

async function seedRunSession(page: Page, options: SeedOptions) {
  await page.goto('/')
  await clearIndexedDB(page)
  await page.reload()

  await page.evaluate(
    async ({ dbName, options }) => {
      await new Promise<void>((resolve, reject) => {
        const open = indexedDB.open(dbName)
        open.onsuccess = () => {
          const dbInst = open.result
          const stores = ['sessionPlans', 'executionLogs'] as const
          if (!stores.every((s) => dbInst.objectStoreNames.contains(s))) {
            dbInst.close()
            reject(new Error('Expected session stores are missing'))
            return
          }

          const now = Date.now()
          const block = options.segmented
            ? {
                id: 'b-0',
                type: 'warmup',
                drillName: 'Beach Prep Three',
                shortName: 'Warm up',
                durationMinutes: 3,
                coachingCue: 'Short hops, loud feet.',
                courtsideInstructions: 'Four quick blocks, ~45 s each.',
                required: true,
                segments: [
                  { id: 's-1', label: 'Jog or A-skip around your sand box.', durationSec: 45 },
                  { id: 's-2', label: 'Ankle hops and lateral shuffles.', durationSec: 45 },
                  { id: 's-3', label: 'Arm circles and trunk rotations.', durationSec: 45 },
                  {
                    id: 's-4',
                    label: 'Quick side shuffles and pivot-back starts.',
                    durationSec: 45,
                  },
                ],
              }
            : {
                id: 'b-0',
                type: 'main_skill',
                drillName: 'Partner Passing',
                shortName: 'Pass',
                durationMinutes: 5,
                coachingCue:
                  'Caller names short or deep · Partner shades the seam · Reset together before the next ball',
                courtsideInstructions:
                  'One player serves easy balls. One player owns the call and platform angle.',
                required: options.required ?? true,
              }

          const tx = dbInst.transaction([...stores], 'readwrite')
          tx.objectStore('sessionPlans').put({
            id: `plan-${options.execId}`,
            presetId: 'solo_open',
            presetName: 'Solo + Open',
            playerCount: 1,
            blocks: [block],
            safetyCheck: { painFlag: false, heatCta: false, painOverridden: false },
            createdAt: now - 60_000,
          })
          tx.objectStore('executionLogs').put({
            id: options.execId,
            planId: `plan-${options.execId}`,
            status: options.paused ? 'paused' : 'in_progress',
            activeBlockIndex: 0,
            blockStatuses: [{ blockId: 'b-0', status: 'in_progress', startedAt: now - 1_000 }],
            startedAt: now - 1_000,
            pausedAt: options.paused ? now - 500 : undefined,
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
    { dbName: DB_NAME, options },
  )

  await page.goto(`/run?id=${options.execId}`)
}

async function attachScreenshot(page: Page, testInfo: TestInfo, name: string) {
  const screenshot = await page.screenshot({ fullPage: false })
  await testInfo.attach(name, { body: screenshot, contentType: 'image/png' })
}
