---
id: run-face-v1-plan-2026-05-02
title: "feat: Implement Run Face v1"
status: active
stage: validation
type: plan
summary: "Implementation plan for Run Face v1: deterministic current-cue selection, one-cue Run body hierarchy, cockpit/state refinement, focused accessibility tests, and phone-width visual verification."
authority: "Implementation plan for docs/brainstorms/2026-05-02-active-session-glance-system-requirements.md."
date: 2026-05-02
origin: docs/brainstorms/2026-05-02-active-session-glance-system-requirements.md
---

# feat: Implement Run Face v1

## Overview

Implement Run Face v1: a bounded presentation redesign of the existing Run route so an athlete can answer "what now?" in a five-second glance. The work stays inside the current `ScreenShell` Run layout and keeps the pinned cockpit footer, timer behavior, route flow, execution model, drill assembly, and Dexie schema unchanged.

The implementation should treat this as a `D130` founder-use design pass, not a broad override of the earlier `D127` deferral. Completion requires focused tests plus phone-width screenshots/dogfood verification before the design is considered ready.

---

## Problem Frame

The current Run screen has strong foundations: a pinned cockpit footer, large timer digits, block controls, structured segment lists, and quiet cue styling. It still asks the athlete to parse multiple similarly weighted surfaces during movement: drill name, instructions, segment list, coaching cue, timer, controls, wake-lock hints, and block count.

Run Face v1 should make the active surface calmer and more decisive by prioritizing one current cue, one dominant live reading, quiet session position, and a primary UI control while keeping full instructions reachable inline.

---

## Requirements Trace

- R1. Keep one dominant live reading for the timed Run blocks currently supported by the app.
- R2. Surface exactly one primary current-cue zone using deterministic existing-field precedence.
- R3. Make the primary UI control visible without hunting while keeping the athlete's physical action owned by the cue.
- R4. Show quiet session position through existing block count plus optional current/next label only if screenshots prove it helps.
- R5. Keep full drill instructions and full cue text available inline within Run.
- R6. Preserve structured segment support, active state, and accessibility expectations.
- R7. Make paused, warning, and error states distinct without adding alarmist styling or persisted shortened/swapped execution state.
- R8. Keep wake-lock/audio reliability guidance available without competing with the live action hierarchy.
- R9. Do not add a new route, data model, timer behavior, drill assembly behavior, or coaching/rationale system.
- R10. Preserve compact mobile typography except for glance-critical Run elements.
- R11. Preserve the restrained athlete-tool style.

**Origin actors:** A1 solo athlete courtside, A2 pair leader courtside, A3 returning user, A4 planner/implementer.

**Origin flows:** F1 normal timed block glance, F2 long instruction or cue, F3 structured segment block, F4 pause or recovery state.

**Origin acceptance examples:** AE1 normal timed drill, AE2 long instruction, AE3 structured segment block, AE4 paused/warning state, AE5 scope control, AE6 pair set-down use, AE7 mobile/accessibility states, AE8 short-phone dense states.

---

## Scope Boundaries

- Modify Run presentation and adjacent display helpers only.
- Preserve existing route flow, timer mechanics, run controller semantics, Dexie schema, session plan assembly, and execution log persistence.
- Do not introduce generated cues, NLP, an actionability classifier, a new cue taxonomy, new stored cue fields, or a coaching/rationale pipeline.
- Do not add dashboard chrome, animated rings, motivational AI-coach copy, dense stats, a full done/current/next rail, or broad app-wide typography changes.
- Do not redesign preroll, Transition, Check, Review, or Home as part of this plan.

### Deferred to Follow-Up Work

- Haptic/audio status pairing: revisit after the visible hierarchy is proven.
- A broader training object visual system: let it emerge from concrete screens after Run Face v1 is dogfooded.
- Pair-specific cue authoring improvements: only revisit if dogfood shows existing authored fields cannot preserve role clarity.

---

## Context & Research

