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

  /*
   * U2 of `docs/plans/2026-04-28-per-move-pacing-indicator.md`:
   * structured pacing segments must declare positive integer
   * durations, unique IDs within the variant, and sum exactly to
   * `workload.durationMinMinutes * 60`. CI fails on drift so a
   * future authoring mistake cannot silently misalign the segment
   * indicator from the authored move list.
   */
  describe('segments validation (U2)', () => {
    it('accepts a well-formed segments array (3 × 60s = 180s, durationMinMinutes 3)', () => {
      const issues = validateDrillCatalog({
        drills: [
          drill({
            variants: [
              {
                ...drill().variants[0],
                workload: {
                  durationMinMinutes: 3,
                  durationMaxMinutes: 5,
                  rpeMin: 3,
                  rpeMax: 5,
                },
                segments: [
                  { id: 's1', label: 'One', durationSec: 60 },
                  { id: 's2', label: 'Two', durationSec: 60 },
                  { id: 's3', label: 'Three', durationSec: 60 },
                ],
              },
            ],
          }),
        ],
        progressionChains: [chain()],
      })
      const segmentIssues = issues.filter((i) => i.code.startsWith('segment_') || i.code.startsWith('duplicate_segment') || i.code.startsWith('invalid_segment'))
      expect(segmentIssues).toEqual([])
    })

    it('passes when segments is undefined (no segment validation runs)', () => {
      const issues = validateDrillCatalog({
        drills: [
          drill({
            variants: [
              {
                ...drill().variants[0],
                // segments intentionally omitted
              },
            ],
          }),
        ],
        progressionChains: [chain()],
      })
      const segmentIssues = issues.filter((i) =>
        i.code === 'segment_duration_mismatch' ||
        i.code === 'duplicate_segment_id' ||
        i.code === 'invalid_segment_duration',
      )
      expect(segmentIssues).toEqual([])
    })

    it('reports segment_duration_mismatch when the sum does not match durationMinMinutes * 60', () => {
      const issues = validateDrillCatalog({
        drills: [
          drill({
            variants: [
              {
                ...drill().variants[0],
                workload: {
                  durationMinMinutes: 3, // expects 180s
                  durationMaxMinutes: 5,
                  rpeMin: 3,
                  rpeMax: 5,
                },
                segments: [
                  { id: 's1', label: 'One', durationSec: 60 },
                  { id: 's2', label: 'Two', durationSec: 60 },
                  // sum = 120, expected 180 → mismatch
                ],
              },
            ],
          }),
        ],
        progressionChains: [chain()],
      })
      expect(issues.map((i) => i.code)).toEqual(
        expect.arrayContaining(['segment_duration_mismatch']),
      )
    })

    it('reports duplicate_segment_id exactly once per duplicate (regardless of repeat count)', () => {
      const issues = validateDrillCatalog({
        drills: [
          drill({
            variants: [
              {
                ...drill().variants[0],
                workload: {
                  durationMinMinutes: 3,
                  durationMaxMinutes: 5,
                  rpeMin: 3,
                  rpeMax: 5,
                },
                segments: [
                  { id: 's-dup', label: 'One', durationSec: 60 },
                  { id: 's-dup', label: 'Two', durationSec: 60 },
                  { id: 's-dup', label: 'Three', durationSec: 60 },
                ],
              },
            ],
          }),
        ],
        progressionChains: [chain()],
      })
      const dupIssues = issues.filter((i) => i.code === 'duplicate_segment_id')
      // Two duplicates of `s-dup` after the first occurrence; reporter
      // emits exactly once per duplicate id (not once per repeat).
      expect(dupIssues).toHaveLength(1)
      expect(dupIssues[0].message).toContain('s-dup')
    })

    it('reports invalid_segment_duration for non-positive or non-integer durations', () => {
      const issues = validateDrillCatalog({
        drills: [
          drill({
            variants: [
              {
                ...drill().variants[0],
                workload: {
                  durationMinMinutes: 3,
                  durationMaxMinutes: 5,
                  rpeMin: 3,
                  rpeMax: 5,
                },
                segments: [
                  { id: 's1', label: 'Bad zero', durationSec: 0 },
                  { id: 's2', label: 'Bad neg', durationSec: -5 },
                  { id: 's3', label: 'Bad float', durationSec: 30.5 },
                ],
              },
            ],
          }),
        ],
        progressionChains: [chain()],
      })
      const invalidIssues = issues.filter((i) => i.code === 'invalid_segment_duration')
      expect(invalidIssues).toHaveLength(3)
    })

    it('reports segment_duration_mismatch when segments is an empty array', () => {
      const issues = validateDrillCatalog({
        drills: [
          drill({
            variants: [
              {
                ...drill().variants[0],
                workload: {
                  durationMinMinutes: 3,
                  durationMaxMinutes: 5,
                  rpeMin: 3,
                  rpeMax: 5,
                },
                segments: [],
              },
            ],
          }),
        ],
        progressionChains: [chain()],
      })
      expect(issues.map((i) => i.code)).toEqual(
        expect.arrayContaining(['segment_duration_mismatch']),
      )
    })
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
