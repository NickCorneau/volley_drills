import type {
  GeneratedPlanObservationCode,
  GeneratedPlanObservationAffectedCell,
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
  | 'generator_redistribution_investigation'
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

export type GeneratedPlanRedistributionCausalityComparisonMode =
  'allocated_duration_counterfactual'

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

export interface GeneratedPlanRedistributionCausalityCellReceipt
  extends GeneratedPlanRedistributionCausalityCounts {
  readonly state: GeneratedPlanRedistributionCausalityState
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

export type GeneratedPlanProposalAdmissionState =
  | 'evidence_gathering'
  | 'u6_preview_ready'
  | 'close_or_hold_without_preview'

export type GeneratedPlanProposalAdmissionMissingFact =
  | 'concrete_delta'
  | 'evidence_basis'
  | 'falsification_condition'
  | 'expected_diagnostic_movement'
  | 'product_or_training_quality_hypothesis'
  | 'no_action_threshold'

export type GeneratedPlanProposalAdmissionSourceEvidenceState =
  | 'present'
  | 'missing'
  | 'not_needed'

export interface GeneratedPlanD47ProposalAdmissionCandidate {
  readonly groupKey: string
  readonly diagnosticFingerprint?: string
  readonly drillId?: string
  readonly variantId?: string
  readonly blockType?: GeneratedPlanObservationGroup['blockType']
  readonly triageRoute?: GeneratedPlanTriageRoute
  readonly reviewedReportId?: string
}

export interface GeneratedPlanD47ProposalAdmissionReceiptFacts {
  readonly totalAffectedCellCount: number
  readonly pressureDisappearsCellCount: number
  readonly pressureRemainsCellCount: number
  readonly nonRedistributionPressureCellCount: number
  readonly comparisonInconclusiveCellCount: number
  readonly actionState?: GeneratedPlanRedistributionCausalityState
  readonly dominantCellState?: GeneratedPlanRedistributionDominantState
  readonly hasIncompleteEvidence: boolean
  readonly followUpRoutes: readonly GeneratedPlanRedistributionFollowUpRoute[]
}

export interface GeneratedPlanD47ProposalAdmissionNoChangePath {
  readonly admissionState: Extract<
    GeneratedPlanProposalAdmissionState,
    'close_or_hold_without_preview'
  >
  readonly requiresU6Preview: boolean
  readonly acceptanceEvidenceRequired: boolean
  readonly condition: string
}

export interface GeneratedPlanD47ProposalAdmissionTicket {
  readonly candidateFound: boolean
  readonly candidate: GeneratedPlanD47ProposalAdmissionCandidate
  readonly relatedCandidateGroupKeys: readonly string[]
  readonly admissionState: GeneratedPlanProposalAdmissionState
  readonly previewReady: boolean
  readonly sourceEvidenceState: GeneratedPlanProposalAdmissionSourceEvidenceState
  readonly sourceEvidenceRationale: string
  readonly missingProposalFacts: readonly GeneratedPlanProposalAdmissionMissingFact[]
  readonly receiptFacts: GeneratedPlanD47ProposalAdmissionReceiptFacts
  readonly workloadProposalTracks: readonly GeneratedPlanRedistributionFollowUpRoute[]
  readonly generatorPolicyTracks: readonly GeneratedPlanRedistributionFollowUpRoute[]
  readonly existingSurfaceDecision: string
  readonly counterfactualPolicyBoundary: string
  readonly d47AlternativeComparison: string
  readonly noChangePath: GeneratedPlanD47ProposalAdmissionNoChangePath
}

export type GeneratedPlanD47GapClosureGapType =
  | 'drill_inventory_gap'
  | 'programming_shape_gap'
  | 'workload_metadata_gap'
  | 'generator_policy_artifact'
  | 'no_real_gap'
  | 'undetermined'

export type GeneratedPlanD47GapClosureDecisionState =
  | 'evidence_gathering'
  | 'primary_fill_path_selected'
  | 'no_change_closed'
  | 'abandoned_for_better_candidate'
  | 'fill_planned'
  | 'fill_applied_reassessment_pending'
  | 'closed_validated'

export type GeneratedPlanD47GapClosureAuthorizationStatus =
  | 'not_authorized'
  | 'ready_for_planning'
  | 'authorized_for_fill_plan'
  | 'closed_without_fill'

export type GeneratedPlanD47GapClosureCurrentnessState =
  | 'current'
  | 'stale'
  | 'missing_or_shifted'

export type GeneratedPlanD47GapClosureSegmentLabel =
  | 'pressure_disappears'
  | 'pressure_remains'
  | 'non_redistribution_pressure'

export type GeneratedPlanD47GapClosureComparatorKind =
  | 'receipt_candidate'
  | 'no_change_baseline'

export type GeneratedPlanD47GapClosureReassessmentResult =
  | 'not_started'
  | 'validated'
  | 'partially_validated'
  | 'regressed'
  | 'inconclusive'

export interface GeneratedPlanD47GapClosureSegmentDisposition {
  readonly segment: GeneratedPlanD47GapClosureSegmentLabel
  readonly cellCount: number
  readonly gapType: GeneratedPlanD47GapClosureGapType
  readonly decisionState: GeneratedPlanD47GapClosureDecisionState
  readonly authorizationStatus: GeneratedPlanD47GapClosureAuthorizationStatus
  readonly disposition: string
  readonly expectedDiagnosticMovement: string
  readonly expectedTrainingQualityMovement: string
}

export interface GeneratedPlanD47GapClosureNextArtifact {
  readonly artifactType: 'comparator_receipt'
  readonly owner: 'maintainer'
  readonly evidenceSource: string
  readonly promotionCriteria: string
  readonly abandonCriteria: string
  readonly noChangeCriteria: string
}

export type GeneratedPlanD47GapClosureComparatorReceipt =
  | {
      readonly comparatorKind: Extract<
        GeneratedPlanD47GapClosureComparatorKind,
        'receipt_candidate'
      >
      readonly groupKey: string
      readonly drillId?: string
      readonly variantId?: string
      readonly rationale: string
      readonly simplerThanD47: boolean
      readonly higherConfidenceThanD47: boolean
      readonly receiptFacts: GeneratedPlanD47ProposalAdmissionReceiptFacts
    }
  | {
      readonly comparatorKind: Extract<
        GeneratedPlanD47GapClosureComparatorKind,
        'no_change_baseline'
      >
      readonly rationale: string
      readonly simplerThanD47: false
      readonly higherConfidenceThanD47: false
    }

export interface GeneratedPlanD47GapClosureLedger {
  readonly candidateFound: boolean
  readonly candidate: GeneratedPlanD47ProposalAdmissionCandidate
  readonly relatedCandidateGroupKeys: readonly string[]
  readonly currentnessState: GeneratedPlanD47GapClosureCurrentnessState
  readonly gapType: GeneratedPlanD47GapClosureGapType
  readonly decisionState: GeneratedPlanD47GapClosureDecisionState
  readonly authorizationStatus: GeneratedPlanD47GapClosureAuthorizationStatus
  readonly suspectedTrainingGap: string
  readonly receiptFacts: GeneratedPlanD47ProposalAdmissionReceiptFacts
  readonly segmentDispositions: readonly GeneratedPlanD47GapClosureSegmentDisposition[]
  readonly comparatorReceipt: GeneratedPlanD47GapClosureComparatorReceipt
  readonly nextArtifact: GeneratedPlanD47GapClosureNextArtifact
  readonly sourceProvenance: string
  readonly sourceDeltaBoundary: string
  readonly noChangeClosureBurden: string
  readonly reassessmentResult: GeneratedPlanD47GapClosureReassessmentResult
  readonly reassessmentBoundary: string
}

export type GeneratedPlanD01GapFillD47Relationship =
  | 'd47_held_behind_d01'
  | 'd47_missing_or_shifted'
  | 'd47_stale'

export type GeneratedPlanD01GapFillNextArtifactType = 'workload_block_shape_proposal'

export interface GeneratedPlanD01GapFillNextArtifact {
  readonly artifactType: GeneratedPlanD01GapFillNextArtifactType
  readonly owner: 'maintainer'
  readonly evidenceSource: string
  readonly promotionCriteria: string
  readonly abandonCriteria: string
  readonly noChangeCriteria: string
}

export interface GeneratedPlanD01GapFillProposal {
  readonly candidateFound: boolean
  readonly candidate: GeneratedPlanD47ProposalAdmissionCandidate
  readonly currentnessState: GeneratedPlanD47GapClosureCurrentnessState
  readonly d47Relationship: GeneratedPlanD01GapFillD47Relationship
  readonly gapType: Extract<
    GeneratedPlanD47GapClosureGapType,
    'programming_shape_gap' | 'workload_metadata_gap'
  >
  readonly decisionState: Extract<GeneratedPlanD47GapClosureDecisionState, 'evidence_gathering'>
  readonly authorizationStatus: Extract<
    GeneratedPlanD47GapClosureAuthorizationStatus,
    'not_authorized'
  >
  readonly suspectedTrainingGap: string
  readonly receiptFacts: GeneratedPlanD47ProposalAdmissionReceiptFacts
  readonly primaryClosurePath: 'combined_workload_block_shape_review'
  readonly targetSurface: string
  readonly blockedSourceBackedContentPath: string
  readonly blockedGeneratorPolicyPath: string
  readonly nextArtifact: GeneratedPlanD01GapFillNextArtifact
  readonly expectedDiagnosticMovement: string
  readonly expectedTrainingQualityMovement: string
  readonly reassessmentResult: GeneratedPlanD47GapClosureReassessmentResult
  readonly reassessmentBoundary: string
}

export interface GeneratedPlanTriageEntry {
  readonly groupKey: string
  readonly diagnosticFingerprint: string
  readonly triageStatus: GeneratedPlanTriageStatus
  readonly route: GeneratedPlanTriageRoute
  readonly enforcementStatus: GeneratedPlanEnforcementStatus
  readonly rationale: string
  readonly owner: string
  readonly reviewedReportId: string
  readonly affectedCellCount: number
  readonly likelyFixPaths: readonly string[]
  readonly evidence: readonly string[]
}

export interface GeneratedPlanTriageIssue {
  readonly code: GeneratedPlanTriageIssueCode
  readonly groupKey: string
  readonly severity: 'blocking' | 'warning'
  readonly message: string
}

export interface GeneratedPlanTriageValidation {
  readonly issues: readonly GeneratedPlanTriageIssue[]
  readonly blockingIssues: readonly GeneratedPlanTriageIssue[]
  readonly warningIssues: readonly GeneratedPlanTriageIssue[]
}

export const GENERATED_PLAN_TRIAGE_REPORT_ID = 'generated-plan-diagnostics-report-2026-05-01'

const TRIAGE_STATUSES: readonly GeneratedPlanTriageStatus[] = [
  'observed',
  'routed',
  'resolved',
  'superseded',
]

const TRIAGE_ROUTES: readonly GeneratedPlanTriageRoute[] = [
  'policy_allowance',
  'variant_cap_review',
  'block_split',
  'source_backed_content_depth',
  'generator_policy_investigation',
  'defer',
]

const ENFORCEMENT_STATUSES: readonly GeneratedPlanEnforcementStatus[] = [
  'observation_only',
  'hard_fail_candidate',
  'hard_fail_enforced',
]

const LOW_VOLUME_WATCHLIST_MAX_AFFECTED_CELLS = 3
const WORKLOAD_ENVELOPE_GUIDE_PATH = 'docs/ops/workload-envelope-authoring-guide.md'
const REDISTRIBUTION_CAUSALITY_COMPARISON_MODE: GeneratedPlanRedistributionCausalityComparisonMode =
  'allocated_duration_counterfactual'
const REDISTRIBUTION_CAUSALITY_RUNTIME_BOUNDARY =
  'Diagnostic-only receipt; shipped buildDraft() behavior is unchanged.'
const D47_PROPOSAL_ADMISSION_GROUP_KEY =
  'gpdg:v1:d47:d47-solo-open:main_skill:true:optional_slot_redistribution+over_authored_max+over_fatigue_cap'
const D01_GAP_FILL_PROPOSAL_GROUP_KEY =
  'gpdg:v1:d01:d01-solo:main_skill:true:optional_slot_redistribution+over_authored_max+over_fatigue_cap'
const D47_PROPOSAL_ADMISSION_MISSING_FACTS: readonly GeneratedPlanProposalAdmissionMissingFact[] = [
  'concrete_delta',
  'evidence_basis',
  'falsification_condition',
  'expected_diagnostic_movement',
  'product_or_training_quality_hypothesis',
  'no_action_threshold',
]
const D47_WORKLOAD_PROPOSAL_TRACKS: readonly GeneratedPlanRedistributionFollowUpRoute[] = [
  'workload_review',
  'block_shape_review',
  'source_backed_proposal_work',
  'u6_proposal_admission_candidate',
]
const D47_GENERATOR_POLICY_TRACKS: readonly GeneratedPlanRedistributionFollowUpRoute[] = [
  'future_generator_policy_decision',
]
const D47_GAP_CLOSURE_SOURCE_PROVENANCE =
  'Existing D47 provenance: FIVB Drill-book 4.7 Four Great Sets, activated in focus-readiness batch 3.'
const D47_GAP_CLOSURE_SOURCE_DELTA_BOUNDARY =
  'A drill-inventory gap must name content depth beyond the existing FIVB 4.7 activation before catalog work.'
const D47_GAP_CLOSURE_SUSPECTED_TRAINING_GAP =
  'D47 may be carrying too much advanced setting and movement work inside one main-skill block, but the current evidence must be compared against a simpler candidate before D47 becomes the fill target.'
const D01_GAP_FILL_SUSPECTED_TRAINING_GAP =
  'D01 may be a short beginner passing drill being asked to occupy too much main-skill time; the first fill proposal should decide whether to widen workload metadata, split/repeat the block shape, or accept the pressure by policy.'
const D01_GAP_FILL_TARGET_SURFACE =
  '`d01-solo` workload envelope (`durationMaxMinutes: 5`, `fatigueCap.maxMinutes: 5`) and generated main-skill block shape.'

const COMPRESSION_LANE_ORDER: readonly GeneratedPlanDecisionDebtCompressionLane[] = [
  'short_session_cooldown_minimum',
  'technique_under_min_review',
  'workload_envelope_review',
  'generator_redistribution_investigation',
  'source_backed_content_depth_candidate',
  'low_volume_watchlist',
  'unknown_unclassified',
]

const COMPRESSION_LANE_DETAILS: Record<
  GeneratedPlanDecisionDebtCompressionLane,
  Pick<
    GeneratedPlanDecisionDebtPrompt,
    | 'label'
    | 'question'
    | 'explanation'
    | 'disposition'
    | 'nextEvidenceNeeded'
    | 'recommendedFollowUpUnit'
    | 'guideAnchor'
    | 'candidateDispositions'
  >
> = {
  short_session_cooldown_minimum: {
    label: 'Short-session cooldown minimum',
    question: 'Is the short wrap envelope acceptable, or does this need cap/block/content follow-up?',
    explanation: 'Wrap under-min groups are likely cooldown policy questions before they are catalog gaps.',
    disposition: 'needs_human_decision',
    nextEvidenceNeeded: 'Review cooldown minimum policy and decide whether U7 workload guidance should encode it.',
    recommendedFollowUpUnit: 'U7 workload envelope guidance',
    guideAnchor: 'short-session-cooldown-minimum',
    candidateDispositions: [
      'accepted_policy_allowance',
      'metadata_review_needed',
      'block_shape_review_needed',
    ],
  },
  technique_under_min_review: {
    label: 'Technique under-min review',
    question: 'Are technique slots intentionally below authored minimums, or should catalog depth/block shape change?',
    explanation: 'Technique under-min groups need human review before source-backed content or block-split work.',
    disposition: 'needs_human_decision',
    nextEvidenceNeeded: 'Review whether these technique slots are acceptable short-form drills or content-depth candidates.',
    recommendedFollowUpUnit: 'U7 workload envelope guidance',
    guideAnchor: 'technique-under-min-review',
    candidateDispositions: [
      'accepted_policy_allowance',
      'metadata_review_needed',
      'block_shape_review_needed',
      'source_depth_candidate',
    ],
  },
  workload_envelope_review: {
    label: 'Workload envelope review',
    question: 'Are duration and fatigue envelopes correct for these generated allocations?',
    explanation: 'Over/under envelope pressure is a workload-policy question before catalog edits.',
    disposition: 'needs_human_decision',
    nextEvidenceNeeded: 'Review cap policy and block split thresholds for the affected main-skill groups.',
    recommendedFollowUpUnit: 'U7 workload envelope guidance',
    guideAnchor: 'workload-envelope-review',
    candidateDispositions: [
      'metadata_review_needed',
      'block_shape_review_needed',
      'requires_U6_preview',
      'no_implementation_action_yet',
    ],
  },
  generator_redistribution_investigation: {
    label: 'Generator redistribution investigation',
    question: 'Would these over-cap groups still exist without optional-slot redistribution?',
    explanation: 'Redistribution evidence means generator policy should be investigated before catalog changes.',
    disposition: 'needs_human_decision',
    nextEvidenceNeeded: 'Compare redistribution-affected cells against non-redistribution over-cap cells.',
    recommendedFollowUpUnit: 'U8 redistribution comparison',
    candidateDispositions: ['route_to_U8'],
  },
  source_backed_content_depth_candidate: {
    label: 'Source-backed content-depth candidate',
    question: 'Is there enough evidence to write a source-backed gap card?',
    explanation: 'Content-depth candidates require source-backed evidence before catalog activation.',
    disposition: 'needs_human_decision',
    nextEvidenceNeeded: 'Attach a gap card, source reference, activation path, or explicit no-action decision.',
    recommendedFollowUpUnit: 'Pause until a concrete gap card exists',
    candidateDispositions: ['source_depth_candidate'],
  },
  low_volume_watchlist: {
    label: 'Low-volume watchlist',
    question: 'Should these small groups stay watched without implementation action?',
    explanation: 'Low-volume groups with no stronger lane match should not drive immediate catalog or generator work.',
    disposition: 'no_implementation_action_yet',
    nextEvidenceNeeded: 'Revisit only if the affected-cell count grows or the pattern repeats in a stronger lane.',
    recommendedFollowUpUnit: 'Pause',
    candidateDispositions: ['no_implementation_action_yet'],
  },
  unknown_unclassified: {
    label: 'Unknown or unclassified',
    question: 'What decision lane should this unexpected pattern use?',
    explanation: 'Unknown patterns must stay visible instead of disappearing into the watchlist.',
    disposition: 'needs_human_decision',
    nextEvidenceNeeded: 'Classify the pattern or add an explicit compression lane before proceeding.',
    recommendedFollowUpUnit: 'Pause',
    candidateDispositions: ['no_implementation_action_yet'],
  },
}

export const GENERATED_PLAN_TRIAGE_REGISTRY: readonly GeneratedPlanTriageEntry[] = []

export function isGeneratedPlanTriageStatus(value: unknown): value is GeneratedPlanTriageStatus {
  return typeof value === 'string' && (TRIAGE_STATUSES as readonly string[]).includes(value)
}

export function isGeneratedPlanTriageRoute(value: unknown): value is GeneratedPlanTriageRoute {
  return typeof value === 'string' && (TRIAGE_ROUTES as readonly string[]).includes(value)
}

export function isGeneratedPlanEnforcementStatus(
  value: unknown,
): value is GeneratedPlanEnforcementStatus {
  return typeof value === 'string' && (ENFORCEMENT_STATUSES as readonly string[]).includes(value)
}

function hasText(value: string): boolean {
  return value.trim().length > 0
}

function entryMissingRequiredField(entry: GeneratedPlanTriageEntry): boolean {
  return (
    !hasText(entry.groupKey) ||
    !hasText(entry.diagnosticFingerprint) ||
    !hasText(entry.rationale) ||
    !hasText(entry.owner) ||
    !hasText(entry.reviewedReportId) ||
    entry.affectedCellCount <= 0 ||
    entry.likelyFixPaths.length === 0
  )
}

function entryHasInvalidRuntimeShape(entry: GeneratedPlanTriageEntry): boolean {
  return (
    !isGeneratedPlanTriageStatus(entry.triageStatus) ||
    !isGeneratedPlanTriageRoute(entry.route) ||
    !isGeneratedPlanEnforcementStatus(entry.enforcementStatus) ||
    !Array.isArray(entry.likelyFixPaths) ||
    !Array.isArray(entry.evidence)
  )
}

function triageIssue(
  code: GeneratedPlanTriageIssueCode,
  groupKey: string,
  severity: 'blocking' | 'warning',
  message: string,
): GeneratedPlanTriageIssue {
  return { code, groupKey, severity, message }
}

function groupHasObservationCode(
  group: GeneratedPlanObservationGroup,
  code: GeneratedPlanObservationCode,
): boolean {
  return group.observationCodes.includes(code)
}

function affectedCellHasObservationCode(
  cell: GeneratedPlanObservationGroup['affectedCells'][number],
  code: GeneratedPlanObservationCode,
): boolean {
  return cell.observationCodes.includes(code)
}

function hasOverCapPressure(group: GeneratedPlanObservationGroup): boolean {
  return (
    groupHasObservationCode(group, 'over_authored_max') ||
    groupHasObservationCode(group, 'over_fatigue_cap')
  )
}

export function compressionLaneForGeneratedPlanTriageItem(
  group: GeneratedPlanObservationGroup,
  entry: GeneratedPlanTriageEntry,
): GeneratedPlanDecisionDebtCompressionLane {
  if (
    group.blockType === 'wrap' &&
    groupHasObservationCode(group, 'under_authored_min')
  ) {
    return 'short_session_cooldown_minimum'
  }

  if (groupHasObservationCode(group, 'optional_slot_redistribution')) {
    return 'generator_redistribution_investigation'
  }

  if (entry.route === 'source_backed_content_depth') {
    return 'source_backed_content_depth_candidate'
  }

  if (hasOverCapPressure(group)) {
    return 'workload_envelope_review'
  }

  if (
    group.blockType === 'technique' &&
    groupHasObservationCode(group, 'under_authored_min')
  ) {
    return 'technique_under_min_review'
  }

  if (group.blockType === 'main_skill' && groupHasObservationCode(group, 'under_authored_min')) {
    return 'workload_envelope_review'
  }

  if (group.affectedCellCount <= LOW_VOLUME_WATCHLIST_MAX_AFFECTED_CELLS) {
    return 'low_volume_watchlist'
  }

  return 'unknown_unclassified'
}

function redistributionAffectedCellCount(group: GeneratedPlanObservationGroup): number {
  return group.affectedCells.filter(
    (cell) =>
      cell.redistribution !== undefined ||
      affectedCellHasObservationCode(cell, 'optional_slot_redistribution'),
  ).length
}

function nonRedistributionOverCapCellCount(group: GeneratedPlanObservationGroup): number {
  return group.affectedCells.filter(
    (cell) =>
      cell.redistribution === undefined &&
      !affectedCellHasObservationCode(cell, 'optional_slot_redistribution') &&
      (affectedCellHasObservationCode(cell, 'over_authored_max') ||
        affectedCellHasObservationCode(cell, 'over_fatigue_cap')),
  ).length
}

function emptyRedistributionCausalityCounts(): GeneratedPlanRedistributionCausalityCounts {
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

function addRedistributionCausalityCounts(
  left: GeneratedPlanRedistributionCausalityCounts,
  right: GeneratedPlanRedistributionCausalityCounts,
): GeneratedPlanRedistributionCausalityCounts {
  return {
    totalAffectedCellCount: left.totalAffectedCellCount + right.totalAffectedCellCount,
    redistributionAffectedCellCount:
      left.redistributionAffectedCellCount + right.redistributionAffectedCellCount,
    currentOverAuthoredMaxCellCount:
      left.currentOverAuthoredMaxCellCount + right.currentOverAuthoredMaxCellCount,
    currentOverFatigueCapCellCount:
      left.currentOverFatigueCapCellCount + right.currentOverFatigueCapCellCount,
    currentUnderAuthoredMinCellCount:
      left.currentUnderAuthoredMinCellCount + right.currentUnderAuthoredMinCellCount,
    allocatedOverAuthoredMaxCellCount:
      left.allocatedOverAuthoredMaxCellCount + right.allocatedOverAuthoredMaxCellCount,
    allocatedOverFatigueCapCellCount:
      left.allocatedOverFatigueCapCellCount + right.allocatedOverFatigueCapCellCount,
    allocatedUnderAuthoredMinCellCount:
      left.allocatedUnderAuthoredMinCellCount + right.allocatedUnderAuthoredMinCellCount,
    nonRedistributionOverCapCellCount:
      left.nonRedistributionOverCapCellCount + right.nonRedistributionOverCapCellCount,
    nonRedistributionUnderMinCellCount:
      left.nonRedistributionUnderMinCellCount + right.nonRedistributionUnderMinCellCount,
    pressureDisappearsCellCount:
      left.pressureDisappearsCellCount + right.pressureDisappearsCellCount,
    pressureRemainsCellCount: left.pressureRemainsCellCount + right.pressureRemainsCellCount,
    comparisonInconclusiveCellCount:
      left.comparisonInconclusiveCellCount + right.comparisonInconclusiveCellCount,
    redistributionWithoutPressureCellCount:
      left.redistributionWithoutPressureCellCount + right.redistributionWithoutPressureCellCount,
    counterfactualUnfilledMinutes:
      left.counterfactualUnfilledMinutes + right.counterfactualUnfilledMinutes,
  }
}

function redistributionCausalityStateCount(
  counts: GeneratedPlanRedistributionCausalityCounts,
  state: GeneratedPlanRedistributionCausalityState,
): number {
  switch (state) {
    case 'likely_redistribution_caused':
      return counts.pressureDisappearsCellCount
    case 'pressure_remains_without_redistribution':
      return counts.pressureRemainsCellCount
    case 'comparison_inconclusive':
      return counts.comparisonInconclusiveCellCount
    case 'redistribution_without_pressure':
      return counts.redistributionWithoutPressureCellCount
    default: {
      const exhaustive: never = state
      return exhaustive
    }
  }
}

function dominantRedistributionCausalityState(
  counts: GeneratedPlanRedistributionCausalityCounts,
): GeneratedPlanRedistributionDominantState {
  const states: readonly GeneratedPlanRedistributionCausalityState[] = [
    'likely_redistribution_caused',
    'pressure_remains_without_redistribution',
    'redistribution_without_pressure',
    'comparison_inconclusive',
  ]
  const rankedStates = states
    .map((state) => ({ state, count: redistributionCausalityStateCount(counts, state) }))
    .sort((a, b) => b.count - a.count)
  const [first, second] = rankedStates
  if (!first || first.count === 0) return 'comparison_inconclusive'
  if (second && first.count === second.count) return 'mixed_cell_states'
  return first.state
}

function groupRedistributionCausalityActionState(
  counts: GeneratedPlanRedistributionCausalityCounts,
): GeneratedPlanRedistributionCausalityState {
  const interpretableCellCount =
    counts.totalAffectedCellCount - counts.comparisonInconclusiveCellCount
  if (interpretableCellCount <= 0) return 'comparison_inconclusive'
  if (counts.pressureRemainsCellCount > 0) return 'pressure_remains_without_redistribution'
  if (counts.pressureDisappearsCellCount > 0) return 'likely_redistribution_caused'
  if (counts.redistributionWithoutPressureCellCount > 0) return 'redistribution_without_pressure'
  return 'comparison_inconclusive'
}

function followUpRoutesForRedistributionCausalityState(
  state: GeneratedPlanRedistributionCausalityState,
): readonly GeneratedPlanRedistributionFollowUpRoute[] {
  switch (state) {
    case 'likely_redistribution_caused':
      return ['future_generator_policy_decision']
    case 'pressure_remains_without_redistribution':
      return [
        'workload_review',
        'block_shape_review',
        'source_backed_proposal_work',
        'u6_proposal_admission_candidate',
      ]
    case 'comparison_inconclusive':
      return ['comparison_support_needed']
    case 'redistribution_without_pressure':
      return ['no_implementation_action_yet']
    default: {
      const exhaustive: never = state
      return exhaustive
    }
  }
}

function followUpRoutesForRedistributionCausalityCounts(
  counts: GeneratedPlanRedistributionCausalityCounts,
  actionState: GeneratedPlanRedistributionCausalityState,
): readonly GeneratedPlanRedistributionFollowUpRoute[] {
  const routes = new Set(followUpRoutesForRedistributionCausalityState(actionState))
  if (counts.pressureDisappearsCellCount > 0) routes.add('future_generator_policy_decision')
  if (counts.comparisonInconclusiveCellCount > 0) routes.add('comparison_support_needed')
  return [...routes]
}

function classifyRedistributionCausalityCell(
  group: GeneratedPlanObservationGroup,
  cell: GeneratedPlanObservationAffectedCell,
): GeneratedPlanRedistributionCausalityCellReceipt {
  const hasRedistributionEvidence =
    cell.redistribution !== undefined ||
    affectedCellHasObservationCode(cell, 'optional_slot_redistribution')
  const baseCounts: GeneratedPlanRedistributionCausalityCounts = {
    ...emptyRedistributionCausalityCounts(),
    totalAffectedCellCount: 1,
    redistributionAffectedCellCount: hasRedistributionEvidence ? 1 : 0,
    counterfactualUnfilledMinutes: cell.redistribution?.redistributedMinutes ?? 0,
  }

  if (!group.drillId || !group.variantId) {
    return {
      ...baseCounts,
      comparisonInconclusiveCellCount: 1,
      state: 'comparison_inconclusive',
    }
  }

  if (cell.plannedMinutes === undefined || cell.allocatedMinutes === undefined) {
    return {
      ...baseCounts,
      comparisonInconclusiveCellCount: 1,
      state: 'comparison_inconclusive',
    }
  }

  const authoredMinMinutes = cell.authoredMinMinutes ?? group.authoredMinMinutes
  const authoredMaxMinutes = cell.authoredMaxMinutes ?? group.authoredMaxMinutes
  const fatigueMaxMinutes = cell.fatigueMaxMinutes ?? group.fatigueMaxMinutes

  if (authoredMinMinutes === undefined || authoredMaxMinutes === undefined) {
    return {
      ...baseCounts,
      comparisonInconclusiveCellCount: 1,
      state: 'comparison_inconclusive',
    }
  }

  if (affectedCellHasObservationCode(cell, 'over_fatigue_cap') && fatigueMaxMinutes === undefined) {
    return {
      ...baseCounts,
      comparisonInconclusiveCellCount: 1,
      state: 'comparison_inconclusive',
    }
  }

  const currentOverAuthoredMax = cell.plannedMinutes > authoredMaxMinutes
  const currentOverFatigueCap =
    fatigueMaxMinutes !== undefined && cell.plannedMinutes > fatigueMaxMinutes
  const currentUnderAuthoredMin = cell.plannedMinutes < authoredMinMinutes
  const allocatedOverAuthoredMax = cell.allocatedMinutes > authoredMaxMinutes
  const allocatedOverFatigueCap =
    fatigueMaxMinutes !== undefined && cell.allocatedMinutes > fatigueMaxMinutes
  const allocatedUnderAuthoredMin = cell.allocatedMinutes < authoredMinMinutes

  const pressureCounts: GeneratedPlanRedistributionCausalityCounts = {
    ...baseCounts,
    currentOverAuthoredMaxCellCount: currentOverAuthoredMax ? 1 : 0,
    currentOverFatigueCapCellCount: currentOverFatigueCap ? 1 : 0,
    currentUnderAuthoredMinCellCount: currentUnderAuthoredMin ? 1 : 0,
    allocatedOverAuthoredMaxCellCount: allocatedOverAuthoredMax ? 1 : 0,
    allocatedOverFatigueCapCellCount: allocatedOverFatigueCap ? 1 : 0,
    allocatedUnderAuthoredMinCellCount: allocatedUnderAuthoredMin ? 1 : 0,
    nonRedistributionOverCapCellCount:
      !hasRedistributionEvidence && (currentOverAuthoredMax || currentOverFatigueCap) ? 1 : 0,
    nonRedistributionUnderMinCellCount:
      !hasRedistributionEvidence && currentUnderAuthoredMin ? 1 : 0,
  }

  const hasCurrentPressure =
    currentOverAuthoredMax || currentOverFatigueCap || currentUnderAuthoredMin
  const hasAllocatedPressure =
    allocatedOverAuthoredMax || allocatedOverFatigueCap || allocatedUnderAuthoredMin

  if (hasCurrentPressure && hasAllocatedPressure) {
    return {
      ...pressureCounts,
      pressureRemainsCellCount: 1,
      state: 'pressure_remains_without_redistribution',
    }
  }

  if (hasCurrentPressure) {
    return {
      ...pressureCounts,
      pressureDisappearsCellCount: 1,
      state: 'likely_redistribution_caused',
    }
  }

  if (hasRedistributionEvidence) {
    return {
      ...pressureCounts,
      redistributionWithoutPressureCellCount: 1,
      state: 'redistribution_without_pressure',
    }
  }

  return {
    ...pressureCounts,
    comparisonInconclusiveCellCount: 1,
    state: 'comparison_inconclusive',
  }
}

function buildRedistributionCausalityGroupReceipt(
  group: GeneratedPlanObservationGroup,
  entry: GeneratedPlanTriageEntry,
): GeneratedPlanRedistributionCausalityGroupReceipt {
  const counts = group.affectedCells
    .map((cell) => classifyRedistributionCausalityCell(group, cell))
    .reduce(addRedistributionCausalityCounts, emptyRedistributionCausalityCounts())
  const actionState = groupRedistributionCausalityActionState(counts)

  return {
    groupKey: group.groupKey,
    diagnosticFingerprint: group.diagnosticFingerprint,
    triageStatus: entry.triageStatus,
    triageRoute: entry.route,
    reviewedReportId: entry.reviewedReportId,
    drillId: group.drillId,
    variantId: group.variantId,
    blockType: group.blockType,
    observationCodes: group.observationCodes,
    actionState,
    dominantCellState: dominantRedistributionCausalityState(counts),
    hasIncompleteEvidence: counts.comparisonInconclusiveCellCount > 0,
    followUpRoutes: followUpRoutesForRedistributionCausalityCounts(counts, actionState),
    counts,
  }
}

export function buildGeneratedPlanRedistributionCausalityReceipt(
  groups: readonly GeneratedPlanObservationGroup[],
  registry: readonly GeneratedPlanTriageEntry[],
): GeneratedPlanRedistributionCausalityReceipt {
  const entriesByKey = new Map(registry.map((entry) => [entry.groupKey, entry] as const))
  const receiptGroups = groups
    .map((group) => ({ group, entry: entriesByKey.get(group.groupKey) }))
    .filter(
      (item): item is { group: GeneratedPlanObservationGroup; entry: GeneratedPlanTriageEntry } => {
        const { entry } = item
        return (
          entry !== undefined &&
          compressionLaneForGeneratedPlanTriageItem(item.group, entry) ===
            'generator_redistribution_investigation' &&
          entry.triageStatus !== 'resolved' &&
          entry.triageStatus !== 'superseded'
        )
      },
    )
    .map(({ group, entry }) => buildRedistributionCausalityGroupReceipt(group, entry))

  return {
    comparisonMode: REDISTRIBUTION_CAUSALITY_COMPARISON_MODE,
    runtimeBoundary: REDISTRIBUTION_CAUSALITY_RUNTIME_BOUNDARY,
    groupCount: receiptGroups.length,
    counts: receiptGroups
      .map((group) => group.counts)
      .reduce(addRedistributionCausalityCounts, emptyRedistributionCausalityCounts()),
    groups: receiptGroups,
  }
}

function buildD47ProposalAdmissionReceiptFacts(
  group: GeneratedPlanRedistributionCausalityGroupReceipt | undefined,
): GeneratedPlanD47ProposalAdmissionReceiptFacts {
  if (!group) {
    return {
      totalAffectedCellCount: 0,
      pressureDisappearsCellCount: 0,
      pressureRemainsCellCount: 0,
      nonRedistributionPressureCellCount: 0,
      comparisonInconclusiveCellCount: 0,
      hasIncompleteEvidence: true,
      followUpRoutes: [],
    }
  }

  return {
    totalAffectedCellCount: group.counts.totalAffectedCellCount,
    pressureDisappearsCellCount: group.counts.pressureDisappearsCellCount,
    pressureRemainsCellCount: group.counts.pressureRemainsCellCount,
    nonRedistributionPressureCellCount:
      group.counts.nonRedistributionOverCapCellCount +
      group.counts.nonRedistributionUnderMinCellCount,
    comparisonInconclusiveCellCount: group.counts.comparisonInconclusiveCellCount,
    actionState: group.actionState,
    dominantCellState: group.dominantCellState,
    hasIncompleteEvidence: group.hasIncompleteEvidence,
    followUpRoutes: group.followUpRoutes,
  }
}

export function buildGeneratedPlanD47ProposalAdmissionTicket(
  groups: readonly GeneratedPlanObservationGroup[],
  registry: readonly GeneratedPlanTriageEntry[],
): GeneratedPlanD47ProposalAdmissionTicket {
  const receipt = buildGeneratedPlanRedistributionCausalityReceipt(groups, registry)
  const group = receipt.groups.find((candidate) => candidate.groupKey === D47_PROPOSAL_ADMISSION_GROUP_KEY)
  const relatedCandidateGroupKeys = receipt.groups
    .filter(
      (candidate) =>
        candidate.groupKey !== D47_PROPOSAL_ADMISSION_GROUP_KEY &&
        candidate.drillId === 'd47' &&
        candidate.variantId === 'd47-solo-open',
    )
    .map((candidate) => candidate.groupKey)

  return {
    candidateFound: group !== undefined,
    candidate: {
      groupKey: D47_PROPOSAL_ADMISSION_GROUP_KEY,
      diagnosticFingerprint: group?.diagnosticFingerprint,
      drillId: group?.drillId,
      variantId: group?.variantId,
      blockType: group?.blockType,
      triageRoute: group?.triageRoute,
      reviewedReportId: group?.reviewedReportId,
    },
    relatedCandidateGroupKeys,
    admissionState: 'evidence_gathering',
    previewReady: false,
    sourceEvidenceState: 'missing',
    sourceEvidenceRationale:
      'No proposed delta has named whether source-backed evidence is present, missing, or not needed.',
    missingProposalFacts: D47_PROPOSAL_ADMISSION_MISSING_FACTS,
    receiptFacts: buildD47ProposalAdmissionReceiptFacts(group),
    workloadProposalTracks: group
      ? group.followUpRoutes.filter((route) => D47_WORKLOAD_PROPOSAL_TRACKS.includes(route))
      : [],
    generatorPolicyTracks: group
      ? group.followUpRoutes.filter((route) => D47_GENERATOR_POLICY_TRACKS.includes(route))
      : [],
    existingSurfaceDecision:
      'Host the first admission ticket in the generated triage workbench before creating any standalone artifact.',
    counterfactualPolicyBoundary:
      'Counterfactual-only pressure remains diagnostic evidence until a policy-admissible generator hypothesis is named.',
    d47AlternativeComparison:
      'D47 is the first candidate because it stress-tests mixed evidence and non-redistribution pressure; abandon it if causal warrant, product impact, or an admissible proposal path cannot be named.',
    noChangePath: {
      admissionState: 'close_or_hold_without_preview',
      requiresU6Preview: false,
      acceptanceEvidenceRequired: true,
      condition:
        'A no-change disposition can close or hold the ticket when acceptance evidence and a no-action threshold are named.',
    },
  }
}

function formatProposalAdmissionMissingFact(
  missingFact: GeneratedPlanProposalAdmissionMissingFact,
): string {
  return missingFact.replaceAll('_', ' ')
}

function nonRedistributionPressureCellCount(
  group: GeneratedPlanRedistributionCausalityGroupReceipt,
): number {
  return (
    group.counts.nonRedistributionOverCapCellCount +
    group.counts.nonRedistributionUnderMinCellCount
  )
}

export function authorizationStatusForGeneratedPlanD47GapClosureState(
  gapType: GeneratedPlanD47GapClosureGapType,
  decisionState: GeneratedPlanD47GapClosureDecisionState,
  currentnessState: GeneratedPlanD47GapClosureCurrentnessState,
  allSegmentsHaveDisposition: boolean,
): GeneratedPlanD47GapClosureAuthorizationStatus {
  if (currentnessState !== 'current') return 'not_authorized'

  switch (decisionState) {
    case 'evidence_gathering':
      return 'not_authorized'
    case 'primary_fill_path_selected':
      if (!allSegmentsHaveDisposition) return 'not_authorized'
      return gapType === 'undetermined' || gapType === 'no_real_gap'
        ? 'not_authorized'
        : 'ready_for_planning'
    case 'no_change_closed':
      return allSegmentsHaveDisposition ? 'closed_without_fill' : 'not_authorized'
    case 'abandoned_for_better_candidate':
      if (!allSegmentsHaveDisposition) return 'not_authorized'
      return 'closed_without_fill'
    case 'fill_planned':
    case 'fill_applied_reassessment_pending':
    case 'closed_validated':
      if (!allSegmentsHaveDisposition) return 'not_authorized'
      return gapType === 'no_real_gap' || gapType === 'undetermined'
        ? 'not_authorized'
        : 'authorized_for_fill_plan'
    default: {
      const exhaustive: never = decisionState
      return exhaustive
    }
  }
}

function currentnessStateForD47GapClosureLedger(
  ticket: GeneratedPlanD47ProposalAdmissionTicket,
  validation: GeneratedPlanTriageValidation,
): GeneratedPlanD47GapClosureCurrentnessState {
  if (!ticket.candidateFound) return 'missing_or_shifted'
  return validation.issues.some(
    (issue) =>
      issue.code === 'stale_fingerprint' &&
      issue.groupKey === D47_PROPOSAL_ADMISSION_GROUP_KEY,
  )
    ? 'stale'
    : 'current'
}

function buildD47GapClosureSegmentDispositions(
  receiptFacts: GeneratedPlanD47ProposalAdmissionReceiptFacts,
): GeneratedPlanD47GapClosureSegmentDisposition[] {
  return [
    {
      segment: 'pressure_disappears',
      cellCount: receiptFacts.pressureDisappearsCellCount,
      gapType: 'generator_policy_artifact',
      decisionState: 'evidence_gathering',
      authorizationStatus: 'not_authorized',
      disposition:
        'Counterfactual-only pressure needs a generator-policy hypothesis before it can drive fill work.',
      expectedDiagnosticMovement:
        'A valid generator-policy hypothesis should reduce pressure-disappears cells without hiding remaining pressure.',
      expectedTrainingQualityMovement:
        'Not assessed until a policy hypothesis explains why shorter generated allocation improves the session.',
    },
    {
      segment: 'pressure_remains',
      cellCount: receiptFacts.pressureRemainsCellCount,
      gapType: 'undetermined',
      decisionState: 'evidence_gathering',
      authorizationStatus: 'not_authorized',
      disposition:
        'Remaining pressure may be workload metadata, block shape, or content-depth pressure; compare before selecting D47.',
      expectedDiagnosticMovement:
        'A selected fill path should reduce pressure-remains cells or prove they are policy-acceptable.',
      expectedTrainingQualityMovement:
        'Use block-shape coherence or workload honesty if this becomes the primary fill path.',
    },
    {
      segment: 'non_redistribution_pressure',
      cellCount: receiptFacts.nonRedistributionPressureCellCount,
      gapType: 'undetermined',
      decisionState: 'evidence_gathering',
      authorizationStatus: 'not_authorized',
      disposition:
        'Non-redistribution pressure is the strongest reason to compare D47 against a simpler candidate first.',
      expectedDiagnosticMovement:
        'A better pilot should expose the same pressure with fewer mixed-causality obligations.',
      expectedTrainingQualityMovement:
        'Use workload honesty or block-shape coherence before source-backed drill inventory work.',
    },
  ]
}

function isD47GapClosureTarget(
  group: GeneratedPlanRedistributionCausalityGroupReceipt,
): boolean {
  return group.drillId === 'd47' && group.variantId === 'd47-solo-open'
}

function comparatorIsSimplerThanD47(
  comparator: GeneratedPlanRedistributionCausalityGroupReceipt,
  d47: GeneratedPlanRedistributionCausalityGroupReceipt,
): boolean {
  return (
    comparator.counts.totalAffectedCellCount < d47.counts.totalAffectedCellCount ||
    (comparator.counts.pressureDisappearsCellCount < d47.counts.pressureDisappearsCellCount &&
      comparator.counts.pressureRemainsCellCount <= d47.counts.pressureRemainsCellCount)
  )
}

function comparatorIsHigherConfidenceThanD47(
  comparator: GeneratedPlanRedistributionCausalityGroupReceipt,
  d47: GeneratedPlanRedistributionCausalityGroupReceipt,
): boolean {
  return (
    !comparator.hasIncompleteEvidence &&
    comparator.counts.pressureDisappearsCellCount < d47.counts.pressureDisappearsCellCount &&
    nonRedistributionPressureCellCount(comparator) > 0
  )
}

function chooseD47GapClosureComparator(
  receiptGroups: readonly GeneratedPlanRedistributionCausalityGroupReceipt[],
  d47: GeneratedPlanRedistributionCausalityGroupReceipt | undefined,
  blockedGroupKeys: ReadonlySet<string>,
): GeneratedPlanRedistributionCausalityGroupReceipt | undefined {
  if (!d47) return undefined

  return receiptGroups
    .filter(
      (group) => {
        if (isD47GapClosureTarget(group)) return false
        if (blockedGroupKeys.has(group.groupKey)) return false
        if (nonRedistributionPressureCellCount(group) <= 0) return false
        return comparatorIsSimplerThanD47(group, d47) || comparatorIsHigherConfidenceThanD47(group, d47)
      },
    )
    .sort((left, right) => {
      const pressureDisappearsDelta =
        left.counts.pressureDisappearsCellCount - right.counts.pressureDisappearsCellCount
      if (pressureDisappearsDelta !== 0) return pressureDisappearsDelta
      const nonRedistributionDelta =
        nonRedistributionPressureCellCount(right) - nonRedistributionPressureCellCount(left)
      if (nonRedistributionDelta !== 0) return nonRedistributionDelta
      return left.counts.totalAffectedCellCount - right.counts.totalAffectedCellCount
    })[0]
}

function buildD47GapClosureComparatorReceipt(
  comparator: GeneratedPlanRedistributionCausalityGroupReceipt | undefined,
  d47: GeneratedPlanRedistributionCausalityGroupReceipt | undefined,
): GeneratedPlanD47GapClosureComparatorReceipt {
  if (!comparator) {
    return {
      comparatorKind: 'no_change_baseline',
      rationale:
        'No simpler current receipt candidate with non-redistribution pressure is available; compare D47 against a no-change baseline before selecting it.',
      simplerThanD47: false,
      higherConfidenceThanD47: false,
    }
  }

  const receiptFacts = buildD47ProposalAdmissionReceiptFacts(comparator)
  const simplerThanD47 = d47 ? comparatorIsSimplerThanD47(comparator, d47) : false
  const higherConfidenceThanD47 = d47
    ? comparatorIsHigherConfidenceThanD47(comparator, d47)
    : false
  return {
    comparatorKind: 'receipt_candidate',
    groupKey: comparator.groupKey,
    drillId: comparator.drillId,
    variantId: comparator.variantId,
    rationale:
      'Comparator-first pilot selected this receipt candidate because it shows non-redistribution pressure with fewer mixed-causality obligations than D47.',
    simplerThanD47,
    higherConfidenceThanD47,
    receiptFacts,
  }
}

export function buildGeneratedPlanD47GapClosureLedger(
  groups: readonly GeneratedPlanObservationGroup[],
  registry: readonly GeneratedPlanTriageEntry[],
): GeneratedPlanD47GapClosureLedger {
  const validation = validateGeneratedPlanTriageCoverage(groups, registry)
  const ticket = buildGeneratedPlanD47ProposalAdmissionTicket(groups, registry)
  const receipt = buildGeneratedPlanRedistributionCausalityReceipt(groups, registry)
  const d47ReceiptGroup = receipt.groups.find(
    (candidate) => candidate.groupKey === D47_PROPOSAL_ADMISSION_GROUP_KEY,
  )
  const blockedGroupKeys = new Set(validation.blockingIssues.map((issue) => issue.groupKey))
  const comparatorReceipt = buildD47GapClosureComparatorReceipt(
    chooseD47GapClosureComparator(receipt.groups, d47ReceiptGroup, blockedGroupKeys),
    d47ReceiptGroup,
  )
  const currentnessState = currentnessStateForD47GapClosureLedger(ticket, validation)
  const gapType: GeneratedPlanD47GapClosureGapType = 'undetermined'
  const decisionState: GeneratedPlanD47GapClosureDecisionState = 'evidence_gathering'
  const segmentDispositions = buildD47GapClosureSegmentDispositions(ticket.receiptFacts)

  return {
    candidateFound: ticket.candidateFound,
    candidate: ticket.candidate,
    relatedCandidateGroupKeys: ticket.relatedCandidateGroupKeys,
    currentnessState,
    gapType,
    decisionState,
    authorizationStatus: authorizationStatusForGeneratedPlanD47GapClosureState(
      gapType,
      decisionState,
      currentnessState,
      segmentDispositions.every((segment) => segment.cellCount >= 0 && hasText(segment.disposition)),
    ),
    suspectedTrainingGap: D47_GAP_CLOSURE_SUSPECTED_TRAINING_GAP,
    receiptFacts: ticket.receiptFacts,
    segmentDispositions,
    comparatorReceipt,
    nextArtifact: {
      artifactType: 'comparator_receipt',
      owner: 'maintainer',
      evidenceSource: 'Current U8 redistribution causality receipt and D47 admission ticket.',
      promotionCriteria:
        'Promote D47 only if it names stronger causal warrant, product impact, and a smaller fill artifact than the comparator.',
      abandonCriteria:
        'Abandon D47 if the comparator presents a simpler or higher-confidence path to a concrete gap fill.',
      noChangeCriteria:
        'Close without fill only when every segment has evidence, a no-action threshold, and a revisit trigger.',
    },
    sourceProvenance: D47_GAP_CLOSURE_SOURCE_PROVENANCE,
    sourceDeltaBoundary: D47_GAP_CLOSURE_SOURCE_DELTA_BOUNDARY,
    noChangeClosureBurden:
      'No-change closure requires dispositions for pressure-disappears, pressure-remains, and non-redistribution pressure segments.',
    reassessmentResult: 'not_started',
    reassessmentBoundary:
      'This slice records expected movement only; actual diagnostic and training-quality reassessment waits for a future fill.',
  }
}

function currentnessStateForD01GapFillProposal(
  group: GeneratedPlanRedistributionCausalityGroupReceipt | undefined,
  validation: GeneratedPlanTriageValidation,
): GeneratedPlanD47GapClosureCurrentnessState {
  if (!group) return 'missing_or_shifted'
  return validation.issues.some(
    (issue) =>
      issue.code === 'stale_fingerprint' &&
      issue.groupKey === D01_GAP_FILL_PROPOSAL_GROUP_KEY,
  )
    ? 'stale'
    : 'current'
}

function d47RelationshipForD01GapFillProposal(
  ledger: GeneratedPlanD47GapClosureLedger,
): GeneratedPlanD01GapFillD47Relationship {
  switch (ledger.currentnessState) {
    case 'current':
      return 'd47_held_behind_d01'
    case 'stale':
      return 'd47_stale'
    case 'missing_or_shifted':
      return 'd47_missing_or_shifted'
    default: {
      const exhaustive: never = ledger.currentnessState
      return exhaustive
    }
  }
}

export function buildGeneratedPlanD01GapFillProposal(
  groups: readonly GeneratedPlanObservationGroup[],
  registry: readonly GeneratedPlanTriageEntry[],
): GeneratedPlanD01GapFillProposal {
  const validation = validateGeneratedPlanTriageCoverage(groups, registry)
  const receipt = buildGeneratedPlanRedistributionCausalityReceipt(groups, registry)
  const d01ReceiptGroup = receipt.groups.find(
    (candidate) => candidate.groupKey === D01_GAP_FILL_PROPOSAL_GROUP_KEY,
  )
  const d47GapClosureLedger = buildGeneratedPlanD47GapClosureLedger(groups, registry)
  const currentnessState = currentnessStateForD01GapFillProposal(d01ReceiptGroup, validation)

  return {
    candidateFound: d01ReceiptGroup !== undefined,
    candidate: {
      groupKey: D01_GAP_FILL_PROPOSAL_GROUP_KEY,
      diagnosticFingerprint: d01ReceiptGroup?.diagnosticFingerprint,
      drillId: d01ReceiptGroup?.drillId,
      variantId: d01ReceiptGroup?.variantId,
      blockType: d01ReceiptGroup?.blockType,
      triageRoute: d01ReceiptGroup?.triageRoute,
      reviewedReportId: d01ReceiptGroup?.reviewedReportId,
    },
    currentnessState,
    d47Relationship: d47RelationshipForD01GapFillProposal(d47GapClosureLedger),
    gapType: 'programming_shape_gap',
    decisionState: 'evidence_gathering',
    authorizationStatus: 'not_authorized',
    suspectedTrainingGap: D01_GAP_FILL_SUSPECTED_TRAINING_GAP,
    receiptFacts: buildD47ProposalAdmissionReceiptFacts(d01ReceiptGroup),
    primaryClosurePath: 'combined_workload_block_shape_review',
    targetSurface: D01_GAP_FILL_TARGET_SURFACE,
    blockedSourceBackedContentPath:
      'Blocked until a content-depth delta beyond existing D01 passing catalog content is named with source evidence.',
    blockedGeneratorPolicyPath:
      'Blocked until a generator-policy hypothesis explains why runtime assembly should change instead of workload/block shape.',
    nextArtifact: {
      artifactType: 'workload_block_shape_proposal',
      owner: 'maintainer',
      evidenceSource: 'Current D01 comparator receipt from the D47 gap closure ledger.',
      promotionCriteria:
        'Promote D01 when a proposal chooses widen, split/repeat, or policy-acceptance with expected diagnostic and training-quality movement.',
      abandonCriteria:
        'Return to D47 or another candidate if D01 cannot name a concrete workload/block-shape target surface.',
      noChangeCriteria:
        'Close without fill only when the remaining pressure is policy-accepted with a no-action threshold and revisit trigger.',
    },
    expectedDiagnosticMovement:
      'Future fill should reduce D01 over-cap/fatigue pressure, route it to an accepted policy allowance, or document why remaining pressure is harmless.',
    expectedTrainingQualityMovement:
      'Future fill should improve workload honesty or block-shape coherence for beginner passing without pretending catalog content changed.',
    reassessmentResult: 'not_started',
    reassessmentBoundary:
      'This slice records proposal quality only; actual diagnostic and training-quality reassessment waits for a future authorized D01 fill.',
  }
}

function formatD47GapClosureSegmentLabel(segment: GeneratedPlanD47GapClosureSegmentLabel): string {
  switch (segment) {
    case 'pressure_disappears':
      return 'Pressure disappears under counterfactual'
    case 'pressure_remains':
      return 'Pressure remains without redistribution'
    case 'non_redistribution_pressure':
      return 'Non-redistribution pressure'
    default: {
      const exhaustive: never = segment
      return exhaustive
    }
  }
}

function routeCountsForEntries(
  entries: readonly GeneratedPlanTriageEntry[],
): GeneratedPlanDecisionDebtRouteCount[] {
  const counts = new Map<GeneratedPlanTriageRoute, number>()
  for (const entry of entries) counts.set(entry.route, (counts.get(entry.route) ?? 0) + 1)
  return TRIAGE_ROUTES.filter((route) => counts.has(route)).map((route) => ({
    route,
    count: counts.get(route) ?? 0,
  }))
}

export function validateGeneratedPlanTriageCoverage(
  groups: readonly GeneratedPlanObservationGroup[],
  registry: readonly GeneratedPlanTriageEntry[],
): GeneratedPlanTriageValidation {
  const currentGroupsByKey = new Map(groups.map((group) => [group.groupKey, group] as const))
  const issues: GeneratedPlanTriageIssue[] = []
  const seenEntryKeys = new Set<string>()
  const duplicateEntryKeys = new Set<string>()

  for (const entry of registry) {
    if (seenEntryKeys.has(entry.groupKey)) duplicateEntryKeys.add(entry.groupKey)
    seenEntryKeys.add(entry.groupKey)
    if (entryHasInvalidRuntimeShape(entry)) {
      issues.push(
        triageIssue(
          'invalid_registry_entry',
          entry.groupKey,
          'blocking',
          'Triage registry entry has invalid status, route, enforcement, or array fields.',
        ),
      )
    }
  }

  for (const groupKey of duplicateEntryKeys) {
    issues.push(
      triageIssue(
        'duplicate_group_key',
        groupKey,
        'blocking',
        'Triage registry contains duplicate entries for this group key.',
      ),
    )
  }

  const entriesByKey = new Map(registry.map((entry) => [entry.groupKey, entry] as const))

  for (const group of groups) {
    const entry = entriesByKey.get(group.groupKey)
    if (!entry) {
      issues.push(
        triageIssue(
          'untriaged_group',
          group.groupKey,
          'blocking',
          'Current generated-plan observation group has no triage registry entry.',
        ),
      )
      continue
    }

    if (entryMissingRequiredField(entry)) {
      issues.push(
        triageIssue(
          'missing_required_field',
          group.groupKey,
          'blocking',
          'Triage registry entry is missing required decision metadata.',
        ),
      )
    }

    if (entry.diagnosticFingerprint !== group.diagnosticFingerprint) {
      issues.push(
        triageIssue(
          'stale_fingerprint',
          group.groupKey,
          'blocking',
          'Triage registry entry fingerprint no longer matches current diagnostic facts.',
        ),
      )
    }

    if (
      entry.route === 'source_backed_content_depth' &&
      entry.triageStatus === 'resolved' &&
      entry.evidence.length === 0
    ) {
      issues.push(
        triageIssue(
          'source_depth_missing_evidence',
          group.groupKey,
          'blocking',
          'Source-backed content routes cannot resolve without evidence links.',
        ),
      )
    }

    if (entry.enforcementStatus === 'hard_fail_enforced') {
      issues.push(
        triageIssue(
          'enforced_group_present',
          group.groupKey,
          'blocking',
          'A hard-fail-enforced observation group is still present.',
        ),
      )
    }

    if (compressionLaneForGeneratedPlanTriageItem(group, entry) === 'unknown_unclassified') {
      issues.push(
        triageIssue(
          'unknown_compression_lane',
          group.groupKey,
          'blocking',
          'Generated-plan observation group does not match a known decision-debt compression lane.',
        ),
      )
    }
  }

  for (const entry of registry) {
    if (!currentGroupsByKey.has(entry.groupKey)) {
      issues.push(
        triageIssue(
          'superseded_group',
          entry.groupKey,
          'warning',
          'Triage registry entry no longer maps to a current generated-plan observation group.',
        ),
      )
    }
  }

  const blockingIssues = issues.filter((issue) => issue.severity === 'blocking')
  const warningIssues = issues.filter((issue) => issue.severity === 'warning')
  return { issues, blockingIssues, warningIssues }
}

export function buildGeneratedPlanDecisionDebtPrompts(
  groups: readonly GeneratedPlanObservationGroup[],
  registry: readonly GeneratedPlanTriageEntry[],
): GeneratedPlanDecisionDebtPrompt[] {
  const entriesByKey = new Map(registry.map((entry) => [entry.groupKey, entry] as const))
  const items = groups
    .map((group) => ({ group, entry: entriesByKey.get(group.groupKey) }))
    .filter(
      (
        item,
      ): item is { group: GeneratedPlanObservationGroup; entry: GeneratedPlanTriageEntry } =>
        item.entry !== undefined &&
        item.entry.triageStatus !== 'resolved' &&
        item.entry.triageStatus !== 'superseded',
    )

  const prompts: GeneratedPlanDecisionDebtPrompt[] = []

  for (const lane of COMPRESSION_LANE_ORDER) {
    const laneItems = items.filter(
      ({ group, entry }) => compressionLaneForGeneratedPlanTriageItem(group, entry) === lane,
    )
    if (laneItems.length === 0) continue
    const detail = COMPRESSION_LANE_DETAILS[lane]
    prompts.push({
      lane,
      ...detail,
      affectedGroupCount: laneItems.length,
      totalAffectedCellCount: laneItems.reduce(
        (sum, { group }) => sum + group.affectedCellCount,
        0,
      ),
      redistributionAffectedCellCount: laneItems.reduce(
        (sum, { group }) => sum + redistributionAffectedCellCount(group),
        0,
      ),
      nonRedistributionOverCapCellCount: laneItems.reduce(
        (sum, { group }) => sum + nonRedistributionOverCapCellCount(group),
        0,
      ),
      routeCounts: routeCountsForEntries(laneItems.map(({ entry }) => entry)),
      groupKeys: laneItems.map(({ group }) => group.groupKey),
    })
  }

  return prompts
}

export function conservativeRouteForGeneratedPlanGroup(
  group: GeneratedPlanObservationGroup,
): GeneratedPlanTriageRoute {
  if (group.observationCodes.includes('optional_slot_redistribution')) {
    return 'generator_policy_investigation'
  }
  return 'defer'
}

export function buildInitialGeneratedPlanTriageRegistry(
  groups: readonly GeneratedPlanObservationGroup[],
): GeneratedPlanTriageEntry[] {
  return groups.map((group) => {
    const route = conservativeRouteForGeneratedPlanGroup(group)
    return {
      groupKey: group.groupKey,
      diagnosticFingerprint: group.diagnosticFingerprint,
      triageStatus: route === 'generator_policy_investigation' ? 'routed' : 'observed',
      route,
      enforcementStatus: 'observation_only',
      rationale:
        route === 'generator_policy_investigation'
          ? 'Redistribution evidence is present, so generator policy should be investigated before catalog changes.'
          : 'Needs human review before deciding whether this is policy allowance, cap review, block split, or source-backed content depth.',
      owner: 'agent',
      reviewedReportId: GENERATED_PLAN_TRIAGE_REPORT_ID,
      affectedCellCount: group.affectedCellCount,
      likelyFixPaths: group.likelyFixPaths,
      evidence: [],
    }
  })
}

export function buildGeneratedPlanTriageWorkbenchMarkdown(
  groups: readonly GeneratedPlanObservationGroup[],
  registry: readonly GeneratedPlanTriageEntry[],
): string {
  const validation = validateGeneratedPlanTriageCoverage(groups, registry)
  const entriesByKey = new Map(registry.map((entry) => [entry.groupKey, entry] as const))
  const currentEntries = groups
    .map((group) => ({ group, entry: entriesByKey.get(group.groupKey) }))
    .filter((item): item is { group: GeneratedPlanObservationGroup; entry: GeneratedPlanTriageEntry } =>
      item.entry !== undefined,
    )

  const routeCounts = new Map<GeneratedPlanTriageRoute, number>()
  for (const { entry } of currentEntries) {
    routeCounts.set(entry.route, (routeCounts.get(entry.route) ?? 0) + 1)
  }
  const decisionDebtPrompts = buildGeneratedPlanDecisionDebtPrompts(groups, registry)
  const redistributionCausalityReceipt = buildGeneratedPlanRedistributionCausalityReceipt(
    groups,
    registry,
  )
  const d47ProposalAdmissionTicket = buildGeneratedPlanD47ProposalAdmissionTicket(groups, registry)
  const d47GapClosureLedger = buildGeneratedPlanD47GapClosureLedger(groups, registry)
  const d01GapFillProposal = buildGeneratedPlanD01GapFillProposal(groups, registry)
  const decisionDebtLines =
    decisionDebtPrompts.length === 0
      ? ['- None.']
      : decisionDebtPrompts.flatMap((prompt) => {
          const guideLine = prompt.guideAnchor
            ? [
                `- Guide: \`${WORKLOAD_ENVELOPE_GUIDE_PATH}#${prompt.guideAnchor}\``,
              ]
            : []
          return [
            `### ${prompt.label}`,
            '',
            `- Lane: \`${prompt.lane}\``,
            `- Question: ${prompt.question}`,
            `- Why this lane: ${prompt.explanation}`,
            `- Groups: ${prompt.affectedGroupCount}; total affected cells: ${prompt.totalAffectedCellCount}`,
            `- Redistribution-affected cells: ${prompt.redistributionAffectedCellCount}`,
            `- Non-redistribution over-cap cells: ${prompt.nonRedistributionOverCapCellCount}`,
            `- Route mix: ${prompt.routeCounts.map(({ route, count }) => `\`${route}\` ${count}`).join(', ')}`,
            `- Disposition: \`${prompt.disposition}\``,
            `- Candidate dispositions: ${prompt.candidateDispositions.map((disposition) => `\`${disposition}\``).join(', ')}`,
            `- Recommended follow-up: ${prompt.recommendedFollowUpUnit}`,
            ...guideLine,
            `- Next evidence needed: ${prompt.nextEvidenceNeeded}`,
            `- Group keys: ${prompt.groupKeys.map((key) => `\`${key}\``).join(', ')}`,
            '',
          ]
        })
  const redistributionCausalityLines =
    redistributionCausalityReceipt.groups.length === 0
      ? ['- None.']
      : [
          `- Comparison mode: \`${redistributionCausalityReceipt.comparisonMode}\``,
          `- Runtime boundary: ${redistributionCausalityReceipt.runtimeBoundary}`,
          `- Groups: ${redistributionCausalityReceipt.groupCount}; total affected cells: ${redistributionCausalityReceipt.counts.totalAffectedCellCount}`,
          `- Redistribution-affected cells: ${redistributionCausalityReceipt.counts.redistributionAffectedCellCount}`,
          `- Current pressure cells: over authored max ${redistributionCausalityReceipt.counts.currentOverAuthoredMaxCellCount}, over fatigue cap ${redistributionCausalityReceipt.counts.currentOverFatigueCapCellCount}, under authored min ${redistributionCausalityReceipt.counts.currentUnderAuthoredMinCellCount}`,
          `- Allocated-duration pressure cells: over authored max ${redistributionCausalityReceipt.counts.allocatedOverAuthoredMaxCellCount}, over fatigue cap ${redistributionCausalityReceipt.counts.allocatedOverFatigueCapCellCount}, under authored min ${redistributionCausalityReceipt.counts.allocatedUnderAuthoredMinCellCount}`,
          `- Non-redistribution pressure cells: over cap ${redistributionCausalityReceipt.counts.nonRedistributionOverCapCellCount}, under authored min ${redistributionCausalityReceipt.counts.nonRedistributionUnderMinCellCount}`,
          `- Pressure disappears under allocated-duration counterfactual: ${redistributionCausalityReceipt.counts.pressureDisappearsCellCount}`,
          `- Pressure remains without redistribution: ${redistributionCausalityReceipt.counts.pressureRemainsCellCount}`,
          `- Comparison inconclusive cells: ${redistributionCausalityReceipt.counts.comparisonInconclusiveCellCount}`,
          `- Redistribution without cap/min pressure cells: ${redistributionCausalityReceipt.counts.redistributionWithoutPressureCellCount}`,
          `- Counterfactual unfilled minutes across affected cells: ${redistributionCausalityReceipt.counts.counterfactualUnfilledMinutes}`,
          '',
          '### Redistribution Causality Groups',
          '',
          ...redistributionCausalityReceipt.groups.map(
            (group) =>
              `- \`${group.groupKey}\`: action \`${group.actionState}\`, dominant \`${group.dominantCellState}\`, incomplete evidence ${group.hasIncompleteEvidence ? 'yes' : 'no'}, pressure disappears ${group.counts.pressureDisappearsCellCount}, pressure remains ${group.counts.pressureRemainsCellCount}, non-redistribution pressure ${group.counts.nonRedistributionOverCapCellCount + group.counts.nonRedistributionUnderMinCellCount}, inconclusive ${group.counts.comparisonInconclusiveCellCount}, follow-up ${group.followUpRoutes.map((route) => `\`${route}\``).join(', ')}`,
          ),
        ]
  const d47ProposalAdmissionLines = d47ProposalAdmissionTicket.candidateFound
    ? [
        '- Ticket source: U8 redistribution causality receipt for `d47` / `d47-solo-open`.',
        `- Candidate: \`${d47ProposalAdmissionTicket.candidate.groupKey}\``,
        `- Drill / variant: \`${d47ProposalAdmissionTicket.candidate.drillId}\` / \`${d47ProposalAdmissionTicket.candidate.variantId}\``,
        `- Block type: \`${d47ProposalAdmissionTicket.candidate.blockType}\``,
        `- Triage route: \`${d47ProposalAdmissionTicket.candidate.triageRoute}\``,
        `- Admission state: \`${d47ProposalAdmissionTicket.admissionState}\``,
        '- Admission gate: U6 preview remains blocked until a concrete proposal names a delta, evidence basis, falsification condition, expected diagnostic movement, impact hypothesis, and no-action threshold.',
        `- Preview ready: ${d47ProposalAdmissionTicket.previewReady ? 'yes' : 'no'}`,
        `- Source evidence state: \`${d47ProposalAdmissionTicket.sourceEvidenceState}\` (${d47ProposalAdmissionTicket.sourceEvidenceRationale})`,
        `- Existing surface decision: ${d47ProposalAdmissionTicket.existingSurfaceDecision}`,
        `- Receipt facts: total affected cells ${d47ProposalAdmissionTicket.receiptFacts.totalAffectedCellCount}, pressure disappears ${d47ProposalAdmissionTicket.receiptFacts.pressureDisappearsCellCount}, pressure remains ${d47ProposalAdmissionTicket.receiptFacts.pressureRemainsCellCount}, non-redistribution pressure ${d47ProposalAdmissionTicket.receiptFacts.nonRedistributionPressureCellCount}, inconclusive ${d47ProposalAdmissionTicket.receiptFacts.comparisonInconclusiveCellCount}`,
        `- Receipt classification: action \`${d47ProposalAdmissionTicket.receiptFacts.actionState}\`, dominant \`${d47ProposalAdmissionTicket.receiptFacts.dominantCellState}\`, incomplete evidence ${d47ProposalAdmissionTicket.receiptFacts.hasIncompleteEvidence ? 'yes' : 'no'}`,
        `- Workload/block/source tracks: ${d47ProposalAdmissionTicket.workloadProposalTracks.map((route) => `\`${route}\``).join(', ')}`,
        `- Generator-policy tracks: ${d47ProposalAdmissionTicket.generatorPolicyTracks.map((route) => `\`${route}\``).join(', ')}`,
        `- Counterfactual boundary: ${d47ProposalAdmissionTicket.counterfactualPolicyBoundary}`,
        `- D47 versus alternatives: ${d47ProposalAdmissionTicket.d47AlternativeComparison}`,
        `- No-change path: \`${d47ProposalAdmissionTicket.noChangePath.admissionState}\`; requires U6 preview ${d47ProposalAdmissionTicket.noChangePath.requiresU6Preview ? 'yes' : 'no'}; acceptance evidence required ${d47ProposalAdmissionTicket.noChangePath.acceptanceEvidenceRequired ? 'yes' : 'no'}; ${d47ProposalAdmissionTicket.noChangePath.condition}`,
        '',
        '### Missing proposal facts',
        '',
        ...d47ProposalAdmissionTicket.missingProposalFacts.map(
          (missingFact) => `- \`${missingFact}\`: ${formatProposalAdmissionMissingFact(missingFact)}`,
        ),
      ]
    : [
        `- Candidate: \`${d47ProposalAdmissionTicket.candidate.groupKey}\``,
        '- Admission state: `evidence_gathering`',
        '- Candidate group is not present in the current redistribution causality receipt.',
        ...d47ProposalAdmissionTicket.relatedCandidateGroupKeys.map(
          (groupKey) => `- Related current D47 group: \`${groupKey}\``,
        ),
      ]
  const comparatorReceipt = d47GapClosureLedger.comparatorReceipt
  const comparatorFacts =
    comparatorReceipt.comparatorKind === 'receipt_candidate'
      ? comparatorReceipt.receiptFacts
      : undefined
  const d47GapClosureLines = [
    '- Ledger source: D47 proposal-admission ticket plus U8 redistribution causality receipt.',
    `- Candidate: \`${d47GapClosureLedger.candidate.groupKey}\``,
    `- Currentness: \`${d47GapClosureLedger.currentnessState}\``,
    `- Gap type: \`${d47GapClosureLedger.gapType}\``,
    `- Decision state: \`${d47GapClosureLedger.decisionState}\``,
    `- Authorization status: \`${d47GapClosureLedger.authorizationStatus}\``,
    `- Suspected training gap: ${d47GapClosureLedger.suspectedTrainingGap}`,
    `- Source provenance: ${d47GapClosureLedger.sourceProvenance}`,
    `- Source delta boundary: ${d47GapClosureLedger.sourceDeltaBoundary}`,
    `- Receipt facts: total affected cells ${d47GapClosureLedger.receiptFacts.totalAffectedCellCount}, pressure disappears ${d47GapClosureLedger.receiptFacts.pressureDisappearsCellCount}, pressure remains ${d47GapClosureLedger.receiptFacts.pressureRemainsCellCount}, non-redistribution pressure ${d47GapClosureLedger.receiptFacts.nonRedistributionPressureCellCount}, inconclusive ${d47GapClosureLedger.receiptFacts.comparisonInconclusiveCellCount}`,
    '',
    '### Comparator Receipt',
    '',
    `- Comparator kind: \`${comparatorReceipt.comparatorKind}\``,
    comparatorReceipt.comparatorKind === 'receipt_candidate'
      ? `- Comparator candidate: \`${comparatorReceipt.groupKey}\``
      : '- Comparator candidate: no-change baseline',
    `- Comparator rationale: ${comparatorReceipt.rationale}`,
    `- Simpler than D47: ${comparatorReceipt.simplerThanD47 ? 'yes' : 'no'}`,
    `- Higher-confidence than D47: ${comparatorReceipt.higherConfidenceThanD47 ? 'yes' : 'no'}`,
    comparatorFacts
      ? `- Comparator facts: total affected cells ${comparatorFacts.totalAffectedCellCount}, pressure disappears ${comparatorFacts.pressureDisappearsCellCount}, pressure remains ${comparatorFacts.pressureRemainsCellCount}, non-redistribution pressure ${comparatorFacts.nonRedistributionPressureCellCount}, inconclusive ${comparatorFacts.comparisonInconclusiveCellCount}`
      : '- Comparator facts: baseline only, no receipt candidate selected.',
    '',
    '### Segment Dispositions',
    '',
    ...d47GapClosureLedger.segmentDispositions.map(
      (segment) =>
        `- ${formatD47GapClosureSegmentLabel(segment.segment)}: cells ${segment.cellCount}, gap \`${segment.gapType}\`, decision \`${segment.decisionState}\`, authorization \`${segment.authorizationStatus}\`; ${segment.disposition}`,
    ),
    '',
    '### Next Artifact',
    '',
    `- Artifact: \`${d47GapClosureLedger.nextArtifact.artifactType}\``,
    `- Owner: \`${d47GapClosureLedger.nextArtifact.owner}\``,
    `- Evidence source: ${d47GapClosureLedger.nextArtifact.evidenceSource}`,
    `- Promotion criteria: ${d47GapClosureLedger.nextArtifact.promotionCriteria}`,
    `- Abandon criteria: ${d47GapClosureLedger.nextArtifact.abandonCriteria}`,
    `- No-change criteria: ${d47GapClosureLedger.nextArtifact.noChangeCriteria}`,
    `- No-change burden: ${d47GapClosureLedger.noChangeClosureBurden}`,
    `- Reassessment result: \`${d47GapClosureLedger.reassessmentResult}\``,
    `- Reassessment boundary: ${d47GapClosureLedger.reassessmentBoundary}`,
  ]
  const d01GapFillLines = [
    '- Proposal source: D47 gap closure comparator receipt for `d01` / `d01-solo`.',
    `- Candidate: \`${d01GapFillProposal.candidate.groupKey}\``,
    `- Currentness: \`${d01GapFillProposal.currentnessState}\``,
    `- D47 relationship: \`${d01GapFillProposal.d47Relationship}\``,
    `- Gap type: \`${d01GapFillProposal.gapType}\``,
    `- Decision state: \`${d01GapFillProposal.decisionState}\``,
    `- Authorization status: \`${d01GapFillProposal.authorizationStatus}\``,
    `- Suspected training gap: ${d01GapFillProposal.suspectedTrainingGap}`,
    `- Target surface: ${d01GapFillProposal.targetSurface}`,
    `- Primary closure path: \`${d01GapFillProposal.primaryClosurePath}\``,
    `- Receipt facts: total affected cells ${d01GapFillProposal.receiptFacts.totalAffectedCellCount}, pressure disappears ${d01GapFillProposal.receiptFacts.pressureDisappearsCellCount}, pressure remains ${d01GapFillProposal.receiptFacts.pressureRemainsCellCount}, non-redistribution pressure ${d01GapFillProposal.receiptFacts.nonRedistributionPressureCellCount}, inconclusive ${d01GapFillProposal.receiptFacts.comparisonInconclusiveCellCount}`,
    `- Source-backed content path: ${d01GapFillProposal.blockedSourceBackedContentPath}`,
    `- Generator-policy path: ${d01GapFillProposal.blockedGeneratorPolicyPath}`,
    '',
    '### Next Artifact',
    '',
    `- Artifact: \`${d01GapFillProposal.nextArtifact.artifactType}\``,
    `- Owner: \`${d01GapFillProposal.nextArtifact.owner}\``,
    `- Evidence source: ${d01GapFillProposal.nextArtifact.evidenceSource}`,
    `- Promotion criteria: ${d01GapFillProposal.nextArtifact.promotionCriteria}`,
    `- Abandon criteria: ${d01GapFillProposal.nextArtifact.abandonCriteria}`,
    `- No-change criteria: ${d01GapFillProposal.nextArtifact.noChangeCriteria}`,
    `- Expected diagnostic movement: ${d01GapFillProposal.expectedDiagnosticMovement}`,
    `- Expected training-quality movement: ${d01GapFillProposal.expectedTrainingQualityMovement}`,
    `- Reassessment result: \`${d01GapFillProposal.reassessmentResult}\``,
    `- Reassessment boundary: ${d01GapFillProposal.reassessmentBoundary}`,
  ]

  const lines = [
    '## Triage Summary',
    '',
    `- Current routeable groups: ${groups.length}`,
    `- Registry entries: ${registry.length}`,
    `- Blocking validation issues: ${validation.blockingIssues.length}`,
    `- Warning validation issues: ${validation.warningIssues.length}`,
    '',
    '## Route Counts',
    '',
    ...[...routeCounts.entries()].map(([route, count]) => `- \`${route}\`: ${count}`),
    '',
    '## Decision-Debt Compression',
    '',
    ...decisionDebtLines,
    '',
    '## Redistribution Causality Receipt',
    '',
    ...redistributionCausalityLines,
    '',
    '## D47 Proposal Admission Ticket',
    '',
    ...d47ProposalAdmissionLines,
    '',
    '## D47 Gap Closure Ledger',
    '',
    ...d47GapClosureLines,
    '',
    '## D01 Gap-Fill Proposal',
    '',
    ...d01GapFillLines,
    '',
    '## New / Untriaged Blockers',
    '',
    ...validation.issues
      .filter((issue) => issue.code === 'untriaged_group')
      .map((issue) => `- \`${issue.groupKey}\`: ${issue.message}`),
    validation.issues.some((issue) => issue.code === 'untriaged_group') ? '' : '- None.',
    '',
    '## Stale Fingerprint Review',
    '',
    ...validation.issues
      .filter((issue) => issue.code === 'stale_fingerprint')
      .map((issue) => `- \`${issue.groupKey}\`: ${issue.message}`),
    validation.issues.some((issue) => issue.code === 'stale_fingerprint') ? '' : '- None.',
    '',
    '## Other Blocking Validation Issues',
    '',
    ...validation.issues
      .filter(
        (issue) =>
          issue.severity === 'blocking' &&
          !['untriaged_group', 'stale_fingerprint'].includes(issue.code),
      )
      .map((issue) => `- \`${issue.groupKey}\` (\`${issue.code}\`): ${issue.message}`),
    validation.issues.some(
      (issue) =>
        issue.severity === 'blocking' &&
        !['untriaged_group', 'stale_fingerprint'].includes(issue.code),
    )
      ? ''
      : '- None.',
    '',
    '## Resolved / Superseded Cleanup',
    '',
    ...validation.issues
      .filter((issue) => issue.code === 'superseded_group')
      .map((issue) => `- \`${issue.groupKey}\`: ${issue.message}`),
    validation.issues.some((issue) => issue.code === 'superseded_group') ? '' : '- None.',
    '',
    '## Evidence-Required Routes',
    '',
    ...currentEntries
      .filter(({ entry }) => entry.route === 'source_backed_content_depth')
      .map(({ group, entry }) => `- \`${entry.groupKey}\` (${group.affectedCellCount} cells)`),
    currentEntries.some(({ entry }) => entry.route === 'source_backed_content_depth') ? '' : '- None.',
    '',
    '## Needs Human Review',
    '',
    ...currentEntries
      .filter(({ entry }) => entry.route === 'defer')
      .map(
        ({ group, entry }) =>
          `- \`${entry.groupKey}\` (${group.affectedCellCount} cells): ${entry.rationale}`,
      ),
    currentEntries.some(({ entry }) => entry.route === 'defer') ? '' : '- None.',
    '',
    '## Generator Policy Investigation',
    '',
    ...currentEntries
      .filter(({ entry }) => entry.route === 'generator_policy_investigation')
      .map(
        ({ group, entry }) =>
          `- \`${entry.groupKey}\` (${group.affectedCellCount} cells): ${entry.rationale}`,
      ),
    currentEntries.some(({ entry }) => entry.route === 'generator_policy_investigation')
      ? ''
      : '- None.',
    '',
    '## Top Affected Groups',
    '',
    ...currentEntries
      .map(
        ({ group, entry }) =>
          `- \`${entry.groupKey}\` (${group.affectedCellCount} cells, route: \`${entry.route}\`)`,
      ),
  ]

  return `${lines.join('\n')}\n`
}
