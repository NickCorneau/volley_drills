import { DRILLS } from '../data/drills'
import type { SessionPlanBlock } from '../db/types'
import type { Drill, DrillVariant } from '../types/drill'

export function drillById(drillId: string): Drill | null {
  return DRILLS.find((drill) => drill.id === drillId) ?? null
}

export function variantById(drill: Drill, variantId: string): DrillVariant | null {
  return drill.variants.find((variant) => variant.id === variantId) ?? null
}

export function drillForBlock(block: SessionPlanBlock | null | undefined): Drill | null {
  if (!block) return null
  return block.drillId
    ? drillById(block.drillId)
    : (DRILLS.find((drill) => drill.name === block.drillName) ?? null)
}

/**
 * Resolve the variant a planned block would render under.
 *
 * Resolution order:
 * 1. Exact `block.variantId` match.
 * 2. Participants-envelope bracket against `playerCount` for legacy blocks.
 * 3. First variant on the drill as a synthetic / legacy fallback.
 */
export function variantForBlock(
  block: SessionPlanBlock | null | undefined,
  playerCount: 1 | 2,
): DrillVariant | null {
  const drill = drillForBlock(block)
  if (!drill) return null
  if (block?.variantId) {
    const exact = variantById(drill, block.variantId)
    if (exact) return exact
  }
  return (
    drill.variants.find(
      (variant) => variant.participants.min <= playerCount && playerCount <= variant.participants.max,
    ) ??
    drill.variants[0] ??
    null
  )
}
