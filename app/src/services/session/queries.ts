/**
 * Read-side session queries (Home-state resolution, session load,
 * draft fetch, context lookup). No mutations; all writes live in
 * `commands.ts`.
 */
import { db } from '../../db'
import type {
  ExecutionLog,
  SessionDraft,
  SessionPlan,
  SessionReview,
} from '../../db'
import {
  byRecentEndedAt,
  endedAt,
  isTerminalSession,
} from '../../domain/executionPredicates'
import { FINISH_LATER_CAP_MS } from '../../domain/policies'
import { buildEndedSession } from '../../domain/executionState'
import { clearTimerState, readTimerState } from '../timer'

export interface ResumableSession {
  execution: ExecutionLog
  plan: SessionPlan
  interruptedAt: number
}

export async function findResumableSession(): Promise<ResumableSession | null> {
  const logs = await db.executionLogs.toArray()
  const resumable = logs
    .filter(
      (l) =>
        l.status === 'not_started' ||
        l.status === 'in_progress' ||
        l.status === 'paused',
    )
    .sort((a, b) => b.startedAt - a.startedAt)
  const exec = resumable[0]
  if (!exec) return null

  const plan = await db.sessionPlans.get(exec.planId)
  if (!plan) {
    // Orphaned resumable: plan row is missing. Finalise the log as
    // ended_early so it never comes back as resumable on next Home.
    await db.executionLogs.put(buildEndedSession(exec, 'missing_plan'))
    await clearTimerState()
    return null
  }

  if (exec.activeBlockIndex >= plan.blocks.length) {
    await db.executionLogs.put(buildEndedSession(exec, 'resume_out_of_bounds'))
    return null
  }

  const timer = await readTimerState()
  const interruptedAt =
    exec.pausedAt ??
    (timer?.executionLogId === exec.id ? timer.lastFlushedAt : undefined) ??
    exec.startedAt

  return { execution: exec, plan, interruptedAt }
}

export async function loadSession(
  execId: string,
): Promise<{ execution: ExecutionLog; plan: SessionPlan | null } | null> {
  const execution = await db.executionLogs.get(execId)
  if (!execution) return null
  const plan = (await db.sessionPlans.get(execution.planId)) ?? null
  return { execution, plan }
}

export interface PendingReview {
  executionId: string
  planName: string
  completedAt: number
  /** ms remaining inside the 2 h Finish Later cap. Always > 0 here. */
  deferralRemainingMs: number
}

/**
 * Newest terminal session that has no finalized review and is still
 * inside the 2 h Finish Later cap. Sessions past the cap are NOT
 * returned; call `expireStaleReviews()` first to auto-finalize them.
 */
export async function findPendingReview(
  now: number = Date.now(),
): Promise<PendingReview | null> {
  const logs = await db.executionLogs.toArray()
  const terminal = logs.filter(isTerminalSession)

  // A1: only TERMINAL reviews shadow the pending state. A draft does not.
  const reviewedIds = new Set(
    (await db.sessionReviews.toArray())
      .filter((r) => r.status !== 'draft')
      .map((r) => r.executionLogId),
  )

  const unreviewed = terminal
    .filter((l) => !reviewedIds.has(l.id))
    .sort(byRecentEndedAt)

  for (const exec of unreviewed) {
    const endAt = endedAt(exec)
    const elapsed = now - endAt
    if (elapsed >= FINISH_LATER_CAP_MS) continue
    const plan = await db.sessionPlans.get(exec.planId)
    return {
      executionId: exec.id,
      planName: plan?.presetName ?? 'Session',
      completedAt: endAt,
      deferralRemainingMs: Math.max(0, FINISH_LATER_CAP_MS - elapsed),
    }
  }
  return null
}

export interface LastCompleteBundle {
  log: ExecutionLog
  plan: SessionPlan
  review: SessionReview
}

/**
 * Newest terminal, non-discarded-resume session whose review has been
 * finalized (`submitted` or `skipped`). Feeds the Home LastComplete card.
 */
export async function getLastComplete(): Promise<LastCompleteBundle | null> {
  const [logs, reviews] = await Promise.all([
    db.executionLogs.toArray(),
    db.sessionReviews.toArray(),
  ])
  const finalizedReviewByExec = new Map<string, SessionReview>()
  for (const r of reviews) {
    if (r.status !== 'submitted' && r.status !== 'skipped') continue
    finalizedReviewByExec.set(r.executionLogId, r)
  }

  const candidates = logs.filter(
    (l) => isTerminalSession(l) && finalizedReviewByExec.has(l.id),
  )
  if (candidates.length === 0) return null

  candidates.sort(byRecentEndedAt)
  const log = candidates[0]
  const review = finalizedReviewByExec.get(log.id)!
  const plan = await db.sessionPlans.get(log.planId)
  if (!plan) return null
  return { log, plan, review }
}

/**
 * One row in the Home last-3-sessions list.
 */
export interface RecentSessionEntry {
  execId: string
  endedAt: number
  plan: SessionPlan
  completed: boolean
}

/**
 * The N most-recent terminal sessions, joined with their originating
 * plans, reverse chronological. Excludes discarded-resume stubs (A8).
 * Does NOT require a finalized review — history shows what happened,
 * not what's actionable.
 */
export async function getRecentSessions(
  limit: number = 3,
): Promise<RecentSessionEntry[]> {
  if (limit <= 0) return []
  const logs = await db.executionLogs.toArray()
  const terminal = logs.filter(isTerminalSession).sort(byRecentEndedAt)

  const entries: RecentSessionEntry[] = []
  for (const exec of terminal) {
    if (entries.length >= limit) break
    const plan = await db.sessionPlans.get(exec.planId)
    if (!plan) continue
    entries.push({
      execId: exec.id,
      endedAt: endedAt(exec),
      plan,
      completed: exec.status === 'completed',
    })
  }
  return entries
}

/**
 * Has the tester ever created an ExecutionLog? Gates the "First time"
 * recency chip on SafetyCheck. Short-circuits on count rather than
 * scanning every row.
 */
export async function hasEverStartedSession(): Promise<boolean> {
  return (await db.executionLogs.count()) > 0
}

export async function getCurrentDraft(): Promise<SessionDraft | null> {
  return (await db.sessionDrafts.get('current')) ?? null
}

export async function getLastContext(): Promise<SessionPlan['context'] | null> {
  const plans = await db.sessionPlans.toArray()
  if (plans.length === 0) return null
  plans.sort((a, b) => b.createdAt - a.createdAt)
  return plans.find((plan) => plan.context != null)?.context ?? null
}
