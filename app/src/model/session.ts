/**
 * Session product types — the planned and executed shape of a single
 * volleyball training session.
 *
 * Layer rule (U4 of the architecture pass): pure product types only.
 * No Dexie, no React, no service-IO. Persisted row shapes in
 * `app/src/db/types.ts` re-export these directly today; if persistence
 * concerns (audit columns, sentinels) ever need to extend a row, the
 * extended interface lives in `db/`, not here.
 */
import type { BlockSlotType, SetupContext } from '../types/session'

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
