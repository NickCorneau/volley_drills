---
id: action-overlay-consistency-pass-plan-2026-05-02
title: "feat: Finish ActionOverlay consistency pass"
type: plan
status: complete
stage: validation
summary: "Implementation plan for migrating the remaining obvious blocking overlays onto the local ActionOverlay primitive while preserving existing behavior, copy, routes, and visual language."
date: 2026-05-02
active_registry: true
origin: docs/plans/2026-05-02-015-feat-action-overlay-primitive-plan.md
depends_on:
  - docs/ideation/2026-05-02-shadcn-courtside-overlay-ideation.md
  - docs/plans/2026-05-02-015-feat-action-overlay-primitive-plan.md
  - app/src/components/ui/ActionOverlay.tsx
  - .cursor/rules/component-patterns.mdc
---

# feat: Finish ActionOverlay consistency pass

## Overview

Finish the obvious second overlay pass by migrating `ResumePrompt`, `SchemaBlockedOverlay`, and the Run-screen end-session confirm onto the local `ActionOverlay` primitive introduced in the first shadcn-informed overlay slice.

This is a consistency and accessibility pass, not a visual redesign or shadcn adoption pass.

---

## Problem Frame

The first overlay slice proved a local `ActionOverlay` primitive for `SkipReviewModal` and `SoftBlockModal`. Three nearby blocking overlays still hand-roll the same scrim/panel/dialog shape: the Home resume prompt, the schema-blocked reload prompt, and the Run end-session confirm. Keeping those hand-rolled leaves focus behavior, Escape behavior, and surface styling easier to drift.

---

## Requirements Trace

- R1. Migrate the remaining obvious blocking overlays to `ActionOverlay`: `ResumePrompt`, `SchemaBlockedOverlay`, and Run end-session confirm.
- R2. Preserve current product behavior, route behavior, callbacks, copy, and button ordering.
- R3. Preserve the safe-primary/default-focus contract: `Reopen session`, `Keep session`, `Reload`, and `Go back` should be the initial focus target in their respective states.
- R4. Preserve or improve accessible modal semantics: `role`, `aria-modal`, labelled title, focus trap, focus restore, and Escape behavior where a safe dismissal exists.
- R5. Do not install shadcn, add bottom-sheet behavior, change app data/domain logic, or redesign overlay visuals.

---

## Scope Boundaries

- Do not add `components.json`, Radix, Vaul, or shadcn UI files.
- Do not change `ActionOverlay` into a broad modal framework beyond what this migration needs.
- Do not change the two-step discard behavior in `ResumePrompt`.
- Do not change schema-blocked sticky-state behavior or reload semantics.
- Do not change timer, run-flow, session-completion, or review behavior.
- Do not migrate non-blocking details/disclosures in this pass.

---

## Context & Research

### Relevant Code and Patterns

- `app/src/components/ui/ActionOverlay.tsx` owns the shared overlay contract from the prior pass.
- `app/src/components/SkipReviewModal.tsx` and `app/src/components/SoftBlockModal.tsx` are the newly migrated examples to mirror.
- `app/src/components/ResumePrompt.tsx` hand-rolls `role="dialog"` and a two-step discard state.
- `app/src/components/SchemaBlockedOverlay.tsx` hand-rolls `role="alertdialog"` with a wider `max-w-[390px]` panel.
- `app/src/screens/RunScreen.tsx` hand-rolls a bottom-aligned end-session confirm with safe-primary-first ordering.

### Institutional Learnings

- Local primitives are the app convention; shadcn is a reference source here, not the visual source of truth.
- Destructive or blocking decisions should remain structurally distinct and keyboard/screen-reader reachable.
- Courtside UI should avoid new chrome and preserve large, obvious tap targets.

### External References

- The first overlay pass already used shadcn Dialog/AlertDialog and WAI-ARIA modal dialog guidance as the interaction reference.

---

## Key Technical Decisions

