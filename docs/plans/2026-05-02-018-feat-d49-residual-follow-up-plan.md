---
id: d49-residual-follow-up-plan-2026-05-02
title: "feat: Add D49 Residual Follow-Up"
type: plan
status: complete
stage: validation
summary: "Completed plan that makes the post-D49 diagnostic state explicit: D47 remains closed_by_d49, while residual D49 under-min and optional-redistribution pressure are classified into workload and redistribution follow-up lanes without changing caps, catalog content, or broad generator policy."
date: 2026-05-02
origin: docs/reviews/2026-05-01-generated-plan-diagnostics-triage.md
depends_on:
  - docs/reviews/2026-05-01-generated-plan-diagnostics-triage.md
  - docs/reviews/2026-05-02-d49-source-backed-activation-manifest.md
  - docs/plans/2026-05-02-014-feat-d47-source-backed-catalog-implementation-plan.md
  - docs/ops/workload-envelope-authoring-guide.md
---

# feat: Add D49 Residual Follow-Up

## Overview

Add a generated D49 residual follow-up packet to the diagnostics triage workflow. The packet should make the current post-D49 state legible: the original D47 optional-redistribution comparator key is closed by D49, while D49 now has residual workload-envelope and optional-slot redistribution evidence that needs its own bounded follow-up.

This plan does not widen D49 caps, add catalog content, change D47/D05, or alter runtime redistribution. It creates the decision surface that tells the next implementer whether D49 residual pressure is accepted debt, workload metadata review, block-shape review, or generator-policy follow-up.

---

## Problem Frame

The D47 source-backed catalog implementation succeeded at moving the original D47 pressure out of the comparator lane. Regenerated diagnostics now show `closed_by_d49`, but D49 appears in two residual lanes:

- Workload envelope review: `d49-solo-open` and `d49-pair-open` under-min main-skill groups.
- Generator redistribution investigation: D49 optional-slot redistribution groups, including over-cap/fatigue groups that disappear under allocated-duration comparison.

Without a D49-specific follow-up packet, the workbench correctly says "D49 residual follow-up" but does not yet preserve the exact split between workload review and redistribution policy. That ambiguity risks either reopening D47 incorrectly or mutating D49 caps/runtime policy from raw observations.

---

## Requirements Trace

- R1. Keep D47 closed unless regenerated diagnostics recreate the original D47 comparator group key.
- R2. Identify D49 residual workload groups separately from D49 redistribution groups.
- R3. Do not change D49 workload caps, D47 caps, D05 behavior, catalog content, UI, Dexie schema, or broad generator policy from this packet.
- R4. Route D49 under-min evidence through workload-envelope review before any metadata proposal.
- R5. Route D49 optional-slot redistribution evidence through generator-policy/U8 follow-up before any runtime behavior change.
- R6. Preserve source-backed activation boundaries from the D49 activation manifest: solo/pair open only, one ball, markers, no 3+ player source forms, no generic conditioning expansion.
- R7. Regenerate diagnostics docs and catalog metadata so the machine-readable routing states the new D49 residual packet.

---

## Scope Boundaries

- Do not edit `app/src/data/drills.ts` or D49 workload metadata in this slice.
- Do not edit `app/src/domain/sessionBuilder.ts` or redistribution behavior in this slice.
- Do not reopen D47 or re-run the D47-vs-D05 comparator unless the original D47 comparator key returns.
- Do not create U6 preview tooling or browser UI.
- Do not add another drill family.

### Deferred to Follow-Up Work

- A concrete D49 workload metadata proposal if the residual packet proves the current caps/copy are inconsistent.
- A concrete D49 block-shape or redistribution policy proposal if U8 evidence shows runtime assembly should change.
- Manual courtside dogfood validation of D49 session quality.

---

## Context & Research

### Relevant Code and Patterns

- `app/src/domain/generatedPlanDiagnosticTriage.ts` owns generated triage packets and markdown rendering.
- `app/src/domain/__tests__/generatedPlanDiagnosticTriage.test.ts` owns packet behavior, fail-closed coverage, and workbench markdown assertions.
- `app/scripts/validate-generated-plan-diagnostics-report.mjs` regenerates `docs/reviews/2026-05-01-generated-plan-diagnostics-report.md` and `docs/reviews/2026-05-01-generated-plan-diagnostics-triage.md`.
- Existing D01 and D47 generated packets provide the local pattern: build typed evidence from current groups, choose conservative authorization state, render a scan-friendly markdown section, and test stale/missing/incomplete evidence boundaries.

