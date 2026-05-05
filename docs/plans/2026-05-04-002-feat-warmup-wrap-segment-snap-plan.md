---
title: "feat: Snap warmup/wrap blocks to drill segment sum with focus-aware redistribution"
type: feat
status: active
date: 2026-05-04
---

# Snap warmup/wrap blocks to drill segment sum with focus-aware redistribution

## Summary

After session assembly picks a warmup or wrap variant, snap that block's duration down to the variant's natural segment sum (i.e., `workload.durationMinMinutes`) and redistribute the freed minutes into focus-aligned work slots. Eliminates the dead-time gap between planned block timer and authored segments without introducing two-truths IA, runtime up-scaling, or session-total drift.

---

## Problem Frame

`buildDraft` allocates block durations from the archetype layout via `allocateDurations`, then independently picks a drill variant per slot. For warmup/wrap slots, the chosen variant's authored `segments` may sum to fewer minutes than the slot was allocated — concretely, on a Pair + Net 40-min session the allocator promotes warmup and wrap to 5 min each, while `d28-solo` carries 3 min of segments and `d25-solo` carries 4 min. The runner only scales segments down, never up, so the block timer continues past segment exhaustion. Field session 2026-05-04 (`docs/research/2026-05-04-pair-serving-session-feedback.md` F6) recorded the symptom: warmup ran ~3:07 and wrap ran ~4:16 against 5-min planned blocks; user repeatedly reported "warmup/cooldown timing felt off."

A design+product red-team (recorded earlier in this session) ruled out the original "timer = scaled segment sum" rule for IA/Shorten/snap-drift reasons. The refined approach captured here moves the snap into assembly time, before the runner is involved, and routes freed minutes into work blocks rather than letting them disappear.

---

## Requirements

- R1. After variant selection in `buildDraft`, warmup and wrap blocks whose chosen variant has authored `segments` are persisted with `durationMinutes = variant.workload.durationMinMinutes` (the catalog-validated segment-sum-minutes).
- R2. Minutes freed by R1 redistribute into the same draft's other slots in focus-aware priority order, capped at each target slot's authored `durationMaxMinutes`.
- R3. When `context.sessionFocus` is set, redistribution prioritizes focus-aligned slot types: `serve` → `main_skill`, `pressure`, `technique`, `movement_proxy`. `pass` and `set` → `main_skill`, `technique`, `movement_proxy`, `pressure`.
- R4. When `context.sessionFocus` is undefined, redistribution falls back to the existing `allocateDurations` priority (`main_skill`, `technique`, `movement_proxy`, `pressure`).
- R5. If all redistributable slots reach their `durationMaxMinutes` before all freed minutes are placed, the session total may be shorter than `context.timeProfile`. Warmup/wrap durations are not re-inflated to absorb leftover minutes; the snap is canonical.
- R6. Variants without authored `segments` and warmup/wrap variants whose natural sum already equals the allocated slot duration produce no change. The snap is a no-op for legacy/non-segmented and exact-fit cases.
- R7. `buildRecoveryDraft` applies the same snap rule, but redistribution targets `technique` and `movement_proxy` only (recovery layouts already exclude `main_skill` and `pressure`). Existing 60/40 technique/movement bias is preserved for any leftover redistribution-eligible minutes.
- R8. `findSwapAlternatives` does not change. Mid-session swaps preserve the active block's `durationMinutes` per the existing test contract; the snap fires once at build time, not at swap time.
- R9. `SESSION_ASSEMBLY_ALGORITHM_VERSION` increments from 1 to 2 to reflect the assembly-output behavior change. The pinned `sessionBuilder` golden test updates to the new shape.
- R10. Catalog validation is unchanged. The existing `segment_duration_mismatch` rule continues to enforce `sum(segments) === workload.durationMinMinutes * 60`; no new validation rule is required.

---

## Scope Boundaries

