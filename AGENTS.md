---

## id: agents
title: Agent Orientation
status: active
stage: planning
type: agent-contract
summary: "Repo entrypoint for agents: read order, doc map, status vocabularies, routing rules, and operational constraints."
authority: agent read order, operating rules, learned preferences, grep identifiers
last_updated: 2026-04-12
depends_on:
  - docs/vision.md
  - docs/decisions.md
  - docs/ops/agent-runtime.md

# Agent Orientation

## Identity

Beach volleyball training workflow app. Self-coached amateur is the primary user. Repo is in **planning stage** — docs-first, no production code yet.

## Purpose

Give agents one human-readable entrypoint for:

- cold-start routing
- source-of-truth order
- doc and task vocabulary
- repo-level operating constraints that should not be rediscovered every session

## Use This File When

- entering the repo cold
- deciding what to read next
- resolving source-of-truth conflicts
- checking stable vocabularies, task states, or repo-level constraints
- updating repo-wide agent guidance or documentation routing

## Not For

- deciding product direction on its own
- replacing canonical product docs such as `docs/vision.md`, `docs/decisions.md`, or `docs/prd-foundation.md`
- storing raw research detail
- acting as the exhaustive machine index

## Update When

- the cold-start read order changes
- the source-of-truth hierarchy changes
- a new canonical entrypoint, manifest, or routing surface is introduced
- status vocabularies, frontmatter schema, or task-shape guidance changes
- repo-wide agent operating constraints materially change

## Machine Contract

This file is the canonical **prose** repo contract. Companion files split responsibilities:

- `agent-manifest.json` — JSON cold-start payload (no markdown parsing needed)
- `docs/catalog.json` — full doc index with dependency graph, line counts, routing rules
- `llms.txt` — lightweight project summary following the llms.txt convention
- `docs/ops/agent-documentation-contract.md` — canonical contract for agent entry surfaces, machine-scannable docs, and change propagation
- `.cursor/rules/machine-scannable-docs.mdc` — always-on enforcement reminder for durable doc hygiene

Drift rule:

- if file listings, line counts, routing tables, or doc summaries drift, prefer `docs/catalog.json`
- if prose policy, source-of-truth hierarchy, or operating rules drift, prefer `AGENTS.md`
- when either kind of drift is discovered, update both surfaces in the same pass

## Current state

- **Phase**: 0 (discovery + validation)
- **Active milestone**: M001 Solo Session Loop (planning, not building)
- **Blocking gate**: pre-build validation must pass before M001 moves to implementation (see `docs/milestones/m001-solo-session-loop.md` § Pre-build validation gate)
- **Key open questions**: O4, O5, O6, O7, O11, O12 in `docs/decisions.md`
- **Latest commit**: `v0.0.1-planning` / `edd-v1` — initial commit with full planning docs, EDD, and 22 wireframe assets
- **Last session work**: Red-team review of EDD + wireframes; added D94-D96, v0a preset definitions, pain-override flow, mandatory block skip rules, persistent safety affordance, visual design language; generated 12 new wireframes covering v0a flow, edge states, and corrected screens
- **Immediate next action**: Build the v0a validation runner PWA (see § Next steps below and `docs/discovery/phase-0-readiness-assessment.md`)

## Next steps

This section is the canonical "what to do next" for any agent entering the repo. Read this before starting work.

### Step 1: Build the v0a validation runner PWA (IMMEDIATE — unblocked)

This is the single most important next action. Everything else is blocked until v0a exists and is field-tested.

**What to build**: A bare-bones 8-screen PWA session runner matching the v0a "Runner Probe" stage in `docs/superpowers/specs/2026-04-11-v0-prototype-ladder-design.md`.

**Screen flow** (wireframes exist in `assets/wireframe-v0a-*.png`):

