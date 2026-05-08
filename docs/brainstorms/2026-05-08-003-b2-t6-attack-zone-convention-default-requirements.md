---
id: brainstorm-2026-05-08-003
title: "B2 — T6 attack-zone-convention default"
status: complete
stage: validation
type: brainstorm
authority: "Picks the default attack-zone convention Volleycraft adopts for any future attack-chain authoring, so the chain is not silently locked to whatever convention the first added drill happens to use. Decision-pass packet only — no schema, runtime, catalog, or UI work is authorized by this brainstorm or the corresponding D143 row."
last_updated: 2026-05-08
depends_on:
  - docs/research/practice-plan-authoring-synthesis.md
  - docs/research/bab-source-material.md
  - docs/research/fivb-source-material.md
  - docs/ideation/2026-05-04-bab-complete-plan-builder-ideation.md
  - docs/decisions.md
  - docs/plans/2026-05-08-002-feat-bucket-b-pre-d101-schema-decision-passes-plan.md
summary: >-
  T6 surfaces four candidate attack-zone conventions across BAB and FIVB
  sources: BAB 7-zone (Plans 1, 4, 8, 20), FIVB 5-zone (Drill 5.6),
  BAB attack-accuracy boxes (Plan 7), and a hypothetical product-reduced grid.
  The synthesis explicitly flags that BAB-internal repetition count should not
  be treated as institutional vote-weighting against FIVB. The recommended
  stance is **adopt FIVB 5-zone as the primary default for chain-wide
  numbered-zone attack drills, with BAB attack-accuracy boxes (Plan 7) reserved
  as the per-shot-accuracy-drill variant when the source-form is per-shot
  rather than across-the-grid**. Source-authority and cognitive-load /
  measurability / calm-courtside trade-offs together favor 5-zone over 7-zone
  for Volleycraft's amateur self-coached audience without abandoning the
  per-shot-accuracy pattern that Plan 7 establishes. Implementation is
  deferred to a future plan gated by D101 unlocks plus the first attack-chain
  authoring candidate.
---

# B2 — T6 attack-zone-convention default

## Summary

Pick a single default attack-zone convention before the first attack-chain catalog row is authored. The recommended default is **FIVB 5-zone for chain-wide numbered-zone attack drills, with BAB attack-accuracy boxes (Plan 7) reserved for per-shot-accuracy drills**. Schema, runtime, catalog, and UI work are explicitly out of scope; the row exists to settle the convention so a future implementation plan does not have to re-litigate it.

---

## Problem Frame

