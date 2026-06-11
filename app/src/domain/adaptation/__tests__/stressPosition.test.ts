import { describe, expect, it } from 'vitest'
import type { AdaptationDelta, SessionReview, VerdictChoice } from '../../../model'
import { stressLadderBounds } from '../../../data/stressLadders'
import { deriveStressPositions } from '../stressPosition'

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
  submittedAt?: number,
): SessionReview {
  return review({
    offeredDelta: { kind: 'stress', focus, direction },
    verdictChoice: choice,
    ...(submittedAt === undefined ? {} : { submittedAt }),
  })
}

describe('deriveStressPositions', () => {
  it('is pure: the same input twice derives identical positions (AE5)', () => {
    const reviews = [
      verdictReview('pass', 'more', 'accepted'),
      verdictReview('serve', 'less', 'accepted'),
    ]
    expect(deriveStressPositions(reviews, 'intermediate')).toEqual(
      deriveStressPositions(reviews, 'intermediate'),
    )
  })

  it('starts at the band starting rung per focus with no accepted verdicts', () => {
    expect(deriveStressPositions([], 'beginner')).toEqual({ pass: 1, serve: 1, set: 1 })
    expect(deriveStressPositions([], 'intermediate')).toEqual({ pass: 2, serve: 2, set: 2 })
    // Advanced maps to 4 and lands on the serve ladder's top rung.
    expect(deriveStressPositions([], 'advanced')).toEqual({ pass: 4, serve: 4, set: 4 })
  })

  it('defaults the band to beginner when none was persisted', () => {
    expect(deriveStressPositions([])).toEqual({ pass: 1, serve: 1, set: 1 })
  })

  it('moves only the accepted focus, one rung per acceptance (AE1)', () => {
    const positions = deriveStressPositions([verdictReview('pass', 'more', 'accepted')], 'beginner')
    expect(positions).toEqual({ pass: 2, serve: 1, set: 1 })
  })

  it('kept-original verdicts move nothing (AE2)', () => {
    const positions = deriveStressPositions(
      [verdictReview('pass', 'more', 'kept_original')],
      'beginner',
    )
    expect(positions).toEqual({ pass: 1, serve: 1, set: 1 })
  })

  it('accumulates acceptances: two more then one less nets +1', () => {
    const positions = deriveStressPositions(
      [
        verdictReview('set', 'more', 'accepted'),
        verdictReview('set', 'more', 'accepted'),
        verdictReview('set', 'less', 'accepted'),
      ],
      'beginner',
    )
    expect(positions.set).toBe(2)
  })

  it('clamps at the top rung without error (AE4)', () => {
    const { max } = stressLadderBounds('serve')
    const acceptances = Array.from({ length: max + 3 }, () =>
      verdictReview('serve', 'more', 'accepted'),
    )
    expect(deriveStressPositions(acceptances, 'beginner').serve).toBe(max)
  })

  it('clamps at rung 1 on the way down (AE4)', () => {
    const positions = deriveStressPositions(
      [verdictReview('pass', 'less', 'accepted'), verdictReview('pass', 'less', 'accepted')],
      'beginner',
    )
    expect(positions.pass).toBe(1)
  })

  it('clamp-per-step lets an over-the-top history come back down symmetrically', () => {
    const { max } = stressLadderBounds('serve')
    const positions = deriveStressPositions(
      [
        ...Array.from({ length: max + 2 }, () => verdictReview('serve', 'more', 'accepted')),
        verdictReview('serve', 'less', 'accepted'),
      ],
      'beginner',
    )
    expect(positions.serve).toBe(max - 1)
  })

  it('skips keep-direction deltas, missing fields, and non-scoped focuses', () => {
    const positions = deriveStressPositions(
      [
        verdictReview('pass', 'keep', 'accepted'),
        review(), // no offeredDelta / verdictChoice (pre-M002.1 row)
        verdictReview('movement', 'more', 'accepted'), // non-scoped focus
      ],
      'beginner',
    )
    expect(positions).toEqual({ pass: 1, serve: 1, set: 1 })
  })

  it('sorts unsorted input by submittedAt before folding', () => {
    // Down-then-up applied in timestamp order from rung 2: 2 -> 1 -> 2.
    // Misordered (up-then-down) would also end at 2 from rung 2, so use
    // beginner start (rung 1) where order changes the outcome:
    // correct order less(no-op at 1) then more => 2; wrong order
    // more then less => 1.
    const positions = deriveStressPositions(
      [
        verdictReview('pass', 'more', 'accepted', 2000),
        verdictReview('pass', 'less', 'accepted', 1000),
      ],
      'beginner',
    )
    expect(positions.pass).toBe(2)
  })
})
