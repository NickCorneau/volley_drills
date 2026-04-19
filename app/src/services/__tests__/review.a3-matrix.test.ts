import { beforeEach, describe, expect, it } from 'vitest'
import { db } from '../../db'
import type { SessionReview } from '../../db'
import { expireReview, submitReview } from '../review'
import { skipReview } from '../session'

/**
 * A3 (approved red-team fix plan v3, §A3) — 4x3 state-vs-action matrix
 * for `submitReview` / `skipReview` / `expireReview`.
 *
 * | Existing   | submit              | skip              | expire           |
 * |------------|---------------------|-------------------|------------------|
 * | none       | write submitted     | write skipped     | write skipped    |
 * | draft      | overwrite submitted | overwrite skipped | overwrite skipped|
 * | submitted  | refuse (H19)        | no-op             | no-op            |
 * | skipped    | refuse (H19)        | no-op             | no-op            |
 *
 * Intra-connection atomicity only per H17: each writer wraps the
 * read-decide-write in `db.transaction('rw', db.sessionReviews,
 * db.storageMeta, ...)`. Cross-tab concurrency is bounded by the 2 h cap
 * + A6 submit-time re-check, not by an optimistic-concurrency field.
 */

const PLAN_ID = 'plan-a3'
const EXEC_ID = 'exec-a3'
const REVIEW_ID = `review-${EXEC_ID}`
const SUBMITTED_AT = 1_700_000_000_000

async function clearDb() {
  await Promise.all([
    db.sessionPlans.clear(),
    db.executionLogs.clear(),
    db.sessionReviews.clear(),
    db.timerState.clear(),
    db.sessionDrafts.clear(),
    db.storageMeta.clear(),
  ])
}

async function seed() {
  await db.sessionPlans.put({
    id: PLAN_ID,
    presetId: 'solo_wall',
    presetName: 'Solo + Wall',
    playerCount: 1,
    blocks: [],
    safetyCheck: { painFlag: false, heatCta: false, painOverridden: false },
    createdAt: SUBMITTED_AT,
  })
  await db.executionLogs.put({
    id: EXEC_ID,
    planId: PLAN_ID,
    status: 'completed',
    activeBlockIndex: 0,
    blockStatuses: [],
    startedAt: SUBMITTED_AT - 60_000,
    completedAt: SUBMITTED_AT,
  })
}

async function seedExisting(status: 'draft' | 'submitted' | 'skipped') {
  const base: SessionReview = {
    id: REVIEW_ID,
    executionLogId: EXEC_ID,
    sessionRpe: status === 'submitted' ? 7 : null,
    goodPasses: status === 'submitted' ? 10 : 0,
    totalAttempts: status === 'submitted' ? 15 : 0,
    submittedAt: SUBMITTED_AT - 60_000,
    status,
  }
  if (status === 'draft') {
    base.sessionRpe = 4
    base.goodPasses = 2
    base.totalAttempts = 5
  }
  if (status === 'skipped') {
    base.quickTags = ['skipped']
  }
  await db.sessionReviews.put(base)
}

beforeEach(async () => {
  await clearDb()
  await seed()
})

describe('A3 matrix: existing state = none', () => {
  it('(none, submit) writes submitted and returns ok', async () => {
    const result = await submitReview({
      executionLogId: EXEC_ID,
      sessionRpe: 6,
      goodPasses: 8,
      totalAttempts: 12,
    })
    expect(result).toEqual({ status: 'ok' })
    const stored = await db.sessionReviews.get(REVIEW_ID)
    expect(stored?.status).toBe('submitted')
    expect(stored?.sessionRpe).toBe(6)
  })

  it('(none, skip) writes skipped with quickTags skipped', async () => {
    await skipReview(EXEC_ID)
    const stored = await db.sessionReviews.get(REVIEW_ID)
    expect(stored?.status).toBe('skipped')
    expect(stored?.quickTags).toEqual(['skipped'])
    expect(stored?.sessionRpe).toBeNull()
  })

  it('(none, expire) writes skipped with quickTags expired', async () => {
    await expireReview({ executionLogId: EXEC_ID })
    const stored = await db.sessionReviews.get(REVIEW_ID)
    expect(stored?.status).toBe('skipped')
    expect(stored?.quickTags).toEqual(['expired'])
    expect(stored?.sessionRpe).toBeNull()
  })
})

