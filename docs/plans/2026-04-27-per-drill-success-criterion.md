---

## id: per-drill-success-criterion-2026-04-27

title: "Per-drill success criterion on /run/check (V0B-28 surface-move) (2026-04-27)"
type: plan
status: complete
stage: validation
authority: "Spec-gap fix that re-aligns the per-drill capture surface (`DrillCheckScreen` + `PerDrillCapture`) with `docs/specs/m001-review-micro-spec.md` §Required (V0B-28 forced-criterion prompt). Shipped as part of the 2026-04-28 architecture pass (U2 capture-domain consolidation, `11fed34`). All five items landed: `getBlockSuccessRule` helper in `app/src/domain/drillMetadata.ts`; `successRuleDescription` prop + render in `app/src/components/PerDrillCapture.tsx`; rate label `% good pass rate` → `% good` in `app/src/components/PassMetricInput.tsx`; `d33` `successMetric.description` re-worded to `Serve lands in the called zone.` (both Solo and Pair siblings); `useDrillCheckController` resolves and passes `captureSuccessRule` from `resolveDrillCheckCaptureEligibility`; spec line synced to `the drill check surface (post-D133)` with the source-from-record clause."
summary: "Three-item structural fix bundle: (1) source the per-drill success rule from `variant.successMetric.description` and render it as a forced-criterion prompt with the spec-mandated `If unsure, don't count it as Good.` anti-generosity nudge above the optional Good/Total counts inside `PerDrillCapture`; (2) soften the rate label inside `PassMetricInput` from the pass-specific `% good pass rate` to the skill-neutral `% good`; (3) re-word `d33 Around the World Serving`'s `successMetric.description` from a session-level checklist to a per-attempt rule that fits the count-bearing capture surface (`Serve lands in the called zone.`). Spec sync to the Review micro-spec lands in the same pass. **Shipped 2026-04-28** with the architecture pass U2 (`11fed34`); 1065/1065 Vitest pass."
last_updated: 2026-04-28
depends_on:

- docs/specs/m001-review-micro-spec.md
- docs/decisions.md
- docs/plans/2026-04-26-pair-rep-capture-tier1b.md
- docs/plans/2026-04-26-pre-d91-editorial-polish.md
- docs/plans/2026-04-27-skip-review-and-investment-footer.md
- docs/plans/2026-04-27-solo-vs-pair-variant-sweep.md
related:
- .cursor/rules/courtside-copy.mdc
- app/src/components/PerDrillCapture.tsx
- app/src/components/PassMetricInput.tsx
- app/src/screens/DrillCheckScreen.tsx
- app/src/data/drills.ts
- app/src/domain/drillMetadata.ts
decision_refs:
- D104
- D130
- D133

# Per-drill success criterion on /run/check (V0B-28 surface-move) (2026-04-27)

## Agent Quick Scan

- **Class:** spec-gap fix, not editorial polish. Implements an existing canonical spec line (Review micro-spec line 78, V0B-28) on the surface that owns capture post-`D133`.
- **Trigger:** founder spotted the gap in the active session: serving drills (`d31`, `d33`, `d23`) render Good/Total count fields, but the rate line says `% good pass rate` and there is no per-drill criterion above the counts. The user's literal question was "are they supposed to be counts for good v bad serves?" — a question the forced-criterion prompt was authored to answer.
- **Three changes:**
  - `PerDrillCapture` now sources the per-drill success rule from `variant.successMetric.description` (resolved by a new `getBlockSuccessRule` helper that mirrors the existing `getBlockMetricType` variant resolution) and renders it inside the collapsed `Add counts` body as `Success rule: <rule>. If unsure, don't count it as Good.` This satisfies `D104` layer-1 (criterion-tied per-rep prompt) on the post-`D133` surface.
  - `PassMetricInput` rate label changes from `% good pass rate` to `% good`. Skill-neutral; the criterion is now visible above it.
  - `d33 Around the World Serving` `successMetric.description` changes from `Serves landing in the named 6-zone serving grid: front-left, front-middle, front-right, back-left, back-middle, back-right.` to `Serve lands in the called zone.`. The session-level "all 6 zones" goal stays in `target` and `courtsideInstructions` where it belongs; the description-as-criterion now reads at per-attempt grain so Good/Total has a clean meaning.
