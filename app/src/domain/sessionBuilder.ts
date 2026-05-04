import { selectArchetype } from '../data/archetypes'
import type {
  BlockSlot,
  BlockSlotType,
  DraftBlock,
  ExecutionLog,
  PlayerLevel,
  SessionDraft,
  SessionPlan,
  SetupContext,
} from '../model'
import {
  candidateCanCarryTargetDuration,
  pickForSlot,
  type CandidateVariant,
} from './sessionAssembly/candidates'
import { allocateDurations, allocateRecoveryDurations } from './sessionAssembly/durations'
import { createAssemblySeed, createSeededRandom } from './sessionAssembly/random'
import { deriveBlockRationale } from './sessionAssembly/rationale'
import { pickMainSkillSubstitute } from './sessionAssembly/substitution'
export {
  findStrictSameFocusSwapAlternatives,
  findSwapAlternatives,
  type FindSwapAlternativesOptions,
} from './sessionAssembly/swapAlternatives'
export { deriveBlockRationale } from './sessionAssembly/rationale'

export const SESSION_ASSEMBLY_ALGORITHM_VERSION = 6

const ADVANCED_SETTING_DURATION_FIT_DRILL_IDS = new Set(['d47', 'd48'])
const ADVANCED_PASSING_DURATION_FIT_DRILL_IDS = new Set(['d46'])
const BEGINNER_SERVING_DURATION_FIT_DRILL_IDS = new Set(['d31'])

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
  readonly playerLevel?: PlayerLevel
}

interface DraftAssemblyTraceSlotBase {
  readonly layoutIndex: number
  readonly type: BlockSlotType
  readonly required: boolean
  readonly allocatedMinutes: number
}

interface SelectedDraftAssemblyTraceSlot extends DraftAssemblyTraceSlotBase {
  readonly selected: true
  readonly blockId: string
  readonly drillId: string
  readonly variantId: string
}

interface UnselectedDraftAssemblyTraceSlot extends DraftAssemblyTraceSlotBase {
  readonly selected: false
  readonly blockId?: never
  readonly drillId?: never
  readonly variantId?: never
}

export type DraftAssemblyTraceSlot =
  | SelectedDraftAssemblyTraceSlot
  | UnselectedDraftAssemblyTraceSlot

export interface DraftAssemblyTrace {
  readonly slots: readonly DraftAssemblyTraceSlot[]
  readonly skippedOptionalLayoutIndexes: readonly number[]
  readonly redistributedMinutes: number
  readonly redistributionLayoutIndex?: number
}

export interface BuildDraftWithAssemblyTraceResult {
  readonly draft: SessionDraft
  readonly assemblyTrace: DraftAssemblyTrace
}

function buildTraceSlot(
  slot: BlockSlot,
  layoutIndex: number,
  allocatedMinutes: number,
  selected: { readonly pick: CandidateVariant } | undefined,
  blockId: string | undefined,
): DraftAssemblyTraceSlot {
  if (!selected) {
    return {
      layoutIndex,
      type: slot.type,
      required: slot.required,
      allocatedMinutes,
      selected: false,
    }
  }
  if (!blockId) {
    throw new Error('Selected draft trace slot is missing block identity.')
  }

  return {
    layoutIndex,
    type: slot.type,
    required: slot.required,
    allocatedMinutes,
    selected: true,
    blockId,
    drillId: selected.pick.drill.id,
    variantId: selected.pick.variant.id,
  }
}

function stripSessionFocus(context: SetupContext): SetupContext {
  const next: SetupContext = { ...context }
  delete next.sessionFocus
  return next
}

function shouldPreferAdvancedSettingDurationFit(
  slot: BlockSlot,
  context: SetupContext,
  selected: CandidateVariant,
  plannedDurationMinutes: number,
): boolean {
  return (
    slot.type === 'main_skill' &&
    context.sessionFocus === 'set' &&
    context.playerLevel === 'advanced' &&
    ADVANCED_SETTING_DURATION_FIT_DRILL_IDS.has(selected.drill.id) &&
    !candidateCanCarryTargetDuration(selected, plannedDurationMinutes)
  )
}

