---
id: design-critique-residuals-polish-2026-05-25
title: "Design-critique residuals polish — post 2026-05-25 e2e pass (2026-05-25)"
type: plan
status: active
stage: build
summary: "Editorial-class ship bundle for the residual findings surfaced by the 2026-05-25 independent e2e design critique pass — items not covered by the 2026-05-25-002 follow-ups. Three phases plus a small decisions step: (Phase 0) four reconciliation decisions; (Phase A) two EC code fixes (Settings card-heading size, duration-format unit); (Phase B) one shipped a11y fix (Drill Check h1) + one deferred a11y item (inline GlossedText tap targets); (Phase C) doc-only reconciliation of `brand-ux-guidelines.md` to shipped reality (h1 weight, onboarding header, Review h1, quiet-tertiary row, discard-resume carve-out, Complete recap row count). Revalidated 2026-05-25: build-slug shortening and cool-down phase/drill name doubling retracted as false alarms (the verbose dev slug is intended dev-only behavior; the wrap phase + drill sharing the name `Downshift` is intentional canonicalization). Does not unlock Tier 1b. Does not modify D86, D91, D125, D127, D129, D130, D132, D134, or D137. H1 / H2 durable keep / revert remain gated on the D91 field run."
authority: "Scope contract for the 2026-05-25 residual-polish ship. Complements `docs/plans/2026-05-25-002-feat-2026-05-24-design-critique-followups-plan.md` (which handled the 2026-05-24 critique items) by covering the additional drifts surfaced by an independent 2026-05-25 pass."
last_updated: 2026-05-25
depends_on:
  - docs/research/brand-ux-guidelines.md
  - docs/research/japanese-inspired-visual-direction.md
  - docs/research/outdoor-courtside-ui-brief.md
  - docs/design/reviews/2026-05-24-agent-e2e-design-critique.md
  - docs/plans/2026-05-25-002-feat-2026-05-24-design-critique-followups-plan.md
decision_refs:
  - D86
  - D91
  - D127
  - D130
  - D133
  - D134
  - D145
---

# Design-critique residuals polish

## Context

The 2026-05-24 e2e design critique (`docs/design/reviews/2026-05-24-agent-e2e-design-critique.md`) and its 2026-05-25 follow-up plan (`docs/plans/2026-05-25-002-feat-2026-05-24-design-critique-followups-plan.md`, items U1–U9) resolved M1 / M2 / M3, the L1 / L2 / L3 / L4 EC items, reconciled the run / review / wordmark canon rows, shipped H1 (72 px timer) and H2 (segmented-drill cue routing) experiments, and added axe coverage for selected / conditional warning states.

A fresh independent 2026-05-25 e2e pass against the dev server at the canon 390 × 844 viewport surfaced **residual drifts that the prior pair did not catch** — almost entirely small consistency items plus four decisions worth locking before either the canon or the code moves further. None are structural. None are safety-relevant. None modify the held experiments.

This plan ships those residuals.

**Verified-correct in the 2026-05-25 pass (defend, do not regress):** Complete focal discipline (36 px verdict, single intentional h2, `aria-live`); paused-state hierarchy (Resume primary, Shorten outline, End session danger-outline); Transition between-block surface; Safety answer-first copy with two-tap pain override; selected-chip soft treatment (peach `#fef3e8` + `text-accent-pressed` `#92400e`, ~6.5:1); the H1 72 px timer fits the 390 × 844 viewport without scroll; the contextual recency adaptation on "Repeat last session" (drops "First time" once the user has trained); all design tokens (`--color-warning-surface`, `--color-warning-strong`, `--color-accent-pressed`, etc.) resolve correctly when probed.

## Phase 0 — Decisions to lock first (blocking)

Four reconciliations. Each has a recommendation; pick one before Phase A/B/C ships, because each decision routes work between "fix code" and "update canon."

