---
id: minimum-viable-test-stack
title: Minimum Viable Test Stack (Local-First PWA, Pre-Field Phase)
status: active
stage: validation
type: research
authority: depth-of-investment guidance for the M001 test stack and the Playwright / fake-indexeddb trust boundary
summary: "Lopsided, pre-field test stack: heavy domain, focused Dexie+fake-indexeddb, thin RTL, thin Chromium Playwright, thin-and-strict Axe; with the trust boundary where fake-indexeddb stops being truthful."
last_updated: 2026-04-16
depends_on:
  - docs/decisions.md
  - docs/research/m001-testing-quality-strategy.md
  - docs/specs/m001-quality-and-testing.md
related:
  - docs/research/local-first-pwa-constraints.md
  - docs/research/dexie-schema-and-architecture.md
  - docs/research/2026-04-12-v0a-runner-probe-feedback.md
---

# Minimum Viable Test Stack (Local-First PWA, Pre-Field Phase)

## Purpose

Sharpen the M001 test-stack depth model by deciding, per layer, how much to invest before a small (~5-tester) field cohort. This note deepens `docs/research/m001-testing-quality-strategy.md` with explicit investment levels, the trust boundary for `fake-indexeddb`, and the "deliberate under-investment" list.

It does not replace the test-stack decision in `D69` or the trust invariants in `docs/specs/m001-quality-and-testing.md`; it tells implementers how deep to go in each layer and where to stop.

## Use This Note When

- choosing which test layer owns a given trust claim
- arguing whether a would-be test belongs in Vitest, RTL, or Playwright
- deciding whether to expand a test layer, a CI matrix, or coverage gates
- justifying why `fake-indexeddb` alone cannot close a quota / upgrade / lifecycle risk
- reviewing a PR that adds tests and wanting to know if the depth is right

## Freeze Now

1. **The stack is intentionally lopsided, not balanced.** Heavy Vitest domain tests, focused Dexie+`fake-indexeddb` persistence tests, thin RTL, thin Chromium Playwright, thin-and-strict Axe. Anything that makes this look balanced is probably overbuilding.
2. **Playwright runs against a production build, not `vite dev`.** Service-worker behavior only materializes in a built app served via `vite preview` (or equivalent). Running e2e against the dev server silently disables the most important real-browser claims.
3. **Chromium only in CI.** Playwright's service-worker support is Chromium-based. Safari/iOS and Chrome/Android are covered by a short manual device pass, not by a CI matrix.
4. **WCAG 2.1 A/AA tags only in CI.** Use `wcag2a`, `wcag2aa`, `wcag21a`, `wcag21aa`. Treat `best-practice` as advisory. Open dialogs, drawers, and menus before scanning; Axe does not test hidden regions.
5. **`fake-indexeddb` isolation is per-test, not per-suite.** Install a fresh `IDBFactory` in `beforeEach` so one test's Dexie state cannot leak into another's.
6. **No coverage thresholds as a release gate.** Collect coverage as a diagnostic on `src/domain/**` and the persistence layer; do not let a global gate tempt junk tests into hooks and adapters.
7. **No visual regression, no cross-browser CI matrix, no Workbox unit tests.** These are maturity work, not pre-field work.

## The Trust Boundary For `fake-indexeddb`

`fake-indexeddb` is an in-memory Node implementation; its own README is explicit that data does not persist to disk and that its Web Platform Test pass rate trails real browsers.

### In scope for `fake-indexeddb` + Vitest

- schema declarations, indexes, uniqueness constraints
- query behavior and cursor semantics
- Dexie transaction rollback on error (atomicity proofs)
- idempotent writes
- version upgrades that occur within a single process opening a newer schema

### Out of scope for `fake-indexeddb` (move to Playwright Chromium or manual device pass)