### Relevant Code and Patterns

- `app/src/screens/RunScreen.tsx` owns the Run route composition using `ScreenShell.Header`, `ScreenShell.Body`, and `ScreenShell.Footer`.
- `app/src/screens/run/useRunController.ts` exposes current block, timer, run error, wake lock, active segment, and control handlers. It should not gain new product policy unless a tiny presentation value is cleaner than deriving it in `RunScreen`.
- `app/src/components/BlockTimer.tsx` owns the visible timer, progress bar, paused state copy, and current `role="timer"` behavior.
- `app/src/components/RunControls.tsx` owns the active/paused cockpit controls and touch-target layout.
- `app/src/components/run/SegmentList.tsx` already carries `aria-current="step"` and a polite "Now:" live announcer for active segments. Segment rows are non-interactive and should remain the current-cue zone for segmented blocks.
- `docs/specs/m001-courtside-run-flow.md` already states the active Run screen should show one cue, dominant timer/target, phase/progress, and primary controls in one glance.

### Institutional Learnings

- `docs/research/outdoor-courtside-ui-brief.md` and `docs/design/reviews/2026-04-26-agent-ux-review.md` emphasize outdoor glanceability, one focal zone, and real mobile verification.
- `docs/research/local-first-pwa-constraints.md` and `docs/research/courtside-timer-patterns.md` frame wake lock/audio as best-effort platform behavior that needs plain user-facing copy.
- `.cursor/rules/component-patterns.mdc` and `.cursor/rules/testing.mdc` reinforce shared primitives, screen/controller separation, accessibility semantics, and narrow verification.

### External References

- None used. Local product/design requirements and existing app patterns are sufficient for this bounded UI plan.

---

## Key Technical Decisions

- **Cue selection is a pure presentation helper for non-segmented blocks.** Add a small deterministic helper under `app/src/screens/run/` so non-segmented cue precedence is testable without touching session assembly. Segmented blocks stay owned by `SegmentList`.
- **Segmented blocks use the active segment row as the current cue.** Do not render a competing primary cue zone or duplicate screen-reader "now" announcements when `SegmentList` is active.
- **Long detail uses inline disclosure first.** Full instructions and cue text remain reachable inline in the Run body; disclosure is preferred over a bottom sheet or route change.
- **Timer stays in the pinned cockpit.** Do not duplicate timer digits above the fold. If screenshots show the cockpit is visually weakened in a required state, adjust footer/body hierarchy while keeping one dominant timer surface and one `role="timer"`.
- **Controls stay behaviorally unchanged.** This plan can adjust layout, hierarchy, copy, and ARIA behavior, but not what `Pause`, `Resume`, `Next`, `Swap`, `Shorten`, `Skip block`, or `End session` do.

---

## Open Questions

### Resolved During Planning

- Should primary cue text always use the first ` · ` clause from `currentBlock.coachingCue`? Yes for the primary glance cue; the full cue remains available in detail.
- Should pair role clarity override cue precedence? No for v1. Use existing authored fields and verify representative pair drills; do not add pair-specific cue derivation.
- Should segmented blocks render a separate primary cue? No. The active `SegmentList` row is the current-cue zone.
- Should Run Face v1 redesign preroll? No. Verify preroll still works visually, but keep it out of scope.

### Deferred to Implementation

- Exact class names and component extraction boundaries can be decided while editing `RunScreen.tsx`.
- Whether the optional current/next label is needed should be decided from an early screenshot checkpoint after U2/U3, before hardening tests.
- The final long-detail disclosure wording should be tuned against the rendered screen and tests.

---

## High-Level Technical Design

> *This illustrates the intended approach and is directional guidance for review, not implementation specification. The implementing agent should treat it as context, not code to reproduce.*

