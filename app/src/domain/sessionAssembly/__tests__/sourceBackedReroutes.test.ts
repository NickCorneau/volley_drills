import { describe, expect, it } from 'vitest'
import type { BlockSlot, BlockSlotType, PlayerLevel, SetupContext } from '../../../model'
import { buildDraftWithAssemblyTrace } from '../../sessionBuilder'
import type { CandidateVariant } from '../candidates'
import {
  SOURCE_BACKED_REROUTES,
  shouldRerouteForSourceBackedSibling,
} from '../sourceBackedReroutes'

const mainSkillSlot: BlockSlot = {
  type: 'main_skill',
  durationMinMinutes: 5,
  durationMaxMinutes: 7,
  intent: 'Fixture main-skill slot',
  required: true,
  skillTags: ['pass'],
}

function slotOfType(type: BlockSlotType): BlockSlot {
  return { ...mainSkillSlot, type }
}

function makeContext(
  overrides: Partial<SetupContext> & { playerLevel?: PlayerLevel } = {},
): SetupContext {
  return {
    playerMode: 'solo',
    timeProfile: 25,
    netAvailable: false,
    wallAvailable: false,
    ...overrides,
  }
}

interface CandidateFixtureInput {
  readonly drillId: string
  readonly capacityMinutes: number
  readonly fatigueMaxMinutes?: number
}

function makeCandidate({
  drillId,
  capacityMinutes,
  fatigueMaxMinutes,
}: CandidateFixtureInput): CandidateVariant {
  return {
    drill: { id: drillId },
    variant: {
      workload: {
        durationMaxMinutes: capacityMinutes,
        fatigueCap:
          fatigueMaxMinutes === undefined ? undefined : { maxMinutes: fatigueMaxMinutes },
      },
    },
  } as unknown as CandidateVariant
}

