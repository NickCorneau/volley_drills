## Summary

Snap warmup and wrap blocks to the picked variant's authored segment sum after session assembly, then redistribute the freed minutes into focus-aligned work slots. Removes the dead-time gap between block timer and visible segment list that the 2026-05-04 founder + Seb Pair + Net 40-min serving session flagged as "warmup/cooldown timing felt off."

For a Pair + Net 40-min build with `d28-solo` (3-min natural) at warmup and `d25-solo` (4-min natural) at wrap, the timer used to plan 5/5 against 3/4 of authored segment content. Now the timer matches the segment list. Freed minutes go to `main_skill` and either `pressure` (serve focus) or `technique`/`movement_proxy` (pass/set focus) up to each slot's `durationMaxMinutes`. Recovery uses an `allowSlotMaxOverflow` flag because `allocateRecoveryDurations` already overshoots caps by design.

`SESSION_ASSEMBLY_ALGORITHM_VERSION` bumps from 1 to 2. Plans persisted under v1 replay as v1; only freshly-built drafts use v2.

Plan: `docs/plans/2026-05-04-002-feat-warmup-wrap-segment-snap-plan.md`

## What changed

- New pure helper `app/src/domain/sessionAssembly/snapDurations.ts` (`snapWarmupWrapDurations`) with options for `priority` override and `allowSlotMaxOverflow`.
- `buildDraft` and `buildRecoveryDraft` in `app/src/domain/sessionBuilder.ts` are now two-phase (resolve picks → snap + redistribute → write blocks).
- 19 new unit tests in `snapDurations.test.ts` covering snap behavior, redistribution priority, allow-overflow, round-robin across same-type slots, skipped-pick guard, fractional-natural guard, and purity.
- 7 new integration tests in `sessionBuilder.test.ts` under `describe('warmup/wrap segment snap (algo v2)')` covering the live Pair + Net 40 build path, total-minutes invariant, focus-driven drill picks, Solo + Wall 15 no-snap case, full archetype-by-profile sweep, and recovery `timeProfile` preservation.
- The pinned Pair + Open 25-min golden test updated to reflect snap behavior.

## Test plan

- [x] `npm test -- src/domain src/data src/services` — 564 passed (worker-pool errors are environmental, not test failures)
- [x] `npm test -- src/domain/sessionAssembly/__tests__/snapDurations.test.ts` — 19/19
- [x] `npm test -- src/domain/sessionBuilder.test.ts` — 51/51
- [x] `npx tsc --noEmit -p tsconfig.app.json` — clean
- [x] `npm run lint` — clean
- [ ] Manual courtside smoke on iPhone PWA: open Tune today → Safety → Run on a Pair + Net 40-min build, verify warmup timer reads `3:00` and progresses through all `d28` segments without leftover dead time, then wrap reads `3:00` (d26) or `4:00` (d25). Browser e2e on `session-flow.spec.ts` is pre-existing broken on `main` (Setup screen "Wall available" selector mismatch from the 2026-04-30 pre-run simplification ship); not in scope for this PR.

## Residual review findings (deferred)

The four-persona review (correctness, maintainability, testing, kieran-typescript) applied autofixes inline for: redistribution-into-skipped-slot bug, fractional-natural defensive guard, vacuous focus integration test (replaced with row-by-row pin), `?? 0` invariant masking (dropped), `allowOverflow` rename to `allowSlotMaxOverflow`. The following findings were deferred as out-of-scope cleanup:

- **Maintainability (P3)** — `DraftBlock` write-loop duplication between `buildDraft` and `buildRecoveryDraft` (~24 lines, two trivial differences). Refactor candidate: extract `writeDraftBlocks` helper.
- **TypeScript API (medium)** — `priority` and `allowSlotMaxOverflow` are co-required for recovery but exposed as independent options. A future caller using `RECOVERY_REDISTRIBUTION_PRIORITY` without `allowSlotMaxOverflow: true` would silently drop freed minutes. Suggested wrap behind `snapWarmupWrapDurationsForRecovery` or a discriminated-union mode.
- **TypeScript test hygiene (low)** — `pick()` test fixture casts to bypass `readonly DrillSegment` for post-hoc duration mutation; `slot()` helper has a non-exhaustive hand-rolled `required` membership check over `BlockSlotType`.
- **Maintainability (P3)** — Cross-module invariant: `RECOVERY_BLOCK_SLOT_TYPES` (`sessionBuilder.ts`) and `RECOVERY_REDISTRIBUTION_PRIORITY` (`snapDurations.ts`) must stay aligned but neither file references the other.
- **Testing (P3)** — Recovery integration test only covers `pair_open`. Solo recovery layouts (no `movement_proxy` slot) hit a different `allocateRecoveryDurations` branch that is unverified at the integration tier.
- **Testing (P3)** — Substitution + snap interaction (`buildDraft` with `lastCompletedByType.main_skill` triggering substitution AND a snap-eligible warmup/wrap variant) has no live-builder coverage.
