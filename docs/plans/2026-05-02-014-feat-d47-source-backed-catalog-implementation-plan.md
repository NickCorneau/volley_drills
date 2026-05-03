---
id: d47-source-backed-catalog-implementation-plan-2026-05-02
title: "feat: Add D47 Source-Backed Catalog Implementation"
type: plan
status: complete
stage: validation
summary: "Completed implementation plan for turning the D47-winning comparator payload into a bounded source-backed catalog addition: D49 advanced setting/movement siblings plus a narrow selection path for longer advanced setting main-skill blocks. Regenerated diagnostics now treat the original D47 comparator key as closed_by_d49 with residual D49 follow-up."
date: 2026-05-02
origin: docs/reviews/2026-05-02-d47-d05-comparator-evaluation-payload.md
depends_on:
  - docs/reviews/2026-05-02-d47-d05-comparator-evaluation-payload.md
  - docs/reviews/2026-05-02-d47-source-backed-gap-card.md
  - docs/reviews/2026-05-01-generated-plan-diagnostics-triage.md
  - docs/reviews/2026-04-30-focus-coverage-gap-cards.md
  - docs/ops/workload-envelope-authoring-guide.md
  - app/src/data/drills.ts
  - app/src/data/progressions.ts
  - app/src/domain/sessionAssembly/candidates.ts
  - app/src/domain/sessionBuilder.ts
---

# feat: Add D47 Source-Backed Catalog Implementation

## Overview

Implement the first catalog gap-closing slice unlocked by the generated diagnostics workflow: a D47-adjacent, source-backed advanced setting/movement conditioning family. The intended implementation adds a new `d49` drill with `d49-solo-open` and `d49-pair-open` variants, connects it to the setting progression chain, and adds a narrow selection-path rule so longer advanced setting main-skill allocations can choose the new surface instead of stretching `d47-solo-open`.

This plan turns D47 into catalog implementation work, but it does not broaden the app's product surface. D05 remains the re-entry comparator if source/adaptation review fails, if `d49` cannot be made honest for 1-2 players, or if regenerated diagnostics do not move the intended D47 pressure.

---

## Problem Frame

The D47-vs-D05 comparator evaluation payload selects `d47_wins`, while preserving `authorizationStatus: not_authorized`. The D47 source-backed gap card names a plausible content-depth gap: current `d47` is a short 5-9 minute four-location setting variability drill, but generated advanced setting sessions sometimes ask for longer repeated movement and set-quality work under fatigue.

Adding a drill record alone is insufficient. Current session assembly can still keep selecting `d47-solo-open` for the same long main-skill blocks unless the implementation includes a bounded selection path that prefers the new surface when it is the better duration fit. The product goal is to improve training honesty and session quality, not to clear diagnostic counts by adding arbitrary catalog rows.

---

## Requirements Trace

- R1. Use `docs/reviews/2026-05-02-d47-d05-comparator-evaluation-payload.md` as the planning authorization source; the payload selects D47 but does not authorize unbounded catalog/runtime work.
- R2. Use `docs/reviews/2026-05-02-d47-source-backed-gap-card.md` as the source/adaptation input.
- R3. Add a distinct D49-style drill family only if it remains materially different from FIVB 4.7 `d47` and fits 1-2 player M001 use.
- R4. Do not widen `d47-solo-open` or `d47-pair-open` workload caps.
- R5. Keep 3+ player source forms out of M001: Better at Beach `Triangle Setting`, `Hand Dig, Set, Set`, `Pass, set, set, set, catch`, and TAOCV source-form `Set and Go` remain supporting context only.
- R6. Add exact changed IDs, source references, adaptation deltas, verification command, and checkpoint criteria to an activation manifest.
- R7. Add catalog validation/progression coverage for any new drill and variant IDs.
- R8. Require an explicit activation gate after the source/adaptation manifest and before catalog code changes. If the gate fails, stop and route to D05/no-change instead of implementing D49.
- R9. Add a narrow selection-path rule so longer advanced setting/movement main-skill allocations can prefer the new D49 surface when it can honestly carry the planned duration.
- R10. Preserve existing non-D01 duration-fit behavior outside the targeted D47/advanced-setting case.
- R11. Require athlete-facing session quality, not just diagnostic movement: generated advanced setting sessions must read as believable courtside practices with interval/rest structure that protects set quality.
- R12. Regenerate generated diagnostics and update routing docs only after implementation proves the intended movement or records a failed/no-change result.