The captured BAB drill book uses **three** attack-zone conventions: BAB 7-zone (Plans 1, 4, 8, 20), BAB attack-accuracy boxes (Plan 7's 4×4 marked rectangle for one shot at a time, or two boxes per attacker for HL/CS alternation), and BAB serving-only 4/6/8-zone scaling by level (Plan 2). FIVB Drill 5.6 uses a **5-zone** attack grid. The synthesis explicitly notes:

> The 7-zone version now has the strongest source-authority weight in the captured set (three verbatim appearances across BAB Plans 1, 4, and 8); that does not automatically settle the convention question, but it is the working default until a decision pass picks one.

And the synthesis flags the load-bearing competing reading:

> The "BAB 7-zone has the strongest source-authority" framing relies on counting BAB internal repetitions as votes, which weights one author's pedagogical preference inappropriately against FIVB's institutional authority.

The convention question is therefore a Volleycraft decision driven by cognitive-load / measurability / source-authority trade-offs, not by repetition count. Today's catalog has no attack chain, no `chain-attack` constant, no zone enum, and no `attackZone` drill field. That is the cleanest moment to pick the convention — once the first attack drill ships against an unstated convention, every subsequent attack drill in the same chain is implicitly required to match it, and switching costs scale with each new row.

The synthesis explicitly forbids two failure modes: **do not reuse the serving zone grid for attack** (BAB serving uses 4/6/8-zone level-scaling, not the same as attack), and **do not silently collapse the BAB and FIVB attack grids** (they are not interchangeable). It also warns that an Around-the-World ladder (numbered zones) and a per-shot accuracy box (Plan 7-style) are not the same drill family — they ask the attacker to do structurally different things and need different success metrics.

---

## Actors

- A1. Future authoring agent picking up the first post-`D101` attack-chain candidate.
- A2. Future schema-authoring agent writing the `attackZone` drill field and its TypeScript type.
- A3. Diagnostics agent maintaining `focusCoverageAudit` / `generatedPlanDiagnostics` / triage when the attack chain enters the catalog.
- A4. Future content reviewer evaluating courtside zone-callout copy on `RunScreen` / `DrillCheckScreen`.

---

## Key Flows

- F1. **Authoring the first chain-wide numbered-zone attack drill** (post-`D101`)
  - **Trigger:** a future plan authorizes the first attack-chain candidate (most likely a Plan 1 / 4 / 8 / 20 family member like Around the World — Attack).
  - **Actors:** A1, A2, A4
  - **Steps:** Future agent reads `D143`, opens the new attack chain constant and drill record, authors the drill against the FIVB 5-zone convention.
  - **Outcome:** The chain is anchored to a single numbered-zone convention from the first row; future rows in the same chain inherit it without re-litigation.
  - **Covered by:** R1, R2

- F2. **Authoring a per-shot-accuracy attack drill** (post-`D101`)
  - **Trigger:** a Plan 7-style per-shot drill (e.g., `+3/-3 Highlines - Cut Shots / HL`, `Offensive Accuracy - HL/CS`) reaches authoring.
  - **Actors:** A1, A4
  - **Steps:** Future agent recognizes the per-shot-accuracy pattern as distinct from numbered-zone ladders; authors against the BAB attack-accuracy box convention rather than coercing it onto the 5-zone grid.
  - **Outcome:** Per-shot-accuracy drills carry their own marked-target pattern; the success metric matches the source-form (one-shot accuracy, not across-the-grid sequence).
  - **Covered by:** R3

- F3. **Diagnostic classification of an attack-chain drill**
  - **Trigger:** A new attack-chain drill enters the catalog and the next regenerated diagnostics report runs.
  - **Actors:** A3
  - **Steps:** Diagnostics treat numbered-zone drills as one chain-coverage class, accuracy-box drills as a second class; cross-zone-convention swaps inside the same chain are flagged as catalog-shape errors.
  - **Outcome:** No silent zone-convention drift inside one chain; clean diagnostic reads.
  - **Covered by:** R4

---

## Requirements

**Default convention**
- R1. Adopt **FIVB 5-zone** as the canonical default for chain-wide numbered-zone attack drills.
- R2. The first authored attack-chain drill anchors the chain to the 5-zone convention; subsequent drills in the same chain inherit it. Mixing 5-zone and 7-zone inside one chain is forbidden.

**Per-shot variant**
- R3. Reserve **BAB attack-accuracy boxes (Plan 7-style)** as the canonical convention for per-shot-accuracy attack drills. The schema must distinguish the two patterns; `Around the World — Attack` (numbered-zone ladder) and `+3/-3 Highlines` (per-shot accuracy box) are not interchangeable.

**Forbidden moves**
- R4. **Do not reuse the BAB serving 4/6/8-zone grid for attack drills.** The synthesis explicitly forbids this; serving and attack grids are not portable.
- R5. **Do not silently collapse 5-zone and 7-zone variants.** A future drill captured against a 7-zone source must be re-mapped to 5-zone before authoring, with the re-mapping documented in the drill's source provenance comment.
- R6. **Do not author a product-specific reduced grid (e.g., 3-zone or 4-zone) ahead of FIVB 5-zone.** The 5-zone convention is the institutional authority; a custom reduction would discard source-authority for marginal cognitive-load savings against FIVB's already-coarser-than-BAB grid.

**Authorization boundary**
- R7. No `attackZone` schema, no Dexie field, no zone enum, no `chain-attack` constant, no UI surface, and no diagnostic classifier change is authorized by `D143`. Implementation lands behind an explicit future plan with its own authorization.

**Revisit triggers**
- R8. Re-open the convention if any of the following fires: (a) `D101` unlocks 3+ player support and the first post-`D101` attack-chain candidate cannot be expressed cleanly against the 5-zone grid; (b) a future product-research pass surfaces founder-use or partner-walkthrough evidence the chosen grid is illegible courtside; (c) a second institutional source (VDM/LTD3, USA Volleyball, FIVB Coaches Manual revision) standardizes on a different grid; (d) the first attack-chain authoring pass reveals the per-shot-accuracy / numbered-zone split is more nuanced than the two-pattern framing supports.

**Decision trail**
- R9. `docs/decisions.md` gains a `D143` row that names the chosen default, the rejected alternatives with warrant, the authorization boundary, and the revisit triggers.
- R10. `docs/research/practice-plan-authoring-synthesis.md` T6 section gains a one-line cross-reference pointing to `D143` and this brainstorm.
- R11. `docs/ideation/2026-05-04-bab-complete-plan-builder-ideation.md` Bucket B's B2 entry gains an inline "landed as `D143`" note with backlinks.

---

## Acceptance Examples

- AE1. **Covers R1, R2.** Given a future plan authoring the first chain-wide numbered-zone attack drill (an Around-the-World-Attack-class candidate), when the drill is authored, the drill record's zone metadata refers to a 5-zone convention. A subsequent drill in the same chain inherits the 5-zone convention without further decision.
- AE2. **Covers R3.** Given a future plan authoring a Plan 7-style per-shot-accuracy attack drill, when the drill is authored, the drill record uses BAB attack-accuracy box metadata, not 5-zone numbered metadata. The success metric matches the per-shot pattern, not the across-the-grid pattern.
- AE3. **Covers R4.** Given a future agent considering reusing the existing serving 4/6/8-zone grid for an attack drill, when the agent reads `D143`, the row explicitly forbids the reuse and points at the synthesis's portability constraint.
- AE4. **Covers R5.** Given a captured BAB Plan 8-style 7-zone source case, when the future drill is authored, the drill is re-mapped to 5-zone with the re-mapping recorded in a source-provenance comment.
- AE5. **Covers R6.** Given a future agent considering a custom 3-zone or 4-zone product-reduction, when the agent reads `D143`, the row explicitly defers custom reductions until after FIVB 5-zone has shipped and accumulated courtside legibility evidence.
- AE6. **Covers R7.** Given `D143` lands, when a future agent reads it, the row explicitly disallows authorizing schema work; the implementation requires its own future plan with its own authorization.
- AE7. **Covers R8.** Given the first post-`D101` attack-chain authoring pass, when the candidate cannot be expressed cleanly against the 5-zone grid, the future plan re-opens `D143`.
- AE8. **Covers R9, R10, R11.** Given a future agent reads T6 in the synthesis, the cross-reference points to `D143`. Given a future agent reads Bucket B in the ideation doc, the B2 entry shows the landing note.

---

## Success Criteria

- A future authoring agent picking up the first attack-chain drill knows the convention without re-reading the synthesis or the ideation pass.
- The first authored attack drill lands against the 5-zone grid (or the per-shot-accuracy box variant when the source-form is per-shot).
- `D143` is reachable from the synthesis, the ideation, the milestone routing, and the catalog within one cross-reference hop.
- The decision spine matches `D141`'s shape: stance + warrant + rejected alternatives + authorization boundary + revisit triggers.

---

## Scope Boundaries

- No `attackZone` schema authoring. No Dexie field, no TypeScript enum, no `chain-attack` constant.
- No drill record changes. No catalog edits. No `m001Candidate` annotations.
- No selection-logic changes (`pickForSlot`, `findSwapAlternatives`, `effectiveSkillTags`).
- No diagnostic classifier change.
- No UI surface.
- No B1 or B3 framing implications. Each Bucket B packet is independent.
- No serving-zone convention change. The captured BAB serving 4/6/8-zone level-scaling is unaffected by this row.

---

## Key Decisions

- KD1. **FIVB 5-zone is the recommended default** because (a) it is institutional authority rather than a single coaching book's preference, (b) the courtside cognitive load of five zones is materially lower than seven for amateur self-coached players under `P11`'s recommend-before-interrogate posture, and (c) the synthesis explicitly notes that BAB-internal repetition count should not be treated as institutional vote-weighting.
- KD2. **BAB 7-zone is rejected as the chain-wide default**. The strongest argument for it (three BAB plan appearances) is the synthesis-flagged failure mode — counting one author's pedagogical preference as votes. Source-authority is a real factor, but FIVB's institutional authority outweighs BAB's internal repetition for an amateur audience.
- KD3. **BAB attack-accuracy boxes (Plan 7) are the per-shot-accuracy convention**, not a chain-wide alternative. The synthesis explicitly notes that per-shot accuracy boxes and numbered-zone ladders are not interchangeable. Coercing Plan 7's `+3/-3 Highlines - Cut Shots / HL` onto the 5-zone grid would lose the per-shot-accuracy pattern's defining feature (one shot, fixed accuracy target).
- KD4. **A product-reduced grid (3-zone, 4-zone) is rejected for the first pass**. FIVB 5-zone is already coarser than BAB 7-zone; a further reduction discards institutional source-authority for marginal courtside-load savings. A custom reduction can re-enter under R8 if the 5-zone grid proves illegible courtside in real use.
- KD5. **Mixing conventions inside one chain is forbidden** per R2 and R5. The synthesis warns that a future agent who silently mixes 5-zone and 7-zone inside `chain-attack` will create diagnostic noise the catalog cannot recover from cleanly.
- KD6. **Source-form provenance must be preserved when re-mapping 7-zone → 5-zone**. R5's drill source-provenance comment requirement keeps the original BAB capture readable next to the Volleycraft-adopted form, so a future revisit can audit the re-mapping.
- KD7. **No implementation is authorized by `D143`**. The packet exists to settle the convention so a future plan does not have to re-litigate it. The future implementation requires its own plan with its own authorization, gated by R8.

---

## Outstanding Questions

### Deferred to Implementation

- DQ1. Exact 5-zone grid layout (which zones map to which court coordinates) — chosen in the future implementation plan against the FIVB Drill 5.6 capture and any beach-volleyball-specific FIVB / VDM / USAV updates available at trigger time.
- DQ2. Exact courtside-copy treatment of zone callouts (numbered, cardinal, BAB-style descriptive) — chosen in the future implementation plan against the calm-courtside guardrails.
- DQ3. Exact source-provenance comment shape for re-mapped 7-zone → 5-zone drills — likely follows the existing `// Source: BAB Plan N Drill M (re-mapped from 7-zone to 5-zone per D143)` comment pattern, but the form is decided at first-authoring time.
- DQ4. Whether the per-shot-accuracy box variant gets its own drill record or sits as a sibling under a parent attack drill — interacts with B1's sibling-variant stance; decided in the future implementation plan once B1 and the actual catalog candidates are both in hand.

### Deferred to Future Brainstorms

- A custom product-reduced grid, gated on R8 evidence the 5-zone grid is illegible courtside.
- Per-zone success-metric calibration (Bayesian-posterior thresholds per zone, mirroring `D104`) — separate decision packet, gated on accumulated attack-chain catalog rows.
- Attack-chain progression links between numbered-zone ladders and per-shot-accuracy box drills — separate decision packet at first attack-chain authoring time.

---

## Sources & References

- `docs/research/practice-plan-authoring-synthesis.md` — T6 zone-conventions thesis; the explicit competing-reading on BAB-internal repetition count; the explicit forbidden moves (do not reuse serving grid; do not silently collapse 5-zone and 7-zone; do not treat per-shot accuracy boxes as numbered-zone ladders).
- `docs/research/bab-source-material.md` — BAB Plan 1 / 4 / 7 / 8 / 20 source captures.
- `docs/research/fivb-source-material.md` — FIVB Drill 5.6 5-zone attack capture.
- `docs/ideation/2026-05-04-bab-complete-plan-builder-ideation.md` — Bucket B B2 framing; architecture-strategist Phase-0 sequencing call; product-lens critique.
- `docs/decisions.md` — `D141` resolution shape (stance + authorization boundary + revisit triggers); `D101` 3+ player gate; `D137` calm-courtside posture; `D104` Bayesian success-metric threshold pattern (precedent for per-zone calibration).
- `docs/plans/2026-05-08-002-feat-bucket-b-pre-d101-schema-decision-passes-plan.md` — parent LFG plan.
