---
id: drill-first-time-runnability-ideation-2026-05-10
title: "Ideation: Drill First-Time-Runnability Rubric"
status: active
stage: validation
type: ideation
summary: "Ranked ideation for the principles, rubric criteria, copy invariants, schema fields, and assessment lenses a Volleycraft drill must hold to be runnable correctly by a first-time courtside reader without a coach. Extends the 2026-05-02 exercise-copy-contract baseline; targets the founder's 2026-05-10 'peak and flash / number drill' confusion class with synthesis from BAB, FIVB, and Volleyball Canada (LTD3 + Person Pillar Guidebook)."
date: 2026-05-10
topic: drill-first-time-runnability
focus: principles, system, and approach to writing good drills (first-time-readable, partner-aware, structurally sufficient)
mode: repo-grounded
depends_on:
  - .cursor/rules/courtside-copy.mdc
  - docs/brainstorms/2026-05-02-exercise-copy-contract-requirements.md
  - docs/plans/2026-05-02-017-feat-exercise-copy-contract-plan.md
  - docs/research/2026-05-10-pair-net-serving-duration-feedback.md
  - docs/research/founder-use-ledger.md
  - docs/research/bab-source-material.md
  - docs/research/fivb-coaches-manual-crosscheck.md
  - docs/research/ltd3-development-matrix-synthesis.md
  - docs/research/practice-plan-authoring-synthesis.md
  - docs/research/outdoor-courtside-ui-brief.md
---

# Ideation: Drill First-Time-Runnability Rubric

## Grounding Context

The 2026-04-21 partner-walkthrough landed 9 P1 copy bugs and produced the 7-invariant courtside-copy contract (`.cursor/rules/courtside-copy.mdc`). The 2026-05-02 exercise-copy-contract requirements (`docs/brainstorms/2026-05-02-exercise-copy-contract-requirements.md`) operationalized that contract into a copy-review pass and shipped via `docs/plans/2026-05-02-017-feat-exercise-copy-contract-plan.md`. Mechanical lints landed in `app/src/data/__tests__/drillCopyRegressions.test.ts`.

The 2026-05-10 D130 session (Tony + Seb, 7th D130 session, pair-net serving, 38 min) captured **three drills as `still_learning` with no streaks** (`d10-pair`, `d33-pair-open`, `d22-pair`). The founder named the recurring confusion class **"peak and flash / number drill"** — drills where a partner has a non-obvious cuing or scoring role and the first-time courtside reader cannot tell at first glance *who does what, when, what counts*. The persistent warmup-pacing-feels-off pattern (d28 Beach Prep Three planned 3 min) recurred. See `docs/research/2026-05-10-pair-net-serving-duration-feedback.md` for the session's structured findings (F1–F5).

The 2026-04-27 cca2 dogfeed already established the **skill-verb-first** invariant (rule 6) for the same class of bug on `d33-pair` (*"is this a serving drill?"*). The 2026-05-10 evidence is the same class one level deeper: skill verb leads, but role coordination, partner cuing, scoring vocabulary, and termination are still under-spec'd.

This ideation pass synthesizes:

- **Pain & Friction** lens against concrete `d07/d10/d22/d28/d33` specimens (what makes a courtside reader stop, re-read, or guess)
- **Cross-domain Analogy** lens from aviation SOPs, board-game role cards, IKEA assembly, chess puzzles, CrossFit WODs, voice-over fitness, knitting bracket notation, climbing topo cards, Gawande checklists
- **Source-Synthesis** lens from FIVB Coaches Manual (Fitts & Posner motor stages, cue-density rule, feedback cadence, whole-practice bias), Wulf external-focus literature, Vickers Quiet Eye, Bandura modeling, Mayer multimedia principles, Volleyball Canada Person Pillar Guidebook (observe/reinforce/question)
- **Constraint-Flipping** lens (either-reader sufficiency, rep-50 readability, one-action-per-sentence floor, TTS-time ceiling, triple-only sufficiency probe, anti-pattern surfacing)

Sub-agent outputs preserved as scratch artifacts under `/tmp/compound-engineering/ce-ideate/b3c91a4f/`.

### What the existing copy contract already holds

Rule 1 headline-as-question. Rule 2 jargon gate (volleyball-technique terms). Rule 3 no combinatoric descriptions. Rule 4 plain punctuation (no em-dashes in prose). Rule 5 cool-down/wrap equal review weight. Rule 6 lead with skill verb. Rule 7 timed sub-blocks need audible structure (shipping gap). Plus a `Why / Setup / Do / Score-or-stop / Cue / Scale` field map and a per-PR authoring checklist.

### What the 2026-05-10 evidence shows is still missing

The contract catches *author vocabulary* leaks but does not catch:

- **Role coordination opacity** when a partner has a non-obvious cuing/scoring role
- **Spatial point-of-view ambiguity** ("front-left of what?")
- **Scoring-vocabulary opacity** ("grade 2+ pass" — what is grade 2?)
- **Termination ambiguity** when neither success nor budget triggers cleanly
- **Cadence ambiguity** inside timed segments
- **Movement-vocabulary opacity** outside volleyball technique terms
- **Logistics-jargon opacity** ("shag", "round", "switch", "turn", "swap")
- **Cue density and cue ordering** rules (FIVB ceiling, Wulf external focus, Vickers gaze target, doer-POV)
- **Active-run structural sufficiency** at rep 50 — when prose alone carries the drill

These are the gaps this ideation pass closes.

---

## Ranked Survivors