---

## Scope Boundaries

- Do not edit Dexie schema, app routes, UI screens, PWA configuration, or deployment code.
- Do not add new skill taxonomy values; use existing `set`, `movement`, and optionally `conditioning` only if the catalog tests and product copy justify it.
- Do not introduce a generic duration-fit reranking for every main-skill drill.
- Do not change D01, D05, D25, D33, D46, D47, or D48 workload caps as part of this slice.
- Do not activate drills that require 3+ players or many balls.
- Do not claim source-backed content fixes diagnostics unless regenerated diagnostics show the intended movement.

### Deferred to Follow-Up Work

- D05 workload/block-shape work if D47 fails source/adaptation or generated diagnostics.
- U6 catalog impact preview until the new D49 candidate and diagnostics result exist.
- 3+ player setting drills until the D101 boundary changes.
- A broader scenario taxonomy for out-of-system or conditioning surfaces.

## Activation Gate

U1 must produce an explicit `activationDecision` before U2 begins.

**Pass criteria:**

- Solo and pair adaptations are materially different from current FIVB 4.7 D47.
- Both variants remain M001-compatible: 1-2 players, one ball, markers allowed, no 3+ player source form, no many-ball assumption.
- Source references support repeated out-of-system setting movement and target-quality work under fatigue without requiring a team-size drill.
- The proposed workload includes interval/rest or round structure that protects set quality.
- The manifest keeps D47 cap widening rejected and D05 re-entry visible.

**Fail criteria:**

- Source review cannot support an honest 1-2 player adaptation.
- The candidate is only longer D47 with new copy.
- The candidate would require many balls, 3+ players, net/line assumptions outside supported setup, or a new product capability.
- The plan cannot explain why the courtside session is better for the athlete than leaving D47 as-is.

If the gate fails, stop before U2 and follow the D05 Re-entry Procedure below.

## Product Acceptance Criteria

Completion requires both diagnostic and athlete-facing evidence:

- The generated 15/25/40-minute advanced setting practice reads as a believable courtside session, not a diagnostic-count hack.
- D49 copy includes round, interval, or reset structure that helps the athlete protect set quality under fatigue.
- D49 has a concrete success metric that can be captured with existing app surfaces.
- Regenerated diagnostics do not create new hard failures or hide the D47 pressure behind a worse over-cap block.
- The final docs state whether the D47 plan succeeded, held, or routed to D05.

## D05 Re-entry Procedure

If U1 activation gate fails, U3 cannot prove selection-path movement, or U4 diagnostics do not move as intended:

- Mark this plan `blocked` or `held` with the failed trigger.
- Update generated triage/routing docs to preserve `not_authorized` and name the failed D47 trigger.
- Route the follow-up artifact to a D05 workload/block-shape or source-backed proposal rather than continuing D49 implementation.
- Keep `docs/reviews/2026-05-02-d47-source-backed-gap-card.md` active as held evidence, not activation.

---

## Context & Research

### Local Patterns

- `app/src/data/drills.ts` owns static drill records. Existing FIVB-backed advanced additions (`d46`, `d47`, `d48`) use source comments above the drill, low-equipment variants, one-ball constraints, `m001Candidate: true`, and `markers: true` rather than `needsCones`/`balls: many`.
- `app/src/data/progressions.ts` owns progression chains. `chain-7-setting` currently runs `d42 -> d47 -> d48`; D49 should be added as an advanced sibling/lateral or progression branch without making the chain look strictly linear.
- `app/src/domain/sessionAssembly/candidates.ts` owns candidate filtering and duration-fit preference. Current duration-fit rerouting is intentionally narrow for D01 and should remain narrow.
- `app/src/domain/sessionBuilder.ts` applies redistribution after required/optional selection. The D47 pressure lives here because redistributed minutes can stretch an already-selected main-skill block.
- `app/src/domain/sessionBuilder.test.ts`, `app/src/data/__tests__/catalogValidation.test.ts`, `app/src/data/__tests__/progressions.test.ts`, `app/src/domain/__tests__/generatedPlanDiagnostics.test.ts`, and `app/src/domain/__tests__/generatedPlanDiagnosticTriage.test.ts` are the focused behavioral surfaces.

