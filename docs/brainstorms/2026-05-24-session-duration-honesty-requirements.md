---
id: session-duration-honesty-requirements-2026-05-24
title: "Session Duration Honesty (uncapped-redistribution fix + optional-slot pass fallback + Setup duration surface) — Requirements"
status: active
stage: validation
type: requirements
summary: "Requirements for ending the assembler's silent duration redistribution: replace the uncapped surplus-onto-main_skill dump with upstream slot-skip; under named focus, let dropping-eligible optional slots fall back to their authored skillTags before dropping; show the real assembled duration at Setup using the same draft/seed Run will execute, and warn when the gap to the named profile is large. Ships engine-first (kills the live 24-min serve drill bug, lifts serve+pair_net+40 from ~23 to ~37 min in the probe), Setup honesty UI as the second stage of the same slice."
authority: "Requirements only. Authorizes (a) the engine truncation of the uncapped redistribution path, (b) a narrow effectiveSkillTags policy refinement for dropping-eligible optional slots under named focus, (c) build-once-or-seed-pinning of the Setup-time draft, (d) a Setup-time real-duration display + large-gap guard, (e) source-backed reroute intent re-validation under honest durations, (f) diagnostic surface replacement of optional_slot_redistribution with a slot-dropped / under-duration finding, and (g) D139 diagnostics report regen as definition-of-done. Does NOT authorize new drill content, repeat-drill policy, cross-focus mixing for required slots, ended_early misclassification fix, mid-session extend (F1), custom durations, or modifications to the warmup/wrap snap mechanism itself. Activation requires an implementation plan plus regenerated diagnostics confirming intended movement and reroute intent."
last_updated: 2026-05-24
depends_on:
 - docs/research/2026-05-04-pair-serving-session-feedback.md
 - docs/research/2026-05-10-pair-net-serving-duration-feedback.md
 - docs/research/2026-05-22-mid-session-extend-and-content-asks-feedback.md
 - docs/brainstorms/2026-05-02-generated-diagnostics-d01-redistribution-handoff-requirements.md
 - docs/brainstorms/2026-05-04-long-envelope-drill-floor-enforcement-requirements.md
 - docs/brainstorms/2026-05-04-d51-beginner-serving-tactical-zone-depth-requirements.md
 - app/src/domain/sessionBuilder.ts
 - app/src/domain/sessionAssembly/snapDurations.ts
 - app/src/domain/sessionAssembly/effectiveFocus.ts
 - app/src/domain/sessionAssembly/sourceBackedReroutes.ts
 - app/src/data/archetypes.ts
---

# Session Duration Honesty — Requirements

## Summary

Replace the uncapped surplus-onto-`main_skill` redistribution with upstream slot-skip; under named focus, let dropping-eligible optional slots fall back to their authored `skillTags` before dropping; show the real assembled duration at Setup using the same draft/seed Run executes, with a guard / warning when the gap to the named profile is large. Engine fix ships first; Setup honesty UI is the second stage of the same requirements slice.

---

## Problem Frame

The current generator-side duration budget silently lies in one specific direction. When optional slots (`pressure`, `movement_proxy`) under named focus find no candidate, `sessionBuilder` drops them but redistributes their allocated minutes onto the `main_skill` block with no cap. On `serve + pair_net + 40`, a representative probe reproduces 40 of 40 sessions with a `main_skill` block of 18–24 minutes — a single drill running roughly half the session — while pass / set / Recommended focuses are unaffected (0 of 40 each). The diagnostic surface (`optional_slot_redistribution`) sees the redistribution but classifies it as observation-only, so the defect ships.

The 2026-05-04 and 2026-05-10 founder + Seb pair + net field reports both name this in courtside terms: "warmup timing still wrong" and "too many minutes for drills." The 2026-05-22 capture compounded the picture: Seb's mid-session "extend with a different focus" ask was the workaround for the same load-bearing read — the chosen profile delivered a session shape that did not match what the user wanted to do. The 2026-05-13 warmup/wrap snap already addressed the warmup-dead-air axis (v6 → v7); the duration-budget axis remains live.

