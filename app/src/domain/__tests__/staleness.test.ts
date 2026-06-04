import { sortByStaleness } from '../staleness'
import type { AttributedTrainingSession } from '../eligibleSessions'

const DAY = 24 * 60 * 60 * 1000
const NOW = 30 * DAY

function session(focus: AttributedTrainingSession['focus'], daysAgo: number): AttributedTrainingSession {
  return { focus, trainedAt: NOW - daysAgo * DAY }
}

describe('sortByStaleness', () => {
  it('orders least-recently-trained first', () => {
    const result = sortByStaleness(
      [session('pass', 1), session('serve', 5), session('set', 10)],
      NOW,
    )
    expect(result.ordered).toEqual(['set', 'serve', 'pass'])
    expect(result.head).toBe('set')
    expect(result.deferredTail).toEqual(['serve', 'pass'])
    expect(result.freshStart).toBe(false)
  })

  it('sinks the just-trained focus to the tail (anti-thrash, no cooldown needed)', () => {
    const result = sortByStaleness(
      [session('pass', 0), session('serve', 4), session('set', 8)],
      NOW,
    )
    expect(result.head).toBe('set')
    expect(result.ordered[result.ordered.length - 1]).toBe('pass')
  })

  it('surfaces a never-trained focus ahead of any trained focus', () => {
    // only pass + serve have history; set is untrained
    const result = sortByStaleness([session('pass', 2), session('serve', 9)], NOW)
    expect(result.head).toBe('set')
    expect(result.ordered).toEqual(['set', 'serve', 'pass'])
  })

  it('uses the latest session per focus for its staleness clock', () => {
    // pass trained 12 days ago AND 1 day ago — the recent one wins
    const result = sortByStaleness(
      [session('pass', 12), session('pass', 1), session('serve', 6), session('set', 3)],
      NOW,
    )
    expect(result.head).toBe('serve')
    expect(result.ordered).toEqual(['serve', 'set', 'pass'])
  })

  it('returns a deterministic order with freshStart for a new/lapsed user (no sessions)', () => {
    const result = sortByStaleness([], NOW)
    expect(result.ordered).toEqual(['pass', 'serve', 'set'])
    expect(result.head).toBe('pass')
    expect(result.freshStart).toBe(true)
  })

  it('clamps future-dated rows to age 0 instead of inverting order (clock skew)', () => {
    // serve is future-dated (clock skew) → age 0, must not jump to head
    const result = sortByStaleness(
      [{ focus: 'serve', trainedAt: NOW + 5 * DAY }, session('pass', 7), session('set', 3)],
      NOW,
    )
    expect(result.head).toBe('pass')
    // serve (age 0, clamped) sits at the tail with the freshest real session
    expect(result.ordered).toEqual(['pass', 'set', 'serve'])
  })

  it('breaks ties by the canonical pass/serve/set order', () => {
    const result = sortByStaleness(
      [session('pass', 5), session('serve', 5), session('set', 5)],
      NOW,
    )
    expect(result.ordered).toEqual(['pass', 'serve', 'set'])
  })
})
