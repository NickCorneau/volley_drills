---
id: plan-2026-04-19-feat-phase-f9-button-consolidation-and-hover-rollback
title: Phase F9 — Button consolidation and F6 hover rollback
status: in_progress
stage: 2
type: plan
authority: supporting
summary: >-
  Unifies five inline text-link buttons and three inline back buttons onto
  shared primitives (`Button variant="link"`, new `BackButton`), and rolls
  back the Phase F6 card-level `hover:` darkening since the cards
  themselves are not click targets. Keeps the tactile `active:` darkening,
  which fires legitimately on button press.
last_updated: 2026-04-19
depends_on:
  - plan-2026-04-19-feat-phase-f1-home-calm-pass
  - plan-2026-04-19-feat-phase-f6-home-hover-press-darkening
  - plan-2026-04-19-feat-phase-f7-post-manual-testing-polish
related:
  - ref://docs/research/japanese-inspired-visual-direction.md
  - ref://docs/specs/m001-phase-c-ux-decisions.md
---

## Agent Quick Scan

- Scope: one focused pass that consolidates button chrome and fixes a UX
  misfire from F6. Two concerns, one commit, because they share the
  "button consistency" thread surfaced during manual testing.
- Out of scope: typography (section `h2` sizing, eyebrow text styling)
  is being handled in parallel as a separate `Phase F8 — Typography
  foundation` pass by another in-flight session. This plan does **not**
  touch those surfaces.

## Why this phase exists

Two observations from post-F7 manual testing:

1. **Hover on non-clickable cards misleads.** Phase F6 added
   `hover:bg-text-primary/5 active:bg-text-primary/10` to
   `PRIMARY_CARD_CLASS` and `SECONDARY_ROW_CLASS`. The `active:` half
   is genuine tactile feedback — CSS `:active` propagates to ancestors
   during mousedown, so a button press inside the card darkens the
   whole card, which reinforces "you pressed something real." But the
   `hover:` half fires on any mouse-over, not just on a clickable
   element. Because the cards themselves are not click targets (each
   variant wraps one primary CTA plus optional tertiary links), the
   hover darkening implied clickability that does not exist.
2. **Button chrome has drifted.** Auditing across screens surfaced
   two drift pockets:
   - **Back buttons** on `SettingsScreen`, `SetupScreen`, and
     `SafetyCheckScreen`. All three render a left-arrow + label in
     the top-left header, but `SetupScreen`'s was missing
     `min-h-[44px]` and `px-2` entirely, so it was a smaller tap
     target than the other two.
   - **Tertiary text-links** in five places — `HomePrimaryCard`
     (`Skip review`, `Change setup`, `Start a different session`),
     `SkillLevelScreen` (`Not sure yet`), and `ReviewScreen` (`Finish
     later`). All five wanted the same visual treatment (muted
     text-secondary, subtle underline, 44 px tap target), but they
     had drifted on centering (`text-center` vs `mx-auto`), font
     weight (`font-medium` present or absent), underline offset, and
     focus/disabled states.

Consolidating both onto primitives eliminates future drift and gives
a single place to add tactile press feedback.

## Scope

### Rollback (F6 hover only, keep active)

- `HomePrimaryCard.tsx` — `PRIMARY_CARD_CLASS` drops
  `hover:bg-text-primary/5`, keeps `active:bg-text-primary/10`.
- `HomeSecondaryRow.tsx` — `SECONDARY_ROW_CLASS` drops the same,
  keeps the same.

### New primitive: `BackButton`

- `app/src/components/ui/BackButton.tsx` — new file.
- Props: `{ label: string; onClick: () => void; 'aria-label'?: string;
  className?: string }`.
- Visual: `min-h-[44px] px-2 text-sm text-accent transition-colors
  active:text-accent-pressed focus-visible:outline-none
  focus-visible:ring-2 focus-visible:ring-accent`.
- Composition: `<span aria-hidden="true">&larr;</span> {label}`.
- Accessibility: `aria-label` defaults to `"Back"` when
  `label === "Back"` and `"Back to {label}"` otherwise; callers can
  override for destinations that read awkwardly in the default form.
- Re-exported from `app/src/components/ui/index.ts`.

### New `Button` variant: `link`

- `app/src/components/ui/Button.tsx` — `ButtonVariant` gains
  `'link'`; `variantStyles.link` is:
  ```
  min-h-[44px] mx-auto px-3
  text-sm font-medium text-text-secondary
  underline underline-offset-2
  active:text-text-primary
  disabled:opacity-50
  + focus ring
  ```
- `mx-auto` (content-width, centered) is the consolidated layout;
  consumers that previously used `text-center` (full-width) for
  `Skip review` / `Change setup` adopt the compact pill form.

### Screen refactors

- `SettingsScreen.tsx` — `<button>` back button → `<BackButton
  label="Back" ...>`.
- `SafetyCheckScreen.tsx` — same.
- `SetupScreen.tsx` — `<button>` back button → `<BackButton
  label={isOnboarding ? 'Skill level' : 'Home'} ...>` (normalises
  the smaller tap target to match the other two).
- `HomePrimaryCard.tsx` — three tertiary `<button>` elements
  (`Skip review`, `Change setup`, `Start a different session`) →
  `<Button variant="link">`.
- `SkillLevelScreen.tsx` — `Not sure yet` tertiary `<button>` →
  `<Button variant="link">`.
- `ReviewScreen.tsx` — `Finish later` tertiary `<button>` →
  `<Button variant="link">`.

## Not doing in this pass

- Typography changes (section `h2` sizing, primary-card eyebrow
  styling). Owned by the parallel `Phase F8 — Typography foundation`
  plan.
- Changing the pre-Phase-F unused component `PlayerToggle`.
- Touching `RunScreen` controls — those have a separate control-
  cluster treatment that warrants its own pass.

## Validation

- `npm test -- --run` passes (existing coverage hits every refactored
  button by role, so the component swaps are validated transparently).
- Visual check on the four Home variants, SkillLevel "Not sure yet",
  Review "Finish later", and all three back-button headers.
- Manual hover check on desktop: primary-card and secondary-row
  surfaces no longer darken on hover; they still darken on press.
- Manual tap check on mobile: the three back buttons now feel
  identically sized.
