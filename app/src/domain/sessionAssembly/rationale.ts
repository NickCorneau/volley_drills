import type { BlockedConstraint, SubstitutionRule } from '../../data/substitutionRules'
import type { Drill, SkillFocus } from '../../types/drill'
import type { BlockSlotType, SetupContext } from '../../types/session'

const SKILL_FOCUS_LABEL: Record<SkillFocus, string> = {
  pass: 'passing',
  set: 'setting',
  serve: 'serving',
  movement: 'movement',
  conditioning: 'conditioning',
  warmup: 'warmup',
  recovery: 'recovery',
}

function focusPhrase(drill: Pick<Drill, 'skillFocus'>): string {
  const primary = drill.skillFocus[0]
  if (!primary) return 'skill work'
  return SKILL_FOCUS_LABEL[primary]
}

export function deriveBlockRationale(
  slotType: BlockSlotType,
  drill: Pick<Drill, 'skillFocus'>,
  context: SetupContext,
): string {
  void context

  const focus = focusPhrase(drill)
  switch (slotType) {
    case 'warmup':
      return 'Chosen because: every session opens with a sand-specific warmup.'
    case 'wrap':
      return 'Chosen because: every session closes with a cooldown downshift.'
    case 'technique':
      return `Chosen because: low-intensity ${focus} rep to groove the pattern.`
    case 'movement_proxy':
      return `Chosen because: sand movement rep tied to ${focus}.`
    case 'main_skill':
      return `Chosen because: today's main ${focus} rep.`
    case 'pressure':
      return `Chosen because: adds pressure to your ${focus} under fatigue.`
  }
}

function blockedConstraintPhrase(blockedConstraint: BlockedConstraint): string {
  switch (blockedConstraint) {
    case 'needsNet':
      return 'net drill'
    case 'needsWall':
      return 'wall drill'
  }
}

export function deriveSubstitutionRationale(rule: SubstitutionRule): string {
  return `Chosen because: the next ${blockedConstraintPhrase(
    rule.blockedBy,
  )} is unavailable today, so this keeps ${rule.preservedIntent}.`
}
