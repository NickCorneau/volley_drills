import { selectArchetype } from '../data/archetypes'
import { stressRungForDrill, type StressLadderFocus } from '../data/stressLadders'
import type {
  BlockSlot,
  BlockSlotType,
  DraftBlock,
  PlayerLevel,
  SessionDraft,
  SetupContext,
} from '../model'
import type { SessionCalibration } from './calibration/sessionCalibration'
import {
  candidateCanCarryTargetDuration,
  pickForSlot,
  pickForSlotWithPath,
  type CandidateVariant,
} from './sessionAssembly/candidates'
import {
  allocateDurations,
  allocateRecoveryDurations,
  calibratedBudgetMinutes,
} from './sessionAssembly/durations'
import { createAssemblySeed, createSeededRandom } from './sessionAssembly/random'
import { deriveBlockRationale } from './sessionAssembly/rationale'
import {
  RECOVERY_REDISTRIBUTION_PRIORITY,
  snapWarmupWrapDurations,
} from './sessionAssembly/snapDurations'
import { shouldRerouteForSourceBackedSibling } from './sessionAssembly/sourceBackedReroutes'
import { pickMainSkillSubstitute } from './sessionAssembly/substitution'
export {
  findStrictSameFocusSwapAlternatives,
  findSwapAlternatives,
  type FindSwapAlternativesOptions,
} from './sessionAssembly/swapAlternatives'
export { deriveBlockRationale } from './sessionAssembly/rationale'

// v9: stress-substrate (D154) — `stressPositions` option steers
// main_skill selection toward the focus's current ladder rung.
// Positionless builds are output-identical to v8; the bump marks the
// semantics change, not churn.
// v10: clock calibration (2026-06-11 session-truth, KTD6) — the
// `calibration` option scales the time-profile budget before
// allocation (effective budget = profile ÷ overhead ratio) so the
// session's expected WALL time lands near the chosen profile.
// Calibration-less builds are output-identical to v9.
// v11: rung-aware substitution (2026-06-12, D159/U6) — the build-time
// main-skill substitution path orders the firing rule's authored
// substitutes by stress-ladder distance to the steered rung (stable
// sort, authored order breaks ties), and a substituted pick that
// realizes the steer target is now `steeredFocus`-stamp-eligible like
// any other pick (the v10 substitution stamp guard is deleted).
// Position-less and single-substitute builds are output-identical to
// v10.
export const SESSION_ASSEMBLY_ALGORITHM_VERSION = 11

/**
 * Optional inputs that scope build-time drill substitution.
 *
 * Phase 2 of the 2026-04-26 red-team remediation promotes substitution
 * out of `findSwapAlternatives` and into `buildDraft`. The caller MUST
 * opt in by passing `lastCompletedByType.main_skill`; without it
 * `buildDraft` keeps the legacy default selection path. (The original
 * non-opting call sites were the Repeat paths, retired by `D158`;
 * today the legacy path serves callers and tests that omit the
 * option.)
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
  /**
   * Stress-substrate (D154): derived per-focus ladder positions
   * (`deriveStressPositions`). Steers the main_skill pick toward the
   * session focus's current rung; absent → legacy selection. U6
   * (D159) closed the v1 substitution bypass: when the
   * `lastCompletedByType` rule fires, `pickMainSkillSubstitute` now
   * receives these positions and picks the rung-nearest authored
   * substitute (authored-order tie-break), and the realized pick is
   * `steeredFocus`-stamp-eligible exactly like a `pickForSlot` pick.
   */
  readonly stressPositions?: Partial<Record<StressLadderFocus, number>>
  /**
   * Clock calibration (U5/KTD6): session-grain overhead ratio derived
   * from clean completes (`deriveSessionCalibration`). Scales the
   * time-profile budget before allocation so expected wall time tracks
   * the chosen profile; absent or inert → budget unchanged. (The
   * Repeat paths, which deliberately omitted it — repeat means repeat —
   * were retired by `D158`; all live steered callers pass it.)
   */
  readonly calibration?: SessionCalibration
}

/**
 * Which policy decided a selected main-skill slot (U6/D159, R6):
 * `rung_nearest` — stress-ordered pool head honored; `duration_fit` —
 * the duration carve-out overrode the pool head; `reroute` — the
 * source-backed base-allocation reroute re-picked; `substitution` —
 * the blocked-progression substitute decided the slot. Absent on
 * non-main-skill slots and on unsteered default picks. Diagnostics
 * key steering checks on this marker instead of re-implementing
 * `pickForSlot` policy.
 */
export type MainSkillSelectionPath = 'rung_nearest' | 'duration_fit' | 'reroute' | 'substitution'

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
  readonly selectionPath?: MainSkillSelectionPath
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
  selected:
    | { readonly pick: CandidateVariant; readonly selectionPath?: MainSkillSelectionPath }
    | undefined,
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
    ...(selected.selectionPath !== undefined ? { selectionPath: selected.selectionPath } : {}),
  }
}

