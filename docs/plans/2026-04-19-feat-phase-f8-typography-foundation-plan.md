---
title: "feat: Phase F8 typography foundation (kill uppercase eyebrows, heading consistency, RPE anchor floor)"
type: plan
status: landed
landed_on: 2026-04-19
date: 2026-04-19
origin: "Chat typography-and-brand review, 2026-04-19; cf. canvas `typography-review.canvas.tsx` and `docs/research/japanese-inspired-visual-direction.md`"
depends_on:
  - docs/plans/2026-04-19-feat-phase-f1-home-calm-pass-plan.md
  - docs/plans/2026-04-19-feat-phase-f7-post-manual-testing-polish-plan.md
  - docs/research/japanese-inspired-visual-direction.md
  - docs/research/outdoor-courtside-ui-brief.md
---

# Phase F8: Typography foundation

## Overview

Phase F8 is the first typographic pass on the v0b calm-layer work. The audit behind this pass (`canvases/typography-review.canvas.tsx`, 2026-04-19) found that the current type system is functional but anonymous: Inter from a CDN, `UPPERCASE tracking-wider` eyebrows everywhere, a bold-heavy weight distribution, `font-mono` on the hero timer, and a handful of inconsistent heading scales. That stack contradicts the stated brand thesis — shibui restraint, "light on the surface, serious underneath" — and invites the reader to treat the app as a generic SaaS dashboard.

F8 is the smallest useful cut. It removes the single most-visible "SaaS tell" (the uppercase eyebrow), reconciles the handful of heading inconsistencies the audit flagged, and lifts the one place type drops below the outdoor `16 px` body floor in a way the outdoor brief would not bless. It does **not** introduce new fonts, change the body type scale, or touch the timer — those are explicit follow-ons tracked in the canvas and in the *Out of scope* list below.

## Problem frame

From the 2026-04-19 audit (see `canvases/typography-review.canvas.tsx`):

- **12 `UPPERCASE tracking-wider` eyebrows** across Home / Transition / Run / Complete / ResumePrompt. On Home this inverts hierarchy: the label "YOUR LAST SESSION" reads heavier than the content line "Solo + Net" it describes. The pattern is a Stripe/Vercel dashboard reflex and is directly at odds with `docs/research/japanese-inspired-visual-direction.md`'s shibui / `tokonoma` guidance ("one focal zone", "remove what is not needed", "durable typography").
- **Two different page-title scales** across prep screens: `text-xl` (Setup / Safety / Settings / SkillLevel) vs the hero-scale `text-2xl` on Run / Transition / Review. The two hero-scale screens (Run, Transition) are also missing `tracking-tight` that the other display-scale headings use, so they read slightly looser than their siblings.
- **SetupScreen section `h2` is `text-sm`** (14 px) while every other screen's section `h2` is `text-base` (16 px). Same semantic role, different size — clearly unintentional.
- **`CompleteScreen` has no page-level `<h1>`.** The verdict ("Keep building") renders as an `<h2>` — an accessibility outline gap.
- **`RpeSelector` anchor labels render at `text-[10px]`** — below the 16 px body floor frozen in `docs/research/outdoor-courtside-ui-brief.md`. The anchors are decorative captions inside a large tap target, not primary body copy, so 12 px (`text-xs`) is a principled minimum; 10 px is not.

Each fix is independent. Bundled here because they share origin (the typography audit), scope class (visual only), and low risk profile consistent with F1–F7.

## Requirements trace

