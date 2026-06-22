---
id: plan-2026-06-22-t2-duplicate-facts
title: "refactor: T2 — pick one home for each duplicated fact"
status: active
stage: build
type: plan
summary: "Fix theme T2 from the 2026-06-22 minimalism/shibui audit: eight facts are each stated two or three times on a single surface (Complete pass-stat, Setup duration, Setup incomplete-hint, Safety adaptation contract, Settings storage/export, onboarding change-later, Drill Check success rule, Run drill name). Each unit picks one home and removes the duplicate. Mostly copy/render subtraction; one domain composer simplifies. Every removed string that a test pins is updated in the same unit."
origin: docs/design/reviews/2026-06-22-minimalism-shibui-audit.md
last_updated: 2026-06-22
depends_on:
  - docs/design/reviews/2026-06-22-minimalism-shibui-audit.md
  - .cursor/rules/courtside-copy.mdc
  - .cursor/rules/component-patterns.mdc
  - .cursor/rules/testing.mdc
---

# refactor: T2 — the same fact stated two or three times on one surface

## Summary

Theme T2 of the 2026-06-22 shibui audit ([`docs/design/reviews/2026-06-22-minimalism-shibui-audit.md`](docs/design/reviews/2026-06-22-minimalism-shibui-audit.md) §T2): eight facts each appear two or three times on one screen. For each, pick **one home** and delete the duplicate(s).

Seven units are copy/render subtraction (no data, route, or assembly change). One unit (Complete, U1) simplifies a pure domain composer so the hero verdict stops restating the recap's number. The dedup is render-only on Safety (U4) and Run (U8) — the underlying domain selectors are unchanged. Every removed string that a test pins is updated in the same unit, so the suite stays green.

## Problem frame

The audit's eight T2 targets, with the chosen home in **bold**:

1. **Complete** — hero reason `"40 good passes today out of 60 attempts."` vs recap row `"67% (40 of 60)"` (P1). The two numbers are even sourced differently (hero = session-level `review.*`; recap = capture-preferred aggregate), so they *can disagree*. Home: **the recap "Good passes" row**. Drop the count from the hero reason.
2. **Setup** — assembled minutes in the focal resolved line *and* in the footer Callout (P1). Home: **the footer Callout** (`"This session will run about N min."`, sits by Build, and is the duration-honesty surface heavily relied on by tests). Drop the `· N min ·` segment from the focal line.
3. **Setup** — `incompleteHint` rendered in the focal slot *and* the footer; the test currently expects both (P1). Home: **the footer hint** (gating affordance beside the disabled Build, consistent with Safety/Review `missingHint` and brand-ux §6.4). Drop the focal-slot placeholder.
4. **Safety** — the adaptation contract explained three ways on a first steered visit: the steering line (specific) + the one-time disclosure + the evergreen gloss (P1). The steering line *instantiates* the steer (keep). Home for the *generic contract*: **one surface at a time** — the disclosure on the first steer, the evergreen gloss thereafter. Suppress the gloss while the disclosure is showing.
5. **Settings** — `"data stays local"` 2–3× (storage primary + secondary + footer); `"use Export to back up"` 3× (Export card + storage ¶3 + persisted-secondary). Homes: **the storage section** for durability, **the Export card** (+ posture secondary) for export. Drop the footer privacy line and storage ¶3.
6. **Onboarding** — `"you can change this later"` twice: subtitle `"Change anytime."` + unsure-card subtext `"…You can change this after."`. Home: **the subtitle** (a courtside-copy canon "good example", rule 1 — must not be silently edited). Trim the unsure-card default subtext.
7. **Drill Check** (`PerDrillCapture`) — the per-drill success rule shown twice on one card: `"You aimed for: {rule}"` above the chips **and** `"Success rule: {rule}"` re-shown inside the count/streak drawer. Home: **the always-visible "You aimed for:" observable line**. Drop the drawer's rule re-show; keep the count-drawer anti-generosity nudge (the actual `D104`/V0B-28 forcing element) standalone at the input.
8. **Run** — drill name in the `h1` **and** echoed as the "Now" cue when the cue falls back to the drill name. Home: **the `h1`**. Suppress the "Now" section when the cue source is the drill-name fallback.

## Constraints honored