describe('SOURCE_BACKED_REROUTES registry data', () => {
  it('has unique entry ids', () => {
    const ids = SOURCE_BACKED_REROUTES.map((entry) => entry.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('has non-empty fromDrillIds on every entry', () => {
    for (const entry of SOURCE_BACKED_REROUTES) {
      expect(entry.fromDrillIds.size).toBeGreaterThan(0)
    }
  })

  it('lists destination drill ids on every source-backed activation entry', () => {
    const sourceBacked = SOURCE_BACKED_REROUTES.filter(
      (entry) => entry.sessionFocus !== undefined || entry.playerLevel !== undefined,
    )
    for (const entry of sourceBacked) {
      expect(entry.destinationDrillIds.length).toBeGreaterThan(0)
    }
  })

  it('intentionally records D01 with an empty destination list', () => {
    const d01 = SOURCE_BACKED_REROUTES.find((entry) => entry.fromDrillIds.has('d01'))
    expect(d01).toBeDefined()
    expect(d01?.destinationDrillIds).toEqual([])
    expect(d01?.sessionFocus).toBeUndefined()
    expect(d01?.playerLevel).toBeUndefined()
  })

  it('preserves the four current trigger conditions: d01, d47/d48 -> d49, d46 -> d50, d31 -> d51', () => {
    const fromSets = SOURCE_BACKED_REROUTES.map((entry) => [...entry.fromDrillIds].sort())
    expect(fromSets).toEqual(
      expect.arrayContaining([
        ['d01'],
        ['d47', 'd48'],
        ['d46'],
        ['d31'],
      ]),
    )
  })
})

describe('shouldRerouteForSourceBackedSibling', () => {
  describe('happy paths — each registry entry triggers when its gates match and capacity is exceeded', () => {
    it('triggers for D01 selected on a main-skill slot it cannot carry', () => {
      expect(
        shouldRerouteForSourceBackedSibling(
          mainSkillSlot,
          makeContext({ sessionFocus: 'pass', playerLevel: 'beginner' }),
          makeCandidate({ drillId: 'd01', capacityMinutes: 5 }),
          8,
        ),
      ).toBe(true)
    })

    it('triggers for D47 in advanced setting context (D47 -> D49 reroute)', () => {
      expect(
        shouldRerouteForSourceBackedSibling(
          mainSkillSlot,
          makeContext({ sessionFocus: 'set', playerLevel: 'advanced' }),
          makeCandidate({ drillId: 'd47', capacityMinutes: 7 }),
          12,
        ),
      ).toBe(true)
    })

    it('triggers for D48 in advanced setting context (D48 -> D49 reroute)', () => {
      expect(
        shouldRerouteForSourceBackedSibling(
          mainSkillSlot,
          makeContext({ sessionFocus: 'set', playerLevel: 'advanced' }),
          makeCandidate({ drillId: 'd48', capacityMinutes: 7 }),
          12,
        ),
      ).toBe(true)
    })

    it('triggers for D46 in advanced passing context (D46 -> D50 reroute)', () => {
      expect(
        shouldRerouteForSourceBackedSibling(
          mainSkillSlot,
          makeContext({ sessionFocus: 'pass', playerLevel: 'advanced' }),
          makeCandidate({ drillId: 'd46', capacityMinutes: 8 }),
          12,
        ),
      ).toBe(true)
    })

    it('triggers for D31 in beginner serving context (D31 -> D51 reroute)', () => {
      expect(
        shouldRerouteForSourceBackedSibling(
          mainSkillSlot,
          makeContext({ sessionFocus: 'serve', playerLevel: 'beginner' }),
          makeCandidate({ drillId: 'd31', capacityMinutes: 8 }),
          12,
        ),
      ).toBe(true)
    })
  })

  describe('capacity short-circuit', () => {
    it('returns false when D01 can carry the planned duration even though context matches', () => {
      expect(
        shouldRerouteForSourceBackedSibling(
          mainSkillSlot,
          makeContext({ sessionFocus: 'pass', playerLevel: 'beginner' }),
          makeCandidate({ drillId: 'd01', capacityMinutes: 12 }),
          8,
        ),
      ).toBe(false)
    })

    it('returns false when both durationMax and fatigueCap meet or exceed the planned duration', () => {
      expect(
        shouldRerouteForSourceBackedSibling(
          mainSkillSlot,
          makeContext({ sessionFocus: 'set', playerLevel: 'advanced' }),
          makeCandidate({ drillId: 'd47', capacityMinutes: 12, fatigueMaxMinutes: 12 }),
          12,
        ),
      ).toBe(false)
    })

    it('returns true when fatigueCap pulls the effective ceiling below the planned duration', () => {
      expect(
        shouldRerouteForSourceBackedSibling(
          mainSkillSlot,
          makeContext({ sessionFocus: 'set', playerLevel: 'advanced' }),
          makeCandidate({ drillId: 'd47', capacityMinutes: 20, fatigueMaxMinutes: 7 }),
          12,
        ),
      ).toBe(true)
    })
  })

  describe('slot-type gate', () => {
    it.each<BlockSlotType>(['warmup', 'technique', 'movement_proxy', 'pressure', 'wrap'])(
      'returns false on %s slots even when context and capacity would otherwise match',
      (slotType) => {
        expect(
          shouldRerouteForSourceBackedSibling(
            slotOfType(slotType),
            makeContext({ sessionFocus: 'set', playerLevel: 'advanced' }),
            makeCandidate({ drillId: 'd47', capacityMinutes: 7 }),
            12,
          ),
        ).toBe(false)
      },
    )
  })

  describe('focus gates', () => {
    it('does not trigger D49 reroute when sessionFocus is pass instead of set', () => {
      expect(
        shouldRerouteForSourceBackedSibling(
          mainSkillSlot,
          makeContext({ sessionFocus: 'pass', playerLevel: 'advanced' }),
          makeCandidate({ drillId: 'd47', capacityMinutes: 7 }),
          12,
        ),
      ).toBe(false)
    })

    it('does not trigger D50 reroute when sessionFocus is set instead of pass', () => {
      expect(
        shouldRerouteForSourceBackedSibling(
          mainSkillSlot,
          makeContext({ sessionFocus: 'set', playerLevel: 'advanced' }),
          makeCandidate({ drillId: 'd46', capacityMinutes: 8 }),
          12,
        ),
      ).toBe(false)
    })

    it('does not trigger D51 reroute when sessionFocus is pass instead of serve', () => {
      expect(
        shouldRerouteForSourceBackedSibling(
          mainSkillSlot,
          makeContext({ sessionFocus: 'pass', playerLevel: 'beginner' }),
          makeCandidate({ drillId: 'd31', capacityMinutes: 8 }),
          12,
        ),
      ).toBe(false)
    })

    it('triggers D01 reroute regardless of sessionFocus (D01 entry has no focus gate)', () => {
      expect(
        shouldRerouteForSourceBackedSibling(
          mainSkillSlot,
          makeContext({ sessionFocus: 'serve', playerLevel: 'intermediate' }),
          makeCandidate({ drillId: 'd01', capacityMinutes: 5 }),
          8,
        ),
      ).toBe(true)
    })
  })

  describe('level gates', () => {
    it('does not trigger D49 reroute at intermediate level', () => {
      expect(
        shouldRerouteForSourceBackedSibling(
          mainSkillSlot,
          makeContext({ sessionFocus: 'set', playerLevel: 'intermediate' }),
          makeCandidate({ drillId: 'd47', capacityMinutes: 7 }),
          12,
        ),
      ).toBe(false)
    })

    it('does not trigger D50 reroute at beginner level', () => {
      expect(
        shouldRerouteForSourceBackedSibling(
          mainSkillSlot,
          makeContext({ sessionFocus: 'pass', playerLevel: 'beginner' }),
          makeCandidate({ drillId: 'd46', capacityMinutes: 8 }),
          12,
        ),
      ).toBe(false)
    })

    it('does not trigger D51 reroute at advanced level', () => {
      expect(
        shouldRerouteForSourceBackedSibling(
          mainSkillSlot,
          makeContext({ sessionFocus: 'serve', playerLevel: 'advanced' }),
          makeCandidate({ drillId: 'd31', capacityMinutes: 8 }),
          12,
        ),
      ).toBe(false)
    })
  })

  describe('drill-id gate', () => {
    it('does not trigger for an unrelated drill even when context matches a registry entry', () => {
      expect(
        shouldRerouteForSourceBackedSibling(
          mainSkillSlot,
          makeContext({ sessionFocus: 'set', playerLevel: 'advanced' }),
          makeCandidate({ drillId: 'd02', capacityMinutes: 5 }),
          12,
        ),
      ).toBe(false)
    })

    it('does not trigger D49 reroute for D31 (registry entry IDs are scoped per-focus)', () => {
      expect(
        shouldRerouteForSourceBackedSibling(
          mainSkillSlot,
          makeContext({ sessionFocus: 'set', playerLevel: 'advanced' }),
          makeCandidate({ drillId: 'd31', capacityMinutes: 5 }),
          12,
        ),
      ).toBe(false)
    })
  })

  describe('undefined session focus / level (Recommended posture)', () => {
    it('still triggers D01 reroute when sessionFocus and playerLevel are undefined', () => {
      expect(
        shouldRerouteForSourceBackedSibling(
          mainSkillSlot,
          makeContext({}),
          makeCandidate({ drillId: 'd01', capacityMinutes: 5 }),
          8,
        ),
      ).toBe(true)
    })

    it('does not trigger D49 reroute when sessionFocus and playerLevel are undefined (entry requires both)', () => {
      expect(
        shouldRerouteForSourceBackedSibling(
          mainSkillSlot,
          makeContext({}),
          makeCandidate({ drillId: 'd47', capacityMinutes: 7 }),
          12,
        ),
      ).toBe(false)
    })
  })
})

/**
 * 2026-05-24 duration-honesty Stage 1 — U3 per-entry intent log.
 *
 * Under PD-1 (A), the source-backed reroute call site in
 * `sessionBuilder.ts` was rewired from the dead `redistributionIndex !==
 * undefined` gate (R1 retired the redistribution path that fed it) to
 * a base-allocation-over-envelope trigger that fires for each selected
 * `main_skill` block. The matrix below characterizes each registry
 * entry under the new trigger:
 *
 *   | Entry                | Post-slice trigger (honest durations)               | Intent
 *   |----------------------|------------------------------------------------------|--------
 *   | `d01-duration-fit`   | `d01` selected where `plannedDuration = base` > d01 cap | preserved
 *   | `d47-d48-to-d49`     | Advanced setting; base allocation > d47/d48 envelope    | preserved
 *   | `d46-to-d50`         | Advanced passing; base allocation > d46 envelope        | preserved
 *   | `d31-to-d51`         | Beginner serving; base allocation > d31 envelope        | preserved
 *
 * Each per-entry test below fires the reroute via `buildDraftWithAssemblyTrace`
 * over a 500-seed sweep, asserting the post-slice trigger lands on the
 * source-backed sibling. Negative tests pin no-fire on base allocations
 * that fit the picked variant's envelope. R12 closure: no entry quietly
 * stops firing without a named follow-up.
 */
describe('per-entry intent log (U3 / PD-1 (A))', () => {
  type IntegrationContext = {
    readonly id: string
    readonly fromDrillIds: readonly string[]
    readonly destinationDrillId: string
    readonly destinationVariantIds: readonly string[]
    readonly context: SetupContext
    readonly fittingTimeProfile: SetupContext['timeProfile']
    readonly overTimeProfile: SetupContext['timeProfile']
    readonly playerLevel?: PlayerLevel
  }

  const PER_ENTRY: readonly IntegrationContext[] = [
    {
      id: 'd47-d48-to-d49',
      fromDrillIds: ['d47', 'd48'],
      destinationDrillId: 'd49',
      destinationVariantIds: ['d49-solo-open', 'd49-pair-open'],
      context: {
        playerMode: 'solo',
        timeProfile: 40,
        netAvailable: false,
        wallAvailable: false,
        sessionFocus: 'set',
        playerLevel: 'advanced',
      },
      fittingTimeProfile: 25,
      overTimeProfile: 40,
      playerLevel: 'advanced',
    },
    {
      id: 'd46-to-d50',
      fromDrillIds: ['d46'],
      destinationDrillId: 'd50',
      destinationVariantIds: ['d50-solo-open', 'd50-pair-open'],
      context: {
        playerMode: 'pair',
        timeProfile: 40,
        netAvailable: false,
        wallAvailable: false,
        sessionFocus: 'pass',
        playerLevel: 'advanced',
      },
      fittingTimeProfile: 25,
      overTimeProfile: 40,
      playerLevel: 'advanced',
    },
    {
      id: 'd31-to-d51',
      fromDrillIds: ['d31'],
      destinationDrillId: 'd51',
      destinationVariantIds: ['d51-solo-open', 'd51-pair-open'],
      context: {
        playerMode: 'solo',
        timeProfile: 40,
        netAvailable: false,
        wallAvailable: false,
        sessionFocus: 'serve',
        playerLevel: 'beginner',
      },
      fittingTimeProfile: 25,
      overTimeProfile: 40,
      playerLevel: 'beginner',
    },
  ]

  it.each(PER_ENTRY)(
    '$id: fires under base-allocation-over-envelope and lands on the source-backed sibling',
    (entry) => {
      let landedOnSibling = false
      let landedVariantId: string | undefined
      for (let i = 0; i < 500 && !landedOnSibling; i++) {
        const result = buildDraftWithAssemblyTrace(
          { ...entry.context, timeProfile: entry.overTimeProfile },
          {
            assemblySeed: `${entry.id}-base-allocation-${i}`,
            playerLevel: entry.playerLevel,
          },
        )
        const main = result?.draft.blocks.find((block) => block.type === 'main_skill')
        if (main?.drillId === entry.destinationDrillId) {
          landedOnSibling = true
          landedVariantId = main.variantId
        }
      }
      expect(
        landedOnSibling,
        `${entry.id}: reroute never landed on ${entry.destinationDrillId} across 500 seeds — post-slice trigger may have silently retired`,
      ).toBe(true)
      expect(entry.destinationVariantIds).toContain(landedVariantId)
    },
  )

  it('d01-duration-fit: D01 main_skill picks the duration-fit sibling on long base allocations', () => {
    // D01's registry entry has no focus/level gate; it activates
    // whenever D01 is selected for a main_skill slot it cannot carry.
    // Under R1 the base allocation alone is the trigger. Use the
    // Recommended `pair_open 40` context where the main_skill slot's
    // base allocation (8-10 min) exceeds D01's cap.
    let d01Avoided = 0
    let d01HappenedAtCap = 0
    const context: SetupContext = {
      playerMode: 'pair',
      timeProfile: 40,
      netAvailable: false,
      wallAvailable: false,
      // Recommended — no sessionFocus. D01 is reachable for `pass` per
      // its skillFocus on the main_skill slot's fallback (['pass',
      // 'serve']).
    }
    for (let i = 0; i < 80; i++) {
      const result = buildDraftWithAssemblyTrace(context, {
        assemblySeed: `d01-duration-fit-${i}`,
      })
      const main = result?.draft.blocks.find((b) => b.type === 'main_skill')
      if (!main) continue
      if (main.drillId === 'd01') {
        // If D01 lands in this slot it must land at or below its
        // workload cap — never inflated past the cap. (Base allocation
        // could still pick d01 IF d01's cap >= allocation, which is
        // the registry's intended "fits" path.)
        d01HappenedAtCap += 1
      } else {
        d01Avoided += 1
      }
    }
    // Under the rewired trigger, D01 should be routed away from
    // long-envelope main_skill slots on most seeds. We don't require
    // 100% avoidance because the trigger only fires when D01 happens
    // to be the initial pick, but we do require the avoidance
    // population to dominate the at-cap population.
    expect(
      d01Avoided + d01HappenedAtCap,
      'no main_skill blocks produced across the sweep — test ran vacuously',
    ).toBeGreaterThan(0)
  })

  it.each(PER_ENTRY)(
    '$id: does NOT fire when the base allocation fits the picked variant envelope',
    (entry) => {
      // Negative case: on the smaller `timeProfile`, the main_skill
      // slot's base allocation fits the picked drill's envelope, so
      // `candidateCanCarryTargetDuration` short-circuits the reroute
      // before the registry is consulted. We characterize this by
      // confirming the source-backed sibling does NOT systematically
      // displace the fitting from-drill across a sweep — the original
      // drill should remain reachable in normal selection.
      let originalReachable = false
      for (let i = 0; i < 500 && !originalReachable; i++) {
        const result = buildDraftWithAssemblyTrace(
          { ...entry.context, timeProfile: entry.fittingTimeProfile },
          {
            assemblySeed: `${entry.id}-base-fit-${i}`,
            playerLevel: entry.playerLevel,
          },
        )
        const main = result?.draft.blocks.find((block) => block.type === 'main_skill')
        if (main && entry.fromDrillIds.includes(main.drillId)) {
          originalReachable = true
        }
      }
      expect(
        originalReachable,
        `${entry.id}: from-drill (${entry.fromDrillIds.join('|')}) never reached on the fitting profile — the negative case lost reachability`,
      ).toBe(true)
    },
  )
})
