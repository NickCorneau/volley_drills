import { DRILLS } from '../data/drills'
import { selectArchetype } from '../data/archetypes'
import { startingStressRung, stressLadderBounds, stressRungForDrill } from '../data/stressLadders'
import type {
  BlockSlot,
  BlockSlotType,
  PlayerLevel,
  SessionDraft,
  SetupContext,
  TimeProfile,
} from '../model'
import { buildDraftWithAssemblyTrace } from './sessionBuilder'
import type { DraftAssemblyTrace, DraftAssemblyTraceSlot } from './sessionBuilder'
import { findCandidates } from './sessionAssembly/candidates'
import { isFocusControlledSlotType } from './sessionAssembly/effectiveFocus'
import type {
  ReadinessConfiguration,
  ReadinessConfigurationId,
  VisibleFocus,
} from './sessionAssembly/focusReadiness'
import {
  PLAYER_LEVELS,
  READINESS_CONFIGURATIONS,
  READINESS_DURATIONS,
  VISIBLE_FOCUSES,
} from './sessionAssembly/focusReadiness'

export type GeneratedPlanDiagnosticStatus = 'clean' | 'observation_only' | 'hard_failure'

export type GeneratedPlanHardFailureCode =
  | 'no_draft'
  | 'wrong_total_duration'
  | 'context_mismatch'
  | 'missing_required_slot'
  | 'unresolved_selected_variant'
  | 'hard_filter_violation'
  | 'off_focus_controlled_work'
  | 'unclassified_stretch_pressure'
  | 'assembly_trace_mismatch'
  // U7 (D159, R6) — steered-sweep-only codes, keyed on the U6
  // selection-path trace marker:
  //   - `steering_violation`: a steered main-skill slot has no marker,
  //     a `rung_nearest` marker whose selected drill is not
  //     nearest-eligible, or a `steeredFocus` stamp the realized rungs
  //     do not support.
  //   - `steered_focus_missing`: every realized main-skill rung equals
  //     the steer target but the draft carries no `steeredFocus`.
  | 'steering_violation'
  | 'steered_focus_missing'

export type GeneratedPlanObservationCode =
  | 'under_authored_min'
  | 'over_authored_max'
  | 'over_fatigue_cap'
  | 'slot_dropped'
  | 'under_named_profile_duration'
  | 'repeated_focus_controlled_family'

export interface GeneratedPlanNotApplicableCell {
  readonly focus: VisibleFocus
  readonly configuration: ReadinessConfigurationId
  readonly level: PlayerLevel
  readonly duration: TimeProfile
  readonly seed: string
  readonly reason: string
}

export interface GeneratedPlanSupportedSurface {
  readonly focuses: readonly VisibleFocus[]
  readonly configurations: readonly ReadinessConfiguration[]
  readonly levels: readonly PlayerLevel[]
  readonly durations: readonly TimeProfile[]
  readonly seeds: readonly string[]
  readonly notApplicable?: readonly GeneratedPlanNotApplicableCell[]
}

export type GeneratedPlanSurfaceContractDimension =
  | 'focus'
  | 'configuration'
  | 'level'
  | 'duration'
  | 'seed'
  | 'theme'
  // U7: the steered sweep's position-role dimension. Only the steered
  // surface contract emits issues on it; the 540-cell contract never
  // uses it.
  | 'position'

export type GeneratedPlanSurfaceContractState =
  | 'pre_activation_deferred'
  | 'reserved_future'
  | 'unsupported_user_visible'

export interface GeneratedPlanSurfaceContractEntry {
  readonly state: GeneratedPlanSurfaceContractState
  readonly dimension: GeneratedPlanSurfaceContractDimension
  readonly value: string
  readonly reason: string
  readonly authority: string
  readonly revisitTrigger: string
}

export interface GeneratedPlanSurfaceContract {
  readonly included: GeneratedPlanSupportedSurface
  readonly excluded: readonly GeneratedPlanSurfaceContractEntry[]
}

export type GeneratedPlanSurfaceContractIssueCode =
  | 'empty_included_surface_dimension'
  | 'duplicate_included_surface_value'
  | 'missing_required_surface_value'
  | 'unknown_included_surface_value'
  | 'unknown_included_configuration'
  | 'configuration_context_mismatch'
  | 'placeholder_surface_reason'
  | 'unknown_excluded_surface_value'
  | 'conflicting_surface_contract_state'
  | 'duplicate_excluded_surface_value'
  | 'unsupported_user_visible_surface'
  | 'theme_coverage_requires_contract'
  | 'duplicate_not_applicable_cell'
  | 'invalid_not_applicable_cell'
  | 'placeholder_not_applicable_reason'

export interface GeneratedPlanSurfaceContractIssue {
  readonly code: GeneratedPlanSurfaceContractIssueCode
  readonly dimension: GeneratedPlanSurfaceContractDimension
  readonly value?: string
  readonly message: string
}

export interface GeneratedPlanSurfaceContractValidation {
  readonly issues: readonly GeneratedPlanSurfaceContractIssue[]
  readonly blockingIssues: readonly GeneratedPlanSurfaceContractIssue[]
}

export interface GeneratedPlanSurfaceContractReport {
  readonly included: {
    readonly focuses: readonly VisibleFocus[]
    readonly configurations: readonly ReadinessConfigurationId[]
    readonly levels: readonly PlayerLevel[]
    readonly durations: readonly TimeProfile[]
    readonly seedIds: readonly string[]
  }
  readonly excluded: readonly GeneratedPlanSurfaceContractEntry[]
  readonly validationIssues: readonly GeneratedPlanSurfaceContractIssue[]
}

export interface GeneratedPlanMatrixCell {
  readonly focus: VisibleFocus
  readonly configuration: ReadinessConfigurationId
  readonly level: PlayerLevel
  readonly duration: TimeProfile
  readonly seed: string
}

export interface ApplicableGeneratedPlanMatrixCell extends GeneratedPlanMatrixCell {
  readonly status: 'applicable'
}

export interface NotApplicableGeneratedPlanMatrixCell extends GeneratedPlanMatrixCell {
  readonly status: 'not_applicable'
  readonly reason: string
}

export type GeneratedPlanMatrixEntry =
  | ApplicableGeneratedPlanMatrixCell
  | NotApplicableGeneratedPlanMatrixCell

export interface GeneratedPlanSurfaceSummary {
  readonly focuses: readonly VisibleFocus[]
  readonly configurations: readonly ReadinessConfigurationId[]
  readonly levels: readonly PlayerLevel[]
  readonly durations: readonly TimeProfile[]
  readonly seedIds?: readonly string[]
  readonly seedCount: number
  readonly cellCount: number
  readonly applicableCount: number
  readonly notApplicableCount: number
}

export type { DraftAssemblyTrace, DraftAssemblyTraceSlot } from './sessionBuilder'

export interface GeneratedPlanRedistributionEvidence {
  readonly source: 'observed' | 'inferred'
  readonly redistributedMinutes: number
  readonly skippedOptionalLayoutIndexes: readonly number[]
  readonly redistributionLayoutIndex?: number
}

export interface GeneratedPlanHardFailure {
  readonly code: GeneratedPlanHardFailureCode
  readonly blockId?: string
  readonly blockType?: BlockSlotType
  readonly required?: boolean
  readonly layoutIndex?: number
  readonly allocatedMinutes?: number
  readonly drillId?: string
  readonly variantId?: string
  readonly message?: string
}

export interface GeneratedPlanObservation {
  readonly code: GeneratedPlanObservationCode
  readonly blockId?: string
  readonly blockType?: BlockSlotType
  readonly required?: boolean
  readonly layoutIndex?: number
  readonly allocatedMinutes?: number
  readonly drillId?: string
  readonly variantId?: string
  readonly plannedMinutes?: number
  readonly authoredMinMinutes?: number
  readonly authoredMaxMinutes?: number
  readonly fatigueMaxMinutes?: number
  readonly skippedOptionalLayoutIndexes?: readonly number[]
  readonly redistribution?: GeneratedPlanRedistributionEvidence
  readonly classificationSource?: 'observed_redistribution' | 'allocated_duration'
  /**
   * U4 (2026-05-24 duration-honesty plan): `under_named_profile_duration`
   * carries the named profile (`context.timeProfile`) so the triage
   * surface can compute the gap directly from the finding without
   * re-deriving session context. Other observation codes leave this
   * undefined.
   */
  readonly namedProfileMinutes?: number
}

export interface SelectedDraftStretchAnalysis {
  readonly status: GeneratedPlanDiagnosticStatus
  readonly hardFailures: readonly GeneratedPlanHardFailure[]
  readonly observations: readonly GeneratedPlanObservation[]
}

export interface GeneratedPlanDiagnosticResult extends GeneratedPlanMatrixCell {
  readonly status: GeneratedPlanDiagnosticStatus
  readonly hardFailures: readonly GeneratedPlanHardFailure[]
  readonly observations: readonly GeneratedPlanObservation[]
}

