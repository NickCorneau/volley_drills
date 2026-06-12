---
title: "Torn UI read: derived summary mixed live chip state with the effect-rebuilt preview draft"
date: 2026-06-12
category: ui-bugs
module: app/setup-screen-preview
problem_type: ui_bug
component: frontend_stimulus
symptoms:
  - "One painted frame after a focus-chip tap, the Setup resolved line paired the NEW focus label with the PREVIOUS build's archetype and minutes"
  - "Invisible in unit tests: RTL act() flushes the rebuild effect inside the awaited click, so every settled assertion sees converged state"
  - "Surfaced only by review reasoning about commit timing, not by any failing test or user report"
root_cause: async_timing
resolution_type: code_fix
severity: low
related_components:
  - testing_framework
tags:
  - setup-screen
  - resolved-line
  - preview-draft
  - torn-state
  - single-source-derivation
  - react-usememo
  - discriminating-test
  - d158
---

# Torn UI read: derived summary mixed live chip state with the effect-rebuilt preview draft

## Problem

The Setup screen's focal resolved line (`{archetype} · {minutes} min · {focus} focus`, D158) derived its three segments from two different sources: archetype and minutes came from `previewDraft` (rebuilt in a `useEffect` one commit after a chip tap), while the focus label read **live chip state** (`sessionFocus`). For one painted frame after a focus-chip tap, the line could assert a build that never existed — the new focus label beside the previous build's minutes — on a screen whose documented contract (duration honesty, D158) is that its statements never disagree.

The general failure class: **any rendered summary that mixes live input state with values derived from an effect-rebuilt artifact can present a torn read during the commit(s) between the input change and the rebuild landing.**

## Symptoms

- A summary/receipt line briefly shows a hybrid of new input and stale derived output after an input change (one frame under synchronous React 18 rendering; longer if the rebuild is ever made async, debounced, or transition-wrapped).
- No test failure and no console error — the tear lives between commits, where `act()`-flushed tests cannot observe it.

## What Didn't Work

- **Pinning the torn frame directly at the screen-test tier.** RTL's `act()` flushes the rebuild effect synchronously inside the awaited `user.click(...)`, so the intermediate frame is unobservable; every assertion sees post-settle converged state. There is no cheap way to catch the tear "in the act" with the real builder.
- **An agreement assertion as the bug-fix test.** The first test extension asserted the post-change resolved-line minutes equal the footer Callout minutes. Genuine duration-honesty coverage, but **invariant under the regression** — both segments read the same memo either way, so it passed against the pre-fix code too. Code review (project-standards + testing personas) caught that the fix itself was unpinned: reverting the derivation passed all 23 existing tests.

## Solution

Derive every segment of the line from the **same build artifact**. The build context already carries the focus that produced it (stamped only when explicit), so the live-state read and its memo dependency are simply dropped:

```tsx
// BEFORE — focus from live chip state, minutes from the rebuilt draft (torn)
const resolvedLine = useMemo(() => {
  if (!previewDraft || previewTotalMinutes === null) return null
  const focusLabel =
    FOCUS_OPTIONS.find((option) => option.value === sessionFocus)?.label ?? 'Recommended'
  return `${previewDraft.archetypeName} · ${previewTotalMinutes} min · ${focusLabel} focus`
}, [previewDraft, previewTotalMinutes, sessionFocus])

// AFTER — all three segments read the preview build (atomic)
const resolvedLine = useMemo(() => {
  if (!previewDraft || previewTotalMinutes === null) return null
  const draftFocus = previewDraft.context.sessionFocus ?? 'recommended'
  const focusLabel =
    FOCUS_OPTIONS.find((option) => option.value === draftFocus)?.label ?? 'Recommended'
  return `${previewDraft.archetypeName} · ${previewTotalMinutes} min · ${focusLabel} focus`
}, [previewDraft, previewTotalMinutes])
```

The discriminating test stubs the builder so the draft's context **disagrees** with the clicked chip — the only settled render where the two sourcings produce different output:

```tsx
// Stub buildDraft to return a draft whose context stamps sessionFocus: 'serve',
// then click the 'Passing' chip. Draft-context sourcing renders 'Serving focus';
// live-chip sourcing renders 'Passing focus'.
vi.spyOn(sessionBuilder, 'buildDraft').mockReturnValue(fakeDraftWithServeFocus)
await user.click(screen.getByRole('radio', { name: 'Passing' }))
await waitFor(() => {
  expect(screen.getByTestId('setup-resolved-line').textContent).toMatch(/Serving focus$/)
})
```

Verified by mutation check: reverting the derivation turns exactly this test red (1 failed / 23 passed); with the fix, 24/24 green.

## Why This Works

React state set inside a `useEffect` lands one commit after the state that triggered the effect. Anything rendered from *both* the trigger state and the effect-derived state spans that boundary and can tear. Sourcing every rendered segment from the single derived artifact makes the display atomic by construction — the line always describes one real build. The accepted trade (documented in the code comment): the line now lags the chips by the same one commit, showing the *previous* coherent build instead of a hybrid — coherent-but-momentarily-stale beats fresh-but-torn for a line whose job is describing the build.

## Prevention

- **Single-source rule:** when a component renders a summary of a derived/built artifact (preview draft, computed plan, assembled receipt), derive *every* displayed segment from that artifact. Never mix in the live input state that triggered the rebuild — if the artifact lacks a needed input, stamp it onto the artifact at build time.
- **Bug-fix tests must discriminate:** an assertion that also passes against the pre-fix code pins nothing. When effect flushing hides the regression at the settled tier, *stub the producer so the two sourcings disagree at a settled render* — that converts an unobservable timing bug into an observable sourcing bug.
- **Mutation-check the pin:** revert the fix locally, confirm exactly the new test fails, restore. (Cheap here: one `python3` string-replace, two vitest runs.)
- **Watch the lag window:** the one-commit lag is invisible under synchronous rendering, but if a preview rebuild is ever debounced, made async, or moved behind `startTransition`, the chip-vs-summary disagreement window grows silently. Re-evaluate the display contract before doing that.
- **Where to look for recurrences:** any screen pairing live chips/inputs with an effect-rebuilt draft. In this app: Setup's preview surfaces; future preview-driven screens in the M002 series should inherit the single-source rule from the start.

## Related Issues

- `docs/decisions.md` D158 — the resolved-line contract this fix enforces ("the screen's two duration statements cannot disagree").
- `docs/plans/2026-06-12-004-fix-setup-resolved-line-atomic-focus-plan.md` — the micro-fix plan with the mutation-verification record (commit `7446c4d`; original D158 ship `d15986a`).
- `docs/solutions/architecture-patterns/d137-canonical-pre-run-spine-setup-safety-2026-05-07.md` — establishes Setup's inline focus readiness with Recommended defaulted, the semantic the `?? 'recommended'` fallback encodes.
- `docs/solutions/workflow-issues/2026-05-25-test-skip-discipline.md` — adjacent test-discipline learning (this doc adds the discriminating-test + mutation-check discipline for bug fixes).
