import { DRILLS } from '../data/drills'
import { selectArchetype } from '../data/archetypes'
import { PROGRESSION_CHAINS } from '../data/progressions'
import {
  SUBSTITUTION_RULES,
  type BlockedConstraint,
  type SubstitutionRule,
} from '../data/substitutionRules'
import { findPreferredCandidate, findSubstitute } from './drillSelection'
import type { Drill, DrillVariant } from '../types/drill'
import type { BlockSlot, BlockSlotType } from '../types/session'
import type {
  DraftBlock,
  ExecutionLog,
  SessionDraft,
  SessionPlan,
  SessionPlanBlock,
  SetupContext,
} from '../db/types'

const allDrills: readonly Drill[] = DRILLS

interface CandidateVariant {
  drill: Drill
  variant: DrillVariant
}

export const SESSION_ASSEMBLY_ALGORITHM_VERSION = 1

type RandomSource = () => number

function createAssemblySeed(): string {
  const randomUuid = globalThis.crypto?.randomUUID?.()
  if (randomUuid) return randomUuid
  return `seed-${Date.now()}`
}

function hashSeed(seed: string): number {
  let hash = 0x811c9dc5
  for (let i = 0; i < seed.length; i++) {
    hash ^= seed.charCodeAt(i)
    hash = Math.imul(hash, 0x01000193)
  }
  return hash >>> 0
}

function createSeededRandom(seed: string): RandomSource {
  let state = hashSeed(seed)
  return () => {
    state = (state + 0x6d2b79f5) >>> 0
    let value = state
    value = Math.imul(value ^ (value >>> 15), value | 1)
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61)
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296
  }
}

function shuffle<T>(arr: T[], random: RandomSource): T[] {
  const out = [...arr]
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1))
    ;[out[i], out[j]] = [out[j], out[i]]
  }
  return out
}

const DURATION_PRIORITY: readonly BlockSlotType[] = [
  'main_skill',
  'technique',
  'movement_proxy',
  'pressure',
  'warmup',
  'wrap',
]

function hasUnmodeledRequirements(variant: DrillVariant): boolean {
  return (
    variant.environmentFlags.needsLines ||
    variant.environmentFlags.needsCones ||
    variant.equipment.cones !== undefined ||
    variant.equipment.balls === 'many' ||
    (typeof variant.equipment.balls === 'number' && variant.equipment.balls > 1)
  )
}

function findCandidates(slot: BlockSlot, context: SetupContext): CandidateVariant[] {
  const playerCount = context.playerMode === 'solo' ? 1 : 2

  const candidates: CandidateVariant[] = []
  for (const drill of allDrills) {
    if (!drill.m001Candidate) continue

    const hasMatchingFocus =
      !slot.skillTags ||
      slot.skillTags.length === 0 ||
      slot.skillTags.some((tag) => drill.skillFocus.includes(tag as Drill['skillFocus'][number]))
    if (!hasMatchingFocus) continue

    for (const variant of drill.variants) {
      if (variant.participants.min > playerCount) continue
      if (variant.participants.max < playerCount) continue

      if (variant.environmentFlags.needsNet && !context.netAvailable) continue
      if (variant.environmentFlags.needsWall && !context.wallAvailable) continue
      if (hasUnmodeledRequirements(variant)) continue

      candidates.push({ drill, variant })
    }
  }

  return candidates
}

function pickForSlot(
  slot: BlockSlot,
  context: SetupContext,
  usedDrillIds: Set<string>,
  random: RandomSource,
): CandidateVariant | undefined {
  const candidates = findCandidates(slot, context)

  const unused = candidates.filter((c) => !usedDrillIds.has(c.drill.id))
  const pool = shuffle(unused.length > 0 ? unused : candidates, random)

  if (pool.length === 0) return undefined

  if (slot.type === 'warmup') {
    // Tier 1a Unit 1 (D105 follow-up): prefer `skillFocus: ['warmup']`
    // content (Beach Prep) over any other drill in the pool. The
    // previous "first non-recovery drill" rule let a passing drill land
    // in the warmup slot when Beach Prep content was absent; preferring
    // the tag first and keeping non-recovery as a defensive fallback
    // means future Beach Prep authoring (d27 Tier 1b, d29 Tier 1b)
    // slots in without changing this branch.
    const warmup =
      pool.find((c) => c.drill.skillFocus.includes('warmup')) ??
      pool.find((c) => !c.drill.skillFocus.includes('recovery'))
    if (warmup) return warmup
  }

  if (slot.type === 'wrap') {
    const recovery = pool.find((c) => c.drill.skillFocus.includes('recovery'))
    if (recovery) return recovery
  }

  return pool[0]
}

