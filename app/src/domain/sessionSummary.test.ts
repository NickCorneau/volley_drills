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
  it('renders the canonical Session N line with good / total numbers + forward hook (totalAttempts >= 50: no low-N suffix, Phase F4 forward hook)', () => {
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
    // Phase F4 (2026-04-19): default reason ends with "Ready when you
    // are." so Complete reads as a handoff rather than a flat verdict.
    // Low-N case keeps its own forward-looking suffix (tested below).
    //
    // 2026-04-26 pre-D91 editorial polish (`F9`): the
    // `Completed session N:` ordinal prefix was dropped — the reason
    // line now leads with the stats sentence directly. See
    // `docs/plans/2026-04-26-pre-d91-editorial-polish.md` Item 4.
    expect(out.reason).toBe('40 good passes today out of 60 attempts. Ready when you are.')
    expect(out.reason).not.toContain('Completed session')
  })

  // 2026-04-22 honest-copy pass: the prior low-N branch cited a
  // "pass-rate tuning waits until 50 attempts" threshold. That copy
  // implied an adaptation engine v0b does not have — nothing reads
  // `review.totalAttempts` and changes the next session. Pulled.
  // `TUNING_FLOOR_ATTEMPTS` stays reserved in `policies.ts` for the
  // real `D104` / `O12` pass-rate progression engine when it ships.
  // Until then, every `totalAttempts > 0` submission gets the base
  // stats line + the standard `FORWARD_HOOK`, regardless of N.
  it('uses the standard forward hook for low-N submissions (no tuning-engine claim)', () => {
    const review = makeReview({
      status: 'submitted',
      sessionRpe: 5,
      goodPasses: 10,
      totalAttempts: 20,
    })
    const out = composeSummary({
      review,
      plan: makePlan(1),
      sessionCount: 1,
    })
    expect(out.reason).toBe('10 good passes today out of 20 attempts. Ready when you are.')
    expect(out.reason).not.toMatch(/tuning|more attempt/i)
  })

  it('uses singular pass/attempt in the stats line when counts are 1', () => {
    const review = makeReview({
      status: 'submitted',
      goodPasses: 1,
      totalAttempts: 1,
    })
    const out = composeSummary({
      review,
      plan: makePlan(1),
      sessionCount: 10,
    })
    expect(out.reason).toBe('1 good pass today out of 1 attempt. Ready when you are.')
  })

  it('uses the same forward hook at or above the 50-attempt floor', () => {
    const review = makeReview({
      status: 'submitted',
      goodPasses: 30,
      totalAttempts: 50,
    })
    const out = composeSummary({
      review,
      plan: makePlan(1),
      sessionCount: 4,
    })
    expect(out.reason).toBe('30 good passes today out of 50 attempts. Ready when you are.')
  })

  it('uses the standard forward hook when goodPasses === 0 with attempts recorded', () => {
    const review = makeReview({
      status: 'submitted',
      goodPasses: 0,
      totalAttempts: 10,
    })
    const out = composeSummary({
      review,
      plan: makePlan(1),
      sessionCount: 2,
    })
    expect(out.reason).toBe('0 good passes today out of 10 attempts. Ready when you are.')
  })

  it("returns the notCaptured copy when totalAttempts === 0 ('one more in the book') + Phase F4 forward hook", () => {
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
  // not the pattern-matched `One more in the book.` that reads
  // identical to session 2, 5, 20 on the same path. Shape: single
  // string, same voice, no celebration theatrics, no streak claim.
  // See `docs/plans/2026-04-22-partner-walkthrough-polish.md` item 4.
  it('uses a distinct first-session milestone line when sessionCount === 1 and totalAttempts === 0', () => {
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
    // Explicitly NOT the session-2+ template (and not the dropped
    // `Completed session N` ordinal prefix per `F9` 2026-04-26).
    expect(out.reason).not.toContain('Completed session')
    expect(out.reason).not.toContain('One more in the book')
  })

  it('uses the stats + forward hook line for sessionCount === 1 when attempts were recorded', () => {
    // The first-session milestone line is the no-attempts path; a
    // first-timer who actually logged reps gets the standard stats
    // line + `FORWARD_HOOK`. (No tuning-engine claim in v0b — see
    // sessionSummary.ts honest-copy comment.)
    //
    // 2026-04-26 pre-D91 editorial polish (`F9`): no `Completed
    // session N:` ordinal prefix; the line leads with the stats
    // sentence.
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
    expect(out.reason).toBe('3 good passes today out of 5 attempts. Ready when you are.')
    expect(out.reason).not.toContain('First session')
    expect(out.reason).not.toContain('Completed session')
    expect(out.reason).not.toMatch(/tuning|more attempt/i)
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
