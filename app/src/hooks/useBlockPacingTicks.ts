import { useEffect, useRef } from 'react'
import { computeSegmentState } from '../domain/runFlow/segmentTiming'
import type { DrillSegment } from '../types/drill'

/**
 * Audio-tick pacing loop for the active run block.
 *
 * Extracted from `RunScreen` so the poll bookkeeping is isolated and
 * independently testable. Three responsibilities, all driven off the
 * continuously-updating `remainingRef` the RAF tick loop maintains:
 *
 *  1. **Block-end 3-sec countdown.** When `ceil(remaining)` transitions
 *     through 3 → 2 → 1, fires `onEndCountdownTick` once per second.
 *     The block-end beep itself still fires from the caller at
 *     remaining = 0, so the audible shape becomes tick-tick-tick-BEEP.
 *
 *  2. **Per-segment pacing tick.** When a drill variant declares
 *     structured `segments`, this hook calls `computeSegmentState`
 *     each poll and fires `onSegmentEndTick` once per segment
 *     boundary. Suppressed when `remaining < 4` so the last segment
 *     end does not collide with the block-end countdown + beep on
 *     drills whose final segment ends at the block boundary.
 *     Segments-driven path takes precedence over sub-block — when
 *     `segments` is present, `onSubBlockTick` does NOT fire.
 *
 *  3. **Uniform sub-block pacing tick (legacy / fallback).** When
 *     a variant declares `subBlockIntervalSeconds` and NO segments,
 *     fires `onSubBlockTick` at each multiple of that interval.
 *     Same `remaining < 4` suppression rule. Reserved for any future
 *     timed drill that opts out of structured segments.
 *
 * Ref-based bookkeeping (fired countdown seconds; last-fired sub-block
 * index; last-emitted segment index) resets on `blockId` change so a
 * new block starts with a clean set.
 *
 * 2026-04-28 ship (`docs/plans/2026-04-28-per-move-pacing-indicator.md`
 * U6): the per-segment branch is the new third responsibility.
 */
export interface UseBlockPacingTicksOptions {
  running: boolean
  blockId: string | null | undefined
  subBlockIntervalSeconds?: number
  /**
   * Authored sub-block segments for the active block. When present,
   * the per-segment branch fires `onSegmentEndTick` at each segment
   * boundary and the uniform sub-block tick does NOT fire.
   */
  segments?: readonly DrillSegment[]
  remainingRef: { current: number }
  blockDurRef: { current: number }
  onEndCountdownTick: () => void
  onSubBlockTick: () => void
  /**
   * Fired once per segment boundary when `segments` is present and
   * non-empty. Provide a no-op (or omit; defaults to `onSubBlockTick`)
   * when not consuming the segments-driven path.
   */
  onSegmentEndTick?: () => void
  /**
   * Optional callback invoked on every poll with the current segment
   * index. RunScreen uses this to drive the active-row highlight
   * without owning its own polling loop. `-1` (`SEGMENT_INDEX_BONUS`)
   * means all segments have completed (bonus territory). Not called
   * when `segments` is undefined or empty.
   */
  onSegmentIndexChange?: (currentIndex: number) => void
  /** Poll interval in ms. Defaults to 250. */
  pollIntervalMs?: number
}

export function useBlockPacingTicks({
  running,
  blockId,
  subBlockIntervalSeconds,
  segments,
  remainingRef,
  blockDurRef,
  onEndCountdownTick,
  onSubBlockTick,
  onSegmentEndTick,
  onSegmentIndexChange,
  pollIntervalMs = 250,
}: UseBlockPacingTicksOptions): void {
  const firedEndCountdownSecondsRef = useRef<Set<number>>(new Set())
  const lastSubBlockTickIndexRef = useRef(0)
  const lastSegmentIndexRef = useRef(0)

  // Reset bookkeeping when the active block id changes.
  useEffect(() => {
    firedEndCountdownSecondsRef.current = new Set()
    lastSubBlockTickIndexRef.current = 0
    lastSegmentIndexRef.current = 0
  }, [blockId])

  // Callbacks through refs so changing handler identity doesn't recycle
  // the interval mid-block.
  const onEndRef = useRef(onEndCountdownTick)
  const onSubRef = useRef(onSubBlockTick)
  const onSegmentEndRef = useRef(onSegmentEndTick)
  const onSegmentIndexChangeRef = useRef(onSegmentIndexChange)
  useEffect(() => {
    onEndRef.current = onEndCountdownTick
    onSubRef.current = onSubBlockTick
    onSegmentEndRef.current = onSegmentEndTick
    onSegmentIndexChangeRef.current = onSegmentIndexChange
  })

  // Stable identity for the segments array dependency (length + first /
  // last id is sufficient — segments are immutable per block per the
  // catalog contract).
  const segmentsKey = segments
    ? `${segments.length}:${segments[0]?.id ?? ''}:${segments[segments.length - 1]?.id ?? ''}`
    : ''

  useEffect(() => {
    if (!running || !blockId) return
    const hasSegments = segments !== undefined && segments.length > 0
    const interval = setInterval(() => {
      const remaining = remainingRef.current
      if (remaining <= 0) return

      const ceil = Math.ceil(remaining)
      if (ceil >= 1 && ceil <= 3 && !firedEndCountdownSecondsRef.current.has(ceil)) {
        firedEndCountdownSecondsRef.current.add(ceil)
        onEndRef.current()
      }

      if (hasSegments) {
        const elapsed = blockDurRef.current - remaining
        const state = computeSegmentState(elapsed, segments, lastSegmentIndexRef.current)
        // Suppress the per-segment beep in the last 4 s window so it
        // doesn't collide with the block-end countdown + beep when a
        // segment ends exactly at the block boundary (the common case
        // for d28: last segment ends at t=180 = block end).
        if (state.segmentEndingNow && remaining >= 4 && onSegmentEndRef.current) {
          onSegmentEndRef.current()
        }
        if (state.currentIndex !== lastSegmentIndexRef.current) {
          lastSegmentIndexRef.current = state.currentIndex
          onSegmentIndexChangeRef.current?.(state.currentIndex)
        }
        // Segments path takes precedence: no uniform sub-block tick.
        return
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
    // `segments` is referenced by identity inside the interval; the
    // segmentsKey dependency captures meaningful changes without
    // triggering on every parent rerender. eslint-disable-next-line
    // react-hooks/exhaustive-deps would ordinarily warn here; the
    // segmentsKey + the `segments` reference together cover both the
    // identity and the value.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    running,
    blockId,
    subBlockIntervalSeconds,
    segmentsKey,
    remainingRef,
    blockDurRef,
    pollIntervalMs,
  ])
}

export { SEGMENT_INDEX_BONUS } from '../domain/runFlow/segmentTiming'
