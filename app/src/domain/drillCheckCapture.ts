import type { ExecutionLog, PerDrillCapture, SessionPlan, SessionPlanBlock } from '../db'
import type { MetricType } from '../types/drill'
import { getBlockMetricType, getBlockSuccessRule } from './drillMetadata'
import { COUNT_BASED_METRIC_TYPES } from './policies'

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
  const isCountEligible = metricType !== null && COUNT_BASED_METRIC_TYPES.has(metricType)

  if (isCountEligible) {
    return {
      status: 'eligible_counts',
      block: prevBlock,
      blockIndex: prevBlockIndex,
      metricType,
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

export function mergePerDrillCaptures(
  captures: readonly PerDrillCapture[],
  next: PerDrillCapture,
): PerDrillCapture[] {
  return [...captures.filter((capture) => capture.blockIndex !== next.blockIndex), next].sort(
    (a, b) => a.blockIndex - b.blockIndex,
  )
}
