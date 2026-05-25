import type {
  GeneratedPlanObservationCode,
  GeneratedPlanObservationGroup,
} from './generatedPlanDiagnostics'

export type GeneratedPlanTriageStatus = 'observed' | 'routed' | 'resolved' | 'superseded'

export type GeneratedPlanTriageRoute =
  | 'policy_allowance'
  | 'variant_cap_review'
  | 'block_split'
  | 'source_backed_content_depth'
  | 'generator_policy_investigation'
  | 'defer'

export type GeneratedPlanEnforcementStatus =
  | 'observation_only'
  | 'hard_fail_candidate'
  | 'hard_fail_enforced'

export type GeneratedPlanTriageIssueCode =
  | 'untriaged_group'
  | 'stale_fingerprint'
  | 'missing_required_field'
  | 'invalid_registry_entry'
  | 'duplicate_group_key'
  | 'source_depth_missing_evidence'
  | 'enforced_group_present'
  | 'superseded_group'
  | 'unknown_compression_lane'

export type GeneratedPlanDecisionDebtCompressionLane =
  | 'short_session_cooldown_minimum'
  | 'technique_under_min_review'
  | 'workload_envelope_review'
  | 'coverage_gap_review'
  | 'source_backed_content_depth_candidate'
  | 'low_volume_watchlist'
  | 'unknown_unclassified'

export type GeneratedPlanDecisionDebtDisposition =
  | 'needs_human_decision'
  | 'no_implementation_action_yet'

export interface GeneratedPlanDecisionDebtRouteCount {
  readonly route: GeneratedPlanTriageRoute
  readonly count: number
}

export interface GeneratedPlanDecisionDebtPrompt {
  readonly lane: GeneratedPlanDecisionDebtCompressionLane
  readonly label: string
  readonly question: string
  readonly explanation: string
  readonly affectedGroupCount: number
  readonly totalAffectedCellCount: number
  readonly redistributionAffectedCellCount: number
  readonly nonRedistributionOverCapCellCount: number
  readonly routeCounts: readonly GeneratedPlanDecisionDebtRouteCount[]
  readonly groupKeys: readonly string[]
  readonly disposition: GeneratedPlanDecisionDebtDisposition
  readonly nextEvidenceNeeded: string
  readonly recommendedFollowUpUnit: string
  readonly guideAnchor?: string
  readonly candidateDispositions: readonly string[]
}

export type GeneratedPlanRedistributionCausalityComparisonMode = 'allocated_duration_counterfactual'
export type GeneratedPlanRedistributionCausalityState =
  | 'likely_redistribution_caused'
  | 'pressure_remains_without_redistribution'
  | 'comparison_inconclusive'
  | 'redistribution_without_pressure'
export type GeneratedPlanRedistributionDominantState =
  | GeneratedPlanRedistributionCausalityState
  | 'mixed_cell_states'
export type GeneratedPlanRedistributionFollowUpRoute =
  | 'future_generator_policy_decision'
  | 'workload_review'
  | 'block_shape_review'
  | 'source_backed_proposal_work'
  | 'u6_proposal_admission_candidate'
  | 'no_implementation_action_yet'
  | 'comparison_support_needed'

export interface GeneratedPlanRedistributionCausalityCounts {
  readonly totalAffectedCellCount: number
  readonly redistributionAffectedCellCount: number
  readonly currentOverAuthoredMaxCellCount: number
  readonly currentOverFatigueCapCellCount: number
  readonly currentUnderAuthoredMinCellCount: number
  readonly allocatedOverAuthoredMaxCellCount: number
  readonly allocatedOverFatigueCapCellCount: number
  readonly allocatedUnderAuthoredMinCellCount: number
  readonly nonRedistributionOverCapCellCount: number
  readonly nonRedistributionUnderMinCellCount: number
  readonly pressureDisappearsCellCount: number
  readonly pressureRemainsCellCount: number
  readonly comparisonInconclusiveCellCount: number
  readonly redistributionWithoutPressureCellCount: number
  readonly counterfactualUnfilledMinutes: number
}

