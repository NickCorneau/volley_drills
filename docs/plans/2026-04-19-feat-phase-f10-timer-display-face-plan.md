---
title: "feat: Phase F10 timer display face (JetBrains Mono for BlockTimer + preroll unification)"
type: plan
status: landed
landed_on: 2026-04-19
date: 2026-04-19
origin: "Chat typography review follow-on to Phase F9; cf. `canvases/typography-review.canvas.tsx`"
depends_on:
  - docs/plans/2026-04-19-feat-phase-f9-inter-self-host-plan.md
  - docs/research/outdoor-courtside-ui-brief.md
  - docs/research/courtside-timer-patterns.md
  - docs/research/japanese-inspired-visual-direction.md
---

# Phase F10: Timer display face

## Overview

Phase F10 replaces the Tailwind `font-mono` system-font fallback on the live block timer with an explicit, bundled display face — **JetBrains Mono Variable** via Fontsource — and unifies the preroll countdown under the same face so both timer surfaces share one voice. It is the single highest-leverage brand move identified by the 2026-04-19 typography audit (`canvases/typography-review.canvas.tsx`): the timer is the element every athlete stares at for most of every drill, and today it renders as whatever mono face the OS happens to ship (Consolas on Windows, Menlo on macOS, DejaVu Sans Mono on Android). The hero surface cannot be a fallback.

F10 ships a deterministic, disambiguated, variable-weight mono face that the brand gets to choose, precached with the same PWA plumbing F9 established for Inter, and applies it to exactly two surfaces — `BlockTimer` and the preroll countdown in `RunScreen` — with no other visual changes elsewhere in the app.

## Problem frame

- **Hero surface is a system-font lottery.** `BlockTimer` uses `font-mono text-[56px] font-bold tabular-nums`. Tailwind's default `font-mono` resolves to `ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace`. The rendered glyph shapes, colon alignment, and zero/O disambiguation all change per device. Walkthrough screenshots in the 2026-04-19 audit show the Windows render (Consolas) has a visibly different colon baseline from the Inter body around it, reading as a jarring mismatch rather than a deliberate dual-face system.
- **Two timer surfaces don't share a voice.** The live block timer uses `font-mono` at 56 px in `text-text-primary`. The preroll countdown on `RunScreen` uses Inter at 72 px in `text-accent` (`text-[72px] font-bold tabular-nums leading-none text-accent`). Same semantic role — "count this down for me" — rendered with two different typographic voices on the same screen within seconds of each other.
- **Outdoor brief calls out timer digits specifically** (`docs/research/outdoor-courtside-ui-brief.md`: `timer_or_rep_digits_px: [56, 64]`) and names "system sans stack for performance and familiarity" for body copy. It does **not** freeze the mono face — that choice is still open — and its frozen 56–64 px digit size is entirely preserved by F10.

## Requirements trace

- **R1.** `@fontsource-variable/jetbrains-mono` is added as a production dependency in `app/package.json`.
- **R2.** The Fontsource CSS for the mono face is imported once, adjacent to the existing Inter import in `app/src/main.tsx`, so Vite bundles the variable `woff2` into `dist/assets/` under the same workbox precache glob introduced by F9.
- **R3.** `app/src/index.css` adds a `--font-mono` theme token pointing at `'JetBrains Mono Variable'` with a `'JetBrains Mono'` safety fallback, then the existing Tailwind default mono stack so a missing woff2 still lands on a monospace face rather than a proportional one. Tailwind v4 picks this token up automatically and re-exports it as the `font-mono` utility, so no Tailwind config change is needed.
- **R4.** `BlockTimer` keeps every existing class (`text-[56px] font-bold leading-none text-text-primary tabular-nums`) and keeps the `font-mono` utility — now resolving to JetBrains Mono Variable instead of Consolas. A `font-feature-settings` line is added to opt into the disambiguated zero (`zero` feature) so the digit `0` cannot be confused with `O` at a glance in bright sun.
- **R5.** `RunScreen`'s preroll countdown moves from Inter (`text-[72px] font-bold tabular-nums leading-none text-accent`) to the same JetBrains Mono face by adding `font-mono` and keeping the accent color that already separates it from the live timer. Result: two timer surfaces, one family, one instrument voice — scale and color continue to differentiate preroll-as-countdown from live-as-timer.
- **R6.** No text content changes, no semantic role changes (`role="timer"`, `aria-live="polite"`). No test changes required. No behavior change.
- **R7.** Build succeeds (`npm run build`); the emitted `dist/assets/` contains a single `jetbrains-mono-latin-wght-normal-*.woff2` (plus any other subsets Fontsource emits, lazy-loaded by `unicode-range`).
- **R8.** All existing tests pass unchanged.