export interface GeneratedPlanDiagnosticSummary {
  readonly surface: GeneratedPlanSurfaceSummary
  readonly notApplicable: readonly NotApplicableGeneratedPlanMatrixCell[]
  readonly statusCounts: Record<GeneratedPlanDiagnosticStatus, number>
  readonly hardFailureCount: number
  readonly observationCount: number
  readonly hardFailureCounts: Partial<Record<GeneratedPlanHardFailureCode, number>>
  readonly observationCounts: Partial<Record<GeneratedPlanObservationCode, number>>
}

export interface GeneratedPlanObservationAffectedCell extends GeneratedPlanMatrixCell {
  readonly blockId?: string
  readonly plannedMinutes?: number
  readonly allocatedMinutes?: number
  readonly authoredMinMinutes?: number
  readonly authoredMaxMinutes?: number
  readonly fatigueMaxMinutes?: number
  readonly observationCodes: readonly GeneratedPlanObservationCode[]
  readonly redistribution?: GeneratedPlanRedistributionEvidence
}

export interface GeneratedPlanObservationGroup {
  readonly groupKey: string
  readonly diagnosticFingerprint: string
  readonly drillId?: string
  readonly variantId?: string
  readonly blockType?: BlockSlotType
  readonly required?: boolean
  readonly authoredMinMinutes?: number
  readonly authoredMaxMinutes?: number
  readonly fatigueMaxMinutes?: number
  readonly affectedCellCount: number
  readonly observationCodes: readonly GeneratedPlanObservationCode[]
  readonly likelyFixPaths: readonly string[]
  readonly affectedCells: readonly GeneratedPlanObservationAffectedCell[]
}

const GENERATED_PLAN_DIAGNOSTIC_STATUSES: readonly GeneratedPlanDiagnosticStatus[] = [
  'clean',
  'observation_only',
  'hard_failure',
] as const

export const DEFAULT_GENERATED_PLAN_SEEDS: readonly string[] = [
  'matrix-a',
  'matrix-b',
  'matrix-c',
  'matrix-d',
] as const

export const DEFAULT_GENERATED_PLAN_SURFACE_CONTRACT: GeneratedPlanSurfaceContract = {
  included: {
    focuses: VISIBLE_FOCUSES,
    configurations: READINESS_CONFIGURATIONS,
    levels: PLAYER_LEVELS,
    durations: READINESS_DURATIONS,
    seeds: DEFAULT_GENERATED_PLAN_SEEDS,
  },
  excluded: [
    {
      state: 'reserved_future',
      dimension: 'theme',
      value: 'future_curated_themes',
      reason:
        'Curated themes require a concrete theme contract before generated diagnostics can claim coverage.',
      authority:
        'docs/brainstorms/2026-05-02-generated-diagnostics-dynamic-surface-sentinel-requirements.md',
      revisitTrigger:
        'Revisit when a theme contract defines identity, supported cells, and focused-slot behavior.',
    },
  ],
}

export const DEFAULT_GENERATED_PLAN_SURFACE: GeneratedPlanSupportedSurface =
  DEFAULT_GENERATED_PLAN_SURFACE_CONTRACT.included

const PLACEHOLDER_SURFACE_REASONS = new Set(['unsupported', 'n/a', 'na', 'todo', 'tbd'])

/**
 * The non-theme dimensions of the 540-cell default sweep. `position`
 * belongs only to the U7 steered sweep and is deliberately excluded —
 * the default contract and baseline stay untouched (KTD).
 */
type DefaultSurfaceDimension = Exclude<GeneratedPlanSurfaceContractDimension, 'theme' | 'position'>

const REQUIRED_GENERATED_PLAN_SURFACE_BASELINE: Record<DefaultSurfaceDimension, readonly string[]> =
  {
    focus: ['pass', 'serve', 'set'],
    configuration: ['solo_net', 'solo_wall', 'solo_open', 'pair_net', 'pair_open'],
    level: ['beginner', 'intermediate', 'advanced'],
    duration: ['15', '25', '40'],
    seed: ['matrix-a', 'matrix-b', 'matrix-c', 'matrix-d'],
  } as const

function surfaceValues(
  surface: GeneratedPlanSupportedSurface,
): Record<DefaultSurfaceDimension, readonly string[]> {
  return {
    focus: surface.focuses,
    configuration: surface.configurations.map((configuration) => configuration.id),
    level: surface.levels,
    duration: surface.durations.map(String),
    seed: surface.seeds,
  }
}

function canonicalSurfaceValues(): Record<DefaultSurfaceDimension, readonly string[]> {
  return {
    focus: VISIBLE_FOCUSES,
    configuration: READINESS_CONFIGURATIONS.map((configuration) => configuration.id),
    level: PLAYER_LEVELS,
    duration: READINESS_DURATIONS.map(String),
    seed: DEFAULT_GENERATED_PLAN_SEEDS,
  }
}

function sameReadinessConfigurationContext(
  left: ReadinessConfiguration,
  right: ReadinessConfiguration,
): boolean {
  return (
    left.context.playerMode === right.context.playerMode &&
    left.context.netAvailable === right.context.netAvailable &&
    left.context.wallAvailable === right.context.wallAvailable
  )
}

function isSpecificSurfaceText(value: string): boolean {
  const normalized = value.trim().toLowerCase()
  return normalized.length > 0 && !PLACEHOLDER_SURFACE_REASONS.has(normalized)
}

function surfaceIssue(
  code: GeneratedPlanSurfaceContractIssueCode,
  dimension: GeneratedPlanSurfaceContractDimension,
  value: string | undefined,
  message: string,
): GeneratedPlanSurfaceContractIssue {
  return { code, dimension, value, message }
}

