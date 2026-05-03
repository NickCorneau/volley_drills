---
id: generated-diagnostics-d01-redistribution-handoff-plan-2026-05-02
title: "feat: Add D01 Redistribution Handoff Admission"
status: complete
stage: validation
type: plan
summary: "Implementation plan for the D01 redistribution-specific follow-up: add an admission-first handoff check, record whether handoff is applied or insufficient, and reassess whether D01 still blocks the D47 gap-closure path."
active_registry: true
date: 2026-05-02
origin: docs/brainstorms/2026-05-02-generated-diagnostics-d01-redistribution-handoff-requirements.md
---

# feat: Add D01 Redistribution Handoff Admission

## Overview

Add the next D01 block-shape follow-up as an admission-first slice. The current D01 receipt is not a clean “redistribution caused this” case: it has 12 affected cells, 12 pressure-remains cells, and examples where allocated duration already exceeds D01's 5-minute envelope. The implementation therefore avoids a blind runtime handoff and proves that the current D01 residual is not handoff-admissible.

If a future case is admissible, the receipt now identifies it as an admissible candidate for a bounded handoff. For the current baseline, generated diagnostics say handoff is insufficient and route the workflow to the next decision instead of authorizing another vague D01 runtime loop.

---

## Problem Frame

The first D01 fill partially validated the diagnostic-to-fill workflow: D01 target cells moved from 18 to 12 and non-redistribution pressure moved from 6 to 0. The remaining target group is still present, but its causality receipt says `pressure_remains_without_redistribution`; moving redistributed minutes alone may not close it.

This plan therefore implements a bounded D01 handoff admission model rather than a broad redistribution policy. It preserves the user goal: identify real programming gaps and concretely fill them, while refusing to call diagnostic-green movement a product win if the underlying training shape remains dishonest.

---

## Requirements Trace

- R1-R7. Add D01-only handoff admission and, when admissible, a deterministic already-selected-block handoff that preserves workload and training intent.
- R8-R14. Extend generated diagnostics reassessment so the workbench records applied, rejected, or insufficient handoff state and the next D01/D47 decision.
- R15-R19. Keep scope narrow: no D01 metadata edits, no broad redistribution scoring, no source-backed content/U6/UI, no hidden diagnostics, and no endless D01 runtime loops.

**Origin actors:** A1 Maintainer, A2 Agent implementer, A3 Reviewer.  
**Origin flows:** F1 D01 redistribution handoff admission; F2 Residual reassessment.  
**Origin acceptance examples:** AE1 admissible handoff; AE2 allocated-duration insufficient; AE3 training-intent rejection; AE4 non-D01 invariance; AE5 reassessment states.

---

## Scope Boundaries

- Do not edit `app/src/data/drills.ts`, D01 workload metadata, or authored archetype durations.
- Do not add drills, variants, source-backed content, U6 preview tooling, UI, or activation manifests.
- Do not change swap alternatives or recovery-session assembly.
- Do not globally optimize redistribution targets or create a broad workload scoring system.
- Do not claim field training-quality validation.
- Do not allow partial movement alone to authorize another D01 runtime follow-up.

---

## Context & Research

### Relevant Code and Patterns

- `app/src/domain/sessionBuilder.ts` owns optional-slot redistribution and already computes selected layout indexes, redistributed minutes, and final block durations.
- `app/src/domain/sessionAssembly/candidates.ts` exposes `candidateCanCarryTargetDuration()` and `candidateDurationCapacity()`; reuse these capacity definitions rather than duplicating workload math.
- `app/src/domain/generatedPlanDiagnostics.ts` records affected cells and redistribution evidence; it is the likely place to carry any handoff evidence needed by the workbench.
- `app/src/domain/generatedPlanDiagnosticTriage.ts` owns the D01 fill receipt and generated markdown rendering.
- `app/src/domain/sessionBuilder.test.ts`, `app/src/domain/__tests__/generatedPlanDiagnosticTriage.test.ts`, and possibly `app/src/domain/__tests__/generatedPlanDiagnostics.test.ts` are the focused test surfaces.
- `app/scripts/validate-generated-plan-diagnostics-report.mjs` owns generated report/triage freshness dependencies.

### Institutional Learnings

- Generated diagnostics are evidence first; runtime changes need named proposals and regenerated receipts before they can be considered closed.
- D01 precedent favors block-shape/programming fixes before cap widening, source-backed content, U6 preview, or broad generator policy.
- No durable `docs/solutions/` learning exists yet; a future `/ce-compound` pass should capture this pattern once the D01 loop reaches an exit.