export interface GeneratedPlanRedistributionCausalityGroupReceipt {
  readonly groupKey: string
  readonly diagnosticFingerprint: string
  readonly triageStatus: GeneratedPlanTriageStatus
  readonly triageRoute: GeneratedPlanTriageRoute
  readonly reviewedReportId: string
  readonly drillId?: string
  readonly variantId?: string
  readonly blockType?: GeneratedPlanObservationGroup['blockType']
  readonly observationCodes: readonly GeneratedPlanObservationCode[]
  readonly actionState: GeneratedPlanRedistributionCausalityState
  readonly dominantCellState: GeneratedPlanRedistributionDominantState
  readonly hasIncompleteEvidence: boolean
  readonly followUpRoutes: readonly GeneratedPlanRedistributionFollowUpRoute[]
  readonly counts: GeneratedPlanRedistributionCausalityCounts
}

export interface GeneratedPlanRedistributionCausalityReceipt {
  readonly comparisonMode: GeneratedPlanRedistributionCausalityComparisonMode
  readonly runtimeBoundary: string
  readonly groupCount: number
  readonly counts: GeneratedPlanRedistributionCausalityCounts
  readonly groups: readonly GeneratedPlanRedistributionCausalityGroupReceipt[]
}

export interface GeneratedPlanTriageEntry {
  readonly groupKey: string
  readonly diagnosticFingerprint: string
  readonly triageStatus: GeneratedPlanTriageStatus
  readonly triageRoute: GeneratedPlanTriageRoute
  readonly reviewedReportId: string
  readonly enforcementStatus?: GeneratedPlanEnforcementStatus
  readonly notes?: string
}

export interface GeneratedPlanTriageValidationIssue {
  readonly code: GeneratedPlanTriageIssueCode
  readonly groupKey?: string
  readonly message: string
}

export interface GeneratedPlanTriageValidation {
  readonly blockingIssues: readonly GeneratedPlanTriageValidationIssue[]
  readonly warningIssues: readonly GeneratedPlanTriageValidationIssue[]
}

export const GENERATED_PLAN_TRIAGE_REPORT_ID = 'generated-plan-diagnostics-report-2026-05-01'
export const GENERATED_PLAN_TRIAGE_REGISTRY: readonly GeneratedPlanTriageEntry[] = []

function zeroCounts(): GeneratedPlanRedistributionCausalityCounts {
  return {
    totalAffectedCellCount: 0,
    redistributionAffectedCellCount: 0,
    currentOverAuthoredMaxCellCount: 0,
    currentOverFatigueCapCellCount: 0,
    currentUnderAuthoredMinCellCount: 0,
    allocatedOverAuthoredMaxCellCount: 0,
    allocatedOverFatigueCapCellCount: 0,
    allocatedUnderAuthoredMinCellCount: 0,
    nonRedistributionOverCapCellCount: 0,
    nonRedistributionUnderMinCellCount: 0,
    pressureDisappearsCellCount: 0,
    pressureRemainsCellCount: 0,
    comparisonInconclusiveCellCount: 0,
    redistributionWithoutPressureCellCount: 0,
    counterfactualUnfilledMinutes: 0,
  }
}

function routeCounts(entries: readonly GeneratedPlanTriageEntry[]): readonly GeneratedPlanDecisionDebtRouteCount[] {
  const counts = new Map<GeneratedPlanTriageRoute, number>()
  for (const entry of entries) counts.set(entry.triageRoute, (counts.get(entry.triageRoute) ?? 0) + 1)
  return [...counts.entries()].map(([route, count]) => ({ route, count }))
}

function affectedCellCount(groups: readonly GeneratedPlanObservationGroup[]): number {
  return groups.reduce((sum, group) => sum + group.affectedCellCount, 0)
}

function redistributionCellCount(groups: readonly GeneratedPlanObservationGroup[]): number {
  return groups.reduce(
    (sum, group) => sum + group.affectedCells.filter((cell) => Boolean(cell.redistribution)).length,
    0,
  )
}

function nonRedistributionOverCapCellCount(groups: readonly GeneratedPlanObservationGroup[]): number {
  return groups.reduce(
    (sum, group) =>
      sum +
      group.affectedCells.filter(
        (cell) =>
          !cell.redistribution &&
          (cell.observationCodes.includes('over_authored_max') ||
            cell.observationCodes.includes('over_fatigue_cap')),
      ).length,
    0,
  )
}

