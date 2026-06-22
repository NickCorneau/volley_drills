---
id: 2026-06-22-minimalism-shibui-audit
title: "Minimalism / Shibui Audit (whole app)"
status: active
stage: validation
type: design-review
summary: "Whole-app shibui/minimalism audit ('every pixel and character fights for its life') across all 13 screens + shared components, run by five parallel surface reviewers against the shibui canon. ~100 findings distilled into 8 cross-cutting themes, a highest-leverage shortlist, a low-risk quick-wins batch, and founder-judgment calls; bounded by outdoor-legibility floors, the D156 Home covenant, D158 micro-labels, courtside-copy rules, P12, a11y, and data-honesty."
authority: working findings log for the 2026-06-22 minimalism/shibui audit; subordinate to docs/research/brand-ux-guidelines.md, docs/research/japanese-inspired-visual-direction.md, and docs/decisions.md
last_updated: 2026-06-22
depends_on:
  - docs/research/brand-ux-guidelines.md
  - docs/research/japanese-inspired-visual-direction.md
  - docs/decisions.md
  - .cursor/rules/courtside-copy.mdc
---

# Minimalism / Shibui Audit (2026-06-22)

## Purpose

Hold every pixel and character in the app to one bar: **does it fight for its life?** Audit all 13 screens and the shared component layer against the shibui canon (let space work; one focus per screen; remove what is not needed; restraint over chrome; quiet secondary ink) and report what does not earn its place.

## Method

Five parallel read-only surface reviewers, each with the shibui rubric and the hard constraints, citing real `file:line` + quoted strings and tagging each finding `safe-to-apply` / `needs-founder-judgment` / `needs-test-update`:

- Home surface — [home audit](74900153-4d41-4445-839d-7ebf6a6b925b)
- Setup + Safety (pre-run) — [setup/safety audit](67244340-07e0-4544-86f0-ae56497976fd)
- Run flow (cockpit) — [run-flow audit](c58301d9-cf9d-403d-b5d3-d1d355603dc1)
- Review + Complete (post-session) — [review/complete audit](149ada8a-07b2-451a-81e3-b6c5b37dc621)
- Onboarding + Settings + shared primitives — [primitives audit](68edeba1-fb1c-4c65-b7dd-99601f63f12e)

## Hard constraints honored (never recommended for cutting)

Outdoor legibility floors (min font / contrast / tap-target — the run-face timer and instruction stay large); the `D156` Home covenant + render-budget test; `D158` quiet-micro-label vocabulary; courtside-copy rules; `D137` Setup→Safety spine; `D155`/`D153` end-session + danger semantics; `D157` (no raw rungs) / `D154` (verdict is the only acceptance); duration/status data-honesty; Safety pain/heat content; accessibility (aria, focus, tap targets).

## Headline read

The app is already disciplined where it was most recently polished (the `D158` Home card, the run-face timer, the `D156` dark periphery, the verdict gating). The waste that remains is overwhelmingly **the same four patterns repeated across surfaces**: a heading that restates its own button, the same fact stated two or three times on one screen, decorative icons/separators that duplicate meaning the tone already carries, and microcopy carrying filler words. None of it is broken; all of it is subtractable. One genuine bug surfaced (an em-dash). The just-shipped Review verdict card is confirmed at the dense edge on `more` offers.

---

## The 8 cross-cutting themes

### T1 — A heading restates its own button or value

The most common waste. Delete the heading (or the label), keep the action.

- `ReviewPendingCard` "Finish the quick review." + button "Finish review" (the word twice; "quick" is hedge ink)
- `DraftCard` "Session ready." + "Continue" (+ duplicates `aria-label`)
- `NewUserCard` "Build your first beach session." + "Start first session" ("first session" twice)
- Settings "Export training records" + "Downloads your session history as a JSON file…" + button "Export"
- Settings "Skill level" + "Your level: Rally builders." + "Change" (the fact three times)
- `CompleteScreen` "Session recap" label sitting on a self-describing `<dl>`
- `DrillCheckScreen` pill "{drill} · Complete" + question "How was {drill}?" (drill name twice in ~80px)
- `SoftBlockModal` / `SkipReviewModal` title + first clause of body say the same thing

