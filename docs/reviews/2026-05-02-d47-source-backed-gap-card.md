---
id: d47-source-backed-gap-card-2026-05-02
title: "D47 Source-Backed Gap Card"
status: active
stage: validation
type: review
summary: "Source-backed gap card for the D47 advanced setting/movement pressure cluster. Names a candidate content-depth delta beyond existing FIVB 4.7 coverage, and remains not authorized after the comparator evaluation payload selects D47 as catalog-planning input."
authority: "D47 source-backed gap-card candidate for generated diagnostics follow-up; does not authorize catalog edits, workload metadata edits, U6 preview tooling, or runtime generator changes."
last_updated: 2026-05-02
depends_on:
  - docs/brainstorms/2026-05-02-generated-diagnostics-d47-concrete-delta-proposal-requirements.md
  - docs/brainstorms/2026-05-02-generated-diagnostics-d47-reentry-selection-requirements.md
  - docs/brainstorms/2026-05-02-generated-diagnostics-d47-gap-closure-ledger-requirements.md
  - docs/reviews/2026-05-01-generated-plan-diagnostics-triage.md
  - docs/reviews/2026-04-30-focus-coverage-gap-cards.md
  - app/src/data/drills.ts
---

# D47 Source-Backed Gap Card

## Purpose

Name the smallest credible source-backed content-depth delta for the current D47 pressure cluster, while preserving the comparator gate. The comparator evaluation payload now selects `d47_wins`, so this card may inform the next catalog implementation plan, but it still is not activation approval.

## Gap Card

### gap-d47-advanced-setting-conditioning-depth

- **Status:** `source_candidate`
- **Activation readiness:** `not_authorized`
- **Comparator gate:** D47 beat the current `d47/d47-solo-open vs d05/d05-solo` comparator via `docs/reviews/2026-05-02-d47-d05-comparator-evaluation-payload.md`. This unlocks catalog implementation planning only; activation remains `not_authorized`.
- **Risk buckets:** `thin_long_session`, `mixed_causality`, `source_adaptation_needed`, `player_count_boundary`
- **Affected diagnostic groups:**
  - `gpdg:v1:d47:d47-solo-open:main_skill:true:optional_slot_redistribution+over_authored_max+over_fatigue_cap` (30 cells)
  - Related lower-count group: `gpdg:v1:d47:d47-pair-open:main_skill:true:optional_slot_redistribution+over_authored_max+over_fatigue_cap` (16 cells)
- **Current receipt facts:** D47 solo-open pressure has 12 cells that disappear under the redistribution counterfactual, 18 that remain, and 6 non-redistribution-pressure cells.
- **Current catalog coverage:** `d47` / `d47-solo-open` and `d47-pair-open` already cover FIVB 4.7 `4 Great Sets`: four varied setting locations, move first, choose bump/hand set, and deliver a hittable ball from imperfect positions.
- **Suspected content-depth gap:** Current `d47` is a short advanced variability drill. The missing content-depth candidate is a longer advanced setting/movement conditioning family that trains repeated out-of-system movement, high-volume setter footwork, and set quality under fatigue without stretching `d47` beyond its honest 5-9 minute envelope.
- **Candidate changed or missing IDs:** candidate new drill family `d49` with `d49-solo-open` and `d49-pair-open` variants. IDs are reserved only for planning discussion here; implementation must re-check collisions before editing catalog data.
- **Likely fix type:** source-backed sibling drill/variant activation, not D47 cap widening.
- **Rejected direct D47 edit:** Do not simply widen `d47-solo-open` beyond 9 minutes. Existing D47 provenance supports four-location setting variability; it does not by itself prove a longer fatigue-conditioning block.

## Exact Source References

- Existing source boundary: FIVB Drill-book 4.7 `4 Great Sets`, already activated for `d47`; this is not sufficient by itself for new content.
- Better at Beach, `Every drill you need to become the best beach volleyball setter`, candidate sections:
  - `Solo setting drills`, especially `Dip, dip, lift`, for solo open-court setter footwork and repeated touch work.
  - `Hand Dig, Set, Set`, for high-intensity beach setting under retreat/recovery pressure, but it needs 3 players and therefore cannot directly activate in M001.
  - `Pass, set, set, set, catch`, for high-repetition setting rhythm, but it is 3-player and cannot directly activate in M001.
  - URL: `https://www.betteratbeach.com/blog/every-drill-beach-volleyball-setting`
