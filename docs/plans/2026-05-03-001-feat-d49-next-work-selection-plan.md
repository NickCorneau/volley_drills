---
id: d49-next-work-selection-plan-2026-05-03
title: "feat: Add D49 Next-Work Selection"
type: plan
status: complete
stage: validation
summary: "Completed plan for tightening the D49 residual follow-up packet so it selects useful next work, separates pressure-based U8 routing from optional-slot-only no-action observations, and names D47 resolution separately from D49 change authorization."
date: 2026-05-03
origin: docs/plans/2026-05-02-018-feat-d49-residual-follow-up-plan.md
depends_on:
  - docs/plans/2026-05-02-018-feat-d49-residual-follow-up-plan.md
  - docs/reviews/2026-05-01-generated-plan-diagnostics-triage.md
  - docs/ops/workload-envelope-authoring-guide.md
---

# feat: Add D49 Next-Work Selection

## Overview

Tighten the generated D49 residual follow-up packet after late plan-review feedback. The current packet makes the D49 residual split visible, but it still reads more like diagnostic bookkeeping than a decision artifact. This follow-up should make it choose the next useful work while preserving conservative authorization boundaries.

---

## Problem Frame

The D49 packet needs three refinements before it can safely guide the next catalog/generator decision:

- Optional-slot-only D49 redistribution observations should not become U8 policy debt.
- The packet should name one selected next-work outcome with rationale, owner, revisit trigger, and a lightweight athlete/session-quality verdict.
- D47 resolution state should remain distinct from D49 change authorization, so `closed_with_fill` cannot be misread as permission to change D49 caps, catalog content, runtime redistribution, or D47 reopening.

---

## Requirements Trace

- R1. Split D49 redistribution evidence into pressure-bearing U8 candidates and optional-slot-only no-action observations.
- R2. Route only D49 optional-slot groups with cap/fatigue pressure and `likely_redistribution_caused` to U8/generator-policy follow-up.
- R3. Add a `selectedNextWork` outcome with one of `accept_residual_debt`, `workload_metadata_review`, `block_shape_review`, `route_to_u8`, or `no_action`.
- R4. Add selected-next-work rationale, owner, revisit trigger, and product/session-quality verdict.
- R5. Clarify U8 wording as existing redistribution causality receipt evidence that can route to a future generator-policy follow-up, not a current authorization.
- R6. Separate D47 resolution fields from D49 change authorization fields for cap, catalog, runtime redistribution, and D47 reopening.
- R7. Update tests and generated docs so markdown shows the selected next action and all D49 change authorizations remain `not_authorized`.

---

## Scope Boundaries

- Do not change D49 drill metadata, caps, copy, or catalog content.
- Do not change runtime redistribution or session assembly.
- Do not add U6/U8 tooling.
- Do not reopen D47 unless the current diagnostics include the original D47 comparator key.
- Do not add UI behavior.

---

## Context & Research

### Relevant Code and Patterns

- `app/src/domain/generatedPlanDiagnosticTriage.ts` owns the D49 packet model and markdown rendering.
- `app/src/domain/__tests__/generatedPlanDiagnosticTriage.test.ts` already covers current D49 evidence, stale evidence, missing evidence, out-of-boundary variants, markdown rendering, and D47 key return.
- `docs/reviews/2026-05-01-generated-plan-diagnostics-triage.md` is generated from the triage model.

### Review Findings Carried Forward

- Product review: add selected next work and a lightweight athlete/session-quality verdict.
- Feasibility/adversarial review: route only pressure-bearing likely-redistribution-caused D49 groups to U8; optional-slot-only groups should be no action.
- Scope/adversarial review: separate D47 resolution state from D49 change authorization.
- Coherence review: define U8 once and stop using it as both evidence source and future work without a handoff.

---

## Key Technical Decisions

- Keep this as a generated diagnostic packet refinement. No app behavior changes are needed.
- Derive `selectedNextWork` from current packet facts: D47 re-entry outranks D49 work; pressure-bearing U8 evidence outranks workload review; workload review outranks no action; optional-slot-only redistribution is tracked as no implementation action.
- Model D49 authorizations as separate fields, not a single generic authorization status.
- Use "product/session-quality verdict" as a conservative generated-evidence verdict, not a claim of field validation.

