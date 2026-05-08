---
id: brainstorm-2026-05-08-002
title: "B1 — T9 scoring-overlay-grammar modeling stance"
status: complete
stage: validation
type: brainstorm
authority: "Picks the modeling stance for the captured BAB scoring-overlay grammar (T9) ahead of any future scoringRules schema work, so post-D101 / M002 implementation has a single agreed-upon shape and the catalog cannot accidentally lock into a contradictory one. Decision-pass packet only — no schema, runtime, catalog, or UI work is authorized by this brainstorm or the corresponding D142 row."
last_updated: 2026-05-08
depends_on:
  - docs/research/practice-plan-authoring-synthesis.md
  - docs/research/bab-source-material.md
  - docs/ideation/2026-05-04-bab-complete-plan-builder-ideation.md
  - docs/decisions.md
  - docs/plans/2026-05-08-002-feat-bucket-b-pre-d101-schema-decision-passes-plan.md
summary: >-
  T9 has resolved into a captured BAB scoring grammar of nine composable rule
  kinds plus an asymmetric-scoring axis, sharpened across Plans 17–20. Three
  modeling options are viable for how Volleycraft expresses scoring overlays:
  separate drill records per overlay (BAB's source pattern), sibling variants
  on a parent drill, or runtime constraint toggles. The stance recommended
  here is **sibling variants on a parent drill, with composable overlay
  metadata**, because it is the only option that supports rule-restriction
  and rule-augmentation symmetrically without consuming the authoring-budget
  cap on near-duplicate records or pushing constraint resolution into the
  hot courtside path. The implementation lands behind a future plan gated by
  D101 unlocks or a non-D101-gated source-priority drill (e.g., Around the
  World Serve) clearing the diagnostics activation pattern.
---

# B1 — T9 scoring-overlay-grammar modeling stance

## Summary

Pick a single modeling stance for T9's captured nine-kind composable scoring grammar plus asymmetric-scoring axis before any catalog row commits to one by accident. The recommended stance is **sibling variants on a parent drill, with composable overlay metadata**. Schema, runtime, catalog, and UI work are explicitly out of scope; the row exists to settle the architectural shape so a future implementation plan does not have to re-litigate it from prose memory.

---

## Problem Frame

The 2026-05-04 captured BAB drill book is structurally complete. T9 has been sharpened four times across Plans 17–20 from the original two-pattern sign-flip framing to **nine composable rule kinds** (rule-restriction, rule-augmentation, tiebreaker, side-switch, outcome-elevation, conditional-extension, conjunctive/wash, scoring-zone gate, reset-on-miss/streak-required) plus **asymmetric scoring as a tenth structural axis**. The Mini Games to 7 family across Plans 5/8/12/15/19 carries four restriction/augmentation variants and is the strongest source case for treating scoring overlays as parameter overlays on a parent drill rather than as separate records.

The synthesis itself flags the load-bearing risk: *"Mixing approaches will create diagnostic noise."* Today's catalog has no `scoringRules` field, no overlay grammar, and no asymmetric-scoring concept. That is the cleanest moment to pick a stance — once the first overlay drill is authored against an unstated stance, every subsequent overlay is implicitly required to match it, and switching costs scale with each new row.

The architecture-strategist named B1 as the **single most important Phase-0 sequencing call** for any future Tier 3+ pressure-game authoring. The product-lens critique paired this with the broader warning that BAB-grade schema work risks pulling the next two months toward content that cannot ship under `D130`. The reconciling move is: settle the stance now in a decision packet that explicitly refuses to authorize implementation, so the architectural shape exists without the schema work.

`O24` was a parallel risk on the focus-axis interpretation; `D141` resolved it by separating the M001 implementation constraint from a permanent product principle. B1 follows the same shape on the scoring-overlay axis.

---

## Actors

- A1. Future authoring agent picking up the first post-`D101` pressure-drill candidate (Mini Games to 7 family, 14-15 Games to 21, Comp Transition variants).
- A2. Future schema-authoring agent writing the `scoringRules` Dexie field and its TypeScript types.
- A3. Diagnostics agent maintaining `focusCoverageAudit` / `generatedPlanDiagnostics` / triage when a new overlay grammar enters the catalog.

These actors are decision-spine consumers, not user-facing actors. The brainstorm is a routing artifact for them, not a user-flow brainstorm.

---

## Key Flows

- F1. **Authoring a new overlay variant** (post-`D101` or Around-the-World-Serve-class wrapper)
  - **Trigger:** a future plan authorizes the first scoring-overlay drill against the resolved stance.
  - **Actors:** A1, A2
  - **Steps:** Future agent reads `D142`, opens the `scoringRules` schema and the parent-drill record, adds a sibling variant with composable overlay metadata.
  - **Outcome:** New variant lands without forcing a new top-level record per overlay; the parent drill's identity is preserved across all four Mini Games to 7 source variants.
  - **Covered by:** R1, R2

- F2. **Adding rule-augmentation to an existing rule-restricted variant**
  - **Trigger:** Plan 11 / Plan 15-style "rule-augmented variant" (e.g., `+3/-3 with Blocker` or `SHOTS ONLY with win by 2`) reaches authoring.
  - **Actors:** A1
  - **Steps:** Future agent adds composable overlay metadata to the existing sibling variant; restriction and augmentation overlays compose on the same record without the schema treating them as different mechanisms.
  - **Outcome:** Restriction and augmentation are symmetric per the synthesis's explicit constraint; the schema does not force one of the two patterns into duplicate records.
  - **Covered by:** R3

- F3. **Diagnostic classification of a new overlay variant**
  - **Trigger:** A new sibling variant enters the catalog and the next regenerated diagnostics report runs.
  - **Actors:** A3
  - **Steps:** Diagnostics treat the variant as a sibling under its parent drill; swap-pool and focus-coverage classification operate against the parent drill's identity; overlay metadata is descriptive, not selection-controlling, unless an explicit future plan adds a runtime overlay toggle.
  - **Outcome:** The catalog footprint stays parsimonious; diagnostic noise stays low.
  - **Covered by:** R4

---

## Requirements

**Stance**
- R1. Adopt **sibling variants on a parent drill, with composable overlay metadata** as the canonical modeling stance for the captured T9 scoring grammar.
- R2. The parent drill record carries the base scoring rule (e.g., `Mini Games to 7`); sibling variants carry the composable overlay metadata (e.g., `SHOTS ONLY`, `Round 1 and 2 ONLY`, `with Blocker -1`, `win by 2`).
- R3. Restriction and augmentation overlays must compose symmetrically: a single sibling variant may carry both a restriction and an augmentation overlay simultaneously without forcing duplicate records. The schema must not privilege one pattern over the other.
- R4. Overlay metadata is **descriptive at authoring time**, not a runtime constraint engine in M001 / first post-`D101` pass. Selection logic operates against parent-drill identity; overlay metadata informs courtside copy and diagnostic classification but does not (yet) drive runtime constraint composition.

**Authorization boundary**
- R5. No `scoringRules` schema, no Dexie field, no `successMetric` extension, no UI surface, and no diagnostic classifier change is authorized by `D142`. Implementation lands behind an explicit future plan with its own authorization.
- R6. The asymmetric-scoring axis (Plan 20 reset-on-miss / per-team rules) is **deferred indefinitely** at this stance — single source case in BAB, high architectural cost. A future revisit requires a second source case (FIVB Modified Games chapter, VDM, or a non-BAB capture) before the asymmetric axis enters the schema.

**Revisit triggers**
- R7. Re-open the stance if any of the following fires: (a) `D101` unlocks 3+ player support and the first post-`D101` pressure-drill candidate cannot be expressed cleanly as a sibling variant; (b) an Around-the-World-Serve-class non-`D101`-gated source-priority drill clears the diagnostics activation pipeline and forces an overlay schema decision; (c) a second source case for asymmetric scoring surfaces; (d) a future authoring pass discovers two real catalog rows where the sibling-variant stance forces measurable diagnostic-noise overhead.

**Decision trail**
- R8. `docs/decisions.md` gains a `D142` row that names the recommended stance, the rejected alternatives with warrant, the authorization boundary, and the revisit triggers.
- R9. `docs/research/practice-plan-authoring-synthesis.md` T9 section gains a one-line cross-reference pointing to `D142` and this brainstorm.
- R10. `docs/ideation/2026-05-04-bab-complete-plan-builder-ideation.md` Bucket B's B1 entry gains an inline "landed as `D142`" note with backlinks.

---

## Acceptance Examples

- AE1. **Covers R1, R2.** Given the captured Mini Games to 7 family across Plans 5/8/12/15/19, when a future authoring plan adds the parent drill plus its four overlay variants, the catalog records one parent drill identity and four sibling variants — not five separate top-level records.
- AE2. **Covers R3.** Given a future Plan 15-equivalent variant that combines `SHOTS ONLY` (restriction) with `win by 2` (augmentation), when the variant is authored, both overlays attach to a single sibling-variant record. The schema does not require a separate "restricted-then-augmented" record class.
- AE3. **Covers R3 (symmetry).** Given Plan 11's `+3/-3 with Blocker` rule-augmentation variant of `+3/-3 Highlines`, when the variant is authored, the augmentation overlay shape mirrors the restriction overlay shape — same metadata fields, same composition rules.
- AE4. **Covers R4.** Given a sibling-variant catalog row exists, when `pickForSlot` and `findSwapAlternatives` run on the parent drill, selection operates against parent-drill identity. Overlay metadata is read for courtside copy and diagnostic classification, not for additional runtime constraint resolution in the first post-`D101` pass.
- AE5. **Covers R5.** Given `D142` lands, when a future agent reads it, the row explicitly disallows authorizing schema work; the implementation requires its own future plan with its own authorization.
- AE6. **Covers R6.** Given the asymmetric-scoring axis from Plan 20, when a future authoring plan considers it, the deferral holds until a second source case surfaces.
- AE7. **Covers R7.** Given `D101` unlocks 3+ player support, when the first post-`D101` pressure-drill candidate is evaluated, the future plan re-opens `D142` if the candidate cannot be expressed cleanly as a sibling variant.
- AE8. **Covers R8, R9, R10.** Given a future agent reads T9 in the synthesis, the cross-reference points to `D142`. Given a future agent reads Bucket B in the ideation doc, the B1 entry shows the landing note.

---

## Success Criteria

- A future authoring agent picking up the first scoring-overlay drill knows the stance without re-reading the synthesis or the ideation pass.
- The first authored overlay variant lands as a sibling variant under a parent drill, not as a separate top-level record, even if the implementer never reads this brainstorm directly.
- `D142` is reachable from the synthesis, the ideation, the milestone routing, and the catalog within one cross-reference hop.
- The decision spine matches `D141`'s shape: stance + warrant + rejected alternatives + authorization boundary + revisit triggers.

---

## Scope Boundaries

- No `scoringRules` schema authoring. No Dexie field, no TypeScript type, no `successMetric` extension.
- No drill record changes. No catalog edits. No `m001Candidate` annotations.
- No selection-logic changes (`pickForSlot`, `findSwapAlternatives`, `effectiveSkillTags`, swap pool ranking).
- No diagnostic classifier change (`focusCoverageAudit`, `generatedPlanDiagnostics`, triage).
- No UI surface (RunScreen, DrillCheckScreen, CompleteScreen, Setup, Settings).
- No asymmetric-scoring schema work. Deferred indefinitely per R6.
- No B2 or B3 framing implications. Each Bucket B packet is independent.

---

## Key Decisions

- KD1. **Sibling variants on a parent drill** is the recommended stance because it is the only option of the three that supports rule-restriction and rule-augmentation symmetrically without consuming the authoring-budget cap on near-duplicates. The Mini Games to 7 family's four overlay variants would consume four catalog rows under "separate drill records" — that is the cost cliff the architecture-strategist named.
- KD2. **Separate drill records (BAB's source pattern)** is rejected. Clearest in catalogs and diagnostics, but consumes the authoring-budget cap for what are functionally near-duplicates and forces the diagnostic spine to discover sibling identity by name-matching after the fact.
- KD3. **Runtime constraint toggles** is rejected for the first post-`D101` pass. Smallest catalog footprint, but pushes constraint composition into the hot courtside path (swap pool, success-metric resolution, diagnostic classification) at the moment the calm-courtside / shibui posture under `D137` / `D141` is most fragile. A runtime toggle layer can re-enter under a later plan if a source case justifies it; landing it in the first pass over-builds for one current source pattern.
- KD4. **Restriction and augmentation must be symmetric** per the synthesis's explicit constraint. The schema may not privilege one pattern over the other; supporting only restriction would force authoring back into duplicate-record territory for augmentation. The stance lives or dies on this property.
- KD5. **Overlay metadata is descriptive, not constraint-engine driving**, in the first post-`D101` pass. Selection logic operates against parent-drill identity; metadata informs courtside copy and diagnostic classification. A constraint-composition runtime can re-enter behind a later plan when a forcing function exists.
- KD6. **Asymmetric scoring is deferred indefinitely** per the architecture-strategist's recommendation. One source case (Plan 20) is not a pattern. A second case (FIVB Modified Games, VDM, or a non-BAB capture) is required before the schema admits asymmetric scoring.
- KD7. **No implementation is authorized by `D142`.** The packet exists to settle the architectural shape so a future plan does not have to re-litigate it. The future implementation requires its own plan with its own authorization, gated by the revisit triggers in R7.

---

## Outstanding Questions

### Deferred to Implementation

- DQ1. Exact field names and shape of the overlay metadata (`overlayKind` enum vs free-form tags vs structured `restriction` / `augmentation` sub-records). Decided in the future schema-authoring plan against the source cases that exist at trigger time.
- DQ2. Whether a sibling-variant record carries a `parentDrillId` reference field or is discovered by shared `familyId` / metadata convention. Aligns with Bucket C's `familyId` axis when that lands; deferred until then.
- DQ3. Whether the diagnostic spine treats overlay variants as catalog-coverage participants in their own right, or only via the parent-drill identity. Decided when the first overlay variant enters `focusCoverageAudit`.
- DQ4. Exact courtside-copy treatment of overlay variant names (is `Mini Games to 7 (SHOTS ONLY)` a renamed variant, an annotation on the parent name, or two-line copy?). Decided in the future authoring plan against the calm-courtside guardrails.

### Deferred to Future Brainstorms

- A runtime constraint-composition layer (Bucket C-adjacent) if a source case justifies it.
- Asymmetric scoring schema, gated on a second source case.
- The Bucket C `compatibleFocuses` axis and drill-family abstraction interactions with the chosen overlay stance — these are independent C-track packets.

---

## Sources & References

- `docs/research/practice-plan-authoring-synthesis.md` — T9 nine-kind grammar plus asymmetric axis; Plan 17 / 18 / 19 / 20 sharpening history; Mini Games to 7 family across Plans 5/8/12/15/19; explicit "mixing approaches will create diagnostic noise" warning.
- `docs/research/bab-source-material.md` — BAB Plans 8 / 11 / 15 / 16 / 17 / 18 / 19 / 20 source captures.
- `docs/ideation/2026-05-04-bab-complete-plan-builder-ideation.md` — Bucket B B1 framing; architecture-strategist Phase-0 sequencing call; product-lens critique.
- `docs/decisions.md` — `D141` resolution shape (stance + authorization boundary + revisit triggers); `D140` proposal-packet pattern; `D101` 3+ player gate; `D137` calm-courtside posture.
- `docs/plans/2026-05-08-002-feat-bucket-b-pre-d101-schema-decision-passes-plan.md` — parent LFG plan.
- `app/src/data/archetypes.ts` — current M001 single-skill-chain invariant block (D141-cited); reference for the calm-courtside / shibui posture this brainstorm preserves.
