---
id: plan-2026-06-22-t6-competing-focal-weight
title: "fix: T6 — competing focal weight (make one thing win) across Home, Review, SkillLevel, and Run"
status: active
stage: build
type: plan
summary: "Fix theme T6 from the 2026-06-22 minimalism/shibui audit: four surfaces each render two (or five) equal-weight frames where one should win. (1) Home suppresses the redundant 'Next up:' plan line when a draft is primary, mirroring the last_complete absorption. (2) Review demotes the verdict 'Next time' block from a Card to a chrome-less section so the required RPE card dominates. (3) SkillLevel marks one band as the recommended start-here-if-unsure default so the five equal option cards gain an entry point (founder-judgment call). (4) Run demotes the accent-semibold header eyebrow to a calm secondary status marker and shrinks the 56px SafetyIcon to the 44px outdoor/WCAG tap-target floor so the drill title / live timer wins the cockpit (founder-judgment call; reverses the documented 'focal vs status / don't unify' RunFlowHeader note). Presentation-only; no schema/route/assembly/domain-data change."
origin: docs/design/reviews/2026-06-22-minimalism-shibui-audit.md
last_updated: 2026-06-22
depends_on:
  - docs/design/reviews/2026-06-22-minimalism-shibui-audit.md
  - docs/research/brand-ux-guidelines.md
  - docs/research/outdoor-courtside-ui-brief.md
  - .cursor/rules/courtside-copy.mdc
  - .cursor/rules/component-patterns.mdc
  - app/src/screens/HomeScreen.tsx
  - app/src/screens/ReviewScreen.tsx
  - app/src/screens/SkillLevelScreen.tsx
  - app/src/screens/RunScreen.tsx
  - app/src/components/onboarding/SkillLevelPicker.tsx
  - app/src/components/patterns/RunFlowHeader.tsx
  - app/src/components/SafetyIcon.tsx
decision_refs:
  - D156
  - D158
---

# fix: T6 — competing focal weight (make one thing win)

## Summary

Theme T6 of the 2026-06-22 shibui audit collects four surfaces where the [§4.2 one-focal-zone principle](docs/research/brand-ux-guidelines.md) is broken — two (or five) frames carry equal visual weight when one should clearly win:

1. **Home (the bug).** When a saved draft is the primary card, both the quiet plan line ("Next up: passing after a warm-up…") **and** the draft card render as two equal "what's next" frames. This is the same class of bug already fixed for `last_complete` (whose CTA absorbed the line). Fix: suppress the plan line on the `draft` primary too.
2. **Review.** The required RPE card and the optional "Next time" verdict block are both equal-weight `Card`s. Fix: render the verdict block as a chrome-less `<section>` so the RPE gate dominates (the verdict already defaults to "Keep the same", so it never needs card chrome to be acted on).
3. **SkillLevel.** Five option cards at equal weight with no recommended entry point. Fix: mark one band as the recommended "start here if unsure" default so the eye has somewhere to land. **Founder-judgment call** per the audit.
4. **Run.** An accent-semibold eyebrow competes with the drill-title `h1` on the live face, and the 56×56 `SafetyIcon` over-weights the cockpit header. Fix: demote the run eyebrow to the calm secondary status-marker treatment the other run-flow screens already use, and shrink `SafetyIcon` to the 44px outdoor/WCAG tap-target floor. **Founder-judgment call** per the audit; the eyebrow change reverses a documented "focal vs status / don't unify" note on `RunFlowHeader`.

All four changes are presentation-only. No Dexie/schema, route, session-assembly, persisted-field, or domain-data change. This LFG invocation is the founder call that authorizes items 3 and 4.

---

## Problem Frame

The audit's [T6 finding](docs/design/reviews/2026-06-22-minimalism-shibui-audit.md) lists the four surfaces verbatim. The brand canon's [§4.2 focal-zone principle](docs/research/brand-ux-guidelines.md) states: "One focal zone per screen. The single most important thing on each screen must be unambiguously the heaviest visual element. If a banner, eyebrow, or helper paragraph is fighting the focal element, the banner loses." Each surface below violates this:

