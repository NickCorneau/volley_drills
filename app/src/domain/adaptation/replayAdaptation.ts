/**
 * M002.1 U2 — adaptation replay fold (R4, R5; KTD6).
 *
 * The single source of the next-time stress delta that both the Home
 * carry-forward line (R4) and the review-end accept/keep verdict (R5)
 * read. Pure domain: imports only model + sibling domain.
 *
 * Derivation rule (F3): the per-focus difficulty-tag trend is the only
 * driver of direction. Session-level sRPE is NOT focus-attributable, so
 * it never sets a direction — it only suppresses pushing stress *up*
 * when the body was just maxed. A null sRPE therefore can never produce
 * a direction.
 *
 * Hysteresis (F4): a direction flips off `keep` only when the dominant
 * tag agrees across the last two eligible sessions for the focus. A
 * single hard (or easy) session stays `keep`. This prevents the
 * per-session oscillation that would defeat suppress-on-no-delta.
 *
 * Effective-delta (F13): if the latest offered delta for the focus was
 * `kept_original` and the freshly-computed direction matches it, the
 * delta is suppressed back to `keep` — a declined verdict is not
 * re-offered every session until the signal materially changes.
 *
 * The numeric constants below are deliberately conservative v1 defaults
 * and are flagged in the plan's Open Questions for calibration against
 * real founder session data during execution — the *rule* is fixed, the
 * *thresholds* are tunable.
 */
import type { AdaptationDelta, DifficultyTag, StressDirection, VerdictChoice } from '../../model'
import { focusLabel } from '../sessionFocus'
import { isScopedFocus, type ScopedFocus } from '../eligibleSessions'

/** Sessions of focus-attributed tags required to flip off `keep`. */
const SUSTAINED_SESSIONS = 2

/**
 * Session sRPE at or above this suppresses a `more` (don't add stress
 * the session after the body was maxed). Tunable (Open Questions).
 */
const HIGH_RPE_SUPPRESS_MORE = 8

export interface ReplayInput {
  /** The focus of the session just completed — the delta is about it. */
  currentFocus: ScopedFocus
  /**
   * Difficulty tags attributed to `currentFocus`, grouped by eligible
   * session, oldest-first. The caller builds this by attributing each
   * `perDrillCapture` to a focus via the drill catalog and keeping only
   * eligible sessions.
   */
  recentTagsForFocus: DifficultyTag[][]
  /** Session-level sRPE aligned with `recentTagsForFocus`, oldest-first. */
  recentRpe: (number | null)[]
  /**
   * The most recent offered+chosen verdict for `currentFocus`, if any.
   * Used for effective-delta suppression of a declined re-offer.
   */
  priorVerdict?: { direction: StressDirection; choice: VerdictChoice }
}

/** Most frequent tag in a session; `still_learning` on an empty/tie set. */
function dominantTag(tags: DifficultyTag[]): DifficultyTag {
  const counts = { too_hard: 0, still_learning: 0, too_easy: 0 }
  for (const tag of tags) counts[tag] += 1
  const { too_hard, still_learning, too_easy } = counts
  if (too_hard > still_learning && too_hard > too_easy) return 'too_hard'
  if (too_easy > still_learning && too_easy > too_hard) return 'too_easy'
  return 'still_learning'
}

export function replayAdaptation(input: ReplayInput): AdaptationDelta {
  const { currentFocus, recentTagsForFocus, recentRpe, priorVerdict } = input
  const keep: AdaptationDelta = { kind: 'stress', focus: currentFocus, direction: 'keep' }

  // Hysteresis: need a sustained trend across the last N sessions.
  const window = recentTagsForFocus.slice(-SUSTAINED_SESSIONS)
  if (window.length < SUSTAINED_SESSIONS) return keep

  const dominants = window.map(dominantTag)
  const allHard = dominants.every((tag) => tag === 'too_hard')
  const allEasy = dominants.every((tag) => tag === 'too_easy')

  let direction: StressDirection = 'keep'
  if (allHard) direction = 'less'
  else if (allEasy) direction = 'more'

  // sRPE suppression: never push stress up the session after a maxed
  // body. sRPE never *creates* a direction (F3).
  if (direction === 'more') {
    const latestRpe = recentRpe[recentRpe.length - 1]
    if (typeof latestRpe === 'number' && latestRpe >= HIGH_RPE_SUPPRESS_MORE) {
      direction = 'keep'
    }
  }

  // Effective-delta: don't re-offer a direction the user just declined
  // until the signal materially changes (F13).
  if (
    direction !== 'keep' &&
    priorVerdict?.choice === 'kept_original' &&
    priorVerdict.direction === direction
  ) {
    direction = 'keep'
  }

  return { kind: 'stress', focus: currentFocus, direction }
}

const MORE_LINES: Record<ScopedFocus, string> = {
  pass: 'A bit more stress on passing next time.',
  serve: 'A bit more stress on serving next time.',
  set: 'A bit more stress on setting next time.',
}

const LESS_LINES: Record<ScopedFocus, string> = {
  pass: 'Ease the stress on passing next time.',
  serve: 'Ease the stress on serving next time.',
  set: 'Ease the stress on setting next time.',
}

/**
 * The bounded, deterministic verdict line offered at review end (R5).
 * Returns `null` for a `keep` (or suppressed) delta — no filler line.
 * Framed "...next time" because at review the user just trained this
 * focus and the offer is for the next time they train it. Copy is
 * stress-vocabulary, ≤45 words, em-dash free (courtside copy contract).
 */
export function composeCarryForwardLine(delta: AdaptationDelta): string | null {
  if (delta.direction === 'keep') return null
  const focus = delta.focus
  if (!isScopedFocus(focus)) {
    // Defensive: v1 only ranks scoped focuses; fall back to a neutral
    // label-based line rather than throwing.
    return `Adjust the stress on ${focusLabel(focus).toLowerCase()} next time.`
  }
  return delta.direction === 'more' ? MORE_LINES[focus] : LESS_LINES[focus]
}

const MORE_SUMMARY: Record<ScopedFocus, string> = {
  pass: 'Carried forward: a bit more stress on passing.',
  serve: 'Carried forward: a bit more stress on serving.',
  set: 'Carried forward: a bit more stress on setting.',
}

const LESS_SUMMARY: Record<ScopedFocus, string> = {
  pass: 'Carried forward: easing the stress on passing.',
  serve: 'Carried forward: easing the stress on serving.',
  set: 'Carried forward: easing the stress on setting.',
}

/**
 * The Home carry-forward summary (R4). Same delta, but framed as a
 * STANDING adjustment ("Carried forward: ...") rather than "...next
 * time", because on Home it sits beside the plan's "Next up: [focus]" —
 * and the accepted focus is rarely the next session's focus (staleness
 * sinks a just-trained focus to the tail). The non-temporal framing
 * keeps the two lines from claiming different "next" sessions. Returns
 * `null` for a `keep` delta.
 */
export function composeCarryForwardSummary(delta: AdaptationDelta): string | null {
  if (delta.direction === 'keep') return null
  const focus = delta.focus
  if (!isScopedFocus(focus)) {
    return `Carried forward: adjusting the stress on ${focusLabel(focus).toLowerCase()}.`
  }
  return delta.direction === 'more' ? MORE_SUMMARY[focus] : LESS_SUMMARY[focus]
}
