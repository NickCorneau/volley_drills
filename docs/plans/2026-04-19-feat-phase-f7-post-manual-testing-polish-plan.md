---
title: "feat: Phase F7 post-manual-testing polish (RPE alignment, Drills rename, button press states)"
type: plan
status: landed
landed_on: 2026-04-19
date: 2026-04-19
origin: "Follow-on to F1-F6 calm pass; three distinct issues surfaced during user manual testing (RPE chip alignment screenshot, 'Blocks completed' disambiguation, Button variant press-state gaps)"
depends_on:
  - docs/plans/2026-04-19-feat-phase-f1-home-calm-pass-plan.md
  - docs/plans/2026-04-19-feat-phase-f2-shared-focal-surface-plan.md
  - docs/plans/2026-04-19-feat-phase-f3-warmer-page-surface-plan.md
  - docs/plans/2026-04-19-feat-phase-f6-home-hover-press-darkening-plan.md
  - docs/research/japanese-inspired-visual-direction.md
---

# Phase F7: Post-manual-testing polish

## Overview

Phase F7 lands three distinct small-but-clearly-bad polish fixes surfaced during the first hands-on dogfeed of the F1-F6 calm pass:

1. **RPE chip grid alignment bug.** On the Quick Review screen, the 11-chip RPE grid rendered anchored chips (0/REST, 3/EASY, 5/MODERATE, 7/HARD, 10/MAX) with two lines of internal content and unanchored chips (1, 2, 4, 6, 8, 9) with one line — both centered with `justify-center`. That pushed the numbers in anchored chips slightly *higher* in the chip than their unanchored neighbors, so numbers didn't line up across each row of the grid.
2. **"Blocks completed" ambiguity on Complete.** The session recap on `CompleteScreen` rendered `Blocks completed: 4/4` directly above `Good passes: N/M`. In volleyball, a "block" is also a defensive action at the net — so reading "Blocks: 4/4" next to "passes" read like a volleyball-action summary rather than a workout-segment summary.
3. **Button variant press-state gaps.** Auditing `Button.tsx`, `primary`, `outline`, and `danger` all carried tactile press states (`active:` bg or text change). `secondary` and `ghost` carried none, so they felt dead next to the other variants.

Each is a pure visual / copy change. No behavior changes, no schema, no new controls, no new tokens. No test changes required.

## Problem frame

- Manual testing is now the primary source of UX feedback (Phase C + E are feature-complete for D91; F1-F6 is the calm-pass layer). Issues that don't show up in automated tests need a clean landing path.
- Each of the three fixes is small and independent, but they share the same origin (manual-testing dogfeed) and the same scope class (visual / copy only). Bundling into one phase keeps the plan tree cohesive without overweighting three one-line changes as separate phases.

## Scope boundaries

### In scope

- **RPE chip grid:** always render the anchor text line — with `\u00A0` (non-breaking space) as placeholder when no anchor exists — so every chip has the same two-line internal structure.
- **Session recap:** rename `Blocks completed` → `Drills completed` on `CompleteScreen`.
- **Button.tsx:** add `active:bg-bg-warm` to the `secondary` variant and `active:text-accent-pressed` to the `ghost` variant.

### Out of scope