1. `Start` — preset picker with three sessions (D95): Solo Wall Pass, Solo Open Sand, Partner Pass. Player count toggle (1 or 2). Tap "Start Session."
2. `Pre-Session Safety` — pain flag (yes/no), training recency (0/1/2+), contextual heat CTA link. If pain=yes, show recovery default with override (see `assets/wireframe-pain-override-flow.png`).
3. `Warm-Up` — first block, same run UI as work blocks.
4. `Run Block` — timer as dominant visual (56-64px digits), one coaching cue, `Next` and `Pause` as primary controls (54-60px targets), secondary actions in overflow/pause state. Persist state on every transition.
5. `Between-Block Transition` — completed/next block, one cue, `Start Next Block` primary action. No "Skip block" on warm-up/cool-down (D85). Safety icon persistent.
6. `Cool-Down` — last block, same run UI.
7. `Quick Review` — grouped sRPE (Easy 0-3 / Moderate 4-6 / Hard 7-9 / Max 10), pre-populated pass counters with +/- adjust (D96), optional quick tags. NO "Finish later" in v0a — immediate review only.
8. `Session Complete` — stats summary, "Done", "Saved on device". No adaptation output in v0a.

**Key implementation requirements**:

- Wire `selectArchetype()` from `app/src/data/archetypes.ts` to the three presets
- Minimal ranked-fill to pick drills from `app/src/data/drills.ts` using hard filters
- Dexie for local persistence (schema: `docs/research/dexie-schema-and-architecture.md`)
- `vite-plugin-pwa` for Add to Home Screen + basic offline
- Timestamp-based timer recovery (see `docs/research/courtside-timer-patterns.md`)
- Warm orange `#E8732A` accent, light high-contrast theme, Inter / system sans (D94)
- No account creation, no sign-up, no permission gates

**Read order for this task**: `docs/discovery/phase-0-readiness-assessment.md` → `docs/superpowers/specs/2026-04-11-v0-prototype-ladder-design.md` (Runner Probe section + Architecture Constraints) → `docs/specs/m001-courtside-run-flow.md` → `docs/research/courtside-timer-patterns.md` → `docs/research/dexie-schema-and-architecture.md` → `app/README.md`

**Data layer already exists** (do NOT recreate):

- `app/src/types/drill.ts` — full drill type contract (139 lines)
- `app/src/types/session.ts` — session/archetype types (80 lines)
- `app/src/data/drills.ts` — 26-drill catalog, 11 M001 candidates tagged (1497 lines)
- `app/src/data/progressions.ts` — 6 progression chains (250 lines)
- `app/src/data/archetypes.ts` — 4 archetypes with block layouts + `selectArchetype()` (231 lines)

**Three preset sessions to assemble** (from `docs/discovery/phase-0-readiness-assessment.md`):

| Preset | Archetype | Time | Drills |
|---|---|---|---|
| Solo Wall Pass | `solo_wall` | ~12 min | d01, d03, d05, d25, d26 |
| Solo Open Sand | `solo_open` | ~12 min | d01, d09, d10, d25, d26 |
| Partner Pass | `pair_net` | ~15 min | d05, d15, d18, d25, d26 |

### Step 2: Smoke-test on a real iPhone (after Step 1)

- Install via Add to Home Screen on iOS 18.4+
- Run one full session in real conditions (sun, sand, sweat)
- Check: timer readable? Controls tappable with sandy hands? State survives backgrounding? Review completable when tired?

### Step 3: Field validation program (after Step 2)

- Follow `docs/discovery/phase-0-wedge-validation.md` for the 14-day compressed program
- D91 is the go/no-go bar: 5+ testers, 2+ sessions each, >50% review completion
- Kill signal: fewer than 3 of 5 start a second session within 14 days
- Expert safety review (Gap 3) can run in parallel with days 3-10

### What is NOT the next step

- Do NOT build v0b (Starter Loop) yet. v0a must field-test first.
- Do NOT implement adaptation logic visible to users. v0a uses fixed presets with no visible adaptation output.
- Do NOT build delayed review, "Finish later", or home/review-pending states. Those are v0b scope.
- Do NOT build coach clipboard, sync, analytics, or multi-week planning.
- Do NOT start M001 implementation until D91 gate passes.
- Do NOT change decisions D1-D96 without reading `docs/decisions.md` in full first.

### Open questions that v0a is designed to answer

