import { describe, expect, it } from 'vitest'
import { DRILLS } from '../data/drills'
import {
  buildDraft,
  buildDraftWithAssemblyTrace,
  buildRecoveryDraft,
  deriveBlockRationale,
  estimateRecoverySessionMinutes,
} from './sessionBuilder'
import {
  candidateDurationCapacity,
  findCandidates,
  pickForSlot,
} from './sessionAssembly/candidates'
import { createSeededRandom } from './sessionAssembly/random'
import type { BlockSlot, PlayerLevel, SetupContext } from '../model'

const variantById = new Map(
  DRILLS.flatMap((drill) => drill.variants.map((variant) => [variant.id, variant] as const)),
)

describe('sessionBuilder', () => {
  it('pins fixed-seed session assembly output while algorithm version stays stable', () => {
    const draft = buildDraft(
      {
        playerMode: 'pair',
        timeProfile: 25,
        netAvailable: false,
        wallAvailable: false,
      },
      { assemblySeed: 'batch3-golden-pair-open-25' },
    )

    expect(draft?.assemblyAlgorithmVersion).toBe(4)
    expect(
      draft?.blocks.map((block) => ({
        type: block.type,
        durationMinutes: block.durationMinutes,
        drillId: block.drillId,
        variantId: block.variantId,
      })),
    ).toEqual([
      {
        type: 'warmup',
        durationMinutes: 3,
        drillId: 'd28',
        variantId: 'd28-solo',
      },
      {
        type: 'technique',
        durationMinutes: 6,
        drillId: 'd05',
        variantId: 'd05-pair',
      },
      {
        type: 'movement_proxy',
        durationMinutes: 5,
        drillId: 'd46',
        variantId: 'd46-pair-open',
      },
      {
        type: 'main_skill',
        durationMinutes: 7,
        drillId: 'd33',
        variantId: 'd33-pair-open',
      },
      {
        type: 'wrap',
        durationMinutes: 4,
        drillId: 'd26',
        variantId: 'd26-solo',
      },
    ])
  })

  it('prefers a duration-fit main-skill candidate over D01 for longer allocations', () => {
    const slot: BlockSlot = {
      type: 'main_skill',
      durationMinMinutes: 5,
      durationMaxMinutes: 7,
      intent: 'Fixture main-skill slot',
      required: true,
      skillTags: ['pass'],
    }
    const context: SetupContext = {
      playerMode: 'solo',
      timeProfile: 25,
      netAvailable: false,
      wallAvailable: false,
      sessionFocus: 'pass',
      playerLevel: 'beginner',
    }

    let seedThatPicksD01: string | undefined
    for (let i = 0; i < 500 && seedThatPicksD01 === undefined; i++) {
      const seed = `d01-duration-fit-${i}`
      const pick = pickForSlot(slot, context, new Set(), createSeededRandom(seed), {
        playerLevel: 'beginner',
      })
      if (pick?.variant.id === 'd01-solo') {
        seedThatPicksD01 = seed
      }
    }

    expect(seedThatPicksD01).toBeDefined()
    const rerouted = pickForSlot(slot, context, new Set(), createSeededRandom(seedThatPicksD01!), {
      playerLevel: 'beginner',
      targetDurationMinutes: 6,
    })

    expect(rerouted?.variant.id).not.toBe('d01-solo')
    expect(rerouted?.variant.workload.durationMaxMinutes).toBeGreaterThanOrEqual(6)
    expect(
      rerouted?.variant.workload.fatigueCap?.maxMinutes ?? Number.POSITIVE_INFINITY,
    ).toBeGreaterThanOrEqual(6)
  })

  it('keeps main-skill fallback behavior when no candidate fits the target duration', () => {
    const slot: BlockSlot = {
      type: 'main_skill',
      durationMinMinutes: 5,
      durationMaxMinutes: 7,
      intent: 'Fixture main-skill slot',
      required: true,
      skillTags: ['pass'],
    }
    const context: SetupContext = {
      playerMode: 'solo',
      timeProfile: 25,
      netAvailable: false,
      wallAvailable: false,
      sessionFocus: 'pass',
      playerLevel: 'beginner',
    }

    let seedThatPicksD01: string | undefined
    for (let i = 0; i < 500 && seedThatPicksD01 === undefined; i++) {
      const seed = `no-duration-fit-${i}`
      const pick = pickForSlot(slot, context, new Set(), createSeededRandom(seed), {
        playerLevel: 'beginner',
      })
      if (pick?.variant.id === 'd01-solo') {
        seedThatPicksD01 = seed
      }
    }

    expect(seedThatPicksD01).toBeDefined()
    const pick = pickForSlot(slot, context, new Set(), createSeededRandom(seedThatPicksD01!), {
      playerLevel: 'beginner',
      targetDurationMinutes: 999,
    })
    const strongestNonD01 = findCandidates(slot, context, { playerLevel: 'beginner' })
      .filter((candidate) => candidate.drill.id !== 'd01')
      .reduce((best, candidate) =>
        candidateDurationCapacity(candidate) > candidateDurationCapacity(best) ? candidate : best,
      )

    expect(pick?.variant.id).toBe(strongestNonD01.variant.id)
  })

  it('does not apply target-duration preference to non-D01 main-skill defaults', () => {
    const slot: BlockSlot = {
      type: 'main_skill',
      durationMinMinutes: 5,
      durationMaxMinutes: 7,
      intent: 'Fixture main-skill slot',
      required: true,
      skillTags: ['pass'],
    }
    const context: SetupContext = {
      playerMode: 'solo',
      timeProfile: 25,
      netAvailable: false,
      wallAvailable: false,
      sessionFocus: 'pass',
      playerLevel: 'beginner',
    }

    let seedThatPicksNonD01: string | undefined
    let baselineVariantId: string | undefined
    for (let i = 0; i < 500 && seedThatPicksNonD01 === undefined; i++) {
      const seed = `non-d01-duration-fit-${i}`
      const pick = pickForSlot(slot, context, new Set(), createSeededRandom(seed), {
        playerLevel: 'beginner',
      })
      if (pick !== undefined && pick.drill.id !== 'd01') {
        seedThatPicksNonD01 = seed
        baselineVariantId = pick.variant.id
      }
    }

    expect(seedThatPicksNonD01).toBeDefined()
    const targeted = pickForSlot(
      slot,
      context,
      new Set(),
      createSeededRandom(seedThatPicksNonD01!),
      {
        playerLevel: 'beginner',
        targetDurationMinutes: 999,
      },
    )

    expect(targeted?.variant.id).toBe(baselineVariantId)
  })

  it('prefers D49 for over-cap advanced setting main-skill allocations', () => {
    const slot: BlockSlot = {
      type: 'main_skill',
      durationMinMinutes: 5,
      durationMaxMinutes: 7,
      intent: 'Fixture advanced setting slot',
      required: true,
      skillTags: ['set'],
    }
    const context: SetupContext = {
      playerMode: 'solo',
      timeProfile: 25,
      netAvailable: true,
      wallAvailable: false,
      sessionFocus: 'set',
      playerLevel: 'advanced',
    }

    let seedThatPicksD47: string | undefined
    for (let i = 0; i < 500 && seedThatPicksD47 === undefined; i++) {
      const seed = `d47-duration-fit-${i}`
      const pick = pickForSlot(slot, context, new Set(), createSeededRandom(seed), {
        playerLevel: 'advanced',
      })
      if (pick?.variant.id === 'd47-solo-open') {
        seedThatPicksD47 = seed
      }
    }

    expect(seedThatPicksD47).toBeDefined()
    const targeted = pickForSlot(slot, context, new Set(), createSeededRandom(seedThatPicksD47!), {
      playerLevel: 'advanced',
      targetDurationMinutes: 12,
      preferTargetDurationFit: true,
    })

    expect(targeted?.variant.id).toBe('d49-solo-open')
    expect(targeted?.variant.workload.durationMaxMinutes).toBeGreaterThanOrEqual(12)
    expect(targeted?.variant.courtsideInstructions).toContain('rounds')
  })

  it('reroutes redistributed advanced setting sessions to D49 when D47 cannot carry the duration', () => {
    const context: SetupContext = {
      playerMode: 'solo',
      timeProfile: 25,
      netAvailable: false,
      wallAvailable: false,
      sessionFocus: 'set',
      playerLevel: 'advanced',
    }

    let d49Result: ReturnType<typeof buildDraftWithAssemblyTrace> | undefined
    for (let i = 0; i < 500 && d49Result === undefined; i++) {
      const result = buildDraftWithAssemblyTrace(context, {
        assemblySeed: `d49-redistribution-${i}`,
        playerLevel: 'advanced',
      })
      const mainSkill = result?.draft.blocks.find((block) => block.type === 'main_skill')
      if (mainSkill?.drillId === 'd49' && mainSkill.durationMinutes > 9) {
        d49Result = result
      }
    }

    expect(d49Result).toBeDefined()
    const mainSkill = d49Result!.draft.blocks.find((block) => block.type === 'main_skill')
    expect(mainSkill?.variantId).toBe('d49-solo-open')
    expect(mainSkill?.durationMinutes).toBeLessThanOrEqual(14)
    expect(mainSkill?.courtsideInstructions).toContain('rounds')
    expect(d49Result!.assemblyTrace.redistributionLayoutIndex).toBeDefined()
  })

  it('does not apply target-duration preference to non-main slots', () => {
    const slot: BlockSlot = {
      type: 'technique',
      durationMinMinutes: 4,
      durationMaxMinutes: 5,
      intent: 'Fixture technique slot',
      required: true,
      skillTags: ['pass'],
    }
    const context: SetupContext = {
      playerMode: 'solo',
      timeProfile: 25,
      netAvailable: false,
      wallAvailable: false,
      sessionFocus: 'pass',
      playerLevel: 'beginner',
    }

    const seed = 'non-main-target-duration'
    const baseline = pickForSlot(slot, context, new Set(), createSeededRandom(seed), {
      playerLevel: 'beginner',
    })
    const targeted = pickForSlot(slot, context, new Set(), createSeededRandom(seed), {
      playerLevel: 'beginner',
      targetDurationMinutes: 999,
    })

    expect(targeted?.variant.id).toBe(baseline?.variant.id)
  })

  it.each([
    [
      'solo wall',
      {
        playerMode: 'solo',
        timeProfile: 15,
        netAvailable: false,
        wallAvailable: true,
      } satisfies SetupContext,
      'solo_wall',
    ],
    [
      'solo net',
      {
        playerMode: 'solo',
        timeProfile: 15,
        netAvailable: true,
        wallAvailable: false,
      } satisfies SetupContext,
      'solo_net',
    ],
    [
      'solo open',
      {
        playerMode: 'solo',
        timeProfile: 25,
        netAvailable: false,
        wallAvailable: false,
      } satisfies SetupContext,
      'solo_open',
    ],
    [
      // D103 tie-break: when solo has both net and wall toggled, net wins.
      // A wall at a net-equipped facility is almost always incidental.
      'solo net+wall (net wins per D103)',
      {
        playerMode: 'solo',
        timeProfile: 15,
        netAvailable: true,
        wallAvailable: true,
      } satisfies SetupContext,
      'solo_net',
    ],
    [
      'pair net',
      {
        playerMode: 'pair',
        timeProfile: 15,
        netAvailable: true,
        wallAvailable: false,
      } satisfies SetupContext,
      'pair_net',
    ],
    [
      'pair open',
      {
        playerMode: 'pair',
        timeProfile: 25,
        netAvailable: false,
        wallAvailable: false,
      } satisfies SetupContext,
      'pair_open',
    ],
  ])('buildDraft creates a believable %s session', (_label, context, archetypeId) => {
    const draft = buildDraft(context)

    expect(draft).not.toBeNull()
    expect(draft?.archetypeId).toBe(archetypeId)
    expect(draft?.blocks.length).toBeGreaterThan(0)
    expect(draft?.blocks[0]?.type).toBe('warmup')
    // Tier 1a Unit 1: every archetype resolves the warmup slot to
    // `d28 Beach Prep Three`. Previously this test only asserted the
    // warmup wasn't a cooldown drill (d25/d26), which let passing drills
    // silently fill the slot - the exact authoring bug Unit 1 fixed.
    expect(draft?.blocks[0]?.drillId).toBe('d28')
    expect(draft?.blocks[0]?.drillName).toBe('Beach Prep Three')
    expect(draft?.blocks.at(-1)?.type).toBe('wrap')
    expect(['d25', 'd26']).toContain(draft?.blocks.at(-1)?.drillId)

    const totalMinutes = draft!.blocks.reduce((sum, block) => sum + block.durationMinutes, 0)
    expect(totalMinutes).toBe(context.timeProfile)

    for (const block of draft!.blocks) {
      const variant = variantById.get(block.variantId)
      expect(variant).toBeDefined()
      expect(variant!.environmentFlags.needsLines).toBe(false)
      expect(variant!.environmentFlags.needsCones).toBe(false)
      expect(variant!.equipment.balls).not.toBe('many')
    }
  })

  it.each([
    [
      'solo wall',
      {
        playerMode: 'solo',
        timeProfile: 40,
        netAvailable: false,
        wallAvailable: true,
      } satisfies SetupContext,
    ],
    [
      'solo net',
      {
        playerMode: 'solo',
        timeProfile: 40,
        netAvailable: true,
        wallAvailable: false,
      } satisfies SetupContext,
    ],
    [
      'solo open',
      {
        playerMode: 'solo',
        timeProfile: 40,
        netAvailable: false,
        wallAvailable: false,
      } satisfies SetupContext,
    ],
    [
      'pair net',
      {
        playerMode: 'pair',
        timeProfile: 40,
        netAvailable: true,
        wallAvailable: false,
      } satisfies SetupContext,
    ],
    [
      'pair open',
      {
        playerMode: 'pair',
        timeProfile: 40,
        netAvailable: false,
        wallAvailable: false,
      } satisfies SetupContext,
    ],
  ])('buildDraft creates a pressure-bearing 40-minute %s session', (_label, context) => {
    const draft = buildDraft(context)

    expect(draft).not.toBeNull()
    expect(draft!.blocks.reduce((sum, block) => sum + block.durationMinutes, 0)).toBe(40)
    expect(draft!.blocks.some((block) => block.type === 'pressure')).toBe(true)
  })

  /**
   * Tier 1a Unit 2 regression: Swap-pool expansion widened
   * `SKILL_TAGS_BY_TYPE.main_skill` to include `'set'`, but
   * `archetypes.ts` main_skill block skillTags stay `['pass', 'serve']`
   * so default (non-Swap) session assembly preserves the
   * single-focus-per-session invariant (archetype invariants header
   * point 1). A setting drill must never surface in the main_skill
   * slot of a default build. The exclusion list is derived from the
   * catalog so adding or renaming setting drills can't silently let
   * one slip through.
   */
  const SETTING_DRILL_IDS = DRILLS.filter((d) => d.skillFocus.includes('set')).map((d) => d.id)
  it.each([
    [
      'solo_wall',
      {
        playerMode: 'solo',
        timeProfile: 15,
        netAvailable: false,
        wallAvailable: true,
      } satisfies SetupContext,
    ],
    [
      'solo_open',
      {
        playerMode: 'solo',
        timeProfile: 25,
        netAvailable: false,
        wallAvailable: false,
      } satisfies SetupContext,
    ],
    [
      'pair_net',
      {
        playerMode: 'pair',
        timeProfile: 25,
        netAvailable: true,
        wallAvailable: false,
      } satisfies SetupContext,
    ],
  ])(
    'default %s build does not pick a setting drill in main_skill (single-focus invariant)',
    (_label, context) => {
      const draft = buildDraft(context)
      expect(draft).not.toBeNull()
      const mainSkill = draft!.blocks.find((b) => b.type === 'main_skill')
      if (mainSkill !== undefined) {
        expect(SETTING_DRILL_IDS).not.toContain(mainSkill.drillId)
      }
    },
  )

  it('explicit serving focus narrows the main-skill slot to serving drills', () => {
    const draft = buildDraft({
      playerMode: 'pair',
      timeProfile: 25,
      netAvailable: true,
      wallAvailable: false,
      sessionFocus: 'serve',
    })

    expect(draft).not.toBeNull()
    const mainSkill = draft!.blocks.find((b) => b.type === 'main_skill')
    expect(mainSkill).toBeDefined()
    const drill = DRILLS.find((d) => d.id === mainSkill!.drillId)
    expect(drill?.skillFocus).toContain('serve')
  })

  it('explicit setting focus makes generated support slots setting-reinforcing', () => {
    const draft = buildDraft(
      {
        playerMode: 'pair',
        timeProfile: 40,
        netAvailable: false,
        wallAvailable: false,
        sessionFocus: 'set',
      },
      { assemblySeed: 'setting-support-pair-open-40' },
    )

    expect(draft).not.toBeNull()
    for (const block of draft!.blocks.filter(
      (candidate) => candidate.type === 'technique' || candidate.type === 'movement_proxy',
    )) {
      const drill = DRILLS.find((candidate) => candidate.id === block.drillId)
      expect(drill?.skillFocus).toContain('set')
    }
  })

  it('explicit setting focus can use a movement-tagged setting drill in movement_proxy', () => {
    const drillById = new Map(DRILLS.map((d) => [d.id, d] as const))
    const draft = buildDraft(
      {
        playerMode: 'pair',
        timeProfile: 40,
        netAvailable: false,
        wallAvailable: false,
        sessionFocus: 'set',
      },
      { assemblySeed: 'setting-movement-proxy-pair-open-40' },
    )

    expect(draft).not.toBeNull()
    const movementProxy = draft!.blocks.find((block) => block.type === 'movement_proxy')
    expect(movementProxy).toBeDefined()
    const drill = drillById.get(movementProxy!.drillId)
    expect(drill?.skillFocus).toContain('set')
    expect(drill?.skillFocus).toContain('movement')
  })

  it('default movement_proxy fallback stays pass-scoped despite movement-tagged setting drills', () => {
    const drillById = new Map(DRILLS.map((d) => [d.id, d] as const))
    const draft = buildDraft(
      {
        playerMode: 'pair',
        timeProfile: 40,
        netAvailable: false,
        wallAvailable: false,
      },
      { assemblySeed: 'recommended-movement-proxy-pair-open-40' },
    )

    expect(draft).not.toBeNull()
    const movementProxy = draft!.blocks.find((block) => block.type === 'movement_proxy')
    expect(movementProxy).toBeDefined()
    const drill = drillById.get(movementProxy!.drillId)
    expect(drill?.skillFocus).toContain('pass')
    expect(drill?.skillFocus).not.toContain('set')
  })

  it('explicit serving focus can build a pair open 40-minute practice', () => {
    const draft = buildDraft(
      {
        playerMode: 'pair',
        timeProfile: 40,
        netAvailable: false,
        wallAvailable: false,
        sessionFocus: 'serve',
      },
      { assemblySeed: 'serving-pair-open-40' },
    )

    expect(draft).not.toBeNull()
    for (const block of draft!.blocks.filter(
      (candidate) =>
        candidate.type === 'technique' ||
        candidate.type === 'movement_proxy' ||
        candidate.type === 'main_skill' ||
        candidate.type === 'pressure',
    )) {
      const drill = DRILLS.find((candidate) => candidate.id === block.drillId)
      expect(drill?.skillFocus).toContain('serve')
    }
  })

  it('advanced setting focus builds from advanced setting families instead of beginner fallback', () => {
    const playerLevel: PlayerLevel = 'advanced'
    const draft = buildDraft(
      {
        playerMode: 'solo',
        timeProfile: 40,
        netAvailable: false,
        wallAvailable: false,
        sessionFocus: 'set',
      },
      { assemblySeed: 'advanced-setting-solo-open', playerLevel },
    )

    expect(draft).not.toBeNull()
    const mainSkill = draft!.blocks.find((block) => block.type === 'main_skill')
    expect(mainSkill).toBeDefined()
    expect(['d47', 'd48', 'd49']).toContain(mainSkill!.drillId)
  })

  it('advanced passing focus builds from advanced passing families', () => {
    const draft = buildDraft(
      {
        playerMode: 'pair',
        timeProfile: 40,
        netAvailable: false,
        wallAvailable: false,
        sessionFocus: 'pass',
      },
      { assemblySeed: 'advanced-passing-pair-open', playerLevel: 'advanced' },
    )

    expect(draft).not.toBeNull()
    const mainSkill = draft!.blocks.find((block) => block.type === 'main_skill')
    expect(mainSkill).toBeDefined()
    expect(['d07', 'd46']).toContain(mainSkill!.drillId)
  })

  it('advanced serving focus can build a pair open 40-minute practice', () => {
    const draft = buildDraft(
      {
        playerMode: 'pair',
        timeProfile: 40,
        netAvailable: false,
        wallAvailable: false,
        sessionFocus: 'serve',
      },
      { assemblySeed: 'advanced-serving-pair-open', playerLevel: 'advanced' },
    )

    expect(draft).not.toBeNull()
    const mainSkill = draft!.blocks.find((block) => block.type === 'main_skill')
    expect(mainSkill).toBeDefined()
    expect(['d22', 'd33']).toContain(mainSkill!.drillId)
  })

  /**
   * 2026-04-27 cca2 dogfeed F6 (`docs/research/2026-04-27-cca2-dogfeed-
   * findings.md`): the `movement_proxy` slot must prefer drills carrying
   * `'movement'` in `skillFocus` over drills with only `'pass'`. Pre-fix,
   * a 25-min `pair_open` build placed the stationary `d03 Continuous
   * Passing` (`skillFocus: ['pass']`, base drill kneel→stand→repeat) at
   * the movement_proxy slot and inverted the more movement-heavy `d10 6-
   * Legged Monster` (`skillFocus: ['pass', 'movement']`, six directional
   * shuffles) into the technique slot. The fix mirrors the warmup
   * branch's prefer-tag-first / fall-back-defensive shape.
   *
   * Symmetric: the `technique` slot prefers pass-only drills so that
   * movement-tagged drills stay available for movement_proxy
   * downstream. The technique pre-filter is necessary because
   * archetype layouts iterate technique BEFORE movement_proxy (per
   * `app/src/data/archetypes.ts`); without it, the technique shuffle
   * could exhaust the movement-tagged pool before movement_proxy ran.
   *
   * Verifies determinism by sweep across seeds: `assemblySeed` rotated
   * across 16 distinct values; every build that contains a
   * movement_proxy block must place a movement-tagged drill there.
   * Parametrized across every archetype × time-profile combination
   * that has a movement_proxy slot in the layout (per archetypes.ts:
   * 25-min layouts on solo_wall / solo_net / solo_open / pair_open;
   * 40-min layouts on solo_wall / solo_net / solo_open / pair_net /
   * pair_open). pair_net 25-min has no movement_proxy slot so it is
   * intentionally excluded.
   */
  /**
   * Pair archetypes have movement-tagged M001 candidates available
   * (`d10` 6-Legged Monster, `d09` Passing Around the Lines, `d15`
   * Short/Deep Reaction — all `m001Candidate: true` with pair
   * variants). The fix must place one of those at the movement_proxy
   * slot whenever a pair build runs through a layout that has the
   * slot. Sweep across 8 seeds × pair_open 25 + pair_open 40.
   */
  it.each<[string, SetupContext]>([
    [
      'pair_open 25',
      {
        playerMode: 'pair',
        timeProfile: 25,
        netAvailable: false,
        wallAvailable: false,
      } satisfies SetupContext,
    ],
    [
      'pair_open 40',
      {
        playerMode: 'pair',
        timeProfile: 40,
        netAvailable: false,
        wallAvailable: false,
      } satisfies SetupContext,
    ],
  ])('%s movement_proxy slot prefers a movement-tagged drill', (label, context) => {
    const drillById = new Map(DRILLS.map((d) => [d.id, d] as const))
    let foundAny = false
    for (let i = 0; i < 8; i++) {
      const draft = buildDraft(context, { assemblySeed: `${label}-seed-${i}` })
      expect(draft).not.toBeNull()
      const movementProxy = draft!.blocks.find((b) => b.type === 'movement_proxy')
      if (movementProxy === undefined) continue
      foundAny = true
      const drill = drillById.get(movementProxy.drillId!)
      expect(drill).toBeDefined()
      expect(
        drill!.skillFocus.includes('movement'),
        `${label} seed-${i}: movement_proxy slot got ${movementProxy.drillId} with skillFocus ${JSON.stringify(drill!.skillFocus)}; expected a 'movement'-tagged drill`,
      ).toBe(true)
    }
    expect(foundAny, `${label}: no seed produced a movement_proxy block; test ran vacuously`).toBe(
      true,
    )
  })

  /**
   * **Solo content-gap finding (red-team 2026-04-27).** Solo
   * archetypes (`solo_wall` / `solo_net` / `solo_open`) have a
   * pass-scoped `movement_proxy` fallback in their 25-min and 40-min
   * layouts, but **no `m001Candidate: true` pass drill carries
   * `'movement'` in `skillFocus` AND a solo-compatible variant**:
   *
   *   - `d09` (`['pass', 'movement']`, m001=true) — pair-only.
   *   - `d10` (`['pass', 'movement']`, m001=true) — pair-only.
   *   - `d15` (`['pass', 'movement']`, m001=true) — pair-only.
   *   - Setting drills such as `d40` / `d47` may carry secondary
   *     movement tags, but they are intentionally excluded from
   *     Recommended's pass-scoped movement fallback.
   *
   * As a result, the cca2 dogfeed F6 fix's prefer-`'movement'` branch
   * has no candidate to prefer in solo builds, and the slot falls
   * through to a pass-only drill via `pool[0]`. This is **not** the
   * F6 inversion bug — it is a content-authoring gap. The slot still
   * resolves cleanly (drillId / variantId / drillName populated), it
   * just doesn't carry a movement-tagged drill.
   *
   * The test below pins the current behavior (slot is filled, build
   * succeeds, but movement-tag is absent) so future Tier 1b authoring
   * (a solo variant on `d09` / `d10` / `d15` or a new solo
   * movement-tagged drill) can flip the assertion when that content
   * lands. Until then this test is the named-flag-on-the-content-gap
   * artifact.
   */
  it.each<[string, SetupContext]>([
    [
      'solo_wall 25',
      {
        playerMode: 'solo',
        timeProfile: 25,
        netAvailable: false,
        wallAvailable: true,
      } satisfies SetupContext,
    ],
    [
      'solo_net 25',
      {
        playerMode: 'solo',
        timeProfile: 25,
        netAvailable: true,
        wallAvailable: false,
      } satisfies SetupContext,
    ],
    [
      'solo_open 25',
      {
        playerMode: 'solo',
        timeProfile: 25,
        netAvailable: false,
        wallAvailable: false,
      } satisfies SetupContext,
    ],
  ])(
    '%s movement_proxy slot resolves cleanly even though no movement-tagged drill is reachable (solo content gap)',
    (label, context) => {
      const drillById = new Map(DRILLS.map((d) => [d.id, d] as const))
      let foundAny = false
      for (let i = 0; i < 8; i++) {
        const draft = buildDraft(context, { assemblySeed: `${label}-seed-${i}` })
        expect(draft).not.toBeNull()
        const movementProxy = draft!.blocks.find((b) => b.type === 'movement_proxy')
        if (movementProxy === undefined) continue
        foundAny = true
        // Slot resolves cleanly (drillId/variantId/drillName populated).
        expect(movementProxy.drillId).toBeTruthy()
        expect(movementProxy.variantId).toBeTruthy()
        expect(movementProxy.drillName).toBeTruthy()
        // The drill exists in the catalog.
        const drill = drillById.get(movementProxy.drillId!)
        expect(drill).toBeDefined()
        // Pass tag is required (the slot's `skillTags` includes 'pass'
        // for a reason).
        expect(drill!.skillFocus.includes('pass')).toBe(true)
      }
      expect(
        foundAny,
        `${label}: no seed produced a movement_proxy block; test ran vacuously`,
      ).toBe(true)
    },
  )

  /**
   * 2026-04-27 cca2 dogfeed F6 sibling: the technique slot's
   * prefer-pass-only branch must NOT break archetypes whose layout
   * has no movement_proxy slot (the pre-filter then has no downstream
   * consumer, but it still applies; pass-only is preferred regardless).
   * Solo wall 15-min layout is `[warmup, technique, mainSkill, wrap]`
   * — no movement_proxy. The technique slot must still resolve to a
   * non-empty drill, and the build must complete cleanly across seeds.
   */
  it('solo_wall 15 (no movement_proxy slot) still resolves the technique slot', () => {
    const context: SetupContext = {
      playerMode: 'solo',
      timeProfile: 15,
      netAvailable: false,
      wallAvailable: true,
    }
    for (let i = 0; i < 8; i++) {
      const draft = buildDraft(context, { assemblySeed: `solo_wall_15-seed-${i}` })
      expect(draft).not.toBeNull()
      // No movement_proxy slot in this layout.
      expect(draft!.blocks.some((b) => b.type === 'movement_proxy')).toBe(false)
      const technique = draft!.blocks.find((b) => b.type === 'technique')
      expect(technique).toBeDefined()
      // Drill resolved cleanly (drillId, drillName, variantId all
      // populated) — no fall-through to undefined.
      expect(technique!.drillId).toBeTruthy()
      expect(technique!.variantId).toBeTruthy()
      expect(technique!.drillName).toBeTruthy()
    }
  })

  /**
   * Tier 1a Unit 4 (Chosen-because rationale): every block on a default
   * buildDraft result carries a one-sentence rationale.
   *
   * Feedback pass 2026-04-21: the rationale no longer cites internal
   * decision IDs (D105/D85) and no longer trails with the redundant
   * `{playerMode} {timeProfile}-min` suffix - that suffix was the same
   * on every block in a session, so it read as noise. Warmup/wrap are
   * fixed purpose-driven sentences; technique/movement/main/pressure
   * describe what the block does for you by focus. Determinism is
   * still the contract that supports partner walkthrough "nodded /
   * ignored" tagging.
   */
  it('every block on a default buildDraft carries a non-empty rationale', () => {
    const draft = buildDraft({
      playerMode: 'solo',
      timeProfile: 15,
      netAvailable: false,
      wallAvailable: true,
    })
    expect(draft).not.toBeNull()
    for (const block of draft!.blocks) {
      expect(block.rationale, `${block.type} block missing rationale`).toBeTruthy()
      expect(block.rationale).toMatch(/^Chosen because: /)
      // Regression: no internal decision IDs in user-facing rationale.
      expect(block.rationale).not.toMatch(/D\d{2,}/)
      // Regression: no redundant `{playerMode} {time}-min` trailer.
      expect(block.rationale).not.toMatch(/\b(solo|pair)\s\d+-min/)
    }
  })

  it('warmup rationale is the fixed purpose-driven sentence', () => {
    const draft = buildDraft({
      playerMode: 'solo',
      timeProfile: 25,
      netAvailable: false,
      wallAvailable: false,
    })
    const warmup = draft!.blocks.find((b) => b.type === 'warmup')
    expect(warmup?.rationale).toBe(
      'Chosen because: every session opens with a sand-specific warmup.',
    )
  })

  it('wrap rationale is the fixed purpose-driven sentence', () => {
    const draft = buildDraft({
      playerMode: 'pair',
      timeProfile: 25,
      netAvailable: true,
      wallAvailable: false,
    })
    const wrap = draft!.blocks.at(-1)
    expect(wrap?.type).toBe('wrap')
    expect(wrap?.rationale).toBe('Chosen because: every session closes with a cooldown downshift.')
  })

  it('deriveBlockRationale is deterministic for the same inputs', () => {
    const context: SetupContext = {
      playerMode: 'solo',
      timeProfile: 15,
      netAvailable: false,
      wallAvailable: true,
    }
    const drill = { skillFocus: ['pass' as const] }
    const first = deriveBlockRationale('main_skill', drill, context)
    const second = deriveBlockRationale('main_skill', drill, context)
    expect(first).toBe(second)
    expect(first).toBe("Chosen because: today's main passing rep.")
  })

  it('buildDraft output is deterministic in its rationale sentences', () => {
    const context: SetupContext = {
      playerMode: 'solo',
      timeProfile: 15,
      netAvailable: false,
      wallAvailable: true,
    }
    const a = buildDraft(context)
    const b = buildDraft(context)
    // Builder picks drills via shuffle so drill identity may vary, but
    // the rationale sentence for every block that shares (slot type,
    // picked drill's primary focus, context) is identical. We verify
    // the invariant at the slot-type granularity: warmup and wrap are
    // fixed strings, everything else is a well-formed sentence.
    expect(a?.blocks.find((x) => x.type === 'warmup')?.rationale).toBe(
      b?.blocks.find((x) => x.type === 'warmup')?.rationale,
    )
    expect(a?.blocks.find((x) => x.type === 'wrap')?.rationale).toBe(
      b?.blocks.find((x) => x.type === 'wrap')?.rationale,
    )
  })

  /**
   * Red-team remediation Phase 1.2 / 2.3 / 3.2: bound the build-path
   * substitution surface. Phase 1 pinned that buildDraft NEVER
   * substitutes; Phase 2 promoted substitution to build-time but
   * scoped it to a single trigger; Phase 3 generalised the API from
   * a single key to a per-slot map without widening the trigger:
   *   1. caller passes `lastCompletedByType.main_skill`, AND
   *   2. that drill has a `SUBSTITUTION_RULE`, AND
   *   3. the rule's `blockedBy` constraint is active in this context, AND
   *   4. the slot is `main_skill`.
   *
   * Without all four, no substitution rationale should appear. Sweep
   * across representative contexts with no `lastCompletedByType` to
   * pin that the default build path stays untouched.
   */
  it.each([
    [
      'solo wall',
      {
        playerMode: 'solo',
        timeProfile: 15,
        netAvailable: false,
        wallAvailable: true,
      } satisfies SetupContext,
    ],
    [
      'solo open (no net, no wall)',
      {
        playerMode: 'solo',
        timeProfile: 25,
        netAvailable: false,
        wallAvailable: false,
      } satisfies SetupContext,
    ],
    [
      'pair net',
      {
        playerMode: 'pair',
        timeProfile: 25,
        netAvailable: true,
        wallAvailable: false,
      } satisfies SetupContext,
    ],
    [
      'pair open',
      {
        playerMode: 'pair',
        timeProfile: 15,
        netAvailable: false,
        wallAvailable: false,
      } satisfies SetupContext,
    ],
  ])(
    'buildDraft does not apply substitution rationales in %s without lastCompletedByType',
    (_label, context) => {
      const draft = buildDraft(context)
      expect(draft).not.toBeNull()
      for (const block of draft!.blocks) {
        expect(block.rationale, `${block.type} block leaked a substitution rationale`).not.toMatch(
          /is unavailable today, so this keeps/,
        )
      }
    },
  )

  /**
   * Phase 2.2 build-time substitution: when the caller passes the
   * user's last completed `main_skill` drill AND a substitution rule
   * fires for the current context, the main_skill block must be the
   * substitute drill with the substitution rationale. No other slot
   * is affected.
   */
  describe('build-time main_skill substitution (Phase 2.2)', () => {
    const pairOpen: SetupContext = {
      playerMode: 'pair',
      timeProfile: 25,
      netAvailable: false,
      wallAvailable: false,
    }
    const pairNet: SetupContext = {
      playerMode: 'pair',
      timeProfile: 25,
      netAvailable: true,
      wallAvailable: false,
    }

    it('promotes the explicit substitute drill into the main_skill slot', () => {
      const draft = buildDraft(pairOpen, {
        lastCompletedByType: { main_skill: 'd03' },
      })
      expect(draft).not.toBeNull()
      const main = draft!.blocks.find((b) => b.type === 'main_skill')
      expect(main).toBeDefined()
      expect(main!.drillId).toBe('d10')
      expect(main!.variantId).toBe('d10-pair')
      expect(main!.rationale).toBe(
        'Chosen because: the next net drill is unavailable today, so this keeps partner-fed platform control without a net.',
      )
    })

    it('only the main_skill block carries the substitution rationale', () => {
      const draft = buildDraft(pairOpen, {
        lastCompletedByType: { main_skill: 'd03' },
      })
      expect(draft).not.toBeNull()
      for (const block of draft!.blocks) {
        if (block.type === 'main_skill') continue
        expect(
          block.rationale,
          `${block.type} block should not carry a substitution rationale`,
        ).not.toMatch(/is unavailable today, so this keeps/)
      }
    })

    it('does not substitute when the preferred progression target is reachable', () => {
      // Same last main_skill drill, but `netAvailable: true` means the
      // rule's `blockedBy: 'needsNet'` is inactive. Substitution must
      // not fire even though the rule exists.
      const draft = buildDraft(pairNet, {
        lastCompletedByType: { main_skill: 'd03' },
      })
      expect(draft).not.toBeNull()
      for (const block of draft!.blocks) {
        expect(block.rationale, `${block.type} block leaked a substitution rationale`).not.toMatch(
          /is unavailable today, so this keeps/,
        )
      }
    })

    it('does not substitute when the last drill has no matching rule', () => {
      // d05 has a progression to d06 but no SUBSTITUTION_RULE entry.
      const draft = buildDraft(pairOpen, {
        lastCompletedByType: { main_skill: 'd05' },
      })
      expect(draft).not.toBeNull()
      for (const block of draft!.blocks) {
        expect(block.rationale, `${block.type} block leaked a substitution rationale`).not.toMatch(
          /is unavailable today, so this keeps/,
        )
      }
    })

    it('does not substitute when the substitute drill is not in the candidate pool', () => {
      // Solo mode disqualifies d10-pair (pair-only variant), so the
      // substitute is unreachable. The build path must fall through
      // to the default selection rather than picking a nonsensical
      // drill or surfacing a misleading rationale.
      const soloOpen: SetupContext = {
        playerMode: 'solo',
        timeProfile: 25,
        netAvailable: false,
        wallAvailable: false,
      }
      const draft = buildDraft(soloOpen, {
        lastCompletedByType: { main_skill: 'd03' },
      })
      expect(draft).not.toBeNull()
      const main = draft!.blocks.find((b) => b.type === 'main_skill')
      if (main !== undefined) {
        expect(main.drillId).not.toBe('d10')
        expect(main.rationale).not.toMatch(/is unavailable today, so this keeps/)
      }
    })

    it('build-time substitution is deterministic across repeated calls', () => {
      const opts = { lastCompletedByType: { main_skill: 'd03' } }
      const a = buildDraft(pairOpen, opts)
      const b = buildDraft(pairOpen, opts)
      const aMain = a!.blocks.find((blk) => blk.type === 'main_skill')
      const bMain = b!.blocks.find((blk) => blk.type === 'main_skill')
      expect(aMain?.drillId).toBe(bMain?.drillId)
      expect(aMain?.variantId).toBe(bMain?.variantId)
      expect(aMain?.rationale).toBe(bMain?.rationale)
    })

    it('omitted lastCompletedByType leaves the existing build path untouched', () => {
      const draft = buildDraft(pairOpen)
      expect(draft).not.toBeNull()
      const main = draft!.blocks.find((b) => b.type === 'main_skill')
      if (main !== undefined) {
        expect(main.rationale).not.toMatch(/is unavailable today, so this keeps/)
      }
    })

    it('ignores non-main_skill keys on the lastCompletedByType map', () => {
      // Forward-compat: extra keys (e.g., technique, pressure) on the
      // map must not implicitly trigger substitution on those slots.
      // Today only the main_skill key participates; widening that
      // surface should be an explicit follow-up, not an accident.
      const draft = buildDraft(pairOpen, {
        lastCompletedByType: {
          technique: 'd03',
          pressure: 'd03',
          main_skill: undefined,
        },
      })
      expect(draft).not.toBeNull()
      for (const block of draft!.blocks) {
        expect(
          block.rationale,
          `${block.type} block leaked a substitution rationale via a non-main_skill key`,
        ).not.toMatch(/is unavailable today, so this keeps/)
      }
    })
  })

  it('buildRecoveryDraft keeps low-load slots and drops main_skill and pressure', () => {
    const recovery = buildRecoveryDraft({
      playerMode: 'pair',
      timeProfile: 25,
      netAvailable: false,
      wallAvailable: false,
    })

    expect(recovery).not.toBeNull()
    const types = recovery!.blocks.map((b) => b.type)
    expect(types).toEqual(['warmup', 'technique', 'movement_proxy', 'wrap'])
    expect(types.some((t) => t === 'main_skill' || t === 'pressure')).toBe(false)
  })

  it('buildRecoveryDraft strips explicit session focus', () => {
    const recovery = buildRecoveryDraft({
      playerMode: 'pair',
      timeProfile: 25,
      netAvailable: false,
      wallAvailable: false,
      sessionFocus: 'serve',
    })

    expect(recovery).not.toBeNull()
    expect(recovery!.context.sessionFocus).toBeUndefined()
  })

  it('buildRecoveryDraft for 15 min includes technique between warmup and wrap', () => {
    const recovery = buildRecoveryDraft({
      playerMode: 'pair',
      timeProfile: 15,
      netAvailable: false,
      wallAvailable: false,
    })
    expect(recovery?.blocks.map((b) => b.type)).toEqual(['warmup', 'technique', 'wrap'])
  })

  it('persists assembly seed metadata and replays the same block identities for the same seed', () => {
    const context = {
      playerMode: 'pair' as const,
      timeProfile: 25 as const,
      netAvailable: true,
      wallAvailable: false,
    }

    const first = buildDraft(context, { assemblySeed: 'seed-replay' })
    const second = buildDraft(context, { assemblySeed: 'seed-replay' })

    expect(first).not.toBeNull()
    expect(second).not.toBeNull()
    expect(first?.assemblySeed).toBe('seed-replay')
    expect(first?.assemblyAlgorithmVersion).toBe(4)
    expect(second?.blocks.map((block) => [block.drillId, block.variantId])).toEqual(
      first?.blocks.map((block) => [block.drillId, block.variantId]),
    )
  })

  /**
   * 2026-04-21: recovery respects the user's chosen `timeProfile`
   * instead of the sum-of-mins of kept slots. Pre-2026-04-21, a
   * 15-min request produced a 10-min session (3+4+3) and readers
   * reported "just warmup then cooldown" because the 4-min Work
   * block disappeared between the bookends. The fix folds the
   * reclaimed main_skill/pressure minutes into the Work block so
   * technique dominates the session. These tests pin that shape so a
   * future edit to `allocateRecoveryDurations` can't silently
   * re-shrink recovery back to the intermission pattern.
   */
  it('15-min recovery fills the full 15 minutes with technique as the dominant block', () => {
    const recovery = buildRecoveryDraft({
      playerMode: 'pair',
      timeProfile: 15,
      netAvailable: false,
      wallAvailable: false,
    })
    expect(recovery).not.toBeNull()
    const total = recovery!.blocks.reduce((sum, b) => sum + b.durationMinutes, 0)
    expect(total).toBe(15)

    const technique = recovery!.blocks.find((b) => b.type === 'technique')
    const warmup = recovery!.blocks.find((b) => b.type === 'warmup')
    const wrap = recovery!.blocks.find((b) => b.type === 'wrap')
    expect(technique).toBeDefined()
    expect(warmup).toBeDefined()
    expect(wrap).toBeDefined()
    // Technique is strictly longer than either bookend so the Work
    // phase reads as the session, not an intermission.
    expect(technique!.durationMinutes).toBeGreaterThan(warmup!.durationMinutes)
    expect(technique!.durationMinutes).toBeGreaterThan(wrap!.durationMinutes)
  })

  it('25-min recovery fills 25 minutes with technique >= movement_proxy', () => {
    const recovery = buildRecoveryDraft({
      playerMode: 'pair',
      timeProfile: 25,
      netAvailable: false,
      wallAvailable: false,
    })
    expect(recovery).not.toBeNull()
    const total = recovery!.blocks.reduce((sum, b) => sum + b.durationMinutes, 0)
    expect(total).toBe(25)

    const technique = recovery!.blocks.find((b) => b.type === 'technique')
    const movement = recovery!.blocks.find((b) => b.type === 'movement_proxy')
    expect(technique).toBeDefined()
    expect(movement).toBeDefined()
    // 60/40 bias toward technique. Ceiling-rounded so technique wins
    // the odd-minute remainder on allocations like 18/2 → 11/7.
    expect(technique!.durationMinutes).toBeGreaterThanOrEqual(movement!.durationMinutes)
  })

  it('40-min recovery fills the full 40 minutes', () => {
    const recovery = buildRecoveryDraft({
      playerMode: 'pair',
      timeProfile: 40,
      netAvailable: false,
      wallAvailable: false,
    })
    expect(recovery).not.toBeNull()
    const total = recovery!.blocks.reduce((sum, b) => sum + b.durationMinutes, 0)
    expect(total).toBe(40)
  })

  it('estimateRecoverySessionMinutes returns the requested timeProfile', () => {
    // Pre-2026-04-21 this returned the sum-of-mins of kept slots
    // (10 for 15, 16 for 25). The lighter path lightens LOAD, not
    // DURATION - users who set a 15-min commitment still have 15
    // minutes available.
    expect(
      estimateRecoverySessionMinutes({
        playerMode: 'pair',
        timeProfile: 15,
        netAvailable: false,
        wallAvailable: false,
      }),
    ).toBe(15)

    expect(
      estimateRecoverySessionMinutes({
        playerMode: 'pair',
        timeProfile: 25,
        netAvailable: false,
        wallAvailable: false,
      }),
    ).toBe(25)

    expect(
      estimateRecoverySessionMinutes({
        playerMode: 'solo',
        timeProfile: 40,
        netAvailable: false,
        wallAvailable: true,
      }),
    ).toBe(40)
  })

  /**
   * Pre-close 2026-04-21 (partner walkthrough P2-2 + thought 3b in
   * founder review): pacing metadata pipes from drill variant onto
   * DraftBlock so `RunScreen` can fire sub-block pacing ticks. If any
   * link in the plumbing drops it, d28 Beach Prep Three stops pacing
   * at ~45 s and d26 Stretch Micro-sequence stops at ~30 s, and the
   * partner's explicit "beep every 30 seconds during the cool down"
   * ask is silently undone.
   *
   * 2026-04-28 (`docs/plans/2026-04-28-per-move-pacing-indicator.md`
   * U1 + U3): d28-solo migrated from `subBlockIntervalSeconds: 45` to
   * structured `segments` (4 × 45 s = 180 s). The pipe-through
   * assertion now covers both fields so a future regression in either
   * snapshot path fails CI.
   */
  it('pacing metadata pipes through buildDraft onto warmup + wrap blocks', () => {
    const draft = buildDraft({
      playerMode: 'solo',
      timeProfile: 15,
      netAvailable: false,
      wallAvailable: true,
    })
    expect(draft).not.toBeNull()

    const warmup = draft!.blocks.find((b) => b.type === 'warmup')
    expect(warmup?.drillId).toBe('d28')
    // d28-solo is now segments-driven; uniform tick is retired here.
    expect(warmup?.subBlockIntervalSeconds).toBeUndefined()
    expect(warmup?.segments).toBeDefined()
    expect(warmup?.segments).toHaveLength(4)
    expect(warmup?.segments?.every((s) => s.durationSec === 45)).toBe(true)

    const wrap = draft!.blocks.find((b) => b.type === 'wrap')
    expect(['d25', 'd26']).toContain(wrap?.drillId)
    // 2026-04-28 ship + each-side iteration: both wrap candidates are
    // now segments-driven and unilateral-aware.
    // d26-solo: 3 × 60 s = 180 s, all eachSide (mirror built into floor),
    //   bonus copy for glutes / adductors only.
    // d25-solo: 5 segments (60+30+60+30+60) = 240 s, hip + shoulder
    //   marked eachSide; bonus copy for hydration. durationMinMinutes
    //   bumped from 3 to 4. Both retire subBlockIntervalSeconds.
    if (wrap?.drillId === 'd26') {
      expect(wrap.subBlockIntervalSeconds).toBeUndefined()
      expect(wrap.segments).toBeDefined()
      expect(wrap.segments).toHaveLength(3)
      expect(wrap.segments?.every((s) => s.durationSec === 60)).toBe(true)
      expect(wrap.segments?.every((s) => s.eachSide === true)).toBe(true)
      // Bonus is purely accessory now — the "mirror to the other side"
      // clause was retired because each segment now does both sides.
      expect(wrap.courtsideInstructionsBonus).toMatch(/glutes/)
      expect(wrap.courtsideInstructionsBonus).not.toMatch(/mirror to the other side/)
    }
    if (wrap?.drillId === 'd25') {
      expect(wrap.subBlockIntervalSeconds).toBeUndefined()
      expect(wrap.segments).toBeDefined()
      expect(wrap.segments).toHaveLength(5)
      const sum = (wrap.segments ?? []).reduce((s, x) => s + x.durationSec, 0)
      expect(sum).toBe(240)
      // Hip stretch (s3) and shoulder stretch (s5) are unilateral.
      const eachSideCount = (wrap.segments ?? []).filter((s) => s.eachSide === true).length
      expect(eachSideCount).toBe(2)
      expect(wrap.courtsideInstructionsBonus).toMatch(/hydrate/i)
    }
  })

  /**
   * U5 + each-side iteration: wrap drills propagate their (possibly
   * different) durationMinMinutes through `buildDraft`. d26 stays at
   * 3-min floor; d25 sits at 4-min floor (each-side stretches add
   * structural time). Pin sums by drill so a future archetype edit
   * that introduces a sub-3-min wrap slot or a regression in segment
   * authoring fails CI rather than silently misaligning.
   */
  it('every M001 archetype wrap slot accepts d25 + d26 floors with their respective segment sums', () => {
    const profiles: Array<{ playerMode: 'solo' | 'pair'; timeProfile: 15 | 25 | 40 }> = [
      { playerMode: 'solo', timeProfile: 15 },
      { playerMode: 'solo', timeProfile: 25 },
      { playerMode: 'solo', timeProfile: 40 },
      { playerMode: 'pair', timeProfile: 15 },
      { playerMode: 'pair', timeProfile: 25 },
      { playerMode: 'pair', timeProfile: 40 },
    ]
    for (const profile of profiles) {
      const draft = buildDraft({
        ...profile,
        netAvailable: false,
        wallAvailable: true,
      })
      // Some pair profiles may not produce a draft if no candidates
      // resolve (e.g., when net required) — skip those for this guard.
      if (!draft) continue
      const wrap = draft.blocks.find((b) => b.type === 'wrap')
      if (!wrap) continue
      // The wrap drill is one of the recovery candidates.
      expect(['d25', 'd26']).toContain(wrap.drillId)
      expect(wrap.segments).toBeDefined()
      const sum = (wrap.segments ?? []).reduce((s, x) => s + x.durationSec, 0)
      // Each candidate sums to its own workload floor:
      // d26 → 180s (3 min), d25 → 240s (4 min).
      const expected = wrap.drillId === 'd25' ? 240 : 180
      expect(sum).toBe(expected)
    }
  })

  it('main_skill blocks without internal sub-segments leave subBlockIntervalSeconds undefined', () => {
    const draft = buildDraft({
      playerMode: 'solo',
      timeProfile: 15,
      netAvailable: false,
      wallAvailable: true,
    })
    const mainSkill = draft!.blocks.find((b) => b.type === 'main_skill')
    expect(mainSkill).toBeDefined()
    // Current main_skill variants do not declare sub-block pacing;
    // the field rides as undefined so RunScreen's pacing loop no-ops.
    expect(mainSkill!.subBlockIntervalSeconds).toBeUndefined()
  })
})