Removing the uncapped redistribution alone honestly lifts the curtain but lands a different surprise: serve focus then honestly delivers ~23–29 minutes on a "40-minute" profile, depending on which optional slots drop. The slot definitions in `app/src/data/archetypes.ts` already carry authored `skillTags` fallback (`['pass']` on `movement_proxy`, `['pass','serve']` on `pressure`), but `effectiveSkillTags` intentionally suppresses them under named focus. Letting that authored fallback fire when an optional slot would otherwise drop lifts the same scenario back to ~37 minutes / 6 honest blocks — the real "truth plus a usable session" shape — without authoring any new content. The Setup surface then makes the residual gap visible at commit time using the exact draft and seed that Run executes, so what the user sees is what they get.

---

## Actors

- A1. **Founder (and partner Seb)**: End-user of the assembled session. Currently experiences the 24-min serve drill in named-focus serve sessions; under this slice experiences a honest session length (most sessions at the named profile, named-focus serve sessions at the assembled length until catalog fills).
- A2. **Agent implementer**: Lands the engine truncation, the pass-fallback policy refinement, the seed-pinned Setup draft, the duration-display + large-gap guard, the reroute intent re-validation, and the diagnostics report regen.
- A3. **Generated-diagnostics workbench (and the founder reading it)**: Loses the `optional_slot_redistribution` observation surface and gains a slot-dropped / under-duration finding as the catalog-coverage signal.

---

## Key Flows

- F1. Honest assembly under named focus
  - **Trigger:** A1 commits Setup with `focus = serve`, `level = beginner`, `profile = 40 min`, `pair_net` archetype.
  - **Actors:** A1, A2
  - **Steps:** The builder iterates the layout's required slots first, then optional slots. For each optional slot, the focused-catalog selection runs first; if no candidate is found, the slot's authored `skillTags` fallback runs as a second attempt; if still no candidate, the slot is dropped and its allocated minutes are not redistributed. The final draft is the sum of the actually-selected blocks at their authored / snapped durations.
  - **Outcome:** No block exceeds its authored cap; total session length is the honest sum of resolved blocks; no surplus is dumped onto any block.
  - **Covered by:** R1, R2, R3, R4, R5, R6

- F2. Setup-time duration honesty
  - **Trigger:** A1 finishes picking focus / level / profile at Setup and reaches the commit moment.
  - **Actors:** A1, A2
  - **Steps:** Setup assembles the draft once (or pins the seed); the assembled total duration is displayed to A1 before commit; if the gap between the named profile and the assembled total crosses a threshold, a large-gap guard surfaces (the exact UI affordance — warning text, blocked commit, alternative-profile nudge — is Phase 3 planning territory); on commit, Run executes the same draft / pinned-seed assembly so the displayed duration is the delivered duration.
  - **Outcome:** The duration A1 sees at commit is the duration Run will deliver. A1 is not surprised mid-session by a session that was shorter than the named profile name.
  - **Covered by:** R7, R8, R9, R10

- F3. Source-backed reroute intent re-validation
  - **Trigger:** A2 lands the engine truncation + pass-fallback and runs the reroute test suite plus the generated-diagnostics workbench.
  - **Actors:** A2, A3
  - **Steps:** `redistributedMinutes` is approximately zero in steady state, so `plannedDurationMinutes` collapses to base allocation almost always. A2 confirms that each source-backed reroute (D01 duration-fit; D49 / D50 / D51 long-envelope) still fires for the right reason under honest durations — reroute to a drill that fits the real allocated duration — rather than disappearing as a side effect or firing on a stale inflated-duration signal.
  - **Outcome:** Each reroute's product intent is confirmed under the honest-duration regime, not merely "the suite stays green."
  - **Covered by:** R11, R12

---

## Requirements

**Engine truncation (Stage 1 — ships first)**

- R1. The assembler shall not redistribute the allocated minutes of a dropped optional slot onto any other block. The legacy `redistributedMinutes`-onto-`main_skill` path is removed.
- R2. `main_skill` block durations shall never exceed the authored slot / variant maximums. The block duration is the snapped / authored value, with no surplus uplift.
- R3. Total assembled session duration shall equal the sum of selected blocks' authored / snapped durations. Sessions run shorter than the named profile when the catalog cannot fill optional slots.
- R4. Assembly remains deterministic per seed. A given (context, seed) tuple produces the same draft before and after this slice up to the explicit behavior changes named here.

**Optional-slot pass fallback (Stage 1 — ships first)**