- **O4**: What does "solo" operationally mean? (the three presets test wall, open sand, pair)
- **O6**: Will users actually use a phone courtside? (the whole point of v0a)
- **O11**: What first-run screen count minimizes drop-off? (v0a tests the simplest: preset picker only)
- **O12**: What minimum scored-contact threshold works? (v0a captures the data)

### Open questions that do NOT need answering before v0a

- **O1**: Coach premium model (Phase 1.5+)
- **O2**: Multi-week planning opinionatedness (Phase 1.5+)
- **O5**: Evidence threshold interpretation (comes after v0a data exists)
- **O7**: Expert safety reviews (non-blocking for initial testers, needed before scaling)

## Cold-start protocol

When entering this repo cold, follow this protocol. Stop reading as soon as you have enough context for the task.

**Step 1 — Orient** (always):

- Read `AGENTS.md` (this file, ~356 lines)
- Read `docs/catalog.json` (~~805 lines) — or `agent-manifest.json` (~~137 lines) if you only need routing

**Step 2 — Load context by task type**:

- Validation / prototype build → `docs/discovery/phase-0-readiness-assessment.md` (228 lines) → `docs/discovery/phase-0-wedge-validation.md` → `docs/superpowers/specs/2026-04-11-v0-prototype-ladder-design.md` → `docs/prd-foundation.md` → `app/README.md`
- Product direction → `docs/vision.md` (54 lines) → `docs/decisions.md` (154 lines) → `docs/prd-foundation.md` (271 lines)
- Milestone work → `docs/milestones/m001-solo-session-loop.md` (200 lines) → relevant `docs/specs/`
- Prototype ladder / v0 stage selection → `docs/superpowers/specs/2026-04-11-v0-prototype-ladder-design.md` → `docs/milestones/m001-solo-session-loop.md` → relevant `docs/specs/`
- Implementation → `docs/prd-foundation.md` → relevant `docs/specs/` → `app/README.md`
- Research → `docs/research/README.md` (101 lines) → narrowest matching research note
- Agent ops → `docs/ops/agent-runtime.md` (181 lines) → `ops/agent/README.md`
- Docs editing → `docs/README.md` (175 lines) → `docs/catalog.json` → `docs/ops/agent-documentation-contract.md`

**Step 3 — Check constraints**:

- Verify no blocking open questions in `docs/decisions.md` for the work area
- Verify milestone charter exists and stage allows the work type

**Context budget hint**: The full core doc set (vision + decisions + PRD + roadmap) is ~749 lines / ~30k tokens. Most tasks need only a subset.

## Source-of-truth hierarchy

When guidance conflicts, higher rank wins:


| Rank | File                                        | Authority                                               |
| ---- | ------------------------------------------- | ------------------------------------------------------- |
| 1    | `docs/vision.md`                            | Product principles, strategic stance                    |
| 2    | `docs/decisions.md`                         | Decision status (decided / open / ruled out)            |
| 3    | `docs/prd-foundation.md`                    | Product scope, workflow, object model, MVP requirements |
| 4    | `docs/roadmap.md`                           | Phase sequencing, exit criteria                         |
| 5    | `docs/milestones/`                          | Thin-slice charter scope                                |
| 6    | `docs/specs/`                               | Milestone-level behavior details                        |
| 7    | `docs/research/README.md`                   | Research-note routing and narrowest-note selection      |
| 8    | `docs/research/beach-training-resources.md` | Curated research findings                               |
| 9    | `docs/ops/autonomous-milestone-system.md`   | Milestone operating model                               |
| 10   | `docs/ops/agent-runtime.md`                 | Runtime stack, control plane                            |
| 11   | `AGENTS.md`                                 | Agent routing and repo map                              |
| 12   | `CLAUDE.md`                                 | Claude-specific execution hints only                    |


## Doc map

For machine-only routing, prefer `docs/catalog.json`. This table is the human-readable companion.

Every doc has YAML frontmatter with at least `id`, `title`, `status`, `stage`, `type`, and `summary`. Many docs also carry `authority`, `last_updated`, `depends_on`, `decision_refs`, and `open_question_refs`. Parse frontmatter to decide whether to read a file.

### Core (product direction)


