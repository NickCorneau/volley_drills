---
id: generated-plan-diagnostics-triage-2026-05-01
title: "Generated Plan Diagnostics Triage"
status: active
stage: validation
type: review
summary: "Docs-first triage workbench and decision-debt compression review for generated-plan routeable observation groups."
authority: "Current triage snapshot for generated-plan diagnostic observation groups; validates stable group identity, conservative routes, stale fingerprint review, and derived decision-debt compression lanes."
last_updated: 2026-05-02
depends_on:
  - app/src/domain/generatedPlanDiagnostics.ts
  - app/src/domain/generatedPlanDiagnosticTriage.ts
  - docs/reviews/2026-05-01-generated-plan-diagnostics-report.md
  - docs/brainstorms/2026-05-02-generated-diagnostics-redistribution-causality-receipt-requirements.md
  - docs/brainstorms/2026-05-02-generated-diagnostics-d47-u6-proposal-admission-requirements.md
  - docs/brainstorms/2026-05-02-generated-diagnostics-d47-gap-closure-ledger-requirements.md
  - docs/brainstorms/2026-05-02-generated-diagnostics-d01-comparator-gap-fill-proposal-requirements.md
  - docs/brainstorms/2026-05-02-generated-diagnostics-d01-workload-block-shape-proposal-requirements.md
  - docs/brainstorms/2026-05-02-generated-diagnostics-d01-block-shape-fill-requirements.md
  - docs/brainstorms/2026-05-02-generated-diagnostics-d01-redistribution-handoff-requirements.md
  - docs/brainstorms/2026-05-02-generated-diagnostics-d01-cap-catalog-fork-requirements.md
  - docs/brainstorms/2026-05-02-gap-closure-selection-workbench-requirements.md
  - docs/brainstorms/2026-05-02-generated-diagnostics-d47-reentry-selection-requirements.md
  - docs/brainstorms/2026-05-02-generated-diagnostics-d47-concrete-delta-proposal-requirements.md
  - docs/reviews/2026-05-02-d47-source-backed-gap-card.md
  - docs/reviews/2026-05-02-d47-d05-comparator-evaluation-payload.md
  - docs/plans/2026-05-02-001-feat-d47-proposal-admission-ticket-plan.md
  - docs/plans/2026-05-02-003-feat-d47-gap-closure-ledger-plan.md
  - docs/plans/2026-05-02-004-feat-d01-gap-fill-proposal-plan.md
  - docs/plans/2026-05-02-006-feat-d01-workload-block-shape-proposal-plan.md
  - docs/plans/2026-05-02-007-feat-d01-block-shape-fill-plan.md
  - docs/plans/2026-05-02-008-feat-d01-redistribution-handoff-plan.md
  - docs/plans/2026-05-02-010-feat-d01-cap-catalog-fork-plan.md
  - docs/plans/2026-05-02-011-feat-gap-closure-selection-workbench-plan.md
  - docs/plans/2026-05-02-012-feat-d47-d05-comparator-decision-packet-plan.md
  - docs/plans/2026-05-02-013-feat-d47-d05-comparator-evaluation-payload-plan.md
  - docs/plans/2026-05-02-018-feat-d49-residual-follow-up-plan.md
---

# Generated Plan Diagnostics Triage

## Purpose

Record the current docs-first triage workbench for generated-plan routeable observation groups. This file is fully generated and validated by `npm run diagnostics:report:check`.

## Interpretation

This workbench does not authorize catalog changes. It routes generated-plan observations into conservative decision lanes and compresses unresolved rows into derived human review prompts so maintainers can decide whether a group is a policy allowance, cap review, block split, source-backed content-depth item, or generator-policy investigation.

## Triage Summary

- Current routeable groups: 58
- Registry entries: 58
- Blocking validation issues: 0
- Warning validation issues: 0

## Route Counts

- `defer`: 35
- `generator_policy_investigation`: 23

## Decision-Debt Compression

### Short-session cooldown minimum

- Lane: `short_session_cooldown_minimum`
- Question: Is the short wrap envelope acceptable, or does this need cap/block/content follow-up?
- Why this lane: Wrap under-min groups are likely cooldown policy questions before they are catalog gaps.
- Groups: 1; total affected cells: 79
- Redistribution-affected cells: 0
- Non-redistribution over-cap cells: 0
- Route mix: `defer` 1
- Disposition: `needs_human_decision`
- Candidate dispositions: `accepted_policy_allowance`, `metadata_review_needed`, `block_shape_review_needed`
- Recommended follow-up: U7 workload envelope guidance
- Guide: `docs/ops/workload-envelope-authoring-guide.md#short-session-cooldown-minimum`
- Next evidence needed: Review cooldown minimum policy and decide whether U7 workload guidance should encode it.
- Group keys: `gpdg:v1:d25:d25-solo:wrap:true:under_authored_min`

### Technique under-min review

- Lane: `technique_under_min_review`
- Question: Are technique slots intentionally below authored minimums, or should catalog depth/block shape change?
- Why this lane: Technique under-min groups need human review before source-backed content or block-split work.
- Groups: 12; total affected cells: 121
- Redistribution-affected cells: 0
- Non-redistribution over-cap cells: 0
- Route mix: `defer` 12
- Disposition: `needs_human_decision`
- Candidate dispositions: `accepted_policy_allowance`, `metadata_review_needed`, `block_shape_review_needed`, `source_depth_candidate`
- Recommended follow-up: U7 workload envelope guidance
- Guide: `docs/ops/workload-envelope-authoring-guide.md#technique-under-min-review`
- Next evidence needed: Review whether these technique slots are acceptable short-form drills or content-depth candidates.
- Group keys: `gpdg:v1:d07:d07-solo-open:technique:true:under_authored_min`, `gpdg:v1:d33:d33-solo-open:technique:true:under_authored_min`, `gpdg:v1:d22:d22-solo-open:technique:true:under_authored_min`, `gpdg:v1:d38:d38-solo:technique:true:under_authored_min`, `gpdg:v1:d39:d39-solo:technique:true:under_authored_min`, `gpdg:v1:d48:d48-solo-open:technique:true:under_authored_min`, `gpdg:v1:d33:d33-pair-open:technique:true:under_authored_min`, `gpdg:v1:d07:d07-pair-open:technique:true:under_authored_min`, `gpdg:v1:d22:d22-pair-open:technique:true:under_authored_min`, `gpdg:v1:d48:d48-pair-open:technique:true:under_authored_min`, `gpdg:v1:d33:d33-pair:technique:true:under_authored_min`, `gpdg:v1:d33:d33-solo-net:technique:true:under_authored_min`

### Workload envelope review

- Lane: `workload_envelope_review`
- Question: Are duration and fatigue envelopes correct for these generated allocations?
- Why this lane: Over/under envelope pressure is a workload-policy question before catalog edits.
- Groups: 22; total affected cells: 132
- Redistribution-affected cells: 0
- Non-redistribution over-cap cells: 67
- Route mix: `defer` 22
- Disposition: `needs_human_decision`
- Candidate dispositions: `metadata_review_needed`, `block_shape_review_needed`, `requires_U6_preview`, `no_implementation_action_yet`
- Recommended follow-up: U7 workload envelope guidance
- Guide: `docs/ops/workload-envelope-authoring-guide.md#workload-envelope-review`
- Next evidence needed: Review cap policy and block split thresholds for the affected main-skill groups.
- Group keys: `gpdg:v1:d33:d33-solo-open:main_skill:true:under_authored_min`, `gpdg:v1:d01:d01-solo:technique:true:over_authored_max+over_fatigue_cap`, `gpdg:v1:d33:d33-pair-open:main_skill:true:under_authored_min`, `gpdg:v1:d49:d49-solo-open:main_skill:true:under_authored_min`, `gpdg:v1:d05:d05-pair:main_skill:true:over_authored_max+over_fatigue_cap`, `gpdg:v1:d22:d22-solo-open:main_skill:true:under_authored_min`, `gpdg:v1:d01:d01-solo:movement_proxy:false:over_authored_max+over_fatigue_cap`, `gpdg:v1:d01:d01-pair:pressure:false:over_authored_max+over_fatigue_cap`, `gpdg:v1:d11:d11-solo:main_skill:true:over_authored_max+over_fatigue_cap`, `gpdg:v1:d22:d22-pair-open:main_skill:true:under_authored_min`, `gpdg:v1:d47:d47-solo-open:main_skill:true:over_authored_max+over_fatigue_cap`, `gpdg:v1:d10:d10-pair:main_skill:true:over_authored_max+over_fatigue_cap`, `gpdg:v1:d49:d49-pair-open:main_skill:true:under_authored_min`, `gpdg:v1:d01:d01-solo:pressure:false:over_authored_max+over_fatigue_cap`, `gpdg:v1:d07:d07-solo-open:main_skill:true:over_authored_max+over_fatigue_cap`, `gpdg:v1:d33:d33-solo-net:main_skill:true:under_authored_min`, `gpdg:v1:d03:d03-pair:main_skill:true:over_authored_max+over_fatigue_cap`, `gpdg:v1:d22:d22-pair:main_skill:true:under_authored_min`, `gpdg:v1:d22:d22-solo:main_skill:true:under_authored_min`, `gpdg:v1:d38:d38-pair:main_skill:true:over_authored_max+over_fatigue_cap`, `gpdg:v1:d01:d01-pair:technique:true:over_authored_max+over_fatigue_cap`, `gpdg:v1:d11:d11-pair:pressure:false:over_authored_max+over_fatigue_cap`

### Generator redistribution investigation

- Lane: `generator_redistribution_investigation`
- Question: Would these over-cap groups still exist without optional-slot redistribution?
- Why this lane: Redistribution evidence means generator policy should be investigated before catalog changes.
- Groups: 23; total affected cells: 231
- Redistribution-affected cells: 228
- Non-redistribution over-cap cells: 3
- Route mix: `generator_policy_investigation` 23
- Disposition: `needs_human_decision`
- Candidate dispositions: `route_to_U8`
- Recommended follow-up: U8 redistribution comparison
- Next evidence needed: Compare redistribution-affected cells against non-redistribution over-cap cells.
- Group keys: `gpdg:v1:d33:d33-solo-open:main_skill:true:optional_slot_redistribution+over_authored_max+over_fatigue_cap`, `gpdg:v1:d33:d33-pair-open:main_skill:true:optional_slot_redistribution+over_authored_max+over_fatigue_cap`, `gpdg:v1:d46:d46-solo-open:main_skill:true:optional_slot_redistribution+over_authored_max+over_fatigue_cap`, `gpdg:v1:d46:d46-pair-open:main_skill:true:optional_slot_redistribution+over_authored_max+over_fatigue_cap`, `gpdg:v1:d05:d05-solo:main_skill:true:optional_slot_redistribution+over_authored_max+over_fatigue_cap`, `gpdg:v1:d31:d31-solo-open:main_skill:true:optional_slot_redistribution+over_authored_max+over_fatigue_cap`, `gpdg:v1:d01:d01-solo:main_skill:true:optional_slot_redistribution+over_authored_max+over_fatigue_cap`, `gpdg:v1:d40:d40-solo:main_skill:true:optional_slot_redistribution+over_authored_max+over_fatigue_cap`, `gpdg:v1:d49:d49-solo-open:main_skill:true:optional_slot_redistribution+over_authored_max+over_fatigue_cap`, `gpdg:v1:d22:d22-solo-open:main_skill:true:optional_slot_redistribution`, `gpdg:v1:d22:d22-solo-open:main_skill:true:optional_slot_redistribution+over_authored_max+over_fatigue_cap`, `gpdg:v1:d49:d49-pair-open:main_skill:true:optional_slot_redistribution+over_authored_max+over_fatigue_cap`, `gpdg:v1:d22:d22-pair-open:main_skill:true:optional_slot_redistribution`, `gpdg:v1:d22:d22-pair-open:main_skill:true:optional_slot_redistribution+over_authored_max+over_fatigue_cap`, `gpdg:v1:d31:d31-pair-open:main_skill:true:optional_slot_redistribution+over_authored_max+over_fatigue_cap`, `gpdg:v1:d33:d33-solo-net:main_skill:true:optional_slot_redistribution+over_authored_max+over_fatigue_cap`, `gpdg:v1:d49:d49-pair-open:main_skill:true:optional_slot_redistribution`, `gpdg:v1:d49:d49-solo-open:main_skill:true:optional_slot_redistribution`, `gpdg:v1:d22:d22-pair:main_skill:true:optional_slot_redistribution`, `gpdg:v1:d22:d22-pair:main_skill:true:optional_slot_redistribution+over_authored_max+over_fatigue_cap`, `gpdg:v1:d22:d22-solo:main_skill:true:optional_slot_redistribution`, `gpdg:v1:d22:d22-solo:main_skill:true:optional_slot_redistribution+over_authored_max+over_fatigue_cap`, `gpdg:v1:d31:d31-pair:main_skill:true:optional_slot_redistribution+over_authored_max+over_fatigue_cap`


## Redistribution Causality Receipt

- Comparison mode: `allocated_duration_counterfactual`
- Runtime boundary: Diagnostic-only counterfactual receipt; shipped buildDraft() behavior may include separately authorized fills such as the D01 block-shape fill.
- Groups: 23; total affected cells: 231
- Redistribution-affected cells: 228
- Current pressure cells: over authored max 199, over fatigue cap 199, under authored min 0
- Allocated-duration pressure cells: over authored max 52, over fatigue cap 52, under authored min 12
- Non-redistribution pressure cells: over cap 3, under authored min 0
- Pressure disappears under allocated-duration counterfactual: 147
- Pressure remains without redistribution: 52
- Comparison inconclusive cells: 0
- Redistribution without cap/min pressure cells: 32
- Counterfactual unfilled minutes across affected cells: 2004

### Redistribution Causality Groups