function routeForLane(lane: GeneratedPlanDecisionDebtCompressionLane): GeneratedPlanTriageRoute {
  if (lane === 'source_backed_content_depth_candidate') return 'source_backed_content_depth'
  return 'defer'
}

function labelForLane(lane: GeneratedPlanDecisionDebtCompressionLane): string {
  switch (lane) {
    case 'short_session_cooldown_minimum':
      return 'Short-session cooldown minimum'
    case 'technique_under_min_review':
      return 'Technique under-min review'
    case 'workload_envelope_review':
      return 'Workload envelope review'
    case 'coverage_gap_review':
      return 'Coverage gap review'
    case 'source_backed_content_depth_candidate':
      return 'Source-backed content-depth candidate'
    case 'low_volume_watchlist':
      return 'Low-volume watchlist'
    case 'unknown_unclassified':
      return 'Unknown / unclassified'
    default: {
      const _exhaustive: never = lane
      return _exhaustive
    }
  }
}

function questionForLane(lane: GeneratedPlanDecisionDebtCompressionLane): string {
  switch (lane) {
    case 'short_session_cooldown_minimum':
      return 'Is the short wrap envelope acceptable, or does this need workload guidance?'
    case 'technique_under_min_review':
      return 'Are technique slots intentionally below authored minimums, or should content/block shape change?'
    case 'workload_envelope_review':
      return 'Are duration and fatigue envelopes correct for these generated allocations?'
    case 'coverage_gap_review':
      return 'Does this focus/profile need catalog coverage, or is the shorter session acceptable for now?'
    case 'source_backed_content_depth_candidate':
      return 'Is source-backed drill depth the right fix, or should this remain a watchlist item?'
    case 'low_volume_watchlist':
      return 'Does this low-volume observation need action, or should it stay watched?'
    case 'unknown_unclassified':
      return 'What decision lane owns this unclassified diagnostic group?'
    default: {
      const _exhaustive: never = lane
      return _exhaustive
    }
  }
}

function explanationForLane(lane: GeneratedPlanDecisionDebtCompressionLane): string {
  switch (lane) {
    case 'short_session_cooldown_minimum':
      return 'Wrap under-min groups are likely cooldown policy questions before they are catalog gaps.'
    case 'technique_under_min_review':
      return 'Technique under-min groups need human review before source-backed content or block-split work.'
    case 'workload_envelope_review':
      return 'Over/under envelope pressure is a workload-policy question before catalog edits.'
    case 'coverage_gap_review':
      return 'Dropped slots and under-named-profile sessions are catalog-coverage signals under the v8 honest-duration contract.'
    case 'source_backed_content_depth_candidate':
      return 'Repeated focus-controlled or source-backed cells may need authored drill depth rather than generator policy.'
    case 'low_volume_watchlist':
      return 'Small groups can stay visible without forcing a premature fix.'
    case 'unknown_unclassified':
      return 'The diagnostic has no known compression lane yet.'
    default: {
      const _exhaustive: never = lane
      return _exhaustive
    }
  }
}

function candidateDispositionsForLane(lane: GeneratedPlanDecisionDebtCompressionLane): readonly string[] {
  switch (lane) {
    case 'short_session_cooldown_minimum':
      return ['accepted_policy_allowance', 'metadata_review_needed', 'block_shape_review_needed']
    case 'technique_under_min_review':
      return ['accepted_policy_allowance', 'metadata_review_needed', 'block_shape_review_needed', 'source_depth_candidate']
    case 'workload_envelope_review':
      return ['metadata_review_needed', 'block_shape_review_needed', 'no_implementation_action_yet']
    case 'coverage_gap_review':
      return ['catalog_gap_card_needed', 'accepted_short_session', 'no_implementation_action_yet']
    case 'source_backed_content_depth_candidate':
      return ['source_depth_gap_card_needed', 'watchlist_only']
    case 'low_volume_watchlist':
      return ['watchlist_only', 'no_implementation_action_yet']
    case 'unknown_unclassified':
      return ['triage_lane_needed']
    default: {
      const _exhaustive: never = lane
      return _exhaustive
    }
  }
}

