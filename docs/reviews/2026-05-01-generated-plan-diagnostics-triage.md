---
id: generated-plan-diagnostics-triage-2026-05-01
title: "Generated Plan Diagnostics Triage"
status: active
stage: validation
type: review
summary: "Docs-first triage workbench and decision-debt compression review for generated-plan routeable observation groups."
authority: "Current triage snapshot for generated-plan diagnostic observation groups; validates stable group identity, conservative routes, stale fingerprint review, and derived decision-debt compression lanes."
last_updated: 2026-05-04
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
  - docs/plans/2026-05-03-001-feat-d49-next-work-selection-plan.md
  - docs/plans/2026-05-03-003-feat-d49-scoped-u8-generator-policy-follow-up-plan.md
  - docs/plans/2026-05-07-004-feat-d49-generator-policy-proposal-plan.md
  - docs/plans/2026-05-04-001-feat-d46-pair-open-source-backed-gap-card-plan.md
  - docs/plans/2026-05-04-002-feat-d46-pair-open-no-change-comparator-decision-packet-plan.md
  - docs/reviews/2026-05-04-d46-pair-open-source-backed-gap-card.md
  - docs/reviews/2026-05-04-d46-pair-open-no-change-comparator-decision-packet.md
  - docs/brainstorms/2026-05-04-d50-advanced-passing-depth-requirements.md
  - docs/plans/2026-05-04-003-feat-d50-advanced-passing-depth-plan.md
  - docs/brainstorms/2026-05-04-d51-beginner-serving-tactical-zone-depth-requirements.md
  - docs/plans/2026-05-04-004-feat-d51-beginner-serving-tactical-zone-depth-plan.md
  - docs/solutions/2026-05-04-source-backed-content-depth-activation-pattern.md
---

# Generated Plan Diagnostics Triage

## Purpose

Record the current docs-first triage workbench for generated-plan routeable observation groups. This file is fully generated and validated by `npm run diagnostics:report:check`.

## Interpretation

This workbench does not authorize catalog changes. It routes generated-plan observations into conservative decision lanes and compresses unresolved rows into derived human review prompts so maintainers can decide whether a group is a policy allowance, cap review, block split, source-backed content-depth item, or generator-policy investigation.

## Triage Summary

- Current routeable groups: 50
- Registry entries: 50
- Blocking validation issues: 0
- Warning validation issues: 0

## Route Counts

- `defer`: 49
- `generator_policy_investigation`: 1

## Decision-Debt Compression

### Short-session cooldown minimum

- Lane: `short_session_cooldown_minimum`
- Question: Is the short wrap envelope acceptable, or does this need cap/block/content follow-up?
- Why this lane: Wrap under-min groups are likely cooldown policy questions before they are catalog gaps.
- Groups: 1; total affected cells: 65
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
- Groups: 35; total affected cells: 213
- Redistribution-affected cells: 0
- Non-redistribution over-cap cells: 109
- Route mix: `defer` 35
- Disposition: `needs_human_decision`
- Candidate dispositions: `metadata_review_needed`, `block_shape_review_needed`, `requires_U6_preview`, `no_implementation_action_yet`
- Recommended follow-up: U7 workload envelope guidance
- Guide: `docs/ops/workload-envelope-authoring-guide.md#workload-envelope-review`
- Next evidence needed: Review cap policy and block split thresholds for the affected main-skill groups.
- Group keys: `gpdg:v1:d51:d51-solo-open:main_skill:true:under_authored_min`, `gpdg:v1:d01:d01-pair:pressure:false:over_authored_max+over_fatigue_cap`, `gpdg:v1:d01:d01-solo:movement_proxy:false:over_authored_max+over_fatigue_cap`, `gpdg:v1:d01:d01-solo:main_skill:true:over_authored_max+over_fatigue_cap`, `gpdg:v1:d01:d01-solo:technique:true:over_authored_max+over_fatigue_cap`, `gpdg:v1:d01:d01-solo:pressure:false:over_authored_max+over_fatigue_cap`, `gpdg:v1:d05:d05-pair:main_skill:true:over_authored_max+over_fatigue_cap`, `gpdg:v1:d33:d33-solo-open:main_skill:true:under_authored_min`, `gpdg:v1:d51:d51-pair-open:main_skill:true:under_authored_min`, `gpdg:v1:d05:d05-solo:main_skill:true:over_authored_max+over_fatigue_cap`, `gpdg:v1:d22:d22-solo-open:main_skill:true:under_authored_min`, `gpdg:v1:d49:d49-solo-open:main_skill:true:under_authored_min`, `gpdg:v1:d50:d50-solo-open:main_skill:true:under_authored_min`, `gpdg:v1:d11:d11-solo:main_skill:true:over_authored_max+over_fatigue_cap`, `gpdg:v1:d33:d33-pair-open:main_skill:true:under_authored_min`, `gpdg:v1:d47:d47-solo-open:main_skill:true:over_authored_max+over_fatigue_cap`, `gpdg:v1:d22:d22-pair-open:main_skill:true:under_authored_min`, `gpdg:v1:d33:d33-solo-open:movement_proxy:false:under_authored_min`, `gpdg:v1:d10:d10-pair:main_skill:true:over_authored_max+over_fatigue_cap`, `gpdg:v1:d33:d33-pair-open:movement_proxy:false:under_authored_min`, `gpdg:v1:d49:d49-pair-open:main_skill:true:under_authored_min`, `gpdg:v1:d50:d50-pair-open:main_skill:true:under_authored_min`, `gpdg:v1:d07:d07-solo-open:main_skill:true:over_authored_max+over_fatigue_cap`, `gpdg:v1:d03:d03-pair:main_skill:true:over_authored_max+over_fatigue_cap`, `gpdg:v1:d11:d11-pair:pressure:false:over_authored_max+over_fatigue_cap`, `gpdg:v1:d22:d22-pair:main_skill:true:under_authored_min`, `gpdg:v1:d22:d22-solo-open:movement_proxy:false:under_authored_min`, `gpdg:v1:d33:d33-pair:main_skill:true:under_authored_min`, `gpdg:v1:d38:d38-pair:main_skill:true:over_authored_max+over_fatigue_cap`, `gpdg:v1:d01:d01-pair:technique:true:over_authored_max+over_fatigue_cap`, `gpdg:v1:d22:d22-pair:movement_proxy:false:under_authored_min`, `gpdg:v1:d22:d22-solo:movement_proxy:false:under_authored_min`, `gpdg:v1:d22:d22-solo:main_skill:true:under_authored_min`, `gpdg:v1:d33:d33-solo-net:movement_proxy:false:under_authored_min`, `gpdg:v1:d33:d33-solo-net:main_skill:true:under_authored_min`

### Coverage gap review

