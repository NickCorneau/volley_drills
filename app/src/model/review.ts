/**
 * Session review model — the post-session record the tester submits
 * (or finishes later, or expires past the 2 h cap). Pure product type;
 * persistence-layer rows re-export this shape today.
 */
import type { AdaptationDelta, VerdictChoice } from './adaptation'
import type { PerDrillCapture, RpeCaptureWindow } from './capture'

export type IncompleteReason = 'time' | 'fatigue' | 'pain' | 'other'

export interface DrillVariantScore {
  drillId: string
  variantId: string
  goodPasses: number
  totalAttempts: number
}

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
  /**
   * M002.1 visible adaptation (D150, D151). The next-time stress delta
   * offered at the end of this session's review, and the user's
   * accept/keep response to it. These are the only new persisted state
   * the milestone adds — everything else (plan, backlog, receipt,
   * skill proxy) is recomputed on demand. Both are absent on pre-M002.1
   * rows; readers treat absence as "no delta offered / no verdict".
   * The pair is a deliberate simplification below D150's "append-only
   * ledger" — the choice is 1:1 with the review it rides on.
   */
  offeredDelta?: AdaptationDelta
  verdictChoice?: VerdictChoice
}