export function isGeneratedPlanTriageStatus(value: unknown): value is GeneratedPlanTriageStatus {
  return value === 'observed' || value === 'routed' || value === 'resolved' || value === 'superseded'
}

export function isGeneratedPlanTriageRoute(value: unknown): value is GeneratedPlanTriageRoute {
  return (
    value === 'policy_allowance' ||
    value === 'variant_cap_review' ||
    value === 'block_split' ||
    value === 'source_backed_content_depth' ||
    value === 'generator_policy_investigation' ||
    value === 'defer'
  )
}

export function isGeneratedPlanEnforcementStatus(
  value: unknown,
): value is GeneratedPlanEnforcementStatus {
  return (
    value === 'observation_only' ||
    value === 'hard_fail_candidate' ||
    value === 'hard_fail_enforced'
  )
}

export function compressionLaneForGeneratedPlanTriageItem(
  group: Pick<GeneratedPlanObservationGroup, 'blockType' | 'observationCodes' | 'affectedCellCount'>,
): GeneratedPlanDecisionDebtCompressionLane {
  if (group.observationCodes.includes('slot_dropped')) return 'coverage_gap_review'
  if (group.observationCodes.includes('under_named_profile_duration')) return 'coverage_gap_review'
  if (group.observationCodes.includes('repeated_focus_controlled_family')) {
    return 'source_backed_content_depth_candidate'
  }
  if (group.observationCodes.includes('under_authored_min') && group.blockType === 'wrap') {
    return 'short_session_cooldown_minimum'
  }
  if (group.observationCodes.includes('under_authored_min') && group.blockType === 'technique') {
    return 'technique_under_min_review'
  }
  if (
    group.observationCodes.includes('over_authored_max') ||
    group.observationCodes.includes('over_fatigue_cap') ||
    group.observationCodes.includes('under_authored_min')
  ) {
    return group.affectedCellCount <= 2 ? 'low_volume_watchlist' : 'workload_envelope_review'
  }
  return 'unknown_unclassified'
}

export function buildInitialGeneratedPlanTriageRegistry(
  groups: readonly GeneratedPlanObservationGroup[],
): readonly GeneratedPlanTriageEntry[] {
  return groups.map((group) => {
    const lane = compressionLaneForGeneratedPlanTriageItem(group)
    return {
      groupKey: group.groupKey,
      diagnosticFingerprint: group.diagnosticFingerprint,
      triageStatus: 'observed',
      triageRoute: routeForLane(lane),
      reviewedReportId: GENERATED_PLAN_TRIAGE_REPORT_ID,
      enforcementStatus: 'observation_only',
      notes: `compressed_lane:${lane}`,
    }
  })
}

export function validateGeneratedPlanTriageCoverage(
  groups: readonly GeneratedPlanObservationGroup[],
  registry: readonly GeneratedPlanTriageEntry[],
): GeneratedPlanTriageValidation {
  const blockingIssues: GeneratedPlanTriageValidationIssue[] = []
  const warningIssues: GeneratedPlanTriageValidationIssue[] = []
  const seen = new Set<string>()

  for (const entry of registry) {
    if (seen.has(entry.groupKey)) {
      blockingIssues.push({
        code: 'duplicate_group_key',
        groupKey: entry.groupKey,
        message: `Duplicate registry entry for ${entry.groupKey}`,
      })
    }
    seen.add(entry.groupKey)
    const currentGroup = groups.find((group) => group.groupKey === entry.groupKey)
    if (!currentGroup) {
      warningIssues.push({
        code: 'superseded_group',
        groupKey: entry.groupKey,
        message: `Registry entry no longer has a generated observation group: ${entry.groupKey}`,
      })
    } else if (currentGroup.diagnosticFingerprint !== entry.diagnosticFingerprint) {
      warningIssues.push({
        code: 'stale_fingerprint',
        groupKey: entry.groupKey,
        message: `Registry entry has a stale diagnostic fingerprint: ${entry.groupKey}`,
      })
    }
    if (!isGeneratedPlanTriageStatus(entry.triageStatus)) {
      blockingIssues.push({
        code: 'invalid_registry_entry',
        groupKey: entry.groupKey,
        message: `Invalid triage status for ${entry.groupKey}`,
      })
    }
    if (!isGeneratedPlanTriageRoute(entry.triageRoute)) {
      blockingIssues.push({
        code: 'invalid_registry_entry',
        groupKey: entry.groupKey,
        message: `Invalid triage route for ${entry.groupKey}`,
      })
    }
  }

  for (const group of groups) {
    if (!seen.has(group.groupKey)) {
      blockingIssues.push({
        code: 'untriaged_group',
        groupKey: group.groupKey,
        message: `Generated observation group is missing a triage registry entry: ${group.groupKey}`,
      })
    }
  }

  return { blockingIssues, warningIssues }
}