- Lane: `coverage_gap_review`
- Question: Are the dropped optional slots / sub-profile session totals a coverage gap or an acceptable honest-duration outcome?
- Why this lane: Optional slots that drop past the U2 fallback and sessions that run shorter than their named profile signal a catalog-depth question — not a generator-policy fix anymore.
- Groups: 2; total affected cells: 255
- Redistribution-affected cells: 48
- Non-redistribution over-cap cells: 0
- Route mix: `generator_policy_investigation` 1, `defer` 1
- Disposition: `needs_human_decision`
- Candidate dispositions: `source_depth_candidate`, `accepted_policy_allowance`
- Recommended follow-up: Coverage brainstorm
- Next evidence needed: Decide per dropped slot or under-profile session whether to author new focus-aligned content (coverage gap) or accept the shorter session (honest-duration outcome).
- Group keys: `gpdg:v1:none:none:none:none:under_named_profile_duration`, `gpdg:v1:none:none:movement_proxy:false:slot_dropped`


## Redistribution Causality Receipt

- Comparison mode: `allocated_duration_counterfactual`
- Runtime boundary: Diagnostic-only counterfactual receipt; shipped buildDraft() behavior may include separately authorized fills such as the D01 block-shape fill.
- Groups: 2; total affected cells: 255
- Redistribution-affected cells: 48
- Current pressure cells: over authored max 0, over fatigue cap 0, under authored min 0
- Allocated-duration pressure cells: over authored max 0, over fatigue cap 0, under authored min 0
- Non-redistribution pressure cells: over cap 0, under authored min 0
- Pressure disappears under allocated-duration counterfactual: 0
- Pressure remains without redistribution: 0
- Comparison inconclusive cells: 255
- Redistribution without cap/min pressure cells: 0
- Counterfactual unfilled minutes across affected cells: 0

### Redistribution Causality Groups

- `gpdg:v1:none:none:none:none:under_named_profile_duration`: action `comparison_inconclusive`, dominant `comparison_inconclusive`, incomplete evidence yes, pressure disappears 0, pressure remains 0, non-redistribution pressure 0, inconclusive 207, follow-up `comparison_support_needed`
- `gpdg:v1:none:none:movement_proxy:false:slot_dropped`: action `comparison_inconclusive`, dominant `comparison_inconclusive`, incomplete evidence yes, pressure disappears 0, pressure remains 0, non-redistribution pressure 0, inconclusive 48, follow-up `comparison_support_needed`

## D47 Proposal Admission Ticket

- Candidate: `gpdg:v1:d47:d47-solo-open:main_skill:true:slot_dropped+over_authored_max+over_fatigue_cap`
- Admission state: `evidence_gathering`
- Candidate group is not present in the current redistribution causality receipt.

## D47 Gap Closure Ledger

- Ledger source: D47 proposal-admission ticket plus U8 redistribution causality receipt.
- Candidate: `gpdg:v1:d47:d47-solo-open:main_skill:true:slot_dropped+over_authored_max+over_fatigue_cap`
- Currentness: `missing_or_shifted`
- Gap type: `undetermined`
- Decision state: `evidence_gathering`
- Authorization status: `not_authorized`
- Suspected training gap: D47 may be carrying too much advanced setting and movement work inside one main-skill block, but the current evidence must be compared against a simpler candidate before D47 becomes the fill target.
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

- Pressure disappears under counterfactual: cells 0, gap `generator_policy_artifact`, decision `evidence_gathering`, authorization `not_authorized`; Counterfactual-only pressure needs a generator-policy hypothesis before it can drive fill work.
- Pressure remains without redistribution: cells 0, gap `undetermined`, decision `evidence_gathering`, authorization `not_authorized`; Remaining pressure may be workload metadata, block shape, or content-depth pressure; compare before selecting D47.
- Non-redistribution pressure: cells 0, gap `undetermined`, decision `evidence_gathering`, authorization `not_authorized`; Non-redistribution pressure is the strongest reason to compare D47 against a simpler candidate first.

### Next Artifact

- Artifact: `comparator_receipt`
- Owner: `maintainer`
- Evidence source: Current U8 redistribution causality receipt and D47 admission ticket.
- Promotion criteria: Promote D47 only if it names stronger causal warrant, product impact, and a smaller fill artifact than the comparator.
- Abandon criteria: Abandon D47 if the comparator presents a simpler or higher-confidence path to a concrete gap fill.
- No-change criteria: Close without fill only when every segment has evidence, a no-action threshold, and a revisit trigger.
- No-change burden: No-change closure requires dispositions for pressure-disappears, pressure-remains, and non-redistribution pressure segments.
- Reassessment result: `not_started`
- Reassessment boundary: This slice records expected movement only; actual diagnostic and training-quality reassessment waits for a future fill.

## D01 Gap-Fill Proposal

- Proposal source: D47 gap closure comparator receipt for `d01` / `d01-solo`.
- Candidate: `gpdg:v1:d01:d01-solo:main_skill:true:slot_dropped+over_authored_max+over_fatigue_cap`
- Currentness: `missing_or_shifted`
- D47 relationship: `d47_missing_or_shifted`
- Gap type: `programming_shape_gap`
- Decision state: `evidence_gathering`
- Authorization status: `not_authorized`
- Suspected training gap: D01 may be a short beginner passing drill being asked to occupy too much main-skill time; the first fill proposal should decide whether to widen workload metadata, split/repeat the block shape, or accept the pressure by policy.
- Target surface: `d01-solo` workload envelope (`durationMaxMinutes: 5`, `fatigueCap.maxMinutes: 5`) and generated main-skill block shape.
- Primary closure path: `combined_workload_block_shape_review`
- Receipt facts: total affected cells 0, pressure disappears 0, pressure remains 0, non-redistribution pressure 0, inconclusive 0
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
- Candidate: `gpdg:v1:d01:d01-solo:main_skill:true:slot_dropped+over_authored_max+over_fatigue_cap`
- Currentness: `missing_or_shifted`
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
- Target group: `gpdg:v1:d01:d01-solo:main_skill:true:slot_dropped+over_authored_max+over_fatigue_cap`
- Target found: no
- Diagnostic movement: `validated`
- Training-quality state: `not_field_validated`
- Redistribution handoff state: `not_needed_target_absent`
- Redistribution handoff reason: The D01 target group is absent, so no redistribution handoff is needed for this target.
- D47 next state: `resume_d47`
- Applied fill: Duration-aware D01 main-skill reroute: avoid stretching `d01-solo` beyond its authored max/fatigue cap when an eligible same-slot candidate can carry more of the block.
- Metadata action: `unchanged`
- Source-backed content disposition: `source_depth_blocked`
- U6 eligibility: `deferred_no_cap_or_catalog_delta`
- Baseline receipt: total affected cells 18, pressure disappears 0, pressure remains 18, non-redistribution pressure 6, inconclusive 0
- Current receipt: total affected cells 0, pressure disappears 0, pressure remains 0, non-redistribution pressure 0, inconclusive 0
- Diagnostic summary: The prior D01 target group is absent from current generated diagnostics.
- Training-quality boundary: Generated diagnostics can validate workload-envelope movement, but field training quality remains unvalidated until a manual courtside dogfood receipt exists.
- Remaining action: Keep D01 metadata unchanged and move to manual training-quality dogfood only if courtside feel still looks suspect.

## D01 Cap/Catalog Fork Packet

