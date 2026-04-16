---
id: periodization-post-framework
title: Periodization via PoST Framework (Phase 1.5 stub)
status: draft
stage: planning
type: research
authority: Phase 1.5 periodization vocabulary stub; maps Otte's PoST stages onto our archetype and adaptation vocabulary
summary: "Phase 1.5 stub: maps Coordination -> Skill Adaptability -> Performance onto our archetypes and adaptation rules; landing place for O2 multi-week planning work."
last_updated: 2026-04-16
depends_on:
  - docs/research/beach-training-resources.md
  - docs/specs/m001-adaptation-rules.md
  - docs/decisions.md
related:
  - docs/research/README.md
---

# Periodization via PoST Framework (Phase 1.5 stub)

## Status

**Stub.** This note is intentionally thin. It exists so the PoST periodization framework has a durable landing place when `O2` (how opinionated should early multi-week planning be?) activates. Do not expand this note into a full planning spec until `M001` clears `D91` and Phase 1.5 multi-week planning enters scope.

## Use This Note When

- `O2` becomes active and Phase 1.5 multi-week planning needs a vocabulary anchor
- a serve or set skill track enters planning and benefits from stage-based framing
- any downstream note wants to reference PoST without duplicating its definition

## Not For

- current `M001` session-level adaptation (already owned by `docs/specs/m001-adaptation-rules.md`)
- replacing `progress/hold/deload` as the microcycle governor
- generating prescriptive 12-week calendars before retention is proven

## Source

Otte et al. — "Skill Training Periodization in 'Specialist' Sports Coaching — An Introduction of the 'PoST' Framework for Skill Development" (Frontiers in Sports and Active Living). Companion paper: "When and How to Provide Feedback and Instructions to Athletes?" (Frontiers in Psychology). Both are cited in `docs/research/beach-training-resources.md` "Skill acquisition principles sources (2026-04-16)".

## One-paragraph summary

PoST proposes three recurring training stages: **Coordination Training** stabilizes a functional movement solution in a simplified task; **Skill Adaptability Training** widens the solution set under realistic information complexity and perceptual load; **Performance Training** adds competition-speed, time-pressured, tactical execution. The three stages are not a fixed calendar; athletes move between them as conditions demand. The framework sits on ecological-dynamics and constraint-led foundations and is compatible with deliberate practice when deliberate practice is framed as goal-directed, feedback-rich, error-correcting work rather than volume.

## Mapping onto our vocabulary

| PoST stage | Our closest existing concept | Short gloss |
|---|---|---|
| Coordination Training | Beginner-biased archetypes, blocked reps, high target-hit gating | Stabilize one reliable movement solution per skill family before adding chaos |
| Skill Adaptability Training | Constraint-led variants, wind-adjusted drills, feed-type variation, representative reads | Preserve real perception-action coupling; vary the task, not the goal |
| Performance Training | Pair + live-serve archetype, scored sideout games, transition chains | Score, time, and tactical pressure over reliable-enough technique |

At the macro level, the three PoST stages are a **3-state governor** with the same shape as our `progress/hold/deload` **micro governor**. That symmetry is the main design value: if we adopt PoST at the block/week level, we can reuse our existing decision model mental structure rather than inventing a new one.

## What this stub must answer when activated

These questions are parked until `O2` becomes active. Do not resolve them now.

1. **Stage assignment.** How does the planner decide which stage a given skill family is in for a given user? (Proposed starting heuristic: per-skill stage, not per-session; driven by trailing hit-rate under the current constraint class, not by calendar weeks.)
2. **Stage progression.** What is the Coordination -> Skill Adaptability threshold? The Skill Adaptability -> Performance threshold? Candidates: a retention test (hit rate held across 2 different-day sessions under slight contextual variation), or a target variance band (stable output under varied inputs).
3. **Stage regression.** When does the planner move a user back a stage? Proposed: same `deload` triggers from `docs/specs/m001-adaptation-rules.md` (incomplete sessions for fatigue/pain, sRPE `>= 9`, hit rate below floor on scored block).
4. **Cross-skill interactions.** Serve, receive, set, attack, block, defense can sit at different stages simultaneously. How does the planner budget session time across skills in different stages without overloading total sRPE-load (`D84`)?
5. **Relationship to weekly receipt (`D74`).** Does the weekly receipt surface the user's stage per skill? If yes, how is it worded for self-coached amateurs without introducing coaching jargon?
6. **Representative-practice budget.** What minimum share of a session must preserve real perception-action information (pair + net, live-serve, etc.) before a skill can be meaningfully called "Performance" stage? Wall and self-toss drills structurally cannot reach Performance stage for serve-receive.
7. **Retention-and-transfer assessment cadence.** How often should a scored retest block appear under slightly varied constraints, and does its outcome feed the stage transition or stay as a standalone signal?

## Related decisions and open questions

- `O2` — opinionatedness of early multi-week planning
- `D22` — Phase 1 longitudinal planning stays shallow
- `D67` — 3-4 session archetypes (the existing stage-agnostic structural vocabulary)
- `D68` — blocked early, variable later within a session (the session-level analogue of Coordination -> Adaptability ordering)
- `D63` — one dimension per progression step (keeps stage transitions legible)
- `D74` — Phase 1 weekly receipt (possible surface for stage visibility)

## Change log

- 2026-04-16 — stub created from the "Skill acquisition principles synthesis (2026-04-16)" pass in `docs/research/beach-training-resources.md`. No implementation work implied; landing place for `O2` when activated.
