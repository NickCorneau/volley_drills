---
title: "feat: Phase F1 Home calm pass"
type: plan
status: landed
landed_on: 2026-04-19
date: 2026-04-19
origin: "Chat follow-on to Phase F design-direction experiment; cf. `docs/research/japanese-inspired-visual-direction.md`"
depends_on:
  - docs/archive/plans/2026-04-19-feat-phase-f-d91-validity-hardening-plan.md
  - docs/specs/m001-phase-c-ux-decisions.md
  - docs/specs/m001-home-and-sync-notes.md
  - docs/research/outdoor-courtside-ui-brief.md
  - docs/research/japanese-inspired-visual-direction.md
---

# Phase F1: Home calm pass

## Overview

Phase F1 is a small, low-risk visual polish on the Home screen that applies the restrained, focal-first direction from `docs/research/japanese-inspired-visual-direction.md` to the highest-traffic repeat-use surface. It is **visual only**: no behavior changes, no schema changes, no new routes, no new tokens, no copy changes.

The goal is to make the primary card clearly the one thing to attend to on Home, and to stop the secondary rows from competing with it as equal-weight mini-cards. This is the smallest structural move that tests the aesthetic direction without risking the D91 field-test artifact.

## Problem frame

Home scored lowest on **investment** in the joy / trust / investment rubric (see chat summary, 2026-04-19). Two concrete contributors:

- Every section read as an independent bordered white card on a white page, so there was no visible focal zone.
- Secondary rows rendered as individual bordered cards and visually competed with the primary card for attention, diluting the "one clear next action" feeling.

Phase F1 fixes both without changing any behavior, precedence, copy, or tokens.

## Requirements trace

- R1. The four primary-card variants (`new_user`, `review_pending`, `draft`, `last_complete`) share a single focal-zone surface class so the card always reads as the same confident shape.
- R2. Primary-card internal rhythm gets more breathing room: padding increases from `p-5` to `p-6`, internal gap from `gap-3` to `gap-4`.
- R3. The primary card no longer relies on a hard 1 px border for shape; it uses a soft `shadow-sm` plus a hairline `ring-1 ring-text-primary/5` so it feels slightly lifted from the page.
- R4. Secondary rows drop per-row border, background, and rounding. They render as flat rows with comfortable padding inside a single calmer container owned by `HomeScreen`.
- R5. The secondary-list container uses the same soft-shadow + hairline-ring surface language as the primary card but clearly quieter (lower visual weight) and is grouped by `divide-y divide-text-primary/5`.
- R6. Vertical rhythm on Home increases: outer flex gap from `gap-6` to `gap-8`, bottom padding from `pb-8` to `pb-12`, a small `pt-2` on the outer column, and `pt-3` on the header becomes `pt-4`.
- R7. No changes to the variant prop API of `HomePrimaryCard` or `HomeSecondaryRow`.
- R8. No test changes required; existing role- and text-based assertions still pass.
- R9. No changes to `index.css` tokens.

## Scope boundaries

### In scope

- Visual surface polish on `HomeScreen`, `HomePrimaryCard`, `HomeSecondaryRow`.
- Inline comments in each touched component anchoring the change to this plan and to the Japanese-inspired visual-direction research note.

### Out of scope

- Palette changes (warmer off-white page background, new accent shade). Those can be a follow-on experiment once this structural calmer pass is felt.
- `CompleteScreen`, `ReviewScreen`, `TransitionScreen`, `RunScreen` polish. Those are explicit M002 / future work candidates per `docs/milestones/m002-weekly-confidence-loop.md`.
- Typography changes.
- New design tokens.
- Any behavior change, copy change, or schema change.

## Context and research

- `docs/research/japanese-inspired-visual-direction.md` — working thesis and the specific structural principles (`ma`, `tokonoma`, `shibui`) being applied.
- `docs/research/outdoor-courtside-ui-brief.md` — readability contract. Phase F1 does not reduce contrast, type size, or touch-target sizes. The primary CTA and all row CTAs stay at existing button sizes.
- `docs/specs/m001-phase-c-ux-decisions.md` Surface 2 — Home precedence model. Unchanged by this pass.
- `docs/specs/m001-home-and-sync-notes.md` — Home state model. Unchanged by this pass.

## Key technical decisions

1. **Centralise the primary-card surface class.** All four variants of `HomePrimaryCard` now reference a single `PRIMARY_CARD_CLASS` constant. Drift between variants is the most likely way a "calm focal card" accidentally becomes four slightly different-looking cards over time; one constant removes that risk.
2. **Centralise the secondary-row class.** `SECONDARY_ROW_CLASS` is a single flat-row layout; rows do not own their own surface. The parent `<ul>` on Home owns the surface (shadow, ring, rounding, dividers).
3. **No new CSS tokens.** The pass uses only existing Tailwind utilities and the existing theme tokens (`bg-bg-primary`, `text-primary/5`). A warmer page-background experiment is explicitly deferred so it can be evaluated independently.
4. **No behavior or copy change.** Tests only assert roles, accessible names, and visible copy; they keep passing without modification. This is the single clearest proof that the pass is low-risk.

