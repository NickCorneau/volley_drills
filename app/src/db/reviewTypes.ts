/**
 * Compatibility shim — review-row types now live in `app/src/model/`.
 * U4 of the architecture pass demoted `db/` to a persistence adapter.
 *
 * NEW CALL SITES MUST IMPORT FROM `app/src/model/` directly.
 */
export type {
  DifficultyTag,
  DrillVariantScore,
  IncompleteReason,
  PerDrillCapture,
  RpeCaptureWindow,
  SessionReview,
  SessionReviewStatus,
} from '../model'
