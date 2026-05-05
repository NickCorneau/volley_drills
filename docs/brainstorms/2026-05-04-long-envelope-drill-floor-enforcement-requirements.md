---
id: long-envelope-drill-floor-enforcement-requirements-2026-05-04
title: "Long-Envelope Drill Floor Enforcement (d49/d50/d51 under-min cleanup) — Requirements"
status: active
stage: validation
type: requirements
summary: "Requirements for adding lower-bound floor enforcement to the d49/d50/d51 selection path so long-envelope drills (8-14 min floors) are not selected for main-skill blocks below their honest minimum. Closes the under_authored_min selection-path debt the d50 and d51 ships introduced (~36 cells across d50-solo-open, d50-pair-open, d51-solo-open, d51-pair-open)."
authority: "Requirements only. Does not authorize catalog edits, workload metadata edits, runtime generator changes beyond the named selection-path floor check, U6 preview tooling, or D101 (3+ player) re-entry. Activation requires an implementation plan plus regenerated diagnostics confirming intended movement."
last_updated: 2026-05-04
depends_on:
  - docs/solutions/2026-05-04-source-backed-content-depth-activation-pattern.md
  - docs/plans/2026-05-04-003-feat-d50-advanced-passing-depth-plan.md
  - docs/plans/2026-05-04-004-feat-d51-beginner-serving-tactical-zone-depth-plan.md
  - docs/reviews/2026-05-01-generated-plan-diagnostics-triage.md
  - app/src/domain/sessionAssembly/candidates.ts
  - app/src/domain/sessionBuilder.ts
---

# Long-Envelope Drill Floor Enforcement — Requirements

## Purpose

Define the minimum credible selection-path change that prevents `d49`, `d50`, and `d51` (8-min-floor advanced/beginner long-envelope drills) from being selected for main_skill blocks whose target duration is below the drill's honest workload floor. Closes the `under_authored_min` selection-path debt the d50 and d51 ships introduced (~36 cells), without modifying drill workload envelopes, catalog content, or other selection paths.

This brainstorm describes a **selection-path cleanup**, not a content add. It is the natural follow-up to the d49/d50/d51 ships and extends the activation pattern doc with a "lower-bound floor enforcement" lesson.

## Problem Frame

The d50 and d51 selection-path reroutes prevent the *upper-bound* problem (drills over-stretched past their fatigue cap). They do NOT prevent the *lower-bound* problem: the long-envelope drill being selected for blocks below its honest minimum.

Concretely, post-d51 generated diagnostics show:

- `gpdg:v1:d50:d50-solo-open:main_skill:true:under_authored_min` — **12 cells** where d50 (8-min floor) was selected for blocks allocated < 8 min
- `gpdg:v1:d50:d50-pair-open:main_skill:true:under_authored_min` — **4 cells**
- `gpdg:v1:d51:d51-solo-open:main_skill:true:under_authored_min` — **16 cells**
- `gpdg:v1:d51:d51-pair-open:main_skill:true:under_authored_min` — **4 cells**
- (d49 has 12 d49-solo-open + 4 d49-pair-open under_authored_min cells in the same shape, pre-existing)

Total: **~52 cells** of selection-path debt where the wrong-shaped drill was picked.

These cells route to `defer` in the diagnostic kit, but the user-facing impact is real: a session with a 6-min beginner serving main_skill block that selects d51 (8-min floor) will under-cook the drill — either (a) the user runs 6 min of d51 and the drill feels incomplete, or (b) redistribution stretches the block to 8 min, fragmenting the rest of the session.

The right fix is a symmetric extension of the existing duration-fit logic: just as the reroute prevents `d31 → 12-min block` (upper-bound mismatch), a floor check should prevent `d51 → 6-min block` (lower-bound mismatch).

```mermaid
flowchart TB
  A[buildDraft: main_skill slot, 6 min target] --> B{pickForSlot with shuffle}
  B -->|Pre-fix: d51 happens to be pool[0]| C[d51 selected for 6-min block]
  B -->|With floor check: d51 floor=8 > target=6| D[d51 skipped]
  C --> E[Allocated 6 min < d51 floor 8 -> under_authored_min]
  D --> F[d31 selected -> fits 4-8 min cleanly]
```

## Requirements

