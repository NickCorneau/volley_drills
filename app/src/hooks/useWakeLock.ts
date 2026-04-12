import { useCallback, useEffect, useRef, useState } from 'react';

export function useWakeLock() {
  const [isLocked, setIsLocked] = useState(false);
  const sentinelRef = useRef<WakeLockSentinel | null>(null);

  const request = useCallback(async () => {
    if (!('wakeLock' in navigator)) return;
    try {
      sentinelRef.current = await navigator.wakeLock.request('screen');
      sentinelRef.current.addEventListener('release', () =>
        setIsLocked(false),
      );
      setIsLocked(true);
    } catch {
      /* Low battery, tab hidden, or API unavailable */
    }
  }, []);

  const release = useCallback(async () => {
    try {
      await sentinelRef.current?.release();
      sentinelRef.current = null;
      setIsLocked(false);
    } catch {
      /* Already released */
    }
  }, []);

  useEffect(() => {
    return () => {
      sentinelRef.current?.release();
    };
  }, []);

  return { isLocked, request, release };
}
