---
id: handoff-2026-04-12
title: "Planning Complete — Build v0a Next"
status: active
created: 2026-04-12
type: handoff
---

# Handoff: Planning Complete — Build v0a Next

## What happened this session

1. Red-teamed the EDD (`docs/superpowers/specs/2026-04-11-v0-prototype-ladder-design.md`), Figma file, and generated wireframes together. Found 11 issues across critical/high/medium/low.
2. Fixed all issues:
   - Added D94 (warm orange accent + vertical card selection patterns)
   - Added D95 (three v0a preset sessions: Solo Wall Pass, Solo Open Sand, Partner Pass)
   - Added D96 (grouped sRPE segments + pre-populated pass counters)
   - Updated EDD with: v0a preset table, visual design language section, pain-override flow, mandatory block skip restrictions, persistent safety affordance
   - Generated 12 new wireframes covering v0a-specific flow, Today's Setup (D92/D93), pain override, and all missing edge states
3. Made initial commit with all planning docs, 22 wireframe assets, and app scaffold.
4. Tagged: `v0.0.1-planning`, `edd-v1`

## What to do next

**Build the v0a validation runner PWA.** This is unblocked and is the single highest-priority action.

Read `AGENTS.md` § "Next steps" for the complete build spec, screen flow, data layer inventory, and preset session definitions. That section is the canonical instruction set.

Short version: 8 screens, 3 preset sessions, timer-dominant run UI, immediate-only review, local persistence via Dexie, PWA via vite-plugin-pwa. No onboarding, no assembly, no deferred review, no adaptation output.

## Do NOT

- Build v0b features (Today's Setup, session assembly, delayed review, adaptation UI)
- Change D1-D96 without full context
- Start M001 implementation (blocked on D91 gate)
- Add backend, sync, analytics, coach features

## Key files for the next agent

| Purpose | File |
|---|---|
| Full build instructions | `AGENTS.md` § Next steps |
| Readiness + gaps | `docs/discovery/phase-0-readiness-assessment.md` |
| v0a scope + boundaries | `docs/superpowers/specs/2026-04-11-v0-prototype-ladder-design.md` § Runner Probe |
| Run flow spec | `docs/specs/m001-courtside-run-flow.md` |
| Timer patterns | `docs/research/courtside-timer-patterns.md` |
| Dexie schema | `docs/research/dexie-schema-and-architecture.md` |
| Data layer | `app/src/data/drills.ts`, `app/src/data/archetypes.ts` |
| Wireframes | `assets/wireframe-v0a-*.png` |
| Decisions | `docs/decisions.md` (D1-D96) |
