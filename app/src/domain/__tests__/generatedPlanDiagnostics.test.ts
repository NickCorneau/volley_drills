import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

import { DRILLS } from '../../data/drills'
import type { Drill, DrillVariant, SessionDraft, TimeProfile } from '../../model'
import {
  DEFAULT_GENERATED_PLAN_SEEDS,
  DEFAULT_GENERATED_PLAN_SURFACE,
  analyzeSelectedDraftStretch,
  buildApplicableGeneratedPlanInputs,
  buildGeneratedPlanDiagnostics,
  buildGeneratedPlanMatrix,
  buildGeneratedPlanObservationGroups,
  buildGeneratedPlanSurfaceSummary,
  isGeneratedPlanDiagnosticStatus,
  summarizeGeneratedPlanDiagnostics,
} from '../generatedPlanDiagnostics'
import {
  PLAYER_LEVELS,
  READINESS_CONFIGURATIONS,
  READINESS_DURATIONS,
  VISIBLE_FOCUSES,
} from '../sessionAssembly/focusReadiness'
import { buildDraft, buildDraftWithAssemblyTrace, type DraftAssemblyTrace } from '../sessionBuilder'

function requireFixture<T>(value: T | undefined, message: string): T {
  if (!value) throw new Error(message)
  return value
}

const servingDrill: Drill = requireFixture(
  DRILLS.find((drill) => drill.id === 'd31'),
  'Missing d31 fixture drill',
)
const servingVariant: DrillVariant = requireFixture(
  servingDrill.variants.find((variant) => variant.id === 'd31-pair-open'),
  'Missing d31-pair-open fixture variant',
)

function servingDraft(durationMinutes: number, variantId = servingVariant.id): SessionDraft {
  return {
    id: 'current',
    context: {
      playerMode: 'pair',
      netAvailable: false,
      wallAvailable: false,
      timeProfile: 40,
      sessionFocus: 'serve',
      playerLevel: 'beginner',
    },
    archetypeId: 'pair_open',
    archetypeName: 'Pair + Open',
    assemblySeed: 'fixture-seed',
    assemblyAlgorithmVersion: 3,
    blocks: [
      {
        id: 'block-0',
        type: 'main_skill',
        drillId: servingDrill.id,
        variantId,
        drillName: servingDrill.name,
        shortName: servingDrill.shortName,
        durationMinutes,
        coachingCue: servingVariant.coachingCues[0],
        courtsideInstructions: servingVariant.courtsideInstructions,
        required: true,
      },
    ],
    updatedAt: 1,
  }
}

const servingTrace: DraftAssemblyTrace = {
  slots: [
    {
      layoutIndex: 0,
      type: 'main_skill',
      required: true,
      allocatedMinutes: 8,
      selected: true,
      blockId: 'block-0',
      drillId: servingDrill.id,
      variantId: servingVariant.id,
    },
    {
      layoutIndex: 1,
      type: 'pressure',
      required: false,
      allocatedMinutes: 1,
      selected: false,
    },
  ],
  skippedOptionalLayoutIndexes: [1],
  redistributedMinutes: 1,
  redistributionLayoutIndex: 0,
}

const cleanServingTrace: DraftAssemblyTrace = {
  ...servingTrace,
  skippedOptionalLayoutIndexes: [],
  redistributedMinutes: 0,
  redistributionLayoutIndex: undefined,
}

