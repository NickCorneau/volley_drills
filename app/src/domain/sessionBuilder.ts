import { selectArchetype } from '../data/archetypes'
import type {
  BlockSlotType,
  DraftBlock,
  ExecutionLog,
  PlayerLevel,
  SessionDraft,
  SessionPlan,
  SetupContext,
} from '../model'
import { pickForSlot, type CandidateVariant } from './sessionAssembly/candidates'
import { allocateDurations, allocateRecoveryDurations } from './sessionAssembly/durations'
import { effectiveLevel } from './sessionAssembly/effectiveLevel'
import { createAssemblySeed, createSeededRandom } from './sessionAssembly/random'
import { deriveBlockRationale } from './sessionAssembly/rationale'
import {
  RECOVERY_REDISTRIBUTION_PRIORITY,
  snapWarmupWrapDurations,
} from './sessionAssembly/snapDurations'
import { pickMainSkillSubstitute } from './sessionAssembly/substitution'
export {
  findSwapAlternatives,
  type FindSwapAlternativesOptions,
} from './sessionAssembly/swapAlternatives'
export { deriveBlockRationale } from './sessionAssembly/rationale'

/**
 * Bumped from 1 to 2 in the 2026-05-04 warmup/wrap segment-snap ship
 * (`docs/plans/2026-05-04-002-feat-warmup-wrap-segment-snap-plan.md`).
 * v2 assembly snaps warmup/wrap blocks down to the chosen variant's
 * natural segment sum (`workload.durationMinMinutes`) and redistributes
 * freed minutes into focus-aligned work slots. Plans persisted with v1
 * keep replaying as v1 (`buildDraftFromCompletedBlocks` reads the
 * version off the plan record); only freshly-built drafts use v2.
 */
export const SESSION_ASSEMBLY_ALGORITHM_VERSION = 2

/**
 * Optional inputs that scope build-time drill substitution.
 *
 * Phase 2 of the 2026-04-26 red-team remediation promotes substitution
 * out of `findSwapAlternatives` and into `buildDraft`. The caller MUST
 * opt in by passing `lastCompletedByType.main_skill`; without it
 * `buildDraft` keeps the legacy default selection path so existing
 * call sites (Repeat-this-session, Repeat-what-you-did, tests) stay
 * untouched.
 *
 * Substitution fires only on the `main_skill` slot, only when ALL of:
 *   1. `lastCompletedByType.main_skill` resolves to a drill id,
 *   2. a `SUBSTITUTION_RULE` exists for that drill id, AND
 *   3. that rule's `blockedBy` constraint is active in today's
 *      context, AND
 *   4. one of the rule's `substituteDrillIds` is in the slot's
 *      candidate pool.
 *
 * Otherwise the slot falls through to the default selection. See the
 * 2026-04-26 red-team remediation plan for why this surface is
 * intentionally narrow.
 *
 * Per-slot history is passed as a map so adding a new substitution
 * path (D60 ranked-fill, additional slot rules) doesn't require an
 * API shape change. The shape mirrors `findLastCompletedDrillIdsByType`
 * in `services/session/queries.ts` so the call site can pass the
 * query result through without reshaping.
 */
export interface BuildDraftOptions {
  readonly lastCompletedByType?: Partial<Record<BlockSlotType, string>>
  readonly assemblySeed?: string
  /**
   * The user's onboarding skill level, read by the caller from
   * `storageMeta.onboarding.skillLevel`. The build path projects
   * this through `effectiveLevel(onboarding)` to a `PlayerLevel`
   * band the catalog records via `levelMin` / `levelMax`. When
   * omitted, the effective level falls through to `'beginner'`
   * (the existing pre-engine-wiring behavior).
   *
   * Aggregated `levelRelaxed: boolean` is attached to the returned
   * draft per K6 of the
   * `2026-05-04-001-feat-skill-level-mutability-plan.md` so the Tune
   * today controller can render the relaxation eyebrow.
   */
  readonly onboarding?: unknown
}

