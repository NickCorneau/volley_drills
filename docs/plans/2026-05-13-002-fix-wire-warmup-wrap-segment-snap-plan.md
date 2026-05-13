---
title: "fix: Wire warmup/wrap segment snap into buildDraft + recovery, align d26 copy"
type: fix
status: active
date: 2026-05-13
depends_on:
  - docs/plans/2026-05-04-002-feat-warmup-wrap-segment-snap-plan.md
---

# Wire warmup/wrap segment snap into buildDraft + recovery, align d26 copy

## Summary

Complete the unshipped U2/U3/U4/U5 from the 2026-05-04-002 segment-snap plan: call the existing `snapWarmupWrapDurations` helper from `buildDraft` and `buildRecoveryDraft`, bump `SESSION_ASSEMBLY_ALGORITHM_VERSION` 6 → 7, update the pinned golden test, and update d26-solo courtside copy so the "3 to 6 minutes on the timer" framing reflects the new snapped reality (d26 now snaps to 3 min on every session size).

## Problem Frame

User-reported during a live session: the Downshift wrap (d26-solo) showed a 5-min timer (`4:56`) with three 60-second segments that visibly sum to 3 min, and the courtside copy declared "Short wrap (3 to 6 minutes on the timer)". Same drift potentially affects the d28-solo warmup. Root cause: the 2026-05-04-002 plan landed U1 (`snapWarmupWrapDurations` helper + tests in `app/src/domain/sessionAssembly/snapDurations.ts`) but never wired U2 (`buildDraft`), U3 (`buildRecoveryDraft`), U4 (version bump + golden update), or U5 (extended tests). The pure helper exists, but production assembly still calls only `allocateDurations`, so `block.durationMinutes` continues to exceed segment sums.

---

## Requirements

- R1. `buildDraft` calls `snapWarmupWrapDurations` after slot picks resolve and uses the snapped duration array when writing each block's `durationMinutes`.
- R2. `buildRecoveryDraft` calls `snapWarmupWrapDurations` with `RECOVERY_REDISTRIBUTION_PRIORITY` and `allowSlotMaxOverflow: true` (recovery already overshoots slot maxes on purpose).
- R3. `SESSION_ASSEMBLY_ALGORITHM_VERSION` bumps 6 → 7 to mark the assembly-output shape change.
- R4. The pair-open-25 pinned golden test in `sessionBuilder.test.ts` updates to the snapped shape: warmup `d28-solo` stays at 3 min (already natural), wrap `d26-solo` snaps 4 → 3, freed minute redistributes into technique (6 → 7) per the default priority; total stays at 25.
- R5. d26-solo `courtsideInstructions` rewrites the misleading "3 to 6 minutes on the timer" range to honest copy: d26 is always 3 min after snap on every archetype × profile. The existing regression that pins "3 to 6 minutes on the timer" updates to match.
- R6. `swapAlternatives` and the runner are untouched (snap is build-time only); the existing swap test that pins `block.durationMinutes` continues to pass.
- R7. d25-solo (4 min natural) and d28-solo (3 min natural) keep their existing courtside copy — neither claims a duration range that the snap invalidates, and bonus-copy polish stays deferred per the 2026-05-04 plan.

---

## Scope Boundaries

- Does NOT add new helper code beyond consuming the existing `snapWarmupWrapDurations` from `app/src/domain/sessionAssembly/snapDurations.ts`.
- Does NOT change archetype slot envelopes in `app/src/data/archetypes.ts`.
- Does NOT rewrite `courtsideInstructionsBonus` for d25/d26/d28 — those still render in shorten/non-snap edge cases. Polish stays deferred per the 2026-05-04 plan's `Deferred to Follow-Up Work`.
- Does NOT change `findSwapAlternatives`, `useRunController`, `RunScreen`, `useBlockPacingTicks`, or `scaleSegmentsForBlockDuration`.
- Does NOT introduce a UI affordance announcing snap-induced session shortening.

### Deferred to Follow-Up Work

