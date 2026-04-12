---
id: agent-control-plane
title: Agent Control Plane
status: active
stage: planning
type: ops-index
authority: repo-local task files, handoffs, local run artifacts, and worker flow
last_updated: 2026-04-12
depends_on:
  - AGENTS.md
  - docs/catalog.json
  - docs/ops/agent-runtime.md
  - ops/agent/queue/task-template.json
---

# Agent Control Plane

This folder holds the repo-local control plane for bounded agent work.

Use it to describe work, hand it off cleanly, and record local run artifacts without making chat history the only memory layer.

## Purpose

Define how task files, handoffs, schemas, and local run artifacts fit together for bounded agent work.

## Use This File When

- working anywhere under `ops/agent/`
- creating or reviewing task files
- checking task states, handoff expectations, or control-plane layout
- deciding which schema or script defines the machine contract

## Not For

- product direction, milestone scope, or PRD decisions
- replacing the formal task schema or status enum files
- serving as the only machine-readable task contract

## Update When

- queue or handoff layout changes
- task-state vocabulary changes
- required task fields or schema paths change
- script entrypoints or worker flow change

## Machine Contract

- `ops/agent/queue/task-template.json` is the canonical example task shape.
- `ops/agent/schemas/task.schema.json` is the formal task schema.
- `ops/agent/schemas/status-enums.json` is the canonical enum map.
- `ops/agent/README.md` is the prose companion for humans and agents.

## Fast path for workers

Read in this order when a task touches `ops/agent/`:

1. `AGENTS.md`
2. `docs/catalog.json`
3. `docs/ops/agent-runtime.md`
4. `ops/agent/README.md`
5. `ops/agent/queue/task-template.json`
6. the specific task file and any handoff

## Layout

- `queue/` - task specs the supervisor can claim
- `handoffs/` - stable handoff documents and templates (YAML frontmatter for machine parsing)
- `schemas/` - JSON Schema for task shape and status enums
- `runs/` - local run outputs, verification reports, and notifications
- `state/` - local locks, active-task pointers, and other transient state

`queue/` and `handoffs/` are tracked.

`runs/` and `state/` are local-only by default.

This control plane is WSL-first. The scripts and hooks are bash and assume a WSL or Linux environment with python3 available.

## Task states

Queue status vocabulary (applies only to task files in this folder):

- `pending`
- `claimed`
- `done`
- `blocked`
- `failed`
- `budget_exhausted`

Every task should move to exactly one terminal state.

Do not confuse queue status with doc status (`draft` / `active` / `deprecated`) or milestone status (`draft` / `ready` / `active` / `blocked` / `complete` / `deferred`). See `AGENTS.md` § Status vocabularies or `docs/catalog.json` § `status_vocabularies` for the full enum map.

## Task shape

A task file must include these required fields:

- `id` — unique task ID (T001, T002, ...)
- `title` — human-readable task name
- `status` — queue status (pending, claimed, done, blocked, failed, budget_exhausted)
- `kind` — task category (docs, implementation, research, ops, validation)
- `milestone` — milestone ID (M001, M002, ...)
- `summary` — one sentence describing what "done" means
- `scope.files` — paths the worker may read or modify
- `scope.out_of_scope` — explicit boundaries
- `verification.commands` — shell commands that must exit 0
- `verification.acceptance` — human-readable acceptance criteria
- `escalate_if` — conditions that stop autonomous work
- `worker` — preferred and unattended surface

Optional fields for richer agent context:

- `context.required_reads` — files the worker must read before starting (in order)
- `context.optional_reads` — files useful if context budget allows
- `context.estimated_input_lines` — approximate total context size (lines x ~40 = tokens)
- `context.decision_refs` — stable D* IDs that constrain this task
- `context.open_question_refs` — O* IDs that may block this task
- `output.artifacts` — paths the worker should create or update
- `output.side_effects` — non-file outcomes (e.g. "propagate D42 to specs")

See `queue/task-template.json` for the baseline structure and `schemas/task.schema.json` for the formal JSON Schema.

## Machine-readable contract

- Canonical task schema: `ops/agent/schemas/task.schema.json`
- Canonical task example: `ops/agent/queue/task-template.json`
- Status enums: `ops/agent/schemas/status-enums.json`
- Terminal queue states: `done`, `blocked`, `failed`, `budget_exhausted`
- Tracked surfaces: `queue/`, `handoffs/`
- Local-only surfaces: `runs/`, `state/`
- A worker should be able to start from files alone, without previous chat context
- Context budget hint: use `context.estimated_input_lines` to decide whether to load optional context

## Handoff rule

The worker should not depend on the previous chat.

Every run should start from:

1. the task file
2. any referenced milestone or product docs
3. a handoff file if the task needs extra context

## Bootstrap note

This repo currently has no commit history. Until an initial `HEAD` exists, the supervisor may fall back to the main checkout instead of creating a worktree. After that bootstrap step, use one worktree per queued task by default.

## Script entrypoints

| Script | Purpose |
|---|---|
| `scripts/agent-supervisor.sh` | Claim a pending task, set up work area, launch worker |
| `scripts/agent-dispatch.sh` | Dispatch a specific task to a worker surface |
| `scripts/agent-verify.sh` | Run verification commands for the active task |
| `scripts/agent-notify.sh` | Send completion or escalation notifications |
| `scripts/validate-agent-docs.sh` | Validate agent entry surfaces and machine-readable doc contracts |
| `scripts/validate-agent-control-plane.sh` | Validate queue, handoff, and state file integrity |

## Suggested flow

1. Add or update a task in `queue/`
2. Launch `scripts/agent-supervisor.sh`
3. Let the worker run in Cursor or Claude
4. Run `scripts/agent-verify.sh`
5. If the worker was interactive, manually advance the task from `claimed` to its terminal state after review
6. Review the resulting state before moving to the next task

When a task edits `AGENTS.md`, `docs/catalog.json`, `agent-manifest.json`, `llms.txt`, or the stable agent-facing docs under `docs/`, run `bash scripts/validate-agent-docs.sh` before the umbrella `bash scripts/validate-agent-control-plane.sh` pass.

CI mirrors the same checks in `.github/workflows/agent-validation.yml` for pushes, pull requests, and manual runs that touch the agent-facing docs or control-plane files.
