import { DRILLS } from '../../data/drills'
import type { BlockSlot, DrillVariant, SetupContext } from '../../model'
import type { SelectionCandidate } from '../drillSelection'
import { effectiveSkillTags } from './effectiveFocus'
import type { RandomSource } from './random'
import { shuffle } from './random'

export type CandidateVariant = SelectionCandidate

export function hasUnmodeledRequirements(variant: DrillVariant): boolean {
  return (
    variant.environmentFlags.needsLines ||
    variant.environmentFlags.needsCones ||
    variant.equipment.cones !== undefined ||
    variant.equipment.balls === 'many' ||
    (typeof variant.equipment.balls === 'number' && variant.equipment.balls > 1)
  )
}

export function findCandidates(slot: BlockSlot, context: SetupContext): CandidateVariant[] {
  const playerCount = context.playerMode === 'solo' ? 1 : 2
  const candidates: CandidateVariant[] = []
  const skillTags = effectiveSkillTags(slot.type, context, slot.skillTags)

  for (const drill of DRILLS) {
    if (!drill.m001Candidate) continue

    const hasMatchingFocus =
      !skillTags || skillTags.length === 0 || skillTags.some((tag) => drill.skillFocus.includes(tag))
    if (!hasMatchingFocus) continue

    for (const variant of drill.variants) {
      if (variant.participants.min > playerCount) continue
      if (variant.participants.max < playerCount) continue
      if (variant.environmentFlags.needsNet && !context.netAvailable) continue
      if (variant.environmentFlags.needsWall && !context.wallAvailable) continue
      if (hasUnmodeledRequirements(variant)) continue

      candidates.push({ drill, variant })
    }
  }

  return candidates
}

export function pickForSlot(
  slot: BlockSlot,
  context: SetupContext,
  usedDrillIds: Set<string>,
  random: RandomSource,
): CandidateVariant | undefined {
  const candidates = findCandidates(slot, context)
  const unused = candidates.filter((candidate) => !usedDrillIds.has(candidate.drill.id))
  const pool = shuffle(unused.length > 0 ? unused : candidates, random)

  if (pool.length === 0) return undefined

  if (slot.type === 'warmup') {
    const warmup =
      pool.find((candidate) => candidate.drill.skillFocus.includes('warmup')) ??
      pool.find((candidate) => !candidate.drill.skillFocus.includes('recovery'))
    if (warmup) return warmup
  }

  if (slot.type === 'technique') {
    const passOnly = pool.find((candidate) => !candidate.drill.skillFocus.includes('movement'))
    if (passOnly) return passOnly
  }

  if (slot.type === 'movement_proxy') {
    const movement = pool.find((candidate) => candidate.drill.skillFocus.includes('movement'))
    if (movement) return movement
  }

  if (slot.type === 'wrap') {
    const recovery = pool.find((candidate) => candidate.drill.skillFocus.includes('recovery'))
    if (recovery) return recovery
  }

  return pool[0]
}
