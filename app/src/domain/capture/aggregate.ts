import type { PerDrillCapture } from '../../model'

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

const EMPTY_RESULT: AggregateCapturesResult = {
  goodPasses: 0,
  totalAttempts: 0,
  drillsWithCounts: 0,
  drillsNotCaptured: 0,
  drillsTagged: 0,
  tagBreakdown: { too_hard: 0, still_learning: 0, too_easy: 0 },
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
    // Return a fresh object so downstream mutators (none today, but the
    // shape is small) do not see the shared sentinel.
    return {
      ...EMPTY_RESULT,
      tagBreakdown: { ...EMPTY_RESULT.tagBreakdown },
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
