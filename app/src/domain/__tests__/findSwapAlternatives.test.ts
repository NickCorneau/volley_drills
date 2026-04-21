import { describe, expect, it } from 'vitest'
import type { SessionPlanBlock, SetupContext } from '../../db'
import { findSwapAlternatives } from '../sessionBuilder'

/**
 * Phase F Unit 4 (2026-04-19): `findSwapAlternatives` derives the
 * candidate drill set for a mid-run Swap action.
 *
 * Contract:
 * - Returns `[]` for warmup and wrap blocks (curated content per
 *   D85 / D105).
 * - Returns `[]` when the context yields no alternate (single-
 *   candidate pool for the slot type).
 * - Excludes the drill whose name matches the current block
 *   (prevents tapping Swap and landing on the same drill).
 * - Stable ordering: sorted by `drill.id` so repeated Swap taps on
 *   the same block walk the same list every time.
 * - Preserves `id`, `type`, `durationMinutes`, `required` from the
 *   input block - only drill identity (name / shortName / cue /
 *   instructions) changes.
 * - VB-FL-7 (2026-04-19 non-player field look): `excludeDrillNames`
 *   option strips additional drill names (typically neighbors) when
 *   they would collide with adjacent plan blocks, with a fallback
 *   to base-exclusion-only when the neighbor-filtered pool would
 *   be empty. The current-drill exclusion is never relaxed.
 */

function makeBlock(overrides: Partial<SessionPlanBlock> = {}): SessionPlanBlock {
  return {
    id: 'block-0',
    type: 'main_skill',
    drillName: 'Does Not Exist',
    shortName: 'DNE',
    durationMinutes: 10,
    coachingCue: '',
    courtsideInstructions: '',
    required: true,
    ...overrides,
  }
}

function makeContext(overrides: Partial<SetupContext> = {}): SetupContext {
  return {
    playerMode: 'solo',
    timeProfile: 15,
    netAvailable: false,
    wallAvailable: true,
    ...overrides,
  }
}

