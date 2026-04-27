/**
 * Pure state transitions over `ExecutionLog` / `SessionPlan`.
 *
 * No Dexie, no Date side effects except `Date.now()` for transition
 * timestamps (which callers can stub in tests via `vi.useFakeTimers`).
 * These used to live in `services/session.ts`; they're domain logic,
 * not persistence, so they belong here.
 */
import type { ExecutionLog, SessionPlan } from '../db/types'

export function buildStartedBlock(exec: ExecutionLog, plan: SessionPlan): ExecutionLog | null {
  const idx = exec.activeBlockIndex
  if (idx >= plan.blocks.length) return null
  if (exec.blockStatuses[idx]?.status === 'in_progress') return null

  const now = Date.now()
  const blockStatuses = [...exec.blockStatuses]
  blockStatuses[idx] = {
    ...blockStatuses[idx],
    status: 'in_progress',
    startedAt: now,
  }

  return {
    ...exec,
    status: 'in_progress',
    blockStatuses,
    startedAt: exec.startedAt || now,
    pausedAt: undefined,
  }
}

export function buildPausedExecution(exec: ExecutionLog): ExecutionLog {
  return { ...exec, status: 'paused', pausedAt: Date.now() }
}

export function buildResumedExecution(exec: ExecutionLog): ExecutionLog {
  return { ...exec, status: 'in_progress', pausedAt: undefined }
}

export function buildAdvancedBlock(
  exec: ExecutionLog,
  plan: SessionPlan,
  status: 'completed' | 'skipped',
): { execution: ExecutionLog; isLast: boolean } {
  const idx = exec.activeBlockIndex
  const now = Date.now()
  const blockStatuses = [...exec.blockStatuses]
  blockStatuses[idx] = { ...blockStatuses[idx], status, completedAt: now }

  const nextIdx = idx + 1
  const isLast = nextIdx >= plan.blocks.length

  return {
    execution: {
      ...exec,
      activeBlockIndex: nextIdx,
      blockStatuses,
      status: isLast ? 'completed' : exec.status === 'paused' ? 'in_progress' : exec.status,
      completedAt: isLast ? now : undefined,
      pausedAt: isLast ? exec.pausedAt : undefined,
    },
    isLast,
  }
}

export function buildEndedSession(exec: ExecutionLog, reason?: string): ExecutionLog {
  const now = Date.now()
  const blockStatuses = exec.blockStatuses.map((bs, i) => {
    if (i === exec.activeBlockIndex && bs.status === 'in_progress') {
      return { ...bs, status: 'skipped' as const, completedAt: now }
    }
    if (i >= exec.activeBlockIndex && bs.status === 'planned') {
      return { ...bs, status: 'skipped' as const }
    }
    return bs
  })
  return {
    ...exec,
    status: 'ended_early',
    blockStatuses,
    completedAt: now,
    endedEarlyReason: reason,
  }
}

/**
 * Derive the reported session length by summing completed blocks'
 * planned minutes and capping any partial active-block elapsed seconds
 * at that block's planned duration. Guards against non-finite or runaway
 * timer inputs.
 */
export function computeActualDurationMinutes(
  exec: ExecutionLog,
  plan: SessionPlan,
  currentBlockElapsedSeconds?: number,
): number {
  let totalSeconds = 0
  const len = Math.min(exec.blockStatuses.length, plan.blocks.length)
  for (let i = 0; i < len; i++) {
    if (exec.blockStatuses[i].status === 'completed') {
      totalSeconds += plan.blocks[i].durationMinutes * 60
    }
  }
  if (
    currentBlockElapsedSeconds !== undefined &&
    Number.isFinite(currentBlockElapsedSeconds) &&
    currentBlockElapsedSeconds > 0
  ) {
    const activeIdx = exec.activeBlockIndex
    const activePlannedSeconds =
      activeIdx >= 0 && activeIdx < plan.blocks.length
        ? plan.blocks[activeIdx].durationMinutes * 60
        : Infinity
    totalSeconds += Math.min(currentBlockElapsedSeconds, activePlannedSeconds)
  }
  return Math.round((totalSeconds / 60) * 10) / 10
}
