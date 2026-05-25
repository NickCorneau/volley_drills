---
id: 2026-05-24-multi-skill-app-audit
title: "Volleycraft v0b — Multi-skill app audit (design system, a11y, critique, copy, handoff, research)"
status: active
stage: validation
type: review
summary: "Consolidated, agent-driven audit of the running v0b Starter Loop and its code/docs/design, applying seven design + research skills (design-system, accessibility-review, design-critique, ux-copy, design-handoff, user-research, research-synthesis). Net-new findings over the same-day 2026-05-24-agent-e2e-design-critique: one real React correctness bug (Expander setState-in-render), design-system token drift (dead radius tokens, brand color not tokenized, touch-target sprawl), a copy-fix conflict with canon, an as-built primitive handoff spec, and a research-method + synthesis read of the founder-use validation."
authority: "Point-in-time review. Not source of truth on its own. Cites docs/design/reviews/2026-05-24-agent-e2e-design-critique.md (design + WCAG), .cursor/rules/courtside-copy.mdc (copy), docs/research/founder-use-ledger.md (validation), and the app/src primitives as governing references."
last_updated: 2026-05-25
depends_on:
  - docs/design/reviews/2026-05-24-agent-e2e-design-critique.md
  - .cursor/rules/courtside-copy.mdc
  - docs/research/brand-ux-guidelines.md
  - docs/research/founder-use-ledger.md
  - docs/research/d91-retention-gate-evidence.md
related:
  - docs/design/reviews/2026-04-26-agent-ux-review.md
  - docs/research/2026-05-22-mid-session-extend-and-content-asks-feedback.md
decision_refs:
  - D86
  - D91
  - D101
  - D124
  - D127
  - D130
  - D132
  - D135
---

# Volleycraft v0b — Multi-skill app audit (2026-05-24)

## Method

- **What was run**: the v0b Starter Loop, `app/` workspace, served by the `volleycraft` dev config (Vite, WSL host) and inspected live, plus a code/docs/design read.
- **Skills applied** (7): `design-system`, `accessibility-review`, `design-critique`, `ux-copy`, `design-handoff`, `user-research`, `research-synthesis`.
- **Live tooling**: accessibility-tree snapshots, computed-style inspection, console capture, and JS eval against the running app. **Screenshots timed out** in this environment (WSL→Windows preview), so visual claims lean on the a11y tree, computed styles, and source — and on the screenshot set already captured in `docs/design/reviews/2026-05-24-agent-e2e-design-critique-screenshots/`.
- **Relationship to the same-day e2e critique**: `docs/design/reviews/2026-05-24-agent-e2e-design-critique.md` already did a thorough screen-by-screen design + WCAG pass on the **production** build. This audit does **not** repeat it. The `design-critique` and `accessibility-review` sections below confirm its load-bearing findings and add only what it did not cover; the real net-new value is in `design-system`, the Expander bug, the copy-fix reconciliation, the handoff spec, and the two research sections.

## Top findings — ranked by leverage

Ordered by **leverage = value × fix clarity** (cleanest, highest-impact first), not by raw severity. A high-severity finding with a sprawling or decision-blocked fix ranks below a medium-severity one with a clean, confident fix. Status: ✅ shipped this pass · ⬜ open · 🔭 strategic (separate track, not a quick fix). The **Trigger** column anchors each open recommendation to a milestone, gate, or condition under D124/D127/D130 founder-use mode — `n/a (shipped)` for closed rows, an explicit "post-M001" or condition string otherwise. IDs are stable: A1–A7 for net-new audit findings; `n1`/`n2` for accessibility findings that complement the e2e critique. All match the per-skill sections below.

