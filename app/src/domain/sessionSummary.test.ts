import { describe, expect, it } from 'vitest'
import type { IncompleteReason, SessionPlan, SessionReview } from '../model'
import { FORBIDDEN_RE } from '../lib/copyGuard'
import { composeSummary, type SummaryCase } from './sessionSummary'

/**
 * C-2 Unit 1: `composeSummary` is the sole source of truth for the 3-case
 * session-summary copy matrix (A2 pain-first, H10 three-case collapse).
 *
 * | Case        | Condition                                             | Verdict line    |
 * |-------------|-------------------------------------------------------|-----------------|
 * | A           | status === 'skipped'                                  | "No change"     |
 * | B           | status === 'submitted' && incompleteReason === 'pain' | "Lighter next"  |
 * | C (default) | any other submitted                                   | "Keep building" |
 *
 * Regex guard (H10 / D86): output never contains
 * `compared | trend | progress | spike | overload | injury risk |
 *  first N days | baseline | early sessions`.
 */

function makePlan(playerCount: 1 | 2): SessionPlan {
  return {
    id: 'plan-1',
    presetId: 'preset-1',
    presetName: 'Test Preset',
    playerCount,
    blocks: [],
    safetyCheck: { painFlag: false, heatCta: false, painOverridden: false },
    createdAt: 0,
  }
}

function makeReview(overrides: Partial<SessionReview>): SessionReview {
  return {
    id: 'review-1',
    executionLogId: 'exec-1',
    sessionRpe: 6,
    goodPasses: 0,
    totalAttempts: 0,
    submittedAt: 0,
    status: 'submitted',
    ...overrides,
  }
}

describe('composeSummary: Case A (skipped)', () => {
  it("returns 'No change' for status 'skipped' regardless of incompleteReason", () => {
    const review = makeReview({
      status: 'skipped',
      sessionRpe: null,
      incompleteReason: 'fatigue',
    })
    const out = composeSummary({
      review,
      plan: makePlan(1),
      sessionCount: 4,
    })
    expect(out.case).toBe('skipped')
    expect(out.verdict).toBe('No change')
    expect(out.reason).toBe('No review this time. Next session stays at the same level.')
  })

  it('skipped-wins-over-pain (A2 ordering)', () => {
    const review = makeReview({
      status: 'skipped',
      sessionRpe: null,
      incompleteReason: 'pain',
    })
    const out = composeSummary({
      review,
      plan: makePlan(1),
      sessionCount: 1,
    })
    expect(out.case).toBe('skipped')
    expect(out.verdict).toBe('No change')
  })
})

describe('composeSummary: Case B (submitted + pain)', () => {
  it("returns 'Lighter next' when status submitted AND incompleteReason 'pain'", () => {
    const review = makeReview({
      status: 'submitted',
      sessionRpe: 4,
      incompleteReason: 'pain',
    })
    const out = composeSummary({
      review,
      plan: makePlan(1),
      sessionCount: 2,
    })
    expect(out.case).toBe('pain')
    expect(out.verdict).toBe('Lighter next')
    expect(out.reason).toContain('gentler')
  })
})

describe('composeSummary: Case C (default)', () => {
  // 2026-06-22 shibui audit T2 (one home per fact): the default reason
  // is a count-free completion beat keyed ONLY on session ordinality
  // (first vs repeat). The pass count lives once, in the Complete recap
  // "Good passes" row (see CompleteScreen.summary.test) — it is
  // intentionally not restated here, so the hero verdict and the recap
  // can never disagree. See sessionSummary.ts and
  // docs/plans/2026-06-22-005-refactor-t2-duplicate-facts-plan.md U1.
  it('returns the repeat completion line for a returning session and never restates the pass count', () => {
    const review = makeReview({
      status: 'submitted',
      sessionRpe: 6,
      goodPasses: 40,
      totalAttempts: 60,
    })
    const out = composeSummary({
      review,
      plan: makePlan(1),
      sessionCount: 3,
    })
    expect(out.case).toBe('default')
    expect(out.verdict).toBe('Keep building')
    expect(out.reason).toBe('One more in the book. Ready when you are.')
    // The pass count is the recap row's job now — the hero reason must
    // not echo it (T2 dedup) or claim a tuning engine v0b lacks.
    expect(out.reason).not.toMatch(/good pass|out of|\d/)
    expect(out.reason).not.toMatch(/tuning|more attempt/i)
    expect(out.reason).not.toContain('Completed session')
  })

  it('returns the first-session line for session 1 even when attempts were recorded', () => {
    const review = makeReview({
      status: 'submitted',
      goodPasses: 3,
      totalAttempts: 5,
    })
    const out = composeSummary({
      review,
      plan: makePlan(1),
      sessionCount: 1,
    })
    expect(out.case).toBe('default')
    expect(out.verdict).toBe('Keep building')
    expect(out.reason).toBe('First one\u2019s in the book. Ready when you are.')
    expect(out.reason).not.toMatch(/good pass|out of/)
    expect(out.reason).not.toContain('One more in the book')
    expect(out.reason).not.toContain('Completed session')
  })

  it('returns the repeat completion line when totalAttempts === 0 on a returning session', () => {
    const review = makeReview({
      status: 'submitted',
      goodPasses: 0,
      totalAttempts: 0,
    })
    const out = composeSummary({
      review,
      plan: makePlan(1),
      sessionCount: 5,
    })
    expect(out.reason).toBe('One more in the book. Ready when you are.')
    expect(out.reason).not.toContain('Completed session')
  })

  // Partner-walkthrough polish 2026-04-22 (design review T3 / trifold T3):
  // a first-ever session deserves a subtly milestone-ish reason line,
  // not the pattern-matched `One more in the book.` that reads identical
  // to session 2, 5, 20 on the same path.
  // See `docs/plans/2026-04-22-partner-walkthrough-polish.md` item 4.
  it('uses a distinct first-session milestone line when sessionCount === 1', () => {
    const review = makeReview({
      status: 'submitted',
      goodPasses: 0,
      totalAttempts: 0,
    })
    const out = composeSummary({
      review,
      plan: makePlan(1),
      sessionCount: 1,
    })
    expect(out.case).toBe('default')
    expect(out.verdict).toBe('Keep building')
    expect(out.reason).toBe('First one\u2019s in the book. Ready when you are.')
    expect(out.reason).not.toContain('Completed session')
    expect(out.reason).not.toContain('One more in the book')
  })
})

