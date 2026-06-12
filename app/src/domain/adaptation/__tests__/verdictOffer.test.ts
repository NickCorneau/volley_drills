import { buildVerdictReplayInput, computeVerdictOffer } from '../verdictOffer'
import { stressLadderBounds } from '../../../data/stressLadders'
import type { DifficultyTag, SessionReview } from '../../../model'

function review(opts: {
  execId: string
  submittedAt: number
  passTags?: DifficultyTag[]
  rpe?: number
  status?: 'submitted' | 'skipped'
  eligible?: boolean
}): SessionReview {
  return {
    id: `review-${opts.execId}`,
    executionLogId: opts.execId,
    sessionRpe: opts.rpe ?? 5,
    goodPasses: 0,
    totalAttempts: 0,
    submittedAt: opts.submittedAt,
    status: opts.status ?? 'submitted',
    eligibleForAdaptation: opts.eligible ?? true,
    perDrillCaptures: opts.passTags?.map((tag, i) => ({
      drillId: 'd01', // pass focus
      variantId: 'd01-solo',
      blockIndex: i,
      difficulty: tag,
      capturedAt: opts.submittedAt,
    })),
  }
}

describe('buildVerdictReplayInput', () => {
  it('excludes the current (under-review) session and orders prior sessions oldest-first', () => {
    const reviews = [
      review({ execId: 'old', submittedAt: 100, passTags: ['too_hard'] }),
      review({ execId: 'current', submittedAt: 300, passTags: ['too_easy'] }),
    ]
    const input = buildVerdictReplayInput(reviews, 'pass', 'current')
    expect(input.currentFocus).toBe('pass')
    expect(input.recentTagsForFocus).toEqual([['too_hard']])
  })

  it('only includes sessions that trained the focus', () => {
    const reviews = [
      review({ execId: 'a', submittedAt: 100, passTags: ['too_hard'] }),
      review({ execId: 'b', submittedAt: 200 }), // no captures -> didn't train pass
    ]
    const input = buildVerdictReplayInput(reviews, 'pass', 'current')
    expect(input.recentTagsForFocus).toEqual([['too_hard']])
    expect(input.recentRpe).toEqual([5])
  })

  it('excludes skipped / ineligible prior sessions', () => {
    const reviews = [
      review({ execId: 'skip', submittedAt: 100, passTags: ['too_hard'], status: 'skipped' }),
      review({ execId: 'late', submittedAt: 200, passTags: ['too_hard'], eligible: false }),
    ]
    const input = buildVerdictReplayInput(reviews, 'pass', 'current')
    expect(input.recentTagsForFocus).toEqual([])
  })

  it('surfaces the most recent prior verdict for the focus', () => {
    const reviews: SessionReview[] = [
      {
        ...review({ execId: 'a', submittedAt: 100, passTags: ['too_hard'] }),
        offeredDelta: { kind: 'stress', focus: 'pass', direction: 'less' },
        verdictChoice: 'kept_original',
      },
    ]
    const input = buildVerdictReplayInput(reviews, 'pass', 'current')
    expect(input.priorVerdict).toEqual({ direction: 'less', choice: 'kept_original' })
  })
})

describe('computeVerdictOffer', () => {
  it('offers "less" on a sustained too_hard trend over prior pass sessions', () => {
    const reviews = [
      review({ execId: 'a', submittedAt: 100, passTags: ['too_hard', 'too_hard'], rpe: 5 }),
      review({ execId: 'b', submittedAt: 200, passTags: ['too_hard', 'too_hard'], rpe: 5 }),
    ]
    expect(computeVerdictOffer(reviews, 'pass', 'current')).toEqual({
      kind: 'stress',
      focus: 'pass',
      direction: 'less',
    })
  })

  it('returns keep when there is no sustained prior trend', () => {
    const reviews = [review({ execId: 'a', submittedAt: 100, passTags: ['too_hard'] })]
    expect(computeVerdictOffer(reviews, 'pass', 'current').direction).toBe('keep')
  })
})

