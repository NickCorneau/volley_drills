---
id: docs-index
title: Volleycraft Docs
status: active
stage: validation
type: index
summary: "Editorial index for the docs tree: what each doc family owns and where to route changes."
authority: documentation structure and editorial routing
last_updated: 2026-05-02
depends_on:
  - docs/catalog.json
  - docs/ops/agent-documentation-contract.md
---

# Volleycraft Docs

This folder is the source of truth for product thinking, requirements, research, and operating guidance.

## Purpose

Provide the prose editorial index for the docs system:

- which doc family owns which kind of change
- how to route a documentation update without reading everything
- how canon, research, and ops docs relate to each other

## Use This File When

- routing a docs update
- deciding which doc owns a concept
- checking the editorial hierarchy across core docs, milestones, specs, research, and ops

## Not For

- replacing `docs/catalog.json` as the machine index
- overriding product canon
- serving as the current runtime guide

## Update When

- doc ownership changes
- a new canonical or routing-critical doc is added
- the recommended editorial fast path changes

## Machine Contract

- `docs/catalog.json` is the machine-readable doc map.
- `docs/README.md` is the editorial companion for humans and agents.
- `docs/ops/agent-documentation-contract.md` defines doc-surface conventions and change propagation.
- `AGENTS.md` owns repo-wide routing and current-state guidance.

## Structure

| Path | Owns | Read when |
| --- | --- | --- |
| `vision.md` | product principles and strategic guardrails | checking non-negotiables |
| `decisions.md` | decided, open, and ruled-out items | before changing product or technical choices |
| `prd-foundation.md` | scope, workflow, object model, MVP requirements | implementing or reshaping product behavior |
| `roadmap.md` | phase sequencing and exit criteria | planning beyond a single milestone |
| `milestones/` | thin-slice charters | checking scope and evidence for a milestone |
| `specs/` | milestone behavior details | clarifying implementation behavior |
| `ideation/` | ranked idea exploration that identifies promising directions without authorizing implementation | choosing which direction to brainstorm or plan next |
| `brainstorms/` | requirements and lightweight PRDs that define what to build before planning how; includes generated-diagnostics addenda for decision-debt compression, dynamic surface sentinels, and redistribution causality receipts | turning selected ideas into product or workflow requirements |
| `research/` | curated supporting evidence | when canon needs evidence or rationale |
| `design/` | design / UX hub: pointer index for guidelines + dated UI/UX review passes | starting a UI/UX change or writing a design review |
| `reviews/` | dated audits and review artifacts that inform follow-up plans without becoming product canon; includes the generated-plan diagnostics report validated by `npm run diagnostics:report:check` | checking prior audit findings before changing catalog, metadata, generated-plan diagnostics, or cross-cutting quality surfaces |
| `ops/` | doc-surface, agent operating guidance, and catalog-authoring guidance | changing repo process, routing, or authoring policy |
| `status/` | current project posture and recent shipped-history snapshot | checking what shipped recently or whether work is in scope |

## Fast Path

1. `AGENTS.md`
2. `docs/catalog.json`
3. `docs/vision.md`
4. `docs/decisions.md`
5. `docs/prd-foundation.md`
6. relevant milestone/spec/research docs

## Related Folders

- `research-output/` — frozen provenance and raw research inputs
- `app/` — runnable validation prototype
- `archive/` — retired scaffolding kept as history/reference

## Working Principles

- One canonical location per concept.
- Cross-reference canon instead of copying it.
- Keep routing docs short and stable.
- Keep durable docs machine-scannable with frontmatter and clear ownership.
