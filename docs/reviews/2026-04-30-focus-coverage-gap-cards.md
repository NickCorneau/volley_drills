---
id: focus-coverage-gap-cards-2026-04-30
title: "Focus Coverage Gap Cards"
status: active
stage: validation
type: review
summary: "Grouped source-backed gap cards produced by the 2026-04-30 focus coverage readiness audit. Cards identify failing user-visible cells, candidate source material, blockers, and whether the expected fix is variant repair, reserve activation, or new source-backed drill work."
authority: "Durable gap-card backlog for Tune today focus coverage readiness; no catalog activation is authorized without exact source references and a batch manifest."
last_updated: 2026-05-01
depends_on:
  - docs/reviews/2026-04-30-focus-coverage-readiness-audit.md
  - docs/reviews/2026-05-01-generated-plan-diagnostics-report.json
  - docs/brainstorms/2026-04-30-focus-coverage-catalog-readiness-requirements.md
  - app/src/domain/generatedPlanDiagnostics.ts
  - app/src/domain/sessionAssembly/focusReadiness.ts
  - app/src/data/drills.ts
decision_refs:
  - D81
  - D101
  - D130
  - D135
---

# Focus Coverage Gap Cards

## Purpose

Turn readiness failures into durable follow-up work without pretending the catalog is fixed before source-backed activation. These cards are intentionally grouped by repeated failure pattern; after batch 3, all current focus-readiness matrix groups are verified.

Activation requires a batch manifest that names exact `drillId` / `variantId` changes, cap delta, exact source references, adaptation deltas, verification commands, and checkpoint criteria.

## Status Vocabulary

- `failing`: confirmed generated-readiness failure
- `source_candidate`: candidate source direction exists, but activation evidence is incomplete
- `blocked_by_source`: no exact source/reference has been selected yet
- `blocked_by_product_gate`: product capability or scope gate blocks activation
- `fixed_pending_verification`: implemented but not verified
- `verified`: fixed and passing the readiness audit

## Gap Cards

### gap-advanced-focus-main-coverage

- **Status:** `verified`
- **Risk buckets:** `cannot_generate`, `no_same_focus_swap`, `thin_long_session`
- **Affected cells:** none remaining in the current readiness matrix after batches 2 and 3.
- **Missing slots:** none in the current readiness matrix.
- **Candidate source material:** Volleyball Canada Development Matrix stage progressions, FIVB skill progressions, Better at Beach advanced variations where they preserve M001 simplicity.
- **Exact source reference:** FIVB 2.6 First to 10 Serving Drill, FIVB 3.15 Pass and Look, FIVB 3.16 Topspin Serve Off Box Drill, FIVB 4.7 4 Great Sets, FIVB 4.9 Set and Look.
- **Likely fix type:** complete for the current matrix; future advanced expansion should stay source-backed.
- **Affected catalog IDs:** `d22`, `d33`, `d07`, `d46`, `d47`, `d48`.
- **Blockers:** none for the current readiness matrix.

### gap-serving-support-and-swaps

- **Status:** `verified`
- **Risk buckets:** `off_focus_support`, `no_same_focus_swap`, `cannot_generate`
- **Affected cells:** none remaining in the current readiness matrix after batch 2.
- **Missing slots:** none in the current readiness matrix.
- **Candidate source material:** Better at Beach serving homework / drill-book serving variants, FIVB serve mechanics and serving design types, Volleyball Canada serving acquisition/consolidation language.
- **Exact source reference:** Better at Beach Serving Mission homework drill for `d31`; BAB Drill Book / Beginner's Guide Around the World six-zone serving convention for `d33`; FIVB 2.6 First to 10 Serving Drill for `d22`; BAB Serving Rung 3 plus FIVB 2.5 Serving Variety for `d33`.
- **Likely fix type:** complete for current matrix; future Serving expansion should still use source-backed activation batches.
- **Affected catalog IDs:** batch 1 added `d31-pair-open`, `d33-solo-open`, and `d33-pair-open`; batch 2 updated `d22` level/equipment, added `d22-solo-open` / `d22-pair-open`, and widened `d33` to advanced.
- **Blockers:** none for the current Serving matrix.