- Packet source: D01 block-shape fill receipt plus cap/catalog fork requirements.
- Target group: `gpdg:v1:d01:d01-solo:main_skill:true:slot_dropped+over_authored_max+over_fatigue_cap`
- Target found: no
- Currentness: `missing_or_shifted`
- Selection state: `not_applicable_resume`
- Selected fork: `none`
- Selected-fork reason: D01 target is absent or already validated, so no cap/catalog fork is needed before D47 resumes.
- Parent D47 state: `resume_d47`
- Planning authorization status: `not_ready_for_catalog_fill_planning`
- Activation status: `not_authorized`
- Expected diagnostic movement: No D01 cap/catalog diagnostic movement is expected because the target is absent.
- Falsification threshold: Reopen only if the D01 target group reappears in current diagnostics.
- Next artifact: `resume_d47`
- Rejected forks: None.

## Gap Closure Selection

- Selection source: D01 cap/catalog fork packet plus D47 gap closure ledger.
- Selection state: `hold_for_evidence`
- Selected target: `none`
- Selected artifact: `hold_for_evidence`
- Selected reason: Current D01/D47 evidence does not support D47 reentry selection; hold until diagnostics produce a current D01-held and D47-current state.
- Authorization status: `not_authorized`
- D01 state: `not_applicable_resume:none:resume_d47`
- D47 state: `missing_or_shifted:evidence_gathering:not_authorized`
- Next artifact: refresh_or_review_gap_closure_evidence
- Stop condition: Do not plan catalog, workload, block-shape, U6, or generator edits from stale or inapplicable selection evidence.

### Rejected Alternatives

- D25 cooldown policy receipt (`gpdg:v1:d25:d25-solo:wrap:true:under_authored_min`, 65 cells): Largest affected count, but wrap under-min pressure routes to cooldown policy review before catalog work. Re-entry trigger: Promote when the next product question is accepting or revising short-session Downshift policy.
- D05 comparator proposal: No current D05 comparator evidence is available in the generated observations. Re-entry trigger: Promote if D47 cannot name a concrete delta or if comparator evidence becomes the smaller artifact.
- Adjacent advanced mixed-pressure group: Relevant advanced-depth signal, but less directly tied to the current D01-held / D47-reentry fork. Re-entry trigger: Promote after D47 reentry closes, holds, or rejects its concrete-delta path.

## D49 Residual Follow-Up

- Packet source: D47 closed-by-D49 gap closure ledger plus current D49 generated diagnostics.
- D47 resolution state: `closed_by_d49`
- Packet authorization status: `not_authorized`
- D49 cap authorization: `not_authorized`
- D49 catalog authorization: `not_authorized`
- D49 runtime redistribution authorization: `not_authorized`
- D47 reopen authorization: `not_authorized`
- Selected next work: `workload_metadata_review`
- Selected next-work rationale: D49 has workload-envelope evidence but no pressure-bearing redistribution evidence, so workload metadata and block allocation should be reviewed before cap changes.
- Selected next-work owner: `maintainer`
- Selected next-work revisit trigger: Revisit when a concrete D49 workload proposal names the metadata or block-shape delta and expected diagnostic movement.
- Product/session-quality verdict: generated_review_needed: before accepting residual debt or promoting D49 metadata/block-shape work, inspect generated D49-affected sessions for interval/rest honesty, set-quality protection, and capture-surface fit.
- Activation boundary: D49 remains bounded to the authorized solo/pair open advanced setting/movement family: one ball, markers, no 3+ player source forms, and no generic conditioning expansion. This packet does not widen D49 caps, add content, or change D47/D05.
- Training-quality boundary: Generated diagnostics can route workload and redistribution questions, but D49 training quality still needs manual courtside validation before broader claims.
- Next artifact: D49 workload envelope review; no metadata change without a concrete proposal.
- Stop condition: Do not edit catalog metadata, add catalog content, change runtime redistribution, or reopen D47 from this packet alone.
- D47 re-entry condition: Re-enter D47 only if regenerated diagnostics recreate the original D47 comparator key.

### D49 workload envelope review

- Disposition: `workload_review_needed`
- Total affected cells: 12
- Evidence summary: D49 under-min main-skill groups should be reviewed against block allocation, copy, and workload metadata before any cap or catalog proposal.
- Next artifact: D49 workload envelope review; no metadata change without a concrete proposal.
- Group keys: `gpdg:v1:d49:d49-solo-open:main_skill:true:under_authored_min`, `gpdg:v1:d49:d49-pair-open:main_skill:true:under_authored_min`

### D49 redistribution investigation

- Disposition: `no_implementation_action_yet`
- Total affected cells: 0
- Evidence summary: No pressure-bearing D49 optional-slot redistribution groups are present in the redistribution causality receipt.
- Next artifact: No D49 U8 action until regenerated diagnostics show pressure-bearing redistribution evidence.
- Group keys: none

### D49 optional-slot-only redistribution

- Disposition: `no_implementation_action_yet`
- Total affected cells: 0
- Evidence summary: No D49 optional-slot-only redistribution groups are present in the redistribution causality receipt.
- Next artifact: No optional-slot-only D49 action.
- Group keys: none

## D49 U8 Generator-Policy Proof

- Packet source: D49 residual route_to_u8 selection plus redistribution causality receipt.
- Proof outcome: `no_action`
- Evidence type: `allocated_duration_counterfactual`
- Total affected cells: 0
- Pressure disappears cells: 0
- Pressure remains cells: 0
- Redistribution-only cells: 0
- Comparison inconclusive cells: 0
- Counterfactual unfilled minutes: 0
- Runtime redistribution authorization: `not_authorized`
- Catalog authorization: `not_authorized`
- D49 cap authorization: `not_authorized`
- Source-depth authorization: `not_authorized`
- D47 reopen authorization: `not_authorized`
- Proof summary: No current pressure-bearing D49 optional-slot redistribution evidence is available for U8 proof.
- Workload caveat: D49 under-min workload evidence remains visible as workload review evidence and does not authorize cap, catalog, source-depth, or runtime redistribution changes from this U8 proof.
- Next artifact: No D49 generator-policy proposal until current pressure-bearing D49 evidence returns.
- Stop condition: This is diagnostic-only U8 evidence. Do not change runtime redistribution, catalog content, D49 caps, source-depth surfaces, or D47 reopening from this packet alone.
- Proof group keys: none
- Excluded optional-only group keys: none

## D49 Generator-Policy Proposal Packet