- **R1.** Extend `findCandidates` (or `pickForSlot`) to filter out d49/d50/d51 from the candidate pool when the slot's target duration is below the drill's `workload.durationMinMinutes`. Applies only to `main_skill` slots since d49/d50/d51 are already main-skill-only.
- **R2.** The floor check must use the drill's authored `workload.durationMinMinutes`, not a hard-coded value. This keeps the rule honest if d49/d50/d51 floors change in the future.
- **R3.** The fix must NOT prevent d49/d50/d51 from being picked via the existing reroute when target duration ≥ floor. The reroute remains the primary entry point; the floor check is a guard against shuffle-driven selection for too-short blocks.
- **R4.** The fix must NOT change behavior for any other drill or slot type. d31, d46, d47, d48 remain unaffected for short blocks (their floors fit). Non-main_skill slots remain unaffected.
- **R5.** Activation must include regenerated diagnostics showing intended movement: d49 / d50 / d51 `under_authored_min` group cell counts must drop. Revert if movement is incorrect or if the fix causes new pressure_remains cells to appear (which would suggest blocks now redistribute differently and create new upper-bound problems).
- **R6.** Extend `docs/solutions/2026-05-04-source-backed-content-depth-activation-pattern.md` with a new "lower-bound floor enforcement" lesson capturing this pattern as the natural follow-up to source-backed activations.

## Source Evidence

This is selection-path debt, not source-backed content depth. The "source" is the diagnostic kit itself:

- `app/src/domain/generatedPlanDiagnosticTriage.ts` `compressionLaneForGeneratedPlanTriageItem` — already routes `main_skill + under_authored_min` to `workload_envelope_review`, but the underlying *selection* is what should be corrected.
- Post-d51 diagnostic regeneration (`docs/reviews/2026-05-01-generated-plan-diagnostics-triage.md`) shows the cell counts cited in the Problem Frame.
- `docs/plans/2026-05-04-003-feat-d50-advanced-passing-depth-plan.md` `## Implementation Result` section flagged the d50 under-min cells; same flag applied to d51 in `docs/plans/2026-05-04-004-feat-d51-beginner-serving-tactical-zone-depth-plan.md`.

## Selection-Path Hypothesis

Current `pickForSlot` for a 6-min beginner serving main_skill slot:

1. `findCandidates` returns pool including d31 (4-8 min) AND d51 (8-14 min). Both pass the level/focus/main_skill filters.
2. `shuffle(pool)` randomizes order. Either d31 or d51 may be `pool[0]`.
3. If `pool[0] === d31`, default selection returns d31 → 6 min allocation fits → no observation.
4. If `pool[0] === d51`, default selection returns d51 → 6 min allocation < d51's 8-min floor → `under_authored_min` observation fires.

Proposed change: in `findCandidates`, add a check that filters out long-floor drills (d49, d50, d51) when `targetDurationMinutes` is supplied AND target < drill's `workload.durationMinMinutes`. This requires `findCandidates` to accept `targetDurationMinutes` (currently it doesn't), OR the filter moves to `pickForSlot` after the candidate pool is built.

The cleaner location is `pickForSlot` since `targetDurationMinutes` is already an option there, and `findCandidates` is shared with non-target-aware paths (e.g., `swapAlternatives`). The floor check applies after `findCandidates` returns the pool but before shuffle/selection.

## Expected Diagnostic Movement

If the floor check ships correctly:

- d50-solo-open `under_authored_min` (12 cells) drops toward 0
- d50-pair-open `under_authored_min` (4 cells) drops toward 0
- d51-solo-open `under_authored_min` (16 cells) drops toward 0
- d51-pair-open `under_authored_min` (4 cells) drops toward 0
- d49 under-min (12 + 4 cells) likely drops toward 0 as well (same selection mechanism)
- Total movement: ~52 cells absorbed
- d31, d46 main_skill `over_authored_max+over_fatigue_cap` cells should NOT appear (the reroute still fires when blocks legitimately need long-envelope drills)
- Total routeable group count change: roughly -4 to -6 (under-min groups drop out)

If new cells appear elsewhere with `pressure_remains` (e.g., d31 over-cap because blocks are now redistributed to it), the fix is too aggressive and must be tuned.

## Scope Boundaries

**In scope:**

- Floor-aware filter in `pickForSlot` for d49/d50/d51 main_skill candidates
- Tests covering happy path + floor cut-over + non-affected drills
- Diagnostic regeneration + verification
- Activation pattern doc extension with the new "lower-bound floor enforcement" lesson

