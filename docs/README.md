---
id: docs-index
title: Volley Drills Docs
status: active
stage: planning
type: index
summary: "Editorial index into the docs system with authority hierarchy and update routing."
authority: documentation structure, editorial workflow, and authority map
last_updated: 2026-04-12
depends_on:
  - docs/catalog.json
  - docs/ops/agent-documentation-contract.md
---

# Volley Drills Docs

This folder is the source of truth for product thinking, research, and requirements.

The repo is in the planning / vision stage. Default to documentation and decision records before code or automation.

## Purpose

Provide the prose editorial index for the docs system:

- what each major doc family is for
- which file owns which kind of change
- how agents should route themselves through the docs without reading everything

## Use This File When

- routing a documentation update
- deciding which doc owns a concept
- checking the editorial hierarchy across `vision`, `decisions`, `PRD`, roadmap, milestones, specs, and research
- deciding whether a change belongs in canon, a planning spec, discovery material, or research

## Not For

- exhaustive machine-only routing or dependency traversal
- replacing `docs/catalog.json` as the canonical machine index
- overriding `docs/vision.md` or `docs/decisions.md`

## Update When

- the doc inventory changes materially
- doc ownership or update routing changes
- a new agent entrypoint or research-routing surface is added
- the recommended fast-path read order changes

## Machine Contract

- `docs/catalog.json` is the exhaustive machine-readable index of docs, routing rules, and task pointers.
- `docs/README.md` is the prose editorial companion for humans and agents.
- `docs/ops/agent-documentation-contract.md` is the canonical contract for agent entry surfaces, durable doc patterns, and change propagation.
- If these surfaces drift on file inventory, summaries, or routing details, fix them in the same pass.

## Structure

| Path | Owns | Read when... |
|---|---|---|
| `catalog.json` | Machine-readable doc map, update routing, agent entrypoints | Starting any agent session; need doc lookup by topic |
| `vision.md` | Product principles, strategic guardrails | Changing product direction; checking a non-negotiable |
| `prd-foundation.md` | Object model, drill metadata, MVP scope, courtside UX | Implementing features; editing data contracts |
| `roadmap.md` | Phase sequencing, exit criteria | Planning milestones; checking phase gates |
| `decisions.md` | Decision status (decided / open / ruled out) | Before any product or technical change |
| `ops/agent-runtime.md` | Runtime contract, source-of-truth hierarchy, task lifecycle | Agent control-plane work; policy edits |
| `ops/agent-documentation-contract.md` | Agent entry surfaces, machine-scannable doc rules, change propagation | Editing `AGENTS.md`, `catalog.json`, `agent-manifest.json`, or `llms.txt` |
| `ops/autonomous-milestone-system.md` | Stage gates, milestone model | Approving or reviewing milestones |
| `research/README.md` | Research-note index and routing | Need domain evidence; picking the narrowest note |
| `discovery/` | Phase 0 scorecards, interview guides | Running or reviewing validation experiments |
| `specs/` | Milestone behavior, trust invariants, quality expectations | Clarifying M001 before or during implementation |
| `superpowers/specs/` | Cross-spec planning refinements and v0 ladder docs | Clarifying prototype sequencing, stage naming, and state coverage before implementation |
| `milestones/` | Thin-slice charters | Checking scope or acceptance evidence |

### Research notes

| Path | Topic |
|---|---|
| `research/beach-training-resources.md` | Competitive landscape, periodization, injury prevention, metrics, example drills |
| `research/outdoor-courtside-ui-brief.md` | Outdoor UI defaults: theme, contrast, type floor, touch targets |
| `research/local-first-pwa-constraints.md` | iPhone/PWA constraints, storage eviction, install posture |
| `research/dexie-schema-and-architecture.md` | Dexie schema shape, indexing, migration, state management |
| `research/m001-testing-quality-strategy.md` | Test layers, trust risks, update safety, persistence |

## Related folders

- `research-output/` — Raw deep research artifacts (Parallel AI). Mined findings are consolidated into curated notes under `docs/research/`. Keep raw files as provenance; do not edit them directly.
- `app/` — Validation-phase web shell (Vite + React + Dexie scaffold). See `app/README.md` for UI defaults.
- `ops/agent/` — Agent control plane: task queue, handoffs, runs, and worker flow. See `ops/agent/README.md`.
- `scripts/` — Supervisor, dispatch, verify, and notify scripts for agent work. Entry: `scripts/agent-supervisor.sh`.
- `.cursor/rules/` — Cursor-specific rules: `repo-operating-model.mdc` (always-apply), `docs-editorial-workflow.mdc` (docs globs), `machine-scannable-docs.mdc` (always-apply docs hygiene reminder).

## Agent Fast Path

Use this order when you need the smallest reliable context set:

1. `AGENTS.md` — repo contract, preferences, and agent guidance
2. `docs/catalog.json` — machine-readable map of canonical docs and update routing
3. `docs/vision.md` — strategic stance and canonical principles
4. `docs/decisions.md` — what is decided, open, and ruled out
5. `docs/prd-foundation.md` — current scope, workflow, and object model
6. `docs/roadmap.md` — sequencing and exit criteria
7. `docs/research/README.md` — route into the narrowest supporting research note
8. relevant `docs/milestones/`, `docs/specs/`, `docs/superpowers/specs/`, `docs/research/`

For agent control-plane work, also read:

- `docs/ops/agent-runtime.md`
- `ops/agent/README.md`
- `ops/agent/queue/task-template.json`

For docs editing or agent-surface changes, also read:

- `docs/ops/agent-documentation-contract.md`

## Authority

The full ranked source-of-truth hierarchy lives in `AGENTS.md` (§ Source-of-truth hierarchy). Summary for humans:

- `vision.md` is canonical for product principles and strategic stance.
- `decisions.md` is canonical for what is decided, open, and ruled out.
- `prd-foundation.md` is canonical for current product scope, workflow, and object model.
- `roadmap.md` is canonical for phase sequencing and exit criteria.
- `milestones/` and `specs/` refine thin slices, but they should not silently overturn `decisions.md`.
- `research/` and `research-output/` are inputs and provenance. They inform canon; they do not outrank it.

Each doc's `authority` frontmatter field states what it is canonical for. Parse that field before deciding whether a file is relevant to your task.

## Metadata contract

All docs under `docs/` use YAML frontmatter. The canonical schema is defined in `AGENTS.md` (§ Frontmatter schema). Required keys: `id`, `title`, `status`, `stage`, `type`, `summary`, `authority`, `last_updated`, `depends_on`.

- Frontmatter is the single source of truth for date and status. Do not duplicate these in the body text.
- When changing a document's status or stage, update the frontmatter first.
- `depends_on` lists paths to docs this one must stay consistent with. Check those before editing.

## Working principles

- Product clarity over feature sprawl.
- Real user and real workflow over hypothetical use cases.
- Smallest useful MVP over broad platform ambitions.
- Structured workflow over chat-only experiences.
- One canonical location per concept; other docs cross-reference, not duplicate.
- Durable docs should stay machine-scannable: frontmatter where supported, stable headings, flat lists, and explicit ownership.

## AI-Native Doc Patterns

- Prefer YAML frontmatter on docs that other agents are likely to route through.
- Make authority explicit: say whether the doc is canon, a planning refinement, or research input.
- Use stable IDs for enumerable items so agents can cite them precisely:
  - **P1-P10**: product principles in `vision.md`
  - **D***: decisions in `decisions.md`
  - **O***: open questions in `decisions.md`
  - **R1, R2, ...**: requirements in spec docs where used
- For milestone and spec docs, prefer frontmatter `summary` plus `decision_refs` when a stable set of decisions materially constrains the document.
- Research notes should say `Use This Note When` so future sessions can choose the narrowest relevant note quickly.
- Decision-shaping research should prefer explicit sections such as `Freeze Now`, `Validate Later`, `Apply To Current Setup`, and `Open Questions`.
- If a new focused research note exists, add it to `docs/research/README.md` so it becomes discoverable instead of remaining a hidden one-off.
- When creating or renaming a canonical doc, add or update it in `docs/catalog.json`, then sync `agent-manifest.json` and any affected hints in `AGENTS.md` or `llms.txt` in the same pass.

## Change Propagation

- New canonical doc or renamed path: update `docs/catalog.json`, `agent-manifest.json`, and any affected routing hints in `AGENTS.md` or `llms.txt`.
- New agent-facing policy or docs convention: update `docs/ops/agent-documentation-contract.md`, `docs/catalog.json`, and `.cursor/rules/machine-scannable-docs.mdc`.
- New repo entry surface: update `AGENTS.md`, `docs/catalog.json`, `agent-manifest.json`, and `llms.txt`.

## Suggested workflow

1. Update the relevant file under `research/` when you discover high-signal sources or a focused synthesis that should stay separate from canon.
2. Update `decisions.md` when a product or technical decision is made or resolved.
3. Update `prd-foundation.md` when scope, object model, or requirements change.
4. Update `vision.md` only for major strategic or principle changes.
5. Update `roadmap.md` when sequencing, milestones, or exit criteria change.
6. Update `docs/ops/` when the execution model, control plane, or autonomous run boundaries change.
7. Update `discovery/` when validation plans, scorecards, or interview scripts change.
8. Update `specs/` when a milestone needs sharper behavioral definition or explicit trust/quality contracts before implementation.
9. Update `milestones/` when a thin slice changes status, scope, or acceptance evidence.