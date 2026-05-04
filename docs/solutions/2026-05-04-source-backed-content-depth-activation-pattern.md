---
id: source-backed-content-depth-activation-pattern
title: "Source-Backed Content-Depth Activation Pattern (d47→d49, d46→d50, d31→d51)"
status: active
stage: validation
type: solution
summary: "Canonical end-to-end pattern for moving a generated-plan diagnostic group from `pressure_remains_without_redistribution` evidence to a shipped catalog drill addition, using the in-repo source archives (FIVB / BAB / VC) as load-bearing intermediates. Validated three times: D47 closed-by-D49 (2026-05-02, advanced setting), D46 closed-by-D50 (2026-05-04, advanced passing), D31 closed-by-D51 (2026-05-04, beginner serving — first beginner-level application)."
authority: durable workflow learning for diagnostic-driven catalog additions; not a product decision
last_updated: 2026-05-04
depends_on:
  - docs/research/fivb-source-material.md
  - docs/research/bab-source-material.md
  - docs/research/sources/README.md
  - docs/reviews/2026-05-01-generated-plan-diagnostics-triage.md
  - app/src/domain/generatedPlanDiagnosticTriage.ts
  - app/src/domain/sessionBuilder.ts
related:
  - docs/plans/2026-05-02-014-feat-d47-source-backed-catalog-implementation-plan.md
  - docs/plans/2026-05-04-003-feat-d50-advanced-passing-depth-plan.md
  - docs/research/practice-plan-authoring-synthesis.md
---

# Source-Backed Content-Depth Activation Pattern

## TL;DR

When the generated-plan diagnostic kit reports a group with `pressure_remains_without_redistribution` plus follow-up route `source_backed_proposal_work`, the canonical path to a shipped drill addition is:

1. **Pre-mined source archive lookup** (`docs/research/{fivb,bab}-source-material.md`) → identify candidate source drill (Tier 2 polish list is the fastest-leverage input).
2. **Source-backed gap card** (`docs/reviews/YYYY-MM-DD-<drillId>-source-backed-gap-card.md`) → name the candidate content-depth delta, mark `source_candidate` / `not_authorized`.
3. **Comparator decision packet** (`docs/reviews/YYYY-MM-DD-<drillId>-no-change-comparator-decision-packet.md`) → reject no-change baseline, name source-evidence requirement, select `hold_for_source_evidence`.
4. **Source-evidence brainstorm** (`docs/brainstorms/YYYY-MM-DD-<newDrillId>-requirements.md`) → R1–R8 contract: source ID, skillFocus boundary, workload envelope, 1–2 player adaptation, selection-path hypothesis, expected diagnostic movement, **rollback criterion**.
5. **Implementation plan** (`docs/plans/YYYY-MM-DD-NNN-feat-<newDrillId>-plan.md`) → 6–7 implementation units mirroring the precedent (drill record, chain wiring, selection-path reroute, catalog tests, sessionBuilder tests test-first, diagnostics regen, docs trail).
6. **Implementation + diagnostics regen + ship-or-revert decision** based on the rollback criterion.

The pattern has shipped three times: **D47 → D49** (advanced setting, 2026-05-02), **D46 → D50** (advanced passing, 2026-05-04), and **D31 → D51** (beginner serving, 2026-05-04 — first beginner-level application proving the recipe is level-agnostic).

## Why This Is the Bottleneck-Aware Path

Earlier sessions kept getting blocked at "we need exact source citations" — but the FIVB Drill-book PDF (104 drills) and BAB 2024 PDF (37 drills) have been in `docs/research/sources/` since 2026-04-20, and `docs/research/fivb-source-material.md` already curates a **Tier 2 polish candidates list** with exact chapter.section IDs.

**The bottleneck was activation discipline, not source mining.** All three shipped applications used candidates already named in the FIVB cross-reference table:

- D49 (Set and Recover): adapts the 1–2 player open-court intent of FIVB 4.7 "4 Great Sets" + advanced setting recovery patterns.
- D50 (Short/Deep Pass Read): activates FIVB 3.13 Short / Deep, which had been listed as "Content-polish candidate" since the 2026-04-20 archive pass.
- D51 (Outside the Heart Serving): activates FIVB 2.2, which had been listed as Tier 2 polish candidate with the explicit deferral note *"Not cloned in Tier 1 because d31 is our first-rung anchor"* since 2026-04-20. Same archive note now reads "Activated as `d51`."

