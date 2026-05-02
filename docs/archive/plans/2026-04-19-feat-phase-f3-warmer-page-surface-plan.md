---
title: "feat: Phase F3 warmer page surface (bg-surface-calm)"
type: plan
status: landed
landed_on: 2026-04-19
date: 2026-04-19
origin: "Follow-on to Phase F1 / F2 calm-pass experiments; natural next step once all focal cards share one surface"
depends_on:
  - docs/archive/plans/2026-04-19-feat-phase-f1-home-calm-pass-plan.md
  - docs/archive/plans/2026-04-19-feat-phase-f2-shared-focal-surface-plan.md
  - docs/research/japanese-inspired-visual-direction.md
  - docs/research/outdoor-courtside-ui-brief.md
---

# Phase F3: Warmer page surface (`bg-surface-calm`)

## Overview

Phase F3 introduces a subtle warm off-white page field (`#fcfaf5`) behind the whole app so the white focal cards that Phase F1 / F2 unified across the calm screens read as distinct content blocks lifted from a softer background. It's a palette change only: one new token, two wiring changes. No markup changes, no behavior changes, no copy changes, no test changes.

## Problem frame

After F1 / F2, the calm screens all use the same white focal surface (`FOCAL_SURFACE_CLASS`). But the page behind those cards was still pure white (`#ffffff`), so the shadow + hairline ring on each card did all the work of distinguishing "card" from "page." On bright outdoor viewing especially, pure-white-on-pure-white is visually thin: the tokonoma-style focal zone concept reads more clearly when the page field is itself a slightly calmer tone.

Phase F3 shifts the field very subtly warmer so the cards pop without any card-side class changes.

## Scope boundaries

### In scope

- Add `--color-surface-calm: #fcfaf5` token to `@theme` in `app/src/index.css`.
- Apply it to `body` background in `index.css`.
- Apply it to the `Layout` wrapper class in `app/src/App.tsx` (`bg-bg-primary` → `bg-surface-calm`) so the page field reads consistently across every route.

### Out of scope

- Card class changes. Every focal surface keeps `bg-bg-primary` (white) from F2 and now naturally pops against the warmer field.
- `Card variant="soft"` changes. The warm supporting cards in Review / Complete keep `bg-bg-warm` (`#f5f5f0`); the new token is distinct enough that soft cards stay visibly warmer than the page and clearly cooler / cleaner than the focal cards above them.
- Button hover / active states. The outline-button `hover:bg-bg-warm` (`#f5f5f0`) stays distinguishable from the new page field (`#fcfaf5`).
- Any run-flow chrome changes. `RunScreen` and `TransitionScreen` inherit the warmer field but stay readable courtside — see risk analysis below.

## Palette relationships

| Token | Hex | Role |
|---|---|---|
| `bg-primary` | `#ffffff` | Focal-card surface (HomePrimaryCard, Card variant="focal", HomeScreen secondary list, etc.) |
| `surface-calm` | `#fcfaf5` | Page field (body + Layout) |
| `bg-warm` | `#f5f5f0` | Soft supporting surface (Card variant="soft", outline-button hover, skip-confirm nested row, transition "previous block" indicator) |

All three are within a narrow warm-white family but visibly distinct:
- `bg-primary` → `surface-calm`: ~3 value difference per channel. Cards read as lifted.
- `surface-calm` → `bg-warm`: ~7 value difference per channel. Soft surfaces stay visibly warmer than the page.
- `bg-primary` → `bg-warm`: clearest white-vs-warm contrast, unchanged.

Near-black body copy (`#1a1a1a`) on the new page field sits well above WCAG AA contrast (~16:1).

## Requirements trace

- R1. `@theme` in `app/src/index.css` exports `--color-surface-calm: #fcfaf5`, making `bg-surface-calm`, `text-surface-calm`, etc. available as Tailwind utilities.
- R2. `body` background in `index.css` switches from `var(--color-bg-primary)` to `var(--color-surface-calm)` so overscroll / bounce on iOS mobile Safari shows the warmer field, not pure white.
- R3. `Layout` in `app/src/App.tsx` switches from `bg-bg-primary` to `bg-surface-calm`. All routes inherit the warmer field.
- R4. No class or markup changes to any screen, card, or control.
- R5. No test changes required.

## Key technical decisions

