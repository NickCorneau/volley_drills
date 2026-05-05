---
id: fivb-source-material
title: FIVB Beach Volleyball Drill-Book — Source Archive (Hayden Jones / Daniel Dalanhese, FIVB Sports Development)
status: archival
stage: validation
type: research
authority: canonical local archive of the FIVB Beach Volleyball Drill-Book — the single most comprehensive external drill source behind M001 content authoring; captures the book's drill data model, chapter-level teaching frameworks, full drill TOC, verbatim excerpts of key drills, and the FIVB-name → our-drill-id cross-reference
summary: "Local archive of the FIVB Beach Volleyball Drill-book (104 drills across 8 chapters, 130 pages). Captured so the book's teaching frameworks (moving-triangle passing, in-system / out-of-system definition, wind-adjusted passing and serving, hand-signal blocking conventions) and drill inventory stay referenceable without re-mining the PDF. Net-new findings (coaching cues, Tier 2 polish candidates, Tier 3+ backlog items) already live in the 'FIVB drill-book re-review (2026-04-20)' section of `docs/research/beach-training-resources.md`; this note preserves the source material those findings are derived from and the parts not yet explicitly mined."
last_updated: 2026-05-04
depends_on:
  - docs/decisions.md
  - docs/milestones/m001-solo-session-loop.md
  - docs/plans/2026-04-20-m001-tier1-implementation.md
  - docs/research/beach-training-resources.md
related:
  - docs/research/bab-source-material.md
  - docs/research/warmup-cooldown-minimum-protocols.md
  - docs/research/practice-plan-authoring-synthesis.md
  - docs/research/sources/FIVB_Beachvolley_Drill-Book_final.pdf
decision_refs:
  - D80
  - D104
  - D105
  - D130
---

# FIVB Beach Volleyball Drill-Book — Source Archive

## Agent Quick Scan

- **What**: local archive of the FIVB *Beach Volleyball Drill-book* by Hayden Jones and Daniel Dalanhese, published by FIVB Sports Development Department (Lausanne). 130 pages, 104 drills, 8 chapters.
- **Source file**: `docs/research/sources/FIVB_Beachvolley_Drill-Book_final.pdf`. Do not re-solicit from the founder.
- **Why this note exists**: the book is large and valuable, and previous mining only captured net-new coaching cues (in `docs/research/beach-training-resources.md` section "FIVB drill-book re-review (2026-04-20)") without preserving the book's structure, drill inventory, or teaching-framework prose. This archive fills that gap in parallel with `docs/research/bab-source-material.md`.
- **Authoritative for**: FIVB source provenance, the book's chapter/drill TOC, the drill data-model schema, the per-chapter teaching frameworks, the FIVB-name → our-drill-id cross-reference.
- **Not authoritative for**: what our drills do (that lives in `app/src/data/drills.ts`), progression rules (`app/src/data/progressions.ts`, `docs/specs/m001-adaptation-rules.md`), or product decisions (`docs/decisions.md`).
- **Read the sibling archives too**: `docs/research/bab-source-material.md` for BAB, and the existing FIVB re-review section in `docs/research/beach-training-resources.md` for the distilled findings that already informed Tier 1.
- **Plan-builder synthesis lives elsewhere.** For the cross-source distillation of how Volleycraft should build practice plans using FIVB guardrails alongside BAB and VDM (feed-type honesty, whole-chain bias, cue density, fatigue caps, zone-convention disambiguation), see `docs/research/practice-plan-authoring-synthesis.md`. This archive remains the FIVB drill-book provenance surface.

## Why this note exists

The FIVB drill book has been mined at least twice before — first for the drill data model and initial coaching cues (captured through `docs/research/beach-training-resources.md`), and second on 2026-04-20 for the "FIVB drill-book re-review" section of the same file. Both passes extracted **findings** but not **source structure**. That means any future Tier 2+ work (attack chain, defense chain, block chain, pressure-block design, or vocabulary audits) would have to re-open the PDF and re-derive the book's structure from scratch.

This note is the structural counterpart to the findings — the TOC, drill inventory, chapter philosophies verbatim, and the mapping from FIVB drill names to our drill IDs — so a future agent can cite FIVB content from markdown alone.

## Source details

- **Title**: *Beach Volleyball Drill-book*
- **Publisher**: FIVB Sports Development Department, Edouard-Sandoz 2–4, CH-1006 Lausanne, Switzerland (`development@fivb.org`, `www.fivb.com`)
- **Authors**:
  - **Hayden Jones** — FIVB International Beach Volleyball Instructor, USAV BCAP certified. New Zealand National Champion (2002), New Zealand King of the Beach (2000), Asian Beach Volleyball Champion (2002). Coaches Beach Volleyball California — Huntington.
  - **Daniel Dalanhese** — Brazilian-born, raised in Sandy, Utah. Professional beach volleyball player; first US national main draw 2009; 9th at Huntington Beach AVP 2010. Coaches Beach Volleyball California — Huntington.
- **Length**: 130 pages
- **Drill count**: 104 drills (the preface says "over 100 special drills"; the 8 chapter totals sum to 22 + 7 + 16 + 9 + 8 + 10 + 17 + 15 = 104)
- **Published as**: an e-book; no print edition referenced

### Published purpose (from preface)

> "The e-book goes directly to the heart of Beach Volleyball and takes the reader step by step through various drills and skills in a clear and understandable form. We trust that this e-book is a useful tool for coaching Beach Volleyball players and assists those who are really in need for a simple and comprehensive material. Enjoy Beach Volleyball!"

The book is explicitly scoped at **coaches of emerging Beach Volleyball programs** ("a sport in the embryonic stage of its development," per the preface). That framing shows up in the drill data: many "beginner" drills still specify a participant minimum of "1 athlete + coach assisting," which is a load-bearing fact for our solo-first product framing (see `docs/research/beach-training-resources.md` line 106 and the Diamond Passing drill below).

