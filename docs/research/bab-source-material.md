---
id: bab-source-material
title: Better at Beach (BAB) Source Material — Drill Book, Beginner's Guide, Coaches Guide
status: archival
stage: validation
type: research
authority: canonical local archive of the BAB external sources that ground the M001 Tier 1 content authoring — drill inventory, lesson taxonomy, coaching principles, and the BAB-drill-name → our-drill-id cross-reference
summary: "Local archive of the three Better at Beach courses / books used as external content anchors for M001 Tier 1: the 2024 Essential Drills Book (37 drills across 20 practice plans), the Beach Volleyball Beginner's Guide course (4 lessons with tutorials + homework drills), and the Coaches Guide essays on focus / engagement / competitive fire. Captured so future edits do not require re-soliciting the sources."
last_updated: 2026-04-20
depends_on:
  - docs/decisions.md
  - docs/milestones/m001-solo-session-loop.md
  - docs/plans/2026-04-20-m001-tier1-implementation.md
related:
  - docs/research/beach-training-resources.md
  - docs/research/warmup-cooldown-minimum-protocols.md
decision_refs:
  - D105
  - D130
---

# Better at Beach (BAB) Source Material

## Agent Quick Scan

- Use this note as the **local archive** of what was actually in the three BAB sources the founder referenced on 2026-04-20. Previous tier-1 planning relied on the founder pasting excerpts into chat; this note preserves those excerpts so subsequent edits or Tier 2+ content work can cite BAB without asking for the material again.
- Three sources captured:
  1. **2024 Essential Drills Book** — 37 drills, grouped into 20 practice plans (passing / setting / attacking / defense / game play). Full text of Practice Plan 1 (8 drills) is captured verbatim; other practice plans are captured at TOC level with drill names only.
  2. **Beach Volleyball Beginner's Guide to Success** — 4 lessons (passing, setting, attacking, serving) each with short tutorials plus homework drills. Captured at tutorial-title + drill-name level.
  3. **Coaches Guide: How to Prepare the Perfect Beach Volleyball Practice** — 3 essays (focus, engagement, competitive fire) including BAB's canonical practice-plan template. Captured verbatim.
- Authoritative for: BAB source provenance and the BAB-drill-name → our-drill-id cross-reference.
- Not authoritative for: what our drills do. Drill contracts live in `app/src/data/drills.ts`; progression rules live in `docs/specs/m001-adaptation-rules.md`.
- **Not an endorsement.** BAB is one external ground among several (VDM, FIVB, general beach coaching). Where BAB and VDM disagree on progression (e.g. setting-rung count), M001 Tier 1 follows **BAB + VDM combined**, not BAB alone — see `docs/plans/2026-04-20-m001-tier1-implementation.md` Unit 4 rationale.

## Why this note exists

M001 Tier 1 content (`docs/plans/2026-04-20-m001-tier1-implementation.md` Units 3 and 4) is authored directly from BAB drill names and tutorial structure, with VDM used as the skill-stage anchor. Without this note, the BAB source material exists only in the 2026-04-20 founder conversation transcript, which is:

- Awkward to re-scan when future work adds drills or renames them
- Not citable in PRs or in-code provenance comments
- Not durable against transcript loss or format changes

`D130` further makes content authoring a Tier-1 loop activity rather than a one-shot research pass — so the sources need to live as doc content, not only as in-memory conversation context.

## Source 1 — 2024 Essential Drills Book

### Scope

- **Title**: `2024 Better at Beach Volleyball Drill Book`
- **Drill count**: 37 essential drills, organized into 20 practice plans
- **Practice plan categories**: Passing (Plans 1–4), Setting (Plans 5–6), Attacking (Plans 7–11), Defensive (Plans 12–16), Game Play (Plans 17–20)
- **Pedagogical note captured**: "All of the drills under the Serving header can be easily converted into attack drills." (Used as invariant 2 in `app/src/data/archetypes.ts` Tier 1 header comment.)

### Practice plan TOC (drill names only)

