---
id: exercise-copy-contract-plan-2026-05-02
title: "feat: Exercise Copy Contract"
type: feat
status: complete
stage: validation
summary: "Implementation plan for extending the courtside-copy contract, testing mechanical copy invariants, and auditing active drill copy without changing catalog behavior."
date: 2026-05-02
origin: docs/brainstorms/2026-05-02-exercise-copy-contract-requirements.md
---

# feat: Exercise Copy Contract

## Overview

Create a reusable exercise-copy contract for the active drill catalog, apply it to active exercise explainers and instructions, and add focused tests for the parts that can be checked mechanically. The work is copy-only: it must not add drills, alter metadata envelopes, or change session assembly behavior.

---

## Problem Frame

The active catalog can be structurally valid while still asking a player to parse dense, coach-authored prose during a session. The origin requirements frame this as a trust and usability problem: each active exercise should quickly answer what to do now, what setup is required, what counts, what cue to carry, and how to scale it, without smuggling in unsupported training claims.

---

## Requirements Trace

- R1. Active exercise instructions lead with the trained action and separate setup, action loop, success/stop, cue, and scaling ideas.
- R2. A reusable principle set exists for future catalog edits.
- R3. Copy-only fixes stay separate from metadata, workload, source-depth, or generator-policy questions.
- R4. Success and stop language clearly states what counts, duration/reps, and reset/switch/stop behavior.
- R5. Coaching cues prefer observable outcomes and one physical idea at a time, with plain safety/technique glosses when needed.
- R6. Variant copy stays honest to participants, equipment, environment, feed type, workload, fatigue cap, and timed segments.
- R7. Automatable principles have focused tests where practical; subjective prose quality remains a checklist.
- R8. Warmup, cooldown, bonus, segment, progression, and regression copy receive equal review care.

**Origin actors:** A1 courtside player, A2 future catalog author, A3 reviewing agent or maintainer
**Origin flows:** F1 copy review pass, F2 courtside reading
**Origin acceptance examples:** AE1, AE2, AE3, AE4

---

## Scope Boundaries

- Do not add new drills, variants, metrics, or session-builder behavior.
- Do not change `workload`, `fatigueCap`, `participants`, `equipment`, `environmentFlags`, `skillFocus`, `m001Candidate`, or progression graph semantics.
- Do not create a new drill-card UI, generated preview surface, or diagnostics dashboard.
- Do not rewrite inactive reserve drills unless an active copy invariant or shared test requires touching them.
- Do not encode subjective writing quality as brittle snapshots or exact full-sentence tests.

---

## Context & Research

### Relevant Code and Patterns

- `.cursor/rules/courtside-copy.mdc` owns current courtside copy invariants: one-season rec-player language, no em dashes, enumerated plain text, skill-verb-first instructions, cooldown care, and timed sub-block copy.
- `app/src/types/drill.ts` defines the exercise copy surfaces: `objective`, `teachingPoints`, `progressionDescription`, `regressionDescription`, `successMetric`, `courtsideInstructions`, `courtsideInstructionsBonus`, `coachingCues`, and `segments`.
- `app/src/data/drills.ts` is the active catalog source. The implementation should focus on `m001Candidate: true` drills.
- `app/src/data/__tests__/drillCopyRegressions.test.ts` is the right home for focused mechanical copy invariants.
- `app/src/data/__tests__/catalogValidation.test.ts` guards structural catalog rules and should remain focused on schema/envelope validity.

### Institutional Learnings

- Diagnostics are evidence, not edit authorization; copy fixes must not hide source-depth, workload, or generator-policy issues.
- Recent source-backed catalog work established that copy must match workload truth and participant/equipment reality.
- Existing tests favor narrow regression pins and mechanical invariants over broad prose snapshots.

### External References

- Exercise and work-instruction patterns from the ideation pass support a stable `Why / Setup / Do / Score or Stop / Cue / Scale` mental order, one action per sentence, external-focus cues, concrete scoring, and safety/setup checks before action.

---

## Key Technical Decisions

- Update the existing courtside-copy rule instead of creating a second style guide: It is already the canonical author-facing contract for catalog and run-surface copy.
- Keep implementation copy-only: Any discovered mismatch that requires metadata, workload, source-backed content, or session-builder changes should be deferred rather than patched with prose.
- Test only stable mechanical rules: no em dashes, active runtime copy completeness, skill-verb-first openings, and other low-false-positive checks belong in Vitest; tone and clarity stay human-reviewed.

