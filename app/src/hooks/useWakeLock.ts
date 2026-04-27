import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  hasActiveScreenWakeLock,
  releaseScreenWakeLock,
  requestScreenWakeLock,
  shouldHoldScreenWakeLock,
  subscribeScreenWakeLock,
} from '../lib/screenWakeLock'

export function useWakeLock() {
  const [isLocked, setIsLocked] = useState(hasActiveScreenWakeLock)
  const mountedRef = useRef(true)

  const syncLockState = useCallback(() => {
    if (mountedRef.current) {
      setIsLocked(hasActiveScreenWakeLock())
    }
  }, [])

  const request = useCallback(async () => {
    await requestScreenWakeLock()
    syncLockState()
  }, [syncLockState])

  const release = useCallback(async () => {
    await releaseScreenWakeLock()
    syncLockState()
  }, [syncLockState])

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && shouldHoldScreenWakeLock()) {
        void requestScreenWakeLock()
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [])

  useEffect(() => subscribeScreenWakeLock(syncLockState), [syncLockState])

  useEffect(() => {
    return () => {
      mountedRef.current = false
      void releaseScreenWakeLock()
    }
  }, [])

  return useMemo(() => ({ isLocked, request, release }), [isLocked, request, release])
}