- R5. Under named focus, when a dropping-eligible optional slot finds no candidate from its focused `skillTags`, the assembler shall retry candidate selection using the slot's authored `skillTags` fallback before dropping. This refinement applies only to optional slots and only on the would-otherwise-drop path; it does not replace successful focused picks.
- R6. Required slots (`warmup`, `technique`, `main_skill`, `wrap`) shall not gain any fallback behavior from this slice. Their existing `allowUsedFallback: true` reuse path is unchanged.

**Setup-time honesty surface (Stage 2 — ships second, depends on R1–R6)**

- R7. Setup shall display the real assembled total duration to the user before commit, derived from the exact draft Run will execute.
- R8. The Setup-displayed duration shall be derived from the same draft / pinned seed used at Run, so the displayed number is the delivered number. Either build-once-and-pin, or pin the seed across Setup → Run such that re-assembly produces an identical draft.
- R9. When the gap between the named profile and the assembled total duration crosses a threshold, the UI shall surface a large-gap guard. The exact guard affordance (warning text, blocked commit, suggested alternative) and the threshold value are deferred to planning.
- R10. The Setup duration surface shall not require the user to take an additional action to see the duration. The displayed number is visible at the existing Setup commit moment, not gated behind a secondary disclosure.

**Source-backed reroute intent re-validation (Stage 1 definition-of-done)**

- R11. Implementation shall confirm that D01 duration-fit, D49 / D50 / D51 long-envelope, and any other `shouldRerouteForSourceBackedSibling`-driven reroute still fires for the right reason under honest durations. "Re-validate intent" means the reroute targets a drill that fits the real allocated duration; a reroute that disappears entirely because the inflated trigger no longer fires must be examined as a behavior change, not assumed to silently resolve.
- R12. The reroute re-validation shall produce either (a) confirmation that intent holds and the suite captures the new behavior, or (b) a named follow-up brainstorm / plan if intent shifts. Stage 1 does not ship without R11 + R12 closed.

**Diagnostics surface and regen (Stage 1 definition-of-done)**

- R13. The `optional_slot_redistribution` diagnostic finding shall be replaced by (or supplemented with) a new finding that surfaces dropped slots and under-named-profile session durations as the founder's catalog-coverage signal. Exact finding name and grouping fingerprint are deferred to planning.
- R14. The D139 `diagnostics:report:check` gate shall pass at Stage 1 ship. `diagnostics:report:update` is bundled into the slice's definition-of-done; report fixtures are regenerated; `statusCounts` shifts are expected and accepted as part of this slice.
- R15. The session-assembly algorithm version shall bump (v7 → v8). Per-block durations, total session durations, and reroute firing all shift materially.

**Snap behavior (preserved — explicit no-op)**

- R16. The 2026-05-13 warmup/wrap snap (`snapWarmupWrapDurations` in `app/src/domain/sessionAssembly/snapDurations.ts`) and its "freed minutes redistribute into focus-priority work slots within their authored caps" behavior shall not be modified by this slice. The snap reallocates dead-air into capped practice and is a different mechanism in kind from the uncapped main_skill dump removed in R1.

---

## Acceptance Examples

- AE1. **Covers R1, R2, R3, R5.** Given `serve + pair_net + 40 + beginner` and a seed that previously produced a 24-min `main_skill` block with `pressure` and `movement_proxy` dropped, when the draft is built, then the assembler tries the pass fallback on each dropping-eligible optional slot, fills both with authored-fallback pass candidates, and produces 6 blocks at their authored / snapped durations summing to roughly the named profile (probe baseline: ~37 min). No block exceeds its authored cap.
- AE2. **Covers R1, R3, R5.** Given `serve + pair_net + 40 + beginner` and a seed where the pass fallback also cannot fill one optional slot, when the draft is built, then the unfillable slot is dropped, its allocated minutes are not redistributed, and the total session duration is the honest sum of resolved blocks (shorter than the named profile). The R13 diagnostic finding surfaces the dropped slot.
- AE3. **Covers R2, R6.** Given `serve + pair_net + 40` and a thin serve catalog where the required `technique` and `main_skill` slots resolve to the same serve drill via `allowUsedFallback: true`, when the draft is built, then both blocks land at their authored / snapped durations (no duration anomaly), and this case is recorded as a known content-quality residual owned by the coverage brainstorm — not a defect of this slice.
- AE4. **Covers R7, R8.** Given a user committing Setup with `serve + pair_net + 40`, when they reach the commit moment, then they see the real assembled total duration (e.g. "37 min" or "32 min") rather than only the named profile, and on Run the executed session runs the displayed duration to within ordinary timer tolerances.
- AE5. **Covers R9.** Given a configured large-gap threshold and a Setup state where the assembled duration falls more than the threshold below the named profile, when commit is reached, then the UI surfaces the large-gap guard before the session starts.
- AE6. **Covers R11, R12.** Given the D01 / D49 / D50 / D51 reroute paths under the post-slice engine, when the test suite + diagnostics workbench is regenerated, then each reroute's firing rationale under honest durations is named in the implementation plan's verification log — either as intent-preserved or as a follow-up finding — before Stage 1 ships.
- AE7. **Covers R14.** Given the engine truncation + pass fallback + diagnostic finding change have landed, when `npm run diagnostics:report:check` is run, then the gate passes against regenerated fixtures.

