---
id: phase-0-readiness-assessment
title: "Phase 0 Readiness Assessment"
status: active
stage: planning
type: discovery
summary: "Gap analysis, readiness checklist, and build plan for the Phase 0 validation prototype. Read this first when starting validation work."
authority: validation readiness state, prototype build plan, operational gaps
last_updated: 2026-04-12
depends_on:
  - docs/discovery/phase-0-wedge-validation.md
  - docs/milestones/m001-solo-session-loop.md
  - docs/decisions.md
decision_refs:
  - D90
  - D91
open_question_refs:
  - O6
  - O7
---

# Phase 0 Readiness Assessment

## Purpose

This document captures the current readiness state for starting Phase 0 validation. It lists what is ready, what is missing, and the concrete build plan to close the gaps. It is the recommended first read for any agent or human picking up validation work.

## Use this doc when

- Starting any Phase 0 validation work
- Picking up the prototype build
- Checking what gaps remain before field testing
- Onboarding a new agent session to the validation effort

## Current state summary

The project is at the **end of planning and the beginning of Phase 0 validation**. The M001 build is explicitly blocked until the validation gate clears (see `docs/milestones/m001-solo-session-loop.md` § Pre-build validation gate). The validation program is defined in `docs/discovery/phase-0-wedge-validation.md`.

### Decision: validation vehicle is a working PWA

The prototype will be a **bare-bones working PWA** — a real phone-usable session runner, not a Figma mockup. This is required because assumption A1 (phone courtside viability) is fatal-if-wrong and cannot be tested without a real phone experience on sand.

### Decision: tester recruitment

Validation will start with a **founder-first pilot**:

1. founder self-test on a real phone
2. founder + friends small pilot
3. broader expansion only if the experience feels strong enough to justify it

Recruitment is not a blocking gap for the initial alpha. Broader recruiting stays deferred until the founder/friend pilot produces clear pull.

---

## What is ready

### Planning layer (complete, consistent)

- Vision, PRD, decisions, roadmap are consistent and cross-referenced with stable IDs (P1-P10, D1-D89, O1-O13).
- M001 milestone charter defines the thin slice, acceptance evidence, and pre-build validation gate with 5 concrete criteria.
- 6 M001 specs exist: run flow, review, adaptation, session assembly, home/sync, quality/testing.
- Dual-wedge scorecards, 14-day compressed validation program, interview scripts, and evidence capture templates are in `docs/discovery/`.

### Research layer (complete for validation needs)

- 6 curated research notes + 8 raw research outputs covering training science, PWA constraints, timer patterns, Dexie architecture, testing strategy, and outdoor UI.
- Research routing is documented in `docs/research/README.md`.

### App data layer (ready to power the prototype)

| Artifact | Path | Status |
|---|---|---|
| Drill types (full contract) | `app/src/types/drill.ts` | Complete — 139 lines, all metadata fields |
| Session types (archetypes, context, blocks) | `app/src/types/session.ts` | Complete — 80 lines |
| Drill catalog (26 drills, full metadata) | `app/src/data/drills.ts` | Complete — 1497 lines, 11 M001 candidates tagged |
| Progression chains (6 chains) | `app/src/data/progressions.ts` | Complete — 250 lines |
| Session archetypes (4, with block layouts) | `app/src/data/archetypes.ts` | Complete — 231 lines, 3 time profiles each |
| Archetype selector function | `app/src/data/archetypes.ts` | Complete — `selectArchetype()` |

### Tech stack (installed, not wired)

- Vite + React + TypeScript scaffold exists in `app/`.
- Dexie and dexie-react-hooks are installed.
- React Router is installed.
- No UI screens, no Dexie database, no service worker, no PWA wiring yet.

### Design artifacts (wireframes ready)

- 22 wireframe PNGs in `assets/` covering v0a flow (4 screens + flow overview), v0b flow (9 screens + flow overview), and edge states (resume, pause, end early, review pending, repeat home, pain override, transition skip vs mandatory).
- Visual design language is locked: warm orange `#E8732A` accent, light high-contrast theme, Inter / system sans, vertical card selection patterns (D94).
- v0a preset sessions are defined: Solo Wall Pass, Solo Open Sand, Partner Pass Workout (D95).
- Review input patterns are decided: grouped sRPE segments, pre-populated pass counters (D96).

### Decisions (stable, no contradictions found)

- 96 decided items (D1-D96) are logged. No unresolved contradictions blocking prototype work.
- D94-D96 were added on 2026-04-12 to resolve design language, v0a preset definitions, and review input patterns.
- Open questions O4-O7 are explicitly things the validation itself is designed to answer.

---

## What is missing (gaps blocking validation start)

### Gap 1: No testable prototype UI

**Status**: Not started.
**What exists**: App scaffold with placeholder content. Data layer is ready.
**What is needed**: A bare-bones 4-screen PWA session runner.

Screens required:

1. **Start screen** — pick today's player count (current scope: `1` or `2`), pick a prebuilt session (2-3 options), tap "Start". Includes pre-session safety check (pain flag + training recency + contextual heat CTA).
2. **Run screen** — current drill name, one coaching cue, countdown timer, giant "Next" button, "Pause" button. 54-60px touch targets, 56-64px timer digits, high-contrast light theme. No typing during active run.
3. **Review screen** — sRPE picker (0-10 tap scale), binary Good/Not Good pass score with attempt count, optional one-line note, "Done."
4. **Session complete screen** — summary, "Save" confirmation.

