---
id: app-architecture-guidance
title: App Architecture Guidance
status: active
stage: validation
type: ops
authority: durable architecture principles, layer rules, extension points, testing posture, and review gates for the app/ workspace
summary: "Durable, principle-and-routing-oriented guide that future agents read before adding features to app/. Captures the layer model, decomplecting principle, DRY/OCP / SOLID posture, forward seams, testing posture, review gates, anti-patterns, and a routing checklist for new features. Points at canonical product docs rather than redefining them."
last_updated: 2026-04-28
depends_on:
  - AGENTS.md
  - docs/vision.md
  - docs/decisions.md
  - docs/prd-foundation.md
  - app/README.md
  - .cursor/rules/data-access.mdc
  - .cursor/rules/component-patterns.mdc
  - .cursor/rules/testing.mdc
  - .cursor/rules/routing.mdc
  - docs/research/m001-testing-quality-strategy.md
  - docs/research/minimum-viable-test-stack.md
related:
  - docs/plans/2026-04-26-app-architecture-pass.md
  - app/src/model/
  - app/src/domain/
  - app/src/services/
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

# App Architecture Guidance

## Purpose

Give future agents one durable, principle-oriented read for the `app/` workspace before they add features, refactor modules, or write tests. This is the architectural compass — it does NOT redefine product canon (`docs/vision.md`, `docs/decisions.md`, `docs/prd-foundation.md`), repeat current status (`docs/status/current-state.md`, `app/README.md`), or duplicate `.cursor/rules/`. It complements them.

## Use This Doc When

- starting a new app feature, refactor, or test pass
- deciding where a new piece of code belongs (model? domain? services? controller? platform?)
- choosing the right test tier
- adding a new `successMetric.type`, route, capture window, or persisted field
- reviewing a pull request that touches multiple layers

## Not For

- product direction or milestone scope (use `docs/vision.md`, `docs/decisions.md`, `docs/prd-foundation.md`, `docs/milestones/`)
- current shipped state (use `docs/status/current-state.md` and `app/README.md`)
- detailed UI / copy guidance (use `.cursor/rules/courtside-copy.mdc` and design docs)
- documenting the latest implementation diary (lands in dated plans under `docs/plans/`)

## Update When

- a layer boundary or layer name changes
- a new extension-point pattern (strategy registry, contracts file, seam) lands
- the post-unit / holistic red-team gate posture changes
- the testing pyramid map materially changes

## Layer Model

```
data ─► model ─► domain ─► services ─► hooks ─► controllers ─► screens / components
                                                                    ▲
                                                              platform
contracts ─────────────────────────────────────────────────────────┘
```

Dependencies point inward. Each outer ring may import from inner rings; the reverse is forbidden. CI greps and the layer rules in `.cursor/rules/data-access.mdc` enforce the boundary.

| Layer | Path | Responsibility | Forbidden imports |
|-------|------|----------------|-------------------|
| **Data** | `app/src/data/` | Catalog constants (drills, archetypes). Static and pure. | React, Dexie, services. |
| **Model** | `app/src/model/` | Pure product types: `SessionPlan`, `ExecutionLog`, `PerDrillCapture`, `SessionReview`, plus forward seams `SessionParticipant[]`, `SkillVector`, `CoachPayload`. | React, Dexie, services, platform. |
| **Domain** | `app/src/domain/` | Pure rules: capture eligibility / merge / aggregate (`domain/capture/`), route policy (`domain/runFlow/`), session-assembly, `executionState`, `sessionParticipants`, scoring. | `db/`, `services/`, React, `platform/`. |
| **Services** | `app/src/services/` | Dexie IO + orchestration. `services/session/`, `services/review/` (submit / drafts / expire / cohort / bundle), `services/timer.ts`, `services/storageMeta.ts`, `services/softBlock.ts`, `services/export/sessionExport.ts` (per-session adapter), `services/export.ts` (founder dump). | React, controllers, screens. |
| **Platform** | `app/src/platform/` | Browser runtime ONLY: `vibrate`, audio cues, screen wake lock. No product semantics. | `db/`, `services/`, `domain/`. |
| **Use-case hooks** | `app/src/hooks/` | `useSessionRunner` and friends — ordered service calls + serial mutation queue. | Direct UI policy. |
| **Controllers** | `app/src/screens/**/use*Controller.ts` | Thin assemblers: route policy + use-case hook + platform hooks + local UI state. | Direct Dexie writes, inline route strings, `navigator.*` calls. |
| **Screens / components** | `app/src/screens/`, `app/src/components/` | Render and dispatch UI events. No Dexie, no `navigator.*`, no product policy in JSX. | `db/`, `services/` (route through controllers / hooks). |
| **Contracts** | `app/src/contracts/` | P12 `screenContracts.ts`; transitional `runFlowInteractionContract.ts` + `SUNSET_RUN_FLOW_CONTRACT`. | Anything beyond the contract types. |

