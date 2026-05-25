---
id: 2026-05-24-agent-e2e-design-critique
title: "Volleycraft v0b — Full e2e design critique (2026-05-24)"
status: active
stage: validation
type: design-review
summary: "Agent-driven, screen-by-screen e2e design critique of the v0b Starter Loop run against the production build (vite preview), evaluated against brand-ux-guidelines.md, outdoor-courtside-ui-brief.md, japanese-inspired-visual-direction.md, and courtside-copy.mdc, plus a hand + axe-core WCAG 2.1 AA pass. Confirms the loop is calm, accessible, and on-voice; surfaces one real contrast defect (selected warning chips), two deferred outdoor-readability gaps (timer size, active-run density), and a cluster of canon-vs-code drift where brand-ux-guidelines.md is now stale relative to shipped code."
authority: "Point-in-time design baseline. Not source of truth on its own. Cites brand-ux-guidelines.md, outdoor-courtside-ui-brief.md, japanese-inspired-visual-direction.md, and courtside-copy.mdc as the governing contracts."
last_updated: 2026-05-24
depends_on:
  - docs/research/brand-ux-guidelines.md
  - docs/research/outdoor-courtside-ui-brief.md
  - docs/research/japanese-inspired-visual-direction.md
  - .cursor/rules/courtside-copy.mdc
related:
  - docs/design/reviews/2026-04-26-agent-ux-review.md
  - docs/ideation/2026-05-04-setup-screen-default-path-polish-ideation.md
  - docs/reviews/2026-05-01-generated-plan-diagnostics-report.md
decision_refs:
  - D86
  - D91
  - D125
  - D127
  - D129
  - D130
  - D132
  - D134
  - D137
---

# Volleycraft v0b — Full e2e design critique (2026-05-24)

## Method

