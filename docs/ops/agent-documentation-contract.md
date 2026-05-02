---
id: agent-documentation-contract
title: Agent Documentation Contract
status: active
stage: validation
type: ops
summary: "Conventions for agent-facing docs, compatibility surfaces, and change propagation."
authority: doc-surface structure, machine-scannable patterns, and change propagation
last_updated: 2026-05-02
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

## Archive Lifecycle

Use `docs/archive/<family>/` for completed or superseded historical docs that should no longer participate in active planning or requirements routing.

Archive a doc only when:

- its implementation or decision value is complete, superseded, or provenance-only
- current active docs have a clearer successor or routing owner
- direct links, `depends_on`, `related`, `origin`, and `docs/catalog.json` are updated in the same change
- active docs that still cite it make the historical/provenance role clear

Keep a doc in its active family, even when its work is complete, when it is still a shipped ledger, live registry, canonical implementation reference, current review, current research, status doc, or active spec. Mark complete plan registries in `docs/catalog.json` with `active_registry: true` so future archive passes do not mistake them for stale history.

Do not use archived docs as current implementation instructions. If an archived or superseded doc has one clear current route, set `canonical_successor` in `docs/catalog.json` to the repo-relative path of that current doc. If no single successor exists, set `successor_disposition: no_single_successor` with a short `successor_reason` rather than inventing a fake chain.

For cataloged docs, `docs/catalog.json` is the canonical successor surface. Existing frontmatter such as `superseded_by` may remain as compatibility metadata, but it must agree with `canonical_successor` when both are present. Missing successor metadata is currently report-only; malformed opted-in successor metadata fails `bash scripts/validate-agent-docs.sh`.

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