## Decomplecting Principle

The `app/` architecture aggressively separates concerns that historically tangled:

1. **Product model vs. persistence.** Product shapes live in `model/`; row shapes in `db/types.ts` re-export them and may add persistence-only sentinels. Domain code reads model types only.
2. **Pure rules vs. IO.** Eligibility, merge, aggregation, route-policy, meaningful-draft predicates are pure functions in `domain/`. Anything that touches Dexie or `Date.now()`-derived state lives in `services/` or controllers.
3. **Route policy vs. navigation.** "Where do I go after X happens?" is a pure function in `domain/runFlow/`. `useNavigate` lives in controllers and applies the descriptor.
4. **Browser runtime vs. product semantics.** `navigator.vibrate`, `AudioContext`, `WakeLock` live in `platform/`. Screens and controllers consume the platform API; they never branch on `navigator.*`.
5. **Screen contract vs. screen render.** P12 (`action` / `signal` / `reason`) is encoded in `contracts/screenContracts.ts`. JSX renders; the contract is type-checked separately.
6. **Use-case orchestration vs. wiring.** `useSessionRunner` owns the serial mutation queue and ordered service calls. Controllers compose use-case hooks; they do not re-implement queue semantics.

## DRY & OCP Posture

Every architectural extension point has ONE public home. Adding a new variant SHOULD edit one place.

- **New `successMetric.type`** → register a `MetricTypeStrategy` entry in `app/src/domain/capture/metricStrategies.ts`. No screen edits. No controller edits.
- **New route** → add a `routePaths` entry, a `routes` builder, an `<Route>`, AND a P12 entry in `app/src/contracts/screenContracts.ts`. The TS `Record<RouteKey, ScreenContract>` shape will refuse to compile without the contract.
- **New post-block routing variant** → extend `app/src/domain/runFlow/postBlockRoute.ts` (and its pure unit test). No controller branching.
- **New persisted field** → add to the model first; persistence row in `db/types.ts` re-exports. If the field is persistence-only (e.g. `auditTrace`), keep it on the row interface, not on the model.
- **New participant role** → add to `SessionParticipantRole` and update `defaultParticipantsForPlayerCount` in `app/src/domain/sessionParticipants.ts`. Readers of `getSessionParticipants(plan)` pick it up automatically.
- **New export field for Phase 1.5** → add to `services/export/sessionExport.ts`. The adapter test pins the shape.

If a "new variant" is forcing edits across screens, services, AND domain, the extension point is in the wrong place. Stop and route the extension into a single home.

## SOLID / DIP Posture

- **Single responsibility:** modules have one reason to change. `services/review/` is the canonical example — submit / expire / drafts / cohort / bundle each live in their own file.
- **Open/closed:** strategy registries (`metricStrategies.ts`), per-route contracts (`screenContracts.ts`), and per-skill rollups (`SkillVector`) make the app open for extension without modification of the framing module.
- **Dependency inversion:** dependencies point inward. Domain depends on model. Services depend on domain + model. Controllers depend on services + domain + platform. Screens depend on controllers.
- **Interface segregation:** controllers expose only the props the screen renders. Use-case hooks expose only the actions a controller needs.
- **Liskov:** persistence row shapes are extensions of model shapes. Reading a model object never has to know whether it came from Dexie or a fresh in-memory build.
- **Adapters live at boundaries:** `services/` adapts model ↔ Dexie. `services/export/sessionExport.ts` adapts model → JSON. Controllers adapt model → React props. No mapping logic leaks into screens.

