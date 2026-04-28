import { DRILLS } from '../data/drills'
import type { SessionPlanBlock } from '../model'
import type { SkillFocus } from '../model'

/**
 * Tier 1a Unit 5: inferred focus label for the Home last-3-sessions
 * row. One word per session, machine-derived from the plan's
 * `main_skill` block - the session's primary skill intent.
 *
 * Returns `'partial'` when:
 * - The plan has no `main_skill` block (short archetypes, early-abort
 *   before main_skill landed, or a legacy plan shape), OR
 * - The main_skill block's `drillName` doesn't match a drill in the
 *   static `DRILLS` catalog. Defensive: drill records get renamed
 *   and historical logs should not suddenly read as a different
 *   focus when that happens.
 *
 * Not persisted anywhere - recomputed on each Home render. Home calls
 * this with at most 3 plans per mount, so the O(blocks × DRILLS)
 * cost is negligible (≤ ~90 comparisons total). When that ceases to
 * be true (Tier 2 history screen), precompute a `drillByName` map
 * once at module load.
 *
 * Why not match by `drillId`? `SessionPlanBlock` deliberately carries
 * only `drillName` + `shortName` - the plan is a frozen snapshot, not
 * a pointer into the drill catalog. We accept the one-way name lookup
 * cost for the denormalization benefit (a deleted drill doesn't break
 * a historical log's render). See `db/types.ts::SessionPlanBlock`.
 *
 * See `docs/plans/2026-04-20-m001-tier1-implementation.md` Unit 5.
 */
export function inferSessionFocus(blocks: readonly SessionPlanBlock[]): SkillFocus | 'partial' {
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
 * English ("Passing", "Setting", "Partial") rather than a type dump.
 *
 * 2026-04-22 — gerund rewrite for the three skill-focus volleyball
 * terms (`pass` → "Passing", `serve` → "Serving", `set` → "Setting").
 * The three-column Home row renders as `date · focus · status`, where
 * status is "Done" / "Partial". The prior noun forms ("Pass" / "Serve"
 * / "Set") sat adjacent to "Done" / "Partial" and a reader without the
 * column model in mind parsed `Pass` as a status value — literally
 * pass/fail. Field evidence: see `N3` in the Post-close partner
 * mentions section of the 2026-04-21 Tier 1a walkthrough ledger
 * (`docs/research/partner-walkthrough-results/2026-04-21-tier-1a-walkthrough.md`),
 * traced to courtside-copy rule §2 ("one-season rec player test").
 *
 * Why only the three volleyball-skill cases? `Movement` /
 * `Conditioning` / `Recovery` / `Warm up` / `Mixed` are already
 * shape-disambiguated from the status column — none of them collides
 * with "Done" / "Partial".
 *
 * 2026-04-26 pre-D91 editorial polish (`F12`): the `'partial'` focus
 * fallback (no main-skill block found, or no focus on the main-skill
 * drill) now renders as `Mixed` instead of `Partial`. The original
 * choice tolerated the `Yesterday Partial Partial` collision on
 * partially-completed mixed sessions because either read was
 * "informative rather than wrong" — but a partner-walkthrough
 * tester reads the duplicated word as a glitch first. `Mixed`
 * matches the actual semantic ("we couldn't pin a single focus →
 * the session represents multiple skills") and cannot collide with
 * the `Done` / `Partial` status column. The internal enum key
 * `'partial'` is unchanged so this is a render-only edit. See
 * `docs/plans/2026-04-26-pre-d91-editorial-polish.md` Item 2.
 */
export function focusLabel(focus: SkillFocus | 'partial'): string {
  switch (focus) {
    case 'pass':
      return 'Passing'
    case 'serve':
      return 'Serving'
    case 'set':
      return 'Setting'
    case 'movement':
      return 'Movement'
    case 'conditioning':
      return 'Conditioning'
    case 'recovery':
      return 'Recovery'
    case 'warmup':
      return 'Warm up'
    case 'partial':
      return 'Mixed'
    default: {
      const _exhaustive: never = focus
      return _exhaustive
    }
  }
}
