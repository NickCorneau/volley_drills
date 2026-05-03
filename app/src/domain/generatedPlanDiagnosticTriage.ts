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

export interface GeneratedPlanRedistributionCausalityCellReceipt extends GeneratedPlanRedistributionCausalityCounts {
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

export type GeneratedPlanProposalAdmissionSourceEvidenceState = 'present' | 'missing' | 'not_needed'

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
  | 'closed_with_fill'

export type GeneratedPlanD47GapClosureCurrentnessState =
  | 'current'
  | 'stale'
  | 'missing_or_shifted'
  | 'closed_by_d49'

export type GeneratedPlanD47GapClosureSegmentLabel =
  | 'pressure_disappears'
  | 'pressure_remains'
  | 'non_redistribution_pressure'

export type GeneratedPlanD47GapClosureComparatorKind = 'receipt_candidate' | 'no_change_baseline'

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
  readonly artifactType: 'comparator_receipt' | 'd49_residual_follow_up'
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

export type GeneratedPlanD01WorkloadBlockShapeDisposition =
  | 'block_shape_review_needed'
  | 'metadata_review_needed'
  | 'source_depth_blocked'
  | 'generator_policy_blocked'

export type GeneratedPlanD01WorkloadBlockShapeMetadataAction = 'unchanged'

export type GeneratedPlanD01WorkloadBlockShapeU6Eligibility =
  'blocked_until_concrete_block_or_cap_proposal'

export interface GeneratedPlanD01WorkloadBlockShapeProposal {
  readonly candidateFound: boolean
  readonly candidate: GeneratedPlanD47ProposalAdmissionCandidate
  readonly currentnessState: GeneratedPlanD47GapClosureCurrentnessState
  readonly authorizationStatus: Extract<
    GeneratedPlanD47GapClosureAuthorizationStatus,
    'not_authorized'
  >
  readonly selectedDisposition: Extract<
    GeneratedPlanD01WorkloadBlockShapeDisposition,
    'block_shape_review_needed'
  >
  readonly secondaryDisposition: Extract<
    GeneratedPlanD01WorkloadBlockShapeDisposition,
    'metadata_review_needed'
  >
  readonly metadataAction: GeneratedPlanD01WorkloadBlockShapeMetadataAction
  readonly targetSurface: string
  readonly evidenceLayer: string
  readonly recommendedFutureFillShape: string
  readonly blockShapeRationale: string
  readonly expectedDiagnosticMovement: string
  readonly expectedTrainingQualityMovement: string
  readonly noActionThreshold: string
  readonly revisitTrigger: string
  readonly sourceBackedContentDisposition: Extract<
    GeneratedPlanD01WorkloadBlockShapeDisposition,
    'source_depth_blocked'
  >
  readonly generatorPolicyDisposition: Extract<
    GeneratedPlanD01WorkloadBlockShapeDisposition,
    'generator_policy_blocked'
  >
  readonly u6Eligibility: GeneratedPlanD01WorkloadBlockShapeU6Eligibility
  readonly reassessmentResult: GeneratedPlanD47GapClosureReassessmentResult
  readonly reassessmentBoundary: string
}

export type GeneratedPlanD01BlockShapeFillDiagnosticMovement =
  | 'validated'
  | 'partially_validated'
  | 'unresolved'

export type GeneratedPlanD01BlockShapeFillTrainingQualityState = 'not_field_validated'

export type GeneratedPlanD01RedistributionHandoffState =
  | 'not_needed_target_absent'
  | 'admissible_candidate'
  | 'mixed_admission'
  | 'insufficient_allocated_pressure'
  | 'comparison_inconclusive'

export type GeneratedPlanD01RedistributionNextState =
  | 'resume_d47'
  | 'd01_still_open'
  | 'cap_or_catalog_proposal_needed'

export interface GeneratedPlanD01BlockShapeFillReceipt {
  readonly targetGroupKey: string
  readonly targetFound: boolean
  readonly diagnosticMovement: GeneratedPlanD01BlockShapeFillDiagnosticMovement
  readonly trainingQualityState: GeneratedPlanD01BlockShapeFillTrainingQualityState
  readonly redistributionHandoffState: GeneratedPlanD01RedistributionHandoffState
  readonly redistributionHandoffReason: string
  readonly d47NextState: GeneratedPlanD01RedistributionNextState
  readonly baselineReceiptFacts: GeneratedPlanD47ProposalAdmissionReceiptFacts
  readonly currentReceiptFacts: GeneratedPlanD47ProposalAdmissionReceiptFacts
  readonly appliedFill: string
  readonly metadataAction: GeneratedPlanD01WorkloadBlockShapeMetadataAction
  readonly sourceBackedContentDisposition: Extract<
    GeneratedPlanD01WorkloadBlockShapeDisposition,
    'source_depth_blocked'
  >
  readonly u6Eligibility: 'deferred_no_cap_or_catalog_delta'
  readonly diagnosticSummary: string
  readonly trainingQualityBoundary: string
  readonly remainingAction: string
}

const D01_CAP_CATALOG_FORKS = [
  'cap_proposal',
  'catalog_source_backed_delta',
  'accepted_no_change',
  'resume_d47_with_d01_held',
] as const

export type GeneratedPlanD01CapCatalogFork = (typeof D01_CAP_CATALOG_FORKS)[number]

export type GeneratedPlanD01CapCatalogForkSelectionState =
  | 'not_applicable_resume'
  | 'not_authorized_stale_or_inapplicable'
  | 'selected'

export type GeneratedPlanD01CapCatalogParentD47State =
  | 'resume_d47'
  | 'preserve_existing_d01_state'
  | 'd47_blocked_by_planning_ready_d01_delta'
  | 'd47_resumed_d01_held'

export type GeneratedPlanD01CapCatalogPlanningAuthorizationStatus =
  | 'not_ready_for_catalog_fill_planning'
  | 'ready_for_catalog_fill_planning'

export type GeneratedPlanD01CapCatalogActivationStatus = 'not_authorized'

export interface GeneratedPlanD01CapCatalogForkRejection {
  readonly fork: GeneratedPlanD01CapCatalogFork
  readonly reason: string
}

export interface GeneratedPlanD01CapCatalogCatalogEvaluation {
  readonly suspectedCatalogGap: string
  readonly changedOrMissingCatalogIds: readonly string[]
  readonly sourcePathOrNeeds: string
  readonly adaptationDelta: string
  readonly expectedDiagnosticMovement: string
  readonly verificationCommand: string
  readonly checkpointCriteria: string
  readonly nextArtifact: string
}

export interface GeneratedPlanD01CapCatalogCapEvaluation {
  readonly proposedCapDelta: string
  readonly segmentAndCopySupport: string
  readonly rejectedCatalogRationale: string
  readonly expectedDiagnosticMovement: string
  readonly futureU6Condition: string
  readonly falsificationThreshold: string
}

export interface GeneratedPlanD01CapCatalogNoChangeEvaluation {
  readonly owner: string
  readonly rationale: string
  readonly acceptedBlastRadius: string
  readonly noActionThreshold: string
  readonly revisitTrigger: string
}

export interface GeneratedPlanD01CapCatalogD47ResumeEvaluation {
  readonly reason: string
  readonly heldState: string
}

export interface GeneratedPlanD01CapCatalogForkEvaluations {
  readonly catalogEvaluation?: GeneratedPlanD01CapCatalogCatalogEvaluation
  readonly capEvaluation?: GeneratedPlanD01CapCatalogCapEvaluation
  readonly noChangeEvaluation?: GeneratedPlanD01CapCatalogNoChangeEvaluation
  readonly d47ResumeEvaluation?: GeneratedPlanD01CapCatalogD47ResumeEvaluation
}

interface GeneratedPlanD01CapCatalogForkPacketBase {
  readonly targetGroupKey: string
  readonly targetFound: boolean
  readonly currentnessState: GeneratedPlanD47GapClosureCurrentnessState
  readonly receiptFacts: GeneratedPlanD47ProposalAdmissionReceiptFacts
  readonly selectedForkReason: string
  readonly rejectedForks: readonly GeneratedPlanD01CapCatalogForkRejection[]
  readonly activationStatus: GeneratedPlanD01CapCatalogActivationStatus
  readonly expectedDiagnosticMovement: string
  readonly falsificationThreshold: string
  readonly nextArtifact: string
}

export type GeneratedPlanD01CapCatalogForkPacket =
  | (GeneratedPlanD01CapCatalogForkPacketBase & {
      readonly selectionState: Extract<
        GeneratedPlanD01CapCatalogForkSelectionState,
        'not_applicable_resume' | 'not_authorized_stale_or_inapplicable'
      >
      readonly selectedFork: 'none'
      readonly parentD47State: Extract<
        GeneratedPlanD01CapCatalogParentD47State,
        'resume_d47' | 'preserve_existing_d01_state'
      >
      readonly planningAuthorizationStatus: Extract<
        GeneratedPlanD01CapCatalogPlanningAuthorizationStatus,
        'not_ready_for_catalog_fill_planning'
      >
      readonly catalogEvaluation?: never
      readonly capEvaluation?: never
      readonly noChangeEvaluation?: never
    })
  | (GeneratedPlanD01CapCatalogForkPacketBase & {
      readonly selectionState: Extract<GeneratedPlanD01CapCatalogForkSelectionState, 'selected'>
      readonly selectedFork: Extract<GeneratedPlanD01CapCatalogFork, 'catalog_source_backed_delta'>
      readonly parentD47State: Extract<
        GeneratedPlanD01CapCatalogParentD47State,
        'd47_blocked_by_planning_ready_d01_delta'
      >
      readonly planningAuthorizationStatus: Extract<
        GeneratedPlanD01CapCatalogPlanningAuthorizationStatus,
        'ready_for_catalog_fill_planning'
      >
      readonly catalogEvaluation: GeneratedPlanD01CapCatalogCatalogEvaluation
      readonly capEvaluation?: never
      readonly noChangeEvaluation?: never
    })
  | (GeneratedPlanD01CapCatalogForkPacketBase & {
      readonly selectionState: Extract<GeneratedPlanD01CapCatalogForkSelectionState, 'selected'>
      readonly selectedFork: Extract<GeneratedPlanD01CapCatalogFork, 'cap_proposal'>
      readonly parentD47State: Extract<
        GeneratedPlanD01CapCatalogParentD47State,
        'd47_blocked_by_planning_ready_d01_delta'
      >
      readonly planningAuthorizationStatus: Extract<
        GeneratedPlanD01CapCatalogPlanningAuthorizationStatus,
        'not_ready_for_catalog_fill_planning'
      >
      readonly catalogEvaluation?: never
      readonly capEvaluation: GeneratedPlanD01CapCatalogCapEvaluation
      readonly noChangeEvaluation?: never
    })
  | (GeneratedPlanD01CapCatalogForkPacketBase & {
      readonly selectionState: Extract<GeneratedPlanD01CapCatalogForkSelectionState, 'selected'>
      readonly selectedFork: Extract<GeneratedPlanD01CapCatalogFork, 'accepted_no_change'>
      readonly parentD47State: Extract<
        GeneratedPlanD01CapCatalogParentD47State,
        'd47_resumed_d01_held'
      >
      readonly planningAuthorizationStatus: Extract<
        GeneratedPlanD01CapCatalogPlanningAuthorizationStatus,
        'not_ready_for_catalog_fill_planning'
      >
      readonly catalogEvaluation?: never
      readonly capEvaluation?: never
      readonly noChangeEvaluation: GeneratedPlanD01CapCatalogNoChangeEvaluation
    })
  | (GeneratedPlanD01CapCatalogForkPacketBase & {
      readonly selectionState: Extract<GeneratedPlanD01CapCatalogForkSelectionState, 'selected'>
      readonly selectedFork: Extract<GeneratedPlanD01CapCatalogFork, 'resume_d47_with_d01_held'>
      readonly parentD47State: Extract<
        GeneratedPlanD01CapCatalogParentD47State,
        'd47_resumed_d01_held'
      >
      readonly planningAuthorizationStatus: Extract<
        GeneratedPlanD01CapCatalogPlanningAuthorizationStatus,
        'not_ready_for_catalog_fill_planning'
      >
      readonly catalogEvaluation?: never
      readonly capEvaluation?: never
      readonly noChangeEvaluation?: never
    })

export type GeneratedPlanGapClosureSelectionArtifact =
  | 'd47_concrete_delta_proposal'
  | 'comparator_proposal'
  | 'd47_closed_by_d49_receipt'
  | 'cooldown_policy_receipt'
  | 'source_backed_gap_card_requirements'
  | 'cap_or_workload_proposal'
  | 'block_shape_proposal'
  | 'generator_policy_hypothesis'
  | 'accepted_no_change_receipt'
  | 'hold_for_evidence'

export type GeneratedPlanGapClosureSelectionState = 'selected' | 'hold_for_evidence'

export type GeneratedPlanGapClosureSelectionAuthorizationStatus = 'not_authorized'

export interface GeneratedPlanGapClosureRejectedAlternative {
  readonly label: string
  readonly groupKey?: string
  readonly affectedCellCount?: number
  readonly reason: string
  readonly reentryTrigger: string
}

export interface GeneratedPlanGapClosureSelectionWorkbench {
  readonly selectionState: GeneratedPlanGapClosureSelectionState
  readonly selectedTarget: string
  readonly selectedArtifact: GeneratedPlanGapClosureSelectionArtifact
  readonly selectedReason: string
  readonly authorizationStatus: GeneratedPlanGapClosureSelectionAuthorizationStatus
  readonly d01State: string
  readonly d47State: string
  readonly nextArtifact: string
  readonly stopCondition: string
  readonly rejectedAlternatives: readonly GeneratedPlanGapClosureRejectedAlternative[]
}

export type GeneratedPlanD49ResidualFollowUpAuthorizationStatus = 'not_authorized'

export type GeneratedPlanD49ResidualFollowUpLaneDisposition =
  | 'workload_review_needed'
  | 'route_to_u8'
  | 'accepted_residual_debt'
  | 'no_implementation_action_yet'

export type GeneratedPlanD49ResidualSelectedNextWork =
  | 'accept_residual_debt'
  | 'workload_metadata_review'
  | 'block_shape_review'
  | 'route_to_u8'
  | 'no_action'

export interface GeneratedPlanD49ResidualFollowUpLane {
  readonly label: string
  readonly disposition: GeneratedPlanD49ResidualFollowUpLaneDisposition
  readonly groupKeys: readonly string[]
  readonly totalAffectedCellCount: number
  readonly evidenceSummary: string
  readonly nextArtifact: string
}

export interface GeneratedPlanD49ChangeAuthorization {
  readonly cap: GeneratedPlanD49ResidualFollowUpAuthorizationStatus
  readonly catalog: GeneratedPlanD49ResidualFollowUpAuthorizationStatus
  readonly runtimeRedistribution: GeneratedPlanD49ResidualFollowUpAuthorizationStatus
  readonly d47Reopen: GeneratedPlanD49ResidualFollowUpAuthorizationStatus
}

export interface GeneratedPlanD49ResidualFollowUpPacket {
  readonly packetSource: string
  readonly d47ResolutionState: GeneratedPlanD47GapClosureCurrentnessState
  readonly authorizationStatus: GeneratedPlanD49ResidualFollowUpAuthorizationStatus
  readonly changeAuthorization: GeneratedPlanD49ChangeAuthorization
  readonly selectedNextWork: GeneratedPlanD49ResidualSelectedNextWork
  readonly selectedNextWorkRationale: string
  readonly selectedNextWorkOwner: 'maintainer'
  readonly selectedNextWorkRevisitTrigger: string
  readonly sessionQualityVerdict: string
  readonly workloadLane: GeneratedPlanD49ResidualFollowUpLane
  readonly redistributionLane: GeneratedPlanD49ResidualFollowUpLane
  readonly redistributionNoActionLane: GeneratedPlanD49ResidualFollowUpLane
  readonly activationBoundary: string
  readonly trainingQualityBoundary: string
  readonly nextArtifact: string
  readonly stopCondition: string
  readonly d47ReentryCondition: string
}

export type GeneratedPlanD47D05ComparatorOutcome =
  | 'd47_wins'
  | 'd05_wins'
  | 'hold_both_for_evidence'
  | 'accepted_no_change'

export type GeneratedPlanD47D05ComparatorSelectionState = 'selected' | 'hold_for_evidence'

export type GeneratedPlanD47D05ComparatorAuthorizationStatus = 'not_authorized'

export type GeneratedPlanD47D05ComparatorD05ProposalType =
  | 'workload_block_shape_proposal'
  | 'source_backed_gap_card_requirements'
  | 'generator_policy_hypothesis'

export interface GeneratedPlanD47D05ComparatorCandidateEvidence {
  readonly candidate: GeneratedPlanD47ProposalAdmissionCandidate
  readonly currentnessState: GeneratedPlanD47GapClosureCurrentnessState
  readonly receiptFacts: GeneratedPlanD47ProposalAdmissionReceiptFacts
  readonly servedSegment: string
  readonly sessionExposure: string
  readonly perceivedSessionFailure: string
}

interface GeneratedPlanD47D05ComparatorEvaluationBase {
  readonly servedSegment: string
  readonly sessionExposure: string
  readonly perceivedSessionFailure: string
  readonly changedSurface: string
  readonly smallestAction: string
  readonly expectedDiagnosticMovement: string
  readonly regressionRisk: string
  readonly noActionThreshold: string
  readonly loserReentryTrigger: string
  readonly trainingQualityValueScore: number
  readonly evidenceReadinessScore: number
  readonly futureSelectionPathScore: number
  readonly maintenanceCostScore: number
  readonly diagnosticMovementScore: number
  readonly strategicPriorityScore: number
  readonly tieBreakRationale: string
  readonly nextArtifact: string
}

export interface GeneratedPlanD47D05ComparatorD47Evaluation
  extends GeneratedPlanD47D05ComparatorEvaluationBase {
  readonly sourceAndAdaptationBasis: string
  readonly futureSelectionPath: string
}

export interface GeneratedPlanD47D05ComparatorD05Evaluation
  extends GeneratedPlanD47D05ComparatorEvaluationBase {
  readonly proposalType: GeneratedPlanD47D05ComparatorD05ProposalType
}

export interface GeneratedPlanD47D05ComparatorNoChangeEvaluation {
  readonly acceptanceEvidence: string
  readonly acceptedBlastRadius: string
  readonly noActionThreshold: string
  readonly revisitTrigger: string
  readonly nextArtifact: string
}

export interface GeneratedPlanD47D05ComparatorHoldEvaluation {
  readonly evidenceArtifact: string
  readonly owner: 'maintainer'
  readonly unblockCondition: string
  readonly stopCondition: string
  readonly nextArtifact: string
}

export interface GeneratedPlanD47D05ComparatorEvaluations {
  readonly d47Evaluation?: GeneratedPlanD47D05ComparatorD47Evaluation
  readonly d05Evaluation?: GeneratedPlanD47D05ComparatorD05Evaluation
  readonly noChangeEvaluation?: GeneratedPlanD47D05ComparatorNoChangeEvaluation
  readonly holdEvaluation?: GeneratedPlanD47D05ComparatorHoldEvaluation
}

export type GeneratedPlanD47D05ComparatorEvaluationPayload =
  | {
      readonly payloadPath: string
      readonly selectedOutcome: Extract<GeneratedPlanD47D05ComparatorOutcome, 'd47_wins'>
      readonly scoreSemantics: string
      readonly d47Evaluation: GeneratedPlanD47D05ComparatorD47Evaluation
      readonly d05Evaluation?: never
      readonly noChangeEvaluation?: never
      readonly holdEvaluation?: never
    }
  | {
      readonly payloadPath: string
      readonly selectedOutcome: Extract<GeneratedPlanD47D05ComparatorOutcome, 'd05_wins'>
      readonly scoreSemantics: string
      readonly d47Evaluation?: never
      readonly d05Evaluation: GeneratedPlanD47D05ComparatorD05Evaluation
      readonly noChangeEvaluation?: never
      readonly holdEvaluation?: never
    }
  | {
      readonly payloadPath: string
      readonly selectedOutcome: Extract<GeneratedPlanD47D05ComparatorOutcome, 'accepted_no_change'>
      readonly scoreSemantics: string
      readonly d47Evaluation?: never
      readonly d05Evaluation?: never
      readonly noChangeEvaluation: GeneratedPlanD47D05ComparatorNoChangeEvaluation
      readonly holdEvaluation?: never
    }
  | {
      readonly payloadPath: string
      readonly selectedOutcome: Extract<
        GeneratedPlanD47D05ComparatorOutcome,
        'hold_both_for_evidence'
      >
      readonly scoreSemantics: string
      readonly d47Evaluation?: never
      readonly d05Evaluation?: never
      readonly noChangeEvaluation?: never
      readonly holdEvaluation: GeneratedPlanD47D05ComparatorHoldEvaluation
    }

interface GeneratedPlanD47D05ComparatorDecisionPacketBase {
  readonly selectedOutcome: GeneratedPlanD47D05ComparatorOutcome
  readonly authorizationStatus: GeneratedPlanD47D05ComparatorAuthorizationStatus
  readonly d01State: string
  readonly d47State: string
  readonly d05State: string
  readonly d47Evidence: GeneratedPlanD47D05ComparatorCandidateEvidence
  readonly d05Evidence: GeneratedPlanD47D05ComparatorCandidateEvidence
  readonly tieBreakSummary: string
  readonly nextArtifact: string
  readonly stopCondition: string
}

export type GeneratedPlanD47D05ComparatorDecisionPacket =
  | (GeneratedPlanD47D05ComparatorDecisionPacketBase & {
      readonly selectionState: Extract<
        GeneratedPlanD47D05ComparatorSelectionState,
        'hold_for_evidence'
      >
      readonly selectedOutcome: Extract<
        GeneratedPlanD47D05ComparatorOutcome,
        'hold_both_for_evidence'
      >
      readonly holdEvaluation?: GeneratedPlanD47D05ComparatorHoldEvaluation
      readonly d47Evaluation?: never
      readonly d05Evaluation?: never
      readonly noChangeEvaluation?: never
    })
  | (GeneratedPlanD47D05ComparatorDecisionPacketBase & {
      readonly selectionState: Extract<GeneratedPlanD47D05ComparatorSelectionState, 'selected'>
      readonly selectedOutcome: Extract<GeneratedPlanD47D05ComparatorOutcome, 'd47_wins'>
      readonly d47Evaluation: GeneratedPlanD47D05ComparatorD47Evaluation
      readonly d05Evaluation?: never
      readonly noChangeEvaluation?: never
    })
  | (GeneratedPlanD47D05ComparatorDecisionPacketBase & {
      readonly selectionState: Extract<GeneratedPlanD47D05ComparatorSelectionState, 'selected'>
      readonly selectedOutcome: Extract<GeneratedPlanD47D05ComparatorOutcome, 'd05_wins'>
      readonly d47Evaluation?: never
      readonly d05Evaluation: GeneratedPlanD47D05ComparatorD05Evaluation
      readonly noChangeEvaluation?: never
    })
  | (GeneratedPlanD47D05ComparatorDecisionPacketBase & {
      readonly selectionState: Extract<GeneratedPlanD47D05ComparatorSelectionState, 'selected'>
      readonly selectedOutcome: Extract<GeneratedPlanD47D05ComparatorOutcome, 'accepted_no_change'>
      readonly d47Evaluation?: never
      readonly d05Evaluation?: never
      readonly noChangeEvaluation: GeneratedPlanD47D05ComparatorNoChangeEvaluation
    })

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
  'Diagnostic-only counterfactual receipt; shipped buildDraft() behavior may include separately authorized fills such as the D01 block-shape fill.'
const D47_PROPOSAL_ADMISSION_GROUP_KEY =
  'gpdg:v1:d47:d47-solo-open:main_skill:true:optional_slot_redistribution+over_authored_max+over_fatigue_cap'
const D05_COMPARATOR_GROUP_KEY =
  'gpdg:v1:d05:d05-solo:main_skill:true:optional_slot_redistribution+over_authored_max+over_fatigue_cap'
const D47_SOURCE_BACKED_GAP_CARD_PATH =
  'docs/reviews/2026-05-02-d47-source-backed-gap-card.md'
const D47_D05_COMPARATOR_EVALUATION_PAYLOAD_PATH =
  'docs/reviews/2026-05-02-d47-d05-comparator-evaluation-payload.md'
const D01_GAP_FILL_PROPOSAL_GROUP_KEY =
  'gpdg:v1:d01:d01-solo:main_skill:true:optional_slot_redistribution+over_authored_max+over_fatigue_cap'
const AUTHORIZED_D49_RESIDUAL_VARIANT_IDS = new Set(['d49-solo-open', 'd49-pair-open'])
const D49_RESIDUAL_FOLLOW_UP_PACKET_SOURCE =
  'D47 closed-by-D49 gap closure ledger plus current D49 generated diagnostics.'
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
const D01_BLOCK_SHAPE_FILL_BASELINE_RECEIPT_FACTS: GeneratedPlanD47ProposalAdmissionReceiptFacts = {
  totalAffectedCellCount: 18,
  pressureDisappearsCellCount: 0,
  pressureRemainsCellCount: 18,
  nonRedistributionPressureCellCount: 6,
  comparisonInconclusiveCellCount: 0,
  hasIncompleteEvidence: false,
  followUpRoutes: [
    'workload_review',
    'block_shape_review',
    'source_backed_proposal_work',
    'u6_proposal_admission_candidate',
  ],
}

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
    question:
      'Is the short wrap envelope acceptable, or does this need cap/block/content follow-up?',
    explanation:
      'Wrap under-min groups are likely cooldown policy questions before they are catalog gaps.',
    disposition: 'needs_human_decision',
    nextEvidenceNeeded:
      'Review cooldown minimum policy and decide whether U7 workload guidance should encode it.',
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
    question:
      'Are technique slots intentionally below authored minimums, or should catalog depth/block shape change?',
    explanation:
      'Technique under-min groups need human review before source-backed content or block-split work.',
    disposition: 'needs_human_decision',
    nextEvidenceNeeded:
      'Review whether these technique slots are acceptable short-form drills or content-depth candidates.',
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
    nextEvidenceNeeded:
      'Review cap policy and block split thresholds for the affected main-skill groups.',
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
    explanation:
      'Redistribution evidence means generator policy should be investigated before catalog changes.',
    disposition: 'needs_human_decision',
    nextEvidenceNeeded:
      'Compare redistribution-affected cells against non-redistribution over-cap cells.',
    recommendedFollowUpUnit: 'U8 redistribution comparison',
    candidateDispositions: ['route_to_U8'],
  },
  source_backed_content_depth_candidate: {
    label: 'Source-backed content-depth candidate',
    question: 'Is there enough evidence to write a source-backed gap card?',
    explanation:
      'Content-depth candidates require source-backed evidence before catalog activation.',
    disposition: 'needs_human_decision',
    nextEvidenceNeeded:
      'Attach a gap card, source reference, activation path, or explicit no-action decision.',
    recommendedFollowUpUnit: 'Pause until a concrete gap card exists',
    candidateDispositions: ['source_depth_candidate'],
  },
  low_volume_watchlist: {
    label: 'Low-volume watchlist',
    question: 'Should these small groups stay watched without implementation action?',
    explanation:
      'Low-volume groups with no stronger lane match should not drive immediate catalog or generator work.',
    disposition: 'no_implementation_action_yet',
    nextEvidenceNeeded:
      'Revisit only if the affected-cell count grows or the pattern repeats in a stronger lane.',
    recommendedFollowUpUnit: 'Pause',
    candidateDispositions: ['no_implementation_action_yet'],
  },
  unknown_unclassified: {
    label: 'Unknown or unclassified',
    question: 'What decision lane should this unexpected pattern use?',
    explanation: 'Unknown patterns must stay visible instead of disappearing into the watchlist.',
    disposition: 'needs_human_decision',
    nextEvidenceNeeded:
      'Classify the pattern or add an explicit compression lane before proceeding.',
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
  if (group.blockType === 'wrap' && groupHasObservationCode(group, 'under_authored_min')) {
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

  if (group.blockType === 'technique' && groupHasObservationCode(group, 'under_authored_min')) {
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

function redistributionCausalityCountsForGroup(
  group: GeneratedPlanObservationGroup,
): GeneratedPlanRedistributionCausalityCounts {
  return group.affectedCells
    .map((cell) => classifyRedistributionCausalityCell(group, cell))
    .reduce(addRedistributionCausalityCounts, emptyRedistributionCausalityCounts())
}

function buildRedistributionCausalityGroupReceipt(
  group: GeneratedPlanObservationGroup,
  entry: GeneratedPlanTriageEntry,
): GeneratedPlanRedistributionCausalityGroupReceipt {
  const counts = redistributionCausalityCountsForGroup(group)
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

function buildD47ProposalAdmissionReceiptFactsFromCounts(
  counts: GeneratedPlanRedistributionCausalityCounts,
): GeneratedPlanD47ProposalAdmissionReceiptFacts {
  const actionState = groupRedistributionCausalityActionState(counts)
  return {
    totalAffectedCellCount: counts.totalAffectedCellCount,
    pressureDisappearsCellCount: counts.pressureDisappearsCellCount,
    pressureRemainsCellCount: counts.pressureRemainsCellCount,
    nonRedistributionPressureCellCount:
      counts.nonRedistributionOverCapCellCount + counts.nonRedistributionUnderMinCellCount,
    comparisonInconclusiveCellCount: counts.comparisonInconclusiveCellCount,
    actionState,
    dominantCellState: dominantRedistributionCausalityState(counts),
    hasIncompleteEvidence: counts.comparisonInconclusiveCellCount > 0,
    followUpRoutes: followUpRoutesForRedistributionCausalityCounts(counts, actionState),
  }
}

function buildD47ProposalAdmissionReceiptFactsFromGroup(
  group: GeneratedPlanObservationGroup,
): GeneratedPlanD47ProposalAdmissionReceiptFacts {
  return buildD47ProposalAdmissionReceiptFactsFromCounts(
    redistributionCausalityCountsForGroup(group),
  )
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

  return buildD47ProposalAdmissionReceiptFactsFromCounts(group.counts)
}

export function buildGeneratedPlanD47ProposalAdmissionTicket(
  groups: readonly GeneratedPlanObservationGroup[],
  registry: readonly GeneratedPlanTriageEntry[],
): GeneratedPlanD47ProposalAdmissionTicket {
  const receipt = buildGeneratedPlanRedistributionCausalityReceipt(groups, registry)
  const group = receipt.groups.find(
    (candidate) => candidate.groupKey === D47_PROPOSAL_ADMISSION_GROUP_KEY,
  )
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
    group.counts.nonRedistributionOverCapCellCount + group.counts.nonRedistributionUnderMinCellCount
  )
}

export function authorizationStatusForGeneratedPlanD47GapClosureState(
  gapType: GeneratedPlanD47GapClosureGapType,
  decisionState: GeneratedPlanD47GapClosureDecisionState,
  currentnessState: GeneratedPlanD47GapClosureCurrentnessState,
  allSegmentsHaveDisposition: boolean,
): GeneratedPlanD47GapClosureAuthorizationStatus {
  if (currentnessState === 'closed_by_d49') {
    return decisionState === 'closed_validated' && allSegmentsHaveDisposition
      ? 'closed_with_fill'
      : 'not_authorized'
  }
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
  d47ClosedByD49Implementation: boolean,
): GeneratedPlanD47GapClosureCurrentnessState {
  if (d47ClosedByD49Implementation) return 'closed_by_d49'
  if (!ticket.candidateFound) return 'missing_or_shifted'
  return validation.issues.some(
    (issue) =>
      issue.code === 'stale_fingerprint' && issue.groupKey === D47_PROPOSAL_ADMISSION_GROUP_KEY,
  )
    ? 'stale'
    : 'current'
}

function buildD47GapClosureSegmentDispositions(
  receiptFacts: GeneratedPlanD47ProposalAdmissionReceiptFacts,
  d47ClosedByD49Implementation = false,
): GeneratedPlanD47GapClosureSegmentDisposition[] {
  if (d47ClosedByD49Implementation) {
    return [
      {
        segment: 'pressure_disappears',
        cellCount: 0,
        gapType: 'drill_inventory_gap',
        decisionState: 'closed_validated',
        authorizationStatus: 'closed_with_fill',
        disposition:
          'The original D47 optional-redistribution comparator key is absent after D49 selection-path implementation.',
        expectedDiagnosticMovement:
          'Keep the D47 comparator key absent; route residual long-session pressure through D49 follow-up.',
        expectedTrainingQualityMovement:
          'Use D49 round/reset structure for longer advanced setting blocks instead of stretching D47.',
      },
      {
        segment: 'pressure_remains',
        cellCount: 0,
        gapType: 'drill_inventory_gap',
        decisionState: 'closed_validated',
        authorizationStatus: 'closed_with_fill',
        disposition:
          'The D47 source-backed content-depth path was implemented as D49; no D47 stable-key pressure remains.',
        expectedDiagnosticMovement:
          'Residual D49 pressure should be handled as D49 workload/redistribution follow-up, not D47 stale evidence.',
        expectedTrainingQualityMovement:
          'D49 carries repeated recovery setting work with explicit rest instead of D47 four-location variability.',
      },
      {
        segment: 'non_redistribution_pressure',
        cellCount: 0,
        gapType: 'drill_inventory_gap',
        decisionState: 'closed_validated',
        authorizationStatus: 'closed_with_fill',
        disposition:
          'Non-redistribution evidence for the original D47 comparator key closed when D49 absorbed the advanced setting depth surface.',
        expectedDiagnosticMovement:
          'Do not reopen D47 unless regenerated diagnostics recreate the original D47 comparator key.',
        expectedTrainingQualityMovement:
          'Review any remaining advanced setting stretch against D49 workload policy.',
      },
    ]
  }

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

function isD47GapClosureTarget(group: GeneratedPlanRedistributionCausalityGroupReceipt): boolean {
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
    .filter((group) => {
      if (isD47GapClosureTarget(group)) return false
      if (blockedGroupKeys.has(group.groupKey)) return false
      if (nonRedistributionPressureCellCount(group) <= 0) return false
      return (
        comparatorIsSimplerThanD47(group, d47) || comparatorIsHigherConfidenceThanD47(group, d47)
      )
    })
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
  const higherConfidenceThanD47 = d47 ? comparatorIsHigherConfidenceThanD47(comparator, d47) : false
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

function d47ClosedByD49Implementation(
  receipt: GeneratedPlanRedistributionCausalityReceipt,
  d47ReceiptGroup: GeneratedPlanRedistributionCausalityGroupReceipt | undefined,
): boolean {
  return (
    d47ReceiptGroup === undefined &&
    receipt.groups.some((group) => isAuthorizedD49ResidualGroupShape(group))
  )
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
  const d47ClosedByD49 = d47ClosedByD49Implementation(receipt, d47ReceiptGroup)
  const currentnessState = currentnessStateForD47GapClosureLedger(
    ticket,
    validation,
    d47ClosedByD49,
  )
  const gapType: GeneratedPlanD47GapClosureGapType = d47ClosedByD49
    ? 'drill_inventory_gap'
    : 'undetermined'
  const decisionState: GeneratedPlanD47GapClosureDecisionState = d47ClosedByD49
    ? 'closed_validated'
    : 'evidence_gathering'
  const segmentDispositions = buildD47GapClosureSegmentDispositions(
    ticket.receiptFacts,
    d47ClosedByD49,
  )

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
      segmentDispositions.every(
        (segment) => segment.cellCount >= 0 && hasText(segment.disposition),
      ),
    ),
    suspectedTrainingGap: d47ClosedByD49
      ? 'The D47 source-backed content-depth gap was implemented through D49; remaining pressure now belongs to D49 workload/redistribution follow-up.'
      : D47_GAP_CLOSURE_SUSPECTED_TRAINING_GAP,
    receiptFacts: ticket.receiptFacts,
    segmentDispositions,
    comparatorReceipt,
    nextArtifact: {
      artifactType: d47ClosedByD49 ? 'd49_residual_follow_up' : 'comparator_receipt',
      owner: 'maintainer',
      evidenceSource: d47ClosedByD49
        ? 'Regenerated diagnostics after D49 catalog and selection-path implementation.'
        : 'Current U8 redistribution causality receipt and D47 admission ticket.',
      promotionCriteria:
        d47ClosedByD49
          ? 'Promote residual work only against D49 workload or redistribution evidence, not the closed D47 comparator key.'
          : 'Promote D47 only if it names stronger causal warrant, product impact, and a smaller fill artifact than the comparator.',
      abandonCriteria:
        d47ClosedByD49
          ? 'Re-enter D47 only if regenerated diagnostics recreate the original D47 comparator pressure.'
          : 'Abandon D47 if the comparator presents a simpler or higher-confidence path to a concrete gap fill.',
      noChangeCriteria:
        d47ClosedByD49
          ? 'No-change is not the current state; D49 was implemented and residual D49 evidence remains visible.'
          : 'Close without fill only when every segment has evidence, a no-action threshold, and a revisit trigger.',
    },
    sourceProvenance: D47_GAP_CLOSURE_SOURCE_PROVENANCE,
    sourceDeltaBoundary: D47_GAP_CLOSURE_SOURCE_DELTA_BOUNDARY,
    noChangeClosureBurden:
      'No-change closure requires dispositions for pressure-disappears, pressure-remains, and non-redistribution pressure segments.',
    reassessmentResult: d47ClosedByD49 ? 'validated' : 'not_started',
    reassessmentBoundary:
      d47ClosedByD49
        ? 'D47 diagnostic movement is validated by the missing stable comparator key; residual D49 pressure still needs workload/redistribution review.'
        : 'This slice records expected movement only; actual diagnostic and training-quality reassessment waits for a future fill.',
  }
}

function currentnessStateForD01GapFillProposal(
  group: GeneratedPlanRedistributionCausalityGroupReceipt | undefined,
  validation: GeneratedPlanTriageValidation,
): GeneratedPlanD47GapClosureCurrentnessState {
  if (!group) return 'missing_or_shifted'
  if (
    validation.blockingIssues.some(
      (issue) =>
        issue.groupKey === D01_GAP_FILL_PROPOSAL_GROUP_KEY && issue.code !== 'stale_fingerprint',
    )
  ) {
    return 'stale'
  }
  return validation.issues.some(
    (issue) =>
      issue.code === 'stale_fingerprint' && issue.groupKey === D01_GAP_FILL_PROPOSAL_GROUP_KEY,
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
    case 'closed_by_d49':
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

export function buildGeneratedPlanD01WorkloadBlockShapeProposal(
  groups: readonly GeneratedPlanObservationGroup[],
  registry: readonly GeneratedPlanTriageEntry[],
): GeneratedPlanD01WorkloadBlockShapeProposal {
  const gapFillProposal = buildGeneratedPlanD01GapFillProposal(groups, registry)

  return {
    candidateFound: gapFillProposal.candidateFound,
    candidate: gapFillProposal.candidate,
    currentnessState: gapFillProposal.currentnessState,
    authorizationStatus: 'not_authorized',
    selectedDisposition: 'block_shape_review_needed',
    secondaryDisposition: 'metadata_review_needed',
    metadataAction: 'unchanged',
    targetSurface: gapFillProposal.targetSurface,
    evidenceLayer:
      'Generated trace and block allocation are primary; D01 variant workload metadata is secondary.',
    recommendedFutureFillShape:
      'Future fill should split, repeat, or reroute the main-skill shape instead of stretching one short beginner passing drill.',
    blockShapeRationale:
      'D01 copy and streak scoring describe short repeated-contact work, not a long continuous main-skill workload.',
    expectedDiagnosticMovement:
      'A future block-shape fill should reduce D01 over-cap/fatigue pressure or route remaining pressure to an accepted policy allowance.',
    expectedTrainingQualityMovement:
      'A future fill should make beginner passing sessions feel more honest by reducing fatigue drift and clarifying when D01 repeats versus when another drill should carry the block.',
    noActionThreshold:
      'No change is acceptable only if remaining D01 pressure is explicitly policy-accepted with no cap widening and no hidden generator change.',
    revisitTrigger:
      'Revisit if regenerated D01 pressure increases, D01 becomes a top affected group again after a block-shape fill, or a concrete cap proposal is authored.',
    sourceBackedContentDisposition: 'source_depth_blocked',
    generatorPolicyDisposition: 'generator_policy_blocked',
    u6Eligibility: 'blocked_until_concrete_block_or_cap_proposal',
    reassessmentResult: 'not_started',
    reassessmentBoundary:
      'This proposal chooses the future fill direction only; actual diagnostic and training-quality reassessment waits for an authorized block-shape or cap proposal.',
  }
}

function diagnosticMovementForD01BlockShapeFill(
  currentFacts: GeneratedPlanD47ProposalAdmissionReceiptFacts,
): GeneratedPlanD01BlockShapeFillDiagnosticMovement {
  if (currentFacts.totalAffectedCellCount === 0) return 'validated'
  if (
    currentFacts.totalAffectedCellCount <
      D01_BLOCK_SHAPE_FILL_BASELINE_RECEIPT_FACTS.totalAffectedCellCount ||
    currentFacts.nonRedistributionPressureCellCount <
      D01_BLOCK_SHAPE_FILL_BASELINE_RECEIPT_FACTS.nonRedistributionPressureCellCount
  ) {
    return 'partially_validated'
  }
  return 'unresolved'
}

function diagnosticSummaryForD01BlockShapeFill(
  movement: GeneratedPlanD01BlockShapeFillDiagnosticMovement,
): string {
  switch (movement) {
    case 'validated':
      return 'The prior D01 target group is absent from current generated diagnostics.'
    case 'partially_validated':
      return 'The D01 fill reduced the target receipt but did not close every current D01 pressure cell.'
    case 'unresolved':
      return 'The D01 target group remains without measurable diagnostic movement.'
    default: {
      const exhaustive: never = movement
      return exhaustive
    }
  }
}

function remainingActionForD01BlockShapeFill(
  movement: GeneratedPlanD01BlockShapeFillDiagnosticMovement,
): string {
  switch (movement) {
    case 'validated':
      return 'Keep D01 metadata unchanged and move to manual training-quality dogfood only if courtside feel still looks suspect.'
    case 'partially_validated':
      return 'Keep the D01 fill receipt open; remaining D01 pressure needs either a redistribution-specific block-shape decision or a later concrete cap/catalog proposal.'
    case 'unresolved':
      return 'Return to block-shape planning before any U6, catalog, or metadata action.'
    default: {
      const exhaustive: never = movement
      return exhaustive
    }
  }
}

function redistributionHandoffStateForD01BlockShapeFill(
  currentFacts: GeneratedPlanD47ProposalAdmissionReceiptFacts,
): GeneratedPlanD01RedistributionHandoffState {
  if (currentFacts.totalAffectedCellCount === 0) return 'not_needed_target_absent'
  if (currentFacts.hasIncompleteEvidence || currentFacts.comparisonInconclusiveCellCount > 0) {
    return 'comparison_inconclusive'
  }
  if (
    currentFacts.pressureRemainsCellCount === currentFacts.totalAffectedCellCount &&
    currentFacts.pressureDisappearsCellCount === 0
  ) {
    return 'insufficient_allocated_pressure'
  }
  if (currentFacts.pressureDisappearsCellCount > 0 && currentFacts.pressureRemainsCellCount > 0) {
    return 'mixed_admission'
  }
  if (currentFacts.pressureDisappearsCellCount > 0) return 'admissible_candidate'
  return 'insufficient_allocated_pressure'
}

function redistributionHandoffReasonForD01BlockShapeFill(
  handoffState: GeneratedPlanD01RedistributionHandoffState,
): string {
  switch (handoffState) {
    case 'not_needed_target_absent':
      return 'The D01 target group is absent, so no redistribution handoff is needed for this target.'
    case 'admissible_candidate':
      return 'The target has pressure that disappears under allocated-duration comparison, so a bounded handoff may be admissible if it preserves training intent.'
    case 'mixed_admission':
      return 'Some target cells could benefit from handoff, but others retain allocated-duration pressure; handoff alone is not a full D01 closure.'
    case 'insufficient_allocated_pressure':
      return 'The current D01 target remains over cap even under allocated-duration comparison, so moving skipped optional minutes cannot close the gap.'
    case 'comparison_inconclusive':
      return 'The current D01 target has incomplete comparison evidence, so cap/catalog planning must wait for refreshed or more complete diagnostics.'
    default: {
      const exhaustive: never = handoffState
      return exhaustive
    }
  }
}

function d47NextStateForD01RedistributionHandoff(
  handoffState: GeneratedPlanD01RedistributionHandoffState,
): GeneratedPlanD01RedistributionNextState {
  switch (handoffState) {
    case 'not_needed_target_absent':
      return 'resume_d47'
    case 'admissible_candidate':
    case 'mixed_admission':
    case 'comparison_inconclusive':
      return 'd01_still_open'
    case 'insufficient_allocated_pressure':
      return 'cap_or_catalog_proposal_needed'
    default: {
      const exhaustive: never = handoffState
      return exhaustive
    }
  }
}

export function buildGeneratedPlanD01BlockShapeFillReceipt(
  groups: readonly GeneratedPlanObservationGroup[],
): GeneratedPlanD01BlockShapeFillReceipt {
  const d01TargetGroup = groups.find(
    (candidate) => candidate.groupKey === D01_GAP_FILL_PROPOSAL_GROUP_KEY,
  )
  const currentReceiptFacts =
    d01TargetGroup === undefined
      ? buildD47ProposalAdmissionReceiptFacts(undefined)
      : buildD47ProposalAdmissionReceiptFactsFromGroup(d01TargetGroup)
  const diagnosticMovement = diagnosticMovementForD01BlockShapeFill(currentReceiptFacts)
  const redistributionHandoffState =
    redistributionHandoffStateForD01BlockShapeFill(currentReceiptFacts)

  return {
    targetGroupKey: D01_GAP_FILL_PROPOSAL_GROUP_KEY,
    targetFound: d01TargetGroup !== undefined,
    diagnosticMovement,
    trainingQualityState: 'not_field_validated',
    redistributionHandoffState,
    redistributionHandoffReason: redistributionHandoffReasonForD01BlockShapeFill(
      redistributionHandoffState,
    ),
    d47NextState: d47NextStateForD01RedistributionHandoff(redistributionHandoffState),
    baselineReceiptFacts: D01_BLOCK_SHAPE_FILL_BASELINE_RECEIPT_FACTS,
    currentReceiptFacts,
    appliedFill:
      'Duration-aware D01 main-skill reroute: avoid stretching `d01-solo` beyond its authored max/fatigue cap when an eligible same-slot candidate can carry more of the block.',
    metadataAction: 'unchanged',
    sourceBackedContentDisposition: 'source_depth_blocked',
    u6Eligibility: 'deferred_no_cap_or_catalog_delta',
    diagnosticSummary: diagnosticSummaryForD01BlockShapeFill(diagnosticMovement),
    trainingQualityBoundary:
      'Generated diagnostics can validate workload-envelope movement, but field training quality remains unvalidated until a manual courtside dogfood receipt exists.',
    remainingAction: remainingActionForD01BlockShapeFill(diagnosticMovement),
  }
}

function isCatalogEvaluationPlanningReady(
  evaluation: GeneratedPlanD01CapCatalogCatalogEvaluation | undefined,
): evaluation is GeneratedPlanD01CapCatalogCatalogEvaluation {
  return (
    evaluation !== undefined &&
    hasText(evaluation.suspectedCatalogGap) &&
    evaluation.changedOrMissingCatalogIds.length > 0 &&
    evaluation.changedOrMissingCatalogIds.every(hasText) &&
    hasText(evaluation.sourcePathOrNeeds) &&
    hasText(evaluation.adaptationDelta) &&
    hasText(evaluation.expectedDiagnosticMovement) &&
    hasText(evaluation.verificationCommand) &&
    hasText(evaluation.checkpointCriteria) &&
    hasText(evaluation.nextArtifact)
  )
}

function isCapEvaluationPlanningReady(
  evaluation: GeneratedPlanD01CapCatalogCapEvaluation | undefined,
): evaluation is GeneratedPlanD01CapCatalogCapEvaluation {
  return (
    evaluation !== undefined &&
    hasText(evaluation.proposedCapDelta) &&
    hasText(evaluation.segmentAndCopySupport) &&
    hasText(evaluation.rejectedCatalogRationale) &&
    hasText(evaluation.expectedDiagnosticMovement) &&
    hasText(evaluation.futureU6Condition) &&
    hasText(evaluation.falsificationThreshold)
  )
}

function isNoChangeEvaluationPlanningReady(
  evaluation: GeneratedPlanD01CapCatalogNoChangeEvaluation | undefined,
): evaluation is GeneratedPlanD01CapCatalogNoChangeEvaluation {
  return (
    evaluation !== undefined &&
    hasText(evaluation.owner) &&
    hasText(evaluation.rationale) &&
    hasText(evaluation.acceptedBlastRadius) &&
    hasText(evaluation.noActionThreshold) &&
    hasText(evaluation.revisitTrigger)
  )
}

function rejectedForksForD01CapCatalogPacket(
  selectedFork: GeneratedPlanD01CapCatalogFork | 'none',
  readiness: Record<GeneratedPlanD01CapCatalogFork, boolean>,
): GeneratedPlanD01CapCatalogForkRejection[] {
  return D01_CAP_CATALOG_FORKS.filter((fork) => fork !== selectedFork).map((fork) => ({
    fork,
    reason: readiness[fork]
      ? 'A planning-ready payload exists, but a higher-priority fork was selected for this packet.'
      : rejectedForkReasonForD01CapCatalogPacket(fork),
  }))
}

function rejectedForkReasonForD01CapCatalogPacket(fork: GeneratedPlanD01CapCatalogFork): string {
  switch (fork) {
    case 'cap_proposal':
      return 'No complete cap evaluation payload names a cap delta, copy support, rejected catalog rationale, U6 condition, and falsification threshold.'
    case 'catalog_source_backed_delta':
      return 'No gap-card-ready catalog evaluation payload names changed or missing IDs, source path or needs, adaptation delta, verification, and checkpoint criteria.'
    case 'accepted_no_change':
      return 'No complete no-change evaluation payload names owner, rationale, accepted blast radius, no-action threshold, and revisit trigger.'
    case 'resume_d47_with_d01_held':
      return 'A more actionable cap, catalog, or no-change fork is available.'
    default: {
      const exhaustive: never = fork
      return exhaustive
    }
  }
}

export function buildGeneratedPlanD01CapCatalogForkPacket(
  groups: readonly GeneratedPlanObservationGroup[],
  registry: readonly GeneratedPlanTriageEntry[],
  evaluations: GeneratedPlanD01CapCatalogForkEvaluations = {},
): GeneratedPlanD01CapCatalogForkPacket {
  const fillReceipt = buildGeneratedPlanD01BlockShapeFillReceipt(groups)
  const workloadProposal = buildGeneratedPlanD01WorkloadBlockShapeProposal(groups, registry)
  const readiness: Record<GeneratedPlanD01CapCatalogFork, boolean> = {
    cap_proposal: isCapEvaluationPlanningReady(evaluations.capEvaluation),
    catalog_source_backed_delta: isCatalogEvaluationPlanningReady(evaluations.catalogEvaluation),
    accepted_no_change: isNoChangeEvaluationPlanningReady(evaluations.noChangeEvaluation),
    resume_d47_with_d01_held: true,
  }

  const basePacket = {
    targetGroupKey: fillReceipt.targetGroupKey,
    targetFound: fillReceipt.targetFound,
    currentnessState: workloadProposal.currentnessState,
    receiptFacts: fillReceipt.currentReceiptFacts,
    activationStatus: 'not_authorized' as const,
  }

  if (!fillReceipt.targetFound || fillReceipt.d47NextState === 'resume_d47') {
    return {
      ...basePacket,
      selectionState: 'not_applicable_resume',
      selectedFork: 'none',
      selectedForkReason:
        'D01 target is absent or already validated, so no cap/catalog fork is needed before D47 resumes.',
      rejectedForks: [],
      parentD47State: 'resume_d47',
      planningAuthorizationStatus: 'not_ready_for_catalog_fill_planning',
      expectedDiagnosticMovement:
        'No D01 cap/catalog diagnostic movement is expected because the target is absent.',
      falsificationThreshold:
        'Reopen only if the D01 target group reappears in current diagnostics.',
      nextArtifact: 'resume_d47',
    }
  }

  if (workloadProposal.currentnessState !== 'current') {
    return {
      ...basePacket,
      selectionState: 'not_authorized_stale_or_inapplicable',
      selectedFork: 'none',
      selectedForkReason: `D01 evidence is ${workloadProposal.currentnessState}; refresh diagnostics before selecting cap, catalog, no-change, or D47-resume work.`,
      rejectedForks: [],
      parentD47State: 'preserve_existing_d01_state',
      planningAuthorizationStatus: 'not_ready_for_catalog_fill_planning',
      expectedDiagnosticMovement:
        'No movement should be projected from stale or shifted D01 evidence.',
      falsificationThreshold:
        'A refreshed current D01 receipt is required before any fork can be selected.',
      nextArtifact: 'refresh_generated_diagnostics',
    }
  }

  if (
    fillReceipt.redistributionHandoffState !== 'insufficient_allocated_pressure' ||
    fillReceipt.d47NextState !== 'cap_or_catalog_proposal_needed'
  ) {
    return {
      ...basePacket,
      selectionState: 'not_authorized_stale_or_inapplicable',
      selectedFork: 'none',
      selectedForkReason:
        'D01 is not in the insufficient allocated-pressure / cap-or-catalog state required for this fork packet.',
      rejectedForks: [],
      parentD47State: 'preserve_existing_d01_state',
      planningAuthorizationStatus: 'not_ready_for_catalog_fill_planning',
      expectedDiagnosticMovement:
        'No cap/catalog diagnostic movement is projected from an inapplicable D01 state.',
      falsificationThreshold:
        'Use the existing D01 receipt next state instead of this fork packet.',
      nextArtifact: 'preserve_existing_d01_next_state',
    }
  }

  if (isCatalogEvaluationPlanningReady(evaluations.catalogEvaluation)) {
    return {
      ...basePacket,
      selectionState: 'selected',
      selectedFork: 'catalog_source_backed_delta',
      selectedForkReason:
        'A gap-card-ready catalog evaluation is present, so D01 can hand off to catalog-fill planning without authorizing activation.',
      rejectedForks: rejectedForksForD01CapCatalogPacket('catalog_source_backed_delta', readiness),
      parentD47State: 'd47_blocked_by_planning_ready_d01_delta',
      planningAuthorizationStatus: 'ready_for_catalog_fill_planning',
      expectedDiagnosticMovement: evaluations.catalogEvaluation.expectedDiagnosticMovement,
      falsificationThreshold: evaluations.catalogEvaluation.checkpointCriteria,
      nextArtifact: evaluations.catalogEvaluation.nextArtifact,
      catalogEvaluation: evaluations.catalogEvaluation,
    }
  }

  if (isCapEvaluationPlanningReady(evaluations.capEvaluation)) {
    return {
      ...basePacket,
      selectionState: 'selected',
      selectedFork: 'cap_proposal',
      selectedForkReason:
        'A complete cap evaluation is present, so D01 can move to cap proposal planning without editing metadata in this slice.',
      rejectedForks: rejectedForksForD01CapCatalogPacket('cap_proposal', readiness),
      parentD47State: 'd47_blocked_by_planning_ready_d01_delta',
      planningAuthorizationStatus: 'not_ready_for_catalog_fill_planning',
      expectedDiagnosticMovement: evaluations.capEvaluation.expectedDiagnosticMovement,
      falsificationThreshold: evaluations.capEvaluation.falsificationThreshold,
      nextArtifact: 'd01_cap_proposal',
      capEvaluation: evaluations.capEvaluation,
    }
  }

  if (isNoChangeEvaluationPlanningReady(evaluations.noChangeEvaluation)) {
    return {
      ...basePacket,
      selectionState: 'selected',
      selectedFork: 'accepted_no_change',
      selectedForkReason:
        'A complete no-change evaluation is present, so D01 can close or hold as accepted diagnostic debt.',
      rejectedForks: rejectedForksForD01CapCatalogPacket('accepted_no_change', readiness),
      parentD47State: 'd47_resumed_d01_held',
      planningAuthorizationStatus: 'not_ready_for_catalog_fill_planning',
      expectedDiagnosticMovement:
        'No diagnostic movement is expected; revisit only if the no-action threshold is exceeded.',
      falsificationThreshold: evaluations.noChangeEvaluation.noActionThreshold,
      nextArtifact: 'resume_d47_with_accepted_d01_debt',
      noChangeEvaluation: evaluations.noChangeEvaluation,
    }
  }

  return {
    ...basePacket,
    selectionState: 'selected',
    selectedFork: 'resume_d47_with_d01_held',
    selectedForkReason:
      evaluations.d47ResumeEvaluation?.reason ??
      'No cap, catalog, or no-change payload is planning-ready, so D47 should resume with D01 held visibly instead of blocking behind vague catalog uncertainty.',
    rejectedForks: rejectedForksForD01CapCatalogPacket('resume_d47_with_d01_held', readiness),
    parentD47State: 'd47_resumed_d01_held',
    planningAuthorizationStatus: 'not_ready_for_catalog_fill_planning',
    expectedDiagnosticMovement:
      'No D01 movement is expected until a cap, catalog, or no-change payload becomes planning-ready.',
    falsificationThreshold:
      'Reopen D01 as blocking only when a complete cap, catalog, or no-change evaluation payload is available.',
    nextArtifact: evaluations.d47ResumeEvaluation?.heldState ?? 'resume_d47_with_d01_held',
  }
}

export function formatGeneratedPlanD01CapCatalogForkPacketMarkdown(
  packet: GeneratedPlanD01CapCatalogForkPacket,
): string[] {
  const lines = [
    '- Packet source: D01 block-shape fill receipt plus cap/catalog fork requirements.',
    `- Target group: \`${packet.targetGroupKey}\``,
    `- Target found: ${packet.targetFound ? 'yes' : 'no'}`,
    `- Currentness: \`${packet.currentnessState}\``,
    `- Selection state: \`${packet.selectionState}\``,
    `- Selected fork: \`${packet.selectedFork}\``,
    `- Selected-fork reason: ${packet.selectedForkReason}`,
    `- Parent D47 state: \`${packet.parentD47State}\``,
    `- Planning authorization status: \`${packet.planningAuthorizationStatus}\``,
    `- Activation status: \`${packet.activationStatus}\``,
    `- Expected diagnostic movement: ${packet.expectedDiagnosticMovement}`,
    `- Falsification threshold: ${packet.falsificationThreshold}`,
    `- Next artifact: \`${packet.nextArtifact}\``,
    `- Rejected forks: ${
      packet.rejectedForks.length === 0
        ? 'None.'
        : packet.rejectedForks
            .map((rejection) => `\`${rejection.fork}\` (${rejection.reason})`)
            .join('; ')
    }`,
  ]
  if (packet.selectedFork === 'catalog_source_backed_delta') {
    lines.push(
      `- Catalog gap: ${packet.catalogEvaluation.suspectedCatalogGap}`,
      `- Changed or missing catalog IDs: ${packet.catalogEvaluation.changedOrMissingCatalogIds
        .map((id) => `\`${id}\``)
        .join(', ')}`,
      `- Source path or needs: ${packet.catalogEvaluation.sourcePathOrNeeds}`,
      `- Adaptation delta: ${packet.catalogEvaluation.adaptationDelta}`,
      `- Verification command: \`${packet.catalogEvaluation.verificationCommand}\``,
      `- Checkpoint criteria: ${packet.catalogEvaluation.checkpointCriteria}`,
    )
  }
  return lines
}

function currentnessStateForComparatorGroup(
  groupKey: string,
  group: GeneratedPlanRedistributionCausalityGroupReceipt | undefined,
  validation: GeneratedPlanTriageValidation,
): GeneratedPlanD47GapClosureCurrentnessState {
  if (!group) return 'missing_or_shifted'
  return validation.issues.some(
    (issue) => issue.code === 'stale_fingerprint' && issue.groupKey === groupKey,
  )
    ? 'stale'
    : 'current'
}

function buildD47ComparatorEvidence(
  ledger: GeneratedPlanD47GapClosureLedger,
): GeneratedPlanD47D05ComparatorCandidateEvidence {
  return {
    candidate: ledger.candidate,
    currentnessState: ledger.currentnessState,
    receiptFacts: ledger.receiptFacts,
    servedSegment: 'intermediate/advanced open-court setting and movement practice',
    sessionExposure:
      'D47 appears as a current main-skill pressure candidate with 30 affected cells and mixed redistribution causality.',
    perceivedSessionFailure:
      'Generated sessions may overuse a 5-9 minute advanced setting/movement surface when the training need may require either a deeper source-backed sibling, workload/block-shape work, or no change.',
  }
}

function buildD05ComparatorEvidence(
  group: GeneratedPlanRedistributionCausalityGroupReceipt | undefined,
  currentnessState: GeneratedPlanD47GapClosureCurrentnessState,
): GeneratedPlanD47D05ComparatorCandidateEvidence {
  return {
    candidate: {
      groupKey: D05_COMPARATOR_GROUP_KEY,
      diagnosticFingerprint: group?.diagnosticFingerprint,
      drillId: group?.drillId,
      variantId: group?.variantId,
      blockType: group?.blockType,
      triageRoute: group?.triageRoute,
      reviewedReportId: group?.reviewedReportId,
    },
    currentnessState,
    receiptFacts: buildD47ProposalAdmissionReceiptFacts(group),
    servedSegment: 'beginner/intermediate solo passing trust work',
    sessionExposure:
      'D05 appears as the simpler current main-skill comparator with fewer affected cells and non-redistribution pressure.',
    perceivedSessionFailure:
      'Generated sessions may stretch a short solo passing drill beyond its honest workload instead of choosing a clearer workload, block-shape, source-backed, generator-policy, or no-change proposal.',
  }
}

function hasFiniteNumber(value: number): boolean {
  return Number.isFinite(value)
}

function isComparatorEvaluationBaseReady(
  evaluation: GeneratedPlanD47D05ComparatorEvaluationBase | undefined,
): evaluation is GeneratedPlanD47D05ComparatorEvaluationBase {
  return (
    evaluation !== undefined &&
    hasText(evaluation.servedSegment) &&
    hasText(evaluation.sessionExposure) &&
    hasText(evaluation.perceivedSessionFailure) &&
    hasText(evaluation.changedSurface) &&
    hasText(evaluation.smallestAction) &&
    hasText(evaluation.expectedDiagnosticMovement) &&
    hasText(evaluation.regressionRisk) &&
    hasText(evaluation.noActionThreshold) &&
    hasText(evaluation.loserReentryTrigger) &&
    hasFiniteNumber(evaluation.trainingQualityValueScore) &&
    hasFiniteNumber(evaluation.evidenceReadinessScore) &&
    hasFiniteNumber(evaluation.futureSelectionPathScore) &&
    hasFiniteNumber(evaluation.maintenanceCostScore) &&
    hasFiniteNumber(evaluation.diagnosticMovementScore) &&
    hasFiniteNumber(evaluation.strategicPriorityScore) &&
    hasText(evaluation.tieBreakRationale) &&
    hasText(evaluation.nextArtifact)
  )
}

function comparatorEvidenceIsCurrentAndComplete(
  evidence: GeneratedPlanD47D05ComparatorCandidateEvidence,
): boolean {
  return (
    evidence.currentnessState === 'current' &&
    !evidence.receiptFacts.hasIncompleteEvidence &&
    evidence.receiptFacts.comparisonInconclusiveCellCount === 0
  )
}

function isD47ComparatorEvaluationReady(
  evaluation: GeneratedPlanD47D05ComparatorD47Evaluation | undefined,
  d47Evidence: GeneratedPlanD47D05ComparatorCandidateEvidence,
): evaluation is GeneratedPlanD47D05ComparatorD47Evaluation {
  return (
    comparatorEvidenceIsCurrentAndComplete(d47Evidence) &&
    isD47ComparatorEvaluationPayloadComplete(evaluation)
  )
}

function isD47ComparatorEvaluationPayloadComplete(
  evaluation: GeneratedPlanD47D05ComparatorD47Evaluation | undefined,
): evaluation is GeneratedPlanD47D05ComparatorD47Evaluation {
  return (
    isComparatorEvaluationBaseReady(evaluation) &&
    hasText(evaluation.sourceAndAdaptationBasis) &&
    hasText(evaluation.futureSelectionPath)
  )
}

function isD05ComparatorEvaluationReady(
  evaluation: GeneratedPlanD47D05ComparatorD05Evaluation | undefined,
  d05Evidence: GeneratedPlanD47D05ComparatorCandidateEvidence,
): evaluation is GeneratedPlanD47D05ComparatorD05Evaluation {
  return (
    comparatorEvidenceIsCurrentAndComplete(d05Evidence) &&
    isComparatorEvaluationBaseReady(evaluation)
  )
}

function isD47D05NoChangeEvaluationReady(
  evaluation: GeneratedPlanD47D05ComparatorNoChangeEvaluation | undefined,
): evaluation is GeneratedPlanD47D05ComparatorNoChangeEvaluation {
  return (
    evaluation !== undefined &&
    hasText(evaluation.acceptanceEvidence) &&
    hasText(evaluation.acceptedBlastRadius) &&
    hasText(evaluation.noActionThreshold) &&
    hasText(evaluation.revisitTrigger) &&
    hasText(evaluation.nextArtifact)
  )
}

function comparatorEvaluationScore(
  evaluation: GeneratedPlanD47D05ComparatorEvaluationBase,
): readonly number[] {
  return [
    evaluation.trainingQualityValueScore,
    evaluation.evidenceReadinessScore,
    evaluation.futureSelectionPathScore,
    evaluation.maintenanceCostScore,
    evaluation.diagnosticMovementScore,
    evaluation.strategicPriorityScore,
  ]
}

function d47ComparatorEvaluationBeatsD05(
  d47Evaluation: GeneratedPlanD47D05ComparatorD47Evaluation,
  d05Evaluation: GeneratedPlanD47D05ComparatorD05Evaluation,
): boolean {
  const d47Score = comparatorEvaluationScore(d47Evaluation)
  const d05Score = comparatorEvaluationScore(d05Evaluation)
  for (let index = 0; index < d47Score.length; index += 1) {
    const delta = d47Score[index] - d05Score[index]
    if (delta !== 0) return delta > 0
  }
  return false
}

function holdReasonForComparatorPacket(
  d01Fork: GeneratedPlanD01CapCatalogForkPacket,
  d47Evidence: GeneratedPlanD47D05ComparatorCandidateEvidence,
  d05Evidence: GeneratedPlanD47D05ComparatorCandidateEvidence,
): string {
  if (
    d01Fork.selectionState !== 'selected' ||
    d01Fork.selectedFork !== 'resume_d47_with_d01_held'
  ) {
    return 'D01 is not visibly held behind D47 reentry, so the comparator must hold before choosing D47 or D05.'
  }
  if (d05Evidence.currentnessState !== 'current') {
    return 'D05 evidence is missing or stale; it cannot win, and D47 still needs a complete evaluation before promotion.'
  }
  if (!comparatorEvidenceIsCurrentAndComplete(d05Evidence)) {
    return 'D05 receipt evidence is incomplete or comparison-inconclusive, so D05 cannot be compared or closed.'
  }
  if (d47Evidence.currentnessState === 'closed_by_d49') {
    return 'D47 evidence is closed by D49 implementation; keep D47 closed and route residual pressure through D49 follow-up unless a complete comparator payload is supplied.'
  }
  if (d47Evidence.currentnessState !== 'current') {
    return 'D47 evidence is not current, so D47 cannot be compared or promoted.'
  }
  if (!comparatorEvidenceIsCurrentAndComplete(d47Evidence)) {
    return 'D47 receipt evidence is incomplete or comparison-inconclusive, so D47 cannot be promoted.'
  }
  return 'Neither D47 nor D05 has a complete symmetric evaluation payload, so hold for one named comparator evidence artifact.'
}

export function buildCurrentGeneratedPlanD47D05ComparatorEvaluationPayload(): GeneratedPlanD47D05ComparatorEvaluationPayload {
  return {
    payloadPath: D47_D05_COMPARATOR_EVALUATION_PAYLOAD_PATH,
    selectedOutcome: 'd47_wins',
    scoreSemantics:
      'Scores are ordinal comparator evidence where higher is better; maintenanceCostScore means lower maintenance cost and clearer ownership when higher.',
    d47Evaluation: {
      servedSegment: 'advanced open-court setting and movement practice',
      sessionExposure:
        'D47 is current in generated main-skill pressure with 30 affected cells, 18 cells that remain under allocated-duration comparison, and 6 non-redistribution pressure cells.',
      perceivedSessionFailure:
        'Advanced setting sessions can overuse the current short 5-9 minute D47 surface when the training need is repeated out-of-system movement and set quality under fatigue.',
      changedSurface:
        'Use the held D47 source-backed gap card as input for a candidate D49-style advanced setting/movement sibling family; do not widen current D47 caps in this payload.',
      smallestAction:
        'Plan a source-backed catalog addition from the D47 gap card next, while preserving D05 as a re-entry comparator if source/adaptation review fails.',
      expectedDiagnosticMovement:
        'A later catalog plan should reduce D47 over-cap pressure only if generated sessions can select the new advanced setting/movement surface for longer main-skill blocks.',
      regressionRisk:
        'D47 may still fail source/adaptation review for 1-2 player M001 use, or catalog content may not move diagnostics unless selection can prefer the new surface.',
      noActionThreshold:
        'Do not proceed to catalog implementation if the source/adaptation review cannot prove a 1-2 player open-court drill materially different from current FIVB 4.7 D47.',
      loserReentryTrigger:
        'Re-enter D05 if D47 source/adaptation review fails, if the later catalog plan cannot name selection-path movement, or if regenerated diagnostics show no intended D47 movement.',
      trainingQualityValueScore: 5,
      evidenceReadinessScore: 4,
      futureSelectionPathScore: 4,
      maintenanceCostScore: 3,
      diagnosticMovementScore: 3,
      strategicPriorityScore: 4,
      tieBreakRationale:
        'D47 wins this comparator because it has a named source-backed content-depth delta and a concrete advanced-session selection-path hypothesis; D05 remains simpler but has not yet named a stronger next proposal than the D47 gap card.',
      nextArtifact: 'D47 source-backed catalog implementation plan',
      sourceAndAdaptationBasis:
        'The held D47 gap card cites existing FIVB 4.7 as the current boundary plus Better at Beach solo setting work, JVA out-of-system/up-and-back setting drills, and TAOCV set-and-go conditioning as source/adaptation candidates that still require 1-2 player review.',
      futureSelectionPath:
        'Future generated advanced setting/movement main-skill blocks should have a distinct longer-duration source-backed surface available instead of repeatedly stretching `d47-solo-open` beyond its honest envelope.',
    },
  }
}

export function evaluationsForGeneratedPlanD47D05ComparatorPayload(
  payload: GeneratedPlanD47D05ComparatorEvaluationPayload,
): GeneratedPlanD47D05ComparatorEvaluations {
  switch (payload.selectedOutcome) {
    case 'd47_wins':
      return { d47Evaluation: payload.d47Evaluation }
    case 'd05_wins':
      return { d05Evaluation: payload.d05Evaluation }
    case 'accepted_no_change':
      return { noChangeEvaluation: payload.noChangeEvaluation }
    case 'hold_both_for_evidence':
      return { holdEvaluation: payload.holdEvaluation }
    default: {
      const exhaustive: never = payload
      return exhaustive
    }
  }
}

export function formatGeneratedPlanD47D05ComparatorEvaluationPayloadMarkdown(
  payload: GeneratedPlanD47D05ComparatorEvaluationPayload,
): string[] {
  const lines = [
    `- Payload source: \`${payload.payloadPath}\``,
    `- Selected proof path: \`${payload.selectedOutcome}\``,
    `- Score semantics: ${payload.scoreSemantics}`,
  ]

  switch (payload.selectedOutcome) {
    case 'd47_wins':
      lines.push(
        `- Served segment: ${payload.d47Evaluation.servedSegment}`,
        `- Session exposure: ${payload.d47Evaluation.sessionExposure}`,
        `- Perceived session failure: ${payload.d47Evaluation.perceivedSessionFailure}`,
        `- Changed surface: ${payload.d47Evaluation.changedSurface}`,
        `- Smallest action: ${payload.d47Evaluation.smallestAction}`,
        `- Source/adaptation basis: ${payload.d47Evaluation.sourceAndAdaptationBasis}`,
        `- Future selection path: ${payload.d47Evaluation.futureSelectionPath}`,
        `- Expected diagnostic movement: ${payload.d47Evaluation.expectedDiagnosticMovement}`,
        `- Regression risk: ${payload.d47Evaluation.regressionRisk}`,
        `- No-action threshold: ${payload.d47Evaluation.noActionThreshold}`,
        `- D05 re-entry trigger: ${payload.d47Evaluation.loserReentryTrigger}`,
        `- Follow-up artifact: ${payload.d47Evaluation.nextArtifact}`,
      )
      return lines
    case 'd05_wins':
      lines.push(
        `- Proposal type: \`${payload.d05Evaluation.proposalType}\``,
        `- Changed surface: ${payload.d05Evaluation.changedSurface}`,
        `- Loser re-entry trigger: ${payload.d05Evaluation.loserReentryTrigger}`,
        `- Follow-up artifact: ${payload.d05Evaluation.nextArtifact}`,
      )
      return lines
    case 'accepted_no_change':
      lines.push(
        `- Acceptance evidence: ${payload.noChangeEvaluation.acceptanceEvidence}`,
        `- Accepted blast radius: ${payload.noChangeEvaluation.acceptedBlastRadius}`,
        `- No-action threshold: ${payload.noChangeEvaluation.noActionThreshold}`,
        `- Revisit trigger: ${payload.noChangeEvaluation.revisitTrigger}`,
        `- Follow-up artifact: ${payload.noChangeEvaluation.nextArtifact}`,
      )
      return lines
    case 'hold_both_for_evidence':
      lines.push(
        `- Evidence artifact: ${payload.holdEvaluation.evidenceArtifact}`,
        `- Owner: \`${payload.holdEvaluation.owner}\``,
        `- Unblock condition: ${payload.holdEvaluation.unblockCondition}`,
        `- Stop condition: ${payload.holdEvaluation.stopCondition}`,
        `- Follow-up artifact: ${payload.holdEvaluation.nextArtifact}`,
      )
      return lines
    default: {
      const exhaustive: never = payload
      return exhaustive
    }
  }
}

export function buildGeneratedPlanD47D05ComparatorDecisionPacket(
  groups: readonly GeneratedPlanObservationGroup[],
  registry: readonly GeneratedPlanTriageEntry[],
  evaluations: GeneratedPlanD47D05ComparatorEvaluations = {},
): GeneratedPlanD47D05ComparatorDecisionPacket {
  const validation = validateGeneratedPlanTriageCoverage(groups, registry)
  const d01Fork = buildGeneratedPlanD01CapCatalogForkPacket(groups, registry)
  const d47Ledger = buildGeneratedPlanD47GapClosureLedger(groups, registry)
  const receipt = buildGeneratedPlanRedistributionCausalityReceipt(groups, registry)
  const d05Group = receipt.groups.find((candidate) => candidate.groupKey === D05_COMPARATOR_GROUP_KEY)
  const d05CurrentnessState = currentnessStateForComparatorGroup(
    D05_COMPARATOR_GROUP_KEY,
    d05Group,
    validation,
  )
  const d47Evidence = buildD47ComparatorEvidence(d47Ledger)
  const d05Evidence = buildD05ComparatorEvidence(d05Group, d05CurrentnessState)
  const d47ClosedByD49Implementation =
    d47Evidence.currentnessState === 'closed_by_d49' &&
    d47Evidence.receiptFacts.totalAffectedCellCount === 0 &&
    receipt.groups.some(
      (group) => group.drillId === 'd49' && group.blockType === 'main_skill',
    )
  const d01State = `${d01Fork.selectionState}:${d01Fork.selectedFork}:${d01Fork.parentD47State}`
  const d47State = `${d47Evidence.currentnessState}:${
    d47Ledger.decisionState
  }:${d47Ledger.authorizationStatus}`
  const d05State = `${d05Evidence.currentnessState}:${d05Evidence.receiptFacts.totalAffectedCellCount}:${d05Evidence.receiptFacts.nonRedistributionPressureCellCount}`
  const basePacket = {
    authorizationStatus: 'not_authorized' as const,
    d01State,
    d47State,
    d05State,
    d47Evidence,
    d05Evidence,
    stopCondition:
      'Do not edit catalog, workload metadata, block shape, generator policy, U6 preview, runtime generation, or app surfaces from this comparator packet.',
  }

  const d47Ready =
    isD47ComparatorEvaluationReady(evaluations.d47Evaluation, d47Evidence) ||
    (d47ClosedByD49Implementation &&
      isD47ComparatorEvaluationPayloadComplete(evaluations.d47Evaluation))
  const d05Ready = isD05ComparatorEvaluationReady(evaluations.d05Evaluation, d05Evidence)
  const noChangeReady = isD47D05NoChangeEvaluationReady(evaluations.noChangeEvaluation)
  const hasConflictingNoChangeProof = noChangeReady && (d47Ready || d05Ready)
  const d01Held =
    d01Fork.selectionState === 'selected' &&
    d01Fork.selectedFork === 'resume_d47_with_d01_held' &&
    d01Fork.parentD47State === 'd47_resumed_d01_held'
  const comparatorEvidenceReady =
    (comparatorEvidenceIsCurrentAndComplete(d47Evidence) || d47ClosedByD49Implementation) &&
    comparatorEvidenceIsCurrentAndComplete(d05Evidence)

  if (
    d01Held &&
    comparatorEvidenceReady &&
    !hasConflictingNoChangeProof &&
    d47Ready &&
    (!d05Ready || d47ComparatorEvaluationBeatsD05(evaluations.d47Evaluation, evaluations.d05Evaluation))
  ) {
    return {
      ...basePacket,
      selectionState: 'selected',
      selectedOutcome: 'd47_wins',
      d47Evaluation: evaluations.d47Evaluation,
      tieBreakSummary: evaluations.d47Evaluation.tieBreakRationale,
      nextArtifact: evaluations.d47Evaluation.nextArtifact,
    }
  }

  if (d01Held && comparatorEvidenceReady && !hasConflictingNoChangeProof && d05Ready) {
    return {
      ...basePacket,
      selectionState: 'selected',
      selectedOutcome: 'd05_wins',
      d05Evaluation: evaluations.d05Evaluation,
      tieBreakSummary: evaluations.d05Evaluation.tieBreakRationale,
      nextArtifact: evaluations.d05Evaluation.nextArtifact,
    }
  }

  if (d01Held && comparatorEvidenceReady && !hasConflictingNoChangeProof && noChangeReady) {
    return {
      ...basePacket,
      selectionState: 'selected',
      selectedOutcome: 'accepted_no_change',
      noChangeEvaluation: evaluations.noChangeEvaluation,
      tieBreakSummary:
        'No-change is accepted only because an explicit acceptance receipt, blast radius, no-action threshold, and revisit trigger are present for both D47 and D05.',
      nextArtifact: evaluations.noChangeEvaluation.nextArtifact,
    }
  }

  return {
    ...basePacket,
    ...(evaluations.holdEvaluation ? { holdEvaluation: evaluations.holdEvaluation } : {}),
    ...(evaluations.holdEvaluation ? { stopCondition: evaluations.holdEvaluation.stopCondition } : {}),
    selectionState: 'hold_for_evidence',
    selectedOutcome: 'hold_both_for_evidence',
    tieBreakSummary: hasConflictingNoChangeProof
      ? 'Multiple comparator proof paths are complete, including accepted no-change; resolve the conflict before selecting D47, D05, or no-change.'
      : evaluations.holdEvaluation
        ? `Hold payload selected: ${evaluations.holdEvaluation.unblockCondition}`
        : holdReasonForComparatorPacket(d01Fork, d47Evidence, d05Evidence),
    nextArtifact: evaluations.holdEvaluation?.nextArtifact ?? 'D47-vs-D05 comparator evaluation payload',
  }
}

export function formatGeneratedPlanD47D05ComparatorDecisionPacketMarkdown(
  packet: GeneratedPlanD47D05ComparatorDecisionPacket,
): string[] {
  const lines = [
    '- Packet source: Gap Closure Selection plus D47/D05 redistribution receipts.',
    `- Selection state: \`${packet.selectionState}\``,
    `- Selected outcome: \`${packet.selectedOutcome}\``,
    `- Authorization status: \`${packet.authorizationStatus}\``,
    `- D01 state: \`${packet.d01State}\``,
    `- D47 state: \`${packet.d47State}\``,
    `- D05 state: \`${packet.d05State}\``,
    `- D47 facts: total affected cells ${packet.d47Evidence.receiptFacts.totalAffectedCellCount}, pressure disappears ${packet.d47Evidence.receiptFacts.pressureDisappearsCellCount}, pressure remains ${packet.d47Evidence.receiptFacts.pressureRemainsCellCount}, non-redistribution pressure ${packet.d47Evidence.receiptFacts.nonRedistributionPressureCellCount}, inconclusive ${packet.d47Evidence.receiptFacts.comparisonInconclusiveCellCount}`,
    `- D05 facts: total affected cells ${packet.d05Evidence.receiptFacts.totalAffectedCellCount}, pressure disappears ${packet.d05Evidence.receiptFacts.pressureDisappearsCellCount}, pressure remains ${packet.d05Evidence.receiptFacts.pressureRemainsCellCount}, non-redistribution pressure ${packet.d05Evidence.receiptFacts.nonRedistributionPressureCellCount}, inconclusive ${packet.d05Evidence.receiptFacts.comparisonInconclusiveCellCount}`,
    `- D47 session problem: ${packet.d47Evidence.perceivedSessionFailure}`,
    `- D05 session problem: ${packet.d05Evidence.perceivedSessionFailure}`,
    `- Tie-break summary: ${packet.tieBreakSummary}`,
    `- Next artifact: ${packet.nextArtifact}`,
    `- Stop condition: ${packet.stopCondition}`,
  ]

  if (packet.selectionState === 'hold_for_evidence') {
    lines.push(
      `- Held exhibit: \`${D47_SOURCE_BACKED_GAP_CARD_PATH}\` remains conditional evidence, not authorization.`,
    )
    if (packet.holdEvaluation) {
      lines.push(
        `- Hold evidence artifact: ${packet.holdEvaluation.evidenceArtifact}`,
        `- Hold unblock condition: ${packet.holdEvaluation.unblockCondition}`,
      )
    }
  }

  if (packet.selectedOutcome === 'd47_wins') {
    lines.push(
      `- D47 changed surface: ${packet.d47Evaluation.changedSurface}`,
      `- D47 source/adaptation basis: ${packet.d47Evaluation.sourceAndAdaptationBasis}`,
      `- D47 future selection path: ${packet.d47Evaluation.futureSelectionPath}`,
      `- Loser re-entry trigger: ${packet.d47Evaluation.loserReentryTrigger}`,
      `- Gap-card input: \`${D47_SOURCE_BACKED_GAP_CARD_PATH}\``,
    )
  }

  if (packet.selectedOutcome === 'd05_wins') {
    lines.push(
      `- D05 proposal type: \`${packet.d05Evaluation.proposalType}\``,
      `- D05 changed surface: ${packet.d05Evaluation.changedSurface}`,
      `- D05 loser re-entry trigger: ${packet.d05Evaluation.loserReentryTrigger}`,
    )
  }

  if (packet.selectedOutcome === 'accepted_no_change') {
    lines.push(
      `- No-change acceptance evidence: ${packet.noChangeEvaluation.acceptanceEvidence}`,
      `- Accepted blast radius: ${packet.noChangeEvaluation.acceptedBlastRadius}`,
      `- No-action threshold: ${packet.noChangeEvaluation.noActionThreshold}`,
      `- Revisit trigger: ${packet.noChangeEvaluation.revisitTrigger}`,
    )
  }

  return lines
}

function findObservationGroup(
  groups: readonly GeneratedPlanObservationGroup[],
  predicate: (group: GeneratedPlanObservationGroup) => boolean,
): GeneratedPlanObservationGroup | undefined {
  return groups.find(predicate)
}

function rejectedAlternativeFromGroup(
  label: string,
  group: GeneratedPlanObservationGroup | undefined,
  reason: string,
  reentryTrigger: string,
): GeneratedPlanGapClosureRejectedAlternative {
  return {
    label,
    groupKey: group?.groupKey,
    affectedCellCount: group?.affectedCellCount,
    reason,
    reentryTrigger,
  }
}

function groupHasMainSkillRedistributionPressure(group: GeneratedPlanObservationGroup): boolean {
  return (
    group.blockType === 'main_skill' &&
    group.observationCodes.includes('optional_slot_redistribution') &&
    (group.observationCodes.includes('over_authored_max') ||
      group.observationCodes.includes('over_fatigue_cap'))
  )
}

function findGroupByKey(
  groups: readonly GeneratedPlanObservationGroup[],
  groupKey: string,
): GeneratedPlanObservationGroup | undefined {
  return groups.find((group) => group.groupKey === groupKey)
}

function buildGapClosureRejectedAlternatives(
  groups: readonly GeneratedPlanObservationGroup[],
): GeneratedPlanGapClosureRejectedAlternative[] {
  const d25Cooldown = findObservationGroup(
    groups,
    (group) =>
      group.drillId === 'd25' && group.variantId === 'd25-solo' && group.blockType === 'wrap',
  )
  const d05Comparator = findObservationGroup(
    groups,
    (group) =>
      group.drillId === 'd05' &&
      group.variantId === 'd05-solo' &&
      groupHasMainSkillRedistributionPressure(group),
  )
  const adjacentAdvancedGroup = [
    'gpdg:v1:d46:d46-solo-open:main_skill:true:optional_slot_redistribution+over_authored_max+over_fatigue_cap',
    'gpdg:v1:d33:d33-solo-open:main_skill:true:optional_slot_redistribution+over_authored_max+over_fatigue_cap',
    'gpdg:v1:d47:d47-pair-open:main_skill:true:optional_slot_redistribution+over_authored_max+over_fatigue_cap',
  ]
    .map((groupKey) => findGroupByKey(groups, groupKey))
    .find((group): group is GeneratedPlanObservationGroup =>
      group === undefined ? false : groupHasMainSkillRedistributionPressure(group),
    )

  return [
    rejectedAlternativeFromGroup(
      'D25 cooldown policy receipt',
      d25Cooldown,
      'Largest affected count, but wrap under-min pressure routes to cooldown policy review before catalog work.',
      'Promote when the next product question is accepting or revising short-session Downshift policy.',
    ),
    rejectedAlternativeFromGroup(
      'D05 comparator proposal',
      d05Comparator,
      d05Comparator
        ? 'Strong comparator, but first use D47 reentry to decide whether D47 can name stronger causal warrant than the comparator.'
        : 'No current D05 comparator evidence is available in the generated observations.',
      'Promote if D47 cannot name a concrete delta or if comparator evidence becomes the smaller artifact.',
    ),
    rejectedAlternativeFromGroup(
      'Adjacent advanced mixed-pressure group',
      adjacentAdvancedGroup,
      'Relevant advanced-depth signal, but less directly tied to the current D01-held / D47-reentry fork.',
      'Promote after D47 reentry closes, holds, or rejects its concrete-delta path.',
    ),
  ]
}

export function buildGeneratedPlanGapClosureSelectionWorkbench(
  groups: readonly GeneratedPlanObservationGroup[],
  registry: readonly GeneratedPlanTriageEntry[],
): GeneratedPlanGapClosureSelectionWorkbench {
  const d01Fork = buildGeneratedPlanD01CapCatalogForkPacket(groups, registry)
  const d47Ledger = buildGeneratedPlanD47GapClosureLedger(groups, registry)
  const rejectedAlternatives = buildGapClosureRejectedAlternatives(groups)
  const d01State = `${d01Fork.selectionState}:${d01Fork.selectedFork}:${d01Fork.parentD47State}`
  const d47State = `${d47Ledger.currentnessState}:${d47Ledger.decisionState}:${d47Ledger.authorizationStatus}`
  const d47CanReenter =
    d01Fork.selectionState === 'selected' &&
    d01Fork.selectedFork === 'resume_d47_with_d01_held' &&
    d47Ledger.candidateFound &&
    d47Ledger.currentnessState === 'current' &&
    !d47Ledger.receiptFacts.hasIncompleteEvidence &&
    d47Ledger.receiptFacts.comparisonInconclusiveCellCount === 0

  if (
    d47Ledger.currentnessState === 'closed_by_d49' &&
    d01Fork.selectionState === 'selected' &&
    d01Fork.selectedFork === 'resume_d47_with_d01_held'
  ) {
    return {
      selectionState: 'selected',
      selectedTarget: 'd47/d47-solo-open closed by d49',
      selectedArtifact: 'd47_closed_by_d49_receipt',
      selectedReason:
        'D47 source-backed catalog work has moved the original D47 comparator pressure onto D49; remaining evidence should be handled as D49 residual workload or redistribution follow-up.',
      authorizationStatus: 'not_authorized',
      d01State,
      d47State,
      nextArtifact: 'D49 residual redistribution/workload follow-up',
      stopCondition:
        'Do not reopen D47 unless regenerated diagnostics recreate the original D47 comparator key; route remaining advanced setting stretch through D49.',
      rejectedAlternatives,
    }
  }

  if (!d47CanReenter) {
    return {
      selectionState: 'hold_for_evidence',
      selectedTarget: 'none',
      selectedArtifact: 'hold_for_evidence',
      selectedReason:
        'Current D01/D47 evidence does not support D47 reentry selection; hold until diagnostics produce a current D01-held and D47-current state.',
      authorizationStatus: 'not_authorized',
      d01State,
      d47State,
      nextArtifact: 'refresh_or_review_gap_closure_evidence',
      stopCondition:
        'Do not plan catalog, workload, block-shape, U6, or generator edits from stale or inapplicable selection evidence.',
      rejectedAlternatives,
    }
  }

  return {
    selectionState: 'selected',
    selectedTarget: 'd47/d47-solo-open vs d05/d05-solo',
    selectedArtifact: 'comparator_proposal',
    selectedReason:
      'D01 is held visibly and D47 is current, but D05 is a simpler comparator; the next smallest high-quality artifact is a D47-vs-D05 comparator proposal that lets D47 proceed only if it names stronger causal warrant and athlete-facing session value.',
    authorizationStatus: 'not_authorized',
    d01State,
    d47State,
    nextArtifact: 'D47-vs-D05 comparator proposal requirements',
    stopCondition:
      'Stop before implementation edits unless the proposal names the athlete/session problem, changed surface, evidence basis, expected diagnostic movement, no-action threshold, and why D47 beats the comparator.',
    rejectedAlternatives,
  }
}

export function formatGeneratedPlanGapClosureSelectionWorkbenchMarkdown(
  selection: GeneratedPlanGapClosureSelectionWorkbench,
): string[] {
  return [
    '- Selection source: D01 cap/catalog fork packet plus D47 gap closure ledger.',
    `- Selection state: \`${selection.selectionState}\``,
    `- Selected target: \`${selection.selectedTarget}\``,
    `- Selected artifact: \`${selection.selectedArtifact}\``,
    `- Selected reason: ${selection.selectedReason}`,
    `- Authorization status: \`${selection.authorizationStatus}\``,
    `- D01 state: \`${selection.d01State}\``,
    `- D47 state: \`${selection.d47State}\``,
    `- Next artifact: ${selection.nextArtifact}`,
    `- Stop condition: ${selection.stopCondition}`,
    '',
    '### Rejected Alternatives',
    '',
    ...selection.rejectedAlternatives.map(
      (alternative) =>
        `- ${alternative.label}${alternative.groupKey ? ` (\`${alternative.groupKey}\`, ${alternative.affectedCellCount ?? 0} cells)` : ''}: ${alternative.reason} Re-entry trigger: ${alternative.reentryTrigger}`,
    ),
  ]
}

function isAuthorizedD49ResidualGroupShape(
  group: Pick<GeneratedPlanObservationGroup, 'drillId' | 'variantId' | 'blockType'>,
): boolean {
  return (
    group.drillId === 'd49' &&
    group.blockType === 'main_skill' &&
    group.variantId !== undefined &&
    AUTHORIZED_D49_RESIDUAL_VARIANT_IDS.has(group.variantId)
  )
}

type GeneratedPlanEvidenceGroupKeySet = Pick<ReadonlySet<string>, 'has'>

function currentD49EvidenceGroupKeys(
  validation: GeneratedPlanTriageValidation,
): GeneratedPlanEvidenceGroupKeySet {
  const blockedGroupKeys = new Set(validation.blockingIssues.map((issue) => issue.groupKey))
  return {
    has: (groupKey: string) => !blockedGroupKeys.has(groupKey),
  }
}

function d49WorkloadResidualGroups(
  groups: readonly GeneratedPlanObservationGroup[],
  currentEvidenceGroupKeys: GeneratedPlanEvidenceGroupKeySet,
): GeneratedPlanObservationGroup[] {
  return groups.filter(
    (group) =>
      isAuthorizedD49ResidualGroupShape(group) &&
      currentEvidenceGroupKeys.has(group.groupKey) &&
      group.observationCodes.includes('under_authored_min') &&
      !group.observationCodes.includes('optional_slot_redistribution'),
  )
}

function d49RedistributionResidualGroups(
  receipt: GeneratedPlanRedistributionCausalityReceipt,
  currentEvidenceGroupKeys: GeneratedPlanEvidenceGroupKeySet,
): GeneratedPlanRedistributionCausalityGroupReceipt[] {
  return receipt.groups.filter(
    (group) => isAuthorizedD49ResidualGroupShape(group) && currentEvidenceGroupKeys.has(group.groupKey),
  )
}

function d49RedistributionPressureGroups(
  groups: readonly GeneratedPlanRedistributionCausalityGroupReceipt[],
): GeneratedPlanRedistributionCausalityGroupReceipt[] {
  return groups.filter(
    (group) =>
      group.actionState === 'likely_redistribution_caused' &&
      (group.counts.currentOverAuthoredMaxCellCount > 0 ||
        group.counts.currentOverFatigueCapCellCount > 0),
  )
}

function d49RedistributionNoActionGroups(
  groups: readonly GeneratedPlanRedistributionCausalityGroupReceipt[],
): GeneratedPlanRedistributionCausalityGroupReceipt[] {
  return groups.filter((group) => group.actionState === 'redistribution_without_pressure')
}

function d49WorkloadLane(
  groups: readonly GeneratedPlanObservationGroup[],
): GeneratedPlanD49ResidualFollowUpLane {
  const totalAffectedCellCount = groups.reduce(
    (sum, group) => sum + group.affectedCellCount,
    0,
  )

  if (groups.length === 0) {
    return {
      label: 'D49 workload envelope review',
      disposition: 'no_implementation_action_yet',
      groupKeys: [],
      totalAffectedCellCount: 0,
      evidenceSummary:
        'No current D49 under-min main-skill workload groups are present in generated diagnostics.',
      nextArtifact: 'No D49 workload action until regenerated diagnostics show workload evidence.',
    }
  }

  return {
    label: 'D49 workload envelope review',
    disposition: 'workload_review_needed',
    groupKeys: groups.map((group) => group.groupKey),
    totalAffectedCellCount,
    evidenceSummary:
      'D49 under-min main-skill groups should be reviewed against block allocation, copy, and workload metadata before any cap or catalog proposal.',
    nextArtifact: 'D49 workload envelope review; no metadata change without a concrete proposal.',
  }
}

function d49RedistributionLane(
  groups: readonly GeneratedPlanRedistributionCausalityGroupReceipt[],
): GeneratedPlanD49ResidualFollowUpLane {
  const totalAffectedCellCount = groups.reduce(
    (sum, group) => sum + group.counts.totalAffectedCellCount,
    0,
  )
  const pressureDisappearsCellCount = groups.reduce(
    (sum, group) => sum + group.counts.pressureDisappearsCellCount,
    0,
  )
  const pressureRemainsCellCount = groups.reduce(
    (sum, group) => sum + group.counts.pressureRemainsCellCount,
    0,
  )
  const redistributionWithoutPressureCellCount = groups.reduce(
    (sum, group) => sum + group.counts.redistributionWithoutPressureCellCount,
    0,
  )

  if (groups.length === 0) {
    return {
      label: 'D49 redistribution investigation',
      disposition: 'no_implementation_action_yet',
      groupKeys: [],
      totalAffectedCellCount: 0,
      evidenceSummary:
        'No pressure-bearing D49 optional-slot redistribution groups are present in the redistribution causality receipt.',
      nextArtifact: 'No D49 U8 action until regenerated diagnostics show pressure-bearing redistribution evidence.',
    }
  }

  return {
    label: 'D49 redistribution investigation',
    disposition: 'route_to_u8',
    groupKeys: groups.map((group) => group.groupKey),
    totalAffectedCellCount,
    evidenceSummary: `D49 redistribution receipt groups include ${pressureDisappearsCellCount} cells where pressure disappears under allocated-duration comparison, ${pressureRemainsCellCount} cells where pressure remains, and ${redistributionWithoutPressureCellCount} redistribution-only cells.`,
    nextArtifact:
      'Existing redistribution causality receipt evidence routes to a future generator-policy follow-up; do not change runtime redistribution here.',
  }
}

function d49RedistributionNoActionLane(
  groups: readonly GeneratedPlanRedistributionCausalityGroupReceipt[],
): GeneratedPlanD49ResidualFollowUpLane {
  const totalAffectedCellCount = groups.reduce(
    (sum, group) => sum + group.counts.totalAffectedCellCount,
    0,
  )

  if (groups.length === 0) {
    return {
      label: 'D49 optional-slot-only redistribution',
      disposition: 'no_implementation_action_yet',
      groupKeys: [],
      totalAffectedCellCount: 0,
      evidenceSummary:
        'No D49 optional-slot-only redistribution groups are present in the redistribution causality receipt.',
      nextArtifact: 'No optional-slot-only D49 action.',
    }
  }

  return {
    label: 'D49 optional-slot-only redistribution',
    disposition: 'accepted_residual_debt',
    groupKeys: groups.map((group) => group.groupKey),
    totalAffectedCellCount,
    evidenceSummary:
      'D49 optional-slot redistribution exists without cap, fatigue, or minimum pressure; keep it visible but do not promote it to U8 work.',
    nextArtifact: 'No implementation action; revisit only if regenerated diagnostics add cap or fatigue pressure.',
  }
}

function selectedNextWorkForD49ResidualPacket(
  d47ResolutionState: GeneratedPlanD47GapClosureCurrentnessState,
  workloadLane: GeneratedPlanD49ResidualFollowUpLane,
  redistributionLane: GeneratedPlanD49ResidualFollowUpLane,
  noActionLane: GeneratedPlanD49ResidualFollowUpLane,
): GeneratedPlanD49ResidualSelectedNextWork {
  if (d47ResolutionState !== 'closed_by_d49') return 'no_action'
  if (redistributionLane.disposition === 'route_to_u8') return 'route_to_u8'
  if (workloadLane.disposition === 'workload_review_needed') return 'workload_metadata_review'
  if (noActionLane.disposition === 'accepted_residual_debt') return 'accept_residual_debt'
  return 'no_action'
}

function selectedNextWorkRationaleForD49ResidualPacket(
  selectedNextWork: GeneratedPlanD49ResidualSelectedNextWork,
): string {
  switch (selectedNextWork) {
    case 'route_to_u8':
      return 'Pressure-bearing D49 optional-slot redistribution disappears under allocated-duration comparison, so future generator-policy follow-up is the first useful decision.'
    case 'workload_metadata_review':
      return 'D49 has workload-envelope evidence but no pressure-bearing redistribution evidence, so workload metadata and block allocation should be reviewed before cap changes.'
    case 'accept_residual_debt':
      return 'Only optional-slot redistribution without cap/fatigue/minimum pressure remains, so the residual is visible but not implementation-worthy.'
    case 'block_shape_review':
      return 'D49 evidence indicates a future block-shape review, but this branch is not selected by current generated diagnostics.'
    case 'no_action':
      return 'No D49 implementation action is selected; either D47 must re-enter first or regenerated diagnostics no longer show D49 residual pressure.'
    default: {
      const exhaustive: never = selectedNextWork
      return exhaustive
    }
  }
}

function selectedNextWorkRevisitTriggerForD49ResidualPacket(
  selectedNextWork: GeneratedPlanD49ResidualSelectedNextWork,
): string {
  switch (selectedNextWork) {
    case 'route_to_u8':
      return 'Revisit after a D49-scoped generator-policy proposal proves allocated-duration counterfactual movement without broad runtime redistribution changes.'
    case 'workload_metadata_review':
      return 'Revisit when a concrete D49 workload proposal names the metadata or block-shape delta and expected diagnostic movement.'
    case 'accept_residual_debt':
      return 'Revisit only if optional-slot-only D49 groups gain cap, fatigue, or under-min pressure.'
    case 'block_shape_review':
      return 'Revisit when a D49 block-shape proposal exists.'
    case 'no_action':
      return 'Revisit if the original D47 comparator key returns or regenerated diagnostics show new D49 pressure.'
    default: {
      const exhaustive: never = selectedNextWork
      return exhaustive
    }
  }
}

function nextArtifactForD49ResidualPacket(
  selectedNextWork: GeneratedPlanD49ResidualSelectedNextWork,
  workloadLane: GeneratedPlanD49ResidualFollowUpLane,
): string {
  switch (selectedNextWork) {
    case 'route_to_u8':
      return workloadLane.disposition === 'workload_review_needed'
        ? 'D49 workload envelope review plus future U8 generator-policy follow-up'
        : 'Future U8 generator-policy follow-up'
    case 'workload_metadata_review':
      return 'D49 workload envelope review; no metadata change without a concrete proposal.'
    case 'accept_residual_debt':
      return 'No D49 implementation action; optional-slot-only redistribution remains visible residual debt.'
    case 'block_shape_review':
      return 'D49 block-shape review; no runtime or catalog change without a concrete proposal.'
    case 'no_action':
      return 'No D49 residual follow-up until regenerated diagnostics show D49 pressure.'
    default: {
      const exhaustive: never = selectedNextWork
      return exhaustive
    }
  }
}

export function buildGeneratedPlanD49ResidualFollowUpPacket(
  groups: readonly GeneratedPlanObservationGroup[],
  registry: readonly GeneratedPlanTriageEntry[],
): GeneratedPlanD49ResidualFollowUpPacket {
  const validation = validateGeneratedPlanTriageCoverage(groups, registry)
  const d47Ledger = buildGeneratedPlanD47GapClosureLedger(groups, registry)
  const redistributionReceipt = buildGeneratedPlanRedistributionCausalityReceipt(groups, registry)
  const currentEvidenceGroupKeys = currentD49EvidenceGroupKeys(validation)
  const workloadLane = d49WorkloadLane(d49WorkloadResidualGroups(groups, currentEvidenceGroupKeys))
  const d49RedistributionGroups = d49RedistributionResidualGroups(
    redistributionReceipt,
    currentEvidenceGroupKeys,
  )
  const redistributionLane = d49RedistributionLane(
    d49RedistributionPressureGroups(d49RedistributionGroups),
  )
  const redistributionNoActionLane = d49RedistributionNoActionLane(
    d49RedistributionNoActionGroups(d49RedistributionGroups),
  )
  const originalD47ComparatorKeyPresent = groups.some(
    (group) => group.groupKey === D47_PROPOSAL_ADMISSION_GROUP_KEY,
  )
  const d47ResolutionState = originalD47ComparatorKeyPresent
    ? d47Ledger.currentnessState
    : 'closed_by_d49'
  const canRouteToD49ResidualFollowUp = d47ResolutionState === 'closed_by_d49'
  const selectedNextWork = selectedNextWorkForD49ResidualPacket(
    d47ResolutionState,
    workloadLane,
    redistributionLane,
    redistributionNoActionLane,
  )

  return {
    packetSource: D49_RESIDUAL_FOLLOW_UP_PACKET_SOURCE,
    d47ResolutionState,
    authorizationStatus: 'not_authorized',
    changeAuthorization: {
      cap: 'not_authorized',
      catalog: 'not_authorized',
      runtimeRedistribution: 'not_authorized',
      d47Reopen: 'not_authorized',
    },
    selectedNextWork,
    selectedNextWorkRationale: selectedNextWorkRationaleForD49ResidualPacket(selectedNextWork),
    selectedNextWorkOwner: 'maintainer',
    selectedNextWorkRevisitTrigger:
      selectedNextWorkRevisitTriggerForD49ResidualPacket(selectedNextWork),
    sessionQualityVerdict:
      'generated_review_needed: before accepting residual debt or promoting D49 metadata/block-shape work, inspect generated D49-affected sessions for interval/rest honesty, set-quality protection, and capture-surface fit.',
    workloadLane,
    redistributionLane,
    redistributionNoActionLane,
    activationBoundary:
      'D49 remains bounded to the authorized solo/pair open advanced setting/movement family: one ball, markers, no 3+ player source forms, and no generic conditioning expansion. This packet does not widen D49 caps, add content, or change D47/D05.',
    trainingQualityBoundary:
      'Generated diagnostics can route workload and redistribution questions, but D49 training quality still needs manual courtside validation before broader claims.',
    nextArtifact: !canRouteToD49ResidualFollowUp
      ? 'D47 gap closure re-entry before D49 residual follow-up.'
      : nextArtifactForD49ResidualPacket(selectedNextWork, workloadLane),
    stopCondition:
      'Do not edit catalog metadata, add catalog content, change runtime redistribution, or reopen D47 from this packet alone.',
    d47ReentryCondition:
      d47ResolutionState === 'closed_by_d49'
        ? 'Re-enter D47 only if regenerated diagnostics recreate the original D47 comparator key.'
        : 'Re-enter D47 gap closure before treating D49 as the residual owner.',
  }
}

export function formatGeneratedPlanD49ResidualFollowUpPacketMarkdown(
  packet: GeneratedPlanD49ResidualFollowUpPacket,
): string[] {
  return [
    `- Packet source: ${packet.packetSource}`,
    `- D47 resolution state: \`${packet.d47ResolutionState}\``,
    `- Packet authorization status: \`${packet.authorizationStatus}\``,
    `- D49 cap authorization: \`${packet.changeAuthorization.cap}\``,
    `- D49 catalog authorization: \`${packet.changeAuthorization.catalog}\``,
    `- D49 runtime redistribution authorization: \`${packet.changeAuthorization.runtimeRedistribution}\``,
    `- D47 reopen authorization: \`${packet.changeAuthorization.d47Reopen}\``,
    `- Selected next work: \`${packet.selectedNextWork}\``,
    `- Selected next-work rationale: ${packet.selectedNextWorkRationale}`,
    `- Selected next-work owner: \`${packet.selectedNextWorkOwner}\``,
    `- Selected next-work revisit trigger: ${packet.selectedNextWorkRevisitTrigger}`,
    `- Product/session-quality verdict: ${packet.sessionQualityVerdict}`,
    `- Activation boundary: ${packet.activationBoundary}`,
    `- Training-quality boundary: ${packet.trainingQualityBoundary}`,
    `- Next artifact: ${packet.nextArtifact}`,
    `- Stop condition: ${packet.stopCondition}`,
    `- D47 re-entry condition: ${packet.d47ReentryCondition}`,
    '',
    `### ${packet.workloadLane.label}`,
    '',
    `- Disposition: \`${packet.workloadLane.disposition}\``,
    `- Total affected cells: ${packet.workloadLane.totalAffectedCellCount}`,
    `- Evidence summary: ${packet.workloadLane.evidenceSummary}`,
    `- Next artifact: ${packet.workloadLane.nextArtifact}`,
    packet.workloadLane.groupKeys.length > 0
      ? `- Group keys: ${packet.workloadLane.groupKeys.map((key) => `\`${key}\``).join(', ')}`
      : '- Group keys: none',
    '',
    `### ${packet.redistributionLane.label}`,
    '',
    `- Disposition: \`${packet.redistributionLane.disposition}\``,
    `- Total affected cells: ${packet.redistributionLane.totalAffectedCellCount}`,
    `- Evidence summary: ${packet.redistributionLane.evidenceSummary}`,
    `- Next artifact: ${packet.redistributionLane.nextArtifact}`,
    packet.redistributionLane.groupKeys.length > 0
      ? `- Group keys: ${packet.redistributionLane.groupKeys.map((key) => `\`${key}\``).join(', ')}`
      : '- Group keys: none',
    '',
    `### ${packet.redistributionNoActionLane.label}`,
    '',
    `- Disposition: \`${packet.redistributionNoActionLane.disposition}\``,
    `- Total affected cells: ${packet.redistributionNoActionLane.totalAffectedCellCount}`,
    `- Evidence summary: ${packet.redistributionNoActionLane.evidenceSummary}`,
    `- Next artifact: ${packet.redistributionNoActionLane.nextArtifact}`,
    packet.redistributionNoActionLane.groupKeys.length > 0
      ? `- Group keys: ${packet.redistributionNoActionLane.groupKeys.map((key) => `\`${key}\``).join(', ')}`
      : '- Group keys: none',
  ]
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
      (item): item is { group: GeneratedPlanObservationGroup; entry: GeneratedPlanTriageEntry } =>
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
    .filter(
      (item): item is { group: GeneratedPlanObservationGroup; entry: GeneratedPlanTriageEntry } =>
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
  const d01WorkloadBlockShapeProposal = buildGeneratedPlanD01WorkloadBlockShapeProposal(
    groups,
    registry,
  )
  const d01BlockShapeFillReceipt = buildGeneratedPlanD01BlockShapeFillReceipt(groups)
  const d01CapCatalogForkPacket = buildGeneratedPlanD01CapCatalogForkPacket(groups, registry)
  const gapClosureSelection = buildGeneratedPlanGapClosureSelectionWorkbench(groups, registry)
  const d49ResidualFollowUpPacket = buildGeneratedPlanD49ResidualFollowUpPacket(groups, registry)
  const d47D05ComparatorPayload = buildCurrentGeneratedPlanD47D05ComparatorEvaluationPayload()
  const d47D05ComparatorPacket = buildGeneratedPlanD47D05ComparatorDecisionPacket(
    groups,
    registry,
    evaluationsForGeneratedPlanD47D05ComparatorPayload(d47D05ComparatorPayload),
  )
  const decisionDebtLines =
    decisionDebtPrompts.length === 0
      ? ['- None.']
      : decisionDebtPrompts.flatMap((prompt) => {
          const guideLine = prompt.guideAnchor
            ? [`- Guide: \`${WORKLOAD_ENVELOPE_GUIDE_PATH}#${prompt.guideAnchor}\``]
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
          (missingFact) =>
            `- \`${missingFact}\`: ${formatProposalAdmissionMissingFact(missingFact)}`,
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
  const d01WorkloadBlockShapeLines = [
    '- Proposal source: D01 gap-fill proposal plus workload envelope authoring guide.',
    `- Candidate: \`${d01WorkloadBlockShapeProposal.candidate.groupKey}\``,
    `- Currentness: \`${d01WorkloadBlockShapeProposal.currentnessState}\``,
    `- Authorization status: \`${d01WorkloadBlockShapeProposal.authorizationStatus}\``,
    `- Selected disposition: \`${d01WorkloadBlockShapeProposal.selectedDisposition}\``,
    `- Secondary disposition: \`${d01WorkloadBlockShapeProposal.secondaryDisposition}\``,
    `- Metadata action: \`${d01WorkloadBlockShapeProposal.metadataAction}\``,
    `- Target surface: ${d01WorkloadBlockShapeProposal.targetSurface}`,
    `- Evidence layer: ${d01WorkloadBlockShapeProposal.evidenceLayer}`,
    `- Recommended future fill shape: ${d01WorkloadBlockShapeProposal.recommendedFutureFillShape}`,
    `- Block-shape rationale: ${d01WorkloadBlockShapeProposal.blockShapeRationale}`,
    `- Expected diagnostic movement: ${d01WorkloadBlockShapeProposal.expectedDiagnosticMovement}`,
    `- Expected training-quality movement: ${d01WorkloadBlockShapeProposal.expectedTrainingQualityMovement}`,
    `- No-action threshold: ${d01WorkloadBlockShapeProposal.noActionThreshold}`,
    `- Revisit trigger: ${d01WorkloadBlockShapeProposal.revisitTrigger}`,
    `- Source-backed content disposition: \`${d01WorkloadBlockShapeProposal.sourceBackedContentDisposition}\``,
    `- Generator-policy disposition: \`${d01WorkloadBlockShapeProposal.generatorPolicyDisposition}\``,
    `- U6 eligibility: \`${d01WorkloadBlockShapeProposal.u6Eligibility}\``,
    `- Reassessment result: \`${d01WorkloadBlockShapeProposal.reassessmentResult}\``,
    `- Reassessment boundary: ${d01WorkloadBlockShapeProposal.reassessmentBoundary}`,
  ]
  const d01BlockShapeFillLines = [
    '- Fill source: D01 workload/block-shape proposal.',
    `- Target group: \`${d01BlockShapeFillReceipt.targetGroupKey}\``,
    `- Target found: ${d01BlockShapeFillReceipt.targetFound ? 'yes' : 'no'}`,
    `- Diagnostic movement: \`${d01BlockShapeFillReceipt.diagnosticMovement}\``,
    `- Training-quality state: \`${d01BlockShapeFillReceipt.trainingQualityState}\``,
    `- Redistribution handoff state: \`${d01BlockShapeFillReceipt.redistributionHandoffState}\``,
    `- Redistribution handoff reason: ${d01BlockShapeFillReceipt.redistributionHandoffReason}`,
    `- D47 next state: \`${d01BlockShapeFillReceipt.d47NextState}\``,
    `- Applied fill: ${d01BlockShapeFillReceipt.appliedFill}`,
    `- Metadata action: \`${d01BlockShapeFillReceipt.metadataAction}\``,
    `- Source-backed content disposition: \`${d01BlockShapeFillReceipt.sourceBackedContentDisposition}\``,
    `- U6 eligibility: \`${d01BlockShapeFillReceipt.u6Eligibility}\``,
    `- Baseline receipt: total affected cells ${d01BlockShapeFillReceipt.baselineReceiptFacts.totalAffectedCellCount}, pressure disappears ${d01BlockShapeFillReceipt.baselineReceiptFacts.pressureDisappearsCellCount}, pressure remains ${d01BlockShapeFillReceipt.baselineReceiptFacts.pressureRemainsCellCount}, non-redistribution pressure ${d01BlockShapeFillReceipt.baselineReceiptFacts.nonRedistributionPressureCellCount}, inconclusive ${d01BlockShapeFillReceipt.baselineReceiptFacts.comparisonInconclusiveCellCount}`,
    `- Current receipt: total affected cells ${d01BlockShapeFillReceipt.currentReceiptFacts.totalAffectedCellCount}, pressure disappears ${d01BlockShapeFillReceipt.currentReceiptFacts.pressureDisappearsCellCount}, pressure remains ${d01BlockShapeFillReceipt.currentReceiptFacts.pressureRemainsCellCount}, non-redistribution pressure ${d01BlockShapeFillReceipt.currentReceiptFacts.nonRedistributionPressureCellCount}, inconclusive ${d01BlockShapeFillReceipt.currentReceiptFacts.comparisonInconclusiveCellCount}`,
    `- Diagnostic summary: ${d01BlockShapeFillReceipt.diagnosticSummary}`,
    `- Training-quality boundary: ${d01BlockShapeFillReceipt.trainingQualityBoundary}`,
    `- Remaining action: ${d01BlockShapeFillReceipt.remainingAction}`,
  ]
  const d01CapCatalogForkLines =
    formatGeneratedPlanD01CapCatalogForkPacketMarkdown(d01CapCatalogForkPacket)
  const gapClosureSelectionLines =
    formatGeneratedPlanGapClosureSelectionWorkbenchMarkdown(gapClosureSelection)
  const d49ResidualFollowUpLines =
    formatGeneratedPlanD49ResidualFollowUpPacketMarkdown(d49ResidualFollowUpPacket)
  const d47D05ComparatorPayloadLines =
    formatGeneratedPlanD47D05ComparatorEvaluationPayloadMarkdown(d47D05ComparatorPayload)
  const d47D05ComparatorLines =
    formatGeneratedPlanD47D05ComparatorDecisionPacketMarkdown(d47D05ComparatorPacket)

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
    '## D01 Workload Block-Shape Proposal',
    '',
    ...d01WorkloadBlockShapeLines,
    '',
    '## D01 Block-Shape Fill Receipt',
    '',
    ...d01BlockShapeFillLines,
    '',
    '## D01 Cap/Catalog Fork Packet',
    '',
    ...d01CapCatalogForkLines,
    '',
    '## Gap Closure Selection',
    '',
    ...gapClosureSelectionLines,
    '',
    '## D49 Residual Follow-Up',
    '',
    ...d49ResidualFollowUpLines,
    '',
    '## D47 vs D05 Comparator Evaluation Payload',
    '',
    ...d47D05ComparatorPayloadLines,
    '',
    '## D47 vs D05 Comparator Decision Packet',
    '',
    ...d47D05ComparatorLines,
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
    currentEntries.some(({ entry }) => entry.route === 'source_backed_content_depth')
      ? ''
      : '- None.',
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
    ...currentEntries.map(
      ({ group, entry }) =>
        `- \`${entry.groupKey}\` (${group.affectedCellCount} cells, route: \`${entry.route}\`)`,
    ),
  ]

  return `${lines.join('\n')}\n`
}
