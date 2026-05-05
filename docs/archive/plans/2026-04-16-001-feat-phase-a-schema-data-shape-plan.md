---
title: "feat: Phase A schema and data shape (V0B-12, V0B-23, V0B-29)"
type: feat
status: completed
date: 2026-04-16
origin: docs/plans/2026-04-12-v0a-to-v0b-transition.md
---

# Phase A: Schema and Data Shape

## Overview

Land the three schema-level changes that must exist before any v0b surfaces build on top of them: per-drill-variant scoring grain on reviews, persisted active session duration on execution logs, and verification of the reserved borderlineCount field.

## Problem Frame

v0b's session summary (V0B-11), JSON export (V0B-15), and future D104/D113 replay all depend on data shapes that v0a's schema does not yet provide. Shipping schema first avoids Dexie migrations piling up alongside surface work in Phase C.

## Requirements Trace

- R1. `SessionReview` must support per-drill-variant `goodPasses`/`attemptCount` for D104 rolling-window aggregation (V0B-12)
- R2. `ExecutionLog` must persist `actualDurationMinutes` at session completion for D113 `session_load = sRPE * minutes` (V0B-23)
- R3. `SessionReview.borderlineCount` must round-trip through `submitReview` and be verified by test (V0B-29)
- R4. No Dexie version bump required — all new fields are optional attributes that Dexie stores without index changes

## Scope Boundaries

- No UI changes. Review screen, run screen, and home screen are untouched.
- No progression engine logic. This is pure data shape.
- `drillScores` array will be populated by Phase C's per-drill review UI; for now it stays `undefined`.
- `actualDurationMinutes` is computed from planned block durations for completed blocks and live timer state for in-progress blocks. This is the pragmatic best-available computation given that per-block `accumulatedElapsed` is not persisted after a block advances.

## Context & Research

### Relevant Code and Patterns

- `app/src/db/types.ts` — all Dexie record interfaces
- `app/src/db/schema.ts` — Dexie version definitions; v3 is current
- `app/src/services/review.ts` — `submitReview()` and `SubmitReviewData`
- `app/src/services/session.ts` — pure state builders (`buildAdvancedBlock`, `buildEndedSession`) and persistence (`saveExecution`)
- `app/src/hooks/useSessionRunner.ts` — orchestrates timer reads, state transitions, and `clearTimerState()` calls
- `app/src/services/timer.ts` — `readTimerState()`, `clearTimerState()`
- `app/src/services/__tests__/session.v0b.test.ts` — Dexie-backed integration tests for session lifecycle
- `app/src/test-setup.ts` — per-test `IDBFactory` isolation

### Patterns to Follow

- Optional fields on Dexie records do not require a version bump or `.upgrade()` — Dexie writes them as-is and reads them as `undefined` on old records (see `borderlineCount` and `context` precedents).
- Pure state builder functions in `services/session.ts` take an execution log and return a new one (no DB calls).
- Test files use Vitest `describe`/`it` with real Dexie via `fake-indexeddb`.

## Key Technical Decisions

- **No Dexie version bump**: All three fields are optional. Dexie stores optional attributes without needing indexed keys or version upgrades.
- **Duration computation uses planned block durations for completed blocks**: Once a block advances, its timer state is cleared. The planned `durationMinutes` (or `effectiveDurationSeconds` if the timer carried an adjustment) is the best-available proxy. The current in-progress block's active time comes from `TimerState.accumulatedElapsed`.
- **`drillScores` is optional and empty in v0a reviews**: The per-drill review UI is Phase C scope. Session-level `goodPasses`/`totalAttempts` fields remain as backward-compatible aggregates.

## Open Questions

### Resolved During Planning

- **Should `computeActualDurationMinutes` be a pure function?** Yes. It takes `(exec, plan, currentBlockElapsedSeconds?)` and returns a number. It lives in `services/session.ts` alongside the other pure state builders.
- **Where does the timer read + duration persist happen?** In `useSessionRunner` — at the `advanceBlock` (when `isLast`) and `endSession` call sites, before `clearTimerState()`.

### Deferred to Implementation

- Exact rounding strategy for `actualDurationMinutes` (nearest 0.1 vs integer). The spec says "minutes" — use one decimal place for now.

## Implementation Units

- [x] **Unit 1: Add `DrillVariantScore` and `drillScores` to `SessionReview` (V0B-12)**

**Goal:** Add per-drill-variant scoring grain to the review record shape.

**Requirements:** R1

**Dependencies:** None

**Files:**
- Modify: `app/src/db/types.ts`
- Modify: `app/src/services/review.ts`
- Test: `app/src/services/__tests__/review.test.ts` (new file)

**Approach:**
- Add `DrillVariantScore` interface: `{ drillId: string; variantId: string; goodPasses: number; totalAttempts: number }`
- Add optional `drillScores?: DrillVariantScore[]` to `SessionReview`
- Add optional `drillScores` to `SubmitReviewData` with pass-through to the persisted record
- Session-level `goodPasses`/`totalAttempts` remain as backward-compatible aggregates

