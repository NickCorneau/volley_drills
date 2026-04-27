import type {
  ExecutionLog,
  ExecutionLogBlockStatus,
  ExecutionStatus,
  SessionPlan,
  SessionPlanBlock,
  SessionReview,
} from '../db/types'
import type { BlockSlotType, SetupContext } from '../types/session'

type BlockOverrides = Partial<SessionPlanBlock> & {
  id?: string
  type?: BlockSlotType
}

interface PlanOverrides extends Partial<Omit<SessionPlan, 'blocks' | 'safetyCheck' | 'context'>> {
  blocks?: BlockOverrides[]
  context?: Partial<SetupContext>
  safetyCheck?: Partial<SessionPlan['safetyCheck']>
}

interface ExecutionLogOverrides extends Partial<Omit<ExecutionLog, 'blockStatuses'>> {
  blockStatuses?: Partial<ExecutionLogBlockStatus>[]
}

const defaultContext: SetupContext = {
  playerMode: 'pair',
  timeProfile: 25,
  netAvailable: true,
  wallAvailable: false,
  wind: 'calm',
}

function currentBlock(overrides: BlockOverrides = {}): SessionPlanBlock {
  return {
    id: overrides.id ?? 'block-main',
    type: overrides.type ?? 'main_skill',
    drillId: overrides.drillId ?? 'd03',
    variantId: overrides.variantId ?? 'd03-pair',
    drillName: overrides.drillName ?? 'Continuous Passing',
    shortName: overrides.shortName ?? 'Continuous',
    durationMinutes: overrides.durationMinutes ?? 8,
    coachingCue: overrides.coachingCue ?? 'Quiet platform.',
    courtsideInstructions: overrides.courtsideInstructions ?? 'Pass controlled balls to target.',
    required: overrides.required ?? true,
    rationale: overrides.rationale,
    subBlockIntervalSeconds: overrides.subBlockIntervalSeconds,
  }
}

function legacyBlock(overrides: BlockOverrides = {}): SessionPlanBlock {
  const block = currentBlock(overrides)
  delete block.drillId
  delete block.variantId
  return block
}

export function currentPersistedPlan(overrides: PlanOverrides = {}): SessionPlan {
  return {
    id: overrides.id ?? 'plan-current',
    presetId: overrides.presetId ?? 'pair_net_25',
    presetName: overrides.presetName ?? 'Pair net 25',
    playerCount: overrides.playerCount ?? 2,
    blocks: (overrides.blocks ?? [{}]).map((block) => currentBlock(block)),
    safetyCheck: {
      painFlag: overrides.safetyCheck?.painFlag ?? false,
      trainingRecency: overrides.safetyCheck?.trainingRecency,
      heatCta: overrides.safetyCheck?.heatCta ?? false,
      painOverridden: overrides.safetyCheck?.painOverridden ?? false,
    },
    context: {
      ...defaultContext,
      ...overrides.context,
    },
    createdAt: overrides.createdAt ?? 1000,
  }
}

export function legacyPersistedPlan(overrides: PlanOverrides = {}): SessionPlan {
  return {
    ...currentPersistedPlan(overrides),
    blocks: (overrides.blocks ?? [{}]).map((block) => legacyBlock(block)),
  }
}

function defaultBlockStatus(status: ExecutionStatus): ExecutionLogBlockStatus['status'] {
  return status === 'completed' ? 'completed' : status === 'in_progress' ? 'in_progress' : 'planned'
}

export function currentPersistedExecutionLog(overrides: ExecutionLogOverrides = {}): ExecutionLog {
  const status = overrides.status ?? 'in_progress'

  return {
    id: overrides.id ?? 'exec-current',
    planId: overrides.planId ?? 'plan-current',
    status,
    activeBlockIndex: overrides.activeBlockIndex ?? 0,
    blockStatuses: (overrides.blockStatuses ?? [{}]).map((blockStatus, index) => ({
      blockId: blockStatus.blockId ?? `block-${index + 1}`,
      status: blockStatus.status ?? defaultBlockStatus(status),
      startedAt: blockStatus.startedAt ?? (status === 'not_started' ? undefined : 1000),
      completedAt: blockStatus.completedAt ?? (status === 'completed' ? 2000 : undefined),
    })),
    startedAt: overrides.startedAt ?? 1000,
    pausedAt: overrides.pausedAt,
    completedAt: overrides.completedAt,
    endedEarlyReason: overrides.endedEarlyReason,
    actualDurationMinutes: overrides.actualDurationMinutes,
    swapCount: overrides.swapCount,
  }
}

export function currentPersistedReview(overrides: Partial<SessionReview> = {}): SessionReview {
  return {
    id: overrides.id ?? 'review-current',
    executionLogId: overrides.executionLogId ?? 'exec-current',
    sessionRpe: overrides.sessionRpe ?? 5,
    goodPasses: overrides.goodPasses ?? 8,
    totalAttempts: overrides.totalAttempts ?? 10,
    drillScores: overrides.drillScores,
    perDrillCaptures: overrides.perDrillCaptures,
    borderlineCount: overrides.borderlineCount,
    incompleteReason: overrides.incompleteReason,
    quickTags: overrides.quickTags,
    shortNote: overrides.shortNote,
    submittedAt: overrides.submittedAt ?? 2000,
    capturedAt: overrides.capturedAt ?? 2000,
    captureDelaySeconds: overrides.captureDelaySeconds ?? 0,
    captureWindow: overrides.captureWindow ?? 'immediate',
    eligibleForAdaptation: overrides.eligibleForAdaptation ?? true,
    status: overrides.status ?? 'submitted',
  }
}
