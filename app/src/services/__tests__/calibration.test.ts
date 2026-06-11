import { beforeEach, describe, expect, it } from 'vitest'
import { db } from '../../db'
import {
  currentPersistedExecutionLog,
  currentPersistedPlan,
} from '../../test-utils/persistedRecords'
import { loadSessionCalibration } from '../calibration'

/**
 * U5 — the service seam both assembly callers and the founder export
 * resolve the calibration through. Pins the Dexie read + prefetched
 * pass-through; the fold semantics themselves are pinned in the domain
 * suite (`domain/calibration/__tests__/sessionCalibration.test.ts`).
 */

const MIN = 60_000
const BASE = 1_700_000_000_000

async function clearDb() {
  await Promise.all([db.executionLogs.clear(), db.sessionPlans.clear()])
}

beforeEach(async () => {
  await clearDb()
})

async function seedCleanComplete(id: string, ratio: number, endedAt: number) {
  await db.sessionPlans.put(
    currentPersistedPlan({ id: `plan-${id}`, blocks: [{ durationMinutes: 20 }] }),
  )
  await db.executionLogs.put(
    currentPersistedExecutionLog({
      id: `exec-${id}`,
      planId: `plan-${id}`,
      status: 'completed',
      blockStatuses: [{ status: 'completed' }],
      startedAt: endedAt - 20 * ratio * MIN,
      completedAt: endedAt,
    }),
  )
}

describe('loadSessionCalibration', () => {
  it('resolves the inert calibration from an empty database', async () => {
    const result = await loadSessionCalibration()
    expect(result.overheadRatio).toBe(1)
    expect(result.sampleCount).toBe(0)
  })

  it('folds clean completes read from Dexie', async () => {
    await seedCleanComplete('a', 1.2, BASE)
    await seedCleanComplete('b', 1.3, BASE + MIN)
    await seedCleanComplete('c', 1.4, BASE + 2 * MIN)
    const result = await loadSessionCalibration()
    expect(result.overheadRatio).toBeCloseTo(1.3, 5)
    expect(result.sampleCount).toBe(3)
  })

  it('derives from prefetched snapshots without touching Dexie', async () => {
    // Dexie stays empty; the prefetched rows alone drive the fold.
    const rows = [1.2, 1.3, 1.4].map((ratio, i) => ({
      plan: currentPersistedPlan({ id: `plan-p${i}`, blocks: [{ durationMinutes: 20 }] }),
      log: currentPersistedExecutionLog({
        id: `exec-p${i}`,
        planId: `plan-p${i}`,
        status: 'completed',
        blockStatuses: [{ status: 'completed' }],
        startedAt: BASE + i * MIN - 20 * ratio * MIN,
        completedAt: BASE + i * MIN,
      }),
    }))
    const result = await loadSessionCalibration({
      executionLogs: rows.map((r) => r.log),
      sessionPlans: rows.map((r) => r.plan),
    })
    expect(result.overheadRatio).toBeCloseTo(1.3, 5)
    expect(result.sampleCount).toBe(3)
  })
})