## Book structure at a glance

Eight chapters. Drill numbering follows a `<chapter>.<index>` convention (e.g. `3.5` is chapter 3 drill 5).

| Chapter | Topic | Drill range | Drill count | Level distribution |
| --- | --- | --- | --- | --- |
| 1 | Warm Up | 1.1 – 1.22 | 22 | 6 beginner, 3 beginner/intermediate, 8 intermediate, 3 intermediate/advanced, 2 advanced |
| 2 | Serving | 2.1 – 2.7 | 7 | 1 beginner, 2 beginner/intermediate, 1 intermediate, 3 intermediate/advanced |
| 3 | Passing (Serve Receive) | 3.1 – 3.16 | 16 | 5 beginner, 2 beginner/intermediate, 8 intermediate, 1 advanced |
| 4 | Setting | 4.1 – 4.9 | 9 | 1 beginner, 2 beginner/intermediate, 4 intermediate/advanced, 2 advanced |
| 5 | Attacking | 5.1 – 5.8 | 8 | 2 beginner, 4 intermediate, 1 intermediate/advanced, 1 advanced |
| 6 | Blocking | 6.1 – 6.10 | 10 | 1 beginner, 3 beginner/intermediate, 1 intermediate, 3 intermediate/advanced, 2 advanced |
| 7 | Defense | 7.1 – 7.17 | 17 | 3 beginner, 1 beginner/intermediate, 11 intermediate, 2 intermediate/advanced |
| 8 | Modified Games | 8.1 – 8.15 | 15 | 3 beginner/intermediate, 3 intermediate, 4 intermediate/advanced, 4 advanced, 1 supplementary note |

**Total: 104 drills + 1 supplementary note (8.15 "Additional notes on Voleste").**

Beginner drills are heavily concentrated in Warm-Up (6) and Passing (5); Setting has only 1 beginner drill and Attacking has 2. The skew matters for our content strategy: FIVB treats setting and attacking as intermediate-and-up skills, which is **consistent with VDM's Train-to-Train anchor** for setting and inconsistent with some BAB practice plans that introduce setting drills to beginners. Tier 1's 8-rung setting chain splits the difference by splitting rung 1 into Bump Set / Hand Set fundamentals (BAB-anchored beginner content) before the FIVB-level intermediate work.

## The FIVB drill data model (verbatim schema)

Every drill in the book follows the same structured schema. This is load-bearing for our `app/src/data/drills.ts` Drill type — the existing shape aligns with FIVB's model deliberately (see `docs/research/beach-training-resources.md` section "Drill data model"):

- **DRILL TITLE** — always `<chapter>.<index>` followed by the chapter name (e.g. `3.5 PASSING`), then the drill name on its own line, then the level tag in parentheses `(beginner)` / `(beginner / intermediate)` / `(intermediate)` / `(intermediate / advanced)` / `(advanced)`.
- **EQUIPMENT** — `Ideal:` and `Minimum:` ball counts (and optionally cones/boxes/nets).
- **PARTICIPANTS** — `Ideal:`, `Maximum:`, `Minimum:` — where **Minimum frequently includes "+ coach assisting"** or **"+ coach participating"**. This is the source of our "1 athlete + coach" observation.
- **DRILL OBJECTIVE** — 2–5 sentences of intent.
- **DRILL DESCRIPTION** — the step-by-step of how to run the drill. Longest section of each drill.
- **DRILL VARIATIONS / MODIFICATIONS** — bulleted list of ways to make the drill harder, easier, or different. Usually 2–4 items.
- **TEACHING POINTS** — numbered list (1, 2, 3, …) of coaching cues. Usually 2–4 items.

Legend / keys used in the diagrams (from page 7):

- Dashed line = Movement of athlete with target
- (Solid line with arrow) = Movement of ball with target
- (Bold arrow) = Hard attack
- (Dotted arrow) = Free ball or soft attack
- (Circle) = Athlete involved in play
- (Circle with person) = Athlete or coach running drill

Our existing `Drill` type maps to this cleanly: `equipment` → Equipment, `participantsMin/Ideal/Max` conceptually → Participants, `courtsideInstructions` → a condensed Drill Description, `coachingCues[]` → Teaching Points, `variants[]` → Drill Variations / Modifications.

## Chapter-level teaching frameworks (verbatim-anchored)

The book contains one expository essay per chapter (Warm-Up, Serving not present as a separate essay, Passing, Setting, Attacking, Blocking-and-Defense; the Modified Games chapter has no essay). Capturing these because they're the reasoning that the drills encode, and our `app/src/data/archetypes.ts` + drill content must remain honest to them.

### Warm-up essay (page 8, verbatim-anchored)

Core function (verbatim): *"The function of the warm up is to prepare the body for high-level performance, reduce the chance of injury and also to allow the athletes to get a feel for the current conditions."*

Key claims:

- "The warm up does not necessarily need to be Beach Volleyball related." — opens the door to the generic-dynamic-warmup default we already use via Beach Prep Two.
- "Activities with a ball will be better however as they allow the participant to get a feel for the current wind conditions." — supports our pair opening-block option (Tier 1 Unit 2) framed as feel-for-conditions in addition to activation.
- **"One training in the wind is worth three in the calm!"** — captured in `docs/research/beach-training-resources.md` line 573 as a candidate coach-note on the Safety Check screen when wind is `breezy` or `windy`.
- Injury prevention is explicitly called out at the advanced level: *"Some aspect of the warm up should be dedicated to paying special attention to those areas of the body that are tight and have a potential to flare up."* — aligns with `D105` + physio-review posture of targeted pre-hab rather than a generic cardio prelude.

### Passing essay (pages 41–42, verbatim-anchored)

