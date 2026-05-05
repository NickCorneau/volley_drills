---
id: generated-plan-diagnostics-next-steps-requirements-2026-05-01
title: "Generated-Plan Diagnostics Next Steps Requirements"
status: active
stage: validation
type: requirements
summary: "Requirements for taking generated-plan diagnostic findings one by one through triage, policy decisions, dynamic surface gates, catalog impact previews, workload metadata guidance, and generator-policy experiments."
authority: "Product requirements for the next workflow layer after generated-plan diagnostics; does not authorize direct catalog activation without source-backed gap cards."
last_updated: 2026-05-01
depends_on:
  - docs/ideation/2026-05-01-generated-plan-diagnostics-next-steps-ideation.md
  - docs/reviews/2026-05-01-generated-plan-diagnostics-report.md
  - docs/reviews/2026-04-30-focus-coverage-gap-cards.md
  - docs/brainstorms/2026-04-30-focus-coverage-catalog-readiness-requirements.md
---

# Generated-Plan Diagnostics Next Steps Requirements

## Purpose

Turn the generated-plan diagnostics report into a durable, sequenced workflow for deciding what to do next: accept a finding, review cap metadata, split a block, add source-backed content, or promote a pattern into a failing gate.

This document captures the whole program so the ideas can be taken one by one without losing the bigger shape.

## Problem

The diagnostics report now exposes 53 routeable observation groups and 421 observation-only cells. That is useful, but not yet operational.

Without a next workflow:

- observations can sit in a report without decisions
- agents may overreact by adding drills too early
- cap metadata and generator behavior can be mistaken for content gaps
- future focuses/themes may appear supported before generated sessions are truly ready
- tests can either be too weak (only hard failures fail) or too noisy (all observations fail)

## Product Posture

Diagnostics are evidence, not automatic policy.

- Hard failures block readiness.
- Classified observations require a route decision.
- Catalog/content additions require source-backed gap cards and activation manifests.
- Generator policy changes require explicit acceptance criteria.
- New visible surfaces must fail closed unless support is proven or explicitly marked not applicable.

## Actors

- **Founder / maintainer:** decides whether a diagnostic group is acceptable, needs cap review, needs block splitting, or needs content.
- **Agent:** runs diagnostics, keeps report artifacts fresh, proposes route classifications, and verifies no untriaged findings appear.
- **Future catalog author:** uses route decisions and workload guidance before changing drills or variants.

## Requirements

### R1. Observation Triage Workbench

The system should expose routeable observation groups as a decision queue.

Each group should include:

- stable group key
- drill and variant IDs
- block type and required flag
- observation codes
- affected cell count
- example affected cells
- current likely fix paths
- triage status
- chosen route: `policy_allowance`, `variant_cap_review`, `block_split`, `source_backed_content_depth`, or `defer`
- rationale
- owner/status fields suitable for docs-first work

Acceptance examples:

- AE1: `d25-solo` under-authored wrap appears as a triage item, not as an immediate drill-add request.
- AE2: A main-skill over-cap group with redistribution evidence can be routed to generator/block-split investigation instead of content depth.
- AE3: A route requiring content depth cannot be marked resolved without linking to a gap card or source-backed activation path.

### R2. Finding Graduation Ladder

The workflow should define how findings become stricter over time.

Suggested ladder:

1. `observed`
2. `routed`
3. `accepted_policy`
4. `cap_review_needed`
5. `block_split_needed`
6. `source_depth_needed`
7. `hard_fail_candidate`
8. `hard_fail_enforced`

Acceptance examples:

- AE4: Existing known observation groups do not fail tests merely because they exist.
- AE5: A newly generated untriaged group fails a triage freshness test.
- AE6: A group promoted to `hard_fail_enforced` fails diagnostics until fixed.

### R3. Dynamic Surface / New Focus Sentinel

The supported diagnostic surface should expand when product-supported dimensions expand.

The sentinel should cover:

- new visible focuses
- new fixed durations
- new player levels
- new setup configurations
- future curated theme contracts

Acceptance examples:

- AE7: Adding a synthetic visible focus to the supported surface creates generated diagnostic cells.
- AE8: If the catalog cannot generate required drafts for that surface, diagnostics fail closed.
- AE9: A product-deferred focus can be excluded only through explicit `not_applicable` entries with reasons.

### R4. Catalog Change Impact Preview

The workflow should make future catalog edits measurable before activation.

For a proposed drill/variant/cap/tag change, the preview should show:

- readiness audit deltas
- generated-plan diagnostic deltas
- new/removed hard failures
- changed observation counts
- changed top routeable groups

Acceptance examples:

- AE10: A cap edit on a top observed variant shows whether it reduces `over_authored_max` without creating `under_authored_min`.
- AE11: A new source-backed variant shows which cells it affects before activation.

### R5. Workload Envelope Authoring Guide

The catalog should have guidance for duration metadata.

The guide should help authors choose:

- `durationMinMinutes`
- `durationMaxMinutes`
- `fatigueCap.maxMinutes`
- when caps should vary by setup or level
- when long rounds are acceptable
- when a block should be split instead of capped higher

Acceptance examples:

- AE12: Under-min wrap findings can be evaluated against a written rule for short-session cooldown minimums.
- AE13: Main-skill over-fatigue findings can be evaluated against an explicit fatigue-cap policy.

### R6. Redistribution-Free Builder Comparison

Before changing runtime generation policy, the system should support a diagnostic-only comparison of current redistribution against alternative strategies.

Possible comparison modes:

- current behavior
- no redistribution
- split redistribution across eligible blocks
- cap-aware redistribution

Acceptance examples:

- AE14: A report can show whether optional-slot redistribution is the main cause of a top over-cap group.
- AE15: Diagnostic comparison does not change the shipped `buildDraft()` behavior.

## Scope Boundaries

In scope:

- docs-first triage workflow
- diagnostic helper/report extensions
- tests that fail on untriaged new groups or unsupported new surfaces
- gap-card routing improvements
- workload metadata guidance

Out of scope for the first slice:

- adding new drills directly from the report
- changing runtime generation policy
- shipping mixed-focus themes
- building a full UI editor
- making all existing observations fail tests

## First Slice Recommendation

Start with R1 and R2 together:

1. Create the observation triage registry/workbench.
2. Assign existing top groups an explicit initial route.
3. Add a test that fails when a new routeable group appears without a triage entry.
4. Keep hard failures as hard failures.
5. Keep current classified observations non-blocking unless promoted.

This creates the decision layer needed before catalog or generator changes.

## Open Questions

- O1: Should triage live as a generated Markdown section, a JSON registry, or both?
- O2: What is the minimum route information needed before a group counts as triaged?
- O3: Should route decisions be stable by exact group key, or by a higher-level drill/variant/block/cap pattern?
- O4: Which existing top groups should be accepted as policy allowances versus active follow-up?
- O5: Should the new-focus sentinel use synthetic fixtures or only product-declared candidate focuses/themes?

## Handoff

Use this document to plan one slice at a time. The first implementation plan should target only R1/R2 unless the user explicitly asks to include the new-focus sentinel in the same pass.

