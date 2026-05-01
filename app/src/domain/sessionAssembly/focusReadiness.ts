import { selectArchetype } from '../../data/archetypes'
import type {
  ArchetypeId,
  BlockSlot,
  BlockSlotType,
  PlayerLevel,
  SetupContext,
  SkillFocus,
  TimeProfile,
} from '../../model'
import { findCandidates, type CandidateVariant } from './candidates'

export type VisibleFocus = Extract<SkillFocus, 'pass' | 'serve' | 'set'>

export type ReadinessStatus =
  | 'covered'
  | 'failing'
  | 'not_applicable'
  | 'source_candidate'
  | 'blocked_by_source'
  | 'blocked_by_product_gate'
  | 'fixed_pending_verification'
  | 'verified'

export type ReadinessRiskBucket =
  | 'cannot_generate'
  | 'off_focus_support'
  | 'no_same_focus_swap'
  | 'thin_long_session'
  | 'skill_level_unhonored'
  | 'source_trace_missing'

export type FocusReadinessSlotType = Extract<
  BlockSlotType,
  'technique' | 'movement_proxy' | 'main_skill' | 'pressure'
>

export type ReadinessConfigurationId = ArchetypeId

export type SlotReadinessStatus = Extract<ReadinessStatus, 'covered' | 'failing' | 'not_applicable'>

export interface CatalogIdReference {
  readonly drillId: string
  readonly variantId: string
}

export interface FocusReadinessGapCard {
  readonly id: string
  readonly focus: VisibleFocus
  readonly configuration: ArchetypeId
  readonly level: PlayerLevel
  readonly duration: TimeProfile
  readonly missingSlotType: FocusReadinessSlotType
  readonly status: ReadinessStatus
  readonly riskBucket: ReadinessRiskBucket
  readonly candidateSourceMaterial: readonly string[]
  readonly exactSourceReference?: string
  readonly adaptationDelta?: string
  readonly eligibilityRationale?: string
  readonly sourceFaithfulnessRationale?: string
  readonly affectedCatalogIds: readonly CatalogIdReference[]
  readonly requiresNewCatalogId?: boolean
}

export interface ActivationBatchManifest {
  readonly id: string
  readonly gapCardIds: readonly string[]
  readonly changedCatalogIds: readonly CatalogIdReference[]
  readonly capDelta?: number
  readonly verification: string
  readonly checkpointCriteria: string
}

export interface ReadinessConfiguration {
  readonly id: ReadinessConfigurationId
  readonly context: Pick<SetupContext, 'playerMode' | 'netAvailable' | 'wallAvailable'>
}

export interface FocusReadinessCellInput {
  readonly focus: VisibleFocus
  readonly configuration: ReadinessConfigurationId
  readonly level: PlayerLevel
  readonly duration: TimeProfile
}

export interface SlotReadinessCoverage {
  readonly status: SlotReadinessStatus
  readonly eligibleDrillFamilies: readonly string[]
  readonly eligibleCatalogIds: readonly CatalogIdReference[]
  readonly reason?: string
}

export interface FocusReadinessCellReport extends FocusReadinessCellInput {
  readonly status: Extract<ReadinessStatus, 'failing' | 'verified'>
  readonly riskBuckets: readonly ReadinessRiskBucket[]
  readonly coverage: {
    readonly main: SlotReadinessCoverage
    readonly support: SlotReadinessCoverage
    readonly pressure: SlotReadinessCoverage
    readonly swap: SlotReadinessCoverage
  }
}

export interface FocusReadinessAuditReport {
  readonly cells: readonly FocusReadinessCellReport[]
}

export const VISIBLE_FOCUSES: readonly VisibleFocus[] = ['pass', 'serve', 'set'] as const

export const PLAYER_LEVELS: readonly PlayerLevel[] = [
  'beginner',
  'intermediate',
  'advanced',
] as const

export const READINESS_DURATIONS: readonly TimeProfile[] = [15, 25, 40] as const

