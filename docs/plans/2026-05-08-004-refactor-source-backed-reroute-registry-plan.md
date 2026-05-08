---
title: "refactor: Consolidate source-backed reroute predicates into SourceBackedReroute[] registry"
type: refactor
status: complete
date: 2026-05-08
completed: 2026-05-08
---

# refactor: Consolidate source-backed reroute predicates into SourceBackedReroute[] registry

## Summary

Replace the three near-identical `shouldPreferAdvancedSettingDurationFit`, `shouldPreferAdvancedPassingDurationFit`, `shouldPreferBeginnerServingDurationFit` helpers (and the inline `d01` over-cap check) in `app/src/domain/sessionBuilder.ts` with a single declarative `SourceBackedReroute[]` registry plus a small registry-driven predicate. This is the A1 follow-up cataloged in `docs/ideation/2026-05-04-bab-complete-plan-builder-ideation.md` and explicitly deferred from `docs/plans/2026-05-08-001-refactor-m001-o24-decision-spine-plan.md`. Internal refactor only — no schema change, no UI change, no algorithm-version bump, no user-visible behavior change.

## Assumptions

*This plan was authored in non-interactive LFG mode. The items below are agent inferences that fill gaps in the input and should be scrutinized by review before implementation proceeds.*

- The registry's home is a new `app/src/domain/sessionAssembly/sourceBackedReroutes.ts` module (mirrors the existing `sessionAssembly/` peer pattern: `candidates.ts`, `durations.ts`, `substitution.ts`, `swapAlternatives.ts`). Keeping it inline in `sessionBuilder.ts` would defeat the "shrink sessionBuilder.ts surface" goal.
- The inline `d01` over-cap reroute trigger becomes a registry entry alongside the three source-backed ones (per the ideation A1 wording "the three near-identical predicates plus the inline D01 reroute become entries in a single registry table").
- The registry runtime predicate keeps the existing defensive `slot.type === 'main_skill'` and `!candidateCanCarryTargetDuration(...)` gates so behavior is exactly preserved.
- The registry's destination drill ids (`d49` / `d50` / `d51`, plus an empty list for `d01` whose reroute lets `pickForSlot` re-choose without a fixed target) are stored as **metadata** for traceability, not as runtime targeting. Runtime continues to call `pickForSlot(..., { preferTargetDurationFit: true })` exactly as today; the candidate pool + duration-fit preference still own destination selection.
- All current registry entries are `main_skill`-only; the registry shape accepts an optional slot-type narrowing for forward compatibility but defaults to `'main_skill'`. No existing call site changes its slot scope.
- The existing `sessionBuilder.test.ts` reroute coverage (D01 / D49 / D50 / D51 + focus and main-skill-only negative gates) is the load-bearing contract guard. New direct unit tests on the registry module are additive, not replacement.
- No documentation-routing surface (`docs/catalog.json`, `docs/status/current-state.md`, milestone) needs to update for this internal code refactor unless the patterns doc (`docs/solutions/2026-05-04-source-backed-content-depth-activation-pattern.md`) calls out an outdated file/line reference; if so, the references get refreshed in the same pass.

## Requirements

- R1. Replace the three `shouldPrefer*DurationFit` helpers and the inline `d01` over-cap branch in `app/src/domain/sessionBuilder.ts` with a single registry-driven predicate so the file stops growing a new helper per source-backed activation.
- R2. The registry is a module-level `readonly SourceBackedReroute[]` constant with one entry per current trigger (`d01` duration-fit, `d47/d48 → d49`, `d46 → d50`, `d31 → d51`); each entry records `id`, optional `sessionFocus`, optional `playerLevel`, `fromDrillIds`, and metadata `destinationDrillIds`.
- R3. Runtime behavior is byte-equivalent to the current implementation: the same set of `(slot, context, selected, plannedDurationMinutes)` inputs that triggered a reroute before still trigger one, and the same set that did not still does not.
- R4. The existing `sessionBuilder.test.ts` reroute-related cases pass without modification, and `npm run test`, `npm run lint`, and `npm run build` are all clean.
- R5. The registry module ships with focused unit tests covering each registry entry's gate (focus / level / fromDrillId / capacity short-circuit) and the negative gates currently asserted only at the integration tier.
- R6. Adding a fifth source-backed reroute (the canonical near-future Tier 3+ extension) requires only one entry in the registry and zero changes to the predicate function or to `sessionBuilder.ts`.
- R7. Patterns doc `docs/solutions/2026-05-04-source-backed-content-depth-activation-pattern.md` is updated only if its concrete code references (file/line/symbol pointers to `shouldPrefer*DurationFit` and the inline drill-id sets) drift from reality after the refactor; the conceptual workflow is unchanged.
- R8. Algorithm version (`SESSION_ASSEMBLY_ALGORITHM_VERSION`) does NOT bump — this refactor preserves selection identity for all existing seeds, so golden snapshots stay green.

