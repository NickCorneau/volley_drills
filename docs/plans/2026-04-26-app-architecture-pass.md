---
id: app-architecture-pass-2026-04-26
title: "App architecture systematization pass (2026-04-26)"
type: plan
status: active
stage: validation
authority: "Ten-unit architecture pass for the app/ workspace. Decomplects domain from Dexie, consolidates the capture model, decomposes controllers, lays forward-compat seams, and codifies durable building guidance for future agents — without introducing a state-management framework, repositories, or codegen."
summary: "U0 atomic-commit cleanup. U1 field-merging review-draft writes (`patchReviewDraft`). U2 closed `domain/capture/` module with a `MetricTypeStrategy` registry. U3 `services/review.ts` SRP split into `submit` / `expire` / `drafts` / `cohort` / `bundle` behind a barrel. U4 new pure `app/src/model/` layer; `db/types.ts` demoted to adapter. U5 `app/src/platform/` for browser-runtime concerns; `domain/runFlow/postBlockRoute` for run-loop routing policy. U6 forward-compat seams: `SessionParticipant[]`, `SkillVector`, `ExportSession` adapter, `CoachPayload` type. U7 P12 `ScreenContract` registry + transitional run-flow registry with sunset rule. U8 refresh app docs and the testing pyramid map. U9 durable `docs/ops/app-architecture-guidance.md` for future agents. U10 final holistic red-team gate."
last_updated: 2026-04-28
depends_on:
  - docs/vision.md
  - docs/decisions.md
  - docs/specs/m001-courtside-run-flow.md
  - docs/specs/m001-review-micro-spec.md
  - docs/research/m001-testing-quality-strategy.md
  - docs/research/minimum-viable-test-stack.md
  - docs/research/local-first-pwa-constraints.md
related:
  - app/README.md
  - .cursor/rules/data-access.mdc
  - .cursor/rules/component-patterns.mdc
  - .cursor/rules/testing.mdc
  - .cursor/rules/routing.mdc
  - app/src/model/
  - app/src/domain/capture/
  - app/src/domain/runFlow/
  - app/src/services/review/
  - app/src/services/export/
  - app/src/platform/
  - app/src/contracts/
decision_refs:
  - D106
  - D113
  - D115
  - D116
  - D117
  - D118
  - D121
  - D125
  - D130
  - D133
---

# App-First Architecture Systematization Plan

## Overview

The app is mid-refactor in a productive direction: large screens and `sessionBuilder.ts` are being decomposed into controllers, domain helpers, and session-assembly modules. The risk is shipping a half-codified architecture: controllers becoming god-hooks, `services/review.ts` mixing five reasons-to-change, the capture model fragmented across six files, and `domain/` quietly dependent on Dexie row shapes.

This plan finishes that direction and decomplects the remaining hotspots. It is correctness-first, then DRY, then DIP. It deliberately does not introduce a state-management framework, repositories, or codegen. It does prepare seams for Phase 1.5 export, Phase 2 coach payloads, and the persistent-pair shape from `D115`/`D116`/`D117`.

This durable record exists in `docs/plans/` per the U8 routing-critical-surface refresh. The full execution plan with per-unit failure modes, red tests, verification, and red-team focus lives in the working copy alongside this work and is the source of truth for builder execution.

## Problem frame

Three architectural complects dominate today:

1. **Domain depends on Dexie row types.** `app/src/domain/*` imports `SessionPlan`, `ExecutionLog`, `PerDrillCapture`, `SessionReview` from `app/src/db`. Every future export, cloud peer (`D118`), and coach payload (`D106`) inherits this.
2. **The capture model is fragmented.** Metric-type eligibility, count-based predicate, capture merge, aggregate, "meaningful draft" predicate, and "should we show metrics" derivation each live in a different module.
3. **Controllers bundle five concerns.** Routing, browser APIs, transient UI state, service IO, and selectors live in one hook.

Two product-shape complects are about to bite:

- The persisted model assumes `playerCount: number` while `D115`/`D116`/`D117` already chose `SessionParticipant[]` + `PlayerProfile` + `TeamConsent` as the forward-compatible shape.
- The skill model is session-level scalar today; `D121` (per-skill vector) is canonical.

## Target shape

```
data ─► model ─► domain ─► services ─► hooks ─► controllers ─► screens / components
                                                                    ▲
                                                              platform
contracts ─────────────────────────────────────────────────────────┘
```

**Layer rules (decomplected, enforceable):**

- `model/` has no dependencies on React, Dexie, or services.
- `domain/` depends on `model/` and `data/` only. Never imports from `db/`, `services/`, or React.
- `services/` owns Dexie. Maps `model/` to and from row shapes at the boundary.
- `platform/` owns browser-runtime singletons (Wake Lock, Audio, visibility/beforeunload, vibration). No product semantics.
- Use-case hooks (today: `useSessionRunner`) own ordered service calls and the serial mutation queue.
- Controllers are thin assemblers: route policy + use-case hook + platform hooks + local UI state.
- Screens render and dispatch UI events. They never call Dexie and never hold product policy.
- `contracts/` holds the P12 screen contract and the transitional run-flow registry.

## Forward-compatibility seams

Lay these now while we are already in the relevant modules. None of them light up new UX in v0b.