This is the most load-bearing chapter essay for M001 content. Key claims captured verbatim:

- *"Passing is arguably the most important skill in Beach Volleyball, as it sets up the play for the team receiving the ball. If your pass is bad you start at a deficit from which it is hard to recover."* — foundational justification for passing as the M001 default focus.
- *"For those athletes transitioning from indoors to the beach the major difference is that in beach the ball not passed to position 2 ½. On the beach the ball should be passed to a position that is relative to where the pass was made. (Often referred to as the moving triangle theory of passing)"* — canonical reference for the **moving-triangle passing theory** already cited in `docs/research/beach-training-resources.md` line 353.
- *"The general rule is that the ball should be passed to a position forward and slightly towards the middle of the court. If however the ball is passed from the middle of the court the ball should be directed in a straight line towards the net."* — concrete operational rule, candidate for passing-drill courtside text.
- **Wind-adjusted trajectory** (verbatim): *"As the wind gets stronger you want to pass the ball lower – in fact in some cases when there is a very strong wind you should try to keep the ball as low as possible off the serve - your partner may not be able to hand set the ball but a bump set is a better option in these conditions. If there is no wind you can push the ball further up towards the net which will help create a better set by making it easier for the setter as they can see the net in their peripheral vision."* — canonical source for the wind-adjusted trajectory cues already cited in Unit 3 of Tier 1.
- **Receiving position** (verbatim): *"Position yourself deeper rather than closer to the net when receiving the serve to avoid being forced to make an overhead pass from the opponents serve. Standing further up is ok indoors but dangerous on the sand."* — source for the "tomahawk over fingers" overhead-touch convention on the beach.
- **Beginner cue** (verbatim): *"Passers should also focus on keeping the ball 'lower' 'closer' and 'smaller' than indoors."* — source for our "Pass smaller, closer, lower" beach-vs-indoor transition rule (`docs/research/beach-training-resources.md` line 574).
- **In-system / out-of-system definition** (verbatim, intermediate section): *"Imagine two lines perpendicular to the net made from the two passers - the first two plays the ball should always be contacted between these two lines. A ball that goes outside of these two lines is out of control or 'out of system' – balls kept inside these two lines are 'in system'."* — canonical operational definition cited in Tier 1 Unit 5 and in the serving-ladder authoring notes.

### Setting essay (page 60, verbatim-anchored)

Key claims:

- *"On the beach we do not need to be deceptive. If you pass the ball – you get to spike ... therefore a great set is one that your partner is comfortable hitting. If the set has a predictable and consistent trajectory with a similar height / arc it will be easier to hit."* — converges with BAB's "set your hitter, not a spot on the court" principle (see `docs/research/bab-source-material.md` Source 2, Lesson 2) from a different angle: predictability over placement.
- *"An obligation of the setter on the beach is to also to help out his/her partner on the attack by calling the area of the court that is open."* — source for the setter-call-after-set convention seen in BAB drills `Triangle Setting` and beyond.
- **Bump-set vs hand-set rule** (verbatim): *"Deciding when to bump set and when to handset is a learned skill but generally you will see more bump setting as the wind gets stronger. If bump setting in the wind you may want to add a little spin to the ball as a ball that has spin on it will generally travel in a more predictable manner and be easier to hit."* — reinforces why Tier 1's chain-7-setting splits rungs 1 and 2 into Bump Set and Hand Set fundamentals.
- **Rotation rule** (verbatim): *"Rotation on a ball set by the hands is legal indoors but beach volleyball players often bump set because the rules regarding rotation on the ball are significantly stricter on the sand."* — rule-level context for why bump-set fundamentals matter on sand.
- **Handedness cue** (verbatim): *"right handed athletes will hit better when a set is delivered to the right side of their bodies and left handed athletes when the ball is set to their left."* — candidate coachingCue for setting drills when the founder has partner handedness information.
- Beginner cue: *"Moving the feet to face the target is the most important concept to get through to beginners on the sand."* — converges with BAB "triangle hands, high and stable" and is reflected in our `squaring up` glossary term.

### Attacking essay (page 71, verbatim-anchored)

Key claims:

- *"The sand absorbs a greater amount of the force that you direct towards it to propel yourself upwards and as a result you will not jump as high as indoors."* — sand-specific physics framing.
- *"Your timing will change. Try to get from the sand to the ball as quickly as possible. Jump later and try not to hang in the air."* — canonical source for the "no hang in the air" beach-attack cue.
- *"Attacking indoors is largely about power. Attacking on the beach however is more about finesse."* — strategic framing.
- **Shot taxonomy** (verbatim): *"great beach volleyball players have a large variety of shots - many of which are never seen in the indoor game such as the knuckle, the 'pokie', the jumbo shrimp, the baby angle, etc."* — FIVB shot vocabulary, to add to the glossary when the attack chain is authored. Note: *"pokie"* is FIVB's spelling of what BAB spells as *"pokey"* — Tier 1 Unit 5 already uses the BAB spelling. Keep BAB spelling.
- **"Quick look" skill** (verbatim): *"Taking a quick look at the defender on the other side of the net between the time the pass is made and the spike is hit is a skill that is not used indoors."* — important attack-chain cue for Tier 3+; already informs the `Pass and Look` (3.15) and `Set and Look` (4.9) drills in the book.
- **Rule clarification** (verbatim): *"tipping is illegal on the beach."* — load-bearing rule for any future attack-coaching cues.
- Intermediate cue: *"change the direction of the ball at the last second with the wrist"* — standard wrist-snap cue.

### Block-and-defense essay (pages 81+, verbatim-anchored)

Short essay because the book scopes blocking/defense as "somewhat complicated and a detailed explanation will not be given in this document."

Key claims:

- **Hand-signal convention** (verbatim): *"the basic conventions for signaling blocking intentions involve holding the hands behind the back with the left hand representing what the blocker is going to block on the left side attacker and the right hand represents what the blocker is going to take away for the attacker on the right."*
- **Signal meanings** (verbatim): *"the blocker will either choose to take out the line (most frequently indicated by the display of 1 finger) or angle (indicated by the display of 2 fingers)."* — canonical source for our Tier 3+ blocking-chain hand-signal encoding (already cited in `docs/research/beach-training-resources.md` line 605).
- Beginner framing: *"it is not necessary to do a lot of block training with a defender behind because athletes will simply not be at a level of skill (or height) for it to be effective."* — supports deferring any block/defense content to Tier 3+.
- Intermediate framing: *"Athletes at an intermediate level will begin specializing in either blocking or defense."* — supports a role-based chain split in Tier 3+ (not a single "defense" chain).

## Chapter TOCs — all 104 drills

Drill name, drill number, level. Use this table when authoring any new drill, reviewing a Tier 2+ candidate, or writing a `// FIVB Drill-book 2.N` provenance comment.

### Chapter 1 — Warm Up (22 drills)

| # | Drill | Level |
| --- | --- | --- |
| 1.1 | Voleste | beginner |
| 1.2 | Single Two Ball Juggle | beginner |
| 1.3 | Two Ball Juggle in Pairs | beginner |
| 1.4 | Throw Pass and Catch | beginner |
| 1.5 | Skyball and Catch | beginner |
| 1.6 | Serve and Jog | beginner |
| 1.7 | Catch Behind in Lunge Position | beginner / intermediate |
| 1.8 | Pass Tomahawk Turn and Dig | beginner / intermediate |
| 1.9 | Pass Means Set / Set Means Pass | beginner / intermediate |
| 1.10 | Voleste | intermediate |
| 1.11 | Movement Drill | intermediate |
| 1.12 | One Ball Under One Ball Over | intermediate |
| 1.13 | Block / Drop / Pass | intermediate |
| 1.14 | In Threes Set Behind | intermediate |
| 1.15 | Off the Ground Game | intermediate |
| 1.16 | Butterfly | intermediate |
| 1.17 | No Jump Shot Game | intermediate |
| 1.18 | Square Drill | intermediate / advanced |
| 1.19 | 1 on 1 Volley Cross Court | intermediate / advanced |
| 1.20 | One Arm Game | intermediate / advanced |
| 1.21 | Voleste | advanced |
| 1.22 | Standing Shot with Retreating | advanced |

*Voleste appears three times (1.1, 1.10, 1.21) at escalating levels — it is the book's signature warm-up, a low-scoring restricted-touches mini-game. Additional notes on Voleste are on page 127 (§ 8.15).*

### Chapter 2 — Serving (7 drills)

| # | Drill | Level |
| --- | --- | --- |
| 2.1 | Serve and Get Into Position | beginner |
| 2.2 | Serving Outside the Heart | beginner / intermediate |
| 2.3 | Deep Serve Practice | beginner / intermediate |
| 2.4 | Force Them Back | intermediate |
| 2.5 | Serving Variety Drill | intermediate / advanced |
| 2.6 | First to 10 Serving Drill | intermediate / advanced |
| 2.7 | Split the Passers | intermediate / advanced |

### Chapter 3 — Passing (16 drills)

| # | Drill | Level |
| --- | --- | --- |
| 3.1 | Pass Around the Lines | beginner |
| 3.2 | One on One | beginner |
| 3.3 | Pass and Slap Hands | beginner |
| 3.4 | Non Passer Move | beginner |
| 3.5 | Diamond Passing | beginner |
| 3.6 | The U Passing Drill | beginner / intermediate |
| 3.7 | Passing In System | beginner / intermediate |
| 3.8 | W Passing Drill | intermediate |
| 3.9 | Pass and Spike | intermediate |
| 3.10 | Alternating Passing Drill | intermediate |
| 3.11 | Backspin and Topspin Passing | intermediate |
| 3.12 | One Arm Passing | intermediate |
| 3.13 | Short / Deep | intermediate |
| 3.14 | Pass and Switch | intermediate |
| 3.15 | Pass and Look | intermediate / advanced |
| 3.16 | Topspin Serve Off Box Drill | advanced |

### Chapter 4 — Setting (9 drills)

| # | Drill | Level |
| --- | --- | --- |
| 4.1 | Set and Move | beginner |
| 4.2 | High Rep Setting — Triangle | beginner / intermediate |
| 4.3 | High Rep Setting (for Large Groups) | beginner / intermediate |
| 4.4 | High Rep Setting — Triangle | intermediate / advanced |
| 4.5 | Retreat and Transition to Set | intermediate / advanced |
| 4.6 | Setting Ball Out of the Net | intermediate / advanced |
| 4.7 | 4 Great Sets | intermediate / advanced |
| 4.8 | Block and Transition Set | advanced |
| 4.9 | Set and Look | advanced |

### Chapter 5 — Attacking (8 drills)

| # | Drill | Level |
| --- | --- | --- |
| 5.1 | Stand and Spike | beginner |
| 5.2 | Shot Practice | beginner |
| 5.3 | Over on Two | intermediate |
| 5.4 | Short / Deep | intermediate |
| 5.5 | Shooting Away from Defense | intermediate |
| 5.6 | Around the World | intermediate |
| 5.7 | Spike Exhaustion Drill | intermediate / advanced |
| 5.8 | Continuous Spiking | advanced |

### Chapter 6 — Blocking (10 drills)