### Source Evidence

- Better at Beach, `Every drill you need to become the best beach volleyball setter`: supports solo setter footwork/repetition through `Dip, dip, lift`; 3+ player drills are explicitly outside this slice.
- Junior Volleyball Association, `Setting Drills to Train Proper Technique and Eliminate Bad Habits`: supports out-of-system, side-to-side, and up-and-back timed setting movement, including short timed intervals and high-ball return to target.
- The Art of Coaching Volleyball, `Set and go drill for high energy set training`: supports the training problem of setting under fatigue, movement, quick decisions, multiple setting positions, and conditioning, but its source form requires team-size adaptation.
- FIVB Drill-book 4.7 remains the current D47 boundary: varied starting/pass-quality setting problem, not longer fatigue-conditioning volume.

### Institutional Learnings

- `docs/reviews/2026-04-30-focus-coverage-gap-cards.md` requires an activation manifest before future catalog activation.
- `docs/ops/workload-envelope-authoring-guide.md` says generated observations are evidence, not permission to mutate caps or catalog blindly.
- There is still no `docs/solutions/` learning for this diagnostic-to-catalog path; capture one after successful implementation if the pattern holds.

---

## Key Technical Decisions

- Add a new drill family rather than widening D47: D47's source boundary is four-location variability; D49 should represent repeated out-of-system movement and set quality under fatigue.
- Keep the new variants M001-compatible: one ball, markers allowed, open-court, solo and pair, no wall/net requirement.
- Prefer `skillFocus: ['set', 'movement']` unless implementation review finds a strong reason to include `conditioning`. The training problem is conditioning-shaped, but the app currently uses `conditioning` sparingly and no new focus should be exposed.
- Add a targeted duration-fit rule for advanced setting/movement main-skill slots, not a global reranker.
- Increase `SESSION_ASSEMBLY_ALGORITHM_VERSION` if generated session output changes.

---

## Open Questions

### Resolved During Planning

- Should D49 be catalog-only? No. Without a selection path, diagnostics may not move.
- Should D47 caps be widened? No. The gap card explicitly rejects this.
- Should TAOCV Set and Go be copied directly? No. It is supporting rationale only because the source form assumes four players.

### Deferred to Implementation

- Exact D49 drill name and short name can be finalized while authoring copy, but should communicate repeated out-of-system setting recovery without sounding like a generic conditioning workout.
- Exact workload caps should be validated against source/adaptation and diagnostics; initial target is longer than D47 but still fatigue-aware.
- Exact chain link direction can be lateral or progression from D47 depending on final authoring, but must not erase D48's post-set look/call branch.

---

## Implementation Units

- [x] U1. **Add Source/Activation Manifest And Activation Gate**

**Goal:** Record the exact source-backed activation decision and pass/fail gate before touching catalog data.

**Requirements:** R1, R2, R5, R6, R8, R11.

**Dependencies:** None.

**Files:**
- Create: `docs/reviews/2026-05-02-d49-source-backed-activation-manifest.md`
- Modify: `docs/catalog.json`

**Approach:**
- Name gap card `gap-d47-advanced-setting-conditioning-depth`.
- Name changed IDs `d49`, `d49-solo-open`, `d49-pair-open`.
- Record exact source references and the adaptation deltas for solo and pair.
- Explicitly reject 3+ player source forms and direct D47 cap widening.
- Add `activationDecision: authorized_for_d49_implementation` only if all Activation Gate pass criteria are met.
- If the gate fails, mark the manifest `blocked` and stop before U2.

**Execution note:** Docs-first before code.

**Patterns to follow:**
- `docs/reviews/2026-04-30-focus-coverage-gap-cards.md` activation batch manifest.
- `docs/reviews/2026-05-02-d47-source-backed-gap-card.md`.

**Test scenarios:** None; validated by docs validation.

**Verification:** `bash scripts/validate-agent-docs.sh`.

---

- [x] U2. **Add D49 Catalog Family And Progression Links**

**Goal:** Add a source-backed advanced setting/movement drill family with solo and pair open variants that pass catalog and progression validation.

**Requirements:** R3, R4, R5, R6, R7, R8, R11.

