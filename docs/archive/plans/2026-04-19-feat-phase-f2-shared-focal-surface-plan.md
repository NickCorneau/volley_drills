---
title: "feat: Phase F2 shared focal surface across calm screens"
type: plan
status: landed
landed_on: 2026-04-19
date: 2026-04-19
origin: "Follow-on to Phase F1 Home calm pass; user request to apply the same design language to the rest of the app"
depends_on:
  - docs/archive/plans/2026-04-19-feat-phase-f1-home-calm-pass-plan.md
  - docs/research/japanese-inspired-visual-direction.md
  - docs/research/outdoor-courtside-ui-brief.md
---

# Phase F2: Shared focal surface across calm screens

## Overview

Phase F2 extracts the Phase F1 `PRIMARY_CARD_CLASS` (the calm-card language introduced on `HomePrimaryCard`) into a shared token and applies it to the other screens where the same surface treatment is obviously an improvement: the `HomeScreen` secondary-list container, `SettingsScreen`, and the four `SkillLevelScreen` option buttons. The `<Card>` UI primitive gains a `variant: 'soft' | 'focal'` prop so the new surface has a first-class place in the component library.

Pure visual pass. No behavior changes, no schema changes, no copy changes, no test changes.

## Problem frame

Phase F1 landed the calm focal-card surface on `HomePrimaryCard`. Two immediate consequences:

1. **Duplication.** `HomePrimaryCard` and `HomeScreen`'s secondary-list container hardcoded the same class string. A future tweak (say, lifting the ring contrast) would need to touch both in lockstep or accidentally drift.
2. **Inconsistency.** Other screens still used the pre-F1 surface language:
   - `SettingsScreen` rendered its export section with a legacy `rounded-[16px] border border-text-primary/10 bg-bg-primary p-5` block, which now read as visually heavier than the Home cards users see first.
   - `SkillLevelScreen`'s four band options rendered with `border-2 border-text-primary/10`, which felt form-field-like next to the softer Home cards.

Phase F2 closes both: one shared token, one focal-card variant on `<Card>`, and consistent application across the calm screens.

## Scope boundaries

### In scope

- Extract the focal surface class to `FOCAL_SURFACE_CLASS` in `app/src/components/ui/Card.tsx`.
- Extend `<Card>` with a `variant: 'soft' | 'focal'` prop (default `'soft'` to preserve all existing usages).
- Refactor `HomePrimaryCard` and the `HomeScreen` secondary-list container to import and use the shared token.
- Replace `SettingsScreen`'s legacy bordered export section with `<Card variant="focal">`.
- Replace `SkillLevelScreen` option buttons' hard `border-2` with the shared surface treatment; bump internal padding (`px-4 py-3` → `px-5 py-4`), min-height (`60px` → `64px`), and inter-option gap (`gap-3` → `gap-4`).
- Align vertical rhythm on `SettingsScreen` and `SkillLevelScreen` with the F1 pattern (`gap-6 pb-8` → `gap-8 pb-12` on Settings; `gap-5 pb-8` → `gap-6 pb-12` on SkillLevel).

### Out of scope

- `RunScreen`, `TransitionScreen`: the outdoor readability contract in `docs/research/outdoor-courtside-ui-brief.md` requires hard contrast and unambiguous controls; soft shadows + hairline rings are correct for calm review / settings / onboarding surfaces but wrong for glare-readable run mode.
- `ResumePrompt`, `SoftBlockModal`: modal overlays with their own shape contracts.
- `ReviewScreen` internal cards: already use the `<Card>` warm-supporting pattern correctly for nested groupings; changing them would flatten a useful structural distinction (warm cards inside a white page, each grouping one related review input).
- `CompleteScreen`: the inverted-pyramid layout is doing real work; the one `<Card>` recap block stays `soft` because it's a supporting surface on the verdict page.
- `SetupScreen` / `TodaysSetupScreen`: chip-based rows, not card-based. The current flat `<section>` structure is already calm.
- `SafetyCheckScreen`: the safety questions must remain maximally clear; surface calm here is secondary to behavioral clarity.
- Palette or token changes. No warmer page background in F2.

## Requirements trace

