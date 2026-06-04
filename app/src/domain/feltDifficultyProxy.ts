/**
 * M002.1 U6 — felt-difficulty skill proxy (R8).
 *
 * Folds the already-captured per-drill difficulty-tag distribution into
 * one honest per-focus band. Pure domain: no Dexie, no React, no new
 * capture. Reads `PerDrillCapture.difficulty` (`too_easy` /
 * `still_learning` / `too_hard`), attributing each capture to a focus
 * via the drill catalog (`focusForDrillId`).
 *
 * KTD4 / honesty constraints: the band is a *felt-difficulty* read,
 * relative-to-you and time-bounded (the caller passes captures from the
 * rolling window only). It is never an objective skill grade, never a
 * "your skill improved" claim, and refuses to predict the future. Below
 * a minimum sample it returns `not_enough_yet` rather than a band.
 *
 * `aggregateDrillCaptures` is the shape precedent for tag counting, but
 * it sums a single session with no per-focus bucketing — the per-focus
 * fold here is built fresh.
 */
import type { PerDrillCapture } from '../model'
import type { ScopedFocus } from './eligibleSessions'
import { focusForDrillId } from './sessionFocus'

export type FeltDifficultyBand =
  | 'mostly_comfortable'
  | 'mixed'
  | 'often_stretched'
  | 'not_enough_yet'

/** Minimum captures for a focus before a band is reported (tunable). */
const MIN_CAPTURES = 4

interface TagCounts {
  too_hard: number
  still_learning: number
  too_easy: number
}

function band(counts: TagCounts): FeltDifficultyBand {
  const total = counts.too_hard + counts.still_learning + counts.too_easy
  if (total < MIN_CAPTURES) return 'not_enough_yet'
  if (counts.too_hard > counts.too_easy) return 'often_stretched'
  if (counts.too_easy > counts.too_hard) return 'mostly_comfortable'
  return 'mixed'
}

/**
 * Per-focus felt-difficulty band over the supplied captures (already
 * windowed by the caller). All three scoped focuses are always present
 * so consumers can iterate without optional-chaining.
 */
export function feltDifficultyProxy(
  captures: readonly PerDrillCapture[],
): Record<ScopedFocus, FeltDifficultyBand> {
  const counts: Record<ScopedFocus, TagCounts> = {
    pass: { too_hard: 0, still_learning: 0, too_easy: 0 },
    serve: { too_hard: 0, still_learning: 0, too_easy: 0 },
    set: { too_hard: 0, still_learning: 0, too_easy: 0 },
  }

  for (const capture of captures) {
    const focus = focusForDrillId(capture.drillId)
    if (focus !== 'pass' && focus !== 'serve' && focus !== 'set') continue
    counts[focus][capture.difficulty] += 1
  }

  return {
    pass: band(counts.pass),
    serve: band(counts.serve),
    set: band(counts.set),
  }
}
