---
id: plan-2026-06-29-copy-ux-cleanup-pass
title: "refactor: Whole-app copy + UX cleanup pass"
status: active
stage: build
type: plan
summary: "Surgical copy + UX polish across the app: enforce no-em-dash prose, de-jargon five surfaces, restore Run get-ready between-block continuity, and clear D167-collapse comment residue. Explicitly not a voice overhaul."
authority: implementation plan for the 2026-06-29 copy/UX cleanup pass
last_updated: 2026-06-29
depends_on:
  - .cursor/rules/courtside-copy.mdc
  - docs/research/brand-ux-guidelines.md
  - docs/specs/run-flow-beat-contract.md
  - docs/decisions.md
  - CONCEPTS.md
decision_refs:
  - D156
  - D158
  - D164
  - D166
  - D167
  - D168
---

# refactor: Whole-app copy + UX cleanup pass

## Summary

A bounded copy + UX polish pass across the app, grounded in a three-cluster read-only audit (onboarding/pre-run, run-loop, home/settings/global) and the canonical copy/UX invariants (`.cursor/rules/courtside-copy.mdc`, `docs/research/brand-ux-guidelines.md`).

The audit's headline finding is that the app is **already heavily polished** — most "issues" are intentional, documented posture (settled noun titles, mandatory Recommended focus, the Home render budget, the beat-contract single-home, the disabled-primary helper pattern). So this pass is surgical: it fixes genuine rule violations, unglossed jargon, one continuity regression, and stale comments — not a redesign and not a voice overhaul.

Four implementation units:

