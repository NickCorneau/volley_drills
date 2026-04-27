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

  it('reports non-finite timing and effort values', () => {
    const issues = validateDrillCatalog({
      drills: [
        drill({
          variants: [
            {
              ...drill().variants[0],
              workload: {
                durationMinMinutes: Number.NaN,
                durationMaxMinutes: Number.POSITIVE_INFINITY,
                rpeMin: Number.NaN,
                rpeMax: Number.POSITIVE_INFINITY,
              },
              subBlockIntervalSeconds: Number.POSITIVE_INFINITY,
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

  it('reports variant drill id mismatches', () => {
    const issues = validateDrillCatalog({
      drills: [
        drill({
          variants: [
            {
              ...drill().variants[0],
              drillId: 'wrong-drill',
            },
          ],
        }),
      ],
      progressionChains: [chain()],
    })

    expect(issues.map((issue) => issue.code)).toContain('variant_drill_id_mismatch')
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
        'link_outside_chain',
        'unknown_progression_target',
      ]),
    )
  })

  it('reports unknown progression sources and links outside their chain', () => {
    const outside = drill({ id: 'd-outside' })
    const issues = validateDrillCatalog({
      drills: [drill(), outside],
      progressionChains: [
        chain({
          drillIds: ['d-test'],
          links: [
            {
              fromDrillId: 'missing-source',
              toDrillId: 'd-test',
              direction: 'progression',
              description: 'Broken source.',
            },
            {
              fromDrillId: 'd-test',
              toDrillId: 'd-outside',
              direction: 'progression',
              description: 'Outside target.',
            },
          ],
        }),
      ],
    })

    expect(issues.map((issue) => issue.code)).toEqual(
      expect.arrayContaining(['unknown_progression_source', 'link_outside_chain']),
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

  it('reports Solo-labelled variants whose participants.max is greater than 1', () => {
    const issues = validateDrillCatalog({
      drills: [
        drill({
          variants: [
            {
              ...drill().variants[0],
              label: 'Solo',
              participants: { min: 1, ideal: 1, max: 4 },
            },
          ],
        }),
      ],
      progressionChains: [chain()],
    })

    expect(issues.map((issue) => issue.code)).toContain('participants_label_mismatch')
  })

  it('reports Pair-labelled variants whose participants.min is not 2', () => {
    const issues = validateDrillCatalog({
      drills: [
        drill({
          variants: [
            {
              ...drill().variants[0],
              label: 'Pair',
              participants: { min: 1, ideal: 2, max: 2 },
            },
          ],
        }),
      ],
      progressionChains: [chain()],
    })

    expect(issues.map((issue) => issue.code)).toContain('participants_label_mismatch')
  })

  it('does not report participants_label_mismatch for non-Solo / non-Pair labels', () => {
    const issues = validateDrillCatalog({
      drills: [
        drill({
          variants: [
            {
              ...drill().variants[0],
              label: 'Any',
              participants: { min: 1, ideal: 1, max: 14 },
            },
          ],
        }),
      ],
      progressionChains: [chain()],
    })

    expect(issues.map((issue) => issue.code)).not.toContain('participants_label_mismatch')
  })
})
