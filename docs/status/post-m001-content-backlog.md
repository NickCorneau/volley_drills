---
id: post-m001-content-backlog
title: Post-M001 Content Backlog
status: active
stage: trigger-gated
type: status
summary: "Trigger-gated content additions parked outside the M001 milestone doc body. Each entry names its trigger and authoritative source. Picked up when triggers fire; otherwise dormant."
authority: backlog of trigger-gated content adds (Tier 1b residual cap, externally gated drills, conditional Phase 2B capture shapes); cites authoritative triggers, does not redefine them
last_updated: 2026-05-09
depends_on:
  - docs/decisions.md
  - docs/plans/2026-04-20-m001-adversarial-memo.md
  - docs/plans/2026-04-20-m001-tier1-implementation.md
  - docs/research/founder-use-ledger.md
  - docs/milestones/m001-solo-session-loop.md
decision_refs:
  - D91
  - D101
  - D130
  - D133
  - D134
  - D135
---

# Post-M001 Content Backlog

## Agent Quick Scan

- This doc enumerates **trigger-gated content adds** parked outside the M001 milestone-doc body: Tier 1b drill-cap residual, externally gated drills, and conditional Phase 2B capture shapes.
- Each entry names a **specific trigger** (decision ID, founder-ledger condition, partner-walkthrough finding, external review). Items are dormant until a trigger fires; nothing here is "someday" or "if needed."
- This is a **routing destination**, not an authority. The trigger source is always cited; this doc does not redefine triggers.
- Read this doc when: a trigger fires per the cited source AND you need to find which deferred item it unblocks; OR you're auditing whether an M001-shaped task has been parked.
- This doc is **separate** from `docs/status/m001-validation-overhang.md` — that doc owns the validation gates (calendar-dated and condition-based); this doc owns the trigger-gated content backlog.

## Purpose

Move the M001 milestone-doc body away from inline lists of "what could ship under what trigger" and into a single named backlog. The milestone doc keeps the Tier scope contract; this doc owns the per-item routing for trigger-gated adds.

## Use This File When

- a partner-walkthrough finding or founder-ledger row fires a Tier 1b trigger
- `O7` (sports-medicine / PT review) returns
- `D101` (3+ player schema) lands and unblocks 3-player content
- the 2026-05-12 `D134` Phase 2A read-out passes and Phase 2B becomes pickable

## Not For

- defining or revising triggers (those live in `docs/decisions.md` and `docs/plans/2026-04-20-m001-adversarial-memo.md`)
- listing M001 validation gates (those live in `docs/status/m001-validation-overhang.md`)
- new content ideas without a defined trigger condition (those belong in `docs/ideation/` or as new decisions)

## Update When

- a backlog item's trigger fires → open a fresh `feat:` plan, link it from the entry, leave the entry in place until the work ships
- a trigger source moves or is superseded → update the citation, do not restate the new definition here
- a backlog item ships → move the entry into `docs/status/current-state.md` Recent Shipped History and remove from this doc

## Tier 1b Drill-Cap Residual

The Tier 1b authoring cap is **10 new drill records**, anti-displacement enforced by `docs/plans/2026-04-20-m001-adversarial-memo.md`. Layer A consumed **4/10** (`d31`, `d33`, `d40`, `d42`). The remaining **6 slots** are reserved for the items below. Each requires a partner-walkthrough ≥P1 finding **or** the equivalent founder content-gap report under `D135`.

- **Pair opening-block** — `d30 Pair Pepper Progression` + `pair_long_warmup` archetype variant. Trigger: partner walkthrough returns the need as ≥P1 (per `docs/milestones/m001-solo-session-loop.md` Tier 1b paragraph). When fired, the long warmup is a **new archetype variant** with its own layout, not dynamic compression of existing pair layouts. Status (2026-05-09): not fired.
- **Pair role-swap audio cue** — surface that prompts pair partners to swap roles mid-drill. Trigger: partner-walkthrough ≥P1 finding (per `docs/plans/2026-04-20-m001-tier1-implementation.md` Tier 1b trigger list). Status (2026-05-09): not fired.
- **Framing C in-session running rep counter** — visible per-drill rep count during Run, not just at `/run/check`. Trigger: ≥2 hits in founder-ledger or partner-walkthrough findings naming the missing surface. Status (2026-05-09): 1 of ≥2 hits logged.
- **Tap-to-expand per-stretch demo** — collapsed warmup-stretch demonstrations expand on tap. Trigger: partner-walkthrough ≥P1 finding or ≥2 founder content-gap reports under `D135`. Status (2026-05-09): not fired.

