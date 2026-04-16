import { useCallback, useEffect, useState } from 'react'
import type { InstallPosture } from '../lib/storageCopy'

// iOS Safari exposes the legacy non-standard `navigator.standalone` boolean
// when the page is loaded from a Home Screen web app. Kept behind a narrow
// type extension rather than a module-level declare so tests can mock it per
// case without polluting the global Navigator surface.
interface NavigatorStandalone {
  standalone?: boolean
}

export function detectInstalled(): boolean {
  if (typeof window === 'undefined') return false
  if (typeof window.matchMedia === 'function') {
    const mm = window.matchMedia('(display-mode: standalone)')
    if (mm.matches) return true
  }
  if (typeof navigator === 'undefined') return false
  const nav = navigator as Navigator & NavigatorStandalone
  return nav.standalone === true
}

export async function readPersisted(): Promise<boolean> {
  if (typeof navigator === 'undefined') return false
  const persistedFn = navigator.storage?.persisted
  if (typeof persistedFn !== 'function') return false
  try {
    return await navigator.storage.persisted()
  } catch {
    return false
  }
}

export function computePosture(
  installed: boolean,
  persisted: boolean,
): InstallPosture {
  if (!installed) return 'browser-tab'
  return persisted ? 'installed-persisted' : 'installed-not-persisted'
}

export interface UseInstallPostureResult {
  posture: InstallPosture
  refresh: () => void
}

// Returns the current iPhone durability posture (D118) and a refresh callback
// that re-reads both install posture and `navigator.storage.persisted()`. Until
// the first async read settles, the hook reports `persisted = false`, which is
// the safer default for copy purposes (State B rather than State C). Call
// `refresh()` after running `persist()` on a real user gesture (V0B-25) so the
// UI can upgrade to the State C secondary line once WebKit grants persistence.
export function useInstallPosture(): UseInstallPostureResult {
  const [installed, setInstalled] = useState<boolean>(() => detectInstalled())
  const [persisted, setPersisted] = useState<boolean>(false)

  const refresh = useCallback(() => {
    setInstalled(detectInstalled())
    void readPersisted().then(setPersisted)
  }, [])

  useEffect(() => {
    let cancelled = false
    void readPersisted().then((value) => {
      if (!cancelled) setPersisted(value)
    })
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') return undefined
    if (typeof window.matchMedia !== 'function') return undefined
    const mm = window.matchMedia('(display-mode: standalone)')
    const handler = (): void => setInstalled(detectInstalled())
    if (typeof mm.addEventListener === 'function') {
      mm.addEventListener('change', handler)
      return () => mm.removeEventListener('change', handler)
    }
    return undefined
  }, [])

  return { posture: computePosture(installed, persisted), refresh }
}
