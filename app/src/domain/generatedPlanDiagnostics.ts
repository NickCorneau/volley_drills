import { DRILLS } from '../data/drills'
import { selectArchetype } from '../data/archetypes'
import type { BlockSlot, BlockSlotType, PlayerLevel, SessionDraft, SetupContext, TimeProfile } from '../model'
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

export type GeneratedPlanObservationCode =
  | 'under_authored_min'
  | 'over_authored_max'
  | 'over_fatigue_cap'
  | 'optional_slot_redistribution'
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

export const DEFAULT_GENERATED_PLAN_SURFACE: GeneratedPlanSupportedSurface = {
  focuses: VISIBLE_FOCUSES,
  configurations: READINESS_CONFIGURATIONS,
  levels: PLAYER_LEVELS,
  durations: READINESS_DURATIONS,
  seeds: DEFAULT_GENERATED_PLAN_SEEDS,
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
  return surface.notApplicable?.find((candidate) => matchesNotApplicableCell(cell, candidate))?.reason
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
            entries.push(reason ? { ...cell, status: 'not_applicable', reason } : { ...cell, status: 'applicable' })
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

function incrementCount<Key extends string>(
  counts: Partial<Record<Key, number>>,
  key: Key,
): void {
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

  if (trace && trace.redistributedMinutes > 0 && trace.skippedOptionalLayoutIndexes.length > 0) {
    const targetSlot = trace.slots.find(
      (slot) => slot.layoutIndex === trace.redistributionLayoutIndex,
    )
    observations.push({
      code: 'optional_slot_redistribution',
      blockId: targetSlot?.blockId,
      blockType: targetSlot?.type,
      required: targetSlot?.required,
      layoutIndex: targetSlot?.layoutIndex,
      allocatedMinutes: targetSlot?.allocatedMinutes,
      drillId: targetSlot?.drillId,
      variantId: targetSlot?.variantId,
      skippedOptionalLayoutIndexes: trace.skippedOptionalLayoutIndexes,
      redistribution: {
        source: 'observed',
        redistributedMinutes: trace.redistributedMinutes,
        skippedOptionalLayoutIndexes: trace.skippedOptionalLayoutIndexes,
        redistributionLayoutIndex: trace.redistributionLayoutIndex,
      },
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

    if (
      (overAuthoredMax && !authoredMaxClassified) ||
      (overFatigueMax && !fatigueMaxClassified)
    ) {
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
  block: { readonly drillId: string; readonly variantId: string },
): boolean {
  return findCandidates(slot, context, { playerLevel: context.playerLevel }).some(
    (candidate) => candidate.drill.id === block.drillId && candidate.variant.id === block.variantId,
  )
}

function traceSlotMatchesBlock(
  traceSlot: DraftAssemblyTraceSlot,
  block: { readonly drillId: string; readonly variantId: string; readonly type: BlockSlotType; readonly required: boolean },
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

  if (totalDraftMinutes(draft) !== cell.duration) {
    failures.push({
      code: 'wrong_total_duration',
      message: `Expected ${cell.duration} minutes, got ${totalDraftMinutes(draft)}.`,
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
      failures.push({
        code: 'off_focus_controlled_work',
        blockId: block.id,
        drillId: block.drillId,
        variantId: block.variantId,
      })
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
    (block, index) => focusedBlocks.findIndex((candidate) => candidate.drillId === block.drillId) !== index,
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

export function buildGeneratedPlanDiagnostics(
  surface: GeneratedPlanSupportedSurface = DEFAULT_GENERATED_PLAN_SURFACE,
): GeneratedPlanDiagnosticResult[] {
  const configurationsById = new Map(
    surface.configurations.map((configuration) => [configuration.id, configuration] as const),
  )

  return buildApplicableGeneratedPlanInputs(surface).map((cell) => {
    const configuration = configurationsById.get(cell.configuration)
    if (!configuration) {
      return {
        ...cell,
        status: 'hard_failure',
        hardFailures: [
          {
            code: 'no_draft',
            message: `No registered configuration for ${cell.configuration}.`,
          },
        ],
        observations: [],
      }
    }
    return evaluateGeneratedPlanDiagnosticCell(cell, configuration)
  })
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

  const summaryMatrix: readonly GeneratedPlanMatrixEntry[] = matrix ?? results.map((result) => ({
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

function observationGroupPublicKey(group: Pick<
  GeneratedPlanObservationGroup,
  'drillId' | 'variantId' | 'blockType' | 'required' | 'observationCodes'
>): string {
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
    .sort((a, b) =>
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
  if (codes.includes('optional_slot_redistribution')) {
    return [
      'generator_policy_investigation',
      'policy_allowance',
      'block_split',
      'variant_cap_review',
      'source_backed_content_depth',
    ]
  }
  if (
    codes.includes('under_authored_min') ||
    codes.includes('over_authored_max') ||
    codes.includes('over_fatigue_cap') ||
    codes.includes('optional_slot_redistribution')
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
        observationCodes,
        redistribution: observations.find((observation) => observation.redistribution)?.redistribution,
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

      groups.set(key, withObservationGroupIdentity({
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
      }))
    }
  }

  return [...groups.values()].sort(
    (a, b) =>
      b.affectedCellCount - a.affectedCellCount ||
      (a.drillId ?? '').localeCompare(b.drillId ?? '') ||
      (a.variantId ?? '').localeCompare(b.variantId ?? ''),
  )
}
