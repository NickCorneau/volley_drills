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
import type { MetricType } from '../../model'

/**
 * D134 (2026-04-28): semantic discriminator for the *shape* of optional
 * per-drill capture a metric type supports on Drill Check
 * (`/run/check`). Holds **no UI copy** — affordance text, helper copy,
 * and validation rules live in the consumers (`PerDrillCapture`,
 * `buildPerDrillCapture`). The registry only declares which shape a
 * metric type maps to.
 *
 * Phase 2A ships `'count'` and `'streak'` as concrete shapes; every
 * other metric type sits at `{ kind: 'none' }`. Phase 2B re-opens the
 * union with `'points'` and `'grade'` as one-line additions when their
 * triggers fire.
 *
 * The discriminator pattern is preferred over multiple boolean
 * predicates so adding a new shape is a single union-member +
 * registry-entry edit; flat booleans would require a parallel rename
 * and mutual-exclusion check at every call site.
 */
export type CaptureShape =
  | { kind: 'count' }
  | { kind: 'streak' }
  | { kind: 'none' }

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
   * D134 (2026-04-28): canonical discriminator for the optional
   * per-drill capture shape on Drill Check. Replaces the prior
   * `capturesCounts: boolean` knob — `metricCapturesCounts` is now a
   * derived predicate (`captureShape.kind === 'count'`) so there is a
   * single source of truth for whether a metric type captures counts
   * vs streak vs nothing. Difficulty-only metric types (`completion`,
   * `composite`, `points-to-target`, `pass-grade-avg`) sit at
   * `{ kind: 'none' }` until Phase 2B re-opens them.
   */
  captureShape: CaptureShape

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
    captureShape: { kind: 'count' },
    showsReviewCounts: true,
    participatesInCountSum: true,
  },
  'reps-successful': {
    captureShape: { kind: 'count' },
    showsReviewCounts: true,
    participatesInCountSum: true,
  },
  // D134 (2026-04-28): streak drills now declare an optional `streak`
  // capture shape so the Drill Check screen can render an `Add longest
  // streak (optional)` drawer for `main_skill` / `pressure` blocks.
  // Difficulty remains the required focal decision; streak rolls up to
  // a quiet receipt line on Complete and does NOT participate in the
  // session-level Good / Total sum.
  streak: {
    captureShape: { kind: 'streak' },
    showsReviewCounts: false,
    participatesInCountSum: false,
  },
  'points-to-target': {
    captureShape: { kind: 'none' },
    showsReviewCounts: false,
    participatesInCountSum: false,
  },
  'pass-grade-avg': {
    captureShape: { kind: 'none' },
    showsReviewCounts: false,
    participatesInCountSum: false,
  },
  completion: {
    captureShape: { kind: 'none' },
    showsReviewCounts: false,
    participatesInCountSum: false,
  },
  composite: {
    captureShape: { kind: 'none' },
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
 *
 * D134 (2026-04-28): derived from `captureShape.kind === 'count'`
 * rather than a parallel boolean field, so the registry stays a single
 * source of truth as `streak` (Phase 2A) and future Phase 2B shapes
 * (`points`, `grade`) land.
 */
export function metricCapturesCounts(type: MetricType | null): boolean {
  return type !== null && METRIC_TYPE_STRATEGIES[type].captureShape.kind === 'count'
}

/**
 * D134 (2026-04-28): exposes the `CaptureShape` discriminator the
 * Drill Check controller and `PerDrillCapture` UI branch on. Returns
 * `{ kind: 'none' }` for `null` so unresolved variants default to
 * difficulty-only capture without rendering any optional drawer.
 *
 * Consumers should pattern-match on `kind` rather than testing
 * `kind === 'count'` and `kind === 'streak'` independently — TS
 * exhaustiveness over the union is the forcing function for Phase 2B.
 */
export function getCaptureShape(type: MetricType | null): CaptureShape {
  return type === null ? { kind: 'none' } : METRIC_TYPE_STRATEGIES[type].captureShape
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
