---
id: brainstorm-2026-05-08-004
title: "B3 — slot-4 (movement) optionality in archetype contracts"
status: complete
stage: validation
type: brainstorm
authority: "Decides whether slot 4 (movement) becomes optional in archetype contracts, given the captured BAB Game Play cluster's cluster-complete confirmation that all four Game Play plans skip slot 4. Decision-pass packet only — no archetype-layout change, BlockSlot.required flag flip, or new archetype record is authorized by this brainstorm or the corresponding D144 row."
last_updated: 2026-05-08
depends_on:
  - docs/research/practice-plan-authoring-synthesis.md
  - docs/research/bab-source-material.md
  - docs/ideation/2026-05-04-bab-complete-plan-builder-ideation.md
  - docs/decisions.md
  - docs/plans/2026-05-08-002-feat-bucket-b-pre-d101-schema-decision-passes-plan.md
  - app/src/data/archetypes.ts
summary: >-
  All four BAB Game Play plans (17–20) skip slot 4 (movement) — cluster-complete
  confirmation that the 6-slot focus-agnostic plan grammar treats slot 4 as
  conditionally optional in pure Game Play sessions. Volleycraft's current
  pair_net 25/40-min layouts always include movement_proxy, so the closest
  Volleycraft has to a "practice match" archetype actively contradicts the
  source-confirmed Game Play pattern. The recommended stance is **adopt a new
  pair_game archetype variant with a slot-4-skipped layout as the canonical
  shape, but defer the implementation** until partner-walkthrough evidence
  ≥P1 explicitly names match-play / tournament-prep as a missing surface OR
  a founder-use ledger row tagged tournament-prep records the gap OR D101
  unlocks 3+ player Game Play plans. The decision row settles the
  architectural shape (new archetype variant, not runtime layout compression
  of existing pair_net) so the future implementation plan does not have to
  re-litigate the variant-vs-runtime-skip choice.
---

# B3 — slot-4 (movement) optionality in archetype contracts

## Summary

Decide whether slot 4 (movement) becomes optional in archetype contracts. The recommended stance is **adopt a new `pair_game` archetype variant with a slot-4-skipped layout as the canonical shape**, with implementation deferred until trigger evidence fires. Schema, runtime, catalog, and UI work are explicitly out of scope; the row settles the architectural shape (variant, not runtime compression) so a future plan does not have to re-litigate it.

---

## Problem Frame

The captured BAB Game Play cluster (Plans 17–20) is structurally complete. The synthesis records:

> All four Game Play plans skip slot 4 (movement) — cluster-complete confirmation that the spine generalizes with slot 4 as conditionally optional.

And:

> Slots 5 and 6 are where decision-or-pressure drills and novel scoring overlays live. All four Game Play plans use slot 6 to introduce a novel scoring overlay: BIG point (Plan 17), wash (Plan 18), scoring-zone gate (Plan 19), reset-on-miss + asymmetric (Plan 20).

The Volleycraft archetype layouts in `app/src/data/archetypes.ts` always include `movementProxy` for the `pair_net` 25-min and 40-min layouts:

- 25-min: `[warmup, technique, movementProxy, mainSkill, wrap]`
- 40-min: `[warmup, technique, movementProxy, mainSkill, pressure, wrap]`

This is the closest Volleycraft archetype to a "practice match" / "tournament prep" Game Play session — the most natural home for a future BAB-Plan-17-style competitive Game Play layout — and it actively contradicts the BAB Game Play cluster's source-confirmed shape. The mismatch is real: a future Volleycraft tournament-prep session honestly cannot be built against the existing `pair_net` layouts without either (a) leaving the movement slot empty (which the current contract treats as the slot's "best fallback" rather than an authorial intent), or (b) ad-hoc skipping the slot at runtime, which the M001 Tier 1b pair-opening-block precedent already established as the wrong shape (runtime layout compression overflows session durations).