- **Courtside-copy** (`.cursor/rules/courtside-copy.mdc`): no em-dashes, plain punctuation, jargon-gated. The onboarding subtitle `"Change anytime."` (rule 1 "good example") and run `"Show more cues"` are **not** touched — editing a canon-pinned good example requires a canon edit, not a silent UI tweak (audit Founder-judgment list).
- **Data honesty**: U1 removes a *duplicate* of the pass stat, not the stat itself — the recap row keeps the capture-preferred number. U2 leaves exactly one duration statement (the footer Callout reads the assembled total), so the screen cannot show two disagreeing durations (the original duration-honesty R4 goal, now satisfied by subtraction instead of by syncing).
- **`D104` / V0B-28 forced criterion** (U7): the *forcing* element — the anti-generosity nudge at the count input — is preserved. Only the redundant rule restatement (already shown in the observable line) is removed.
- **Trust-loop contract** (U4): the steering line and the one-time disclosure are untouched; only the evergreen gloss's render is gated so the contract is explained on exactly one surface at a time. The `deriveSteeringTrace` domain model is unchanged.
- **No envelope change**: no participants, workload, route, Dexie schema, or assembly change. No font / contrast / tap-target change.
- **`D156` Home covenant**: untouched — none of these eight surfaces are on Home.
- **Layering** (`.cursor/rules/data-access.mdc`): U4 and U8 gate rendering in the screen; the domain selectors (`deriveSteeringTrace`, `selectNonSegmentedCurrentCue`) keep returning the same values and their pure tests stay green.

## Cross-plan note

Sibling audit plans (`-002` T1, `-003` T3/T4, `-004` T5) touch some of the same files (`SetupScreen`, `ReviewScreen`, `SettingsScreen`, `PerDrillCapture`, `CompleteScreen`) but are **not yet implemented** — this plan is written against current `main`. The most likely overlap is **T4 U1** (it rewrites the Setup `incompleteHint` strings `"Choose … to build."` → `"Pick …"`). U3 here *removes the focal-slot copy of that hint* and only touches the footer copy of it; if both land, the surviving footer string is whichever T4 settled on. Coordinate at merge; no logic conflict.

---

## Implementation Units

### U1. Complete — pass stat lives only in the recap row

- **Goal**: Stop the hero verdict reason from restating the pass count; the recap "Good passes" row is the single home.
- **Requirements**: T2 item 1 (P1).
- **Files**: `app/src/domain/sessionSummary.ts`; `app/src/domain/sessionSummary.test.ts`; `app/src/screens/__tests__/CompleteScreen.summary.test.tsx`.
- **Approach**: In `composeDefaultReason`, return the count-free completion line keyed on `sessionCount` only — `sessionCount === 1` → `"First one\u2019s in the book. Ready when you are."`, else → `"One more in the book. Ready when you are."`. Remove the `review.totalAttempts > 0` branch and the now-dead `passAttemptStatsLine` helper; rename `FIRST_SESSION_NO_ATTEMPTS_REASON` / `REPEAT_NO_ATTEMPTS_REASON` to drop the `_NO_ATTEMPTS` qualifier (they are no longer attempts-specific); drop the now-unused `review` parameter (call site passes only `sessionCount`). `CompleteScreen.tsx` is **not** edited — the recap `Good passes` row (`formatPassRateLine`, capture-preferred) already renders and becomes the sole home. Update the stale `passAttemptStatsLine`/honest-copy comments to describe the single-home rationale; do not narrate the diff.
- **Patterns to follow**: the existing 3-case composer shape; copy-guard `FORBIDDEN_RE` (new lines contain no forbidden words).
- **Test scenarios**:
  - `sessionSummary.test.ts` — the no-attempts cases (`sessionCount` 5 → `"One more in the book…"`, `sessionCount` 1 → `"First one\u2019s in the book…"`) stay green unchanged. Rewrite the six `attempts > 0` reason assertions (the `"N good passes today out of M attempts. Ready when you are."` lines) to the count-free completion line for the case's `sessionCount`; keep the `not.toContain('Completed session')` guards.
  - `sessionSummary.test.ts` — the FORBIDDEN_RE regex-guard suite still passes (assert no change needed); the pair/solo header and case-mapping suites are untouched.
  - `CompleteScreen.summary.test.tsx` — the two reason assertions (`/^40 good passes today out of 60 attempts\. Ready when you are\.$/`, `/^80 good passes today out of 100 attempts\. Ready when you are\.$/`) → the count-free line; the recap `recap-good-passes` row still renders the number (add/keep an assertion that the recap still shows `67% (40 of 60)`-shape so the home is proven present).
  - `CompleteScreen.copy-guard.test.tsx` — unaffected (asserts recap `Good passes` presence + no em-dash); confirm green, no edit.