- **Home / `draft`:** `HomeScreen.tsx` computes `showPlanLine = showPlanLayer && primary !== 'last_complete'`. `last_complete` is excluded (its CTA states the next focus) but `draft` is not, so the plan line renders above the draft card — two "what's next" frames.
- **Review:** every section is a `Card` (`bg-bg-warm` soft per `D153`), so the RPE gate and the verdict block read as siblings. The "Short note" section is already a chrome-less `<section>`; the verdict block should match it, not the RPE card.
- **SkillLevel:** `SkillLevelPicker` renders five identical `FOCAL_SURFACE_CLASS` cards. The [§4.2 table](docs/research/brand-ux-guidelines.md) names the focal zone as "the four option cards as a grouped list" — but with all five equal, there is no entry point, which contradicts the [courtside-copy rule 1 "recommend-before-interrogate" posture](.cursor/rules/courtside-copy.mdc).
- **Run:** the [§4.2 table](docs/research/brand-ux-guidelines.md) names the Run focal zone as "the timer (live) or the drill title (between blocks)" — never the eyebrow. The eyebrow renders `text-sm font-semibold text-accent` (focal weight) and `SafetyIcon` is `h-14 w-14` (56px) with a 20px glyph, an outsized empty cell that unbalances the 3-column header. The [§6.3 icon sizes](docs/research/brand-ux-guidelines.md) spec is "32–44 px — focal icons (e.g. SafetyIcon shield)"; the button footprint exceeds the focal-icon envelope while the glyph sits under it.

---

## Constraints honored

- **Outdoor legibility / tap-target floor.** `SafetyIcon` shrinks to `h-11 w-11` (44px) — exactly the [§4.5 ghost tap-target floor](docs/research/brand-ux-guidelines.md) ("min-h-[44px] minimum, per WCAG and the outdoor brief"), not below it. The run timer (72px) and drill title (`text-xl`) are untouched.
- **D156 Home covenant + render budget.** The Home change is pure subtraction in the `draft` branch. The steady-state render budget test (`HomeScreen.render-budget.test.tsx`) pins `last_complete`, not `draft`, and already asserts the plan line is absent in steady state — so the budget is unaffected, and no budget constant is bumped.
- **Accessibility.** The verdict block keeps `id="verdict-heading"` (the `ariaLabelledBy` target on the `ChoiceRow`) and `id="verdict-accept-consequence"` (the `aria-describedby` target) when it becomes a `<section>`. The `SafetyIcon` keeps its `aria-label="Safety information"` and ≥44px target. The run eyebrow's text content is unchanged (only its color/weight changes).
- **Courtside-copy.** No new user-visible strings except the single "Recommended" badge on SkillLevel (an in-component label, sentence case, mirroring the existing "Current" badge — not a new uppercase tracked eyebrow, so the [§1.4 casing rule](docs/research/brand-ux-guidelines.md) and `validate-typography-guardrails.mjs` allowlist are not touched).
- **No envelope change.** No schema/route/assembly/persisted-field change on any surface.

---

## Key Technical Decisions

- **KTD1 — Home: suppress only the plan *line*, keep the plan *layer*.** Exclude `draft` from `showPlanLine` exactly as `last_complete` is excluded. The carry-forward cell (a distinct "carried forward from last time" signal, not a "what's next" frame) stays on the broader `showPlanLayer` gate. This mirrors the existing `last_complete` treatment one-for-one and keeps the change to a single boolean.
- **KTD2 — Review: verdict becomes a chrome-less `<section>`, RPE stays a `Card`.** Only the verdict block is demoted; the RPE card and the "Good passes" card keep their chrome. The verdict's wrapping `<Card className="flex flex-col gap-3">` becomes `<section className="flex flex-col gap-3">`, preserving the internal rhythm and both `id`s. This makes the required RPE gate the heaviest card on the screen without re-chroming the rest of the form.
- **KTD3 — SkillLevel: recommendation is an opt-in `recommendedLevel` prop, scoped to onboarding.** `SkillLevelPicker` gains an optional `recommendedLevel?: SkillLevel` prop (parallel to the existing `currentLevel`). `SkillLevelScreen` (first-open onboarding, the "if unsure" context) passes `recommendedLevel="rally_builders"`; `SettingsSkillLevelScreen` does **not** pass it (a returning user already has a "Current" band, so a recommendation there would be noise). The recommended band renders a quiet "Recommended" badge mirroring the existing "Current" badge treatment (`rounded-full bg-accent/10 px-2 py-0.5 text-xs font-semibold text-accent`). See Assumptions for the band choice and badge-style rationale.
- **KTD4 — Run eyebrow: adopt the calm status-marker treatment, reversing the "don't unify" note.** The eyebrow span in `RunScreen.tsx` changes from `text-sm font-semibold text-accent` to `text-sm font-medium text-text-secondary` — the exact treatment `TransitionScreen`/`DrillCheckScreen` already pass through `RunFlowHeader`. The `RunFlowHeader` prop docblock currently documents the accent-focal treatment as an intentional non-unified distinction; that note is updated to record the T6 reversal (the run focal zone is the timer/title, so the eyebrow recedes to a status marker like the sibling screens).
- **KTD5 — Run SafetyIcon: shrink the button, keep the glyph, keep the centering.** `SafetyIcon` button goes `h-14 w-14` → `h-11 w-11` (44px). The 3-column grid in `RunFlowHeader` centers the middle column regardless of side-cell width, so this does not re-introduce the off-center drift the grid was chosen to fix — the change is footprint-only. The `RunFlowHeader` docblock's "+17px" centering note and the `RunScreen.rationale-placement.test.tsx` "56 px" comment are updated to avoid stale math. The `ReviewScreen` header spacer (`<div className="h-14 w-14" aria-hidden />`, which balances `SafetyIcon` to center the "Quick review" title) is updated to `h-11 w-11` in the same pass so the Review header stays centered.

