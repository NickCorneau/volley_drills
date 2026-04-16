export { db } from './schema'
export type {
  DraftBlock,
  ExecutionBlockStatus,
  ExecutionLog,
  ExecutionLogBlockStatus,
  ExecutionStatus,
  IncompleteReason,
  SessionDraft,
  SessionPlan,
  SessionPlanBlock,
  SessionPlanSafetyCheck,
  SessionReview,
  SetupContext,
  TimerRunStatus,
  TimerState,
} from './types'

export async function requestPersistentStorage(): Promise<boolean> {
  if (typeof navigator === 'undefined' || !navigator.storage?.persist) {
    return false
  }
  try {
    return await navigator.storage.persist()
  } catch {
    return false
  }
}
