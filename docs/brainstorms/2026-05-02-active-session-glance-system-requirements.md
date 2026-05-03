---
id: active-session-glance-system-requirements-2026-05-02
title: "Requirements: Active Session Glance System"
type: requirements
status: active
stage: validation
authority: "Brainstorm output for the selected survivor from docs/ideation/2026-05-02-calm-courtside-ux-style-ideation.md. Defines the bounded Run Face v1 product shape for planning; does not authorize a full session-flow redesign."
summary: "Defines Run Face v1: a bounded active-session redesign that makes Run answer 'what now?' in a five-second glance by prioritizing one dominant live reading, one current cue, clear session position, and quiet access to full instructions. Keeps existing route/control behavior and defers broader session status systems."
last_updated: 2026-05-02
related:
  - docs/ideation/2026-05-02-calm-courtside-ux-style-ideation.md
  - docs/brainstorms/2026-04-28-per-move-pacing-indicator-requirements.md
  - docs/research/brand-ux-guidelines.md
  - docs/research/japanese-inspired-visual-direction.md
  - docs/research/outdoor-courtside-ui-brief.md
  - app/README.md
  - app/src/screens/RunScreen.tsx
decision_refs:
  - D91
  - D130
---

# Active Session Glance System - requirements

## Problem Frame

The latest Home pass reduced recurring-user cognitive load before the session starts. The highest remaining attention-cost surface is Run: once the athlete is moving, reading and interpretation become more expensive than tapping.

Run already has strong foundations: a pinned cockpit footer, large timer digits, block controls, structured segment lists for warmup/cooldown, and a quiet cue treatment. But the screen still asks the athlete to parse several similar-weight pieces of information: drill name, instructions, segment list, coaching cue, timer, controls, wake-lock hints, and block count.

Run Face v1 should make the live Run screen answer one question first: **what should I do right now?** It is a design/UX requirements pass, not a new training model, new route, or broad session-flow redesign.

This document does not silently override the `D127` deferral of broad body-scale and Run-density work. It scopes a `D130` founder-use design pass: planning may implement a bounded Run Face v1 only if it includes phone-width screenshot review and dogfood verification before calling the work complete.

---

## Actors

- A1. Solo athlete courtside: Runs a block alone, often glancing at the phone from arm's length or while tired.
- A2. Pair leader courtside: Drives the phone during a pair session while a partner waits or follows cues.
- A3. Returning user: Opens a repeated or saved session and expects the app to reduce, not increase, cognitive load.
- A4. Planner/implementer: Needs clear scope boundaries so planning does not invent a new route system or coaching model.

---

## Key Flows

- F1. Normal timed block glance
  - **Trigger:** The athlete starts a normal Run block after Safety/preroll.
  - **Actors:** A1, A3
  - **Steps:** The screen shows the current drill, a dominant live timer/progress reading, the one current cue, and the primary next action without requiring a scroll. The athlete glances, understands the action, and returns attention to training.
  - **Outcome:** The athlete can answer "what now?" within a few seconds.
  - **Covered by:** R1, R2, R3, R4

- F2. Long instruction or cue
  - **Trigger:** A block has longer courtside instructions or a longer coaching cue.
  - **Actors:** A1, A2
  - **Steps:** Run still presents one current cue or instruction as primary. Full detail remains available within the Run route through inline expansion or secondary placement, but it does not compete with the live face.
  - **Outcome:** The athlete does not lose access to instruction, but the screen is not a reading surface by default.
  - **Covered by:** R2, R5, R9

- F3. Structured segment block
  - **Trigger:** The active block has a structured segment list such as warmup or cooldown.
  - **Actors:** A1, A2
  - **Steps:** The existing segment list remains visible and preserves current/done/future state. Run Face v1 treats that segment state as part of the active cue rather than an extra dashboard area.
  - **Outcome:** The per-move pacing work remains intact and becomes easier to glance at.
  - **Covered by:** R4, R6, R9

- F4. Pause or recovery state
  - **Trigger:** The athlete pauses, swaps, shortens, or hits a runtime warning such as keep-screen-on guidance.
  - **Actors:** A1, A2
  - **Steps:** The live face changes state clearly: paused means paused, recovery action is obvious, and supporting warnings stay below the primary state.
  - **Outcome:** The athlete does not interpret a paused timer or warning as a broken session.
  - **Covered by:** R7, R8

---

## Requirements

**Live hierarchy**

