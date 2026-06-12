/**
 * Home-coherence — the Home one-tap plan launch.
 *
 * `startPlanSession` (the focal "Start [focus] session" action) resolves
 * the persisted skill level, reuses the last session's physical
 * conditions, overrides `sessionFocus` to the plan's next focus
 * (staleness head), assembles a draft, and persists it.
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
 * focus.
 *
 * D158 (2026-06-12): `repeatSession` (the one-tap verbatim repeat) was
 * retired with the Home Repeat affordances after seven unused weeks of
 * founder-use mode.
 */
import { buildDraft } from '../domain/sessionBuilder'
import type { ScopedFocus } from '../domain/eligibleSessions'
import type { SetupContext } from '../model'
import { isSkillLevel, skillLevelToDrillBand } from '../lib/skillLevel'
import { loadSessionCalibration } from './calibration'
import { findLastCompletedDrillIdsByType, saveDraft } from './session'
import { getStorageMeta } from './storageMeta'
import { loadStressPositions } from './stressPositions'

async function buildAndSaveDraft(
  context: SetupContext,
  options?: { readonly steer?: boolean },
): Promise<boolean> {
  const skillLevel = await getStorageMeta('onboarding.skillLevel', isSkillLevel)
  const playerLevel = skillLevel === undefined ? undefined : skillLevelToDrillBand(skillLevel)
  // Steered launches load the full derived-input set Setup passes:
  // stress positions (D154), clock calibration (U5/KTD6), and — U6
  // (D159) Home/Setup build parity — the last-completed main-skill
  // history, so a blocked progression substitutes identically whether
  // the build started from Home or Setup.
  const [stressPositions, calibration, lastCompletedByType] = options?.steer
    ? await Promise.all([
        loadStressPositions(),
        loadSessionCalibration(),
        findLastCompletedDrillIdsByType(),
      ])
    : [undefined, undefined, undefined]
  const draft = buildDraft(context, {
    playerLevel,
    stressPositions,
    calibration,
    lastCompletedByType,
  })
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
  // ladder position to the main_skill pick (D154); clock calibration
  // scales the drill-minute budget toward honest wall time (U5).
  // `focusSource: 'resolved'` (D159) records that the focus was
  // machine-derived, so editing this draft in Setup maps the pill back
  // to Recommended instead of presenting the focus as a user pick.
  return buildAndSaveDraft(
    { ...priorContext, sessionFocus: nextFocus, focusSource: 'resolved' },
    { steer: true },
  )
}
