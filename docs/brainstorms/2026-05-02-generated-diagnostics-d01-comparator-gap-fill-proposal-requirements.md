---
id: generated-diagnostics-d01-comparator-gap-fill-proposal-requirements-2026-05-02
title: "Generated Diagnostics D01 Comparator Gap-Fill Proposal Requirements"
status: active
stage: validation
type: requirements
summary: "Requirements addendum for turning the D01 comparator receipt into the first concrete gap-fill proposal after the D47 gap closure ledger. Frames d01-solo as a simpler workload/block-shape candidate before catalog edits, source-backed activation, U6 preview tooling, or runtime generator changes."
authority: "Requirements for a D01 comparator gap-fill proposal; does not authorize drill catalog edits, workload metadata edits, source-backed content, U6 preview tooling, or runtime generator changes."
last_updated: 2026-05-02
depends_on:
  - docs/reviews/2026-05-01-generated-plan-diagnostics-triage.md
  - docs/brainstorms/2026-05-02-generated-diagnostics-d47-gap-closure-ledger-requirements.md
  - docs/plans/2026-05-02-003-feat-d47-gap-closure-ledger-plan.md
  - docs/ops/workload-envelope-authoring-guide.md
  - docs/reviews/2026-04-30-focus-coverage-gap-cards.md
---

# Generated Diagnostics D01 Comparator Gap-Fill Proposal Requirements

## Problem Frame

The D47 gap closure ledger now names `d01` / `d01-solo` as the simpler, higher-confidence comparator candidate. D01 has a cleaner receipt than D47: the current comparator facts show 18 affected cells, 0 pressure-disappears cells, 18 pressure-remains cells, 6 non-redistribution pressure cells, and 0 inconclusive cells.

The next product step is not to edit D01 immediately. It is to turn this comparator receipt into the first concrete gap-fill proposal: name the suspected training-system gap, classify the likely closure path, state the smallest next artifact, and define how a future fill would be reassessed.

For D01, the strongest first hypothesis is workload/block shape, not source-backed content. `d01-solo` is an existing beginner passing drill with a 2-5 minute workload envelope and 5-minute fatigue cap. The diagnostic evidence says generated main-skill allocation can exceed that envelope even when optional-slot redistribution is not the root cause.

---

## Actors

- A1. Maintainer: Decides whether D01 should replace D47 as the first concrete gap-fill pilot.
- A2. Gap author: Writes the D01 proposal facts, expected movement, no-action threshold, and reassessment expectation.
- A3. Agent planner: Plans implementation only after the proposal names a concrete target surface and remains inside the evidence-before-authorization boundary.
- A4. Reviewer: Checks that D01 does not become an unexamined catalog or workload edit.

---

## Key Flows

- F1. D01 comparator becomes a primary fill candidate
  - **Trigger:** The D47 ledger names `d01-solo` as the comparator candidate.
  - **Actors:** A1, A2, A4
  - **Steps:** The gap author records D01 identity, comparator facts, why D01 is simpler than D47, suspected gap type, and why the proposal is or is not ready for planning.
  - **Outcome:** D01 becomes a bounded candidate instead of an implicit next step.
  - **Covered by:** R1, R2, R3, R4, R5
- F2. D01 chooses a first closure path
  - **Trigger:** Maintainer wants the first concrete gap-fill action.
  - **Actors:** A1, A2, A3, A4
  - **Steps:** The proposal separates workload metadata, block-shape/programming, source-backed content, generator-policy, and no-change paths; it selects one primary path or stays evidence-gathering with one next artifact.
  - **Outcome:** Planning can target one concrete fill proposal without inventing product behavior.
  - **Covered by:** R6, R7, R8, R9, R10, R11, R12
- F3. Future D01 fill gets reassessed
  - **Trigger:** A later implementation applies an authorized D01 workload/block/content/generator change.
  - **Actors:** A2, A3, A4
  - **Steps:** The proposal compares expected diagnostic movement and training-quality movement against regenerated diagnostics and allowed training-quality evidence.
  - **Outcome:** The workflow proves whether the D01 fill actually improved the training system.
  - **Covered by:** R13, R14, R15, R16

---

## Requirements

**Comparator identity and decision**

- R1. The proposal should identify D01 by stable group key, drill ID, variant ID, block type, route context, and current comparator receipt facts from the generated triage workbench.
- R2. The proposal should explicitly state whether D47 is abandoned for D01, held behind D01, or kept as a secondary candidate.
- R3. The proposal should explain why D01 is simpler or higher-confidence than D47 using receipt facts, not only prose preference.
- R4. The proposal should preserve D47 as relevant context without letting D47's mixed-causality needs drive the D01 fill path.
- R5. The proposal should include currentness and validation behavior: stale or missing D01 evidence blocks fill authorization and forces refresh or no-change/abandon review.

**D01 gap claim and closure path**