---

## Assumptions (founder-judgment picks recorded for an autonomous run)

The audit flags two T6 items as founder-judgment calls. This LFG invocation is the call; the specific picks below are recorded so they can be flipped without re-planning.

- **A1 — Recommended band = `rally_builders`.** This is the persona the entire copy system targets (the [courtside-copy "one-season rec player" test](.cursor/rules/courtside-copy.mdc) and its descriptor "Pass easy serves, short rallies"). It is the most defensible "start here if unsure" default for a self-coached amateur. If the founder prefers `foundations` (the lightest band, matching the "we'll size a light starter" unsure copy), it is a one-line change to the prop value in `SkillLevelScreen`.
- **A2 — Recommended badge style = the in-component "Current" pill, not the D158 uppercase micro-label.** Reusing the existing accent pill (`bg-accent/10 … text-accent`) keeps the change self-contained, avoids touching the `validate-typography-guardrails.mjs` uppercase allowlist, and reads as "suggested pick" consistent with the component's own vocabulary. The D158 quiet-uppercase "Recommended" eyebrow vocabulary was considered but rejected for this surface because it would require an allowlist entry + decision row for a shared onboarding/settings component.
- **A3 — Run eyebrow demotion target = `text-sm font-medium text-text-secondary`.** This matches the calm status marker `TransitionScreen`/`DrillCheckScreen` already use, so the three run-flow screens unify rather than inventing a fourth treatment. This reverses the `RunFlowHeader` "focal vs status … Don't unify" note; the note is updated rather than left contradicting the code.
- **A4 — SafetyIcon target size = 44px (the floor), not lower.** 44px is the [§4.5](docs/research/brand-ux-guidelines.md) outdoor/WCAG minimum, so this is the smallest the safety affordance may go while honoring the never-cut tap-target constraint.

---

## Implementation Units

### U1 — Home: absorb the plan line on the `draft` primary

- **Goal:** stop rendering the "Next up:" plan line above the draft card so the draft card is the only "what's next" frame, matching the `last_complete` treatment.
- **Requirements:** T6 Home item.
- **Dependencies:** none.
- **Files:** `app/src/screens/HomeScreen.tsx`, `app/src/screens/__tests__/HomeScreen.precedence.test.tsx`
- **Approach:** change `showPlanLine` so it also excludes the `draft` primary: `const showPlanLine = showPlanLayer && primary !== 'last_complete' && primary !== 'draft'`. Update the adjacent comment to name the draft card as the absorbing surface (the draft card already states the assembled session, so the descriptive plan line above it is a duplicate "what's next"). Leave `showPlanLayer` (carry-forward cell) untouched — the carry-forward is a separate signal.
- **Patterns to follow:** the existing `last_complete` absorption comment/logic immediately above the line being changed.
- **Test scenarios:**
  - In `HomeScreen.precedence.test.tsx`, the existing `draft only` case asserts no plan-launch CTA; add an assertion that `screen.queryByRole('region', { name: /your plan/i })` is **not** in the document on the draft primary (mirroring the `last_complete` assertion already in this file). Covers the bug directly.
  - Confirm the `review_pending` and `resume` cases (plan line already suppressed) and the `new_user` case are unaffected.
  - Confirm a draft-primary state with a carry-forward delta still renders the carry-forward cell (the plan *layer* is not suppressed, only the *line*).
- **Verification:** on a draft-primary Home, only the draft card carries the "what's next" framing; the "Your plan" region is absent; carry-forward (when present) still renders.

### U2 — Review: demote the verdict block to a chrome-less section

