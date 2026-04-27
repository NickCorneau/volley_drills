/**
 * Explicit drill substitution rules for known blocked preferred progressions.
 *
 * This is intentionally smaller than a full rung/intent ontology: rules are
 * authored only for concrete dead ends where the preferred progression is
 * blocked by a hard context constraint and a coach-defensible hold/lateral
 * substitute exists.
 */

/**
 * Hard context constraints that the build/swap path can detect today.
 *
 * Narrowed to the constraints that have a matching `SetupContext` field
 * (`netAvailable`, `wallAvailable`). `needsLines`, `needsCones`, and
 * raw equipment counts are intentionally excluded until SetupContext
 * gains the corresponding gate field; otherwise the build path can't
 * tell whether the constraint is actually blocking and would falsely
 * trigger substitution. See the 2026-04-26 red-team remediation plan.
 */
export type BlockedConstraint = 'needsNet' | 'needsWall'

export type SubstitutionTransfer = 'direct' | 'partial' | 'proxy'

export interface SubstitutionRule {
  fromDrillId: string
  preferredToDrillId: string
  blockedBy: BlockedConstraint
  substituteDrillIds: readonly string[]
  preservedIntent: string
  transfer: SubstitutionTransfer
}

export const SUBSTITUTION_RULES: readonly SubstitutionRule[] = [
  {
    fromDrillId: 'd03',
    preferredToDrillId: 'd04',
    blockedBy: 'needsNet',
    substituteDrillIds: ['d10'],
    preservedIntent: 'partner-fed platform control without a net',
    transfer: 'partial',
  },
] as const
