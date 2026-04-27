import { beforeEach, describe, expect, it } from 'vitest'
import { db } from '../../db'
import type { DrillVariantScore } from '../../db'
import {
  classifyCaptureWindow,
  countSubmittedReviews,
  expireReview,
  FINISH_LATER_CAP_MS,
  loadSessionBundle,
  submitReview,
} from '../review'

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

async function seedPlanAndExecution(completedAt: number = Date.now()) {
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
    createdAt: completedAt,
  })

  await db.executionLogs.put({
    id: EXEC_ID,
    planId: PLAN_ID,
    status: 'completed',
    activeBlockIndex: 0,
    blockStatuses: [],
    startedAt: completedAt - 60_000,
    completedAt,
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

describe('capture-window classification (V0B-30 / D120)', () => {
  it('classifies 0 s as immediate', () => {
    expect(classifyCaptureWindow(0)).toBe('immediate')
  })

  it('classifies 30 min exactly as immediate (inclusive upper)', () => {
    expect(classifyCaptureWindow(30 * 60)).toBe('immediate')
  })

  it('classifies 31 min as same_session', () => {
    expect(classifyCaptureWindow(31 * 60)).toBe('same_session')
  })

  it('classifies 2 h exactly as same_session (inclusive upper)', () => {
    expect(classifyCaptureWindow(2 * 60 * 60)).toBe('same_session')
  })

  it('classifies 3 h as same_day', () => {
    expect(classifyCaptureWindow(3 * 60 * 60)).toBe('same_day')
  })

  it('classifies 24 h exactly as same_day (inclusive upper)', () => {
    expect(classifyCaptureWindow(24 * 60 * 60)).toBe('same_day')
  })

  it('classifies >24 h as next_day_plus', () => {
    expect(classifyCaptureWindow(25 * 60 * 60)).toBe('next_day_plus')
  })
})

describe('submitReview persists capture-window fields (V0B-30 / D120)', () => {
  it('tags a same-session submit as eligible for adaptation', async () => {
    const completedAt = Date.now() - 10 * 60_000
    await seedPlanAndExecution(completedAt)

    await submitReview({
      executionLogId: EXEC_ID,
      sessionRpe: 6,
      goodPasses: 12,
      totalAttempts: 20,
    })

    const bundle = await loadSessionBundle(EXEC_ID)
    expect(bundle).not.toBeNull()
    expect(bundle!.review.sessionRpe).toBe(6)
    expect(bundle!.review.captureWindow).toBe('immediate')
    expect(bundle!.review.eligibleForAdaptation).toBe(true)
    expect(bundle!.review.capturedAt).toBeDefined()
    expect(bundle!.review.captureDelaySeconds).toBeGreaterThanOrEqual(600 - 2)
    expect(bundle!.review.captureDelaySeconds).toBeLessThanOrEqual(600 + 2)
  })

  it('tags a next-day submit as not eligible for adaptation', async () => {
    const capturedAt = Date.now()
    const completedAt = capturedAt - 30 * 60 * 60_000
    await seedPlanAndExecution(completedAt)

    await submitReview({
      executionLogId: EXEC_ID,
      sessionRpe: 5,
      goodPasses: 10,
      totalAttempts: 15,
      capturedAt,
    })

    const bundle = await loadSessionBundle(EXEC_ID)
    expect(bundle).not.toBeNull()
    expect(bundle!.review.captureWindow).toBe('next_day_plus')
    expect(bundle!.review.eligibleForAdaptation).toBe(false)
  })
})

describe('expireReview (V0B-31 / D120)', () => {
  it('writes a terminal stub with null RPE and expired window when none exists', async () => {
    const capturedAt = Date.now()
    const completedAt = capturedAt - (FINISH_LATER_CAP_MS + 60_000)
    await seedPlanAndExecution(completedAt)

    await expireReview({ executionLogId: EXEC_ID, now: capturedAt })

    const bundle = await loadSessionBundle(EXEC_ID)
    expect(bundle).not.toBeNull()
    expect(bundle!.review.sessionRpe).toBeNull()
    expect(bundle!.review.captureWindow).toBe('expired')
    expect(bundle!.review.eligibleForAdaptation).toBe(false)
    expect(bundle!.review.quickTags).toContain('expired')
  })

  it('is idempotent when a review already exists', async () => {
    await seedPlanAndExecution()

    await submitReview({
      executionLogId: EXEC_ID,
      sessionRpe: 7,
      goodPasses: 8,
      totalAttempts: 10,
    })

    await expireReview({ executionLogId: EXEC_ID })

    const bundle = await loadSessionBundle(EXEC_ID)
    expect(bundle!.review.sessionRpe).toBe(7)
    expect(bundle!.review.captureWindow).not.toBe('expired')
  })

  it('overwrites a status: draft with a terminal skipped stub, preserving the draft payload (A1 + adv-1/adv-2 fix)', async () => {
    const capturedAt = Date.now()
    const completedAt = capturedAt - (FINISH_LATER_CAP_MS + 60_000)
    await seedPlanAndExecution(completedAt)

    await db.sessionReviews.put({
      id: `review-${EXEC_ID}`,
      executionLogId: EXEC_ID,
      sessionRpe: 4,
      goodPasses: 2,
      totalAttempts: 5,
      incompleteReason: 'pain',
      shortNote: 'left knee twinge',
      submittedAt: capturedAt - 30 * 60_000,
      status: 'draft',
    })

    await expireReview({ executionLogId: EXEC_ID, now: capturedAt })

    const bundle = await loadSessionBundle(EXEC_ID)
    expect(bundle).not.toBeNull()
    // Terminal markers so the adaptation engine ignores this record.
    expect(bundle!.review.status).toBe('skipped')
    expect(bundle!.review.captureWindow).toBe('expired')
    expect(bundle!.review.eligibleForAdaptation).toBe(false)
    expect(bundle!.review.quickTags).toContain('expired')
    // Draft payload preserved so the tester's data is not silently destroyed.
    expect(bundle!.review.sessionRpe).toBe(4)
    expect(bundle!.review.goodPasses).toBe(2)
    expect(bundle!.review.totalAttempts).toBe(5)
    expect(bundle!.review.incompleteReason).toBe('pain')
    expect(bundle!.review.shortNote).toBe('left knee twinge')
  })

  it('no-ops on an existing status: skipped review (A1)', async () => {
    const capturedAt = Date.now()
    const completedAt = capturedAt - (FINISH_LATER_CAP_MS + 60_000)
    await seedPlanAndExecution(completedAt)

    const originalSubmittedAt = capturedAt - 10 * 60_000
    await db.sessionReviews.put({
      id: `review-${EXEC_ID}`,
      executionLogId: EXEC_ID,
      sessionRpe: null,
      goodPasses: 0,
      totalAttempts: 0,
      quickTags: ['skipped'],
      submittedAt: originalSubmittedAt,
      status: 'skipped',
    })

    await expireReview({ executionLogId: EXEC_ID, now: capturedAt })

    const bundle = await loadSessionBundle(EXEC_ID)
    expect(bundle!.review.status).toBe('skipped')
    expect(bundle!.review.quickTags).toEqual(['skipped'])
    expect(bundle!.review.submittedAt).toBe(originalSubmittedAt)
  })
})

describe('countSubmittedReviews (C-2 Unit 2)', () => {
  it('returns 0 on an empty sessionReviews table', async () => {
    expect(await countSubmittedReviews()).toBe(0)
  })

  it('excludes submitted records older than onboarding.completedAt when set (adv-5 fix)', async () => {
    // Adv-5: a tester who used v0a before the D91 cohort would have v3
    // reviews that the v4 migration classified as `status: 'submitted'`.
    // Their first D91 session would then read "Session 11" instead of
    // "Session 1". `storageMeta.onboarding.completedAt` is already the
    // v0b-cohort-boundary sentinel (C-0 backfill sets it for migrated
    // testers at v4 upgrade; C-3 sets it on fresh-install first-Build),
    // so `countSubmittedReviews` filters `submittedAt >= completedAt` to
    // restrict to v0b-era records.
    const cohortStartedAt = 1_700_000_000_000
    await db.storageMeta.put({
      key: 'onboarding.completedAt',
      value: cohortStartedAt,
      updatedAt: cohortStartedAt,
    })

    await db.sessionReviews.bulkPut([
      {
        id: 'r-old-1',
        executionLogId: 'e-old-1',
        sessionRpe: 5,
        goodPasses: 1,
        totalAttempts: 1,
        submittedAt: cohortStartedAt - 86_400_000, // 1 day before cohort
        status: 'submitted',
      },
      {
        id: 'r-old-2',
        executionLogId: 'e-old-2',
        sessionRpe: 6,
        goodPasses: 1,
        totalAttempts: 1,
        submittedAt: cohortStartedAt - 3600_000, // 1 hour before cohort
        status: 'submitted',
      },
      {
        id: 'r-new-1',
        executionLogId: 'e-new-1',
        sessionRpe: 7,
        goodPasses: 1,
        totalAttempts: 1,
        submittedAt: cohortStartedAt + 60_000, // just after cohort
        status: 'submitted',
      },
    ])

    // Only the post-cohort record contributes. Pre-cohort records remain
    // on disk for V0B-15 export but don't pollute the Session {N} counter.
    expect(await countSubmittedReviews()).toBe(1)
  })

  it('counts only records whose status === "submitted" when no cohort sentinel is set', async () => {
    const now = Date.now()
    await db.sessionReviews.bulkPut([
      {
        id: 'r-1',
        executionLogId: 'e-1',
        sessionRpe: 6,
        goodPasses: 10,
        totalAttempts: 15,
        submittedAt: now,
        status: 'submitted',
      },
      {
        id: 'r-2',
        executionLogId: 'e-2',
        sessionRpe: 7,
        goodPasses: 20,
        totalAttempts: 30,
        submittedAt: now,
        status: 'submitted',
      },
      {
        id: 'r-3',
        executionLogId: 'e-3',
        sessionRpe: 5,
        goodPasses: 5,
        totalAttempts: 8,
        submittedAt: now,
        status: 'submitted',
      },
      {
        id: 'r-4',
        executionLogId: 'e-4',
        sessionRpe: null,
        goodPasses: 0,
        totalAttempts: 0,
        quickTags: ['skipped'],
        submittedAt: now,
        status: 'skipped',
      },
      {
        id: 'r-5',
        executionLogId: 'e-5',
        sessionRpe: null,
        goodPasses: 0,
        totalAttempts: 0,
        quickTags: ['expired'],
        submittedAt: now,
        status: 'skipped',
      },
      {
        id: 'r-6',
        executionLogId: 'e-6',
        sessionRpe: 4,
        goodPasses: 2,
        totalAttempts: 5,
        submittedAt: now,
        status: 'draft',
      },
    ])

    expect(await countSubmittedReviews()).toBe(3)
  })
})
