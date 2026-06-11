/**
 * Pure state transitions over `ExecutionLog` / `SessionPlan`.
 *
 * No Dexie, no Date side effects except `Date.now()` for transition
 * timestamps (which callers can stub in tests via `vi.useFakeTimers`).
 * These used to live in `services/session.ts`; they're domain logic,
 * not persistence, so they belong here.
 */
import type { ExecutionLog, SessionPlan, TimerState } from '../model'

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
  // ADV-1 guard (red-team, 2026-06-11): advancing past the end of the
  // plan must be a no-op. Without this, `blockStatuses[idx]` spreads
  // past the array end and writes a `{ status, completedAt }` row with
  // no blockId, which persists into the ExecutionLog and flows into
  // exports. Reachable via a double advance on the final block.
  if (idx >= plan.blocks.length) {
    return { execution: exec, isLast: true }
  }
  const now = Date.now()
  const blockStatuses = [...exec.blockStatuses]
  blockStatuses[idx] = { ...blockStatuses[idx], status, completedAt: now }

  const nextIdx = idx + 1
  const isLast = nextIdx >= plan.blocks.length
  // Zero-work rule: a terminal session with no completed block is a
  // cut-short, whatever path produced it. Skipping every block one at a
  // time must not record a "Done" session that steers focus staleness.
  const anyCompleted = blockStatuses.some((bs) => bs.status === 'completed')
  const terminalStatus = anyCompleted ? 'completed' : 'ended_early'

  return {
    execution: {
      ...exec,
      activeBlockIndex: nextIdx,
      blockStatuses,
      status: isLast ? terminalStatus : exec.status === 'paused' ? 'in_progress' : exec.status,
      completedAt: isLast ? now : undefined,
      pausedAt: isLast ? exec.pausedAt : undefined,
    },
    isLast,
  }
}

/** Skip the active in-progress block (stamping completedAt) and every remaining planned block. */
function skipRemainingBlocks(exec: ExecutionLog, now: number) {
  return exec.blockStatuses.map((bs, i) => {
    if (i === exec.activeBlockIndex && bs.status === 'in_progress') {
      return { ...bs, status: 'skipped' as const, completedAt: now }
    }
    if (i >= exec.activeBlockIndex && bs.status === 'planned') {
      return { ...bs, status: 'skipped' as const }
    }
    return bs
  })
}

export function buildEndedSession(exec: ExecutionLog, reason?: string): ExecutionLog {
  const now = Date.now()
  return {
    ...exec,
    status: 'ended_early',
    blockStatuses: skipRemainingBlocks(exec, now),
    completedAt: now,
    endedEarlyReason: reason,
  }
}

/**
 * Deliberate wrap: the user is done, not abandoning. Remaining blocks are
 * skipped (visible tail) and the session records `completed` — the
 * courtside-equivalent of skip-wrapping the tail one block at a time, so
 * both paths converge on the same record. With zero completed blocks
 * there is nothing to be done WITH, so the wrap derives `ended_early`
 * (cut-short) instead; the Review reason gate fires as usual.
 */
export function buildWrappedSession(exec: ExecutionLog): ExecutionLog {
  const now = Date.now()
  const blockStatuses = skipRemainingBlocks(exec, now)
  const anyCompleted = blockStatuses.some((bs) => bs.status === 'completed')
  return {
    ...exec,
    status: anyCompleted ? 'completed' : 'ended_early',
    blockStatuses,
    completedAt: now,
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

export function withActualDuration(
  exec: ExecutionLog,
  plan: SessionPlan,
  timer: TimerState | null | undefined,
  timerBlockIndex = exec.activeBlockIndex,
): ExecutionLog {
  const timerOwnsFinalizedBlock =
    timer?.executionLogId === exec.id && timer.blockIndex === timerBlockIndex
  const plannedSeconds =
    timerOwnsFinalizedBlock && timer.blockIndex >= 0 && timer.blockIndex < plan.blocks.length
      ? plan.blocks[timer.blockIndex].durationMinutes * 60
      : undefined
  const partialSeconds =
    timerOwnsFinalizedBlock && plannedSeconds !== undefined
      ? Math.min(timer.accumulatedElapsed, plannedSeconds)
      : undefined
  return {
    ...exec,
    actualDurationMinutes: computeActualDurationMinutes(exec, plan, partialSeconds),
  }
}
