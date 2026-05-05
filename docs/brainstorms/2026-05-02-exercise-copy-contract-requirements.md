---
id: exercise-copy-contract-requirements-2026-05-02
title: Exercise Copy Contract Requirements
status: active
stage: validation
type: requirements
summary: "Requirements for reviewing and improving active drill explainers, instructions, success rules, cues, and scaling copy without changing catalog behavior."
date: 2026-05-02
topic: exercise-copy-contract
---

# Exercise Copy Contract Requirements

## Problem Frame

Volleycraft's exercise catalog can be structurally valid while still asking a tired player to decode dense, coach-written prose on a phone courtside. This work should turn the selected catalog-gap ideation continuation into a practical copy-quality contract, then use it to review and improve active exercise explainers, instructions, success rules, cues, and scaling copy without expanding drill scope or making unsupported training claims.

---

## Actors

- A1. Courtside player: reads the active drill on a phone and needs to know what to do next, what counts, and how to adjust.
- A2. Future catalog author: adds or edits drill content and needs a compact standard for writing exercise text.
- A3. Reviewing agent or maintainer: checks copy changes against product constraints, metadata envelopes, and tests.

---

## Key Flows

- F1. Copy review pass
  - **Trigger:** A maintainer or agent reviews the active drill catalog for instruction quality.
  - **Actors:** A2, A3
  - **Steps:** Read each active exercise's purpose, instruction, success rule, cues, and scaling text; check it against the writing principles; decide whether the issue is copy-only, metadata/envelope, source-depth, or no change.
  - **Outcome:** Active exercise copy is clearer where copy-only fixes are safe, and larger catalog/source questions remain explicitly out of scope.
  - **Covered by:** R1, R2, R3, R6
- F2. Courtside reading
  - **Trigger:** A player starts or expands a drill during a session.
  - **Actors:** A1
  - **Steps:** The first instruction tells the player what skill/action to perform; setup and roles are discoverable without rereading; the success rule explains what counts; cues reinforce one actionable idea.
  - **Outcome:** The player can start the next ball quickly and self-score without coach interpretation.
  - **Covered by:** R1, R3, R4, R5

---

## Requirements

**Writing contract**
- R1. Active exercise instructions must lead with the trained action whenever the drill trains a visible skill, then separate setup, action loop, scoring/stop rule, cue, and scaling ideas in plain courtside language.
- R2. The requirements output must preserve a reusable principle set for future catalog edits, not just a one-time prose rewrite.
- R3. The review must distinguish copy-only fixes from metadata, workload, source-depth, or generator-policy questions; copy must not patch or hide structural catalog problems.

**Runtime clarity**
- R4. Success and stop language must make it clear what counts, how long or how many reps matter, and when to reset, switch, or stop.
- R5. Coaching cues must prefer observable outcomes and one physical idea at a time, while retaining necessary safety or beginner technique guidance when plain-language glosses are needed.
- R6. Variant copy must remain honest to participants, equipment, environment, feed type, workload, fatigue cap, and timed segments.

**Quality guardrails**
- R7. Automatable principles should be covered by focused catalog tests where practical; subjective writing quality should remain a checklist item instead of brittle snapshots.
- R8. The pass must include warmup, cooldown, bonus, segment, progression, and regression copy with the same care as main-skill instructions.

---

## Acceptance Examples

- AE1. **Covers R1, R4.** Given an active serving drill, when the player reads the first instruction, it starts with a serving action and states what counts before adding secondary logistics.
- AE2. **Covers R3, R6.** Given a variant whose copy implies equipment or partner behavior not present in its metadata, when the review runs, the change is either corrected as copy-only or deferred as a metadata/source-depth issue instead of silently broadening the drill.
- AE3. **Covers R5.** Given a cue with stacked internal body mechanics, when it is rewritten, it becomes one observable target or outcome unless the body cue is necessary for safe beginner execution.
- AE4. **Covers R7.** Given a principle that can be checked mechanically, such as no em dashes in runtime copy or skill-action-first opening for active skill drills, when implementation lands, a focused test guards it.

---

## Success Criteria

- A courtside player can scan each active exercise and understand the next action, setup, success rule, and main cue without paragraph parsing.
- Future catalog work has a short principle set that makes new drill copy easier to write and review.
- Implementation planning can proceed without inventing product behavior, scope boundaries, or success criteria.
- Tests guard the stable, mechanical parts of the copy contract without pretending to judge all prose quality.

---

## Scope Boundaries

- Do not add new drills, variants, metrics, or session-builder behavior as part of this pass.
- Do not widen workload, fatigue, equipment, source, or participant envelopes to make copy easier.
- Do not create a new drill-card UI, generated preview surface, or broad diagnostics dashboard.
- Do not treat external coaching sources as authorizing new catalog content unless a separate source-backed catalog workflow admits it.
- Do not rewrite inactive reserve drills unless active copy references or shared tests require it.

---

## Key Decisions

- Use the existing catalog as the source of truth for this pass: The goal is to make current active exercises clearer, not to author new training content.
- Keep the contract field-aware but schema-light: The app already has fields for purpose, instructions, cues, metrics, segments, and scaling, so the writing contract should map onto those fields without requiring a schema migration.
- Prefer targeted tests over snapshots: Mechanical invariants are worth guarding, while prose quality still needs human review.

---

## Dependencies / Assumptions

- The active exercise catalog is the immediate review target.
- Existing courtside-copy rules and catalog validation tests remain authoritative constraints.
- External research informs writing principles, but local product constraints decide whether a copy change is allowed.

---

## Outstanding Questions

### Resolve Before Planning

- None.

### Deferred to Planning

- [Affects R7][Technical] Which copy principles are stable enough for tests versus a checklist?
- [Affects R1, R6][Technical] Whether the implementation should edit only `courtsideInstructions` first or also objectives, teaching points, success metric descriptions, cues, and progression/regression fields in the same pass.

---

## Next Steps

-> /ce-plan for structured implementation planning.
