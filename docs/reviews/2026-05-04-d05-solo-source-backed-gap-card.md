---
id: d05-solo-source-backed-gap-card-2026-05-04
title: "d05-solo Source-Backed Gap Card"
status: active
stage: validation
type: review
summary: "Source-backed gap card for the remaining d05-solo beginner/intermediate solo passing pressure cluster. Records D05 as the only current catalog-ish re-entry candidate after D49/D50/D51, but keeps activation not authorized because no gap-card-ready source/adaptation payload has yet proved a distinct longer solo passing carrier."
authority: "D05 source-backed gap-card candidate for generated diagnostics follow-up; does not authorize catalog edits, workload metadata edits, drill cap widening, runtime generator changes, U6 preview tooling, or D101 (3+ player) re-entry."
last_updated: 2026-05-04
depends_on:
  - docs/reviews/2026-05-01-generated-plan-diagnostics-triage.md
  - docs/reviews/2026-05-01-generated-plan-diagnostics-report.md
  - docs/reviews/2026-05-02-d47-d05-comparator-evaluation-payload.md
  - docs/reviews/2026-04-30-focus-coverage-gap-cards.md
  - docs/research/bab-source-material.md
  - docs/research/fivb-source-material.md
  - app/src/data/drills.ts
---

# d05-solo Source-Backed Gap Card

## Purpose

Record whether the fresh generated-plan diagnostics still point to a missing drill or variant after the D49/D50/D51 catalog fills. The answer is narrow: `d05-solo` is the only remaining group that still looks plausibly catalog-related, but it is not implementation-ready.

This card is not activation approval. It keeps D05 visible as a re-entry candidate only if a later source-evidence payload can name a distinct longer solo passing carrier beyond the current set-window passing drill.

## Gap Card

### gap-d05-solo-beginner-passing-duration-depth

- **Status:** `source_candidate`
- **Activation readiness:** `not_authorized`
- **Comparator gate:** D47 previously beat D05 in `docs/reviews/2026-05-02-d47-d05-comparator-evaluation-payload.md` because D47 had a named source-backed content-depth delta and a clearer selection-path hypothesis. D47 is now closed by D49, and D46/D31 pressure has also been absorbed by D50/D51. D05 may re-enter only because it is now the strongest remaining `pressure_remains_without_redistribution` catalog-ish group, not because prior comparator evidence authorized it.
- **Risk buckets:** `thin_long_session`, `mixed_causality`, `source_adaptation_needed`, `solo_transfer_boundary`, `block_shape_possible`
- **Affected diagnostic group:** `gpdg:v1:d05:d05-solo:main_skill:true:optional_slot_redistribution+over_authored_max+over_fatigue_cap`
- **Current receipt facts:** 15 total affected cells; 12 redistribution-affected cells; 15 current over-authored-max cells; 15 current over-fatigue-cap cells; 9 cells still over cap under the allocated-duration counterfactual; 3 non-redistribution over-cap cells; 6 cells where pressure disappears under allocated-duration comparison; 0 under-min cells; 0 inconclusive cells.
- **Current catalog coverage:** `d05` / `d05-solo` is `Self-Toss Pass to Set Window`: a beginner/intermediate solo drill for directional control and settable pass shape. It uses self-toss, one ball, markers, and a 4-8 minute envelope with fatigue cap `maxMinutes: 8` / `maxReps: 40`. Its objective explicitly says it trains platform plus direction, not serve-reading.
- **Suspected content-depth gap:** Generated solo beginner/intermediate passing sessions can ask for more main-skill passing time than D05 honestly carries. The possible missing surface is not "more D05"; it would need to be a distinct solo-compatible passing control or movement carrier that can absorb longer main-skill time without claiming live serve-receive transfer.
- **Candidate changed or missing IDs:** candidate new D05-adjacent passing drill family or activation of an existing reserve passing/movement concept. No ID is reserved here. A later implementation plan must collision-check `app/src/data/drills.ts`, `app/src/data/progressions.ts`, and catalog tests before naming an ID.
- **Likely fix type:** source-backed sibling drill/variant activation only if the source payload proves a distinct 1-player adaptation. Otherwise this should route to block-shape review, accepted no-change, or D01/D05 workload-policy review.
- **Rejected direct D05 edit:** Do not widen `d05-solo` beyond 8 minutes from this card alone. Current copy, scoring, and workload describe a short set-window accuracy drill. Widening the cap would hide the diagnostic pressure without proving a new training surface.

## Exact Source References

- Existing source boundary: `d05-solo` already covers self-toss directional passing to a set window. It does not cover live serve-reading, long movement-pressure intervals, or partner seam ownership.
- Better at Beach Practice Plan 1 and Plan 3, `Basic S/R Footwork`:
  - Captured source form uses a partner toss to the passer's right side, left side, face/drop-step path, and short-ball-to-knee path.
  - Current archive marks it as the best near-term M001-compatible candidate if a future content-polish pass needs one Plan 1 addition before attack or 3+ support.
  - Boundary: the source form is pair-toss, so a solo version would be a reduced control drill, not true serve receive.