- `gpdg:v1:d33:d33-solo-open:main_skill:true:optional_slot_redistribution+over_authored_max+over_fatigue_cap`: action `likely_redistribution_caused`, dominant `likely_redistribution_caused`, incomplete evidence no, pressure disappears 28, pressure remains 0, non-redistribution pressure 0, inconclusive 0, follow-up `future_generator_policy_decision`
- `gpdg:v1:d33:d33-pair-open:main_skill:true:optional_slot_redistribution+over_authored_max+over_fatigue_cap`: action `likely_redistribution_caused`, dominant `likely_redistribution_caused`, incomplete evidence no, pressure disappears 24, pressure remains 0, non-redistribution pressure 0, inconclusive 0, follow-up `future_generator_policy_decision`
- `gpdg:v1:d46:d46-solo-open:main_skill:true:optional_slot_redistribution+over_authored_max+over_fatigue_cap`: action `pressure_remains_without_redistribution`, dominant `mixed_cell_states`, incomplete evidence no, pressure disappears 12, pressure remains 12, non-redistribution pressure 0, inconclusive 0, follow-up `workload_review`, `block_shape_review`, `source_backed_proposal_work`, `u6_proposal_admission_candidate`, `future_generator_policy_decision`
- `gpdg:v1:d46:d46-pair-open:main_skill:true:optional_slot_redistribution+over_authored_max+over_fatigue_cap`: action `pressure_remains_without_redistribution`, dominant `mixed_cell_states`, incomplete evidence no, pressure disappears 8, pressure remains 8, non-redistribution pressure 0, inconclusive 0, follow-up `workload_review`, `block_shape_review`, `source_backed_proposal_work`, `u6_proposal_admission_candidate`, `future_generator_policy_decision`
- `gpdg:v1:d05:d05-solo:main_skill:true:optional_slot_redistribution+over_authored_max+over_fatigue_cap`: action `pressure_remains_without_redistribution`, dominant `pressure_remains_without_redistribution`, incomplete evidence no, pressure disappears 6, pressure remains 9, non-redistribution pressure 3, inconclusive 0, follow-up `workload_review`, `block_shape_review`, `source_backed_proposal_work`, `u6_proposal_admission_candidate`, `future_generator_policy_decision`
- `gpdg:v1:d31:d31-solo-open:main_skill:true:optional_slot_redistribution+over_authored_max+over_fatigue_cap`: action `pressure_remains_without_redistribution`, dominant `mixed_cell_states`, incomplete evidence no, pressure disappears 7, pressure remains 7, non-redistribution pressure 0, inconclusive 0, follow-up `workload_review`, `block_shape_review`, `source_backed_proposal_work`, `u6_proposal_admission_candidate`, `future_generator_policy_decision`
- `gpdg:v1:d01:d01-solo:main_skill:true:optional_slot_redistribution+over_authored_max+over_fatigue_cap`: action `pressure_remains_without_redistribution`, dominant `pressure_remains_without_redistribution`, incomplete evidence no, pressure disappears 0, pressure remains 12, non-redistribution pressure 0, inconclusive 0, follow-up `workload_review`, `block_shape_review`, `source_backed_proposal_work`, `u6_proposal_admission_candidate`
- `gpdg:v1:d40:d40-solo:main_skill:true:optional_slot_redistribution+over_authored_max+over_fatigue_cap`: action `likely_redistribution_caused`, dominant `likely_redistribution_caused`, incomplete evidence no, pressure disappears 12, pressure remains 0, non-redistribution pressure 0, inconclusive 0, follow-up `future_generator_policy_decision`
- `gpdg:v1:d49:d49-solo-open:main_skill:true:optional_slot_redistribution+over_authored_max+over_fatigue_cap`: action `likely_redistribution_caused`, dominant `likely_redistribution_caused`, incomplete evidence no, pressure disappears 12, pressure remains 0, non-redistribution pressure 0, inconclusive 0, follow-up `future_generator_policy_decision`
- `gpdg:v1:d22:d22-solo-open:main_skill:true:optional_slot_redistribution`: action `redistribution_without_pressure`, dominant `redistribution_without_pressure`, incomplete evidence no, pressure disappears 0, pressure remains 0, non-redistribution pressure 0, inconclusive 0, follow-up `no_implementation_action_yet`
- `gpdg:v1:d22:d22-solo-open:main_skill:true:optional_slot_redistribution+over_authored_max+over_fatigue_cap`: action `likely_redistribution_caused`, dominant `likely_redistribution_caused`, incomplete evidence no, pressure disappears 10, pressure remains 0, non-redistribution pressure 0, inconclusive 0, follow-up `future_generator_policy_decision`
- `gpdg:v1:d49:d49-pair-open:main_skill:true:optional_slot_redistribution+over_authored_max+over_fatigue_cap`: action `likely_redistribution_caused`, dominant `likely_redistribution_caused`, incomplete evidence no, pressure disappears 8, pressure remains 0, non-redistribution pressure 0, inconclusive 0, follow-up `future_generator_policy_decision`
- `gpdg:v1:d22:d22-pair-open:main_skill:true:optional_slot_redistribution`: action `redistribution_without_pressure`, dominant `redistribution_without_pressure`, incomplete evidence no, pressure disappears 0, pressure remains 0, non-redistribution pressure 0, inconclusive 0, follow-up `no_implementation_action_yet`
- `gpdg:v1:d22:d22-pair-open:main_skill:true:optional_slot_redistribution+over_authored_max+over_fatigue_cap`: action `likely_redistribution_caused`, dominant `likely_redistribution_caused`, incomplete evidence no, pressure disappears 6, pressure remains 0, non-redistribution pressure 0, inconclusive 0, follow-up `future_generator_policy_decision`
- `gpdg:v1:d31:d31-pair-open:main_skill:true:optional_slot_redistribution+over_authored_max+over_fatigue_cap`: action `pressure_remains_without_redistribution`, dominant `mixed_cell_states`, incomplete evidence no, pressure disappears 3, pressure remains 3, non-redistribution pressure 0, inconclusive 0, follow-up `workload_review`, `block_shape_review`, `source_backed_proposal_work`, `u6_proposal_admission_candidate`, `future_generator_policy_decision`
- `gpdg:v1:d33:d33-solo-net:main_skill:true:optional_slot_redistribution+over_authored_max+over_fatigue_cap`: action `likely_redistribution_caused`, dominant `likely_redistribution_caused`, incomplete evidence no, pressure disappears 6, pressure remains 0, non-redistribution pressure 0, inconclusive 0, follow-up `future_generator_policy_decision`
- `gpdg:v1:d49:d49-pair-open:main_skill:true:optional_slot_redistribution`: action `redistribution_without_pressure`, dominant `redistribution_without_pressure`, incomplete evidence no, pressure disappears 0, pressure remains 0, non-redistribution pressure 0, inconclusive 0, follow-up `no_implementation_action_yet`
- `gpdg:v1:d49:d49-solo-open:main_skill:true:optional_slot_redistribution`: action `redistribution_without_pressure`, dominant `redistribution_without_pressure`, incomplete evidence no, pressure disappears 0, pressure remains 0, non-redistribution pressure 0, inconclusive 0, follow-up `no_implementation_action_yet`
- `gpdg:v1:d22:d22-pair:main_skill:true:optional_slot_redistribution`: action `redistribution_without_pressure`, dominant `redistribution_without_pressure`, incomplete evidence no, pressure disappears 0, pressure remains 0, non-redistribution pressure 0, inconclusive 0, follow-up `no_implementation_action_yet`
- `gpdg:v1:d22:d22-pair:main_skill:true:optional_slot_redistribution+over_authored_max+over_fatigue_cap`: action `likely_redistribution_caused`, dominant `likely_redistribution_caused`, incomplete evidence no, pressure disappears 2, pressure remains 0, non-redistribution pressure 0, inconclusive 0, follow-up `future_generator_policy_decision`
- `gpdg:v1:d22:d22-solo:main_skill:true:optional_slot_redistribution`: action `redistribution_without_pressure`, dominant `redistribution_without_pressure`, incomplete evidence no, pressure disappears 0, pressure remains 0, non-redistribution pressure 0, inconclusive 0, follow-up `no_implementation_action_yet`
- `gpdg:v1:d22:d22-solo:main_skill:true:optional_slot_redistribution+over_authored_max+over_fatigue_cap`: action `likely_redistribution_caused`, dominant `likely_redistribution_caused`, incomplete evidence no, pressure disappears 2, pressure remains 0, non-redistribution pressure 0, inconclusive 0, follow-up `future_generator_policy_decision`
- `gpdg:v1:d31:d31-pair:main_skill:true:optional_slot_redistribution+over_authored_max+over_fatigue_cap`: action `pressure_remains_without_redistribution`, dominant `mixed_cell_states`, incomplete evidence no, pressure disappears 1, pressure remains 1, non-redistribution pressure 0, inconclusive 0, follow-up `workload_review`, `block_shape_review`, `source_backed_proposal_work`, `u6_proposal_admission_candidate`, `future_generator_policy_decision`

## D47 Proposal Admission Ticket

- Candidate: `gpdg:v1:d47:d47-solo-open:main_skill:true:optional_slot_redistribution+over_authored_max+over_fatigue_cap`
- Admission state: `evidence_gathering`
- Candidate group is not present in the current redistribution causality receipt.

## D47 Gap Closure Ledger

- Ledger source: D47 proposal-admission ticket plus U8 redistribution causality receipt.
- Candidate: `gpdg:v1:d47:d47-solo-open:main_skill:true:optional_slot_redistribution+over_authored_max+over_fatigue_cap`
- Currentness: `closed_by_d49`
- Gap type: `drill_inventory_gap`
- Decision state: `closed_validated`
- Authorization status: `closed_with_fill`
- Suspected training gap: The D47 source-backed content-depth gap was implemented through D49; remaining pressure now belongs to D49 workload/redistribution follow-up.
- Source provenance: Existing D47 provenance: FIVB Drill-book 4.7 Four Great Sets, activated in focus-readiness batch 3.
- Source delta boundary: A drill-inventory gap must name content depth beyond the existing FIVB 4.7 activation before catalog work.
- Receipt facts: total affected cells 0, pressure disappears 0, pressure remains 0, non-redistribution pressure 0, inconclusive 0

### Comparator Receipt

- Comparator kind: `no_change_baseline`
- Comparator candidate: no-change baseline
- Comparator rationale: No simpler current receipt candidate with non-redistribution pressure is available; compare D47 against a no-change baseline before selecting it.
- Simpler than D47: no
- Higher-confidence than D47: no
- Comparator facts: baseline only, no receipt candidate selected.

### Segment Dispositions

- Pressure disappears under counterfactual: cells 0, gap `drill_inventory_gap`, decision `closed_validated`, authorization `closed_with_fill`; The original D47 optional-redistribution comparator key is absent after D49 selection-path implementation.
- Pressure remains without redistribution: cells 0, gap `drill_inventory_gap`, decision `closed_validated`, authorization `closed_with_fill`; The D47 source-backed content-depth path was implemented as D49; no D47 stable-key pressure remains.
- Non-redistribution pressure: cells 0, gap `drill_inventory_gap`, decision `closed_validated`, authorization `closed_with_fill`; Non-redistribution evidence for the original D47 comparator key closed when D49 absorbed the advanced setting depth surface.

### Next Artifact

- Artifact: `d49_residual_follow_up`
- Owner: `maintainer`
- Evidence source: Regenerated diagnostics after D49 catalog and selection-path implementation.
- Promotion criteria: Promote residual work only against D49 workload or redistribution evidence, not the closed D47 comparator key.
- Abandon criteria: Re-enter D47 only if regenerated diagnostics recreate the original D47 comparator pressure.
- No-change criteria: No-change is not the current state; D49 was implemented and residual D49 evidence remains visible.
- No-change burden: No-change closure requires dispositions for pressure-disappears, pressure-remains, and non-redistribution pressure segments.
- Reassessment result: `validated`
- Reassessment boundary: D47 diagnostic movement is validated by the missing stable comparator key; residual D49 pressure still needs workload/redistribution review.

## D01 Gap-Fill Proposal

- Proposal source: D47 gap closure comparator receipt for `d01` / `d01-solo`.
- Candidate: `gpdg:v1:d01:d01-solo:main_skill:true:optional_slot_redistribution+over_authored_max+over_fatigue_cap`
- Currentness: `current`
- D47 relationship: `d47_missing_or_shifted`
- Gap type: `programming_shape_gap`
- Decision state: `evidence_gathering`
- Authorization status: `not_authorized`
- Suspected training gap: D01 may be a short beginner passing drill being asked to occupy too much main-skill time; the first fill proposal should decide whether to widen workload metadata, split/repeat the block shape, or accept the pressure by policy.
- Target surface: `d01-solo` workload envelope (`durationMaxMinutes: 5`, `fatigueCap.maxMinutes: 5`) and generated main-skill block shape.
- Primary closure path: `combined_workload_block_shape_review`
- Receipt facts: total affected cells 12, pressure disappears 0, pressure remains 12, non-redistribution pressure 0, inconclusive 0
- Source-backed content path: Blocked until a content-depth delta beyond existing D01 passing catalog content is named with source evidence.
- Generator-policy path: Blocked until a generator-policy hypothesis explains why runtime assembly should change instead of workload/block shape.

### Next Artifact

- Artifact: `workload_block_shape_proposal`
- Owner: `maintainer`
- Evidence source: Current D01 comparator receipt from the D47 gap closure ledger.
- Promotion criteria: Promote D01 when a proposal chooses widen, split/repeat, or policy-acceptance with expected diagnostic and training-quality movement.
- Abandon criteria: Return to D47 or another candidate if D01 cannot name a concrete workload/block-shape target surface.
- No-change criteria: Close without fill only when the remaining pressure is policy-accepted with a no-action threshold and revisit trigger.
- Expected diagnostic movement: Future fill should reduce D01 over-cap/fatigue pressure, route it to an accepted policy allowance, or document why remaining pressure is harmless.
- Expected training-quality movement: Future fill should improve workload honesty or block-shape coherence for beginner passing without pretending catalog content changed.
- Reassessment result: `not_started`
- Reassessment boundary: This slice records proposal quality only; actual diagnostic and training-quality reassessment waits for a future authorized D01 fill.

## D01 Workload Block-Shape Proposal

- Proposal source: D01 gap-fill proposal plus workload envelope authoring guide.
- Candidate: `gpdg:v1:d01:d01-solo:main_skill:true:optional_slot_redistribution+over_authored_max+over_fatigue_cap`
- Currentness: `current`
- Authorization status: `not_authorized`
- Selected disposition: `block_shape_review_needed`
- Secondary disposition: `metadata_review_needed`
- Metadata action: `unchanged`
- Target surface: `d01-solo` workload envelope (`durationMaxMinutes: 5`, `fatigueCap.maxMinutes: 5`) and generated main-skill block shape.
- Evidence layer: Generated trace and block allocation are primary; D01 variant workload metadata is secondary.
- Recommended future fill shape: Future fill should split, repeat, or reroute the main-skill shape instead of stretching one short beginner passing drill.
- Block-shape rationale: D01 copy and streak scoring describe short repeated-contact work, not a long continuous main-skill workload.
- Expected diagnostic movement: A future block-shape fill should reduce D01 over-cap/fatigue pressure or route remaining pressure to an accepted policy allowance.
- Expected training-quality movement: A future fill should make beginner passing sessions feel more honest by reducing fatigue drift and clarifying when D01 repeats versus when another drill should carry the block.
- No-action threshold: No change is acceptable only if remaining D01 pressure is explicitly policy-accepted with no cap widening and no hidden generator change.
- Revisit trigger: Revisit if regenerated D01 pressure increases, D01 becomes a top affected group again after a block-shape fill, or a concrete cap proposal is authored.
- Source-backed content disposition: `source_depth_blocked`
- Generator-policy disposition: `generator_policy_blocked`
- U6 eligibility: `blocked_until_concrete_block_or_cap_proposal`
- Reassessment result: `not_started`
- Reassessment boundary: This proposal chooses the future fill direction only; actual diagnostic and training-quality reassessment waits for an authorized block-shape or cap proposal.

## D01 Block-Shape Fill Receipt

- Fill source: D01 workload/block-shape proposal.
- Target group: `gpdg:v1:d01:d01-solo:main_skill:true:optional_slot_redistribution+over_authored_max+over_fatigue_cap`
- Target found: yes
- Diagnostic movement: `partially_validated`
- Training-quality state: `not_field_validated`
- Redistribution handoff state: `insufficient_allocated_pressure`
- Redistribution handoff reason: The current D01 target remains over cap even under allocated-duration comparison, so moving skipped optional minutes cannot close the gap.
- D47 next state: `cap_or_catalog_proposal_needed`
- Applied fill: Duration-aware D01 main-skill reroute: avoid stretching `d01-solo` beyond its authored max/fatigue cap when an eligible same-slot candidate can carry more of the block.
- Metadata action: `unchanged`
- Source-backed content disposition: `source_depth_blocked`
- U6 eligibility: `deferred_no_cap_or_catalog_delta`
- Baseline receipt: total affected cells 18, pressure disappears 0, pressure remains 18, non-redistribution pressure 6, inconclusive 0
- Current receipt: total affected cells 12, pressure disappears 0, pressure remains 12, non-redistribution pressure 0, inconclusive 0
- Diagnostic summary: The D01 fill reduced the target receipt but did not close every current D01 pressure cell.
- Training-quality boundary: Generated diagnostics can validate workload-envelope movement, but field training quality remains unvalidated until a manual courtside dogfood receipt exists.
- Remaining action: Keep the D01 fill receipt open; remaining D01 pressure needs either a redistribution-specific block-shape decision or a later concrete cap/catalog proposal.

## D01 Cap/Catalog Fork Packet

