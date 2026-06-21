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

- Current routeable groups: 67
- Registry entries: 67
- Blocking validation issues: 0
- Warning validation issues: 0

## Route Counts

- `defer`: 67

## Decision-Debt Compression

### Coverage gap review

- Lane: `coverage_gap_review`
- Question: Does this focus/profile need catalog coverage, or is the shorter session acceptable for now?
- Why this lane: Dropped slots and under-named-profile sessions are catalog-coverage signals under the v8 honest-duration contract.
- Groups: 2; total affected cells: 219
- Redistribution-affected cells: 0
- Non-redistribution over-cap cells: 0
- Route mix: `defer` 2
- Disposition: `needs_human_decision`
- Candidate dispositions: `catalog_gap_card_needed`, `accepted_short_session`, `no_implementation_action_yet`
- Recommended follow-up: coverage gap review
- Guide: `docs/plans/2026-05-24-001-feat-session-duration-honesty-plan.md`
- Next evidence needed: Review the current generated-plan diagnostics report and decide whether this lane needs follow-up work.
- Group keys: `gpdg:v1:none:none:none:none:under_named_profile_duration`, `gpdg:v1:none:none:movement_proxy:false:slot_dropped`

### Short-session cooldown minimum

- Lane: `short_session_cooldown_minimum`
- Question: Is the short wrap envelope acceptable, or does this need workload guidance?
- Why this lane: Wrap under-min groups are likely cooldown policy questions before they are catalog gaps.
- Groups: 1; total affected cells: 99
- Redistribution-affected cells: 0
- Non-redistribution over-cap cells: 0
- Route mix: `defer` 1
- Disposition: `needs_human_decision`
- Candidate dispositions: `accepted_policy_allowance`, `metadata_review_needed`, `block_shape_review_needed`
- Recommended follow-up: workload envelope guidance
- Next evidence needed: Review the current generated-plan diagnostics report and decide whether this lane needs follow-up work.
- Group keys: `gpdg:v1:d25:d25-solo:wrap:true:under_authored_min`

### Technique under-min review

- Lane: `technique_under_min_review`
- Question: Are technique slots intentionally below authored minimums, or should content/block shape change?
- Why this lane: Technique under-min groups need human review before source-backed content or block-split work.
- Groups: 16; total affected cells: 110
- Redistribution-affected cells: 0
- Non-redistribution over-cap cells: 0
- Route mix: `defer` 16
- Disposition: `needs_human_decision`
- Candidate dispositions: `accepted_policy_allowance`, `metadata_review_needed`, `block_shape_review_needed`, `source_depth_candidate`
- Recommended follow-up: workload envelope guidance
- Next evidence needed: Review the current generated-plan diagnostics report and decide whether this lane needs follow-up work.
- Group keys: `gpdg:v1:d07:d07-solo-open:technique:true:under_authored_min`, `gpdg:v1:d39:d39-solo:technique:true:under_authored_min`, `gpdg:v1:d48:d48-solo-open:technique:true:under_authored_min`, `gpdg:v1:d33:d33-solo-open:technique:true:under_authored_min`, `gpdg:v1:d07:d07-pair-open:technique:true:under_authored_min`, `gpdg:v1:d48:d48-pair-open:technique:true:under_authored_min`, `gpdg:v1:d22:d22-pair-open:technique:true:under_authored_min`, `gpdg:v1:d22:d22-solo-open:technique:true:under_authored_min`, `gpdg:v1:d33:d33-pair-open:technique:true:under_authored_min`, `gpdg:v1:d55:d55-solo-open:technique:true:under_authored_min`, `gpdg:v1:d33:d33-pair:technique:true:under_authored_min`, `gpdg:v1:d33:d33-solo-net:technique:true:under_authored_min`, `gpdg:v1:d38:d38-solo:technique:true:under_authored_min`, `gpdg:v1:d22:d22-solo:technique:true:under_authored_min`, `gpdg:v1:d22:d22-pair:technique:true:under_authored_min`, `gpdg:v1:d55:d55-pair:technique:true:under_authored_min`

### Workload envelope review

- Lane: `workload_envelope_review`
- Question: Are duration and fatigue envelopes correct for these generated allocations?
- Why this lane: Over/under envelope pressure is a workload-policy question before catalog edits.
- Groups: 33; total affected cells: 227
- Redistribution-affected cells: 0
- Non-redistribution over-cap cells: 147
- Route mix: `defer` 33
- Disposition: `needs_human_decision`
- Candidate dispositions: `metadata_review_needed`, `block_shape_review_needed`, `no_implementation_action_yet`
- Recommended follow-up: workload envelope guidance
- Next evidence needed: Review the current generated-plan diagnostics report and decide whether this lane needs follow-up work.
- Group keys: `gpdg:v1:d51:d51-solo-open:main_skill:true:under_authored_min`, `gpdg:v1:d01:d01-solo:technique:true:over_authored_max+over_fatigue_cap`, `gpdg:v1:d05:d05-solo:main_skill:true:over_authored_max+over_fatigue_cap`, `gpdg:v1:d52:d52-solo:main_skill:true:over_authored_max+over_fatigue_cap`, `gpdg:v1:d52:d52-solo:technique:true:over_authored_max+over_fatigue_cap`, `gpdg:v1:d33:d33-solo-open:movement_proxy:false:under_authored_min`, `gpdg:v1:d50:d50-pair-open:main_skill:true:under_authored_min`, `gpdg:v1:d01:d01-solo:movement_proxy:false:over_authored_max+over_fatigue_cap`, `gpdg:v1:d52:d52-solo:movement_proxy:false:over_authored_max+over_fatigue_cap`, `gpdg:v1:d58:d58-solo:main_skill:true:over_authored_max+over_fatigue_cap`, `gpdg:v1:d01:d01-pair:pressure:false:over_authored_max+over_fatigue_cap`, `gpdg:v1:d10:d10-pair:main_skill:true:over_authored_max+over_fatigue_cap`, `gpdg:v1:d51:d51-pair-open:main_skill:true:under_authored_min`, `gpdg:v1:d33:d33-pair-open:main_skill:true:under_authored_min`, `gpdg:v1:d01:d01-solo:pressure:false:over_authored_max+over_fatigue_cap`, `gpdg:v1:d11:d11-solo:main_skill:true:over_authored_max+over_fatigue_cap`, `gpdg:v1:d47:d47-solo-open:main_skill:true:over_authored_max+over_fatigue_cap`, `gpdg:v1:d50:d50-solo-open:main_skill:true:under_authored_min`, `gpdg:v1:d55:d55-solo-open:main_skill:true:over_authored_max+over_fatigue_cap`, `gpdg:v1:d22:d22-solo-open:main_skill:true:under_authored_min`, `gpdg:v1:d54:d54-pair-open:main_skill:true:over_authored_max+over_fatigue_cap`, `gpdg:v1:d54:d54-solo-open:main_skill:true:over_authored_max+over_fatigue_cap`, `gpdg:v1:d05:d05-pair:main_skill:true:over_authored_max+over_fatigue_cap`, `gpdg:v1:d22:d22-solo-open:movement_proxy:false:under_authored_min`, `gpdg:v1:d33:d33-pair-open:movement_proxy:false:under_authored_min`, `gpdg:v1:d39:d39-pair:main_skill:true:over_authored_max+over_fatigue_cap`, `gpdg:v1:d49:d49-pair-open:main_skill:true:under_authored_min`, `gpdg:v1:d52:d52-pair:main_skill:true:over_authored_max+over_fatigue_cap`, `gpdg:v1:d53:d53-solo-open:main_skill:true:over_authored_max+over_fatigue_cap`, `gpdg:v1:d22:d22-pair-open:main_skill:true:under_authored_min`, `gpdg:v1:d33:d33-solo-open:main_skill:true:under_authored_min`, `gpdg:v1:d57:d57-solo:main_skill:true:over_authored_max+over_fatigue_cap`, `gpdg:v1:d58:d58-pair:main_skill:true:over_authored_max+over_fatigue_cap`

