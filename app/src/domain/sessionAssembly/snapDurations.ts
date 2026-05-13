import type { BlockSlot, BlockSlotType, SetupContext } from '../../model'
import type { CandidateVariant } from './candidates'

/**
 * Default redistribution priority — used when `sessionFocus` is undefined.
 * Mirrors `DURATION_PRIORITY` in `durations.ts` but stops at slot types
 * that can absorb extra work; warmup/wrap are intentionally absent because
 * the snap exists to remove minutes from them.
 */
const DEFAULT_REDISTRIBUTION_PRIORITY: readonly BlockSlotType[] = [
  'main_skill',
  'technique',
  'movement_proxy',
  'pressure',
]

/**
 * Focus-aware redistribution priority. When `sessionFocus` is set,
 * minutes freed by warmup/wrap snap go first into slots that exercise
 * the chosen skill. `effectiveSkillTags` already filters `main_skill`
 * and `pressure` candidates by the session focus; redistributing into
 * those slots therefore amplifies real focus practice rather than
 * landing in unrelated work.
 */
const FOCUS_REDISTRIBUTION_PRIORITY: Record<
  NonNullable<SetupContext['sessionFocus']>,
  readonly BlockSlotType[]
> = {
  serve: ['main_skill', 'pressure', 'technique', 'movement_proxy'],
  pass: ['main_skill', 'technique', 'movement_proxy', 'pressure'],
  set: ['main_skill', 'technique', 'movement_proxy', 'pressure'],
}

/**
 * Recovery redistribution priority. `buildRecoveryDraft` excludes
 * `main_skill` and `pressure` from its layout, so redistribution can
 * only target technique and movement_proxy. Provided as an explicit
 * priority for callers that already know they're in recovery mode.
 */
export const RECOVERY_REDISTRIBUTION_PRIORITY: readonly BlockSlotType[] = [
  'technique',
  'movement_proxy',
]

export interface SnapWarmupWrapDurationsOptions {
  /**
   * Override the default and focus-derived redistribution priority.
   * Recovery callers pass `RECOVERY_REDISTRIBUTION_PRIORITY` here.
   */
  priority?: readonly BlockSlotType[]
  /**
   * When `true`, redistribution skips the per-slot
   * `durationMaxMinutes` cap. Used by `buildRecoveryDraft`, which
   * already allocates technique/movement_proxy above their archetype
   * slot maxes by design (the recovery contract is "preserve
   * timeProfile minutes, lighten load," see
   * `allocateRecoveryDurations` JSDoc). Without this escape hatch a
   * recovery snap would drop the freed minute because the target slot
   * is already above its cap.
   *
   * Default is `false` for the standard `buildDraft` path, which
   * honors archetype slot envelopes. Renamed from `allowOverflow` per
   * 2026-05-04 review feedback — the previous name read as ambiguous
   * given multiple caps (slot max, segment-sum natural, redistribution
   * priority) interact in this helper.
   */
  allowSlotMaxOverflow?: boolean
}

/**
 * After session assembly picks variants for each slot, snap warmup and
 * wrap blocks down to the chosen variant's natural segment sum and
 * redistribute the freed minutes into work slots in focus-aware order.
 *
 * The snap target for an eligible warmup/wrap slot is
 * `variant.workload.durationMinMinutes` (the catalog-validated segment
 * sum in minutes), clamped to the slot's authored
 * `[durationMinMinutes, durationMaxMinutes]` envelope. Slots whose chosen
 * variant has no authored `segments` are not snapped — legacy and
 * non-segmented warmup/wrap drills keep their allocator-given duration.
 *
 * Freed minutes redistribute one minute at a time across slots whose
 * type appears in the priority order, capped at each slot's
 * `durationMaxMinutes`. When all redistribution targets are saturated,
 * any leftover freed minutes are dropped — the session total may be
 * shorter than the original `timeProfile`. Warmup/wrap durations are
 * never re-inflated to absorb leftover; the snap is canonical.
 *
 * Pure: no I/O, no clock, no randomness. Returns a fresh array; does
 * not mutate `durations`.
 *
 * 2026-05-04 ship (`docs/plans/2026-05-04-002-feat-warmup-wrap-segment-snap-plan.md`).
 */
