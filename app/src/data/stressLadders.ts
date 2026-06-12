/**
 * Stress-ladder registry (D154; membership broadened catalog-wide by
 * D160) — the per-focus ordinal orderings of scoped-tag drills by
 * skill-side stress (progressive contextual interference, D68).
 * Static content, no Dexie state: the athlete's
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
 * Per-focus ladders, ordered low → high stress. Every catalog drill
 * whose `skillFocus` includes the focus appears exactly once in that
 * focus's ladder (D160 broadened membership beyond `m001Candidate`;
 * assembly-blocked drills included — nearest-rung fallback handles
 * their unavailability). Lifecycle-only drills (recovery/warmup tags:
 * d25, d26, d28) stay off-ladder by design — no ladder exists for
 * those focuses and contextual-interference rungs do not apply.
 *
 * Non-candidate placements are runtime-inert: `findCandidates` filters
 * on `m001Candidate`, so their rungs are content metadata that becomes
 * live only if eligibility widens. Placements stay within the original
 * per-focus bounds (pass 1–5, serve 1–4, set 1–5); growing a ladder's
 * bounds requires its own decision row (D160) because it would shift
 * `startingStressRung`, offer gating, and derived-position clamping.
 * Dual-focus drills (d08, d18, d20, d21) carry an independently
 * authored rung in each of their ladders.
 */
export const STRESS_LADDERS: Record<StressLadderFocus, readonly StressRung[]> = {
  pass: [
    // d02/d04: chain-1 blocked posture/self-catch fundamentals beside d01 — constant feed, one outcome.
    { rung: 1, drillIds: ['d01', 'd02', 'd04'] },
    // d06: fixed set-window target beside its chain-2 sibling d05; d19: controlled-input butterfly rotation — serial rhythm.
    { rung: 2, drillIds: ['d03', 'd05', 'd06', 'd19'] },
    // d12/d13/d14: chain-3 movement courses beside d09/d10; d16: defined-sequence footwork (one below d15's reactive read);
    // d17: two-role coordination off serve/toss; d24: move-to-ball corner targeting — varied movement/perception.
    { rung: 3, drillIds: ['d07', 'd09', 'd10', 'd12', 'd13', 'd14', 'd16', 'd17', 'd24'] },
    // d20: live serve receive inside a pass-set-attack continuity constraint; d21: 500's scored anticipation reads — reactive/outcome pressure beside d11/d15.
    { rung: 4, drillIds: ['d11', 'd15', 'd20', 'd21'] },
    // d08: live serve receive under +3/−3 stakes beside d18/d46 — live-read.
    { rung: 5, drillIds: ['d08', 'd18', 'd46', 'd50'] },
  ],
  serve: [
    { rung: 1, drillIds: ['d31'] },
    // d23: full-routine serial reps; the dash is body load, not contextual interference (D149 keeps load off this scale).
    { rung: 2, drillIds: ['d23', 'd51'] },
    { rung: 3, drillIds: ['d22'] },
    // d08: serving into live receive with error scoring — rung 4's "serve into live receive" signature beside d18.
    { rung: 4, drillIds: ['d08', 'd18', 'd33'] },
  ],
  set: [
    { rung: 1, drillIds: ['d38', 'd39', 'd40'] },
    { rung: 2, drillIds: ['d41'] },
    { rung: 3, drillIds: ['d42'] },
    // d20: setting off live-ish passes in continuity flow; d21: 500's scored chaotic entries — reactive/graded beside d47.
    { rung: 4, drillIds: ['d20', 'd21', 'd47'] },
    { rung: 5, drillIds: ['d48', 'd49'] },
  ],
}

/** The authored rung for a drill within a focus; undefined off-ladder. */
export function stressRungForDrill(focus: StressLadderFocus, drillId: string): number | undefined {
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
