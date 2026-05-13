---
id: drill-first-time-runnability-system
title: "Drill first-time-runnability system (principles, rubric, system, approach)"
status: active
stage: validation
type: solution
summary: "Principles, rubric, system, and approach for writing drills that a first-time courtside reader can execute correctly without a coach. Synthesized from BAB practice grammar + FIVB Coaches Manual (Fitts & Posner motor stages, cue-density rule, feedback cadence, whole-practice bias) + Volleyball Canada Person Pillar Guidebook (observe / reinforce / question) + motor-learning literature (Wulf external focus, Vickers Quiet Eye, Bandura modeling, Mayer multimedia principles, Gawande READ-DO vs DO-CONFIRM) + 2026-04-21 partner-walkthrough origin + 2026-05-10 D130 founder-session evidence."
module: app/src/data/drills.ts
tags: [drill-copy, courtside-copy, pair-drills, first-time-runnability, rubric, principles]
problem_type: best-practice
authority: durable principles + rubric for drill authoring; not a product decision (product decisions live in docs/decisions.md)
last_updated: 2026-05-10
depends_on:
  - .cursor/rules/courtside-copy.mdc
  - docs/brainstorms/2026-05-02-exercise-copy-contract-requirements.md
  - docs/brainstorms/2026-05-10-drill-first-time-runnability-requirements.md
  - docs/plans/2026-05-10-004-feat-drill-first-time-runnability-assessment-plan.md
  - docs/reviews/2026-05-10-drill-first-time-runnability-assessment.md
related:
  - docs/research/2026-05-10-pair-net-serving-duration-feedback.md
  - docs/research/fivb-coaches-manual-crosscheck.md
  - docs/research/ltd3-development-matrix-synthesis.md
  - docs/research/bab-source-material.md
  - docs/research/outdoor-courtside-ui-brief.md
  - docs/research/partner-walkthrough-results/2026-04-21-tier-1a-walkthrough.md
  - docs/ideation/2026-05-10-drill-first-time-runnability-ideation.md
---

# Drill first-time-runnability system

## TL;DR

A first-time courtside reader on a sun-lit phone 1–3 m away, partner present but also new to the drill, must be able to execute the drill correctly on the first read of `courtsideInstructions`. Authoring rules live in `.cursor/rules/courtside-copy.mdc` (14 invariants). The unifying frame is **READ-DO vs DO-CONFIRM** (Gawande): pre-run TransitionScreen copy is READ-DO (full prose); active-run RunScreen re-glance is DO-CONFIRM (load-bearing triple, structured fields). The mechanical lints in `app/src/data/__tests__/drillCopyRegressions.test.ts` enforce the lintable rules; reviewer-checklist rules are caught at PR review.

## When to use

- Authoring a new drill or variant in `app/src/data/drills.ts`.
- Editing existing drill copy (`courtsideInstructions`, `coachingCues`, `successMetric.description`, `segments[].label`).
- Reviewing a drill PR.
- Investigating a `still_learning` cluster in `docs/research/founder-use-ledger.md`.
- Updating `DrillCheck` or `Review` prompts.

## Not for

- Marketing copy or general documentation (scope is drill catalog + courtside UI).
- Replacing `.cursor/rules/courtside-copy.mdc` — this doc is a pointer-oriented anchor; the canonical rules are there.
- Replacing the per-drill assessment artifact (`docs/reviews/2026-05-10-drill-first-time-runnability-assessment.md`).

## The reader model

Codified in `.cursor/rules/courtside-copy.mdc` rule 2: a **one-season rec beach-volleyball player**, on a phone, set down 1–3 m away in sand or on a beach bench, sun overhead, partner present. They read with their eyes, but their attention is on the ball about to be tossed. They will not stop, search a glossary, or re-read. If they cannot execute on the first read, the drill failed; the reader did not.

## Principles (in priority order)

### 1. Two consumption modes, two writing registers

The drill card is consumed in two distinct phases:

- **READ-DO** — pre-run on `TransitionScreen`. Full prose, full glossing, full context. The reader has 20–30 seconds to read once before starting.
- **DO-CONFIRM** — mid-run re-glance on `RunScreen`. Structural-field shorthand: load-bearing triple (`skillFocus` + `successMetric.description` + `coachingCues[0]`) + timer + progress + primary controls. Active-run UI envelope is 6 fields max (`docs/research/outdoor-courtside-ui-brief.md`).