| # | Decision | Recommendation | Rationale |
| --- | --- | --- | --- |
| 0-a | **Onboarding Today's setup header**: left-align (per BX-9 / §7.2) or accept the centered prep header it inherits from `<SetupBody>`? | Accept centered, update §7.2 | The screen body is genuinely the Setup body; forking the header alignment in onboarding context adds component branching for a cosmetic gain. The onboarding Skill level step remains left-aligned. Doc reconciliation only. |
| 0-b | **Review h1 alignment**: left (ship) or centered (canon §7.6)? | Accept left, update §7.6 | Left reads correctly with the four left-aligned section cards below; centering would orphan the h1 above its card body. Doc reconciliation only. |
| 0-c | **Tertiary-action color**: keep the gray "quiet tertiary" tier or unify everything to the accent ghost in §2.3? | Document the gray tier, keep current | The gray tertiary is doing real focal-zone work — the one accent CTA per screen dominates because the secondary actions recede. BackButton stays accent. Doc reconciliation; add a `Quiet tertiary` row to §2.3 distinct from `Ghost button (tertiary)`. |
| 0-d | **Discard-resume confirm color**: keep neutral (text-primary + faint accent border) or move to the §2.3 danger-outline variant? | Keep neutral, add a §8.2 carve-out note | Discarding a paused session preserves progress to history; the resume capability is what's lost. Red would mis-signal "data loss." Document the exception so it isn't "fixed" later. |

Captured as `D145` in `docs/decisions.md` (2026-05-25) — a single row covering all four reconciliations, since they all flow from the same critique, target the same canon doc, and ship as a single doc-only Phase C PR. (0-c) and (0-d) each constrain a future design pass, so the explicit decision-row anchor is the move that prevents later "fixes" from quietly reverting them.

## Phase A — Editorial code sweep (EC)

One PR. No behavior change, no decision risk. Both items are purely visual / textual.

| # | Fix | File(s) | Notes |
| --- | --- | --- | --- |
| A1 | **Settings "Skill level" card heading: `text-sm` → `text-base` (16 px), weight unchanged.** Aligns with the sibling card headings ("Export training records", "About local storage"), which already render at 16 px / 600. Closes the one visible hierarchy wobble on the Settings screen. | `app/src/screens/SettingsScreen.tsx` | Single class swap. |
| A2 | **Duration unit format in Settings: `0:15 total` → `15 min total`.** The clock-format string violates `brand-ux-guidelines.md` §3.5 (the rest of the app uses `15 min`). | `app/src/screens/SettingsScreen.tsx` (or the storage-summary helper it consumes — `lib/` candidate; verify via grep before editing) | Verify the format helper isn't reused elsewhere with the clock format being intentional (e.g. exact-time displays). If shared, fork into a dedicated total-duration formatter that emits the `N min` form. |

**Test plan for Phase A.** Existing component tests cover the affected screens; spot-check `e2e/typography-visual-evidence.spec.ts` (typography drift guardrails should stay green) and the `SettingsScreen.test.tsx` suite. No new e2e specs needed.

### Retracted from Phase A (revalidation 2026-05-25)

Two items from the original 2026-05-25 critique draft were validated and dropped on a re-read. Recorded explicitly so a future pass doesn't re-surface them as fresh findings.

| # | Item | Retracted because |
| --- | --- | --- |
| ~~A3~~ | ~~Build slug shortening for non-dev builds~~ | Already shipped by **U2** in `docs/plans/2026-05-25-002-feat-2026-05-24-design-critique-followups-plan.md`. `app/src/lib/buildInfo.ts::formatBuildVersion(raw, mode)` produces the short form for `mode === 'prod'` and preserves the verbose `git describe` slug for `mode === 'dev'`; `SettingsScreen.tsx:281` passes `import.meta.env.DEV ? 'dev' : 'prod'`. The verbose slug observed on the dev server during the 2026-05-25 pass was the **intended dev-only behavior** for founder triage-by-hand, not a leak. The Cloudflare Worker production deploy already renders the short form. No code change needed. |
| ~~A4~~ | ~~Cool-down phase / drill-name doubling (`Downshift` / `Downshift`)~~ | Intentional canonicalization, not redundant doubling. `app/src/data/drills.ts:2085` defines `d25` with `name: 'Downshift'`, and `app/src/domain/drillMetadata.ts:56` records the design intent explicitly: "the eyebrow stays just `Warm up` / `Downshift`." The wrap phase has a single canonical drill that shares the phase's canonical word; the warm-up differs because it has variety in drill content (`Beach Prep Three` is one of several warm-up drill identities). Renaming the drill (e.g. to `Cool-down flow`) would damage a deliberate phase ↔ drill correspondence, not fix a redundancy. |