- Packet source: D49 U8 generator-policy proof packet plus 2026-05-07 D140 decision row.
- Proposal outcome: `no_action_yet`
- Scope: `d49_only`
- Proposed direction: `unspecified`
- Proposed direction rationale: Cap optional-slot redistribution at the carrier drill's authored max minutes and fatigue cap; let unfilled minutes remain unfilled. The U8 proof's allocated-duration counterfactual already established that over-cap pressure disappears when redistribution stops at the carrier max — this is the smallest runtime change consistent with honest workload metadata.
- Falsification threshold: Reopen the proposal if regenerated diagnostics show 5 over-cap or more cells in D49 main_skill groups after a future implementation lands; reopen if courtside dogfood reports D49 sessions feel materially anemic with the new policy.
- Revisit trigger: Revisit after a non-D49 redistribution group's U8 proof selects a different direction; revisit after 4 weeks of courtside dogfood with the new policy applied; revisit if regenerated diagnostics show D49 pressure-bearing redistribution evidence has moved off ready_for_generator_policy_proposal.
- Stop condition: This is a proposal packet, not an implementation authorization. Do not change runtime redistribution, catalog content, D49 caps, source-depth surfaces, or D47 reopening from this packet alone. Generalization to non-D49 groups is also out of scope; each non-D49 group requires its own U8 proof first.
- Runtime redistribution authorization: `not_authorized`
- Catalog authorization: `not_authorized`
- D49 cap authorization: `not_authorized`
- Source-depth authorization: `not_authorized`
- D47 reopen authorization: `not_authorized`
- Next artifact: No D49 generator-policy proposal until the U8 proof returns ready_for_generator_policy_proposal.
- Proof group keys: none
- Rejected alternative `status_quo_with_policy_allowance`: Accept current optional-slot redistribution and record D49 over-cap pressure as policy-allowance without runtime change. Rejected because: Authored max and fatigue cap are honest workload metadata; silently accepting violations turns the metadata into a polite fiction.
- Rejected alternative `preferential_in_band_reroute`: Reroute redistribution onto a different focus-eligible in-band drill instead of the carrier when one is available. Rejected because: Plausible but adds engine complexity and depends on per-cell candidate availability; defer until current direction is falsified.
- Rejected alternative `early_block_truncation`: Truncate the main-skill block before optional-slot minutes are scheduled so the block never overruns. Rejected because: Changes session shape further than necessary; the current direction lets the block keep its shape and only refuses surplus.

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
- Selection state: `hold_for_evidence`
- Selected outcome: `hold_both_for_evidence`
- Authorization status: `not_authorized`
- D01 state: `not_applicable_resume:none:resume_d47`
- D47 state: `missing_or_shifted:evidence_gathering:not_authorized`
- D05 state: `missing_or_shifted:0:0`
- D47 facts: total affected cells 0, pressure disappears 0, pressure remains 0, non-redistribution pressure 0, inconclusive 0
- D05 facts: total affected cells 0, pressure disappears 0, pressure remains 0, non-redistribution pressure 0, inconclusive 0
- D47 session problem: Generated sessions may overuse a 5-9 minute advanced setting/movement surface when the training need may require either a deeper source-backed sibling, workload/block-shape work, or no change.
- D05 session problem: Generated sessions may stretch a short solo passing drill beyond its honest workload instead of choosing a clearer workload, block-shape, source-backed, generator-policy, or no-change proposal.
- Tie-break summary: D01 is not visibly held behind D47 reentry, so the comparator must hold before choosing D47 or D05.
- Next artifact: D47-vs-D05 comparator evaluation payload
- Stop condition: Do not edit catalog, workload metadata, block shape, generator policy, U6 preview, runtime generation, or app surfaces from this comparator packet.
- Held exhibit: `docs/reviews/2026-05-02-d47-source-backed-gap-card.md` remains conditional evidence, not authorization.

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

