---
id: d47-d05-comparator-evaluation-payload-plan-2026-05-02
title: "feat: Add D47 vs D05 Comparator Evaluation Payload"
type: plan
status: complete
stage: validation
summary: "Completed implementation plan for adding the D47-vs-D05 comparator evaluation payload that moves the generated comparator packet from hold to a not-authorized D47-winning outcome and names a D47 source-backed catalog implementation plan as the follow-up artifact."
date: 2026-05-02
origin: docs/plans/2026-05-02-012-feat-d47-d05-comparator-decision-packet-plan.md
depends_on:
  - docs/plans/2026-05-02-012-feat-d47-d05-comparator-decision-packet-plan.md
  - docs/reviews/2026-05-01-generated-plan-diagnostics-triage.md
  - docs/reviews/2026-05-02-d47-source-backed-gap-card.md
  - docs/brainstorms/2026-05-02-generated-diagnostics-d47-concrete-delta-proposal-requirements.md
  - docs/ops/workload-envelope-authoring-guide.md
  - app/src/domain/generatedPlanDiagnosticTriage.ts
---

# feat: Add D47 vs D05 Comparator Evaluation Payload

## Overview

Add the next generated-diagnostics artifact after the D47-vs-D05 comparator packet: a comparator evaluation payload. The payload should supply exactly one proof path and allow the generated packet to choose a concrete next artifact while still keeping every implementation surface `not_authorized`.

The intended current payload is D47-winning, because D47 has a named source-backed gap card and a specific advanced setting/movement selection-path hypothesis, while D05 remains a valid re-entry comparator but does not yet have a stronger concrete proposal than the held D47 source-backed candidate. This plan still requires the code to keep D05/no-change/hold branches testable and fail-closed.

Status note (2026-05-02): Implemented. The generated triage now renders a D47-winning comparator evaluation payload and a selected comparator packet outcome of `d47_wins`, while preserving `authorizationStatus: not_authorized`.

Terminology for this plan:

- **Evaluation payload:** the new proof artifact this plan creates.
- **Selected outcome:** the comparator packet outcome produced from that payload.
- **Follow-up artifact:** the next planned artifact after the selected outcome. For the intended D47-winning payload, this is a later D47 source-backed catalog implementation plan; if implementation selects D05, no-change, or hold instead, the follow-up artifact must match that outcome.

---

## Problem Frame

The current generated triage stops at `hold_both_for_evidence` because no complete comparator evaluation payload exists. That is correct, but it means the repo cannot honestly move to catalog planning yet. The next artifact must decide whether D47 has earned the right to use `docs/reviews/2026-05-02-d47-source-backed-gap-card.md` as catalog-planning input, whether D05 should become the next concrete gap-fill target, whether no-change is acceptable, or whether both candidates still hold.

The main risk is smuggling catalog authorization into the comparator payload. A D47-winning payload may unlock a later catalog plan, but this slice must not edit `app/src/data/drills.ts`, runtime generation, workload metadata, U6 preview tooling, or catalog validation behavior.

---

## Requirements Trace

- R1. Preserve the comparator packet contract from `docs/plans/2026-05-02-012-feat-d47-d05-comparator-decision-packet-plan.md`.
- R2. Add a durable evaluation payload with exactly one selected proof path; do not rely on silent builder priority when multiple payload branches are present.
- R3. For the current state, encode a D47-winning proof only if it names served segment, session exposure, perceived session failure, changed surface, smallest action, source/adaptation basis, future selection path, expected diagnostic movement, regression risk, no-action threshold, D05 loser re-entry trigger, and scoring rationale.
- R4. Keep D05 eligible to win in tests and future payloads only when it names one concrete proposal type and next artifact.
- R5. Keep accepted no-change eligible only with acceptance evidence, accepted blast radius, no-action threshold, and revisit trigger for both D47 and D05.
- R6. Keep continued hold eligible only with one named evidence artifact, owner/unblock condition, and stop condition.
- R7. Define score semantics so higher numeric scores always mean a more favorable comparator result; for maintenance cost, higher means lower cost / easier to maintain.
- R8. Render the selected payload and resulting packet in the generated triage output and keep diagnostics freshness validation blocking.
- R9. If the selected outcome is `d47_wins`, sync generated output so the follow-up artifact is a D47 source-backed catalog implementation plan, not direct catalog editing. If implementation selects D05, no-change, or hold instead, sync the follow-up artifact to that outcome.