## Phase B — Accessibility + structural

Separate PR from Phase A so a screen-reader-behavior surprise can be reverted independently. **B1 ships in this plan; B2 is deferred** (rationale below).

| # | Fix | File(s) | Notes |
| --- | --- | --- | --- |
| B1 | **Drill Check: add an `h1`.** Today the screen has no `h1` — `Drill check` is a `<span class="text-sm font-medium text-text-secondary">` eyebrow and the only heading is the `<h2>` `How was…?`. Run / Transition / Review all use `h1` for the drill name, so the between-block screens are inconsistent and a screen-reader heading jump on Drill Check lands on an orphan h2. Add a visually-hidden `h1` (`sr-only`) carrying `Drill check · {drill name}` (or similar) so the outline mirrors Review without changing the visual focal hierarchy. | `app/src/screens/DrillCheckScreen.tsx` | Lowest-risk variant. Promoting the eyebrow to a visible `h1` would change the focal zone (currently the capture question is the focal target) — defer that to a dedicated polish pass if desired. Extend `e2e/accessibility.spec.ts` to scan Drill Check's heading outline. |

**Test plan for Phase B.** Extend `e2e/accessibility.spec.ts` with a Drill Check heading-outline scan to guard the new fix from regression.

### Deferred: B2 inline `GlossedText` tap targets (revalidation 2026-05-25)

Inline glossary buttons (`A-skip`, `ankle hops`, `lateral shuffles`, `pivot-back starts`) currently render as 29 px-tall `<button>` elements inside the run-cue paragraph — below the 44 px WCAG / outdoor-brief floor (§4.5). This is a real target-size violation. **Deferred rather than retracted because:**

- **Low user impact.** Glossed terms are *enhancement* affordances — tapping reveals a definition that's supplementary, not load-bearing. A missed tap doesn't break the run.
- **Layout risk.** Vertical padding inside running text risks distorting the cue paragraph line-box on the active-run surface, which *is* a load-bearing read (the cue is the live coaching line). Padding has to be calibrated carefully against the existing line-height; the safer fix probably needs a small CSS-grid or inline-block hit-extension rather than raw `py-*`.
- **Better paired with H2.** The H2 active-run-body density experiment is held under D127 / D91 and may further restructure the cue paragraph. A glossed-term tap-target fix sitting on top of a possibly-changing paragraph layout invites rework. Defer until the H2 keep/tune/revert decision lands at the D91 field run, then revisit with that layout fixed.

Re-activation trigger: D91 field-run testers report missed taps on glossed terms, **or** the H2 active-run-body experiment lands a durable keep/tune decision (whichever is sooner).

## Phase C — Canon reconciliation (doc-only)

One commit to `docs/research/brand-ux-guidelines.md`. Ships after Phase 0 decisions land. Zero code change.

