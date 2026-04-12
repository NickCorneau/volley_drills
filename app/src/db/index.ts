export { db } from './schema';
export type {
  ExecutionBlockStatus,
  ExecutionLog,
  ExecutionLogBlockStatus,
  ExecutionStatus,
  IncompleteReason,
  SessionPlan,
  SessionPlanBlock,
  SessionPlanSafetyCheck,
  SessionReview,
  TimerRunStatus,
  TimerState,
} from './types';
export {
  clearTimerState,
  flushTimerState,
  readTimerState,
} from './timerLedger';

export async function requestPersistentStorage(): Promise<boolean> {
  if (typeof navigator === 'undefined' || !navigator.storage?.persist) {
    return false;
  }
  try {
    return await navigator.storage.persist();
  } catch {
    return false;
  }
}
