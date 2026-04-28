import { db } from '../../db/schema'
import type {
  DrillVariantScore,
  IncompleteReason,
  PerDrillCapture,
  SessionReview,
} from '../../db/types'

export interface DraftReviewData {
  executionLogId: string
  sessionRpe: number | null
  goodPasses: number
  totalAttempts: number
  drillScores?: DrillVariantScore[]
  /**
   * D133 (2026-04-26): per-drill captures collected on Drill Check
   * (`/run/check`) between blocks. Persisted incrementally so
   * that a Finish Later / browser crash mid-session does not lose the
   * tag the user already tapped.
   */
  perDrillCaptures?: PerDrillCapture[]
  borderlineCount?: number
  incompleteReason?: IncompleteReason
  quickTags?: string[]
  shortNote?: string
}

/**
 * Field-merging patch for an in-progress review draft (U1 of the
 * architecture pass). Only keys present on `patch` are written; absent
 * keys preserve their prior value. This stops Drill Check writes
 * (`{ perDrillCaptures }`) from clobbering RPE / note fields the tester
 * typed on Review, and vice versa.
 *
 * Empty-array semantics: `perDrillCaptures: []` clears the captures
 * field on the row (mirrors the terminal writer's "drop empty array
 * off the wire" rule) so a Drill Check explicit reset still works.
 *
 * Terminal protection: a pre-existing `status: 'submitted'` or
 * `'skipped'` record is never overwritten, matching the H19 / A1
 * invariants the legacy writer enforced.
 */
export type ReviewDraftPatch = Partial<{
  sessionRpe: number | null
  goodPasses: number
  totalAttempts: number
  drillScores: DrillVariantScore[] | undefined
  perDrillCaptures: PerDrillCapture[] | undefined
  borderlineCount: number | undefined
  incompleteReason: IncompleteReason | undefined
  quickTags: string[] | undefined
  shortNote: string | undefined
}>

export async function patchReviewDraft(
  executionLogId: string,
  patch: ReviewDraftPatch,
): Promise<void> {
  await db.transaction('rw', db.sessionReviews, async (tx) => {
    const reviews = tx.table<SessionReview, string>('sessionReviews')
    const existing = await reviews.where('executionLogId').equals(executionLogId).first()
    if (existing && (existing.status === 'submitted' || existing.status === 'skipped')) {
      return
    }

    const base: SessionReview = existing ?? {
      id: `review-${executionLogId}`,
      executionLogId,
      sessionRpe: null,
      goodPasses: 0,
      totalAttempts: 0,
      submittedAt: 0,
      status: 'draft',
    }

    const next: SessionReview = { ...base, status: 'draft', submittedAt: Date.now() }
    if ('sessionRpe' in patch) next.sessionRpe = patch.sessionRpe ?? null
    if ('goodPasses' in patch) next.goodPasses = patch.goodPasses ?? 0
    if ('totalAttempts' in patch) next.totalAttempts = patch.totalAttempts ?? 0
    if ('drillScores' in patch) next.drillScores = patch.drillScores
    if ('perDrillCaptures' in patch) {
      const captures = patch.perDrillCaptures
      next.perDrillCaptures = captures && captures.length > 0 ? captures : undefined
    }
    if ('borderlineCount' in patch) next.borderlineCount = patch.borderlineCount
    if ('incompleteReason' in patch) next.incompleteReason = patch.incompleteReason
    if ('quickTags' in patch) next.quickTags = patch.quickTags
    if ('shortNote' in patch) next.shortNote = patch.shortNote

    await reviews.put(next)
  })
}

/**
 * Legacy "save a full draft shape" entry point. Now a thin shim over
 * `patchReviewDraft` that preserves key-presence semantics: optional
 * fields the caller omitted from `data` stay absent from the patch and
 * therefore preserve any prior value on the row. Callers that pass
 * `field: undefined` explicitly still clear the field, matching the
 * pre-U1 behavior. New call sites should prefer `patchReviewDraft` for
 * partial writes.
 */
export async function saveReviewDraft(data: DraftReviewData): Promise<void> {
  const patch: ReviewDraftPatch = {
    sessionRpe: data.sessionRpe,
    goodPasses: data.goodPasses,
    totalAttempts: data.totalAttempts,
  }
  if ('drillScores' in data) patch.drillScores = data.drillScores
  if ('perDrillCaptures' in data) patch.perDrillCaptures = data.perDrillCaptures
  if ('borderlineCount' in data) patch.borderlineCount = data.borderlineCount
  if ('incompleteReason' in data) patch.incompleteReason = data.incompleteReason
  if ('quickTags' in data) patch.quickTags = data.quickTags
  if ('shortNote' in data) patch.shortNote = data.shortNote
  await patchReviewDraft(data.executionLogId, patch)
}

/**
 * Load the current review draft for `executionLogId`, if one exists.
 * Returns `null` when no record exists, or when the existing record is
 * terminal (`submitted` / `skipped`). ReviewScreen's Finish Later / home
 * re-entry flow uses this to rehydrate the form state.
 */
export async function loadReviewDraft(executionLogId: string): Promise<SessionReview | null> {
  const row = await db.sessionReviews.where('executionLogId').equals(executionLogId).first()
  if (!row) return null
  if (row.status !== 'draft') return null
  return row
}