- **U1** — enforce "no em-dash in user-visible prose" app-wide (one real violation) and reconcile the `brand-ux-guidelines` contradiction that licenses it.
- **U2** — plain-language jargon gate on five user-visible surfaces.
- **U3** — restore between-block continuity on the Run get-ready beat (the `D167` collapse dropped Transition's `Next:` counter + duration).
- **U4** — clear stale "read homed on Transition" comments left by the `D167` collapse.

---

## Problem Frame

The user asked to "do a copy and UX pass across the whole app, clean it up, make changes where relevant." The audit surfaced four clusters of genuinely actionable items above the noise:

1. **A punctuation rule violation plus a canon contradiction that licenses it.** Exactly one user-visible em-dash exists in app code (`RecentSessionsList.tsx`), but `brand-ux-guidelines` §3.2 actively says "use an em dash for parenthetical asides" — directly contradicting the enforced `courtside-copy` rule 4 (founder flagged em-dashes as essayist/heavy in the 390 px viewport) and the `CompleteScreen` copy-guard test. The contradiction will keep regenerating violations until reconciled.
2. **Unglossed jargon on five surfaces** that fail the one-season-rec-player test: the Safety pain question ("guard a movement"), the `PainOverrideCard` ("Lower-load technique work"), the skill-level descriptor ("attack the 3rd"), the Settings storage heading ("About local storage"), and the Drill Check gating hint ("Tag how that drill went").
3. **A continuity regression** on the Run get-ready beat: the `D167` Stage-4 collapse folded Transition into get-ready but dropped Transition's `Next: N/M` counter prefix and upcoming-block duration, so get-ready no longer pairs with Drill Check's `Last: N/M` and gives less to orient on before tapping Start.
4. **Stale author-facing comments** still claiming the `courtsideInstructions` read is "homed on Transition," when post-`D167` the READ-DO home is the Run get-ready beat.

Everything else the audit raised is either intentional canon or a larger domain/voice change — see Scope Boundaries.

---

## Requirements

- **R1** — No em-dash (`U+2014`) appears in any user-visible app string; `brand-ux-guidelines` canon is reconciled to the enforced `courtside-copy` rule 4.
- **R2** — The five flagged jargon surfaces read plainly for a one-season rec player, with **meaning preserved exactly** (especially the Safety pain gate's two-condition semantics and `D86` regulatory compliance).
- **R3** — The Run get-ready beat shows a `Next:`-prefixed counter and a quiet upcoming-block duration; the live (DO-CONFIRM) beat keeps its bare counter and gains nothing.
- **R4** — Author-facing comments referencing Transition as the READ-DO read-home are updated to the Run get-ready beat (post-`D167`).
- **R5** — Every touched guard test is updated in the same change; the full local verification suite is green.
- **R6 (constraint)** — Do not alter settled canon: noun/transitional screen titles (`Today's setup`, `Quick review`, `Before we start`, `Settings`, `Update your level`); the mandatory `Recommended` focus default; the Home render budget (`D156`); the beat-contract single-home (`D164`/`D167`); the disabled-primary helper pattern (§6.4); skill-level band labels/enums.

---

## Key Technical Decisions

- **KTD1 — `courtside-copy` rule 4 outranks the stale `brand-ux` §3.2 em-dash allowance.** Rule 4 is an always-applied workspace rule backed by direct founder evidence and a copy-guard test; §3.2's "use an em dash" line is the contradicted statement. Reconcile §3.2 and the §7.1 Recent-block example inline (following that file's existing "Canon-vs-code reconciliation" note convention) and record the reconciliation as **D168**.
- **KTD2 — "stress" steering vocabulary, the verdict palette, and the "Good passes" metric label are out of scope.** "stress" is approved canon in `steeringTrace`/`replayAdaptation` with guard tests asserting it as the sanctioned term (a `KTD9` voice decision); the verdict palette (§3.3) and the cross-skill "Good passes" label are domain-coupled and correctness-sensitive. Each is decision-worthy, not copy-pass material → Deferred.
- **KTD3 — get-ready parity is presentation-only.** A counter-prefix change plus one quiet duration line in the get-ready branch of `RunScreen`; no controller, domain, or data changes, and nothing added to the live cockpit. Reuse the existing duration/format helpers Transition used rather than inventing a label.
- **KTD4 — the Safety pain question keeps its exact gate semantics.** The reword preserves "sharp pain OR protective guarding → lighter session," the answer-first consequence copy, and `D86` compliance; only the question's phrasing de-jargons. The Yes/No answer model and downstream logic are untouched.

---

## Implementation Units

### U1. Enforce no-em-dash in user-visible prose + reconcile canon

- **Goal** — Remove the one user-visible em-dash and resolve the `brand-ux` contradiction that keeps licensing em-dashes.
- **Requirements** — R1, R5.
- **Dependencies** — none.
- **Files**
  - `app/src/components/RecentSessionsList.tsx` — strong-week consistency line (~:100): `Last week: {N} sessions — ahead of your usual rhythm.` → `Last week: {N} sessions, ahead of your usual rhythm.`
  - `app/src/components/__tests__/RecentSessionsList.test.tsx` — update the pinned assertion (~:80) to the comma form; add a guard that the rendered consistency line contains no `—`.
  - `docs/research/brand-ux-guidelines.md` — §3.2: replace the "Use an em dash … for parenthetical asides" line with rule-4-aligned guidance (commas/periods/colons; em-dash not used in user-visible prose; en-dash only in numeric ranges); §7.1 Recent-block bullet: update the example string to the comma form; add a dated "Canon-vs-code reconciliation" note citing `courtside-copy` rule 4 and `D168`.
  - `docs/decisions.md` — add **D168** (punctuation reconciliation: no em-dash in user-visible prose; `courtside-copy` rule 4 is authoritative over the retired `brand-ux` §3.2 allowance).
- **Approach** — The only user-visible em-dash in app source is the RecentSessionsList strong-week line (verified by grep; every other `U+2014` hit is an author-facing comment, which rule 4 exempts). Replace ` — ` with `, `. Then close the doc contradiction so the rule has a single source of truth.
- **Patterns to follow** — the existing inline "Canon-vs-code reconciliation (date, plan …)" notes already used throughout `brand-ux-guidelines.md` §1.2/§2.3/§4.4.
- **Test scenarios**
  - Happy path: strong-week line renders `Last week: 4 sessions, ahead of your usual rhythm.` (updated assertion).
  - Guard: rendered consistency line contains no `U+2014`.
  - Regression: low-history absolute read, single-session (`1 session`) plural/singular, and dark-state (count 0 → renders nothing) cases unchanged.
- **Verification** — `npm test -- RecentSessionsList` green; `rg $'\u2014' app/src --glob '*.tsx' --glob '*.ts'` returns only comment lines; `bash scripts/validate-agent-docs.sh` passes.

### U2. Plain-language jargon gate on five surfaces

- **Goal** — De-jargon five user-visible strings to pass the one-season-rec-player test without changing meaning or any gate logic.
- **Requirements** — R2, R5; constraint R6 (`D86` on Safety; band labels unchanged).
- **Dependencies** — none.
- **Files**
  - `app/src/screens/SafetyCheckScreen.tsx` — pain question heading "Any pain that's sharp, or makes you guard a movement?" → a plain, meaning-preserving form (direction: "…or that you're working around?" / "…or that makes you protect it when you move?"; final wording locked in implementation against the test). `app/src/screens/__tests__/SafetyCheckScreen.test.tsx` (~:84-94) — update the pain-heading assertion; confirm the `D86` `FORBIDDEN_RE` body scan (~:109-117) still passes.
  - `app/src/components/PainOverrideCard.tsx` — heading tense "Switched to a lighter session" → ready/present form ("Lighter session ready"); sub "Lower-load technique work today." → plainer ("Easier drills today, same length.") avoiding the "technique" Run-phase collision. Covered indirectly by Safety tests; check `SafetyCheckScreen.test.tsx` / `SafetyCheckScreen.d83-regression.test.tsx` for any pinned PainOverride strings.
  - `app/src/components/onboarding/SkillLevelPicker.tsx` — descriptor "Pass to target, attack the 3rd." → "Pass to a spot, then hit the third touch." (keep the `Side-out builders` **label** unchanged — only the descriptor de-jargons). `app/src/components/onboarding/__tests__/SkillLevelPicker.test.tsx` and `app/src/screens/__tests__/SkillLevelScreen.test.tsx` (~:97-112 descriptors verbatim) — update; check `app/src/screens/__tests__/SettingsSkillLevelScreen.test.tsx`.
  - `app/src/screens/SettingsScreen.tsx` — h2 "About local storage" → "Where your sessions live"; update the inline comment (~:174) and the cross-reference comment in `app/src/screens/CompleteScreen.tsx` (~:426). `app/src/screens/__tests__/CompleteScreen.polish-2026-04-23.test.tsx` (~:138-143) — update the describe/it/heading assertion.
  - `app/src/screens/DrillCheckScreen.tsx` — gating hint "Tag how that drill went to keep going." → "Pick how that drill went to keep going." (aligns the helper-verb family: Rate / Pick / Tell us). `docs/research/brand-ux-guidelines.md` §6.4 — sync the helper-line example string.
- **Approach** — Minimal, meaning-preserving rewrites. The Safety change is the highest-care item: keep the two-condition gate and answer-first consequence intact; if no rewrite clearly improves clarity without risking meaning, keep the change to the single jargon word. The Drill Check hint is testid-pinned (not text-pinned), so the app change is low-risk — but still sync the `brand-ux` §6.4 example so doc and code stay honest.
- **Patterns to follow** — `courtside-copy` rule 2 gloss patterns and the existing plain-voice helper lines in §6.4.
- **Test scenarios**
  - Safety: new pain-heading text asserted; `FORBIDDEN_RE` passes on the full Safety body; Yes/No still gates the lighter-session path; recency-before-pain order unchanged.
  - PainOverrideCard: new heading + sub text render under pain = Yes; lighter-session CTA and override path unchanged.
  - SkillLevelPicker/SkillLevelScreen: new descriptor asserted; five bands, band labels, and `unsure` opt-out unchanged.
  - Settings: new storage heading asserted; posture-sensitive detail body still renders; export + skill rows unchanged.
  - Drill Check: new gating hint text; Continue still disabled until a chip is selected; SR `h1` unchanged.
- **Verification** — `npm test` for the touched suites (`SafetyCheckScreen*`, `SkillLevelScreen`, `SkillLevelPicker`, `SettingsSkillLevelScreen`, `CompleteScreen.polish-2026-04-23`, `DrillCheckScreen.perDrillCapture`) green; `copyGuard` phase-c green; `bash scripts/validate-agent-docs.sh` passes (brand-ux edited).

### U3. Restore between-block continuity on the Run get-ready beat

- **Goal** — Re-add the temporal counter prefix and a quiet upcoming-block duration that the `D167` collapse dropped, so get-ready pairs with Drill Check's `Last: N/M` and orients the athlete before Start.
- **Requirements** — R3, R5; constraint R6 (beat-contract single-home; live beat stays bare).
- **Dependencies** — none (shares files with U4 but is independent).
- **Files**
  - `app/src/screens/RunScreen.tsx` — get-ready branch: pass `Next: {n}/{total}` to `RunFlowHeader` only when `isGetReady` (live beat keeps bare `{n}/{total}`); add one quiet line (`text-sm text-text-secondary`) showing the upcoming block duration near the title/Start cluster, derived from the same block-duration source Transition used.
  - `app/src/screens/__tests__/RunScreen.get-ready.test.tsx` — assert `Next:`-prefixed counter and the duration line.
  - `app/src/screens/__tests__/RunFlowContinuity.stillness.test.tsx` — verify the hero-title stillness assertion is unaffected (counter/duration are not the hero title; expect no change needed, confirm).
  - `app/src/contracts/runFlowLexicon.ts` — only if a shared label/prefix constant is genuinely warranted; prefer existing `format.ts` duration helpers and an inline `Next:` prefix over a new constant.
- **Approach** — Presentation-only. The live beat is DO-CONFIRM and must not gain the prefix or the duration line. Keep the duration line inside the get-ready content cluster (not the cockpit). No controller/domain/data changes.
- **Patterns to follow** — Drill Check's `Last: {n}/{total}` counter composition; the former `TransitionScreen` `Up next · {eyebrow}` + duration row (now the orphan) as the reference for what to restore.
- **Test scenarios**
  - Happy path: get-ready renders `Next: 2/3`; the live beat renders `2/3` (no prefix).
  - Happy path: get-ready shows the upcoming-block duration (e.g. "About 4 min" / matching the existing duration format).
  - Edge: the block-0 fresh-start path (no get-ready) is unaffected.
  - Regression: `RunFlowContinuity.stillness` hero-title assertion still green.
- **Verification** — `npm test` for `RunScreen.get-ready`, `RunFlowContinuity.stillness`, `RunScreen.run-face` green; `npm run typecheck` clean.

### U4. Clear stale "read homed on Transition" comments (D167 residue)

- **Goal** — Update author-facing comments that still claim the `courtsideInstructions` read is homed on Transition; post-`D167` the READ-DO home is the Run get-ready beat.
- **Requirements** — R4.
- **Dependencies** — none.
- **Files** (comment-only; no behavior change)
  - `app/src/screens/RunScreen.tsx` (e.g. the `~:171-176` and `~:222-225` comment regions).
  - `app/src/screens/__tests__/RunScreen.run-face.test.tsx` (~:119), `RunScreen.coaching-cues-default.test.tsx` (~:14), `RunScreen.now-cue-fallback.test.tsx` (~:131), `RunScreen.rationale-placement.test.tsx` (~:29), `RunScreen.segments.test.tsx` (~:17).
- **Approach** — Reword to "homed on the Run get-ready beat (post-`D167`; formerly Transition)." Leave `TransitionScreen`'s own comments as-is (it is the orphan that legitimately was the old home), updating only phrasing that misleads about the **current primary flow**.
- **Test scenarios** — `Test expectation: none` — comment-only; rely on existing suites continuing to pass unchanged.
- **Verification** — `npm test` (no behavior delta), `npm run lint`, `npm run typecheck` clean.

---

## Scope Boundaries

### In scope

U1–U4 above.

### Deferred to Follow-Up Work

- **"stress" steering / carry-forward vocabulary unification** (`steeringTrace.ts`, `replayAdaptation.ts`, vs the disclosure's "challenge") — approved canon with guard tests asserting "stress" as the sanctioned term (`KTD9` voice decision). Needs a decision row, not a copy pass.
- **"Good passes" metric label on serve/set sessions** — domain/metric-labeling change touching `format.ts` and aggregate tests; correctness-sensitive.
- **Review verdict-chip vocabulary** ("Try it" / "Keep the same") and the verdict palette (§3.3) — domain voice, `sessionSummary` tests.
- **Headline-as-question conversions for settled noun titles** (`Today's setup`, `Quick review`, `Before we start`, `Settings`, `Update your level`) — contradicts `brand-ux` §1.4 / §7 posture canon and the documented onboarding-vs-settings split.
- **`ErrorBoundary` `<button>` → `<Button>` + copy trim** — copy is canon-blessed (§3.1/§6.3); low value.
- **`HomeSecondaryRow` / `DraftCard` / `SkipReviewModal` microcopy tweaks** — non-steady-state, low impact.
- **Drill-catalog copy** (`courtsideInstructions`, success rules, verdict domain lines) — a separate catalog pass under `courtside-copy` rules 2–14.

### Not for

- Adding Home elements (the `D156` render budget pins the steady-state census).
- Changing focus semantics (Recommended is the mandatory default; focus is not deselectable).
- Re-adding the full setup read to the live cockpit (beat-contract single-home).
- Renaming skill-level band labels or enums.

---

## Sources & Research

- Three read-only cluster audits: onboarding/pre-run [audit A](7702f7dc-fc11-4657-b88e-f3d9e9b76ca0), run-loop [audit B](7601de08-b058-484f-887f-0ee3fd656b99), home/settings/global [audit C](268cdc18-b0ca-43d6-b893-33ed2437bbde).
- `.cursor/rules/courtside-copy.mdc` — rules 1 (headline-as-question), 2 (jargon gate), 4 (no em-dash); READ-DO/DO-CONFIRM frame; rule 12(a).
- `docs/research/brand-ux-guidelines.md` — §1.4 casing, §3.1–3.2 copy voice/punctuation, §4.2 focal zone, §6.4 disabled-helper pattern, §7 per-screen posture, §7.1 Home covenant.
- `docs/specs/run-flow-beat-contract.md` and `D164`/`D166`/`D167` — beat-contract single-home and the Stage-4 Transition collapse.
- `CONCEPTS.md` — run-flow / beat / get-ready vocabulary.
