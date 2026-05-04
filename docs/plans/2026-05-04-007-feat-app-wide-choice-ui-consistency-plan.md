---
title: "feat: app-wide ChoiceSection consistency"
type: feat
status: active
date: 2026-05-04
origin: docs/brainstorms/2026-05-04-app-wide-choice-ui-consistency-requirements.md
---

# feat: app-wide ChoiceSection consistency

## Overview

Generalize `SetupChoiceSection` / `SetupNestedChoiceBlock` (just shipped on `SetupScreen`) into `ChoiceSection` / `ChoiceSubsection` with `description`, `footerNote`, and `optional` slots, then refactor `SafetyCheckScreen` and `TuneTodayScreen` onto them so every choice row in the pre-run flow uses the same heading scale, gap, chip defaults, and follow-up panel chrome — and so the `text-xs` / `size="sm"` drift class can't reappear.

---

## Problem frame

`SetupScreen` is now consistent via the just-shipped `SetupChoiceSection` (h2 + chip row + optional footnote) and `SetupNestedChoiceBlock` (h3 + warm panel + default `lg` chips). The same choice-row shape exists with the same drift on at least two more screens:

- `SafetyCheckScreen` Recency layoff-bucket follow-up still uses `text-xs` subtitle + `size="sm"` chips inside `bg-bg-warm/60 p-3` — the exact pattern we just upsized in SetupScreen's Wall block.
- `SafetyCheckScreen` Pain section duplicates the heading-plus-description scaffolding inline with no shared wrapper.
- `TuneTodayScreen` Focus section matches canonical h2 + grid by hand but is one careless edit away from drifting.

A primitive that absorbs description + footer + optional slots removes the drift class and gives future screens one obvious entry point.

---

## Requirements trace

- R1. Generalized `ChoiceSection` exposes `title`, `description?`, `footerNote?`, `optional?`, `children` and replaces `SetupChoiceSection`.
- R2. Generalized `ChoiceSubsection` exposes `titleId`, `title`, `description?`, `children`, renders `h3` at the same scale as section h2, default `lg` chips inside warm panel.
- R3. `SetupScreen` is visually unchanged after the rename.
- R4. `SafetyCheckScreen` Recency uses `ChoiceSection`; layoff-buckets follow-up uses `ChoiceSubsection` with the prompt as its `h3` title (drops the `text-xs` `<p>` subtitle, replaces `size="sm"` chips with default `lg`).
- R5. `SafetyCheckScreen` Pain section uses `ChoiceSection` with reassurance as `description`.
- R6a. The layoff-bucket follow-up prompt is rendered as the `h3` title (not as `description`).
- R7. `TuneTodayScreen` Focus uses `ChoiceSection`; the trailing `warning` `StatusMessage` continues to render as a child after the chip grid.
- R8. Existing SetupScreen tests continue to pass; SafetyCheck and TuneToday tests are updated where DOM shifted.
- R9. No `size="sm"` remains in setup-style choice sections of the refactored screens; touch targets stay at `lg` (54 px min height).

---

## Scope boundaries

- `ReviewScreen` and `SettingsScreen` are out of scope. Their sections are Card-wrapped with non-choice-row content (textarea, single-button cards, posture explainer); they share the h2 typography but not the chip-row contract.
- No lint rule, codemod, or visual snapshot guardrail in this PR — primitive consolidation is the structural defense.
- No work on `RpeSelector`, `IncompleteReasonChips`, `PainOverrideCard`, or other custom choice components.
- No palette, color, motion, or copy work.

---

## Context & research

### Relevant code and patterns

- `app/src/components/ui/SetupChoiceSection.tsx` — current shared component; rename target.
- `app/src/components/ui/ToggleChip.tsx` — `lg` (54 px) and `sm` (48 px) sizes; the refactor should standardize on `lg` defaults inside `ChoiceSubsection`.
- `app/src/components/ui/index.ts` — ui barrel; add new exports here.
- `app/src/screens/SetupScreen.tsx` — already on the shared component; will switch to renamed symbols.
- `app/src/screens/SafetyCheckScreen.tsx` — Recency (~L246–L296), Pain (~L298–L323) sections; layoff-bucket panel (~L274–L295).
- `app/src/screens/TuneTodayScreen.tsx` — Focus section (~L69–L82).
- `app/src/screens/__tests__/SetupScreen.test.tsx` — already exercises `h3` heading on Wall block; should not need change.
- `app/src/screens/__tests__/SafetyCheckScreen.test.tsx` and `SafetyCheckScreen.d83-regression.test.tsx` — verify `getByText('Roughly how long off?')` and `getByText('Regular muscle soreness…')` queries; switch to `getByRole('heading', { level: 3 })` where the DOM shifted.
- `app/src/screens/__tests__/TuneTodayScreen.test.tsx` — confirm Focus heading + chip queries still match.