1. **Single-token change, no per-screen opt-in / opt-out.** Applying this at `body` + `Layout` gives every route the same field. RunScreen and TransitionScreen inherit the warmer field; the outdoor brief explicitly allows "near-black text on white OR slightly off-white surfaces," and `#fcfaf5` is deliberately inside that band.
2. **Token value chosen for palette distinguishability, not maximum warmth.** A more dramatic warm shade (`#f8f6f0`-ish) would make cards pop harder but would also push the page color too close to `bg-warm`, collapsing the soft-card / page distinction and killing outline-button hover affordance. `#fcfaf5` is the subtlest shift that still makes focal cards visibly lifted.
3. **Body gets the same bg as Layout.** Prevents overscroll-bounce on iOS from flashing pure white behind the warmer Layout wrapper.

## Implementation units

- [x] **Unit 1: Add `--color-surface-calm` token** *(landed 2026-04-19)*

  **Files:**
  - Modify: `app/src/index.css`

  **Approach:**
  - Add `--color-surface-calm: #fcfaf5` to the `@theme` block.
  - Document intent in a short comment above the token: why this value, what it does, and the link back to the outdoor-readability contract + the research note that motivated it.
  - Update the `body` selector to use `var(--color-surface-calm)`.

  **Verification:**
  - `npm run lint` clean.
  - Tailwind picks the token up automatically (v4 @theme integration); `bg-surface-calm`, `text-surface-calm`, etc. become valid utilities.

- [x] **Unit 2: Rewire Layout** *(landed 2026-04-19)*

  **Files:**
  - Modify: `app/src/App.tsx`

  **Approach:**
  - Swap `bg-bg-primary` → `bg-surface-calm` on the Layout wrapper div.
  - Add a short inline comment referencing this plan so a future change sees the intent.

  **Verification:**
  - Every route renders on the warmer field.
  - `RunScreen` + `TransitionScreen` stay readable (inline text still near-black on slightly off-white, per the brief).
  - 67 Vitest files / 496 tests green.

## System-wide impact

- **Interaction graph:** none.
- **Error propagation:** none.
- **State lifecycle:** none.
- **API surface parity:** none. No component props, routes, or handlers change.
- **Integration coverage:** existing 496 Vitest tests pass unchanged.
- **Unchanged invariants:**
  - Outdoor readability contract (`docs/research/outdoor-courtside-ui-brief.md`): "slightly off-white surfaces" is an allowed field color; text contrast preserved.
  - Card palette discipline (soft warm / focal white): now strengthened, not weakened.
  - Run / transition / modal behavior: untouched.

## Risks and dependencies

| Risk | Mitigation |
|------|------------|
| RunScreen feels less stark outdoors | `#fcfaf5` is 98%+ luminance; near-black `#1a1a1a` body text still delivers ~16:1 contrast, well above WCAG AA. The outdoor brief explicitly lists "slightly off-white" as acceptable. Dogfeed confirmation on phone recommended. |
| `bg-warm` (`#f5f5f0`) soft cards no longer read as "warm" against the new page field | They still do — the page is `#fcfaf5` and `bg-warm` is `#f5f5f0`, about a 2% luminance difference. Visibly different but subtly so, which matches the restrained palette direction. |
| Outline-button hover (`hover:bg-bg-warm`) becomes indistinguishable from the page | Same math — the hover still darkens the button relative to the page; the shift is ~5% luminance, still legible. If dogfeed shows otherwise, promote outline-hover to a darker shade in a follow-up. |
| Screenshot fixtures (if any) break | None exist in the test suite; Vitest unit tests don't snapshot rendered styles. Playwright end-to-end specs test behavior, not palette. |

## Documentation / operational notes

- No release-note impact; rides the same v0b build.
- Tokens page in a future design-system doc should list the three-color field + card + soft-card relationship captured under "Palette relationships" above.
- Follow-on palette experiments (e.g. a second accent color for status states) can stack cleanly on top of F3 without disturbing the field.

## Sources and references

- `docs/archive/plans/2026-04-19-feat-phase-f1-home-calm-pass-plan.md` and `docs/archive/plans/2026-04-19-feat-phase-f2-shared-focal-surface-plan.md` — the card-side work that F3 completes.
- `docs/research/japanese-inspired-visual-direction.md` — *ma* (active space), *tokonoma* (focal zone). The field-then-card contrast makes the focal-zone read legible.
- `docs/research/outdoor-courtside-ui-brief.md` — "near-black text on white OR slightly off-white surfaces" permits this shift explicitly.