## Scope Boundaries

- Do not change selection-path behavior, candidate filtering, duration semantics, fatigue caps, or any algorithm-version-affecting logic.
- Do not bump `SESSION_ASSEMBLY_ALGORITHM_VERSION` or touch any golden snapshot expectations.
- Do not extend the registry to non-`main_skill` slot types in this pass.
- Do not introduce a "destination drill id" runtime-targeting mechanism (the current `pickForSlot(..., preferTargetDurationFit: true)` flow stays the destination chooser).
- Do not move the `if (drill.id === 'd49'/'d50'/'d51' && slot.type !== 'main_skill') continue` guards out of `app/src/domain/sessionAssembly/candidates.ts` — those are about catalog filtering, not duration-fit reroute, and consolidating them is a separate concern.
- Do not update `docs/catalog.json` unless a separate canonical doc is created or moved; this plan stays under `docs/plans/`.
- Do not touch `docs/status/current-state.md` unless the refactor lands ship-worthy enough to merit a one-line shipped-history bullet; treat the entry as optional, not required.

### Deferred to Follow-Up Work

- Extending the registry to other slot types (e.g. `pressure`) waits on a real fifth or sixth source-backed pass that needs it.
- Migrating the `d49`/`d50`/`d51` `slot.type !== 'main_skill'` guards in `candidates.ts` into the same registry would couple two unrelated concerns; if it ever happens it is a separate refactor.
- BAB ideation Bucket B decisions (T9, T6, slot-4 optionality) and Bucket C schema work remain post-D101 / M002 work, unaffected by this refactor.

## Context & Research

### Relevant Code and Patterns

