---
title: "feat: Phase F11 brand-hero typography (Home wordmark elevation, CompleteScreen verdict display)"
type: plan
status: landed
landed_on: 2026-04-19
date: 2026-04-19
origin: "Chat typography-review red-team after F8–F10 landed; cf. `canvases/typography-review.canvas.tsx` Tier 3 recommendations"
depends_on:
  - docs/archive/plans/2026-04-19-feat-phase-f8-typography-foundation-plan.md
  - docs/archive/plans/2026-04-19-feat-phase-f9-inter-self-host-plan.md
  - docs/archive/plans/2026-04-19-feat-phase-f10-timer-display-face-plan.md
  - docs/research/product-naming.md
  - docs/research/japanese-inspired-visual-direction.md
  - docs/research/outdoor-courtside-ui-brief.md
---

# Phase F11: Brand-hero typography

## Overview

Phase F11 closes the two remaining "Tier 3 — brand-level" items from the 2026-04-19 typography audit: the Home wordmark, which still reads at body size despite being the app's signature; and the CompleteScreen verdict, which still reads at sub-hero scale despite being the one emotional beat of the session loop. Both surfaces were explicitly deferred from F8 because they are brand decisions rather than plumbing or hygiene. F11 makes them on purpose.

It is a small pass — two call-sites, no new dependencies, no token changes. F9 self-hosted Inter and F10 added JetBrains Mono; the pieces F11 needs are already in the bundle. The move is one weight grade up and one size step up at each of the two brand-hero surfaces, with explicit rationale tied to the stated "light on the surface, serious underneath" voice and to the `D125` decision to ship under the name **Volleycraft**.

## Problem frame

**Home wordmark.** `HomeScreen.tsx` renders `Volleycraft` in `text-base font-semibold tracking-tight` — 16 px, the same size as the body paragraph on any card below it. The existing inline comment (Phase F1) is explicit about *why* the wordmark is kept small: a prior iteration sized it at `text-2xl` with a centered emoji, which read as a launch splash on every Home open. That concern is real and the F1 correction was correct. But the current scale over-corrects: the app's signature is styled like a form label and loses the opportunity to signal the brand's identity.

The right answer is not "bigger" — it is "slightly more confident." One size step (`text-base` → `text-lg`, 16 → 18 px) and one weight grade (`font-semibold` → `font-bold`) gives the wordmark presence without reintroducing the splash feeling. The icon + wordmark lockup still sits in the app-bar band, still under the Primary Card precedence contract, still visually quieter than the primary card. It just stops reading as breadcrumb.

**CompleteScreen verdict.** `{summary.verdict}` renders in `text-3xl font-bold tracking-tight` — 30 px. The verdict is the one moment in the entire product promise where typography gets to carry emotion: "Keep building", "Lighter next", "No change" are the Jo-Ha-Kyu "kyu" (clean finish) beat of the session loop. Sitting at `text-3xl` reads as a subhead; the canvas audit recommended 40 px. Tailwind's native `text-4xl` (36 px) is the correct compromise — a clear step up from the existing h2 rhythm, still inside the design system's standard scale, still comfortable in a 390 px viewport.

Both fixes are single-line className changes. F11 does not touch verdict copy, verdict glyph, reason paragraph, session-recap card, verdict semantics, or `aria-labelledby="summary-verdict"`.

## Requirements trace

- **R1.** `HomeScreen.tsx` wordmark `<h1>` className changes from `text-base font-semibold tracking-tight text-text-primary` to `text-lg font-bold tracking-tight text-text-primary`. The existing inline comment is extended with a Phase F11 note explaining the re-calibration relative to the F1 "no launch splash" guardrail.
- **R2.** `CompleteScreen.tsx` verdict `<h2>` className changes from `text-3xl font-bold tracking-tight text-text-primary` to `text-4xl font-bold tracking-tight text-text-primary`. The `id="summary-verdict"`, `aria-live="polite"`, and `aria-labelledby` linkage on the parent `<section>` are unchanged.
- **R3.** No changes to wordmark text (`Volleycraft`), verdict text (`Keep building` / `Lighter next` / `No change` variants from `composeSummary`), accessible names, ARIA attributes, component structure, or surrounding copy.
- **R4.** No new Tailwind classes, no `@theme` tokens, no design-token changes, no component-API changes.
- **R5.** All existing tests pass unchanged. HomeScreen and CompleteScreen tests assert on accessible names and text content; the tag and the text stay identical, only font-size and font-weight utilities on the className change.
- **R6.** The Home wordmark remains visually quieter than the Primary Card at any `HomePrimaryCard` variant. "Quieter" here means: the primary card's internal typography hierarchy (eyebrow + content line + CTA button) continues to hold more total visual weight than the app-bar wordmark + brandmark combined.
- **R7.** The CompleteScreen page outline remains valid: `<h1>Today's verdict</h1>` (from F8) → `<h2>Keep building</h2>` (verdict) → other section content.

## Scope boundaries

### In scope

