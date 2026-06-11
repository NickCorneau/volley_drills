/**
 * Home-coherence — Home one-tap session launches (plan + repeat).
 *
 * Both Home launch paths share one build-and-save seam: resolve the
 * persisted skill level, assemble a draft from a `SetupContext`, persist
 * it. `startPlanSession` (the focal "Start [focus] session" action)
 * reuses the last session's physical conditions but overrides
 * `sessionFocus` to the plan's next focus (staleness head).
 * `repeatSession` reuses the prior context verbatim — "same conditions"
 * includes the prior session's chosen focus, and pain-recovery rebuilds
 * strip focus by design elsewhere; do NOT add a strip here without
 * re-checking that decision.
 *
 * Returns `true` when a draft was saved (the caller routes to Safety),
 * `false` when there is no prior context to reuse or assembly produced no
 * draft (the caller falls back to a fresh Setup). Safety is never skipped
 * — the caller always routes through the Setup -> Safety spine (D137).
 *
 * D154 closed the D152 named gap: an ACCEPTED adaptation delta now acts.
 * `startPlanSession` steers assembly with the derived stress positions
 * (`loadStressPositions`), so the session after an accepted
 * "more/less stress" verdict assembles one rung up or down on that
 * focus. `repeatSession` stays verbatim by design — Repeat means "same
 * conditions, same selection behavior", never a re-steer.
 */
import { buildDraft } from '../domain/sessionBuilder'
import type { ScopedFocus } from '../domain/eligibleSessions'
import type { SetupContext } from '../model'
import { isSkillLevel, skillLevelToDrillBand } from '../lib/skillLevel'
import { saveDraft } from './session'
import { getStorageMeta } from './storageMeta'
import { loadStressPositions } from './stressPositions'

async function buildAndSaveDraft(
  context: SetupContext,
  options?: { readonly steerStress?: boolean },
): Promise<boolean> {
  const skillLevel = await getStorageMeta('onboarding.skillLevel', isSkillLevel)
  const playerLevel = skillLevel === undefined ? undefined : skillLevelToDrillBand(skillLevel)
  const stressPositions = options?.steerStress ? await loadStressPositions() : undefined
  const draft = buildDraft(context, { playerLevel, stressPositions })
  if (!draft) return false
  await saveDraft(draft)
  return true
}

export interface StartPlanSessionInput {
  /** The last session's setup context, reused for physical conditions. */
  priorContext: SetupContext | null
  /** The plan's recommended next focus (staleness head). */
  nextFocus: ScopedFocus
}

export async function startPlanSession(input: StartPlanSessionInput): Promise<boolean> {
  const { priorContext, nextFocus } = input
  if (!priorContext) return false
  // Reuse the prior physical conditions but steer the focus to the
  // plan's next focus. effectiveSkillTags applies it to the focus-
  // controlled assembly slots; stress steering applies the derived
  // ladder position to the main_skill pick (D154).
  return buildAndSaveDraft({ ...priorContext, sessionFocus: nextFocus }, { steerStress: true })
}

/**
 * One-tap Repeat: rebuild a fresh full-plan draft from the prior context
 * verbatim (focus included). No Setup detour, no stale-context banner,
 * no stress steering (R10: Repeat is verbatim by design).
 */
export async function repeatSession(priorContext: SetupContext | null): Promise<boolean> {
  if (!priorContext) return false
  return buildAndSaveDraft(priorContext)
}
