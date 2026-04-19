---
title: "feat: Phase F12 UX consistency sweep (sentence case, no emoji, footer period)"
type: plan
status: landed
landed_on: 2026-04-19
date: 2026-04-19
origin: "Chat page-by-page red-team after F11 landed; cf. `docs/research/brand-ux-guidelines.md`"
depends_on:
  - docs/plans/2026-04-19-feat-phase-f8-typography-foundation-plan.md
  - docs/plans/2026-04-19-feat-phase-f11-brand-hero-typography-plan.md
  - docs/research/brand-ux-guidelines.md
  - docs/research/japanese-inspired-visual-direction.md
---

# Phase F12: UX consistency sweep

## Overview

Phase F12 is the small copy-consistency pass that closes the four drifts surfaced by the 2026-04-19 page-by-page red-team walk. It applies the sentence-case rule from `docs/research/brand-ux-guidelines.md` §1.4 to the two Title-Cased screen titles and the seven Title-Cased button labels, replaces the two remaining emoji UI markers with SVGs, and adds a period to the Home-screen footer copy so it matches the Settings footer.

No new features, no new components, no visual scale changes. F12 is strictly alignment of what is already there to the rules F8–F11 established.

## Problem frame

The red-team walk at 390 × 844 (2026-04-19 evening, after F11) identified four clear drift points:

1. **Screen-title case drift.** `Today's Setup` and `Quick Review` render in Title Case; every other title (`Before we start`, `Settings`, `Volleycraft`, `Where are you today?`, `Today's verdict`) is sentence case.
2. **Button-label case drift.** Seven production buttons are Title Case (`Finish Review`, `Build Session`, `Submit Review`, `Start Next Block`, `End Session`, `Skip Block`, `Reopen Session`); every other multi-word button label is sentence case (`Start a different session`, `Repeat this session`, `Continue with lighter session`, `Start first workout`, `Change setup`, `Skip review`, `Repeat what you did`, `Override: use my original session`).
3. **Emoji in UI chrome.** `🔥` on the `Heat & safety tips` disclosure toggle (`SafetyCheckScreen`); `⚠️` on the `Switched to a lighter session` card header (`PainOverrideCard`). The F1 `Brandmark` rationale explicitly argued emoji should not appear in UI chrome because they tie brand to host-OS glyph rendering. Two emoji slipped through.
4. **Footer period drift.** `Your data stays on this device` on `HomeScreen` (no period); `Your data stays on this device.` on `SettingsScreen` (period). Same copy, different punctuation.

These are exactly the kind of drifts a style-guide doc catches — and `docs/research/brand-ux-guidelines.md` was just written to codify the rules. F12 is the one pass that brings the code into alignment with the guidelines.

## Requirements trace

- **R1.** Every `.tsx` under `app/src/` that renders a multi-word button label in Title Case is converted to sentence case. The seven known call-sites:
  - `Finish Review` → `Finish review` (`HomePrimaryCard.tsx`, `ReviewPendingCard` variant)
  - `Build Session` → `Build session` (`SetupScreen.tsx`)
  - `Submit Review` → `Submit review` (`ReviewScreen.tsx`)
  - `Start Next Block` → `Start next block` (`TransitionScreen.tsx`)
  - `End Session` → `End session` (`RunControls.tsx`, `RunScreen.tsx` end-confirm modal)
  - `Skip Block` → `Skip block` (`RunControls.tsx`)
  - `Reopen Session` → `Reopen session` (`ResumePrompt.tsx`)
- **R2.** The two Title-Cased screen titles render in sentence case:
  - `Today's Setup` → `Today's setup` (`SetupScreen.tsx`)
  - `Quick Review` → `Quick review` (`ReviewScreen.tsx`)
- **R3.** The two emoji in UI chrome are replaced with inline SVGs that inherit `currentColor` and match the stroke weight convention in §5 of the guidelines. The emoji literals `🔥` and `⚠️` are removed from source.
- **R4.** `HomeScreen.tsx` footer copy gains a trailing period: `Your data stays on this device` → `Your data stays on this device.`
- **R5.** Every Vitest / React Testing Library assertion on the old strings is updated to the new strings. Every Playwright assertion on the old strings (`Today's Setup` in e2e specs, `Today's Setup` in `e2e/helpers.ts`) is updated.
- **R6.** No behavior change, no schema change, no token change, no component-API change. Only copy + one-glyph swap on two components.
- **R7.** The `Button` / `BackButton` / semantic-color systems are unchanged. Single-word imperative buttons (`Done`, `Pause`, `Next`, `Resume`, `Yes`, `No`) are untouched — sentence case and title case read identically for single words.
- **R8.** `copyGuard.test.ts` (which checks for forbidden UPPERCASE copy) continues to pass; no new forbidden strings introduced.