| # | ID | Finding | Value × Fix → leverage | Status | Trigger | Pointer |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | A1 | **`Expander` setState-in-render** — `onOpenChange` ran inside the `setOpen` updater, mutating `SafetyCheckScreen` during render; spammed a React console error on every Safety open. | High value · trivial fix (one function) → **top** | ✅ Done | n/a (shipped) | `app/src/components/ui/Expander.tsx:50-56` |
| 2 | A6 | **Selected `warning` chips failed AA** (#dc2626 on #fee2e2 ≈ 3.95:1) — pain **Yes**, **Today**, incomplete-reason chips when selected. | High value (AA) · trivial fix (1 token + 1 line) | ✅ Done | n/a (shipped) | `app/src/components/ui/ToggleChip.tsx:42` |
| 3 | n1 | **axe scans only the *unselected* chip state**, so the A6 contrast class is never exercised in CI — add a "select-then-scan" assertion to lock the fix. | Med-high value (regression guard) · trivial fix (1 test) → **top remaining** | ⬜ Open | M001 in-flight (CI guard for A6) | `app/e2e/accessibility.spec.ts` |
| 4 | A2 | **Radius tokens are dead.** `--radius-card` / `--radius-button` are referenced **zero** times; ~25 source call-sites hardcode 5 distinct radius arbitraries (`[12px]`, `[16px]`, `[14px]`, `[8px]`, `[2px]`). | Med value · clean mechanical sweep + 1 decision (wire or delete) | ⬜ Open | Post-M001; folds into design-system polish track if D101 fires earlier | `app/src/index.css:115-116` |
| 5 | A3 | **Brand color untokenized at 6 sites in `app/`.** `Brandmark.tsx`, `vite.config.ts` (PWA `theme_color`), `index.html`/`offline.html` (`<meta>`), and two SVG icons all hardcode `#E8732A`; the accent token is `#b45309`. Only `Brandmark.tsx` can consume a CSS variable directly — the other 5 are HTML/SVG/manifest contexts. | Med value · 1 design decision (which orange) + build-pipeline or hand-edit cost on 5 of 6 sites | ⬜ Open | Post-M001; bundle with A2 if both fire | 6 sites; see §1 token coverage |
| 6 | A5 | **ASCII hyphen as a sentence dash** in onboarding copy; the e2e critique's em-dash fix would itself violate `courtside-copy.mdc` rule 4. Correct fix is a period (the override also duplicated the already-correct default). | Low value · trivial fix | ✅ Done | n/a (shipped) | `app/src/screens/SkillLevelScreen.tsx:159` |
| 7 | A4 | **Touch-target sizes sprawl** across 44 / 48 / 54 / 56 / 64 px as arbitrary `min-h-[Npx]`, no scale — and the README claims a "54–60 px" standard. | Low-med value · medium sweep (add scale + migrate) | ⬜ Open | Post-M001; gated on README 54–60 px standard arbitration | `Button.tsx`, `ToggleChip.tsx`, `BackButton.tsx`, `SkillLevelPicker.tsx` |
| 8 | A7 | **2 of 3 M001 validation conditions have near-zero direct evidence** (solo 1/7, set focus 0/3); the dominant product signal is the **3+ player content gap** (3 hits + observed displacement-of-use). | Very high value · **not a quick fix** — content track, gated by `D124`, post-M001 | 🔭 Strategic | Post-M001 re-eval (2026-07-20); D101 sequencing input | `docs/research/founder-use-ledger.md` |

### Fixes applied in this pass (2026-05-24)

The three lowest-risk, highest-confidence defects were fixed and verified the same day (`npm run typecheck` clean, 37 targeted Vitest cases green incl. both SafetyCheckScreen suites, `npm run lint` exit 0):

- **A1** — `Expander.tsx`: `onOpenChange` moved out of the `setOpen` updater; the setState-in-render console error is gone.
- **A5** — `SkillLevelScreen.tsx`: the redundant hyphenated `unsureSubtext` override removed; it now falls back to the period-correct `DEFAULT_UNSURE_SUBTEXT`.
- **A6** — new `--color-warning-strong` (#b91c1c, ≈5.3:1 on `warning-surface`) token; selected `warning` ToggleChip text uses it, clearing WCAG AA.

Left as recommendations (need design/founder judgment or a broader sweep): **A2** radius-token decision, **A3** brand-color tokenization, **A4** touch-target scale, and **`n1`** (the A6 axe "select-then-scan" test) to guard the contrast regression class.

---

## 1. Design system audit

**Score: ~78/100.** The primitive layer is genuinely good — typed variants, a centralized `surfaces.ts` focal-card token, a `ChoiceRow`/`ToggleChip`/`ChoiceSection` family with an ESLint guardrail against re-inlining `role="radiogroup"`, and unusually well-documented rationale comments. The drift is in the **token layer**, not the components.

### Token coverage

| Category | Defined | Drift found |
| --- | --- | --- |
| Color | 11 semantic tokens (accent, bg, text, success, warning, surfaces) | 6 hardcoded `#E8732A` sites in `app/` (1 React component `Brandmark.tsx` paired with `#FFF8F0`, 2 HTML `<meta>` tags, 2 SVG icons, 1 PWA manifest entry); only the React site can consume a CSS variable directly. Not equal to `--color-accent` (A3) |
| Typography | `--font-sans`, `--font-mono`, reserved `--text-body*` | `--text-body*` deliberately unused (D127 scaffolding — **intentional**, leave it) |
| Radius | `--radius-card: 12px`, `--radius-button: 16px` | **0 references**; ~25 hardcoded `rounded-[…]` arbitraries across 5 distinct values (A2) |
| Spacing / size | Tailwind scale (gap/p/px) | Touch targets are arbitrary `min-h-[…]`, 5 distinct values, no scale (A4) |

### Naming consistency

| Issue | Where | Recommendation |
| --- | --- | --- |
| `soft` is overloaded | `Button` variant `soft` (warm **filled** button) vs `Card` variant `soft` (warm **surface**) | Acceptable, but document the two meanings; or rename the Card variant to `warm`. |
| Large quiet-button family | `Button` has 7 variants; `outline` / `secondary` / `soft` are all "quiet" | Not a bug. Worth a one-line "when to use which" note in the Button doc (see §5). |

### Priority actions
1. **Either use the radius tokens or delete them.** Wire `--radius-card`/`--radius-button` into a Tailwind `rounded-card`/`rounded-button` utility and sweep the `rounded-[12px]`/`rounded-[16px]` sites, or remove the dead tokens. Dead tokens are worse than none — they imply a system that isn't enforced. Decide on the one-offs (`[14px]` RunScreen, `[8px]` PainOverrideCard) at the same time. *(Trigger: post-M001; same condition as A2 in §0.)*
2. **Tokenize the brand color** and reconcile it with the accent. Pick one orange (or formally accept "logo orange ≠ UI accent" and comment why). Five of the six hardcoded sites cannot consume a CSS variable directly (HTML `<meta>`, SVG fills, PWA manifest); reconciliation needs either a build-time substitution or accepting the hand-edit cost on each token change. *(Trigger: post-M001; bundle with #1 if both fire.)*
3. **Introduce a touch-target size scale** (e.g. `--tap-min`, `--tap-primary`) and reconcile against the README's "54–60 px" claim — today the floor is 44 px (still WCAG-OK; see §2). *(Trigger: post-M001; gated on README 54–60 px arbitration — A4 in §0.)*

---

## 2. Accessibility review (WCAG 2.1 AA)

The app is **unusually well-instrumented**: `@axe-core/playwright` runs across 8 screen states in `e2e/accessibility.spec.ts` (8/8 pass), contrast tokens were deliberately tuned with documented ratios (`index.css:21-52`), `ActionOverlay` is a textbook modal (focus trap + `Escape` + `inert`/`aria-hidden` siblings + focus restoration), and the Brandmark carries `role="img"` + label.

### Findings (net-new + confirmations)

| # | Issue | Criterion | Severity | Fix |
| --- | --- | --- | --- | --- |
| A1 | `Expander` setState-in-render console error on every Safety open (see §0 table) | 4.1.x robustness / 3.2.x | 🔴 High | Move the side effect out of the updater: compute `next`, call `setOpen(next)` then `onOpenChange?.(next)` outside `setOpen`. |
| A6 | Selected `warning` chips ≈ 3.95:1 (confirms e2e M1) | 1.4.3 Contrast | 🟡 Med | Darken selected-warning text or surface to clear 4.5:1; re-check `success` tone too. |
| n1 | axe scans only **unselected** chip state, so A6's failure class is untested | (test gap) | 🟡 Med | Add a "select a chip, then scan" case to `e2e/accessibility.spec.ts`. |
| n2 | Touch-target floor is 44 px (`link`, `BackButton`, `Disclosure`, `PassMetricInput` add-row) | 2.5.5 (AAA) | 🟢 Low | Meets WCAG 2.1 **AA** (no min-size requirement); flagged only because it's *below the README's own 54–60 px standard*. Short text-`link` buttons should keep enough `px` to stay ≥44 px wide. |

The deliberate single-`<h2>` solo Complete screen is valid and intentional (documented) — do not "fix" it.

---

## 3. Design critique

**Defers to `2026-05-24-agent-e2e-design-critique.md`**, which is current and thorough. Confirmed, not re-derived: the cockpit-footer Run layout, answer-first Safety, the Complete screen as the strongest surface, and the held-by-`D127` items (H1 timer size, H2 active-run density). Reading the Run and Review source (`RunScreen.tsx`, `ReviewScreen.tsx`) corroborates the "calm, one-focal-zone, honest" read.

**Net-new observations:**
- **Disabled-primary + `aria-live` hint** (`ReviewScreen.tsx:200-211`, "Rate your effort above to submit.") is a strong pattern — keep it as the house style for gated CTAs.
- **Repeated three-column "invisible spacer" header hack** (`ReviewScreen.tsx:90` `h-14 w-14 aria-hidden`, also on Complete) centers titles via a throwaway element. Works, but it's a candidate for a small `CenteredHeader` pattern so the hack lives once (ties into the handoff spec, §5).

---

## 4. UX copy review

Copy is a genuine strength and **evidence-rooted** (`courtside-copy.mdc` traces every rule to a walkthrough finding). CTAs are verb-led and name outcomes (`Build session`, `Start next block`, `Back to home`); the `End session early?` confirm dialog is exemplary (action-labeled buttons, consequence stated, safe-default first).

**Findings:**
- **A5 (the important one):** `SkillLevelScreen.tsx:159` — `"We'll size a light starter - you can change this after."` uses an ASCII hyphen as a sentence dash. The e2e critique (L2) recommends an **em-dash**, but that **violates `courtside-copy.mdc` rule 4** ("no em-dashes in prose; use commas, periods, colons"). **Correct fix: a period** → `"We'll size a light starter. You can change this after."` Worth reconciling `brand-ux-guidelines.md` §3.2 (which the e2e critique cited for the em-dash) against the higher-confidence `courtside-copy.mdc`.
- **Guard gap:** `app/src/lib/copyGuard.ts` enforces D86 regulatory vocabulary only — not punctuation. The em-dash "Unicode guard" in rule 4 is documented but not wired as a lint, which is why an ASCII hyphen slips both. A tiny lint over `screens/**` + `components/**` would close this class. *(Trigger: deferred — single observed violation, no trigger named yet; revisit on a second instance.)*
- **Confirmed minor (e2e L4):** "Export training records" is both heading and button label in Settings (redundant) — rename the button `Export` / `Download JSON`. *(Trigger: queue with next Settings copy sweep; no standalone trigger.)*

---

## 5. Design handoff — as-built primitive spec

Documenting the shipped primitives so the design system is captured for engineering (the design is already in code, so this is a code→spec capture).

### Tokens

| Token | Value | Usage |
| --- | --- | --- |
| `--color-accent` / `-pressed` | `#b45309` / `#92400e` | primary CTA, links, selected-accent chip text/border |
| `--color-bg-primary` / `-warm` / `-surface-calm` | `#ffffff` / `#f5f5f0` / `#fcfaf5` | focal cards / soft cards / page field |
| `--color-text-primary` / `-secondary` | `#1a1a1a` / `#4b5563` | body / muted (AA-tuned, see `index.css`) |
| `--color-success` / `-warning` | `#047857` / `#dc2626` | saved-state / danger + warning chip |
| `--color-info-surface` / `-warning-surface` | `#fef3e8` / `#fee2e2` | selected-accent chip fill / danger + selected-warning fill |
| `--font-sans` / `-mono` | Inter Variable / JetBrains Mono Variable | body / timer + counters |
| `--radius-card` / `-button` | `12px` / `16px` | **Defined but unwired — pending A2 decision; not part of the active system** |

> Rows marked *defined but unwired* are not part of the active as-built system; they reflect tokens authored ahead of consumers and are pending the A2 decision (see leverage table).

### Button (`components/ui/Button.tsx`)

- **Variants**: `primary`, `outline`, `secondary`, `danger`, `ghost`, `soft`, `link`.
- **Min-height**: primary 56 px; outline/secondary/danger/ghost/soft 54 px; link 44 px.
- **States**: hover + active per variant (paired to the same darker shade); `focus-visible` ring-2 + offset (accent, or warning for danger); disabled = neutral fill for primary (`opacity-100`), `opacity-50` for the rest.
- **A11y**: native `<button>`, React 19 ref-as-prop, `type` defaults to `button`.

### ToggleChip / ChoiceRow (`components/ui/`)

- **ToggleChip**: `role="radio"` + `aria-checked`; tones `accent|warning|success`; sizes `lg` (54 px) / `sm` (48 px); shapes `rounded|pill`; unselected = quiet outline + warm hover, selected = tone fill. **Note the A6 contrast defect on selected `warning`.**
- **ChoiceRow**: owns the `role="radiogroup"` + `aria-label`/`-labelledby` (compile-time exclusive); layouts `flex|grid-2|grid-3`; ESLint guardrail forbids re-inlining the radiogroup elsewhere.

### ScreenShell layout

- Three-zone **Header / Body / Footer**; the run loop pins timer + controls to a "cockpit" footer that never scrolls off (Safari URL-bar safe). This is the load-bearing layout pattern — document it as the default for any run-adjacent screen.

### Edge cases / states already handled
- Empty: `StatusMessage variant="empty"` ("Session not found." + Back to home). Loading: `variant="loading"`. Error: `variant="error"` surfaced inside the Run footer so it's never lost. Conflict: review already-submitted/skipped path shows saved data.

---

## 6. User research — method rigor

The validation design (`D130` founder-use mode; the `D91` stranger-cohort gate deferred; the append-only `founder-use-ledger.md`; the `D135` content-gap-vs-feature-wish classification; `pre-telemetry-validation-protocol.md`) is **methodologically self-aware** — it has falsification gates, a "conservative-wins-on-safety" rule, and an explicit "research-velocity substitution" failure mode. That rigor is real and worth defending.

**Gaps to name honestly:**
1. **n ≈ 2, and one is the builder.** Founder + Seb is a single, non-independent cohort. The red-team's original objection ("personal conviction is not observable") is mitigated by the ledger but not removed — the ledger is **self-reported and under-counts** (7 rows vs the founder's "a dozen or more").
2. **The sample is pair-mode; solo and set are nearly untested.** Solo 1/7 rows, set focus 0/3. Two of the three M001 conditions (Condition 1 solo-first; set floor) therefore rest on almost no direct behavior. The product *ships* solo as a first-class mode but has barely been used that way.
3. **No structured instrument.** Evidence is chat dumps + voice memos (the lowest evidential weight, by the ledger's own framing). There's no interview guide, task list, or rating scale — so "we feel like we're getting better" can't be separated from novelty.

**Recommended next research moves (cheap, in-window):**
- **One scripted solo usability session** (founder or a recruited solo player), 5 tasks, against the production build — directly attacks the solo/set evidence hole without unlocking scope. *(Trigger: deferred — no trigger named; depends on founder/recruit availability and instrument authoring.)*
- **A 5-task usability test of the existing flow with 2–3 of the "couple people" already shown the app** — even at n=3 this is the first non-founder/non-Seb signal, and `usability test` needs only 5–8 participants. *(Trigger: deferred — cohort-vs-decision question open; would compete with D91 stranger-cohort gate if run unscoped. Decide which decision the test informs before scheduling.)*
- **Pre-write the `D91` interview guide now** (warm-up → context → deep dive → reaction → wrap) so that if the stranger cohort triggers early, the instrument exists. *(Trigger: deferred until D91 stranger-cohort gate fires; explicitly scoped as instrument-authoring, not pre-work that would itself fire the gate.)*
- Keep the ledger, but **add a weekly summary row** for routine pair sessions so cadence stops being invisible (the ledger itself proposes this). *(Trigger: in-flight — append to `docs/research/founder-use-ledger.md` opportunistically; no gate.)*

---

## 7. Research synthesis — founder-use evidence

**Method:** founder + partner (Seb), pair-mode, ~2×/week over 2026-04-21 → 2026-05-23. **Participants:** 2 (P1 founder, P2 Seb). **Source:** `founder-use-ledger.md` + dated feedback notes.

### Executive summary
Sustained, voluntary 2×/week co-use with positive affect is the strongest behavioral evidence `D130` has produced — the build delivers its core "don't make us think, just give us a program" value for the founder's actual cadence. The single dominant constraint is **content scope**: the pair trains in 3s/4s/6s, the app only serves 2s, and that gap has now *displaced* real sessions out of the app.

### Key themes

**Theme 1 — Sustained pair co-use is real (positive).** Prevalence: both. *"seb and i still use it at least 2x weekly … and we like it"*; *"this actually makes it easier and more fun to go training because we don't have to think."* Implication: defend the structured-workflow thesis; this is the empirical answer to D130's premise.

**Theme 2 — The 3+ player content gap dominates (structural).** Prevalence: both, 3 hits + displacement. *"this app is basically useless in those cases"*; and on 2026-05-23, a week dropped to 1×/week *"because we did a 3s session on the second day and there is no 3s setup here."* Implication: the strongest input to the post-M001 sequencing question (`D101` 3+ player earlier vs `M002` first) — now backed by **observed displacement-of-use**, not just stated friction. Does **not** fire `D101` early (post-M001 per `D124`).

**Theme 3 — Mid-session extend / focus-switch friction (F1).** Prevalence: P2, single source. To switch focus mid-session, the only path is end + restart (re-running warmup/setup). Seb's workaround: shorten + answer "why" with "we wanted to practice serving now." Structurally novel; on **watch-for-second-hit** before any plan authoring.

**Theme 4 — Capture friction.** Prevalence: both. Post-workout Good/Total counts *"felt fake / too hard to track"*; optional counts *"felt right because counting was not forced." * Implication: keep capture optional; the `still_learning`-without-counts pattern is the honest default.

**Theme 5 — Timing budget recurs.** Prevalence: both, multiple sessions. Warmup timing "still wrong," drill blocks "too many minutes" (planned-block-duration > segment-sum on short slots). Implication: **the most concrete in-scope fix** in this whole audit — a real, repeatable correctness complaint, not a polish ask.

**Theme 6 — Content breadth asks.** Attack section, team play / tactics / blocking / positioning, custom session time. Mix of content-gap-leaning and feature-wish (`D135`); none fire triggers alone.

### Segments

| Segment | Characteristics | Needs | Status |
| --- | --- | --- | --- |
| Self-coached beach pair | 2 players, 2×/week, want decision-free structure | reliable timing, optional capture, varied 2s content | **Well served** |
| 3s / 4s / 6s players | the founder's actual network | 3+ player setups & content | **Unserved → blocking adoption** (`D101`, post-M001) |

### Recommendations
1. **Fix the warmup / duration-budget timing bug (Theme 5).** In-scope, repeatable, the clearest defect users actually feel. Start at `app/src/data/archetypes.ts` (planned-block vs segment-sum on 5-min slots) — confirm against `2026-05-10-pair-net-serving-duration-feedback.md`.
2. **Treat the 3+ player gap as the headline post-M001 input (Theme 2).** It now has displacement evidence; weight it heavily at the 2026-07-20 re-eval's sequencing call. Don't pull `D101` forward unilaterally — but don't let it stay buried in chat either.
3. **Hold F1 (mid-session extend) on watch (Theme 3).** Log the second hit deliberately if it recurs; it's the most plausible *new* surface.

### Questions for further research
- Does the solo mode work as well as pair? (Theme-blind — almost no data.)
- Is "we're getting better" novelty or durable? (Re-ask at re-eval; it's falsifiable.)
- Does any non-founder/non-Seb user complete the loop unaided?

---

## What this audit does NOT do
- Does **not** unlock Tier 1b/Tier 2 or pull `D101` forward; all scope stays held per `D124` / `D127` / `D130`.
- Does **not** modify `D86`, `D91`, `D127`, `D130`, `D132`, `D135` or any canonical design/copy doc — DOC-class items are recommendations.
- Does **not** supersede `2026-05-24-agent-e2e-design-critique.md`; it complements it.
- Did **not** capture screenshots (environment limitation); reuse the e2e critique's screenshot set for visuals.
