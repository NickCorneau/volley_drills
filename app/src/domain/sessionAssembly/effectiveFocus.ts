import type { BlockSlotType, SetupContext, SkillFocus } from '../../model'

const FOCUS_CONTROLLED_SLOT_TYPES = new Set<BlockSlotType>([
  'technique',
  'movement_proxy',
  'main_skill',
  'pressure',
])

export function isFocusControlledSlotType(slotType: BlockSlotType): boolean {
  return FOCUS_CONTROLLED_SLOT_TYPES.has(slotType)
}

export function effectiveSkillTags(
  slotType: BlockSlotType,
  context: SetupContext,
  fallback: readonly SkillFocus[] | undefined,
): readonly SkillFocus[] | undefined {
  if (context.sessionFocus && isFocusControlledSlotType(slotType)) {
    return [context.sessionFocus]
  }
  return fallback
}
