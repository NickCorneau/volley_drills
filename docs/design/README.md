---
id: design-index
title: Volleycraft Design Hub
status: active
stage: validation
type: index
summary: "Pointer-oriented index for Volleycraft design and UX work: brand guidelines, visual direction, outdoor UI defaults, and dated UI/UX review passes."
authority: discovery surface for design and UX guidelines and review history
last_updated: 2026-04-26
depends_on:
  - docs/catalog.json
  - docs/research/brand-ux-guidelines.md
  - docs/research/japanese-inspired-visual-direction.md
  - docs/research/outdoor-courtside-ui-brief.md
---

# Volleycraft Design Hub

Single discovery surface for design and UX work. Existing design-canonical docs stay in place under `docs/research/` (they are referenced by 40+ files including plan docs, decision records, and source code, so a wholesale move would create avoidable churn). New dated design / UX review passes go under `docs/design/reviews/`.

## Purpose

Give an agent or contributor one place to find every design-bearing surface in the repo, without requiring them to grep.

## Use This File When

- starting a UI / UX change and need the governing guidelines
- writing a new design or UX review pass
- looking for prior design reviews and what they recommended
- routing a design question against canonical voice and outdoor-first defaults

## Not For

- replacing `docs/catalog.json` as the machine index
- replacing `docs/decisions.md` for product decisions tied to design (those still go in `decisions.md`)
- archiving raw partner-walkthrough transcripts (those stay under `docs/research/partner-walkthrough-results/`)

## Update When

- a new design / UX review is written (add a row to `Reviews` below)
- a new canonical design guideline is added or the existing ones change focus
- a review forces a guideline-doc update (cross-link both)

## Machine Contract

- `docs/catalog.json` is the machine-readable doc map.
- `docs/research/brand-ux-guidelines.md` is the canonical voice / typography / state contract.
- `docs/research/japanese-inspired-visual-direction.md` is the canonical visual direction.
- `docs/research/outdoor-courtside-ui-brief.md` is the canonical outdoor-first UI floor.
- `.cursor/rules/courtside-copy.mdc` is the canonical copy invariants surface.
- Review files under `docs/design/reviews/` are dated, point-in-time captures and are not source of truth on their own.

## Canonical Design Guidelines (in place)

| Doc | Owns |
| --- | --- |
| `docs/research/brand-ux-guidelines.md` | voice, typography, color, copy, layout, iconography, target-audience posture |
| `docs/research/japanese-inspired-visual-direction.md` | spatial restraint, focal-zone rule, anti-cliché guardrails, tokonoma structure |
| `docs/research/outdoor-courtside-ui-brief.md` | outdoor-first surface, contrast floor, type scale, glanceability defaults |
| `.cursor/rules/courtside-copy.mdc` | copy invariants (headline-as-question, plain punctuation, jargon-test, equal cool-down review, audible structure) |

These four are the working contract for any design change. They are kept in their current locations because moving them would ripple into 40+ files. This hub points at them.

## Reviews

Dated design / UX review passes. Each is a point-in-time capture, not a source of truth.

| Date | Doc | Surface | Method |
| --- | --- | --- | --- |
| 2026-04-21 | `docs/research/partner-walkthrough-results/2026-04-21-iphone-viewport-design-review.md` | iPhone-class viewport pass | Browser at iPhone dimensions |
| 2026-04-22 | `docs/research/partner-walkthrough-results/2026-04-22-manual-ui-design-review.md` | Full cold-start → review → home loop | Browser at iPhone dimensions, before walkthrough-closeout polish |
| 2026-04-26 | `docs/design/reviews/2026-04-26-agent-ux-review.md` | Deep UX pass after walkthrough-closeout polish | Browser at iPhone dimensions, post-2026-04-23 polish |

## Related Surfaces

- `docs/research/partner-walkthrough-results/` — raw partner-walkthrough transcripts and synthesis (field-test data, not design guidelines)
- `docs/decisions.md` — design-touching decisions (`D86`, `D125`, `D129`, `D130`, `D132`)
- `docs/plans/2026-04-22-partner-walkthrough-polish.md`, `docs/archive/plans/2026-04-23-walkthrough-closeout-polish.md` — design-polish plans driven by reviews

## Working Principles

- One canonical location per concept; this hub points, it does not duplicate.
- Reviews cite the guidelines they evaluate against; guidelines do not cite reviews.
- Each review records its method (viewport, browser, build state) and is dated in the file name.
