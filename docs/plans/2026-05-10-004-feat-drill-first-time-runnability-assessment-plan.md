---
title: "feat: Drill First-Time-Runnability Assessment + Rubric Extension"
type: feat
status: active
date: 2026-05-10
origin: docs/brainstorms/2026-05-10-drill-first-time-runnability-requirements.md
---

# feat: Drill First-Time-Runnability Assessment + Rubric Extension

## Summary

Extend the courtside-copy contract with rules 8–12 grounded in the 2026-05-10 D130 "peak and flash / number drill" confusion class, BAB / FIVB / Volleyball Canada synthesis, and the strengthened first-time-runnability rubric. Land mechanical regression tests for the lintable rules (role-tagged sentences, aloud-read ceiling, extended jargon glosses), update `RunScreen` to render `coachingCues[0]` by default, audit all 26 M001-candidate drills against the strengthened rubric, sweep priority drill copy in `app/src/data/drills.ts`, refresh DrillCheck + Review prompts per the Person Pillar observe / reinforce / question template, and register the strengthened rubric in `docs/solutions/` and `docs/catalog.json` so future authors land on it before authoring.

---

## Problem Frame

The 2026-04-21 partner walkthrough drove the existing 7 courtside-copy invariants (`.cursor/rules/courtside-copy.mdc`), which catch *author vocabulary leaking into courtside copy*. The 2026-05-10 D130 session (Tony + Seb, 7th D130 session, pair-net serving, 38 min) captured three drills as `still_learning` with zero streaks — `d10-pair`, `d33-pair-open`, `d22-pair` — and the founder named the recurring confusion class *"peak and flash / number drill"*: drills where a partner has a non-obvious cuing or scoring role and the first-time courtside reader cannot tell at first glance *who does what, when, what counts*. The persistent *"warmup pacing feels off"* pattern (`d28 Beach Prep Three`) recurred.

The 2026-05-10 requirements doc (`docs/brainstorms/2026-05-10-drill-first-time-runnability-requirements.md`) extends the 2026-05-02 exercise-copy-contract baseline with R9–R16 covering pair-drill coordination clarity, structural sufficiency for re-glance reading, cue ordering, and capture/review surfaces. This plan implements that extension and runs the audit + sweep against the strengthened rubric.

See the ideation artifact for the full warrant trail and reject reasons: `docs/ideation/2026-05-10-drill-first-time-runnability-ideation.md`.

---

## Requirements

Carries forward R1–R8 from the 2026-05-02 baseline (already shipped via `docs/plans/2026-05-02-017-feat-exercise-copy-contract-plan.md`). Net-new in this plan:

- R9. Either-reader role-tagged sentences for pair drills (`participants.roles[].length ≥ 2`).
- R10. Cue→action coupling microformat (arrow or `"On X, Y."`) replacing conjunction-and for non-simultaneous actions.
- R11. Five-question logistics checklist for pair drills (who starts, what is a round, what counts, what on miss, when does it end).
- R12. Spatial point-of-view anchor on every spatial directive; default-from-server-POV for serving drills.
- R13. Triple-only readability — drill re-runnable from `skillFocus` + `successMetric.description` + `coachingCues[0]` alone.
- R14. `courtsideInstructions` aloud-read ceiling ≤ 15s (~ 40 words at 150 wpm); overflow routes to structured fields.
- R15. Cue ordering rule for `coachingCues[]`: (a) one cue rendered by default, (b) external focus, (c) gaze target first for perceptual drills, (d) ≥ 1 doer-POV cue.
- R16. Observe / reinforce / question template for DrillCheck and Review prompts.

Plus the sweep-only operational refinements that extend rules 2, 3, 5, and 7 (movement vocabulary gloss, logistics jargon gloss, operational scoring vocabulary, windowed grading cadence, three-clause termination, cadence format on timed segments, one-action-per-sentence floor, whole-practice context disclosure for part-practice drills, bracket-repeat microformat). See the requirements doc *Sweep-only extensions* section.

**Origin actors:** A1 courtside player, A2 future catalog author, A3 reviewing agent or maintainer, A4 partner reader (pair mode)
**Origin flows:** F1 copy review pass, F2 courtside reading, F3 pair-drill first-read flow, F4 returning-reader re-glance flow, F5 capture and review flow
**Origin acceptance examples:** AE1–AE9

---

## Scope Boundaries

Carries forward 2026-05-02 boundaries unchanged. Additionally:

- Do not add `expectedMisreading`, `crux`, `stopRule`, `pacing[]`, or `vocabPreflight[]` schema fields. Deferred to a follow-up schema decision (Theme G in the ideation artifact).
- Do not ship pacing-audio infrastructure. Rule 7's named shipping gap remains a gap; copy is written *as though* audible pacing exists.
- Do not open D101 3+ player support; new rules apply to future 3+ player drills when D101 unblocks them.
- Do not redesign DrillCheck or Review screens; R16 is a copy-and-template change, not deeper UX restructuring.
- Do not rewrite inactive reserve drills unless an active drill's copy or shared tests reference them.
- Do not change `workload`, `fatigueCap`, `participants` envelope size, `equipment`, `environmentFlags`, `skillFocus`, `m001Candidate`, or progression-graph semantics. **Reordering `coachingCues[]` for priority is permitted** under R15(a); changing the count is not.
- Do not encode subjective writing quality as brittle snapshots; mechanical lints only.

### Deferred to Follow-Up Work

- **Schema additions for `expectedMisreading` / `crux`** (Theme G S19): separate brainstorm + plan once the copy-only sweep validates the strengthened rubric and gives evidence about which schema add would carry the most leverage.
- **Pacing-audio infrastructure** (rule 7 shipping gap): tracked separately; not in this plan.
- **D101 3+ player support**: blocked elsewhere; not in this plan.

---

## Context & Research

### Relevant Code and Patterns

