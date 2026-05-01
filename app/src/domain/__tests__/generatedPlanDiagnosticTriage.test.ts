import { describe, expect, it } from 'vitest'
import {
  buildGeneratedPlanDiagnostics,
  buildGeneratedPlanObservationGroups,
  type GeneratedPlanDiagnosticResult,
  type GeneratedPlanObservationGroup,
} from '../generatedPlanDiagnostics'
import {
  buildGeneratedPlanDecisionDebtPrompts,
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
    expect(markdown).toContain('docs/ops/workload-envelope-authoring-guide.md#short-session-cooldown-minimum')
    expect(markdown).toContain('Candidate dispositions: `accepted_policy_allowance`')
  })
})