---

## Success Criteria

- A serve-focused `pair_net + 40` session never produces a `main_skill` block longer than its authored cap, in any seed; the live 24-min drill bug is gone.
- A serve-focused `pair_net + 40` session most often delivers approximately 6 honest blocks summing close to the named profile, and never inflates blocks past their authored caps; the residual gap is visible at Setup rather than mid-session.
- The founder, opening the app to run a serve session, no longer experiences the "warmup timing still wrong / too many minutes for drills" friction described in the 2026-05-04 and 2026-05-10 field reports — for the duration-budget axis specifically (the `ended_early` misclassification axis is owned by a separate slice).
- A downstream agent reading this doc plus `ce-plan` output can implement Stage 1 and Stage 2 with no further product / scope decisions to make. Reroute intent re-validation (R11–R12) and diagnostics regen (R13–R14) are explicitly in the slice's definition-of-done, not implicit cleanup.
- `npm run diagnostics:report:check` passes after Stage 1 ships; the D139 stale-fixture concern flagged in the just-committed pulse report is cleared as part of this slice.

---

## Scope Boundaries

- New serve / attack drills, repeat-drill policy, or letting required slots fall back across focus — all owned by the coverage brainstorm that follows this slice, not authorized here.
- The `ended_early` misclassification (`buildEndedSession` in `app/src/domain/executionState.ts` marks the session ended_early when the wrap is skipped, triggering the "why did you shorten?" prompt) and the F1 mid-session-extend surface from the 2026-05-22 capture — paired into a separate brainstorm next, since they share the same `buildEndedSession` code path and the same product question ("what counts as completed?").
- Custom session durations (`D135` feature-wish; gated on fixed-profile readiness, which this work strengthens but does not fully unblock).
- The 2026-05-13 warmup/wrap snap mechanism itself, including its existing cap-respecting redistribution into work slots. Explicitly out of scope per R16.
- The D01 redistribution handoff brainstorm and the d49/d50/d51 floor enforcement brainstorm — both continue on their own tracks. This slice may surface findings via R11–R12 that fold back into those tracks; it does not consume or replace them.
- UI copy details, exact large-gap threshold, exact Setup placement of the duration display, exact new diagnostic finding name — all Phase 3 planning territory.
- Modifications to the candidate pool for swap alternatives, recovery sessions, or non-`main_skill` redistribution targets.

---

## Key Decisions

- **Engine mechanism: upstream skip, not cap-and-spread.** Cap-and-truncate and cap-and-spread both leave the redistribution path conceptually alive; upstream skip removes the buggy mechanism rather than constraining it. Cleaner contract: "session length = sum of selected blocks at their authored / snapped durations."
- **Pass fallback in scope as a policy refinement to `effectiveSkillTags`, not a content add.** The authored slot `skillTags` already carry the fallback; the named-focus suppression is intentional today but produces a 23–29-min serve session courtside. Honoring the authored fallback only on the dropping-eligible path lifts the same scenario to ~37 min without any content authoring.
- **Snap-spread stays.** Snap-spread reallocates dead-air into work slots within authored caps — every block's displayed duration matches its real run duration. Different mechanism in kind from the uncapped main_skill dump; truncating it for "consistency" would throw away usable minutes that fit inside authored caps.
- **Setup duration display uses the exact run draft / pinned seed.** A previewed duration that differs from the executed duration is itself a lie; the honesty surface undermines itself without this guarantee.
- **Source-backed reroute intent re-validation is in the slice, not deferred.** Removing redistribution changes the `plannedDurationMinutes` signal feeding `shouldRerouteForSourceBackedSibling`. A green test suite is necessary but not sufficient; the reroute must still fire for the right reason under honest durations, or the change is a hidden behavior regression.
- **Diagnostics regen is definition-of-done.** Truncation pushes many cells under their named profile; `statusCounts` moves materially; D139's `diagnostics:report:check` will fail until regen runs. Bundling avoids the slice arriving in CI as an unforced break.
- **Two ship stages, one requirements slice.** Engine fix stops the live 24-min bug; Setup honesty UI is the larger half. With pass-fallback in scope, the interim gap after Stage 1 (≈ 37 of 40 min for serve focus) is small enough to ship without the Setup surface; the engine fix is not gated behind UI readiness. The two stages are real, not cosmetic.
- **Algorithm version bumps v7 → v8.** Per-block durations, total session durations, and reroute firing all shift materially. Golden snapshots will need regen alongside fixtures.

