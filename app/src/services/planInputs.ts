/**
 * M002.1 — plan/receipt input loader (KTD10).
 *
 * The single Dexie read that feeds the pure thin-spine formatters
 * (`composePlan`, `composeReceipt`, `replayAdaptation`). Focus
 * attribution needs the `SessionPlan` blocks, which a `SessionReview`
 * doesn't carry — so this loader does the review -> executionLog ->
 * sessionPlan join and hands the domain layer:
 *
 *   - `reviews`: every review row (composeReceipt applies its own
 *     eligibility filter via the shared helper);
 *   - `attributedSessions`: eligible, focus-attributed, in-scope
 *     sessions for the staleness backlog / plan projection.
 *
 * Services-layer (Dexie IO) per the layer rules; the domain formatters
 * stay pure and consume the returned model arrays. The Home hook (FE)
 * calls this and passes the result into composePlan / composeReceipt.
 */
import { db } from '../db'
import type { AdaptationDelta, SessionReview } from '../db/types'
import {
  attributeTrainingSessions,
  type AttributedTrainingSession,
  type ReviewWithPlan,
} from '../domain/eligibleSessions'

export interface PlanInputsBundle {
  reviews: SessionReview[]
  attributedSessions: AttributedTrainingSession[]
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
  const planIdByExecutionId = new Map(executionLogs.map((log) => [log.id, log.planId]))

  const withPlan: ReviewWithPlan[] = reviews.map((review) => {
    const planId = planIdByExecutionId.get(review.executionLogId)
    const plan = planId ? planById.get(planId) : undefined
    return { review, planBlocks: plan?.blocks ?? [] }
  })

  return {
    reviews,
    attributedSessions: attributeTrainingSessions(withPlan),
    lastAcceptedDelta: resolveLastAcceptedDelta(reviews),
  }
}