- `.cursor/rules/courtside-copy.mdc` — current 7 invariants + authoring checklist; this plan extends it.
- `app/src/data/__tests__/drillCopyRegressions.test.ts` — current home for mechanical copy invariant tests; this plan adds new tests for R9, R14, and the rule-2 extensions.
- `app/src/data/__tests__/catalogValidation.test.ts` — structural catalog rules; should remain untouched.
- `app/src/data/drills.ts` — active drill catalog source; copy edits live here.
- `app/src/types/drill.ts` — drill schema (no schema changes in this plan).
- `app/src/screens/RunScreen.tsx` (or equivalent block-render component) — the courtside one-cue render change for R15(a). Confirm exact filename during U3.
- `app/src/screens/DrillCheckScreen.tsx` — DrillCheck difficulty prompt surface for R16.
- `app/src/screens/ReviewScreen.tsx` (or equivalent) — Review prompt surface for R16.
- Existing skill-verb-first regression-test pattern (rule 6) — the template R9's role-tagged-sentence test follows.
- Existing `validateDrillCatalog` style — lint patterns for word-count / sentence-count / token-presence checks.

### Institutional Learnings

- Copy invariants in this contract are evidence-grounded: each rule traces to a partner-walkthrough or founder-session finding, and rules are removed when two consecutive walkthroughs do not flag them. Preserve that discipline.
- Mechanical lints over subjective snapshots — the 2026-05-02 plan deliberately avoided brittle snapshot tests and that policy carries forward.
- Copy-only sweeps must not hide structural catalog problems (workload, fatigue, equipment, participants envelopes). If a copy issue points to a structural mismatch, defer the structural change and record it in the assessment artifact.
- The author IS the doer in D130 founder-use mode. Doer-POV cues are not theoretical — they are the cues that survive contact with the actual self-coached session.
- The 2026-04-27 cca2 dogfeed established the **skill-verb-first** invariant for an adjacent bug shape; the role-tagged-sentence rule (R9) follows the same evidence-grounded pattern one level deeper.

### External References

- FIVB Coaches Manual Level I / Level II (cue density, feedback cadence, whole-practice bias, Fitts & Posner motor stages) — synthesized in `docs/research/fivb-coaches-manual-crosscheck.md`.
- Volleyball Canada *Person Pillar Guidebook for Coaches* (observe / reinforce / question template) — synthesized in `docs/research/ltd3-development-matrix-synthesis.md`.
- BAB practice grammar (six-slot spine; sand-specific cues) — synthesized in `docs/research/bab-source-material.md` and `docs/research/practice-plan-authoring-synthesis.md`.
- Wulf (2013) *Attentional Focus and Motor Learning: A Review of 15 Years* — external focus rubric (R15(b)).
- Vickers (2007) *Perception, Cognition, and Decision Training: The Quiet Eye in Action* — gaze-target-first cue rule (R15(c)).
- Bandura (1986); Magill (11e) Ch 14 — demonstration substitution → spatial-referent gloss (movement-vocabulary extension to rule 2).
- Gawande (2009) *The Checklist Manifesto* — READ-DO vs DO-CONFIRM unifying lens (Key Technical Decisions below).
- Helmreich, Merritt & Wilhelm (1999) — aviation CRM cue-action coupling (R10).
- Mayer (3e) *Multimedia Learning* — segmenting principle and pre-training principle for reading-load budget (R14).
- Salmoni, Schmidt & Walter (1984); Winstein & Schmidt (1990) — guidance hypothesis for windowed grading cadence.

---

## Key Technical Decisions

- **Extend existing rules; do not fork.** New rules 8–12 live in `.cursor/rules/courtside-copy.mdc` alongside the existing 7. Sweep-only refinements fold into rules 2, 3, 5, and 7 as sub-rules rather than standing as separate rules. Future authors land on one canonical contract file.
- **Adopt READ-DO vs DO-CONFIRM as the unifying lens** (Gawande). Pre-run TransitionScreen copy is READ-DO (full prose, full glossing). Active-run RunScreen re-glance is DO-CONFIRM (load-bearing triple, structured fields). R13 and R14 enforce the DO-CONFIRM surface; R9–R12 and rule-2 extensions live on the READ-DO surface. Document this lens at the top of `.cursor/rules/courtside-copy.mdc`.
- **Copy-first sweep, schema-later.** No schema additions in this plan. Theme G (`expectedMisreading`, `crux`, `stopRule`, `pacing[]`, `vocabPreflight[]`) is deferred to a follow-up decision; the copy-only sweep delivers the strengthened rubric without them.
- **`coachingCues[0]` becomes contractually meaningful.** R15(a) makes `[0]` the load-bearing first cue rendered by default. `RunScreen` change in U3 implements the `Show more cues` affordance.
- **Mechanical lint where mechanical; checklist where judgment.** R9 (role-tagged sentence), R14 (TTS-time ceiling), and the rule-2 extensions (movement-jargon, logistics-jargon, scoring-vocab tokens) are lintable. R10, R11, R12, R13, R15(b–d), R16 remain authoring-checklist + per-drill review items. Bias toward lints with low false-positive risk; downgrade to checklist if the lint is brittle.
- **Per-drill assessment artifact is a separate doc**, not part of the plan body. `docs/reviews/2026-05-10-drill-first-time-runnability-assessment.md` carries one row per M001-candidate drill (currently 26) classifying as **pass / repair / rewrite**. Keeps the plan compact and lets the assessment evolve independently.
- **Priority order for drill rewrites:** today's session drills first (`d07-pair`, `d10-pair`, `d22-pair`, `d28-solo`, `d33-pair-open` / `d33-pair`); then remaining pair drills with non-trivial role coordination; then warmup / cooldown / segment drills (rule-5 equal weight); then remaining M001 candidates. This sequencing surfaces the highest-confusion specimens first and lets U4's assessment classification drive U5's effort.
- **Founder-use-mode falsification surface.** The strengthened rubric's success criterion is the next D130 session: re-run `d07-pair`, `d33-pair`, `d22-pair` and confirm the "who does what / when / what counts" question does not surface. If it does, the rule failed and gets revised, not the reader.

---

## Open Questions

### Resolved During Planning

- **Should this plan add schema fields?** No. Deferred to Theme G follow-up per requirements doc Key Decisions.
- **Should DrillCheck + Review get a deeper UX restructure?** No. R16 is copy-and-template only; deeper restructure is a separate brainstorm.
- **Should sweep-only extensions become separate top-level rules or fold into existing rules?** Fold into existing rules (2, 3, 5, 7) as sub-rules; keeps the invariant list manageable while preserving discoverability under the existing rule structure.

### Deferred to Implementation

