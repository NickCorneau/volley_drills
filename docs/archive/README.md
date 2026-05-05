---
id: docs-archive
title: Docs Archive
status: active
stage: validation
type: index
summary: "Index for completed or superseded historical docs moved out of active routing."
authority: archive structure for historical documentation under docs/
last_updated: 2026-05-02
depends_on:
  - docs/README.md
  - docs/catalog.json
---

# Docs Archive

## Purpose

This folder holds completed or superseded historical docs that should no longer sit in the active planning and requirements folders.

## Use This File When

- looking up implementation or requirements history moved out of active routing
- deciding whether a completed or superseded doc belongs under `docs/archive/<family>/`
- checking archive eligibility before moving docs

## Not For

- current implementation instructions
- active requirements, plans, reviews, status docs, or research
- complete-but-live plan registries that should stay in `docs/plans/` with `active_registry: true`

## Update When

- archive family structure changes
- successor metadata rules change
- archive eligibility or routing policy changes

## Machine Contract

- Archived docs are historical unless an active doc explicitly cites them as provenance.
- `docs/catalog.json` is the machine-readable source for archive paths, `canonical_successor`, `successor_disposition`, `successor_reason`, and `active_registry`.
- `docs/ops/agent-documentation-contract.md` owns the fuller archive lifecycle policy.

## Structure

- `plans/` — completed, landed, or superseded implementation plans that are no longer live registries.
- `brainstorms/` — superseded requirements / brainstorm docs preserved for provenance.

Keep current registries, active requirements, active plans, status docs, reviews, and research in their normal folders unless a future cleanup explicitly changes the archive policy.

## Eligibility Checklist

Move a doc here only when it is complete, superseded, or provenance-only and no longer owns active routing. In the same change:

- update `docs/catalog.json` to the new archive path
- set `canonical_successor` in `docs/catalog.json` when one current doc now owns routing, or `successor_disposition: no_single_successor` plus `successor_reason` when no single route exists
- update direct links plus `depends_on`, `related`, and `origin` references
- make active docs cite archived docs as historical provenance, not current instructions
- leave complete-but-live registries in their active family and mark catalog entries with `active_registry: true`

The fuller lifecycle contract lives in `docs/ops/agent-documentation-contract.md`.