// Advanced pair-open / solo-open passing main-skill blocks above D46's 8-minute
// envelope used to silently over-stretch D46 (FIVB 3.16 spin-read receive).
// D50 (FIVB 3.13 Short/Deep, 8-14 min envelope) is the source-backed long
// envelope sibling; this predicate triggers the reroute when D46 was selected
// for an advanced passing block it cannot carry. Mirrors
// `shouldPreferAdvancedSettingDurationFit` for D47/D48 -> D49.
function shouldPreferAdvancedPassingDurationFit(
  slot: BlockSlot,
  context: SetupContext,
  selected: CandidateVariant,
  plannedDurationMinutes: number,
): boolean {
  return (
    slot.type === 'main_skill' &&
    context.sessionFocus === 'pass' &&
    context.playerLevel === 'advanced' &&
    ADVANCED_PASSING_DURATION_FIT_DRILL_IDS.has(selected.drill.id) &&
    !candidateCanCarryTargetDuration(selected, plannedDurationMinutes)
  )
}

// Beginner serving main-skill blocks above D31's 8-minute envelope used to
// silently over-stretch D31 (BAB Self-Toss Target Practice). D51 (FIVB 2.2
// Outside the Heart, 8-14 min envelope) is the source-backed long envelope
// sibling; this predicate triggers the reroute when D31 was selected for a
// beginner serving block it cannot carry. Third application of the
// source-backed content-depth activation pattern (after D49 and D50); first
// application at the beginner level.
function shouldPreferBeginnerServingDurationFit(
  slot: BlockSlot,
  context: SetupContext,
  selected: CandidateVariant,
  plannedDurationMinutes: number,
): boolean {
  return (
    slot.type === 'main_skill' &&
    context.sessionFocus === 'serve' &&
    context.playerLevel === 'beginner' &&
    BEGINNER_SERVING_DURATION_FIT_DRILL_IDS.has(selected.drill.id) &&
    !candidateCanCarryTargetDuration(selected, plannedDurationMinutes)
  )
}