When approaching a new candidate group, **start with the cross-reference table**, not the PDF.

## When to Apply

Apply this pattern when **all** of the following hold for a generated diagnostic group:

1. Group's redistribution causality state is `pressure_remains_without_redistribution` or `mixed_cell_states` (with pressure_remains > 0).
2. Group's follow-up routes include `source_backed_proposal_work`.
3. The drill in question has an honest workload envelope that cannot honestly stretch to absorb the cells where pressure remains (e.g., `d46`'s 5–8 min envelope vs cells trying to allocate 12+ min).
4. A source-archive cross-reference table (`docs/research/fivb-source-material.md` or `docs/research/bab-source-material.md`) names a candidate drill that would honestly fill the longer envelope **without duplicating the existing drill's teaching surface**.

If condition 4 fails, the gap is real but the source isn't ready — author a gap card and stop until source review supplies a candidate. Don't invent source provenance.

## When NOT to Apply

Skip catalog adds and route to U7 workload review or U8 generator-policy investigation when the diagnostic shape suggests:

- **`under_authored_min` only** (no over-cap pressure): the drill is being asked to fit into too-short cells. Workload envelope or block-shape concern.
- **`redistribution_without_pressure`**: optional-slot bookkeeping; no athlete-facing failure.
- **`likely_redistribution_caused`** (pressure disappears under counterfactual): generator-policy concern, not content depth.
- **Drill's honesty clause already disclaims the missing surface** (e.g., `d05`'s "trains platform + direction, not serve-reading"): adding a sibling that does what the disclaimer rejects is a different product decision, not a depth fill.

## Required Boundaries

These boundaries are load-bearing and have failed quietly in prior attempts:

1. **No teaching-surface duplication.** The new drill's `objective`, `teachingPoints`, `courtsideInstructions`, and `coachingCues` must not teach the same skill the existing drill teaches. The honesty boundary may be stated in the `objective` as a disclaimer ("trains X, not Y — that surface belongs to drillId"). See `app/src/data/__tests__/catalogValidation.test.ts` "keeps D50 teaching content spin-reading-free" for the enforced version.
2. **Rollback criterion in the brainstorm.** Every requirements doc must name diagnostic movement thresholds and a "revert if no movement" rule. D50's was: revert if d46 cells don't drop or new d50 cells appear with `pressure_remains > 2`.
3. **D101 (3+ player) boundary.** Source drills written for 4+ athletes plus coach must adapt to 1–2 players or be deferred. Never silently import 3+ player forms.
4. **Selection-path change is part of the slice.** Adding a drill record alone does not move diagnostics. A new `shouldPreferAdvanced<Focus>DurationFit` predicate plus reroute-condition extension in `sessionBuilder.ts` is the load-bearing half.
5. **Algorithm version bump if golden snapshots break.** Adding a new drill to `DRILLS` changes `findCandidates` output for main_skill (and propagates through `usedDrillIds` to subsequent slots). Bump `SESSION_ASSEMBLY_ALGORITHM_VERSION` and update affected snapshots; preserve the old assertion intent.

## Implementation Skeleton (Mirror, Don't Reinvent)

