import { beforeEach, describe, expect, it } from 'vitest'
import { db } from '../../db'
import type { PerDrillCapture } from '../../db/types'
import {
  aggregateDrillCaptures,
  expireReview,
  loadReviewDraft,
  saveReviewDraft,
  submitReview,
} from '../review'

/**
 * Tier 1b D133 (2026-04-26): per-drill capture write-path coverage.
 *
 * Sources:
 *   docs/specs/m001-review-micro-spec.md §"Per-drill capture at Transition (D133)"
 *   docs/plans/2026-04-26-pair-rep-capture-tier1b.md
 *
 * What this file pins:
 *   - `aggregateDrillCaptures` shape over realistic mixed-row inputs
 *     (count rows, tag-only rows, notCaptured rows, empty input).
 *   - `saveReviewDraft` round-trips a non-empty `perDrillCaptures` array
 *     and drops an empty array off the wire.
 *   - `submitReview` carries `perDrillCaptures` onto the terminal record.
 *   - `expireReview` preserves `perDrillCaptures` from a draft when
 *     finalizing past the Finish-Later cap (adv-1 / adv-2 parity).
 */

const EXEC = 'exec-perdrill-test'

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

function makeCapture(overrides: Partial<PerDrillCapture>): PerDrillCapture {
  return {
    drillId: 'd99',
    variantId: 'd99-solo',
    blockIndex: 0,
    difficulty: 'still_learning',
    capturedAt: 0,
    ...overrides,
  }
}

beforeEach(async () => {
  await clearDb()
  await seed()
})

describe('aggregateDrillCaptures', () => {
  it('returns zeros for undefined input', () => {
    expect(aggregateDrillCaptures(undefined)).toEqual({
      goodPasses: 0,
      totalAttempts: 0,
      drillsWithCounts: 0,
      drillsNotCaptured: 0,
      drillsTagged: 0,
      tagBreakdown: { too_hard: 0, still_learning: 0, too_easy: 0 },
    })
  })

  it('returns zeros for empty array', () => {
    expect(aggregateDrillCaptures([])).toEqual({
      goodPasses: 0,
      totalAttempts: 0,
      drillsWithCounts: 0,
      drillsNotCaptured: 0,
      drillsTagged: 0,
      tagBreakdown: { too_hard: 0, still_learning: 0, too_easy: 0 },
    })
  })

  it('sums goodPasses + attemptCount only across rows that carry both', () => {
    const captures: PerDrillCapture[] = [
      makeCapture({ blockIndex: 0, goodPasses: 8, attemptCount: 12 }),
      makeCapture({ blockIndex: 1, goodPasses: 5, attemptCount: 10 }),
      makeCapture({ blockIndex: 2 }),
    ]
    const result = aggregateDrillCaptures(captures)
    expect(result.goodPasses).toBe(13)
    expect(result.totalAttempts).toBe(22)
    expect(result.drillsWithCounts).toBe(2)
    expect(result.drillsTagged).toBe(3)
  })

  it('does not impute zeros for tag-only rows (denominator anti-inflation)', () => {
    const captures: PerDrillCapture[] = [
      makeCapture({ blockIndex: 0, goodPasses: 4, attemptCount: 5 }),
      makeCapture({ blockIndex: 1 }),
      makeCapture({ blockIndex: 2 }),
    ]
    const result = aggregateDrillCaptures(captures)
    expect(result.totalAttempts).toBe(5)
    expect(result.drillsWithCounts).toBe(1)
    expect(result.drillsTagged).toBe(3)
  })

  it('routes notCaptured rows into drillsNotCaptured and excludes them from sums', () => {
    const captures: PerDrillCapture[] = [
      makeCapture({ blockIndex: 0, goodPasses: 6, attemptCount: 10 }),
      makeCapture({ blockIndex: 1, notCaptured: true }),
    ]
    const result = aggregateDrillCaptures(captures)
    expect(result.goodPasses).toBe(6)
    expect(result.totalAttempts).toBe(10)
    expect(result.drillsWithCounts).toBe(1)
    expect(result.drillsNotCaptured).toBe(1)
    expect(result.drillsTagged).toBe(2)
  })

  // 2026-04-27 pre-D91 editorial polish (plan Item 8): tag-distribution
  // bucket counts that drive the CompleteScreen "Difficulty:" recap row.
  // The three buckets exhaust the `DifficultyTag` union; a future fourth
  // tag must update both this contract and the consumer in CompleteScreen.
  describe('tagBreakdown (Item 8)', () => {
    it('counts each difficulty value across a mixed capture set', () => {
      const captures: PerDrillCapture[] = [
        makeCapture({ blockIndex: 0, difficulty: 'too_hard' }),
        makeCapture({ blockIndex: 1, difficulty: 'still_learning' }),
        makeCapture({ blockIndex: 2, difficulty: 'too_easy' }),
        makeCapture({ blockIndex: 3, difficulty: 'too_hard' }),
      ]
      const result = aggregateDrillCaptures(captures)
      expect(result.tagBreakdown).toEqual({
        too_hard: 2,
        still_learning: 1,
        too_easy: 1,
      })
    })

    it('counts notCaptured rows in the tag distribution (the chip was tapped)', () => {
      // notCaptured carries "I tagged the drill but skipped the counts."
      // The chip vote still represents the user's read of the drill, so
      // it counts toward the breakdown; only counts and rates exclude it.
      const captures: PerDrillCapture[] = [
        makeCapture({
          blockIndex: 0,
          difficulty: 'too_hard',
          notCaptured: true,
        }),
        makeCapture({
          blockIndex: 1,
          difficulty: 'still_learning',
          goodPasses: 5,
          attemptCount: 8,
        }),
      ]
      const result = aggregateDrillCaptures(captures)
      expect(result.tagBreakdown).toEqual({
        too_hard: 1,
        still_learning: 1,
        too_easy: 0,
      })
      expect(result.drillsNotCaptured).toBe(1)
      expect(result.drillsWithCounts).toBe(1)
    })

    it('collapses to a single non-zero bucket when every drill shared one tag', () => {
      const captures: PerDrillCapture[] = [
        makeCapture({ blockIndex: 0, difficulty: 'still_learning' }),
        makeCapture({ blockIndex: 1, difficulty: 'still_learning' }),
        makeCapture({ blockIndex: 2, difficulty: 'still_learning' }),
      ]
      const result = aggregateDrillCaptures(captures)
      expect(result.tagBreakdown).toEqual({
        too_hard: 0,
        still_learning: 3,
        too_easy: 0,
      })
    })
  })
})

