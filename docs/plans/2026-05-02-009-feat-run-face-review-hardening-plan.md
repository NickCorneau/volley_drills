---
id: run-face-review-hardening-plan-2026-05-02
title: "feat: Harden Run Face review findings"
status: complete
stage: validation
type: plan
summary: "Implementation plan for a narrow Run Face v1 hardening pass: disclosure proof and labels, conservative cue fallback, sparse accessible state announcements, and doc/test standards cleanup."
authority: "Execution plan for docs/brainstorms/2026-05-02-run-face-review-hardening-requirements.md."
date: 2026-05-02
origin: docs/brainstorms/2026-05-02-run-face-review-hardening-requirements.md
depends_on:
  - docs/brainstorms/2026-05-02-run-face-review-hardening-requirements.md
  - docs/plans/2026-05-02-005-feat-run-face-v1-plan.md
---

# feat: Harden Run Face review findings

## Overview

Apply a bounded review-hardening pass to Run Face v1. The work keeps the existing Run route, controller, timer mechanics, session data, and drill assembly unchanged while making the implemented UI easier to trust: disclosure tests must prove visible access, cue fallback must avoid parsing multiline prose, sparse announcements must cover state changes without timer chatter, and new docs/tests must satisfy repo standards.

---

## Requirements Trace

- R1. Prove inline full-detail access through user-observable disclosure behavior.
- R2. Label disclosure triggers by the hidden content they reveal.
- R3. Keep cue fallback conservative; multiline or over-threshold instruction prose falls back to drill name.
- R4. Preserve `SegmentList` as the only current-cue owner for segmented blocks.
- R5. Keep the running timer quiet during normal ticks; announce meaningful state transitions sparsely.
- R6. Give paused/preroll/error states accessible semantics without duplicate/noisy announcements.
- R7. Follow Vitest globals convention in new tests.
- R8. Repair Run Face plan frontmatter.

**Origin acceptance examples:** AE1 detail disclosure, AE2 cue fallback, AE3 state announcements, AE4 standards cleanup.

---

## Scope Boundaries

- Modify only Run Face presentation helpers/components/tests and Run Face docs metadata.
- Do not change route flow, `useRunController` behavior, timer mechanics, persisted execution state, Dexie schema, session assembly, drill generation policy, or generated-diagnostics code/docs.
- Do not introduce a reusable app-wide live-region framework or Run fixture abstraction unless implementation reveals unavoidable duplication.

---

## Context & Research

### Relevant Code and Patterns

- `app/src/screens/RunScreen.tsx` composes the Run body/footer and owns the inline disclosure placement.
- `app/src/screens/run/currentCue.ts` owns non-segmented display cue selection.
- `app/src/components/BlockTimer.tsx` owns visible timer semantics.
- `app/src/components/run/SegmentList.tsx` already owns segmented current cue announcements.
- `app/src/screens/__tests__/RunScreen.run-face.test.tsx`, `app/src/screens/run/__tests__/currentCue.test.ts`, and `app/e2e/run-face.spec.ts` are the narrow verification surfaces.

### Institutional Learnings

- Run Face v1 plan: avoid duplicate live announcements and keep one dominant timer surface.
- Testing rules: use Vitest globals and the lowest useful test tier.
- Courtside design docs: one live face beats a stack of equal-weight text; mobile proof remains required.

### External References

- MDN/WAI guidance: `role="timer"` is quiet by default; use stable status/alert regions for meaningful announcements.
- ARIA disclosure guidance: use clear trigger labels and expanded/collapsed state; tests should assert observable state.

---

## Key Technical Decisions

- **Cue fallback stays mechanical.** Prefer drill name over parsing multiline instruction prose; this avoids inventing an actionability classifier.
- **Disclosure remains native.** Keep `<details>/<summary>` and improve labels/tests instead of replacing the interaction.
- **Announcements stay local and sparse.** Use local markup/state text for paused/preroll/error semantics; do not add a global live-region system.
- **Segment ownership remains unchanged.** Segmented blocks continue to rely on `SegmentList` for current-cue state.

---

## Open Questions

### Resolved During Planning

- Should sparse announcements be a new shared abstraction? No. The scope is a local Run Face hardening pass.
- Should multiline instruction fallback try to detect "action-shaped" text? No. Use a mechanical no-multiline rule and drill-name fallback.

### Deferred to Implementation

- Exact accessible announcement wording can be tuned while editing tests, as long as it remains concise and non-alarmist.

---

## Implementation Units

- [x] U1. **Harden disclosure labels and proof**

**Goal:** Make full-detail access accurately labeled and tested through opened, visible disclosure state.

**Requirements:** R1, R2, AE1

**Dependencies:** None

**Files:**
- Modify: `app/src/screens/RunScreen.tsx`
- Modify: `app/src/screens/__tests__/RunScreen.run-face.test.tsx`

**Approach:**
- Derive the `<summary>` label from hidden content: instructions-only, cue-only, or both.
- Update tests to assert collapsed default, open the disclosure, assert expanded/open state, and assert visible detail text.
- Keep disclosure inline in the Run body.