---

## Dependencies / Assumptions

- The slot definitions in `app/src/data/archetypes.ts` carry authored `skillTags` fallback (`['pass']` on `movement_proxy`, `['pass','serve']` on `pressure`). Verified against source. `effectiveSkillTags` currently suppresses these under named focus — the policy refinement in R5 flips that suppression only on the dropping-eligible path.
- Required-slot reuse residual: `selectSlot` calls `pickForSlot` with `allowUsedFallback: true` for required slots (`app/src/domain/sessionBuilder.ts:215`) and `false` for optional slots (`:225`). In a thin focused catalog, a required slot that finds no unused focused candidate reuses one rather than returning null, so total-assembly-failure is unlikely; the rare residual is that `technique` and `main_skill` can resolve to the same focused drill. Honest on duration, different in kind from this slice's bug, and owned by the coverage brainstorm. Named here so the "required slots are unaffected" framing of R6 does not read as "required slots are clean."
- The 2026-05-13 warmup/wrap snap (v6 → v7) already addressed the warmup-dead-air axis of the 2026-05-04 and 2026-05-10 field reports. This slice does not re-litigate that fix; field re-validation of the warmup axis is a separate, lower-effort confirmation that does not gate this slice.
- The probe values in this doc (~23–29 min truncation-only, ~37 min with pass fallback, 40/40 on `serve + pair_net + 40 + beginner`) are derived from a throwaway probe of the live v7 assembler. They are directional, not contract — actual numbers may shift slightly with current seeds.
- The D139 `diagnostics:report:check` gate was already flagged stale in the pulse report committed 2026-05-23 (`bc6831d`). This slice is the natural moment to refresh it; the dependency is real but not adversarial — regen is part of the slice's work.
- This slice does not depend on, nor is it blocked by, the `ended_early` misclassification brainstorm. Both can be sequenced independently.

---

## Outstanding Questions

### Deferred to Planning

- [Affects R5][Technical] Should the pass-fallback retry reuse the same `pickForSlot` call shape with a different `skillTags` argument, extend `effectiveSkillTags` with a fallback-aware mode, or live as a separate selection pass adjacent to the existing focused-then-fallback iteration? Each preserves R5's behavior; the right shape is a code-level call.
- [Affects R7, R8] Where in the Setup → Run transition does the draft get built and pinned — at the existing Setup commit, at a new pre-commit step, or at a dedicated `prepare` stage shared by Setup and Run? Each preserves R8's contract.
- [Affects R9] What threshold value should the large-gap guard use, and what affordance (inline warning, blocked commit, alternative-profile nudge) should it use? Both deferred to planning with a sensible default.
- [Affects R11, R12][Needs validation] Which specific reroutes are most likely to shift behavior under honest durations? Planning should enumerate the existing source-backed reroutes (D01 / D49 / D50 / D51 at minimum) and produce a per-reroute intent-confirmation note.
- [Affects R13] Exact diagnostic finding name and grouping fingerprint for the slot-dropped / under-duration surface. Bound to the existing `gpdg:v1:...` shape used by `generatedPlanDiagnostics`.
- [Affects R15] Golden-snapshot regen scope when bumping algorithm v7 → v8: every snapshot touching session-assembly outputs is likely affected; planning should enumerate before running the regen so unexpected breakage is flagged rather than absorbed.

---

## Next Steps

→ `/ce-plan docs/brainstorms/2026-05-24-session-duration-honesty-requirements.md` after optional `/ce-doc-review`.
