---
id: generated-plan-diagnostics-next-steps-ideation-2026-05-01
title: "Ideation: generated-plan diagnostics next steps"
status: active
stage: validation
type: ideation
summary: "Ranked ideation for turning generated-plan diagnostic observations into a sequenced catalog, generator, and test-gating workflow."
authority: "Ideation only; identifies promising next-step directions after the generated-plan diagnostics report without authorizing catalog changes."
last_updated: 2026-05-01
depends_on:
  - docs/reviews/2026-05-01-generated-plan-diagnostics-report.md
  - docs/reviews/2026-04-30-focus-coverage-gap-cards.md
  - docs/plans/2026-05-01-001-feat-generated-plan-diagnostics-plan.md
  - docs/brainstorms/2026-04-30-focus-coverage-catalog-readiness-requirements.md
---

# Ideation: Generated-Plan Diagnostics Next Steps

## Grounding Context

The generated-plan diagnostics report covers 540 seeded cells across the current supported Tune today surface: Passing, Serving, Setting; five setup configurations; beginner/intermediate/advanced levels; 15/25/40-minute profiles; and four deterministic seeds.

Current snapshot:

- Clean cells: 119
- Observation-only cells: 421
- Hard-failure cells: 0
- Routeable observation groups: 53

The strongest current groups are duration-envelope signals, not automatic content-change orders:

- `d25-solo` wrap under-authored-min pressure.
- `d47`, `d33`, and `d46` over-authored-max / over-fatigue-cap pressure, often tied to optional slot redistribution.

Repo constraints:

- Hard failures block readiness.
- Classified observations route to product/content policy.
- Catalog activation still requires source-backed gap cards, affected IDs, adaptation deltas, cap delta, verification commands, and checkpoint criteria.
- Future mixed-focus themes should use explicit theme contracts, not raw multi-select OR filtering.

External grounding:

- Exercise programming treats duration as one part of FITT-VP, so duration pressure may mean content, cap metadata, block shape, or progression intent is wrong.
- Recommender systems use catalog coverage and diversity metrics to distinguish inventory gaps from ranking/generation behavior.
- Volleyball practice templates often use natural longer chunks; not every over-cap block is inherently bad.

## Ranked Ideas

### 1. Observation Triage Workbench

**Description:** Turn the 53 routeable observation groups into a durable decision queue. Each group gets a status, route, affected cells, likely fix path, and next evidence needed.

**Rationale:** This directly answers "what do we do with this report?" without prematurely adding drills. It converts the report from a static snapshot into an operational catalog/generator triage surface.

**Downsides:** Adds a new maintenance surface. It must stay generated or lightly curated so it does not become stale.

**Confidence:** 92%

**Complexity:** Medium

**Status:** Explored

### 2. Finding Graduation Ladder

**Description:** Define how observations move from `observed` to `routed` to `allowed`, `cap_review`, `block_split`, `source_depth`, or `hard_fail_candidate`.

**Rationale:** It gives the team a way to make findings fail tests only after product policy has decided they should fail. This avoids turning 421 current observations into noisy red tests while still preventing indefinite drift.

**Downsides:** Requires discipline to keep dispositions current.

**Confidence:** 88%

**Complexity:** Low / Medium

**Status:** Unexplored

### 3. Dynamic Surface / New Focus Sentinel

**Description:** Add a diagnostic preflight for newly registered visible focuses, configurations, durations, skill levels, or future theme contracts. New surfaces must generate cells, fail closed, or declare explicit `not_applicable` reasons.

**Rationale:** This addresses the user's ideal state: new parameters should be picked up automatically and fail if the catalog is insufficient.

**Downsides:** Synthetic new-focus tests can become artificial if they do not reflect a real product-supported focus.

**Confidence:** 86%

**Complexity:** Medium

**Status:** Unexplored

### 4. Catalog Change Impact Preview

**Description:** Add a dry-run helper that shows how a proposed drill, variant, cap, or tag change affects readiness cells and generated-plan diagnostics.

**Rationale:** Future catalog changes become reviewable as measured quality deltas rather than subjective "this seems like a useful drill."

