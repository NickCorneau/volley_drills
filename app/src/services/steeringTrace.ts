/**
 * Trust-loop U4 — Safety steering-trace read seam.
 *
 * Thin Dexie reads; the decision logic is pure domain
 * (`deriveSteeringTrace`). The terminal join mirrors `planInputs`'
 * trained-sessions notion (a plan counts as trained when a terminal
 * execution log references it), and the position fold resolves the
 * skill band through the same `onboarding.skillLevel` read assembly
 * uses — a beginner-default fold would silently mis-derive movement
 * for non-beginner users.
 */
import { db } from '../db'
import type { SessionDraft } from '../model'
import {
  deriveSteeringTrace,
  type SteeringTraceModel,
} from '../domain/adaptation/steeringTrace'
import { isTerminalSession } from '../domain/executionPredicates'
import { isSkillLevel, skillLevelToDrillBand } from '../lib/skillLevel'
import { getStorageMeta, setStorageMeta } from './storageMeta'

export const ADAPT_DISCLOSURE_DISMISSED_KEY = 'ux.adaptDisclosureDismissed'

const isBoolean = (v: unknown): v is boolean => typeof v === 'boolean'

export async function loadSteeringTrace(draft: SessionDraft): Promise<SteeringTraceModel> {
  const [reviews, plans, logs, skillLevel, dismissed] = await Promise.all([
    db.sessionReviews.toArray(),
    db.sessionPlans.toArray(),
    db.executionLogs.toArray(),
    getStorageMeta('onboarding.skillLevel', isSkillLevel),
    getStorageMeta(ADAPT_DISCLOSURE_DISMISSED_KEY, isBoolean),
  ])

  const band = skillLevel === undefined ? undefined : skillLevelToDrillBand(skillLevel)
  const trainedPlanIds = new Set(logs.filter(isTerminalSession).map((log) => log.planId))
  const steeredPlans = plans.filter((plan) => plan.steeredFocus !== undefined)

  return deriveSteeringTrace({
    draft,
    reviews,
    terminalSteeredPlans: steeredPlans.filter((plan) => trainedPlanIds.has(plan.id)),
    everSteeredPlan: steeredPlans.length > 0,
    band,
    disclosureDismissed: dismissed === true,
  })
}

/**
 * Explicit-dismissal write for the one-time disclosure (R9). Written on
 * the "Got it" tap only — never on render — so a glanced-past
 * disclosure re-shows.
 */
export async function dismissAdaptDisclosure(): Promise<void> {
  await setStorageMeta(ADAPT_DISCLOSURE_DISMISSED_KEY, true)
}
