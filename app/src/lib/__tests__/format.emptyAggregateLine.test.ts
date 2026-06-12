import { describe, expect, it } from 'vitest'
import { formatEmptyAggregateLine } from '../format'

/**
 * Shibui polish 2026-06-12 (origin R8): the quiet line that replaces
 * the Good-passes card on Review when no drill has a logged count.
 * The base variant (drillsTagged === 0) is unreachable via today's
 * controller gating but is pinned here so the branch never goes
 * dead-untested.
 */
describe('formatEmptyAggregateLine', () => {
  it('acknowledges tag captures and teaches where capture lives (singular)', () => {
    expect(formatEmptyAggregateLine(1)).toBe(
      'Difficulty noted on 1 drill. No counts logged between blocks.',
    )
  })

  it('pluralizes the tag count', () => {
    expect(formatEmptyAggregateLine(3)).toBe(
      'Difficulty noted on 3 drills. No counts logged between blocks.',
    )
  })

  it('falls back to the base teaching line when no tags were captured', () => {
    expect(formatEmptyAggregateLine(0)).toBe(
      'No counts logged. Counts are captured between blocks.',
    )
  })
})
