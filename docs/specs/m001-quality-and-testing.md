---
id: M001-quality-testing
title: M001 Quality And Testing
status: draft
stage: planning
type: spec
authority: trust invariants, test layers, minimum verification bar for M001
summary: "Trust invariants, test layers, and minimum verification bar for M001."
last_updated: 2026-04-12
depends_on:
  - docs/milestones/m001-solo-session-loop.md
  - docs/research/m001-testing-quality-strategy.md
decision_refs:
  - D38
  - D39
  - D41
  - D69
  - D70
  - D71
---

# M001 Quality And Testing

## Purpose

Define the trust invariants, test layers, and minimum verification bar for the first implementation-ready M001 slice.

This is a planning artifact for later implementation planning, not an instruction to start building now.

## Quality priority

M001 quality should protect two things first:

- user trust: no scary surprises, no silent data loss, no mid-session disruption
- deterministic correctness: the same inputs produce the same session and adaptation outcome

Visual polish and broad coverage matter later, but they are not the primary risk in the first local-first slice.

## Trust invariants

These are the minimum behaviors that must stay true.

### 1. Session progress is durable before the session ends

- the app persists in-progress session state locally as the run advances
- a partial session is still recoverable after close, crash, reload, or accidental navigation
- the user is never forced to "start over" because the app waited until final submit to save

### 2. Review data is stored on device before any later sync succeeds

- review completion must succeed locally even if the network is weak or absent
- review drafts or deferred-review state should survive reload
- `Saved on device` must mean the data is locally durable, not merely queued in memory

### 3. Adaptation is deterministic and explainable

- given the same prior session summary and rule inputs, the next-session outcome is always the same
- the outcome is limited to `progress`, `hold`, or `deload`
- the app can explain that outcome in plain language without hand-wavy AI logic

### 4. Offline use works after the first successful load

- after the app has loaded successfully once, the user can reopen it offline
- the user can still start, run, and review a locally available session
- the app must not make the user guess whether local data is safe

### 5. Updates activate only at safe boundaries

- discovering a new version must not force a reload during an active session
- if an update is ready, the app prompts at a safe boundary such as home, review completion, or explicit restart
- slightly stale code is safer than a surprise mid-session refresh

### 6. Schema changes preserve prior data

- Dexie or IndexedDB schema changes use explicit versioned upgrades
- representative old data survives migration to the new shape
- failed upgrades do not leave partial or ambiguous persistent state behind

## Persistence checkpoints

M001 should treat these as write points for local durability:

- session creation or duplication
- session start
- every block transition
- pause and resume
- swap, skip, shorten, or end-early actions
- review draft changes
- final review submission

The exact storage shape can wait for implementation planning, but the durability contract should not.

## Recommended test layers

### Domain tests

Use fast `Vitest` tests in a Node environment for:

- session lifecycle rules
- validation rules
- deterministic `progress / hold / deload` logic
- explanation-string selection for deterministic outcomes

### Persistence integration tests

Use `Vitest` plus `fake-indexeddb` for:

- Dexie schema setup
- write-as-you-go persistence
- reload and resume behavior
- migration and transaction integrity

### Focused UI interaction tests

Use `React Testing Library` plus `user-event` for a small number of screen-level tests that prove:

- the user can complete the review without typing
- the run flow exposes the right primary actions
- interruption or pending-review states surface the correct next action

These tests should stay flow-focused, not component-exhaustive.

### Real-browser smoke tests

Use `Playwright` for the browser-only contract:

- offline after first load
- service worker update prompt behavior
- believable end-to-end loop from session start through review and next-session carry-forward

## Minimum M001 smoke scenarios

### Smoke 1: Believable single-session loop

- open app
- start or duplicate a session
- edit one thing
- run the session with at least one transition
- submit review
- confirm the next session reflects the deterministic adaptation outcome

### Smoke 2: Offline survivability

- load the app once while online
- switch browser context offline
- reload or reopen
- confirm the app still starts and can continue the local session loop

### Smoke 3: Update safety

- simulate an update-ready state
- confirm the app does not force-refresh during an active session
- confirm the prompt appears only at a safe boundary

### Smoke 4: Migration preservation

- seed prior-version data
- upgrade the schema
- confirm key records still exist and remain usable

This can be a persistence integration test instead of a Playwright test unless browser reality proves otherwise.

## Minimum quality gates before M001 is called releasable

- TypeScript typecheck passes
- lint passes
- domain and persistence integration tests pass
- Playwright smoke tests pass
- production build succeeds with the chosen PWA configuration
- one manual pass happens on at least one iPhone and one Android device, including an offline sanity check

## Explicitly deferred

- coverage targets as a hard gate
- snapshot-heavy UI testing
- a large component-test suite
- full browser-matrix CI
- network-mocking infrastructure before real network features exist

## Decision links

- D38 -- resume depends on explicit run-state contracts (trust invariant 1)
- D39 -- persistent browser storage; local save is not backup (trust invariant 2)
- D41 -- updates activate at safe boundaries only (trust invariant 5)
- D69 -- Vitest + RTL + fake-indexeddb + Playwright smoke suite
- D70 -- write-as-you-go persistence at meaningful boundaries
- D71 -- Dexie schema changes require explicit versioned migrations

## Related docs

- `docs/milestones/m001-solo-session-loop.md`
- `docs/specs/m001-home-and-sync-notes.md`
- `docs/specs/m001-courtside-run-flow.md`
- `docs/specs/m001-adaptation-rules.md`
- `docs/decisions.md`
- `docs/research/m001-testing-quality-strategy.md`

