---
id: run-face-review-hardening-requirements-2026-05-02
title: "Requirements: Run Face review hardening"
status: active
stage: validation
type: requirements
authority: "Follow-up requirements for review-cleaning Run Face v1 after implementation. Narrows the selected ideation survivor to accessibility, disclosure, cue fallback, and documentation/test standards fixes."
summary: "Defines a narrow Run Face v1 hardening bundle: prove inline detail disclosure, align cue fallback with the no-parsing contract, add sparse accessible state announcements, and clean doc/test standards without changing routes, timer mechanics, data, or drill assembly."
last_updated: 2026-05-02
depends_on:
  - docs/ideation/2026-05-02-calm-courtside-ux-style-ideation.md
  - docs/brainstorms/2026-05-02-active-session-glance-system-requirements.md
  - docs/plans/2026-05-02-005-feat-run-face-v1-plan.md
---

# Run Face Review Hardening - requirements

## Problem Frame

Run Face v1 now has the right product shape, but review found a small set of gaps that can make the implementation look finished while leaving important contracts under-proven: hidden disclosure content can satisfy tests, multiline instructions can still become a cue-like surface, some state changes may not announce reliably, and the plan/tests need repo-standard cleanup.

This follow-up should harden the existing Run Face implementation without reopening the design. It is a review-cleaning pass for the current Run route, not a new Run system.

---

## Requirements

**Detail access**

- R1. Inline full-detail access must be proven through user-observable disclosure behavior. Tests must open the disclosure before asserting detail visibility.
- R2. Disclosure trigger copy must accurately describe the hidden content: instructions, coaching cue, or both.

**Cue fallback**

- R3. Non-segmented cue fallback must stay mechanical and conservative. Multiline or over-threshold instruction prose must not be promoted into the primary cue; fall back to the drill name instead.
- R4. Segmented blocks must keep `SegmentList` as the only current-cue owner and must not gain a competing text cue.

**Accessible state announcements**

- R5. The visible running timer must stay quiet during normal ticking, while meaningful state transitions use sparse, stable announcement surfaces.
- R6. Paused/preroll/error states must have accessible semantics that describe the state or recovery path without creating duplicate or noisy announcements.

**Standards cleanup**

- R7. New tests must follow the repo's Vitest globals convention.
- R8. The Run Face plan must satisfy durable-doc frontmatter requirements.

---

## Acceptance Examples

- AE1. **Covers R1, R2.** Given a non-segmented block with long instructions and a long cue, when the Run Face disclosure is closed, then the detail content is not treated as visible proof; when the athlete opens it, the full relevant detail becomes visible under accurate trigger copy.
- AE2. **Covers R3.** Given a block has no coaching cue and multiline instructions, when the primary current cue is selected, then the drill name is used rather than parsing the first instruction line.
- AE3. **Covers R5, R6.** Given the timer is running normally, when seconds tick down, then assistive tech is not spammed; given the state changes to paused, preroll, or error, the user gets a concise accessible state/recovery announcement.
- AE4. **Covers R7, R8.** Given a future agent scans the Run Face docs/tests, when it checks repo standards, then frontmatter and test imports match the repo contract.

---

## Success Criteria

- The review findings around disclosure proof, cue fallback, live announcements, frontmatter, and Vitest global imports are resolved.
- Focused Run Face tests prove behavior through accessible/user-observable state rather than hidden DOM.
- The visible Run Face remains calm: no new dashboard chrome, no duplicated timer, no new route, and no generated cue logic.
- Final verification can reuse the existing narrow gate: formatting, lint, build, docs validation, focused Run Face unit tests, and Run Face Playwright proof.

---

## Scope Boundaries

- In scope: Run Face display semantics, disclosure labels/tests, cue fallback helper/tests, sparse Run state announcements, plan frontmatter, and test import cleanup.
- Out of scope: new route behavior, timer mechanics, Dexie schema, session plan assembly, drill generation policy, broad Run redesign, broad app accessibility framework, generated-diagnostics work, or new coach/rationale systems.
- Out of scope: adding a reusable Run test fixture abstraction unless implementation reveals unavoidable duplication.

---

## Key Decisions

- **Selected survivor:** Run Face Review Hardening Bundle from the follow-up ideation pass.
- **Announcement posture:** Keep the visible timer quiet while running; announce only meaningful state changes or errors.
- **Disclosure posture:** Keep native inline disclosure; strengthen labels and tests instead of replacing it with a bottom sheet or route.
- **Cue posture:** Prefer safe factual fallback over guessed intent. Do not add actionability parsing to satisfy R3.

---

## Outstanding Questions

### Resolve Before Planning

- None.

### Deferred to Planning

- [Affects R5, R6][Technical] Should sparse announcements live in `BlockTimer`, `RunScreen`, or a tiny local helper to avoid duplicate live-region ownership?

---

## Next Steps

-> `/ce-plan` for structured implementation planning.
