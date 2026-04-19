export { db } from './schema'
export type {
  DraftBlock,
  DrillVariantScore,
  ExecutionBlockStatus,
  ExecutionLog,
  ExecutionLogBlockStatus,
  ExecutionStatus,
  IncompleteReason,
  RpeCaptureWindow,
  SessionDraft,
  SessionPlan,
  SessionPlanBlock,
  SessionPlanSafetyCheck,
  SessionReview,
  SessionReviewStatus,
  SetupContext,
  StorageMetaEntry,
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
