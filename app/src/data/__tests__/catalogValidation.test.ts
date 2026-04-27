import { describe, expect, it } from 'vitest'
import type { Drill, ProgressionChain } from '../../types/drill'
import { validateDrillCatalog } from '../catalogValidation'
import { DRILLS } from '../drills'
import { PROGRESSION_CHAINS } from '../progressions'

const env = {
  needsNet: false,
  needsWall: false,
  needsLines: false,
  needsCones: false,
  windFriendly: true,
  lowScreenTime: true,
}

function drill(overrides: Partial<Drill> = {}): Drill {
  const id = overrides.id ?? 'd-test'

  return {
    id,
    name: `Drill ${id}`,
    shortName: id,
    skillFocus: ['pass'],
    objective: 'Fixture objective.',
    levelMin: 'beginner',
    levelMax: 'intermediate',
    chainId: 'chain-test',
    m001Candidate: true,
    teachingPoints: ['Keep platform quiet.'],
    progressionDescription: 'Progress fixture.',
    regressionDescription: 'Regress fixture.',
    variants: [
      {
        id: `${id}-solo`,
        drillId: id,
        label: 'Solo',
        feedType: 'self-toss',
        participants: { min: 1, ideal: 1, max: 1 },
        environmentFlags: env,
        equipment: { balls: 1 },
        workload: {
          durationMinMinutes: 3,
          durationMaxMinutes: 5,
          rpeMin: 3,
          rpeMax: 5,
        },
        successMetric: { type: 'completion', description: 'Complete the drill.' },
        courtsideInstructions: 'Run the fixture.',
        coachingCues: ['Quiet platform.'],
      },
    ],
    ...overrides,
  }
}

function chain(overrides: Partial<ProgressionChain> = {}): ProgressionChain {
  return {
    id: 'chain-test',
    name: 'Fixture Chain',
    focus: 'Fixture focus.',
    drillIds: ['d-test'],
    links: [],
    defaultGatingThreshold: 0.7,
    ...overrides,
  }
}

describe('validateDrillCatalog', () => {
  it('accepts the current authored drill and progression catalogs', () => {
    expect(validateDrillCatalog({ drills: DRILLS, progressionChains: PROGRESSION_CHAINS })).toEqual(
      [],
    )
  })

  it('reports duplicate drill ids and duplicate variant ids', () => {
    const first = drill({ id: 'd-dup' })
    const second = drill({
      id: 'd-dup',
      variants: [
        {
          ...first.variants[0],
          drillId: 'd-dup',
        },
      ],
    })

    const issues = validateDrillCatalog({
      drills: [first, second],
      progressionChains: [chain({ drillIds: ['d-dup'] })],
    })

    expect(issues.map((issue) => issue.code)).toEqual(
      expect.arrayContaining(['duplicate_drill_id', 'duplicate_variant_id']),
    )
  })

  it('reports invalid timing and effort envelopes', () => {
    const issues = validateDrillCatalog({
      drills: [
        drill({
          variants: [
            {
              ...drill().variants[0],
              workload: {
                durationMinMinutes: 6,
                durationMaxMinutes: 4,
                rpeMin: 8,
                rpeMax: 5,
              },
              subBlockIntervalSeconds: 0,
            },
          ],
        }),
      ],
      progressionChains: [chain()],
    })

    expect(issues.map((issue) => issue.code)).toEqual(
      expect.arrayContaining(['invalid_duration_range', 'invalid_rpe_range', 'invalid_sub_block']),
    )
  })

  it('reports broken progression references and chain mismatches', () => {
    const issues = validateDrillCatalog({
      drills: [drill({ id: 'd-test', chainId: 'other-chain' })],
      progressionChains: [
        chain({
          drillIds: ['d-test', 'missing-drill'],
          links: [
            {
              fromDrillId: 'd-test',
              toDrillId: 'missing-target',
              direction: 'progression',
              description: 'Broken target.',
            },
          ],
        }),
      ],
    })

    expect(issues.map((issue) => issue.code)).toEqual(
      expect.arrayContaining([
        'unknown_chain_drill',
        'chain_id_mismatch',
        'unknown_progression_target',
      ]),
    )
  })

  it('reports M001 candidates without a one-or-two-player eligible variant', () => {
    const issues = validateDrillCatalog({
      drills: [
        drill({
          variants: [
            {
              ...drill().variants[0],
              participants: { min: 3, ideal: 3, max: 4 },
            },
          ],
        }),
      ],
      progressionChains: [chain()],
    })

    expect(issues.map((issue) => issue.code)).toContain('m001_candidate_without_variant')
  })
})
