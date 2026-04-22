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

// --- Complete-screen tuning copy (C-2) ---

/**
 * Minimum recorded attempts before `sessionSummary.composeDefaultReason`
 * will phrase the pass rate as tunable. Below this floor, copy explains
 * we're not yet claiming the rate.
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