- This plan does NOT change RunScreen, `useRunController`, `scaleSegmentsForBlockDuration`, or `useBlockPacingTicks`. The runner already does the right thing once block duration matches segment sum.
- This plan does NOT change `courtsideInstructionsBonus` content. Bonus copy continues to render only when block exceeds segment sum (Shorten edge cases, future non-snapped variants).
- This plan does NOT add per-variant duration profiles (`d28` at 3:00 vs 4:00 vs 5:00). That structural option remains available for later if a future ledger session shows snap-induced session shortening is too aggressive.
- This plan does NOT add an extra warmup or wrap block slot to any archetype layout. M001 keeps the one-warmup, one-wrap shape.
- This plan does NOT change archetype slot `durationMin/MaxMinutes` envelopes in `app/src/data/archetypes.ts`. `allocateDurations` keeps its existing priority and caps; the snap operates on its output.
- This plan does NOT add a new Dexie schema field, migration, or storage shape. Block durations remain whole minutes on `SessionPlanBlock.durationMinutes`.
- This plan does NOT introduce a UI affordance announcing snap-induced session shortening (e.g., "Session is 39 min instead of 40"). Surfacing the snap to the user is a separate decision deferred to Tier 2 history/M002 once snap behavior is observed in real use.

### Deferred to Follow-Up Work

- Bonus-copy polish for `d25-solo` and `d28-solo`: `courtsideInstructionsBonus` will only render in Shorten or non-segmented edge cases after this plan ships. A separate copy pass can rewrite "Hydrate and note any pain." into a real "what to do for the next minute" cue when those edge cases hit. Not blocked by this plan.
- Per-variant duration profiles (Rule 7 from the red-team): hand-author a 4-min and 5-min `d28` variant with explicit segments for higher craft fidelity. Out of scope until a session shows snap shortens too much.

---

## Context & Research

### Relevant Code and Patterns

- `app/src/domain/sessionBuilder.ts` — `buildDraft` and `buildRecoveryDraft`. Both call `allocateDurations`/`allocateRecoveryDurations`, then loop over the layout, calling `pickForSlot` and writing `durationMinutes: durations[i]` into the block. The new snap+redistribute step inserts between allocation and block writing.
- `app/src/domain/sessionAssembly/durations.ts` — existing `allocateDurations` and `allocateRecoveryDurations`. The `DURATION_PRIORITY` constant is the analog for the new focus-aware redistribution priority.
- `app/src/domain/sessionAssembly/effectiveFocus.ts` — already encodes "focus-controlled slots = `main_skill | pressure`". The redistribution priority leans on the same focus signal.
- `app/src/data/archetypes.ts` — slot `durationMinMinutes` / `durationMaxMinutes` envelopes the snap respects.
- `app/src/data/drills.ts` — `d28-solo` (3 min, 4 segments × 45s), `d25-solo` (4 min, 5 segments), `d26-solo` (3 min, 3 segments). `workload.durationMinMinutes` is the canonical segment sum.
- `app/src/data/catalogValidation.ts` — `segment_duration_mismatch` rule already pins `sum(segments) === workload.durationMinMinutes * 60`.
- `app/src/domain/sessionBuilder.test.ts` — pinned golden test asserts `assemblyAlgorithmVersion: 1` and exact block durations for Pair + Open 25-min. Updates with the version bump.
- `app/src/domain/sessionAssembly/swapAlternatives.ts` — block override duration preserved across swap (`durationMinutes: block.durationMinutes`). No change needed; the snap fires once at build.

### Institutional Learnings

- The 2026-04-28 per-move pacing indicator plan (`docs/plans/2026-04-28-per-move-pacing-indicator.md`) authored `d28-solo`, `d25-solo`, `d26-solo` with `segments` summing to `workload.durationMinMinutes * 60`. The authoring contract is already in place; this plan consumes it.
- The 2026-04-26 architecture pass (`docs/plans/2026-04-26-app-architecture-pass.md`) consolidated assembly into `app/src/domain/sessionAssembly/`. New helpers belong there; do not introduce a parallel module path.
- `D130` founder-use-mode contract: small, evidence-fired moves preferred over architectural overhauls. This plan is one assembler change plus one redistribution helper, not a runtime contract change.

### External References

- Field session evidence: `docs/research/2026-05-04-pair-serving-session-feedback.md` F6 — three plausible axes for "timing felt off" named (planned-block > segment-sum, audio-pacing residual, bonus-copy discoverability). This plan addresses the first axis directly.

---

## Key Technical Decisions