export function validateGeneratedPlanSurfaceContract(
  contract: GeneratedPlanSurfaceContract = DEFAULT_GENERATED_PLAN_SURFACE_CONTRACT,
): GeneratedPlanSurfaceContractValidation {
  const issues: GeneratedPlanSurfaceContractIssue[] = []
  const includedValues = surfaceValues(contract.included)
  const canonicalValues = canonicalSurfaceValues()
  const baselineValues = REQUIRED_GENERATED_PLAN_SURFACE_BASELINE

  for (const [dimension, values] of Object.entries(includedValues) as Array<
    [DefaultSurfaceDimension, readonly string[]]
  >) {
    if (values.length === 0) {
      issues.push(
        surfaceIssue(
          'empty_included_surface_dimension',
          dimension,
          undefined,
          `Included ${dimension} values must not be empty.`,
        ),
      )
    }
    const seenValues = new Set<string>()
    for (const value of values) {
      if (seenValues.has(value)) {
        issues.push(
          surfaceIssue(
            'duplicate_included_surface_value',
            dimension,
            value,
            `Included ${dimension} value ${value} is duplicated.`,
          ),
        )
      }
      seenValues.add(value)
    }
    const canonicalValueSet = new Set(canonicalValues[dimension])
    for (const value of values) {
      if (!canonicalValueSet.has(value)) {
        issues.push(
          surfaceIssue(
            'unknown_included_surface_value',
            dimension,
            value,
            `Included ${dimension} value ${value} is not part of the current generated diagnostics surface.`,
          ),
        )
      }
    }
    for (const requiredValue of baselineValues[dimension]) {
      if (!seenValues.has(requiredValue)) {
        issues.push(
          surfaceIssue(
            'missing_required_surface_value',
            dimension,
            requiredValue,
            `Required ${dimension} value ${requiredValue} is neither included nor explicitly deferred.`,
          ),
        )
      }
    }
  }

  const canonicalConfigurationIds = new Set(canonicalValues.configuration)
  const canonicalConfigurationsById = new Map(
    READINESS_CONFIGURATIONS.map((configuration) => [configuration.id, configuration] as const),
  )
  for (const configuration of contract.included.configurations) {
    const canonicalConfiguration = canonicalConfigurationsById.get(configuration.id)
    if (!canonicalConfigurationIds.has(configuration.id) || !canonicalConfiguration) {
      issues.push(
        surfaceIssue(
          'unknown_included_configuration',
          'configuration',
          configuration.id,
          `Included configuration ${configuration.id} is not a canonical readiness configuration.`,
        ),
      )
    } else if (!sameReadinessConfigurationContext(configuration, canonicalConfiguration)) {
      issues.push(
        surfaceIssue(
          'configuration_context_mismatch',
          'configuration',
          configuration.id,
          `Included configuration ${configuration.id} does not match its canonical readiness context.`,
        ),
      )
    }
  }

  const excludedKeys = new Set<string>()
  for (const entry of contract.excluded) {
    const key = `${entry.dimension}:${entry.value}`
    if (excludedKeys.has(key)) {
      issues.push(
        surfaceIssue(
          'duplicate_excluded_surface_value',
          entry.dimension,
          entry.value,
          `Excluded ${entry.dimension} value ${entry.value} is duplicated.`,
        ),
      )
    }
    excludedKeys.add(key)

    if (entry.dimension !== 'theme' && entry.dimension !== 'position') {
      const dimension = entry.dimension
      const includedValueSet = new Set(includedValues[dimension])
      const canonicalValueSet = new Set(canonicalValues[dimension])
      const baselineValueSet = new Set(baselineValues[dimension])
      if (includedValueSet.has(entry.value)) {
        issues.push(
          surfaceIssue(
            'conflicting_surface_contract_state',
            entry.dimension,
            entry.value,
            `Excluded ${entry.dimension} value ${entry.value} is still included in the generated diagnostics surface.`,
          ),
        )
      }
      if (!canonicalValueSet.has(entry.value)) {
        issues.push(
          surfaceIssue(
            'unknown_excluded_surface_value',
            entry.dimension,
            entry.value,
            `Excluded ${entry.dimension} value ${entry.value} is not part of the current generated diagnostics surface.`,
          ),
        )
      }
      if (baselineValueSet.has(entry.value)) {
        issues.push(
          surfaceIssue(
            'unsupported_user_visible_surface',
            entry.dimension,
            entry.value,
            `Current supported ${entry.dimension} value ${entry.value} cannot be excluded by reason alone.`,
          ),
        )
      }
    }

    if (
      !isSpecificSurfaceText(entry.reason) ||
      !isSpecificSurfaceText(entry.authority) ||
      !isSpecificSurfaceText(entry.revisitTrigger)
    ) {
      issues.push(
        surfaceIssue(
          'placeholder_surface_reason',
          entry.dimension,
          entry.value,
          `Excluded ${entry.dimension} value ${entry.value} needs a specific reason, authority, and revisit trigger.`,
        ),
      )
    }
    if (entry.state === 'unsupported_user_visible') {
      issues.push(
        surfaceIssue(
          'unsupported_user_visible_surface',
          entry.dimension,
          entry.value,
          `User-visible ${entry.dimension} value ${entry.value} cannot be excluded by reason alone.`,
        ),
      )
    }
    if (entry.dimension === 'theme' && entry.state !== 'reserved_future') {
      issues.push(
        surfaceIssue(
          'theme_coverage_requires_contract',
          entry.dimension,
          entry.value,
          `Theme value ${entry.value} cannot be marked covered without a concrete theme contract.`,
        ),
      )
    }
  }

  const notApplicableKeys = new Set<string>()
  for (const cell of contract.included.notApplicable ?? []) {
    const key = `${cell.focus}:${cell.configuration}:${cell.level}:${cell.duration}:${cell.seed}`
    if (notApplicableKeys.has(key)) {
      issues.push(
        surfaceIssue(
          'duplicate_not_applicable_cell',
          'seed',
          key,
          `Not-applicable cell ${key} is duplicated.`,
        ),
      )
    }
    notApplicableKeys.add(key)

    const invalidDimensions: GeneratedPlanSurfaceContractDimension[] = []
    if (!includedValues.focus.includes(cell.focus)) invalidDimensions.push('focus')
    if (!includedValues.configuration.includes(cell.configuration))
      invalidDimensions.push('configuration')
    if (!includedValues.level.includes(cell.level)) invalidDimensions.push('level')
    if (!includedValues.duration.includes(String(cell.duration))) invalidDimensions.push('duration')
    if (!includedValues.seed.includes(cell.seed)) invalidDimensions.push('seed')
    for (const dimension of invalidDimensions) {
      issues.push(
        surfaceIssue(
          'invalid_not_applicable_cell',
          dimension,
          key,
          `Not-applicable cell ${key} references a value outside the included surface.`,
        ),
      )
    }
    if (!isSpecificSurfaceText(cell.reason)) {
      issues.push(
        surfaceIssue(
          'placeholder_not_applicable_reason',
          'seed',
          key,
          `Not-applicable cell ${key} needs a specific reason.`,
        ),
      )
    }
  }

  return { issues, blockingIssues: issues }
}

export function buildGeneratedPlanSurfaceContractReport(
  contract: GeneratedPlanSurfaceContract = DEFAULT_GENERATED_PLAN_SURFACE_CONTRACT,
): GeneratedPlanSurfaceContractReport {
  return {
    included: {
      focuses: contract.included.focuses,
      configurations: contract.included.configurations.map((configuration) => configuration.id),
      levels: contract.included.levels,
      durations: contract.included.durations,
      seedIds: contract.included.seeds,
    },
    excluded: contract.excluded,
    validationIssues: validateGeneratedPlanSurfaceContract(contract).issues,
  }
}

function matchesNotApplicableCell(
  cell: GeneratedPlanMatrixCell,
  notApplicable: GeneratedPlanNotApplicableCell,
): boolean {
  return (
    cell.focus === notApplicable.focus &&
    cell.configuration === notApplicable.configuration &&
    cell.level === notApplicable.level &&
    cell.duration === notApplicable.duration &&
    cell.seed === notApplicable.seed
  )
}

function notApplicableReason(
  cell: GeneratedPlanMatrixCell,
  surface: GeneratedPlanSupportedSurface,
): string | undefined {
  return surface.notApplicable?.find((candidate) => matchesNotApplicableCell(cell, candidate))
    ?.reason
}

export function isGeneratedPlanDiagnosticStatus(
  value: unknown,
): value is GeneratedPlanDiagnosticStatus {
  return (
    typeof value === 'string' &&
    (GENERATED_PLAN_DIAGNOSTIC_STATUSES as readonly string[]).includes(value)
  )
}

export function buildGeneratedPlanMatrix(
  surface: GeneratedPlanSupportedSurface = DEFAULT_GENERATED_PLAN_SURFACE,
): GeneratedPlanMatrixEntry[] {
  const entries: GeneratedPlanMatrixEntry[] = []

  for (const focus of surface.focuses) {
    for (const configuration of surface.configurations) {
      for (const level of surface.levels) {
        for (const duration of surface.durations) {
          for (const seed of surface.seeds) {
            const cell: GeneratedPlanMatrixCell = {
              focus,
              configuration: configuration.id,
              level,
              duration,
              seed,
            }
            const reason = notApplicableReason(cell, surface)
            entries.push(
              reason
                ? { ...cell, status: 'not_applicable', reason }
                : { ...cell, status: 'applicable' },
            )
          }
        }
      }
    }
  }

  return entries
}

export function buildApplicableGeneratedPlanInputs(
  surface: GeneratedPlanSupportedSurface = DEFAULT_GENERATED_PLAN_SURFACE,
): ApplicableGeneratedPlanMatrixCell[] {
  return buildGeneratedPlanMatrix(surface).filter(
    (entry): entry is ApplicableGeneratedPlanMatrixCell => entry.status === 'applicable',
  )
}

export function buildGeneratedPlanSurfaceSummary(
  matrix: readonly GeneratedPlanMatrixEntry[],
): GeneratedPlanSurfaceSummary {
  return {
    focuses: [...new Set(matrix.map((cell) => cell.focus))],
    configurations: [...new Set(matrix.map((cell) => cell.configuration))],
    levels: [...new Set(matrix.map((cell) => cell.level))],
    durations: [...new Set(matrix.map((cell) => cell.duration))],
    seedIds: [...new Set(matrix.map((cell) => cell.seed))],
    seedCount: new Set(matrix.map((cell) => cell.seed)).size,
    cellCount: matrix.length,
    applicableCount: matrix.filter((cell) => cell.status === 'applicable').length,
    notApplicableCount: matrix.filter((cell) => cell.status === 'not_applicable').length,
  }
}

function statusForFindings(
  hardFailures: readonly GeneratedPlanHardFailure[],
  observations: readonly GeneratedPlanObservation[],
): GeneratedPlanDiagnosticStatus {
  if (hardFailures.length > 0) return 'hard_failure'
  if (observations.length > 0) return 'observation_only'
  return 'clean'
}

function findVariant(drillId: string, variantId: string) {
  const drill = DRILLS.find((candidate) => candidate.id === drillId)
  const variant = drill?.variants.find((candidate) => candidate.id === variantId)
  return { drill, variant }
}

function incrementCount<Key extends string>(counts: Partial<Record<Key, number>>, key: Key): void {
  counts[key] = (counts[key] ?? 0) + 1
}

function traceSlotForBlock(
  blockId: string,
  trace: DraftAssemblyTrace | undefined,
): DraftAssemblyTraceSlot | undefined {
  return trace?.slots.find((slot) => slot.blockId === blockId)
}

function redistributionEvidenceForBlock(
  slot: DraftAssemblyTraceSlot | undefined,
  trace: DraftAssemblyTrace | undefined,
): GeneratedPlanRedistributionEvidence | undefined {
  if (!slot || !trace) return undefined
  if (trace.redistributedMinutes <= 0) return undefined
  if (trace.redistributionLayoutIndex !== slot.layoutIndex) return undefined
  return {
    source: 'observed',
    redistributedMinutes: trace.redistributedMinutes,
    skippedOptionalLayoutIndexes: trace.skippedOptionalLayoutIndexes,
    redistributionLayoutIndex: trace.redistributionLayoutIndex,
  }
}

