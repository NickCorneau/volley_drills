---
id: generated-diagnostics-d01-block-shape-fill-plan-2026-05-02
title: "feat: Apply D01 Block-Shape Fill"
type: feat
status: complete
stage: validation
summary: "Implementation plan for applying the first concrete D01 block-shape fill through D01-scoped duration-aware main-skill candidate selection and a generated diagnostics reassessment receipt."
active_registry: true
date: 2026-05-02
origin: docs/brainstorms/2026-05-02-generated-diagnostics-d01-block-shape-fill-requirements.md
---

# feat: Apply D01 Block-Shape Fill

## Overview

Apply the first concrete D01 gap fill: make generated main-skill selection duration-aware so a short D01 block is not asked to carry a longer main-skill allocation when another eligible same-slot candidate can carry that duration honestly.

This plan applies a narrow runtime selection change and updates the generated diagnostics workbench with a D01 fill reassessment. It does not edit D01 workload metadata, add source-backed content, build U6 preview tooling, or solve every generated-plan observation.

---

## Problem Frame

The D01 workload/block-shape proposal selected block-shape review over cap widening. The actual fill should therefore change the generated block shape rather than the drill catalog. Repeating D01 would introduce repeated focus-controlled-family pressure and obscure the short-drill problem; widening D01 would make the catalog less honest.

The smallest concrete behavior is duration-aware D01 main-skill rerouting: after the slot's allocated duration is known, intervene only when the seeded default main-skill pick is overlong D01. Prefer a same-slot candidate whose workload max and fatigue cap can carry the duration; when no exact fit exists, prefer a stronger non-D01 envelope before falling back. Regenerated diagnostics now show a partial fill: D01 target cells dropped from 18 to 12, and non-redistribution D01 pressure dropped from 6 to 0.

---

## Requirements Trace

- R1-R6. Add D01-scoped main-skill duration-aware selection while preserving hard filters, determinism, fallback behavior, and unchanged D01 metadata.
- R7-R12. Add generated D01 reassessment tied to the prior target group and update parent workflow state.
- R13-R16. Keep scope tight: no catalog/source/U6/theme changes, no suppressed diagnostics, and no repeated D01 block masking.

**Origin actors:** A1 Maintainer, A2 Agent implementer, A3 Reviewer.  
**Origin flows:** F1 Duration-aware main-skill reroute; F2 Fill reassessment.  
**Origin acceptance examples:** AE1 duration-aware reroute; AE2 unchanged fallback/non-main behavior; AE3 reassessment receipt; AE4 no metadata/source/U6/repeated-block leakage.

---

## Scope Boundaries

- Do not edit `app/src/data/drills.ts` or D01 workload metadata.
- Do not change authored archetype durations.
- Do not add source-backed D01 content, variants, U6 preview tooling, curated themes, or UI.
- Do not change swap alternatives or recovery-session assembly.
- Do not silence or downgrade generated diagnostics; regenerate them from actual behavior.
- Do not generalize into a full workload scoring system.

---

## Context & Research

### Relevant Code and Patterns

- `app/src/domain/sessionBuilder.ts` owns `buildDraft()` and already knows allocated slot durations before it creates draft blocks.
- `app/src/domain/sessionAssembly/candidates.ts` owns hard-filtered candidate discovery and deterministic seeded picking.
- `app/src/domain/sessionAssembly/durations.ts` owns allocated slot duration calculation; this plan should consume those values, not change the allocator.
- `app/src/domain/generatedPlanDiagnostics.ts` proves the diagnostic movement by re-running `buildDraftWithAssemblyTrace()`.
- `app/src/domain/generatedPlanDiagnosticTriage.ts` owns D01 proposal rendering and should own the D01 fill reassessment receipt.
- `app/src/domain/sessionBuilder.test.ts` and `app/src/domain/__tests__/generatedPlanDiagnosticTriage.test.ts` are the focused behavior/test surfaces.
- `app/scripts/validate-generated-plan-diagnostics-report.mjs` owns generated triage frontmatter dependencies and freshness checks.

### Institutional Learnings

- Existing generated diagnostics work is evidence-first: apply runtime behavior only after a concrete proposal and then let the generated receipt prove movement.
- The previous D01 proposal intentionally blocked generator edits; this plan is the later authorization point for a narrow generator-selection fill.

### External References

- None. Local diagnostics, workload, and session-assembly patterns are sufficient.

---

## Key Technical Decisions

