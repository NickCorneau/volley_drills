import { useCallback, useEffect, useRef, useState } from 'react'

export function useTimer(durationSeconds: number, onComplete: () => void) {
  const [remainingSeconds, setRemainingSeconds] = useState(durationSeconds)
  const [isRunning, setIsRunning] = useState(false)

  const rafRef = useRef(0)
  const startTsRef = useRef(0)
  const accumulatedRef = useRef(0)
  const durationRef = useRef(durationSeconds)
  const onCompleteRef = useRef(onComplete)

  useEffect(() => {
    onCompleteRef.current = onComplete
  })

  const tickRef = useRef<(() => void) | undefined>(undefined)

  useEffect(() => {
    tickRef.current = () => {
      const now = performance.now()
      const elapsed = accumulatedRef.current + (now - startTsRef.current) / 1000
      const remaining = Math.max(0, durationRef.current - elapsed)
      setRemainingSeconds(remaining)

      if (remaining <= 0) {
        setIsRunning(false)
        onCompleteRef.current()
        return
      }

      rafRef.current = requestAnimationFrame(tickRef.current!)
    }
  }, [])

  const start = useCallback((overrideDuration?: number) => {
    cancelAnimationFrame(rafRef.current)
    if (overrideDuration !== undefined) {
      durationRef.current = overrideDuration
    }
    accumulatedRef.current = 0
    startTsRef.current = performance.now()
    setRemainingSeconds(durationRef.current)
    setIsRunning(true)
    rafRef.current = requestAnimationFrame(() => tickRef.current?.())
  }, [])

  const pause = useCallback((): number => {
    cancelAnimationFrame(rafRef.current)
    const now = performance.now()
    accumulatedRef.current += (now - startTsRef.current) / 1000
    setIsRunning(false)
    return accumulatedRef.current
  }, [])

  const resume = useCallback(() => {
    startTsRef.current = performance.now()
    setIsRunning(true)
    rafRef.current = requestAnimationFrame(() => tickRef.current?.())
  }, [])

  const reset = useCallback((newDuration?: number) => {
    cancelAnimationFrame(rafRef.current)
    if (newDuration !== undefined) {
      durationRef.current = newDuration
    }
    accumulatedRef.current = 0
    setIsRunning(false)
    setRemainingSeconds(durationRef.current)
  }, [])

  useEffect(() => {
    return () => cancelAnimationFrame(rafRef.current)
  }, [])

  return { remainingSeconds, isRunning, start, pause, resume, reset }
}
