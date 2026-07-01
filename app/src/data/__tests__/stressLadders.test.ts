import { describe, expect, it } from 'vitest'
import { CUE_COMPACT_MAX } from '../../domain/policies'
import { DRILLS } from '../drills'
import {
  STRESS_LADDERS,
  startingStressRung,
  stressLadderBounds,
  stressRungForDrill,
  type StressLadderFocus,
} from '../stressLadders'

const FOCUSES: readonly StressLadderFocus[] = ['pass', 'serve', 'set']

function scopedDrillIdsForFocus(focus: StressLadderFocus): string[] {
  return DRILLS.filter((drill) => drill.skillFocus.includes(focus)).map((drill) => drill.id)
}

function ladderDrillIds(focus: StressLadderFocus): string[] {
  return STRESS_LADDERS[focus].flatMap((rung) => [...rung.drillIds])
}

describe('stress ladder registry invariants', () => {
  // D160: membership is catalog-wide, not m001Candidate-only. Lifecycle
  // drills (recovery/warmup) carry no scoped tag, so they fall out of
  // the census naturally.
  it.each(FOCUSES)('every scoped-tag %s drill appears exactly once in its ladder', (focus) => {
    const expected = scopedDrillIdsForFocus(focus).sort()
    const actual = ladderDrillIds(focus)
    expect([...actual].sort()).toEqual(expected)
    expect(new Set(actual).size).toBe(actual.length)
  })

  it.each(FOCUSES)('%s ladder references only known catalog drills', (focus) => {
    const knownIds = new Set(DRILLS.map((drill) => drill.id))
    for (const id of ladderDrillIds(focus)) {
      expect(knownIds.has(id)).toBe(true)
    }
  })

  it.each(FOCUSES)('%s ladder is steppable: >=4 distinct rungs, >=1 drill per rung', (focus) => {
    const ladder = STRESS_LADDERS[focus]
    const rungValues = ladder.map((rung) => rung.rung)
    expect(new Set(rungValues).size).toBeGreaterThanOrEqual(4)
    for (const rung of ladder) {
      expect(rung.drillIds.length).toBeGreaterThanOrEqual(1)
    }
  })

  it.each(FOCUSES)('%s ladder rungs are strictly ascending from 1', (focus) => {
    const rungValues = STRESS_LADDERS[focus].map((rung) => rung.rung)
    expect(rungValues[0]).toBe(1)
    for (let i = 1; i < rungValues.length; i++) {
      expect(rungValues[i]).toBe(rungValues[i - 1] + 1)
    }
  })

  // D160 bounds pin: the catalog-wide expansion lands every placement on
  // an existing rung index. Growing a ladder's bounds would silently
  // shift startingStressRung, offer gating, and derived-position
  // clamping for existing accept histories — it needs its own decision
  // row, and this test is the tripwire.
  it('per-focus bounds are pinned to the pre-expansion ladders', () => {
    expect(stressLadderBounds('pass')).toEqual({ min: 1, max: 5 })
    expect(stressLadderBounds('serve')).toEqual({ min: 1, max: 4 })
    expect(stressLadderBounds('set')).toEqual({ min: 1, max: 5 })
  })
})

