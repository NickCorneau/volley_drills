---
id: plan-2026-04-19-feat-phase-f11-clickable-hover-restore
title: Phase F11 — Clickable-element hover restore
status: landed
stage: 2
landed_on: 2026-04-19
type: plan
authority: supporting
summary: >-
  Extends the Phase F9 rule ("cards aren't click targets, so they don't get
  hover") to its logical completion: every clickable primitive — Button
  variants, BackButton, inline chips, icon-buttons, modal close buttons —
  gains a `hover:` state that mirrors its existing `active:` press state.
  Non-clickable container surfaces (cards, rows) keep press-only feedback.
last_updated: 2026-04-19
depends_on:
  - plan-2026-04-19-feat-phase-f6-home-hover-press-darkening
  - plan-2026-04-19-feat-phase-f7-post-manual-testing-polish
  - plan-2026-04-19-feat-phase-f9-button-consolidation-and-hover-rollback
related:
  - ref://docs/decisions.md#D126
  - ref://docs/research/japanese-inspired-visual-direction.md
---

## Agent Quick Scan

- Scope: one focused pass that restores `hover:` feedback on every
  clickable primitive, mirroring the existing `active:` press tokens.
  Pure visual change, no behavior or markup changes.
- Out of scope: container surfaces (cards, list rows) — these are
  deliberately press-only per Phase F9; see `D126` for the rule.
- Companion decision: `D126` in `docs/decisions.md` codifies the
  "clickable = hoverable; non-clickable = press-only" interaction-state
  rule so future screens can apply it without re-deriving it.

## Why this phase exists

Phase F6 added a subtle whole-card hover + press darkening. Phase F9
correctly rolled back the **hover half** because the cards themselves
are not click targets (the `hover:` state implied clickability that did
not exist). But the rollback left individual clickable elements —
Button variants, inline chips, icon-buttons, modal close × — with
press-only feedback: `active:` alone.

Post-F9 manual testing surfaced that pattern as **too reserved** on
desktop. A clickable element with no hover state reads as decorative
until the cursor is actively pressing it, which is the opposite of the
Japanese-inspired direction's thesis (restraint where restraint
serves, legibility where the user needs to act). The
"clickable element should announce clickability to a pointer" affordance
belongs on the button; what Phase F9 was right about is that it does
**not** belong on the container.

Two observations also informed scope:

1. **The `Button` family already had a well-specified press token for every
   variant** (`active:bg-accent-pressed` for `primary`, `active:bg-bg-warm`
   for `outline` / `secondary`, `active:bg-warning/10` for `danger`,
   `active:text-accent-pressed` for `ghost` / `link` / `BackButton`).
   The cleanest rule is: hover lands on the same darker token as press.
   One visible state for "pointer is engaging this control," rather than
   a half-strength hover → full-strength press ramp (which F6 tried on
   containers and proved too noisy).
2. **Three controls had neither hover nor press feedback at all** — the
   `soft` Button variant, the `SetupScreen` `ToggleChip`, the three
   Review-surface chip families (`QuickTagChips`, `RpeSelector`,
   `IncompleteReasonChips`), and two icon-buttons (`SafetyIcon` shield,
   `SoftBlockModal` close ×). Fixing only `hover:` would have left those
   elements still "dead" on a mobile finger-press, so the pass also
   backfills matching `active:` states where they were missing.

## Scope

### Shared `Button` primitive (`app/src/components/ui/Button.tsx`)

| Variant     | Before                                | After (added)                                            |
| ----------- | ------------------------------------- | -------------------------------------------------------- |
| `primary`   | `active:bg-accent-pressed`            | `hover:bg-accent-pressed`                                |
| `outline`   | `hover:bg-bg-warm active:bg-bg-warm`  | *(unchanged — already compliant)*                        |
| `secondary` | `active:bg-bg-warm`                   | `hover:bg-bg-warm`                                       |
| `danger`    | `active:bg-warning/10`                | `hover:bg-warning/10`                                    |
| `ghost`     | `active:text-accent-pressed`          | `hover:text-accent-pressed`                              |
| `soft`      | *(no hover, no active)*               | `hover:brightness-95 active:brightness-90`               |
| `link`      | `active:text-text-primary`            | `hover:text-text-primary`                                |