- Bonus-copy polish for d25-solo and d28-solo: same deferral as the parent 2026-05-04-002 plan.

---

## Context & Research

### Relevant Code and Patterns

- `app/src/domain/sessionBuilder.ts`:
  - `buildDraft` — already collects per-slot picks in `selectedByLayoutIndex` (a `Map<number, { pick: CandidateVariant; ... }>`) and writes `durationMinutes: durations[i] + (i === redistributionIndex ? redistributedMinutes : 0)` per block. The snap call goes after the optional `shouldRerouteForSourceBackedSibling` reroute (so the snap sees the final picks) and before the block-writing loop. The `redistributedMinutes` legacy line is fully replaced by the snap's redistribution — they are two competing redistributors and only one should run.
  - `buildRecoveryDraft` — has a tighter shape: linear loop over `recoveryLayout`, picks via `pickForSlot`, writes `durationMinutes: durations[i]`. The snap call goes after the pick loop and before block writing. Pass `RECOVERY_REDISTRIBUTION_PRIORITY` + `allowSlotMaxOverflow: true` to match recovery's existing 60/40 technique/movement bias.
- `app/src/domain/sessionAssembly/snapDurations.ts` — the helper is total (never null), signature `(layout, durations, picks, sessionFocus, options?) => number[]`. Already exports `RECOVERY_REDISTRIBUTION_PRIORITY`.
- `app/src/domain/sessionBuilder.test.ts` lines 23–74 — pair-open-25 golden test. Bump version to 7 and update wrap from 4 → 3 with technique 6 → 7. Verify total still 25.
- `app/src/data/__tests__/drillCopyRegressions.test.ts` lines 281–289 — pins "3 to 6 minutes on the timer" with a negative against "~3 min". After R5, the positive assertion rewrites to match the new copy; the negative against "~3 min" stays (the new copy still does not use the `~3 min` framing).

### Institutional Learnings

- The 2026-04-28 per-move pacing indicator plan and the 2026-05-04-002 snap plan are the upstream context. The redistribution logic and edge-case treatment are already decided; this plan just consumes them.
- `redistributedMinutes`/`redistributionIndex` in `buildDraftResult` is a different mechanism (handles allocator surplus from `selectedByLayoutIndex` skipping optional slots) and predates the snap. After the snap fires, allocator surplus is no longer the right concept — the snap owns redistribution. The cleanest move is to compute snap-adjusted durations first, then drop the legacy `redistributedMinutes` post-block adjustment, and have the assembly trace report `redistributedMinutes` as `sum(durations) - sum(snapped)` (negative when shortened) or simply `0` going forward. See Key Technical Decisions below.

---

## Key Technical Decisions

- **Snap replaces the legacy `redistributedMinutes` path, doesn't stack on top of it.** The pre-snap code path computed `redistributedMinutes = timeProfile - selectedDurationTotal` and dumped it into `main_skill` (or the last selected slot) at block-write time. The snap's own redistribution is more principled (focus-aware, cap-respecting). After wiring the snap, the legacy `redistributedMinutes` becomes additive double-counting and must go. The assembly trace's `redistributedMinutes` field is preserved but now reports the count of minutes the snap redistributed (or 0 when nothing changed) so downstream readers (`buildTraceSlot`, generated-plan diagnostics) keep a meaningful signal.
- **Recovery uses `allowSlotMaxOverflow: true`** because `allocateRecoveryDurations` already promotes technique/movement_proxy above their archetype slot maxes by design (the recovery contract folds main_skill+pressure minutes into technique). Without the overflow flag, the recovery snap would drop freed minutes when those targets are already above cap.
- **Version bump 6 → 7** because the snap changes assembly output shape for any session where allocator gave warmup/wrap more minutes than the chosen variant's natural segment sum (i.e., any session with `d26` on a wrap slot ≥ 4 min, or `d28` on a warmup slot ≥ 4 min). Plans persisted with version ≤ 6 keep replaying as their stored version via `buildDraftFromCompletedBlocks` (which reads the version off the plan); only fresh builds use 7.
- **d26-solo copy framing**: after snap, d26 is always 3 min. The cleanest rewrite drops "(3 to 6 minutes on the timer)" entirely — that range was an honesty patch for the pre-snap discrepancy, no longer needed. The three-move sequence and the "no bouncing; firm tension, never sharp pain." safety clause stay verbatim.