| Slot | D49 reference | D50 reference | D51 reference |
|------|--------------|--------------|--------------|
| Drill record | `app/src/data/drills.ts` `const d49: Drill = { ... }` | `const d50: Drill = { ... }` | `const d51: Drill = { ... }` |
| Variant count | 2 (mirrors d47 open variants) | 2 (mirrors d46 open variants) | 3 (mirrors d31 open + open-pair + net-pair coverage) |
| Chain wiring | `chain-7-setting` `drillIds: [..., 'd49']` | `chain-4-serve-receive` `drillIds: [..., 'd50', ...]` | `chain-6-serving` `drillIds: [..., 'd51', ...]` |
| Main-skill-only constraint | `app/src/domain/sessionAssembly/candidates.ts` `if (drill.id === 'd49' && slot.type !== 'main_skill') continue` | Same pattern with `'d50'` | Same pattern with `'d51'` |
| Hard-coded "duration-fit needs reroute" set | `ADVANCED_SETTING_DURATION_FIT_DRILL_IDS = new Set(['d47', 'd48'])` | `ADVANCED_PASSING_DURATION_FIT_DRILL_IDS = new Set(['d46'])` | `BEGINNER_SERVING_DURATION_FIT_DRILL_IDS = new Set(['d31'])` |
| Predicate helper | `shouldPreferAdvancedSettingDurationFit` (focus=`set` + level=`advanced`) | `shouldPreferAdvancedPassingDurationFit` (focus=`pass` + level=`advanced`) | `shouldPreferBeginnerServingDurationFit` (focus=`serve` + level=`beginner`) |
| Reroute trigger extension | `if (shouldRerouteD01 \|\| shouldRerouteAdvancedSetting)` | `... \|\| shouldRerouteAdvancedPassing` | `... \|\| shouldRerouteBeginnerServing` |
| Catalog tests | `describe('D49 source-backed activation')` | Mirror with `'D50 source-backed activation'` | Mirror with `'D51 source-backed activation'` |
| Selection-path tests | "prefers D49 for over-cap advanced setting" + "reroutes redistributed advanced setting sessions to D49" | Same pattern for D50 advanced pair-open + solo-open passing | Same pattern for D51 beginner solo-open + pair-open serving (3 variants → 3 happy-path tests) |
| Algorithm version | (no bump) | 4 → 5 | 5 → 6 |
| Honesty boundary test | (objective disclaimer pattern) | "spin-reading-free" assertion on teaching surface | "single-target-free" assertion on teaching surface (regex `/single[\s-]target\|one\s+target\|target\s+circle/`) |
| Diagnostic absorption | D47 comparator key absent post-ship | d46-pair-open + d46-solo-open absent post-ship | d31-solo-open + d31-pair-open + d31-pair absent post-ship |

## Verification Sequence

For any catalog activation following this pattern:

1. `npm test -- src/domain/sessionBuilder.test.ts` — must pass with new reroute tests + golden snapshot updates.
2. `npm test -- src/data/__tests__/catalogValidation.test.ts` — must pass with new drill assertions.
3. `npm run diagnostics:report:update` — regenerate.
4. Inspect regenerated `docs/reviews/2026-05-01-generated-plan-diagnostics-triage.md`:
   - Original group(s) should be **absent** from the redistribution causality receipt (absorbed by the new drill).
   - New drill's groups should classify as `likely_redistribution_caused` with `pressure_remains: 0` (envelope sized correctly).
   - If new groups show `pressure_remains > 2`, **revert** per the brainstorm's rollback criterion.
5. `npm run diagnostics:report:check` — confirm regenerated docs are fresh.
6. `npm run build` — TypeScript clean.
7. `bash scripts/validate-agent-docs.sh` — agent-doc validation green.

## Documentation Trail

Every catalog add following this pattern updates:

- The originating gap card (status → `closed_by_<newDrillId>`, comparator gate prose updated).
- The originating comparator packet (selected outcome → `<originalDrill>_wins`, add `## Implementation Result` section).
- `docs/research/fivb-source-material.md` or `docs/research/bab-source-material.md` cross-reference (Tier 2 candidate row → "Activated as `<newDrillId>` (YYYY-MM-DD)").
- `docs/status/current-state.md` recent shipped history (one row, with `last_updated` bump).
- `docs/catalog.json` (register plan + bump `last_updated`).
- `app/scripts/validate-generated-plan-diagnostics-report.mjs` `depends_on` (add the new plan + brainstorm + comparator packet so generated-triage freshness reflects the full provenance chain).
- This solutions doc (extend the validation table when a third candidate ships).

## Pre-Mined Tier 2 Polish Candidates Still Open

From `docs/research/fivb-source-material.md` (subset, sorted by likely strength of match):