- `gpdg:v1:none:none:none:none:under_named_profile_duration` (207 cells): Needs human review before deciding whether this is policy allowance, cap review, block split, or source-backed content depth.
- `gpdg:v1:d25:d25-solo:wrap:true:under_authored_min` (65 cells): Needs human review before deciding whether this is policy allowance, cap review, block split, or source-backed content depth.
- `gpdg:v1:d51:d51-solo-open:main_skill:true:under_authored_min` (21 cells): Needs human review before deciding whether this is policy allowance, cap review, block split, or source-backed content depth.
- `gpdg:v1:d07:d07-solo-open:technique:true:under_authored_min` (18 cells): Needs human review before deciding whether this is policy allowance, cap review, block split, or source-backed content depth.
- `gpdg:v1:d33:d33-solo-open:technique:true:under_authored_min` (16 cells): Needs human review before deciding whether this is policy allowance, cap review, block split, or source-backed content depth.
- `gpdg:v1:d01:d01-pair:pressure:false:over_authored_max+over_fatigue_cap` (15 cells): Needs human review before deciding whether this is policy allowance, cap review, block split, or source-backed content depth.
- `gpdg:v1:d01:d01-solo:movement_proxy:false:over_authored_max+over_fatigue_cap` (13 cells): Needs human review before deciding whether this is policy allowance, cap review, block split, or source-backed content depth.
- `gpdg:v1:d01:d01-solo:main_skill:true:over_authored_max+over_fatigue_cap` (12 cells): Needs human review before deciding whether this is policy allowance, cap review, block split, or source-backed content depth.
- `gpdg:v1:d01:d01-solo:technique:true:over_authored_max+over_fatigue_cap` (12 cells): Needs human review before deciding whether this is policy allowance, cap review, block split, or source-backed content depth.
- `gpdg:v1:d01:d01-solo:pressure:false:over_authored_max+over_fatigue_cap` (12 cells): Needs human review before deciding whether this is policy allowance, cap review, block split, or source-backed content depth.
- `gpdg:v1:d22:d22-solo-open:technique:true:under_authored_min` (12 cells): Needs human review before deciding whether this is policy allowance, cap review, block split, or source-backed content depth.
- `gpdg:v1:d38:d38-solo:technique:true:under_authored_min` (12 cells): Needs human review before deciding whether this is policy allowance, cap review, block split, or source-backed content depth.
- `gpdg:v1:d39:d39-solo:technique:true:under_authored_min` (12 cells): Needs human review before deciding whether this is policy allowance, cap review, block split, or source-backed content depth.
- `gpdg:v1:d48:d48-solo-open:technique:true:under_authored_min` (12 cells): Needs human review before deciding whether this is policy allowance, cap review, block split, or source-backed content depth.
- `gpdg:v1:d05:d05-pair:main_skill:true:over_authored_max+over_fatigue_cap` (10 cells): Needs human review before deciding whether this is policy allowance, cap review, block split, or source-backed content depth.
- `gpdg:v1:d33:d33-solo-open:main_skill:true:under_authored_min` (10 cells): Needs human review before deciding whether this is policy allowance, cap review, block split, or source-backed content depth.
- `gpdg:v1:d51:d51-pair-open:main_skill:true:under_authored_min` (10 cells): Needs human review before deciding whether this is policy allowance, cap review, block split, or source-backed content depth.
- `gpdg:v1:d05:d05-solo:main_skill:true:over_authored_max+over_fatigue_cap` (9 cells): Needs human review before deciding whether this is policy allowance, cap review, block split, or source-backed content depth.
- `gpdg:v1:d33:d33-pair-open:technique:true:under_authored_min` (9 cells): Needs human review before deciding whether this is policy allowance, cap review, block split, or source-backed content depth.
- `gpdg:v1:d07:d07-pair-open:technique:true:under_authored_min` (8 cells): Needs human review before deciding whether this is policy allowance, cap review, block split, or source-backed content depth.
- `gpdg:v1:d22:d22-pair-open:technique:true:under_authored_min` (8 cells): Needs human review before deciding whether this is policy allowance, cap review, block split, or source-backed content depth.
- `gpdg:v1:d22:d22-solo-open:main_skill:true:under_authored_min` (8 cells): Needs human review before deciding whether this is policy allowance, cap review, block split, or source-backed content depth.
- `gpdg:v1:d48:d48-pair-open:technique:true:under_authored_min` (8 cells): Needs human review before deciding whether this is policy allowance, cap review, block split, or source-backed content depth.
- `gpdg:v1:d49:d49-solo-open:main_skill:true:under_authored_min` (8 cells): Needs human review before deciding whether this is policy allowance, cap review, block split, or source-backed content depth.
- `gpdg:v1:d50:d50-solo-open:main_skill:true:under_authored_min` (8 cells): Needs human review before deciding whether this is policy allowance, cap review, block split, or source-backed content depth.
- `gpdg:v1:d11:d11-solo:main_skill:true:over_authored_max+over_fatigue_cap` (6 cells): Needs human review before deciding whether this is policy allowance, cap review, block split, or source-backed content depth.
- `gpdg:v1:d33:d33-pair-open:main_skill:true:under_authored_min` (6 cells): Needs human review before deciding whether this is policy allowance, cap review, block split, or source-backed content depth.
- `gpdg:v1:d47:d47-solo-open:main_skill:true:over_authored_max+over_fatigue_cap` (6 cells): Needs human review before deciding whether this is policy allowance, cap review, block split, or source-backed content depth.
- `gpdg:v1:d22:d22-pair-open:main_skill:true:under_authored_min` (5 cells): Needs human review before deciding whether this is policy allowance, cap review, block split, or source-backed content depth.
- `gpdg:v1:d33:d33-solo-open:movement_proxy:false:under_authored_min` (5 cells): Needs human review before deciding whether this is policy allowance, cap review, block split, or source-backed content depth.
- `gpdg:v1:d10:d10-pair:main_skill:true:over_authored_max+over_fatigue_cap` (4 cells): Needs human review before deciding whether this is policy allowance, cap review, block split, or source-backed content depth.
- `gpdg:v1:d33:d33-pair-open:movement_proxy:false:under_authored_min` (4 cells): Needs human review before deciding whether this is policy allowance, cap review, block split, or source-backed content depth.
- `gpdg:v1:d49:d49-pair-open:main_skill:true:under_authored_min` (4 cells): Needs human review before deciding whether this is policy allowance, cap review, block split, or source-backed content depth.
- `gpdg:v1:d50:d50-pair-open:main_skill:true:under_authored_min` (4 cells): Needs human review before deciding whether this is policy allowance, cap review, block split, or source-backed content depth.
- `gpdg:v1:d07:d07-solo-open:main_skill:true:over_authored_max+over_fatigue_cap` (3 cells): Needs human review before deciding whether this is policy allowance, cap review, block split, or source-backed content depth.
- `gpdg:v1:d33:d33-pair:technique:true:under_authored_min` (3 cells): Needs human review before deciding whether this is policy allowance, cap review, block split, or source-backed content depth.
- `gpdg:v1:d33:d33-solo-net:technique:true:under_authored_min` (3 cells): Needs human review before deciding whether this is policy allowance, cap review, block split, or source-backed content depth.
- `gpdg:v1:d03:d03-pair:main_skill:true:over_authored_max+over_fatigue_cap` (2 cells): Needs human review before deciding whether this is policy allowance, cap review, block split, or source-backed content depth.
- `gpdg:v1:d11:d11-pair:pressure:false:over_authored_max+over_fatigue_cap` (2 cells): Needs human review before deciding whether this is policy allowance, cap review, block split, or source-backed content depth.
- `gpdg:v1:d22:d22-pair:main_skill:true:under_authored_min` (2 cells): Needs human review before deciding whether this is policy allowance, cap review, block split, or source-backed content depth.
- `gpdg:v1:d22:d22-solo-open:movement_proxy:false:under_authored_min` (2 cells): Needs human review before deciding whether this is policy allowance, cap review, block split, or source-backed content depth.
- `gpdg:v1:d33:d33-pair:main_skill:true:under_authored_min` (2 cells): Needs human review before deciding whether this is policy allowance, cap review, block split, or source-backed content depth.
- `gpdg:v1:d38:d38-pair:main_skill:true:over_authored_max+over_fatigue_cap` (2 cells): Needs human review before deciding whether this is policy allowance, cap review, block split, or source-backed content depth.
- `gpdg:v1:d01:d01-pair:technique:true:over_authored_max+over_fatigue_cap` (1 cells): Needs human review before deciding whether this is policy allowance, cap review, block split, or source-backed content depth.
- `gpdg:v1:d22:d22-pair:movement_proxy:false:under_authored_min` (1 cells): Needs human review before deciding whether this is policy allowance, cap review, block split, or source-backed content depth.
- `gpdg:v1:d22:d22-solo:movement_proxy:false:under_authored_min` (1 cells): Needs human review before deciding whether this is policy allowance, cap review, block split, or source-backed content depth.
- `gpdg:v1:d22:d22-solo:main_skill:true:under_authored_min` (1 cells): Needs human review before deciding whether this is policy allowance, cap review, block split, or source-backed content depth.
- `gpdg:v1:d33:d33-solo-net:movement_proxy:false:under_authored_min` (1 cells): Needs human review before deciding whether this is policy allowance, cap review, block split, or source-backed content depth.
- `gpdg:v1:d33:d33-solo-net:main_skill:true:under_authored_min` (1 cells): Needs human review before deciding whether this is policy allowance, cap review, block split, or source-backed content depth.


## Generator Policy Investigation

- `gpdg:v1:none:none:movement_proxy:false:slot_dropped` (48 cells): Redistribution evidence is present, so generator policy should be investigated before catalog changes.


## Top Affected Groups

