import type { PerDrillCapture } from '../../model'

/**
 * Last-write-wins merge for per-drill captures, keyed by `blockIndex`.
 *
 * Returns a new array with `next` either replacing the existing capture
 * for the same `blockIndex` or appended, then sorted in block order so
 * downstream renderers (CompleteScreen recap, exporter, future coach
 * payload) receive captures in the same order the tester saw the blocks.
 *
 * Pure: input arrays are not mutated.
 */
export function mergePerDrillCaptures(
  captures: readonly PerDrillCapture[],
  next: PerDrillCapture,
): PerDrillCapture[] {
  return [...captures.filter((capture) => capture.blockIndex !== next.blockIndex), next].sort(
    (a, b) => a.blockIndex - b.blockIndex,
  )
}
