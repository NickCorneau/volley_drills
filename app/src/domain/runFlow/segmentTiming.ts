import type { DrillSegment } from '../../types/drill'

/**
 * Pure timing math for the per-move pacing indicator.
 *
 * 2026-04-28 ship (`docs/plans/2026-04-28-per-move-pacing-indicator.md`
 * U6): factored out of `useBlockPacingTicks` so the segment math has a
 * domain-tier home with explicit unit-test coverage. The hook calls
 * this helper once per poll; everything else lives in pure code.
 *
 * Lives in `domain/runFlow/` alongside `postBlockRoute.ts` because
 * both are pure rules a controller / hook consults to make a routing
 * or pacing decision. No React, no Dexie, no platform.
 */

/**
 * Sentinel value for `currentIndex` indicating the block has run past
 * the sum of segment durations and is in bonus / overflow territory.
 * RunScreen interprets `-1` as "all segments checked, render bonus
 * footnote if present." The hook stops firing `onSegmentEndTick` once
 * `currentIndex` reaches `-1` so the per-segment beep does not chase
 * the block-end countdown.
 */
export const SEGMENT_INDEX_BONUS = -1 as const

export interface SegmentState {
  /**
   * 0-based index of the segment the user should be on right now.
   * `SEGMENT_INDEX_BONUS` (`-1`) when all segments have ended (block
   * is in bonus territory).
   */
  currentIndex: number
  /**
   * True ONLY on the tick where a segment boundary just elapsed
   * (relative to `prevIndex`). The hook fires `onSegmentEndTick` once
   * per boundary by gating on this flag.
   *
   * False on every other state — including stale-index ticks
   * (boundary already fired for that index), bonus-territory ticks,
   * and rewind-into-an-earlier-segment ticks.
   */
  segmentEndingNow: boolean
}

/**
 * Compute which segment the user should currently be on, and whether
 * a segment boundary just elapsed since the previous poll.
 *
 * Pure. Idempotent for the same `(elapsedSec, segments, prevIndex)`
 * triple. No clocks, no side effects.
 *
 * Boundary semantics: a segment ends at the cumulative time
 * `sum(segments[0..i].durationSec)`. So with three 60 s segments,
 * segment 0 ends at `t=60`, segment 1 ends at `t=120`, segment 2
 * ends at `t=180`. At each of those exact times the *next* segment
 * becomes current and `segmentEndingNow` is true.
 *
 * @param elapsedSec    cumulative running seconds since block start
 *                       (block-paused time excluded — the caller is
 *                       responsible for that subtraction).
 * @param segments      authored segments for the current block.
 * @param prevIndex     the `currentIndex` returned on the previous
 *                       poll. Pass `0` on the first poll of a fresh
 *                       block. Used to suppress duplicate
 *                       `segmentEndingNow` flags on subsequent polls.
 */
/**
 * Scale segment durations down to fit a shorter actual block duration.
 *
 * 2026-04-28 dogfeed (V3): the user reported that tapping `Shorten`
 * on warmup or cooldown halved the block timer but left segment
 * durations untouched, so the indicator ran past the last fitting
 * segment without advancing through the remaining ones. The
 * authored-coverage intent (warmup hits all 4 movement components;
 * cooldown does all stretch holds) was being violated by the
 * truncate-later-segments behavior.
 *
 * Product rule:
 *  - When `blockDurationSeconds < sum(segments[].durationSec)`,
 *    scale every segment by `factor = blockDurationSeconds / sum`
 *    so the user does ALL moves, each at proportionally shorter
 *    duration. Honors coverage; on-thesis with "shorter session,
 *    less work per move."
 *  - When `blockDurationSeconds >= sum`, return segments unchanged.
 *    This preserves the bonus-territory behavior on long wraps
 *    (e.g., d26-solo's 3-segment 180 s sequence on a 4-minute wrap
 *    keeps authored 60 s holds and surfaces the
 *    `courtsideInstructionsBonus` mirror/glutes/adductors expansion
 *    once segments complete).
 *
 * Pure. Returns the same array reference when no change is needed
 * (defensive against unnecessary re-renders in `useMemo` consumers).
 *
 * Display rounding: callers should `Math.round(seg.durationSec)`
 * when rendering. The pacing math (`computeSegmentState`) uses the
 * unrounded float so cumulative segment ends still sum exactly to
 * `blockDurationSeconds`.
 */
export function scaleSegmentsForBlockDuration(
  segments: readonly DrillSegment[],
  blockDurationSeconds: number,
): readonly DrillSegment[] {
  if (segments.length === 0) return segments
  if (!Number.isFinite(blockDurationSeconds) || blockDurationSeconds <= 0) return segments
  const sum = segments.reduce((acc, s) => acc + s.durationSec, 0)
  if (sum <= 0) return segments
  if (blockDurationSeconds >= sum) return segments
  const factor = blockDurationSeconds / sum
  return segments.map((s) => ({ ...s, durationSec: s.durationSec * factor }))
}

export function computeSegmentState(
  elapsedSec: number,
  segments: readonly DrillSegment[],
  prevIndex: number,
): SegmentState {
  if (segments.length === 0) {
    return { currentIndex: SEGMENT_INDEX_BONUS, segmentEndingNow: false }
  }

  // Walk forward through segment boundaries. The first segment whose
  // *cumulative* end time is strictly greater than `elapsedSec` is
  // the active segment. If `elapsedSec` reaches or exceeds the total
  // duration, fall through to bonus territory.
  let cumulative = 0
  for (let i = 0; i < segments.length; i++) {
    cumulative += segments[i].durationSec
    if (elapsedSec < cumulative) {
      // We're inside segment `i`. A boundary just elapsed when (a)
      // `i` is greater than `prevIndex` (caller advanced into a new
      // segment since the last poll), and (b) `prevIndex` was not
      // already the bonus sentinel (a rewind from bonus back into a
      // segment is not a boundary fire).
      const advanced = i > prevIndex && prevIndex !== SEGMENT_INDEX_BONUS
      return { currentIndex: i, segmentEndingNow: advanced }
    }
  }

  // Past the last segment: bonus territory. Fire the
  // segmentEndingNow flag exactly once on the transition into bonus
  // (i.e., the first poll where prevIndex was a real segment index).
  const justEntered = prevIndex !== SEGMENT_INDEX_BONUS && prevIndex < segments.length
  return { currentIndex: SEGMENT_INDEX_BONUS, segmentEndingNow: justEntered }
}
