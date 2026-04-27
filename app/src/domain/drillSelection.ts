import {
  type BlockedConstraint,
  type SubstitutionRule,
  type SubstitutionTransfer,
} from '../data/substitutionRules'
import type { Drill, DrillVariant } from '../types/drill'
import type { SetupContext } from '../db/types'

export interface SelectionCandidate {
  drill: Drill
  variant: DrillVariant
}

export interface SubstituteSelection {
  candidate: SelectionCandidate
  rule: SubstitutionRule
}

/**
 * Whether a hard `BlockedConstraint` is currently blocking the user
 * given today's `SetupContext`. The switch must remain exhaustive so
 * adding a new `BlockedConstraint` value at the data layer fails the
 * type-check until the gating field exists on `SetupContext`.
 */
export function isConstraintActive(constraint: BlockedConstraint, context: SetupContext): boolean {
  switch (constraint) {
    case 'needsNet':
      return !context.netAvailable
    case 'needsWall':
      return !context.wallAvailable
  }
}

/**
 * Find a candidate matching a preferred progression target, if it is
 * present in the pool. Used by the Swap path to promote the natural
 * "your next progression is available today" drill to the front of
 * the alternates list. Returns `undefined` when the preferred drill
 * isn't in the pool, in which case the caller may fall back to
 * `findSubstitute` for the blocked-progression path.
 */
export function findPreferredCandidate(
  preferredToDrillId: string,
  candidates: readonly SelectionCandidate[],
): SelectionCandidate | undefined {
  return candidates.find((c) => c.drill.id === preferredToDrillId)
}

/**
 * Find a substitute candidate for `currentDrillId` under today's
 * `context`, given a catalog of `SubstitutionRule`s.
 *
 * Returns a (candidate, rule) pair when:
 *   1. A rule exists with `fromDrillId === currentDrillId`,
 *   2. that rule's `blockedBy` constraint is active in `context`, AND
 *   3. one of the rule's `substituteDrillIds` is in `candidates`.
 *
 * Iterates `substituteDrillIds` in authored order; first match wins.
 * Returns `undefined` if no rule fires or no substitute is in the
 * candidate pool. Deterministic by construction: no shuffle, no
 * dependence on call order, and rule iteration follows the catalog
 * order.
 *
 * This helper is the single source of truth for blocked-progression
 * substitution. The build path (`buildDraft`) and the swap path
 * (`findSwapAlternatives`) both call it; rules data is the only place
 * that names the (from -> substitute) relationship.
 */
export function findSubstitute(
  currentDrillId: string,
  candidates: readonly SelectionCandidate[],
  context: SetupContext,
  rules: readonly SubstitutionRule[],
): SubstituteSelection | undefined {
  const rule = rules.find(
    (candidateRule) =>
      candidateRule.fromDrillId === currentDrillId &&
      isConstraintActive(candidateRule.blockedBy, context),
  )
  if (!rule) return undefined

  for (const substituteId of rule.substituteDrillIds) {
    const candidate = candidates.find((c) => c.drill.id === substituteId)
    if (candidate) return { candidate, rule }
  }
  return undefined
}

export type { BlockedConstraint, SubstitutionRule, SubstitutionTransfer }