describe('composeSummary: header (pair vs solo, D121 / D120)', () => {
  it('emits "Today\'s pair verdict" for playerCount === 2', () => {
    const review = makeReview({ status: 'submitted' })
    const out = composeSummary({
      review,
      plan: makePlan(2),
      sessionCount: 1,
    })
    expect(out.header).toBe("Today's pair verdict")
  })

  it('emits "Today\'s verdict" for playerCount === 1', () => {
    const review = makeReview({ status: 'submitted' })
    const out = composeSummary({
      review,
      plan: makePlan(1),
      sessionCount: 1,
    })
    expect(out.header).toBe("Today's verdict")
  })
})

describe('composeSummary: defensive behavior', () => {
  it('treats a leaked draft status as default Case C', () => {
    // `'draft'` is a valid `SessionReviewStatus` but should never reach
    // CompleteScreen (A1 filter + A9 route). The composer still handles
    // it gracefully - defaults to Case C "Keep building" rather than
    // throwing - so a stale record does not break the summary surface.
    const review = makeReview({
      status: 'draft',
      goodPasses: 5,
      totalAttempts: 8,
    })
    const out = composeSummary({
      review,
      plan: makePlan(1),
      sessionCount: 1,
    })
    expect(out.case).toBe('default')
    expect(out.verdict).toBe('Keep building')
  })
})

describe('composeSummary: regex guard (H10 / D86 forbidden vocabulary)', () => {
  it('no case ever contains a forbidden word', () => {
    const cases: Array<Parameters<typeof composeSummary>[0]> = []
    // Skipped + pain
    cases.push({
      review: makeReview({ status: 'skipped', sessionRpe: null }),
      plan: makePlan(1),
      sessionCount: 1,
    })
    // Submitted + pain
    cases.push({
      review: makeReview({ status: 'submitted', incompleteReason: 'pain' }),
      plan: makePlan(2),
      sessionCount: 3,
    })
    // Default low-N
    cases.push({
      review: makeReview({
        status: 'submitted',
        goodPasses: 10,
        totalAttempts: 20,
      }),
      plan: makePlan(1),
      sessionCount: 1,
    })
    // Default high-N
    cases.push({
      review: makeReview({
        status: 'submitted',
        goodPasses: 40,
        totalAttempts: 50,
      }),
      plan: makePlan(2),
      sessionCount: 5,
    })
    // notCaptured
    cases.push({
      review: makeReview({
        status: 'submitted',
        goodPasses: 0,
        totalAttempts: 0,
      }),
      plan: makePlan(1),
      sessionCount: 1,
    })

    for (const input of cases) {
      const out = composeSummary(input)
      const blob = `${out.header} ${out.verdict} ${out.reason}`
      expect(blob, `forbidden word in: ${blob}`).not.toMatch(FORBIDDEN_RE)
    }
  })
})

describe('composeSummary: property: every input maps to exactly one case', () => {
  it('enumerates status x incompleteReason and asserts exactly one case per cell', () => {
    const statuses: Array<'submitted' | 'skipped'> = ['submitted', 'skipped']
    const reasons: Array<IncompleteReason | undefined> = [
      undefined,
      'time',
      'fatigue',
      'pain',
      'other',
    ]

    const caseCounts: Record<SummaryCase, number> = {
      skipped: 0,
      pain: 0,
      default: 0,
    }

    for (const status of statuses) {
      for (const reason of reasons) {
        const review = makeReview({
          status,
          sessionRpe: status === 'submitted' ? 5 : null,
          incompleteReason: reason,
        })
        const out = composeSummary({
          review,
          plan: makePlan(1),
          sessionCount: 1,
        })
        caseCounts[out.case] += 1
      }
    }

    // 2 statuses x 5 reasons = 10 cells.
    // skipped: 5 (every incompleteReason value)
    // pain: 1 (submitted + pain)
    // default: 4 (submitted + {undefined, time, fatigue, other})
    expect(caseCounts.skipped).toBe(5)
    expect(caseCounts.pain).toBe(1)
    expect(caseCounts.default).toBe(4)
  })
})
