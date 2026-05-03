---
id: gap-closure-selection-workbench-requirements-2026-05-02
title: "Gap Closure Selection Workbench Requirements"
status: active
stage: validation
type: requirements
summary: "Requirements for a generated diagnostics workbench section that selects the next minimal catalog/config gap closure artifact from current evidence, with D47 reentry as the first concrete case and D01 held visibly."
authority: "Requirements for the Gap Closure Selection Workbench; authorizes a generated selection artifact and docs routing, but does not authorize catalog edits, workload metadata edits, source-backed activation, U6 preview tooling, or runtime generator changes."
last_updated: 2026-05-02
depends_on:
  - docs/brainstorms/2026-05-02-catalog-gap-closure-requirements.md
  - docs/ideation/2026-05-02-catalog-gap-closure-ideation.md
  - docs/reviews/2026-05-01-generated-plan-diagnostics-triage.md
  - docs/ops/workload-envelope-authoring-guide.md
  - docs/reviews/2026-04-30-focus-coverage-gap-cards.md
---

# Gap Closure Selection Workbench Requirements

## Problem Frame

The current diagnostics workflow can now identify routeable observations, compare redistribution pressure, partially validate D01 block-shape work, and hold D01 when no catalog/cap/no-change payload is ready. The next problem is selection: what should the maintainer or agent do next?

The Gap Closure Selection Workbench should answer that question in one generated section. It should select exactly one next artifact from current evidence, explain why that target beats plausible alternatives, and keep all non-selected candidates visible. The first concrete case is D47 reentry: D01 is held, D47 resumes, and D47 must either name a concrete delta or lose to a clearer comparator.

---

## Actors

- A1. Maintainer: Reads the generated selection and decides whether to accept the next artifact.
- A2. Gap author: Uses the workbench output to write the next requirements or proposal without rediscovering the diagnostic state.
- A3. Agent planner: Plans the selected artifact without inventing target choice, evidence gate, or stop condition.
- A4. Reviewer: Ensures the selected artifact is high-value, minimal, and not a hidden catalog/config edit.

---

## Key Flows

- F1. Generated selection from fresh diagnostics
  - **Trigger:** Generated diagnostics and triage are refreshed.
  - **Actors:** A1, A2, A4
  - **Steps:** The workbench reads the current D01/D47 state, top routeable alternatives, lane guidance, and evidence gates, then selects one next artifact.
  - **Outcome:** A maintainer sees the recommended next artifact plus rejected alternatives in the generated triage workbench.
  - **Covered by:** R1, R2, R3, R4, R5, R6
- F2. D47 reentry decision
  - **Trigger:** D01 fork state is `resume_d47_with_d01_held`.
  - **Actors:** A1, A2, A3, A4
  - **Steps:** The workbench treats D47 as the default reentry candidate, compares D47 to current alternatives, and selects D47 only if it can name a stronger next artifact than the comparator/no-change path.
  - **Outcome:** D47 either becomes the selected next artifact or remains held/rejected with a visible reason.
  - **Covered by:** R7, R8, R9, R10, R11
- F3. Evidence-gated handoff
  - **Trigger:** A selected target appears to require catalog, cap/workload, block-shape, generator-policy, or no-change work.
  - **Actors:** A2, A3, A4
  - **Steps:** The workbench states the selected path, required evidence payload, expected diagnostic movement, and falsification/no-action threshold before any implementation plan can edit behavior.
  - **Outcome:** Planning starts from a bounded artifact, not a broad fix path.
  - **Covered by:** R12, R13, R14, R15, R16

---

## Requirements

**Selection artifact**

- R1. The workbench should render a clearly named `Gap Closure Selection` section in the generated diagnostics triage workbench.
- R2. The section should state current D01 state, current D47 state, selected target, selected next artifact, selection reason, rejected alternatives, and non-authorization status.
- R3. The selected next artifact should be exactly one of: `d47_concrete_delta_proposal`, `comparator_proposal`, `cooldown_policy_receipt`, `source_backed_gap_card_requirements`, `cap_or_workload_proposal`, `block_shape_proposal`, `generator_policy_hypothesis`, `accepted_no_change_receipt`, or `hold_for_evidence`.
- R4. The section should rank candidates by value, confidence, and minimality rather than affected-cell count alone.
- R5. The section should compare at least three current alternatives when D47 is considered: D25 cooldown policy, D05 comparator pressure, and one of D33/D46/D47 pair/solo adjacent groups.
- R6. The section should keep rejected alternatives visible with one-line reasons and re-entry triggers.

