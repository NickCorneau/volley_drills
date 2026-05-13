---
id: drill-first-time-runnability-requirements-2026-05-10
title: Drill First-Time-Runnability Requirements (Extension of 2026-05-02 Exercise Copy Contract)
status: active
stage: validation
type: requirements
summary: "Extends the 2026-05-02 exercise-copy-contract requirements with a first-time-runnability rubric grounded in today's D130 session confusion (pair-drill role coordination, scoring vocabulary, termination, cadence, movement vocabulary) and synthesized from BAB / FIVB / Volleyball Canada Person Pillar Guidebook plus motor-learning literature. Drives a new courtside-copy contract pass (rules 8-12) and a per-drill assessment sweep across all 26 M001-candidate drills."
date: 2026-05-10
topic: drill-first-time-runnability
extends: docs/brainstorms/2026-05-02-exercise-copy-contract-requirements.md
depends_on:
  - .cursor/rules/courtside-copy.mdc
  - docs/brainstorms/2026-05-02-exercise-copy-contract-requirements.md
  - docs/plans/2026-05-02-017-feat-exercise-copy-contract-plan.md
  - docs/ideation/2026-05-10-drill-first-time-runnability-ideation.md
  - docs/research/2026-05-10-pair-net-serving-duration-feedback.md
  - docs/research/founder-use-ledger.md
  - docs/research/fivb-coaches-manual-crosscheck.md
  - docs/research/ltd3-development-matrix-synthesis.md
  - docs/research/practice-plan-authoring-synthesis.md
  - docs/research/outdoor-courtside-ui-brief.md
---

# Drill First-Time-Runnability Requirements

## Relation to the 2026-05-02 baseline

This document **extends** the 2026-05-02 `exercise-copy-contract-requirements.md` rather than replacing it. The 2026-05-02 doc remains the source-of-truth for R1–R8 (the existing writing contract, runtime clarity, and quality guardrails) and for the `Why / Setup / Do / Score-or-stop / Cue / Scale` field map. R9–R16 below are net-new requirements added on top, driven by the 2026-05-10 session evidence.

All R1–R8 commitments carry forward unchanged. The implementation plan for R1–R8 shipped via `docs/plans/2026-05-02-017-feat-exercise-copy-contract-plan.md` (status: complete). This extension drives a fresh plan that adds rules 8–12 to `.cursor/rules/courtside-copy.mdc`, lands new regression tests, and runs a per-drill assessment sweep against the strengthened rubric.

---

## Problem Frame

The 2026-04-21 partner walkthrough produced 7 copy invariants (`.cursor/rules/courtside-copy.mdc`) that catch a specific failure class: **author vocabulary leaking into courtside copy**. The 2026-05-02 contract operationalized those invariants and shipped a regression-tested copy sweep across all M001-candidate drills.

The 2026-05-10 D130 session (Tony + Seb, 7th D130 session, pair-net serving, 38 min) ran three drills — `d10-pair`, `d33-pair-open`, `d22-pair` — and **all three captured `still_learning` with zero streaks**. The founder named a recurring confusion class **"peak and flash / number drill"** — drills where a partner has a non-obvious cuing or scoring role, and the first-time courtside reader cannot tell at first glance *who does what, when, what counts*. The persistent "warmup pacing feels off" pattern (`d28 Beach Prep Three`) recurred.

The existing 7 invariants do not catch this class. The 2026-04-27 cca2 dogfeed on `d33-pair` already established the **skill-verb-first** invariant (rule 6) for an adjacent bug shape (*"is this a serving drill?"*). The 2026-05-10 evidence is the same class one level deeper: skill verb leads, but role coordination, partner cuing, scoring vocabulary, and termination are still under-spec'd.

The fix is a **first-time-runnability rubric** that holds drill copy to a higher bar: a courtside reader on first encounter, on a sun-lit phone 1–3 m away, partner present but also new to the drill, must be able to execute the drill correctly without re-reading and without arguing with the partner about who is doing what. The rubric is sourced from BAB (practical practice grammar), FIVB Coaches Manual (Fitts & Posner motor stages, cue density, feedback cadence, whole-practice bias), Volleyball Canada Person Pillar Guidebook (observe / reinforce / question coaching-copy template), and motor-learning literature (Wulf external focus, Vickers Quiet Eye, Bandura modeling), cross-checked against today's specimens.

