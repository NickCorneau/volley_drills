import { db } from '../../db/schema'
import type { ExecutionLog, SessionPlan, SessionReview } from '../../db/types'
import { applyBlockOverrides } from '../../domain/sessionProjection'

export interface SessionBundle {
  log: ExecutionLog
  plan: SessionPlan
  review: SessionReview
}

/**
 * Load the {execution log, plan, review} triple used by the Complete
 * surface and any future export / coach-payload adapter. Block overrides
 * (swaps recorded on the execution log) are projected onto the plan
 * before return so consumers see the as-actually-run shape.
 *
 * Returns `null` when any of the three records is missing — bundle
 * loading is read-only and should never partially populate the consumer.
 */
export async function loadSessionBundle(execId: string): Promise<SessionBundle | null> {
  const log = await db.executionLogs.get(execId)
  if (!log) return null
  const [plan, review] = await Promise.all([
    db.sessionPlans.get(log.planId),
    db.sessionReviews.where('executionLogId').equals(log.id).first(),
  ])
  if (!plan || !review) return null
  return { log, plan: applyBlockOverrides(plan, log), review }
}
