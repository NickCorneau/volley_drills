import { describe, expect, it } from 'vitest'
import type { DrillSegment } from '../../../types/drill'
import {
  SEGMENT_INDEX_BONUS,
  computeSegmentState,
  scaleSegmentsForBlockDuration,
} from '../segmentTiming'

/**
 * U6 of `docs/plans/2026-04-28-per-move-pacing-indicator.md`:
 * pure timing math for the per-move pacing indicator. Every boundary
 * case (exact-boundary, just-before, just-after, last-segment-overflow,
 * stale-index, rewind, empty array) is pinned at the lowest tier.
 *
 * Test fixtures use the d28-solo shape (4 × 45 s = 180 s) for
 * uniform-cadence cases and the d25-solo shape (60+30+30+30+30 = 180 s)
 * for non-uniform cases.
 */

const D28_SEGMENTS: readonly DrillSegment[] = [
  { id: 's1', label: 'Jog', durationSec: 45 },
  { id: 's2', label: 'Hops', durationSec: 45 },
  { id: 's3', label: 'Arms', durationSec: 45 },
  { id: 's4', label: 'Shuffles', durationSec: 45 },
]

const D25_SEGMENTS: readonly DrillSegment[] = [
  { id: 's1', label: 'Walk', durationSec: 60 },
  { id: 's2', label: 'Sit', durationSec: 30 },
  { id: 's3', label: 'Hip', durationSec: 30 },
  { id: 's4', label: 'Back-bend', durationSec: 30 },
  { id: 's5', label: 'Shoulder', durationSec: 30 },
]

const D26_SEGMENTS: readonly DrillSegment[] = [
  { id: 's1', label: 'Calf', durationSec: 60 },
  { id: 's2', label: 'Hamstring', durationSec: 60 },
  { id: 's3', label: 'Hip flexor', durationSec: 60 },
]