**Test scenarios:**
- Happy path: long cue plus instructions shows a combined detail label; opening reveals both visible details.
- Edge case: cue-only detail uses cue-specific label.

**Verification:**
- RTL tests prove visible detail access rather than hidden DOM presence.

---

- [x] U2. **Tighten cue fallback**

**Goal:** Align `currentCue` with the conservative no-parsing contract.

**Requirements:** R3, R4, AE2

**Dependencies:** None

**Files:**
- Modify: `app/src/screens/run/currentCue.ts`
- Modify: `app/src/screens/run/__tests__/currentCue.test.ts`
- Modify: `app/src/screens/__tests__/RunScreen.segments.test.tsx` only if needed

**Approach:**
- Keep compact cue and first ` · ` cue-clause behavior.
- Use instruction fallback only for a single short non-empty instruction line.
- Fall back to drill name for multiline or over-threshold instructions.
- Preserve segmented-block bypass.

**Test scenarios:**
- Happy path: short single-line instruction is selected when cue is absent.
- Edge case: multiline instruction falls back to drill name.
- Edge case: over-threshold instruction falls back to drill name.
- Regression: segmented block still bypasses text cue helper.

**Verification:**
- Helper tests cover every fallback path without adding action parsing.

---

- [x] U3. **Add sparse Run state announcements**

**Goal:** Improve accessible semantics for paused/preroll/error states while keeping the running timer quiet.

**Requirements:** R5, R6, AE3

**Dependencies:** None

**Files:**
- Modify: `app/src/components/BlockTimer.tsx`
- Modify: `app/src/screens/RunScreen.tsx`
- Modify: `app/src/components/__tests__/BlockTimer.progress-bar.test.tsx`
- Modify: `app/src/screens/__tests__/RunScreen.run-face.test.tsx`
- Modify: `app/e2e/run-face.spec.ts` if browser proof needs updated role/name expectations

**Approach:**
- Keep the visible timer quiet while running.
- Ensure paused state has stable, concise accessible state text.
- Give preroll countdown a timer/status label that identifies start countdown without creating repeated running-timer chatter.
- Ensure `runError` appears in an alert-like accessible region while preserving visible calm styling.

**Test scenarios:**
- Happy path: running timer remains quiet and has a useful accessible name.
- Happy path: paused timer exposes paused state.
- Happy path: preroll exposes countdown semantics.
- Error path: run error is announced through alert semantics while controls remain visible.

**Verification:**
- Unit/RTL tests cover accessible names/roles for timer, preroll, and errors.

---

- [x] U4. **Clean documentation and test standards**

**Goal:** Resolve standards findings without expanding feature scope.

**Requirements:** R7, R8, AE4

**Dependencies:** U1, U2, U3

**Files:**
- Modify: `app/src/screens/run/__tests__/currentCue.test.ts`
- Modify: `app/src/screens/__tests__/RunScreen.run-face.test.tsx`
- Modify: `docs/plans/2026-05-02-005-feat-run-face-v1-plan.md`
- Modify: `docs/catalog.json`

**Approach:**
- Remove explicit Vitest global imports from new tests.
- Add required frontmatter fields to the original Run Face v1 plan.
- Register this requirements/plan pair in `docs/catalog.json`.

**Test scenarios:**
- Test expectation: none for doc metadata beyond existing docs validator.

**Verification:**
- Agent docs validation passes.

---

## System-Wide Impact

- **Interaction graph:** Run route presentation only; no controller/service/data flow changes.
- **Error propagation:** Existing `runError` remains the data source; only accessible presentation changes.
- **State lifecycle risks:** No persistence changes.
- **API surface parity:** No exported runtime API changes.
- **Integration coverage:** Focused RTL and Playwright proof cover user-observable Run states.
- **Unchanged invariants:** `SegmentList` owns segmented current cue; pinned cockpit remains the timer/control surface; generated-diagnostics work is out of scope.

---

## Risks & Dependencies

| Risk | Mitigation |
|------|------------|
| Overbuilding live regions into a generic system | Keep announcements local to Run Face and state-specific. |
| Tests become coupled to implementation details | Prefer role/name/visible assertions over class or DOM-shape assertions. |
| Catalog/doc changes mix with generated-diagnostics work | Stage/review hunk-level changes for Run Face only before committing. |

---

## Documentation / Operational Notes

- Update `docs/catalog.json` only for this new requirements/plan pair and any Run Face frontmatter routing needed by validators.
- Keep final verification narrow: formatting, lint, build, docs validation, focused Run Face unit tests, and Run Face Playwright proof.

---

## Sources & References

- **Origin document:** `docs/brainstorms/2026-05-02-run-face-review-hardening-requirements.md`
- Related requirements: `docs/brainstorms/2026-05-02-active-session-glance-system-requirements.md`
- Related plan: `docs/plans/2026-05-02-005-feat-run-face-v1-plan.md`
- Related code: `app/src/screens/RunScreen.tsx`, `app/src/screens/run/currentCue.ts`, `app/src/components/BlockTimer.tsx`, `app/src/components/RunControls.tsx`