### Existing conventions

- `text-base font-semibold text-text-primary` is the canonical section heading scale (used across all five screens).
- `flex flex-col gap-3` is the canonical section spacing.
- Description copy under headings uses `text-sm text-text-secondary`; footnote copy uses `text-xs text-text-secondary` (Time clarifier).
- Nested follow-up panels use `rounded-[12px] bg-bg-warm/60 p-3` and `flex flex-col gap-2/3`.

### Institutional learnings

- `docs/solutions/2026-05-04-source-backed-content-depth-activation-pattern.md` — generalize on the second instance, not the first; this PR is exactly that.

---

## Key technical decisions

- **D1** Rename `SetupChoiceSection` → `ChoiceSection` and `SetupNestedChoiceBlock` → `ChoiceSubsection`. Update the file path to `app/src/components/ui/ChoiceSection.tsx` so `git mv` cleanly traces history.
- **D2** Add `description?: ReactNode` slot to both components; rendered as `text-sm text-text-secondary` in `ChoiceSection`; rendered before chips in `ChoiceSubsection`.
- **D3** Add `optional?: boolean` slot that emits a regular-weight `(optional)` suffix span inside the heading. Replaces the inline JSX in SetupScreen Focus heading.
- **D4** Keep `footerNote?: string` (existing) unchanged — covers SetupScreen Time clarifier.
- **D5** Drop the `<p>` subtitle in SafetyCheck's layoff-bucket panel; promote the prompt to the `h3` title via `ChoiceSubsection.title`. Matches the Wall fix and reads as one labeled radiogroup to assistive tech.
- **D6** Do NOT keep a `Setup*` alias export. Two surfaces, one name. The barrel exports the new names only.

---

## Open questions

### Resolved during planning

- **Q:** Keep the `Setup*` alias for back-compat? **A:** No — only one consumer (SetupScreen), refactored in the same PR. Aliases would dilute the "one obvious primitive" goal.
- **Q:** Should `description` accept `string` only or `ReactNode`? **A:** `ReactNode` — SafetyCheck Recency intro renders inside a conditional `?:` and consumers may want spans for emphasis.
- **Q:** Move the file or keep the path and rename only? **A:** Move via `git mv` so the history follows; simpler to grep for in 6 months.

### Deferred to implementation

- Whether `ChoiceSubsection` should accept a `tone` prop for warning/danger panels. Not needed for current consumers; defer until a screen actually needs it.

---

## High-level technical design

> Directional guidance — the implementing agent should treat as context, not code to reproduce.

```tsx
type ChoiceSectionProps = {
  title: ReactNode
  description?: ReactNode
  footerNote?: string
  optional?: boolean
  className?: string
  children: ReactNode
}

// <section gap-3>
//   <h2>{title}{optional && <span> (optional)</span>}</h2>
//   {description && <p text-sm text-text-secondary>{description}</p>}
//   {children}
//   {footerNote && <p text-xs text-text-secondary>{footerNote}</p>}
// </section>

type ChoiceSubsectionProps = {
  titleId: string
  title: ReactNode
  description?: ReactNode
  children: ReactNode
}

// <div warm-panel gap-3>
//   <h3 id={titleId} text-base font-semibold>{title}</h3>
//   {description && <p text-sm text-text-secondary>{description}</p>}
//   {children}
// </div>
```

---

## Implementation units

