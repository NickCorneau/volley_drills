/**
 * Per-drill capture model — the record `DrillCheckScreen` writes when
 * a tester taps the difficulty chip on `/run/check` between blocks
 * (D133, 2026-04-26). Pure product type; persistence-layer rows
 * re-export this shape verbatim today.
 */

/**
 * D133 (2026-04-26): per-drill required difficulty enum captured on
 * `DrillCheckScreen` at `/run/check` after completed capture-eligible
 * blocks. The three buckets exhaust the union; a future fourth tag
 * would surface as a TS compile error in
 * `domain/capture/aggregate.ts` and force the recap consumers to
 * update in lockstep.
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
