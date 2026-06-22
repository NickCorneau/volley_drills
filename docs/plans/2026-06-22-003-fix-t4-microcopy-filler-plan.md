---
id: plan-2026-06-22-t4-microcopy-filler
title: "fix: T4 — trim microcopy carrying filler"
status: active
stage: build
type: plan
summary: "Fix theme T4 from the 2026-06-22 minimalism/shibui audit: six user-visible strings carry filler that can be cut 30-50% with no loss of meaning. Copy-only; no behavior, data, route, or assembly change. Every change is coupled to a pinned test string, so each unit updates its tests in the same edit."
origin: docs/design/reviews/2026-06-22-minimalism-shibui-audit.md
last_updated: 2026-06-22
depends_on:
  - docs/design/reviews/2026-06-22-minimalism-shibui-audit.md
  - .cursor/rules/courtside-copy.mdc
  - .cursor/rules/testing.mdc
---

# fix: T4 — microcopy carrying filler

## Summary

Theme T4 of the 2026-06-22 shibui audit: six user-visible strings carry filler ("availability", "to build", "this time", "Check your downloads", "reload the app if it keeps happening", restated section headings, a two-clause reflection prompt) that can be trimmed 30-50% **with no loss of meaning**. Apply the audit's exact target strings.

Copy-only. No behavior, Dexie, route, assembly, or domain change. Every changed string that a test pins is updated in the same unit as the source edit, so the suite stays green.

## Problem frame

The audit ([`docs/design/reviews/2026-06-22-minimalism-shibui-audit.md`](docs/design/reviews/2026-06-22-minimalism-shibui-audit.md) §T4) lists six trims:

1. Setup gating hint: `"Choose wall or fence availability to build."` → `"Pick wall or fence."`
2. Review note label: `"Short note (optional)"` → `"Short note"`
3. Capture chip: `"Couldn't capture reps this time"` → `"Didn't count reps"`
4. Settings export: `"Export saved. Check your downloads."` → `"Export saved."`; `"Export failed. Try again, or reload the app if it keeps happening."` → `"Export failed. Try again."`
5. Review RPE gating hint: `"Rate your effort above to finish."` → `"Pick effort to finish."`
6. Review note placeholder: `"What's worth keeping for next time, or what would you change?"` → `"One line for next time."`

## Constraints honored

- **Courtside-copy** (`.cursor/rules/courtside-copy.mdc`): all replacement strings are plain punctuation, no em-dashes, no jargon. The capture chip keeps the existing `&rsquo;` apostrophe-entity convention (`Didn&rsquo;t count reps`).
- **No envelope change**: copy-only; no participants, workload, route, or data semantics move.
- **A11y**: the capture chip's accessible name derives from its visible text, so it updates with the text; no `aria-label` override exists to desync. No font/contrast/tap-target change.
- **D156 Home covenant**: untouched — none of these surfaces are on Home.

## Key decision

**Trim all three Setup gating-hint siblings for consistency, not only the wall/fence line the audit names literally.** The hint is one ternary in `SetupScreen.tsx` with three mutually-exclusive arms (`Choose players to build.` / `Choose net availability to build.` / `Choose wall or fence availability to build.`). The audit's rationale ("'availability', 'to build' are filler") is general, and the arms render sequentially as the user completes Setup — leaving two arms with the filler the audit just named filler would read as a regression, violating "no loss." Default replacements: `"Pick players."` / `"Pick net."` / `"Pick wall or fence."`. Final phrasing of the two unlisted arms is confirmed against the section labels at implementation; the wall/fence arm is fixed by the audit. If the founder wants strict-literal scope, reverting the two siblings is a one-line change.

## Implementation Units

### U1. Setup gating hints

- **Goal**: Trim the `incompleteHint` ternary; cut "availability" / "to build" filler.
- **Files**: `app/src/screens/SetupScreen.tsx` (the `incompleteHint` ternary, ~L166-173); `app/src/screens/__tests__/SetupScreen.test.tsx` (L99, L873).
- **Approach**: `'Choose players to build.'` → `'Pick players.'`; `'Choose net availability to build.'` → `'Pick net.'`; `'Choose wall or fence availability to build.'` → `'Pick wall or fence.'`. The wall/fence arm is the audit's literal target; the other two follow the Key decision above.
- **Test scenarios**:
  - `SetupScreen.test.tsx:99` — `getAllByText('Choose wall or fence availability to build.')` (expects length 2, the D158 focal + footer dual-render) → update string to `'Pick wall or fence.'`, keep `toHaveLength(2)`.
  - `SetupScreen.test.tsx:873` — `setup-resolved-line-placeholder` `textContent` assertion → update to `'Pick wall or fence.'`.
  - If any test pins the players/net arms, update to the new strings; grep `to build\.` under `app/src` after the edit to confirm no stale assertions remain.
- **Verification**: `npm test -- SetupScreen` green; no `to build\.` filler remains in `SetupScreen.tsx`.

### U2. Review short-note label + placeholder

