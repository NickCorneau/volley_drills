import { DRILLS } from '../../data/drills'
import type { BlockSlotType, Drill, DrillVariant, SessionDraft, TimeProfile } from '../../model'
import {
  DEFAULT_GENERATED_PLAN_SEEDS,
  DEFAULT_GENERATED_PLAN_SURFACE,
  DEFAULT_GENERATED_PLAN_SURFACE_CONTRACT,
  analyzeSelectedDraftStretch,
  analyzeGeneratedPlanDraft,
  buildApplicableGeneratedPlanInputs,
  buildGeneratedPlanDiagnostics,
  buildGeneratedPlanMatrix,
  buildGeneratedPlanObservationGroups,
  buildGeneratedPlanSurfaceContractReport,
  buildGeneratedPlanSurfaceSummary,
  isGeneratedPlanDiagnosticStatus,
  summarizeGeneratedPlanDiagnostics,
  validateGeneratedPlanSurfaceContract,
} from '../generatedPlanDiagnostics'
import {
  PLAYER_LEVELS,
  READINESS_CONFIGURATIONS,
  READINESS_DURATIONS,
  VISIBLE_FOCUSES,
  type ReadinessConfiguration,
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

  it('validates the default supported surface contract', () => {
    const validation = validateGeneratedPlanSurfaceContract(DEFAULT_GENERATED_PLAN_SURFACE_CONTRACT)

    expect(validation.blockingIssues).toEqual([])
    expect(DEFAULT_GENERATED_PLAN_SURFACE).toEqual(DEFAULT_GENERATED_PLAN_SURFACE_CONTRACT.included)
  })

  it('fails validation for silent supported-surface omissions and shrinkage', () => {
    const validation = validateGeneratedPlanSurfaceContract({
      ...DEFAULT_GENERATED_PLAN_SURFACE_CONTRACT,
      included: {
        ...DEFAULT_GENERATED_PLAN_SURFACE,
        durations: [15, 25],
      },
      excluded: [],
    })

    expect(validation.blockingIssues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: 'missing_required_surface_value',
          dimension: 'duration',
          value: '40',
        }),
      ]),
    )
  })

  it('rejects deferring current supported surface values by reason alone', () => {
    const validation = validateGeneratedPlanSurfaceContract({
      ...DEFAULT_GENERATED_PLAN_SURFACE_CONTRACT,
      included: {
        ...DEFAULT_GENERATED_PLAN_SURFACE,
        durations: [15, 25],
      },
      excluded: [
        ...DEFAULT_GENERATED_PLAN_SURFACE_CONTRACT.excluded,
        {
          state: 'pre_activation_deferred',
          dimension: 'duration',
          value: '40',
          reason: '40-minute generated diagnostics are deferred while the surface contract fixture proves shrinkage review.',
          authority: 'docs/brainstorms/2026-05-02-generated-diagnostics-dynamic-surface-sentinel-requirements.md',
          revisitTrigger: 'Restore before any product-supported 40-minute diagnostic surface ships.',
        },
      ],
    })

    expect(validation.blockingIssues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: 'missing_required_surface_value',
          dimension: 'duration',
          value: '40',
        }),
        expect.objectContaining({
          code: 'unsupported_user_visible_surface',
          dimension: 'duration',
          value: '40',
        }),
      ]),
    )
  })

  it('rejects placeholder deferral reasons', () => {
    const validation = validateGeneratedPlanSurfaceContract({
      ...DEFAULT_GENERATED_PLAN_SURFACE_CONTRACT,
      excluded: [
        ...DEFAULT_GENERATED_PLAN_SURFACE_CONTRACT.excluded,
        {
          state: 'pre_activation_deferred',
          dimension: 'duration',
          value: '40',
          reason: 'unsupported',
          authority: 'docs/brainstorms/2026-05-02-generated-diagnostics-dynamic-surface-sentinel-requirements.md',
          revisitTrigger: 'Replace with a specific product boundary.',
        },
      ],
    })

    expect(validation.blockingIssues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: 'placeholder_surface_reason',
          dimension: 'duration',
          value: '40',
        }),
      ]),
    )
  })

  it('rejects unknown included configurations even when their setup context can generate', () => {
    const pairOpenConfiguration = requireFixture(
      READINESS_CONFIGURATIONS.find((configuration) => configuration.id === 'pair_open'),
      'Missing pair_open readiness configuration',
    )
    const duplicatePairOpenConfiguration: ReadinessConfiguration = {
      id: 'pair_open_shadow' as ReadinessConfiguration['id'],
      context: pairOpenConfiguration.context,
    }
    const validation = validateGeneratedPlanSurfaceContract({
      ...DEFAULT_GENERATED_PLAN_SURFACE_CONTRACT,
      included: {
        ...DEFAULT_GENERATED_PLAN_SURFACE,
        configurations: [...DEFAULT_GENERATED_PLAN_SURFACE.configurations, duplicatePairOpenConfiguration],
      },
    })

    expect(validation.blockingIssues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: 'unknown_included_configuration',
          dimension: 'configuration',
          value: 'pair_open_shadow',
        }),
        expect.objectContaining({
          code: 'unknown_included_surface_value',
          dimension: 'configuration',
          value: 'pair_open_shadow',
        }),
      ]),
    )
  })

  it('rejects canonical configuration ids paired with non-canonical contexts', () => {
    const pairOpenConfiguration = requireFixture(
      READINESS_CONFIGURATIONS.find((configuration) => configuration.id === 'pair_open'),
      'Missing pair_open readiness configuration',
    )
    const validation = validateGeneratedPlanSurfaceContract({
      ...DEFAULT_GENERATED_PLAN_SURFACE_CONTRACT,
      included: {
        ...DEFAULT_GENERATED_PLAN_SURFACE,
        configurations: [
          {
            id: 'solo_net',
            context: pairOpenConfiguration.context,
          },
        ],
      },
    })

    expect(validation.blockingIssues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: 'configuration_context_mismatch',
          dimension: 'configuration',
          value: 'solo_net',
        }),
      ]),
    )
  })

  it('rejects unknown included values across generated surface dimensions', () => {
    const validation = validateGeneratedPlanSurfaceContract({
      ...DEFAULT_GENERATED_PLAN_SURFACE_CONTRACT,
      included: {
        ...DEFAULT_GENERATED_PLAN_SURFACE,
        durations: [...DEFAULT_GENERATED_PLAN_SURFACE.durations, 99 as TimeProfile],
        seeds: [...DEFAULT_GENERATED_PLAN_SURFACE.seeds, 'matrix-e'],
      },
    })

    expect(validation.blockingIssues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ code: 'unknown_included_surface_value', dimension: 'duration', value: '99' }),
        expect.objectContaining({ code: 'unknown_included_surface_value', dimension: 'seed', value: 'matrix-e' }),
      ]),
    )
  })

  it('rejects unknown and conflicting excluded surface values', () => {
    const validation = validateGeneratedPlanSurfaceContract({
      ...DEFAULT_GENERATED_PLAN_SURFACE_CONTRACT,
      excluded: [
        ...DEFAULT_GENERATED_PLAN_SURFACE_CONTRACT.excluded,
        {
          state: 'pre_activation_deferred',
          dimension: 'duration',
          value: '999',
          reason: 'Fixture value proves typoed deferred values cannot enter report evidence.',
          authority: 'docs/brainstorms/2026-05-02-generated-diagnostics-dynamic-surface-sentinel-requirements.md',
          revisitTrigger: 'Replace with a real supported duration before use.',
        },
        {
          state: 'pre_activation_deferred',
          dimension: 'seed',
          value: 'matrix-a',
          reason: 'Fixture proves included values cannot also be deferred.',
          authority: 'docs/brainstorms/2026-05-02-generated-diagnostics-dynamic-surface-sentinel-requirements.md',
          revisitTrigger: 'Remove the conflict before report generation.',
        },
      ],
    })

    expect(validation.blockingIssues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ code: 'unknown_excluded_surface_value', dimension: 'duration', value: '999' }),
        expect.objectContaining({ code: 'conflicting_surface_contract_state', dimension: 'seed', value: 'matrix-a' }),
        expect.objectContaining({ code: 'unsupported_user_visible_surface', dimension: 'seed', value: 'matrix-a' }),
      ]),
    )
  })

  it('rejects empty and duplicate included surface dimensions', () => {
    const validation = validateGeneratedPlanSurfaceContract({
      ...DEFAULT_GENERATED_PLAN_SURFACE_CONTRACT,
      included: {
        ...DEFAULT_GENERATED_PLAN_SURFACE,
        focuses: [],
        seeds: ['matrix-a', 'matrix-a'],
      },
    })

    expect(validation.blockingIssues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ code: 'empty_included_surface_dimension', dimension: 'focus' }),
        expect.objectContaining({ code: 'duplicate_included_surface_value', dimension: 'seed', value: 'matrix-a' }),
      ]),
    )
  })

  it('keeps future theme coverage reserved outside the generated matrix', () => {
    expect(DEFAULT_GENERATED_PLAN_SURFACE_CONTRACT.excluded).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          state: 'reserved_future',
          dimension: 'theme',
          value: 'future_curated_themes',
        }),
      ]),
    )
  })

  it('rejects non-reserved theme entries before a theme contract exists', () => {
    const validation = validateGeneratedPlanSurfaceContract({
      ...DEFAULT_GENERATED_PLAN_SURFACE_CONTRACT,
      excluded: [
        {
          state: 'pre_activation_deferred',
          dimension: 'theme',
          value: 'future_curated_themes',
          reason: 'Fixture proves themes cannot be partially deferred as coverage.',
          authority: 'docs/brainstorms/2026-05-02-generated-diagnostics-dynamic-surface-sentinel-requirements.md',
          revisitTrigger: 'Replace only when a concrete theme contract exists.',
        },
      ],
    })

    expect(validation.blockingIssues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: 'theme_coverage_requires_contract',
          dimension: 'theme',
          value: 'future_curated_themes',
        }),
      ]),
    )
  })

  it('validates cell-level not-applicable reasons and coordinates', () => {
    const validNotApplicableCell = {
      focus: 'serve' as const,
      configuration: READINESS_CONFIGURATIONS[0].id,
      level: 'beginner' as const,
      duration: 15 as const,
      seed: 'matrix-a',
      reason: 'Fixture proves not-applicable cell-level reasons are validated.',
    }
    const validation = validateGeneratedPlanSurfaceContract({
      ...DEFAULT_GENERATED_PLAN_SURFACE_CONTRACT,
      included: {
        ...DEFAULT_GENERATED_PLAN_SURFACE,
        notApplicable: [
          validNotApplicableCell,
          validNotApplicableCell,
          {
            ...validNotApplicableCell,
            seed: 'unknown-seed',
            reason: 'unsupported',
          },
        ],
      },
    })

    expect(validation.blockingIssues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ code: 'duplicate_not_applicable_cell' }),
        expect.objectContaining({ code: 'invalid_not_applicable_cell', dimension: 'seed' }),
        expect.objectContaining({ code: 'placeholder_not_applicable_reason' }),
      ]),
    )
  })

  it('reports exact seed IDs and reserved surface reasons for generated artifacts', () => {
    const report = buildGeneratedPlanSurfaceContractReport()

    expect(report.included.seedIds).toEqual(['matrix-a', 'matrix-b', 'matrix-c', 'matrix-d'])
    expect(report.excluded).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          dimension: 'theme',
          state: 'reserved_future',
          reason: expect.stringContaining('concrete theme contract'),
        }),
      ]),
    )
    expect(report.validationIssues).toEqual([])
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

  it('classifies blocks below authored minimum duration as routeable observations', () => {
    const result = analyzeSelectedDraftStretch(servingDraft(3), cleanServingTrace)

    expect(result.status).toBe('observation_only')
    expect(result.observations).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: 'under_authored_min',
          blockId: 'block-0',
          blockType: 'main_skill',
          required: true,
          plannedMinutes: 3,
          authoredMinMinutes: 4,
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
      clean: 119,
      observation_only: 421,
      hard_failure: 0,
    })
    expect(summary.observationCounts).toEqual({
      under_authored_min: 257,
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

  it('fails closed when a raw diagnostic surface uses an unknown configuration id', () => {
    const pairOpenConfiguration = requireFixture(
      READINESS_CONFIGURATIONS.find((configuration) => configuration.id === 'pair_open'),
      'Missing pair_open readiness configuration',
    )
    const results = buildGeneratedPlanDiagnostics({
      ...DEFAULT_GENERATED_PLAN_SURFACE,
      focuses: ['serve'],
      configurations: [
        {
          id: 'pair_open_shadow' as ReadinessConfiguration['id'],
          context: pairOpenConfiguration.context,
        },
      ],
      levels: ['beginner'],
      durations: [15],
      seeds: ['unknown-config'],
    })

    expect(results).toEqual([
      expect.objectContaining({
        configuration: 'pair_open_shadow',
        status: 'hard_failure',
        hardFailures: expect.arrayContaining([
          expect.objectContaining({
            code: 'no_draft',
            message: expect.stringContaining('No canonical readiness configuration'),
          }),
        ]),
      }),
    ])
  })

  it('fails closed when a raw diagnostic surface reuses a canonical id with a different context', () => {
    const pairOpenConfiguration = requireFixture(
      READINESS_CONFIGURATIONS.find((configuration) => configuration.id === 'pair_open'),
      'Missing pair_open readiness configuration',
    )
    const results = buildGeneratedPlanDiagnostics({
      ...DEFAULT_GENERATED_PLAN_SURFACE,
      focuses: ['serve'],
      configurations: [
        {
          id: 'solo_net',
          context: pairOpenConfiguration.context,
        },
      ],
      levels: ['beginner'],
      durations: [15],
      seeds: ['canonical-config'],
    })

    expect(results[0]).toEqual(
      expect.objectContaining({
        configuration: 'solo_net',
        status: 'hard_failure',
        hardFailures: expect.arrayContaining([
          expect.objectContaining({
            code: 'no_draft',
            message: expect.stringContaining(
              'Diagnostic surface configuration context does not match canonical readiness configuration',
            ),
          }),
        ]),
      }),
    )
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
        seedIds: ['summary-seed'],
        seedCount: 1,
        cellCount: 1,
      }),
    )
    expect(summary.statusCounts.clean + summary.statusCounts.observation_only).toBe(1)
    expect(summary.statusCounts.hard_failure).toBe(0)
  })

  function traceMismatchFixture() {
    const context = {
      playerMode: 'pair' as const,
      netAvailable: false,
      wallAvailable: false,
      timeProfile: 40 as const,
      sessionFocus: 'serve' as const,
      playerLevel: 'beginner' as const,
    }
    const traced = buildDraftWithAssemblyTrace(context, {
      assemblySeed: 'trace-mismatch-serving-beginner-40',
      playerLevel: 'beginner',
    })
    if (!traced) throw new Error('Expected trace mismatch fixture draft to build.')
    const cell = {
      focus: 'serve' as const,
      configuration: 'pair_open' as const,
      level: 'beginner' as const,
      duration: 40 as const,
      seed: 'trace-mismatch-serving-beginner-40',
      status: 'applicable' as const,
    }
    const configuration = requireFixture(
      READINESS_CONFIGURATIONS.find((candidate) => candidate.id === 'pair_open'),
      'Missing pair_open readiness configuration',
    )
    return { traced, cell, configuration }
  }

  function analyzeTraceMutation(trace: DraftAssemblyTrace) {
    const { traced, cell, configuration } = traceMismatchFixture()
    return analyzeGeneratedPlanDraft(cell, configuration, traced.draft, trace)
  }

  it('hard-fails selected trace slots that do not map back to draft blocks', () => {
    const { traced, cell, configuration } = traceMismatchFixture()

    const result = analyzeGeneratedPlanDraft(
      cell,
      configuration,
      traced.draft,
      {
        ...traced.assemblyTrace,
        slots: traced.assemblyTrace.slots.map((slot) =>
          slot.selected ? { ...slot, blockId: 'missing-block' } : slot,
        ),
      },
    )

    expect(result.status).toBe('hard_failure')
    expect(result.hardFailures).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: 'assembly_trace_mismatch',
          blockId: 'missing-block',
        }),
      ]),
    )
  })

  it.each([
    {
      name: 'selected slot has mismatched drill identity',
      mutate: (trace: DraftAssemblyTrace) => ({
        ...trace,
        slots: trace.slots.map((slot) =>
          slot.selected ? { ...slot, drillId: 'definitely-wrong-drill' } : slot,
        ),
      }),
      expectedMessage: 'Selected trace slot identity does not match its draft block.',
    },
    {
      name: 'selected slot has mismatched variant identity',
      mutate: (trace: DraftAssemblyTrace) => ({
        ...trace,
        slots: trace.slots.map((slot) =>
          slot.selected ? { ...slot, variantId: 'definitely-wrong-variant' } : slot,
        ),
      }),
      expectedMessage: 'Selected trace slot identity does not match its draft block.',
    },
    {
      name: 'selected slot has mismatched block type',
      mutate: (trace: DraftAssemblyTrace) => ({
        ...trace,
        slots: trace.slots.map((slot) =>
          slot.selected ? { ...slot, type: 'wrap' as BlockSlotType } : slot,
        ),
      }),
      expectedMessage: 'Selected trace slot identity does not match its draft block.',
    },
    {
      name: 'selected slot has mismatched required flag',
      mutate: (trace: DraftAssemblyTrace) => ({
        ...trace,
        slots: trace.slots.map((slot) =>
          slot.selected ? { ...slot, required: !slot.required } : slot,
        ),
      }),
      expectedMessage: 'Selected trace slot identity does not match its draft block.',
    },
    {
      name: 'selected slot points outside the layout',
      mutate: (trace: DraftAssemblyTrace) => ({
        ...trace,
        slots: trace.slots.map((slot) => (slot.selected ? { ...slot, layoutIndex: 999 } : slot)),
      }),
      expectedMessage: 'Selected trace slot does not map to an archetype layout slot.',
    },
    {
      name: 'draft block maps to multiple selected trace slots',
      mutate: (trace: DraftAssemblyTrace) => {
        const firstSelected = trace.slots.find((slot) => slot.selected)
        return {
          ...trace,
          slots: trace.slots.map((slot) =>
            slot.selected && firstSelected
              ? {
                  ...slot,
                  blockId: firstSelected.blockId,
                  drillId: firstSelected.drillId,
                  variantId: firstSelected.variantId,
                }
              : slot,
          ),
        }
      },
      expectedMessage: 'Draft block maps to multiple selected trace slots.',
    },
  ])('hard-fails when $name', ({ mutate, expectedMessage }) => {
    const { traced } = traceMismatchFixture()
    const result = analyzeTraceMutation(mutate(traced.assemblyTrace) as DraftAssemblyTrace)

    expect(result.status).toBe('hard_failure')
    expect(result.hardFailures).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: 'assembly_trace_mismatch',
          message: expectedMessage,
        }),
      ]),
    )
  })

  it('groups routeable observations with drill, variant, block, cap, and cell details', () => {
    const groups = buildGeneratedPlanObservationGroups(buildGeneratedPlanDiagnostics())
    const overCapGroups = groups.filter((group) =>
      group.observationCodes.includes('over_authored_max'),
    )

    expect(overCapGroups.length).toBeGreaterThan(0)
    expect(overCapGroups.every((group) => group.drillId && group.variantId)).toBe(true)
    expect(overCapGroups.every((group) => group.groupKey.startsWith('gpdg:v1:'))).toBe(true)
    expect(overCapGroups.every((group) => group.diagnosticFingerprint.startsWith('gpdf|v1|'))).toBe(
      true,
    )
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
    expect(
      overCapGroups
        .flatMap((group) => group.affectedCells)
        .filter((cell) => cell.observationCodes.includes('optional_slot_redistribution'))
        .every((cell) => cell.plannedMinutes !== undefined),
    ).toBe(true)
    expect(
      overCapGroups
        .filter((group) => group.observationCodes.includes('optional_slot_redistribution'))
        .every((group) => group.likelyFixPaths.includes('generator_policy_investigation')),
    ).toBe(true)

    const underMinGroup = groups.find((group) =>
      group.observationCodes.includes('under_authored_min'),
    )
    expect(underMinGroup).toEqual(
      expect.objectContaining({
        authoredMinMinutes: expect.any(Number),
        affectedCellCount: expect.any(Number),
        likelyFixPaths: expect.arrayContaining(['variant_cap_review']),
      }),
    )
    expect(underMinGroup?.affectedCells[0]).toEqual(
      expect.objectContaining({
        plannedMinutes: expect.any(Number),
        allocatedMinutes: expect.any(Number),
        observationCodes: expect.arrayContaining(['under_authored_min']),
      }),
    )
  })

})
