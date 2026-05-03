---
id: catalog-gap-closure-requirements-2026-05-02
title: "Catalog Gap Closure Requirements"
status: active
stage: validation
type: requirements
summary: "Fresh requirements for choosing the next minimal, high-quality catalog/config gap closure move from current generated-plan diagnostics without prematurely editing drills, caps, block shape, or generator policy."
authority: "Product and workflow requirements for selecting the next catalog/config gap closure target; does not authorize catalog edits, workload metadata edits, source-backed activation, U6 preview tooling, or runtime generator changes."
last_updated: 2026-05-02
depends_on:
  - docs/reviews/2026-05-01-generated-plan-diagnostics-triage.md
  - docs/reviews/2026-05-01-generated-plan-diagnostics-report.md
  - docs/reviews/2026-04-30-focus-coverage-gap-cards.md
  - docs/ops/workload-envelope-authoring-guide.md
---

# Catalog Gap Closure Requirements

## Problem Frame

The current generated-plan diagnostics are useful but still easy to misuse. They show 0 hard failures and many observation-only cells, including routeable pressure around cooldown minimums, technique under-min slots, workload envelopes, and optional-slot redistribution.

The product goal is not to clear counts mechanically. The goal is to close the highest-leverage real gap in the current configuration with the smallest high-quality move. A change should improve workload honesty, session coherence, source-backed drill depth, or diagnostic routing clarity. It should not add catalog content, widen caps, or change generation behavior unless the evidence names a concrete gap and a verification path.

---

## Actors

- A1. Maintainer: Chooses the next gap closure target and accepts or rejects the proposed evidence basis.
- A2. Gap author: Converts current diagnostic evidence into a concrete candidate, rejected alternatives, success threshold, and next artifact.
- A3. Catalog author: Edits drills or workload metadata only after a later plan satisfies source, cap, or block-shape gates.
- A4. Agent planner: Turns the selected candidate into an implementation plan without inventing product behavior.
- A5. Reviewer: Checks that the selection protects training quality, source provenance, and minimal scope.

---

## Key Flows

- F1. Select the next gap closure target
  - **Trigger:** Current generated diagnostics are fresh and the maintainer wants to close current config gaps.
  - **Actors:** A1, A2, A5
  - **Steps:** Review the top current lanes and groups, compare likely closure value against evidence readiness, reject premature catalog/cap/generator work, and select one next artifact.
  - **Outcome:** The workflow has one target and one next artifact instead of a broad backlog.
  - **Covered by:** R1, R2, R3, R4, R5, R6
- F2. Gate an actual catalog/config change
  - **Trigger:** The selected target appears to need source-backed content, workload metadata, block-shape, or generator-policy work.
  - **Actors:** A1, A2, A3, A5
  - **Steps:** The author names the changed or missing surface, evidence basis, expected diagnostic movement, training-quality hypothesis, verification path, and stop condition before implementation planning.
  - **Outcome:** Later work can edit the right surface without turning observations into direct edit instructions.
  - **Covered by:** R7, R8, R9, R10, R11, R12
- F3. Reject or hold an attractive but under-evidenced target
  - **Trigger:** A high-count or familiar candidate lacks a concrete delta.
  - **Actors:** A1, A2, A5
  - **Steps:** The author records why the candidate is held, compares a clearer alternative or no-change path, and keeps the held state visible.
  - **Outcome:** The workflow avoids low-quality changes while preserving the unresolved evidence.
  - **Covered by:** R13, R14, R15, R16

---

## Requirements

**Target selection**

- R1. Selection should start from the current generated diagnostics and triage workbench, not stale intuition.
- R2. Selection should compare lanes by product value and evidence readiness, not affected-cell count alone.
- R3. Selection should prefer the smallest improvement that materially increases workload honesty, session coherence, source-backed depth, or diagnostic routing clarity.
- R4. Selection should choose exactly one next artifact: concrete candidate proposal, comparator proposal, no-change receipt, source-backed gap-card requirements, cap/workload proposal, block-shape proposal, or generator-policy hypothesis.
- R5. Selection should keep held candidates visible with a reason, re-entry condition, and owner rather than deleting or burying unresolved evidence.
- R6. Selection should explain why the chosen target is more valuable now than at least two plausible alternatives.

