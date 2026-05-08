---
title: "feat: Bucket B Pre-D101 Schema Decision Passes (B1 T9, B2 T6, B3 slot-4)"
type: feat
status: complete
date: 2026-05-08
---

# feat: Bucket B Pre-D101 Schema Decision Passes (B1 T9, B2 T6, B3 slot-4)

## Summary

Land the three "Bucket B" decision-pass packets named in the 2026-05-04 BAB-complete plan-builder ideation as the next agent-actionable M001 follow-ups after `D141` resolved `O24`. Each packet is a brainstorm/decision artifact only — no runtime, schema, catalog, or UI changes — that picks a stance for a future schema gate so post-`D101` operational work has a clean starting line. **B1** picks a T9 scoring-overlay-grammar modeling stance (separate records vs sibling variants vs runtime overlays). **B2** picks a T6 attack-zone-convention default (BAB 7-zone vs FIVB 5-zone vs attack-accuracy boxes vs product-reduced grid). **B3** decides whether slot 4 (movement) becomes optional in archetype contracts.

---

## Problem Frame

The 2026-05-04 BAB ideation pass (`docs/ideation/2026-05-04-bab-complete-plan-builder-ideation.md`) split survivors into three buckets. Bucket A landed across the 2026-05-07 → 2026-05-08 cleanup batch and `D141`. Bucket B remains: three pre-`D101` schema gates that are **decisions, not implementations**. The architecture-strategist explicitly named B1 as a Phase-0 sequencing call, and the synthesis warns that "mixing approaches will create diagnostic noise" — i.e., resolving the stance before authoring the first relevant catalog row prevents architectural lock-in retrofits.

The current M001 milestone routing (`docs/milestones/m001-solo-session-loop.md`) explicitly lists "Bucket B decision passes for T9, T6, and slot-4 optionality" as an agent-actionable separate follow-up that is **not required to close M001 itself** but does unblock future operational work when `D101` / `M002` triggers fire. The user's 1-session-each framing matches the ideation's "B1 + B2 + B3 as decision-pass brainstorms (~1 day total)" recommendation.

The risk this plan defends against is the same one that motivated the recent `D141` resolution of `O24`: leaving open questions in a state where downstream code work could silently *infer* an answer the decision spine never explicitly endorsed. Each Bucket B packet records the stance, its rejected alternatives, the authorization boundary, and the revisit triggers so a future schema authoring pass cannot quietly drift into a different model.

---

## Assumptions

*This plan was authored in non-interactive LFG mode. The items below are agent inferences that fill gaps in the input and should be scrutinized by review before implementation proceeds.*