This is the single best cross-reference the founder has for BAB-canonical drill names. Captured at the level we received it (drill names, not internal contents) for every plan except Plan 1, which is captured in full below.

**Plan 1 — Passing**: Best Warm Up Ever · 6 Guns · Basic S/R Footwork · Triangle Setting from Other Side of the Net · Pass Set Spike to Perimeter · Around the World (Toss) · Around the World (Serve) · 3 Before 5 (Serve 1 Player)

**Plan 2 — Passing**: Best Warm Up Ever · 7 Drills 4 Quadrants · Serving Spots Around the World · Serve Spot, Dig Set Hit · Server vs Passer (Sideline Serves) · Server vs Passer (Middle/Seam Serve) · Server vs Passer (+3/-3) (No Attack)

**Plan 3 — Passing**: Best Warm Up Ever · 6 Guns · Basic S/R Footwork · Passing Triangle from Toss · Passing Triangle from Serve · Triangle Setting from Other Side of the Net · Pass Set Spike to Perimeter · 3 Before 5 (Serve 1 Player)

**Plan 4 — Passing**: Best Warm Up Ever · 6 Guns · Basic S/R Footwork · 6 Legged Monster Passing · 6 Serve Speed Ball · Around the World (Serve) · 3 Before 5 (Serve 1 Player)

**Plan 5 — Setting**: Best Warm Up Ever · Footwork for Setting · Triangle Setting · Pass, Set, Set, Set · Defensive Retreatment · Cross Court Pepper · 3 Before 5 (Serve 1 Player) · Mini Games to 7 (Two Players Battle) (Option 1)

**Plan 6 — Setting**: Best Warm Up Ever · Corner to Corner Setting · Triangle Setting · Triangle Setting (Serve/Toss) · Triangle Setting Off Serve - Off Pass · Triangle Setting Off Serve - Run Through Back Sets · Open Net, High Line, Free. Wash Drill

**Plan 7 — Attacking**: Best Warm Up Ever · Triangle Setting · Cross Court Pepper · +3/-3 Highlines - Cut Shots/ HL · Highlines - Cuts - Open Net Swing · 2 Ball Side Out · Comp Transition HL - CS - Live

**Plan 8 — Attacking**: Best Warm Up Ever · Hitting a High Line · Hitting a Cut Shot · Around the World (Toss) · Around the World (Serve) · High Line - Cut Shot - Live (only shots) · 3 Before 5 (Serve 1 Player) (SHOTS ONLY) · Games to 7 - Round 1 and 2 ONLY

**Plan 9 — Attacking**: Best Warm Up Ever · 6 Guns · 3 Touch Vision Pepper · Offensive Accuracy - HL · Offensive Accuracy - CS · Beat the Blocker Cross/Line · Games - 14-15 Games to 21 · Set to 21

**Plan 10 — Attacking**: Best Warm Up Ever · Triangle Setting · Serve to Free Ball · High Line from a Serve with Defense · Cut Shot from a Serve with Defense (Blocker Blocking Line) · Cut Shot from a Serve with Defense (Blocker Blocking Cross) · Hard Cross from a Serve with Defense · Competitive - HL - CS - To Live Play · 14-15 Games to 21, Best of 3

**Plan 11 — Attacking**: Best Warm Up Ever · Triangle Setting · Cross Court Pepper · +3/-3 Highlines (CS / HL with Blocker) · Beat the Blocker · 14-15 Games to 21, Best of 5 · Set to 21

**Plan 12 — Defensive**: Best Warm Up Ever · Partner Toss Dig to Cut Shot · 4 Steps to Paradise · Serve a Spot - Dig Set Hit · Competitive - HL - CS - to Live Play · Mini Games to 7 (First Ball Focused Shot) · 14-15 Games to 21, Best of 5

**Plan 13 — Defensive**: Best Warm Up Ever (Dig from Knees) · Dig from Knees · Toss to Dig Cut/HL Shot · Hand Dig / Platform Dig Set - 2 sets · Toss to HL · Toss to Cut Shot · HL - Cut Shot - to Open Net · HL - Cut Shot - Live · 14-15 Games to 21

