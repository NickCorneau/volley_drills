---
id: d49-source-backed-activation-manifest-2026-05-02
title: "D49 Source-Backed Activation Manifest"
status: active
stage: validation
type: review
summary: "Activation manifest for the D47-winning source-backed catalog gap: authorizes a bounded D49 advanced setting/movement implementation, with D05 re-entry if source adaptation, selection-path proof, or diagnostics fail."
authority: "Catalog implementation gate for D49 only; does not authorize broad generator policy, D47 cap widening, D05 edits, U6 preview tooling, or UI changes."
last_updated: 2026-05-02
depends_on:
  - docs/plans/2026-05-02-014-feat-d47-source-backed-catalog-implementation-plan.md
  - docs/reviews/2026-05-02-d47-d05-comparator-evaluation-payload.md
  - docs/reviews/2026-05-02-d47-source-backed-gap-card.md
  - docs/reviews/2026-04-30-focus-coverage-gap-cards.md
  - app/src/data/drills.ts
---

# D49 Source-Backed Activation Manifest

## Purpose

Provide the hard go/no-go checkpoint between the D47-winning comparator payload and catalog code changes.

## Activation Decision

- **Activation decision:** `authorized_for_d49_implementation`
- **Authorization scope:** `d49`, `d49-solo-open`, `d49-pair-open`, `chain-7-setting`, and a bounded advanced-setting selection path.
- **Still not authorized:** D47 cap widening, D05 edits, broad generator-policy changes, U6 preview tooling, app UI changes, 3+ player setting drills, or many-ball drills.
- **D05 re-entry trigger:** Re-enter D05 if D49 source adaptation fails implementation review, if selection-path proof cannot be made narrow, or if regenerated diagnostics do not move the intended D47 pressure.

## Included Gap Card

- `gap-d47-advanced-setting-conditioning-depth`

## Changed IDs

- New drill: `d49`
- New variants: `d49-solo-open`, `d49-pair-open`
- Progression chain: `chain-7-setting`
- Selection path: advanced setting main-skill duration fit only

## Source References

- Existing boundary: FIVB Drill-book 4.7 `4 Great Sets`, already represented by `d47`; this remains the variation/choice drill and should not be widened.
- Better at Beach, `Every drill you need to become the best beach volleyball setter`, `Solo setting drills` / `Dip, dip, lift`: supports solo setter footwork, repeated touch work, and low-equipment self-directed practice.
- Junior Volleyball Association, `Setting Drills to Train Proper Technique and Eliminate Bad Habits`, `Setting High Out of System (OOS)` and `Up and back setting`: supports timed out-of-system movement, high set return, and short high-intensity intervals.
- The Art of Coaching Volleyball, `Set and go drill for high energy set training`: supports the training problem of setting under movement, fatigue, quick decisions, and multiple setting positions; source form remains team-size supporting context only.

## Adaptation Deltas

- **Solo open:** Marker-based `Set and Recover` drill. Athlete self-tosses from imperfect or off-net positions, moves to the ball, sets into a target window, recovers to a home marker, and repeats in short rounds. This uses Better at Beach solo footwork and JVA out-of-system movement intent without requiring a wall, coach, or 3+ players.
- **Pair open:** Partner tosses from end-line, off-net, and side-line markers. Setter moves, delivers a high controlled set into a reachable target window, recovers to the home marker, and repeats in short rounds before switching roles. This is closer to JVA `Up and back setting` while staying one-ball and two-player compatible.
- **Rejected source forms:** Better at Beach `Triangle Setting`, `Hand Dig, Set, Set`, `Pass, set, set, set, catch`, and TAOCV source-form `Set and Go` are not activated because they require 3+ players or team-size rotation.

## Activation Gate Checklist

- **Materially different from D47:** Pass. D47 trains four-location set choice; D49 trains repeated out-of-system movement, recovery, and set quality under fatigue.
- **M001-compatible:** Pass. One ball, markers, solo/pair open-court variants, no wall/net/lines/cones/many-ball requirement.
- **Source-backed 1-2 player adaptation:** Pass. Direct source support comes from Better at Beach solo work and JVA timed movement setting; TAOCV is supporting rationale only.
- **Quality-protecting workload:** Pass. Implementation must use short rounds/reset copy rather than uninterrupted conditioning volume.
- **Selection-path explainability:** Pass with implementation dependency. D49 only helps diagnostics if advanced setting main-skill duration-fit selection can prefer it for longer blocks.

## Checkpoint Criteria

- Catalog validation passes with the new IDs and no duplicate variants.
- Progression validation passes with D49 in `chain-7-setting`.
- Existing D47 workload caps remain unchanged at 5-9 minutes.
- Advanced setting session builder tests show D49 can carry longer main-skill blocks without changing unrelated pass/serve behavior.
- Regenerated diagnostics are current and record whether D47 pressure moved.

## Verification

Expected implementation verification:

`npm test -- src/data/__tests__/catalogValidation.test.ts src/data/__tests__/progressions.test.ts src/domain/sessionBuilder.test.ts src/domain/__tests__/generatedPlanDiagnostics.test.ts src/domain/__tests__/generatedPlanDiagnosticTriage.test.ts`

Then:

`npm run diagnostics:report:update`

`npm run diagnostics:report:check`

`bash scripts/validate-agent-docs.sh`
