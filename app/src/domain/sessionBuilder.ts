import { DRILLS } from '../data/drills'
import { selectArchetype } from '../data/archetypes'
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

function shuffle<T>(arr: T[]): T[] {
  const out = [...arr]
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
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

function findCandidates(
  slot: BlockSlot,
  context: SetupContext,
): CandidateVariant[] {
  const playerCount = context.playerMode === 'solo' ? 1 : 2

  const candidates: CandidateVariant[] = []
  for (const drill of allDrills) {
    if (!drill.m001Candidate) continue

    const hasMatchingFocus =
      !slot.skillTags ||
      slot.skillTags.length === 0 ||
      slot.skillTags.some((tag) =>
        drill.skillFocus.includes(tag as Drill['skillFocus'][number]),
      )
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
): CandidateVariant | undefined {
  const candidates = findCandidates(slot, context)

  const unused = candidates.filter((c) => !usedDrillIds.has(c.drill.id))
  const pool = shuffle(unused.length > 0 ? unused : candidates)

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
 * landed in the session. The same (slot, drill, context) tuple always
 * produces the same sentence — no randomness, no LLM — so the partner
 * walkthrough can tag the rationale as "nodded at" or "ignored as
 * noise" against a stable surface.
 *
 * Warmup and wrap get fixed boilerplate that cites D105 / D85, because
 * their *why* is curatorial ("every session starts/ends this way") not
 * context-derived. All other slot types read as
 * "{slot-type-label} block, {drill primary focus} focus,
 *  {playerMode} {timeProfile}-min."
 *
 * Not persisted to its own Dexie column — rides along inside the
 * `SessionPlanBlock` object once `createSessionFromDraft` carries it
 * from the draft onto the materialized plan. Tier 2 See-Why would
 * expand this into a richer modal surface; Tier 1a ships the single
 * sentence only.
 */
const SLOT_TYPE_LABEL: Record<BlockSlotType, string> = {
  warmup: 'warmup',
  technique: 'technique',
  movement_proxy: 'movement-proxy',
  main_skill: 'main-skill',
  pressure: 'pressure',
  wrap: 'wrap',
}

export function deriveBlockRationale(
  slotType: BlockSlotType,
  drill: Pick<Drill, 'skillFocus'>,
  context: SetupContext,
): string {
  if (slotType === 'warmup') {
    return 'Chosen because: every session starts with Beach Prep (D105).'
  }
  if (slotType === 'wrap') {
    return 'Chosen because: every session ends with a downshift (D85).'
  }
  const focus = drill.skillFocus[0] ?? 'skill'
  const slotLabel = SLOT_TYPE_LABEL[slotType]
  return `Chosen because: ${slotLabel} block, ${focus} focus, ${context.playerMode} ${context.timeProfile}-min.`
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

export function buildDraft(context: SetupContext): SessionDraft | null {
  const archetype = selectArchetype(context)
  if (!archetype) return null

  const layout = archetype.layouts[context.timeProfile]
  if (!layout || layout.length === 0) return null
  const durations = allocateDurations(layout, context.timeProfile)
  if (!durations) return null

  const usedDrillIds = new Set<string>()
  const blocks: DraftBlock[] = []
  let blockIndex = 0

  for (let i = 0; i < layout.length; i++) {
    const slot = layout[i]
    const pick = pickForSlot(slot, context, usedDrillIds)

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
      rationale: deriveBlockRationale(slot.type, pick.drill, context),
    })
  }

  if (blocks.length === 0) return null

  return {
    id: 'current',
    context,
    archetypeId: archetype.id,
    archetypeName: archetype.name,
    blocks,
    updatedAt: Date.now(),
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
 * - Returns `null` when zero blocks are completed — the ended-early
 *   typical case has at least a warmup, but this is defensive; the
 *   caller should hide the secondary button in that case.
 * - Does NOT carry `SessionPlan.safetyCheck` values onto the draft —
 *   the draft doesn't encode safety (that happens on Safety screen
 *   mount), and D83 makes that a per-session decision anyway.
 * - `drillId` / `variantId` are left as empty strings: `SessionPlanBlock`
 *   drops them when the plan was materialized from the original draft
 *   (see `createSessionFromDraft`), and no runtime consumer reads them
 *   off `DraftBlock` after the plan is regenerated. Keeping them as
 *   empty strings beats introducing a schema change just for this
 *   backfill-adjacent path.
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
      // Plan blocks don't carry drillId/variantId — they were stripped
      // when the plan was materialized from the original draft. See
      // JSDoc above.
      drillId: '',
      variantId: '',
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
    blocks: completedBlocks,
    updatedAt: Date.now(),
  }
}

/**
 * Build a recovery-only draft for when SafetyCheck flags pain.
 * Uses the same archetype but only warmup + wrap blocks.
 */
export function buildRecoveryDraft(context: SetupContext): SessionDraft | null {
  const archetype = selectArchetype(context)
  if (!archetype) return null

  const layout = archetype.layouts[context.timeProfile]
  if (!layout) return null

  const recoverySlotTypes: BlockSlotType[] = ['warmup', 'wrap']
  const recoveryLayout = layout.filter((s) => recoverySlotTypes.includes(s.type))
  if (recoveryLayout.length === 0) return null
  const recoveryTotal = recoveryLayout.reduce(
    (sum, slot) => sum + slot.durationMinMinutes,
    0,
  )
  const durations = allocateDurations(recoveryLayout, recoveryTotal)
  if (!durations) return null

  const usedDrillIds = new Set<string>()
  const blocks: DraftBlock[] = []
  let blockIndex = 0

  for (let i = 0; i < recoveryLayout.length; i++) {
    const slot = recoveryLayout[i]
    const pick = pickForSlot(slot, context, usedDrillIds)
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
    })
  }

  if (blocks.length === 0) return null

  return {
    id: 'current',
    context,
    archetypeId: archetype.id,
    archetypeName: archetype.name,
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
 * would be a valid swap target — same block slot type, same
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
 * across renders / persistence roundtrips. No randomization — testers
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
 * candidates whose drill name matches a surrounding plan block —
 * typically `plan.blocks[activeBlockIndex ± 1]`. That prevents the
 * surprising case where a tester taps Swap and the new drill is
 * identical to the drill they're about to do next (or just finished).
 * If neighbor-exclusion would empty the candidate pool, we fall back
 * to base exclusion only (current drill name) so a tight slot pool
 * can't make the Swap button useless; landing on a neighbor is
 * better than no-op. The current-drill exclusion is never relaxed —
 * cycling past the same drill would defeat the Swap action entirely.
 */
// Tier 1a Unit 2 (Swap-pool expansion): `main_skill` and `pressure`
// include `'set'` so user-initiated Swap reaches chain-7-setting drills
// (d38 Bump Set, d39 Hand Set, d41 Partner Set B&F). `archetypes.ts`
// block skillTags intentionally stay `['pass', 'serve']` — default
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
  const candidates = findCandidates(slot, context)

  // Base exclusion (always on): the drill currently in this slot.
  // SessionPlanBlock doesn't carry drillId (that field is stripped
  // when the plan is materialized from the draft — see
  // createSessionFromDraft in services/session.ts), so name is the
  // available identity.
  const baseFiltered = candidates.filter(
    (c) => c.drill.name !== block.drillName,
  )

  // Neighbor-aware exclusion (VB-FL-7): try to also drop any drill
  // whose name matches a surrounding block. Keep the base filter as
  // fallback so a tight pool (e.g., a context with only 2 eligible
  // drills for a slot) can't collapse the Swap button to a no-op.
  const extraExcludes = new Set(
    options?.excludeDrillNames?.filter((n) => n !== block.drillName) ?? [],
  )
  let filtered = baseFiltered
  if (extraExcludes.size > 0) {
    const neighborFiltered = baseFiltered.filter(
      (c) => !extraExcludes.has(c.drill.name),
    )
    if (neighborFiltered.length > 0) {
      filtered = neighborFiltered
    }
  }

  // Sort by drill id for deterministic cycling — each tap picks
  // alternates[0], then re-derives with the NEW drillName excluded,
  // so successive taps walk the list in a stable order.
  filtered.sort((a, b) => a.drill.id.localeCompare(b.drill.id))

  return filtered.map((c) => ({
    // Keep the block id stable so ExecutionLog.blockStatuses[i].blockId
    // still points at this slot after swap.
    id: block.id,
    type: block.type,
    drillName: c.drill.name,
    shortName: c.drill.shortName,
    durationMinutes: block.durationMinutes,
    coachingCue:
      c.variant.coachingCues.length > 0
        ? c.variant.coachingCues.join(' \u00b7 ')
        : c.drill.name,
    courtsideInstructions: c.variant.courtsideInstructions,
    required: block.required,
    // Tier 1a Unit 4: rebuild the rationale against the swapped drill
    // so RunScreen's "Chosen because:" line stays truthful after a
    // mid-run Swap. Without this, the rationale would keep reading
    // "pass focus" even after the user swapped to a serve drill.
    rationale: deriveBlockRationale(block.type, c.drill, context),
  }))
}
