---
id: d46-pair-open-source-backed-gap-card-2026-05-04
title: "d46-pair-open Source-Backed Gap Card"
status: active
stage: validation
type: review
summary: "Source-backed gap card for the d46-pair-open advanced spin-read serve receive pressure cluster. Names a candidate content-depth delta beyond existing FIVB 3.15/3.16 coverage and remains not authorized; activation requires a comparator decision packet that selects a pair-side winner."
authority: "d46-pair-open source-backed gap-card candidate for generated diagnostics follow-up; does not authorize catalog edits, workload metadata edits, drill cap widening, runtime generator changes, U6 preview tooling, or D101 (3+ player) re-entry."
last_updated: 2026-05-04
depends_on:
  - docs/brainstorms/2026-05-04-pair-side-catalog-content-depth-requirements.md
  - docs/plans/2026-05-04-001-feat-d46-pair-open-source-backed-gap-card-plan.md
  - docs/reviews/2026-05-01-generated-plan-diagnostics-triage.md
  - docs/reviews/2026-05-02-d47-source-backed-gap-card.md
  - docs/reviews/2026-04-30-focus-coverage-gap-cards.md
  - app/src/data/drills.ts
---

# d46-pair-open Source-Backed Gap Card

## Purpose

Name the smallest credible source-backed content-depth delta for the current `d46-pair-open` pressure cluster, while preserving the comparator gate. This card is the first pair-side gap card after the D47→D49 advanced setting/movement path landed; the same template is reused so future agents can diff the two cards and verify shape parity.

This card is not activation approval. It only unlocks comparator-decision-packet planning for `d46-pair-open` vs the simplest no-change baseline.

## Gap Card

### gap-d46-pair-open-advanced-pass-conditioning-depth

- **Status:** `closed_by_d50` (FIVB 3.13 Short/Deep activated as `d50` family on 2026-05-04)
- **Activation readiness:** `closed_with_fill`
- **Comparator gate:** `docs/reviews/2026-05-04-d46-pair-open-no-change-comparator-decision-packet.md` originally selected `hold_for_source_evidence`. The D46 pair source evidence payload was delivered as `docs/brainstorms/2026-05-04-d50-advanced-passing-depth-requirements.md` and implemented via `docs/plans/2026-05-04-003-feat-d50-advanced-passing-depth-plan.md`. The comparator outcome is now `d46_pair_wins → catalog implemented as d50`. Regenerated diagnostics confirm the d46-pair-open and d46-solo-open `optional_slot_redistribution+over_authored_max+over_fatigue_cap` groups are absorbed by d50; remaining d50 pressure classifies as `likely_redistribution_caused` (clean).
- **Risk buckets:** `thin_long_session`, `mixed_causality`, `source_adaptation_needed`, `player_count_boundary`
- **Affected diagnostic groups:**
  - `gpdg:v1:d46:d46-pair-open:main_skill:true:optional_slot_redistribution+over_authored_max+over_fatigue_cap` (16 cells)
  - Related solo sibling group for context only: `gpdg:v1:d46:d46-solo-open:main_skill:true:optional_slot_redistribution+over_authored_max+over_fatigue_cap` (24 cells; not the focus of this pair-side card)
