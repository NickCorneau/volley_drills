import type { BlockSlotType, SetupContext, SkillFocus } from '../../model'

/**
 * Single source of truth for which slot types are user-visible
 * promise slots (per K3 of the 2026-05-04 skill-level-mutability
 * plan). The Tune today relaxation eyebrow only fires when the
 * engine could not honor the user's saved level on one of these
 * slots; the focus picker only narrows skill tags on these slots.
 *
 * Consumed by `effectiveSkillTags` (this file), `pickForSlot`
 * (`candidates.ts`), `findSwapAlternatives` (`swapAlternatives.ts`),
 * and any future picker that needs to know whether a slot carries
 * the focus-controlled contract.
 */
export const FOCUS_CONTROLLED_SLOT_TYPES = new Set<BlockSlotType>(['main_skill', 'pressure'])

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
