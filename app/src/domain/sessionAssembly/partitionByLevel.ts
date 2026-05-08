import type { PlayerLevel } from '../../model'
import type { SelectionCandidate } from '../drillSelection'

/**
 * Partition a candidate pool by whether each drill's `[levelMin,
 * levelMax]` band contains the effective player level.
 *
 * Consumers (current, post-2026-05-07):
 *
 *   - `focusCoverageAudit.ts` reports per-cell `mainFamiliesInBand`
 *     and `mainFamiliesTotal` counts so the audit's "covered" rule
 *     can hold against the band, not the unfiltered pool.
 *   - `pickForSlot` (in `candidates.ts`) uses the `outOfBand` arm to
 *     run a single relaxation pass: when a focus-controlled REQUIRED
 *     slot has zero in-band UNUSED candidates left, it prefers an
 *     out-of-band UNUSED drill of the same focus over duplicating an
 *     already-picked in-band drill. This restores the engine intent
 *     that the 2026-05-05 `feat/focus-coverage-readiness` merge
 *     overwrote (no UI surface — `D137` retired the `levelRelaxed`
 *     eyebrow and is not reversed here).
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
