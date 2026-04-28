import { db } from '../db/schema'
import type {
  DrillVariantScore,
  ExecutionLog,
  IncompleteReason,
  PerDrillCapture,
  RpeCaptureWindow,
  SessionPlan,
  SessionReview,
} from '../db/types'
import { endedAt } from '../domain/executionPredicates'
import {
  CAPTURE_WINDOW_IMMEDIATE_MS,
  CAPTURE_WINDOW_SAME_DAY_MS,
  CAPTURE_WINDOW_SAME_SESSION_MS,
  FINISH_LATER_CAP_MS as POLICY_FINISH_LATER_CAP_MS,
} from '../domain/policies'
import { applyBlockOverrides } from '../domain/sessionProjection'
import { clearSoftBlockDismissed } from './softBlock'
import { getStorageMeta } from './storageMeta'

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

// --- Capture-window bucketing (V0B-30 / D120) ---
// Policy knobs live in `domain/policies`. Re-exported here so existing
// call sites (`ReviewScreen`, `services/session`, tests) keep working.

export const FINISH_LATER_CAP_MS = POLICY_FINISH_LATER_CAP_MS

export function classifyCaptureWindow(delaySeconds: number): RpeCaptureWindow {
  const ms = delaySeconds * 1_000
  if (ms <= CAPTURE_WINDOW_IMMEDIATE_MS) return 'immediate'
  if (ms <= CAPTURE_WINDOW_SAME_SESSION_MS) return 'same_session'
  if (ms <= CAPTURE_WINDOW_SAME_DAY_MS) return 'same_day'
  return 'next_day_plus'
}

export function isEligibleForAdaptation(window: RpeCaptureWindow): boolean {
  switch (window) {
    case 'immediate':
    case 'same_session':
    case 'same_day':
      return true
    case 'next_day_plus':
    case 'expired':
      return false
    default: {
      const _exhaustive: never = window
      return _exhaustive
    }
  }
}

// Alias retained for local readability; canonical helper is
// `endedAt` in `domain/executionPredicates`.
const sessionEndTimestamp = endedAt

// --- D133 per-drill aggregation (2026-04-26) ---

export interface AggregateCapturesResult {
  /** Sum of `goodPasses` across captures that have counts. */
  goodPasses: number
  /** Sum of `attemptCount` across captures that have counts. */
  totalAttempts: number
  /** Number of captures that had `goodPasses` + `attemptCount` set. */
  drillsWithCounts: number
  /** Number of captures that fired `notCaptured` for this drill. */
  drillsNotCaptured: number
  /**
   * Number of captures whose `difficulty` chip was tapped, regardless of
   * whether counts were also added. Used by ReviewScreen to decide
   * whether to hide the session-level Good/Total card.
   */
  drillsTagged: number
  /**
   * 2026-04-27 pre-D91 editorial polish (`F-recap-tags`, plan Item 8):
   * frequency of each `DifficultyTag` across the capture set, used by
   * `CompleteScreen` to render a "Difficulty: 2 too hard · 1 still
   * learning" recap row that closes the loop on the per-drill tap. The
   * three keys are always present (zeros included) so the consumer can
   * iterate without optional-chaining; rendering logic in the consumer
   * decides which keys to omit / collapse to "All <bucket>". `notCaptured`
   * rows still receive their tag counted here — the chip was tapped, the
   * counts were the optional bit. See
   * `docs/plans/2026-04-26-pre-d91-editorial-polish.md` Item 8.
   */
  tagBreakdown: {
    too_hard: number
    still_learning: number
    too_easy: number
  }
}

/**
 * Aggregate per-drill captures into the session-level shape that
 * ReviewScreen / CompleteScreen / `composeSummary` already speak.
 *
 * Sum semantics (D133): only captures that explicitly carry both
 * `goodPasses` and `attemptCount` contribute to the summed counts —
 * captures that are tag-only or `notCaptured: true` are NOT imputed
 * with zeros (which would inflate the denominator and produce a
 * misleadingly low pass rate). Drills the tester chose not to count
 * surface through `drillsNotCaptured` for honest copy on the
 * Complete recap, not through the rate calculation.
 *
 * Returns zeroes when `captures` is `undefined` or empty so callers can
 * treat the result as a no-op fallback.
 */