Each survivor below was generated as one of 40 raw candidates across four frames, then merged, deduplicated, and adversarially filtered against three tests: (a) does it warrant team discussion (meeting-test), (b) does it close a real first-time-runnability gap visible in today's specimens or session evidence, (c) is it operable inside Volleycraft's actual envelope without disproportionate carrying cost.

Survivors are ranked by **leverage on the 2026-05-10 confusion class first, then by breadth across the active drill catalog**. Each survivor cites the originating frames and the warrant type. Schema-additive survivors are explicitly flagged as schema-cost so they route to a different conversation than copy-only rules.

---

### S1. Either-reader role-tagged sentences

**Description.** Every pair drill's `courtsideInstructions` must contain **at least one sentence per role** where that role is the grammatical subject of an active verb. The partner appearing as object inside another role's sentence does not satisfy the rule. Recommended pattern: open with `"You [role A]; partner [role B]."` then lead the skill verb.

**Frames.** Pain-1, Pain-9, Source-8, Constraint-1, Analogy-5. Strongest single fix for the founder's "peak and flash / number drill" class.

**Warrant.** direct: `d07-pair courtsideInstructions` reads from passer POV only ("look at partner/coach flashing 1-5"); partner is referred to but never addressed. direct: `d33-pair` same pattern ("Partner across the net calls the next zone"). direct: 2026-05-10 session, 3 drills `still_learning`, founder labeled "peak and flash / number drill". external: aviation CRM literature (Helmreich, Merritt & Wilhelm 1999) — cue-action coupling and explicit role addressing are the canonical fix for this confusion class.

**Worked rewrite (d07-pair).** From *"Pass a served ball to the set window, then immediately look at partner/coach flashing 1-5 and call it before the next action."* to *"You pass; partner flashes a number 1–5 with their fingers the moment your platform meets the ball. Pass to the set window, then call the number you saw before the next ball."*

**Class.** Copy-invariant (new rule 8 in `courtside-copy.mdc`); regression-tested via `drillCopyRegressions.test.ts` analogous to rule 6.

**Confidence.** High. **Complexity.** Low (copy-only on ~14 pair drills in M001).

---

### S2. Cue→action coupling microformat

**Description.** When a partner cue triggers an action, copy must bind cue and action in one syntactic unit. Permitted microformat: arrow (`→`) or `"On X, Y."` pattern. Replaces conjunction-and ("X and Y") which defaults to "do both simultaneously" — biomechanically or cognitively impossible for a cognitive-stage learner.

**Frames.** Analogy-1 (pilot SOP V1/Vr callout grammar), Pain-9 (concurrency disambiguation).

**Warrant.** direct: `d33-pair` shagger description — *"calls the next zone before each serve and shags after the round"* — orders concurrent tasks with conjunction-and. direct: `d07-pair` — *"Pass… then immediately look at partner/coach flashing 1-5 and call it before the next action"* — three implicit tasks glued by conjunction. external: aviation crew resource management treats callout-action pairing as the canonical answer to "two-pilot" confusion (Helmreich et al. 1999). external: Fitts & Posner cognitive stage tolerates ONE focal cue at a time (FIVB Level II Ch III.3, captured in `docs/research/fivb-coaches-manual-crosscheck.md`).

**Worked rewrite (d33-pair).** From *"Partner across the net calls the next zone before each serve and shags after the round"* to *"On partner's call → you serve to the named zone. After the 6-serve round → partner shags."*

**Class.** Copy-invariant (extends rules 3 + 6).

**Confidence.** High. **Complexity.** Low (copy-only).

---

### S3. Five-question logistics checklist for pair drills

**Description.** Each pair-drill `courtsideInstructions` must answer five logistic questions, in any order, in any number of sentences: (1) **who starts?** (2) **what defines a round / turn?** (3) **what counts as success this rep?** (4) **what to do on a miss?** (5) **when does the drill end if neither success nor budget triggers cleanly?** If a question cannot be answered by pointing at a specific sentence, it is not in the copy.

**Frames.** Constraint-5 (absent-coach 5-question framing), Pain-6 (termination-rule completeness), Pain-8 (role-swap trigger).

**Warrant.** direct: founder's 2026-05-10 confusion description — *"can't tell at first glance who does what, when, what counts"* — names three of the five questions in one sentence. direct: `d22-pair First to 10 Serving` answers success-stop but omits "what if neither reaches 10 when the block ends?" direct: `d33-pair` says *"a miss repeats the same zone"* with no escape clause for 4+ consecutive misses. external: Renshaw & Davids *Constraint-Led Approach* — when the coach is removed as a constraint, the *task* constraints must do the coordinating work the coach was doing.

**Class.** Rubric-criterion + authoring checklist.

**Confidence.** High. **Complexity.** Low (checklist add); medium if surfaced as a structured `stop_rule` field (deferred — see S12 + S19).

---

### S4. Spatial point-of-view anchor

**Description.** Every spatial directive in `courtsideInstructions` (zone names, "front-left", "the same side", "across") must be anchored to an explicit reference body. For serving drills, default-from-server-POV unless explicitly stated. For all pair drills, the first setup sentence must carry the POV anchor.

**Frames.** Pain-2 (POV reference frame).

**Warrant.** direct: `d33-pair` enumerates *"front-left, front-middle, front-right, back-left, back-middle, back-right"* with no stated POV. The receiver's "front" is the back of their court from the server's view — and the *partner is the caller*. Combined with the 2026-04-27 dogfeed "is this a serving drill?" finding, the d33 specimen carries multiple POV failures the existing contract does not catch. reasoned: spatial ambiguity in a serving drill where the partner *calls* the zone produces wrong-target serves the founder does not realize are wrong — actively misleading practice, not just confusion.