describe('computeSegmentState', () => {
  describe('uniform-cadence segments (d28-solo shape, 4 × 45 s)', () => {
    it('returns currentIndex 0 with no boundary at t=0', () => {
      expect(computeSegmentState(0, D28_SEGMENTS, 0)).toEqual({
        currentIndex: 0,
        segmentEndingNow: false,
      })
    })

    it('stays on segment 0 just before the first boundary', () => {
      expect(computeSegmentState(44.99, D28_SEGMENTS, 0)).toEqual({
        currentIndex: 0,
        segmentEndingNow: false,
      })
    })

    it('advances to segment 1 with boundary fire at the exact 45 s mark', () => {
      expect(computeSegmentState(45, D28_SEGMENTS, 0)).toEqual({
        currentIndex: 1,
        segmentEndingNow: true,
      })
    })

    it('does not double-fire the boundary on a subsequent poll within segment 1', () => {
      // First poll fired the boundary; prevIndex now reflects segment 1.
      expect(computeSegmentState(45.25, D28_SEGMENTS, 1)).toEqual({
        currentIndex: 1,
        segmentEndingNow: false,
      })
      expect(computeSegmentState(60, D28_SEGMENTS, 1)).toEqual({
        currentIndex: 1,
        segmentEndingNow: false,
      })
    })

    it('advances through every boundary exactly once across a full block', () => {
      // Simulate the hook calling the helper at every poll boundary.
      const polls = [0, 30, 45, 60, 90, 120, 135, 150, 175, 180]
      let prevIndex = 0
      const fires: number[] = []
      for (const t of polls) {
        const state = computeSegmentState(t, D28_SEGMENTS, prevIndex)
        if (state.segmentEndingNow) fires.push(t)
        prevIndex = state.currentIndex
      }
      // Boundaries at 45, 90, 135, 180 (last entering bonus).
      expect(fires).toEqual([45, 90, 135, 180])
    })

    it('returns SEGMENT_INDEX_BONUS at the total-duration mark with a final boundary fire', () => {
      // Coming from segment 3, t=180 means sum exhausted → bonus.
      expect(computeSegmentState(180, D28_SEGMENTS, 3)).toEqual({
        currentIndex: SEGMENT_INDEX_BONUS,
        segmentEndingNow: true,
      })
    })

    it('stays in bonus without re-firing the boundary on subsequent polls', () => {
      expect(computeSegmentState(200, D28_SEGMENTS, SEGMENT_INDEX_BONUS)).toEqual({
        currentIndex: SEGMENT_INDEX_BONUS,
        segmentEndingNow: false,
      })
      expect(computeSegmentState(360, D28_SEGMENTS, SEGMENT_INDEX_BONUS)).toEqual({
        currentIndex: SEGMENT_INDEX_BONUS,
        segmentEndingNow: false,
      })
    })

    it('leap from segment 0 directly to bonus fires the boundary once', () => {
      // Pathological elapsed-time spike (e.g., paused into the next
      // browser-tick after a long suspend). prevIndex was 0, elapsed
      // jumped past all boundaries — fire once and settle in bonus.
      expect(computeSegmentState(200, D28_SEGMENTS, 0)).toEqual({
        currentIndex: SEGMENT_INDEX_BONUS,
        segmentEndingNow: true,
      })
    })
  })

  describe('non-uniform segments (d25-solo shape, 60+30+30+30+30)', () => {
    it('first boundary fires at 60 s (end of walk segment)', () => {
      expect(computeSegmentState(60, D25_SEGMENTS, 0)).toEqual({
        currentIndex: 1,
        segmentEndingNow: true,
      })
    })

    it('second boundary fires at 90 s (end of sit segment)', () => {
      expect(computeSegmentState(90, D25_SEGMENTS, 1)).toEqual({
        currentIndex: 2,
        segmentEndingNow: true,
      })
    })

    it('third boundary fires at 120 s', () => {
      expect(computeSegmentState(120, D25_SEGMENTS, 2)).toEqual({
        currentIndex: 3,
        segmentEndingNow: true,
      })
    })

    it('total elapsed at 180 s lands in bonus from segment 4 with one boundary fire', () => {
      expect(computeSegmentState(180, D25_SEGMENTS, 4)).toEqual({
        currentIndex: SEGMENT_INDEX_BONUS,
        segmentEndingNow: true,
      })
    })
  })

  describe('edge cases', () => {
    it('empty segments array returns bonus + no boundary fire', () => {
      expect(computeSegmentState(0, [], 0)).toEqual({
        currentIndex: SEGMENT_INDEX_BONUS,
        segmentEndingNow: false,
      })
      expect(computeSegmentState(60, [], SEGMENT_INDEX_BONUS)).toEqual({
        currentIndex: SEGMENT_INDEX_BONUS,
        segmentEndingNow: false,
      })
    })

    it('rewind from bonus back into a real segment does not fire the boundary', () => {
      // After bonus territory, if elapsedSec drops back below the
      // total (e.g., test scrubbing, controller bug), the helper
      // should report the correct active segment without firing
      // segmentEndingNow.
      expect(computeSegmentState(50, D28_SEGMENTS, SEGMENT_INDEX_BONUS)).toEqual({
        currentIndex: 1,
        segmentEndingNow: false,
      })
    })

    it('rewind from segment 2 to segment 0 does not fire the boundary backward', () => {
      expect(computeSegmentState(10, D28_SEGMENTS, 2)).toEqual({
        currentIndex: 0,
        segmentEndingNow: false,
      })
    })

    it('idempotent for the same input (pure)', () => {
      const a = computeSegmentState(45, D28_SEGMENTS, 0)
      const b = computeSegmentState(45, D28_SEGMENTS, 0)
      expect(a).toEqual(b)
    })
  })
})

/**
 * 2026-04-28 dogfeed iteration: when `Shorten` brings the active
 * block duration below the authored segment sum, scale segments
 * proportionally so the user does ALL moves at faster timing
 * (preserving warmup/cooldown coverage) instead of dropping the
 * trailing segments off the end of the shortened block.
 *
 * Long-wrap case: when block duration exceeds segment sum, segments
 * stay unchanged so the bonus paragraph renders in overflow
 * territory (e.g., d26-solo's 3 × 60 s on a 4-min wrap keeps
 * authored 60 s holds and surfaces the mirror/glutes/adductors
 * expansion).
 */