- **Verification**: `npm test -- sessionSummary CompleteScreen` green; the pass count appears exactly once on Complete (the recap row).

### U2. Setup — assembled duration lives only in the footer Callout

- **Goal**: One duration statement on Setup.
- **Requirements**: T2 item 2 (P1).
- **Files**: `app/src/screens/SetupScreen.tsx` (the `resolvedLine` memo); `app/src/screens/__tests__/SetupScreen.test.tsx` (D158 focal-line block).
- **Approach**: Change the `resolvedLine` template from `` `${archetypeName} · ${previewTotalMinutes} min · ${focusSegment}` `` to `` `${archetypeName} · ${focusSegment}` ``. The footer Callout `setup-assembled-duration` (`"This session will run about N min."`) is untouched and becomes the sole duration home; the large-gap warning Callout (distinct info) is untouched. `previewTotalMinutes` is still used by `previewLargeGap` and the footer Callout, so it is not dead. Update the D158 resolved-line comment: the screen now states duration once (footer), so the "two statements cannot disagree" rationale is satisfied by there being only one.
- **Patterns to follow**: keep all `focusSegment` provenance branches (`X (recommended)` / `X focus`) exactly as-is — only the minutes segment is removed.
- **Test scenarios**:
  - `SetupScreen.test.tsx` "renders archetype + assembled minutes + focus, agreeing with the footer Callout" → rename/retarget: assert the resolved line matches `/^Solo \+ Net · Passing \(recommended\)$/` (no minutes); keep an assertion that `setup-assembled-duration` still shows `/about \d+ min/`. Remove the two `lineMinutes === calloutMinutes` cross-checks (the line no longer carries minutes).
  - `SetupScreen.test.tsx` — all other resolved-line assertions are anchored on the focus tail (`/Passing focus$/`, `/Serving focus$/`, `/…(recommended)$/`) and stay green; confirm by re-reading the D158 + D159 blocks after the edit.
  - The U5/U6/D154/D159 tests that `await findByTestId('setup-assembled-duration')` are untouched (the Callout testid is preserved) — confirm green.
- **Verification**: `npm test -- SetupScreen` green; the assembled minutes render once (footer).

### U3. Setup — incomplete hint lives only in the footer

- **Goal**: The gating hint appears once, beside the disabled Build button.
- **Requirements**: T2 item 3 (P1).
- **Dependencies**: independent of U2 (different state: hint shows only while incomplete; duration only while complete).
- **Files**: `app/src/screens/SetupScreen.tsx` (focal-slot ternary in `ScreenShell.Body`); `app/src/screens/__tests__/SetupScreen.test.tsx`.
- **Approach**: In the focal slot, render `resolvedLine ? <p data-testid="setup-resolved-line">…</p> : null` — remove the `: incompleteHint ? <p data-testid="setup-resolved-line-placeholder">…</p> : null` arm. The footer `{incompleteHint && !isSaving && <p>…</p>}` stays (the §6.4 "why" beside the disabled CTA, matching Safety/Review `missingHint`). Update the D158 body comment so it no longer claims the focal slot carries the incomplete hint.
- **Test scenarios**:
  - `SetupScreen.test.tsx:99` (onboarding) — `getAllByText('Choose wall or fence availability to build.')).toHaveLength(2)` → `toHaveLength(1)`; update the inline comment (the hint now renders once, in the footer).
  - `SetupScreen.test.tsx` "renders the quiet hint placeholder in the focal slot while Setup is incomplete" → rewrite as "shows the incomplete hint only in the footer": assert `queryByTestId('setup-resolved-line')` and `queryByTestId('setup-resolved-line-placeholder')` are both absent, and the footer hint text (`getByText('Choose wall or fence availability to build.')`) is present.
  - `SetupScreen.test.tsx:399` — `getAllByText(/wall or fence availability/i).length).toBeGreaterThan(0)` stays green (footer present); confirm.
