import { db } from '../../db/schema'
import type {
  DrillVariantScore,
  IncompleteReason,
  PerDrillCapture,
  SessionReview,
} from '../../db/types'
import { classifyCaptureWindow, isEligibleForAdaptation } from '../../domain/capture'
import { endedAt } from '../../domain/executionPredicates'
import { clearSoftBlockDismissed } from '../softBlock'

export interface SubmitReviewData {
  executionLogId: string
  sessionRpe: number
  goodPasses: number
  totalAttempts: number
  drillScores?: DrillVariantScore[]
  /**
   * D133 (2026-04-26): per-drill captures collected on the Drill Check
   * screen after completed blocks. When present and non-empty, ReviewScreen and
   * CompleteScreen prefer this list over the session-level Good/Total
   * fields. See `docs/specs/m001-review-micro-spec.md` §"Per-drill
   * capture at Drill Check (D133)".
   */
  perDrillCaptures?: PerDrillCapture[]
  /** Optional pass-through for D104 / V0B-29; v0b does not prompt for this. */
  borderlineCount?: number
  incompleteReason?: IncompleteReason
  quickTags?: string[]
  shortNote?: string
  /**
   * Override the capture timestamp. Defaults to `Date.now()`. Useful for
   * tests that need to assert on specific `captureWindow` bucketing; not
   * exposed through the UI.
   */
  capturedAt?: number
}

/**
 * Result of a `submitReview` call (A3 matrix).
 *
 * - `{ status: 'ok' }` - review persisted (existing was absent or a
 *   `status: 'draft'`).
 * - `{ status: 'refused'; existingStatus }` - a terminal review already
 *   exists for this execution. `existingStatus` distinguishes the two
 *   cases so the ReviewScreen H19 surface can render honest copy: a
 *   session that was "already reviewed" (`'submitted'`) vs one that was
 *   "already skipped" (`'skipped'`). Blurring them produces the
 *   adversarial finding adv-3 dishonest UX where a tester retries after
 *   a Home-skip and sees "already reviewed - showing what we saved."
 */
export type SubmitReviewResult =
  | { status: 'ok' }
  | { status: 'refused'; existingStatus: 'submitted' | 'skipped' }

export async function submitReview(data: SubmitReviewData): Promise<SubmitReviewResult> {
  const exec = await db.executionLogs.get(data.executionLogId)
  const now = data.capturedAt ?? Date.now()
  const endAt = exec ? endedAt(exec) : now
  const captureDelaySeconds = Math.max(0, Math.round((now - endAt) / 1_000))
  const captureWindow = classifyCaptureWindow(captureDelaySeconds)

  const reviewId = `review-${data.executionLogId}`
  const review: SessionReview = {
    id: reviewId,
    executionLogId: data.executionLogId,
    sessionRpe: data.sessionRpe,
    goodPasses: data.goodPasses,
    totalAttempts: data.totalAttempts,
    drillScores: data.drillScores,
    perDrillCaptures:
      data.perDrillCaptures && data.perDrillCaptures.length > 0 ? data.perDrillCaptures : undefined,
    borderlineCount: data.borderlineCount,
    incompleteReason: data.incompleteReason,
    quickTags: data.quickTags,
    shortNote: data.shortNote,
    submittedAt: now,
    capturedAt: now,
    captureDelaySeconds,
    captureWindow,
    eligibleForAdaptation: isEligibleForAdaptation(captureWindow),
    status: 'submitted',
  }

  // A3 + H17: intra-connection atomic read-decide-write. A7 cleanup
  // (`clearSoftBlockDismissed`) lands in the same transaction so
  // `storageMeta` stays bounded.
  return db.transaction('rw', db.sessionReviews, db.storageMeta, async (tx) => {
    const reviews = tx.table<SessionReview, string>('sessionReviews')
    const existing = await reviews.where('executionLogId').equals(data.executionLogId).first()
    if (existing && (existing.status === 'submitted' || existing.status === 'skipped')) {
      return { status: 'refused', existingStatus: existing.status } as const
    }
    await reviews.put(review)
    await clearSoftBlockDismissed(data.executionLogId, tx)
    return { status: 'ok' } as const
  })
}