- `gpdg:v1:none:none:none:none:under_named_profile_duration` (207 cells, route: `defer`)
- `gpdg:v1:d25:d25-solo:wrap:true:under_authored_min` (65 cells, route: `defer`)
- `gpdg:v1:none:none:movement_proxy:false:slot_dropped` (48 cells, route: `generator_policy_investigation`)
- `gpdg:v1:d51:d51-solo-open:main_skill:true:under_authored_min` (21 cells, route: `defer`)
- `gpdg:v1:d07:d07-solo-open:technique:true:under_authored_min` (18 cells, route: `defer`)
- `gpdg:v1:d33:d33-solo-open:technique:true:under_authored_min` (16 cells, route: `defer`)
- `gpdg:v1:d01:d01-pair:pressure:false:over_authored_max+over_fatigue_cap` (15 cells, route: `defer`)
- `gpdg:v1:d01:d01-solo:movement_proxy:false:over_authored_max+over_fatigue_cap` (13 cells, route: `defer`)
- `gpdg:v1:d01:d01-solo:main_skill:true:over_authored_max+over_fatigue_cap` (12 cells, route: `defer`)
- `gpdg:v1:d01:d01-solo:technique:true:over_authored_max+over_fatigue_cap` (12 cells, route: `defer`)
- `gpdg:v1:d01:d01-solo:pressure:false:over_authored_max+over_fatigue_cap` (12 cells, route: `defer`)
- `gpdg:v1:d22:d22-solo-open:technique:true:under_authored_min` (12 cells, route: `defer`)
- `gpdg:v1:d38:d38-solo:technique:true:under_authored_min` (12 cells, route: `defer`)
- `gpdg:v1:d39:d39-solo:technique:true:under_authored_min` (12 cells, route: `defer`)
- `gpdg:v1:d48:d48-solo-open:technique:true:under_authored_min` (12 cells, route: `defer`)
- `gpdg:v1:d05:d05-pair:main_skill:true:over_authored_max+over_fatigue_cap` (10 cells, route: `defer`)
- `gpdg:v1:d33:d33-solo-open:main_skill:true:under_authored_min` (10 cells, route: `defer`)
- `gpdg:v1:d51:d51-pair-open:main_skill:true:under_authored_min` (10 cells, route: `defer`)
- `gpdg:v1:d05:d05-solo:main_skill:true:over_authored_max+over_fatigue_cap` (9 cells, route: `defer`)
- `gpdg:v1:d33:d33-pair-open:technique:true:under_authored_min` (9 cells, route: `defer`)
- `gpdg:v1:d07:d07-pair-open:technique:true:under_authored_min` (8 cells, route: `defer`)
- `gpdg:v1:d22:d22-pair-open:technique:true:under_authored_min` (8 cells, route: `defer`)
- `gpdg:v1:d22:d22-solo-open:main_skill:true:under_authored_min` (8 cells, route: `defer`)
- `gpdg:v1:d48:d48-pair-open:technique:true:under_authored_min` (8 cells, route: `defer`)
- `gpdg:v1:d49:d49-solo-open:main_skill:true:under_authored_min` (8 cells, route: `defer`)
- `gpdg:v1:d50:d50-solo-open:main_skill:true:under_authored_min` (8 cells, route: `defer`)
- `gpdg:v1:d11:d11-solo:main_skill:true:over_authored_max+over_fatigue_cap` (6 cells, route: `defer`)
- `gpdg:v1:d33:d33-pair-open:main_skill:true:under_authored_min` (6 cells, route: `defer`)
- `gpdg:v1:d47:d47-solo-open:main_skill:true:over_authored_max+over_fatigue_cap` (6 cells, route: `defer`)
- `gpdg:v1:d22:d22-pair-open:main_skill:true:under_authored_min` (5 cells, route: `defer`)
- `gpdg:v1:d33:d33-solo-open:movement_proxy:false:under_authored_min` (5 cells, route: `defer`)
- `gpdg:v1:d10:d10-pair:main_skill:true:over_authored_max+over_fatigue_cap` (4 cells, route: `defer`)
- `gpdg:v1:d33:d33-pair-open:movement_proxy:false:under_authored_min` (4 cells, route: `defer`)
- `gpdg:v1:d49:d49-pair-open:main_skill:true:under_authored_min` (4 cells, route: `defer`)
- `gpdg:v1:d50:d50-pair-open:main_skill:true:under_authored_min` (4 cells, route: `defer`)
- `gpdg:v1:d07:d07-solo-open:main_skill:true:over_authored_max+over_fatigue_cap` (3 cells, route: `defer`)
- `gpdg:v1:d33:d33-pair:technique:true:under_authored_min` (3 cells, route: `defer`)
- `gpdg:v1:d33:d33-solo-net:technique:true:under_authored_min` (3 cells, route: `defer`)
- `gpdg:v1:d03:d03-pair:main_skill:true:over_authored_max+over_fatigue_cap` (2 cells, route: `defer`)
- `gpdg:v1:d11:d11-pair:pressure:false:over_authored_max+over_fatigue_cap` (2 cells, route: `defer`)
- `gpdg:v1:d22:d22-pair:main_skill:true:under_authored_min` (2 cells, route: `defer`)
- `gpdg:v1:d22:d22-solo-open:movement_proxy:false:under_authored_min` (2 cells, route: `defer`)
- `gpdg:v1:d33:d33-pair:main_skill:true:under_authored_min` (2 cells, route: `defer`)
- `gpdg:v1:d38:d38-pair:main_skill:true:over_authored_max+over_fatigue_cap` (2 cells, route: `defer`)
- `gpdg:v1:d01:d01-pair:technique:true:over_authored_max+over_fatigue_cap` (1 cells, route: `defer`)
- `gpdg:v1:d22:d22-pair:movement_proxy:false:under_authored_min` (1 cells, route: `defer`)
- `gpdg:v1:d22:d22-solo:movement_proxy:false:under_authored_min` (1 cells, route: `defer`)
- `gpdg:v1:d22:d22-solo:main_skill:true:under_authored_min` (1 cells, route: `defer`)
- `gpdg:v1:d33:d33-solo-net:movement_proxy:false:under_authored_min` (1 cells, route: `defer`)
- `gpdg:v1:d33:d33-solo-net:main_skill:true:under_authored_min` (1 cells, route: `defer`)

## Machine-Readable Registry