| Block shape | Primary current cue | Full detail access | A11y rule |
|---|---|---|---|
| Segmented block | Active `SegmentList` row | Full drill instructions and block-level cue remain secondary inline detail | Keep one "Now:" announcer from `SegmentList` |
| Non-segmented with cue | Existing cue if compact; otherwise first ` · ` cue clause | Full cue plus instructions in inline disclosure | Primary cue and disclosure have distinct labels |
| Non-segmented without cue | First short instruction line or drill name | Full instructions in inline disclosure | Mechanical fallback only; no action parsing |
| Paused | Preserve current cue context | Detail remains reachable | Resume is the primary UI control |
| Warning/error | Timer/control context remains visible | Recovery guidance is visible but calm | Copy points to available recovery path |

---

## Implementation Units

- [x] U1. **Add current-cue selection helper**

**Goal:** Make current-cue selection deterministic, display-only, and testable before changing the Run screen.

**Requirements:** R2, R6, R9, AE1, AE3, AE6

**Dependencies:** None

**Files:**
- Create: `app/src/screens/run/currentCue.ts`
- Test: `app/src/screens/run/__tests__/currentCue.test.ts`
- Reference: `app/src/types/drill.ts`

**Approach:**
- Define a display helper for non-segmented blocks only. `RunScreen` should suppress the competing cue zone for segmented blocks and leave `SegmentList` as the cue owner.
- For non-segmented blocks, prefer `currentBlock.coachingCue`. Use it verbatim when compact enough for a glance; otherwise use the first ` · `-separated clause for the primary cue while preserving full cue detail separately.
- Pin the no-cue fallback mechanically: trim the first non-empty instruction line; use it only when it is single-line and no longer than the compact cue threshold already used for Run cue policy, otherwise fall back to `currentBlock.drillName`. Never classify whether prose is "actionable."
- Before locking truncation, audit representative pair drills. If first-clause truncation drops who-does-what meaning while the full cue is still compact, keep the full cue as primary for that block shape rather than inventing a pair-specific override.
- Do not inspect `DrillSegment.cue?`, change session assembly, or add generated labels.

**Patterns to follow:**
- `app/src/domain/runFlow.ts` for pure helper style around Run presentation math.
- `app/src/components/run/SegmentList.tsx` for explicitly documenting intentionally unused `DrillSegment.cue?`.

**Test scenarios:**
- Happy path: segmented block bypasses the helper and does not return a competing text cue.
- Happy path: compact coaching cue with ` · ` remains intact when truncation would drop role/action meaning; long coaching cue returns the first clause as primary and preserves full cue detail.
- Edge case: whitespace-only cue falls through to instruction or drill name.
- Edge case: multiline or over-threshold instructions fall back to drill name rather than parsing.
- Edge case: short instruction excerpt is used only when it satisfies the helper's mechanical trim/length rule.

**Verification:**
- Cue precedence can be changed only through focused helper tests.
- No tests require new drill assembly data or stored cue fields.

---

- [x] U2. **Restructure the Run body around one cue zone**

**Goal:** Make `RunScreen` present a single current-cue zone by default while keeping full instructions available inline.

**Requirements:** R2, R5, R6, R9, R10, R11, F1, F2, F3, AE1, AE2, AE3

**Dependencies:** U1

**Files:**
- Modify: `app/src/screens/RunScreen.tsx`
- Modify: `app/src/components/run/SegmentList.tsx` only if needed for labels or ownership semantics
- Test: `app/src/screens/__tests__/RunScreen.coaching-cues-default.test.tsx`
- Test: `app/src/screens/__tests__/RunScreen.segments.test.tsx`
- Test: `app/src/screens/__tests__/RunScreen.rationale-placement.test.tsx`