---

## Scope Boundaries

- Do not edit `app/src/data/drills.ts`.
- Do not add `d49`, `d49-solo-open`, or `d49-pair-open` in this slice.
- Do not change runtime generation, optional-slot redistribution, workload metadata, U6 preview tooling, Dexie schema, UI, or routes.
- Do not accept D47 because of affected-cell count alone.
- Do not treat the D47 gap card as source/adaptation approval for implementation; it becomes planning input only.
- Do not remove D05 re-entry. D05 remains the fallback if D47 source/adaptation review or future catalog diagnostics fail.

### Deferred to Follow-Up Work

- D47 catalog implementation plan: only after this payload makes the comparator packet select `d47_wins`.
- Source/adaptation review for exact 1-2 player implementation details: belongs in the catalog plan, not this payload.
- U6 catalog impact preview: still deferred until a concrete catalog candidate exists.

---

## Context & Research

### Relevant Code and Patterns

- `app/src/domain/generatedPlanDiagnosticTriage.ts` already defines the D47-vs-D05 comparator packet, evaluation payload shapes, readiness checks, formatter, and generated workbench integration.
- `app/src/domain/__tests__/generatedPlanDiagnosticTriage.test.ts` already covers hold, D47 win, D05 win, no-change, stale/missing D05 evidence, inconclusive evidence, and formatter branches.
- `app/scripts/validate-generated-plan-diagnostics-report.mjs` owns generated triage frontmatter and freshness.
- `docs/reviews/2026-05-01-generated-plan-diagnostics-triage.md` currently records the hold state and current receipt facts.
- `docs/reviews/2026-05-02-d47-source-backed-gap-card.md` is a held D47 exhibit naming a plausible D49-style advanced setting/movement sibling.

### Institutional Learnings

- No `docs/solutions/` learning exists for this diagnostic-to-catalog-gate pattern yet.
- Existing generated-diagnostics docs repeatedly establish the local rule: generated observations and payloads are evidence, not authorization.

### External References

- No new external research is needed for this plan. The relevant external source candidates are already recorded in `docs/reviews/2026-05-02-d47-source-backed-gap-card.md`.

---

## Key Technical Decisions

- Use a typed current evaluation payload in `generatedPlanDiagnosticTriage.ts` rather than parsing Markdown at generation time. This matches the existing generated-diagnostics pattern: durable docs explain the decision, pure domain code renders the current generated state.
- Add an explicit payload branch/selection layer before passing evaluations to the packet builder. This prevents multiple complete branches from being silently resolved by builder priority.
- Make the current payload select D47 with `authorizationStatus: not_authorized` and follow-up artifact `D47 source-backed catalog implementation plan`.
- Score semantics are ordinal and local to this comparator: higher is better for training value, evidence readiness, future selection path, maintainability, diagnostic movement, and strategic priority.
- Keep D05 and no-change fixtures in tests even though the current generated payload selects D47.

---

## Open Questions

### Resolved During Planning

- Should this edit catalog data? No. It only lets the next plan start catalog implementation work.
- Should D47 win automatically because a gap card exists? No. The payload must name selection-path proof and D05/no-change defeat rationale.
- Should D05 be removed as an option? No. It remains a re-entry path if D47 fails source/adaptation or diagnostic review.

### Deferred to Implementation

- Exact type and helper names can follow local naming around `GeneratedPlanD47D05Comparator*`.
- Exact generated markdown phrasing can follow the existing packet formatter, as long as it names the selected proof path, next artifact, stop condition, and D05 re-entry trigger.

---

## Implementation Units

- [x] U1. **Define The Current Evaluation Payload Contract**

**Goal:** Add a typed current payload wrapper that can express exactly one proof path for D47, D05, no-change, or continued hold.

**Requirements:** R1, R2, R4, R5, R6, R7.

