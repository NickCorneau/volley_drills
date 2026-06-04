import { composeReceipt, startOfLocalWeek } from '../composeReceipt'
import type { PerDrillCapture, SessionReview } from '../../model'

const DAY = 24 * 60 * 60 * 1000
// A fixed reference instant; the exact weekday doesn't matter because we
// derive week boundaries from startOfLocalWeek rather than guessing.
const NOW = new Date(2026, 5, 17, 12, 0, 0).getTime() // Jun 17 2026, noon local
const CURRENT_WEEK_START = startOfLocalWeek(NOW)
const CLOSED_WEEK_START = startOfLocalWeek(CURRENT_WEEK_START - 1)

let seq = 0
function review(submittedAt: number, captures?: PerDrillCapture[]): SessionReview {
  seq += 1
  return {
    id: `r${seq}`,
    executionLogId: `e${seq}`,
    sessionRpe: 5,
    goodPasses: 0,
    totalAttempts: 0,
    submittedAt,
    status: 'submitted',
    eligibleForAdaptation: true,
    perDrillCaptures: captures,
  }
}

/** A timestamp inside the week that starts at `weekStart`. */
function inWeek(weekStart: number, dayOffset = 1): number {
  return weekStart + dayOffset * DAY + 9 * 60 * 60 * 1000
}

describe('composeReceipt — frozen-on-close', () => {
  it('counts the last completed week, not the live current week', () => {
    const reviews = [
      review(inWeek(CLOSED_WEEK_START, 0)),
      review(inWeek(CLOSED_WEEK_START, 2)),
      // current (incomplete) week — must NOT count toward the headline
      review(inWeek(CURRENT_WEEK_START, 0)),
    ]
    const out = composeReceipt(reviews, NOW)
    expect(out.consistency.count).toBe(2)
  })

  it('includes a session at the last instant of the closed week (local boundary)', () => {
    const reviews = [
      review(CURRENT_WEEK_START - 1), // 23:59:59.999 of the closed week, local
      review(CURRENT_WEEK_START), // first instant of the current week — excluded
    ]
    const out = composeReceipt(reviews, NOW)
    expect(out.consistency.count).toBe(1)
  })
})

describe('composeReceipt — anti-guilt framing (F5)', () => {
  it('shows an absolute count below the minimum history (no comparison)', () => {
    const reviews = [
      review(inWeek(CLOSED_WEEK_START, 1)),
      // only one prior week with data -> below MIN_PRIOR_WEEKS
      review(inWeek(startOfLocalWeek(CLOSED_WEEK_START - 1), 1)),
    ]
    const out = composeReceipt(reviews, NOW)
    expect(out.consistency.kind).toBe('absolute')
    expect(out.headline).toContain('logged so far')
  })

  it('renders a strong band when the week is ahead of rhythm', () => {
    const prior1 = startOfLocalWeek(CLOSED_WEEK_START - 1)
    const prior2 = startOfLocalWeek(prior1 - 1)
    const reviews = [
      review(inWeek(prior1, 1)), // typical 1/wk
      review(inWeek(prior2, 1)),
      review(inWeek(CLOSED_WEEK_START, 1)), // closed week = 2 -> strong
      review(inWeek(CLOSED_WEEK_START, 3)),
    ]
    const out = composeReceipt(reviews, NOW)
    expect(out.consistency).toMatchObject({ kind: 'banded', band: 'strong', count: 2 })
    expect(out.headline).toContain('ahead of your rhythm')
  })

  it('renders a neutral steady band for a quiet week — never a deficit', () => {
    const prior1 = startOfLocalWeek(CLOSED_WEEK_START - 1)
    const prior2 = startOfLocalWeek(prior1 - 1)
    const reviews = [
      review(inWeek(prior1, 1)),
      review(inWeek(prior1, 3)),
      review(inWeek(prior2, 1)),
      review(inWeek(prior2, 3)),
      // closed week: zero sessions (quiet week)
    ]
    const out = composeReceipt(reviews, NOW)
    expect(out.consistency).toMatchObject({ kind: 'banded', band: 'steady', count: 0 })
    const lower = out.headline.toLowerCase()
    for (const guilt of ['behind', 'below', 'miss', 'short', 'only', 'down']) {
      expect(lower).not.toContain(guilt)
    }
  })
})

describe('composeReceipt — felt-difficulty + no readiness number', () => {
  it('includes per-focus felt-difficulty bands over the rolling window', () => {
    const caps: PerDrillCapture[] = Array.from({ length: 4 }, (_, i) => ({
      drillId: 'd01', // pass
      variantId: 'd01-solo',
      blockIndex: i,
      difficulty: 'too_hard',
      capturedAt: 0,
    }))
    const out = composeReceipt([review(inWeek(CLOSED_WEEK_START, 1), caps)], NOW)
    expect(out.feltDifficulty.pass).toBe('often_stretched')
    expect(out.feltDifficulty).toHaveProperty('serve')
    expect(out.feltDifficulty).toHaveProperty('set')
  })

  it('headline carries no self-reported readiness number (R7 deferred)', () => {
    const out = composeReceipt([review(inWeek(CLOSED_WEEK_START, 1))], NOW)
    expect(out.headline.toLowerCase()).not.toContain('confiden')
    expect(out.headline.toLowerCase()).not.toContain('ready')
  })
})