function stripSessionFocus(context: SetupContext): SetupContext {
  const next: SetupContext = { ...context }
  delete next.sessionFocus
  return next
}

export function buildDraft(
  context: SetupContext,
  options?: BuildDraftOptions,
): SessionDraft | null {
  const archetype = selectArchetype(context)
  if (!archetype) return null
  const assemblySeed = options?.assemblySeed ?? createAssemblySeed()
  const random = createSeededRandom(assemblySeed)

  const layout = archetype.layouts[context.timeProfile]
  if (!layout || layout.length === 0) return null
  const durations = allocateDurations(layout, context.timeProfile)
  if (!durations) return null

  const usedDrillIds = new Set<string>()

  // Decide build-time substitution UP FRONT and reserve the
  // substitute drillId so earlier slots in the layout (e.g.,
  // `technique`, `movement_proxy`) can't shuffle-claim it before the
  // main_skill slot is reached. Without the reservation the
  // technique slot's seeded shuffle determines whether the substitute
  // survives, so reservation keeps main_skill identity stable for a
  // given seed.
  // Compute effective level once per build, but only when the caller
  // has opted into the engine wiring by passing `onboarding`. When
  // omitted (legacy callers, golden-seed pin tests, recovery
  // rebuild), the pickers fall through to single-pass pre-engine-
  // wiring behavior — preserves deterministic seed regressions and
  // existing test fixtures untouched.
  const effectiveLevelValue: PlayerLevel | undefined =
    options?.onboarding === undefined ? undefined : effectiveLevel(options.onboarding)

  // Aggregate per-slot relaxation flags into one build-level boolean
  // attached to the returned draft per K6 of the
  // 2026-05-04-001-feat-skill-level-mutability-plan.md. Used by Tune
  // today to render the relaxation eyebrow above Continue.
  let levelRelaxed = false

  let mainSkillSubstitute: { candidate: CandidateVariant; rationale: string } | undefined
  const lastMainSkillDrillId = options?.lastCompletedByType?.main_skill
  if (lastMainSkillDrillId) {
    const mainSkillSlot = layout.find((s) => s.type === 'main_skill')
    if (mainSkillSlot) {
      const subResult = pickMainSkillSubstitute(
        mainSkillSlot,
        context,
        usedDrillIds,
        lastMainSkillDrillId,
        effectiveLevelValue,
      )
      if (subResult) {
        mainSkillSubstitute = {
          candidate: subResult.candidate,
          rationale: subResult.rationale,
        }
        if (subResult.levelRelaxed) levelRelaxed = true
        usedDrillIds.add(mainSkillSubstitute.candidate.drill.id)
      }
    }
  }

  // Two-phase block construction: phase 1 resolves all picks so the
  // warmup/wrap segment snap (phase 1.5) can see the full set, then
  // phase 2 writes blocks using the snapped durations. Required-slot
  // failure short-circuits during phase 1 so callers get the same
  // null shape they did pre-snap.
  const picks: (CandidateVariant | undefined)[] = new Array(layout.length).fill(undefined)
  const rationales: (string | undefined)[] = new Array(layout.length).fill(undefined)

  for (let i = 0; i < layout.length; i++) {
    const slot = layout[i]

    let pick: CandidateVariant | undefined
    let substitutionRationale: string | undefined

    if (slot.type === 'main_skill' && mainSkillSubstitute) {
      pick = mainSkillSubstitute.candidate
      substitutionRationale = mainSkillSubstitute.rationale
    }

    if (!pick) {
      const slotResult = pickForSlot(slot, context, usedDrillIds, random, effectiveLevelValue)
      pick = slotResult.pick
      if (slotResult.levelRelaxed) levelRelaxed = true
    }

    if (!pick) {
      if (slot.required) return null
      continue
    }

    usedDrillIds.add(pick.drill.id)
    picks[i] = pick
    rationales[i] = substitutionRationale
  }

  // Phase 1.5: warmup/wrap segment snap + focus-aware redistribution.
  // See `snapWarmupWrapDurations` for the rule. No-op for builds where
  // every warmup/wrap variant's natural sum already equals the
  // allocated slot duration (Solo + Wall 15-min with d28 + d25, etc.).
  const snappedDurations = snapWarmupWrapDurations(
    layout,
    durations,
    picks,
    context.sessionFocus,
  )

  const blocks: DraftBlock[] = []
  let blockIndex = 0

  for (let i = 0; i < layout.length; i++) {
    const slot = layout[i]
    const pick = picks[i]
    if (!pick) continue

    blocks.push({
      id: `block-${blockIndex++}`,
      type: slot.type,
      drillId: pick.drill.id,
      variantId: pick.variant.id,
      drillName: pick.drill.name,
      shortName: pick.drill.shortName,
      durationMinutes: snappedDurations[i],
      coachingCue:
        pick.variant.coachingCues.length > 0
          ? pick.variant.coachingCues.join(' · ')
          : pick.drill.name,
      courtsideInstructions: pick.variant.courtsideInstructions,
      courtsideInstructionsBonus: pick.variant.courtsideInstructionsBonus,
      required: slot.required,
      rationale: rationales[i] ?? deriveBlockRationale(slot.type, pick.drill, context),
      subBlockIntervalSeconds: pick.variant.subBlockIntervalSeconds,
      segments: pick.variant.segments,
    })
  }

  if (blocks.length === 0) return null

  return {
    id: 'current',
    context,
    archetypeId: archetype.id,
    archetypeName: archetype.name,
    assemblySeed,
    assemblyAlgorithmVersion: SESSION_ASSEMBLY_ALGORITHM_VERSION,
    blocks,
    updatedAt: Date.now(),
    levelRelaxed,
  }
}