---

## Actors

Carries forward from 2026-05-02 unchanged:

- **A1. Courtside player**: reads the active drill on a phone and needs to know what to do next, what counts, and how to adjust.
- **A2. Future catalog author**: adds or edits drill content and needs a compact standard for writing exercise text.
- **A3. Reviewing agent or maintainer**: checks copy changes against product constraints, metadata envelopes, and tests.

Extension actor:

- **A4. Partner reader (pair mode)**: shares a single phone with A1 during a pair drill and reads `courtsideInstructions` for the partner role's tasks. A4 may pick up the phone mid-session to confirm the cuing or shagging role; they need to find themselves named as a grammatical subject in at least one sentence, not only as an object inside the doer's instruction.

---

## Key Flows

Carries forward F1 (Copy review pass) and F2 (Courtside reading) from 2026-05-02 unchanged.

Extension flow:

- **F3. Pair-drill first-read flow**
  - **Trigger**: A1 and A4 open a pair-drill TransitionScreen for the first time, with the partner present.
  - **Actors**: A1, A4
  - **Steps**: A1 (or A4) reads `courtsideInstructions` aloud once. Both readers can answer the five logistics questions (who starts, what defines a round, what counts, what to do on a miss, when the drill ends) without re-reading. The partner can identify themselves as the grammatical subject of at least one sentence and knows their cuing/shagging/scoring channel (voice / fingers / call / shag-after-round). They start the drill without back-and-forth disambiguation.
  - **Outcome**: First-rep execution matches drill intent; subsequent reps refine technique rather than re-litigating logistics.
  - **Covered by**: R9, R10, R11, R12

- **F4. Returning-reader re-glance flow (rep 50)**
  - **Trigger**: A1 returns to a previously-learned drill in a later session and needs to confirm the active-block parameters without re-learning the drill.
  - **Actors**: A1 (plus A4 for pair drills)
  - **Steps**: A1 starts the block. The `RunScreen` shows the load-bearing triple — `skillFocus` (eyebrow) + `successMetric.description` + `coachingCues[0]` — plus the timer or rep target. A1 confirms what they are doing from those fields alone, without re-reading `courtsideInstructions`. If A1 needs to re-read prose, the triple is under-spec'd and the drill record needs strengthening.
  - **Outcome**: Returning sessions stay in flow; the active-run UI envelope (6 fields) is sufficient at rep 50.
  - **Covered by**: R13, R14

- **F5. Capture and review flow**
  - **Trigger**: A1 completes a drill and enters DrillCheck (difficulty + optional streak); later, A1 opens the Review screen for `still_learning`-marked drills.
  - **Actors**: A1
  - **Steps**: DrillCheck shows the **observable** for the block ("six serves, partner called a zone before each one") before chips. Review shows a templated **reflection prompt** for `still_learning` and a templated **reinforcement prompt** for `done`. No diagnoses, no judgments — observe, reinforce, question.
  - **Outcome**: Capture is grounded in an observable; review converts `still_learning` signals into self-generated next actions instead of black-box mood signals.
  - **Covered by**: R16

---

## Requirements

R1–R8 carry forward from 2026-05-02 unchanged. R9–R16 are net-new.

### Pair-drill coordination clarity (the "peak and flash" cluster)

- **R9. Either-reader role-tagged sentences.** For any drill where `participants.roles[]` has length ≥ 2, `courtsideInstructions` must contain at least one sentence per role where that role is the grammatical subject of an active verb. Pattern recommendation: open with `"You [role A]; partner [role B]."`, then lead the skill verb (existing rule 6 compatible). A partner appearing only as an object inside another role's instruction does not satisfy this requirement.