Key implementation requirements:

- Wire `selectArchetype()` from `app/src/data/archetypes.ts` to pick the right block layout
- Build a minimal ranked-fill function that picks drills from `app/src/data/drills.ts` using hard filters (environment flags, participant count, skill tags)
- Use Dexie for local persistence (schema design: `docs/research/dexie-schema-and-architecture.md`)
- Wire `vite-plugin-pwa` for Add to Home Screen and basic offline support
- Timer uses `performance.now()` / timestamp-based recovery (see `docs/research/courtside-timer-patterns.md`)
- No account creation, no sign-up, no permission gates before first session

Courtside UX (from `docs/prd-foundation.md` and D48-D51):

- One light, high-contrast theme (near-black on white/off-white)
- System sans stack; body >= 16px, run labels 18px, timer digits 56-64px
- Touch targets 54-60px with 8-16px spacing
- Minimal taps: Next, Pause, and score input only during active run

### Gap 2: No prebuilt test sessions

**Status**: Not started.
**What exists**: Drill catalog with 11 M001 candidates, 4 archetypes with block layouts.
**What is needed**: 3 concrete session instances wired into the prototype.

| Session | Archetype | Time | Drills (from M001 set) |
|---|---|---|---|
| A: Solo + Wall | `solo_wall` | 15 min | d01, d03, d05, d25, d26 |
| B: Solo + Open | `solo_open` | 15 min | d01, d09, d10, d25, d26 |
| C: Pair + Net | `pair_net` | 25 min | d05, d15, d18, d25, d26 |

Each session must include warm-up (d25 or equivalent) and cool-down (d26) blocks per D85. Drill selection should match the archetype block layout slots.

### Gap 3: No expert safety reviewer identified

**Status**: Not started (human task).
**What is needed**: At least one coach or sports physio to review:

- The prebuilt test sessions (volume, intensity, progression appropriateness)
- The deload logic in `docs/specs/m001-adaptation-rules.md`
- Whether the safety disclaimers are adequate

**Timing**: Does not need to happen before initial tester runs, but must happen before scaling beyond the first testers. Can run in parallel with days 3-10 of the validation program.

### Gap 4: No field test logistics

**Status**: Not started (human task).
**What is needed**:

- 2-3 test locations (beach courts, outdoor courts, wall/fence spots)
- Schedule for 5 field usability runs in days 3-5 of the validation program
- A phone with the PWA installed via Add to Home Screen on iOS 18.4+ for testing
- Printed evidence capture checklists from `docs/discovery/phase-0-wedge-validation.md`

---

## What does NOT need more info before starting

- Product direction is clear and stable.
- Drill content and session structure are ready to power a prototype.
- Interview scripts and scorecards are ready to use.
- Tech stack is decided and dependencies are installed.
- The decision log has no unresolved contradictions blocking prototype work.
- O4 (what "solo" means) is explicitly something the validation is designed to answer — do not try to resolve it before testing. The 3 prebuilt sessions cover the main environment variants.

---

## Build plan for the validation prototype

### Sequencing

Build the prototype first (gaps 1-2), then run validation in stages. Safety review (gap 3) and logistics (gap 4) can proceed in parallel with the build.

```
Build runner PWA (gaps 1-2)
  |
  v
Internal smoke test on real iPhone
  |
  v
Founder self-test in real conditions --------> Identify safety reviewer
  |                                            |
  v                                            v
Founder + friends pilot                    Safety review (parallel)
  |
  v
If strong signal: expand to broader cohort
  |
  v
Days 6-14: Wider validation loop + week-2 retention test
  |
  v
Decision gate: go/no-go on M001 build
```

### What the prototype intentionally skips

Per `docs/discovery/phase-0-wedge-validation.md`:

- Multi-week planning, analytics, social features
- Production onboarding flow
- Backend or sync
- AI generation of any kind
- Coach clipboard UI (tested via interview only)
- Full ranked-fill sophistication — only needs to work for the 11 M001 candidate drills

### Decision gate (from `docs/discovery/phase-0-wedge-validation.md`)

- Founder self-test and founder/friend pilot are **pre-gate filters**, not the full M001 evidence standard.
- If the founder would not personally keep using it, stop and fix that before broader recruiting.
- Official M001 go/no-go follows `D91`: `5+` testers each complete `2+` sessions within `14` days with `>50%` review completion; kill signal if fewer than `3` of `5` start a second session within `14` days.
- Signals like users explicitly asking for the next session or inviting a partner remain useful supporting evidence, but they do not override `D91`.
- If session-2 retention misses the D91 bar: revisit the wedge, do not "build harder"

---

## For agents

- **Authoritative for**: validation readiness state, prototype build plan, identified gaps.
- **Read this first** when picking up any Phase 0 validation or prototype build work.
- **Edit when**: a gap is closed, the build plan changes, or validation begins.
- **Related docs**: `docs/discovery/phase-0-wedge-validation.md` (validation program), `docs/milestones/m001-solo-session-loop.md` (M001 gate), `docs/decisions.md` (blocking open questions O4-O7).
- **Next action**: Build the validation runner PWA (Gap 1) and assemble the test sessions (Gap 2).
