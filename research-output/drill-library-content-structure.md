# Smallest Believable Seed Drill Library and Content Structure for a Solo-First Beach Passing Session Product

## Executive summary

A solo-first, pass-first beach volleyball training product can be "believable" **only if it's honest about what solo practice can and cannot train**. Desk research strongly supports that passing/serve-reception is pivotal in beach volleyball and highly sensitive to wind and targeting. But multiple authoritative coaching sources also flag a hard reality: **true serve-reception is not the same as cooperative partner passing or self-passing**; key components (reads, "play/let go," seam decisions, communication) are missing when you remove a real server and game context.

So the smallest credible seed library looks like this:

- A **core of solo-capable drills** that train platform quality, posture, directional control, and sand movement (high repetition, low setup).
- A **small set of pair-required drills** that reintroduce realistic ball flight, variability, and pressure without needing a coach.
- A **few "pressure wrappers"** (simple scoring formats) that keep motivation high and produce a clean "progress / hold / deload" signal.
- A **tight, explicit pass-rating rubric** that works without a coach, but still maps to "settable vs emergency vs error."

For M001, the practical minimum is **~10–12 drills (with variants)** for an end-to-end loop; for a credible "launch drill pack," **20–25 drills** is reasonable if you keep them organized into progression chains and avoid redundant near-duplicates.

## Key findings with confidence levels

**Solo-first pass training is intrinsically limited in "serve-receive realism." (High confidence)**
FIVB's beach drill guidance emphasizes passing as foundational and explicitly ties good passing to a partner's ability to set, with adjustments driven by wind and where the pass is taken ("moving triangle"). USA Volleyball's coaching content is even more blunt: non-game-like reps (e.g., self-bumping, traditional pepper) can teach habits that don't transfer, and core serve-reception decisions aren't trained without a true serve/receive context.

**A "pass quality 0–3" scale is standard, but must be operationalized with zones/criteria to be usable by a self-coached player. (High confidence)**
A 0–3 serve-receive scoring approach is widely used, commonly defined by "setter options," with important cautions about consistency and context dependence. For a solo product, "setter options" must be translated into a **physical set-window** rule (distance/steps from a target), otherwise ratings are too subjective to drive progression.

**Wind and environment aren't edge cases; they change the passing target and acceptable trajectory on the beach. (High confidence)**
FIVB explicitly notes that as wind increases, pass trajectory should generally be lower; in strong wind, hand-setting may be compromised and bump-setting becomes more viable. Volleyball Canada's beach development matrix also encodes passing targets and "waterfall" trajectory expectations, reinforcing that pass "shape" and target are learned and environment-conditioned.

**Fatigue caps and rest/work awareness should be built into drill metadata, not left to user judgment. (Medium–High confidence)**
FIVB's Diamond Passing drill recommends limiting a receiver to "2 sets of 4 serves," warning that technique degrades with fatigue beyond that. Separately, heat-risk guidance (while not volleyball-specific) provides concrete rest-break and hydration expectations in high heat, aligning with the "harsh sun / glare / heat" usage context.

**The minimal metadata needed for safe swapping and progression is smaller than most drill libraries store—but it must be consistent. (Medium confidence)**
Coaching sources emphasize consistency of feedback/scoring more than sophisticated metrics. For M001, you can keep metadata lean, but you cannot omit: player-count constraints, feed type, target definition, rated metric type, and intensity/rest guidance—otherwise "swap" becomes unsafe or meaningless.

**Some drills require curated solo/pair variants; labeling a drill "solo" is not enough. (High confidence)**
USA Volleyball's "training without a net/friends" explicitly differentiates workable solo constraints (wall/corner rebound, serve-to-wall) and warns about solo habits. This implies the product needs **separate authored variants** (not just "solo=true") for at least: serve-receive drills, scoring games, and multi-contact sequences.

## What this means for the product's next-step decisions

The product decisions you need before building M001 are mostly **content-structure decisions**, not "AI decisions."

### The smallest content structure that still supports swapping and progression

A drill library for this product should not be a flat list. It should be:

- **Drill (canonical concept)** → has purpose, constraints, and coaching cues.
- **Variant (execution-specific)** → solo vs pair vs 3-player, with different feeding, success metrics, and safety caps.
- **Progression chain** → ordered variants with "unlock" rules and regression options.
- **Session template** → slots (warm-up → skill block → pressure block → finisher → cool-down) with time budgets.