- `QuotaExceededError` and eviction policy
- browser shutdown aborting open transactions
- multi-tab `blocked` / `versionchange` coordination
- service-worker lifecycle and `controllerchange`
- Safari private-browsing quotas and session-end data clearing
- install / `beforeinstallprompt` behavior
- iOS home-screen resume and OS backgrounding

### Rule of thumb

If the claim you want to prove involves more than one page, a real browser lifecycle, a service worker, quota policy, installability, or origin policy, it is a Playwright (or manual) problem. Writing more Vitest will not make `fake-indexeddb` truthful about those.

## Layer Depth Model

| Layer | Investment now | Owns (what it proves) | Does not own |
|---|---|---|---|
| Vitest domain | Heavy | verdict logic, edge cases, invariants, serialization, explanation-string selection | browser behavior, Dexie wiring, React rendering |
| Vitest + `fake-indexeddb` | Focused | schema, indexes, transaction rollback, saved records, simple in-process migrations | quota, eviction, multi-tab blocking, install/update lifecycle |
| React Testing Library + `user-event` | Thin | task-critical UI wiring, visible error states, form-to-domain mapping | component variations, snapshot churn, CSS fidelity |
| Playwright Chromium (built app) | Thin but real | warm-offline + retained local state, service-worker control, update-flow smoke, multi-page upgrade smoke | full browser matrix, visual regression, device-cloud coverage |
| `@axe-core/playwright` | Thin and strict | obvious WCAG 2.1 A/AA violations on visible routes and visible modal states | meaning, task clarity, full keyboard/screen-reader UX |

## Trust Invariants -> Owning Layer

Use this table to pick the cheapest layer that can actually prove each invariant. Source invariants are in `docs/specs/m001-quality-and-testing.md`.

| Trust claim | Owning layer |
|---|---|
| Rules engine returns the right verdict for known + boundary cases | Vitest domain, table-driven |
| Rules engine is deterministic and monotonic under worsening inputs | Vitest domain (optional: tiny `fast-check` later if invariants stay compact) |
| A logical save is atomic in local storage (rollback on partial failure) | Vitest + Dexie + `fake-indexeddb` |
| Write-as-you-go persistence survives reload (D70) | Vitest + `fake-indexeddb` for the logic, Playwright Chromium smoke for the real browser stack |
| Dexie schema upgrade preserves representative old data (D71) | Vitest + `fake-indexeddb` for the upgrade function; Playwright multi-page test for the `blocked` / `versionchange` path |
| App works offline after first online load | Playwright Chromium smoke against built app |
| Update activates at a safe boundary, not mid-session (D41) | Playwright Chromium smoke tied to waiting / `skipWaiting` / `controllerchange` |
| Visible critical screens have no obvious WCAG 2.1 A/AA defects | Playwright + Axe on visible routes and opened modals |
| Safari/iOS quota, eviction, installability, embedded-WebKit weirdness | Not CI. Short manual device pass before the cohort. |

## Apply To Current Setup

The current `app/` harness already has the right dependencies (`vitest`, `@testing-library/react`, `@testing-library/user-event`, `fake-indexeddb`, `@playwright/test`, `@axe-core/playwright`). The alignment gaps this research surfaces are narrow and concrete:

1. **`app/playwright.config.ts` runs against `npm run dev`.** The dev server has `VitePWA({ devOptions: { enabled: false } })`, so the service worker is never registered under test. Switch `webServer.command` to `npm run build && npm run preview` (port `4173`, bound to `127.0.0.1`) and add `use.serviceWorkers: 'allow'`. Set `fullyParallel: false` and `workers: 1` in CI.
2. **`app/src/test-setup.ts` imports `fake-indexeddb/auto` only.** Add a `beforeEach` that installs a fresh `IDBFactory` on `globalThis.indexedDB` and an `afterEach` that runs RTL `cleanup()`. This prevents cross-file state leakage.
3. **`.github/workflows/app-ci.yml` does not run Playwright.** Add a second job (or step) that installs Chromium (`npx playwright install --with-deps chromium`) and runs `npm run test:e2e -- --project=chromium`. Upload `playwright-report/` as an artifact.
4. **Three Playwright smokes belong on the M001 implementation roadmap, not in v0a:** warm-offline + preserved local state, SW update-flow (`skipWaiting` -> `controllerchange`), and a multi-page `blocked` upgrade. Each one requires product behavior that v0a does not yet implement (e.g. explicit update prompt). Write them alongside the features, not before them.
5. **Audit the existing axe spec against `region`-rule false positives only if they appear.** For app-level routes, keep `region` on. Do not preemptively disable rules.