## Scope boundaries

### In scope

- Seven button-label copy edits (R1).
- Two screen-title copy edits (R2).
- Two emoji → SVG swaps (R3).
- One footer period addition (R4).
- Matching updates to Vitest, RTL, and Playwright assertions (R5).
- Inline comments at each touched call-site anchoring the change to this plan.

### Out of scope — explicit deferrals

- **Drill names and plan names** (`Solo + Net`, `One-Arm Passing Drill`, `Pass & Slap Hands`). These are content-level names, not UI chrome; sentence-case rule does not apply.
- **Dexie / schema identifier casing.** Not user-facing; untouched.
- **Run-screen information-density cleanup** (drill title + instructions + cues + timer on one screen). Content-level; deferred to post-D91 field evidence per F11 *Out of scope*.
- **Run-screen body scale shift (`text-sm` → `text-base` for instructions).** Same deferral.
- **New SVG icon library / icon component system.** Two bespoke inline SVGs in this pass; a shared `<Icon>` primitive is a larger refactor not worth doing for two sites.
- **End-confirm modal copy rewrite.** The modal header reads "End session?" today, which is already sentence case. The confirm button ("End session") is the F12 edit.

## Context and research

- `docs/research/brand-ux-guidelines.md` §1.4 (casing), §3 (copy voice), §5 (iconography, no-emoji rule). F12 operationalises those sections.
- `docs/plans/2026-04-19-feat-phase-f8-typography-foundation-plan.md` — F8 killed the uppercase-tracked-wider eyebrow pattern; F12 extends the same sentence-case rule to titles and multi-word buttons.
- `app/src/components/Brandmark.tsx` — the explicit rationale for no-emoji-in-chrome; F12 finishes the job.

## Key technical decisions

1. **Replace emojis with inline SVG, not with a new icon component.** Two call-sites; a single inline `<svg>` per site is simpler than a shared `<Icon>` primitive that has one consumer each. Follows the `VerdictGlyph` / `SavedCheckIcon` / `Brandmark` pattern already established in the codebase.
2. **`🔥` → flame outline.** A three-line stylised flame at 20 × 20 inheriting `currentColor` (accent). Plain geometric, not decorative; matches the Brandmark's stroke-based voice.
3. **`⚠️` → triangle-with-exclamation outline.** A 20 × 20 warning triangle glyph inheriting `currentColor`. Keeps the warning semantic (the card surface is already `warning-surface`) without the OS-lottery emoji.
4. **Do not re-case single-word imperatives.** `Done`, `Pause`, `Next`, `Resume`, `Yes`, `No`, `Shorten`, `Override`, `Continue`, `Exporting…`, `Building…`, `Saving…` — these read identically in title case and sentence case, so touching them is pure churn. Leave.
5. **Do not re-case drill names or plan names.** `One-Arm Passing Drill`, `Pass & Slap Hands`, `Solo + Net`, `Lower-body Stretch Micro-sequence` — these are content strings authored by a human for volleyball-semantic clarity, not UI chrome. Leave.
6. **Test assertions use `findByRole`/`getByRole` with a string name argument, not CSS-class selectors.** The updates are mechanical find-and-replace of the string literal in the `name:` option; no test restructuring needed.

## Implementation units

- [x] **Unit 1: Sentence-case the screen titles** *(landed 2026-04-19)*

  **Files:**
  - Modify: `app/src/screens/SetupScreen.tsx` (`Today's Setup` → `Today's setup`)
  - Modify: `app/src/screens/ReviewScreen.tsx` (`Quick Review` → `Quick review`)
  - Modify tests: `app/e2e/session-flow.spec.ts`, `app/e2e/accessibility.spec.ts`, `app/e2e/warm-offline.spec.ts`, `app/e2e/edge-cases.spec.ts`, `app/e2e/helpers.ts` — all `Today's Setup` assertions updated.
  - Comments in `TodaysSetupScreen.tsx`, `SetupScreen.tsx`, `SkillLevelScreen.tsx` that reference the label by name are historical/documentary; left as-is.