Origin: Gawande, *The Checklist Manifesto* (2009), Ch. 6. The rules in `.cursor/rules/courtside-copy.mdc` carry `[READ-DO]` / `[DO-CONFIRM]` tags so authors know which surface each rule governs.

### 2. Role coordination is the founder-named bug class

The 2026-05-10 D130 session named the recurring confusion class **"peak and flash / number drill"**: drills where a partner has a non-obvious cuing or scoring role and the first-time reader cannot tell at first glance *who does what, when, what counts*. Three of three drills in that session captured `still_learning`. Rule 8 (role-tagged sentences) + rule 9 (cue→action coupling) + rule 10 (5-question logistics checklist) + rule 11 (spatial POV anchor) retire this class. Together: **every pair drill names both roles as grammatical subjects, binds cues to actions in single syntactic units, and answers who-starts / what-is-a-round / what-counts / what-on-miss / when-does-it-end.**

### 3. `coachingCues[0]` is load-bearing

Rule 12 (cue ordering) makes the first cue contractual:

- **One cue rendered by default** (FIVB Fitts & Posner cognitive-stage default; RunScreen render).
- **External focus** on `[0]` (Wulf 2013) — name an outcome (ball flight, target, partner reach, landing mark, contact sound), not a body part / joint / muscle.
- **Gaze target first** for perceptual-cognitive drills (Vickers 2007 Quiet Eye) — pattern: *"Look at [target] [the moment of contact / immediately after / before X]."*
- **≥ 1 doer-POV cue** anywhere in the list — phrased as a felt outcome the doer can self-check without an observer.

Priority order is meaningful: author the cue list in priority order, not narrative order.

### 4. Structural sufficiency beats prose

Rule 13: a drill must be re-runnable from `skillFocus` + `successMetric.description` + `coachingCues[0]` **alone**, without re-reading `courtsideInstructions`. Authoring test: *"If `courtsideInstructions` were deleted, would the triple still get the reader through?"* If no, the triple is under-spec'd; the fix lives in the triple, not in longer prose.

Rule 14 gives this lint-able teeth: `courtsideInstructions` ≤ 45 words (≈ 15s aloud). Overflow routes into structured fields (`segments`, `successMetric.description`, `coachingCues[]`, `participants.roles`).

### 5. Demonstration substitution: spatial referents for named movements

