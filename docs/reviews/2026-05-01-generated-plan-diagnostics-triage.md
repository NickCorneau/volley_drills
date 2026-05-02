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
---

# Generated Plan Diagnostics Triage

## Purpose

Record the current docs-first triage workbench for generated-plan routeable observation groups. This file is fully generated and validated by `npm run diagnostics:report:check`.

## Interpretation

This workbench does not authorize catalog changes. It routes generated-plan observations into conservative decision lanes and compresses unresolved rows into derived human review prompts so maintainers can decide whether a group is a policy allowance, cap review, block split, source-backed content-depth item, or generator-policy investigation.

## Triage Summary

- Current routeable groups: 53
- Registry entries: 53
- Blocking validation issues: 0
- Warning validation issues: 0

## Route Counts

- `defer`: 32
- `generator_policy_investigation`: 21

## Decision-Debt Compression

### Short-session cooldown minimum

- Lane: `short_session_cooldown_minimum`
- Question: Is the short wrap envelope acceptable, or does this need cap/block/content follow-up?
- Why this lane: Wrap under-min groups are likely cooldown policy questions before they are catalog gaps.
- Groups: 1; total affected cells: 87
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
- Groups: 19; total affected cells: 106
- Redistribution-affected cells: 0
- Non-redistribution over-cap cells: 57
- Route mix: `defer` 19
- Disposition: `needs_human_decision`
- Candidate dispositions: `metadata_review_needed`, `block_shape_review_needed`, `requires_U6_preview`, `no_implementation_action_yet`
- Recommended follow-up: U7 workload envelope guidance
- Guide: `docs/ops/workload-envelope-authoring-guide.md#workload-envelope-review`
- Next evidence needed: Review cap policy and block split thresholds for the affected main-skill groups.
- Group keys: `gpdg:v1:d33:d33-solo-open:main_skill:true:under_authored_min`, `gpdg:v1:d01:d01-solo:technique:true:over_authored_max+over_fatigue_cap`, `gpdg:v1:d33:d33-pair-open:main_skill:true:under_authored_min`, `gpdg:v1:d05:d05-pair:main_skill:true:over_authored_max+over_fatigue_cap`, `gpdg:v1:d22:d22-solo-open:main_skill:true:under_authored_min`, `gpdg:v1:d01:d01-pair:pressure:false:over_authored_max+over_fatigue_cap`, `gpdg:v1:d01:d01-solo:movement_proxy:false:over_authored_max+over_fatigue_cap`, `gpdg:v1:d11:d11-solo:main_skill:true:over_authored_max+over_fatigue_cap`, `gpdg:v1:d22:d22-pair-open:main_skill:true:under_authored_min`, `gpdg:v1:d01:d01-pair:main_skill:true:over_authored_max+over_fatigue_cap`, `gpdg:v1:d01:d01-solo:pressure:false:over_authored_max+over_fatigue_cap`, `gpdg:v1:d33:d33-solo-net:main_skill:true:under_authored_min`, `gpdg:v1:d03:d03-pair:main_skill:true:over_authored_max+over_fatigue_cap`, `gpdg:v1:d10:d10-pair:main_skill:true:over_authored_max+over_fatigue_cap`, `gpdg:v1:d22:d22-pair:main_skill:true:under_authored_min`, `gpdg:v1:d22:d22-solo:main_skill:true:under_authored_min`, `gpdg:v1:d38:d38-pair:main_skill:true:over_authored_max+over_fatigue_cap`, `gpdg:v1:d01:d01-pair:technique:true:over_authored_max+over_fatigue_cap`, `gpdg:v1:d11:d11-pair:pressure:false:over_authored_max+over_fatigue_cap`

### Generator redistribution investigation