<!-- diagnostic-triage-registry:start -->
```json
[
  {
    "groupKey": "gpdg:v1:none:none:none:none:under_named_profile_duration",
    "diagnosticFingerprint": "gpdf|v1|none|none|none|207|coverage_gap_review+source_backed_content_depth|pass/pair_net/advanced/25/matrix-b/none/20/none/under_named_profile_duration|pass/pair_net/advanced/25/matrix-c/none/20/none/under_named_profile_duration|pass/pair_net/advanced/25/matrix-d/none/20/none/under_named_profile_duration",
    "triageStatus": "observed",
    "route": "defer",
    "enforcementStatus": "observation_only",
    "rationale": "Needs human review before deciding whether this is policy allowance, cap review, block split, or source-backed content depth.",
    "owner": "agent",
    "reviewedReportId": "generated-plan-diagnostics-report-2026-05-01",
    "affectedCellCount": 207,
    "likelyFixPaths": [
      "coverage_gap_review",
      "source_backed_content_depth"
    ],
    "evidence": []
  },
  {
    "groupKey": "gpdg:v1:d25:d25-solo:wrap:true:under_authored_min",
    "diagnosticFingerprint": "gpdf|v1|4|none|none|65|block_split+policy_allowance+source_backed_content_depth+variant_cap_review|pass/pair_net/advanced/15/matrix-a/block-3/3/3/under_authored_min|pass/pair_net/advanced/15/matrix-c/block-3/3/3/under_authored_min|pass/pair_net/beginner/15/matrix-a/block-3/3/3/under_authored_min",
    "triageStatus": "observed",
    "route": "defer",
    "enforcementStatus": "observation_only",
    "rationale": "Needs human review before deciding whether this is policy allowance, cap review, block split, or source-backed content depth.",
    "owner": "agent",
    "reviewedReportId": "generated-plan-diagnostics-report-2026-05-01",
    "affectedCellCount": 65,
    "likelyFixPaths": [
      "policy_allowance",
      "block_split",
      "variant_cap_review",
      "source_backed_content_depth"
    ],
    "evidence": []
  },
  {
    "groupKey": "gpdg:v1:none:none:movement_proxy:false:slot_dropped",
    "diagnosticFingerprint": "gpdf|v1|none|none|none|48|coverage_gap_review+source_backed_content_depth|pass/pair_net/advanced/25/matrix-b/none/none/5/slot_dropped|pass/pair_net/advanced/25/matrix-c/none/none/5/slot_dropped|pass/pair_net/advanced/25/matrix-d/none/none/5/slot_dropped",
    "triageStatus": "routed",
    "route": "generator_policy_investigation",
    "enforcementStatus": "observation_only",
    "rationale": "Redistribution evidence is present, so generator policy should be investigated before catalog changes.",
    "owner": "agent",
    "reviewedReportId": "generated-plan-diagnostics-report-2026-05-01",
    "affectedCellCount": 48,
    "likelyFixPaths": [
      "coverage_gap_review",
      "source_backed_content_depth"
    ],
    "evidence": []
  },
  {
    "groupKey": "gpdg:v1:d51:d51-solo-open:main_skill:true:under_authored_min",
    "diagnosticFingerprint": "gpdf|v1|8|none|none|21|block_split+policy_allowance+source_backed_content_depth+variant_cap_review|serve/solo_net/beginner/15/matrix-a/block-2/5/5/under_authored_min|serve/solo_net/beginner/15/matrix-b/block-2/5/5/under_authored_min|serve/solo_net/beginner/15/matrix-c/block-2/5/5/under_authored_min",
    "triageStatus": "observed",
    "route": "defer",
    "enforcementStatus": "observation_only",
    "rationale": "Needs human review before deciding whether this is policy allowance, cap review, block split, or source-backed content depth.",
    "owner": "agent",
    "reviewedReportId": "generated-plan-diagnostics-report-2026-05-01",
    "affectedCellCount": 21,
    "likelyFixPaths": [
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
    "groupKey": "gpdg:v1:d01:d01-pair:pressure:false:over_authored_max+over_fatigue_cap",
    "diagnosticFingerprint": "gpdf|v1|none|6|6|15|block_split+policy_allowance+source_backed_content_depth+variant_cap_review|pass/pair_net/beginner/40/matrix-a/block-4/8/8/over_authored_max+over_fatigue_cap|pass/pair_net/beginner/40/matrix-b/block-4/8/8/over_authored_max+over_fatigue_cap|pass/pair_net/beginner/40/matrix-d/block-4/8/8/over_authored_max+over_fatigue_cap",
    "triageStatus": "observed",
    "route": "defer",
    "enforcementStatus": "observation_only",
    "rationale": "Needs human review before deciding whether this is policy allowance, cap review, block split, or source-backed content depth.",
    "owner": "agent",
    "reviewedReportId": "generated-plan-diagnostics-report-2026-05-01",
    "affectedCellCount": 15,
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
    "diagnosticFingerprint": "gpdf|v1|none|5|5|13|block_split+policy_allowance+source_backed_content_depth+variant_cap_review|pass/solo_net/intermediate/40/matrix-b/block-2/6/6/over_authored_max+over_fatigue_cap|pass/solo_net/intermediate/40/matrix-c/block-2/6/6/over_authored_max+over_fatigue_cap|pass/solo_net/intermediate/40/matrix-d/block-2/6/6/over_authored_max+over_fatigue_cap",
    "triageStatus": "observed",
    "route": "defer",
    "enforcementStatus": "observation_only",
    "rationale": "Needs human review before deciding whether this is policy allowance, cap review, block split, or source-backed content depth.",
    "owner": "agent",
    "reviewedReportId": "generated-plan-diagnostics-report-2026-05-01",
    "affectedCellCount": 13,
    "likelyFixPaths": [
      "policy_allowance",
      "block_split",
      "variant_cap_review",
      "source_backed_content_depth"
    ],
    "evidence": []
  },
  {
    "groupKey": "gpdg:v1:d01:d01-solo:main_skill:true:over_authored_max+over_fatigue_cap",
    "diagnosticFingerprint": "gpdf|v1|none|5|5|12|block_split+policy_allowance+source_backed_content_depth+variant_cap_review|pass/solo_net/beginner/25/matrix-a/block-2/7/7/over_authored_max+over_fatigue_cap|pass/solo_net/beginner/25/matrix-c/block-2/7/7/over_authored_max+over_fatigue_cap|pass/solo_net/beginner/40/matrix-a/block-2/10/10/over_authored_max+over_fatigue_cap",
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
    "groupKey": "gpdg:v1:d01:d01-solo:pressure:false:over_authored_max+over_fatigue_cap",
    "diagnosticFingerprint": "gpdf|v1|none|5|5|12|block_split+policy_allowance+source_backed_content_depth+variant_cap_review|pass/solo_net/intermediate/40/matrix-a/block-4/7/7/over_authored_max+over_fatigue_cap|pass/solo_open/intermediate/40/matrix-a/block-4/6/6/over_authored_max+over_fatigue_cap|pass/solo_wall/intermediate/40/matrix-a/block-4/7/7/over_authored_max+over_fatigue_cap",
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
    "groupKey": "gpdg:v1:d33:d33-solo-open:main_skill:true:under_authored_min",
    "diagnosticFingerprint": "gpdf|v1|6|none|none|10|block_split+policy_allowance+source_backed_content_depth+variant_cap_review|serve/solo_net/advanced/15/matrix-d/block-2/5/5/under_authored_min|serve/solo_net/intermediate/15/matrix-d/block-2/5/5/under_authored_min|serve/solo_open/advanced/15/matrix-b/block-2/5/5/under_authored_min",
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
    "groupKey": "gpdg:v1:d51:d51-pair-open:main_skill:true:under_authored_min",
    "diagnosticFingerprint": "gpdf|v1|8|none|none|10|block_split+policy_allowance+source_backed_content_depth+variant_cap_review|serve/pair_net/beginner/15/matrix-a/block-2/5/5/under_authored_min|serve/pair_net/beginner/15/matrix-d/block-2/5/5/under_authored_min|serve/pair_net/beginner/25/matrix-d/block-3/7/7/under_authored_min",
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
    "groupKey": "gpdg:v1:d05:d05-solo:main_skill:true:over_authored_max+over_fatigue_cap",
    "diagnosticFingerprint": "gpdf|v1|none|8|8|9|block_split+policy_allowance+source_backed_content_depth+variant_cap_review|pass/solo_net/beginner/40/matrix-b/block-2/10/10/over_authored_max+over_fatigue_cap|pass/solo_net/beginner/40/matrix-d/block-2/10/10/over_authored_max+over_fatigue_cap|pass/solo_net/intermediate/40/matrix-a/block-3/10/10/over_authored_max+over_fatigue_cap",
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
    "groupKey": "gpdg:v1:d22:d22-solo-open:main_skill:true:under_authored_min",
    "diagnosticFingerprint": "gpdf|v1|6|none|none|8|block_split+policy_allowance+source_backed_content_depth+variant_cap_review|serve/solo_net/advanced/15/matrix-c/block-2/5/5/under_authored_min|serve/solo_net/intermediate/15/matrix-a/block-2/5/5/under_authored_min|serve/solo_open/advanced/15/matrix-a/block-2/5/5/under_authored_min",
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
    "groupKey": "gpdg:v1:d49:d49-solo-open:main_skill:true:under_authored_min",
    "diagnosticFingerprint": "gpdf|v1|8|none|none|8|block_split+policy_allowance+source_backed_content_depth+variant_cap_review|set/solo_net/advanced/15/matrix-b/block-2/5/5/under_authored_min|set/solo_net/advanced/15/matrix-c/block-2/5/5/under_authored_min|set/solo_open/advanced/15/matrix-b/block-2/5/5/under_authored_min",
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
    "groupKey": "gpdg:v1:d50:d50-solo-open:main_skill:true:under_authored_min",
    "diagnosticFingerprint": "gpdf|v1|8|none|none|8|block_split+policy_allowance+source_backed_content_depth+variant_cap_review|pass/solo_net/advanced/15/matrix-b/block-2/5/5/under_authored_min|pass/solo_net/advanced/15/matrix-c/block-2/5/5/under_authored_min|pass/solo_open/advanced/15/matrix-b/block-2/5/5/under_authored_min",
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
    "groupKey": "gpdg:v1:d33:d33-pair-open:main_skill:true:under_authored_min",
    "diagnosticFingerprint": "gpdf|v1|6|none|none|6|block_split+policy_allowance+source_backed_content_depth+variant_cap_review|serve/pair_net/advanced/15/matrix-b/block-2/5/5/under_authored_min|serve/pair_net/advanced/15/matrix-d/block-2/5/5/under_authored_min|serve/pair_open/advanced/15/matrix-a/block-2/5/5/under_authored_min",
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
    "groupKey": "gpdg:v1:d22:d22-pair-open:main_skill:true:under_authored_min",
    "diagnosticFingerprint": "gpdf|v1|6|none|none|5|block_split+policy_allowance+source_backed_content_depth+variant_cap_review|serve/pair_net/advanced/15/matrix-a/block-2/5/5/under_authored_min|serve/pair_open/advanced/15/matrix-b/block-2/5/5/under_authored_min|serve/pair_open/advanced/15/matrix-c/block-2/5/5/under_authored_min",
    "triageStatus": "observed",
    "route": "defer",
    "enforcementStatus": "observation_only",
    "rationale": "Needs human review before deciding whether this is policy allowance, cap review, block split, or source-backed content depth.",
    "owner": "agent",
    "reviewedReportId": "generated-plan-diagnostics-report-2026-05-01",
    "affectedCellCount": 5,
    "likelyFixPaths": [
      "policy_allowance",
      "block_split",
      "variant_cap_review",
      "source_backed_content_depth"
    ],
    "evidence": []
  },
  {
    "groupKey": "gpdg:v1:d33:d33-solo-open:movement_proxy:false:under_authored_min",
    "diagnosticFingerprint": "gpdf|v1|6|none|none|5|block_split+policy_allowance+source_backed_content_depth+variant_cap_review|serve/solo_net/intermediate/25/matrix-b/block-2/5/5/under_authored_min|serve/solo_open/beginner/25/matrix-b/block-2/5/5/under_authored_min|serve/solo_open/intermediate/25/matrix-b/block-2/5/5/under_authored_min",
    "triageStatus": "observed",
    "route": "defer",
    "enforcementStatus": "observation_only",
    "rationale": "Needs human review before deciding whether this is policy allowance, cap review, block split, or source-backed content depth.",
    "owner": "agent",
    "reviewedReportId": "generated-plan-diagnostics-report-2026-05-01",
    "affectedCellCount": 5,
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
    "groupKey": "gpdg:v1:d33:d33-pair-open:movement_proxy:false:under_authored_min",
    "diagnosticFingerprint": "gpdf|v1|6|none|none|4|block_split+policy_allowance+source_backed_content_depth+variant_cap_review|serve/pair_net/beginner/25/matrix-d/block-2/5/5/under_authored_min|serve/pair_net/intermediate/25/matrix-d/block-2/5/5/under_authored_min|serve/pair_open/beginner/25/matrix-a/block-2/5/5/under_authored_min",
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
    "groupKey": "gpdg:v1:d50:d50-pair-open:main_skill:true:under_authored_min",
    "diagnosticFingerprint": "gpdf|v1|8|none|none|4|block_split+policy_allowance+source_backed_content_depth+variant_cap_review|pass/pair_net/advanced/15/matrix-a/block-2/5/5/under_authored_min|pass/pair_net/advanced/25/matrix-a/block-3/7/7/under_authored_min|pass/pair_open/advanced/15/matrix-a/block-2/5/5/under_authored_min",
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
    "groupKey": "gpdg:v1:d11:d11-pair:pressure:false:over_authored_max+over_fatigue_cap",
    "diagnosticFingerprint": "gpdf|v1|none|7|7|2|block_split+policy_allowance+source_backed_content_depth+variant_cap_review|pass/pair_net/intermediate/40/matrix-c/block-4/8/8/over_authored_max+over_fatigue_cap|serve/pair_net/intermediate/40/matrix-a/block-4/8/8/over_authored_max+over_fatigue_cap",
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
    "groupKey": "gpdg:v1:d22:d22-solo-open:movement_proxy:false:under_authored_min",
    "diagnosticFingerprint": "gpdf|v1|6|none|none|2|block_split+policy_allowance+source_backed_content_depth+variant_cap_review|serve/solo_open/intermediate/25/matrix-c/block-2/5/5/under_authored_min|serve/solo_wall/intermediate/25/matrix-c/block-2/5/5/under_authored_min",
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
    "groupKey": "gpdg:v1:d33:d33-pair:main_skill:true:under_authored_min",
    "diagnosticFingerprint": "gpdf|v1|6|none|none|2|block_split+policy_allowance+source_backed_content_depth+variant_cap_review|serve/pair_net/beginner/15/matrix-b/block-2/5/5/under_authored_min|serve/pair_net/intermediate/15/matrix-b/block-2/5/5/under_authored_min",
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
    "groupKey": "gpdg:v1:d22:d22-pair:movement_proxy:false:under_authored_min",
    "diagnosticFingerprint": "gpdf|v1|6|none|none|1|block_split+policy_allowance+source_backed_content_depth+variant_cap_review|serve/pair_net/intermediate/25/matrix-a/block-2/5/5/under_authored_min",
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
    "groupKey": "gpdg:v1:d22:d22-solo:movement_proxy:false:under_authored_min",
    "diagnosticFingerprint": "gpdf|v1|6|none|none|1|block_split+policy_allowance+source_backed_content_depth+variant_cap_review|serve/solo_net/intermediate/25/matrix-c/block-2/5/5/under_authored_min",
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
    "groupKey": "gpdg:v1:d22:d22-solo:main_skill:true:under_authored_min",
    "diagnosticFingerprint": "gpdf|v1|6|none|none|1|block_split+policy_allowance+source_backed_content_depth+variant_cap_review|serve/solo_net/advanced/15/matrix-a/block-2/5/5/under_authored_min",
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
    "groupKey": "gpdg:v1:d33:d33-solo-net:movement_proxy:false:under_authored_min",
    "diagnosticFingerprint": "gpdf|v1|6|none|none|1|block_split+policy_allowance+source_backed_content_depth+variant_cap_review|serve/solo_net/beginner/25/matrix-d/block-2/5/5/under_authored_min",
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
    "groupKey": "gpdg:v1:d33:d33-solo-net:main_skill:true:under_authored_min",
    "diagnosticFingerprint": "gpdf|v1|6|none|none|1|block_split+policy_allowance+source_backed_content_depth+variant_cap_review|serve/solo_net/advanced/15/matrix-b/block-2/5/5/under_authored_min",
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
