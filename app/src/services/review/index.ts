/**
 * `services/review` barrel — single import point for the review service
 * surface. U3 of the architecture pass split the legacy
 * `services/review.ts` along its true reasons-to-change:
 *
 *   - `submit.ts`  — A3-matrix terminal write
 *   - `expire.ts`  — Finish-Later cap finalize (preserves draft payload)
 *   - `drafts.ts`  — field-merging draft persistence (U1 contract)
 *   - `cohort.ts`  — submitted-review counter for C-2 summary copy
 *   - `bundle.ts`  — execution + plan + review loader for Complete + export
 *
 * Capture-window classification, adaptation eligibility, and per-drill
 * aggregation are pure derivations and live in `domain/capture/`. They
 * are re-exported here for the existing `services/review` import path
 * until call sites are naturally rewritten.
 *
 * Layer rule: every module in `services/review/` owns Dexie writes
 * (or reads) for its slice. Pure rules belong in `domain/`. Modules in
 * this directory MUST be independently testable — no sibling-module
 * mocks.
 */

// Capture domain re-exports for legacy importers. New code should
// import from `domain/capture` directly.
export {
  aggregateDrillCaptures,
  classifyCaptureWindow,
  isEligibleForAdaptation,
  type AggregateCapturesResult,
} from '../../domain/capture'

// Finish-Later cap is a product knob owned by `domain/policies`.
// Re-exported from this barrel because legacy `ReviewScreen` /
// `services/session` callers historically imported it from
// `services/review`.
export { FINISH_LATER_CAP_MS } from '../../domain/policies'

export { submitReview, type SubmitReviewData, type SubmitReviewResult } from './submit'
export { expireReview, type ExpireReviewData } from './expire'
export {
  loadReviewDraft,
  patchReviewDraft,
  saveReviewDraft,
  type DraftReviewData,
  type ReviewDraftPatch,
} from './drafts'
export { countSubmittedReviews } from './cohort'
export { loadSessionBundle, type SessionBundle } from './bundle'