- Fit after shuffle, before default return: keep deterministic seeded variety while intervening only when the seeded default would stretch D01.
- Main-skill D01 only: D01 pressure is a main-skill block-shape issue, so other slot heuristics and unrelated non-D01 default picks remain untouched.
- Use variant workload max and fatigue cap: a candidate fits only when `durationMaxMinutes >= allocatedDuration` and, when present, `fatigueCap.maxMinutes >= allocatedDuration`.
- Stronger-envelope fallback instead of failure: if no duration-fit candidate exists, prefer the strongest non-D01 candidate; if there is no alternative, fall back so diagnostics can continue to surface the unresolved case.
- Add a separate fill receipt: keep earlier D01 proposal sections as history, and add a reassessment section that can say whether the prior target group disappeared.

---

## Open Questions

### Resolved During Planning

- Should duration-fit selection happen before or after seeded shuffle? After shuffle, so selection stays deterministic and preserves seeded variety among fit candidates.
- Should reassessment live in the existing proposal section or a separate section? Separate `D01 Block-Shape Fill Receipt`, so proposal and fill proof are not conflated.
- What if D01 remains? Mark the receipt `partially_validated` when affected cells or non-redistribution pressure drop, otherwise `unresolved`; never claim field training-quality validation from generated diagnostics alone.

### Deferred to Implementation

- Exact helper/type names should match the local session-assembly and generated-triage naming style.
- Exact group-count changes should be accepted only after running generated diagnostics and focused tests.

---

## Implementation Units

- [x] U1. **Add duration-aware main-skill candidate selection**

**Goal:** Prefer non-D01 main-skill candidates when seeded selection would stretch D01 beyond its authored envelope, while preserving deterministic fallback behavior.

**Requirements:** R1-R6, R13-R16, AE1, AE2, AE4

**Dependencies:** None.

**Files:**

- Modify: `app/src/domain/sessionAssembly/candidates.ts`
- Modify: `app/src/domain/sessionBuilder.ts`
- Test: `app/src/domain/sessionBuilder.test.ts`

**Approach:**

- Add an optional target duration to `pickForSlot()` options.
- Add a local helper that returns true when candidate workload max and fatigue cap can carry the target duration.
- In `pickForSlot()`, apply the fit preference only for `main_skill` when the seeded default pick is overlong D01, or when a post-selection D01 reroute explicitly asks for target-duration preference.
- Pass `durations[i]` from `sessionBuilder.ts` when selecting required and optional slots.
- Keep all hard-filtered candidate discovery, seeded shuffle, slot-specific warmup/technique/movement/wrap behavior, and no-candidate fallback intact.

**Execution note:** Test-first for the D01 main-skill reroute; characterization for unchanged fallback/non-main behavior.

**Patterns to follow:**

- Existing deterministic selection tests in `app/src/domain/sessionBuilder.test.ts`.
- Candidate filtering and slot-specific preference style in `app/src/domain/sessionAssembly/candidates.ts`.

**Test scenarios:**

- Happy path: a seeded solo/open main-skill build that previously picked `d01-solo` for a duration over 5 minutes now picks a duration-fit same-slot candidate.
- Happy path: a <=5 minute D01-compatible allocation may still select D01.
- Edge case: when no duration-fit candidate exists, `pickForSlot()` prefers the strongest non-D01 envelope and still returns an eligible candidate instead of `undefined`.
- Edge case: non-main slot selection is unchanged by the target-duration option.
- Regression: fixed-seed assembly remains deterministic.

**Verification:**

- Focused `sessionBuilder.test.ts` passes.
- No D01 metadata edits.

---

- [x] U2. **Add generated D01 fill reassessment receipt**

**Goal:** Make the workbench show whether the prior D01 target group moved after the runtime fill.

**Requirements:** R7-R12, AE3

**Dependencies:** U1.

**Files:**

- Modify: `app/src/domain/generatedPlanDiagnosticTriage.ts`
- Modify: `app/src/domain/__tests__/generatedPlanDiagnosticTriage.test.ts`

**Approach:**

- Add a small D01 fill receipt builder keyed to the prior D01 target group.
- If the prior target group is absent from current diagnostics, mark diagnostic movement `validated` and preserve the prior target key.
- If the group is present but affected cells or non-redistribution pressure moved, mark diagnostic movement `partially_validated`; if no measurable movement appears, mark it `unresolved`.
- Keep training-quality state separate from diagnostic state and bounded as not field-validated.
- Render a `## D01 Block-Shape Fill Receipt` section after the D01 workload/block-shape proposal.

**Execution note:** Test-first for validated and unresolved receipt states.

**Patterns to follow:**

- D01 proposal builders and render sections in `app/src/domain/generatedPlanDiagnosticTriage.ts`.
- Existing D01 stale/missing tests in `app/src/domain/__tests__/generatedPlanDiagnosticTriage.test.ts`.

**Test scenarios:**

