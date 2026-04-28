import type { ExecutionLog, MetricType, SessionPlan, SessionPlanBlock } from '../../model'
import { getBlockMetricType, getBlockSuccessRule } from '../drillMetadata'
import { metricCapturesCounts } from './metricStrategies'

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
      status: 'eligible_difficulty_only'
      block: SessionPlanBlock
      blockIndex: number
      metricType: MetricType | null
      successRule: string | null
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
    return {
      status: 'eligible_difficulty_only',
      block: prevBlock,
      blockIndex: prevBlockIndex,
      metricType,
      successRule,
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
