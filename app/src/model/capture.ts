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

/**
 * D134 (2026-04-28): optional non-count capture shape on Drill Check
 * for `main_skill` / `pressure` blocks whose drill is not count-eligible
 * (Phase 2A ships only the `streak` arm). The discriminator is the
 * permanent shape — Phase 2B will add `{ kind: 'points'; ... }` and
 * `{ kind: 'grade'; ... }` siblings as one-line additions when their
 * triggers fire, without a destructive migration.
 *
 * **Mutual exclusion with count fields is enforced at the row level**
 * by the `PerDrillCapture` tagged union (see below) and by the pure
 * builders in `app/src/domain/capture/buildPerDrillCapture.ts`. A
 * single row never carries both `goodPasses` / `attemptCount` and a
 * `metricCapture`; nor does a `notCaptured: true` row carry one.
 *
 * The integer range / clamping rules for each shape's payload live
 * with the builders, not on the type — `validateStreakLongest`
 * (`0..99`, whole numbers) is the canonical normalizer. Persistence
 * round-trips the value as written.
 */
export type MetricCapture = { kind: 'streak'; longest: number }

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
 *
 *   1. **Count row** — Difficulty + `goodPasses` + `attemptCount`.
 *      Reserved for `pass-rate-good` / `reps-successful` drills.
 *   2. **Metric-capture row** — Difficulty + `metricCapture`. Reserved
 *      for non-count metric types whose strategy declares an optional
 *      `CaptureShape` other than `'count'` (Phase 2A: `streak`).
 *   3. **Difficulty-only row** — Difficulty alone. Used when the
 *      tester does not opt into the optional shape on a non-count
 *      drill, or when count fields are deliberately left blank.
 *   4. **notCaptured row** — Difficulty + `notCaptured: true`. The
 *      tester explicitly tagged the drill but skipped both counts and
 *      any optional shape.
 *
 * D134 (2026-04-28): the union forbids row shapes that mix a count
 * payload with `metricCapture`, and forbids `notCaptured: true` rows
 * carrying a `metricCapture`. The builders in
 * `app/src/domain/capture/buildPerDrillCapture.ts` are the only
 * sanctioned constructors; controllers MUST NOT hand-assemble a row.
 */
export type PerDrillCapture = PerDrillCaptureBase &
  (
    | {
        goodPasses: number
        attemptCount: number
        notCaptured?: false
        metricCapture?: undefined
      }
    | {
        goodPasses?: undefined
        attemptCount?: undefined
        notCaptured?: false
        metricCapture: MetricCapture
      }
    | {
        goodPasses?: undefined
        attemptCount?: undefined
        notCaptured?: false
        metricCapture?: undefined
      }
    | {
        goodPasses?: undefined
        attemptCount?: undefined
        notCaptured: true
        metricCapture?: undefined
      }
  )

export type RpeCaptureWindow =
  | 'immediate'
  | 'same_session'
  | 'same_day'
  | 'next_day_plus'
  | 'expired'