Coaches show movements; static text cannot. Rule 2's movement-vocabulary extension requires named movements outside everyday English (`A-skip`, `ankle hops`, `lateral shuffles`, `pivot-back start`, `runner's lunge`, `half-kneel`, `hip flexor`, `RDL`) to carry an inline spatial-referent gloss on first use:

```
A-skip (= skip forward, lifting the front knee until the thigh is parallel to the sand)
```

Origin: Bandura *Social Foundations of Thought and Action* (1986) + Magill *Motor Learning and Control* Ch 14 + ACSM exercise-prescription convention.

### 6. Operational scoring vocabulary

Rule 2's scoring-vocabulary extension: when `successMetric.description` uses graded vocabulary (`grade 2+`, `graded 2+`, `good pass`, `controlled set`, `in-system`), the operational definition appears inline in the same string:

```
Passes graded 2+ (= ball lands within 1 m of the set window with enough arc to be settable) across 24 tosses.
```

Inherited-from-coaching grading scales are autonomous-stage knowledge. Self-coached settings need the scaffold.

### 7. Windowed grading cadence

For success metrics that involve per-rep judgment, phrase the grading unit as a window of ≥ 3 reps, not a per-rep verdict. Origin: FIVB Coaches Manual Ch III.8 (feedback cadence: 2-3 trials between coach prompts) + Salmoni / Schmidt / Walter (1984) guidance hypothesis. In a self-coached setting the cadence rule lives in the *shape* of the success metric.

### 8. Observe / reinforce / question for capture and review

Rule 16's source: Volleyball Canada *Person Pillar Guidebook for Coaches*. DrillCheck and Review prompts apply the three-artifact template:

- **DrillCheck** leads with the observable for the block (drill name + measured behavior) before the chips. The reader grades against an observable, not a vibe.
- **Review** uses a Person Pillar reflection-question prompt for `still_learning` rows; reinforcement for `done` / `easier_next_time` rows.
- *Observe, reinforce, question — do not judge.*

## Rubric (per-variant)

When authoring or reviewing a drill variant, apply this checklist. Mechanical lints in `app/src/data/__tests__/drillCopyRegressions.test.ts` catch the rules marked **[lint]**; the rest are PR-review items.

| # | Rule | Surface | Class |
|---|---|---|---|
| 1 | Headline-as-question | TransitionScreen | review |
| 2 | Jargon gate — technique + movement + logistics + scoring | All copy fields | **[lint: movement, logistics, scoring]** + review |
| 3 | No combinatorics; enumerate or bracket-repeat microformat | `courtsideInstructions` | review |
| 4 | No em-dashes in user-visible prose | All copy fields | **[lint]** |
| 5 | Cool-down / wrap copy equal review weight | wrap/cooldown surfaces | review |
| 6 | Lead with skill verb (`Pass…`, `Serve…`, `Set…`) or `You [skill-verb]…` (pair) | `courtsideInstructions` first word | **[lint]** |
| 7 | Timed sub-blocks need audible structure + named cadence format | `segments[].label` | review |
| 8 | Either-reader role-tagged sentences for pair drills | `courtsideInstructions` | **[lint]** |
| 9 | Cue→action coupling microformat | `courtsideInstructions` | review |
| 10 | Five-question logistics checklist for pair drills | `courtsideInstructions` | review |
| 11 | Spatial point-of-view anchor on every spatial directive | `courtsideInstructions` | review |
| 12 | Cue ordering rule (one-cue default, external focus, gaze first, doer-POV) | `coachingCues[]` | review (a is render-enforced) |
| 13 | Triple-only readability (structural sufficiency probe) | `skillFocus` + `successMetric.description` + `coachingCues[0]` | review |
| 14 | `courtsideInstructions` aloud-read ceiling ≤ 45 words | `courtsideInstructions` | **[lint]** |

## System: how the pieces fit

```
                    Author writes a drill
                            │
                            ▼
              .cursor/rules/courtside-copy.mdc
                  (14 invariants + checklist)
                            │
              ┌─────────────┴──────────────┐
              ▼                            ▼
    Mechanical lints                  PR reviewer
    (drillCopyRegressions             (5-question checklist,
     .test.ts)                         triple-only probe)
              │                            │
              └─────────────┬──────────────┘
                            ▼
              Drill ships to app/src/data/drills.ts
                            │
                            ▼
                   D130 founder session
                  (or partner walkthrough)
                            │
                            ▼
              docs/research/founder-use-ledger.md
                            │
                            ▼
              If a confusion class recurs →
              new rule or rule extension; cycle
              repeats with falsification
