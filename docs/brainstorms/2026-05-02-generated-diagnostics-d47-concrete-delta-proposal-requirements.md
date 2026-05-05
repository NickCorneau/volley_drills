---
id: generated-diagnostics-d47-concrete-delta-proposal-requirements-2026-05-02
title: "Generated Diagnostics D47 Concrete Delta Proposal Requirements"
status: active
stage: validation
type: requirements
summary: "Requirements for turning the D47 reentry selection into one concrete delta proposal, with source-backed gap-card work allowed only when D47 can name the changed/missing catalog surface, source need, adaptation delta, expected movement, verification, checkpoint criteria, and why D47 beats the current D05 comparator."
authority: "Requirements addendum for the selected D47 concrete-delta proposal artifact; does not authorize catalog edits, workload metadata edits, source-backed activation, U6 preview tooling, or runtime generator changes."
last_updated: 2026-05-02
depends_on:
  - docs/brainstorms/2026-05-02-gap-closure-selection-workbench-requirements.md
  - docs/brainstorms/2026-05-02-generated-diagnostics-d47-reentry-selection-requirements.md
  - docs/brainstorms/2026-05-02-generated-diagnostics-d47-gap-closure-ledger-requirements.md
  - docs/reviews/2026-05-01-generated-plan-diagnostics-triage.md
  - docs/reviews/2026-04-30-focus-coverage-gap-cards.md
  - docs/reviews/2026-05-02-d47-source-backed-gap-card.md
  - docs/ops/workload-envelope-authoring-guide.md
---

# Generated Diagnostics D47 Concrete Delta Proposal Requirements

## Problem Frame

The generated `Gap Closure Selection` workbench resumes D47 with D01 held, and the current comparator packet now holds both `d47/d47-solo-open` and `d05/d05-solo` for a `D47-vs-D05 comparator evaluation payload`. The D47 concrete-delta path remains the gate D47 must pass before catalog work: D47 must name one concrete delta and explain why it beats the clearer D05 comparator and no-change.

Current D47 evidence is mixed. `d47` / `d47-solo-open` has 30 affected cells in `main_skill` with `optional_slot_redistribution+over_authored_max+over_fatigue_cap`; the D47 ledger records 12 pressure-disappears cells, 18 pressure-remains cells, and 6 non-redistribution-pressure cells. Existing catalog provenance already cites FIVB 4.7 `4 Great Sets` for `d47`; a source-backed catalog path therefore needs a content-depth delta beyond that existing activation, not just a restatement of the current source.

This addendum defines the proposal gate that gets the repo to real catalog work. If D47 can name a source-backed gap-card-ready delta, the next artifact should be a D47 source-backed gap card. If it cannot, the proposal should select generator-policy, workload/cap, block-shape, no-change, or comparator work instead.

---

## Current Evidence

- Selected workbench artifact: `comparator_proposal`.
- Selected target: `d47/d47-solo-open vs d05/d05-solo`.
- Comparator packet outcome: `hold_both_for_evidence`.
- Current next artifact: `D47-vs-D05 comparator evaluation payload`.
- D01 state: held visibly via `resume_d47_with_d01_held`.
- D47 state: current, evidence-gathering, and not authorized for edits.
- Existing source provenance: FIVB 4.7 `4 Great Sets`, already adapted for solo/pair open-court setting reads.
- Existing workload envelope: `d47-solo-open` and `d47-pair-open` are authored for 5-9 minutes with fatigue cap max 9 minutes.
- Blocking issue: D47 has not yet named a concrete changed surface, evidence basis, expected movement, training-quality hypothesis, falsification threshold, no-action threshold, and why the D47 path should beat the D05 comparator.

---

## Actors

- A1. Maintainer: Accepts or rejects the D47 concrete delta and its next artifact.
- A2. Gap author: Turns D47 evidence into exactly one proposal path.
- A3. Source researcher: Supplies source evidence only if the proposal selects a source-backed gap card.
- A4. Planner: Plans the selected artifact without inventing missing product facts.
- A5. Reviewer: Checks that catalog, workload, block-shape, generator-policy, comparator, and no-change paths remain separate.

---

## Requirements

**Proposal shape**

- R1. The proposal should start from the generated `Gap Closure Selection` and D47 ledger, not from affected-cell count alone.
- R2. The proposal should choose exactly one next artifact: `source_backed_gap_card_requirements`, `cap_or_workload_proposal`, `block_shape_proposal`, `generator_policy_hypothesis`, `accepted_no_change_receipt`, `comparator_proposal`, or `hold_for_evidence`.
- R3. The proposal should keep `authorization_status: not_authorized` until the selected next artifact is planned and reviewed.
- R4. The proposal should state the D47 segment it is primarily addressing: pressure that disappears under the redistribution counterfactual, pressure that remains, non-redistribution pressure, or a justified combined segment.
- R5. The proposal should explain why the selected artifact is smaller and more training-quality-preserving than editing `app/src/data/drills.ts` immediately.

**Source-backed catalog gate**

