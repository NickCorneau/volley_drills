import { DRILLS } from '../data/drills'
import { selectArchetype } from '../data/archetypes'
import type { Drill, DrillVariant } from '../types/drill'
import type { BlockSlot, BlockSlotType } from '../types/session'
import type { DraftBlock, SessionDraft, SetupContext } from '../db/types'

const allDrills: readonly Drill[] = DRILLS

interface CandidateVariant {
  drill: Drill
  variant: DrillVariant
}

function shuffle<T>(arr: T[]): T[] {
  const out = [...arr]
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[out[i], out[j]] = [out[j], out[i]]
  }
  return out
}

const DURATION_PRIORITY: readonly BlockSlotType[] = [
  'main_skill',
  'technique',
  'movement_proxy',
  'pressure',
  'warmup',
  'wrap',
]

function hasUnmodeledRequirements(variant: DrillVariant): boolean {
  return (
    variant.environmentFlags.needsLines ||
    variant.environmentFlags.needsCones ||
    variant.equipment.cones !== undefined ||
    variant.equipment.balls === 'many' ||
    (typeof variant.equipment.balls === 'number' && variant.equipment.balls > 1)
  )
}

function findCandidates(
  slot: BlockSlot,
  context: SetupContext,
): CandidateVariant[] {
  const playerCount = context.playerMode === 'solo' ? 1 : 2

  const candidates: CandidateVariant[] = []
  for (const drill of allDrills) {
    if (!drill.m001Candidate) continue

    const hasMatchingFocus =
      !slot.skillTags ||
      slot.skillTags.length === 0 ||
      slot.skillTags.some((tag) =>
        drill.skillFocus.includes(tag as Drill['skillFocus'][number]),
      )
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

function pickForSlot(
  slot: BlockSlot,
  context: SetupContext,
  usedDrillIds: Set<string>,
): CandidateVariant | undefined {
  const candidates = findCandidates(slot, context)

  const unused = candidates.filter((c) => !usedDrillIds.has(c.drill.id))
  const pool = shuffle(unused.length > 0 ? unused : candidates)

  if (pool.length === 0) return undefined

  if (slot.type === 'warmup') {
    const warmup = pool.find((c) => !c.drill.skillFocus.includes('recovery'))
    if (warmup) return warmup
  }

  if (slot.type === 'wrap') {
    const recovery = pool.find((c) => c.drill.skillFocus.includes('recovery'))
    if (recovery) return recovery
  }

  return pool[0]
}

function allocateDurations(layout: BlockSlot[], totalMinutes: number): number[] | null {
  const durations = layout.map((slot) => slot.durationMinMinutes)
  const minTotal = durations.reduce((sum, value) => sum + value, 0)
  const maxTotal = layout.reduce((sum, slot) => sum + slot.durationMaxMinutes, 0)

  if (totalMinutes < minTotal || totalMinutes > maxTotal) return null

  let remaining = totalMinutes - minTotal
  while (remaining > 0) {
    let progressed = false
    for (const slotType of DURATION_PRIORITY) {
      for (let i = 0; i < layout.length; i++) {
        const slot = layout[i]
        if (slot.type !== slotType) continue
        if (durations[i] >= slot.durationMaxMinutes) continue
        durations[i] += 1
        remaining -= 1
        progressed = true
        if (remaining === 0) return durations
      }
    }
    if (!progressed) return null
  }

  return durations
}

export function buildDraft(context: SetupContext): SessionDraft | null {
  const archetype = selectArchetype(context)
  if (!archetype) return null

  const layout = archetype.layouts[context.timeProfile]
  if (!layout || layout.length === 0) return null
  const durations = allocateDurations(layout, context.timeProfile)
  if (!durations) return null

  const usedDrillIds = new Set<string>()
  const blocks: DraftBlock[] = []
  let blockIndex = 0

  for (let i = 0; i < layout.length; i++) {
    const slot = layout[i]
    const pick = pickForSlot(slot, context, usedDrillIds)

    if (!pick) {
      if (slot.required) return null
      continue
    }

    usedDrillIds.add(pick.drill.id)

    blocks.push({
      id: `block-${blockIndex++}`,
      type: slot.type,
      drillId: pick.drill.id,
      variantId: pick.variant.id,
      drillName: pick.drill.name,
      shortName: pick.drill.shortName,
      durationMinutes: durations[i],
      coachingCue:
        pick.variant.coachingCues.length > 0
          ? pick.variant.coachingCues.join(' · ')
          : pick.drill.name,
      courtsideInstructions: pick.variant.courtsideInstructions,
      required: slot.required,
    })
  }

  if (blocks.length === 0) return null

  return {
    id: 'current',
    context,
    archetypeId: archetype.id,
    archetypeName: archetype.name,
    blocks,
    updatedAt: Date.now(),
  }
}

/**
 * Build a recovery-only draft for when SafetyCheck flags pain.
 * Uses the same archetype but only warmup + wrap blocks.
 */
export function buildRecoveryDraft(context: SetupContext): SessionDraft | null {
  const archetype = selectArchetype(context)
  if (!archetype) return null

  const layout = archetype.layouts[context.timeProfile]
  if (!layout) return null

  const recoverySlotTypes: BlockSlotType[] = ['warmup', 'wrap']
  const recoveryLayout = layout.filter((s) => recoverySlotTypes.includes(s.type))
  if (recoveryLayout.length === 0) return null
  const recoveryTotal = recoveryLayout.reduce(
    (sum, slot) => sum + slot.durationMinMinutes,
    0,
  )
  const durations = allocateDurations(recoveryLayout, recoveryTotal)
  if (!durations) return null

  const usedDrillIds = new Set<string>()
  const blocks: DraftBlock[] = []
  let blockIndex = 0

  for (let i = 0; i < recoveryLayout.length; i++) {
    const slot = recoveryLayout[i]
    const pick = pickForSlot(slot, context, usedDrillIds)
    if (!pick) continue

    usedDrillIds.add(pick.drill.id)

    blocks.push({
      id: `block-${blockIndex++}`,
      type: slot.type,
      drillId: pick.drill.id,
      variantId: pick.variant.id,
      drillName: pick.drill.name,
      shortName: pick.drill.shortName,
      durationMinutes: durations[i],
      coachingCue:
        pick.variant.coachingCues.length > 0
          ? pick.variant.coachingCues.join(' · ')
          : pick.drill.name,
      courtsideInstructions: pick.variant.courtsideInstructions,
      required: slot.required,
    })
  }

  if (blocks.length === 0) return null

  return {
    id: 'current',
    context,
    archetypeId: archetype.id,
    archetypeName: archetype.name,
    blocks,
    updatedAt: Date.now(),
  }
}
