/**
 * M002.1 / Home-coherence — plan/receipt input loader.
 *
 * The single Dexie read that feeds the pure thin-spine formatters
 * (`composePlan`, `composeReceipt`, `replayAdaptation`). It hands the
 * domain layer two deliberately-separate bases:
 *
 *   - `reviews`: every review row (composeReceipt + carry-forward apply
 *     their own eligibility filter via the shared helper);
 *   - `trainedSessions`: every TERMINAL session the user ran (completed
 *     or ended-early, minus discarded-resume stubs), focus-attributed
 *     from its plan's `main_skill` block. This is the plan-ordering basis
 *     and the SAME basis the Home "Recent sessions" list reads, so the
 *     plan's next-focus can never disagree with the visible history.
 *
 * Focus attribution needs the `SessionPlan` blocks (an `ExecutionLog`
 * carries no focus), so this loader does the executionLog -> sessionPlan
 * join with block overrides applied. Services-layer (Dexie IO) per the
 * layer rules; the domain formatters stay pure and consume the returned
 * model arrays.
 */
import { db } from '../db'
import type { AdaptationDelta, SessionReview } from '../db/types'
import {
  attributeTrainedSessions,
  type AttributedTrainingSession,
  type TerminalSessionWithPlan,
} from '../domain/eligibleSessions'
import { endedAt, hasCompletedBlock, isTerminalSession } from '../domain/executionPredicates'
import { applyBlockOverrides } from '../domain/sessionProjection'

export interface PlanInputsBundle {
  reviews: SessionReview[]
  trainedSessions: AttributedTrainingSession[]
  /**
   * The offered delta from the user's MOST RECENT verdict, returned only
   * when that latest verdict was `accepted`. This is the carry-forward
   * Home reflects ("what you chose last time"). `null` when the latest
   * verdict was kept-original or none exists — a later kept-original
   * supersedes an earlier accepted delta, so a declined adjustment never
   * keeps showing. Reading the persisted choice keeps Home decoupled from
   * the fresh-offer computation (which lives at review time).
   */
  lastAcceptedDelta: AdaptationDelta | null
}

function resolveLastAcceptedDelta(reviews: readonly SessionReview[]): AdaptationDelta | null {
  // Honor the LATEST verdict: find the most recent review that recorded a
  // verdict at all, and surface its delta only if it was accepted. This
  // ensures a newer kept-original supersedes an older accepted delta
  // (Complete and the next Home read stay coherent).
  const latestWithVerdict = reviews
    .filter((r) => r.status === 'submitted' && r.verdictChoice && r.offeredDelta)
    .sort((a, b) => b.submittedAt - a.submittedAt)[0]
  return latestWithVerdict?.verdictChoice === 'accepted'
    ? (latestWithVerdict.offeredDelta ?? null)
    : null
}

export async function loadPlanInputs(): Promise<PlanInputsBundle> {
  const [reviews, executionLogs, sessionPlans] = await Promise.all([
    db.sessionReviews.toArray(),
    db.executionLogs.toArray(),
    db.sessionPlans.toArray(),
  ])

  const planById = new Map(sessionPlans.map((plan) => [plan.id, plan]))

  // Plan-ordering basis: every terminal session the user ran, joined to
  // its plan with block overrides applied (so a mid-session swap is
  // attributed to the focus actually trained — the same projection the
  // Recent-sessions list uses). Sessions whose plan row is missing are
  // skipped; they can't be focus-attributed.
  const terminalSessions: TerminalSessionWithPlan[] = []
  for (const log of executionLogs) {
    if (!isTerminalSession(log)) continue
    const plan = planById.get(log.planId)
    if (!plan) continue
    terminalSessions.push({
      endedAt: endedAt(log),
      planBlocks: applyBlockOverrides(plan, log).blocks,
      hasCompletedBlock: hasCompletedBlock(log),
    })
  }

  return {
    reviews,
    trainedSessions: attributeTrainedSessions(terminalSessions),
    lastAcceptedDelta: resolveLastAcceptedDelta(reviews),
  }
}
