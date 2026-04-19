---
id: agents
title: Agent Orientation
status: active
stage: validation
type: agent-contract
summary: "Canonical prose repo contract: current state, read order, source-of-truth order, and repo-wide working constraints."
authority: repo-wide routing, working constraints, and agent-facing orientation
last_updated: 2026-04-19-b
depends_on:
  - docs/catalog.json
  - docs/vision.md
  - docs/decisions.md
  - docs/ops/agent-operations.md
---

# Agent Orientation

## Identity

**Volleycraft** — volleyball training workflow app for self-coached amateurs. Beach-first in M001 scope; volleyball-inclusive long-run (see `D125` in `docs/decisions.md` and `docs/research/product-naming.md` for the naming rationale, the 13-test rubric, and the rename-scope guardrails — including which identifiers were deliberately not renamed). A runnable v0a validation prototype exists under `app/` (React + Dexie + PWA); v0b build is in progress as the D91 field-test artifact (`D119`). M001 full build remains gated on D91 evidence against v0b.

## Purpose

Give agents one durable, concise repo contract for current state, read order, source-of-truth order, and repo-wide working constraints.

## Use This File When

- entering the repo cold
- deciding what to read next
- resolving source-of-truth conflicts
- checking repo-wide constraints or current project posture
- updating agent-facing guidance

## Not For

- replacing canonical product docs such as `docs/vision.md`, `docs/decisions.md`, or `docs/prd-foundation.md`
- acting as the exhaustive machine index
- storing raw research detail or implementation history
- duplicating deep control-plane or archive detail that belongs elsewhere

## Update When

- the repo-wide read order changes
- source-of-truth order changes
- current phase, milestone, or blocking gate changes
- repo-wide automation expectations materially change
- canonical entry surfaces change

## Machine Contract

- `AGENTS.md` is the canonical prose repo contract.
- `docs/catalog.json` is the machine-readable doc map and routing table.
- `README.md` is the human repo hub.
- `docs/README.md` is the prose editorial index for `docs/`.
- `docs/ops/agent-operations.md` is the current runtime/operations guide.
- `docs/ops/agent-documentation-contract.md` owns doc-surface conventions and change propagation.
- `CLAUDE.md`, `llms.txt`, and `agent-manifest.json` are thin compatibility surfaces only.

## Current State

- **Phase**: 0 (validation)
- **Posture**: v0a prototype shipped; v0b build in progress as D91 field-test artifact (`D119`)
- **Active milestone**: `M001` Solo Session Loop
- **Next milestone in queue**: `M002` Weekly Confidence Loop (post-M001 self-coached follow-on)
- **Blocking gate**: D91 field-test evidence against v0b (`D119`) must pass before M001 moves into the full build
- **Prototype feedback**: start with `docs/research/2026-04-12-v0a-runner-probe-feedback.md` for any prototype work
- **Key open questions**: `O4`, `O5`, `O6`, `O7`, `O11`, `O12`, `O14`, `O15`, `O16` in `docs/decisions.md`

## Cold-Start Protocol

Read only as much as the task needs.

1. `AGENTS.md`
2. `docs/catalog.json`
3. Load the smallest relevant pack:
   - Product direction: `docs/vision.md` -> `docs/decisions.md` -> `docs/prd-foundation.md`
   - Milestone/spec work: `docs/milestones/m001-solo-session-loop.md` -> relevant `docs/specs/`
   - Prototype work: `docs/research/2026-04-12-v0a-runner-probe-feedback.md` -> `app/README.md`
   - Research: `docs/research/README.md` -> narrowest relevant note
   - Docs editing: `docs/README.md` -> `docs/ops/agent-documentation-contract.md`
   - Agent/runtime guidance: `docs/ops/agent-operations.md`

## Source-of-Truth Order

When guidance conflicts, higher rank wins:

1. `docs/vision.md`
2. `docs/decisions.md`
3. `docs/prd-foundation.md`
4. `docs/roadmap.md`
5. `docs/milestones/`
6. `docs/specs/`
7. `docs/research/`
8. `docs/ops/`
9. `AGENTS.md`
10. `CLAUDE.md`

Rules of thumb:

- `docs/decisions.md` is the first stop for anything that sounds decided, open, or ruled out.
- Research informs canon; it does not silently override canon.
- Compatibility surfaces stay pointer-oriented and should not become second sources of truth.

## Stable IDs And Doc Conventions

- `P*` — principles in `docs/vision.md`
- `D*` — decisions in `docs/decisions.md`
- `O*` — open questions in `docs/decisions.md`
- `M*` — milestones in `docs/milestones/`
- `R*` — requirements in specs where used

Durable docs under `docs/` should keep YAML frontmatter and explicit ownership. Prefer cross-references over copying canon into multiple places.

## Operational Constraints

- This repo is Cursor-first.
- Automation expects **WSL or Linux + bash + python3**. Editing from Windows Cursor is fine, but repo scripts are not PowerShell-first.
- Keep autonomous work bounded: one task, explicit verification, explicit escalation triggers.
- The older queued-task control plane is archived; do not assume `ops/agent/` is an active workflow surface.
- Keep recommendations aligned with courtside mobile use, low typing, and local-first behavior.
- New durable findings should move into canonical docs; `research-output/` remains frozen provenance.

## Verification Hints

- Agent/doc surface changes: `bash scripts/validate-agent-docs.sh`
- App changes: run the narrowest relevant `app/` verification commands

## Learned User Preferences

- Prefer product clarity and the smallest useful MVP over premature feature expansion.
- Favor structured workflows over chat-first UX.
- Optimize for fast, low-typing, readable courtside interaction.
- Optimize for joy, trust, and investment together: the app should feel like a main training tool, not a data-entry form.
- Prefer deleting or demoting stale documentation rather than leaving misleading material at canonical tiers.

## Learned Workspace Facts

- The prototype under `app/` is real and runnable; older planning docs may describe a pre-build state.
- The active automation environment is WSL/bash-friendly.
- Historical control-plane scaffolding now lives in `archive/agent-control-plane/`.