| Path                     | Id             | Authority                                                                      |
| ------------------------ | -------------- | ------------------------------------------------------------------------------ |
| `docs/vision.md`         | vision         | Product principles (P1-P10), strategic stance, local-first doctrine, non-goals |
| `docs/prd-foundation.md` | prd-foundation | Scope, workflow, object model, MVP requirements, drill metadata                |
| `docs/roadmap.md`        | roadmap        | Phase sequencing, exit criteria, validation experiments                        |
| `docs/decisions.md`      | decisions      | Decision status — the single place to check what's decided                     |


### Milestones


| Path                                        | Id   | Status           |
| ------------------------------------------- | ---- | ---------------- |
| `docs/milestones/m001-solo-session-loop.md` | M001 | draft / planning |


### Specs (M001)


| Path                                     | Id                      | Authority                                 |
| ---------------------------------------- | ----------------------- | ----------------------------------------- |
| `docs/specs/m001-courtside-run-flow.md`  | M001-courtside-run-flow | Run screen states, interaction contract   |
| `docs/specs/m001-review-micro-spec.md`   | M001-review             | Post-session review payload, UX rules     |
| `docs/specs/m001-adaptation-rules.md`    | M001-adaptation         | Progress / hold / deload thresholds       |
| `docs/specs/m001-home-and-sync-notes.md` | M001-home-sync          | Home screen states, connectivity behavior |
| `docs/specs/m001-session-assembly.md`    | M001-session-assembly   | Deterministic session assembly model      |
| `docs/specs/m001-quality-and-testing.md` | M001-quality-testing    | Trust invariants, test layers             |


### Superpowers Specs


| Path                                                              | Id                         | Authority                                                         |
| ----------------------------------------------------------------- | -------------------------- | ----------------------------------------------------------------- |
| `docs/superpowers/specs/2026-04-11-v0-prototype-ladder-design.md` | v0-prototype-ladder-design | v0 stage naming, prototype boundaries, state coverage, gate logic |


### Discovery


| Path                                             | Id                           | Authority                                                                                   |
| ------------------------------------------------ | ---------------------------- | ------------------------------------------------------------------------------------------- |
| `docs/discovery/phase-0-readiness-assessment.md` | phase-0-readiness-assessment | Validation readiness state, prototype build plan, gaps — **read first for validation work** |
| `docs/discovery/phase-0-wedge-validation.md`     | phase-0-wedge-validation     | Scorecards, pre-build validation program, decision gate                                     |
| `docs/discovery/phase-0-interview-guide.md`      | phase-0-interview-guide      | Interview scripts, evidence capture                                                         |


### Research


| Path                                             | Id                            | Authority                                                              |
| ------------------------------------------------ | ----------------------------- | ---------------------------------------------------------------------- |
| `docs/research/README.md`                        | research-index                | Research-note routing and AI-native note conventions                   |
| `docs/research/beach-training-resources.md`      | beach-training-resources      | Curated findings, competitive landscape, pre-build validation findings |
| `docs/research/outdoor-courtside-ui-brief.md`    | outdoor-courtside-ui-brief    | Narrowed outdoor UI defaults and validation focus                      |
| `docs/research/local-first-pwa-constraints.md`   | local-first-pwa-constraints   | iPhone/PWA platform constraints                                        |
| `docs/research/dexie-schema-and-architecture.md` | dexie-schema-and-architecture | Dexie schema and migration guidance                                    |
| `docs/research/courtside-timer-patterns.md`      | courtside-timer-patterns      | Timer and interval UX patterns                                         |
| `docs/research/m001-testing-quality-strategy.md` | m001-testing-quality-strategy | Testing layers and quality strategy                                    |


### Ops


| Path                                       | Id                           | Authority                                     |
| ------------------------------------------ | ---------------------------- | --------------------------------------------- |
| `docs/ops/autonomous-milestone-system.md`  | autonomous-milestone-system  | Milestone model, stage gates, stop conditions |
| `docs/ops/agent-runtime.md`                | agent-runtime                | Runtime stack, control plane, task contract   |
| `docs/ops/agent-documentation-contract.md` | agent-documentation-contract | Agent entry surfaces, durable doc rules       |


### Raw research (provenance — do not edit)


