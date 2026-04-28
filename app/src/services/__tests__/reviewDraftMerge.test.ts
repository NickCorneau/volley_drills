import { beforeEach, describe, expect, it } from 'vitest'
import { db } from '../../db'
import {
  loadReviewDraft,
  patchReviewDraft,
  saveReviewDraft,
  submitReview,
} from '../review'

/**
 * U1 / Review-draft field merging (architecture pass).
 *
 * Drill Check and Review both autosave to the same `SessionReview`
 * draft row through `services/review`. Before U1, every write was a
 * full row replacement, so a Drill Check write with `sessionRpe: null`
 * could silently clobber the RPE the tester had typed on Review (or
 * vice versa for captures + form fields).
 *
 * The fix is `patchReviewDraft(executionLogId, patch)`: an
 * explicit-keys-only merge whose `'key' in patch` check distinguishes
 * "absent" (preserve) from "explicitly undefined" (clear). This file
 * pins the merge contract end-to-end against `fake-indexeddb`.
 */

const EXEC = 'exec-merge-test'

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

describe('patchReviewDraft (cross-surface field merging)', () => {
  it('preserves captures when a Review-only patch arrives later', async () => {
    await patchReviewDraft(EXEC, {
      perDrillCaptures: [
        {
          drillId: 'd1',
          variantId: 'd1-solo',
          blockIndex: 0,
          difficulty: 'too_easy',
          capturedAt: 1_000,
        },
      ],
    })

    await patchReviewDraft(EXEC, {
      sessionRpe: 5,
      goodPasses: 0,
      totalAttempts: 0,
    })

    const draft = await loadReviewDraft(EXEC)
    expect(draft?.sessionRpe).toBe(5)
    expect(draft?.perDrillCaptures).toHaveLength(1)
    expect(draft?.perDrillCaptures?.[0]?.difficulty).toBe('too_easy')
  })

  it('preserves RPE / note when a capture-only patch arrives later', async () => {
    await patchReviewDraft(EXEC, {
      sessionRpe: 6,
      goodPasses: 12,
      totalAttempts: 20,
      shortNote: 'Solid platform.',
      quickTags: ['notCaptured'],
    })

    await patchReviewDraft(EXEC, {
      perDrillCaptures: [
        {
          drillId: 'd1',
          variantId: 'd1-solo',
          blockIndex: 0,
          difficulty: 'still_learning',
          capturedAt: 2_000,
        },
      ],
    })

    const draft = await loadReviewDraft(EXEC)
    expect(draft?.sessionRpe).toBe(6)
    expect(draft?.shortNote).toBe('Solid platform.')
    expect(draft?.quickTags).toEqual(['notCaptured'])
    expect(draft?.perDrillCaptures).toHaveLength(1)
  })

  it('treats absent keys as preserve, not clear', async () => {
    await patchReviewDraft(EXEC, {
      sessionRpe: 7,
      goodPasses: 3,
      totalAttempts: 6,
      shortNote: 'First write.',
    })

    await patchReviewDraft(EXEC, { sessionRpe: 4 })

    const draft = await loadReviewDraft(EXEC)
    expect(draft?.sessionRpe).toBe(4)
    expect(draft?.goodPasses).toBe(3)
    expect(draft?.totalAttempts).toBe(6)
    expect(draft?.shortNote).toBe('First write.')
  })

  it('writes only listed defaults when no draft exists yet', async () => {
    await patchReviewDraft(EXEC, {
      perDrillCaptures: [
        {
          drillId: 'd1',
          variantId: 'd1-solo',
          blockIndex: 0,
          difficulty: 'too_hard',
          capturedAt: 3_000,
        },
      ],
    })

    const draft = await loadReviewDraft(EXEC)
    expect(draft?.status).toBe('draft')
    expect(draft?.sessionRpe).toBeNull()
    expect(draft?.goodPasses).toBe(0)
    expect(draft?.totalAttempts).toBe(0)
    expect(draft?.perDrillCaptures).toHaveLength(1)
  })

  it('does not overwrite a submitted record', async () => {
    await submitReview({
      executionLogId: EXEC,
      sessionRpe: 6,
      goodPasses: 10,
      totalAttempts: 15,
    })

    await patchReviewDraft(EXEC, { sessionRpe: 9 })

    const stored = await db.sessionReviews.where('executionLogId').equals(EXEC).first()
    expect(stored?.status).toBe('submitted')
    expect(stored?.sessionRpe).toBe(6)
  })

  it('does not overwrite a skipped record', async () => {
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

    await patchReviewDraft(EXEC, { sessionRpe: 4, perDrillCaptures: [] })

    const stored = await db.sessionReviews.where('executionLogId').equals(EXEC).first()
    expect(stored?.status).toBe('skipped')
    expect(stored?.sessionRpe).toBeNull()
  })

  it('serial patches from concurrent surfaces land both fields', async () => {
    // Simulate Drill Check and Review autosaves landing back-to-back.
    await Promise.all([
      patchReviewDraft(EXEC, {
        perDrillCaptures: [
          {
            drillId: 'd1',
            variantId: 'd1-solo',
            blockIndex: 0,
            difficulty: 'too_easy',
            capturedAt: 4_000,
          },
        ],
      }),
      patchReviewDraft(EXEC, {
        sessionRpe: 8,
        goodPasses: 14,
        totalAttempts: 18,
        shortNote: 'Note.',
      }),
    ])

    const draft = await loadReviewDraft(EXEC)
    // Whichever write landed last decides the merged row, but both
    // surfaces' fields must survive — the merge must not blank the
    // other surface's key with stale defaults.
    expect(draft?.sessionRpe).toBe(8)
    expect(draft?.goodPasses).toBe(14)
    expect(draft?.shortNote).toBe('Note.')
    expect(draft?.perDrillCaptures).toHaveLength(1)
    expect(draft?.perDrillCaptures?.[0]?.difficulty).toBe('too_easy')
  })

  it('saveReviewDraft path stays compatible (preserves captures across full-shape writes)', async () => {
    await patchReviewDraft(EXEC, {
      perDrillCaptures: [
        {
          drillId: 'd1',
          variantId: 'd1-solo',
          blockIndex: 0,
          difficulty: 'too_easy',
          capturedAt: 5_000,
        },
      ],
    })

    await saveReviewDraft({
      executionLogId: EXEC,
      sessionRpe: 5,
      goodPasses: 0,
      totalAttempts: 0,
    })

    const draft = await loadReviewDraft(EXEC)
    expect(draft?.sessionRpe).toBe(5)
    // saveReviewDraft is now field-merging too, so the Drill Check
    // capture survives a Review-shape save that doesn't carry it.
    expect(draft?.perDrillCaptures).toHaveLength(1)
  })
})