export const READINESS_CONFIGURATIONS: readonly ReadinessConfiguration[] = [
  {
    id: 'solo_net',
    context: {
      playerMode: 'solo',
      netAvailable: true,
      wallAvailable: false,
    },
  },
  {
    id: 'solo_wall',
    context: {
      playerMode: 'solo',
      netAvailable: false,
      wallAvailable: true,
    },
  },
  {
    id: 'solo_open',
    context: {
      playerMode: 'solo',
      netAvailable: false,
      wallAvailable: false,
    },
  },
  {
    id: 'pair_net',
    context: {
      playerMode: 'pair',
      netAvailable: true,
      wallAvailable: false,
    },
  },
  {
    id: 'pair_open',
    context: {
      playerMode: 'pair',
      netAvailable: false,
      wallAvailable: false,
    },
  },
] as const

const READINESS_STATUSES: readonly ReadinessStatus[] = [
  'covered',
  'failing',
  'not_applicable',
  'source_candidate',
  'blocked_by_source',
  'blocked_by_product_gate',
  'fixed_pending_verification',
  'verified',
] as const

const READINESS_RISK_BUCKETS: readonly ReadinessRiskBucket[] = [
  'cannot_generate',
  'off_focus_support',
  'no_same_focus_swap',
  'thin_long_session',
  'skill_level_unhonored',
  'source_trace_missing',
] as const

const FORWARD_STATUS_ORDER: Partial<Record<ReadinessStatus, number>> = {
  failing: 0,
  source_candidate: 1,
  fixed_pending_verification: 2,
  verified: 3,
}

const ACTIVATION_READY_STATUSES = new Set<ReadinessStatus>([
  'source_candidate',
  'fixed_pending_verification',
  'verified',
])

const BLOCKED_STATUSES = new Set<ReadinessStatus>([
  'blocked_by_source',
  'blocked_by_product_gate',
])

function hasText(value: string | undefined): boolean {
  return value !== undefined && value.trim().length > 0
}

function findReadinessConfiguration(
  id: ReadinessConfigurationId,
): ReadinessConfiguration | undefined {
  return READINESS_CONFIGURATIONS.find((configuration) => configuration.id === id)
}

function toCatalogIds(candidates: readonly CandidateVariant[]): CatalogIdReference[] {
  return candidates.map((candidate) => ({
    drillId: candidate.drill.id,
    variantId: candidate.variant.id,
  }))
}

function distinctDrillFamilies(candidates: readonly CandidateVariant[]): string[] {
  return [...new Set(candidates.map((candidate) => candidate.drill.id))].sort((a, b) =>
    a.localeCompare(b),
  )
}

function emptyCoverage(
  status: SlotReadinessStatus,
  reason: string,
): SlotReadinessCoverage {
  return {
    status,
    eligibleDrillFamilies: [],
    eligibleCatalogIds: [],
    reason,
  }
}

function coverageFromCandidates(
  candidates: readonly CandidateVariant[],
  minimumDistinctFamilies: number,
  failureReason: string,
): SlotReadinessCoverage {
  const families = distinctDrillFamilies(candidates)
  return {
    status: families.length >= minimumDistinctFamilies ? 'covered' : 'failing',
    eligibleDrillFamilies: families,
    eligibleCatalogIds: toCatalogIds(candidates),
    reason: families.length >= minimumDistinctFamilies ? undefined : failureReason,
  }
}

function slotCandidates(
  slot: BlockSlot | undefined,
  context: SetupContext,
  playerLevel: PlayerLevel,
): readonly CandidateVariant[] {
  if (!slot) return []
  return findCandidates(slot, context, { playerLevel })
}

function supportCandidatesBySlot(
  layout: readonly BlockSlot[],
  context: SetupContext,
  focus: VisibleFocus,
  playerLevel: PlayerLevel,
): readonly CandidateVariant[][] {
  const supportSlots = layout.filter(
    (slot) => slot.type === 'technique' || slot.type === 'movement_proxy',
  )
  return supportSlots.map((slot) =>
    slotCandidates(slot, context, playerLevel).filter((candidate) =>
      candidate.drill.skillFocus.includes(focus),
    ),
  )
}

