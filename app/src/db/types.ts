import type { ArchetypeId, BlockSlotType, PlayerMode, TimeProfile } from '../types/session'

export interface SessionPlanBlock {
  id: string
  type: BlockSlotType
  drillName: string
  shortName: string
  durationMinutes: number
  coachingCue: string
  courtsideInstructions: string
  required: boolean
}

export interface SessionPlanSafetyCheck {
  painFlag: boolean
  trainingRecency?: string
  heatCta: boolean
  painOverridden: boolean
}

export interface SetupContext {
  playerMode: PlayerMode
  timeProfile: TimeProfile
  netAvailable: boolean
  wallAvailable: boolean
}

export interface SessionPlan {
  id: string
  presetId: string
  presetName: string
  playerCount: 1 | 2
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
}

export interface SessionDraft {
  id: 'current'
  context: SetupContext
  archetypeId: ArchetypeId
  archetypeName: string
  blocks: DraftBlock[]
  updatedAt: number
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
}

export type IncompleteReason = 'time' | 'fatigue' | 'pain' | 'other'

export interface DrillVariantScore {
  drillId: string
  variantId: string
  goodPasses: number
  totalAttempts: number
}

export interface SessionReview {
  id: string
  executionLogId: string
  sessionRpe: number
  goodPasses: number
  totalAttempts: number
  drillScores?: DrillVariantScore[]
  /**
   * Schema-reserved for the three-layer self-scoring bias correction in
   * D104 / docs/research/binary-scoring-progression.md. Captures how many
   * of the `goodPasses` the athlete considers borderline. v0b does not
   * compute the near-boundary zone or prompt for this value; leave
   * `undefined`. M001-build will wire the 10-second borderline-review UI
   * and the corrected-Bayesian posterior on top without a migration.
   * Tracked as V0B-29.
   */
  borderlineCount?: number
  incompleteReason?: IncompleteReason
  quickTags?: string[]
  shortNote?: string
  submittedAt: number
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
