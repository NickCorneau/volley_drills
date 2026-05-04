---
id: d49-scoped-u8-generator-policy-follow-up-plan-2026-05-03
title: "feat: Add D49-Scoped U8 Generator-Policy Follow-Up"
type: plan
status: complete
stage: validation
summary: "Completed plan for adding a D49-scoped U8 proof packet that evaluates whether pressure-bearing D49 optional-slot redistribution should route to a future generator-policy proposal, while preserving diagnostic-only evidence and not authorizing runtime redistribution, catalog, cap, or D47 changes."
date: 2026-05-03
origin: docs/plans/2026-05-03-001-feat-d49-next-work-selection-plan.md
depends_on:
  - docs/brainstorms/2026-05-02-generated-diagnostics-redistribution-causality-receipt-requirements.md
  - docs/plans/2026-05-03-001-feat-d49-next-work-selection-plan.md
  - docs/reviews/2026-05-01-generated-plan-diagnostics-triage.md
  - docs/ops/workload-envelope-authoring-guide.md
---

# feat: Add D49-Scoped U8 Generator-Policy Follow-Up

## Overview

The generated D49 residual packet now selects `route_to_u8` for two pressure-bearing D49 optional-slot redistribution groups. This plan turns that selected next work into a bounded U8 proof packet: a diagnostic-only decision artifact that determines whether D49 has enough allocated-duration counterfactual evidence to justify a future generator-policy proposal.

This is not a runtime policy change. It is a proof and routing artifact that keeps catalog content, D49 caps, broad session redistribution, and D47 reopening outside the current authorization boundary.

---

## Problem Frame

Current generated diagnostics show:

- D49 pressure-bearing redistribution evidence: 20 affected cells across `d49-solo-open` and `d49-pair-open` main-skill groups.
- D49 optional-slot-only residual debt: 12 affected cells, already classified as no implementation action.
- D49 workload-envelope evidence: 16 affected cells that should remain visible but not block the U8 proof.

The next useful question is narrow: does the D49 pressure-bearing redistribution evidence provide enough diagnostic proof to plan a future generator-policy change, or should it fall back to workload/block-shape review or no action?

---

## Requirements Trace

- R1. Start from only the pressure-bearing D49 `route_to_u8` groups, not optional-slot-only D49 residual debt.
- R2. Preserve stable group-key traceability for `d49-solo-open` and `d49-pair-open` pressure-bearing main-skill groups.
- R3. Record allocated-duration counterfactual facts: affected cells, pressure-disappears count, pressure-remains count, redistribution-only count, and evidence type.
- R4. Add a D49-scoped U8 proof outcome with conservative states: `ready_for_generator_policy_proposal`, `needs_workload_or_block_shape_review`, `inconclusive`, or `no_action`.
- R5. Add explicit authorizations showing runtime redistribution, catalog content, D49 caps, D49 source depth, and D47 reopen are all `not_authorized`.
- R6. Keep optional-slot-only D49 evidence out of the U8 proof and classify it as residual debt/no action.
- R7. Render the packet in the generated triage workbench and make the generated docs freshness check include this plan.
- R8. Add tests proving D49 pressure-bearing evidence can select the U8 proof outcome without changing session assembly or catalog data.

---

## Scope Boundaries

- Do not change `buildDraft()` behavior, session assembly, optional-slot redistribution, archetypes, or routing.
- Do not add, remove, or edit drills, variants, tags, workload caps, copy, or source-backed catalog content.
- Do not widen D49 caps or reopen D47.
- Do not implement a generator policy proposal. This plan can only decide whether a future proposal is ready to plan.
- Do not route optional-slot-only D49 observations into U8.
- Do not require U6 impact preview; there is no catalog/cap proposal in this slice.

---

## Context & Research

### Relevant Code And Docs

- `app/src/domain/generatedPlanDiagnosticTriage.ts` owns redistribution causality receipts, D49 residual follow-up, and generated workbench markdown.
- `app/src/domain/__tests__/generatedPlanDiagnosticTriage.test.ts` covers current D49 packet behavior and should host the U8 proof tests.
- `app/src/domain/generatedPlanDiagnostics.ts` owns the generated diagnostics facts that feed group receipts; this slice should not modify its runtime-facing behavior.
- `app/src/domain/sessionBuilder.ts` and `app/src/domain/sessionAssembly/candidates.ts` are relevant boundaries but should remain unchanged unless implementation discovers the proof cannot be expressed from existing diagnostic facts.
- `docs/brainstorms/2026-05-02-generated-diagnostics-redistribution-causality-receipt-requirements.md` defines U8 as diagnostic-only evidence, not policy acceptance.
- `docs/ops/workload-envelope-authoring-guide.md` says redistribution prompts route to U8 and remain evidence, not authorization.

### Research Summary

Repo research found a tight path: keep this in diagnostics/triage, use existing allocated-duration counterfactual evidence, and produce a D49-scoped proof packet that can name a future generator-policy proposal only if pressure-bearing evidence is current and complete. There are no `docs/solutions/` learnings to apply.

---

## Key Technical Decisions

- Model this as a new generated D49 U8 proof packet, not as a mutation of runtime generation.
- Use existing `GeneratedPlanRedistributionCausalityReceipt` facts for pressure-bearing group evaluation.
- Treat `likely_redistribution_caused` plus zero pressure-remains cells as sufficient for `ready_for_generator_policy_proposal`, because U8 is still diagnostic-only and the future proposal remains gated.
- Treat workload under-min evidence as a visible caveat, not a blocker to the pressure-bearing U8 proof.
- Preserve `no_action` for optional-slot-only D49 redistribution, even when it coexists with ready pressure-bearing evidence.