- R1. `ui/Card.tsx` exports a `FOCAL_SURFACE_CLASS` constant containing `rounded-[16px] bg-bg-primary shadow-sm ring-1 ring-text-primary/5`, padding-agnostic, so list containers (e.g. Home's secondary `<ul>`) can reuse the surface without inheriting padding they don't want.
- R2. `<Card>` gains an optional `variant: 'soft' | 'focal'`. Default is `'soft'` — every existing consumer continues to render `rounded-[12px] bg-bg-warm p-4` unchanged.
- R3. `<Card variant="focal">` renders `flex flex-col gap-4 p-6` on top of `FOCAL_SURFACE_CLASS`. This is the default focal-card shape.
- R4. `<Card>` continues to forward `aria-label` so existing consumers (e.g. `CompleteScreen`'s `<Card aria-label="Session recap">`) keep their accessibility contract.
- R5. `HomePrimaryCard`'s module-local `PRIMARY_CARD_CLASS` reads as a derivative of the shared token, not a parallel copy.
- R6. `HomeScreen`'s secondary-list `<ul>` reads the surface class from the same shared token.
- R7. `SettingsScreen` renders the export block as `<Card variant="focal">`.
- R8. `SkillLevelScreen` option buttons use `FOCAL_SURFACE_CLASS` and drop the hard `border-2 border-text-primary/10` in favor of the softer ring.
- R9. No test changes required; existing role- and text-based assertions keep passing.

## Context and research

- `docs/archive/plans/2026-04-19-feat-phase-f1-home-calm-pass-plan.md` — the original calm pass; F2 generalises its local constant.
- `docs/research/japanese-inspired-visual-direction.md` — *shibui* (refined understatement), *tokonoma* (focal zone), *ma* (active space). Shared surface across focal screens lets those behaviors read as a family rather than as one-off Home polish.
- `docs/research/outdoor-courtside-ui-brief.md` — readability contract. Explicitly preserved: RunScreen and TransitionScreen are not touched.

## Key technical decisions

1. **Extend `<Card>` rather than introduce a new primitive.** Reduces the component surface and makes the design-system boundary obvious (one file owns focal vs soft). Back-compat is free because the new prop defaults to `'soft'`.
2. **Export `FOCAL_SURFACE_CLASS` as a const, not a component.** Some consumers (e.g. a `<ul>` with `divide-y` child rows, or a `<button>` element) need the surface without the flex-col / padding defaults that `<Card>` layers on. A class-name constant is the simplest primitive that lets both use cases stay clean.
3. **Padding-agnostic surface token.** The token captures only `rounded-[16px] bg-bg-primary shadow-sm ring-1 ring-text-primary/5`. Consumers add their own padding. This mirrors how `<Card variant="focal">` layers `flex flex-col gap-4 p-6` on top, and how the Home secondary list layers `divide-y overflow-hidden` on top with no padding.
4. **`SkillLevelScreen` stays button-based, not card-based.** The four options are actionable controls, not static cards; they keep their `<button>` semantics, gain the surface shape, and the existing `focus-visible:ring-accent` focus ring is preserved. `min-h-[60px]` → `min-h-[64px]` keeps the tap target comfortably above the courtside 54-60 px baseline (`D49`).

## Implementation units

- [x] **Unit 1: Extract `FOCAL_SURFACE_CLASS` and extend `<Card>`** *(landed 2026-04-19)*

  **Files:**
  - Modify: `app/src/components/ui/Card.tsx`

  **Approach:**
  - Add exported `FOCAL_SURFACE_CLASS` constant with the surface half of the F1 calm-card language.
  - Add optional `variant?: 'soft' | 'focal'` prop to `<Card>`; map to a `VARIANT_CLASS` record so the prop-to-class resolution is one-line readable.
  - Forward `aria-label` as today.
  - Update JSDoc with a Phase F2 reference, a call-out against applying the focal variant to `RunScreen` / `TransitionScreen`, and a pointer back to the Japanese-inspired direction note.

  **Verification:**
  - Existing consumers (`ReviewScreen` RPE / pass-metric / quick-tag cards, `CompleteScreen` session recap) keep their warm surface because they don't pass a `variant`.
  - TypeScript + ESLint clean.

- [x] **Unit 2: Refactor `HomePrimaryCard` + `HomeScreen` secondary list onto the shared token** *(landed 2026-04-19)*

  **Files:**
  - Modify: `app/src/components/HomePrimaryCard.tsx`
  - Modify: `app/src/screens/HomeScreen.tsx`

  **Approach:**
  - Import `FOCAL_SURFACE_CLASS` in both files.
  - `HomePrimaryCard`: rewrite the local `PRIMARY_CARD_CLASS` as `flex flex-col gap-4 p-6 ${FOCAL_SURFACE_CLASS}` so the surface half is a single source of truth. Update the top-of-file JSDoc with a Phase F2 reference.
  - `HomeScreen`: the secondary-list `<ul>` keeps its own `divide-y divide-text-primary/5 overflow-hidden` and composes `${FOCAL_SURFACE_CLASS}` for the surface.

  **Verification:**
  - Pixel-identical rendering to post-F1. Existing `HomeScreen.test.tsx` and `HomePrimaryCard.test.tsx` keep passing unchanged.

- [x] **Unit 3: Apply focal Card to `SettingsScreen`** *(landed 2026-04-19)*

  **Files:**
  - Modify: `app/src/screens/SettingsScreen.tsx`

  **Approach:**
  - Import `Card` from `'../components/ui'`.
  - Replace the ad-hoc legacy section (`rounded-[16px] border border-text-primary/10 bg-bg-primary p-5`) with `<Card variant="focal">`.
  - Outer column: `gap-6 pb-8` → `gap-8 pb-12 pt-2` to match the F1 Home rhythm.
  - Update the top-of-file JSDoc with a Phase F2 reference.

  **Verification:**
  - `SettingsScreen.test.tsx` (export success, export error, disabled state) keeps passing unchanged.
  - The back arrow, heading, and legal-footer paragraph keep their positions and classes.

- [x] **Unit 4: Apply shared surface to `SkillLevelScreen` options** *(landed 2026-04-19)*

  **Files:**
  - Modify: `app/src/screens/SkillLevelScreen.tsx`

  **Approach:**
  - Import `FOCAL_SURFACE_CLASS`.
  - Replace `border-2 border-text-primary/10 bg-bg-primary` in each option's button class with `${FOCAL_SURFACE_CLASS}`.
  - Bump `min-h-[60px]` → `min-h-[64px]`, `px-4 py-3` → `px-5 py-4`, and the `<ul>` gap `gap-3` → `gap-4` for more breathing room.
  - Outer column: `gap-5 pb-8` → `gap-6 pb-12` for rhythm alignment.

  **Verification:**
  - All four options remain full-width tappable regions above the courtside 54-60 px baseline (`D49`).
  - Focus ring (`focus-visible:ring-accent`) is preserved; the `active:bg-bg-warm` press-state flash is preserved.
  - `SkillLevelScreen.test.tsx` keeps passing unchanged.

## System-wide impact

- **Interaction graph:** none. No handlers or routes change.
- **Error propagation:** none.
- **State lifecycle:** none.
- **API surface parity:** `<Card>` gains an optional `variant` prop with a default that preserves every existing render exactly.
- **Integration coverage:** all 67 Vitest files / 496 tests pass unchanged.
- **Unchanged invariants:**
  - Outdoor readability contract (`docs/research/outdoor-courtside-ui-brief.md`): `RunScreen` and `TransitionScreen` are untouched; `D49` touch-target floor respected.
  - Home precedence (`resume > review_pending > draft > last_complete > new_user`).
  - D-C1 soft-block modal, D83 safety-never-prefilled, D37 plan-locking.
  - Accessibility: `role="region"` + `aria-label` on primary cards, `role="list"` on the secondary list, `<Card>`'s `aria-label` passthrough.

## Risks and dependencies

| Risk | Mitigation |
|------|------------|
| The focal surface accidentally reaches `RunScreen` or `TransitionScreen` later | Explicit JSDoc warning on `FOCAL_SURFACE_CLASS` calls out the outdoor contract; review-time hit for any PR that imports it into those files. |
| Existing `Card` consumers break with the new variant API | New prop is optional with a `'soft'` default, and `<Card>`'s children / className / aria-label forwarding is unchanged. |
| `SkillLevelScreen` options feel less button-like after losing the hard border | Buttons retain the `focus-visible:ring-accent` focus ring, the `active:bg-bg-warm` press state, and the explicit `<button>` semantics. The soft ring reads as a card-ish tappable region, consistent with Home's LastComplete / Draft cards. |
| `SettingsScreen` Card loses the legacy bordered look that users might have relied on for scanability | The shared shadow + ring provides sufficient visual separation from the white page; the focal-Card pattern is already validated on the higher-traffic `HomeScreen`. |

## Documentation / operational notes

- No release-note impact; rides the same v0b build.
- Agent-doc validation continues to pass (`bash scripts/validate-agent-docs.sh`).
- If a warmer page-background experiment is run later, it stacks cleanly on top of F2: the focal surface stays white, the page becomes warmer, and the cards pop harder without any class changes needed.

## Sources and references

- `docs/archive/plans/2026-04-19-feat-phase-f1-home-calm-pass-plan.md` — parent plan; F2 extracts F1's local constant.
- `docs/research/japanese-inspired-visual-direction.md` — the `shibui` / `tokonoma` / `ma` framing being applied.
- `docs/research/outdoor-courtside-ui-brief.md` — outdoor readability contract preserved by the deliberate exclusions.