- Reuse `ActionOverlay` directly for centered overlays and allow layout overrides for Run's bottom-aligned confirm and SchemaBlocked's wider panel.
- Keep Run's end-session confirm bottom-aligned for thumb reach and active-session context, but centralize role/focus/Escape semantics through `ActionOverlay`.
- Add focused tests around the behaviors that were not previously guaranteed: initial focus, focus trapping, Escape dismissal, and `alertdialog` preservation.
- Keep the migration call-site-local. No new overlay registry, provider, route, or state management layer.

---

## Open Questions

### Resolved During Planning

- Should this pass migrate bottom sheets or install shadcn Drawer? No. Run's existing bottom-aligned confirm can use `ActionOverlay` layout overrides without adding Drawer/Vaul.
- Should the schema-blocked prompt dismiss on Escape? No. It has no safe dismissal; the only recovery action is reload.

### Deferred to Implementation

- Exact test setup for Run end-session confirm can use the existing RunScreen test harness or a narrow new test, depending on the available mocked controller patterns.

---

## Implementation Units

- [x] U1. **Migrate ResumePrompt**

**Goal:** Replace the hand-rolled resume overlay shell with `ActionOverlay` while preserving the two-step discard flow.

**Requirements:** R1, R2, R3, R4, R5

**Dependencies:** None

**Files:**

- Modify: `app/src/components/ResumePrompt.tsx`
- Test: `app/src/components/__tests__/ResumePrompt.test.tsx`

**Approach:**

- Use `ActionOverlay` with title `Session in progress` and existing session name as description.
- Preserve the paused-at card and two-step discard content.
- Mark `Reopen session` as initial focus in the default state and `Keep session` as initial focus in the discard-confirm state.
- Add or extend tests for dialog semantics, callback behavior, initial focus, focus trap, and focus restoration if a direct component test does not already exist.

**Patterns to follow:**

- `app/src/components/SkipReviewModal.tsx`
- `app/src/components/__tests__/SkipReviewModal.test.tsx`

**Test scenarios:**

- Happy path: resume state renders as a labelled dialog and `Reopen session` calls `onResume`.
- Happy path: tapping `Discard` switches to the confirm state without calling `onDiscard`.
- Happy path: confirm state focuses `Keep session` as the safe default and `Yes, discard session` calls `onDiscard`.
- Edge case: Tab/Shift+Tab remain trapped inside the overlay in both states.
- Integration: unmount restores focus to the opener.

**Verification:**

- Resume behavior is unchanged while focus behavior is centralized through `ActionOverlay`.

---

- [x] U2. **Migrate SchemaBlockedOverlay**

**Goal:** Replace the hand-rolled schema-blocked overlay shell with `ActionOverlay` while preserving alertdialog and reload-only behavior.

**Requirements:** R1, R2, R3, R4, R5

**Dependencies:** None

**Files:**

- Modify: `app/src/components/SchemaBlockedOverlay.tsx`
- Test: `app/src/components/__tests__/SchemaBlockedOverlay.test.tsx`

**Approach:**

- Use `ActionOverlay` with `role="alertdialog"`, existing title/body copy, and `panelClassName` to preserve max-width and vertical rhythm.
- Mark `Reload` as initial focus.
- Do not pass an Escape dismiss handler because no safe dismissal exists.
- Preserve sticky blocked-state subscription behavior.

**Patterns to follow:**

- `app/src/components/SoftBlockModal.tsx`
- `app/src/components/ui/ActionOverlay.tsx`

**Test scenarios:**

- Happy path: overlay remains hidden until schema blocked state is emitted.
- Happy path: emitted blocked state renders `role="alertdialog"` and the existing copy.
- Happy path: `Reload` receives initial focus and calls `onReload`.
- Edge case: Escape does not dismiss or call reload.
- Integration: sticky pre-mount emit still renders the alertdialog.

**Verification:**

- Schema-blocked behavior and reload recovery stay unchanged.

---

- [x] U3. **Migrate Run end-session confirm**

**Goal:** Move the Run-screen bottom-aligned end-session confirm onto `ActionOverlay` without changing run behavior.