- **R1.** No `.tsx` file under `app/src/` renders text with the combination `uppercase tracking-wider`. The eight call-sites (see Unit 1) are converted to sentence-case labels without the `uppercase` and `tracking-*` utilities.
- **R2.** `phaseLabel()` in `app/src/lib/format.ts` returns sentence-case strings (`'Warm up' | 'Work' | 'Downshift'`). The `RunScreen` phase-label `<span>` drops `uppercase tracking-wider`; the visual emphasis comes from color (`text-accent`) and weight (`font-semibold`), not from case.
- **R3.** Converted labels render at weight `font-medium` (500) instead of `font-semibold` (600) where the change is a pure supporting label (eyebrows on HomePrimaryCard variants, CompleteScreen `Today's verdict`, CompleteScreen `Session recap`, ResumePrompt `Paused at`, TransitionScreen `Up Next`). This is the restraint lever the audit asked for — the single pass drops the app's dominant emphasis weight toward 500 without touching any other surface.
- **R4.** `RunScreen` `<h1>` (drill title) and `TransitionScreen` `<h1>` (next-block title) add `tracking-tight` to match `ReviewScreen` / prep-screen display headings.
- **R5.** `SetupScreen`'s five section `<h2>` elements (Players / Net / Wall / Time / Wind) change from `text-sm font-semibold` to `text-base font-semibold`, matching `SafetyCheckScreen`, `ReviewScreen`, `SettingsScreen`.
- **R6.** `CompleteScreen` promotes the current `<p>{summary.header}</p>` to `<h1>{summary.header}</h1>`. The visible text is unchanged (`"Today's verdict"` / `"Today's pair verdict"`); only the element tag and accessibility outline change. The verdict `<h2>` stays as `<h2>`; the page now has a valid h1 → h2 outline.
- **R7.** `RpeSelector` anchor text class changes from `text-[10px] uppercase tracking-wide` to `text-xs uppercase tracking-wide`. The anchors keep the rest of their existing styling (color-inversion on selected chip, `\u00A0` fallback from F7, `aria-hidden`).
- **R8.** No behavior change, no schema change, no new routes, no copy change beyond case (`'WARM UP'` → `'Warm up'` etc.). No new design tokens.
- **R9.** Existing automated tests pass unchanged. The only test-touching surface is any test that asserts on `'WARM UP'` / `'WORK'` / `'DOWNSHIFT'`; a repo-wide scan (2026-04-19) found no such assertions. Home precedence tests assert on case-insensitive accessible names that are unaffected.

## Scope boundaries

### In scope

- The eight uppercase-eyebrow call-sites (Unit 1).
- The `phaseLabel()` sentence-case conversion and RunScreen wrapper (Unit 2).
- The heading-consistency triple: Setup `h2` size, Run/Transition `h1` tracking, CompleteScreen `h1` tag (Unit 3).
- The RPE anchor size lift (Unit 4).
- Inline comments in each touched file anchoring the change to this plan.

### Out of scope — explicit deferrals

These are on the roadmap but deliberately not in F8:

- **Self-host Inter Variable + remove Google Fonts CDN.** Material P10 (local-first) alignment, but involves a new `woff2` asset, a `vite-plugin-pwa` precache update, and a CSS change. Candidate for **F9**.
- **Timer mono face swap (`font-mono` → JetBrains Mono or IBM Plex Mono).** Highest-leverage brand move per the audit; same asset-loading plumbing as the Inter self-host. Candidate for **F9** or **F10** alongside the font-loading pass.
- **Body type scale shift (dominant body `text-sm` → `text-base`).** Aligns with the outdoor brief's 16 px floor for body copy, but touches ~80 call-sites across cards, chips, and meta lines — a larger visual shift than F8 should carry. Candidate for a dedicated pass after the field test.
- **Weight-system rebalance beyond the eyebrows.** Dropping every non-eyebrow `font-semibold` on labels to `font-medium` is defensible but broad; the audit's restraint win is concentrated in the eyebrows. Out of scope here.
- **Wordmark display treatment + brand name reconciliation** ("Volleycraft" vs "Volley Drills" drift). Brand-level; tracked separately.
- **CompleteScreen verdict display pass** (scaling "Keep building" to a true display size). Brand-level; tracked separately.

## Context and research