function blockTraceContext(
  block: { readonly id: string; readonly type: BlockSlotType; readonly required: boolean },
  traceSlot: DraftAssemblyTraceSlot | undefined,
) {
  return {
    blockId: block.id,
    blockType: block.type,
    required: block.required,
    layoutIndex: traceSlot?.layoutIndex,
    allocatedMinutes: traceSlot?.allocatedMinutes,
  }
}

export function analyzeSelectedDraftStretch(
  draft: SessionDraft,
  trace?: DraftAssemblyTrace,
): SelectedDraftStretchAnalysis {
  const hardFailures: GeneratedPlanHardFailure[] = []
  const observations: GeneratedPlanObservation[] = []

  // U4 (2026-05-24 duration-honesty plan, R13): replace the retired
  // `optional_slot_redistribution` finding with two new findings:
  //
  //   - `slot_dropped`: per-slot evidence. Fires for every optional
  //     slot that ended up in `skippedOptionalLayoutIndexes` after
  //     U2's fallback retry. Surfaces the agent-readable "which
  //     focused selection failed" signal for the coverage workbench.
  //   - `under_named_profile_duration`: per-session evidence. Fires
  //     when the assembled total falls short of the named profile by
  //     at least 1 min (the diagnostic-grade threshold; distinct from
  //     the user-facing 5-min UI threshold in U6).
  //
  // Both findings route to the `coverage_gap_review` triage lane.
  if (trace) {
    for (const layoutIndex of trace.skippedOptionalLayoutIndexes) {
      const slot = trace.slots.find((candidate) => candidate.layoutIndex === layoutIndex)
      if (!slot) continue
      observations.push({
        code: 'slot_dropped',
        blockType: slot.type,
        required: slot.required,
        layoutIndex,
        allocatedMinutes: slot.allocatedMinutes,
        skippedOptionalLayoutIndexes: trace.skippedOptionalLayoutIndexes,
      })
    }
  }

  const totalMinutes = draft.blocks.reduce((sum, block) => sum + block.durationMinutes, 0)
  const underProfileBy = draft.context.timeProfile - totalMinutes
  if (underProfileBy >= 1) {
    observations.push({
      code: 'under_named_profile_duration',
      plannedMinutes: totalMinutes,
      namedProfileMinutes: draft.context.timeProfile,
      skippedOptionalLayoutIndexes: trace?.skippedOptionalLayoutIndexes,
    })
  }

  for (const block of draft.blocks) {
    const { drill, variant } = findVariant(block.drillId, block.variantId)
    if (!drill || !variant) {
      hardFailures.push({
        code: 'unresolved_selected_variant',
        blockId: block.id,
        drillId: block.drillId,
        variantId: block.variantId,
      })
      continue
    }

    const traceSlot = traceSlotForBlock(block.id, trace)
    const redistribution = redistributionEvidenceForBlock(traceSlot, trace)
    const underAuthoredMin = block.durationMinutes < variant.workload.durationMinMinutes
    const overAuthoredMax = block.durationMinutes > variant.workload.durationMaxMinutes
    const fatigueMaxMinutes = variant.workload.fatigueCap?.maxMinutes
    const overFatigueMax =
      fatigueMaxMinutes !== undefined && block.durationMinutes > fatigueMaxMinutes
    const authoredMaxClassified =
      overAuthoredMax &&
      traceSlot !== undefined &&
      (redistribution !== undefined ||
        traceSlot.allocatedMinutes > variant.workload.durationMaxMinutes)
    const fatigueMaxClassified =
      overFatigueMax &&
      traceSlot !== undefined &&
      (redistribution !== undefined || traceSlot.allocatedMinutes > fatigueMaxMinutes)

    if ((overAuthoredMax && !authoredMaxClassified) || (overFatigueMax && !fatigueMaxClassified)) {
      hardFailures.push({
        code: 'unclassified_stretch_pressure',
        ...blockTraceContext(block, traceSlot),
        drillId: block.drillId,
        variantId: block.variantId,
        message: 'Over-cap block is missing a classified stretch source.',
      })
    }

    if (underAuthoredMin && traceSlot) {
      observations.push({
        code: 'under_authored_min',
        ...blockTraceContext(block, traceSlot),
        drillId: drill.id,
        variantId: variant.id,
        plannedMinutes: block.durationMinutes,
        authoredMinMinutes: variant.workload.durationMinMinutes,
        classificationSource: 'allocated_duration',
      })
    }

    if (authoredMaxClassified && traceSlot) {
      observations.push({
        code: 'over_authored_max',
        ...blockTraceContext(block, traceSlot),
        drillId: drill.id,
        variantId: variant.id,
        plannedMinutes: block.durationMinutes,
        authoredMaxMinutes: variant.workload.durationMaxMinutes,
        redistribution,
        classificationSource:
          redistribution !== undefined ? 'observed_redistribution' : 'allocated_duration',
      })
    }

    if (overFatigueMax && fatigueMaxClassified && traceSlot) {
      observations.push({
        code: 'over_fatigue_cap',
        ...blockTraceContext(block, traceSlot),
        drillId: drill.id,
        variantId: variant.id,
        plannedMinutes: block.durationMinutes,
        fatigueMaxMinutes,
        redistribution,
        classificationSource:
          redistribution !== undefined ? 'observed_redistribution' : 'allocated_duration',
      })
    }
  }

  return {
    status: statusForFindings(hardFailures, observations),
    hardFailures,
    observations,
  }
}

function contextForDiagnosticCell(
  cell: GeneratedPlanMatrixCell,
  configuration: ReadinessConfiguration,
): SetupContext {
  return {
    ...configuration.context,
    timeProfile: cell.duration,
    sessionFocus: cell.focus,
    playerLevel: cell.level,
  }
}

function totalDraftMinutes(draft: SessionDraft): number {
  return draft.blocks.reduce((sum, block) => sum + block.durationMinutes, 0)
}

function findSlotForTrace(
  layout: readonly BlockSlot[],
  traceSlot: DraftAssemblyTraceSlot,
): BlockSlot | undefined {
  return layout[traceSlot.layoutIndex]
}

function hasSelectedCandidate(
  slot: BlockSlot,
  context: SetupContext,
  block: { readonly drillId: string; readonly variantId: string; readonly required: boolean },
): boolean {
  const focusedHit = findCandidates(slot, context, { playerLevel: context.playerLevel }).some(
    (candidate) => candidate.drill.id === block.drillId && candidate.variant.id === block.variantId,
  )
  if (focusedHit) return true

  // R5 (2026-05-24 duration-honesty plan, U2): optional slots may
  // legitimately fill from the slot's authored `skillTags` fallback
  // when the focused candidate pool can't fill them. Recognize that
  // fallback path here so the diagnostic surface doesn't hard-fail on
  // pass-fallback selections under named focus. Required slots keep
  // the strict focused check (R6: no required-slot fallback).
  if (block.required) return false
  return findCandidates(slot, context, {
    playerLevel: context.playerLevel,
    overrideSkillTags: slot.skillTags,
  }).some(
    (candidate) => candidate.drill.id === block.drillId && candidate.variant.id === block.variantId,
  )
}

function traceSlotMatchesBlock(
  traceSlot: DraftAssemblyTraceSlot,
  block: {
    readonly drillId: string
    readonly variantId: string
    readonly type: BlockSlotType
    readonly required: boolean
  },
): boolean {
  return (
    traceSlot.drillId === block.drillId &&
    traceSlot.variantId === block.variantId &&
    traceSlot.type === block.type &&
    traceSlot.required === block.required
  )
}