- Lane: `generator_redistribution_investigation`
- Question: Would these over-cap groups still exist without optional-slot redistribution?
- Why this lane: Redistribution evidence means generator policy should be investigated before catalog changes.
- Groups: 21; total affected cells: 251
- Redistribution-affected cells: 236
- Non-redistribution over-cap cells: 15
- Route mix: `generator_policy_investigation` 21
- Disposition: `needs_human_decision`
- Candidate dispositions: `route_to_U8`
- Recommended follow-up: U8 redistribution comparison
- Next evidence needed: Compare redistribution-affected cells against non-redistribution over-cap cells.
- Group keys: `gpdg:v1:d47:d47-solo-open:main_skill:true:optional_slot_redistribution+over_authored_max+over_fatigue_cap`, `gpdg:v1:d33:d33-solo-open:main_skill:true:optional_slot_redistribution+over_authored_max+over_fatigue_cap`, `gpdg:v1:d33:d33-pair-open:main_skill:true:optional_slot_redistribution+over_authored_max+over_fatigue_cap`, `gpdg:v1:d46:d46-solo-open:main_skill:true:optional_slot_redistribution+over_authored_max+over_fatigue_cap`, `gpdg:v1:d01:d01-solo:main_skill:true:optional_slot_redistribution+over_authored_max+over_fatigue_cap`, `gpdg:v1:d46:d46-pair-open:main_skill:true:optional_slot_redistribution+over_authored_max+over_fatigue_cap`, `gpdg:v1:d47:d47-pair-open:main_skill:true:optional_slot_redistribution+over_authored_max+over_fatigue_cap`, `gpdg:v1:d05:d05-solo:main_skill:true:optional_slot_redistribution+over_authored_max+over_fatigue_cap`, `gpdg:v1:d31:d31-solo-open:main_skill:true:optional_slot_redistribution+over_authored_max+over_fatigue_cap`, `gpdg:v1:d40:d40-solo:main_skill:true:optional_slot_redistribution+over_authored_max+over_fatigue_cap`, `gpdg:v1:d22:d22-solo-open:main_skill:true:optional_slot_redistribution`, `gpdg:v1:d22:d22-solo-open:main_skill:true:optional_slot_redistribution+over_authored_max+over_fatigue_cap`, `gpdg:v1:d22:d22-pair-open:main_skill:true:optional_slot_redistribution`, `gpdg:v1:d22:d22-pair-open:main_skill:true:optional_slot_redistribution+over_authored_max+over_fatigue_cap`, `gpdg:v1:d31:d31-pair-open:main_skill:true:optional_slot_redistribution+over_authored_max+over_fatigue_cap`, `gpdg:v1:d33:d33-solo-net:main_skill:true:optional_slot_redistribution+over_authored_max+over_fatigue_cap`, `gpdg:v1:d22:d22-pair:main_skill:true:optional_slot_redistribution`, `gpdg:v1:d22:d22-pair:main_skill:true:optional_slot_redistribution+over_authored_max+over_fatigue_cap`, `gpdg:v1:d22:d22-solo:main_skill:true:optional_slot_redistribution`, `gpdg:v1:d22:d22-solo:main_skill:true:optional_slot_redistribution+over_authored_max+over_fatigue_cap`, `gpdg:v1:d31:d31-pair:main_skill:true:optional_slot_redistribution+over_authored_max+over_fatigue_cap`


## Redistribution Causality Receipt

- Comparison mode: `allocated_duration_counterfactual`
- Runtime boundary: Diagnostic-only receipt; shipped buildDraft() behavior is unchanged.
- Groups: 21; total affected cells: 251
- Redistribution-affected cells: 236
- Current pressure cells: over authored max 231, over fatigue cap 231, under authored min 0
- Allocated-duration pressure cells: over authored max 80, over fatigue cap 80, under authored min 0
- Non-redistribution pressure cells: over cap 15, under authored min 0
- Pressure disappears under allocated-duration counterfactual: 151
- Pressure remains without redistribution: 80
- Comparison inconclusive cells: 0
- Redistribution without cap/min pressure cells: 20
- Counterfactual unfilled minutes across affected cells: 2092

### Redistribution Causality Groups