describe('scaleSegmentsForBlockDuration', () => {
  it('returns segments unchanged when block duration equals the segment sum (exact-fit case)', () => {
    const result = scaleSegmentsForBlockDuration(D28_SEGMENTS, 180)
    expect(result).toBe(D28_SEGMENTS)
  })

  it('returns segments unchanged when block duration exceeds the segment sum (long-wrap case)', () => {
    // d26 wrap on a 4-minute slot: 240s block, 180s segment sum.
    // Bonus territory should not scale segments up — the bonus
    // paragraph is the affordance for "if time remains."
    const result = scaleSegmentsForBlockDuration(D26_SEGMENTS, 240)
    expect(result).toBe(D26_SEGMENTS)
  })

  it('scales segments down proportionally when block duration is less than segment sum (Shorten case)', () => {
    // d28 shortened from 180s to 90s (Transition `Shorten block`):
    // factor = 0.5, each 45s segment becomes 22.5s. Cumulative ends
    // at 22.5, 45, 67.5, 90 — sums exactly to the new block
    // duration so segment 4 ends at block end.
    const result = scaleSegmentsForBlockDuration(D28_SEGMENTS, 90)
    expect(result).not.toBe(D28_SEGMENTS)
    expect(result).toHaveLength(4)
    for (const seg of result) {
      expect(seg.durationSec).toBeCloseTo(22.5)
    }
    const sum = result.reduce((s, x) => s + x.durationSec, 0)
    expect(sum).toBeCloseTo(90)
  })

  it('preserves segment ids and labels when scaling', () => {
    const result = scaleSegmentsForBlockDuration(D28_SEGMENTS, 90)
    expect(result.map((s) => s.id)).toEqual(D28_SEGMENTS.map((s) => s.id))
    expect(result.map((s) => s.label)).toEqual(D28_SEGMENTS.map((s) => s.label))
  })

  it('handles non-uniform segments (d25-solo 60+30+30+30+30 → shortened to 90s)', () => {
    // factor = 90/180 = 0.5: walk 30s, then four 15s segments.
    const result = scaleSegmentsForBlockDuration(D25_SEGMENTS, 90)
    expect(result.map((s) => s.durationSec)).toEqual([30, 15, 15, 15, 15])
    const sum = result.reduce((s, x) => s + x.durationSec, 0)
    expect(sum).toBe(90)
  })

  it('passes through empty segments array', () => {
    expect(scaleSegmentsForBlockDuration([], 90)).toEqual([])
  })

  it('passes through unchanged when block duration is zero or negative (defensive)', () => {
    expect(scaleSegmentsForBlockDuration(D28_SEGMENTS, 0)).toBe(D28_SEGMENTS)
    expect(scaleSegmentsForBlockDuration(D28_SEGMENTS, -1)).toBe(D28_SEGMENTS)
    expect(scaleSegmentsForBlockDuration(D28_SEGMENTS, NaN)).toBe(D28_SEGMENTS)
  })

  it('integrates with computeSegmentState — scaled segments produce correct boundary times', () => {
    // d28 shortened to 90s: scaled segments 4 × 22.5s.
    const scaled = scaleSegmentsForBlockDuration(D28_SEGMENTS, 90)
    // At elapsed 0 → segment 0, no fire.
    expect(computeSegmentState(0, scaled, 0)).toEqual({
      currentIndex: 0,
      segmentEndingNow: false,
    })
    // At elapsed 22.5 → segment 1 boundary, fires.
    expect(computeSegmentState(22.5, scaled, 0)).toEqual({
      currentIndex: 1,
      segmentEndingNow: true,
    })
    // At elapsed 90 → bonus territory (block ends).
    expect(computeSegmentState(90, scaled, 3)).toEqual({
      currentIndex: SEGMENT_INDEX_BONUS,
      segmentEndingNow: true,
    })
  })
})