- [ ] U1. **Rename and generalize the primitive**

  **Goal:** Move `SetupChoiceSection.tsx` to `ChoiceSection.tsx`, rename exports, add `description` and `optional` slots.

  **Requirements:** R1, R2, R6a

  **Dependencies:** None

  **Files:**
  - Move: `app/src/components/ui/SetupChoiceSection.tsx` → `app/src/components/ui/ChoiceSection.tsx`
  - Modify: `app/src/components/ui/index.ts` (export `ChoiceSection`, `ChoiceSubsection`, drop `SetupChoiceSection` / `SetupNestedChoiceBlock`)
  - Modify: `app/src/components/ui/ChoiceSection.tsx` (rename symbols, add `description?: ReactNode` and `optional?: boolean` to `ChoiceSection`, add `description?: ReactNode` to `ChoiceSubsection`)

  **Approach:**
  - Use `git mv` so history follows the file.
  - `ChoiceSection`: render heading with optional `(optional)` span; render `description` between heading and children when set; keep existing `footerNote` block.
  - `ChoiceSubsection`: render `description` between `h3` and children when set; preserve current panel chrome.
  - Keep prop names that match what SetupScreen already passes; no callsite breakage from the rename other than the symbol itself.

  **Patterns to follow:** existing `SetupChoiceSection.tsx` structure; `cx` from `app/src/lib/cn`.

  **Test scenarios:**
  - none — pure rename + additive props; behavior covered by consumer tests in U2 / U3 / U4.

  **Verification:** TypeScript build compiles; grep for `SetupChoiceSection`/`SetupNestedChoiceBlock` returns zero hits after consumer updates.

- [ ] U2. **Migrate SetupScreen to renamed primitive**

  **Goal:** Switch `SetupScreen` imports and JSX to `ChoiceSection` / `ChoiceSubsection`; verify visual parity.

  **Requirements:** R3, R8

  **Dependencies:** U1

  **Files:**
  - Modify: `app/src/screens/SetupScreen.tsx` (imports + JSX symbols)
  - Modify (if needed): `app/src/screens/__tests__/SetupScreen.test.tsx` (no DOM change expected; only update if any direct symbol assertions exist)

  **Approach:**
  - Replace `SetupChoiceSection` with `ChoiceSection` and `SetupNestedChoiceBlock` with `ChoiceSubsection`.
  - Optionally collapse the inline `<>{label} <span>(optional)</span></>` Focus title into `<ChoiceSection title="Focus" optional>`. Keep behavior identical; visual diff must be empty.

  **Patterns to follow:** current SetupScreen structure.

  **Test scenarios:**
  - Happy path: existing 9 SetupScreen unit tests continue to pass with no edits.
  - Integration: Setup → Safety navigation in `phase-c3-onboarding.spec.ts` continues to work.

  **Verification:** `npm test -- --run src/screens/__tests__/SetupScreen.test.tsx` passes 9/9; running dev server shows no visual change.

- [ ] U3. **Refactor SafetyCheckScreen Recency + layoff buckets + Pain onto shared primitive**

  **Goal:** Replace inline section/panel scaffolding in SafetyCheckScreen with `ChoiceSection` + `ChoiceSubsection`; promote layoff-bucket prompt to `h3`; drop `size="sm"` chips.

  **Requirements:** R4, R5, R6a, R9

  **Dependencies:** U1

  **Files:**
  - Modify: `app/src/screens/SafetyCheckScreen.tsx`
  - Modify: `app/src/screens/__tests__/SafetyCheckScreen.test.tsx`
  - Modify (if it queries layoff prompt or pain reassurance): `app/src/screens/__tests__/SafetyCheckScreen.d83-regression.test.tsx`

  **Approach:**
  - Recency section → `ChoiceSection title="When did you last train?" description={hasSessionHistory ? '…' : '…'}`. Chips render as a child grid like Setup's Players / Net rows.
  - Layoff-bucket follow-up (rendered when `showLayoffBuckets`) → `ChoiceSubsection titleId="layoff-bucket-label" title="Roughly how long off?"`. Drop the `<p>` subtitle. Drop `size="sm"` from chips. Wire `aria-labelledby="layoff-bucket-label"` on the radiogroup.
  - Keep the `recency === '3+ months'` clinician-nudge `<p>` rendered after the chip row inside the subsection.
  - Pain section → `ChoiceSection title="Any pain that's sharp, or makes you guard a movement?" description="Regular muscle soreness is fine. We'll switch to a lighter session if yes."`. Keep chip row + `tone="warning"` on the `Yes` chip.
  - Update tests that query the dropped subtitle to query the new `h3`; add an assertion that the layoff radiogroup is `aria-labelledby` the new heading.

  **Patterns to follow:** SetupScreen's Wall section as the canonical shape.

  **Test scenarios:**
  - Happy path: After selecting `2+ days ago`, the layoff `radiogroup` is present with the new `h3` `"Roughly how long off?"` and four `lg` chips.
  - Edge case: After selecting a layoff bucket of `3+ months`, the clinician-nudge paragraph still renders below the chips inside the subsection.
  - Integration: `Continue` (Start session) remains disabled until painFlag === false AND a layoff bucket is selected (when `2+` is the primary selection).
  - Regression: Pain section still surfaces the `PainOverrideCard` flow when `Yes` is selected.

  **Verification:** `npm test -- --run src/screens/__tests__/SafetyCheckScreen.test.tsx` passes; affected E2E (`session-flow.spec.ts`, `phase-c3-onboarding.spec.ts`) green.

