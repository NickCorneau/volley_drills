---
id: beach-training-resources
title: Beach Volleyball Training Resources
status: active
stage: planning
type: research
authority: broad beach training, wedge choice, drill content, metrics, injury prevention, and competitor context
summary: "Curated research: competitive landscape, periodization, injury prevention, UX, metrics, and drill examples."
last_updated: 2026-04-12
depends_on:
  - docs/vision.md
  - docs/decisions.md
related:
  - docs/research/README.md
  - docs/research/outdoor-courtside-ui-brief.md
  - docs/research/local-first-pwa-constraints.md
  - docs/research/courtside-timer-patterns.md
---

# Beach Volleyball Training Resources

Safety/load research added: 2026-04-12 from `research-output/beach-volleyball-safety-guardrails.md`

Platform-specific local-first and iPhone/PWA findings live in `docs/research/local-first-pwa-constraints.md`.

For a narrower, more machine-scannable courtside UI summary, use `docs/research/outdoor-courtside-ui-brief.md`.

## Use This Note When

- you need broad product or training context rather than a narrow implementation note
- you need wedge-choice, skill-track, metrics, competitor, or drill-source context
- you need the larger rationale behind beach-specific product decisions

## Not The Right Note When

- you need iPhone / PWA storage, update, or capability constraints:
  - use `docs/research/local-first-pwa-constraints.md`
- you need narrowed outdoor UI defaults for theme, touch targets, and information density:
  - use `docs/research/outdoor-courtside-ui-brief.md`
- you need timer-state or interruption-recovery patterns:
  - use `docs/research/courtside-timer-patterns.md`

## Pre-build validation findings (2026-04-12)

This section captures findings from a targeted evidence review on what is still missing before committing to build M001. Raw source: `research-output/m001-pre-build-validation-research.md`.

### Risk reframing

The primary risk for M001 is not content scarcity or session assembly — drill content is abundant and well-structured (FIVB drill book, community resources, competitor libraries). The hard unknowns are behavioral and contextual: whether the target user will reliably complete a phone-mediated loop courtside, under real beach conditions, and then return next week. This is a value + usability + retention problem.

### Solo feasibility gap

"Solo-first, pass-first" is plausible but fragile. Community discussions and drill-book constraints show that solo serve-receive practice frequently depends on a wall or rebounder, which many beaches lack. This makes "available environment and equipment" a first-class context input, not an edge case. The operational definition of "solo" — on sand with only a ball vs. at-home with a wall vs. near a rebounder/net — must be resolved before M001 sessions can be validated as realistic.

### Entrenched substitute behavior

Free drill libraries, PDFs, videos, and existing training apps are abundant. Competitors already advertise "no coach needed," solo/partner options, offline use, and audio guidance. This means M001's differentiation must be zero-friction courtside execution + believable next-session adaptation, not "more drills" or "better content." Content volume alone is not a moat.

### Phone courtside as a testable assumption

Some players intentionally avoid phone use outdoors or during training. Glare, sand, social context, and a preference for being tech-free are real obstacles. Whether users will actually pull out their phone courtside and follow a structured runner (vs. memory, printouts, or partner-led flow) is itself a core product assumption that needs field validation, not just UX polish.

### Attrition and evidence bar

Digital self-help products predictably suffer high discontinuation even when users initially intend to use them. The "law of attrition" (Eysenbach, JMIR) makes a strong case that "interest" signals — waitlists, stated repeat intent, compliments — are too weak to justify committing to a build. The evidence bar for green-lighting M001 should be actual second-session retention (a second session within ~7–10 days), not stated enthusiasm.

### Offline-first as testable requirement

Offline-first is a decided product principle (D27), but the research argues it should also be treated as a testable requirement: validate that your first users actually experience connectivity issues often enough at their training locations to justify the architecture complexity in M001. The principle is right; the implementation investment should be proportional to validated need.

### Safety review need

While acute injury rates in beach volleyball can be relatively low, overuse injuries (knee, low back, shoulder) are common. Prevention guidance includes load reduction and technique correction. Before scaling beyond a handful of testers, the initial passing sessions and deload logic need at least one coach or sports physio review to ensure safe volumes and progressions.

### Comparable-product patterns

A solo-developer fitness app case study found: users find video substitutes repetitive; large-font + audio cues matter because training happens away from a screen; raw customization forms confuse users and need abstraction into pre-made workouts and simpler setup flows. These findings directly parallel M001's "minimal context capture + quick edit" goals.

### Recommended pre-build validation approach

Build only a thin prototype (Wizard-of-Oz / concierge) in parallel with validation. Do not start full M001 development until the prototype produces repeat-use evidence (second session within ~7–10 days) in courtside conditions. See `docs/discovery/phase-0-wedge-validation.md` for the concrete validation program.

## Design principles from research

- Treat the product as a personal training workflow, not a content library or coach dashboard.
- Core value loop: set goal -> generate session -> run -> review -> adapt.
- First-session value should arrive fast: aim for under 3 minutes to a useful action, not a long setup flow.
- Progressive profiling beats front-loaded intake: ask only what materially changes the first session, then defer the rest.
- First-class constraints: partner availability, court access, balls, time, weather, at-home fallback.
- Beach-specific skill framing for v1: serve, pass/first contact, set/side-out foundation, movement/conditioning support.
- Measurement must be lightweight: session-RPE, binary-first skill scoring where possible, one skill-specific test, short notes.
- Load-safety hooks from day one: soreness flags, small weekly load changes, difficulty before volume.
- AI must not be used for session generation or load planning. If used, it is limited to optional, copy-only explanation of deterministic rules.
- Deeper coaching taxonomies (K0/K1/K2) are internal tools, not v1-facing UX.

## Focused wedge-choice synthesis (2026-04-11)

This section captures the narrower deep-research pass on the biggest unresolved MVP questions.

- **Lead wedge:** solo-first self-coached amateur use is the strongest activation path right now.
  - Why: it removes partner coordination and scheduling as a prerequisite, while still allowing pair variants later.
- **First skill track:** pass / serve-receive first.
  - Why: it is foundational to side-out quality, can be trained solo or with a casual tosser, and is easy to self-score.
- **Solo-first serve-receive is structurally harder than assumed.** The FIVB Beach Volleyball Drill-book lists passing/serve-receive drills where the minimum participant count is "1 athlete + coach assisting/participating," not truly solo. Major drill resources repeatedly describe passing work as inherently requiring at least a server/feeder or partner. This does not kill the wedge, but it means "solo-first" must be framed honestly as "passing fundamentals for serve receive" (self-toss, wall work, movement patterns) rather than full serve-receive simulation. If the product cannot deliver a believable solo loop, the alternatives are: (a) a more honest "solo + wall/partner when available" framing, or (b) shifting the initial skill focus toward something structurally solo like serving or footwork/movement.
- **Best early metrics:** keep the first loop extremely lightweight and separate first-run activation from later progression:
  - time-to-first-useful session
  - first-session completion
  - simple reps / attempts or target-completed signals for the starter session
  - session-RPE (`0-10`, CR10 style)
  - when pass scoring is introduced, prefer binary `Good` / `Not Good` counts plus `attemptCount`
- **Best first adaptation logic:** transparent rules before AI-heavy adaptation.
  - Progress only after repeated confirmation, enough scored attempts, and moderate RPE.
  - Hold when data is missing, noisy, or borderline.
  - Regress or deload when quality drops, effort spikes, or the session ends early for fatigue or pain.