| Path                                                    | Contents                                     |
| ------------------------------------------------------- | -------------------------------------------- |
| `research-output/beach-volleyball-self-coached-prd.md`  | Original deep research on self-coached wedge |
| `research-output/beach-volleyball-wedge-choice.md`      | Wedge comparison research                    |
| `research-output/m001-pre-build-validation-research.md` | Pre-build validation evidence review         |
| `research-output/deterministic-session-assembly.md`     | Deterministic session assembly research      |


## Machine-readable index

`docs/catalog.json` is the canonical machine-readable index of all docs, entrypoints, update routing, and research routing. It contains:

- source-of-truth rank order (which doc wins when two disagree)
- every doc's path, id, type, authority, and status
- research routing rules (use_when conditions for each research note)
- update routing rules (which doc to update for which trigger)
- frontmatter schema definition
- task contract and control-plane paths

**Agents should read `docs/catalog.json` first** when they need to understand the doc graph, find a doc by topic, or check what is canonical for a given subject.

## Stable ID conventions

Use stable IDs when citing enumerable items across docs:

- **P1-P10**: product principles in `docs/vision.md`
- **D***: decided items in `docs/decisions.md`
- **O***: open questions in `docs/decisions.md`
- **R1, R2, ...**: requirements in spec docs where used

## Routing rules

**Before changing product direction or milestone scope**, read the core docs (vision → decisions → PRD → roadmap) in rank order.

**When routing a docs update or agent task cold**, read `docs/catalog.json` first for canonical doc order, update targets, and task-contract pointers.

**Before editing a doc**, read its frontmatter `depends_on` list and check those files for conflicts.

**Before reading research broadly**, read `docs/research/README.md` and pick the narrowest note that matches the question.

**Before starting implementation work**, verify:

1. The milestone charter exists and is approved
2. The pre-build validation gate has passed (for M001: see milestone charter)
3. `docs/decisions.md` does not have an open question that blocks the work

**When updating a decision**, update `docs/decisions.md` first, then propagate to downstream docs.

**When adding research findings**, add raw output to `research-output/` (do not edit existing files there), then mine findings into `docs/research/beach-training-resources.md`.

**When creating a new canonical doc**, add YAML frontmatter with all standard keys (`id`, `title`, `status`, `stage`, `type`, `summary`, `authority`, `last_updated`, `depends_on`) and add the doc to `docs/catalog.json`. If a doc's `id`, `authority`, path, or routing role changes materially, sync `docs/catalog.json`, `agent-manifest.json`, and any affected hints in `docs/README.md`, `AGENTS.md`, or `llms.txt` in the same pass.

**When citing a product principle**, use the stable ID (e.g. P10) from `docs/vision.md`.

**When citing a decision**, use the stable ID (e.g. D27) from `docs/decisions.md`.

## Frontmatter schema

All docs under `docs/` must have YAML frontmatter:

```yaml
---
id: short-kebab-id          # unique across repo
title: Human-Readable Title
status: draft | active | complete | superseded
stage: planning | implementation | validation
type: core | spec | research | discovery | ops | milestone | index | template
summary: one-sentence machine summary
authority: what this doc is canonical for  # helps agents decide whether to read it
last_updated: YYYY-MM-DD
depends_on:                  # paths to docs this one references or must stay consistent with
  - docs/vision.md
decision_refs:               # optional stable decision IDs that materially constrain the doc
  - D41
open_question_refs:          # optional stable open-question IDs still blocking or shaping the doc
  - O4
---
```

## Operational constraints

- This repo is Cursor-first. Shared agent behavior lives here, in `.cursor/rules/`, and in `docs/ops/`.
- `CLAUDE.md` exists for Claude-specific execution hints only — not a second source of truth.
- Default to docs-first work until a milestone is explicitly approved for implementation.
- Keep autonomous work bounded: one task, explicit scope, verification commands, escalation triggers, terminal state (`done`, `blocked`, `failed`, `budget_exhausted`).
- Queue specs: `ops/agent/queue/`. Handoffs: `ops/agent/handoffs/`. Volatile state (runs, locks): out of git.
- Keep recommendations aligned with courtside mobile use, low typing, structured workflows, and solo/pair fallback.