| # | Drill | Level |
| --- | --- | --- |
| 6.1 | Basic Blocking Drill | beginner |
| 6.2 | Block Option Training (Angle Block Option Drill) | beginner / intermediate |
| 6.3 | Read the Power Shot | beginner / intermediate |
| 6.4 | Pulling Off the Net (Footwork) | beginner / intermediate |
| 6.5 | Blocker Transition | intermediate |
| 6.6 | Pulling and Playing the Ball | intermediate / advanced |
| 6.7 | Block and Transition to Set | intermediate / advanced |
| 6.8 | Retreat Decision Drill | intermediate / advanced |
| 6.9 | Jousting Drill | advanced |
| 6.10 | Turn and Get the Shot | advanced |

### Chapter 7 — Defense (17 drills)

| # | Drill | Level |
| --- | --- | --- |
| 7.1 | Kneeling One Arm Dig Training | beginner |
| 7.2 | Soft High Ball Option Training | beginner |
| 7.3 | Shifting Over Defense | beginner |
| 7.4 | Towel Defense | beginner / intermediate |
| 7.5 | Digging Hard Driven Spikes | intermediate |
| 7.6 | Defense Commitment Drill | intermediate |
| 7.7 | Moving Together Drill | intermediate |
| 7.8 | Chasing Down Line Behind a Block | intermediate |
| 7.9 | Hard Line Defense | intermediate |
| 7.10 | 2 Person Drill | intermediate |
| 7.11 | Rainbow Chase Drill | intermediate |
| 7.12 | Bulk Defense Drill | intermediate |
| 7.13 | Chasing Down the Shot | intermediate |
| 7.14 | Hard Driven High Balls | intermediate |
| 7.15 | Passing on the Move | intermediate |
| 7.16 | One Arm Dig | intermediate / advanced |
| 7.17 | Zig-Zag One Arm Dig | intermediate / advanced |

### Chapter 8 — Modified Games (15 drills)

| # | Drill | Level |
| --- | --- | --- |
| 8.1 | Movement Drill | beginner / intermediate |
| 8.2 | The Weakest Link | beginner / intermediate |
| 8.3 | Double or Nothing | beginner / intermediate |
| 8.4 | Add Up the Score | intermediate |
| 8.5 | Short Serves / Rainbow Shots | intermediate |
| 8.6 | Old School No Blocking | intermediate / advanced |
| 8.7 | Serve / Dig / Joust | intermediate / advanced |
| 8.8 | Monarch of the Court | intermediate / advanced |
| 8.9 | Serve / Free Ball / Down Ball | intermediate / advanced |
| 8.10 | Baseball | intermediate / advanced |
| 8.11 | Modified Court 1 on 1 | intermediate / advanced |
| 8.12 | Standing Shot Game | advanced |
| 8.13 | Over on 1 | advanced |
| 8.14 | Continuous Spiking | advanced |
| 8.15 | Additional Notes on Voleste | supplementary |

## Selected drills captured verbatim

These drills have load-bearing content that the M001 or Tier 2+ plan references — captured here at enough fidelity that the plan can cite markdown without reopening the PDF.

### 2.2 Serving Outside the Heart (beginner / intermediate)

- **Equipment**: Ideal "as many balls as possible", minimum 3 balls.
- **Participants**: Ideal 4 athletes + coach observing; minimum 1 athlete + coach assisting.
- **Objective**: Treat the middle-front of the receiving court as a no-serve zone shaped like a heart. Simpler than zone numbers and good for a first-rung tactical serving variant.
- **Status**: Tier 2 polish candidate. Already flagged in `docs/research/beach-training-resources.md` line 588. Not cloned in Tier 1 because `d31 Self Toss Target Practice` (BAB) is our first-rung anchor.

### 2.3 Deep Serve Practice (beginner / intermediate)

- **Key cue captured** (verbatim): *"In order for the deep serve to be effective it must travel high over the passers to force them back as low flat serves can be passed without the opposition having to retreat."* — canonical source for the deep-serve cue on `d34 Deep Rainbow Serves` in Tier 1 Unit 3.
- Setup: draw a line 3 feet from the baseline (cones optional); athletes serve a number of serves deep in a row, then break each serve with a run into the court.

### 2.4 Force Them Back (intermediate)

- **Objective**: pressure drill scoring the **passer vs server** — passer scores if the pass is set between two lines (approximately 2 ft and 10 ft back from the net); server scores if they force a pass behind the 10-ft line.
- **Why it matters**: cleanly translates pass quality into a binary serve outcome. Candidate Tier 2 "pressure serving" drill (see `docs/research/beach-training-resources.md` line 589).
- **Status**: Tier 2 polish candidate. Not in Tier 1.

### 2.7 Split the Passers (intermediate / advanced)

- **Concept**: "husband-and-wife" serve — aim at the inside shoulder of a passer and use the wind to draw the ball back to the other passer.
- **Key cues captured** (verbatim, Teaching Points 3 and 4): *"A deeper serve (or starting a little further back from the service line) will move more in the wind."* and *"Let athletes know that this is a good serve to use at the beginning and end of games."*
- **Status**: Partner-only, out of M001 scope. Named for Tier 3+ pair-partner-serving work (see `docs/research/beach-training-resources.md` line 590).

### 3.5 Diamond Passing (beginner)

- **Setup**: coach stands on ground or bench and serves balls in order from 1–4 (short-left, short-right, deep-left, deep-right).
- **Load-bearing cap** (verbatim): *"It is recommended that the receiver plays 2 sets of 4 serves. Any more than that and technique is likely to suffer due to fatigue."* — canonical source for our `D77` fatigue-cap reasoning and already captured in `docs/research/beach-training-resources.md` lines 407–413.
- Participants minimum: "1 athlete + coach assisting" — one of the main sources of our "solo-first-is-structurally-hard" observation.
- **Status**: The fatigue cap rule is fully integrated into our policy; the drill itself is a content-polish candidate since our `chain-3-movement` drills already exercise similar short-deep-left-right footwork patterns.

### 3.7 Passing In System (beginner / intermediate)

