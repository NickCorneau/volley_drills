---
id: setup-screen-default-path-polish-plan-2026-05-04
title: "feat: Polish setup default path"
type: feat
status: complete
stage: validation
summary: "Completed plan for adding an optional Focus cue, clearer wall/fence nearby copy, and focused setup tests without changing setup flow."
date: 2026-05-04
origin: docs/brainstorms/2026-05-04-setup-screen-default-path-polish-requirements.md
---

# feat: Polish setup default path

## Overview

Make the build-ready setup screen feel calmer and more intentional after Focus moved onto the page. The implementation keeps the one-screen setup and existing defaults, marks Focus as optional tuning, and clarifies the conditional wall/fence follow-up copy.

---

## Problem Frame

The setup screen now defaults to a ready session: Solo, Net yes, 15 min, and Recommended focus. That is good for the low-typing courtside flow, but four selected chips can make the screen feel like all rows require review. The product fix is not a larger redesign; it is a small clarity pass that tells the player which choice is optional and keeps the no-net follow-up practical.

---

## Requirements Trace

- R1. Focus must read as optional tuning while remaining visible on setup.
- R2. The build-ready default path must remain quiet, with no enabled-footer helper copy or new step.
- R3. The wall/fence follow-up must remain subordinate under Net and use clearer equipment-oriented copy.
- R4. The polish must not strengthen selected chip visuals, force Focus into required-row visual weight, or broaden D127 typography changes.
- R5. Existing setup behavior must remain intact: default selections, direct Safety navigation, non-recommended focus persistence, and wall gating for Solo + no net.

**Origin actors:** A1 (Courtside player), A2 (Downstream implementing agent)

**Origin flows:** F1 (Default build-ready setup), F2 (Solo with no net)

**Origin acceptance examples:** AE1 (covers R1, R2, R4), AE2 (covers R3, R5), AE3 (covers R5)

---

## Scope Boundaries

- Do not add a setup summary bar, readiness receipt, or dynamic CTA copy.
- Do not hide Focus behind another control or reintroduce a separate tuning stop for this path.
- Do not change global `ToggleChip` styling.
- Do not make broad setup typography changes or claim field readability improvements.

---

## Context & Research

### Relevant Code and Patterns

- `app/src/screens/SetupScreen.tsx` owns the setup sections, default state, conditional wall follow-up, and footer hint behavior.
- `app/src/screens/__tests__/SetupScreen.test.tsx` already covers the default selections, direct Safety navigation, wall gating, and focus persistence behavior.
- `app/src/screens/ReviewScreen.tsx` uses the existing quiet `(optional)` label pattern in `Short note (optional)`.
- `app/src/components/ui/ToggleChip.tsx` should remain unchanged; the selected/unselected visual treatment is already tokenized.

### Institutional Learnings

- `docs/research/brand-ux-guidelines.md` keeps setup typography narrow and token-bound under D127.
- `docs/research/japanese-inspired-visual-direction.md` favors restraint, grouping, and one focal action over louder visual emphasis.
- `docs/plans/2026-04-30-001-feat-pre-run-simplification-plan.md` established that setup should ask only what changes today.

### External References

- External UX grounding supports visible small-choice groups, sensible defaults, progressive disclosure for conditional details, and large mobile tap targets. No new dependency or design-system change is needed.

---

## Key Technical Decisions

- Express Focus optionality in the heading, not as another helper line: this adds clarity without increasing vertical density.
- Rename only the nested wall/fence prompt: this improves the no-net path without promoting the follow-up to a section heading.
- Preserve all existing state and navigation logic: the polish is presentation/copy only.

---

## Open Questions

### Resolved During Planning

- Optional cue placement: use a quiet inline `(optional)` span in the Focus heading, matching the existing Review label pattern.

### Deferred to Implementation

- Exact assertion shape for the optional heading: implementation should choose the least brittle test query that still proves the cue is visible.

---

## Implementation Units

- [x] U1. **Clarify setup copy**

**Goal:** Mark Focus as optional tuning and make the wall/fence follow-up more practical while preserving the current layout and chip behavior.

**Requirements:** R1, R2, R3, R4

**Dependencies:** None

**Files:**
- Modify: `app/src/screens/SetupScreen.tsx`
- Test: `app/src/screens/__tests__/SetupScreen.test.tsx`

**Approach:**
- Update the Focus heading to include a quiet optional marker using the existing typography pattern for optional label spans.
- Update the conditional wall/fence prompt copy to `Wall or fence nearby?`.
- Do not alter `ToggleChip`, selected-state classes, footer helper behavior, default state, or navigation.

**Patterns to follow:**
- `app/src/screens/ReviewScreen.tsx` optional label styling.
- Existing nested wall/fence block in `app/src/screens/SetupScreen.tsx`.

**Test scenarios:**
- Covers AE1. Happy path: fresh onboarding setup shows Focus with an optional cue, keeps Recommended selected, and leaves `Build session` enabled with no incomplete helper copy.
- Covers AE2. Happy path: Solo + Net no reveals the nested `Wall or fence nearby?` prompt and still shows the wall-required incomplete hint until answered.
- Covers AE3. Integration: selecting Passing focus and building still persists `sessionFocus: "pass"` in the current draft.

**Verification:**
- Setup polish is visible in the setup screen tests without changing existing flow behavior.

---

## System-Wide Impact

- **Interaction graph:** No navigation or builder flow changes; setup still saves a draft and routes to Safety.
- **Error propagation:** Unchanged.
- **State lifecycle risks:** Low; no new persisted state.
- **API surface parity:** No exported type or component contract changes.
- **Integration coverage:** Existing setup integration-style tests through Dexie draft persistence remain the right coverage.
- **Unchanged invariants:** `Recommended` focus is not persisted as a custom `sessionFocus`; non-recommended focus still is.

---

## Risks & Dependencies

| Risk | Mitigation |
|------|------------|
| Optional marker adds visual clutter | Keep it inline and muted, not a new helper line. |
| Copy-only change misses behavioral regression | Update existing setup tests around visible copy and draft persistence. |

---

## Documentation / Operational Notes

- The ideation and requirements documents for this pass are the durable rationale; no app README update is needed for the UI copy change.

---

## Sources & References

- **Origin document:** [docs/brainstorms/2026-05-04-setup-screen-default-path-polish-requirements.md](../brainstorms/2026-05-04-setup-screen-default-path-polish-requirements.md)
- Related ideation: [docs/ideation/2026-05-04-setup-screen-default-path-polish-ideation.md](../ideation/2026-05-04-setup-screen-default-path-polish-ideation.md)
- Related code: `app/src/screens/SetupScreen.tsx`
- Related tests: `app/src/screens/__tests__/SetupScreen.test.tsx`