- `app/src/domain/sessionBuilder.ts` lines 30-32 (three drill-id `Set<string>` constants), lines 142-199 (three near-identical predicates), lines 308-344 (the redistribution branch wiring all four trigger checks).
- `app/src/domain/sessionAssembly/candidates.ts` `candidateCanCarryTargetDuration` (the registry predicate's capacity gate) and the `pickForSlot(..., preferTargetDurationFit: true)` reroute primitive.
- `app/src/domain/sessionAssembly/substitution.ts` is the precedent pattern for per-feature registries co-located in `sessionAssembly/`: a `SUBSTITUTION_RULE`-style module exists for build-time main-skill substitution. Mirror that home, naming convention, and barrel hygiene (no public re-export from `sessionBuilder.ts` unless something already imports the helpers from there).
- `app/src/domain/sessionBuilder.test.ts` lines ~76-595 are the integration contract: D01, D49, D50, D51 happy-path reroutes, plus `does not reroute advanced setting sessions to D50 (focus gate)`, `does not include D50 in non-main-skill candidate pools`, the equivalent D51 negative gates, and `does not apply target-duration preference to non-main slots`. These all keep passing post-refactor.
- `app/src/data/__tests__/catalogValidation.test.ts` `D49 source-backed activation` / `D50 source-backed activation` / `D51 source-backed activation` describe blocks — unrelated to this refactor; they validate catalog shape and stay untouched.

### Institutional Learnings

- `docs/solutions/2026-05-04-source-backed-content-depth-activation-pattern.md` documents the three-application precedent and explicitly names the predicate-helper duplication as part of the load-bearing pattern. The refactor reduces drift surface for the fourth application without contradicting the doc; only the concrete-code references inside the doc may need a light refresh once the helpers move into a registry module.
- `docs/ideation/2026-05-04-bab-complete-plan-builder-ideation.md` `A1` is the originating recommendation (architecture-strategist explicit, Frame 1 #6, Frame 2 #6). Bottom line from that ideation: "Cost / risk: internal refactor with full test coverage; no schema change; no user-visible behavior change."
- `docs/research/practice-plan-authoring-synthesis.md` Bucket A names A1 first among now-shippable items.
- The recently shipped `docs/plans/2026-05-08-001-refactor-m001-o24-decision-spine-plan.md` deferred this work explicitly under "Deferred to Follow-Up Work — A1 source-backed reroute registry refactor remains a separate code refactor."

### External References

- None. The refactor is a closed-system internal cleanup grounded in repo-local canon; no external research is needed.

## Key Technical Decisions

- **Registry shape is a flat `readonly SourceBackedReroute[]`** rather than a `Map`-keyed structure. Four entries today, plausibly six or seven over the next year — linear scan is cheap and keeps the registry trivially readable for review.
- **`fromDrillIds: ReadonlySet<string>`** keeps the existing constant-set semantics (`new Set(['d47', 'd48'])`) while letting an entry list multiple sibling source drills (D49 covers two source drills today; D50 and D51 cover one each).
- **`destinationDrillIds: readonly string[]` is metadata only**, not runtime targeting. Runtime stays "call `pickForSlot` with `preferTargetDurationFit: true`" exactly as today. This matches the ideation A1 description (table indexed by `(focus × level × duration × from-drill-id × to-drill-id)`) without coupling the destination pick to the trigger.
- **Slot-type narrowing is implicit at `'main_skill'` for now.** All four current triggers fire only for the main-skill redistribution branch. The registry shape accepts an optional `slotType` field defaulted to `'main_skill'` so adding a non-main-skill entry later is a one-field change with no predicate-function rewrite — but no entry uses anything else today.
- **The new module exposes two surfaces:** the `SOURCE_BACKED_REROUTES` constant array and a single `shouldRerouteForSourceBackedSibling(slot, context, selected, plannedDurationMinutes): boolean` function. `sessionBuilder.ts` imports only the function; the constant is exported for direct unit testing and for documentation grep.
- **No barrel re-export from `sessionBuilder.ts`** of the new helpers — they are an internal implementation detail of the build pipeline. Test imports go directly to `sessionAssembly/sourceBackedReroutes.ts`.

## Open Questions

### Resolved During Planning

- Should the registry runtime-target the destination drill (D49/D50/D51) instead of relying on `pickForSlot`'s capacity preference? **No.** The current "let `pickForSlot` decide via `preferTargetDurationFit`" pattern is what keeps the registry small and keeps adding a fifth entry to one line. Hard-coding destinations would require duplicating candidate-filter logic.
- Should the inline `d01` reroute be folded into the registry, or stay inline? **Folded in.** The ideation explicitly says "plus the inline D01 reroute become entries"; treating it as a registry entry with no `sessionFocus` / no `playerLevel` and `fromDrillIds: new Set(['d01'])` makes the registry the single source of truth for "main-skill drill X cannot carry the planned duration → reroute".
- Should this bump `SESSION_ASSEMBLY_ALGORITHM_VERSION`? **No.** The refactor preserves the exact set of trigger conditions; selection identity for any given seed is unchanged.

### Deferred to Implementation

- Exact in-file ordering of registry entries (chronological by ship date vs. focus-grouped). Decide during implementation; either is fine.
- Whether the new module exports `SourceBackedReroute` as a public type or keeps it module-internal. Default: module-internal until a second consumer needs it.

## Implementation Units

- U1. **Add `sessionAssembly/sourceBackedReroutes.ts` registry + predicate (test-first)**

**Goal:** Introduce a new `app/src/domain/sessionAssembly/sourceBackedReroutes.ts` module that owns the four current reroute triggers as data plus a single predicate function. Verify the predicate matches the existing trigger semantics by exhaustive direct unit testing before any call site changes.

**Requirements:** R2, R3, R5, R6

**Dependencies:** None

**Files:**
- Create: `app/src/domain/sessionAssembly/sourceBackedReroutes.ts`
- Create: `app/src/domain/sessionAssembly/__tests__/sourceBackedReroutes.test.ts`

**Approach:**
- Define a module-internal `SourceBackedReroute` interface with: `id` (stable string for trace/diagnostics, e.g. `'d01-duration-fit'`, `'d47-d48-to-d49'`, `'d46-to-d50'`, `'d31-to-d51'`), optional `description`, `fromDrillIds: ReadonlySet<string>`, `destinationDrillIds: readonly string[]`, optional `sessionFocus: Extract<SkillFocus, 'pass' | 'serve' | 'set'>`, optional `playerLevel: PlayerLevel`, optional `slotType: BlockSlotType` (default conceptually `'main_skill'`).
- Author `SOURCE_BACKED_REROUTES: readonly SourceBackedReroute[]` with the four current entries. Carry forward each existing JSDoc comment from `sessionBuilder.ts` onto the corresponding entry so the rationale (D47/D48 over-cap; D46 spin-read 8-min envelope; D31 BAB Self-Toss; D01 default-leaf duration-fit) does not drop on the floor.
- Author `shouldRerouteForSourceBackedSibling(slot, context, selected, plannedDurationMinutes): boolean`. Defensive gates: return `false` immediately if `slot.type !== 'main_skill'` or `candidateCanCarryTargetDuration(selected, plannedDurationMinutes)` is true. Then `SOURCE_BACKED_REROUTES.some(...)` with field-by-field checks: skip entry if `entry.sessionFocus !== undefined && context.sessionFocus !== entry.sessionFocus`; skip entry if `entry.playerLevel !== undefined && context.playerLevel !== entry.playerLevel`; otherwise return `entry.fromDrillIds.has(selected.drill.id)`.

**Patterns to follow:**
- Co-location and naming match `app/src/domain/sessionAssembly/substitution.ts` (`SUBSTITUTION_RULES` + `pickMainSkillSubstitute`) — registry constant + single public function.
- Tests live at `app/src/domain/sessionAssembly/__tests__/<module>.test.ts` per the testing rule's "Test location" section.
- Keep imports inward-only per the data-access rule (`model`, `sessionAssembly/candidates` allowed; nothing from `db/`, `services/`, `react`, `platform/`).

**Test scenarios:**
- Happy path — D01 trigger: `slot.type='main_skill'`, `selected.drill.id='d01'`, capacity 5min, `plannedDurationMinutes=8` -> `true`. No `sessionFocus`/`playerLevel` constraint applies because the entry is unrestricted.
- Happy path — D49 trigger: `playerLevel='advanced'`, `sessionFocus='set'`, `selected.drill.id='d47'`, capacity 5, planned 12 -> `true`.
- Happy path — D49 trigger second source: same as above with `selected.drill.id='d48'` -> `true`.
- Happy path — D50 trigger: `playerLevel='advanced'`, `sessionFocus='pass'`, `selected.drill.id='d46'`, capacity 5, planned 12 -> `true`.
- Happy path — D51 trigger: `playerLevel='beginner'`, `sessionFocus='serve'`, `selected.drill.id='d31'`, capacity 5, planned 12 -> `true`.
- Edge case — duration fits: any registered fromDrillId with `candidateCanCarryTargetDuration(...)` returning true short-circuits the predicate to `false` even if focus/level match.
- Edge case — non-main-skill slot: `slot.type='technique'` with otherwise-matching `selected.drill.id='d47'` and matching context returns `false`.
- Error path / focus gate: D49 trigger inputs but `sessionFocus='pass'` instead of `'set'` returns `false`. Repeat for D50 with `sessionFocus='set'` and D51 with `sessionFocus='pass'`.
- Error path / level gate: D49 trigger inputs but `playerLevel='intermediate'` returns `false`. Repeat for D51 with `playerLevel='advanced'`.
- Edge case — unrelated drill: D02 selected, otherwise-matching context, returns `false` (no registry entry covers `d02`).
- Registry data integrity: every entry's `id` is unique; every entry's `fromDrillIds` is non-empty; every entry's `destinationDrillIds` lists at least one drill id (D01 may legitimately list zero — assert that case explicitly so future readers know the empty list is intentional, not an oversight).

**Verification:**
- `npm run test -- src/domain/sessionAssembly/__tests__/sourceBackedReroutes.test.ts` passes.
- `npm run lint` is clean for the new file.
- The four existing trigger conditions in `sessionBuilder.ts` still compile and run unchanged (this unit does NOT yet replace them).

- U2. **Replace inline predicates in `sessionBuilder.ts` with the registry call**

**Goal:** Delete the three `shouldPrefer*DurationFit` helpers, the three drill-id `Set<string>` constants, and the inline `shouldRerouteD01` check in `app/src/domain/sessionBuilder.ts`, replacing all four with one call to `shouldRerouteForSourceBackedSibling(...)` inside the redistribution branch. Keep the same downstream `pickForSlot(..., preferTargetDurationFit: true)` reroute action.

**Requirements:** R1, R3, R4, R7, R8

**Dependencies:** U1

**Files:**
- Modify: `app/src/domain/sessionBuilder.ts`
- Modify: `docs/solutions/2026-05-04-source-backed-content-depth-activation-pattern.md` only if file/line/symbol references to `shouldPrefer*DurationFit` or `ADVANCED_*_DURATION_FIT_DRILL_IDS` exist in prose and drift after the refactor

**Approach:**
- Remove `ADVANCED_SETTING_DURATION_FIT_DRILL_IDS`, `ADVANCED_PASSING_DURATION_FIT_DRILL_IDS`, `BEGINNER_SERVING_DURATION_FIT_DRILL_IDS`, `shouldPreferAdvancedSettingDurationFit`, `shouldPreferAdvancedPassingDurationFit`, `shouldPreferBeginnerServingDurationFit`.
- In the redistribution branch (`if (slot.type === 'main_skill' && selected) { ... }`), collapse the four `shouldRerouteX` locals + the four-way `||` into a single boolean from `shouldRerouteForSourceBackedSibling(slot, effectiveContext, selected.pick, plannedDurationMinutes)`. Keep the existing reroute action exactly as today.
- Confirm via `git grep` that no other file imports the removed helpers or the removed constants. They are not exported, so no public-API change is expected — verify anyway.
- Re-skim `docs/solutions/2026-05-04-source-backed-content-depth-activation-pattern.md` and refresh any concrete file/line references that point at the old helper symbols (the solutions doc currently cites `app/src/domain/sessionBuilder.ts` `shouldPreferAdvanced*DurationFit` and the constant-set names in the cross-reference table). Update those pointers to name the new registry module + entry ids; do not rewrite the conceptual workflow.

**Patterns to follow:**
- Match the exact existing reroute-call-site shape: `if (...) { const rerouted = pickForSlot(...) ; if (rerouted) selectedByLayoutIndex.set(...) }`. The only diff is which boolean the `if` reads.
- Preserve the existing comments above the redistribution branch that explain the D01 / D49 / D50 / D51 reroute story; relocate the ones that explain individual triggers onto their corresponding registry entries in `sourceBackedReroutes.ts`.

**Test scenarios:**
- All existing `app/src/domain/sessionBuilder.test.ts` reroute cases continue to pass without modification: `prefers a duration-fit main-skill candidate over D01 for longer allocations`, the four `prefers Dxx for over-cap ... main-skill allocations` cases, the three `reroutes redistributed ...` cases, the focus-gate negative case (`does not reroute advanced setting sessions to D50`), and the main-skill-only negative cases (`does not include D50 in non-main-skill candidate pools`, `does not include D51 in non-main-skill candidate pools`).
- The pinned golden seed test (`pins fixed-seed session assembly output while algorithm version stays stable`) continues to assert `assemblyAlgorithmVersion: 6` with the same per-block expectations — this is the load-bearing "no behavior drift" assertion.
- Test expectation: no new tests in `sessionBuilder.test.ts`; behavior is fully covered there already and U1 carries the registry-direct unit tests.

**Verification:**
- `npm run test` passes.
- `npm run lint` passes.
- `npm run build` passes.
- `git grep -nE "shouldPreferAdvancedSettingDurationFit|shouldPreferAdvancedPassingDurationFit|shouldPreferBeginnerServingDurationFit|ADVANCED_SETTING_DURATION_FIT_DRILL_IDS|ADVANCED_PASSING_DURATION_FIT_DRILL_IDS|BEGINNER_SERVING_DURATION_FIT_DRILL_IDS"` returns no matches.
- `bash scripts/validate-agent-docs.sh` is green if any docs were touched in the same pass.

## System-Wide Impact

- **Interaction graph:** Internal refactor inside the build pipeline. `sessionBuilder.ts` -> new `sessionAssembly/sourceBackedReroutes.ts` -> existing `sessionAssembly/candidates.ts` (`candidateCanCarryTargetDuration`). No new outward-facing API.
- **Error propagation:** None. The predicate is a pure boolean with the same defensive shape as the helpers it replaces.
- **State lifecycle risks:** None. No persistence change, no migration, no schema impact.
- **API surface parity:** No exported API is added or removed from `sessionBuilder.ts`. The registry module's exports (`shouldRerouteForSourceBackedSibling`, `SOURCE_BACKED_REROUTES`) are new but module-internal to the build pipeline; no downstream import path needs to change.
- **Integration coverage:** Existing `sessionBuilder.test.ts` integration tests cover every reroute condition end-to-end and stay green by construction. The new direct-unit tests at the registry tier are additive — they prove the registry fields encode the right gates without depending on `pickForSlot` being correct.
- **Unchanged invariants:** `SESSION_ASSEMBLY_ALGORITHM_VERSION` stays at 6. Selection identity for any given seed is unchanged. `app/src/domain/sessionAssembly/candidates.ts` `d49`/`d50`/`d51` `slot.type !== 'main_skill'` filter behavior is untouched. The `pickForSlot(..., preferTargetDurationFit: true)` reroute action is untouched. The four current trigger conditions and only those four still fire reroutes.

## Risks & Dependencies

| Risk | Mitigation |
|------|------------|
| Refactor accidentally drops one of the four current triggers (e.g., the `playerLevel === 'beginner'` gate on D51 silently becomes `'advanced'`) | The `sessionBuilder.test.ts` happy-path + focus-gate + level-gate + main-skill-only assertions are the load-bearing contract. They run before the U2 commit lands; any drift fails them. U1 unit tests provide a finer-grained second tripwire on each gate independently. |
| Fixed-seed snapshot test fails because shuffle ordering shifts | The refactor does not change candidate ordering, the random source, or the `usedDrillIds` insertion order. The pinned golden test (`assemblyAlgorithmVersion: 6` with full per-block expectation list) catches any drift up front; if it fires, the refactor is wrong, not the snapshot. |
| The patterns doc `docs/solutions/2026-05-04-source-backed-content-depth-activation-pattern.md` ends up pointing at deleted symbols | U2 explicitly re-skims that doc and updates concrete file/line/symbol references. |
| Future extension adds a non-main-skill registry entry without realizing the predicate hard-codes `slot.type === 'main_skill'` | The predicate's defensive gate explicitly checks slot type; the registry shape allows an optional `slotType` field. The first non-main-skill entry has to update both surfaces in one pass — and the `sessionAssembly/sourceBackedReroutes.test.ts` registry-data-integrity test calls this out so the boundary stays visible. |

## Documentation / Operational Notes

- No deploy, migration, monitoring, or rollout step is required. The change is internal to the deployed Worker bundle and has no schema or storage impact.
- No `docs/catalog.json` entry is required for this plan unless future canonicalization of the plan file changes (it stays under `docs/plans/`).
- Optional: a one-line entry in `docs/status/current-state.md` recent shipped history once the work lands. Treat as nice-to-have, not blocking.

## Sources & References

- Originating ideation: `docs/ideation/2026-05-04-bab-complete-plan-builder-ideation.md` (A1 entry, lines 86-102).
- Synthesis Bucket A naming: `docs/research/practice-plan-authoring-synthesis.md` (Bucket A, A1 first).
- Pattern doc that documents the three-application precedent and names the load-bearing predicate-helper duplication: `docs/solutions/2026-05-04-source-backed-content-depth-activation-pattern.md`.
- Predecessor plan that explicitly deferred this refactor: `docs/plans/2026-05-08-001-refactor-m001-o24-decision-spine-plan.md` (Deferred to Follow-Up Work — A1).
- Implementation surface: `app/src/domain/sessionBuilder.ts` (lines 30-32 constants, 142-199 predicates, 308-344 redistribution wiring).
- Contract guard: `app/src/domain/sessionBuilder.test.ts` (lines ~76-595 reroute coverage; line ~34 pinned-snapshot algorithm-version assertion).
- Co-location precedent: `app/src/domain/sessionAssembly/substitution.ts` (`SUBSTITUTION_RULES` registry + `pickMainSkillSubstitute`).