- Packet source: D01 block-shape fill receipt plus cap/catalog fork requirements.
- Target group: `gpdg:v1:d01:d01-solo:main_skill:true:optional_slot_redistribution+over_authored_max+over_fatigue_cap`
- Target found: yes
- Currentness: `current`
- Selection state: `selected`
- Selected fork: `resume_d47_with_d01_held`
- Selected-fork reason: No cap, catalog, or no-change payload is planning-ready, so D47 should resume with D01 held visibly instead of blocking behind vague catalog uncertainty.
- Parent D47 state: `d47_resumed_d01_held`
- Planning authorization status: `not_ready_for_catalog_fill_planning`
- Activation status: `not_authorized`
- Expected diagnostic movement: No D01 movement is expected until a cap, catalog, or no-change payload becomes planning-ready.
- Falsification threshold: Reopen D01 as blocking only when a complete cap, catalog, or no-change evaluation payload is available.
- Next artifact: `resume_d47_with_d01_held`
- Rejected forks: `cap_proposal` (No complete cap evaluation payload names a cap delta, copy support, rejected catalog rationale, U6 condition, and falsification threshold.); `catalog_source_backed_delta` (No gap-card-ready catalog evaluation payload names changed or missing IDs, source path or needs, adaptation delta, verification, and checkpoint criteria.); `accepted_no_change` (No complete no-change evaluation payload names owner, rationale, accepted blast radius, no-action threshold, and revisit trigger.)

## Gap Closure Selection

- Selection source: D01 cap/catalog fork packet plus D47 gap closure ledger.
- Selection state: `selected`
- Selected target: `d47/d47-solo-open closed by d49`
- Selected artifact: `d47_closed_by_d49_receipt`
- Selected reason: D47 source-backed catalog work has moved the original D47 comparator pressure onto D49; remaining evidence should be handled as D49 residual workload or redistribution follow-up.
- Authorization status: `not_authorized`
- D01 state: `selected:resume_d47_with_d01_held:d47_resumed_d01_held`
- D47 state: `closed_by_d49:closed_validated:closed_with_fill`
- Next artifact: D49 residual redistribution/workload follow-up
- Stop condition: Do not reopen D47 unless regenerated diagnostics recreate the original D47 comparator key; route remaining advanced setting stretch through D49.

### Rejected Alternatives

- D25 cooldown policy receipt (`gpdg:v1:d25:d25-solo:wrap:true:under_authored_min`, 79 cells): Largest affected count, but wrap under-min pressure routes to cooldown policy review before catalog work. Re-entry trigger: Promote when the next product question is accepting or revising short-session Downshift policy.
- D05 comparator proposal (`gpdg:v1:d05:d05-solo:main_skill:true:optional_slot_redistribution+over_authored_max+over_fatigue_cap`, 15 cells): Strong comparator, but first use D47 reentry to decide whether D47 can name stronger causal warrant than the comparator. Re-entry trigger: Promote if D47 cannot name a concrete delta or if comparator evidence becomes the smaller artifact.
- Adjacent advanced mixed-pressure group (`gpdg:v1:d46:d46-solo-open:main_skill:true:optional_slot_redistribution+over_authored_max+over_fatigue_cap`, 24 cells): Relevant advanced-depth signal, but less directly tied to the current D01-held / D47-reentry fork. Re-entry trigger: Promote after D47 reentry closes, holds, or rejects its concrete-delta path.

## D49 Residual Follow-Up

- Packet source: D47 closed-by-D49 gap closure ledger plus current D49 generated diagnostics.
- D47 closure state: `closed_by_d49`
- Authorization status: `not_authorized`
- Activation boundary: D49 remains bounded to the authorized solo/pair open advanced setting/movement family: one ball, markers, no 3+ player source forms, and no generic conditioning expansion. This packet does not widen D49 caps, add content, or change D47/D05.
- Training-quality boundary: Generated diagnostics can route workload and redistribution questions, but D49 training quality still needs manual courtside validation before broader claims.
- Next artifact: D49 workload envelope review plus U8 redistribution follow-up
- Stop condition: Do not edit catalog metadata, add catalog content, change runtime redistribution, or reopen D47 from this packet alone.
- D47 re-entry condition: Re-enter D47 only if regenerated diagnostics recreate the original D47 comparator key.

### D49 workload envelope review

- Disposition: `workload_review_needed`
- Total affected cells: 16
- Evidence summary: D49 under-min main-skill groups should be reviewed against block allocation, copy, and workload metadata before any cap or catalog proposal.
- Next artifact: D49 workload envelope review; no metadata change without a concrete proposal.
- Group keys: `gpdg:v1:d49:d49-solo-open:main_skill:true:under_authored_min`, `gpdg:v1:d49:d49-pair-open:main_skill:true:under_authored_min`

### D49 redistribution investigation

- Disposition: `route_to_u8`
- Total affected cells: 32
- Evidence summary: D49 redistribution receipt groups include 20 cells where pressure disappears under allocated-duration comparison, 0 cells where pressure remains, and 12 redistribution-only cells.
- Next artifact: U8 generator-policy follow-up; do not change runtime redistribution here.
- Group keys: `gpdg:v1:d49:d49-solo-open:main_skill:true:optional_slot_redistribution+over_authored_max+over_fatigue_cap`, `gpdg:v1:d49:d49-pair-open:main_skill:true:optional_slot_redistribution+over_authored_max+over_fatigue_cap`, `gpdg:v1:d49:d49-pair-open:main_skill:true:optional_slot_redistribution`, `gpdg:v1:d49:d49-solo-open:main_skill:true:optional_slot_redistribution`

## D47 vs D05 Comparator Evaluation Payload

- Payload source: `docs/reviews/2026-05-02-d47-d05-comparator-evaluation-payload.md`
- Selected proof path: `d47_wins`
- Score semantics: Scores are ordinal comparator evidence where higher is better; maintenanceCostScore means lower maintenance cost and clearer ownership when higher.
- Served segment: advanced open-court setting and movement practice
- Session exposure: D47 is current in generated main-skill pressure with 30 affected cells, 18 cells that remain under allocated-duration comparison, and 6 non-redistribution pressure cells.
- Perceived session failure: Advanced setting sessions can overuse the current short 5-9 minute D47 surface when the training need is repeated out-of-system movement and set quality under fatigue.
- Changed surface: Use the held D47 source-backed gap card as input for a candidate D49-style advanced setting/movement sibling family; do not widen current D47 caps in this payload.
- Smallest action: Plan a source-backed catalog addition from the D47 gap card next, while preserving D05 as a re-entry comparator if source/adaptation review fails.
- Source/adaptation basis: The held D47 gap card cites existing FIVB 4.7 as the current boundary plus Better at Beach solo setting work, JVA out-of-system/up-and-back setting drills, and TAOCV set-and-go conditioning as source/adaptation candidates that still require 1-2 player review.
- Future selection path: Future generated advanced setting/movement main-skill blocks should have a distinct longer-duration source-backed surface available instead of repeatedly stretching `d47-solo-open` beyond its honest envelope.
- Expected diagnostic movement: A later catalog plan should reduce D47 over-cap pressure only if generated sessions can select the new advanced setting/movement surface for longer main-skill blocks.
- Regression risk: D47 may still fail source/adaptation review for 1-2 player M001 use, or catalog content may not move diagnostics unless selection can prefer the new surface.
- No-action threshold: Do not proceed to catalog implementation if the source/adaptation review cannot prove a 1-2 player open-court drill materially different from current FIVB 4.7 D47.
- D05 re-entry trigger: Re-enter D05 if D47 source/adaptation review fails, if the later catalog plan cannot name selection-path movement, or if regenerated diagnostics show no intended D47 movement.
- Follow-up artifact: D47 source-backed catalog implementation plan

## D47 vs D05 Comparator Decision Packet

- Packet source: Gap Closure Selection plus D47/D05 redistribution receipts.
- Selection state: `selected`
- Selected outcome: `d47_wins`
- Authorization status: `not_authorized`
- D01 state: `selected:resume_d47_with_d01_held:d47_resumed_d01_held`
- D47 state: `closed_by_d49:closed_validated:closed_with_fill`
- D05 state: `current:15:3`
- D47 facts: total affected cells 0, pressure disappears 0, pressure remains 0, non-redistribution pressure 0, inconclusive 0
- D05 facts: total affected cells 15, pressure disappears 6, pressure remains 9, non-redistribution pressure 3, inconclusive 0
- D47 session problem: Generated sessions may overuse a 5-9 minute advanced setting/movement surface when the training need may require either a deeper source-backed sibling, workload/block-shape work, or no change.
- D05 session problem: Generated sessions may stretch a short solo passing drill beyond its honest workload instead of choosing a clearer workload, block-shape, source-backed, generator-policy, or no-change proposal.
- Tie-break summary: D47 wins this comparator because it has a named source-backed content-depth delta and a concrete advanced-session selection-path hypothesis; D05 remains simpler but has not yet named a stronger next proposal than the D47 gap card.
- Next artifact: D47 source-backed catalog implementation plan
- Stop condition: Do not edit catalog, workload metadata, block shape, generator policy, U6 preview, runtime generation, or app surfaces from this comparator packet.
- D47 changed surface: Use the held D47 source-backed gap card as input for a candidate D49-style advanced setting/movement sibling family; do not widen current D47 caps in this payload.
- D47 source/adaptation basis: The held D47 gap card cites existing FIVB 4.7 as the current boundary plus Better at Beach solo setting work, JVA out-of-system/up-and-back setting drills, and TAOCV set-and-go conditioning as source/adaptation candidates that still require 1-2 player review.
- D47 future selection path: Future generated advanced setting/movement main-skill blocks should have a distinct longer-duration source-backed surface available instead of repeatedly stretching `d47-solo-open` beyond its honest envelope.
- Loser re-entry trigger: Re-enter D05 if D47 source/adaptation review fails, if the later catalog plan cannot name selection-path movement, or if regenerated diagnostics show no intended D47 movement.
- Gap-card input: `docs/reviews/2026-05-02-d47-source-backed-gap-card.md`

## New / Untriaged Blockers

- None.

## Stale Fingerprint Review

- None.

## Other Blocking Validation Issues

- None.

## Resolved / Superseded Cleanup

- None.

## Evidence-Required Routes

- None.

## Needs Human Review

- `gpdg:v1:d25:d25-solo:wrap:true:under_authored_min` (79 cells): Needs human review before deciding whether this is policy allowance, cap review, block split, or source-backed content depth.
- `gpdg:v1:d07:d07-solo-open:technique:true:under_authored_min` (18 cells): Needs human review before deciding whether this is policy allowance, cap review, block split, or source-backed content depth.
- `gpdg:v1:d33:d33-solo-open:technique:true:under_authored_min` (16 cells): Needs human review before deciding whether this is policy allowance, cap review, block split, or source-backed content depth.
- `gpdg:v1:d33:d33-solo-open:main_skill:true:under_authored_min` (14 cells): Needs human review before deciding whether this is policy allowance, cap review, block split, or source-backed content depth.
- `gpdg:v1:d01:d01-solo:technique:true:over_authored_max+over_fatigue_cap` (12 cells): Needs human review before deciding whether this is policy allowance, cap review, block split, or source-backed content depth.
- `gpdg:v1:d22:d22-solo-open:technique:true:under_authored_min` (12 cells): Needs human review before deciding whether this is policy allowance, cap review, block split, or source-backed content depth.
- `gpdg:v1:d33:d33-pair-open:main_skill:true:under_authored_min` (12 cells): Needs human review before deciding whether this is policy allowance, cap review, block split, or source-backed content depth.
- `gpdg:v1:d38:d38-solo:technique:true:under_authored_min` (12 cells): Needs human review before deciding whether this is policy allowance, cap review, block split, or source-backed content depth.
- `gpdg:v1:d39:d39-solo:technique:true:under_authored_min` (12 cells): Needs human review before deciding whether this is policy allowance, cap review, block split, or source-backed content depth.
- `gpdg:v1:d48:d48-solo-open:technique:true:under_authored_min` (12 cells): Needs human review before deciding whether this is policy allowance, cap review, block split, or source-backed content depth.
- `gpdg:v1:d49:d49-solo-open:main_skill:true:under_authored_min` (12 cells): Needs human review before deciding whether this is policy allowance, cap review, block split, or source-backed content depth.
- `gpdg:v1:d05:d05-pair:main_skill:true:over_authored_max+over_fatigue_cap` (10 cells): Needs human review before deciding whether this is policy allowance, cap review, block split, or source-backed content depth.
- `gpdg:v1:d22:d22-solo-open:main_skill:true:under_authored_min` (10 cells): Needs human review before deciding whether this is policy allowance, cap review, block split, or source-backed content depth.
- `gpdg:v1:d01:d01-solo:movement_proxy:false:over_authored_max+over_fatigue_cap` (9 cells): Needs human review before deciding whether this is policy allowance, cap review, block split, or source-backed content depth.
- `gpdg:v1:d33:d33-pair-open:technique:true:under_authored_min` (9 cells): Needs human review before deciding whether this is policy allowance, cap review, block split, or source-backed content depth.
- `gpdg:v1:d01:d01-pair:pressure:false:over_authored_max+over_fatigue_cap` (8 cells): Needs human review before deciding whether this is policy allowance, cap review, block split, or source-backed content depth.
- `gpdg:v1:d07:d07-pair-open:technique:true:under_authored_min` (8 cells): Needs human review before deciding whether this is policy allowance, cap review, block split, or source-backed content depth.
- `gpdg:v1:d22:d22-pair-open:technique:true:under_authored_min` (8 cells): Needs human review before deciding whether this is policy allowance, cap review, block split, or source-backed content depth.
- `gpdg:v1:d48:d48-pair-open:technique:true:under_authored_min` (8 cells): Needs human review before deciding whether this is policy allowance, cap review, block split, or source-backed content depth.
- `gpdg:v1:d11:d11-solo:main_skill:true:over_authored_max+over_fatigue_cap` (6 cells): Needs human review before deciding whether this is policy allowance, cap review, block split, or source-backed content depth.
- `gpdg:v1:d22:d22-pair-open:main_skill:true:under_authored_min` (6 cells): Needs human review before deciding whether this is policy allowance, cap review, block split, or source-backed content depth.
- `gpdg:v1:d47:d47-solo-open:main_skill:true:over_authored_max+over_fatigue_cap` (6 cells): Needs human review before deciding whether this is policy allowance, cap review, block split, or source-backed content depth.
- `gpdg:v1:d10:d10-pair:main_skill:true:over_authored_max+over_fatigue_cap` (4 cells): Needs human review before deciding whether this is policy allowance, cap review, block split, or source-backed content depth.
- `gpdg:v1:d49:d49-pair-open:main_skill:true:under_authored_min` (4 cells): Needs human review before deciding whether this is policy allowance, cap review, block split, or source-backed content depth.
- `gpdg:v1:d01:d01-solo:pressure:false:over_authored_max+over_fatigue_cap` (3 cells): Needs human review before deciding whether this is policy allowance, cap review, block split, or source-backed content depth.
- `gpdg:v1:d07:d07-solo-open:main_skill:true:over_authored_max+over_fatigue_cap` (3 cells): Needs human review before deciding whether this is policy allowance, cap review, block split, or source-backed content depth.
- `gpdg:v1:d33:d33-pair:technique:true:under_authored_min` (3 cells): Needs human review before deciding whether this is policy allowance, cap review, block split, or source-backed content depth.
- `gpdg:v1:d33:d33-solo-net:technique:true:under_authored_min` (3 cells): Needs human review before deciding whether this is policy allowance, cap review, block split, or source-backed content depth.
- `gpdg:v1:d33:d33-solo-net:main_skill:true:under_authored_min` (3 cells): Needs human review before deciding whether this is policy allowance, cap review, block split, or source-backed content depth.
- `gpdg:v1:d03:d03-pair:main_skill:true:over_authored_max+over_fatigue_cap` (2 cells): Needs human review before deciding whether this is policy allowance, cap review, block split, or source-backed content depth.
- `gpdg:v1:d22:d22-pair:main_skill:true:under_authored_min` (2 cells): Needs human review before deciding whether this is policy allowance, cap review, block split, or source-backed content depth.
- `gpdg:v1:d22:d22-solo:main_skill:true:under_authored_min` (2 cells): Needs human review before deciding whether this is policy allowance, cap review, block split, or source-backed content depth.
- `gpdg:v1:d38:d38-pair:main_skill:true:over_authored_max+over_fatigue_cap` (2 cells): Needs human review before deciding whether this is policy allowance, cap review, block split, or source-backed content depth.
- `gpdg:v1:d01:d01-pair:technique:true:over_authored_max+over_fatigue_cap` (1 cells): Needs human review before deciding whether this is policy allowance, cap review, block split, or source-backed content depth.
- `gpdg:v1:d11:d11-pair:pressure:false:over_authored_max+over_fatigue_cap` (1 cells): Needs human review before deciding whether this is policy allowance, cap review, block split, or source-backed content depth.


