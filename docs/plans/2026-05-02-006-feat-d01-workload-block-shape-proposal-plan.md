---
title: "feat: Add D01 Workload Block-Shape Proposal"
type: feat
status: complete
active_registry: true
date: 2026-05-02
origin: docs/brainstorms/2026-05-02-generated-diagnostics-d01-workload-block-shape-proposal-requirements.md
---

# feat: Add D01 Workload Block-Shape Proposal

## Overview

Add a generated D01 workload/block-shape proposal to the generated diagnostics triage workbench. This proposal should turn the existing D01 gap-fill candidate into a concrete recommendation: select `block_shape_review_needed` as the primary disposition, keep `metadata_review_needed` secondary, and keep catalog, workload metadata, U6 preview, source-backed content, and generator behavior unchanged.

This plan implements the proposal artifact only. It does not apply the future fill.

---

## Problem Frame

D01 is now the selected comparator gap-fill candidate, but it is still one step away from a concrete fill path. The generated D01 proposal says the future artifact should decide whether to widen workload metadata, split/repeat/reroute the block shape, or accept the pressure by policy.

The workload guide points to block shape first for D01. `d01-solo` is a short beginner passing drill with a 2-5 minute envelope, a 5-minute fatigue cap, repeated-contact copy, and a streak metric. The safer proposal is to make the generated main-skill block shape carry the future fill, not to make the D01 catalog metadata less honest.

---

## Requirements Trace

- R1-R5. Preserve D01 identity, receipt facts, selected primary disposition, secondary metadata review, and unchanged metadata boundary.
- R6-R12. State the concrete recommendation, evidence layer, expected diagnostic movement, expected training-quality movement, no-action threshold, revisit trigger, and reassessment boundary.
- R13-R16. Block catalog, source-backed, U6 preview, workload metadata, and runtime generator changes while making the next workflow obvious.

**Origin actors:** A1 Maintainer, A2 Gap author, A3 Agent planner, A4 Reviewer.
**Origin flows:** F1 D01 proposal selects a primary disposition; F2 Proposal defines a future fill without applying it.
**Origin acceptance examples:** AE1 primary and secondary dispositions; AE2 block-shape before cap widening; AE3 future reassessment; AE4 blocked catalog/source/generator work.

---

## Scope Boundaries

- Do not edit `app/src/data/drills.ts` or D01 workload metadata.
- Do not change runtime `buildDraft()` behavior or session assembly.
- Do not add source-backed D01 content or variants.
- Do not build U6 preview tooling.
- Do not hand-edit generated triage output outside the diagnostics update path.
- Do not generalize this to all workload/block-shape candidates.

---

## Context & Research

### Relevant Code and Patterns

- `app/src/domain/generatedPlanDiagnosticTriage.ts` owns the current D01 gap-fill proposal and should own this derived proposal as a sibling object.
- `app/src/domain/__tests__/generatedPlanDiagnosticTriage.test.ts` is the focused test surface for current/stale/missing generated proposal behavior and Markdown rendering.
- `app/scripts/validate-generated-plan-diagnostics-report.mjs` owns generated triage dependencies and freshness.
- `docs/reviews/2026-05-01-generated-plan-diagnostics-triage.md` is generated; update it through `npm run diagnostics:report:update`.
- `docs/ops/workload-envelope-authoring-guide.md` defines `block_shape_review_needed`, `metadata_review_needed`, `requires_U6_preview`, and no-action dispositions.

### Institutional Learnings

- No `docs/solutions/` learning exists yet for this workflow. After the first useful D01 loop lands, capture one.
- Existing generated diagnostics convention is evidence-first: route proposals, do not apply catalog/runtime edits from observations.
- Prior D47 and D01 work established the implementation pattern: derived domain object, generated workbench rendering, focused domain tests, generated-doc validation, and catalog routing.

### External References

- None. Local docs and domain patterns are sufficient.

---

## Key Technical Decisions

