---
title: "feat: UI primitive consolidation"
type: feat
status: active
date: 2026-05-04
origin: docs/brainstorms/2026-05-04-ui-primitive-consolidation-requirements.md
---

# feat: UI primitive consolidation

## Overview

Consolidate eight inline UI patterns scattered across `app/src/screens/` and `app/src/components/` into shared primitives, split `components/ui/` into atomic `ui/` and Volleycraft-shaped `patterns/` subfolders, fix two structural smells the architecture lens surfaced (`ActionOverlay`'s string-typed focus contract; surface tokens co-located with `Card`), and add a custom ESLint rule that fails at edit time when the consolidated patterns are inlined again. Sequenced so the two structural fixes land first, ChoiceRow extends the in-flight ChoiceSection plan, headers/pill/disclosure/modal/callout/number-cell extractions follow, and the folder split + ESLint rule close the work.

---

## Problem frame

The hand-rolled `components/ui/` primitive layer is consumed correctly ~80% of the time. The remaining ~20% is the same surfaces re-built inline. The 2026-05-04 audit catalogued ten patterns; eight are addressed here (D8 SectionEyebrow and D10 broad text-link normalization are deferred per origin scope). Two structural smells underlie the duplication: `ActionOverlay` requires every modal to remember a string attribute (`data-action-overlay-initial-focus="true"`) — TypeScript can't enforce it, no test catches a typo, and this pre-condition makes `ConfirmModal` extraction a wrapper hiding the smell rather than a fix. `FOCAL_SURFACE_CLASS` and `ELEVATED_PANEL_SURFACE` live in `components/ui/Card.tsx` but are consumed by non-Card surfaces (`SkillLevelScreen` option rows, `ActionOverlay` panel) — implies a misleading "reach for Card" coupling that will worsen as new surface tokens land.

See origin: [docs/brainstorms/2026-05-04-ui-primitive-consolidation-requirements.md](docs/brainstorms/2026-05-04-ui-primitive-consolidation-requirements.md).

---

## Requirements trace

- R1. ScreenHeader pattern primitive (P1) — origin R1
- R2. RunFlowHeader pattern primitive (P2) — origin R2
- R3. ChoiceRow atomic primitive (P3) — origin R3, extends in-flight `docs/plans/2026-05-04-007-feat-app-wide-choice-ui-consistency-plan.md`
- R4. Disclosure atomic primitive (P4 part a) — origin R4
- R5. Expander atomic primitive (P4 part b) — origin R5
- R6. ConfirmModal pattern primitive (P5) — origin R6
- R7. Callout atomic primitive (P6) — origin R7
- R8. NumberCell atomic primitive (P7) — origin R8
- R9. JustFinishedPill pattern primitive (P8) — origin R9
- R10. Surfaces tokens module relocation (S1) — origin R10
- R11. ActionOverlay typed-focus seam (S2) — origin R11 (chose R11a ref-based)
- R12. components/patterns/ folder split (S3) — origin R12
- R13. ESLint guardrail rule (G1) — origin R13
- R14–R17. Compatibility / non-regression — origin R14–R17

---

## Scope boundaries

- D8 SectionEyebrow extraction is out of scope (origin: typography in editorial flux pre-D91; document the pattern in `.cursor/rules/component-patterns.mdc` instead).
- Broad text-link normalization (D10 origin) is out of scope (variance is intentional). The narrow duplications get folded into the right primitive (Disclosure absorbs PerDrillCapture buttons; StatusMessage action-prop cleanup absorbs three back-to-home links — addressed in U7 and U9 respectively).
- No new ChoiceSection slots; closed slot set held per origin D5.
- No CVA, Radix, or shadcn install (origin D9).
- `BlockTimer`, `RpeSelector`, `IncompleteReasonChips`, `PainOverrideCard`, `SegmentList`, `SafetyIcon`, `Brandmark`, `home/cardStyles.ts` keep their public APIs unchanged (they consume the new primitives where applicable; their own contracts don't change). Origin D10.
- No visual-snapshot regression testing — ESLint rule + existing RTL tests + founder visual verification are the agreed safety net (origin scope).

### Deferred to follow-up work

- Migrating remaining call-sites that import `BackButton` from `components/ui` to import from `components/patterns` directly. The ui-barrel re-export keeps current imports working; a follow-up cleanup PR can do the path migration in one sweep.
- Migrating `home/cardStyles.ts` to import `FOCAL_SURFACE_CLASS` from `components/ui/surfaces` directly (currently imports from `Card.tsx` which now re-exports). One-line change; bundled into U1.

---

## Context & research

### Relevant code and patterns

**Existing primitive layer:**
- `app/src/components/ui/Button.tsx` — variant/size matrix; reference for tone/size enum patterns
- `app/src/components/ui/Card.tsx` — currently hosts `FOCAL_SURFACE_CLASS` + `ELEVATED_PANEL_SURFACE` (relocated by U1)
- `app/src/components/ui/ChoiceSection.tsx` — heading/description/footer wrapper; `ChoiceRow` is its sibling (U3)
- `app/src/components/ui/ToggleChip.tsx` — chip rendered by `ChoiceRow` and `RpeSelector`
- `app/src/components/ui/ActionOverlay.tsx` — modal shell; focus-attribute fix in U2, ConfirmModal wraps it in U8
- `app/src/components/ui/ScreenShell.tsx` — three-zone layout; `RunFlowHeader` wraps `ScreenShell.Header`
- `app/src/components/ui/StatusMessage.tsx` — keeps page-state semantics; uses Callout internally (U9)
- `app/src/components/ui/BackButton.tsx` — moves to `components/patterns/` in U11

**Inline patterns being consolidated** (cited in unit Files sections):
- Headers: `SetupScreen.tsx`, `SafetyCheckScreen.tsx`, `SettingsScreen.tsx`, `TuneTodayScreen.tsx` (ScreenHeader); `RunScreen.tsx`, `TransitionScreen.tsx`, `DrillCheckScreen.tsx` (RunFlowHeader)
- Modals: `SoftBlockModal.tsx`, `SkipReviewModal.tsx`, `ResumePrompt.tsx`, `SchemaBlockedOverlay.tsx`, end-session sheet in `RunScreen.tsx`
- Choice rows: 5 in `SetupScreen.tsx`, 3 in `SafetyCheckScreen.tsx`, 1 each in `TuneTodayScreen.tsx`, `RpeSelector.tsx`, `IncompleteReasonChips.tsx`, `PerDrillCapture.tsx`
- Disclosure: 2 in `PerDrillCapture.tsx` (Add counts, Add longest streak); 1 in `SafetyCheckScreen.tsx` (heat expander)
- Just-finished pill: `DrillCheckScreen.tsx`, `TransitionScreen.tsx`
- Callouts: heat warning + tips in `SafetyCheckScreen.tsx`, `PainOverrideCard.tsx`, success message in `SettingsScreen.tsx`, error body in `StatusMessage.tsx`
- Number inputs: `PassMetricInput.tsx` (NumberCell), `PerDrillCapture.tsx` (StreakInput)

**In-flight coordination:**
- `docs/plans/2026-05-04-007-feat-app-wide-choice-ui-consistency-plan.md` — the in-flight ChoiceSection plan. U3 absorbs its remaining work (the file rename appears done; the `app/src/components/ui/index.ts` export list still references the old `SetupChoiceSection` symbols and the SafetyCheckScreen + TuneTodayScreen migrations need verification). Once U3 lands, plan-007 can be closed as superseded.

**ESLint config:**
- `app/eslint.config.js` — flat config, ready to accept a local plugin or inline `rules` reference
- No existing custom rules; `eslint-rules/` directory will be net-new (U12)

### Existing conventions

- Tailwind v4 semantic tokens (`bg-bg-warm`, `text-text-primary`, `accent`, `accent-pressed`, `warning-surface`, `info-surface`, `success`)
- `cx` from `app/src/lib/cn` for className composition
- Component primitives use focus-visible:ring-* for keyboard focus; surfaces in `surfaces.ts` use focus-visible:outline-* (per `.cursor/rules/component-patterns.mdc` `ring + shadow` ban)
- 44 px / 54 px / 56 px touch-target rhythm (outdoor courtside contract)
- Discriminated-union props for shape-dependent variants (see `PerDrillCapture` `captureShape`)
- Tests in `__tests__/` siblings; vitest globals; RTL + user-event

### Institutional learnings

- `docs/solutions/2026-05-04-source-backed-content-depth-activation-pattern.md` (TL;DR, paraphrased): "generalize on the second instance, not the first." Every pattern in this plan has ≥3 instances; the threshold is well past.
- Component-patterns rule (`.cursor/rules/component-patterns.mdc`) already names the existing primitives and the `ring + shadow` ban; this plan extends the rule with the new primitives' names.

---

## Key technical decisions

- **D1 (origin D2):** Surface-tokens relocation (U1) is the first commit. Cheap, separable, eliminates an architectural risk before any extraction touches `Card.tsx`.
- **D2 (origin D3):** ActionOverlay typed-focus seam (U2) lands **before** ConfirmModal extraction (U8). Per architecture lens: extracting ConfirmModal first hides the smell behind a wrapper but leaves the three non-ConfirmModal callers paying the contract tax. Fixing the seam first makes ConfirmModal a thin convenience layer over an already-correct primitive.
- **D3 (origin R11a):** Use a `initialFocusRef?: RefObject<HTMLElement>` prop for the new focus seam, not a `primaryAction` slot. Ref form threads cleanly through `ConfirmModal` (creates the ref internally) and obsoletes ResumePrompt's existing `refocusKey` workaround for the discard-state focus transition.
- **D4 (origin D1):** Folder split (U11) lands after the primitives but before the ESLint rule. New primitives are born in `components/ui/`, then moved en masse to `components/patterns/` so the move is one atomic commit with one set of import-path updates.
- **D5 (origin D7):** `Disclosure` and `Expander` are separate primitives. Disclosure replaces its trigger on expand (PerDrillCapture's drawers); Expander keeps the trigger visible with a chevron (SafetyCheckScreen heat). Don't unify behind a `replaceTrigger` prop — distinct shapes, distinct contracts.
- **D6 (origin D6):** `Callout` does NOT swallow `StatusMessage`. `StatusMessage` keeps its page-load semantic role (loading/error/empty); the error variant uses `Callout` for its body markup. Two abstractions, two responsibilities.
- **D7 (origin R11):** ResumePrompt's outer "Session in progress" surface keeps using raw `ActionOverlay` (its content shape is heavier than a confirm). Only its discard-state confirm-step uses `ConfirmModal`.
- **D8:** ESLint rule lives in a local `app/eslint-rules/` directory loaded inline via `eslint.config.js`, not a published npm plugin. Plan keeps the rule self-contained; a future package can lift it if value emerges.
- **D9:** ESLint rule is **report-only**, no autofix. Drift detection, not transformation. Reports point to the right primitive in the message.
- **D10:** `JustFinishedPill` (P8) lands inside `components/patterns/` in U11 (created in `components/ui/` in U6, moved in U11). Could plausibly live in `components/run/` alongside `SegmentList`; the `patterns/` location wins because it pairs with `RunFlowHeader` (also run-flow specific) and avoids a third home for app-shaped composites.

---

## Open questions

### Resolved during planning

- **Q: Should `BackButton` move to `components/patterns/` in this effort?** A: Yes (origin D8). Re-exports from `components/ui/index.ts` keep current imports working; no call-site churn in this plan.
- **Q: Does ConfirmModal need to support 0, 1, or 2 buttons?** A: 1 required (safe-primary), 1 optional (destructive-secondary). The end-session sheet, SkipReview, and SoftBlock all fit this; ResumePrompt's two-state flow uses two ConfirmModal mounts on state, not a 3-button API.
- **Q: Does `Callout` swallow `StatusMessage`?** A: No (D6 above).

### Deferred to implementation

- **Q: Exact ESLint rule mechanism for detecting "the BackButton + h1 + spacer trio."** Likely AST traversal of the JSX subtree under `ScreenShell.Header`; if too brittle, fall back to a simpler "BackButton imported from `components/ui` in a screen file MUST be inside `<ScreenHeader>`" heuristic. Decide during U12 implementation based on what's actually feasible with the chosen ESLint AST utilities.
- **Q: Does the in-flight plan-007 still have unfinished SafetyCheckScreen/TuneTodayScreen migration work?** Verify at the start of U3 by reading the current state of those files; if migration is complete, U3 starts at the ChoiceRow extraction directly. If not, U3 absorbs the leftovers.
- **Q: Whether to add `aria-modal` polyfill checks for older WebKit on the new `ConfirmModal`.** Defer — `ActionOverlay` already handles this; ConfirmModal inherits.

---

## Implementation units

- [ ] U1. **Surface tokens module (S1)**

**Goal:** Relocate `FOCAL_SURFACE_CLASS` and `ELEVATED_PANEL_SURFACE` from `components/ui/Card.tsx` to a dedicated `components/ui/surfaces.ts`. Re-export from `Card.tsx` for back-compat. Update direct consumers to import from the new module.

**Requirements:** R10

**Dependencies:** None — first commit.

**Files:**
- Create: `app/src/components/ui/surfaces.ts`
- Create: `app/src/components/ui/__tests__/surfaces.test.ts`
- Modify: `app/src/components/ui/Card.tsx` (re-export the two tokens)
- Modify: `app/src/components/ui/ActionOverlay.tsx` (import from `surfaces.ts`)
- Modify: `app/src/screens/SkillLevelScreen.tsx` (import from `surfaces.ts`)
- Modify: `app/src/components/home/cardStyles.ts` (import from `surfaces.ts`)

**Approach:**
- Move both class-string constants to `surfaces.ts` with their existing comment-block rationale (the WebKit `ring + shadow` corner-wedge ban-list explanation must travel with the tokens).
- Card.tsx exports `export { FOCAL_SURFACE_CLASS, ELEVATED_PANEL_SURFACE } from './surfaces'` so existing import paths keep working.
- Direct consumers update to import from `surfaces.ts` directly. No barrel changes; both files are import-graph leaves for these tokens.

**Patterns to follow:**
- Existing `app/src/components/ui/Card.tsx` comment-block rationale style (preserve it verbatim on the relocated tokens).
- Existing `app/src/components/ui/index.ts` does NOT export these tokens (they're class strings, not components); preserve that.

**Test scenarios:**
- Happy path: `surfaces.ts` exports both constants with their expected class-string contents (literal string-equality assertion to lock the ban-list compliance).
- Test expectation: Card.tsx re-export — covered by the existing `Card.tsx` consumers continuing to compile and run their tests.

**Verification:**
- `npm run build` succeeds.
- `npm test -- --run src/components/ui/__tests__/` passes.
- `git grep "FOCAL_SURFACE_CLASS\|ELEVATED_PANEL_SURFACE"` shows imports only from `surfaces.ts` or `Card.tsx` (re-export); no inline duplicates.

---

- [ ] U2. **ActionOverlay typed-focus seam (S2)**

**Goal:** Replace the `data-action-overlay-initial-focus="true"` string-attribute contract with a typed `initialFocusRef?: RefObject<HTMLElement>` prop on `ActionOverlay`. Migrate all five current callers (`SoftBlockModal`, `SkipReviewModal`, `ResumePrompt`, `SchemaBlockedOverlay`, `RunScreen` end-session sheet) to use the ref.

**Requirements:** R11

**Dependencies:** U1 (lands first to keep `ActionOverlay`'s `surfaces.ts` import clean).

**Files:**
- Modify: `app/src/components/ui/ActionOverlay.tsx`
- Modify: `app/src/components/SoftBlockModal.tsx`
- Modify: `app/src/components/SkipReviewModal.tsx`
- Modify: `app/src/components/ResumePrompt.tsx` (uses ref-swap on confirming-state transition; remove the `refocusKey` prop usage)
- Modify: `app/src/components/SchemaBlockedOverlay.tsx`
- Modify: `app/src/screens/RunScreen.tsx` (end-session sheet block)
- Modify: `app/src/components/ui/__tests__/ActionOverlay.test.tsx`
- Test: `app/src/components/__tests__/SoftBlockModal.test.tsx` (if exists), otherwise add one
- Test: `app/src/components/__tests__/SkipReviewModal.test.tsx`
- Test: `app/src/components/__tests__/ResumePrompt.test.tsx`
- Test: `app/src/components/__tests__/SchemaBlockedOverlay.test.tsx`

**Approach:**
- Add `initialFocusRef?: RefObject<HTMLElement | null>` prop to `ActionOverlay`. On mount + when `refocusKey` changes (preserved for back-compat), focus `initialFocusRef.current` if provided; otherwise fall back to the first focusable element.
- Keep the legacy `[data-action-overlay-initial-focus="true"]` query as a secondary fallback for the duration of U2 (before U8 ConfirmModal lands), so a half-migrated state during code review doesn't strand a caller.
- Each caller creates a local `useRef<HTMLButtonElement>(null)`, attaches it to its safe-primary button, and passes it as `initialFocusRef`.
- After all callers migrate, delete the `data-action-overlay-initial-focus` query path in a follow-up commit within U2 (atomic with the last caller migration).
- ResumePrompt's two-state flow: rather than `refocusKey={confirmingDiscard}` + matching `data-` attributes, the component creates two refs (one per state) and passes the active one. This obsoletes `refocusKey` for ResumePrompt; keep `refocusKey` on the ActionOverlay API as a no-op back-compat for now (mark as `@deprecated`) and remove in a later cleanup.

**Execution note:** Land caller migrations one-per-commit so a regression bisect can name the failing modal.

**Patterns to follow:**
- Existing `ActionOverlay` test suite at `app/src/components/ui/__tests__/ActionOverlay.test.tsx` has the focus-target test pattern at line 45-58 ("uses the marked safe action for initial focus") — extend with a ref-based variant.
- Existing `useRef<HTMLButtonElement>(null)` ref-passing is used elsewhere in the codebase (e.g., `RunScreen.tsx`'s `endingSessionInFlightRef`).

**Test scenarios:**
- Happy path: passing `initialFocusRef` pointing at a button focuses that button on mount, regardless of DOM order. Covers the primary fix.
- Happy path: omitting `initialFocusRef` falls back to the first focusable element (existing behavior preserved).
- Edge case: `initialFocusRef.current` is `null` at mount (ref hasn't attached yet) — focus falls back to first focusable; no crash.
- Edge case: `refocusKey` change with a different `initialFocusRef` value re-focuses the new target (covers ResumePrompt's two-state transition).
- Integration: SoftBlockModal renders with `initialFocusRef` on the "Finish review" button; `document.activeElement` is "Finish review" after mount.
- Integration: SkipReviewModal — same shape, asserts safe-primary "Never mind" gets focus.
- Integration: ResumePrompt confirming-state transition focuses "Keep session" after the state flip (without using `refocusKey` API).
- Integration: SchemaBlockedOverlay — Reload button gets focus.
- Integration: RunScreen end-session sheet — "Go back" gets focus when the sheet opens.
- Error path: passing both `initialFocusRef` and `[data-action-overlay-initial-focus]` in children — `initialFocusRef` wins (precedence test).

**Verification:**
- All 5 modal callers' tests pass with the new ref-based API.
- `git grep 'data-action-overlay-initial-focus'` returns 0 results in `app/src/` after the U2 final commit.
- `npm run lint`, `npm test -- --run`, `npm run test:e2e -- app/e2e/accessibility.spec.ts` all pass.
- Manual: open SkipReview modal in dev server, confirm focus lands on "Never mind"; press Tab; confirm focus moves to "Yes, skip"; press Esc; confirm modal dismisses and focus restores to opener.

---

- [ ] U3. **ChoiceSection finish-out + ChoiceRow primitive (P3)**

**Goal:** Complete any remaining migration work from in-flight plan-007 (verify SafetyCheckScreen/TuneTodayScreen are on `ChoiceSection`/`ChoiceSubsection`; finish the `index.ts` export-symbol cleanup if still referencing `SetupChoiceSection`). Add a sibling `ChoiceRow` atomic primitive that owns the `role="radiogroup"` wrapper, ToggleChip mapping, layout, and per-option tone. Migrate all 8+ callers.

**Requirements:** R3 (extends plan-007)

**Dependencies:** None on prior units (U3 is independent of U1/U2 and can be parallelized in review). Coordinates with: `docs/plans/2026-05-04-007-feat-app-wide-choice-ui-consistency-plan.md` — supersedes that plan once U3 lands.

**Files:**
- Verify state of: `app/src/components/ui/ChoiceSection.tsx` (already renamed from SetupChoiceSection; content includes ChoiceSubsection)
- Modify: `app/src/components/ui/index.ts` (replace `SetupChoiceSection` exports with `ChoiceSection` + `ChoiceSubsection` if not done; add `ChoiceRow`)
- Create: `app/src/components/ui/ChoiceRow.tsx`
- Create: `app/src/components/ui/__tests__/ChoiceRow.test.tsx`
- Modify: `app/src/screens/SetupScreen.tsx` (5 radiogroup sites → ChoiceRow)
- Modify: `app/src/screens/SafetyCheckScreen.tsx` (3 radiogroup sites → ChoiceRow; verify ChoiceSection migration done first)
- Modify: `app/src/screens/TuneTodayScreen.tsx` (1 radiogroup site → ChoiceRow; verify ChoiceSection migration done first)
- Modify: `app/src/components/RpeSelector.tsx` (replace inline radiogroup wrapper with ChoiceRow; keep `pickChipForRpe` rehydration logic at module level)
- Modify: `app/src/components/IncompleteReasonChips.tsx` (becomes a ~5-line ChoiceRow caller)
- Modify: `app/src/components/PerDrillCapture.tsx` (Difficulty chip row → ChoiceRow)
- Test: `app/src/screens/__tests__/SetupScreen.test.tsx`, `SafetyCheckScreen.test.tsx`, `TuneTodayScreen.test.tsx`, `RpeSelector.test.tsx`, `IncompleteReasonChips` (if test exists), `PerDrillCapture.test.tsx`

**Approach:**
- ChoiceRow API:
  ```ts
  type ChoiceRowOption<T> = { value: T; label: string; tone?: ToggleChipTone; size?: ToggleChipSize; ariaLabel?: string }
  type ChoiceRowProps<T> = {
    value: T | null
    onChange: (next: T) => void
    options: readonly ChoiceRowOption<T>[]
    layout?: 'flex' | 'grid-2' | 'grid-3'
    ariaLabel?: string         // exactly one of ariaLabel / ariaLabelledBy required
    ariaLabelledBy?: string
    fillChips?: boolean        // default true — chips fill row cells
  }
  ```
- Layout maps to: `flex gap-2`, `grid grid-cols-2 gap-2`, `grid grid-cols-3 gap-2`. The component renders `<div role="radiogroup">` with the appropriate aria attribute, then `.map(options, ToggleChip)`.
- Per-option tone is the SafetyCheckScreen Recency case: `[{ value: '0 days', label: 'Today', tone: 'warning' }, { value: '1 day', label: 'Yesterday' }, ...]` — the warning tone applies only to that option's chip selected state.
- `RpeSelector` keeps its module-level `EFFORT_CHIPS` constant + `pickChipForRpe` rehydration helper; only the JSX collapses to `<ChoiceRow value={pickChipForRpe(value)} onChange={onChange} options={EFFORT_CHIPS_AS_CHOICE_OPTIONS} layout="grid-3" ariaLabelledBy={ariaLabelledBy} />`.
- `IncompleteReasonChips` likewise becomes a thin `<ChoiceRow>` caller with `tone="warning"` on every option.
- `PerDrillCapture` Difficulty row uses `ariaLabelledBy="per-drill-heading"`.
- Plan-007 coordination: at U3 start, read the current state of `index.ts`, SafetyCheckScreen, TuneTodayScreen. If plan-007's migrations are complete, U3 starts at ChoiceRow creation. If incomplete, U3 finishes them first as the opening sub-commit.

**Patterns to follow:**
- Existing `app/src/components/ui/ChoiceSection.tsx` for the layout-shell sibling pattern.
- Existing `app/src/components/ui/ToggleChip.tsx` for the tone/size enum surface.
- Existing `app/src/components/IncompleteReasonChips.tsx` as the pattern of "thin chip-row composition with tone."

**Test scenarios:**
- Happy path: ChoiceRow renders `role="radiogroup"` with the passed `aria-label`; renders one ToggleChip per option; the selected option has `aria-checked="true"`.
- Happy path: clicking an unselected chip calls `onChange` with that option's `value`.
- Happy path: layout `'grid-3'` produces `grid grid-cols-3 gap-2`; `'flex'` produces `flex gap-2`; default is `'flex'`.
- Edge case: per-option tone applies only to that option's selected styling; unselected chips render with default tone styling.
- Edge case: passing both `ariaLabel` and `ariaLabelledBy` — TypeScript prevents at compile time (discriminated union), runtime falls back to `ariaLabel`.
- Edge case: passing neither `ariaLabel` nor `ariaLabelledBy` — TypeScript compile error (discriminated union enforces exactly one).
- Integration: SafetyCheckScreen Recency row's `0 days` chip selected renders with warning tone (per-option tone); `1 day` selected renders with accent tone.
- Integration: SetupScreen Players row uses `<ChoiceRow value={playerMode} ... layout="flex" ariaLabel="Player mode" />`; selecting "Pair" calls `setPlayerMode('pair')`.
- Integration: RpeSelector with a stored value of 6 renders the "Right" chip selected (via `pickChipForRpe`), and tapping "Hard" calls `onChange(7)`.
- Integration: PerDrillCapture Difficulty row uses `ariaLabelledBy="per-drill-heading"`; selecting "Still learning" calls `onDifficultyChange('still_learning')`.

**Verification:**
- `npm test -- --run` passes (all migrated callers + ChoiceRow tests).
- `npm run test:e2e -- app/e2e/phase-c3-onboarding.spec.ts app/e2e/session-flow.spec.ts` passes.
- `git grep 'role="radiogroup"' app/src/components app/src/screens` returns matches ONLY in `ChoiceRow.tsx` itself and `__tests__/`.
- Mark `docs/plans/2026-05-04-007-feat-app-wide-choice-ui-consistency-plan.md` `status: superseded` with a pointer to this plan.

---

- [ ] U4. **ScreenHeader pattern primitive (P1)**

**Goal:** Extract the `BackButton + centered title + spacer` row used by SetupScreen, SafetyCheckScreen, SettingsScreen, and TuneTodayScreen into `components/ui/ScreenHeader.tsx` (moved to `components/patterns/` in U11). Replaces the hardcoded `w-12` spacer with an auto-balanced spacer matching BackButton's measured width.

**Requirements:** R1

**Dependencies:** None on other units; can land in parallel with U2/U3 review.

**Files:**
- Create: `app/src/components/ui/ScreenHeader.tsx`
- Create: `app/src/components/ui/__tests__/ScreenHeader.test.tsx`
- Modify: `app/src/components/ui/index.ts`
- Modify: `app/src/screens/SetupScreen.tsx`
- Modify: `app/src/screens/SafetyCheckScreen.tsx`
- Modify: `app/src/screens/SettingsScreen.tsx`
- Modify: `app/src/screens/TuneTodayScreen.tsx`

**Approach:**
- API: `<ScreenHeader backLabel={string} onBack={() => void} title={ReactNode} backAriaLabel?={string} right?={ReactNode} className?={string} />`
- Renders inside `ScreenShell.Header` (caller continues to wrap, OR ScreenHeader takes the shell-header wrapping if cleaner — decide during implementation. Default plan: caller wraps, ScreenHeader is just the inner 3-cell layout, matches existing `<ScreenShell.Header className="flex items-center gap-2 pt-2 pb-3">` pattern).
- Spacer balance approach: render `right` if provided, otherwise render `<div className="w-12" />` matching BackButton's width. Auto-measured balance is a stretch goal; if `BackButton` width is stable (`min-h-[44px] px-2`, ~~48px wide), the static `w-12` is fine — document this and revisit only if BackButton's API changes.
- All four caller migrations are mechanical: replace the inline 3-line markup with `<ScreenHeader backLabel="..." onBack={...} title="..." />`.

**Patterns to follow:**
- Existing inline pattern at `app/src/screens/SettingsScreen.tsx` lines 109-115 is the canonical reference shape.
- Existing `BackButton` import path stays as `components/ui/BackButton` until U11 moves it; ScreenHeader imports from there.

**Test scenarios:**
- Happy path: renders BackButton with passed label, onClick wires through; renders title h1; renders default spacer matching BackButton width.
- Happy path: passing `right` prop renders that node in the right cell instead of spacer.
- Happy path: passing `backAriaLabel` overrides BackButton's accessible name.
- Edge case: title can be a ReactNode (icon + text), not just a string.
- Integration: SettingsScreen renders identical visual output (run the existing SettingsScreen test; should pass with no test changes after the migration commit).
- Integration: SafetyCheckScreen header (which has the most complex integration — uses screen-level `BackButton` with `label="Back"` + h1 "Before we start" + spacer) renders identical to pre-refactor.

**Verification:**
- `npm test -- --run src/screens/__tests__/SetupScreen.test.tsx src/screens/__tests__/SafetyCheckScreen.test.tsx src/screens/__tests__/SettingsScreen.test.tsx src/screens/__tests__/TuneTodayScreen.test.tsx` passes.
- All four callers' header markup is ≤ 6 lines.
- `git grep '<BackButton' app/src/screens` should match only inside `ScreenHeader.tsx` (unless a screen genuinely uses BackButton outside a ScreenHeader, which currently it doesn't).
- Manual visual verification: 390px viewport, the four screens look identical to pre-refactor.

---

- [ ] U5. **RunFlowHeader pattern primitive (P2)**

**Goal:** Extract the `SafetyIcon + 3-cell-grid eyebrow + counter` header used by RunScreen, TransitionScreen, and DrillCheckScreen into `components/ui/RunFlowHeader.tsx` (moved to `components/patterns/` in U11). Eyebrow and counter typography stays caller-owned (intentional focal-vs-status distinction between Run and Transition/DrillCheck).

**Requirements:** R2

**Dependencies:** None.

**Files:**
- Create: `app/src/components/ui/RunFlowHeader.tsx`
- Create: `app/src/components/ui/__tests__/RunFlowHeader.test.tsx`
- Modify: `app/src/components/ui/index.ts`
- Modify: `app/src/screens/RunScreen.tsx` (header block lines 171-195)
- Modify: `app/src/screens/TransitionScreen.tsx` (header block lines 112-127)
- Modify: `app/src/screens/DrillCheckScreen.tsx` (header block lines 125-135)

**Approach:**
- API: `<RunFlowHeader eyebrow={ReactNode} counter={ReactNode} className?={string} />`
- Renders `ScreenShell.Header` with `grid grid-cols-3 items-center pt-2 pb-3 className?`; left cell: `<SafetyIcon />` with `justify-self-start`; center cell: `eyebrow` with `justify-self-center`; right cell: `counter` with `justify-self-end`.
- The 40-line "why grid not flex" comment from RunScreen.tsx:171 lives ONCE on RunFlowHeader.tsx; deleted from the three callers.
- Caller-owned typography preserved by passing styled spans/text:
  - RunScreen: `eyebrow={<span className="text-sm font-semibold text-accent">{...blockEyebrowLabel}</span>}`, `counter={<span className="text-sm font-medium text-text-secondary">{n}/{total}</span>}`
  - Transition: `eyebrow={<span className="text-sm font-medium text-text-secondary">Transition</span>}`, `counter={<span className="text-sm font-medium text-text-secondary">Next: {n}/{total}</span>}`
  - DrillCheck: similar to Transition with "Drill check" eyebrow and "Last: N/M" counter

**Patterns to follow:**
- Existing inline pattern at `app/src/screens/RunScreen.tsx` lines 171-195 (canonical with the 40-line rationale comment).
- `SafetyIcon` import path stays `app/src/components/SafetyIcon` (out of consolidation scope).

**Test scenarios:**
- Happy path: renders the 3-cell grid with SafetyIcon left, eyebrow center, counter right.
- Happy path: passing styled `eyebrow` ReactNode preserves the styling (caller-owned typography contract).
- Edge case: empty `counter` collapses cleanly (right cell renders empty span; grid layout intact).
- Integration: RunScreen header matches pre-refactor markup exactly; eyebrow uses `font-semibold text-accent`; counter uses `font-medium text-text-secondary`.
- Integration: TransitionScreen header matches; both eyebrow and counter use `font-medium text-text-secondary`.
- Integration: DrillCheckScreen header matches; "Drill check" eyebrow and "Last: N/M" counter render correctly.

**Verification:**
- `npm test -- --run src/screens/__tests__/` passes for the three run-flow screens.
- `npm run test:e2e -- app/e2e/session-flow.spec.ts` passes.
- The "why grid not flex" comment exists in exactly one location (RunFlowHeader.tsx).
- Manual: 390px viewport, the three screens look identical; eyebrow center-alignment is preserved.

---

- [ ] U6. **JustFinishedPill pattern primitive (P8)**

**Goal:** Extract the verbatim copy-pasted "warm panel + success circle + drill name + 'Complete'/'Skipped'" pill from DrillCheckScreen and TransitionScreen into `components/ui/JustFinishedPill.tsx` (moved to `components/patterns/` in U11).

**Requirements:** R9

**Dependencies:** None.

**Files:**
- Create: `app/src/components/ui/JustFinishedPill.tsx`
- Create: `app/src/components/ui/__tests__/JustFinishedPill.test.tsx`
- Modify: `app/src/components/ui/index.ts`
- Modify: `app/src/screens/DrillCheckScreen.tsx` (lines 152-171)
- Modify: `app/src/screens/TransitionScreen.tsx` (lines 130-168)

**Approach:**
- API: `<JustFinishedPill drillName={string} status={'completed' | 'skipped'} />`
- Renders the existing pill markup: `flex items-start gap-2.5 rounded-[12px] bg-bg-warm p-3` outer; `bg-success` circle inner with check SVG (status='completed') or dash SVG (status='skipped'); drill name `font-semibold text-text-primary`; subtitle `text-sm text-success` ("Complete" or "Skipped").
- DrillCheckScreen always passes `status="completed"`; TransitionScreen passes `status={prevBlockStatus?.status === 'completed' ? 'completed' : 'skipped'}`.

**Patterns to follow:**
- Existing pill at `app/src/screens/DrillCheckScreen.tsx` lines 152-171 is the canonical shape; `app/src/screens/TransitionScreen.tsx` lines 130-168 has the dash variant.

**Test scenarios:**
- Happy path: status='completed' renders check SVG; status='skipped' renders dash SVG.
- Happy path: drill name renders as semibold text-primary; subtitle renders as success-colored.
- Edge case: long drill name doesn't break the pill layout (flex-wrap behavior).
- Integration: DrillCheckScreen renders the pill with `status="completed"` for the just-finished block; existing test continues to pass after migration.
- Integration: TransitionScreen with `prevBlockStatus.status === 'skipped'` renders the dash variant subtitled "Skipped".

**Verification:**
- `npm test -- --run src/screens/__tests__/DrillCheckScreen.perDrillCapture.test.tsx src/screens/__tests__/TransitionScreen` passes.
- The duplicated 20-line SVG markup exists in exactly one location.

---

- [ ] U7. **Disclosure + Expander atomic primitives (P4)**

**Goal:** Extract the verbatim "Add counts (optional)" / "Add longest streak (optional)" buttons in PerDrillCapture into `Disclosure` (collapsed-by-default reveal that replaces its trigger). Extract the SafetyCheckScreen heat-tips chevron expander into a separate `Expander` (trigger remains visible after expanding).

**Requirements:** R4 (Disclosure), R5 (Expander)

**Dependencies:** None.

**Files:**
- Create: `app/src/components/ui/Disclosure.tsx`
- Create: `app/src/components/ui/Expander.tsx`
- Create: `app/src/components/ui/__tests__/Disclosure.test.tsx`
- Create: `app/src/components/ui/__tests__/Expander.test.tsx`
- Modify: `app/src/components/ui/index.ts`
- Modify: `app/src/components/PerDrillCapture.tsx` (CountDrawer + StreakDrawer use Disclosure)
- Modify: `app/src/screens/SafetyCheckScreen.tsx` (heat expander uses Expander)

**Approach:**
- `Disclosure` API: `<Disclosure label={string} testId?={string} children={ReactNode} />`. Renders the underlined-accent 44px-tap-target button when collapsed; renders `children` when expanded. Owns local open state. Once expanded, the trigger is gone (consistent with PerDrillCapture's drawers — no re-collapse needed).
- `Expander` API: `<Expander trigger={ReactNode} children={ReactNode} ariaLabel?={string} />`. Trigger stays visible; chevron rotates on expand. The `trigger` slot accepts caller-owned styled content (heat icon + "Heat & safety tips" text) so each caller can style its trigger.
- PerDrillCapture's two drawer functions (`CountDrawer`, `StreakDrawer`) keep their internal `useState` no longer; they become children of `<Disclosure>`. The success-rule paragraph stays inside the children block.
- SafetyCheckScreen heat expander wraps its chevron-button + warning-callout + tips-callout in `<Expander>`.

**Patterns to follow:**
- Existing collapsed buttons at `app/src/components/PerDrillCapture.tsx` lines 232-240 and 304-312 (canonical Disclosure shape).
- Existing chevron-style at `app/src/screens/SafetyCheckScreen.tsx` lines 351-382 (canonical Expander shape).

**Test scenarios:**
- Disclosure happy path: starts collapsed showing the label; clicking reveals children; trigger is no longer visible after expand.
- Disclosure happy path: 44px min-height tap target; underlined-accent visual; focus-visible ring.
- Expander happy path: starts collapsed; trigger stays visible; clicking toggles children visibility; chevron rotates.
- Expander edge case: children can be empty (no crash); trigger toggles aria-expanded correctly.
- Integration: PerDrillCapture CountDrawer — initial state shows "Add counts (optional)" button; tap reveals the success rule paragraph + PassMetricInput; existing test (`per-drill-add-counts` testId) continues to find the trigger.
- Integration: PerDrillCapture StreakDrawer — same shape, different label, different children.
- Integration: SafetyCheckScreen heat expander — initial state shows "Heat & safety tips" trigger with chevron; tap reveals warning + tips callouts; chevron rotates on expand.

**Verification:**
- `npm test -- --run src/components/__tests__/PerDrillCapture.test.tsx src/screens/__tests__/SafetyCheckScreen.test.tsx` passes.
- The duplicated 7-class string in PerDrillCapture is gone.
- `data-testid="per-drill-add-counts"` and `data-testid="per-drill-add-streak"` continue to resolve (Disclosure passes `testId` through).

---

- [ ] U8. **ConfirmModal pattern primitive (P5)**

**Goal:** Extract the `title + description + safe-primary + secondary-or-danger` modal composition into `components/ui/ConfirmModal.tsx` (moved to `components/patterns/` in U11) over `ActionOverlay`. Migrate SoftBlockModal, SkipReviewModal, RunScreen end-session sheet, and ResumePrompt's discard-step. Uses U2's typed-focus seam internally.

**Requirements:** R6

**Dependencies:** U2 (typed-focus seam) — hard dependency.

**Files:**
- Create: `app/src/components/ui/ConfirmModal.tsx`
- Create: `app/src/components/ui/__tests__/ConfirmModal.test.tsx`
- Modify: `app/src/components/ui/index.ts`
- Modify: `app/src/components/SoftBlockModal.tsx`
- Modify: `app/src/components/SkipReviewModal.tsx`
- Modify: `app/src/components/ResumePrompt.tsx` (discard-step block uses ConfirmModal; outer "Session in progress" surface stays on raw ActionOverlay)
- Modify: `app/src/screens/RunScreen.tsx` (end-session sheet block; uses `placement="bottom-sheet"`)

**Approach:**
- API:
  ```ts
  type ConfirmAction = { label: string; onClick: () => void; variant?: ButtonVariant; disabled?: boolean }
  type ConfirmModalProps = {
    title: string
    description?: ReactNode
    safeAction: ConfirmAction         // gets initial focus
    destructiveAction?: ConfirmAction // optional, rendered below safe-primary
    onDismiss: () => void
    role?: 'dialog' | 'alertdialog'   // defaults 'dialog'
    placement?: 'centered' | 'bottom-sheet' // defaults 'centered'
    showCloseButton?: boolean
  }
  ```
- Internally creates `useRef<HTMLButtonElement>(null)`, attaches it to the safe-primary button, passes as `initialFocusRef` to `ActionOverlay`.
- `placement="bottom-sheet"` adds `className="items-end px-4 pb-8 pt-4"` to ActionOverlay (matches RunScreen's existing end-session sheet positioning).
- `safeAction.variant` defaults to `'primary'`; `destructiveAction.variant` defaults to `'danger'` but can be overridden (`'outline'` for SoftBlockModal's "Skip review and continue").
- Migrations are mechanical:
  - SoftBlockModal: `<ConfirmModal title="Finish your review first?" description={...} safeAction={{ label: 'Finish review', onClick: onFinish }} destructiveAction={{ label: 'Skip review and continue', onClick: onSkipAndContinue, variant: 'outline' }} onDismiss={onClose} showCloseButton />`
  - SkipReviewModal: similar, both actions have explicit copy.
  - RunScreen end-session: `placement="bottom-sheet"`, safe="Go back", destructive="End session" (variant: 'danger').
  - ResumePrompt's confirming-state block becomes `<ConfirmModal>` mounted instead of the raw two-Button block (the outer ActionOverlay continues to wrap; on confirming-state the children swap to a ConfirmModal-shaped subtree — actually, simpler: ResumePrompt's confirming step is the END of the flow, so the cleanest refactor is two separate top-level overlays mounted on state. Decide in implementation.)

**Patterns to follow:**
- The existing 4-caller pattern shows the canonical shape; ConfirmModal codifies it.
- `Button` variant prop surface is the reference for action-variant typing.

**Test scenarios:**
- Happy path: renders title + description + safe-primary button with initial focus + optional destructive button.
- Happy path: clicking safe action calls `safeAction.onClick`; clicking destructive calls `destructiveAction.onClick`.
- Happy path: `placement="bottom-sheet"` applies bottom-sheet positioning classes; `'centered'` uses default centered layout.
- Edge case: omitting `destructiveAction` renders only the safe-primary button.
- Edge case: `destructiveAction.variant="outline"` (SoftBlockModal case) renders the secondary button as outline-styled, not danger-styled.
- Integration: SoftBlockModal renders the confirm-shape with "Finish review" focused on mount; clicking "Skip review and continue" calls `onSkipAndContinue`.
- Integration: SkipReviewModal — "Never mind" focused; clicking "Yes, skip" calls `onConfirm`.
- Integration: RunScreen end-session — `placement="bottom-sheet"` renders at the bottom; "Go back" focused; clicking "End session" calls `handleEndSessionConfirmOnce`.
- Integration: ResumePrompt confirming step — "Keep session" focused; clicking "Yes, discard session" calls `onDiscard`.

**Verification:**
- `npm test -- --run` passes for all 4 modal callers + new ConfirmModal tests.
- `npm run test:e2e -- app/e2e/session-flow.spec.ts app/e2e/edge-cases.spec.ts app/e2e/accessibility.spec.ts` passes.
- `git grep 'data-action-overlay-initial-focus'` returns 0 results in `app/src/`.
- Manual: open each of the 4 confirm surfaces in dev server, verify focus lands on safe-primary, Escape dismisses, button order is safe-primary first.

---

- [ ] U9. **Callout atomic primitive (P6)**

**Goal:** Extract the inline `tone × emphasis × size` callout panels (heat warning, heat tips, PainOverrideCard outer, Settings export-success, StatusMessage error body) into a single `components/ui/Callout.tsx`. `StatusMessage` keeps its semantic role and uses Callout internally for the error variant.

**Requirements:** R7

**Dependencies:** None.

**Files:**
- Create: `app/src/components/ui/Callout.tsx`
- Create: `app/src/components/ui/__tests__/Callout.test.tsx`
- Modify: `app/src/components/ui/index.ts`
- Modify: `app/src/components/ui/StatusMessage.tsx` (error variant body uses Callout)
- Modify: `app/src/screens/SafetyCheckScreen.tsx` (heat warning + heat tips callouts)
- Modify: `app/src/components/PainOverrideCard.tsx` (outer warning panel uses Callout)
- Modify: `app/src/screens/SettingsScreen.tsx` (success message uses Callout)

**Approach:**
- API:
  ```ts
  type CalloutTone = 'info' | 'warning' | 'success'
  type CalloutEmphasis = 'flat' | 'hairline'
  type CalloutSize = 'md' | 'sm'
  type CalloutProps = {
    tone: CalloutTone
    emphasis?: CalloutEmphasis  // default 'flat'
    size?: CalloutSize          // default 'md'
    role?: 'alert' | 'status'   // surfaces aria-live where caller wants it
    className?: string
    children: ReactNode
  }
  ```
- Tone × emphasis × size matrix:
  - `tone="warning" emphasis="hairline"` → `rounded-[12px] border border-warning/30 bg-warning-surface p-4` (heat warning)
  - `tone="warning" emphasis="flat" size="md"` → `rounded-[12px] bg-warning-surface p-4` (PainOverrideCard outer)
  - `tone="warning" size="sm"` → `rounded-[12px] bg-warning-surface px-4 py-3 text-center text-sm font-medium text-warning` (StatusMessage error body)
  - `tone="info" emphasis="flat"` → `rounded-[12px] bg-info-surface p-4` (heat tips)
  - `tone="success" size="sm"` → `rounded-[12px] bg-success/10 px-4 py-3 text-center text-sm font-medium text-success` (Settings export success)
- StatusMessage's error variant becomes:
  ```tsx
  case 'error':
    return <Callout tone="warning" size="sm" role="alert">{props.message}</Callout>
  ```
  Preserves the existing `<p>` markup contract via Callout's element choice (Callout renders `<div>` by default; the StatusMessage caller's `role="alert"` carries the semantic).

**Patterns to follow:**
- Existing inline panels are the source of the class-string contract; Callout codifies them.
- `Button` variant pattern is the reference for the (tone, emphasis, size) lookup table.

**Test scenarios:**
- Happy path: each tone × emphasis × size combination produces the documented class string (snapshot or class-equality assertion).
- Happy path: `role="alert"` renders with `role="alert"`; default omits role.
- Edge case: `className` prop appends to internal classes (caller can extend).
- Integration: StatusMessage error variant renders identical visual output to pre-refactor; existing tests pass.
- Integration: SafetyCheckScreen heat warning Callout renders with hairline border + warning surface; heat tips Callout renders without border.
- Integration: PainOverrideCard outer panel becomes `<Callout tone="warning" emphasis="flat">` — children unchanged; visual identical.
- Integration: SettingsScreen export-success message renders with success tone + sm size + `role="status"`.

**Verification:**
- `npm test -- --run` passes (all migrated callers + Callout tests).
- Visual diff on the 5 affected surfaces: identical to pre-refactor.

---

- [ ] U10. **NumberCell atomic primitive (P7)**

**Goal:** Extract the duplicated large-numeric tap-to-type input from `PassMetricInput.NumberCell` and `PerDrillCapture.StreakInput` into a single `components/ui/NumberCell.tsx` with an optional `validate` callback for the per-caller validation difference.

**Requirements:** R8

**Dependencies:** None on prior units; benefits from U9 if Callout absorbs the streak invalid-message paragraph (decide during implementation — U10 can ship without U9).

**Files:**
- Create: `app/src/components/ui/NumberCell.tsx`
- Create: `app/src/components/ui/__tests__/NumberCell.test.tsx`
- Modify: `app/src/components/ui/index.ts`
- Modify: `app/src/components/PassMetricInput.tsx` (NumberCell becomes a thin wrapper or deleted)
- Modify: `app/src/components/PerDrillCapture.tsx` (StreakInput uses NumberCell)

**Approach:**
- API:
  ```ts
  type NumberCellProps = {
    label: string
    value: number
    onCommit: (next: number) => void
    validate?: (next: number) => number | null  // return null to reject; transform to clamp
    disabled?: boolean
    placeholder?: string                         // default '0'
    invalidMessage?: string                      // shown when validate returns null
    helperText?: string                          // shown below input
    testId?: string
    inputClassName?: string
  }
  ```
- Owns: `useId` for label/input wiring; local text state; empty-zero placeholder rule (`valueToDisplayText`); blur/Enter commit; `inputMode="numeric" pattern="[0-9]*"`; `aria-invalid` + `aria-describedby` wiring; the canonical input chrome (`h-16 w-28 rounded-[12px] border-2 border-text-primary/20 ...`).
- `validate` callback shape:
  - PassMetricInput Good cell: `validate={(next) => Math.max(0, next)}` (clamp to non-negative; auto-bump to total handled in `onCommit`)
  - PassMetricInput Total cell: `validate={(next) => Math.max(good, Math.max(0, next))}`
  - PerDrillCapture StreakInput: `validate={(next) => validateStreakLongest(next)}` (returns null for invalid; the helper rejects out-of-range and non-integers)
- Invalid-message rendering: when `validate` returns null AND the user committed something, NumberCell renders `<p className="text-sm text-text-secondary" role="alert">{invalidMessage}</p>` below the input. PerDrillCapture passes `invalidMessage="Use a whole number. This result will be skipped unless fixed."`. PassMetricInput omits `invalidMessage` (clamping never returns null).

**Execution note:** Land NumberCell with existing test coverage from PassMetricInput and PerDrillCapture migrating to assert against the new structure — these are the most subtle React-state-during-render patterns in the consolidation; do NOT skip the test migration.

**Patterns to follow:**
- Existing `app/src/components/PassMetricInput.tsx` `NumberCell` (lines 115-203) and `valueToDisplayText` (lines 111-113) — canonical reference.
- Existing `app/src/components/PerDrillCapture.tsx` `StreakInput` (lines 349-451) — variant with validate-returns-null path.
- Existing tests at `app/src/components/__tests__/PassMetricInput.test.tsx` and `PerDrillCapture.test.tsx` cover the empty-zero, blur-commit, and invalid-input behaviors.

**Test scenarios:**
- Happy path: typing a number then blurring calls `onCommit` with that number; rendered value reflects parent's value.
- Happy path: empty input + blur calls `onCommit(0)` and renders placeholder (not the literal "0").
- Happy path: pressing Enter blurs the input (triggers commit).
- Edge case: parent re-pushes `value === 0` → input renders empty (placeholder), not "0" string.
- Edge case: `validate` returning null shows `invalidMessage` and does not call `onCommit` (or calls with null/0 per current StreakInput contract — preserve exactly).
- Edge case: `validate` returning a clamped number commits the clamped value (PassMetricInput behavior).
- Edge case: `disabled=true` prevents input, applies disabled styling, no commit fires.
- Edge case: typing partial input then blurring without committing rolls back to the parent's value (existing NumberCell behavior).
- Integration: PassMetricInput Good cell + Total cell still respect the `good ≤ total` invariant via the `validate` callbacks.
- Integration: PerDrillCapture StreakInput rejects `1.5` with the invalid-message; rejects `-3`; accepts `5`; accepts empty (commits null).
- Integration: hydration parity — when StreakInput's parent value changes from null to a meaningful integer, the input updates (existing snapshot-tracking behavior preserved).

**Verification:**
- `npm test -- --run src/components/__tests__/PassMetricInput.test.tsx src/components/__tests__/PerDrillCapture.test.tsx` passes.
- The duplicated 80-line NumberCell + 100-line StreakInput is reduced to ~50 lines of NumberCell + 2 thin caller call-sites.

---

- [ ] U11. **components/patterns/ folder split (S3)**

**Goal:** Move Volleycraft-shaped composites (`ScreenHeader`, `RunFlowHeader`, `ConfirmModal`, `JustFinishedPill`, `BackButton`) from `components/ui/` to `components/patterns/`. Add `components/patterns/index.ts`. Re-export from `components/ui/index.ts` for back-compat. Update tests' import paths.

**Requirements:** R12

**Dependencies:** U4 (ScreenHeader), U5 (RunFlowHeader), U8 (ConfirmModal), U6 (JustFinishedPill) — all the new pattern primitives must exist before they can be moved.

**Files:**
- Create: `app/src/components/patterns/index.ts`
- Move: `app/src/components/ui/ScreenHeader.tsx` → `app/src/components/patterns/ScreenHeader.tsx`
- Move: `app/src/components/ui/RunFlowHeader.tsx` → `app/src/components/patterns/RunFlowHeader.tsx`
- Move: `app/src/components/ui/ConfirmModal.tsx` → `app/src/components/patterns/ConfirmModal.tsx`
- Move: `app/src/components/ui/JustFinishedPill.tsx` → `app/src/components/patterns/JustFinishedPill.tsx`
- Move: `app/src/components/ui/BackButton.tsx` → `app/src/components/patterns/BackButton.tsx`
- Move: corresponding tests in `app/src/components/ui/__tests__/` → `app/src/components/patterns/__tests__/`
- Modify: `app/src/components/ui/index.ts` (re-export the 5 moved symbols from `components/patterns/` for back-compat)
- Modify: internal cross-imports (e.g., ScreenHeader imports BackButton — update path)

**Approach:**
- Git-aware move so history is preserved: `git mv <src> <dst>` for each file (test files included).
- Each moved file: only its internal cross-imports (within `components/`) need updating; absolute or path-relative imports from outside `components/` continue to resolve via the ui-barrel re-export.
- `components/ui/index.ts` adds:
  ```ts
  // Back-compat re-exports of moved primitives. New code should import from
  // 'components/patterns' directly.
  export { ScreenHeader } from '../patterns/ScreenHeader'
  export { RunFlowHeader } from '../patterns/RunFlowHeader'
  export { ConfirmModal } from '../patterns/ConfirmModal'
  export { JustFinishedPill } from '../patterns/JustFinishedPill'
  export { BackButton } from '../patterns/BackButton'
  ```
- `components/patterns/index.ts` exports the same 5 from their new locations.
- Existing call-site imports like `import { BackButton, Button, ScreenShell } from '../components/ui'` continue to work unchanged.

**Patterns to follow:**
- Existing `components/ui/index.ts` as the barrel pattern.
- Existing `components/home/` and `components/run/` as precedent for non-`ui/` component subfolders.

**Test scenarios:**
- Happy path: importing `BackButton` from `'../components/ui'` resolves via re-export; renders identically.
- Happy path: importing `ConfirmModal` from `'../components/patterns'` resolves directly.
- Test expectation: the existing test files for each moved component continue to pass after move (no test logic changes; only file paths shift).

**Verification:**
- `npm run build` succeeds.
- `npm test -- --run` passes (all tests, including the moved tests in their new location).
- `npm run lint` passes.
- `git log --follow app/src/components/patterns/BackButton.tsx` shows the full history pre-move (validates git-aware move).

---

- [ ] U12. **ESLint guardrail rule (G1)**

**Goal:** Add a custom local ESLint rule (`volleycraft/no-inline-primitive-drift`) that fails when forbidden inline patterns appear in `app/src/screens/` or `app/src/components/` outside the primitive that owns them. Wire it into `app/eslint.config.js`. Cleanup pass: fix any latent violations the rule surfaces. Document the rule + named patterns in `.cursor/rules/component-patterns.mdc`.

**Requirements:** R13

**Dependencies:** U1–U11 (all primitives must exist before the rule can name them).

**Files:**
- Create: `app/eslint-rules/no-inline-primitive-drift.js` (the rule implementation)
- Create: `app/eslint-rules/index.js` (plugin entry point, exports rules)
- Create: `app/eslint-rules/__tests__/no-inline-primitive-drift.test.js` (rule tester suite using `eslint.RuleTester`)
- Modify: `app/eslint.config.js` (load and enable the local rule)
- Modify: `.cursor/rules/component-patterns.mdc` (add the new primitive names + the rule's enforcement contract)
- Modify: any files where the cleanup pass surfaces violations (likely 0 files if U1–U11 were thorough; budget for a 2–4 file follow-up)

**Approach:**
- Rule checks (one rule, multiple checks via the `messageId` pattern):
  1. **`forbiddenRadiogroup`**: JSXElement with `role="radiogroup"` attribute, in any file under `app/src/screens/` or `app/src/components/` except `app/src/components/ui/ChoiceRow.tsx` and `__tests__/`. Message: "Use `<ChoiceRow>` from `components/ui` instead of inlining `role=\"radiogroup\"`."
  2. **`forbiddenFocusAttr`**: JSXElement with `data-action-overlay-initial-focus` attribute. Message: "The `data-action-overlay-initial-focus` attribute is removed. Pass `initialFocusRef` to `ActionOverlay` (or use `<ConfirmModal>` from `components/patterns`)."
  3. **`forbiddenJustFinishedPill`** (heuristic): JSXElement with className matching the regex `/bg-bg-warm.*p-3.*flex/` AND containing a child JSXElement with className matching `/bg-success.*rounded-full/`. Pragmatic detection — false-positive rate likely low because the combined shape is specific. Message: "Use `<JustFinishedPill>` from `components/patterns` for the just-finished pill markup."
  4. **`forbiddenScreenHeaderTrio`** (heuristic): a JSX subtree under `<ScreenShell.Header>` containing `<BackButton>` AND an `<h1>` AND a sibling `<div className="w-12" />` (or width-equivalent). Message: "Use `<ScreenHeader>` from `components/patterns` for the back-button + title + spacer header pattern."
  5. **`forbiddenInlineCallout`** (heuristic): JSXElement with className containing `bg-warning-surface` or `bg-info-surface` or `bg-success/10` AND class string length > 30 chars (suggests a styled panel, not a tiny badge). Message: "Use `<Callout>` from `components/ui` for warning/info/success panels. Inline only allowed on small badges."
- All checks accept exemption via inline `// eslint-disable-next-line volleycraft/no-inline-primitive-drift -- <reason>` comment. Disables without a reason are flagged separately by a follow-up rule (out of scope this plan).
- Rule lives at `app/eslint-rules/no-inline-primitive-drift.js`; loaded into `eslint.config.js` via:
  ```js
  import volleycraft from './eslint-rules/index.js'
  // in the main config block:
  plugins: { volleycraft },
  rules: { 'volleycraft/no-inline-primitive-drift': 'error' },
  ```
- Cleanup pass: after rule lands, run `npm run lint` and fix every violation it surfaces. Most likely surfaces: lingering inline panels U9 didn't catch, leftover `data-action-overlay-initial-focus` attributes from a missed caller. Each cleanup edit gets its own commit with a "lint cleanup: <pattern>" message.
- `.cursor/rules/component-patterns.mdc` updates: add a new section "## Drift Guardrail" listing the 5 forbidden patterns with their canonical primitives.

**Execution note:** Build the rule's test suite (RuleTester) BEFORE wiring the rule to the project — characterize the rule's behavior on synthetic violation files so false-positives are caught before they block CI.

**Patterns to follow:**
- ESLint custom rule docs (https://eslint.org/docs/latest/extend/custom-rules) — flat-config-compatible plugin shape.
- Existing `app/scripts/check-architecture-boundaries.mjs` is the precedent for "structural test that fails when forbidden patterns appear" (different mechanism — file scan vs AST traversal — but same intent).

**Test scenarios:**
- Each rule check has positive AND negative test cases in `RuleTester`:
  - Positive: a synthetic file with the forbidden pattern produces the expected error message.
  - Negative: a synthetic file with the pattern inside the allowed primitive (e.g., `role="radiogroup"` inside `ChoiceRow.tsx`) produces no error.
  - Negative: a file with an inline `eslint-disable-next-line` comment with a reason produces no error.
- Edge case: a screen file using `<ChoiceRow>` correctly (no inline `role="radiogroup"`) produces no error.
- Edge case: the cleanup pass leaves the codebase with `npm run lint` exit code 0.

**Verification:**
- `npm run lint` passes on the post-cleanup codebase.
- `npm test -- --run app/eslint-rules/__tests__/` passes.
- `git grep 'role="radiogroup"' app/src/components app/src/screens` returns matches only inside `ChoiceRow.tsx` and `__tests__/`.
- `git grep 'data-action-overlay-initial-focus' app/src/` returns 0 results.
- Synthetic regression: introduce a deliberate `<div role="radiogroup">` in `app/src/screens/SetupScreen.tsx`, run `npm run lint`, confirm the rule fires with the expected message; revert the synthetic change.
- `.cursor/rules/component-patterns.mdc` includes the "Drift Guardrail" section with all 5 forbidden patterns.

---

## System-wide impact

- **Interaction graph:** ConfirmModal extraction (U8) wraps ActionOverlay; the focus-management mechanism (U2) changes for all 5 modal callers. Carefully test focus restoration on each modal.
- **Error propagation:** No changes to error paths; StatusMessage's error variant gains a Callout body but its API and consumers unchanged.
- **State lifecycle risks:** Disclosure (U7) owns local open state; PerDrillCapture's CountDrawer/StreakDrawer lose their internal `useState` and become stateless children of Disclosure. Verify no stale-state regressions.
- **API surface parity:** `BackButton` is importable from both `components/ui` (back-compat re-export) and `components/patterns` (canonical) after U11. `FOCAL_SURFACE_CLASS` and `ELEVATED_PANEL_SURFACE` are importable from both `components/ui/Card` (back-compat) and `components/ui/surfaces` (canonical) after U1.
- **Integration coverage:** ChoiceRow's per-option-tone case (U3) is not provable by unit tests alone; rely on the SafetyCheckScreen integration test for the Recency mixed-tone case. ConfirmModal's bottom-sheet placement (U8) is similarly an integration concern; rely on the RunScreen end-session test.
- **Unchanged invariants:** `ScreenShell` API is unchanged. `Button` variants are unchanged. `Card` variants (`'soft'` / `'focal'`) are unchanged. `ToggleChip` API is unchanged. Tailwind v4 token surface is unchanged. The `.cursor/rules/data-access.mdc` layer model is unchanged (this plan touches only the screen + component layers, not domain/services/platform).
- **Architecture boundaries:** `npm run architecture:check` should continue to pass — none of the moves cross a layer boundary (all stay in `components/` and `screens/`).

---

## Risks & dependencies

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| U2 focus-attribute fix regresses modal-focus behavior across all 5 callers | Med | High | RTL tests assert `document.activeElement` equals the passed `initialFocusRef.current` for each modal post-mount. Ship caller migrations one-per-commit so bisect can name the regression. Fall back to keeping the legacy `data-` attribute query path as a secondary fallback during U2. |
| U9 Callout swallowing inline panels destabilizes pixel-rendering on PainOverrideCard / heat panels | Low | Med | Class-string snapshot tests on each Callout tone × emphasis × size combination. Founder visual verification on iPhone viewport before merging U9. |
| U3 ChoiceRow API doesn't survive the per-option-tone case | Low | Med | API explicitly accepts per-option tone in the `options` array. SafetyCheckScreen Recency test verifies the warning chip renders with warning tone at runtime. |
| U12 ESLint rule produces false positives that block CI | Med | Low | RuleTester suite covers positive/negative cases per check. Inline `eslint-disable-next-line` escape valve documented. Heuristic checks (JustFinishedPill shape, ScreenHeader trio, inline Callout) are tuned conservatively — better to miss a real violation than to false-positive on legitimate code. |
| U11 folder split causes hidden import-path breakages | Low | Med | Back-compat re-exports from `components/ui/index.ts` keep all current imports working. Run `npm run build` + `npm run lint` after the move. The follow-up cleanup PR migrates remaining import paths. |
| U8 ConfirmModal API doesn't fit ResumePrompt's two-state confirming flow | Med | Med | API supports 1 or 2 actions; ResumePrompt's two-state flow becomes two separate ConfirmModal mounts on state, not a 3-button API. If implementation reveals this is awkward, fall back to keeping ResumePrompt's discard-step as raw ActionOverlay (skip migrating that one caller) — accepted scope reduction. |
| Coordination conflict with in-flight plan-007 (ChoiceSection) | Med | Low | U3 explicitly absorbs plan-007's remaining work. Mark plan-007 superseded once U3 lands. If plan-007 is mid-PR, wait for it to merge before starting U3. |
| Cleanup pass under U12 surfaces more violations than expected, blocking the close-out | Low | Med | Each cleanup violation gets its own atomic commit; if the cleanup load exceeds ~6 files, split into a follow-up PR and ship U12 with the rule + docs only (rule starts as `'warn'` until cleanup completes, then promoted to `'error'`). |
| `BackButton` move (U11) breaks .cursor rules or AGENTS.md routing references | Low | Low | `.cursor/rules/component-patterns.mdc` updates in U12 to reference the new path; back-compat re-export keeps the old path working for any docs referencing it. |
| The plan's 12 units can't all land before founder dogfeed feedback returns and demands shape changes | Med | Low | Each unit is independently shippable. If a founder-feedback shape change lands mid-plan, the un-started units can rebase against it; the units already shipped don't regress. |
| Architecture-strategist findings I haven't fully read may contradict a unit-level decision | Low | Low | Re-read the architecture-strategist transcript (62KB) before starting U2 (the focus-attribute fix is the most architecturally load-bearing unit). If contradictions surface, course-correct in U2 rather than mid-plan. |

---

## Documentation / operational notes

- Update `.cursor/rules/component-patterns.mdc` in U12 with: (a) the new primitive names (ScreenHeader, RunFlowHeader, ChoiceRow, ChoiceSubsection, ConfirmModal, JustFinishedPill, Callout, NumberCell, Disclosure, Expander), (b) the `components/ui/` vs `components/patterns/` boundary, (c) the surfaces.ts location for surface tokens, (d) the new "Drift Guardrail" section listing forbidden inline patterns.
- Mark `docs/plans/2026-05-04-007-feat-app-wide-choice-ui-consistency-plan.md` as `status: superseded` in U3, with frontmatter pointer to this plan.
- Mark `docs/brainstorms/2026-05-04-app-wide-choice-ui-consistency-requirements.md` as `status: superseded` in U3 with frontmatter pointer to `docs/brainstorms/2026-05-04-ui-primitive-consolidation-requirements.md`.
- Update `docs/catalog.json` after the rename/folder reshuffles if the catalog references any of the moved primitives (likely no — catalog tracks docs, not source files).
- No production rollout plan needed — this is a UI refactor with no new features; the founder PWA picks it up on the next deploy.
- Run `npm run architecture:check` after each unit lands as a smoke test; the rule should continue to pass throughout.

---

## Sources & references

- **Origin document:** [docs/brainstorms/2026-05-04-ui-primitive-consolidation-requirements.md](docs/brainstorms/2026-05-04-ui-primitive-consolidation-requirements.md)
- **In-flight coordination:** [docs/plans/2026-05-04-007-feat-app-wide-choice-ui-consistency-plan.md](docs/plans/2026-05-04-007-feat-app-wide-choice-ui-consistency-plan.md) — superseded by this plan once U3 lands
- **In-flight requirements:** [docs/brainstorms/2026-05-04-app-wide-choice-ui-consistency-requirements.md](docs/brainstorms/2026-05-04-app-wide-choice-ui-consistency-requirements.md) — superseded by this plan's origin once U3 lands
- **Cursor rules:** [.cursor/rules/component-patterns.mdc](.cursor/rules/component-patterns.mdc), [.cursor/rules/data-access.mdc](.cursor/rules/data-access.mdc), [.cursor/rules/testing.mdc](.cursor/rules/testing.mdc), [.cursor/rules/routing.mdc](.cursor/rules/routing.mdc)
- **Audit thread:** Conversation 2026-05-04, deep `/shadcn` + `/ce-frontend-design` + `/ce-architecture-strategist` pass
- **Institutional learning:** [docs/solutions/2026-05-04-source-backed-content-depth-activation-pattern.md](docs/solutions/2026-05-04-source-backed-content-depth-activation-pattern.md) — "generalize on the second instance, not the first"