**Dependencies:** U1 activation gate must pass.

**Files:**
- Modify: `app/src/data/drills.ts`
- Modify: `app/src/data/progressions.ts`
- Modify: `app/src/data/__tests__/catalogValidation.test.ts`
- Modify: `app/src/data/__tests__/progressions.test.ts`

**Approach:**
- Add `d49` near the setting chain records after D48 or adjacent to D47/D48 source comments.
- Author variants:
  - `d49-solo-open`: self-toss / target-window / recover-to-home marker repeated in timed rounds.
  - `d49-pair-open`: partner toss from end-line/off-net/side-line markers, setter recovers and repeats.
- Keep equipment to one ball plus markers; avoid `needsCones`, `needsLines`, `balls: many`.
- Include round/rest or interval copy so the longer block protects set quality.
- Add `d49` to `DRILLS` and `chain-7-setting`.
- Add progression/lateral links that preserve D48 as the read/vision branch.

**Execution note:** Test-first where practical: add explicit catalog/progression assertions for D49 before authoring or in the same narrow edit if tests cannot compile without the record.

**Patterns to follow:**
- `d46`, `d47`, and `d48` in `app/src/data/drills.ts`.
- `chain-7-setting` in `app/src/data/progressions.ts`.

**Test scenarios:**
- Happy path: catalog validation accepts current authored catalog after D49.
- Happy path: D49 has exactly `d49-solo-open` and `d49-pair-open`.
- Edge case: variants remain M001-selectable for solo/pair open contexts without unmodeled requirements.
- Edge case: courtside instructions include a reset/round structure rather than uninterrupted fatigue volume.
- Regression: D47 workload caps remain unchanged at 5-9 minutes.

**Verification:** `npm test -- src/data/__tests__/catalogValidation.test.ts src/data/__tests__/progressions.test.ts`.

---

- [x] U3. **Add Bounded Advanced Setting Selection Path**

**Goal:** Let longer advanced setting main-skill blocks prefer D49 when the current D47/D48-style pick cannot honestly carry the planned duration.

**Requirements:** R9, R10, R11, R12.

**Dependencies:** U2.

**Files:**
- Modify: `app/src/domain/sessionAssembly/candidates.ts`
- Modify: `app/src/domain/sessionBuilder.ts`
- Modify: `app/src/domain/sessionBuilder.test.ts`

**Approach:**
- Add a small predicate for advanced setting/movement duration-fit pressure, scoped to main-skill slots with set focus / advanced level and current pick in the D47/D48 neighborhood.
- Reuse existing `candidateCanCarryTargetDuration()` and `pickForSlot(... preferTargetDurationFit: true)` mechanics where possible.
- Preserve existing D01 reroute behavior and non-D01 default behavior outside this targeted case.
- Increment `SESSION_ASSEMBLY_ALGORITHM_VERSION` if golden output changes.

**Execution note:** Characterization-first. Keep the existing "does not apply target-duration preference to non-D01 main-skill defaults" invariant, then add the new D47-specific exception.

**Patterns to follow:**
- D01 duration-fit reroute in `app/src/domain/sessionBuilder.ts`.
- Duration-fit tests in `app/src/domain/sessionBuilder.test.ts`.

**Test scenarios:**
- Happy path: an advanced setting main-skill selection that initially lands on D47/D48 and is stretched beyond its cap can reroute to D49 when D49 can carry the target duration.
- Happy path: the resulting advanced setting session reads as a believable courtside practice with D49's reset/round structure.
- Regression: beginner/intermediate pass/serve main-skill behavior is unchanged.
- Regression: non-main slots do not use the new duration-fit rule.
- Regression: non-D47/D48 non-D01 main-skill defaults remain unchanged unless they match the explicit advanced setting predicate.

**Verification:** `npm test -- src/domain/sessionBuilder.test.ts`.

---

- [x] U4. **Refresh Generated Diagnostics And Routing Docs**

**Goal:** Regenerate diagnostics, record whether D47 pressure moved as expected, and keep machine-readable routing accurate.

**Requirements:** R1, R6, R11, R12.

**Dependencies:** U2, U3.

