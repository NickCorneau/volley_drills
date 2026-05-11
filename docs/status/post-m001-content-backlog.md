---
id: post-m001-content-backlog
title: Post-M001 Content Backlog
status: active
stage: trigger-gated
type: status
summary: "Trigger-gated content additions parked outside the M001 milestone doc body. Each entry names its trigger and authoritative source. Picked up when triggers fire; otherwise dormant."
authority: backlog of trigger-gated content adds (Tier 1b residual cap, externally gated drills, conditional Phase 2B capture shapes); cites authoritative triggers, does not redefine them
last_updated: 2026-05-10
depends_on:
  - docs/decisions.md
  - docs/plans/2026-04-20-m001-adversarial-memo.md
  - docs/plans/2026-04-20-m001-tier1-implementation.md
  - docs/plans/2026-05-10-005-feat-tier-1b-slot-expiry-contract-plan.md
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

The Tier 1b authoring cap is **10 new drill records**, anti-displacement enforced by `docs/plans/2026-04-20-m001-adversarial-memo.md`. Layer A consumed **4/10** (`d31`, `d33`, `d40`, `d42`). The remaining **6 slots** are reserved under the slot-expiry contract below.

> **Slot expiry contract (landed 2026-05-10).** Every unconsumed Tier 1b slot carries a hard expiry of **2026-07-20** (D130 founder-use window close). By that date, each slot must hold either (a) a logged `authored` record citing trigger evidence (D135 source-validity gated), or (b) a logged `killed` record citing absence of trigger evidence over the window. Reserved-slot drift becomes structurally indistinguishable from cap-discipline failure: "cap held 4/10 with 6 logged kill-or-author decisions" is a meaningful 2026-07-20 read; "cap held 4/10 with 6 silent reservations" is not. The contract is enforced by `cap_status_must_be_consistent` in `scripts/validate-agent-docs.sh`. This is the no-trigger half of the D135 discipline: absence of evidence must be cited and dated, not silent. See `docs/plans/2026-05-10-005-feat-tier-1b-slot-expiry-contract-plan.md` for the authoring rationale.

> **Cap-accounting note (2026-05-10).** The drills shipped under the focus-coverage readiness control plane (2026-04-30 — `d46`, `d47`, `d48` plus serving variants on `d31` / `d33`) and the source-backed content-depth activation pattern (2026-05-04 — `d49`, `d50`, `d51`) **do not consume Tier 1b cap slots**. The adversarial memo (lines 309 / 335 / 350 / 369 / 447) consistently re-affirms cap consumption at "still 4/10 from Tier 1b Layer A" through every post-2026-04-26 amendment, including the post-`d49`/`d50`/`d51` ships. Those drills shipped under separate diagnostic-driven and audit-driven lanes against FIVB-backed gap cards, not against the Tier 1b dogfood-evidence trigger this section governs. The 6 reserved slots below remain reserved.

### Reserved slot records

Each record carries a stable `slot_id`, an explicit `expiry`, a closed-vocabulary `status` (`reserved` | `authored` | `killed`), and the required trigger citation. The machine-readable mirror lives in the `cap-status-data` JSON block below; the slot records here are the human-readable narrative source. Both must stay in sync (the validator enforces shape; humans maintain prose-JSON parity during the weekly Monday ritual).

- **`t1b-pair-opening-block`** — Pair opening-block: `d30 Pair Pepper Progression` + `pair_long_warmup` archetype variant. When fired, the long warmup is a **new archetype variant** with its own layout, not dynamic compression of existing pair layouts.
  - Status: `reserved` | Expiry: 2026-07-20 | Last checked: 2026-05-10
  - Required trigger: partner-walkthrough returns the need as ≥P1 (per `docs/milestones/m001-solo-session-loop.md` Tier 1b paragraph).
  - Trigger source: `docs/milestones/m001-solo-session-loop.md`
- **`t1b-pair-role-swap-cue`** — Pair role-swap audio cue: surface that prompts pair partners to swap roles mid-drill.
  - Status: `reserved` | Expiry: 2026-07-20 | Last checked: 2026-05-10
  - Required trigger: partner-walkthrough ≥P1 finding (per `docs/plans/2026-04-20-m001-tier1-implementation.md` Tier 1b trigger list); OR founder logs ≥2 pair sessions with unclear role transitions (per `docs/plans/2026-04-20-m001-adversarial-memo.md` line 251).
  - Trigger source: `docs/plans/2026-04-20-m001-tier1-implementation.md`
