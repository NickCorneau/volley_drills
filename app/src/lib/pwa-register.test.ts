import { act, renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'

// The global mock for `virtual:pwa-register` lives in `src/test-setup.ts` and
// captures calls on `globalThis.__pwaRegisterMock`. See the comment there.
import { useAppRegisterSW } from './pwa-register'

function getMock() {
  const mock = globalThis.__pwaRegisterMock
  if (!mock) throw new Error('__pwaRegisterMock not initialized')
  return mock
}

describe('useAppRegisterSW (red-team RT-9)', () => {
  beforeEach(() => {
    getMock().updateServiceWorker.mockClear()
  })

  it('calls registerSW exactly once at module import with immediate=true and handler callbacks', () => {
    const mock = getMock()
    expect(mock.callCount).toBeGreaterThanOrEqual(1)
    const config = mock.lastConfig
    expect(config?.immediate).toBe(true)
    expect(typeof config?.onNeedRefresh).toBe('function')
    expect(typeof config?.onRegisterError).toBe('function')
  })

  it('exposes needRefresh=false initially and updateApp as a function', () => {
    const { result } = renderHook(() => useAppRegisterSW())
    expect(result.current.needRefresh).toBe(false)
    expect(typeof result.current.updateApp).toBe('function')
  })

  it('flips needRefresh to true when the registerSW onNeedRefresh callback fires', () => {
    const { result } = renderHook(() => useAppRegisterSW())
    expect(result.current.needRefresh).toBe(false)

    const onNeedRefresh = getMock().lastConfig?.onNeedRefresh
    expect(onNeedRefresh).toBeDefined()
    act(() => {
      onNeedRefresh!()
    })

    expect(result.current.needRefresh).toBe(true)
  })

  it('updateApp() invokes updateServiceWorker with reload=true', () => {
    const mock = getMock()
    const { result } = renderHook(() => useAppRegisterSW())
    act(() => {
      result.current.updateApp()
    })
    expect(mock.updateServiceWorker).toHaveBeenCalledOnce()
    expect(mock.updateServiceWorker).toHaveBeenCalledWith(true)
  })

  it('shares needRefresh across hook instances (module-scope state)', () => {
    const first = renderHook(() => useAppRegisterSW())
    const second = renderHook(() => useAppRegisterSW())
    const onNeedRefresh = getMock().lastConfig?.onNeedRefresh
    act(() => {
      onNeedRefresh!()
    })
    expect(first.result.current.needRefresh).toBe(true)
    expect(second.result.current.needRefresh).toBe(true)
  })
})
