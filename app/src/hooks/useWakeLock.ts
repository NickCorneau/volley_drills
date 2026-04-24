import { useCallback, useEffect, useRef, useState } from 'react'

export function useWakeLock() {
  const [isLocked, setIsLocked] = useState(false)
  const sentinelRef = useRef<WakeLockSentinel | null>(null)
  // `wantsLockRef` distinguishes "the browser released the lock while
  // the session is still running" from "the app intentionally released
  // it because the timer paused or the screen unmounted." The former
  // should re-acquire on visibility return; the latter should stay
  // released.
  const wantsLockRef = useRef(false)
  const mountedRef = useRef(true)

  const handleRelease = useCallback(() => {
    sentinelRef.current = null
    if (mountedRef.current) {
      setIsLocked(false)
    }
  }, [])

  const request = useCallback(async () => {
    wantsLockRef.current = true
    if (!('wakeLock' in navigator)) return
    if (document.visibilityState !== 'visible') return
    if (sentinelRef.current && !sentinelRef.current.released) return

    try {
      sentinelRef.current = await navigator.wakeLock.request('screen')
      sentinelRef.current.addEventListener('release', handleRelease)
      if (mountedRef.current) {
        setIsLocked(true)
      }
    } catch {
      /* Low battery, tab hidden, or API unavailable */
    }
  }, [handleRelease])

  const release = useCallback(async () => {
    wantsLockRef.current = false
    const sentinel = sentinelRef.current
    try {
      sentinel?.removeEventListener('release', handleRelease)
      await sentinel?.release()
      sentinelRef.current = null
      if (mountedRef.current) {
        setIsLocked(false)
      }
    } catch {
      /* Already released */
    }
  }, [handleRelease])

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && wantsLockRef.current) {
        void request()
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [request])

  useEffect(() => {
    return () => {
      mountedRef.current = false
      sentinelRef.current?.removeEventListener('release', handleRelease)
      void sentinelRef.current?.release()
      sentinelRef.current = null
    }
  }, [handleRelease])

  return { isLocked, request, release }
}