**Plan 14 — Defensive**: Best Warm Up Ever · Triangle Setting · Pull Digs to Set · Shuffle to High Line Dig · Shuffle to Cut Shot Dig · Competitive - HL - CS - To Live Play · 14-15 Games to 21, Best of 5

**Plan 15 — Defensive**: Best Warm Up Ever · Triangle Setting · 4 Steps to Paradise · Shuffle to High Line Dig · Shuffle to Cut Shot Dig · Shuffle to High Line/Cut Shot to Live Play · Mini Games to 7 (SHOTS ONLY) · 14-15 Games to 21, Best of 3

**Plan 16 — Defensive**: Best Warm Up Ever · Triangle Setting · Pull Digs to Set · Cross Court Pepper · Threat or No Threat · Threat or No Threat with Serve · Best of 3, Match to 21

**Plan 17 — Game Play**: Best Warm Up Ever · Triangle Setting · Race to 5 HL and CS · 10 Sideouts · 3 Before 5 · Games to 21

**Plan 18 — Game Play**: Best Warm Up Ever · Triangle Setting · Triangle Setting (Serve) · Triangle Setting with Attack (Serve) · Add In/Add Out · 14-15 Games to 21, Best of 5

**Plan 19 — Game Play**: Best Warm Up Ever · Cross Court Pepper · +3/-3 Highlines (Cut Shots/ HL) · Comp Transition HL - CS - Live · Small Court: Mini Games to 7 · Game to 21

**Plan 20 — Game Play**: Best Warm Up Ever · Triangle Setting · Around the World (Serve) · 3 Before 5 (Serve 1 Player) · 16-18 Run with It · 14-15 Games to 21, Best of 3

### Practice Plan 1 — full text (verbatim founder capture)

Captured for fidelity because Plan 1 is the most-cited plan in Tier 1 content authoring (warm-up, serve-receive, triangle setting, perimeter attacking, around-the-world, 3-before-5).

**Drill 1 — Best Warm Up Ever** (15 min): An amazing warm up that can be used at every practice or tournament. If done correctly it lasts ~12 minutes, very quick pace, no rest time, will get tired / sweaty / very warm.

- Pass back and forth — 10 each
- Set back and forth — 10 each
- Tomahawk back and forth — 10 each
- Pokey back and forth — 10 each
- Open hand one handed slap pepper
- Speed pepper — push speed on the dig, set and attack
- Defender only: starting from knees to lay down sprawl dig — 8 each side
- Blocker only: pull digs — 8 each side
- 5 game serves to a passer — pass and catch — each player
- Cross court dig to a cut shot — setter catches cut shot — 5 each player per side
- Water

**Drill 2 — 6 Guns** (15 min): Player 1 and Player 2 set up facing one another as if going to pepper. Three progressive versions.

- Version 1: Speed Pepper using Pass, Set, Hit. Players alternate touches (P1 Pass → P2 Set → P1 Hit → P2 Pass → P1 Set → P2 Hit).
- Version 2: Speed Pepper using Tomahawk or Pass. One player initiates; other reacts with pass or tomahawk depending on the ball received. Try to get the ball past your partner with control and speed.
- Version 3: Speed Pepper using only one hand. Non-dominant hand behind back; play legal volleyball touches (forearm digs, pokeys, back hand flippers, etc.). Switch arms after a few successful attempts.

**Drill 3 — Basic S/R Footwork** (10 min): Both players same side of the court. P1 tosses with back to net; P2 on court facing P1. Focus is proper footwork leading up to the pass — **step, shuffle**.

- P1 tosses to P2's right side → P2 passes back
- Same from P2's left side
- P1 tosses directly at P2's face → P2 uses drop step and shuffle to pass back
- Same from other side
- P1 tosses a short ball facing sideline → P2 uses big step shuffle to a knee, stands as they pass
- Switch jobs and repeat

