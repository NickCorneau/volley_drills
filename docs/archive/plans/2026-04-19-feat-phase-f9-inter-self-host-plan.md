---
title: "feat: Phase F9 Inter self-host (offline-first type, remove Google Fonts CDN, enable cv11 feature)"
type: plan
status: landed
landed_on: 2026-04-19
date: 2026-04-19
origin: "Chat typography review follow-on to Phase F8; cf. `canvases/typography-review.canvas.tsx` and `docs/archive/plans/2026-04-19-feat-phase-f8-typography-foundation-plan.md`"
depends_on:
  - docs/archive/plans/2026-04-19-feat-phase-f8-typography-foundation-plan.md
  - docs/research/outdoor-courtside-ui-brief.md
  - docs/vision.md
---

# Phase F9: Inter self-host

## Overview

Phase F9 closes the single local-first gap the typography audit flagged (`canvases/typography-review.canvas.tsx`, 2026-04-19): Inter is loaded from `fonts.googleapis.com` on every cold paint, which makes the app's typography implicitly network-dependent. P10 in `docs/vision.md` ("your training data lives on your device first; starting a session must never depend on a strong network connection") and the outdoor brief both expect the first paint to work offline, and today that only holds once the service worker has cached the Google Fonts response on a prior online load.

F9 replaces the CDN load with a Vite-bundled `@fontsource-variable/inter` import so the font is a first-class build asset — precached by the existing `vite-plugin-pwa` `woff2` glob, served from the same origin as the app, and available on the very first paint after install. It also enables Inter's `cv11` stylistic set on body copy — the single-story `a` variant the Inter author describes as the "refined" default — which gives the app a small but consistent character lift aligned with the shibui thesis. No visual regression otherwise: the same `Inter` family, the same weights, the same rendering.

## Problem frame

- `app/index.html` loads Inter with `<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap">`. That request runs on every cold open. If the device is offline and the service worker has not yet cached the response, first paint falls back to `ui-sans-serif`, then flashes to Inter once the network returns. Courtside cold-opens on bad cell are the exact scenario P10 is about.
- The PWA config in `app/vite.config.ts` tries to mitigate with two `runtimeCaching` rules targeting `fonts.googleapis.com` and `fonts.gstatic.com`. Those rules are only effective *after* a successful online load has populated the cache. A fresh install on a plane, a field, or a poor-connection hotel still fails to paint with the brand font.
- The audit also flagged that Inter is currently loaded as four static weight files (400/500/600/700). The variable font ships as one file, one HTTP round-trip equivalent, with the full weight axis available — the right primitive for a type system that wants to distinguish 400 body from 500 labels from 600 CTAs from 700 display.
- No Inter stylistic features are enabled today. The `cv11` set (single-story `a`) is the most widely-recommended Inter feature for a "finished, refined" body voice and costs a single CSS line to opt into.

Each fix ships in one pass here; F9 is scoped to Inter only. The timer-mono swap is deliberately split into F10 because it is a visible brand change, not a local-first infrastructure change.

## Requirements trace

- **R1.** `app/index.html` no longer references `fonts.googleapis.com` or `fonts.gstatic.com`. The two `<link rel="preconnect">` tags and the `<link rel="stylesheet">` tag for Inter are removed.
- **R2.** `@fontsource-variable/inter` is added as a production dependency in `app/package.json` and its default CSS is imported once from `app/src/main.tsx` so Vite bundles the variable `woff2` into the `dist/assets/` output.
- **R3.** `app/src/index.css` updates `--font-sans` to lead with `'Inter Variable'` (the family name Fontsource registers for the variable face) and falls back to `'Inter'`, then the existing system stack. This keeps any third-party stylesheet that loads `Inter` from breaking if something external ever adds it, and gives the `system-ui` fallback a graceful chain when the woff2 is missing.
- **R4.** `app/src/index.css` adds `font-feature-settings: 'cv11' 1;` to the `body` rule. No other OpenType features are changed.
- **R5.** `app/vite.config.ts` removes the two `runtimeCaching` rules for `fonts.googleapis.com` / `fonts.gstatic.com`. They are vestigial after F9 and would only cache a network request that no longer happens.
- **R6.** The existing `workbox.globPatterns` entry already includes `woff2`, so the Vite-bundled Inter file is precached automatically on build. No PWA precache plumbing changes are required.
- **R7.** No behavior change, no schema change, no copy change, no Tailwind class change in any component.
- **R8.** Build succeeds (`npm run build`) and the emitted `dist/assets/` directory contains a single `InterVariable-*.woff2` (or equivalent Fontsource-hashed filename). No references to `fonts.googleapis.com` or `fonts.gstatic.com` remain in any emitted file.
- **R9.** All existing tests pass unchanged (jsdom does not exercise font loading).
- **R10.** First paint on a fresh `npm run dev` / `npm run build && npm run preview` renders Inter immediately without any network roundtrip to an external font host.

