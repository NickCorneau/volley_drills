import { composePlan, type PlanInput } from '../composePlan'
import type { AttributedTrainingSession } from '../eligibleSessions'

const DAY = 24 * 60 * 60 * 1000
const NOW = 60 * DAY

function session(focus: AttributedTrainingSession['focus'], daysAgo: number): AttributedTrainingSession {
  return { focus, trainedAt: NOW - daysAgo * DAY }
}

function plan(overrides: Partial<PlanInput> = {}): PlanInput {
  return { sessions: [], now: NOW, ...overrides }
}

function wordCount(text: string): number {
  return text.trim().split(/\s+/).length
}

describe('composePlan', () => {
  it('names the staleness head as the concrete next session', () => {
    const out = composePlan(
      plan({ sessions: [session('pass', 1), session('serve', 5), session('set', 12)] }),
    )
    expect(out.nextFocus).toBe('set')
    expect(out.backlog).toEqual(['serve', 'pass'])
    expect(out.render).toContain('setting')
  })

  it('lists only-next-concrete; the rest stay queued as intent', () => {
    const out = composePlan(plan({ sessions: [session('pass', 2), session('serve', 8)] }))
    // set never trained -> head; pass/serve are queued
    expect(out.nextFocus).toBe('set')
    expect(out.backlog).toContain('pass')
    expect(out.backlog).toContain('serve')
  })

  it('emits a fresh-start projection for a new user (no sessions)', () => {
    const out = composePlan(plan())
    expect(out.freshStart).toBe(true)
    expect(out.nextFocus).toBe('pass')
    expect(out.intentions).toEqual(['pass', 'serve', 'set'])
    expect(out.render.toLowerCase()).toContain('passing')
  })

  it('intentions reflect only trained focuses once history exists', () => {
    const out = composePlan(plan({ sessions: [session('pass', 3), session('serve', 6)] }))
    expect(out.intentions).toEqual(['pass', 'serve'])
  })

  it('folds an accepted stress delta on the next focus into the framing', () => {
    const out = composePlan(
      plan({
        sessions: [session('pass', 1), session('serve', 5), session('set', 12)],
        acceptedDelta: { kind: 'stress', focus: 'set', direction: 'more' },
      }),
    )
    expect(out.render.toLowerCase()).toContain('stress')
  })

  it('ignores an accepted delta whose focus is not the next session', () => {
    const out = composePlan(
      plan({
        sessions: [session('pass', 1), session('serve', 5), session('set', 12)],
        acceptedDelta: { kind: 'stress', focus: 'pass', direction: 'more' },
      }),
    )
    expect(out.render.toLowerCase()).not.toContain('stress')
  })

  it('renders within the 45-word courtside ceiling and without em-dashes', () => {
    const cases = [
      plan(),
      plan({ sessions: [session('pass', 1), session('serve', 5), session('set', 12)] }),
      plan({
        sessions: [session('pass', 1), session('serve', 5), session('set', 12)],
        acceptedDelta: { kind: 'stress', focus: 'set', direction: 'less' },
      }),
    ]
    for (const input of cases) {
      const { render } = composePlan(input)
      expect(render).not.toContain('\u2014')
      expect(wordCount(render)).toBeLessThanOrEqual(45)
    }
  })

  it('is deterministic — same inputs reproduce the plan exactly', () => {
    const input = plan({ sessions: [session('pass', 4), session('serve', 9), session('set', 2)] })
    expect(composePlan(input)).toEqual(composePlan(input))
  })
})
