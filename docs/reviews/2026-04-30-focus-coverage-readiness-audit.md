---
id: focus-coverage-readiness-audit-2026-04-30
title: "Focus Coverage Readiness Audit"
status: active
stage: validation
type: review
summary: "Generated-readiness audit for Tune today named-focus coverage across pass/serve/set, current setup configurations, beginner/intermediate/advanced levels, fixed 15/25/40-minute profiles, focus-reinforcing support, pressure applicability, and same-focus swaps."
authority: "Current machine-readable readiness snapshot for focus-picker catalog trust; informs gap cards and variant-first catalog expansion."
last_updated: 2026-05-01
depends_on:
  - docs/brainstorms/2026-04-30-focus-coverage-catalog-readiness-requirements.md
  - docs/plans/2026-04-30-002-feat-focus-coverage-readiness-plan.md
  - docs/reviews/2026-05-01-generated-plan-diagnostics-report.md
  - app/src/domain/generatedPlanDiagnostics.ts
  - app/src/domain/sessionAssembly/focusReadiness.ts
  - app/src/data/drills.ts
decision_refs:
  - D81
  - D101
  - D130
  - D135
---

# Focus Coverage Readiness Audit

## Purpose

Record the current focus-coverage truth after adding the readiness engine and completing the source-backed readiness batches. The audit is the generated pass/fail baseline that prevents invisible fallback from being mistaken for catalog readiness.

## Method

The audit uses `buildFocusReadinessAudit()` from `app/src/domain/sessionAssembly/focusReadiness.ts`.

Matrix dimensions:

- Focus: Passing, Serving, Setting
- Configuration: `solo_net`, `solo_wall`, `solo_open`, `pair_net`, `pair_open`
- Level: `beginner`, `intermediate`, `advanced`
- Duration: `15`, `25`, `40`

Coverage uses the same active-catalog and hard-filter path as session generation through `findCandidates()`: M001 candidate status, participants, net/wall, equipment, and unmodeled requirements. It also applies effective player level to all focus-controlled work slots, treats 40 minutes as the current long-session target, requires focus-reinforcing support evidence, measures same-focus swaps without runtime off-focus widening, and verifies generated drafts preserve full requested duration without repeating focus-controlled drill families.

Generated-plan diagnostics now classify selected-block duration envelopes in `docs/reviews/2026-05-01-generated-plan-diagnostics-report.md`. The current generated-plan matrix covers 540 seeded cells (135 readiness cells x 4 seeds): 119 clean, 421 observation-only, and 0 hard failures. Routeable observations are policy/content signals, not automatic product failures.

## Summary

- Total cells: 135
- Verified cells: 135
- Failing cells: 0
- Latest activation batch: `focus-readiness-batch-3-advanced-pass-set`

By focus:

- `pass`: 45 verified, 0 failing
- `serve`: 45 verified, 0 failing
- `set`: 45 verified, 0 failing

Risk bucket counts:

- `cannot_generate`: 0
- `off_focus_support`: 0 after batch 1 focus-controlled support wiring
- `no_same_focus_swap`: 0
- `thin_long_session`: 0
- `skill_level_unhonored`: 0 after U3 wiring
- `source_trace_missing`: 0 in generated mechanics; source trace remains a gap-card requirement before activation

Generated-plan diagnostics:

- Surface: `pass` / `serve` / `set` x `solo_net` / `solo_wall` / `solo_open` / `pair_net` / `pair_open` x `beginner` / `intermediate` / `advanced` x `15` / `25` / `40` x 4 seeds
- Total seeded cells: 540
- Clean cells: 119
- Observation-only cells: 421
- Hard-failure cells: 0
- Observation counts: `under_authored_min` 257, `optional_slot_redistribution` 236, `over_authored_max` 288, `over_fatigue_cap` 288

## Readiness Interpretation

- Passing is verified across the current readiness matrix after batch 3.
- Serving is verified across the current readiness matrix after batch 2.
- Setting is verified across the current readiness matrix after batch 3.
- The current fixed long-session requirement is 40 minutes, not 45 minutes. Manual custom durations such as 90 minutes remain future work.

## Failing Cell Groups

The audit routes historical failures into grouped gap cards in `docs/reviews/2026-04-30-focus-coverage-gap-cards.md`. All current matrix groups are verified:

- `gap-advanced-focus-main-coverage`: verified after batch 3
- `gap-serving-support-and-swaps`: verified after batch 2
- `gap-setting-support-and-swaps`: verified after batch 3
- `gap-long-session-variety`: verified after batch 3

## Applied Changes

Batch 1 applied source-backed support/readiness changes:

- `effectiveSkillTags()` now treats `technique` and `movement_proxy` as focus-controlled slots for named-focus sessions; `warmup` and `wrap` remain recommendation-owned.
- `d31-pair-open` adds a no-net pair adaptation of the Better at Beach Serving Mission target drill.
- `d33-solo-open` and `d33-pair-open` add no-net adaptations of the BAB Around the World six-zone serving convention, using sand target areas and explicitly avoiding net-clearance claims.
- Cap delta: 0 drill records; this batch adds variants to existing source-backed drill families.

Batch 2 applied source-backed serving level/depth changes:

- `d22` now follows FIVB 2.6 First to 10 Serving as an intermediate/advanced scoring family.
- `d22-solo` and `d22-pair` now use one-ball cadence so the active M001 filter can select them.
- `d22-solo-open` and `d22-pair-open` add no-net target-scoring adaptations that preserve the points-to-target scoring problem without claiming net clearance.
- `d33` keeps its accessible BAB beginner entry but extends to advanced, matching FIVB's intermediate/advanced serving-variety framing.
- Cap delta: 0 drill records; this batch adds variants and metadata to existing source-backed drill families.

Batch 3 completed advanced Passing and Setting:

- Candidate filtering now applies player level to `technique` and `movement_proxy` as well as `main_skill` and `pressure`, so focus-controlled support slots no longer admit out-of-band drill families.
- `d07` now matches FIVB 3.15 Pass and Look as an intermediate/advanced family and adds `d07-solo-open` / `d07-pair-open` low-equipment readiness variants.
- `d46 Spin-Read Serve Receive` activates an advanced FIVB 3.16-inspired spin-read passing family with solo and pair open variants.
- `d47 Four Great Sets` activates FIVB 4.7 advanced setting variability with solo and pair open variants.
- `d48 Set and Look` activates FIVB 4.9 advanced post-set look/call work with solo and pair open variants.
- Cap delta: +3 drill records (`d46`, `d47`, `d48`); `d07` activation uses existing family metadata plus variants.

## Verification

- `npm test -- src/domain/sessionAssembly/__tests__/focusReadiness.test.ts`
- `npm test -- src/domain/__tests__/generatedPlanDiagnostics.test.ts`
- `npm run diagnostics:report:check`
- `npm test -- src/domain/sessionBuilder.test.ts`
- `npm test -- src/domain/__tests__/findSwapAlternatives.test.ts`