function risksForCoverage(
  main: SlotReadinessCoverage,
  support: SlotReadinessCoverage,
  pressure: SlotReadinessCoverage,
  swap: SlotReadinessCoverage,
): ReadinessRiskBucket[] {
  const risks = new Set<ReadinessRiskBucket>()
  if (main.status === 'failing') {
    risks.add(main.eligibleDrillFamilies.length === 0 ? 'cannot_generate' : 'thin_long_session')
  }
  if (support.status === 'failing') risks.add('off_focus_support')
  if (pressure.status === 'failing') risks.add('thin_long_session')
  if (swap.status === 'failing') risks.add('no_same_focus_swap')
  return [...risks]
}

export function hasPerSlotSwapCoverage(options: {
  readonly mainFamilies: readonly string[]
  readonly supportFamilyGroups: readonly (readonly string[])[]
  readonly pressureFamilies: readonly string[]
  readonly pressureApplicable: boolean
}): boolean {
  return (
    options.mainFamilies.length >= 2 &&
    options.supportFamilyGroups.every((families) => families.length >= 2) &&
    (!options.pressureApplicable || options.pressureFamilies.length >= 2)
  )
}

function swapCoverageForFocusControlledSlots(
  mainCandidates: readonly CandidateVariant[],
  supportCandidateGroups: readonly (readonly CandidateVariant[])[],
  pressureCandidates: readonly CandidateVariant[],
  pressure: SlotReadinessCoverage,
): SlotReadinessCoverage {
  const mainFamilies = distinctDrillFamilies(mainCandidates)
  const supportFamilyGroups = supportCandidateGroups.map((candidates) =>
    distinctDrillFamilies(candidates),
  )
  const pressureFamilies = distinctDrillFamilies(pressureCandidates)
  const covered = hasPerSlotSwapCoverage({
    mainFamilies,
    supportFamilyGroups,
    pressureFamilies,
    pressureApplicable: pressure.status !== 'not_applicable',
  })
  const supportCandidates = supportCandidateGroups.flat()
  const combinedCandidates =
    pressure.status === 'not_applicable'
      ? [...supportCandidates, ...mainCandidates]
      : [...supportCandidates, ...mainCandidates, ...pressureCandidates]

  return {
    status: covered ? 'covered' : 'failing',
    eligibleDrillFamilies: distinctDrillFamilies(combinedCandidates),
    eligibleCatalogIds: toCatalogIds(combinedCandidates),
    reason: covered ? undefined : 'same_focus_swap_missing',
  }
}

export function isReadinessStatus(value: unknown): value is ReadinessStatus {
  return typeof value === 'string' && (READINESS_STATUSES as readonly string[]).includes(value)
}

export function isReadinessRiskBucket(value: unknown): value is ReadinessRiskBucket {
  return typeof value === 'string' && (READINESS_RISK_BUCKETS as readonly string[]).includes(value)
}

export function canTransitionReadinessStatus(
  from: ReadinessStatus,
  to: ReadinessStatus,
  options?: { readonly unblockNote?: string },
): boolean {
  if (from === to) return true

  if (BLOCKED_STATUSES.has(from)) {
    return hasText(options?.unblockNote) && to === 'source_candidate'
  }

  const fromOrder = FORWARD_STATUS_ORDER[from]
  const toOrder = FORWARD_STATUS_ORDER[to]
  if (fromOrder === undefined || toOrder === undefined) return false

  return toOrder > fromOrder
}

export function validateFocusReadinessGapCard(card: FocusReadinessGapCard): string[] {
  const issues: string[] = []

  if (!hasText(card.id)) {
    issues.push('Gap cards must have a stable id.')
  }

  if (card.candidateSourceMaterial.length === 0) {
    issues.push('Gap cards must list candidate source material.')
  }

  if (ACTIVATION_READY_STATUSES.has(card.status)) {
    if (!hasText(card.exactSourceReference)) {
      issues.push('Activation-ready gap cards must include an exact source reference.')
    }
    if (!hasText(card.adaptationDelta)) {
      issues.push('Activation-ready gap cards must include an adaptation delta.')
    }
    if (!hasText(card.eligibilityRationale)) {
      issues.push('Activation-ready gap cards must include an eligibility rationale.')
    }
    if (!hasText(card.sourceFaithfulnessRationale)) {
      issues.push('Activation-ready gap cards must include a source faithfulness rationale.')
    }
    if (card.affectedCatalogIds.length === 0 && card.requiresNewCatalogId !== true) {
      issues.push(
        'Activation-ready gap cards must list affected drill/variant ids or declare that a new catalog id is required.',
      )
    }
  }

  return issues
}