/**
 * Tier 1a Unit 4: deterministic one-sentence rationale for why a block
 * landed in the session. The same (slot, drill) tuple always produces
 * the same sentence - no randomness, no LLM - so the partner
 * walkthrough can tag the rationale as "nodded at" or "ignored as
 * noise" against a stable surface.
 *
 * Feedback pass 2026-04-21: rationales used to cite internal decision
 * IDs (D105/D85) and repeat the session's `playerMode timeProfile-min`
 * trailer on every block. Testers read the decision IDs as noise and
 * the pair-25/pair-40 trailer as redundant (it never changes inside a
 * single session, so it added no signal per block). The new rationales
 * are purpose-driven strings per slot type - what the block *does* for
 * you - without internal IDs or timing.
 *
 * Not persisted to its own Dexie column - rides along inside the
 * `SessionPlanBlock` object once `createSessionFromDraft` carries it
 * from the draft onto the materialized plan.
 */
const SKILL_FOCUS_LABEL: Record<string, string> = {
  pass: 'passing',
  set: 'setting',
  serve: 'serving',
  attack: 'attacking',
  block: 'blocking',
  dig: 'digging',
  movement: 'movement',
  warmup: 'warmup',
  recovery: 'recovery',
}

function focusPhrase(drill: Pick<Drill, 'skillFocus'>): string {
  const primary = drill.skillFocus[0]
  if (!primary) return 'skill work'
  return SKILL_FOCUS_LABEL[primary] ?? primary
}

export function deriveBlockRationale(
  slotType: BlockSlotType,
  drill: Pick<Drill, 'skillFocus'>,
  // Context is kept in the signature for backwards compatibility with
  // call sites, but the 2026-04-21 rewrite intentionally does not
  // surface `playerMode`/`timeProfile` per block (same value across
  // every block in a session = no signal). Keep the parameter so
  // future rationale variants can re-derive from context without a
  // call-site migration; `void` silences the unused-arg lint.
  context: SetupContext,
): string {
  void context
  if (slotType === 'warmup') {
    return 'Chosen because: every session opens with a sand-specific warmup.'
  }
  if (slotType === 'wrap') {
    return 'Chosen because: every session closes with a cooldown downshift.'
  }
  const focus = focusPhrase(drill)
  switch (slotType) {
    case 'technique':
      return `Chosen because: low-intensity ${focus} rep to groove the pattern.`
    case 'movement_proxy':
      return `Chosen because: sand movement rep tied to ${focus}.`
    case 'main_skill':
      return `Chosen because: today's main ${focus} rep.`
    case 'pressure':
      return `Chosen because: adds pressure to your ${focus} under fatigue.`
    default:
      return `Chosen because: ${focus} block.`
  }
}

function allocateDurations(layout: BlockSlot[], totalMinutes: number): number[] | null {
  const durations = layout.map((slot) => slot.durationMinMinutes)
  const minTotal = durations.reduce((sum, value) => sum + value, 0)
  const maxTotal = layout.reduce((sum, slot) => sum + slot.durationMaxMinutes, 0)

  if (totalMinutes < minTotal || totalMinutes > maxTotal) return null

  let remaining = totalMinutes - minTotal
  while (remaining > 0) {
    let progressed = false
    for (const slotType of DURATION_PRIORITY) {
      for (let i = 0; i < layout.length; i++) {
        const slot = layout[i]
        if (slot.type !== slotType) continue
        if (durations[i] >= slot.durationMaxMinutes) continue
        durations[i] += 1
        remaining -= 1
        progressed = true
        if (remaining === 0) return durations
      }
    }
    if (!progressed) return null
  }

  return durations
}

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
  const blocks: DraftBlock[] = []
  let blockIndex = 0

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
        context,
        usedDrillIds,
        lastMainSkillDrillId,
      )
      if (mainSkillSubstitute) {
        usedDrillIds.add(mainSkillSubstitute.candidate.drill.id)
      }
    }
  }

  for (let i = 0; i < layout.length; i++) {
    const slot = layout[i]

    let pick: CandidateVariant | undefined
    let substitutionRationale: string | undefined

    if (slot.type === 'main_skill' && mainSkillSubstitute) {
      pick = mainSkillSubstitute.candidate
      substitutionRationale = mainSkillSubstitute.rationale
    }

    if (!pick) {
      pick = pickForSlot(slot, context, usedDrillIds, random)
    }

    if (!pick) {
      if (slot.required) return null
      continue
    }

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
      required: slot.required,
      rationale: substitutionRationale ?? deriveBlockRationale(slot.type, pick.drill, context),
      subBlockIntervalSeconds: pick.variant.subBlockIntervalSeconds,
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
  }
}