- **R10. Cue→action coupling microformat.** Where a partner cue triggers an action, `courtsideInstructions` must bind cue and action in one syntactic unit. Permitted microformat: arrow (`→`) within a sentence, or the `"On X, Y."` pattern. Conjunction-and ("X and Y") that implies "do both simultaneously" must be split or rewritten with explicit sequence verbs ("first", "then", "while", "between") for actions that are not literally simultaneous.

- **R11. Five-question logistics checklist for pair drills.** Each pair-drill `courtsideInstructions` must answer five logistic questions, in any order, in any number of sentences:
  - (1) Who starts? (2) What defines a round or a turn? (3) What counts as success this rep? (4) What to do on a miss? (5) When does the drill end if neither success nor budget triggers cleanly?
  - Test: if a question cannot be answered by pointing at a specific sentence, the rule is not satisfied.

- **R12. Spatial point-of-view anchor.** Every spatial directive in `courtsideInstructions` (zone names, "front-left", "the same side", "across") must be anchored to an explicit reference body. For serving drills, the default is *from server's POV* unless explicitly stated otherwise. For pair drills, the first setup sentence must carry the POV anchor.

### Structural sufficiency for re-glance reading (the "rep-50" cluster)

- **R13. Triple-only readability (load-bearing reading triple).** A drill must be re-runnable from `skillFocus` (rendered as eyebrow) + `successMetric.description` + `coachingCues[0]` alone, without re-reading `courtsideInstructions`. Authoring review test: *"if `courtsideInstructions` were deleted, would the triple still get the reader through?"* If no, the triple is under-spec'd; the fix lives in the triple, not in lengthening the prose. Apply to all M001-candidate drills.

- **R14. `courtsideInstructions` aloud-read ceiling.** `courtsideInstructions` must read aloud in ≤ 15 seconds (~ 40 words at 150 wpm). When prose exceeds the ceiling, the overflow must move into structured fields — `segments`, `successMetric.description`, `coachingCues[]`, or `participants.roles` — that the active-run UI already renders. Mechanically lintable.

### Cue ordering and cognitive load (the "first cue is load-bearing" cluster)

- **R15. Cue ordering rule for `coachingCues[]`.** Composite requirement with four sub-rules:
  - (a) **One cue rendered by default**: `RunScreen` shows only `coachingCues[0]`. Remaining cues sit behind a `Show more cues` affordance that defaults closed. `[0]` must stand alone — it is not part of a multi-cue narrative.
  - (b) **External focus**: `coachingCues[0]` names an outcome (ball flight, target, partner reach, landing mark, contact sound) or an environmental referent, not a body part / joint / muscle / internal sensation. Cues that fail must be rewritten, or must carry an inline `// internal-focus exception: <reason>` comment explaining why an internal cue is load-bearing here (e.g., safety on a jump-float shoulder cue).
  - (c) **Gaze target first for perceptual-cognitive drills**: for drills whose `successMetric` references a perceptual decision (read drills, partner-cued drills, look-and-react drills), `coachingCues[0]` names the gaze target and the moment of gaze commit. Pattern: *"Look at [target] [the moment of contact / immediately after / before the pass leaves your platform]."*
  - (d) **Doer-POV requirement**: ≥ 1 of `coachingCues[]` must pass the doer-POV test — phrased as a felt outcome or observable result the doer can self-check mid-rep without an observer present. Coverage rule, not replacement.

### Capture / review surfaces

- **R16. Observe / reinforce / question template for capture and review copy.** DrillCheck and Review prompts apply the Volleyball Canada Person Pillar Guidebook template:
  - **DrillCheck difficulty prompt**: lead with the named observable for the block (drill name + measured behavior), then the chips. The reader grades against an observable, not a vibe.
  - **Review reflection prompt for `still_learning` marks**: reflection-question form — *"You marked [drill name] as still learning today. What are some of the reasons that might be the right read? What changes between today and the next time you run this?"*
  - **Review reinforcement prompt for `done` / `easier_next_time` marks**: reinforcement form — *"You completed [drill name]. Whatever you noticed working today is worth keeping next time."*
  - No diagnoses; no judgments. The template owns the tone.

### Sweep-only extensions (operational, no new contractual surface)