export function snapWarmupWrapDurations(
  layout: readonly BlockSlot[],
  durations: readonly number[],
  picks: readonly (CandidateVariant | undefined)[],
  sessionFocus: SetupContext['sessionFocus'],
  options?: SnapWarmupWrapDurationsOptions,
): number[] {
  const result = [...durations]
  if (layout.length === 0) return result

  let freed = 0

  for (let i = 0; i < layout.length; i++) {
    const slot = layout[i]
    if (!slot) continue
    if (slot.type !== 'warmup' && slot.type !== 'wrap') continue

    const pick = picks[i]
    if (!pick) continue

    const segments = pick.variant.segments
    if (!segments || segments.length === 0) continue

    const naturalMinutes = pick.variant.workload.durationMinMinutes
    // Catalog validation enforces `sum(segments) === durationMinMinutes
    // * 60`, but doesn't pin `durationMinMinutes` itself to integer
    // values. The redistribution loop below operates in whole-minute
    // steps, so a fractional natural would let `freed` (and `remaining`)
    // drift off integer boundaries and produce subtle over- or under-
    // placement. Defensive guard: snap only on integer naturals.
    if (!Number.isInteger(naturalMinutes) || naturalMinutes <= 0) continue

    // Cap the snap target at the slot's authored max so we never
    // produce a duration above what the archetype permits. We do NOT
    // clamp up to `slot.durationMinMinutes` — slot mins are allocator
    // guidance for unknown drills, and once a specific variant is
    // picked, its catalog-validated natural sum is the more
    // authoritative number. The Pair + Net 40-min `warmup(4, 6)` slot
    // is the load-bearing case: `d28-solo` legitimately has 3 min of
    // segments and the snap must honor that.
    const target = Math.min(slot.durationMaxMinutes, naturalMinutes)

    const current = result[i]
    if (target >= current) continue

    freed += current - target
    result[i] = target
  }

  if (freed === 0) return result

  const priority = resolvePriority(sessionFocus, options?.priority)
  const allowSlotMaxOverflow = options?.allowSlotMaxOverflow === true
  let remaining = freed
  // Round-robin loop matching `allocateDurations`: walk priority types,
  // for each type walk layout indices, +1 minute when the slot has
  // headroom under its max. Loop terminates when every priority slot
  // is at cap (no progress in a full pass) or freed minutes are placed.
  // In `allowSlotMaxOverflow` mode the cap check is skipped — used by
  // recovery, which already overshoots caps by design.
  //
  // Skip indices whose `picks[i]` is undefined: a non-required slot
  // whose `pickForSlot` returned no candidate (e.g., `pressure` on a
  // serve focus with no serve-tagged pressure drill in the catalog) is
  // dropped from the block list during phase 2 of `buildDraft`. Adding
  // freed minutes to such a slot would silently vanish the minutes.
  while (remaining > 0) {
    let progressed = false
    for (const slotType of priority) {
      for (let i = 0; i < layout.length; i++) {
        const slot = layout[i]
        if (!slot) continue
        if (slot.type !== slotType) continue
        const pick = picks[i]
        if (!pick) continue
        if (!allowSlotMaxOverflow) {
          // Standard `buildDraft` path: redistribution respects BOTH the
          // archetype slot's authored max AND the chosen variant's
          // authored max. The variant cap honors the drill author's
          // stated upper bound so the snap doesn't silently push a block
          // above the drill's own ceiling (which would surface as an
          // unclassified over-cap finding in `generatedPlanDiagnostics`
          // — that diagnostic only classifies allocator-driven or
          // legacy-redistribution-driven over-cap, not snap-driven).
          if (result[i] >= slot.durationMaxMinutes) continue
          const variantMax = pick.variant.workload.durationMaxMinutes
          if (result[i] >= variantMax) continue
        }
        // Recovery path (`allowSlotMaxOverflow: true`): skip both caps.
        // `allocateRecoveryDurations` already promotes technique above
        // its archetype slot max by design (folds main_skill + pressure
        // minutes into technique); preserving that contract requires
        // the snap to bypass both the slot AND variant caps so the
        // session's `timeProfile` total is preserved. The diagnostic
        // pipeline does not run against recovery drafts.
        result[i] += 1
        remaining -= 1
        progressed = true
        if (remaining === 0) return result
      }
    }
    if (!progressed) {
      // Every slot in the priority order is at its cap (or no slot of
      // the priority type exists in the layout, or every same-type
      // slot was skipped during pick). Drop the remaining freed
      // minutes — session total is now shorter than the original
      // timeProfile, which is the intended trade per R5.
      return result
    }
  }

  return result
}

function resolvePriority(
  sessionFocus: SetupContext['sessionFocus'],
  override: readonly BlockSlotType[] | undefined,
): readonly BlockSlotType[] {
  if (override) return override
  if (sessionFocus && sessionFocus in FOCUS_REDISTRIBUTION_PRIORITY) {
    return FOCUS_REDISTRIBUTION_PRIORITY[sessionFocus]
  }
  return DEFAULT_REDISTRIBUTION_PRIORITY
}
