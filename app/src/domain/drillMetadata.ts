import { DRILLS } from '../data/drills'
import type { SessionPlanBlock } from '../db/types'
import type { DrillVariant, MetricType } from '../types/drill'

/**
 * Resolve the variant a planned block would render under.
 *
 * Resolution order (red-team adversarial finding, 2026-04-27):
 *   1. Exact `block.variantId` match. The session builder writes the
 *      chosen variant's id onto every block; downstream lookups must
 *      respect that decision rather than re-deriving from the
 *      participants envelope. Without this, the new pair variants land
 *      a participants envelope of `{ min: 2, max: 2 }` and the legacy
 *      solo variant a `{ min: 1, max: 1 }` envelope - so a stored
 *      `variantId: 'd38-pair'` block on a `playerCount = 1` projection
 *      (mid-session player-count switch, restored solo plan, exporter
 *      hydration) would silently flip to `d38-solo` and quietly change
 *      the success-metric type the tester is being scored against.
 *   2. Participants-envelope bracket against `playerCount` (legacy
 *      blocks with no `variantId`).
 *   3. First variant on the drill (synthetic / legacy fallback).
 *
 * Returns `null` when the block is unknown (synthetic drill names in
 * tests, legacy plans with no `drillId`, or a drillId that no longer
 * exists in `DRILLS`).
 *
 * Centralized here so the per-block lookup in `getBlockMetricType` and
 * `getBlockSuccessRule` cannot drift apart - the V0B-28 forced-criterion
 * prompt's correctness depends on the rule and the metric type both
 * coming from the same variant.
 */
function resolveBlockVariant(
  block: SessionPlanBlock | null | undefined,
  playerCount: 1 | 2,
): DrillVariant | null {
  if (!block) return null
  const drill = DRILLS.find((d) =>
    block.drillId ? d.id === block.drillId : d.name === block.drillName,
  )
  if (!drill) return null
  if (block.variantId) {
    const exact = drill.variants.find((v) => v.id === block.variantId)
    if (exact) return exact
  }
  return (
    drill.variants.find(
      (v) => v.participants.min <= playerCount && playerCount <= v.participants.max,
    ) ??
    drill.variants[0] ??
    null
  )
}

/**
 * Resolve the success-metric type for a planned block by walking the
 * drill catalog. See `resolveBlockVariant` for the selection rule and
 * null-return contract.
 */
export function getBlockMetricType(
  block: SessionPlanBlock | null | undefined,
  playerCount: 1 | 2,
): MetricType | null {
  return resolveBlockVariant(block, playerCount)?.successMetric.type ?? null
}

/**
 * Resolve the per-drill success rule (the one-sentence criterion the
 * tester scores each rep against) for a planned block by walking the
 * drill catalog. Returns the variant's `successMetric.description`, or
 * `null` when the block resolves to no variant.
 *
 * Used by `DrillCheckScreen` to render the V0B-28 forced-criterion
 * prompt above the optional Good/Total counts inside `PerDrillCapture`.
 * Sourcing from the drill record (vs hard-coded passing copy) is what
 * lets the prompt generalize across pass / serve / set drills as the
 * catalog grows. See `docs/specs/m001-review-micro-spec.md` §Required
 * (line 78) and `docs/plans/2026-04-27-per-drill-success-criterion.md`.
 */
export function getBlockSuccessRule(
  block: SessionPlanBlock | null | undefined,
  playerCount: 1 | 2,
): string | null {
  return resolveBlockVariant(block, playerCount)?.successMetric.description ?? null
}