- **Goal:** make the required RPE card the heaviest card on Review by rendering the optional "Next time" verdict block as a chrome-less `<section>`.
- **Requirements:** T6 Review item.
- **Dependencies:** none.
- **Files:** `app/src/screens/ReviewScreen.tsx`
- **Approach:** change the verdict block's wrapping `<Card className="flex flex-col gap-3">…</Card>` to `<section className="flex flex-col gap-3">…</section>`. Preserve the inner structure verbatim: the `<h2 id="verdict-heading">Next time</h2>`, the offer/reflection group, the `ChoiceRow` (still `ariaLabelledBy="verdict-heading"`), and the readiness/accept-consequence group (still `id="verdict-accept-consequence"`). Update the leading comment to note the verdict is intentionally chrome-less so the RPE gate dominates (T6). If `Card` becomes unused in the file after this change, drop it from the `components/ui` import; otherwise leave the import.
- **Patterns to follow:** the existing "Short note" `<section className="flex flex-col gap-2">` in the same screen — already the chrome-less treatment for a non-card section.
- **Test scenarios:**
  - `ReviewScreen.verdict.test.tsx` queries the block by text (`findByText('Next time')`), radio roles, and `id` (`verdict-accept-consequence`) — none assert a `Card`. Confirm all four cases in that file still pass unchanged after the swap.
  - Verify the `ariaLabelledBy`/`aria-describedby` wiring is intact (the `ChoiceRow` is still labelled by `verdict-heading`; "Try it" is still described by `verdict-accept-consequence`).
- **Verification:** the verdict block renders with no card border/shadow/background while the RPE card retains its chrome; the verdict still gates and persists exactly as before; verdict tests green.

### U3 — SkillLevel: recommended "start here if unsure" default

- **Goal:** give the five equal option cards an entry point by marking one band as recommended, scoped to first-open onboarding.
- **Requirements:** T6 SkillLevel item (founder-judgment call; see A1/A2).
- **Dependencies:** none.
- **Files:** `app/src/components/onboarding/SkillLevelPicker.tsx`, `app/src/screens/SkillLevelScreen.tsx`, `app/src/components/onboarding/__tests__/SkillLevelPicker.test.tsx`
- **Approach:**
  - Add `recommendedLevel?: SkillLevel` to `SkillLevelPickerProps`. In `renderCard`, when `level === recommendedLevel`, render a quiet "Recommended" badge in the title row, mirroring the existing "Current" badge markup/classes (`rounded-full bg-accent/10 px-2 py-0.5 text-xs font-semibold text-accent`). If a band is somehow both `currentLevel` and `recommendedLevel`, prefer the "Current" badge (current state outranks a suggestion) — in practice they never co-occur because only onboarding passes `recommendedLevel` and only Settings has a `currentLevel`.
  - In `SkillLevelScreen.tsx`, pass `recommendedLevel="rally_builders"` to `<SkillLevelPicker>`. Do not change `SettingsSkillLevelScreen`.
  - Keep the underlying `SkillLevel` enum and persistence unchanged — this is a presentation marker only.
- **Patterns to follow:** the existing `currentLevel` prop + "Current" badge in `SkillLevelPicker` (same render path, same pill treatment).
- **Test scenarios:**
  - `SkillLevelPicker.test.tsx`: add a case that, given `recommendedLevel="rally_builders"`, the Rally builders card shows a "Recommended" badge and the other four bands do not.
  - Confirm the existing "renders all 5 skill level options" and "fires onPick…" cases still pass — the accessible-name substring regexes (e.g. `/Rally builders/`) still match with the badge text appended to the name.
  - Confirm that with no `recommendedLevel` prop (Settings path), no "Recommended" badge renders anywhere.
  - Confirm `currentLevel` + `recommendedLevel` on different bands both render their respective badges without collision.
- **Verification:** first-open SkillLevel shows one band carrying a "Recommended" badge; Settings skill-level sub-route is visually unchanged; picker tests green.

### U4 — Run: demote the header eyebrow and shrink the SafetyIcon

