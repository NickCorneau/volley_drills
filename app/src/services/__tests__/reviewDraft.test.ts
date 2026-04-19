import { beforeEach, describe, expect, it } from 'vitest'
import { db } from '../../db'
import {
  loadReviewDraft,
  saveReviewDraft,
  submitReview,
} from '../review'

/**
 * Review draft persistence (C-1 Unit 7 / R7 / R8).
 *
 * `saveReviewDraft` writes a `status: 'draft'` record through the A3
 * envelope. `loadReviewDraft` reads the draft back if one exists for the
 * given execId. On `submitReview`, any prior draft for that execId is
 * overwritten by the terminal `status: 'submitted'` record (already
 * covered by the A3 matrix tests).
 *
 * H19 edge: a draft write MUST NOT overwrite a pre-existing terminal
 * submitted record. This keeps the H19 conflict handoff honest — the
 * tester on a stale ReviewScreen whose session was submitted in another
 * tab still sees the canonical values.
 */

const EXEC = 'exec-draft-test'

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
    id: `plan-${EXEC}`,
    presetId: 'solo_wall',
    presetName: 'Solo + Wall',
    playerCount: 1,
    blocks: [],
    safetyCheck: { painFlag: false, heatCta: false, painOverridden: false },
    createdAt: 0,
  })
  await db.executionLogs.put({
    id: EXEC,
    planId: `plan-${EXEC}`,
    status: 'completed',
    activeBlockIndex: 0,
    blockStatuses: [],
    startedAt: 0,
    completedAt: 0,
  })
}

beforeEach(async () => {
  await clearDb()
  await seed()
})

describe('saveReviewDraft / loadReviewDraft', () => {
  it('loadReviewDraft returns null when no record exists', async () => {
    const draft = await loadReviewDraft(EXEC)
    expect(draft).toBeNull()
  })

  it('loadReviewDraft returns null when only a submitted record exists', async () => {
    await submitReview({
      executionLogId: EXEC,
      sessionRpe: 5,
      goodPasses: 10,
      totalAttempts: 15,
    })
    const draft = await loadReviewDraft(EXEC)
    expect(draft).toBeNull()
  })

  it('saveReviewDraft writes a status: draft record', async () => {
    await saveReviewDraft({
      executionLogId: EXEC,
      sessionRpe: 6,
      goodPasses: 3,
      totalAttempts: 7,
    })

    const stored = await db.sessionReviews
      .where('executionLogId')
      .equals(EXEC)
      .first()
    expect(stored?.status).toBe('draft')
    expect(stored?.sessionRpe).toBe(6)
    expect(stored?.goodPasses).toBe(3)
    expect(stored?.totalAttempts).toBe(7)
  })

  it('loadReviewDraft reads back the fields saved via saveReviewDraft', async () => {
    await saveReviewDraft({
      executionLogId: EXEC,
      sessionRpe: 7,
      goodPasses: 12,
      totalAttempts: 20,
      incompleteReason: 'fatigue',
      quickTags: ['notCaptured'],
      shortNote: 'Partial session.',
    })

    const draft = await loadReviewDraft(EXEC)
    expect(draft).not.toBeNull()
    expect(draft?.sessionRpe).toBe(7)
    expect(draft?.goodPasses).toBe(12)
    expect(draft?.totalAttempts).toBe(20)
    expect(draft?.incompleteReason).toBe('fatigue')
    expect(draft?.quickTags).toEqual(['notCaptured'])
    expect(draft?.shortNote).toBe('Partial session.')
  })

  it('saveReviewDraft overwrites a prior draft on the same execId', async () => {
    await saveReviewDraft({
      executionLogId: EXEC,
      sessionRpe: 3,
      goodPasses: 1,
      totalAttempts: 1,
    })
    await saveReviewDraft({
      executionLogId: EXEC,
      sessionRpe: 8,
      goodPasses: 20,
      totalAttempts: 25,
    })

    const draft = await loadReviewDraft(EXEC)
    expect(draft?.sessionRpe).toBe(8)
    expect(draft?.goodPasses).toBe(20)

    const count = await db.sessionReviews
      .where('executionLogId')
      .equals(EXEC)
      .count()
    expect(count).toBe(1)
  })

  it('saveReviewDraft does NOT overwrite an existing submitted record (H19 hygiene)', async () => {
    await submitReview({
      executionLogId: EXEC,
      sessionRpe: 6,
      goodPasses: 10,
      totalAttempts: 15,
    })

    await saveReviewDraft({
      executionLogId: EXEC,
      sessionRpe: 9,
      goodPasses: 99,
      totalAttempts: 99,
    })

    const stored = await db.sessionReviews
      .where('executionLogId')
      .equals(EXEC)
      .first()
    expect(stored?.status).toBe('submitted')
    expect(stored?.sessionRpe).toBe(6)
    expect(stored?.goodPasses).toBe(10)
  })

  it('saveReviewDraft over a skipped record stays skipped (terminal wins)', async () => {
    await db.sessionReviews.put({
      id: `review-${EXEC}`,
      executionLogId: EXEC,
      sessionRpe: null,
      goodPasses: 0,
      totalAttempts: 0,
      quickTags: ['skipped'],
      submittedAt: 0,
      status: 'skipped',
    })

    await saveReviewDraft({
      executionLogId: EXEC,
      sessionRpe: 4,
      goodPasses: 2,
      totalAttempts: 3,
    })

    const stored = await db.sessionReviews
      .where('executionLogId')
      .equals(EXEC)
      .first()
    expect(stored?.status).toBe('skipped')
    expect(stored?.sessionRpe).toBeNull()
  })
})
