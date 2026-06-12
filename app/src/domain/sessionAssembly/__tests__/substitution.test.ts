import { describe, expect, it } from 'vitest'
import type { SubstitutionRule } from '../../../data/substitutionRules'
import type { BlockSlot, SetupContext } from '../../../model'
import { pickMainSkillSubstitute } from '../substitution'

/**
 * U6 (D159): the build-time substitute choice is rung-aware — the
 * firing rule's authored substitutes are ordered by stress-ladder
 * distance to the steered rung (stable sort, authored order breaks
 * ties). Position-less calls keep pure authored order, which is also
 * the unchanged semantic of the mid-run Swap path (`findSubstitute`,
 * live D157 deferral).
 *
 * Fixtures use the real pair/open pass candidate pool: d01 (rung 1),
 * d03/d05 (rung 2), d07/d10 (rung 3), d11 (rung 4), d46/d50 (rung 5).
 * The synthetic rules reference only drills present in that pool so
 * the test exercises ordering, not eligibility.
 */

const mainSkillSlot: BlockSlot = {
  type: 'main_skill',
  durationMinMinutes: 5,
  durationMaxMinutes: 10,
  intent: 'Fixture pair-open passing slot',
  required: true,
  skillTags: ['pass'],
}

const pairOpenPass: SetupContext = {
  playerMode: 'pair',
  timeProfile: 25,
  netAvailable: false,
  wallAvailable: false,
  sessionFocus: 'pass',
}

function rule(substituteDrillIds: readonly string[]): SubstitutionRule {
  return {
    fromDrillId: 'd03',
    preferredToDrillId: 'd04',
    blockedBy: 'needsNet',
    substituteDrillIds,
    preservedIntent: 'fixture intent',
    transfer: 'partial',
  }
}

describe('pickMainSkillSubstitute (U6 rung-aware choice)', () => {
  it('picks the rung-nearest authored substitute when steered', () => {
    // Authored order says d05 (rung 2) first; position 4 makes d11
    // (rung 4, distance 0) the steered choice.
    const result = pickMainSkillSubstitute(
      mainSkillSlot,
      pairOpenPass,
      new Set(),
      'd03',
      [rule(['d05', 'd10', 'd11'])],
      { stressPositions: { pass: 4 } },
    )
    expect(result?.candidate.drill.id).toBe('d11')
  })

  it('breaks rung-distance ties by authored order', () => {
    // d07 and d10 share rung 3 — equal distance from any position, so
    // the authored-first substitute wins.
    const result = pickMainSkillSubstitute(
      mainSkillSlot,
      pairOpenPass,
      new Set(),
      'd03',
      [rule(['d07', 'd10'])],
      { stressPositions: { pass: 1 } },
    )
    expect(result?.candidate.drill.id).toBe('d07')
  })

  it('keeps pure authored order without positions', () => {
    const result = pickMainSkillSubstitute(
      mainSkillSlot,
      pairOpenPass,
      new Set(),
      'd03',
      [rule(['d05', 'd10', 'd11'])],
    )
    expect(result?.candidate.drill.id).toBe('d05')
  })

  it('keeps authored order when positions exist but the session focus does not', () => {
    const unfocused: SetupContext = { ...pairOpenPass }
    delete unfocused.sessionFocus
    const result = pickMainSkillSubstitute(
      mainSkillSlot,
      unfocused,
      new Set(),
      'd03',
      [rule(['d05', 'd10', 'd11'])],
      { stressPositions: { pass: 4 } },
    )
    expect(result?.candidate.drill.id).toBe('d05')
  })

  it('skips substitutes already reserved by usedDrillIds', () => {
    // d11 is the rung-nearest substitute at position 4, but it is
    // already used, so the next-nearest available substitute wins.
    const result = pickMainSkillSubstitute(
      mainSkillSlot,
      pairOpenPass,
      new Set(['d11']),
      'd03',
      [rule(['d05', 'd10', 'd11'])],
      { stressPositions: { pass: 4 } },
    )
    expect(result?.candidate.drill.id).toBe('d10')
  })

  it('returns undefined when no rule fires for the last drill', () => {
    const result = pickMainSkillSubstitute(
      mainSkillSlot,
      pairOpenPass,
      new Set(),
      'd99',
      [rule(['d05'])],
      { stressPositions: { pass: 4 } },
    )
    expect(result).toBeUndefined()
  })
})
