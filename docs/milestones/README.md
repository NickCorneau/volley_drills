---
id: milestones-readme
title: Milestones
status: active
stage: planning
type: index
authority: milestone conventions, status vocabulary, charter requirements
summary: "How milestones work, status vocabulary, and charter requirements."
last_updated: "2026-04-16"
depends_on:
  - docs/vision.md
  - docs/prd-foundation.md
  - docs/roadmap.md
---

# Milestones

This folder holds the project’s execution slices.

A **milestone** is not a 2-week sprint. It is an outcome-based slice of work that can be reviewed on its own and either:

- complete
- remain blocked
- get revised
- get deferred

## How milestones fit the docs system

- `docs/vision.md` explains the long-term product direction.
- `docs/prd-foundation.md` defines the product backbone, scope, and open questions.
- `docs/roadmap.md` sequences phases and validation work.
- `docs/discovery/` holds Phase 0 validation artifacts that should inform milestone scope.
- `docs/specs/` holds narrow behavior specs that make milestone charters clearer without turning them into implementation plans.
- `docs/milestones/` turns that strategy into individual, reviewable slices.

## What a milestone charter should contain

Every milestone should explain:

- why this slice matters now
- which user and workflow it targets
- what is in scope
- what is explicitly out of scope
- what assumptions or planning defaults it depends on
- what evidence will count as success
- what blockers should stop progress and return control to the human

## Status guidance

Suggested statuses:

- `draft` - still being shaped
- `ready` - clear enough to plan or implement
- `active` - currently being worked
- `blocked` - waiting on a decision
- `complete` - review passed
- `deferred` - intentionally parked

## Planning-stage rule

A runnable v0a prototype exists under `app/`. v0b build is in progress as the D91 field-test artifact (`D119`). Milestone files should still behave like charters and thin-slice specs until their build phase is explicitly active.

Use `docs/templates/milestone-charter.md` as the default starting point.
