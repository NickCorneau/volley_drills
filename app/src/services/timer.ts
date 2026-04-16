import { db } from '../db'
import type { ExecutionLog, TimerState } from '../db'

const ACTIVE_ID = 'active' as const

export async function flushTimerForBlock(
  exec: ExecutionLog,
  accumulatedElapsed: number,
  effectiveDurationSeconds?: number,
  status?: 'running' | 'paused',
): Promise<void> {
  const blockStart =
    exec.blockStatuses[exec.activeBlockIndex]?.startedAt ?? Date.now()
  const state: TimerState = {
    id: ACTIVE_ID,
    executionLogId: exec.id,
    blockIndex: exec.activeBlockIndex,
    startedAt: blockStart,
    accumulatedElapsed,
    effectiveDurationSeconds,
    status: status ?? (exec.status === 'paused' ? 'paused' : 'running'),
    lastFlushedAt: Date.now(),
  }
  await db.timerState.put(state)
}

export async function recoverTimer(
  execId: string,
  blockIndex: number,
  blockDurationSeconds: number,
): Promise<{ remaining: number; effectiveDurationSeconds: number } | null> {
  const saved = await readTimerState()
  if (
    saved &&
    saved.executionLogId === execId &&
    saved.blockIndex === blockIndex
  ) {
    const duration = saved.effectiveDurationSeconds ?? blockDurationSeconds
    return {
      remaining: Math.max(0, duration - saved.accumulatedElapsed),
      effectiveDurationSeconds: duration,
    }
  }
  return null
}

export async function readTimerState(): Promise<TimerState | undefined> {
  return db.timerState.get(ACTIVE_ID)
}

export async function clearTimerState(): Promise<void> {
  await db.timerState.delete(ACTIVE_ID)
}