**Approach:**
- Replace the current independent instruction paragraph plus cue aside with a Run Face body hierarchy: drill identity, one current-cue zone, then secondary detail.
- For segmented blocks, let `SegmentList` remain the visible cue zone and avoid rendering a second primary cue.
- For segmented blocks, keep full drill instructions and block-level cue available as secondary inline detail below or adjacent to the segment list.
- For non-segmented blocks, render the helper's primary cue as the focal text and make full instructions/full cue reachable through inline disclosure.
- Disclosure contract: collapsed by default, trigger copy should read as plain utility such as `Full instructions`, expanded content stays in the scrollable Run body, the trigger exposes an expanded/collapsed state, and focus remains on the trigger after toggling.
- Keep the body scrollable and the footer pinned; do not add a bottom sheet or route.
- Update the existing "full cue always visible, no toggle" regression intentionally so it reflects the new inline-detail contract.

**Patterns to follow:**
- `RunScreen.tsx` existing `ScreenShell.Body` / `Footer` split.
- `SegmentList.tsx` no-motion, non-interactive list semantics.
- Recent Home polish pattern: one primary action/context, quiet secondary detail.

**Test scenarios:**
- Covers AE1. Non-segmented block shows one primary cue, timer/control footer remains present, and full detail is reachable.
- Covers AE2. Long instruction and long cue do not both render as primary text on initial view, but each is reachable through the inline disclosure interaction.
- Covers AE3. Segmented block has exactly one "now" signal and preserves `aria-current="step"`.
- Edge case: missing cue/instructions still renders the drill-name fallback without crashing.
- Regression: rationale text stays absent from Run body.

**Verification:**
- `RunScreen` no longer presents instruction, segment list, and coaching cue as competing equal-weight blocks.
- Existing segment behavior remains accessible and visually intact.

---

- [x] U3. **Refine cockpit, state, and recovery presentation**

**Goal:** Keep the pinned cockpit dominant and make paused, warning, and error states clear without changing control behavior.

**Requirements:** R1, R3, R4, R7, R8, R9, F4, AE4, AE8

**Dependencies:** U2

**Files:**
- Modify: `app/src/screens/RunScreen.tsx`
- Modify: `app/src/components/BlockTimer.tsx`
- Modify: `app/src/components/RunControls.tsx`
- Test: `app/src/screens/__tests__/RunScreen.preroll-hint.test.tsx`
- Test: `app/src/screens/__tests__/RunScreen.terminal-redirect.test.tsx`
- Test: `app/src/screens/__tests__/RunScreen.run-face-state.test.tsx`

**Approach:**
- Keep timer/progress in `ScreenShell.Footer` as the single live reading.
- Make the distinction between athlete training cue and primary UI control clear in markup and copy.
- Preserve existing control order and actions, but adjust wrapping or grouping if dense paused states threaten touch targets or legibility.
- Enumerate the current warning/error sources before editing copy: wake-lock guidance, run persistence errors, swap no-alternate errors, and end-session errors. Ensure each message points only to an available recovery path under current behavior.
- Review `role="timer"` and `aria-live` behavior so visual updates remain useful without causing frequent screen-reader announcements.
- Keep shorten/swap as existing actions or transient local feedback only; do not add execution state.
- Add an early screenshot checkpoint after U2/U3 for 360px and 390px running, long-detail, segmented, and dense paused states. Any screenshot-driven current/next label or layout adjustment should land before U4 hardens tests.

**Patterns to follow:**
- `BlockTimer.tsx` existing timer face and paused copy.
- `RunControls.tsx` existing active/paused control split.
- `StatusMessage` for calm error/warning presentation when suitable.

**Test scenarios:**
- Covers AE4. Paused state visibly reads as paused, exposes Resume as primary, and preserves cue context.
- Error path: simulated `runError` displays calm recovery copy that names only visible or possible recovery actions without hiding timer/control context.
- Warning path: wake-lock guidance remains secondary while the timer/control hierarchy stays readable.
- Edge case: paused state with Swap, Shorten, Skip block, and End session remains usable at narrow width.
- Accessibility: timer semantics do not produce repeated assertive announcements.

**Verification:**
- No controller behavior changes are needed to satisfy the unit.
- The cockpit remains visually dominant across running, paused, warning, and error states.