- [ ] U4. **Refactor TuneTodayScreen Focus onto shared primitive**

  **Goal:** Replace inline section in TuneTodayScreen with `ChoiceSection`; preserve the trailing `StatusMessage` warning slot.

  **Requirements:** R7

  **Dependencies:** U1

  **Files:**
  - Modify: `app/src/screens/TuneTodayScreen.tsx`
  - Modify (if needed): `app/src/screens/__tests__/TuneTodayScreen.test.tsx`

  **Approach:**
  - Replace the inline `<section>` for Focus with `<ChoiceSection title="Focus">`. Pass the chip grid as the first child and the `warning && <StatusMessage>` as the second child — both render below the heading.
  - Confirm `getByRole('radiogroup', { name: 'Focus' })` and chip queries still resolve.

  **Patterns to follow:** SetupScreen Focus row.

  **Test scenarios:**
  - Happy path: TuneToday renders the Focus heading + 4 chips; chip selection updates draft.
  - Edge case: warning `StatusMessage` still appears below the chip grid when controller surfaces a warning.

  **Verification:** `npm test -- --run src/screens/__tests__/TuneTodayScreen.test.tsx` passes.

- [ ] U5. **Run full lint + targeted unit tests + targeted Playwright + tidy**

  **Goal:** Confirm no regression across linked surfaces; clean up stray references.

  **Requirements:** R8

  **Dependencies:** U2, U3, U4

  **Files:**
  - Verify only.

  **Approach:**
  - `npm run lint`
  - Unit: SetupScreen, SafetyCheckScreen (both files), TuneTodayScreen
  - Playwright: `app/e2e/phase-c3-onboarding.spec.ts`, `app/e2e/session-flow.spec.ts` (only the affected flows)
  - Grep workspace for residual `SetupChoiceSection` / `SetupNestedChoiceBlock` strings; should be zero.

  **Test scenarios:**
  - none — verification-only unit.

  **Verification:** All listed commands exit 0; grep returns no stale references.

---

## System-wide impact

- **Interaction graph:** None — pure UI composition refactor.
- **Error propagation:** Unchanged — error and warning slots continue to render as children of the section.
- **State lifecycle risks:** None — no state moves; controllers untouched.
- **API surface parity:** Internal symbol rename in `app/src/components/ui` barrel. No external consumers.
- **Integration coverage:** Existing E2E for Setup → Safety → Run continues to verify the chain end-to-end.
- **Unchanged invariants:** SetupScreen visual output; all `aria-labelledby` wiring contracts on radiogroups.

---

## Risks & dependencies

| Risk | Mitigation |
|---|---|
| Removing the `<p>` subtitle in SafetyCheck breaks an E2E spec that queries the text | Pre-grep ran on `app/e2e/` — no matches for `Roughly how long off`. Update the unit test instead. |
| Inline `(optional)` JSX in SetupScreen Focus is more readable than a boolean prop | Keep the JSX form and skip the `optional` prop, OR use the prop and accept it as a small ergonomic upgrade. Decision in U2 — caller's choice. |
| `aria-labelledby` on the layoff radiogroup misses the new `h3` id | U3 explicitly wires `titleId` and asserts in the test. |
| Visual diff appears in SetupScreen after rename | U2 compares running dev server before/after; tests gate behavior. |

---

## Documentation / operational notes

- No docs update beyond this plan and the upstream brainstorm/ideation.
- No deploy implication; the Cloudflare Worker rebuild on next push picks it up.

---

## Sources & references

- Origin: [docs/brainstorms/2026-05-04-app-wide-choice-ui-consistency-requirements.md](../brainstorms/2026-05-04-app-wide-choice-ui-consistency-requirements.md)
- Ideation: [docs/ideation/2026-05-04-app-wide-choice-ui-consistency-ideation.md](../ideation/2026-05-04-app-wide-choice-ui-consistency-ideation.md)
- Prior baseline commit: `f43e923` `feat(setup): unify Today setup choice rows behind shared component`