## Forward Seams

Lay these now while in the relevant modules. No new UX ships.

| Seam | Home | Future need |
|------|------|------------|
| `SessionParticipant[]` | `app/src/model/participant.ts`, projected via `domain/sessionParticipants.getSessionParticipants` | `D115`/`D116`/`D117` persistent pair, partner profiles, team consent. |
| `SkillVector` | `app/src/model/skillVector.ts` | `D121` per-skill rollup; M002+ adaptation engine. |
| `ExportSession` adapter | `app/src/services/export/sessionExport.ts` (`buildExportSession`) | Phase 1.5 share-sheet / clipboard / file export. |
| `CoachPayload` type | `app/src/model/coachPayload.ts` | Phase 2 / `D106` coach sharing. |
| Adaptation-replay hook | future `domain/adaptation/` consuming `SessionReview[]` from model | `D113` / `V0B-15`-style replay against model arrays, not Dexie rows. |

A seam earns its place in `model/` only when it points at a canonical future need (a `D###` decision, a roadmap milestone, or a persistent-pair / coach / cloud peer surface). Speculative types are not seams — they are dead code.

## Testing Posture

The full pyramid map lives in `.cursor/rules/testing.mdc`. The shorthand:

1. **Domain (Vitest pure)** — capture eligibility / merge / aggregate / window classification / meaningful-draft / `postBlockRoute` / metric strategies / participant projection / export-adapter shape / P12 registry exhaustiveness.
2. **Services (Vitest + `fake-indexeddb`)** — submit / expire / draft merge / cohort / bundle / schema invariants / model round-trip.
3. **Controllers (RTL with mocked `useSessionRunner`)** — wiring, route outcomes, error branches.
4. **`useSessionRunner` (RTL on the real runner)** — only to guard the serial-queue invariant.
5. **Components (RTL)** — `components/ui/` primitives.
6. **Screen integration (RTL)** — preroll hint, draft persistence interlock; only when component-level coverage cannot prove the wiring.
7. **Playwright (`app/e2e/`)** — full flows, PWA / IndexedDB persistence, Drill Check ↔ Review draft cross-screen invariants.

Lowest-useful-tier rule: if a behavior can be proven at a lower tier, it MUST be. RTL must not re-assert domain truths. Playwright must not re-prove anything covered at services / domain.

## Review Gates

Every implementation unit closes with a red-team gate before the next unit starts. Severity classification:

- **P0 / P1** — fix before moving to the next unit unless the user explicitly accepts a temporary risk.
- **P2** — fix now when local and cheap; otherwise capture as a follow-up with owner, target file/module, and reason for deferral.
- **P3** — capture only if it clarifies future work; do not churn the codebase for style-only findings.
- **False positive** — record the rationale briefly so the same issue is not re-litigated.

Suggested review lenses: correctness (state transitions, data loss, concurrency), architecture (layer direction, dependency inversion, circular imports, hidden shared state), maintainability (file size, naming, cohesive modules, DRY, SOLID, over-abstraction), testing (right-tier coverage, missing red cases, brittle RTL), product vision (P1 courtside friction, P10 local-first, P12 action/signal/reason, P13 pair-first framing), reliability (Dexie failures, schema-blocked behavior, browser runtime quirks, persistence-before-navigation).

After every set of unit-level red-team gates, run a holistic gate across the entire branch before declaring the work complete. The holistic gate checks layer integrity, decomplecting goals, DRY/OCP, SOLID, product vision, future seams, reliability, testing, docs, and git hygiene as a connected system.

## Product Principle Reminders

- **P1 — Courtside friction.** Every controller and screen pays the courtside-friction cost. New product policy that increases tap count or screen density needs an explicit P1 trade-off in review.
- **P10 — Local-first.** Dexie is the source of truth. Sync, cloud peer, and coach payload are forward seams (`D118`, `D106`); they do NOT change v0b's local-first behavior.
- **P12 — One clear action / signal / reason.** Every route screen exports a P12 contract entry in `contracts/screenContracts.ts`. Settings is the only intentional exemption.
- **P13 — Pair-first framing.** `SessionParticipant[]` and `getSessionParticipants(plan)` consume the array, not `playerCount`. Pair voice authoring lives in `data/drills.ts`.

