import { describe, expect, it } from 'vitest'
import type { AdaptationDelta, SessionReview, VerdictChoice } from '../../../model'
import {
  composeSteeringLine,
  deriveSteeringTrace,
  resolveArmedPromise,
  type SteeringTraceInput,
} from '../steeringTrace'

let reviewCounter = 0

function review(overrides: Partial<SessionReview> = {}): SessionReview {
  reviewCounter += 1
  return {
    id: `review-${reviewCounter}`,
    executionLogId: `log-${reviewCounter}`,
    sessionRpe: 5,
    goodPasses: 0,
    totalAttempts: 0,
    submittedAt: reviewCounter * 1000,
    status: 'submitted',
    ...overrides,
  }
}

function verdictReview(
  focus: AdaptationDelta['focus'],
  direction: AdaptationDelta['direction'],
  choice: VerdictChoice,
  submittedAt: number,
): SessionReview {
  return review({
    offeredDelta: { kind: 'stress', focus, direction },
    verdictChoice: choice,
    submittedAt,
  })
}

function traceInput(overrides: Partial<SteeringTraceInput> = {}): SteeringTraceInput {
  return {
    draft: null,
    reviews: [],
    terminalSteeredPlans: [],
    everSteeredPlan: false,
    disclosureDismissed: false,
    ...overrides,
  }
}

/** Trust-loop U4 (2026-06-11 plan): KTD5 cash trigger + R9/R10 flags. */
describe('resolveArmedPromise', () => {
  it('arms on a position-moving accept with no consuming terminal plan', () => {
    const reviews = [verdictReview('set', 'more', 'accepted', 1000)]
    expect(resolveArmedPromise(reviews, 'set', [])).toEqual({
      focus: 'set',
      direction: 'more',
      acceptedAt: 1000,
    })
  })

  it('does not arm on kept_original or keep-direction rows', () => {
    expect(
      resolveArmedPromise([verdictReview('set', 'more', 'kept_original', 1000)], 'set', []),
    ).toBeNull()
    expect(
      resolveArmedPromise([verdictReview('set', 'keep', 'accepted', 1000)], 'set', []),
    ).toBeNull()
  })

  it('per-focus isolation: an accept on pass does not arm set', () => {
    const reviews = [verdictReview('pass', 'more', 'accepted', 1000)]
    expect(resolveArmedPromise(reviews, 'set', [])).toBeNull()
    expect(resolveArmedPromise(reviews, 'pass', [])).not.toBeNull()
  })

  it('a historical clamped accept does not arm (R11)', () => {
    // Beginner set starts at rung 1; an accepted 'less' was clamped —
    // exactly the pre-gating record that must never arm a line.
    const reviews = [verdictReview('set', 'less', 'accepted', 1000)]
    expect(resolveArmedPromise(reviews, 'set', [], 'beginner')).toBeNull()
  })

  it('band-dependence: the same clamped-under-beginner accept arms under intermediate', () => {
    const reviews = [verdictReview('set', 'less', 'accepted', 1000)]
    expect(resolveArmedPromise(reviews, 'set', [], 'intermediate')).toEqual({
      focus: 'set',
      direction: 'less',
      acceptedAt: 1000,
    })
  })

  it('a terminal steered plan created after the accept consumes the promise', () => {
    const reviews = [verdictReview('set', 'more', 'accepted', 1000)]
    expect(resolveArmedPromise(reviews, 'set', [2000])).toBeNull()
  })

  it('deferred review: a plan created before the accept does not consume', () => {
    const reviews = [verdictReview('set', 'more', 'accepted', 3000)]
    expect(resolveArmedPromise(reviews, 'set', [2000])).not.toBeNull()
  })

  it('anchors on the latest accepted direction (netted opposite accepts)', () => {
    // more (1 → 2) then less (2 → 1): net zero, but the contract in
    // effect is the latest accept — KTD5 anchors there deliberately.
    const reviews = [
      verdictReview('set', 'more', 'accepted', 1000),
      verdictReview('set', 'less', 'accepted', 2000),
    ]
    expect(resolveArmedPromise(reviews, 'set', [])).toEqual({
      focus: 'set',
      direction: 'less',
      acceptedAt: 2000,
    })
  })
})