## Generator Policy Investigation

- `gpdg:v1:d33:d33-solo-open:main_skill:true:optional_slot_redistribution+over_authored_max+over_fatigue_cap` (28 cells): Redistribution evidence is present, so generator policy should be investigated before catalog changes.
- `gpdg:v1:d33:d33-pair-open:main_skill:true:optional_slot_redistribution+over_authored_max+over_fatigue_cap` (24 cells): Redistribution evidence is present, so generator policy should be investigated before catalog changes.
- `gpdg:v1:d46:d46-solo-open:main_skill:true:optional_slot_redistribution+over_authored_max+over_fatigue_cap` (24 cells): Redistribution evidence is present, so generator policy should be investigated before catalog changes.
- `gpdg:v1:d46:d46-pair-open:main_skill:true:optional_slot_redistribution+over_authored_max+over_fatigue_cap` (16 cells): Redistribution evidence is present, so generator policy should be investigated before catalog changes.
- `gpdg:v1:d05:d05-solo:main_skill:true:optional_slot_redistribution+over_authored_max+over_fatigue_cap` (15 cells): Redistribution evidence is present, so generator policy should be investigated before catalog changes.
- `gpdg:v1:d31:d31-solo-open:main_skill:true:optional_slot_redistribution+over_authored_max+over_fatigue_cap` (14 cells): Redistribution evidence is present, so generator policy should be investigated before catalog changes.
- `gpdg:v1:d01:d01-solo:main_skill:true:optional_slot_redistribution+over_authored_max+over_fatigue_cap` (12 cells): Redistribution evidence is present, so generator policy should be investigated before catalog changes.
- `gpdg:v1:d40:d40-solo:main_skill:true:optional_slot_redistribution+over_authored_max+over_fatigue_cap` (12 cells): Redistribution evidence is present, so generator policy should be investigated before catalog changes.
- `gpdg:v1:d49:d49-solo-open:main_skill:true:optional_slot_redistribution+over_authored_max+over_fatigue_cap` (12 cells): Redistribution evidence is present, so generator policy should be investigated before catalog changes.
- `gpdg:v1:d22:d22-solo-open:main_skill:true:optional_slot_redistribution` (10 cells): Redistribution evidence is present, so generator policy should be investigated before catalog changes.
- `gpdg:v1:d22:d22-solo-open:main_skill:true:optional_slot_redistribution+over_authored_max+over_fatigue_cap` (10 cells): Redistribution evidence is present, so generator policy should be investigated before catalog changes.
- `gpdg:v1:d49:d49-pair-open:main_skill:true:optional_slot_redistribution+over_authored_max+over_fatigue_cap` (8 cells): Redistribution evidence is present, so generator policy should be investigated before catalog changes.
- `gpdg:v1:d22:d22-pair-open:main_skill:true:optional_slot_redistribution` (6 cells): Redistribution evidence is present, so generator policy should be investigated before catalog changes.
- `gpdg:v1:d22:d22-pair-open:main_skill:true:optional_slot_redistribution+over_authored_max+over_fatigue_cap` (6 cells): Redistribution evidence is present, so generator policy should be investigated before catalog changes.
- `gpdg:v1:d31:d31-pair-open:main_skill:true:optional_slot_redistribution+over_authored_max+over_fatigue_cap` (6 cells): Redistribution evidence is present, so generator policy should be investigated before catalog changes.
- `gpdg:v1:d33:d33-solo-net:main_skill:true:optional_slot_redistribution+over_authored_max+over_fatigue_cap` (6 cells): Redistribution evidence is present, so generator policy should be investigated before catalog changes.
- `gpdg:v1:d49:d49-pair-open:main_skill:true:optional_slot_redistribution` (6 cells): Redistribution evidence is present, so generator policy should be investigated before catalog changes.
- `gpdg:v1:d49:d49-solo-open:main_skill:true:optional_slot_redistribution` (6 cells): Redistribution evidence is present, so generator policy should be investigated before catalog changes.
- `gpdg:v1:d22:d22-pair:main_skill:true:optional_slot_redistribution` (2 cells): Redistribution evidence is present, so generator policy should be investigated before catalog changes.
- `gpdg:v1:d22:d22-pair:main_skill:true:optional_slot_redistribution+over_authored_max+over_fatigue_cap` (2 cells): Redistribution evidence is present, so generator policy should be investigated before catalog changes.
- `gpdg:v1:d22:d22-solo:main_skill:true:optional_slot_redistribution` (2 cells): Redistribution evidence is present, so generator policy should be investigated before catalog changes.
- `gpdg:v1:d22:d22-solo:main_skill:true:optional_slot_redistribution+over_authored_max+over_fatigue_cap` (2 cells): Redistribution evidence is present, so generator policy should be investigated before catalog changes.
- `gpdg:v1:d31:d31-pair:main_skill:true:optional_slot_redistribution+over_authored_max+over_fatigue_cap` (2 cells): Redistribution evidence is present, so generator policy should be investigated before catalog changes.


## Top Affected Groups

- `gpdg:v1:d25:d25-solo:wrap:true:under_authored_min` (79 cells, route: `defer`)
- `gpdg:v1:d33:d33-solo-open:main_skill:true:optional_slot_redistribution+over_authored_max+over_fatigue_cap` (28 cells, route: `generator_policy_investigation`)
- `gpdg:v1:d33:d33-pair-open:main_skill:true:optional_slot_redistribution+over_authored_max+over_fatigue_cap` (24 cells, route: `generator_policy_investigation`)
- `gpdg:v1:d46:d46-solo-open:main_skill:true:optional_slot_redistribution+over_authored_max+over_fatigue_cap` (24 cells, route: `generator_policy_investigation`)
- `gpdg:v1:d07:d07-solo-open:technique:true:under_authored_min` (18 cells, route: `defer`)
- `gpdg:v1:d33:d33-solo-open:technique:true:under_authored_min` (16 cells, route: `defer`)
- `gpdg:v1:d46:d46-pair-open:main_skill:true:optional_slot_redistribution+over_authored_max+over_fatigue_cap` (16 cells, route: `generator_policy_investigation`)
- `gpdg:v1:d05:d05-solo:main_skill:true:optional_slot_redistribution+over_authored_max+over_fatigue_cap` (15 cells, route: `generator_policy_investigation`)
- `gpdg:v1:d31:d31-solo-open:main_skill:true:optional_slot_redistribution+over_authored_max+over_fatigue_cap` (14 cells, route: `generator_policy_investigation`)
- `gpdg:v1:d33:d33-solo-open:main_skill:true:under_authored_min` (14 cells, route: `defer`)
- `gpdg:v1:d01:d01-solo:main_skill:true:optional_slot_redistribution+over_authored_max+over_fatigue_cap` (12 cells, route: `generator_policy_investigation`)
- `gpdg:v1:d01:d01-solo:technique:true:over_authored_max+over_fatigue_cap` (12 cells, route: `defer`)
- `gpdg:v1:d22:d22-solo-open:technique:true:under_authored_min` (12 cells, route: `defer`)
- `gpdg:v1:d33:d33-pair-open:main_skill:true:under_authored_min` (12 cells, route: `defer`)
- `gpdg:v1:d38:d38-solo:technique:true:under_authored_min` (12 cells, route: `defer`)
- `gpdg:v1:d39:d39-solo:technique:true:under_authored_min` (12 cells, route: `defer`)
- `gpdg:v1:d40:d40-solo:main_skill:true:optional_slot_redistribution+over_authored_max+over_fatigue_cap` (12 cells, route: `generator_policy_investigation`)
- `gpdg:v1:d48:d48-solo-open:technique:true:under_authored_min` (12 cells, route: `defer`)
- `gpdg:v1:d49:d49-solo-open:main_skill:true:under_authored_min` (12 cells, route: `defer`)
- `gpdg:v1:d49:d49-solo-open:main_skill:true:optional_slot_redistribution+over_authored_max+over_fatigue_cap` (12 cells, route: `generator_policy_investigation`)
- `gpdg:v1:d05:d05-pair:main_skill:true:over_authored_max+over_fatigue_cap` (10 cells, route: `defer`)
- `gpdg:v1:d22:d22-solo-open:main_skill:true:under_authored_min` (10 cells, route: `defer`)
- `gpdg:v1:d22:d22-solo-open:main_skill:true:optional_slot_redistribution` (10 cells, route: `generator_policy_investigation`)
- `gpdg:v1:d22:d22-solo-open:main_skill:true:optional_slot_redistribution+over_authored_max+over_fatigue_cap` (10 cells, route: `generator_policy_investigation`)
- `gpdg:v1:d01:d01-solo:movement_proxy:false:over_authored_max+over_fatigue_cap` (9 cells, route: `defer`)
- `gpdg:v1:d33:d33-pair-open:technique:true:under_authored_min` (9 cells, route: `defer`)
- `gpdg:v1:d01:d01-pair:pressure:false:over_authored_max+over_fatigue_cap` (8 cells, route: `defer`)
- `gpdg:v1:d07:d07-pair-open:technique:true:under_authored_min` (8 cells, route: `defer`)
- `gpdg:v1:d22:d22-pair-open:technique:true:under_authored_min` (8 cells, route: `defer`)
- `gpdg:v1:d48:d48-pair-open:technique:true:under_authored_min` (8 cells, route: `defer`)
- `gpdg:v1:d49:d49-pair-open:main_skill:true:optional_slot_redistribution+over_authored_max+over_fatigue_cap` (8 cells, route: `generator_policy_investigation`)
- `gpdg:v1:d11:d11-solo:main_skill:true:over_authored_max+over_fatigue_cap` (6 cells, route: `defer`)
- `gpdg:v1:d22:d22-pair-open:main_skill:true:under_authored_min` (6 cells, route: `defer`)
- `gpdg:v1:d22:d22-pair-open:main_skill:true:optional_slot_redistribution` (6 cells, route: `generator_policy_investigation`)
- `gpdg:v1:d22:d22-pair-open:main_skill:true:optional_slot_redistribution+over_authored_max+over_fatigue_cap` (6 cells, route: `generator_policy_investigation`)
- `gpdg:v1:d31:d31-pair-open:main_skill:true:optional_slot_redistribution+over_authored_max+over_fatigue_cap` (6 cells, route: `generator_policy_investigation`)
- `gpdg:v1:d33:d33-solo-net:main_skill:true:optional_slot_redistribution+over_authored_max+over_fatigue_cap` (6 cells, route: `generator_policy_investigation`)
- `gpdg:v1:d47:d47-solo-open:main_skill:true:over_authored_max+over_fatigue_cap` (6 cells, route: `defer`)
- `gpdg:v1:d49:d49-pair-open:main_skill:true:optional_slot_redistribution` (6 cells, route: `generator_policy_investigation`)
- `gpdg:v1:d49:d49-solo-open:main_skill:true:optional_slot_redistribution` (6 cells, route: `generator_policy_investigation`)
- `gpdg:v1:d10:d10-pair:main_skill:true:over_authored_max+over_fatigue_cap` (4 cells, route: `defer`)
- `gpdg:v1:d49:d49-pair-open:main_skill:true:under_authored_min` (4 cells, route: `defer`)
- `gpdg:v1:d01:d01-solo:pressure:false:over_authored_max+over_fatigue_cap` (3 cells, route: `defer`)
- `gpdg:v1:d07:d07-solo-open:main_skill:true:over_authored_max+over_fatigue_cap` (3 cells, route: `defer`)
- `gpdg:v1:d33:d33-pair:technique:true:under_authored_min` (3 cells, route: `defer`)
- `gpdg:v1:d33:d33-solo-net:technique:true:under_authored_min` (3 cells, route: `defer`)
- `gpdg:v1:d33:d33-solo-net:main_skill:true:under_authored_min` (3 cells, route: `defer`)
- `gpdg:v1:d03:d03-pair:main_skill:true:over_authored_max+over_fatigue_cap` (2 cells, route: `defer`)
- `gpdg:v1:d22:d22-pair:main_skill:true:under_authored_min` (2 cells, route: `defer`)
- `gpdg:v1:d22:d22-pair:main_skill:true:optional_slot_redistribution` (2 cells, route: `generator_policy_investigation`)
- `gpdg:v1:d22:d22-pair:main_skill:true:optional_slot_redistribution+over_authored_max+over_fatigue_cap` (2 cells, route: `generator_policy_investigation`)
- `gpdg:v1:d22:d22-solo:main_skill:true:under_authored_min` (2 cells, route: `defer`)
- `gpdg:v1:d22:d22-solo:main_skill:true:optional_slot_redistribution` (2 cells, route: `generator_policy_investigation`)
- `gpdg:v1:d22:d22-solo:main_skill:true:optional_slot_redistribution+over_authored_max+over_fatigue_cap` (2 cells, route: `generator_policy_investigation`)
- `gpdg:v1:d31:d31-pair:main_skill:true:optional_slot_redistribution+over_authored_max+over_fatigue_cap` (2 cells, route: `generator_policy_investigation`)
- `gpdg:v1:d38:d38-pair:main_skill:true:over_authored_max+over_fatigue_cap` (2 cells, route: `defer`)
- `gpdg:v1:d01:d01-pair:technique:true:over_authored_max+over_fatigue_cap` (1 cells, route: `defer`)
- `gpdg:v1:d11:d11-pair:pressure:false:over_authored_max+over_fatigue_cap` (1 cells, route: `defer`)

## Machine-Readable Registry