function buildDraftResult(
  context: SetupContext,
  options?: BuildDraftOptions,
): BuildDraftWithAssemblyTraceResult | null {
  const effectiveContext: SetupContext =
    options?.playerLevel === undefined ? context : { ...context, playerLevel: options.playerLevel }
  const archetype = selectArchetype(effectiveContext)
  if (!archetype) return null
  const assemblySeed = options?.assemblySeed ?? createAssemblySeed()
  const random = createSeededRandom(assemblySeed)

  const layout = archetype.layouts[effectiveContext.timeProfile]
  if (!layout || layout.length === 0) return null
  const durations = allocateDurations(layout, effectiveContext.timeProfile)
  if (!durations) return null

  const usedDrillIds = new Set<string>()
  const selectedByLayoutIndex = new Map<
    number,
    { readonly pick: CandidateVariant; readonly substitutionRationale?: string }
  >()

  // Decide build-time substitution UP FRONT and reserve the
  // substitute drillId so earlier slots in the layout (e.g.,
  // `technique`, `movement_proxy`) can't shuffle-claim it before the
  // main_skill slot is reached. Without the reservation the
  // technique slot's seeded shuffle determines whether the substitute
  // survives, so reservation keeps main_skill identity stable for a
  // given seed.
  let mainSkillSubstitute: { candidate: CandidateVariant; rationale: string } | undefined
  const lastMainSkillDrillId = options?.lastCompletedByType?.main_skill
  if (lastMainSkillDrillId) {
    const mainSkillSlot = layout.find((s) => s.type === 'main_skill')
    if (mainSkillSlot) {
      mainSkillSubstitute = pickMainSkillSubstitute(
        mainSkillSlot,
        effectiveContext,
        usedDrillIds,
        lastMainSkillDrillId,
        undefined,
        { playerLevel: options?.playerLevel },
      )
      if (mainSkillSubstitute) {
        usedDrillIds.add(mainSkillSubstitute.candidate.drill.id)
      }
    }
  }

  function selectSlot(
    slot: BlockSlot,
    allowUsedFallback: boolean,
    targetDurationMinutes: number,
  ): { readonly pick: CandidateVariant; readonly substitutionRationale?: string } | undefined {
    if (slot.type === 'main_skill' && mainSkillSubstitute) {
      return {
        pick: mainSkillSubstitute.candidate,
        substitutionRationale: mainSkillSubstitute.rationale,
      }
    }

    const pick = pickForSlot(slot, effectiveContext, usedDrillIds, random, {
      playerLevel: options?.playerLevel,
      allowUsedFallback,
      targetDurationMinutes,
    })
    return pick ? { pick } : undefined
  }

  for (let i = 0; i < layout.length; i++) {
    const slot = layout[i]
    if (!slot.required) continue

    const selected = selectSlot(slot, true, durations[i])
    if (!selected) return null
    selectedByLayoutIndex.set(i, selected)
    usedDrillIds.add(selected.pick.drill.id)
  }

  for (let i = 0; i < layout.length; i++) {
    const slot = layout[i]
    if (slot.required) continue

    const selected = selectSlot(slot, false, durations[i])
    if (!selected) continue
    selectedByLayoutIndex.set(i, selected)
    usedDrillIds.add(selected.pick.drill.id)
  }

  const blocks: DraftBlock[] = []
  const blockIdByLayoutIndex = new Map<number, string>()
  let blockIndex = 0
  const selectedDurationTotal = [...selectedByLayoutIndex.keys()].reduce(
    (sum, index) => sum + durations[index],
    0,
  )
  const redistributedMinutes = effectiveContext.timeProfile - selectedDurationTotal
  const redistributionIndex =
    redistributedMinutes > 0
      ? ([...selectedByLayoutIndex.keys()].find((index) => layout[index].type === 'main_skill') ??
        [...selectedByLayoutIndex.keys()].at(-1))
      : undefined

  if (redistributionIndex !== undefined) {
    const slot = layout[redistributionIndex]
    const selected = selectedByLayoutIndex.get(redistributionIndex)
    if (slot.type === 'main_skill' && selected) {
      const plannedDurationMinutes = durations[redistributionIndex] + redistributedMinutes
      const shouldRerouteD01 =
        selected.pick.drill.id === 'd01' &&
        !candidateCanCarryTargetDuration(selected.pick, plannedDurationMinutes)
      const shouldRerouteAdvancedSetting = shouldPreferAdvancedSettingDurationFit(
        slot,
        effectiveContext,
        selected.pick,
        plannedDurationMinutes,
      )
      const shouldRerouteAdvancedPassing = shouldPreferAdvancedPassingDurationFit(
        slot,
        effectiveContext,
        selected.pick,
        plannedDurationMinutes,
      )
      const shouldRerouteBeginnerServing = shouldPreferBeginnerServingDurationFit(
        slot,
        effectiveContext,
        selected.pick,
        plannedDurationMinutes,
      )
      if (
        shouldRerouteD01 ||
        shouldRerouteAdvancedSetting ||
        shouldRerouteAdvancedPassing ||
        shouldRerouteBeginnerServing
      ) {
        const rerouted = pickForSlot(slot, effectiveContext, usedDrillIds, random, {
          playerLevel: options?.playerLevel,
          allowUsedFallback: false,
          targetDurationMinutes: plannedDurationMinutes,
          preferTargetDurationFit: true,
        })
        if (rerouted) {
          selectedByLayoutIndex.set(redistributionIndex, { pick: rerouted })
        }
      }
    }
  }

  for (let i = 0; i < layout.length; i++) {
    const selected = selectedByLayoutIndex.get(i)
    if (!selected) continue

    const slot = layout[i]
    const { pick, substitutionRationale } = selected

    const blockId = `block-${blockIndex++}`
    blockIdByLayoutIndex.set(i, blockId)
    blocks.push({
      id: blockId,
      type: slot.type,
      drillId: pick.drill.id,
      variantId: pick.variant.id,
      drillName: pick.drill.name,
      shortName: pick.drill.shortName,
      durationMinutes: durations[i] + (i === redistributionIndex ? redistributedMinutes : 0),
      coachingCue:
        pick.variant.coachingCues.length > 0
          ? pick.variant.coachingCues.join(' · ')
          : pick.drill.name,
      courtsideInstructions: pick.variant.courtsideInstructions,
      courtsideInstructionsBonus: pick.variant.courtsideInstructionsBonus,
      required: slot.required,
      rationale:
        substitutionRationale ?? deriveBlockRationale(slot.type, pick.drill, effectiveContext),
      subBlockIntervalSeconds: pick.variant.subBlockIntervalSeconds,
      segments: pick.variant.segments,
    })
  }

  if (blocks.length === 0) return null

  const draft: SessionDraft = {
    id: 'current',
    context: effectiveContext,
    archetypeId: archetype.id,
    archetypeName: archetype.name,
    assemblySeed,
    assemblyAlgorithmVersion: SESSION_ASSEMBLY_ALGORITHM_VERSION,
    blocks,
    updatedAt: Date.now(),
  }

  return {
    draft,
    assemblyTrace: {
      slots: layout.map((slot, index) =>
        buildTraceSlot(
          slot,
          index,
          durations[index],
          selectedByLayoutIndex.get(index),
          blockIdByLayoutIndex.get(index),
        ),
      ),
      skippedOptionalLayoutIndexes: layout
        .map((slot, index) => ({ slot, index }))
        .filter(({ slot, index }) => !slot.required && !selectedByLayoutIndex.has(index))
        .map(({ index }) => index),
      redistributedMinutes,
      redistributionLayoutIndex: redistributionIndex,
    },
  }
}