## Scope boundaries

### In scope

- Adding and importing `@fontsource-variable/jetbrains-mono`.
- Adding the `--font-mono` theme token with JetBrains Mono Variable at the head of the stack.
- Keeping `font-mono text-[56px] font-bold tabular-nums` on `BlockTimer` and opting into the disambiguated-zero feature.
- Adding `font-mono` to the `RunScreen` preroll span so it renders in the same family.
- Inline comments anchoring each change to this plan.

### Out of scope — explicit deferrals

- **Resizing the timer or preroll** (the audit's "proposed scale" suggested 64 px / 96 px respectively). Size changes are a separate visual decision and out of scope for an identity swap.
- **Dropping `font-bold` to the variable-weight sweet spot** (JetBrains Mono looks excellent at ~500–600 for display digits rather than at 700). Tuning weight is a screenshot-per-step exercise; the F10 swap stays at 700 so the only variable changing is the family.
- **Adding `font-mono` anywhere else in the app.** Review-screen numeric inputs, pass-rate displays, and session-recap rows already use Inter's `tabular-nums` appropriately; re-keying them to a mono face would be a bigger design pass than F10 warrants.
- **Preload hint for the JetBrains Mono woff2.** Fontsource's default `font-display: swap` is fine; the Inter body copy paints immediately and the timer digits swap in on the first frame after the font loads. Preload-hint tuning is a metrics-driven follow-on.
- **Alternative mono candidates** (IBM Plex Mono, Commit Mono, Geist Mono). The audit named JetBrains Mono as best-fit for courtside legibility (disambiguated digits, strong stroke contrast, wide outdoor character family) and that is the F10 choice; revisiting is a design-level decision, not a plumbing one.

## Context and research

- `canvases/typography-review.canvas.tsx` — the 2026-04-19 audit, Tier 2 row, identified JetBrains Mono as the best-fit candidate for the timer hero.
- `docs/research/outdoor-courtside-ui-brief.md` — frozen 56–64 px digit-size band, 72–88 px pair-at-1m band; preserved unchanged by F10.
- `docs/research/courtside-timer-patterns.md` — large, high-contrast countdown-first pattern; JetBrains Mono is aligned with both traits.
- `docs/research/japanese-inspired-visual-direction.md` — "durable typography" and "one accent color used deliberately for action or status". F10 keeps the timer in `text-text-primary` and the preroll in `text-accent` so the color vocabulary is unchanged.
- `docs/plans/2026-04-19-feat-phase-f9-inter-self-host-plan.md` — F9 established the Fontsource + Vite + workbox precache pattern this plan reuses for the mono face.
- `docs/plans/2026-04-19-feat-phase-f8-typography-foundation-plan.md` — F8 explicitly enumerated F10 as the mono-swap follow-on.

## Key technical decisions

1. **Use Tailwind's `font-mono` token rather than a custom class.** Tailwind v4's `@theme { --font-mono: ... }` automatically re-exports the token as the `font-mono` utility. Keeping the call-site class name the same means `BlockTimer`'s existing className stays stable; only the token behind the utility changes.
2. **Opt into the `zero` OpenType feature, not `ss01` / `ss02`.** JetBrains Mono's default `0` is already narrow and slashed on some weights but not all; explicitly enabling the `zero` feature locks in the disambiguated slashed zero across every weight. The other stylistic sets change curly `l` → straight `l` etc., which is less important for a pure-digit timer surface. Keep the feature set minimal.
3. **Add `font-mono` to the preroll instead of building a separate `font-display` token.** One unified family for both timer surfaces is simpler than a three-token stack (`sans`, `mono`, `display`). If a real display face enters the system later (brand wordmark, verdict treatment), that will get its own token.
4. **Keep the preroll in accent color.** Current UX: accent = "get ready" marker, primary = "in progress". Swapping to mono unifies the family; keeping accent preserves the color-based semantic.
5. **Do not resize the timer or preroll in this pass.** The audit proposed 64 px and 96 px respectively. Shipping family + size together would make it impossible to tell which change caused any dogfeed reaction. F10 is strictly "same layout, different voice."

## Implementation units

- [x] **Unit 1: Add Fontsource JetBrains Mono dependency** *(landed 2026-04-19)*

  **Files:**
  - Modify: `app/package.json` (and `package-lock.json` via install)

  **Approach:**
  - `npm install @fontsource-variable/jetbrains-mono` inside `app/`.
  - Verify the installed package registers `'JetBrains Mono Variable'` in its `@font-face` rules and ships subset-split woff2 files.

  **Verification:**
  - `npm ls @fontsource-variable/jetbrains-mono` resolves to a single version.
  - The package's `index.css` contains `font-family: 'JetBrains Mono Variable'`.

- [x] **Unit 2: Wire the mono font into the bundle** *(landed 2026-04-19)*

  **Files:**
  - Modify: `app/src/main.tsx`
  - Modify: `app/src/vendor.d.ts`

  **Approach:**
  - Add `import '@fontsource-variable/jetbrains-mono'` directly beneath the existing Inter import, with a short Phase F10 comment noting the timer-surface rationale.
  - Extend `vendor.d.ts` with `declare module '@fontsource-variable/jetbrains-mono'` so `tsc -b` accepts the side-effect import under this repo's strict TS config (same pattern F9 established for Inter).

  **Verification:**
  - `npm run build` succeeds.
  - `dist/assets/` contains `jetbrains-mono-latin-wght-normal-*.woff2` (plus other subsets lazy-loaded by `unicode-range`).
  - `rg 'googleapis|gstatic' dist` still returns nothing.

- [x] **Unit 3: Add `--font-mono` token** *(landed 2026-04-19)*

  **Files:**
  - Modify: `app/src/index.css`

  **Approach:**
  - Add a new line to the `@theme` block immediately after `--font-sans`:
    `--font-mono: 'JetBrains Mono Variable', 'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;`
  - Keep the fallback chain explicit so a missing woff2 still lands on a monospace face. Add a short comment anchoring the token to the plan (using plain text, avoiding any `*/` sequence per the F9 lesson).

  **Verification:**
  - DevTools *Rendered Fonts* on the live block timer reports `JetBrains Mono Variable` as the active face during a Run block.
  - Timer digits `0` / `O` are visually distinguishable at 56 px.

- [x] **Unit 4: `BlockTimer` feature tune-up** *(landed 2026-04-19)*

  **Files:**
  - Modify: `app/src/components/BlockTimer.tsx`

  **Approach:**
  - Keep the existing className verbatim (`font-mono text-[56px] font-bold leading-none text-text-primary tabular-nums`). The `font-mono` utility now resolves to JetBrains Mono via Unit 3.
  - Add an inline `style={{ fontFeatureSettings: '"zero" 1' }}` on the countdown digits to force the disambiguated slashed zero, matching the "glanceable outdoors" criterion in the outdoor brief. This is the one F10 scope decision that is not a pure plumbing change.
  - Add a Phase F10 comment at the top of the component explaining the display-face swap.

  **Verification:**
  - A block where `remainingSeconds` crosses a `X:X0` boundary (e.g. 2:00 → 1:59) shows a clearly slashed `0`.
  - Timer digit colon alignment now matches the JetBrains Mono reference (colon sits visually centered vertically between the number rows).

- [x] **Unit 5: Unify the RunScreen preroll countdown** *(landed 2026-04-19)*

  **Files:**
  - Modify: `app/src/screens/RunScreen.tsx`

  **Approach:**
  - On the preroll `<span>` (currently `text-[72px] font-bold tabular-nums leading-none text-accent`), add `font-mono` so it shares the live-timer family. Keep `text-accent` so the color continues to signal "get ready" vs the primary-colored live timer.
  - Add the same inline `style={{ fontFeatureSettings: '"zero" 1' }}` so the countdown 3/2/1/0 digits render consistently. The preroll currently never shows 0 (it flips to the live timer on beat-zero), but the feature costs nothing and means any future tweak — e.g. a "GO" or a hold-at-zero frame — stays consistent.
  - Add an inline comment anchoring the change to this plan.

  **Verification:**
  - Start a session and watch the preroll: the 3 / 2 / 1 digits render in JetBrains Mono, accent orange, visually a larger cousin of the live timer that appears a second later.
  - The two timer surfaces now read as "the same instrument at two volumes," not as two different type systems.

## System-wide impact

- **Interaction graph:** none. Timer semantics (`role="timer"`, `aria-live="polite"`, preroll lifecycle) unchanged.
- **Error propagation:** none.
- **State lifecycle:** none.
- **API surface parity:** none. `BlockTimer` props and the RunScreen preroll contract are unchanged.
- **Integration coverage:** all existing Vitest and Playwright tests are expected to pass unchanged. jsdom does not render fonts.
- **Unchanged invariants:**
  - 56–64 px timer / rep-digits band from the outdoor brief.
  - Accent-vs-primary color semantics (preroll vs live).
  - F8 eyebrow + heading consistency work.
  - F9 offline-first font-loading contract — JetBrains Mono rides the same precache glob.
  - `V0B-08` cue-stack invariants.

## Risks and dependencies

| Risk | Mitigation |
|------|------------|
| JetBrains Mono looks too "code-editor" for a training app | The audit explicitly chose it for courtside legibility — disambiguated digits, even stroke weight, wide character family. If field dogfeed reports an unintended "terminal" read, the `--font-mono` token is one file to swap (e.g. to IBM Plex Mono) with zero call-site changes. |
| Variable weight `700` renders too heavy for a countdown | Digits at 56 px in `font-bold` have historically held up well in the audit screenshots; if they look visually cramped, drop to `font-semibold` in a small follow-on. The F10 swap keeps the weight stable so the family swap is the only independent variable. |
| `"zero" 1` OpenType feature not supported on older iOS WebKit | OpenType feature settings degrade gracefully — unsupported features are simply ignored and the default glyph renders. The fallback zero remains legible at 56 px; the feature is a nice-to-have, not a correctness lever. |
| Preroll accent color plus JetBrains Mono reads as "error" / "warning" because code editors associate the face with syntax highlighting | The same accent orange (`#b45309`) already paints the primary "Start Next Block" button, phase labels, and back-links without reading as an error; the brand has already trained the color as action-orange. The mono face does not change that reading. |
| Timer subset fetch is a second round-trip after Inter on cold paint | Both subsets are ≤50 KB and are requested in parallel by the browser once HTML paints. Precached by the same workbox glob F9 established — first install downloads both once, subsequent opens are fully offline. |
| Global `font-mono` token change silently affects any other `font-mono` call-site | A repo-wide scan (`rg 'font-mono' app/src`) showed exactly two production call-sites: `BlockTimer` and the RunScreen preroll (after Unit 5 adds it). Both are intentionally retargeted by this plan. No collateral surfaces. |

## Documentation / operational notes

- No `docs/catalog.json` or `AGENTS.md` updates — F10 is a font-swap visual pass.
- The typography canvas (`canvases/typography-review.canvas.tsx`) calls out JetBrains Mono as the recommended face; after F10 lands it can be updated to note the recommendation shipped, but that is housekeeping rather than a required follow-on.
- No release-note impact.

## Sources and references

- `canvases/typography-review.canvas.tsx` — the 2026-04-19 audit, Tier 2 row, recommending JetBrains Mono.
- `docs/research/outdoor-courtside-ui-brief.md` — 56–64 px timer-digit band preserved; system-sans stack rule unchanged for body.
- `docs/research/courtside-timer-patterns.md` — countdown-first pattern F10 reinforces.
- `docs/plans/2026-04-19-feat-phase-f9-inter-self-host-plan.md` — F9 established the Fontsource / Vite / precache pattern reused here.
- [JetBrains Mono](https://www.jetbrains.com/lp/mono/) — OFL-licensed; Fontsource ships the variable build used by Unit 1.