- **Spec sync:** `docs/specs/m001-review-micro-spec.md` line 78 changes from `the review surface must present this as a forced-criterion prompt...` to `the drill check surface must present this as a forced-criterion prompt..., sourcing the rule from the drill record's variant successMetric.description rather than hard-coded passing copy.` The `ReviewScreen` legacy fallback path keeps its hard-coded passing copy unchanged — that branch is reached only by non-`D133` legacy sessions and changing it would expand scope without changing the active path.
- **Estimated effort:** 2 hours focused. Surface area is small; tests carry most of the cost.
- **Dependencies / load:** zero schema migrations. Zero new drill records. Zero new archetype variants. Zero Dexie schema changes. One new pure helper, one rendered span, one prop, one rate label, one drill-record string edit, one spec sentence.

## Why this plan exists

The 2026-04-26 pre-D91 editorial polish pass (`docs/plans/2026-04-26-pre-d91-editorial-polish.md`) and the 2026-04-27 `D133` ratification (`docs/plans/2026-04-26-pair-rep-capture-tier1b.md` + same-day implementation) moved drill-grain capture from the Review screen at session end to the Drill Check screen between blocks. The move closed the founder's literal complaint ("the 'passes and good passes' bit at the end is too hard to track and fill out post workout"). It did not bring across the V0B-28 forced-criterion prompt that the Review micro-spec line 78 mandates as the first layer of the `D104` three-layer self-scoring bias correction.

The gap stayed invisible while the active drill set was passing-only: the hard-coded `% good pass rate` rate label and the absent criterion read consistently with the passing context. The 2026-04-27 Tier 1b Layer A drill-authoring sweep (`d31`, `d33`, `d40`, `d42`) and the same-day solo-vs-pair variant sweep (8 new tuned Pair variants) introduced count-bearing serving (`d31`, `d33`) and setting (`d38`, `d39`, `d40`, `d42`) drills. The first founder use after that sweep made the gap visible — the rate label is wrong on every non-passing count drill, and the missing criterion makes the Good/Total ask read as "are these counts of … what?" exactly when the user is reflecting on a serve.

This plan re-aligns the capture surface with the spec line that already exists. It does not introduce new product behavior; it relocates a behavior the spec mandates from a surface that no longer owns capture (`ReviewScreen` legacy fallback) to the surface that does (`DrillCheckScreen` via `PerDrillCapture`).

## Why now

Three reasons:

1. `**D104` layer-1 is structurally weakened until this lands.** The progression engine is gated on a Bayesian posterior over a same-`drill-variant` + same-`success-rule` window. Layer-1 of the bias correction is the criterion-tied per-rep prompt. With the prompt absent on the active capture surface, every count we collect during the founder-use window (`D130`, 2026-04-20 → 2026-07-20) is collected without the bias-correction scaffolding the eventual M001-build engine assumes. Cheaper to land the prompt now than to retroactively flag founder-window data as collected outside the rule.
2. **The 2026-05-21 `D130` Condition 3 final read-out depends on partner-tester returns being interpretable.** A partner tester running a serving session who sees `% good pass rate` reads it as a copy bug at best and as evidence the app doesn't know what skill they're doing at worst. The label is a small surface defect that disproportionately affects partner-walkthrough trust on non-passing drills.
3. **Catalog growth made the gap structural.** Pre-2026-04-27, the catalog was passing-dominated; the hard-coded passing label was a defensible local optimum. Post the Tier 1b drill-authoring + solo-vs-pair sweep, count-bearing serving and setting drills are first-class. The fix has to be structural (read from the drill record) because the catalog will keep growing.

## Gate status

