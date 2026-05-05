import type { PlayerLevel } from '../../model'
import type { SelectionCandidate } from '../drillSelection'

/**
 * Partition a candidate pool by whether each drill's `[levelMin,
 * levelMax]` band contains the effective player level.
 *
 * The two-pool primitive `pickForSlot`, `pickMainSkillSubstitute`, and
 * `findSwapAlternatives` compose to honor the user's saved skill level
 * with a focus-held level-relax fallback (R14 / R15 of the brainstorm).
 *
 * The band-overlap predicate is a single-point membership test:
 * `levelMin <= effective <= levelMax`. The ordinal map below is the
 * single source of truth for `PlayerLevel` ordering; do not duplicate
 * it inline at each consumer.
 *
 * Preserves input order within each partition (deterministic for the
 * seeded shuffle layer above).
 */

const LEVEL_ORDINAL: Record<PlayerLevel, number> = {
  beginner: 0,
  intermediate: 1,
  advanced: 2,
}

export interface PartitionByLevelResult {
  inBand: SelectionCandidate[]
  outOfBand: SelectionCandidate[]
}

export function partitionByLevel(
  candidates: readonly SelectionCandidate[],
  effective: PlayerLevel,
): PartitionByLevelResult {
  const target = LEVEL_ORDINAL[effective]
  const inBand: SelectionCandidate[] = []
  const outOfBand: SelectionCandidate[] = []
  for (const candidate of candidates) {
    const min = LEVEL_ORDINAL[candidate.drill.levelMin]
    const max = LEVEL_ORDINAL[candidate.drill.levelMax]
    if (min <= target && target <= max) {
      inBand.push(candidate)
    } else {
      outOfBand.push(candidate)
    }
  }
  return { inBand, outOfBand }
}
