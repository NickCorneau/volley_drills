---
id: repo-root
title: Volley Drills
status: active
stage: planning
type: hub
summary: "Repo entrypoint: layout, agent quick path, and key links for cold-start orientation."
authority: repo layout, top-level orientation, and cold-start links into the docs system
last_updated: 2026-04-12
depends_on:
  - AGENTS.md
  - docs/catalog.json
---

# Volley Drills

Beach volleyball personal training app -- structured session planning, courtside run mode, and rules-based adaptation for self-coached amateurs.

**Stage**: Planning / docs-first. No approved implementation yet.
**Active milestone**: M001 Solo Session Loop.
**Stack**: Vite + React + TypeScript + Tailwind + PWA + Dexie (IndexedDB). Local-first, no backend.

## Repo layout


| Folder             | Role                                             | Start here                     |
| ------------------ | ------------------------------------------------ | ------------------------------ |
| `docs/`            | Product canon, specs, research, and ops          | `docs/README.md`               |
| `app/`             | Validation-phase web shell (scaffold only)       | `app/README.md`                |
| `ops/agent/`       | Agent control plane: task queue, handoffs, runs  | `ops/agent/README.md`          |
| `scripts/`         | Supervisor, dispatch, verify, and notify scripts | `scripts/agent-supervisor.sh`  |
| `.cursor/`         | Cursor rules, hooks, and worktree config         | `.cursor/rules/`               |
| `research-output/` | Raw deep research (do not edit)                  | --                             |


## Agent quick path

When entering this repo cold, read in this order:

1. `AGENTS.md` -- orientation, operating contract, doc map, cold-start protocol
2. `docs/catalog.json` -- machine-readable index with dependency graph, line counts, routing rules
3. `docs/vision.md` -- product principles (canonical)
4. `docs/decisions.md` -- what is decided, open, and ruled out
5. `docs/milestones/m001-solo-session-loop.md` -- current thin-slice scope

For implementation work, also read:

- `docs/prd-foundation.md` -- object model, drill metadata, MVP scope
- Relevant `docs/specs/` for milestone-level behavior

For agent control-plane work, also read:

- `docs/ops/agent-runtime.md` -- runtime contract, source-of-truth hierarchy
- `ops/agent/README.md` -- task queue, handoffs, worker flow

## Machine-readable entry points


| File                  | Format   | Use when                                                          |
| --------------------- | -------- | ----------------------------------------------------------------- |
| `agent-manifest.json` | JSON     | Need pure-JSON cold-start payload without markdown parsing        |
| `docs/catalog.json`   | JSON     | Need full doc index, dependency graph, routing rules, line counts |
| `llms.txt`            | Text     | LLM/agent discovery convention -- lightweight project summary     |
| `docs/ops/agent-documentation-contract.md` | Markdown | Need the canonical rules for machine-scannable docs and change propagation |
| `AGENTS.md`           | Markdown | Human-readable orientation with operating contract                |


## Key links

- Product principles: `docs/vision.md`
- Decision log: `docs/decisions.md`
- PRD and object model: `docs/prd-foundation.md`
- Agent contract: `AGENTS.md`
- Machine doc index: `docs/catalog.json`
- Agent manifest: `agent-manifest.json`
- Agent docs contract: `docs/ops/agent-documentation-contract.md`

