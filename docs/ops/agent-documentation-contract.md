---
id: agent-documentation-contract
title: Agent Documentation Contract
status: active
stage: validation
type: ops
summary: "Conventions for agent-facing docs, compatibility surfaces, and change propagation."
authority: doc-surface structure, machine-scannable patterns, and change propagation
last_updated: 2026-04-15
depends_on:
  - AGENTS.md
  - docs/catalog.json
  - docs/README.md
---

# Agent Documentation Contract

## Purpose

Define how the repo should present itself to agents and how routing-critical docs should stay lightweight, explicit, and machine-scannable.

## Use This File When

- editing `AGENTS.md`, `docs/catalog.json`, `README.md`, `llms.txt`, `CLAUDE.md`, or `agent-manifest.json`
- adding, renaming, or retiring a routing-critical doc
- changing durable doc conventions

## Not For

- product direction
- milestone scope
- app implementation detail
- replacing `docs/ops/agent-operations.md` as the runtime guide

## Update When

- a canonical entry surface changes
- machine-scannable doc conventions change
- change-propagation rules change

## Machine Contract

- `AGENTS.md` is the canonical prose repo contract.
- `docs/catalog.json` is the machine-readable routing map.
- `README.md` is the human repo hub.
- `docs/README.md` is the editorial docs index.
- `agent-manifest.json`, `llms.txt`, and `CLAUDE.md` are compatibility surfaces and should stay thin.

## Entry Surfaces

Canonical:

- `AGENTS.md`
- `docs/catalog.json`
- `README.md`
- `docs/README.md`
- `docs/research/README.md`
- `docs/ops/agent-operations.md`
- `docs/ops/agent-documentation-contract.md`

Compatibility-only:

- `agent-manifest.json`
- `llms.txt`
- `CLAUDE.md`

Compatibility surfaces should point back to the canonical files above instead of duplicating full routing logic.

## Durable Doc Contract

For durable docs under `docs/`:

- keep YAML frontmatter with at least `id`, `title`, `status`, `stage`, `type`, and `summary`
- add `authority`, `last_updated`, and `depends_on` when they materially help routing or consistency
- keep stable headings for routing-critical docs
- prefer short scan-friendly sections near the top:
  - `Purpose`
  - `Use This File When`
  - `Not For`
  - `Update When`
  - `Machine Contract`
- prefer stable IDs (`P*`, `D*`, `O*`, `M*`, `R*`) over copied prose

## Change Propagation

When repo routing changes:

- update `AGENTS.md`
- update `docs/catalog.json`
- update any affected compatibility surfaces
- update relevant `.cursor/rules/*.mdc`
- run `bash scripts/validate-agent-docs.sh`

When a canonical doc is added, removed, or renamed:

- update `docs/catalog.json`
- update `docs/README.md`
- update `AGENTS.md` if read order or routing changed

When documentation conventions change:

- update this file
- update `docs/catalog.json`
- update `.cursor/rules/machine-scannable-docs.mdc`