`soft` uses the `brightness-*` filter pair instead of a `bg-*` swap because
its base (`bg-bg-warm`) is the design family's only warm-on-warm surface;
overlaying a cool dark opacity wash (the card pattern) would strip the
warmth. The filter darkens proportionally without shifting hue.

### `BackButton` primitive (`app/src/components/ui/BackButton.tsx`)

- Adds `hover:text-accent-pressed` next to the existing
  `active:text-accent-pressed`.

### Inline controls

| File                                             | Element                                   | Change                                                                                                                 |
| ------------------------------------------------ | ----------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| `app/src/components/ErrorBoundary.tsx`           | inline "Back to start" button             | `hover:bg-accent-pressed`                                                                                              |
| `app/src/screens/SafetyCheckScreen.tsx`          | recency chips (unselected)                | `hover:bg-bg-warm`                                                                                                     |
| `app/src/screens/SafetyCheckScreen.tsx`          | pain No / Yes chips (unselected)          | `hover:bg-bg-warm`                                                                                                     |
| `app/src/screens/SafetyCheckScreen.tsx`          | Heat & safety tips disclosure toggle       | `hover:text-accent-pressed`                                                                                            |
| `app/src/screens/SkillLevelScreen.tsx`           | skill-band card buttons                   | `hover:bg-bg-warm`                                                                                                     |
| `app/src/screens/SetupScreen.tsx`                | `ToggleChip` (Players/Net/Wall/Time/Wind) | selected: `hover:bg-accent-pressed active:bg-accent-pressed`; unselected: `hover:bg-bg-warm active:bg-bg-warm`          |
| `app/src/components/QuickTagChips.tsx`           | all chips                                 | selected: `hover:bg-accent-pressed active:bg-accent-pressed`; unselected: `hover:brightness-95 active:brightness-90`    |
| `app/src/components/RpeSelector.tsx`             | all chips                                 | selected: `hover:bg-accent-pressed active:bg-accent-pressed`; unselected: `hover:brightness-95 active:brightness-90`    |
| `app/src/components/IncompleteReasonChips.tsx`   | all chips                                 | selected: `hover:bg-warning/90 active:bg-warning/90`; unselected: `hover:brightness-95 active:brightness-90`            |
| `app/src/screens/RunScreen.tsx`                  | Show / Hide coaching-cues toggle          | `transition-colors hover:text-accent-pressed active:text-accent-pressed`                                               |
| `app/src/components/SafetyIcon.tsx`              | shield icon button                        | `transition-colors hover:bg-text-primary/5 hover:text-text-primary active:bg-text-primary/10 active:text-text-primary` |
| `app/src/components/SoftBlockModal.tsx`          | close (×) button                          | same pattern as `SafetyIcon`, plus `rounded-full` so the hover halo reads cleanly                                      |

`IncompleteReasonChips` selected state uses `bg-warning/90` rather than a
pressed-warning token because no `warning-pressed` exists and
`brightness-*` on a saturated red shifts perceived hue noticeably.

## Not doing in this pass

- **Card-level hover.** `HomePrimaryCard`'s `PRIMARY_CARD_CLASS` and
  `HomeSecondaryRow`'s `SECONDARY_ROW_CLASS` keep their
  `active:bg-text-primary/10` (which fires via CSS `:active`
  propagation when any inner button is pressed) and stay hover-less.
  This is the explicit F9 rule, codified in `D126`.
- **`Card` component variants (`soft`, `focal`).** Static content
  surfaces; no interaction to acknowledge.
- **`PainOverrideCard` wrapping div.** Static warning surface wrapping
  real Button children — the Buttons carry the feedback.
- **New tokens.** The pass reuses existing accent / accent-pressed /
  bg-warm / warning / text-primary tokens. No palette additions.
- **Typography, layout, or copy changes.** Visual-state pass only.

## Requirements trace

- **R1.** Every `Button` variant with an `active:` token has a matching
  `hover:` to the same shade (`primary`, `secondary`, `danger`, `ghost`,
  `link`). `outline` was already compliant.
- **R2.** The `soft` Button variant — the only variant with no press
  state at all — gains both hover and press via `brightness-95` /
  `brightness-90`, preserving its warm base tone.
