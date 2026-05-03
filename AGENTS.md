---
id: agents
title: Agent Orientation
status: active
stage: validation
type: agent-contract
summary: "Canonical prose repo contract: current state, read order, source-of-truth order, and repo-wide working constraints."
authority: repo-wide routing, working constraints, and agent-facing orientation
last_updated: 2026-05-02
depends_on:
 - docs/catalog.json
 - docs/vision.md
 - docs/decisions.md
 - docs/ops/agent-operations.md
 - docs/status/current-state.md
---

# Agent Orientation

## Identity

**Volleycraft** — volleyball training workflow app for self-coached amateurs. Beach-first in M001 scope; volleyball-inclusive long-run (see `D125` in `docs/decisions.md` and `docs/research/product-naming.md` for the naming rationale, the 13-test rubric, and the rename-scope guardrails — including which identifiers were deliberately not renamed). The v0b Starter Loop (React + Dexie + PWA) under `app/` is the M001 base; Tier 1a and Tier 1b Layer A have shipped on top of it under `D130` founder-use mode (2026-04-20 → 2026-07-20). The `D91` retention gate is **deferred**, not dropped. See `docs/status/current-state.md` for the live posture.

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

Live posture, recent shipped history, and dated detail are owned by `docs/status/current-state.md`. Read it for anything beyond the structural shape below.

- **Phase**: 0 (validation)
- **Active milestone**: `M001` Solo Session Loop, on top of the v0b Starter Loop under `app/`
- **Next milestone in queue**: `M002` Weekly Confidence Loop (per `D124`)
- **Mode and gate**: `D130` founder-use mode; the `D91` retention gate is deferred, not dropped — see `docs/status/current-state.md` for the active condition reads
- **Key open questions**: tracked under `O*` in `docs/decisions.md`

## Cold-Start Protocol

Read only as much as the task needs.

1. `AGENTS.md`
2. `docs/catalog.json`
3. Load the smallest relevant pack:
   - Product direction: `docs/vision.md` -> `docs/decisions.md` -> `docs/prd-foundation.md`
   - Milestone/spec work: `docs/milestones/m001-solo-session-loop.md` -> relevant `docs/specs/`
   - Prototype work: `docs/research/2026-04-12-v0a-runner-probe-feedback.md` -> `docs/research/2026-04-19-v0b-starter-loop-feedback.md` -> `app/README.md`
   - **App architecture / new feature work**: `app/README.md` -> `docs/ops/app-architecture-guidance.md` -> `.cursor/rules/data-access.mdc` / `component-patterns.mdc` / `routing.mdc` / `testing.mdc`
   - Documented solutions / known fixes: `docs/solutions/` (when present) for past bugs, best practices, and workflow patterns, organized by category with YAML frontmatter such as `module`, `tags`, and `problem_type`; relevant when implementing or debugging in documented areas
   - Research: `docs/research/README.md` -> narrowest relevant note
   - Design / UX work: `docs/design/README.md` -> referenced design-canonical doc (brand / visual / outdoor)
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
- Treat Volleycraft as pair-native while still supporting solo training as a common mode.
- Prefer calm, shibui interfaces that reduce information overload and decision fatigue.
- For UI/app changes, value manual mobile dogfood testing with screenshots and iterative polish before declaring done.

## Learned Workspace Facts

- The v0b Starter Loop under `app/` is real, runnable, and deployed; M001 work continues in tiers on top of it under `D130` founder-use mode. Use `docs/status/current-state.md` for the current snapshot and recent shipped-history log.
- Treat `docs/plans/2026-04-16-003-rest-of-v0b-plan.md` as the v0b landed registry; use the dated Tier 1a / Tier 1b plans cataloged in `docs/catalog.json` for implementation history.
- The current Dexie schema is **v6**; per-drill capture, including optional streak metric capture, lives on `/run/check` (`DrillCheckScreen`), not on Transition or Review.
- The active automation environment is WSL/bash-friendly.
- Historical control-plane scaffolding now lives in `archive/agent-control-plane/`.
- The live v0b PWA deploys as a Cloudflare Worker at <https://volleydrills.nicholascorneau.workers.dev>; use `app/README.md` and `docs/ops/deploy-cloudflare-worker.md` for deploy runbooks.
- Generated-plan diagnostics are the active focus-readiness quality surface; `docs/reviews/2026-05-01-generated-plan-diagnostics-report.md`, `docs/reviews/2026-05-01-generated-plan-diagnostics-triage.md`, and `npm run diagnostics:report:*` own the report/triage loop.
