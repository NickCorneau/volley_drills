---
id: m001-testing-quality-strategy
title: M001 Testing and Quality Strategy
status: active
stage: planning
type: research
authority: M001 trust invariants, verification stack guidance, and testing-layer recommendations
summary: "Testing stack, trust invariants, and verification strategy for M001."
last_updated: 2026-04-12
depends_on:
  - docs/decisions.md
  - docs/specs/m001-courtside-run-flow.md
  - docs/research/local-first-pwa-constraints.md
related:
  - docs/research/README.md
  - docs/research/dexie-schema-and-architecture.md
---

# M001 Testing and Quality Strategy

## Purpose

Capture the testing and quality guidance that matters for the first local-first React PWA slice.

This note is about trust, correctness, and verification strategy for M001. It does not replace the product canon in `docs/vision.md`, `docs/decisions.md`, or the M001 milestone/spec docs.

## Use This Note When

- you need to decide what to test first versus later
- you need to choose the minimum believable verification stack for M001
- you need to reason about trust failures such as interrupted sessions, broken offline startup, or nondeterministic adaptation

## Bottom line

For M001, the quality strategy should protect exactly two things:

- user trust in a courtside, local-first workflow
- deterministic correctness of the session and adaptation loop

That means the expensive failures are not visual nits. They are:

- lost or corrupted local session data
- a reload or update that interrupts a live session
- broken offline startup after the app has already loaded once
- adaptation behavior that changes unexpectedly for the same inputs
- schema or migration mistakes that strand historical data

## What to apply now

### 1. Use a hybrid test strategy, not one giant suite

The right split for this stack is:

- `Vitest` for pure domain logic and fast persistence-adjacent tests
- `React Testing Library` plus `user-event` for a small number of user-facing interaction tests
- `fake-indexeddb` for Dexie and IndexedDB integration tests in Node
- `Playwright` for a tiny number of real-browser smoke tests that cover offline, service worker behavior, and the believable end-to-end loop

Why this fits the current repo:

- `app/` is already a Vite + React + TypeScript scaffold with Dexie dependencies
- the repo does not yet have service-worker wiring or a browser-test harness
- the best use of this research right now is to shape the implementation plan and quality contract before broad tooling lands

### 2. Treat browser-only PWA behavior as a real-browser concern

Simulated DOM environments are useful for speed, but they are the wrong place to prove:

- service worker install and update behavior
- offline startup after first load
- browser-specific IndexedDB behavior
- courtside interaction under real mobile constraints

Those should stay in a very small Playwright smoke suite instead of being approximated by a large jsdom-heavy test layer.

### 3. Freeze the update-safety stance early

For M001, the safer default is:

- prompt-based update activation
- safe-boundary refresh at home, after review, or on explicit user action
- no forced reload during an active session

This is a product trust decision as much as a technical one.

### 4. Persist session state as the run happens

If the app only writes data at the end of a session, the product is fragile by design.

The first thin slice should assume:

- in-progress session state is saved locally as the run advances
- partial sessions remain recoverable
- review drafts and final review submission are stored locally without waiting on sync

### 5. Make migrations a first-class quality concern

Because IndexedDB schema changes are version-gated and Dexie migrations are explicit, migration behavior should be treated like product logic, not setup detail.

That means:

- version changes are deliberate
- upgrade functions are tested with representative old data
- transaction behavior is verified so failures do not leave partial writes behind

## What to defer

These are not the right quality investments for the current repo state:

- coverage percentage targets as a release gate
- broad component test suites
- snapshot-heavy UI testing
- a full cross-browser CI matrix
- MSW or other network-mocking infrastructure before server-backed features exist

## Recommended first-wave verification inventory

### Fast tests

- session lifecycle invariants
- deterministic `progress / hold / deload` outcomes
- drill-assembly and validation rules
- write-as-you-go local persistence and recovery
- Dexie version-upgrade and migration preservation checks

### Real-browser smoke tests

- believable end-to-end loop: generate -> edit -> run -> review -> next-session adaptation
- offline after first load still works
- update-ready behavior does not interrupt an active session

## Current repo implication

This research should change docs before code:

- document the M001 trust invariants explicitly
- document prompt-based update behavior in connectivity and run-flow notes
- lock the minimum verification stack before implementation planning
- avoid inflating the current `app/` scaffold with speculative tooling before the quality contract is clear

## Source families in this research pass

- Vitest docs and browser-mode guidance
- Testing Library and `user-event` guidance
- Playwright service-worker, offline, and browser-support docs
- MDN and spec references for IndexedDB, service workers, `skipWaiting()`, and `clients.claim()`
- Dexie docs for versioning, `Version.upgrade()`, and transaction/error behavior
- Vite PWA plugin docs, especially update strategy and service-worker testing notes