function generationHardFailures(
  cell: GeneratedPlanMatrixCell,
  configuration: ReadinessConfiguration,
  draft: SessionDraft,
  trace: DraftAssemblyTrace,
): GeneratedPlanHardFailure[] {
  const failures: GeneratedPlanHardFailure[] = []
  const expectedContext = contextForDiagnosticCell(cell, configuration)

  // 2026-05-13: the warmup/wrap segment snap is now wired into
  // `buildDraft` (see `docs/plans/2026-05-13-002-fix-wire-warmup-wrap-
  // segment-snap-plan.md`). Per the parent plan's R5, snap may
  // legitimately shorten a session below `timeProfile` when every
  // redistribution target is already at its archetype or variant cap.
  // Treat session totals at or below cell.duration as valid; over-
  // long sessions remain hard failures because nothing in the snap or
  // legacy redistribution can inflate a session past its time budget.
  const total = totalDraftMinutes(draft)
  if (total > cell.duration) {
    failures.push({
      code: 'wrong_total_duration',
      message: `Expected at most ${cell.duration} minutes, got ${total}.`,
    })
  }

  const contextMatches =
    draft.context.playerMode === expectedContext.playerMode &&
    draft.context.netAvailable === expectedContext.netAvailable &&
    draft.context.wallAvailable === expectedContext.wallAvailable &&
    draft.context.timeProfile === expectedContext.timeProfile &&
    draft.context.sessionFocus === expectedContext.sessionFocus &&
    draft.context.playerLevel === expectedContext.playerLevel
  if (!contextMatches) {
    failures.push({
      code: 'context_mismatch',
      message: 'Draft context does not match the diagnostic matrix cell.',
    })
  }

  const archetype = selectArchetype(draft.context)
  const layout = archetype?.layouts[draft.context.timeProfile] ?? []
  const selectedTraceBlockIds = new Map<string, number>()

  for (const traceSlot of trace.slots) {
    const slot = findSlotForTrace(layout, traceSlot)
    if (traceSlot.required && !traceSlot.selected) {
      failures.push({
        code: 'missing_required_slot',
        message: `Required ${traceSlot.type} slot was not selected.`,
      })
    }
    if (!traceSlot.selected || !traceSlot.blockId || !traceSlot.drillId || !traceSlot.variantId) {
      if (traceSlot.selected) {
        failures.push({
          code: 'assembly_trace_mismatch',
          blockId: traceSlot.blockId,
          blockType: traceSlot.type,
          required: traceSlot.required,
          layoutIndex: traceSlot.layoutIndex,
          allocatedMinutes: traceSlot.allocatedMinutes,
          drillId: traceSlot.drillId,
          variantId: traceSlot.variantId,
          message: 'Selected trace slot is missing selected block identity.',
        })
      }
      continue
    }

    const block = draft.blocks.find((candidate) => candidate.id === traceSlot.blockId)
    if (!block || !slot) {
      failures.push({
        code: 'assembly_trace_mismatch',
        blockId: traceSlot.blockId,
        blockType: traceSlot.type,
        required: traceSlot.required,
        layoutIndex: traceSlot.layoutIndex,
        allocatedMinutes: traceSlot.allocatedMinutes,
        drillId: traceSlot.drillId,
        variantId: traceSlot.variantId,
        message: !block
          ? 'Selected trace slot does not map to a draft block.'
          : 'Selected trace slot does not map to an archetype layout slot.',
      })
      continue
    }

    if (!traceSlotMatchesBlock(traceSlot, block)) {
      failures.push({
        code: 'assembly_trace_mismatch',
        blockId: traceSlot.blockId,
        blockType: traceSlot.type,
        required: traceSlot.required,
        layoutIndex: traceSlot.layoutIndex,
        allocatedMinutes: traceSlot.allocatedMinutes,
        drillId: traceSlot.drillId,
        variantId: traceSlot.variantId,
        message: 'Selected trace slot identity does not match its draft block.',
      })
    }

    selectedTraceBlockIds.set(block.id, (selectedTraceBlockIds.get(block.id) ?? 0) + 1)

    if (!hasSelectedCandidate(slot, draft.context, block)) {
      failures.push({
        code: 'hard_filter_violation',
        blockId: block.id,
        drillId: block.drillId,
        variantId: block.variantId,
      })
    }

    const { drill } = findVariant(block.drillId, block.variantId)
    if (
      draft.context.sessionFocus &&
      isFocusControlledSlotType(block.type) &&
      drill &&
      !drill.skillFocus.includes(draft.context.sessionFocus)
    ) {
      // R5 / R6 (2026-05-24 duration-honesty plan, U2): tolerate
      // optional-slot fallback selections that resolve via the slot's
      // authored `skillTags` fallback (legitimate under U2). A
      // required slot off-focus still hard-fails — R6 keeps required
      // slots focus-strict.
      const offFocusTolerable =
        !block.required && slot.skillTags?.some((tag) => drill.skillFocus.includes(tag))
      if (!offFocusTolerable) {
        failures.push({
          code: 'off_focus_controlled_work',
          blockId: block.id,
          drillId: block.drillId,
          variantId: block.variantId,
        })
      }
    }
  }

  for (const block of draft.blocks) {
    const traceCount = selectedTraceBlockIds.get(block.id) ?? 0
    if (traceCount !== 1) {
      failures.push({
        code: 'assembly_trace_mismatch',
        blockId: block.id,
        blockType: block.type,
        required: block.required,
        drillId: block.drillId,
        variantId: block.variantId,
        message:
          traceCount === 0
            ? 'Draft block does not map back to a selected trace slot.'
            : 'Draft block maps to multiple selected trace slots.',
      })
    }
  }

  return failures
}

function generatedShapeObservations(draft: SessionDraft): GeneratedPlanObservation[] {
  const focusedBlocks = draft.blocks.filter((block) => isFocusControlledSlotType(block.type))
  const repeated = focusedBlocks.filter(
    (block, index) =>
      focusedBlocks.findIndex((candidate) => candidate.drillId === block.drillId) !== index,
  )
  return repeated.map((block) => ({
    code: 'repeated_focus_controlled_family',
    blockId: block.id,
    blockType: block.type,
    required: block.required,
    drillId: block.drillId,
    variantId: block.variantId,
  }))
}

export function evaluateGeneratedPlanDiagnosticCell(
  cell: ApplicableGeneratedPlanMatrixCell,
  configuration: ReadinessConfiguration,
): GeneratedPlanDiagnosticResult {
  const context = contextForDiagnosticCell(cell, configuration)
  const generated = buildDraftWithAssemblyTrace(context, {
    assemblySeed: cell.seed,
    playerLevel: cell.level,
  })

  if (!generated) {
    return {
      ...cell,
      status: 'hard_failure',
      hardFailures: [{ code: 'no_draft' }],
      observations: [],
    }
  }

  return analyzeGeneratedPlanDraft(cell, configuration, generated.draft, generated.assemblyTrace)
}

export function analyzeGeneratedPlanDraft(
  cell: ApplicableGeneratedPlanMatrixCell,
  configuration: ReadinessConfiguration,
  draft: SessionDraft,
  trace: DraftAssemblyTrace,
): GeneratedPlanDiagnosticResult {
  const stretch = analyzeSelectedDraftStretch(draft, trace)
  const hardFailures = [
    ...generationHardFailures(cell, configuration, draft, trace),
    ...stretch.hardFailures,
  ]
  const observations = [...stretch.observations, ...generatedShapeObservations(draft)]

  return {
    ...cell,
    status: statusForFindings(hardFailures, observations),
    hardFailures,
    observations,
  }
}

function readinessConfigurationContextsMatch(
  left: ReadinessConfiguration,
  right: ReadinessConfiguration,
): boolean {
  return (
    left.context.playerMode === right.context.playerMode &&
    left.context.netAvailable === right.context.netAvailable &&
    left.context.wallAvailable === right.context.wallAvailable
  )
}

export function buildGeneratedPlanDiagnostics(
  surface: GeneratedPlanSupportedSurface = DEFAULT_GENERATED_PLAN_SURFACE,
): GeneratedPlanDiagnosticResult[] {
  const canonicalConfigurationsById = new Map(
    READINESS_CONFIGURATIONS.map((configuration) => [configuration.id, configuration] as const),
  )
  const suppliedConfigurationsById = new Map(
    surface.configurations.map((configuration) => [configuration.id, configuration] as const),
  )

  return buildApplicableGeneratedPlanInputs(surface).map((cell) => {
    const configuration = canonicalConfigurationsById.get(cell.configuration)
    const suppliedConfiguration = suppliedConfigurationsById.get(cell.configuration)
    if (!configuration) {
      return {
        ...cell,
        status: 'hard_failure',
        hardFailures: [
          {
            code: 'no_draft',
            message: `No canonical readiness configuration for ${cell.configuration}.`,
          },
        ],
        observations: [],
      }
    }
    if (
      suppliedConfiguration &&
      !readinessConfigurationContextsMatch(suppliedConfiguration, configuration)
    ) {
      return {
        ...cell,
        status: 'hard_failure',
        hardFailures: [
          {
            code: 'no_draft',
            message: `Diagnostic surface configuration context does not match canonical readiness configuration for ${cell.configuration}.`,
          },
        ],
        observations: [],
      }
    }
    return evaluateGeneratedPlanDiagnosticCell(cell, configuration)
  })
}