- R1. Run Face v1 must have one dominant live reading: timer/progress for the timed Run blocks currently supported by the app. Do not add non-timed block support in v1.
- R2. Run Face v1 must surface exactly one primary "current cue" zone by default. Cue source precedence is: active segment label/current row when present; otherwise existing `currentBlock.coachingCue` verbatim or its first ` · `-separated clause; otherwise a bounded verbatim instruction excerpt only when the first non-empty instruction sentence is short and obviously action-shaped; otherwise drill name as the fixed fallback. Any short label must be local presentation copy from existing block fields; v1 must not add generated labels, stored cue fields, a new taxonomy, NLP, an actionability classifier, or a new coaching/rationale pipeline.
- R3. The screen must make the primary UI control visible without hunting. Existing actions can remain in the cockpit/footer pattern, but the visual hierarchy should keep the primary control legible during movement. The athlete's physical "what now?" action is owned by the current cue, not by control styling.
- R4. The screen must show session position quietly through the existing block count, with an optional current/next label only if screenshot review proves it helps. This must support orientation without adding done/current/next rail chrome or a full session dashboard.

**Instruction access and restraint**

- R5. Full drill instructions and full coaching cue text must remain available during the block, but they should be secondary to the current cue when they are long.
- R6. Existing structured segment lists must remain supported. Run Face v1 should not regress the per-move pacing indicator, its active state, or its accessibility expectations.
- R7. Paused, warning, and error states must be visually distinct from the normal running state without adding alarmist styling. Shorten and swap remain existing actions or transient local UI affordances only; v1 must not add persisted shortened/swapped execution state.
- R8. Keep-screen-on or audio reliability guidance must remain available when relevant, but it should not compete with the live action hierarchy.

**Product boundaries**

- R9. Run Face v1 must be a bounded Run-screen improvement. It must not require a new route, new data model, new timer behavior, new drill assembly behavior, or a new coaching/rationale system.
- R10. The design must preserve compact mobile typography. It should not reintroduce a broad `text-base` migration across all phone surfaces; any larger type should be limited to live, glance-critical Run elements.
- R11. The design must preserve the app's restrained style: no animated rings, dashboard chrome, motivational AI-coach copy, or dense stats during the active block unless future dogfood specifically proves the need.

---

## Acceptance Examples

- AE1. **Covers R1, R2, R3.** Given a returning user starts a normal timed drill, when the Run screen appears after preroll, then the user can identify the current training cue, remaining time/progress, and primary UI control without reading the full instruction paragraph first.
- AE2. **Covers R5, R10.** Given a drill has a long instruction paragraph, when the block is running, then the current cue remains the visual priority and the full instruction is still reachable without leaving Run.
- AE3. **Covers R4, R6.** Given the user runs a structured warmup/cooldown segment block, when a segment changes, then the current segment remains the visible "now" signal and the broader Run face does not duplicate or obscure it.
- AE4. **Covers R7, R8.** Given the timer is paused or wake-lock guidance appears, when the user glances at the phone, then the state reads as actionable recovery guidance rather than a broken timer or error state.
- AE5. **Covers R9, R11.** Given a planner scopes Run Face v1, when writing the implementation plan, then the plan stays within Run presentation/hierarchy and does not add a full session dashboard, new route, or new training model.
- AE6. **Covers R2, R3, R4.** Given a pair session with the phone set down on a bench or bag roughly 1-3 m away in outdoor-light conditions, when either player glances for what is happening now, then the visible cue preserves who does what from existing authored fields and the timer/progress plus primary UI control are legible without rereading the full instruction body.
- AE7. **Covers R3, R6, R7, R10.** Given the Run face is reviewed at 360px and 390px widths, when running, paused, segmented, long-instruction, and warning states are shown, then footer controls remain visible without overlap, touch targets remain at least 44px, focus order follows the visible control order, timer announcements do not spam assistive technology, and paused/warning/error states have accessible labels.
- AE8. **Covers R3, R5, R8.** Given a short-phone viewport with a dense state such as paused plus warning guidance, swap/shorten controls, or long instructions, when the user scrolls the Run body, then the footer cockpit remains pinned, controls do not overlap the body, and the current cue plus recovery message remain reachable without hiding the primary UI control.

---

## Success Criteria