- Two className edits: Home wordmark `<h1>`, CompleteScreen verdict `<h2>`.
- Inline comments at each call-site anchoring the change to this plan, the F1 wordmark rationale (for the wordmark), and the outdoor-brief / shibui thesis (for both).

### Out of scope — explicit deferrals

- **Body type scale shift (dominant body `text-sm` → `text-base`).** Outdoor brief freezes a 16 px body floor; many meta and support lines currently render at 14 px. Fixing this across ~80 call-sites is a meaningful visual shift across the app and should be validated with D91 field evidence before committing. Explicitly deferred.
- **Accent color revisit.** `#b45309` (warm amber / vermilion family) has been through multiple F-series iterations and is stable. Out of scope.
- **Wordmark as a display face.** Giving the wordmark its own font (Instrument Sans, Fraunces, or a custom mark) is a brand-level investment that would happen alongside a Volleycraft logotype treatment, not a studio decision. F11 stays inside the installed Inter family.
- **CompleteScreen verdict glyph or reason-paragraph layout changes.** The VerdictGlyph SVG and the reason paragraph are stable from Phase F4/F5; F11 is strictly the verdict word itself.
- **Elevating any other screen's `h1`** (Run drill title, Review, Transition). These are already at `text-2xl tracking-tight` (F8) and do not carry the same emotional-brand weight as the wordmark and the verdict. No change.
- **Prep-screen wordmark.** SetupScreen / SafetyCheckScreen / SettingsScreen use a left-aligned `← Back` plus a centered title. No wordmark on those screens; out of scope by definition.

## Context and research

- `canvases/typography-review.canvas.tsx` — Tier 3 recommendations that F11 implements.
- `docs/research/product-naming.md` — the `D125` naming decision and rationale for "Volleycraft" as the signature; explicitly names *"Two hard consonants (V, C) bookending a soft middle produces a stable, legible wordmark at any size"* in test T11. F11 takes that test seriously by giving the wordmark a real size.
- `docs/research/japanese-inspired-visual-direction.md` — shibui restraint; F11 is a one-step-at-a-time lift, not a display pass.
- `docs/research/outdoor-courtside-ui-brief.md` — CompleteScreen is a review-flow surface ("review can carry slightly more context, but they should still feel calm and tap-first"), so a 36 px verdict is well within the brief's envelope.
- `docs/archive/plans/2026-04-19-feat-phase-f1-home-calm-pass-plan.md` — F1 correctly downscaled the wordmark to avoid the launch-splash reading; F11 respects that constraint and calibrates the correction.
- `docs/archive/plans/2026-04-19-feat-phase-f8-typography-foundation-plan.md` — F8 added the CompleteScreen page-level `<h1>`; F11 is the follow-on that gives the verdict `<h2>` appropriate display weight.

## Key technical decisions

1. **One size step and one weight grade on each surface — no more.** The audit recommended a more aggressive scale (40 px verdict, full display treatment for wordmark). Tailwind's native `text-lg` / `text-4xl` keep both changes inside the design system's standard scale. If field testers read the result as still underscaled, the next step is a screenshot-driven tune rather than a speculative jump.
2. **Wordmark stays in `font-sans` (Inter), not the new `font-mono` (JetBrains Mono).** A wordmark in mono would brand the product as "precision instrument" — not wrong for a training tool, but a stronger brand claim than F11 should make. Inter at `text-lg font-bold tracking-tight` is the most conservative correct move.
3. **Verdict stays at Inter `font-bold`, not a display face or feature opt-in.** Mirroring decision 2: introducing a display font for the verdict is a brand-level investment, not a Tier-3-audit correction. The F11 verdict change is an emotional-weight correction that the existing type stack can deliver.
4. **Keep `tracking-tight` on both surfaces.** Inter at display sizes without `tracking-tight` reads slightly loose; this is the same calibration F8 made on the Run / Transition `h1` elements. Consistency matters.
5. **Do not touch the existing F1 wordmark comment — extend it.** The F1 rationale ("no launch splash") is the lens through which any future re-scaling should be evaluated. Removing the comment would lose that context; layering a Phase F11 note preserves both the original constraint and the re-calibration evidence.

## Implementation units

- [x] **Unit 1: Home wordmark elevation** *(landed 2026-04-19)*

  **Files:**
  - Modify: `app/src/screens/HomeScreen.tsx`

  **Approach:**
  - Change the wordmark `<h1>` className from `text-base font-semibold tracking-tight text-text-primary` to `text-lg font-bold tracking-tight text-text-primary`.
  - Extend the existing F1 inline comment with a Phase F11 note: the re-calibration lifts the wordmark out of "styled like a breadcrumb" without reintroducing the pre-F1 launch-splash reading; still respects the "primary card carries the visual weight" guardrail.

  **Verification:**
  - `HomeScreen.test.tsx` assertions on the accessible name `Volleycraft` (`getByRole('heading', { name: 'Volleycraft', level: 1 })` pattern) continue to pass.
  - Manual viewport walk at 390 × 844: wordmark reads as brand signature; primary card still visually dominates the screen.
  - Brandmark + wordmark optical balance at `size={28}` stays aesthetically correct (icon is 28 px tall; wordmark at 18 px font-bold sits comfortably centered alongside).

