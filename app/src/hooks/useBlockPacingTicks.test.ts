import { renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useBlockPacingTicks } from './useBlockPacingTicks'

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
})
