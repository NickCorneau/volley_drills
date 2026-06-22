---
id: plan-2026-06-22-t7-surface-drift
title: "refactor: T7 — route hand-rolled panels through the shared soft surface; defer T8 label flips"
status: active
stage: build
type: plan
summary: "Fix theme T7 from the 2026-06-22 minimalism/shibui audit: Settings' two secondary sections and PerDrillCapture hand-roll near-soft bordered panels instead of the canonical surface, competing with each screen's one focal surface. Promote a shared SOFT_SURFACE_CLASS token, route Settings' skill-level + storage sections through it (Export stays the single focal card), and flatten PerDrillCapture to a calm body. T8 (label vocabulary) is documented as ratified canon (D153) + pinned tests and DEFERRED per founder steer — no silent reverts. Markup/token-only; no behavior, data, route, or assembly change."
origin: docs/design/reviews/2026-06-22-minimalism-shibui-audit.md
last_updated: 2026-06-22
depends_on:
  - docs/design/reviews/2026-06-22-minimalism-shibui-audit.md
  - docs/research/brand-ux-guidelines.md
  - .cursor/rules/component-patterns.mdc
---

# refactor: T7 — surface-language drift / primitive bypass (+ T8 disposition)

## Summary

Theme **T7** of the 2026-06-22 shibui audit: the `Card` primitive / canonical surface tokens exist to prevent surface-language drift, but several call sites hand-roll near-`soft` bordered panels — **Settings** secondary sections (`rounded-base border border-text-secondary/15 bg-bg-warm/40 p-4`) and **PerDrillCapture** (`rounded-base border border-text-secondary/15 bg-bg-primary p-4`). These bordered panels reintroduce card chrome on surfaces meant to read as calm bodies and compete with each screen's one focal surface.

Fix: promote a shared `SOFT_SURFACE_CLASS` token (mirroring the existing `FOCAL_SURFACE_CLASS` / `ELEVATED_PANEL_SURFACE` pattern in `app/src/components/ui/surfaces.ts`), route Settings' two secondary sections through it (the `Card variant="focal"` Export card stays the single focal surface), and flatten `PerDrillCapture` to a calm body (drop the border/bg/radius chrome; the `<main>` `px-4` gutter already supplies horizontal breathing). Result: **one focal surface per screen**, zero hand-rolled near-soft panels.

Token/markup-only. No behavior, Dexie, route, assembly, or domain change. The change is class-string-level; existing tests query by `data-testid` / role / text (not chrome classes), so they stay green.

