import { describe, expect, it } from 'vitest'
import type { AdaptationDelta, SessionReview, VerdictChoice } from '../../../model'
import { stressLadderBounds } from '../../../data/stressLadders'
import {
  acceptedReviewMovedPosition,
  deriveStressPositions,
  directionCanMovePosition,
  prospectiveStressPosition,
} from '../stressPosition'

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

describe('directionCanMovePosition (R15 gate predicate)', () => {
  it('blocks "less" at the ladder floor and "more" at the top', () => {
    const { min, max } = stressLadderBounds('serve')
    expect(directionCanMovePosition('serve', min, 'less')).toBe(false)
    expect(directionCanMovePosition('serve', max, 'more')).toBe(false)
  })

  it('allows movable directions mid-ladder and at the opposite bound', () => {
    const { min, max } = stressLadderBounds('serve')
    expect(directionCanMovePosition('serve', min, 'more')).toBe(true)
    expect(directionCanMovePosition('serve', max, 'less')).toBe(true)
    expect(directionCanMovePosition('pass', 3, 'more')).toBe(true)
    expect(directionCanMovePosition('pass', 3, 'less')).toBe(true)
  })

  it('keep can never move', () => {
    expect(directionCanMovePosition('pass', 3, 'keep')).toBe(false)
  })
})

describe('prospectiveStressPosition', () => {
  it('steps one rung in the direction, clamped to the ladder bounds', () => {
    expect(prospectiveStressPosition('pass', 1, 'more')).toBe(2)
    expect(prospectiveStressPosition('pass', 2, 'less')).toBe(1)
    expect(prospectiveStressPosition('pass', 1, 'less')).toBe(1)
    const { max } = stressLadderBounds('set')
    expect(prospectiveStressPosition('set', max, 'more')).toBe(max)
    expect(prospectiveStressPosition('set', 3, 'keep')).toBe(3)
  })
})

describe('acceptedReviewMovedPosition (movement detection)', () => {
  it('a mid-ladder accept reports movement', () => {
    const accept = verdictReview('pass', 'more', 'accepted', 1000)
    expect(acceptedReviewMovedPosition([accept], accept, 'beginner')).toBe(true)
  })

  it('a historical clamped accept reports no movement', () => {
    // Beginner pass starts at rung 1; an accepted 'less' was clamped —
    // exactly the pre-gating record that must never arm a steering line.
    const clamped = verdictReview('pass', 'less', 'accepted', 1000)
    expect(acceptedReviewMovedPosition([clamped], clamped, 'beginner')).toBe(false)
  })

  it('band-dependence: the same accept can be clamped in one band and movable in another', () => {
    // Intermediate pass starts at rung 2, so the 'less' accept moves
    // (2 → 1) — the beginner default would mask exactly this case.
    const accept = verdictReview('pass', 'less', 'accepted', 1000)
    expect(acceptedReviewMovedPosition([accept], accept, 'intermediate')).toBe(true)
    expect(acceptedReviewMovedPosition([accept], accept, 'beginner')).toBe(false)
  })

  it('later reviews do not affect whether an earlier accept moved', () => {
    const first = verdictReview('pass', 'more', 'accepted', 1000)
    const later = verdictReview('pass', 'less', 'accepted', 2000)
    expect(acceptedReviewMovedPosition([first, later], first, 'beginner')).toBe(true)
  })

  it('kept-original, keep-direction, and non-scoped rows report no movement', () => {
    const kept = verdictReview('pass', 'more', 'kept_original', 1000)
    const keep = verdictReview('pass', 'keep', 'accepted', 2000)
    const nonScoped = verdictReview('movement', 'more', 'accepted', 3000)
    const all = [kept, keep, nonScoped]
    expect(acceptedReviewMovedPosition(all, kept, 'beginner')).toBe(false)
    expect(acceptedReviewMovedPosition(all, keep, 'beginner')).toBe(false)
    expect(acceptedReviewMovedPosition(all, nonScoped, 'beginner')).toBe(false)
  })
})