## Anti-Patterns

- **A new state-management framework.** Reach for `useReducer`, a context, or a `useSyncExternalStore` only after the existing pattern can be shown to fail. Do not introduce Redux / Zustand / Jotai / etc. by default.
- **Repositories without duplication pressure.** A `XxxRepository` class for a single Dexie table is ceremony, not architecture.
- **UI-local product policy.** A `.tsx` file deciding "this drill is count-eligible" or "this metric shows in review" is a layer violation. Route it through `domain/capture/`.
- **Controller accretion.** A controller exceeding ≈200 LOC has likely absorbed something that belongs in a use-case hook, a platform hook, a domain helper, or a route-policy module. Decompose along the true axis.
- **Component props shaped like DB rows.** Components should receive product-shaped props (`{ session, captures }`), not Dexie row shapes. Adapters live at the boundary.
- **Docs becoming a second source of truth.** This guide routes; canonical product canon stays in `docs/vision.md`, `docs/decisions.md`, `docs/prd-foundation.md`, and `docs/specs/`.
- **A second `screenContract` registry.** P12 lives in `app/src/contracts/screenContracts.ts`. Per-screen `screenContract` exports reading from that registry are fine; a separate registry is duplicate authority.
- **Inline `navigator.vibrate(...)` / `navigator.wakeLock.request(...)`.** All browser-runtime API calls go through `app/src/platform/`.
- **A god strategy registry.** A `MetricTypeStrategy` entry stays declarative (capture surface flags, copy slot, aggregator participation). It does not embed orchestration logic.

## Decision Checklist For New Features

When you hold the new-feature ticket in hand, walk this checklist before writing code.

1. **Where does the product concept live?** Add or extend the type in `app/src/model/`.
2. **Which domain rule owns it?** Identify (or create) the pure function in `app/src/domain/`. Capture-related → `domain/capture/`. Route-related → `domain/runFlow/`. Session-shape-related → `domain/session*`.
3. **Which service writes / reads it?** Add to the matching module under `app/src/services/`. Use `fake-indexeddb`-backed services tests at the lowest tier that proves the IO.
4. **Which use-case hook orchestrates it?** Usually `useSessionRunner`. If the work is fundamentally outside the run-loop, propose a new use-case hook in `app/src/hooks/`.
5. **Which controller assembles it?** A `use<Route>Controller.ts` under `screens/<route>/`. Route policy from `domain/runFlow/`. Browser runtime from `platform/`. Local UI state stays in the controller.
6. **Which screen renders it?** Thin: read controller output, render, dispatch events.
7. **Which P12 contract entry covers it?** If a new route landed, the contract is mandatory.
8. **Which red test proves it?** Lowest useful tier. If you wrote a controller branch, the controller test covers the branch. If you wrote a domain rule, the domain test covers the truth table.
9. **Which agent surfaces need updating?** `app/README.md` for material architecture changes, `.cursor/rules/` for layer / extension-point edits, `docs/status/current-state.md` for shipped behavior, `docs/catalog.json` for new plan / spec entries.

## Cold-Start Routing For App Work

A future agent starting cold on app work reads (in order):

1. `AGENTS.md` for repo-wide orientation.
2. `docs/catalog.json` for routing.
3. `app/README.md` for current app state and the architecture quick scan.
4. This guide (`docs/ops/app-architecture-guidance.md`) for the layer model and extension-point rules.
5. `.cursor/rules/data-access.mdc`, `.cursor/rules/component-patterns.mdc`, `.cursor/rules/routing.mdc`, `.cursor/rules/testing.mdc` as the focused rules.
6. The narrowest spec / plan / research note for the task at hand (via `docs/catalog.json`).

If the cold-start path takes longer than two minutes to land an agent at the right layer for a task, a fix in this guide or in the catalog is overdue.