The architectural shape question is therefore: when the trigger evidence eventually fires, how should Volleycraft express a slot-4-skipped Game Play layout? Three options exist and they have different long-run consequences. Picking the shape now (without implementing it) lets the future trigger-fire authoring pass land cleanly without re-litigating it.

---

## Actors

- A1. Future authoring agent picking up the first slot-4-skipped layout candidate (a `pair_game` / tournament-prep / match-play session shape).
- A2. Future archetype-authoring agent maintaining `app/src/data/archetypes.ts` and `selectArchetype`.
- A3. Diagnostics agent maintaining `focusCoverageAudit` / `generatedPlanDiagnostics` / triage when a new archetype enters the catalog.
- A4. Founder + partner using the production build whose tournament-prep / match-play feedback fires the trigger.

---

## Key Flows

- F1. **First slot-4-skipped layout candidate enters authoring**
  - **Trigger:** partner-walkthrough ≥P1 explicitly naming match-play / tournament-prep as a missing surface, OR a founder-use ledger row tagged `tournament-prep` records the gap, OR `D101` unlocks 3+ player Game Play plans.
  - **Actors:** A1, A2, A4
  - **Steps:** Future agent reads `D144`, opens `app/src/data/archetypes.ts`, authors a new `pair_game` archetype with a slot-4-skipped layout (e.g., `[warmup, technique, mainSkill, pressure, wrap]` for the 25-min profile and `[warmup, technique, mainSkill, pressure, pressure, wrap]` or similar for the 40-min profile, decided at trigger time).
  - **Outcome:** A new archetype variant lands; `pair_net` 25/40 layouts are unchanged; selection routes a "tournament prep" / "match play" mode to `pair_game` rather than runtime-compressing `pair_net`.
  - **Covered by:** R1, R2, R3

- F2. **Diagnostic classification of the new archetype**
  - **Trigger:** `pair_game` enters the catalog and the next regenerated diagnostics report runs.
  - **Actors:** A3
  - **Steps:** Diagnostics treat `pair_game` as a peer of `pair_net` for catalog-coverage purposes; cell vocabulary, focus-coverage audit, and triage handle the new archetype the same way they handle existing peers; no special-casing of the slot-4-skip.
  - **Outcome:** Clean diagnostic reads; no false-positive layout-shape errors flagged against the new archetype because its layout is shorter than `pair_net`'s.
  - **Covered by:** R4

- F3. **Founder/partner triggers tournament-prep evidence before the implementation plan exists**
  - **Trigger:** A founder-use ledger row or a partner-walkthrough finding records "I wanted to do a match-play / tournament-prep session" before R5's implementation plan has been authored.
  - **Actors:** A4
  - **Steps:** The trigger fires per R6; the next available planning slot opens an implementation plan that consumes `D144` as the architectural-shape authority; that plan delivers `pair_game`.
  - **Outcome:** No re-litigation of variant-vs-runtime-skip; the implementation plan starts at "author the archetype against the shape `D144` already chose," not "first decide the shape."
  - **Covered by:** R5, R6

---

## Requirements

**Architectural shape**
- R1. Adopt **a new `pair_game` archetype variant with a slot-4-skipped layout** as the canonical shape for any future Volleycraft Game Play / match-play / tournament-prep session.
- R2. The `pair_game` archetype is a **peer** of the existing `pair_net` and `pair_open` archetypes, not a runtime variant of `pair_net`. Selection routes a future "tournament prep" / "match play" mode (or its equivalent context input) to `pair_game` directly.
- R3. The `pair_net` 25-min and 40-min layouts remain unchanged. Their `movementProxy` slot stays as `required: false` (current shape) but stays present in the layout; this row does not flip the slot's `required` flag, does not remove the slot from the layout, and does not introduce conditional slot-skip logic on existing archetypes.