- **Exact lint thresholds for R14.** 15s aloud / 40 words is the rubric target; the lint may need a small grace band (e.g., 45 words hard ceiling, 40-word warning) once it is run across the existing catalog. Decide after U2 first-run.
- **Exact list of "logistics-jargon" tokens for the rule-2 extension lint.** Seed list: `shag`, `round`, `attempt`, `miss`, `reset`, `switch`, `turn`, `swap`, `rotate`. Extend if the U4 assessment surfaces additional terms.
- **Exact list of "movement-vocabulary" tokens.** Seed list: `A-skip`, `ankle hops`, `lateral shuffles`, `arm circles`, `trunk rotations`, `pivot-back start`, `runner's lunge`, `half-kneel`, `hip flexor`. The lint should detect these tokens *unglossed* (no parenthetical or inline-clause spatial referent immediately after first occurrence in the drill). Extend during U4.
- **Exact RunScreen render mechanism for `Show more cues`.** Drawer? Expand-in-place? Long-press? Decide during U3 prototype; bias toward expand-in-place to keep the active-run UI envelope clean.
- **Whether DrillCheck needs a `observable: string` field on `DrillVariant`.** Lean toward deriving the observable from existing fields (`successMetric.description` + `participants.roles`) first. Add the field only if the derivation produces awkward strings on real drills.

---

## High-Level Technical Design

This plan is structurally a *rules + lints + audit + sweep + UI render* pass. Most of the work is well-patterned (rule files, regression tests, drill rewrites). The non-obvious shape is the **per-drill assessment artifact** that drives U5's prioritization.

> *The diagram below illustrates the intended workflow shape and is directional guidance for review, not implementation specification.*

```text
                ┌───────────────────────────────────┐
                │ U1. Rules 8–12 + rule-2/3/5/7      │
                │      extensions in courtside-copy  │
                └────────┬────────────┬─────────────┘
                         │            │
            ┌────────────┘            └─────────────┐
            ▼                                       ▼
  ┌──────────────────┐                  ┌──────────────────────┐
  │ U2. Lints for    │                  │ U3. RunScreen render │
  │     R9/R14/      │                  │     coachingCues[0]  │
  │     rule-2 ext.  │                  │     default + drawer │
  └────────┬─────────┘                  └──────────┬───────────┘
           │                                       │
           ▼                                       │
  ┌──────────────────────────────────────┐         │
  │ U4. Per-drill assessment artifact    │         │
  │     (26 M001 candidates → pass /     │         │
  │      repair / rewrite classification)│         │
  └────────────────────┬─────────────────┘         │
                       │                           │
                       ▼                           │
            ┌──────────────────────────┐           │
            │ U5. Drill copy sweep      │           │
            │     priority: today's     │           │
            │     drills → remaining    │           │
            │     pair → warmup/wrap    │           │
            └──────────┬────────────────┘          │
                       │                           │
                       └─────────────┬─────────────┘
                                     │
                                     ▼
                       ┌─────────────────────────┐
                       │ U6. DrillCheck + Review │
                       │     copy template (R16) │
                       └─────────────┬───────────┘
                                     │
                                     ▼
                       ┌──────────────────────────┐
                       │ U7. Docs routing +       │
                       │     docs/solutions/      │
                       │     validation           │
                       └──────────────────────────┘
```

The READ-DO vs DO-CONFIRM lens (Gawande) is the principle that organizes the rule set. Document it in `.cursor/rules/courtside-copy.mdc` as a top-of-file frame; the individual rules then carry tags indicating which surface they govern.

---

## Implementation Units

- U1. **Strengthen `.cursor/rules/courtside-copy.mdc` with rules 8–12 + rule-2/3/5/7 extensions**

**Goal:** Add the strengthened rubric to the canonical courtside-copy contract so future authors land on rules 8–12 alongside the existing 1–7. Adopt the READ-DO vs DO-CONFIRM lens as the unifying frame.

**Requirements:** R9, R10, R11, R12, R13, R14, R15, plus the sweep-only operational refinements that extend rules 2, 3, 5, 7.

**Dependencies:** None.

**Files:**
- Modify: `.cursor/rules/courtside-copy.mdc`

**Approach:**
- Add a short top-of-file frame describing the **READ-DO vs DO-CONFIRM** consumption-mode lens. Pre-run TransitionScreen copy is READ-DO; active-run RunScreen re-glance is DO-CONFIRM. Each subsequent rule carries a `[READ-DO]` or `[DO-CONFIRM]` tag in its heading.
- Add **Rule 8 — Either-reader role-tagged sentences** (R9). Worked example: `d07-pair` before/after. Tag: `[READ-DO]`. Note that a regression test pins this in `drillCopyRegressions.test.ts` (added in U2).
- Add **Rule 9 — Cue→action coupling microformat** (R10). Worked example: `d33-pair` before/after. Tag: `[READ-DO]`.
- Add **Rule 10 — Five-question logistics checklist for pair drills** (R11). List the five questions verbatim. Worked example: `d22-pair` before/after. Tag: `[READ-DO]`. Note this is a checklist item, not a mechanical lint.
- Add **Rule 11 — Spatial point-of-view anchor** (R12). Default-from-server-POV for serving drills. Tag: `[READ-DO]`.
- Add **Rule 12 — Cue ordering rule for `coachingCues[]`** (R15). Four sub-rules: (a) one-cue default + `Show more cues` drawer, (b) external focus, (c) gaze target first for perceptual drills, (d) ≥ 1 doer-POV cue. Tag: `[DO-CONFIRM]`. Note that (a) is enforced by RunScreen render (U3), (b/c/d) are reviewer checklist items.
- Add **Rule 13 — Active-run structural sufficiency (triple-only readability)** (R13). Authoring test phrasing. Tag: `[DO-CONFIRM]`.
- Add **Rule 14 — `courtsideInstructions` aloud-read ceiling** (R14). 15s / 40 words. Tag: `[READ-DO]`. Note that a lint pins this.
- Extend **Rule 2 — Jargon gate** with three columns: technique (existing), movement-vocabulary (new), logistics-vocabulary (new). Seed each new column with the lists in *Open Questions → Deferred to Implementation*. Note that lints will catch unglossed first uses (U2).
- Extend **Rule 3 — No combinatoric descriptions** with the permitted bracket-repeat microformat exception. Worked example: `d33-pair` rewrite.
- Extend **Rule 5 — Cool-down / wrap copy gets equal review weight** with an explicit nod to the operational scoring vocabulary and windowed grading cadence (these apply to main-skill `successMetric.description` strings too, not only to wrap copy, but rule 5 carries the equal-weight discipline).
- Extend **Rule 7 — Timed sub-blocks need audible structure** with a sub-rule on **cadence format** (continuous, rep-paced, work-rest, accumulator). Note this is a copy-only rule that names the format; it does not replace the existing audible-structure shipping gap.
- Update the authoring checklist at the bottom of the file with new rows for each new rule and extension.