- **Current receipt facts:** d46-pair-open carries 8 cells where pressure disappears under the allocated-duration counterfactual, 8 cells where pressure remains, 0 non-redistribution-pressure cells, and 0 inconclusive cells. Dominant action state is `pressure_remains_without_redistribution` with `mixed_cell_states`. Follow-up routes from the redistribution causality receipt: `workload_review`, `block_shape_review`, `source_backed_proposal_work`, `u6_proposal_admission_candidate`, `future_generator_policy_decision`.
- **Current catalog coverage:** `d46` / `d46-pair-open` covers FIVB Drill-book 3.16 `Topspin Serve Off Box Drill` adapted to a low-equipment pair feed: passer reads spin from a partner toss at 4-6 m, calls the spin, moves early, and delivers a pass into a marked 1 m set window. Workload envelope: `durationMinMinutes: 5`, `durationMaxMinutes: 8`, `fatigueCap.maxMinutes: 8`, `maxReps: 24`. The current card explicitly trains spin reading and platform control; it does not claim a longer pair-open serve receive conditioning surface.
- **Suspected content-depth gap:** Current `d46-pair-open` is a short advanced spin-read drill at 5-8 minutes. The missing content-depth candidate is a longer pair-open serve receive conditioning family that trains repeated read/move/recover under fatigue, including out-of-system serve receive (short/side/deep ball variability), without stretching `d46-pair-open` beyond its honest 5-8 minute envelope.
- **Candidate changed or missing IDs:** candidate new pair-friendly drill family in the next free advanced-passing slot (commonly the next free `dN` after the current high-water mark). IDs are reserved only for planning discussion here; implementation must grep `app/src/data/drills.ts` and `app/src/data/__tests__/catalogValidation.test.ts` for collisions before reserving any ID. The implementation plan after the comparator must record the actual reserved ID in its activation manifest.
- **Likely fix type:** source-backed sibling drill/variant activation, mirroring the D47→D49 pattern. A direct `d46-pair-open` cap widening is rejected at this card stage.
- **Rejected direct D46 edit:** Do not widen `d46-pair-open` beyond 8 minutes from this card alone. Existing D46 provenance (FIVB 3.16) supports spin-read receive at the current envelope; it does not by itself prove a longer pair-open conditioning block. A future workload/cap proposal could revisit cap widening separately, but this card is not that proposal.

## Exact Source References

- Existing source boundary: FIVB Drill-book 3.16 `Topspin Serve Off Box Drill` and FIVB 3.15 `Pass and Look`, already activated for `d46`. These are the current spin-read and post-pass-look surfaces; they are not sufficient by themselves to justify a longer pair-open conditioning sibling.
- Better at Beach, passing/serve receive collection, candidate sections:
  - Pair serve receive drills that emphasise repeated reads against varied serve speeds and locations within a 1-2 player adaptation. The exact section depends on which BAB blog post the implementation plan ultimately cites; final selection happens during the catalog implementation plan, not here.
  - Pair pass-and-go style drills that pair a controlled receive with a recovery movement before the next feed, suitable for a longer pair-open conditioning interval.
  - URL reference for the BAB passing collection lives at `https://www.betteratbeach.com/`; the implementation plan must record the exact post URL and section title once the source review picks a primary citation.
- Junior Volleyball Association, passing/serve-receive habits collection, candidate sections:
  - Out-of-system passing and pass-under-fatigue progressions that move the passer between read positions, with an explicit pair-friendly adaptation the implementation plan must specify.
  - URL reference: `https://jvavolleyball.org/`; implementation plan must record the exact post URL.
- The Art of Coaching Volleyball, pass-and-go and serve-receive conditioning content, candidate use:
  - Confirms longer-form pass-and-go intervals that combine read, move, and recover. Player-count and indoor-team assumptions make many TAOCV drills supporting rationale only, not direct activation sources. Any borrowed pattern needs an explicit 1-2 player adaptation delta.
  - URL reference: `https://www.theartofcoachingvolleyball.com/`; implementation plan must record the exact post URL.

If the source review cannot land at least one direct 1-2 player adaptation citation per candidate adaptation below, this card stays held until additional source evidence arrives.

## Adaptation Delta