- Junior Volleyball Association, `Setting Drills to Train Proper Technique and Eliminate Bad Habits`, candidate sections:
  - `Setting High Out of System (OOS)` and `Up and back setting`, for timed out-of-system setting movement, high sets, and left/right footwork under repeat load.
  - URL: `https://jvavolleyball.org/drills-train-good-setting-habits/`
- The Art of Coaching Volleyball, `Set and go drill for high energy set training`, candidate use:
  - Confirms advanced setting work that combines setting, movement, quick decisions, conditioning, four setting positions, and a conditioning station.
  - Player-count and indoor-team assumptions make it supporting rationale only, not a direct M001 activation source.
  - URL: `https://www.theartofcoachingvolleyball.com/setting-drill-that-moves-really-fast/`

## Adaptation Delta

- **Solo open candidate:** Convert the source pattern into a marker-based `Set And Recover` drill: four marked start/target locations, self-toss from imperfect positions, set to a target window, recover to a home marker, then repeat through timed rounds. This borrows Better at Beach solo footwork/touch work and the out-of-system movement intent from JVA, but the exact solo adaptation needs review before implementation.
- **Pair open candidate:** Use a partner toss from end-line / off-net / side-line markers. The setter moves, delivers a high controlled set to a target window, recovers, and repeats in short intervals. This is closer to JVA `Up and back setting` and more activation-ready than the solo version.
- **Not allowed in M001:** Do not activate Better at Beach `Triangle Setting`, `Hand Dig, Set, Set`, `Pass, set, set, set, catch`, or TAOCV `Set and Go` in source form, because those require 3+ or 4+ players and remain outside the current D101 boundary.

## Expected Diagnostic Movement

- If a new source-backed sibling is added and candidate selection can prefer it for longer advanced setting/movement main-skill blocks, expected movement is a reduction in D47 over-cap pressure for affected advanced solo-open and possibly pair-open setting cells.
- The gap card alone should not change diagnostics.
- If implementation only adds catalog content but `buildDraft()` still selects `d47-solo-open` for the same long blocks, expected diagnostic movement is none.
- If comparator work shows `d05` is a simpler or higher-confidence gap-fill target, or if both candidates continue to hold for evidence, this D47 card should remain held.

## Verification Command

Use the implementation plan's narrowest relevant test set, expected to include:

`npm test -- src/domain/sessionBuilder.test.ts src/domain/sessionAssembly/__tests__/focusReadiness.test.ts src/data/__tests__/catalogValidation.test.ts src/data/__tests__/progressions.test.ts src/domain/__tests__/generatedPlanDiagnosticTriage.test.ts`

After any catalog or generator-affecting implementation, also run:

`npm run diagnostics:report:check`

## Checkpoint Criteria

- D47 must first beat the D05 comparator on causal warrant, athlete-facing session value, minimality, and no-change.
- The implementation plan must choose whether the fill is a new sibling drill/variant, a block-shape/generator selection change, or a no-change/comparator exit.
- Any new drill IDs must be collision-checked and recorded in an activation manifest with exact source references and adaptation deltas.
- Do not widen existing D47 caps unless a separate workload/cap proposal justifies that path.
- Stop if source review cannot support a 1-2 player open-court adaptation that is materially different from current FIVB 4.7 D47.

## Activation Manifest Stub

- **Included gap card IDs:** `gap-d47-advanced-setting-conditioning-depth`
- **Candidate changed catalog IDs:** proposed `d49`, `d49-solo-open`, `d49-pair-open`
- **Cap delta:** likely `+1` drill record if implemented as a sibling; `0` if implementation instead routes to generator/block-shape/no-change.
- **Exact source references:** Better at Beach setting drills page, JVA setting habits page, TAOCV `Set and Go` page, plus existing FIVB 4.7 D47 boundary.
- **Adaptation deltas:** solo and pair open-court adaptations must preserve repeated out-of-system setting movement and target quality without importing 3+ player source forms into M001.
- **Verification:** see command above.
- **Checkpoint before next activation batch:** D47 comparator must pass, source review must approve the 1-2 player adaptation, and regenerated diagnostics must show the intended D47 movement without creating new hard failures.