- **Implication for MVP:** the first thin slice should look more like a trusted solo training tool than a full multi-skill coach replacement.

## Deterministic session assembly synthesis (2026-04-11)

This section captures the newer research pass focused on how M001 should assemble believable sessions without pretending to do "AI coaching."

- **Recommended assembly model:** use a deterministic hybrid planner.
  - First choose a small `SessionArchetype` from hard constraints.
  - Then fill each block from ranked drill candidates using feasibility, skill fit, repeat spacing, environment fit, and progression state.
- **Honest solo framing matters:** solo sessions should be framed as `passing fundamentals for serve receive`, not as full serve-receive simulation.
  - The missing piece is pre-contact reading of the server and ball flight.
  - Pair + net sessions are the highest-trust environment for true serve-receive transfer.
  - The FIVB drill-book confirms this: even "beginner" passing drills commonly specify non-solo minimum participants ("athlete + coach").
- **Treat the seed library as drill families, not 20-25 isolated drills.**
  - Variety should come from parameterized variants, archetype rotation, and swap-compatible alternatives.
  - Repetition is acceptable when progression is obvious and explainable.
- **Warm-up and context capture should include wind/conditions, not just skill level.**
  - Beach training materials explicitly emphasize warming up to "get a feel for current conditions" and for beginners specifically emphasize anticipating ball movement in wind.
  - Wind/conditions should be captured as minimal training context (one tap, not freeform), because it materially changes which drills are appropriate and how warm-up should work.
  - This supports including `conditions` (calm / light wind / strong wind) alongside `player mode` and `skill level` as quick-capture fields during session creation, rather than deferring it to "broader context."
- **Use blended practice, not randomization theater.**
  - Early blocks should bias toward blocked quality reps.
  - Later blocks can add constrained variability, pressure, or realism.
  - The sports-transfer evidence is too mixed to justify full random practice as a default.
  - A 2024 meta-analysis (Frontiers) found contextual interference / random practice can improve transfer/retention in motor learning (medium effect overall), but a 2023 sports-focused meta-analysis (ScienceDirect) reported no clear contextual interference advantage in applied sports settings. Build a simple knob or progression (blocked -> variable) rather than hard-coding ideology.
- **Use `progress / hold / deload` as a simple microcycle governor.**
  - `progress` should increase one dimension at a time: difficulty or volume, not both.
  - `hold` should preserve the main challenge but rotate a minor parameter when possible.
  - `deload` should reduce volume and remove higher-load serve/jump exposure first when present.
- **Main unresolved validation questions:** trust in the solo framing, minimal context-capture friction, repetition tolerance, and whether users understand the adaptation labels.

Research signals behind this synthesis:

- USA Volleyball guidance on serve reception emphasizes pre-contact reading and warns that wall or pair passing alone does not fully train it.
- The FIVB beach drill-book supports a drill model built around objective, equipment, participants, teaching points, and variations. It also reveals that many "beginner" passing drills specify minimum participants as "1 athlete + coach," which challenges the truly-solo assumption.
- StrongLifts, Couch to 5K, Fitbod, and Freeletics all support the broader pattern of small libraries plus deterministic structure, progression, and explainability.
- Contextual interference meta-analyses conflict: Frontiers 2024 (motor learning, general) shows medium benefit for random/variable practice; ScienceDirect 2023 (sports-specific) shows no clear advantage. This justifies offering progression (blocked -> variable) rather than ideological randomization.
- Session-RPE validity: Foster 2001 (JSCR) is the foundational study establishing sRPE as a valid, simple load monitoring method. Haddad et al. 2017 (PMC) consolidates ecological validity evidence across exercise modes. Both support using sRPE as the primary low-friction load signal in under-60-second reviews.
- Volleyball-specific RPE reviews and beach volleyball validation studies strengthen the same conclusion: sRPE is practical in volleyball and beach contexts when wording and timing are consistent.
- Self-evaluation research warns that lower-skill performers often overestimate performance, which is why binary pass scoring with conservative guardrails is safer than trusting a self-scored `0-3` average.

## Local-first canonical data and state contracts synthesis (2026-04-11)

This pass adds the minimum contracts needed for a believable local-first M001.

### What the research says

- The local database should be the canonical source of truth. Any future cloud or sync layer should behave like a supporting peer, not an authority.
- IndexedDB is a good validation-phase fit, but browser storage is best-effort by default. A web-first build should request persistent storage where supported and should not overstate durability when that request is unavailable.
- Future-sync-safe stores should use client-generated immutable IDs and avoid auto-increment keys or primary-key rewrites.
- Planned sessions, live execution, and post-session review should be modeled as separate artifacts. This preserves trust, simplifies resume-after-interruption, and keeps "planned vs completed" legible.
- Resumable session flow needs an explicit execution state machine plus durable local fields for execution status, active block cursor, per-block status, and timing anchors.
- Drill metadata should make participant and equipment feasibility first-class. This matters immediately because many pass / serve-receive drills assume a toss, server, or coach.
- If future sync is likely, deletion should start as tombstone-friendly soft delete and local changes should be representable as an append-only mutation log.

### What we should apply to this repo now

- Keep the current device-primary stance from `docs/vision.md` and `docs/decisions.md`, but make the local database the explicit canonical source of truth in the PRD and M001 specs.
- Treat the session model as `plan + blocks + run state + review`, not one mutable session blob.
- Lock the plan snapshot once a session starts. After that, continuity actions should record divergence in execution state or create a new draft by duplication.
- Request persistent browser storage in the web-first validation build where supported.
- Keep user copy centered on `Saved on device`; only surface sync or backup states if a real cloud peer exists.
- Make `participants`, `equipment`, `objective`, `courtsideSteps`, `teachingPoints`, and structured variants part of the drill contract.
- Reserve a minimal mutation-log or outbox shape for future sync, without making multi-device sync part of M001.

### High-signal source additions for this section