## Scope boundaries

### In scope

- Installing and importing `@fontsource-variable/inter`.
- Removing the Google Fonts `<link>` / `<preconnect>` tags from `index.html`.
- Updating the `--font-sans` token in `index.css` to lead with the Fontsource family name.
- Enabling `font-feature-settings: 'cv11' 1;` on the body rule.
- Removing the now-vestigial Google Fonts runtime-caching rules from the PWA config.

### Out of scope — explicit deferrals

- **Timer mono face swap (`font-mono` → JetBrains Mono / IBM Plex Mono).** Same font-loading plumbing, but a visible brand change rather than a transparency infrastructure change. Dedicated **Phase F10** plan.
- **Additional Inter stylistic features (`ss01`, `ss02`, `tnum` on body, etc.).** `cv11` is the single most-recommended refinement; layering more features needs dedicated screenshots per feature so regressions show up. Candidate for a later pass.
- **Switching body default from `text-sm` to `text-base`.** Broad visual shift tracked by F8 already.
- **Preloading the Inter woff2 via `<link rel="preload">`.** Fontsource's default `font-display: swap` is fine for the first-paint scenario; adding a preload hint is a tune-up rather than a correctness fix. Candidate if paint metrics show a visible FOUT worth chasing.
- **Wordmark display face, brand-name reconciliation.** Brand-level, tracked elsewhere.

## Context and research

- `docs/vision.md` — P10 (local-first) and the product promise of starting without a strong network.
- `docs/research/outdoor-courtside-ui-brief.md` — the light-only, system-sans-stack freeze ("System sans stack for performance and familiarity") this plan is consistent with: Inter is the already-accepted sans-serif choice; F9 only changes *where it loads from*.
- `canvases/typography-review.canvas.tsx` — the 2026-04-19 audit that identified the Google-Fonts-CDN dependency as the one clear local-first miss.
- `docs/archive/plans/2026-04-19-feat-phase-f8-typography-foundation-plan.md` — explicitly enumerated this work as an F9 candidate.
- Fontsource v5 conventions — `@fontsource-variable/<family>` packages register their font with the CSS family name `'<Family> Variable'` and ship a prebuilt variable `woff2` with `font-display: swap`, suitable for direct Vite bundling.

## Key technical decisions

1. **Use `@fontsource-variable/inter` rather than hand-managing the woff2 in `public/`.** Fontsource is the de-facto npm distribution for OFL-licensed web fonts; it ships the canonical Inter Variable build with the correct `unicode-range` and metadata, handles `font-display`, and keeps the OFL license files alongside the package. Hand-managing a woff2 under `app/public/fonts/` is a viable alternative but adds license-tracking overhead and a second place fonts live.
2. **Import the Fontsource CSS from `main.tsx`, not `index.css`.** Tailwind v4's `@import 'tailwindcss'` runs through the Tailwind preprocessor and adding a second `@import` to an `npm` package from `index.css` has historically surprised Vite dep-resolution; the TS/JS entry is the unambiguous place for bundler-visible font CSS imports. One line, one side effect.
3. **Keep the `'Inter'` fallback in `--font-sans` alongside `'Inter Variable'`.** Defensive against any future tooling (including devtools previews, email templates, or downstream consumers) that might still ship Inter under the static family name. Has zero runtime cost.
4. **Enable only `cv11`, not a broader feature set.** The single-story `a` is the one feature Inter's author markets as the "refined default"; additional features deserve screenshot-per-feature review. One thing at a time.
5. **Remove the Google Fonts runtime-caching rules in the same pass.** Leaving them behind is dead code that implies network traffic that no longer exists. Removing them together means a future reader doesn't have to reconstruct why two CDN-caching rules target a host the app never contacts.

