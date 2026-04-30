import type { ArchetypeId, BlockSlotType, PlayerLevel, SkillFocus, TimeProfile } from '../../model'

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