**Patterns to follow:**
- `borderlineCount` optional field pattern in `types.ts` and `review.ts`

**Test scenarios:**
- Happy path: `submitReview` with `drillScores` array persists and can be read back via `loadSessionBundle`
- Happy path: `submitReview` without `drillScores` (undefined) persists cleanly — backward compat with v0a reviews
- Edge case: empty `drillScores` array (`[]`) persists without error

**Verification:** `drillScores` round-trips through Dexie; old reviews without the field read as `undefined`.

- [x] **Unit 2: Persist `actualDurationMinutes` on `ExecutionLog` (V0B-23)**

**Goal:** Compute and persist the actual active session duration (excluding paused time) when a session reaches a terminal state.

**Requirements:** R2

**Dependencies:** None (can run in parallel with Unit 1)

**Files:**
- Modify: `app/src/db/types.ts`
- Modify: `app/src/services/session.ts`
- Modify: `app/src/hooks/useSessionRunner.ts`
- Test: `app/src/services/__tests__/session.v0b.test.ts` (extend existing)
- Test: `app/src/hooks/useSessionRunner.test.ts` (extend existing)

**Approach:**
- Add `actualDurationMinutes?: number` to `ExecutionLog` interface
- Add `computeActualDurationMinutes(exec: ExecutionLog, plan: SessionPlan, currentBlockElapsedSeconds?: number): number` to `services/session.ts`
  - For each block in `exec.blockStatuses`:
    - `completed` blocks: use `plan.blocks[i].durationMinutes`
    - in-progress block (only during end-early): use `currentBlockElapsedSeconds / 60` if provided
    - `skipped` or `planned` blocks: 0
  - Return sum rounded to one decimal place
- In `useSessionRunner.advanceBlock`: when `isLast`, read timer state before clearing, compute duration, mutate the execution object before persisting
- In `useSessionRunner.endSession`: read timer state before clearing, compute duration, mutate the ended execution before persisting
- Both `buildAdvancedBlock` and `buildEndedSession` remain pure — the duration is attached by the caller

**Patterns to follow:**
- Pure state builders in `services/session.ts` — `computeActualDurationMinutes` follows the same pure-function pattern
- `useSessionRunner` already reads timer state via `readTimerState()` import

**Test scenarios:**
- Happy path: session completes all blocks → `actualDurationMinutes` equals sum of planned block durations
- Happy path: session ends early mid-block → `actualDurationMinutes` includes partial current block from timer
- Edge case: session ends early with no timer state (timer cleared or never started) → `actualDurationMinutes` based on completed blocks only, current block contributes 0
- Edge case: all blocks skipped (immediate end-early) → `actualDurationMinutes` is 0
- Integration: `computeActualDurationMinutes` is a pure function that can be tested in isolation with mock inputs

**Verification:** After session completion or end-early, `executionLog.actualDurationMinutes` is a positive number (or 0 for immediate end). Value is consistent with the session's block structure.

- [x] **Unit 3: Verify `borderlineCount` round-trip and fix comment reference (V0B-29)**

**Goal:** Confirm the existing `borderlineCount` schema reservation works end-to-end and update the stale V0B-21 comment to V0B-29.

**Requirements:** R3

**Dependencies:** None (can run in parallel with Units 1 and 2)

**Files:**
- Modify: `app/src/db/types.ts` (comment fix only)
- Test: `app/src/services/__tests__/review.test.ts` (extend or create)

**Approach:**
- Fix the JSDoc comment on `borderlineCount` in `types.ts`: change "Tracked as V0B-21" to "Tracked as V0B-29"
- Write a test that submits a review with `borderlineCount: 5`, reads it back, and asserts the value persists

**Patterns to follow:**
- Existing `submitReview` + `loadSessionBundle` test patterns

**Test scenarios:**
- Happy path: `submitReview` with `borderlineCount: 5` → `loadSessionBundle` returns review with `borderlineCount === 5`
- Happy path: `submitReview` without `borderlineCount` → field is `undefined` on read-back

**Verification:** `borderlineCount` value survives Dexie write/read. Comment references V0B-29.

## Risks & Dependencies

| Risk | Mitigation |
|------|------------|
| Timer state unavailable at completion (race condition or cleared early) | `computeActualDurationMinutes` treats missing timer as 0 for the current block; still computes from completed block durations |
| Old v0a reviews lack `drillScores` and `borderlineCount` | Both fields are optional; reads return `undefined`; no migration needed |

## Sources & References

- **Origin document:** [docs/plans/2026-04-12-v0a-to-v0b-transition.md](docs/plans/2026-04-12-v0a-to-v0b-transition.md) § "Phase A — Schema and data shape"
- Related specs: [docs/specs/m001-review-micro-spec.md](docs/specs/m001-review-micro-spec.md), [docs/specs/m001-adaptation-rules.md](docs/specs/m001-adaptation-rules.md)
- Related research: [docs/research/binary-scoring-progression.md](docs/research/binary-scoring-progression.md), [docs/research/srpe-load-adaptation-rules.md](docs/research/srpe-load-adaptation-rules.md)
