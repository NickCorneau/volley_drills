---
id: app-workspace
title: App Workspace
status: bootstrap
stage: planning
type: workspace-readme
authority: current web app scaffold state and implementation guardrails
last_updated: 2026-04-12
depends_on:
  - docs/prd-foundation.md
  - docs/decisions.md
  - docs/specs/m001-courtside-run-flow.md
  - docs/specs/m001-home-and-sync-notes.md
---

# App Workspace

This folder holds the validation-phase web shell for Volley Drills.

## Current status

- `src/App.tsx` is still starter-template placeholder content.
- Product direction lives in `docs/`; do not treat the current demo UI as a product design reference.
- The first real UI target is the M001 solo session loop in `docs/milestones/m001-solo-session-loop.md`.
- The current app scaffold includes Dexie dependencies, but there is no service worker or `vite-plugin-pwa` wiring yet.

## UI defaults to inherit when implementation starts

- one light, high-contrast theme for M001
- large type and oversized timer / rep counts for outdoor glanceability
- `54-60px` touch targets with generous spacing
- minimal active-session chrome: current block, one cue, timer / reps, progress, `Next`, `Pause`
- local-first behavior: session run and review must work on device without network dependency
- service-worker updates must activate only at safe boundaries, never in the middle of an active session
- wake lock and haptics are progressive enhancements, not trusted baseline capabilities

## Key docs

- `docs/prd-foundation.md`
- `docs/specs/m001-courtside-run-flow.md`
- `docs/specs/m001-home-and-sync-notes.md`
- `docs/specs/m001-review-micro-spec.md`
- `docs/research/local-first-pwa-constraints.md`
- `docs/decisions.md`

## For agents

- **This file is workspace status**, not product authority. Product direction lives in `docs/`.
- **Edit when**: the scaffold state changes (new dependencies wired, service worker added, demo content replaced with real screens).
- **Do not treat** the current demo UI as a product design reference. The specs and PRD define what should be built.
- **Related milestone**: `M001` (`docs/milestones/m001-solo-session-loop.md`).
