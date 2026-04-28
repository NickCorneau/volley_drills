import { db } from '../../db/schema'
import type { SessionReview } from '../../db/types'
import { endedAt } from '../../domain/executionPredicates'
import { clearSoftBlockDismissed } from '../softBlock'

export interface ExpireReviewData {
  executionLogId: string
  /** Override for tests; defaults to `Date.now()`. */
  now?: number
}

/**
 * Finalize a deferred review that has exceeded the 2-hour Finish Later cap.
 * Writes a terminal stub with `captureWindow = 'expired'`,
 * `eligibleForAdaptation = false`, and `status = 'skipped'` so the home-state
 * priority falls through to `LastComplete` and the adaptation engine never
 * consumes the record.
 *
 * Idempotency (A1): no-op when a TERMINAL review (`status` is `'submitted'`
 * or `'skipped'`) already exists.
 *
 * Draft payload preservation (red-team adversarial findings adv-1 / adv-2):
 * when the existing record is a `status: 'draft'`, the user's actual inputs
 * (RPE, note, metrics, incompleteReason, extra `quickTags`) are PRESERVED
 * onto the terminal stub. Blindly overwriting the draft with zeros would
 * silently destroy the tester's data - particularly pain signals and
 * RPE - and then present "No change" copy on CompleteScreen, which is
 * actively dishonest. The stub still gets `captureWindow: 'expired'` +
 * `eligibleForAdaptation: false` + `'expired'` appended to `quickTags` so
 * the adaptation engine correctly ignores it; V0B-15 export carries the
 * tester's original fields through.
 */
export async function expireReview(data: ExpireReviewData): Promise<void> {
  const exec = await db.executionLogs.get(data.executionLogId)
  const now = data.now ?? Date.now()
  const endAt = exec ? endedAt(exec) : now
  const captureDelaySeconds = Math.max(0, Math.round((now - endAt) / 1_000))

  // A3 + H17: intra-connection atomic read-decide-write. Terminal records
  // (`submitted` or `skipped`) are left untouched; a `draft` record is
  // overwritten by a terminal stub that preserves the draft's user inputs.
  // A7 cleanup lands in the same tx.
  await db.transaction('rw', db.sessionReviews, db.storageMeta, async (tx) => {
    const reviews = tx.table<SessionReview, string>('sessionReviews')
    const existing = await reviews.where('executionLogId').equals(data.executionLogId).first()
    if (existing && (existing.status === 'submitted' || existing.status === 'skipped')) {
      return
    }

    // Preserve draft payload when overwriting a draft; otherwise use
    // neutral zero defaults. In both cases the stub is marked expired.
    const draft = existing && existing.status === 'draft' ? existing : null
    const existingTags = draft?.quickTags ?? []
    const quickTags = existingTags.includes('expired') ? existingTags : [...existingTags, 'expired']

    const stub: SessionReview = {
      id: `review-${data.executionLogId}`,
      executionLogId: data.executionLogId,
      sessionRpe: draft?.sessionRpe ?? null,
      goodPasses: draft?.goodPasses ?? 0,
      totalAttempts: draft?.totalAttempts ?? 0,
      drillScores: draft?.drillScores,
      // D133: per-drill captures already collected on Drill Check before
      // the user dropped off survive into the expired stub for the same
      // adversarial-finding-adv-1/adv-2 reason as RPE / pain note. The
      // captures are honest signal at drill grain; nuking them on expire
      // would silently destroy data the tester explicitly tapped to log.
      perDrillCaptures: draft?.perDrillCaptures,
      borderlineCount: draft?.borderlineCount,
      incompleteReason: draft?.incompleteReason,
      quickTags,
      shortNote: draft?.shortNote ?? 'Review expired after Finish Later cap (2 h).',
      submittedAt: now,
      captureDelaySeconds,
      captureWindow: 'expired',
      eligibleForAdaptation: false,
      status: 'skipped',
    }
    await reviews.put(stub)
    await clearSoftBlockDismissed(data.executionLogId, tx)
  })
}