## Canonical vs mirror

Several files repeat parts of the operating model. When wording drifts, these are the canonical homes:


| Concern                                   | Canonical file                             | Mirrors (kept in sync, not authoritative)                                                |
| ----------------------------------------- | ------------------------------------------ | ---------------------------------------------------------------------------------------- |
| Source-of-truth hierarchy                 | `AGENTS.md` (this file)                    | `docs/ops/agent-runtime.md`, `docs/README.md`, `agent-manifest.json`                     |
| Product principles                        | `docs/vision.md`                           | `docs/prd-foundation.md` (guardrails section)                                            |
| Decision status                           | `docs/decisions.md`                        | downstream specs that cite `D*` IDs                                                      |
| Docs-first posture, bounded autonomy      | `AGENTS.md` (this file)                    | `docs/ops/agent-runtime.md`, `.cursor/rules/repo-operating-model.mdc`                    |
| Agent doc contract and frontmatter schema | `docs/ops/agent-documentation-contract.md` | `AGENTS.md`, `docs/catalog.json`, `.cursor/rules/machine-scannable-docs.mdc`             |
| Task shape and terminal states            | `ops/agent/schemas/task.schema.json`       | `ops/agent/queue/task-template.json`, `ops/agent/README.md`, `docs/ops/agent-runtime.md` |
| Cold-start read order                     | `AGENTS.md` (this file)                    | `agent-manifest.json`, `llms.txt`, `README.md`                                           |
| Doc index and dependency graph            | `docs/catalog.json`                        | `AGENTS.md` doc map tables, `docs/README.md` structure table                             |
| Repo identity and stage                   | `README.md`                                | `llms.txt`, `agent-manifest.json`                                                        |


When updating policy, edit the canonical file first, then propagate to mirrors.

## Learned preferences

- Prefer product clarity and smallest useful MVP over premature feature expansion.
- Favor structured objects and workflows over chat-first UX.
- Design for courtside and mobile use: fast session run, minimal typing, readable drill cards.
- The product is local-first by principle (D27–D29): device is the primary copy, cloud is a supporting peer.
- Raw deep research goes to `research-output/`; mined findings go to `docs/research/beach-training-resources.md`.

## Agent capabilities

Available tools and scripts for agent work:


| Script                                    | Purpose                                                          | Shell |
| ----------------------------------------- | ---------------------------------------------------------------- | ----- |
| `scripts/agent-supervisor.sh`             | Claim pending task, set up work area, launch worker              | bash  |
| `scripts/agent-dispatch.sh`               | Dispatch specific task to worker surface                         | bash  |
| `scripts/agent-verify.sh`                 | Run verification commands for active task                        | bash  |
| `scripts/agent-notify.sh`                 | Send completion or escalation notification                       | bash  |
| `scripts/validate-agent-docs.sh`          | Validate agent entry surfaces and machine-readable doc contracts | bash  |
| `scripts/validate-agent-control-plane.sh` | Validate queue, handoff, and state file integrity                | bash  |


Use `bash scripts/validate-agent-docs.sh` when a task changes `AGENTS.md`, `docs/catalog.json`, `agent-manifest.json`, `llms.txt`, or the stable agent-facing docs under `docs/`. Use `bash scripts/validate-agent-control-plane.sh` for the broader queue, handoff, schema, and state pass.

Control plane layout:


| Path                  | Contents                                     | Tracked |
| --------------------- | -------------------------------------------- | ------- |
| `ops/agent/queue/`    | Task specs the supervisor can claim          | yes     |
| `ops/agent/handoffs/` | Stable handoff documents                     | yes     |
| `ops/agent/schemas/`  | JSON Schema for task shape and status enums  | yes     |
| `ops/agent/runs/`     | Local run outputs, verification reports      | no      |
| `ops/agent/state/`    | Locks, active-task pointers, transient state | no      |


## Environment notes

- WSL-first workspace (bash). Scripts and hooks are written for bash/WSL.
- Python 3 is used for JSON manipulation in scripts.
- Some Claude Code commands may fail in non-interactive terminals; use a normal local TTY.

