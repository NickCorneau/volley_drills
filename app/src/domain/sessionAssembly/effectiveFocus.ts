import type { BlockSlotType, SetupContext, SkillFocus } from '../../model'

const FOCUS_CONTROLLED_SLOT_TYPES = new Set<BlockSlotType>(['main_skill', 'pressure'])

export function effectiveSkillTags(
  slotType: BlockSlotType,
  context: SetupContext,
  fallback: readonly SkillFocus[] | undefined,
): readonly SkillFocus[] | undefined {
  if (context.sessionFocus && FOCUS_CONTROLLED_SLOT_TYPES.has(slotType)) {
    return [context.sessionFocus]
  }
  return fallback
}