- R6. The suspected D01 gap should be stated in product language: the current beginner passing drill may be asked to fill a main-skill duration shape beyond its authored workload envelope.
- R7. The primary path should start as `programming_shape_gap` or `workload_metadata_gap`; `drill_inventory_gap` should remain blocked unless a source-backed content delta beyond existing D01 catalog content is named.
- R8. A workload metadata path should name the exact envelope fact under review: `durationMaxMinutes: 5`, `fatigueCap.maxMinutes: 5`, or whether main-skill blocks should split/repeat instead of widening the drill.
- R9. A programming/block-shape path should name the block deficiency it believes is causing weak programming: using one short beginner drill as too much main-skill time, not necessarily the drill being under-authored.
- R10. A generator-policy path should stay separate from D01 catalog or workload changes and require a policy hypothesis before any runtime generator change.
- R11. A no-change path should cite policy allowance or harmless diagnostic evidence, plus a no-action threshold and revisit trigger.
- R12. If the proposal remains evidence-gathering, it should name exactly one next artifact: a workload/block-shape proposal for D01.

**Evidence and reassessment**

- R13. The proposal should name expected diagnostic movement before any fill: reduced D01 over-cap/fatigue cells, route change, or explicit policy-accepted remaining pressure.
- R14. The proposal should name expected training-quality movement using an allowed evidence source: workload honesty, block-shape coherence, manual session-fit receipt, or product copy/rationale review.
- R15. The proposal should keep diagnostic validation separate from training-quality validation.
- R16. The proposal should define a future reassessment receipt that compares expected and actual regenerated diagnostics after any authorized fill.

**Scope and safety**

- R17. The proposal should not edit `app/src/data/drills.ts`, workload metadata, source-backed content, or runtime `buildDraft()` behavior.
- R18. The proposal should not build U6 preview tooling.
- R19. The proposal should not convert every comparator candidate into a proposal before D01 proves the path.
- R20. The proposal should make the next workflow obvious: workload/block-shape proposal planning, no-change closure, source-backed gap-card brainstorm only if content delta is named, generator-policy investigation only if policy hypothesis is named, or D47 fallback if D01 is rejected.

---

## Acceptance Examples

- AE1. **Covers R1, R2, R3, R4.** Given the current D47 ledger, when the D01 proposal is created, it records the D01 comparator facts and states whether D47 is abandoned, held, or secondary.
- AE2. **Covers R6, R7, R8, R9, R12.** Given D01's pressure remains without redistribution, when a planner reads the proposal, the next artifact is a workload/block-shape proposal, not an immediate catalog edit.
- AE3. **Covers R7, R17.** Given someone proposes adding D01 source-backed content, when no content-depth delta is named, the proposal remains not authorized for catalog work.
- AE4. **Covers R11, R15, R16.** Given no-change becomes best supported, when the proposal closes, it records evidence, threshold, revisit trigger, and separate diagnostic/training-quality outcomes.
- AE5. **Covers R18, R20.** Given a planner tries to build U6 preview tooling from D01, when the proposal is still pre-fill, the workflow redirects to workload/block-shape proposal planning.

---

## Success Criteria

- A maintainer can tell whether D01 should replace D47 as the first concrete gap-fill pilot.
- A planner can start the next workflow without inventing whether D01 needs workload metadata, block shape, source-backed content, generator policy, or no-change work.
- D01's proposal names one smallest next artifact and one expected diagnostic movement before any implementation changes.
- The workflow preserves the evidence-before-authorization boundary while moving from diagnostic evidence toward a real fill.

---

## Scope Boundaries

- Do not edit the drill catalog, source-backed instructions, workload metadata, or generator behavior in this brainstorm.
- Do not build U6 preview tooling.
- Do not assume D01's authored 2-5 minute envelope is wrong only because generated sessions exceed it.
- Do not assume the generator is wrong only because the envelope is exceeded.
- Do not require source-backed evidence unless the proposal claims a content or drill-inventory gap.
- Do not let D47 continue as the default pilot if D01 is clearly simpler and more actionable.

---

## Key Decisions

- D01 becomes the next pilot candidate: It has cleaner comparator evidence than D47 and should prove whether the workflow can move from diagnostics into one concrete gap-fill proposal.
- The first hypothesis is workload/block shape: D01's source/content exists, while the diagnostic pressure is about generated main-skill duration against a short beginner drill envelope.
- D47 is held behind D01, not discarded blindly: D47 remains useful if D01 fails to name a concrete path or turns into no-change.
- No direct edit yet: This brainstorm defines proposal quality; planning decides where the proposal lives technically.

---

## Dependencies / Assumptions

- The current D47 ledger in `docs/reviews/2026-05-01-generated-plan-diagnostics-triage.md` is fresh.
- `docs/ops/workload-envelope-authoring-guide.md` remains the policy source for workload and block-shape interpretation.
- `d01-solo` currently has `durationMaxMinutes: 5` and `fatigueCap.maxMinutes: 5` in `app/src/data/drills.ts`.
- Any future source-backed content work must follow `docs/reviews/2026-04-30-focus-coverage-gap-cards.md`.

---

## Outstanding Questions

### Deferred to Planning

- [Affects R1, R5][Technical] Should the D01 proposal be generated into the existing triage workbench, represented as a dedicated comparator proposal section, or derived into a machine-readable receipt?
- [Affects R8, R9][Technical] Should the first concrete artifact prefer workload metadata review, block-shape proposal, or a combined workload/block proposal?
- [Affects R13, R16][Technical] Which regenerated diagnostic field should be the first reassessment comparator: affected-cell count, route state, pressure-remains count, or all D01 group facts?

---

## Next Steps

-> `/ce-plan docs/brainstorms/2026-05-02-generated-diagnostics-d01-comparator-gap-fill-proposal-requirements.md`