- **Operational definition** (verbatim): *"If you visualize two lines running perpendicular to the net from each player – any ball played within these two lines (and forward) is considered 'in system' while any ball played outside of these two lines is considered 'out of system'. 'In system' is good and out of system' is bad."*
- **Scoring rule**: 1 point per play that stays in system; optional +1 for spiking the ball inside the opposition court.
- **Status**: The **definition** is load-bearing for our pass-quality rubric note supporting `D104` (already captured in `docs/research/beach-training-resources.md` line 582). The drill itself is a future-content candidate for a `Pass pressure` rung once a passing-pressure chain is scoped.

### 4.6 Setting Ball Out of the Net (intermediate / advanced)

- **Setup**: an athlete throws or spikes the ball into the bottom of the net; a different athlete drops low and bump-sets the rebound up for an attack.
- **Prerequisite**: the net must have a tight cord running through the bottom so the ball bounces out rather than falling straight down; ball must be driven into the very bottom of the net, not the top.
- **Status**: Tier 2 polish candidate (already flagged in `docs/research/beach-training-resources.md` line 599). Not in Tier 1's 8-rung setting chain because it's scenario-specific, not foundational.

### 4.7 4 Great Sets (intermediate / advanced)

- **Setup**: coach throws balls to four positions — `1 = bad pass (too close to the net and too far across)`, `2 = perfect pass`, `3 = bad pass (too far off the net)`, `4 = bad pass (off the side of the court)`. Setter moves from passing position and must decide bump-set vs hand-set on each rep.
- **Why it matters**: this is a **variability drill** that directly trains the real-game decision. Cited in Tier 1 Unit 4 authoring rules as a Tier 2 polish candidate if the current 8-rung chain proves too drill-mechanical in partner walkthrough.
- **Status**: Tier 2 polish candidate (already flagged in `docs/research/beach-training-resources.md` line 598).

### 5.6 Around the World — **attacking** version (intermediate)

- **Zones**: 5 zones (numbered 1–5 in the drill), not 6 (FIVB serving) or 7 (BAB attacking). This is a third convention: FIVB's attack `Around the World` is a 5-zone grid.
- **Rule**: attacker goes in order 1 → 5; if a zone is hit, the attacker can skip that zone on the next round; a player can also work 1 → 5 only moving forward on successful hits.
- **Status**: Flag at Tier 3+ attack-chain authoring time. **Four conventions now exist** — BAB uses 7 zones for attacking (Plans 1, 4 Around the World), FIVB uses 5 (this drill), BAB serving scales separately as 4 / 6 / 8 zones by level, and BAB Plan 7 introduces **per-shot attack-accuracy boxes** (4×4 single-shot rectangles in Drill 4; two-shot boxes per attacker in Drill 6) that score one repeated shot rather than march through a numbered ladder. Our attack chain should pick the right convention(s) and document the choice using explicit criteria such as source authority, cognitive load, target measurability, and catalog consistency. Record FIVB's 5-zone version, BAB's 7-zone version, and BAB Plan 7's accuracy-box version as explicit alternatives — do not silently assume one convention. See `docs/research/bab-source-material.md` Plan 7 synthesis and `docs/research/practice-plan-authoring-synthesis.md` Thesis T6.

### 5.7 Spike Exhaustion Drill (intermediate / advanced)

- **Concept**: high-volume spike drill with fatigue induced by movement between reps. The name alone is load-bearing for our `D77` fatigue-cap policy.
- **Status**: Tier 3+ attack-chain candidate, but **flag it at author time against `D77` before copying the rep counts**. The book suggests 6–12 balls over the net without touching the net; that is a high shoulder load and needs a physio check before we ship it (already flagged in `docs/research/beach-training-resources.md` line 607).

### 5.8 Continuous Spiking (advanced)

- **Concept**: one side hits only line, the other only angle; after N reps or a set time, switch directions. Can be used as advanced warm-up.
- **Status**: Tier 3+ backlog. Also appears as Modified Game 8.14 (same name, same shape).

## FIVB glossary (pulled from book text)

Captured as reference; Tier 1 Unit 5 already uses BAB glossary as the authoritative term list. Where FIVB and BAB use different spellings for the same term, **use BAB's spelling** (already established in Tier 1 Unit 5).