### gap-setting-support-and-swaps

- **Status:** `verified`
- **Risk buckets:** `off_focus_support`, `no_same_focus_swap`, `cannot_generate`
- **Affected cells:** none remaining in the current readiness matrix after batch 3.
- **Missing slots:** none in the current readiness matrix.
- **Candidate source material:** existing BAB/FIVB setting source material behind `d40`, `d41`, `d42`, and deferred `d43`; Volleyball Canada setting stage language.
- **Exact source reference:** FIVB 4.7 4 Great Sets (`intermediate / advanced`) and FIVB 4.9 Set and Look (`advanced`).
- **Likely fix type:** complete for the current matrix; `d43` remains gated by `D101`.
- **Affected catalog IDs:** `d47`, `d48`.
- **Blockers:** none for the current readiness matrix.

### gap-long-session-variety

- **Status:** `verified`
- **Risk buckets:** `thin_long_session`, `no_same_focus_swap`, `off_focus_support`
- **Affected cells:** none remaining in the current readiness matrix after batch 3.
- **Missing slots:** none in the current readiness matrix.
- **Candidate source material:** FIVB drill design types and BAB scoring/constraint variations that create distinct training problems without adding a new focus taxonomy.
- **Exact source reference:** FIVB 3.15 Pass and Look, FIVB 3.16 Topspin Serve Off Box Drill, FIVB 4.7 4 Great Sets, FIVB 4.9 Set and Look.
- **Likely fix type:** complete for the current fixed 40-minute matrix.
- **Affected catalog IDs:** `d07`, `d46`, `d47`, `d48`.
- **Blockers:** none for the current readiness matrix.

### future-gap-block-stretch-pressure

- **Status:** `source_candidate`
- **Risk buckets:** `thin_long_session`
- **Affected cells:** generated-plan diagnostics now cover 540 seeded cells. Current status: 0 hard failures; 277 observation-only cells. Observation counts: `optional_slot_redistribution` 236, `over_authored_max` 288, `over_fatigue_cap` 288. The report currently groups routeable observations into 33 drill/variant/block clusters; top affected variants include `d47-solo-open`, `d33-solo-open`, `d33-pair-open`, `d46-solo-open`, and `d01-solo`.
- **Missing slots:** none under the current generation contract; the issue is routeable duration pressure against selected drill workload envelopes.
- **Candidate source material:** existing `variant.workload.durationMaxMinutes`, `variant.workload.fatigueCap.maxMinutes`, and observed session assembly redistribution metadata.
- **Exact source reference:** app metadata, not a drill source. Any content fix still needs BAB/FIVB/Volley Canada source trace.
- **Likely fix type:** diagnostic layer is now present. Future work should route observation clusters to explicit product allowance for long rounds, block splitting, variant cap review, or source-backed variant/drill activation.
- **Affected catalog IDs:** observation clusters are summarized in `docs/reviews/2026-05-01-generated-plan-diagnostics-report.json` with selected `drillId` / `variantId`, block type, required flag, cap categories, example affected cells, and likely fix paths.
- **Blockers:** product policy must decide which over-cap observations are acceptable, which should split into rounds, and which require additional content depth.

## Activation Batch Manifest

### focus-readiness-batch-1-support-and-no-net-serving

- **Included gap cards:** `gap-serving-support-and-swaps`, `gap-setting-support-and-swaps`, `gap-long-session-variety`
- **Changed catalog/runtime IDs:** `effectiveSkillTags()` support-slot behavior; `d31:d31-pair-open`; `d33:d33-solo-open`; `d33:d33-pair-open`
- **Cap delta:** 0 drill records
- **Exact source references:** Better at Beach Serving Mission homework drill for `d31`; BAB Drill Book / Beginner's Guide Around the World six-zone serving convention for `d33`
- **Adaptation deltas:** No-net variants use marked sand targets and caller commitment; they explicitly train toss/contact/target sequencing without claiming net clearance.
- **Verification:** `npm test -- src/domain/sessionAssembly/__tests__/effectiveFocus.test.ts src/domain/sessionAssembly/__tests__/focusReadiness.test.ts src/domain/sessionBuilder.test.ts src/data/__tests__/catalogValidation.test.ts`
- **Checkpoint criteria:** Do not widen level bands or add advanced serving/setting content until the next batch records exact source references and adaptation deltas for the affected advanced/intermediate cells.

