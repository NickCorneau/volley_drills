/**
 * Persistence row types — the shapes Dexie tables read and write.
 *
 * U4 of the architecture pass demoted this module to a persistence
 * adapter. The product types live in `app/src/model/`; the rows
 * Dexie operates on are identical to those product types today, but
 * if a row ever needs persistence-only fields (audit trace, schema
 * sentinels, soft-delete columns), the extended interface lives here
 * — not in `model/`.
 *
 * Layer rule: domain modules MUST NOT import from this file. They
 * import from `app/src/model/` instead. CI grep over
 * `app/src/domain/*` for `from '.*db'` should return zero hits.
 */
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
  StorageMetaEntry,
  TimerRunStatus,
  TimerState,
} from '../model'

// `SetupContext` is re-exported here for legacy import paths under
// `app/src/db/`. Canonical home is `app/src/types/session.ts`; new
// code should prefer importing it from `model/` or `types/session`.
export type { SetupContext } from '../types/session'
