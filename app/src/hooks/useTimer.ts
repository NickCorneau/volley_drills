import { useCallback, useEffect, useRef, useState } from 'react'

const VISIBLE_UPDATE_INTERVAL_SECONDS = 0.25

export function useTimer(durationSeconds: number, onComplete: () => void) {
  const [remainingSeconds, setRemainingSeconds] = useState(durationSeconds)
  const [isRunning, setIsRunning] = useState(false)

  const rafRef = useRef(0)
  const startTsRef = useRef(0)
  const accumulatedRef = useRef(0)
  const durationRef = useRef(durationSeconds)
  const lastPublishedRemainingRef = useRef(durationSeconds)
  const onCompleteRef = useRef(onComplete)

  useEffect(() => {
    onCompleteRef.current = onComplete
  })

  const tickRef = useRef<(() => void) | undefined>(undefined)

  const publishRemaining = useCallback((remaining: number, force = false) => {
    const last = lastPublishedRemainingRef.current
    if (force || Math.abs(last - remaining) >= VISIBLE_UPDATE_INTERVAL_SECONDS) {
      lastPublishedRemainingRef.current = remaining
      setRemainingSeconds(remaining)
    }
  }, [])

  useEffect(() => {
    tickRef.current = () => {
      const now = performance.now()
      const elapsed = accumulatedRef.current + (now - startTsRef.current) / 1000
      const remaining = Math.max(0, durationRef.current - elapsed)
      publishRemaining(remaining)

      if (remaining <= 0) {
        publishRemaining(0, true)
        setIsRunning(false)
        onCompleteRef.current()
        return
      }

      rafRef.current = requestAnimationFrame(tickRef.current!)
    }
  }, [publishRemaining])

  const start = useCallback(
    (overrideDuration?: number) => {
      cancelAnimationFrame(rafRef.current)
      if (overrideDuration !== undefined) {
        durationRef.current = overrideDuration
      }
      accumulatedRef.current = 0
      startTsRef.current = performance.now()
      publishRemaining(durationRef.current, true)
      setIsRunning(true)
      rafRef.current = requestAnimationFrame(() => tickRef.current?.())
    },
    [publishRemaining],
  )

  const pause = useCallback((): number => {
    cancelAnimationFrame(rafRef.current)
    const now = performance.now()
    accumulatedRef.current += (now - startTsRef.current) / 1000
    publishRemaining(Math.max(0, durationRef.current - accumulatedRef.current), true)
    setIsRunning(false)
    return accumulatedRef.current
  }, [publishRemaining])

  const resume = useCallback(() => {
    startTsRef.current = performance.now()
    setIsRunning(true)
    rafRef.current = requestAnimationFrame(() => tickRef.current?.())
  }, [])

  const reset = useCallback(
    (newDuration?: number) => {
      cancelAnimationFrame(rafRef.current)
      if (newDuration !== undefined) {
        durationRef.current = newDuration
      }
      accumulatedRef.current = 0
      setIsRunning(false)
      publishRemaining(durationRef.current, true)
    },
    [publishRemaining],
  )

  useEffect(() => {
    return () => cancelAnimationFrame(rafRef.current)
  }, [])

  const adjustRemaining = useCallback(
    (newRemaining: number) => {
      const now = performance.now()
      const currentElapsed = accumulatedRef.current + (now - startTsRef.current) / 1000
      const currentRemaining = Math.max(0, durationRef.current - currentElapsed)
      const diff = currentRemaining - newRemaining
      if (diff > 0) {
        accumulatedRef.current += diff
        publishRemaining(newRemaining, true)
      }
    },
    [publishRemaining],
  )

  return { remainingSeconds, isRunning, start, pause, resume, reset, adjustRemaining }
}