- **`t1b-rep-counter`** — Framing C in-session running rep counter: visible per-drill rep count during Run, not just at `/run/check`.
  - Status: `reserved` | Expiry: 2026-07-20 | Last checked: 2026-05-10
  - Required trigger: ≥2 hits in founder-ledger or partner-walkthrough findings naming the missing surface. Current progress: **1 of ≥2 hits logged** (the 2026-04-27 cca2 dogfeed "not sold on counting passes because of memory/awareness" report; the 2026-05-04 and 2026-05-10 pair sessions did not produce a second independent flag — the 2026-05-10 session captured three drills as `still_learning` with zero Good/Total counts but the founder framed that as a copy-runnability problem, not a Run-surface counter problem, and routed it through `docs/ideation/2026-05-10-drill-first-time-runnability-ideation.md` instead).
  - Trigger source: `docs/plans/2026-04-20-m001-adversarial-memo.md` (line 289 trigger-status update; 2026-04-27 amendment)
- **`t1b-stretch-demo`** — Tap-to-expand per-stretch demo: collapsed warmup-stretch demonstrations expand on tap.
  - Status: `reserved` | Expiry: 2026-07-20 | Last checked: 2026-05-10
  - Required trigger: partner-walkthrough ≥P1 finding OR ≥2 founder content-gap reports under `D135`.
  - Trigger source: `docs/plans/2026-04-20-m001-adversarial-memo.md` (line 253 trigger list)
- **`t1b-unallocated-5`** — Unallocated reservation slack. No specific feature named; the slot is held against undiscovered Tier 1b triggers that may fire before 2026-07-20.
  - Status: `reserved` | Expiry: 2026-07-20 | Last checked: 2026-05-10
  - Required trigger: any qualifying partner-walkthrough ≥P1 finding OR founder content-gap report under `D135` that names a drill-record-shaped need not covered by the four named slots above.
  - Trigger source: `docs/decisions.md` D135 (source-validity gating)
- **`t1b-unallocated-6`** — Unallocated reservation slack. Same shape as `t1b-unallocated-5`; reserved for a second unnamed Tier 1b drill-record need that may surface before 2026-07-20.
  - Status: `reserved` | Expiry: 2026-07-20 | Last checked: 2026-05-10
  - Required trigger: any qualifying partner-walkthrough ≥P1 finding OR founder content-gap report under `D135` that names a drill-record-shaped need not covered by the four named slots above and is structurally distinct from `t1b-unallocated-5` if that slot also fires.
  - Trigger source: `docs/decisions.md` D135 (source-validity gating)

When a trigger fires, the slot's `status` transitions from `reserved` to `authored` (with cited trigger evidence), the cap consumption advances, and a fresh `feat:` plan in `docs/plans/` lands the work. If no trigger fires by 2026-07-20, the slot must transition to `killed` (with cited absence-of-evidence over the founder-use window).

### Cap status data (machine-readable)

<!-- cap-status-data:start -->
```json
{
  "cap_total": 10,
  "consumed": 4,
  "reserved": 6,
  "expiry_date": "2026-07-20",
  "last_validated": "2026-05-10",
  "tier_1a_authored": [
    { "slot_id": "t1a-d31", "drill_id": "d31", "tier": "1a", "status": "authored", "shipped_under": "Tier 1b Layer A pair-rep capture lane" },
    { "slot_id": "t1a-d33", "drill_id": "d33", "tier": "1a", "status": "authored", "shipped_under": "Tier 1b Layer A pair-rep capture lane" },
    { "slot_id": "t1a-d40", "drill_id": "d40", "tier": "1a", "status": "authored", "shipped_under": "Tier 1b Layer A pair-rep capture lane" },
    { "slot_id": "t1a-d42", "drill_id": "d42", "tier": "1a", "status": "authored", "shipped_under": "Tier 1b Layer A pair-rep capture lane" }
  ],
  "reserved_slots": [
    {
      "slot_id": "t1b-pair-opening-block",
      "tier": "1b",
      "status": "reserved",
      "expiry": "2026-07-20",
      "last_checked": "2026-05-10",
      "required_trigger": "partner-walkthrough ≥P1 finding for pair opening-block / pair_long_warmup archetype variant",
      "trigger_source": "docs/milestones/m001-solo-session-loop.md",
      "description": "Pair opening-block — d30 Pair Pepper Progression + pair_long_warmup archetype variant (new archetype variant with own layout, not dynamic compression)"
    },
    {
      "slot_id": "t1b-pair-role-swap-cue",
      "tier": "1b",
      "status": "reserved",
      "expiry": "2026-07-20",
      "last_checked": "2026-05-10",
      "required_trigger": "partner-walkthrough ≥P1 finding OR founder logs ≥2 pair sessions with unclear role transitions",
      "trigger_source": "docs/plans/2026-04-20-m001-tier1-implementation.md",
      "description": "Pair role-swap audio cue — surface that prompts pair partners to swap roles mid-drill"
    },
    {
      "slot_id": "t1b-rep-counter",
      "tier": "1b",
      "status": "reserved",
      "expiry": "2026-07-20",
      "last_checked": "2026-05-10",
      "required_trigger": "≥2 hits in founder-ledger or partner-walkthrough findings naming the missing in-session rep counter surface (currently 1 of ≥2 hits logged)",
      "trigger_source": "docs/plans/2026-04-20-m001-adversarial-memo.md",
      "description": "Framing C in-session running rep counter — visible per-drill rep count during Run, not just at /run/check"
    },
    {
      "slot_id": "t1b-stretch-demo",
      "tier": "1b",
      "status": "reserved",
      "expiry": "2026-07-20",
      "last_checked": "2026-05-10",
      "required_trigger": "partner-walkthrough ≥P1 finding OR ≥2 founder content-gap reports under D135",
      "trigger_source": "docs/plans/2026-04-20-m001-adversarial-memo.md",
      "description": "Tap-to-expand per-stretch demo — collapsed warmup-stretch demonstrations expand on tap"
    },
    {
      "slot_id": "t1b-unallocated-5",
      "tier": "1b",
      "status": "reserved",
      "expiry": "2026-07-20",
      "last_checked": "2026-05-10",
      "required_trigger": "any qualifying partner-walkthrough ≥P1 finding OR founder content-gap report under D135 naming a drill-record-shaped need not covered by the four named slots",
      "trigger_source": "docs/decisions.md",
      "description": "Unallocated reservation slack — held against undiscovered Tier 1b triggers"
    },
    {
      "slot_id": "t1b-unallocated-6",
      "tier": "1b",
      "status": "reserved",
      "expiry": "2026-07-20",
      "last_checked": "2026-05-10",
      "required_trigger": "any qualifying partner-walkthrough ≥P1 finding OR founder content-gap report under D135 naming a drill-record-shaped need not covered by the four named slots and structurally distinct from t1b-unallocated-5",
      "trigger_source": "docs/decisions.md",
      "description": "Unallocated reservation slack — second slot reserved for an unnamed Tier 1b drill-record need"
    }
  ]
}
```
<!-- cap-status-data:end -->