- **Back-arrow button extraction.** `SettingsScreen`, `SetupScreen`, `SafetyCheckScreen`, and a few others each render a custom `← Back` / `← Home` / `← Skill level` button with inline styling. Consolidating these into a shared `<BackButton>` component is a reasonable consistency follow-up but a bigger refactor than Phase F7 should carry. Candidate for F8 or later.
- **Tertiary text-link button normalization.** Several screens render custom inline text-link buttons (`Change setup`, `Skip review`, `Finish later`, `Not sure yet`, `Start a different session`) with similar-but-not-identical class strings. Candidate for a later pass; not addressed here.
- **`soft` Button variant.** Defined in `Button.tsx` but not currently used anywhere in the app. Leaving it alone until it's used and the right press state can be chosen in context.
- **`primary` min-h-[56px] vs all-others min-h-[54px] discrepancy.** Intentional: the primary CTA should feel fractionally bigger than secondary / outline CTAs on the same screen. Not a consistency bug.
- **Screen title casing** (`Today's Setup` title case vs `Before we start` sentence case). Worth its own pass; scope-checked out of F7.
- **Any change to app-wide "block" vocabulary.** `RunScreen`, `TransitionScreen`, and `SafetyCheckScreen` all use "block" in user-facing copy (`Skip Block`, `Start Next Block`, `Solo + Open · 15 min, 4 blocks`). The F7 rename is limited to the one place the word was sitting next to `passes` and creating the volleyball-action reading; broader vocabulary alignment is a separate design decision.

## Requirements trace