**Patterns to follow:**
- Existing rule structure in `.cursor/rules/courtside-copy.mdc` (priority order; worked Bad/Good examples; origin-evidence trace; test-verification pointer).
- Existing rule-6 evidence framing from the 2026-04-27 cca2 dogfeed F8 finding.

**Test scenarios:**
- Test expectation: none — documentation/rule update only. Companion lints land in U2.

**Verification:**
- The rule file gives future authors enough guidance to apply rules 8–12 and the extensions to existing or new drills without consulting this plan or the requirements doc.
- The READ-DO vs DO-CONFIRM frame at the top of the file makes the rule-tag system self-explanatory.

---

- U2. **Mechanical lint tests for R9, R14, and rule-2 extensions**

**Goal:** Add focused mechanical regression tests in `drillCopyRegressions.test.ts` that pin the lintable rules. Avoid brittle snapshot tests.

**Requirements:** R9, R14, AE4, AE7 (and the rule-2 extension sweep guards).

**Dependencies:** U1.

**Files:**
- Modify: `app/src/data/__tests__/drillCopyRegressions.test.ts`
- Test: `app/src/data/__tests__/drillCopyRegressions.test.ts`

**Approach:**
- Add a helper `collectPairDrillVariants()` that returns variants of `m001Candidate: true` drills with `participants.roles.length ≥ 2`.
- Add a test for **R9 role-tagged sentences**: for each pair-drill variant, parse `courtsideInstructions` into sentences and confirm that for every role string in `participants.roles[]`, at least one sentence has that role (or an unambiguous synonym — accept `"you"` as the doer for the first listed role, and accept the role name capitalized or lowercased) as the grammatical subject (heuristic: appears as the first token of the sentence, or as the subject of an active verb at sentence start). This is heuristic — make the test specific enough to catch the d07/d33 bug class without catching well-formed sentences that happen to omit a role.
- Add a test for **R14 aloud-read ceiling**: for each `m001Candidate: true` variant, compute the word count of `courtsideInstructions`. Fail if > 45 words (hard ceiling; warning band at 40 if test-runner supports warnings). Use a simple split-on-whitespace word count.
- Add a test for **rule-2 movement-vocabulary extension**: for each variant, scan `courtsideInstructions` and `segments[].label` for the seed movement-vocabulary tokens (`A-skip`, `ankle hops`, `lateral shuffles`, `arm circles`, `trunk rotations`, `pivot-back start`, `runner's lunge`, `half-kneel`, `hip flexor`). For each first occurrence per drill, confirm a parenthetical or inline-clause spatial referent follows within the same sentence (heuristic: `(...)` or `, ` clause containing direction/posture vocabulary like `knee`, `forward`, `back`, `side`, `arm`, `leg`, `hip`, etc.). Fail with a message naming the unglossed token and drill.
- Add a test for **rule-2 logistics-vocabulary extension**: same shape as movement-vocabulary test, with token list `shag`, `round`, `attempt`, `miss`, `reset`, `switch`, `turn`, `swap`, `rotate`. Heuristic gloss check: parenthetical or inline-clause within the same sentence, OR the token is already defined inline at first use in the drill.
- Add a test for **operational-scoring-vocabulary**: for each `m001Candidate: true` variant, scan `successMetric.description` for graded vocabulary tokens (`grade 2+`, `graded 2+`, `grade 3`, `good pass`, `controlled set`, `in-system`). Fail if any token appears without an inline operational definition in the same description.
- All tests follow the existing focused-regression-test style (not snapshot tests).

**Execution note:** Add tests **before** running U5's sweep so failures identify the concrete mechanical gaps and serve as the assessment artifact's empirical input for U4.

**Patterns to follow:**
- Existing skill-verb-first regression test in `app/src/data/__tests__/drillCopyRegressions.test.ts` — same structural style for the R9 test.
- Existing em-dash exclusion regression test — same structural style for token-based lints.

**Test scenarios:**
- Covers AE5. Happy path: a pair drill where every role appears as the grammatical subject of an active verb passes the R9 test.
- Covers AE5. Error path: a pair drill where a role appears only as the object of another role's sentence fails the R9 test with a clear message naming the missing role.
- Covers AE7. Happy path: a drill with `courtsideInstructions` at 38 words passes R14; at 50 words fails with a message including the word count.
- Edge case: optional `courtsideInstructionsBonus` strings are included in the word-count and jargon-gloss checks only when present.
- Error path: a drill containing `A-skip` without a parenthetical or spatial-referent gloss in the same sentence fails the movement-vocabulary lint.
- Error path: a drill containing `shag` without an inline gloss fails the logistics-vocabulary lint.
- Error path: a drill with `successMetric.description: "Passes graded 2+ across 24 tosses"` fails the operational-scoring lint.
- Integration: the new lints + existing tests all pass after U5's sweep completes.

**Verification:**
- The new tests fail on today's catalog (this is the empirical input to U4's per-drill classification).
- After U5's sweep, all new tests pass.
- Existing 2026-05-02-era tests continue to pass (no regressions in skill-verb-first, em-dash exclusion, or active-runtime-completeness lints).

---

- U3. **`RunScreen` render `coachingCues[0]` by default with `Show more cues` affordance**

**Goal:** Implement R15(a) by changing the active-run cue render so only `coachingCues[0]` is shown by default; remaining cues sit behind a `Show more cues` affordance that defaults closed.

**Requirements:** R15(a), R13, R14 (the render change is part of the structural-sufficiency story).

**Dependencies:** U1 (the rule informs the UI change; the rule and render must agree).

