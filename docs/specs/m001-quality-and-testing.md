---
id: M001-quality-testing
title: M001 Quality And Testing
status: active
stage: validation
type: spec
authority: trust invariants, test layers, minimum verification bar for M001
summary: "Trust invariants, test layers, and minimum verification bar for M001."
last_updated: 2026-04-16
depends_on:
  - docs/milestones/m001-solo-session-loop.md
  - docs/research/m001-testing-quality-strategy.md
  - docs/research/minimum-viable-test-stack.md
decision_refs:
  - D38
  - D39
  - D41
  - D69
  - D70
  - D71
  - D94
---

# M001 Quality And Testing

## Purpose

Define the trust invariants, test layers, and minimum verification bar for the first implementation-ready M001 slice.

The v0a validation prototype intentionally deferred automated testing (Vitest, RTL, Playwright) to prioritize speed-to-sand. Full M001 implementation must build this test stack. See `docs/research/2026-04-12-v0a-runner-probe-feedback.md` for as-built deviations.

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

## Depth of investment

The stack is intentionally lopsided, not balanced. The trust claims are not evenly distributed across layers, and the tests should not be either. Source guidance: `docs/research/minimum-viable-test-stack.md`.

| Layer | Investment | Owns | Does not own |
|---|---|---|---|
| Vitest domain | Heavy | verdict logic, edge cases, invariants, serialization, explanation-string selection | browser behavior, Dexie wiring, React rendering |
| Vitest + `fake-indexeddb` | Focused | schema, indexes, transaction rollback, saved records, in-process migrations | quota, eviction, multi-tab blocking, install/update lifecycle |
| React Testing Library + `user-event` | Thin | task-critical UI wiring, visible error states, form-to-domain mapping | component variations, snapshot churn, CSS fidelity |
| Playwright Chromium (built app) | Thin but real | warm-offline + retained local state, service-worker control, update-flow smoke, multi-page upgrade smoke | full browser matrix, visual regression, device-cloud coverage |
| `@axe-core/playwright` | Thin and strict | obvious WCAG 2.1 A/AA violations on visible routes and opened modals | meaning, task clarity, full keyboard / screen-reader UX |

## Trust invariants -> owning layer

| Trust claim | Owning layer |
|---|---|
| Session progress is durable before the session ends (invariant 1; D38, D70) | Vitest domain + Vitest + `fake-indexeddb`; real-browser confirmation via Playwright warm-reload smoke |
| Review data is stored on device before any later sync (invariant 2; D39, D70) | Vitest + `fake-indexeddb`; real-browser confirmation via Playwright smoke |
| Adaptation is deterministic and explainable (invariant 3) | Vitest domain, table-driven across the full decision table |
| Offline use works after the first successful load (invariant 4) | Playwright Chromium smoke against a built app |
| Updates activate only at safe boundaries (invariant 5; D41) | Playwright Chromium update-flow smoke (waiting / `skipWaiting` / `controllerchange`) |
| Schema changes preserve prior data (invariant 6; D71) | Vitest + `fake-indexeddb` for the upgrade function; Playwright multi-page test for the `blocked` / `versionchange` path |
| Visible critical screens have no obvious WCAG 2.1 A/AA defects (D94) | Playwright + Axe on visible routes and opened modals |
| Safari/iOS quota, eviction, installability, and embedded-WebKit weirdness | Not CI. Short manual device pass before the cohort. |

## The `fake-indexeddb` trust boundary

`fake-indexeddb` is an in-memory Node implementation; its Web Platform Test pass rate trails real browsers. Use it for deterministic storage semantics; escalate to Playwright for anything else. See `docs/research/minimum-viable-test-stack.md` for the full boundary.

- In scope: schema declarations, indexes, uniqueness constraints, query behavior, Dexie transaction rollback, idempotent writes, in-process version upgrades.
- Out of scope: `QuotaExceededError`, eviction, browser shutdown aborting transactions, multi-tab `blocked` / `versionchange`, SW lifecycle, Safari private-browsing quotas, install prompt, iOS resume.

## Test harness conventions

These are the minimum conventions the M001 test harness must honor.

1. **Per-test `IDBFactory` isolation.** The Vitest setup file installs a fresh `IDBFactory` on `globalThis.indexedDB` in `beforeEach` so Dexie state cannot leak across tests, then runs `@testing-library/react` `cleanup()` in `afterEach`. `fake-indexeddb/auto` alone is not sufficient.
2. **Playwright runs against the built app.** `webServer.command` invokes `npm run build && npm run preview`, binds to `127.0.0.1:4173`, and `use.serviceWorkers: 'allow'` is set. Running e2e against `npm run dev` silently disables the service worker (vite-plugin-pwa `devOptions.enabled: false`) and invalidates the most important real-browser claims.
3. **Chromium only in CI.** Playwright service-worker support is Chromium-based; `fullyParallel: false` and `workers: 1` under `CI`.
4. **WCAG 2.1 A/AA tags only.** Axe runs with `wcag2a`, `wcag2aa`, `wcag21a`, `wcag21aa`. `best-practice` is advisory. Open dialogs, drawers, and menus before scanning; Axe skips hidden regions.
5. **No coverage gate.** Collect coverage on `src/domain/**` and the persistence layer as a diagnostic; do not enforce a global threshold.

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

### Accessibility checks

Use `Playwright` plus `@axe-core/playwright` to verify WCAG 2.1 AA compliance on each key screen state:

- home, setup, safety check, run (active and paused), error states
- checks run against `wcag2a`, `wcag2aa`, `wcag21a`, `wcag21aa` rule tags
- tests live in `app/e2e/accessibility.spec.ts`

This catches color-contrast failures, missing labels, and other machine-detectable violations. It does not replace manual outdoor testing for readability in direct sun.

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
- Playwright accessibility checks pass (WCAG 2.1 AA via axe-core)
- production build succeeds with the chosen PWA configuration
- one manual pass happens on at least one iPhone and one Android device, including an offline sanity check

## Explicitly deferred

- coverage targets as a hard gate
- snapshot-heavy UI testing
- a large component-test suite
- full browser-matrix CI
- visual regression (screenshot baselines)
- unit tests against Workbox or vite-plugin-pwa internals
- property-based testing beyond one or two crisp invariants on the verdict engine
- network-mocking infrastructure before real network features exist
- automated install-prompt gating (`beforeinstallprompt` availability varies)
- simulated quota / eviction / OS-backgrounding scenarios inside the normal suite

## Decision links

- D38 -- resume depends on explicit run-state contracts (trust invariant 1)
- D39 -- persistent browser storage; local save is not backup (trust invariant 2)
- D41 -- updates activate at safe boundaries only (trust invariant 5)
- D69 -- Vitest + RTL + fake-indexeddb + Playwright smoke suite
- D70 -- write-as-you-go persistence at meaningful boundaries
- D71 -- Dexie schema changes require explicit versioned migrations
- D94 -- accent color meets WCAG AA contrast; verified by axe-core in Playwright

## Related docs

- `docs/milestones/m001-solo-session-loop.md`
- `docs/specs/m001-home-and-sync-notes.md`
- `docs/specs/m001-courtside-run-flow.md`
- `docs/specs/m001-adaptation-rules.md`
- `docs/decisions.md`
- `docs/research/m001-testing-quality-strategy.md`
- `docs/research/minimum-viable-test-stack.md`