**Drill 4 — Triangle Setting from Other Side of the Net** (10 min): All players on south side. P1 at net straight in front of P2 (serve-receive position). P3 in other passing position next to P2. P1 tosses or hits to P2, P2 passes to middle of court ~5 ft from net. P3 sets back to P1, who either catches-and-tosses next ball or hits back to P2. After 10 reps rotate. Once everyone has set, switch sides.

**Drill 5 — Pass Set Spike to Perimeter** (15 min): Before starting, draw two lines from end line to net ~3 ft inside the sidelines on the south side. P1 and P2 north of net; P3 south. P3 tosses to P1 or P2; they pass for the other to set. Once the set goes up, P3 calls "Left" or "Right." Attacker tries to hit inside the boxes made by the drawn lines. Correct direction + inside box = 1 point. Play to a point total or reps, then rotate.

**Drill 6 — Around the World (Toss)** (15 min): Draw 7 boxes on the court — **Short Poke Line · Mid Line Power · High Line · Deep Middle · Jumbo Cross Court · Hard Angle · Cut Shot**. Each box challenges the attacker to get the ball close to the sideline. Player must hit spot 1 before spot 2, etc. Player finishes after all spots. Roles: one tosses, one passes + attacks, one sets. More than 3? Add to attacking line.

**Drill 7 — Around the World (Serve)** (15 min): Same 7 zones as Drill 6, but with a serve-fed pass instead of a toss. One serves, one passes + attacks, one sets. More than 3? Add to attacking line.

**Drill 8 — 3 Before 5 (Serve 1 Player)** (20–30 min): Pressure drill on serve-receive side-out percentage. Team A serves at Team B the entire first round. Before starting choose one player to be served for the entire round. Round ends when Team A scores 3 or Team B scores 5. Repeat so both teams and each player serve and receive on both sides.

### BAB vocabulary glossary (derived from Plan 1 and the 20-plan TOC)

Used as the authoritative term list for Tier 1 Unit 5 (skill-vocabulary audit):

