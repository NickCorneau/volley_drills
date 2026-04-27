import { DRILLS } from '../data/drills'
import type { SessionPlanBlock } from '../db/types'
import type { MetricType } from '../types/drill'

/**
 * Resolve the success-metric type for a planned block by walking the
 * drill catalog. Returns `null` when the block is unknown (synthetic
 * drill names in tests, legacy plans with no `drillId`, or a drillId
 * that no longer exists in `DRILLS`).
 *
 * Variant selection mirrors the session builder: prefer the variant
 * whose `participants.min..max` brackets the plan's player count, fall
 * back to the first variant when nothing brackets.
 *
 * Centralized here (and not inlined into ReviewScreen / TransitionScreen)
 * because both surfaces resolve the same metric-type question on the
 * same block shape; D133 introduced the second consumer and the lookup
 * is no longer ReviewScreen-specific.
 */
export function getBlockMetricType(
  block: SessionPlanBlock | null | undefined,
  playerCount: 1 | 2,
): MetricType | null {
  if (!block) return null
  const drill = DRILLS.find((d) =>
    block.drillId ? d.id === block.drillId : d.name === block.drillName,
  )
  if (!drill) return null
  const variant =
    drill.variants.find(
      (v) => v.participants.min <= playerCount && playerCount <= v.participants.max,
    ) ?? drill.variants[0]
  return variant?.successMetric.type ?? null
}
