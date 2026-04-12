---
id: agents
title: Agent Orientation
status: active
stage: planning
type: agent-contract
summary: "Lean repo entrypoint for agents: current state, source-of-truth order, cold-start routing, and repo-wide operating constraints."
authority: agent read order, operating rules, learned preferences, repo-wide routing
last_updated: 2026-04-12
depends_on:
  - docs/vision.md
  - docs/decisions.md
  - docs/ops/agent-runtime.md
  - docs/ops/agent-documentation-contract.md
---

# Agent Orientation

## Identity

Beach volleyball training workflow app for self-coached amateurs. A runnable v0a validation prototype exists under `app/` (React + Dexie + PWA). M001 build gate remains closed pending field-test evidence (D91).

## Purpose

Give agents one durable, human-readable repo contract for:

- cold-start orientation
- source-of-truth order
- current repo state and gating conditions
- repo-wide constraints that should not be rediscovered each session
- routes to deeper docs without turning this file into the full index

Keep this file concise and pointer-oriented. If content becomes an exhaustive table, dependency graph, file inventory, or schema dump, move that detail to the appropriate companion surface and link to it from here.

## Use This File When

- entering the repo cold
- resolving source-of-truth conflicts
- deciding what to read next
- checking repo-wide constraints, preferences, or current project state
- updating agent-facing repo guidance

## Not For

- replacing canonical product docs such as `docs/vision.md`, `docs/decisions.md`, or `docs/prd-foundation.md`
- acting as the exhaustive doc index, dependency graph, or line-count registry
- storing raw research detail or mirrored file inventories
- encoding file-scoped behavior that belongs in `.cursor/rules/` or closer local docs
- replacing `ops/agent/README.md` as the control-plane layout reference

## Update When

- cold-start routing changes
- the source-of-truth hierarchy changes
- repo-wide operating constraints or learned preferences materially change
- current phase, active milestone, or blocking gates materially change
- the set of agent entry surfaces changes

## Machine Contract

This file is the canonical prose repo contract. Companion surfaces split the rest of the job:

- `docs/catalog.json` � exhaustive machine-readable doc index, routing rules, dependency graph, and context-budget metadata
- `docs/README.md` � prose editorial index for doc families and ownership
- `docs/ops/agent-documentation-contract.md` � canonical doc conventions, frontmatter expectations, and change-propagation rules
- `agent-manifest.json` � compact JSON cold-start payload
- `llms.txt` � lightweight navigational summary for generic LLM tooling
- `docs/ops/agent-runtime.md` � bounded-runtime contract and unattended-work guidance
- `ops/agent/README.md` � control-plane layout, task flow, and handoff mechanics

Drift rule:

- if the disagreement is about inventories, routing tables, dependency edges, or line counts, prefer `docs/catalog.json`
- if the disagreement is about prose policy, source-of-truth order, or repo-wide operating constraints, prefer `AGENTS.md`
- when changing agent entry surfaces or repo guidance, update all affected companion files in the same pass

## Current State

- **Phase**: 0 (discovery + validation)
- **Posture**: v0a validation prototype shipped; docs-first for M001 scope beyond v0a
- **Active milestone**: `M001` Solo Session Loop
- **v0a status**: runnable PWA under `app/` with 6 routes, Dexie persistence, preset sessions, safety gates, timer, review, and resume flow
- **Blocking gate**: field-test evidence (D91) must pass before `M001` moves to full implementation
- **Key open questions**: `O6`, `O7`, `O11`, `O12` in `docs/decisions.md`
- **Prototype feedback**: `docs/research/2026-04-12-v0a-runner-probe-feedback.md` — living backlog of UX/QA findings

## Cold-Start Protocol

When entering this repo cold, stop reading as soon as you have enough context for the task.

1. Read `AGENTS.md`.
2. Read `docs/catalog.json` if you need machine routing, dependency edges, or context-budget details. Read `agent-manifest.json` instead if you only need the compact JSON version.
3. Load the smallest relevant task pack:
  - Product direction: `docs/vision.md` -> `docs/decisions.md` -> `docs/prd-foundation.md`
  - Milestone or implementation planning: `docs/milestones/m001-solo-session-loop.md` -> relevant `docs/specs/` -> `app/README.md`
  - Validation / prototype sequencing: `docs/discovery/phase-0-readiness-assessment.md` -> `docs/discovery/phase-0-wedge-validation.md` -> `docs/superpowers/specs/2026-04-11-v0-prototype-ladder-design.md`
  - Research: `docs/research/README.md` -> narrowest relevant note
  - Docs editing or entry-surface changes: `docs/README.md` -> `docs/ops/agent-documentation-contract.md`
  - Agent ops / control plane: `docs/ops/agent-runtime.md` -> `ops/agent/README.md`