/**
 * C-5 Unit 3: Rebuild a `SessionDraft` from the subset of plan blocks
 * the tester actually completed (per `ExecutionLog.blockStatuses`).
 * Powers the "Repeat what you did" secondary CTA on the ended-early
 * LastComplete card.
 *
 * Contract:
 * - Preserves the original plan's block order.
 * - Carries forward the plan's `context` onto the new draft (R6),
 *   including `sessionFocus` per the 2026-04-30 focus policy: a
 *   repeat means same conditions, focus included. If the plan has no
 *   persisted context (legacy v3 records), returns `null` so the
 *   caller can fall back to "Repeat full plan" / pre-filled Setup.
 * - Returns `null` when zero blocks are completed - the ended-early
 *   typical case has at least a warmup, but this is defensive; the
 *   caller should hide the secondary button in that case.
 * - Does NOT carry `SessionPlan.safetyCheck` values onto the draft -
 *   the draft doesn't encode safety (that happens on Safety screen
 *   mount), and D83 makes that a per-session decision anyway.
 * - `drillId` / `variantId` are preserved when the plan carries them;
 *   legacy plans fall back to empty strings so the draft shape remains
 *   valid without guessing catalog identity from display names.
 *
 * Note: pain-recovery rebuild (`buildRecoveryDraft` below) DOES strip
 * focus — recovery overrides today's focus. Don't reuse this function
 * for that path.
 */