- **Goal**: Drop the `(optional)` qualifier from the note label and replace the two-clause reflection placeholder with one line.
- **Files**: `app/src/screens/ReviewScreen.tsx` (label ~L204-206, placeholder ~L212, and the rationale comment ~L194-202).
- **Approach**: Label `Short note <span class="font-normal …">(optional)</span>` → `Short note` (drop the `<span>`). Placeholder `"What's worth keeping for next time, or what would you change?"` → `"One line for next time."`. Update the now-stale comment block (it currently justifies the Person-Pillar reflection-question placeholder and the "(optional)" qualifier) so it describes the trimmed copy instead of leaving a misleading rationale; do not narrate the edit.
- **Test scenarios**: `Test expectation: none — no test pins `Short note (optional)` or the old placeholder` (grep confirmed only docs + this source reference the strings). Add no new test for a copy-only label change.
- **Verification**: Manual render shows `Short note` label (no "(optional)") and the `One line for next time.` placeholder; `npm test -- ReviewScreen` green.

### U3. Capture chip "Didn't count reps"

- **Goal**: Replace the `notCaptured` chip text and re-point the four tests that match it by regex.
- **Files**: `app/src/components/PassMetricInput.tsx` (L101); `app/src/components/__tests__/PassMetricInput.test.tsx` (L174); `app/src/screens/__tests__/ReviewScreen.draft.test.tsx` (L131); `app/src/screens/__tests__/ReviewScreen.polish-2026-04-23.test.tsx` (L204); `app/e2e/review-hit-area.spec.ts` (L112-113).
- **Approach**: `Couldn&rsquo;t capture reps this time` → `Didn&rsquo;t count reps` (preserve the `&rsquo;` entity). The chip's accessible name follows its text content, so it updates automatically. The three unit tests and the e2e match the chip by `/couldn.t capture reps/i` (and `/couldn.t capture reps this time/i` in e2e) → update each regex to `/didn.t count reps/i`. Update the e2e human-readable label string `"Couldn't capture reps button"` → `"Didn't count reps button"`.
- **Test scenarios**:
  - `PassMetricInput.test.tsx` "keeps the notCaptured chip present" — assert chip present under the numeric inputs via `/didn.t count reps/i`.
  - `ReviewScreen.draft.test.tsx` — tap chip via `/didn.t count reps/i`; existing draft-tagging assertions (`quickTags` contains `notCaptured`) unchanged (the `notCaptured` tag id is internal, not the visible label — do not rename it).
  - `ReviewScreen.polish-2026-04-23.test.tsx` — `queryByRole('button', { name: /didn.t count reps/i })` for the default-state assertion.
  - `review-hit-area.spec.ts` — `getByRole('button', { name: /didn.t count reps/i })` hit-area target.
- **Verification**: `npm test -- PassMetricInput ReviewScreen.draft ReviewScreen.polish` green; the e2e spec name-matches the chip (run `npm run test:e2e -- review-hit-area` if the e2e harness is available, else rely on the regex grep). Confirm the internal `notCaptured` quick-tag id is untouched everywhere (grep `'notCaptured'`).

### U4. Settings export messages

- **Goal**: Trim the export success and error copy.
- **Files**: `app/src/screens/SettingsScreen.tsx` (success L159, error message L122).
- **Approach**: `Export saved. Check your downloads.` → `Export saved.`; `'Export failed. Try again, or reload the app if it keeps happening.'` → `'Export failed. Try again.'`.
- **Test scenarios**: `Test expectation: none — no SettingsScreen test pins these strings` (grep confirmed: `SettingsScreen.test.tsx` / `SettingsScreen.investment-footer.test.tsx` do not assert export copy; `Callout.test.tsx` uses an independent `"Export saved"` fixture that is not coupled to this screen). No new test for copy-only Callout/StatusMessage content.
- **Verification**: `npm test -- SettingsScreen` green; manual render of the success Callout reads `Export saved.` and the error path reads `Export failed. Try again.`.

### U5. Review RPE gating hint

- **Goal**: Trim the "rate your effort above" hint to a heading-independent action, matching its sibling hint that already starts with "Pick".
- **Files**: `app/src/screens/review/useReviewController.ts` (L266); `app/src/screens/__tests__/ReviewScreen.perDrillAggregate.test.tsx` (L463).
- **Approach**: `'Rate your effort above to finish.'` → `'Pick effort to finish.'`. (The sibling arm `'Pick a reason you ended early to finish.'` at L268 already uses the "Pick … to finish." shape, so this aligns the family.)
- **Test scenarios**: `ReviewScreen.perDrillAggregate.test.tsx:463` — `getByText('Rate your effort above to finish.')` → `getByText('Pick effort to finish.')`.
- **Verification**: `npm test -- ReviewScreen.perDrillAggregate` green.

## Verification (whole change)

- `cd app && npm test` green (the units above touch SetupScreen, PassMetricInput, ReviewScreen.draft, ReviewScreen.polish, ReviewScreen.perDrillAggregate suites).
- `cd app && npm run lint` clean (no em-dash / typography guardrail regressions).
- Grep sweeps confirm no stale assertions: `to build\.` and `/couldn.t capture reps/` should return no `app/src` or `app/e2e` matches after the change.
- Optional courtside dogfood: Setup → Safety → Run → Review → Settings render the six trimmed strings on a 390px viewport.

## Scope Boundaries

### In scope
- The six T4 strings, plus the two sibling Setup gating-hint arms (Key decision), and every test/e2e assertion coupled to them.

### Deferred to Follow-Up Work
- Other audit themes (T1 redundancy has its own plan `2026-06-22-002`; T2 duplication, T3 chrome, T5-T8, the em-dash bug) are separate tasks — not touched here.

### Out of scope
- The internal `notCaptured` quick-tag identifier (a data value, not visible copy) — must not be renamed.
- Any layout, font, contrast, tap-target, behavior, route, or data change.
