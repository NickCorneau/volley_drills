---
id: brainstorm-stress-substrate
title: Stress Substrate — First-Class Stress Rungs for Internal Progression
status: complete
stage: implemented
type: requirements
date: 2026-06-11
topic: stress-substrate
summary: "Annotate every pass/serve/set drill with an ordinal stress rung, derive per-skill ladder position by replaying accepted verdicts, and make accepted more/less-stress deltas act on session assembly. Internal-only; no new UI. Consumed planning history: shipped 2026-06-11 as D154 via docs/plans/2026-06-11-001-feat-stress-substrate-plan.md."
authority: requirements input for the stress-substrate plan; subordinate to docs/decisions.md and the M002 series requirements
last_updated: 2026-06-11
depends_on:
  - docs/brainstorms/2026-06-03-m002-thin-spine-and-milestone-series-requirements.md
  - docs/decisions.md
---

# Stress Substrate — Requirements

## Summary

Make "stress" a first-class internal concept: every pass/serve/set drill carries an ordinal **stress rung** (static catalog content, taxonomy fixed by a short brief first), the user's per-skill ladder position is **derived by replaying accepted verdicts**, and an accepted "more/less stress" delta finally **acts** — the next session on that focus assembles one rung up or down. No new user-facing UI; the existing carry-forward line stays the only visible trace.

## Problem Frame

M002.1 shipped the sense-and-show half of adaptation: per-drill difficulty captures and session RPE derive an `AdaptationDelta`, the user accepts or keeps it at Review, and Home shows the carry-forward. The accepted delta then does nothing — `D152` names this gap: "a user who accepted 'a bit more stress on passing' and taps 'Start passing session' gets a standard assembly." The launch CTA sharpened the promise; nothing cashes it.

The series requirements already chose "Stress" (BAB-camp progressive contextual interference, `D68`) as the organizing primitive for the M002 spine, with stress *vocabulary* shipped in v1 and stress *content* deferred to M002.2. The catalog meanwhile carries four latent difficulty-adjacent dimensions — player bands (live), dormant `ProgressionChain` links with pass/fail gating (validation-only, never consumed at runtime), per-variant RPE envelopes, and the delta vocabulary — with no unifying ordering. External prior art (TrainerRoad's Workout/Progression Level pair; the challenge point framework's nominal/functional difficulty split) converges on the same two-part model the repo's own constraints dictate: a fixed ordinal annotation per catalog entry plus a derived per-skill athlete position. No volleyball product closes this loop; grading is static everywhere.

## Key Decisions

- **Internal-first.** The stress rung is an assembly/progression substrate, not a user-facing number. Exposure stays a later option. The shipped carry-forward vocabulary ("a bit more stress on passing") remains the only visible trace. Consistent with `D149`'s demotion of load to backend-only.
- **A ladder is an ordering over existing catalog drills within a skill.** Rungs are different drills (toss+pass → continuous pass → serve receive), not variant knobs. The dormant `ProgressionChain` orderings inform initial rung assignments; their Bayesian/pass-fail gating philosophy is retired (coach-graded gates backfire for the self-coached — pedagogy canon).
- **Captures propose, the user disposes.** Position moves only when the user accepts a verdict — the shipped M002.1 accept/keep loop gains teeth, no new interaction model. An accepted delta is a standing position move, not a one-shot modifier. No auto-movement.
- **All three focuses, thin.** Pass, serve, and set each get a 4–6 rung ladder ordered from existing drills, so every accepted delta can act. Gap-filler drills are authored only where a ladder is too sparse to step.
- **Substrate now, content depth later.** This builds the annotation + position + assembly mechanics (approach A). M002.2's cue/criterion depth per rung attaches to the same ordering later without rework.
- **Derive, don't persist.** Rung annotations are static content in the drill catalog (no Dexie migration). Ladder position is a pure replay over existing `SessionReview` records (`verdictChoice`), clearing `D150`'s persistence floor with zero new writes.
- **Taxonomy before catalog edits.** The first deliverable is the just-in-time stress-rung taxonomy brief `D149` already queued — what the rung scale means, anchored in progressive contextual interference — so rung numbers are authored judgments against a fixed scale, not ad hoc.

## Requirements

**Substrate**

- R1. A short stress-rung taxonomy brief defines the ordinal scale (anchors per rung level, grounded in progressive contextual interference) before any catalog annotation.
- R2. Every catalog drill whose `skillFocus` includes pass, serve, or set carries a stress rung consistent with the taxonomy.
- R3. Catalog validation enforces rung presence and ladder steppability: each focus ladder has at least 4 distinct rung levels with at least one drill per level.

**Position and movement**