export function buildDraftFromCompletedBlocks(
  log: ExecutionLog,
  plan: SessionPlan,
): SessionDraft | null {
  if (!plan.context) return null
  if (plan.blocks.length === 0) return null

  const statusByIndex = new Map<number, ExecutionLog['blockStatuses'][number]>()
  log.blockStatuses.forEach((entry, idx) => {
    statusByIndex.set(idx, entry)
  })

  const completedBlocks: DraftBlock[] = []
  plan.blocks.forEach((planBlock, idx) => {
    const status = statusByIndex.get(idx)
    if (status?.status !== 'completed') return
    completedBlocks.push({
      id: planBlock.id,
      type: planBlock.type,
      // Legacy plans may not carry drill identity; keep those identity-
      // empty while preserving stable IDs on plans created after the
      // drill-intent substitution work.
      drillId: planBlock.drillId ?? '',
      variantId: planBlock.variantId ?? '',
      drillName: planBlock.drillName,
      shortName: planBlock.shortName,
      durationMinutes: planBlock.durationMinutes,
      coachingCue: planBlock.coachingCue,
      courtsideInstructions: planBlock.courtsideInstructions,
      courtsideInstructionsBonus: planBlock.courtsideInstructionsBonus,
      required: planBlock.required,
      // Preserve the original rationale as data for future Swap / See-Why
      // surfaces; the current run-flow no longer renders it inline.
      rationale: planBlock.rationale,
      subBlockIntervalSeconds: planBlock.subBlockIntervalSeconds,
      segments: planBlock.segments,
    })
  })
  if (completedBlocks.length === 0) return null

  // Pick a reasonable archetype label for the rebuilt draft. Plan
  // stores `presetId` as the archetype id (see `createSessionFromDraft`),
  // so we carry that through verbatim.
  //
  // levelRelaxed: false on this path. We don't re-run the level-relax
  // detection here (the function carries forward completed plan blocks
  // as-is rather than re-picking against today's catalog). If the
  // user's level changed between the original session and the repeat,
  // the next regeneration via Tune today's focus picker will surface
  // any current-day relaxation.
  return {
    id: 'current',
    context: plan.context,
    archetypeId: plan.presetId as SessionDraft['archetypeId'],
    archetypeName: plan.presetName,
    assemblySeed: plan.assemblySeed ?? createAssemblySeed(),
    assemblyAlgorithmVersion: plan.assemblyAlgorithmVersion ?? SESSION_ASSEMBLY_ALGORITHM_VERSION,
    blocks: completedBlocks,
    updatedAt: Date.now(),
    levelRelaxed: false,
  }
}

/**
 * Slot types included when the user continues with a lighter (pain-flag)
 * session: sand prep, low-load technique and movement work, and cooldown.
 * Deliberately omits `main_skill` and `pressure` (higher-load blocks).
 */
const RECOVERY_BLOCK_SLOT_TYPES: readonly BlockSlotType[] = [
  'warmup',
  'technique',
  'movement_proxy',
  'wrap',
]

/**
 * Total minutes for the lighter-session path (matches `buildRecoveryDraft`
 * block list). Used by Safety UI before a plan exists.
 *
 * 2026-04-21: Recovery now respects the user's chosen `timeProfile`
 * instead of the sum-of-mins of the kept slots. The pre-2026-04-21
 * behaviour returned ~10 for a 15-min request and ~16 for 25, which
 * silently cut the session short - testers read the result as
 * "extended warmup then straight into cooldown" because the Work
 * block was only 4 min flanked by 3-and-3. The lighter path lightens
 * LOAD (drops `main_skill` + `pressure`), not DURATION; the reclaimed
 * minutes fold into the Work block inside `buildRecoveryDraft` so the
 * middle drill is clearly the session.
 */
export function estimateRecoverySessionMinutes(context: SetupContext): number | null {
  const archetype = selectArchetype(context)
  if (!archetype) return null

  const layout = archetype.layouts[context.timeProfile]
  if (!layout) return null

  const recoveryLayout = layout.filter((s) => RECOVERY_BLOCK_SLOT_TYPES.includes(s.type))
  if (recoveryLayout.length === 0) return null

  return context.timeProfile
}

/**
 * Build a recovery-oriented draft for when SafetyCheck flags pain.
 * Uses the same archetype but drops main work and pressure — keeps
 * warmup, technique, movement proxy (when the template has one), and wrap.
 */
