/**
 * Stress-ladder registry (D154) — the per-focus ordinal orderings of
 * `m001Candidate` drills by skill-side stress (progressive contextual
 * interference, D68). Static content, no Dexie state: the athlete's
 * position on a ladder is derived elsewhere by replaying accepted
 * verdicts (`domain/adaptation/stressPosition.ts`).
 *
 * The authored source of truth is `docs/specs/stress-rung-taxonomy.md`
 * — rung semantics, per-drill rationale, and the authoring backlog live
 * there; this module must match it (enforced by the colocated test
 * suite). Rungs sit on drills, not variants: variants differ by context
 * (solo/pair, net/open), which stays the candidate filter's job.
 *
 * Layering: `data/` imports only `types/` here (the documented inward
 * rule; `ScopedFocus` in `domain/eligibleSessions.ts` is intentionally
 * NOT imported). `StressLadderFocus` is structurally identical to it
 * via the same `Extract` the `SetupContext.sessionFocus` field uses.
 *
 * The dormant `ProgressionChain` orderings informed these ladders; the
 * chains' pass/fail gating philosophy is retired, not revived —
 * movement on a ladder is user-accepted only (D154).
 */
import type { PlayerLevel, SkillFocus } from '../types/drill'

export type StressLadderFocus = Extract<SkillFocus, 'pass' | 'serve' | 'set'>

export interface StressRung {
  /** Ordinal stress level within the focus, 1 = lowest. */
  readonly rung: number
  /** Drills sharing this rung (catalog ids). */
  readonly drillIds: readonly string[]
}

/**
 * Per-focus ladders, ordered low → high stress. Every `m001Candidate`
 * drill whose `skillFocus` includes the focus appears exactly once in
 * that focus's ladder (assembly-blocked drills included — nearest-rung
 * fallback handles their unavailability). The dual-focus d18 carries an
 * independently authored rung in both the pass and serve ladders.
 */
export const STRESS_LADDERS: Record<StressLadderFocus, readonly StressRung[]> = {
  pass: [
    { rung: 1, drillIds: ['d01'] },
    { rung: 2, drillIds: ['d03', 'd05'] },
    { rung: 3, drillIds: ['d07', 'd09', 'd10'] },
    { rung: 4, drillIds: ['d11', 'd15'] },
    { rung: 5, drillIds: ['d18', 'd46', 'd50'] },
  ],
  serve: [
    { rung: 1, drillIds: ['d31'] },
    { rung: 2, drillIds: ['d51'] },
    { rung: 3, drillIds: ['d22'] },
    { rung: 4, drillIds: ['d18', 'd33'] },
  ],
  set: [
    { rung: 1, drillIds: ['d38', 'd39', 'd40'] },
    { rung: 2, drillIds: ['d41'] },
    { rung: 3, drillIds: ['d42'] },
    { rung: 4, drillIds: ['d47'] },
    { rung: 5, drillIds: ['d48', 'd49'] },
  ],
}

/** The authored rung for a drill within a focus; undefined off-ladder. */
export function stressRungForDrill(
  focus: StressLadderFocus,
  drillId: string,
): number | undefined {
  for (const rung of STRESS_LADDERS[focus]) {
    if (rung.drillIds.includes(drillId)) return rung.rung
  }
  return undefined
}

/** Inclusive rung bounds of a focus ladder. */
export function stressLadderBounds(focus: StressLadderFocus): {
  readonly min: number
  readonly max: number
} {
  const ladder = STRESS_LADDERS[focus]
  return { min: ladder[0].rung, max: ladder[ladder.length - 1].rung }
}

/**
 * Starting rung for a focus with no accepted verdicts, mapped from the
 * onboarding drill band (see the taxonomy brief's table). Advanced maps
 * to 4 and clamps to the ladder top — a no-op on today's ladders, kept
 * to guard future mapping/ladder tuning.
 */
export function startingStressRung(focus: StressLadderFocus, band: PlayerLevel): number {
  const { min, max } = stressLadderBounds(focus)
  const target = band === 'beginner' ? 1 : band === 'intermediate' ? 2 : 4
  return Math.min(Math.max(target, min), max)
}
