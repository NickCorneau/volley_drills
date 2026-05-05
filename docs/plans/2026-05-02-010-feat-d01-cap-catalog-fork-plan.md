---
id: generated-diagnostics-d01-cap-catalog-fork-plan-2026-05-02
title: "feat: Add D01 Cap/Catalog Fork Packet"
type: feat
status: complete
stage: validation
summary: "Implementation plan for turning the D01 insufficient allocated-pressure receipt into a decision-forcing cap/catalog/no-change/D47-resume packet, with catalog work gated on gap-card-ready evidence rather than presumed from allocated pressure alone."
active_registry: true
date: 2026-05-02
origin: docs/brainstorms/2026-05-02-generated-diagnostics-d01-cap-catalog-fork-requirements.md
---

# feat: Add D01 Cap/Catalog Fork Packet

## Overview

Add the next generated diagnostics artifact after the D01 redistribution handoff admission. The current D01 residual is not handoff-admissible: D01 still exceeds its workload envelope under allocated-duration comparison, and the workbench now says `cap_or_catalog_proposal_needed`.

This plan turns that state into a small decision-forcing packet. The packet should not presume that allocated pressure means catalog work. It should select `catalog_source_backed_delta` only when it can name a gap-card-ready catalog path; otherwise it should choose cap, accepted no-change, or `resume_d47_with_d01_held`.

---

## Problem Frame

The user wants to start actually filling drill-catalog gaps, not keep iterating on diagnostic machinery. The packet is the bridge: it must decide whether D01's remaining pressure is a catalog/source-backed gap, a cap proposal, accepted no-change, or a D47 resume condition.

The key implementation constraint is that the packet must fail closed on stale or mismatched evidence. It should only select a fork when the current D01 receipt is current, still reports `redistributionHandoffState: insufficient_allocated_pressure`, and still reports `d47NextState: cap_or_catalog_proposal_needed` (see origin: `docs/brainstorms/2026-05-02-generated-diagnostics-d01-cap-catalog-fork-requirements.md`). Matching those state labels is necessary but not sufficient for catalog work; the catalog fork also needs gap-card-ready evidence.

---

## Requirements Trace

- R1-R7. Build a D01 fork packet from current D01 receipt facts, extract the smallest missing ingredient, compare the four forks, select exactly one, and block another vague runtime loop.
- R8-R12. If catalog/source-backed work is selected, name the suspected catalog gap and route to source-backed catalog-fill requirements/planning without activating content in this slice; if that evidence is not gap-card-ready, resume D47 with D01 held instead.
- R13-R16. Support cap, accepted no-change, and D47-resume routes with explicit rationale, parent workflow mapping, and visible residual state.
- R17-R19. Preserve scope: no catalog edits, D01 metadata edits, U6 tooling, runtime generator changes, broad workload scoring, or hidden diagnostics.

**Origin actors:** A1 Maintainer, A2 Gap author, A3 Planner, A4 Reviewer.  
**Origin flows:** F1 D01 fork packet creation, F2 Catalog-fill fast path, F3 No-change or D47 resume.  
**Origin acceptance examples:** AE1 current fork packet, AE2 catalog fast path, AE3 cap route, AE4 no-change/D47 route, AE5 scope guard.

---

## Scope Boundaries

- Do not edit `app/src/data/drills.ts`, D01 workload metadata, source-backed content, U6 preview tooling, or generated session assembly.
- Do not implement the eventual drill-catalog fill in this plan; this plan may only route to it when the packet is gap-card-ready and explicitly non-activation.
- Do not globally solve workload envelope review or build a full coverage map.
- Do not make unresolved D01 diagnostics disappear without a visible closed, held, blocking, or handoff state.
- Do not claim field training-quality validation.

### Deferred to Follow-Up Work

- Source-backed catalog fill: If this plan routes D01 to `catalog_source_backed_delta`, the next cycle should create or execute the actual catalog gap card / source-backed fill plan with exact source references and activation criteria.
- U6 catalog impact preview: Remains deferred until a concrete catalog or cap proposal names changed IDs and expected generated-plan diagnostic deltas.
- Durable learning capture: After D01 reaches a cap/catalog/no-change/D47-resume exit, capture the diagnostic-to-fill loop pattern in `docs/solutions/`.

---

## Context & Research

