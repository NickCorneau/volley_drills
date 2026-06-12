import { DRILLS } from '../../data/drills'
import type { BlockSlotType, Drill, DrillVariant, SessionDraft, TimeProfile } from '../../model'
import {
  DEFAULT_GENERATED_PLAN_SEEDS,
  DEFAULT_GENERATED_PLAN_SURFACE,
  DEFAULT_GENERATED_PLAN_SURFACE_CONTRACT,
  STEERED_GENERATED_PLAN_POSITION_ROLES,
  STEERED_GENERATED_PLAN_SEEDS,
  STEERED_GENERATED_PLAN_SURFACE_CONTRACT,
  analyzeSelectedDraftStretch,
  analyzeGeneratedPlanDraft,
  buildApplicableGeneratedPlanInputs,
  buildGeneratedPlanDiagnostics,
  buildGeneratedPlanMatrix,
  buildGeneratedPlanObservationGroups,
  buildGeneratedPlanSurfaceContractReport,
  buildGeneratedPlanSurfaceSummary,
  buildSteeredGeneratedPlanDiagnostics,
  buildSteeredGeneratedPlanMatrix,
  isGeneratedPlanDiagnosticStatus,
  steeredGenerationHardFailures,
  steeredPositionForCell,
  summarizeGeneratedPlanDiagnostics,
  summarizeSteeredGeneratedPlanDiagnostics,
  validateGeneratedPlanSurfaceContract,
  validateSteeredGeneratedPlanSurfaceContract,
  type SteeredGeneratedPlanMatrixCell,
} from '../generatedPlanDiagnostics'
import { startingStressRung, stressLadderBounds, stressRungForDrill } from '../../data/stressLadders'
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
  it('treats a per-block-at-cap session under its named profile as observation_only (R13)', () => {
    // U4 (2026-05-24 duration-honesty plan, R13): a sparse fixture
    // (single 8-min block, named profile 40) is no longer "clean" —
    // the new `under_named_profile_duration` finding fires whenever
    // total < profile by >= 1 min. Per-block over/under remain clean.
    const result = analyzeSelectedDraftStretch(servingDraft(8), cleanServingTrace)

    expect(result.status).toBe('observation_only')
    expect(result.hardFailures).toEqual([])
    expect(result.observations).toEqual([
      expect.objectContaining({
        code: 'under_named_profile_duration',
        plannedMinutes: 8,
        namedProfileMinutes: 40,
      }),
    ])
  })

  it('classifies authored max and fatigue cap overage and emits slot_dropped + under_named_profile_duration (R13)', () => {
    // U4 (2026-05-24 duration-honesty plan, R13): replaces the
    // retired `optional_slot_redistribution` finding with `slot_dropped`
    // (per-dropped-slot) + `under_named_profile_duration` (per-session).
    // The redistribution trace metadata is preserved on the fixture so
    // `classificationSource: 'observed_redistribution'` still attaches
    // to over_authored_max / over_fatigue_cap when redistribution
    // evidence is present (legacy trace shape under-test).
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
        // U4: `slot_dropped` is per-dropped-slot. The trace lists
        // layoutIndex 1 (pressure, required=false) as dropped, so the
        // finding carries the dropped slot's identity — not the
        // rerouted-to main_skill block.
        expect.objectContaining({
          code: 'slot_dropped',
          blockType: 'pressure',
          required: false,
          layoutIndex: 1,
          allocatedMinutes: 1,
          skippedOptionalLayoutIndexes: [1],
        }),
        // U4: `under_named_profile_duration` fires when total < named
        // profile by >= 1 min. The fixture's single 9-min block sums
        // to 9; the timeProfile is 40, so the gap is 31.
        expect.objectContaining({
          code: 'under_named_profile_duration',
          plannedMinutes: 9,
          namedProfileMinutes: 40,
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
      // 2026-05-24 duration-honesty Stage 1 (U1+U2+U3+U4):
      //   - R1 retired the `redistributedMinutes`-onto-main_skill
      //     uplift. Many cells that previously tripped
      //     over_authored_max / over_fatigue_cap on a redistributed
      //     main_skill block now sit cleanly within the slot's
      //     authored cap.
      //   - U2's pass-fallback retry fills more optional slots, so
      //     fewer cells trip `slot_dropped`.
      //   - U4 introduced `under_named_profile_duration` (fires when
      //     total < timeProfile by >= 1 min). Many sparse-catalog
      //     cells now carry this new finding instead of (or in
      //     addition to) the retired `optional_slot_redistribution`.
      //
      // Net: clean rose 136 -> 165 as the over-cap stretch population
      // collapsed. Observation_only fell 404 -> 375 — the
      // honest-duration cells stop carrying the redistribution-on-
      // main_skill observation and many cleanly hit the cap floor.
      clean: 165,
      observation_only: 375,
      hard_failure: 0,
    })
    expect(summary.observationCounts).toEqual({
      // R1 + R5 + U4 finding shifts:
      //   - under_authored_min: unchanged at 290 (warmup/wrap snap
      //     behavior preserved per R16).
      //   - slot_dropped: 200 -> 48. The U2 pass-fallback now fills
      //     most previously-dropping optional slots, so the per-slot
      //     drop signal collapses.
      //   - over_authored_max + over_fatigue_cap: 229 -> 109 each.
      //     Without the `+ redistributedMinutes` uplift, the
      //     remaining over-cap cells come from the trace's allocated-
      //     duration counterfactual (legacy fixtures consumed via
      //     `analyzeSelectedDraftStretch`), not from real builds.
      //   - under_named_profile_duration: NEW. Fires on cells where
      //     total < named profile by >= 1 min (the honest-duration
      //     gap U4's diagnostic-grade threshold surfaces).
      under_authored_min: 290,
      slot_dropped: 48,
      under_named_profile_duration: 207,
      over_authored_max: 109,
      over_fatigue_cap: 109,
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
        .filter((cell) => cell.observationCodes.includes('slot_dropped'))
        .every((cell) => cell.plannedMinutes !== undefined),
    ).toBe(true)
    expect(
      overCapGroups
        .filter((group) => group.observationCodes.includes('slot_dropped'))
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

/**
 * U7 (D159, R6): the steered sweep. The steered path — every live
 * caller's path since D154 — gets a bounded regression surface keyed on
 * the U6 selection-path trace marker. These tests cover the checker
 * directly (crafted traces) AND the real-catalog sweep.
 */
describe('steered generated plan diagnostics (U7)', () => {
  const PASS_BOUNDS = stressLadderBounds('pass')

  function steeredCell(
    overrides: Partial<SteeredGeneratedPlanMatrixCell> = {},
  ): SteeredGeneratedPlanMatrixCell {
    return {
      focus: 'pass',
      configuration: 'pair_open',
      level: 'intermediate',
      duration: 25,
      seed: 'matrix-a',
      positionRole: 'ladder_max',
      position: PASS_BOUNDS.max,
      ...overrides,
    }
  }

  function mainSkillBlock(
    drillId: string,
    variantId: string,
  ): SessionDraft['blocks'][number] {
    return {
      id: 'block-main',
      type: 'main_skill',
      drillId,
      variantId,
      drillName: drillId,
      shortName: drillId,
      durationMinutes: 8,
      coachingCue: 'cue',
      courtsideInstructions: 'do',
      required: true,
      rationale: 'fixture',
    }
  }

  function steeredDraft(
    block: SessionDraft['blocks'][number],
    steeredFocus?: SessionDraft['steeredFocus'],
  ): SessionDraft {
    return {
      id: 'current',
      context: {
        playerMode: 'pair',
        timeProfile: 25,
        netAvailable: false,
        wallAvailable: false,
        sessionFocus: 'pass',
        playerLevel: 'intermediate',
      },
      archetypeId: 'pair_open',
      archetypeName: 'Pair + Open',
      blocks: [block],
      updatedAt: 1,
      ...(steeredFocus !== undefined ? { steeredFocus } : {}),
    }
  }

  function trace(
    selectionPath: 'rung_nearest' | 'duration_fit' | 'reroute' | 'substitution' | undefined,
    block: SessionDraft['blocks'][number],
  ): DraftAssemblyTrace {
    return {
      slots: [
        {
          layoutIndex: 0,
          type: 'main_skill',
          required: true,
          allocatedMinutes: 8,
          selected: true,
          blockId: block.id,
          drillId: block.drillId,
          variantId: block.variantId,
          ...(selectionPath !== undefined ? { selectionPath } : {}),
        },
      ],
      skippedOptionalLayoutIndexes: [],
      redistributedMinutes: 0,
      redistributionLayoutIndex: undefined,
    }
  }

  it('resolves position roles to ladder min, band start, and ladder max', () => {
    expect(steeredPositionForCell('pass', 'beginner', 'ladder_min')).toBe(PASS_BOUNDS.min)
    expect(steeredPositionForCell('pass', 'beginner', 'ladder_max')).toBe(PASS_BOUNDS.max)
    // band_start delegates to startingStressRung; assert agreement
    // rather than hard-coding the band map.
    expect(steeredPositionForCell('pass', 'intermediate', 'band_start')).toBe(
      startingStressRung('pass', 'intermediate'),
    )
  })

  it('builds a bounded 135-cell matrix (3 focuses × 5 configs × 3 levels × 25 × matrix-a × 3 roles)', () => {
    const matrix = buildSteeredGeneratedPlanMatrix()
    expect(matrix).toHaveLength(
      VISIBLE_FOCUSES.length * READINESS_CONFIGURATIONS.length * PLAYER_LEVELS.length * 1 * 1 * 3,
    )
    expect(matrix).toHaveLength(135)
    expect([...new Set(matrix.map((cell) => cell.duration))]).toEqual([25])
    expect([...new Set(matrix.map((cell) => cell.seed))]).toEqual(['matrix-a'])
    expect([...new Set(matrix.map((cell) => cell.positionRole))].sort()).toEqual(
      [...STEERED_GENERATED_PLAN_POSITION_ROLES].sort(),
    )
  })

  it('the steered surface contract validates cleanly and accepts the position dimension', () => {
    const validation = validateSteeredGeneratedPlanSurfaceContract()
    expect(validation.blockingIssues).toEqual([])
    expect(STEERED_GENERATED_PLAN_SURFACE_CONTRACT.included.positionRoles).toEqual(
      STEERED_GENERATED_PLAN_POSITION_ROLES,
    )
    expect(STEERED_GENERATED_PLAN_SEEDS).toEqual(['matrix-a'])
  })

  it('the steered sweep over the real catalog yields zero hard failures', () => {
    const results = buildSteeredGeneratedPlanDiagnostics()
    const summary = summarizeSteeredGeneratedPlanDiagnostics(results)
    expect(summary.surface.cellCount).toBe(135)
    expect(summary.hardFailureCount).toBe(0)
    expect(results.filter((result) => result.status === 'hard_failure')).toEqual([])
    // Degenerate band-start overlaps (e.g. beginner band start = ladder
    // min) are documented, not collapsed — the role stays a dimension.
    expect(summary.surface.degenerateBandStartCellCount).toBeGreaterThan(0)
  })

  it('steering_violation fires when a rung_nearest pick is not nearest-eligible', () => {
    // Claim rung_nearest at position max (5) but select d01 (rung 1):
    // the pair/open pass pool holds d46/d50 at rung 5, so d01 is not
    // nearest-eligible.
    expect(stressRungForDrill('pass', 'd01')).toBe(1)
    const block = mainSkillBlock('d01', 'd01-pair')
    const failures = steeredGenerationHardFailures(
      steeredCell(),
      steeredDraft(block),
      trace('rung_nearest', block),
    )
    expect(failures.map((failure) => failure.code)).toContain('steering_violation')
  })

  it('steering_violation fires when a steered main-skill slot has no marker', () => {
    const block = mainSkillBlock('d46', 'd46-pair-open')
    const failures = steeredGenerationHardFailures(
      steeredCell(),
      steeredDraft(block, 'pass'),
      trace(undefined, block),
    )
    expect(failures.map((failure) => failure.code)).toContain('steering_violation')
  })

  it('does NOT fire steering_violation on duration_fit / reroute / substitution markers', () => {
    // d01 (rung 1) under a position-5 steer would be a violation IF the
    // marker claimed rung_nearest; the legitimate-override markers make
    // it a non-violation regardless of realized rung.
    const block = mainSkillBlock('d01', 'd01-pair')
    for (const path of ['duration_fit', 'reroute', 'substitution'] as const) {
      const failures = steeredGenerationHardFailures(
        steeredCell(),
        steeredDraft(block),
        trace(path, block),
      )
      expect(failures.map((failure) => failure.code)).not.toContain('steering_violation')
    }
  })

  it('steered_focus_missing fires when a realized on-target pick lacks provenance', () => {
    // d46 sits at rung 5 = position; an honest build would stamp
    // steeredFocus. A draft missing the stamp is a provenance failure.
    expect(stressRungForDrill('pass', 'd46')).toBe(PASS_BOUNDS.max)
    const block = mainSkillBlock('d46', 'd46-pair-open')
    const failures = steeredGenerationHardFailures(
      steeredCell(),
      steeredDraft(block, undefined),
      trace('rung_nearest', block),
    )
    expect(failures.map((failure) => failure.code)).toContain('steered_focus_missing')
  })

  it('accepts a faithful on-target rung_nearest pick with provenance (no failures)', () => {
    const block = mainSkillBlock('d46', 'd46-pair-open')
    const failures = steeredGenerationHardFailures(
      steeredCell(),
      steeredDraft(block, 'pass'),
      trace('rung_nearest', block),
    )
    expect(failures).toEqual([])
  })

  it('flags a steeredFocus stamp the realized rungs do not support', () => {
    // Stamp claims pass but the realized main-skill rung (d01 = 1) is
    // off the position-5 target.
    const block = mainSkillBlock('d01', 'd01-pair')
    const failures = steeredGenerationHardFailures(
      steeredCell(),
      steeredDraft(block, 'pass'),
      trace('duration_fit', block),
    )
    expect(failures.map((failure) => failure.code)).toContain('steering_violation')
  })
})
