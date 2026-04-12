---
id: agent-documentation-contract
title: Agent Documentation Contract
status: active
stage: planning
type: ops
authority: agent-facing documentation surfaces, machine-scannable doc patterns, change-propagation rules
summary: "Canonical contract for agent entry surfaces, machine-scannable docs, and what must be updated when repo guidance changes."
last_updated: 2026-04-12
depends_on:
  - docs/catalog.json
  - docs/README.md
  - docs/ops/agent-runtime.md
---

# Agent Documentation Contract

## Purpose

Define how this repo should present itself to agents and how durable docs should stay machine-scannable over time.

This doc is the canonical contract for:

- agent entry surfaces
- machine-readable documentation patterns
- change-propagation rules when repo guidance changes

## Use This File When

- editing `AGENTS.md`, `docs/catalog.json`, `agent-manifest.json`, or `llms.txt`
- adding, renaming, or removing canonical docs under `docs/`
- changing documentation conventions or agent-routing rules
- deciding whether a new doc needs stronger machine-scannable structure

## Not For

Do not use this doc as the source of truth for:

- product principles (`docs/vision.md`)
- decision status (`docs/decisions.md`)
- product scope (`docs/prd-foundation.md`)
- phase sequencing (`docs/roadmap.md`)
- runtime task flow (`docs/ops/agent-runtime.md`)

## Update When

- an agent entry surface changes
- machine-scannable doc conventions change
- the change-propagation rules change
- a new durable companion file is introduced for agent routing

## Machine Contract

- `docs/catalog.json` is the exhaustive machine-readable index.
- `agent-manifest.json` is the compact JSON cold-start payload.
- `llms.txt` is the lightweight text summary.
- `AGENTS.md` is the canonical prose repo contract.
- This file defines what those surfaces must keep in sync and what must be updated together when repo guidance changes.
- `bash scripts/validate-agent-docs.sh` is the focused verification entrypoint for agent-facing docs and machine-readable routing surfaces.

## Agent Entry Surfaces

These files work together. They should not drift.

- `AGENTS.md`
  - Primary interactive repo contract for agents working inside the repo.
- `docs/catalog.json`
  - Richest machine-readable map of canonical docs, routing, dependencies, and task-contract pointers.
- `agent-manifest.json`
  - Pure JSON cold-start payload for tooling that should not parse markdown first.
- `llms.txt`
  - Lightweight text overview for generic LLM tooling and quick cold starts.
- `.cursor/rules/`
  - Persistent working rules that shape agent behavior across sessions.

## Durable Doc Contract

For durable docs under `docs/`:

- Use YAML frontmatter with at least:
  - `id`
  - `title`
  - `status`
  - `stage`
  - `type`
  - `summary`
- Add `authority`, `last_updated`, `depends_on`, `decision_refs`, and `open_question_refs` when they materially help routing or consistency.
- Keep section headings stable so agents can target known sections reliably.
- Prefer short scan-friendly sections near the top of high-value docs:
  - `Purpose`
  - `Agent Quick Scan`
  - `Fast path`
  - `Use this doc when`
  - `Not this doc for`
- Reference stable IDs instead of rephrasing canon:
  - `P*` for principles
  - `D*` for decided items
  - `O*` for open questions
  - `M*` for milestones
  - `R*` for requirements where used

## Structure Preferences

Prefer structures that agents can mine quickly:

- flat lists for contracts, defaults, and non-goals
- explicit routing tables for topic-to-doc mapping
- JSON or schema examples for durable task or data shapes
- short summaries before long rationale

Avoid:

- burying constraints only in prose
- duplicating the same decision in multiple docs when a cross-reference will do
- ambiguous ownership of canonical concepts

## Change Propagation Rules

### When a canonical doc is added or renamed

Update in the same pass:

- `docs/catalog.json`
- `agent-manifest.json`
- `docs/README.md`
- `AGENTS.md` if the doc affects read order, topic routing, or source-of-truth guidance
- `llms.txt` if the doc changes generic cold-start guidance

### When repo guidance or read order changes

Update in the same pass:

- `AGENTS.md`
- `docs/catalog.json`
- `agent-manifest.json`
- `llms.txt`
- any affected `.cursor/rules/*.mdc`
- re-run `bash scripts/validate-agent-docs.sh`

### When documentation conventions change

Update in the same pass:

- this file
- `docs/catalog.json` doc-conventions metadata
- `.cursor/rules/machine-scannable-docs.mdc`
- re-run `bash scripts/validate-agent-docs.sh`

## Related Docs

- `AGENTS.md`
- `docs/README.md`
- `docs/catalog.json`
- `docs/ops/agent-runtime.md`
- `.cursor/rules/repo-operating-model.mdc`