## Implementation units

- [x] **Unit 1: Add Fontsource Inter variable font dependency** *(landed 2026-04-19)*

  **Files:**
  - Modify: `app/package.json` (and `package-lock.json` via install)

  **Approach:**
  - `npm install @fontsource-variable/inter` inside `app/` so the package is added as a production dependency (not devDependency — runtime needs it).
  - Verify the installed version resolves and `node_modules/@fontsource-variable/inter/` contains the expected `index.css` plus the variable `woff2` files.

  **Verification:**
  - `npm ls @fontsource-variable/inter` shows a single resolved version at top level.
  - The package's `index.css` contains `@font-face` with family `'Inter Variable'`.

- [x] **Unit 2: Wire the font into the bundle + enable cv11** *(landed 2026-04-19)*

  **Files:**
  - Modify: `app/src/main.tsx`
  - Modify: `app/src/index.css`

  **Approach:**
  - Add `import '@fontsource-variable/inter'` at the top of `main.tsx` (above the React imports is conventional but order does not matter for side-effect-only imports; placing it directly under the other top-of-file imports keeps diff minimal).
  - In `index.css`, update `--font-sans` from `'Inter', ui-sans-serif, system-ui, sans-serif` to `'Inter Variable', 'Inter', ui-sans-serif, system-ui, sans-serif`.
  - Add `font-feature-settings: 'cv11' 1;` to the existing `body { ... }` rule, adjacent to the existing `-webkit-font-smoothing: antialiased;` line so the typographic tuning sits together.
  - Add a short comment anchoring the change to this plan.

  **Verification:**
  - `npm run dev` serves the app; DevTools *Network* shows the `InterVariable-*.woff2` load from the same origin (`/assets/...`) rather than from `fonts.gstatic.com`.
  - DevTools *Rendered Fonts* on a body paragraph reports `Inter Variable` (or `Inter` in the fallback family name Chrome chooses to display, depending on version) as the active face.
  - Lowercase `a` in body copy renders as the single-story variant.

- [x] **Unit 3: Remove the Google Fonts CDN from `index.html`** *(landed 2026-04-19)*

  **Files:**
  - Modify: `app/index.html`

  **Approach:**
  - Delete the two `<link rel="preconnect">` tags pointing at `fonts.googleapis.com` / `fonts.gstatic.com`.
  - Delete the `<link rel="stylesheet">` tag loading the Inter CSS from Google Fonts.
  - Leave every other `<head>` entry (meta viewport, apple-touch-icon, theme-color, manifest-era meta tags) unchanged.

  **Verification:**
  - `rg 'googleapis|gstatic' app/` returns no matches.
  - Production build (`npm run build`) emits an `index.html` in `dist/` with no external font references.

- [x] **Unit 4: Drop the vestigial Google Fonts runtime-caching rules** *(landed 2026-04-19)*

  **Files:**
  - Modify: `app/vite.config.ts`

  **Approach:**
  - Remove both entries in the `workbox.runtimeCaching` array that target `fonts.googleapis.com` and `fonts.gstatic.com`. If that leaves `runtimeCaching` empty, delete the key so the generated service worker config stays clean.
  - Leave `workbox.navigateFallback`, `globPatterns`, and `includeAssets` unchanged. The `woff2` glob already picks up the Fontsource-emitted file.

  **Verification:**
  - `npm run build` succeeds.
  - The emitted `dist/sw.js` / `dist/workbox-*.js` contains no reference to `googleapis` or `gstatic`.
  - `dist/assets/` contains a single `InterVariable*.woff2` and it is listed in the precache manifest.

