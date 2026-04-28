/**
 * Active-session timer state — the singleton row that backs the run
 * clock and survives a foreground / background cycle. Persistence-
 * internal (only ever a single row with `id: 'active'`).
 */
export type TimerRunStatus = 'running' | 'paused'

export interface TimerState {
  id: 'active'
  executionLogId: string
  blockIndex: number
  startedAt: number
  accumulatedElapsed: number
  effectiveDurationSeconds?: number
  status: TimerRunStatus
  lastFlushedAt: number
}