- **R3.** `BackButton` gets `hover:text-accent-pressed` mirroring its
  existing `active:text-accent-pressed`.
- **R4.** Every inline clickable (`ErrorBoundary` fallback, Safety
  chips, Skill-band card, Setup `ToggleChip`, Review chips, RunScreen
  cues toggle, SafetyIcon shield, SoftBlockModal close ×) has both a
  `hover:` and a matching `active:` state.
- **R5.** Every touched element already has `transition-colors` or
  gains it in the same edit, so the state change fades rather than
  hard-snapping.
- **R6.** `HomePrimaryCard` `PRIMARY_CARD_CLASS` and `HomeSecondaryRow`
  `SECONDARY_ROW_CLASS` remain hover-less (press-only) per `D126`.
- **R7.** No test assertions change. Existing coverage (`Button.test.tsx`
  and every role / accessible-name / copy assertion across the refactored
  files) is transparent to state-class additions.

## Key technical decisions

1. **Hover lands on the same token as press.** Phase F6's two-step
   ramp (hover at `/5`, press at `/10`) made sense for large container
   surfaces where hover-on-mouseover fires incidentally on every cursor
   move. For controls the user is deliberately pointing at, a single
   "this control is engaged" state is calmer than a hover-then-deepen
   ramp — the user sees one shade for "pointer is here," and that same
   shade confirms "press registered." Keeps parity across desktop
   (hover → click) and mobile (no hover → tap) without a noticeable
   desktop-only halfway state.
2. **`brightness-*` for the one warm-preserving case.** The `soft`
   Button variant, `QuickTagChips` unselected, `RpeSelector` unselected,
   and `IncompleteReasonChips` unselected all sit on `bg-bg-warm`. A
   `bg-text-primary/5` wash (the card pattern) would replace the warm
   base with a cool grey overlay on hover, which visibly strips the
   direction's warm identity. `brightness-95` / `brightness-90` is a
   filter, not a background swap — it darkens proportionally while
   preserving hue. Used narrowly for this warm-on-warm family only; the
   rest of the codebase stays on explicit token swaps so the cascade
   stays easy to reason about.
3. **Selected chips also get hover / press.** Selected chips are still
   click targets (tap again to toggle off / tap a different chip to
   change). Giving them `hover:bg-accent-pressed active:bg-accent-pressed`
   (or `bg-warning/90` for the IncompleteReason warning family) means a
   returning pointer doesn't read the selected chip as a frozen label.
4. **Icon buttons get a hover halo via `rounded-full` + background
   wash.** `SafetyIcon` was already `rounded-full` but had no background
   state; `SoftBlockModal`'s × was square with no hover state. Both now
   use the card-family's `bg-text-primary/5` (hover) / `/10` (press)
   overlay plus a `text-primary` darken on the glyph itself, giving a
   calm circular halo on hover that matches the shield's existing
   round silhouette.
5. **Matching `active:` states backfilled where missing.** Five
   elements had `hover:` added — but also previously had **no**
   `active:` state (`soft` variant, `ToggleChip`, `QuickTagChips`,
   `RpeSelector`, `IncompleteReasonChips`, RunScreen cues toggle,
   `SafetyIcon`, `SoftBlockModal` ×). Adding `hover:` without `active:`
   would leave those controls still "dead" on a mobile press-but-not-
   release. Mobile has no hover pseudo-state, so `active:` is the only
   tactile cue during the touchstart → touchend window; backfilling it
   answers the user's question "if there's a press but not release it
   should hover too right even on mobile?" — yes, via `active:`, which
   fires on both desktop mousedown and mobile touchstart.

## Implementation units

- [x] **Unit 1: `Button` variants** *(landed 2026-04-19)*

  **Files:**
  - Modify: `app/src/components/ui/Button.tsx`

  **Approach:** Pair `hover:` with each existing `active:` per the
  table above. Add `hover:brightness-95 active:brightness-90` to the
  previously bare `soft` variant. Update the variant-map JSDoc with a
  Phase F11 header block explaining the "hover = press shade" rule.