- **Build under test**: v0b Starter Loop, `app/` workspace, **production build** served by `vite preview` on `http://127.0.0.1:4173` (the Playwright target — service worker registered, self-hosted fonts, real PWA behavior). This is a stricter mirror than the dev server.
- **Viewport**: 390 × 844 CSS px (the canon iPhone-class canvas, `brand-ux-guidelines.md` §4.1).
- **Tooling**: full flow driven and screenshotted with Playwright (headless Chromium); element styles/contrast verified by reading source tokens and computing ratios by hand; WCAG scanned with `@axe-core/playwright` (the repo's `e2e/accessibility.spec.ts`, **8/8 pass**).
- **Coverage** (20 screenshots, `./2026-05-24-agent-e2e-design-critique-screenshots/`): onboarding skill-level → today's setup (default / net-no reveal / filled) → safety (default / pain-override / ready) → run (pre-roll / active / paused) → drill-check → transition → review (empty / filled) → complete → home (returning / draft) → settings → settings skill-level → review recovery.
- **Evaluation rubric**:
  1. **Outdoor-first legibility** — `outdoor-courtside-ui-brief.md` floor (off-white surface, near-black text, ≥ 16 px body, 56–64 px arm's-length timer / 72–88 px bench, WCAG AA).
  2. **One focal zone per screen** — `japanese-inspired-visual-direction.md` `tokonoma` rule.
  3. ***Ma*** and **shibui** — restraint that clarifies hierarchy; one accent used deliberately.
  4. **Thumb-zone & affordance** — primary action low and tappable; tappable things look tappable.
  5. **Copy invariants** — `.cursor/rules/courtside-copy.mdc` and `brand-ux-guidelines.md` §3.
  6. **Canon conformance** — `brand-ux-guidelines.md` type scale (§1.2), color-role table (§2.3), per-screen posture (§7).
- **Scope**: heuristic + flow + content + contrast review at fixed-viewport simulation on the production build. **Not a real-device test** — no Dynamic Type, no direct sun, no sunglasses, no sand/sweat, no PWA install path. Distance-readability claims remain gated on the `D91` field run.

## What is genuinely strong (defend these)

1. **Complete screen is the best surface in the app.** One dominant verdict word (`Keep building`, `text-4xl`/700), generous `Ma`, a quiet green "Saved in this browser on this device" line. Textbook focal zone and a clean *jo-ha-kyu* finish. (`15-complete.png`)
2. **Paused-run state is exactly right** (`10-run-paused.png`): big `PAUSED` marker (the one sanctioned uppercase indicator per `brand-ux-guidelines.md` BX-4), `Resume` primary, `Shorten` + a red `End session` — the destructive action correctly demoted and color-coded.
3. **Accessibility plumbing is clean.** axe-core passes on every scanned screen: labeled `radiogroup`s, real `role="radio"` / `aria-checked`, sane heading outlines, `aria-live` verdict, disabled-button helper text ("Rate your effort above to submit."). The deliberate single-`<h2>` Complete screen is explicitly covered and passes.
4. **Safety flow is answer-first and honest** (`06-safety-pain-yes.png`): "We lower the load, not the time. Your pick." Two-tap override, no dark patterns, `D86`/`D129` consequence wording intact.
5. **Between-block surfaces carry full instructions in the right place** (`12-transition.png`): prev-block confirmation, `Up next · Technique · Pass` eyebrow (sentence case, `·` separators), full instructions + cue aside, `Start next block` + `Swap drill` + `Shorten`. Detail lives in prep, not mid-rep — aligned with the outdoor brief.
6. **Touch targets clear the floor** everywhere measured (onboarding cards 78 px, chips 54 px, back button 44 px box).
7. **Voice holds.** No streaks, badges, hype, or emoji-in-chrome anywhere in the loop. Reads as a well-kept notebook.

## Resolution update (2026-05-24, same day)

The selected-warning-tone AA failure (**M1**, and its sibling **M2**) was fixed the same day this review landed, and the fix was extended to the whole `text-warning`-on-`warning-surface` class once the audit confirmed it was systemic:

- New token `--color-warning-strong` (`#b91c1c`, ~5.3:1 on `warning-surface`) in `src/index.css`; base `--color-warning` (`#dc2626`) retained for borders/icons (3:1 component rule).
- Wired into: selected warning chips (`ToggleChip`), the `Button` **danger** variant (so every `ConfirmModal` destructive action + `ResumePrompt` discard), warning `Callout` bodies (so `StatusMessage` error + heat tips), the heat "Stop immediately" heading, and `PainOverrideCard`'s override-confirm button + consequence copy.
- **axe coverage added** for the previously-unscanned states (`e2e/accessibility.spec.ts`): selected warning chip, pain override-confirm, heat-tips expanded, and the end-session confirm modal — all green.
- Canon updated: `brand-ux-guidelines.md` §2.1/§2.2/§2.3 now document `--color-warning-strong`.

M1/M2 below are left in place as the as-of-audit record; their **Class** column is annotated **✅ Resolved**.

## Findings, classified

Classification follows the established `2026-04-26-agent-ux-review.md` taxonomy:

- **EC** — editorial-class: copy / token / small visual fix. Ships in-tier; no Tier 1b unlock.
- **T1B** — founder-session-trigger-gated Tier 1b (held per `D130`).
- **D91-FIELD** — needs real-device sunlight evidence (held by the `D91` field run).
- **DECISION** — needs a product/voice decision before it can ship.
- **DOC** — canon (`brand-ux-guidelines.md`) is stale vs shipped code; reconcile doc (or code).

### High

| # | Finding | Class | Notes |
| --- | --- | --- | --- |
| H1 | **Run timer is sized for the sub-mode, not the design center.** Live timer is `56px` (`components/BlockTimer.tsx`), the arm's-length floor. The outdoor brief names **bench-at-1–3 m** as the design *center*, which wants **72–88 px** timer digits. The app optimizes for solo arm's-length, not the stated primary posture. | D91-FIELD / T1B | Already scaffolded: `--text-body` retune + distance-mode are deferred under `D127`. Highest-leverage outdoor readability decision; resolve with `D91` evidence. |
| H2 | **Active-run body is text-dense for a sun-readable screen.** During a live block the body shows drill title + intro paragraph + a multi-item `SegmentList` (four full sentences, each with a duration) + a "Show more cues" expander (`src/screens/RunScreen.tsx:184`). The outdoor brief lists "long instruction lists" under *defer/hide during active run*. | D91-FIELD | Acknowledged-deferred under `D127`. The segment choreography is legitimate content; confirm glance-load with real-sun evidence before widening. |

### Medium

| # | Finding | Class | Notes |
| --- | --- | --- | --- |
| M1 | **Selected `warning`-tone chips fail AA contrast.** `text-warning` (#dc2626) on `bg-warning-surface` (#fee2e2) ≈ **3.95:1** at 14 px (`src/components/ui/ToggleChip.tsx:42`), below the 4.5:1 floor. Affects pain **Yes**, the **Today** recency chip, and incomplete-reason chips **when selected**. axe never catches it because it scans the *unselected* default. | EC · ✅ Resolved 2026-05-24 | Fixed via `--color-warning-strong` (~5.3:1); extended to the whole warning-on-surface class (see Resolution update above). `success` selected (5.0:1) and `accent` selected (4.6:1) verified passing. |
| M2 | **Pain "Yes" selected state is not clearly visible** (`06-safety-pain-yes.png`): the override card renders but the "Yes" chip doesn't obviously read as selected. Likely the same faint warning-selected treatment as M1. Currently the override card does all the "you chose Yes" work. | EC · ✅ Resolved 2026-05-24 | The darker `warning-strong` selected text materially raises the selected "Yes" chip's legibility. Distance/real-device read still worth a glance on the `D91` run. |
| M3 | **Selected chips diverge from the canon color-role table.** `brand-ux-guidelines.md` §2.3 specifies selected chip = solid `bg-accent text-white`; shipped is peach fill + amber text/border (`bg-info-surface text-accent`, ≈ 4.59:1 — passes AA, but barely). The accent case *is* legible (`14-review-filled.png`, "Right"). | DOC / DECISION | **Note**: "stronger selected-chip states" were explicitly **rejected** in `docs/ideation/2026-05-04-setup-screen-default-path-polish-ideation.md`. So this is a *doc-reconciliation*, not a redesign: update §2.3 to match the shipped soft-selected treatment. Do **not** revert to solid-accent without revisiting that ideation. |

### Low

| # | Finding | Class | Notes |
| --- | --- | --- | --- |
| L1 | **Inconsistent forward-CTA emphasis between adjacent between-block screens.** Transition's `Start next block` is solid-accent primary; Drill-check's `Continue` is a low-emphasis/outline button (`11-run-check.png` vs `12-transition.png`). | EC / DECISION | If both are the proceed action, match them. If Drill-check intentionally demotes `Continue` to keep focus on the capture chips, document that intent. |
| L2 | **ASCII hyphen used as a dash in user copy.** "We'll size a light starter **-** you can change this after." (`src/screens/SkillLevelScreen.tsx:159`, via `SkillLevelPicker unsureSubtext`). `brand-ux-guidelines.md` §3.2 wants an em dash `—`. Only user-facing instance found. | EC | One-character fix. |
| L3 | **Verbose internal build slug shown to end users** in the Settings footer (`20-settings.png`): "Build m001-validation-week5-catchup-2026-05-23-1-gbc6831d · 2026-05-24". Useful for dogfood; reads as a leak to a stranger cohort. | EC | Shorten to `Build {sha-short} · {date}` for non-dev builds (keeps `D91` field-run telemetry-by-hand). |
| L4 | **Minor polish.** "Export training records" is both the card heading and the button label (redundant, `20-settings.png`); the "2+ days ago" recency chip wraps to two lines (`05-safety-default.png`). | EC | Rename the export button (e.g. `Export` / `Download JSON`); allow the recency chip a touch more width or a shorter label. |

## Canon-vs-code drift (DOC)

The implementation has quietly moved past `brand-ux-guidelines.md` in several places. Per `AGENTS.md`, a change that contradicts the canon should update the canon (or be reconciled). None of these are bugs — most are improvements — but the canon should be brought into lockstep so future passes don't "fix" the code back to a stale spec.

| Area | Canon says | Code ships | Pointer |
| --- | --- | --- | --- |
| Run / Review h1 | `text-2xl` / 700 (§1.2, §7.4, §7.6) | `text-xl` / `font-semibold` | `src/screens/RunScreen.tsx:186`, `src/screens/ReviewScreen.tsx:89` |
| Home wordmark | `text-lg` / 700 (§1.2, §7.1) | `text-xl` / `font-semibold` | `src/screens/HomeScreen.tsx:346` |
| Onboarding "Not sure yet" | tertiary underline link (§7.2) | full focal card (**field-validated** — a tester missed the link) | `src/screens/SkillLevelScreen.tsx:145-156` — keep code, update canon |
| RPE input | "0–10 chip grid" (README / §7.6) | 3-way `Easy / Right / Hard` (better for courtside) | `src/components/RpeSelector.tsx` |
| Selected chip | solid `bg-accent text-white` (§2.3) | soft `bg-info-surface text-accent` | see M3 (reconcile, do not revert) |
| Complete CTA | `Done` (§7.7) | `Back to home` (names the destination — walkthrough P1-2) | `src/screens/CompleteScreen.tsx:427` |
| Review submit | `Submit review` (§7.6) | `Done` | `src/screens/ReviewScreen.tsx:211` |
| Complete solo eyebrow | present (§7.7) | omitted on solo (intentional `Ma`; pair keeps it) | `src/screens/CompleteScreen.tsx:284` |

**Recommendation**: a single editorial pass over `brand-ux-guidelines.md` §1.2 / §2.3 / §7 to record the shipped type scale, the soft-selected chip, the 3-way RPE, and the verdict/CTA copy. This is doc-only and does not touch the source-of-truth decisions.

## Accessibility (WCAG 2.1 AA)

- **axe-core: 8/8 pass** (onboarding, home, setup, safety, run active, run paused, error, complete). Clean roles, names, labels, focus order, and contrast on every scanned default state.
- **Closed (was an untested gap)**: the axe spec previously scanned only *unselected* defaults, so the selected-warning-chip failure (M1) was never exercised. `e2e/accessibility.spec.ts` now adds four scans of *selected* and *conditional* warning states — selected warning chip, pain override-confirm, heat-tips expanded, end-session confirm modal — all passing. The regression class is now guarded.
- **Heading outline**: the solo Complete screen is a deliberate single-`<h2>` page (verdict word, `aria-live`). axe does not flag it; this is valid and intentional — do not "fix" by re-adding the solo eyebrow.
- **Touch targets**: pass throughout.

## What this review does NOT do

- **Does not unlock Tier 1b** or expand scope; H1/H2/T1B items stay held per `D127` / `D130`.
- **Does not modify** `D86`, `D91`, `D125`, `D127`, `D129`, `D130`, `D132`.
- **Does not edit** the canonical design docs. The DOC-class drift above is a *recommendation*; reconciling `brand-ux-guidelines.md` is a follow-up doc-only pass.
- **Does not propose** schema, persistence, routing, or drill-record changes.
- **Does not supersede** `2026-04-26-agent-ux-review.md`; it is a later, production-build baseline. Several 2026-04-26 editorial items (3-way RPE, hairline divider, `Done` hierarchy, eviction-copy move to Settings) are re-confirmed shipped here.

## Screenshot index

`docs/design/reviews/2026-05-24-agent-e2e-design-critique-screenshots/`, named in flow order:

| File | Surface |
| --- | --- |
| `01-onboarding-skill-level.png` | Skill level (first-open, solo voice) |
| `02-todays-setup-default.png` | Today's setup (default) |
| `03-todays-setup-net-no.png` | Today's setup (net = No reveals wall/fence) |
| `04-todays-setup-filled.png` | Today's setup (filled; disabled Build) |
| `05-safety-default.png` | Safety (empty) |
| `06-safety-pain-yes.png` | Safety (pain = Yes → lighter-session override) |
| `07-safety-ready.png` | Safety (answered; Start session enabled) |
| `08-run-preroll.png` | Run (3-2-1 pre-roll count-in) |
| `09-run-active.png` | Run (live timer, Pause / Next) |
| `10-run-paused.png` | Run (paused → Resume / Shorten / End session) |
| `11-run-check.png` | Drill check (per-drill capture) |
| `12-transition.png` | Transition (between blocks) |
| `13-review-empty.png` | Review (empty; disabled Done + helper) |
| `14-review-filled.png` | Review (RPE selected; Done enabled) |
| `15-complete.png` | Complete (verdict + recap) |
| `16-home-returning.png` | Home (returning; Repeat last session) |
| `20-settings.png` | Settings (export + about local storage) |
| `21-settings-skill-level.png` | Settings → skill level (Current badge) |
| `22-review-recovery.png` | Review recovery (`/review` with no session) |
| `24-home-draft.png` | Home (draft; Continue / Change setup) |

## Where this lives

- This review: `docs/design/reviews/2026-05-24-agent-e2e-design-critique.md`.
- Screenshots: `docs/design/reviews/2026-05-24-agent-e2e-design-critique-screenshots/` (20 files, flow order).
- Discovery hub: `docs/design/README.md` (Reviews table).
- Catalog registration: `docs/catalog.json` `docs[]`.