- Build a second derived D01 object: keep the existing D01 gap-fill proposal intact, then derive a more concrete workload/block-shape proposal from it.
- Use ranked dispositions: primary `block_shape_review_needed`, secondary `metadata_review_needed`, with source/U6/generator blocked until later authorization.
- Keep metadata unchanged: the artifact may name D01's current envelope but must not modify or imply an immediate cap edit.
- Make U6 conditional: name the condition under which U6 becomes next, but do not implement preview tooling.
- Keep reassessment future-facing: record expected movement and `not_started`, but do not claim validation.

---

## Open Questions

### Resolved During Planning

- Should the proposal represent one recommendation or a ranked option set? Both: one selected primary disposition plus secondary/blocked alternatives.
- Which generated fields should anchor future reassessment? D01 receipt facts, especially affected-cell count, pressure-remains count, non-redistribution pressure, and eventual route/disposition movement.
- Should U6 remain fully deferred? Yes, but the proposal should state U6 becomes eligible only after a concrete block/cap proposal exists.

### Deferred to Implementation

- Exact type and helper names should follow the existing D01/D47 naming style.
- Exact Markdown copy can be tuned while preserving all proposal fields from the requirements.

---

## Implementation Units

- [x] U1. **Define D01 workload/block-shape proposal contract**

**Goal:** Add a derived domain object that selects block-shape review as D01's primary disposition while keeping metadata review secondary and all fill actions unauthorized.

**Requirements:** R1-R12, AE1-AE3

**Dependencies:** Existing D01 gap-fill proposal.

**Files:**
- Modify: `app/src/domain/generatedPlanDiagnosticTriage.ts`
- Test: `app/src/domain/__tests__/generatedPlanDiagnosticTriage.test.ts`

**Approach:**
- Add small closed unions or literal fields for disposition, metadata action, U6 eligibility, and reassessment result only where they improve clarity.
- Derive from `buildGeneratedPlanD01GapFillProposal()` so stale/missing behavior remains consistent.
- Include selected disposition, secondary disposition, unchanged metadata boundary, recommended future fill shape, evidence layer, expected diagnostic movement, expected training-quality movement, no-action threshold, revisit trigger, and reassessment boundary.

**Execution note:** Implement domain behavior test-first.

**Patterns to follow:**
- `buildGeneratedPlanD01GapFillProposal()` in `app/src/domain/generatedPlanDiagnosticTriage.ts`.
- D47/D01 object tests in `app/src/domain/__tests__/generatedPlanDiagnosticTriage.test.ts`.

**Test scenarios:**
- Happy path: current D01 proposal builds a workload/block-shape proposal with primary disposition `block_shape_review_needed`.
- Happy path: proposal includes secondary disposition `metadata_review_needed` and states D01 metadata remains unchanged.
- Happy path: receipt facts remain 18 total / 0 pressure-disappears / 18 pressure-remains / 6 non-redistribution / 0 inconclusive.
- Edge case: stale D01 gap-fill proposal keeps proposal `not_authorized` and reassessment `not_started`.
- Edge case: missing D01 gap-fill proposal keeps proposal `not_authorized` and does not imply a fill.
- Covers AE2: proposal explains block-shape before cap widening.

**Verification:**
- Domain object is deterministic from current diagnostics state.
- No runtime app behavior or catalog data changes.

---

- [x] U2. **Render proposal and refresh generated docs**

**Goal:** Add a generated workbench section for the D01 workload/block-shape proposal and keep freshness dependencies current.

**Requirements:** R1-R16, F1-F2, AE1-AE4

**Dependencies:** U1

**Files:**
- Modify: `app/src/domain/generatedPlanDiagnosticTriage.ts`
- Modify: `app/scripts/validate-generated-plan-diagnostics-report.mjs`
- Modify generated output via diagnostics update: `docs/reviews/2026-05-01-generated-plan-diagnostics-triage.md`
- Test: `app/src/domain/__tests__/generatedPlanDiagnosticTriage.test.ts`

**Approach:**
- Render the new section after `## D01 Gap-Fill Proposal` so the handoff is visible.
- Include selected disposition, secondary disposition, unchanged metadata boundary, target surface, future fill recommendation, U6 eligibility condition, expected movement, no-action threshold, revisit trigger, and reassessment boundary.
- Add the new requirements and plan docs to the generated triage frontmatter dependencies.