This mirrors what FIVB and other coaching sources implicitly do: same objective, different constraints, progressive complexity, and attention to environmental conditions.

### Metadata that is truly required (M001-grade)

To make "safe swapping + progress/hold/deload" credible, each **variant** needs:

- **Player count**: min, max, and "best at." (Because many passing drills are fundamentally feed-dependent.)
- **Feed type** (this is the big one): self-toss, partner toss, live serve, coach serve, wall rebound. This determines realism and what you can claim it trains.
- **Target definition**: where "good" goes (set-window) and what counts as "in/out of system." FIVB and Volleyball Canada both encode target direction/shape concepts that you can convert into a set-window spec.
- **Success metric type**: pass-grade average, % in zone, streaks, points-to-X, time-on-task. (If metric types are inconsistent, you can't compare sessions.)
- **Duration and fatigue cap**: recommended sets/reps/time and a hard stop that protects technique under fatigue.
- **Intensity band** tied to something simple like RPE 0–10 (0 = rest, 10 = max).
- **Environmental suitability flags**: wind-friendly, sun/glare friendly (minimal screen time), needs net, needs wall, needs lines, needs cones.

Everything else (long descriptions, diagrams, advanced analytics) can be deferred.

### A self-coached pass-rating 0–3 scale that can actually be used courtside

The app needs one canonical rule for pass-grading that fits beach realities:

**Set-Window Setup (30 seconds once per session)**
Place a marker ("SET WINDOW") roughly **forward and slightly toward middle** relative to where you're passing from (FIVB moving triangle concept). If you want a fixed anchor for M001, do this: place the marker **~2 m (6–7 ft) off the net and ~1 m (3 ft) inside midcourt**, then adjust slightly left/right based on which side you tend to attack from (Volleyball Canada explicitly references side-specific passing targets like LS-to-middle and RS-slightly-right).

**Pass Grade Definitions (0–3) for self-rating**
These map the classic "setter options" scale into physical criteria.

- **3 (Perfect / in-system)**: The ball would be **settable immediately** at the set window: lands (or peaks and drops) within **~1 big step** of your marker, with a controllable "waterfall / up-down" trajectory.
- **2 (Playable / limited options)**: Settable with **2–3 big steps** (you can still run offense, but it's rushed or forces a safer set).
- **1 (Out-of-system / emergency)**: Barely playable: requires a chase, awkward body position, or only an emergency bump/free-ball. Treat "outside 2–3 steps from the marker" as out-of-system.
- **0 (Error)**: ace/shank/no second contact; includes overpass into danger, ball into net, or out-of-bounds.

**Important constraint:** keep ratings consistent to the athlete and conditions; multiple sources note that rigid definitions can break when setter athleticism or conditions change. That's why M001 must capture at least a "wind/conditions" tag in step 1.

## Recommended options and recommendation

### Option A: "Prototype-minimum loop" library (10–12 drills, heavily variant-driven)

You build the session loop fast, and validate that users will actually run it courtside. The library is intentionally small, but each drill has solo + pair variants and a single metric style (pass grade % + streaks). This is the best path if the primary unknown is UX adoption and session completion under sun/sweat/sand.

### Option B: "Minimum credible starter library" (20–25 drills, chain-organized)

You ship something that feels like a real coach's starter pack (still beginner–intermediate), with warm-up, skill focus blocks, pressure games, and basic serving/conditioning/cool-down. This is the best path if your primary unknown is content credibility (will players trust this enough to return?).

### Option C: "Big drill bank" (50+ drills)

Not recommended for M001. It amplifies your two biggest risks: inconsistent metadata (bad swaps) and content trust collapse ("why did it give me this?"). Coaching sources repeatedly emphasize that you don't need endless drills—you need clear objectives and feedback.

**Recommendation: Option B for docs-first planning, but implement M001 as Option A + a clear expansion plan to B.**
In practice: author the **20–25 drill pack now** (below), but only build/ship **10–12** into the first prototype. You'll discover quickly which drills are "too fiddly" in real sunlight and which success metrics people actually record.

### Candidate launch drill pack (26 drills) organized as progression chains

Notes:
- Intensity uses RPE 0–10 as a simple internal load signal.
- "Environment suitability" explicitly calls out wind, net, wall, space, and phone interaction constraints. FIVB repeatedly flags environmental effects in beach training; treat this as first-class metadata, not flavor text.
- Progression gating suggestion: **advance when you hit ~70% success** on the success metric (Volleyball Canada uses 70% success as a progression heuristic in its development matrix).

#### Chain one: Platform quality and posture → stable contact

**D01 — Pass & Slap Hands (Self-feedback platform drill)**
Skill focus: Platform consistency; arms apart while moving; clean contact
Player count: 1 (solo)
Level range: Beginner → Intermediate
Courtside instructions: Toss ball up with two hands. Forearm-pass it up/down. Between contacts, separate hands and clap behind your back, then rebuild platform before next contact. Work low/medium/high arcs.
Equipment: 1 ball
Environment suitability: Great on sand; no net needed; wind makes it harder (good)
Duration range: 2–5 min blocks
Intensity: Low–Moderate (RPE 3–5)
Success metric: "Clean contacts" ≥ 20 in a row (restart on obvious mishit)
Progression variant: Add lateral shuffle 1–2 steps between contacts
Regression variant: Reduce height; allow 1 catch-reset every 5 reps
Coaching cues: athletic posture; contact between wrists and elbows; keep space between body and platform; bend knees to keep platform stable.

**D02 — Towel Posture Passing (partner toss)**
Skill focus: Rounded shoulder posture; stable platform angle
Player count: 2 (pair)
Level range: Beginner → Intermediate
Courtside instructions: Receiver places towel across neck/upper back. Partner tosses left/right. Receiver passes to set window without dropping towel.
Equipment: 1 ball, 1 towel, 1 marker for set window
Environment suitability: Works on sand; wind adds variability; minimal phone interaction
Duration range: 3–6 min
Intensity: Low (RPE 3–4)
Success metric: ≥ 70% passes graded 2+ (0–3 scale) over 20 tosses
Progression variant: Tosses become faster/flatter; receiver starts from deeper position
Regression variant: Easier, higher tosses; shorter distance
Coaching cues: ribs tucked / don't over-arch; platform angle is "the crucial part"; shoulders oriented to target.

**D03 — Continuous Passing (kneel → stand progression)**
Skill focus: Pure platform mechanics; straight arms; repeatability
Player count: 2
Level range: Beginner → Intermediate
Courtside instructions: Start kneeling. Partner tosses; receiver passes back 10 reps. Then stand in serve-receive stance and repeat.
Equipment: 1 ball
Environment suitability: Works anywhere; very low setup
Duration range: 4–8 min (two rounds)
Intensity: Low (RPE 3–4)
Success metric: 20/20 passes catchable by tosser (or 70% graded 2+)
Progression variant: Increase toss speed; add 1 step movement every rep
Regression variant: Shorter distance; allow receiver to "freeze" before contact
Coaching cues: arms straight; shoulder shrug assist; pass high enough to be settable; abs tucked.

**D04 — One-on-One "Catch Your Own Pass"**
Skill focus: Passing "smaller/closer" on beach; settable trajectory
Player count: 2 (or 1 with self-feed variant)
Level range: Beginner
Courtside instructions: Feeder serves or tosses across. Passer passes up/down to set window and then catches their own pass (or partner catches).
Equipment: 1–3 balls; marker for set window
Environment suitability: Works on a net court; wind can be integrated (adjust target)
Duration range: 4–7 min
Intensity: Low–Moderate (RPE 4–5)
Success metric: 10 passes with ≥ 7 graded 2+
Progression variant: Transition from toss → controlled serve → live serve
Regression variant: Use underhand toss from closer distance
Coaching cues: move to pass in centerline; target forward and slightly inward; keep pass "lower/closer" than indoor.

#### Chain two: Directional control and angle management → passing to a beach set-window

**D05 — Self-Toss Pass to Set Window (baseline solo accuracy)**
Skill focus: Directional control; "settable" pass shape for beach
Player count: 1
Level range: Beginner → Intermediate
Courtside instructions: Set a marker as your set window. Self-toss slightly in front; pass to land within set-window zone; retrieve quickly and repeat. Use 20 total reps. (Honesty clause: this trains platform + direction more than serve-reading.)
Equipment: 1 ball, 1 marker (cone/hat)
Environment suitability: Works even without net; wind makes target control harder (good)
Duration range: 4–8 min
Intensity: Moderate (RPE 5–6)
Success metric: ≥ 70% passes graded 2+ on your 0–3 rubric
Progression variant: Toss to left/right so you must move behind ball
Regression variant: Larger target zone; allow 1 catch-reset every 3 reps
Coaching cues: get behind ball horizontally; brake-step; platform angle drives direction; transfer weight to front foot.

**D06 — Pass & Slap Hands with Target (accuracy overlay)**
Skill focus: Maintain platform shape while aiming
Player count: 1
Level range: Beginner → Intermediate
Courtside instructions: Run D01 but now score each contact as 0–3 based on proximity/trajectory to your set window.
Equipment: ball, set-window marker
Environment suitability: Excellent in glare/sweat—no partner coordination needed
Duration range: 3–6 min
Intensity: Low–Moderate (RPE 4–5)
Success metric: Average pass grade ≥ 2.0 across 20 contacts (use consistent scoring)
Progression variant: Add shuffle between contacts
Regression variant: Reduce movement; grade only "in zone / out of zone"
Coaching cues: platform set early; keep arms relatively parallel to ground for accuracy; space between body and ball.

**D07 — Pass & Look (serve → pass → quick visual decision)**
Skill focus: Stabilize platform + immediately "look" and decide (proto-game read)
Player count: 2 (best) or 3 (optional)
Level range: Intermediate
Courtside instructions: Server serves. After pass, passer immediately looks at partner/coach who flashes 1–5 and passer calls it before next action (catch/attack optional).
Equipment: 1–3 balls
Environment suitability: Great for short phone interactions; builds a "check after pass" habit
Duration range: 4–7 min
Intensity: Moderate (RPE 5–6)
Success metric: ≥ 70% of passes graded 2+ **and** correct call ≥ 80%
Progression variant: Flash becomes court-zone target (line vs angle) after pass
Regression variant: Use toss instead of serve; reduce decision complexity
Coaching cues: be stable during pass to buy time to look; pass forward to keep vision; don't drift under ball.

**D08 — Plus Three / Minus Three (competitive serve-receive scoring)**
Skill focus: Serve pressure + passing accuracy under stakes
Player count: 3 (server, passer, catcher/target)
Level range: Beginner → Intermediate
Courtside instructions: Passer receives serve; catcher stands near mid-net (or set window) and catches. Score: +1 if catcher moves ≤ 1 big step; +1 for service error; −1 for bad pass; −1 for ace. First to +3.
Equipment: ball(s), optional marker for catcher spot
Environment suitability: Strong beach realism when you have 3; minimal setup
Duration range: 6–10 min
Intensity: Moderate–High (RPE 6–8)
Success metric: Win 2 rounds; or maintain pass grade average ≥ 2.0 across 15 serves
Progression variant: Server must target short/deep/line/seam (called)
Regression variant: Use underhand serves or tosses
Coaching cues: aim pass off net enough to avoid trouble; shoulders to target; move feet to ball early.

#### Chain three: Movement patterns in sand → passing while moving

**D09 — Passing Around the Lines (shuffle pathway drill)**
Skill focus: Sideways movement + controlled passing
Player count: 2
Level range: Beginner
Courtside instructions: Partners pass while shuffling down sideline to service line, across, and back—keeping rally alive.
Equipment: 1 ball
Environment suitability: Best on lined court; can be approximated with cones
Duration range: 3–6 min
Intensity: Moderate (RPE 5–6)
Success metric: Complete 2 full laps without losing control more than 3 times
Progression variant: Only forearm passing (no hand sets)
Regression variant: Walk the pattern; allow catch-reset on mishits
Coaching cues: wide base; don't cross legs while shuffling; communicate especially at corners.

**D10 — The 6-Legged Monster (6-position footwork passing)**
Skill focus: Shuffle mechanics + platform angling left/right + depth variation
Player count: 2
Level range: Beginner → Intermediate
Courtside instructions: Tosser at net (or ~2–3 m away). Toss to 6 locations: left/right × (in front / to side / slightly behind). Receiver passes to set window.
Equipment: ball, set-window marker
Environment suitability: Works anywhere; very low complexity
Duration range: 5–8 min (20–30 reps)
Intensity: Moderate (RPE 5–6)
Success metric: ≥ 70% passes graded 2+ across 24 tosses
Progression variant: Faster/flatter tosses; add "short/deep" calls
Regression variant: Reduce depth extremes; fewer reps
Coaching cues: point shoulders to target; lower inside shoulder and raise outside shoulder for wide balls; ribs tucked.

**D11 — One-Arm Passing Drill (inside-arm / outside-arm control)**
Skill focus: Passing outside midline; emergency control; shoulder tilt
Player count: 2 (or solo with self-toss wide)
Level range: Intermediate
Courtside instructions: Feeder tosses wide to sideline. Pass back using only inside arm; repeat, then opposite arm; then both arms.
Equipment: ball
Environment suitability: Great on sand; trains "bad situation" survivability
Duration range: 4–7 min
Intensity: Moderate (RPE 5–7)
Success metric: 8/10 controlled passes each side (graded 2+)
Progression variant: Wider/faster toss; add 1-step approach after pass
Regression variant: Closer toss; allow two-arm pass sooner
Coaching cues: arm behind ball; move through ball; thumb up on arm closest to ball, down on opposite.

**D12 — U Passing Drill (in → pass up/down → retreat)**
Skill focus: Move in, pass "up/down," retreat for approach readiness
Player count: 2
Level range: Beginner → Intermediate
Courtside instructions: Feeder at net tosses ~3 m up. Passer starts back at cone, moves in, passes straight up/down to target area, retreats around cone, repeats (6–12 contacts).
Equipment: ball, 1 cone
Environment suitability: Works well on a net court; very "beach-like" movement
Duration range: 4–7 min
Intensity: Moderate (RPE 6–7)
Success metric: ≥ 70% of contacts "up/down control" with 2+ pass grade
Progression variant: Tosses vary closer to antenna; add approach on final rep
Regression variant: Fewer reps (fatigue management)
Coaching cues: outside leg forward; arms close to perpendicular to net for quick retreat; keep eyes toward net while moving.

**D13 — W Passing Drill (cone weave with pass control)**
Skill focus: Repeated in/out movement + stable platform under motion
Player count: 2+
Level range: Intermediate
Courtside instructions: Cones form a "W" path. Passer moves in/out between cones; feeder tosses; passer passes "up/down" and retreats, attacking final rep optional.
Equipment: ball, 3 cones
Environment suitability: Great for sand movement; moderate setup
Duration range: 5–8 min
Intensity: Moderate–High (RPE 6–8)
Success metric: Complete 2 rounds with ≥ 70% passes graded 2+
Progression variant: Faster tempo; feeder tosses wider
Regression variant: Reduce cones to 2; lower pace
Coaching cues: outside leg forward at contact; don't lose sight of "opposition" (net); keep platform tight.

**D14 — Pass & Switch (3-person high-rep line)**
Skill focus: High rep passing with lateral/backward movement patterns
Player count: 3 (ideal), 2 (adapted)
Level range: Intermediate
Courtside instructions: One feeder passes to two passers who swap positions after each rep; emphasize avoiding leg crossing sideways; include 12–20 reps each direction.
Equipment: 1 ball
Environment suitability: Excellent when you have 3; minimal setup
Duration range: 5–8 min
Intensity: Moderate (RPE 5–7)
Success metric: 2 sets × 12 reps with ≥ 70% graded 2+
Progression variant: Run across net; add short/deep variation
Regression variant: Reduce reps; slow feed
Coaching cues: play ball in front; wide base helps; backward movement can narrow legs.

#### Chain four: Serve-receive variability → short/deep → pressure → fatigue-aware caps

**D15 — Short/Deep Serve-Receive Reaction Drill**
Skill focus: Early read + forward/back movement patterns
Player count: 2–4 (server + passer + optional target/catcher)
Level range: Intermediate
Courtside instructions: Server/coach delivers short or deep balls. Passer reads early, moves, passes to set window.
Equipment: balls; marker
Environment suitability: Very beach-relevant; requires reliable feeding to be worthwhile
Duration range: 5–8 min
Intensity: Moderate–High (RPE 6–8)
Success metric: ≥ 70% passes graded 2+ on 20 balls
Progression variant: More random (mix all); faster serves
Regression variant: Coach tosses from midcourt if consistent serving isn't possible
Coaching cues: centered ready position enables quick forward/back; read ball early "off server's hand"; hands apart while moving.

**D16 — Diamond Passing (4-point pattern with fatigue cap)**
Skill focus: Footwork + technique for short/deep/left/right with defined sequence
Player count: 2–3 (coach/server + passer + optional catcher)
Level range: Beginner (as designed) → Intermediate (as pressure increases)
Courtside instructions: Feeder serves/tosses balls in order to 4 locations. Passer must adjust target each time; do **2 sets of 4** then rest to protect technique.
Equipment: multiple balls helpful; marker(s)
Environment suitability: Strong; but only works if feed quality is consistent
Duration range: 6–10 min (including rest)
Intensity: High bursts (RPE 7–8)
Success metric: In each set of 4, ≥ 3 passes graded 2+
Progression variant: Randomize locations; tougher serves
Regression variant: Replace serves with tosses; reduce to 1 set of 4
Coaching cues: don't "cheat" by moving early; on short balls, leg closer to sideline forward; get back quickly so you pass while moving forward.

**D17 — Non-Passer Move / Beat Ball to Pole (seam responsibility + movement)**
Skill focus: Pass forward + partner initiates movement toward setting position; avoids collisions
Player count: 2–3
Level range: Beginner
Courtside instructions: Deep serves/tosses; passer passes forward; non-passer must move quickly toward setting position marker (or touch a pole/cone) after recognizing it's not their ball.
Equipment: ball, a cone/pole marker
Environment suitability: Good; requires disciplined feeding (deep to reduce collisions)
Duration range: 4–7 min
Intensity: Moderate (RPE 5–7)
Success metric: No collision/hesitation errors across 12 reps; ≥ 70% pass grade 2+
Progression variant: Serve faster/lower to reduce decision time
Regression variant: Use tosses; exaggerate spacing
Coaching cues: move forward so pass goes forward; anticipate early if in your zone; non-passer initiates movement quickly.

**D18 — Serve & Pass Ladder (pair "pressure wrapper")**
Skill focus: Serve pressure + measurable passing outcomes
Player count: 2
Level range: Beginner → Intermediate
Courtside instructions: Server gives 10 serves. Passer grades each (0–3) using set-window rule. Switch roles. Keep a "best streak of 2+" and "average pass grade."
Equipment: 1–5 balls, set-window marker
Environment suitability: Strong if you can keep rhythm; wind becomes a real variable (capture it)
Duration range: 8–12 min
Intensity: Moderate (RPE 6–7)
Success metric: Pass average ≥ 2.0 **or** 7/10 serves graded 2+
Progression variant: Server targets seams/short/deep; passer starts deeper as FIVB suggests for beach receiving
Regression variant: Underhand serves; smaller dose (6 serves each)
Coaching cues: play/let-go discipline matters; pass forward and slightly inward; keep pass between you and partner.

#### Chain five: Session credibility add-ons (when you have extra people) + multi-skill motivation

**D19 — Butterfly Toss-Pass-Catch (controlled warm-up with progression to live serve)**
Skill focus: Warm-up passing reps; simple rotation; controlled inputs
Player count: 4–14 (but can be run as 2–3 in a stripped form)
Level range: Beginner
Courtside instructions: Tosser throws to passer; passer passes to target; target catches; rotate through spots. After 20 passes, progress to live serve.
Equipment: 1–3 balls
Environment suitability: Great warm-up for groups; low cognitive load
Duration range: 6–10 min
Intensity: Low–Moderate (RPE 4–6)
Success metric: Group completes 20 controlled passes before "live serve" progression
Progression variant: Add live setter/hitter; add live serve
Regression variant: Smaller groups; passer can catch then set their pass (for very low level)
Coaching cues: controlled toss/serve down the line; keep rhythm; don't rush rotation.

**D20 — 3 Serve Pass to Attack (multi-skill emphasis)**
Skill focus: Pass → set → attack continuity; rhythm under repeated entries
Player count: 4+ (or adapted)
Level range: Intermediate
Courtside instructions: Sequence of 3 balls initiated by serve to passer; setters rotate; target catches/feeds next; 3rd ball becomes live to play out.
Equipment: multiple balls helpful
Environment suitability: High realism but requires enough people to be smooth
Duration range: 8–12 min
Intensity: High (RPE 7–9)
Success metric: ≥ 70% of serve receives graded 2+ over 15 serves **and** rally completion on live balls (at least 5)
Progression variant: Tougher serves; reduce catch/stop, more live play
Regression variant: Toss instead of serve; simplify to pass-set-catch
Coaching cues: keep passer rhythm; initiate next ball quickly after catch; target awareness for safety.

**D21 — 500 (beginning ball control scoring game)**
Skill focus: Ball control with self-scoring; reading/anticipation; engagement
Player count: 2+
Level range: Beginner → Intermediate
Courtside instructions: Tosser initiates with skyball/freeball/downball. Team/player earns points: pass-only (25), pass+set (50), pass+set+attack (100). Race to 500.
Equipment: ball(s)
Environment suitability: Works on sand; best with small group to keep engagement
Duration range: 8–15 min (or cap by time)
Intensity: Moderate (RPE 6–7)
Success metric: Reach 500 within cap time **or** increase score vs last session
Progression variant: "Hit to specific target" bonus points (back corners)
Regression variant: Reduce goal to 250; allow catch on second contact
Coaching cues: tabletop passing; defined apex; square hips to target.

#### Chain six: Serving as the enabling skill (because serve receive needs serves)

**D22 — First to 10 Serving Drill (target-value zones)**
Skill focus: Serving consistency + serving to zones
Player count: 1 (solo) or 2+
Level range: Intermediate (but usable earlier with simplified scoring)
Courtside instructions: Assign point values to zones; serve to earn 10 points; serve out loses a point; adjust zone values for your level/objective.
Equipment: many balls ideal; can be done with 1 (slower)
Environment suitability: Strong for beach; explicitly considers wind effects on serve line/accuracy
Duration range: 6–12 min
Intensity: Moderate (RPE 5–7)
Success metric: Reach 10 points with ≤ X errors (choose X based on level)
Progression variant: Jump serve to spots instead of standing serve
Regression variant: Bigger zones; count "in" serves only
Coaching cues: develop serving routine; consistent hand contact; adjust for wind movement.

**D23 — Serve & Dash (serve skill includes transition movement)**
Skill focus: Serve routine + immediate movement to defensive base
Player count: 1 (solo)
Level range: Beginner → Intermediate
Courtside instructions: Serve. Immediately sprint to your chosen defensive base spot while watching the ball flight (not watching then running). Reset and repeat.
Equipment: 1 ball
Environment suitability: Great beach conditioning + realism; minimal setup
Duration range: 4–8 min
Intensity: High (RPE 7–9)
Success metric: 10 serves "in" with consistent dash (no walking)
Progression variant: Alternate starting serve locations along end line
Regression variant: Reduce sprint distance; reduce total reps
Coaching cues: full routine each serve; watch ball while moving; treat as pressure rep.

**D24 — Pass into a Corner (solo wall-based, "no court" fallback)**
Skill focus: Move to ball + pass to a "setter" corner target
Player count: 1
Level range: Beginner → Intermediate
Courtside instructions: Throw ball off wall so it rebounds like a serve. Move and pass so the ball flies settable into a corner "target" (like to a setter). Reset and repeat.
Equipment: ball, wall/corner
Environment suitability: Not beach-court-native; critical fallback when training off-court
Duration range: 5–10 min
Intensity: Moderate (RPE 5–7)
Success metric: 15 reps with ≥ 70% landing in target corner area
Progression variant: Harder rebounds and wider angles
Regression variant: Slower tosses; closer distance
Coaching cues: avoid training non-game-like habits; aim for settable flight; use movement not arm-swinging.

#### Cool-down and recovery

**D25 — Five-minute cool-down walk + breathing reset**
Skill focus: Downshift; reduce physiological load before leaving court
Player count: 1+
Level range: All
Courtside instructions: Slow walk 5 minutes (or easy shuffle if space limited). Then 6 slow breaths focusing on long exhale. (Keep it minimal; this is about compliance.)
Equipment: none
Environment suitability: Works anywhere; minimal phone interaction
Duration range: 3–7 min
Intensity: Very low (RPE 1–2)
Success metric: Completed (yes/no)
Progression variant: Add a second 5-minute block on very hot days
Regression variant: 2-minute walk only
Coaching cues: slow down gradually; don't stop abruptly; breathe steadily.

**D26 — Lower-body stretch micro-sequence (sand legs focus)**
Skill focus: Calves/hamstrings/hips post-sand session
Player count: 1+
Level range: All
Courtside instructions: 6 stretches × 20–30 seconds each (calf straight, calf bent, hamstring, hip flexor, glute, adductor). No bouncing; "strong not painful."
Equipment: none
Environment suitability: Works anywhere
Duration range: 3–6 min
Intensity: Very low
Success metric: Completed (yes/no)
Progression variant: 2 sets each stretch (time permitting)
Regression variant: 3 stretches only (calf/hamstring/hip flexor)
Coaching cues: breathe; avoid pain; hold steady.

## What should be decided now vs deferred

Decide now:

- **Your canonical pass-rating rubric** (0–3 with a physical set-window) and how it adapts for wind. Without this, "progress/hold/deload" becomes hand-wavy and users won't trust it.
- **Your feed-type taxonomy** (self-toss vs partner toss vs live serve vs wall). If you gloss over this, you'll over-promise skill transfer—and USA Volleyball explicitly warns about that trap.
- **Your fatigue and heat safety rules** at the content layer (hard caps, rest prompts). FIVB provides drill-level fatigue warnings; NATA provides rest-break/hydration expectations in heat.
- **A strict minimal metadata schema** that every drill variant must satisfy (player count, feed type, target, metric, intensity, time cap).

Defer (for after M001 learns what people actually do):

- Video analysis, complex analytics, detailed seasonal planning, and coach workflows.
- Large drill-bank expansion beyond the 20–25 seed pack; coaching guidance consistently suggests "better feedback in fewer drills" beats endless drill variety.
- Any AI-based drill generation beyond "choose from curated variants," because trust and explainability are core requirements and are easiest when the content set is bounded.

## What still needs primary validation, prototype testing, or expert review

Primary validation (user interviews + courtside prototype tests):

- **Will solo-first users actually set up a set-window marker and track pass grades?** If not, the measurement strategy needs simplification (e.g., only streaks, only "in/out").
- **How many seconds of phone interaction are viable per drill block in glare and sand?** This must be tested in sunlight with sweaty hands (not in a comfortable lab).
- **Do users accept honest messaging that solo work is "platform + movement" not "true serve receive"?** USA Volleyball's critiques make this a credibility landmine if you imply otherwise.
- **Partner fallback frequency**: how often does the target user have 1 partner on a given week? This determines how much of the library is actually usable.

Expert coach review (before treating as canonical content):

- **Set-window geometry** for different sides/handedness and for common amateur beach systems (Volleyball Canada hints at side-specific targets; the product must operationalize it correctly).
- **Progression order and rep dosing** on sand (especially for high-intensity movement + repeated serves).
- **Technique cues**: confirm no illegal or unsafe first-contact habits for beach (FIVB explicitly notes tomahawk technique and strict finger-pass constraints on serve receive).
- **Heat and hydration triggers** appropriate for typical beach training contexts.

## The minimum credible starter library

For an M001 prototype that must feel real but stay small: D01, D03, D05, D09, D10, D11, D15 (or D16 if you have a feeder), D18, D22, D25, D26. (11 drills total; add D08 only if 3 players is common.)

## A default 30–45 minute solo session structure using the proposed library

Warm-up (6–8 min): D05 (2–3 min easy) → D01 (3 min) → D25 (1–2 min slow walk if very hot).
Main block (18–22 min): D05 (8 min, 20 reps × 2 rounds) → D06 (6 min, graded contacts) → D11 solo-variant (6–8 min, wide self-toss one-arm control).
Serve block (6–10 min): D22 (race to 10 points) **or** D23 (10 serve-and-dash reps) depending on space/heat.
Cool-down (4–6 min): D25 → D26.

## Source list

- FIVB — Beach Volleyball Drill-book (PDF) and passing fundamentals, including wind-adjusted passing targets, movement triangle concept, and drill-level fatigue cautions.
- Volleyball Canada — "Basic Passing" technical model and Beach skill matrices (targets, waterfall trajectory, seam emphasis), plus a development matrix citing a 70% success heuristic for progression decisions.
- USA Volleyball — Practical beach drill PDFs (Butterfly, 3 Serve Pass to Attack, 500) and unusually direct guidance on solo training limitations + viable solo wall/corner alternatives.
- Better at Beach — Concrete, player-friendly beach passing drills (continuous passing, 6-legged monster, passing conditioning, towel drill, and competitive serve-receive scoring) well suited to mobile "courtside instructions."
- Coaching Volleyball (John Forman) — Clear definition of the 0–3 pass-rating system, plus cautions about rating consistency and context dependence (setter variability).
- National Athletic Trainers' Association — Heat illness guidance with concrete rest-break and hydration expectations for beach usage context.
- American Heart Association — Practical cool-down and stretching duration guidance (5–10 minutes cool-down; 10–30 second holds).
- Cleveland Clinic — Simple explanation of the modified Borg CR10 RPE scale, supporting an easy intensity tag that users can self-report.
