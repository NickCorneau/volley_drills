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
  buildGeneratedPlanD01GapFillProposal,
  buildGeneratedPlanD01WorkloadBlockShapeProposal,
  buildGeneratedPlanD47GapClosureLedger,
  buildGeneratedPlanD47ProposalAdmissionTicket,
  buildGeneratedPlanRedistributionCausalityReceipt,
  buildGeneratedPlanTriageWorkbenchMarkdown,
  buildInitialGeneratedPlanTriageRegistry,
  conservativeRouteForGeneratedPlanGroup,
  isGeneratedPlanEnforcementStatus,
  isGeneratedPlanTriageRoute,
  isGeneratedPlanTriageStatus,
  validateGeneratedPlanTriageCoverage,
  type GeneratedPlanTriageEntry,
} from '../generatedPlanDiagnosticTriage'

function currentGroups(): GeneratedPlanObservationGroup[] {
  return buildGeneratedPlanObservationGroups(buildGeneratedPlanDiagnostics())
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
    groupKey: 'gpdg:v1:d31:d31-pair-open:main_skill:true:optional_slot_redistribution+over_authored_max+over_fatigue_cap',
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
  function resultWithObservationCodes(codes: readonly ('over_authored_max' | 'over_fatigue_cap')[]) {
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

    expect(groups).toHaveLength(53)
    expect(groups[0]).toEqual(
      expect.objectContaining({
        groupKey: 'gpdg:v1:d25:d25-solo:wrap:true:under_authored_min',
        diagnosticFingerprint: expect.stringContaining('gpdf|v1|4|none|none|87'),
        affectedCellCount: 87,
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
        observations: resultWithObservationCodes(['over_authored_max', 'over_fatigue_cap']).observations.map(
          (observation) => ({ ...observation, authoredMaxMinutes: 9, fatigueMaxMinutes: 9 }),
        ),
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
      index === 0 ? { ...entry, diagnosticFingerprint: `${entry.diagnosticFingerprint}:stale` } : entry,
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
    expect(markdown).toContain('- Current routeable groups: 53')
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

    expect(markdown).toContain('Current generated-plan observation group has no triage registry entry.')
    expect(markdown).toContain('Triage registry entry fingerprint no longer matches')
    expect(markdown).toContain('gpdg:v1:stale:entry:main_skill:true:under_authored_min')
  })

  it('renders all blocking validation issue types into the workbench', () => {
    const groups = currentGroups()
    const registry = buildInitialGeneratedPlanTriageRegistry(groups)
    const brokenRegistry = registry.map((entry, index) => {
      if (index === 0) return { ...entry, enforcementStatus: 'hard_fail_enforced' }
      if (index === 1) return { ...entry, route: 'source_backed_content_depth', triageStatus: 'resolved', evidence: [] }
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
    expect(prompts.map((prompt) => prompt.lane)).toContain(
      'generator_redistribution_investigation',
    )
    expect(prompts.map((prompt) => prompt.lane)).not.toContain('unknown_unclassified')

    const cooldownPrompt = prompts.find((prompt) => prompt.lane === 'short_session_cooldown_minimum')
    expect(cooldownPrompt).toEqual(
      expect.objectContaining({
        recommendedFollowUpUnit: 'U7 workload envelope guidance',
        disposition: 'needs_human_decision',
      }),
    )
    expect(cooldownPrompt?.groupKeys).toContain(
      'gpdg:v1:d25:d25-solo:wrap:true:under_authored_min',
    )
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
    expect(receipt.runtimeBoundary).toContain('buildDraft() behavior is unchanged')
    expect(receipt.groupCount).toBe(21)
    expect(receipt.counts.totalAffectedCellCount).toBe(251)
    expect(receipt.counts.redistributionAffectedCellCount).toBe(236)
    expect(receipt.counts.nonRedistributionOverCapCellCount).toBe(15)
    expect(receipt.counts.nonRedistributionUnderMinCellCount).toBe(0)
    expect(receipt.counts.pressureDisappearsCellCount).toBeGreaterThan(0)
    expect(receipt.counts.pressureRemainsCellCount).toBeGreaterThan(0)
    expect(receipt.counts.counterfactualUnfilledMinutes).toBeGreaterThan(0)
    expect(receipt.groups.every((group) => group.groupKey.startsWith('gpdg:v1:'))).toBe(true)
  })

  it('classifies redistribution causality states and preserves mixed-group evidence', () => {
    const pressureDisappears = redistributionGroup({
      groupKey: 'gpdg:v1:d31:disappears:main_skill:true:optional_slot_redistribution+over_authored_max',
      affectedCells: [redistributionCell()],
    })
    const pressureRemains = redistributionGroup({
      groupKey: 'gpdg:v1:d31:remains:main_skill:true:optional_slot_redistribution+over_authored_max',
      affectedCells: [redistributionCell({ allocatedMinutes: 9 })],
    })
    const inconclusive = redistributionGroup({
      groupKey: 'gpdg:v1:d31:inconclusive:main_skill:true:optional_slot_redistribution+over_authored_max',
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
      affectedCells: [redistributionCell(), redistributionCell({ seed: 'receipt-fixture-b', allocatedMinutes: 9 })],
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
    expect(byKey.get(redistributionPreventsUnderMin.groupKey)?.counts.allocatedUnderAuthoredMinCellCount).toBe(
      1,
    )
    expect(byKey.get(redistributionPreventsUnderMin.groupKey)?.counts.pressureRemainsCellCount).toBe(0)
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
      groupKey: 'gpdg:v1:d31:missing-variant:main_skill:true:optional_slot_redistribution+over_authored_max',
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

  it('builds the D47 proposal admission ticket from the current redistribution receipt', () => {
    const groups = currentGroups()
    const registry = buildInitialGeneratedPlanTriageRegistry(groups)
    const ticket = buildGeneratedPlanD47ProposalAdmissionTicket(groups, registry)

    expect(ticket).toEqual(
      expect.objectContaining({
        admissionState: 'evidence_gathering',
        previewReady: false,
        sourceEvidenceState: 'missing',
        candidate: expect.objectContaining({
          groupKey:
            'gpdg:v1:d47:d47-solo-open:main_skill:true:optional_slot_redistribution+over_authored_max+over_fatigue_cap',
          drillId: 'd47',
          variantId: 'd47-solo-open',
          blockType: 'main_skill',
          triageRoute: 'generator_policy_investigation',
        }),
        receiptFacts: expect.objectContaining({
          totalAffectedCellCount: 30,
          pressureDisappearsCellCount: 12,
          pressureRemainsCellCount: 18,
          nonRedistributionPressureCellCount: 6,
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
    expect(ticket.workloadProposalTracks).toEqual([
      'workload_review',
      'block_shape_review',
      'source_backed_proposal_work',
      'u6_proposal_admission_candidate',
    ])
    expect(ticket.generatorPolicyTracks).toEqual(['future_generator_policy_decision'])
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
    const groups = currentGroups().map((group) =>
      group.groupKey ===
      'gpdg:v1:d47:d47-solo-open:main_skill:true:optional_slot_redistribution+over_authored_max+over_fatigue_cap'
        ? { ...group, groupKey: shiftedD47GroupKey }
        : group,
    )
    const registry = buildInitialGeneratedPlanTriageRegistry(groups)
    const ticket = buildGeneratedPlanD47ProposalAdmissionTicket(groups, registry)

    expect(ticket.candidateFound).toBe(false)
    expect(ticket.relatedCandidateGroupKeys).toEqual([shiftedD47GroupKey])
    expect(ticket.admissionState).toBe('evidence_gathering')
    expect(ticket.previewReady).toBe(false)
  })

  it('builds the comparator-first D47 gap closure ledger from current receipt evidence', () => {
    const groups = currentGroups()
    const registry = buildInitialGeneratedPlanTriageRegistry(groups)
    const ledger = buildGeneratedPlanD47GapClosureLedger(groups, registry)

    expect(ledger).toEqual(
      expect.objectContaining({
        candidateFound: true,
        currentnessState: 'current',
        gapType: 'undetermined',
        decisionState: 'evidence_gathering',
        authorizationStatus: 'not_authorized',
        candidate: expect.objectContaining({
          groupKey:
            'gpdg:v1:d47:d47-solo-open:main_skill:true:optional_slot_redistribution+over_authored_max+over_fatigue_cap',
        }),
        receiptFacts: expect.objectContaining({
          totalAffectedCellCount: 30,
          pressureDisappearsCellCount: 12,
          pressureRemainsCellCount: 18,
          nonRedistributionPressureCellCount: 6,
        }),
        comparatorReceipt: expect.objectContaining({
          comparatorKind: 'receipt_candidate',
          groupKey:
            'gpdg:v1:d01:d01-solo:main_skill:true:optional_slot_redistribution+over_authored_max+over_fatigue_cap',
          simplerThanD47: true,
          higherConfidenceThanD47: true,
          receiptFacts: expect.objectContaining({
            pressureDisappearsCellCount: 0,
            pressureRemainsCellCount: 18,
            nonRedistributionPressureCellCount: 6,
          }),
        }),
      }),
    )
    expect(ledger.segmentDispositions.map((segment) => segment.segment)).toEqual([
      'pressure_disappears',
      'pressure_remains',
      'non_redistribution_pressure',
    ])
    expect(ledger.segmentDispositions.every((segment) => segment.authorizationStatus === 'not_authorized')).toBe(
      true,
    )
    expect(ledger.nextArtifact).toEqual(
      expect.objectContaining({
        artifactType: 'comparator_receipt',
        owner: 'maintainer',
        abandonCriteria: expect.stringContaining('comparator presents'),
      }),
    )
    expect(ledger.sourceDeltaBoundary).toContain('beyond the existing FIVB 4.7 activation')
    expect(ledger.reassessmentResult).toBe('not_started')
  })

  it('blocks D47 gap closure authorization when the stable receipt key is absent', () => {
    const shiftedD47GroupKey =
      'gpdg:v1:d47:d47-solo-open:main_skill:true:optional_slot_redistribution+over_authored_max+review_fixture'
    const groups = currentGroups().map((group) =>
      group.groupKey ===
      'gpdg:v1:d47:d47-solo-open:main_skill:true:optional_slot_redistribution+over_authored_max+over_fatigue_cap'
        ? { ...group, groupKey: shiftedD47GroupKey }
        : group,
    )
    const registry = buildInitialGeneratedPlanTriageRegistry(groups)
    const ledger = buildGeneratedPlanD47GapClosureLedger(groups, registry)

    expect(ledger.currentnessState).toBe('missing_or_shifted')
    expect(ledger.authorizationStatus).toBe('not_authorized')
    expect(ledger.relatedCandidateGroupKeys).toEqual([shiftedD47GroupKey])
    if (ledger.comparatorReceipt.comparatorKind === 'receipt_candidate') {
      expect(ledger.comparatorReceipt.groupKey).not.toBe(shiftedD47GroupKey)
    }
  })

  it('falls back to baseline when only shifted D47 evidence is present', () => {
    const d47Group = currentGroups().find(
      (group) =>
        group.groupKey ===
        'gpdg:v1:d47:d47-solo-open:main_skill:true:optional_slot_redistribution+over_authored_max+over_fatigue_cap',
    )
    if (!d47Group) throw new Error('Expected current D47 group.')
    const shiftedD47Group = {
      ...d47Group,
      groupKey:
        'gpdg:v1:d47:d47-solo-open:main_skill:true:optional_slot_redistribution+over_authored_max+review_fixture',
    } satisfies GeneratedPlanObservationGroup
    const registry = buildInitialGeneratedPlanTriageRegistry([shiftedD47Group])
    const ledger = buildGeneratedPlanD47GapClosureLedger([shiftedD47Group], registry)

    expect(ledger.candidateFound).toBe(false)
    expect(ledger.currentnessState).toBe('missing_or_shifted')
    expect(ledger.comparatorReceipt.comparatorKind).toBe('no_change_baseline')
    expect(ledger.authorizationStatus).toBe('not_authorized')
  })

  it('marks D47 gap closure ledger stale when the stable D47 fingerprint is stale', () => {
    const groups = currentGroups()
    const registry = buildInitialGeneratedPlanTriageRegistry(groups).map((entry) =>
      entry.groupKey ===
      'gpdg:v1:d47:d47-solo-open:main_skill:true:optional_slot_redistribution+over_authored_max+over_fatigue_cap'
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
    const groups = currentGroups()
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
    const d47Group = currentGroups().find(
      (group) =>
        group.groupKey ===
        'gpdg:v1:d47:d47-solo-open:main_skill:true:optional_slot_redistribution+over_authored_max+over_fatigue_cap',
    )
    if (!d47Group) throw new Error('Expected current D47 group.')

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
        d47Relationship: 'd47_held_behind_d01',
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
          totalAffectedCellCount: 18,
          pressureDisappearsCellCount: 0,
          pressureRemainsCellCount: 18,
          nonRedistributionPressureCellCount: 6,
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
    expect(markdown).toContain('Ticket source: U8 redistribution causality receipt')
    expect(markdown).toContain(
      'Candidate: `gpdg:v1:d47:d47-solo-open:main_skill:true:optional_slot_redistribution+over_authored_max+over_fatigue_cap`',
    )
    expect(markdown).toContain('Admission state: `evidence_gathering`')
    expect(markdown).toContain('Admission gate: U6 preview remains blocked')
    expect(markdown).toContain(
      'Receipt facts: total affected cells 30, pressure disappears 12, pressure remains 18, non-redistribution pressure 6, inconclusive 0',
    )
    expect(markdown).toContain(
      'Workload/block/source tracks: `workload_review`, `block_shape_review`, `source_backed_proposal_work`, `u6_proposal_admission_candidate`',
    )
    expect(markdown).toContain('Generator-policy tracks: `future_generator_policy_decision`')
    expect(markdown).toContain('No-change path: `close_or_hold_without_preview`')
    expect(markdown).toContain('Missing proposal facts')
    expect(markdown).toContain('`product_or_training_quality_hypothesis`: product or training quality hypothesis')
    expect(markdown).toContain('`no_action_threshold`: no action threshold')
    expect(markdown).toContain('Counterfactual-only pressure remains diagnostic evidence')
    expect(markdown).toContain('## D47 Gap Closure Ledger')
    expect(markdown).toContain('Ledger source: D47 proposal-admission ticket plus U8 redistribution causality receipt')
    expect(markdown).toContain('Currentness: `current`')
    expect(markdown).toContain('Decision state: `evidence_gathering`')
    expect(markdown).toContain('Authorization status: `not_authorized`')
    expect(markdown).toContain('Comparator kind: `receipt_candidate`')
    expect(markdown).toContain(
      'Comparator candidate: `gpdg:v1:d01:d01-solo:main_skill:true:optional_slot_redistribution+over_authored_max+over_fatigue_cap`',
    )
    expect(markdown).toContain('Pressure disappears under counterfactual: cells 12')
    expect(markdown).toContain('Non-redistribution pressure: cells 6')
    expect(markdown).toContain('Artifact: `comparator_receipt`')
    expect(markdown).toContain('Reassessment result: `not_started`')
    expect(markdown).toContain('## D01 Gap-Fill Proposal')
    expect(markdown).toContain('Proposal source: D47 gap closure comparator receipt')
    expect(markdown).toContain(
      'Candidate: `gpdg:v1:d01:d01-solo:main_skill:true:optional_slot_redistribution+over_authored_max+over_fatigue_cap`',
    )
    expect(markdown).toContain('D47 relationship: `d47_held_behind_d01`')
    expect(markdown).toContain('Primary closure path: `combined_workload_block_shape_review`')
    expect(markdown).toContain('Artifact: `workload_block_shape_proposal`')
    expect(markdown).toContain('Expected diagnostic movement: Future fill should reduce D01')
    expect(markdown).toContain('Expected training-quality movement: Future fill should improve workload honesty')
    expect(markdown).toContain('## D01 Workload Block-Shape Proposal')
    expect(markdown).toContain('Selected disposition: `block_shape_review_needed`')
    expect(markdown).toContain('Secondary disposition: `metadata_review_needed`')
    expect(markdown).toContain('Metadata action: `unchanged`')
    expect(markdown).toContain('Recommended future fill shape: Future fill should split, repeat, or reroute')
    expect(markdown).toContain('Source-backed content disposition: `source_depth_blocked`')
    expect(markdown).toContain('U6 eligibility: `blocked_until_concrete_block_or_cap_proposal`')
    expect(markdown).toContain('docs/ops/workload-envelope-authoring-guide.md#short-session-cooldown-minimum')
    expect(markdown).toContain('Candidate dispositions: `accepted_policy_allowance`')
  })
})