- R1. `RpeSelector` renders the anchor `<span>` unconditionally for every chip. When no anchor exists, the span renders `\u00A0` (non-breaking space) so the span has the same height as anchored chips.
- R2. The anchor span is marked `aria-hidden="true"` so the `<button>`'s existing `aria-label` (`"${n}, ${anchor}"` or `"${n}"`) remains the sole accessible name — the visual anchor text is decorative.
- R3. Every chip in the grid has the same two-line internal structure; row baselines align for numbers within a row.
- R4. `CompleteScreen`'s session recap renders `Drills completed` instead of `Blocks completed`. The numeric value (`{completedBlocks}/{totalBlocks}`) is unchanged — each v0b session block contains exactly one drill, so the count stays correct.
- R5. `Button` variant `secondary` carries `active:bg-bg-warm` (matches `outline`'s active state).
- R6. `Button` variant `ghost` carries `active:text-accent-pressed` (darkens the accent text color while pressed; ghost has no background to darken by design).
- R7. No existing tests need changes. Role, accessible name, and visible-copy assertions all pass unchanged.
- R8. `Button.test.tsx` class-presence assertions (`bg-accent`, `border-2`, `text-text-primary`, `w-full`, `flex-1`) are unaffected — the new `active:` utilities are additive.

## Key technical decisions

1. **Reserve anchor line, don't move anchor labels outside the chip.** An alternative fix was to put the anchor labels *below* the chip grid as a separate row. But that disconnects the anchor from the chip surface visually — the color-inversion on the selected chip (white anchor text on accent background) only works if the anchor lives inside the chip. Reserving the line with `\u00A0` preserves the current selected-state rendering.
2. **`aria-hidden` on the now-always-rendered anchor span.** Pre-F7, the anchor was rendered conditionally and was arguably part of the accessible name via text content. Post-F7 it's always rendered (and now always includes `\u00A0` placeholder), so making it decorative-only via `aria-hidden` prevents screen readers from announcing a trailing empty space. The `aria-label` on the button continues to carry the full "3, easy" form.
3. **Rename at the label layer, not the model layer.** The `SessionPlan.blocks[]` array and `ExecutionLog.blockStatuses[]` stay named `blocks`. The rename is purely the user-facing string on one label. Single source of truth for the count (`completedBlocks / totalBlocks`) is unchanged.
4. **Different press-state mechanism for `ghost` vs `secondary`.** Secondary has a visible border and neutral text; adding `active:bg-bg-warm` gives a fill change on press, matching the outline pattern. Ghost has no background or border by design; darkening the accent text to `accent-pressed` is the only way to give tactile feedback without introducing a box that would change ghost's visual purpose (sitting quietly inside other surfaces like `HomeSecondaryRow`).

## Implementation units

- [x] **Unit 1: RPE chip grid alignment** *(landed 2026-04-19)*

  **Files:**
  - Modify: `app/src/components/RpeSelector.tsx`

  **Approach:**
  - Change the conditional anchor render (`{anchor && <span>...</span>}`) to an unconditional render with `\u00A0` fallback.
  - Add `aria-hidden="true"` to the anchor span so the button's `aria-label` remains the accessible name.
  - Update the top-of-file comment block with a Phase F7 note explaining the alignment fix.

  **Verification:**
  - eslint + vitest clean.
  - Visual check on Quick Review confirms rows of numbers now share a baseline.

- [x] **Unit 2: "Drills completed" rename** *(landed 2026-04-19)*

  **Files:**
  - Modify: `app/src/screens/CompleteScreen.tsx`

  **Approach:**
  - Replace the `<dt>Blocks completed</dt>` label with `<dt>Drills completed</dt>`.
  - Inline comment explaining the volleyball-action disambiguation.

  **Verification:**
  - eslint + vitest clean.
  - No existing tests assert the "Blocks completed" string.

- [x] **Unit 3: Button variant press states** *(landed 2026-04-19)*

  **Files:**
  - Modify: `app/src/components/ui/Button.tsx`

  **Approach:**
  - Add `active:bg-bg-warm` to the `secondary` variant class list.
  - Add `active:text-accent-pressed` to the `ghost` variant class list.
  - Inline comments pointing to the F7 rationale (matching the press-state coverage that `primary` / `outline` / `danger` already carry).

  **Verification:**
  - eslint + vitest clean. `Button.test.tsx` assertions unaffected.
  - Manual dogfeed: Skip Block / Shorten / Swap / End Session (`secondary` on `RunControls`) now flash a warm tint on press. Finish review / Open / Repeat (`ghost` on `HomeSecondaryRow`) darken the text on press (complementing the row-level F6 wash).

## System-wide impact

- **Interaction graph:** none. No handlers or routes change.
- **Error propagation:** none.
- **State lifecycle:** none.
- **API surface parity:** none. `Button`'s prop signature is unchanged; new `active:` utilities are additive.
- **Integration coverage:** 67 Vitest files / 496 tests green.
- **Unchanged invariants:**
  - RPE selection semantics: value range `0-10`, single-select radiogroup, `aria-label` unchanged.
  - Session recap count math: still `completedBlocks.length / plan.blocks.length`.
  - All Button variant props and focus-ring contracts unchanged.

## Risks and dependencies

| Risk | Mitigation |
|------|------------|
| `\u00A0` anchor placeholder creates an unexpected glyph on some fonts | Non-breaking space is a Unicode whitespace character with no visual glyph. Inter (app's font stack fallback is system sans) renders it as transparent space. No visible artifact. |
| Screen readers read a trailing empty space on unanchored chips | `aria-hidden="true"` on the anchor span plus the existing button-level `aria-label` ensures only the accessible name is announced. Decorative span is filtered from the AX tree. |
| `Drills completed` drifts semantically as the session model grows | Today each block has exactly one drill; if a future session model grows multi-drill blocks, the label will need to update. Counted risk — the 1-drill-per-block invariant is stable for v0b and M001-build. |
| `active:text-accent-pressed` on ghost looks too subtle in `HomeSecondaryRow` where the row itself already darkens on press | The row darkens the surface (F6), the button darkens the accent text (F7). Both cues fire simultaneously for a touch press; the text-color change adds the "yes, your finger hit *this* button" confirmation on top of the surface change. Dogfeed confirmation recommended. |

## Documentation / operational notes

- No release-note impact; rides the same v0b build.
- The back-button and text-link consolidation candidates flagged in "Out of scope" should be considered for F8 or a later pass. Ideally bundled with the screen-title casing decision into one "design-system consolidation" pass.
- No updates needed to `docs/catalog.json`, `AGENTS.md`, or agent-doc routing surfaces.

## Sources and references

- `docs/plans/2026-04-19-feat-phase-f1-home-calm-pass-plan.md` through `-f6-home-hover-press-darkening-plan.md` — the surrounding calm pass.
- `docs/research/japanese-inspired-visual-direction.md` — restraint / shibui posture applied to press states.
- Manual dogfeed screenshot (2026-04-19, Quick Review) — surfaced the RPE alignment bug.
