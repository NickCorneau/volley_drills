---
title: "feat: Add D01 Gap-Fill Proposal"
type: feat
status: complete
active_registry: true
date: 2026-05-02
origin: docs/brainstorms/2026-05-02-generated-diagnostics-d01-comparator-gap-fill-proposal-requirements.md
---

# feat: Add D01 Gap-Fill Proposal

## Overview

Add a D01 comparator gap-fill proposal to the generated diagnostics triage workbench. This should turn the D47 ledger's `d01-solo` comparator receipt into a concrete, evidence-gated proposal candidate without editing the drill catalog, workload metadata, source-backed content, U6 preview tooling, or runtime generation behavior.

The first slice should stay derived from existing diagnostics state: no persisted proposal table, no manual artifact that can drift from the generated report, and no fill authorization until D01 names a target path, expected movement, and reassessment boundary.

---

## Problem Frame

The D47 gap closure ledger identifies D01 as a simpler, higher-confidence comparator, but D01 is still only implicit comparator evidence. The product goal is to determine real drill/programming gaps and then fill them concretely; D01 should now become the smallest test of that handoff.

The origin requirements frame D01 as a likely workload/block-shape candidate: `d01-solo` is an existing beginner passing drill with a 2-5 minute envelope and 5-minute fatigue cap, while diagnostics show main-skill duration pressure that remains even without optional-slot redistribution. The plan should therefore make D01 proposal quality visible before any implementation tries to widen a cap, split a block, add content, or alter generator policy.

---

## Requirements Trace

- R1-R5. Preserve D01 comparator identity, currentness, receipt facts, D47 relationship, and stale/missing blocking behavior.
- R6-R12. State the suspected D01 gap in product language and route the primary path to workload/block-shape proposal evidence before source-backed content, generator-policy, or no-change work.
- R13-R16. Record expected diagnostic movement, training-quality movement, and a future reassessment boundary.
- R17-R20. Keep scope bounded away from catalog edits, workload metadata edits, U6 preview tooling, broad comparator expansion, and runtime generator behavior.

**Origin actors:** A1 Maintainer, A2 Gap author, A3 Agent planner, A4 Reviewer.
**Origin flows:** F1 D01 comparator becomes a primary fill candidate; F2 D01 chooses a first closure path; F3 Future D01 fill gets reassessed.
**Origin acceptance examples:** AE1 comparator facts and D47 relationship; AE2 workload/block-shape next artifact; AE3 content edits blocked without delta; AE4 no-change closure evidence; AE5 U6 preview redirected.

---

## Scope Boundaries

- Do not edit `app/src/data/drills.ts` or change `d01-solo` workload metadata.
- Do not change runtime `buildDraft()` behavior or generated session assembly policy.
- Do not add source-backed D01 content, variants, instructions, or catalog activation.
- Do not build U6 preview tooling.
- Do not generalize to every comparator candidate yet; this is a D01 proof slice.
- Do not hand-edit `docs/reviews/2026-05-01-generated-plan-diagnostics-triage.md`; it should be regenerated through the diagnostics report path.

---

## Context & Research

### Relevant Code and Patterns

- `app/src/domain/generatedPlanDiagnosticTriage.ts` already owns the D47 proposal-admission ticket, U8 redistribution receipt, D47 gap closure ledger, comparator selection, authorization state, and generated Markdown rendering.
- `app/src/domain/__tests__/generatedPlanDiagnosticTriage.test.ts` already covers D47 ledger construction, stale currentness behavior, D01 comparator selection, no-change fallback, authorization matrix behavior, and generated workbench rendering.
- `app/scripts/validate-generated-plan-diagnostics-report.mjs` owns generated diagnostics review freshness and should gain the new requirements/plan dependencies if the generated triage doc depends on this work.
- `docs/reviews/2026-05-01-generated-plan-diagnostics-triage.md` is generated output and already contains the D47 ledger plus D01 comparator facts.
- `app/src/data/drills.ts` confirms `d01-solo` is beginner passing with `durationMaxMinutes: 5`, `fatigueCap.maxMinutes: 5`, and a streak success metric; this plan references those facts but must not modify them.

### Institutional Learnings

- No `docs/solutions/` learning currently covers the generated diagnostic-to-gap-fill loop. Once D01 proves the loop, capture the reusable pattern separately.
- Existing generated diagnostics work is evidence-first: stable group keys and freshness checks must stay visible before any proposal becomes actionable.
- D47 ledger work established the right implementation pattern: derived domain object, generated workbench section, focused domain tests, generated-doc validation, and docs catalog routing.

### External References

- None. Local domain patterns and current repo docs are sufficient.

---

## Key Technical Decisions