describe('saveReviewDraft / loadReviewDraft round-trip perDrillCaptures', () => {
  it('persists a non-empty perDrillCaptures array and reads it back', async () => {
    const captures: PerDrillCapture[] = [
      makeCapture({ blockIndex: 0, goodPasses: 7, attemptCount: 10 }),
      makeCapture({ blockIndex: 1, difficulty: 'too_easy' }),
    ]
    await saveReviewDraft({
      executionLogId: EXEC,
      sessionRpe: null,
      goodPasses: 0,
      totalAttempts: 0,
      perDrillCaptures: captures,
    })
    const draft = await loadReviewDraft(EXEC)
    expect(draft?.perDrillCaptures).toEqual(captures)
  })

  it('drops an empty perDrillCaptures array off the wire (stored as undefined)', async () => {
    await saveReviewDraft({
      executionLogId: EXEC,
      sessionRpe: 4,
      goodPasses: 0,
      totalAttempts: 0,
      perDrillCaptures: [],
    })
    const draft = await loadReviewDraft(EXEC)
    expect(draft?.perDrillCaptures).toBeUndefined()
  })
})

describe('submitReview carries perDrillCaptures onto the terminal record', () => {
  it('persists a non-empty perDrillCaptures array onto the submitted review', async () => {
    const captures: PerDrillCapture[] = [
      makeCapture({ blockIndex: 0, goodPasses: 8, attemptCount: 12 }),
    ]
    const result = await submitReview({
      executionLogId: EXEC,
      sessionRpe: 5,
      goodPasses: 8,
      totalAttempts: 12,
      perDrillCaptures: captures,
    })
    expect(result.status).toBe('ok')

    const stored = await db.sessionReviews.where('executionLogId').equals(EXEC).first()
    expect(stored?.status).toBe('submitted')
    expect(stored?.perDrillCaptures).toEqual(captures)
  })

  it('omits perDrillCaptures (undefined) when none were collected', async () => {
    await submitReview({
      executionLogId: EXEC,
      sessionRpe: 5,
      goodPasses: 4,
      totalAttempts: 7,
    })
    const stored = await db.sessionReviews.where('executionLogId').equals(EXEC).first()
    expect(stored?.perDrillCaptures).toBeUndefined()
  })
})

describe('expireReview preserves perDrillCaptures from the draft (adv-1 / adv-2 parity)', () => {
  it('carries the draft captures onto the expired stub', async () => {
    const captures: PerDrillCapture[] = [
      makeCapture({ blockIndex: 0, goodPasses: 4, attemptCount: 7 }),
      makeCapture({ blockIndex: 1, difficulty: 'too_hard' }),
    ]
    await saveReviewDraft({
      executionLogId: EXEC,
      sessionRpe: 6,
      goodPasses: 0,
      totalAttempts: 0,
      perDrillCaptures: captures,
    })

    await expireReview({ executionLogId: EXEC })

    const stored = await db.sessionReviews.where('executionLogId').equals(EXEC).first()
    expect(stored?.status).toBe('skipped')
    expect(stored?.captureWindow).toBe('expired')
    expect(stored?.perDrillCaptures).toEqual(captures)
  })

  it('does not invent captures when there is no draft', async () => {
    await expireReview({ executionLogId: EXEC })

    const stored = await db.sessionReviews.where('executionLogId').equals(EXEC).first()
    expect(stored?.status).toBe('skipped')
    expect(stored?.perDrillCaptures).toBeUndefined()
  })
})