### Institutional Learnings

- No `docs/solutions/` learning exists for this workflow yet.
- `docs/ops/workload-envelope-authoring-guide.md` states generated workload observations are evidence, not permission to change caps, catalog content, or runtime redistribution.
- `docs/reviews/2026-05-02-d49-source-backed-activation-manifest.md` authorizes D49 only inside a narrow source-backed scope and explicitly excludes broad generator-policy changes.

---

## Key Technical Decisions

- Add a generated triage packet first, not a cap or generator change. The current evidence is mixed across workload and redistribution lanes, so the smallest safe action is classification.
- Keep D49 residual follow-up D49-owned. The packet should mention D47 only as a closed predecessor and should name the D47 re-entry condition as the original comparator key returning.
- Treat optional-slot redistribution as U8-owned. The packet can summarize D49 workload assumptions, but it must not decide redistribution policy.
- Use the current observation groups as the source of truth. Avoid hardcoding counts beyond stable D49 group keys and test fixtures.

---

## Open Questions

### Resolved During Planning

- Should this immediately change D49 caps? No. The workload guide requires a concrete proposal and likely U6 preview before metadata changes.
- Should this reopen D47? No. D47 remains closed unless the original D47 comparator key returns.
- Should this change runtime redistribution? No. Redistribution evidence should route to a future U8/generator-policy proposal.

### Deferred to Implementation

- Exact packet field names and helper boundaries can follow existing triage style while implementing.
- Exact generated markdown placement can be adjusted to keep the workbench scan-friendly, but it should appear after the D47 closure section and before broader open-route lists.

---

## Implementation Units

- [x] U1. **Add D49 Residual Packet Model**

**Goal:** Add a typed packet that collects current D49 residual evidence and classifies each lane without authorizing implementation changes.

**Requirements:** R1, R2, R3, R4, R5, R6.

**Dependencies:** None.

**Files:**
- Modify: `app/src/domain/generatedPlanDiagnosticTriage.ts`
- Test: `app/src/domain/__tests__/generatedPlanDiagnosticTriage.test.ts`

**Approach:**
- Build the packet from current generated observation groups and the existing redistribution causality receipt.
- Track workload group keys for D49 under-min main-skill groups separately from D49 optional-slot redistribution group keys.
- Include a `d47ClosureState` field that reports `closed_by_d49` when the D47 ledger is closed and a re-entry condition when it is not.
- Use conservative next artifacts:
  - workload lane -> D49 workload envelope review/proposal only if evidence justifies it
  - redistribution lane -> U8/generator-policy follow-up
  - no-change lane -> accepted residual debt only with threshold/revisit text
- Keep authorization `not_authorized` for cap, catalog, and runtime changes.

**Execution note:** Add characterization coverage first using current generated diagnostics, then add synthetic missing/stale fixtures to preserve fail-closed behavior.

**Patterns to follow:**
- `buildGeneratedPlanD47D05ComparatorDecisionPacket` in `app/src/domain/generatedPlanDiagnosticTriage.ts`.
- `buildGeneratedPlanD01CapCatalogForkPacket` in `app/src/domain/generatedPlanDiagnosticTriage.ts`.
- Existing packet tests in `app/src/domain/__tests__/generatedPlanDiagnosticTriage.test.ts`.

**Test scenarios:**
- Happy path: current diagnostics produce a selected D49 residual packet with D47 `closed_by_d49`, D49 workload group keys, and D49 redistribution group keys.
- Happy path: D49 under-min groups route to workload review, not cap widening.
- Happy path: D49 optional-slot over-cap/fatigue groups route to U8/generator-policy follow-up, not catalog edits.
- Edge case: if D49 groups disappear, the packet holds or records no implementation action instead of inventing work.
- Edge case: if D47 original comparator key returns, the packet marks D47 re-entry rather than claiming D49 closure.

**Verification:**
- D49 residual evidence is visible, typed, and non-authorizing.
- Existing D47/D05/D01 packet tests remain green.

---

- [x] U2. **Render D49 Follow-Up In The Workbench**

**Goal:** Add a scan-friendly D49 residual section to the generated triage markdown.

**Requirements:** R2, R3, R4, R5, R7.

**Dependencies:** U1.

**Files:**
- Modify: `app/src/domain/generatedPlanDiagnosticTriage.ts`
- Test: `app/src/domain/__tests__/generatedPlanDiagnosticTriage.test.ts`

