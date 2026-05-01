import { DRILLS } from '../../data/drills'
import type { BlockSlot, DrillVariant, PlayerLevel, SetupContext } from '../../model'
import type { SelectionCandidate } from '../drillSelection'
import { effectiveSkillTags, isFocusControlledSlotType } from './effectiveFocus'
import type { RandomSource } from './random'
import { shuffle } from './random'

export type CandidateVariant = SelectionCandidate

export interface FindCandidatesOptions {
  readonly playerLevel?: PlayerLevel
}

export interface PickForSlotOptions extends FindCandidatesOptions {
  readonly allowUsedFallback?: boolean
}

const PLAYER_LEVEL_ORDER: Record<PlayerLevel, number> = {
  beginner: 0,
  intermediate: 1,
  advanced: 2,
}

export function hasUnmodeledRequirements(variant: DrillVariant): boolean {
  return (
    variant.environmentFlags.needsLines ||
    variant.environmentFlags.needsCones ||
    variant.equipment.cones !== undefined ||
    variant.equipment.balls === 'many' ||
    (typeof variant.equipment.balls === 'number' && variant.equipment.balls > 1)
  )
}

function isLevelEligible(
  drill: { readonly levelMin: PlayerLevel; readonly levelMax: PlayerLevel },
  level: PlayerLevel | undefined,
): boolean {
  if (level === undefined) return true
  return PLAYER_LEVEL_ORDER[drill.levelMin] <= PLAYER_LEVEL_ORDER[level] &&
    PLAYER_LEVEL_ORDER[level] <= PLAYER_LEVEL_ORDER[drill.levelMax]
}

export function findCandidates(
  slot: BlockSlot,
  context: SetupContext,
  options?: FindCandidatesOptions,
): CandidateVariant[] {
  const playerCount = context.playerMode === 'solo' ? 1 : 2
  const candidates: CandidateVariant[] = []
  const skillTags = effectiveSkillTags(slot.type, context, slot.skillTags)
  const effectivePlayerLevel = options?.playerLevel ?? context.playerLevel
  const playerLevel = isFocusControlledSlotType(slot.type) ? effectivePlayerLevel : undefined

  for (const drill of DRILLS) {
    if (!drill.m001Candidate) continue
    if (!isLevelEligible(drill, playerLevel)) continue

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
  options?: PickForSlotOptions,
): CandidateVariant | undefined {
  const candidates = findCandidates(slot, context, options)
  const unused = candidates.filter((candidate) => !usedDrillIds.has(candidate.drill.id))
  if (unused.length === 0 && options?.allowUsedFallback === false) return undefined
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
