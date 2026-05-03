---
id: generated-diagnostics-d01-cap-catalog-fork-requirements-2026-05-02
title: "Generated Diagnostics D01 Cap/Catalog Fork Requirements"
status: active
stage: validation
type: requirements
summary: "Requirements for the next D01 gap-fill step: turn the insufficient allocated-pressure receipt into a decision-forcing cap/catalog/no-change/D47-resume packet, with a fast path to source-backed catalog fill when the evidence names a real drill-catalog gap."
authority: "Requirements for the D01 cap/catalog fork admission packet; authorizes a proposal artifact and generated diagnostics routing update, but does not authorize catalog edits, D01 workload metadata edits, U6 preview tooling, runtime generator changes, or source-backed activation without a later concrete fill plan."
last_updated: 2026-05-02
depends_on:
  - docs/brainstorms/2026-05-02-generated-diagnostics-d01-redistribution-handoff-requirements.md
  - docs/plans/2026-05-02-008-feat-d01-redistribution-handoff-plan.md
  - docs/reviews/2026-05-01-generated-plan-diagnostics-triage.md
  - docs/ops/workload-envelope-authoring-guide.md
  - docs/reviews/2026-04-30-focus-coverage-gap-cards.md
---

# Generated Diagnostics D01 Cap/Catalog Fork Requirements

## Problem Frame

The D01 diagnostic-to-fill loop has now reached a real fork. The block-shape fill partially validated the approach: the target group moved from 18 to 12 affected cells and non-redistribution pressure moved from 6 to 0. The redistribution handoff admission then rejected another runtime tweak for the current baseline: the remaining D01 target is `insufficient_allocated_pressure`, and D47's next state is `cap_or_catalog_proposal_needed`.

The next step should not keep optimizing D01 runtime behavior. It should force a concrete decision: keep or widen the D01 workload envelope, name a source-backed catalog/content delta, close or hold the residual as an accepted no-change state, or resume D47 because D01 cannot name a credible next delta.

This is also the point where actual catalog filling can start if the evidence supports it. The fork packet should not add drills itself, but it should be allowed to hand directly to source-backed catalog-fill requirements and planning when the smallest honest missing ingredient is a longer beginner passing carrier or another named catalog gap. If the packet cannot name that gap-card-ready catalog path, it should not call the result a catalog handoff; it should resume D47 with D01 visibly held or choose another explicit fork.

---

## Actors

- A1. Maintainer: Chooses whether the D01 residual should become cap work, catalog/source-backed work, no-change closure, or a D47 resume.
- A2. Gap author: Builds the D01 fork packet from current generated diagnostics, workload guidance, and gap-card rules.
- A3. Planner: Turns the selected fork into the next plan without inventing product behavior.
- A4. Reviewer: Checks that the packet does not smuggle in catalog edits, cap widening, or another runtime loop without explicit authorization.

---

## Key Flows

- F1. D01 fork packet creation
  - **Trigger:** The generated D01 fill receipt reports `redistributionHandoffState: insufficient_allocated_pressure` and `d47NextState: cap_or_catalog_proposal_needed`.
  - **Actors:** A1, A2, A4
  - **Steps:** The gap author summarizes current D01 receipt facts, extracts the smallest missing ingredient, compares cap, catalog, no-change, and D47-resume forks, and selects exactly one recommended next fork with a falsification threshold.
  - **Outcome:** D01 exits vague runtime follow-up mode and has a concrete next decision.
  - **Covered by:** R1, R2, R3, R4, R5, R6, R7
- F2. Catalog-fill fast path
  - **Trigger:** The fork packet selects catalog/source-backed work as the smallest honest missing ingredient.
  - **Actors:** A1, A2, A3
  - **Steps:** The packet names the suspected catalog gap in product language, identifies affected cells and candidate source needs, states expected diagnostic movement, and hands off to source-backed gap-card or catalog-fill planning.
  - **Outcome:** The workflow can start actual drill-catalog fill work without another ideation loop.
  - **Covered by:** R8, R9, R10, R11, R12