## System-wide impact

- **Interaction graph:** none. No handler, route, or state transition changes.
- **Error propagation:** none.
- **State lifecycle:** none.
- **API surface parity:** none.
- **Integration coverage:** all existing Vitest and Playwright tests are expected to pass unchanged. jsdom does not load webfonts, so tests are unaffected by the font-source change. Playwright tests run against a local preview server so network-hosted font regressions are not exercised today either.
- **Unchanged invariants:**
  - Outdoor readability contract (same family, same weights, same `16 px` body floor).
  - All F8 typography changes (eyebrow removal, heading consistency, RPE anchor floor).
  - PWA precache behavior (same `globPatterns`, same `navigateFallback`).
  - Home precedence, active-run cue invariants, `D91` field-test artifact behavior.

## Risks and dependencies

| Risk | Mitigation |
|------|------------|
| `@fontsource-variable/inter` ships a family name different from `'Inter Variable'` (e.g. `'InterVariable'` with no space) and the `--font-sans` declaration misses the actual face | Verify the family name from the installed package's `index.css` before landing; update `--font-sans` to match; keep `'Inter'` fallback so even a total miss still lands on an `Inter`-named face when one is present. If the Fontsource convention ever changes, the fallback chain protects first paint. |
| Build size grows (single variable woff2 vs four static weights) | Inter Variable is ~340 KB; the four static weights currently pulled from Google total ~130 KB across four requests. The variable file is a single round-trip, cache-friendly, and most importantly available offline — the right trade for a courtside PWA. If cell-connection install size is a concern later, switch to the subset `@fontsource-variable/inter/wght.css` which is Latin-only and ~100 KB. |
| Flash of Unstyled Text (FOUT) on the first paint before the woff2 resolves | Fontsource default `font-display: swap` means the system fallback paints instantly and Inter swaps in without blocking. This is the same behavior as the current Google Fonts `display=swap` query param; there should be no regression. If FOUT becomes visibly annoying in dogfeed, `<link rel="preload">` is a follow-on. |
| `cv11` single-story `a` visibly changes body copy in a way a tester does not expect | It is a subtle shape change, not a legibility change. The audit recommended it specifically because it elevates the default double-story `a` toward a more humanist, shibui-leaning voice. If field test reports confusion, revert the one-line `font-feature-settings` rule without affecting anything else. |
| Removing the Google Fonts `runtimeCaching` rules breaks a pre-F9 install whose service worker still has those rules | Workbox regenerates the service worker on every build with a new precache hash; existing installs update on the next online visit through the existing `registerType: 'prompt'` flow. No user-visible break. |
| PWA `includeAssets` misses the new font | It does not need to list the font — `workbox.globPatterns` already captures `**/*.woff2` from the build output, which is the correct location for Vite-bundled assets. `includeAssets` is for raw `public/` copies. |

## Documentation / operational notes

- No `docs/catalog.json` or `AGENTS.md` updates — F9 is pure infrastructure.
- No release-note impact.
- The typography canvas (`canvases/typography-review.canvas.tsx`) already names F9 / F10 as the planned follow-ons. F10 (timer mono swap) ships in its own plan immediately after this one.

## Sources and references

- `canvases/typography-review.canvas.tsx` — the 2026-04-19 audit that identified the Google Fonts CDN dependency as the one clear local-first miss and recommended Inter Variable + `cv11`.
- `docs/vision.md` — P10 (local-first) product principle this plan brings the font-loading stack into alignment with.
- `docs/research/outdoor-courtside-ui-brief.md` — light-only, system-sans-stack freeze; F9 preserves every invariant, only changing the asset host.
- `docs/archive/plans/2026-04-19-feat-phase-f8-typography-foundation-plan.md` — the preceding calm-pass plan whose *Out of scope* list enumerated F9 and F10.
- [Inter project, rsms.me/inter/](https://rsms.me/inter/) — `cv11` single-story `a` stylistic-set rationale.
- Fontsource v5 — `@fontsource-variable/<family>` convention used by Unit 1.
