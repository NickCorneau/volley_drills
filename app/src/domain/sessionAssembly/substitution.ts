import {
  SUBSTITUTION_RULES,
  type SubstitutionRule,
} from '../../data/substitutionRules'
import { findSubstitute } from '../drillSelection'
import type { BlockSlot, PlayerLevel, SetupContext } from '../../model'
import type { CandidateVariant, FindCandidatesOptions } from './candidates'
import { findCandidates } from './candidates'
import { deriveSubstitutionRationale } from './rationale'

/**
 * Returns the build-time substitute for a blocked main-skill progression,
 * or `undefined` so callers can fall through to normal slot picking.
 */
export function pickMainSkillSubstitute(
  slot: BlockSlot,
  context: SetupContext,
  usedDrillIds: Set<string>,
  lastMainSkillDrillId: string,
  rules: readonly SubstitutionRule[] = SUBSTITUTION_RULES,
  options?: { readonly playerLevel?: PlayerLevel },
): { candidate: CandidateVariant; rationale: string } | undefined {
  const findOptions: FindCandidatesOptions | undefined =
    options?.playerLevel === undefined ? undefined : { playerLevel: options.playerLevel }
  const candidates = findCandidates(slot, context, findOptions)
  const unused = candidates.filter((candidate) => !usedDrillIds.has(candidate.drill.id))
  const pool = unused.length > 0 ? unused : candidates

  const result = findSubstitute(lastMainSkillDrillId, pool, context, rules)
  if (!result) return undefined

  return {
    candidate: result.candidate,
    rationale: deriveSubstitutionRationale(result.rule),
  }
}