- F3. No-change or D47 resume
  - **Trigger:** The fork packet cannot justify cap or catalog work, or the residual is accepted as bounded diagnostic debt.
  - **Actors:** A1, A2, A4
  - **Steps:** The packet records a no-action rationale and revisit trigger, or states that D47 resumes with D01 explicitly held/open.
  - **Outcome:** D01 does not indefinitely block the generated diagnostics workflow.
  - **Covered by:** R13, R14, R15, R16

---

## Requirements

**Fork packet**

- R1. The packet should start from the current D01 target group key, affected-cell count, diagnostic movement, `redistributionHandoffState`, `redistributionHandoffReason`, and `d47NextState`.
- R2. The packet should extract the smallest missing ingredient for the remaining D01 residual using current evidence: D01 workload envelope, allocated duration, fatigue cap, selected candidate pool, and representative affected cells.
- R3. The packet should compare four forks: `cap_proposal`, `catalog_source_backed_delta`, `accepted_no_change`, and `resume_d47_with_d01_held`.
- R4. The packet should select exactly one recommended fork and may list rejected forks with one-line reasons; if no cap, catalog, or no-change fork is evidence-ready, the selected fork should be `resume_d47_with_d01_held`.
- R5. The packet should state an expected diagnostic movement and a falsification threshold for the selected fork.
- R6. The packet should preserve the training-quality boundary: diagnostic movement can prove workload-envelope honesty, but it cannot claim courtside field validation.
- R7. The packet should not authorize another D01 runtime follow-up unless it names a new causal mechanism beyond block-shape reroute and redistribution handoff, plus a closure threshold.

**Catalog-fill fast path**

- R8. If the selected fork is `catalog_source_backed_delta`, the packet should name the suspected drill-catalog gap in product language, for example "D01 is a short beginner passing drill being asked to carry longer main-skill passing time."
- R9. A catalog fork should identify whether the needed fill is a new drill, a new variant, a source-backed activation of existing reserve content, or a change to an existing variant's supported surface.
- R10. A catalog fork should include enough gap-card-ready evidence to justify catalog-fill planning: affected group keys, affected catalog IDs or missing IDs, exact source path or source needs, adaptation delta, expected diagnostic movement, verification command, checkpoint criteria, an explicit catalog-fill planning readiness status, and an explicit non-activation status.
- R10a. If the packet can only say that catalog work is possible but cannot name the gap-card-ready evidence in R10, it should not select `catalog_source_backed_delta`; it should select `resume_d47_with_d01_held` or another explicit non-catalog fork.
- R11. A catalog fork should route to a source-backed catalog-fill brainstorm/plan without requiring another generic diagnostics ideation pass.
- R12. A catalog fork should keep U6 preview deferred until the catalog or cap proposal is concrete enough to name changed IDs and expected generated-plan diagnostic deltas.

**Cap, no-change, and D47 routes**

- R13. If the selected fork is `cap_proposal`, the packet should state the proposed D01 cap delta, why the authored segments/copy support it, why a catalog fill is not the better answer, and what U6 would preview later.
- R14. If the selected fork is `accepted_no_change`, the packet should record rationale, owner, accepted blast radius, no-action threshold, and revisit trigger.
- R15. If the selected fork is `resume_d47_with_d01_held`, the packet should state why D01 cannot currently name a cap/catalog/no-change delta and how D01 remains visible while D47 resumes.
- R16. The packet should update the parent generated diagnostics workflow with whether D01 is closed, held, still blocking, or handing off to catalog/cap planning.

**Scope and safety**

- R17. Do not edit `app/src/data/drills.ts`, D01 workload metadata, source-backed content, U6 preview tooling, or runtime generation behavior in this slice.
- R18. Do not turn the fork packet into a broad workload scoring system, full catalog coverage map, or UI.
- R19. Do not let the packet close D01 by hiding unresolved diagnostics; every closure or hold state should remain explicit in the generated workbench.

---

## Acceptance Examples