| Term | FIVB meaning |
| --- | --- |
| Moving triangle | Passing theory: ball is passed to a position forward and slightly toward the middle of the court, relative to the passer's location — not to a fixed "position 2 ½" as indoors. |
| In-system | Any ball played inside the two perpendicular-to-the-net lines running forward from each passer's home position (and forward of the passer). "Good." |
| Out-of-system | Any ball played outside those two lines. "Bad." Priority becomes to *bring the ball back in-system* rather than over-play. |
| Squaring up | Facing the target with feet and shoulders. Used repeatedly in setting drills. |
| Pass "lower / closer / smaller" | Beach-vs-indoor transition rule for passing targets. |
| "Quick look" | Attacker takes a quick look at the defender between the pass and the spike to place the ball away from them. |
| Tomahawk | Two-hand overhead emergency touch for high balls at serve-receive when the ball cannot be played with the fingers. |
| Knuckle | Over-hand directional tap with closed fist; FIVB-named attack variant. |
| Pokie | FIVB spelling of BAB's *pokey* — open-knuckle directional tip. **Use BAB spelling (pokey) in our copy.** |
| Jumbo shrimp | FIVB-named attack variant (a soft shot; exact technique not defined in the book). |
| Baby angle | FIVB-named attack variant (short angle shot). |
| Baby line | Short line shot. Used in drill 6.10 Turn and Get the Shot. |
| Over on 2 | Attack on the second contact (not after a set). Legal in beach; more aggressive than indoor. |
| Husband-and-wife serve | Serve aimed at the seam between two passers, using the wind to split them. |
| Shooting | Beach-specific term for placing the ball with a soft shot (contrasted with the indoor game where 4 defenders behind a 2-person block would dig soft shots easily). |
| Voleste | Restricted-touches mini-game used as a warm-up at all levels. (FIVB's signature warm-up; additional notes on page 127.) |

## FIVB drill → our-drill-id / Tier-status cross-reference

| FIVB drill | Tier / status | Notes |
| --- | --- | --- |
| **Warm-up 1.1 Voleste** (beginner) | Tier 3+ backlog | Restricted-touches mini-game; candidate shape for a "pressure block" in future session assembly (see Modified Games note below). |
| **Warm-up 1.7 Catch Behind in Lunge Position** | Not used | Activation/mobility drill; Beach Prep Two/Three already cover activation needs. |
| **Warm-up 1.8 Pass Tomahawk Turn and Dig** | Tier 2 polish candidate | Compound warm-up touching all four contact types. |
| **Warm-up 1.11 Movement Drill** | Content-polish candidate | Possibly fits `chain-3-movement`. |
| **Serving 2.1 Serve and Get Into Position** | Equivalent exists | Matches BAB Serve-and-Dash; do not duplicate. |
| **Serving 2.2 Serving Outside the Heart** | Activated as `d51` (2026-05-04) | Authored as the long-envelope beginner serving sibling for `d31`. New variants `d51-solo-open`, `d51-pair-open`, `d51-pair`; selection-path reroutes beginner serving main-skill blocks > 8 min from `d31` to `d51`. Provenance: `docs/plans/2026-05-04-004-feat-d51-beginner-serving-tactical-zone-depth-plan.md`. Third validated application of the source-backed content-depth activation pattern (after d49 and d50); first at the beginner level. |
| **Serving 2.3 Deep Serve Practice** | Tier 1 source (cues) | Deep-serve trajectory cue ("must travel high") feeds `d34 Deep Rainbow Serves` in Tier 1 Unit 3. |
| **Serving 2.4 Force Them Back** | Tier 2 polish candidate | Clean binary pressure-serving scoring. |
| **Serving 2.5 Serving Variety Drill** | Equivalent exists | Serves-to-zones; our `d33 Around the World Serving (6 zones)` covers the shape. |
| **Serving 2.6 First to 10 Serving Drill** | Equivalent exists | Same as our `d22 First to 10 Serving` (being retired to `m001Candidate: false` by Tier 1 Unit 3 in favor of BAB-authored ladder). |
| **Serving 2.7 Split the Passers** | Tier 3+ backlog | Partner-only, out of M001 scope. |
| **Passing 3.1 Pass Around the Lines** | Equivalent exists | Covered by passing-and-movement drills in `chain-1`/`chain-3`. |
| **Passing 3.2 One on One** | Equivalent exists | Similar to existing self-catch passing drill. |
| **Passing 3.3 Pass and Slap Hands** | Content-polish candidate | Coaching-cue-focused (separate hands between contacts). |
| **Passing 3.4 Non Passer Move** | Content-polish candidate | Teaches non-passer movement toward setting position. |
| **Passing 3.5 Diamond Passing** | Policy source only | Drill itself not cloned; the 2-sets-of-4 fatigue cap feeds `D77`. |
| **Passing 3.6 The U Passing Drill** | Content-polish candidate | Footwork-heavy variant; fits `chain-3-movement`. |
| **Passing 3.7 Passing In System** | Policy source only | The in-system/out-of-system definition feeds the `D104` scoring rubric note. |
| **Passing 3.8 W Passing Drill** | Content-polish candidate | More advanced variant of 3.6. |
| **Passing 3.11 Backspin and Topspin Passing** | Tier 2 polish candidate | Teaches reading of serve spin. |
| **Passing 3.13 Short / Deep** | Activated as `d50` (2026-05-04) | Authored as the long-envelope advanced passing sibling for `d46`. New variants `d50-pair-open` and `d50-solo-open`; selection-path reroutes advanced pair-open/solo-open passing main-skill blocks > 8 min from `d46` to `d50`. Provenance: `docs/plans/2026-05-04-003-feat-d50-advanced-passing-depth-plan.md`. |
| **Passing 3.15 Pass and Look** | Tier 3+ backlog | "Quick look" skill; belongs to attack-chain supporting work. |
| **Passing 3.16 Topspin Serve Off Box** | Tier 3+ backlog | Requires a serving box; high-difficulty; advanced. |
| **Setting 4.1 Set and Move** | Content-polish candidate | Beginner high-rep setting with movement; Tier 1 `d40 Footwork for Setting` covers similar ground. |
| **Setting 4.2 / 4.3 / 4.4 High Rep Setting (Triangle / Large Groups / Triangle-Advanced)** | Tier 1 equivalent | Covered by `d43 Triangle Setting` and `d44 Triangle Setting Off Toss`. |
| **Setting 4.5 Retreat and Transition to Set** | Tier 3+ backlog | Blocker-transition setting; belongs to future block-and-defense chain. |
| **Setting 4.6 Setting Ball Out of the Net** | Tier 2 polish candidate | Scenario-specific; not foundational. |
| **Setting 4.7 4 Great Sets** | Tier 2 polish candidate | Variability drill; candidate to replace a mechanical Tier 1 rung if partner walkthrough shows fatigue. |
| **Setting 4.8 Block and Transition Set** | Tier 3+ backlog | Block + defense + set sequence. |
| **Setting 4.9 Set and Look** | Tier 3+ backlog | Setter calls open court post-set; supports attack chain. |
| **Attacking 5.1 Stand and Spike** | Tier 3+ backlog | Canonical beginner attack drill; Tier 3+ rung 1 candidate. |
| **Attacking 5.2 Shot Practice** | Tier 3+ backlog | Soft-shot tap; Tier 3+ rung 2 candidate. |
| **Attacking 5.3 Over on Two** | Tier 3+ backlog | Canonical "on 2" attack. |
| **Attacking 5.4 Short / Deep** | Tier 3+ backlog | Scoring drill for short/deep shot placement. |
| **Attacking 5.5 Shooting Away from Defense** | Tier 3+ backlog | Reads defender movement. |
| **Attacking 5.6 Around the World** (5-zone attack) | Tier 3+ convention choice | Alternative to BAB's 7-zone convention; must pick one at Tier 3+ authoring time. |
| **Attacking 5.7 Spike Exhaustion** | Tier 3+ backlog (flagged) | High shoulder-load; flag at author time against `D77`. |
| **Attacking 5.8 Continuous Spiking** | Tier 3+ backlog (flagged) | Also appears as Modified Game 8.14. |
| **Blocking 6.1–6.10** (10 drills) | Tier 3+ backlog | Hand-signal convention feeds the future block chain. |
| **Defense 7.1–7.17** (17 drills) | Tier 3+ backlog | Rich source for the eventual defense chain; intermediate-heavy. |
| **Modified Games 8.1–8.14** | Tier 3+ design-language source | One-line rule-delta games; candidate shape for "pressure block" session cells in a future session-assembly evolution (see `docs/research/beach-training-resources.md` line 608). |
| **Modified Games 8.15 Voleste notes** | Tier 3+ reference | Supplementary text on how to run Voleste at different levels. |

## How M001 uses this source

Most of the Tier 1 use is already captured:

- **Drill data model** → our `Drill` type in `app/src/data/drills.ts`. See `docs/research/beach-training-resources.md` line 239.
- **Diamond Passing fatigue cap** → `D77` fatigue-cap policy.
- **In-system / out-of-system definition** → `D104` binary pass-scoring rubric note. See `docs/research/beach-training-resources.md` line 582.
- **Moving-triangle passing theory** → passing-drill cue language; cited in `docs/research/beach-training-resources.md` line 353.
- **Wind-adjusted pass trajectory and bump-set-vs-hand-set-in-wind** → serving-into-wind cues authored on `d31`–`d37` and bump-set/hand-set decision framing on `chain-7-setting` rungs 1–2.
- **Deep-serve "must arc high" cue** → Tier 1 Unit 3, candidate cue on `d34 Deep Rainbow Serves`.
- **"Pass lower / closer / smaller" beach-transition rule** → Tier 1 Unit 5 glossary header and passing-drill courtside text.
- **"One training in the wind is worth three in the calm"** → candidate coach-note on Safety Check screen when wind is `breezy` or `windy`.
- **Squaring up definition** → Tier 1 Unit 5 glossary header entry.
- **Tier 2 polish candidates** → captured in `docs/research/beach-training-resources.md` "FIVB drill-book re-review (2026-04-20)" lines 588–599.
- **Tier 3+ backlog** (blocking hand-signals, defense drill inventory, attack-drill fatigue flags, Modified Games as session-cell shape) → captured in `docs/research/beach-training-resources.md` lines 601–608.

This note does not decide anything new — it archives the source so the above references survive any future reorganization.

## Source-provenance citation convention

When citing FIVB in inline code comments (`app/src/data/drills.ts`, `app/src/data/progressions.ts`) or prose:

- **Specific drill**: `// FIVB Drill-book <chapter>.<index> <drill name>` — e.g. `// FIVB Drill-book 3.7 Passing In System` for the in-system definition.
- **Chapter essay**: `// FIVB Drill-book — <chapter name> essay` — e.g. `// FIVB Drill-book — The Pass essay` for the moving-triangle theory.
- **General book reference**: `// FIVB Drill-book (Jones & Dalanhese)` when citing structural claims.

Do not paraphrase long quotes in code comments. Keep verbatim excerpts here and in `docs/research/beach-training-resources.md` (for findings) — code comments reference, they do not duplicate.

## Relationship to the existing FIVB re-review

The "FIVB drill-book re-review (2026-04-20)" section of `docs/research/beach-training-resources.md` (lines 565–621) captures the **distilled findings** from the book — coaching cues promoted to Tier 1, Tier 2 polish candidates, Tier 3+ backlog items, and an "already captured, do not re-mine" list.

This note is the **source archive** that re-review is derived from: it captures the book's structure, drill inventory, per-chapter philosophies, and representative verbatim drill text.

Use the re-review when you want to know *what the book told us to do*. Use this archive when you want to know *what the book actually contains*, or to cite the book structurally in a new decision or plan.

## For agents

- **Authoritative for**: FIVB source provenance, the 8-chapter / 104-drill inventory, the drill data-model schema, the per-chapter teaching-framework prose, the FIVB drill → our-drill-id cross-reference, and the three-conventions note on Around-the-World zone counts.
- **Edit when**: Tier 2+ work clones a specific FIVB drill (update the cross-reference table), or a drill name is found to be mis-spelled (correct and note), or an FIVB concept gets promoted into a decision (link the decision ID).
- **Belongs elsewhere**: drill contracts (`app/src/data/drills.ts`), chain definitions (`app/src/data/progressions.ts`), session-assembly logic (`app/src/domain/sessionBuilder.ts`), product decisions (`docs/decisions.md`), Tier 1 scope (`docs/plans/2026-04-20-m001-tier1-implementation.md`).
- **Outranked by**: `docs/decisions.md`, `docs/milestones/m001-solo-session-loop.md`.
- **Key pattern**: this note is an **archive**. It does not impose product decisions. Cite it; do not promote its content into product contracts without an explicit decision entry in `docs/decisions.md`.
- **Sibling archives**: `docs/research/bab-source-material.md` (BAB course + drill book). Both use the same shape so agents can cross-reference by drill name across sources.