describe('deriveSteeringTrace', () => {
  const armedReviews = [verdictReview('set', 'more', 'accepted', 1000)]

  it('renders the line on a steered draft built after the arming accept (AE2)', () => {
    const model = deriveSteeringTrace(
      traceInput({
        draft: { steeredFocus: 'set', updatedAt: 2000 },
        reviews: armedReviews,
      }),
    )
    expect(model.line).toBe('A bit more stress on setting today.')
  })

  it('stale steered draft built before the arming accept renders no line', () => {
    const model = deriveSteeringTrace(
      traceInput({
        draft: { steeredFocus: 'set', updatedAt: 500 },
        reviews: armedReviews,
      }),
    )
    expect(model.line).toBeNull()
  })

  it('consumed promise renders no line (AE2 second steered session)', () => {
    const model = deriveSteeringTrace(
      traceInput({
        draft: { steeredFocus: 'set', updatedAt: 5000 },
        reviews: armedReviews,
        terminalSteeredPlans: [{ steeredFocus: 'set', createdAt: 2000 }],
        everSteeredPlan: true,
      }),
    )
    expect(model.line).toBeNull()
  })

  it('a terminal steered plan on ANOTHER focus does not consume', () => {
    const model = deriveSteeringTrace(
      traceInput({
        draft: { steeredFocus: 'set', updatedAt: 5000 },
        reviews: armedReviews,
        terminalSteeredPlans: [{ steeredFocus: 'pass', createdAt: 2000 }],
        everSteeredPlan: true,
      }),
    )
    expect(model.line).toBe('A bit more stress on setting today.')
  })

  it('unsteered draft (repeat / substitution / recovery) renders no line and no disclosure (AE5)', () => {
    const model = deriveSteeringTrace(
      traceInput({
        draft: { steeredFocus: undefined, updatedAt: 5000 },
        reviews: armedReviews,
      }),
    )
    expect(model.line).toBeNull()
    expect(model.showDisclosure).toBe(false)
    expect(model.showGloss).toBe(false)
  })

  it('steered draft with no accepted deltas renders disclosure but no line (AE3)', () => {
    const model = deriveSteeringTrace(
      traceInput({ draft: { steeredFocus: 'set', updatedAt: 1000 } }),
    )
    expect(model.line).toBeNull()
    expect(model.showDisclosure).toBe(true)
    expect(model.showGloss).toBe(true)
  })

  it('dismissal flag silences the disclosure but not the line (R9)', () => {
    const model = deriveSteeringTrace(
      traceInput({
        draft: { steeredFocus: 'set', updatedAt: 2000 },
        reviews: armedReviews,
        disclosureDismissed: true,
      }),
    )
    expect(model.showDisclosure).toBe(false)
    expect(model.line).toBe('A bit more stress on setting today.')
  })

  it('gloss reachable on an unsteered draft once any persisted plan was steered (R10)', () => {
    const model = deriveSteeringTrace(
      traceInput({
        draft: { steeredFocus: undefined, updatedAt: 5000 },
        everSteeredPlan: true,
      }),
    )
    expect(model.showGloss).toBe(true)
    expect(model.line).toBeNull()
    expect(model.showDisclosure).toBe(false)
  })

  it('missing draft renders nothing', () => {
    const model = deriveSteeringTrace(traceInput({ reviews: armedReviews }))
    expect(model).toEqual({ line: null, showDisclosure: false, showGloss: false })
  })
})

describe('steering line copy (KTD9 / AE6)', () => {
  it("renders the easing voice for the 'less' direction", () => {
    expect(composeSteeringLine('set', 'less')).toBe('Easing the stress on setting today.')
    expect(composeSteeringLine('pass', 'less')).toBe('Easing the stress on passing today.')
  })

  it('jargon gate: no reserved vocabulary, raw numbers, or em-dashes in any line', () => {
    const lines = (['pass', 'serve', 'set'] as const).flatMap((focus) => [
      composeSteeringLine(focus, 'more'),
      composeSteeringLine(focus, 'less'),
    ])
    for (const line of lines) {
      expect(line).not.toMatch(/rung|ladder|steer|position/i)
      expect(line).not.toMatch(/\d/)
      expect(line).not.toContain('\u2014')
    }
  })
})