- **Snap target = `variant.workload.durationMinMinutes`**: catalog validation already enforces this equals `sum(segments) / 60`, so segment sum and snap target are interchangeable. Reading from `workload` keeps the snap working even on legacy variants where `segments` is undefined (the snap simply does not fire).
- **Snap trigger = warmup/wrap slot AND variant has authored `segments` AND natural sum < allocated slot duration**: avoids regressing legacy non-segmented warmup/wrap variants. Equal-fit cases short-circuit cleanly with no redistribution.
- **Focus-aware redistribution priority lives in `sessionAssembly/durations.ts`**, not in `effectiveFocus.ts`: the focus filter on `main_skill`/`pressure` is a candidate-pool filter, while redistribution is a duration allocator concern. Different responsibilities; co-locate redistribution with `allocateDurations`.
- **Redistribution caps respect `durationMaxMinutes`**: bumping a 10-min `main_skill` to 11 because warmup snapped feels small but breaks fatigue/load contracts encoded in archetype max envelopes. Keep caps strict; accept session shortening if needed.
- **Recovery snap is bounded to technique/movement_proxy**: recovery already excludes `main_skill`/`pressure` per `RECOVERY_BLOCK_SLOT_TYPES`. Falling back to the same redistribution shape there means recovery sessions also benefit from the snap when a recovery layout has wrap slot wider than `d25/d26` natural sum.
- **`assemblyAlgorithmVersion` bump from 1 to 2**: assembly output changes for any session whose archetype layout would have allocated warmup/wrap above the chosen variant's natural sum. Bumping the version makes "Repeat what you did" honest about which assembler shipped the original session and lets future readers tell pre-snap from post-snap plans.
- **Snap is build-time only, not runtime**: `findSwapAlternatives` and the runner stay unchanged. Mid-session warmup-to-warmup swaps would not normally happen, but the existing test contract that swap preserves `durationMinutes` is honored.

---

## Open Questions

### Resolved During Planning

- *Should the snap allow main_skill to exceed `durationMaxMinutes` by 1?* — Resolved: no. Caps stay strict. Allowing +1 overflow opens a different rule (variable max) that interacts with future per-variant duration profiles.
- *Should snap fire when the chosen variant has no `segments`?* — Resolved: no. Legacy/non-segmented warmup/wrap variants keep allocator-given duration. The snap is gated on `variant.segments?.length > 0`.

### Deferred to Implementation

- Exact placement of the new `snapWarmupWrapDurations` helper: either a new file `app/src/domain/sessionAssembly/snapDurations.ts` or appended to `durations.ts`. Decided during U1 based on file size/cohesion.

---

## Implementation Units

- U1. **Pure helper: `snapWarmupWrapDurations`**

**Goal:** Add a pure function that takes the layout, allocated durations, the picked variant per slot, and the optional `sessionFocus`, and returns adjusted durations plus the redistribution decisions. No I/O, no side effects.

**Requirements:** R1, R2, R3, R4, R5, R6, R10

**Dependencies:** None

**Files:**
- Create or append: `app/src/domain/sessionAssembly/snapDurations.ts` (new file preferred — keeps `durations.ts` focused on initial allocation; final placement decided during implementation per Open Questions)
- Test: `app/src/domain/sessionAssembly/__tests__/snapDurations.test.ts`

**Approach:**
- Signature shape: `snapWarmupWrapDurations(layout, durations, picks, sessionFocus) => number[]` where `picks` is a `Array<CandidateVariant | undefined>` aligned to `layout` indices (mirrors how `buildDraft` already tracks per-slot picks).
- Compute snap candidates: for each layout index where `slot.type` is `warmup` or `wrap`, the picked variant has `segments?.length > 0`, and `variant.workload.durationMinMinutes < durations[i]`, snap durations[i] to `variant.workload.durationMinMinutes`. Track total freed minutes.
- Build redistribution priority array based on `sessionFocus` (one of two orderings; default order when undefined).
- Walk priority array; for each slot type, find layout indices with that type and add 1 minute at a time, capped at `slot.durationMaxMinutes`. Use a round-robin loop similar to `allocateDurations` so multiple same-type slots are filled evenly.
- Return final durations array. If freed minutes remain after all caps hit, return what we have — the session shortens (R5).

**Patterns to follow:**
- Allocation loop pattern in `app/src/domain/sessionAssembly/durations.ts::allocateDurations` (priority-driven, +1 per round, cap-respecting).
- Pure-helper test pattern in `app/src/domain/sessionAssembly/durations.ts` covered by current build draft tests.

