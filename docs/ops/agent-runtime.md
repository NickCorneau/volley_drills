---
id: agent-runtime
title: Agent Runtime
status: active
stage: planning
type: ops
authority: runtime stack, control plane layout, task contract, session lifecycle
summary: "Runtime contract, source-of-truth hierarchy, control-plane layout, and task lifecycle."
last_updated: 2026-04-12
depends_on:
  - AGENTS.md
  - docs/ops/autonomous-milestone-system.md
  - docs/catalog.json
  - docs/ops/agent-documentation-contract.md
---

# Agent Runtime

## Agent Quick Scan

- Use this doc for runtime stack, control-plane layout, task lifecycle, worker roles, and worktree policy.
- Not this doc for product canon, milestone scope, or docs-wide documentation conventions; use `docs/vision.md`, `docs/decisions.md`, milestone docs, or `docs/ops/agent-documentation-contract.md` for those.
- If runtime lifecycle or control-plane behavior changes, update this doc first and then sync the machine task surfaces it mirrors.

## Purpose

Define the concrete runtime contract for low-touch work in this repo:

- Cursor-first for shared repo guidance, planning, and review
- Claude-compatible for optional unattended execution
- milestone-bounded rather than open-ended "keep going forever" autonomy

This document complements `docs/ops/autonomous-milestone-system.md`. That file explains the stage gates and milestone model. This file explains the runtime stack and control-plane layout.

This scaffolding is WSL-first. The bundled scripts and hooks are bash and assume a WSL or Linux environment with python3 available.

## Use This File When

- a task touches runtime or control-plane files
- deciding how bounded agent work should be shaped or executed
- checking task lifecycle, terminal states, worktree rules, or worker roles

## Not For

- replacing milestone or product canon such as `docs/vision.md`, `docs/decisions.md`, or `docs/prd-foundation.md`
- defining milestone scope before the milestone charter is ready
- acting as the formal task schema

## Update When

- runtime stack or worker roles change
- task lifecycle, terminal states, or worktree policy changes
- control-plane layout or task-contract requirements change
- the relationship between runtime docs and machine-readable task files changes

## Machine Contract

- `docs/catalog.json` is the machine-readable repo index and task-routing map.
- `ops/agent/queue/task-template.json` and `ops/agent/schemas/` define the formal task contract.
- `docs/ops/agent-runtime.md` is the canonical prose runtime contract.
- `docs/ops/agent-documentation-contract.md` defines how runtime routing guidance should stay aligned with other agent entry surfaces.

## Canonical vs mirror

- `AGENTS.md` is the canonical home for the source-of-truth hierarchy, doc map, and agent operating contract.
- This file (`agent-runtime.md`) is canonical for the runtime stack, task contract shape, session lifecycle, and control-plane layout.
- `docs/ops/agent-documentation-contract.md` is canonical for docs-wide agent-surface structure and change propagation.
- `.cursor/rules/repo-operating-model.mdc` mirrors the docs-first posture and bounded-autonomy rules.
- `ops/agent/README.md` mirrors task states and the suggested worker flow.

When the hierarchy or operating contract drifts, update `AGENTS.md` first and propagate. When runtime or task-shape wording drifts, update this file first.

## Change Propagation

- Runtime stack, session lifecycle, or worker-role wording changed: update this file first, then sync `ops/agent/README.md`, queued-task examples, schemas, or `docs/catalog.json` if their mirrored wording changed too.
- Formal task shape or enum definitions changed in `ops/agent/schemas/` or `ops/agent/queue/task-template.json`: update those files first, then align this prose contract.
- Docs-wide agent entry surfaces or machine-scannable conventions changed: update `docs/ops/agent-documentation-contract.md` first, then adjust this file only if its routing or contract language also needs to change.

## Stack choice

The chosen default is:

1. Cursor as the human-facing orchestrator
2. Repo-local guidance in `AGENTS.md` and `.cursor/rules/`
3. Repo-local hooks and worktree setup in `.cursor/`
4. Repo-local task specs and handoffs in `ops/agent/`
5. Claude Code only as an optional unattended worker for bounded tasks

The repo is not Claude-first. `CLAUDE.md` should stay short and execution-specific.

## Source-of-truth hierarchy

The canonical hierarchy is maintained in `AGENTS.md` (§ Source-of-truth hierarchy). This file sits at rank 10 in that list. When runtime guidance here conflicts with product-level docs, the product docs win.

## Control plane

Tracked files:

- `ops/agent/queue/` - bounded task specs
- `ops/agent/handoffs/` - curated task handoffs and templates
- `docs/ops/` - human-readable policy and operating docs

Local-only files:

- `ops/agent/runs/` - run artifacts, logs, verification reports
- `ops/agent/state/` - locks, active-task pointers, heartbeats
- `.cursor/hooks/state/` - hook-local state

Tracked files should never contain machine-specific absolute paths, transcript indexes, or host-only secrets.

## Task contract

Every queued task must declare:

- a bounded outcome
- files or surfaces in scope
- explicit out-of-scope items
- verification commands
- escalation triggers
- preferred worker surface (`cursor` or `claude`)

Do not queue tasks that are still mostly product ambiguity. Resolve milestone scope first.

## Session lifecycle

The expected loop is:

1. Claim one pending task
2. Create a work area
3. Generate a handoff
4. Run one worker session
5. Run verification
6. Record one terminal state

Runtime terminal states (this vocabulary applies to session lifecycle outcomes only):

- `done`
- `blocked`
- `failed`
- `budget_exhausted`

These overlap with queue status values intentionally but are a separate vocabulary. See `docs/catalog.json` § `status_vocabularies` for the full enum map across doc, milestone, queue, and runtime contexts.

## Worktree rule

Default isolation is one task per worktree under `.worktrees/`.

Bootstrap exception:

- if the repo has no `HEAD` commit yet, the supervisor may fall back to the main checkout and record `inplace-bootstrap` mode
- once the repo has an initial commit, new queued tasks should use worktrees by default

## Cursor role

Use Cursor for:

- plan review and milestone shaping
- interactive implementation and review
- repo-local hooks, rules, and worktree setup
- subagent work that still benefits from an IDE-centered loop

## Claude role

Use Claude Code for:

- optional unattended runs from the repo control plane
- bounded tasks with explicit verify commands
- headless or scriptable execution where the IDE is not the best surface

Do not let Claude-specific memory or swarm abstractions become the repo's primary operating model.

## What not to automate

Do not run unattended loops for:

- milestone definition
- wedge choice or major product direction
- open PRD questions without explicit human framing
- tasks without a real verify step
- work that is mostly sequential and easier to review in one session