---

## Open Questions

### Resolved During Planning

- Which principles should be automated? Only stable mechanical rules with low false-positive risk: punctuation, non-empty active copy fields, skill-action-first openings already covered, and obvious active runtime text completeness.
- Which fields should be reviewed in this pass? All active drill text surfaces: objective, teaching points, progression/regression descriptions, success metric description/target, courtside instructions, bonus copy, cues, and segment labels.

### Deferred to Implementation

- Exact copy edits per drill: The implementer should audit the live strings and edit only copy-only issues that are clear from the catalog context.
- Whether any subjective principle deserves a future test: Decide after the first rewrite shows a stable pattern.

---

## Implementation Units

- [x] U1. **Extend the copy contract**

**Goal:** Add the exercise-copy contract principles to `.cursor/rules/courtside-copy.mdc` so future drill edits have a durable checklist.

**Requirements:** R1, R2, R3, R4, R5, R6, R8

**Dependencies:** None

**Files:**
- Modify: `.cursor/rules/courtside-copy.mdc`

**Approach:**
- Add a compact section mapping `Why / Setup / Do / Score or Stop / Cue / Scale` to the existing drill fields.
- Clarify that the principles apply to active exercise copy without authorizing new drills or metadata/workload edits.
- Add checklist items for envelope honesty, success rule clarity, one physical idea per cue, and warmup/cooldown/segment equal care.

**Patterns to follow:**
- Existing invariant sections and authoring checklist in `.cursor/rules/courtside-copy.mdc`.

**Test scenarios:**
- Test expectation: none -- documentation/rule update only.

**Verification:**
- The rule file gives future authors enough guidance to review active exercise copy without consulting this plan.

---

- [x] U2. **Add mechanical copy invariant tests**

**Goal:** Guard stable copy principles in `drillCopyRegressions.test.ts` without snapshotting prose quality.

**Requirements:** R2, R7, AE4

**Dependencies:** U1

**Files:**
- Modify: `app/src/data/__tests__/drillCopyRegressions.test.ts`
- Test: `app/src/data/__tests__/drillCopyRegressions.test.ts`

**Approach:**
- Add a helper that collects active, user-visible drill copy fields from `m001Candidate: true` drills.
- Add tests for mechanical invariants that current and rewritten catalog copy should satisfy, such as no em dashes across active runtime copy fields and non-empty active success metric descriptions.
- Avoid exact sentence snapshots and subjective readability assertions.

**Execution note:** Write or adjust tests before the broad copy sweep so failures identify the concrete mechanical gaps.

**Patterns to follow:**
- Existing focused tests in `app/src/data/__tests__/drillCopyRegressions.test.ts`.

**Test scenarios:**
- Covers AE4. Happy path: every active runtime copy field contains no em dash.
- Covers AE4. Happy path: every active variant has a non-empty success metric description.
- Edge case: optional bonus copy and segment labels are included only when present.

**Verification:**
- Copy regression tests enforce mechanical invariants and do not fail because of subjective prose choices.

---

- [x] U3. **Audit and rewrite active exercise copy**

**Goal:** Apply the copy contract to active drills, improving explainers, instructions, success rules, cues, segments, bonus copy, and scaling copy where copy-only fixes are safe.

**Requirements:** R1, R3, R4, R5, R6, R8, AE1, AE2, AE3

**Dependencies:** U1, U2

**Files:**
- Modify: `app/src/data/drills.ts`
- Test: `app/src/data/__tests__/drillCopyRegressions.test.ts`
- Test: `app/src/data/__tests__/catalogValidation.test.ts`

**Approach:**
- Review active `m001Candidate: true` drills field-by-field.
- Prefer first-sentence action clarity, concrete success/stop language, plain beginner glosses, and outcome-focused cues.
- Keep all metadata, workload, participant, equipment, and progression semantics unchanged.
- If a copy issue points to a structural mismatch, leave the structural change out of scope and record it in the final summary rather than forcing a copy workaround.

**Execution note:** Characterization-first for the broad sweep: use U2 tests plus existing catalog validation as guardrails before editing copy.

