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
import type { PlayerLevel, SessionReview } from '../../model'
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