---

## Open Questions

### Resolved During Planning

- *Should this plan also touch d28-solo and d25-solo courtside copy?* — Resolved: no. d28-solo's intro ("Four quick movement blocks. End warmer than you started.") has no time claim. d25-solo's intro ("Walk first, then four short stretch holds.") has no time-range claim either. Only d26-solo authors a "3 to 6 minutes on the timer" range, which is the surface the user reported.
- *Should bonus copy be polished now?* — Resolved: no. Bonus copy renders only when `block.durationMinutes > sum(segments)`, which after snap happens only on Shorten or future non-snapped variants. The parent 2026-05-04-002 plan deferred this; staying deferred preserves scope.

### Deferred to Implementation

- Whether the `redistributedMinutes` field on `DraftAssemblyTrace` is reported as zero, or as the snap's freed-minutes count, or as a signed delta. Decide during U2 implementation based on what `generatedPlanDiagnostics.ts` currently reads.

---

## Implementation Units

- U1. **Wire snap into `buildDraft` and retire legacy `redistributedMinutes`**

**Goal:** After slot picks resolve in `buildDraftResult`, call `snapWarmupWrapDurations(layout, durations, picks, effectiveContext.sessionFocus)` and use the returned array when writing each block's `durationMinutes`. Drop the legacy `redistributedMinutes`/`redistributionIndex` post-allocation patch.

**Requirements:** R1, R3, R4, R6

**Dependencies:** None (helper already exists at `app/src/domain/sessionAssembly/snapDurations.ts`)

**Files:**
- Modify: `app/src/domain/sessionBuilder.ts`
- Test: `app/src/domain/sessionBuilder.test.ts`

**Approach:**
- Import `snapWarmupWrapDurations` from `./sessionAssembly/snapDurations` at the top of `sessionBuilder.ts`.
- After the optional `shouldRerouteForSourceBackedSibling` block (line ~241–269 today), build a `picks: (CandidateVariant | undefined)[]` aligned to `layout.length` by indexing into `selectedByLayoutIndex` (skipped slots get `undefined`).
- Call `snapWarmupWrapDurations(layout, durations, picks, effectiveContext.sessionFocus)` and assign the result back to a new `snappedDurations` constant.
- In the block-writing loop (line ~271–300), replace `durations[i] + (i === redistributionIndex ? redistributedMinutes : 0)` with `snappedDurations[i]`.
- Remove the pre-loop computation of `redistributedMinutes` / `redistributionIndex` (they are no longer used by block writing). Keep the `assemblyTrace.redistributedMinutes` field on the return: compute it as `sum(snappedDurations) - sum(durations[i] for selected i)` so it captures any net session shortening. Leave `redistributionLayoutIndex` undefined post-snap (no longer a meaningful single index).
- Bump `SESSION_ASSEMBLY_ALGORITHM_VERSION` from 6 to 7.

**Patterns to follow:**
- The pre-block accumulation pattern already used for `selectedByLayoutIndex`. Layer the picks array on top.

