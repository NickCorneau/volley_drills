---
id: action-overlay-primitive-plan-2026-05-02
title: "feat: Add ActionOverlay primitive"
type: plan
status: complete
stage: validation
summary: "Implementation plan for a narrow shadcn-informed local overlay primitive that centralizes blocking dialog semantics and focus behavior while preserving Volleycraft's existing UI system."
date: 2026-05-02
active_registry: true
origin: docs/ideation/2026-05-02-shadcn-courtside-overlay-ideation.md
depends_on:
  - docs/ideation/2026-05-02-calm-courtside-ux-style-ideation.md
  - docs/design/README.md
  - app/README.md
  - .cursor/rules/component-patterns.mdc
---

# feat: Add ActionOverlay primitive

## Overview

Add a small local `ActionOverlay` primitive under `app/src/components/ui/` and refactor the two Home confirmation overlays onto it. The primitive borrows shadcn Dialog/AlertDialog interaction discipline while keeping Volleycraft's existing Button, surface, typography, and copy language.

---

## Problem Frame

The app has multiple blocking confirmation overlays with similar visual language but uneven interaction guarantees. `SkipReviewModal` has explicit focus trap and focus restore behavior; `SoftBlockModal` currently only handles Escape. The next shadcn-informed improvement should centralize the hard overlay behavior without installing a broad component library or changing the app's calm courtside visual system.

---

## Requirements Trace

- R1. Preserve existing UI intent: warm elevated panel, restrained scrim, existing `Button` variants, and short consequence-first copy.
- R2. Centralize blocking dialog accessibility: role, `aria-modal`, labelled title, optional description, Escape dismissal, focus trap, and focus restore.
- R3. Keep safe/default action focus intentional; destructive or bypass actions must not become the initial keyboard target.
- R4. Refactor only the first two matching surfaces in this slice: `SkipReviewModal` and `SoftBlockModal`.
- R5. Do not install shadcn components, initialize a shadcn theme, replace local primitives, or change app routes/data/domain behavior.

---

## Scope Boundaries

- Do not add `components.json` or install shadcn/Radix/Vaul dependencies in this pass.
- Do not restyle the app or replace `Button`, `Card`, `ScreenShell`, or `ToggleChip`.
- Do not convert `ResumePrompt`, `SchemaBlockedOverlay`, or Run-screen end-session confirm yet.
- Do not introduce bottom sheets until an active-run quick-action use case needs them.
- Do not change modal copy beyond what is necessary to preserve current semantics.

---

## Context & Research

### Relevant Code and Patterns

- `app/src/components/SkipReviewModal.tsx` is the strongest local reference for focus trap, focus restore, and safe-primary-first ordering.
- `app/src/components/SoftBlockModal.tsx` shares the visual surface but lacks the same focus behavior.
- `app/src/components/ui/Card.tsx` owns `ELEVATED_PANEL_SURFACE`, the canonical elevated overlay panel token.
- `.cursor/rules/component-patterns.mdc` directs app UI work toward local primitives and warns against one-off overlay surface classes.

### Institutional Learnings

- The durable design guidance favors calm, sparse, mobile-first courtside surfaces and avoids broad design-system churn during feature work.
- Prior skip-review work demoted inline destructive confirmation into a centered dialog because destructive decisions need a structurally distinct, accessible surface.

### External References

- shadcn Dialog/Drawer examples were used as structure references, especially the rule that Dialog/Drawer always needs a title and controlled open/close semantics.
- WAI-ARIA modal dialog guidance supports focus containment, labelled titles, Escape handling, and focus restoration for true modal dialogs.

---

## Key Technical Decisions

- Build a local primitive rather than installing shadcn components: the app already has a small product-specific visual system, and the value here is interaction discipline.
- Keep the primitive intentionally narrow: blocking decision overlays only, with no broad variant matrix.
- Refactor `SkipReviewModal` and `SoftBlockModal` first: they are similar enough to prove the primitive while keeping blast radius small.
- Use tests to lock accessibility behavior: the new primitive should be tested directly, and the refactored modals should retain existing role/click/Escape contracts.

---

## Open Questions

### Resolved During Planning

- Should this install shadcn Dialog/Drawer now? No. Use shadcn as a reference because the project has no shadcn config and broad adoption would add churn.
- Should mobile bottom sheets be included now? No. Current targets are blocking Home confirmations; bottom sheets belong to a later active-run quick-action slice.

### Deferred to Implementation

- Exact prop names for the primitive can follow the implementation shape that keeps call sites simplest.

---

## Implementation Units

- [x] U1. **Add the local ActionOverlay primitive**

**Goal:** Create a reusable overlay component that owns dialog semantics and keyboard focus behavior.

**Requirements:** R1, R2, R3, R5

**Dependencies:** None

**Files:**

- Create: `app/src/components/ui/ActionOverlay.tsx`
- Modify: `app/src/components/ui/index.ts`
- Test: `app/src/components/ui/__tests__/ActionOverlay.test.tsx`

**Approach:**