---

- [x] U4. **Add focused Run Face RTL and accessibility coverage**

**Goal:** Lock the new Run Face behavior with narrow, implementation-facing tests before relying on screenshot review.

**Requirements:** R2, R3, R5, R6, R7, R8, R10, AE1, AE2, AE3, AE4, AE7, AE8

**Dependencies:** U1, U2, U3

**Files:**
- Create or modify: `app/src/screens/__tests__/RunScreen.run-face.test.tsx`
- Modify: `app/src/screens/__tests__/RunScreen.coaching-cues-default.test.tsx`
- Modify: `app/src/screens/__tests__/RunScreen.segments.test.tsx`
- Modify: `app/e2e/accessibility.spec.ts` only if the existing accessibility flow can cover Run states without becoming broad

**Approach:**
- Prefer RTL tests for semantic behavior and cue/detail contracts.
- Add assertions for exactly one primary cue region in non-segmented blocks and no duplicate active cue in segmented blocks.
- Add keyboard/focus-order coverage for inline disclosure and primary controls.
- Cover run-error presentation through RTL with a mocked controller or equivalent deterministic seam; do not require Playwright to trigger persistence failures.
- Add smoke coverage that the Safety affordance remains reachable from Run and that the end-session dialog remains named, modal, focusable, and readable when the Run Face body changes.
- Keep e2e accessibility coverage narrow; if `accessibility.spec.ts` becomes too broad, create a dedicated Run Face e2e spec in U5.

**Patterns to follow:**
- Existing `RunScreen.*.test.tsx` fixtures and render helpers.
- `.cursor/rules/testing.mdc` lowest-useful-tier guidance.

**Test scenarios:**
- Covers AE1/AE2. Starting a normal timed drill exposes current cue, full detail disclosure, timer, and primary UI control.
- Covers AE3. Segment list active row is the cue owner and preserves the polite active-segment announcement.
- Covers AE4. Pause and error states have accessible labels/copy and do not obscure recovery actions.
- Covers AE7. Disclosure trigger, controls, and state labels have logical accessible names and focus order.
- Modal/accessibility path: end-session dialog has a named heading, modal semantics or equivalent tested behavior, usable focus path, and stacked actions at phone widths.
- Edge case: no hidden generated cue text appears when fields are empty.

**Verification:**
- Tests fail if future changes reintroduce competing instruction blocks or duplicate "now" announcements.
- Accessibility assertions are specific to Run Face outcomes, not broad snapshots.

---

- [x] U5. **Add phone-width visual verification for Run Face states**

**Goal:** Prove the design works at mobile widths and in dense states before declaring Run Face v1 done.

**Requirements:** R1, R3, R4, R7, R8, R10, R11, AE1, AE4, AE6, AE7, AE8

**Dependencies:** U2, U3, U4

**Files:**
- Create: `app/e2e/run-face.spec.ts`
- Use or update: `test-screenshots/`
- Reference: `app/README.md`

**Approach:**
- Add a narrow Playwright coverage path or deterministic screenshot harness for `360x640`, `390x844`, and one short-height mobile viewport that exercises the pinned cockpit/body scroll split.
- Cover required Run Face states: normal running, segmented, long-instruction collapsed and expanded detail, paused with all available controls, and wake-lock warning.
- Treat preroll and end-session modal as smoke checks if touched by layout changes, not completion gates for Run Face v1. Keep run-error visual proof in RTL unless implementation adds a sanctioned deterministic browser fixture.
- Include a pair set-down review note in the plan completion evidence: representative pair drill, phone roughly 1-3 m away, outdoor-light assumption, both-player role/action readability.
- Keep generated screenshot artifacts review-oriented; do not make visual polish depend on brittle pixel-perfect assertions unless the repo already has such a pattern.

**Patterns to follow:**
- Existing `app/e2e/accessibility.spec.ts` for browser-test shape.
- Existing `test-screenshots/ui-pass-*.png` convention for manual UI proof.

