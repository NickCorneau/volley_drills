---
id: 2026-05-25-004-fix-audit-residual-gaps-plan
title: Audit residual gaps — items no other plan covers
status: active
stage: validation
type: fix
summary: "Closes the findings from the 2026-05-24 multi-skill audit + 2026-05-25 ux-copy review that are NOT covered by plan 2026-05-25-001 (audit-doc reconciliation) or plan 2026-05-25-002 (e2e critique follow-ups). Four units: U1 ships now (founder-mode copy leaks C1/C3), U2 ships now (document the Button-vs-Card `soft` naming collision), U3/U4 are trigger-anchored post-M001 (A3 residual non-CSS-var brand sites; A4 touch-target scale + CenteredHeader extraction). A7 (3+ player gap, thin solo/set evidence) is explicitly NOT a code fix — it is a sequencing input for the 2026-07-20 D130 re-eval per D124."
authority: plan-level implementation decisions for audit/review findings uncovered by plans 001 and 002
date: 2026-05-25
last_updated: 2026-05-25
depends_on:
  - docs/reviews/2026-05-24-multi-skill-app-audit.md
  - docs/plans/2026-05-25-001-fix-multi-skill-audit-mechanical-fixes-plan.md
  - docs/plans/2026-05-25-002-feat-2026-05-24-design-critique-followups-plan.md
  - .cursor/rules/courtside-copy.mdc
origin: docs/reviews/2026-05-24-multi-skill-app-audit.md
---

# Audit residual gaps — items no other plan covers

## Summary

Plans `2026-05-25-001` (audit-doc reconciliation, doc-only) and `2026-05-25-002` (e2e critique follow-ups: L1/L3/L4/M1/M2/L2 + canon + H1/H2) already cover most of the 2026-05-24 audit and the 2026-05-25 ux-copy review, and the bulk is shipped on `main`. This plan closes only the residue neither plan touches.

## What is already done / planned (do NOT re-do)

- **Shipped on `main`**: A1 (Expander), A2 (radius tokens), A5 (copy hyphen), A6 (warning-chip AA + accent chip), n1 (axe select-then-scan), L1, L3, L4a, L4b, H1, H2, canon reconciliation (U8), A3-Brandmark tokenization.
- **Planned, doc-only**: audit-doc coherence (plan 001 U1–U4); canon drift rows (plan 002 U8, shipped).

## Units

### U1 — Copy: remove the last founder-mode leaks  ·  ship now  ·  trivial
- **C1** `app/src/screens/SettingsScreen.tsx:121` — export-failure error reads "…**let the founder know**", insider voice for a stranger cohort. Change to a generic what+fix message. No test asserts the string (verified).
- **C3** `app/src/screens/SettingsScreen.tsx:223` — body says "Use **Export training records** above…" but the button is now just "Export". Align the reference to the button label.
- **Verify**: `npm run typecheck && npm test && npm run lint`.

### U2 — Design-system: name the `soft` collision  ·  ship now  ·  trivial, doc-only
- `soft` means two different things: a Button variant (warm **filled button**) and a Card variant (warm **surface**). Add a clarifying doc-comment to both `Button.tsx` and `Card.tsx`.
- **No rename** — `Card`'s default variant is `soft`, so every implicit-default call site relies on the name; renaming is a back-compat hazard for zero user-visible benefit.

### U3 — A3 residual: single source for the brand orange  ·  post-M001 / on brand-color change  ·  low
- `Brandmark.tsx` now reads `--color-brand`, but 5 sites still hardcode `#E8732A` and **cannot** consume a CSS var: `vite.config.ts` (`theme_color`), `index.html` + `public/offline.html` (`<meta name="theme-color">`), `public/icon.svg`, `public/icon-maskable.svg`.
- Lowest-cost reconciliation: a shared `app/src/lib/brand.ts` constant imported by `vite.config.ts`; the static HTML/SVG files get a `keep in sync with --color-brand` comment. Full build-time substitution is over-engineering for a color that changes ~never.
- **Trigger**: next brand-color change, or pre-stranger-cohort polish.

### U4 — A4 touch-target scale + CenteredHeader  ·  post-M001 / Tier 2 polish  ·  low-med
- Introduce a named touch-target scale (`--tap-min` 44 / `--tap-default` 54 / `--tap-primary` 56, plus the two outliers 48 sm-chip, 64 skill-card), sweep the `min-h-[Npx]` arbitraries, update `ToggleChip`/`Disclosure` test assertions, and reconcile the `app/README.md` "54–60px" claim to reality.
- Extract the repeated invisible-spacer centered header (`ReviewScreen.tsx:90`, `CompleteScreen.tsx:289`) into a `CenteredHeader` pattern.
- **Trigger**: bundle with plan 002's Tier-2 polish / the README-standard decision.

## Out of scope (not a code fix)

- **A7** — 2 of 3 M001 validation conditions have near-zero direct evidence (solo 1/7, set 0/3); the 3+ player content gap is the dominant product signal. This is a **sequencing input for the 2026-07-20 D130 re-eval** (`D101` earlier vs `M002` first), owned by `founder-use-ledger.md` per `D124`. Not actionable as code.
- **C4** ("Continue" overloaded), **C5** (terse empty states), **C6** (chip abbreviations), Button loading-state spinner — intentional restraint / deliberate text-swap CTA pattern ("Saving…", "Building…"). Won't-fix unless field evidence says otherwise.

## Operational notes

- Single-branch flow per `AGENTS.md`: commit to `main`, push to `origin`.
- A concurrent pipeline was committing+pushing during this plan's authoring; U1/U2 commits must stage only their own files to avoid sweeping in-flight work.
