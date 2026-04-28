export type IncompleteReason = 'time' | 'fatigue' | 'pain' | 'other'

export interface DrillVariantScore {
  drillId: string
  variantId: string
  goodPasses: number
  totalAttempts: number
}

/**
 * D133 (2026-04-26): per-drill required difficulty enum captured on
 * `DrillCheckScreen` at `/run/check` after completed capture-eligible blocks.
 */
export type DifficultyTag = 'too_hard' | 'still_learning' | 'too_easy'

interface PerDrillCaptureBase {
  drillId: string
  variantId: string
  /**
   * Block index, not drill id, is the merge key. A swapped session may run
   * the same drill twice and still needs two captures.
   */
  blockIndex: number
  difficulty: DifficultyTag
  capturedAt: number
}

/**
 * One entry per completed drill-check capture target. Valid states:
 * difficulty only, difficulty + Good/Total, or explicit not-captured.
 */
export type PerDrillCapture = PerDrillCaptureBase &
  (
    | {
        goodPasses: number
        attemptCount: number
        notCaptured?: false
      }
    | {
        goodPasses?: undefined
        attemptCount?: undefined
        notCaptured?: false
      }
    | {
        goodPasses?: undefined
        attemptCount?: undefined
        notCaptured: true
      }
  )

export type RpeCaptureWindow =
  | 'immediate'
  | 'same_session'
  | 'same_day'
  | 'next_day_plus'
  | 'expired'

export type SessionReviewStatus = 'submitted' | 'skipped' | 'draft'

/**
 * Review rows are intentionally permissive on read: legacy, skipped,
 * draft, and submitted records share one Dexie table. Writer services
 * enforce the narrower contracts for each status.
 *
 * Capture-window fields are persisted replay inputs for the future
 * adaptation engine: only immediate / same-session / same-day rows are
 * eligible; next-day-plus and expired stubs are not.
 */
export interface SessionReview {
  id: string
  executionLogId: string
  sessionRpe: number | null
  goodPasses: number
  totalAttempts: number
  drillScores?: DrillVariantScore[]
  perDrillCaptures?: PerDrillCapture[]
  borderlineCount?: number
  incompleteReason?: IncompleteReason
  quickTags?: string[]
  shortNote?: string
  submittedAt: number
  capturedAt?: number
  captureDelaySeconds?: number
  captureWindow?: RpeCaptureWindow
  eligibleForAdaptation?: boolean
  status?: SessionReviewStatus
}
