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
  // Progression content (M002.2). The field set, authoring rules, and
  // per-focus progression story are specified in
  // `docs/specs/stress-rung-taxonomy.md`; the authored strings themselves
  // live here as data. `explorationCriterion` + `graduationFeel` render
  // on the Review verdict card (D161/D162, 2026-06-22); `intent` renders
  // as the quiet block-opening line on the run flow's get-ready beat
  // (D163 on Transition, migrated by the D167 Stage-4 collapse, via
  // `resolveBlockOpeningIntent` in `domain/drillMetadata.ts`);
  // `externalFocusCue` substitutes for the drill's own cue as the live
  // "Now" cue (D176, via `resolveBlockLiveCueOverride`); `reflection`
  // is the Drill Check pull-to-reveal After beat (via
  // `resolveBlockRungReflection`).
  /** What this rung trains, in contextual-interference terms (D68), never physiological load (D149). */
  readonly intent: string
  /**
   * The one external-focus attention prompt that makes this rung a real
   * step (Wulf; courtside-copy rule 12b). Names an outcome or
   * environmental referent (ball flight, target, landing, partner
   * reach), never a body part or internal sensation.
   */
  readonly externalFocusCue: string
  /**
   * Process-framed "see how it feels" read. Exploratory and
   * user-owned — never a coach-graded pass/fail threshold (D154 gating
   * stays retired; coach-pedagogy evidence: pass/fail backfires
   * coachlessly). No "%", "graded", "must", or pass/fail vocabulary.
   */
  readonly explorationCriterion: string
  /**
   * The felt readiness-to-step signal for this rung. Descriptive only:
   * movement stays user-accepted via the review verdict (D154). Never a
   * gate, never auto-promotion. The ladder-top rung describes staying
   * and deepening rather than stepping.
   */
  readonly graduationFeel: string
  /**
   * The backward-looking "what that rep was doing to you" line revealed
   * on Drill Check behind the pull affordance (the coaching arc's After
   * beat). One calm past-facing sentence naming the rung's mechanism or
   * effect as felt work: never a judgment of how the rep went (D154),
   * no rung numbers (D157), and never a tense-flip of `intent` or a
   * restatement of `explorationCriterion` / a rung drill's success rule
   * (the distinct-from-siblings rule in
   * `docs/specs/stress-rung-taxonomy.md`).
   */
  readonly reflection: string
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
    // d52: pure continuous control exchange (BAB Plan 1) beside d01's slap-hands interrupt.
    {
      rung: 1,
      drillIds: ['d01', 'd02', 'd04', 'd52'],
      intent: 'Groove a repeatable pass on a steady feed.',
      externalFocusCue: 'Send the ball straight back up to the same height every time.',
      explorationCriterion:
        'Notice how little you have to move when you meet the ball out in front of you.',
      graduationFeel:
        'The ball returns to the same height almost without thinking, and a steadier rhythm would feel welcome rather than rushed.',
      reflection: 'That rep was wiring in one default contact your body can find on its own.',
    },
    // d06: fixed set-window target beside its chain-2 sibling d05; d19: controlled-input butterfly rotation — serial rhythm.
    {
      rung: 2,
      drillIds: ['d03', 'd05', 'd06', 'd19'],
      intent: 'Hold pass quality through a steady rhythm.',
      externalFocusCue:
        'Float each pass to the same spot in the air where a setter would stand (about 3 m off the net).',
      explorationCriterion:
        'See whether your passes stay matched as the rally lengthens, or start to wander once you tire.',
      graduationFeel:
        'The rally feels easy to sustain, and you find yourself wanting the ball to come from somewhere new.',
      reflection: 'That rep was training your pass to survive being needed again right away.',
    },
    // d12/d13/d14: chain-3 movement courses beside d09/d10; d16: defined-sequence footwork (one below d15's reactive read);
    // d17: two-role coordination off serve/toss; d24: move-to-ball corner targeting — varied movement/perception.
    {
      rung: 3,
      drillIds: ['d07', 'd09', 'd10', 'd12', 'd13', 'd14', 'd16', 'd17', 'd24'],
      intent: 'Read, move, and still pass to one target.',
      externalFocusCue: 'Pick the landing spot early and arrive before the ball does.',
      explorationCriterion:
        'See how reading the flight sooner gives you time to square up to your target.',
      graduationFeel:
        'You are reading and arriving in time on most balls, and a real served ball would feel like the natural next test.',
      reflection:
        'That rep was teaching your feet to do most of the passing before your arms touch the ball.',
    },
    // d20: live serve receive inside a pass-set-attack continuity constraint; d21: 500's scored anticipation reads — reactive/outcome pressure beside d11/d15.
    {
      rung: 4,
      drillIds: ['d11', 'd15', 'd20', 'd21'],
      intent: 'Keep control when the tool or time is taken away.',
      externalFocusCue: 'Guide the ball back to your target even on the emergency play.',
      explorationCriterion: 'Notice what still works when you cannot get set early.',
      graduationFeel:
        'Emergency plays feel recoverable, and a live server reading you back would feel exciting rather than overwhelming.',
      reflection:
        'That rep was building the scrappy version of your pass that real rallies actually ask for.',
    },
    // d08: live serve receive under +3/−3 stakes beside d18/d46 — live-read.
    {
      rung: 5,
      drillIds: ['d08', 'd18', 'd46', 'd50'],
      intent: 'Read and pass a real serve at game speed.',
      externalFocusCue:
        'Track the contact and the spin, then send it to the set window (about 3 m off the net).',
      explorationCriterion:
        'See how committing to your read early changes how clean the pass feels, even when you guess wrong.',
      graduationFeel:
        'You are reading live serves at speed. Stay here and keep inviting new servers, spins, and conditions to keep it honest.',
      reflection:
        'That rep was training your eyes against a live server, the one thing a friendly feed can never fake.',
    },
  ],
  serve: [
    // d53: deep high-arc serve to one held zone (FIVB 2.3) beside d31's pinpoint small-circle target.
    {
      rung: 1,
      drillIds: ['d31', 'd53'],
      intent: 'Commit to one target and groove the same serve.',
      externalFocusCue: 'Land the ball in the same circle on the sand each time.',
      explorationCriterion: 'Notice how a steady toss in front of you makes the contact repeatable.',
      graduationFeel:
        'Your serve lands near the circle most tries, and stringing several zones together would feel doable.',
      reflection:
        'That rep was building the one serve you can trust before you ever start varying it.',
    },
    // d23: full-routine serial reps; the dash is body load, not contextual interference (D149 keeps load off this scale).
    // d54: serial four-zone sequence (BAB Around the World, 4-zone beginner) beside d51's single no-serve heart zone.
    {
      rung: 2,
      drillIds: ['d23', 'd51', 'd54'],
      intent: 'Hold serve quality across zones in sequence.',
      externalFocusCue: 'Place each serve into the next zone in order, keeping the same easy contact.',
      explorationCriterion:
        'See whether your rhythm holds as the rounds add up, or your contact changes when you push for more pace.',
      graduationFeel:
        'Rhythm holds across rounds, and aiming at a scored target would feel like a welcome challenge.',
      reflection: 'That rep was teaching you to change targets without changing your swing.',
    },
    // d55: called single-target serve under +/- pressure (BAB Server vs Passer) beside d22's multi-zone points race.
    {
      rung: 3,
      drillIds: ['d22', 'd55'],
      intent: 'Serve to a called target under light pressure.',
      externalFocusCue: 'Aim past the passer to the open zone, not just over the net.',
      explorationCriterion:
        'Notice how aiming at a spot, rather than just in, changes where your misses go.',
      graduationFeel:
        'You are hitting called zones under a little pressure, and a live receiver reading you would feel like the real test.',
      reflection:
        'That rep was training your serve routine to hold steady while something rode on the result.',
    },
    // d08: serving into live receive with error scoring — rung 4's "serve into live receive" signature beside d18.
    {
      rung: 4,
      drillIds: ['d08', 'd18', 'd33'],
      intent: 'Serve into a live receiver you do not control.',
      externalFocusCue: 'Pick the zone that pressures the receiver before you toss.',
      explorationCriterion:
        'See how serving at a target instead of at the court feels under the back-and-forth of a live point.',
      graduationFeel:
        'You are serving into live receivers with intent. Stay here and keep varying zones, receivers, and stakes.',
      reflection:
        'That rep was turning your serve into a move against a real opponent, not just a spot of sand.',
    },
  ],
  set: [
    {
      rung: 1,
      drillIds: ['d38', 'd39', 'd40'],
      intent: 'Build a clean set shape on a steady toss.',
      externalFocusCue: 'Release the ball softly to the same height above you every time.',
      explorationCriterion: 'Notice how a quiet, even contact sends the ball straight up without spin.',
      graduationFeel:
        'The set shape repeats cleanly, and keeping a continuous rally going would feel natural.',
      reflection:
        'That rep was carving the hand position every set you hit from here on will start from.',
    },
    // d56: solo continuous-rhythm self-set route (FIVB 4.1 Set and Move) beside the pair-only d41.
    {
      rung: 2,
      drillIds: ['d41', 'd56'],
      intent: 'Hold the set shape through a continuous rally.',
      externalFocusCue: 'Float each set so your partner barely moves to reach it.',
      explorationCriterion:
        'See whether the rally stays smooth as it lengthens, or the ball starts to lead your partner.',
      graduationFeel:
        'The rally stays smooth, and setting from new spots to new targets would feel like the next step.',
      reflection:
        'That rep was training you to reset your base before every touch, not just the first one.',
    },
    // d57: changing/random targets while moving (FIVB 4.4 reduced) beside d42's two fixed corners.
    {
      rung: 3,
      drillIds: ['d42', 'd57'],
      intent: 'Set to changing targets from changing spots.',
      externalFocusCue: 'Square up to the target before the ball arrives.',
      explorationCriterion: 'Notice how arriving early and facing the target changes how settable the ball lands.',
      graduationFeel:
        'You arrive and square up in time, and solving messier passes would feel like a fair challenge.',
      reflection:
        'That rep was untying your set from any one spot, so the same delivery travels with you.',
    },
    // d20: setting off live-ish passes in continuity flow; d21: 500's scored chaotic entries — reactive/graded beside d47.
    // d58: pass-to-self then choose bump/hand, reducible to pair (BAB Plan 6 Drill 2) beside d47's four pass locations.
    {
      rung: 4,
      drillIds: ['d20', 'd21', 'd47', 'd58'],
      intent: 'Bump or hand set from imperfect passes.',
      externalFocusCue: 'Send the ball to the same hittable spot wherever the pass pulls you.',
      explorationCriterion: 'See which option keeps the set clean when the pass is off.',
      graduationFeel:
        'You keep sets hittable from imperfect passes, and live scramble play would feel like the real game.',
      reflection:
        'That rep was training the split-second choice between hands and bump, not just the touch that follows it.',
    },
    {
      rung: 5,
      drillIds: ['d48', 'd49'],
      intent: 'Set under chaos, then recover for the next ball.',
      externalFocusCue: 'Put the ball where your hitter is going, then find your base again.',
      explorationCriterion:
        'Notice how committing to a target early lets you recover faster for the next play.',
      graduationFeel:
        'You are setting under live chaos and recovering. Stay here and keep raising the speed and disorder.',
      reflection:
        'That rep was teaching you that the set is never the end of your play, only the middle of it.',
    },
  ],
}

/** The authored rung for a drill within a focus; undefined off-ladder. */
export function stressRungForDrill(focus: StressLadderFocus, drillId: string): number | undefined {
  for (const rung of STRESS_LADDERS[focus]) {
    if (rung.drillIds.includes(drillId)) return rung.rung
  }
  return undefined
}

/** The full rung object for a focus + ordinal rung index; undefined when out of range. */
export function getStressRung(focus: StressLadderFocus, rung: number): StressRung | undefined {
  return STRESS_LADDERS[focus].find((r) => r.rung === rung)
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