- [x] **Unit 2: CompleteScreen verdict display** *(landed 2026-04-19)*

  **Files:**
  - Modify: `app/src/screens/CompleteScreen.tsx`

  **Approach:**
  - Change the verdict `<h2>` className from `text-3xl font-bold tracking-tight text-text-primary` to `text-4xl font-bold tracking-tight text-text-primary`.
  - Add a Phase F11 note inline explaining: the verdict is the one Jo-Ha-Kyu "kyu" beat of the session loop; giving it a real display scale is on-thesis with the stated emotional contract ("investment" in `docs/vision.md`).

  **Verification:**
  - `CompleteScreen` manual walk: the verdict word(s) render at a visibly distinct scale from the surrounding `Today's verdict` h1 (small), the verdict glyph (small), and the reason paragraph (`text-sm`).
  - `sessionSummary.test.ts` assertions on verdict strings (`'Keep building'`, `'Lighter next'`, `'No change'`) continue to pass — pure string content, class-agnostic.
  - No wrap regression in the 390 px viewport for the longest verdict string (`Keep building`). 36 px × 13 chars comfortably fits.

## System-wide impact

- **Interaction graph:** none.
- **Error propagation:** none.
- **State lifecycle:** none.
- **API surface parity:** none. `HomeScreen` and `CompleteScreen` are leaf screens; their interfaces to the rest of the app are route-only.
- **Integration coverage:** existing Vitest and Playwright suites pass unchanged. No test asserts on font-size classes or computed pixel sizes.
- **Unchanged invariants:**
  - Outdoor readability contract (near-black text on warm off-white, WCAG AA unchanged).
  - F8 heading-consistency work (prep-screen `h1` scale, Setup `h2` size, CompleteScreen page-level `h1`, RPE anchor floor).
  - F9 offline-first font-loading.
  - F10 timer-display face.
  - Home precedence (`resume > review_pending > draft > last_complete > new_user`).
  - Active-run cue-stack invariants.
  - `D91` field-test artifact behavior.
  - `D125` product naming contract and the rename-scope guardrails in `docs/research/product-naming.md`.

## Risks and dependencies

| Risk | Mitigation |
|------|------------|
| Wordmark at `text-lg font-bold` reads as a launch splash again | F1's launch-splash regression used `text-2xl font-bold` with a centered 4xl emoji — 24 px type plus giant glyph on a centered axis. F11's target is 18 px type with the existing 28 px Brandmark on the left-aligned app-bar axis. That is four scale steps and a full layout change away from the regression conditions. Viewport walk is the verification lever. |
| Verdict at `text-4xl` introduces a wrap on the longest string | `Keep building` at 36 px is ~260 px wide; safe inside the 390 px viewport's ~320 px content column. `Lighter next` and `No change` are shorter. No risk. |
| Audit suggested a larger jump (40 px / display face); F11 under-delivers | This is a deliberate conservatism. The F11 one-step-up keeps the change reviewable and reversible. If field dogfeed says the verdict still feels underscaled, a follow-on can push to `text-5xl` or a display face; the `text-4xl` step is strictly additive. |
| Brandmark + wordmark visual balance drifts | Brandmark is `size={28}` (fixed). Wordmark font-size changes from 16 → 18 px. The header `items-center gap-2` already aligns them on a shared baseline; a 2 px lift on the wordmark glyph-cap height stays visually balanced against the 28 px rounded square. If it drifts, adjusting `size` to 32 is a one-number fix. |
| Verdict `text-4xl` hurts a11y / reading rhythm | The verdict is a single word or a two-word phrase, read once at end-of-session. Not body copy. The step up is emotional-weight alignment, not reading-comprehension regression. |

## Documentation / operational notes

- No `docs/catalog.json`, `AGENTS.md`, or routing-surface updates.
- The typography canvas (`canvases/typography-review.canvas.tsx`) should be updated in the same pass to mark Tier 1 / Tier 2 / Tier 3 as landed with the phase numbers (F8 / F10 / F11). That is housekeeping, not a blocker for F11 itself.
- No release-note impact.
- F11 closes the audit trajectory. The remaining canvas-tracked item (body-scale shift from `text-sm` → `text-base`) is explicitly deferred to post-D91 field evidence.

## Sources and references

- `canvases/typography-review.canvas.tsx` — Tier 3 recommendations implemented by F11.
- `docs/research/product-naming.md` — `D125` rationale, T11 wordmark legibility test.
- `docs/research/japanese-inspired-visual-direction.md` — "light on the surface, serious underneath"; Jo-Ha-Kyu "kyu" clean-finish principle that motivates the verdict elevation.
- `docs/research/outdoor-courtside-ui-brief.md` — review-surface envelope that permits slightly more emphasis than active-run surfaces.
- `docs/archive/plans/2026-04-19-feat-phase-f1-home-calm-pass-plan.md` — wordmark size constraint that F11 respects.
- `docs/archive/plans/2026-04-19-feat-phase-f8-typography-foundation-plan.md` — CompleteScreen page-level `<h1>` this plan's verdict sits beneath.
