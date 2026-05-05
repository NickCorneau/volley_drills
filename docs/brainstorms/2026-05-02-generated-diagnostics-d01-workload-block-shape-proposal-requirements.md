---
id: generated-diagnostics-d01-workload-block-shape-proposal-requirements-2026-05-02
title: "Generated Diagnostics D01 Workload Block-Shape Proposal Requirements"
status: active
stage: validation
type: requirements
summary: "Requirements addendum for turning the D01 comparator gap-fill proposal into a concrete workload/block-shape proposal. Selects block-shape review as the first fill path, keeps workload metadata review secondary, and blocks catalog/source/U6/generator edits until a later authorized fill."
authority: "Requirements for a D01 workload/block-shape proposal artifact; does not authorize drill catalog edits, workload metadata edits, source-backed content, U6 preview tooling, or runtime generator changes."
last_updated: 2026-05-02
depends_on:
  - docs/brainstorms/2026-05-02-generated-diagnostics-d01-comparator-gap-fill-proposal-requirements.md
  - docs/reviews/2026-05-01-generated-plan-diagnostics-triage.md
  - docs/ops/workload-envelope-authoring-guide.md
---

# Generated Diagnostics D01 Workload Block-Shape Proposal Requirements

## Problem Frame

The generated D01 gap-fill proposal now identifies `d01-solo` as the first concrete workload/block-shape candidate. The current receipt shows 18 affected cells, 0 pressure-disappears cells, 18 pressure-remains cells, 6 non-redistribution pressure cells, and 0 inconclusive cells.

This proposal should answer the next product question: what is the smallest concrete fill path for D01? The current evidence does not justify widening D01 immediately. `d01-solo` is a short beginner passing drill with a 2-5 minute envelope and a 5-minute fatigue cap; the issue is more likely that generated main-skill allocation is asking one short, repetitive drill to carry too much time.

The selected v1 fill path is therefore a block-shape proposal: keep D01 metadata unchanged, mark workload metadata review as secondary, and propose that future implementation should split/repeat/reroute the main-skill shape rather than silently stretching the drill.

---

## Actors

- A1. Maintainer: Decides whether D01 is ready to become the first actual fill target.
- A2. Gap author: Writes the concrete D01 workload/block-shape proposal and expected movement.
- A3. Agent planner: Plans the derived proposal artifact without editing catalog or generator behavior.
- A4. Reviewer: Checks that the proposal does not hide a workload metadata edit or runtime policy change.

---

## Key Flows

- F1. D01 proposal selects a primary disposition
  - **Trigger:** D01 gap-fill proposal names `workload_block_shape_proposal` as the next artifact.
  - **Actors:** A1, A2, A4
  - **Steps:** The gap author compares candidate dispositions from the workload guide and selects `block_shape_review_needed` as primary, with `metadata_review_needed` as secondary and source/generator paths blocked.
  - **Outcome:** D01 has a concrete proposal direction without changing runtime behavior.
  - **Covered by:** R1, R2, R3, R4, R5
- F2. Proposal defines a future fill without applying it
  - **Trigger:** Maintainer wants implementation-ready next steps.
  - **Actors:** A2, A3, A4
  - **Steps:** The proposal names the target surface, recommended fill shape, expected diagnostic movement, training-quality hypothesis, no-action threshold, and reassessment receipt fields.
  - **Outcome:** A later fill plan can choose whether to implement block-shape behavior, preview it through U6, or close with no change.
  - **Covered by:** R6, R7, R8, R9, R10, R11, R12

---

## Requirements

**Disposition and target surface**

- R1. The proposal should identify D01 by stable group key, drill ID, variant ID, block type, route context, and current receipt facts.
- R2. The proposal should select `block_shape_review_needed` as the primary candidate disposition.
- R3. The proposal should preserve `metadata_review_needed` as a secondary disposition, not the selected action.
- R4. The proposal should state that D01 workload metadata remains unchanged in this slice.
- R5. The target surface should be the generated main-skill block shape that asks `d01-solo` to exceed its 2-5 minute authored envelope and 5-minute fatigue cap.

**Concrete proposal content**