- `docs/research/japanese-inspired-visual-direction.md` — the shibui / `tokonoma` / "one focal zone" thesis the eyebrow pattern violates on Home.
- `docs/research/outdoor-courtside-ui-brief.md` — the 16 px body floor that the `text-[10px]` RPE anchors fail.
- `canvases/typography-review.canvas.tsx` (2026-04-19, chat-driven) — the alignment matrix and tiered recommendations this plan implements as Tier 1.
- `docs/plans/2026-04-19-feat-phase-f7-post-manual-testing-polish-plan.md` — the most recent calm-pass plan this sits alongside. F7 already touched `RpeSelector` for chip-grid alignment; F8's anchor-size change rides the same file.

## Key technical decisions

1. **Convert the `phaseLabel()` return values in source, not via CSS lowercase.** Changing the literal return value (`'WARM UP'` → `'Warm up'`) and dropping the `uppercase` utility is a single place where the meaning and visual match. A CSS-only `lowercase` / `capitalize` approach fights itself — the source of truth for readers, screen readers, and copy review should be sentence case.
2. **Drop `font-semibold` → `font-medium` on converted eyebrows, but only on the eyebrows.** This is the scoped weight rebalance the audit called out. Staying narrow keeps the visual diff interpretable: the eight changed sites read calmer; everything else is unchanged. A broader weight pass can follow with its own plan and its own screenshots.
3. **Promote `CompleteScreen`'s summary-header `<p>` to `<h1>`, don't add a visually-hidden h1.** The visible text (`Today's verdict` / `Today's pair verdict`) is already the page's identity; wrapping it in an `<h1>` gives the page a real outline without shipping hidden copy that can drift from visible copy. The verdict `<h2>` stays an `<h2>` (it is the focal sub-heading of the page).
4. **Keep the RPE anchor color + case conventions, raise only the size.** The color-inversion on selected chips (`text-white/90`) and the uppercase + tracking-wide micro-caption treatment are load-bearing for the chip's visual language. The audit flagged *size* (below the 16 px floor) as the only principled violation; fixing just that is the minimal correct move.
5. **No changes to `index.css` `@theme` tokens.** This pass is pure utility-class reshuffling plus one `format.ts` string change. F9's font-loading work will be the first F-plan to touch `index.css`.

## Implementation units

- [x] **Unit 1: Kill the `UPPERCASE tracking-wider` eyebrow pattern** *(landed 2026-04-19)*

  **Files:**
  - Modify: `app/src/components/HomePrimaryCard.tsx` (four eyebrows: `new_user`, `review_pending`, `draft`, `last_complete`)
  - Modify: `app/src/components/ResumePrompt.tsx` (`Paused at`)
  - Modify: `app/src/screens/TransitionScreen.tsx` (`Transition`, `Up Next`)
  - Modify: `app/src/screens/CompleteScreen.tsx` (`{summary.header}`, `Session recap`)

  **Approach:**
  - At each call-site, drop `uppercase tracking-wider` from the `className`. Change weight from `font-semibold` to `font-medium`. Keep the existing color token (`text-text-secondary`) and size (`text-sm` / `text-xs`).
  - The literal strings are already sentence case in source (`Today's verdict`, `Your last session`, etc.) — only the CSS uppercased them. No copy change needed for this unit.
  - Update the relevant top-of-file comment block with a short Phase F8 note.

  **Verification:**
  - `rg 'uppercase tracking-wider' app/src` returns only the two call-sites handled in Unit 2 (RunScreen phase pill) and Unit 4 (RPE anchor uses `tracking-wide` — different utility, out of scope).
  - `npm run test` passes unchanged.
  - Manual viewport walk (Home, Transition, Run → block end, Complete): the eight labels render as sentence-case support copy instead of uppercase eyebrows; hierarchy on Home now puts the content line above the label line in visual weight.