**Test scenarios:**
- Happy path: Pair + Net 40-min layout with allocated durations `[5, 6, 6, 10, 8, 5]` (warmup, technique, movement_proxy, main_skill, pressure, wrap), picks of `d28-solo`/d05-pair/d10-pair/d51-pair/d03-pair/`d25-solo`, no `sessionFocus` → returns `[3, 7, 6, 10, 9, 4]`; warmup snaps 5→3, wrap snaps 5→4, freed 3 min, redistribute to technique (6→7, capped) and pressure (8→9, capped), 1 minute leftover dropped (session 39 instead of 40).
- Happy path: same setup with `sessionFocus: 'serve'` → returns `[3, 6, 6, 10, 9, 4]`; freed 3 min, main_skill at cap 10, pressure 8→9 (cap), technique 6 stays (next priority), 2 min leftover dropped (session 37). (NOTE: exact result depends on how many slots can absorb; test pins observable outcome by row.)
- Happy path: same setup with `sessionFocus: 'pass'` → main_skill at cap, technique 6→7 (cap), movement_proxy 6 (cap), pressure 8→9 (cap), 0 leftover after first 3 increments → session 40 preserved.
- Edge case: Solo + Wall 15-min layout `[3, 5, 6, 4]` (warmup, technique, main_skill, wrap), picks of `d28-solo`/...`d25-solo`. Warmup is exactly 3 min (d28 natural sum); no snap fires. Wrap is 4 min, d25 natural sum is 4, no snap. Returns input unchanged.
- Edge case: same layout with d26 picked at wrap (3 min natural, slot allocated 4): wrap snaps 4→3, freed 1 min, redistribute to main_skill 5→6 (cap). Session preserved at 15 min.
- Edge case: variant at warmup has no `segments` (e.g., synthetic test variant): no snap fires. Function returns input unchanged.
- Edge case: empty layout / empty picks → returns input unchanged.
- Error path: variant `workload.durationMinMinutes` exceeds slot `durationMaxMinutes` (synthetic mismatch): snap target clamped to slot max; do not produce a duration above allocated.
- Integration: round-robin redistribution across multiple same-type slots if a future archetype gains two warmup or two wrap slots. Cover with a synthetic two-warmup layout to pin the round-robin behavior even though no archetype uses it today.

**Verification:**
- Unit tests pass with the snap behaving as a pure function over inputs.
- No archetype-specific logic in the helper; all behavior is layout-driven.

---

- U2. **Wire snap into `buildDraft`**

**Goal:** Call `snapWarmupWrapDurations` after slot picks are resolved, before block array population. Use the snapped duration array when writing each block's `durationMinutes`.

**Requirements:** R1, R2, R3, R4, R5, R6, R8

**Dependencies:** U1

**Files:**
- Modify: `app/src/domain/sessionBuilder.ts`
- Test: `app/src/domain/sessionBuilder.test.ts` (extend existing)

**Approach:**
- In `buildDraft`, after the existing main-skill substitution reservation but during the slot loop, accumulate `picks: Array<CandidateVariant | undefined>` aligned to the layout index. (`pickForSlot` results plus the substitution.)
- Replace the current `durations[i]` write into `block.durationMinutes` with a final pass that consults `snapWarmupWrapDurations(layout, durations, picks, context.sessionFocus)` once all picks are known.
- Block creation loop runs in two phases now: (1) pick variants for every slot, (2) snap+redistribute, (3) write blocks using snapped durations. Required-slot failure logic (`if (slot.required) return null`) stays in phase 1.

**Patterns to follow:**
- Existing main-skill substitution pre-pass already collects per-slot intent before the block loop runs. The new picks array follows the same shape.

**Test scenarios:**
- Happy path: Pair + Net 40-min build with no `sessionFocus` produces blocks with warmup `durationMinutes: 3`, wrap `durationMinutes: 4`, and the freed 3 minutes redistributed to technique/pressure as predicted by U1's tests.
- Happy path: Pair + Net 40-min build with `sessionFocus: 'serve'` produces a block list whose total minutes ≤ `context.timeProfile`, with main_skill and pressure absorbing as much of the freed 3 minutes as their caps allow.
- Edge case: Solo + Wall 15-min build (warmup exactly 3, wrap exactly 4 with d25 OR exactly 3 with d26) produces unchanged total (15 min). No snap-induced shortening.
- Integration: existing pinned golden test for Pair + Open 25-min updates to the new shape (warmup snapped from 3 to 3 — no change — but wrap may snap from 4 to 4 (d26 sometimes picked) or 4 to 4 (d25 picked); golden pins exact picks per the seed). Update only what the seed changes.