**Deferred to follow-up:**

- Compound 2-drill main_skill blocks (separate generator-policy lane; recommended as next-next iteration)
- D102 cone equipment-context resolution (would unblock d12/d13/d16/d17 graduation)
- d05-solo workload review or sibling
- d01-solo D01 fork resolution (separate workflow)
- Other drills' workload envelope reviews (technique under-min, etc.)
- Generalizing the floor check to ALL drills via a uniform rule (current scope is the three named long-envelope drills only)

**Out of scope:**

- Modifying d49, d50, or d51 workload envelopes
- Modifying d31, d46, d47, d48 workload envelopes or behavior
- Changing the existing reroute predicates (only adding the floor check; not modifying upper-bound logic)
- Touching algorithm version unless golden snapshots break

## Success Criteria

- A `/ce-plan` produces a complete implementation plan with U-IDs covering: floor check implementation, sessionBuilder tests test-first, diagnostic regeneration, activation pattern doc extension.
- Implementation ships with regenerated diagnostics showing R5 movement.
- If diagnostics do not show movement, the slice is reverted (filter removed) and the bottleneck is documented.
- The activation pattern doc gains a "lower-bound floor enforcement" section that future agents can find via `ce-learnings-researcher`.

## Open Questions

### Resolved here

- **Filter location: findCandidates or pickForSlot?** `pickForSlot`. `findCandidates` is shared with paths that don't pass `targetDurationMinutes` (swap, etc.); pollution risk is too high.
- **Hard-coded set or read from drill records?** Read from drill records via `workload.durationMinMinutes`. Hard-coding the floor would drift if drill records change.
- **Apply to d49 too, or just d50/d51?** Apply to d49 too. d49 has the same selection-path debt (12+4 cells); not fixing it would leave the same anti-pattern.
- **Generalize to all drills?** No. Only d49/d50/d51 are reroute-controlled main-skill-only long-floor drills with known under-min issues. Other drills' floors are validated by their existing slot/level filters. Generalization is over-scoped.

### Deferred to plan

- Exact filter wording in `pickForSlot` (after pool is built but before shuffle? After shuffle? Before targeted reroute?).
- Whether to add a `LONG_FLOOR_MAIN_SKILL_DRILL_IDS` constant (mirrors existing `*_DURATION_FIT_DRILL_IDS` sets) or just check the drill's own `workload.durationMinMinutes`.
- Whether to bump `SESSION_ASSEMBLY_ALGORITHM_VERSION`. Likely yes since the candidate pool changes for short main_skill blocks.

## Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| Filter accidentally excludes d49/d50/d51 from blocks where they should fit (e.g., 8-min block for d49 floor 8) | Use `< floor` (strict less-than) not `<= floor`. R2 uses authored floor not hard-coded. |
| Filter causes other drills to be picked which over-stretch (creates new pressure_remains) | R5 rollback rule. Regenerated diagnostics must not introduce new pressure_remains cells. |
| Test golden snapshots break in unexpected places | Mirror d51 ship's algorithm-version bump pattern; inspect breakage before bumping. |
| Generalization risk: someone later adds d52/d53 with 8-min floor and forgets the filter | Read floor from drill record (R2) so any new 8+-min-floor drill auto-applies the rule when added to the long-envelope set. |

## Sources & References

- `docs/solutions/2026-05-04-source-backed-content-depth-activation-pattern.md` — pattern doc to extend
- `docs/plans/2026-05-04-003-feat-d50-advanced-passing-depth-plan.md` — d50 ship + flagged under-min issue
- `docs/plans/2026-05-04-004-feat-d51-beginner-serving-tactical-zone-depth-plan.md` — d51 ship + flagged under-min issue
- `docs/reviews/2026-05-01-generated-plan-diagnostics-triage.md` — current diagnostic state showing under-min cells
- `app/src/domain/sessionAssembly/candidates.ts` — current main-skill-only filter location
- `app/src/domain/sessionBuilder.ts` — current reroute predicates
- `app/src/data/drills.ts` — d49/d50/d51 workload definitions

## Handoff

Next step: `ce-project-standards-reviewer` + `ce-product-lens-reviewer` in parallel, then `/ce-plan` with their feedback integrated.
