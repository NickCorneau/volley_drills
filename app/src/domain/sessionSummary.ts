import type { SessionPlan, SessionReview } from '../model'

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
const REASON_SKIPPED = 'No review this time. Next session stays at the same level.'
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
  if (review.status === 'submitted' && review.incompleteReason === 'pain') {
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
const FORWARD_HOOK = 'Ready when you are.'

function passAttemptStatsLine(goodPasses: number, totalAttempts: number): string {
  const passNoun = goodPasses === 1 ? 'good pass' : 'good passes'
  const attemptNoun = totalAttempts === 1 ? 'attempt' : 'attempts'
  return `${goodPasses} ${passNoun} today out of ${totalAttempts} ${attemptNoun}.`
}

// Partner-walkthrough polish 2026-04-22 (design review T3 / trifold T3):
// a first-ever session deserves a subtly milestone-ish line so the
// first-complete moment feels specifically earned, not pattern-matched.
// Single string, same voice as the rest of Complete copy (no
// exclamation, no celebration theatrics, no streak claim the v0b engine
// cannot back). Re-uses `FORWARD_HOOK` so the session-1 line still ends
// on the same "Ready when you are" handoff Phase F4 established.
// Avoids the em-dash glyph because the `CompleteScreen.copy-guard` test
// treats any em-dash on this surface as a regression of the old
// "Good passes: — " placeholder.
//
// 2026-04-22 disambiguation pass: testers misread `Session 13.` as
// "13 attempts logged" next to the pass-metric line. `sessionCount` is
// `countSubmittedReviews()` (lifetime submitted reviews since
// onboarding), not `review.totalAttempts`. Prefix renamed to
// `Completed session N:` / `Completed session N.` so the ordinal read
// as a completion tally, not an attempt counter.
//
// 2026-04-26 pre-D91 editorial polish (`F9`): the `Completed session N`
// ordinal prefix was dropped entirely. The 2026-04-22 disambiguation
// fixed the *misread* (Session 13 ≠ 13 attempts) but did not answer
// the deeper question — does a self-coached amateur on a courtside
// Complete screen need to be told this was their thirteenth session?
// Field evidence says no: the user reads the verdict word, the rate
// line, and taps Back to home. The ordinal was informational backfill,
// not actionable, and contributed to the "weirdly dense" feel that
// the 2026-04-21 second-pass field-test feedback flagged. The lifetime
// session-count signal is still surfaced through the Home recent-
// workouts row's rolling-recency labels; deleting it from Complete
// preserves the Jo-Ha-Kyu "kyu" beat per the brand's typography brief.
// `sessionCount` is no longer threaded into `composeDefaultReason`
// (kept on `SummaryInput` as data only — future surfaces may want
// it). See `docs/plans/2026-04-26-pre-d91-editorial-polish.md` Item 4.
//
// 2026-04-22 honest-copy pass: the prior low-N branch rendered
// "Pass-rate tuning waits until this session logs 50 attempts…" below
// TUNING_FLOOR_ATTEMPTS. That copy implied a tuning engine the v0b
// build does not have — nothing reads `review.totalAttempts` and
// adjusts the next session. Pulled. `TUNING_FLOOR_ATTEMPTS` stays
// reserved in `policies.ts` for the real D104 / O12 pass-rate
// progression engine when that ships; Complete copy should not cite
// it again until then. See decisions.md O12.
const FIRST_SESSION_NO_ATTEMPTS_REASON = `First one\u2019s in the book. ${FORWARD_HOOK}`
const REPEAT_NO_ATTEMPTS_REASON = `One more in the book. ${FORWARD_HOOK}`

function composeDefaultReason(review: SessionReview, sessionCount: number): string {
  if (review.totalAttempts === 0) {
    if (sessionCount === 1) {
      return FIRST_SESSION_NO_ATTEMPTS_REASON
    }
    return REPEAT_NO_ATTEMPTS_REASON
  }
  const base = passAttemptStatsLine(review.goodPasses, review.totalAttempts)
  return `${base} ${FORWARD_HOOK}`
}