// ---------------------------------------------------------------------------
// U7 (D159, R6): the steered sweep.
//
// The 540-cell default sweep exercises assembly exactly as Setup invoked
// it BEFORE D154 — no stress positions — so the steered path (the path
// every live caller now takes) had no regression surface. The steered
// sweep is a separate bounded scenario set: 3 scoped focuses × 5
// readiness configurations × 3 levels × the 25-min profile × seed
// `matrix-a` × 3 position roles = 135 nominal cells. Position roles
// resolve per (focus, level) — `ladder_min`, `band_start`
// (`startingStressRung`), `ladder_max` — and may degenerately coincide
// (e.g. beginner band start IS the ladder min); the role stays the
// dimension so the cell count is stable and the overlap is visible in
// the resolved `position` value rather than collapsing the matrix.
//
// Hard-failure checks are keyed on the U6 selection-path trace marker,
// so the checker never re-implements `pickForSlot`'s duration policy:
// `duration_fit`, `reroute`, and `substitution` markers are legitimate
// non-violations by construction.
// ---------------------------------------------------------------------------

export type SteeredGeneratedPlanPositionRole = 'ladder_min' | 'band_start' | 'ladder_max'

export const STEERED_GENERATED_PLAN_POSITION_ROLES: readonly SteeredGeneratedPlanPositionRole[] = [
  'ladder_min',
  'band_start',
  'ladder_max',
] as const

export const STEERED_GENERATED_PLAN_SEEDS: readonly string[] = ['matrix-a'] as const

export const STEERED_GENERATED_PLAN_DURATIONS: readonly TimeProfile[] = [25] as const

export interface SteeredGeneratedPlanSurface {
  readonly focuses: readonly VisibleFocus[]
  readonly configurations: readonly ReadinessConfiguration[]
  readonly levels: readonly PlayerLevel[]
  readonly durations: readonly TimeProfile[]
  readonly seeds: readonly string[]
  readonly positionRoles: readonly SteeredGeneratedPlanPositionRole[]
}

export interface SteeredGeneratedPlanSurfaceContract {
  readonly included: SteeredGeneratedPlanSurface
}

export const STEERED_GENERATED_PLAN_SURFACE_CONTRACT: SteeredGeneratedPlanSurfaceContract = {
  included: {
    focuses: VISIBLE_FOCUSES,
    configurations: READINESS_CONFIGURATIONS,
    levels: PLAYER_LEVELS,
    durations: STEERED_GENERATED_PLAN_DURATIONS,
    seeds: STEERED_GENERATED_PLAN_SEEDS,
    positionRoles: STEERED_GENERATED_PLAN_POSITION_ROLES,
  },
}

export const STEERED_GENERATED_PLAN_SURFACE: SteeredGeneratedPlanSurface =
  STEERED_GENERATED_PLAN_SURFACE_CONTRACT.included

/**
 * The steered sweep's own baseline (KTD: the 540-cell contract and
 * `REQUIRED_GENERATED_PLAN_SURFACE_BASELINE` stay untouched). Bounded
 * by design: one duration, one seed, three position roles.
 */
type SteeredSurfaceDimension = DefaultSurfaceDimension | 'position'

const REQUIRED_STEERED_GENERATED_PLAN_SURFACE_BASELINE: Record<
  SteeredSurfaceDimension,
  readonly string[]
> = {
  focus: ['pass', 'serve', 'set'],
  configuration: ['solo_net', 'solo_wall', 'solo_open', 'pair_net', 'pair_open'],
  level: ['beginner', 'intermediate', 'advanced'],
  duration: ['25'],
  seed: ['matrix-a'],
  position: ['ladder_min', 'band_start', 'ladder_max'],
} as const

function steeredSurfaceValues(
  surface: SteeredGeneratedPlanSurface,
): Record<SteeredSurfaceDimension, readonly string[]> {
  return {
    focus: surface.focuses,
    configuration: surface.configurations.map((configuration) => configuration.id),
    level: surface.levels,
    duration: surface.durations.map(String),
    seed: surface.seeds,
    position: surface.positionRoles,
  }
}

export function validateSteeredGeneratedPlanSurfaceContract(
  contract: SteeredGeneratedPlanSurfaceContract = STEERED_GENERATED_PLAN_SURFACE_CONTRACT,
): GeneratedPlanSurfaceContractValidation {
  const issues: GeneratedPlanSurfaceContractIssue[] = []
  const values = steeredSurfaceValues(contract.included)

  for (const [dimension, dimensionValues] of Object.entries(values) as readonly [
    SteeredSurfaceDimension,
    readonly string[],
  ][]) {
    if (dimensionValues.length === 0) {
      issues.push(
        surfaceIssue(
          'empty_included_surface_dimension',
          dimension,
          undefined,
          `Steered surface dimension ${dimension} is empty.`,
        ),
      )
    }
    for (const value of dimensionValues) {
      if (dimensionValues.indexOf(value) !== dimensionValues.lastIndexOf(value)) {
        issues.push(
          surfaceIssue(
            'duplicate_included_surface_value',
            dimension,
            value,
            `Steered surface dimension ${dimension} repeats ${value}.`,
          ),
        )
      }
    }
    const required = REQUIRED_STEERED_GENERATED_PLAN_SURFACE_BASELINE[dimension]
    for (const value of required) {
      if (!dimensionValues.includes(value)) {
        issues.push(
          surfaceIssue(
            'missing_required_surface_value',
            dimension,
            value,
            `Steered surface dimension ${dimension} is missing required value ${value}.`,
          ),
        )
      }
    }
    for (const value of dimensionValues) {
      if (!required.includes(value)) {
        issues.push(
          surfaceIssue(
            'unknown_included_surface_value',
            dimension,
            value,
            `Steered surface dimension ${dimension} includes unknown value ${value}.`,
          ),
        )
      }
    }
  }

  const canonicalConfigurationsById = new Map(
    READINESS_CONFIGURATIONS.map((configuration) => [configuration.id, configuration] as const),
  )
  for (const configuration of contract.included.configurations) {
    const canonical = canonicalConfigurationsById.get(configuration.id)
    if (canonical && !sameReadinessConfigurationContext(configuration, canonical)) {
      issues.push(
        surfaceIssue(
          'configuration_context_mismatch',
          'configuration',
          configuration.id,
          `Steered surface configuration ${configuration.id} does not match its canonical readiness context.`,
        ),
      )
    }
  }

  return { issues, blockingIssues: issues }
}

/** Resolve a position role to a concrete rung for (focus, level). */
export function steeredPositionForCell(
  focus: VisibleFocus,
  level: PlayerLevel,
  role: SteeredGeneratedPlanPositionRole,
): number {
  switch (role) {
    case 'ladder_min':
      return stressLadderBounds(focus).min
    case 'band_start':
      return startingStressRung(focus, level)
    case 'ladder_max':
      return stressLadderBounds(focus).max
    default: {
      const exhausted: never = role
      throw new Error(`Unhandled steered position role: ${String(exhausted)}`)
    }
  }
}

export interface SteeredGeneratedPlanMatrixCell extends GeneratedPlanMatrixCell {
  readonly positionRole: SteeredGeneratedPlanPositionRole
  readonly position: number
}

export interface SteeredGeneratedPlanDiagnosticResult extends SteeredGeneratedPlanMatrixCell {
  readonly status: GeneratedPlanDiagnosticStatus
  readonly hardFailures: readonly GeneratedPlanHardFailure[]
  readonly observations: readonly GeneratedPlanObservation[]
}

export function buildSteeredGeneratedPlanMatrix(
  surface: SteeredGeneratedPlanSurface = STEERED_GENERATED_PLAN_SURFACE,
): SteeredGeneratedPlanMatrixCell[] {
  const cells: SteeredGeneratedPlanMatrixCell[] = []
  for (const focus of surface.focuses) {
    for (const configuration of surface.configurations) {
      for (const level of surface.levels) {
        for (const duration of surface.durations) {
          for (const seed of surface.seeds) {
            for (const positionRole of surface.positionRoles) {
              cells.push({
                focus,
                configuration: configuration.id,
                level,
                duration,
                seed,
                positionRole,
                position: steeredPositionForCell(focus, level, positionRole),
              })
            }
          }
        }
      }
    }
  }
  return cells
}

const STEERED_OFF_LADDER_DISTANCE = Number.MAX_SAFE_INTEGER

function steeredRungDistance(focus: VisibleFocus, drillId: string, position: number): number {
  const rung = stressRungForDrill(focus, drillId)
  return rung === undefined ? STEERED_OFF_LADDER_DISTANCE : Math.abs(rung - position)
}

/**
 * Steered-sweep hard failures, keyed on the U6 selection-path marker.
 *
 * `rung_nearest` claims are re-checked against the focused candidate
 * pool with the draft's OTHER blocks excluded — an over-approximation
 * of `usedDrillIds` at main-skill selection time that can only weaken
 * the check (a benign false-negative direction), never misflag a
 * legitimate pick. `duration_fit`, `reroute`, and `substitution`
 * markers are legitimate overrides and are never violations.
 */
