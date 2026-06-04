import { buildVerdictReplayInput, computeVerdictOffer } from '../verdictOffer'
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
