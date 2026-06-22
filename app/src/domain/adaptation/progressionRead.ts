/**
 * M002.2 progression read (Review verdict card) — surfaces the authored
 * per-rung felt content the adaptation engine already computes but never
 * showed. Pure and DATA-ONLY: reads the two rendered strings from
 * `STRESS_LADDERS` via `getStressRung` and imports nothing from
 * `sessionAssembly/` (unlike `acceptConsequence`, which calls
 * `findCandidates`), so the "no assembly logic" claim holds.
 *
 * Keying (plan 2026-06-22-001):
 * - `reflection` = the rung the athlete ACTUALLY trained
 *   (`explorationCriterion`). The caller passes the trained drill's
 *   authored rung, NOT the derived ladder position — `offerPosition`
 *   diverges from the trained rung on off-target assembly landings
 *   (nearest-rung / duration-fit / substitute fallbacks fail quiet) and
 *   via review-time recomputation, so keying the "what you just trained"
 *   reflection off it would describe a rung the session never contained.
 * - `readiness` = the offer-position rung's `graduationFeel`, on a
 *   `more` offer only. It is a forward "ready to step up from your
 *   current ladder position" read tied to the offer itself, so the
 *   offer's basis (`offerPosition`) is the correct source. R15 offer
 *   gating guarantees `offerPosition < max` on a rendered `more` card,
 *   so this is always the non-top "step up" text, never the ladder-top
 *   "stay and deepen" copy.
 *
 * Null-safe on every missing/undefined rung — it runs in the Review
 * render body, where a thrown error would trip the app-root
 * ErrorBoundary and blank the whole screen.
 */
import { getStressRung, stressRungForDrill } from '../../data/stressLadders'
import type { SessionPlanBlock, StressDirection } from '../../model'
import type { ScopedFocus } from '../eligibleSessions'

export interface ProgressionReadInput {
  focus: ScopedFocus
  /** The authored rung of the main-skill drill actually trained; undefined when unknown or ambiguous. */
  trainedRung: number | undefined
  /** Derived ladder position the offer steps from (the offer's own basis). */
  offerPosition: number
  direction: StressDirection
}

export interface ProgressionRead {
  /** What to notice about the rung just trained; null when the trained rung is unknown. */
  reflection: string | null
  /** Felt readiness to step up; non-null only on a `more` offer. */
  readiness: string | null
}

export function composeProgressionRead(input: ProgressionReadInput): ProgressionRead {
  const { focus, trainedRung, offerPosition, direction } = input
  const reflection =
    trainedRung === undefined
      ? null
      : (getStressRung(focus, trainedRung)?.explorationCriterion ?? null)
  const readiness =
    direction === 'more' ? (getStressRung(focus, offerPosition)?.graduationFeel ?? null) : null
  return { reflection, readiness }
}

/**
 * The authored stress rung the athlete ACTUALLY trained, derived from a
 * plan's main-skill blocks for the reflective line (NOT the derived ladder
 * position `offerPosition`, which can diverge from the trained drill on
 * off-target assembly landings / review-time recomputation). Fails quiet to
 * undefined when there is no main-skill drill id, a trained main-skill drill
 * is off-ladder, or multiple main-skill blocks resolve to different rungs
 * (the "current rung" is then ambiguous).
 */
export function resolveTrainedRung(
  focus: ScopedFocus,
  blocks: readonly SessionPlanBlock[] | undefined,
): number | undefined {
  if (!blocks) return undefined
  const rungs = new Set<number>()
  for (const block of blocks) {
    if (block.type !== 'main_skill' || !block.drillId) continue
    const rung = stressRungForDrill(focus, block.drillId)
    if (rung === undefined) return undefined
    rungs.add(rung)
  }
  return rungs.size === 1 ? [...rungs][0] : undefined
}
