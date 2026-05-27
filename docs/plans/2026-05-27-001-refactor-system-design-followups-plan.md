---
id: system-design-followups-2026-05-27
title: "refactor: System-design audit follow-ups"
status: active
stage: validation
type: plan
date: 2026-05-27
summary: "Captures six architecture follow-ups surfaced and revalidated by the 2026-05-27 system-design pass across the v0b app: F1 capture-ownership type guard (P1), F2 saveExecution runner-only architecture:check rule (P2), F5 lib/ growth guardrail (P3), F6 multi-tab everyday-write documented limitation (P3 doc-only), F7 computeActualDurationMinutes single boundary (P2), F8 zero-PII local error log (P3, deferred). Two initial items (F3 Dexie migrations CHANGELOG, F4 typed storageMeta accessors) were dropped during revalidation as speculative debt — see §Items dropped on revalidation. Backlog capture only; no work starts from this plan."
depends_on:
  - AGENTS.md
  - docs/catalog.json
  - app/README.md
  - docs/ops/app-architecture-guidance.md
related:
  - docs/plans/2026-05-02-019-refactor-agent-architecture-cleanup-plan.md
---

# refactor: System-design audit follow-ups

## Overview

The 2026-05-27 /system-design pass across the `app/` workspace surfaced eight architecture risks. A same-day revalidation against the actual code dropped two of them as speculative debt. F1, F2, F5, F6, and F7 shipped via `docs/plans/2026-05-27-002-refactor-system-design-followups-ship-plan.md`; F8 remains here as a deferred registry item with an activation trigger.

The audit confirmed the core architecture (layer model, decomplecting, strategy registries, `useSessionRunner` serial queue, schema-blocked overlay, P12 contract registry) is sound. These are second-order risks that would erode the foundation under contributor or scope growth.

## Status

`active` — F1, F2, F5, F6, and F7 are shipped by `docs/plans/2026-05-27-002-refactor-system-design-followups-ship-plan.md`. F8 remains deferred until D91 reopens or a stranger-cohort / shared-device cycle begins. This registry should not be marked complete while F8 remains open.

## Items

### F1 — Capture-ownership type guard

- **Severity:** P1 (silent-data-loss risk; single contributor today, so not yet active).
- **Problem:** `useReviewController`'s autosave and `handleFinishLater` deliberately omit `perDrillCaptures` from the patch so a stale Review state cannot blank captures persisted by `DrillCheckScreen`. The boundary is comment-only in two places; a future contributor adding `perDrillCaptures` to the patch (intuitive!) would silently overwrite captures.
- **Mitigation:** Type-narrow `patchReviewDraft`'s payload at the service signature to exclude `perDrillCaptures`. A service-level type guard is cheaper insurance than the existing e2e test.
- **Files:** `app/src/services/review/*` (wherever `patchReviewDraft` is defined), `app/src/screens/review/useReviewController.ts`.
- **Shipped:** `docs/plans/2026-05-27-002-refactor-system-design-followups-ship-plan.md`.
- **Defer reason:** No active red case in the contributor pool today; sequence ahead of any second-contributor or capture-shape change.

### F2 — `saveExecution` runner-only enforcement

- **Severity:** P2 (norm-enforcement, not bug prevention).
- **Problem:** `useSessionRunner`'s serial queue is the only thing keeping `executionLogs` writes safe under double-tap / visibility-change / interleaved cancel. `saveExecution` is exported from `services/session/index.ts`; today only the runner calls it, but a future hook bypassing the queue would re-introduce every race the queue was built to fix.
- **Revalidation note:** Originally proposed as a P1 with a refactor (mark non-public, re-export only through the runner). Revalidation reframed it: today's `saveExecution` callers are already runner-only, so this is enforcement of an existing norm, not bug prevention. Best landed as a small rule inside `npm run architecture:check` (flag non-runner `saveExecution` imports) rather than a code refactor.
- **Mitigation:** Extend `architecture:check` with a rule that flags any non-`hooks/useSessionRunner.ts` import of `saveExecution`.
- **Files:** `app/scripts/` (or wherever `architecture:check` lives).
- **Shipped:** `docs/plans/2026-05-27-002-refactor-system-design-followups-ship-plan.md`.

### F5 — `lib/` erosion CI guardrail

- **Severity:** P3 (norm holds under one contributor; value rises with contributor count).
- **Problem:** `docs/ops/app-architecture-guidance.md` explicitly flags `app/src/lib/` as "a legacy mixed helper area, not a new layer." That warning will erode under time pressure unless mechanically backed.
- **Revalidation note:** Downgraded from P2 to P3 because the norm holds under single-contributor use today. Land alongside F2 as a small extension of the same `architecture:check` rule set rather than a standalone task.
- **Mitigation:** Extension of `npm run architecture:check` that flags net-new top-level files in `app/src/lib/`. Existing files allowlisted; only growth triggers the report.
- **Files:** wherever `architecture:check` lives.
- **Shipped:** `docs/plans/2026-05-27-002-refactor-system-design-followups-ship-plan.md`.

### F6 — Multi-tab everyday-write limitation (doc-only)

