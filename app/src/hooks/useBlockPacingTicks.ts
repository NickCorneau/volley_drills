import { useEffect, useRef } from 'react'

/**
 * Audio-tick pacing loop for the active run block.
 *
 * Extracted from `RunScreen` so the poll bookkeeping is isolated and
 * independently testable. Two responsibilities, both driven off the
 * continuously-updating `remainingRef` the RAF tick loop maintains:
 *
 *  1. **Block-end 3-sec countdown.** When `ceil(remaining)` transitions
 *     through 3 → 2 → 1, fires `onEndCountdownTick` once per second.
 *     The block-end beep itself still fires from the caller at
 *     remaining = 0, so the audible shape becomes tick-tick-tick-BEEP.
 *
 *  2. **Sub-block pacing tick.** When a drill variant declares
 *     `subBlockIntervalSeconds`, fires `onSubBlockTick` at each
 *     multiple of that interval. Suppressed when `remaining < 4` so
 *     the last tick never collides with the block-end countdown +
 *     beep on drills whose interval divides block length evenly.
 *
 * Ref-based bookkeeping (fired countdown seconds; last-fired
 * sub-block index) resets on `blockId` change so a new block starts
 * with a clean set.
 */
export interface UseBlockPacingTicksOptions {
  running: boolean
  blockId: string | null | undefined
  subBlockIntervalSeconds?: number
  remainingRef: { current: number }
  blockDurRef: { current: number }
  onEndCountdownTick: () => void
  onSubBlockTick: () => void
  /** Poll interval in ms. Defaults to 250. */
  pollIntervalMs?: number
}

export function useBlockPacingTicks({
  running,
  blockId,
  subBlockIntervalSeconds,
  remainingRef,
  blockDurRef,
  onEndCountdownTick,
  onSubBlockTick,
  pollIntervalMs = 250,
}: UseBlockPacingTicksOptions): void {
  const firedEndCountdownSecondsRef = useRef<Set<number>>(new Set())
  const lastSubBlockTickIndexRef = useRef(0)

  // Reset bookkeeping when the active block id changes.
  useEffect(() => {
    firedEndCountdownSecondsRef.current = new Set()
    lastSubBlockTickIndexRef.current = 0
  }, [blockId])

  // Callbacks through refs so changing handler identity doesn't recycle
  // the interval mid-block.
  const onEndRef = useRef(onEndCountdownTick)
  const onSubRef = useRef(onSubBlockTick)
  useEffect(() => {
    onEndRef.current = onEndCountdownTick
    onSubRef.current = onSubBlockTick
  })

  useEffect(() => {
    if (!running || !blockId) return
    const interval = setInterval(() => {
      const remaining = remainingRef.current
      if (remaining <= 0) return

      const ceil = Math.ceil(remaining)
      if (ceil >= 1 && ceil <= 3 && !firedEndCountdownSecondsRef.current.has(ceil)) {
        firedEndCountdownSecondsRef.current.add(ceil)
        onEndRef.current()
      }

      if (subBlockIntervalSeconds && subBlockIntervalSeconds > 0 && remaining >= 4) {
        const elapsed = blockDurRef.current - remaining
        const currentIndex = Math.floor(elapsed / subBlockIntervalSeconds)
        if (currentIndex > lastSubBlockTickIndexRef.current && currentIndex >= 1) {
          lastSubBlockTickIndexRef.current = currentIndex
          onSubRef.current()
        }
      }
    }, pollIntervalMs)
    return () => clearInterval(interval)
  }, [running, blockId, subBlockIntervalSeconds, remainingRef, blockDurRef, pollIntervalMs])
}
