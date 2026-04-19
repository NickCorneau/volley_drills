import type { SessionPlan, SessionReview } from '../db'

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
 * copy table below — any move to dynamic phrasing is a spec violation
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

function composeDefaultReason(
  review: SessionReview,
  sessionCount: number,
): string {
  if (review.totalAttempts === 0) {
    return `Session ${sessionCount}. One more in the book.`
  }
  const base = `Session ${sessionCount}. ${review.goodPasses} good passes today out of ${review.totalAttempts} attempts.`
  // Phase F Unit 5 (2026-04-19): forward-looking reframe of the low-N
  // qualifier. The pre-Phase-F "Not enough reps yet to trust the rate"
  // was honest but emotionally flat — a first-few-sessions tester
  // reads it as "the app can't tell you anything useful." The
  // replacement keeps the evidentiary honesty (we're NOT claiming the
  // rate yet) but frames it forward-looking. The D86 copy-guard
  // vocabulary stays clean (no "early sessions", "baseline", etc.).
  if (review.totalAttempts < 50 && review.goodPasses > 0) {
    return `${base} Just getting started. I'll start tuning once you have a few more in the book.`
  }
  return base
}