**Forbidden moves**
- R4. **Do not runtime-compress existing `pair_net` layouts to skip slot 4** when a future tournament-prep mode is selected. The M001 Tier 1b pair-opening-block precedent established that runtime layout compression overflows session durations and is the wrong shape; apply the same precedent symmetrically to slot-4 skipping.
- R5. **Do not flip `movementProxy.required` or remove `movementProxy` from existing archetype layouts.** The current shape is correct for `solo_*` and `pair_*` (non-Game-Play) archetypes; the BAB cluster-complete evidence applies to Game Play sessions specifically, not to general practice sessions.
- R6. **Do not implement `pair_game` against this row.** The implementation requires its own future plan with its own authorization. Implementation is gated by trigger evidence per R8.

**Authorization boundary**
- R7. No `BlockSlot.required` flag flip, no `SessionArchetype` shape change, no new archetype record, no `selectArchetype` change, no `chain-attack`-style new chain, and no UI surface change is authorized by `D144`. Implementation lands behind an explicit future plan.

**Revisit / re-activation triggers**
- R8. Implement `pair_game` (under a future plan) when **any** of the following fires: (a) partner-walkthrough ≥P1 explicitly names match-play / tournament-prep / scrimmage as a missing surface; (b) a founder-use ledger row tagged `tournament-prep` (or equivalent) records the gap with a content-gap note; (c) `D101` unlocks 3+ player Game Play plans, making BAB Plans 17–20 catalog-eligible; (d) a Bucket A3 re-activation trigger fires that pulls scoring-overlay grammar (B1 / `D142`) work forward in a way that needs a Game Play archetype host.
- R9. Re-open the architectural shape (variant vs runtime skip vs status quo) if the first authored `pair_game` plan reveals the variant-vs-runtime-skip trade-off is more nuanced than the M001 Tier 1b pair-opening-block precedent supports — e.g., session-duration math under the new layout overflows the time budget the user selected.

**Decision trail**
- R10. `docs/decisions.md` gains a `D144` row that names the chosen architectural shape, the rejected alternatives with warrant, the authorization boundary, and the revisit / re-activation triggers.
- R11. `docs/research/practice-plan-authoring-synthesis.md` Captured Plan Grammar Templates row 4 (the cluster-complete row) gains a one-line cross-reference pointing to `D144` and this brainstorm.
- R12. `docs/ideation/2026-05-04-bab-complete-plan-builder-ideation.md` Bucket B's B3 entry gains an inline "landed as `D144`" note with backlinks.
- R13. `app/src/data/archetypes.ts` gains a comment-only citation of `D144` next to the existing `D141` invariant comment block, naming the future `pair_game` archetype variant as the architectural shape and citing the trigger evidence required to ship it. **No `BlockSlot`, `SessionArchetype`, layout, or `selectArchetype` change.**

---

## Acceptance Examples

- AE1. **Covers R1, R2.** Given a future plan implementing a tournament-prep / match-play session, when the plan reads `D144`, the plan authors a new `pair_game` archetype as a peer of `pair_net` rather than runtime-compressing `pair_net`.
- AE2. **Covers R3, R5.** Given the current `pair_net` 25-min / 40-min layouts in `app/src/data/archetypes.ts`, when this row lands, the layouts and the `movementProxy.required: false` flag are unchanged. No layout shape, slot, or required-flag mutation occurs.
- AE3. **Covers R4.** Given a future agent considering runtime layout compression of `pair_net` to skip slot 4 when a tournament-prep mode is selected, when the agent reads `D144`, the row explicitly forbids the move and points at the M001 Tier 1b pair-opening-block precedent.
- AE4. **Covers R6.** Given `D144` lands, when a future agent reads it, the row explicitly disallows authorizing the `pair_game` implementation in this row; the implementation requires its own future plan gated by R8.
- AE5. **Covers R7.** Given `D144` lands, when the immediate `archetypes.ts` edit (R13) is reviewed, the diff shows comment-only addition. No `BlockSlot`, layout, `required` flag, or `selectArchetype` change is present.
- AE6. **Covers R8.** Given partner-walkthrough evidence ≥P1 fires (or a founder-ledger tournament-prep row, or `D101` unlock), when the next planning slot opens, the implementation plan consumes `D144` as the architectural-shape authority and authors `pair_game`.
- AE7. **Covers R9.** Given the first authored `pair_game` plan reveals a session-duration overflow against the chosen layout, when the implementer reaches the issue, `D144` is re-opened (not silently overridden); the variant-vs-runtime-skip choice is re-evaluated against the new evidence.
- AE8. **Covers R10, R11, R12, R13.** Given a future agent reads the slot-4 cluster-complete row in the synthesis, the cross-reference points to `D144`. Given a future agent reads Bucket B in the ideation doc, the B3 entry shows the landing note. Given a future agent reads `app/src/data/archetypes.ts`, the invariant comment block names `D144` alongside `D141`.