export function conservativeRouteForGeneratedPlanGroup(
  group: GeneratedPlanObservationGroup,
): GeneratedPlanTriageRoute {
  return routeForLane(compressionLaneForGeneratedPlanTriageItem(group))
}

export function buildGeneratedPlanDecisionDebtPrompts(
  groups: readonly GeneratedPlanObservationGroup[],
  registry: readonly GeneratedPlanTriageEntry[],
): readonly GeneratedPlanDecisionDebtPrompt[] {
  const entriesByGroup = new Map(registry.map((entry) => [entry.groupKey, entry]))
  const groupsByLane = new Map<GeneratedPlanDecisionDebtCompressionLane, GeneratedPlanObservationGroup[]>()

  for (const group of groups) {
    const lane = compressionLaneForGeneratedPlanTriageItem(group)
    const laneGroups = groupsByLane.get(lane) ?? []
    laneGroups.push(group)
    groupsByLane.set(lane, laneGroups)
  }

  return [...groupsByLane.entries()].map(([lane, laneGroups]) => {
    const entries = laneGroups
      .map((group) => entriesByGroup.get(group.groupKey))
      .filter((entry): entry is GeneratedPlanTriageEntry => Boolean(entry))
    return {
      lane,
      label: labelForLane(lane),
      question: questionForLane(lane),
      explanation: explanationForLane(lane),
      affectedGroupCount: laneGroups.length,
      totalAffectedCellCount: affectedCellCount(laneGroups),
      redistributionAffectedCellCount: redistributionCellCount(laneGroups),
      nonRedistributionOverCapCellCount: nonRedistributionOverCapCellCount(laneGroups),
      routeCounts: routeCounts(entries),
      groupKeys: laneGroups.map((group) => group.groupKey),
      disposition: 'needs_human_decision',
      nextEvidenceNeeded: 'Review the current generated-plan diagnostics report and decide whether this lane needs follow-up work.',
      recommendedFollowUpUnit: lane === 'coverage_gap_review' ? 'coverage gap review' : 'workload envelope guidance',
      guideAnchor:
        lane === 'coverage_gap_review'
          ? 'docs/plans/2026-05-24-001-feat-session-duration-honesty-plan.md'
          : undefined,
      candidateDispositions: candidateDispositionsForLane(lane),
    }
  })
}

export function buildGeneratedPlanRedistributionCausalityReceipt(): GeneratedPlanRedistributionCausalityReceipt {
  return {
    comparisonMode: 'allocated_duration_counterfactual',
    runtimeBoundary:
      'retired_by_duration_honesty_v8: redistributedMinutes is no longer a runtime mechanism; see docs/plans/2026-05-24-001-feat-session-duration-honesty-plan.md',
    groupCount: 0,
    counts: zeroCounts(),
    groups: [],
  }
}

