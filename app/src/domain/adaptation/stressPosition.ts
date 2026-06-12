/**
 * Stress-substrate (D154) — derived per-focus ladder position.
 *
 * Pure fold over already-persisted review rows (D150: nothing new is
 * written). M002.1 persists the offered delta + the accept/keep choice
 * on each `SessionReview`; position is simply the band-mapped starting
 * rung plus every ACCEPTED directional verdict replayed in submission
 * order, clamped to the focus ladder's bounds at every step (so an
 * over-the-top acceptance history comes back down symmetrically).
 *
 * Movement is acceptance-gated by design: kept-original rows, rows
 * without a verdict, and `keep`-direction deltas move nothing. The
 * persisted `offeredDelta.focus` is the wider `SkillFocus` (see
 * `model/adaptation.ts`), so the fold narrows it via `isScopedFocus`
 * and skips non-scoped values defensively.
 *
 * Pure domain: imports only model + data + sibling domain, mirroring
 * `verdictOffer.ts`.
 */
import type { PlayerLevel, SessionReview, StressDirection } from '../../model'
import { startingStressRung, stressLadderBounds } from '../../data/stressLadders'
import { isScopedFocus, SCOPED_FOCUSES, type ScopedFocus } from '../eligibleSessions'

export type StressPositions = Record<ScopedFocus, number>

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

/**
 * Derive the current per-focus ladder positions. `band` defaults to
 * `'beginner'` when onboarding never persisted a level (`'unsure'`
 * already maps to beginner upstream).
 */
export function deriveStressPositions(
  reviews: readonly SessionReview[],
  band: PlayerLevel = 'beginner',
): StressPositions {
  const positions = {} as Record<ScopedFocus, number>
  for (const focus of SCOPED_FOCUSES) {
    positions[focus] = startingStressRung(focus, band)
  }

  const ordered = [...reviews].sort((a, b) => a.submittedAt - b.submittedAt)
  for (const review of ordered) {
    const delta = review.offeredDelta
    if (!delta || review.verdictChoice !== 'accepted') continue
    // Future-proofing: only the `stress` arm moves ladder positions.
    // Statically always-true today (v1 ships one arm), but the planned
    // M002.3 `score` arm must not silently step a stress ladder.
    if (delta.kind !== 'stress') continue
    if (delta.direction === 'keep') continue
    if (!isScopedFocus(delta.focus)) continue

    const { min, max } = stressLadderBounds(delta.focus)
    const step = delta.direction === 'more' ? 1 : -1
    positions[delta.focus] = clamp(positions[delta.focus] + step, min, max)
  }

  return positions
}

/**
 * True when stepping one rung in `direction` from `position` actually
 * changes it — false at the ladder bound (and always false for
 * `keep`). The trust-loop offer gate (R15): no delta is offered whose
 * acceptance cannot move the position.
 */
export function directionCanMovePosition(
  focus: ScopedFocus,
  position: number,
  direction: StressDirection,
): boolean {
  if (direction === 'keep') return false
  const { min, max } = stressLadderBounds(focus)
  return direction === 'more' ? position < max : position > min
}

/**
 * The clamped position one rung in `direction` — the prospective
 * position an accepted delta would steer toward. Feeds the Review
 * accept-consequence exemplar (U3).
 */
export function prospectiveStressPosition(
  focus: ScopedFocus,
  position: number,
  direction: StressDirection,
): number {
  if (direction === 'keep') return position
  const { min, max } = stressLadderBounds(focus)
  const step = direction === 'more' ? 1 : -1
  return clamp(position + step, min, max)
}

/**
 * Did this accepted review actually move its focus position at its
 * point in the fold? Fold-compare: positions over the prefix up to and
 * including the review vs the same prefix without it. A clamped accept
 * (accepted at a ladder bound, pre-gating historical records) reports
 * `false` — movement-based derivations stay quiet rather than
 * rendering false steering lines (R11). Reviews submitted after this
 * one cannot affect the answer.
 */
export function acceptedReviewMovedPosition(
  reviews: readonly SessionReview[],
  review: SessionReview,
  band: PlayerLevel = 'beginner',
): boolean {
  const delta = review.offeredDelta
  if (!delta || review.verdictChoice !== 'accepted') return false
  if (delta.kind !== 'stress' || delta.direction === 'keep') return false
  if (!isScopedFocus(delta.focus)) return false

  const prefix = reviews.filter((r) => r.submittedAt <= review.submittedAt)
  const withReview = deriveStressPositions(prefix, band)
  const withoutReview = deriveStressPositions(
    prefix.filter((r) => r.id !== review.id),
    band,
  )
  return withReview[delta.focus] !== withoutReview[delta.focus]
}