---

## Implementation Units

- [x] U1. **Refine D49 Packet Model**

**Goal:** Add selected next-work, split redistribution evidence, and separate resolution/authorization fields.

**Requirements:** R1, R2, R3, R4, R5, R6.

**Dependencies:** None.

**Files:**
- Modify: `app/src/domain/generatedPlanDiagnosticTriage.ts`
- Test: `app/src/domain/__tests__/generatedPlanDiagnosticTriage.test.ts`

**Approach:**
- Split D49 redistribution groups into pressure-bearing U8 candidates and no-pressure optional-slot observations.
- Add `selectedNextWork`, `selectedNextWorkRationale`, `selectedNextWorkOwner`, `selectedNextWorkRevisitTrigger`, and `sessionQualityVerdict`.
- Replace or supplement generic `authorizationStatus` with explicit D49 change authorization fields for cap, catalog, runtime redistribution, and D47 reopen.
- Rename/clarify D47 closure output as D47 resolution state in rendered text.
- Define U8 wording as: "existing redistribution causality receipt evidence routes to a future generator-policy follow-up."

**Test scenarios:**
- Current D49 pressure-bearing redistribution groups select or support `route_to_u8`.
- D49 optional-slot-only groups route to `no_implementation_action_yet` and do not count toward U8 pressure.
- D47 original-key return selects D47 re-entry before D49 work.
- Markdown shows selected next work, product/session-quality verdict, and all D49 change authorizations as `not_authorized`.

**Verification:**
- The packet chooses a next action instead of only listing lanes.
- Optional-slot-only redistribution does not create false U8 debt.

---

- [x] U2. **Regenerate Docs And Metadata**

**Goal:** Refresh generated diagnostics docs and catalog summaries after the packet refinement.

**Requirements:** R7.

**Dependencies:** U1.

**Files:**
- Modify generated output: `docs/reviews/2026-05-01-generated-plan-diagnostics-triage.md`
- Modify if needed: `docs/catalog.json`
- Modify: `docs/plans/2026-05-03-001-feat-d49-next-work-selection-plan.md`

**Approach:**
- Regenerate diagnostics triage with the existing report script.
- Update catalog metadata for the new plan and any changed generated-triage summary.
- Mark this plan complete after verification passes.

**Test scenarios:**
- Diagnostics report check passes after regeneration.
- Catalog text does not imply D49 cap/catalog/runtime authorization.

**Verification:**
- `cd app && npm test -- --run src/domain/__tests__/generatedPlanDiagnosticTriage.test.ts`
- `cd app && npm run diagnostics:report:check`
- `cd app && npm run build`
- `bash scripts/validate-agent-docs.sh`

---

## System-Wide Impact

- **Domain logic:** Generated diagnostic triage packet only.
- **Runtime:** No session assembly or browser behavior changes.
- **Docs:** Generated triage and catalog routing become more decision-oriented.
- **Unchanged invariants:** D49 changes remain not authorized; D47 re-entry remains keyed to the original D47 comparator group returning.

---

## Implementation Result

The D49 residual packet now selects `route_to_u8` for current pressure-bearing D49 redistribution evidence, keeps D49 under-min workload review visible, and splits optional-slot-only D49 redistribution into an accepted residual/no-action lane. It also renders a product/session-quality verdict and explicit `not_authorized` fields for D49 cap, catalog, runtime redistribution, and D47 reopen changes.

---

## Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| Packet overroutes no-pressure redistribution to U8. | Split pressure-bearing and no-pressure lanes with tests. |
| D47 closure looks like D49 change permission. | Render D47 resolution separately from D49 change authorization fields. |
| Product value remains hidden behind diagnostics. | Require selected next work and a session-quality verdict in markdown. |

---

## Sources & References

- `docs/plans/2026-05-02-018-feat-d49-residual-follow-up-plan.md`
- `docs/reviews/2026-05-01-generated-plan-diagnostics-triage.md`
- `app/src/domain/generatedPlanDiagnosticTriage.ts`
- `app/src/domain/__tests__/generatedPlanDiagnosticTriage.test.ts`