| FIVB ID | Drill | Likely target diagnostic group | Notes |
|---------|-------|-------------------------------|-------|
| 3.6 | The U Passing Drill | possibly `d10`/`d11` movement-passing depth | Footwork-heavy variant; `chain-3-movement` candidate |
| 3.8 | W Passing Drill | possibly advanced passing depth | More advanced variant of 3.6 |
| 4.6 | Setting Ball Out of the Net | scenario-specific setting | Scenario-specific; not foundational |
| 4.7 | 4 Great Sets | partially absorbed by D49 | Variability drill; check if D49 already covers |
| ~~2.2 Serving Outside the Heart~~ | ~~possibly d31 cluster~~ | **Activated as `d51` 2026-05-04** | Third validated application — see d51 plan |
| 2.4 | Force Them Back | partner-only pressure serving | Tier 3+ pair-only |
| 3.11 | Backspin and Topspin Passing | possibly d05 or d07 passing depth | Read-serve-spin training; rejected for d50 (duplicates d46) but may fit a different group |
| 3.13 (used) | Short / Deep | — | **Activated as `d50` 2026-05-04** |
| 4.7 (used as inspiration) | 4 Great Sets | — | **Adapted into `d49` 2026-05-02** |

When opening a new gap card for a candidate group, check this table first. If the FIVB row matches the diagnostic group's drill chain and level band, that's the strongest first candidate.

## Anti-Patterns Caught

These were attempted in earlier sessions and rejected:

- **One-gap-card-per-drill ceremony.** Three documents (gap card + comparator + plan) per single drill add was overkill once the pattern was known. The brainstorm `requirements.md` can ship as the "source evidence payload" the comparator named, collapsing one round trip.
- **Adding the new drill before the selection-path change.** The diagnostic kit auto-discovers the new drill, so it shows up in observation groups, but `buildDraft()` won't pick it for the affected cells unless the reroute is wired. Always ship them together.
- **Picking source drills that duplicate existing teaching content.** D46 already trained spin reading; FIVB 3.11 Backspin/Topspin Passing was rejected for D50 in favor of FIVB 3.13 Short/Deep, which trains an adjacent-but-distinct skill.
- **Skipping the rollback criterion.** Without "revert if diagnostics don't move," a no-op drill add ships and pollutes the catalog. Always state the threshold in the brainstorm.

## Cross-Reference

- D47 → D49 implementation: `docs/plans/2026-05-02-014-feat-d47-source-backed-catalog-implementation-plan.md`
- D46 → D50 implementation: `docs/plans/2026-05-04-003-feat-d50-advanced-passing-depth-plan.md`
- D31 → D51 implementation: `docs/plans/2026-05-04-004-feat-d51-beginner-serving-tactical-zone-depth-plan.md`
- Source archives: `docs/research/fivb-source-material.md`, `docs/research/bab-source-material.md`, `docs/research/sources/README.md`
- Cross-source plan-builder synthesis (when picking which source family or variation axis to expand): `docs/research/practice-plan-authoring-synthesis.md`
- Diagnostic kit triage routes: `app/src/domain/generatedPlanDiagnosticTriage.ts` `GeneratedPlanTriageRoute`
- Selection-path reroute logic: `app/src/domain/sessionBuilder.ts` `shouldPreferAdvanced*DurationFit` and `shouldPreferBeginner*DurationFit` helpers
- Compression lane classifier (extended in d51 ship to handle `movement_proxy + under_authored_min` → `workload_envelope_review`): `app/src/domain/generatedPlanDiagnosticTriage.ts` `compressionLaneForGeneratedPlanTriageItem`

## Lessons Specific to d51 (Third Application)

- The pattern works at the **beginner level** without modification. Prior two applications were both at advanced level, so the third application proves the recipe is level-agnostic.
- `levelMax: 'intermediate'` is safe when the new drill's envelope is wider than any incumbent intermediate drill in the same chain (d33 caps at 10 min; d51 at 14 min — d33 still wins for cells that fit its envelope at intermediate level).
- **Algorithm version bumps cluster.** Each ship's shuffle propagation surfaces previously-hidden classification gaps in the diagnostic kit. The d51 ship surfaced `movement_proxy + under_authored_min` groups that needed a new compression lane match. Future applications should pre-grep for `unknown_compression_lane` after regenerating diagnostics.
- **Three-variant families are fine.** The pattern accommodates any variant count that mirrors the displaced drill's surface coverage (d49 + d50 had 2 each because d47/d48/d46 had 2; d51 has 3 because d31 has 3).