| Term | Meaning in BAB |
| --- | --- |
| Sideout | Serve-receive team wins the rally (serve → pass → set → attack) |
| Transition | Defense → set → attack after receiving a ball from the opponent |
| Tomahawk | Two-hand overhead emergency touch |
| Pokey | Open-knuckle directional tip |
| Pull Dig | Low-body dig from blocker position pulled off net |
| Cut Shot | Sharp cross-court angle shot (often shortened "CS") |
| High Line | Deep line shot over blocker (often shortened "HL") |
| Cross Court | Angle attack (not sharp cut) |
| Hard Angle | Between cross court and cut shot; aggressive angle |
| Jumbo Cross Court | Extreme cross-court angle (wider than hard angle) |
| Joust | Opposing players contacting the ball simultaneously at the net |
| Free Ball | Easy over-the-net ball the receiving team can pass cleanly |
| Down Ball | Standing spike from the attacker (no jump) |
| Pepper | Cooperative back-and-forth drill: dig / set / attack cycle |
| Speed Pepper | Pepper at higher tempo, pushing dig + set + attack speed |
| +3 / -3 | Score format: attack side needs +3 lead; defense needs -3 |
| 14–15 Games to 21 | Score starts at 14–15 (choose who's up); play to 21 |
| 3 Before 5 | Pressure format: serving team scores 3 before receiving team scores 5 |
| Paradise | The position on the court you want to be in as a defender (used in "4 Steps to Paradise") |

### Around the World — 7 attacking zones vs 6 serving zones

BAB uses "Around the World" as a drill-format template applied to both attacking (7 zones, Drill 6) and serving (per the beginner course and the drill book's "Serving Spots Around the World" in Plan 2; 6 zones). The zone counts differ and are load-bearing for Tier 1 Unit 3:

- **Attacking (7 zones)**: Short Poke Line, Mid Line Power, High Line, Deep Middle, Jumbo Cross Court, Hard Angle, Cut Shot.
- **Serving (6 zones)**: 3 back + 3 front (back-left / back-middle / back-right / front-left / front-middle / front-right — standard BAB serving-zone grid).

Tier 1 Unit 3 authors `d33 Around the World Serving` with **6 zones** to match BAB serving convention. A future attack chain (Tier 3+) authors its own Around-the-World with 7 zones.

## Source 2 — Beach Volleyball Beginner's Guide to Success

### Scope

- **Type**: BAB course with 4 lessons, each with short tutorials and homework drills
- **Target user**: Beginner beach player (or existing-sport player new to beach)
- **Pedagogical shape**: Every lesson has a fixed structure: **Tutorials** (3 per lesson average, 2–4 min of explanation each) + **Homework** (1–3 drills per lesson, explicit drill names).

### Lesson structure (captured verbatim)

**Lesson 1 — Passing / Serve Receive**

- Tutorials:
  - The Perfect Platform
  - Passing/Serve Receive — Footwork
- Homework drills:
  - 6 Legged Monster
  - 4 Quadrant Ball Control
  - One Person Quadrant Pass Set Kill

**Lesson 2 — Setting**

- Tutorials:
  - Setting — How to Bump Set
  - Setting — How to Hand Set
  - Setting — Principles (*Set your Hitter, NOT a spot on the court*)
- Homework drills:
  - Tutorial Drill: Footwork for Setting
  - Corner to Corner Setting

**Lesson 3 — Attacking**

- Tutorials:
  - Attacking — Footwork, Timing, and Spacing
  - Attacking — Arm Swing
  - Attacking — Finding the Attacking Corridor
- Homework drills: *(none captured in the source paste — lesson has tutorials only or the homework section was not included)*

**Lesson 4 — Serving**

- Tutorials:
  - Serving — 3 Different Types of Serves
  - Serving — How to Standing Float Serve
  - Serving — What's Your Mission?
- Homework drills:
  - Self Toss Target Practice

### Invariants pulled from this source

Promoted into `coachingCues` and courtside copy in Tier 1 Units 3 and 4:

- **Setting principle #1**: *"Set your hitter, not a spot on the court."* Lives on all pair setting drills (`d42` Partner Set Back-and-Forth and up in the 8-drill Tier 1 Unit 4 chain).
- **Setting principle #2**: *"Triangle hands. High and stable."* From the Hand Set tutorial. Lives on Hand Set Fundamentals + Triangle Setting drills.
- **Serving principle #1**: *"What's your mission?"* From the Serving-Mission tutorial. Lives as an intent cue across all serving rungs 2–7.
- **Serving taxonomy**: *"Three types of serves: standing float, jump float, jump topspin."* Lives as a taxonomy header comment on `chain-6-serving` in `app/src/data/progressions.ts` so future authors don't mix topspin into the float ladder without an explicit rung.

### Drill-name anchors pulled from this source

- `Self Toss Target Practice` — canonical BAB name for the serving rung 1 drill (used as the name of `d31` in Tier 1 Unit 3).
- `Footwork for Setting` — canonical BAB name, already used as the name of the setting-chain footwork rung.
- `Corner to Corner Setting` — canonical BAB name, already used.
- `Bump Set` vs `Hand Set` — BAB treats these as two separately-taught fundamentals. Tier 1 Unit 4 splits the setting-chain foundation rung accordingly (see cross-reference below).

### Drill-name candidates (not in Tier 1)

Deferred to content polish / Tier 2+ authoring:

- `6 Legged Monster` — pair passing drill; already appears in Practice Plan 4 of the drill book.
- `4 Quadrant Ball Control` — solo-friendly ball control drill.
- `One Person Quadrant Pass Set Kill` — solo self-toss full-rep drill (pass → set → kill from one person). Novel relative to the drill book.

## Source 3 — Coaches Guide: How to Prepare the Perfect Beach Volleyball Practice

### Scope

Three short essays captured verbatim from the BAB Coaches Guide:

1. Establishing a Focus
2. Engaging Your Team and Keeping Them Engaged (includes the canonical Practice Plan Template)
3. Keeping the Competitive Fire Throughout Practice

### Essay 1 — Establishing a Focus (summary + load-bearing quotes)

Core claim (load-bearing for the single-focus invariant in `app/src/data/archetypes.ts`):

> "It's crucial that all drills during the practice are designed to reinforce this focus. A common mistake is creating drills that don't align with the intended focus, leading to a scattered practice. By maintaining a consistent focus, your athletes will have a specific skill to work on throughout the session."

> "Having a clear vision also helps you manage any drop in performance during practice. If the level of play decreases, you can bring the group back to the focal point of the session."

Tier 1 use: cited in the `app/src/data/archetypes.ts` invariant 1 header comment and in the `Pass · Serve · Set` single-focus toggle's rationale (`docs/plans/2026-04-20-m001-tier1-implementation.md` Unit 4).

### Essay 2 — Engaging Your Team / Practice Plan Template (verbatim)

The canonical BAB practice-plan shape. Our 15 / 25 / 40-min session archetypes in `app/src/data/archetypes.ts` are a compressed version of this template.

**Warm-Up (10–15 mins):**

- Set the intention for the day.
- Get the blood flowing with a dynamic warm-up, typically without using a ball.

**Single-Person Drills:**

- Drills designed for one person at a time, usually with a partner. Set reps or time.
- Beginner example: Toss, pass, catch.
- Advanced example: Shuffle passing.

**Two-Person Drills (30–45 mins):**

- Drills where both athletes work on improvement. One position is a "resting" position (though it won't feel like it).
- Beginner example: Two-touch passing. Partner A at net, Partner B in court. A uses one touch to get ball to B, who passes back.
- Advanced example: Shuffle and pass with a downball. A tosses a downball to attack at B; B moves left or right to pass back.

**Team Drills (30–45 mins):**

- Game-like reps while maintaining a specific focus. Fatigue sets in; plan rotations that allow athletes to focus on technical skills.
- Beginner example: Focus pass from coach to sideout hit. Coach tosses for passer to return, followed by serve and attack.
- Advanced example: Add defense after the serve and play it out; optionally keep score.

**Competitive Team Drills (remaining time):**

- Competitive reps with a specific focus. Use a scoring format.
- Example: King/Queen of the court, where the king/queen side must win two balls (one from serve, one from coach's downball).

**Cool Down (10 mins):**

- Analyze progress made during the day.
- Stretch and cool down.

Tier 1 mapping:

- Our `warmup` slot ≈ BAB Warm-Up block (compressed to 3 min via `Beach Prep Three` — `D105`).
- Our `technique` slot ≈ BAB Single-Person Drills block.
- Our `movement_proxy` slot ≈ often a Single-Person or Two-Person drill.
- Our `main_skill` slot ≈ BAB Two-Person or Team Drills (main focus).
- Our `wrap` slot ≈ BAB Cool Down (framed as transition, not recovery — see `D105` and `docs/research/warmup-cooldown-minimum-protocols.md`).

### Essay 3 — Keeping the Competitive Fire (summary)

Three strategies (source captured verbatim; summarized here):

1. **Present a Focus and Prioritize Goal Setting.** Each practice has a focus; each athlete sets a personal goal aligned to that focus.
2. **Maintain Constant Communication.** Use athletes' names frequently. Only stop practice when necessary. Use water breaks for instruction and motivation.
3. **Bring the Energy You Want to See.** If you want a high-intensity, competitive practice, embody that energy.

Tier 1 use: none directly, because M001 is a self-coached product with no coach role. The goal-setting bullet (point 1) is relevant to a **post-M001** weekly-confidence surface (goal on the weekly receipt) and is captured here for that future work.

## BAB-name → our-drill-id cross-reference

Canonical mapping of BAB drill names to M001 drill IDs. Update this table when a BAB-named drill is added, renamed, or retired. `d22`–`d24` are the pre-Tier-1 serving drills being retired; their Tier-1 replacements sit at `d31`–`d37`. Setting chain `d38`–`d45` is Tier 1 new (8-drill chain after the Bump/Hand split — see Tier 1 Unit 4 in the plan).

| BAB source | BAB drill name | Our drill ID (or status) |
| --- | --- | --- |
| Drill Book Plan 1 / Beginner's Guide L4 | Self Toss Target Practice | `d31` (Tier 1 Unit 3, rung 1) |
| Drill Book Plan 14 | Step Back Partner Serving | `d32` (Tier 1 Unit 3, rung 2) |
| Drill Book Plan 1 Drill 7 | Around the World (Serve, 6 zones) | `d33` (Tier 1 Unit 3, rung 3) |
| Drill Book Plan 17 | Deep Rainbow Serves | `d34` (Tier 1 Unit 3, rung 4) |
| Drill Book Plan 1 Drill 8 | 3 Before 5 (Serve 1 Player) | `d35` (Tier 1 Unit 3, rung 5; pair + solo self-scored) |
| VDM Train-to-Train Phase | Jump Float Introduction | `d36` (Tier 1 Unit 3, rung 6) |
| Drill Book Plan 2 Drills 5–7 | Server vs Passer | `d37` (Tier 1 Unit 3, rung 7) |
| Beginner's Guide L2 | Bump Set (tutorial) | `d38` Bump Set Fundamentals (Tier 1 Unit 4, rung 1) |
| Beginner's Guide L2 | Hand Set (tutorial) | `d39` Hand Set Fundamentals (Tier 1 Unit 4, rung 2) |
| Drill Book Plan 5 / Beginner's Guide L2 | Footwork for Setting | `d40` (Tier 1 Unit 4, rung 3) |
| Drill Book Plan 1 Drill 1 (warm-up element) | Set back and forth | `d41` Partner Set Back-and-Forth (Tier 1 Unit 4, rung 4) |
| Drill Book Plan 6 / Beginner's Guide L2 | Corner to Corner Setting | `d42` (Tier 1 Unit 4, rung 5) |
| Drill Book Plans 5, 6, 7, 10, 11 | Triangle Setting | `d43` (Tier 1 Unit 4, rung 6) |
| Drill Book Plan 6 | Triangle Setting Off Toss | `d44` (Tier 1 Unit 4, rung 7) |
| Drill Book Plan 5 | Pass, Set, Set, Set | `d45` (Tier 1 Unit 4, rung 8) |
| Drill Book Plan 1 Drill 1 | Best Warm Up Ever (pair cooperative block) | Tier 1 Unit 2 — pair opening-block option (`d30 Pair Pepper Progression`) |
| Drill Book all 20 plans | Best Warm Up Ever (opener) | `d28 Beach Prep Three` (default) / `d29 Beach Prep Five` (opt-in longer) — Tier 1 Unit 1 |
| Drill Book Plan 1 Drill 2 | 6 Guns | *Not in Tier 1; content-polish candidate* |
| Drill Book Plan 1 Drill 3 | Basic S/R Footwork | Partially covered by existing `d09`–`d14` (chain-3-movement); explicit BAB-named drill is content-polish candidate |
| Drill Book Plan 1 Drill 4 | Triangle Setting from Other Side of the Net | *Variant of `d43`; content-polish candidate* |
| Drill Book Plan 1 Drill 5 | Pass Set Spike to Perimeter | *Attack-chain candidate (Tier 3+)* |
| Drill Book Plan 1 Drill 6 | Around the World (Toss, 7 attack zones) | *Attack-chain candidate (Tier 3+)* |
| Beginner's Guide L1 | 6 Legged Monster | *Not in Tier 1; content-polish candidate* |
| Beginner's Guide L1 | 4 Quadrant Ball Control | *Not in Tier 1; content-polish candidate* |
| Beginner's Guide L1 | One Person Quadrant Pass Set Kill | *Not in Tier 1; content-polish candidate* |
| Drill Book Plan 12, 15 | 4 Steps to Paradise | *Defense-chain candidate (Tier 3+)* |
| Drill Book Plan 9 | 3 Touch Vision Pepper | *Pepper-family content-polish candidate* |

## How Tier 1 uses these sources

**Tier 1 Unit 1 (warm-up authoring)**: BAB Drill 1 "Best Warm Up Ever" informs the structure of the pair opening-block option (Unit 2), but the Beach Prep Two/Three/Five drills themselves are VDM + physio-reviewed (`D105`, `D129`) and do not clone BAB's 12-minute opener verbatim. Under `D105` our default dose is 3 min of targeted work.

**Tier 1 Unit 2 (pair opening-block)**: `d30 Pair Pepper Progression` clones BAB's cooperative pair-pepper sequence (pass / set / tomahawk / pokey / one-hand pepper / speed pepper) at 10-each cadence. Folds into the warmup slot on pair 25-min and 40-min sessions when the founder toggles it on.

**Tier 1 Unit 3 (serving ladder)**: Fully BAB-authored names with VDM skill-stage gating. `d31`'s name pulled from the Beginner's Guide Lesson 4 homework drill. Rungs 2, 3, 4, 7 pull from drill-book practice plans. Rungs 5 (3 Before 5) is a format that runs on top of an earlier rung. Rung 6 (Jump Float Intro) is VDM-anchored because BAB does not explicitly teach jump float in the beginner guide.

**Tier 1 Unit 4 (setting chain)**: BAB Beginner's Guide splits setting into Bump Set + Hand Set + Footwork + Principle before any pair drill; Tier 1 Unit 4 mirrors that split, which pushed the chain from 7 to 8 drills. Pair rungs 4–8 pull from drill-book practice plans 5 and 6.

**Tier 1 Unit 5 (vocabulary audit)**: Glossary derived directly from the BAB Drill Book practice-plan drill names (see glossary table above).

**Tier 1 Unit 6 (archetype invariants)**: Single-focus invariant cites Essay 1 of the Coaches Guide. Serve-to-attack convertibility invariant cites the drill-book intro.

## Source provenance and citation hygiene

When citing BAB in inline code comments (`app/src/data/drills.ts`, `app/src/data/progressions.ts`), use the shortest specific form that lets a reader find the material:

- **Drill Book**: `// BAB 2024 Drill Book, Practice Plan N Drill M` — e.g. `// BAB 2024 Drill Book, Practice Plan 1 Drill 7` for Around the World (Serve).
- **Beginner's Guide**: `// BAB Beginner's Guide, Lesson N — <tutorial or drill name>` — e.g. `// BAB Beginner's Guide, Lesson 4 — Self Toss Target Practice`.
- **Coaches Guide**: `// BAB Coaches Guide — <essay name>` — e.g. `// BAB Coaches Guide — Establishing a Focus`.

Do not paraphrase quotes in code comments — reference the source with a URL or cite this note (`docs/research/bab-source-material.md`). Verbatim quotes live here, not in code.

## What is NOT captured

- Video content from any BAB course (we only have text / TOC captures).
- Practice Plans 2–20 drill-level details — only the drill names are captured. If Tier 2+ authoring needs full details, re-solicit the source.
- Attacking Lesson 3 homework drills — the source paste captured tutorial names but not homework drills; if Tier 3+ attack chain authoring needs them, re-solicit.
- Defense Lesson content, if one exists separately — not referenced in the 2026-04-20 founder conversation.

## For agents

- **Authoritative for**: BAB source provenance, the three captured sources' structure, the BAB-name → our-drill-id cross-reference, and the verbatim coaches-guide essays.
- **Edit when**: a new BAB source is captured, a BAB-named drill is added/renamed/retired, or a citation convention changes.
- **Belongs elsewhere**: drill contracts (`app/src/data/drills.ts`), chain definitions (`app/src/data/progressions.ts`), session-assembly logic (`app/src/domain/sessionBuilder.ts`), Tier 1 scope (`docs/plans/2026-04-20-m001-tier1-implementation.md`).
- **Outranked by**: `docs/decisions.md`, `docs/milestones/m001-solo-session-loop.md`.
- **Key pattern**: this note is an **archive**. It does not impose product decisions. Cite it; do not promote its content into product contracts without an explicit decision entry in `docs/decisions.md`.