**Approach:**
- Render the packet as `## D49 Residual Follow-Up` or similarly clear wording.
- Show D47 closure state, D49 workload evidence, D49 redistribution evidence, authorization status, next artifact, and stop condition.
- Use explicit wording that residual D49 pressure is not stale D47 evidence.
- Include group keys and counts only as evidence, not as implementation approval.

**Patterns to follow:**
- `formatGeneratedPlanD47D05ComparatorDecisionPacketMarkdown`.
- `formatGeneratedPlanGapClosureSelectionWorkbenchMarkdown`.

**Test scenarios:**
- Happy path: workbench markdown contains the D49 residual section and names both workload and redistribution lanes.
- Regression: workbench markdown states D47 remains closed by D49 and should not be reopened unless the original D47 key returns.
- Regression: markdown contains `not_authorized` for cap/catalog/runtime changes.

**Verification:**
- The generated triage workbench can be read top-down from D47 closure into D49 residual follow-up.

---

- [x] U3. **Regenerate Diagnostics And Routing Metadata**

**Goal:** Refresh generated docs and routing metadata after the D49 packet lands.

**Requirements:** R7.

**Dependencies:** U1, U2.

**Files:**
- Modify generated output: `docs/reviews/2026-05-01-generated-plan-diagnostics-triage.md`
- Modify if generated output changes: `docs/reviews/2026-05-01-generated-plan-diagnostics-report.md`
- Modify: `docs/catalog.json`
- Modify: `docs/plans/2026-05-02-018-feat-d49-residual-follow-up-plan.md`

**Approach:**
- Regenerate diagnostics docs through the existing report script.
- Update `docs/catalog.json` to register this plan and describe the D49 residual packet.
- Mark this plan complete only after focused verification and docs validation pass.

**Patterns to follow:**
- Completed plan metadata in `docs/plans/2026-05-02-014-feat-d47-source-backed-catalog-implementation-plan.md`.
- Generated diagnostics catalog entries in `docs/catalog.json`.

**Test scenarios:**
- Happy path: diagnostics check reports both generated files current.
- Regression: catalog summary does not claim D49 cap/runtime changes were authorized.

**Verification:**
- Generated triage and report docs are current.
- Agent docs validation passes.

---

## System-Wide Impact

- **Domain logic:** Adds a generated diagnostic triage packet; no runtime session assembly behavior changes.
- **Catalog:** No catalog data or workload metadata changes in this slice.
- **Diagnostics:** Makes current D49 residual pressure durable and machine-visible.
- **Docs:** Adds plan and catalog routing; generated triage includes the D49 follow-up section.
- **Unchanged invariants:** D47 remains closed by D49, D49 activation boundary remains narrow, and redistribution policy remains gated behind future U8/generator-policy work.

---

## Risks & Dependencies

| Risk | Mitigation |
|------|------------|
| D49 residual packet becomes a backdoor cap change. | Keep packet authorization `not_authorized` and require a separate concrete proposal for metadata changes. |
| D47 gets reopened from residual D49 evidence. | Store D47 re-entry condition explicitly: only when the original D47 comparator key returns. |
| Redistribution and workload evidence get conflated. | Split packet fields and markdown by lane. |
| Generated docs drift from code. | Regenerate through the existing diagnostics script and run diagnostics check. |

---

## Documentation / Operational Notes

- Update `docs/catalog.json` when the plan and generated triage change.
- If this pattern holds, capture a future `docs/solutions/` learning for diagnostic-to-catalog follow-up after review.

---

## Implementation Result

The generated triage now includes a `D49 Residual Follow-Up` packet. It keeps D47 closed by D49, splits D49 under-min workload evidence from optional-slot redistribution evidence, and preserves `not_authorized` for catalog metadata, catalog content, runtime redistribution, and D47 reopening.

The regenerated workbench records current D49 workload evidence as `workload_review_needed` and D49 redistribution evidence as `route_to_u8`, making the next work a concrete D49 workload/U8 proposal rather than stale D47 evidence.

---

## Sources & References

- `docs/reviews/2026-05-01-generated-plan-diagnostics-triage.md`
- `docs/reviews/2026-05-02-d49-source-backed-activation-manifest.md`
- `docs/plans/2026-05-02-014-feat-d47-source-backed-catalog-implementation-plan.md`
- `docs/ops/workload-envelope-authoring-guide.md`
- `app/src/domain/generatedPlanDiagnosticTriage.ts`
- `app/src/domain/__tests__/generatedPlanDiagnosticTriage.test.ts`
