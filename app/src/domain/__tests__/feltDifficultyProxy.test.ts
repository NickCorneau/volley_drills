import { feltDifficultyProxy } from '../feltDifficultyProxy'
import type { DifficultyTag, PerDrillCapture } from '../../model'

let seq = 0
function capture(drillId: string, difficulty: DifficultyTag): PerDrillCapture {
  seq += 1
  return { drillId, variantId: `${drillId}-v`, blockIndex: seq, difficulty, capturedAt: seq }
}

function many(drillId: string, difficulty: DifficultyTag, n: number): PerDrillCapture[] {
  return Array.from({ length: n }, () => capture(drillId, difficulty))
}

// d01 = pass, d22 = serve, d38 = set, d28 = warmup (out of scope)
describe('feltDifficultyProxy', () => {
  it('reads a too_hard-leaning focus as often_stretched', () => {
    const out = feltDifficultyProxy([...many('d01', 'too_hard', 3), capture('d01', 'still_learning')])
    expect(out.pass).toBe('often_stretched')
  })

  it('reads a too_easy-leaning focus as mostly_comfortable', () => {
    const out = feltDifficultyProxy([...many('d22', 'too_easy', 3), capture('d22', 'still_learning')])
    expect(out.serve).toBe('mostly_comfortable')
  })

  it('reads a balanced focus as mixed', () => {
    const out = feltDifficultyProxy([
      ...many('d38', 'too_hard', 2),
      ...many('d38', 'too_easy', 2),
    ])
    expect(out.set).toBe('mixed')
  })

  it('returns not_enough_yet below the minimum sample', () => {
    const out = feltDifficultyProxy(many('d01', 'too_hard', 2))
    expect(out.pass).toBe('not_enough_yet')
    expect(out.serve).toBe('not_enough_yet')
    expect(out.set).toBe('not_enough_yet')
  })

  it('buckets per focus independently', () => {
    const out = feltDifficultyProxy([
      ...many('d01', 'too_hard', 4), // pass stretched
      ...many('d22', 'too_easy', 4), // serve comfortable
    ])
    expect(out.pass).toBe('often_stretched')
    expect(out.serve).toBe('mostly_comfortable')
    expect(out.set).toBe('not_enough_yet')
  })

  it('drops captures from out-of-scope or unknown drills', () => {
    const out = feltDifficultyProxy([
      ...many('d28', 'too_hard', 6), // warmup — out of scope
      ...many('nope', 'too_hard', 6), // unknown drill id
    ])
    expect(out.pass).toBe('not_enough_yet')
    expect(out.serve).toBe('not_enough_yet')
    expect(out.set).toBe('not_enough_yet')
  })

  it('returns all three focuses for an empty capture set', () => {
    expect(feltDifficultyProxy([])).toEqual({
      pass: 'not_enough_yet',
      serve: 'not_enough_yet',
      set: 'not_enough_yet',
    })
  })
})
