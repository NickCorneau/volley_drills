---
id: app-workspace
title: App Workspace
status: active
stage: validation
type: workspace-readme
authority: current web app prototype state and implementation guardrails
last_updated: 2026-05-02
depends_on:
  - docs/prd-foundation.md
  - docs/decisions.md
  - docs/specs/m001-courtside-run-flow.md
  - docs/specs/m001-home-and-sync-notes.md
  - docs/plans/2026-04-16-003-rest-of-v0b-plan.md
---

# App Workspace

This folder holds the runnable Phase 0 validation prototype for Volleycraft. It is the v0b Starter Loop, which is **feature-complete** as the D91 field-test artifact (`D119`).

## App architecture quick scan

Layers (dependencies point inward; see `docs/ops/app-architecture-guidance.md` for the full checklist):

| Layer | Path | Owns |
|-------|------|------|
| **Model** | `src/model/` | Pure product types (`SessionPlan`, captures, reviews, forward seams). No React, Dexie, or services. |
| **Domain** | `src/domain/` | Pure rules; imports `model/` + `data/` only. Capture policy lives in `domain/capture/` (metric strategy registry). Route policy for the run loop: `domain/runFlow/`. |
| **Services** | `src/services/` | Dexie IO and orchestration. Session writes: `services/session/` (barrel `services/session/index.ts`). Review: `services/review/`. Founder table export: `services/export.ts`; per-session Phase 1.5 adapter: `services/export/` (`buildExportSession`). |
| **Platform** | `src/platform/` | Browser runtime only (audio re-exports, wake lock, `vibrate`). Controllers import here; domain must not. |
| **Use-case hooks** | `src/hooks/` | e.g. `useSessionRunner` — serial mutation queue, ordered service calls. |
| **Controllers** | `src/screens/**/use*Controller.ts` | Thin assemblers: route policy + runner + platform + local UI state. |
| **Screens / components** | `src/screens/`, `src/components/` | Render and dispatch events; no Dexie; no product policy in JSX. |
| **Contracts** | `src/contracts/` | P12 screen registry (`screenContracts.ts`); transitional run-flow characterization (`runFlowInteractionContract.ts` + sunset list). |

**Testing pyramid** (lowest tier that can prove the behavior wins; do not re-assert domain truths in RTL):

1. **Domain (Vitest, pure)** — eligibility, merge, aggregation, `postBlockRoute`, meaningful-draft, capture-window classification, export adapter shape, P12 route exhaustiveness.
2. **Services (Vitest + `fake-indexeddb`)** — submit / expire / draft merge, bundle load, schema invariants, session round-trip.
3. **Hooks / controllers (RTL)** — wiring and navigation with mocked `useSessionRunner` where appropriate.
4. **`useSessionRunner` (RTL or dedicated tests)** — real runner only for the serial-queue invariant.
5. **Components (RTL)** — focus on `components/ui/` primitives; avoid duplicating domain assertions.
6. **Playwright (`e2e/`)** — full flows, PWA/storage, Drill Check ↔ Review draft persistence.

## Current status

> **Before making changes**, read `docs/plans/2026-04-16-003-rest-of-v0b-plan.md` for the v0b status registry (what landed, what was cut, what was deferred post-D91). The older v0a feedback log at `docs/research/2026-04-12-v0a-runner-probe-feedback.md` is retrospective only.

- The app is the **v0b Starter Loop PWA**, feature-complete as of 2026-04-19 and deployed at https://volleydrills.nicholascorneau.workers.dev. It runs the full Home → Onboarding → Setup → Tune today → Safety → Run → Check → Transition → Review → Complete loop with deterministic session assembly, today-only focus steering, a 0–10 RPE chip grid, drill-grain difficulty/count capture, optional streak metric capture, a three-case honest session summary, the full Finish-Later review contract (2h cap), a flat 4-row Home priority model with a soft-block review modal, Repeat paths from completed sessions, a JSON data export, block-end audio cues, and a Swap action on RunScreen.
- **Routes**: `/` (Home), `/onboarding/skill-level`, `/onboarding/todays-setup`, `/setup`, `/tune-today`, `/safety`, `/run`, `/run/check`, `/run/transition`, `/review`, `/complete?id=…`, `/settings`.
- **Pre-run flow**: all fresh setup, draft, and repeat paths create or open the singleton `SessionDraft`, route through `/tune-today` for Recommended / Passing / Serving / Setting, then continue to Safety. Tune today regenerates the saved draft through `services/session/regenerateDraftFocus.ts`; Safety remains readiness-only.
- **Dexie schema (v6)**: `sessionPlans`, `sessionDrafts` (singleton), `executionLogs`, `sessionReviews` (with `status: 'submitted' | 'skipped' | 'draft'`, capture-window fields per `V0B-30`, optional `perDrillCaptures` per `D133`, and optional streak `metricCapture` per `D134`), `timerState`, `storageMeta` (key-value: onboarding progress, UX flags, last player mode). Schema in `src/db/schema.ts`. Migrations backfill `status`, `onboarding.completedAt`, and preserve the v5 drill-grain boundary while v6 adds optional streak capture. The Dexie database name stays `volley-drills` to preserve any pre-rename tester data (see `D125`).
- **PWA**: `vite-plugin-pwa` with `registerType: 'prompt'` (safe-boundary updates via `useRegisterSW`, per `D41` / `V0B-20`). `navigator.storage.persist()` fires on the session-start user gesture (`V0B-25`). Three-state posture-sensitive save copy on `CompleteScreen.tsx` via `hooks/useInstallPosture.ts` + `lib/storageCopy.ts` (`V0B-24`). See `docs/research/local-first-pwa-constraints.md`.
- **Timer**: timestamp-based with 5s flush to `timerState`, wake-lock during active blocks, 3-2-1 pre-roll with audio tick, block-end beep via `platform/` (re-exports `lib/audio.ts`; foreground `AudioContext`; narrow slice of `V0B-08`).
- **Safety**: binary pain gate + training recency + heat CTA, answer-first consequence copy (`V0B-16`), lighter-session override with confirmation, regulatory-posture copy audit landed (`V0B-18`, `D86`).
- Product direction lives in `docs/`; do not treat the prototype UI as final production design.
- M001 is proceeding in `D130` founder-use mode. `D91` remains preserved as the stranger-cohort validation gate for the 2026-07-20 re-eval or an earlier trigger, but it no longer blocks app implementation work.

