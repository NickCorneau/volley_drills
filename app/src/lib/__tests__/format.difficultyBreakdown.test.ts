import { describe, expect, it } from 'vitest'
import { formatDifficultyBreakdownLine } from '../format'

/**
 * 2026-04-27 pre-D91 editorial polish (plan Item 8): rendering rules
 * for the Complete-recap "Difficulty" row composed by
 * `formatDifficultyBreakdownLine`. The CompleteScreen consumer renders
 * the row only when this function returns a non-null string, so the
 * `null` case here is a UI invariant ("hide row entirely"), not an
 * arbitrary placeholder value.
 *
 * Sources:
 *   docs/archive/plans/2026-04-26-pre-d91-editorial-polish.md Item 8
 */

describe('formatDifficultyBreakdownLine', () => {
  it('returns null when no chips were tapped (consumer hides the row)', () => {
    expect(
      formatDifficultyBreakdownLine({
        too_hard: 0,
        still_learning: 0,
        too_easy: 0,
      }),
    ).toBeNull()
  })

  it('collapses to "All too hard" when every tap landed on too_hard', () => {
    expect(
      formatDifficultyBreakdownLine({
        too_hard: 4,
        still_learning: 0,
        too_easy: 0,
      }),
    ).toBe('All too hard')
  })

  it('collapses to "All still learning" when every tap landed on still_learning', () => {
    expect(
      formatDifficultyBreakdownLine({
        too_hard: 0,
        still_learning: 3,
        too_easy: 0,
      }),
    ).toBe('All still learning')
  })

  it('collapses to "All too easy" when every tap landed on too_easy', () => {
    expect(
      formatDifficultyBreakdownLine({
        too_hard: 0,
        still_learning: 0,
        too_easy: 2,
      }),
    ).toBe('All too easy')
  })

  it('renders dot-separated tally for a mixed distribution, severity order', () => {
    // Severity order = too_hard → still_learning → too_easy. The user's
    // most actionable signal lands first under courtside scan.
    expect(
      formatDifficultyBreakdownLine({
        too_hard: 2,
        still_learning: 1,
        too_easy: 1,
      }),
    ).toBe('2 too hard · 1 still learning · 1 too easy')
  })

  it('omits zero buckets from the dot-separated tally', () => {
    expect(
      formatDifficultyBreakdownLine({
        too_hard: 2,
        still_learning: 0,
        too_easy: 1,
      }),
    ).toBe('2 too hard · 1 too easy')
  })

  it('preserves singular numerals — no pluralization gymnastics in the line', () => {
    // The format intentionally renders "1 too hard · 1 too easy", not
    // "1 too-hard · 1 too-easy" or "1 too hard, 1 too easy". The
    // chip-vocabulary text is borrowed verbatim from PerDrillCapture's
    // chip labels (lowercased) so the recap reads as a quiet echo of
    // the chip taps.
    expect(
      formatDifficultyBreakdownLine({
        too_hard: 1,
        still_learning: 0,
        too_easy: 1,
      }),
    ).toBe('1 too hard · 1 too easy')
  })
})