- **Authoring-budget cap status** (per `docs/plans/2026-04-20-m001-adversarial-memo.md` §5): this plan authors **zero new drill records**. The cap is unchanged.
- **Tier 1b founder-session trigger** (per `docs/plans/2026-04-20-m001-tier1-implementation.md`): **NOT required**. This is a spec-gap fix, not a Tier 1b drill or feature. The `P2-3` trigger fired 2026-04-26 and is independent of this work.
- `**D130` Condition 3 status**: provisional pass (Seb T+1-day open 2026-04-22); final read-out 2026-05-21. This plan strengthens the read by ensuring partner returns on non-passing drills are not contaminated by a copy defect.
- **Schema status**: zero Dexie migrations. Zero new fields on `SessionReview` or `PerDrillCapture`. Zero new types.

## Items to ship

### Item 1 — `PerDrillCapture` renders the per-drill success rule with anti-generosity nudge

**Surface:** `app/src/components/PerDrillCapture.tsx`

**What changes:**

- New optional prop: `successRuleDescription?: string`. When present and `showCounts === true`, render a single paragraph above the `PassMetricInput`:
  ```
  Success rule: <successRuleDescription>. If unsure, don't count it as Good.
  ```
  Voice and structure mirror the existing `ReviewScreen` legacy fallback path (lines 611–617) so the prompt reads as one rule across the codebase. The "Success rule:" scaffold and the anti-generosity clause are bold; the rule itself is body weight.
- Position: inside the collapsed `Add counts` body (when `countsOpen === true`), above the `PassMetricInput`. Rendering it inside the collapse keeps the surface calm for the chip-only path (which is the dominant flow), and only shows the criterion when the user has actively opted into counts — when the prompt becomes load-bearing.
- Render guard: when `successRuleDescription` is `undefined` or empty, the criterion paragraph is omitted entirely (defensive; the wire-up always passes a value for count-eligible drills, but the prop is optional so unit tests stay decoupled from the catalog).
- Test surface (paste into `app/src/components/__tests__/PerDrillCapture.test.tsx`):
  - When `showCounts={true}` and the user expands `Add counts`, the success rule and the anti-generosity nudge are both visible.
  - When `successRuleDescription` is omitted, the prompt is not rendered (existing tests stay green).
  - When `showCounts={false}`, the prompt is not rendered regardless of `successRuleDescription`.

### Item 2 — `PassMetricInput` rate label becomes skill-neutral

**Surface:** `app/src/components/PassMetricInput.tsx`

**What changes:**

- Line 71: `{rate}% good pass rate` → `{rate}% good`. The criterion is now visible above the input on the active path; the rate line carries no skill claim.
- Test surface (`app/src/components/__tests__/PassMetricInput.test.tsx`): three existing assertions look for `0% good pass rate` / `60% good pass rate`. Update to `0% good` / `60% good`.
- The legacy `ReviewScreen` fallback path that hard-codes the passing rule above `PassMetricInput` (line 611–617) is **out of scope**. That branch is reached only by non-`D133` legacy sessions and the count-bearing drills that surface there are passing-only by definition. Changing it would expand scope without affecting the active path.

### Item 3 — `d33 Around the World Serving` description reads as a per-attempt rule

**Surface:** `app/src/data/drills.ts`

**What changes:**

- `d33-solo-net.successMetric.description` and `d33-pair.successMetric.description`:
  - **Before:** `Serves landing in the named 6-zone serving grid: front-left, front-middle, front-right, back-left, back-middle, back-right.`
  - **After:** `Serve lands in the called zone.`
- The session-level "all 6 zones in order" goal stays in `target` (`Hit all 6 zones once` / `Both partners hit all 6 zones`) and in `courtsideInstructions` where the zone list belongs. The per-attempt rule is what the count-bearing capture surface needs.
- No other drills change in this plan. The other count-bearing drills (`d31`, `d23`, `d11`, `d09`, `d38-solo`, `d39`, `d40`, `d42`) already have per-attempt descriptions. A future plan can sweep each for clarity if walkthrough evidence flags them.