describe('generated plan diagnostic matrix', () => {
  it('derives default matrix inputs from supported readiness dimensions', () => {
    const inputs = buildApplicableGeneratedPlanInputs()

    expect(DEFAULT_GENERATED_PLAN_SEEDS).toHaveLength(4)
    expect(inputs).toHaveLength(
      VISIBLE_FOCUSES.length *
        READINESS_CONFIGURATIONS.length *
        PLAYER_LEVELS.length *
        READINESS_DURATIONS.length *
        DEFAULT_GENERATED_PLAN_SEEDS.length,
    )
  })

  it('expands automatically when a supported dimension is registered', () => {
    const passOnly = buildApplicableGeneratedPlanInputs({
      ...DEFAULT_GENERATED_PLAN_SURFACE,
      focuses: ['pass'],
    })
    const passAndServe = buildApplicableGeneratedPlanInputs({
      ...DEFAULT_GENERATED_PLAN_SURFACE,
      focuses: ['pass', 'serve'],
    })

    expect(passAndServe).toHaveLength(passOnly.length * 2)
  })

  it('keeps explicit not-applicable cells visible in the matrix summary', () => {
    const matrix = buildGeneratedPlanMatrix({
      ...DEFAULT_GENERATED_PLAN_SURFACE,
      focuses: ['serve'],
      configurations: [READINESS_CONFIGURATIONS[0]],
      levels: ['beginner'],
      durations: [15],
      seeds: ['seed-a'],
      notApplicable: [
        {
          focus: 'serve',
          configuration: READINESS_CONFIGURATIONS[0].id,
          level: 'beginner',
          duration: 15,
          seed: 'seed-a',
          reason: 'fixture excludes this cell intentionally',
        },
      ],
    })
    const summary = buildGeneratedPlanSurfaceSummary(matrix)

    expect(matrix).toEqual([
      expect.objectContaining({
        status: 'not_applicable',
        reason: 'fixture excludes this cell intentionally',
      }),
    ])
    expect(summary.notApplicableCount).toBe(1)
    expect(summary.applicableCount).toBe(0)
  })

  it('guards diagnostic terminal statuses', () => {
    expect(isGeneratedPlanDiagnosticStatus('clean')).toBe(true)
    expect(isGeneratedPlanDiagnosticStatus('observation_only')).toBe(true)
    expect(isGeneratedPlanDiagnosticStatus('hard_failure')).toBe(true)
    expect(isGeneratedPlanDiagnosticStatus('warning_only')).toBe(false)
  })
})

describe('selected draft stretch analyzer', () => {
  it('treats a block equal to authored caps as clean', () => {
    const result = analyzeSelectedDraftStretch(servingDraft(8), cleanServingTrace)

    expect(result.status).toBe('clean')
    expect(result.hardFailures).toEqual([])
    expect(result.observations).toEqual([])
  })

  it('classifies authored max and fatigue cap overage with redistribution evidence', () => {
    const result = analyzeSelectedDraftStretch(servingDraft(9), servingTrace)

    expect(result.status).toBe('observation_only')
    expect(result.hardFailures).toEqual([])
    expect(result.observations).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: 'over_authored_max',
          blockId: 'block-0',
          blockType: 'main_skill',
          required: true,
          plannedMinutes: 9,
          authoredMaxMinutes: 8,
          classificationSource: 'observed_redistribution',
          redistribution: expect.objectContaining({
            source: 'observed',
            redistributedMinutes: 1,
          }),
        }),
        expect.objectContaining({
          code: 'over_fatigue_cap',
          blockId: 'block-0',
          blockType: 'main_skill',
          required: true,
          plannedMinutes: 9,
          fatigueMaxMinutes: 8,
        }),
        expect.objectContaining({
          code: 'optional_slot_redistribution',
          blockId: 'block-0',
          blockType: 'main_skill',
          required: true,
          skippedOptionalLayoutIndexes: [1],
        }),
      ]),
    )
  })

  it('hard-fails unresolved selected variants', () => {
    const result = analyzeSelectedDraftStretch(servingDraft(8, 'missing-variant'), servingTrace)

    expect(result.status).toBe('hard_failure')
    expect(result.hardFailures).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: 'unresolved_selected_variant',
          blockId: 'block-0',
          drillId: 'd31',
          variantId: 'missing-variant',
        }),
      ]),
    )
  })

  it('hard-fails over-cap stretch when causality cannot be classified', () => {
    const result = analyzeSelectedDraftStretch(servingDraft(9), cleanServingTrace)

    expect(result.status).toBe('hard_failure')
    expect(result.hardFailures).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: 'unclassified_stretch_pressure',
          blockId: 'block-0',
          blockType: 'main_skill',
          required: true,
        }),
      ]),
    )
  })

  it('observes non-persisted assembly trace metadata from real draft generation', () => {
    const context = {
      playerMode: 'pair' as const,
      netAvailable: false,
      wallAvailable: false,
      timeProfile: 40 as const,
      sessionFocus: 'serve' as const,
      playerLevel: 'beginner' as const,
    }
    const options = {
      assemblySeed: 'trace-pair-open-serving-beginner-40',
      playerLevel: 'beginner' as const,
    }
    const traced = buildDraftWithAssemblyTrace(context, options)
    const regular = buildDraft(context, options)
    if (!traced || !regular) throw new Error('Expected trace fixture draft to build.')

    expect(traced.draft.blocks.map((block) => [block.id, block.drillId, block.variantId])).toEqual(
      regular.blocks.map((block) => [block.id, block.drillId, block.variantId]),
    )
    expect(traced.assemblyTrace.slots.filter((slot) => slot.selected)).toHaveLength(
      traced.draft.blocks.length,
    )
    expect(
      traced.assemblyTrace.slots
        .filter((slot) => slot.selected)
        .every((slot) => slot.blockId && slot.drillId && slot.variantId),
    ).toBe(true)
  })
})

