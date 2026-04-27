import Dexie, { type Table } from 'dexie'
import { emitSchemaBlocked } from '../lib/schema-blocked'
import {
  backfillOnboardingCompletedAt,
  backfillSessionReviewStatus,
} from './migrations/backfills'
import type {
  ExecutionLog,
  SessionDraft,
  SessionPlan,
  SessionReview,
  StorageMetaEntry,
  TimerState,
} from './types'

export class VolleycraftDB extends Dexie {
  sessionPlans!: Table<SessionPlan, string>
  executionLogs!: Table<ExecutionLog, string>
  sessionReviews!: Table<SessionReview, string>
  timerState!: Table<TimerState, string>
  sessionDrafts!: Table<SessionDraft, string>
  storageMeta!: Table<StorageMetaEntry, string>

  constructor() {
    // NOTE: the IndexedDB database name `volley-drills` is intentionally
    // preserved across the Volley Drills -> Volleycraft rename (D125). The
    // TS class identifier was renamed, but changing the super() argument
    // would orphan all existing D91-tester session data, which is higher
    // cost than a mildly-stale internal string literal. If the product
    // ever ships a data migration we can revisit; until then, this
    // string is a historical identifier, not a brand surface.
    super('volley-drills')

    this.version(1).stores({
      sessionPlans: 'id',
      executionLogs: 'id, planId',
      sessionReviews: 'id, executionLogId',
      timerState: 'id',
    })

    this.version(2)
      .stores({
        sessionPlans: 'id',
        executionLogs: 'id, planId',
        sessionReviews: 'id, executionLogId',
        timerState: 'id',
      })
      .upgrade(() => {})

    this.version(3)
      .stores({
        sessionPlans: 'id',
        executionLogs: 'id, planId, status',
        sessionReviews: 'id, executionLogId',
        timerState: 'id',
        sessionDrafts: 'id',
      })
      .upgrade(() => {
        // v3 adds sessionDrafts table and status index on executionLogs.
        // No data transforms needed: drafts didn't exist before, and the
        // new index on executionLogs.status is built automatically by Dexie.
      })

    // Phase C-0 (D-C7 / A5 / H15): adds storageMeta key-value table,
    // backfills SessionReview.status from legacy sessionRpe, and backfills
    // storageMeta.onboarding.completedAt for existing testers so they are
    // not force-routed through C-3 onboarding if deployment sequencing slips.
    this.version(4)
      .stores({
        sessionPlans: 'id',
        executionLogs: 'id, planId, status',
        sessionReviews: 'id, executionLogId',
        timerState: 'id',
        sessionDrafts: 'id',
        storageMeta: 'key',
      })
      .upgrade(async (tx) => {
        await backfillSessionReviewStatus(tx)
        await backfillOnboardingCompletedAt(tx)
      })

    // Tier 1b D133 (2026-04-26): adds `SessionReview.perDrillCaptures`,
    // captured on the Transition screen between blocks. Forward-only,
    // no data transform — `perDrillCaptures` is optional on the type and
    // every legacy v4 record reads cleanly as "no per-drill data" (the
    // ReviewScreen/CompleteScreen aggregation paths fall back to the
    // session-level Good/Total fields). The version bump exists so
    // Dexie's open() opens at v5 in v0b deployments and so that any
    // future v6 migration that wants to derive defaults from this
    // version's records has a labelled boundary to read from. See
    // `docs/plans/2026-04-26-pair-rep-capture-tier1b.md`.
    this.version(5)
      .stores({
        sessionPlans: 'id',
        executionLogs: 'id, planId, status',
        sessionReviews: 'id, executionLogId',
        timerState: 'id',
        sessionDrafts: 'id',
        storageMeta: 'key',
      })
      .upgrade(() => {})
  }
}

export const db = new VolleycraftDB()

// D41 / V0B-22: handle cross-tab schema upgrade hazards.
// `versionchange` fires on the OLD connection when ANOTHER tab tries to open a
// higher schema version. Close our connection and prompt the user to reload so
// the new-version tab can proceed.
db.on('versionchange', () => {
  db.close()
  emitSchemaBlocked()
})

// `blocked` fires on the NEW-version tab when another tab is holding the old
// version open and prevents the upgrade. Same user-facing prompt.
db.on('blocked', () => {
  emitSchemaBlocked()
})
