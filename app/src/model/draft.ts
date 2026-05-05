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
  blocks: DraftBlock[]
  updatedAt: number
  rationale?: string
  /**
   * Build-time signal computed by `buildDraft` and persisted on the
   * draft row so the Tune today eyebrow survives reload. `true` when
   * the assembly engine had to relax the user's saved skill level
   * for ≥1 focus-controlled slot (`main_skill` / `pressure`) to
   * fill the draft. See R10 / KD9 of
   * `docs/brainstorms/2026-05-04-skill-level-mutability-requirements.md`.
   *
   * Lifecycle: `buildDraft` → `sessionDrafts` row → `useTuneTodayController`
   * → eyebrow render. Intentionally NOT promoted to `SessionPlan`
   * because the draft is the only surface that needs it (the
   * eyebrow lives on Tune today, which only sees drafts) — the
   * boundary is build-vs-plan, not domain-vs-UI. Legacy drafts (pre-
   * 2026-05-04) read as `undefined`; the eyebrow's strict-equality
   * `=== true` check renders nothing in that case.
   *
   * Drafts produced by `buildDraftFromCompletedBlocks` and
   * `buildRecoveryDraft` set `false` unconditionally: recovery is
   * load-down regardless of level; repeat carries the original plan
   * context but does not re-run the level-relax detection.
   */
  levelRelaxed?: boolean
}