- **Severity:** P3 (documented limitation, not engineering work).
- **Problem:** `db.on('versionchange' | 'blocked')` handles schema upgrades cleanly via `SchemaBlockedOverlay`. Multi-tab *non-schema* writes (two tabs open; one starts a session while the other reads the draft) are not modeled.
- **Revalidation note:** Originally proposed as a P2 with two implementation options (`BroadcastChannel` vs documented limitation). Revalidation reframed it as doc-only — the realistic risk class under courtside founder use is vanishingly small, and building `BroadcastChannel` synchronization is a real engineering project that does not earn its place until stranger-cohort or shared-device use materializes.
- **Mitigation:** One-paragraph addendum to `docs/research/local-first-pwa-constraints.md` accepting the limitation under founder/courtside use, with a re-evaluation trigger noted.
- **Files:** `docs/research/local-first-pwa-constraints.md`.
- **Shipped:** `docs/plans/2026-05-27-002-refactor-system-design-followups-ship-plan.md`.

### F7 — `computeActualDurationMinutes` single boundary

- **Severity:** P2 (silent miscount risk under refactor; small cohesion improvement).
- **Problem:** `computeActualDurationMinutes` is the cross-cutting truth-maker for "how long did this session actually take?" with two call sites in `useSessionRunner` (`advanceBlock` last-block branch + `endSession`), each pairing the duration call with `clearTimerState()` and a near-identical `partialSeconds` / `ownedElapsed` derivation. A refactor adding a third terminal path (e.g., an "abort" reason) that misses the duration assignment would silently fall back to the start-to-end span (per `format.ts::sessionDurationMinutes`), which can be wildly wrong on a paused-overnight session.
- **Mitigation:** Collapse to a single boundary in `services/session/commands.ts` so the runner calls one function (`finalizeExecution(exec, plan, timer)` or similar). The current call sites become argument-shaping, not duration-shaping. Pairs the duration assignment with the timer clear so they stay together.
- **Files:** `app/src/services/session/commands.ts`, `app/src/hooks/useSessionRunner.ts`, `app/src/domain/executionState.ts`.
- **Shipped:** `docs/plans/2026-05-27-002-refactor-system-design-followups-ship-plan.md`.

### F8 — Zero-PII local error log

- **Severity:** P3 (relevant when D91 reopens or a stranger cohort runs).
- **Problem:** No telemetry, no Sentry — correct for v0b founder use, but the moment D91 reopens or a stranger cohort runs there is no way to diagnose a courtside crash from a tester's device.
- **Mitigation:** A zero-PII, capped, ring-buffered local error log (in `storageMeta` or its own Dexie table) so the founder export dump carries the last N errors with the session records. No network egress; everything stays local until the tester runs Export.
- **Files:** `app/src/services/storageMeta.ts` or new `app/src/services/errorLog.ts`; integration into `app/src/services/export.ts`.
- **Activation trigger:** D91 reopens, or stranger-cohort / shared-device cycle begins.

## Items dropped on revalidation

### F3 — Dexie migrations CHANGELOG (dropped)

- **Reason:** Over-called. The `schema.ts` `.version()` blocks already carry rich inline comments (v5 = 8 lines, v6 = 14 lines) explaining what moved and why. A separate `CHANGELOG.md` would create a second source of truth — explicitly forbidden by `docs/ops/app-architecture-guidance.md` §Anti-Patterns ("Docs becoming a second source of truth"). The inline comment **is** the changelog.

### F4 — Typed `storageMeta` accessors (dropped)

- **Reason:** "Junk drawer" framing was wrong. Consumers already use typed guard predicates (`isSkillLevel`, `isTimestamp`, `isOnboardingStep`) and the cross-cutting use cases have typed wrappers (`markSoftBlockDismissed`). The remaining risk ("when a data-reset feature ships") is speculative until a reset feature is on the roadmap. If kept, this belongs as a precondition note inside whatever plan adds reset — not as a standalone follow-up here.

## Sequencing (recommended if/when scheduled)

1. **F1** (capture-ownership type guard) — cheap; prevents silent data loss. Highest signal-to-effort.
2. **F7** (single-boundary duration) — moderate; behavior-preserving refactor with cohesion win.
3. **F2** (`saveExecution` `architecture:check` rule) — small script extension; can ship alongside F5.
4. **F5** (`lib/` growth guardrail) — script extension; pairs naturally with F2.
5. **F6** (multi-tab limitation doc) — one paragraph in `local-first-pwa-constraints.md`.
6. **F8** (error log) — schedule when D91 reopens or stranger-cohort cycle begins.

## Out of scope

- Re-litigating the layer model or the `useSessionRunner` serial queue — both validated by the audit.
- Adding a state-management library (Redux / Zustand / Jotai) — explicitly rejected per `docs/ops/app-architecture-guidance.md` §Anti-Patterns.
- Repo-wide telemetry adoption — F8 is local-only by design.
- Re-evaluating `D118` durability-copy posture — out of architecture scope.
- Catalog or generator-policy refactors — covered by their own existing plans.

## Related

- `docs/plans/2026-05-02-019-refactor-agent-architecture-cleanup-plan.md` — precedent for a captured-but-not-actioned architecture backlog.
- `docs/ops/app-architecture-guidance.md` §Current Cleanup Queue — this plan's pointer is listed there.