## Implementation units

- [x] **Unit 1: Primary-card surface consolidation** *(landed 2026-04-19)*

  **Files:**
  - Modify: `app/src/components/HomePrimaryCard.tsx`

  **Approach:**
  - Introduce module-local `PRIMARY_CARD_CLASS` constant.
  - Replace the four hand-written `<section className="…">` expressions with references to the constant.
  - Update the top-of-file JSDoc with a Phase F1 note anchoring the change.

  **Verification:**
  - All four card variants render with the same surface language.
  - Existing role + aria-label + CTA assertions in `app/src/components/__tests__/HomePrimaryCard.test.tsx` keep passing unchanged.

- [x] **Unit 2: Flatten `HomeSecondaryRow`** *(landed 2026-04-19)*

  **Files:**
  - Modify: `app/src/components/HomeSecondaryRow.tsx`

  **Approach:**
  - Introduce module-local `SECONDARY_ROW_CLASS` constant (`flex items-center justify-between gap-3 px-4 py-3`).
  - Remove per-row `rounded-[12px] border border-text-primary/10 bg-bg-primary` from all three variants.
  - Update the top-of-file JSDoc with a Phase F1 note.

  **Verification:**
  - Rows render flat, with no per-row border or background.
  - Existing variant-specific label and CTA assertions in `app/src/components/__tests__/HomeSecondaryRow.test.tsx` keep passing unchanged.

- [x] **Unit 3: `HomeScreen` rhythm + list container** *(landed 2026-04-19)*

  **Files:**
  - Modify: `app/src/screens/HomeScreen.tsx`

  **Approach:**
  - Outer column: `gap-6 pb-8` → `gap-8 pb-12 pt-2` for more vertical breathing room.
  - Header: `pt-3` → `pt-4` to keep the Brandmark / wordmark pair from crowding the primary card.
  - Secondary list wrapper: replace `flex flex-col gap-2` with `divide-y divide-text-primary/5 overflow-hidden rounded-[16px] bg-bg-primary shadow-sm ring-1 ring-text-primary/5` so the list itself is the calm supporting container.
  - Leave `renderPrimary`, `renderSecondary`, all handlers, all copy, and all precedence logic untouched.

  **Verification:**
  - Primary card reads as the focal zone against the supporting cluster below.
  - `app/src/screens/HomeScreen.test.tsx` (Brandmark, Settings link, pending-review flow, skip-confirm cancel) keeps passing unchanged.

## System-wide impact

- **Interaction graph:** none affected. No handlers or routes change.
- **Error propagation:** none.
- **State lifecycle:** none.
- **API surface parity:** none. `HomePrimaryCard` and `HomeSecondaryRow` keep their existing discriminated-union prop shapes.
- **Integration coverage:** existing 496 Vitest tests pass unchanged.
- **Unchanged invariants:**
  - Home precedence model (`resume > review_pending > draft > last_complete > new_user`).
  - `D122` Phase F Home CTA cleanup (Repeat / Start a different session / Change setup).
  - Outdoor readability contract in `docs/research/outdoor-courtside-ui-brief.md`.
  - `D91` field-test artifact behavior.

## Risks and dependencies

| Risk | Mitigation |
|------|------------|
| Softer shadow + hairline ring hurt card delineation in bright sun | Primary CTA and all button targets keep existing sizes and contrast; the shadow-plus-ring combination reads on a white body background and does not rely on it for critical text legibility. If field dogfeed shows the card edges feel "soft" outdoors, promote the ring to `ring-text-primary/10` in a small follow-up. |
| Secondary rows collapse into a single visual blob | The shared container uses a hairline `divide-y divide-text-primary/5` between rows; each row also keeps its existing CTA button (visible action target). |
| Visual drift over time between primary-card variants | Eliminated by `PRIMARY_CARD_CLASS` constant; a new variant that hand-writes its own surface classes is an obvious review-time red flag. |
| Phase F1 muddies the D91 read | This pass is strictly visual, introduces no new taxonomy, and changes no copy or behavior. It is on-thesis with `D91`'s hypothesis that the product should feel trustworthy and calming to a self-coached amateur. |

## Documentation / operational notes

- No release-note impact; this is a polish pass that rides the existing v0b build.
- If the warmer page-background follow-on ever runs, reference this plan as its predecessor and the Japanese-inspired research note as the shared framing.
- No updates needed to `docs/catalog.json`, `AGENTS.md`, or the agent-doc routing surfaces.

## Sources and references

- `docs/research/japanese-inspired-visual-direction.md` — principles used (`ma`, `tokonoma`, `shibui`) and explicit anti-cliché guardrails.
- `docs/research/outdoor-courtside-ui-brief.md` — readability contract preserved by this pass.
- `docs/archive/plans/2026-04-19-feat-phase-f-d91-validity-hardening-plan.md` — the parent Phase F work this sits alongside; Phase F1 is a quiet follow-on that does not change any Phase F contract.
- `docs/specs/m001-phase-c-ux-decisions.md` — Surface 2 (Home multi-state with precedence). Unchanged.
