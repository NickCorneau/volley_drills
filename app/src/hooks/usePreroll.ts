import { useCallback, useEffect, useRef, useState } from 'react'

export interface UsePrerollOptions {
  /** Fires on each countdown tick, including the initial "3" and the final "go". */
  onTick: () => void
  /** Fires once the countdown reaches zero. */
  onComplete: () => void
  /** Number to start counting from. Defaults to 3. */
  from?: number
}

export interface UsePrerollResult {
  /** Current visible count (3, 2, 1) or `null` when not running. */
  count: number | null
  /** Begin (or restart) the countdown. */
  start: () => void
  /** Abort an in-flight countdown without firing `onComplete`. */
  cancel: () => void
}

/**
 * Three-second preroll countdown used by `RunScreen` to give the
 * tester an audible + visible "get ready" ramp before a block starts.
 *
 * - Fires `onTick` synchronously on `start()` so the audio cue matches
 *   the initial visual.
 * - Fires `onTick` on each 1 s interval (count 2, count 1, and the
 *   final "go" tick at zero) for a consistent sonic ramp.
 * - Calls `onComplete` exactly once when the countdown reaches zero.
 * - `cancel()` aborts without calling `onComplete`.
 * - `start()` while running restarts from `from`.
 */
export function usePreroll({ onTick, onComplete, from = 3 }: UsePrerollOptions): UsePrerollResult {
  const [count, setCount] = useState<number | null>(null)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const onTickRef = useRef(onTick)
  const onCompleteRef = useRef(onComplete)
  useEffect(() => {
    onTickRef.current = onTick
    onCompleteRef.current = onComplete
  })

  const clear = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
  }, [])

  const cancel = useCallback(() => {
    clear()
    setCount(null)
  }, [clear])

  const start = useCallback(() => {
    clear()
    let n = from
    setCount(n)
    onTickRef.current()
    timerRef.current = setInterval(() => {
      n -= 1
      if (n <= 0) {
        clear()
        setCount(null)
        onTickRef.current()
        onCompleteRef.current()
        return
      }
      setCount(n)
      onTickRef.current()
    }, 1000)
  }, [clear, from])

  useEffect(() => {
    return () => clear()
  }, [clear])

  return { count, start, cancel }
}