- Derived proposal object, not persisted state: D01 should be built from current triage registry, U8/D47 receipt data, and catalog facts so it stays current with generated diagnostics.
- Workload/block-shape first: The initial proposal should route to a D01 workload/block-shape artifact, while source-backed content, generator policy, and no-change remain gated alternatives.
- Stale evidence blocks authorization: Missing or stale D01 comparator evidence should produce `not_authorized` behavior and a refresh/no-change decision path.
- Keep D47 visible but secondary: The D01 proposal should record that D47 is held behind D01 as a comparator-first follow-on, not silently discarded.
- Reuse generated triage freshness: The workbench section should be generated by `diagnostics:report:*`, not manually maintained.

---

## Open Questions

### Resolved During Planning

- Where should the D01 proposal live? In `app/src/domain/generatedPlanDiagnosticTriage.ts`, next to the D47 ledger, because this is a derived generated-workbench artifact.
- Should the first concrete artifact be workload metadata review, block-shape proposal, or combined? Combined workload/block-shape proposal, because the deciding question is whether a short beginner passing drill should be widened, split/repeated, or policy-accepted.
- Should D01 replace D47 immediately? D47 should be held behind D01, not deleted; D01 becomes the first fill proposal candidate because it is simpler.

### Deferred to Implementation

- Exact type names and helper decomposition: follow the existing D47 naming and test style while keeping the D01 object smaller.
- Exact Markdown copy: keep it scan-friendly and generated from the derived proposal facts.
- Exact regenerated diagnostic fields for future reassessment: include expected movement now, but actual reassessment waits for a future fill.

---

## Implementation Units

- [x] U1. **Define D01 proposal domain contract**

**Goal:** Add a derived D01 comparator gap-fill proposal object with identity, currentness, D47 relationship, closure path, authorization status, next artifact, expected movement, and reassessment boundary.

**Requirements:** R1-R16, AE1-AE4

**Dependencies:** None

**Files:**
- Modify: `app/src/domain/generatedPlanDiagnosticTriage.ts`
- Test: `app/src/domain/__tests__/generatedPlanDiagnosticTriage.test.ts`

**Approach:**
- Introduce closed unions or small interfaces only where the D01 proposal needs behavior that is not already represented by the D47 ledger types.
- Build the proposal from the D47 gap closure ledger's comparator receipt and current triage registry state.
- Use `d01-solo` as the only supported target in this slice; do not add a generic comparator proposal registry.
- Derive the primary path as combined workload/block-shape review while keeping source-backed content, generator policy, and no-change as explicit non-authorized alternatives.
- Preserve currentness behavior: stale or missing D01 comparator evidence should prevent fill authorization.

**Execution note:** Implement new domain behavior test-first in the existing generated diagnostics triage test file.

**Patterns to follow:**
- D47 ledger builder and currentness helpers in `app/src/domain/generatedPlanDiagnosticTriage.ts`.
- Table-driven authorization tests already present for D47 where the state matrix grows beyond one or two branches.

**Test scenarios:**
- Happy path: current D47 ledger with D01 comparator builds a D01 proposal for `gpdg:v1:d01:d01-solo:main_skill:true:optional_slot_redistribution+over_authored_max+over_fatigue_cap`.
- Happy path: proposal facts include 18 affected cells, 0 pressure-disappears cells, 18 pressure-remains cells, 6 non-redistribution pressure cells, and 0 inconclusive cells.
- Happy path: proposal relationship marks D47 as held behind D01 rather than abandoned or deleted.
- Edge case: stale D01 comparator fingerprint produces stale currentness and `not_authorized`.
- Edge case: missing D01 comparator receipt produces missing currentness and `not_authorized`.
- Covers AE2: the primary next artifact is a workload/block-shape proposal, not catalog activation.
- Covers AE3: source-backed content remains blocked unless a content-depth delta is present.

**Verification:**
- The proposal is deterministic from current diagnostics state.
- No catalog, workload metadata, or runtime generator behavior changes are needed.

---

- [x] U2. **Render D01 proposal in generated triage workbench**

**Goal:** Add a generated `D01 Gap-Fill Proposal` workbench section that exposes proposal facts, path, authorization, expected movement, and reassessment boundary.

**Requirements:** R1-R16, R20, F1-F3, AE1-AE5

**Dependencies:** U1

**Files:**
- Modify: `app/src/domain/generatedPlanDiagnosticTriage.ts`
- Modify: `app/scripts/validate-generated-plan-diagnostics-report.mjs`
- Modify generated output via diagnostics update: `docs/reviews/2026-05-01-generated-plan-diagnostics-triage.md`
- Test: `app/src/domain/__tests__/generatedPlanDiagnosticTriage.test.ts`

**Approach:**
- Render the D01 section near the D47 ledger so the comparator-first handoff is visible.
- Include enough fields for a maintainer to act: currentness, D47 relationship, suspected gap, primary closure path, authorization status, next artifact, expected diagnostic movement, expected training-quality movement, and reassessment result.
- Add requirements and plan docs to the generated triage frontmatter dependencies through the validator script so freshness checks know the generated artifact is downstream of this slice.
- Keep Markdown compact and generated; do not hand-maintain the review file.

