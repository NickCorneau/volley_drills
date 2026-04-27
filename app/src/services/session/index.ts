/**
 * Public surface of the session service.
 *
 * Split into `queries.ts` (reads), `commands.ts` (writes), plus pure
 * state transitions in `domain/executionState.ts`. This barrel preserves
 * the pre-split import path (`from '../services/session'`) so no call
 * site had to change during the refactor.
 */
export type {
  LastCompleteBundle,
  PendingReview,
  RecentSessionEntry,
  ResumableSession,
} from './queries'
export {
  findLastCompletedDrillIdsByType,
  findPendingReview,
  findResumableSession,
  getCurrentDraft,
  getLastComplete,
  getLastContext,
  getRecentSessions,
  hasEverStartedSession,
  loadSession,
} from './queries'

export type { CreateSessionFromDraftParams } from './commands'
export {
  clearDraft,
  createSessionFromDraft,
  discardSession,
  expireStaleReviews,
  saveDraft,
  saveExecution,
  skipReview,
  swapActiveBlock,
} from './commands'

// Pure state transitions, re-exported so existing call sites
// (`useSessionRunner`, session tests) don't have to change.
export {
  buildAdvancedBlock,
  buildEndedSession,
  buildPausedExecution,
  buildResumedExecution,
  buildStartedBlock,
  computeActualDurationMinutes,
} from '../../domain/executionState'