**Verification:**
- `buildDraft` consumers (run flow, recovery, swap) see the snapped durations. Sum of `block.durationMinutes` ≤ `context.timeProfile` when snap fires; equals `context.timeProfile` otherwise.

---

- U3. **Wire snap into `buildRecoveryDraft`**

**Goal:** Apply the same snap+redistribute logic in recovery builds, with redistribution scoped to technique/movement_proxy.

**Requirements:** R7

**Dependencies:** U1

**Files:**
- Modify: `app/src/domain/sessionBuilder.ts` (function `buildRecoveryDraft`)
- Test: `app/src/domain/sessionBuilder.test.ts` (extend recovery section)

**Approach:**
- Inline a recovery-specific call to `snapWarmupWrapDurations` after recovery picks resolve. Pass an explicit recovery priority (`['technique', 'movement_proxy']`) and pass `sessionFocus: undefined` since recovery strips focus per existing `stripSessionFocus` logic.
- Helper in U1 should accept either an explicit priority array or derive priority from `sessionFocus`. Cleaner shape: `snapWarmupWrapDurations(layout, durations, picks, opts)` where `opts` is either `{ sessionFocus }` or `{ priority }`. Decide in U1 implementation.

**Test scenarios:**
- Happy path: 25-min recovery build → warmup `d28-solo` already at 3 min (slot is `warmup(3,4)`, allocator gives 3 or 4 depending on layout); wrap variant picks may snap (d25 vs d26). Freed minutes go to technique/movement.
- Edge case: 15-min recovery build is more constrained — recovery layout already removes `main_skill`/`pressure`, so freed minutes can only go to technique/movement.

**Verification:**
- Recovery total minutes preserved when redistribution caps allow; shortened only when caps prevent absorption.
- Existing recovery dominance test (technique > warmup, technique > wrap) continues to pass.

---

- U4. **Bump `SESSION_ASSEMBLY_ALGORITHM_VERSION` and update pinned golden**

**Goal:** Reflect the assembly-output change in the algorithm version constant and update the single seed-pinned golden test.

**Requirements:** R9

**Dependencies:** U2

**Files:**
- Modify: `app/src/domain/sessionBuilder.ts` (`SESSION_ASSEMBLY_ALGORITHM_VERSION = 2`)
- Modify: `app/src/domain/sessionBuilder.test.ts` (pinned `assemblyAlgorithmVersion: 2`; update `durationMinutes` for the pinned Pair + Open 25 build to match new snap behavior)
- Test: same file

**Approach:**
- Run the pinned golden test, observe new durations, write them into the test expectation. The fixed seed (`batch3-golden-pair-open-25`) makes the new shape deterministic.
- Verify the `assemblyAlgorithmVersion` is checked in `app/src/test-utils/persistedRecords.test.ts` (passes through, so a version of 7 is fine in that test fixture). No change needed there.

**Test scenarios:**
- Happy path: pinned golden output matches with `assemblyAlgorithmVersion: 2`.
- Integration: `app/src/services/__tests__/modelRoundTrip.test.ts` (`assemblyAlgorithmVersion: 1`) still passes because that test asserts a fixture round-trip, not the live constant.

**Verification:**
- All existing assembly tests pass with the new version constant.

---

- U5. **Extend assembly tests for snap behavior across archetypes and focus**

**Goal:** Pin the new behavior across all M001 archetypes and across the focus-aware redistribution rules.

**Requirements:** R1–R7, R9

**Dependencies:** U1, U2, U3, U4

**Files:**
- Modify: `app/src/domain/sessionBuilder.test.ts`

**Approach:**
- Add a `describe('warmup/wrap segment snap (algo v2)', ...)` block covering:
  - Each (`playerMode` × `timeProfile`) combination that produces a warmup/wrap allocation above the chosen variant's natural sum.
  - Each `sessionFocus` value (`'serve'`, `'pass'`, `'set'`, undefined).
  - The d25-vs-d26 wrap case where d25 is picked (no snap) versus d26 picked (snap by 1).
  - The cap-saturation case (Pair + Net 40-min sessionFocus undefined) where some freed minutes land in leftover and the session shortens.
