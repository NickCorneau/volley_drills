import { renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { DrillSegment } from '../types/drill'
import { SEGMENT_INDEX_BONUS, useBlockPacingTicks } from './useBlockPacingTicks'

beforeEach(() => {
  vi.useFakeTimers()
})

afterEach(() => {
  vi.useRealTimers()
  vi.restoreAllMocks()
})

describe('useBlockPacingTicks', () => {
  it('does nothing while not running', () => {
    const onEndTick = vi.fn()
    const onSubBlockTick = vi.fn()
    const remainingRef = { current: 10 }
    const blockDurRef = { current: 60 }

    renderHook(() =>
      useBlockPacingTicks({
        running: false,
        blockId: 'b1',
        subBlockIntervalSeconds: 30,
        remainingRef,
        blockDurRef,
        onEndCountdownTick: onEndTick,
        onSubBlockTick,
      }),
    )

    vi.advanceTimersByTime(5_000)
    expect(onEndTick).not.toHaveBeenCalled()
    expect(onSubBlockTick).not.toHaveBeenCalled()
  })

  it('fires the end-countdown tick once for each of 3, 2, 1 while remaining', () => {
    const onEndTick = vi.fn()
    const onSubBlockTick = vi.fn()
    const remainingRef = { current: 10 }
    const blockDurRef = { current: 60 }

    renderHook(() =>
      useBlockPacingTicks({
        running: true,
        blockId: 'b1',
        subBlockIntervalSeconds: undefined,
        remainingRef,
        blockDurRef,
        onEndCountdownTick: onEndTick,
        onSubBlockTick,
      }),
    )

    remainingRef.current = 3
    vi.advanceTimersByTime(250)
    expect(onEndTick).toHaveBeenCalledTimes(1)

    remainingRef.current = 1.9 // ceil === 2
    vi.advanceTimersByTime(250)
    expect(onEndTick).toHaveBeenCalledTimes(2)

    remainingRef.current = 0.9 // ceil === 1
    vi.advanceTimersByTime(250)
    expect(onEndTick).toHaveBeenCalledTimes(3)

    // A poll once remaining has hit 0 must not fire anything
    remainingRef.current = 0
    vi.advanceTimersByTime(250)
    expect(onEndTick).toHaveBeenCalledTimes(3)
    expect(onSubBlockTick).not.toHaveBeenCalled()
  })

  it('does not double-fire a countdown second if two polls land on it', () => {
    const onEndTick = vi.fn()
    const remainingRef = { current: 2.8 }
    const blockDurRef = { current: 60 }

    renderHook(() =>
      useBlockPacingTicks({
        running: true,
        blockId: 'b1',
        remainingRef,
        blockDurRef,
        onEndCountdownTick: onEndTick,
        onSubBlockTick: vi.fn(),
      }),
    )

    vi.advanceTimersByTime(250)
    vi.advanceTimersByTime(250)
    // both polls saw ceil(remaining) === 3, should fire once
    expect(onEndTick).toHaveBeenCalledTimes(1)
  })

  it('fires a sub-block tick at each interval boundary, suppressed in the last 4 s', () => {
    const onSubBlockTick = vi.fn()
    const remainingRef = { current: 60 }
    const blockDurRef = { current: 60 }

    renderHook(() =>
      useBlockPacingTicks({
        running: true,
        blockId: 'b1',
        subBlockIntervalSeconds: 30,
        remainingRef,
        blockDurRef,
        onEndCountdownTick: vi.fn(),
        onSubBlockTick,
      }),
    )

    // Elapsed = 60 - 40 = 20 < 30 → no tick
    remainingRef.current = 40
    vi.advanceTimersByTime(250)
    expect(onSubBlockTick).not.toHaveBeenCalled()

    // Elapsed = 60 - 29 = 31 → index 1, fires once
    remainingRef.current = 29
    vi.advanceTimersByTime(250)
    expect(onSubBlockTick).toHaveBeenCalledTimes(1)

    // Same index, no new tick
    remainingRef.current = 25
    vi.advanceTimersByTime(250)
    expect(onSubBlockTick).toHaveBeenCalledTimes(1)

    // Suppressed in the final 4 s even if a new index would fire
    remainingRef.current = 3
    vi.advanceTimersByTime(250)
    expect(onSubBlockTick).toHaveBeenCalledTimes(1)
  })

  it('resets its bookkeeping on blockId change', () => {
    const onEndTick = vi.fn()
    const remainingRef = { current: 3 }
    const blockDurRef = { current: 60 }

    const { rerender } = renderHook(
      ({ blockId }: { blockId: string }) =>
        useBlockPacingTicks({
          running: true,
          blockId,
          remainingRef,
          blockDurRef,
          onEndCountdownTick: onEndTick,
          onSubBlockTick: vi.fn(),
        }),
      { initialProps: { blockId: 'b1' } },
    )

    vi.advanceTimersByTime(250)
    expect(onEndTick).toHaveBeenCalledTimes(1)

    // Switch to a new block with the same remaining — should fire again
    rerender({ blockId: 'b2' })
    remainingRef.current = 3
    vi.advanceTimersByTime(250)
    expect(onEndTick).toHaveBeenCalledTimes(2)
  })

  it('clears the interval on unmount', () => {
    const onEndTick = vi.fn()
    const remainingRef = { current: 3 }
    const blockDurRef = { current: 60 }
    const { unmount } = renderHook(() =>
      useBlockPacingTicks({
        running: true,
        blockId: 'b1',
        remainingRef,
        blockDurRef,
        onEndCountdownTick: onEndTick,
        onSubBlockTick: vi.fn(),
      }),
    )
    unmount()
    vi.advanceTimersByTime(1_000)
    expect(onEndTick).not.toHaveBeenCalled()
  })

  /**
   * U6 of `docs/plans/2026-04-28-per-move-pacing-indicator.md`:
   * the segments-driven path. When `segments` is present, the hook
   * fires `onSegmentEndTick` at each boundary, suppresses the uniform
   * `onSubBlockTick`, and reports the active index via
   * `onSegmentIndexChange`. Block-end 3-2-1 stays unchanged.
   */
  describe('segments-driven path', () => {
    const D28_SEGMENTS: readonly DrillSegment[] = [
      { id: 's1', label: 'Jog', durationSec: 45 },
      { id: 's2', label: 'Hops', durationSec: 45 },
      { id: 's3', label: 'Arms', durationSec: 45 },
      { id: 's4', label: 'Shuffles', durationSec: 45 },
    ]

    it('fires onSegmentEndTick once per boundary and suppresses onSubBlockTick', () => {
      const onSegmentEndTick = vi.fn()
      const onSubBlockTick = vi.fn()
      const onSegmentIndexChange = vi.fn<(i: number) => void>()
      const remainingRef = { current: 180 }
      const blockDurRef = { current: 180 }

      renderHook(() =>
        useBlockPacingTicks({
          running: true,
          blockId: 'b1',
          // Both fields present: segments must take precedence.
          subBlockIntervalSeconds: 45,
          segments: D28_SEGMENTS,
          remainingRef,
          blockDurRef,
          onEndCountdownTick: vi.fn(),
          onSubBlockTick,
          onSegmentEndTick,
          onSegmentIndexChange,
        }),
      )

      // Mid-segment-0: no fire yet.
      remainingRef.current = 160 // elapsed = 20
      vi.advanceTimersByTime(250)
      expect(onSegmentEndTick).not.toHaveBeenCalled()

      // Past first boundary at elapsed=45.
      remainingRef.current = 134 // elapsed = 46
      vi.advanceTimersByTime(250)
      expect(onSegmentEndTick).toHaveBeenCalledTimes(1)
      expect(onSegmentIndexChange).toHaveBeenCalledWith(1)

      // Same segment, no new fire.
      remainingRef.current = 100 // elapsed = 80
      vi.advanceTimersByTime(250)
      expect(onSegmentEndTick).toHaveBeenCalledTimes(1)

      // Past second boundary at elapsed=90.
      remainingRef.current = 89 // elapsed = 91
      vi.advanceTimersByTime(250)
      expect(onSegmentEndTick).toHaveBeenCalledTimes(2)
      expect(onSegmentIndexChange).toHaveBeenLastCalledWith(2)

      // Past third boundary at elapsed=135.
      remainingRef.current = 44 // elapsed = 136
      vi.advanceTimersByTime(250)
      expect(onSegmentEndTick).toHaveBeenCalledTimes(3)
      expect(onSegmentIndexChange).toHaveBeenLastCalledWith(3)

      // Uniform sub-block tick must NOT have fired across this run.
      expect(onSubBlockTick).not.toHaveBeenCalled()
    })

    it('suppresses the segment-end fire when remaining < 4 s (collision guard)', () => {
      const onSegmentEndTick = vi.fn()
      const remainingRef = { current: 180 }
      const blockDurRef = { current: 180 }

      renderHook(() =>
        useBlockPacingTicks({
          running: true,
          blockId: 'b1',
          segments: D28_SEGMENTS,
          remainingRef,
          blockDurRef,
          onEndCountdownTick: vi.fn(),
          onSubBlockTick: vi.fn(),
          onSegmentEndTick,
        }),
      )

      // Boundary at elapsed=180 (last segment end), remaining=0 → poll
      // exits early on remaining<=0 anyway. The interesting collision
      // window is elapsed in [176, 180): boundary check would fire
      // segment 3 → bonus, but remaining < 4 must suppress.
      remainingRef.current = 3 // elapsed = 177
      vi.advanceTimersByTime(250)
      // No segment-end fire because remaining < 4.
      expect(onSegmentEndTick).not.toHaveBeenCalled()
    })

    it('falls back to uniform sub-block tick when segments is undefined', () => {
      const onSegmentEndTick = vi.fn()
      const onSubBlockTick = vi.fn()
      const remainingRef = { current: 60 }
      const blockDurRef = { current: 60 }

      renderHook(() =>
        useBlockPacingTicks({
          running: true,
          blockId: 'b1',
          subBlockIntervalSeconds: 30,
          segments: undefined,
          remainingRef,
          blockDurRef,
          onEndCountdownTick: vi.fn(),
          onSubBlockTick,
          onSegmentEndTick,
        }),
      )

      remainingRef.current = 29 // elapsed=31, past 30s boundary
      vi.advanceTimersByTime(250)
      expect(onSubBlockTick).toHaveBeenCalledTimes(1)
      expect(onSegmentEndTick).not.toHaveBeenCalled()
    })

    it('falls back to uniform sub-block tick when segments is an empty array', () => {
      const onSegmentEndTick = vi.fn()
      const onSubBlockTick = vi.fn()
      const remainingRef = { current: 60 }
      const blockDurRef = { current: 60 }

      renderHook(() =>
        useBlockPacingTicks({
          running: true,
          blockId: 'b1',
          subBlockIntervalSeconds: 30,
          segments: [],
          remainingRef,
          blockDurRef,
          onEndCountdownTick: vi.fn(),
          onSubBlockTick,
          onSegmentEndTick,
        }),
      )

      remainingRef.current = 29
      vi.advanceTimersByTime(250)
      expect(onSubBlockTick).toHaveBeenCalledTimes(1)
      expect(onSegmentEndTick).not.toHaveBeenCalled()
    })

    it('reports SEGMENT_INDEX_BONUS via onSegmentIndexChange when all segments complete', () => {
      const onSegmentIndexChange = vi.fn<(i: number) => void>()
      const remainingRef = { current: 180 }
      const blockDurRef = { current: 240 } // overflow: 240 - 180 = 60s of bonus territory

      renderHook(() =>
        useBlockPacingTicks({
          running: true,
          blockId: 'b1',
          segments: D28_SEGMENTS,
          remainingRef,
          blockDurRef,
          onEndCountdownTick: vi.fn(),
          onSubBlockTick: vi.fn(),
          onSegmentEndTick: vi.fn(),
          onSegmentIndexChange,
        }),
      )

      // Drive elapsed to 60 (segment 1), 90 (segment 2), 135 (segment
      // 3), then 180 (bonus territory).
      remainingRef.current = 240 - 60
      vi.advanceTimersByTime(250)
      remainingRef.current = 240 - 90
      vi.advanceTimersByTime(250)
      remainingRef.current = 240 - 135
      vi.advanceTimersByTime(250)
      remainingRef.current = 240 - 181
      vi.advanceTimersByTime(250)

      // Final reported index is the bonus sentinel.
      const lastCall = onSegmentIndexChange.mock.calls.at(-1)
      expect(lastCall).toBeDefined()
      expect(lastCall?.[0]).toBe(SEGMENT_INDEX_BONUS)
    })

    it('resets segment bookkeeping on blockId change', () => {
      const onSegmentEndTick = vi.fn()
      const remainingRef = { current: 180 }
      const blockDurRef = { current: 180 }

      const { rerender } = renderHook(
        ({ blockId }: { blockId: string }) =>
          useBlockPacingTicks({
            running: true,
            blockId,
            segments: D28_SEGMENTS,
            remainingRef,
            blockDurRef,
            onEndCountdownTick: vi.fn(),
            onSubBlockTick: vi.fn(),
            onSegmentEndTick,
          }),
        { initialProps: { blockId: 'b1' } },
      )

      // Advance into segment 1 on b1.
      remainingRef.current = 134
      vi.advanceTimersByTime(250)
      expect(onSegmentEndTick).toHaveBeenCalledTimes(1)

      // Switch to b2 and rewind to early-segment-0 elapsed; the
      // bookkeeping ref must reset so segment 1 boundary fires again.
      rerender({ blockId: 'b2' })
      remainingRef.current = 134 // elapsed = 46 again
      vi.advanceTimersByTime(250)
      expect(onSegmentEndTick).toHaveBeenCalledTimes(2)
    })
  })
})
