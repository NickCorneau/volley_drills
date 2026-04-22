/**
 * Product tuning knobs that cross module boundaries.
 *
 * Centralising these here means any single-place audit ("what's our
 * Finish Later cap? what counts as a count-based metric?") reads one
 * file. Module-internal constants (e.g. sessionBuilder's DURATION_PRIORITY)
 * stay local - those are assembly implementation details, not product
 * tuning.
 */
import type { MetricType } from '../types/drill'

// --- Review capture windows (V0B-30 / D120) ---
//
// Inclusive upper bound applied at each step so a delay that lands exactly
// on 30 min / 2 h / 24 h stays inside the more favorable bucket.

export const CAPTURE_WINDOW_IMMEDIATE_MS = 30 * 60 * 1_000
export const CAPTURE_WINDOW_SAME_SESSION_MS = 2 * 60 * 60 * 1_000
export const CAPTURE_WINDOW_SAME_DAY_MS = 24 * 60 * 60 * 1_000

/**
 * 2 h cap after which a deferred review is auto-finalized as `expired`
 * (V0B-31 / B4 / D120). Coincides with the `same_session` bucket upper
 * bound above, so reviews submitted inside the cap remain
 * adaptation-eligible.
 */
export const FINISH_LATER_CAP_MS = CAPTURE_WINDOW_SAME_SESSION_MS

// --- Pass-rate progression floor (RESERVED, D104 / O12) ---

/**
 * Minimum recorded attempts before any pass-rate can be treated as
 * decision-grade by downstream logic.
 *
 * Set to 50 per `D104` (Bayesian posterior rule
 * `P(p_corrected >= 0.70) >= 0.80`, which resolves to ~38 / 50 corrected
 * or ~41 / 50 raw as a pre-calibration proxy). See `decisions.md` `O12`
 * for the open field-validation work (does a real user actually
 * accumulate 50 scored contacts at 1-2 sessions/week, does tester
 * self-scoring correlate with partner/video review, etc.).
 *
 * Not currently surfaced in any UI. `sessionSummary.composeDefaultReason`
 * used to cite this threshold ("Pass-rate tuning waits until this
 * session logs 50 attempts…") but the copy was retired 2026-04-22
 * because v0b has no engine that reads `review.totalAttempts` and
 * changes the next session — that was an aspirational claim the
 * product could not back. The constant stays here so the real D104 /
 * O12 progression engine can import it without reintroducing a magic
 * number when it ships.
 */
export const TUNING_FLOOR_ATTEMPTS = 50

// --- RunScreen coaching-cue display ---

/** Cues this length or under read as a single breath and render un-truncated. */
export const CUE_COMPACT_MAX = 100

// --- Review pass-metric capture ---

/**
 * Main-skill drill `successMetric.type` values where asking for
 * Good / Total attempts courtside makes sense. Drills with non-count
 * shapes (`streak`, `points-to-target`, `pass-grade-avg`, `composite`,
 * `completion`) default the `notCaptured` quick tag on the ReviewScreen
 * so the reviewer isn't guilt-tripped into inventing numbers. See
 * `docs/research/partner-walkthrough-results/2026-04-21-tier-1a-walkthrough.md`
 * P2-3 and the founder pre-close review thought 4.
 */
export const COUNT_BASED_METRIC_TYPES: ReadonlySet<MetricType> = new Set([
  'pass-rate-good',
  'reps-successful',
])
