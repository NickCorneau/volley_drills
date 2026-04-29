import type { ExecutionLog, MetricType, SessionPlan, SessionPlanBlock } from '../../model'
import { getBlockMetricType, getBlockSuccessRule } from '../drillMetadata'
import { type CaptureShape, getCaptureShape, metricCapturesCounts } from './metricStrategies'

export type DrillCheckBypassReason =
  | 'missing_session'
  | 'session_complete'
  | 'missing_previous_block'
  | 'previous_block_not_completed'
  | 'missing_catalog_ids'
  | 'excluded_slot'
  | 'non_count_support_slot'

export type DrillCheckCaptureEligibility =
  | {
      status: 'eligible_counts'
      block: SessionPlanBlock
      blockIndex: number
      metricType: MetricType
      successRule: string | null
    }
  | {
      /**
       * D134 (2026-04-28): the difficulty-only branch now reports an
       * `optionalCaptureShape` so the controller knows whether to
       * render the optional `Add longest streak (optional)` drawer
       * (Phase 2A `streak`) or fall through to the chip-only fast
       * path. The shape is `{ kind: 'none' }` for non-count
       * `main_skill` / `pressure` blocks whose drill has no Phase 2A
       * surface (e.g., `points-to-target` / `pass-grade-avg` /
       * `composite` — all deferred to Phase 2B), keeping the
       * difficulty-only experience unchanged for those drills.
       */
      status: 'eligible_difficulty_only'
      block: SessionPlanBlock
      blockIndex: number
      metricType: MetricType | null
      successRule: string | null
      optionalCaptureShape: CaptureShape
    }
  | {
      status: 'bypass'
      reason: DrillCheckBypassReason
    }

/**
 * Decide whether the just-finished block is eligible for per-drill
 * capture on `/run/check`.
 *
 * The "count-eligible" branch defers to the metric-strategy registry —
 * see `metricStrategies.ts`. Adding a new `MetricType` that wants count
 * inputs needs a single registry entry; this resolver does not change.
 */
export function resolveDrillCheckCaptureEligibility({
  plan,
  execution,
  currentBlockIndex,
}: {
  plan: SessionPlan | null
  execution: ExecutionLog | null
  currentBlockIndex: number
}): DrillCheckCaptureEligibility {
  if (!plan || !execution) {
    return { status: 'bypass', reason: 'missing_session' }
  }

  if (execution.status === 'completed' || currentBlockIndex >= plan.blocks.length) {
    return { status: 'bypass', reason: 'session_complete' }
  }

  const prevBlockIndex = currentBlockIndex - 1
  const prevBlock = plan.blocks[prevBlockIndex]
  const prevBlockStatus = execution.blockStatuses[prevBlockIndex]

  if (!prevBlock || !prevBlockStatus) {
    return { status: 'bypass', reason: 'missing_previous_block' }
  }

  if (prevBlockStatus.status !== 'completed') {
    return { status: 'bypass', reason: 'previous_block_not_completed' }
  }

  if (!prevBlock.drillId || !prevBlock.variantId) {
    return { status: 'bypass', reason: 'missing_catalog_ids' }
  }

  if (prevBlock.type === 'warmup' || prevBlock.type === 'wrap') {
    return { status: 'bypass', reason: 'excluded_slot' }
  }

  const metricType = getBlockMetricType(prevBlock, plan.playerCount)
  const successRule = getBlockSuccessRule(prevBlock, plan.playerCount)

  if (metricCapturesCounts(metricType)) {
    return {
      status: 'eligible_counts',
      block: prevBlock,
      blockIndex: prevBlockIndex,
      // metricType is non-null here: `metricCapturesCounts(null)` is false.
      metricType: metricType as MetricType,
      successRule,
    }
  }

  if (prevBlock.type === 'main_skill' || prevBlock.type === 'pressure') {
    // D134 (2026-04-28): expose the per-metric `CaptureShape` so the
    // controller can render the Phase 2A streak drawer for `streak`-
    // typed drills without widening the slot-type rule. Non-streak
    // non-count metrics keep `{ kind: 'none' }` and the chip-only
    // experience until Phase 2B unblocks them.
    return {
      status: 'eligible_difficulty_only',
      block: prevBlock,
      blockIndex: prevBlockIndex,
      metricType,
      successRule,
      optionalCaptureShape: getCaptureShape(metricType),
    }
  }

  return { status: 'bypass', reason: 'non_count_support_slot' }
}

/**
 * Resolve the metric type that dominates a session plan for ReviewScreen
 * "show the count card?" decisions. Currently keyed off the first
 * `main_skill` block, matching the pre-U2 helper that lived inline in
 * `useReviewController.ts`.
 *
 * Returns `null` when the plan is absent or has no `main_skill` block;
 * `metricShowsReviewCounts` keeps the calm default for that case.
 */
export function inferPlanMainMetricType(plan: SessionPlan | null): MetricType | null {
  if (!plan) return null
  const mainSkill = plan.blocks.find((b) => b.type === 'main_skill')
  if (!mainSkill) return null
  return getBlockMetricType(mainSkill, plan.playerCount)
}
