import { describe, expect, it } from 'vitest'
import type { BlockSlot, BlockSlotType, PlayerLevel, SetupContext } from '../../../model'
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