- [x] **Unit 2: `phaseLabel()` sentence case + RunScreen phase pill** *(landed 2026-04-19; expanded label set 2026-04-27 — see post-ship amendment below)*

  **Files:**
  - Modify: `app/src/lib/format.ts`
  - Modify: `app/src/screens/RunScreen.tsx`

  **Approach:**
  - `phaseLabel()` returns sentence-case strings (`'Warm up' | 'Work' | 'Downshift'`).
  - `RunScreen` phase-label `<span>` className changes from `text-sm font-bold uppercase tracking-wider text-accent` to `text-sm font-semibold text-accent`. The color continues to carry phase emphasis; dropping `uppercase tracking-wider` removes the dashboard-eyebrow voice; `font-bold` → `font-semibold` gives the label a slightly quieter treatment that matches the new eyebrow weight in Unit 1 without losing accent-driven prominence.
  - Update inline comments to note the Phase F8 change.

  **Verification:**
  - `rg "'WARM UP'|'DOWNSHIFT'|'WORK'" app` returns no matches.
  - Run flow walk shows `Warm up` / `Work` / `Downshift` in accent color without the uppercase eyebrow voice.
  - No test file asserts on the old uppercase strings; repo-wide grep (2026-04-19) confirmed.

  **Post-ship amendment (2026-04-27 cca2 dogfeed F1 follow-up).** The F8 collapse of `technique | movement_proxy | main_skill | pressure` into a single `Work` label was reversed: `phaseLabel()` now returns the full six-label shape `'Warm up' | 'Technique' | 'Movement' | 'Main drill' | 'Pressure' | 'Downshift'`. Sentence case kept, accent-color treatment kept, no all-caps reintroduced — the reversal is a label-set expansion under courtside legibility evidence, not a thesis change. Citation: `docs/research/2026-04-27-cca2-dogfeed-findings.md` F1 (a 25-min pair pass session landed three different work-block types and the user couldn't tell them apart from the eyebrow; only the main_skill block triggered the `D133` post-block Difficulty chip and the chip-asymmetry felt arbitrary because role wasn't visible upstream). Vocabulary call (founder, 2026-04-27): direct over softer (`Technique` over `Foundation`, `Movement` over `Footwork`, `Main drill` over `Today's main`, `Pressure` over `Challenge`). Same ship deleted the per-block `rationale` italic subtitle from `RunScreen` and `TransitionScreen` — role information now rides on the eyebrow alone. Full ship rationale + trigger-fire reading: `docs/plans/2026-04-20-m001-adversarial-memo.md` §"Amendment log entry for 2026-04-27 cca2 dogfeed F1 follow-up". New regression guard: `app/src/lib/__tests__/format.phaseLabel.test.ts` pins all 6 labels exactly + asserts the F8-era `Work` is never returned for any mid-session slot.

- [x] **Unit 3: Heading consistency triple** *(landed 2026-04-19)*

  **Files:**
  - Modify: `app/src/screens/SetupScreen.tsx` (five `<h2>` section titles)
  - Modify: `app/src/screens/RunScreen.tsx` (drill `<h1>`)
  - Modify: `app/src/screens/TransitionScreen.tsx` (next-block `<h1>`)
  - Modify: `app/src/screens/CompleteScreen.tsx` (promote `summary.header` `<p>` → `<h1>`)

  **Approach:**
  - Setup: all five `h2` elements change from `text-sm font-semibold text-text-primary` to `text-base font-semibold text-text-primary`, matching Safety / Review / Settings.
  - Run + Transition: drill-title `<h1>` className gains `tracking-tight`, matching `ReviewScreen` and the prep-screen titles.
  - CompleteScreen: the existing `<p className="... {summary.header}">` becomes `<h1>`, with a `text-sm font-medium text-text-secondary` className consistent with Unit 1's eyebrow refactor (not a display-scale treatment — that's the deferred verdict-display pass). Add an `id` so downstream screen readers can link to it if needed; keep `aria-labelledby="summary-verdict"` on the verdict section unchanged.

  **Verification:**
  - Axe / outline check: `CompleteScreen` now has a single page-level `<h1>` ("Today's verdict" / "Today's pair verdict") followed by an `<h2>` (the verdict word).
  - Setup section labels read at the same size as Safety / Review / Settings.
  - Run + Transition hero titles render slightly tighter; Review hero title is the reference look.
  - `npm run test` and `npm run test:e2e` pass.