4. Before changing product scope or implementation direction, check `docs/decisions.md` for blocking open questions and confirm the milestone stage allows the work.

## Source-of-Truth Hierarchy

When guidance conflicts, higher rank wins:

1. `docs/vision.md` � product principles and strategic stance
2. `docs/decisions.md` � decided, open, and ruled-out items
3. `docs/prd-foundation.md` � scope, workflow, object model, MVP requirements
4. `docs/roadmap.md` � phase sequencing and exit criteria
5. `docs/milestones/` � thin-slice charter scope
6. `docs/specs/` � milestone-level behavior details
7. `docs/research/` � curated research inputs
8. `docs/ops/` � operating model, runtime, and documentation contract
9. `AGENTS.md` � repo-wide agent routing and working guidance
10. `CLAUDE.md` � tool-specific execution hints only

Rules of thumb:

- `docs/decisions.md` is the first stop for anything that sounds decided, open, or ruled out.
- Research informs canon; it does not silently override canon.
- `CLAUDE.md` should never become a second source of truth for repo policy.

## Stable IDs and Doc Conventions

Use stable IDs when citing enumerable items across docs:

- `P`* � product principles in `docs/vision.md`
- `D*` � decided items in `docs/decisions.md`
- `O*` � open questions in `docs/decisions.md`
- `M*` � milestones in `docs/milestones/`
- `R*` � requirements in spec docs where used

Durable doc conventions live in `docs/ops/agent-documentation-contract.md`. In practice:

- docs under `docs/` should keep YAML frontmatter
- parse `authority` and `depends_on` before editing
- prefer cross-references to canonical docs over duplicated prose
- keep agent-facing docs scan-friendly with stable headings and flat lists

## Operational Constraints

- This repo is Cursor-first. Shared agent behavior lives in `AGENTS.md`, `.cursor/rules/`, and `docs/ops/`.
- Default to docs-first work until a milestone is explicitly approved for implementation.
- Keep autonomous work bounded: one task, explicit verification commands, explicit escalation triggers, and terminal state `done`, `blocked`, `failed`, or `budget_exhausted`.
- Use `ops/agent/queue/` for task specs and `ops/agent/handoffs/` for curated handoffs. Keep volatile run or lock state out of git.
- Keep recommendations aligned with courtside mobile use, low typing, structured workflows, and solo/pair fallback.
- Prefer repo docs, plans, and agent-control surfaces to be AI-native, agent-first, and machine-scannable.
- New research should be synthesized into canonical docs: keep provenance in `research-output/`, then mine durable findings into `docs/research/beach-training-resources.md` or the narrowest relevant canonical doc.
- The product is local-first by principle (`D27`-`D29`): device is the primary copy, cloud is a supporting peer.
- Environment bias is WSL/bash-first; control-plane automation expects `bash` and `python3`.

## Verification Hints

- Agent-facing doc or entrypoint changes: run `bash scripts/validate-agent-docs.sh`
- Queue, handoff, schema, or control-plane changes: run `bash scripts/validate-agent-control-plane.sh`
- If a change crosses multiple entry surfaces, update companions named in `docs/ops/agent-documentation-contract.md` in the same pass

## Learned User Preferences

- Prefer product clarity and the smallest useful MVP over premature feature expansion.
- Favor structured objects and workflows over chat-first UX.
- Optimize for fast, low-typing, readable courtside interaction.
- When the runnable app and documentation disagree, fix docs and machine-readable entry surfaces first; do not leave stale narrative in place where it can be mistaken for current truth.
- Prefer actively demoting or removing stale documentation over leaving misleading material discoverable at the same tier as canonical docs.

## Learned Workspace Facts

- A v0a session-loop prototype runs from `app/`; some entry and research docs may still read like scaffold-only or intermediate states—verify against code and `docs/catalog.json` when assessing drift.
- Demoting or deleting docs should include updating `docs/catalog.json`, `agent-manifest.json`, `llms.txt`, and other cross-references required by `docs/ops/agent-documentation-contract.md` so machine routing stays consistent.
- `bash scripts/validate-agent-docs.sh` enforces strict heading and structure checks; malformed YAML frontmatter, heading drift, or CRLF-related line-ending mismatches can fail validation on Windows-oriented checkouts—normalize entry docs and re-run the script after edits.