- R4. Per-focus ladder position is derived at read time by replaying accepted verdicts; no position is persisted.
- R5. The starting position for a focus with no accepted verdicts maps from the onboarding skill band.
- R6. Accepting a `more` delta moves the focus position one rung up; accepting a `less` delta moves it one rung down; keep-original moves nothing. Positions clamp at ladder ends.
- R7. Position derivation is deterministic and pure (same records, same position) per `P7` and `D150`.

**Assembly consumption**

- R8. Session assembly's focus-controlled main-skill selection prefers drills at the focus's current rung.
- R9. When no rung-matching drill fits the session context (equipment, players, time), assembly falls back to the nearest-rung compatible drill rather than failing.
- R10. The focus-steered Home launch and Setup-built sessions consume the same rung preference; Repeat stays verbatim (no rung re-steer).

**Exposure and instrumentation**

- R11. No new user-facing stress surface. The existing carry-forward line remains the only visible trace of stress movement.
- R12. The founder diagnostic read (current positions per focus, rung of each assembled main drill) is available through the existing export/diagnostics pathway, not a new UI.

**Constraints**

- R13. No Dexie schema change and no new capture fields (`D150`, `D151`).
- R14. Drill courtside copy surfaces are untouched; the rung is assembly metadata, never rendered copy (courtside-copy invariants).

## Acceptance Examples

- AE1. **Covers R6, R8.** User accepts "a bit more stress on passing" at Review. The next passing session's main-skill block is a drill one rung above the previous passing session's rung. **Covers R11:** the only UI difference is the already-shipped carry-forward line.
- AE2. **Covers R6.** User keeps original. The next passing session assembles at the unchanged rung.
- AE3. **Covers R9.** Position is rung 4 but the user has no partner today and all rung-4 passing drills need a partner: assembly selects the nearest compatible rung's drill instead of failing or silently resetting position.
- AE4. **Covers R6.** Position is at the top rung and the user accepts `more`: position stays clamped; the verdict still records normally.
- AE5. **Covers R4.** Deleting nothing and adding no new records, two consecutive Home loads derive identical positions.

## Scope Boundaries

**Deferred for later**

- User-facing ladder/level exposure (a later option once the substrate has dogfood evidence).
- Per-rung external-focus cues and "see how it feels" criteria — M002.2 proper.
- Rung-clear scoring / the objective "1% better" signal — M002.3's seam.
- Attack/tactics ladders — M002.6 consumes the primitive.
- Authoring the missing rung drills from the founder's example ladder (6-legged monster, pass-to-setter-to-hit); they become named authoring backlog.

**Outside this feature's identity**

- Physiological load management semantics — stress here is skill-side contextual interference, never sRPE re-parameterization.
- Auto-movement of position without user acceptance.
- Evidence-gated pass/fail progression (the retired `ProgressionChain` gating philosophy).

## Dependencies / Assumptions

- The taxonomy brief (R1) is the first unit of work and gates catalog annotation.
- Assumption to verify at plan time: existing pass/serve/set drills suffice for 4–6 steppable rungs per focus under common contexts (solo/pair × wall/net); where they don't, R9's nearest-rung fallback covers v1.
- Sequencing: this pulls M002.2's substrate forward ahead of formal roadmap reconciliation — founder-authorized in-session (the `/lfg` dispatch on the confirmed synthesis).
- `D152`'s named gap is the debt this retires; its docs trail should be closed in the same change.

## Outstanding Questions

**Deferred to planning**

- Whether the rung lives on the drill or the variant (drill-level is simpler; variant-level only if a drill's variants genuinely differ in stress).
- The exact skill-band → starting-rung mapping.
- Whether `attributeTrainedSessions` or the review-eligible basis feeds any rung-adjacent read (position replay uses accepted verdicts only; no second basis expected).

## Sources

- `docs/brainstorms/2026-06-03-m002-thin-spine-and-milestone-series-requirements.md` — the series scoping; M002.2 stress ladders; hybrid spine.
- `docs/decisions.md` — `D68` (progressive CI), `D149` (hybrid spine + taxonomy-brief gate), `D150` (derive-don't-persist), `D151` (no readiness capture), `D152` (the named delta-not-applied gap).
- `app/src/data/progressions.ts`, `app/src/types/drill.ts` — dormant chains, player bands, variant envelopes.
- `docs/solutions/2026-05-04-source-backed-content-depth-activation-pattern.md` — the validated catalog-change recipe.
- `docs/solutions/design-patterns/low-dose-self-coached-progress-signal-design.md` — behavioral-primary constraint; inherited-name trap.
- External prior art digest (2026-06-11 research pass): TrainerRoad Workout/Progression Levels; challenge point framework (nominal vs functional difficulty); ladder-thrash hysteresis; static-only volleyball grading.
