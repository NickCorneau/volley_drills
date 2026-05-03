---
id: generated-diagnostics-d47-reentry-selection-requirements-2026-05-02
title: "Generated Diagnostics D47 Reentry Selection Requirements"
status: active
stage: validation
type: requirements
summary: "Requirements for the post-D01 catalog re-diagnosis step: resume D47 with D01 held, then select the smallest evidence-ready D47 or comparator improvement before any catalog, cap, block-shape, or generator-policy edit."
authority: "Requirements addendum for selecting the next high-leverage generated-diagnostics improvement target after the D01 cap/catalog fork packet; does not authorize catalog edits, workload metadata edits, source-backed activation, U6 preview tooling, or runtime generator changes."
last_updated: 2026-05-02
depends_on:
  - docs/brainstorms/2026-05-02-generated-diagnostics-d47-gap-closure-ledger-requirements.md
  - docs/brainstorms/2026-05-02-generated-diagnostics-d01-cap-catalog-fork-requirements.md
  - docs/reviews/2026-05-01-generated-plan-diagnostics-triage.md
  - docs/reviews/2026-04-30-focus-coverage-gap-cards.md
  - docs/ops/workload-envelope-authoring-guide.md
---

# Generated Diagnostics D47 Reentry Selection Requirements

## Problem Frame

The refreshed diagnostics show 0 hard failures, but many observation-only cells still need conservative routing. The latest D01 cap/catalog fork packet selected `resume_d47_with_d01_held` because D01 cannot currently name a complete cap, catalog, or no-change payload.

The next work should not keep searching the whole catalog. It should resume the D47 path with D01 visible and held, then select the smallest evidence-ready improvement target. If D47 cannot name a concrete delta, the workflow should reject D47 as the immediate target and choose the next clearer comparator rather than adding catalog content just to reduce diagnostic counts.

---

## Diagnosis Summary

- Current generated diagnostics are fresh and validation-passing.
- D01 is no longer the clearest catalog target: it remains visible, but its packet rejects catalog planning readiness.
- D47 / `d47-solo-open` is the highest-leverage reentry candidate because it is the largest remaining concrete mixed-pressure group after D01 is held.
- D47 is not yet fill-ready: its existing FIVB 4.7 provenance is known, but a new content-depth delta, cap delta, block-shape delta, generator-policy hypothesis, or no-change threshold has not been named.
- `d25-solo` is numerically larger, but the current guide routes wrap under-min pressure to short-session cooldown policy review before catalog work.

---

## Actors

- A1. Maintainer: Chooses whether D47 is the next improvement target or should be rejected for a clearer comparator.
- A2. Gap author: Converts the fresh diagnostic evidence into one recommended target and one concrete next artifact.
- A3. Source researcher: Supplies source-backed evidence only if the selected path claims a drill/content inventory gap.
- A4. Planner: Plans the selected next artifact without inventing catalog deltas or broad preview tooling.
- A5. Reviewer: Checks that the selection is minimal, evidence-backed, and does not hide D01 or D47 residuals.

---

## Requirements

**Reentry selection**

- R1. The selection should start from the refreshed diagnostics check and quote the current D01 fork outcome: `resume_d47_with_d01_held`.
- R2. The selection should preserve D01 as held/visible, not closed or silently removed.
- R3. The selection should identify D47 / `d47-solo-open` as the default reentry candidate unless a comparator has stronger causal warrant and a smaller artifact.
- R4. The selection should compare D47 against at least three non-D47 alternatives from the current top groups: `d25-solo`, `d33-solo-open`, `d46-solo-open`, `d05-solo`, or another current top routeable group.
- R5. The selection should choose exactly one next artifact: D47 concrete-delta proposal, comparator proposal, no-change receipt, or source-backed gap-card requirements.

**Evidence gate**

- R6. A catalog/source-backed path should be selected only if the artifact can name changed or missing IDs, source path or source needs, adaptation delta, expected diagnostic movement, verification command, checkpoint criteria, and non-activation status.
- R7. A cap or workload path should be selected only if it names the exact workload envelope delta under review, segment/copy support, rejected catalog rationale, expected movement, and falsification threshold.
- R8. A block-shape path should be selected only if it names the generated block shape that over-stretches the drill and the smallest runtime or assembly surface that would change.
- R9. A generator-policy path should be selected only if it names the causal mechanism beyond the allocated-duration counterfactual and keeps catalog/workload changes separate.
- R10. If none of R6-R9 can be satisfied for D47, the selection should reject D47 as the immediate target and promote the clearest comparator or no-change receipt.

**Minimality and quality**

- R11. The selected path should prefer a smaller, higher-confidence improvement over a larger but ambiguous affected-cell count.
- R12. The selected path should not use `observation_only` counts alone as authorization to edit `app/src/data/drills.ts`.
- R13. The selected path should keep courtside training quality first: workload honesty, coherent block shape, and source-backed drill intent matter more than clearing counts mechanically.
- R14. The selected path should state what would count as success after regeneration and what would make the work stop.

**Scope**

- R15. Do not edit the drill catalog, source-backed instructions, workload metadata, U6 preview tooling, or runtime generator behavior in this selection slice.
- R16. Do not create a broad catalog coverage map, global scoring system, or generic maintainer queue.
- R17. Do not add a new drill or variant unless a later source-backed fill plan satisfies the gap-card manifest rules.

---

## Acceptance Examples

- AE1. **Covers R1-R5.** Given D01 selects `resume_d47_with_d01_held`, when the next diagnostic step is planned, then D47 resumes as the default candidate and at least three top alternatives are compared before one next artifact is selected.
- AE2. **Covers R6-R10.** Given D47 lacks a named content, cap, block-shape, or generator-policy delta, when selection runs, then D47 is not allowed to become catalog work by default.
- AE3. **Covers R11-R14.** Given a lower-count comparator is clearer and higher-confidence, when selection chooses the next work, then it may promote that comparator over D47 and explain why the smaller artifact is better.
- AE4. **Covers R15-R17.** Given an implementer reads the selection result, then no catalog, metadata, source-backed, U6, or runtime generator edit is authorized by this requirements slice.

---

## Success Criteria

- The next improvement target is a single evidence-backed artifact, not another open-ended catalog search.
- D01 remains visible but no longer blocks D47.
- D47 either becomes a concrete proposal with a named delta or is rejected in favor of a cleaner comparator.
- The workflow can move toward actual high-quality gap closure without adding content or widening caps prematurely.

---

## Next Steps

-> Plan a D47 reentry selection packet that renders in the generated diagnostics workbench and chooses exactly one next artifact.