**Requirements:** R1, R2, R3, R4, R5

**Dependencies:** None

**Files:**

- Modify: `app/src/screens/RunScreen.tsx`
- Test: `app/src/screens/__tests__/RunScreen.run-face.test.tsx` or a focused RunScreen test file

**Approach:**

- Use `ActionOverlay` with layout overrides for bottom alignment (`items-end`, `pb-8`, `max-w-[390px]`, rounded `[16px]`).
- Preserve copy for wrap versus non-wrap blocks.
- Mark `Go back` as initial focus.
- Pass `handleEndSessionCancel` as the Escape dismissal path.
- Preserve `End session` callback behavior.

**Patterns to follow:**

- Existing end-session confirm block in `app/src/screens/RunScreen.tsx`
- `app/src/components/SoftBlockModal.tsx`

**Test scenarios:**

- Happy path: triggering end-session confirm renders a labelled dialog with existing copy.
- Happy path: `Go back` cancels and is the initial focus target.
- Happy path: `End session` invokes the existing confirm path.
- Edge case: Escape cancels the confirm rather than ending the session.
- Edge case: Tab remains trapped between `Go back` and `End session`.

**Verification:**

- Run-screen tests prove behavior parity and improved overlay focus semantics.

---

- [x] U4. **Sync docs and validation**

**Goal:** Keep routing docs aligned and verify the second overlay pass.

**Requirements:** R5

**Dependencies:** U1, U2, U3

**Files:**

- Modify: `docs/catalog.json`
- Modify: `docs/plans/2026-05-02-016-feat-action-overlay-consistency-pass-plan.md`

**Approach:**

- Register this plan in `docs/catalog.json`.
- Mark the plan complete after implementation and verification.
- Run focused component tests, app lint/build, formatting, agent-doc validation, and one phone-width browser sanity check.

**Test scenarios:**

- Test expectation: none -- docs routing only, covered by validation.

**Verification:**

- App and docs validation pass, and the migrated overlays remain visually consistent at phone width.

---

## System-Wide Impact

- **Interaction graph:** Existing overlay callbacks stay at their call sites; shared modal keyboard behavior moves into `ActionOverlay`.
- **Error propagation:** No new domain/service errors are introduced.
- **State lifecycle risks:** Resume two-step local state and schema-blocked sticky state must survive the shell migration.
- **API surface parity:** This pass makes the obvious blocking overlays consistent but leaves future bottom-sheet quick actions for later.
- **Integration coverage:** RunScreen tests cover the active-session confirm path; component tests cover modal focus behavior.
- **Unchanged invariants:** Routes, Dexie schema, generated plans, session assembly, timer mechanics, and review semantics remain unchanged.

---

## Risks & Dependencies

| Risk                                                                  | Mitigation                                                                          |
| --------------------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| Resume two-step discard accidentally makes destructive action easiest | Mark `Keep session` as initial focus in confirm state and test it.                  |
| SchemaBlocked gains an unsafe dismissal                               | Do not pass `onDismiss`; test Escape does not reload or dismiss.                    |
| Run confirm loses bottom thumb-zone placement                         | Use `ActionOverlay` layout overrides and visually verify at phone width.            |
| Tests overfit to implementation details                               | Assert user-visible roles, names, focus, and callbacks rather than class internals. |

---

## Documentation / Operational Notes

- This completes the local overlay consistency pass that naturally followed the shadcn-informed `ActionOverlay` primitive.
- Future shadcn/Vaul Drawer exploration should be reserved for active-run quick actions, not blocking confirmations.

---

## Sources & References

- **Origin document:** `docs/plans/2026-05-02-015-feat-action-overlay-primitive-plan.md`
- Related ideation: `docs/ideation/2026-05-02-shadcn-courtside-overlay-ideation.md`
- Related code: `app/src/components/ui/ActionOverlay.tsx`
- Related code: `app/src/components/ResumePrompt.tsx`
- Related code: `app/src/components/SchemaBlockedOverlay.tsx`
- Related code: `app/src/screens/RunScreen.tsx`