- Lean on existing `variantById` map utility.

**Test scenarios:**
- Happy path: Pair + Net 40 with `sessionFocus: undefined` shortens session by exactly 1 min when freed=3 and all caps hit at +2.
- Happy path: Pair + Net 40 with `sessionFocus: 'serve'` puts +2 minutes into pressure (cap), +1 into main_skill if cap allows. Test asserts the focus-priority outcome row by row.
- Edge case: Solo + Wall 15 with d28 + d25 picked (warmup exactly 3, wrap exactly 4) → no snap, durations unchanged.
- Edge case: Solo + Wall 15 with d28 + d26 picked (warmup 3, wrap 4 → 3) → 1 min freed, redistributes into main_skill (5→6 cap).
- Integration: full archetype-by-profile sweep (`solo_wall`/`solo_net`/`solo_open`/`pair_net`/`pair_open` × `15`/`25`/`40`) — assert `sum(blocks.durationMinutes) <= context.timeProfile` and equals it whenever snap doesn't shorten.

**Verification:**
- All new tests pass, existing tests pass after U4's golden update.
- `app/src/domain/__tests__/findSwapAlternatives.test.ts::"preserves id, type, durationMinutes, required on the alternate"` continues to pass — proves R8 (swap unaffected).

---

## System-Wide Impact

- **Interaction graph:** `buildDraft` is called from `SetupScreen` (initial build), `services/session/regenerateDraftFocus.ts` (focus regenerate), and `buildRecoveryDraft` from `SafetyCheckScreen`. All three consume the snapped output; no caller-side change.
- **Error propagation:** `snapWarmupWrapDurations` is total — never returns null. Required-slot failure handling stays in `buildDraft`.
- **State lifecycle risks:** `assemblyAlgorithmVersion` bump is forward-compatible. Plans persisted with v1 keep replaying as v1 (`buildDraftFromCompletedBlocks` reads the value off the plan); only freshly-built drafts use v2.
- **API surface parity:** `findSwapAlternatives` continues to preserve `block.durationMinutes` per existing test. No schema or persisted-shape change.
- **Integration coverage:** `SessionPlanBlock.durationMinutes` is the runner's source of truth; once snapped, RunScreen, useRunController, and useBlockPacingTicks need no change.
- **Unchanged invariants:** `allocateDurations`, `allocateRecoveryDurations`, `findCandidates`, `pickForSlot`, `effectiveSkillTags`, archetype slot envelopes, and catalog validation rules.

---

## Risks & Dependencies

| Risk | Mitigation |
|------|------------|
| Session shortens by 1–2 min on Pair + Net 40 with no focus, surprising the user. | This is the intended trade per R5; the alternative (un-snapping warmup/wrap to absorb leftover) re-introduces the dead time the plan exists to remove. Future Tier 2 history surface can show actual minutes; copy framing can land separately if needed. |
| Future warmup variant authored with a `durationMinMinutes` higher than archetype slot `durationMaxMinutes` would produce a snap target above the cap. | U1 clamps snap target to slot max; catalog validation should still flag this as an authoring inconsistency, but the runtime is safe. |
| `assemblyAlgorithmVersion: 2` bump invalidates a session in unforeseen consumers. | All consumers identified read the value off the plan record (`buildDraftFromCompletedBlocks`, export); none branch on the value. Tests pin behavior, not the constant. |
| Recovery snap interacts awkwardly with `allocateRecoveryDurations`'s 60/40 technique/movement bias. | Recovery snap operates after recovery allocator, so the bias is preserved; freed minutes simply add to the same two slots in the same priority order. |

---

## Sources & References

- Field session: [docs/research/2026-05-04-pair-serving-session-feedback.md](../research/2026-05-04-pair-serving-session-feedback.md)
- Per-move pacing indicator (segments authoring contract): [docs/plans/2026-04-28-per-move-pacing-indicator.md](2026-04-28-per-move-pacing-indicator.md)
- Architecture pass (assembly module location): [docs/plans/2026-04-26-app-architecture-pass.md](2026-04-26-app-architecture-pass.md)
- Related code: `app/src/domain/sessionBuilder.ts`, `app/src/domain/sessionAssembly/durations.ts`, `app/src/domain/sessionAssembly/effectiveFocus.ts`, `app/src/data/archetypes.ts`, `app/src/data/drills.ts`
