import { describe, expect, it } from 'vitest'
import {
  buildGeneratedPlanDiagnostics,
  buildGeneratedPlanObservationGroups,
  type GeneratedPlanDiagnosticResult,
  type GeneratedPlanObservationAffectedCell,
  type GeneratedPlanObservationGroup,
} from '../generatedPlanDiagnostics'
import {
  authorizationStatusForGeneratedPlanD47GapClosureState,
  buildGeneratedPlanDecisionDebtPrompts,
  buildGeneratedPlanD01BlockShapeFillReceipt,
  buildGeneratedPlanD01CapCatalogForkPacket,
  buildGeneratedPlanD01GapFillProposal,
  buildGeneratedPlanD01WorkloadBlockShapeProposal,
  buildCurrentGeneratedPlanD47D05ComparatorEvaluationPayload,
  buildGeneratedPlanD47D05ComparatorDecisionPacket,
  buildGeneratedPlanD47GapClosureLedger,
  buildGeneratedPlanD47ProposalAdmissionTicket,
  buildGeneratedPlanD49ResidualFollowUpPacket,
  buildGeneratedPlanGapClosureSelectionWorkbench,
  buildGeneratedPlanRedistributionCausalityReceipt,
  buildGeneratedPlanTriageWorkbenchMarkdown,
  buildInitialGeneratedPlanTriageRegistry,
  conservativeRouteForGeneratedPlanGroup,
  evaluationsForGeneratedPlanD47D05ComparatorPayload,
  formatGeneratedPlanD01CapCatalogForkPacketMarkdown,
  formatGeneratedPlanD47D05ComparatorEvaluationPayloadMarkdown,
  formatGeneratedPlanD47D05ComparatorDecisionPacketMarkdown,
  isGeneratedPlanEnforcementStatus,
  isGeneratedPlanTriageRoute,
  isGeneratedPlanTriageStatus,
  validateGeneratedPlanTriageCoverage,
  type GeneratedPlanTriageEntry,
} from '../generatedPlanDiagnosticTriage'

function currentGroups(): GeneratedPlanObservationGroup[] {
  return buildGeneratedPlanObservationGroups(buildGeneratedPlanDiagnostics())
}

const D47_STABLE_GROUP_KEY =
  'gpdg:v1:d47:d47-solo-open:main_skill:true:optional_slot_redistribution+over_authored_max+over_fatigue_cap'

const shiftedD47GroupKey =
  'gpdg:v1:d47:d47-solo-open:main_skill:true:optional_slot_redistribution+over_authored_max+review_fixture'

function withoutD49Groups(
  groups: readonly GeneratedPlanObservationGroup[],
): GeneratedPlanObservationGroup[] {
  return groups.filter((group) => group.drillId !== 'd49')
}

function makeGroupComparisonInconclusive(
  groups: readonly GeneratedPlanObservationGroup[],
  groupKey: string,
): GeneratedPlanObservationGroup[] {
  return groups.map((group) =>
    group.groupKey === groupKey
      ? {
          ...group,
          affectedCells: group.affectedCells.map((cell) => ({
            ...cell,
            plannedMinutes: undefined,
          })),
        }
      : group,
  )
}

function redistributionCell(
  overrides: Partial<GeneratedPlanObservationAffectedCell> = {},
): GeneratedPlanObservationAffectedCell {
  return {
    focus: 'serve',
    configuration: 'pair_open',
    level: 'beginner',
    duration: 40,
    seed: 'receipt-fixture',
    blockId: 'block-0',
    plannedMinutes: 9,
    allocatedMinutes: 8,
    authoredMinMinutes: 4,
    authoredMaxMinutes: 8,
    fatigueMaxMinutes: 8,
    observationCodes: ['optional_slot_redistribution', 'over_authored_max', 'over_fatigue_cap'],
    redistribution: {
      source: 'observed',
      redistributedMinutes: 1,
      skippedOptionalLayoutIndexes: [1],
      redistributionLayoutIndex: 0,
    },
    ...overrides,
  }
}

function redistributionGroup(
  overrides: Partial<GeneratedPlanObservationGroup> = {},
): GeneratedPlanObservationGroup {
  const affectedCells = overrides.affectedCells ?? [redistributionCell()]
  return {
    groupKey:
      'gpdg:v1:d31:d31-pair-open:main_skill:true:optional_slot_redistribution+over_authored_max+over_fatigue_cap',
    diagnosticFingerprint: 'gpdf|fixture',
    drillId: 'd31',
    variantId: 'd31-pair-open',
    blockType: 'main_skill',
    required: true,
    authoredMinMinutes: 4,
    authoredMaxMinutes: 8,
    fatigueMaxMinutes: 8,
    affectedCellCount: affectedCells.length,
    observationCodes: ['optional_slot_redistribution', 'over_authored_max', 'over_fatigue_cap'],
    likelyFixPaths: ['generator_policy_investigation'],
    affectedCells,
    ...overrides,
  }
}

describe('generated plan diagnostic triage identity', () => {
  function resultWithObservationCodes(
    codes: readonly ('over_authored_max' | 'over_fatigue_cap')[],
  ) {
    return {
      focus: 'serve' as const,
      configuration: 'pair_open' as const,
      level: 'beginner' as const,
      duration: 40 as const,
      seed: 'order-fixture',
      status: 'observation_only' as const,
      hardFailures: [],
      observations: codes.map((code) => ({
        code,
        blockId: 'block-0',
        blockType: 'main_skill',
        required: true,
        drillId: 'd31',
        variantId: 'd31-pair-open',
        plannedMinutes: 9,
        allocatedMinutes: 9,
        authoredMaxMinutes: 8,
        fatigueMaxMinutes: 8,
      })),
    } satisfies GeneratedPlanDiagnosticResult
  }

  it('adds stable group keys and diagnostic fingerprints to routeable groups', () => {
    const groups = currentGroups()

    expect(groups).toHaveLength(58)
    expect(groups[0]).toEqual(
      expect.objectContaining({
        groupKey: 'gpdg:v1:d25:d25-solo:wrap:true:under_authored_min',
        diagnosticFingerprint: expect.stringContaining('gpdf|v1|4|none|none|79'),
        affectedCellCount: 79,
      }),
    )
    expect(new Set(groups.map((group) => group.groupKey)).size).toBe(groups.length)
  })

  it('keeps mutable cap facts in the fingerprint instead of the group key', () => {
    const [original] = buildGeneratedPlanObservationGroups([
      resultWithObservationCodes(['over_authored_max', 'over_fatigue_cap']),
    ])
    const [changedCap] = buildGeneratedPlanObservationGroups([
      {
        ...resultWithObservationCodes(['over_authored_max', 'over_fatigue_cap']),
        observations: resultWithObservationCodes([
          'over_authored_max',
          'over_fatigue_cap',
        ]).observations.map((observation) => ({
          ...observation,
          authoredMaxMinutes: 9,
          fatigueMaxMinutes: 9,
        })),
      },
    ])
    if (!original || !changedCap) throw new Error('Expected synthetic observation groups.')

    expect(changedCap.groupKey).toBe(original.groupKey)
    expect(changedCap.diagnosticFingerprint).not.toBe(original.diagnosticFingerprint)
  })

  it('keeps group keys stable when observation codes are discovered in different orders', () => {
    const [first] = buildGeneratedPlanObservationGroups([
      resultWithObservationCodes(['over_authored_max', 'over_fatigue_cap']),
    ])
    const [second] = buildGeneratedPlanObservationGroups([
      resultWithObservationCodes(['over_fatigue_cap', 'over_authored_max']),
    ])
    if (!first || !second) throw new Error('Expected synthetic observation groups.')

    expect(second.groupKey).toBe(first.groupKey)
  })

  it('keeps diagnostic fingerprints stable when affected cells are discovered in different orders', () => {
    const firstResults = [
      { ...resultWithObservationCodes(['over_authored_max', 'over_fatigue_cap']), seed: 'a' },
      { ...resultWithObservationCodes(['over_authored_max', 'over_fatigue_cap']), seed: 'b' },
    ] satisfies GeneratedPlanDiagnosticResult[]
    const secondResults = [...firstResults].reverse()
    const [first] = buildGeneratedPlanObservationGroups(firstResults)
    const [second] = buildGeneratedPlanObservationGroups(secondResults)
    if (!first || !second) throw new Error('Expected synthetic observation groups.')

    expect(second.diagnosticFingerprint).toBe(first.diagnosticFingerprint)
  })

  it('guards triage status, route, and enforcement unions', () => {
    expect(isGeneratedPlanTriageStatus('observed')).toBe(true)
    expect(isGeneratedPlanTriageStatus('needs_review')).toBe(false)
    expect(isGeneratedPlanTriageRoute('generator_policy_investigation')).toBe(true)
    expect(isGeneratedPlanTriageRoute('add_drill_now')).toBe(false)
    expect(isGeneratedPlanEnforcementStatus('hard_fail_enforced')).toBe(true)
    expect(isGeneratedPlanEnforcementStatus('error')).toBe(false)
  })
})