<!-- diagnostic-triage-registry:start -->
```json
[
  {
    "groupKey": "gpdg:v1:d25:d25-solo:wrap:true:under_authored_min",
    "diagnosticFingerprint": "gpdf|v1|4|none|none|79|block_split+policy_allowance+source_backed_content_depth+variant_cap_review|pass/pair_net/advanced/15/matrix-b/block-3/3/3/under_authored_min|pass/pair_net/advanced/15/matrix-c/block-3/3/3/under_authored_min|pass/pair_net/advanced/15/matrix-d/block-3/3/3/under_authored_min",
    "triageStatus": "observed",
    "route": "defer",
    "enforcementStatus": "observation_only",
    "rationale": "Needs human review before deciding whether this is policy allowance, cap review, block split, or source-backed content depth.",
    "owner": "agent",
    "reviewedReportId": "generated-plan-diagnostics-report-2026-05-01",
    "affectedCellCount": 79,
    "likelyFixPaths": [
      "policy_allowance",
      "block_split",
      "variant_cap_review",
      "source_backed_content_depth"
    ],
    "evidence": []
  },
  {
    "groupKey": "gpdg:v1:d33:d33-solo-open:main_skill:true:optional_slot_redistribution+over_authored_max+over_fatigue_cap",
    "diagnosticFingerprint": "gpdf|v1|none|10|10|28|block_split+generator_policy_investigation+policy_allowance+source_backed_content_depth+variant_cap_review|serve/solo_net/advanced/25/matrix-d/block-2/12/7/optional_slot_redistribution+over_authored_max+over_fatigue_cap|serve/solo_net/advanced/40/matrix-d/block-2/23/10/optional_slot_redistribution+over_authored_max+over_fatigue_cap|serve/solo_net/intermediate/25/matrix-d/block-2/12/7/optional_slot_redistribution+over_authored_max+over_fatigue_cap",
    "triageStatus": "routed",
    "route": "generator_policy_investigation",
    "enforcementStatus": "observation_only",
    "rationale": "Redistribution evidence is present, so generator policy should be investigated before catalog changes.",
    "owner": "agent",
    "reviewedReportId": "generated-plan-diagnostics-report-2026-05-01",
    "affectedCellCount": 28,
    "likelyFixPaths": [
      "generator_policy_investigation",
      "policy_allowance",
      "block_split",
      "variant_cap_review",
      "source_backed_content_depth"
    ],
    "evidence": []
  },
  {
    "groupKey": "gpdg:v1:d33:d33-pair-open:main_skill:true:optional_slot_redistribution+over_authored_max+over_fatigue_cap",
    "diagnosticFingerprint": "gpdf|v1|none|10|10|24|block_split+generator_policy_investigation+policy_allowance+source_backed_content_depth+variant_cap_review|serve/pair_net/advanced/25/matrix-b/block-2/12/7/optional_slot_redistribution+over_authored_max+over_fatigue_cap|serve/pair_net/advanced/25/matrix-d/block-2/12/7/optional_slot_redistribution+over_authored_max+over_fatigue_cap|serve/pair_net/advanced/40/matrix-b/block-2/24/10/optional_slot_redistribution+over_authored_max+over_fatigue_cap",
    "triageStatus": "routed",
    "route": "generator_policy_investigation",
    "enforcementStatus": "observation_only",
    "rationale": "Redistribution evidence is present, so generator policy should be investigated before catalog changes.",
    "owner": "agent",
    "reviewedReportId": "generated-plan-diagnostics-report-2026-05-01",
    "affectedCellCount": 24,
    "likelyFixPaths": [
      "generator_policy_investigation",
      "policy_allowance",
      "block_split",
      "variant_cap_review",
      "source_backed_content_depth"
    ],
    "evidence": []
  },
  {
    "groupKey": "gpdg:v1:d46:d46-solo-open:main_skill:true:optional_slot_redistribution+over_authored_max+over_fatigue_cap",
    "diagnosticFingerprint": "gpdf|v1|none|8|8|24|block_split+generator_policy_investigation+policy_allowance+source_backed_content_depth+variant_cap_review|pass/solo_net/advanced/25/matrix-a/block-2/12/7/optional_slot_redistribution+over_authored_max+over_fatigue_cap|pass/solo_net/advanced/25/matrix-b/block-2/12/7/optional_slot_redistribution+over_authored_max+over_fatigue_cap|pass/solo_net/advanced/25/matrix-c/block-2/12/7/optional_slot_redistribution+over_authored_max+over_fatigue_cap",
    "triageStatus": "routed",
    "route": "generator_policy_investigation",
    "enforcementStatus": "observation_only",
    "rationale": "Redistribution evidence is present, so generator policy should be investigated before catalog changes.",
    "owner": "agent",
    "reviewedReportId": "generated-plan-diagnostics-report-2026-05-01",
    "affectedCellCount": 24,
    "likelyFixPaths": [
      "generator_policy_investigation",
      "policy_allowance",
      "block_split",
      "variant_cap_review",
      "source_backed_content_depth"
    ],
    "evidence": []
  },
  {
    "groupKey": "gpdg:v1:d07:d07-solo-open:technique:true:under_authored_min",
    "diagnosticFingerprint": "gpdf|v1|5|none|none|18|block_split+policy_allowance+source_backed_content_depth+variant_cap_review|pass/solo_net/advanced/15/matrix-a/block-1/4/4/under_authored_min|pass/solo_net/advanced/15/matrix-b/block-1/4/4/under_authored_min|pass/solo_net/advanced/15/matrix-c/block-1/4/4/under_authored_min",
    "triageStatus": "observed",
    "route": "defer",
    "enforcementStatus": "observation_only",
    "rationale": "Needs human review before deciding whether this is policy allowance, cap review, block split, or source-backed content depth.",
    "owner": "agent",
    "reviewedReportId": "generated-plan-diagnostics-report-2026-05-01",
    "affectedCellCount": 18,
    "likelyFixPaths": [
      "policy_allowance",
      "block_split",
      "variant_cap_review",
      "source_backed_content_depth"
    ],
    "evidence": []
  },
  {
    "groupKey": "gpdg:v1:d33:d33-solo-open:technique:true:under_authored_min",
    "diagnosticFingerprint": "gpdf|v1|6|none|none|16|block_split+policy_allowance+source_backed_content_depth+variant_cap_review|serve/solo_net/advanced/15/matrix-a/block-1/4/4/under_authored_min|serve/solo_net/advanced/15/matrix-c/block-1/4/4/under_authored_min|serve/solo_net/intermediate/15/matrix-a/block-1/4/4/under_authored_min",
    "triageStatus": "observed",
    "route": "defer",
    "enforcementStatus": "observation_only",
    "rationale": "Needs human review before deciding whether this is policy allowance, cap review, block split, or source-backed content depth.",
    "owner": "agent",
    "reviewedReportId": "generated-plan-diagnostics-report-2026-05-01",
    "affectedCellCount": 16,
    "likelyFixPaths": [
      "policy_allowance",
      "block_split",
      "variant_cap_review",
      "source_backed_content_depth"
    ],
    "evidence": []
  },
  {
    "groupKey": "gpdg:v1:d46:d46-pair-open:main_skill:true:optional_slot_redistribution+over_authored_max+over_fatigue_cap",
    "diagnosticFingerprint": "gpdf|v1|none|8|8|16|block_split+generator_policy_investigation+policy_allowance+source_backed_content_depth+variant_cap_review|pass/pair_net/advanced/25/matrix-a/block-2/12/7/optional_slot_redistribution+over_authored_max+over_fatigue_cap|pass/pair_net/advanced/25/matrix-b/block-2/12/7/optional_slot_redistribution+over_authored_max+over_fatigue_cap|pass/pair_net/advanced/25/matrix-c/block-2/12/7/optional_slot_redistribution+over_authored_max+over_fatigue_cap",
    "triageStatus": "routed",
    "route": "generator_policy_investigation",
    "enforcementStatus": "observation_only",
    "rationale": "Redistribution evidence is present, so generator policy should be investigated before catalog changes.",
    "owner": "agent",
    "reviewedReportId": "generated-plan-diagnostics-report-2026-05-01",
    "affectedCellCount": 16,
    "likelyFixPaths": [
      "generator_policy_investigation",
      "policy_allowance",
      "block_split",
      "variant_cap_review",
      "source_backed_content_depth"
    ],
    "evidence": []
  },
  {
    "groupKey": "gpdg:v1:d05:d05-solo:main_skill:true:optional_slot_redistribution+over_authored_max+over_fatigue_cap",
    "diagnosticFingerprint": "gpdf|v1|none|8|8|15|block_split+generator_policy_investigation+policy_allowance+source_backed_content_depth+variant_cap_review|pass/solo_net/beginner/25/matrix-b/block-2/12/7/optional_slot_redistribution+over_authored_max+over_fatigue_cap|pass/solo_net/beginner/25/matrix-d/block-2/12/7/optional_slot_redistribution+over_authored_max+over_fatigue_cap|pass/solo_net/beginner/40/matrix-b/block-2/23/10/optional_slot_redistribution+over_authored_max+over_fatigue_cap",
    "triageStatus": "routed",
    "route": "generator_policy_investigation",
    "enforcementStatus": "observation_only",
    "rationale": "Redistribution evidence is present, so generator policy should be investigated before catalog changes.",
    "owner": "agent",
    "reviewedReportId": "generated-plan-diagnostics-report-2026-05-01",
    "affectedCellCount": 15,
    "likelyFixPaths": [
      "generator_policy_investigation",
      "policy_allowance",
      "block_split",
      "variant_cap_review",
      "source_backed_content_depth"
    ],
    "evidence": []
  },
  {
    "groupKey": "gpdg:v1:d31:d31-solo-open:main_skill:true:optional_slot_redistribution+over_authored_max+over_fatigue_cap",
    "diagnosticFingerprint": "gpdf|v1|none|8|8|14|block_split+generator_policy_investigation+policy_allowance+source_backed_content_depth+variant_cap_review|serve/solo_net/beginner/25/matrix-a/block-2/12/7/optional_slot_redistribution+over_authored_max+over_fatigue_cap|serve/solo_net/beginner/25/matrix-b/block-2/12/7/optional_slot_redistribution+over_authored_max+over_fatigue_cap|serve/solo_net/beginner/25/matrix-c/block-2/12/7/optional_slot_redistribution+over_authored_max+over_fatigue_cap",
    "triageStatus": "routed",
    "route": "generator_policy_investigation",
    "enforcementStatus": "observation_only",
    "rationale": "Redistribution evidence is present, so generator policy should be investigated before catalog changes.",
    "owner": "agent",
    "reviewedReportId": "generated-plan-diagnostics-report-2026-05-01",
    "affectedCellCount": 14,
    "likelyFixPaths": [
      "generator_policy_investigation",
      "policy_allowance",
      "block_split",
      "variant_cap_review",
      "source_backed_content_depth"
    ],
    "evidence": []
  },
  {
    "groupKey": "gpdg:v1:d33:d33-solo-open:main_skill:true:under_authored_min",
    "diagnosticFingerprint": "gpdf|v1|6|none|none|14|block_split+policy_allowance+source_backed_content_depth+variant_cap_review|serve/solo_net/advanced/15/matrix-d/block-2/5/5/under_authored_min|serve/solo_net/intermediate/15/matrix-d/block-2/5/5/under_authored_min|serve/solo_open/advanced/15/matrix-b/block-2/5/5/under_authored_min",
    "triageStatus": "observed",
    "route": "defer",
    "enforcementStatus": "observation_only",
    "rationale": "Needs human review before deciding whether this is policy allowance, cap review, block split, or source-backed content depth.",
    "owner": "agent",
    "reviewedReportId": "generated-plan-diagnostics-report-2026-05-01",
    "affectedCellCount": 14,
    "likelyFixPaths": [
      "policy_allowance",
      "block_split",
      "variant_cap_review",
      "source_backed_content_depth"
    ],
    "evidence": []
  },
  {
    "groupKey": "gpdg:v1:d01:d01-solo:main_skill:true:optional_slot_redistribution+over_authored_max+over_fatigue_cap",
    "diagnosticFingerprint": "gpdf|v1|none|5|5|12|block_split+generator_policy_investigation+policy_allowance+source_backed_content_depth+variant_cap_review|pass/solo_net/beginner/25/matrix-a/block-2/12/7/optional_slot_redistribution+over_authored_max+over_fatigue_cap|pass/solo_net/beginner/25/matrix-c/block-2/12/7/optional_slot_redistribution+over_authored_max+over_fatigue_cap|pass/solo_net/beginner/40/matrix-a/block-2/23/10/optional_slot_redistribution+over_authored_max+over_fatigue_cap",
    "triageStatus": "routed",
    "route": "generator_policy_investigation",
    "enforcementStatus": "observation_only",
    "rationale": "Redistribution evidence is present, so generator policy should be investigated before catalog changes.",
    "owner": "agent",
    "reviewedReportId": "generated-plan-diagnostics-report-2026-05-01",
    "affectedCellCount": 12,
    "likelyFixPaths": [
      "generator_policy_investigation",
      "policy_allowance",
      "block_split",
      "variant_cap_review",
      "source_backed_content_depth"
    ],
    "evidence": []
  },
  {
    "groupKey": "gpdg:v1:d01:d01-solo:technique:true:over_authored_max+over_fatigue_cap",
    "diagnosticFingerprint": "gpdf|v1|none|5|5|12|block_split+policy_allowance+source_backed_content_depth+variant_cap_review|pass/solo_net/beginner/25/matrix-b/block-1/6/6/over_authored_max+over_fatigue_cap|pass/solo_net/beginner/25/matrix-d/block-1/6/6/over_authored_max+over_fatigue_cap|pass/solo_net/beginner/40/matrix-b/block-1/7/7/over_authored_max+over_fatigue_cap",
    "triageStatus": "observed",
    "route": "defer",
    "enforcementStatus": "observation_only",
    "rationale": "Needs human review before deciding whether this is policy allowance, cap review, block split, or source-backed content depth.",
    "owner": "agent",
    "reviewedReportId": "generated-plan-diagnostics-report-2026-05-01",
    "affectedCellCount": 12,
    "likelyFixPaths": [
      "policy_allowance",
      "block_split",
      "variant_cap_review",
      "source_backed_content_depth"
    ],
    "evidence": []
  },
  {
    "groupKey": "gpdg:v1:d22:d22-solo-open:technique:true:under_authored_min",
    "diagnosticFingerprint": "gpdf|v1|6|none|none|12|block_split+policy_allowance+source_backed_content_depth+variant_cap_review|serve/solo_net/advanced/15/matrix-b/block-1/4/4/under_authored_min|serve/solo_net/advanced/15/matrix-d/block-1/4/4/under_authored_min|serve/solo_net/intermediate/15/matrix-b/block-1/4/4/under_authored_min",
    "triageStatus": "observed",
    "route": "defer",
    "enforcementStatus": "observation_only",
    "rationale": "Needs human review before deciding whether this is policy allowance, cap review, block split, or source-backed content depth.",
    "owner": "agent",
    "reviewedReportId": "generated-plan-diagnostics-report-2026-05-01",
    "affectedCellCount": 12,
    "likelyFixPaths": [
      "policy_allowance",
      "block_split",
      "variant_cap_review",
      "source_backed_content_depth"
    ],
    "evidence": []
  },
  {
    "groupKey": "gpdg:v1:d33:d33-pair-open:main_skill:true:under_authored_min",
    "diagnosticFingerprint": "gpdf|v1|6|none|none|12|block_split+policy_allowance+source_backed_content_depth+variant_cap_review|serve/pair_net/advanced/15/matrix-b/block-2/5/5/under_authored_min|serve/pair_net/advanced/15/matrix-d/block-2/5/5/under_authored_min|serve/pair_net/beginner/15/matrix-b/block-2/5/5/under_authored_min",
    "triageStatus": "observed",
    "route": "defer",
    "enforcementStatus": "observation_only",
    "rationale": "Needs human review before deciding whether this is policy allowance, cap review, block split, or source-backed content depth.",
    "owner": "agent",
    "reviewedReportId": "generated-plan-diagnostics-report-2026-05-01",
    "affectedCellCount": 12,
    "likelyFixPaths": [
      "policy_allowance",
      "block_split",
      "variant_cap_review",
      "source_backed_content_depth"
    ],
    "evidence": []
  },
  {
    "groupKey": "gpdg:v1:d38:d38-solo:technique:true:under_authored_min",
    "diagnosticFingerprint": "gpdf|v1|5|none|none|12|block_split+policy_allowance+source_backed_content_depth+variant_cap_review|set/solo_net/beginner/15/matrix-b/block-1/4/4/under_authored_min|set/solo_net/beginner/15/matrix-c/block-1/4/4/under_authored_min|set/solo_net/beginner/15/matrix-d/block-1/4/4/under_authored_min",
    "triageStatus": "observed",
    "route": "defer",
    "enforcementStatus": "observation_only",
    "rationale": "Needs human review before deciding whether this is policy allowance, cap review, block split, or source-backed content depth.",
    "owner": "agent",
    "reviewedReportId": "generated-plan-diagnostics-report-2026-05-01",
    "affectedCellCount": 12,
    "likelyFixPaths": [
      "policy_allowance",
      "block_split",
      "variant_cap_review",
      "source_backed_content_depth"
    ],
    "evidence": []
  },
  {
    "groupKey": "gpdg:v1:d39:d39-solo:technique:true:under_authored_min",
    "diagnosticFingerprint": "gpdf|v1|5|none|none|12|block_split+policy_allowance+source_backed_content_depth+variant_cap_review|set/solo_net/beginner/15/matrix-a/block-1/4/4/under_authored_min|set/solo_net/intermediate/15/matrix-a/block-1/4/4/under_authored_min|set/solo_net/intermediate/15/matrix-b/block-1/4/4/under_authored_min",
    "triageStatus": "observed",
    "route": "defer",
    "enforcementStatus": "observation_only",
    "rationale": "Needs human review before deciding whether this is policy allowance, cap review, block split, or source-backed content depth.",
    "owner": "agent",
    "reviewedReportId": "generated-plan-diagnostics-report-2026-05-01",
    "affectedCellCount": 12,
    "likelyFixPaths": [
      "policy_allowance",
      "block_split",
      "variant_cap_review",
      "source_backed_content_depth"
    ],
    "evidence": []
  },
  {
    "groupKey": "gpdg:v1:d40:d40-solo:main_skill:true:optional_slot_redistribution+over_authored_max+over_fatigue_cap",
    "diagnosticFingerprint": "gpdf|v1|none|10|10|12|block_split+generator_policy_investigation+policy_allowance+source_backed_content_depth+variant_cap_review|set/solo_net/beginner/40/matrix-a/block-3/17/10/optional_slot_redistribution+over_authored_max+over_fatigue_cap|set/solo_net/beginner/40/matrix-b/block-3/17/10/optional_slot_redistribution+over_authored_max+over_fatigue_cap|set/solo_net/beginner/40/matrix-c/block-3/17/10/optional_slot_redistribution+over_authored_max+over_fatigue_cap",
    "triageStatus": "routed",
    "route": "generator_policy_investigation",
    "enforcementStatus": "observation_only",
    "rationale": "Redistribution evidence is present, so generator policy should be investigated before catalog changes.",
    "owner": "agent",
    "reviewedReportId": "generated-plan-diagnostics-report-2026-05-01",
    "affectedCellCount": 12,
    "likelyFixPaths": [
      "generator_policy_investigation",
      "policy_allowance",
      "block_split",
      "variant_cap_review",
      "source_backed_content_depth"
    ],
    "evidence": []
  },
  {
    "groupKey": "gpdg:v1:d48:d48-solo-open:technique:true:under_authored_min",
    "diagnosticFingerprint": "gpdf|v1|5|none|none|12|block_split+policy_allowance+source_backed_content_depth+variant_cap_review|set/solo_net/advanced/15/matrix-a/block-1/4/4/under_authored_min|set/solo_net/advanced/15/matrix-b/block-1/4/4/under_authored_min|set/solo_net/advanced/15/matrix-c/block-1/4/4/under_authored_min",
    "triageStatus": "observed",
    "route": "defer",
    "enforcementStatus": "observation_only",
    "rationale": "Needs human review before deciding whether this is policy allowance, cap review, block split, or source-backed content depth.",
    "owner": "agent",
    "reviewedReportId": "generated-plan-diagnostics-report-2026-05-01",
    "affectedCellCount": 12,
    "likelyFixPaths": [
      "policy_allowance",
      "block_split",
      "variant_cap_review",
      "source_backed_content_depth"
    ],
    "evidence": []
  },
  {
    "groupKey": "gpdg:v1:d49:d49-solo-open:main_skill:true:under_authored_min",
    "diagnosticFingerprint": "gpdf|v1|8|none|none|12|block_split+policy_allowance+source_backed_content_depth+variant_cap_review|set/solo_net/advanced/15/matrix-b/block-2/5/5/under_authored_min|set/solo_net/advanced/15/matrix-c/block-2/5/5/under_authored_min|set/solo_net/advanced/25/matrix-b/block-3/7/7/under_authored_min",
    "triageStatus": "observed",
    "route": "defer",
    "enforcementStatus": "observation_only",
    "rationale": "Needs human review before deciding whether this is policy allowance, cap review, block split, or source-backed content depth.",
    "owner": "agent",
    "reviewedReportId": "generated-plan-diagnostics-report-2026-05-01",
    "affectedCellCount": 12,
    "likelyFixPaths": [
      "policy_allowance",
      "block_split",
      "variant_cap_review",
      "source_backed_content_depth"
    ],
    "evidence": []
  },
  {
    "groupKey": "gpdg:v1:d49:d49-solo-open:main_skill:true:optional_slot_redistribution+over_authored_max+over_fatigue_cap",
    "diagnosticFingerprint": "gpdf|v1|none|14|14|12|block_split+generator_policy_investigation+policy_allowance+source_backed_content_depth+variant_cap_review|set/solo_net/advanced/40/matrix-a/block-2/23/10/optional_slot_redistribution+over_authored_max+over_fatigue_cap|set/solo_net/advanced/40/matrix-b/block-3/17/10/optional_slot_redistribution+over_authored_max+over_fatigue_cap|set/solo_net/advanced/40/matrix-c/block-3/17/10/optional_slot_redistribution+over_authored_max+over_fatigue_cap",
    "triageStatus": "routed",
    "route": "generator_policy_investigation",
    "enforcementStatus": "observation_only",
    "rationale": "Redistribution evidence is present, so generator policy should be investigated before catalog changes.",
    "owner": "agent",
    "reviewedReportId": "generated-plan-diagnostics-report-2026-05-01",
    "affectedCellCount": 12,
    "likelyFixPaths": [
      "generator_policy_investigation",
      "policy_allowance",
      "block_split",
      "variant_cap_review",
      "source_backed_content_depth"
    ],
    "evidence": []
  },
  {
    "groupKey": "gpdg:v1:d05:d05-pair:main_skill:true:over_authored_max+over_fatigue_cap",
    "diagnosticFingerprint": "gpdf|v1|none|8|8|10|block_split+policy_allowance+source_backed_content_depth+variant_cap_review|pass/pair_net/beginner/40/matrix-b/block-3/10/10/over_authored_max+over_fatigue_cap|pass/pair_net/beginner/40/matrix-d/block-3/10/10/over_authored_max+over_fatigue_cap|pass/pair_net/intermediate/40/matrix-b/block-3/10/10/over_authored_max+over_fatigue_cap",
    "triageStatus": "observed",
    "route": "defer",
    "enforcementStatus": "observation_only",
    "rationale": "Needs human review before deciding whether this is policy allowance, cap review, block split, or source-backed content depth.",
    "owner": "agent",
    "reviewedReportId": "generated-plan-diagnostics-report-2026-05-01",
    "affectedCellCount": 10,
    "likelyFixPaths": [
      "policy_allowance",
      "block_split",
      "variant_cap_review",
      "source_backed_content_depth"
    ],
    "evidence": []
  },
  {
    "groupKey": "gpdg:v1:d22:d22-solo-open:main_skill:true:under_authored_min",
    "diagnosticFingerprint": "gpdf|v1|6|none|none|10|block_split+policy_allowance+source_backed_content_depth+variant_cap_review|serve/solo_net/advanced/15/matrix-c/block-2/5/5/under_authored_min|serve/solo_net/intermediate/15/matrix-c/block-2/5/5/under_authored_min|serve/solo_open/advanced/15/matrix-a/block-2/5/5/under_authored_min",
    "triageStatus": "observed",
    "route": "defer",
    "enforcementStatus": "observation_only",
    "rationale": "Needs human review before deciding whether this is policy allowance, cap review, block split, or source-backed content depth.",
    "owner": "agent",
    "reviewedReportId": "generated-plan-diagnostics-report-2026-05-01",
    "affectedCellCount": 10,
    "likelyFixPaths": [
      "policy_allowance",
      "block_split",
      "variant_cap_review",
      "source_backed_content_depth"
    ],
    "evidence": []
  },
  {
    "groupKey": "gpdg:v1:d22:d22-solo-open:main_skill:true:optional_slot_redistribution",
    "diagnosticFingerprint": "gpdf|v1|none|none|none|10|block_split+generator_policy_investigation+policy_allowance+source_backed_content_depth+variant_cap_review|serve/solo_net/advanced/25/matrix-c/block-2/12/7/optional_slot_redistribution|serve/solo_net/intermediate/25/matrix-c/block-2/12/7/optional_slot_redistribution|serve/solo_open/advanced/25/matrix-a/block-2/12/7/optional_slot_redistribution",
    "triageStatus": "routed",
    "route": "generator_policy_investigation",
    "enforcementStatus": "observation_only",
    "rationale": "Redistribution evidence is present, so generator policy should be investigated before catalog changes.",
    "owner": "agent",
    "reviewedReportId": "generated-plan-diagnostics-report-2026-05-01",
    "affectedCellCount": 10,
    "likelyFixPaths": [
      "generator_policy_investigation",
      "policy_allowance",
      "block_split",
      "variant_cap_review",
      "source_backed_content_depth"
    ],
    "evidence": []
  },
  {
    "groupKey": "gpdg:v1:d22:d22-solo-open:main_skill:true:optional_slot_redistribution+over_authored_max+over_fatigue_cap",
    "diagnosticFingerprint": "gpdf|v1|none|12|12|10|block_split+generator_policy_investigation+policy_allowance+source_backed_content_depth+variant_cap_review|serve/solo_net/advanced/40/matrix-c/block-2/23/10/optional_slot_redistribution+over_authored_max+over_fatigue_cap|serve/solo_net/intermediate/40/matrix-c/block-2/23/10/optional_slot_redistribution+over_authored_max+over_fatigue_cap|serve/solo_open/advanced/40/matrix-a/block-2/22/10/optional_slot_redistribution+over_authored_max+over_fatigue_cap",
    "triageStatus": "routed",
    "route": "generator_policy_investigation",
    "enforcementStatus": "observation_only",
    "rationale": "Redistribution evidence is present, so generator policy should be investigated before catalog changes.",
    "owner": "agent",
    "reviewedReportId": "generated-plan-diagnostics-report-2026-05-01",
    "affectedCellCount": 10,
    "likelyFixPaths": [
      "generator_policy_investigation",
      "policy_allowance",
      "block_split",
      "variant_cap_review",
      "source_backed_content_depth"
    ],
    "evidence": []
  },
  {
    "groupKey": "gpdg:v1:d01:d01-solo:movement_proxy:false:over_authored_max+over_fatigue_cap",
    "diagnosticFingerprint": "gpdf|v1|none|5|5|9|block_split+policy_allowance+source_backed_content_depth+variant_cap_review|pass/solo_net/intermediate/40/matrix-b/block-2/6/6/over_authored_max+over_fatigue_cap|pass/solo_net/intermediate/40/matrix-c/block-2/6/6/over_authored_max+over_fatigue_cap|pass/solo_net/intermediate/40/matrix-d/block-2/6/6/over_authored_max+over_fatigue_cap",
    "triageStatus": "observed",
    "route": "defer",
    "enforcementStatus": "observation_only",
    "rationale": "Needs human review before deciding whether this is policy allowance, cap review, block split, or source-backed content depth.",
    "owner": "agent",
    "reviewedReportId": "generated-plan-diagnostics-report-2026-05-01",
    "affectedCellCount": 9,
    "likelyFixPaths": [
      "policy_allowance",
      "block_split",
      "variant_cap_review",
      "source_backed_content_depth"
    ],
    "evidence": []
  },
  {
    "groupKey": "gpdg:v1:d33:d33-pair-open:technique:true:under_authored_min",
    "diagnosticFingerprint": "gpdf|v1|6|none|none|9|block_split+policy_allowance+source_backed_content_depth+variant_cap_review|serve/pair_net/advanced/15/matrix-a/block-1/4/4/under_authored_min|serve/pair_net/beginner/15/matrix-a/block-1/4/4/under_authored_min|serve/pair_net/intermediate/15/matrix-a/block-1/4/4/under_authored_min",
    "triageStatus": "observed",
    "route": "defer",
    "enforcementStatus": "observation_only",
    "rationale": "Needs human review before deciding whether this is policy allowance, cap review, block split, or source-backed content depth.",
    "owner": "agent",
    "reviewedReportId": "generated-plan-diagnostics-report-2026-05-01",
    "affectedCellCount": 9,
    "likelyFixPaths": [
      "policy_allowance",
      "block_split",
      "variant_cap_review",
      "source_backed_content_depth"
    ],
    "evidence": []
  },
  {
    "groupKey": "gpdg:v1:d01:d01-pair:pressure:false:over_authored_max+over_fatigue_cap",
    "diagnosticFingerprint": "gpdf|v1|none|6|6|8|block_split+policy_allowance+source_backed_content_depth+variant_cap_review|pass/pair_net/beginner/40/matrix-a/block-4/8/8/over_authored_max+over_fatigue_cap|pass/pair_net/beginner/40/matrix-b/block-4/8/8/over_authored_max+over_fatigue_cap|pass/pair_net/beginner/40/matrix-d/block-4/8/8/over_authored_max+over_fatigue_cap",
    "triageStatus": "observed",
    "route": "defer",
    "enforcementStatus": "observation_only",
    "rationale": "Needs human review before deciding whether this is policy allowance, cap review, block split, or source-backed content depth.",
    "owner": "agent",
    "reviewedReportId": "generated-plan-diagnostics-report-2026-05-01",
    "affectedCellCount": 8,
    "likelyFixPaths": [
      "policy_allowance",
      "block_split",
      "variant_cap_review",
      "source_backed_content_depth"
    ],
    "evidence": []
  },
  {
    "groupKey": "gpdg:v1:d07:d07-pair-open:technique:true:under_authored_min",
    "diagnosticFingerprint": "gpdf|v1|5|none|none|8|block_split+policy_allowance+source_backed_content_depth+variant_cap_review|pass/pair_net/advanced/15/matrix-a/block-1/4/4/under_authored_min|pass/pair_net/advanced/15/matrix-b/block-1/4/4/under_authored_min|pass/pair_net/advanced/15/matrix-c/block-1/4/4/under_authored_min",
    "triageStatus": "observed",
    "route": "defer",
    "enforcementStatus": "observation_only",
    "rationale": "Needs human review before deciding whether this is policy allowance, cap review, block split, or source-backed content depth.",
    "owner": "agent",
    "reviewedReportId": "generated-plan-diagnostics-report-2026-05-01",
    "affectedCellCount": 8,
    "likelyFixPaths": [
      "policy_allowance",
      "block_split",
      "variant_cap_review",
      "source_backed_content_depth"
    ],
    "evidence": []
  },
  {
    "groupKey": "gpdg:v1:d22:d22-pair-open:technique:true:under_authored_min",
    "diagnosticFingerprint": "gpdf|v1|6|none|none|8|block_split+policy_allowance+source_backed_content_depth+variant_cap_review|serve/pair_net/advanced/15/matrix-b/block-1/4/4/under_authored_min|serve/pair_net/advanced/15/matrix-d/block-1/4/4/under_authored_min|serve/pair_net/intermediate/15/matrix-b/block-1/4/4/under_authored_min",
    "triageStatus": "observed",
    "route": "defer",
    "enforcementStatus": "observation_only",
    "rationale": "Needs human review before deciding whether this is policy allowance, cap review, block split, or source-backed content depth.",
    "owner": "agent",
    "reviewedReportId": "generated-plan-diagnostics-report-2026-05-01",
    "affectedCellCount": 8,
    "likelyFixPaths": [
      "policy_allowance",
      "block_split",
      "variant_cap_review",
      "source_backed_content_depth"
    ],
    "evidence": []
  },
  {
    "groupKey": "gpdg:v1:d48:d48-pair-open:technique:true:under_authored_min",
    "diagnosticFingerprint": "gpdf|v1|5|none|none|8|block_split+policy_allowance+source_backed_content_depth+variant_cap_review|set/pair_net/advanced/15/matrix-a/block-1/4/4/under_authored_min|set/pair_net/advanced/15/matrix-b/block-1/4/4/under_authored_min|set/pair_net/advanced/15/matrix-c/block-1/4/4/under_authored_min",
    "triageStatus": "observed",
    "route": "defer",
    "enforcementStatus": "observation_only",
    "rationale": "Needs human review before deciding whether this is policy allowance, cap review, block split, or source-backed content depth.",
    "owner": "agent",
    "reviewedReportId": "generated-plan-diagnostics-report-2026-05-01",
    "affectedCellCount": 8,
    "likelyFixPaths": [
      "policy_allowance",
      "block_split",
      "variant_cap_review",
      "source_backed_content_depth"
    ],
    "evidence": []
  },
  {
    "groupKey": "gpdg:v1:d49:d49-pair-open:main_skill:true:optional_slot_redistribution+over_authored_max+over_fatigue_cap",
    "diagnosticFingerprint": "gpdf|v1|none|14|14|8|block_split+generator_policy_investigation+policy_allowance+source_backed_content_depth+variant_cap_review|set/pair_net/advanced/40/matrix-a/block-3/18/10/optional_slot_redistribution+over_authored_max+over_fatigue_cap|set/pair_net/advanced/40/matrix-b/block-2/24/10/optional_slot_redistribution+over_authored_max+over_fatigue_cap|set/pair_net/advanced/40/matrix-c/block-2/24/10/optional_slot_redistribution+over_authored_max+over_fatigue_cap",
    "triageStatus": "routed",
    "route": "generator_policy_investigation",
    "enforcementStatus": "observation_only",
    "rationale": "Redistribution evidence is present, so generator policy should be investigated before catalog changes.",
    "owner": "agent",
    "reviewedReportId": "generated-plan-diagnostics-report-2026-05-01",
    "affectedCellCount": 8,
    "likelyFixPaths": [
      "generator_policy_investigation",
      "policy_allowance",
      "block_split",
      "variant_cap_review",
      "source_backed_content_depth"
    ],
    "evidence": []
  },
  {
    "groupKey": "gpdg:v1:d11:d11-solo:main_skill:true:over_authored_max+over_fatigue_cap",
    "diagnosticFingerprint": "gpdf|v1|none|7|7|6|block_split+policy_allowance+source_backed_content_depth+variant_cap_review|pass/solo_net/intermediate/40/matrix-b/block-3/10/10/over_authored_max+over_fatigue_cap|pass/solo_net/intermediate/40/matrix-c/block-3/10/10/over_authored_max+over_fatigue_cap|pass/solo_open/intermediate/40/matrix-b/block-3/10/10/over_authored_max+over_fatigue_cap",
    "triageStatus": "observed",
    "route": "defer",
    "enforcementStatus": "observation_only",
    "rationale": "Needs human review before deciding whether this is policy allowance, cap review, block split, or source-backed content depth.",
    "owner": "agent",
    "reviewedReportId": "generated-plan-diagnostics-report-2026-05-01",
    "affectedCellCount": 6,
    "likelyFixPaths": [
      "policy_allowance",
      "block_split",
      "variant_cap_review",
      "source_backed_content_depth"
    ],
    "evidence": []
  },
  {
    "groupKey": "gpdg:v1:d22:d22-pair-open:main_skill:true:under_authored_min",
    "diagnosticFingerprint": "gpdf|v1|6|none|none|6|block_split+policy_allowance+source_backed_content_depth+variant_cap_review|serve/pair_net/advanced/15/matrix-a/block-2/5/5/under_authored_min|serve/pair_net/intermediate/15/matrix-a/block-2/5/5/under_authored_min|serve/pair_open/advanced/15/matrix-b/block-2/5/5/under_authored_min",
    "triageStatus": "observed",
    "route": "defer",
    "enforcementStatus": "observation_only",
    "rationale": "Needs human review before deciding whether this is policy allowance, cap review, block split, or source-backed content depth.",
    "owner": "agent",
    "reviewedReportId": "generated-plan-diagnostics-report-2026-05-01",
    "affectedCellCount": 6,
    "likelyFixPaths": [
      "policy_allowance",
      "block_split",
      "variant_cap_review",
      "source_backed_content_depth"
    ],
    "evidence": []
  },
  {
    "groupKey": "gpdg:v1:d22:d22-pair-open:main_skill:true:optional_slot_redistribution",
    "diagnosticFingerprint": "gpdf|v1|none|none|none|6|block_split+generator_policy_investigation+policy_allowance+source_backed_content_depth+variant_cap_review|serve/pair_net/advanced/25/matrix-a/block-2/12/7/optional_slot_redistribution|serve/pair_net/intermediate/25/matrix-a/block-2/12/7/optional_slot_redistribution|serve/pair_open/advanced/25/matrix-b/block-2/12/7/optional_slot_redistribution",
    "triageStatus": "routed",
    "route": "generator_policy_investigation",
    "enforcementStatus": "observation_only",
    "rationale": "Redistribution evidence is present, so generator policy should be investigated before catalog changes.",
    "owner": "agent",
    "reviewedReportId": "generated-plan-diagnostics-report-2026-05-01",
    "affectedCellCount": 6,
    "likelyFixPaths": [
      "generator_policy_investigation",
      "policy_allowance",
      "block_split",
      "variant_cap_review",
      "source_backed_content_depth"
    ],
    "evidence": []
  },
  {
    "groupKey": "gpdg:v1:d22:d22-pair-open:main_skill:true:optional_slot_redistribution+over_authored_max+over_fatigue_cap",
    "diagnosticFingerprint": "gpdf|v1|none|12|12|6|block_split+generator_policy_investigation+policy_allowance+source_backed_content_depth+variant_cap_review|serve/pair_net/advanced/40/matrix-a/block-2/24/10/optional_slot_redistribution+over_authored_max+over_fatigue_cap|serve/pair_net/intermediate/40/matrix-a/block-2/24/10/optional_slot_redistribution+over_authored_max+over_fatigue_cap|serve/pair_open/advanced/40/matrix-b/block-2/22/9/optional_slot_redistribution+over_authored_max+over_fatigue_cap",
    "triageStatus": "routed",
    "route": "generator_policy_investigation",
    "enforcementStatus": "observation_only",
    "rationale": "Redistribution evidence is present, so generator policy should be investigated before catalog changes.",
    "owner": "agent",
    "reviewedReportId": "generated-plan-diagnostics-report-2026-05-01",
    "affectedCellCount": 6,
    "likelyFixPaths": [
      "generator_policy_investigation",
      "policy_allowance",
      "block_split",
      "variant_cap_review",
      "source_backed_content_depth"
    ],
    "evidence": []
  },
  {
    "groupKey": "gpdg:v1:d31:d31-pair-open:main_skill:true:optional_slot_redistribution+over_authored_max+over_fatigue_cap",
    "diagnosticFingerprint": "gpdf|v1|none|8|8|6|block_split+generator_policy_investigation+policy_allowance+source_backed_content_depth+variant_cap_review|serve/pair_net/beginner/25/matrix-c/block-2/12/7/optional_slot_redistribution+over_authored_max+over_fatigue_cap|serve/pair_net/beginner/40/matrix-c/block-2/24/10/optional_slot_redistribution+over_authored_max+over_fatigue_cap|serve/pair_open/beginner/25/matrix-b/block-2/12/7/optional_slot_redistribution+over_authored_max+over_fatigue_cap",
    "triageStatus": "routed",
    "route": "generator_policy_investigation",
    "enforcementStatus": "observation_only",
    "rationale": "Redistribution evidence is present, so generator policy should be investigated before catalog changes.",
    "owner": "agent",
    "reviewedReportId": "generated-plan-diagnostics-report-2026-05-01",
    "affectedCellCount": 6,
    "likelyFixPaths": [
      "generator_policy_investigation",
      "policy_allowance",
      "block_split",
      "variant_cap_review",
      "source_backed_content_depth"
    ],
    "evidence": []
  },
  {
    "groupKey": "gpdg:v1:d33:d33-solo-net:main_skill:true:optional_slot_redistribution+over_authored_max+over_fatigue_cap",
    "diagnosticFingerprint": "gpdf|v1|none|10|10|6|block_split+generator_policy_investigation+policy_allowance+source_backed_content_depth+variant_cap_review|serve/solo_net/advanced/25/matrix-b/block-2/12/7/optional_slot_redistribution+over_authored_max+over_fatigue_cap|serve/solo_net/advanced/40/matrix-b/block-2/23/10/optional_slot_redistribution+over_authored_max+over_fatigue_cap|serve/solo_net/beginner/25/matrix-d/block-2/12/7/optional_slot_redistribution+over_authored_max+over_fatigue_cap",
    "triageStatus": "routed",
    "route": "generator_policy_investigation",
    "enforcementStatus": "observation_only",
    "rationale": "Redistribution evidence is present, so generator policy should be investigated before catalog changes.",
    "owner": "agent",
    "reviewedReportId": "generated-plan-diagnostics-report-2026-05-01",
    "affectedCellCount": 6,
    "likelyFixPaths": [
      "generator_policy_investigation",
      "policy_allowance",
      "block_split",
      "variant_cap_review",
      "source_backed_content_depth"
    ],
    "evidence": []
  },
  {
    "groupKey": "gpdg:v1:d47:d47-solo-open:main_skill:true:over_authored_max+over_fatigue_cap",
    "diagnosticFingerprint": "gpdf|v1|none|9|9|6|block_split+policy_allowance+source_backed_content_depth+variant_cap_review|set/solo_net/intermediate/40/matrix-b/block-3/10/10/over_authored_max+over_fatigue_cap|set/solo_net/intermediate/40/matrix-c/block-3/10/10/over_authored_max+over_fatigue_cap|set/solo_open/intermediate/40/matrix-b/block-3/10/10/over_authored_max+over_fatigue_cap",
    "triageStatus": "observed",
    "route": "defer",
    "enforcementStatus": "observation_only",
    "rationale": "Needs human review before deciding whether this is policy allowance, cap review, block split, or source-backed content depth.",
    "owner": "agent",
    "reviewedReportId": "generated-plan-diagnostics-report-2026-05-01",
    "affectedCellCount": 6,
    "likelyFixPaths": [
      "policy_allowance",
      "block_split",
      "variant_cap_review",
      "source_backed_content_depth"
    ],
    "evidence": []
  },
  {
    "groupKey": "gpdg:v1:d49:d49-pair-open:main_skill:true:optional_slot_redistribution",
    "diagnosticFingerprint": "gpdf|v1|none|none|none|6|block_split+generator_policy_investigation+policy_allowance+source_backed_content_depth+variant_cap_review|set/pair_net/advanced/25/matrix-b/block-2/12/7/optional_slot_redistribution|set/pair_net/advanced/25/matrix-c/block-2/12/7/optional_slot_redistribution|set/pair_net/advanced/25/matrix-d/block-2/12/7/optional_slot_redistribution",
    "triageStatus": "routed",
    "route": "generator_policy_investigation",
    "enforcementStatus": "observation_only",
    "rationale": "Redistribution evidence is present, so generator policy should be investigated before catalog changes.",
    "owner": "agent",
    "reviewedReportId": "generated-plan-diagnostics-report-2026-05-01",
    "affectedCellCount": 6,
    "likelyFixPaths": [
      "generator_policy_investigation",
      "policy_allowance",
      "block_split",
      "variant_cap_review",
      "source_backed_content_depth"
    ],
    "evidence": []
  },
  {
    "groupKey": "gpdg:v1:d49:d49-solo-open:main_skill:true:optional_slot_redistribution",
    "diagnosticFingerprint": "gpdf|v1|none|none|none|6|block_split+generator_policy_investigation+policy_allowance+source_backed_content_depth+variant_cap_review|set/solo_net/advanced/25/matrix-a/block-2/12/7/optional_slot_redistribution|set/solo_net/advanced/25/matrix-d/block-2/12/7/optional_slot_redistribution|set/solo_open/advanced/25/matrix-a/block-2/12/7/optional_slot_redistribution",
    "triageStatus": "routed",
    "route": "generator_policy_investigation",
    "enforcementStatus": "observation_only",
    "rationale": "Redistribution evidence is present, so generator policy should be investigated before catalog changes.",
    "owner": "agent",
    "reviewedReportId": "generated-plan-diagnostics-report-2026-05-01",
    "affectedCellCount": 6,
    "likelyFixPaths": [
      "generator_policy_investigation",
      "policy_allowance",
      "block_split",
      "variant_cap_review",
      "source_backed_content_depth"
    ],
    "evidence": []
  },
  {
    "groupKey": "gpdg:v1:d10:d10-pair:main_skill:true:over_authored_max+over_fatigue_cap",
    "diagnosticFingerprint": "gpdf|v1|none|8|8|4|block_split+policy_allowance+source_backed_content_depth+variant_cap_review|pass/pair_net/beginner/40/matrix-c/block-3/10/10/over_authored_max+over_fatigue_cap|pass/pair_net/intermediate/40/matrix-a/block-3/10/10/over_authored_max+over_fatigue_cap|pass/pair_open/beginner/40/matrix-c/block-3/9/9/over_authored_max+over_fatigue_cap",
    "triageStatus": "observed",
    "route": "defer",
    "enforcementStatus": "observation_only",
    "rationale": "Needs human review before deciding whether this is policy allowance, cap review, block split, or source-backed content depth.",
    "owner": "agent",
    "reviewedReportId": "generated-plan-diagnostics-report-2026-05-01",
    "affectedCellCount": 4,
    "likelyFixPaths": [
      "policy_allowance",
      "block_split",
      "variant_cap_review",
      "source_backed_content_depth"
    ],
    "evidence": []
  },
  {
    "groupKey": "gpdg:v1:d49:d49-pair-open:main_skill:true:under_authored_min",
    "diagnosticFingerprint": "gpdf|v1|8|none|none|4|block_split+policy_allowance+source_backed_content_depth+variant_cap_review|set/pair_net/advanced/15/matrix-a/block-2/5/5/under_authored_min|set/pair_net/advanced/25/matrix-a/block-3/7/7/under_authored_min|set/pair_open/advanced/15/matrix-a/block-2/5/5/under_authored_min",
    "triageStatus": "observed",
    "route": "defer",
    "enforcementStatus": "observation_only",
    "rationale": "Needs human review before deciding whether this is policy allowance, cap review, block split, or source-backed content depth.",
    "owner": "agent",
    "reviewedReportId": "generated-plan-diagnostics-report-2026-05-01",
    "affectedCellCount": 4,
    "likelyFixPaths": [
      "policy_allowance",
      "block_split",
      "variant_cap_review",
      "source_backed_content_depth"
    ],
    "evidence": []
  },
  {
    "groupKey": "gpdg:v1:d01:d01-solo:pressure:false:over_authored_max+over_fatigue_cap",
    "diagnosticFingerprint": "gpdf|v1|none|5|5|3|block_split+policy_allowance+source_backed_content_depth+variant_cap_review|pass/solo_net/intermediate/40/matrix-a/block-4/7/7/over_authored_max+over_fatigue_cap|pass/solo_open/intermediate/40/matrix-a/block-4/6/6/over_authored_max+over_fatigue_cap|pass/solo_wall/intermediate/40/matrix-a/block-4/7/7/over_authored_max+over_fatigue_cap",
    "triageStatus": "observed",
    "route": "defer",
    "enforcementStatus": "observation_only",
    "rationale": "Needs human review before deciding whether this is policy allowance, cap review, block split, or source-backed content depth.",
    "owner": "agent",
    "reviewedReportId": "generated-plan-diagnostics-report-2026-05-01",
    "affectedCellCount": 3,
    "likelyFixPaths": [
      "policy_allowance",
      "block_split",
      "variant_cap_review",
      "source_backed_content_depth"
    ],
    "evidence": []
  },
  {
    "groupKey": "gpdg:v1:d07:d07-solo-open:main_skill:true:over_authored_max+over_fatigue_cap",
    "diagnosticFingerprint": "gpdf|v1|none|8|8|3|block_split+policy_allowance+source_backed_content_depth+variant_cap_review|pass/solo_net/intermediate/40/matrix-d/block-3/10/10/over_authored_max+over_fatigue_cap|pass/solo_open/intermediate/40/matrix-d/block-3/10/10/over_authored_max+over_fatigue_cap|pass/solo_wall/intermediate/40/matrix-d/block-3/10/10/over_authored_max+over_fatigue_cap",
    "triageStatus": "observed",
    "route": "defer",
    "enforcementStatus": "observation_only",
    "rationale": "Needs human review before deciding whether this is policy allowance, cap review, block split, or source-backed content depth.",
    "owner": "agent",
    "reviewedReportId": "generated-plan-diagnostics-report-2026-05-01",
    "affectedCellCount": 3,
    "likelyFixPaths": [
      "policy_allowance",
      "block_split",
      "variant_cap_review",
      "source_backed_content_depth"
    ],
    "evidence": []
  },
  {
    "groupKey": "gpdg:v1:d33:d33-pair:technique:true:under_authored_min",
    "diagnosticFingerprint": "gpdf|v1|6|none|none|3|block_split+policy_allowance+source_backed_content_depth+variant_cap_review|serve/pair_net/advanced/15/matrix-c/block-1/4/4/under_authored_min|serve/pair_net/beginner/15/matrix-c/block-1/4/4/under_authored_min|serve/pair_net/intermediate/15/matrix-c/block-1/4/4/under_authored_min",
    "triageStatus": "observed",
    "route": "defer",
    "enforcementStatus": "observation_only",
    "rationale": "Needs human review before deciding whether this is policy allowance, cap review, block split, or source-backed content depth.",
    "owner": "agent",
    "reviewedReportId": "generated-plan-diagnostics-report-2026-05-01",
    "affectedCellCount": 3,
    "likelyFixPaths": [
      "policy_allowance",
      "block_split",
      "variant_cap_review",
      "source_backed_content_depth"
    ],
    "evidence": []
  },
  {
    "groupKey": "gpdg:v1:d33:d33-solo-net:technique:true:under_authored_min",
    "diagnosticFingerprint": "gpdf|v1|6|none|none|3|block_split+policy_allowance+source_backed_content_depth+variant_cap_review|serve/solo_net/beginner/15/matrix-a/block-1/4/4/under_authored_min|serve/solo_net/beginner/15/matrix-b/block-1/4/4/under_authored_min|serve/solo_net/beginner/15/matrix-c/block-1/4/4/under_authored_min",
    "triageStatus": "observed",
    "route": "defer",
    "enforcementStatus": "observation_only",
    "rationale": "Needs human review before deciding whether this is policy allowance, cap review, block split, or source-backed content depth.",
    "owner": "agent",
    "reviewedReportId": "generated-plan-diagnostics-report-2026-05-01",
    "affectedCellCount": 3,
    "likelyFixPaths": [
      "policy_allowance",
      "block_split",
      "variant_cap_review",
      "source_backed_content_depth"
    ],
    "evidence": []
  },
  {
    "groupKey": "gpdg:v1:d33:d33-solo-net:main_skill:true:under_authored_min",
    "diagnosticFingerprint": "gpdf|v1|6|none|none|3|block_split+policy_allowance+source_backed_content_depth+variant_cap_review|serve/solo_net/advanced/15/matrix-b/block-2/5/5/under_authored_min|serve/solo_net/beginner/15/matrix-d/block-2/5/5/under_authored_min|serve/solo_net/intermediate/15/matrix-b/block-2/5/5/under_authored_min",
    "triageStatus": "observed",
    "route": "defer",
    "enforcementStatus": "observation_only",
    "rationale": "Needs human review before deciding whether this is policy allowance, cap review, block split, or source-backed content depth.",
    "owner": "agent",
    "reviewedReportId": "generated-plan-diagnostics-report-2026-05-01",
    "affectedCellCount": 3,
    "likelyFixPaths": [
      "policy_allowance",
      "block_split",
      "variant_cap_review",
      "source_backed_content_depth"
    ],
    "evidence": []
  },
  {
    "groupKey": "gpdg:v1:d03:d03-pair:main_skill:true:over_authored_max+over_fatigue_cap",
    "diagnosticFingerprint": "gpdf|v1|none|8|8|2|block_split+policy_allowance+source_backed_content_depth+variant_cap_review|pass/pair_net/beginner/40/matrix-a/block-3/10/10/over_authored_max+over_fatigue_cap|pass/pair_open/beginner/40/matrix-a/block-3/9/9/over_authored_max+over_fatigue_cap",
    "triageStatus": "observed",
    "route": "defer",
    "enforcementStatus": "observation_only",
    "rationale": "Needs human review before deciding whether this is policy allowance, cap review, block split, or source-backed content depth.",
    "owner": "agent",
    "reviewedReportId": "generated-plan-diagnostics-report-2026-05-01",
    "affectedCellCount": 2,
    "likelyFixPaths": [
      "policy_allowance",
      "block_split",
      "variant_cap_review",
      "source_backed_content_depth"
    ],
    "evidence": []
  },
  {
    "groupKey": "gpdg:v1:d22:d22-pair:main_skill:true:under_authored_min",
    "diagnosticFingerprint": "gpdf|v1|6|none|none|2|block_split+policy_allowance+source_backed_content_depth+variant_cap_review|serve/pair_net/advanced/15/matrix-c/block-2/5/5/under_authored_min|serve/pair_net/intermediate/15/matrix-c/block-2/5/5/under_authored_min",
    "triageStatus": "observed",
    "route": "defer",
    "enforcementStatus": "observation_only",
    "rationale": "Needs human review before deciding whether this is policy allowance, cap review, block split, or source-backed content depth.",
    "owner": "agent",
    "reviewedReportId": "generated-plan-diagnostics-report-2026-05-01",
    "affectedCellCount": 2,
    "likelyFixPaths": [
      "policy_allowance",
      "block_split",
      "variant_cap_review",
      "source_backed_content_depth"
    ],
    "evidence": []
  },
  {
    "groupKey": "gpdg:v1:d22:d22-pair:main_skill:true:optional_slot_redistribution",
    "diagnosticFingerprint": "gpdf|v1|none|none|none|2|block_split+generator_policy_investigation+policy_allowance+source_backed_content_depth+variant_cap_review|serve/pair_net/advanced/25/matrix-c/block-2/12/7/optional_slot_redistribution|serve/pair_net/intermediate/25/matrix-c/block-2/12/7/optional_slot_redistribution",
    "triageStatus": "routed",
    "route": "generator_policy_investigation",
    "enforcementStatus": "observation_only",
    "rationale": "Redistribution evidence is present, so generator policy should be investigated before catalog changes.",
    "owner": "agent",
    "reviewedReportId": "generated-plan-diagnostics-report-2026-05-01",
    "affectedCellCount": 2,
    "likelyFixPaths": [
      "generator_policy_investigation",
      "policy_allowance",
      "block_split",
      "variant_cap_review",
      "source_backed_content_depth"
    ],
    "evidence": []
  },
  {
    "groupKey": "gpdg:v1:d22:d22-pair:main_skill:true:optional_slot_redistribution+over_authored_max+over_fatigue_cap",
    "diagnosticFingerprint": "gpdf|v1|none|12|12|2|block_split+generator_policy_investigation+policy_allowance+source_backed_content_depth+variant_cap_review|serve/pair_net/advanced/40/matrix-c/block-2/24/10/optional_slot_redistribution+over_authored_max+over_fatigue_cap|serve/pair_net/intermediate/40/matrix-c/block-2/24/10/optional_slot_redistribution+over_authored_max+over_fatigue_cap",
    "triageStatus": "routed",
    "route": "generator_policy_investigation",
    "enforcementStatus": "observation_only",
    "rationale": "Redistribution evidence is present, so generator policy should be investigated before catalog changes.",
    "owner": "agent",
    "reviewedReportId": "generated-plan-diagnostics-report-2026-05-01",
    "affectedCellCount": 2,
    "likelyFixPaths": [
      "generator_policy_investigation",
      "policy_allowance",
      "block_split",
      "variant_cap_review",
      "source_backed_content_depth"
    ],
    "evidence": []
  },
  {
    "groupKey": "gpdg:v1:d22:d22-solo:main_skill:true:under_authored_min",
    "diagnosticFingerprint": "gpdf|v1|6|none|none|2|block_split+policy_allowance+source_backed_content_depth+variant_cap_review|serve/solo_net/advanced/15/matrix-a/block-2/5/5/under_authored_min|serve/solo_net/intermediate/15/matrix-a/block-2/5/5/under_authored_min",
    "triageStatus": "observed",
    "route": "defer",
    "enforcementStatus": "observation_only",
    "rationale": "Needs human review before deciding whether this is policy allowance, cap review, block split, or source-backed content depth.",
    "owner": "agent",
    "reviewedReportId": "generated-plan-diagnostics-report-2026-05-01",
    "affectedCellCount": 2,
    "likelyFixPaths": [
      "policy_allowance",
      "block_split",
      "variant_cap_review",
      "source_backed_content_depth"
    ],
    "evidence": []
  },
  {
    "groupKey": "gpdg:v1:d22:d22-solo:main_skill:true:optional_slot_redistribution",
    "diagnosticFingerprint": "gpdf|v1|none|none|none|2|block_split+generator_policy_investigation+policy_allowance+source_backed_content_depth+variant_cap_review|serve/solo_net/advanced/25/matrix-a/block-2/12/7/optional_slot_redistribution|serve/solo_net/intermediate/25/matrix-a/block-2/12/7/optional_slot_redistribution",
    "triageStatus": "routed",
    "route": "generator_policy_investigation",
    "enforcementStatus": "observation_only",
    "rationale": "Redistribution evidence is present, so generator policy should be investigated before catalog changes.",
    "owner": "agent",
    "reviewedReportId": "generated-plan-diagnostics-report-2026-05-01",
    "affectedCellCount": 2,
    "likelyFixPaths": [
      "generator_policy_investigation",
      "policy_allowance",
      "block_split",
      "variant_cap_review",
      "source_backed_content_depth"
    ],
    "evidence": []
  },
  {
    "groupKey": "gpdg:v1:d22:d22-solo:main_skill:true:optional_slot_redistribution+over_authored_max+over_fatigue_cap",
    "diagnosticFingerprint": "gpdf|v1|none|12|12|2|block_split+generator_policy_investigation+policy_allowance+source_backed_content_depth+variant_cap_review|serve/solo_net/advanced/40/matrix-a/block-2/23/10/optional_slot_redistribution+over_authored_max+over_fatigue_cap|serve/solo_net/intermediate/40/matrix-a/block-2/23/10/optional_slot_redistribution+over_authored_max+over_fatigue_cap",
    "triageStatus": "routed",
    "route": "generator_policy_investigation",
    "enforcementStatus": "observation_only",
    "rationale": "Redistribution evidence is present, so generator policy should be investigated before catalog changes.",
    "owner": "agent",
    "reviewedReportId": "generated-plan-diagnostics-report-2026-05-01",
    "affectedCellCount": 2,
    "likelyFixPaths": [
      "generator_policy_investigation",
      "policy_allowance",
      "block_split",
      "variant_cap_review",
      "source_backed_content_depth"
    ],
    "evidence": []
  },
  {
    "groupKey": "gpdg:v1:d31:d31-pair:main_skill:true:optional_slot_redistribution+over_authored_max+over_fatigue_cap",
    "diagnosticFingerprint": "gpdf|v1|none|8|8|2|block_split+generator_policy_investigation+policy_allowance+source_backed_content_depth+variant_cap_review|serve/pair_net/beginner/25/matrix-a/block-2/12/7/optional_slot_redistribution+over_authored_max+over_fatigue_cap|serve/pair_net/beginner/40/matrix-a/block-2/24/10/optional_slot_redistribution+over_authored_max+over_fatigue_cap",
    "triageStatus": "routed",
    "route": "generator_policy_investigation",
    "enforcementStatus": "observation_only",
    "rationale": "Redistribution evidence is present, so generator policy should be investigated before catalog changes.",
    "owner": "agent",
    "reviewedReportId": "generated-plan-diagnostics-report-2026-05-01",
    "affectedCellCount": 2,
    "likelyFixPaths": [
      "generator_policy_investigation",
      "policy_allowance",
      "block_split",
      "variant_cap_review",
      "source_backed_content_depth"
    ],
    "evidence": []
  },
  {
    "groupKey": "gpdg:v1:d38:d38-pair:main_skill:true:over_authored_max+over_fatigue_cap",
    "diagnosticFingerprint": "gpdf|v1|none|8|8|2|block_split+policy_allowance+source_backed_content_depth+variant_cap_review|set/pair_net/beginner/40/matrix-c/block-3/10/10/over_authored_max+over_fatigue_cap|set/pair_open/beginner/40/matrix-c/block-3/9/9/over_authored_max+over_fatigue_cap",
    "triageStatus": "observed",
    "route": "defer",
    "enforcementStatus": "observation_only",
    "rationale": "Needs human review before deciding whether this is policy allowance, cap review, block split, or source-backed content depth.",
    "owner": "agent",
    "reviewedReportId": "generated-plan-diagnostics-report-2026-05-01",
    "affectedCellCount": 2,
    "likelyFixPaths": [
      "policy_allowance",
      "block_split",
      "variant_cap_review",
      "source_backed_content_depth"
    ],
    "evidence": []
  },
  {
    "groupKey": "gpdg:v1:d01:d01-pair:technique:true:over_authored_max+over_fatigue_cap",
    "diagnosticFingerprint": "gpdf|v1|none|6|6|1|block_split+policy_allowance+source_backed_content_depth+variant_cap_review|pass/pair_open/intermediate/40/matrix-c/block-1/8/8/over_authored_max+over_fatigue_cap",
    "triageStatus": "observed",
    "route": "defer",
    "enforcementStatus": "observation_only",
    "rationale": "Needs human review before deciding whether this is policy allowance, cap review, block split, or source-backed content depth.",
    "owner": "agent",
    "reviewedReportId": "generated-plan-diagnostics-report-2026-05-01",
    "affectedCellCount": 1,
    "likelyFixPaths": [
      "policy_allowance",
      "block_split",
      "variant_cap_review",
      "source_backed_content_depth"
    ],
    "evidence": []
  },
  {
    "groupKey": "gpdg:v1:d11:d11-pair:pressure:false:over_authored_max+over_fatigue_cap",
    "diagnosticFingerprint": "gpdf|v1|none|7|7|1|block_split+policy_allowance+source_backed_content_depth+variant_cap_review|pass/pair_net/intermediate/40/matrix-c/block-4/8/8/over_authored_max+over_fatigue_cap",
    "triageStatus": "observed",
    "route": "defer",
    "enforcementStatus": "observation_only",
    "rationale": "Needs human review before deciding whether this is policy allowance, cap review, block split, or source-backed content depth.",
    "owner": "agent",
    "reviewedReportId": "generated-plan-diagnostics-report-2026-05-01",
    "affectedCellCount": 1,
    "likelyFixPaths": [
      "policy_allowance",
      "block_split",
      "variant_cap_review",
      "source_backed_content_depth"
    ],
    "evidence": []
  }
]
```
<!-- diagnostic-triage-registry:end -->