- **Goal:** let the drill title / live timer win the cockpit by receding the eyebrow to a calm status marker and reducing the SafetyIcon footprint to the 44px floor.
- **Requirements:** T6 Run item (founder-judgment call; see A3/A4).
- **Dependencies:** none.
- **Files:** `app/src/screens/RunScreen.tsx`, `app/src/components/SafetyIcon.tsx`, `app/src/components/patterns/RunFlowHeader.tsx`, `app/src/screens/ReviewScreen.tsx`, `app/src/components/patterns/__tests__/RunFlowHeader.test.tsx`, `app/src/screens/__tests__/RunScreen.rationale-placement.test.tsx`
- **Approach:**
  - **Eyebrow (`RunScreen.tsx`):** change the eyebrow span from `text-sm font-semibold text-accent` to `text-sm font-medium text-text-secondary`. Update the nearby comment to note the eyebrow is now a calm status marker (T6) consistent with Transition/DrillCheck, so the title/timer is the focal zone.
  - **RunFlowHeader docblock (`RunFlowHeader.tsx`):** rewrite the `eyebrow` prop comment that currently documents "RunScreen uses `text-sm font-semibold text-accent` (focal) … Don't unify" to record the T6 reversal: all three run-flow screens now use the calm secondary status-marker treatment. Update the "SafetyIcon at `h-14 w-14` (56px) … `+17px`" centering note to reflect the new 44px size (the grid still centers regardless; the number is illustrative only).
  - **SafetyIcon (`SafetyIcon.tsx`):** change the trigger button from `h-14 w-14` to `h-11 w-11` (44px). Leave the 20px `ShieldSvg` glyph and all sheet/dialog markup unchanged.
  - **Review header spacer (`ReviewScreen.tsx`):** change the `aria-hidden` spacer `<div className="h-14 w-14 shrink-0" />` to `h-11 w-11 shrink-0` so it keeps matching the SafetyIcon width and the "Quick review" title stays centered.
- **Patterns to follow:** the Transition/DrillCheck eyebrow treatment (`text-sm font-medium text-text-secondary`) already passed through `RunFlowHeader`; the [§4.5 tap-target floor](docs/research/brand-ux-guidelines.md).
- **Test scenarios:**
  - `RunScreen.rationale-placement.test.tsx`: confirm the eyebrow-text cases (`Main drill`, the slot-label `it.each`, the compose `it.each`, the grid/`justify-self-center` case) still pass — they query by text and parent class, not eyebrow color/weight. Update the stale "56 px (h-14 w-14)" comment in the grid case to "44 px (h-11 w-11)".
  - `RunFlowHeader.test.tsx`: the "preserves caller-owned eyebrow typography" pass-through test still passes (it supplies its own span). Update its comment/example so it no longer claims RunScreen uses accent-focal; assert pass-through with a representative caller-styled span (the test's value is proving `RunFlowHeader` does not override caller typography, which remains true).
  - Add (or extend) a lightweight assertion that `SafetyIcon` renders a ≥44px button — e.g. its className contains `h-11 w-11` — so a future shrink below the floor breaks. (Component-level, in a SafetyIcon or RunFlowHeader test.)
  - Manual: 390px mobile check that the title/timer reads as the focal element and the header is balanced.
- **Verification:** on the live run face the drill title (and the running timer) are unambiguously heaviest; the eyebrow reads as a quiet status marker matching Transition/DrillCheck; the SafetyIcon is a 44px target; the Review header title stays centered; all run-flow header tests green.

---

## Scope Boundaries

### Deferred to follow-up work

- The other audit themes (T1 heading-restates-button, T2 repeated facts, T3 decorative chrome, T4 microcopy filler, T5 verdict-card density) are owned by their own dated plans in `docs/plans/` and are out of scope here.
- T7 (surface-language drift / primitive bypass) and T8 (label vocabulary) are separate themes, not part of T6.

### Out of scope (envelope)

- No Dexie/schema, route, session-assembly, persisted-field, generator, or domain-data change on any surface.
- No change to the `SkillLevel` enum, persistence, or adaptation behavior — U3 is a presentation marker only.
- No change to the run timer scale (72px), drill-title scale (`text-xl`), or any copy string beyond the single "Recommended" badge.

---

## Verification (whole change)

- `npm test` (Vitest, all tiers) — the repo pins exact strings and structural invariants, so run the full suite; pay attention to `HomeScreen.precedence`, `ReviewScreen.verdict`, `SkillLevelPicker`, `RunFlowHeader`, and `RunScreen.rationale-placement`.
- `npm run typography:guardrails:check` (if present) — confirm no new uppercase tracked eyebrow was introduced (none should be; the SkillLevel badge is a non-tracked accent pill).
- Lint/build clean (`npm run lint`, `npm run build` or the narrowest equivalents).
- Manual 390px mobile dogfood with screenshots on each of the four surfaces (founder preference): draft-primary Home, Review with a verdict offer, first-open SkillLevel, and the live run face.
