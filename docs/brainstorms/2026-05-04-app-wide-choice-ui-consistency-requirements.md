---
id: brainstorm-2026-05-04-app-wide-choice-ui-consistency
title: App-wide choice-row UI consistency requirements
status: active
stage: requirements
type: requirements
summary: "Promote SetupChoiceSection to a general ChoiceSection primitive and refactor SafetyCheckScreen + TuneTodayScreen onto it so every choice row in the pre-run flow shares one heading, chip, and follow-up scaffold."
last_updated: 2026-05-04
depends_on:
  - docs/ideation/2026-05-04-app-wide-choice-ui-consistency-ideation.md
---

# App-wide choice-row UI consistency

## Problem frame

`SetupScreen` was just refactored to `SetupChoiceSection` + `SetupNestedChoiceBlock` so every row uses one heading scale, gap, and chip-row treatment. The same pattern shape exists, with the same drift, on at least two other screens:

- `SafetyCheckScreen` — Recency section's layoff-bucket follow-up uses a `text-xs` subtitle and `size="sm"` chips inside a warm panel — the exact pattern that just got fixed in SetupScreen's Wall block. The Pain section uses a `text-sm` description but no shared section wrapper.
- `TuneTodayScreen` — Focus section already matches the canonical h2 + grid chips by hand, but doesn't share the component, so future drift is one commit away.

Without a shared primitive these screens will keep drifting whenever any one of them is touched.

## Goal

Make every choice row in the pre-run flow render through one shared `ChoiceSection` (and one shared `ChoiceSubsection` for nested follow-ups), so heading scale, gap, chip defaults, and follow-up panel chrome are structurally the same across screens, and the same drift class can't reappear.

## Users and value

- **Founder dogfood (D130)** — the app should look like one product, not three. Eliminating heading-scale drift on Safety reduces the "is this a bug or intentional?" cognitive load before the timer starts.
- **Future agent edits** — one obvious primitive to reach for, with description / footnote / optional slots that already cover the patterns in use today.

## Scope

### In scope

- Generalize `SetupChoiceSection` → `ChoiceSection` with optional `description`, `footerNote`, and `optional` (heading-suffix) slots; preserve current behavior so SetupScreen does not visually change.
- Promote `SetupNestedChoiceBlock` → `ChoiceSubsection` with the same `description` slot for the prompt; keep the warm panel + h3 + default-`lg` chips contract.
- Refactor `SafetyCheckScreen` Recency + Pain sections onto `ChoiceSection`; refactor the layoff-bucket follow-up onto `ChoiceSubsection` (replacing the `text-xs` subtitle and `size="sm"` chips with the canonical scale).
- Refactor `TuneTodayScreen` Focus section onto `ChoiceSection`.
- Keep export names backward-compatible at the index barrel during the rename so unrelated future commits don't break.
- Update unit and existing E2E tests that key off the previous DOM (e.g. `text-xs` heading queries, `getByText('Roughly how long off?')` etc.) to assert the new heading shape.

### Out of scope

- Extending the primitive to `ReviewScreen` or `SettingsScreen` — those are Card-wrapped sections with different content shapes (textarea, single-button cards, posture explainer); they share the h2 typography but not the chip-row contract. Defer.
- Lint or visual-snapshot guardrail — covered by the primitive itself; revisit if drift reappears.
- Touching `RpeSelector`, `IncompleteReasonChips`, or other custom choice components — they own their own visual contract.
- Color, palette, or animation work.

## Requirements

- **R1** `ChoiceSection` exposes `title` (ReactNode), `description?` (ReactNode rendered as `text-sm text-text-secondary` between heading and content), `footerNote?` (string rendered as `text-xs text-text-secondary` after content), `optional?` (boolean that appends an `(optional)` regular-weight suffix to the heading), and `children`.
- **R2** `ChoiceSubsection` exposes `titleId` (for `aria-labelledby`), `title` (ReactNode), `description?` (ReactNode), and `children`. Renders an `h3` at the same `text-base font-semibold` scale as section headings, inside a `bg-bg-warm/60` rounded panel with `lg`-sized chips by default.
- **R3** `SetupScreen` continues to render unchanged (Players / Net / Time / Focus / Wall) — visual diff with current snapshot is empty.
- **R4** `SafetyCheckScreen` Recency section uses `ChoiceSection` with `description` set to the existing intro paragraph; the layoff-bucket follow-up uses `ChoiceSubsection` with the prompt as `description` (or `title`, see R6) and `lg`-sized chips.
- **R5** `SafetyCheckScreen` Pain section uses `ChoiceSection` with `description` set to the existing reassurance paragraph; chip row layout (No / Yes with warning tone) is preserved.
- **R6** Decide one convention for the layoff-buckets follow-up prompt:
  - **R6a (chosen)** Treat the prompt as the section title (h3) — same prominence as Wall fix in SetupScreen — so screen readers hear it as a labeled radiogroup. Drop the `<p>` subtitle entirely.