- `gpdg:v1:d47:d47-solo-open:main_skill:true:optional_slot_redistribution+over_authored_max+over_fatigue_cap`: action `pressure_remains_without_redistribution`, dominant `pressure_remains_without_redistribution`, incomplete evidence no, pressure disappears 12, pressure remains 18, non-redistribution pressure 6, inconclusive 0, follow-up `workload_review`, `block_shape_review`, `source_backed_proposal_work`, `u6_proposal_admission_candidate`, `future_generator_policy_decision`
- `gpdg:v1:d33:d33-solo-open:main_skill:true:optional_slot_redistribution+over_authored_max+over_fatigue_cap`: action `likely_redistribution_caused`, dominant `likely_redistribution_caused`, incomplete evidence no, pressure disappears 28, pressure remains 0, non-redistribution pressure 0, inconclusive 0, follow-up `future_generator_policy_decision`
- `gpdg:v1:d33:d33-pair-open:main_skill:true:optional_slot_redistribution+over_authored_max+over_fatigue_cap`: action `likely_redistribution_caused`, dominant `likely_redistribution_caused`, incomplete evidence no, pressure disappears 24, pressure remains 0, non-redistribution pressure 0, inconclusive 0, follow-up `future_generator_policy_decision`
- `gpdg:v1:d46:d46-solo-open:main_skill:true:optional_slot_redistribution+over_authored_max+over_fatigue_cap`: action `pressure_remains_without_redistribution`, dominant `mixed_cell_states`, incomplete evidence no, pressure disappears 12, pressure remains 12, non-redistribution pressure 0, inconclusive 0, follow-up `workload_review`, `block_shape_review`, `source_backed_proposal_work`, `u6_proposal_admission_candidate`, `future_generator_policy_decision`
- `gpdg:v1:d01:d01-solo:main_skill:true:optional_slot_redistribution+over_authored_max+over_fatigue_cap`: action `pressure_remains_without_redistribution`, dominant `pressure_remains_without_redistribution`, incomplete evidence no, pressure disappears 0, pressure remains 18, non-redistribution pressure 6, inconclusive 0, follow-up `workload_review`, `block_shape_review`, `source_backed_proposal_work`, `u6_proposal_admission_candidate`
- `gpdg:v1:d46:d46-pair-open:main_skill:true:optional_slot_redistribution+over_authored_max+over_fatigue_cap`: action `pressure_remains_without_redistribution`, dominant `mixed_cell_states`, incomplete evidence no, pressure disappears 8, pressure remains 8, non-redistribution pressure 0, inconclusive 0, follow-up `workload_review`, `block_shape_review`, `source_backed_proposal_work`, `u6_proposal_admission_candidate`, `future_generator_policy_decision`
- `gpdg:v1:d47:d47-pair-open:main_skill:true:optional_slot_redistribution+over_authored_max+over_fatigue_cap`: action `pressure_remains_without_redistribution`, dominant `likely_redistribution_caused`, incomplete evidence no, pressure disappears 12, pressure remains 4, non-redistribution pressure 0, inconclusive 0, follow-up `workload_review`, `block_shape_review`, `source_backed_proposal_work`, `u6_proposal_admission_candidate`, `future_generator_policy_decision`
- `gpdg:v1:d05:d05-solo:main_skill:true:optional_slot_redistribution+over_authored_max+over_fatigue_cap`: action `pressure_remains_without_redistribution`, dominant `pressure_remains_without_redistribution`, incomplete evidence no, pressure disappears 6, pressure remains 9, non-redistribution pressure 3, inconclusive 0, follow-up `workload_review`, `block_shape_review`, `source_backed_proposal_work`, `u6_proposal_admission_candidate`, `future_generator_policy_decision`
- `gpdg:v1:d31:d31-solo-open:main_skill:true:optional_slot_redistribution+over_authored_max+over_fatigue_cap`: action `pressure_remains_without_redistribution`, dominant `mixed_cell_states`, incomplete evidence no, pressure disappears 7, pressure remains 7, non-redistribution pressure 0, inconclusive 0, follow-up `workload_review`, `block_shape_review`, `source_backed_proposal_work`, `u6_proposal_admission_candidate`, `future_generator_policy_decision`
- `gpdg:v1:d40:d40-solo:main_skill:true:optional_slot_redistribution+over_authored_max+over_fatigue_cap`: action `likely_redistribution_caused`, dominant `likely_redistribution_caused`, incomplete evidence no, pressure disappears 12, pressure remains 0, non-redistribution pressure 0, inconclusive 0, follow-up `future_generator_policy_decision`
- `gpdg:v1:d22:d22-solo-open:main_skill:true:optional_slot_redistribution`: action `redistribution_without_pressure`, dominant `redistribution_without_pressure`, incomplete evidence no, pressure disappears 0, pressure remains 0, non-redistribution pressure 0, inconclusive 0, follow-up `no_implementation_action_yet`
- `gpdg:v1:d22:d22-solo-open:main_skill:true:optional_slot_redistribution+over_authored_max+over_fatigue_cap`: action `likely_redistribution_caused`, dominant `likely_redistribution_caused`, incomplete evidence no, pressure disappears 10, pressure remains 0, non-redistribution pressure 0, inconclusive 0, follow-up `future_generator_policy_decision`
- `gpdg:v1:d22:d22-pair-open:main_skill:true:optional_slot_redistribution`: action `redistribution_without_pressure`, dominant `redistribution_without_pressure`, incomplete evidence no, pressure disappears 0, pressure remains 0, non-redistribution pressure 0, inconclusive 0, follow-up `no_implementation_action_yet`
- `gpdg:v1:d22:d22-pair-open:main_skill:true:optional_slot_redistribution+over_authored_max+over_fatigue_cap`: action `likely_redistribution_caused`, dominant `likely_redistribution_caused`, incomplete evidence no, pressure disappears 6, pressure remains 0, non-redistribution pressure 0, inconclusive 0, follow-up `future_generator_policy_decision`
- `gpdg:v1:d31:d31-pair-open:main_skill:true:optional_slot_redistribution+over_authored_max+over_fatigue_cap`: action `pressure_remains_without_redistribution`, dominant `mixed_cell_states`, incomplete evidence no, pressure disappears 3, pressure remains 3, non-redistribution pressure 0, inconclusive 0, follow-up `workload_review`, `block_shape_review`, `source_backed_proposal_work`, `u6_proposal_admission_candidate`, `future_generator_policy_decision`
- `gpdg:v1:d33:d33-solo-net:main_skill:true:optional_slot_redistribution+over_authored_max+over_fatigue_cap`: action `likely_redistribution_caused`, dominant `likely_redistribution_caused`, incomplete evidence no, pressure disappears 6, pressure remains 0, non-redistribution pressure 0, inconclusive 0, follow-up `future_generator_policy_decision`
- `gpdg:v1:d22:d22-pair:main_skill:true:optional_slot_redistribution`: action `redistribution_without_pressure`, dominant `redistribution_without_pressure`, incomplete evidence no, pressure disappears 0, pressure remains 0, non-redistribution pressure 0, inconclusive 0, follow-up `no_implementation_action_yet`
- `gpdg:v1:d22:d22-pair:main_skill:true:optional_slot_redistribution+over_authored_max+over_fatigue_cap`: action `likely_redistribution_caused`, dominant `likely_redistribution_caused`, incomplete evidence no, pressure disappears 2, pressure remains 0, non-redistribution pressure 0, inconclusive 0, follow-up `future_generator_policy_decision`
- `gpdg:v1:d22:d22-solo:main_skill:true:optional_slot_redistribution`: action `redistribution_without_pressure`, dominant `redistribution_without_pressure`, incomplete evidence no, pressure disappears 0, pressure remains 0, non-redistribution pressure 0, inconclusive 0, follow-up `no_implementation_action_yet`
- `gpdg:v1:d22:d22-solo:main_skill:true:optional_slot_redistribution+over_authored_max+over_fatigue_cap`: action `likely_redistribution_caused`, dominant `likely_redistribution_caused`, incomplete evidence no, pressure disappears 2, pressure remains 0, non-redistribution pressure 0, inconclusive 0, follow-up `future_generator_policy_decision`
- `gpdg:v1:d31:d31-pair:main_skill:true:optional_slot_redistribution+over_authored_max+over_fatigue_cap`: action `pressure_remains_without_redistribution`, dominant `mixed_cell_states`, incomplete evidence no, pressure disappears 1, pressure remains 1, non-redistribution pressure 0, inconclusive 0, follow-up `workload_review`, `block_shape_review`, `source_backed_proposal_work`, `u6_proposal_admission_candidate`, `future_generator_policy_decision`

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