- R6. A source-backed path should be selected only if it can name the changed or missing catalog surface. For D47 this is expected to be either `d47-solo-open`/`d47-pair-open` instruction or workload split changes, or a source-backed sibling drill/variant that covers longer advanced setting/movement work without stretching current D47 beyond its honest envelope.
- R7. A source-backed path should cite the existing D47 provenance first, then state the new content-depth delta that FIVB 4.7 does not already cover in the current catalog.
- R8. A source-backed path should include exact source references when already known, or a narrow source-research need when the next artifact is the gap card itself.
- R9. A source-backed path should include an adaptation delta for solo/pair open-court use, expected diagnostic movement, verification command, and checkpoint criteria before any catalog implementation plan begins.
- R10. If R6-R9 are not satisfied, D47 should not proceed to catalog edits; it should select another proposal path, lose to the comparator, or hold.

**Non-catalog paths**

- R11. A generator-policy path should name the redistribution mechanism that pushes D47 beyond its envelope and keep that separate from catalog or workload metadata changes.
- R12. A workload/cap path should name the exact D47 envelope fact under review and cite the workload-envelope guide basis for changing or rejecting it.
- R13. A block-shape path should name the generated block shape that asks D47 to carry too much and the smallest runtime/assembly surface that would change.
- R14. A no-change path should include acceptance evidence, accepted blast radius, no-action threshold, and revisit trigger.
- R15. A comparator path should name the comparator, why it is clearer than D47, and what would let D47 re-enter later.

**Scope**

- R16. Do not edit drill catalog content, workload metadata, U6 preview tooling, runtime generation, or generated diagnostic policy in this slice.
- R17. Do not use D47's existing FIVB 4.7 source as sufficient evidence for new catalog content unless the proposal names the additional content-depth delta.
- R18. Do not collapse mixed D47 pressure into a generic "needs more catalog" claim.
- R19. Do not require D47 to remain the target if a smaller comparator becomes better evidenced.

---

## Acceptance Examples

- AE1. **Covers R1-R5.** Given the generated workbench selects `d47_concrete_delta_proposal`, when the proposal is written, then it chooses exactly one next artifact and keeps edits not authorized.
- AE2. **Covers R6-R10.** Given D47 already has FIVB 4.7 provenance, when a source-backed path is selected, then the proposal names a new content-depth delta or source-research need beyond the current D47 activation.
- AE3. **Covers R11-R15.** Given D47's pressure is better explained by redistribution, workload envelope, block shape, no-change, or comparator evidence, when the proposal chooses that path, then it does not call the work catalog fill.
- AE4. **Covers R16-R19.** Given an implementation agent reads this document, then no app runtime, catalog, workload, or preview code is changed by this slice.

---

## Success Criteria

- D47 has one concrete next artifact rather than another broad diagnostics search.
- A catalog path can proceed only as a source-backed gap-card requirements artifact, not as immediate catalog implementation.
- If D47 cannot name a source-backed delta, the workflow cleanly routes to generator-policy, workload/cap, block-shape, no-change, comparator, or hold work.
- The next planner can start without inventing changed IDs, evidence needs, expected diagnostic movement, or stop criteria.

---

## Current Recommendation

The D47 source-backed gap-card candidate now lives at `docs/reviews/2026-05-02-d47-source-backed-gap-card.md`. It names a candidate longer-duration advanced setting/movement sibling beyond current FIVB 4.7 coverage, but keeps activation `not_authorized`. The implemented comparator packet currently holds both D47 and D05 until a comparator evaluation payload proves D47, D05, or accepted no-change.

---

## Scope Boundaries

- No changes to `app/src/data/drills.ts`.
- No workload cap widening.
- No U6 preview tooling.
- No runtime generator policy changes.
- No new drill or variant IDs until a source-backed gap card names exact source references, adaptation deltas, verification, and checkpoint criteria.

---

## Key Decisions

- D47 is eligible for source-backed gap-card work, not source-backed catalog implementation, and only after the comparator gate is satisfied.
- Existing D47 provenance is a constraint: new catalog work must add something FIVB 4.7 does not already cover in the current adaptation.
- Mixed-pressure evidence stays mixed until a proposal path proves otherwise.
- Comparator exit remains valid if D47 cannot name a high-quality delta.

---

## Dependencies / Assumptions

- The generated diagnostics report and triage workbench remain fresh.
- `docs/reviews/2026-04-30-focus-coverage-gap-cards.md` remains the activation precedent for source-backed gap cards.
- `docs/ops/workload-envelope-authoring-guide.md` remains the interpretation source for workload and fatigue envelope changes.
- D01 remains held visibly and does not regain a planning-ready cap/catalog/no-change payload before D47 planning begins.

---

## Next Steps

-> Write the `D47-vs-D05 comparator evaluation payload`. If D47 wins, use `docs/reviews/2026-05-02-d47-source-backed-gap-card.md` as the source-backed catalog planning input; if D47 loses or both candidates hold, keep the D47 gap card held.