### T2 — The same fact stated two or three times on one surface

Pick one home for each fact.

- **Complete** hero "40 good passes today out of 60 attempts." **and** recap row "67% (40 of 60)" — pass stat twice (P1)
- **Setup** assembled duration in the focal line **and** the footer Callout "This session will run about N min." (P1)
- **Setup** `incompleteHint` rendered in the focal slot **and** the footer (test currently *expects* both — P1)
- **Safety** the adaptation contract explained three ways on a steered visit: disclosure + evergreen gloss + the steering line (P1)
- **Settings** "data stays local" appears 2–3× (storage primary + secondary + footer); "use Export to back up" appears 3× (Export card + storage ¶3 + persisted-secondary)
- **Onboarding** "you can change this later" twice (subtitle "Change anytime." + unsure-card subtext)
- **Review** "Success rule:" explainer + field labels + the same rule re-shown inside `PerDrillCapture` drawers
- **Run** drill name in the `h1` **and** repeated as the "Now" cue fallback when there's no distinct cue

### T3 — Decorative chrome that duplicates meaning the tone already carries

- `PainOverrideCard` warning-triangle SVG inside a `Callout tone="warning"` (tone already signals it)
- Safety heat-expander flame SVG (the chevron is the affordance)
- `CarryForwardCell` decorative bullet dot; Review & Transition hairline separators (the `ScreenShell` gap already separates)
- `CompleteScreen` `VerdictGlyph` (SR-skipped decorative mark)
- Bordered "form panels" around chips on `DrillCheckScreen` / `PerDrillCapture` and the warm `ChoiceSubsection` panel on Setup/Safety — reintroduce card chrome on surfaces meant to be calm bodies

### T4 — Microcopy carrying filler

Trim 30–50% with no loss.

- Setup gating: "Choose wall or fence availability to build." → "Pick wall or fence." ("availability", "to build" are filler)
- "Short note (optional)" → "Short note" (the textarea already reads optional)
- "Couldn't capture reps this time" → "Didn't count reps"
- "Export saved. Check your downloads." → "Export saved."; "Export failed. Try again, or reload the app if it keeps happening." → "Export failed. Try again."
- Footer/gating hints that restate their section heading ("Rate your effort above to finish." → "Pick effort to finish.")
- Reflection placeholder "What's worth keeping for next time, or what would you change?" → "One line for next time."

### T5 — Verdict card density on a `more` offer (the just-shipped surface)

Confirmed at the dense edge (heading + 4 prose lines + control). Both the review reviewer and the prior live dogfood agree the **`graduationFeel` readiness line is the prime trim** — on a `more` offer it overlaps the carry-forward ("you're ready for more") and, on an on-target landing, partially overlaps the reflection line. Recommendation: cap the card at **3 prose lines** (offer → one reflective line → accept-consequence), suppressing readiness when the accept-consequence renders. The accept-consequence and the reflection both earn their place; readiness is the redundant one in this layout. (Note: this revisits a `D161` design choice — founder call.)

**Resolved 2026-06-22 (`D162`, plan `docs/plans/2026-06-22-004-refactor-t5-verdict-card-density-plan.md`):** the readiness line is now suppressed in the controller whenever the accept-consequence renders, capping the card at 3 prose lines; readiness survives only as the forward fallback when no accept-consequence renders. `graduationFeel` stays authored; no raw rungs (`D157`); movement stays user-accepted (`D154`).

### T6 — Competing focal weight (make one thing win)

- **Home** shows two equal "what's next" frames when a draft is primary (the plan line "Next up: passing after a warm-up…" + the draft card) — same class of bug already fixed for `last_complete`
- **Review** RPE card and the verdict card are equal-weight `Card`s; the RPE gate should dominate (render the verdict block as a chrome-less `section`)
- **SkillLevel** five option cards at equal weight with no recommended default ("start here if unsure")
- **Run** an accent-semibold eyebrow competing with the drill-title `h1` on the live face; the 56×56 SafetyIcon dominating the cockpit header

### T7 — Surface-language drift / primitive bypass