The following are operational refinements that fold into rule 2 (jargon gate), rule 3 (no combinatorics), rule 7 (audible structure), and rule 5 (equal-weight wrap/cooldown) rather than standing as new requirements. They are documented here for the sweep planner.

- **Movement-vocabulary inline spatial gloss (extends rule 2).** Named movements outside one-season-rec-player vocabulary (A-skip, ankle hops, RDL, half-kneel, pivot-back start, lateral shuffle, runner's lunge, hip flexor stretch) must carry a one-clause spatial-referent gloss inline on first use per drill. Pattern: `[name] (= [where the body is, what it touches, what direction it moves])`.
- **Logistics-jargon gloss (extends rule 2).** Extend the flagged-vocabulary table with logistics terms: `shag`, `round`, `attempt`, `miss`, `reset`, `switch`, `turn`, `swap`, `rotate`. First use glossed inline.
- **Operational scoring vocabulary.** `successMetric.description` strings that use graded or qualitative terms (*"grade 2+ pass"*, *"good pass"*, *"controlled set"*) must be self-contained — the operational definition appears inline. Inherited-from-coaching grading scales are autonomous-stage knowledge and require a scaffold.
- **Windowed grading cadence.** Per-rep judging metrics must phrase the grading unit as a window of ≥ 3 reps, not a per-rep verdict. Matches FIVB feedback-cadence rule.
- **Three-clause termination rule.** Every drill's stop rule must answer success-stop, time/rep-budget-stop, and fallback (miss-loop, time-up without winner, fatigue cap).
- **Cadence format on timed segments (extends rule 7).** When `segments[].durationSec` carries a duration, name the work format: continuous, rep-paced, work-rest, or accumulator.
- **One-action-per-sentence floor (extends rule 3).** Action sequences cannot interleave coupled actions and conditions in a single compound sentence. Split or sequence-verb.
- **Whole-practice context disclosure for part-practice drills.** Drills with non-live feed types name the whole-skill context the part serves and which FIVB exception (fear/danger/frustration/complexity) justifies isolating it.
- **Bracket-repeat microformat as permitted exception to rule 3.** Permit `(action → action → action) × N <units>, in order: ...` for sequenced repetition.

---

## Acceptance Examples

Carries forward AE1–AE4 from 2026-05-02 unchanged. New acceptance examples added:

- **AE5. Covers R9, R10.** Given `d07-pair "Pass & Look"`, when the copy is rewritten, the new `courtsideInstructions` opens with *"You pass; partner flashes a number 1–5 with their fingers the moment your platform meets the ball."* — the partner appears as the grammatical subject of an active verb, and the partner's cue is coupled to its action via an explicit time-binding (*"the moment your platform meets the ball"*). The drill becomes runnable on first read by either reader.

- **AE6. Covers R11, R12.** Given `d33-pair "Around the World Serving"`, when the copy is rewritten, the new `courtsideInstructions` names: (1) the starting server, (2) what a round is (the 6-serve zone ladder), (3) what counts (the ball landing in the called zone), (4) the miss-repeat rule with an escape clause (e.g., "after 3 misses on the same zone, move on and revisit at the end"), (5) the end condition. Zones are anchored to server's POV (*"from your side of the net: front-left = the receiver's back-right corner"* or similar).

- **AE7. Covers R13, R14.** Given any M001-candidate drill, when an authoring reviewer runs the triple-only probe, the reader can describe what to do next, what counts, and the first cue using only `skillFocus` + `successMetric.description` + `coachingCues[0]`. The `courtsideInstructions` reads aloud in ≤ 15s and any prose that would exceed the ceiling has been routed to `segments`, `successMetric.description`, `coachingCues[]`, or `participants.roles`.

- **AE8. Covers R15.** Given `d07-pair "Pass & Look"` (a perceptual-cognitive drill), when the cues are rewritten, `coachingCues[0]` is *"Look at your partner's hand the moment your platform meets the ball."* (gaze target + gaze-commit moment, external focus). The previous internal cue *"Be stable during pass to buy time to look"* moves to `coachingCues[1]`. The `RunScreen` shows only `[0]` by default. At least one cue in the list is doer-POV (felt outcome or self-checkable observable).

- **AE9. Covers R16.** Given a `still_learning` capture for `d33-pair`, when the player opens Review for that row, the prompt reads — *"You marked Around the World Serving as still learning today. What are some of the reasons that might be the right read? What changes between today and the next time you run this?"* — and the player can self-generate a next action without the app diagnosing.

---

## Success Criteria

- A first-time pair of readers (founder + partner who has not seen the drill) can execute any M001-candidate pair drill correctly on the first read of `courtsideInstructions`, without re-reading and without partner-disambiguation arguments.
- A returning reader on rep 50 of a previously-learned drill can re-enter the drill from the load-bearing triple alone (`skillFocus` + `successMetric.description` + `coachingCues[0]`).
- The 2026-05-10 confusion class is retired: the next D130 session run of `d07-pair`, `d33-pair`, and `d22-pair` does not surface "who does what / when / what counts" as a question.
- `coachingCues[]` priority ordering becomes contractually meaningful — `[0]` is the load-bearing cue, externally focused, doer-checkable, gaze-targeted where applicable.
- The drill-quality rubric is **measurable** (R13, R14, R15(a) are mechanically lintable) and **trace-able** (each new rule cites the founder-session or partner-walkthrough evidence that motivates it).
- The strengthened rubric remains compatible with the 2026-05-02 contract (R1–R8) and with the existing 7 invariants in `.cursor/rules/courtside-copy.mdc` — no rollback, only extension.
- The `.cursor/rules/courtside-copy.mdc` invariant set grows to ~ 10–12 rules but each new rule carries a partner-walkthrough or founder-session warrant per the contract's origin discipline.

---

## Scope Boundaries

Carries forward 2026-05-02 scope boundaries unchanged. Additionally:

- **Do not** add the `expectedMisreading`, `crux`, `stopRule`, `pacing[]`, or `vocabPreflight[]` schema fields as part of this pass. These are explicitly **deferred** to a follow-up schema decision (see Theme G in the ideation artifact). The copy-only sweep delivers the value without them.
- **Do not** ship the pacing-audio infrastructure as part of this pass. Rule 7's named shipping gap remains a gap; copy is written *as though* audible pacing exists per the existing rule 7 guidance.
- **Do not** open the D101 3+ player support question. R9 (role-tagged sentences) and R11 (logistics checklist) apply equally to future 3+ player drills when D101 unblocks them, but no new 3+ player drills are authored under this pass.
- **Do not** redesign the DrillCheck or Review screens as part of this pass. R16 is a copy-and-template change on existing screens; deeper UX restructuring is a separate brainstorm.
- **Do not** rewrite inactive reserve drills unless an active drill's copy or shared tests reference them.
- **Do not** widen workload, fatigue, equipment, source, or participant envelopes to make copy easier (envelope-honesty rule from 2026-05-02 carries forward).

---

## Key Decisions

- **Extend, do not replace, the 2026-05-02 baseline.** R1–R8 remain the source of truth; R9–R16 are net-new requirements added on top. The original document stays intact.
- **Copy-first sweep, schema-later.** Themes A–F from the ideation artifact are copy-only or template-only; Theme G (schema additions) is deferred to a follow-up decision. Reduces blast radius and lets the strengthened rubric land within one sprint.
- **Adopt READ-DO vs DO-CONFIRM as the unifying lens** (Gawande). Pre-run TransitionScreen consumption is READ-DO (full prose, full glossing). Active-run RunScreen consumption is DO-CONFIRM (load-bearing triple, structured fields). R13 and R14 enforce the DO-CONFIRM surface; R9–R12 and rule-2 extensions live on the READ-DO surface.
- **`coachingCues[0]` becomes contractually meaningful.** Today the cue list is treated as 2–3 cues of equal weight. The cue-ordering rule (R15) makes `[0]` the load-bearing first cue, with sub-rules on external focus, gaze target, and doer-POV. The `RunScreen` change to render only `[0]` by default is part of this rubric extension.
- **Capture/review surfaces follow Person Pillar template** (R16). DrillCheck + Review are distinct from drill copy itself but apply the same observe-reinforce-question discipline.
- **Mechanical lintability is the gate for first-class rules.** R13, R14, R15(a) are mechanically lintable and earn regression-test slots. Other rules (R9, R10, R11, R12, R15(b–d), R16) are review-checklist items unless and until a tighter pattern emerges. AE-grade rules with worked examples are the bridge.

---

## Dependencies / Assumptions

- The 2026-05-02 baseline requirements remain authoritative for R1–R8 and the field map.
- The current 7-invariant courtside-copy contract (`.cursor/rules/courtside-copy.mdc`) remains the canonical voice/vocabulary surface; this extension adds rules 8–12 on top.
- The active drill catalog (currently 26 `m001Candidate: true` drills) is the immediate review target.
- D130 founder-use mode continues; partner walkthroughs and founder sessions remain the falsification surface for the strengthened rubric.
- Existing catalog validation tests (`app/src/data/__tests__/`) remain authoritative; new tests are additive.
- The pacing-audio infrastructure is deferred and rule 7 continues to be honored as a shipping-gap rule.
- Schema additions (Theme G) are deferred; the copy-only sweep does not block on them.

External research informs the principles; local product constraints decide what the copy change is allowed to do. Carrying forward from 2026-05-02.

---

## Outstanding Questions

### Resolve Before Planning

- None. All resolution-blocking questions are addressed in this document and the 2026-05-02 baseline. Plan can proceed.

### Deferred to Planning

- **[Affects R13, R14][Technical]** What is the exact CI lint shape for the triple-only probe (R13) and the TTS-time ceiling (R14)? R14 is more concrete (word count + sentence-count thresholds); R13 may need an author-side checklist rather than a mechanical lint.
- **[Affects R15(a)][Technical]** What is the `RunScreen` change to render `coachingCues[0]` only by default with a `Show more cues` affordance? Does this live in `RunScreen.tsx`, `DrillCard.tsx`, or both?
- **[Affects R16][Technical]** Does R16 require a new `observable: string` field on `DrillVariant` (or `Drill`) to make the DrillCheck observable prompt mechanical, or is it sufficient to derive the observable from existing fields (`successMetric.description` + `participants.roles`)? Lean toward derivation first; field-add only if the derivation fails on real drills.
- **[Affects deferred sweep extensions][Technical]** Which of the operational refinements (movement gloss, logistics gloss, operational scoring, windowed cadence, termination, cadence format, sentence-action floor, part-practice disclosure, bracket microformat) should land as regression tests vs. authoring-checklist items? Bias: lint where mechanical; checklist where it requires judgment.
- **[Affects assessment pass][Technical]** Should the per-drill assessment sweep produce a row-per-drill output (passing/needs-repair/needs-rewrite) as a markdown table inside the plan, or as a separate `docs/reviews/2026-05-10-drill-first-time-runnability-assessment.md` artifact? Lean toward separate artifact so the plan stays compact.

---

## Next Steps

- **`/ce-plan`** for a structured implementation plan that:
  - Updates `.cursor/rules/courtside-copy.mdc` with rules 8–12 (R9–R12 + R15) plus the rule-2 / rule-3 / rule-7 extensions for the sweep-only items.
  - Lands new regression tests in `app/src/data/__tests__/drillCopyRegressions.test.ts` for R9 (role-tagged sentence), R14 (TTS-time ceiling), and the rule-2 extension lints (movement-jargon, logistics-jargon, operational-scoring).
  - Updates `RunScreen` (or the equivalent) to render `coachingCues[0]` only by default with a `Show more cues` affordance (R15(a)).
  - Sweeps the 26 active drills against the strengthened rubric, producing a per-drill assessment row and rewriting copy where needed.
  - Updates DrillCheck + Review prompts per R16 (observe / reinforce / question template).
  - Lists Theme G schema additions as deferred follow-up work.
- **Parallel research note** to capture the strengthened rubric as a referenceable principle set under `docs/solutions/` (or `docs/research/`) so future drill authors land on the rubric before authoring, not after a partner walkthrough catches the bug.