**Test scenarios:**
- Covers AE6. Pair drill screenshot/dogfood check preserves who-does-what meaning from existing authored fields.
- Covers AE7. 360px, 390px, and short-height mobile states preserve touch targets, focus order, accessible labels, and non-overlapping footer controls.
- Covers AE8. Short-phone dense state keeps cockpit pinned and body/detail scroll usable.
- Visual happy path: normal running state reads as one clear live face.
- Visual edge case: long instruction detail remains reachable without becoming the focal zone.

**Verification:**
- The implementation is not considered complete until screenshots and pair set-down notes demonstrate the current cue, timer/progress, and primary UI control are legible.
- Any screenshot-discovered need for a current/next label or cockpit hierarchy adjustment is handled as implementation evidence, not assumed up front.

---

## System-Wide Impact

- **Interaction graph:** Run route presentation changes affect the active session screen only. Transition, Check, Review, and Home routes should remain behaviorally unchanged.
- **Error propagation:** Existing `runError` handling remains the source of error copy; this plan only changes placement/hierarchy.
- **State lifecycle risks:** Shorten/swap stay local runtime actions; no new persisted execution state is introduced.
- **API surface parity:** No external API, route contract, database schema, or generated-plan contract changes.
- **Integration coverage:** Run RTL tests plus a narrow Playwright visual pass are needed because unit tests alone will not prove mobile hierarchy, footer overlap, or pair set-down legibility.
- **Unchanged invariants:** Timer behavior, wake-lock best-effort behavior, `ExecutionLog` persistence, segment pacing math, and route transitions remain unchanged.

---

## Risks & Dependencies

| Risk | Mitigation |
|------|------------|
| Cue helper accidentally becomes a content-generation system | Keep it pure, deterministic, scoped to non-segmented blocks, and sourced only from existing fields; test fallbacks explicitly. |
| Segment blocks show duplicate "now" signals | Treat `SegmentList` as the cue owner for segmented blocks and test for no duplicate cue zone. |
| Inline disclosure hides too much or adds friction | Start with disclosure but preserve secondary text fallback; verify on phone screenshots. |
| Dense paused controls overflow at 360px | Include all-control paused state in visual verification and adjust layout only if evidence requires it. |
| Timer accessibility becomes noisy | Review `role="timer"` / live-region behavior and add focused accessibility assertions. |
| Pair set-down check passes under ideal conditions only | Use representative outdoor-light conditions, roughly 1-3 m distance, and a pair drill with role/action meaning. |
| Visual checks discover hierarchy issues after tests are hardened | Run an early screenshot checkpoint after U2/U3, then update tests only after screenshot-driven presentation decisions settle. |

---

## Documentation / Operational Notes

- Update `app/README.md` only if Run Face v1 changes the documented app architecture, verification surface, or deferred Run-density note.
- Capture a durable learning after implementation if the cue-selection or screenshot-review pattern proves useful beyond Run.
- Keep screenshot evidence in the existing review-oriented screenshot location unless the implementation establishes a more formal visual regression path.

---

## Sources & References

- **Origin document:** [docs/brainstorms/2026-05-02-active-session-glance-system-requirements.md](../brainstorms/2026-05-02-active-session-glance-system-requirements.md)
- Related spec: [docs/specs/m001-courtside-run-flow.md](../specs/m001-courtside-run-flow.md)
- Related component: `app/src/screens/RunScreen.tsx`
- Related controller: `app/src/screens/run/useRunController.ts`
- Related components: `app/src/components/BlockTimer.tsx`, `app/src/components/RunControls.tsx`, `app/src/components/run/SegmentList.tsx`
- Related tests: `app/src/screens/__tests__/RunScreen.coaching-cues-default.test.tsx`, `app/src/screens/__tests__/RunScreen.segments.test.tsx`, `app/e2e/accessibility.spec.ts`