- Each Bucket B item lands as its own brainstorm file and its own `D` row. The ideation explicitly held this open ("Should the ideation doc's Bucket B decision packets land as separate brainstorms in `docs/brainstorms/`, or stay consolidated here until one becomes urgent?"); we choose separate per the existing convention (one brainstorm per decision per `docs/brainstorms/2026-05-06-001-d137-tune-today-routing-resolution-requirements.md`-style precedent) and per the user's "~1 session each" framing.
- The decisions resolve with a recommended stance plus an explicit authorization boundary that defers any catalog / schema / runtime work to a future `D101` or `M002` plan (mirroring `D140` and `D141`'s posture). The packets do **not** authorize any code change.
- The next available `D` IDs are `D142` (B1), `D143` (B2), `D144` (B3), assigned in plan-named order. If a different ID is taken first, the implementer reassigns sequentially without renumbering what already exists.
- `app/src/data/archetypes.ts` may receive a comment-only addition in U3 to cite the new B3 decision row alongside the existing `D141` invariant comment. No layout change is authorized — the actual `pair_game` archetype variant or slot-4-skip rule waits for a future plan.
- Selection bias is avoided by recording the recommended stance plus the rejected alternatives explicitly. A future implementer needs the rejected-alternative warrant to keep `D49`-style autopilot regressions from re-litigating the call from prose memory.

---

## Requirements

- R1. Author a Bucket B brainstorm packet for **B1 — T9 scoring-overlay-grammar modeling stance** at `docs/brainstorms/2026-05-08-002-b1-t9-scoring-overlay-modeling-stance-requirements.md` covering problem frame, three modeling options (separate records vs sibling variants vs runtime overlays), evidence, recommended stance with rejected-alternative warrant, authorization boundary, and revisit triggers.
- R2. Author a Bucket B brainstorm packet for **B2 — T6 attack-zone-convention default** at `docs/brainstorms/2026-05-08-003-b2-t6-attack-zone-convention-default-requirements.md` covering the four candidate conventions (BAB 7-zone, FIVB 5-zone, BAB attack-accuracy boxes, product-reduced grid), source-authority weight vs cognitive-load trade-off, recommended default with rejected-alternative warrant, authorization boundary, and revisit triggers.
- R3. Author a Bucket B brainstorm packet for **B3 — slot 4 (movement) optionality in archetype contracts** at `docs/brainstorms/2026-05-08-004-b3-slot-4-movement-optionality-requirements.md` covering the cluster-complete BAB Game Play evidence (all four Game Play plans skip slot 4), the current `pair_net` 25/40-min layouts that always include `movement_proxy`, the three archetype-shape options (status quo / conditional slot-skip / new `pair_game` archetype variant), recommended stance with rejected-alternative warrant, authorization boundary, and revisit triggers.
- R4. Add three new rows to `docs/decisions.md` Decided table: `D142` (B1), `D143` (B2), `D144` (B3). Each row cites its brainstorm packet, this plan, the relevant ideation bucket, and the relevant synthesis thesis (T9 / T6 / cluster-complete confirmation), and reaffirms the authorization boundary that no runtime / schema / catalog / UI work is authorized by the row.
- R5. Make the authorization boundary explicit in every brainstorm and decision row: no `scoringRules` schema, no `compatibleFocuses` axis, no zone enum, no archetype-layout change, no Dexie migration, and no UI surface change is authorized. Implementation lands behind explicit future plans gated by `D101` unlocks, `M002` plan-grammar input, or a non-`D101`-gated source-priority drill clearing the existing diagnostics activation pattern.
- R6. Record revisit triggers symmetric across the three packets so a future agent has a single place to look when triggers fire. Each packet's trigger set includes the relevant `D101` / `M002` clause and any packet-specific clause (e.g., for B3, "the first `pair_game`-tournament-prep candidate enters the catalog or the partner-walkthrough returns slot-4-bloat as ≥P1").
- R7. Update the BAB ideation doc (`docs/ideation/2026-05-04-bab-complete-plan-builder-ideation.md`) to mark Bucket B items as **landed as decision packets** with backlinks to the new brainstorm files and decision rows. Do not delete or mutate the original ideation rationale; only add the landing note in line with the existing Bucket A landing pattern.
- R8. Update the practice-plan synthesis doc (`docs/research/practice-plan-authoring-synthesis.md`) to cross-reference the new decision rows from the T9 and T6 thesis sections so a future agent reading the synthesis sees the Volleycraft stance has been made (without needing to grep).
- R9. Update routing surfaces: register the new plan + three brainstorms in `docs/catalog.json`; add a brief shipped-history line to `docs/status/current-state.md`; update `docs/milestones/m001-solo-session-loop.md` "what remains" section so the Bucket B item moves from "agent-actionable separate follow-up" to "landed as `D142` / `D143` / `D144`".
- R10. If U3's slot-4 brainstorm recommends a stance that currently contradicts the in-code `app/src/data/archetypes.ts` invariant comments, add a comment-only citation of the new decision row next to the existing `D141` invariant comment block. Do **not** modify any `BlockSlot` or `SessionArchetype` shape, layout, or `required` flag.
- R11. Verify documentation contracts after the updates: `bash scripts/validate-agent-docs.sh` passes; `docs/catalog.json` remains parseable; the three brainstorms and three decision rows cross-reference cleanly with no broken `D` / `T` / `O` IDs.

---

## Scope Boundaries

- Do not edit any app runtime behavior, catalog data, Dexie schema, app routes, UI copy, or test fixtures. The only allowed app-tree edit is a comment-only update to `app/src/data/archetypes.ts` in U3 if R10 fires.
- Do not author a new `pair_game` archetype, a `movement_proxy.required: false` flag, a `scoringRules` schema, a `compatibleFocuses` axis, a zone enum, or any `attack` / `defense` `SkillFocus` value.
- Do not author any new drill record, drill family, or progression link.
- Do not promote BAB Coaches-Guide voice into product copy. Stay inside the `D141` / `D137` calm-courtside / shibui posture.
- Do not re-litigate `O24` or revisit `D136`. `D141` already resolved that. Reference but do not relitigate.
- Do not bundle Bucket C candidates (composable scoring, problem-first plan flow, drill family abstraction, repetition-rank metadata, `compatibleFocuses` axis). Those wait for explicit re-activation triggers per Bucket A3.
- Do not write a unifying meta-brainstorm. The three packets are independent; consolidating risks reintroducing the "BAB-grade schema work pulls the next two months" anti-pattern the product-lens critique flagged.
- Do not run app tests, builds, or deploys. The only verification is `bash scripts/validate-agent-docs.sh` and JSON parseability of `docs/catalog.json`.

### Deferred to Follow-Up Work

- A `scoringRules` schema implementation against B1's chosen stance: future plan, gated by `D101` unlock OR an Around-the-World-Serve-class non-D101 wrapper landing in the catalog.
- An attack-chain authoring pass that consumes B2's chosen zone convention: future plan, gated by `D101` unlock and the first attack-chain candidate.
- An archetype-shape change for slot-4 (the `pair_game` archetype variant or the conditional slot-skip rule): future plan, gated by partner-walkthrough evidence ≥P1 OR a tournament-prep founder-use ledger row OR `D101` unlock.
- A combined Bucket C re-activation when `D101` / `M002` triggers fire (composable scoring, problem-first plan flow, etc.) — separate ideation pass.

---

## Context & Research

### Relevant Code and Patterns

- `docs/ideation/2026-05-04-bab-complete-plan-builder-ideation.md` is the source of B1 / B2 / B3 framing, including the survivor-bucket warrant and the architecture-strategist + product-lens critique cross-references.
- `docs/research/practice-plan-authoring-synthesis.md` carries T9 (nine composable scoring-rule kinds plus asymmetric axis), T6 (zone conventions across BAB/FIVB), and the captured BAB Game Play cluster cluster-complete confirmation that all four Game Play plans skip slot 4.
- `docs/decisions.md` `D141` is the most recent BAB-spine decision and the closest authorization-boundary pattern to mirror. `D140` is the closest "proposal-packet-with-revisit-trigger" pattern. `D137` is the "cleanup with explicit ID-reuse boundary" pattern.
- `docs/brainstorms/2026-05-06-001-d137-tune-today-routing-resolution-requirements.md` is the structural brainstorm template (frontmatter shape; Problem Frame → Actors → Key Flows → Requirements → Acceptance Examples → Success Criteria → Scope Boundaries → Key Decisions → Outstanding Questions → Sources). Bucket B packets adapt this lightly — Actors / Key Flows are minimal because these are decision-spine artifacts, not user-facing flows.
- `app/src/data/archetypes.ts` carries the M001 single-skill-chain generation invariant comment block (`D141`-cited) and the existing pair_net 25/40-min layouts that include `movementProxy`. It is the only candidate file for a comment-only update under R10.
- `docs/plans/2026-05-08-001-refactor-m001-o24-decision-spine-plan.md` is the immediately-prior M001 spine plan, the structural template for this plan's authorization-boundary posture, and the milestone-refresh predecessor that left the Bucket B routing line in `docs/milestones/m001-solo-session-loop.md`.

### Institutional Learnings

- `docs/solutions/architecture-patterns/d137-canonical-pre-run-spine-setup-safety-2026-05-07.md` and the `D141` resolution shape: pick the stance, cite the warrant, name the rejected alternatives, record the revisit triggers, refuse to authorize implementation in the same row.
- `docs/solutions/workflow-issues/route-founder-use-feedback-without-overfiring-scope-2026-05-04.md`: founder-use evidence should update routing/status without overfiring new scope. Bucket B packets are routing/status updates against future schema authority; they must not slip into authorizing schema.
- The existing `docs/brainstorms/` convention (Actors / Key Flows / Requirements / Acceptance Examples / Key Decisions) — applied lightly here because these are decision-pass packets, not user-flow brainstorms; minimal Actors / Key Flows are acceptable when the load-bearing content is the Key Decisions block.
- The reverted `D136` history (cited from O24 / D141) — a decision row that authorizes implementation by inference rather than explicit warrant gets retracted. Bucket B packets must not repeat that pattern.

### External References

- External research is not needed. The work is governed by local canon, the local BAB / FIVB / VDM research captures already in `docs/research/`, and repo documentation contracts. The synthesis already cites BAB Plans 1 / 4 / 8 (T6), Plans 8 / 11 / 15 / 16 / 17 / 18 / 19 / 20 (T9), and Plans 17–20 (slot-4 cluster-complete).

---

## Key Technical Decisions

- Resolve all three Bucket B items as documentation/decision artifacts only, mirroring the `D141` shape: stance + rejected alternatives + authorization boundary + revisit triggers. No catalog/runtime/schema work is authorized here.
- Author one brainstorm per decision under `docs/brainstorms/`, with one matching `D` row in `docs/decisions.md`. Do not consolidate the three into a single packet — separation prevents one decision's evidence from silently borrowing weight from another's.
- Each packet's recommended stance is the load-bearing content; alternatives are recorded as rejected-with-warrant rather than carried forward as "competing readings", because the point of the packet is to settle the stance ahead of catalog work, not to keep three readings indefinitely live.
- Cross-reference each new decision row from the synthesis doc and the ideation doc rather than duplicating evidence into the brainstorm. The brainstorm names the stance and the warrant; the synthesis remains the canonical evidence record.
- Comment-only `app/src/data/archetypes.ts` update under R10 is allowed but not required: only fire when U3 lands a stance that the in-code invariant block does not already accommodate, and even then add a citation only — not a behavioral change.

---

## Open Questions

### Resolved During Planning

- Should the three Bucket B items land as separate brainstorms or one consolidated packet? **Separate.** Mirrors existing `docs/brainstorms/` convention, matches the user's "~1 session each" framing, and prevents single-row authorization scope creep.
- Should each packet pre-decide a stance or only frame the options? **Pre-decide a stance with explicit rejected alternatives.** A "stay open" outcome would leave the same risk that prompted `D141` — downstream code work inferring an answer the decision spine never made explicit. The decision packets exist to close the gates ahead of authoring.
- Does this plan require app tests or builds? **No.** The work is documentation-only with at most a comment-only app-tree edit. The relevant verification is `bash scripts/validate-agent-docs.sh`.

### Deferred to Implementation

- Exact `D` numbers for the three new rows: assign sequentially during U1 → U3 (`D142` / `D143` / `D144` if all three slots are still free; otherwise next available, no renumbering).
- Exact wording of the recommended stance per packet — converged during the brainstorm authoring against the synthesis evidence, the `D141` posture template, and the calm-courtside guardrails. Drafts must record rejected alternatives explicitly, not just recommend.
- Whether U3's slot-4 brainstorm fires R10 (the comment-only `archetypes.ts` update) — depends on whether the chosen stance for B3 is "status quo until trigger fires" (no comment update needed) or "the M001 invariant should explicitly anticipate a future `pair_game` variant" (small comment-only addition appropriate).
- Exact `docs/catalog.json` placement of the four new files (this plan + three brainstorms): follow existing ordering and category conventions when editing.

---

## Implementation Units

- U1. **Author B1 — T9 Scoring-Overlay-Grammar Modeling Stance Brainstorm + Decision Row**

**Goal:** Land the B1 decision-pass packet that picks a modeling stance for T9's nine composable scoring rule kinds plus asymmetric axis, before any future `scoringRules` schema work commits to a shape.

**Requirements:** R1, R4, R5, R6

**Dependencies:** None

**Files:**
- Create: `docs/brainstorms/2026-05-08-002-b1-t9-scoring-overlay-modeling-stance-requirements.md`
- Modify: `docs/decisions.md` (add `D142` row)
- Reference: `docs/research/practice-plan-authoring-synthesis.md` (T9 evidence base)
- Reference: `docs/ideation/2026-05-04-bab-complete-plan-builder-ideation.md` (B1 framing)

**Approach:**
- Frame the problem: T9 is now the captured BAB scoring grammar (nine rule kinds + asymmetric scoring axis). The Mini Games to 7 family across Plans 5/8/12/15/19 is the strongest source case for the single-base-drill-with-parameter-overlays approach. Picking late forces retrofitting existing records.
- Lay out the three options with concrete trade-offs: (a) **separate drill records** (BAB's source pattern; clearest in catalogs and diagnostics, consumes authoring-budget cap for near-duplicates); (b) **sibling variants on a parent drill** (catalog-parsimonious, easy to swap, requires variant metadata to express constraints cleanly); (c) **runtime constraint toggles** (most user-controlled, smallest catalog footprint, adds runtime complexity to swap pool / success-metric resolution / diagnostic classification).
- Recommend a stance with explicit warrant. Default lean: **sibling variants on a parent drill** for restriction + augmentation symmetry, with the parent drill carrying the base scoring rule and siblings carrying composable overlay metadata. The Mini Games to 7 family evidence and the synthesis's "must support both restriction and augmentation symmetrically" constraint together make this the cheapest stance that does not box future authoring into duplicate-record territory. The implementer should evaluate this lean against the brainstorm research and either ratify or pick a different stance with documented warrant.
- Record rejected alternatives: "mix all three approaches across the catalog" (synthesis warns this creates diagnostic noise); "support only restriction, not augmentation" (forces authoring back into duplicate-record territory for augmentation); "import BAB's separate-drill-record pattern wholesale" (consumes authoring-budget cap on near-duplicates).
- Add the `D142` row to `docs/decisions.md` Decided table with the chosen stance, the rejected alternatives, the authorization boundary (no `scoringRules` schema, no Dexie field, no UI surface authorized), and the revisit trigger (`D101` unlocks pressure-drill authoring OR an Around-the-World-Serve-class non-D101 wrapper enters diagnostics activation).

**Patterns to follow:**
- `D141` authorization-boundary posture: stance + rejected alternatives + revisit trigger + explicit "no schema authorized."
- `D140` proposal-packet shape: cite the upstream evidence, commit to a direction, list rejected alternatives, name the falsification gate.
- `docs/brainstorms/2026-05-06-001-d137-tune-today-routing-resolution-requirements.md` frontmatter and section structure.

**Test scenarios:**
- Test expectation: none — decision-doc-only update with no executable behavior.

**Verification:**
- The B1 brainstorm exists, names the recommended stance, and lists rejected alternatives with warrant.
- `D142` row exists in `docs/decisions.md` Decided table, cites the brainstorm and this plan, and explicitly disallows authorizing schema implementation.
- A future agent reading T9 in the synthesis can find the resolved stance via the cross-reference (lands in U4).

- U2. **Author B2 — T6 Attack-Zone-Convention Default Brainstorm + Decision Row**

**Goal:** Land the B2 decision-pass packet that picks a default attack-zone convention before the first attack-chain catalog row is authored, so the chain is not silently locked to whatever convention the first added drill happens to use.

**Requirements:** R2, R4, R5, R6

**Dependencies:** None (independent of U1)

**Files:**
- Create: `docs/brainstorms/2026-05-08-003-b2-t6-attack-zone-convention-default-requirements.md`
- Modify: `docs/decisions.md` (add `D143` row)
- Reference: `docs/research/practice-plan-authoring-synthesis.md` (T6 evidence base)
- Reference: `docs/research/bab-source-material.md` (BAB 7-zone confirmations across Plans 1, 4, 8)
- Reference: `docs/research/fivb-source-material.md` (FIVB 5-zone Drill 5.6) when present
- Reference: `docs/ideation/2026-05-04-bab-complete-plan-builder-ideation.md` (B2 framing)

**Approach:**
- Frame the problem: BAB Plans 1 / 4 / 8 / 20 use a 7-zone attack grid; FIVB Drill 5.6 uses a 5-zone attack grid; BAB Plan 7 uses attack-accuracy boxes (4×4 marked rectangle for one shot; two boxes per attacker for HL/CS alternation). These are not interchangeable. The synthesis names this as a Volleycraft decision driven by cognitive-load / measurability / source-authority trade-offs, not by BAB-internal repetition count.
- Lay out the four candidates with trade-offs: (a) **BAB 7-zone** (strongest source-authority weight in the captured set; finest-grain measurement; highest cognitive load courtside); (b) **FIVB 5-zone** (institutional authority; coarser grain; lower cognitive load); (c) **BAB attack-accuracy boxes** (per-shot accuracy target; well-suited to repetition-style drills; not interchangeable with numbered-zone ladders); (d) **product-reduced grid** (custom Volleycraft simplification, e.g., 3-zone deep/middle/short or 4-zone diagonal/line/short/deep; trades source-authority for calm-courtside legibility).
- Acknowledge the synthesis's competing reading: counting BAB internal repetitions as votes weights one author's pedagogical preference inappropriately against FIVB's institutional authority. Both are valid sources; the convention question is a Volleycraft decision driven by cognitive-load / measurability / product trade-offs.
- Recommend a stance with explicit warrant. Default lean: adopt **a single primary convention as the chain default with attack-accuracy boxes available as an authorable variant for per-shot-accuracy drills**; the source-authority weight, courtside legibility under `P11`, and the measurability of a small-numbered grid all point at one of (a) BAB 7-zone or (d) a product-reduced 4-zone grid as the primary. The implementer should evaluate the brainstorm research against the calm-courtside guardrails and ratify one. Whichever is chosen, the catalog should not silently support more than one numbered-zone convention on the same chain.
- Record rejected alternatives: "support every convention the source uses" (creates diagnostic noise; the synthesis warns against this); "let the first authored attack drill set the convention by accident" (the failure mode this packet exists to prevent); "reuse the serving zone grid for attack" (synthesis explicitly forbids: BAB serving uses 4/6/8-zone scaling by level; serve and attack grids are not portable).
- Add the `D143` row to `docs/decisions.md` Decided table with the chosen default, the rejected alternatives, the authorization boundary (no zone enum, no drill-record field, no UI surface authorized), and the revisit trigger (`D101` unlocks attack-chain candidates OR a future product-research pass surfaces evidence the chosen grid is illegible courtside).

**Patterns to follow:**
- `D141` authorization-boundary posture.
- `docs/brainstorms/2026-05-06-001-d137-tune-today-routing-resolution-requirements.md` frontmatter and section structure.
- The synthesis's existing T6 framing — preserve the "competing reading" honesty in the brainstorm so the recommended stance is not framed as more settled than the source-evidence balance supports.

**Test scenarios:**
- Test expectation: none — decision-doc-only update with no executable behavior.

**Verification:**
- The B2 brainstorm exists, names the recommended default, and lists rejected alternatives with warrant.
- `D143` row exists in `docs/decisions.md` Decided table, cites the brainstorm and this plan, and explicitly disallows authoring zone metadata or attack-chain drills.
- A future agent reading T6 in the synthesis can find the resolved default via the cross-reference (lands in U4).

- U3. **Author B3 — Slot-4 (Movement) Optionality Brainstorm + Decision Row + Optional Comment-Only `archetypes.ts` Update**

**Goal:** Land the B3 decision-pass packet that decides whether slot 4 (movement) becomes optional in archetype contracts, given the cluster-complete BAB Game Play evidence that all four Game Play plans skip slot 4.

**Requirements:** R3, R4, R5, R6, R10

**Dependencies:** None (independent of U1, U2)

**Files:**
- Create: `docs/brainstorms/2026-05-08-004-b3-slot-4-movement-optionality-requirements.md`
- Modify: `docs/decisions.md` (add `D144` row)
- Modify (conditional, comment-only): `app/src/data/archetypes.ts`
- Reference: `docs/research/practice-plan-authoring-synthesis.md` (Captured Plan Grammar Templates row 4 — cluster-complete confirmation)
- Reference: `docs/ideation/2026-05-04-bab-complete-plan-builder-ideation.md` (B3 framing)

**Approach:**
- Frame the problem: the captured BAB Game Play cluster (Plans 17–20) cluster-complete-confirms slot 4 (movement) is intentionally skipped in pure Game Play sessions. The current `pair_net` 25-min and 40-min layouts in `app/src/data/archetypes.ts` always include `movement_proxy`. The closest thing Volleycraft has to a "practice match" archetype actively contradicts BAB grammar.
- Lay out the three options with trade-offs: (a) **status quo** (slot 4 stays required across all archetype layouts; ignores the BAB cluster-complete evidence; preserves consistent layout shape); (b) **conditional slot-skip rule on existing archetypes** (`pair_net` 25/40 layouts skip slot 4 when a future "tournament prep" / "match play" mode is selected; runtime branch on layout selection); (c) **new `pair_game` archetype variant** with a slot-4-skipped layout (own warmup → technique → main_skill → pressure → wrap shape; routed when a future selection mode picks it; mirrors the `pair_long_warmup` archetype-variant pattern from M001 Tier 1b's pair-opening-block deferred work).
- Recommend a stance with explicit warrant. Default lean: **option (c) deferred — a new `pair_game` archetype variant with a slot-4-skipped layout** is the architecturally honest move (mirrors the `pair_long_warmup` precedent that runtime layout compression overflows session durations), but **the implementation waits** for either (i) partner-walkthrough evidence ≥P1 explicitly naming match-play / tournament-prep as a missing surface, (ii) a founder-use ledger row tagged `tournament-prep` with a content-gap note, or (iii) `D101` unlock making 3+ player Game Play plans catalog-eligible. The decision row records the architectural shape so the future implementation does not have to re-litigate the variant-vs-runtime-skip choice. The implementer should evaluate this against the brainstorm research and ratify, refine, or replace.
- Record rejected alternatives: "keep status quo and ignore BAB Game Play cluster-complete evidence" (declared inconsistent with the synthesis's named evidence; preserves a known mismatch); "runtime-compress existing pair_net layouts to skip slot 4" (the M001 Tier 1b pair-opening-block decision already established this as the *wrong* shape because runtime compression overflows session durations — apply the same precedent symmetrically to slot-4 skipping); "ship the `pair_game` archetype now without trigger evidence" (Bucket-B-as-implementation drift the product-lens critique flagged).
- Add the `D144` row to `docs/decisions.md` Decided table with the chosen architectural shape, the rejected alternatives, the authorization boundary (no archetype-layout change, no `BlockSlot.required` flag flip, no new archetype record authorized), and the revisit triggers (partner-walkthrough ≥P1 / founder-ledger tournament-prep row / `D101` unlock).
- **Conditional file edit (R10):** if the chosen B3 stance leaves the M001 invariant comment block in `app/src/data/archetypes.ts` accurate as-is, no edit. If the chosen stance materially anticipates a future `pair_game` archetype variant or a slot-4-skip rule that the existing comment block does not contemplate, add a comment-only citation of `D144` next to the `D141` block — citation only, no behavioral change. Do **not** modify any layout, slot, `required` flag, or `selectArchetype` function.

**Patterns to follow:**
- `D141` authorization-boundary posture.
- `docs/brainstorms/2026-05-06-001-d137-tune-today-routing-resolution-requirements.md` frontmatter and section structure.
- The M001 Tier 1b pair-opening-block deferral — precedent for "the new archetype variant is the right shape; gate the implementation on partner-walkthrough evidence."

**Test scenarios:**
- Test expectation: none — decision-doc-only update with no executable behavior. The conditional comment-only `archetypes.ts` edit (if it fires) carries no test surface.

**Verification:**
- The B3 brainstorm exists, names the recommended stance, and lists rejected alternatives with warrant.
- `D144` row exists in `docs/decisions.md` Decided table, cites the brainstorm and this plan, and explicitly disallows authorizing archetype-layout changes.
- If the conditional R10 edit fires, `app/src/data/archetypes.ts` adds only a comment-only citation; no `BlockSlot`, layout, or function logic changes; the build, typecheck, and tests are not exercised because no behavior changed (the comment-only edit is verified by visual diff, not test runs).
- A future agent reading the slot-4 cluster-complete row in the synthesis can find the resolved stance via the cross-reference (lands in U4).

- U4. **Routing, Cross-References, and Doc Validation**

**Goal:** Make the three new brainstorms and decision rows discoverable from the existing routing surfaces, cross-reference them from the upstream evidence docs, and verify documentation contracts.

**Requirements:** R7, R8, R9, R11

**Dependencies:** U1, U2, U3

**Files:**
- Modify: `docs/ideation/2026-05-04-bab-complete-plan-builder-ideation.md` (add Bucket B "landed as decision packets" notes mirroring the Bucket A landing pattern)
- Modify: `docs/research/practice-plan-authoring-synthesis.md` (cross-reference `D142` from T9 section, `D143` from T6 section, `D144` from the slot-4 cluster-complete row in Captured Plan Grammar Templates)
- Modify: `docs/catalog.json` (register this plan + three brainstorms)
- Modify: `docs/status/current-state.md` (add concise shipped-history entry for the Bucket B decision-spine ship)
- Modify: `docs/milestones/m001-solo-session-loop.md` (move the Bucket B item in "remaining M001 routing" from "agent-actionable separate follow-up" to "landed as `D142` / `D143` / `D144`"; update `decision_refs` if the milestone uses one)
- Modify: `docs/plans/2026-05-08-002-feat-bucket-b-pre-d101-schema-decision-passes-plan.md` (mark `status: complete` after verification)

**Approach:**
- Add the Bucket B landing notes to the ideation doc inline at each Bucket B subsection (B1 / B2 / B3), one or two lines naming the brainstorm path and the decision row. Do not delete or mutate the original framing prose.
- Cross-reference the new decision rows from the synthesis: a one-line pointer at the end of T9, T6, and the slot-4 cluster-complete row, naming `D142` / `D143` / `D144` and the brainstorm paths. Preserve the synthesis's existing "competing reading" prose unchanged.
- Register the plan + three brainstorms in `docs/catalog.json` with existing category / ordering conventions and concise `summary` fields.
- Add a concise shipped-history entry to `docs/status/current-state.md` (one-line per decision row plus a dated header), styled to match recent `D138` / `D139` / `D140` / `D141` entries.
- Update the milestone doc's "remaining M001 routing" section so the Bucket B line moves from `agent-actionable` to `landed`. Do not turn the milestone into a Bucket-B history; keep the entry one short bullet with pointers.
- Mark this plan `status: complete` after the validator script and JSON parse pass.
- Run `bash scripts/validate-agent-docs.sh` and confirm a clean exit.

**Patterns to follow:**
- Recent plan registrations for `D138` / `D139` / `D140` / `D141` in `docs/catalog.json`.
- Current-state shipped-history entries for decision-spine cleanup.
- The Bucket A landing pattern in `docs/ideation/2026-05-04-bab-complete-plan-builder-ideation.md` (for the inline landing notes shape).

**Test scenarios:**
- Test expectation: none — documentation routing update.

**Verification:**
- `bash scripts/validate-agent-docs.sh` passes.
- `python3 -c "import json; json.load(open('docs/catalog.json'))"` succeeds (or equivalent JSON-parse smoke check).
- Each new file is referenced from at least one routing surface (`docs/catalog.json`, the milestone doc, or the status doc).
- The three new decision rows are reachable from the synthesis doc and the ideation doc via direct cross-reference, not just by grep.
- This plan's frontmatter shows `status: complete`.

---

## System-Wide Impact

- **Interaction graph:** Documentation-only with at most a comment-only app-tree edit on `app/src/data/archetypes.ts` under R10. Agent-routing changes through docs, not app behavior. Generator, swap pool, diagnostic spine, capture surfaces, and run-flow are unchanged.
- **Error propagation:** None.
- **State lifecycle risks:** None. No Dexie migration, no localStorage write, no persisted state shape change.
- **API surface parity:** No app API, route, data, export, or test surface changes.
- **Integration coverage:** Documentation validation is sufficient. `bash scripts/validate-agent-docs.sh` and a `docs/catalog.json` JSON-parse smoke check cover the verification surface.
- **Unchanged invariants:** Current session assembly behavior, `D141` single-skill-chain generation invariant, `D137` Setup → Safety pre-run spine, `D133` per-drill capture grain, `D102` / `D103` solo archetype priority, `D105` warmup/cooldown contract, all `BlockSlot` / `SessionArchetype` shapes and layouts.

---

## Risks & Dependencies

| Risk | Mitigation |
|------|------------|
| Bucket B packets quietly authorize implementation by inference (the failure mode that retracted `D136`) | Each brainstorm and decision row carries an explicit authorization-boundary clause stating no schema / runtime / catalog / UI work is authorized; revisit triggers gate any future implementation behind explicit re-activation conditions |
| Three packets land as a "BAB-grade schema work pulls the next two months" anti-pattern the product-lens critique flagged | Plan explicitly declares Bucket C remains deferred; each Bucket B packet is small (decision + warrant), no upstream catalog or runtime work is touched, and the M001 milestone's "evidence-gated work" routing remains untouched |
| Mixing one stance from B1 with a contradictory implication in B2 or B3 (e.g., a B1 stance that implies sibling-variant metadata while a B3 stance that conflicts with archetype-layout shape) | Each packet's authorization boundary is independent and refuses to authorize cross-packet implications; cross-references in synthesis stay one-line pointers, not derived constraints |
| Decision-row ID collisions (a parallel work stream burns `D142` / `D143` / `D144` first) | Implementer assigns sequentially during U1 → U3, no renumbering of existing rows; if a slot is taken, take the next available ID and update cross-references in U4 |
| `app/src/data/archetypes.ts` comment-only edit accidentally introduces a behavioral change | Plan explicitly forbids changes to `BlockSlot`, layouts, `required` flags, and `selectArchetype`; the conditional R10 edit is comment-only and the diff must show comment-block addition only |
| Stale routing leaves a Bucket B item still listed as "agent-actionable" in the M001 milestone after landing | U4 explicitly updates `docs/milestones/m001-solo-session-loop.md` "remaining M001 routing" to move Bucket B from agent-actionable to landed |
| `bash scripts/validate-agent-docs.sh` failure due to YAML frontmatter drift in the new brainstorm files | Brainstorm frontmatter follows the `docs/brainstorms/2026-05-06-001-d137-tune-today-routing-resolution-requirements.md` template (id / title / status / stage / type / authority / last_updated / depends_on / summary); validator runs in U4 before plan close |

---

## Documentation / Operational Notes

- Docs-first cleanup under the repo's machine-scannable-docs rules. No browser testing is expected to be useful unless implementation unexpectedly touches UI files.
- No migration, deploy, or app release note is required.
- The conditional R10 edit on `app/src/data/archetypes.ts` (if fired) does not require an app build or test run because no behavior changed; the comment-only diff is the verification.
- Future schema implementation plans against the chosen Bucket B stances should cite the relevant `D142` / `D143` / `D144` row as the authority, not the synthesis prose, so the decision-spine remains the source of truth.

---

## Sources & References

- `docs/ideation/2026-05-04-bab-complete-plan-builder-ideation.md` — Bucket B framing, architecture-strategist sequencing, product-lens critique
- `docs/research/practice-plan-authoring-synthesis.md` — T6 (zone conventions), T9 (scoring overlay grammar), Captured Plan Grammar Templates (slot-4 cluster-complete row)
- `docs/research/bab-source-material.md` — BAB Plans 1, 4, 8, 17–20 source captures
- `docs/decisions.md` — `D141` resolution of `O24`, `D140` proposal-packet pattern, `D137` cleanup pattern, `D133` per-drill capture grain, `D101` 3+ player gate
- `docs/milestones/m001-solo-session-loop.md` — "remaining M001 routing" Bucket B line that this plan resolves into landed decision rows
- `docs/plans/2026-05-08-001-refactor-m001-o24-decision-spine-plan.md` — immediate-prior milestone-refresh / `D141` plan; structural template
- `docs/brainstorms/2026-05-06-001-d137-tune-today-routing-resolution-requirements.md` — brainstorm-file structural template
- `app/src/data/archetypes.ts` — current `pair_net` layouts and M001 single-skill-chain invariant comment block
- `docs/status/current-state.md` — current shipped-history surface
- `docs/catalog.json` — machine-readable doc routing surface