### Relevant Code and Patterns

- `app/src/domain/generatedPlanDiagnosticTriage.ts` owns generated triage receipts, D01 fill receipt construction, D47 next-state fields, and workbench markdown rendering.
- `app/src/domain/__tests__/generatedPlanDiagnosticTriage.test.ts` already tests D01 fill receipt movement, insufficient handoff, admissible synthetic handoff, mixed admission, and markdown rendering.
- `app/scripts/validate-generated-plan-diagnostics-report.mjs` owns freshness dependencies for generated diagnostics report and triage docs.
- `docs/reviews/2026-05-01-generated-plan-diagnostics-triage.md` is generated output; update it through diagnostics scripts during implementation, not by manual prose edits.
- `docs/ops/workload-envelope-authoring-guide.md` defines U6 and U8 boundaries plus candidate dispositions.
- `docs/reviews/2026-04-30-focus-coverage-gap-cards.md` defines source-backed activation expectations.

### Institutional Learnings

- No durable `docs/solutions/` learning exists yet for this workflow.
- Adjacent D01/D47 docs reinforce the same pattern: generated diagnostics are evidence, not authorization; proposal packets must name deltas, evidence, falsification, and no-action thresholds before catalog/cap/generator work.
- The previous D01 handoff plan established that current D01 should exit runtime-loop mode because handoff is `insufficient_allocated_pressure`.

### External References

- Prior ideation research supports diagnosis -> constrained cause -> concrete remediation or cap -> reassessment. The useful analogies are constraint-solver unsat cores, curriculum map empty cells, accepted technical debt, catalog coverage metrics, and training autoregulation.

---

## Key Technical Decisions

- Extend the existing D01 receipt path with currentness input: The fork packet should reuse `buildGeneratedPlanD01BlockShapeFillReceipt()` for receipt facts, but also receive registry/currentness evidence so stale generated outputs cannot authorize a fork.
- Fail closed on stale evidence: If the D01 target is stale, handoff state is not insufficient, or D47 next state is not `cap_or_catalog_proposal_needed`, the packet should not select a cap/catalog fork. Count changes are evidence unless they invalidate those states or currentness.
- Catalog is evidence-gated, not presumed: Select `catalog_source_backed_delta` only when the packet can name gap-card-ready catalog evidence; otherwise select cap, accepted no-change, or `resume_d47_with_d01_held`.
- Make no-change and D47 resume explicit: These are valid exits only when recorded with rationale, blast radius, and revisit/re-entry triggers.
- Keep U6 out of this slice: The packet can state future U6 conditions, but U6 preview tooling remains blocked until a concrete changed surface exists.

---

## Open Questions

### Resolved During Planning

- Should the packet render an informational fork when evidence is stale? No. It should fail closed with an explicit not-authorized/stale state so downstream catalog or cap planning cannot start from stale diagnostics.
- If cap and catalog both look plausible, which wins? Catalog wins only when a gap-card-ready catalog path can be named. Otherwise the packet should choose cap, accepted no-change, or `resume_d47_with_d01_held`.
- Does accepted no-change unblock D47? Yes, if chosen explicitly; D01 remains visible as accepted diagnostic debt with a revisit trigger.

### Deferred to Implementation

- Exact union names and receipt field names should match local generated diagnostics naming conventions.
- Whether the smallest-missing-ingredient evidence needs a small helper or can be composed from existing receipt facts should be decided after reading the current helper boundaries.
- Whether the generated markdown renders this as a sub-block under the D01 fill receipt or a separate section can follow the least disruptive local rendering shape, as long as it remains scannable.

---

## High-Level Technical Design

> _This illustrates the intended approach and is directional guidance for review, not implementation specification. The implementing agent should treat it as context, not code to reproduce._

