---
id: generated-diagnostics-d47-gap-closure-ledger-plan-2026-05-02
title: "feat: Add D47 gap closure ledger"
status: complete
active_registry: true
stage: validation
type: plan
summary: "Implementation plan for adding a comparator-first D47 gap closure ledger to the generated diagnostics triage workbench before catalog edits, workload metadata edits, source-backed activation, U6 preview tooling, or runtime generator changes."
date: 2026-05-02
origin: docs/brainstorms/2026-05-02-generated-diagnostics-d47-gap-closure-ledger-requirements.md
depends_on:
  - docs/brainstorms/2026-05-02-generated-diagnostics-d47-u6-proposal-admission-requirements.md
  - docs/reviews/2026-05-01-generated-plan-diagnostics-triage.md
  - docs/ops/workload-envelope-authoring-guide.md
  - docs/reviews/2026-04-30-focus-coverage-gap-cards.md
  - app/src/domain/generatedPlanDiagnosticTriage.ts
---

# feat: Add D47 Gap Closure Ledger

## Overview

Implement the first D47 gap closure ledger as a minimal extension of the existing generated diagnostics triage workbench. The ledger turns the current `d47` / `d47-solo-open` diagnostic evidence into a reviewable gap-closure artifact, but it runs a comparator-first pilot before authorizing D47 as the fill target.

This plan does not authorize catalog edits, workload metadata edits, source-backed activation, U6 preview tooling, or runtime generator changes.

---

## Problem Frame

The current D47 proposal-admission ticket proves that diagnostics can identify a credible candidate, but it does not prove D47 is the best place to spend gap-fill work. The ledger preserves D47's mixed receipt facts, separates segment-level dispositions, and requires a comparator receipt before deciding whether D47 exits as `abandoned_for_better_candidate`, `primary_fill_path_selected`, or `no_change_closed`.

---

## Requirements Trace

- R1-R6. Preserve D47 identity, receipt facts, suspected product-language gap, separated status fields, and currentness.
- R7-R16. Keep drill inventory, programming shape, workload metadata, generator policy, no-change, and segment-aware dispositions distinct.
- R17-R23. Derive fill readiness from missing facts and comparator evidence; the first D47 pass must compare against a simpler candidate or baseline.
- R24-R29. Capture expected diagnostic and training-quality movement now, with actual reassessment deferred until a future fill lands.
- R30-R33. Keep the first implementation in the existing generated workbench and redirect future planners to the correct next workflow.

**Origin actors:** A1 maintainer, A2 gap author, A3 source researcher, A4 agent planner, A5 reviewer.

**Origin flows:** F1 D47 evidence becomes a ledger entry; F2 ledger chooses a concrete fill path; F3 a future fill is reassessed.

**Origin acceptance examples:** AE1-AE8 from `docs/brainstorms/2026-05-02-generated-diagnostics-d47-gap-closure-ledger-requirements.md`.

---

## Scope Boundaries

- Do not edit `app/src/data/drills.ts`, workload metadata, source-backed instructions, or runtime generator behavior.
- Do not build U6 preview tooling or create `app/src/domain/generatedPlanDiagnosticPreview.ts`.
- Do not create a generic ledger for every diagnostic group before the D47 pilot proves the workflow.
- Do not mark D47 fill-ready until the comparator receipt names the better pilot path, evidence basis, expected movement, no-action threshold, and next artifact.

---

## Context & Research

### Relevant Code and Patterns

- `app/src/domain/generatedPlanDiagnosticTriage.ts` owns U8 redistribution receipts, the D47 proposal-admission ticket, and generated workbench Markdown.
- `app/scripts/validate-generated-plan-diagnostics-report.mjs` generates and checks both diagnostics report and triage workbench freshness.
- `app/src/domain/__tests__/generatedPlanDiagnosticTriage.test.ts` is the focused test home for ledger contract, comparator, and rendering behavior.
- `docs/reviews/2026-04-30-focus-coverage-gap-cards.md` records the existing D47 FIVB 4.7 activation provenance.
- `docs/ops/workload-envelope-authoring-guide.md` remains the policy source for workload and block-shape interpretation.

### Institutional Learnings

- No `docs/solutions/` learning file exists yet for this workflow. Capture one after the first useful gap-fill loop lands.

### External References

- None. Local generated diagnostics, workload guidance, and source-backed activation precedents are sufficient.

---

## Key Technical Decisions

- Host the first ledger in the generated triage workbench. This keeps it freshness-checked and avoids a standalone hand-maintained artifact.
- Build a pure derived domain object from the D47 admission ticket and U8 receipt. Do not introduce persisted ledger state in this slice.
- Keep current D47 in `evidence_gathering` with `authorization_status: not_authorized` until comparator evidence chooses a path.
- Require segment dispositions for pressure-disappears, pressure-remains, and non-redistribution pressure. A shared disposition is allowed only with an explicit rationale.
- Use a comparator-first pilot. Prefer a simpler or higher-confidence current receipt candidate such as a non-redistribution-pressure group; fall back to a no-change baseline if no comparator exists.
- Defer actual reassessment automation. Store expected movement fields now; actual diagnostic and training-quality validation waits for a future fill.

