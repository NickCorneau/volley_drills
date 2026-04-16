import Dexie, { type Table } from 'dexie'
import { emitSchemaBlocked } from '../lib/schema-blocked'
import type {
  ExecutionLog,
  SessionDraft,
  SessionPlan,
  SessionReview,
  TimerState,
} from './types'

export class VolleyDrillsDB extends Dexie {
  sessionPlans!: Table<SessionPlan, string>
  executionLogs!: Table<ExecutionLog, string>
  sessionReviews!: Table<SessionReview, string>
  timerState!: Table<TimerState, string>
  sessionDrafts!: Table<SessionDraft, string>

  constructor() {
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
  }
}

export const db = new VolleyDrillsDB()

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
