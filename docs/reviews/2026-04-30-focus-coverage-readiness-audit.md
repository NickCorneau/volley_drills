---
id: focus-coverage-readiness-audit-2026-04-30
title: "Focus Coverage Readiness Audit"
status: active
stage: validation
type: review
summary: "Generated-readiness audit for Tune today named-focus coverage across pass/serve/set, current setup configurations, beginner/intermediate/advanced levels, fixed 15/25/40-minute profiles, focus-reinforcing support, pressure applicability, and same-focus swaps."
authority: "Current machine-readable readiness snapshot for focus-picker catalog trust; informs gap cards and variant-first catalog expansion."
last_updated: 2026-04-30
depends_on:
  - docs/brainstorms/2026-04-30-focus-coverage-catalog-readiness-requirements.md
  - docs/plans/2026-04-30-002-feat-focus-coverage-readiness-plan.md
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

Record the current focus-coverage truth after adding the readiness engine. This is not a promise that named-focus Tune today is complete. It is the pass/fail baseline that prevents invisible fallback from being mistaken for catalog readiness.

## Method

The audit uses `buildFocusReadinessAudit()` from `app/src/domain/sessionAssembly/focusReadiness.ts`.

Matrix dimensions:

- Focus: Passing, Serving, Setting
- Configuration: `solo_net`, `solo_wall`, `solo_open`, `pair_net`, `pair_open`
- Level: `beginner`, `intermediate`, `advanced`
- Duration: `15`, `25`, `40`

Coverage uses the same active-catalog and hard-filter path as session generation through `findCandidates()`: M001 candidate status, participants, net/wall, equipment, and unmodeled requirements. It also applies effective player level to focus-controlled main/pressure slots, treats 40 minutes as the current long-session target, requires focus-reinforcing support evidence, and measures same-focus swaps without runtime off-focus widening.

## Summary

- Total cells: 135
- Verified cells: 30
- Failing cells: 105
- Activation batch: none in this pass

By focus:

- `pass`: 30 verified, 15 failing
- `serve`: 0 verified, 45 failing
- `set`: 0 verified, 45 failing

Risk bucket counts:

- `cannot_generate`: 57
- `off_focus_support`: 90
- `no_same_focus_swap`: 69
- `thin_long_session`: 31
- `skill_level_unhonored`: 0 after U3 wiring
- `source_trace_missing`: 0 in generated mechanics; source trace remains a gap-card requirement before activation

## Readiness Interpretation

- Passing is only partially ready. Beginner/intermediate cells can verify, but advanced passing fails because active focus-controlled drills do not cover the advanced band.
- Serving is not named-focus ready. Beginner/intermediate serving has some main-work candidates, but support and swap depth fail broadly; advanced serving cannot generate focus-controlled main work.
- Setting is not named-focus ready. The current active setting catalog is too thin for the practical floor and fails support/swap depth across the matrix.
- The current fixed long-session requirement is 40 minutes, not 45 minutes. Manual custom durations such as 90 minutes remain future work.

## Failing Cell Groups

This audit routes failures into grouped gap cards in `docs/reviews/2026-04-30-focus-coverage-gap-cards.md`:

- `gap-advanced-focus-main-coverage`: advanced pass/serve/set focus-controlled main and pressure coverage
- `gap-serving-support-and-swaps`: serving support and same-focus swap depth
- `gap-setting-support-and-swaps`: setting support and same-focus swap depth
- `gap-long-session-variety`: 40-minute long-session variety and pressure depth

## Applied Changes

No drill records were activated or authored in this pass. The audit found failing cells and candidate source directions, but no activation-ready batch with exact source references, adaptation deltas, cap delta, and verification checkpoint has been applied yet.

## Verification

- `npm test -- src/domain/sessionAssembly/__tests__/focusReadiness.test.ts`
- `npm test -- src/domain/sessionBuilder.test.ts`
- `npm test -- src/domain/__tests__/findSwapAlternatives.test.ts`