---

## Implementation Units

- [x] U1. **Define Ledger Domain Contract**

**Goal:** Add pure-domain types and helpers for the D47 gap ledger, including state matrix, authorization status, segment dispositions, comparator receipt, bounded next artifact, expected movement, and deferred reassessment fields.

**Requirements:** R1-R6, R13-R18, R22-R23, R24-R29, AE1, AE4, AE6, AE7.

**Files:**
- Modify: `app/src/domain/generatedPlanDiagnosticTriage.ts`
- Test: `app/src/domain/__tests__/generatedPlanDiagnosticTriage.test.ts`

**Verification:** Focused tests prove current D47 stays comparator-pending and not authorized.

---

- [x] U2. **Build Comparator-First D47 Ledger**

**Goal:** Build the current D47 ledger entry from the existing proposal-admission ticket and U8 redistribution receipt, then attach a comparator receipt before choosing a pilot exit.

**Requirements:** R1-R5, R7-R16, R17-R23, AE1-AE5, AE7.

**Files:**
- Modify: `app/src/domain/generatedPlanDiagnosticTriage.ts`
- Test: `app/src/domain/__tests__/generatedPlanDiagnosticTriage.test.ts`

**Verification:** Tests cover D47 receipt facts, comparator candidate selection, no-change fallback, and blocked authorization when the stable D47 key is absent.

---

- [x] U3. **Render Ledger In Generated Workbench**

**Goal:** Add a `D47 Gap Closure Ledger` section to the generated triage workbench that is readable by maintainers and strict enough for future planners.

**Requirements:** R1-R6, R14-R16, R18-R23, R30-R33, F1-F3, AE1, AE4, AE7, AE8.

**Files:**
- Modify: `app/src/domain/generatedPlanDiagnosticTriage.ts`
- Modify: `app/scripts/validate-generated-plan-diagnostics-report.mjs`
- Generated output: `docs/reviews/2026-05-01-generated-plan-diagnostics-triage.md`
- Test: `app/src/domain/__tests__/generatedPlanDiagnosticTriage.test.ts`

**Verification:** Generated diagnostics update writes the ledger into the workbench and keeps it under the existing freshness check.

---

- [x] U4. **Sync Planning Docs And Routing**

**Goal:** Keep machine-readable routing aligned so future agents know this slice is the comparator-first gap ledger, not catalog editing or U6 preview work.

**Requirements:** R30-R33, AE8.

**Files:**
- Modify: `docs/plans/2026-05-01-002-feat-generated-diagnostics-triage-workflow-plan.md`
- Modify: `docs/catalog.json`
- Create: `docs/plans/2026-05-02-003-feat-d47-gap-closure-ledger-plan.md`

**Verification:** Agent-doc validation passes for the new plan and catalog route.

---

## System-Wide Impact

- **Interaction graph:** Pure diagnostics domain and generated docs only; no app runtime, storage, UI, or service layer changes.
- **Error propagation:** Missing, stale, or shifted D47 evidence renders as not authorized and comparator/refresh guidance instead of throwing.
- **State lifecycle risks:** Generated triage docs must stay fresh; stale output should be caught by existing diagnostics check commands.
- **API surface parity:** New exported types/helpers are internal diagnostics-domain planning surfaces, not public runtime APIs.
- **Unchanged invariants:** Catalog data, workload metadata, source-backed content, runtime generator behavior, and U6 preview tooling remain unchanged.

---

## Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| Comparator-first becomes analysis paralysis. | Require exactly one next artifact, the comparator receipt, with promotion and abandon criteria. |
| D47 is abandoned too casually. | Preserve D47's mixed evidence and require the comparator to explain why it is simpler or higher-confidence. |
| Ledger implies fill authorization. | Derive authorization status and default current D47 to `not_authorized`. |
| Reassessment gets overbuilt before a fill exists. | Record expected movement only; defer actual reassessment receipt until a later fill lands. |

---

## Documentation / Operational Notes

- The generated triage workbench is the current review surface for this ledger.
- U6 preview remains deferred until a future ledger state is fill-ready enough to compare current and candidate outcomes.
- A future productized automation pass can promote the repo-native ledger/check command into a project skill or hook-assisted workflow.

---

## Sources & References

- **Origin document:** `docs/brainstorms/2026-05-02-generated-diagnostics-d47-gap-closure-ledger-requirements.md`
- **Admission prerequisite:** `docs/plans/2026-05-02-001-feat-d47-proposal-admission-ticket-plan.md`
- **Generated triage:** `docs/reviews/2026-05-01-generated-plan-diagnostics-triage.md`
- **Source-backed precedent:** `docs/reviews/2026-04-30-focus-coverage-gap-cards.md`