**Downsides:** More tooling. It may not pay off until the catalog changes frequently.

**Confidence:** 80%

**Complexity:** Medium / High

**Status:** Unexplored

### 5. Workload Envelope Authoring Guide

**Description:** Create rules for choosing `durationMinMinutes`, `durationMaxMinutes`, and `fatigueCap.maxMinutes` by drill intent, block type, level, setup, and session length.

**Rationale:** Many current observations may be cap metadata issues rather than missing drills. A guide lowers future catalog drift.

**Downsides:** Some duration decisions need real dogfood/coaching judgment, not just static rules.

**Confidence:** 78%

**Complexity:** Low

**Status:** Unexplored

### 6. Redistribution-Free Builder Comparison

**Description:** Add a diagnostic-only mode that compares current optional-slot redistribution against a no-redistribution or split-redistribution strategy.

**Rationale:** It separates "we need more drills" from "the generator is dumping skipped optional minutes into one block."

**Downsides:** It can turn into generator-policy work quickly. Keep it diagnostic-only until a policy decision is made.

**Confidence:** 74%

**Complexity:** Medium

**Status:** Unexplored

## Rejection Summary

| # | Idea | Reason Rejected |
|---|------|-----------------|
| 1 | Add drills directly from top groups | Too blunt; observations need route decisions and source-backed gap cards first. |
| 2 | Thousand-drill synthetic catalog | Interesting but too expensive and artificial for the current stage. |
| 3 | Fully manual coaching editor | Useful later, but too much UI/product surface before the triage workflow exists. |
| 4 | Standalone heatmap | Folded into the stronger Observation Triage Workbench idea. |
| 5 | Everything fails until classified | Too disruptive for 421 current observations; better as a graduation ladder. |

## Recommended Sequence

1. Build the Observation Triage Workbench.
2. Add the Finding Graduation Ladder.
3. Add the Dynamic Surface / New Focus Sentinel.
4. Add Catalog Change Impact Preview.
5. Write the Workload Envelope Authoring Guide.
6. Explore Redistribution-Free Builder Comparison.

## Continuation: Post-Triage Workflow Selection

Later on 2026-05-01, the branch state changed: the triage workflow foundation from `docs/plans/2026-05-01-002-feat-generated-diagnostics-triage-workflow-plan.md` now has U1-U3 implemented.

Updated snapshot:

- U1 stable diagnostic triage identity: complete.
- U2 triage registry and workbench output: complete.
- U3 freshness and graduation gates: complete.
- Current triage workbench: 53 registry entries, 0 blockers, 0 warnings, 32 `defer` groups, and 21 `generator_policy_investigation` groups.
- Newly selected next plan unit: U4 decision-debt compression review.
- Remaining follow-up units after compression: U5 dynamic surface/new focus sentinel, U6 catalog change impact preview, U7 workload envelope guide, and U8 redistribution comparison diagnostic.

### Selected Handoff: Decision-Debt Compression Review

**Description:** Group the 32 deferred entries and 21 generator-policy investigations into a smaller set of human-sized decision prompts before any catalog or generator work.

**Rationale:** U1-U3 made observations durable and fail-closed for future drift, but the current workbench still leaves the maintainer with 53 row-level decisions. Compressing those rows by decision type can reveal whether the next meaningful action is human policy review, U5 sentinel work, U7 authoring guidance, or U8 redistribution evidence.

**Downsides:** This is mostly workflow/doc value unless it feeds back into the plan. Avoid turning it into a new UI surface or a broad decision framework.

**Confidence:** 90%

**Complexity:** Low / Medium

**Status:** Explored

### Updated Sequence Hypothesis

1. Close out and verify the completed U1-U3 slice.
2. Add U4 decision-debt compression before starting the remaining U5-U8 follow-ups.
3. Use that pass to decide whether the next implementation unit should be U5 dynamic surface sentinel, U8 redistribution comparison, or U7 workload envelope guidance.
4. Defer U6 catalog impact preview until a concrete gap card, cap edit, or candidate catalog change exists.