---

## Success Criteria

- A future authoring agent picking up the first tournament-prep / match-play candidate knows the shape (new `pair_game` archetype variant, not runtime compression) without re-reading the synthesis or the M001 Tier 1b plan.
- The first authored `pair_game` archetype lands as a peer of `pair_net`, not as a runtime branch.
- `D144` is reachable from the synthesis, the ideation, the milestone routing, the catalog, and the in-code invariant comment block within one cross-reference hop.
- The decision spine matches `D141`'s shape: stance + warrant + rejected alternatives + authorization boundary + revisit triggers.
- The current shipped behavior is unchanged. `pair_net` 25/40 layouts still include `movementProxy`; `selectArchetype` still routes to `pair_net` for pair + net contexts; tests are not exercised because no behavior changed.

---

## Scope Boundaries

- No `pair_game` archetype authoring. No `SessionArchetype` shape change. No new archetype record.
- No `BlockSlot.required` flag flip. No `movementProxy` removal from any existing layout.
- No `selectArchetype` change. No new context input (e.g., `tournamentPrepMode`).
- No drill record changes. No catalog edits.
- No diagnostic classifier change.
- No UI surface (Setup, Run, DrillCheck, Review, Complete, Settings).
- No B1 or B2 framing implications. Each Bucket B packet is independent.
- No solo-archetype changes. The cluster-complete BAB evidence is Game Play-specific; solo archetypes are not in scope.
- The R13 `archetypes.ts` edit is **comment-only**. No code, layout, or function change is allowed.

---

## Key Decisions

- KD1. **A new `pair_game` archetype variant is the recommended shape**. The architectural honesty is real (the existing `pair_net` layouts contradict the BAB Game Play cluster-complete evidence), and the variant shape is the only option that does not pay the runtime-compression tax the M001 Tier 1b pair-opening-block precedent already established as the wrong shape.
- KD2. **Status quo (slot 4 stays required across all archetype layouts) is rejected**. It declares the BAB Game Play cluster-complete evidence is wrong without warrant. The right move is to record the architectural shape now and gate the implementation on trigger evidence; the wrong move is to pretend the evidence does not exist.
- KD3. **Runtime layout compression of existing `pair_net` to skip slot 4 is rejected**. The M001 Tier 1b pair-opening-block decision (`pair_long_warmup` archetype variant rather than runtime compression of pair layouts) established this precedent: runtime layout compression overflows session durations. The same constraint applies symmetrically to slot-4 skipping; one variant is right, runtime compression is wrong.
- KD4. **Implementation is deferred behind trigger evidence per R8**. The product-lens critique flagged that BAB-grade schema work (Bucket B → C drift) is the failure mode this brainstorm exists to defend against. Settling the architectural shape now without authorizing the implementation is the asymmetric-against-inertia move the ideation recommended.
- KD5. **The R13 `archetypes.ts` comment-only edit fires** because the recommended stance materially anticipates a future `pair_game` archetype variant that the existing `D141`-only invariant comment block does not contemplate. A citation-only edit (no code change) makes the architectural shape discoverable from the in-code invariant block, mirroring how the existing block already cites `D141` / `D105` / M001 Tier 1.
- KD6. **The trigger set is intentionally inclusive**. Any of (a)–(d) suffices, not all four. The product-lens critique warned against treating BAB synthesis as a build agenda; conversely, requiring all triggers to fire would risk under-firing when real evidence exists. The asymmetric stance is "settle the shape; gate implementation on any one trigger; refuse implementation without any trigger."
- KD7. **No implementation is authorized by `D144`**. The packet exists to settle the architectural shape so a future plan does not have to re-litigate it. The future implementation requires its own plan with its own authorization, gated by R8.

