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
})