export function steeredGenerationHardFailures(
  cell: SteeredGeneratedPlanMatrixCell,
  draft: SessionDraft,
  trace: DraftAssemblyTrace,
): GeneratedPlanHardFailure[] {
  const failures: GeneratedPlanHardFailure[] = []
  const archetype = selectArchetype(draft.context)
  const layout = archetype?.layouts[draft.context.timeProfile] ?? []

  const mainSkillSlots = trace.slots.filter(
    (slot): slot is Extract<DraftAssemblyTraceSlot, { selected: true }> =>
      slot.type === 'main_skill' && slot.selected,
  )

  for (const traceSlot of mainSkillSlots) {
    if (traceSlot.selectionPath === undefined) {
      failures.push({
        code: 'steering_violation',
        blockId: traceSlot.blockId,
        blockType: traceSlot.type,
        layoutIndex: traceSlot.layoutIndex,
        drillId: traceSlot.drillId,
        variantId: traceSlot.variantId,
        message: 'Steered main-skill slot carries no selection-path marker.',
      })
      continue
    }
    if (traceSlot.selectionPath !== 'rung_nearest') continue

    const slot = layout[traceSlot.layoutIndex]
    if (!slot) continue // assembly_trace_mismatch owns layout drift
    const pool = findCandidates(slot, draft.context, { playerLevel: draft.context.playerLevel })
    if (!pool.some((candidate) => candidate.drill.id === traceSlot.drillId)) {
      continue // hard_filter_violation owns out-of-pool picks
    }
    const otherBlockDrillIds = new Set(
      draft.blocks.filter((block) => block.id !== traceSlot.blockId).map((block) => block.drillId),
    )
    const eligible = pool.filter((candidate) => !otherBlockDrillIds.has(candidate.drill.id))
    const checkPool = eligible.length > 0 ? eligible : pool
    const nearestDistance = Math.min(
      ...checkPool.map((candidate) =>
        steeredRungDistance(cell.focus, candidate.drill.id, cell.position),
      ),
    )
    const selectedDistance = steeredRungDistance(cell.focus, traceSlot.drillId, cell.position)
    if (selectedDistance > nearestDistance) {
      failures.push({
        code: 'steering_violation',
        blockId: traceSlot.blockId,
        blockType: traceSlot.type,
        layoutIndex: traceSlot.layoutIndex,
        drillId: traceSlot.drillId,
        variantId: traceSlot.variantId,
        message: `rung_nearest pick is ${selectedDistance} rungs from position ${cell.position}; a candidate at distance ${nearestDistance} was eligible.`,
      })
    }
  }

  // Provenance integrity mirrors the builder's stamp rule (one
  // build-time "steered" definition, KTD1): all realized main-skill
  // rungs on target ⇔ `steeredFocus` stamped.
  if (mainSkillSlots.length > 0) {
    const realizedOnTarget = mainSkillSlots.every(
      (slot) => stressRungForDrill(cell.focus, slot.drillId) === cell.position,
    )
    if (realizedOnTarget && draft.steeredFocus !== cell.focus) {
      failures.push({
        code: 'steered_focus_missing',
        message: `Every realized main-skill rung equals position ${cell.position} but the draft carries no steeredFocus.`,
      })
    }
    if (!realizedOnTarget && draft.steeredFocus === cell.focus) {
      failures.push({
        code: 'steering_violation',
        message: 'steeredFocus is stamped but a realized main-skill rung is off the steer target.',
      })
    }
  }

  return failures
}

export function evaluateSteeredGeneratedPlanDiagnosticCell(
  cell: SteeredGeneratedPlanMatrixCell,
  configuration: ReadinessConfiguration,
): SteeredGeneratedPlanDiagnosticResult {
  const context = contextForDiagnosticCell(cell, configuration)
  const generated = buildDraftWithAssemblyTrace(context, {
    assemblySeed: cell.seed,
    playerLevel: cell.level,
    stressPositions: { [cell.focus]: cell.position },
  })

  if (!generated) {
    return {
      ...cell,
      status: 'hard_failure',
      hardFailures: [{ code: 'no_draft' }],
      observations: [],
    }
  }

  const applicableCell: ApplicableGeneratedPlanMatrixCell = {
    focus: cell.focus,
    configuration: cell.configuration,
    level: cell.level,
    duration: cell.duration,
    seed: cell.seed,
    status: 'applicable',
  }
  const base = analyzeGeneratedPlanDraft(
    applicableCell,
    configuration,
    generated.draft,
    generated.assemblyTrace,
  )
  const hardFailures = [
    ...base.hardFailures,
    ...steeredGenerationHardFailures(cell, generated.draft, generated.assemblyTrace),
  ]

  return {
    ...cell,
    status: statusForFindings(hardFailures, base.observations),
    hardFailures,
    observations: base.observations,
  }
}

export function buildSteeredGeneratedPlanDiagnostics(
  surface: SteeredGeneratedPlanSurface = STEERED_GENERATED_PLAN_SURFACE,
): SteeredGeneratedPlanDiagnosticResult[] {
  const canonicalConfigurationsById = new Map(
    READINESS_CONFIGURATIONS.map((configuration) => [configuration.id, configuration] as const),
  )
  return buildSteeredGeneratedPlanMatrix(surface).map((cell) => {
    const configuration = canonicalConfigurationsById.get(cell.configuration)
    if (!configuration) {
      return {
        ...cell,
        status: 'hard_failure' as const,
        hardFailures: [
          {
            code: 'no_draft' as const,
            message: `No canonical readiness configuration for ${cell.configuration}.`,
          },
        ],
        observations: [],
      }
    }
    return evaluateSteeredGeneratedPlanDiagnosticCell(cell, configuration)
  })
}

export interface SteeredGeneratedPlanDiagnosticSummary {
  readonly surface: {
    readonly focuses: readonly VisibleFocus[]
    readonly configurations: readonly ReadinessConfigurationId[]
    readonly levels: readonly PlayerLevel[]
    readonly durations: readonly TimeProfile[]
    readonly seedIds: readonly string[]
    readonly positionRoles: readonly SteeredGeneratedPlanPositionRole[]
    readonly cellCount: number
    /**
     * Cells whose `band_start` position degenerately coincides with the
     * same cell's ladder min or max (documented overlap; the role stays
     * a distinct matrix dimension).
     */
    readonly degenerateBandStartCellCount: number
  }
  readonly statusCounts: Record<GeneratedPlanDiagnosticStatus, number>
  readonly hardFailureCount: number
  readonly observationCount: number
  readonly hardFailureCounts: Partial<Record<GeneratedPlanHardFailureCode, number>>
  readonly observationCounts: Partial<Record<GeneratedPlanObservationCode, number>>
}

export function summarizeSteeredGeneratedPlanDiagnostics(
  results: readonly SteeredGeneratedPlanDiagnosticResult[],
): SteeredGeneratedPlanDiagnosticSummary {
  const statusCounts: Record<GeneratedPlanDiagnosticStatus, number> = {
    clean: 0,
    observation_only: 0,
    hard_failure: 0,
  }
  const hardFailureCounts: Partial<Record<GeneratedPlanHardFailureCode, number>> = {}
  const observationCounts: Partial<Record<GeneratedPlanObservationCode, number>> = {}

  for (const result of results) {
    statusCounts[result.status] += 1
    for (const failure of result.hardFailures) {
      incrementCount(hardFailureCounts, failure.code)
    }
    for (const observation of result.observations) {
      incrementCount(observationCounts, observation.code)
    }
  }

  const degenerateBandStartCellCount = results.filter(
    (result) =>
      result.positionRole === 'band_start' &&
      (result.position === stressLadderBounds(result.focus).min ||
        result.position === stressLadderBounds(result.focus).max),
  ).length

  return {
    surface: {
      focuses: [...new Set(results.map((result) => result.focus))],
      configurations: [...new Set(results.map((result) => result.configuration))],
      levels: [...new Set(results.map((result) => result.level))],
      durations: [...new Set(results.map((result) => result.duration))],
      seedIds: [...new Set(results.map((result) => result.seed))],
      positionRoles: [...new Set(results.map((result) => result.positionRole))],
      cellCount: results.length,
      degenerateBandStartCellCount,
    },
    statusCounts,
    hardFailureCount: results.reduce((sum, result) => sum + result.hardFailures.length, 0),
    observationCount: results.reduce((sum, result) => sum + result.observations.length, 0),
    hardFailureCounts,
    observationCounts,
  }
}