- [x] **Unit 4: RPE anchor size floor** *(landed 2026-04-19)*

  **Files:**
  - Modify: `app/src/components/RpeSelector.tsx`

  **Approach:**
  - Anchor span className changes from `mt-0.5 text-[10px] uppercase tracking-wide` to `mt-0.5 text-xs uppercase tracking-wide`.
  - Keep the existing `\u00A0` fallback introduced in F7 and the `aria-hidden="true"` so row baselines continue to align.
  - Update the inline F7 comment block with a short Phase F8 note mentioning the 16 px-floor alignment rationale.

  **Verification:**
  - Review-screen viewport walk: anchor captions (`REST` / `EASY` / `MODERATE` / `HARD` / `MAX`) read at 12 px instead of 10 px without disturbing chip grid alignment.
  - `npm run test` passes.

## System-wide impact

- **Interaction graph:** none. No handlers, routes, or state transitions change.
- **Error propagation:** none.
- **State lifecycle:** none.
- **API surface parity:** none. `HomePrimaryCard`, `HomeSecondaryRow`, `ResumePrompt`, and the screen exports keep their existing props.
- **Integration coverage:** all existing Vitest and Playwright tests are expected to pass unchanged. The only semantic change (the new `<h1>` on CompleteScreen) is additive — no existing test asserts the absence of an `<h1>`.
- **Unchanged invariants:**
  - Outdoor readability contract in `docs/research/outdoor-courtside-ui-brief.md` (contrast, touch-target sizing, run-mode content density).
  - Home precedence (`resume > review_pending > draft > last_complete > new_user`).
  - `D91` field-test artifact behavior.
  - Active-run cue-stack invariants (`V0B-08`).
  - All v0b copy strings (except the `phaseLabel()` case change, which is pure case normalization and does not alter meaning).

## Risks and dependencies

| Risk | Mitigation |
|------|------------|
| Sentence-case phase labels feel less punchy outdoors than `WARM UP` / `WORK` / `DOWNSHIFT` | Phase emphasis is retained through accent color and `font-semibold`; field test can validate. If testers report they miss the shout, promote the phase pill to a deliberate `Pill` component in a follow-on rather than re-enabling the uppercase pattern globally. |
| Removing eyebrow weight muddies scannability on Home | Home precedence tests and the Phase F1 focal-zone primary card still carry the visual weight. Eyebrows becoming quieter is the intended effect — the content line should dominate. |
| CompleteScreen h1 text collides with any a11y tool expectation | The text was already in the DOM as a paragraph; promoting to h1 is strictly additive in the outline. No test asserts on this element's tag. |
| RPE anchor at 12 px pushes the chip grid height | The anchor line was already reserved in F7 via `\u00A0`. A 2 px lift on each line is within the chip's existing padding. Manual check at 390×844 confirmed no row-break. |
| Name drift "Volleycraft" vs "Volley Drills" surfaced by the audit | Not in F8 scope — a brand decision, not a typography one. Called out in the canvas and deferred to a later plan. |

## Documentation / operational notes

- No `docs/catalog.json`, `AGENTS.md`, or compatibility-surface updates needed — F8 is a visual-and-a11y polish pass that rides the existing v0b build.
- No release-note impact.
- The typography canvas (`canvases/typography-review.canvas.tsx`) tracks the remaining tiers (Inter self-host; timer mono face; brand display treatment) as explicit follow-ons. Reference this plan's *Out of scope* list when the next pass is scheduled.

## Sources and references

- `canvases/typography-review.canvas.tsx` — the 2026-04-19 audit and thesis this plan operationalises (Tier 1).
- `docs/research/japanese-inspired-visual-direction.md` — shibui / `tokonoma` / restraint principles.
- `docs/research/outdoor-courtside-ui-brief.md` — 16 px body floor preserved by Unit 4.
- `docs/plans/2026-04-19-feat-phase-f1-home-calm-pass-plan.md` — first calm-pass plan in the series.
- `docs/plans/2026-04-19-feat-phase-f7-post-manual-testing-polish-plan.md` — most recent calm-pass plan; shared `RpeSelector` touch-point with F8 Unit 4.
