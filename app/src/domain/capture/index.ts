/**
 * Capture domain — the closed home for every per-drill capture decision.
 *
 * Public surface:
 *   - `resolveDrillCheckCaptureEligibility(plan, execution, currentBlockIndex)`
 *     and `inferPlanMainMetricType(plan)` — Drill Check eligibility +
 *     ReviewScreen "what does this plan capture?" question.
 *   - `mergePerDrillCaptures(captures, next)` — last-write-wins merge by
 *     `blockIndex`.
 *   - `aggregateDrillCaptures(captures)` — session-level rollup with
 *     count and tag totals (`AggregateCapturesResult`).
 *   - `classifyCaptureWindow(delaySeconds)` and
 *     `isEligibleForAdaptation(window)` — capture-window bucketing.
 *   - `hasMeaningfulReviewDraftInput(signal)` — predicate that gates the
 *     autosave write path on Review.
 *   - `metricCapturesCounts` / `metricShowsReviewCounts` /
 *     `metricParticipatesInCountSum` — strategy-registry-backed
 *     predicates so callers never branch on `metricType ===` directly.
 *
 * Layer rule: this is pure domain. No Dexie writes, no React, no
 * services. Inputs are model / catalog data; outputs are values.
 *
 * Extension point: new `MetricType` values land in
 * `metricStrategies.ts` only — eligibility, aggregation, and review
 * presence flow through the registry without controller / screen
 * edits. See the rules ledger in
 * `docs/ops/agent-operations.md` for the OCP rationale.
 */
export {
  aggregateDrillCaptures,
  type AggregateCapturesResult,
} from './aggregate'
export {
  inferPlanMainMetricType,
  resolveDrillCheckCaptureEligibility,
  type DrillCheckBypassReason,
  type DrillCheckCaptureEligibility,
} from './eligibility'
export { hasMeaningfulReviewDraftInput, type ReviewDraftSignal } from './meaningfulDraft'
export { mergePerDrillCaptures } from './merge'
export {
  getMetricStrategy,
  METRIC_TYPE_STRATEGIES,
  metricCapturesCounts,
  metricParticipatesInCountSum,
  metricShowsReviewCounts,
  type MetricTypeStrategy,
} from './metricStrategies'
export { classifyCaptureWindow, isEligibleForAdaptation } from './window'