**Files:**
- Modify: confirm exact filename during implementation. Candidates: `app/src/screens/RunScreen.tsx`, `app/src/screens/run/CueBlock.tsx`, `app/src/components/DrillCard.tsx`, or whichever component renders `coachingCues[]` during active run. Locate via `grep -r "coachingCues" app/src/screens app/src/components`.
- Test: `app/src/screens/__tests__/RunScreen.test.tsx` (or equivalent), or a focused render test in the cue-block component's own test file.

**Approach:**
- Locate the active-run cue render path (grep `coachingCues` across `app/src`).
- Change the default render from "show all `coachingCues[]`" to "show `coachingCues[0]` only" with a tappable `Show more cues` affordance (text button) that expands the remaining cues in place when present. If `coachingCues.length === 1`, do not render the affordance.
- Keep the typography floor honored (`56–64px` for active-run cue display per `docs/research/outdoor-courtside-ui-brief.md`).
- Match existing affordance idioms in the codebase; do not introduce a new pattern unless none exists.
- Honor the calm-courtside-ux aesthetic captured in `docs/research/japanese-inspired-visual-direction.md` and `docs/ideation/2026-05-02-calm-courtside-ux-style-ideation.md` — the affordance is informational, not decorative.

**Execution note:** Characterization-first — capture the existing cue-render behavior with a snapshot or render test before changing it, so any unintended layout shift surfaces.

**Patterns to follow:**
- Existing collapse/expand affordance patterns in the codebase if any.
- Existing typography and spacing rules in `docs/research/outdoor-courtside-ui-brief.md`.

**Test scenarios:**
- Happy path: a drill with `coachingCues = ['First cue', 'Second cue', 'Third cue']` renders only `'First cue'` on initial mount; `Show more cues` is visible.
- Happy path: tapping `Show more cues` reveals `'Second cue'` and `'Third cue'` in order.
- Edge case: a drill with `coachingCues = ['Only cue']` renders the cue without the `Show more cues` affordance.
- Edge case: a drill with `coachingCues = []` (if permitted by schema) renders no cue block and no affordance.
- Integration: existing `RunScreen` tests (transition lifecycle, segment progress, primary controls) continue to pass.

**Verification:**
- The active-run UI honors the one-cue-default contract on a real `m001Candidate: true` drill in a dev session.
- Existing run-mode tests pass; no layout shift visible on a representative drill (`d33-pair` is a good test specimen because it has 3 cues).

---

- U4. **Per-drill assessment artifact (26 M001 candidates)**

**Goal:** Produce a referenceable assessment artifact at `docs/reviews/2026-05-10-drill-first-time-runnability-assessment.md` that classifies every M001-candidate drill as **pass / repair / rewrite** against the strengthened rubric, with row-level notes pointing at the specific rules each drill fails.

**Requirements:** R9, R10, R11, R12, R13, R14, R15 (the assessment uses these as the rubric).

**Dependencies:** U1 (rules), U2 (mechanical lint output is the empirical input to the classification).

**Files:**
- Create: `docs/reviews/2026-05-10-drill-first-time-runnability-assessment.md`
- Modify: `docs/catalog.json` (register the assessment artifact as a routing entry)
- Read: `app/src/data/drills.ts`, `app/src/data/__tests__/drillCopyRegressions.test.ts` (lint output)

**Approach:**
- Run the U2 lints and capture per-drill failures.
- Read each M001-candidate drill manually and apply the non-mechanical rules (R10, R11, R12, R13, R15(b–d)) as a reviewer checklist.
- Produce a table with columns: `Drill ID · Variant · Rules failed · Class (pass/repair/rewrite) · Priority · Notes`. **Class definitions:**
  - **pass**: no rule failures; no action needed.
  - **repair**: 1–3 rule failures, all addressable with localized copy edits without rewriting the drill's structural shape.
  - **rewrite**: ≥ 4 rule failures, or any failure that requires re-thinking the role coordination / sentence structure substantially.
- **Priority columns:** P0 = today's session drills (`d07`, `d10`, `d22`, `d28`, `d33`); P1 = remaining pair drills with non-trivial role coordination; P2 = warmup / cooldown / segment drills (rule 5 equal weight); P3 = remaining M001 candidates.
- Add a short framing section at the top of the artifact: scope, rubric reference, methodology.
- Add a tally row at the bottom: counts by class × priority.
- Register the artifact in `docs/catalog.json` as a routing entry (`type: review`, `successor_disposition` left empty since this is a live artifact).

**Patterns to follow:**
- Existing review artifacts in `docs/reviews/` for structural style (e.g., `docs/reviews/2026-05-01-generated-plan-diagnostics-report.md`).
- Existing per-drill assessment shapes if any precedent exists in the repo.

**Test scenarios:**
- Test expectation: none — review artifact is human-curated, not mechanically validated. Mechanical lint coverage comes from U2.

**Verification:**
- Every `m001Candidate: true` drill has exactly one row in the assessment.
- The classification (pass / repair / rewrite) is consistent with the U2 lint output and the reviewer checklist.
- The artifact's tally matches the catalog (currently 26 M001 candidates).
- `docs/catalog.json` includes the new entry and `bash scripts/validate-agent-docs.sh` passes.

---

- U5. **Drill copy sweep informed by U4 (priority-ordered)**

**Goal:** Rewrite drill copy in `app/src/data/drills.ts` for all variants classified as **repair** or **rewrite** in U4, applying rules 8–12 and the rule-2/3/5/7 extensions. Keep all metadata, workload, participant, equipment, and progression semantics unchanged. Sweep in priority order (P0 → P1 → P2 → P3).

**Requirements:** R9, R10, R11, R12, R13, R14, R15(b–d) plus the sweep-only operational refinements (movement-vocabulary gloss, logistics gloss, operational scoring vocabulary, windowed grading cadence, three-clause termination, cadence format on timed segments, one-action-per-sentence floor, whole-practice context disclosure for part-practice drills, bracket-repeat microformat).

**Dependencies:** U1 (rules), U2 (lints as guardrails during edits), U4 (priority and per-drill failure list).

**Files:**
- Modify: `app/src/data/drills.ts`
- Test: `app/src/data/__tests__/drillCopyRegressions.test.ts`
- Test: `app/src/data/__tests__/catalogValidation.test.ts`