**Evidence gates**

- R7. Source-backed catalog work should require changed or missing IDs, exact source path or source needs, adaptation delta, expected diagnostic movement, verification command, checkpoint criteria, and explicit non-activation status before planning edits.
- R8. Workload metadata or cap work should require the exact workload envelope fact under review, segment/copy support, rejected catalog rationale, expected movement, and falsification threshold.
- R9. Block-shape work should require the generated block shape that over-stretches or under-serves the drill and the smallest runtime or assembly surface that would change.
- R10. Generator-policy work should require a causal mechanism that is separate from catalog/content and workload metadata changes.
- R11. No-change closure should require acceptance evidence, accepted blast radius, no-action threshold, and revisit trigger.
- R12. If none of R7-R11 can be satisfied, the target should remain held or the workflow should choose a clearer comparator.

**Quality and scope**

- R13. The workflow should treat current app quality for amateur athletes as the decision lens: avoid changes that make sessions less coherent just to satisfy diagnostics.
- R14. The workflow should preserve the current source-backed activation rules in `docs/reviews/2026-04-30-focus-coverage-gap-cards.md`.
- R15. The workflow should preserve the workload interpretation order in `docs/ops/workload-envelope-authoring-guide.md`.
- R16. The workflow should not authorize edits to `app/src/data/drills.ts`, workload metadata, source-backed content, U6 preview tooling, or runtime generation behavior in this requirements slice.

---

## Acceptance Examples

- AE1. **Covers R1-R6.** Given the top routeable group has the most affected cells but routes to policy review before catalog work, when selection compares candidates, then it may reject that group in favor of a lower-count but clearer artifact.
- AE2. **Covers R7-R12.** Given a candidate looks like a catalog gap but lacks source/adaptation/verification evidence, when selection runs, then it remains held or routes to a source-backed gap-card requirements artifact instead of editing drills.
- AE3. **Covers R8-R11.** Given a candidate is better explained by workload metadata, block shape, generator policy, or no-change, when selection chooses the next artifact, then it states that path explicitly and does not call it catalog fill.
- AE4. **Covers R13-R16.** Given an implementation agent reads this requirements document, then it does not edit catalog/config surfaces until a later plan satisfies the selected evidence gate.

---

## Success Criteria

- The workflow selects one next high-leverage target and one next artifact.
- The target is minimal, evidence-backed, and improves current configuration quality instead of only reducing counts.
- Planning can proceed without inventing the target, evidence gate, success threshold, or scope boundary.
- Any catalog/config edit remains blocked until the selected artifact makes it concrete and verifiable.

---

## Scope Boundaries

- Do not add or activate drill content in this requirements slice.
- Do not widen workload metadata or caps in this requirements slice.
- Do not change runtime generation, optional-slot redistribution, or block assembly in this requirements slice.
- Do not build U6 preview tooling yet.
- Do not create a broad catalog scorecard or full maintainer queue.
- Do not treat observation-only diagnostics as user-facing product failures.

---

## Key Decisions

- Quality beats count-clearing: A smaller clear artifact is better than a large ambiguous edit.
- Candidate selection is itself the next product capability: before adding content, the repo needs to reliably choose the right kind of gap closure.
- No-change is valid when evidenced: the workflow should be able to close or hold a candidate without implementation when the product quality case is weak.

---

## Dependencies / Assumptions

- `npm run diagnostics:report:check` remains the freshness check for the generated diagnostics report and triage workbench.
- Current focus-readiness gaps are verified closed for the supported matrix; remaining work is observation routing and quality improvement, not hard-failure repair.
- Source-backed drill activation still requires a manifest with exact sources, adaptation deltas, verification, and checkpoint criteria.

---

## Outstanding Questions

### Deferred to Ideation

- [Affects R2-R6][Product] Which current candidate produces the strongest next artifact when judged by value, clarity, and minimality?
- [Affects R7-R12][Technical] Should the next artifact be represented as generated triage output, a durable review doc, or a small machine-readable proposal?

---

## Next Steps

-> `/ce-ideate` on current catalog/config gap closure ideas, then capture the highest-value survivor in a focused requirements document.
