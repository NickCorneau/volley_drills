/**
 * Pre-start session draft — the in-progress local-edit shape that
 * `Today's Setup` mutates and `Begin` promotes into a `SessionPlan`.
 * Persistence-internal: only ever a single row with `id: 'current'`.
 */
import type { DrillSegment } from '../types/drill'
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
  /**
   * Optional bonus prose, copied from `DrillVariant.courtsideInstructionsBonus`.
   * Rendered by RunScreen below the segment list only when all segments
   * have completed (overflow / bonus territory). See
   * `docs/plans/2026-04-28-per-move-pacing-indicator.md`.
   */
  courtsideInstructionsBonus?: string
  required: boolean
  rationale?: string
  subBlockIntervalSeconds?: number
  /**
   * Composed sub-segments snapshotted from `DrillVariant.segments` at
   * draft-build time. Rides the same snapshot pipeline as
   * `subBlockIntervalSeconds`. See
   * `docs/plans/2026-04-28-per-move-pacing-indicator.md` U1.
   */
  segments?: readonly DrillSegment[]
}

export interface SessionDraft {
  id: 'current'
  context: SetupContext
  archetypeId: ArchetypeId
  archetypeName: string
  assemblySeed?: string
  assemblyAlgorithmVersion?: number
  /**
   * Stress-visibility provenance (KTD1/KTD2 of the 2026-06-11 trust-loop
   * plan): the focus this draft's assembly was rung-steered on, stamped
   * at build time only when the realized main_skill pick landed on the
   * steer-target rung. Assembly metadata in the `assemblySeed` family —
   * non-indexed, not a capture field. Absent means unsteered (legacy
   * drafts, Repeat, recovery, substitution, off-target picks).
   */
  steeredFocus?: NonNullable<SetupContext['sessionFocus']>
  blocks: DraftBlock[]
  updatedAt: number
  rationale?: string
}