- `gpdg:v1:d25:d25-solo:wrap:true:under_authored_min` (87 cells): Needs human review before deciding whether this is policy allowance, cap review, block split, or source-backed content depth.
- `gpdg:v1:d07:d07-solo-open:technique:true:under_authored_min` (18 cells): Needs human review before deciding whether this is policy allowance, cap review, block split, or source-backed content depth.
- `gpdg:v1:d33:d33-solo-open:technique:true:under_authored_min` (16 cells): Needs human review before deciding whether this is policy allowance, cap review, block split, or source-backed content depth.
- `gpdg:v1:d33:d33-solo-open:main_skill:true:under_authored_min` (14 cells): Needs human review before deciding whether this is policy allowance, cap review, block split, or source-backed content depth.
- `gpdg:v1:d01:d01-solo:technique:true:over_authored_max+over_fatigue_cap` (12 cells): Needs human review before deciding whether this is policy allowance, cap review, block split, or source-backed content depth.
- `gpdg:v1:d22:d22-solo-open:technique:true:under_authored_min` (12 cells): Needs human review before deciding whether this is policy allowance, cap review, block split, or source-backed content depth.
- `gpdg:v1:d33:d33-pair-open:main_skill:true:under_authored_min` (12 cells): Needs human review before deciding whether this is policy allowance, cap review, block split, or source-backed content depth.
- `gpdg:v1:d38:d38-solo:technique:true:under_authored_min` (12 cells): Needs human review before deciding whether this is policy allowance, cap review, block split, or source-backed content depth.
- `gpdg:v1:d39:d39-solo:technique:true:under_authored_min` (12 cells): Needs human review before deciding whether this is policy allowance, cap review, block split, or source-backed content depth.
- `gpdg:v1:d48:d48-solo-open:technique:true:under_authored_min` (12 cells): Needs human review before deciding whether this is policy allowance, cap review, block split, or source-backed content depth.
- `gpdg:v1:d05:d05-pair:main_skill:true:over_authored_max+over_fatigue_cap` (10 cells): Needs human review before deciding whether this is policy allowance, cap review, block split, or source-backed content depth.
- `gpdg:v1:d22:d22-solo-open:main_skill:true:under_authored_min` (10 cells): Needs human review before deciding whether this is policy allowance, cap review, block split, or source-backed content depth.
- `gpdg:v1:d33:d33-pair-open:technique:true:under_authored_min` (9 cells): Needs human review before deciding whether this is policy allowance, cap review, block split, or source-backed content depth.
- `gpdg:v1:d01:d01-pair:pressure:false:over_authored_max+over_fatigue_cap` (8 cells): Needs human review before deciding whether this is policy allowance, cap review, block split, or source-backed content depth.
- `gpdg:v1:d07:d07-pair-open:technique:true:under_authored_min` (8 cells): Needs human review before deciding whether this is policy allowance, cap review, block split, or source-backed content depth.
- `gpdg:v1:d22:d22-pair-open:technique:true:under_authored_min` (8 cells): Needs human review before deciding whether this is policy allowance, cap review, block split, or source-backed content depth.
- `gpdg:v1:d48:d48-pair-open:technique:true:under_authored_min` (8 cells): Needs human review before deciding whether this is policy allowance, cap review, block split, or source-backed content depth.
- `gpdg:v1:d01:d01-solo:movement_proxy:false:over_authored_max+over_fatigue_cap` (6 cells): Needs human review before deciding whether this is policy allowance, cap review, block split, or source-backed content depth.
- `gpdg:v1:d11:d11-solo:main_skill:true:over_authored_max+over_fatigue_cap` (6 cells): Needs human review before deciding whether this is policy allowance, cap review, block split, or source-backed content depth.
- `gpdg:v1:d22:d22-pair-open:main_skill:true:under_authored_min` (6 cells): Needs human review before deciding whether this is policy allowance, cap review, block split, or source-backed content depth.
- `gpdg:v1:d01:d01-pair:main_skill:true:over_authored_max+over_fatigue_cap` (4 cells): Needs human review before deciding whether this is policy allowance, cap review, block split, or source-backed content depth.
- `gpdg:v1:d01:d01-solo:pressure:false:over_authored_max+over_fatigue_cap` (3 cells): Needs human review before deciding whether this is policy allowance, cap review, block split, or source-backed content depth.
- `gpdg:v1:d33:d33-pair:technique:true:under_authored_min` (3 cells): Needs human review before deciding whether this is policy allowance, cap review, block split, or source-backed content depth.
- `gpdg:v1:d33:d33-solo-net:technique:true:under_authored_min` (3 cells): Needs human review before deciding whether this is policy allowance, cap review, block split, or source-backed content depth.
- `gpdg:v1:d33:d33-solo-net:main_skill:true:under_authored_min` (3 cells): Needs human review before deciding whether this is policy allowance, cap review, block split, or source-backed content depth.
- `gpdg:v1:d03:d03-pair:main_skill:true:over_authored_max+over_fatigue_cap` (2 cells): Needs human review before deciding whether this is policy allowance, cap review, block split, or source-backed content depth.
- `gpdg:v1:d10:d10-pair:main_skill:true:over_authored_max+over_fatigue_cap` (2 cells): Needs human review before deciding whether this is policy allowance, cap review, block split, or source-backed content depth.
- `gpdg:v1:d22:d22-pair:main_skill:true:under_authored_min` (2 cells): Needs human review before deciding whether this is policy allowance, cap review, block split, or source-backed content depth.
- `gpdg:v1:d22:d22-solo:main_skill:true:under_authored_min` (2 cells): Needs human review before deciding whether this is policy allowance, cap review, block split, or source-backed content depth.
- `gpdg:v1:d38:d38-pair:main_skill:true:over_authored_max+over_fatigue_cap` (2 cells): Needs human review before deciding whether this is policy allowance, cap review, block split, or source-backed content depth.
- `gpdg:v1:d01:d01-pair:technique:true:over_authored_max+over_fatigue_cap` (1 cells): Needs human review before deciding whether this is policy allowance, cap review, block split, or source-backed content depth.
- `gpdg:v1:d11:d11-pair:pressure:false:over_authored_max+over_fatigue_cap` (1 cells): Needs human review before deciding whether this is policy allowance, cap review, block split, or source-backed content depth.


