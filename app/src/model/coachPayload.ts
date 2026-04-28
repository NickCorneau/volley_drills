/**
 * Coach payload — forward-compatibility seam for Phase 2 / `D106`.
 *
 * "What gets shared with a coach" is a STRICT SUBSET of the model.
 * No Dexie row primary keys, no `storageMeta`, no draft sentinels,
 * no internal status enums. The type encodes that contract today so
 * Phase 2 transport (clipboard, share-sheet, web link) only has to
 * implement serialization, not decide what is safe to leak.
 *
 * Layer rule: pure type-only declaration. No transport, no UI, no
 * Dexie. Adapters live alongside other adapters in `services/export/`
 * once Phase 2 transport ships. Until then, the type is the single
 * authoritative answer to "what does a coach see?" Tests assert that
 * every field referenced here is also present on the model.
 */
import type { ExecutionLog, SessionPlan } from './session'
import type { SessionReview } from './review'
import type { PerDrillCapture } from './capture'
import type { SessionParticipant } from './participant'

/**
 * Coach-visible session header. Strictly the public-facing
 * fields: identity, focus, when it ran, who was on court.
 */
export interface CoachSessionHeader {
  planId: SessionPlan['id']
  presetName: SessionPlan['presetName']
  /** Projected from `participants[]` so coach sees roles, not playerCount. */
  participants: SessionParticipant[]
  startedAt: ExecutionLog['startedAt']
  completedAt?: ExecutionLog['completedAt']
}

/**
 * Block summary for coach review. We send only the resolved drill
 * identity and final block status — never the timer state, never
 * Dexie row sentinels.
 */
export interface CoachBlockSummary {
  drillId: SessionPlan['blocks'][number]['drillId']
  variantId: SessionPlan['blocks'][number]['variantId']
  drillName: SessionPlan['blocks'][number]['drillName']
  durationMinutes: SessionPlan['blocks'][number]['durationMinutes']
  status: ExecutionLog['blockStatuses'][number]['status']
}

/**
 * Per-drill captures that the coach can see. Mirrors the model's
 * `PerDrillCapture` exactly so the type test below can reuse the
 * model union (no narrowing, no widening).
 */
export type CoachPerDrillCapture = Pick<
  PerDrillCapture,
  'drillId' | 'variantId' | 'blockIndex' | 'difficulty' | 'goodPasses' | 'attemptCount'
>

/**
 * Review-side aggregate visible to the coach. RPE is intentionally
 * a number (`null` is filtered by adapters) and `incompleteReason`
 * is included so the coach can see why a session ended early.
 */
export interface CoachReviewSummary {
  sessionRpe: NonNullable<SessionReview['sessionRpe']>
  goodPasses: SessionReview['goodPasses']
  totalAttempts: SessionReview['totalAttempts']
  shortNote?: SessionReview['shortNote']
  incompleteReason?: SessionReview['incompleteReason']
}

/**
 * The full coach payload. Phase 2 transport serializes this object
 * directly. Notably absent: `status`, `submittedAt`, `captureWindow`,
 * `eligibleForAdaptation`, `softBlockDismissedAt`, draft-only fields,
 * `storageMeta`, anything Dexie-only.
 */
export interface CoachPayload {
  schemaVersion: 1
  exportedAt: number
  session: CoachSessionHeader
  blocks: CoachBlockSummary[]
  captures: CoachPerDrillCapture[]
  review?: CoachReviewSummary
}
