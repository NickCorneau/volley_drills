/**
 * Pre-start session draft — the in-progress local-edit shape that
 * `Today's Setup` mutates and `Begin` promotes into a `SessionPlan`.
 * Persistence-internal: only ever a single row with `id: 'current'`.
 */
import type { ArchetypeId, BlockSlotType, SetupContext } from '../types/session'

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