- R6. The recommended fill shape should be stated in product language: split, repeat, or reroute the main-skill shape rather than stretching a short beginner drill.
- R7. The proposal should say why block shape beats cap widening for v1: D01 copy and success metric describe short repeated contacts, not long continuous workload.
- R8. The proposal should name the exact evidence layer from the workload guide: generated trace/block allocation first, variant workload metadata second.
- R9. The proposal should include expected diagnostic movement: reduce D01 over-cap/fatigue pressure or route remaining pressure to an accepted policy allowance after the future fill.
- R10. The proposal should include expected training-quality movement: more honest beginner passing work with less fatigue drift and clearer session shape.
- R11. The proposal should define a no-action threshold and revisit trigger.
- R12. The proposal should define a future reassessment receipt boundary while keeping actual reassessment `not_started`.

**Scope and safety**

- R13. The proposal should not edit `app/src/data/drills.ts`, workload metadata, source-backed content, U6 preview tooling, or runtime generator behavior.
- R14. The proposal should block source-backed content unless a content-depth delta is named later.
- R15. The proposal should block generator-policy work unless a runtime policy hypothesis is named later.
- R16. The proposal should make the next workflow obvious: either implement a previewable block-shape fill, run U6 once a concrete cap/block proposal exists, close as no-change, or return to D47 if D01 fails.

---

## Acceptance Examples

- AE1. **Covers R1, R2, R3, R4.** Given the current D01 gap-fill proposal, when the workload/block-shape proposal is generated, it selects `block_shape_review_needed`, keeps metadata review secondary, and states no D01 metadata is changed.
- AE2. **Covers R6, R7, R8.** Given `d01-solo` has short repeated-contact copy and a streak metric, when the proposal chooses a fill path, it recommends block-shape review before cap widening.
- AE3. **Covers R9, R10, R12.** Given a future fill lands, when diagnostics regenerate, the receipt can compare expected diagnostic movement and expected training-quality movement separately.
- AE4. **Covers R13, R14, R15.** Given someone tries to turn this proposal into catalog/source/generator work, when no later authorization exists, the proposal remains blocked.

---

## Success Criteria

- A maintainer can tell that the selected D01 path is block-shape review, not immediate cap widening.
- A planner can implement the proposal artifact without inventing product behavior or editing runtime behavior.
- A future fill plan can start from a concrete recommendation, expected movement, no-action threshold, and reassessment boundary.
- The workflow advances toward real gap filling while preserving evidence-before-authorization.

---

## Scope Boundaries

- Do not edit D01 workload metadata.
- Do not change generated session assembly or block allocation behavior in this proposal slice.
- Do not add D01 source-backed content or variants.
- Do not build U6 preview tooling yet.
- Do not treat D01 as validated until a later fill is implemented and reassessed.

---

## Key Decisions

- Select block shape first: The evidence says D01 is likely being asked to carry too much main-skill time, and the authored drill shape is intentionally short.
- Keep metadata review secondary: D01's 5-minute cap may still need review later, but widening it first risks making the catalog less honest.
- Keep the proposal derived and generated: This should live beside D01 gap-fill proposal evidence in the triage workbench, not as a manual sidecar that drifts.

---

## Dependencies / Assumptions

- The generated D01 gap-fill proposal is current in `docs/reviews/2026-05-01-generated-plan-diagnostics-triage.md`.
- `docs/ops/workload-envelope-authoring-guide.md` owns the candidate disposition vocabulary.
- The current `d01-solo` catalog metadata and copy remain unchanged during this proposal slice.

---

## Outstanding Questions

### Deferred to Planning

- [Affects R6, R16][Technical] Should the proposal represent the future fill as one named recommendation, a ranked option set, or both?
- [Affects R9, R12][Technical] Which generated fields should the proposal name as the future reassessment comparator?
- [Affects R16][Technical] Should U6 remain fully deferred, or should the proposal declare the exact condition under which U6 becomes the next step?

---

## Next Steps

-> `/ce-plan docs/brainstorms/2026-05-02-generated-diagnostics-d01-workload-block-shape-proposal-requirements.md`