**Class.** Copy-invariant (new sub-rule under rule 2 or rule 6).

**Confidence.** High. **Complexity.** Low (copy-only sweep, ~6 serving and pair drills affected).

---

### S5. Active-run structural sufficiency / triple-only readability probe

**Description.** A drill must be re-runnable from its **load-bearing reading triple**: `skillFocus` (rendered as eyebrow) + `successMetric.description` + `coachingCues[0]` — alone, without re-reading `courtsideInstructions`. Authoring review test: *"if I delete `courtsideInstructions`, does the triple still get me through?"* If no, the triple is under-spec'd; the fix lives in the triple, not in lengthening the prose.

**Frames.** Constraint-9 (triple-only sufficiency probe), Constraint-2 (rep-50 readability), Analogy-10 (READ-DO vs DO-CONFIRM unifier).

**Warrant.** direct: `docs/research/outdoor-courtside-ui-brief.md` constrains active-run rendering to 6 fields (block_title, one_primary_cue, timer_or_rep_target, phase_label, progress, primary controls). reasoned: at 1–3 m viewing distance under glare, sentence-style explanatory text cannot survive at usable letter height (per outdoor brief) — the right answer is one dominant metric + active countdown + first cue. direct: founder is in 7th D130 session; rep-50 reading is approaching the live case, not a hypothetical. reasoned: d28-solo already passes the test (segments + completion metric + first cue alone re-run the warmup); d07-pair and d33-pair fail.

**Class.** Assessment-lens. Single most important reframe: from "improve the prose" (vague, taste-driven) to "complete the triple" (falsifiable, structured-field-centric).

**Confidence.** High. **Complexity.** Authoring-rule add + per-drill assessment; no schema change.

---

### S6. TTS-time ceiling on `courtsideInstructions` (≤15s aloud, ≤40 words)

**Description.** `courtsideInstructions` must read aloud in ≤15 seconds (~40 words at 150 wpm). When prose exceeds the ceiling, the overflow **must move into structured fields** — `segments`, `successMetric.description`, `coachingCues[]`, or `participants.roles` — that the active-run UI already renders. The ceiling is the lint that gives S5 enforceable teeth.

**Frames.** Constraint-8 (TTS-time ceiling), Source-6 (reading-load budget — sentences, named entities, syllable density).

**Warrant.** external: speech-comprehension research treats roughly 12–15 seconds as the upper bound for prospective-memory recall of unstructured spoken instruction without rehearsal, consistent with Sweller cognitive-load span and standard TTS UX heuristics. external: Mayer multimedia learning *segmenting principle* — learner-paced segments outperform continuous narration. direct: `d28-solo` instructions name 4 segments × multiple movements (A-skip, ankle hops, lateral shuffles, arm circles, trunk rotations) — easily 12+ named entities in one read, well above any plausible courtside working-memory budget. reasoned: at courtside the ambient channel is wind/sand/sun; prose >15s aloud is not read silently any faster than aloud — the working-memory ceiling is the same.

**Class.** Rubric-criterion (lint-able). Add to `validateDrillCatalog` or `drillCopyRegressions.test.ts`.

**Confidence.** High. **Complexity.** Medium (lint implementation + per-drill rewrite).

---

### S7. Cue ordering rule for `coachingCues[]`

**Description.** A composite rule that makes `coachingCues[0]` load-bearing. Four sub-rules:

- (a) **One cue rendered by default** (FIVB Fitts & Posner cognitive-stage default). `RunScreen` shows only `coachingCues[0]`; remaining cues sit behind a `Show more cues` affordance that defaults closed. `[0]` must stand alone without the others.
- (b) **External focus** (Wulf 2013): `[0]` names an outcome (ball flight, target, partner reach, landing mark, contact sound) or environmental referent — not a body part, joint, or muscle. Cues that fail must either be rewritten or carry a `// internal-focus exception:` comment naming why an internal cue is load-bearing here (e.g., safety: jump-float shoulder cue).
- (c) **Gaze target first for perceptual-cognitive drills** (Vickers Quiet Eye 2007): for drills whose `successMetric` references a perceptual decision (read drills, partner-cued drills), `[0]` names the gaze target *and* the gaze-commit moment. Pattern: `Look at [target] [the moment of contact / immediately after / before the pass leaves your platform].`
- (d) **Doer-POV requirement**: ≥1 of `coachingCues[]` must pass the doer-POV test — phrased as a felt outcome or observable result the doer can self-check mid-rep without an observer present. Coverage rule, not replacement — observer-POV cues stay.

**Frames.** Source-1 (external focus), Source-2 (one-cue ceiling), Source-7 (gaze target first), Constraint-7 (doer-POV).

**Warrant.** external: Wulf *Attentional Focus and Motor Learning: A Review of 15 Years* (2013) — consistent retention/transfer advantage for external focus once a basic pattern exists. external: FIVB Level II Coaches Manual Ch III.3 (p. 32) — *"The coach should give beginners one key cue at a time."* external: Vickers (2007) *Perception, Cognition, and Decision Training: The Quiet Eye in Action* — for perceptual-cognitive tasks, instructing *where to look and when* outperforms instructing *how to move*. direct: `d07-pair` is literally a "look" drill (FIVB Drill 3.15 lineage) but none of its three cues name a gaze target. direct: today's coachingCues for d28-solo (*"Short hops, loud feet"*, *"Full range on arm swings"*, *"Move ankles first, then legs"*) are observer-POV; doer cannot self-check "loud feet" except by inference.

