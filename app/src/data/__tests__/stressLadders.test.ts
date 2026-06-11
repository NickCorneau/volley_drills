import { describe, expect, it } from 'vitest'
import { DRILLS } from '../drills'
import {
  STRESS_LADDERS,
  startingStressRung,
  stressLadderBounds,
  stressRungForDrill,
  type StressLadderFocus,
} from '../stressLadders'

const FOCUSES: readonly StressLadderFocus[] = ['pass', 'serve', 'set']

function candidateDrillIdsForFocus(focus: StressLadderFocus): string[] {
  return DRILLS.filter(
    (drill) => drill.m001Candidate && drill.skillFocus.includes(focus),
  ).map((drill) => drill.id)
}

function ladderDrillIds(focus: StressLadderFocus): string[] {
  return STRESS_LADDERS[focus].flatMap((rung) => [...rung.drillIds])
}

describe('stress ladder registry invariants', () => {
  it.each(FOCUSES)(
    'every m001Candidate %s drill appears exactly once in its ladder',
    (focus) => {
      const expected = candidateDrillIdsForFocus(focus).sort()
      const actual = ladderDrillIds(focus)
      expect([...actual].sort()).toEqual(expected)
      expect(new Set(actual).size).toBe(actual.length)
    },
  )

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
})

describe('stressRungForDrill', () => {
  it('returns the authored rung for an on-ladder drill', () => {
    expect(stressRungForDrill('pass', 'd01')).toBe(1)
    expect(stressRungForDrill('pass', 'd46')).toBe(5)
    expect(stressRungForDrill('serve', 'd33')).toBe(4)
    expect(stressRungForDrill('set', 'd40')).toBe(1)
  })

  it('authors the dual-focus d18 independently per ladder', () => {
    expect(stressRungForDrill('pass', 'd18')).toBe(5)
    expect(stressRungForDrill('serve', 'd18')).toBe(4)
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
    expect(startingStressRung(('serve' as const) satisfies StressLadderFocus, 'advanced')).toBe(
      stressLadderBounds('serve').max,
    )
    expect(startingStressRung('pass', 'advanced')).toBe(4)
    expect(startingStressRung('set', 'advanced')).toBe(4)
  })
})