```

The mechanical lints surface real failures on today's catalog as the empirical input to a per-drill assessment artifact (`docs/reviews/<date>-drill-first-time-runnability-assessment.md`). The assessment classifies each variant as pass / repair / rewrite and drives the sweep PR. Falsification surface: the next D130 session — if the rule failed to retire the confusion class, the rule gets revised, not the reader.

## Approach: when authoring a new drill

1. **Pick the canonical opener for your drill shape.**
   - Solo: `"<Skill verb>…"` (e.g., `"Pass to the set window from a self-toss…"`)
   - Pair: `"You <skill-verb>; partner <partner-action>. <Skill-verb-led action sentence>…"` (rule 8 + rule 6)
2. **Bind cues to actions.** Use arrow (`→`) or sequence verbs (`first`, `then`, `before`, `after`, `on`). Never conjunction-and for non-simultaneous actions (rule 9).
3. **Answer the five logistics questions** (rule 10): who starts, what's a round, what counts, what on miss (with escape clause), when does it end.
4. **Anchor every spatial directive** (rule 11): "from your side of the net", "from the server's POV", or use unambiguous vocabulary (`short` / `deep` vs `front` / `back`).
5. **Write `coachingCues[]` in priority order, `[0]` first** (rule 12): external focus, gaze target first if perceptual, ≥ 1 doer-POV cue somewhere in the list.
6. **Apply the triple-only probe** (rule 13): delete `courtsideInstructions` mentally and ask if the triple alone gets the reader through.
7. **Trim to ≤ 45 words** (rule 14): overflow routes to structured fields. Run the lint.
8. **Gloss named movements + logistics + scoring vocab inline on first use** (rule 2 extensions): `A-skip (= …)`, `shag (= …)`, `graded 2+ (= …)`.
9. **PR-review the cue ordering and logistics checklist with the reviewer rubric above** before requesting review.

## Approach: when reviewing a drill PR

1. **Run the lint suite.** `cd app && npx vitest run src/data/__tests__/drillCopyRegressions.test.ts` should be green.
2. **Apply the 5-question checklist** (rule 10) on every pair drill.
3. **Apply the triple-only probe** (rule 13) on every variant.
4. **Read each `coachingCues[0]` aloud** and ask: is it external? gaze-target-first if perceptual? doer-POV somewhere in the list?
5. **Scan for unglossed jargon** (movement, logistics, scoring) across `courtsideInstructions` + `segments[].label` + `successMetric.description`.
6. **Check that the strengthened rubric did not silently widen the drill's envelope** (envelope-honesty rule from 2026-05-02).

## Anti-patterns

- **"Partner X and Y..."** with conjunction-and binding two non-simultaneous actions. Split or sequence-verb.
- **"Pass with stable platform..."** — internal-focus cue at `[0]`. Move the body-state cue down; lead with the external outcome.
- **"6 zones in order: front-left, front-middle, ..."** with no POV anchor. Add `from your side of the net:` or use `short` / `deep` vocabulary.
- **"After 12 reps, switch."** with no first-server / first-doer named. Add who starts.
- **Long prose** carrying the drill on first read with under-specified structured fields. Route overflow into `segments`, `successMetric.description`, or `coachingCues[]`.
- **"Passes graded 2+"** without operational definition inline. Add the gloss.
- **"A-skip"** without spatial referent. Add the gloss.

## Falsification

Every rule traces to either a partner-walkthrough P1 finding (2026-04-21 origin) or a founder-session log entry (2026-04-27 cca2 dogfeed F8, 2026-04-26 `d26` clinical jargon, 2026-05-10 "peak and flash / number drill"). A rule that survives two consecutive walkthroughs / sessions without firing is a candidate for removal. New confusion classes that fire repeatedly become new rules — never new author taste.

## References

- `.cursor/rules/courtside-copy.mdc` — 14 invariants (canonical)
- `docs/brainstorms/2026-05-02-exercise-copy-contract-requirements.md` — R1–R8 baseline contract
- `docs/brainstorms/2026-05-10-drill-first-time-runnability-requirements.md` — R9–R16 extension
- `docs/plans/2026-05-10-004-feat-drill-first-time-runnability-assessment-plan.md` — implementation plan
- `docs/reviews/2026-05-10-drill-first-time-runnability-assessment.md` — per-drill assessment
- `docs/ideation/2026-05-10-drill-first-time-runnability-ideation.md` — full warrant trail + survivors + rejects
- `app/src/data/__tests__/drillCopyRegressions.test.ts` — mechanical lints

External warrants invoked across rules:

- Wulf (2013) *Attentional Focus and Motor Learning: A Review of 15 Years* — external focus
- FIVB Coaches Manual Level I / Level II (2016) — Fitts & Posner stages, cue density, feedback cadence, whole-practice bias
- Vickers (2007) *Perception, Cognition, and Decision Training: The Quiet Eye in Action* — gaze-target-first
- Gawande (2009) *The Checklist Manifesto* Ch. 6 — READ-DO vs DO-CONFIRM
- Helmreich, Merritt & Wilhelm (1999) — aviation CRM cue-action coupling
- Bandura (1986) *Social Foundations of Thought and Action* — modeling / demonstration substitution
- Magill (11e) *Motor Learning and Control* Ch 14 — demonstration as instructional aid
- Mayer (3e) *Multimedia Learning* — segmenting + pre-training principles
- Salmoni, Schmidt & Walter (1984); Winstein & Schmidt (1990) — guidance hypothesis
- Renshaw & Davids — *The Constraint-Led Approach*
- Volleyball Canada *Person Pillar Guidebook for Coaches* — observe / reinforce / question template
- Mark Rosewater MTG design columns — reminder text pattern