---

## Implementation Units

- [x] U1. **Add D49 U8 Proof Packet**

**Goal:** Build a diagnostic-only D49 U8 packet that evaluates only current pressure-bearing D49 redistribution evidence and selects a conservative proof outcome.

**Requirements:** R1, R2, R3, R4, R5, R6, R8.

**Dependencies:** None.

**Files:**
- Modify: `app/src/domain/generatedPlanDiagnosticTriage.ts`
- Test: `app/src/domain/__tests__/generatedPlanDiagnosticTriage.test.ts`

**Approach:**
- Add D49-scoped U8 types for proof outcome, authorization, and packet facts.
- Select only authorized D49 pressure-bearing groups currently routed by the D49 residual packet as `route_to_u8`.
- Derive facts from the redistribution causality receipt, including evidence type `allocated_duration_counterfactual`.
- Add `ready_for_generator_policy_proposal` only when pressure-bearing D49 groups are current, all selected groups are `likely_redistribution_caused`, and pressure-remains cells are zero.
- Include optional-slot-only D49 residual debt as excluded evidence, not proof evidence.
- Render future next artifact language as "D49 generator-policy proposal plan" while explicitly stating no runtime redistribution is authorized.

**Test scenarios:**
- Current generated groups build a D49 U8 packet with `ready_for_generator_policy_proposal`, 20 affected cells, 20 pressure-disappears cells, 0 pressure-remains cells, and the two pressure-bearing D49 group keys.
- Optional-slot-only D49 evidence is excluded from proof groups and remains no action/residual debt.
- Missing or stale D49 pressure-bearing evidence yields `no_action` or `inconclusive`, not a proposal-ready outcome.
- If pressure remains in D49 proof evidence, the packet routes to workload/block-shape review instead of generator-policy proposal readiness.
- All authorization fields remain `not_authorized`.

**Execution note:** Test-first. Add failing packet tests before implementing the packet.

**Verification:**
- `cd app && npm test -- --run src/domain/__tests__/generatedPlanDiagnosticTriage.test.ts`

---

- [x] U2. **Render And Regenerate D49 U8 Routing Docs**

**Goal:** Add the D49 U8 proof packet to the generated triage workbench and register the plan/docs metadata.

**Requirements:** R7.

**Dependencies:** U1.

**Files:**
- Modify: `app/scripts/validate-generated-plan-diagnostics-report.mjs`
- Modify generated output: `docs/reviews/2026-05-01-generated-plan-diagnostics-triage.md`
- Modify: `docs/catalog.json`
- Modify: `docs/plans/2026-05-03-003-feat-d49-scoped-u8-generator-policy-follow-up-plan.md`

**Approach:**
- Add the new plan as a generated triage dependency.
- Render the D49 U8 proof packet near the D49 residual follow-up section so maintainers can see the handoff.
- Update catalog summaries to name the new D49 U8 proof packet and clarify that it is diagnostic-only.
- Mark this plan complete only after verification passes.

**Test scenarios:**
- Markdown includes D49 U8 proof outcome, evidence type, selected group keys, excluded optional-slot-only evidence, and authorization fields.
- Generated diagnostics check fails if the triage doc is stale, then passes after regeneration.
- Catalog summary does not claim runtime, catalog, cap, or D47 authorization.

**Verification:**
- `cd app && npm run diagnostics:report:check`
- `cd app && npm run build`
- `bash scripts/validate-agent-docs.sh`

---

## System-Wide Impact

- **Domain logic:** Adds a generated triage packet and markdown section only.
- **Runtime:** No user-facing behavior or session assembly change.
- **Catalog:** No content, cap, or metadata change.
- **Docs:** Generated triage and catalog routing become more explicit about the future D49 generator-policy proposal gate.

---

## Implementation Result

The generated triage workbench now includes a `D49 U8 Generator-Policy Proof` packet. Current D49 pressure-bearing optional-slot redistribution evidence is classified as `ready_for_generator_policy_proposal` with 20 affected cells, 20 pressure-disappears cells, 0 pressure-remains cells, and explicit `not_authorized` fields for runtime redistribution, catalog content, D49 caps, source depth, and D47 reopening. Optional-slot-only D49 evidence remains excluded residual debt/no action.

---

## Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| Diagnostic proof is mistaken for policy acceptance. | Explicit authorization fields and stop condition remain `not_authorized`. |
| Optional-slot-only D49 residual debt leaks into U8. | Separate excluded-evidence field and tests. |
| Workload under-min evidence is hidden by generator-policy readiness. | Include a workload caveat and route it separately from U8 proof. |
| Existing typography catalog edits are overwritten during planning. | Preserve unrelated dirty tree entries and patch only the D49 plan/catalog areas. |

---

## Sources & References

- `docs/brainstorms/2026-05-02-generated-diagnostics-redistribution-causality-receipt-requirements.md`
- `docs/plans/2026-05-03-001-feat-d49-next-work-selection-plan.md`
- `docs/reviews/2026-05-01-generated-plan-diagnostics-triage.md`
- `docs/ops/workload-envelope-authoring-guide.md`
- `app/src/domain/generatedPlanDiagnosticTriage.ts`
- `app/src/domain/__tests__/generatedPlanDiagnosticTriage.test.ts`