**Patterns to follow:**
- Existing lead-with-skill invariant and d26/d33 copy regression tests.
- Existing source-backed comments and workload-envelope discipline in `app/src/data/drills.ts`.

**Test scenarios:**
- Covers AE1. Happy path: active skill-drill instructions still satisfy the existing skill-verb-first invariant after rewrites.
- Covers AE2. Integration: current authored drill and progression catalogs still validate with no issues after copy changes.
- Covers AE3. Happy path: rewritten cues that previously stacked body mechanics now use one observable outcome or retain plain beginner glosses.
- Edge case: warmup/cooldown segment labels and bonus copy remain clear and pass mechanical copy tests.

**Verification:**
- Active catalog copy is clearer while catalog validation remains unchanged.
- Generated diagnostics should not change because this unit does not touch selection, workload, or metadata semantics.

---

- [x] U4. **Sync docs routing and verify**

**Goal:** Register the new requirements and plan docs, then verify the copy-only change did not break app or docs invariants.

**Requirements:** R2, R7

**Dependencies:** U1, U2, U3

**Files:**
- Modify: `docs/catalog.json`
- Test: `scripts/validate-agent-docs.sh`
- Test: `app/src/data/__tests__/drillCopyRegressions.test.ts`
- Test: `app/src/data/__tests__/catalogValidation.test.ts`

**Approach:**
- Add catalog entries for the exercise-copy requirements and this plan.
- Run narrow app tests for copy and catalog validation.
- Run generated diagnostics checks if any copied wording touches workload/diagnostic-adjacent text or if tests reveal unexpected movement.
- Run agent-doc validation because docs routing changed.

**Patterns to follow:**
- Nearby 2026-05-02 requirements and plan entries in `docs/catalog.json`.

**Test scenarios:**
- Happy path: docs catalog validation accepts the new docs entries.
- Happy path: app copy regression and catalog validation tests pass after the copy sweep.
- Integration: generated diagnostics report/triage checks remain stable if run.

**Verification:**
- The repo has a durable requirements/plan route for this work, and the app verifies the mechanical copy contract.

---

## System-Wide Impact

- **Interaction graph:** Future sessions snapshot updated drill copy into run surfaces; no routes, hooks, services, Dexie schema, or session assembly rules should change.
- **Error propagation:** No runtime error strategy changes.
- **State lifecycle risks:** Existing saved plans are not migrated; copy updates affect newly generated sessions only.
- **API surface parity:** No public API or exported model contract changes.
- **Integration coverage:** Catalog validation plus copy regression tests are sufficient because the intended change is data-copy-only.
- **Unchanged invariants:** Workload, fatigue, equipment, participant, focus, and generated-plan diagnostics semantics remain unchanged.

---

## Risks & Dependencies

| Risk | Mitigation |
|------|------------|
| Subjective prose gets overfit into tests | Test only mechanical invariants; leave clarity judgment in the checklist and review summary. |
| Copy edits hide a structural catalog problem | Keep metadata/workload/session-builder changes out of scope and record any discovered structural issue separately. |
| Broad copy sweep accidentally changes generated behavior | Do not edit metadata fields; run catalog validation and generated diagnostics checks if anything suspicious changes. |
| Docs routing drifts | Update `docs/catalog.json` alongside the new requirements and plan, then run agent-doc validation. |

---

## Documentation / Operational Notes

- The new requirements and plan are durable docs and should be registered in `docs/catalog.json`.
- If this pass uncovers a repeatable implementation pattern, capture a later `docs/solutions/` learning after the code change is verified.

---

## Sources & References

- **Origin document:** [docs/brainstorms/2026-05-02-exercise-copy-contract-requirements.md](../brainstorms/2026-05-02-exercise-copy-contract-requirements.md)
- Related ideation: [docs/ideation/2026-05-02-catalog-gap-closure-ideation.md](../ideation/2026-05-02-catalog-gap-closure-ideation.md)
- Copy rules: `.cursor/rules/courtside-copy.mdc`
- Drill catalog: `app/src/data/drills.ts`
- Drill schema: `app/src/types/drill.ts`
- Copy tests: `app/src/data/__tests__/drillCopyRegressions.test.ts`
- Catalog validation tests: `app/src/data/__tests__/catalogValidation.test.ts`