**Class.** Copy-invariant + rubric-criterion + RunScreen render change (1-cue default).

**Confidence.** High. **Complexity.** Medium (cue rewrite across 26 active drills + RunScreen 1-cue default render).

---

### S8. Movement-vocabulary inline spatial gloss

**Description.** Named movements outside the one-season-rec-player vocabulary (A-skip, ankle hops, RDL, half-kneel, pivot-back start, lateral shuffle, runner's lunge, hip flexor stretch) must carry a one-clause **spatial-referent gloss** inline on first use per drill. Pattern: `[name] (= [spatial referent describing where the body is, what it touches, what direction it moves])`. Permitted microformat: italic parenthetical (MTG-reminder-text pattern). Extends rule 2 from volleyball-only to all named movements.

**Frames.** Pain-4 (movement-name affordance), Source-10 (demonstration substitution via spatial referent), Analogy-2 (MTG reminder text).

**Warrant.** direct: 2026-05-10 session — warmup pacing felt off; `d28-solo Beach Prep Three` names "A-skip", "ankle hops", "lateral shuffles", "arm circles", "trunk rotations", "pivot-back starts" without gloss. The existing jargon-gate invariant's "one-season rec player test" is volleyball-flavored and does not stretch to movement vocabulary outside the sport. direct: `docs/research/founder-use-ledger.md` 2026-04-26 row — *"Cooldown stretch wording unclear to partner — `d26` `courtsideInstructions` use clinical jargon (`hip flexor`, `half-kneel`, `tuck`)"* — confirms the named-movement-without-referent failure mode is empirically observed. external: Bandura (1986) modeling literature + Magill (11e) Ch 14 *demonstration as instructional aid* + ACSM *Guidelines for Exercise Testing and Prescription* — every named movement is paired with a visual demonstration in canonical exercise-prescription literature; spatial referent is the closest static-text analog. external: Mark Rosewater MTG design columns — reminder text is the documented new-player onramp pattern that lets a game keep its keyword vocabulary.

**Worked rewrite (d28-solo seg 1).** From *"Jog or A-skip around your sand box"* to *"Jog or A-skip (= skip forward, lifting the front knee until the thigh is parallel to the sand) around your sand box."*

**Class.** Copy-invariant (extends rule 2).

**Confidence.** High. **Complexity.** Medium (sweep across warmup/cooldown drills, ~6–8 affected drills).

---

### S9. Logistics-jargon gloss

**Description.** Extend rule 2's flagged-vocabulary table with a **logistics-jargon column**: `shag`, `round`, `attempt`, `miss`, `reset`, `switch`, `turn`, `swap`, `rotate`. First use must be glossed inline. The gate is no longer only *"would a one-season rec player know this volleyball term"* — it is also *"would a stranger handed the phone know what 'shag' or 'a round' means in this context?"*

**Frames.** Constraint-10 (extended jargon table for logistics terms).

**Warrant.** direct: rule 2's origin evidence (six P1 findings from one walkthrough — author vocabulary leaking into courtside copy) is exactly this class of bug. The 2026-04-21 walkthrough sampled technique terms; logistics terms have not been similarly stress-tested even though they fail the same way. direct: `d33-pair` uses *"shag"* unglossed (*"Partner... shags after the round"*). `d22-pair` uses *"round"* with no boundary defined. `d07-pair`'s *"before the next action"* is itself unstated logistics — what counts as the next action, the next pass or the next serve?

**Class.** Copy-invariant (extends rule 2).

**Confidence.** High. **Complexity.** Low (sweep across pair drills with role-swap or round structure).

---

### S10. Operational scoring vocabulary

**Description.** Every `successMetric.description` that uses graded or qualitative terms (*"grade 2+ pass"*, *"good pass"*, *"controlled set"*, *"in-system"*) must be **self-contained**: the operational definition appears inline in the same description, or references a tappable ledger entry one tap away. Inherited-from-coaching grading scales are autonomous-stage knowledge and have no scaffold for a self-coached beach amateur.

**Frames.** Pain-5 (scoring-vocabulary operational definition).

**Warrant.** direct: `d10-pair successMetric.description: "Passes graded 2+ across 24 tosses, ≥ 70%"`. The reader has no scaffold for "grade 2+". The FIVB pass-grading scale (0/1/2/3) is meaningful only to coached players. external: FIVB Coaches Manual crosscheck places pass-grading in the autonomous stage of motor learning — using it as the success metric for a cognitive-stage rec player inverts the Fitts & Posner cue-load principle. direct: without operational scoring vocabulary, the founder can complete a drill 100 times and not know whether a given rep counted — streak captures (D137) become noise.

**Class.** Copy-invariant + rubric-criterion. Touches streak-eligibility policy: should streak-eligible drills require a self-explanatory operational definition?

**Confidence.** High. **Complexity.** Medium (rewrite ~10 `successMetric.description` strings that use graded vocab).

---

### S11. Windowed grading cadence

**Description.** For success metrics that involve per-rep judgment, the `description` must phrase the unit of judgment as a **window of ≥3 reps** (e.g., *"of the last 3 serves, how many landed in?"*), not a per-rep verdict. Matches the FIVB feedback-cadence rule for self-coached settings — high-frequency feedback inflates practice performance but degrades retention (guidance hypothesis, Salmoni/Schmidt/Walter 1984).

**Frames.** Source-3 (self-coached feedback cadence as a copy invariant).

**Warrant.** external: FIVB Level II Ch III.8 (p. 35) — *"Specific, not overloading, let the athlete take 2–3 trials before giving more feedback."* external: Winstein & Schmidt (1990) reduced-frequency knowledge-of-results literature. direct: `d07-pair` *"Passes graded 2+ AND correct number call after pass"* requires the reader to stop and self-grade after every rep — exactly the high-frequency feedback the literature warns against. direct: 2026-05-10 session captured `still_learning` on three drills with zero Good/Total counts — per-rep judging during a serving drill is incompatible with the natural courtside loop (toss → serve → walk → shag).

**Worked rewrite (d07-pair).** From *"Passes graded 2+ AND correct number call after pass"* to *"After every 3 serves, count: how many of the last 3 you'd grade as a clean pass to the set window AND called the partner's number correctly?"*

**Class.** Copy-invariant.

**Confidence.** Medium-High (some rep-counted drills already use this windowed form; sweep needed across composite metrics).

**Complexity.** Low-Medium.

---

### S12. Three-clause termination rule

**Description.** Every drill's stop rule must answer three conditions: (a) **success stop**, (b) **time/rep-budget stop**, (c) **fallback** when neither (a) nor (b) is reached cleanly — miss-loop on the same zone, no winner at time-up, fatigue cap hit before rep target, partner disagreement on a call. Today's specimens routinely answer (a) and sometimes (b); (c) is usually missing.

**Frames.** Pain-6 (termination-rule completeness), Analogy-6 (CrossFit WOD Rx/scaled/cap/score).

**Warrant.** direct: `d22-pair` says *"First to 10 wins; play a second round if there is time"* — answers (a) and (b) but not "what if neither reaches 10 when the block ends?" direct: `d33-pair` says *"A miss repeats the same zone on the next attempt"* — what if the reader misses 8 times same zone? The miss-repeat rule has no escape clause, so the drill can degenerate into a single-zone grind that chews a whole 12-minute slot. external: CrossFit *Level 1 Training Guide* — time-cap is non-optional precisely because gym-floor users cannot pause to decode prose.

**Class.** Copy-invariant + rubric-criterion. Possible future schema add: `stopRule: { success?, budget?, fallback? }` (see S19 cluster).

**Confidence.** High. **Complexity.** Low (copy sweep across pair drills with score-based or miss-loop termination).

---

### S13. Cadence format on timed segments

**Description.** When a `segments[].durationSec` carries a duration, the prose must name the **work format inside that timer**: continuous, rep-paced, work-rest, or accumulator. *"45s of A-skip"* could mean continuous A-skip for 45s, A-skip reps until 45s elapses, 30s work / 15s rest, or accumulate distance — each cadence has a different cardiovascular and neurological load. Existing rule 7 addresses *whether* the timer beeps; this addresses *what behavior* the timer is gating.

**Frames.** Pain-7 (cadence specification inside timed segments).

**Warrant.** direct: `d28-solo Beach Prep Three` has 4 segments × 45s = 3 min total, no cadence format named for any segment. Founder reported (2026-05-10) "warmup pacing wrong, felt off." reasoned: wrong-cadence warmups pre-fatigue the wrong systems and undermine the main drill block. external: FIVB whole-practice-bias literature argues warm-up cadence must match the upcoming drill's neural demands; an unspecified cadence defeats the prep purpose by chance.

**Class.** Copy-invariant (extends rule 7).

**Confidence.** High. **Complexity.** Low (sweep across warmup, cooldown, and interval drills).

---

### S14. One-action-per-sentence floor

**Description.** Action sequences cannot interleave coupled actions and conditions in a single compound sentence. Compound conditions (*"X while Y"*, *"X then Y and Z"*) split into separate clauses or sentences. Closes rule 3 (no combinatorics for content) extended to action shape.

**Frames.** Constraint-3 (decomposability), Pain-9 (concurrency disambiguation).

**Warrant.** direct: rule 3 already enforces decomposition for *content* (six tosses enumerated, not "left/right × in-front/side/behind"); extending the same logic from content to action sequences is closing an existing principle, not introducing a new one. direct: `d07-pair`'s single sentence packs five interleaved events: receive serve → pass to target → look up → see partner's flash → call number. external: Buxton *Sketching User Experiences* — a sentence that resists decomposition into a storyboard is opaque under load.

**Class.** Copy-invariant (extends rule 3).

**Confidence.** Medium-High. **Complexity.** Low (copy sweep, ~8–10 drills affected).

---

### S15. Whole-practice context disclosure for part-practice drills

**Description.** For any drill whose `feedType` is `self-toss`, `partner-toss`, or `coach-toss` (i.e., not `live-serve`/`live-rally`), `courtsideInstructions` must include a sentence naming the **whole-skill context the part serves** and which FIVB exception (fear / danger / frustration / complexity) justifies isolating it. Pattern: *"This isolates [part] so [exception reason]; you'll put it back into the whole serve-pass-set in [later block name or session shape]."*

**Frames.** Source-4 (part-practice disclosure).

**Warrant.** external: FIVB Level II Ch III.4 (p. 33) — *"Research has shown that the most efficient way to train a skill is to practice it as specifically as possible in the exact activity in which it will be used… Part-whole methods of teaching progressions are not efficient."* Four exceptions: fear, danger, frustration, skill too complex for current stage. direct: `d07-pair` *"Pass a served ball to the set window, then immediately look at partner/coach flashing 1-5"* has no anchor for *why* the gaze redirect comes immediately after the pass (answer: because in a real rally the next decision starts there) — the copy never says so.

**Class.** Copy-invariant.

**Confidence.** Medium. **Complexity.** Low-Medium (copy sweep on ~15 part-practice drills). May benefit some drills more than others — apply per-drill judgment.

---

### S16. Observe / reinforce / question template for capture and review copy

**Description.** Apply the Volleyball Canada Person Pillar Guidebook's three-artifact template (desired state → observable indicators → reinforcing comments → reflection questions) to **DrillCheck and Review copy**, not to drill `courtsideInstructions` itself. Concrete:

- **DrillCheck difficulty prompt** becomes: *"Observable for this block: [drill name + measured behavior, e.g., 'six serves, partner called a zone before each one']. How did it land for you?"* — the observable is named first; chips come second. The reader grades against an observable, not a vibe.
- **Review reflection prompt for `still_learning` marks** uses Guidebook reflection-question structure: *"You marked [drill name] as still learning today. What are some of the reasons that might be the right read? What changes between today and the next time you run this?"*
- **Review reinforcement prompt for `done` / `easier_next_time` marks**: *"You completed [drill name]. Whatever you noticed working today is worth keeping next time."*

**Frames.** Source-5 (observe/reinforce/question template).

**Warrant.** direct: `docs/research/ltd3-development-matrix-synthesis.md:259-264` — *"observe, reinforce, question, do not judge — is exactly the tone Volleycraft's rules-first / explainable-adaptation posture already aspires to."* direct: 2026-05-10 session captured three `still_learning` rows with no follow-up structure. external: Volleyball Canada *Person Pillar Guidebook for Coaches* (EN, pp. 4–6) — three reinforcing-comment templates and three reflection-question templates, paired with desired-state and indicators.

**Class.** Principle + copy-invariant for **capture and review surfaces** (distinct from `courtsideInstructions`).

**Confidence.** High (template is concretely defined). **Complexity.** Medium (DrillCheck + Review copy rewrite; may benefit from per-drill `observable: string` field).

---

### S17. Bracket-repeat microformat as a permitted exception to no-combinatorics

**Description.** Permit a **single bracket microformat** for sequenced repetition: `(serve → partner calls next zone → shag) × 6 zones, in order: FL, FM, FR, BL, BM, BR.` This is *not* combinatorics — it does not ask the reader to multiply or combine. It is compressed iteration with explicit unrolling of the variable list. Pairs with S1 (role-prefix) and S2 (cue→action arrow).

**Frames.** Analogy-8 (knitting bracket notation), composes with S1 + S2.

**Warrant.** external: knitting and crochet pattern standards (Craft Yarn Council); music repeat marks (`||: :||`) — both validate the pattern across textual and notational domains. reasoned: enumeration scales O(n) with reps and quickly exceeds the 2-sentence courtside attention budget; bracket notation is O(1) once the reader learns the convention. direct: `d33-pair`'s 6-zone enumeration currently bloats the prose; bracket form compresses without violating rule 3's intent (the iteration is *not* a combinatoric content-product).

**Class.** Copy-invariant (extends rule 3 with a permitted exception).

**Confidence.** Medium. **Complexity.** Low (microformat add + worked example).

---

### S18. READ-DO vs DO-CONFIRM consumption-mode lens

**Description.** Adopt **READ-DO vs DO-CONFIRM** (Gawande *Checklist Manifesto* 2009) as an assessment lens. The drill card is consumed in two distinct phases:

- **Setup** = READ-DO (read, then place balls/markers). Full prose, full glossing, full context disclosure.
- **Active-run re-glance** = DO-CONFIRM (you've started; you glance to confirm you're doing the right thing, not to learn it). Structural-field shorthand (chess-puzzle-grade title, role prefixes, arrow cues, brackets, one cue, timer).

This lens **unifies** S5 + S6 + S7 + S17 by naming *which mode* each survivor applies to. Most other survivors (S1–S4, S8–S15) apply to the READ-DO surface. S5, S6, S7(a), S17 apply specifically to the DO-CONFIRM surface.

**Frames.** Analogy-10 (READ-DO vs DO-CONFIRM).

**Warrant.** external: Gawande *The Checklist Manifesto* (2009, ch. 6) — explicit definition of READ-DO vs DO-CONFIRM and argument that mode-declaration is the most under-appreciated step in checklist design. reasoned: applies cleanly to Volleycraft because the drill card is consumed in two distinct phases (pre-drill setup + courtside re-glance) and today's contract treats them uniformly.

**Class.** Principle + assessment-lens.

**Confidence.** High (the unifier insight is durable; the operationalization is downstream). **Complexity.** Low (adopt as lens; no schema change).

---

### S19. Anti-pattern surfacing field — `expectedMisreading` + `crux` *(schema-cost flagged)*

**Description.** Optional schema additions on `DrillVariant`:

- `expectedMisreading?: string` — the most likely first-time wrong execution, surfaced as a one-line "common slip" anti-cue under the cues at courtside.
- `crux?: string` — the hardest single moment or most common failure point, named in one sentence (climbing topo card pattern). Concrete for `d07-pair`: *"calling the number before the pass lands without rushing the pass."*

Authoring discipline: red-teaming a new drill must answer "what is the most likely first-time wrong execution?" — and if the author cannot articulate it, that is a smell that the copy is hiding the failure mode.

**Frames.** Constraint-4 (`expectedMisreading`), Analogy-9 (climbing topo `crux`).

**Warrant.** direct: `d33-pair` source already carries red-team adversarial finding code comments documenting the drill's failure modes — institutional knowledge exists, it just does not reach courtside. external: TDD's "what would break this?" inversion (Beck). external: Vickers (2007) Quiet Eye / Gallwey *Inner Game of Tennis* (1974) — anticipating the failure point primes attentional control vs. discovering it under load.

**Class.** Schema-field (schema-cost flagged) + authoring rubric.

**Confidence.** Medium (concept solid; depends on appetite for schema add). **Complexity.** Medium-High (schema add + Dexie migration + RunScreen render change).

**Posture.** Surface as a **structured proposal** in the brainstorm doc, but **do not block** the copy-only sweep on the schema add. The copy-only survivors (S1–S18) should land first; S19 routes to a follow-up schema decision.

---

## Cross-Cutting Synthesis

After merging, the 40 raw ideas across 4 frames cluster into **5 themes** that organize the survivor set:

### Theme A — Pair-drill coordination clarity (the "peak and flash" cluster)

**Survivors:** S1 (either-reader role-tagged sentences), S2 (cue→action coupling microformat), S3 (5-question logistics checklist), S4 (spatial POV anchor), S9 (logistics-jargon gloss).

**Why a theme.** All five close the founder's named confusion class: a partner has a non-obvious cuing or scoring role and the first-time reader cannot tell who does what, when, what counts. Together they retire the class.

**Highest-leverage combination:** S1 + S2 + S3, applied to `d07-pair`, `d33-pair`, `d22-pair` in this week's sweep.

### Theme B — Structural sufficiency for re-glance reading (the "rep-50" cluster)

**Survivors:** S5 (triple-only readability probe), S6 (TTS-time ceiling), S18 (READ-DO vs DO-CONFIRM lens).

**Why a theme.** The active-run UI is a 6-field envelope; prose `courtsideInstructions` is invisible at rep 50. The triple `skillFocus + successMetric.description + coachingCues[0]` is what survives. Together these convert "improve the prose" (vague) into "complete the triple" (falsifiable).

**Highest-leverage combination:** S18 first as the unifying lens, then S5 + S6 as the operational tests.

### Theme C — Cue ordering and cognitive load (the "first cue is load-bearing" cluster)

**Survivors:** S7 (cue ordering: one-cue default + external focus + gaze target first + doer-POV).

**Why a theme.** S7 is itself a composite of four FIVB / Wulf / Vickers / constraint-flip insights converging on the same rule. The `coachingCues[0]` field becomes contractual; priority ordering of the cue list becomes load-bearing.

**Highest-leverage move:** Adopt S7 as a single composite rule, surface in `courtside-copy.mdc` as rule 9, and run a single cue-rewrite sweep across all 26 M001-candidate drills.

### Theme D — Vocabulary scope expansion (the "extended jargon gate" cluster)

**Survivors:** S8 (movement-vocabulary inline gloss), S9 (logistics jargon — also Theme A), S10 (operational scoring vocabulary), S11 (windowed grading cadence).

**Why a theme.** Rule 2's jargon gate currently catches volleyball *technique* terms. Today's evidence shows three parallel jargon classes: movement vocabulary (S8), logistics terms (S9), and scoring vocabulary (S10). S11 is the cadence companion that prevents the operational definition from forcing per-rep judging.

**Highest-leverage move:** Extend rule 2's flagged-vocabulary table to three columns (technique / movement / logistics) plus a scoring-vocabulary sub-rule, and sweep.

### Theme E — Termination, cadence, and whole-practice context (the "drill envelope" cluster)

**Survivors:** S12 (three-clause termination), S13 (cadence format on timed segments), S14 (one-action-per-sentence floor), S15 (whole-practice context for part-practice), S17 (bracket-repeat microformat).

**Why a theme.** Together these address what happens *around* the action — when does it end, how is it paced, what does the action chunk look like syntactically, what whole does this part serve. Less urgent than Themes A–C but each is a measurable single rule with low carrying cost.

**Highest-leverage move:** Bundle into a "rule 7 expansion + new rules 10–12" pass after Themes A–C land.

### Theme F — Capture/review surfaces *(distinct from drill copy itself)*

**Survivors:** S16 (observe/reinforce/question template).

**Why a theme.** Survivor 16 operates on a different surface (DrillCheck + Review) than survivors 1–15 (drill `courtsideInstructions`). Same first-time-runnability principle applies — *observable named first; reflection or reinforcement structure templated* — but the implementation lives in different screens.

**Highest-leverage move:** Treat as a parallel workstream that informs DrillCheck + Review polish.

### Theme G — Schema additions *(deferred, schema-cost flagged)*

**Survivors:** S19 (`expectedMisreading` + `crux`).

**Why a theme.** Both ideas require schema additions, Dexie migrations, and RunScreen render changes. They are strong ideas but should not block the copy-only sweep (Themes A–F). Surface as a structured proposal in the brainstorm doc; route to a separate schema decision.

---

## Rejects and Defers

Adversarial filtering removed or deferred these candidate ideas:

- **Analogy-4 (IKEA `kit` schema field).** Strong idea but largely covered by existing `equipment` + `participants.roles` fields. The "kit block" is a UI-render question, not a copy-quality question. **Defer to UI workstream.**
- **Analogy-7 (Pacing TTS `pacing[]` schema).** Depends on TTS infra not shipped. The courtside-copy rule 7 already names this as a shipping gap. **Honor existing deferral; do not re-open here.**
- **Source-9 (`vocabPreflight[]` schema for TransitionScreen vocabulary band).** Adds schema. The inline-gloss rule (S8 + Analogy-2) captures 80% of the value with no schema change. **Defer schema; adopt inline gloss as the first move.**
- **Pain-3 (Cuing-channel enum: `fingers` | `voice` | `card` | `pose`).** Partially solved by S1 (role-tagged sentences) + S2 (cue→action arrow): the channel naturally appears as the verb-phrase the role takes. Schema enum is over-engineering for a copy fix. **Merge into Theme A.**
- **Pain-1's full `roleActions: { roleId: phase[] }` schema.** Same reasoning as Pain-3 — the role-tagged sentence rule (S1) covers the discoverability gap without a schema-grade structured field. **Merge into Theme A; revisit if S1 fails to close the gap after one sweep.**

These rejects are not invalidated; they are **explicitly deferred** because the same first-time-runnability gap is closed at lower carrying cost by a survivor.

---

## What This Closes

If Themes A–E land as a single coherent rubric extension:

- The 2026-05-10 *"peak and flash / number drill"* confusion class is retired (Theme A).
- The 2026-05-10 *"warmup timing wrong"* recurrence has a structural fix (Theme E S13 + Theme D S8) and an enforceable lint (Theme B S6).
- The pre-existing FIVB cue-density / external-focus rule (already noted in `docs/research/fivb-coaches-manual-crosscheck.md` Finding 2) becomes a runtime invariant (Theme C S7).
- The streak-eligibility / `still_learning` capture noise narrows because the operational scoring vocabulary becomes self-contained (Theme D S10) and the grading cadence matches the natural drill rhythm (Theme D S11).
- The 7-rule courtside-copy contract grows to ~10–12 rules but each new rule traces to direct partner-walkthrough or founder-session evidence and to a named external warrant — keeping the contract evidence-grounded per its origin discipline.

## What This Doesn't Close

- **Audible pacing infra (rule 7's named shipping gap).** Still deferred; not in scope.
- **Schema additions for `expectedMisreading` / `crux` / `stopRule` / `pacing[]` / `vocabPreflight[]`.** Listed in Theme G as a future schema decision; the copy-only sweep delivers value without them.
- **DrillCheck / Review copy rewrite (Theme F S16).** Parallel workstream; surface in brainstorm but plan independently.
- **D101 3+ player support.** Out of scope; copy rules apply equally to future 3+ player drills when D101 unblocks them.

---

## Next Steps

1. **`/ce-brainstorm` (extend existing baseline).** Update the 2026-05-02 `exercise-copy-contract-requirements.md` (or write a 2026-05-10 supplement requirements doc) to formalize Themes A–F as the **first-time-runnability rubric**, with clear requirements that downstream planning can implement without inventing scope.
2. **`/ce-plan` (assessment + sweep).** Produce a 2026-05-10 plan that:
   - Updates `.cursor/rules/courtside-copy.mdc` with the new rules surfaced here (8 + 9 minimum; consider 10–12).
   - Adds regression tests in `drillCopyRegressions.test.ts` for mechanically-checkable rules (S1 role-tagged sentence, S6 TTS-time ceiling, S8/S9 jargon glosses, S14 sentence-action floor).
   - Adds an assessment-pass step that audits every M001-candidate drill (currently 26) against the strengthened rubric, captures one row per drill (`pass / repair / re-author`), and lands a sweep PR.
   - Lists Theme G (S19 schema additions) as deferred follow-up work.
3. **Theme F as parallel work.** Capture the DrillCheck + Review copy rewrite as a separate brainstorm or attach to the existing diagnostics-triage workstream.

## Sources Cited

- `.cursor/rules/courtside-copy.mdc` (current 7 invariants + authoring checklist)
- `docs/brainstorms/2026-05-02-exercise-copy-contract-requirements.md` (current rubric baseline)
- `docs/plans/2026-05-02-017-feat-exercise-copy-contract-plan.md` (current implementation contract)
- `docs/research/2026-05-10-pair-net-serving-duration-feedback.md` (today's session findings)
- `docs/research/founder-use-ledger.md` (D130 cadence and partner-walkthrough rows)
- `docs/research/fivb-coaches-manual-crosscheck.md` (Findings 1–4: Fitts & Posner, cue density, feedback cadence, whole-practice bias)
- `docs/research/ltd3-development-matrix-synthesis.md` (Person Pillar Guidebook template)
- `docs/research/practice-plan-authoring-synthesis.md` (BAB / FIVB / VC cross-source theses)
- `docs/research/bab-source-material.md` (practical practice grammar)
- `docs/research/outdoor-courtside-ui-brief.md` (6-field active-run envelope)
- `docs/research/partner-walkthrough-results/2026-04-21-tier-1a-walkthrough.md` (origin of the courtside-copy contract)
- `docs/research/2026-04-27-cca2-dogfeed-findings.md` (F8 `d33-pair` skill-verb finding — direct precursor)

External warrants invoked across survivors:
- Wulf, *Attentional Focus and Motor Learning: A Review of 15 Years* (2013)
- FIVB Coaches Manual Level I / Level II (2016)
- Vickers, *Perception, Cognition, and Decision Training: The Quiet Eye in Action* (2007)
- Helmreich, Merritt & Wilhelm, *The Evolution of Crew Resource Management Training in Commercial Aviation* (1999)
- Gawande, *The Checklist Manifesto* (2009)
- Bandura, *Social Foundations of Thought and Action* (1986)
- Magill, *Motor Learning and Control* (11e), Ch 14
- Sweller, *Cognitive Load During Problem Solving* (1988); Mayer, *Multimedia Learning* (3e)
- Salmoni, Schmidt & Walter (1984) — guidance hypothesis; Winstein & Schmidt (1990)
- Renshaw & Davids, *The Constraint-Led Approach* (motor learning)
- Volleyball Canada *Person Pillar Guidebook for Coaches* (EN)
- Mark Rosewater, *Making Magic* design columns (MTG reminder text)
- Engelstein & Shalev, *Building Blocks of Tabletop Game Design* (2019)