- [x] **Unit 2: Sentence-case the multi-word button labels** *(landed 2026-04-19)*

  **Files:**
  - Modify: `app/src/components/HomePrimaryCard.tsx` (`Finish Review`)
  - Modify: `app/src/screens/SetupScreen.tsx` (`Build Session`)
  - Modify: `app/src/screens/ReviewScreen.tsx` (`Submit Review`)
  - Modify: `app/src/screens/TransitionScreen.tsx` (`Start Next Block`)
  - Modify: `app/src/components/RunControls.tsx` (`Skip Block`, `End Session`)
  - Modify: `app/src/screens/RunScreen.tsx` (`End Session` in end-confirm modal)
  - Modify: `app/src/components/ResumePrompt.tsx` (`Reopen Session`)
  - Modify tests: `app/src/screens/__tests__/HomeScreen.precedence.test.tsx`, `app/src/screens/HomeScreen.test.tsx`, `app/src/screens/__tests__/HomeScreen.start-different-session.test.tsx`, `app/src/lib/copyGuard.test.ts` (fixture strings), `app/src/screens/__tests__/ReviewScreen.pair-copy.test.tsx` — all button-label assertions updated.

- [x] **Unit 3: Swap the two UI emoji for inline SVGs** *(landed 2026-04-19)*

  **Files:**
  - Modify: `app/src/screens/SafetyCheckScreen.tsx` (`🔥` → flame outline SVG, 20 × 20, `currentColor`).
  - Modify: `app/src/components/PainOverrideCard.tsx` (`⚠️` → warning-triangle outline SVG, 20 × 20, `currentColor`, wrapped in an `aria-hidden` `<span>` so the card's heading still carries the accessible name).

- [x] **Unit 4: Add period to Home footer** *(landed 2026-04-19)*

  **Files:**
  - Modify: `app/src/screens/HomeScreen.tsx` (`Your data stays on this device` → `Your data stays on this device.`).

## System-wide impact

- **Interaction graph:** none.
- **Error propagation:** none.
- **State lifecycle:** none.
- **API surface parity:** none.
- **Integration coverage:** existing Vitest and Playwright tests will fail on the old strings without updates; Unit 1, Unit 2 explicitly update them. Post-F12, the full suite continues to pass.
- **Unchanged invariants:**
  - Outdoor readability contract.
  - All F8 / F9 / F10 / F11 typography work.
  - Home precedence model and soft-block interception.
  - Active-run cue-stack invariants.
  - `D91` field-test artifact behavior.
  - `D125` product-naming scope.

## Risks and dependencies

| Risk | Mitigation |
|------|------------|
| A Playwright test still references `Today's Setup` that the grep missed | Full `rg` pass before and after; `npm run lint && npm run test && npm run test:e2e` is the verification gate. |
| Emoji replacement SVGs render visibly differently in dogfeed | The old emoji were already OS-specific (Apple vs Google vs Microsoft flame icons diverge visually); replacing with a deterministic outline SVG is strictly an improvement in visual consistency. |
| Button-label case change triggers a copy-review cycle | The change is mechanical sentence-case per the new guidelines doc; no semantic or product-meaning change. The button still has the same accessible name (just lowercase-after-first-letter), still routes the same way, still carries the same intent. |
| `copyGuard.test.ts` FORBIDDEN regex flags a new pattern | F12 does not introduce any UPPERCASE literals; only removes casing drift. copyGuard should remain green. |

## Documentation / operational notes

- No `docs/catalog.json` entry needed. `docs/research/brand-ux-guidelines.md` is added in the same pass and referenced from F12's frontmatter; the catalog does not index every research note.
- No release-note impact.
- F12 is the last of the F-series typography/brand passes planned for now. The remaining deferrals (body-scale shift, Run-screen content density, accent-color revisit) wait for D91 field evidence.

## Sources and references

- `docs/research/brand-ux-guidelines.md` — the canonical style reference this pass enforces.
- `docs/research/japanese-inspired-visual-direction.md` — shibui restraint; sentence case reads calmer than Title Case for the same words.
- `docs/plans/2026-04-19-feat-phase-f8-typography-foundation-plan.md` — established the sentence-case direction for eyebrow labels; F12 extends to titles and buttons.
- `app/src/components/Brandmark.tsx` — the no-emoji-in-chrome rationale F12 finishes.
