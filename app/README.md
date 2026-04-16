---
id: app-workspace
title: App Workspace
status: active
stage: validation
type: workspace-readme
authority: current web app prototype state and implementation guardrails
last_updated: 2026-04-16
depends_on:
  - docs/prd-foundation.md
  - docs/decisions.md
  - docs/specs/m001-courtside-run-flow.md
  - docs/specs/m001-home-and-sync-notes.md
---

# App Workspace

This folder holds the runnable Phase 0 validation prototype (v0a) for Volley Drills.

## Current status

> **Before making changes**, read `docs/research/2026-04-12-v0a-runner-probe-feedback.md` for the prioritized backlog, fix status, and known issues with stable IDs.

- The app is a runnable **v0a PWA prototype** used for physical field testing on sand.
- **Routes**: `/` (Start), `/safety`, `/run`, `/run/transition`, `/review`, `/complete`.
- **Dexie tables**: `sessionPlans`, `executionLogs`, `sessionReviews`, `timerState` (schema in `src/db/schema.ts`).
- **PWA**: `vite-plugin-pwa` wired with `generateSW`, precache, `offline.html`. `navigator.storage.persist()` is requested on a real user gesture at session-start (`services/session.ts`), not at module load — per `D118` / `V0B-25`, WebKit grants persistence heuristically and responds better to gesture-bound calls. Three-state posture-sensitive save copy on `CompleteScreen.tsx` via `hooks/useInstallPosture.ts` + `lib/storageCopy.ts` (`V0B-24`). See `docs/research/local-first-pwa-constraints.md`.
- **Timer**: timestamp-based with 5s flush to `timerState`, wake-lock during active blocks, 3-2-1 pre-roll countdown.
- **Safety**: pain gate, recovery session override with confirmation, training recency check, heat tips.
- Product direction lives in `docs/`; do not treat the prototype UI as final production design.
- The M001 milestone implementation gate remains closed until field validation completes (D91).

## Known limitations (v0a)

- RPE uses 4 bands (Easy/Moderate/Hard/Max) instead of full 0-10 scale (deferred to v0b).
- Pass metric counters are +/- only; no tap-to-type or +5/+10 steppers.
- No session history on Start screen.
- No landscape orientation handling.
- `vite-plugin-pwa@1.2.0` declares peer support through Vite 7; app uses Vite 8 (builds clean but peer warning on install).
- Root-level `*.png` files in `app/` are captured validation screenshots, not runtime app assets.
- See `docs/research/2026-04-12-v0a-runner-probe-feedback.md` for the full prioritized backlog.

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
- **Edit when**: the app architecture materially changes (e.g. sync layer added) or validation phase ends.
- **Related milestone**: `M001` (`docs/milestones/m001-solo-session-loop.md`).
