import { describe, expect, it } from 'vitest'
import { CUE_COMPACT_MAX } from '../../domain/policies'
import type { Drill, ProgressionChain } from '../../types/drill'
import {
  auditLiveCueFitness,
  auditRungDepth,
  RUNG_DEPTH_TARGET,
  validateDrillCatalog,
} from '../catalogValidation'
import { DRILLS } from '../drills'
import { PROGRESSION_CHAINS } from '../progressions'
import { STRESS_LADDERS, type StressRung } from '../stressLadders'

const env = {
  needsNet: false,
  needsWall: false,
  needsLines: false,
  needsCones: false,
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

function rung(overrides: Partial<StressRung> = {}): StressRung {
  return {
    rung: 1,
    drillIds: ['d-test'],
    intent: 'Fixture intent.',
    externalFocusCue: 'Send the ball to the same spot.',
    explorationCriterion: 'Notice how it feels.',
    graduationFeel: 'Ready for more variety.',
    reflection: 'That rep was fixture work.',
    ...overrides,
  }
}

describe('validateDrillCatalog', () => {
  it('accepts the current authored drill, progression, and ladder catalogs', () => {
    expect(
      validateDrillCatalog({
        drills: DRILLS,
        progressionChains: PROGRESSION_CHAINS,
        stressLadders: STRESS_LADDERS,
      }),
    ).toEqual([])
  })

  it('keeps pair-eligible wall-only drills out of the M001 candidate set', () => {
    const pairEligibleWallOnly = DRILLS.flatMap((d) =>
      d.m001Candidate
        ? d.variants
            .filter(
              (v) =>
                v.environmentFlags.needsWall &&
                !v.environmentFlags.needsNet &&
                v.participants.min <= 2 &&
                v.participants.max >= 2,
            )
            .map((v) => `${d.id}:${v.id}`)
        : [],
    )

    expect(pairEligibleWallOnly).toEqual([])
  })

  describe('skillFocus authoring semantics', () => {
    it.each([
      ['d08', ['pass', 'serve']],
      ['d18', ['pass', 'serve']],
      ['d40', ['set', 'movement']],
      ['d42', ['set', 'movement']],
      ['d47', ['set', 'movement']],
      ['d49', ['set', 'movement']],
      ['d50', ['pass', 'movement']],
      ['d51', ['serve']],
    ])('keeps intentional multi-skill tags on %s', (drillId, expectedTags) => {
      const drillRecord = DRILLS.find((candidate) => candidate.id === drillId)
      expect(drillRecord?.skillFocus).toEqual(expectedTags)
    })

    it.each(['d07', 'd15', 'd16', 'd46'])(
      'does not add serve focus to %s when live serve/feed only trains the receiver',
      (drillId) => {
        const drillRecord = DRILLS.find((candidate) => candidate.id === drillId)
        expect(drillRecord?.skillFocus).toContain('pass')
        expect(drillRecord?.skillFocus).not.toContain('serve')
      },
    )
  })

  describe('D49 source-backed activation', () => {
    it('adds only solo and pair open variants without unmodeled equipment requirements', () => {
      const d49 = DRILLS.find((candidate) => candidate.id === 'd49')

      expect(d49).toBeDefined()
      expect(d49?.m001Candidate).toBe(true)
      expect(d49?.levelMin).toBe('advanced')
      expect(d49?.levelMax).toBe('advanced')
      expect(d49?.variants.map((variant) => variant.id)).toEqual(['d49-solo-open', 'd49-pair-open'])
      for (const variant of d49?.variants ?? []) {
        expect(variant.equipment.balls).toBe(1)
        expect(variant.environmentFlags.needsWall).toBe(false)
        expect(variant.environmentFlags.needsLines).toBe(false)
        expect(variant.environmentFlags.needsCones).toBe(false)
        expect(variant.workload.durationMaxMinutes).toBeGreaterThan(9)
        expect(variant.courtsideInstructions).toContain('rounds')
      }
    })

    it('keeps D47 workload caps unchanged while D49 carries longer setting blocks', () => {
      const d47 = DRILLS.find((candidate) => candidate.id === 'd47')
      const d49 = DRILLS.find((candidate) => candidate.id === 'd49')

      expect(d47?.variants.map((variant) => variant.workload.durationMaxMinutes)).toEqual([9, 9])
      expect(d47?.variants.map((variant) => variant.workload.fatigueCap?.maxMinutes)).toEqual([
        9, 9,
      ])
      expect(d49?.variants.map((variant) => variant.workload.durationMaxMinutes)).toEqual([14, 14])
      expect(d49?.variants.map((variant) => variant.workload.fatigueCap?.maxMinutes)).toEqual([
        14, 14,
      ])
    })
  })

  describe('D50 source-backed activation', () => {
    it('adds only pair-open and solo-open variants without unmodeled equipment requirements', () => {
      const d50 = DRILLS.find((candidate) => candidate.id === 'd50')

      expect(d50).toBeDefined()
      expect(d50?.m001Candidate).toBe(true)
      expect(d50?.levelMin).toBe('advanced')
      expect(d50?.levelMax).toBe('advanced')
      expect(d50?.chainId).toBe('chain-4-serve-receive')
      expect(d50?.variants.map((variant) => variant.id)).toEqual(['d50-pair-open', 'd50-solo-open'])
      for (const variant of d50?.variants ?? []) {
        expect(variant.equipment.balls).toBe(1)
        expect(variant.environmentFlags.needsWall).toBe(false)
        expect(variant.environmentFlags.needsLines).toBe(false)
        expect(variant.environmentFlags.needsCones).toBe(false)
        expect(variant.environmentFlags.needsNet).toBe(false)
        expect(variant.workload.durationMinMinutes).toBeGreaterThanOrEqual(8)
        expect(variant.workload.durationMaxMinutes).toBeGreaterThanOrEqual(14)
        expect(variant.courtsideInstructions).toContain('rounds')
      }
    })

    it('keeps D46 workload caps unchanged while D50 carries longer pair-open passing blocks', () => {
      const d46 = DRILLS.find((candidate) => candidate.id === 'd46')
      const d50 = DRILLS.find((candidate) => candidate.id === 'd50')

      expect(d46?.variants.map((variant) => variant.workload.durationMaxMinutes)).toEqual([8, 8])
      expect(d46?.variants.map((variant) => variant.workload.fatigueCap?.maxMinutes)).toEqual([
        8, 8,
      ])
      expect(d50?.variants.map((variant) => variant.workload.durationMaxMinutes)).toEqual([14, 14])
      expect(d50?.variants.map((variant) => variant.workload.fatigueCap?.maxMinutes)).toEqual([
        14, 14,
      ])
    })

    it('keeps D50 teaching content spin-reading-free per the d46 vs d50 honesty boundary', () => {
      // Objective MAY mention spin in a disclaimer ("not spin reading - d46 owns
      // that") because the boundary is load-bearing. Teaching points, courtside
      // instructions, and coaching cues are the active teaching surface and must
      // never instruct on spin reading - that surface belongs to d46.
      const d50 = DRILLS.find((candidate) => candidate.id === 'd50')

      const teachingPoints = (d50?.teachingPoints ?? []).join(' ').toLowerCase()
      expect(teachingPoints).not.toContain('spin')
      for (const variant of d50?.variants ?? []) {
        expect(variant.courtsideInstructions.toLowerCase()).not.toContain('spin')
        expect(variant.coachingCues.join(' ').toLowerCase()).not.toContain('spin')
      }
    })
  })

  describe('D51 source-backed activation', () => {
    it('adds three serving variants matching d31 surface coverage without unmodeled equipment', () => {
      const d51 = DRILLS.find((candidate) => candidate.id === 'd51')

      expect(d51).toBeDefined()
      expect(d51?.m001Candidate).toBe(true)
      expect(d51?.levelMin).toBe('beginner')
      expect(d51?.levelMax).toBe('intermediate')
      expect(d51?.chainId).toBe('chain-6-serving')
      expect(d51?.variants.map((variant) => variant.id)).toEqual([
        'd51-solo-open',
        'd51-pair-open',
        'd51-pair',
      ])
      for (const variant of d51?.variants ?? []) {
        expect(variant.equipment.balls).toBe(1)
        expect(variant.environmentFlags.needsWall).toBe(false)
        expect(variant.environmentFlags.needsLines).toBe(false)
        expect(variant.environmentFlags.needsCones).toBe(false)
        expect(variant.workload.durationMinMinutes).toBeGreaterThanOrEqual(8)
        expect(variant.workload.durationMaxMinutes).toBeGreaterThanOrEqual(14)
        expect(variant.courtsideInstructions).toContain('rounds')
      }
      // Only the pair (net) variant requires a net; solo-open and pair-open are
      // open-sand drills mirroring d31's pair vs pair-open distinction.
      const pair = d51?.variants.find((v) => v.id === 'd51-pair')
      const pairOpen = d51?.variants.find((v) => v.id === 'd51-pair-open')
      expect(pair?.environmentFlags.needsNet).toBe(true)
      expect(pairOpen?.environmentFlags.needsNet).toBe(false)
    })

    it('keeps D31 workload caps unchanged while D51 carries longer beginner serving blocks', () => {
      const d31 = DRILLS.find((candidate) => candidate.id === 'd31')
      const d51 = DRILLS.find((candidate) => candidate.id === 'd51')

      expect(d31?.variants.map((variant) => variant.workload.durationMaxMinutes)).toEqual([8, 8, 8])
      expect(d31?.variants.map((variant) => variant.workload.fatigueCap?.maxMinutes)).toEqual([
        8, 8, 8,
      ])
      expect(d51?.variants.map((variant) => variant.workload.durationMaxMinutes)).toEqual([
        14, 14, 14,
      ])
      expect(d51?.variants.map((variant) => variant.workload.fatigueCap?.maxMinutes)).toEqual([
        14, 14, 14,
      ])
    })

    it('keeps D51 teaching content single-target-free per the d31 vs d51 honesty boundary', () => {
      // Objective MAY mention "single-target" in a disclaimer ("trains tactical
      // zone avoidance, not single-target accuracy - d31 owns that") because
      // the boundary is load-bearing. Teaching points, courtside instructions,
      // and coaching cues are the active teaching surface and must never
      // instruct on single-target commitment - that surface belongs to d31.
      const d51 = DRILLS.find((candidate) => candidate.id === 'd51')

      const teachingPoints = (d51?.teachingPoints ?? []).join(' ').toLowerCase()
      expect(teachingPoints).not.toMatch(/single[\s-]target|one\s+target|target\s+circle/)
      for (const variant of d51?.variants ?? []) {
        expect(variant.courtsideInstructions.toLowerCase()).not.toMatch(
          /single[\s-]target|one\s+target|target\s+circle/,
        )
        expect(variant.coachingCues.join(' ').toLowerCase()).not.toMatch(
          /single[\s-]target|one\s+target|target\s+circle/,
        )
      }
    })
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
      const segmentIssues = issues.filter(
        (i) =>
          i.code.startsWith('segment_') ||
          i.code.startsWith('duplicate_segment') ||
          i.code.startsWith('invalid_segment'),
      )
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
      const segmentIssues = issues.filter(
        (i) =>
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

  /*
   * D160 validation hardening: bidirectional chain membership plus
   * ladder↔catalog cross-checks. The d24/chain-2 drift class (drill
   * declares a chain, chain forgets the drill) and the audit's
   * "catalogValidation never cross-checks ladders" gap both become
   * test failures here.
   */
  describe('chain membership and stress-ladder cross-checks (D160)', () => {
    const emptyLadders = { pass: [], serve: [], set: [] } as const

    it('reports a drill whose declared chain exists but omits it from drillIds', () => {
      const issues = validateDrillCatalog({
        drills: [drill(), drill({ id: 'd-member' })],
        progressionChains: [chain({ drillIds: ['d-test'] })],
      })

      const membership = issues.filter((i) => i.code === 'drill_chain_membership_missing')
      expect(membership).toHaveLength(1)
      expect(membership[0].path).toBe('drills.d-member.chainId')
    })

    it('keeps d28-style declared chain ids with no chain object legal', () => {
      const issues = validateDrillCatalog({
        drills: [drill({ id: 'd-orphan', chainId: 'chain-warmup-style-group' })],
        progressionChains: [],
      })

      expect(issues.map((i) => i.code)).not.toContain('drill_chain_membership_missing')
    })

    it('reports ladder entries that reference unknown drills', () => {
      const issues = validateDrillCatalog({
        drills: [drill()],
        progressionChains: [chain()],
        stressLadders: {
          ...emptyLadders,
          pass: [rung({ drillIds: ['d-test', 'd-ghost'] })],
        },
      })

      expect(issues.map((i) => i.code)).toContain('ladder_unknown_drill')
    })

    it('reports a drill that appears twice on one ladder', () => {
      const issues = validateDrillCatalog({
        drills: [drill()],
        progressionChains: [chain()],
        stressLadders: {
          ...emptyLadders,
          pass: [rung({ rung: 1, drillIds: ['d-test'] }), rung({ rung: 2, drillIds: ['d-test'] })],
        },
      })

      expect(issues.map((i) => i.code)).toContain('ladder_duplicate_drill')
    })

    it('reports a scoped-tag drill holding no rung on its focus ladder', () => {
      const issues = validateDrillCatalog({
        drills: [drill()],
        progressionChains: [chain()],
        stressLadders: emptyLadders,
      })

      const offLadder = issues.filter((i) => i.code === 'scoped_drill_off_ladder')
      expect(offLadder).toHaveLength(1)
      expect(offLadder[0].path).toBe('drills.d-test.skillFocus.pass')
    })

    it('keeps lifecycle-only drills off-ladder without error', () => {
      const issues = validateDrillCatalog({
        drills: [drill({ id: 'd-rec', skillFocus: ['recovery'], chainId: 'chain-recovery' })],
        progressionChains: [],
        stressLadders: emptyLadders,
      })

      expect(issues.map((i) => i.code)).not.toContain('scoped_drill_off_ladder')
    })

    it('skips ladder checks entirely when stressLadders is not provided', () => {
      const issues = validateDrillCatalog({
        drills: [drill()],
        progressionChains: [chain()],
      })

      expect(issues.map((i) => i.code)).not.toContain('scoped_drill_off_ladder')
    })

    it.each([
      ['intent', { intent: '' }, 'stressLadders.pass.1.intent'],
      ['externalFocusCue', { externalFocusCue: '' }, 'stressLadders.pass.1.externalFocusCue'],
      [
        'explorationCriterion',
        { explorationCriterion: '' },
        'stressLadders.pass.1.explorationCriterion',
      ],
      ['graduationFeel', { graduationFeel: '' }, 'stressLadders.pass.1.graduationFeel'],
      // D177 (coaching-arc After beat): the Drill Check reflection joins
      // the same all-or-nothing presence gate as its four siblings.
      ['reflection', { reflection: '' }, 'stressLadders.pass.1.reflection'],
      // Whitespace-only must read as missing too: both gates rely on .trim().
      ['whitespace intent', { intent: '   ' }, 'stressLadders.pass.1.intent'],
      ['whitespace reflection', { reflection: '   ' }, 'stressLadders.pass.1.reflection'],
    ])('reports a rung whose %s field is empty', (_label, overrides, expectedPath) => {
      const issues = validateDrillCatalog({
        drills: [drill()],
        progressionChains: [chain()],
        stressLadders: { ...emptyLadders, pass: [rung(overrides)] },
      })

      const missing = issues.filter((i) => i.code === 'rung_content_missing')
      expect(missing).toHaveLength(1)
      expect(missing[0].path).toBe(expectedPath)
    })

    it('reports one rung_content_missing per blank field on the same rung', () => {
      const issues = validateDrillCatalog({
        drills: [drill()],
        progressionChains: [chain()],
        stressLadders: {
          ...emptyLadders,
          pass: [
            rung({
              intent: '',
              externalFocusCue: '',
              explorationCriterion: '',
              graduationFeel: '',
              reflection: '',
            }),
          ],
        },
      })

      const missing = issues.filter((i) => i.code === 'rung_content_missing')
      expect(missing).toHaveLength(5)
      expect(missing.map((i) => i.path)).toEqual(
        expect.arrayContaining([
          'stressLadders.pass.1.intent',
          'stressLadders.pass.1.externalFocusCue',
          'stressLadders.pass.1.explorationCriterion',
          'stressLadders.pass.1.graduationFeel',
          'stressLadders.pass.1.reflection',
        ]),
      )
    })

    it('raises no rung_content_missing for the real authored catalog', () => {
      const issues = validateDrillCatalog({
        drills: DRILLS,
        progressionChains: PROGRESSION_CHAINS,
        stressLadders: STRESS_LADDERS,
      })

      expect(issues.map((i) => i.code)).not.toContain('rung_content_missing')
    })
  })

  describe('auditRungDepth (KTD6 advisory)', () => {
    const emptyLadders = { pass: [], serve: [], set: [] } as const

    it('flags a rung below the eligible-drill target with the full advisory shape', () => {
      const advisories = auditRungDepth({
        drills: [drill()],
        stressLadders: { ...emptyLadders, pass: [rung({ drillIds: ['d-test'] })] },
      })

      const passOne = advisories.find((a) => a.focus === 'pass' && a.rung === 1)
      expect(passOne).toBeDefined()
      expect(passOne?.eligibleCount).toBe(1)
      expect(passOne?.target).toBe(RUNG_DEPTH_TARGET)
      expect(passOne?.message).toMatch(/pass/)
    })

    it('honors a custom target threshold', () => {
      // Two eligible drills clears the default (2) but not a target of 3.
      const ladders = { ...emptyLadders, pass: [rung({ drillIds: ['d-a', 'd-b'] })] }
      const drills = [drill({ id: 'd-a' }), drill({ id: 'd-b' })]

      expect(auditRungDepth({ drills, stressLadders: ladders })).toHaveLength(0)

      const stricter = auditRungDepth({ drills, stressLadders: ladders, target: 3 })
      expect(stricter.find((a) => a.focus === 'pass' && a.rung === 1)?.eligibleCount).toBe(2)
    })

    it('counts only assembly-eligible (m001Candidate) drills', () => {
      const advisories = auditRungDepth({
        drills: [drill({ id: 'd-a' }), drill({ id: 'd-b', m001Candidate: false })],
        stressLadders: { ...emptyLadders, pass: [rung({ drillIds: ['d-a', 'd-b'] })] },
      })

      // Two placed, but only one is assembly-eligible, so still under target.
      const passOne = advisories.find((a) => a.focus === 'pass' && a.rung === 1)
      expect(passOne?.eligibleCount).toBe(1)
    })

    it('does not flag a rung that meets the target', () => {
      const advisories = auditRungDepth({
        drills: [drill({ id: 'd-a' }), drill({ id: 'd-b' })],
        stressLadders: { ...emptyLadders, pass: [rung({ drillIds: ['d-a', 'd-b'] })] },
      })

      expect(advisories.find((a) => a.focus === 'pass' && a.rung === 1)).toBeUndefined()
    })

    it('reports no under-depth rungs in the real catalog after the M002.2 roster-depth wave', () => {
      // 2026-06-21: the roster-depth wave (d52-d58,
      // docs/plans/2026-06-21-002-feat-roster-depth-source-backed-drills-plan.md)
      // brought every previously-thin rung (pass.1, serve.1/2/3, set.2/3/4)
      // to >=2 assembly-eligible drills. The advisory set should now be empty.
      // A regression that drops one of the new drills off its rung, flips its
      // m001Candidate flag, or mis-counts eligibility trips here.
      const advisories = auditRungDepth({ drills: DRILLS, stressLadders: STRESS_LADDERS })
      const thin = advisories.map((a) => `${a.focus}.${a.rung}`).sort()
      expect(thin).toEqual([])

      // Every real rung meets the depth target.
      for (const focus of Object.keys(STRESS_LADDERS) as (keyof typeof STRESS_LADDERS)[]) {
        for (const rungEntry of STRESS_LADDERS[focus]) {
          const eligible = rungEntry.drillIds.filter(
            (id) => DRILLS.find((d) => d.id === id)?.m001Candidate,
          ).length
          expect(eligible).toBeGreaterThanOrEqual(RUNG_DEPTH_TARGET)
        }
      }

      // And the hard catalog gate stays clean.
      const hard = validateDrillCatalog({
        drills: DRILLS,
        progressionChains: PROGRESSION_CHAINS,
        stressLadders: STRESS_LADDERS,
      })
      expect(hard).toEqual([])
    })
  })

  describe('auditLiveCueFitness (live-cue floor advisory)', () => {
    const emptyLadders = { pass: [], serve: [], set: [] } as const

    it('flags a rung externalFocusCue whose first clause exceeds the live-cue budget', () => {
      const overBudget = 'x'.repeat(CUE_COMPACT_MAX + 1)

      const advisories = auditLiveCueFitness({
        drills: [drill()],
        stressLadders: { ...emptyLadders, pass: [rung({ externalFocusCue: overBudget })] },
      })

      const flagged = advisories.filter(
        (a) => a.source === 'rung-external-focus-cue' && a.reason === 'over-budget',
      )
      expect(flagged).toHaveLength(1)
      expect(flagged[0].path).toBe('stressLadders.pass.1.externalFocusCue')
    })

    it('does not flag an in-budget external-focus rung cue', () => {
      const advisories = auditLiveCueFitness({
        drills: [drill()],
        stressLadders: {
          ...emptyLadders,
          pass: [rung({ externalFocusCue: 'Send it to the same spot.' })],
        },
      })

      expect(advisories).toEqual([])
    })

    it('flags a multi-clause rung externalFocusCue (rule 12a: one glanceable clause)', () => {
      // A live cue must be one clause: the selector renders only the first,
      // and a CUE_SEPARATOR-joined cue would defeat RunScreen's overrideWon
      // guard and reintroduce the R9 overlay torn read (KTD5). Both clauses
      // are in budget, so multi-clause is the only reason flagged.
      const advisories = auditLiveCueFitness({
        drills: [drill()],
        stressLadders: {
          ...emptyLadders,
          pass: [rung({ externalFocusCue: 'Send it to the same spot. · Then reset your feet.' })],
        },
      })

      const flagged = advisories.filter((a) => a.reason === 'multi-clause')
      expect(flagged).toHaveLength(1)
      expect(flagged[0].source).toBe('rung-external-focus-cue')
      expect(flagged[0].path).toBe('stressLadders.pass.1.externalFocusCue')
      expect(advisories.some((a) => a.reason === 'over-budget')).toBe(false)
    })

    it('flags a rung externalFocusCue that names a body part (bend your knees)', () => {
      const advisories = auditLiveCueFitness({
        drills: [drill()],
        stressLadders: {
          ...emptyLadders,
          pass: [rung({ externalFocusCue: 'Bend your knees before you contact the ball.' })],
        },
      })

      const flagged = advisories.filter((a) => a.reason === 'internal-focus')
      expect(flagged).toHaveLength(1)
      expect(flagged[0].source).toBe('rung-external-focus-cue')
      expect(flagged[0].path).toBe('stressLadders.pass.1.externalFocusCue')
    })

    it('flags a ladder-bearing drill whose coachingCues[0] first clause is over budget', () => {
      const overDrill = drill({
        id: 'd-long',
        variants: [
          {
            ...drill().variants[0],
            id: 'd-long-solo',
            drillId: 'd-long',
            coachingCues: ['x'.repeat(CUE_COMPACT_MAX + 5)],
          },
        ],
      })

      const advisories = auditLiveCueFitness({
        drills: [overDrill],
        stressLadders: { ...emptyLadders, pass: [rung({ drillIds: ['d-long'] })] },
      })

      const flagged = advisories.filter((a) => a.source === 'ladder-coaching-cue')
      expect(flagged).toHaveLength(1)
      expect(flagged[0].path).toBe('drills.d-long.variants.d-long-solo.coachingCues[0]')
    })

    it('does not flag a ladder coachingCues[0] with an object-position body part (d07-style gaze cue)', () => {
      // Length-only lane: the gaze cue names "platform" in object position but
      // is in budget, so the floor leaves phrasing to the evaluateCue0 lint
      // (the exact cue the live-cue guard exists to keep live).
      const gazeCue = "Look at your partner's hand the moment your platform meets the ball."
      expect(gazeCue.length).toBeLessThanOrEqual(CUE_COMPACT_MAX)
      const gazeDrill = drill({
        id: 'd-gaze',
        variants: [
          {
            ...drill().variants[0],
            id: 'd-gaze-solo',
            drillId: 'd-gaze',
            coachingCues: [gazeCue],
          },
        ],
      })

      const advisories = auditLiveCueFitness({
        drills: [gazeDrill],
        stressLadders: { ...emptyLadders, pass: [rung({ drillIds: ['d-gaze'] })] },
      })

      expect(advisories.filter((a) => a.path.includes('d-gaze'))).toEqual([])
    })

    it('returns an empty advisory for the real authored catalog (pinned)', () => {
      // Every authored externalFocusCue fits the budget and names no body
      // part, and no ladder-bearing coachingCues[0] first clause is over
      // budget. A future cue that regresses either bar trips here.
      expect(auditLiveCueFitness({ drills: DRILLS, stressLadders: STRESS_LADDERS })).toEqual([])
    })

    it('keeps live-cue fitness out of the hard validateDrillCatalog gate', () => {
      // An over-budget but PRESENT externalFocusCue is flagged by the
      // advisory yet raises no rung_content_missing (presence-only) issue,
      // so fitness never leaks into the toEqual([]) catalog gate.
      const stressLadders = {
        ...emptyLadders,
        pass: [rung({ externalFocusCue: 'x'.repeat(CUE_COMPACT_MAX + 5) })],
      }

      const advisories = auditLiveCueFitness({ drills: [drill()], stressLadders })
      expect(advisories.some((a) => a.reason === 'over-budget')).toBe(true)

      const issues = validateDrillCatalog({
        drills: [drill()],
        progressionChains: [chain()],
        stressLadders,
      })
      expect(issues.map((i) => i.code)).not.toContain('rung_content_missing')
    })
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