| Input state                                                                           | Selected fork                          | Parent D47 mapping                                    | Notes                                                            |
| ------------------------------------------------------------------------------------- | -------------------------------------- | ----------------------------------------------------- | ---------------------------------------------------------------- |
| Target absent or D01 receipt validated                                                | `not_applicable_resume`                | `resume_d47`                                          | No cap/catalog packet needed.                                    |
| Stale registry/currentness or handoff is not `insufficient_allocated_pressure`        | `not_authorized_stale_or_inapplicable` | preserve existing D01 next state                      | Fail closed; do not infer cap/catalog work.                      |
| Insufficient allocated pressure plus gap-card-ready catalog evidence                  | `catalog_source_backed_delta`          | `d47_blocked_by_planning_ready_d01_delta`             | Planning-ready, non-activation handoff to catalog-fill planning. |
| Insufficient allocated pressure without gap-card-ready catalog/cap/no-change evidence | `resume_d47_with_d01_held`             | `d47_resumed_d01_held`                                | Do not block D47 behind vague catalog uncertainty.               |
| D01 segments/copy can defend a wider envelope and catalog fill is rejected            | `cap_proposal`                         | D47 remains blocked pending cap proposal/U6 condition | No metadata edit in this slice.                                  |
| Residual is accepted as bounded debt                                                  | `accepted_no_change`                   | D47 can resume with D01 visible as accepted debt      | Requires owner, rationale, revisit trigger.                      |
| No credible cap/catalog/no-change delta exists                                        | `resume_d47_with_d01_held`             | D47 resumes, D01 remains held/open                    | Prevents D01 ambiguity from monopolizing the workflow.           |

---

## Implementation Units

- [x] U1. **Add D01 fork packet contract and selection**

**Goal:** Build the typed fork packet from the existing D01 fill receipt and select exactly one fork only when current evidence authorizes it.

**Requirements:** R1-R7, R13-R16, R17-R19, F1, F3, AE1, AE3, AE4, AE5

**Dependencies:** None.

**Files:**

- Modify: `app/src/domain/generatedPlanDiagnosticTriage.ts`
- Test: `app/src/domain/__tests__/generatedPlanDiagnosticTriage.test.ts`

**Approach:**

- Add a closed union for packet authorization/selection states and the four selected forks from the origin requirements.
- Add an explicit evidence contract for the packet: currentness/registry state, target group key, material receipt facts, representative cells when available, source disposition, U6 eligibility, proposed parent D47 mapping, catalog planning readiness, and activation status.
- Model fork inputs as discriminated optional payloads so implementation does not invent policy while coding:
  - `catalogEvaluation`: gap-card-ready evidence, catalog-fill planning readiness, activation status, source path or source needs, changed/missing IDs, expected movement, verification, and checkpoint criteria.
  - `capEvaluation`: cap delta, segment/copy support, rejected catalog rationale, expected movement, future U6 condition, and falsification threshold.
  - `noChangeEvaluation`: owner, accepted blast radius, no-action threshold, rationale, and revisit trigger.
  - `d47ResumeEvaluation`: reason D01 cannot name an actionable delta and the visible held/open state.
- Reuse the existing D01 fill receipt for aggregate facts, but pass enough registry/currentness evidence into the packet builder to make stale-evidence failure implementable.
- Fail closed when the receipt is stale, already validated, or not in the expected `insufficient_allocated_pressure` / `cap_or_catalog_proposal_needed` state.
- Treat target-absent or validated D01 as `not_applicable_resume`, not as a stale failure.
- Select `catalog_source_backed_delta`, `cap_proposal`, or `accepted_no_change` only when the matching evaluation payload is present and complete; otherwise select `resume_d47_with_d01_held`.

**Execution note:** Implement the domain contract test-first, starting with authorized, not-applicable, and fail-closed cases.

**Patterns to follow:**

- D01 fill receipt helper and union style in `app/src/domain/generatedPlanDiagnosticTriage.ts`.
- Existing synthetic D01 handoff fixtures in `app/src/domain/__tests__/generatedPlanDiagnosticTriage.test.ts`.

**Test scenarios:**

- Covers AE1. A current receipt with `insufficient_allocated_pressure` and gap-card-ready catalog evidence selects exactly `catalog_source_backed_delta`, includes expected movement and falsification threshold, and rejects another runtime loop.
- Covers AE2a. A current receipt with `insufficient_allocated_pressure` but no gap-card-ready catalog/cap/no-change evidence selects `resume_d47_with_d01_held` rather than catalog.
- Covers AE3. Synthetic cap-supported fixture selects `cap_proposal` and records cap delta, rejected catalog rationale, and future U6 condition without editing metadata.
- Covers AE4. Synthetic accepted no-change fixture records owner/rationale/revisit trigger and maps D47 to resume with visible accepted debt.
- Edge case: cap/no-change forks are not selected when their evaluation payloads are absent or incomplete.
- Edge case: target absent or validated D01 receipt produces `not_applicable_resume`, not `not_authorized_stale_or_inapplicable`.
- Edge case: receipt with `admissible_candidate`, `mixed_admission`, or any non-`cap_or_catalog_proposal_needed` next state fails closed instead of selecting a cap/catalog fork.
- Edge case: state labels remain insufficient/cap-or-catalog but registry/currentness is stale, so the packet fails closed.