**Approach:**
- For each drill classified as **repair** in U4: apply the localized copy edits the rule failures dictate. Common shapes:
  - Add a `"You [role A]; partner [role B]."` opener for pair drills missing R9.
  - Rewrite cue→action conjunctions ("X and Y" for non-simultaneous actions) into `On X → Y` or sequence-verb form for R10.
  - Add the five-logistics-question coverage for R11 where missing.
  - Add the POV anchor on spatial directives for R12.
  - Reorder `coachingCues[]` if R15(b–d) failures are about ordering only; rewrite cues if the cues themselves need rewriting.
  - Add inline glosses for unglossed movement-vocabulary or logistics-vocabulary tokens.
  - Make `successMetric.description` self-contained where it uses graded vocabulary.
- For each drill classified as **rewrite** in U4: re-author the `courtsideInstructions` and possibly `coachingCues[]` ordering from scratch against the rubric. Worked-example targets:
  - **d07-pair "Pass & Look"** (today's adjacent case; not run today but same class):
    - From: *"Pass a served ball to the set window, then immediately look at partner/coach flashing 1-5 and call it before the next action."*
    - To: *"You pass; partner flashes a number 1–5 with their fingers the moment your platform meets the ball. Pass to the set window, then call the number you saw before the next ball. Switch roles after 12 reps."*
    - `coachingCues[0]` (rewritten): *"Look at your partner's hand the moment your platform meets the ball."*
  - **d33-pair "Around the World Serving"** (today's session drill):
    - Bracket-repeat microformat: *"(serve to called zone → partner shags) × 6 zones."*
    - POV anchor: *"From your side of the net: front-left is the receiver's back-right corner, …"* (or similar; pick the simpler POV).
    - Miss-escape rule: *"After 3 misses on the same zone, move on and revisit at the end of the round."*
  - **d22-pair "First to 10 Serving"** (today's session drill):
    - Logistics-jargon gloss: *"…each partner serves once, scores their own result (good → +point; out → -point), then hands the ball over."*
    - Termination fallback: *"If neither partner reaches 10 by the block timer, the higher score wins the round; play a second round if there is time."*
  - **d10-pair "6-Legged Monster"** (today's session drill):
    - Operational scoring vocabulary: *"Passes graded 2+ (= the ball lands within 1 m of the set window with enough arc to be settable) across 24 tosses, ≥ 70%."*
  - **d28-solo "Beach Prep Three"** (today's recurring warmup pacing issue):
    - Movement-vocabulary gloss: *"Jog or A-skip (= skip forward, lifting the front knee until the thigh is parallel to the sand)"*, *"Ankle hops and lateral shuffles (= small two-foot hops then quick sideways shuffle steps, ~ 3 m each way)"*, etc.
    - Cadence format on each segment: continuous, rep-paced, or accumulator named explicitly.
- Keep envelope-honesty rule. If a copy issue points to a structural mismatch (e.g., participants/equipment envelope wrong), record it in the assessment artifact and do not patch the metadata in this sweep.
- After each priority tier (P0 → P1 → P2 → P3), commit and rerun the U2 lints + existing `catalogValidation.test.ts` to confirm no regressions.

**Execution note:** Characterization-first against U2 lints — let the lints catch failures during the sweep rather than waiting for end-of-sweep test runs.

**Patterns to follow:**
- Existing 2026-04-27 sweep rewrites for `d33-pair` (skill-verb-first) — same style, deeper coverage.
- Existing comment discipline in `app/src/data/drills.ts` — add a `// 2026-05-10 first-time-runnability sweep: <what changed>` comment on each rewritten variant.

**Test scenarios:**
- Covers AE5. Happy path: `d07-pair` `courtsideInstructions` after rewrite passes the R9 role-tagged-sentence test.
- Covers AE6. Happy path: `d33-pair` `courtsideInstructions` after rewrite passes R11 (5-question) and R12 (POV anchor) checklist review.
- Covers AE7. Happy path: every M001-candidate drill's `courtsideInstructions` passes the R14 word-count lint.
- Covers AE8. Happy path: `d07-pair` `coachingCues[0]` after rewrite passes R15(c) gaze-target-first checklist and the external-focus regex (no body-part token).
- Integration: catalog validation passes after each priority-tier commit and at the end of the sweep.
- Integration: generated diagnostics report/triage output remains stable (no diagnostic shifts caused by copy-only changes).
- Edge case: warmup `d28-solo` segment labels carry the new movement-vocabulary glosses without exceeding the segment-label length budget that the existing schema implies.

**Verification:**
- All U2 lints pass on the full M001-candidate set.
- Existing `catalogValidation.test.ts` passes (no envelope drift).
- Generated diagnostics (`npm run diagnostics:report` / `npm run diagnostics:triage`) do not surface new issues attributable to copy changes.
- The U4 assessment artifact is updated to reflect the post-sweep state (all rows now read **pass**).
- A spot-check on at least 3 P0 drills (d07-pair, d33-pair, d22-pair) confirms the strengthened copy reads correctly on a dev courtside session.

---

- U6. **DrillCheck + Review copy update per R16 (observe / reinforce / question template)**

**Goal:** Apply the Volleyball Canada Person Pillar Guidebook template to DrillCheck difficulty prompts and Review prompts: lead with the named observable for the block (DrillCheck); reflection-question form for `still_learning` rows (Review); reinforcement form for `done` / `easier_next_time` rows (Review).

**Requirements:** R16, AE9.

**Dependencies:** None (independent of U1–U5; can land in parallel).

**Files:**
- Modify: `app/src/screens/DrillCheckScreen.tsx` (confirm filename; locate via `grep -r "DrillCheck" app/src`)
- Modify: `app/src/screens/ReviewScreen.tsx` (confirm filename; locate via `grep -r "Review" app/src/screens`)
- Test: corresponding screen test file(s)

**Approach:**
- Locate the DrillCheck difficulty prompt copy and refactor to: *"Observable for this block: [drill name + measured behavior]. How did it land for you?"* — followed by the existing chip set.
- Derive the observable from `drillName` + `successMetric.description` + `participants.roles[]` if straightforward; fall back to a derived string like `"[drill name] · [count] [rep noun]"` if the metric description is too long to fit.
- For Review's `still_learning` row prompt, replace any current copy with: *"You marked [drill name] as still learning today. What are some of the reasons that might be the right read? What changes between today and the next time you run this?"*
- For Review's `done` / `easier_next_time` prompts, replace with: *"You completed [drill name]. Whatever you noticed working today is worth keeping next time."*
- Honor the existing screen layout and visual hierarchy; this is a copy-only change unless layout breaks (in which case route the layout question to a separate brainstorm).
- No new state, no new schema, no new API.

**Execution note:** If the observable derivation produces awkward strings on real drills (e.g., very long metric descriptions), record it as an open question for a future `observable: string` field; do not add the field in this pass.

**Patterns to follow:**
- Existing chip rendering in `DrillCheckScreen`.
- Existing `still_learning` row rendering in Review.
- Volleyball Canada Person Pillar Guidebook template structure (observe → reinforce → question).

**Test scenarios:**
- Covers AE9. Happy path: opening Review for a `still_learning` row displays the reflection-question copy with the correct drill name interpolated.
- Happy path: opening DrillCheck for a `d33-pair` block displays the observable line (drill name + measured behavior) above the chips.
- Edge case: a drill with very long `successMetric.description` truncates gracefully in the DrillCheck observable line (or wraps within the layout envelope).
- Integration: existing DrillCheck and Review snapshot/screen tests pass after the copy update.

**Verification:**
- DrillCheck and Review prompts render the new copy on real captures (use the 2026-05-10 session's `still_learning` rows as the test specimens).
- Existing capture/review flow tests pass.

---

- U7. **Docs routing + `docs/solutions/` learning + validation**

**Goal:** Register the new ideation, requirements, plan, and assessment artifacts in `docs/catalog.json`. Capture the strengthened rubric as a `docs/solutions/` learning so future drill authors land on the rubric before authoring, not after a partner walkthrough catches the bug. Run the full validation suite.

**Requirements:** R2, R7 (carries from 2026-05-02), plus the durability commitment that the rubric must be discoverable by future authors.

**Dependencies:** U1 (rules text is referenced), U4 (assessment artifact exists), U5 (sweep is complete so the rubric is empirically validated).

**Files:**
- Modify: `docs/catalog.json` (add entries for ideation, requirements, plan, assessment, and the solutions learning)
- Create: `docs/solutions/2026-05-10-drill-first-time-runnability.md` (with YAML frontmatter: `module: app/src/data/drills.ts`, `tags: [drill-copy, courtside-copy, pair-drills, first-time-runnability]`, `problem_type: best-practice`)
- Modify (only if routing-critical changes apply): `AGENTS.md` (cold-start protocol references), `.cursor/rules/*.mdc` (rule cross-references if any rule outside `courtside-copy.mdc` references it)
- Read for verification: `scripts/validate-agent-docs.sh`

**Approach:**
- Add catalog entries for:
  - `docs/ideation/2026-05-10-drill-first-time-runnability-ideation.md` (type: ideation)
  - `docs/brainstorms/2026-05-10-drill-first-time-runnability-requirements.md` (type: requirements; predecessor: `docs/brainstorms/2026-05-02-exercise-copy-contract-requirements.md`)
  - `docs/plans/2026-05-10-004-feat-drill-first-time-runnability-assessment-plan.md` (this plan; type: plan)
  - `docs/reviews/2026-05-10-drill-first-time-runnability-assessment.md` (type: review, from U4)
  - `docs/solutions/2026-05-10-drill-first-time-runnability.md` (type: solution)
- Write the `docs/solutions/` learning as a concise "principles, system, and approach to writing good drills" reference: the READ-DO vs DO-CONFIRM lens at the top, then the rule set summarized in priority order with one worked example each, then a pointer to `.cursor/rules/courtside-copy.mdc` as the canonical rule file. Keep it scan-friendly per the machine-scannable-docs rule.
- Check whether `AGENTS.md` cold-start protocol needs to add this solutions doc to the "App architecture / new feature work" routing slice. If yes, update; if no, leave.
- Run `bash scripts/validate-agent-docs.sh` to confirm doc routing passes.
- Run the full app test suite (`npm test` in `app/`) to confirm no regressions.
- Spot-check `bash scripts/validate-agent-docs.sh` warnings — every new doc should have valid frontmatter (id, title, status, stage, type, summary).

**Patterns to follow:**
- Existing `docs/catalog.json` entries for 2026-05-02 ideation/brainstorm/plan triplet.
- Existing `docs/solutions/` entries for structural style (concise, frontmatter-tagged, pointer-oriented).
- Existing `AGENTS.md` cold-start protocol structure if a new bullet is needed.

**Test scenarios:**
- Happy path: `bash scripts/validate-agent-docs.sh` passes after catalog and solutions additions.
- Happy path: `npm test` in `app/` passes (no regressions across U1–U6 work).
- Integration: a fresh cold-start agent reading `AGENTS.md` → `docs/catalog.json` → `docs/solutions/2026-05-10-drill-first-time-runnability.md` lands on the rubric without consulting the requirements or plan docs.

**Verification:**
- `docs/catalog.json` validates.
- `bash scripts/validate-agent-docs.sh` passes.
- `npm test` in `app/` passes.
- The `docs/solutions/` learning is concise (≤ 2 screens), scan-friendly, and routes to the canonical rule file rather than re-stating the rules.

---

## System-Wide Impact

- **Interaction graph:** RunScreen cue render change (U3) is the only UI behavior change. DrillCheck + Review prompt copy (U6) are visual-only changes; no new state, no new API. Drill copy edits (U5) propagate through the existing snapshot-on-start mechanism — no Dexie migration needed; existing saved plans are not affected.
- **Error propagation:** No runtime error strategy changes. Lints fail loudly at test time, not at runtime.
- **State lifecycle risks:** Existing saved plans snapshot their drill copy at start; updates affect newly generated sessions only. No Dexie schema migration.
- **API surface parity:** No public API or exported model contract changes.
- **Integration coverage:** New regression tests in `drillCopyRegressions.test.ts` (U2) + existing `catalogValidation.test.ts` + existing run-flow tests + existing diagnostics report/triage runs cover the change surface. The strengthened rubric is empirically validated by the U4 assessment + U5 sweep cycle.
- **Unchanged invariants:** `workload`, `fatigueCap`, `participants` envelope size, `equipment`, `environmentFlags`, `skillFocus`, `m001Candidate`, progression-graph semantics, Dexie schema (v6), and generated-plan diagnostics report shape all remain unchanged.

---

## Risks & Dependencies

| Risk | Mitigation |
|------|------------|
| R9 role-tagged-sentence lint is too aggressive (false-positive on well-formed pair drills) | Use heuristic; tune the heuristic during U2 first run; downgrade to checklist if false positives exceed ~ 2 of 14 pair drills. |
| R14 aloud-read ceiling is too aggressive on warmup/cooldown drills with named segments | Word count excludes `segments[].label` strings — segments live in their own UI lane. If the ceiling still fires on drills that legitimately need long prose (e.g., introduction of a new variant), grant a per-drill exception via an inline comment that the lint respects (`// r14-exception: <reason>`). |
| Rule-2 movement-vocabulary lint catches well-glossed forms (false positive on the gloss itself) | Heuristic looks for a parenthetical or inline-clause spatial referent in the same sentence as the first occurrence; tune during U2 first run; reduce token list if false positives are high. |
| Operational-scoring-vocabulary lint fires on drills where the graded term is the score metric itself (legitimate use) | Test scans `successMetric.description` only; the metric-target value is exempt; inline operational definition in the same string is the gloss. |
| U5 sweep accidentally widens a drill's scope or changes its envelope | Strict envelope-honesty discipline; U5 commit per priority tier and rerun catalog validation. Record any structural mismatch in the U4 assessment artifact rather than patching with copy. |
| U3 `RunScreen` change accidentally hides a critical cue for an existing user (impacts founder-use mode mid-session) | Characterization-first test; default-closed affordance is visible; one-cue-default is the strengthened-rubric default but the affordance is always present when `coachingCues.length > 1`. Roll out in the same release as U5 so the cue ordering is already corrected when the render change ships. |
| The READ-DO vs DO-CONFIRM lens adds doc cognitive load without paying for itself | Lens lives at the top of the canonical rule file and tags each rule once. If subsequent authors find it confusing, the tags can be removed without losing the rule content. |
| U4 assessment is subjective and varies session-to-session | Document the classification heuristic explicitly in the artifact's framing section; U2 lints provide the empirical anchor. The rewrite vs repair line is "≥ 4 rule failures OR structural rewrite needed" — encoded in the artifact's methodology. |
| Generated diagnostics report shifts due to copy changes (unlikely but possible if any diagnostic-adjacent string is touched) | Run `npm run diagnostics:report` and `npm run diagnostics:triage` after U5 sweep completes and before U7 docs sync; investigate any shift attributable to copy. |
| Docs routing drift | Update `docs/catalog.json` in U7 alongside all new docs; run `bash scripts/validate-agent-docs.sh`. |

---

## Documentation / Operational Notes

- The 2026-05-10 ideation, requirements, plan, and assessment artifacts plus the `docs/solutions/` learning are durable docs registered in `docs/catalog.json` (U7).
- The 2026-05-02 baseline (`docs/brainstorms/2026-05-02-exercise-copy-contract-requirements.md`, `docs/plans/2026-05-02-017-feat-exercise-copy-contract-plan.md`) stays intact — this work extends, not supersedes.
- `.cursor/rules/courtside-copy.mdc` continues to be the canonical rule file. Rules 8–12 add on; rule 2 / 3 / 5 / 7 extensions sub-bullet under the existing rules.
- The `docs/solutions/` learning is the discoverability anchor for future authors. Keep it concise; route to the canonical rule file for the full rule text.
- After U5 sweep completes, document any structural mismatches discovered (cases where copy issues pointed at envelope problems) as separate research notes or follow-up brainstorms — do not patch them with copy.
- The next D130 session is the falsification surface for the strengthened rubric. If `d07-pair` / `d33-pair` / `d22-pair` re-surface "who does what / when / what counts" confusion after the sweep, capture it in `docs/research/founder-use-ledger.md` and revisit the rules.

---

## Sources & References

- **Origin document:** [docs/brainstorms/2026-05-10-drill-first-time-runnability-requirements.md](../brainstorms/2026-05-10-drill-first-time-runnability-requirements.md)
- **Predecessor requirements:** [docs/brainstorms/2026-05-02-exercise-copy-contract-requirements.md](../brainstorms/2026-05-02-exercise-copy-contract-requirements.md)
- **Predecessor plan:** [docs/plans/2026-05-02-017-feat-exercise-copy-contract-plan.md](2026-05-02-017-feat-exercise-copy-contract-plan.md)
- **Ideation artifact:** [docs/ideation/2026-05-10-drill-first-time-runnability-ideation.md](../ideation/2026-05-10-drill-first-time-runnability-ideation.md)
- **2026-05-10 session findings:** [docs/research/2026-05-10-pair-net-serving-duration-feedback.md](../research/2026-05-10-pair-net-serving-duration-feedback.md)
- **Founder-use ledger:** [docs/research/founder-use-ledger.md](../research/founder-use-ledger.md)
- **Adversarial memo:** [docs/plans/2026-04-20-m001-adversarial-memo.md](2026-04-20-m001-adversarial-memo.md)
- **Source synthesis notes:**
  - [docs/research/fivb-coaches-manual-crosscheck.md](../research/fivb-coaches-manual-crosscheck.md)
  - [docs/research/ltd3-development-matrix-synthesis.md](../research/ltd3-development-matrix-synthesis.md)
  - [docs/research/bab-source-material.md](../research/bab-source-material.md)
  - [docs/research/practice-plan-authoring-synthesis.md](../research/practice-plan-authoring-synthesis.md)
  - [docs/research/outdoor-courtside-ui-brief.md](../research/outdoor-courtside-ui-brief.md)
- **Adjacent precedent:** [docs/research/2026-04-27-cca2-dogfeed-findings.md](../research/2026-04-27-cca2-dogfeed-findings.md) (F8 `d33-pair` skill-verb finding)
- **Copy rules:** `.cursor/rules/courtside-copy.mdc`
- **Drill catalog:** `app/src/data/drills.ts`
- **Drill schema:** `app/src/types/drill.ts`
- **Copy tests:** `app/src/data/__tests__/drillCopyRegressions.test.ts`
- **Catalog validation tests:** `app/src/data/__tests__/catalogValidation.test.ts`