## v0b posture notes

- **Feature-complete, not production-polish.** v0b is the D91 field-test artifact. Cuts listed in `docs/plans/2026-04-16-003-rest-of-v0b-plan.md` §2 (full reason-trace engine, session history surface, weekly receipt, etc.) are intentional and return in the post-D91 self-coached follow-on (`D124`).
- **Body-scale shift and Run-screen content density are deferred pending D91 evidence** per `D127`. `--text-body` / `--text-body-secondary` tokens are scaffolded in `src/index.css` so the eventual migration is a one-line retune.
- Known build note: `vite-plugin-pwa@1.2.0` declares peer support through Vite 7; app uses Vite 8 (builds clean but peer warning on install).
- Root-level `*.png` files in `app/` are captured validation screenshots from the v0a era, not runtime app assets.

## Local Run Instructions

To verify the app locally:

```bash
cd app
npm install
npm run dev
```

Expected running URL: `http://localhost:5173`

For build and style verification:

```bash
cd app
npm run build
npm run lint
```

Generated-plan diagnostics are checked from this workspace:

```bash
cd app
npm run diagnostics:report:check
npm run diagnostics:triage:check
```

## Tests

Unit and component tests (Vitest + Testing Library + fake-indexeddb):

```bash
npm test
npm run test:watch
```

End-to-end tests (Playwright, starts dev server automatically):

```bash
npm run test:e2e
npm run test:e2e:headed
```

The E2E suite includes functional flow tests (`e2e/session-flow.spec.ts`, `e2e/edge-cases.spec.ts`) and WCAG 2.1 AA accessibility checks via `@axe-core/playwright` (`e2e/accessibility.spec.ts`).

## Deploy

Live Worker: https://volleydrills.nicholascorneau.workers.dev. Config in `wrangler.jsonc`, full runbook in `docs/ops/deploy-cloudflare-worker.md`.

```bash
npx wrangler login       # once per machine
npm run deploy           # build + wrangler deploy
npm run deploy:dry-run   # build + validate upload without publishing
```

Automated deploys (one-time setup): the committed workflow `.github/workflows/deploy-cloudflare.yml` deploys on push to `main` and on `v*` tags once `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` are added to repo secrets. Alternatively, enable Cloudflare's Workers Builds Git integration in the dashboard (no secrets needed).

## UI defaults

- one light, high-contrast theme for M001
- large type and oversized timer / rep counts for outdoor glanceability
- `54-60px` touch targets with generous spacing
- minimal active-session chrome: current block, one cue, timer / reps, progress, `Next`, `Pause`
- local-first behavior: session run and review work on device without network dependency

## Key docs

- `docs/prd-foundation.md`
- `docs/specs/m001-courtside-run-flow.md`
- `docs/specs/m001-home-and-sync-notes.md`
- `docs/specs/m001-review-micro-spec.md`
- `docs/research/local-first-pwa-constraints.md`
- `docs/decisions.md`

## For agents

- **This file is workspace status**, not product authority. Product direction lives in `docs/`.
- **Architecture / layer rules / extension points**: `docs/ops/app-architecture-guidance.md` (durable checklist; links here and to `.cursor/rules/`).
- **Edit when**: the app architecture materially changes (e.g. sync layer added), a new Dexie version ships, or validation phase ends.
- **Related milestone**: `M001` (`docs/milestones/m001-solo-session-loop.md`).
- **v0b status registry**: `docs/plans/2026-04-16-003-rest-of-v0b-plan.md` §1 (what landed) and §6 (full V0B-XX item master status).