- **Verification**: `npm test -- SetupScreen` green; incomplete Setup shows the hint once (footer), focal slot is empty.

### U4. Safety — one adaptation-contract surface at a time

- **Goal**: On a first steered visit, the generic adaptation contract is explained by the disclosure only; the evergreen gloss returns once the disclosure is dismissed. The specific steering line is unaffected.
- **Requirements**: T2 item 4 (P1).
- **Files**: `app/src/screens/SafetyCheckScreen.tsx` (the "How sessions adapt" gloss `Expander` render guard); `app/src/screens/__tests__/SafetyCheckScreen.steering-trace.test.tsx`.
- **Approach**: Gate the gloss render: `painFlag !== true && steeringTrace?.showGloss && !(steeringTrace.showDisclosure && !disclosureDismissed)`. The steering line and the disclosure `Callout` are untouched. `deriveSteeringTrace` (domain) is **not** edited — `showGloss` / `showDisclosure` stay independent flags; this is a presentation rule ("never both at once"). Add a short comment explaining the dedup.
- **Patterns to follow**: the existing `disclosureDismissed` local mirror already gates the disclosure; reuse it for the gloss guard so the gloss appears on the same tap that dismisses the disclosure.
- **Test scenarios**:
  - New: "suppresses the evergreen gloss while the first-steer disclosure is showing" — steered draft, no dismissal → the disclosure renders and `queryByRole('button', { name: /how sessions adapt/i })` is absent.
  - New (or extend the dismiss test): after `Got it`, the gloss button becomes reachable on the steered draft.
  - `steering-trace.test.tsx` AE6 ("trace copy carries no raw numbers…") opens the gloss on a steered+accepted draft — seed `ADAPT_DISCLOSURE_DISMISSED_KEY: true` before render so the gloss is reachable (the steering line still renders; the test's copy-hygiene intent is preserved).
  - `steering-trace.test.tsx` R10 ("gloss stays reachable on an unsteered draft once any persisted plan was steered") — unaffected (unsteered → `showDisclosure` false → gloss shows); confirm green.
  - `steering-trace.test.tsx` pain-override + dismiss + re-show tests — confirm green (none assert gloss-present while the disclosure is up).
- **Verification**: `npm test -- SafetyCheckScreen` green; first steered visit shows the disclosure with no gloss trigger; post-dismiss shows the gloss.

### U5. Settings — durability and export each stated once

- **Goal**: "Data stays local" lives only in the storage section; "use Export to back up" lives only on the Export card (+ posture secondary).
- **Requirements**: T2 item 5.
- **Files**: `app/src/screens/SettingsScreen.tsx` (footer privacy `<p>`; storage-section ¶3); `app/src/screens/__tests__/SettingsScreen.investment-footer.test.tsx`.
- **Approach**: Remove the footer `<p>Your data stays on this device.</p>` (the storage-section `storageCopy.primary` is the durability home). Remove the storage-section ¶3 `<p>Use Export above to move your history between devices or keep a copy off-device.</p>` (the Export card + the `installed-persisted` posture secondary carry the export-as-backup framing). Keep the investment footer and build-id rows. Update the `ScreenShell` / storage-section comments that reference the now-removed lines.
- **Test scenarios**:
  - `SettingsScreen.investment-footer.test.tsx:86` — the "no sessions" test uses `findByText(/your data stays on this device/i)` as its settle anchor; switch to a stable always-present anchor: `findByText(/about local storage/i)`.
  - No other test pins `"Your data stays on this device."` or `"Use Export above"` (grep-confirmed). The investment-footer count/plural/exclusion assertions are unaffected; confirm green.
- **Verification**: `npm test -- SettingsScreen` green; the storage section still states durability and the Export card still explains export; neither restates the other.

### U6. Onboarding — "change later" stated once (the subtitle)

- **Goal**: The skill-level subtitle keeps the canon `"Change anytime."`; the unsure-card subtext stops repeating it.
- **Requirements**: T2 item 6.
- **Files**: `app/src/components/onboarding/SkillLevelPicker.tsx` (`DEFAULT_UNSURE_SUBTEXT`); `app/src/screens/SkillLevelScreen.tsx` (the comment justifying the default).
- **Approach**: `DEFAULT_UNSURE_SUBTEXT = "We'll size a light starter. You can change this after."` → `"We'll size a light starter."`. Do **not** edit `SkillLevelScreen`'s subtitle `"…Change anytime."` (courtside-copy rule 1 canon). `SettingsSkillLevelScreen` already passes its own `unsureSubtext="We'll size a light starter."`, so it is unaffected. Update the `SkillLevelScreen` comment block that currently describes the default as `"…You can change this after."` so it matches the trimmed default.
- **Test scenarios**:
  - `SkillLevelPicker.test.tsx` — the default-subtext test matches `/We'll size a light starter/` (substring), which still holds after the trim; no change required. Optionally tighten it to the full trimmed string. No test pins `"You can change this after."` (grep-confirmed); no onboarding test pins the `"Change anytime."` subtitle.
- **Verification**: `npm test -- SkillLevelPicker` green; the onboarding unsure card no longer repeats "change later."

### U7. Drill Check (PerDrillCapture) — success rule stated once (the observable line)

- **Goal**: The per-drill success rule renders once on the card (the always-visible "You aimed for:" observable line); the drawer keeps only the count-branch anti-generosity nudge.
- **Requirements**: T2 item 7.
- **Files**: `app/src/components/PerDrillCapture.tsx` (`CountDrawer`, `StreakDrawer`, and the `SuccessRuleLine` helper); `app/src/components/__tests__/PerDrillCapture.test.tsx`.
- **Approach**: Keep `ObservableLine` ("You aimed for: {rule}", with its existing inline gloss) as the single rule home. In `CountDrawer`, replace the `SuccessRuleLine` (which restated "Success rule: {rule}" with the nudge as a `tail`) with the anti-generosity nudge **standalone** (`"If unsure, don\u2019t count it as Good."`), gated on `successRuleDescription` presence to preserve the legacy-drill (undefined) behavior; give it a queryable host (e.g. `data-testid="per-drill-counts-nudge"`). In `StreakDrawer`, remove the `SuccessRuleLine` entirely (no nudge there; the rule is in the observable line). Remove the now-unused `SuccessRuleLine` helper (and its `tail` prop) if nothing else references it. Update the V0B-28 / `D134` comments to state the new placement (rule in the observable line; the count nudge stays at the input as the `D104` layer-1 forcing element). Preserve the `D104` intent: the forcing nudge remains at the point of count entry.
- **Patterns to follow**: `ObservableLine` already uses `useGloss` + `GlossInline` + `GlossReveal` for the rule; the nudge keeps the existing `font-medium text-text-primary` emphasis voice.
- **Test scenarios** (PerDrillCapture.test.tsx):
  - "renders the per-drill success rule and the anti-generosity nudge above the inputs after expanding counts" → rewrite: the rule text lives in `per-drill-observable`; after expanding `Add counts`, the nudge (`/If unsure, don.t count it as Good\./`) is present in the count drawer and the drawer renders **no** second "Success rule:" copy.
  - "does not render the success rule while the counts surface is collapsed" → retarget to the nudge: while collapsed, the nudge is absent (the rule remains visible in the observable line, which is correct).
  - "omits the success rule when successRuleDescription is undefined" → with undefined: no observable rule and, after expanding, no nudge (nudge gated on description presence).
  - "omits the success rule on chip-only drills (none)" → still green (no drawer; observable line carries the rule); confirm.
  - streak "renders the success rule above the input WITHOUT the anti-generosity nudge" → rewrite: the streak drawer renders no "Success rule:" line; the rule is in the observable line; no nudge anywhere.
  - inline-gloss "renders flagged terms in the count-drawer success rule…" and "…streak-drawer success rule…" → rewrite so the glossed term is asserted in the **observable line** (`per-drill-observable`); count-drawer asserts the nudge present, streak-drawer asserts no rule line. The observable-line gloss tests (reveal/no-`(= …)`) are unchanged.
  - Confirm no `DrillCheckScreen` test pins the in-drawer rule (grep: only `PerDrillCapture.test.tsx` references "Success rule").
- **Verification**: `npm test -- PerDrillCapture` green; on Drill Check the success rule shows once (observable line) and the count input keeps the honest-counting nudge.

### U8. Run — drill name lives only in the h1

- **Goal**: When the cue would fall back to the drill name, suppress the "Now" section so the drill name is not echoed under the `h1`.
- **Requirements**: T2 item 8.
- **Files**: `app/src/screens/RunScreen.tsx` (the `currentCue` "Now" `<section>` render). `app/src/screens/run/currentCue.ts` is **unchanged**. New screen test.
- **Approach**: Render the "Now" `<section>` only when `currentCue && currentCue.source !== 'drill-name'`. Keep the full `currentCue` object for the `hasInstructionDetail` / `hasCueDetail` comparisons so the "Show full instructions" `<details>` affordance still surfaces real instructions when the fallback occurs. The `h1` (`currentBlock.drillName`) remains the single home for the drill name. Add a comment noting the fallback echo is intentionally suppressed.
- **Patterns to follow**: the existing `segmentListOwnsCue ? null : selectNonSegmentedCurrentCue(...)` flow; the "Now" region is `role="region"` / `aria-labelledby="current-cue-title"`.
- **Test scenarios**:
  - New (`app/src/screens/__tests__/RunScreen.now-cue-fallback.test.tsx` or extend an existing RunScreen render test): a block with no `segments`, blank `coachingCue`, and a multiline/over-length `courtsideInstructions` (forces the drill-name fallback) → the `h1` shows the drill name, `queryByRole('region', { name: 'Now' })` is null (no echo), and the full instructions are reachable via the "Show full instructions" `<details>`.
  - `currentCue.test.ts` (domain) — unchanged; the selector still returns the `drill-name` fallback; confirm green.
  - `RunScreen.run-face.test.tsx` / `RunScreen.segments.test.tsx` — both use real coaching-cue / single-text-cue blocks (not the drill-name fallback), so the "Now" region still renders; confirm green.
- **Verification**: `npm test -- RunScreen currentCue` green; a cue-less block shows the drill name only in the `h1`.

---

## Verification (whole change)

- `cd app && npm test` green. Suites touched: `sessionSummary`, `CompleteScreen.summary`, `SetupScreen`, `SafetyCheckScreen.steering-trace`, `SettingsScreen.investment-footer`, `SkillLevelPicker`, `PerDrillCapture`, `RunScreen*`, `currentCue`.
- `cd app && npm run lint` clean (no em-dash / typography guardrail regressions; the unused-export removals in U1/U7 leave no dead code).
- `cd app && npm run typecheck` (or `tsc -b`) clean — U1 drops a parameter and a helper; U7 may remove the `SuccessRuleLine` helper.
- Grep sweeps confirm the duplicates are gone where intended: after the change, `setup-resolved-line-placeholder` has no source reference; the focal `resolvedLine` template has no `min` segment; `SafetyCheckScreen` gloss render references `showDisclosure`; `PerDrillCapture` has no in-drawer `Success rule:` literal; `RunScreen` "Now" render references `source !== 'drill-name'`.
- Optional courtside dogfood (390px): Complete (verdict + one number in the recap), Setup (one duration; one incomplete hint in the footer), Safety first-steer (line + disclosure, no gloss; then dismiss → gloss), Settings (durability once, export once), onboarding (no doubled "change later"), Drill Check (rule once), Run (drill name only in the h1 on a cue-less block).

## Scope Boundaries

### In scope
- The eight T2 facts above and every test/e2e assertion coupled to the removed copy/render.

### Deferred to Follow-Up Work
- Other audit themes (T1 `-002`, T3/T4 `-003`, T5 `-004`, plus T6–T8 and the em-dash bug) are separate tasks.
- The Review-screen fallback `"Success rule:"` explainer (`ReviewScreen.tsx`) is the *only* statement of the rule on the Review surface (PerDrillCapture lives on Drill Check), so it is not a within-one-surface duplicate and is left as its surface's single home.

### Out of scope
- The onboarding subtitle `"Change anytime."` and run `"Show more cues"` — canon-pinned courtside-copy good examples; changing them needs a canon edit, not a UI tweak (audit Founder-judgment list).
- The internal `notCaptured` quick-tag id, `steeredFocus` provenance, `successMetric.description` source, and any route / Dexie / assembly / font / contrast / tap-target change.
- The `deriveSteeringTrace` and `selectNonSegmentedCurrentCue` domain selectors — U4/U8 gate rendering only; the selectors and their pure tests are untouched.
