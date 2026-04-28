/**
 * Shared predicates and comparators over `ExecutionLog`.
 *
 * Extracted from the four Home-state queries in `services/session.ts` that
 * were duplicating the same filter + sort logic. Consolidating here keeps
 * the A8 "discarded-resume never counts as a real session" rule in one
 * place.
 */
import type { ExecutionLog } from '../model'

/**
 * A session is "terminal" when it has a finalized outcome (`completed` or
 * `ended_early`) AND it wasn't a tester-abandoned discard-resume stub.
 *
 * Used by every Home-state query (`findPendingReview`,
 * `expireStaleReviews`, `getLastComplete`, `getRecentSessions`).
 */
export function isTerminalSession(log: ExecutionLog): boolean {
  if (log.status !== 'completed' && log.status !== 'ended_early') return false
  if (log.endedEarlyReason === 'discarded_resume') return false
  return true
}

/**
 * Sort comparator: most-recently-ended first.
 *
 * Uses `completedAt` when present (terminal sessions always have it);
 * falls back to `startedAt` for malformed records so the sort is total.
 */
export function byRecentEndedAt(a: ExecutionLog, b: ExecutionLog): number {
  return (b.completedAt ?? b.startedAt) - (a.completedAt ?? a.startedAt)
}

/** Timestamp we treat as "when the session ended" for sorting / age math. */
export function endedAt(log: ExecutionLog): number {
  return log.completedAt ?? log.startedAt
}
