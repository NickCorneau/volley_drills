import { useSyncExternalStore } from 'react'
import { registerSW } from 'virtual:pwa-register'

// V0B-20: Register the service worker exactly once at module load so SW
// registration is route-independent. The prior implementation called
// `useRegisterSW` inside HomeScreen/CompleteScreen only, which meant a user who
// deep-linked to `/run` or `/review` never registered the SW on that session
// (no offline cache, no update detection). Registering once at module scope
// fixes that and shares a single `needRefresh` flag across all screens, so the
// state survives navigation between Home and Complete.
//
// Importing this module anywhere in the React tree is enough — see
// `src/main.tsx` for the side-effect import.

type Listener = () => void

let needRefresh = false
const listeners = new Set<Listener>()

function setNeedRefresh(value: boolean): void {
  if (needRefresh === value) return
  needRefresh = value
  for (const fn of listeners) {
    try {
      fn()
    } catch (error) {
      console.warn('pwa-register listener failed', error)
    }
  }
}

// `registerSW` from vite-plugin-pwa is safe to call unconditionally — it
// internally checks for `'serviceWorker' in navigator` and becomes a no-op
// when the API is unavailable. We keep this call at module scope so SW
// registration happens on every page load regardless of which route the user
// lands on (see the Phase B reliability review).
const updateServiceWorker: (reloadPage?: boolean) => Promise<void> = registerSW(
  {
    immediate: true,
    onNeedRefresh() {
      setNeedRefresh(true)
    },
    onRegisterError(error) {
      console.warn('SW registration failed', error)
    },
  },
)

function subscribe(cb: Listener): () => void {
  listeners.add(cb)
  return () => {
    listeners.delete(cb)
  }
}

function getSnapshot(): boolean {
  return needRefresh
}

export function useAppRegisterSW(): {
  needRefresh: boolean
  updateApp: () => void
} {
  const state = useSyncExternalStore(subscribe, getSnapshot, getSnapshot)
  return {
    needRefresh: state,
    updateApp: () => {
      void updateServiceWorker(true)
    },
  }
}

// Test-only: reset the module-level `needRefresh` flag so tests running in the
// same vitest worker don't leak the flipped-true state across files. Production
// code must not call this.
export function resetNeedRefreshForTesting(): void {
  needRefresh = false
}