**Files:**
- Modify generated output: `docs/reviews/2026-05-01-generated-plan-diagnostics-report.md`
- Modify generated output: `docs/reviews/2026-05-01-generated-plan-diagnostics-triage.md`
- Modify: `app/scripts/validate-generated-plan-diagnostics-report.mjs`
- Modify: `docs/catalog.json`
- Modify: `docs/plans/2026-05-02-014-feat-d47-source-backed-catalog-implementation-plan.md`

**Approach:**
- Run diagnostics update after code changes.
- If D47 pressure moves as expected, record the D49 activation and selection-path result.
- If diagnostics do not move, record D05 re-entry or a no-change/hold result instead of claiming success.
- Check product acceptance criteria before marking complete.
- Mark this plan complete only after verification.

**Execution note:** Generated docs should be regenerated from scripts, not hand-edited except for catalog/plan metadata.

**Patterns to follow:**
- `app/scripts/validate-generated-plan-diagnostics-report.mjs`.
- Prior generated-diagnostics plan completions in `docs/plans/2026-05-02-013-feat-d47-d05-comparator-evaluation-payload-plan.md`.

**Test scenarios:**
- Happy path: generated diagnostics report/triage are current.
- Edge case: if D49 does not move D47 pressure, triage remains honest and routes to re-entry instead of success language.
- Regression: docs do not claim success from diagnostic movement alone without athlete-facing session-quality criteria.

**Verification:**
- `npm run diagnostics:report:update`
- `npm run diagnostics:report:check`
- `bash scripts/validate-agent-docs.sh`

---

## Implementation Result

Completed. D49 is now the bounded source-backed advanced setting/movement sibling for longer setting blocks. Regenerated diagnostics show the original D47 optional-redistribution comparator key is gone and the D47 ledger is `closed_by_d49`; residual long-session setting pressure now appears on D49 and should be handled as D49 workload/redistribution follow-up, not as stale D47 evidence.

---

## System-Wide Impact

- **Catalog:** Adds one drill family and two variants if source/adaptation checks hold.
- **Session assembly:** Adds a narrow advanced setting duration-fit path; avoids global reranking.
- **Diagnostics:** Expected D47 pressure reduction for longer advanced setting/movement main-skill cells; no hard-failure increase allowed.
- **Docs:** Adds activation manifest, registers new plan/manifest, refreshes generated report/triage.
- **Unchanged:** Dexie schema, UI, app routes, persistence, Cloudflare deploy config, D47 caps, D05 caps, and D101 boundary.

---

## Risks & Dependencies

| Risk | Mitigation |
|------|------------|
| D49 becomes generic conditioning instead of volleyball-specific setting work. | Keep source/adaptation copy focused on out-of-system setting movement and target quality. |
| D49 does not move diagnostics because selection still picks D47. | U3 adds a bounded selection-path test and diagnostics verification. |
| New selection rule changes unrelated drills. | Predicate is scoped to advanced setting/movement main-skill D47/D48 neighborhood. |
| 3+ player source forms leak into M001. | Manifest and catalog copy explicitly reject those source forms. |
| D05 gets forgotten. | D05 re-enters if D47 source/adaptation or diagnostics fail. |

---

## Verification Plan

From `app/`:

`npm test -- src/data/__tests__/catalogValidation.test.ts src/data/__tests__/progressions.test.ts src/domain/sessionBuilder.test.ts src/domain/__tests__/generatedPlanDiagnostics.test.ts src/domain/__tests__/generatedPlanDiagnosticTriage.test.ts`

Then:

`npm run diagnostics:report:update`

`npm run diagnostics:report:check`

From repo root:

`bash scripts/validate-agent-docs.sh`

Also run `ReadLints` on touched TS/JS files after substantive edits.

---

## Sources & References

- `docs/reviews/2026-05-02-d47-d05-comparator-evaluation-payload.md`
- `docs/reviews/2026-05-02-d47-source-backed-gap-card.md`
- `docs/reviews/2026-04-30-focus-coverage-gap-cards.md`
- `docs/reviews/2026-05-01-generated-plan-diagnostics-triage.md`
- Better at Beach, `Every drill you need to become the best beach volleyball setter`
- Junior Volleyball Association, `Setting Drills to Train Proper Technique and Eliminate Bad Habits`
- The Art of Coaching Volleyball, `Set and go drill for high energy set training`
