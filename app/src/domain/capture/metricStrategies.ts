/**
 * Per-`successMetric.type` strategy registry — the closed home for every
 * decision the app makes about a drill's capture surface.
 *
 * Why a registry: prior to U2 of the architecture pass, four modules each
 * carried their own slice of "is this metric type count-eligible / does it
 * show counts on Review / does it participate in the count sum":
 *
 *   - `domain/policies.ts` (`COUNT_BASED_METRIC_TYPES`)
 *   - `domain/drillCheckCapture.ts` (count-eligibility branch)
 *   - `screens/review/useReviewController.ts` (`metricCountsByRule`)
 *   - `services/review.ts` (aggregation and summary plumbing)
 *
 * Adding a new shipped `MetricType` (e.g. `streak`, `points-to-target`,
 * `pass-grade-avg`, `composite`) used to require cross-file edits and
 * was a likely source of drift. The strategy registry consolidates the
 * per-type knobs into a single closed table so the only edit a new
 * metric needs is one entry here.
 *
 * OCP discipline: callers MUST consult the registry through the helpers
 * in this file. They MUST NOT branch directly on `metricType ===
 * 'pass-rate-good'` or carry their own `Set` of "count-eligible" types.
 * The registry's exhaustive `Record<MetricType, MetricTypeStrategy>` is
 * the forcing function — adding a new metric to the union without a
 * registry entry is a TS compile error.
 */
import type { MetricType } from '../../types/drill'

/**
 * Declarative knobs each `MetricType` exposes to the capture surface.
 *
 * Keep the shape narrow and additive. New entries should be small data,
 * never embedded workflows; the registry must not become a god table
 * that swallows controller logic. If a future metric needs branching
 * behavior beyond a flag, the right move is a new helper in
 * `domain/capture/` that consults this registry, not a function-valued
 * field on the strategy itself.
 */
export interface MetricTypeStrategy {
  /**
   * Drill Check shows the optional Good / Total rep counter for this
   * metric type. Difficulty-only metric types (`streak`,
   * `points-to-target`, `pass-grade-avg`, `completion`, `composite`)
   * still fire the difficulty chip but skip the counter UI so the
   * tester isn't asked to invent numbers the rule doesn't define.
   */
  capturesCounts: boolean

  /**
   * ReviewScreen renders the session-level Good / Total card for plans
   * dominated by this metric type. Non-count metrics suppress the card
   * (and default the `notCaptured` quick tag) per the partner-walkthrough
   * Tier 1a finding (P2-3, 2026-04-21) — see `domain/policies.ts`'s
   * legacy `COUNT_BASED_METRIC_TYPES` comment for the rationale.
   */
  showsReviewCounts: boolean

  /**
   * Per-drill captures of this metric type contribute their Good /
   * Total counts to `aggregateDrillCaptures` sums. Difficulty-only
   * metric types still contribute to the `drillsTagged` and
   * `tagBreakdown` recap, but their captures never arrive with
   * `goodPasses + attemptCount` set so they cannot influence the
   * session-level count regardless of this flag. Kept as an explicit
   * knob so a future metric that captures counts but rolls them up
   * differently (e.g. as a `points-to-target` ratio) can opt out
   * without changing aggregation code.
   */
  participatesInCountSum: boolean
}

/**
 * Closed table of strategies for every shipped `MetricType`. Adding a
 * new variant of `MetricType` (e.g. `points-to-target-ratio`) without a
 * registry entry is a TS compile error here, which is the intended
 * forcing function so eligibility, aggregation, and review presence
 * stay in lockstep with the catalog vocabulary.
 *
 * Consumers MUST go through `getMetricStrategy` or the predicate
 * helpers below. Do not import this object directly outside
 * `domain/capture/`.
 */
export const METRIC_TYPE_STRATEGIES: Readonly<Record<MetricType, MetricTypeStrategy>> = {
  'pass-rate-good': {
    capturesCounts: true,
    showsReviewCounts: true,
    participatesInCountSum: true,
  },
  'reps-successful': {
    capturesCounts: true,
    showsReviewCounts: true,
    participatesInCountSum: true,
  },
  streak: {
    capturesCounts: false,
    showsReviewCounts: false,
    participatesInCountSum: false,
  },
  'points-to-target': {
    capturesCounts: false,
    showsReviewCounts: false,
    participatesInCountSum: false,
  },
  'pass-grade-avg': {
    capturesCounts: false,
    showsReviewCounts: false,
    participatesInCountSum: false,
  },
  completion: {
    capturesCounts: false,
    showsReviewCounts: false,
    participatesInCountSum: false,
  },
  composite: {
    capturesCounts: false,
    showsReviewCounts: false,
    participatesInCountSum: false,
  },
}

/**
 * Strategy lookup. Returns the registry entry for a known
 * `MetricType`. Unregistered types are a TS compile error at the call
 * site because of the exhaustive `Record` above.
 */
export function getMetricStrategy(type: MetricType): MetricTypeStrategy {
  return METRIC_TYPE_STRATEGIES[type]
}

/**
 * Drill Check count-input predicate. Returns `false` for `null` so
 * blocks whose variant cannot be resolved (synthetic test, legacy
 * plan, missing variantId) default to difficulty-only capture.
 */
export function metricCapturesCounts(type: MetricType | null): boolean {
  return type !== null && METRIC_TYPE_STRATEGIES[type].capturesCounts
}

/**
 * ReviewScreen "show the session-level Good / Total card" predicate.
 *
 * Returns `true` for `null` so plans whose dominant metric cannot be
 * inferred (no `main_skill` block, missing variant) keep the calm
 * pre-registry default of showing the card. Hiding it on a discarded /
 * missing-plan branch would surface as the metric card silently
 * disappearing on a routine session.
 */
export function metricShowsReviewCounts(type: MetricType | null): boolean {
  return type === null || METRIC_TYPE_STRATEGIES[type].showsReviewCounts
}

/**
 * Aggregate-participation predicate. Returns `false` for `null` so
 * captures lacking a resolvable metric type are skipped from count
 * sums (they still count toward `drillsTagged` / `tagBreakdown`).
 */
export function metricParticipatesInCountSum(type: MetricType | null): boolean {
  return type !== null && METRIC_TYPE_STRATEGIES[type].participatesInCountSum
}
