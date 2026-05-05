import { DRILLS } from '../../data/drills'
import type { BlockSlot, BlockSlotType, DrillVariant, PlayerLevel, SetupContext } from '../../model'
import type { SelectionCandidate } from '../drillSelection'
import { effectiveSkillTags, FOCUS_CONTROLLED_SLOT_TYPES } from './effectiveFocus'
import { partitionByLevel } from './partitionByLevel'
import type { RandomSource } from './random'
import { shuffle } from './random'

export type CandidateVariant = SelectionCandidate

/**
 * Result of `pickForSlot`. `levelRelaxed: true` only when the picker
 * had to fall back to the full pool (skipping the in-band partition)
 * for a focus-controlled slot. For non-focus-controlled slots, the
 * picker still prefers in-band drills but the relaxation event is
 * silent (`levelRelaxed: false`) per K3 of
 * `docs/plans/2026-05-04-001-feat-skill-level-mutability-plan.md` —
 * Tune today's relaxation eyebrow is about user-visible promise on
 * focus-controlled slots only.
 */
export interface PickForSlotResult {
  pick: CandidateVariant | undefined
  levelRelaxed: boolean
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

function pickFromPool(
  pool: readonly CandidateVariant[],
  slotType: BlockSlotType,
): CandidateVariant | undefined {
  if (pool.length === 0) return undefined

  if (slotType === 'warmup') {
    const warmup =
      pool.find((candidate) => candidate.drill.skillFocus.includes('warmup')) ??
      pool.find((candidate) => !candidate.drill.skillFocus.includes('recovery'))
    if (warmup) return warmup
  }

  if (slotType === 'technique') {
    const passOnly = pool.find((candidate) => !candidate.drill.skillFocus.includes('movement'))
    if (passOnly) return passOnly
  }

  if (slotType === 'movement_proxy') {
    const movement = pool.find((candidate) => candidate.drill.skillFocus.includes('movement'))
    if (movement) return movement
  }

  if (slotType === 'wrap') {
    const recovery = pool.find((candidate) => candidate.drill.skillFocus.includes('recovery'))
    if (recovery) return recovery
  }

  return pool[0]
}

/**
 * Pick a candidate for the slot, preferring drills whose `[levelMin,
 * levelMax]` band contains the effective level. Two-pass discipline:
 * first try the in-band partition; on empty, fall back to the full
 * pool (level relaxed). Returns `levelRelaxed: true` only when the
 * fallback fired AND the slot is focus-controlled (per K3) — the
 * Tune today eyebrow only renders for user-visible-promise slots.
 *
 * When `effectiveLevelValue` is omitted (legacy callers, golden-seed
 * pin tests, recovery without onboarding), level filtering is skipped
 * entirely and the picker behaves exactly as it did pre-engine-wiring:
 * single pass against the full candidate pool with the seeded shuffle
 * and slot-type heuristics. This preserves deterministic-seed
 * regression tests that pin specific drill IDs per seed.
 *
 * The slot-type-specific selector (warmup-prefers-warmup-tag,
 * technique-rejects-movement, movement_proxy-prefers-movement,
 * wrap-prefers-recovery) runs against each pool independently, so
 * heuristics still apply to the in-band pool first when the
 * two-pass discipline is active.
 */
export function pickForSlot(
  slot: BlockSlot,
  context: SetupContext,
  usedDrillIds: Set<string>,
  random: RandomSource,
  effectiveLevelValue?: PlayerLevel,
): PickForSlotResult {
  const candidates = findCandidates(slot, context)

  // Pre-engine-wiring single-pass behavior when no level value provided.
  if (effectiveLevelValue === undefined) {
    const unused = candidates.filter((candidate) => !usedDrillIds.has(candidate.drill.id))
    const pool = shuffle(unused.length > 0 ? unused : candidates, random)
    return { pick: pickFromPool(pool, slot.type), levelRelaxed: false }
  }

  const { inBand, outOfBand } = partitionByLevel(candidates, effectiveLevelValue)

  // First pass: in-band only.
  if (inBand.length > 0) {
    const unused = inBand.filter((candidate) => !usedDrillIds.has(candidate.drill.id))
    const pool = shuffle(unused.length > 0 ? unused : inBand, random)
    const pick = pickFromPool(pool, slot.type)
    if (pick) return { pick, levelRelaxed: false }
  }

  // Second pass: relax level. Use the full pool (in-band + out-of-band).
  // Note: today, `pickFromPool` always returns a non-undefined pick
  // when its input is non-empty (the slot-type heuristics fall through
  // to `pool[0]` when no preferred drill matches), so the first pass
  // never falls through to here when `inBand.length > 0`. The second
  // pass effectively only fires when the in-band partition is empty
  // (i.e., no in-band drill exists for this slot+context). If a
  // future change makes the slot-type heuristics return `undefined`
  // for non-empty pools (e.g., to enforce strict tag matching), the
  // second pass would also cover heuristic-rejection-on-in-band.
  if (outOfBand.length === 0) return { pick: undefined, levelRelaxed: false }
  const fullUnused = candidates.filter((candidate) => !usedDrillIds.has(candidate.drill.id))
  const fullPool = shuffle(fullUnused.length > 0 ? fullUnused : candidates, random)
  const pick = pickFromPool(fullPool, slot.type)
  if (!pick) return { pick: undefined, levelRelaxed: false }

  // Detect whether the picked drill is in-band; only report
  // levelRelaxed when both conditions hold: focus-controlled slot AND
  // the pick came from the out-of-band partition.
  const pickIsInBand = inBand.some((c) => c.drill.id === pick.drill.id)
  const isFocusControlled = FOCUS_CONTROLLED_SLOT_TYPES.has(slot.type)
  return {
    pick,
    levelRelaxed: isFocusControlled && !pickIsInBand,
  }
}