The `Card` primitive exists to prevent drift, but several call sites hand-roll near-`soft` bordered panels (Settings secondary sections, DrillCheck, PerDrillCapture). Route them through `<Card variant="soft">` (or flat body), and keep **one** focal surface per screen.

### T8 — Label vocabulary inconsistency

Standardize: "Swap" vs "Swap drill"; "Shorten" vs "Shorten block"; run "Now" vs transition "Cue"; the "Next:" / "Last:" counter prefixes (Run uses bare `N/M`); "Start next block" vs "Start next".

---

## The one real bug

- **P1 — em-dash in user-visible copy.** `app/src/components/RecentSessionsList.tsx:100` — `Last week: N sessions — ahead of your usual rhythm.` uses a `U+2014` em-dash, violating courtside-copy rule 4. Fix: split into two sentences, or (preferred, also resolves the T-hype note) drop the second clause so strong weeks read the same neutral `Last week: N sessions.` as steady weeks. (`RecentSessionsList.test.tsx` pins the string → test update.)

---

## Highest-leverage cuts (do these first)

1. **Em-dash fix** (the bug above).
2. **Strip the "heading restates the button" set** (T1) — Home review/draft/new-user cards, Settings export/skill rows, Complete "Session recap", the two modal title/body overlaps. Biggest line-count reduction for the least risk.
3. **De-duplicate the worst repeated facts** (T2) — Complete pass-stat (hero vs recap), Setup duration (focal vs footer), Safety adaptation (3→1), Settings storage/export prose.
4. **Cap the Review verdict card at 3 lines** (T5) — drop the readiness line on `more`. **(Done 2026-06-22, `D162`.)**
5. **Remove decorative SVGs/separators** (T3) — pure subtraction, mostly safe.

## Low-risk quick-wins batch (subtraction only; each needs a test-string update)

`Ready to train again.` (Home card → drops it to 3 lines, under budget) · PainOverride warning SVG · heat flame SVG · CarryForward bullet · Review + Transition hairlines · "(optional)" on Short note · Settings storage ¶3 · Settings Export description ¶ · PerDrillCapture "Counts (optional)" inner labels + success-rule re-show · inline `missingHint` echoes (PainOverrideCard) · the verbose Setup/Safety gating hints ("…availability to build" → "Pick …").

## Founder-judgment calls (don't apply unilaterally)

- T5 readiness-line cut (revisits `D161`) — **resolved 2026-06-22 as `D162`** (founder call via the LFG invocation) · T6 SkillLevel "recommended default" · the strong-week receipt framing (`composeReceipt` R6) · the Home felt-difficulty block density · run-face eyebrow demotion / SafetyIcon size (outdoor tap-target) · mid-run Swap removal (`m001-courtside-run-flow` §3) · any change to strings pinned as courtside-copy "good examples" (e.g. SkillLevel "Change anytime.", run "Show more cues" — rule 12a) which require a canon edit, not a silent UI tweak.

## Already exemplary (do not "shibui-cut")

The `D158` Home card (plan-mouthpiece, 4-line budget) · dark periphery by default · `BlockTimer` (removed the redundant "X:XX left" chip; 72px mono digits + bar only) · one-cue-on-the-live-face + disclosure · `SegmentList` active-row-only gloss underlines · the Transition quiet one-line receipt · no End-session on the active run face · RPE three-chip (no 0–10 grid) · verdict card *absent* on `keep` · empty states render nothing (no zero-state prose) · `FirstOpenGate` silent-until-resolved · `Brandmark` restraint · anti-guilt zero-week receipt.

## Recommended sequencing

1. The bug + the safe quick-wins batch (one focused PR; mostly subtraction + test-string updates; no canon conflict).
2. The verdict-card 3-line cap (T5) — small, but a `D161` revisit, so confirm first.
3. The competing-focal-weight + surface-drift items (T6/T7) — per-surface, with a 390px screenshot check each (founder dogfood preference).
4. The founder-judgment / canon-touching items — only with an explicit decision.

Each batch should run the full suite (the repo pins many exact strings, so copy cuts are test-coupled) + a 390px mobile pass before declaring done.