**Verification:**

- Domain tests prove each selected fork, not-applicable resume behavior, and fail-closed behavior.

**Implementation result:** Added the typed D01 cap/catalog fork packet builder. Current D01 evidence now resumes D47 with D01 held unless a complete cap, catalog, or no-change evaluation payload is present; stale evidence fails closed.

---

- [x] U2. **Render fork packet evidence in the workbench**

**Goal:** Make the generated triage markdown expose the selected fork, rejected forks, D47 mapping, expected movement, falsification threshold, and catalog fast-path handoff fields.

**Requirements:** R1-R16, R19, F1-F3, AE1-AE5

**Dependencies:** U1.

**Files:**

- Modify: `app/src/domain/generatedPlanDiagnosticTriage.ts`
- Test: `app/src/domain/__tests__/generatedPlanDiagnosticTriage.test.ts`

**Approach:**

- Add a compact markdown block after the existing D01 fill receipt or as a clearly named adjacent `D01 Cap/Catalog Fork Packet` section.
- Include current receipt facts and fork decision fields in scan-friendly lines rather than a prose-only paragraph.
- For `catalog_source_backed_delta`, include `planningAuthorizationStatus: ready_for_catalog_fill_planning`, `activationStatus: not_authorized`, suspected catalog gap, changed or missing IDs, source path or source needs, expected diagnostic movement, and next artifact.
- For inactive/fail-closed states, render why no fork is authorized rather than omitting the packet silently.

**Patterns to follow:**

- Existing generated workbench section construction in `buildGeneratedPlanTriageWorkbenchMarkdown()`.
- Current D01 fill receipt markdown expectations in `app/src/domain/__tests__/generatedPlanDiagnosticTriage.test.ts`.

**Test scenarios:**

- Covers AE2. Markdown for a catalog-selected packet contains the suspected catalog gap, catalog-fill planning readiness status, non-activation status, expected diagnostic movement, and source-backed catalog-fill handoff.
- Covers AE2a. Markdown for a no-gap-card-ready packet states D47 is resumed with D01 held, not blocked by a vague catalog source candidate.
- Rendering includes rejected fork reasons and no-action/falsification thresholds.
- Fail-closed rendering states why no fork is authorized when the receipt is stale or inapplicable.
- Scope guard: rendered copy does not claim catalog activation, D01 metadata edits, U6 preview implementation, or field validation.

**Verification:**

- Focused markdown tests prove the workbench is actionable and bounded.

**Implementation result:** The generated triage workbench now renders a `D01 Cap/Catalog Fork Packet` section with selected fork, parent D47 state, planning authorization, activation status, rejected forks, and thresholds.

---

- [x] U3. **Refresh diagnostics artifacts and docs routing**

**Goal:** Keep generated report freshness, documentation catalog routing, and parent workflow docs aligned with the new fork packet and its evidence-gated outcome.

**Requirements:** R11, R12, R16-R19, AE2, AE5

**Dependencies:** U1, U2.

**Files:**

- Modify: `app/scripts/validate-generated-plan-diagnostics-report.mjs`
- Modify generated output: `docs/reviews/2026-05-01-generated-plan-diagnostics-report.md`
- Modify generated output: `docs/reviews/2026-05-01-generated-plan-diagnostics-triage.md`
- Modify: `docs/catalog.json`
- Modify: `docs/plans/2026-05-01-002-feat-generated-diagnostics-triage-workflow-plan.md`
- Modify: `docs/plans/2026-05-02-010-feat-d01-cap-catalog-fork-plan.md`

**Approach:**

- Add the new requirements and plan docs to diagnostics freshness dependencies.
- Regenerate or update diagnostics outputs through the existing diagnostics report workflow.
- Update the parent generated diagnostics plan to record the selected D01 fork and D47 parent mapping without implying drill-catalog activation.
- Catalog the new plan and mark it complete only after implementation verification passes.