- Render the canonical fixed scrim and elevated panel using `ELEVATED_PANEL_SURFACE`.
- Generate stable title/description ids internally.
- Trap Tab/Shift+Tab within the panel while mounted.
- Restore focus to the previously focused element on unmount.
- Support an explicit initial-focus marker so safe actions can be focused even when a close button appears first in DOM order.
- Support optional close button and Escape dismissal through a caller-supplied dismiss handler.

**Execution note:** Implement the primitive behavior test-first where practical.

**Patterns to follow:**

- `app/src/components/SkipReviewModal.tsx`
- `app/src/components/ui/Card.tsx`
- `app/src/lib/cn.ts`

**Test scenarios:**

- Happy path: rendering with a title exposes `role="dialog"`, `aria-modal="true"`, and a labelled heading.
- Happy path: Escape invokes the dismiss handler when supplied.
- Edge case: when an element has the initial-focus marker, mount focuses that element rather than the close button.
- Edge case: Tab from the last focusable wraps to the first, and Shift+Tab from the first wraps to the last.
- Integration: unmount restores focus to the element that opened the overlay.

**Verification:**

- The primitive can be used without duplicating focus management in callers.

---

- [x] U2. **Refactor Home confirmation modals**

**Goal:** Move `SkipReviewModal` and `SoftBlockModal` onto `ActionOverlay` without changing their product behavior or copy.

**Requirements:** R1, R2, R3, R4, R5

**Dependencies:** U1

**Files:**

- Modify: `app/src/components/SkipReviewModal.tsx`
- Modify: `app/src/components/SoftBlockModal.tsx`
- Test: `app/src/components/__tests__/SkipReviewModal.test.tsx`
- Test: `app/src/components/__tests__/SoftBlockModal.test.tsx`

**Approach:**

- Preserve existing titles, body copy, button order, and callback contracts.
- Mark each safe/default action as the initial focus target.
- Keep SoftBlock's close button behavior as a non-accepting dismissal.
- Remove local focus-trap duplication from `SkipReviewModal`.

**Patterns to follow:**

- Existing `SkipReviewModal` test contract
- Existing `SoftBlockModal` behavior tests

**Test scenarios:**

- Happy path: both modals retain role/label semantics and existing button callbacks.
- Happy path: SkipReview still focuses `Never mind` on mount and restores opener focus on unmount.
- Happy path: SoftBlock now focuses `Finish review` on mount even though a close button is present.
- Edge case: SoftBlock Tab/Shift+Tab remains trapped inside the overlay.
- Error path: Escape on either modal calls the non-accepting dismissal path, not destructive/bypass callbacks.

**Verification:**

- Existing modal tests pass and new SoftBlock focus coverage proves the shared behavior improved parity.

---

- [x] U3. **Sync docs routing and plan state**

**Goal:** Keep the new ideation and implementation plan discoverable.

**Requirements:** R5

**Dependencies:** U1, U2

**Files:**

- Modify: `docs/catalog.json`
- Modify: `docs/plans/2026-05-02-015-feat-action-overlay-primitive-plan.md`

**Approach:**

- Register the new ideation and plan in `docs/catalog.json`.
- Mark the plan complete after implementation and verification.

**Test scenarios:**

- Test expectation: none -- docs routing only, covered by agent-doc validation.

**Verification:**

- Agent-doc validation accepts the new docs and catalog entries.

---

## System-Wide Impact

- **Interaction graph:** Home overlay call sites keep the same callbacks; shared focus/keyboard behavior moves into `ActionOverlay`.
- **Error propagation:** No service/domain errors are introduced; callback failures remain caller-owned.
- **State lifecycle risks:** Focus restoration now depends on unmounting the overlay; tests cover opener restoration.
- **API surface parity:** Other overlays are intentionally not migrated yet, but the primitive creates a clear next path.
- **Integration coverage:** Component tests prove the real DOM focus chain instead of only callback isolation.
- **Unchanged invariants:** Routes, Dexie schema, generated session assembly, review skip semantics, and soft-block dismissal semantics stay unchanged.

---

## Risks & Dependencies

| Risk                                               | Mitigation                                                                                   |
| -------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| Primitive grows into a broad modal framework       | Keep v1 props minimal and refactor only two modals.                                          |
| Focus behavior regresses while removing local code | Add direct primitive tests plus retained modal contract tests.                               |
| shadcn usage becomes ambiguous                     | Document that shadcn informed the structure but was not installed in this pass.              |
| Visual drift appears in overlays                   | Keep `ELEVATED_PANEL_SURFACE`, existing widths/radius/padding, and existing Button variants. |

---

## Documentation / Operational Notes

- This plan treats shadcn as a reference and registry lookup tool, not as a design-system authority for Volleycraft.
- A later active-run quick-action sheet may revisit shadcn Drawer/Vaul patterns if the app needs a bottom-sheet interaction.

---

## Sources & References

- **Origin document:** `docs/ideation/2026-05-02-shadcn-courtside-overlay-ideation.md`
- Related design context: `docs/ideation/2026-05-02-calm-courtside-ux-style-ideation.md`
- Related code: `app/src/components/SkipReviewModal.tsx`
- Related code: `app/src/components/SoftBlockModal.tsx`
- Related rules: `.cursor/rules/component-patterns.mdc`
