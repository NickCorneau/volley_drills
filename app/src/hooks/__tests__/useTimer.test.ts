import { renderHook, act } from '@testing-library/react'
import { useTimer } from '../useTimer'

beforeEach(() => {
  vi.useFakeTimers()
})

afterEach(() => {
  vi.useRealTimers()
})

describe('useTimer', () => {
  it('initializes with the given duration', () => {
    const onComplete = vi.fn()
    const { result } = renderHook(() => useTimer(60, onComplete))
    expect(result.current.remainingSeconds).toBe(60)
    expect(result.current.isRunning).toBe(false)
  })

  it('starts and tracks running state', () => {
    const onComplete = vi.fn()
    const { result } = renderHook(() => useTimer(60, onComplete))

    act(() => {
      result.current.start()
    })

    expect(result.current.isRunning).toBe(true)
  })

  it('pauses and returns accumulated elapsed time', () => {
    const onComplete = vi.fn()
    const { result } = renderHook(() => useTimer(60, onComplete))

    act(() => {
      result.current.start()
    })

    let elapsed: number = 0
    act(() => {
      vi.advanceTimersByTime(50)
      elapsed = result.current.pause()
    })

    expect(result.current.isRunning).toBe(false)
    expect(elapsed).toBeGreaterThan(0)
  })

  it('resumes after pause', () => {
    const onComplete = vi.fn()
    const { result } = renderHook(() => useTimer(60, onComplete))

    act(() => {
      result.current.start()
    })

    act(() => {
      result.current.pause()
    })

    act(() => {
      result.current.resume()
    })

    expect(result.current.isRunning).toBe(true)
  })

  it('resets to a new duration', () => {
    const onComplete = vi.fn()
    const { result } = renderHook(() => useTimer(60, onComplete))

    act(() => {
      result.current.start()
    })

    act(() => {
      result.current.reset(30)
    })

    expect(result.current.isRunning).toBe(false)
    expect(result.current.remainingSeconds).toBe(30)
  })

  it('resume() is idempotent - a second call while already running does not lose elapsed time (red-team adversarial finding 2026-04-27)', () => {
    // Bug shape: the previous `resume` always wrote
    // `startTsRef.current = performance.now()` and scheduled a fresh
    // RAF, even when the timer was already running. A double-tap of
    // Resume - or a React StrictMode double-invoke - therefore reset
    // the start timestamp WITHOUT first banking the time accumulated
    // since the prior resume call, leaking ~(T2 - T1)s of timer credit.
    // The fixed `resume` early-returns when already running so a second
    // call in the same tick can never reset `startTsRef`.
    const onComplete = vi.fn()
    const { result } = renderHook(() => useTimer(60, onComplete))

    act(() => {
      result.current.start()
    })

    // Run for 1s, pause to bank 1s into accumulatedRef.
    act(() => {
      vi.advanceTimersByTime(1000)
      result.current.pause()
    })

    // Resume once, run 500ms, then double-tap Resume mid-run.
    act(() => {
      result.current.resume()
    })
    act(() => {
      vi.advanceTimersByTime(500)
      result.current.resume() // would have leaked 500ms before fix
      vi.advanceTimersByTime(500)
    })

    let elapsed = 0
    act(() => {
      elapsed = result.current.pause()
    })

    // Total intended elapsed: 1s (first run) + 500ms + 500ms = 2s.
    // Pre-fix this came out at ~1.5s because the second resume reset
    // startTs without banking the intervening 500ms.
    expect(elapsed).toBeGreaterThanOrEqual(1.95)
    expect(elapsed).toBeLessThanOrEqual(2.05)
  })

  it('throttles visible countdown updates below animation-frame rate', () => {
    const observed: number[] = []
    const onComplete = vi.fn()
    const { result } = renderHook(() => {
      const timer = useTimer(60, onComplete)
      observed.push(timer.remainingSeconds)
      return timer
    })

    act(() => {
      result.current.start()
    })
    const renderCountAfterStart = observed.length

    act(() => {
      vi.advanceTimersByTime(100)
    })

    expect(observed.length - renderCountAfterStart).toBeLessThanOrEqual(1)
  })
})