/**
 * Trust-loop U2 — position-aware offer gating (R15/KTD4). No delta is
 * offered whose acceptance cannot move the position at a ladder bound.
 */
describe('computeVerdictOffer position gating (R15)', () => {
  const positions = (overrides: Partial<Record<'pass' | 'serve' | 'set', number>>) => ({
    pass: 3,
    serve: 3,
    set: 3,
    ...overrides,
  })

  function serveReview(opts: { execId: string; submittedAt: number; tags: DifficultyTag[] }) {
    return {
      ...review({ execId: opts.execId, submittedAt: opts.submittedAt }),
      perDrillCaptures: opts.tags.map((tag, i) => ({
        drillId: 'd31', // serve focus
        variantId: 'd31-solo-open',
        blockIndex: i,
        difficulty: tag,
        capturedAt: opts.submittedAt,
      })),
    }
  }

  it('AE7: beginner at the pass ladder floor with a too-hard trend gets no "less" offer', () => {
    const reviews = [
      review({ execId: 'a', submittedAt: 100, passTags: ['too_hard', 'too_hard'] }),
      review({ execId: 'b', submittedAt: 200, passTags: ['too_hard', 'too_hard'] }),
    ]
    const gated = computeVerdictOffer(reviews, 'pass', 'current', positions({ pass: 1 }))
    expect(gated.direction).toBe('keep')
  })

  it('AE7: advanced at the serve ladder top with a too-easy trend gets no "more" offer', () => {
    const reviews = [
      serveReview({ execId: 'a', submittedAt: 100, tags: ['too_easy', 'too_easy'] }),
      serveReview({ execId: 'b', submittedAt: 200, tags: ['too_easy', 'too_easy'] }),
    ]
    const top = stressLadderBounds('serve').max
    const gated = computeVerdictOffer(reviews, 'serve', 'current', positions({ serve: top }))
    expect(gated.direction).toBe('keep')
  })

  it('mid-ladder trends keep their offers unchanged from today', () => {
    const reviews = [
      review({ execId: 'a', submittedAt: 100, passTags: ['too_hard', 'too_hard'] }),
      review({ execId: 'b', submittedAt: 200, passTags: ['too_hard', 'too_hard'] }),
    ]
    expect(computeVerdictOffer(reviews, 'pass', 'current', positions({ pass: 3 }))).toEqual({
      kind: 'stress',
      focus: 'pass',
      direction: 'less',
    })
  })

  it('omitted positions keep the legacy ungated read', () => {
    const reviews = [
      review({ execId: 'a', submittedAt: 100, passTags: ['too_hard', 'too_hard'] }),
      review({ execId: 'b', submittedAt: 200, passTags: ['too_hard', 'too_hard'] }),
    ]
    expect(computeVerdictOffer(reviews, 'pass', 'current').direction).toBe('less')
  })

  it('gating composes with hysteresis: a gated direction does not poison later offers the other way', () => {
    // Floor-gated 'less' is never offered, so no declined verdict is
    // persisted for it — a later too-easy trend must still offer 'more'
    // (F13 suppression keys on persisted priorVerdict only).
    const hardTrend = [
      review({ execId: 'a', submittedAt: 100, passTags: ['too_hard', 'too_hard'] }),
      review({ execId: 'b', submittedAt: 200, passTags: ['too_hard', 'too_hard'] }),
    ]
    expect(computeVerdictOffer(hardTrend, 'pass', 'current', positions({ pass: 1 })).direction).toBe(
      'keep',
    )

    const laterEasyTrend = [
      ...hardTrend,
      review({ execId: 'c', submittedAt: 300, passTags: ['too_easy', 'too_easy'] }),
      review({ execId: 'd', submittedAt: 400, passTags: ['too_easy', 'too_easy'] }),
    ]
    expect(
      computeVerdictOffer(laterEasyTrend, 'pass', 'current', positions({ pass: 1 })).direction,
    ).toBe('more')
  })
})