describe('seeded generated plan diagnostics', () => {
  it('classifies every current generated plan matrix cell without hard failures', () => {
    const matrix = buildGeneratedPlanMatrix()
    const results = buildGeneratedPlanDiagnostics()
    const summary = summarizeGeneratedPlanDiagnostics(results, matrix)

    expect(results).toHaveLength(
      VISIBLE_FOCUSES.length *
        READINESS_CONFIGURATIONS.length *
        PLAYER_LEVELS.length *
        READINESS_DURATIONS.length *
        DEFAULT_GENERATED_PLAN_SEEDS.length,
    )
    expect(summary.hardFailureCount).toBe(0)
    expect(summary.statusCounts).toEqual({
      clean: 263,
      observation_only: 277,
      hard_failure: 0,
    })
    expect(summary.observationCounts).toEqual({
      optional_slot_redistribution: 236,
      over_authored_max: 288,
      over_fatigue_cap: 288,
    })
    expect(results.filter((result) => result.status === 'hard_failure')).toEqual([])
  })

  it('fails closed when a newly registered supported duration cannot generate', () => {
    const unsupportedDuration = 99 as TimeProfile
    const results = buildGeneratedPlanDiagnostics({
      ...DEFAULT_GENERATED_PLAN_SURFACE,
      focuses: ['serve'],
      configurations: [READINESS_CONFIGURATIONS[0]],
      levels: ['beginner'],
      durations: [unsupportedDuration],
      seeds: ['unsupported-duration'],
    })

    expect(results).toEqual([
      expect.objectContaining({
        duration: unsupportedDuration,
        status: 'hard_failure',
        hardFailures: expect.arrayContaining([
          expect.objectContaining({
            code: 'no_draft',
          }),
        ]),
      }),
    ])
  })

  it('preserves not-applicable cells through the diagnostic summary path', () => {
    const surface = {
      ...DEFAULT_GENERATED_PLAN_SURFACE,
      focuses: ['serve'],
      configurations: [READINESS_CONFIGURATIONS[0]],
      levels: ['beginner'],
      durations: [15],
      seeds: ['not-applicable-summary'],
      notApplicable: [
        {
          focus: 'serve',
          configuration: READINESS_CONFIGURATIONS[0].id,
          level: 'beginner',
          duration: 15,
          seed: 'not-applicable-summary',
          reason: 'fixture proves deferred cells survive the report path',
        },
      ],
    } satisfies typeof DEFAULT_GENERATED_PLAN_SURFACE
    const matrix = buildGeneratedPlanMatrix(surface)
    const results = buildGeneratedPlanDiagnostics(surface)
    const summary = summarizeGeneratedPlanDiagnostics(results, matrix)

    expect(results).toHaveLength(0)
    expect(summary.surface.cellCount).toBe(1)
    expect(summary.surface.notApplicableCount).toBe(1)
    expect(summary.notApplicable).toEqual([
      expect.objectContaining({
        reason: 'fixture proves deferred cells survive the report path',
      }),
    ])
  })

  it('summarizes diagnostic report dimensions and categories', () => {
    const results = buildGeneratedPlanDiagnostics({
      ...DEFAULT_GENERATED_PLAN_SURFACE,
      focuses: ['serve'],
      configurations: [READINESS_CONFIGURATIONS[0]],
      levels: ['beginner'],
      durations: [40],
      seeds: ['summary-seed'],
    })
    const summary = summarizeGeneratedPlanDiagnostics(results)

    expect(summary.surface).toEqual(
      expect.objectContaining({
        focuses: ['serve'],
        configurations: [READINESS_CONFIGURATIONS[0].id],
        levels: ['beginner'],
        durations: [40],
        seedCount: 1,
        cellCount: 1,
      }),
    )
    expect(summary.statusCounts.clean + summary.statusCounts.observation_only).toBe(1)
    expect(summary.statusCounts.hard_failure).toBe(0)
  })

  it('groups routeable observations with drill, variant, block, cap, and cell details', () => {
    const groups = buildGeneratedPlanObservationGroups(buildGeneratedPlanDiagnostics())
    const overCapGroups = groups.filter((group) =>
      group.observationCodes.includes('over_authored_max'),
    )

    expect(overCapGroups.length).toBeGreaterThan(0)
    expect(overCapGroups.every((group) => group.drillId && group.variantId)).toBe(true)
    expect(overCapGroups.every((group) => group.blockType && group.required !== undefined)).toBe(
      true,
    )
    expect(overCapGroups.every((group) => group.authoredMaxMinutes !== undefined)).toBe(true)
    expect(overCapGroups[0]?.affectedCells[0]).toEqual(
      expect.objectContaining({
        focus: expect.any(String),
        configuration: expect.any(String),
        level: expect.any(String),
        duration: expect.any(Number),
        seed: expect.any(String),
        blockId: expect.any(String),
        plannedMinutes: expect.any(Number),
      }),
    )
  })

  it('keeps the checked-in report aligned with the generated summary', () => {
    const report = JSON.parse(
      readFileSync(
        resolve(process.cwd(), '../docs/reviews/2026-05-01-generated-plan-diagnostics-report.json'),
        'utf8',
      ),
    ) as {
      surface: {
        seed_count: number
        cell_count: number
        applicable_count: number
        not_applicable_count: number
      }
      status_counts: Record<string, number>
      hard_failure_count: number
      observation_count: number
      hard_failure_counts: Record<string, number>
      observation_counts: Record<string, number>
      routeable_observation_group_count: number
      top_routeable_observation_groups: Array<{
        drill_id?: string
        variant_id?: string
        block_type?: string
        required?: boolean
        affected_cell_count: number
        example_affected_cells: unknown[]
      }>
    }
    const matrix = buildGeneratedPlanMatrix()
    const results = buildGeneratedPlanDiagnostics()
    const summary = summarizeGeneratedPlanDiagnostics(results, matrix)
    const groups = buildGeneratedPlanObservationGroups(results)

    expect(report.surface).toEqual(
      expect.objectContaining({
        seed_count: summary.surface.seedCount,
        cell_count: summary.surface.cellCount,
        applicable_count: summary.surface.applicableCount,
        not_applicable_count: summary.surface.notApplicableCount,
      }),
    )
    expect(report.status_counts).toEqual(summary.statusCounts)
    expect(report.hard_failure_count).toBe(summary.hardFailureCount)
    expect(report.observation_count).toBe(summary.observationCount)
    expect(report.hard_failure_counts).toEqual(summary.hardFailureCounts)
    expect(report.observation_counts).toEqual(summary.observationCounts)
    expect(report.routeable_observation_group_count).toBe(groups.length)
    expect(report.top_routeable_observation_groups.length).toBeGreaterThan(0)
    expect(report.top_routeable_observation_groups[0]).toEqual(
      expect.objectContaining({
        drill_id: expect.any(String),
        variant_id: expect.any(String),
        block_type: expect.any(String),
        required: expect.any(Boolean),
        affected_cell_count: expect.any(Number),
        example_affected_cells: expect.arrayContaining([expect.any(Object)]),
      }),
    )
  })
})
