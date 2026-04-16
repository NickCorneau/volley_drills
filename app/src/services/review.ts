import { db } from '../db/schema'
import type { ExecutionLog, SessionPlan, SessionReview } from '../db/types'

export interface SubmitReviewData {
  executionLogId: string
  sessionRpe: number
  goodPasses: number
  totalAttempts: number
  incompleteReason?: 'time' | 'fatigue' | 'pain' | 'other'
  quickTags?: string[]
  shortNote?: string
}

export async function submitReview(data: SubmitReviewData): Promise<void> {
  const reviewId = `review-${data.executionLogId}`
  const review: SessionReview = {
    id: reviewId,
    executionLogId: data.executionLogId,
    sessionRpe: data.sessionRpe,
    goodPasses: data.goodPasses,
    totalAttempts: data.totalAttempts,
    incompleteReason: data.incompleteReason,
    quickTags: data.quickTags,
    shortNote: data.shortNote,
    submittedAt: Date.now(),
  }
  await db.sessionReviews.put(review)
}

export interface SessionBundle {
  log: ExecutionLog
  plan: SessionPlan
  review: SessionReview
}

export async function loadSessionBundle(
  execId: string,
): Promise<SessionBundle | null> {
  const log = await db.executionLogs.get(execId)
  if (!log) return null
  const [plan, review] = await Promise.all([
    db.sessionPlans.get(log.planId),
    db.sessionReviews.where('executionLogId').equals(log.id).first(),
  ])
  if (!plan || !review) return null
  return { log, plan, review }
}
