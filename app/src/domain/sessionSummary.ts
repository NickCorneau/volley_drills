import type { SessionPlan, SessionReview } from '../db'
import { TUNING_FLOOR_ATTEMPTS } from './policies'

/**
 * Session-summary composer (C-2 Unit 1).
 *
 * Sole source of truth for the 3-case post-session copy matrix (A2
 * pain-first, H10 3-case collapse; see
 * `docs/plans/2026-04-16-004-red-team-fixes-plan.md` §A2 and the UX
 * spec's Surface 5 copy table).
 *
 * | Case        | Condition                                             | Verdict line    |
 * |-------------|-------------------------------------------------------|-----------------|
 * | A (skipped) | status === 'skipped'                                  | "No change"     |
 * | B (pain)    | status === 'submitted' && incompleteReason === 'pain' | "Lighter next"  |
 * | C (default) | any other submitted (includes draft leak-through)     | "Keep building" |
 *
 * Pair / solo header is the only place `playerCount` surfaces here.
 * Verdict and reason lines are pair-agnostic in v0b per D120 (pair-
 * collective verdict stance).
 *
 * No LLM. No template engine. Template composition from the fixed
 * copy table below - any move to dynamic phrasing is a spec violation
 * per the Surface 5 AI-slop rule.
 */

export type SummaryCase = 'skipped' | 'pain' | 'default'

export interface SummaryInput {
  review: SessionReview
  plan: SessionPlan
  sessionCount: number
}

export interface SummaryOutput {
  case: SummaryCase
  header: string
  verdict: string
  reason: string
}

const HEADER_PAIR = "Today's pair verdict"
const HEADER_SOLO = "Today's verdict"
const VERDICT_SKIPPED = 'No change'
const VERDICT_PAIN = 'Lighter next'
const VERDICT_DEFAULT = 'Keep building'
const REASON_SKIPPED =
  'No review this time. Next session stays at the same level.'
const REASON_PAIN =
  'You stopped early with pain. Next session will be gentler to let things settle.'

export function composeSummary(input: SummaryInput): SummaryOutput {
  const { review, plan, sessionCount } = input
  const header = plan.playerCount === 2 ? HEADER_PAIR : HEADER_SOLO

  // A2 ordering: skipped matches before pain; pain matches before default.
  if (review.status === 'skipped') {
    return {
      case: 'skipped',
      header,
      verdict: VERDICT_SKIPPED,
      reason: REASON_SKIPPED,
    }
  }
  if (
    review.status === 'submitted' &&
    review.incompleteReason === 'pain'
  ) {
    return {
      case: 'pain',
      header,
      verdict: VERDICT_PAIN,
      reason: REASON_PAIN,
    }
  }
  // Default catches submitted-without-pain AND any defensive fallthrough
  // (e.g. a stale `status: 'draft'` record leaked onto the summary path).
  return {
    case: 'default',
    header,
    verdict: VERDICT_DEFAULT,
    reason: composeDefaultReason(review, sessionCount),
  }
}

// Phase F4 (2026-04-19): forward-looking hook appended to the default
// summary reason when no other forward-looking sentence is already
// present. Turns the Complete screen from a flat verdict into a
// "ready when you are" handoff, matching the joy / trust / investment
// posture established in Phase F1 / F2 / F3. Copy chosen to:
// - respect user agency (not "we'll see you next time", user decides)
// - stay calm and action-anchored (Japanese-inspired direction)
// - NOT overpromise adaptation (no "we'll tune" / "we'll progress" -
//   those are M001-build engine behaviors, not v0b reality, and the
//   D86 / copy-guard vocabulary explicitly rules out claims the engine
//   cannot back up)
// - pass the FORBIDDEN_RE copy-guard regex unchanged.
//
// Not appended to the low-N / bootstrap sub-case below because that
// case already carries its own forward-looking line (tuning threshold
// + how many more attempts until it), which explains what changes
// next in a way a generic "Ready when you are." cannot.
const FORWARD_HOOK = 'Ready when you are.'

function passAttemptStatsLine(
  goodPasses: number,
  totalAttempts: number,
): string {
  const passNoun = goodPasses === 1 ? 'good pass' : 'good passes'
  const attemptNoun = totalAttempts === 1 ? 'attempt' : 'attempts'
  return `${goodPasses} ${passNoun} today out of ${totalAttempts} ${attemptNoun}.`
}

function lowNTuningNote(totalAttempts: number): string {
  const remaining = TUNING_FLOOR_ATTEMPTS - totalAttempts
  const more =
    remaining === 1
      ? '1 more attempt'
      : `${remaining} more attempts`
  return `Just getting started. I start tuning the pass rate once ${TUNING_FLOOR_ATTEMPTS} attempts are recorded in a session. ${more} to go.`
}

// Partner-walkthrough polish 2026-04-22 (design review T3 / trifold T3):
// the prior `Session ${N}. One more in the book.` template was
// session-number-aware but emotionally parallel - session 1 read the
// same as session 2, 5, 20. A first-ever session deserves a subtly
// milestone-ish line so the first-complete moment feels specifically
// earned, not pattern-matched. Single string, same voice as the rest
// of Complete copy (no exclamation, no celebration theatrics, no
// streak claim the v0b engine cannot back). Re-uses `FORWARD_HOOK`
// so the session-1 line still ends on the same "Ready when you are"
// handoff Phase F4 established. Avoids the em-dash glyph because the
// `CompleteScreen.copy-guard` test treats any em-dash on this surface
// as a regression of the old "Good passes: — " placeholder. Only
// applies on the no-attempts-captured default path, which is where
// the casual first-time path lands by default (notCaptured auto-
// selected for non-count drills). First sessions that DO record
// attempts fall through to the low-N tuning branch below, which
// already carries its own first-few-sessions framing. See
// `docs/plans/2026-04-22-partner-walkthrough-polish.md` item 4.
const FIRST_SESSION_NO_ATTEMPTS_REASON = `First one\u2019s in the book. ${FORWARD_HOOK}`

function composeDefaultReason(
  review: SessionReview,
  sessionCount: number,
): string {
  if (review.totalAttempts === 0) {
    if (sessionCount === 1) {
      return FIRST_SESSION_NO_ATTEMPTS_REASON
    }
    return `Session ${sessionCount}. One more in the book. ${FORWARD_HOOK}`
  }
  const base = `Session ${sessionCount}. ${passAttemptStatsLine(
    review.goodPasses,
    review.totalAttempts,
  )}`
  // Phase F Unit 5 (2026-04-19): forward-looking reframe of the low-N
  // qualifier. The pre-Phase-F "Not enough reps yet to trust the rate"
  // was honest but emotionally flat - a first-few-sessions tester
  // reads it as "the app can't tell you anything useful." The
  // replacement keeps the evidentiary honesty (we're NOT claiming the
  // rate yet) but frames it forward-looking. The D86 copy-guard
  // vocabulary stays clean (no "early sessions", "baseline", etc.).
  // TUNING_FLOOR_ATTEMPTS matches the branch that switches the summary
  // to the standard forward hook (enough recorded attempts in-session
  // to lean on the rate here).
  if (review.totalAttempts < TUNING_FLOOR_ATTEMPTS && review.goodPasses > 0) {
    return `${base} ${lowNTuningNote(review.totalAttempts)}`
  }
  return `${base} ${FORWARD_HOOK}`
}
