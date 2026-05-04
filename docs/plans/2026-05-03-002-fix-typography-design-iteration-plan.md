---
id: typography-design-iteration-plan-2026-05-03
title: "fix: Resolve typography design-iteration findings"
type: fix
status: active
stage: validation
date: 2026-05-03
summary: "Follow-up plan for running a ce-design-iterator pass over the completed typography-system changes, fixing concrete visual or implementation issues it finds, and verifying the fixes without expanding the typography scope."
origin: docs/plans/2026-05-03-001-feat-volleycraft-typography-system-plan.md
---

# fix: Resolve typography design-iteration findings

## Overview

Run a focused `ce-design-iterator` pass against the completed typography-system changes and fix only concrete issues found in the changed surfaces, scripts, or docs. This is a follow-up quality loop, not a new typography direction.

---

## Problem Frame

The typography-system pass added docs, a guardrail command, a Settings build-id typography fix, and browser screenshot evidence. A final design-iteration review should check whether those changes preserve the calm courtside design posture and whether any visible or agent-facing defects remain before considering the pass complete.

---

## Requirements Trace

- Preserve the original typography-system scope: no font swap, broad type-scale migration, distance mode, route change, or new disclosure UI.
- Run `ce-design-iterator` as the named design review pass.
- Fix only validated concrete issues from the design iteration.
- Keep fixes testable with the existing typography guardrail, focused app tests, docs validation, and browser evidence.

---

## Scope Boundaries

- Do not reopen font-family selection.
- Do not change `D127`, body-scale tokens, timer mechanics, generated session behavior, data model, or route structure.
- Do not treat browser screenshots as outdoor field validation.
- Do not make speculative visual polish changes that are not grounded in the design-iterator findings.

---

## Context & Research

### Relevant Code and Patterns

- Completed typography plan: `docs/plans/2026-05-03-001-feat-volleycraft-typography-system-plan.md`
- Typography contract: `docs/research/brand-ux-guidelines.md`
- App verification docs: `app/README.md`
- Guardrail implementation: `app/scripts/validate-typography-guardrails.mjs`
- Guardrail tests: `app/scripts/__tests__/validate-typography-guardrails.test.ts`
- Browser evidence: `app/e2e/typography-visual-evidence.spec.ts`

### Institutional Learnings

- No `docs/solutions/` entry currently owns this pattern. Follow the completed typography plan and existing design docs.

---

## Key Technical Decisions

- **Design-iterator first:** The implementation step starts by running `ce-design-iterator` and treating its concrete findings as the source of truth for fixes.
- **Fix scope:** Only fix findings that are actionable in the current branch and aligned with the original typography requirements.
- **Verification:** Re-run the narrow typography verification set after any fix.

---

## Implementation Units

- [x] U1. **Run focused design iteration**

**Goal:** Ask `ce-design-iterator` to inspect the completed typography-system changes and return concrete, prioritized issues.

**Requirements:** named `ce-design-iterator` pass, no speculative scope expansion.

**Dependencies:** None.

**Files:**
- Read: `docs/plans/2026-05-03-001-feat-volleycraft-typography-system-plan.md`
- Read: `docs/research/brand-ux-guidelines.md`
- Read: `app/README.md`
- Read: `app/scripts/validate-typography-guardrails.mjs`
- Read: `app/e2e/typography-visual-evidence.spec.ts`

**Approach:**
- Provide the design iterator with the original typography plan, current branch context, and verification commands already run.
- Ask it to distinguish must-fix issues from optional polish and field-validation-only observations.

**Test scenarios:**
- Test expectation: none -- review-only unit.

**Verification:**
- A concrete design-iterator result exists and each finding is classified as fix-now, defer, or no-action.

---

- [x] U2. **Apply concrete design-iteration fixes**

**Goal:** Fix only validated issues from U1 that are safe and in scope.

**Requirements:** preserve original typography constraints and avoid unrelated refactors.

**Dependencies:** U1.

**Files:**
- Modify: files named by `ce-design-iterator` findings, expected likely set limited to `app/README.md`, `docs/research/brand-ux-guidelines.md`, `app/scripts/validate-typography-guardrails.mjs`, `app/e2e/typography-visual-evidence.spec.ts`, or nearby tests.
- Test: existing focused tests affected by the fixes.

**Approach:**
- Treat design-iterator output as a review, not as permission for a new visual system.
- Prefer documentation, test, or small class/selector fixes over broad UI retuning.
- Record any valid but not-now issues as residuals only if they are concrete and actionable.

**Test scenarios:**
- Regression: typography guardrail still passes.
- Regression: focused unit tests for touched scripts/components pass.
- Browser: typography visual evidence spec still passes if browser-facing files changed.

**Verification:**
- Diff contains only scoped fixes tied to U1 findings.

---

- [x] U3. **Verify and hand off**

**Goal:** Complete the LFG verification loop for this follow-up pass.

**Requirements:** code review autofix, persisted autofixes, residual handling if any, browser testing, final `DONE`.

**Dependencies:** U2.

**Files:**
- Modify: this plan checklist as units complete.
- Modify: `docs/catalog.json` for this new plan entry.

**Approach:**
- Update `docs/catalog.json` for this plan.
- Run docs validation, typography guardrail, focused tests, lint, and browser evidence as applicable.
- Run `ce-code-review mode:autofix plan:docs/plans/2026-05-03-002-fix-typography-design-iteration-plan.md`.
- Persist review autofixes per LFG.

**Test scenarios:**
- Documentation: this plan is cataloged and checklist state matches implementation.
- Verification: no residual actionable work remains unless durably recorded.

**Verification:**
- Final git state is clean after any required commits/pushes.

---

## Risks & Dependencies

| Risk | Mitigation |
|------|------------|
| Design iteration expands into a second typography redesign | Fix only concrete findings aligned with the original typography-system plan. |
| Browser-only evidence is overstated | Keep field-validation claims out of fixes and summaries. |
| Review fixes get mixed with unrelated branch work | Start from clean status and stage only files touched by this follow-up loop. |

---

## Sources & References

- **Origin plan:** [docs/plans/2026-05-03-001-feat-volleycraft-typography-system-plan.md](2026-05-03-001-feat-volleycraft-typography-system-plan.md)
- **Typography contract:** [docs/research/brand-ux-guidelines.md](../research/brand-ux-guidelines.md)
- **App verification:** [app/README.md](../../app/README.md)