/**
 * Phase 2.2 build-time substitution helper. Returns a (candidate,
 * rationale) pair when ALL of:
 *   1. A `SUBSTITUTION_RULE` exists with `fromDrillId ===
 *      lastMainSkillDrillId`,
 *   2. that rule's `blockedBy` constraint is active in today's
 *      context, AND
 *   3. one of the rule's `substituteDrillIds` is present in the
 *      slot's candidate pool.
 *
 * Returns `undefined` otherwise so the caller falls through to the
 * default `pickForSlot` path. Deterministic by construction: candidates
 * come straight from `findCandidates` (no shuffle), rule iteration
 * follows the authored `substituteDrillIds` order, and `findSubstitute`
 * returns the first match.
 *
 * The build path intentionally skips chain-based "preferred-promotion"
 * (i.e., forcing the natural next drill when it IS available). The
 * default `pickForSlot` already handles "what to pick when not
 * blocked"; layering a chain-driven override on top of it would
 * silently re-rank ranked-fill behavior without explicit rules. Swap
 * keeps the preferred-promotion path because it's a user-initiated
 * "show me what's next" action; build does not.
 */
function pickMainSkillSubstitute(
  slot: BlockSlot,
  context: SetupContext,
  usedDrillIds: Set<string>,
  lastMainSkillDrillId: string,
): { candidate: CandidateVariant; rationale: string } | undefined {
  const candidates = findCandidates(slot, context)
  const unused = candidates.filter((c) => !usedDrillIds.has(c.drill.id))
  const pool = unused.length > 0 ? unused : candidates

  const result = findSubstitute(lastMainSkillDrillId, pool, context, SUBSTITUTION_RULES)
  if (!result) return undefined

  return {
    candidate: result.candidate,
    rationale: deriveSubstitutionRationale(result.rule),
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
 * - Carries forward the plan's `context` onto the new draft (R6). If
 *   the plan has no persisted context (legacy v3 records), returns
 *   `null` so the caller can fall back to "Repeat full plan" /
 *   pre-filled Setup.
 * - Returns `null` when zero blocks are completed - the ended-early
 *   typical case has at least a warmup, but this is defensive; the
 *   caller should hide the secondary button in that case.
 * - Does NOT carry `SessionPlan.safetyCheck` values onto the draft -
 *   the draft doesn't encode safety (that happens on Safety screen
 *   mount), and D83 makes that a per-session decision anyway.
 * - `drillId` / `variantId` are preserved when the plan carries them;
 *   legacy plans fall back to empty strings so the draft shape remains
 *   valid without guessing catalog identity from display names.
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
      required: planBlock.required,
      // Tier 1a Unit 4: preserve the original block's rationale on the
      // rebuilt draft so a "Repeat what you did" session still reads
      // with the same Chosen-because line. Legacy plans without
      // rationale keep it undefined; the UI handles that case.
      rationale: planBlock.rationale,
      subBlockIntervalSeconds: planBlock.subBlockIntervalSeconds,
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
 * 2026-04-21: Recovery-specific duration allocator. Warmup and wrap
 * stay pinned at their minimum (they're bookends, not the workout);
 * the remaining minutes flow into the Work blocks (`technique` and
 * `movement_proxy`) with a ~60/40 bias toward technique so the Work
 * block dominates the session rather than reading as an intermission
 * between warmup and wrap.
 *
 * Deliberately ignores each slot's `durationMaxMinutes`. Those maxes
 * come from the full-session archetype layout where the cap reflects
 * `main_skill` and `pressure` competing for the same minute budget.
 * In a recovery session we've dropped those competitors, so stretching
 * a technique block past its full-session max is correct - the max was
 * never a clinical upper bound, it was a scheduling tradeoff.
 */
function allocateRecoveryDurations(layout: BlockSlot[], totalMinutes: number): number[] | null {
  const durations = layout.map((s) => s.durationMinMinutes)
  const minTotal = durations.reduce((a, b) => a + b, 0)
  if (totalMinutes < minTotal) return null

  const remaining = totalMinutes - minTotal
  if (remaining === 0) return durations

  const techIdx = layout.findIndex((s) => s.type === 'technique')
  const moveIdx = layout.findIndex((s) => s.type === 'movement_proxy')

  if (techIdx >= 0 && moveIdx >= 0) {
    // 60/40 bias toward technique. `Math.ceil` favors technique when
    // the remainder is odd; movement_proxy gets the residue.
    const techShare = Math.ceil(remaining * 0.6)
    const moveShare = remaining - techShare
    durations[techIdx] += techShare
    durations[moveIdx] += moveShare
    return durations
  }

  if (techIdx >= 0) {
    durations[techIdx] += remaining
    return durations
  }

  if (moveIdx >= 0) {
    durations[moveIdx] += remaining
    return durations
  }

  // No Work block present at all. This shouldn't happen for any
  // authored archetype × timeProfile combination (every layout has at
  // least a `technique` slot), but rather than construct a session
  // that silently stretches warmup or wrap, fall through to the
  // general allocator so the block structure stays honest.
  return allocateDurations(layout, totalMinutes)
}

/**
 * Build a recovery-oriented draft for when SafetyCheck flags pain.
 * Uses the same archetype but drops main work and pressure — keeps
 * warmup, technique, movement proxy (when the template has one), and wrap.
 */
export function buildRecoveryDraft(context: SetupContext): SessionDraft | null {
  const archetype = selectArchetype(context)
  if (!archetype) return null
  const assemblySeed = createAssemblySeed()
  const random = createSeededRandom(assemblySeed)

  const layout = archetype.layouts[context.timeProfile]
  if (!layout) return null

  const recoveryLayout = layout.filter((s) => RECOVERY_BLOCK_SLOT_TYPES.includes(s.type))
  if (recoveryLayout.length === 0) return null
  // Target the user's chosen timeProfile, not the filtered layout's
  // minimum total. The minutes that `main_skill` + `pressure` would
  // have claimed in a full session fold into the Work block via
  // `allocateRecoveryDurations` - see that function's JSDoc for why
  // the Work block can legally exceed its full-session max here.
  const durations = allocateRecoveryDurations(recoveryLayout, context.timeProfile)
  if (!durations) return null

  const usedDrillIds = new Set<string>()
  const blocks: DraftBlock[] = []
  let blockIndex = 0

  for (let i = 0; i < recoveryLayout.length; i++) {
    const slot = recoveryLayout[i]
    const pick = pickForSlot(slot, context, usedDrillIds, random)
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
      required: slot.required,
      rationale: deriveBlockRationale(slot.type, pick.drill, context),
      subBlockIntervalSeconds: pick.variant.subBlockIntervalSeconds,
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
  }
}

/**
 * Phase F Unit 4 (2026-04-19): swap-alternate derivation for the
 * mid-run `Swap` courtside action.
 *
 * Given the currently-rendered `SessionPlanBlock` and the original
 * session context, return the ranked list of alternate drills that
 * would be a valid swap target - same block slot type, same
 * context-filtered candidate pool, different drill. The caller (the
 * `Swap` button on `RunControls`) picks `alternates[0]` to cycle
 * forward; each successive swap re-derives the list with the new
 * `block.drillName` as the exclusion, so cycling happens naturally
 * without the hook having to track a swap-cursor.
 *
 * Why skill-tag mapping by block type rather than reading the original
 * archetype: archetypes' skill-tag lists are tied to the slot
 * definition in `data/archetypes.ts`, and the SessionPlan's
 * `presetId` gives us the archetype but NOT the slot mapping after
 * duration allocation. For v0b the tag set is consistent across
 * archetypes (main_skill always has `['pass', 'serve']`, etc.), so
 * a static map is both correct and decoupled from the archetype
 * catalog's internal structure.
 *
 * Deterministic ordering: sorted by `drill.id` so the cycle is stable
 * across renders / persistence roundtrips. No randomization - testers
 * should see the same "next" drill every time they tap Swap on the
 * same block.
 *
 * Warmup / wrap slots return an empty list (curated content per
 * `D85` / `D105`; mid-drill drill-swap doesn't make sense there). The
 * RunControls UI also disables Swap on those slots as a belt; this is
 * suspenders.
 *
 * Neighbor-aware exclusion (VB-FL-7, 2026-04-19 non-player field
 * look): callers can pass `options.excludeDrillNames` to also strip
 * candidates whose drill name matches a surrounding plan block -
 * typically `plan.blocks[activeBlockIndex ± 1]`. That prevents the
 * surprising case where a tester taps Swap and the new drill is
 * identical to the drill they're about to do next (or just finished).
 * If neighbor-exclusion would empty the candidate pool, we fall back
 * to base exclusion only (current drill name) so a tight slot pool
 * can't make the Swap button useless; landing on a neighbor is
 * better than no-op. The current-drill exclusion is never relaxed -
 * cycling past the same drill would defeat the Swap action entirely.
 */
// Tier 1a Unit 2 (Swap-pool expansion): `main_skill` and `pressure`
// include `'set'` so user-initiated Swap reaches chain-7-setting drills
// (d38 Bump Set, d39 Hand Set, d41 Partner Set B&F). `archetypes.ts`
// block skillTags intentionally stay `['pass', 'serve']` - default
// (non-Swap) session assembly preserves the single-focus-per-session
// invariant; Swap is the user-initiated escape hatch that may cross
// focus boundaries by intent. See
// docs/plans/2026-04-20-m001-tier1-implementation.md Unit 2 ("Do NOT
// modify archetypes.ts").
//
// Tier 1c unifies this map with a dynamic `context.sessionFocus`
// override path in both `pickForSlot` and `findSwapAlternatives`. Until
// then this map is the Swap-pool source of truth.
const SKILL_TAGS_BY_TYPE: Record<BlockSlotType, readonly string[]> = {
  warmup: ['pass', 'movement'],
  technique: ['pass'],
  movement_proxy: ['pass', 'movement'],
  main_skill: ['pass', 'serve', 'set'],
  pressure: ['pass', 'serve', 'set'],
  wrap: ['recovery'],
}

export type FindSwapAlternativesOptions = {
  /**
   * Additional drill names to exclude beyond the current block's drill.
   * Typically the drill names of the immediately-previous and
   * immediately-next plan blocks, so a Swap can't land adjacent to an
   * identical drill. Exclusion is best-effort: if the filtered pool
   * would be empty, the function falls back to excluding only the
   * current drill (see function-level doc).
   */
  readonly excludeDrillNames?: readonly string[]
}

function findPreferredProgressionTarget(drillId: string): string | undefined {
  for (const chain of PROGRESSION_CHAINS) {
    const link = chain.links.find(
      (candidate) => candidate.direction === 'progression' && candidate.fromDrillId === drillId,
    )
    if (link) return link.toDrillId
  }
  return undefined
}

function blockedConstraintPhrase(blockedConstraint: BlockedConstraint): string {
  switch (blockedConstraint) {
    case 'needsNet':
      return 'net drill'
    case 'needsWall':
      return 'wall drill'
  }
}

function deriveSubstitutionRationale(rule: SubstitutionRule): string {
  return `Chosen because: the next ${blockedConstraintPhrase(
    rule.blockedBy,
  )} is unavailable today, so this keeps ${rule.preservedIntent}.`
}

export function findSwapAlternatives(
  block: SessionPlanBlock,
  context: SetupContext,
  options?: FindSwapAlternativesOptions,
): SessionPlanBlock[] {
  // Warmup / wrap are curated per D85 / D105. No swap alternates.
  if (block.type === 'warmup' || block.type === 'wrap') return []

  const slot: BlockSlot = {
    type: block.type,
    durationMinMinutes: block.durationMinutes,
    durationMaxMinutes: block.durationMinutes,
    intent: '',
    required: block.required,
    skillTags: [...SKILL_TAGS_BY_TYPE[block.type]],
  }
  const candidates = findCandidates(slot, context).sort((a, b) =>
    a.drill.id.localeCompare(b.drill.id),
  )

  // Base exclusion (always on): the drill currently in this slot.
  // Legacy SessionPlanBlock rows may lack drillId, so name remains the
  // defensive exclusion fallback for old persisted plans. Rotate the
  // sorted pool from the current drill so repeated Swap taps walk forward
  // instead of bouncing between the lowest two drill IDs.
  const currentIndex = candidates.findIndex(
    (c) => c.drill.id === block.drillId || c.drill.name === block.drillName,
  )
  const baseFiltered =
    currentIndex >= 0
      ? [...candidates.slice(currentIndex + 1), ...candidates.slice(0, currentIndex)].filter(
          (c) => c.drill.name !== block.drillName,
        )
      : candidates.filter((c) => c.drill.name !== block.drillName)

  // Neighbor-aware exclusion (VB-FL-7): try to also drop any drill
  // whose name matches a surrounding block. Keep the base filter as
  // fallback so a tight pool (e.g., a context with only 2 eligible
  // drills for a slot) can't collapse the Swap button to a no-op.
  const extraExcludes = new Set(
    options?.excludeDrillNames?.filter((n) => n !== block.drillName) ?? [],
  )
  let filtered = baseFiltered
  if (extraExcludes.size > 0) {
    const neighborFiltered = baseFiltered.filter((c) => !extraExcludes.has(c.drill.name))
    if (neighborFiltered.length > 0) {
      filtered = neighborFiltered
    }
  }

  // Two promotion paths, in priority order:
  //   1. Preferred-promotion (chain-based): if the natural next drill
  //      from `block.drillId` is in the swap pool today, surface it
  //      first with the slot's normal rationale. This is the "your
  //      progression is available, here it is first" UX that the
  //      build path intentionally does NOT replicate.
  //   2. Substitute-promotion (rules-based): if the preferred drill
  //      is blocked AND a `SUBSTITUTION_RULE` exists, surface the
  //      authored substitute with a "Chosen because: the next [...] is
  //      unavailable today" rationale. Rules are the single source of
  //      truth for blocked-progression substitution; the build path
  //      uses the same `findSubstitute` helper.
  const rationaleByDrillId = new Map<string, string>()
  if (block.drillId) {
    const preferredToDrillId = findPreferredProgressionTarget(block.drillId)
    const preferred = preferredToDrillId
      ? findPreferredCandidate(preferredToDrillId, filtered)
      : undefined
    if (preferred) {
      filtered = [preferred, ...filtered.filter((candidate) => candidate !== preferred)]
    } else {
      const substitute = findSubstitute(block.drillId, filtered, context, SUBSTITUTION_RULES)
      if (substitute) {
        filtered = [
          substitute.candidate,
          ...filtered.filter((candidate) => candidate !== substitute.candidate),
        ]
        rationaleByDrillId.set(
          substitute.candidate.drill.id,
          deriveSubstitutionRationale(substitute.rule),
        )
      }
    }
  }

  return filtered.map((c) => ({
    // Keep the block id stable so ExecutionLog.blockStatuses[i].blockId
    // still points at this slot after swap.
    id: block.id,
    type: block.type,
    drillId: c.drill.id,
    variantId: c.variant.id,
    drillName: c.drill.name,
    shortName: c.drill.shortName,
    durationMinutes: block.durationMinutes,
    coachingCue:
      c.variant.coachingCues.length > 0 ? c.variant.coachingCues.join(' \u00b7 ') : c.drill.name,
    courtsideInstructions: c.variant.courtsideInstructions,
    required: block.required,
    // Tier 1a Unit 4: rebuild the rationale against the swapped drill
    // so RunScreen's "Chosen because:" line stays truthful after a
    // mid-run Swap. Without this, the rationale would keep reading
    // "pass focus" even after the user swapped to a serve drill.
    rationale:
      rationaleByDrillId.get(c.drill.id) ?? deriveBlockRationale(block.type, c.drill, context),
    // Pre-close 2026-04-21 (P2-2): carry the swapped variant's sub-block
    // pacing (if any) through the swap. In practice the Swap button is
    // hidden on warmup/wrap per D85/D105 and the main_skill variants
    // currently shipped have no sub-block pacing, so this is defensive -
    // it keeps the type honest so future variants with sub-blocks on a
    // Swap-eligible slot don't silently drop their pacing mid-swap.
    subBlockIntervalSeconds: c.variant.subBlockIntervalSeconds,
  }))
}