- [x] **Unit 2: `BackButton` primitive** *(landed 2026-04-19)*

  **Files:**
  - Modify: `app/src/components/ui/BackButton.tsx`

  **Approach:** Add `hover:text-accent-pressed` next to the existing
  `active:text-accent-pressed`. Inline Phase F11 comment cross-
  referencing the Button rule.

- [x] **Unit 3: Inline screen-level controls** *(landed 2026-04-19)*

  **Files:**
  - Modify: `app/src/components/ErrorBoundary.tsx`
  - Modify: `app/src/screens/SafetyCheckScreen.tsx`
  - Modify: `app/src/screens/SkillLevelScreen.tsx`
  - Modify: `app/src/screens/SetupScreen.tsx`
  - Modify: `app/src/screens/RunScreen.tsx`

  **Approach:** Minimal surface-level edits per the table. The
  `SetupScreen` `ToggleChip` previously had zero feedback and gains
  both hover and press. RunScreen's coaching-cues toggle also gains
  `transition-colors` since it was missing the transition utility.

- [x] **Unit 4: Review-surface chips + modal / icon buttons**
  *(landed 2026-04-19)*

  **Files:**
  - Modify: `app/src/components/QuickTagChips.tsx`
  - Modify: `app/src/components/RpeSelector.tsx`
  - Modify: `app/src/components/IncompleteReasonChips.tsx`
  - Modify: `app/src/components/SafetyIcon.tsx`
  - Modify: `app/src/components/SoftBlockModal.tsx`

  **Approach:** Selected chips use `hover:bg-accent-pressed active:bg-accent-pressed`
  (or `bg-warning/90` for IncompleteReason); unselected chips use
  `brightness-*` to preserve warm base tone. `SafetyIcon` and
  `SoftBlockModal`'s × both get the icon-halo treatment
  (`bg-text-primary/5` / `/10` overlay + glyph darken +
  `focus-visible:ring-accent`).

- [x] **Unit 5: Decisions log** *(landed 2026-04-19)*

  **Files:**
  - Modify: `docs/decisions.md`

  **Approach:** Add `D126` codifying the interaction-state rule
  ("clickable = hoverable; non-clickable container = press-only") with
  a one-sentence consistency list (`D48`, `D49`, F6, F9 plan refs).
  Bump `last_updated` suffix.

## Validation

- `npm test -- --run` → 67 files / 496 tests passing (no test changes
  required; existing coverage is role-, name-, and copy-based and is
  transparent to state-class additions).
- `npm run lint` clean on all touched files (verified via
  Cursor lint integration, no new warnings).
- Manual desktop hover pass: every Button variant, BackButton, Safety
  / Skill / Setup / Review chip, RunScreen cues toggle, SafetyIcon,
  and SoftBlockModal × darkens on pointer hover. Home primary card and
  Home secondary rows do **not** darken on hover (F9 rollback + `D126`
  still in force) but do darken when any inner button is pressed
  (`:active` propagation).
- Manual mobile press pass: every touched control darkens on
  touchstart and releases on touchend; the Home card-level `active:`
  wash still fires when any inner button is pressed.

## Risks and mitigations

| Risk                                                                                                    | Mitigation                                                                                                                                                                                                                                                                                                                               |
| ------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| The whole-hover family darkens too uniformly, collapsing perceptual hierarchy between primary / ghost / link | Each variant lands on its own semantic token (`accent-pressed`, `bg-bg-warm`, `text-accent-pressed`, `text-text-primary`), so the hover *delta* still inherits each variant's identity. Dogfeed follow-up can split hover / active by `/5` vs `/10` on selected cases if the flat ramp feels too emphatic.                                 |
| `brightness-*` on chips interacts oddly with their already-thin focus rings                              | Focus ring is `outline`-based (via `focus-visible:ring-*`), which is not affected by the `filter: brightness()` on the button box; visually verified on all three chip families.                                                                                                                                                           |
| A future author mistakenly adds `hover:` back onto `PRIMARY_CARD_CLASS` / `SECONDARY_ROW_CLASS`         | `D126` exists specifically so the rule is durable; inline JSDoc in `HomePrimaryCard.tsx` already calls this out. If drift returns, the fix is one diff that drops the `hover:` half again (same as the F9 rollback).                                                                                                                       |
