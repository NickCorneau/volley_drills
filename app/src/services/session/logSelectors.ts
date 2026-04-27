import { db } from '../../db'
import type { ExecutionLog, ExecutionStatus } from '../../db'

const RESUMABLE_STATUSES: ExecutionStatus[] = ['not_started', 'in_progress', 'paused']
const TERMINAL_STATUSES: ExecutionStatus[] = ['completed', 'ended_early']

export function getResumableExecutionLogs(): Promise<ExecutionLog[]> {
  return db.executionLogs.where('status').anyOf(RESUMABLE_STATUSES).toArray()
}

export function getTerminalExecutionLogs(): Promise<ExecutionLog[]> {
  return db.executionLogs.where('status').anyOf(TERMINAL_STATUSES).toArray()
}