- Better at Beach Practice Plan 2, `7 Drills 4 Quadrants`:
  - Captured source form is a quadrant-based ball-control ladder that progresses from forearm pass through pass/set/tomahawk/one-arm/pokey sequences with the constraint that both feet reach the target quadrant.
  - Current archive marks it as a new content-polish candidate that can be honest with one player, likely with self-toss and marker/line constraints.
  - Boundary: this is ball-control and movement support, not a full serve-receive simulation.
- FIVB Drill-book 3.6 `The U Passing Drill`:
  - Current FIVB cross-reference marks it as a footwork-heavy content-polish candidate that fits `chain-3-movement`.
  - Boundary: the local archive currently records the TOC/cross-reference, not a full drill transcription. Do not activate it until the exact source form and 1-player adaptation are reviewed.
- FIVB Drill-book 3.7 `Passing In System`:
  - Strong source for the in-system/out-of-system definition already used by the pass-quality rubric.
  - Boundary: the drill itself is a future passing-pressure candidate, not a solo D05 fill without a separate adaptation review.

## Adaptation Delta

- **Solo candidate A, quadrant control ladder:** Adapt BAB `7 Drills 4 Quadrants` into a marker-based solo passing-control ladder. The athlete moves both feet into a marked quadrant, performs the required touch sequence, and advances through a capped set of sequences. This is the strongest solo-compatible source path, but it may belong in `chain-3-movement` rather than directly beside D05.
- **Solo candidate B, reduced S/R footwork primer:** Adapt BAB `Basic S/R Footwork` into a reduced self-toss movement primer: right/left/drop-step/short-ball patterns, pass to a target window, cap total reps tightly. This is closer to D05's passing target, but the solo adaptation loses the source drill's partner-toss perception.
- **Pair-only/future candidate:** A faithful `Server vs Passer` or passing-triangle family would be more realistic for serve-receive pressure, but it is not a solo D05 fix. Keep it for future pair/net or D101 work unless the product explicitly chooses that route.
- **Not allowed in M001 from this card:** Do not import 3+ player passing triangles, attack-linked sideout drills, or uncapped BAB retry-until-success serving/pass games as a D05 solo fill.

## Expected Diagnostic Movement

- The gap card alone should not change diagnostics.
- If a later source-evidence payload selects a new solo-compatible longer passing/movement carrier, and `buildDraft()` can prefer it for the affected beginner/intermediate solo passing main-skill blocks, expected movement is reduced `d05-solo` over-cap and over-fatigue pressure.
- If the new candidate cannot carry more than 8 minutes honestly, expected diagnostic movement is weak and the catalog path should stop.
- If implementation only adds a drill record but selection still chooses `d05-solo` for the same long blocks, expected diagnostic movement is none.
- If source review concludes the honest fix is pair/live-serve pressure rather than solo passing depth, this D05 solo card should remain held and a different pair/net gap card should be opened only with founder/product approval.

## Verification Command

For this gap card slice, verify docs only:

`bash scripts/validate-agent-docs.sh`

Any later catalog or generator-affecting implementation should include at least:

`npm test -- src/domain/sessionBuilder.test.ts src/data/__tests__/catalogValidation.test.ts src/data/__tests__/progressions.test.ts src/domain/__tests__/generatedPlanDiagnosticTriage.test.ts`

and then:

`npm run diagnostics:report:check`

## Checkpoint Criteria

- A follow-up source-evidence payload must choose exactly one primary source path: BAB quadrant ladder, BAB S/R footwork, FIVB U Passing, or no-change/block-shape.
- The selected path must prove a distinct teaching surface beyond current `d05-solo` set-window passing.
- The selected path must preserve 1-player honesty if it claims to close the `d05-solo` group; pair/live-serve claims need a separate pair/net card.
- The implementation plan must include a selection-path hypothesis or explicitly show that existing candidate selection would prefer the new carrier for the affected cells.
- Stop if the evidence only says "D05 is too short" without naming source-backed content depth. That is workload/block-shape debt, not a drill-catalog gap.

## Activation Manifest Stub

- **Included gap card IDs:** `gap-d05-solo-beginner-passing-duration-depth`
- **Candidate changed catalog IDs:** no ID reserved; possible new D05-adjacent solo passing/movement family if a follow-up source payload selects catalog activation.
- **Cap delta:** likely `+1` drill record if implemented as a sibling family; `0` if routed to block-shape, workload, or no-change.
- **Exact source references:** BAB Practice Plan 1/3 `Basic S/R Footwork`, BAB Practice Plan 2 `7 Drills 4 Quadrants`, FIVB 3.6 `The U Passing Drill`, and FIVB 3.7 `Passing In System` boundary. A later plan must choose one primary source and record exact adaptation details.
- **Adaptation deltas:** any solo adaptation must say what transfer is lost from the source form and avoid claiming live serve-receive when the feed is self-toss.
- **Verification:** see commands above.
- **Checkpoint before activation:** source review must prove a distinct 1-player teaching surface, selection-path movement must be testable, and regenerated diagnostics must show D05 movement without creating new hard failures.