### focus-readiness-batch-2-serving-level-depth

- **Included gap cards:** `gap-serving-support-and-swaps`, `gap-advanced-focus-main-coverage`, `gap-long-session-variety`
- **Changed catalog IDs:** `d22:d22-solo`; `d22:d22-pair`; `d22:d22-solo-open`; `d22:d22-pair-open`; `d33` level ceiling
- **Cap delta:** 0 drill records
- **Exact source references:** FIVB 2.6 First to 10 Serving Drill (`intermediate / advanced`) for `d22`; BAB Serving Rung 3 plus FIVB 2.5 Serving Variety (`intermediate / advanced`) for `d33`
- **Adaptation deltas:** `d22` no-net variants use marked sand target zones and points-to-target scoring without claiming net clearance; one-ball cadence is accepted as slower but playable for M001.
- **Verification:** `npm test -- src/domain/sessionAssembly/__tests__/focusReadiness.test.ts src/domain/sessionBuilder.test.ts src/data/__tests__/catalogValidation.test.ts`
- **Checkpoint criteria:** Serving is complete for the current matrix. Next activation batch should target advanced Passing or advanced Setting, not more serving depth unless a new focus/readiness dimension is added.

### focus-readiness-batch-3-advanced-pass-set

- **Included gap cards:** `gap-advanced-focus-main-coverage`, `gap-setting-support-and-swaps`, `gap-long-session-variety`
- **Changed catalog/runtime IDs:** `findCandidates()` player-level filtering for `technique` / `movement_proxy`; `d07` level ceiling and M001 activation; `d07:d07-solo-open`; `d07:d07-pair-open`; new `d46:d46-solo-open`; new `d46:d46-pair-open`; new `d47:d47-solo-open`; new `d47:d47-pair-open`; new `d48:d48-solo-open`; new `d48:d48-pair-open`
- **Cap delta:** +3 drill records (`d46`, `d47`, `d48`)
- **Exact source references:** FIVB 3.15 Pass and Look (`intermediate / advanced`); FIVB 3.16 Topspin Serve Off Box Drill (`advanced`); FIVB 4.7 4 Great Sets (`intermediate / advanced`); FIVB 4.9 Set and Look (`advanced`)
- **Adaptation deltas:** FIVB 3.15 no-net variants replace the live visual reader with target cards or a partner flash while preserving post-pass look/call scoring; FIVB 3.16 replaces the box-assisted serve with low-equipment spin feeds while preserving advanced spin-read passing; FIVB 4.7 uses self/partner tossed four-location setting problems instead of a coach sequence; FIVB 4.9 scores the post-set look/call behavior with markers or a partner flash.
- **Verification:** `npm test -- src/domain/sessionAssembly/__tests__/focusReadiness.test.ts src/domain/sessionBuilder.test.ts src/data/__tests__/progressions.test.ts src/domain/__tests__/findSwapAlternatives.test.ts src/data/__tests__/catalogValidation.test.ts`
- **Checkpoint criteria:** Current Tune today focus readiness is complete for pass/serve/set across the existing matrix. New drill activation should require a new readiness dimension, founder-use demand, or a source-backed polish objective outside this matrix.

Before any future follow-up activates drill content, create a manifest with:

- Included gap card IDs
- New or changed `drillId` / `variantId` values
- Cap delta
- Exact source references
- Adaptation deltas
- Verification command
- Checkpoint criteria before the next activation batch

Before any future curated mixed-focus theme activates, create a theme manifest with:

- Theme id and user-facing label, for example `serve_receive` / `Serve + Receive`
- Slot contract, including required primary-skill and dual-skill families
- Supported setup / level / duration cells
- Stretch-pressure threshold or explicit allowed over-cap rationale
- Verification command that runs the theme matrix plus the existing single-focus matrix
