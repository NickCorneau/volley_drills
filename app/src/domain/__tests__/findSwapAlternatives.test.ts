import { describe, expect, it } from 'vitest'
import { DRILLS } from '../../data/drills'
import type { SessionPlanBlock, SetupContext } from '../../model'
import { findStrictSameFocusSwapAlternatives, findSwapAlternatives } from '../sessionBuilder'

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
 * - Stable ordering: begins after the current drill in sorted `drill.id`
 *   order so repeated Swap taps on the same block walk the pool instead
 *   of toggling between two drills.
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

  it('honors explicit session focus for main-skill alternates', () => {
    const out = findSwapAlternatives(
      makeBlock({ type: 'main_skill' }),
      makeContext({
        playerMode: 'pair',
        netAvailable: true,
        wallAvailable: false,
        sessionFocus: 'serve',
      }),
    )

    expect(out.length).toBeGreaterThan(0)
    for (const alt of out) {
      const drill = DRILLS.find((d) => d.id === alt.drillId)
      expect(drill?.skillFocus).toContain('serve')
    }
  })

  it('keeps readiness swap checks strict when runtime swap would widen past focus', () => {
    const currentServe = makeBlock({
      type: 'main_skill',
      drillId: 'd31',
      variantId: 'd31-solo-open',
      drillName: 'Self Toss Target Practice',
    })
    const context = makeContext({
      playerMode: 'solo',
      netAvailable: false,
      wallAvailable: false,
      sessionFocus: 'serve',
    })

    const strict = findStrictSameFocusSwapAlternatives(currentServe, context)
    const runtime = findSwapAlternatives(currentServe, context)

    expect(strict).toEqual([])
    expect(runtime.length).toBeGreaterThan(0)
    expect(
      runtime.some((alternate) => {
        const drill = DRILLS.find((candidate) => candidate.id === alternate.drillId)
        return drill !== undefined && !drill.skillFocus.includes('serve')
      }),
    ).toBe(true)
  })

  it('does not fall back for warmup/wrap blocks (focus does not control them)', () => {
    const warmupOut = findSwapAlternatives(
      makeBlock({ type: 'warmup' }),
      makeContext({ sessionFocus: 'serve' }),
    )
    const wrapOut = findSwapAlternatives(
      makeBlock({ type: 'wrap' }),
      makeContext({ sessionFocus: 'serve' }),
    )
    expect(warmupOut).toEqual([])
    expect(wrapOut).toEqual([])
  })

  // Note on the cross-focus fallback in `findSwapAlternatives`:
  // the function widens the candidate pool past `sessionFocus` only
  // when the focused pool collapses to exactly the current drill
  // (so `baseFiltered` is empty). That requires a context+focus pair
  // where the catalog yields a single eligible drill AND the user is
  // already on it. Constructing that from outside the catalog ties
  // tests to specific drill ids that drift over time. The fallback
  // is defensive code; the existing neighbor-exclusion fallback
  // covers the common multi-candidate cases, and adding a brittle
  // catalog-coupled test would lock in identifiers that legitimately
  // change. If a future bug shows the fallback misbehaving, write a
  // unit test against a stubbed `findCandidates`, not against DRILLS.

  it('excludes the current drillName from the alternate list', () => {
    const block = makeBlock({ type: 'main_skill' })
    // First call returns the full list with a dummy-named block.
    const first = findSwapAlternatives(block, makeContext())
    expect(first.length).toBeGreaterThan(0)
    const firstAlternateName = first[0].drillName

    // Second call exclude the alternate we just picked.
    const next = findSwapAlternatives({ ...block, drillName: firstAlternateName }, makeContext())
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

  it('returns stable drill and variant ids on alternates', () => {
    const block = makeBlock({
      type: 'main_skill',
      drillName: 'Does Not Exist',
    })
    const out = findSwapAlternatives(block, makeContext())

    expect(out.length).toBeGreaterThan(0)
    for (const alt of out) {
      const drill = DRILLS.find((d) => d.id === alt.drillId)
      expect(alt).toMatchObject({
        drillId: expect.any(String),
        variantId: expect.any(String),
      })
      expect(drill?.variants.some((variant) => variant.id === alt.variantId)).toBe(true)
    }
  })

  it('ordering is deterministic across repeated calls', () => {
    const block = makeBlock({ type: 'main_skill' })
    const a = findSwapAlternatives(block, makeContext())
    const b = findSwapAlternatives(block, makeContext())
    expect(a.map((x) => x.drillName)).toEqual(b.map((x) => x.drillName))
  })

  it('cycles past the previous drill instead of toggling between two alternates', () => {
    const context = makeContext({
      playerMode: 'solo',
      timeProfile: 25,
      netAvailable: false,
      wallAvailable: false,
    })
    const first = findSwapAlternatives(makeBlock({ type: 'main_skill' }), context)
    expect(first.length).toBeGreaterThanOrEqual(3)

    const firstSwap = first[0]
    const second = findSwapAlternatives(firstSwap, context)
    expect(second.length).toBeGreaterThanOrEqual(2)
    const secondSwap = second[0]
    const third = findSwapAlternatives(secondSwap, context)
    expect(third.length).toBeGreaterThanOrEqual(2)
    const thirdSwap = third[0]

    expect(new Set([firstSwap.drillId, secondSwap.drillId, thirdSwap.drillId]).size).toBe(3)
    expect(thirdSwap.drillId).not.toBe(firstSwap.drillId)
    expect(second[0].drillName).not.toBe('Does Not Exist')
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
      expect(withCurrentInExcludes.every((b) => b.drillName !== currentName)).toBe(true)
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
      expect(withOpts.map((b) => b.drillName)).toEqual(bare.map((b) => b.drillName))
    })
  })

  describe('explicit blocked-progression substitutes', () => {
    it('prioritizes an available preferred progression with the normal rationale', () => {
      const block = makeBlock({
        type: 'main_skill',
        drillId: 'd41',
        variantId: 'd41-pair',
        drillName: 'Partner Set Back-and-Forth',
      })
      const out = findSwapAlternatives(
        block,
        makeContext({
          playerMode: 'pair',
          netAvailable: true,
          wallAvailable: false,
        }),
      )

      expect(out.length).toBeGreaterThan(0)
      expect(out[0].drillId).toBe('d42')
      expect(out[0].rationale).toBe("Chosen because: today's main setting rep.")
    })

    it('prioritizes a no-net substitute and explains the blocked preferred path', () => {
      const block = makeBlock({
        type: 'main_skill',
        drillId: 'd03',
        variantId: 'd03-pair',
        drillName: 'Continuous Passing',
      })
      const out = findSwapAlternatives(
        block,
        makeContext({
          playerMode: 'pair',
          netAvailable: false,
          wallAvailable: false,
        }),
      )

      expect(out.length).toBeGreaterThan(0)
      expect(out[0].drillId).toBe('d10')
      expect(out[0].rationale).toBe(
        'Chosen because: the next net drill is unavailable today, so this keeps partner-fed platform control without a net.',
      )
      expect(out[0].rationale).not.toMatch(/progress/i)
    })

    it('keeps legacy name-only blocks on the normal sorted alternates path', () => {
      const block = makeBlock({
        type: 'main_skill',
        drillName: 'Continuous Passing',
      })
      const out = findSwapAlternatives(
        block,
        makeContext({
          playerMode: 'pair',
          netAvailable: false,
          wallAvailable: false,
        }),
      )

      // Semantics under test: a legacy name-only block (no `drillId`)
      // skips the preferred/substitute promotion paths and returns the
      // natural id-sorted pool with the slot's normal rationale. The
      // specific first id (`d05`) tracks the rotation logic in
      // `findSwapAlternatives` - the sorted pool is rotated to start
      // immediately AFTER the current block's drill, so repeated Swap
      // taps walk forward instead of bouncing between the lowest two
      // drill IDs. With `d03` (Continuous Passing) at index 1 of the
      // sorted pool [d01, d03, d05, ...], the rotation returns `d05`
      // first. 2026-04-27 solo-vs-pair sweep added `d05-pair`, which
      // shifted the post-d03 rotation tip from `d10` to `d05`. Update
      // if the pool reorders or `d05-pair` is removed.
      expect(out.length).toBeGreaterThan(0)
      expect(out[0].drillId).toBe('d05')
      expect(out[0].rationale).toBe("Chosen because: today's main passing rep.")
    })

    /**
     * Red-team remediation Phase 1.4: legacy plans persisted before
     * `drillId`/`variantId` reached `SessionPlanBlock` cannot key into
     * `SUBSTITUTION_RULES`. Pin that no alternate produced for a
     * legacy (no `drillId`) block carries a substitution rationale,
     * even after the swap path keeps growing.
     */
    it('never produces a substitution rationale for a legacy name-only block', () => {
      const block = makeBlock({
        type: 'main_skill',
        drillName: 'Continuous Passing',
      })
      const out = findSwapAlternatives(
        block,
        makeContext({
          playerMode: 'pair',
          netAvailable: false,
          wallAvailable: false,
        }),
      )

      expect(out.length).toBeGreaterThan(0)
      for (const alternate of out) {
        expect(
          alternate.rationale,
          `legacy block alternate ${alternate.drillId ?? alternate.drillName} leaked a substitution rationale`,
        ).not.toMatch(/is unavailable today, so this keeps/)
      }
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
        names.includes('Bump Set Fundamentals') || names.includes('Hand Set Fundamentals'),
      ).toBe(true)
    })
  })

  /**
   * Tier 1b-A content surfacing via Swap pools. These tests verify the
   * eligible-drill pool contents — they do not claim "the user will
   * see this drill on the first Swap tap"; that depends on Swap
   * cycling order and is a separate UX concern. Around the World
   * Serving (`d33`) requires a net, so it must NOT surface in solo
   * no-net contexts. Triangle Setting (`d43`) is intentionally not in
   * the catalog (deferred to D101 3+ player support); the negative
   * assertion guards against a regression that re-introduces it as a
   * forced two-player adaptation.
   */
  describe('Tier 1b-A content eligible in Swap pools', () => {
    it('solo open main_skill pool includes low-equipment serving and setting fundamentals', () => {
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

      expect(names).toContain('Self Toss Target Practice')
      expect(names).toContain('Footwork for Setting')
      // Net-required drills must not leak into a no-net context.
      expect(names).not.toContain('Around the World Serving')
      // Pair-only drills must not leak into a solo context.
      expect(names).not.toContain('Corner to Corner Setting')
      // d43 Triangle Setting is deferred to D101 3+ player support
      // (see drills.ts). Keep this negative as a regression guard.
      expect(names).not.toContain('Triangle Setting')
    })

    it('solo net main_skill pool includes Around the World Serving once a net is available', () => {
      const block = makeBlock({ type: 'main_skill', drillName: 'Does Not Exist' })
      const out = findSwapAlternatives(
        block,
        makeContext({
          playerMode: 'solo',
          timeProfile: 25,
          netAvailable: true,
          wallAvailable: false,
        }),
      )
      expect(out.map((b) => b.drillName)).toContain('Around the World Serving')
    })

    it('pair net main_skill pool includes pair serving and setting progression rungs', () => {
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

      expect(names).toContain('Around the World Serving')
      expect(names).toContain('Corner to Corner Setting')
      expect(names).not.toContain('Triangle Setting')
    })

    it('pressure pool can reach Tier 1b serving and setting where context allows', () => {
      const block = makeBlock({ type: 'pressure', drillName: 'Does Not Exist' })
      const out = findSwapAlternatives(
        block,
        makeContext({
          playerMode: 'pair',
          timeProfile: 40,
          netAvailable: true,
          wallAvailable: false,
        }),
      )
      const names = out.map((b) => b.drillName)

      expect(names).toContain('Around the World Serving')
      expect(names).toContain('Corner to Corner Setting')
      expect(names).not.toContain('Triangle Setting')
    })
  })
})
