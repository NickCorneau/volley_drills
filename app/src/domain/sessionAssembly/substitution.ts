import {
  SUBSTITUTION_RULES,
  type SubstitutionRule,
} from '../../data/substitutionRules'
import type { StressLadderFocus } from '../../data/stressLadders'
import { findActiveSubstitutionRule } from '../drillSelection'
import type { BlockSlot, PlayerLevel, SetupContext } from '../../model'
import type { CandidateVariant, FindCandidatesOptions } from './candidates'
import { findCandidates, orderByStressDistance } from './candidates'
import { deriveSubstitutionRationale } from './rationale'

export interface PickMainSkillSubstituteOptions {
  readonly playerLevel?: PlayerLevel
  /**
   * U6 (D159): derived per-focus ladder positions. When the session
   * focus is scoped and a position resolved for it, the rule's authored
   * substitutes are ordered by rung distance to that position
   * (stable sort — authored order breaks ties) instead of pure authored
   * order, so the substitution path participates in steering rather
   * than bypassing it. Absent → authored order, exactly the pre-U6
   * behavior. The mid-run Swap path deliberately keeps authored order
   * (live D157 deferral).
   */
  readonly stressPositions?: Partial<Record<StressLadderFocus, number>>
}

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
  options?: PickMainSkillSubstituteOptions,
): { candidate: CandidateVariant; rationale: string } | undefined {
  const findOptions: FindCandidatesOptions | undefined =
    options?.playerLevel === undefined ? undefined : { playerLevel: options.playerLevel }
  const candidates = findCandidates(slot, context, findOptions)
  const unused = candidates.filter((candidate) => !usedDrillIds.has(candidate.drill.id))
  const pool = unused.length > 0 ? unused : candidates

  const rule = findActiveSubstitutionRule(lastMainSkillDrillId, context, rules)
  if (!rule) return undefined

  // One pool entry per authored substitute id, authored order preserved
  // (first variant match per drill, mirroring findSubstitute).
  const available = rule.substituteDrillIds
    .map((substituteId) => pool.find((candidate) => candidate.drill.id === substituteId))
    .filter((candidate): candidate is CandidateVariant => candidate !== undefined)
  if (available.length === 0) return undefined

  const steerFocus = context.sessionFocus
  const steerPosition =
    steerFocus === undefined ? undefined : options?.stressPositions?.[steerFocus]
  const ordered =
    steerFocus !== undefined && steerPosition !== undefined
      ? orderByStressDistance(available, steerFocus, steerPosition)
      : available

  return {
    candidate: ordered[0],
    rationale: deriveSubstitutionRationale(rule),
  }
}