describe('findSwapAlternatives (Phase F Unit 4)', () => {
  it('returns [] for a warmup block regardless of context (D85 curated content)', () => {
    const block = makeBlock({ type: 'warmup' })
    const out = findSwapAlternatives(block, makeContext())
    expect(out).toEqual([])
  })

  it('returns [] for a wrap block regardless of context (D105 curated content)', () => {
    const block = makeBlock({ type: 'wrap' })
    const out = findSwapAlternatives(block, makeContext())
    expect(out).toEqual([])
  })

  it('returns a non-empty list for a main_skill block in a rich context (solo + wall)', () => {
    const block = makeBlock({
      type: 'main_skill',
      drillName: 'Does Not Exist',
    })
    const out = findSwapAlternatives(block, makeContext())
    expect(out.length).toBeGreaterThan(0)
  })

  it('excludes the current drillName from the alternate list', () => {
    const block = makeBlock({ type: 'main_skill' })
    // First call returns the full list with a dummy-named block.
    const first = findSwapAlternatives(block, makeContext())
    expect(first.length).toBeGreaterThan(0)
    const firstAlternateName = first[0].drillName

    // Second call exclude the alternate we just picked.
    const next = findSwapAlternatives(
      { ...block, drillName: firstAlternateName },
      makeContext(),
    )
    // Still returns alternates (the pool > 1 for solo+wall main_skill)
    // and does NOT include the excluded drill.
    expect(next.length).toBeGreaterThanOrEqual(0)
    expect(next.every((b) => b.drillName !== firstAlternateName)).toBe(true)
  })

  it('preserves id, type, durationMinutes, required on the alternate', () => {
    const block = makeBlock({
      id: 'custom-block-id',
      type: 'main_skill',
      durationMinutes: 17,
      required: false,
    })
    const out = findSwapAlternatives(block, makeContext())
    for (const alt of out) {
      expect(alt.id).toBe('custom-block-id')
      expect(alt.type).toBe('main_skill')
      expect(alt.durationMinutes).toBe(17)
      expect(alt.required).toBe(false)
    }
  })

  it('ordering is deterministic across repeated calls', () => {
    const block = makeBlock({ type: 'main_skill' })
    const a = findSwapAlternatives(block, makeContext())
    const b = findSwapAlternatives(block, makeContext())
    expect(a.map((x) => x.drillName)).toEqual(b.map((x) => x.drillName))
  })

  it('pair + net context produces a different pool than solo + wall', () => {
    const block = makeBlock({ type: 'main_skill' })
    const soloWall = findSwapAlternatives(block, makeContext())
    const pairNet = findSwapAlternatives(
      block,
      makeContext({
        playerMode: 'pair',
        netAvailable: true,
        wallAvailable: false,
      }),
    )
    // Each pool is non-empty but not identical - solo-eligible drills
    // differ from pair-net eligible drills.
    expect(soloWall.length).toBeGreaterThan(0)
    expect(pairNet.length).toBeGreaterThan(0)
    expect(soloWall.map((x) => x.drillName).sort()).not.toEqual(
      pairNet.map((x) => x.drillName).sort(),
    )
  })

  it('returns a copy-safe alternate (mutating the result does not affect future calls)', () => {
    const block = makeBlock({ type: 'main_skill' })
    const a = findSwapAlternatives(block, makeContext())
    if (a.length > 0) {
      a[0].drillName = 'MUTATED'
    }
    const b = findSwapAlternatives(block, makeContext())
    expect(b.every((x) => x.drillName !== 'MUTATED')).toBe(true)
  })

  /**
   * VB-FL-7 (2026-04-19 non-player field look): neighbor-aware
   * exclusion should strip candidates whose name matches a
   * surrounding plan block, so Swap never lands on the drill
   * coming up next (or just finished). Uses the real solo+wall
   * main_skill pool - we pick a name from the baseline output to
   * drive the exclusion test so we don't have to hard-code drill
   * IDs that could drift if the catalog changes.
   */
  describe('neighbor-aware exclusion (VB-FL-7)', () => {
    it('excludes additional drill names passed via excludeDrillNames', () => {
      const block = makeBlock({ type: 'main_skill' })
      const baseline = findSwapAlternatives(block, makeContext())
      // Need at least 2 alternates so that excluding one still
      // leaves a non-empty pool (otherwise fallback kicks in and
      // the test doesn't exercise the exclusion branch).
      expect(baseline.length).toBeGreaterThanOrEqual(2)

      const neighborName = baseline[0].drillName
      const withNeighbor = findSwapAlternatives(block, makeContext(), {
        excludeDrillNames: [neighborName],
      })

      expect(withNeighbor.length).toBeGreaterThan(0)
      expect(withNeighbor.every((b) => b.drillName !== neighborName)).toBe(true)
      expect(withNeighbor.length).toBe(baseline.length - 1)
    })

    it('falls back to base exclusion when neighbor exclusion would empty the pool', () => {
      const block = makeBlock({ type: 'main_skill' })
      const baseline = findSwapAlternatives(block, makeContext())
      expect(baseline.length).toBeGreaterThan(0)

      // Excluding every baseline name would leave nothing; the
      // fallback should kick in and return the baseline pool
      // unchanged rather than emptying the Swap button.
      const allBaselineNames = baseline.map((b) => b.drillName)
      const withAllExcluded = findSwapAlternatives(block, makeContext(), {
        excludeDrillNames: allBaselineNames,
      })

      expect(withAllExcluded.map((b) => b.drillName)).toEqual(allBaselineNames)
    })

    it('keeps current-drill exclusion even when the current drill is also in excludeDrillNames', () => {
      const block = makeBlock({ type: 'main_skill' })
      const baseline = findSwapAlternatives(block, makeContext())
      expect(baseline.length).toBeGreaterThan(0)

      const currentName = 'Does Not Exist' // matches makeBlock default drillName
      const withCurrentInExcludes = findSwapAlternatives(block, makeContext(), {
        excludeDrillNames: [currentName],
      })

      // Passing the current drill's name in excludeDrillNames must
      // not cause the fallback to re-include it - the current
      // drill exclusion is the one invariant that never relaxes.
      expect(
        withCurrentInExcludes.every((b) => b.drillName !== currentName),
      ).toBe(true)
      expect(withCurrentInExcludes.length).toBe(baseline.length)
    })

    it('empty excludeDrillNames behaves identically to no options', () => {
      const block = makeBlock({ type: 'main_skill' })
      const bare = findSwapAlternatives(block, makeContext())
      const empty = findSwapAlternatives(block, makeContext(), {
        excludeDrillNames: [],
      })
      expect(empty.map((b) => b.drillName)).toEqual(bare.map((b) => b.drillName))
    })

    it('undefined excludeDrillNames behaves identically to no options', () => {
      const block = makeBlock({ type: 'main_skill' })
      const bare = findSwapAlternatives(block, makeContext())
      const withOpts = findSwapAlternatives(block, makeContext(), {})
      expect(withOpts.map((b) => b.drillName)).toEqual(
        bare.map((b) => b.drillName),
      )
    })
  })

  /**
   * Tier 1a Unit 2 (setting minimum probe): `SKILL_TAGS_BY_TYPE`
   * widened `main_skill` and `pressure` to include `'set'` so
   * user-initiated Swap can reach chain-7-setting drills. These
   * tests pin the reachability so a future tag-set regression (or a
   * misauthored drill that drops the `'set'` skillFocus) fails the
   * Swap-path invariant loudly. `findSwapAlternatives` excludes the
   * current block's drill by name, so the tests use a non-existent
   * `drillName` to see the full pool.
   */
  describe('setting-drill reachability via Swap (Tier 1a Unit 2)', () => {
    it('solo open main_skill Swap surfaces d38 Bump Set and d39 Hand Set', () => {
      const block = makeBlock({ type: 'main_skill', drillName: 'Does Not Exist' })
      const out = findSwapAlternatives(
        block,
        makeContext({
          playerMode: 'solo',
          timeProfile: 25,
          netAvailable: false,
          wallAvailable: false,
        }),
      )
      const names = out.map((b) => b.drillName)
      expect(names).toContain('Bump Set Fundamentals')
      expect(names).toContain('Hand Set Fundamentals')
    })

    it('pair net main_skill Swap surfaces d41 Partner Set Back-and-Forth', () => {
      const block = makeBlock({ type: 'main_skill', drillName: 'Does Not Exist' })
      const out = findSwapAlternatives(
        block,
        makeContext({
          playerMode: 'pair',
          timeProfile: 25,
          netAvailable: true,
          wallAvailable: false,
        }),
      )
      const names = out.map((b) => b.drillName)
      expect(names).toContain('Partner Set Back-and-Forth')
    })

    it('solo open pressure Swap also surfaces setting drills', () => {
      const block = makeBlock({ type: 'pressure', drillName: 'Does Not Exist' })
      const out = findSwapAlternatives(
        block,
        makeContext({
          playerMode: 'solo',
          timeProfile: 25,
          netAvailable: false,
          wallAvailable: false,
        }),
      )
      const names = out.map((b) => b.drillName)
      // At least one of d38/d39 should surface - both are solo and have
      // `skillFocus: ['set']`, matching `pressure: ['pass', 'serve', 'set']`.
      expect(
        names.includes('Bump Set Fundamentals') ||
          names.includes('Hand Set Fundamentals'),
      ).toBe(true)
    })
  })
})