**Dependencies:** None.

**Files:**
- Modify: `app/src/domain/generatedPlanDiagnosticTriage.ts`
- Test: `app/src/domain/__tests__/generatedPlanDiagnosticTriage.test.ts`

**Approach:**
- Add a closed payload union or equivalent helper that wraps exactly one of D47 evaluation, D05 evaluation, no-change evaluation, or hold evidence.
- Add score semantics comments/copy so `maintenanceCostScore` cannot be misread as "higher cost."
- Convert the payload to the existing `GeneratedPlanD47D05ComparatorEvaluations` shape only after exclusivity is enforced.

**Execution note:** Add/adjust characterization tests before wiring the generated output.

**Patterns to follow:**
- `GeneratedPlanD01CapCatalogForkPacket` and `GeneratedPlanD47D05ComparatorDecisionPacket` closed unions in `app/src/domain/generatedPlanDiagnosticTriage.ts`.

**Test scenarios:**
- Happy path: a D47-only payload converts to a D47 evaluation and selects `d47_wins`.
- Happy path: D05 and no-change payload fixtures remain eligible when they supply their complete proof shapes.
- Edge case: multiple complete proof branches fail closed or are impossible through the typed payload.
- Edge case: a hold payload keeps `hold_both_for_evidence` and names one unblock artifact.
- Regression: all payload outcomes keep `authorizationStatus: not_authorized`.

**Verification:**
- Focused tests prove the payload cannot silently contain competing selected outcomes.

---

- [x] U2. **Author The D47-Winning Evaluation Payload**

**Goal:** Encode the current D47 comparator proof using the held source-backed gap card while preserving D05 re-entry and no-change defeat rationale.

**Requirements:** R3, R7, R9.

**Dependencies:** U1.

**Files:**
- Modify: `app/src/domain/generatedPlanDiagnosticTriage.ts`
- Test: `app/src/domain/__tests__/generatedPlanDiagnosticTriage.test.ts`
- Create: `docs/reviews/2026-05-02-d47-d05-comparator-evaluation-payload.md`

**Approach:**
- Set D47 served segment to advanced open-court setting/movement.
- Use the D47 gap card's source/adaptation basis but keep it as planning evidence, not activation approval.
- Name the changed surface as a candidate D49-style source-backed sibling family, pending collision/source/adaptation review in the next plan.
- Name the future selection path: longer advanced setting/movement main-skill blocks should have a non-D47 surface available instead of stretching `d47-solo-open`.
- Give D05 a loser re-entry trigger: re-enter D05 if D47 source/adaptation review fails, if generated diagnostics do not move after catalog work, or if beginner/intermediate passing pressure grows.

**Patterns to follow:**
- `docs/reviews/2026-05-02-d47-source-backed-gap-card.md`
- Comparator evaluation fixtures already present in `app/src/domain/__tests__/generatedPlanDiagnosticTriage.test.ts`

**Test scenarios:**
- Happy path: current generated packet selects `d47_wins` from the payload.
- Happy path: packet renders the D47 source/adaptation basis, future selection path, D05 re-entry trigger, and next artifact.
- Regression: packet still does not authorize catalog/runtime edits.
- Regression: D47 cannot win if D47 or D05 receipt evidence becomes stale, missing, or comparison-inconclusive.

**Verification:**
- Generated triage shows `Selected outcome: d47_wins` and `Next artifact: D47 source-backed catalog implementation plan`.

---

- [x] U3. **Render Payload Evidence In Generated Triage**

**Goal:** Make the current payload visible in the generated triage review so the next planner can start from the winning proof instead of hidden code.

**Requirements:** R8, R9.

**Dependencies:** U1, U2.

**Files:**
- Modify: `app/src/domain/generatedPlanDiagnosticTriage.ts`
- Modify: `app/scripts/validate-generated-plan-diagnostics-report.mjs`
- Modify generated output: `docs/reviews/2026-05-01-generated-plan-diagnostics-triage.md`
- Test: `app/src/domain/__tests__/generatedPlanDiagnosticTriage.test.ts`