- Phone screenshots of Run at 360px and 390px wide read as one clear live face, not a stack of similarly important text blocks.
- A pair set-down review confirms both players can read the current cue's role/action meaning, timer/progress, and primary UI control from roughly 1-3 m in outdoor-light conditions.
- A returning user can understand what to do now in about five seconds without reading multiple paragraphs.
- The Run face preserves 44px minimum touch targets, logical focus order, non-spamming timer semantics, and accessible labels for paused, warning, and error states.
- Existing timer, controls, segment list, pause, shorten, swap, skip, and end-session behavior remains intact.
- The design feels quieter and more athlete-specific, not more SaaS-like.
- A downstream planning agent can implement without inventing product behavior outside this document's scope.

---

## Scope Boundaries

- In scope: visual hierarchy, copy priority, current-cue treatment, quiet session-position context, and Run-state presentation.
- In scope: deciding how full instructions remain available when they are not the primary live cue.
- In scope: preserving and integrating the existing structured segment list into the live face.
- Out of scope: a new Run route, new Transition/Check route architecture, new timer mechanics, new Dexie data, new drill generation policy, or new coaching rationale surfaces.
- Out of scope: a full app-wide typography migration.
- Out of scope: new haptic/audio behavior. Visible hierarchy should be settled first; sensory cues can be reconsidered later.
- Out of scope: a generalized "training object visual system" across the whole app.

---

## Key Decisions

- **Selected direction:** Run Face v1, not a full session status system. This keeps the work bounded to the highest-friction active surface.
- **Primary user outcome:** "What should I do right now?" in a five-second glance.
- **Instruction posture:** Full instruction remains available inline within the Run route, but the default active face prioritizes one current cue. V1 should start with inline disclosure for long instructions; secondary text below the cue is the fallback if disclosure adds friction. Do not use a bottom sheet or separate detail route.
- **Current-cue precedence:** Active segment label/current row wins when present. Otherwise use `currentBlock.coachingCue` verbatim or its first ` · `-separated clause, then a bounded verbatim instruction excerpt only when the first non-empty instruction sentence is short and obviously action-shaped, then drill name. Do not invent generated cue labels.
- **Session-position posture:** Start with the existing block count plus, only if screenshots prove it helps, a quiet current/next label. Do not add a done/current/next rail in v1.
- **Timer posture:** The pinned cockpit footer remains the timer source of truth. Do not duplicate a second timer above the fold unless screenshot review proves the cockpit can be visually lost in a required state.
- **Typography posture:** Larger type is allowed only where it earns glanceability; compact body text remains the default elsewhere.
- **Segment posture:** Existing per-move segment indicators are a first-class part of the Run face, not a competing second feature.

---

## State Priority Matrix

This table is a visual-priority reference for Run Face v1. It is not a new state enum, state machine, or component system.

| State | Dominant reading | Current cue | Primary action | Supporting message |
|---|---|---|---|---|
| Running | Timer/progress | Active segment or cue precedence result | Next/Pause as existing controls allow | None unless wake-lock/audio guidance is active |
| Paused | Paused timer state | Preserve the current cue context | Resume | Short recovery instruction, not alarm styling |
| Shortened | Timer/progress at shortened duration | Preserve current cue context | Existing controls | Local indication only if already needed for clarity; no persisted state |
| Swapped | Timer/progress for the swapped block | Cue precedence result from the swapped block | Existing controls | Local confirmation/error only; no persisted state |
| Warning | Timer/progress remains visible | Current cue stays secondary to warning only when action is needed | The recovery action, when one exists | Calm, plain-language guidance |
| Error | Error message | Current cue can be demoted | Recovery route/action | Plain recovery copy, not alarmist styling |

---

## Dependencies / Assumptions

- The current `ScreenShell` header/body/footer layout remains the basic page structure unless planning finds a low-risk reason to adjust it.
- The existing pinned cockpit/footer remains the default control zone.
- The per-move pacing indicator requirements remain valid and should not be re-litigated in this work.
- The latest Home calm pass is treated as directionally correct: one primary action and quiet secondary context.
- Screenshots at 360px and 390px widths, plus a pair set-down check, are required before declaring the design successful.

---

## Outstanding Questions

### Resolve Before Planning

- None.

### Deferred to Planning

- [Affects R2, R5][Design] Does the inline disclosure default preserve full instruction access without competing with the current cue, or should planning fall back to secondary below-the-cue text?
- [Affects R4][Design] Does the existing block count need a quiet current/next label after screenshot review, or is the count enough?
- [Affects R1][Design] Does screenshot review show any required state where the cockpit timer is visually lost?

---

## Next Steps

-> `/ce-plan` for structured implementation planning.