### Item 4 — Wire the rule from drill record into `DrillCheckScreen`

**Surface:** `app/src/screens/DrillCheckScreen.tsx` + `app/src/domain/drillMetadata.ts`

**What changes:**

- New helper in `app/src/domain/drillMetadata.ts`: `getBlockSuccessRule(block, playerCount)` returns the variant's `successMetric.description` using the same variant-resolution rule as `getBlockMetricType` (prefer the variant whose `participants.min..max` brackets the player count; fall back to the first variant). Returns `null` for unknown drills.
- `DrillCheckScreen.tsx` resolves `captureSuccessRule = getBlockSuccessRule(captureTarget, playerCount)` alongside the existing `captureMetricType` resolution and passes it into `<PerDrillCapture successRuleDescription={captureSuccessRule ?? undefined} ... />`.
- The wire-up only fires when `captureTarget` is non-null (the existing bypass effect on `/run/check` already redirects on null targets), so the criterion always has a drill to source from when it renders.
- Test surface: a new test in `app/src/domain/__tests__/drillMetadata.test.ts` (creating the file if it doesn't exist) covering the helper at the same grain as `getBlockMetricType`.

### Item 5 — Spec sync

**Surface:** `docs/specs/m001-review-micro-spec.md` line 78

**What changes:**

- Replace `the review surface must present this as a forced-criterion prompt with an explicit anti-generosity nudge: show the one-sentence success rule for that drill, ...`
- with `the drill check surface (post-D133) must present this as a forced-criterion prompt with an explicit anti-generosity nudge: show the one-sentence success rule for that drill (sourced from variant.successMetric.description, not hard-coded passing copy), ...`
- Keep the V0B-28 reference and the 2026-04-19 phantom-button history note unchanged.
- Optionally, append a short paragraph below the `Per-drill capture at Drill Check (D133)` section noting that the V0B-28 forced-criterion prompt now lives inside the optional `Add counts` body inside `PerDrillCapture`, so the chip-only fast path stays calm and the prompt only loads when the user has opted into counts.

## Out of scope

- The `ReviewScreen` legacy fallback path (lines 596–626) keeps its hard-coded passing rule. That branch is reached only by non-`D133` legacy sessions and the count-bearing drills that surface there are passing-only. A future plan can re-source it from the drill catalog if walkthrough evidence flags it.
- No skill-aware variants of `PassMetricInput` (e.g., a per-skill rate label like `% good serves`). The criterion paragraph above the input carries the skill claim; the rate label staying generic is the correct factoring.
- No new metric types. `COUNT_BASED_METRIC_TYPES` (`pass-rate-good`, `reps-successful`) stays exactly as-is. Excluding `d33` was rejected on first review as a metric-shape decision driven by surface-level confusion, not by the underlying mechanic (per-attempt: did the serve land in the called zone — a clean Good/Total ratio).
- No re-naming of `PassMetricInput` to `GoodMetricInput` in this plan. The component name still leans pass-specific in semantics, but the rename is a separate refactor pass and would touch every test file that imports it. Leave for a later cleanup.
- No e2e tests update beyond what the existing copy-guard suite catches. The unit-test layer carries the contract change.

## Implementation order

1. Plan doc lands (this file).
2. `getBlockSuccessRule` helper + unit test.
3. `PerDrillCapture` prop + render + tests.
4. `PassMetricInput` rate label + test update.
5. `DrillCheckScreen` wire-up.
6. `d33` `successMetric.description` re-word.
7. Spec line 78 sync.
8. Verification: `npm test`, `npm run typecheck`, `npm run lint`.
9. `AGENTS.md` Current State + Learned Workspace Facts entry.

## Verification commands

- `npm test --prefix app` — unit suite, including new criterion-prompt assertions.
- `npm run typecheck --prefix app` — confirm the new optional prop and the new helper compile.
- `npm run lint --prefix app` — catch any unused-import or rule-style regressions.
- Manual smoke (Windows Cursor running WSL): launch dev server, run a 25-min session with a `d31` block, expand `Add counts` on `/run/check`, confirm the criterion line reads `Success rule: Serves or serve-toss contacts landing in or near a marked target circle. If unsure, don't count it as Good.` and the rate line below the inputs reads `% good`.

## Escalation triggers

- If the criterion paragraph pushes the `Add counts` body past the fold on a 390 px viewport, fall back to a smaller variant (e.g., the rule on its own line, the anti-generosity nudge inline below). The visual fix is a follow-on; functional landing first.
- If a future drill carries a description that does not parse as a per-attempt rule (current `d09-pair` "Complete laps without losing control." is borderline but not flagged this pass), open a per-drill rewrite plan rather than re-engineering the prompt to handle session-level descriptions.

## Terminal state

`done` when:

- Unit tests for `PerDrillCapture`, `PassMetricInput`, and `drillMetadata` all pass with the new assertions.
- `DrillCheckScreen` resolves and passes the success rule for every count-eligible drill in `DRILLS`.
- Spec line 78 reads "drill check surface" with the source-from-record clause.
- `AGENTS.md` Current State + Learned Workspace Facts mention the V0B-28 surface-move fix.

## As-built notes (2026-04-28)

Shipped as part of the 2026-04-28 architecture pass (U2 capture-domain consolidation, `11fed34` "consolidate capture domain + add metric-type strategy registry"). All five items landed:

- **Item 1 — success-rule render**: `app/src/components/PerDrillCapture.tsx` now takes an optional `successRuleDescription` prop, renders the rule + anti-generosity nudge inside the expanded `Add counts` body (`data-testid="per-drill-success-rule"`), and omits when undefined or while the counts surface is collapsed. Pinned by `app/src/components/__tests__/PerDrillCapture.test.tsx` (4 cases under `describe('V0B-28 forced-criterion prompt', ...)`).
- **Item 2 — rate label**: `app/src/components/PassMetricInput.tsx` line 82 reads `{rate}% good`. Three test assertions in `app/src/components/__tests__/PassMetricInput.test.tsx` updated to match.
- **Item 3 — d33 description**: `app/src/data/drills.ts` `d33-solo-net.successMetric.description` and `d33-pair.successMetric.description` both read `Serve lands in the called zone.`. The session-level "all 6 zones" goal stays in `target` and `courtsideInstructions`. Authoring comments at lines 1561 and 1607 cite `docs/plans/2026-04-27-per-drill-success-criterion.md`.
- **Item 4 — wire-up**: `getBlockSuccessRule(block, playerCount)` in `app/src/domain/drillMetadata.ts` mirrors the variant-resolution rule of `getBlockMetricType`. The eligibility resolver in `app/src/domain/capture/eligibility.ts` now returns `successRule` on both `eligible_counts` and `eligible_difficulty_only` branches, sourced from `getBlockSuccessRule`. `useDrillCheckController` exposes it as `captureSuccessRule`, and `DrillCheckScreen.tsx` passes it through as `successRuleDescription={captureSuccessRule ?? undefined}`. Pinned by `app/src/domain/__tests__/drillMetadata.test.ts` (`describe('getBlockSuccessRule', ...)`, 7 cases including the variantId-first red-team adversarial finding).
- **Item 5 — spec sync**: `docs/specs/m001-review-micro-spec.md` `primarySkillMetric` block now reads `the drill check surface (post-D133) must present this as a forced-criterion prompt ... show the one-sentence success rule for that drill sourced from variant.successMetric.description (not hard-coded passing copy)`. The 2026-04-19 phantom-button history note and the V0B-28 reference are preserved; a "Surface-move history (2026-04-27)" addendum names the surface move and points back at this plan.

Verification: 1065/1065 Vitest tests pass; `eslint .` clean; `tsc -b && vite build` clean (chunk-size warning unchanged from before this pass).