### External References

- None. Local generated diagnostics, workload envelopes, and session assembly traces are sufficient.

---

## Key Technical Decisions

- Admission before behavior: only hand off redistributed minutes when D01's allocated duration is within its envelope and the handoff can materially improve the target receipt.
- Already-selected targets only: do not introduce a new drill just to absorb redistributed minutes.
- Training-intent target order: prefer selected non-D01 focus-controlled/support blocks before warmup or wrap; treat warmup/wrap absorption as duration preservation only, not full gap closure.
- D01-only scope: do not alter non-D01 redistribution decisions.
- Receipt as exit control: if current D01 remains allocated-duration-shaped, the workbench should say handoff is insufficient and name the next decision rather than inviting another vague runtime patch.

---

## Open Questions

### Resolved During Planning

- Should the implementation blindly move redistributed minutes first? No. The current D01 receipt shows allocated-duration pressure, so admission must precede handoff.
- Should this become global redistribution policy? No. At most, a validated D01 handoff can recommend a future global generator-policy candidate.
- Should warmup/wrap absorption count as product gap closure? No. It can preserve duration, but the receipt must label the training-quality boundary.

### Deferred to Implementation

- Exact trace field names for handoff evidence should follow the existing assembly trace naming style.
- Exact generated receipt status names should match local union naming conventions.
- Current diagnostics may prove no handoff is admissible; if so, implement the explicit insufficient receipt rather than forcing a runtime change.

---

## Implementation Units

- [x] U1. **Add D01 handoff admission decision**

**Goal:** Keep redistribution behavior unchanged when the current D01 target is not handoff-admissible, and make that decision explicit through generated diagnostics instead of forcing a runtime minute move.

**Requirements:** R1-R7, R15-R19, AE1-AE4

**Dependencies:** None.

**Files:**

- Modify: `app/src/domain/generatedPlanDiagnosticTriage.ts`
- Test: `app/src/domain/__tests__/generatedPlanDiagnosticTriage.test.ts`

**Approach:**

- Add a small helper that classifies D01 redistribution handoff admission as target absent, admissible candidate, mixed admission, or `insufficient_allocated_pressure`.
- Base the admission decision on the current D01 receipt facts rather than assuming all redistribution-bearing pressure is causally removable by handoff.
- Reject handoff when D01 cannot carry its allocated duration before redistribution.
- Preserve existing redistribution behavior when admission rejects or no admissible target exists.

**Execution note:** Test-first for admissible/insufficient D01 receipt cases.

**Patterns to follow:**

- Existing D01 fill receipt helpers in `app/src/domain/generatedPlanDiagnosticTriage.ts`.
- Existing synthetic redistribution receipt fixtures in `app/src/domain/__tests__/generatedPlanDiagnosticTriage.test.ts`.

**Test scenarios:**

- Current baseline: if D01 allocated duration already exceeds its envelope, handoff admission is insufficient.
- Synthetic admissible case: if pressure disappears under allocated-duration comparison, the receipt marks handoff as an admissible candidate.
- Missing target case: if D01 target is absent, handoff is not needed and D47 can resume.
- Regression: no runtime redistribution behavior changes are made in this slice.

**Verification:**

- Focused generated-triage tests pass.

**Implementation result:** Current generated diagnostics prove the live D01 target is `insufficient_allocated_pressure`, so no runtime handoff was applied in this slice. The handoff admission state is represented in the generated receipt instead.

---

- [x] U2. **Expose handoff evidence to generated diagnostics**

**Goal:** Make the generated workbench distinguish not-needed, admissible, mixed, and insufficient D01 handoff outcomes.

**Requirements:** R8-R14, AE5

**Dependencies:** U1.

**Files:**

- Modify: `app/src/domain/generatedPlanDiagnosticTriage.ts`
- Test: `app/src/domain/__tests__/generatedPlanDiagnosticTriage.test.ts`

**Approach:**

- Add the minimum receipt evidence needed for D01 handoff admission: handoff state, reason, and D47 next state.
- Keep the existing D01 fill receipt as the owner so prior D01 fill history remains readable.
- Include a next-state field: `resume_d47`, `d01_still_open`, or `cap_or_catalog_proposal_needed`.

**Execution note:** Test-first for receipt classification and rendering.

**Patterns to follow:**

- Existing D01 fill receipt builder and markdown rendering in `app/src/domain/generatedPlanDiagnosticTriage.ts`.
- Generated diagnostics affected-cell serialization style in `app/src/domain/generatedPlanDiagnostics.ts`.