When a trigger fires, the cap consumption advances and the new entry lands as a `feat:` plan with explicit Tier 1b sourcing.

## Externally Gated Drills

Two drills are deferred from current Tier 1b Layer A pending external dependencies. Both were named in the 2026-04-26 §R7 exit-3 + 2026-04-27 red-team correction (per `docs/milestones/m001-solo-session-loop.md` Tier 1b paragraph).

- **`d36 Jump Float Introduction`** — re-enters under `O7` track 2 (sports-medicine / PT review), **not** via Tier 1b. Trigger: PT review returns with serve-related load guidance. Source: `docs/decisions.md` `O7`. Status (2026-05-09): waiting on `O7`.
- **`d43 Triangle Setting`** — re-enters under `D101` 3+ player schema support, **not** as a forced two-player adaptation. Trigger: `D101` lands and the participant model supports 3+. Source: `docs/decisions.md` `D101`. Status (2026-05-09): waiting on `D101` (no current movement).

These do **not** consume Tier 1b cap slots when they re-enter; they ship under their respective external-decision unblock.

## Conditional Phase 2B Capture Shapes

`D133` (2026-04-27) shipped per-drill Difficulty + Good/Total capture on `/run/check`. `D134` (2026-04-28) added optional streak capture as a bounded exception. Phase 2B extends per-drill capture to additional shapes — `points-to-target`, `pass-grade-avg`, `composite` — but is **frozen** until the 2026-05-12 `D134` Phase 2A falsification gate is read cleanly.

- **`points-to-target` per-drill capture shape** — for drills with a target-rep success metric. Trigger: 2026-05-12 `D134` Phase 2A read-out passes (no negative-evidence and no contamination evidence per `docs/research/founder-use-ledger.md` Bounded D130 exceptions section). Status (2026-05-09): frozen pending 2026-05-12 read-out.
- **`pass-grade-avg` per-drill capture shape** — averaged pass-quality grade per drill. Same trigger and source as above. Status (2026-05-09): frozen.
- **`composite` per-drill capture shape** — multi-axis per-drill capture (difficulty + grade + streak). Same trigger and source. Status (2026-05-09): frozen.

If the 2026-05-12 read-out fires either falsification gate (negative-evidence or contamination), Phase 2B is paused and the items above remain frozen until the standard founder-trigger conditions are met cleanly per `docs/plans/2026-04-27-per-drill-capture-coverage.md`.

## How To Pick Items Up

1. A trigger fires per the cited source (founder-ledger row, partner-walkthrough P1 finding, external decision unblock, or calendar read-out passing).
2. Open a fresh `feat:` plan in `docs/plans/` referencing the backlog entry by name, the trigger source, and the citation.
3. The plan owns the implementation; this backlog entry stays in place until the plan ships.
4. When the work ships, move the entry into `docs/status/current-state.md` Recent Shipped History and remove it here.

This backlog is a **routing destination**, not an authority on what should ship — the trigger sources are. If you find yourself wanting to expand or re-scope an entry without a fresh trigger firing, route the discussion back to the source decision in `docs/decisions.md` first.

## Sources & References

- `docs/decisions.md` — `D91`, `D101`, `D130`, `D133`, `D134`, `D135`, `O7`
- `docs/plans/2026-04-20-m001-adversarial-memo.md` — Tier 1b cap, trigger ritual
- `docs/plans/2026-04-20-m001-tier1-implementation.md` — Tier 1b trigger list (full clause-by-clause)
- `docs/research/founder-use-ledger.md` — D134 falsification gate definition (Bounded D130 exceptions section)
- `docs/milestones/m001-solo-session-loop.md` — Tier 1b paragraph and current routing
- `docs/status/m001-validation-overhang.md` — separate scoreboard for time/condition-based validation gates (not content adds)
