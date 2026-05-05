import {
  SUBSTITUTION_RULES,
  type SubstitutionRule,
} from '../../data/substitutionRules'
import { findSubstitute } from '../drillSelection'
import type { BlockSlot, PlayerLevel, SetupContext } from '../../model'
import type { CandidateVariant } from './candidates'
import { findCandidates } from './candidates'
import { partitionByLevel } from './partitionByLevel'
import { deriveSubstitutionRationale } from './rationale'

export interface PickMainSkillSubstituteResult {
  candidate: CandidateVariant
  rationale: string
  levelRelaxed: boolean
}

/**
 * Returns the build-time substitute for a blocked main-skill progression,
 * or `undefined` so callers can fall through to normal slot picking.
 *
 * Two-pass discipline mirrors `pickForSlot`: try in-band substitutes
 * first; on empty, fall back to the full pool. `main_skill` is a
 * focus-controlled slot, so a successful out-of-band fallback returns
 * `levelRelaxed: true` (per K3 of the
 * `2026-05-04-001-feat-skill-level-mutability-plan.md`).
 */
export function pickMainSkillSubstitute(
  slot: BlockSlot,
  context: SetupContext,
  usedDrillIds: Set<string>,
  lastMainSkillDrillId: string,
  effectiveLevelValue?: PlayerLevel,
  rules: readonly SubstitutionRule[] = SUBSTITUTION_RULES,
): PickMainSkillSubstituteResult | undefined {
  const candidates = findCandidates(slot, context)

  // Pre-engine-wiring single-pass behavior when no level value
  // provided. Preserves golden-seed pin tests that pre-date the
  // engine reading skill level.
  if (effectiveLevelValue === undefined) {
    const unused = candidates.filter((candidate) => !usedDrillIds.has(candidate.drill.id))
    const pool = unused.length > 0 ? unused : candidates
    const result = findSubstitute(lastMainSkillDrillId, pool, context, rules)
    if (!result) return undefined
    return {
      candidate: result.candidate,
      rationale: deriveSubstitutionRationale(result.rule),
      levelRelaxed: false,
    }
  }

  const { inBand } = partitionByLevel(candidates, effectiveLevelValue)

  // First pass: in-band only.
  if (inBand.length > 0) {
    const unused = inBand.filter((candidate) => !usedDrillIds.has(candidate.drill.id))
    const pool = unused.length > 0 ? unused : inBand
    const inBandResult = findSubstitute(lastMainSkillDrillId, pool, context, rules)
    if (inBandResult) {
      return {
        candidate: inBandResult.candidate,
        rationale: deriveSubstitutionRationale(inBandResult.rule),
        levelRelaxed: false,
      }
    }
  }

  // Second pass: relax level. Use the full candidate pool.
  const fullUnused = candidates.filter((candidate) => !usedDrillIds.has(candidate.drill.id))
  const fullPool = fullUnused.length > 0 ? fullUnused : candidates
  const fullResult = findSubstitute(lastMainSkillDrillId, fullPool, context, rules)
  if (!fullResult) return undefined

  // `main_skill` is always focus-controlled; report levelRelaxed when
  // the picked substitute is out-of-band.
  const pickIsInBand = inBand.some((c) => c.drill.id === fullResult.candidate.drill.id)
  return {
    candidate: fullResult.candidate,
    rationale: deriveSubstitutionRationale(fullResult.rule),
    levelRelaxed: !pickIsInBand,
  }
}
