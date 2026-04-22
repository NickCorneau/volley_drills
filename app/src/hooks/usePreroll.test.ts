import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { usePreroll } from './usePreroll'

beforeEach(() => {
  vi.useFakeTimers()
})

afterEach(() => {
  vi.useRealTimers()
  vi.restoreAllMocks()
})

describe('usePreroll', () => {
  it('starts with count === null', () => {
    const { result } = renderHook(() =>
      usePreroll({ onTick: vi.fn(), onComplete: vi.fn() }),
    )
    expect(result.current.count).toBeNull()
  })

  it('fires a tick immediately on start and counts down 3 → 2 → 1 → 0', () => {
    const onTick = vi.fn()
    const onComplete = vi.fn()
    const { result } = renderHook(() =>
      usePreroll({ onTick, onComplete }),
    )

    act(() => result.current.start())
    expect(result.current.count).toBe(3)
    expect(onTick).toHaveBeenCalledTimes(1)

    act(() => {
      vi.advanceTimersByTime(1000)
    })
    expect(result.current.count).toBe(2)
    expect(onTick).toHaveBeenCalledTimes(2)

    act(() => {
      vi.advanceTimersByTime(1000)
    })
    expect(result.current.count).toBe(1)
    expect(onTick).toHaveBeenCalledTimes(3)

    act(() => {
      vi.advanceTimersByTime(1000)
    })
    expect(result.current.count).toBeNull()
    // The "go" tick fires on completion for a consistent sonic ramp
    expect(onTick).toHaveBeenCalledTimes(4)
    expect(onComplete).toHaveBeenCalledTimes(1)
  })

  it('cancel stops the countdown and clears state', () => {
    const onTick = vi.fn()
    const onComplete = vi.fn()
    const { result } = renderHook(() =>
      usePreroll({ onTick, onComplete }),
    )

    act(() => result.current.start())
    act(() => {
      vi.advanceTimersByTime(1000)
    })
    expect(result.current.count).toBe(2)

    act(() => result.current.cancel())
    expect(result.current.count).toBeNull()

    act(() => {
      vi.advanceTimersByTime(5000)
    })
    expect(onComplete).not.toHaveBeenCalled()
    // Only the initial tick + one interval tick before cancel
    expect(onTick).toHaveBeenCalledTimes(2)
  })

  it('clears the interval on unmount', () => {
    const onComplete = vi.fn()
    const { result, unmount } = renderHook(() =>
      usePreroll({ onTick: vi.fn(), onComplete }),
    )
    act(() => result.current.start())
    unmount()
    vi.advanceTimersByTime(5000)
    expect(onComplete).not.toHaveBeenCalled()
  })

  it('restarting while active resets the countdown', () => {
    const onTick = vi.fn()
    const onComplete = vi.fn()
    const { result } = renderHook(() =>
      usePreroll({ onTick, onComplete }),
    )

    act(() => result.current.start())
    act(() => {
      vi.advanceTimersByTime(1000)
    })
    expect(result.current.count).toBe(2)

    act(() => result.current.start())
    expect(result.current.count).toBe(3)

    act(() => {
      vi.advanceTimersByTime(3000)
    })
    expect(onComplete).toHaveBeenCalledTimes(1)
  })
})