**T8 (label vocabulary) is DEFERRED** — see [§ Deferred: T8 disposition](#deferred-t8-label-vocabulary-founder-judgment--no-silent-flips). The audit's T8 items map almost entirely to ratified canon (`brand-ux-guidelines.md` §7.4/§7.5, `D153`), one is pinned by a test, and the remaining distinctions are semantically intentional. Flipping them would revert ratified design and is a founder call, taken per the 2026-06-22 steer not to apply silently.

---

## Constraints honored

- **One focal surface per screen** (T7 goal): Settings keeps exactly one focal `Card` (Export); the two secondary sections become quiet warm soft surfaces. DrillCheck keeps exactly one warm surface (the `JustFinishedPill` receipt panel — the screen's subject per the TransitionScreen comment); the capture body goes flat.
- **Accessibility:** all section `aria-labelledby` associations, `data-testid`s, and `data-posture` retained; no landmark or heading removed. Tap targets unchanged.
- **Outdoor-legibility / shibui canon:** no font, contrast, or tap-target shrink; this is pure chrome subtraction + token consolidation. `surfaces.ts` keeps `RunScreen`/`TransitionScreen` excluded from focal/soft surfaces (unchanged).
- **D156 Home covenant:** untouched — no Home surface changes; render-budget test not in scope.
- **Drift guardrail / component-patterns.mdc:** the change *removes* hand-rolled surface strings in favor of a shared token, the direction the rule wants.

---

## High-Level Technical Design

Surface-token source-of-truth after this change (`app/src/components/ui/surfaces.ts`):

| Token | Class | Used by |
|---|---|---|
| `FOCAL_SURFACE_CLASS` | `rounded-focal bg-bg-primary border … shadow-sm` | the ONE focal card per calm screen (e.g. Settings Export, Home primary) |
| `SOFT_SURFACE_CLASS` *(new)* | `rounded-base bg-bg-warm p-4` | warm secondary groupings (`Card variant="soft"`, Settings skill-level + storage sections) |
| `ELEVATED_PANEL_SURFACE` | `bg-bg-primary border … shadow-lg` | modals / sheets |

Per-screen surface census after the change:

- **Settings** = 1 focal card (Export) + 2 soft surfaces (skill level, storage) + footer captions. No bordered warm/40 panels.
- **DrillCheck** = 1 warm `JustFinishedPill` panel (receipt, the subject) + flat capture body (chips + drawers) + footer CTA. No bordered white panel.

---

## Implementation Units

### U1 — Promote `SOFT_SURFACE_CLASS` to the surfaces token module

- **Goal:** give the warm soft surface a single source of truth so non-`Card` consumers stop hand-rolling it, mirroring how `FOCAL_SURFACE_CLASS` / `ELEVATED_PANEL_SURFACE` were extracted (plan U1, 2026-05-04).
- **Requirements:** T7 (primitive/token exists to prevent drift).
- **Dependencies:** none.
- **Files:**
  - `app/src/components/ui/surfaces.ts` — add `export const SOFT_SURFACE_CLASS = 'rounded-base bg-bg-warm p-4'` with a short doc comment (warm supporting surface; not the same as Button's `soft` filled-button variant — carry the existing naming-distinction note).
  - `app/src/components/ui/Card.tsx` — `VARIANT_CLASS.soft` consumes `SOFT_SURFACE_CLASS` instead of the inline literal; keep the back-compat re-export block style consistent (re-export `SOFT_SURFACE_CLASS` alongside the other two if that matches the file's existing re-export shape).
- **Approach:** pure extraction. The literal `'rounded-base bg-bg-warm p-4'` already lives inline in `Card`'s `VARIANT_CLASS.soft`; move it to `surfaces.ts` and reference it. No visual change to any current `Card variant="soft"` consumer (Review's nested cards, Complete recap, etc.).
- **Patterns to follow:** the existing `FOCAL_SURFACE_CLASS` / `ELEVATED_PANEL_SURFACE` exports + their doc comments in the same file; the Card↔surfaces re-export note already in `Card.tsx`.
- **Test scenarios:** Test expectation: none — pure token extraction with no behavior or rendered-class change. No `Card` test file exists, and no consumer test pins the literal soft class string (verified). The full suite re-running green on the unchanged soft consumers is the regression signal.
- **Verification:** `npx tsc --noEmit` clean; existing `Card variant="soft"` consumers render byte-identical classes; full suite green.

### U2 — Route Settings' secondary sections through the soft surface token

- **Goal:** stop Settings' skill-level + storage sections from hand-rolling a bordered `bg-bg-warm/40` near-soft panel; make the Export `Card variant="focal"` the screen's single focal surface (T7 "one focal surface per screen").
- **Requirements:** T7.
- **Dependencies:** U1.
- **Files:**
  - `app/src/screens/SettingsScreen.tsx` — both secondary `<section>`s (skill-level: `data-testid="settings-skill-level"`; storage: `data-testid="settings-storage-info"` `data-posture={posture}`): replace `className="flex flex-col gap-2 rounded-base border border-text-secondary/15 bg-bg-warm/40 p-4"` with `className={cx(SOFT_SURFACE_CLASS, 'flex flex-col gap-2')}`. Import `cx` from `../lib/cn` and `SOFT_SURFACE_CLASS` from `../components/ui/surfaces` (the surfaces module's own guidance: import the token directly, not via `Card`). Keep `aria-labelledby`, `data-testid`, `data-posture`, headings, and all body copy unchanged. The Export `<Card variant="focal">` is untouched.
  - `app/src/screens/__tests__/SettingsScreen.test.tsx` — verify green (queries are testid/role/text-based, not class-based). No edits expected.
- **Approach:** drop the hand-rolled border + `/40` opacity drift; adopt the canonical warm soft surface. Net visual: the two secondary sections read as quiet warm-filled groupings (borderless) below the elevated white focal Export card — a clear focal/secondary hierarchy. Add a one-line code comment crediting T7 (2026-06-22) routing through the shared token (matching the existing T1 comment convention in this file).
- **Patterns to follow:** how `SkillLevelScreen` option rows / `ActionOverlay` / `home/cardStyles.ts` consume `FOCAL_SURFACE_CLASS` from `surfaces.ts` (token + per-call layout classes via `cx`).
- **Test scenarios:**
  - Happy path: with a saved skill level, `getByTestId('settings-skill-level')` still contains `Skill level` + the level label; `Change` button still navigates. (existing — must stay green)
  - Happy path: storage section `getByTestId('settings-storage-info')` retains `data-posture` and the posture copy. (existing)
  - Edge: unset skill level still shows the correction path (`Set skill level`). (existing)
  - Test expectation: no new tests — markup-only surface swap with all testids/aria/text preserved; the existing suite is the regression net.
- **Verification:** `SettingsScreen.test.tsx` green; 390px visual: Export reads as the one elevated focal card, skill-level + storage read as quiet warm panels with no border, no element touching the screen edge.

### U3 — Flatten `PerDrillCapture` to a calm body — ALREADY LANDED (T3 batch)

> **Status (2026-06-22 execution):** Already implemented in the working tree by the parallel **T3 decorative-chrome** batch (`2026-06-22-003-refactor-t3-decorative-chrome-plan.md`). `PerDrillCapture.tsx` already renders `className="flex flex-col gap-3"` (border/bg/radius/padding chrome removed, T3 comment in place) and the `drillName` prop was dropped (T1 U7 "How was that?"), with `DrillCheckScreen.tsx` updated to match. Verified against this unit's intent — no reimplementation. Left here for traceability.

- **Goal:** remove the card chrome PerDrillCapture hand-rolls around the capture chips/drawers so the DrillCheck body reads calm (T7 + T3 "calm bodies"), leaving the warm `JustFinishedPill` as the screen's single warm surface.
- **Requirements:** T7.
- **Dependencies:** none (independent of U1/U2; can land in any order).
- **Files:**
  - `app/src/components/PerDrillCapture.tsx` — root `<section>` className `flex flex-col gap-3 rounded-base border border-text-secondary/15 bg-bg-primary p-4` → `flex flex-col gap-3`. Keep `aria-labelledby="per-drill-heading"` and `data-testid="per-drill-capture"`. Update the adjacent comment to note the flatten (T7, 2026-06-22) — the chrome was the bordered panel the audit flagged.
  - `app/src/components/__tests__/PerDrillCapture.test.tsx` — verify green (testid/role/text queries, no chrome-class assertions). No edits expected.
- **Approach:** drop border + `bg-bg-primary` + `rounded-base` + `p-4`. Horizontal breathing already comes from `<main className="… px-4">` (App.tsx Layout), so the capture content aligns to the same gutter as the `JustFinishedPill` and `h1` above it instead of being double-inset in a panel. Vertical rhythm between the pill and the capture is owned by `DrillCheckScreen.Body`'s default `calm` rhythm (`gap-6`); internal `gap-3` between heading/chips/drawer is preserved.
- **Patterns to follow:** the calm, chrome-less body sections already used elsewhere on run-flow bodies (e.g. TransitionScreen's `Up next` block is a plain `<div className="flex flex-col …">`, not a card).
- **Test scenarios:**
  - Happy path: the three difficulty chips still render as a radiogroup; tapping fires `onDifficultyChange`. (existing)
  - Happy path: count / streak drawers still collapse/expand and render the success rule; gloss reveals still work. (existing)
  - Edge: `captureShape: 'none'` renders no drawer. (existing)
  - Test expectation: no new tests — chrome subtraction only; `per-drill-capture` testid + `per-drill-heading` aria retained; the existing PerDrillCapture suite is the regression net.
- **Verification:** `PerDrillCapture.test.tsx` + `DrillCheckScreen.*` suites green; 390px visual: DrillCheck reads as a calm body (warm pill receipt + flat chips/drawers), chips not touching the screen edge, no nested white panel.

---

## Deferred: T8 (label vocabulary) — founder-judgment / no silent flips

Per the 2026-06-22 steer, T8's standardizations are **not applied** in this plan: the audit (a working findings log, explicitly *subordinate* to `brand-ux-guidelines.md` and `docs/decisions.md`) flags them, but they map to ratified canon and intentional design. Each item's disposition:

| T8 item | Disposition | Why deferred |
|---|---|---|
| `Swap` (paused grid) vs `Swap drill` (active / Transition) | **Intentional — canon + pinned test** | `brand-ux-guidelines.md` §7.4/§7.5 (`D153`) document the width-adaptive labels; `RunControls.swap.test.tsx` pins the paused accessible name as exactly `Swap` ("not 'Swap drill'"). Flipping reverts a decision + breaks a pinned test. |
| `Shorten` (compact / paired pill) vs `Shorten block` (full-width outline) | **Intentional — canon** | §7.4/§7.5 (`D153`): compact label in the 4-cell paused grid and the paired Transition pill; full noun on the full-width outline button. Width-adaptive by design. |
| Run `Now` cue vs Transition `Cue` | **Intentional — semantic framing** | §7.4 canonizes the live `Now` cue. Transition is a *preview* labeled `Up next`; `Now` there would contradict (`Up next … Now`). The live-vs-preview split is meaningful, not drift. |
| Counter prefixes: Run bare `N/M`, Transition `Next:`, DrillCheck `Last:` | **Intentional — temporal framing** | §7.4 (bare `{index}/{total}`) + §7.5 (`Next: {index}/{total}`) + the DrillCheckScreen comment ("Last → Next … makes the run-flow rhythm feel intentional"). The prefixes encode temporal direction; bare = "you are here". Removing them removes meaning. |
| `Start next block` vs `Start next` | **No-op — already consistent** | No bare `Start next` exists in code; `Start next block` is the single canonical form (§1.4 good-example + §7.5). Nothing to standardize. |

**If the founder later wants true uniformity** (a separate, canon-touching change): pick the canonical full forms (`Swap drill` / `Shorten block` everywhere feasible, accepting 4-cell-grid width risk at 390px), decide the `Now`/`Cue` and counter-prefix direction, then update `brand-ux-guidelines.md` §7.4/§7.5, add a decision row in `docs/decisions.md`, and rewrite the pinned tests (`RunControls.swap.test.tsx`, run-face / counter tests) — all in one pass. That is out of scope here.

---

## Scope Boundaries

### In scope

- T7 surface-drift fixes on Settings secondary sections + PerDrillCapture, via a shared `SOFT_SURFACE_CLASS` token.

### Out of scope / Deferred to follow-up work

- **All T8 label flips** (deferred above — founder-judgment / canon-touching).
- Other audit themes T2–T6 and the em-dash bug (T1 already shipped under `2026-06-22-002`; the em-dash + quick-wins batch are tracked separately).
- The T3 decorative-SVG/separator removals beyond the PerDrillCapture panel (PainOverride triangle, heat flame, CarryForward dot, Review/Transition hairlines) — separate quick-wins batch.
- Any `Card` API expansion (polymorphic `as` / attribute forwarding): not needed — the token approach preserves the `<section>` semantics for free and matches the established `surfaces.ts` non-`Card`-consumer pattern.

---

## Verification

- `cd app && npx vitest run` — full suite green (`SettingsScreen.test.tsx`, `PerDrillCapture.test.tsx`, `DrillCheckScreen.*`, soft-`Card` consumers, `RunControls.swap.test.tsx` untouched and still green).
- `npx tsc --noEmit` + `npm run lint` (incl. the `volleycraft/*` drift-guardrail eslint rules) clean.
- `npm run diagnostics:report:check` stays current (markup/token-only proof — no generated-plan impact).
- `bash scripts/validate-agent-docs.sh` (this plan adds a docs file).
- 390px mobile pass: **Settings** (one elevated focal Export card + two borderless warm soft sections, nothing edge-flush) and **Drill check** (warm pill receipt + flat chips/drawers body, chips not edge-flush). Founder dogfood preference: screenshot each.