- AE1. **Covers R1-R7.** Given the current D01 receipt reports `insufficient_allocated_pressure`, when the fork packet is generated, then it selects exactly one of cap, catalog, no-change, or D47 resume and explains why another runtime handoff is not the next action.
- AE2. **Covers R8-R12.** Given the smallest missing ingredient is a longer beginner passing carrier and the packet can name gap-card-ready evidence, when the packet selects `catalog_source_backed_delta`, then it names the suspected catalog gap, source path or source needs, expected diagnostic movement, non-activation status, and the next source-backed catalog-fill handoff.
- AE2a. **Covers R4, R10a, R15.** Given D01 still has allocated pressure but the packet cannot name a gap-card-ready catalog path, when the fork packet is generated, then it does not select catalog work and instead resumes D47 with D01 visibly held or chooses another explicit non-catalog fork.
- AE3. **Covers R13.** Given D01's authored copy and segment structure can defend a wider envelope, when the packet selects `cap_proposal`, then it states the cap delta, training hypothesis, rejected catalog alternative, and future U6 preview condition.
- AE4. **Covers R14-R16.** Given no credible cap or catalog delta exists, when the packet closes or holds D01, then it records accepted diagnostic debt or resumes D47 without making D01 disappear from the workflow.
- AE5. **Covers R17-R19.** Given an implementer reviews the slice, when the packet lands, then there are no catalog edits, D01 metadata edits, U6 tooling, runtime generator changes, or hidden unresolved diagnostics.

---

## Success Criteria

- The D01 residual has one named next state rather than another vague follow-up loop.
- If the evidence supports a gap-card-ready catalog/source-backed gap, the next step is actual catalog-fill requirements and planning, not more generic diagnostics ideation.
- If the evidence does not support a gap-card-ready catalog/source-backed gap, D47 resumes with D01 visibly held instead of being blocked by catalog uncertainty.
- If the evidence supports cap or no-change instead, the workflow says so explicitly and avoids adding catalog content just to satisfy diagnostics.
- D47 either has a clear reason to remain blocked or a clear re-entry condition.
- A downstream planner can build the packet without inventing fork options, success thresholds, or scope boundaries.

---

## Scope Boundaries

- Do not add or activate drill catalog content in this requirements slice.
- Do not widen D01 workload metadata in this requirements slice.
- Do not implement U6 preview tooling yet.
- Do not globally solve workload envelope review or catalog coverage.
- Do not claim field training-quality validation without a future manual dogfood receipt.
- Do not require another generic ideation step before catalog fill if this packet selects `catalog_source_backed_delta`.

---

## Key Decisions

- Fork packet before catalog edits: The user wants real catalog gap filling, but the current evidence still has to decide whether D01 needs catalog depth, cap review, accepted no-change, or D47 resume.
- Catalog fast path is evidence-gated: If catalog/source-backed work is selected, the next workflow should start the actual catalog-fill requirements/plan; if the packet only has a vague source candidate, D47 should resume with D01 held instead.
- No more D01 runtime loops by default: Block-shape reroute and redistribution handoff have already tested the obvious runtime mechanisms.
- No-change is a decision, not drift: Accepted diagnostic debt needs rationale and revisit triggers.
- D47 should not stay blocked by ambiguity: If D01 cannot name a concrete next delta, D47 should resume with D01 held visibly.

---

## Dependencies / Assumptions

- The current generated D01 receipt remains: 12 affected cells, `redistributionHandoffState: insufficient_allocated_pressure`, and `d47NextState: cap_or_catalog_proposal_needed`.
- `docs/ops/workload-envelope-authoring-guide.md` owns candidate dispositions and U6/U8 boundaries.
- `docs/reviews/2026-04-30-focus-coverage-gap-cards.md` owns source-backed activation expectations.
- The fork packet can be generated from current diagnostics and docs without new field dogfood data; field validation remains a later training-quality receipt.

---

## Outstanding Questions

### Deferred to Planning

- [Affects R2-R5][Technical] Should the smallest-missing-ingredient evidence be computed from existing D01 receipt facts only, or should the plan add a tiny helper that inspects affected-cell candidate pools?
- [Affects R10-R12][Technical] If the packet selects catalog work, should the next artifact be a new D01-specific source-backed gap card or an extension to `future-gap-block-stretch-pressure`?
- [Affects R16][Technical] Should the D01 fork state render inside the existing D01 fill receipt or as a separate `D01 Cap/Catalog Fork` section?

---

## Next Steps

-> `/ce-plan docs/brainstorms/2026-05-02-generated-diagnostics-d01-cap-catalog-fork-requirements.md`