- `SessionParticipant[]` shape (`D115`/`D116`/`D117`). v0b populates `[{ role: 'self' }]` (or `'self' + 'partner'`); downstream code reads from the array.
- `SkillVector` type (`D121`). M001 records one focus today; the type allows future per-skill rollups without re-shaping persisted records.
- `ExportSession` adapter (Phase 1.5). Pure function `model -> JSON` lives in `services/export/sessionExport.ts` and uses no Dexie types.
- `CoachPayload` adapter shape (Phase 2 / `D106`). Type-only declaration of what gets shared with a coach (a strict subset of the model).
- Adaptation-replay hook point (`D113` / `V0B-15`). When the adaptation engine lands, it consumes a `SessionReview[]` model array, not Dexie rows.

## Testing pyramid map

Per-unit coverage decisions are deterministic, not ad hoc. Honor `docs/research/m001-testing-quality-strategy.md` and `docs/research/minimum-viable-test-stack.md`.

- **Domain Vitest (pure)** — capture eligibility, merge, aggregation, route policy, meaningful-draft predicate, capture-window classification, model adapters, P12 registry exhaustiveness.
- **Services Vitest with `fake-indexeddb`** — submit / expire / draft transactions, cohort filtering, bundle loading, schema invariants, model round-trip.
- **Hooks RTL with mocked `useSessionRunner`** — controller wiring, route outcomes, error branches.
- **Hooks RTL on the real runner** — only `useSessionRunner` itself, to guard the serial-queue invariant.
- **Component RTL** — UI primitives in `components/ui/` only. Do not duplicate domain assertions.
- **Playwright** — full route flows, PWA storage, Drill Check ↔ Review draft persistence end-to-end.

If a behavior can be proven at a lower tier, it must be. RTL must not re-assert domain truths.

## Implementation units

The active execution plan, with per-unit failure modes, red tests, verification, and red-team focus, is captured in the working plan copy alongside this work. Each unit closes with a post-unit red-team gate (severity classified P0/P1/P2/P3/false-positive) and the final unit (U10) red-teams the entire branch as a connected system.

| Unit | Title | Status |
|------|-------|--------|
| U0 | Atomic-commit the worktree | complete |
| U1 | Review-draft writes are field-merging | complete |
| U2 | Capture domain consolidation + metric-type strategy registry | complete |
| U3 | `services/review.ts` true SRP split | complete |
| U4 | Introduce `app/src/model/`; demote `db/types.ts` to adapter | complete |
| U5 | Decompose controllers; extract `app/src/platform/` | complete |
| U6 | Forward-compatibility seams | complete |
| U7 | P12 screen contract; sunset the run-flow registry | complete |
| U8 | Refresh agent-facing app guidance + write the testing pyramid map | active |
| U9 | Consolidate durable app-building guidance for future agents | pending |
| U10 | Final holistic architecture red-team and remediation pass | pending |

## System-wide impact

- **Interaction graph:** Wake Lock + Audio + Visibility flush are centralized in `platform/`; controllers compose them. Capture domain becomes the single read site for "what to capture and how to count it." Route policy becomes the single read site for "where to go next."
- **Error propagation:** `isSchemaBlocked` continues to be the silent-degrade gate for Dexie-shape errors. Controllers must keep surfacing actionable footer errors for non-schema-blocked failures.
- **State lifecycle risks:** review draft writes change semantics in U1; `submittedAt` advance still behaves as the "last edited" cursor and is monotonic per execId.
- **API surface parity:** the `services/review` barrel keeps existing public symbols available during U3 and U4 so the cutover does not ripple through tests.
- **Integration coverage:** Drill Check ↔ Review draft persistence is exercised at the Playwright tier as well as services and domain tiers.
- **Unchanged invariants:** Dexie schema v5 is not bumped; routes stay the same; the Dexie database name `volley-drills` stays per `D125`; the `useSessionRunner` serial queue is preserved exactly.

## Risks (live during execution)

- **Model layer migration ripples through tests too widely** — landed via the barrel pattern; rewrite imports incrementally with a CI grep guard.
- **Capture-domain consolidation accidentally changes a derivation** — pinned existing tests for `aggregate`, `merge`, `eligibility`, and `meaningful-draft` before moving any code.
- **Controller decomposition hides complexity instead of removing it** — soft LOC cap per controller and the "no relocation without responsibility" rule in review.
- **Forward-compat seams creep into UX** — U6 ships zero UI changes; assert with screen snapshots.
- **Run-flow registry drifts during the sunset transition** — drift test against the spec doc; sunset is explicit and reviewed.
- **Strategy registry becomes a god-table** — entries stay declarative.
- **iOS Safari quirks regress during platform extraction** — keep `docs/research/local-first-pwa-constraints.md` findings as fixtures.

## Sources & references

- Vision: `docs/vision.md` (P1, P12, P13).
- Roadmap & gates: `docs/roadmap.md` (Phase 1.5 export, Phase 2 coach gate).
- Forward-compat decisions: `docs/decisions.md` (`D106`, `D113`, `D115`, `D116`, `D117`, `D118`, `D121`, `D125`, `D133`).
- Testing posture: `docs/research/m001-testing-quality-strategy.md`, `docs/research/minimum-viable-test-stack.md`.
- iOS PWA constraints: `docs/research/local-first-pwa-constraints.md`.
- Capture coverage queue: `docs/plans/2026-04-27-per-drill-capture-coverage.md`.
- Existing run-flow contract: `app/src/contracts/runFlowInteractionContract.ts` (post-U7 location).