export function buildGeneratedPlanTriageWorkbenchMarkdown(
  groups: readonly GeneratedPlanObservationGroup[],
  registry: readonly GeneratedPlanTriageEntry[],
): string {
  const validation = validateGeneratedPlanTriageCoverage(groups, registry)
  const prompts = buildGeneratedPlanDecisionDebtPrompts(groups, registry)
  const routeSummary = routeCounts(registry)
  const lines: string[] = [
    '## Triage Summary',
    '',
    `- Current routeable groups: ${groups.length}`,
    `- Registry entries: ${registry.length}`,
    `- Blocking validation issues: ${validation.blockingIssues.length}`,
    `- Warning validation issues: ${validation.warningIssues.length}`,
    '',
    '## Route Counts',
    '',
  ]

  for (const count of routeSummary) lines.push(`- \`${count.route}\`: ${count.count}`)
  if (routeSummary.length === 0) lines.push('- None')

  lines.push('', '## Decision-Debt Compression', '')
  for (const prompt of prompts) {
    lines.push(
      `### ${prompt.label}`,
      '',
      `- Lane: \`${prompt.lane}\``,
      `- Question: ${prompt.question}`,
      `- Why this lane: ${prompt.explanation}`,
      `- Groups: ${prompt.affectedGroupCount}; total affected cells: ${prompt.totalAffectedCellCount}`,
      `- Redistribution-affected cells: ${prompt.redistributionAffectedCellCount}`,
      `- Non-redistribution over-cap cells: ${prompt.nonRedistributionOverCapCellCount}`,
      `- Route mix: ${prompt.routeCounts.map((count) => `\`${count.route}\` ${count.count}`).join(', ') || 'none'}`,
      `- Disposition: \`${prompt.disposition}\``,
      `- Candidate dispositions: ${prompt.candidateDispositions.map((value) => `\`${value}\``).join(', ')}`,
      `- Recommended follow-up: ${prompt.recommendedFollowUpUnit}`,
      ...(prompt.guideAnchor ? [`- Guide: \`${prompt.guideAnchor}\``] : []),
      `- Next evidence needed: ${prompt.nextEvidenceNeeded}`,
      `- Group keys: ${prompt.groupKeys.map((key) => `\`${key}\``).join(', ')}`,
      '',
    )
  }
  if (prompts.length === 0) lines.push('No routeable decision-debt prompts at this time.', '')

  lines.push('## Retired Rich Packet Chain', '')
  lines.push(
    'The D47/D05/D01/D49 packet builders that depended on legacy optional-slot redistribution fingerprints were retired by the CC1 bundle. Use the generated diagnostics report plus the compression lanes above as the current D130 founder-mode surface.',
  )

  return lines.join('\n')
}

// Replaced-by stubs for rich packet/build/format functions retired by the
// 2026-05-25 CC1 bundle. Signatures remain discoverable by export name;
// callers receive a forward pointer to the surviving coverage-gap surface.
export function buildGeneratedPlanD47ProposalAdmissionTicket(..._args: readonly unknown[]): never {
  void _args
  throw new Error('replacedBy: coverage_gap_review since=2026-05-24; see docs/plans/2026-05-24-001-feat-session-duration-honesty-plan.md')
}

export function authorizationStatusForGeneratedPlanD47GapClosureState(..._args: readonly unknown[]): never {
  void _args
  throw new Error('replacedBy: coverage_gap_review since=2026-05-24; see docs/plans/2026-05-24-001-feat-session-duration-honesty-plan.md')
}

export function buildGeneratedPlanD47GapClosureLedger(..._args: readonly unknown[]): never {
  void _args
  throw new Error('replacedBy: coverage_gap_review since=2026-05-24; see docs/plans/2026-05-24-001-feat-session-duration-honesty-plan.md')
}

export function buildGeneratedPlanD01GapFillProposal(..._args: readonly unknown[]): never {
  void _args
  throw new Error('replacedBy: coverage_gap_review since=2026-05-24; see docs/plans/2026-05-24-001-feat-session-duration-honesty-plan.md')
}

export function buildGeneratedPlanD01WorkloadBlockShapeProposal(..._args: readonly unknown[]): never {
  void _args
  throw new Error('replacedBy: coverage_gap_review since=2026-05-24; see docs/plans/2026-05-24-001-feat-session-duration-honesty-plan.md')
}

export function buildGeneratedPlanD01BlockShapeFillReceipt(..._args: readonly unknown[]): never {
  void _args
  throw new Error('replacedBy: coverage_gap_review since=2026-05-24; see docs/plans/2026-05-24-001-feat-session-duration-honesty-plan.md')
}

export function buildGeneratedPlanD01CapCatalogForkPacket(..._args: readonly unknown[]): never {
  void _args
  throw new Error('replacedBy: coverage_gap_review since=2026-05-24; see docs/plans/2026-05-24-001-feat-session-duration-honesty-plan.md')
}

export function formatGeneratedPlanD01CapCatalogForkPacketMarkdown(..._args: readonly unknown[]): never {
  void _args
  throw new Error('replacedBy: coverage_gap_review since=2026-05-24; see docs/plans/2026-05-24-001-feat-session-duration-honesty-plan.md')
}

export function buildCurrentGeneratedPlanD47D05ComparatorEvaluationPayload(..._args: readonly unknown[]): never {
  void _args
  throw new Error('replacedBy: coverage_gap_review since=2026-05-24; see docs/plans/2026-05-24-001-feat-session-duration-honesty-plan.md')
}

export function evaluationsForGeneratedPlanD47D05ComparatorPayload(..._args: readonly unknown[]): never {
  void _args
  throw new Error('replacedBy: coverage_gap_review since=2026-05-24; see docs/plans/2026-05-24-001-feat-session-duration-honesty-plan.md')
}

export function formatGeneratedPlanD47D05ComparatorEvaluationPayloadMarkdown(..._args: readonly unknown[]): never {
  void _args
  throw new Error('replacedBy: coverage_gap_review since=2026-05-24; see docs/plans/2026-05-24-001-feat-session-duration-honesty-plan.md')
}

export function buildGeneratedPlanD47D05ComparatorDecisionPacket(..._args: readonly unknown[]): never {
  void _args
  throw new Error('replacedBy: coverage_gap_review since=2026-05-24; see docs/plans/2026-05-24-001-feat-session-duration-honesty-plan.md')
}

export function formatGeneratedPlanD47D05ComparatorDecisionPacketMarkdown(..._args: readonly unknown[]): never {
  void _args
  throw new Error('replacedBy: coverage_gap_review since=2026-05-24; see docs/plans/2026-05-24-001-feat-session-duration-honesty-plan.md')
}

export function buildGeneratedPlanGapClosureSelectionWorkbench(..._args: readonly unknown[]): never {
  void _args
  throw new Error('replacedBy: coverage_gap_review since=2026-05-24; see docs/plans/2026-05-24-001-feat-session-duration-honesty-plan.md')
}

export function formatGeneratedPlanGapClosureSelectionWorkbenchMarkdown(..._args: readonly unknown[]): never {
  void _args
  throw new Error('replacedBy: coverage_gap_review since=2026-05-24; see docs/plans/2026-05-24-001-feat-session-duration-honesty-plan.md')
}

export function buildGeneratedPlanD49ResidualFollowUpPacket(..._args: readonly unknown[]): never {
  void _args
  throw new Error('replacedBy: coverage_gap_review since=2026-05-24; see docs/plans/2026-05-24-001-feat-session-duration-honesty-plan.md')
}

export function formatGeneratedPlanD49ResidualFollowUpPacketMarkdown(..._args: readonly unknown[]): never {
  void _args
  throw new Error('replacedBy: coverage_gap_review since=2026-05-24; see docs/plans/2026-05-24-001-feat-session-duration-honesty-plan.md')
}

export function buildGeneratedPlanD49U8GeneratorPolicyProofPacket(..._args: readonly unknown[]): never {
  void _args
  throw new Error('replacedBy: coverage_gap_review since=2026-05-24; see docs/plans/2026-05-24-001-feat-session-duration-honesty-plan.md')
}

export function formatGeneratedPlanD49U8GeneratorPolicyProofPacketMarkdown(..._args: readonly unknown[]): never {
  void _args
  throw new Error('replacedBy: coverage_gap_review since=2026-05-24; see docs/plans/2026-05-24-001-feat-session-duration-honesty-plan.md')
}

export function buildGeneratedPlanD49GeneratorPolicyProposalPacket(..._args: readonly unknown[]): never {
  void _args
  throw new Error('replacedBy: coverage_gap_review since=2026-05-24; see docs/plans/2026-05-24-001-feat-session-duration-honesty-plan.md')
}

export function formatGeneratedPlanD49GeneratorPolicyProposalPacketMarkdown(..._args: readonly unknown[]): never {
  void _args
  throw new Error('replacedBy: coverage_gap_review since=2026-05-24; see docs/plans/2026-05-24-001-feat-session-duration-honesty-plan.md')
}
