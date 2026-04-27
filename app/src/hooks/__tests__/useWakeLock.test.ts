import { act, renderHook, waitFor } from '@testing-library/react'
import { __resetScreenWakeLockForTesting } from '../../lib/screenWakeLock'
import { useWakeLock } from '../useWakeLock'

type ReleaseHandler = EventListener

class MockWakeLockSentinel {
  released = false
  private releaseHandlers = new Set<ReleaseHandler>()

  addEventListener(type: string, handler: EventListenerOrEventListenerObject) {
    if (type !== 'release') return
    const fn =
      typeof handler === 'function'
        ? handler
        : (event: Event) => handler.handleEvent(event)
    this.releaseHandlers.add(fn)
  }

  removeEventListener(type: string, handler: EventListenerOrEventListenerObject) {
    if (type !== 'release') return
    const fn =
      typeof handler === 'function'
        ? handler
        : (event: Event) => handler.handleEvent(event)
    this.releaseHandlers.delete(fn)
  }

  async release() {
    if (this.released) return
    this.released = true
    this.releaseHandlers.forEach((handler) => handler(new Event('release')))
  }

  simulateBrowserRelease() {
    this.released = true
    this.releaseHandlers.forEach((handler) => handler(new Event('release')))
  }
}

function setVisibilityState(value: DocumentVisibilityState) {
  Object.defineProperty(document, 'visibilityState', {
    configurable: true,
    value,
  })
}

function installWakeLockMock() {
  const sentinels: MockWakeLockSentinel[] = []
  const request = vi.fn(async () => {
    const sentinel = new MockWakeLockSentinel()
    sentinels.push(sentinel)
    return sentinel
  })
  Object.defineProperty(navigator, 'wakeLock', {
    configurable: true,
    value: { request },
  })
  return { request, sentinels }
}

describe('useWakeLock', () => {
  beforeEach(() => {
    setVisibilityState('visible')
  })

  afterEach(() => {
    __resetScreenWakeLockForTesting()
    vi.restoreAllMocks()
    Reflect.deleteProperty(navigator, 'wakeLock')
  })

  it('no-ops when the Screen Wake Lock API is unavailable', async () => {
    Reflect.deleteProperty(navigator, 'wakeLock')
    const { result } = renderHook(() => useWakeLock())

    await act(async () => {
      await result.current.request()
    })

    expect(result.current.isLocked).toBe(false)
  })

  it('re-acquires the screen wake lock on visible return after the browser releases it', async () => {
    const { request, sentinels } = installWakeLockMock()
    const { result } = renderHook(() => useWakeLock())

    await act(async () => {
      await result.current.request()
    })
    expect(request).toHaveBeenCalledTimes(1)
    expect(result.current.isLocked).toBe(true)

    act(() => {
      sentinels[0].simulateBrowserRelease()
    })
    expect(result.current.isLocked).toBe(false)

    act(() => {
      setVisibilityState('hidden')
      document.dispatchEvent(new Event('visibilitychange'))
    })
    expect(request).toHaveBeenCalledTimes(1)

    act(() => {
      setVisibilityState('visible')
      document.dispatchEvent(new Event('visibilitychange'))
    })

    await waitFor(() => {
      expect(request).toHaveBeenCalledTimes(2)
      expect(result.current.isLocked).toBe(true)
    })
  })

  it('does not re-acquire after explicit release', async () => {
    const { request, sentinels } = installWakeLockMock()
    const { result } = renderHook(() => useWakeLock())

    await act(async () => {
      await result.current.request()
    })
    await act(async () => {
      await result.current.release()
    })
    expect(result.current.isLocked).toBe(false)

    act(() => {
      sentinels[0].simulateBrowserRelease()
      setVisibilityState('visible')
      document.dispatchEvent(new Event('visibilitychange'))
    })

    expect(request).toHaveBeenCalledTimes(1)
  })

  it('releases the wake lock on unmount', async () => {
    const { sentinels } = installWakeLockMock()
    const { result, unmount } = renderHook(() => useWakeLock())

    await act(async () => {
      await result.current.request()
    })
    unmount()

    await waitFor(() => expect(sentinels[0].released).toBe(true))
  })
})
