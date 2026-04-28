import 'fake-indexeddb/auto'
import { IDBFactory } from 'fake-indexeddb'
import '@testing-library/jest-dom/vitest'
import { afterEach, beforeEach, vi } from 'vitest'
import { cleanup } from '@testing-library/react'

// 2026-04-26 pre-D91 editorial polish (`F14`): stub the build-id
// globals that Vite's `define` plugin injects at production /
// preview / dev build time. The unit test runtime does not go
// through Vite's bundler step for these constants, so without
// these stubs `lib/buildInfo.ts` would fall through to its
// `'dev'` / `'unknown'` defaults. Pinning to deterministic
// `'test'` / `'test'` values lets a future Settings test assert
// on the rendered string without snapshot drift across machines.
;(globalThis as Record<string, unknown>).__VOLLEYCRAFT_BUILD_VERSION__ = 'test'
;(globalThis as Record<string, unknown>).__VOLLEYCRAFT_BUILD_DATE__ = 'test'

// jsdom does not ship `ResizeObserver`. The `ScreenShell.Body` component
// uses it to keep its top/bottom fade gradients in sync with content
// reflow — construction alone throws `ReferenceError: ResizeObserver is
// not defined` in jsdom, which would take down every RTL test that
// renders a screen. Install a no-op stub that satisfies the contract
// (observe / unobserve / disconnect). The scroll-edge behavior itself
// is exercised in the component's browser preview, not the unit layer.
if (typeof globalThis.ResizeObserver === 'undefined') {
  class NoopResizeObserver {
    observe(): void {}
    unobserve(): void {}
    disconnect(): void {}
  }
  Object.defineProperty(globalThis, 'ResizeObserver', {
    value: NoopResizeObserver,
    configurable: true,
    writable: true,
  })
}

// `virtual:pwa-register` is a Vite virtual module and is unresolvable in
// tests that import `lib/pwa-register` (directly or transitively). Mock it
// globally and expose the captured config + updateServiceWorker spy on
// `globalThis.__pwaRegisterMock` so tests that care about registration
// behavior can inspect it without re-mocking.
//
// The mock state and `vi.mock(...)` are BOTH wrapped in `vi.hoisted` so they
// run before any static imports (including our own `./lib/pwa-register` which
// is imported transitively via the resets below). Without hoisting, the mock
// factory is called while `globalThis.__pwaRegisterMock` is still undefined.
interface PwaRegisterMock {
  lastConfig: {
    immediate?: boolean
    onNeedRefresh?: () => void
    onRegisterError?: (error: unknown) => void
  } | null
  updateServiceWorker: ReturnType<typeof vi.fn>
  callCount: number
}

declare global {
  var __pwaRegisterMock: PwaRegisterMock | undefined
}

vi.hoisted(() => {
  globalThis.__pwaRegisterMock = {
    lastConfig: null,
    updateServiceWorker: vi.fn(async () => {}),
    callCount: 0,
  }
})

vi.mock('virtual:pwa-register', () => ({
  registerSW: vi.fn((config) => {
    const mock = globalThis.__pwaRegisterMock!
    mock.lastConfig = config
    mock.callCount += 1
    return mock.updateServiceWorker
  }),
}))

import { resetNeedRefreshForTesting } from './lib/pwa-register'
import { resetSchemaBlockedForTesting } from './lib/schema-blocked'

// Per-test IndexedDB isolation: install a fresh IDBFactory before every test so
// Dexie state cannot leak across files. See docs/research/minimum-viable-test-stack.md.
beforeEach(() => {
  Object.defineProperty(globalThis, 'indexedDB', {
    value: new IDBFactory(),
    configurable: true,
    writable: true,
  })
  resetSchemaBlockedForTesting()
  resetNeedRefreshForTesting()
})

afterEach(() => {
  cleanup()
})