**Patterns to follow:**
- Existing D47 ledger Markdown rendering in `buildGeneratedPlanTriageWorkbenchMarkdown`.
- Existing validator dependency list in `app/scripts/validate-generated-plan-diagnostics-report.mjs`.

**Test scenarios:**
- Covers AE1: generated Markdown contains the D01 stable key, D01 facts, and D47 relationship.
- Covers AE2: generated Markdown states workload/block-shape proposal as the next artifact.
- Covers AE4: generated Markdown includes expected diagnostic movement, training-quality movement, and `not_started` reassessment.
- Edge case: stale/missing D01 proposal rendering stays not-authorized rather than hiding the blocker.

**Verification:**
- Generated triage Markdown updates through the diagnostics report update path.
- Freshness checks pass after regeneration.

---

- [x] U3. **Sync docs routing and plan completion state**

**Goal:** Register the D01 plan and keep docs routing current once implementation lands.

**Requirements:** R17-R20

**Dependencies:** U1, U2

**Files:**
- Modify: `docs/catalog.json`
- Modify: `docs/plans/2026-05-02-004-feat-d01-gap-fill-proposal-plan.md`
- Optionally modify: `docs/plans/2026-05-01-002-feat-generated-diagnostics-triage-workflow-plan.md`

**Approach:**
- Add a catalog entry for this plan with an active routing description before implementation proceeds far enough that agents need to discover it.
- After implementation and verification, mark the plan `complete` and add `active_registry: true` if it becomes part of the live generated-diagnostics registry.
- Update the parent generated diagnostics triage workflow plan only if the D01 proposal materially changes the active sequence summary.

**Patterns to follow:**
- Catalog entries for `generated-diagnostics-d47-gap-closure-ledger-plan-2026-05-02`.
- Current complete-plan frontmatter conventions in `docs/plans/2026-05-02-003-feat-d47-gap-closure-ledger-plan.md`.

**Test scenarios:**
- Test expectation: none -- docs routing and plan status are validated by agent-doc validation rather than app unit tests.

**Verification:**
- Docs validation accepts the new requirements/plan routing.
- The plan status reflects the actual implementation state at closeout.

---

## System-Wide Impact

- **Interaction graph:** Generated diagnostics domain -> generated triage Markdown -> docs freshness validator. No runtime app route or UI interaction changes.
- **Error propagation:** Stale or missing proposal evidence should surface as not-authorized generated output, not throw runtime errors during report generation.
- **State lifecycle risks:** Derived data must not become a second source of truth. The generated workbench remains the display surface.
- **API surface parity:** No exported runtime app API changes are intended beyond TypeScript domain exports used by tests and future planning.
- **Integration coverage:** The generated Markdown and diagnostics freshness path are the integration surface; focused domain tests should cover the object contract.
- **Unchanged invariants:** `app/src/data/drills.ts`, workload metadata, source-backed content, U6 preview behavior, and runtime generation policy remain unchanged.

---

## Risks & Dependencies

| Risk | Mitigation |
|------|------------|
| D01 proposal accidentally authorizes workload or catalog edits | Keep authorization `not_authorized` until a future fill proposal changes the target surface with evidence. |
| D01 scope grows into generic proposal infrastructure | Hard-code this slice to the D01 comparator and defer genericization until one loop proves useful. |
| Generated review drifts from requirements/plan docs | Add docs as generated-triage dependencies and run freshness checks. |
| The proposal overstates training-quality validation | Record expected training-quality movement only; actual validation waits for a future fill. |

---

## Documentation / Operational Notes

- This plan creates one generated-workbench feature slice. Any future D01 workload or block-shape change needs its own proposal plan after this section makes the target surface and expected movement explicit.
- After the first complete D01 loop proves the pattern, consider capturing a `docs/solutions/` learning for diagnostic-to-gap-fill work.

---

## Sources & References

- **Origin document:** [docs/brainstorms/2026-05-02-generated-diagnostics-d01-comparator-gap-fill-proposal-requirements.md](../brainstorms/2026-05-02-generated-diagnostics-d01-comparator-gap-fill-proposal-requirements.md)
- Related plan: [docs/plans/2026-05-02-003-feat-d47-gap-closure-ledger-plan.md](2026-05-02-003-feat-d47-gap-closure-ledger-plan.md)
- Related generated workbench: [docs/reviews/2026-05-01-generated-plan-diagnostics-triage.md](../reviews/2026-05-01-generated-plan-diagnostics-triage.md)
- Related code: `app/src/domain/generatedPlanDiagnosticTriage.ts`
- Related tests: `app/src/domain/__tests__/generatedPlanDiagnosticTriage.test.ts`