### Low-volume watchlist

- Lane: `low_volume_watchlist`
- Question: Does this low-volume observation need action, or should it stay watched?
- Why this lane: Small groups can stay visible without forcing a premature fix.
- Groups: 15; total affected cells: 24
- Redistribution-affected cells: 0
- Non-redistribution over-cap cells: 12
- Route mix: `defer` 15
- Disposition: `needs_human_decision`
- Candidate dispositions: `watchlist_only`, `no_implementation_action_yet`
- Recommended follow-up: workload envelope guidance
- Next evidence needed: Review the current generated-plan diagnostics report and decide whether this lane needs follow-up work.
- Group keys: `gpdg:v1:d03:d03-pair:main_skill:true:over_authored_max+over_fatigue_cap`, `gpdg:v1:d22:d22-pair:movement_proxy:false:under_authored_min`, `gpdg:v1:d22:d22-pair-open:movement_proxy:false:under_authored_min`, `gpdg:v1:d22:d22-solo:movement_proxy:false:under_authored_min`, `gpdg:v1:d33:d33-pair:main_skill:true:under_authored_min`, `gpdg:v1:d41:d41-pair:main_skill:true:over_authored_max+over_fatigue_cap`, `gpdg:v1:d51:d51-pair:main_skill:true:under_authored_min`, `gpdg:v1:d53:d53-pair-open:main_skill:true:over_authored_max+over_fatigue_cap`, `gpdg:v1:d56:d56-solo:technique:true:over_authored_max+over_fatigue_cap`, `gpdg:v1:d01:d01-pair:technique:true:over_authored_max+over_fatigue_cap`, `gpdg:v1:d11:d11-pair:technique:true:over_authored_max+over_fatigue_cap`, `gpdg:v1:d22:d22-solo:main_skill:true:under_authored_min`, `gpdg:v1:d33:d33-solo-net:main_skill:true:under_authored_min`, `gpdg:v1:d52:d52-pair:technique:true:over_authored_max+over_fatigue_cap`, `gpdg:v1:d57:d57-pair:main_skill:true:over_authored_max+over_fatigue_cap`

## Retired Rich Packet Chain

The D47/D05/D01/D49 packet builders that depended on legacy optional-slot redistribution fingerprints were retired by the CC1 bundle. Use the generated diagnostics report plus the compression lanes above as the current D130 founder-mode surface.
## Machine-Readable Registry

