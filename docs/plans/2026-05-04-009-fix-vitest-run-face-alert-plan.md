---
title: Fix Vitest Run Face Alert Regression
type: fix
status: active
date: 2026-05-04
---

# Fix Vitest Run Face Alert Regression

## Summary

Restore the app Vitest suite to a green baseline by fixing the real `RunScreen` accessibility/test regression first, then verifying whether the reported worker errors were secondary noise from the long full-suite run.

---

## Problem Frame

The full Vitest run reported one failed test file and many secondary errors. Repo research identified the failing assertion as duplicate `role="alert"` semantics in the run error state: `RunScreen` wraps `StatusMessage variant="error"`, and the `StatusMessage` error variant already renders an alert through `Callout`.

---

## Assumptions

*This plan was authored in LFG pipeline mode without synchronous confirmation. The items below are agent inferences that should be reviewed during implementation and code review.*

- The failing Vitest baseline should be fixed narrowly; broader test-suite improvement ideas from the prior ideation pass are out of scope for this LFG run.
- The `RunScreen` failure is the primary app regression; the additional Vitest pool startup errors should be re-evaluated only after the targeted assertion is green.
- `StatusMessage variant="error"` should remain the canonical alert owner rather than making each caller add alert semantics around it.

---

## Requirements

- R1. The `RunScreen` error state must expose a single alert landmark/role for assistive technology and Testing Library queries.
- R2. The targeted run-face test file must pass after the fix.
- R3. The full Vitest suite must be rerun after the targeted fix; if worker timeout errors remain, they must be investigated as a separate suite-runtime issue rather than hidden by the markup fix.
- R4. The fix must preserve the repo's testing pyramid: no Playwright or broad UI rewrite for a unit-level accessibility semantics regression.

---

## Scope Boundaries

- Do not implement the broader test-coverage ideation ideas in this run.
- Do not change `StatusMessage`'s public error semantics unless implementation proves it is the true owner of the defect.
- Do not tune Vitest worker settings unless worker errors persist after the targeted failure is fixed.
- Do not rewrite `RunScreen` cockpit or controls layout beyond the minimum required semantic correction.

---

## Context & Research

### Relevant Code and Patterns

- `app/src/screens/RunScreen.tsx` owns the run cockpit and error-state rendering.
- `app/src/screens/__tests__/RunScreen.run-face.test.tsx` contains the failing `shows run errors without hiding the cockpit controls` coverage.
- `app/src/components/ui/StatusMessage.tsx` centralizes loading/error/empty state rendering; its error variant uses `Callout`.
- `app/src/components/ui/Callout.tsx` owns optional role propagation for tone-driven panels.
- `app/vite.config.ts` and `app/src/test-setup.ts` define the Vitest/jsdom harness.

### Institutional Learnings

- `docs/solutions/2026-05-04-source-backed-content-depth-activation-pattern.md` reinforces the pattern of fixing narrowly, running focused tests first, then broad verification.

### External References

- None needed. The codebase has direct local patterns for this accessibility semantics fix.

---

## Key Technical Decisions

- Keep alert semantics in `StatusMessage variant="error"` because it is the shared page-state primitive and already routes error rendering through `Callout`.
- Treat the outer `RunScreen` wrapper as layout-only if one is still needed, avoiding nested alert roles.
- Preserve the existing `RunScreen` test intent: the error should remain visible without hiding cockpit controls.

---

## Open Questions

### Resolved During Planning

- **Where should the alert role live?** In `StatusMessage variant="error"`, because it is the reusable status primitive and avoids caller-by-caller drift.

### Deferred to Implementation

- **Do Vitest worker timeouts remain after the targeted failure is fixed?** This depends on rerunning tests after the assertion failure is gone.

---

## Implementation Units

- U1. **Remove Duplicate RunScreen Alert Semantics**

**Goal:** Make the run error state expose exactly one alert role while preserving the existing visual layout and cockpit controls.

**Requirements:** R1, R2, R4

**Dependencies:** None

**Files:**
- Modify: `app/src/screens/RunScreen.tsx`
- Test: `app/src/screens/__tests__/RunScreen.run-face.test.tsx`