- **R7** `TuneTodayScreen` Focus section uses `ChoiceSection` with the existing chip grid; `warning` `StatusMessage` continues to render below the grid (acceptable as freeform child, no new slot needed).
- **R8** Existing tests for SetupScreen continue to pass. SafetyCheck and TuneToday tests are updated to assert h2 / h3 headings (not subtitle paragraphs) where the DOM has shifted.
- **R9** Touch targets stay at the `lg` chip default (54 px min height) everywhere; no `size="sm"` remains in setup-style choice sections in the refactored screens.

## Acceptance examples

- **AE1** On `SetupScreen`, the Wall block renders an `h3` titled "Wall or fence nearby?" with two `lg` chips beneath; visual unchanged from the just-shipped baseline.
- **AE2** On `SafetyCheckScreen`, after selecting `2+ days ago` the layoff-bucket follow-up renders an `h3` titled "Roughly how long off?" with four `lg` chips of equal width inside the warm panel; no `text-xs` subtitle remains; the radiogroup is `aria-labelledby` the h3.
- **AE3** On `SafetyCheckScreen`, the Pain section heading is the `h2` `"Any pain that's sharp, or makes you guard a movement?"` with the reassurance paragraph rendered as the description slot beneath the heading and above the chips.
- **AE4** On `TuneTodayScreen`, the Focus section renders the `h2` `"Focus"` with the four-chip grid beneath; no inline `text-base font-semibold` h2 remains in the file for that section.
- **AE5** Existing Playwright `getByRole('radiogroup', { name: /wall or fence nearby/i })` and `getByRole('radiogroup', { name: 'Net available' })` continue to resolve.

## Decisions

- **D1** Keep the names `ChoiceSection` and `ChoiceSubsection` — `Setup*` was a placeholder; the right level of abstraction is "row of choice chips with heading," not "setup-screen-only."
- **D2** `description` slot defaults to `text-sm text-text-secondary` (matching SafetyCheck Pain copy), not `text-xs`. The `text-xs` style is reserved for `footerNote` (Time clarifier) where the copy is incidental, not load-bearing context.
- **D3** Keep `SetupScreen` import path through the `ui` barrel; do not require call-site path changes beyond renaming the symbol.
- **D4** Do not attempt to also unify `Card`-wrapped sections in Review / Settings; their content shape isn't choice-row.

## Risks

| Risk | Mitigation |
|---|---|
| Test regressions in Safety E2E from removing the `<p>` subtitle | Update specs to query the new `h3`; existing `aria-labelledby` wiring already covers the radiogroup |
| Visual diff on SetupScreen from rename | Behavior preserved; assert by re-running `SetupScreen.test.tsx` and viewing dev server |
| Tone-aware chips (Recency `0 days` warning, Pain `Yes` warning) need to keep `tone` prop — verify `ChoiceSection` doesn't constrain it | Component renders `children` opaquely; chip props stay caller-owned |

## Verification

- `npm test -- --run src/screens/__tests__/SetupScreen.test.tsx`
- `npm test -- --run src/screens/__tests__/SafetyCheckScreen.test.tsx` (and any other tests touching the refactored sections)
- `npm test -- --run src/screens/__tests__/TuneTodayScreen.test.tsx` (or equivalent)
- `npm run lint`
- Targeted Playwright: `app/e2e/phase-c3-onboarding.spec.ts`, `app/e2e/session-flow.spec.ts`, `app/e2e/edge-cases.spec.ts`
- Visual: open the dev server, walk Setup → Safety → Run on a 390px viewport, confirm heading scale, gap, chip size match across rows
