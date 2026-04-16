---
id: agent-operations
title: Agent Operations
status: active
stage: validation
type: ops
authority: runtime posture, bounded-work rules, WSL/bash automation expectations, and archived control-plane guidance
summary: "Consolidated agent operating model for this repo: current posture, automation constraints, and what remains intentionally manual."
last_updated: 2026-04-15
depends_on:
  - AGENTS.md
  - docs/catalog.json
  - docs/ops/agent-documentation-contract.md
---

# Agent Operations

## Purpose

Define the practical operating model for agents in this repo now that the product has a runnable validation prototype and the heavier queued-task control plane has been retired from the active tree.

## Use This File When

- checking how agents should work in this repo today
- deciding whether a task should stay interactive or can be bounded and scripted
- verifying the supported automation environment
- understanding what parts of the older control-plane model were archived

## Not For

- product direction or scope decisions
- milestone acceptance criteria
- replacing `AGENTS.md` as the repo-wide prose contract
- replacing `docs/ops/agent-documentation-contract.md` as the docs-surface contract

## Update When

- the supported automation environment changes
- bounded-work rules materially change
- archived control-plane guidance needs to be restored or reintroduced
- agent/runtime expectations in `AGENTS.md` drift from operational reality

## Machine Contract

- `AGENTS.md` is the canonical prose repo contract.
- `docs/catalog.json` is the machine-readable doc map.
- `docs/ops/agent-operations.md` is the canonical prose runtime/operations guide.
- `docs/ops/agent-documentation-contract.md` owns doc-surface structure and change propagation.
- `CLAUDE.md`, `llms.txt`, and `agent-manifest.json` are thin compatibility surfaces that should stay pointer-oriented.

## Current Posture

- The repo is in **Phase 0 validation** with a runnable v0a prototype under `app/`.
- Product work remains **docs-first** for M001 scope beyond the current prototype until the field-test gate clears.
- The active agent workflow is **interactive and Cursor-first**, not queue-first.
- The older `ops/agent/` task-queue control plane has been retired from the active workflow and archived as historical scaffolding.

## Environment

- Primary automation environment: **WSL or Linux with bash and python3**.
- Editing from Windows Cursor is fine.
- Repo scripts and hooks are **not PowerShell-first**.
- Validation and utility scripts should continue to assume `bash` semantics unless the repo explicitly adopts a cross-shell wrapper.

## Bounded-Work Rules

- Keep work scoped to one concrete outcome at a time.
- Prefer direct, interactive execution unless the task is clearly bounded and independently verifiable.
- Always pair changes with explicit verification commands.
- Stop when a task becomes mostly product ambiguity instead of implementation.
- Treat archived automation scaffolding as reference material, not the default workflow.

## What Not To Automate

- milestone definition
- unresolved product direction
- tasks without a real verification step
- long unattended loops whose only justification is "because the scaffolding exists"

## Archived Control Plane

The earlier queued-task control plane was useful as an exploration of unattended execution, but it added maintenance and drift for a repo whose day-to-day workflow is still interactive.

The active tree no longer treats these as first-class runtime surfaces:

- `ops/agent/queue/`
- `ops/agent/schemas/`
- `ops/agent/handoffs/`
- `ops/agent/runs/`
- `scripts/agent-supervisor.sh`
- `scripts/agent-dispatch.sh`
- `scripts/agent-verify.sh`
- `scripts/agent-notify.sh`
- `scripts/validate-agent-control-plane.sh`

Historical notes and recovery guidance live under `archive/agent-control-plane/`.

## Verification

- Agent/doc surface changes: `bash scripts/validate-agent-docs.sh`
- App changes: run the narrowest relevant app verification from `app/`