**Test scenarios:**
- Happy path (pair-open-25 golden): warmup `d28-solo` 3 min (unchanged), technique `d05-pair` 6 → 7 (absorbs freed minute), movement_proxy `d10-pair` 5 (unchanged), main_skill `d07-pair-open` 7 (unchanged), wrap `d26-solo` 4 → 3 (snapped). Total stays at 25. Version asserts 7.
- Happy path: `expect(first?.assemblyAlgorithmVersion).toBe(7)` at line 1626 updates to match.
- Happy path: existing `pacing metadata pipes through buildDraft onto warmup + wrap blocks` test continues to pass — both d25 (4 min, no snap) and d26 (3 min, snapped from whatever allocator gave) keep their segments and bonus copy.
- Edge case: solo-wall-15 (warmup(3,3), wrap(3,4)): d28 at 3 (already natural, no snap), d26 at 3 (snapped from 4, +1 redistributed) OR d25 at 4 (already natural, no snap). Verify `sum(blocks.durationMinutes) === 15` in both branches.
- Integration: `findSwapAlternatives` swap test continues to assert `durationMinutes` preservation (R6).

**Verification:**
- Pinned golden updates land cleanly; full assembly test suite passes.
- `sum(block.durationMinutes) ≤ context.timeProfile` on every M001 archetype × profile.

---

- U2. **Wire snap into `buildRecoveryDraft`**

**Goal:** Same as U1 for the recovery path, with `RECOVERY_REDISTRIBUTION_PRIORITY` and `allowSlotMaxOverflow: true`.

**Requirements:** R2, R6

**Dependencies:** U1 (import already added)

**Files:**
- Modify: `app/src/domain/sessionBuilder.ts` (`buildRecoveryDraft` function)
- Test: `app/src/domain/sessionBuilder.test.ts` (extend recovery suite)

**Approach:**
- After the recovery pick loop completes (line ~501–527 today), build a `picks` array aligned to `recoveryLayout.length` from the picks collected during the loop. Today the picks are written directly into `blocks` and then discarded; pull them into a separate `picks` array first, then write blocks using the snapped durations.
- Call `snapWarmupWrapDurations(recoveryLayout, durations, picks, undefined, { priority: RECOVERY_REDISTRIBUTION_PRIORITY, allowSlotMaxOverflow: true })` and use the result for block `durationMinutes`.
- Import `RECOVERY_REDISTRIBUTION_PRIORITY` from `./sessionAssembly/snapDurations`.

**Test scenarios:**
- Happy path (existing 15-min recovery test): `total === 15`, `technique > warmup`, `technique > wrap`. Recovery snap should not break dominance because freed minutes from wrap snap (e.g., d26 4 → 3) flow into technique under `allowSlotMaxOverflow`.
- Happy path (existing 25-min recovery test): `total === 25`, `technique >= movement`.
- Happy path (existing 40-min recovery test): `total === 40`.
- Edge case: recovery layout where wrap is `d25-solo` (4 min natural): no snap, no redistribution, durations unchanged.

**Verification:**
- All three pinned recovery tests continue to pass.

---

- U3. **Update d26-solo courtside copy**

**Goal:** Replace the misleading "(3 to 6 minutes on the timer)" framing with copy honest to the post-snap 3-min reality.

**Requirements:** R5, R7

**Dependencies:** U1 (so the new copy reflects production behavior; not technically a code dependency, but a sequencing one)

**Files:**
- Modify: `app/src/data/drills.ts` (d26-solo `courtsideInstructions`)
- Modify: `app/src/data/__tests__/drillCopyRegressions.test.ts` (the test at line 281–289)

**Approach:**
- Rewrite d26-solo `courtsideInstructions` from `'Short wrap (3 to 6 minutes on the timer): three moves to start. No bouncing; firm tension, never sharp pain.'` to copy that drops the obsolete "3 to 6 minutes" range. Suggested rewrite: `'Short wrap: three lower-body stretches, each side. No bouncing; firm tension, never sharp pain.'`. Final wording decided during implementation per `.cursor/rules/courtside-copy.mdc` invariants (no jargon, no em-dashes, one-season rec-player test).
- Update the inline comment block in `drills.ts` above the variant to note the 2026-05-13 rewrite and reference this plan.
- Update the regression test (line 281–289) to assert the new framing. Keep the negative `not.toMatch(/~3 min on the timer/)` (still true) and replace the positive `toMatch(/3 to 6 minutes on the timer/)` with a positive that pins the new opening — exact regex finalized during implementation.

