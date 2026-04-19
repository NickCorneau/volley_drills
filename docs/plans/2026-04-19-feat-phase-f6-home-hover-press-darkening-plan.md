---
title: "feat: Phase F6 Home card hover and press darkening"
type: plan
status: landed
landed_on: 2026-04-19
date: 2026-04-19
origin: "User request to add subtle hover / press darkening to the Home cards, in alignment with the Japanese-inspired visual direction"
depends_on:
  - docs/plans/2026-04-19-feat-phase-f1-home-calm-pass-plan.md
  - docs/plans/2026-04-19-feat-phase-f2-shared-focal-surface-plan.md
  - docs/plans/2026-04-19-feat-phase-f3-warmer-page-surface-plan.md
  - docs/research/japanese-inspired-visual-direction.md
---

# Phase F6: Home card hover and press darkening

## Overview

Phase F6 adds a subtle "shade darkening" interaction state to the Home primary card and to each Home secondary row. On desktop, hovering any part of a card or row applies a faint near-black wash; on any device, pressing a child button applies a slightly stronger wash for the duration of the press. It's a tiny, calm, on-brand tactile acknowledgment — the kind of restrained feedback the Japanese-inspired direction calls for.

Pure visual change. No markup changes, no behavior changes, no copy changes, no new tokens, no test changes.

## Problem frame

After the F1 / F2 / F3 calm pass, the Home cards read as a cohesive design family against a warmer page field. But because cards and rows have no interactive states, they can feel slightly "frozen" — the content is calm, but pressing a CTA inside a card gives feedback only on the button itself, not the card. On a touch device especially, that means the whole card stays stone-still while one button flashes. Adding a subtle whole-card state when the user engages makes the product feel more alive without adding any loudness.

## Scope boundaries

### In scope

- Add `transition-colors hover:bg-text-primary/5 active:bg-text-primary/10` to:
  - `PRIMARY_CARD_CLASS` in `app/src/components/HomePrimaryCard.tsx`
  - `SECONDARY_ROW_CLASS` in `app/src/components/HomeSecondaryRow.tsx`
- Inline commentary explaining the CSS `:active` propagation mechanic so a future change understands *why* the whole card darkens on button-press without the card being a click target itself.

### Out of scope