**Approach:**
- Pass the current payload into `buildGeneratedPlanD47D05ComparatorDecisionPacket()` from the generated workbench path.
- Render the payload document path, selected proof path, scoring semantics, next artifact, and stop condition.
- Add payload doc and this plan to generated triage frontmatter dependencies.

**Patterns to follow:**
- `formatGeneratedPlanD47D05ComparatorDecisionPacketMarkdown()`
- `triageMarkdown()` dependency block in `app/scripts/validate-generated-plan-diagnostics-report.mjs`

**Test scenarios:**
- Happy path: generated markdown includes the comparator payload review path.
- Happy path: generated markdown includes `Selected outcome: d47_wins`.
- Regression: generated markdown still includes `Authorization status: not_authorized`.
- Regression: `diagnostics:report:check` fails if generated triage is stale.

**Verification:**
- Generated triage is current and includes the payload evidence.

---

- [x] U4. **Sync Routing And Mark The Gate State**

**Goal:** Register the new payload and plan without turning the payload slice into premature catalog implementation routing.

**Requirements:** R8, R9.

**Dependencies:** U3.

**Files:**
- Modify: `docs/catalog.json`
- Modify: `docs/plans/2026-05-02-013-feat-d47-d05-comparator-evaluation-payload-plan.md`

**Approach:**
- Register the new payload review and this plan in `docs/catalog.json`.
- Mark this plan complete after verification.
- Keep the selected outcome and follow-up artifact visible in generated triage. Defer broader updates to the brainstorm, gap card, and parent workflow plan until the follow-up catalog implementation plan is created.

**Test scenarios:**
- Test expectation: none -- docs routing only, validated by agent-doc validation.

**Verification:**
- Agent-doc validation passes.

---

## System-Wide Impact

- **Interaction graph:** D01 held state -> D47/D05 receipt facts -> comparator evaluation payload -> comparator packet -> D47 catalog plan input.
- **Error propagation:** Stale, missing, or comparison-inconclusive D47/D05 evidence must still hold instead of selecting D47.
- **State lifecycle risks:** Generated triage and payload docs can drift; diagnostics freshness and docs validation should catch this after U3/U4.
- **API surface parity:** This is internal diagnostics-domain planning code, not an app API.
- **Integration coverage:** Unit tests cover selection; diagnostics update/check covers generated-doc integration.
- **Unchanged invariants:** Catalog data, runtime generator behavior, workload metadata, U6 preview tooling, Dexie schema, UI, and routes do not change.

---

## Risks & Dependencies

| Risk | Mitigation |
|------|------------|
| D47 wins by momentum instead of proof. | Payload must name source/adaptation basis, future selection path, D05 re-entry trigger, and no-action threshold. |
| D47 gap card becomes implicit activation. | Render and document `not_authorized`; next artifact is a catalog plan, not a catalog edit. |
| D05 is unfairly discarded. | Keep D05 loser re-entry trigger and D05-winning tests. |
| Numeric scores become ambiguous. | Define higher-is-better score semantics, including maintenance cost meaning lower cost when higher. |
| Generated docs drift from code. | Regenerate triage and run diagnostics freshness check. |

---

## Documentation / Operational Notes

- The payload is the "yes, D47 may be planned next" artifact, not the catalog implementation.
- If this lands as D47-winning, the next LFG target can be a D47 source-backed catalog implementation plan using `docs/reviews/2026-05-02-d47-source-backed-gap-card.md`.
- If implementation discovers the D47 proof is weaker than expected, choose the hold payload instead and document the unblock artifact.

---

## Sources & References

- **Origin plan:** `docs/plans/2026-05-02-012-feat-d47-d05-comparator-decision-packet-plan.md`
- **Generated triage:** `docs/reviews/2026-05-01-generated-plan-diagnostics-triage.md`
- **D47 held gap card:** `docs/reviews/2026-05-02-d47-source-backed-gap-card.md`
- **D47 gate requirements:** `docs/brainstorms/2026-05-02-generated-diagnostics-d47-concrete-delta-proposal-requirements.md`
- **Domain code:** `app/src/domain/generatedPlanDiagnosticTriage.ts`