describe('rung progression content (M002.2)', () => {
  // Body-part / internal-focus tokens that disqualify an external-focus
  // cue (Wulf; courtside-copy rule 12b). The cue must name an outcome or
  // environmental referent, not a body part. "Square up" and "reach"
  // describe a movement outcome / partner referent and are allowed.
  const INTERNAL_FOCUS_TOKENS = [
    'platform',
    'knee',
    'elbow',
    'wrist',
    'shoulder',
    'forearm',
    'hips',
    'whole body',
  ]
  // Pass/fail threshold vocabulary that disqualifies an exploration
  // criterion (D154 gating retired; process-framed only).
  const PASS_FAIL_TOKENS = ['%', ' graded', 'must ', 'pass/fail', 'fail', 'score at least']
  // FIVB / coaching jargon that must be glossed or rephrased before it
  // reaches a one-season rec player (courtside-copy rule 2). These fields
  // are unrendered today, but the authoring invariant holds now so the
  // future UI pass inherits clean copy.
  const UNGLOSSED_JARGON_TOKENS = ['out-of-system', 'out of system', 'in-system', 'in system']

  it.each(FOCUSES)('every %s rung carries non-empty progression content', (focus) => {
    for (const rung of STRESS_LADDERS[focus]) {
      expect(rung.intent.trim().length).toBeGreaterThan(0)
      expect(rung.externalFocusCue.trim().length).toBeGreaterThan(0)
      expect(rung.explorationCriterion.trim().length).toBeGreaterThan(0)
      expect(rung.graduationFeel.trim().length).toBeGreaterThan(0)
    }
  })

  it.each(FOCUSES)('%s rung content uses no em-dash (courtside-copy rule 4)', (focus) => {
    for (const rung of STRESS_LADDERS[focus]) {
      for (const field of [
        rung.intent,
        rung.externalFocusCue,
        rung.explorationCriterion,
        rung.graduationFeel,
      ]) {
        expect(field).not.toContain('\u2014')
      }
    }
  })

  it.each(FOCUSES)('%s external-focus cue names no body part (Wulf / rule 12b)', (focus) => {
    for (const rung of STRESS_LADDERS[focus]) {
      const cue = rung.externalFocusCue.toLowerCase()
      for (const token of INTERNAL_FOCUS_TOKENS) {
        expect(cue).not.toContain(token)
      }
    }
  })

  // M002.2 (rung-aware live cue): externalFocusCue can be promoted to the
  // sole live "Now" cue, which leads with the first CUE_SEPARATOR clause and
  // renders un-truncated only when that clause fits the budget. Authoring
  // that keeps every rung cue live-eligible is pinned here so the floor
  // advisory stays empty for the real catalog.
  it.each(FOCUSES)(
    '%s externalFocusCue first clause fits the live-cue budget (CUE_COMPACT_MAX)',
    (focus) => {
      for (const rung of STRESS_LADDERS[focus]) {
        const [firstClause] = rung.externalFocusCue.split(' · ').map((part) => part.trim())
        expect(firstClause.length).toBeLessThanOrEqual(CUE_COMPACT_MAX)
      }
    },
  )

  it.each(FOCUSES)(
    '%s exploration criterion and graduation feel are process-framed, never pass/fail (D154)',
    (focus) => {
      for (const rung of STRESS_LADDERS[focus]) {
        // graduationFeel is descriptive felt-readiness, never a gate, so it
        // is held to the same no-pass/fail bar as the exploration criterion.
        for (const text of [rung.explorationCriterion, rung.graduationFeel]) {
          const lowered = text.toLowerCase()
          for (const token of PASS_FAIL_TOKENS) {
            expect(lowered).not.toContain(token)
          }
        }
      }
    },
  )

  it.each(FOCUSES)('%s rung content carries no unglossed FIVB jargon (rule 2)', (focus) => {
    for (const rung of STRESS_LADDERS[focus]) {
      for (const field of [
        rung.intent,
        rung.externalFocusCue,
        rung.explorationCriterion,
        rung.graduationFeel,
      ]) {
        const lowered = field.toLowerCase()
        for (const token of UNGLOSSED_JARGON_TOKENS) {
          expect(lowered).not.toContain(token)
        }
      }
    }
  })

  // The two fields the M002.2 Review verdict card renders (plan
  // 2026-06-22-001). Em-dash, body-part, pass/fail, and jargon are
  // already covered above for all four fields; this closes the one
  // remaining punctuation gap (en-dash) on the rendered copy so a number
  // range never reaches the screen as "3-5" via a stray en-dash.
  it.each(FOCUSES)('%s rendered-on-Review fields use no en-dash', (focus) => {
    for (const rung of STRESS_LADDERS[focus]) {
      for (const field of [rung.explorationCriterion, rung.graduationFeel]) {
        expect(field).not.toContain('\u2013')
      }
    }
  })
})

describe('stressRungForDrill', () => {
  it('returns the authored rung for an on-ladder drill', () => {
    expect(stressRungForDrill('pass', 'd01')).toBe(1)
    expect(stressRungForDrill('pass', 'd46')).toBe(5)
    expect(stressRungForDrill('serve', 'd33')).toBe(4)
    expect(stressRungForDrill('set', 'd40')).toBe(1)
  })

  it('authors dual-focus drills independently per ladder', () => {
    expect(stressRungForDrill('pass', 'd18')).toBe(5)
    expect(stressRungForDrill('serve', 'd18')).toBe(4)
    expect(stressRungForDrill('pass', 'd08')).toBe(5)
    expect(stressRungForDrill('serve', 'd08')).toBe(4)
    expect(stressRungForDrill('pass', 'd20')).toBe(4)
    expect(stressRungForDrill('set', 'd20')).toBe(4)
    expect(stressRungForDrill('pass', 'd21')).toBe(4)
    expect(stressRungForDrill('set', 'd21')).toBe(4)
  })

  it('returns undefined for a drill not on the focus ladder', () => {
    // d38 is a set drill: querying it under pass is off-ladder.
    expect(stressRungForDrill('pass', 'd38')).toBeUndefined()
    expect(stressRungForDrill('serve', 'd99-unknown')).toBeUndefined()
  })
})

describe('startingStressRung', () => {
  it('maps beginner to the bottom rung on every ladder', () => {
    for (const focus of FOCUSES) {
      expect(startingStressRung(focus, 'beginner')).toBe(1)
    }
  })

  it('maps intermediate to rung 2 on every ladder', () => {
    for (const focus of FOCUSES) {
      expect(startingStressRung(focus, 'intermediate')).toBe(2)
    }
  })

  it('maps advanced to 4, which lands on the serve ladder top rung', () => {
    expect(startingStressRung('serve' as const satisfies StressLadderFocus, 'advanced')).toBe(
      stressLadderBounds('serve').max,
    )
    expect(startingStressRung('pass', 'advanced')).toBe(4)
    expect(startingStressRung('set', 'advanced')).toBe(4)
  })
})