describe('A3 matrix: existing state = draft', () => {
  beforeEach(async () => {
    await seedExisting('draft')
  })

  it('(draft, submit) overwrites to submitted and returns ok', async () => {
    const result = await submitReview({
      executionLogId: EXEC_ID,
      sessionRpe: 8,
      goodPasses: 20,
      totalAttempts: 25,
    })
    expect(result).toEqual({ status: 'ok' })
    const stored = await db.sessionReviews.get(REVIEW_ID)
    expect(stored?.status).toBe('submitted')
    expect(stored?.sessionRpe).toBe(8)
    expect(stored?.goodPasses).toBe(20)
  })

  it('(draft, skip) overwrites to skipped', async () => {
    await skipReview(EXEC_ID)
    const stored = await db.sessionReviews.get(REVIEW_ID)
    expect(stored?.status).toBe('skipped')
    expect(stored?.quickTags).toEqual(['skipped'])
    expect(stored?.sessionRpe).toBeNull()
  })

  it('(draft, expire) overwrites to skipped (quickTags includes expired), preserving draft payload (adv-1/adv-2 fix)', async () => {
    await expireReview({ executionLogId: EXEC_ID })
    const stored = await db.sessionReviews.get(REVIEW_ID)
    expect(stored?.status).toBe('skipped')
    expect(stored?.captureWindow).toBe('expired')
    expect(stored?.eligibleForAdaptation).toBe(false)
    expect(stored?.quickTags).toContain('expired')
    // Draft payload preserved (seedExisting('draft') writes sessionRpe: 4,
    // goodPasses: 2, totalAttempts: 5). The tester's inputs survive into the
    // terminal stub so the adaptation engine ignores the record but the
    // export / history surface carries honest data.
    expect(stored?.sessionRpe).toBe(4)
    expect(stored?.goodPasses).toBe(2)
    expect(stored?.totalAttempts).toBe(5)
  })
})

describe('A3 matrix: existing state = submitted (H19 refuses)', () => {
  beforeEach(async () => {
    await seedExisting('submitted')
  })

  it('(submitted, submit) refuses silently, surfaces existingStatus, leaves record untouched (H19)', async () => {
    const result = await submitReview({
      executionLogId: EXEC_ID,
      sessionRpe: 3,
      goodPasses: 99,
      totalAttempts: 99,
    })
    expect(result).toEqual({
      status: 'refused',
      existingStatus: 'submitted',
    })
    const stored = await db.sessionReviews.get(REVIEW_ID)
    expect(stored?.status).toBe('submitted')
    expect(stored?.sessionRpe).toBe(7)
    expect(stored?.goodPasses).toBe(10)
  })

  it('(submitted, skip) no-ops', async () => {
    await skipReview(EXEC_ID)
    const stored = await db.sessionReviews.get(REVIEW_ID)
    expect(stored?.status).toBe('submitted')
    expect(stored?.sessionRpe).toBe(7)
  })

  it('(submitted, expire) no-ops', async () => {
    await expireReview({ executionLogId: EXEC_ID })
    const stored = await db.sessionReviews.get(REVIEW_ID)
    expect(stored?.status).toBe('submitted')
    expect(stored?.sessionRpe).toBe(7)
  })
})

describe('A3 matrix: existing state = skipped', () => {
  beforeEach(async () => {
    await seedExisting('skipped')
  })

  it('(skipped, submit) refuses with existingStatus "skipped" (honest H19 copy for adv-3)', async () => {
    const result = await submitReview({
      executionLogId: EXEC_ID,
      sessionRpe: 4,
      goodPasses: 50,
      totalAttempts: 50,
    })
    expect(result).toEqual({
      status: 'refused',
      existingStatus: 'skipped',
    })
    const stored = await db.sessionReviews.get(REVIEW_ID)
    expect(stored?.status).toBe('skipped')
    expect(stored?.quickTags).toEqual(['skipped'])
  })

  it('(skipped, skip) no-ops', async () => {
    await skipReview(EXEC_ID)
    const stored = await db.sessionReviews.get(REVIEW_ID)
    expect(stored?.status).toBe('skipped')
    expect(stored?.quickTags).toEqual(['skipped'])
  })

  it('(skipped, expire) no-ops', async () => {
    await expireReview({ executionLogId: EXEC_ID })
    const stored = await db.sessionReviews.get(REVIEW_ID)
    expect(stored?.status).toBe('skipped')
    expect(stored?.quickTags).toEqual(['skipped'])
  })
})