describe('generated plan diagnostic triage registry', () => {
  it('builds conservative initial entries for all current groups', () => {
    const groups = currentGroups()
    const registry = buildInitialGeneratedPlanTriageRegistry(groups)
    const validation = validateGeneratedPlanTriageCoverage(groups, registry)

    expect(registry).toHaveLength(groups.length)
    expect(validation.blockingIssues).toEqual([])
    expect(validation.warningIssues).toEqual([])
    expect(registry[0]).toEqual(
      expect.objectContaining({
        groupKey: groups[0]?.groupKey,
        affectedCellCount: groups[0]?.affectedCellCount,
        likelyFixPaths: groups[0]?.likelyFixPaths,
        enforcementStatus: 'observation_only',
      }),
    )
  })

  it('routes redistribution-bearing groups to generator policy investigation', () => {
    const redistributionGroup = currentGroups().find((group) =>
      group.observationCodes.includes('optional_slot_redistribution'),
    )
    if (!redistributionGroup) throw new Error('Expected a redistribution observation group.')

    expect(conservativeRouteForGeneratedPlanGroup(redistributionGroup)).toBe(
      'generator_policy_investigation',
    )
  })

  it('fails coverage when a current group has no triage entry', () => {
    const groups = currentGroups()
    const registry = buildInitialGeneratedPlanTriageRegistry(groups).slice(1)
    const validation = validateGeneratedPlanTriageCoverage(groups, registry)

    expect(validation.blockingIssues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: 'untriaged_group',
          groupKey: groups[0]?.groupKey,
        }),
      ]),
    )
  })

  it('fails freshness when a current group fingerprint changes', () => {
    const groups = currentGroups()
    const registry = buildInitialGeneratedPlanTriageRegistry(groups)
    const staleRegistry = registry.map((entry, index) =>
      index === 0
        ? { ...entry, diagnosticFingerprint: `${entry.diagnosticFingerprint}:stale` }
        : entry,
    )
    const validation = validateGeneratedPlanTriageCoverage(groups, staleRegistry)

    expect(validation.blockingIssues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: 'stale_fingerprint',
          groupKey: groups[0]?.groupKey,
        }),
      ]),
    )
  })

  it('fails enforced findings while they are still present', () => {
    const groups = currentGroups()
    const registry = buildInitialGeneratedPlanTriageRegistry(groups)
    const enforcedRegistry: GeneratedPlanTriageEntry[] = registry.map((entry, index) =>
      index === 0 ? { ...entry, enforcementStatus: 'hard_fail_enforced' } : entry,
    )
    const validation = validateGeneratedPlanTriageCoverage(groups, enforcedRegistry)

    expect(validation.blockingIssues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: 'enforced_group_present',
          groupKey: groups[0]?.groupKey,
        }),
      ]),
    )
  })

  it('fails invalid and duplicate registry entries', () => {
    const groups = currentGroups()
    const registry = buildInitialGeneratedPlanTriageRegistry(groups)
    const firstEntry = registry[0]
    if (!firstEntry) throw new Error('Expected at least one registry entry.')
    const invalidRegistry = [
      { ...firstEntry, route: 'add_drill_now' },
      firstEntry,
      ...registry.slice(1),
    ] as unknown as GeneratedPlanTriageEntry[]
    const validation = validateGeneratedPlanTriageCoverage(groups, invalidRegistry)

    expect(validation.blockingIssues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: 'invalid_registry_entry',
          groupKey: groups[0]?.groupKey,
        }),
        expect.objectContaining({
          code: 'duplicate_group_key',
          groupKey: groups[0]?.groupKey,
        }),
      ]),
    )
  })

  it('requires evidence before resolving source-backed content routes', () => {
    const groups = currentGroups()
    const registry = buildInitialGeneratedPlanTriageRegistry(groups)
    const sourceDepthRegistry: GeneratedPlanTriageEntry[] = registry.map((entry, index) =>
      index === 0
        ? {
            ...entry,
            triageStatus: 'resolved',
            route: 'source_backed_content_depth',
            evidence: [],
          }
        : entry,
    )
    const validation = validateGeneratedPlanTriageCoverage(groups, sourceDepthRegistry)

    expect(validation.blockingIssues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: 'source_depth_missing_evidence',
          groupKey: groups[0]?.groupKey,
        }),
      ]),
    )
  })

  it('renders a scan-first triage workbench summary', () => {
    const groups = currentGroups()
    const registry = buildInitialGeneratedPlanTriageRegistry(groups)
    const markdown = buildGeneratedPlanTriageWorkbenchMarkdown(groups, registry)

    expect(markdown).toContain('## Triage Summary')
    expect(markdown).toContain('- Current routeable groups: 58')
    expect(markdown).toContain('## New / Untriaged Blockers')
    expect(markdown).toContain('## Stale Fingerprint Review')
    expect(markdown).toContain('## Generator Policy Investigation')
    expect(markdown).toContain('gpdg:v1:d25:d25-solo:wrap:true:under_authored_min')
  })

  it('renders validation issue sections for untriaged, stale, and superseded entries', () => {
    const groups = currentGroups()
    const registry = buildInitialGeneratedPlanTriageRegistry(groups)
    const firstEntry = registry[0]
    if (!firstEntry) throw new Error('Expected at least one registry entry.')
    const extraEntry = {
      ...firstEntry,
      groupKey: 'gpdg:v1:stale:entry:main_skill:true:under_authored_min',
    } satisfies GeneratedPlanTriageEntry
    const brokenRegistry: GeneratedPlanTriageEntry[] = [
      ...registry.slice(1, 2).map((entry) => ({
        ...entry,
        diagnosticFingerprint: `${entry.diagnosticFingerprint}:stale`,
      })),
      ...registry.slice(2),
      extraEntry,
    ]

    const markdown = buildGeneratedPlanTriageWorkbenchMarkdown(groups, brokenRegistry)

    expect(markdown).toContain(
      'Current generated-plan observation group has no triage registry entry.',
    )
    expect(markdown).toContain('Triage registry entry fingerprint no longer matches')
    expect(markdown).toContain('gpdg:v1:stale:entry:main_skill:true:under_authored_min')
  })

  it('renders all blocking validation issue types into the workbench', () => {
    const groups = currentGroups()
    const registry = buildInitialGeneratedPlanTriageRegistry(groups)
    const brokenRegistry = registry.map((entry, index) => {
      if (index === 0) return { ...entry, enforcementStatus: 'hard_fail_enforced' }
      if (index === 1)
        return {
          ...entry,
          route: 'source_backed_content_depth',
          triageStatus: 'resolved',
          evidence: [],
        }
      if (index === 2) return { ...entry, rationale: '' }
      return entry
    }) satisfies GeneratedPlanTriageEntry[]

    const markdown = buildGeneratedPlanTriageWorkbenchMarkdown(groups, brokenRegistry)

    expect(markdown).toContain('## Other Blocking Validation Issues')
    expect(markdown).toContain('enforced_group_present')
    expect(markdown).toContain('source_depth_missing_evidence')
    expect(markdown).toContain('missing_required_field')
  })

  it('compresses current triage groups into human-sized decision prompts', () => {
    const groups = currentGroups()
    const registry = buildInitialGeneratedPlanTriageRegistry(groups)
    const prompts = buildGeneratedPlanDecisionDebtPrompts(groups, registry)

    expect(prompts.length).toBeLessThanOrEqual(10)
    expect(prompts.map((prompt) => prompt.lane)).toContain('short_session_cooldown_minimum')
    expect(prompts.map((prompt) => prompt.lane)).toContain('generator_redistribution_investigation')
    expect(prompts.map((prompt) => prompt.lane)).not.toContain('unknown_unclassified')

    const cooldownPrompt = prompts.find(
      (prompt) => prompt.lane === 'short_session_cooldown_minimum',
    )
    expect(cooldownPrompt).toEqual(
      expect.objectContaining({
        recommendedFollowUpUnit: 'U7 workload envelope guidance',
        disposition: 'needs_human_decision',
      }),
    )
    expect(cooldownPrompt?.groupKeys).toContain('gpdg:v1:d25:d25-solo:wrap:true:under_authored_min')
  })

  it('splits redistribution and non-redistribution over-cap cells in compressed prompts', () => {
    const groups = currentGroups()
    const registry = buildInitialGeneratedPlanTriageRegistry(groups)
    const prompts = buildGeneratedPlanDecisionDebtPrompts(groups, registry)
    const redistributionPrompt = prompts.find(
      (prompt) => prompt.lane === 'generator_redistribution_investigation',
    )

    expect(redistributionPrompt).toBeDefined()
    expect(redistributionPrompt?.totalAffectedCellCount).toBeGreaterThan(0)
    expect(redistributionPrompt?.redistributionAffectedCellCount).toBeGreaterThan(0)
    expect(redistributionPrompt?.nonRedistributionOverCapCellCount).toBeGreaterThan(0)
    expect(redistributionPrompt?.totalAffectedCellCount).toBeGreaterThanOrEqual(
      redistributionPrompt?.redistributionAffectedCellCount ?? 0,
    )
  })

  it('builds a repeatable redistribution causality receipt for current generator-policy groups', () => {
    const groups = currentGroups()
    const registry = buildInitialGeneratedPlanTriageRegistry(groups)
    const receipt = buildGeneratedPlanRedistributionCausalityReceipt(groups, registry)

    expect(receipt.comparisonMode).toBe('allocated_duration_counterfactual')
    expect(receipt.runtimeBoundary).toContain('Diagnostic-only counterfactual receipt')
    expect(receipt.groupCount).toBe(23)
    expect(receipt.counts.totalAffectedCellCount).toBe(231)
    expect(receipt.counts.redistributionAffectedCellCount).toBe(228)
    expect(receipt.counts.nonRedistributionOverCapCellCount).toBe(3)
    expect(receipt.counts.nonRedistributionUnderMinCellCount).toBe(0)
    expect(receipt.counts.pressureDisappearsCellCount).toBeGreaterThan(0)
    expect(receipt.counts.pressureRemainsCellCount).toBeGreaterThan(0)
    expect(receipt.counts.counterfactualUnfilledMinutes).toBeGreaterThan(0)
    expect(receipt.groups.every((group) => group.groupKey.startsWith('gpdg:v1:'))).toBe(true)
  })

  it('classifies redistribution causality states and preserves mixed-group evidence', () => {
    const pressureDisappears = redistributionGroup({
      groupKey:
        'gpdg:v1:d31:disappears:main_skill:true:optional_slot_redistribution+over_authored_max',
      affectedCells: [redistributionCell()],
    })
    const pressureRemains = redistributionGroup({
      groupKey:
        'gpdg:v1:d31:remains:main_skill:true:optional_slot_redistribution+over_authored_max',
      affectedCells: [redistributionCell({ allocatedMinutes: 9 })],
    })
    const inconclusive = redistributionGroup({
      groupKey:
        'gpdg:v1:d31:inconclusive:main_skill:true:optional_slot_redistribution+over_authored_max',
      affectedCells: [redistributionCell({ allocatedMinutes: undefined })],
    })
    const redistributionOnly = redistributionGroup({
      groupKey: 'gpdg:v1:d31:only:main_skill:true:optional_slot_redistribution',
      observationCodes: ['optional_slot_redistribution'],
      affectedCells: [
        redistributionCell({
          plannedMinutes: 8,
          allocatedMinutes: 8,
          observationCodes: ['optional_slot_redistribution'],
        }),
      ],
    })
    const redistributionPreventsUnderMin = redistributionGroup({
      groupKey: 'gpdg:v1:d31:prevents-under-min:main_skill:true:optional_slot_redistribution',
      observationCodes: ['optional_slot_redistribution'],
      affectedCells: [
        redistributionCell({
          plannedMinutes: 8,
          allocatedMinutes: 3,
          observationCodes: ['optional_slot_redistribution'],
        }),
      ],
    })
    const mixed = redistributionGroup({
      groupKey: 'gpdg:v1:d31:mixed:main_skill:true:optional_slot_redistribution+over_authored_max',
      affectedCells: [
        redistributionCell(),
        redistributionCell({ seed: 'receipt-fixture-b', allocatedMinutes: 9 }),
      ],
    })
    const groups = [
      pressureDisappears,
      pressureRemains,
      inconclusive,
      redistributionOnly,
      redistributionPreventsUnderMin,
      mixed,
    ]
    const registry = buildInitialGeneratedPlanTriageRegistry(groups)
    const receipt = buildGeneratedPlanRedistributionCausalityReceipt(groups, registry)
    const byKey = new Map(receipt.groups.map((group) => [group.groupKey, group] as const))

    expect(byKey.get(pressureDisappears.groupKey)).toEqual(
      expect.objectContaining({
        actionState: 'likely_redistribution_caused',
        followUpRoutes: ['future_generator_policy_decision'],
      }),
    )
    expect(byKey.get(pressureRemains.groupKey)).toEqual(
      expect.objectContaining({
        actionState: 'pressure_remains_without_redistribution',
        followUpRoutes: [
          'workload_review',
          'block_shape_review',
          'source_backed_proposal_work',
          'u6_proposal_admission_candidate',
        ],
      }),
    )
    expect(byKey.get(inconclusive.groupKey)).toEqual(
      expect.objectContaining({
        actionState: 'comparison_inconclusive',
        hasIncompleteEvidence: true,
      }),
    )
    expect(byKey.get(redistributionOnly.groupKey)).toEqual(
      expect.objectContaining({
        actionState: 'redistribution_without_pressure',
        followUpRoutes: ['no_implementation_action_yet'],
      }),
    )
    expect(byKey.get(redistributionPreventsUnderMin.groupKey)).toEqual(
      expect.objectContaining({
        actionState: 'redistribution_without_pressure',
      }),
    )
    expect(
      byKey.get(redistributionPreventsUnderMin.groupKey)?.counts.allocatedUnderAuthoredMinCellCount,
    ).toBe(1)
    expect(
      byKey.get(redistributionPreventsUnderMin.groupKey)?.counts.pressureRemainsCellCount,
    ).toBe(0)
    expect(byKey.get(mixed.groupKey)).toEqual(
      expect.objectContaining({
        actionState: 'pressure_remains_without_redistribution',
        dominantCellState: 'mixed_cell_states',
        followUpRoutes: [
          'workload_review',
          'block_shape_review',
          'source_backed_proposal_work',
          'u6_proposal_admission_candidate',
          'future_generator_policy_decision',
        ],
      }),
    )
    expect(byKey.get(mixed.groupKey)?.counts.pressureDisappearsCellCount).toBe(1)
    expect(byKey.get(mixed.groupKey)?.counts.pressureRemainsCellCount).toBe(1)
  })

  it('marks missing workload limits as inconclusive instead of claiming causality', () => {
    const group = redistributionGroup({
      groupKey:
        'gpdg:v1:d31:missing-variant:main_skill:true:optional_slot_redistribution+over_authored_max',
      variantId: 'missing-variant',
      authoredMinMinutes: undefined,
      authoredMaxMinutes: undefined,
      fatigueMaxMinutes: undefined,
      affectedCells: [
        redistributionCell({
          authoredMinMinutes: undefined,
          authoredMaxMinutes: undefined,
          fatigueMaxMinutes: undefined,
        }),
      ],
    })
    const receipt = buildGeneratedPlanRedistributionCausalityReceipt(
      [group],
      buildInitialGeneratedPlanTriageRegistry([group]),
    )

    expect(receipt.groups[0]).toEqual(
      expect.objectContaining({
        actionState: 'comparison_inconclusive',
        hasIncompleteEvidence: true,
      }),
    )
    expect(receipt.counts.comparisonInconclusiveCellCount).toBe(1)
  })

  it('keeps rerouted redistribution groups in the causality receipt while unresolved', () => {
    const group = redistributionGroup()
    const [entry] = buildInitialGeneratedPlanTriageRegistry([group])
    if (!entry) throw new Error('Expected synthetic triage entry.')
    const receipt = buildGeneratedPlanRedistributionCausalityReceipt(
      [group],
      [{ ...entry, route: 'block_split' }],
    )

    expect(receipt.groups).toHaveLength(1)
    expect(receipt.groups[0]).toEqual(
      expect.objectContaining({
        groupKey: group.groupKey,
        triageRoute: 'block_split',
      }),
    )
  })

  it('keeps the closed D47 proposal admission key visible after D49 absorbs it', () => {
    const groups = currentGroups()
    const registry = buildInitialGeneratedPlanTriageRegistry(groups)
    const ticket = buildGeneratedPlanD47ProposalAdmissionTicket(groups, registry)

    expect(ticket).toEqual(
      expect.objectContaining({
        admissionState: 'evidence_gathering',
        previewReady: false,
        sourceEvidenceState: 'missing',
        candidateFound: false,
        candidate: expect.objectContaining({
          groupKey: D47_STABLE_GROUP_KEY,
          drillId: undefined,
          variantId: undefined,
          blockType: undefined,
          triageRoute: undefined,
        }),
        receiptFacts: expect.objectContaining({
          totalAffectedCellCount: 0,
          pressureDisappearsCellCount: 0,
          pressureRemainsCellCount: 0,
          nonRedistributionPressureCellCount: 0,
          comparisonInconclusiveCellCount: 0,
        }),
        missingProposalFacts: [
          'concrete_delta',
          'evidence_basis',
          'falsification_condition',
          'expected_diagnostic_movement',
          'product_or_training_quality_hypothesis',
          'no_action_threshold',
        ],
      }),
    )
    expect(ticket.workloadProposalTracks).toEqual([])
    expect(ticket.generatorPolicyTracks).toEqual([])
    expect(ticket.sourceEvidenceRationale).toContain('No proposed delta')
    expect(ticket.counterfactualPolicyBoundary).toContain('diagnostic evidence')
    expect(ticket.noChangePath).toEqual(
      expect.objectContaining({
        admissionState: 'close_or_hold_without_preview',
        requiresU6Preview: false,
        acceptanceEvidenceRequired: true,
        condition: expect.stringContaining('no-action threshold'),
      }),
    )
  })

  it('keeps shifted D47 receipt candidates visible when the stable admission key is absent', () => {
    const shiftedD47GroupKey =
      'gpdg:v1:d47:d47-solo-open:main_skill:true:optional_slot_redistribution+over_authored_max+review_fixture'
    const groups = [
      redistributionGroup({
        groupKey: shiftedD47GroupKey,
        drillId: 'd47',
        variantId: 'd47-solo-open',
      }),
    ]
    const registry = buildInitialGeneratedPlanTriageRegistry(groups)
    const ticket = buildGeneratedPlanD47ProposalAdmissionTicket(groups, registry)

    expect(ticket.candidateFound).toBe(false)
    expect(ticket.relatedCandidateGroupKeys).toEqual([shiftedD47GroupKey])
    expect(ticket.admissionState).toBe('evidence_gathering')
    expect(ticket.previewReady).toBe(false)
  })

  it('marks the D47 gap closure ledger closed when D49 absorbs the stable receipt key', () => {
    const groups = currentGroups()
    const registry = buildInitialGeneratedPlanTriageRegistry(groups)
    const ledger = buildGeneratedPlanD47GapClosureLedger(groups, registry)

    expect(ledger).toEqual(
      expect.objectContaining({
        candidateFound: false,
        currentnessState: 'closed_by_d49',
        gapType: 'drill_inventory_gap',
        decisionState: 'closed_validated',
        authorizationStatus: 'closed_with_fill',
        candidate: expect.objectContaining({
          groupKey: D47_STABLE_GROUP_KEY,
        }),
        receiptFacts: expect.objectContaining({
          totalAffectedCellCount: 0,
          pressureDisappearsCellCount: 0,
          pressureRemainsCellCount: 0,
          nonRedistributionPressureCellCount: 0,
        }),
        comparatorReceipt: expect.objectContaining({
          comparatorKind: 'no_change_baseline',
        }),
      }),
    )
    expect(ledger.segmentDispositions.map((segment) => segment.segment)).toEqual([
      'pressure_disappears',
      'pressure_remains',
      'non_redistribution_pressure',
    ])
    expect(
      ledger.segmentDispositions.every(
        (segment) => segment.authorizationStatus === 'closed_with_fill',
      ),
    ).toBe(true)
    expect(ledger.nextArtifact).toEqual(
      expect.objectContaining({
        artifactType: 'd49_residual_follow_up',
        owner: 'maintainer',
        abandonCriteria: expect.stringContaining('Re-enter D47'),
      }),
    )
    expect(ledger.sourceDeltaBoundary).toContain('beyond the existing FIVB 4.7 activation')
    expect(ledger.reassessmentResult).toBe('validated')
  })

  it('blocks D47 gap closure authorization when the stable receipt key is absent without D49 closure evidence', () => {
    const groups = withoutD49Groups(currentGroups())
    const registry = buildInitialGeneratedPlanTriageRegistry(groups)
    const ledger = buildGeneratedPlanD47GapClosureLedger(groups, registry)

    expect(ledger.currentnessState).toBe('missing_or_shifted')
    expect(ledger.authorizationStatus).toBe('not_authorized')
    expect(ledger.relatedCandidateGroupKeys).toEqual([])
    if (ledger.comparatorReceipt.comparatorKind === 'receipt_candidate') {
      expect(ledger.comparatorReceipt.groupKey).not.toBe(shiftedD47GroupKey)
    }
  })

  it('falls back to baseline when only shifted D47 evidence is present', () => {
    const shiftedD47Group = redistributionGroup({
      drillId: 'd47',
      variantId: 'd47-solo-open',
      groupKey:
        'gpdg:v1:d47:d47-solo-open:main_skill:true:optional_slot_redistribution+over_authored_max+review_fixture',
    })
    const registry = buildInitialGeneratedPlanTriageRegistry([shiftedD47Group])
    const ledger = buildGeneratedPlanD47GapClosureLedger([shiftedD47Group], registry)

    expect(ledger.candidateFound).toBe(false)
    expect(ledger.currentnessState).toBe('missing_or_shifted')
    expect(ledger.comparatorReceipt.comparatorKind).toBe('no_change_baseline')
    expect(ledger.authorizationStatus).toBe('not_authorized')
  })

  it('marks D47 gap closure ledger stale when the stable D47 fingerprint is stale', () => {
    const groups = [
      redistributionGroup({
        groupKey: D47_STABLE_GROUP_KEY,
        drillId: 'd47',
        variantId: 'd47-solo-open',
      }),
    ]
    const registry = buildInitialGeneratedPlanTriageRegistry(groups).map((entry) =>
      entry.groupKey === D47_STABLE_GROUP_KEY
        ? { ...entry, diagnosticFingerprint: `${entry.diagnosticFingerprint}:stale` }
        : entry,
    )
    const ledger = buildGeneratedPlanD47GapClosureLedger(groups, registry)

    expect(ledger.currentnessState).toBe('stale')
    expect(ledger.authorizationStatus).toBe('not_authorized')
  })

  it('does not select a stale comparator receipt candidate', () => {
    const staleComparatorKey =
      'gpdg:v1:d01:d01-solo:main_skill:true:optional_slot_redistribution+over_authored_max+over_fatigue_cap'
    const groups = [
      redistributionGroup({
        groupKey: D47_STABLE_GROUP_KEY,
        drillId: 'd47',
        variantId: 'd47-solo-open',
      }),
      redistributionGroup({
        groupKey: staleComparatorKey,
        drillId: 'd01',
        variantId: 'd01-solo',
      }),
    ]
    const registry = buildInitialGeneratedPlanTriageRegistry(groups).map((entry) =>
      entry.groupKey === staleComparatorKey
        ? { ...entry, diagnosticFingerprint: `${entry.diagnosticFingerprint}:stale` }
        : entry,
    )
    const ledger = buildGeneratedPlanD47GapClosureLedger(groups, registry)

    if (ledger.comparatorReceipt.comparatorKind === 'receipt_candidate') {
      expect(ledger.comparatorReceipt.groupKey).not.toBe(staleComparatorKey)
    }
    expect(ledger.authorizationStatus).toBe('not_authorized')
  })

  it('falls back to a no-change baseline when no comparator candidate exists', () => {
    const d47Group = redistributionGroup({
      groupKey: D47_STABLE_GROUP_KEY,
      drillId: 'd47',
      variantId: 'd47-solo-open',
    })

    const registry = buildInitialGeneratedPlanTriageRegistry([d47Group])
    const ledger = buildGeneratedPlanD47GapClosureLedger([d47Group], registry)

    expect(ledger.comparatorReceipt).toEqual(
      expect.objectContaining({
        comparatorKind: 'no_change_baseline',
        simplerThanD47: false,
        higherConfidenceThanD47: false,
      }),
    )
    expect('groupKey' in ledger.comparatorReceipt).toBe(false)
    expect(ledger.authorizationStatus).toBe('not_authorized')
  })

  it('derives legal D47 gap closure authorization states from state and currentness', () => {
    const cases = [
      {
        gapType: 'programming_shape_gap',
        decisionState: 'evidence_gathering',
        currentnessState: 'current',
        allSegmentsHaveDisposition: true,
        expected: 'not_authorized',
      },
      {
        gapType: 'programming_shape_gap',
        decisionState: 'primary_fill_path_selected',
        currentnessState: 'current',
        allSegmentsHaveDisposition: true,
        expected: 'ready_for_planning',
      },
      {
        gapType: 'undetermined',
        decisionState: 'primary_fill_path_selected',
        currentnessState: 'current',
        allSegmentsHaveDisposition: true,
        expected: 'not_authorized',
      },
      {
        gapType: 'programming_shape_gap',
        decisionState: 'primary_fill_path_selected',
        currentnessState: 'stale',
        allSegmentsHaveDisposition: true,
        expected: 'not_authorized',
      },
      {
        gapType: 'programming_shape_gap',
        decisionState: 'primary_fill_path_selected',
        currentnessState: 'current',
        allSegmentsHaveDisposition: false,
        expected: 'not_authorized',
      },
      {
        gapType: 'no_real_gap',
        decisionState: 'no_change_closed',
        currentnessState: 'current',
        allSegmentsHaveDisposition: false,
        expected: 'not_authorized',
      },
      {
        gapType: 'no_real_gap',
        decisionState: 'no_change_closed',
        currentnessState: 'current',
        allSegmentsHaveDisposition: true,
        expected: 'closed_without_fill',
      },
      {
        gapType: 'programming_shape_gap',
        decisionState: 'abandoned_for_better_candidate',
        currentnessState: 'current',
        allSegmentsHaveDisposition: true,
        expected: 'closed_without_fill',
      },
      {
        gapType: 'programming_shape_gap',
        decisionState: 'fill_planned',
        currentnessState: 'current',
        allSegmentsHaveDisposition: true,
        expected: 'authorized_for_fill_plan',
      },
      {
        gapType: 'undetermined',
        decisionState: 'fill_planned',
        currentnessState: 'current',
        allSegmentsHaveDisposition: true,
        expected: 'not_authorized',
      },
      {
        gapType: 'programming_shape_gap',
        decisionState: 'fill_applied_reassessment_pending',
        currentnessState: 'current',
        allSegmentsHaveDisposition: false,
        expected: 'not_authorized',
      },
      {
        gapType: 'programming_shape_gap',
        decisionState: 'closed_validated',
        currentnessState: 'current',
        allSegmentsHaveDisposition: true,
        expected: 'authorized_for_fill_plan',
      },
      {
        gapType: 'drill_inventory_gap',
        decisionState: 'closed_validated',
        currentnessState: 'closed_by_d49',
        allSegmentsHaveDisposition: true,
        expected: 'closed_with_fill',
      },
    ] as const

    for (const testCase of cases) {
      expect(
        authorizationStatusForGeneratedPlanD47GapClosureState(
          testCase.gapType,
          testCase.decisionState,
          testCase.currentnessState,
          testCase.allSegmentsHaveDisposition,
        ),
      ).toBe(testCase.expected)
    }
  })

  it('builds the D01 comparator gap-fill proposal from current receipt evidence', () => {
    const groups = currentGroups()
    const registry = buildInitialGeneratedPlanTriageRegistry(groups)
    const proposal = buildGeneratedPlanD01GapFillProposal(groups, registry)

    expect(proposal).toEqual(
      expect.objectContaining({
        candidateFound: true,
        currentnessState: 'current',
        d47Relationship: 'd47_missing_or_shifted',
        gapType: 'programming_shape_gap',
        decisionState: 'evidence_gathering',
        authorizationStatus: 'not_authorized',
        primaryClosurePath: 'combined_workload_block_shape_review',
        candidate: expect.objectContaining({
          groupKey:
            'gpdg:v1:d01:d01-solo:main_skill:true:optional_slot_redistribution+over_authored_max+over_fatigue_cap',
          drillId: 'd01',
          variantId: 'd01-solo',
          blockType: 'main_skill',
        }),
        receiptFacts: expect.objectContaining({
          comparisonInconclusiveCellCount: 0,
        }),
        nextArtifact: expect.objectContaining({
          artifactType: 'workload_block_shape_proposal',
          owner: 'maintainer',
        }),
        reassessmentResult: 'not_started',
      }),
    )
    expect(proposal.targetSurface).toContain('durationMaxMinutes: 5')
    expect(proposal.blockedSourceBackedContentPath).toContain('Blocked')
    expect(proposal.expectedTrainingQualityMovement).toContain('workload honesty')
    expect(proposal.receiptFacts.totalAffectedCellCount).toBeLessThanOrEqual(18)
    expect(proposal.receiptFacts.nonRedistributionPressureCellCount).toBeLessThanOrEqual(6)
  })

  it('blocks D01 gap-fill authorization when the comparator receipt is missing', () => {
    const groups = currentGroups().filter(
      (group) =>
        group.groupKey !==
        'gpdg:v1:d01:d01-solo:main_skill:true:optional_slot_redistribution+over_authored_max+over_fatigue_cap',
    )
    const registry = buildInitialGeneratedPlanTriageRegistry(groups)
    const proposal = buildGeneratedPlanD01GapFillProposal(groups, registry)

    expect(proposal.candidateFound).toBe(false)
    expect(proposal.currentnessState).toBe('missing_or_shifted')
    expect(proposal.authorizationStatus).toBe('not_authorized')
    expect(proposal.receiptFacts.totalAffectedCellCount).toBe(0)
  })

  it('blocks D01 gap-fill authorization when the comparator fingerprint is stale', () => {
    const d01GroupKey =
      'gpdg:v1:d01:d01-solo:main_skill:true:optional_slot_redistribution+over_authored_max+over_fatigue_cap'
    const groups = currentGroups()
    const registry = buildInitialGeneratedPlanTriageRegistry(groups).map((entry) =>
      entry.groupKey === d01GroupKey
        ? { ...entry, diagnosticFingerprint: `${entry.diagnosticFingerprint}:stale` }
        : entry,
    )
    const proposal = buildGeneratedPlanD01GapFillProposal(groups, registry)

    expect(proposal.candidateFound).toBe(true)
    expect(proposal.currentnessState).toBe('stale')
    expect(proposal.authorizationStatus).toBe('not_authorized')
  })

  it('builds the D01 workload block-shape proposal with block shape as the selected disposition', () => {
    const groups = currentGroups()
    const registry = buildInitialGeneratedPlanTriageRegistry(groups)
    const proposal = buildGeneratedPlanD01WorkloadBlockShapeProposal(groups, registry)

    expect(proposal).toEqual(
      expect.objectContaining({
        candidateFound: true,
        currentnessState: 'current',
        authorizationStatus: 'not_authorized',
        selectedDisposition: 'block_shape_review_needed',
        secondaryDisposition: 'metadata_review_needed',
        metadataAction: 'unchanged',
        sourceBackedContentDisposition: 'source_depth_blocked',
        generatorPolicyDisposition: 'generator_policy_blocked',
        u6Eligibility: 'blocked_until_concrete_block_or_cap_proposal',
        reassessmentResult: 'not_started',
        candidate: expect.objectContaining({
          groupKey:
            'gpdg:v1:d01:d01-solo:main_skill:true:optional_slot_redistribution+over_authored_max+over_fatigue_cap',
        }),
      }),
    )
    expect(proposal.recommendedFutureFillShape).toContain('split, repeat, or reroute')
    expect(proposal.blockShapeRationale).toContain('short repeated-contact work')
    expect(proposal.noActionThreshold).toContain('policy-accepted')
    expect(proposal.revisitTrigger).toContain('regenerated D01 pressure')
  })

  it('reassesses the applied D01 block-shape fill against the prior target receipt', () => {
    const groups = currentGroups()
    const receipt = buildGeneratedPlanD01BlockShapeFillReceipt(groups)

    expect(receipt).toEqual(
      expect.objectContaining({
        targetGroupKey:
          'gpdg:v1:d01:d01-solo:main_skill:true:optional_slot_redistribution+over_authored_max+over_fatigue_cap',
        targetFound: true,
        diagnosticMovement: 'partially_validated',
        trainingQualityState: 'not_field_validated',
        redistributionHandoffState: 'insufficient_allocated_pressure',
        d47NextState: 'cap_or_catalog_proposal_needed',
        metadataAction: 'unchanged',
        sourceBackedContentDisposition: 'source_depth_blocked',
        u6Eligibility: 'deferred_no_cap_or_catalog_delta',
      }),
    )
    expect(receipt.baselineReceiptFacts.totalAffectedCellCount).toBe(18)
    expect(receipt.baselineReceiptFacts.nonRedistributionPressureCellCount).toBe(6)
    expect(receipt.currentReceiptFacts.totalAffectedCellCount).toBeLessThan(18)
    expect(receipt.currentReceiptFacts.nonRedistributionPressureCellCount).toBeLessThanOrEqual(6)
    expect(receipt.redistributionHandoffReason).toContain('cannot close the gap')
    expect(receipt.trainingQualityBoundary).toContain('field training quality remains unvalidated')
  })

  it('marks the D01 block-shape fill validated when the target group disappears', () => {
    const groups = currentGroups().filter(
      (group) =>
        group.groupKey !==
        'gpdg:v1:d01:d01-solo:main_skill:true:optional_slot_redistribution+over_authored_max+over_fatigue_cap',
    )
    const receipt = buildGeneratedPlanD01BlockShapeFillReceipt(groups)

    expect(receipt.targetFound).toBe(false)
    expect(receipt.diagnosticMovement).toBe('validated')
    expect(receipt.redistributionHandoffState).toBe('not_needed_target_absent')
    expect(receipt.d47NextState).toBe('resume_d47')
    expect(receipt.currentReceiptFacts.totalAffectedCellCount).toBe(0)
  })

  it('detects a present D01 target from current diagnostics rather than registry lane state', () => {
    const groups = currentGroups()
    const receipt = buildGeneratedPlanD01BlockShapeFillReceipt(groups)

    expect(receipt.targetFound).toBe(true)
    expect(receipt.diagnosticMovement).toBe('partially_validated')
    expect(receipt.redistributionHandoffState).toBe('insufficient_allocated_pressure')
    expect(receipt.currentReceiptFacts.totalAffectedCellCount).toBeGreaterThan(0)
  })

  it('marks D01 handoff admissible when pressure disappears under allocated duration', () => {
    const d01GroupKey =
      'gpdg:v1:d01:d01-solo:main_skill:true:optional_slot_redistribution+over_authored_max+over_fatigue_cap'
    const groups = [
      redistributionGroup({
        groupKey: d01GroupKey,
        diagnosticFingerprint: 'gpdf|d01-admissible-fixture',
        drillId: 'd01',
        variantId: 'd01-solo',
        authoredMaxMinutes: 5,
        fatigueMaxMinutes: 5,
        affectedCellCount: 1,
        affectedCells: [
          redistributionCell({
            focus: 'pass',
            configuration: 'solo_net',
            plannedMinutes: 6,
            allocatedMinutes: 5,
            authoredMaxMinutes: 5,
            fatigueMaxMinutes: 5,
            redistribution: {
              source: 'observed',
              redistributedMinutes: 1,
              skippedOptionalLayoutIndexes: [3],
              redistributionLayoutIndex: 2,
            },
          }),
        ],
      }),
    ]
    const receipt = buildGeneratedPlanD01BlockShapeFillReceipt(groups)

    expect(receipt.redistributionHandoffState).toBe('admissible_candidate')
    expect(receipt.d47NextState).toBe('d01_still_open')
    expect(receipt.redistributionHandoffReason).toContain('bounded handoff may be admissible')
  })

  it('marks D01 handoff mixed when only some cells are handoff-admissible', () => {
    const d01GroupKey =
      'gpdg:v1:d01:d01-solo:main_skill:true:optional_slot_redistribution+over_authored_max+over_fatigue_cap'
    const groups = [
      redistributionGroup({
        groupKey: d01GroupKey,
        diagnosticFingerprint: 'gpdf|d01-mixed-admission-fixture',
        drillId: 'd01',
        variantId: 'd01-solo',
        authoredMaxMinutes: 5,
        fatigueMaxMinutes: 5,
        affectedCellCount: 2,
        affectedCells: [
          redistributionCell({
            focus: 'pass',
            configuration: 'solo_net',
            seed: 'mixed-admissible',
            plannedMinutes: 6,
            allocatedMinutes: 5,
            authoredMaxMinutes: 5,
            fatigueMaxMinutes: 5,
            redistribution: {
              source: 'observed',
              redistributedMinutes: 1,
              skippedOptionalLayoutIndexes: [3],
              redistributionLayoutIndex: 2,
            },
          }),
          redistributionCell({
            focus: 'pass',
            configuration: 'solo_net',
            seed: 'mixed-insufficient',
            plannedMinutes: 7,
            allocatedMinutes: 7,
            authoredMaxMinutes: 5,
            fatigueMaxMinutes: 5,
            redistribution: {
              source: 'observed',
              redistributedMinutes: 1,
              skippedOptionalLayoutIndexes: [3],
              redistributionLayoutIndex: 2,
            },
          }),
        ],
      }),
    ]
    const receipt = buildGeneratedPlanD01BlockShapeFillReceipt(groups)

    expect(receipt.redistributionHandoffState).toBe('mixed_admission')
    expect(receipt.d47NextState).toBe('d01_still_open')
    expect(receipt.redistributionHandoffReason).toContain('handoff alone is not a full D01 closure')
  })

  it('marks the D01 block-shape fill unresolved when the target remains without movement', () => {
    const d01GroupKey =
      'gpdg:v1:d01:d01-solo:main_skill:true:optional_slot_redistribution+over_authored_max+over_fatigue_cap'
    const affectedCells = Array.from({ length: 18 }, (_, index) =>
      redistributionCell({
        seed: `unresolved-d01-${index}`,
        plannedMinutes: 7,
        allocatedMinutes: 7,
        authoredMaxMinutes: 5,
        fatigueMaxMinutes: 5,
        observationCodes: ['over_authored_max', 'over_fatigue_cap'],
        redistribution: undefined,
      }),
    )
    const groups = [
      redistributionGroup({
        groupKey: d01GroupKey,
        diagnosticFingerprint: 'gpdf|d01-unresolved-fixture',
        drillId: 'd01',
        variantId: 'd01-solo',
        authoredMaxMinutes: 5,
        fatigueMaxMinutes: 5,
        affectedCellCount: affectedCells.length,
        observationCodes: ['over_authored_max', 'over_fatigue_cap'],
        likelyFixPaths: ['block_split', 'variant_cap_review'],
        affectedCells,
      }),
    ]
    const receipt = buildGeneratedPlanD01BlockShapeFillReceipt(groups)

    expect(receipt.targetFound).toBe(true)
    expect(receipt.diagnosticMovement).toBe('unresolved')
    expect(receipt.redistributionHandoffState).toBe('insufficient_allocated_pressure')
    expect(receipt.diagnosticSummary).toContain('without measurable diagnostic movement')
    expect(receipt.remainingAction).toContain('Return to block-shape planning')
  })

  it('keeps the D01 workload block-shape proposal not authorized when D01 evidence is stale', () => {
    const d01GroupKey =
      'gpdg:v1:d01:d01-solo:main_skill:true:optional_slot_redistribution+over_authored_max+over_fatigue_cap'
    const groups = currentGroups()
    const registry = buildInitialGeneratedPlanTriageRegistry(groups).map((entry) =>
      entry.groupKey === d01GroupKey
        ? { ...entry, diagnosticFingerprint: `${entry.diagnosticFingerprint}:stale` }
        : entry,
    )
    const proposal = buildGeneratedPlanD01WorkloadBlockShapeProposal(groups, registry)

    expect(proposal.currentnessState).toBe('stale')
    expect(proposal.authorizationStatus).toBe('not_authorized')
    expect(proposal.metadataAction).toBe('unchanged')
    expect(proposal.reassessmentResult).toBe('not_started')
  })

  it('keeps the D01 workload block-shape proposal not authorized when D01 evidence is missing', () => {
    const groups = currentGroups().filter(
      (group) =>
        group.groupKey !==
        'gpdg:v1:d01:d01-solo:main_skill:true:optional_slot_redistribution+over_authored_max+over_fatigue_cap',
    )
    const registry = buildInitialGeneratedPlanTriageRegistry(groups)
    const proposal = buildGeneratedPlanD01WorkloadBlockShapeProposal(groups, registry)

    expect(proposal.candidateFound).toBe(false)
    expect(proposal.currentnessState).toBe('missing_or_shifted')
    expect(proposal.authorizationStatus).toBe('not_authorized')
    expect(proposal.selectedDisposition).toBe('block_shape_review_needed')
    expect(proposal.metadataAction).toBe('unchanged')
  })

  it('routes current D01 cap/catalog fork to D47 resume when no fork payload is planning-ready', () => {
    const groups = currentGroups()
    const registry = buildInitialGeneratedPlanTriageRegistry(groups)
    const packet = buildGeneratedPlanD01CapCatalogForkPacket(groups, registry)

    expect(packet).toEqual(
      expect.objectContaining({
        selectionState: 'selected',
        selectedFork: 'resume_d47_with_d01_held',
        parentD47State: 'd47_resumed_d01_held',
        planningAuthorizationStatus: 'not_ready_for_catalog_fill_planning',
        activationStatus: 'not_authorized',
      }),
    )
    expect(packet.rejectedForks).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ fork: 'catalog_source_backed_delta' }),
        expect.objectContaining({ fork: 'cap_proposal' }),
        expect.objectContaining({ fork: 'accepted_no_change' }),
      ]),
    )
    expect(packet.selectedForkReason).toContain('No cap, catalog, or no-change payload')
  })

  it('selects catalog fork only with a gap-card-ready catalog evaluation payload', () => {
    const groups = currentGroups()
    const registry = buildInitialGeneratedPlanTriageRegistry(groups)
    const packet = buildGeneratedPlanD01CapCatalogForkPacket(groups, registry, {
      catalogEvaluation: {
        suspectedCatalogGap:
          'D01 is a short beginner passing drill being asked to carry longer main-skill passing time.',
        changedOrMissingCatalogIds: ['missing:beginner-long-passing-main-skill'],
        sourcePathOrNeeds: 'Select exact BAB/FIVB/Volley Canada source before activation.',
        adaptationDelta:
          'Create or activate a longer beginner passing carrier without stretching D01.',
        expectedDiagnosticMovement: 'Reduce or remove the current D01 allocated-pressure target.',
        verificationCommand: 'npm run diagnostics:report:check',
        checkpointCriteria: 'Do not activate content until exact source references are recorded.',
        nextArtifact: 'D01 source-backed catalog-fill gap card',
      },
    })

    expect(packet).toEqual(
      expect.objectContaining({
        selectionState: 'selected',
        selectedFork: 'catalog_source_backed_delta',
        parentD47State: 'd47_blocked_by_planning_ready_d01_delta',
        planningAuthorizationStatus: 'ready_for_catalog_fill_planning',
        activationStatus: 'not_authorized',
        nextArtifact: 'D01 source-backed catalog-fill gap card',
      }),
    )
    expect(packet.catalogEvaluation?.changedOrMissingCatalogIds).toEqual([
      'missing:beginner-long-passing-main-skill',
    ])
  })

  it('renders catalog-specific fork packet markdown when catalog planning is ready', () => {
    const groups = currentGroups()
    const registry = buildInitialGeneratedPlanTriageRegistry(groups)
    const packet = buildGeneratedPlanD01CapCatalogForkPacket(groups, registry, {
      catalogEvaluation: {
        suspectedCatalogGap: 'Longer beginner passing carrier is missing.',
        changedOrMissingCatalogIds: ['missing:beginner-long-passing-main-skill'],
        sourcePathOrNeeds: 'Exact source references required before activation.',
        adaptationDelta: 'Add a longer beginner carrier without stretching D01.',
        expectedDiagnosticMovement: 'Reduce D01 allocated-pressure cells.',
        verificationCommand: 'npm run diagnostics:report:check',
        checkpointCriteria: 'Source references and checkpoint criteria must be recorded.',
        nextArtifact: 'D01 source-backed catalog-fill gap card',
      },
    })
    const markdown = formatGeneratedPlanD01CapCatalogForkPacketMarkdown(packet).join('\n')

    expect(markdown).toContain('Planning authorization status: `ready_for_catalog_fill_planning`')
    expect(markdown).toContain('Activation status: `not_authorized`')
    expect(markdown).toContain('Catalog gap: Longer beginner passing carrier is missing.')
    expect(markdown).toContain(
      'Changed or missing catalog IDs: `missing:beginner-long-passing-main-skill`',
    )
    expect(markdown).toContain('Source path or needs: Exact source references required')
    expect(markdown).toContain('Verification command: `npm run diagnostics:report:check`')
  })

  it('does not select catalog fork when changed or missing catalog IDs are blank', () => {
    const groups = currentGroups()
    const registry = buildInitialGeneratedPlanTriageRegistry(groups)
    const packet = buildGeneratedPlanD01CapCatalogForkPacket(groups, registry, {
      catalogEvaluation: {
        suspectedCatalogGap: 'Longer beginner passing carrier is missing.',
        changedOrMissingCatalogIds: ['  '],
        sourcePathOrNeeds: 'Exact source references required before activation.',
        adaptationDelta: 'Add a longer beginner carrier without stretching D01.',
        expectedDiagnosticMovement: 'Reduce D01 allocated-pressure cells.',
        verificationCommand: 'npm run diagnostics:report:check',
        checkpointCriteria: 'Source references and checkpoint criteria must be recorded.',
        nextArtifact: 'D01 source-backed catalog-fill gap card',
      },
    })

    expect(packet.selectedFork).toBe('resume_d47_with_d01_held')
    expect(packet.planningAuthorizationStatus).toBe('not_ready_for_catalog_fill_planning')
    expect(packet.rejectedForks).toEqual(
      expect.arrayContaining([expect.objectContaining({ fork: 'catalog_source_backed_delta' })]),
    )
  })

  it('selects cap fork only with a complete cap evaluation payload', () => {
    const groups = currentGroups()
    const registry = buildInitialGeneratedPlanTriageRegistry(groups)
    const packet = buildGeneratedPlanD01CapCatalogForkPacket(groups, registry, {
      capEvaluation: {
        proposedCapDelta: 'Increase D01 max and fatigue cap only if copy supports it.',
        segmentAndCopySupport: 'Synthetic cap fixture support.',
        rejectedCatalogRationale: 'Catalog fill rejected for this synthetic fixture.',
        expectedDiagnosticMovement: 'Reduce D01 allocated-pressure cells through a cap proposal.',
        futureU6Condition: 'Preview only after concrete cap IDs and deltas are named.',
        falsificationThreshold: 'Reject if field copy cannot support the wider envelope.',
      },
    })

    expect(packet.selectedFork).toBe('cap_proposal')
    expect(packet.parentD47State).toBe('d47_blocked_by_planning_ready_d01_delta')
    expect(packet.planningAuthorizationStatus).toBe('not_ready_for_catalog_fill_planning')
    if (packet.selectedFork !== 'cap_proposal') throw new Error('Expected cap proposal.')
    expect(packet.capEvaluation.proposedCapDelta).toContain('Increase D01')
    expect(packet.falsificationThreshold).toContain('Reject if field copy')
  })

  it('selects accepted no-change fork only with a complete no-change evaluation payload', () => {
    const groups = currentGroups()
    const registry = buildInitialGeneratedPlanTriageRegistry(groups)
    const packet = buildGeneratedPlanD01CapCatalogForkPacket(groups, registry, {
      noChangeEvaluation: {
        owner: 'maintainer',
        rationale: 'Synthetic accepted-debt fixture.',
        acceptedBlastRadius: '12 D01 affected cells remain visible.',
        noActionThreshold: 'Reopen if D01 affected cells grow beyond the accepted blast radius.',
        revisitTrigger: 'Revisit after D01 appears in a stronger lane.',
      },
    })

    expect(packet.selectedFork).toBe('accepted_no_change')
    expect(packet.parentD47State).toBe('d47_resumed_d01_held')
    if (packet.selectedFork !== 'accepted_no_change') throw new Error('Expected no-change.')
    expect(packet.noChangeEvaluation.owner).toBe('maintainer')
    expect(packet.falsificationThreshold).toContain('Reopen if D01 affected cells')
  })

  it('fails closed when D01 cap/catalog fork evidence is stale', () => {
    const d01GroupKey =
      'gpdg:v1:d01:d01-solo:main_skill:true:optional_slot_redistribution+over_authored_max+over_fatigue_cap'
    const groups = currentGroups()
    const registry = buildInitialGeneratedPlanTriageRegistry(groups).map((entry) =>
      entry.groupKey === d01GroupKey
        ? { ...entry, diagnosticFingerprint: `${entry.diagnosticFingerprint}:stale` }
        : entry,
    )
    const packet = buildGeneratedPlanD01CapCatalogForkPacket(groups, registry, {
      catalogEvaluation: {
        suspectedCatalogGap: 'stale catalog gap',
        changedOrMissingCatalogIds: ['missing:stale'],
        sourcePathOrNeeds: 'stale source',
        adaptationDelta: 'stale delta',
        expectedDiagnosticMovement: 'stale movement',
        verificationCommand: 'npm run diagnostics:report:check',
        checkpointCriteria: 'stale criteria',
        nextArtifact: 'stale artifact',
      },
    })

    expect(packet.selectionState).toBe('not_authorized_stale_or_inapplicable')
    expect(packet.selectedFork).toBe('none')
    expect(packet.planningAuthorizationStatus).toBe('not_ready_for_catalog_fill_planning')
    expect(packet.selectedForkReason).toContain('D01 evidence is stale')
  })

  it('fails closed when D01 cap/catalog fork registry entry is missing', () => {
    const d01GroupKey =
      'gpdg:v1:d01:d01-solo:main_skill:true:optional_slot_redistribution+over_authored_max+over_fatigue_cap'
    const groups = currentGroups()
    const registry = buildInitialGeneratedPlanTriageRegistry(groups).filter(
      (entry) => entry.groupKey !== d01GroupKey,
    )
    const packet = buildGeneratedPlanD01CapCatalogForkPacket(groups, registry, {
      catalogEvaluation: {
        suspectedCatalogGap: 'registry-missing catalog gap',
        changedOrMissingCatalogIds: ['missing:registry-gap'],
        sourcePathOrNeeds: 'registry source',
        adaptationDelta: 'registry delta',
        expectedDiagnosticMovement: 'registry movement',
        verificationCommand: 'npm run diagnostics:report:check',
        checkpointCriteria: 'registry criteria',
        nextArtifact: 'registry artifact',
      },
    })

    expect(packet.selectionState).toBe('not_authorized_stale_or_inapplicable')
    expect(packet.selectedFork).toBe('none')
    expect(packet.selectedForkReason).toContain('D01 evidence is missing_or_shifted')
  })

  it('marks D01 cap/catalog fork not applicable when the target is absent', () => {
    const groups = currentGroups().filter(
      (group) =>
        group.groupKey !==
        'gpdg:v1:d01:d01-solo:main_skill:true:optional_slot_redistribution+over_authored_max+over_fatigue_cap',
    )
    const registry = buildInitialGeneratedPlanTriageRegistry(groups)
    const packet = buildGeneratedPlanD01CapCatalogForkPacket(groups, registry)

    expect(packet.selectionState).toBe('not_applicable_resume')
    expect(packet.selectedFork).toBe('none')
    expect(packet.parentD47State).toBe('resume_d47')
  })

  it('fails D01 cap/catalog fork closed when D01 comparison evidence is incomplete', () => {
    const groups = makeGroupComparisonInconclusive(
      currentGroups(),
      'gpdg:v1:d01:d01-solo:main_skill:true:optional_slot_redistribution+over_authored_max+over_fatigue_cap',
    )
    const registry = buildInitialGeneratedPlanTriageRegistry(groups)
    const packet = buildGeneratedPlanD01CapCatalogForkPacket(groups, registry, {
      catalogEvaluation: {
        suspectedCatalogGap: 'Synthetic catalog gap should not be selected from incomplete D01.',
        changedOrMissingCatalogIds: ['missing:synthetic-d01'],
        sourcePathOrNeeds: 'Synthetic source path.',
        adaptationDelta: 'Synthetic adaptation delta.',
        expectedDiagnosticMovement: 'Synthetic movement.',
        verificationCommand: 'npm run diagnostics:report:check',
        checkpointCriteria: 'Synthetic checkpoint.',
        nextArtifact: 'Synthetic source-backed catalog-fill gap card',
      },
    })

    expect(packet.selectionState).toBe('not_authorized_stale_or_inapplicable')
    expect(packet.selectedFork).toBe('none')
    expect(packet.selectedForkReason).toContain('not in the insufficient allocated-pressure')
    expect(packet.nextArtifact).toBe('preserve_existing_d01_next_state')
  })

  it('selects the D47-closed-by-D49 receipt when D01 is held and the stable D47 key is gone', () => {
    const groups = currentGroups()
    const registry = buildInitialGeneratedPlanTriageRegistry(groups)
    const selection = buildGeneratedPlanGapClosureSelectionWorkbench(groups, registry)

    expect(selection).toEqual(
      expect.objectContaining({
        selectionState: 'selected',
        selectedTarget: 'd47/d47-solo-open closed by d49',
        selectedArtifact: 'd47_closed_by_d49_receipt',
        authorizationStatus: 'not_authorized',
        nextArtifact: 'D49 residual redistribution/workload follow-up',
      }),
    )
    expect(selection.d01State).toBe('selected:resume_d47_with_d01_held:d47_resumed_d01_held')
    expect(selection.d47State).toBe('closed_by_d49:closed_validated:closed_with_fill')
    expect(selection.selectedReason).toContain(
      'moved the original D47 comparator pressure onto D49',
    )
    expect(selection.stopCondition).toContain(
      'route remaining advanced setting stretch through D49',
    )
    expect(selection.rejectedAlternatives).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          label: 'D25 cooldown policy receipt',
          groupKey: 'gpdg:v1:d25:d25-solo:wrap:true:under_authored_min',
          affectedCellCount: 79,
          reason: expect.stringContaining('cooldown policy review'),
        }),
        expect.objectContaining({
          label: 'D05 comparator proposal',
          groupKey:
            'gpdg:v1:d05:d05-solo:main_skill:true:optional_slot_redistribution+over_authored_max+over_fatigue_cap',
          affectedCellCount: 15,
          reason: expect.stringContaining('Strong comparator'),
        }),
        expect.objectContaining({
          label: 'Adjacent advanced mixed-pressure group',
          groupKey:
            'gpdg:v1:d46:d46-solo-open:main_skill:true:optional_slot_redistribution+over_authored_max+over_fatigue_cap',
          reason: expect.stringContaining('D01-held / D47-reentry'),
        }),
      ]),
    )
  })

  it('builds the D49 residual follow-up packet from current workload and redistribution evidence', () => {
    const groups = currentGroups()
    const registry = buildInitialGeneratedPlanTriageRegistry(groups)
    const packet = buildGeneratedPlanD49ResidualFollowUpPacket(groups, registry)

    expect(packet).toEqual(
      expect.objectContaining({
        d47ClosureState: 'closed_by_d49',
        authorizationStatus: 'not_authorized',
        nextArtifact: 'D49 workload envelope review plus U8 redistribution follow-up',
      }),
    )
    expect(packet.workloadLane).toEqual(
      expect.objectContaining({
        disposition: 'workload_review_needed',
        totalAffectedCellCount: 16,
      }),
    )
    expect(packet.workloadLane.groupKeys).toEqual(
      expect.arrayContaining([
        'gpdg:v1:d49:d49-solo-open:main_skill:true:under_authored_min',
        'gpdg:v1:d49:d49-pair-open:main_skill:true:under_authored_min',
      ]),
    )
    expect(packet.redistributionLane).toEqual(
      expect.objectContaining({
        disposition: 'route_to_u8',
        totalAffectedCellCount: 32,
      }),
    )
    expect(packet.redistributionLane.groupKeys).toEqual(
      expect.arrayContaining([
        'gpdg:v1:d49:d49-solo-open:main_skill:true:optional_slot_redistribution+over_authored_max+over_fatigue_cap',
        'gpdg:v1:d49:d49-pair-open:main_skill:true:optional_slot_redistribution+over_authored_max+over_fatigue_cap',
        'gpdg:v1:d49:d49-pair-open:main_skill:true:optional_slot_redistribution',
        'gpdg:v1:d49:d49-solo-open:main_skill:true:optional_slot_redistribution',
      ]),
    )
    expect(packet.stopCondition).toContain('Do not edit catalog metadata')
    expect(packet.d47ReentryCondition).toContain('original D47 comparator key')
  })

  it('keeps D49 residual follow-up non-actionable when D49 evidence is absent', () => {
    const groups = withoutD49Groups(currentGroups())
    const registry = buildInitialGeneratedPlanTriageRegistry(groups)
    const packet = buildGeneratedPlanD49ResidualFollowUpPacket(groups, registry)

    expect(packet.authorizationStatus).toBe('not_authorized')
    expect(packet.workloadLane).toEqual(
      expect.objectContaining({
        disposition: 'no_implementation_action_yet',
        totalAffectedCellCount: 0,
        groupKeys: [],
      }),
    )
    expect(packet.redistributionLane).toEqual(
      expect.objectContaining({
        disposition: 'no_implementation_action_yet',
        totalAffectedCellCount: 0,
        groupKeys: [],
      }),
    )
    expect(packet.nextArtifact).toBe(
      'No D49 residual follow-up until regenerated diagnostics show D49 pressure.',
    )
    expect(packet.d47ClosureState).toBe('closed_by_d49')
    expect(packet.d47ReentryCondition).toContain('original D47 comparator key')
  })

  it('fails closed for stale D49 residual evidence', () => {
    const groups = currentGroups()
    const staleRegistry = buildInitialGeneratedPlanTriageRegistry(groups).map((entry) =>
      entry.groupKey.includes(':d49:')
        ? { ...entry, diagnosticFingerprint: `${entry.diagnosticFingerprint}:stale` }
        : entry,
    )
    const packet = buildGeneratedPlanD49ResidualFollowUpPacket(groups, staleRegistry)

    expect(packet.workloadLane).toEqual(
      expect.objectContaining({
        disposition: 'no_implementation_action_yet',
        totalAffectedCellCount: 0,
        groupKeys: [],
      }),
    )
    expect(packet.redistributionLane).toEqual(
      expect.objectContaining({
        disposition: 'no_implementation_action_yet',
        totalAffectedCellCount: 0,
        groupKeys: [],
      }),
    )
    expect(packet.authorizationStatus).toBe('not_authorized')
  })

  it('excludes D49 residual groups outside the authorized activation boundary', () => {
    const groups = [
      ...currentGroups(),
      redistributionGroup({
        groupKey:
          'gpdg:v1:d49:d49-trio-open:main_skill:true:optional_slot_redistribution+over_authored_max+over_fatigue_cap',
        diagnosticFingerprint: 'gpdf|d49-trio',
        drillId: 'd49',
        variantId: 'd49-trio-open',
        affectedCellCount: 1,
      }),
    ]
    const registry = buildInitialGeneratedPlanTriageRegistry(groups)
    const packet = buildGeneratedPlanD49ResidualFollowUpPacket(groups, registry)

    expect(packet.redistributionLane.groupKeys).not.toContain(
      'gpdg:v1:d49:d49-trio-open:main_skill:true:optional_slot_redistribution+over_authored_max+over_fatigue_cap',
    )
    expect(packet.redistributionLane.groupKeys).toEqual(
      expect.arrayContaining([
        'gpdg:v1:d49:d49-solo-open:main_skill:true:optional_slot_redistribution+over_authored_max+over_fatigue_cap',
        'gpdg:v1:d49:d49-pair-open:main_skill:true:optional_slot_redistribution+over_authored_max+over_fatigue_cap',
      ]),
    )
  })

  it('routes back to D47 when the original comparator key returns alongside D49 evidence', () => {
    const groups = [
      ...currentGroups(),
      redistributionGroup({
        groupKey: D47_STABLE_GROUP_KEY,
        drillId: 'd47',
        variantId: 'd47-solo-open',
      }),
    ]
    const registry = buildInitialGeneratedPlanTriageRegistry(groups)
    const packet = buildGeneratedPlanD49ResidualFollowUpPacket(groups, registry)

    expect(packet.d47ClosureState).toBe('current')
    expect(packet.nextArtifact).toBe('D47 gap closure re-entry before D49 residual follow-up.')
    expect(packet.d47ReentryCondition).toContain('Re-enter D47 gap closure')
    expect(packet.workloadLane.disposition).toBe('workload_review_needed')
  })

  it('holds gap closure selection when D01 is not held for D47 reentry', () => {
    const groups = currentGroups().filter(
      (group) =>
        group.groupKey !==
        'gpdg:v1:d01:d01-solo:main_skill:true:optional_slot_redistribution+over_authored_max+over_fatigue_cap',
    )
    const registry = buildInitialGeneratedPlanTriageRegistry(groups)
    const selection = buildGeneratedPlanGapClosureSelectionWorkbench(groups, registry)

    expect(selection.selectionState).toBe('hold_for_evidence')
    expect(selection.selectedTarget).toBe('none')
    expect(selection.selectedArtifact).toBe('hold_for_evidence')
    expect(selection.authorizationStatus).toBe('not_authorized')
    expect(selection.d01State).toBe('not_applicable_resume:none:resume_d47')
    expect(selection.stopCondition).toContain('Do not plan catalog')
  })

  it('holds gap closure selection when D47 evidence is missing or shifted', () => {
    const groups = withoutD49Groups(currentGroups())
    const registry = buildInitialGeneratedPlanTriageRegistry(groups)
    const selection = buildGeneratedPlanGapClosureSelectionWorkbench(groups, registry)

    expect(selection.selectionState).toBe('hold_for_evidence')
    expect(selection.selectedArtifact).toBe('hold_for_evidence')
    expect(selection.authorizationStatus).toBe('not_authorized')
    expect(selection.d47State).toContain('missing_or_shifted')
    expect(selection.stopCondition).toContain('Do not plan catalog')
  })

  it('holds gap closure selection when D47 comparison evidence is incomplete', () => {
    const groups = [
      redistributionGroup({
        groupKey: D47_STABLE_GROUP_KEY,
        drillId: 'd47',
        variantId: 'd47-solo-open',
        affectedCells: [redistributionCell({ plannedMinutes: undefined })],
      }),
    ]
    const registry = buildInitialGeneratedPlanTriageRegistry(groups)
    const selection = buildGeneratedPlanGapClosureSelectionWorkbench(groups, registry)

    expect(selection.selectionState).toBe('hold_for_evidence')
    expect(selection.selectedArtifact).toBe('hold_for_evidence')
    expect(selection.authorizationStatus).toBe('not_authorized')
    expect(selection.d47State).toBe('current:evidence_gathering:not_authorized')
    expect(selection.stopCondition).toContain('Do not plan catalog')
  })

  it('holds the D47-vs-D05 comparator packet until symmetric evidence is present', () => {
    const groups = currentGroups()
    const registry = buildInitialGeneratedPlanTriageRegistry(groups)
    const packet = buildGeneratedPlanD47D05ComparatorDecisionPacket(groups, registry)

    expect(packet.selectionState).toBe('hold_for_evidence')
    expect(packet.selectedOutcome).toBe('hold_both_for_evidence')
    expect(packet.authorizationStatus).toBe('not_authorized')
    expect(packet.d01State).toBe('selected:resume_d47_with_d01_held:d47_resumed_d01_held')
    expect(packet.d47Evidence.receiptFacts).toEqual(
      expect.objectContaining({
        totalAffectedCellCount: 0,
        pressureDisappearsCellCount: 0,
        pressureRemainsCellCount: 0,
        nonRedistributionPressureCellCount: 0,
      }),
    )
    expect(packet.d05Evidence.receiptFacts).toEqual(
      expect.objectContaining({
        totalAffectedCellCount: 15,
        pressureDisappearsCellCount: 6,
        pressureRemainsCellCount: 9,
        nonRedistributionPressureCellCount: 3,
      }),
    )
    expect(packet.d47State).toBe('closed_by_d49:closed_validated:closed_with_fill')
    expect(packet.tieBreakSummary).toContain('D47 evidence is closed by D49 implementation')
    expect(packet.nextArtifact).toBe('D47-vs-D05 comparator evaluation payload')
  })

  it('builds the current D47-winning comparator evaluation payload', () => {
    const payload = buildCurrentGeneratedPlanD47D05ComparatorEvaluationPayload()
    const groups = currentGroups()
    const registry = buildInitialGeneratedPlanTriageRegistry(groups)
    const packet = buildGeneratedPlanD47D05ComparatorDecisionPacket(
      groups,
      registry,
      evaluationsForGeneratedPlanD47D05ComparatorPayload(payload),
    )
    const payloadLines = formatGeneratedPlanD47D05ComparatorEvaluationPayloadMarkdown(payload)

    expect(payload.selectedOutcome).toBe('d47_wins')
    expect(payload.scoreSemantics).toContain('higher is better')
    if (payload.selectedOutcome !== 'd47_wins') throw new Error('Expected D47 payload.')
    expect(payload.d47Evaluation.nextArtifact).toBe('D47 source-backed catalog implementation plan')
    expect(packet.selectedOutcome).toBe('d47_wins')
    expect(packet.authorizationStatus).toBe('not_authorized')
    expect(packet.nextArtifact).toBe('D47 source-backed catalog implementation plan')
    expect(payloadLines.join('\n')).toContain('Selected proof path: `d47_wins`')
    expect(payloadLines.join('\n')).toContain('D05 re-entry trigger:')
  })

  it('can express a continued-hold comparator payload with one unblock artifact', () => {
    const payload = {
      payloadPath: 'docs/reviews/hold-fixture.md',
      selectedOutcome: 'hold_both_for_evidence',
      scoreSemantics: 'Scores are unused for hold payloads.',
      holdEvaluation: {
        evidenceArtifact: 'source/adaptation review note',
        owner: 'maintainer',
        unblockCondition: 'Name a source/adaptation decision.',
        stopCondition: 'Do not edit catalog while held.',
        nextArtifact: 'source/adaptation review note',
      },
    } as const
    const groups = currentGroups()
    const registry = buildInitialGeneratedPlanTriageRegistry(groups)
    const packet = buildGeneratedPlanD47D05ComparatorDecisionPacket(
      groups,
      registry,
      evaluationsForGeneratedPlanD47D05ComparatorPayload(payload),
    )
    const payloadLines = formatGeneratedPlanD47D05ComparatorEvaluationPayloadMarkdown(payload)

    expect(packet.selectedOutcome).toBe('hold_both_for_evidence')
    expect(packet.authorizationStatus).toBe('not_authorized')
    expect(packet.nextArtifact).toBe('source/adaptation review note')
    expect(packet.stopCondition).toBe('Do not edit catalog while held.')
    expect(payloadLines.join('\n')).toContain('Evidence artifact: source/adaptation review note')
    expect(payloadLines.join('\n')).toContain(
      'Unblock condition: Name a source/adaptation decision.',
    )
  })

  const completeD47ComparatorEvaluation = {
    servedSegment: 'advanced open-court setting',
    sessionExposure: 'D47 is current and repeatedly selected into main-skill pressure.',
    perceivedSessionFailure: 'The session lacks enough advanced setting/movement depth.',
    changedSurface: 'Add a source-backed D47 sibling candidate, not current D47 metadata.',
    smallestAction: 'Use the D47 source-backed gap card as planning input only.',
    expectedDiagnosticMovement:
      'Reduce D47 pressure by giving advanced setting depth another surface.',
    regressionRisk: 'Could overfit advanced users before beginner trust is improved.',
    noActionThreshold: 'Do nothing if source/adaptation review cannot validate M001 use.',
    loserReentryTrigger: 'Re-enter D05 if D47 source/adaptation review fails.',
    trainingQualityValueScore: 5,
    evidenceReadinessScore: 4,
    futureSelectionPathScore: 4,
    maintenanceCostScore: 3,
    diagnosticMovementScore: 3,
    strategicPriorityScore: 4,
    tieBreakRationale: 'D47 carries higher training value per unit of change than D05 here.',
    nextArtifact: 'D47 source-backed catalog planning from held gap card',
    sourceAndAdaptationBasis:
      'Held D47 gap card names Better at Beach/JVA/Art of Coaching source and solo/pair adaptation work.',
    futureSelectionPath:
      'Future sessions can choose a longer advanced setting sibling instead of D47.',
  }

  const completeD05ComparatorEvaluation = {
    servedSegment: 'beginner/intermediate solo passing',
    sessionExposure: 'D05 is current and simpler than the advanced D47 candidate.',
    perceivedSessionFailure:
      'Beginner sessions stretch a short passing drill beyond honest workload.',
    changedSurface: 'Create a D05 workload/block-shape proposal, not catalog data.',
    smallestAction: 'Plan D05 block-shape or workload review before source-backed work.',
    expectedDiagnosticMovement:
      'Reduce D05 over-cap/fatigue pressure or route it to accepted no-change.',
    regressionRisk: 'Could defer advanced setting depth too long.',
    noActionThreshold: 'Do nothing if D05 pressure is policy-accepted with a revisit trigger.',
    loserReentryTrigger: 'Re-enter D47 if D05 cannot name a concrete workload/block-shape target.',
    trainingQualityValueScore: 4,
    evidenceReadinessScore: 4,
    futureSelectionPathScore: 3,
    maintenanceCostScore: 4,
    diagnosticMovementScore: 3,
    strategicPriorityScore: 3,
    tieBreakRationale: 'D05 is the smaller beginner-trust proposal with clearer next action.',
    nextArtifact: 'D05 workload/block-shape proposal requirements',
    proposalType: 'workload_block_shape_proposal' as const,
  }

  const completeNoChangeComparatorEvaluation = {
    acceptanceEvidence: 'Maintainer accepts current D47/D05 pressure as visible diagnostic debt.',
    acceptedBlastRadius: 'D47 30 cells and D05 15 cells remain in generated triage.',
    noActionThreshold: 'Reopen if either candidate grows or becomes top blocker again.',
    revisitTrigger: 'Revisit after the next diagnostics report or founder dogfood session.',
    nextArtifact: 'accepted D47/D05 no-change receipt',
  }

  it('selects D47 only with a complete source-backed comparator evaluation', () => {
    const groups = currentGroups()
    const registry = buildInitialGeneratedPlanTriageRegistry(groups)
    const packet = buildGeneratedPlanD47D05ComparatorDecisionPacket(groups, registry, {
      d47Evaluation: completeD47ComparatorEvaluation,
    })

    expect(packet.selectionState).toBe('selected')
    expect(packet.selectedOutcome).toBe('d47_wins')
    expect(packet.authorizationStatus).toBe('not_authorized')
    expect(packet.nextArtifact).toBe('D47 source-backed catalog planning from held gap card')
    expect(packet.tieBreakSummary).toContain('higher training value')
    if (packet.selectedOutcome !== 'd47_wins') throw new Error('Expected D47 winner.')
    expect(packet.d47Evaluation.sourceAndAdaptationBasis).toContain('Held D47 gap card')
  })

  it('selects D05 only with a complete proposal-type comparator evaluation', () => {
    const groups = currentGroups()
    const registry = buildInitialGeneratedPlanTriageRegistry(groups)
    const packet = buildGeneratedPlanD47D05ComparatorDecisionPacket(groups, registry, {
      d05Evaluation: completeD05ComparatorEvaluation,
    })

    expect(packet.selectionState).toBe('selected')
    expect(packet.selectedOutcome).toBe('d05_wins')
    expect(packet.authorizationStatus).toBe('not_authorized')
    expect(packet.nextArtifact).toBe('D05 workload/block-shape proposal requirements')
    if (packet.selectedOutcome !== 'd05_wins') throw new Error('Expected D05 winner.')
    expect(packet.d05Evaluation.proposalType).toBe('workload_block_shape_proposal')
  })

  it('uses training value per unit of change as the first tie-break when both qualify', () => {
    const groups = currentGroups()
    const registry = buildInitialGeneratedPlanTriageRegistry(groups)
    const packet = buildGeneratedPlanD47D05ComparatorDecisionPacket(groups, registry, {
      d47Evaluation: completeD47ComparatorEvaluation,
      d05Evaluation: {
        ...completeD05ComparatorEvaluation,
        trainingQualityValueScore: completeD47ComparatorEvaluation.trainingQualityValueScore + 1,
        tieBreakRationale: 'D05 has higher training value per unit of change in this fixture.',
      },
    })

    expect(packet.selectedOutcome).toBe('d05_wins')
    expect(packet.tieBreakSummary).toContain('D05 has higher training value')
  })

  it('accepts no-change only with acceptance evidence, blast radius, threshold, and revisit trigger', () => {
    const groups = currentGroups()
    const registry = buildInitialGeneratedPlanTriageRegistry(groups)
    const packet = buildGeneratedPlanD47D05ComparatorDecisionPacket(groups, registry, {
      noChangeEvaluation: completeNoChangeComparatorEvaluation,
    })

    expect(packet.selectionState).toBe('selected')
    expect(packet.selectedOutcome).toBe('accepted_no_change')
    expect(packet.authorizationStatus).toBe('not_authorized')
    if (packet.selectedOutcome !== 'accepted_no_change') throw new Error('Expected no-change.')
    expect(packet.noChangeEvaluation.acceptedBlastRadius).toContain('D47 30')
  })

  it('fails closed for incomplete comparator evaluation payloads', () => {
    const groups = currentGroups()
    const registry = buildInitialGeneratedPlanTriageRegistry(groups)
    const incompleteD47Packet = buildGeneratedPlanD47D05ComparatorDecisionPacket(groups, registry, {
      d47Evaluation: {
        ...completeD47ComparatorEvaluation,
        sourceAndAdaptationBasis: '',
      },
    })
    const incompleteD05Packet = buildGeneratedPlanD47D05ComparatorDecisionPacket(groups, registry, {
      d05Evaluation: {
        ...completeD05ComparatorEvaluation,
        nextArtifact: '',
      },
    })
    const incompleteNoChangePacket = buildGeneratedPlanD47D05ComparatorDecisionPacket(
      groups,
      registry,
      {
        noChangeEvaluation: {
          ...completeNoChangeComparatorEvaluation,
          revisitTrigger: '',
        },
      },
    )

    for (const packet of [incompleteD47Packet, incompleteD05Packet, incompleteNoChangePacket]) {
      expect(packet.selectionState).toBe('hold_for_evidence')
      expect(packet.selectedOutcome).toBe('hold_both_for_evidence')
      expect(packet.authorizationStatus).toBe('not_authorized')
      expect(packet.tieBreakSummary).toMatch(/Neither D47 nor D05|D47 evidence is closed by D49/)
    }
  })

  it('does not authorize D47 by default when D05 evidence is missing', () => {
    const groups = currentGroups().filter(
      (group) =>
        group.groupKey !==
        'gpdg:v1:d05:d05-solo:main_skill:true:optional_slot_redistribution+over_authored_max+over_fatigue_cap',
    )
    const registry = buildInitialGeneratedPlanTriageRegistry(groups)
    const packet = buildGeneratedPlanD47D05ComparatorDecisionPacket(groups, registry)

    expect(packet.selectionState).toBe('hold_for_evidence')
    expect(packet.selectedOutcome).toBe('hold_both_for_evidence')
    expect(packet.d05Evidence.currentnessState).toBe('missing_or_shifted')
    expect(packet.tieBreakSummary).toContain('D05 evidence is missing or stale')
  })

  it('does not promote D47 or no-change when D05 evidence is missing or stale', () => {
    const d05GroupKey =
      'gpdg:v1:d05:d05-solo:main_skill:true:optional_slot_redistribution+over_authored_max+over_fatigue_cap'
    const groupsWithoutD05 = currentGroups().filter((group) => group.groupKey !== d05GroupKey)
    const missingRegistry = buildInitialGeneratedPlanTriageRegistry(groupsWithoutD05)
    const missingD47Packet = buildGeneratedPlanD47D05ComparatorDecisionPacket(
      groupsWithoutD05,
      missingRegistry,
      {
        d47Evaluation: completeD47ComparatorEvaluation,
      },
    )
    const missingNoChangePacket = buildGeneratedPlanD47D05ComparatorDecisionPacket(
      groupsWithoutD05,
      missingRegistry,
      {
        noChangeEvaluation: completeNoChangeComparatorEvaluation,
      },
    )
    const groups = currentGroups()
    const staleRegistry = buildInitialGeneratedPlanTriageRegistry(groups).map((entry) =>
      entry.groupKey === d05GroupKey
        ? { ...entry, diagnosticFingerprint: `${entry.diagnosticFingerprint}:stale` }
        : entry,
    )
    const stalePacket = buildGeneratedPlanD47D05ComparatorDecisionPacket(groups, staleRegistry, {
      d47Evaluation: completeD47ComparatorEvaluation,
    })

    for (const packet of [missingD47Packet, missingNoChangePacket, stalePacket]) {
      expect(packet.selectionState).toBe('hold_for_evidence')
      expect(packet.selectedOutcome).toBe('hold_both_for_evidence')
      expect(packet.authorizationStatus).toBe('not_authorized')
      expect(packet.tieBreakSummary).toContain('D05 evidence is missing or stale')
    }
  })

  it('does not promote D47 when D47 evidence is missing or stale', () => {
    const d47GroupKey =
      'gpdg:v1:d47:d47-solo-open:main_skill:true:optional_slot_redistribution+over_authored_max+over_fatigue_cap'
    const groupsWithoutD47 = withoutD49Groups(currentGroups()).filter(
      (group) => group.groupKey !== d47GroupKey,
    )
    const missingPacket = buildGeneratedPlanD47D05ComparatorDecisionPacket(
      groupsWithoutD47,
      buildInitialGeneratedPlanTriageRegistry(groupsWithoutD47),
      {
        d47Evaluation: completeD47ComparatorEvaluation,
      },
    )
    const groups = [
      ...currentGroups(),
      redistributionGroup({
        groupKey: d47GroupKey,
        drillId: 'd47',
        variantId: 'd47-solo-open',
      }),
    ]
    const staleRegistry = buildInitialGeneratedPlanTriageRegistry(groups).map((entry) =>
      entry.groupKey === d47GroupKey
        ? { ...entry, diagnosticFingerprint: `${entry.diagnosticFingerprint}:stale` }
        : entry,
    )
    const stalePacket = buildGeneratedPlanD47D05ComparatorDecisionPacket(groups, staleRegistry, {
      d47Evaluation: completeD47ComparatorEvaluation,
    })

    expect(missingPacket.selectionState).toBe('hold_for_evidence')
    expect(missingPacket.selectedOutcome).toBe('hold_both_for_evidence')
    expect(missingPacket.authorizationStatus).toBe('not_authorized')
    expect(missingPacket.tieBreakSummary).toContain('D47 evidence is not current')
    expect(stalePacket.selectionState).toBe('hold_for_evidence')
    expect(stalePacket.selectedOutcome).toBe('hold_both_for_evidence')
    expect(stalePacket.authorizationStatus).toBe('not_authorized')
    expect(stalePacket.tieBreakSummary).toContain('D47 evidence is not current')
  })

  it('fails closed for conflicting D47 and no-change proof payloads', () => {
    const groups = currentGroups()
    const registry = buildInitialGeneratedPlanTriageRegistry(groups)
    const packet = buildGeneratedPlanD47D05ComparatorDecisionPacket(groups, registry, {
      d47Evaluation: completeD47ComparatorEvaluation,
      noChangeEvaluation: completeNoChangeComparatorEvaluation,
    })

    expect(packet.selectionState).toBe('hold_for_evidence')
    expect(packet.selectedOutcome).toBe('hold_both_for_evidence')
    expect(packet.authorizationStatus).toBe('not_authorized')
    expect(packet.tieBreakSummary).toContain('Multiple comparator proof paths')
  })

  it('does not select a comparator winner from comparison-inconclusive receipt evidence', () => {
    const d47GroupKey =
      'gpdg:v1:d47:d47-solo-open:main_skill:true:optional_slot_redistribution+over_authored_max+over_fatigue_cap'
    const d05GroupKey =
      'gpdg:v1:d05:d05-solo:main_skill:true:optional_slot_redistribution+over_authored_max+over_fatigue_cap'
    const d47InconclusiveGroups = [
      ...currentGroups(),
      redistributionGroup({
        groupKey: d47GroupKey,
        drillId: 'd47',
        variantId: 'd47-solo-open',
        affectedCells: [redistributionCell({ plannedMinutes: undefined })],
      }),
    ]
    const d05InconclusiveGroups = makeGroupComparisonInconclusive(currentGroups(), d05GroupKey)
    const d47Packet = buildGeneratedPlanD47D05ComparatorDecisionPacket(
      d47InconclusiveGroups,
      buildInitialGeneratedPlanTriageRegistry(d47InconclusiveGroups),
      {
        d47Evaluation: completeD47ComparatorEvaluation,
      },
    )
    const d05Packet = buildGeneratedPlanD47D05ComparatorDecisionPacket(
      d05InconclusiveGroups,
      buildInitialGeneratedPlanTriageRegistry(d05InconclusiveGroups),
      {
        d05Evaluation: completeD05ComparatorEvaluation,
      },
    )

    expect(d47Packet.selectionState).toBe('hold_for_evidence')
    expect(d47Packet.selectedOutcome).toBe('hold_both_for_evidence')
    expect(d47Packet.tieBreakSummary).toContain('D47 receipt evidence is incomplete')
    expect(d05Packet.selectionState).toBe('hold_for_evidence')
    expect(d05Packet.selectedOutcome).toBe('hold_both_for_evidence')
    expect(d05Packet.tieBreakSummary).toContain('D05 receipt evidence is incomplete')
  })

  it('renders branch-specific comparator packet markdown for selected outcomes', () => {
    const groups = currentGroups()
    const registry = buildInitialGeneratedPlanTriageRegistry(groups)
    const d47Lines = formatGeneratedPlanD47D05ComparatorDecisionPacketMarkdown(
      buildGeneratedPlanD47D05ComparatorDecisionPacket(groups, registry, {
        d47Evaluation: completeD47ComparatorEvaluation,
      }),
    )
    const d05Lines = formatGeneratedPlanD47D05ComparatorDecisionPacketMarkdown(
      buildGeneratedPlanD47D05ComparatorDecisionPacket(groups, registry, {
        d05Evaluation: completeD05ComparatorEvaluation,
      }),
    )
    const noChangeLines = formatGeneratedPlanD47D05ComparatorDecisionPacketMarkdown(
      buildGeneratedPlanD47D05ComparatorDecisionPacket(groups, registry, {
        noChangeEvaluation: completeNoChangeComparatorEvaluation,
      }),
    )

    expect(d47Lines.join('\n')).toContain('D47 source/adaptation basis:')
    expect(d47Lines.join('\n')).toContain(
      'Gap-card input: `docs/reviews/2026-05-02-d47-source-backed-gap-card.md`',
    )
    expect(d05Lines.join('\n')).toContain('D05 proposal type: `workload_block_shape_proposal`')
    expect(d05Lines.join('\n')).toContain('D05 changed surface:')
    expect(noChangeLines.join('\n')).toContain('No-change acceptance evidence:')
    expect(noChangeLines.join('\n')).toContain('Accepted blast radius:')
  })

  it('fails validation for unexpected unknown compression lanes', () => {
    const groups = currentGroups()
    const firstGroup = groups[0]
    const firstCell = firstGroup?.affectedCells[0]
    if (!firstGroup || !firstCell) throw new Error('Expected current observation groups.')
    const unknownGroup: GeneratedPlanObservationGroup = {
      ...firstGroup,
      groupKey: 'gpdg:v1:unknown:unknown-variant:pressure:false:repeated_focus_controlled_family',
      diagnosticFingerprint: `${firstGroup.diagnosticFingerprint}:unknown`,
      blockType: 'pressure',
      required: false,
      affectedCellCount: 4,
      observationCodes: ['repeated_focus_controlled_family'],
      affectedCells: Array.from({ length: 4 }, (_, index) => ({
        ...firstCell,
        seed: `unknown-${index}`,
        observationCodes: ['repeated_focus_controlled_family'],
        redistribution: undefined,
      })),
    }
    const registry = buildInitialGeneratedPlanTriageRegistry([unknownGroup])
    const validation = validateGeneratedPlanTriageCoverage([unknownGroup], registry)

    expect(validation.blockingIssues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: 'unknown_compression_lane',
          groupKey: unknownGroup.groupKey,
        }),
      ]),
    )
  })

  it('renders compressed decision prompts in the workbench', () => {
    const groups = currentGroups()
    const registry = buildInitialGeneratedPlanTriageRegistry(groups)
    const markdown = buildGeneratedPlanTriageWorkbenchMarkdown(groups, registry)

    expect(markdown).toContain('## Decision-Debt Compression')
    expect(markdown).toContain('Short-session cooldown minimum')
    expect(markdown).toContain('Generator redistribution investigation')
    expect(markdown).toContain('redistribution-affected cells')
    expect(markdown).toContain('## Redistribution Causality Receipt')
    expect(markdown).toContain('allocated_duration_counterfactual')
    expect(markdown).toContain('Pressure disappears under allocated-duration counterfactual')
    expect(markdown).toContain('Non-redistribution pressure cells')
    expect(markdown).toContain('## D47 Proposal Admission Ticket')
    expect(markdown).toContain(
      'Candidate: `gpdg:v1:d47:d47-solo-open:main_skill:true:optional_slot_redistribution+over_authored_max+over_fatigue_cap`',
    )
    expect(markdown).toContain('Admission state: `evidence_gathering`')
    expect(markdown).toContain(
      'Candidate group is not present in the current redistribution causality receipt.',
    )
    expect(markdown).toContain('## D47 Gap Closure Ledger')
    expect(markdown).toContain(
      'Ledger source: D47 proposal-admission ticket plus U8 redistribution causality receipt',
    )
    expect(markdown).toContain('Currentness: `closed_by_d49`')
    expect(markdown).toContain('Decision state: `closed_validated`')
    expect(markdown).toContain('Authorization status: `closed_with_fill`')
    expect(markdown).toContain('Comparator kind: `no_change_baseline`')
    expect(markdown).toContain('Pressure disappears under counterfactual: cells 0')
    expect(markdown).toContain('Non-redistribution pressure: cells 0')
    expect(markdown).toContain('Artifact: `d49_residual_follow_up`')
    expect(markdown).toContain('Reassessment result: `validated`')
    expect(markdown).toContain('## D01 Gap-Fill Proposal')
    expect(markdown).toContain('Proposal source: D47 gap closure comparator receipt')
    expect(markdown).toContain(
      'Candidate: `gpdg:v1:d01:d01-solo:main_skill:true:optional_slot_redistribution+over_authored_max+over_fatigue_cap`',
    )
    expect(markdown).toContain('D47 relationship: `d47_missing_or_shifted`')
    expect(markdown).toContain('Primary closure path: `combined_workload_block_shape_review`')
    expect(markdown).toContain('Artifact: `workload_block_shape_proposal`')
    expect(markdown).toContain('Expected diagnostic movement: Future fill should reduce D01')
    expect(markdown).toContain(
      'Expected training-quality movement: Future fill should improve workload honesty',
    )
    expect(markdown).toContain('## D01 Workload Block-Shape Proposal')
    expect(markdown).toContain('Selected disposition: `block_shape_review_needed`')
    expect(markdown).toContain('Secondary disposition: `metadata_review_needed`')
    expect(markdown).toContain('Metadata action: `unchanged`')
    expect(markdown).toContain(
      'Recommended future fill shape: Future fill should split, repeat, or reroute',
    )
    expect(markdown).toContain('Source-backed content disposition: `source_depth_blocked`')
    expect(markdown).toContain('U6 eligibility: `blocked_until_concrete_block_or_cap_proposal`')
    expect(markdown).toContain('## D01 Block-Shape Fill Receipt')
    expect(markdown).toContain(
      'Target group: `gpdg:v1:d01:d01-solo:main_skill:true:optional_slot_redistribution+over_authored_max+over_fatigue_cap`',
    )
    expect(markdown).toContain('Target found: yes')
    expect(markdown).toContain('Diagnostic movement: `partially_validated`')
    expect(markdown).toContain('Training-quality state: `not_field_validated`')
    expect(markdown).toContain('Redistribution handoff state: `insufficient_allocated_pressure`')
    expect(markdown).toContain(
      'Redistribution handoff reason: The current D01 target remains over cap',
    )
    expect(markdown).toContain('D47 next state: `cap_or_catalog_proposal_needed`')
    expect(markdown).toContain(
      'Applied fill: Duration-aware D01 main-skill reroute: avoid stretching `d01-solo` beyond its authored max/fatigue cap',
    )
    expect(markdown).toContain('Metadata action: `unchanged`')
    expect(markdown).toContain('Source-backed content disposition: `source_depth_blocked`')
    expect(markdown).toContain('U6 eligibility: `deferred_no_cap_or_catalog_delta`')
    expect(markdown).toContain(
      'Baseline receipt: total affected cells 18, pressure disappears 0, pressure remains 18, non-redistribution pressure 6, inconclusive 0',
    )
    expect(markdown).toContain(
      'Current receipt: total affected cells 12, pressure disappears 0, pressure remains 12, non-redistribution pressure 0, inconclusive 0',
    )
    expect(markdown).toContain(
      'Diagnostic summary: The D01 fill reduced the target receipt but did not close every current D01 pressure cell.',
    )
    expect(markdown).toContain(
      'Training-quality boundary: Generated diagnostics can validate workload-envelope movement',
    )
    expect(markdown).toContain('Remaining action: Keep the D01 fill receipt open')
    expect(markdown).toContain('## D01 Cap/Catalog Fork Packet')
    expect(markdown).toContain('Selection state: `selected`')
    expect(markdown).toContain('Selected fork: `resume_d47_with_d01_held`')
    expect(markdown).toContain('Parent D47 state: `d47_resumed_d01_held`')
    expect(markdown).toContain(
      'Planning authorization status: `not_ready_for_catalog_fill_planning`',
    )
    expect(markdown).toContain('Activation status: `not_authorized`')
    expect(markdown).toContain('## Gap Closure Selection')
    expect(markdown).toContain('Selection source: D01 cap/catalog fork packet')
    expect(markdown).toContain('Selected artifact: `d47_closed_by_d49_receipt`')
    expect(markdown).toContain('Selected target: `d47/d47-solo-open closed by d49`')
    expect(markdown).toContain('Authorization status: `not_authorized`')
    expect(markdown).toContain('Next artifact: D49 residual redistribution/workload follow-up')
    expect(markdown).toContain('### Rejected Alternatives')
    expect(markdown).toContain('D25 cooldown policy receipt')
    expect(markdown).toContain('D05 comparator proposal')
    expect(markdown).toContain('## D49 Residual Follow-Up')
    expect(markdown).toContain('D47 closure state: `closed_by_d49`')
    expect(markdown).toContain('one ball, markers, no 3+ player source forms')
    expect(markdown).toContain('### D49 workload envelope review')
    expect(markdown).toContain('Disposition: `workload_review_needed`')
    expect(markdown).toContain('### D49 redistribution investigation')
    expect(markdown).toContain('Disposition: `route_to_u8`')
    expect(markdown).toContain(
      'Stop condition: Do not edit catalog metadata, add catalog content, change runtime redistribution, or reopen D47 from this packet alone.',
    )
    expect(markdown).toContain('## D47 vs D05 Comparator Evaluation Payload')
    expect(markdown).toContain(
      'Payload source: `docs/reviews/2026-05-02-d47-d05-comparator-evaluation-payload.md`',
    )
    expect(markdown).toContain('Selected proof path: `d47_wins`')
    expect(markdown).toContain('Score semantics: Scores are ordinal comparator evidence')
    expect(markdown).toContain('D05 re-entry trigger:')
    expect(markdown).toContain('## D47 vs D05 Comparator Decision Packet')
    const comparatorPacketSection = markdown.slice(
      markdown.indexOf('## D47 vs D05 Comparator Decision Packet'),
    )
    expect(comparatorPacketSection).toContain('Selection state: `selected`')
    expect(comparatorPacketSection).toContain('Selected outcome: `d47_wins`')
    expect(comparatorPacketSection).toContain('Authorization status: `not_authorized`')
    expect(comparatorPacketSection).toContain(
      'D47 state: `closed_by_d49:closed_validated:closed_with_fill`',
    )
    expect(comparatorPacketSection).toContain('D47 facts: total affected cells 0')
    expect(comparatorPacketSection).toContain('D05 facts: total affected cells 15')
    expect(comparatorPacketSection).toContain(
      'Gap-card input: `docs/reviews/2026-05-02-d47-source-backed-gap-card.md`',
    )
    expect(comparatorPacketSection).toContain(
      'Next artifact: D47 source-backed catalog implementation plan',
    )
    expect(markdown).toContain(
      'docs/ops/workload-envelope-authoring-guide.md#short-session-cooldown-minimum',
    )
    expect(markdown).toContain('Candidate dispositions: `accepted_policy_allowance`')
  })
})