export function buildRecoveryDraft(context: SetupContext): SessionDraft | null {
  const recoveryContext = stripSessionFocus(context)
  const archetype = selectArchetype(recoveryContext)
  if (!archetype) return null
  const assemblySeed = createAssemblySeed()
  const random = createSeededRandom(assemblySeed)

  const layout = archetype.layouts[recoveryContext.timeProfile]
  if (!layout) return null

  const recoveryLayout = layout.filter((s) => RECOVERY_BLOCK_SLOT_TYPES.includes(s.type))
  if (recoveryLayout.length === 0) return null
  // Target the user's chosen timeProfile, not the filtered layout's
  // minimum total. The minutes that `main_skill` + `pressure` would
  // have claimed in a full session fold into the Work block via
  // `allocateRecoveryDurations` - see that function's JSDoc for why
  // the Work block can legally exceed its full-session max here.
  const durations = allocateRecoveryDurations(recoveryLayout, recoveryContext.timeProfile)
  if (!durations) return null

  const usedDrillIds = new Set<string>()

  // Two-phase build matching `buildDraft`. Recovery redistribution
  // targets technique/movement_proxy only — `main_skill` and
  // `pressure` are not in `RECOVERY_BLOCK_SLOT_TYPES` so they're
  // already absent from `recoveryLayout`. Recovery strips
  // `sessionFocus` (see `stripSessionFocus` above), so we pass an
  // explicit recovery priority instead of letting focus drive.
  // Recovery is load-down regardless of skill level. Skip the
  // level-aware path entirely (omit effectiveLevelValue) so recovery
  // continues to behave as it did pre-engine-wiring. The returned
  // draft sets levelRelaxed: false unconditionally (recovery does
  // not surface a relaxation eyebrow per K3 / brainstorm KD9).
  const picks: (CandidateVariant | undefined)[] = new Array(recoveryLayout.length).fill(undefined)
  for (let i = 0; i < recoveryLayout.length; i++) {
    const slot = recoveryLayout[i]
    const result = pickForSlot(slot, recoveryContext, usedDrillIds, random)
    if (!result.pick) continue
    usedDrillIds.add(result.pick.drill.id)
    picks[i] = result.pick
  }

  const snappedDurations = snapWarmupWrapDurations(
    recoveryLayout,
    durations,
    picks,
    undefined,
    { priority: RECOVERY_REDISTRIBUTION_PRIORITY, allowSlotMaxOverflow: true },
  )

  const blocks: DraftBlock[] = []
  let blockIndex = 0

  for (let i = 0; i < recoveryLayout.length; i++) {
    const slot = recoveryLayout[i]
    const pick = picks[i]
    if (!pick) continue

    blocks.push({
      id: `block-${blockIndex++}`,
      type: slot.type,
      drillId: pick.drill.id,
      variantId: pick.variant.id,
      drillName: pick.drill.name,
      shortName: pick.drill.shortName,
      durationMinutes: snappedDurations[i],
      coachingCue:
        pick.variant.coachingCues.length > 0
          ? pick.variant.coachingCues.join(' · ')
          : pick.drill.name,
      courtsideInstructions: pick.variant.courtsideInstructions,
      courtsideInstructionsBonus: pick.variant.courtsideInstructionsBonus,
      required: slot.required,
      rationale: deriveBlockRationale(slot.type, pick.drill, recoveryContext),
      subBlockIntervalSeconds: pick.variant.subBlockIntervalSeconds,
      segments: pick.variant.segments,
    })
  }

  if (blocks.length === 0) return null

  return {
    id: 'current',
    context: recoveryContext,
    archetypeId: archetype.id,
    archetypeName: archetype.name,
    assemblySeed,
    assemblyAlgorithmVersion: SESSION_ASSEMBLY_ALGORITHM_VERSION,
    blocks,
    updatedAt: Date.now(),
    levelRelaxed: false,
  }
}

// Swap alternate derivation lives in `sessionAssembly/swapAlternatives.ts`;
// this module re-exports it above to keep the historical `sessionBuilder`
// import path stable during the Batch 3 split.

