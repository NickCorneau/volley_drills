import { act, renderHook, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { computePosture, useInstallPosture } from './useInstallPosture'

describe('computePosture', () => {
  it('returns browser-tab when not installed, regardless of persisted', () => {
    expect(computePosture(false, false)).toBe('browser-tab')
    expect(computePosture(false, true)).toBe('browser-tab')
  })

  it('distinguishes installed-not-persisted from installed-persisted', () => {
    expect(computePosture(true, false)).toBe('installed-not-persisted')
    expect(computePosture(true, true)).toBe('installed-persisted')
  })
})

interface MockMediaQueryList {
  matches: boolean
  media: string
  onchange: null
  addEventListener: ReturnType<typeof vi.fn>
  removeEventListener: ReturnType<typeof vi.fn>
  addListener: ReturnType<typeof vi.fn>
  removeListener: ReturnType<typeof vi.fn>
  dispatchEvent: ReturnType<typeof vi.fn>
}

function installMatchMedia(matches: boolean): void {
  const mql: MockMediaQueryList = {
    matches,
    media: '(display-mode: standalone)',
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }
  Object.defineProperty(window, 'matchMedia', {
    configurable: true,
    writable: true,
    value: vi.fn().mockReturnValue(mql),
  })
}

function installStorage(persistedFn: ReturnType<typeof vi.fn>): void {
  Object.defineProperty(navigator, 'storage', {
    configurable: true,
    value: { persisted: persistedFn, persist: vi.fn() },
  })
}

describe('useInstallPosture', () => {
  let originalMatchMedia: typeof window.matchMedia | undefined
  let originalStorage: StorageManager | undefined

  beforeEach(() => {
    originalMatchMedia = window.matchMedia
    originalStorage = navigator.storage
  })

  afterEach(() => {
    if (originalMatchMedia) {
      Object.defineProperty(window, 'matchMedia', {
        configurable: true,
        writable: true,
        value: originalMatchMedia,
      })
    } else {
      // jsdom ships without matchMedia; remove the stub to restore that state.
      Reflect.deleteProperty(window, 'matchMedia')
    }
    Object.defineProperty(navigator, 'storage', {
      configurable: true,
      value: originalStorage,
    })
  })

  it('reports browser-tab when matchMedia returns false', async () => {
    installMatchMedia(false)
    installStorage(vi.fn().mockResolvedValue(false))
    const { result } = renderHook(() => useInstallPosture())
    await waitFor(() => {
      expect(result.current.posture).toBe('browser-tab')
    })
  })

  it('reports installed-not-persisted when standalone and persisted=false', async () => {
    installMatchMedia(true)
    installStorage(vi.fn().mockResolvedValue(false))
    const { result } = renderHook(() => useInstallPosture())
    await waitFor(() => {
      expect(result.current.posture).toBe('installed-not-persisted')
    })
  })

  it('reports installed-persisted when standalone and persisted=true', async () => {
    installMatchMedia(true)
    installStorage(vi.fn().mockResolvedValue(true))
    const { result } = renderHook(() => useInstallPosture())
    await waitFor(() => {
      expect(result.current.posture).toBe('installed-persisted')
    })
  })

  it('defaults to browser-tab when navigator.storage is unavailable', async () => {
    installMatchMedia(false)
    Object.defineProperty(navigator, 'storage', {
      configurable: true,
      value: undefined,
    })
    const { result } = renderHook(() => useInstallPosture())
    await waitFor(() => {
      expect(result.current.posture).toBe('browser-tab')
    })
  })

  it('refresh() re-reads persisted() so copy can upgrade after persist()', async () => {
    installMatchMedia(true)
    const persistedFn = vi.fn().mockResolvedValue(false)
    installStorage(persistedFn)

    const { result } = renderHook(() => useInstallPosture())
    await waitFor(() => {
      expect(result.current.posture).toBe('installed-not-persisted')
    })

    persistedFn.mockResolvedValue(true)
    await act(async () => {
      result.current.refresh()
    })
    await waitFor(() => {
      expect(result.current.posture).toBe('installed-persisted')
    })
  })
})
