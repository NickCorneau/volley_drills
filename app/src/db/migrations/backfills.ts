import type { Transaction } from 'dexie'
import type { ExecutionLog, SessionReview, StorageMetaEntry } from '../types'

/**
 * v4 backfill for `SessionReview.status` (D-C7 / A5).
 *
 * Runs inside the Dexie v4 upgrade transaction (`db.version(4).upgrade(tx =>
 * backfillSessionReviewStatus(tx))`) and is also invocable directly from
 * tests against seeded v3 records.
 *
 * Classification rule (C-0 Key Decision #2): a valid `sessionRpe` is a
 * non-NaN number `>= 0`. Anything else - `null`, the legacy v0a sentinel
 * `-1`, or a hand-edited garbage value - maps to `'skipped'`.
 *
 * The `if (r.status) return` guard is defense-in-depth for the edge case of
 * records that somehow already carry `status` because a forward-writer wrote
 * them on a v3 schema. In normal operation Dexie upgrades run exactly once
 * per version transition and this guard is otherwise a no-op.
 */
export async function backfillSessionReviewStatus(tx: Transaction): Promise<void> {
  const reviews = tx.table<SessionReview, string>('sessionReviews')
  await reviews.toCollection().modify((r) => {
    if (r.status) return
    const rpe = r.sessionRpe
    if (typeof rpe === 'number' && !Number.isNaN(rpe) && rpe >= 0) {
      r.status = 'submitted'
    } else {
      r.status = 'skipped'
    }
  })
}

/**
 * v4 backfill for `storageMeta.onboarding.completedAt` (H15
 * defense-in-depth).
 *
 * If any `ExecutionLog` exists AND the key is absent, write
 * `{ onboarding.completedAt: Date.now() }`. Prevents existing testers with
 * v3 data from being force-routed through the C-3 onboarding flow if the
 * deployment posture slips and C-0 ships to a device ahead of C-3.
 *
 * Idempotent: the `existing` guard bails out when the key is already set.
 */
export async function backfillOnboardingCompletedAt(tx: Transaction): Promise<void> {
  const meta = tx.table<StorageMetaEntry, string>('storageMeta')
  const execs = tx.table<ExecutionLog, string>('executionLogs')
  const existing = await meta.get('onboarding.completedAt')
  if (existing) return
  const execCount = await execs.count()
  if (execCount === 0) return
  const now = Date.now()
  await meta.put({
    key: 'onboarding.completedAt',
    value: now,
    updatedAt: now,
  })
}
