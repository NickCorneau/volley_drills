export { db } from './schema'
export type {
  DifficultyTag,
  DraftBlock,
  DrillVariantScore,
  ExecutionBlockStatus,
  ExecutionLog,
  ExecutionLogBlockStatus,
  ExecutionStatus,
  IncompleteReason,
  PerDrillCapture,
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