function stripSessionFocus(context: SetupContext): SetupContext {
  const next: SetupContext = { ...context }
  delete next.sessionFocus
  // D159: provenance never outlives the focus it describes — a
  // focus-less recovery rebuild must not claim resolved provenance.
  delete next.focusSource
  return next
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
  // KTD6: calibration moves the session-level promise itself — the
  // drill-minute budget shrinks so expected wall time lands near the
  // profile. The draft keeps the user's chosen `timeProfile` label;
  // assembled drill minutes may legitimately read below it.
  const budget = calibratedBudgetMinutes(
    layout,
    effectiveContext.timeProfile,
    options?.calibration?.overheadRatio,
  )
  const durations = allocateDurations(layout, budget)
  if (!durations) return null

  const usedDrillIds = new Set<string>()
  interface SelectedSlot {
    readonly pick: CandidateVariant
    readonly substitutionRationale?: string
    readonly selectionPath?: MainSkillSelectionPath
  }
  const selectedByLayoutIndex = new Map<number, SelectedSlot>()

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
        // U6 (D159): the substitution choice is rung-aware — the same
        // positions that order pickForSlot's pool order the rule's
        // authored substitutes.
        { playerLevel: options?.playerLevel, stressPositions: options?.stressPositions },
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
  ): SelectedSlot | undefined {
    if (slot.type === 'main_skill' && mainSkillSubstitute) {
      return {
        pick: mainSkillSubstitute.candidate,
        substitutionRationale: mainSkillSubstitute.rationale,
        selectionPath: 'substitution',
      }
    }

    const result = pickForSlotWithPath(slot, effectiveContext, usedDrillIds, random, {
      playerLevel: options?.playerLevel,
      allowUsedFallback,
      targetDurationMinutes,
      stressPositions: options?.stressPositions,
    })
    if (!result) return undefined
    // The marker is a main-skill steering audit substrate (R6); the
    // per-type preference scans elsewhere all read `default` and stay
    // unmarked.
    if (slot.type === 'main_skill' && result.path !== 'default') {
      return { pick: result.pick, selectionPath: result.path }
    }
    return { pick: result.pick }
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

    let selected = selectSlot(slot, false, durations[i])
    if (!selected) {
      // R5 (2026-05-24 duration-honesty plan, U2): on a dropping-eligible
      // optional slot, retry candidate selection using the slot's
      // authored `skillTags` fallback before letting the slot drop.
      // Under named focus, `effectiveSkillTags` suppresses the authored
      // fallback so the focused-pick stays narrow; this retry path
      // narrowly bypasses that suppression to lift sessions like
      // `serve + pair_net + 40 + beginner` from ~23-29 min / 4 blocks
      // to ~37 min / 6 blocks without authoring new content. Required
      // slots (loop above) keep no fallback per R6.
      const fallbackPick = pickForSlot(slot, effectiveContext, usedDrillIds, random, {
        playerLevel: options?.playerLevel,
        allowUsedFallback: false,
        targetDurationMinutes: durations[i],
        overrideSkillTags: slot.skillTags,
        stressPositions: options?.stressPositions,
      })
      if (fallbackPick) selected = { pick: fallbackPick }
    }
    if (!selected) continue
    selectedByLayoutIndex.set(i, selected)
    usedDrillIds.add(selected.pick.drill.id)
  }

  // Source-backed reroute on base allocation (per PD-1 (A) of the
  // 2026-05-24 session-duration-honesty plan): for each main_skill
  // slot, if the picked variant cannot honestly carry the base
  // allocation, consult the source-backed reroute registry and re-pick
  // with `preferTargetDurationFit: true`. The legacy redistribution-
  // driven trigger (`plannedDuration = base + redistributedMinutes`)
  // was retired together with the redistribution path itself; the new
  // trigger fires when the base allocation alone exceeds the picked
  // variant's envelope, preserving R11/R12 intent under honest
  // durations.
  for (const index of selectedByLayoutIndex.keys()) {
    const slot = layout[index]
    if (slot.type !== 'main_skill') continue
    const selected = selectedByLayoutIndex.get(index)
    if (!selected) continue
    if (candidateCanCarryTargetDuration(selected.pick, durations[index])) continue
    if (
      !shouldRerouteForSourceBackedSibling(slot, effectiveContext, selected.pick, durations[index])
    ) {
      continue
    }
    const rerouted = pickForSlot(slot, effectiveContext, usedDrillIds, random, {
      playerLevel: options?.playerLevel,
      allowUsedFallback: false,
      targetDurationMinutes: durations[index],
      preferTargetDurationFit: true,
      stressPositions: options?.stressPositions,
    })
    if (rerouted) {
      selectedByLayoutIndex.set(index, { pick: rerouted, selectionPath: 'reroute' })
    }
  }

  // Snap warmup/wrap blocks down to the chosen variant's natural
  // segment sum (per `docs/plans/2026-05-04-002-feat-warmup-wrap-segment-snap-plan.md`
  // and the 2026-05-13 wiring fix). Freed minutes redistribute into
  // focus-priority work slots within their authored caps; uplift never
  // re-inflates the snapped warmup/wrap. Runs AFTER the base-allocation
  // source-backed reroute so the reroute decision sees the planned
  // (pre-snap) durations, then snap composes on the final selection.
  //
  // The R1 (2026-05-24) duration-honesty fix retired the legacy
  // `redistributedMinutes`-onto-main_skill uplift: dropped optional-slot
  // minutes are no longer redistributed onto main_skill. Block durations
  // come straight from `snapWarmupWrapDurations` and never exceed the
  // authored slot/variant caps.
  const blocks: DraftBlock[] = []
  const blockIdByLayoutIndex = new Map<number, string>()
  let blockIndex = 0
  const picks: (CandidateVariant | undefined)[] = layout.map(
    (_slot, index) => selectedByLayoutIndex.get(index)?.pick,
  )
  const snappedDurations = snapWarmupWrapDurations(
    layout,
    durations,
    picks,
    effectiveContext.sessionFocus,
  )

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
      durationMinutes: snappedDurations[i],
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

  // Stress-visibility provenance (trust-loop KTD1): one build-time
  // "steered" definition on REALIZED outcomes. Stamp only when the
  // session focus is scoped, a derived position resolved for it, and
  // every realized main_skill pick's authored rung equals the steer
  // target — regardless of which selection path produced the pick.
  // U6 (D159) deleted the v10 substitution guard: the substitution
  // path is itself rung-aware now, so a substitute that lands on the
  // target IS the steering working and the trace may say so. Rung
  // preference remains a preference — nearest-rung fallback, the
  // duration-fit carve-out, the reroute, and an off-rung substitute
  // can all land off-target, and an off-target pick fails quiet, so
  // no trace ever claims stress the session does not contain
  // (R7/R11/R12).
  let steeredFocus: SessionDraft['steeredFocus']
  const steerFocus = effectiveContext.sessionFocus
  const steerTarget = steerFocus === undefined ? undefined : options?.stressPositions?.[steerFocus]
  if (steerFocus !== undefined && steerTarget !== undefined) {
    const mainSkillPicks = layout
      .map((slot, index) => ({ slot, index }))
      .filter(({ slot }) => slot.type === 'main_skill')
      .map(({ index }) => selectedByLayoutIndex.get(index))
      .filter((selected) => selected !== undefined)
    const realizedOnTarget =
      mainSkillPicks.length > 0 &&
      mainSkillPicks.every(
        (selected) => stressRungForDrill(steerFocus, selected.pick.drill.id) === steerTarget,
      )
    if (realizedOnTarget) steeredFocus = steerFocus
  }

  const draft: SessionDraft = {
    id: 'current',
    context: effectiveContext,
    archetypeId: archetype.id,
    archetypeName: archetype.name,
    assemblySeed,
    assemblyAlgorithmVersion: SESSION_ASSEMBLY_ALGORITHM_VERSION,
    ...(steeredFocus !== undefined ? { steeredFocus } : {}),
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
      // R1 (2026-05-24): redistribution path retired. The trace fields
      // are preserved at their post-removal values (0 / undefined) so
      // `generatedPlanDiagnostics` keeps its existing read paths until
      // U4 replaces `optional_slot_redistribution` with the new
      // `slot_dropped` + `under_named_profile_duration` findings.
      redistributedMinutes: 0,
      redistributionLayoutIndex: undefined,
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

// D158 (2026-06-12): `buildDraftFromCompletedBlocks` (C-5 Unit 3, the
// ended-early "Repeat shorter version" rebuild) was retired with the
// Home Repeat affordances after seven unused weeks of founder-use mode.

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
  const picks: (CandidateVariant | undefined)[] = []

  for (let i = 0; i < recoveryLayout.length; i++) {
    const slot = recoveryLayout[i]
    const pick = pickForSlot(slot, recoveryContext, usedDrillIds, random)
    picks.push(pick ?? undefined)
    if (pick) {
      usedDrillIds.add(pick.drill.id)
    }
  }

  // Apply the same warmup/wrap segment snap as `buildDraft`, scoped to
  // technique/movement_proxy redistribution (recovery layout excludes
  // main_skill and pressure). `allowSlotMaxOverflow` mirrors how
  // `allocateRecoveryDurations` already overshoots slot maxes by design
  // — recovery folds reclaimed main/pressure minutes into technique
  // even past its archetype cap (see `allocateRecoveryDurations` JSDoc).
  // Without overflow, freed warmup/wrap minutes would silently vanish
  // when the recovery target slot is already above its max.
  const snappedDurations = snapWarmupWrapDurations(recoveryLayout, durations, picks, undefined, {
    priority: RECOVERY_REDISTRIBUTION_PRIORITY,
    allowSlotMaxOverflow: true,
  })

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
  }
}

// Swap alternate derivation lives in `sessionAssembly/swapAlternatives.ts`;
// this module re-exports it above to keep the historical `sessionBuilder`
// import path stable during the Batch 3 split.