**Approach:**
- Inspect the run error-state markup in `RunScreen`.
- Remove the outer alert semantics around `StatusMessage variant="error"` or convert that wrapper to a non-semantic layout element.
- Keep `StatusMessage` as the semantic error-state owner.

**Execution note:** Start with the targeted failing test file and preserve its assertion intent instead of loosening the query.

**Patterns to follow:**
- `app/src/components/ui/StatusMessage.tsx`
- `app/src/components/ui/Callout.tsx`

**Test scenarios:**
- Happy path: rendering the run error state exposes one alert and still shows cockpit controls.
- Accessibility regression: `getByRole('alert')` resolves unambiguously for the run error state.
- Layout preservation: existing run cockpit/control assertions in `RunScreen.run-face.test.tsx` remain unchanged unless they were only coupled to the duplicate wrapper.

**Verification:**
- The targeted `RunScreen.run-face` Vitest file passes.
- No unrelated `RunScreen` behavior is changed.

---

- U2. **Recheck Full Vitest Runtime Signal**

**Goal:** Confirm the full app Vitest suite is green after U1, or isolate any remaining worker/runtime failures separately.

**Requirements:** R2, R3

**Dependencies:** U1

**Files:**
- Modify: `app/vite.config.ts` only if worker errors persist and investigation proves config needs a narrow adjustment.
- Modify: `app/src/test-setup.ts` only if worker errors persist and investigation proves harness state is leaking.

**Approach:**
- Rerun the full Vitest suite after the targeted fix.
- If only the targeted failure was causal, leave Vitest configuration and setup unchanged.
- If worker startup timeouts remain, investigate them as suite-runtime failures and make the smallest proven harness/config change.

**Patterns to follow:**
- `docs/specs/m001-quality-and-testing.md`
- `app/README.md`
- `app/vite.config.ts`
- `app/src/test-setup.ts`

**Test scenarios:**
- Happy path: the full Vitest suite completes with zero failed tests.
- Error path: if Vitest worker timeouts persist, rerun a narrower affected subset to distinguish application assertion failures from runner/resource issues.
- Guardrail: no worker/config changes are made when a clean full suite confirms the errors were secondary.

**Verification:**
- Full Vitest output reports all test files and tests passing.
- Any remaining suite-runtime issue has a specific failing command and file/symptom before being changed.

---

## System-Wide Impact

- **Interaction graph:** Limited to `RunScreen` error rendering and shared status semantics.
- **Error propagation:** Error state should still render the same visible message; only duplicate alert ownership changes.
- **State lifecycle risks:** None expected; no Dexie, timer, runner, or route state changes are planned.
- **API surface parity:** `StatusMessage` remains the shared status primitive; callers should not reintroduce duplicate alert wrappers.
- **Integration coverage:** Targeted RTL coverage is sufficient for the semantic regression; Playwright is not needed unless later browser-only issues surface.
- **Unchanged invariants:** Run controls, timer behavior, pause/next actions, and cockpit layout should remain unchanged.

---

## Risks & Dependencies

| Risk | Mitigation |
|------|------------|
| The test failure is fixed by weakening the test instead of fixing semantics. | Keep the test's role-based query intent and remove duplicate markup instead. |
| Worker timeouts are mistaken for app failures. | Re-run targeted coverage first, then full suite; only investigate worker settings if timeouts persist. |
| Removing the wrapper changes layout spacing. | Preserve any layout classes on a non-semantic wrapper if needed. |

---

## Documentation / Operational Notes

- No durable docs are expected beyond this plan unless implementation uncovers a reusable testing lesson worth adding to `docs/solutions/`.

---

## Sources & References

- Related code: `app/src/screens/RunScreen.tsx`
- Related test: `app/src/screens/__tests__/RunScreen.run-face.test.tsx`
- Related primitive: `app/src/components/ui/StatusMessage.tsx`
- Related primitive: `app/src/components/ui/Callout.tsx`
- Testing contract: `docs/specs/m001-quality-and-testing.md`
- App testing pyramid: `app/README.md`