---

## Outstanding Questions

### Deferred to Implementation

- DQ1. Exact `pair_game` 25-min and 40-min layouts. The recommended starting point is `[warmup, technique, mainSkill, pressure, wrap]` for 25-min (drop `movementProxy`, keep the rest) and `[warmup, technique, mainSkill, pressure, pressure, wrap]` or `[warmup, technique, mainSkill, pressure, wrap]` for 40-min, but the actual durations and slot composition are decided at trigger-fire time against the BAB Plan 17–20 source captures and the available catalog rows.
- DQ2. Whether a shorter `pair_game` 15-min layout exists or whether `pair_game` only ships with 25-min / 40-min profiles. Decided at trigger-fire time against the founder-use / partner-walkthrough evidence that fired the trigger.
- DQ3. Whether `pair_game` requires a new context input (`tournamentPrepMode`, `gameMode`, etc.) or routes via existing context (e.g., a future Setup mode). Decided at trigger-fire time against `D137` / `D141`'s calm-courtside / single-skill-chain posture.
- DQ4. Whether `selectArchetype` routes to `pair_game` automatically when the new context input is set, or whether it requires explicit user selection. Decided at trigger-fire time.
- DQ5. Whether `pair_game`'s 40-min layout doubles up the pressure slot (mirroring BAB Game Play plans' "innovation slot" dual nature) or stays single-pressure. Decided at trigger-fire time.

### Deferred to Future Brainstorms

- A `solo_game` / `solo_match-prep` archetype variant — gated on a separate evidence pattern; no current trigger.
- A general "the slot grammar should expose a `required: 'always' | 'context-conditional' | 'never'` axis" refactor — Bucket C-adjacent; no current trigger.
- The interaction between B1's scoring-overlay-grammar stance and the `pair_game` archetype's pressure slot — decided at trigger-fire time when both `D142` and `D144` have implementation candidates in hand.

---

## Sources & References

- `docs/research/practice-plan-authoring-synthesis.md` — Captured Plan Grammar Templates row 4 (cluster-complete confirmation that all four BAB Game Play plans skip slot 4); slot 5 / 6 innovation-slot framing.
- `docs/research/bab-source-material.md` — BAB Plans 17 / 18 / 19 / 20 source captures.
- `docs/ideation/2026-05-04-bab-complete-plan-builder-ideation.md` — Bucket B B3 framing; product-lens critique of importing BAB-grade schema into M001.
- `docs/decisions.md` — `D141` resolution shape (stance + authorization boundary + revisit triggers); `D101` 3+ player gate; `D137` calm-courtside posture; `D105` warmup/cooldown contract.
- `docs/plans/2026-04-20-m001-tier1-implementation.md` — M001 Tier 1b pair-opening-block precedent (`pair_long_warmup` archetype variant rather than runtime layout compression).
- `docs/plans/2026-05-08-002-feat-bucket-b-pre-d101-schema-decision-passes-plan.md` — parent LFG plan.
- `app/src/data/archetypes.ts` — current `pair_net` 25/40-min layouts; M001 single-skill-chain invariant comment block (D141-cited); the file that receives the R13 comment-only citation of `D144`.