export function buildDraftWithAssemblyTrace(
  context: SetupContext,
  options?: BuildDraftOptions,
): BuildDraftWithAssemblyTraceResult | null {
  return buildDraftResult(context, options)
}

export function buildDraft(
  context: SetupContext,
  options?: BuildDraftOptions,
): SessionDraft | null {
  return buildDraftResult(context, options)?.draft ?? null
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
  return {
    id: 'current',
    context: plan.context,
    archetypeId: plan.presetId as SessionDraft['archetypeId'],
    archetypeName: plan.presetName,
    assemblySeed: plan.assemblySeed ?? createAssemblySeed(),
    assemblyAlgorithmVersion: plan.assemblyAlgorithmVersion ?? SESSION_ASSEMBLY_ALGORITHM_VERSION,
    blocks: completedBlocks,
    updatedAt: Date.now(),
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
  const blocks: DraftBlock[] = []
  let blockIndex = 0

  for (let i = 0; i < recoveryLayout.length; i++) {
    const slot = recoveryLayout[i]
    const pick = pickForSlot(slot, recoveryContext, usedDrillIds, random)
    if (!pick) continue

    usedDrillIds.add(pick.drill.id)

    blocks.push({
      id: `block-${blockIndex++}`,
      type: slot.type,
      drillId: pick.drill.id,
      variantId: pick.variant.id,
      drillName: pick.drill.name,
      shortName: pick.drill.shortName,
      durationMinutes: durations[i],
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
  }
}

// Swap alternate derivation lives in `sessionAssembly/swapAlternatives.ts`;
// this module re-exports it above to keep the historical `sessionBuilder`
// import path stable during the Batch 3 split.
