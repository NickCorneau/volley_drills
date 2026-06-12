/**
 * Trust-loop U4 — Safety steering-trace selectors (R6/R7/R9/R10/R11).
 *
 * Pure domain: everything derives from existing records plus the one
 * `steeredFocus` provenance stamp (U1). The honesty gate is structural
 * here — a trace can only render when the loaded draft's assembly was
 * actually rung-steered on that focus AND the promise it cashes is
 * armed by an accept that actually moved the position.
 *
 * KTD5 cash trigger, in full:
 * - Armed(F): the latest accepted review on F moved the position
 *   (fold-compare, band-aware), and no TERMINAL session stamped
 *   `steeredFocus === F` was assembled after it. Requiring a terminal
 *   session means a built-then-discarded draft does not burn the
 *   promise; a repeat carries no provenance and can never consume.
 * - The line renders only on a draft built after the arming accept's
 *   `submittedAt`: a steered draft assembled before the accept (a
 *   stale draft resurfaced from Home after a deferred review) was
 *   steered at the OLD position and renders nothing.
 * - Direction anchors on the accepted plan state ratified at Review,
 *   not the athlete's last trained session — netted opposite accepts
 *   render the latest accepted direction deliberately (the line
 *   confirms the contract in effect).
 *
 * Note: Home's carry-forward summary uses global-latest-verdict
 * semantics (`resolveLastAcceptedDelta` in `services/planInputs.ts`)
 * while this line is per-focus armed — the two can intentionally tell
 * different stories. Do not "fix" one to match the other.
 */
import type { PlayerLevel, SessionDraft, SessionPlan, SessionReview } from '../../model'
import { isScopedFocus, type ScopedFocus } from '../eligibleSessions'
import { acceptedReviewMovedPosition } from './stressPosition'

/** KTD9 voice: present-tense, today-scoped, no stress vocabulary beyond the shipped carry-forward register. */
const MORE_TODAY: Record<ScopedFocus, string> = {
  pass: 'A bit more stress on passing today.',
  serve: 'A bit more stress on serving today.',
  set: 'A bit more stress on setting today.',
}

const LESS_TODAY: Record<ScopedFocus, string> = {
  pass: 'Easing the stress on passing today.',
  serve: 'Easing the stress on serving today.',
  set: 'Easing the stress on setting today.',
}

export interface ArmedSteeringPromise {
  focus: ScopedFocus
  direction: 'more' | 'less'
  /** `submittedAt` of the arming accepted review. */
  acceptedAt: number
}

/**
 * The armed promise for `focus`, or null. `terminalSteeredPlanCreatedAts`
 * carries the `createdAt` of every TERMINAL (trained) plan stamped
 * `steeredFocus === focus`; the caller (service tier) owns that join.
 */
export function resolveArmedPromise(
  reviews: readonly SessionReview[],
  focus: ScopedFocus,
  terminalSteeredPlanCreatedAts: readonly number[],
  band: PlayerLevel = 'beginner',
): ArmedSteeringPromise | null {
  const latestAccept = reviews
    .filter(
      (review) =>
        review.status === 'submitted' &&
        review.verdictChoice === 'accepted' &&
        review.offeredDelta?.kind === 'stress' &&
        review.offeredDelta.focus === focus &&
        review.offeredDelta.direction !== 'keep',
    )
    .sort((a, b) => b.submittedAt - a.submittedAt)[0]
  const delta = latestAccept?.offeredDelta
  if (!latestAccept || !delta || delta.direction === 'keep') return null

  // R11: a clamped accept (historical pre-gating record) moved nothing
  // and must never arm a line. Band-aware — see `acceptedReviewMovedPosition`.
  if (!acceptedReviewMovedPosition(reviews, latestAccept, band)) return null

  // Consumed: a steered-on-F session was trained after the accept.
  const consumed = terminalSteeredPlanCreatedAts.some((t) => t > latestAccept.submittedAt)
  if (consumed) return null

  return { focus, direction: delta.direction, acceptedAt: latestAccept.submittedAt }
}

export function composeSteeringLine(focus: ScopedFocus, direction: 'more' | 'less'): string {
  return direction === 'more' ? MORE_TODAY[focus] : LESS_TODAY[focus]
}

export interface SteeringTraceInput {
  /** The draft Safety loaded; null defends the missing-draft edge. */
  draft: Pick<SessionDraft, 'steeredFocus' | 'updatedAt'> | null
  reviews: readonly SessionReview[]
  /** Terminal (trained) plans carrying any `steeredFocus` stamp. */
  terminalSteeredPlans: readonly Pick<SessionPlan, 'steeredFocus' | 'createdAt'>[]
  /** Any persisted plan carries `steeredFocus` (terminal or not). */
  everSteeredPlan: boolean
  band?: PlayerLevel
  /** `ux.adaptDisclosureDismissed` flag state. */
  disclosureDismissed: boolean
}

export interface SteeringTraceModel {
  /** The per-focus steering line, or null (quiet). */
  line: string | null
  /** First-steered one-time disclosure (R9); never after dismissal. */
  showDisclosure: boolean
  /** "How sessions adapt" gloss reachability (R10). */
  showGloss: boolean
}

export function deriveSteeringTrace(input: SteeringTraceInput): SteeringTraceModel {
  const focus = input.draft?.steeredFocus
  const steered = focus !== undefined && isScopedFocus(focus)

  let line: string | null = null
  if (steered && input.draft) {
    const armed = resolveArmedPromise(
      input.reviews,
      focus,
      input.terminalSteeredPlans
        .filter((plan) => plan.steeredFocus === focus)
        .map((plan) => plan.createdAt),
      input.band,
    )
    if (armed && input.draft.updatedAt > armed.acceptedAt) {
      line = composeSteeringLine(focus, armed.direction)
    }
  }

  return {
    line,
    // R9: the disclosure triggers on a steered draft and only an
    // explicit dismissal silences it — a glanced-past disclosure
    // re-shows on the next steered Safety visit. It may coexist with
    // the line (the disclosure states the contract; the line
    // instantiates it).
    showDisclosure: steered && !input.disclosureDismissed,
    // R10: reachable once the athlete has EVER been steered (current
    // draft or any persisted plan), so the contract stays readable on
    // repeats and unsteered sessions; never before the first steered
    // session.
    showGloss: steered || input.everSteeredPlan,
  }
}