**D47 reentry**

- R7. When D01 selects `resume_d47_with_d01_held`, the workbench should treat D47 / `d47-solo-open` as the default reentry candidate.
- R8. D47 should not be selected for catalog/source-backed work unless it names a content-depth delta beyond existing FIVB 4.7 provenance.
- R9. D47 should not be selected for cap/workload, block-shape, or generator-policy work unless it names the changed surface, evidence basis, expected movement, and falsification threshold.
- R10. If D47 cannot satisfy R8 or R9, the workbench should either select a clearer comparator artifact or select `hold_for_evidence`.
- R11. D01 should remain visible as held, with the same reopen condition from the D01 cap/catalog fork packet.

**Evidence gates and safety**

- R12. Catalog/source-backed paths should remain `not_authorized` unless a later artifact satisfies the source-backed activation manifest rules.
- R13. Cap/workload and block-shape paths should remain `not_authorized` unless a later artifact names a concrete changed surface and verification threshold.
- R14. Generator-policy paths should remain separate from catalog and workload metadata changes.
- R15. No-change paths should require acceptance evidence, accepted blast radius, no-action threshold, and revisit trigger.
- R16. The workbench should not edit `app/src/data/drills.ts`, workload metadata, source-backed content, U6 preview tooling, or runtime generation behavior.

---

## Acceptance Examples

- AE1. **Covers R1-R6.** Given current diagnostics are fresh, when the generated triage workbench is built, then it includes a `Gap Closure Selection` section with one selected next artifact and visible rejected alternatives.
- AE2. **Covers R7-R11.** Given D01 selects `resume_d47_with_d01_held`, when D47 lacks a complete concrete-delta payload, then D47 is not promoted to catalog/config edits and D01 remains visible as held.
- AE3. **Covers R4, R5, R10.** Given D25 has the largest affected count but routes first to cooldown policy review, when candidates are compared, then the workbench may choose D47/D05/comparator work instead and explain why.
- AE4. **Covers R12-R16.** Given a selected next artifact is rendered, when a planner reads it, then no catalog, workload, source-backed, U6, or generator edit is authorized by the workbench itself.

---

## Success Criteria

- The generated triage workbench tells the next agent exactly which artifact to plan next.
- The selected artifact is smaller and clearer than a broad catalog audit.
- D47 reentry is handled explicitly rather than by historical momentum.
- D01 remains visible but no longer blocks progress.
- Premature catalog/config edits stay blocked until a later artifact supplies complete evidence.

---

## Scope Boundaries

- Do not edit drill catalog content or workload metadata.
- Do not build U6 preview tooling.
- Do not change generated session assembly or optional-slot redistribution behavior.
- Do not convert every routeable group into a full proposal.
- Do not create a standalone UI or maintainer dashboard.
- Do not claim field training-quality validation.

---

## Key Decisions

- Generated section over standalone doc: the selection should live where freshness is already checked, so stale target choice is caught by existing diagnostics validation.
- D47 is default but not guaranteed: D47 resumes because D01 is held, but it must still beat current alternatives on value, confidence, and minimality.
- No authorization by selection: choosing a next artifact is not the same as approving edits to catalog/config surfaces.

---

## Dependencies / Assumptions

- The D01 cap/catalog fork packet remains current and selects `resume_d47_with_d01_held`.
- `docs/ops/workload-envelope-authoring-guide.md` remains the guide for interpreting cooldown, technique, and workload-envelope observations.
- `docs/reviews/2026-04-30-focus-coverage-gap-cards.md` remains the source-backed activation precedent.

---

## Outstanding Questions

### Deferred to Planning

- [Affects R3-R6][Technical] Should the selected next artifact be derived by a small deterministic helper or hard-coded from the current known D01/D47 state?
- [Affects R5][Technical] Which adjacent group should be the third comparison candidate after D25 and D05: D33, D46, or D47 pair-open?
- [Affects R12-R15][Technical] How much evidence-payload detail should render now versus stay in the selected artifact's later requirements document?

---

## Next Steps

-> `/ce-plan docs/brainstorms/2026-05-02-gap-closure-selection-workbench-requirements.md`
