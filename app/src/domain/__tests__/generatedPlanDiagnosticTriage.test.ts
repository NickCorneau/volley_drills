import { describe, expect, it } from 'vitest'
import type { GeneratedPlanObservationGroup } from '../generatedPlanDiagnostics'
import {
  buildCurrentGeneratedPlanD47D05ComparatorEvaluationPayload,
  buildGeneratedPlanD01BlockShapeFillReceipt,
  buildGeneratedPlanD01CapCatalogForkPacket,
  buildGeneratedPlanD01GapFillProposal,
  buildGeneratedPlanD01WorkloadBlockShapeProposal,
  buildGeneratedPlanD47D05ComparatorDecisionPacket,
  buildGeneratedPlanD47GapClosureLedger,
  buildGeneratedPlanD47ProposalAdmissionTicket,
  buildGeneratedPlanD49GeneratorPolicyProposalPacket,
  buildGeneratedPlanD49ResidualFollowUpPacket,
  buildGeneratedPlanD49U8GeneratorPolicyProofPacket,
  buildGeneratedPlanDecisionDebtPrompts,
  buildGeneratedPlanRedistributionCausalityReceipt,
  buildGeneratedPlanTriageWorkbenchMarkdown,
  buildInitialGeneratedPlanTriageRegistry,
  compressionLaneForGeneratedPlanTriageItem,
  evaluationsForGeneratedPlanD47D05ComparatorPayload,
  formatGeneratedPlanD01CapCatalogForkPacketMarkdown,
  formatGeneratedPlanD47D05ComparatorDecisionPacketMarkdown,
  formatGeneratedPlanD47D05ComparatorEvaluationPayloadMarkdown,
  formatGeneratedPlanD49GeneratorPolicyProposalPacketMarkdown,
  conservativeRouteForGeneratedPlanGroup,
  isGeneratedPlanEnforcementStatus,
  isGeneratedPlanTriageRoute,
  isGeneratedPlanTriageStatus,
  validateGeneratedPlanTriageCoverage,
} from '../generatedPlanDiagnosticTriage'

function group(
  overrides: Partial<GeneratedPlanObservationGroup> = {},
): GeneratedPlanObservationGroup {
  const observationCodes = overrides.observationCodes ?? ['slot_dropped']
  const affectedCells = overrides.affectedCells ?? [
    {
      focus: 'serve',
      configuration: 'pair_open',
      level: 'beginner',
      duration: 40,
      seed: 'fixture-seed',
      blockId: 'block-1',
      plannedMinutes: 37,
      allocatedMinutes: 40,
      authoredMinMinutes: 4,
      authoredMaxMinutes: 10,
      fatigueMaxMinutes: 10,
      observationCodes,
    },
  ]
  return {
    groupKey: 'gpdg:v1:d31:d31-pair-open:main_skill:true:slot_dropped',
    diagnosticFingerprint: 'gpdf:v1:fixture',
    drillId: 'd31',
    variantId: 'd31-pair-open',
    blockType: 'main_skill',
    required: true,
    authoredMinMinutes: 4,
    authoredMaxMinutes: 10,
    fatigueMaxMinutes: 10,
    affectedCellCount: affectedCells.length,
    observationCodes,
    likelyFixPaths: ['coverage_gap_review'],
    affectedCells,
    ...overrides,
  }
}