<!-- diagnostic-triage-registry:start -->
```json
[
  {
    "groupKey": "gpdg:v1:none:none:none:none:under_named_profile_duration",
    "diagnosticFingerprint": "gpdf|v1|none|none|none|197|coverage_gap_review+source_backed_content_depth|pass/pair_net/advanced/25/matrix-c/none/20/none/under_named_profile_duration|pass/pair_net/advanced/40/matrix-a/none/39/none/under_named_profile_duration|pass/pair_net/advanced/40/matrix-b/none/38/none/under_named_profile_duration",
    "triageStatus": "observed",
    "triageRoute": "defer",
    "reviewedReportId": "generated-plan-diagnostics-report-2026-05-01",
    "enforcementStatus": "observation_only",
    "notes": "compressed_lane:coverage_gap_review"
  },
  {
    "groupKey": "gpdg:v1:d25:d25-solo:wrap:true:under_authored_min",
    "diagnosticFingerprint": "gpdf|v1|4|none|none|99|block_split+policy_allowance+source_backed_content_depth+variant_cap_review|pass/pair_net/advanced/15/matrix-a/block-3/3/3/under_authored_min|pass/pair_net/advanced/15/matrix-c/block-3/3/3/under_authored_min|pass/pair_net/beginner/15/matrix-b/block-3/3/3/under_authored_min",
    "triageStatus": "observed",
    "triageRoute": "defer",
    "reviewedReportId": "generated-plan-diagnostics-report-2026-05-01",
    "enforcementStatus": "observation_only",
    "notes": "compressed_lane:short_session_cooldown_minimum"
  },
  {
    "groupKey": "gpdg:v1:none:none:movement_proxy:false:slot_dropped",
    "diagnosticFingerprint": "gpdf|v1|none|none|none|22|coverage_gap_review+source_backed_content_depth|pass/pair_net/advanced/25/matrix-c/none/none/5/slot_dropped|pass/pair_net/advanced/40/matrix-c/none/none/6/slot_dropped|pass/pair_open/advanced/25/matrix-c/none/none/5/slot_dropped",
    "triageStatus": "observed",
    "triageRoute": "defer",
    "reviewedReportId": "generated-plan-diagnostics-report-2026-05-01",
    "enforcementStatus": "observation_only",
    "notes": "compressed_lane:coverage_gap_review"
  },
  {
    "groupKey": "gpdg:v1:d07:d07-solo-open:technique:true:under_authored_min",
    "diagnosticFingerprint": "gpdf|v1|5|none|none|21|block_split+policy_allowance+source_backed_content_depth+variant_cap_review|pass/solo_net/advanced/15/matrix-a/block-1/4/4/under_authored_min|pass/solo_net/advanced/15/matrix-b/block-1/4/4/under_authored_min|pass/solo_net/advanced/15/matrix-c/block-1/4/4/under_authored_min",
    "triageStatus": "observed",
    "triageRoute": "defer",
    "reviewedReportId": "generated-plan-diagnostics-report-2026-05-01",
    "enforcementStatus": "observation_only",
    "notes": "compressed_lane:technique_under_min_review"
  },
  {
    "groupKey": "gpdg:v1:d51:d51-solo-open:main_skill:true:under_authored_min",
    "diagnosticFingerprint": "gpdf|v1|8|none|none|16|block_split+policy_allowance+source_backed_content_depth+variant_cap_review|serve/solo_net/beginner/15/matrix-a/block-2/5/5/under_authored_min|serve/solo_net/beginner/25/matrix-a/block-3/7/7/under_authored_min|serve/solo_net/intermediate/15/matrix-b/block-2/5/5/under_authored_min",
    "triageStatus": "observed",
    "triageRoute": "defer",
    "reviewedReportId": "generated-plan-diagnostics-report-2026-05-01",
    "enforcementStatus": "observation_only",
    "notes": "compressed_lane:workload_envelope_review"
  },
  {
    "groupKey": "gpdg:v1:d39:d39-solo:technique:true:under_authored_min",
    "diagnosticFingerprint": "gpdf|v1|5|none|none|15|block_split+policy_allowance+source_backed_content_depth+variant_cap_review|set/solo_net/beginner/15/matrix-a/block-1/4/4/under_authored_min|set/solo_net/beginner/15/matrix-b/block-1/4/4/under_authored_min|set/solo_net/beginner/15/matrix-d/block-1/4/4/under_authored_min",
    "triageStatus": "observed",
    "triageRoute": "defer",
    "reviewedReportId": "generated-plan-diagnostics-report-2026-05-01",
    "enforcementStatus": "observation_only",
    "notes": "compressed_lane:technique_under_min_review"
  },
  {
    "groupKey": "gpdg:v1:d01:d01-solo:technique:true:over_authored_max+over_fatigue_cap",
    "diagnosticFingerprint": "gpdf|v1|none|5|5|12|block_split+policy_allowance+source_backed_content_depth+variant_cap_review|pass/solo_net/beginner/25/matrix-d/block-1/6/6/over_authored_max+over_fatigue_cap|pass/solo_net/beginner/40/matrix-d/block-1/7/7/over_authored_max+over_fatigue_cap|pass/solo_net/intermediate/25/matrix-c/block-1/6/6/over_authored_max+over_fatigue_cap",
    "triageStatus": "observed",
    "triageRoute": "defer",
    "reviewedReportId": "generated-plan-diagnostics-report-2026-05-01",
    "enforcementStatus": "observation_only",
    "notes": "compressed_lane:workload_envelope_review"
  },
  {
    "groupKey": "gpdg:v1:d05:d05-solo:main_skill:true:over_authored_max+over_fatigue_cap",
    "diagnosticFingerprint": "gpdf|v1|none|8|8|12|block_split+policy_allowance+source_backed_content_depth+variant_cap_review|pass/solo_net/beginner/40/matrix-b/block-3/10/10/over_authored_max+over_fatigue_cap|pass/solo_net/beginner/40/matrix-c/block-3/10/10/over_authored_max+over_fatigue_cap|pass/solo_net/intermediate/40/matrix-a/block-3/10/10/over_authored_max+over_fatigue_cap",
    "triageStatus": "observed",
    "triageRoute": "defer",
    "reviewedReportId": "generated-plan-diagnostics-report-2026-05-01",
    "enforcementStatus": "observation_only",
    "notes": "compressed_lane:workload_envelope_review"
  },
  {
    "groupKey": "gpdg:v1:d48:d48-solo-open:technique:true:under_authored_min",
    "diagnosticFingerprint": "gpdf|v1|5|none|none|12|block_split+policy_allowance+source_backed_content_depth+variant_cap_review|set/solo_net/advanced/15/matrix-a/block-1/4/4/under_authored_min|set/solo_net/advanced/15/matrix-b/block-1/4/4/under_authored_min|set/solo_net/advanced/15/matrix-c/block-1/4/4/under_authored_min",
    "triageStatus": "observed",
    "triageRoute": "defer",
    "reviewedReportId": "generated-plan-diagnostics-report-2026-05-01",
    "enforcementStatus": "observation_only",
    "notes": "compressed_lane:technique_under_min_review"
  },
  {
    "groupKey": "gpdg:v1:d52:d52-solo:main_skill:true:over_authored_max+over_fatigue_cap",
    "diagnosticFingerprint": "gpdf|v1|none|5|5|12|block_split+policy_allowance+source_backed_content_depth+variant_cap_review|pass/solo_net/beginner/25/matrix-a/block-3/7/7/over_authored_max+over_fatigue_cap|pass/solo_net/beginner/25/matrix-d/block-3/7/7/over_authored_max+over_fatigue_cap|pass/solo_net/beginner/40/matrix-a/block-3/10/10/over_authored_max+over_fatigue_cap",
    "triageStatus": "observed",
    "triageRoute": "defer",
    "reviewedReportId": "generated-plan-diagnostics-report-2026-05-01",
    "enforcementStatus": "observation_only",
    "notes": "compressed_lane:workload_envelope_review"
  },
  {
    "groupKey": "gpdg:v1:d52:d52-solo:technique:true:over_authored_max+over_fatigue_cap",
    "diagnosticFingerprint": "gpdf|v1|none|5|5|12|block_split+policy_allowance+source_backed_content_depth+variant_cap_review|pass/solo_net/beginner/25/matrix-b/block-1/6/6/over_authored_max+over_fatigue_cap|pass/solo_net/beginner/25/matrix-c/block-1/6/6/over_authored_max+over_fatigue_cap|pass/solo_net/beginner/40/matrix-b/block-1/7/7/over_authored_max+over_fatigue_cap",
    "triageStatus": "observed",
    "triageRoute": "defer",
    "reviewedReportId": "generated-plan-diagnostics-report-2026-05-01",
    "enforcementStatus": "observation_only",
    "notes": "compressed_lane:workload_envelope_review"
  },
  {
    "groupKey": "gpdg:v1:d33:d33-solo-open:technique:true:under_authored_min",
    "diagnosticFingerprint": "gpdf|v1|6|none|none|11|block_split+policy_allowance+source_backed_content_depth+variant_cap_review|serve/solo_net/advanced/15/matrix-a/block-1/4/4/under_authored_min|serve/solo_net/advanced/15/matrix-b/block-1/4/4/under_authored_min|serve/solo_net/advanced/15/matrix-d/block-1/4/4/under_authored_min",
    "triageStatus": "observed",
    "triageRoute": "defer",
    "reviewedReportId": "generated-plan-diagnostics-report-2026-05-01",
    "enforcementStatus": "observation_only",
    "notes": "compressed_lane:technique_under_min_review"
  },
  {
    "groupKey": "gpdg:v1:d07:d07-pair-open:technique:true:under_authored_min",
    "diagnosticFingerprint": "gpdf|v1|5|none|none|10|block_split+policy_allowance+source_backed_content_depth+variant_cap_review|pass/pair_net/advanced/15/matrix-a/block-1/4/4/under_authored_min|pass/pair_net/advanced/15/matrix-b/block-1/4/4/under_authored_min|pass/pair_net/advanced/15/matrix-c/block-1/4/4/under_authored_min",
    "triageStatus": "observed",
    "triageRoute": "defer",
    "reviewedReportId": "generated-plan-diagnostics-report-2026-05-01",
    "enforcementStatus": "observation_only",
    "notes": "compressed_lane:technique_under_min_review"
  },
  {
    "groupKey": "gpdg:v1:d33:d33-solo-open:movement_proxy:false:under_authored_min",
    "diagnosticFingerprint": "gpdf|v1|6|none|none|10|block_split+policy_allowance+source_backed_content_depth+variant_cap_review|serve/solo_open/advanced/25/matrix-c/block-2/5/5/under_authored_min|serve/solo_open/advanced/25/matrix-d/block-2/5/5/under_authored_min|serve/solo_open/beginner/25/matrix-a/block-2/5/5/under_authored_min",
    "triageStatus": "observed",
    "triageRoute": "defer",
    "reviewedReportId": "generated-plan-diagnostics-report-2026-05-01",
    "enforcementStatus": "observation_only",
    "notes": "compressed_lane:workload_envelope_review"
  },
  {
    "groupKey": "gpdg:v1:d50:d50-pair-open:main_skill:true:under_authored_min",
    "diagnosticFingerprint": "gpdf|v1|8|none|none|10|block_split+policy_allowance+source_backed_content_depth+variant_cap_review|pass/pair_net/advanced/15/matrix-a/block-2/5/5/under_authored_min|pass/pair_net/advanced/15/matrix-b/block-2/5/5/under_authored_min|pass/pair_net/advanced/15/matrix-d/block-2/5/5/under_authored_min",
    "triageStatus": "observed",
    "triageRoute": "defer",
    "reviewedReportId": "generated-plan-diagnostics-report-2026-05-01",
    "enforcementStatus": "observation_only",
    "notes": "compressed_lane:workload_envelope_review"
  },
  {
    "groupKey": "gpdg:v1:d01:d01-solo:movement_proxy:false:over_authored_max+over_fatigue_cap",
    "diagnosticFingerprint": "gpdf|v1|none|5|5|9|block_split+policy_allowance+source_backed_content_depth+variant_cap_review|pass/solo_net/beginner/40/matrix-a/block-2/6/6/over_authored_max+over_fatigue_cap|pass/solo_net/beginner/40/matrix-b/block-2/6/6/over_authored_max+over_fatigue_cap|pass/solo_net/beginner/40/matrix-c/block-2/6/6/over_authored_max+over_fatigue_cap",
    "triageStatus": "observed",
    "triageRoute": "defer",
    "reviewedReportId": "generated-plan-diagnostics-report-2026-05-01",
    "enforcementStatus": "observation_only",
    "notes": "compressed_lane:workload_envelope_review"
  },
  {
    "groupKey": "gpdg:v1:d52:d52-solo:movement_proxy:false:over_authored_max+over_fatigue_cap",
    "diagnosticFingerprint": "gpdf|v1|none|5|5|9|block_split+policy_allowance+source_backed_content_depth+variant_cap_review|pass/solo_net/intermediate/40/matrix-a/block-2/6/6/over_authored_max+over_fatigue_cap|pass/solo_net/intermediate/40/matrix-c/block-2/6/6/over_authored_max+over_fatigue_cap|pass/solo_net/intermediate/40/matrix-d/block-2/6/6/over_authored_max+over_fatigue_cap",
    "triageStatus": "observed",
    "triageRoute": "defer",
    "reviewedReportId": "generated-plan-diagnostics-report-2026-05-01",
    "enforcementStatus": "observation_only",
    "notes": "compressed_lane:workload_envelope_review"
  },
  {
    "groupKey": "gpdg:v1:d58:d58-solo:main_skill:true:over_authored_max+over_fatigue_cap",
    "diagnosticFingerprint": "gpdf|v1|none|9|9|9|block_split+policy_allowance+source_backed_content_depth+variant_cap_review|set/solo_net/advanced/40/matrix-a/block-3/10/10/over_authored_max+over_fatigue_cap|set/solo_net/advanced/40/matrix-b/block-3/10/10/over_authored_max+over_fatigue_cap|set/solo_net/advanced/40/matrix-d/block-3/10/10/over_authored_max+over_fatigue_cap",
    "triageStatus": "observed",
    "triageRoute": "defer",
    "reviewedReportId": "generated-plan-diagnostics-report-2026-05-01",
    "enforcementStatus": "observation_only",
    "notes": "compressed_lane:workload_envelope_review"
  },
  {
    "groupKey": "gpdg:v1:d01:d01-pair:pressure:false:over_authored_max+over_fatigue_cap",
    "diagnosticFingerprint": "gpdf|v1|none|6|6|8|block_split+policy_allowance+source_backed_content_depth+variant_cap_review|pass/pair_net/beginner/40/matrix-a/block-4/8/8/over_authored_max+over_fatigue_cap|pass/pair_net/beginner/40/matrix-b/block-4/8/8/over_authored_max+over_fatigue_cap|pass/pair_net/beginner/40/matrix-d/block-4/8/8/over_authored_max+over_fatigue_cap",
    "triageStatus": "observed",
    "triageRoute": "defer",
    "reviewedReportId": "generated-plan-diagnostics-report-2026-05-01",
    "enforcementStatus": "observation_only",
    "notes": "compressed_lane:workload_envelope_review"
  },
  {
    "groupKey": "gpdg:v1:d10:d10-pair:main_skill:true:over_authored_max+over_fatigue_cap",
    "diagnosticFingerprint": "gpdf|v1|none|8|8|8|block_split+policy_allowance+source_backed_content_depth+variant_cap_review|pass/pair_net/beginner/40/matrix-c/block-3/10/10/over_authored_max+over_fatigue_cap|pass/pair_net/beginner/40/matrix-d/block-3/10/10/over_authored_max+over_fatigue_cap|pass/pair_net/intermediate/40/matrix-a/block-3/10/10/over_authored_max+over_fatigue_cap",
    "triageStatus": "observed",
    "triageRoute": "defer",
    "reviewedReportId": "generated-plan-diagnostics-report-2026-05-01",
    "enforcementStatus": "observation_only",
    "notes": "compressed_lane:workload_envelope_review"
  },
  {
    "groupKey": "gpdg:v1:d48:d48-pair-open:technique:true:under_authored_min",
    "diagnosticFingerprint": "gpdf|v1|5|none|none|8|block_split+policy_allowance+source_backed_content_depth+variant_cap_review|set/pair_net/advanced/15/matrix-a/block-1/4/4/under_authored_min|set/pair_net/advanced/15/matrix-b/block-1/4/4/under_authored_min|set/pair_net/advanced/15/matrix-c/block-1/4/4/under_authored_min",
    "triageStatus": "observed",
    "triageRoute": "defer",
    "reviewedReportId": "generated-plan-diagnostics-report-2026-05-01",
    "enforcementStatus": "observation_only",
    "notes": "compressed_lane:technique_under_min_review"
  },
  {
    "groupKey": "gpdg:v1:d51:d51-pair-open:main_skill:true:under_authored_min",
    "diagnosticFingerprint": "gpdf|v1|8|none|none|8|block_split+policy_allowance+source_backed_content_depth+variant_cap_review|serve/pair_open/beginner/15/matrix-b/block-2/5/5/under_authored_min|serve/pair_open/beginner/15/matrix-c/block-2/5/5/under_authored_min|serve/pair_open/beginner/25/matrix-b/block-3/7/7/under_authored_min",
    "triageStatus": "observed",
    "triageRoute": "defer",
    "reviewedReportId": "generated-plan-diagnostics-report-2026-05-01",
    "enforcementStatus": "observation_only",
    "notes": "compressed_lane:workload_envelope_review"
  },
  {
    "groupKey": "gpdg:v1:d33:d33-pair-open:main_skill:true:under_authored_min",
    "diagnosticFingerprint": "gpdf|v1|6|none|none|7|block_split+policy_allowance+source_backed_content_depth+variant_cap_review|serve/pair_net/advanced/15/matrix-a/block-2/5/5/under_authored_min|serve/pair_net/intermediate/15/matrix-b/block-2/5/5/under_authored_min|serve/pair_open/advanced/15/matrix-b/block-2/5/5/under_authored_min",
    "triageStatus": "observed",
    "triageRoute": "defer",
    "reviewedReportId": "generated-plan-diagnostics-report-2026-05-01",
    "enforcementStatus": "observation_only",
    "notes": "compressed_lane:workload_envelope_review"
  },
  {
    "groupKey": "gpdg:v1:d01:d01-solo:pressure:false:over_authored_max+over_fatigue_cap",
    "diagnosticFingerprint": "gpdf|v1|none|5|5|6|block_split+policy_allowance+source_backed_content_depth+variant_cap_review|pass/solo_net/intermediate/40/matrix-b/block-4/7/7/over_authored_max+over_fatigue_cap|pass/solo_net/intermediate/40/matrix-d/block-4/7/7/over_authored_max+over_fatigue_cap|pass/solo_open/intermediate/40/matrix-b/block-4/6/6/over_authored_max+over_fatigue_cap",
    "triageStatus": "observed",
    "triageRoute": "defer",
    "reviewedReportId": "generated-plan-diagnostics-report-2026-05-01",
    "enforcementStatus": "observation_only",
    "notes": "compressed_lane:workload_envelope_review"
  },
  {
    "groupKey": "gpdg:v1:d11:d11-solo:main_skill:true:over_authored_max+over_fatigue_cap",
    "diagnosticFingerprint": "gpdf|v1|none|7|7|6|block_split+policy_allowance+source_backed_content_depth+variant_cap_review|pass/solo_net/intermediate/40/matrix-b/block-3/10/10/over_authored_max+over_fatigue_cap|pass/solo_net/intermediate/40/matrix-d/block-3/10/10/over_authored_max+over_fatigue_cap|pass/solo_open/intermediate/40/matrix-b/block-3/10/10/over_authored_max+over_fatigue_cap",
    "triageStatus": "observed",
    "triageRoute": "defer",
    "reviewedReportId": "generated-plan-diagnostics-report-2026-05-01",
    "enforcementStatus": "observation_only",
    "notes": "compressed_lane:workload_envelope_review"
  },
  {
    "groupKey": "gpdg:v1:d22:d22-pair-open:technique:true:under_authored_min",
    "diagnosticFingerprint": "gpdf|v1|6|none|none|6|block_split+policy_allowance+source_backed_content_depth+variant_cap_review|serve/pair_net/intermediate/15/matrix-c/block-1/4/4/under_authored_min|serve/pair_net/intermediate/15/matrix-d/block-1/4/4/under_authored_min|serve/pair_open/advanced/15/matrix-b/block-1/4/4/under_authored_min",
    "triageStatus": "observed",
    "triageRoute": "defer",
    "reviewedReportId": "generated-plan-diagnostics-report-2026-05-01",
    "enforcementStatus": "observation_only",
    "notes": "compressed_lane:technique_under_min_review"
  },
  {
    "groupKey": "gpdg:v1:d47:d47-solo-open:main_skill:true:over_authored_max+over_fatigue_cap",
    "diagnosticFingerprint": "gpdf|v1|none|9|9|6|block_split+policy_allowance+source_backed_content_depth+variant_cap_review|set/solo_net/intermediate/40/matrix-b/block-3/10/10/over_authored_max+over_fatigue_cap|set/solo_net/intermediate/40/matrix-c/block-3/10/10/over_authored_max+over_fatigue_cap|set/solo_open/intermediate/40/matrix-b/block-3/10/10/over_authored_max+over_fatigue_cap",
    "triageStatus": "observed",
    "triageRoute": "defer",
    "reviewedReportId": "generated-plan-diagnostics-report-2026-05-01",
    "enforcementStatus": "observation_only",
    "notes": "compressed_lane:workload_envelope_review"
  },
  {
    "groupKey": "gpdg:v1:d50:d50-solo-open:main_skill:true:under_authored_min",
    "diagnosticFingerprint": "gpdf|v1|8|none|none|6|block_split+policy_allowance+source_backed_content_depth+variant_cap_review|pass/solo_net/advanced/15/matrix-a/block-2/5/5/under_authored_min|pass/solo_net/advanced/25/matrix-a/block-3/7/7/under_authored_min|pass/solo_open/advanced/15/matrix-a/block-2/5/5/under_authored_min",
    "triageStatus": "observed",
    "triageRoute": "defer",
    "reviewedReportId": "generated-plan-diagnostics-report-2026-05-01",
    "enforcementStatus": "observation_only",
    "notes": "compressed_lane:workload_envelope_review"
  },
  {
    "groupKey": "gpdg:v1:d55:d55-solo-open:main_skill:true:over_authored_max+over_fatigue_cap",
    "diagnosticFingerprint": "gpdf|v1|none|9|9|6|block_split+policy_allowance+source_backed_content_depth+variant_cap_review|serve/solo_net/advanced/40/matrix-a/block-3/10/10/over_authored_max+over_fatigue_cap|serve/solo_net/advanced/40/matrix-d/block-3/10/10/over_authored_max+over_fatigue_cap|serve/solo_open/advanced/40/matrix-d/block-3/10/10/over_authored_max+over_fatigue_cap",
    "triageStatus": "observed",
    "triageRoute": "defer",
    "reviewedReportId": "generated-plan-diagnostics-report-2026-05-01",
    "enforcementStatus": "observation_only",
    "notes": "compressed_lane:workload_envelope_review"
  },
  {
    "groupKey": "gpdg:v1:d22:d22-solo-open:technique:true:under_authored_min",
    "diagnosticFingerprint": "gpdf|v1|6|none|none|5|block_split+policy_allowance+source_backed_content_depth+variant_cap_review|serve/solo_net/intermediate/15/matrix-b/block-1/4/4/under_authored_min|serve/solo_open/advanced/15/matrix-d/block-1/4/4/under_authored_min|serve/solo_open/intermediate/15/matrix-c/block-1/4/4/under_authored_min",
    "triageStatus": "observed",
    "triageRoute": "defer",
    "reviewedReportId": "generated-plan-diagnostics-report-2026-05-01",
    "enforcementStatus": "observation_only",
    "notes": "compressed_lane:technique_under_min_review"
  },
  {
    "groupKey": "gpdg:v1:d22:d22-solo-open:main_skill:true:under_authored_min",
    "diagnosticFingerprint": "gpdf|v1|6|none|none|5|block_split+policy_allowance+source_backed_content_depth+variant_cap_review|serve/solo_net/advanced/15/matrix-b/block-2/5/5/under_authored_min|serve/solo_open/advanced/15/matrix-a/block-2/5/5/under_authored_min|serve/solo_open/advanced/15/matrix-c/block-2/5/5/under_authored_min",
    "triageStatus": "observed",
    "triageRoute": "defer",
    "reviewedReportId": "generated-plan-diagnostics-report-2026-05-01",
    "enforcementStatus": "observation_only",
    "notes": "compressed_lane:workload_envelope_review"
  },
  {
    "groupKey": "gpdg:v1:d33:d33-pair-open:technique:true:under_authored_min",
    "diagnosticFingerprint": "gpdf|v1|6|none|none|5|block_split+policy_allowance+source_backed_content_depth+variant_cap_review|serve/pair_net/advanced/15/matrix-b/block-1/4/4/under_authored_min|serve/pair_net/advanced/15/matrix-d/block-1/4/4/under_authored_min|serve/pair_open/advanced/15/matrix-a/block-1/4/4/under_authored_min",
    "triageStatus": "observed",
    "triageRoute": "defer",
    "reviewedReportId": "generated-plan-diagnostics-report-2026-05-01",
    "enforcementStatus": "observation_only",
    "notes": "compressed_lane:technique_under_min_review"
  },
  {
    "groupKey": "gpdg:v1:d54:d54-pair-open:main_skill:true:over_authored_max+over_fatigue_cap",
    "diagnosticFingerprint": "gpdf|v1|none|8|8|5|block_split+policy_allowance+source_backed_content_depth+variant_cap_review|serve/pair_net/beginner/40/matrix-a/block-3/10/10/over_authored_max+over_fatigue_cap|serve/pair_net/beginner/40/matrix-b/block-3/10/10/over_authored_max+over_fatigue_cap|serve/pair_net/intermediate/40/matrix-c/block-3/10/10/over_authored_max+over_fatigue_cap",
    "triageStatus": "observed",
    "triageRoute": "defer",
    "reviewedReportId": "generated-plan-diagnostics-report-2026-05-01",
    "enforcementStatus": "observation_only",
    "notes": "compressed_lane:workload_envelope_review"
  },
  {
    "groupKey": "gpdg:v1:d54:d54-solo-open:main_skill:true:over_authored_max+over_fatigue_cap",
    "diagnosticFingerprint": "gpdf|v1|none|8|8|5|block_split+policy_allowance+source_backed_content_depth+variant_cap_review|serve/solo_net/intermediate/40/matrix-a/block-3/10/10/over_authored_max+over_fatigue_cap|serve/solo_open/intermediate/40/matrix-b/block-3/10/10/over_authored_max+over_fatigue_cap|serve/solo_open/intermediate/40/matrix-d/block-3/10/10/over_authored_max+over_fatigue_cap",
    "triageStatus": "observed",
    "triageRoute": "defer",
    "reviewedReportId": "generated-plan-diagnostics-report-2026-05-01",
    "enforcementStatus": "observation_only",
    "notes": "compressed_lane:workload_envelope_review"
  },
  {
    "groupKey": "gpdg:v1:d05:d05-pair:main_skill:true:over_authored_max+over_fatigue_cap",
    "diagnosticFingerprint": "gpdf|v1|none|8|8|4|block_split+policy_allowance+source_backed_content_depth+variant_cap_review|pass/pair_net/beginner/40/matrix-a/block-3/10/10/over_authored_max+over_fatigue_cap|pass/pair_net/intermediate/40/matrix-c/block-3/10/10/over_authored_max+over_fatigue_cap|pass/pair_open/beginner/40/matrix-a/block-3/9/9/over_authored_max+over_fatigue_cap",
    "triageStatus": "observed",
    "triageRoute": "defer",
    "reviewedReportId": "generated-plan-diagnostics-report-2026-05-01",
    "enforcementStatus": "observation_only",
    "notes": "compressed_lane:workload_envelope_review"
  },
  {
    "groupKey": "gpdg:v1:d22:d22-solo-open:movement_proxy:false:under_authored_min",
    "diagnosticFingerprint": "gpdf|v1|6|none|none|4|block_split+policy_allowance+source_backed_content_depth+variant_cap_review|serve/solo_open/advanced/25/matrix-b/block-2/5/5/under_authored_min|serve/solo_open/intermediate/25/matrix-d/block-2/5/5/under_authored_min|serve/solo_wall/advanced/25/matrix-b/block-2/5/5/under_authored_min",
    "triageStatus": "observed",
    "triageRoute": "defer",
    "reviewedReportId": "generated-plan-diagnostics-report-2026-05-01",
    "enforcementStatus": "observation_only",
    "notes": "compressed_lane:workload_envelope_review"
  },
  {
    "groupKey": "gpdg:v1:d33:d33-pair-open:movement_proxy:false:under_authored_min",
    "diagnosticFingerprint": "gpdf|v1|6|none|none|4|block_split+policy_allowance+source_backed_content_depth+variant_cap_review|serve/pair_open/beginner/25/matrix-a/block-2/5/5/under_authored_min|serve/pair_open/beginner/25/matrix-c/block-2/5/5/under_authored_min|serve/pair_open/intermediate/25/matrix-a/block-2/5/5/under_authored_min",
    "triageStatus": "observed",
    "triageRoute": "defer",
    "reviewedReportId": "generated-plan-diagnostics-report-2026-05-01",
    "enforcementStatus": "observation_only",
    "notes": "compressed_lane:workload_envelope_review"
  },
  {
    "groupKey": "gpdg:v1:d39:d39-pair:main_skill:true:over_authored_max+over_fatigue_cap",
    "diagnosticFingerprint": "gpdf|v1|none|8|8|4|block_split+policy_allowance+source_backed_content_depth+variant_cap_review|set/pair_net/beginner/40/matrix-b/block-3/10/10/over_authored_max+over_fatigue_cap|set/pair_net/intermediate/40/matrix-d/block-3/10/10/over_authored_max+over_fatigue_cap|set/pair_open/beginner/40/matrix-b/block-3/9/9/over_authored_max+over_fatigue_cap",
    "triageStatus": "observed",
    "triageRoute": "defer",
    "reviewedReportId": "generated-plan-diagnostics-report-2026-05-01",
    "enforcementStatus": "observation_only",
    "notes": "compressed_lane:workload_envelope_review"
  },
  {
    "groupKey": "gpdg:v1:d49:d49-pair-open:main_skill:true:under_authored_min",
    "diagnosticFingerprint": "gpdf|v1|8|none|none|4|block_split+policy_allowance+source_backed_content_depth+variant_cap_review|set/pair_net/advanced/15/matrix-a/block-2/5/5/under_authored_min|set/pair_net/advanced/25/matrix-a/block-3/7/7/under_authored_min|set/pair_open/advanced/15/matrix-a/block-2/5/5/under_authored_min",
    "triageStatus": "observed",
    "triageRoute": "defer",
    "reviewedReportId": "generated-plan-diagnostics-report-2026-05-01",
    "enforcementStatus": "observation_only",
    "notes": "compressed_lane:workload_envelope_review"
  },
  {
    "groupKey": "gpdg:v1:d52:d52-pair:main_skill:true:over_authored_max+over_fatigue_cap",
    "diagnosticFingerprint": "gpdf|v1|none|6|6|4|block_split+policy_allowance+source_backed_content_depth+variant_cap_review|pass/pair_net/intermediate/25/matrix-d/block-3/7/7/over_authored_max+over_fatigue_cap|pass/pair_net/intermediate/40/matrix-d/block-3/10/10/over_authored_max+over_fatigue_cap|pass/pair_open/intermediate/25/matrix-d/block-3/7/7/over_authored_max+over_fatigue_cap",
    "triageStatus": "observed",
    "triageRoute": "defer",
    "reviewedReportId": "generated-plan-diagnostics-report-2026-05-01",
    "enforcementStatus": "observation_only",
    "notes": "compressed_lane:workload_envelope_review"
  },
  {
    "groupKey": "gpdg:v1:d53:d53-solo-open:main_skill:true:over_authored_max+over_fatigue_cap",
    "diagnosticFingerprint": "gpdf|v1|none|8|8|4|block_split+policy_allowance+source_backed_content_depth+variant_cap_review|serve/solo_net/beginner/40/matrix-b/block-3/10/10/over_authored_max+over_fatigue_cap|serve/solo_net/beginner/40/matrix-d/block-3/10/10/over_authored_max+over_fatigue_cap|serve/solo_open/beginner/40/matrix-d/block-3/10/10/over_authored_max+over_fatigue_cap",
    "triageStatus": "observed",
    "triageRoute": "defer",
    "reviewedReportId": "generated-plan-diagnostics-report-2026-05-01",
    "enforcementStatus": "observation_only",
    "notes": "compressed_lane:workload_envelope_review"
  },
  {
    "groupKey": "gpdg:v1:d55:d55-solo-open:technique:true:under_authored_min",
    "diagnosticFingerprint": "gpdf|v1|5|none|none|4|block_split+policy_allowance+source_backed_content_depth+variant_cap_review|serve/solo_open/advanced/15/matrix-b/block-1/4/4/under_authored_min|serve/solo_open/advanced/15/matrix-c/block-1/4/4/under_authored_min|serve/solo_wall/advanced/15/matrix-b/block-1/4/4/under_authored_min",
    "triageStatus": "observed",
    "triageRoute": "defer",
    "reviewedReportId": "generated-plan-diagnostics-report-2026-05-01",
    "enforcementStatus": "observation_only",
    "notes": "compressed_lane:technique_under_min_review"
  },
  {
    "groupKey": "gpdg:v1:d22:d22-pair-open:main_skill:true:under_authored_min",
    "diagnosticFingerprint": "gpdf|v1|6|none|none|3|block_split+policy_allowance+source_backed_content_depth+variant_cap_review|serve/pair_net/advanced/15/matrix-b/block-2/5/5/under_authored_min|serve/pair_net/advanced/15/matrix-d/block-2/5/5/under_authored_min|serve/pair_open/advanced/15/matrix-a/block-2/5/5/under_authored_min",
    "triageStatus": "observed",
    "triageRoute": "defer",
    "reviewedReportId": "generated-plan-diagnostics-report-2026-05-01",
    "enforcementStatus": "observation_only",
    "notes": "compressed_lane:workload_envelope_review"
  },
  {
    "groupKey": "gpdg:v1:d33:d33-pair:technique:true:under_authored_min",
    "diagnosticFingerprint": "gpdf|v1|6|none|none|3|block_split+policy_allowance+source_backed_content_depth+variant_cap_review|serve/pair_net/beginner/15/matrix-b/block-1/4/4/under_authored_min|serve/pair_net/beginner/15/matrix-d/block-1/4/4/under_authored_min|serve/pair_net/intermediate/15/matrix-a/block-1/4/4/under_authored_min",
    "triageStatus": "observed",
    "triageRoute": "defer",
    "reviewedReportId": "generated-plan-diagnostics-report-2026-05-01",
    "enforcementStatus": "observation_only",
    "notes": "compressed_lane:technique_under_min_review"
  },
  {
    "groupKey": "gpdg:v1:d33:d33-solo-net:technique:true:under_authored_min",
    "diagnosticFingerprint": "gpdf|v1|6|none|none|3|block_split+policy_allowance+source_backed_content_depth+variant_cap_review|serve/solo_net/beginner/15/matrix-a/block-1/4/4/under_authored_min|serve/solo_net/beginner/15/matrix-b/block-1/4/4/under_authored_min|serve/solo_net/beginner/15/matrix-d/block-1/4/4/under_authored_min",
    "triageStatus": "observed",
    "triageRoute": "defer",
    "reviewedReportId": "generated-plan-diagnostics-report-2026-05-01",
    "enforcementStatus": "observation_only",
    "notes": "compressed_lane:technique_under_min_review"
  },
  {
    "groupKey": "gpdg:v1:d33:d33-solo-open:main_skill:true:under_authored_min",
    "diagnosticFingerprint": "gpdf|v1|6|none|none|3|block_split+policy_allowance+source_backed_content_depth+variant_cap_review|serve/solo_net/advanced/15/matrix-c/block-2/5/5/under_authored_min|serve/solo_open/advanced/15/matrix-b/block-2/5/5/under_authored_min|serve/solo_wall/advanced/15/matrix-b/block-2/5/5/under_authored_min",
    "triageStatus": "observed",
    "triageRoute": "defer",
    "reviewedReportId": "generated-plan-diagnostics-report-2026-05-01",
    "enforcementStatus": "observation_only",
    "notes": "compressed_lane:workload_envelope_review"
  },
  {
    "groupKey": "gpdg:v1:d38:d38-solo:technique:true:under_authored_min",
    "diagnosticFingerprint": "gpdf|v1|5|none|none|3|block_split+policy_allowance+source_backed_content_depth+variant_cap_review|set/solo_net/intermediate/15/matrix-c/block-1/4/4/under_authored_min|set/solo_open/intermediate/15/matrix-c/block-1/4/4/under_authored_min|set/solo_wall/intermediate/15/matrix-c/block-1/4/4/under_authored_min",
    "triageStatus": "observed",
    "triageRoute": "defer",
    "reviewedReportId": "generated-plan-diagnostics-report-2026-05-01",
    "enforcementStatus": "observation_only",
    "notes": "compressed_lane:technique_under_min_review"
  },
  {
    "groupKey": "gpdg:v1:d57:d57-solo:main_skill:true:over_authored_max+over_fatigue_cap",
    "diagnosticFingerprint": "gpdf|v1|none|8|8|3|block_split+policy_allowance+source_backed_content_depth+variant_cap_review|set/solo_net/intermediate/40/matrix-a/block-3/10/10/over_authored_max+over_fatigue_cap|set/solo_open/intermediate/40/matrix-a/block-3/10/10/over_authored_max+over_fatigue_cap|set/solo_wall/intermediate/40/matrix-a/block-3/10/10/over_authored_max+over_fatigue_cap",
    "triageStatus": "observed",
    "triageRoute": "defer",
    "reviewedReportId": "generated-plan-diagnostics-report-2026-05-01",
    "enforcementStatus": "observation_only",
    "notes": "compressed_lane:workload_envelope_review"
  },
  {
    "groupKey": "gpdg:v1:d58:d58-pair:main_skill:true:over_authored_max+over_fatigue_cap",
    "diagnosticFingerprint": "gpdf|v1|none|9|9|3|block_split+policy_allowance+source_backed_content_depth+variant_cap_review|set/pair_net/advanced/40/matrix-b/block-3/10/10/over_authored_max+over_fatigue_cap|set/pair_net/advanced/40/matrix-d/block-3/10/10/over_authored_max+over_fatigue_cap|set/pair_net/intermediate/40/matrix-c/block-3/10/10/over_authored_max+over_fatigue_cap",
    "triageStatus": "observed",
    "triageRoute": "defer",
    "reviewedReportId": "generated-plan-diagnostics-report-2026-05-01",
    "enforcementStatus": "observation_only",
    "notes": "compressed_lane:workload_envelope_review"
  },
  {
    "groupKey": "gpdg:v1:d03:d03-pair:main_skill:true:over_authored_max+over_fatigue_cap",
    "diagnosticFingerprint": "gpdf|v1|none|8|8|2|block_split+policy_allowance+source_backed_content_depth+variant_cap_review|pass/pair_net/beginner/40/matrix-b/block-3/10/10/over_authored_max+over_fatigue_cap|pass/pair_open/beginner/40/matrix-b/block-3/9/9/over_authored_max+over_fatigue_cap",
    "triageStatus": "observed",
    "triageRoute": "defer",
    "reviewedReportId": "generated-plan-diagnostics-report-2026-05-01",
    "enforcementStatus": "observation_only",
    "notes": "compressed_lane:low_volume_watchlist"
  },
  {
    "groupKey": "gpdg:v1:d22:d22-pair:movement_proxy:false:under_authored_min",
    "diagnosticFingerprint": "gpdf|v1|6|none|none|2|block_split+policy_allowance+source_backed_content_depth+variant_cap_review|serve/pair_net/advanced/25/matrix-a/block-2/5/5/under_authored_min|serve/pair_net/intermediate/25/matrix-a/block-2/5/5/under_authored_min",
    "triageStatus": "observed",
    "triageRoute": "defer",
    "reviewedReportId": "generated-plan-diagnostics-report-2026-05-01",
    "enforcementStatus": "observation_only",
    "notes": "compressed_lane:low_volume_watchlist"
  },
  {
    "groupKey": "gpdg:v1:d22:d22-pair-open:movement_proxy:false:under_authored_min",
    "diagnosticFingerprint": "gpdf|v1|6|none|none|2|block_split+policy_allowance+source_backed_content_depth+variant_cap_review|serve/pair_open/intermediate/25/matrix-b/block-2/5/5/under_authored_min|serve/pair_open/intermediate/25/matrix-d/block-2/5/5/under_authored_min",
    "triageStatus": "observed",
    "triageRoute": "defer",
    "reviewedReportId": "generated-plan-diagnostics-report-2026-05-01",
    "enforcementStatus": "observation_only",
    "notes": "compressed_lane:low_volume_watchlist"
  },
  {
    "groupKey": "gpdg:v1:d22:d22-solo:technique:true:under_authored_min",
    "diagnosticFingerprint": "gpdf|v1|6|none|none|2|block_split+policy_allowance+source_backed_content_depth+variant_cap_review|serve/solo_net/advanced/15/matrix-c/block-1/4/4/under_authored_min|serve/solo_net/intermediate/15/matrix-c/block-1/4/4/under_authored_min",
    "triageStatus": "observed",
    "triageRoute": "defer",
    "reviewedReportId": "generated-plan-diagnostics-report-2026-05-01",
    "enforcementStatus": "observation_only",
    "notes": "compressed_lane:technique_under_min_review"
  },
  {
    "groupKey": "gpdg:v1:d22:d22-solo:movement_proxy:false:under_authored_min",
    "diagnosticFingerprint": "gpdf|v1|6|none|none|2|block_split+policy_allowance+source_backed_content_depth+variant_cap_review|serve/solo_net/advanced/25/matrix-a/block-2/5/5/under_authored_min|serve/solo_net/advanced/25/matrix-d/block-2/5/5/under_authored_min",
    "triageStatus": "observed",
    "triageRoute": "defer",
    "reviewedReportId": "generated-plan-diagnostics-report-2026-05-01",
    "enforcementStatus": "observation_only",
    "notes": "compressed_lane:low_volume_watchlist"
  },
  {
    "groupKey": "gpdg:v1:d33:d33-pair:main_skill:true:under_authored_min",
    "diagnosticFingerprint": "gpdf|v1|6|none|none|2|block_split+policy_allowance+source_backed_content_depth+variant_cap_review|serve/pair_net/advanced/15/matrix-c/block-2/5/5/under_authored_min|serve/pair_net/intermediate/15/matrix-d/block-2/5/5/under_authored_min",
    "triageStatus": "observed",
    "triageRoute": "defer",
    "reviewedReportId": "generated-plan-diagnostics-report-2026-05-01",
    "enforcementStatus": "observation_only",
    "notes": "compressed_lane:low_volume_watchlist"
  },
  {
    "groupKey": "gpdg:v1:d41:d41-pair:main_skill:true:over_authored_max+over_fatigue_cap",
    "diagnosticFingerprint": "gpdf|v1|none|8|8|2|block_split+policy_allowance+source_backed_content_depth+variant_cap_review|set/pair_net/beginner/40/matrix-c/block-3/10/10/over_authored_max+over_fatigue_cap|set/pair_open/beginner/40/matrix-c/block-3/9/9/over_authored_max+over_fatigue_cap",
    "triageStatus": "observed",
    "triageRoute": "defer",
    "reviewedReportId": "generated-plan-diagnostics-report-2026-05-01",
    "enforcementStatus": "observation_only",
    "notes": "compressed_lane:low_volume_watchlist"
  },
  {
    "groupKey": "gpdg:v1:d51:d51-pair:main_skill:true:under_authored_min",
    "diagnosticFingerprint": "gpdf|v1|8|none|none|2|block_split+policy_allowance+source_backed_content_depth+variant_cap_review|serve/pair_net/intermediate/15/matrix-a/block-2/5/5/under_authored_min|serve/pair_net/intermediate/25/matrix-a/block-3/7/7/under_authored_min",
    "triageStatus": "observed",
    "triageRoute": "defer",
    "reviewedReportId": "generated-plan-diagnostics-report-2026-05-01",
    "enforcementStatus": "observation_only",
    "notes": "compressed_lane:low_volume_watchlist"
  },
  {
    "groupKey": "gpdg:v1:d53:d53-pair-open:main_skill:true:over_authored_max+over_fatigue_cap",
    "diagnosticFingerprint": "gpdf|v1|none|8|8|2|block_split+policy_allowance+source_backed_content_depth+variant_cap_review|serve/pair_net/beginner/40/matrix-c/block-3/10/10/over_authored_max+over_fatigue_cap|serve/pair_net/beginner/40/matrix-d/block-3/10/10/over_authored_max+over_fatigue_cap",
    "triageStatus": "observed",
    "triageRoute": "defer",
    "reviewedReportId": "generated-plan-diagnostics-report-2026-05-01",
    "enforcementStatus": "observation_only",
    "notes": "compressed_lane:low_volume_watchlist"
  },
  {
    "groupKey": "gpdg:v1:d56:d56-solo:technique:true:over_authored_max+over_fatigue_cap",
    "diagnosticFingerprint": "gpdf|v1|none|7|7|2|block_split+policy_allowance+source_backed_content_depth+variant_cap_review|set/solo_open/beginner/40/matrix-c/block-1/8/8/over_authored_max+over_fatigue_cap|set/solo_open/intermediate/40/matrix-a/block-1/8/8/over_authored_max+over_fatigue_cap",
    "triageStatus": "observed",
    "triageRoute": "defer",
    "reviewedReportId": "generated-plan-diagnostics-report-2026-05-01",
    "enforcementStatus": "observation_only",
    "notes": "compressed_lane:low_volume_watchlist"
  },
  {
    "groupKey": "gpdg:v1:d01:d01-pair:technique:true:over_authored_max+over_fatigue_cap",
    "diagnosticFingerprint": "gpdf|v1|none|6|6|1|block_split+policy_allowance+source_backed_content_depth+variant_cap_review|pass/pair_open/beginner/40/matrix-c/block-1/8/8/over_authored_max+over_fatigue_cap",
    "triageStatus": "observed",
    "triageRoute": "defer",
    "reviewedReportId": "generated-plan-diagnostics-report-2026-05-01",
    "enforcementStatus": "observation_only",
    "notes": "compressed_lane:low_volume_watchlist"
  },
  {
    "groupKey": "gpdg:v1:d11:d11-pair:technique:true:over_authored_max+over_fatigue_cap",
    "diagnosticFingerprint": "gpdf|v1|none|7|7|1|block_split+policy_allowance+source_backed_content_depth+variant_cap_review|pass/pair_open/intermediate/40/matrix-b/block-1/8/8/over_authored_max+over_fatigue_cap",
    "triageStatus": "observed",
    "triageRoute": "defer",
    "reviewedReportId": "generated-plan-diagnostics-report-2026-05-01",
    "enforcementStatus": "observation_only",
    "notes": "compressed_lane:low_volume_watchlist"
  },
  {
    "groupKey": "gpdg:v1:d22:d22-pair:technique:true:under_authored_min",
    "diagnosticFingerprint": "gpdf|v1|6|none|none|1|block_split+policy_allowance+source_backed_content_depth+variant_cap_review|serve/pair_net/advanced/15/matrix-c/block-1/4/4/under_authored_min",
    "triageStatus": "observed",
    "triageRoute": "defer",
    "reviewedReportId": "generated-plan-diagnostics-report-2026-05-01",
    "enforcementStatus": "observation_only",
    "notes": "compressed_lane:technique_under_min_review"
  },
  {
    "groupKey": "gpdg:v1:d22:d22-solo:main_skill:true:under_authored_min",
    "diagnosticFingerprint": "gpdf|v1|6|none|none|1|block_split+policy_allowance+source_backed_content_depth+variant_cap_review|serve/solo_net/intermediate/15/matrix-d/block-2/5/5/under_authored_min",
    "triageStatus": "observed",
    "triageRoute": "defer",
    "reviewedReportId": "generated-plan-diagnostics-report-2026-05-01",
    "enforcementStatus": "observation_only",
    "notes": "compressed_lane:low_volume_watchlist"
  },
  {
    "groupKey": "gpdg:v1:d33:d33-solo-net:main_skill:true:under_authored_min",
    "diagnosticFingerprint": "gpdf|v1|6|none|none|1|block_split+policy_allowance+source_backed_content_depth+variant_cap_review|serve/solo_net/beginner/15/matrix-c/block-2/5/5/under_authored_min",
    "triageStatus": "observed",
    "triageRoute": "defer",
    "reviewedReportId": "generated-plan-diagnostics-report-2026-05-01",
    "enforcementStatus": "observation_only",
    "notes": "compressed_lane:low_volume_watchlist"
  },
  {
    "groupKey": "gpdg:v1:d52:d52-pair:technique:true:over_authored_max+over_fatigue_cap",
    "diagnosticFingerprint": "gpdf|v1|none|6|6|1|block_split+policy_allowance+source_backed_content_depth+variant_cap_review|pass/pair_open/beginner/40/matrix-a/block-1/8/8/over_authored_max+over_fatigue_cap",
    "triageStatus": "observed",
    "triageRoute": "defer",
    "reviewedReportId": "generated-plan-diagnostics-report-2026-05-01",
    "enforcementStatus": "observation_only",
    "notes": "compressed_lane:low_volume_watchlist"
  },
  {
    "groupKey": "gpdg:v1:d55:d55-pair:technique:true:under_authored_min",
    "diagnosticFingerprint": "gpdf|v1|5|none|none|1|block_split+policy_allowance+source_backed_content_depth+variant_cap_review|serve/pair_net/advanced/15/matrix-a/block-1/4/4/under_authored_min",
    "triageStatus": "observed",
    "triageRoute": "defer",
    "reviewedReportId": "generated-plan-diagnostics-report-2026-05-01",
    "enforcementStatus": "observation_only",
    "notes": "compressed_lane:technique_under_min_review"
  },
  {
    "groupKey": "gpdg:v1:d57:d57-pair:main_skill:true:over_authored_max+over_fatigue_cap",
    "diagnosticFingerprint": "gpdf|v1|none|9|9|1|block_split+policy_allowance+source_backed_content_depth+variant_cap_review|set/pair_net/intermediate/40/matrix-a/block-3/10/10/over_authored_max+over_fatigue_cap",
    "triageStatus": "observed",
    "triageRoute": "defer",
    "reviewedReportId": "generated-plan-diagnostics-report-2026-05-01",
    "enforcementStatus": "observation_only",
    "notes": "compressed_lane:low_volume_watchlist"
  }
]
```
<!-- diagnostic-triage-registry:end -->
