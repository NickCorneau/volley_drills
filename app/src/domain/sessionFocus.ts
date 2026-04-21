import { DRILLS } from '../data/drills'
import type { SessionPlanBlock } from '../db'
import type { SkillFocus } from '../types/drill'

/**
 * Tier 1a Unit 5: inferred focus label for the Home last-3-sessions
 * row. One word per session, machine-derived from the plan's
 * `main_skill` block — the session's primary skill intent.
 *
 * Returns `'partial'` when:
 * - The plan has no `main_skill` block (short archetypes, early-abort
 *   before main_skill landed, or a legacy plan shape), OR
 * - The main_skill block's `drillName` doesn't match a drill in the
 *   static `DRILLS` catalog. Defensive: drill records get renamed
 *   and historical logs should not suddenly read as a different
 *   focus when that happens.
 *
 * Not persisted anywhere — recomputed on each Home render. Home calls
 * this with at most 3 plans per mount, so the O(blocks × DRILLS)
 * cost is negligible (≤ ~90 comparisons total). When that ceases to
 * be true (Tier 2 history screen), precompute a `drillByName` map
 * once at module load.
 *
 * Why not match by `drillId`? `SessionPlanBlock` deliberately carries
 * only `drillName` + `shortName` — the plan is a frozen snapshot, not
 * a pointer into the drill catalog. We accept the one-way name lookup
 * cost for the denormalization benefit (a deleted drill doesn't break
 * a historical log's render). See `db/types.ts::SessionPlanBlock`.
 *
 * See `docs/plans/2026-04-20-m001-tier1-implementation.md` Unit 5.
 */
export function inferSessionFocus(
  blocks: readonly SessionPlanBlock[],
): SkillFocus | 'partial' {
  const mainSkillBlock = blocks.find((b) => b.type === 'main_skill')
  if (!mainSkillBlock) return 'partial'
  const drill = DRILLS.find((d) => d.name === mainSkillBlock.drillName)
  if (!drill) return 'partial'
  const firstFocus = drill.skillFocus[0]
  if (!firstFocus) return 'partial'
  return firstFocus
}

/**
 * Tier 1a Unit 5: human-facing label for a focus inference result.
 * Kept small and sentence-cased so the Home row reads as plain
 * English ("Pass", "Set", "Partial") rather than a type dump.
 */
export function focusLabel(focus: SkillFocus | 'partial'): string {
  switch (focus) {
    case 'pass':
      return 'Pass'
    case 'serve':
      return 'Serve'
    case 'set':
      return 'Set'
    case 'movement':
      return 'Movement'
    case 'conditioning':
      return 'Conditioning'
    case 'recovery':
      return 'Recovery'
    case 'warmup':
      return 'Warm up'
    case 'partial':
      return 'Partial'
    default: {
      const _exhaustive: never = focus
      return _exhaustive
    }
  }
}
