import type { ArchetypeId, BlockSlotType, SetupContext } from '../types/session'

export type { SetupContext }
export type {
  DifficultyTag,
  DrillVariantScore,
  IncompleteReason,
  PerDrillCapture,
  RpeCaptureWindow,
  SessionReview,
  SessionReviewStatus,
} from './reviewTypes'

export interface SessionPlanBlock {
  id: string
  type: BlockSlotType
  drillId?: string
  variantId?: string
  drillName: string
  shortName: string
  durationMinutes: number
  coachingCue: string
  courtsideInstructions: string
  required: boolean
  rationale?: string
  subBlockIntervalSeconds?: number
}

export interface SessionPlanSafetyCheck {
  painFlag: boolean
  trainingRecency?: string
  heatCta: boolean
  painOverridden: boolean
}

export interface SessionPlan {
  id: string
  presetId: string
  presetName: string
  playerCount: 1 | 2
  assemblySeed?: string
  assemblyAlgorithmVersion?: number
  blocks: SessionPlanBlock[]
  safetyCheck: SessionPlanSafetyCheck
  context?: SetupContext
  createdAt: number
}

export interface DraftBlock {
  id: string
  type: BlockSlotType
  drillId: string
  variantId: string
  drillName: string
  shortName: string
  durationMinutes: number
  coachingCue: string
  courtsideInstructions: string
  required: boolean
  rationale?: string
  subBlockIntervalSeconds?: number
}

export interface SessionDraft {
  id: 'current'
  context: SetupContext
  archetypeId: ArchetypeId
  archetypeName: string
  assemblySeed?: string
  assemblyAlgorithmVersion?: number
  blocks: DraftBlock[]
  updatedAt: number
  rationale?: string
}

export type ExecutionStatus = 'not_started' | 'in_progress' | 'paused' | 'ended_early' | 'completed'

export type ExecutionBlockStatus = 'planned' | 'in_progress' | 'skipped' | 'completed'

export interface ExecutionLogBlockStatus {
  blockId: string
  status: ExecutionBlockStatus
  startedAt?: number
  completedAt?: number
}

export interface ExecutionLog {
  id: string
  planId: string
  status: ExecutionStatus
  activeBlockIndex: number
  blockStatuses: ExecutionLogBlockStatus[]
  startedAt: number
  pausedAt?: number
  completedAt?: number
  endedEarlyReason?: string
  actualDurationMinutes?: number
  swapCount?: number
  blockOverrides?: Partial<Record<number, SessionPlanBlock>>
}

export type TimerRunStatus = 'running' | 'paused'

export interface TimerState {
  id: 'active'
  executionLogId: string
  blockIndex: number
  startedAt: number
  accumulatedElapsed: number
  effectiveDurationSeconds?: number
  status: TimerRunStatus
  lastFlushedAt: number
}

export interface StorageMetaEntry {
  key: string
  value: unknown
  updatedAt: number
}
