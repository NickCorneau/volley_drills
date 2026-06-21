import { describe, expect, it } from 'vitest'
import type { SetupContext } from '../../../model'
import { composeAcceptConsequence } from '../acceptConsequence'

/**
 * Trust-loop U3 (R4/R5, KTD8) — the hedged drill-exemplar caption on
 * the Review accept option.
 *
 * Ladder facts used below (data/stressLadders.ts + data/drills.ts):
 * - set rung 1 = d38/d39/d40 (solo-eligible), rung 2 = d41 (pair-only).
 * - pass rung 3 = d07 (intermediate+, solo-open variant), d09
 *   (assembly-blocked: needsLines), d10 (pair-only).
 */

const pairOpenSet: SetupContext = {
  playerMode: 'pair',
  timeProfile: 25,
  netAvailable: false,
  wallAvailable: false,
  sessionFocus: 'set',
  playerLevel: 'beginner',
}

const soloOpenSet: SetupContext = { ...pairOpenSet, playerMode: 'solo' }

const soloOpenPass: SetupContext = {
  playerMode: 'solo',
  timeProfile: 25,
  netAvailable: false,
  wallAvailable: false,
  sessionFocus: 'pass',
  playerLevel: 'intermediate',
}

describe('composeAcceptConsequence', () => {
  it('AE1: set position 1, "more" offered → names the rung-2 drill', () => {
    const line = composeAcceptConsequence({
      focus: 'set',
      direction: 'more',
      position: 1,
      context: pairOpenSet,
    })
    expect(line).toBe('Setting sessions lean toward drills like Partner Set Back-and-Forth.')
  })

  it('"less" at set position 2 → names the first-authored rung-1 drill', () => {
    const line = composeAcceptConsequence({
      focus: 'set',
      direction: 'less',
      position: 2,
      context: pairOpenSet,
    })
    expect(line).toBe('Setting sessions lean toward drills like Bump Set Fundamentals.')
  })

  it('context-eligibility: a solo session surfaces the solo-eligible rung-2 set drill', () => {
    // 2026-06-21 roster-depth wave: set rung 2 was pair-only (d41) and
    // rendered no caption for a solo session. d56 (Set and Move, FIVB 4.1)
    // added a solo continuous-rhythm route, so a solo set session now
    // names that solo-eligible rung-2 drill instead of falling silent.
    const line = composeAcceptConsequence({
      focus: 'set',
      direction: 'more',
      position: 1,
      context: soloOpenSet,
    })
    expect(line).toBe('Setting sessions lean toward drills like Set and Move.')
  })

  it('candidate rule: first-authored assembly-available drill, excluding the just-trained one', () => {
    // Pass rung 3 without exclusion → d07 (first authored, solo-open
    // eligible at intermediate); d09 is assembly-blocked (needsLines).
    const unexcluded = composeAcceptConsequence({
      focus: 'pass',
      direction: 'more',
      position: 2,
      context: soloOpenPass,
    })
    expect(unexcluded).toBe('Passing sessions lean toward drills like Pass & Look.')

    // Excluding just-trained d07 in solo: d09 blocked, d10 pair-only →
    // an all-ineligible rung renders no caption.
    const excludedSolo = composeAcceptConsequence({
      focus: 'pass',
      direction: 'more',
      position: 2,
      context: soloOpenPass,
      excludeDrillId: 'd07',
    })
    expect(excludedSolo).toBeNull()

    // Same exclusion in pair mode: d10 becomes eligible.
    const excludedPair = composeAcceptConsequence({
      focus: 'pass',
      direction: 'more',
      position: 2,
      context: { ...soloOpenPass, playerMode: 'pair' },
      excludeDrillId: 'd07',
    })
    expect(excludedPair).toBe('Passing sessions lean toward drills like The 6-Legged Monster.')
  })

  it('is deterministic across calls', () => {
    const input = {
      focus: 'set' as const,
      direction: 'more' as const,
      position: 1,
      context: pairOpenSet,
    }
    expect(composeAcceptConsequence(input)).toBe(composeAcceptConsequence(input))
  })

  it('keep direction renders no caption', () => {
    const line = composeAcceptConsequence({
      focus: 'set',
      direction: 'keep',
      position: 1,
      context: pairOpenSet,
    })
    expect(line).toBeNull()
  })

  it('defensive: a clamped direction (prospective == current) renders no caption', () => {
    const line = composeAcceptConsequence({
      focus: 'set',
      direction: 'less',
      position: 1,
      context: pairOpenSet,
    })
    expect(line).toBeNull()
  })

  it('AE6 (Review slice): captions carry no em-dash and no reserved stress vocabulary', () => {
    const lines = [
      composeAcceptConsequence({ focus: 'set', direction: 'more', position: 1, context: pairOpenSet }),
      composeAcceptConsequence({ focus: 'set', direction: 'less', position: 2, context: pairOpenSet }),
      composeAcceptConsequence({ focus: 'pass', direction: 'more', position: 2, context: soloOpenPass }),
    ].filter((line): line is string => line !== null)
    expect(lines.length).toBeGreaterThan(0)
    for (const line of lines) {
      expect(line).not.toContain('\u2014')
      expect(line.toLowerCase()).not.toContain('rung')
      expect(line.toLowerCase()).not.toContain('ladder')
      expect(line.toLowerCase()).not.toContain('steer')
      // ≤45 words (carry-forward voice contract).
      expect(line.split(/\s+/).length).toBeLessThanOrEqual(45)
    }
  })
})