export function summarizeGeneratedPlanDiagnostics(
  results: readonly GeneratedPlanDiagnosticResult[],
  matrix?: readonly GeneratedPlanMatrixEntry[],
): GeneratedPlanDiagnosticSummary {
  const statusCounts: Record<GeneratedPlanDiagnosticStatus, number> = {
    clean: 0,
    observation_only: 0,
    hard_failure: 0,
  }
  const hardFailureCounts: Partial<Record<GeneratedPlanHardFailureCode, number>> = {}
  const observationCounts: Partial<Record<GeneratedPlanObservationCode, number>> = {}

  for (const result of results) {
    statusCounts[result.status] += 1
    for (const failure of result.hardFailures) {
      incrementCount(hardFailureCounts, failure.code)
    }
    for (const observation of result.observations) {
      incrementCount(observationCounts, observation.code)
    }
  }

  const summaryMatrix: readonly GeneratedPlanMatrixEntry[] =
    matrix ??
    results.map((result) => ({
      focus: result.focus,
      configuration: result.configuration,
      level: result.level,
      duration: result.duration,
      seed: result.seed,
      status: 'applicable',
    }))

  return {
    surface: buildGeneratedPlanSurfaceSummary(summaryMatrix),
    notApplicable: summaryMatrix.filter(
      (entry): entry is NotApplicableGeneratedPlanMatrixCell => entry.status === 'not_applicable',
    ),
    statusCounts,
    hardFailureCount: results.reduce((sum, result) => sum + result.hardFailures.length, 0),
    observationCount: results.reduce((sum, result) => sum + result.observations.length, 0),
    hardFailureCounts,
    observationCounts,
  }
}

function firstDefined<T>(values: readonly (T | undefined)[]): T | undefined {
  return values.find((value): value is T => value !== undefined)
}

function observationGroupKey(observations: readonly GeneratedPlanObservation[]): string {
  const representative = observations[0]
  return [
    firstDefined(observations.map((observation) => observation.drillId)) ?? 'none',
    firstDefined(observations.map((observation) => observation.variantId)) ?? 'none',
    firstDefined(observations.map((observation) => observation.blockType)) ?? 'none',
    representative?.required === undefined ? 'none' : String(representative.required),
    firstDefined(observations.map((observation) => observation.authoredMinMinutes)) ?? 'none',
    firstDefined(observations.map((observation) => observation.authoredMaxMinutes)) ?? 'none',
    firstDefined(observations.map((observation) => observation.fatigueMaxMinutes)) ?? 'none',
  ].join('|')
}

function observationGroupPublicKey(
  group: Pick<
    GeneratedPlanObservationGroup,
    'drillId' | 'variantId' | 'blockType' | 'required' | 'observationCodes'
  >,
): string {
  return [
    'gpdg',
    'v1',
    group.drillId ?? 'none',
    group.variantId ?? 'none',
    group.blockType ?? 'none',
    group.required === undefined ? 'none' : String(group.required),
    [...group.observationCodes].sort().join('+'),
  ].join(':')
}

function observationGroupFingerprint(
  group: Pick<
    GeneratedPlanObservationGroup,
    | 'authoredMinMinutes'
    | 'authoredMaxMinutes'
    | 'fatigueMaxMinutes'
    | 'affectedCellCount'
    | 'likelyFixPaths'
    | 'affectedCells'
  >,
): string {
  const exampleCells = [...group.affectedCells]
    .sort(
      (a, b) =>
        [
          a.focus.localeCompare(b.focus),
          a.configuration.localeCompare(b.configuration),
          a.level.localeCompare(b.level),
          a.duration - b.duration,
          a.seed.localeCompare(b.seed),
          (a.blockId ?? '').localeCompare(b.blockId ?? ''),
        ].find((comparison) => comparison !== 0) ?? 0,
    )
    .slice(0, 3)
    .map((cell) =>
      [
        cell.focus,
        cell.configuration,
        cell.level,
        cell.duration,
        cell.seed,
        cell.blockId ?? 'none',
        cell.plannedMinutes ?? 'none',
        cell.allocatedMinutes ?? 'none',
        [...cell.observationCodes].sort().join('+'),
      ].join('/'),
    )

  return [
    'gpdf',
    'v1',
    group.authoredMinMinutes ?? 'none',
    group.authoredMaxMinutes ?? 'none',
    group.fatigueMaxMinutes ?? 'none',
    group.affectedCellCount,
    [...group.likelyFixPaths].sort().join('+'),
    ...exampleCells,
  ].join('|')
}

function withObservationGroupIdentity(
  group: Omit<GeneratedPlanObservationGroup, 'groupKey' | 'diagnosticFingerprint'>,
): GeneratedPlanObservationGroup {
  const keyedGroup = {
    ...group,
    groupKey: observationGroupPublicKey(group),
    diagnosticFingerprint: '',
  }
  return {
    ...keyedGroup,
    diagnosticFingerprint: observationGroupFingerprint(keyedGroup),
  }
}

function likelyFixPathsForObservationCodes(
  codes: readonly GeneratedPlanObservationCode[],
): readonly string[] {
  if (codes.includes('slot_dropped') || codes.includes('under_named_profile_duration')) {
    // U4 (2026-05-24 duration-honesty plan, R13): both new findings
    // route to coverage authoring rather than the legacy redistribution
    // policy fixes. `source_backed_content_depth` and
    // `coverage_gap_review` are the named next steps; the legacy
    // `block_split` / `variant_cap_review` paths only apply when an
    // over-cap event surfaces (which R1 + R2 retired).
    return ['coverage_gap_review', 'source_backed_content_depth']
  }
  if (
    codes.includes('under_authored_min') ||
    codes.includes('over_authored_max') ||
    codes.includes('over_fatigue_cap')
  ) {
    return ['policy_allowance', 'block_split', 'variant_cap_review', 'source_backed_content_depth']
  }
  return ['generated_variety_policy']
}

export function buildGeneratedPlanObservationGroups(
  results: readonly GeneratedPlanDiagnosticResult[],
): GeneratedPlanObservationGroup[] {
  const groups = new Map<string, GeneratedPlanObservationGroup>()

  for (const result of results) {
    const observationsByBlock = new Map<string, GeneratedPlanObservation[]>()
    for (const observation of result.observations) {
      const key = observation.blockId ?? `${observation.code}:result`
      observationsByBlock.set(key, [...(observationsByBlock.get(key) ?? []), observation])
    }

    for (const observations of observationsByBlock.values()) {
      const representative = observations[0]
      if (!representative) continue

      const key = observationGroupKey(observations)
      const existing = groups.get(key)
      const observationCodes = [...new Set(observations.map((observation) => observation.code))]
      const drillId = firstDefined(observations.map((observation) => observation.drillId))
      const variantId = firstDefined(observations.map((observation) => observation.variantId))
      const { variant: selectedVariant } =
        drillId !== undefined && variantId !== undefined
          ? findVariant(drillId, variantId)
          : { variant: undefined }
      const affectedCell: GeneratedPlanObservationAffectedCell = {
        focus: result.focus,
        configuration: result.configuration,
        level: result.level,
        duration: result.duration,
        seed: result.seed,
        blockId: representative.blockId,
        plannedMinutes: firstDefined(observations.map((observation) => observation.plannedMinutes)),
        allocatedMinutes: firstDefined(
          observations.map((observation) => observation.allocatedMinutes),
        ),
        authoredMinMinutes:
          firstDefined(observations.map((observation) => observation.authoredMinMinutes)) ??
          selectedVariant?.workload.durationMinMinutes,
        authoredMaxMinutes:
          firstDefined(observations.map((observation) => observation.authoredMaxMinutes)) ??
          selectedVariant?.workload.durationMaxMinutes,
        fatigueMaxMinutes:
          firstDefined(observations.map((observation) => observation.fatigueMaxMinutes)) ??
          selectedVariant?.workload.fatigueCap?.maxMinutes,
        observationCodes,
        redistribution: observations.find((observation) => observation.redistribution)
          ?.redistribution,
      }

      if (existing) {
        const mergedCodes = [...new Set([...existing.observationCodes, ...observationCodes])]
        groups.set(key, {
          ...withObservationGroupIdentity({
            ...existing,
            affectedCellCount: existing.affectedCellCount + 1,
            observationCodes: mergedCodes,
            likelyFixPaths: likelyFixPathsForObservationCodes(mergedCodes),
            affectedCells: [...existing.affectedCells, affectedCell],
          }),
        })
        continue
      }

      groups.set(
        key,
        withObservationGroupIdentity({
          drillId: firstDefined(observations.map((observation) => observation.drillId)),
          variantId: firstDefined(observations.map((observation) => observation.variantId)),
          blockType: firstDefined(observations.map((observation) => observation.blockType)),
          required: representative.required,
          authoredMinMinutes: firstDefined(
            observations.map((observation) => observation.authoredMinMinutes),
          ),
          authoredMaxMinutes: firstDefined(
            observations.map((observation) => observation.authoredMaxMinutes),
          ),
          fatigueMaxMinutes: firstDefined(
            observations.map((observation) => observation.fatigueMaxMinutes),
          ),
          affectedCellCount: 1,
          observationCodes,
          likelyFixPaths: likelyFixPathsForObservationCodes(observationCodes),
          affectedCells: [affectedCell],
        }),
      )
    }
  }

  return [...groups.values()].sort(
    (a, b) =>
      b.affectedCellCount - a.affectedCellCount ||
      (a.drillId ?? '').localeCompare(b.drillId ?? '') ||
      (a.variantId ?? '').localeCompare(b.variantId ?? ''),
  )
}