## Generator Policy Investigation

- `gpdg:v1:d47:d47-solo-open:main_skill:true:optional_slot_redistribution+over_authored_max+over_fatigue_cap` (30 cells): Redistribution evidence is present, so generator policy should be investigated before catalog changes.
- `gpdg:v1:d33:d33-solo-open:main_skill:true:optional_slot_redistribution+over_authored_max+over_fatigue_cap` (28 cells): Redistribution evidence is present, so generator policy should be investigated before catalog changes.
- `gpdg:v1:d33:d33-pair-open:main_skill:true:optional_slot_redistribution+over_authored_max+over_fatigue_cap` (24 cells): Redistribution evidence is present, so generator policy should be investigated before catalog changes.
- `gpdg:v1:d46:d46-solo-open:main_skill:true:optional_slot_redistribution+over_authored_max+over_fatigue_cap` (24 cells): Redistribution evidence is present, so generator policy should be investigated before catalog changes.
- `gpdg:v1:d01:d01-solo:main_skill:true:optional_slot_redistribution+over_authored_max+over_fatigue_cap` (18 cells): Redistribution evidence is present, so generator policy should be investigated before catalog changes.
- `gpdg:v1:d46:d46-pair-open:main_skill:true:optional_slot_redistribution+over_authored_max+over_fatigue_cap` (16 cells): Redistribution evidence is present, so generator policy should be investigated before catalog changes.
- `gpdg:v1:d47:d47-pair-open:main_skill:true:optional_slot_redistribution+over_authored_max+over_fatigue_cap` (16 cells): Redistribution evidence is present, so generator policy should be investigated before catalog changes.
- `gpdg:v1:d05:d05-solo:main_skill:true:optional_slot_redistribution+over_authored_max+over_fatigue_cap` (15 cells): Redistribution evidence is present, so generator policy should be investigated before catalog changes.
- `gpdg:v1:d31:d31-solo-open:main_skill:true:optional_slot_redistribution+over_authored_max+over_fatigue_cap` (14 cells): Redistribution evidence is present, so generator policy should be investigated before catalog changes.
- `gpdg:v1:d40:d40-solo:main_skill:true:optional_slot_redistribution+over_authored_max+over_fatigue_cap` (12 cells): Redistribution evidence is present, so generator policy should be investigated before catalog changes.
- `gpdg:v1:d22:d22-solo-open:main_skill:true:optional_slot_redistribution` (10 cells): Redistribution evidence is present, so generator policy should be investigated before catalog changes.
- `gpdg:v1:d22:d22-solo-open:main_skill:true:optional_slot_redistribution+over_authored_max+over_fatigue_cap` (10 cells): Redistribution evidence is present, so generator policy should be investigated before catalog changes.
- `gpdg:v1:d22:d22-pair-open:main_skill:true:optional_slot_redistribution` (6 cells): Redistribution evidence is present, so generator policy should be investigated before catalog changes.
- `gpdg:v1:d22:d22-pair-open:main_skill:true:optional_slot_redistribution+over_authored_max+over_fatigue_cap` (6 cells): Redistribution evidence is present, so generator policy should be investigated before catalog changes.
- `gpdg:v1:d31:d31-pair-open:main_skill:true:optional_slot_redistribution+over_authored_max+over_fatigue_cap` (6 cells): Redistribution evidence is present, so generator policy should be investigated before catalog changes.
- `gpdg:v1:d33:d33-solo-net:main_skill:true:optional_slot_redistribution+over_authored_max+over_fatigue_cap` (6 cells): Redistribution evidence is present, so generator policy should be investigated before catalog changes.
- `gpdg:v1:d22:d22-pair:main_skill:true:optional_slot_redistribution` (2 cells): Redistribution evidence is present, so generator policy should be investigated before catalog changes.
- `gpdg:v1:d22:d22-pair:main_skill:true:optional_slot_redistribution+over_authored_max+over_fatigue_cap` (2 cells): Redistribution evidence is present, so generator policy should be investigated before catalog changes.
- `gpdg:v1:d22:d22-solo:main_skill:true:optional_slot_redistribution` (2 cells): Redistribution evidence is present, so generator policy should be investigated before catalog changes.
- `gpdg:v1:d22:d22-solo:main_skill:true:optional_slot_redistribution+over_authored_max+over_fatigue_cap` (2 cells): Redistribution evidence is present, so generator policy should be investigated before catalog changes.
- `gpdg:v1:d31:d31-pair:main_skill:true:optional_slot_redistribution+over_authored_max+over_fatigue_cap` (2 cells): Redistribution evidence is present, so generator policy should be investigated before catalog changes.


