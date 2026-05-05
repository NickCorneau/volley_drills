import { CUE_COMPACT_MAX } from '../../../domain/policies'
import { segmentListOwnsCurrentCue, selectNonSegmentedCurrentCue } from '../currentCue'

const compactCue = 'Hold platform angle.'
const compactInstructions = 'Pass controlled balls to target.'

function block(overrides: Partial<Parameters<typeof selectNonSegmentedCurrentCue>[0]> = {}) {
  return {
    drillName: 'Self-Toss Pass',
    coachingCue: compactCue,
    courtsideInstructions: compactInstructions,
    ...overrides,
  }
}

describe('current cue selection', () => {
  it('keeps a compact authored coaching cue intact', () => {
    const cue = selectNonSegmentedCurrentCue(block())

    expect(cue).toEqual({
      text: compactCue,
      source: 'coaching-cue',
      fullCue: compactCue,
      fullInstructions: compactInstructions,
    })
  })

  it('uses the first delimiter-separated cue clause when a cue is long', () => {
    const fullCue = [
      'Server calls short/deep before contact',
      'Receiver owns platform angle',
      'Partner shades the open seam and resets fast',
    ].join(' · ')

    const cue = selectNonSegmentedCurrentCue(block({ coachingCue: fullCue }))

    expect(cue.text).toBe('Server calls short/deep before contact')
    expect(cue.source).toBe('coaching-cue')
    expect(cue.fullCue).toBe(fullCue)
  })

  it('falls back to a short single-line instruction when no cue exists', () => {
    const cue = selectNonSegmentedCurrentCue(
      block({
        coachingCue: '   ',
        courtsideInstructions: '  Toss, pass, catch.  ',
      }),
    )

    expect(cue.text).toBe('Toss, pass, catch.')
    expect(cue.source).toBe('instructions')
  })

  it('falls back to drill name instead of parsing multiline instruction prose', () => {
    const fullInstructions = '\n  Toss, pass, catch.  \nRepeat with quiet feet.'

    const cue = selectNonSegmentedCurrentCue(
      block({
        coachingCue: '   ',
        courtsideInstructions: fullInstructions,
      }),
    )

    expect(cue.text).toBe('Self-Toss Pass')
    expect(cue.source).toBe('drill-name')
    expect(cue.fullInstructions).toBe(fullInstructions.trim())
  })

  it('falls back to drill name instead of parsing long instruction prose', () => {
    const longInstruction = `${'Set up cones along the full line and rotate through partner reads. '.repeat(
      3,
    )}END`
    expect(longInstruction.length).toBeGreaterThan(CUE_COMPACT_MAX)

    const cue = selectNonSegmentedCurrentCue(
      block({
        coachingCue: '',
        courtsideInstructions: longInstruction,
      }),
    )

    expect(cue.text).toBe('Self-Toss Pass')
    expect(cue.source).toBe('drill-name')
    expect(cue.fullInstructions).toBe(longInstruction)
  })

  it('falls back to drill name when a long cue has no safe delimiter clause', () => {
    const longCue = `${'Stay quiet through the platform and read the ball early. '.repeat(3)}END`
    expect(longCue.length).toBeGreaterThan(CUE_COMPACT_MAX)

    const cue = selectNonSegmentedCurrentCue(
      block({ coachingCue: longCue, courtsideInstructions: '' }),
    )

    expect(cue.text).toBe('Self-Toss Pass')
    expect(cue.source).toBe('drill-name')
    expect(cue.fullCue).toBe(longCue)
    expect(cue.fullInstructions).toBeUndefined()
  })

  it('keeps segmented blocks owned by SegmentList instead of the text cue helper', () => {
    expect(
      segmentListOwnsCurrentCue({
        segments: [{ id: 's1', label: 'Jog the box.', durationSec: 30 }],
      }),
    ).toBe(true)

    expect(segmentListOwnsCurrentCue({ segments: undefined })).toBe(false)
  })
})