## Externally Gated Drills

Two drills are deferred from current Tier 1b Layer A pending external dependencies. Both were named in the 2026-04-26 §R7 exit-3 + 2026-04-27 red-team correction (per `docs/milestones/m001-solo-session-loop.md` Tier 1b paragraph).

- **`d36 Jump Float Introduction`** — re-enters under `O7` track 2 (sports-medicine / PT review), **not** via Tier 1b. Trigger: PT review returns with serve-related load guidance. Source: `docs/decisions.md` `O7`. Status (2026-05-10): waiting on `O7`.
- **`d43 Triangle Setting`** — re-enters under `D101` 3+ player schema support, **not** as a forced two-player adaptation. Trigger: `D101` lands and the participant model supports 3+. Source: `docs/decisions.md` `D101`. Status (2026-05-10): waiting on `D101`. The 2026-05-09 founder reflection flagged the 3+ player content gap as one structural reason non-Seb people who have been shown the app have not used it (memo line 462, trigger (c) "show ≠ use"). This is soft signal toward `D101` priority; not a `D101` unblock by itself.

These do **not** consume Tier 1b cap slots when they re-enter; they ship under their respective external-decision unblock.

## Conditional Phase 2B Capture Shapes

`D133` (2026-04-27) shipped per-drill Difficulty + Good/Total capture on `/run/check`. `D134` (2026-04-28) added optional streak capture as a bounded exception. Phase 2B extends per-drill capture to additional shapes — `points-to-target`, `pass-grade-avg`, `composite` — but is **frozen** until the 2026-05-12 `D134` Phase 2A falsification gate is read cleanly.

> **Imminent read-out (2026-05-10).** The 2026-05-12 `D134` Phase 2A read-out is **2 days away**. Current evidence-pending state (per `docs/status/m001-validation-overhang.md` `D134` section): the 2026-05-10 partner export included no streak drill and no `metricCapture`, so it does not move the gate; no founder/partner sessions over the 14-day window have produced ≥2 negative-evidence or ≥2 contamination hits. If 2026-05-12 reads cleanly (no falsification firing), Phase 2B becomes pickable per the items below. If either gate fires, every item below stays frozen until the standard founder-trigger conditions are met cleanly per `docs/plans/2026-04-27-per-drill-capture-coverage.md`.

- **`points-to-target` per-drill capture shape** — for drills with a target-rep success metric. Trigger: 2026-05-12 `D134` Phase 2A read-out passes (no negative-evidence and no contamination evidence per `docs/research/founder-use-ledger.md` Bounded D130 exceptions section). Status (2026-05-10): frozen pending 2026-05-12 read-out (2 days).
- **`pass-grade-avg` per-drill capture shape** — averaged pass-quality grade per drill. Same trigger and source as above. Status (2026-05-10): frozen pending 2026-05-12 read-out (2 days).
- **`composite` per-drill capture shape** — multi-axis per-drill capture (difficulty + grade + streak). Same trigger and source. Status (2026-05-10): frozen pending 2026-05-12 read-out (2 days).

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
