import {
  attributeTrainedSessions,
  eligibleTrainingSessions,
  isScopedFocus,
  type TerminalSessionWithPlan,
} from '../eligibleSessions'
import type { SessionPlanBlock, SessionReview } from '../../model'

function review(overrides: Partial<SessionReview> = {}): SessionReview {
  return {
    id: overrides.id ?? 'review-1',
    executionLogId: 'exec-1',
    sessionRpe: 5,
    goodPasses: 0,
    totalAttempts: 0,
    submittedAt: 1000,
    status: 'submitted',
    eligibleForAdaptation: true,
    ...overrides,
  }
}

// A main_skill block whose drillName resolves to a known pass-focus
// drill. Using a real catalog drill name keeps inferSessionFocus honest.
function mainSkillBlocks(drillName: string): SessionPlanBlock[] {
  return [
    {
      id: 'b1',
      type: 'main_skill',
      drillName,
      shortName: drillName,
      durationMinutes: 10,
      coachingCue: '',
      courtsideInstructions: '',
      required: true,
    },
  ]
}

describe('eligibleTrainingSessions', () => {
  it('keeps submitted + eligible reviews', () => {
    const rows = [review({ id: 'a' }), review({ id: 'b' })]
    expect(eligibleTrainingSessions(rows).map((r) => r.id)).toEqual(['a', 'b'])
  })

  it('excludes skipped, draft, and non-eligible reviews', () => {
    const rows = [
      review({ id: 'ok' }),
      review({ id: 'skipped', status: 'skipped' }),
      review({ id: 'draft', status: 'draft' }),
      review({ id: 'late', eligibleForAdaptation: false }),
      review({ id: 'unset', eligibleForAdaptation: undefined }),
    ]
    expect(eligibleTrainingSessions(rows).map((r) => r.id)).toEqual(['ok'])
  })
})

describe('isScopedFocus', () => {
  it('accepts pass/serve/set and rejects everything else', () => {
    expect(isScopedFocus('pass')).toBe(true)
    expect(isScopedFocus('serve')).toBe(true)
    expect(isScopedFocus('set')).toBe(true)
    expect(isScopedFocus('warmup')).toBe(false)
    expect(isScopedFocus('movement')).toBe(false)
    expect(isScopedFocus('partial')).toBe(false)
  })
})

describe('attributeTrainedSessions', () => {
  it('attributes a terminal session to its main_skill focus with endedAt as trainedAt', () => {
    const input: TerminalSessionWithPlan[] = [
      { endedAt: 4242, planBlocks: mainSkillBlocks('Continuous Passing'), hasCompletedBlock: true },
    ]
    expect(attributeTrainedSessions(input)).toEqual([{ focus: 'pass', trainedAt: 4242 }])
  })

  it('counts a trained session regardless of review state (no review gate)', () => {
    // The plan-ordering basis is execution history, not eligible reviews:
    // a session the user ran but never reviewed still moves its clock.
    const input: TerminalSessionWithPlan[] = [
      { endedAt: 100, planBlocks: mainSkillBlocks('Continuous Passing'), hasCompletedBlock: true },
      {
        endedAt: 200,
        planBlocks: mainSkillBlocks('First to 10 Serving'),
        hasCompletedBlock: true,
      },
    ]
    expect(attributeTrainedSessions(input)).toEqual([
      { focus: 'pass', trainedAt: 100 },
      { focus: 'serve', trainedAt: 200 },
    ])
  })

  it('drops sessions whose focus is partial (unmatched drill) or out of scope', () => {
    const input: TerminalSessionWithPlan[] = [
      { endedAt: 100, planBlocks: mainSkillBlocks('Not A Real Drill Name'), hasCompletedBlock: true },
      { endedAt: 200, planBlocks: [], hasCompletedBlock: true },
    ]
    expect(attributeTrainedSessions(input)).toEqual([])
  })

  it('excludes zero-completed-block sessions — zero work never moves the staleness clock', () => {
    const input: TerminalSessionWithPlan[] = [
      { endedAt: 100, planBlocks: mainSkillBlocks('Continuous Passing'), hasCompletedBlock: false },
      {
        endedAt: 200,
        planBlocks: mainSkillBlocks('First to 10 Serving'),
        hasCompletedBlock: true,
      },
    ]
    expect(attributeTrainedSessions(input)).toEqual([{ focus: 'serve', trainedAt: 200 }])
  })
})