describe('generated plan diagnostic triage', () => {
  it('validates triage enum values', () => {
    expect(isGeneratedPlanTriageStatus('observed')).toBe(true)
    expect(isGeneratedPlanTriageStatus('unknown')).toBe(false)
    expect(isGeneratedPlanTriageRoute('source_backed_content_depth')).toBe(true)
    expect(isGeneratedPlanTriageRoute('unknown')).toBe(false)
    expect(isGeneratedPlanEnforcementStatus('observation_only')).toBe(true)
    expect(isGeneratedPlanEnforcementStatus('unknown')).toBe(false)
  })

  it('routes v8 dropped-slot and under-profile findings to coverage gap review', () => {
    expect(
      compressionLaneForGeneratedPlanTriageItem(
        group({ observationCodes: ['slot_dropped'] }),
      ),
    ).toBe('coverage_gap_review')
    expect(
      compressionLaneForGeneratedPlanTriageItem(
        group({ observationCodes: ['under_named_profile_duration'] }),
      ),
    ).toBe('coverage_gap_review')
  })

  it('keeps non-coverage workload and under-min groups on conservative lanes', () => {
    expect(
      compressionLaneForGeneratedPlanTriageItem(
        group({ blockType: 'wrap', observationCodes: ['under_authored_min'] }),
      ),
    ).toBe('short_session_cooldown_minimum')
    expect(
      compressionLaneForGeneratedPlanTriageItem(
        group({ blockType: 'technique', observationCodes: ['under_authored_min'] }),
      ),
    ).toBe('technique_under_min_review')
    expect(
      compressionLaneForGeneratedPlanTriageItem(
        group({ affectedCellCount: 8, observationCodes: ['over_authored_max'] }),
      ),
    ).toBe('workload_envelope_review')
  })

  it('builds registry entries for current groups and validates coverage', () => {
    const groups = [group()]
    const registry = buildInitialGeneratedPlanTriageRegistry(groups)

    expect(registry).toEqual([
      expect.objectContaining({
        groupKey: groups[0].groupKey,
        diagnosticFingerprint: groups[0].diagnosticFingerprint,
        triageStatus: 'observed',
        triageRoute: 'defer',
      }),
    ])
    expect(validateGeneratedPlanTriageCoverage(groups, registry).blockingIssues).toEqual([])
    expect(conservativeRouteForGeneratedPlanGroup(groups[0])).toBe('defer')
  })

  it('flags missing registry coverage as blocking', () => {
    const [issue] = validateGeneratedPlanTriageCoverage([group()], []).blockingIssues

    expect(issue).toEqual(
      expect.objectContaining({
        code: 'untriaged_group',
        groupKey: 'gpdg:v1:d31:d31-pair-open:main_skill:true:slot_dropped',
      }),
    )
  })

  it('warns when a registry entry has a stale diagnostic fingerprint', () => {
    const groups = [group()]
    const registry = [
      {
        ...buildInitialGeneratedPlanTriageRegistry(groups)[0],
        diagnosticFingerprint: 'stale-fingerprint',
      },
    ]

    const [issue] = validateGeneratedPlanTriageCoverage(groups, registry).warningIssues

    expect(issue).toEqual(
      expect.objectContaining({
        code: 'stale_fingerprint',
        groupKey: 'gpdg:v1:d31:d31-pair-open:main_skill:true:slot_dropped',
      }),
    )
  })

  it('compresses groups into founder-readable decision prompts', () => {
    const groups = [group()]
    const registry = buildInitialGeneratedPlanTriageRegistry(groups)
    const [prompt] = buildGeneratedPlanDecisionDebtPrompts(groups, registry)

    expect(prompt).toEqual(
      expect.objectContaining({
        lane: 'coverage_gap_review',
        affectedGroupCount: 1,
        totalAffectedCellCount: 1,
        disposition: 'needs_human_decision',
      }),
    )
  })

  it('keeps the retired redistribution receipt as an empty forward-compatible shell', () => {
    const receipt = buildGeneratedPlanRedistributionCausalityReceipt()

    expect(receipt.runtimeBoundary).toContain('retired_by_duration_honesty_v8')
    expect(receipt.groupCount).toBe(0)
    expect(receipt.groups).toEqual([])
  })

  it('renders the surviving triage workbench without rich packet builders', () => {
    const groups = [group()]
    const registry = buildInitialGeneratedPlanTriageRegistry(groups)
    const markdown = buildGeneratedPlanTriageWorkbenchMarkdown(groups, registry)

    expect(markdown).toContain('## Triage Summary')
    expect(markdown).toContain('### Coverage gap review')
    expect(markdown).toContain('## Retired Rich Packet Chain')
  })

  it('keeps retired rich packet builders as call-compatible replacedBy stubs', () => {
    const retiredExports = [
      buildGeneratedPlanD47ProposalAdmissionTicket,
      buildGeneratedPlanD47GapClosureLedger,
      buildGeneratedPlanD01GapFillProposal,
      buildGeneratedPlanD01WorkloadBlockShapeProposal,
      buildGeneratedPlanD01BlockShapeFillReceipt,
      buildGeneratedPlanD01CapCatalogForkPacket,
      formatGeneratedPlanD01CapCatalogForkPacketMarkdown,
      buildCurrentGeneratedPlanD47D05ComparatorEvaluationPayload,
      evaluationsForGeneratedPlanD47D05ComparatorPayload,
      formatGeneratedPlanD47D05ComparatorEvaluationPayloadMarkdown,
      buildGeneratedPlanD47D05ComparatorDecisionPacket,
      formatGeneratedPlanD47D05ComparatorDecisionPacketMarkdown,
      buildGeneratedPlanD49ResidualFollowUpPacket,
      buildGeneratedPlanD49U8GeneratorPolicyProofPacket,
      buildGeneratedPlanD49GeneratorPolicyProposalPacket,
      formatGeneratedPlanD49GeneratorPolicyProposalPacketMarkdown,
    ]

    for (const retiredExport of retiredExports) {
      expect(() => retiredExport('legacy-arg', { value: true })).toThrow(
        /replacedBy: coverage_gap_review/,
      )
    }
  })
})