## Top Affected Groups

- `gpdg:v1:d25:d25-solo:wrap:true:under_authored_min` (87 cells, route: `defer`)
- `gpdg:v1:d47:d47-solo-open:main_skill:true:optional_slot_redistribution+over_authored_max+over_fatigue_cap` (30 cells, route: `generator_policy_investigation`)
- `gpdg:v1:d33:d33-solo-open:main_skill:true:optional_slot_redistribution+over_authored_max+over_fatigue_cap` (28 cells, route: `generator_policy_investigation`)
- `gpdg:v1:d33:d33-pair-open:main_skill:true:optional_slot_redistribution+over_authored_max+over_fatigue_cap` (24 cells, route: `generator_policy_investigation`)
- `gpdg:v1:d46:d46-solo-open:main_skill:true:optional_slot_redistribution+over_authored_max+over_fatigue_cap` (24 cells, route: `generator_policy_investigation`)
- `gpdg:v1:d01:d01-solo:main_skill:true:optional_slot_redistribution+over_authored_max+over_fatigue_cap` (18 cells, route: `generator_policy_investigation`)
- `gpdg:v1:d07:d07-solo-open:technique:true:under_authored_min` (18 cells, route: `defer`)
- `gpdg:v1:d33:d33-solo-open:technique:true:under_authored_min` (16 cells, route: `defer`)
- `gpdg:v1:d46:d46-pair-open:main_skill:true:optional_slot_redistribution+over_authored_max+over_fatigue_cap` (16 cells, route: `generator_policy_investigation`)
- `gpdg:v1:d47:d47-pair-open:main_skill:true:optional_slot_redistribution+over_authored_max+over_fatigue_cap` (16 cells, route: `generator_policy_investigation`)
- `gpdg:v1:d05:d05-solo:main_skill:true:optional_slot_redistribution+over_authored_max+over_fatigue_cap` (15 cells, route: `generator_policy_investigation`)
- `gpdg:v1:d31:d31-solo-open:main_skill:true:optional_slot_redistribution+over_authored_max+over_fatigue_cap` (14 cells, route: `generator_policy_investigation`)
- `gpdg:v1:d33:d33-solo-open:main_skill:true:under_authored_min` (14 cells, route: `defer`)
- `gpdg:v1:d01:d01-solo:technique:true:over_authored_max+over_fatigue_cap` (12 cells, route: `defer`)
- `gpdg:v1:d22:d22-solo-open:technique:true:under_authored_min` (12 cells, route: `defer`)
- `gpdg:v1:d33:d33-pair-open:main_skill:true:under_authored_min` (12 cells, route: `defer`)
- `gpdg:v1:d38:d38-solo:technique:true:under_authored_min` (12 cells, route: `defer`)
- `gpdg:v1:d39:d39-solo:technique:true:under_authored_min` (12 cells, route: `defer`)
- `gpdg:v1:d40:d40-solo:main_skill:true:optional_slot_redistribution+over_authored_max+over_fatigue_cap` (12 cells, route: `generator_policy_investigation`)
- `gpdg:v1:d48:d48-solo-open:technique:true:under_authored_min` (12 cells, route: `defer`)
- `gpdg:v1:d05:d05-pair:main_skill:true:over_authored_max+over_fatigue_cap` (10 cells, route: `defer`)
- `gpdg:v1:d22:d22-solo-open:main_skill:true:under_authored_min` (10 cells, route: `defer`)
- `gpdg:v1:d22:d22-solo-open:main_skill:true:optional_slot_redistribution` (10 cells, route: `generator_policy_investigation`)
- `gpdg:v1:d22:d22-solo-open:main_skill:true:optional_slot_redistribution+over_authored_max+over_fatigue_cap` (10 cells, route: `generator_policy_investigation`)
- `gpdg:v1:d33:d33-pair-open:technique:true:under_authored_min` (9 cells, route: `defer`)
- `gpdg:v1:d01:d01-pair:pressure:false:over_authored_max+over_fatigue_cap` (8 cells, route: `defer`)
- `gpdg:v1:d07:d07-pair-open:technique:true:under_authored_min` (8 cells, route: `defer`)
- `gpdg:v1:d22:d22-pair-open:technique:true:under_authored_min` (8 cells, route: `defer`)
- `gpdg:v1:d48:d48-pair-open:technique:true:under_authored_min` (8 cells, route: `defer`)
- `gpdg:v1:d01:d01-solo:movement_proxy:false:over_authored_max+over_fatigue_cap` (6 cells, route: `defer`)
- `gpdg:v1:d11:d11-solo:main_skill:true:over_authored_max+over_fatigue_cap` (6 cells, route: `defer`)
- `gpdg:v1:d22:d22-pair-open:main_skill:true:under_authored_min` (6 cells, route: `defer`)
- `gpdg:v1:d22:d22-pair-open:main_skill:true:optional_slot_redistribution` (6 cells, route: `generator_policy_investigation`)
- `gpdg:v1:d22:d22-pair-open:main_skill:true:optional_slot_redistribution+over_authored_max+over_fatigue_cap` (6 cells, route: `generator_policy_investigation`)
- `gpdg:v1:d31:d31-pair-open:main_skill:true:optional_slot_redistribution+over_authored_max+over_fatigue_cap` (6 cells, route: `generator_policy_investigation`)
- `gpdg:v1:d33:d33-solo-net:main_skill:true:optional_slot_redistribution+over_authored_max+over_fatigue_cap` (6 cells, route: `generator_policy_investigation`)
- `gpdg:v1:d01:d01-pair:main_skill:true:over_authored_max+over_fatigue_cap` (4 cells, route: `defer`)
- `gpdg:v1:d01:d01-solo:pressure:false:over_authored_max+over_fatigue_cap` (3 cells, route: `defer`)
- `gpdg:v1:d33:d33-pair:technique:true:under_authored_min` (3 cells, route: `defer`)
- `gpdg:v1:d33:d33-solo-net:technique:true:under_authored_min` (3 cells, route: `defer`)
- `gpdg:v1:d33:d33-solo-net:main_skill:true:under_authored_min` (3 cells, route: `defer`)
- `gpdg:v1:d03:d03-pair:main_skill:true:over_authored_max+over_fatigue_cap` (2 cells, route: `defer`)
- `gpdg:v1:d10:d10-pair:main_skill:true:over_authored_max+over_fatigue_cap` (2 cells, route: `defer`)
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
    "diagnosticFingerprint": "gpdf|v1|4|none|none|87|block_split+policy_allowance+source_backed_content_depth+variant_cap_review|pass/pair_net/advanced/15/matrix-b/block-3/3/3/under_authored_min|pass/pair_net/advanced/15/matrix-c/block-3/3/3/under_authored_min|pass/pair_net/advanced/15/matrix-d/block-3/3/3/under_authored_min",
    "triageStatus": "observed",
    "route": "defer",
    "enforcementStatus": "observation_only",
    "rationale": "Needs human review before deciding whether this is policy allowance, cap review, block split, or source-backed content depth.",
    "owner": "agent",
    "reviewedReportId": "generated-plan-diagnostics-report-2026-05-01",
    "affectedCellCount": 87,
    "likelyFixPaths": [
      "policy_allowance",
      "block_split",
      "variant_cap_review",
      "source_backed_content_depth"
    ],
    "evidence": []
  },
  {
    "groupKey": "gpdg:v1:d47:d47-solo-open:main_skill:true:optional_slot_redistribution+over_authored_max+over_fatigue_cap",
    "diagnosticFingerprint": "gpdf|v1|none|9|9|30|block_split+generator_policy_investigation+policy_allowance+source_backed_content_depth+variant_cap_review|set/solo_net/advanced/25/matrix-a/block-2/12/7/optional_slot_redistribution+over_authored_max+over_fatigue_cap|set/solo_net/advanced/25/matrix-b/block-2/12/7/optional_slot_redistribution+over_authored_max+over_fatigue_cap|set/solo_net/advanced/25/matrix-c/block-2/12/7/optional_slot_redistribution+over_authored_max+over_fatigue_cap",
    "triageStatus": "routed",
    "route": "generator_policy_investigation",
    "enforcementStatus": "observation_only",
    "rationale": "Redistribution evidence is present, so generator policy should be investigated before catalog changes.",
    "owner": "agent",
    "reviewedReportId": "generated-plan-diagnostics-report-2026-05-01",
    "affectedCellCount": 30,
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
    "groupKey": "gpdg:v1:d01:d01-solo:main_skill:true:optional_slot_redistribution+over_authored_max+over_fatigue_cap",
    "diagnosticFingerprint": "gpdf|v1|none|5|5|18|block_split+generator_policy_investigation+policy_allowance+source_backed_content_depth+variant_cap_review|pass/solo_net/beginner/25/matrix-a/block-2/12/7/optional_slot_redistribution+over_authored_max+over_fatigue_cap|pass/solo_net/beginner/25/matrix-c/block-2/12/7/optional_slot_redistribution+over_authored_max+over_fatigue_cap|pass/solo_net/beginner/40/matrix-a/block-2/23/10/optional_slot_redistribution+over_authored_max+over_fatigue_cap",
    "triageStatus": "routed",
    "route": "generator_policy_investigation",
    "enforcementStatus": "observation_only",
    "rationale": "Redistribution evidence is present, so generator policy should be investigated before catalog changes.",
    "owner": "agent",
    "reviewedReportId": "generated-plan-diagnostics-report-2026-05-01",
    "affectedCellCount": 18,
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
    "groupKey": "gpdg:v1:d47:d47-pair-open:main_skill:true:optional_slot_redistribution+over_authored_max+over_fatigue_cap",
    "diagnosticFingerprint": "gpdf|v1|none|9|9|16|block_split+generator_policy_investigation+policy_allowance+source_backed_content_depth+variant_cap_review|set/pair_net/advanced/25/matrix-a/block-2/12/7/optional_slot_redistribution+over_authored_max+over_fatigue_cap|set/pair_net/advanced/25/matrix-b/block-2/12/7/optional_slot_redistribution+over_authored_max+over_fatigue_cap|set/pair_net/advanced/25/matrix-c/block-2/12/7/optional_slot_redistribution+over_authored_max+over_fatigue_cap",
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
    "groupKey": "gpdg:v1:d01:d01-solo:movement_proxy:false:over_authored_max+over_fatigue_cap",
    "diagnosticFingerprint": "gpdf|v1|none|5|5|6|block_split+policy_allowance+source_backed_content_depth+variant_cap_review|pass/solo_net/intermediate/40/matrix-b/block-2/6/6/over_authored_max+over_fatigue_cap|pass/solo_net/intermediate/40/matrix-c/block-2/6/6/over_authored_max+over_fatigue_cap|pass/solo_open/intermediate/40/matrix-b/block-2/6/6/over_authored_max+over_fatigue_cap",
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
    "groupKey": "gpdg:v1:d01:d01-pair:main_skill:true:over_authored_max+over_fatigue_cap",
    "diagnosticFingerprint": "gpdf|v1|none|6|6|4|block_split+policy_allowance+source_backed_content_depth+variant_cap_review|pass/pair_net/beginner/25/matrix-c/block-3/7/7/over_authored_max+over_fatigue_cap|pass/pair_net/beginner/40/matrix-c/block-3/10/10/over_authored_max+over_fatigue_cap|pass/pair_open/beginner/25/matrix-c/block-3/7/7/over_authored_max+over_fatigue_cap",
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
    "groupKey": "gpdg:v1:d10:d10-pair:main_skill:true:over_authored_max+over_fatigue_cap",
    "diagnosticFingerprint": "gpdf|v1|none|8|8|2|block_split+policy_allowance+source_backed_content_depth+variant_cap_review|pass/pair_net/intermediate/40/matrix-a/block-3/10/10/over_authored_max+over_fatigue_cap|pass/pair_open/intermediate/40/matrix-a/block-3/9/9/over_authored_max+over_fatigue_cap",
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