- Making the primary card or secondary rows individually clickable. They're not, and shouldn't be — primary cards have multiple distinct CTAs (e.g. LastComplete's `Repeat` + `Start a different session`), and secondary rows have one ghost button that is the only legitimate tap target. The F6 effect is *tactile feedback* on the whole surface, not a new tap target.
- Any state on `SkillLevelScreen` option buttons. Those already carry `active:bg-bg-warm` (stronger, full-warm press) because they *are* the click target. Aligning them with the softer F6 wash is a candidate for a later consistency pass.
- Any state on `SettingsScreen`'s `<Card variant="focal">`. Static content card; no interaction to acknowledge.
- Any state on `RunScreen` / `TransitionScreen` / modals. Different contracts.
- Touch-device long-press handling. Native `:active` already covers the tap case.

## Requirements trace

- R1. `HomePrimaryCard` renders all four variants (`new_user`, `review_pending`, `draft`, `last_complete`) with the same `PRIMARY_CARD_CLASS`, and that class now includes the three-utility hover/press wash.
- R2. `HomeSecondaryRow` renders all three variants (`review_pending_advisory`, `draft`, `last_complete`) with the same `SECONDARY_ROW_CLASS`, and that class now includes the three-utility hover/press wash.
- R3. The wash tint uses the `text-primary/5` / `text-primary/10` opacity modifiers on the existing `--color-text-primary: #1a1a1a` token. No new tokens are introduced.
- R4. `transition-colors` applies to the `background-color` change so the hover and press states fade in / out smoothly rather than hard-cutting.
- R5. Pressing any child button (primary CTA, secondary CTA, text-link tertiary, ghost row CTA) inside a card triggers the card's `:active` state during the mousedown. No JavaScript is needed; CSS `:active` propagates to ancestors natively.
- R6. No existing test assertions need to change; tests only verify roles, accessible names, and visible copy — all unchanged.

## Key technical decisions

1. **Near-black wash, not warm wash.** The user specifically asked for "shade darkening." `bg-text-primary/5` (`#1a1a1a` at 5% opacity over white) produces roughly `#f3f3f3` — a genuinely darker shade, not a warmer one. A `bg-bg-warm`-based alternative would shift the hover state toward warmth rather than darkness and would also collide visually with the outline-button hover state that already uses `bg-bg-warm`.
2. **Two-step intensity (`/5` hover, `/10` press).** Hover stays near-invisible (5% tint), as befits desktop where the cursor hovers the card incidentally on every mouse-move. Press doubles the tint (10%) for the brief moment the user's finger / mouse is down, giving perceivable tactile feedback without shouting.
3. **`transition-colors` for smoothness.** Without the transition, the state change is instant and feels glitchy. With it, hover fades in gently over Tailwind's default duration (~150 ms), which is exactly the pace the restrained direction wants.
4. **CSS `:active` on ancestor, no JS needed.** When the user mousedowns on a child `<button>`, the browser's CSS `:active` evaluation fires on the button *and* every ancestor element up to the root. That means `:active` on `<section>` or `<li>` is true the whole time the user is pressing a child button inside — no JavaScript, no hooks, no state lifting. The card darkens for exactly the time the user is pressing, then returns on mouseup.
5. **No change on primary card when navigating between CTAs on hover.** A `:hover` over the card stays constant as long as the cursor is anywhere over the card; moving from the primary CTA to a tertiary link inside the card does not flicker the wash. This is the right behavior — the whole card is the tactile unit.

## Implementation units

- [x] **Unit 1: `HomePrimaryCard` shared class** *(landed 2026-04-19)*

  **Files:**
  - Modify: `app/src/components/HomePrimaryCard.tsx`

  **Approach:**
  - Append `transition-colors hover:bg-text-primary/5 active:bg-text-primary/10` to `PRIMARY_CARD_CLASS`.
  - Update the surrounding JSDoc comment with a Phase F6 block explaining the CSS `:active` propagation rationale.
  - No variant-specific changes; all four card variants use the shared constant.

  **Verification:**
  - eslint + vitest clean.
  - Existing `HomePrimaryCard.test.tsx` assertions (role, aria-label, CTA labels) unchanged and passing.

- [x] **Unit 2: `HomeSecondaryRow` shared class** *(landed 2026-04-19)*

  **Files:**
  - Modify: `app/src/components/HomeSecondaryRow.tsx`

  **Approach:**
  - Append `transition-colors hover:bg-text-primary/5 active:bg-text-primary/10` to `SECONDARY_ROW_CLASS`.
  - Update the surrounding JSDoc comment with a Phase F6 note.
  - No variant-specific changes; all three row variants use the shared constant.

  **Verification:**
  - eslint + vitest clean.
  - Existing `HomeSecondaryRow.test.tsx` assertions unchanged and passing.

## System-wide impact

- **Interaction graph:** none. Handlers and routes unchanged.
- **Error propagation:** none.
- **State lifecycle:** none.
- **API surface parity:** none.
- **Integration coverage:** 67 Vitest files / 496 tests green.
- **Unchanged invariants:**
  - All existing click targets remain the same click targets.
  - Accessibility: `role="region"` + `aria-label` on primary cards, `role="list"` + `<li>` items on the secondary list, tab order, keyboard focus rings.
  - Outdoor readability contract (`RunScreen` / `TransitionScreen` / modals untouched).

## Risks and dependencies

| Risk | Mitigation |
|------|------------|
| The card looks clickable-as-a-whole after the hover state lands, when it isn't | The effect is very subtle (`/5` tint). The actual click affordances inside the card are full-opacity buttons with their own hover/press states that dominate visually. Dogfeed confirmation recommended. |
| Hover flashes when the cursor crosses the card in passing on desktop | `transition-colors` smooths the fade so a brief crossing reads as a gentle soft-edge, not a hard flash. 150 ms default transition is inside the "incidental hover" range. |
| `bg-text-primary/5` compiles to unexpected CSS on older Tailwind versions | The app is on Tailwind v4 with `@theme` + CSS-variable-based tokens; opacity modifiers on theme colors are first-class and already used elsewhere (`ring-text-primary/5`, `border-text-primary/10`, `divide-text-primary/5`). |
| The press state is too subtle on mobile | `/10` is twice the hover tint, and mobile users see only the press state (no hover). If field feedback says the press feels muted, one-line bump to `/15`. |

## Documentation / operational notes

- No release-note impact; rides the same v0b build.
- A later consistency pass on `SkillLevelScreen` option buttons could align them with F6's softer press tint; they currently use `active:bg-bg-warm` (fully warm fill) because they pre-date F1–F6. Tracked as a candidate, not scoped here.
- No updates needed to `docs/catalog.json`, `AGENTS.md`, or agent-doc routing surfaces.

## Sources and references

- `docs/plans/2026-04-19-feat-phase-f1-home-calm-pass-plan.md` through `-f5-copy-polish-plan.md` — the surrounding calm pass; F6 adds tactile interaction state to the visual direction F1–F5 established.
- `docs/research/japanese-inspired-visual-direction.md` — restraint / shibui; the "press feedback should be felt, not shouted" stance.
