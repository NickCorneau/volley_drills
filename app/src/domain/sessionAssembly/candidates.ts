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
  readonly targetDurationMinutes?: number
  readonly preferTargetDurationFit?: boolean
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
  return (
    PLAYER_LEVEL_ORDER[drill.levelMin] <= PLAYER_LEVEL_ORDER[level] &&
    PLAYER_LEVEL_ORDER[level] <= PLAYER_LEVEL_ORDER[drill.levelMax]
  )
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
    // D49 is high-load setting conditioning. Keep it out of support slots so
    // it remains available for the main-skill duration-pressure path it was
    // authored to solve.
    if (drill.id === 'd49' && slot.type !== 'main_skill') continue
    // D50 is the long-envelope advanced passing sibling for D46 (FIVB 3.13
    // Short/Deep). Same rationale as D49: keep it out of support slots so the
    // main-skill duration-pressure reroute path stays its only entry point.
    if (drill.id === 'd50' && slot.type !== 'main_skill') continue
    // D51 is the long-envelope beginner serving sibling for D31 (FIVB 2.2
    // Outside the Heart). Same main-skill-only constraint as d49 and d50;
    // selection-path reroute in sessionBuilder is the sole entry point.
    if (drill.id === 'd51' && slot.type !== 'main_skill') continue
    if (!isLevelEligible(drill, playerLevel)) continue

    const hasMatchingFocus =
      !skillTags ||
      skillTags.length === 0 ||
      skillTags.some((tag) => drill.skillFocus.includes(tag))
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

export function candidateCanCarryTargetDuration(
  candidate: CandidateVariant,
  targetDurationMinutes: number,
): boolean {
  const fatigueMaxMinutes = candidate.variant.workload.fatigueCap?.maxMinutes
  return (
    candidate.variant.workload.durationMaxMinutes >= targetDurationMinutes &&
    (fatigueMaxMinutes === undefined || fatigueMaxMinutes >= targetDurationMinutes)
  )
}

export function candidateDurationCapacity(candidate: CandidateVariant): number {
  const fatigueMaxMinutes = candidate.variant.workload.fatigueCap?.maxMinutes
  return Math.min(
    candidate.variant.workload.durationMaxMinutes,
    fatigueMaxMinutes ?? Number.MAX_SAFE_INTEGER,
  )
}

function strongestDurationCapacityCandidate(
  candidates: readonly CandidateVariant[],
): CandidateVariant | undefined {
  return candidates.reduce<CandidateVariant | undefined>((best, candidate) => {
    if (!best) return candidate
    return candidateDurationCapacity(candidate) > candidateDurationCapacity(best) ? candidate : best
  }, undefined)
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

  const targetDurationMinutes = options?.targetDurationMinutes
  if (slot.type === 'main_skill' && targetDurationMinutes !== undefined) {
    const defaultPick = pool[0]
    const shouldPreferTargetDuration =
      options?.preferTargetDurationFit === true ||
      (defaultPick?.drill.id === 'd01' &&
        !candidateCanCarryTargetDuration(defaultPick, targetDurationMinutes))
    if (shouldPreferTargetDuration) {
      const durationFit = pool.find((candidate) =>
        candidateCanCarryTargetDuration(candidate, targetDurationMinutes),
      )
      if (durationFit) return durationFit
      const strongestCandidate = strongestDurationCapacityCandidate(
        defaultPick?.drill.id === 'd01'
          ? pool.filter((candidate) => candidate.drill.id !== 'd01')
          : pool,
      )
      if (strongestCandidate) return strongestCandidate
    }
  }

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