export function validateActivationBatchManifest(manifest: ActivationBatchManifest): string[] {
  const issues: string[] = []

  if (!hasText(manifest.id)) {
    issues.push('Activation manifests must have a stable id.')
  }

  if (manifest.gapCardIds.length === 0) {
    issues.push('Activation manifests must list included gap cards.')
  }

  if (manifest.changedCatalogIds.length === 0) {
    issues.push('Activation manifests must list changed drill/variant ids.')
  }

  if (manifest.capDelta === undefined || !Number.isInteger(manifest.capDelta)) {
    issues.push('Activation manifests must record the drill-record cap delta.')
  }

  if (!hasText(manifest.verification)) {
    issues.push('Activation manifests must include verification criteria.')
  }

  if (!hasText(manifest.checkpointCriteria)) {
    issues.push('Activation manifests must include checkpoint criteria.')
  }

  return issues
}

export function evaluateFocusReadinessCell(
  input: FocusReadinessCellInput,
): FocusReadinessCellReport {
  const configuration = findReadinessConfiguration(input.configuration)
  if (!configuration) {
    const missingConfiguration = emptyCoverage('failing', 'unknown_configuration')
    return {
      ...input,
      status: 'failing',
      riskBuckets: ['cannot_generate'],
      coverage: {
        main: missingConfiguration,
        support: missingConfiguration,
        pressure: missingConfiguration,
        swap: missingConfiguration,
      },
    }
  }

  const context: SetupContext = {
    ...configuration.context,
    timeProfile: input.duration,
    sessionFocus: input.focus,
  }
  const archetype = selectArchetype(context)
  const layout = archetype?.layouts[input.duration]
  if (!layout || layout.length === 0) {
    const missingLayout = emptyCoverage('failing', 'layout_missing')
    return {
      ...input,
      status: 'failing',
      riskBuckets: ['cannot_generate'],
      coverage: {
        main: missingLayout,
        support: missingLayout,
        pressure: missingLayout,
        swap: missingLayout,
      },
    }
  }

  const mainSlot = layout.find((slot) => slot.type === 'main_skill')
  const pressureSlot = layout.find((slot) => slot.type === 'pressure')
  const mainCandidates = slotCandidates(mainSlot, context, input.level)
  const pressureCandidates = slotCandidates(pressureSlot, context, input.level)
  const supportCandidateGroups = supportCandidatesBySlot(layout, context, input.focus, input.level)
  const supportSlotCandidates = supportCandidateGroups.flat()
  const main = coverageFromCandidates(mainCandidates, 2, 'main_floor_missing')
  const support = coverageFromCandidates(
    supportSlotCandidates,
    1,
    'focus_reinforcing_support_missing',
  )
  const pressure =
    pressureSlot === undefined
      ? emptyCoverage('not_applicable', 'layout_has_no_pressure_slot')
      : coverageFromCandidates(pressureCandidates, 1, 'pressure_floor_missing')

  const swap = swapCoverageForFocusControlledSlots(
    mainCandidates,
    supportCandidateGroups,
    pressureCandidates,
    pressure,
  )
  const riskBuckets = risksForCoverage(main, support, pressure, swap)

  return {
    ...input,
    status: riskBuckets.length === 0 ? 'verified' : 'failing',
    riskBuckets,
    coverage: {
      main,
      support,
      pressure,
      swap,
    },
  }
}

export function buildFocusReadinessAudit(): FocusReadinessAuditReport {
  const cells: FocusReadinessCellReport[] = []

  for (const focus of VISIBLE_FOCUSES) {
    for (const configuration of READINESS_CONFIGURATIONS) {
      for (const level of PLAYER_LEVELS) {
        for (const duration of READINESS_DURATIONS) {
          cells.push(
            evaluateFocusReadinessCell({
              focus,
              configuration: configuration.id,
              level,
              duration,
            }),
          )
        }
      }
    }
  }

  return { cells }
}