- **Pair open candidate (primary):** A `Pass and Recover` style pair drill: feeder delivers varied tosses or low serves from short / off-net / side-line markers; passer reads the feed type, moves early, delivers a controlled pass into a marked 1 m set window, then recovers to a home marker before the next feed. Intervals run for a longer envelope than the current `d46-pair-open`, with explicit rest cycles to keep RPE inside the existing pair workload band. Adaptation must preserve one-ball, marker-based, no-3+-player playability.
- **Solo open candidate (secondary):** A self-toss equivalent of the above, scoped only to keep the future sibling drill family-coherent. The pair-open path is the primary surface for this card; the solo sibling can ship in the same family or be deferred per the comparator winner.
- **Not allowed in M001:** Do not activate any 3+ player serve receive source forms (e.g. coach-fed multi-passer rotations, "pass-set-attack" sequences with full court coverage, or three-passer serve receive triangles) even as adaptation candidates. M001 keeps the D101 boundary intact: pair-open means 1-2 players, one ball, markers only.

## Expected Diagnostic Movement

- If the comparator selects a pair-side winner and the implementation plan adds a longer pair-open serve receive conditioning sibling that `buildDraft()` can prefer for longer pair-open advanced passing main-skill blocks, expected movement is a reduction in `d46-pair-open` over-cap and over-fatigue pressure for the affected advanced pair-open passing cells, mirroring the D47→D49 receipt movement.
- The gap card alone should not change diagnostics.
- If implementation only adds catalog content but `buildDraft()` still selects `d46-pair-open` for the same long blocks, expected diagnostic movement is none. The plan must include a selection-path change or explain why the existing selection logic already prefers the new sibling for those cells.
- If the comparator instead selects no-change, this card stays `source_candidate` and no implementation plan opens.

## Verification Command

Use the implementation plan's narrowest relevant test set, expected to include:

`npm test -- src/domain/sessionBuilder.test.ts src/domain/sessionAssembly/__tests__/focusReadiness.test.ts src/data/__tests__/catalogValidation.test.ts src/data/__tests__/progressions.test.ts src/domain/__tests__/generatedPlanDiagnosticTriage.test.ts`

After any catalog or generator-affecting implementation, also run:

`npm run diagnostics:report:check`

For this gap card slice (documentation only), the verification reduces to:

`bash scripts/validate-agent-docs.sh`

## Checkpoint Criteria

- A pair-side comparator must first beat the no-change baseline (and any re-entered comparator such as `d05`) on causal warrant, athlete-facing session value, minimality, and rejection of cap-widening shortcuts.
- The implementation plan must choose whether the fill is a new sibling drill/variant, a block-shape/generator selection change, or a no-change/comparator exit.
- Any new drill IDs must be collision-checked against `app/src/data/drills.ts` and `app/src/data/__tests__/catalogValidation.test.ts`, and recorded in an activation manifest with exact source references and adaptation deltas.
- Do not widen existing `d46-pair-open` caps unless a separate workload/cap proposal justifies that path.
- Stop if source review cannot support a 1-2 player open-court adaptation that is materially different from current FIVB 3.15/3.16 D46.
- Do not bundle `d31-pair-open`/`d31-pair` evidence into this card. Those surfaces remain candidates for a separate gap card per the brainstorm scope.

## Activation Manifest Stub

- **Included gap card IDs:** `gap-d46-pair-open-advanced-pass-conditioning-depth`
- **Candidate changed catalog IDs:** placeholder for a new advanced pair-open passing conditioning sibling family. The actual ID and variant set must be reserved by the implementation plan after a collision check; do not treat any draft ID in this card as committed.
- **Cap delta:** likely `+1` drill record if implemented as a sibling family; `0` if implementation instead routes to generator selection, block shape, or no-change.
- **Exact source references:** to be finalised in the catalog implementation plan after source review picks one primary citation per candidate adaptation. This card lists only candidate sources; the implementation plan must commit to specific URLs and section titles.
- **Adaptation deltas:** pair-open and (optional) solo-open adaptations must preserve repeated read/move/recover passing without importing 3+ player source forms into M001. One ball, markers only, 1-2 players only.
- **Verification:** see command above.
- **Checkpoint before next activation batch:** d46-pair-open comparator must pass, source review must approve at least one 1-2 player adaptation per cited source, and regenerated diagnostics must show the intended pair-side movement without creating new hard failures.