The `autoUpdate` + `immediate` service-worker policy in `app/vite.config.ts` still conflicts with `D41` (safe-boundary updates). That is an M001 implementation decision tracked in `docs/research/2026-04-12-v0a-runner-probe-feedback.md` (`HARD-02` / `FB-07`); it is out of scope for this note.

## Validate Later

- Whether one or two `fast-check` invariants on the verdict engine pay for themselves. Start example-based; add property-based only when a crisp invariant (determinism, monotonicity, order-independence, round-trip) becomes natural.
- Whether a `QuotaExceededError` rehearsal on Safari/iOS needs its own dedicated manual checklist. If storage durability becomes mission-critical for the cohort, add a short rehearsal.
- Whether a visual-regression layer becomes worth the false-alarm cost once the styling system stops shifting weekly.
- Whether the manual device pass needs to expand to a BrowserStack-style matrix. Expand only if the cohort surfaces real browser divergence.

## Deliberate Under-Investment

- **No component-testing empire.** Brittle DOM-shape assertions and snapshot churn are not how pre-field trust is built.
- **No coverage % as a release signal.** Use coverage as a diagnostic on `src/domain/**` and persistence code; do not let a global gate force junk tests.
- **No visual regression yet.** UI is still moving.
- **No cross-browser CI matrix.** Chromium + one short manual Safari/iOS and Chrome/Android pass.
- **No unit tests against Workbox or vite-plugin-pwa internals.** Treat the SW as an integration boundary; own the glue with one browser smoke.
- **No property-based testing expansion on day one.** One or two invariants only, and only if they are short.
- **No pretending automated accessibility means "accessible."** Manual pass owns keyboard traversal, focus retention, live-region announcements, and plain-language clarity.

## Open Questions

- How exactly should the update-flow prompt behave at safe boundaries (home, post-review, explicit restart)? Needed before the SW update-flow smoke can be written. See `D41` and `FB-07` in `docs/research/2026-04-12-v0a-runner-probe-feedback.md`.
- Which Dexie schema change is the first realistic test case for the blocked-upgrade smoke? Needed before the multi-page test is meaningful.
- Is there a lightweight signal we can capture in the manual device pass to upgrade the "eviction / quota" invariant from "manual" to "automated" later? Possibly origin-private-filesystem instrumentation; out of scope for M001.

## Source Families

- `fake-indexeddb` README and WPT pass-rate comparison
- MDN IndexedDB, Storage, and quota guidance
- Dexie `Version.upgrade()`, `blocked`, and `versionchange` docs
- Playwright service-worker and accessibility testing guides
- vite-plugin-pwa testing and `useRegisterSW()` React docs
- Workbox advanced update-flow guidance (waiting worker, `messageSkipWaiting`, `controllerchange`)
- Deque axe-core tag and rule docs; Accessibility Insights tag scope
- Excalidraw, TinyBase, RxDB, PouchDB public test-stack shapes

## Related

- `docs/research/m001-testing-quality-strategy.md`
- `docs/specs/m001-quality-and-testing.md`
- `docs/research/local-first-pwa-constraints.md`
- `docs/research/dexie-schema-and-architecture.md`
- `docs/research/2026-04-12-v0a-runner-probe-feedback.md`
- `research-output/minimum-viable-test-stack-local-first-pwa.md` (frozen raw research)