| # | Update | Section | Source of truth |
| --- | --- | --- | --- |
| C1 | **h1 weight: prep-screen h1 = 700 → 600 (semibold), unified app-wide.** Every h1 measured in the 2026-05-25 pass — onboarding Skill level, Today's setup (centered prep variant), Setup, Settings, Settings-skill-level, Run, Transition, Review — ships at `font-semibold` (600). The 2026-05-25-002 U8 row reconciled run / review / wordmark to 600 but left the §1.2 `Display — prep screen h1` row and the §7.3 `text-xl font-bold tracking-tight` claim at 700. App is self-consistent at 600; canon should follow. | §1.2 type scale + §7.3 prep posture | Shipped code (verified across 7 screens via `getComputedStyle`). |
| C2 | **Onboarding Today's setup: header inherits the prep posture** (centered h1 + Back button) while Skill level stays left-aligned. | §7.2 onboarding | Decision 0-a. Note the asymmetry explicitly so the next pass doesn't "fix" Today's setup to left-aligned. |
| C3 | **Review h1: left-aligned, not centered.** | §7.6 review posture | Decision 0-b. |
| C4 | **Add `Quiet tertiary` row to §2.3.** Distinct from the existing `Ghost button (tertiary)` row (which stays at `text-accent` and continues to govern the `BackButton`). Members: `Finish later` (Review), `Start a different session` (Home), `Settings` link (Home), `Change` (Settings → skill level surfacing), `Change setup` (Home draft). Default: `text-text-secondary` on `bg-transparent`, `min-h-[44px]`, no border. Pressed: `text-text-primary`. | §2.3 color-role table | Decision 0-c. |
| C5 | **Discard-resume confirm: neutral carve-out.** Document why `Yes, discard session` in `ResumePrompt` is `text-text-primary` + faint accent border, not the `border-warning text-warning-strong` danger-outline variant the general §8.2 rule implies. Reason: progress is preserved to history; only resume capability is lost. | §8.2 confirmations | Decision 0-d. |
| C6 | **Complete recap: 4 rows → 5 rows (adds `Difficulty`).** The Difficulty aggregate row arrived with D133 / D134 per-drill captures; canon §7.7 still describes a 4-row definition list. Doc-only catch-up. | §7.7 complete posture | Already shipped; canon hasn't caught up. |

**Test plan for Phase C.** `bash scripts/validate-agent-docs.sh` (per `AGENTS.md` verification hints). No app tests touched.

## Explicitly out of scope

These are held by their own gating context and **must not** be touched in this plan:

- **H1 durable keep / tune-further / revert (BlockTimer at 72 px bench-distance).** Gated on the D91 field run; current shipped value stays.
- **H2 durable keep / revert (segmented-drill active-run body density).** Gated on the D91 field run. The dense layout for warm-up / cool-down segmented blocks is re-confirmed present in the 2026-05-25 pass and remains held under D127.
- **Tier 1b unlocks of any kind.** This plan does not modify D130 founder-use mode.
- **Schema / persistence / routing changes.** This plan touches only screens, components, drill-catalog names, build-info plumbing, and one doc.
- **Unselected-chip text-color reconciliation.** Shipped unselected chips render `text-text-secondary` (#4b5563, ~7.5:1) where §2.3's "Unselected chip" row claims `text-text-primary`. Consistent app-wide and AA-passing; deferred to a future canon pass (not in scope here to avoid scope creep on Phase C).

## Suggested PR shape

Three small PRs, each independently revertable:

1. **PR 1 — Phase A**: `polish: editorial sweep (settings card heading, duration unit)`.
2. **PR 2 — Phase B**: `a11y: drill-check h1`.
3. **PR 3 — Phase C**: `docs: reconcile brand-ux-guidelines.md to shipped 2026-05-25 reality`.

`D145` (the Phase 0 decision row) already landed in `docs/decisions.md` ahead of these PRs.

## Authorities not modified

- `D86` regulatory-posture safety copy — untouched.
- `D91` retention / field-run gate — untouched; remains the durable authority on H1 / H2.
- `D125` rename scope — untouched (Volleycraft naming and the `volley-drills` DB name stay as-is).
- `D127` body-scale shift / Run content density deferral — untouched.
- `D129` answer-first safety consequence copy — untouched.
- `D130` founder-use mode — untouched; does not unlock Tier 1b.
- `D132` (related design / scope) — untouched.
- `D133` / `D134` per-drill capture and streak metric capture — referenced (Complete recap row), behaviour untouched.
- `D137` `/tune-today` retirement — untouched.
