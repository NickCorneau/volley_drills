import { composeCarryForwardLine, replayAdaptation, type ReplayInput } from '../replayAdaptation'
import type { DifficultyTag } from '../../../model'

function input(overrides: Partial<ReplayInput> = {}): ReplayInput {
  return {
    currentFocus: 'pass',
    recentTagsForFocus: [],
    recentRpe: [],
    ...overrides,
  }
}

const hard: DifficultyTag[] = ['too_hard', 'too_hard']
const easy: DifficultyTag[] = ['too_easy', 'too_easy']

describe('replayAdaptation — derivation rule (F3)', () => {
  it('yields "less" on a sustained too_hard trend', () => {
    const delta = replayAdaptation(input({ recentTagsForFocus: [hard, hard], recentRpe: [5, 5] }))
    expect(delta).toEqual({ kind: 'stress', focus: 'pass', direction: 'less' })
  })

  it('yields "more" on a sustained too_easy trend', () => {
    const delta = replayAdaptation(input({ recentTagsForFocus: [easy, easy], recentRpe: [3, 3] }))
    expect(delta.direction).toBe('more')
  })

  it('a null sRPE never blocks a tag-driven direction', () => {
    const delta = replayAdaptation(
      input({ recentTagsForFocus: [hard, hard], recentRpe: [null, null] }),
    )
    expect(delta.direction).toBe('less')
  })
})

describe('replayAdaptation — hysteresis (F4)', () => {
  it('a single hard session stays keep (no sustained trend)', () => {
    const delta = replayAdaptation(
      input({ recentTagsForFocus: [['still_learning'], hard], recentRpe: [5, 7] }),
    )
    expect(delta.direction).toBe('keep')
  })

  it('an oscillating signal does not flip (last two disagree)', () => {
    const delta = replayAdaptation(input({ recentTagsForFocus: [hard, easy], recentRpe: [7, 3] }))
    expect(delta.direction).toBe('keep')
  })

  it('cold start (fewer than two sessions) is keep', () => {
    expect(replayAdaptation(input({ recentTagsForFocus: [hard], recentRpe: [8] })).direction).toBe(
      'keep',
    )
    expect(replayAdaptation(input()).direction).toBe('keep')
  })
})

describe('replayAdaptation — sRPE suppression', () => {
  it('suppresses "more" when the latest sRPE is maxed', () => {
    const delta = replayAdaptation(input({ recentTagsForFocus: [easy, easy], recentRpe: [3, 9] }))
    expect(delta.direction).toBe('keep')
  })

  it('does not suppress "less" on a high sRPE (only blocks pushing up)', () => {
    const delta = replayAdaptation(input({ recentTagsForFocus: [hard, hard], recentRpe: [9, 9] }))
    expect(delta.direction).toBe('less')
  })
})

describe('replayAdaptation — effective-delta (F13)', () => {
  it('suppresses re-offering a direction the user just kept-original', () => {
    const delta = replayAdaptation(
      input({
        recentTagsForFocus: [hard, hard],
        recentRpe: [5, 5],
        priorVerdict: { direction: 'less', choice: 'kept_original' },
      }),
    )
    expect(delta.direction).toBe('keep')
  })

  it('re-surfaces when the signal changed direction from the kept one', () => {
    const delta = replayAdaptation(
      input({
        recentTagsForFocus: [easy, easy],
        recentRpe: [3, 3],
        priorVerdict: { direction: 'less', choice: 'kept_original' },
      }),
    )
    expect(delta.direction).toBe('more')
  })

  it('an accepted prior verdict does not suppress the next computation', () => {
    const delta = replayAdaptation(
      input({
        recentTagsForFocus: [hard, hard],
        recentRpe: [5, 5],
        priorVerdict: { direction: 'less', choice: 'accepted' },
      }),
    )
    expect(delta.direction).toBe('less')
  })
})

describe('composeCarryForwardLine', () => {
  it('returns null for a keep delta (no filler line)', () => {
    expect(composeCarryForwardLine({ kind: 'stress', focus: 'pass', direction: 'keep' })).toBeNull()
  })

  it('renders a bounded stress line for more/less, em-dash free and <=45 words', () => {
    for (const direction of ['more', 'less'] as const) {
      for (const focus of ['pass', 'serve', 'set'] as const) {
        const line = composeCarryForwardLine({ kind: 'stress', focus, direction })
        expect(line).not.toBeNull()
        expect(line as string).not.toContain('\u2014')
        expect((line as string).split(/\s+/).length).toBeLessThanOrEqual(45)
      }
    }
  })
})