**Test scenarios:**

- Current baseline: the receipt marks handoff `insufficient_allocated_pressure` when D01 allocated pressure remains.
- Admissible synthetic case: receipt marks handoff `admissible_candidate` when pressure disappears under allocated-duration comparison.
- Missing target case: receipt remains validated when the D01 target group is absent.
- Rendering: markdown includes handoff state, reason, next state, and D47 blocker status.

**Verification:**

- Focused generated diagnostics/triage tests pass.

---

- [x] U3. **Regenerate diagnostics and sync docs routing**

**Goal:** Update generated outputs, freshness dependencies, catalog routing, and parent workflow state for the D01 handoff admission follow-up.

**Requirements:** R8-R19, AE5

**Dependencies:** U1, U2.

**Files:**

- Modify: `app/scripts/validate-generated-plan-diagnostics-report.mjs`
- Modify generated output: `docs/reviews/2026-05-01-generated-plan-diagnostics-report.md`
- Modify generated output: `docs/reviews/2026-05-01-generated-plan-diagnostics-triage.md`
- Modify: `docs/catalog.json`
- Modify: `docs/plans/2026-05-01-002-feat-generated-diagnostics-triage-workflow-plan.md`
- Modify: `docs/plans/2026-05-02-008-feat-d01-redistribution-handoff-plan.md`

**Approach:**

- Add the new requirements and plan documents to generated diagnostics freshness dependencies.
- Run diagnostics update after behavior/receipt changes.
- Add this plan to `docs/catalog.json`.
- Update the parent workflow plan with the D01 handoff admission outcome.
- Mark this plan complete only after verification.

**Patterns to follow:**

- Prior D01 fill dependency and catalog updates.

**Test scenarios:**

- Freshness check recognizes the new docs.
- Agent-doc validation accepts the new routing surfaces.

**Verification:**

- `npm run diagnostics:report:check`
- `bash scripts/validate-agent-docs.sh`

---

## System-Wide Impact

- **Interaction graph:** Session assembly redistribution -> assembly trace -> generated diagnostics -> D01 reassessment receipt -> docs routing.
- **Error propagation:** Insufficient handoff stays a receipt state; it should not fail draft generation.
- **State lifecycle risks:** D01 should exit to a named next state if handoff cannot close it.
- **API surface parity:** Public routes and Dexie schema remain unchanged.
- **Integration coverage:** Builder tests plus generated diagnostics freshness prove behavior and docs integration.

---

## Risks & Dependencies

| Risk                                                                            | Mitigation                                                                                              |
| ------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| Handoff cannot close current D01 because allocated duration already exceeds cap | Make insufficient handoff an explicit receipt state and exit decision, not a hidden failure.            |
| Warmup/wrap absorbs minutes and makes diagnostics greener but training worse    | Require training-intent target ordering and label warmup/wrap absorption as duration preservation only. |
| Implementation becomes global redistribution scoring                            | Gate on D01 and already-selected blocks only.                                                           |
| Generated docs drift after diagnostics update                                   | Run report update/check and agent-doc validation.                                                       |
| D01 loop keeps extending after partial movement                                 | Require next-state receipt and block another D01 runtime follow-up without a new causal mechanism.      |

---

## Documentation / Operational Notes

- This plan may produce an explicit “handoff insufficient” outcome rather than a runtime behavior change for the current baseline. That is acceptable if the generated evidence proves the selected fill shape is not causal enough.
- If D01 remains open after this plan, the next decision should be a cap/catalog/source-backed proposal or returning to D47, not another ambiguous runtime tweak.

---

## Sources & References

- **Origin document:** [docs/brainstorms/2026-05-02-generated-diagnostics-d01-redistribution-handoff-requirements.md](../brainstorms/2026-05-02-generated-diagnostics-d01-redistribution-handoff-requirements.md)
- Prior D01 fill requirements: [docs/brainstorms/2026-05-02-generated-diagnostics-d01-block-shape-fill-requirements.md](../brainstorms/2026-05-02-generated-diagnostics-d01-block-shape-fill-requirements.md)
- Prior D01 fill plan: [docs/plans/2026-05-02-007-feat-d01-block-shape-fill-plan.md](2026-05-02-007-feat-d01-block-shape-fill-plan.md)
- Current generated triage: [docs/reviews/2026-05-01-generated-plan-diagnostics-triage.md](../reviews/2026-05-01-generated-plan-diagnostics-triage.md)
