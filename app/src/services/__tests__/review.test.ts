import { beforeEach, describe, expect, it } from 'vitest'
import { db } from '../../db'
import type { DrillVariantScore } from '../../db'
import { loadSessionBundle, submitReview } from '../review'

async function clearDb() {
  await Promise.all([
    db.sessionPlans.clear(),
    db.executionLogs.clear(),
    db.sessionReviews.clear(),
    db.timerState.clear(),
    db.sessionDrafts.clear(),
  ])
}

beforeEach(async () => {
  await clearDb()
})

const PLAN_ID = 'plan-review-test'
const EXEC_ID = 'exec-review-test'

async function seedPlanAndExecution() {
  await db.sessionPlans.put({
    id: PLAN_ID,
    presetId: 'solo_wall',
    presetName: 'Solo + Wall',
    playerCount: 1,
    blocks: [],
    safetyCheck: {
      painFlag: false,
      heatCta: false,
      painOverridden: false,
    },
    createdAt: Date.now(),
  })

  await db.executionLogs.put({
    id: EXEC_ID,
    planId: PLAN_ID,
    status: 'completed',
    activeBlockIndex: 0,
    blockStatuses: [],
    startedAt: Date.now() - 60_000,
    completedAt: Date.now(),
  })
}

describe('borderlineCount round-trip (V0B-29)', () => {
  it('persists borderlineCount and reads it back via loadSessionBundle', async () => {
    await seedPlanAndExecution()

    await submitReview({
      executionLogId: EXEC_ID,
      sessionRpe: 6,
      goodPasses: 20,
      totalAttempts: 30,
      borderlineCount: 5,
    })

    const bundle = await loadSessionBundle(EXEC_ID)
    expect(bundle).not.toBeNull()
    expect(bundle!.review.borderlineCount).toBe(5)
  })

  it('leaves borderlineCount undefined when omitted', async () => {
    await seedPlanAndExecution()

    await submitReview({
      executionLogId: EXEC_ID,
      sessionRpe: 4,
      goodPasses: 15,
      totalAttempts: 25,
    })

    const bundle = await loadSessionBundle(EXEC_ID)
    expect(bundle).not.toBeNull()
    expect(bundle!.review.borderlineCount).toBeUndefined()
  })
})

describe('drillScores round-trip (V0B-12)', () => {
  it('persists drillScores array and reads it back via loadSessionBundle', async () => {
    await seedPlanAndExecution()

    const scores: DrillVariantScore[] = [
      { drillId: 'drill-a', variantId: 'var-1', goodPasses: 8, totalAttempts: 10 },
      { drillId: 'drill-b', variantId: 'var-2', goodPasses: 5, totalAttempts: 7 },
    ]

    await submitReview({
      executionLogId: EXEC_ID,
      sessionRpe: 6,
      goodPasses: 13,
      totalAttempts: 17,
      drillScores: scores,
    })

    const bundle = await loadSessionBundle(EXEC_ID)
    expect(bundle).not.toBeNull()
    expect(bundle!.review.drillScores).toEqual(scores)
  })

  it('leaves drillScores undefined when omitted (backward compat)', async () => {
    await seedPlanAndExecution()

    await submitReview({
      executionLogId: EXEC_ID,
      sessionRpe: 5,
      goodPasses: 10,
      totalAttempts: 12,
    })

    const bundle = await loadSessionBundle(EXEC_ID)
    expect(bundle).not.toBeNull()
    expect(bundle!.review.drillScores).toBeUndefined()
  })

  it('persists an empty drillScores array without error', async () => {
    await seedPlanAndExecution()

    await submitReview({
      executionLogId: EXEC_ID,
      sessionRpe: 4,
      goodPasses: 0,
      totalAttempts: 0,
      drillScores: [],
    })

    const bundle = await loadSessionBundle(EXEC_ID)
    expect(bundle).not.toBeNull()
    expect(bundle!.review.drillScores).toEqual([])
  })
})