- Happy path after fill: current D01 target group is reduced and the fill receipt marks diagnostic movement partially validated with baseline/current facts.
- Edge case: synthetic state with D01 target absent marks receipt validated.
- Rendering: Markdown includes target group, diagnostic movement, training-quality boundary, U6 boundary, and no metadata/source changes.

**Verification:**

- Focused generated-triage tests pass.

---

- [x] U3. **Regenerate diagnostics and sync docs routing**

**Goal:** Update generated diagnostics, freshness dependencies, catalog routing, and parent plan state to reflect the applied D01 fill.

**Requirements:** R7-R16, AE3, AE4

**Dependencies:** U1, U2.

**Files:**

- Modify: `app/scripts/validate-generated-plan-diagnostics-report.mjs`
- Modify generated output via diagnostics update: `docs/reviews/2026-05-01-generated-plan-diagnostics-triage.md`
- Modify: `docs/catalog.json`
- Modify: `docs/plans/2026-05-01-002-feat-generated-diagnostics-triage-workflow-plan.md`
- Modify: `docs/plans/2026-05-02-007-feat-d01-block-shape-fill-plan.md`

**Approach:**

- Add the D01 fill requirements and plan docs to generated-triage dependencies.
- Run diagnostics report update so group counts and the D01 receipt reflect actual behavior.
- Add requirements/plan entries to `docs/catalog.json`.
- Update the parent generated diagnostics workflow plan summary/status note.
- Mark this plan complete after verification.

**Patterns to follow:**

- Prior D01 plan completion and generated dependency updates.

**Test scenarios:**

- Test expectation: generated-doc freshness and agent-doc validation cover routing.

**Verification:**

- `npm run diagnostics:report:check`
- `bash scripts/validate-agent-docs.sh`

---

## System-Wide Impact

- **Interaction graph:** Session assembly selection -> generated diagnostics matrix -> generated triage workbench -> docs routing/freshness.
- **Error propagation:** No-fit D01 main-skill cases continue through fallback and diagnostics instead of becoming draft failures.
- **State lifecycle risks:** D01 proposal sections become historical context; the fill receipt owns current post-fill proof.
- **API surface parity:** `pickForSlot()` gains internal optional selection hints; public app routes and persisted Dexie schema remain unchanged.
- **Integration coverage:** Focused builder tests plus generated diagnostics freshness prove behavior and generated-doc integration.
- **Unchanged invariants:** Hard filters, total duration, deterministic seed behavior, D01 metadata, source-backed content, U6 tooling, and UI remain unchanged.

---

## Risks & Dependencies

| Risk                                                  | Mitigation                                                                                                         |
| ----------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| Main-skill selection changes more seeds than expected | Scope to overlong D01 default picks only; accept generated diagnostics as proof and review fixed-seed tests.       |
| Duration-fit preference reduces variety               | Apply after seeded shuffle, selecting the first fit candidate or strongest non-D01 fallback only for D01 reroutes. |
| No candidate fits in some contexts                    | Prefer the strongest non-D01 envelope, then keep fallback and let diagnostics report unresolved pressure.          |
| Receipt overclaims product quality                    | Separate diagnostic validation from field training-quality validation.                                             |
| D01 history looks stale after fill                    | Add a dedicated fill receipt instead of mutating old proposal meaning.                                             |

---

## Documentation / Operational Notes

- This is the first actual diagnostic-to-fill loop for the generated diagnostics program; it partially validates the fill and leaves redistribution-shaped D01 pressure open.
- Consider capturing a durable learning in a follow-up `/ce-compound` pass after the next redistribution-specific decision.
- Manual field quality remains future work; this plan proves generated workload honesty, not courtside feel.

---

## Sources & References

- **Origin document:** [docs/brainstorms/2026-05-02-generated-diagnostics-d01-block-shape-fill-requirements.md](../brainstorms/2026-05-02-generated-diagnostics-d01-block-shape-fill-requirements.md)
- Prior D01 proposal: [docs/brainstorms/2026-05-02-generated-diagnostics-d01-workload-block-shape-proposal-requirements.md](../brainstorms/2026-05-02-generated-diagnostics-d01-workload-block-shape-proposal-requirements.md)
- Prior D01 plan: [docs/plans/2026-05-02-006-feat-d01-workload-block-shape-proposal-plan.md](2026-05-02-006-feat-d01-workload-block-shape-proposal-plan.md)
- Workload guide: [docs/ops/workload-envelope-authoring-guide.md](../ops/workload-envelope-authoring-guide.md)
- Related assembly code: `app/src/domain/sessionBuilder.ts`, `app/src/domain/sessionAssembly/candidates.ts`
- Related diagnostics code: `app/src/domain/generatedPlanDiagnostics.ts`, `app/src/domain/generatedPlanDiagnosticTriage.ts`
