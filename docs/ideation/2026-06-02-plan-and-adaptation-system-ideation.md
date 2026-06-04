---
date: 2026-06-02
topic: plan-and-adaptation-system
focus: "plan-and-adaptation system (parked seed eight pillars) re-ideated with BAB-camp field evidence (2026-06-02) folded in as primary signal; founder selected the thin-spine plan shape (survivor #2) as the brainstorm seed, pure-spine scope (north-star focus + event/taper deferred)"
mode: repo-grounded
related:
  - docs/research/2026-06-02-m002-evidence-meta-synthesis.md
  - docs/reviews/2026-06-02-m002-ideation-revalidation.md
---

> **Evidence revalidation (2026-06-02, added after this pass).** Four research syntheses landed the same day and were joined in `docs/research/2026-06-02-m002-evidence-meta-synthesis.md`; the adversarial revalidation of this ideation is in `docs/reviews/2026-06-02-m002-ideation-revalidation.md`. Net: the thin-spine architecture (#2) is **validated and right-sized**, but three scope/framing calls were locked one step before the evidence and are flagged for founder re-ratification — (1) survivor **#5** (offered-adaptation verdict loop + visible carry-forward) is the evidence-named honest carrier of the founder's #1 "see it adapting / 1% better" need and is currently deferred; (2) confidence is a contested skill proxy → reframe to felt-readiness, behavioral-primary; (3) the content cluster (#7 warmup, exploratory #3 cue-ladder) should not be deferred wholesale (the "keep it thin" finding is about the *planner*, not content).

# Ideation: Plan-and-Adaptation System (camp-evidence pass)

> Picks up the parked seed `docs/ideation/2026-05-27-plan-and-adaptation-system-seed.md`. Run on 2026-06-02 with new field evidence from a 3-day "Better at Beach" (BAB) camp folded in as the primary signal. Six ideation frames → ~48 raw candidates → 7 survivors. **Founder selected survivor #2 (thin-spine plan shape), pure-spine scope, as the brainstorm seed** (see Decision below).

## Grounding Context

### Codebase Context
- React + React Router + **Dexie (IndexedDB) v6** PWA (`app/`), deployed Cloudflare Worker. Local-first.
- **`SkillFocus` enum** = `pass | serve | set | movement | conditioning | recovery | warmup` — **no `attack`, no `timing/spacing`**.
- Session-level capture exists: `ExecutionLog`, `SessionReview` (sRPE + per-drill), `sessionSummary` (deterministic 3-case copy, no LLM), per-drill capture (`domain/capture/`), archetypes `solo_wall|solo_net|solo_open|pair_net|pair_open` + `sessionAssembly/*`.
- **No plan / season / tournament / goal / availability objects exist.** `pair_game` deferred (`D144`), 3+ players deferred (`D101`), `attack` content unauthorized (`D143`). Adaptation inputs exist (RPE, captures, sRPE bands) but **no closed multi-week adaptation loop tied to calendar intent**.
- **STRATEGY approach:** aggregate authoritative volleyball sources + the team's own data/goals/plans/schedule → best training plan, **not AI slop** that randomizes day-to-day. Tracks: self-coached weekly loop; curated content engine; plan/progression engine (deterministic, focus inference, progress/hold/deload).
- Constraining conventions: `D137` Setup→Safety pre-run spine (resist new routes); `P7` no AI-generated plans / coach chat; courtside copy contract (≤45 words, observe/reinforce/question, low typing); `D146` pair-first / solo-accommodating; founder posture (no notifications, no gamification "yet", every datum must help improve/plan/prepare, don't overload, calm/intentional, retrospective only with forward purpose).

### Primary new signal — BAB camp field evidence (2026-06-02)
Founder attended a 3-day "Better at Beach" camp and surfaced: (a) **technique-"how" depth gap** — the app names drills but doesn't teach *how* to execute moves ("I never really knew how to set until now"); (b) **attack** focus; (c) **timing/spacing** focus; (d) **3v3** focus + ability to run training with more/fewer people via **rotation** even in a 2s-oriented app; (e) **ball-control warmup** (10s, touches/passes/low pepper) and **aggressive courtside warmups** (jogging, high knees, cossacks, mobility squats, shuffling), both "super useful." Corroborates prior multi-hit attack-content gap and the 3+ player gap that caused observed **displacement-of-use** (founder ran a 3s session outside the app).

### External Context (web research)
- Backward planning from **one A-event** + 2-week taper, executed as **adaptive weekly templates**, beats brittle day-by-day calendars (Friel/cycling, pickleball peak protocols).
- At amateur/low volume, **consistency + autoregulation beat rigid periodization** (Brookbush; Attia 2×/week).
- **Co-authored beats auto-generated** plans — ownership drives adherence; AI-authored goals aren't internalized (arxiv 2026 *Optimized but Unowned*; SDT). Validates the no-AI-slop constraint.
- Adaptation should be **offered, not imposed** ("re-adapt or keep original?" — Runna; TrainerRoad pending-adaptations-you-accept). Pull, not push.
- Teach technique via **external-focus cues** (cue the movement effect, must be deliberately structured) + **well-bridged progression ladders** (big gaps cause dropout — ATG).
- **Roster size is a first-class coaching input** (8-ball, king-of-court, partner-switching — Trinsey/Anderson/JVA).
- Anti-patterns: streaks, calendar-guilt/missed-day surfaces, loss-framing copy, opaque auto-reshuffle, over-ambitious plans.

### Past Learnings (`docs/solutions/`)
markdown-as-API (emit markdown before typed builders); dual-read evidence-artifact pattern; source-backed content-depth activation; drill-first-time-runnability (technique cueing / calm courtside); `D137` focus routing; strategic-shape-fork-as-resolve-before-planning. **Greenfield:** Dexie migration patterns and the plan-and-adaptation system itself.

## Topic Axes
1. Goal & event anchoring (tournaments, multi-week skill horizons, active season)
2. Scheduling & availability (timing, pre-commitments, fitting sessions to real life)
3. Plan authoring & shape (build the plan; what a "plan" object is; calm-not-calendar)
4. Adaptation loop (feedback signals → plan changes; pull-not-push; progress/hold/deload)
5. Content & technique depth (the "how" gap, attack, timing/spacing focus, warmups, variable player count)

## Decision (2026-06-02)

The founder reviewed survivors and selected **#2 (plan-as-thin-spine)** as the step that "takes a clear step forward but doesn't over-commit or over-plan," then pressure-tested mixing it with **#1 (dual anchor)**.

Analysis recorded for the brainstorm: #1 splits into **(a)** a lightweight anchor *primitive* (a pointer at what you're training toward) and **(b)** a backward-planning *engine* (taper, build/peak blocks). The "over-plan" risk lives almost entirely in #1(b), and external research says rigid periodization is mostly ceremony at amateur volume. #1(a) further splits: a **capability/focus target** carries real v1 plan-shaping value (it's what the backlog is ordered *toward*, and matches the founder's stated "skills over a longer horizon" pillar), whereas an **event date** mostly buys the deferred taper and risks countdown-guilt.

**Selected v1 scope: pure thin-spine (#2 only).** The ready-backlog is ordered by staleness / autoregulation; **no north-star focus target, no event date, no taper, no periodization in v1.** Rationale: #2 is shippable and testable without any new "what are you training toward" capture, and founder use will reveal whether a persistent north-star focus is actually missed before it gets built. The anchor (#1a focus-target first, then #1b taper) is the natural follow-on if evidence supports it; the thin spine is forward-compatible with it by design.

## Ranked Ideas

### 1. Dual anchor — one A-event *or* a named capability
**Description:** One first-class `Anchor` object accepting either a dated A-event or a named capability target. Dated → backward plan (build → 2-week taper) as adaptive weekly templates; eventless → capability-completion arc. Weeks-remaining, focus weighting, and taper all derive from this one datum.
**Axis:** 1 — Goal & event anchoring
**Basis:** `external:` backward-planning from one A-event + taper beats day-by-day; co-authored capability framing drives ownership. `direct:` no goal/tournament object exists; the camp "never knew how to set" is a capability unlock, not a date.
**Rationale:** The seed hinges on intent, yet zero schema supports it; accepting both anchor types makes the eventless majority first-class.
**Downsides:** Two anchor modes risk feeling like two products; "capability met?" needs a non-gamified definition of done. The taper engine (#1b) is the over-plan risk.
**Confidence:** 85% · **Complexity:** Medium · **Status:** Unexplored (decomposed in Decision above; #1a is the natural follow-on to #2)

### 2. Plan-as-thin-spine (policy + cadence, not a calendar)
**Description:** "The plan" is a small set of durable intentions + a steady weekly cadence with a ready backlog of focuses — only the **next** session is ever concrete; everything beyond stays intent until it's next. Emitted as markdown first (typed objects derived later), so Home, run-view, review, and export are all formatters over one emission. (v1 scope per Decision: backlog ordered by staleness/autoregulation; no anchor yet.)
**Axis:** 3 — Plan authoring & shape
**Basis:** `external:` adaptive weekly templates beat brittle day-by-day; over-ambitious calendars + calendar-guilt are named anti-patterns. `direct:` past learning "markdown-as-API"; `D137` calm/no-new-route bias; founder "don't overload / calm-not-calendar."
**Rationale:** Holds the "useful plan surface ≠ calendar planner" line; sidesteps calendar-guilt with no notifications/streaks; cheapest viable first slice and forward-compatible with the anchor.
**Downsides:** Without an anchor it leans on existing focus-inference and risks reading as "M001 + a cadence" — accepted in v1 as the deliberate minimal step; a pair wanting to see weeks ahead may find it thin.
**Confidence:** 80% · **Complexity:** Medium · **Status:** Explored — selected as the brainstorm seed (pure-spine scope) on 2026-06-02

### 3. Cue-ladder technique-"how" depth layer
**Description:** A typed `CueLadder` primitive (ordered rungs: external-focus cue + bridged progression step + demonstrable criterion) that drills/focuses reference rather than embed. Powers a drill's coaching prompt, a courtside "what to feel for" line, and mastery-gated progression (advance on demonstrated execution, not time or points).
**Axis:** 5 — Content & technique depth
**Basis:** `direct:` the loudest camp signal — "names drills but doesn't teach *how*." `external:` external-focus cueing improves motor learning (must be structured); bridged ladders prevent dropout (ATG); ABRSM/mastery analog. `direct:` past learning "source-backed content-depth activation" (non-slop, honors `P7`).
**Rationale:** Closes the #1 field gap with a reusable unit; depth scales by linking, not re-authoring; the curated-content track's answer to AI slop.
**Downsides:** Cue authoring is real editorial work; mastery criteria risk feeling like assessment if not calm.
**Confidence:** 88% · **Complexity:** Medium-High · **Status:** Unexplored (strong follow-on; the backlog #2 orders would be made of these)
> **Evidence caveat (2026-06-02):** the coach-pedagogy synthesis (`docs/research/coach-pedagogy-translation-self-coached.md`) says coach-graded pass/fail correction **backfires coachlessly** (ironic-monitoring / self-criticism). Build the cue-ladder as a **user-owned, process-framed, exploratory** surface — "try this / see how it feels" + a session-end reflection — **not** a mastery-gated "advance on demonstrated execution" pass/fail. The external-focus cue *content* is validated; the *gating* is what changes. See `docs/reviews/2026-06-02-m002-ideation-revalidation.md` §S3.

### 4. Roster-count as a first-class session input
**Description:** "How many bodies today?" (2 / 3 / 4+) as a low-typing input that deterministically reshapes format — pair drills at 2; king-of-court / 8-ball / partner-switch at 3-4+; wall/self-toss at 1 — without a different plan.
**Axis:** 5 — Content & technique depth (also touches axis 2)
**Basis:** `direct:` camp evidence (3v3 + more/fewer people via rotation); prior **observed displacement-of-use** (3s session run outside the app). `external:` roster size is a first-class coaching input (8-ball, king-of-court).
**Rationale:** Displacement-of-use is the strongest churn signal — the tool failed at the moment of real use.
**Downsides:** **Collides with `D101` (3+ deferred) and `D143` (attack unauthorized)** — adopting it reopens that deferral; 3+/rotation content is real authoring; could pull focus from the 2s core.
**Confidence:** 78% · **Complexity:** Medium-High · **Status:** Unexplored

### 5. Offered (pull-not-push) adaptation loop with a verdict ledger
**Description:** Close the loop SOAP-style: each review ends with one forward "next time" delta that pre-seeds the next session's focus, surfaced as **accept / keep original** (never silent reshuffle). Persist every progress/hold/deload verdict + the pair's overrides as an append-only ledger so adaptation reads the trend and increasingly defers to the pair's own choices.
**Axis:** 4 — Adaptation loop
**Basis:** `external:` Runna "re-adapt or keep?"; autoregulation beats rigid periodization; co-authored plans win on adherence; opaque reshuffle is an anti-pattern. `direct:` adaptation inputs exist (RPE, sRPE bands, captures) but no closed multi-week loop tied to calendar intent.
**Rationale:** Turns scattered captures into compounding training memory that respects ownership and `P7` (deterministic routing off an explicit human answer) — no AI, no nagging.
**Downsides:** Threshold tuning is delicate; distinguishing a deliberate deload from a life-skip without interrogating is hard.
**Confidence:** 80% · **Complexity:** Medium · **Status:** Unexplored

### 6. Pair co-availability as a scheduling input
**Description:** Capture the **shared** window where both partners can train (the intersection, not the union) + known blackout dates; let the pair tag a few "key sessions" the plan protects. The generator then proposes realistic session counts.
**Axis:** 2 — Scheduling & availability
**Basis:** `direct:` `D146` pair-first → the dyad is the planning unit; no availability object exists. `external:` consistency at amateur volume; "over-ambitious plans" anti-pattern; summit-window (protect scarce windows) analog.
**Rationale:** For 2s, co-availability is the binding constraint; silently AND-ing two calendars hides the actual scarcity.
**Downsides:** Capture risks typing cost vs the low-typing contract; partner-side data raises a local-first sync question.
**Confidence:** 72% · **Complexity:** Medium · **Status:** Unexplored

### 7. Structured warmup content block
**Description:** A deterministic warmup pre-block every session can front-load: a ~10s ball-control phase (touches / passes / low pepper) + aggressive courtside mobility (jogging, high knees, cossacks, mobility squats, shuffling), scaled to roster and focus.
**Axis:** 5 — Content & technique depth
**Basis:** `direct:` camp evidence (e) — both warmup types "super useful"; the `warmup` SkillFocus already exists with no real content behind it.
**Rationale:** Cheapest clearly-valuable, high-frequency win — every session touches it, zero new routes, fills an already-authorized-but-empty focus.
**Downsides:** Small as a standalone "direction"; mostly content authoring. Open: fixed pre-block vs selectable focus; does it count toward load/sRPE?
**Confidence:** 82% · **Complexity:** Low · **Status:** Unexplored

## Honorable Mentions
- **HM1. Extensible + dyadic focus taxonomy.** Refactor `SkillFocus` from a fixed enum into a versioned taxonomy so adding `attack` + `timing/spacing` is a data migration; model pair-*relational* skills (timing/spacing can't be logged per-player). The enabling data-model primitive under #3/#4. `direct:` camp attack/timing signals vs enum gap; `reasoned:` versioned taxonomy makes the unlock a low-cost data change.
- **HM2. Readiness-gated content rollout.** Feature-flag attack/timing/3v3 to "unflag" into the plan only when prerequisite focuses hit a threshold and roster/context supports it — depth lands deliberately, not as clutter. `reasoned:` software feature-flag analog against `D143`/`D101`/`D144` boundaries.

## Rejection Summary

| # | Idea(s) | Reason Rejected |
|---|---------|-----------------|
| 1 | One A-Event Anchor; EventAnchor primitive; Checkride gate; Autoregulated Block Taper | Merged into #1/#5 (single anchor + derived taper) |
| 2 | Capability anchor; Plan-from-the-gap; Open-Ended Mastery Arc | Merged into #1 (dual anchor) |
| 3 | Remove plan screen; Today-only regen; Release-train cadence; Recommended-focus inheritance; Mise-en-place card; 30-min compression | Merged into #2 (thin-spine renders all these) |
| 4 | How Cards; cue-as-unit; Graded Repertoire; Bridged Ladders; zero-type cue delivery | Merged into #3 |
| 5 | Roster headcount branch; Roster-size-first (8↔1) | Merged into #4 |
| 6 | Offer-don't-impose; Missed-session-without-guilt; single courtside question; co-authorship ledger; SOAP delta | Merged into #5 |
| 7 | Pair-intersection unit; Availability lattice; Summit-window; Single-session-as-season | Merged into #6 |
| 8 | Saturation 6×/week micro-themes | A dogfood stress-test for #5's deload path, not a standalone direction |
| 9 | Plans-as-markdown (standalone) | Folded into #2 as the emission discipline |
| 10 | Versioned/dyadic taxonomy; Feature-flag rollout | Held as HM1 / HM2 (enabling primitives, not directions on their own) |

Axis spread covers all five surfaces; axis 5 is intentionally heaviest (3 survivors: #3, #4, #7) because the BAB-camp evidence — the primary signal — concentrates on content/technique.

## Handoff
Survivor #2 (plan-as-thin-spine), **pure-spine scope** per the Decision above, is the brainstorm seed. Load `ce-brainstorm` next to define the surface precisely — what the durable "intentions + cadence + ready backlog" shape is, how only-next-session-concrete renders on existing surfaces under the `D137` spine, what the markdown-first emission looks like, and how the backlog orders by staleness/autoregulation without an anchor. The anchor (#1a focus-target, then #1b taper), the content cluster (#3/#4/#7), and adaptation (#5) are forward-compatible follow-ons, not v1.