export function aggregateDrillCaptures(
  captures: PerDrillCapture[] | undefined,
): AggregateCapturesResult {
  if (!captures || captures.length === 0) {
    return {
      goodPasses: 0,
      totalAttempts: 0,
      drillsWithCounts: 0,
      drillsNotCaptured: 0,
      drillsTagged: 0,
      tagBreakdown: { too_hard: 0, still_learning: 0, too_easy: 0 },
    }
  }
  let goodPasses = 0
  let totalAttempts = 0
  let drillsWithCounts = 0
  let drillsNotCaptured = 0
  // Tag distribution accumulator. The three buckets exhaust the
  // `DifficultyTag` union (`too_hard | still_learning | too_easy`); a
  // future fourth tag would surface as a TS compile error here, which
  // is the intended forcing function so the recap row gets updated in
  // lockstep with the capture vocabulary.
  const tagBreakdown = { too_hard: 0, still_learning: 0, too_easy: 0 }
  for (const capture of captures) {
    tagBreakdown[capture.difficulty] += 1
    if (capture.notCaptured) {
      drillsNotCaptured += 1
      continue
    }
    if (typeof capture.goodPasses === 'number' && typeof capture.attemptCount === 'number') {
      goodPasses += capture.goodPasses
      totalAttempts += capture.attemptCount
      drillsWithCounts += 1
    }
  }
  return {
    goodPasses,
    totalAttempts,
    drillsWithCounts,
    drillsNotCaptured,
    drillsTagged: captures.length,
    tagBreakdown,
  }
}

// --- Submit ---

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
  const endAt = exec ? sessionEndTimestamp(exec) : now
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

// --- Expire (V0B-31 / D120) ---

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
  const endAt = exec ? sessionEndTimestamp(exec) : now
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

// --- Counters (C-2 Unit 2) ---

const isCohortTimestamp = (v: unknown): v is number =>
  typeof v === 'number' && Number.isFinite(v) && v > 0

/**
 * Total count of `SessionReview` records with `status === 'submitted'`,
 * bounded to the v0b cohort when a sentinel exists.
 *
 * Feeds the C-2 default-case summary line (`"Session {N}. ..."`). Drafts
 * and skipped stubs are excluded per H10 / H14 / H18: only submitted
 * reviews represent an adaptation-eligible completion.
 *
 * Cohort bound (adversarial finding adv-5 fix): when
 * `storageMeta.onboarding.completedAt` is set, filter records to
 * `submittedAt >= completedAt`. This prevents migrated v3 reviews from
 * inflating Session {N} on a migrated tester's first v0b submission.
 * The C-0 backfill writes the sentinel at v4 upgrade time for any device
 * with pre-existing `ExecutionLog` records (H15); C-3 will write it on
 * fresh-install first-Build. If the sentinel is absent (pre-C-3 cold
 * state or a tester who never completed onboarding), fall back to
 * counting all submitted records - preserving the current contract.
 *
 * In-memory filter over the whole table because D91 cohort record counts
 * are bounded at ~20 per tester and Dexie doesn't index `status`. Matches
 * the `findPendingReview` read pattern.
 */
export async function countSubmittedReviews(): Promise<number> {
  const [all, cohortStartedAt] = await Promise.all([
    db.sessionReviews.toArray(),
    getStorageMeta('onboarding.completedAt', isCohortTimestamp),
  ])
  const submitted = all.filter((r) => r.status === 'submitted')
  if (cohortStartedAt == null) return submitted.length
  return submitted.filter((r) => r.submittedAt >= cohortStartedAt).length
}

// --- Draft persistence (C-1 Unit 7) ---

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
 * Persist an in-progress review as `status: 'draft'` through the same A3
 * envelope as the terminal writers. A pre-existing TERMINAL record
 * (`status` is `'submitted'` or `'skipped'`) is never overwritten - the
 * H19 conflict and skip/expire paths own those states.
 *
 * Idempotent for same-shape re-saves; each call updates `submittedAt` so
 * the draft's "last edited" timestamp advances as the user types.
 */
export async function saveReviewDraft(data: DraftReviewData): Promise<void> {
  const now = Date.now()
  const draft: SessionReview = {
    id: `review-${data.executionLogId}`,
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
    status: 'draft',
  }
  await db.transaction('rw', db.sessionReviews, async (tx) => {
    const reviews = tx.table<SessionReview, string>('sessionReviews')
    const existing = await reviews.where('executionLogId').equals(data.executionLogId).first()
    if (existing && (existing.status === 'submitted' || existing.status === 'skipped')) {
      return
    }
    await reviews.put(draft)
  })
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

// --- Load ---

export interface SessionBundle {
  log: ExecutionLog
  plan: SessionPlan
  review: SessionReview
}

export async function loadSessionBundle(execId: string): Promise<SessionBundle | null> {
  const log = await db.executionLogs.get(execId)
  if (!log) return null
  const [plan, review] = await Promise.all([
    db.sessionPlans.get(log.planId),
    db.sessionReviews.where('executionLogId').equals(log.id).first(),
  ])
  if (!plan || !review) return null
  return { log, plan: applyBlockOverrides(plan, log), review }
}