- Android Developers: [Build an offline-first app](https://developer.android.com/topic/architecture/data-layer/offline-first)
- MDN: [Using IndexedDB](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API/Using_IndexedDB)
- MDN: [Storage quotas and eviction criteria](https://developer.mozilla.org/en-US/docs/Web/API/Storage_API/Storage_quotas_and_eviction_criteria)
- web.dev: [Persistent storage](https://web.dev/persistent-storage/)
- Dexie Cloud: [Best Practices](https://dexie.org/cloud/docs/best-practices) and [Consistency](https://dexie.org/cloud/docs/consistency)
- Ink & Switch: [Local-first software](https://www.inkandswitch.com/local-first/)
- TrainingPeaks: [Structured Workout Builder overview](https://help.trainingpeaks.com/hc/en-us/articles/115000325067-Workout-Builder)
- PouchDB: [Deleting documents](https://pouchdb.com/guides/documents.html#deleting-documents) and [Conflicts](https://pouchdb.com/guides/conflicts.html)
- Replicache: [How it works](https://doc.replicache.dev/concepts/how-it-works) and [Remote Mutations](https://doc.replicache.dev/reference/server-push)

## Session assembly model synthesis (2026-04-11)

Source: `research-output/deterministic-session-assembly.md`

### Recommended assembly model: hybrid archetype + ranked fill

The research evaluated three approaches to deterministic session assembly and recommends a **hybrid** model that combines fixed archetype templates with deterministic drill ranking within blocks.

How it works:

1. Capture minimal context (all toggles, no typing): time budget, solo/pair, net yes/no, wall/fence yes/no, ball count, wind level, pain/fatigue flag.
2. Select one of 3-4 **session archetypes** based on context:
  - Solo + wall available
  - Solo + no wall (open sand/court)
  - Pair + net (true serve-receive possible)
  - Deload archetype (shorter, low-intensity, reduced serving volume)
3. For each block in the archetype, pick drills by deterministic scoring:
  - **Hard filters**: feasibility (participants/equipment/net), safety flags (pain), time fit
  - **Soft scoring**: skill tag match, spacing penalty for recent repeats, environment fit (wind), progression fit
4. Parameterize drill variants based on progress/hold/deload:
  - Progress: increase **one** dimension (constraint or volume, not both)
  - Hold: keep main dimension, rotate a minor parameter
  - Deload: reduce volume and simplify constraints; reduce serving volume explicitly
5. Always provide 2-3 swap alternatives per block from the same filtered pool.

Why this beats the alternatives:

- **Fixed whole-session templates** feel stale and break when constraints differ session-to-session (wall today, not tomorrow).
- **Pure block-building** feels random and is hard to explain courtside.
- **Hybrid** gives the user a recognizable session shape while adapting to real constraints, matching how coaching drillbooks structure practice.

Evidence base: StrongLifts A/B repetition + progression model; Couch to 5K fixed templates; Fitbod constraint-driven generator; FIVB drillbook structure; 7 Minute Workout small-library success. Confidence: **High**.

### Solo serve-receive framing tension

Serve-receive success depends heavily on **pre-contact information** (reading the server, tracking ball flight, anticipating trajectory). Solo drills and wall/pair passing exercises train platform mechanics and movement, but they do not train the reading/decision components that dominate actual serve reception.

Implication for M001: the product should frame solo sessions as **"passing fundamentals for serve receive"** (mechanics + movement + angle control) and treat partner-enabled sessions as **"transfer days"** where actual serve-and-read reps happen. This is more honest than calling solo wall passing "serve-receive training."

This is a framing decision, not a pivot. The skill anchor stays pass / serve-receive, but the product should be transparent about what solo practice can and cannot develop.

Evidence base: USA Volleyball coaching guidance on serve reception; FIVB drillbook component taxonomy. Confidence: **High**.

### Drill families with parameterized variants

Research supports modeling drills as **families** with variant parameters rather than flat independent entries. The FIVB drillbook defines drills with objective, equipment, participants, teaching points, and explicit variations/modifications. This maps directly to a data model where:

- A drill family has a stable identity, core instructions, and teaching points.
- Variant parameters (target size, distance, constraint type, rep count, rest ratio, wind adaptation) create progression/regression/lateral variants without inventing new drills.
- Environment-aware teaching points (e.g., wind affecting trajectory) are part of the drill metadata, not bolt-on notes.

This extends the existing 12-field metadata contract with structured variant knobs rather than freeform progression/regression text.

Evidence base: FIVB Beach Volleyball Drill-book structure; coaching-standard drill definitions. Confidence: **Medium-High**.

### Blended practice order within sessions

Motor learning evidence supports **some** variability for transfer, but the applied-sports effect is smaller than lab-settings research suggests. Two meta-analyses (Czyz et al. 2024 on contextual interference; Ammar et al. 2023 on sports practice) found limited or non-significant transfer benefits from randomized practice in real sports settings.

For M001, this argues for **blended** session structure: blocked/constant practice early (quality reps, technique focus) then constrained variability later (game-like, scoring, random serve placement). This matches the recommended archetype block order: warmup -> technique -> movement -> main skill -> pressure -> wrap.

Evidence base: Czyz et al. (2024) Frontiers meta-analysis; Ammar et al. (2023) sports CI meta-analysis. Confidence: **High** for "blended is safer than pure random."

### Spacing and repetition rules

Repetition is necessary for skill development (serve-receive requires thousands of game-like reps) but perceived monotony reduces adherence. The evidence does not provide a clean threshold for "how many repeats before churn," so M001 should treat anti-staleness as a design hypothesis requiring testing.

Working rule: **do not repeat the same drill in the same block slot within the last 2 sessions, unless the user chose Hold and explicitly wants repetition.** This is a conservative default that can be relaxed based on user feedback.

Evidence base: exercise adherence literature (Lakicevic 2020; Dregney et al. 2025; Andre et al. 2024); UF 2000 variety study; general skill-acquisition consensus. Confidence: **Medium** (needs in-product validation).

### Fallback policy when constraints eliminate too many drills

When hard constraints (solo + no wall + no net + windy) collapse the feasible drill set, the assembly logic should degrade gracefully:

1. Drop soft requirements (especially "realism" / "match-like" tags)
2. Allow proxy tags (movement proxy, self-toss variants)
3. Offer one-tap "broaden constraints" options to the user

This means the drill library needs true no-infrastructure drills and proxy variants for each constraint-sensitive drill.

Evidence base: Fitbod algorithm constraint-collision handling; general generator design patterns. Confidence: **Medium-High**.

### Deload must address volleyball-specific load concerns

Volleyball medicine guidance explicitly identifies overuse shoulder injuries as load/volume sensitive and recommends load reduction including limiting spikes and serves. A beach volleyball injury study (Bahr & Reeser 2003) confirms substantial overuse burden from serving/spiking/jumping.

For M001, "deload" should translate to:

- Reduced volume (fewer sets/reps)
- Simplified constraints (easier variants)
- **Explicitly reduced serving and jumping volume** when those actions are present in the session

This is more specific than a generic "easier drill variant" and should be reflected in the adaptation rules.

Evidence base: FIVB injury prevention guidance; Bahr & Reeser (2003). Confidence: **Medium-High**.

### Minimum context capture fields for session assembly

The research specifies the minimum context the planner needs before it can assemble a believable session. These become the hard-filter inputs:

- Solo vs pair (participants)
- Time budget (15 / 25 / 40+ min)
- Court access: net available? wall/fence available?
- Equipment: balls (1 vs many), target markers (cones/towel)
- Pain or fatigue today? (safety guardrail, none/some)
- Wind level (calm / breezy / windy) — optional but affects drill selection and teaching cues

All should be toggle/tap inputs with zero typing. Phone stand is optional and not a hard filter.

### 20-25 drills confirmed sufficient for early usage

The research confirms that a 25-drill library covers the needed surface area for 6-8 weeks at 2-3 sessions/week (~12-24 sessions) **if** drills are treated as families with variants and there are 3-4 archetype templates. The main risk is not library size but constraint collisions: solo + no wall + no net + windy could collapse the feasible set unless the library includes true no-infrastructure drills.

This validates decision D16 with the added caveat that drill families and fallback coverage are prerequisites for the library to work.

### What can safely be deferred (confirmed by assembly research)

- Multi-week periodization logic beyond the 3-state governor
- Coach/team/community features
- Rich analytics and video analysis
- Backend sync/social
- Chat-first UX
- AI-driven assembly (beyond optional wording/explanations)

### Validation questions from assembly research

These require prototyping and real sessions, not more desk research:

- Whether "passing fundamentals for serve receive" is a credible user-facing promise for solo practice
- Whether users can reliably answer context toggles in glare/sweat and feel the session is "for them"
- At what point repetition becomes perceived staleness in this niche
- Whether progress/hold/deload is understood and used as intended by self-coached users
- Coach review of drill correctness, cue words, failure modes, and safe progressions
- Expert guidance on what counts as "high load" in the drill catalog for serving/jumping

## Drill library and content structure synthesis (2026-04-12)

Source: `research-output/drill-library-content-structure.md`

This section captures findings from a focused research pass on the smallest believable seed drill library and how its metadata must be structured for safe swapping, progression, and honest skill-transfer claims.

### Pass-rating 0–3 operationalized with a physical set-window

The existing 0–3 scale is standard in coaching, but newer self-report feasibility research makes it a poor M001 default for self-coached beginner/intermediate users. If the product ever introduces it later, each grade must map to a physical distance from a courtside marker rather than vague "setter options" language.

**Set-window setup (30 seconds per session):** place a marker roughly 2 m off the net and 1 m inside midcourt, adjusted slightly based on which side the player attacks from. Volleyball Canada references side-specific targets (left-side passer targets slightly toward middle, right-side slightly right).

**Grade definitions:**

- **3 (in-system):** ball peaks or lands within ~1 big step of the marker with a controllable trajectory.
- **2 (playable):** settable with 2–3 big steps; offense is possible but rushed.
- **1 (out-of-system):** requires a chase or emergency contact; outside 2–3 steps from marker.
- **0 (error):** ace, shank, overpass, into net, out of bounds — no usable second contact.

**Important:** ratings must stay consistent to the athlete and conditions. Multiple sources warn that rigid definitions break when setter athleticism or conditions change. This is why M001 must capture at least a wind/conditions tag at session start.

Usefulness: keep this as a possible later rubric or coach-reviewed mode, not as the primary M001 pass metric.

Evidence: FIVB moving-triangle concept; Volleyball Canada side-specific passing targets; Coaching Volleyball (John Forman) 0–3 definition and consistency cautions. Confidence: **High**.

### Binary pass scoring is the safer M001 default

The strongest current synthesis is that binary scoring is more believable than multi-bucket self-grading for self-coached users. For M001, define a pass as `Good` when it reaches the target zone or leaves the intended next contact playable. Everything else is `Not Good`.

Why this is the better default:

- it reduces the judgment task from four categories to one decision
- it maps more cleanly to beach and self-coached drills than "setter options" language
- it makes progression logic easier to explain and easier to reject when there are too few scored contacts
- it pairs naturally with conservative guardrails such as two-session confirmation and `missing data = hold`

What still needs validation:

- whether users converge on the same `Good` standard
- how many scored contacts are needed before the signal is stable enough to trust
- whether later `0-3` scoring adds real value or only more noise

### Self-reported metrics feasibility synthesis (2026-04-12)

Decision-quality takeaway:

- `sRPE` is strong enough to use now as the primary internal-load signal for M001.
- self-scored pass quality is usable only with heavy simplification and conservative guardrails.
- missing data is a product-state problem, not something the adaptation rules should guess through.

Guardrails suggested by this synthesis:

- use binary pass scoring, not four-bucket self-grading
- require repeated confirmation before progression
- require enough scored contacts before trusting the pass signal
- default missing or insufficient data to `hold`
- bias incomplete sessions ended for `fatigue` or `pain` toward `deload`
- avoid injury-risk claims or ACWR-style scoring in M001

### Feed-type taxonomy as required metadata

The type of ball delivery fundamentally determines what a drill can claim to train. USA Volleyball explicitly warns that cooperative partner passing and self-bumping do not develop the pre-contact reading that dominates real serve reception. FIVB drills distinguish between self-initiated, toss-fed, and live-served balls.

Feed-type values for M001:

- `self-toss` — player controls the entry; trains platform and direction, not reading.
- `partner-toss` — controlled cooperative feed; adds trajectory variability but not true serve pressure.
- `live-serve` — realistic serve from behind the end line; adds read, speed, and unpredictability.
- `wall-rebound` — ball off a wall; approximate substitute for feed when solo and no partner.
- `coach-serve` — consistent high-quality feed; not available to the M001 target user but needed for some drill definitions.

Feed type must be a required field on each drill variant, not a freeform note. Without it, the product cannot make honest claims about what a session trains and cannot safely swap a live-serve drill for a self-toss drill.

Evidence: USA Volleyball solo training limitations; FIVB drill participant/equipment taxonomy. Confidence: **High**.

### Fatigue cap as drill-level metadata

FIVB's Diamond Passing drill explicitly limits a receiver to 2 sets of 4 serves, warning that technique degrades with fatigue beyond that threshold. Heat-risk guidance (NATA) adds rest-break and hydration expectations for outdoor training.

For M001, each drill variant should carry a recommended dose (sets × reps or time block) and a hard cap that protects technique. The current "duration" field captures time, and "intensity" captures effort band, but neither encodes "stop here even if you feel fine because your technique is degrading."

This field should be a simple max-dose per block (e.g., "2 sets of 4" or "20 reps max") plus an optional rest minimum between sets.

Evidence: FIVB Diamond Passing drill fatigue caution; NATA heat illness guidance. Confidence: **Medium-High**.

### Environmental suitability flags

The current "environment" field (sand / hard court / indoor) is too coarse for safe swapping. A drill that needs a wall cannot be swapped into a session where the player is on open sand. A drill requiring a net cannot be offered when the player said "no net available."

Required flags for M001:

- `needs-net` — drill requires a net to execute meaningfully
- `needs-wall` — drill requires a wall or hard rebound surface
- `needs-lines` — drill uses court lines as landmarks (can substitute cones)
- `needs-cones` — drill uses cone markers
- `wind-friendly` — drill works well or benefits from wind conditions
- `low-screen-time` — drill requires minimal phone interaction (good for glare/sweat)

These flags are hard filters for the session assembly logic and map directly to the context-capture inputs (net available? wall available?).

Evidence: FIVB environment effects on beach training; session assembly constraint-collision research. Confidence: **Medium-High**.

### 70% success as progression gating heuristic

Volleyball Canada's development matrix uses 70% success as the threshold for progressing to the next stage. This provides a concrete, source-backed gating rule that fits a binary-scored pass model better than a self-graded `0-3` average.

For drills using a binary success metric, 70% success across a block is the working threshold for moving to a harder variant. Treat this as a useful starting heuristic, not settled science for M001; it still needs field validation against real self-scored data and minimum-attempt rules.

Evidence: Volleyball Canada Development Matrix. Confidence: **Medium** (needs in-product validation, but well-sourced as a starting default).

### Solo training honesty reinforced

Multiple authoritative coaching sources flag the same limitation from different angles:

- FIVB's beach drill guidance ties good passing to a partner's ability to set, with adjustments driven by wind and serve trajectory — all absent in solo practice.
- USA Volleyball is blunt: non-game-like reps (self-bumping, traditional pepper) can teach habits that don't transfer, and core serve-reception decisions (read, play/let-go, seam) aren't trained without a true serve/receive context.
- Volleyball Canada's development matrix encodes serve-receive as a two-person minimum activity.

This reinforces the existing "passing fundamentals for serve receive" framing from the session assembly synthesis. The product must not imply that solo self-toss drills develop the same skills as facing a live server.

Evidence: FIVB, USA Volleyball, Volleyball Canada. Confidence: **High**.

### Wind as a first-class training variable

FIVB explicitly states that as wind increases, pass trajectory should generally be lower, and in strong wind, hand-setting may be compromised (bump-setting becomes more viable). Volleyball Canada's beach skill matrices encode trajectory expectations ("waterfall" shape) that are wind-conditioned.

For M001 this means:

- Wind level (calm / breezy / windy) should be captured at session start (already in the context-capture spec).
- The set-window position and acceptable pass trajectory should adjust: in wind, a lower, tighter pass is a "3," not a flaw.
- Drill selection should bias toward wind-friendly drills when conditions are breezy or windy.
- Coaching cues should adapt (e.g., "lower trajectory in wind" as a contextual overlay).

Evidence: FIVB beach passing fundamentals; Volleyball Canada beach skill matrices. Confidence: **High**.

### Progression chain as content structure

The research argues that the drill library should not be a flat list. The minimum content hierarchy for M001:

- **Drill** (canonical concept) — purpose, constraints, coaching cues.
- **Variant** (execution-specific) — solo vs pair vs 3-player, with different feed types, success metrics, and fatigue caps.
- **Progression chain** — ordered variants with unlock rules and regression options.
- **Session template** — slots (warm-up → skill block → pressure block → finisher → cool-down) with time budgets.

This aligns with the existing object model (`Drill` → `DrillVariant`) and extends it with explicit progression ordering and session-template slot definitions. The FIVB drillbook implicitly uses this structure: same objective, different constraints, progressive complexity.

Evidence: FIVB, Volleyball Canada, Better at Beach drill structures. Confidence: **Medium-High**.

### Candidate 26-drill seed library

The research produced a complete 26-drill candidate pack organized into 6 progression chains, with full metadata per drill. The prose source is `research-output/drill-library-content-structure.md`. The canonical machine-readable version is `app/src/data/drills.ts` (typed against `app/src/types/drill.ts`), with progression chains in `app/src/data/progressions.ts` and session archetypes in `app/src/data/archetypes.ts`.

**Chain summary:**

| Chain | Focus | Drills | Solo-capable |
|---|---|---|---|
| 1: Platform quality and posture | Stable contact fundamentals | D01–D04 | D01 solo; D02–D04 pair |
| 2: Directional control | Passing to a set-window | D05–D08 | D05, D06 solo; D07, D08 pair+ |
| 3: Movement in sand | Passing while moving | D09–D14 | D11 has solo variant; rest pair |
| 4: Serve-receive variability | Short/deep, pressure, fatigue caps | D15–D18 | None truly solo |
| 5: Session add-ons | Group warm-ups, multi-skill games | D19–D21 | None solo |
| 6: Serving | Enabling skill for serve-receive | D22–D24 | D22, D23, D24 solo |
| Cool-down | Recovery | D25–D26 | All solo |

**M001 minimum (11 drills):** D01, D03, D05, D09, D10, D11, D15 (or D16), D18, D22, D25, D26. Add D08 only if 3-player sessions are common for the target user.

**Full seed pack (26 drills):** author all 26 now for docs-first planning; ship 10–12 in the first prototype and expand based on what users actually complete.

### Default 30–45 minute solo session template

Using the candidate library:

- **Warm-up (6–8 min):** D05 easy (2–3 min) → D01 (3 min) → D25 slow walk if very hot (1–2 min)
- **Main block (18–22 min):** D05 graded (8 min, 20 reps × 2) → D06 accuracy overlay (6 min) → D11 solo variant one-arm control (6–8 min)
- **Serve block (6–10 min):** D22 race to 10 **or** D23 serve-and-dash (depending on space/heat)
- **Cool-down (4–6 min):** D25 → D26

This template fits the session-archetype model: "Solo + no wall (open sand/court)" with passing fundamentals + serving + recovery.

### Validation questions specific to drill library (pre-build)

- Will solo-first users actually place a set-window marker and track pass grades? If not, the measurement strategy needs simplification (streaks only, or "in zone / out of zone").
- Do users accept honest messaging that solo work is "platform + movement" not "true serve receive"?
- Partner fallback frequency: how often does the target user have 1 partner on a given week? This determines how much of the library is actually usable.
- Which drills are "too fiddly" in real sunlight — discovered by shipping a small set and watching completion rates.

### Expert review needed before treating as canonical

- Set-window geometry for different sides/handedness and common amateur beach systems.
- Progression order and rep dosing on sand (especially high-intensity movement + repeated serves).
- Technique cues: confirm no illegal or unsafe first-contact habits (FIVB notes tomahawk technique and strict finger-pass constraints on serve receive).
- Heat and hydration triggers appropriate for typical beach training contexts (NATA provides WBGT-based guidance; translating to a consumer app needs careful wording).

## Key research takeaway

A high-quality program needs both:

- A periodization and progression framework (what to train, when, how aggressively)
- A coach-usable drill and execution layer (teaching cues, progressions, constraints, printable sessions)

## First-session activation and onboarding synthesis (2026-04-11)

- The first-run experience should optimize for immediate value, not profile completeness.
- The default first session should be a short `10-15` minute passing-fundamentals-for-serve-receive starter workout that feels like a real practice, not a setup wizard.
- Mandatory first-run inputs should be limited to:
  - skill level
  - player mode (`solo` or `with partner`)
- Default the first focus to passing fundamentals for serve receive instead of asking users to name a goal before they have seen value.
- Defer broader intake such as planning horizon, detailed goals, anthropometrics, account creation, and permissions until after the user completes or edits the first session.
- Do not require the `0-3` pass-quality scale in M001. When pass scoring appears, default to binary `Good` / `Not Good` against a target-zone or playable-next-contact standard.
- The first-run UI should prefer one clear CTA, large controls, concise drill cues, and strong contrast over explanation-heavy copy.

## Validation priorities from onboarding research

- Test `2-screen` versus `3-screen` first-run flows to confirm the minimum believable setup.
- Validate whether asking `solo` / `with partner` is worth the tap cost versus defaulting to solo and editing later.
- Validate whether users apply the binary `Good` standard consistently enough to trust it, and whether a fuller `0-3` rubric is ever worth adding later.
- Have a coach review the starter drill pack and beginner wording before treating it as production guidance.
- Test the starter-session UI outdoors in bright light to confirm readability, contrast, and button size.

## Recommended content sources

### Planning and progression

- **Volleyball Canada Development Matrix** — stage-based progression, periodization principles, practice planning. Use for: baseline progression logic and focus selection guardrails.

### Practice execution

- **FIVB Beach Volleyball Drill-book** — detailed drill design, teaching points, modifications. Use for: structured drill metadata and coaching cues.

### Printable practical resources

- **USA Volleyball beach drill sheets** — quick implementation, ready-to-run formats. Use for: compact courtside drill card patterns.

### Optional paid resources (for users, not the product)

- Better at Beach: prebuilt practice plans and conditioning bundles
- Art of Coaching Volleyball beach certification: structured coach education path

## Competitive landscape

Source: deep research output (2026-04-11)


| Competitor      | Focus                         | Strength                                      | Gap / opportunity                                                 |
| --------------- | ----------------------------- | --------------------------------------------- | ----------------------------------------------------------------- |
| Better at Beach | Structured drills and content | High-quality coaching cues and drill design   | Static articles/videos, no interactive plans or progress tracking |
| BeachUp         | Community and court logistics | 16,500+ court database, team/match organizing | Zero training or skill development features                       |


Neither competitor offers the core loop this product targets: constraint-aware session generation, courtside run mode, and adaptive progression.

## Periodization model (from research)

- **1 session/week**: combined technical emphasis + mini-game + light conditioning; alternate skill focus weekly.
- **2 sessions/week**: split focus (e.g., Day A serve/receive, Day B set/attack); rotate primary emphasis every 2-3 weeks.
- **3 sessions/week**: two dedicated technical days + one lighter patterning/conditioning/recovery day.
- **Supplemental**: 2 days/week total-body resistance training (bands or bodyweight, at home).
- **Recovery**: lighter day built in at 3x frequency; system prompts rest when RPE or soreness flags are high; difficulty increases before volume.

## Safety and load-management synthesis (2026-04-12)

This section captures curated findings from a targeted desk-research pass on minimum safety guardrails for M001. Raw source: `research-output/beach-volleyball-safety-guardrails.md`.

### Injury pattern summary

Beach volleyball has lower acute time-loss injury rates than many team sports, but overuse injuries — low back pain, knee pain/tendinopathy, and shoulder problems — represent meaningful disability. Ankle sprains are common and previous sprain is a consistent risk factor for reinjury. This means M001's safety posture should primarily manage overuse risk (volume, recovery, pain) rather than only acute trauma.

### Core safety failure modes for M001

The three biggest preventable harm modes are:

1. Users training through pain that signals injury rather than normal soreness
2. Abrupt load spikes from enthusiasm, miscalibration, or return after a gap
3. Heat-related issues in an outdoor beach setting

These are best addressed by structured fast taps that gate the session and shape conservative defaults, not by copy-only disclaimers.

### sRPE-load as the minimum viable load signal

Session-RPE × duration (sRPE-load) is well-validated as an internal training load estimate across many sports. It combines intensity and duration into a single number and shows strong relationships with heart-rate-based load measures. For M001, sRPE-load is the defensible minimum to drive progress/hold/deload without requiring wearables or complex monitoring.

Computing it requires only post-session RPE (already captured) and session duration (already tracked by the timer).

Operational notes from the newer feasibility pass:

- use CR10-style `0-10` wording, asked as `How hard/intense was your session?`
- prefer capture `10-30` minutes after session end so the last hard interval does not dominate the answer
- allow immediate capture as a fallback when delayed compliance would collapse
- treat missing sRPE as a block on progression, not as permission to guess

### Spike avoidance: conservative heuristics, not ACWR

The IOC consensus strongly supports the principle that excessive and rapid load increases are associated with increased injury risk. However, the specific Acute:Chronic Workload Ratio (ACWR) metric is contested — later critiques argue it can be statistically misleading and lacks causal evidence.

M001 should implement spike avoidance via conservative heuristics (limits on week-to-week sRPE-load jumps, automatic deload after hard sessions, conservative defaults for returning users) without shipping ACWR-driven risk claims or "danger zone" messaging.

### Pre-session pain flag vs. deferred soreness questionnaire

The research draws a clear line between a binary safety gate and a full soreness/wellness survey:

- A binary pre-session pain flag — "Any pain that changes how you move?" — is safety-critical. Pain that changes movement is a widely recognized marker distinguishing injury-suggestive pain from normal post-exercise soreness (DOMS). This is a fast tap, not a questionnaire.
- A multi-item soreness or wellness survey remains deferred for M001. Evidence suggests single-item readiness measures are widely used but relationships with load are inconsistent and often trivial-to-moderate. They function more as communication signals than precise predictors.

The pain flag belongs in M001 as a pre-session safety gate. The soreness questionnaire does not.

### Training recency as a spike-avoidance input

One additional pre-session tap — "Trained in last 7 days? (0 / 1 / 2+)" — materially improves the app's ability to be conservative after layoffs. This is not a wellness survey; it is a single context signal that supports the "too much too soon" avoidance consensus. If the app is used every session, this can be auto-derived from session history.

### Mandatory warm-up and cool-down

The "VolleyVeilig" warm-up program was associated with reduced acute and upper-extremity injury rates in youth volleyball. FIVB guidance supports warm-up/cool-down as part of volleyball injury prevention. While the strongest evidence is youth/indoor, the principle translates plausibly to adult recreational beach.

M001 should make warm-up and cool-down blocks mandatory in session structure. Users can shorten but not remove them. Content should include ankle/landing preparation, shoulder activation, and gradual intensity ramp.

### Heat safety for beach context

Exertional heat stroke is a leading cause of sudden death in sport. Beach volleyball training happens in direct sun and heat. M001 should include explicit "stop if" heat symptoms in visible copy without attempting algorithmic medical triage. Symptoms to surface: heavy sweating that suddenly stops, confusion, nausea, rapid pulse, headache, dizziness.

### Ankle history modifier

Prior ankle sprain is a consistent risk factor for reinjury. NATA guidance supports sensorimotor/balance training and prophylactic bracing/taping for return from ankle sprain. A minimal onboarding question about ankle issues in the last 12 months can justify conservative lateral movement volume and an optional "consider brace/tape" recommendation.

### Stop/seek-help triggers

Evidence-backed "stop exercising immediately" symptoms suitable for consumer copy:

- Chest pain or pressure
- Extreme or unusual breathlessness
- Irregular or racing heartbeat
- Dizziness, lightheadedness, or fainting
- Confusion or disorientation
- Heat stroke red flags (confusion, cessation of sweating, hot/dry skin)
- Injury pain that persists, worsens, or changes how you move

These should be accessible offline and visible without requiring navigation into settings.

### Regulatory positioning

The product should be positioned as general training support, not medical advice. It should not diagnose injury, treat conditions, or claim to reduce injury risk through personalized risk scoring. This distinction matters under FDA "General Wellness" guidance and Health Canada SaMD frameworks. Product copy should follow common fitness-industry patterns: "This is training guidance, not medical advice. You are responsible for your choices."

### What still requires expert review

- Exact progression/deload thresholds and sRPE-load change caps for amateur beach sessions
- Drill library safety: movement demands, dive progression, landing mechanics for solo-first workflows
- Final wording of disclaimers and risk-related copy for general-wellness intent
- Volleyball coach review of mandatory warm-up content and length
- Sports medicine / sports PT review of pain definitions and stop/modify rules

### Sources for this section

- Bahr et al. beach volleyball injury study (overuse injury burden)
- IOC consensus statement on load and injury risk
- ACWR critiques (OPUS, JOSPT methodological sensitivity paper)
- FIVB injury prevention guidance
- VolleyVeilig warm-up effectiveness study
- NATA ankle sprain position statement
- NATA exertional heat illnesses statement
- Health Canada heat illness fact sheet
- Session-RPE review (Frontiers) and sRPE validity study
- Single-item wellbeing measures systematic review
- PAR-Q+ form and safety PDF
- APTA ChoosePT soreness vs pain guidance
- CDC intensity guidance (RPE scale mapping)
- FDA General Wellness guidance
- Health Canada SaMD guidance

## Injury prevention protocol (from original research)

- Dynamic warm-up block starts every on-court session.
- Two days/week total-body resistance training (elastic bands, bodyweight) on separate days from skill sessions.
- Conditioning finishers: alactic power elements (med ball throws, 2-3 sets of 4-5 reps), low-moderate tempo runs.
- Rules cap weekly load increases; system prompts rest on high RPE/soreness.
- Upfront disclaimer: "stop if pain beyond normal soreness" with link to professional medical advice.

## Courtside UX findings (from research)

- High-contrast drill cards for bright outdoor/beach glare.
- Touch targets minimum 1cm x 1cm for sandy/sweaty hands.
- Large, bold typography; legible at a quick glance.
- Minimal taps: one "Next" button to advance, swipe for cues, no typing during sessions.

### Outdoor readability synthesis (2026-04-11)

This narrower research pass focused on what should be frozen now for the first courtside prototype versus what should stay flexible until outdoor testing.

#### Defaults strong enough to adopt now

- Use one positive-polarity light theme for M001. Dark mode can wait until real outdoor testing shows a clear need.
- Treat live-session content as glance-critical. Timer digits, block titles, rep counts, and primary controls should use near-black text on white or slightly off-white surfaces and aim above bare-minimum contrast where possible.
- Freeze a conservative type floor:
  - body text never below `16px`
  - `18px` preferred for courtside labels and body copy
  - section headings `20px+`
  - timer or rep digits roughly `56-64px`
- Use the system sans stack for familiarity and performance:
  - `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif`
- Treat `54-60px` targets with `8-16px` spacing as the M001 baseline, even if platform minimums allow slightly smaller controls.
- Split information density by state:
  - active drill: current block label, one cue, oversized timer or rep target, current progress, `Next`, `Pause`
  - transition / rest / review: short summary, next cue, quick inputs
- Keep the palette minimal: white or off-white surfaces, near-black text, one primary accent, green success, yellow or red warning states.
- Plan for non-visual cues such as haptics or audio at block transitions and final countdown moments, but validate them outdoors before treating them as mandatory.

#### Items to validate in prototype testing

- Whether pure white or a slightly warmer off-white is easier to read in direct sun over longer sessions.
- Exact accent shades for primary actions and progress states, as long as contrast stays strong.
- Whether `sessionRpe` and pass-quality inputs feel faster as large tap buttons, segmented choices, or a coarse stepped slider.
- How noticeable countdown beeps or haptics remain in wind, court noise, and sunglasses / hat use conditions.

#### Working implication for M001 planning

- Freeze theme stance, type scale, touch target baseline, and active-state information density now.
- Defer fine visual polish, exact color tuning, and input-control micro-interactions until an outdoor prototype exposes real friction.

## Gamification and adherence (from research)

- **Streaks**: consecutive days/weeks of completed sessions; streak saver perk.
- **Badges**: milestones for drill completion, skill mastery, program completion.
- **Personal bests**: tracked and highlighted in post-session summaries and weekly reviews.
- **Community challenges**: optional time-based challenges (planned for v1.5+, not MVP).

## Metrics framework (from research)

- **Serve accuracy**: self-reported scoring on target zones (e.g., 0-22 point scale using taped targets/towels).
- **Pass quality**: binary `goodPassRate` from `Good` / `Not Good` counts, with `Good` defined by target-zone hit or playable next contact.
- **Consistency**: standard deviation across attempts; lower SD = more consistent.
- **Adherence**: sessions completed / sessions planned per week.
- **RPE**: session-level rate of perceived exertion on a `0-10` CR10-style scale, ideally captured `10-30` minutes after session end.

## Session validation rules

- Total block duration must equal session duration.
- All drills must support selected player count.
- Difficulty and intensity must fit selected level and workload.
- Beach context assumptions must remain valid.
- Session flow must include warm-up, primary focus work, game-like play, and debrief.

## Minimum drill metadata (from research, updated 2026-04-12)

The machine-readable source of truth for the drill contract is `app/src/types/drill.ts`. The types below are defined there as `Drill`, `DrillVariant`, `FeedType`, `EnvironmentFlags`, `FatigueCap`, and `WorkloadEnvelope`.

Every drill variant must carry these fields for reliable generation, validation, and swap:

**Original 12 fields:** name, skill focus, player count, level range, instructions, equipment required, environment (sand/hard court/indoor), duration, intensity rating, success metric, progression variant, regression variant.

**Additional fields from drill-library research:**

- **Feed type** (required): self-toss, partner-toss, live-serve, wall-rebound, coach-serve. Determines realism and what the drill can claim to train. Without this, swapping a live-serve drill for a self-toss drill produces a dishonest session.
- **Fatigue cap** (required): max dose per block (e.g., "2 sets of 4" or "20 reps max") plus optional rest minimum. Protects technique under fatigue. FIVB provides drill-level fatigue warnings that should be encoded here.
- **Environmental suitability flags** (required): needs-net, needs-wall, needs-lines, needs-cones, wind-friendly, low-screen-time. These are hard filters for session assembly. Expands the coarse "environment" field into actionable constraint checks.

## Example drill cards (from deep research)

These are reference examples. The canonical structured version is `app/src/data/drills.ts`. For the full prose source, see `research-output/drill-library-content-structure.md`.

| Drill | Skill | Players | Feed type | Key metric |
|---|---|---|---|---|
| D01 Pass & Slap Hands | Platform consistency | Solo | self-toss | Clean contacts ≥ 20 streak |
| D05 Self-Toss Pass to Set Window | Directional control | Solo | self-toss | ≥ 70% `Good` passes to target |
| D10 6-Legged Monster | Footwork + platform angling | Pair | partner-toss | ≥ 70% `Good` passes to target |
| D11 One-Arm Passing | Emergency control | Pair (solo variant) | partner-toss / self-toss | 8/10 controlled passes each side |
| D16 Diamond Passing | Short/deep/left/right | 2–3 | live-serve / partner-toss | ≥ 3/4 `Good` passes per set |
| D18 Serve & Pass Ladder | Serve pressure + passing | Pair | live-serve | `Good` pass rate meets session target |
| D22 First to 10 Serving | Serving to zones | Solo | self-initiated | Reach 10 points with ≤ X errors |
| D24 Pass into a Corner | Wall fallback | Solo | wall-rebound | ≥ 70% landing in target area |


## Monetization signals (from research)

Captured for future reference; no monetization decisions are locked for v1.

- **Free tier**: onboarding, core plan, limited drill library, manual logging, streaks.
- **Pro subscription**: full drill/program library, adaptive plans, detailed analytics, data export, advanced quests.
- **IAP**: themed 6-8 week plans, seasonal challenge entry, future coach feedback credits.

## Sources

### Pre-build validation research (2026-04-12)

- Eysenbach, G. "The Law of Attrition" (JMIR) — Dropout/non-usage is typical in self-directed digital interventions; "second-session retention" is the right evidence bar.
- Cagan / SVPG "Four Big Risks" — Value, usability, feasibility, viability framework for pre-build validation.
- UK Gov "Services in government" blog — Riskiest-assumption prioritization method for time-boxed discovery.
- Mind the Product, Wizard-of-Oz vs Concierge MVP — Testing front-end vs back-end assumptions with minimal build.
- Pretotype It (PDF) + pretotyping techniques summary — "Simulate core experience cheaply" before committing to build.
- Nielsen Norman Group, "Why you only need to test with 5 users" — Multiple small rounds of field usability tests > one large study.
- NISTIR 8080 (NIST) — Sun glare degrades on-screen keyboard usability; reinforces minimal-typing stance.
- Wobbrock et al., situationally induced impairments — Glare, divided attention, and context compromise mobile interaction.
- Bahr & Reeser (2003) — Acute + overuse injury distribution in professional beach volleyball; supports safety/readiness checks.
- Br J Sports Med / FIVB injury surveillance — Load reduction and prevention guidance; informs "deload" meaning.
- Session-RPE review (PMC) — Simple perceived exertion as ecologically useful load proxy.
- Solo fitness app builder case study (Marc G.) — Large-font + audio > video; customization forms need abstraction into presets.
- Reddit threads on solo serve-receive drills — Wall-dependent workarounds; "hard to do solo" as a recurring pattern.

### Session assembly and motor learning sources (2026-04-11)

- USA Volleyball "You Win with Serve Reception, not Passing" — serve-receive success is dominated by pre-contact reading; wall/pair passing misses key components
- FIVB Beach Volleyball Drill-book — coaching-standard drill data model with equipment, participants, objectives, teaching points, and variations/modifications
- FIVB "Principles of Prevention and Treatment" injury prevention PDF — load reduction including limiting spikes/serves for shoulder overuse
- Bahr & Reeser (2003) beach volleyball injury study — overuse burden from serving/spiking/jumping
- NHS Couch to 5K plan — small session-type libraries with progression succeed
- StrongLifts 5x5 program + progression/deload docs — transparent deterministic progression rules
- Fitbod algorithm documentation — constraint-driven generator with equipment/time handling
- Freeletics session structure + feedback mechanism — simple post-session feedback drives adaptation
- 7 Minute Workout app — very small libraries work with stable structure and variant progression
- Czyz et al. (2024) Frontiers meta-analysis on contextual interference — blended practice safer than pure randomization
- Ammar et al. (2023) sports practice CI meta-analysis — limited CI support in real sports settings
- Cleveland Clinic RPE scale — simple 0-10 perceived exertion as low-friction load signal
- Andre et al. (2024) Sports Medicine – Open — exercise modality variety affects motivation and adherence
- Lakicevic et al. (2020) Frontiers — novelty/intensity variation improves enjoyment/adherence
- Dregney et al. (2025) PLOS One — preliminary evidence that activity variety improves psychological responses
- University of Florida (2000) — variety increases exercise adherence
- Deep research output: `research-output/deterministic-session-assembly.md`

### Drill library and content structure sources (2026-04-12)

- FIVB Beach Volleyball Drill-book — wind-adjusted passing targets, moving-triangle concept, drill-level fatigue cautions (Diamond Passing 2-set-of-4 cap), environment effects
- Volleyball Canada Development Matrix — 70% success progression heuristic, side-specific passing targets, waterfall trajectory expectations
- USA Volleyball — solo training limitations and viable wall/corner alternatives, Butterfly/3 Serve Pass to Attack/500 drill structures
- Better at Beach — continuous passing, 6-legged monster, towel drill, competitive serve-receive scoring drills
- Coaching Volleyball (John Forman) — 0–3 pass-rating system definition, consistency cautions, context dependence
- National Athletic Trainers' Association — heat illness guidance, rest-break expectations for outdoor beach training
- American Heart Association — cool-down duration guidance (5–10 min)
- Cleveland Clinic — modified Borg CR10 RPE scale for user-friendly intensity tagging
- Deep research output: `research-output/drill-library-content-structure.md`

### Original sources (2026-04-11)

- [Volleyball Canada Development Matrix](https://volleyball.ca/uploads/About/LTAD/VDM_May_8_2023_EN.pdf)
- [FIVB Tools and Resources Centre](https://www.fivb.com/inside-fivb/education/tools-and-resources-centre/)
- [FIVB Beach Drill-book PDF](https://www.fivb.com/wp-content/uploads/2024/03/FIVB_Beachvolley_Drill-Book_EN.pdf)
- [USA Volleyball Coaches Tools](https://usavolleyball.org/resources-for-coaches/coaches-tools/)
- [USA Volleyball Lesson Plans](https://usavolleyball.org/resources-for-coaches/lesson-plans/)
- [Better at Beach Free Drill Book](https://www.betteratbeach.com/freebeachvolleyballdrillbook)
- [Better at Beach Practice Plans](https://www.betteratbeach.com/practiceplans)
- [Art of Coaching Beach Certification](https://store-aoc2.setupwp.io/shop/beach-coach-certification/)
- [FIVB Medical Injury Prevention PDF](https://www.fivb.com/wp-content/uploads/2024/03/FIVB_Medical_Injury_Prevention.pdf)
- [Gold Medal Squared Practice Plans](https://www.goldmedalsquared.com/post/volleyball-practice-plans)
- [Hudl Balltime Pricing](https://www.hudl.com/pricing/balltime)
- [ACSM Resistance Training Guidelines (2026)](https://acsm.org/resistance-training-guidelines-update-2026/)
- [6 Beach Volleyball Serve Receive Drills to Pass Like A Pro](https://www.betteratbeach.com/beach-volleyball-drills/serve-receive-passing)
- [Volleyball Tip: Perfecting your Serve Receive Passing in Beach Volleyball](https://www.ussportscamps.com/tips/volleyball/volleyball-tip-perfecting-your-serve-receive-passing-in-beach-volleyball)
- [Perfecting your Sideout in Beach Volleyball: A Complete Guide](https://beachtraining.com/perfecting-your-sideout-in-beach-volleyball-a-complete-guide/)
- [Monitoring Training Load to Understand Fatigue in Athletes](https://pmc.ncbi.nlm.nih.gov/articles/PMC4213373/)
- [How to Monitor Practice Workload Without GPS Technology](https://blog.teambuildr.com/how-to-monitor-practice-workload-without-gps-technology)
- [4 Ways to Monitor an Athlete's Load on a Budget](https://www.scienceforsport.com/4-ways-to-monitor-an-athletes-load-on-a-budget/?srsltid=AfmBOoqvFsbGln0TY1njAX8WQAQdTC5hzmbRxf80NB26up7IomRG9q5H)
- [Come for the tool, stay for the network is wrong](https://techcrunch.com/2016/12/01/come-for-the-tool-stay-for-the-network-reconsidered/)
- Internal onboarding desk-research synthesis (2026-04-11): Stremeline Digital (2025), Linkrunner (2026), Digia App Engagement (2026), PaywallPro / Dev.to Fitbod case study (2025), Zigpoll (2024), Appcues (2026), Better At Beach (2020)
- Deep research output: `research-output/beach-volleyball-self-coached-prd.md`
- Deep research output: `research-output/m001-architecture-research.md`
- [Foster 2001 — Session-RPE method (JSCR)](https://journals.lww.com/nsca-jscr/) — foundational evidence for session-RPE as valid load monitoring
- [Haddad et al. 2017 — Session-RPE review (PMC)](https://pmc.ncbi.nlm.nih.gov/articles/PMC5765901/) — consolidated ecological validity evidence
- [Frontiers 2024 — Contextual interference meta-analysis (motor learning)](https://www.frontiersin.org/) — medium effect for random/variable practice on transfer
- [ScienceDirect 2023 — Contextual interference in sports settings](https://www.sciencedirect.com/) — no clear advantage in applied sport, conflicting with general motor learning findings
- [Apple HIG — Buttons / hit targets](https://developer.apple.com/design/human-interface-guidelines/) — minimum 44x44pt targets
- [Material Design — Target sizes / Android accessibility](https://m3.material.io/) — 48x48dp targets and spacing
- [W3C WCAG — Understanding Target Size](https://www.w3.org/WAI/WCAG22/Understanding/) — accessibility framing for minimum target sizes
- [WebAIM — Contrast guidance](https://webaim.org/resources/contrastchecker/) — practical contrast thresholds tied to WCAG
- Deep research output: `research-output/m001-pre-build-validation-research.md`