**Patterns to follow:**

- Prior D01 fill and redistribution handoff plan/docs sync.
- Existing generated diagnostics freshness dependency updates in `app/scripts/validate-generated-plan-diagnostics-report.mjs`.

**Test scenarios:**

- Freshness check recognizes the D01 cap/catalog fork requirements and plan as dependencies.
- Generated triage contains the new packet and remains current.
- Agent-doc validation accepts the new documentation catalog routing.

**Verification:**

- `cd app && npm run diagnostics:report:check` passes after regenerated outputs.
- `bash scripts/validate-agent-docs.sh` passes after catalog and parent-plan updates.

**Implementation result:** Diagnostics triage was regenerated, freshness dependencies include the new requirements/plan, and docs routing now records the completed D01 cap/catalog fork slice.

---

## System-Wide Impact

- **Interaction graph:** Generated diagnostics groups -> D01 fill receipt -> D01 cap/catalog fork packet -> generated triage workbench -> next cap/catalog/no-change/D47 workflow.
- **Error propagation:** Stale or inapplicable receipt states should surface as fail-closed packet states, not runtime errors or hidden omissions.
- **State lifecycle risks:** The packet creates new handoff states that future catalog-fill or D47 planning may depend on; stale evidence must be impossible to mistake for authorization.
- **API surface parity:** Public app routes, Dexie schema, and generated session runtime behavior remain unchanged.
- **Integration coverage:** Domain tests plus generated diagnostics freshness checks should prove the packet, rendered workbench, and docs routing together.
- **Unchanged invariants:** No catalog content, D01 metadata, U6 preview, or generator runtime behavior changes in this plan.

---

## Risks & Dependencies

| Risk                                                      | Mitigation                                                                                                                                                   |
| --------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Packet starts actual catalog work from stale D01 evidence | Fail closed unless the receipt has currentness evidence and the expected insufficient/cap-or-catalog state.                                                  |
| Catalog fork becomes implicit activation                  | Split catalog-fill planning readiness from activation status; activation remains `not_authorized` until a follow-up plan with exact source references lands. |
| Cap widening is used to green diagnostics                 | Require cap proposal to explain why D01 copy/segments support a wider envelope and why catalog fill is not better.                                           |
| D01 keeps blocking D47 indefinitely                       | Resume D47 with D01 held unless the packet names an actionable cap/catalog/no-change delta.                                                                  |
| Plan adds more diagnostics process before catalog filling | Require a gap-card-ready catalog path before catalog handoff; otherwise resume D47 instead of adding another vague catalog loop.                             |

---

## Documentation / Operational Notes

- This plan creates the bridge into catalog fill; it is not the catalog-fill implementation itself.
- If implementation selects `catalog_source_backed_delta`, the next likely workflow is a D01 source-backed catalog-fill requirements/plan or gap card directly from the packet fields. Use another brainstorm only if source selection or product scope remains unresolved.
- Once D01 reaches a stable exit, run a `/ce-compound` pass to capture the diagnostic-to-fill loop pattern.

---

## Sources & References

- **Origin document:** [docs/brainstorms/2026-05-02-generated-diagnostics-d01-cap-catalog-fork-requirements.md](../brainstorms/2026-05-02-generated-diagnostics-d01-cap-catalog-fork-requirements.md)
- Related requirements: [docs/brainstorms/2026-05-02-generated-diagnostics-d01-redistribution-handoff-requirements.md](../brainstorms/2026-05-02-generated-diagnostics-d01-redistribution-handoff-requirements.md)
- Related plan: [docs/plans/2026-05-02-008-feat-d01-redistribution-handoff-plan.md](2026-05-02-008-feat-d01-redistribution-handoff-plan.md)
- Related code: `app/src/domain/generatedPlanDiagnosticTriage.ts`
- Related tests: `app/src/domain/__tests__/generatedPlanDiagnosticTriage.test.ts`
- Workload guide: [docs/ops/workload-envelope-authoring-guide.md](../ops/workload-envelope-authoring-guide.md)
- Gap-card precedent: [docs/reviews/2026-04-30-focus-coverage-gap-cards.md](../reviews/2026-04-30-focus-coverage-gap-cards.md)