**Patterns to follow:**
- The 2026-04-27 cca2 dogfeed comment block already records the prior copy-edit reasoning; the new edit appends a 2026-05-13 entry rather than replacing the history.

**Test scenarios:**
- Happy path: new copy passes `.cursor/rules/courtside-copy.mdc` invariants (no em-dashes, no unglossed jargon, ≤ 200 chars). The existing em-dash regression at line 351 continues to pass.
- Happy path: updated regression at line 281 passes against the new copy; the negative `~3 min` assertion still passes.
- Edge case: bonus copy assertions at lines 291–307 (glutes / adductors inline gloss, no "mirror to the other side") continue to pass — bonus copy is not modified.

**Verification:**
- `npm test -- drillCopyRegressions` passes.
- The new copy reads honest at courtside courtside.

---

- U4. **Verification sweep**

**Goal:** Run the full app test suite + the catalog validation suite. Confirm `sum(block.durationMinutes) ≤ context.timeProfile` on every archetype × profile in build draft, and `=== context.timeProfile` in recovery.

**Requirements:** R1–R7

**Dependencies:** U1, U2, U3

**Files:**
- Test: full `app/` workspace, no new files.

**Approach:**
- `npm test` from `app/`.
- If any test fails that isn't the pinned golden (already updated in U1) or the d26 copy regression (already updated in U3), root-cause and fix or escalate.

**Test scenarios:**
- All existing tests pass.

**Verification:**
- Clean test run.

---

## System-Wide Impact

- **Interaction graph:** `buildDraft` is called from `SetupScreen`, `regenerateDraftFocus`, `buildDraftFromCompletedBlocks` (read-through only — uses the plan's stored algorithm version), and assembly tests. `buildRecoveryDraft` from `SafetyCheckScreen` and tests. All consume the snapped output.
- **Error propagation:** `snapWarmupWrapDurations` is total. Required-slot failure handling stays in `buildDraft`.
- **State lifecycle risks:** `assemblyAlgorithmVersion: 7` is forward-compatible. Plans persisted with v6 keep replaying as v6.
- **API surface parity:** `findSwapAlternatives` continues to preserve `block.durationMinutes`. No schema/persistence change.
- **Integration coverage:** `SessionPlanBlock.durationMinutes` is the runner's source of truth; once snapped, RunScreen, useRunController, useBlockPacingTicks need no change.
- **Unchanged invariants:** `allocateDurations`, `allocateRecoveryDurations`, archetype slot envelopes, catalog validation rules.

---

## Risks & Dependencies

| Risk | Mitigation |
|------|------------|
| Pair + Net 40-min sessions may shorten by 1–2 min when caps prevent absorbing all freed minutes. | Same risk as parent 2026-05-04-002 plan; same mitigation (intended trade per R5 of that plan; honest timer is the higher priority). |
| The legacy `redistributedMinutes` path may have been silently load-bearing in `generatedPlanDiagnostics` or assembly-trace consumers. | Verify during U1 by grepping for `redistributedMinutes` reads; either preserve the field's meaning or update the readers. |
| d26 copy rewrite may fail an existing courtside-copy lint or eslint rule. | Verification sweep in U4 catches this. |

---

## Sources & References

- Parent plan: [docs/plans/2026-05-04-002-feat-warmup-wrap-segment-snap-plan.md](2026-05-04-002-feat-warmup-wrap-segment-snap-plan.md) — U1 shipped (helper + tests); U2/U3/U4/U5 unshipped.
- Existing helper: `app/src/domain/sessionAssembly/snapDurations.ts`
- Field-report context: user-reported during live Downshift wrap, 2026-05-13, showing a 5-min timer with three 60s segments and the misleading "3 to 6 minutes on the timer" framing.
- Related code: `app/src/domain/sessionBuilder.ts`, `app/src/data/drills.ts`, `app/src/data/__tests__/drillCopyRegressions.test.ts`, `app/src/domain/sessionBuilder.test.ts`