**Patterns to follow:**
- D01 gap-fill proposal rendering in `buildGeneratedPlanTriageWorkbenchMarkdown`.
- Triage frontmatter dependency list in `app/scripts/validate-generated-plan-diagnostics-report.mjs`.

**Test scenarios:**
- Covers AE1: generated Markdown includes primary and secondary dispositions.
- Covers AE2: generated Markdown states block-shape before cap widening and metadata unchanged.
- Covers AE3: generated Markdown includes expected diagnostic/training-quality movement and reassessment `not_started`.
- Covers AE4: generated Markdown states catalog/source/U6/generator paths are blocked or conditional.

**Verification:**
- Generated triage Markdown is updated through the diagnostics report update path.
- Diagnostics report freshness check passes.

---

- [x] U3. **Sync docs routing and completion state**

**Goal:** Register the plan and parent workflow state after implementation.

**Requirements:** R13-R16

**Dependencies:** U1, U2

**Files:**
- Modify: `docs/catalog.json`
- Modify: `docs/plans/2026-05-02-006-feat-d01-workload-block-shape-proposal-plan.md`
- Modify: `docs/plans/2026-05-01-002-feat-generated-diagnostics-triage-workflow-plan.md`

**Approach:**
- Add this plan to `docs/catalog.json`.
- Mark the plan complete with `active_registry: true` after implementation and verification.
- Update the parent generated diagnostics workflow plan summary/status note to include the D01 workload/block-shape proposal.

**Patterns to follow:**
- The completed D01 gap-fill proposal plan entry.

**Test scenarios:**
- Test expectation: none -- docs routing is covered by agent-doc validation.

**Verification:**
- Agent docs validation passes.
- Catalog routes the new requirements and plan docs.

---

## System-Wide Impact

- **Interaction graph:** Generated diagnostics domain -> generated triage Markdown -> diagnostics freshness validator -> docs catalog routing.
- **Error propagation:** Stale or missing D01 evidence remains visible as not authorized instead of throwing report generation errors.
- **State lifecycle risks:** Proposal remains derived from generated diagnostics and does not become a manual source of truth.
- **API surface parity:** No runtime app API changes.
- **Integration coverage:** Generated Markdown and diagnostics freshness checks prove the cross-file integration.
- **Unchanged invariants:** D01 catalog metadata, runtime generator behavior, source-backed content, U6 preview tooling, and shipped app behavior remain unchanged.

---

## Risks & Dependencies

| Risk | Mitigation |
|------|------------|
| Proposal reads like permission to change D01 caps | Explicitly state metadata is unchanged and metadata review is secondary. |
| Proposal skips too far into generator changes | Keep runtime generator behavior blocked until a later authorized fill plan. |
| U6 scope leaks in early | State U6 eligibility condition but do not build preview tooling. |
| Generated docs drift | Add dependencies and run diagnostics freshness checks. |

---

## Documentation / Operational Notes

- This plan should complete the proposal artifact, not the actual fill. The next loop can plan the concrete block-shape fill if the proposal remains convincing after review.
- Consider `/ce-compound` after the first actual fill/reassessment loop lands, not after this proposal-only slice.

---

## Sources & References

- **Origin document:** [docs/brainstorms/2026-05-02-generated-diagnostics-d01-workload-block-shape-proposal-requirements.md](../brainstorms/2026-05-02-generated-diagnostics-d01-workload-block-shape-proposal-requirements.md)
- Prior D01 proposal plan: [docs/plans/2026-05-02-004-feat-d01-gap-fill-proposal-plan.md](2026-05-02-004-feat-d01-gap-fill-proposal-plan.md)
- Workload guide: [docs/ops/workload-envelope-authoring-guide.md](../ops/workload-envelope-authoring-guide.md)
- Related code: `app/src/domain/generatedPlanDiagnosticTriage.ts`
- Related tests: `app/src/domain/__tests__/generatedPlanDiagnosticTriage.test.ts`
