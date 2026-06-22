---
id: spec-stress-rung-taxonomy
title: Stress-Rung Taxonomy
status: active
stage: validation
type: spec
summary: "Ordinal stress-rung scale (progressive contextual interference), the authored per-focus ladders over the full scoped-tag drill catalog, and the M002.2 per-rung progression content (intent + external-focus cue + exploration criterion + graduation feel); gates all rung annotation."
authority: canonical definition of stress-rung semantics, per-focus ladder orderings, per-rung progression content rules, and the skill-band starting-rung mapping
last_updated: 2026-06-21
depends_on:
  - docs/decisions.md
  - docs/brainstorms/2026-06-11-stress-substrate-requirements.md
  - docs/plans/2026-06-11-001-feat-stress-substrate-plan.md
  - docs/plans/2026-06-12-003-feat-engine-integrity-front-porch-plan.md
  - docs/plans/2026-06-21-001-feat-m002-2-rung-depth-and-progression-plan.md
  - docs/reviews/2026-04-28-m001-candidate-false-audit.md
decision_refs:
  - D68
  - D149
  - D150
  - D154
  - D159
  - D160
---

# Stress-Rung Taxonomy

## Purpose

Fix what a **stress rung** means before any catalog annotation, so rung numbers are authored judgments against one scale, not ad hoc rankings. This is the just-in-time brief `D149` queued ahead of the stress-ladder work.

## Agent Quick Scan

- A rung is an **ordinal skill-side stress level** within one focus (pass / serve / set), grounded in progressive contextual interference (`D68`): how much variability, perception, and live read the drill demands — **never** physiological load (sRPE semantics are untouched; `D149` demoted load to backend-only).
- Rungs sit on **drills**, not variants. Variants differ by context (solo/pair, net/open); context fit stays the candidate filter's job.
- A **ladder** is the per-focus ordering of rungs; each rung holds one or more drills. Encoded in `app/src/data/stressLadders.ts`; the registry must match this brief.
- The athlete's **position** on a ladder is derived, never persisted (`D150`): replay accepted verdicts over review history, starting from the skill-band mapping below.
- Movement is **user-accepted only** — no auto-promotion, no pass/fail gates. The dormant `ProgressionChain` gating philosophy is retired, not revived; its easy→hard orderings informed these ladders.

## Rung Scale (ordinal anchors)

| Rung | Anchor (contextual interference) | Signature |
|------|----------------------------------|-----------|
| 1 | **Constant** — blocked reps, predictable feed, one outcome | self-toss or cooperative toss, no movement demand |
| 2 | **Serial** — continuous rallying or fixed target sequence | the ball keeps coming; rhythm under mild fatigue |
| 3 | **Varied** — directional/target variation or added perception | scan-then-act, multi-target, movement between reps |
| 4 | **Constrained / reactive** — constraint-led or reactive reads | degraded tools (one arm), short/deep reaction, outcome pressure |
| 5 | **Live-read** — opponent-shaped, game-speed perception | live serve receive, spin reads, recover-and-repeat chaos |

The scale is ordinal: rung 4 is more stress than rung 3 within the same focus; cross-focus comparisons are meaningless. Ladders need not use all five anchors (serve tops out at 4 today).

## Per-Focus Ladders (authored, v2 — catalog-wide per D160)

Scope (`D160`, amending the v1 `m001Candidate`-only scope): every catalog drill whose `skillFocus` includes the focus. Assembly-blocked drills (`d09`, `d15`, `d18` — equipment/line filters) are placed for completeness; nearest-rung fallback handles their unavailability. Dual-focus drills (`d08`, `d18`, `d20`, `d21`) carry an independently authored rung per ladder.

Rows marked **†** are **runtime-inert non-candidate placements** (`m001Candidate: false`): `findCandidates` filters on candidacy, so these rungs are content metadata that becomes live only if eligibility widens. Assembly and adaptation behavior are unchanged by them (pinned in `sessionBuilder.test.ts`). All v2 placements land on existing rung indices — per-focus bounds stay pass 1–5, serve 1–4, set 1–5 (`stressLadderBounds`, `startingStressRung`, offer gating, and derived-position clamping untouched; bounds growth needs its own decision row).

### Pass (5 rungs, 24 drills)

| Rung | Drills | Rationale |
|------|--------|-----------|
| 1 | d01 Pass & Slap Hands · d02 Towel Posture Passing † · d04 Catch Your Own Pass † | constant: predictable toss, single-rep reset; d02/d04 are chain-1 blocked posture/self-catch fundamentals beside d01 |
| 2 | d03 Continuous Passing · d05 Self-Toss Pass to Set Window · d06 Pass & Slap Hands with Target † · d19 Butterfly Toss-Pass-Catch † | serial: continuous rally / fixed window target; d06 adds a fixed set-window target beside chain-2 sibling d05; d19 is controlled-input rotation rhythm |
| 3 | d07 Pass & Look · d09 Passing Around the Lines · d10 The 6-Legged Monster · d12 U Passing † · d13 W Passing † · d14 Pass & Switch † · d16 Diamond Passing † · d17 Beat Ball to Pole † · d24 Pass into a Corner † | varied: scan-then-act, movement courses; d12/d13/d14 are chain-3 movement courses beside d09/d10; d16 is defined-sequence footwork (one below d15's reactive read); d17 adds two-role coordination; d24 is move-to-ball corner targeting |
| 4 | d11 One-Arm Passing · d15 Short/Deep Serve-Receive Reaction · d20 3 Serve Pass to Attack † · d21 500 † | constrained tools / reactive depth reads; d20 is live serve receive inside a pass-set-attack continuity constraint; d21 is scored anticipation reads |
| 5 | d08 Plus Three / Minus Three † · d18 Serve & Pass Ladder · d46 Spin-Read Serve Receive · d50 Short/Deep Pass Read | live-read serve receive; d08 is live receive under +3/−3 stakes |

### Serve (4 rungs, 7 drills)

| Rung | Drills | Rationale |
|------|--------|-----------|
| 1 | d31 Self Toss Target Practice | constant: single zone, no pressure |
| 2 | d23 Serve & Dash † · d51 Outside the Heart Serving | serial: zone sequencing / full-routine reps; d23's dash is body load, not contextual interference (D149 keeps load off this scale) |
| 3 | d22 First to 10 Serving | varied + outcome pressure: score constraint |
| 4 | d08 Plus Three / Minus Three † · d18 Serve & Pass Ladder · d33 Around the World Serving | constrained sequence / serve into live receive; d08 serves into live receive with error scoring |

### Set (5 rungs, 10 drills)

| Rung | Drills | Rationale |
|------|--------|-----------|
| 1 | d38 Bump Set Fundamentals · d39 Hand Set Fundamentals · d40 Footwork for Setting | constant fundamentals (parallel entry rung) |
| 2 | d41 Partner Set Back-and-Forth | serial: continuous rally |
| 3 | d42 Corner to Corner Setting | varied: movement + direction |
| 4 | d20 3 Serve Pass to Attack † · d21 500 † · d47 Four Great Sets | constrained: quality-graded multi-target; d20 sets off live-ish passes in continuity flow; d21 sets off scored chaotic entries |
| 5 | d48 Set and Look · d49 Set and Recover | live-read perception / recover-and-repeat chaos |

## Progression Content (M002.2)

Each rung carries four authored fields that make climbing it a *meaningful* skill step, not just a harder one. The exact athlete-facing strings live in `app/src/data/stressLadders.ts` (they are data); this spec is authoritative for the **fields, the authoring rules, and the per-focus progression story**. `rung_content_missing` in `validateDrillCatalog` enforces that every rung ships all four.

| Field | What it is | Authoring rule |
|-------|------------|----------------|
| `intent` | what the rung trains, in contextual-interference terms | speaks variability / perception / live-read, never physiological load (`D149`) |
| `externalFocusCue` | the one prompt that makes the step real | external focus (Wulf; courtside-copy rule 12b): an outcome or environmental referent (ball flight, target, landing, partner reach), never a body part or internal sensation |
| `explorationCriterion` | a process-framed "see how it feels" read | exploratory and user-owned; never a coach-graded pass/fail threshold (`D154` gating stays retired; coach-pedagogy evidence shows pass/fail backfires coachlessly) |
| `graduationFeel` | the felt readiness-to-step signal | descriptive only; movement stays user-accepted via the review verdict (`D154`); the ladder-top rung describes staying and deepening, not stepping |

All four fields obey the courtside-copy invariants (no em-dash; jargon glossed; the cue passes rule 12b). **Partial rendering shipped 2026-06-22** (`D161`, plan `docs/plans/2026-06-22-001-feat-m002-2-progression-read-on-review-plan.md`): the Review verdict card now renders `explorationCriterion` (keyed to the rung the athlete actually trained, via `stressRungForDrill`) and, on a `more` offer only, `graduationFeel` (keyed to the derived offer position). Verdict-gated (only inside the existing "Next time" card) and Review-only; no raw rungs render (`D157` holds). `intent` + `externalFocusCue` stay deferred to the run-time technique-how half (Run / Transition / Drill Check) — the M002.2 spine follow-on.

### Why each step is a real improvement (progression story)

The mechanism is unchanged: an accepted "more stress" verdict steps the derived position one rung (`D154`); this content gives the step its meaning. Climbing is a contextual-interference ramp (`D68`) — the *thing you attend to* shifts outward as the environment gets less predictable.

- **Pass.** 1 groove a clean contact on a predictable feed → 2 hold that contact while the ball keeps coming → 3 read flight, move, and still pass to one target → 4 keep control when the tool or time is taken away (one-arm, short-then-deep) → 5 read a real served ball at game speed. Each step trades a fixed variable for a read: feed predictability, then rhythm, then movement, then degraded tools, then live opponent.
- **Serve.** 1 commit to one target until it grooves → 2 hold quality across longer sets and zone sequences → 3 serve to a called/scored target under a little outcome pressure → 4 serve into a live receiver and a sequence you do not control. The cue moves from "same circle" to "the zone that pressures the receiver."
- **Set.** 1 build a repeatable shape on a predictable toss → 2 hold the shape in a continuous partner rally → 3 set to changing targets from changing spots → 4 choose bump or hand set from imperfect passes and still deliver hittable → 5 set under live chaos when the pass pulls you out of position and recover for the next ball.

Readiness to climb is *felt*, not measured — `graduationFeel` describes the moment a rung stops feeling like a stretch and a new variable feels welcome rather than overwhelming. The objective "cleared this rung at a higher stress level" signal is the **`M002.3` seam** (the 1% Better Signal), not built here; M002.2 deliberately keeps progression user-owned and exploratory so M002.3 has honest, low-pressure content to score against.

### Depth target (advisory)

A rung wants at least **2 assembly-eligible (`m001Candidate: true`) drills** so stepping onto it picks genuinely different work (`auditRungDepth`, `RUNG_DEPTH_TARGET = 2`). This is an **advisory, not a hard gate** — legitimately thin rungs with no source-backed sibling yet must not fail CI.

As of the **2026-06-21 roster-depth wave** (`docs/plans/2026-06-21-002-feat-roster-depth-source-backed-drills-plan.md`), every rung meets the target: seven source-backed drills (`d52`–`d58`) deepened the seven previously-thin rungs (pass 1, serve 1/2/3, set 2/3/4), so `auditRungDepth` returns empty. The advisory remains the live machine-checked tracker — if a future change drops a rung below 2 it resurfaces.

## Skill-Band Starting Rung

For a focus with no accepted verdicts, position starts from the onboarding drill band (`skillLevelToDrillBand`):

| Band | Starting rung |
|------|---------------|
| beginner (incl. `unsure`) | 1 |
| intermediate | 2 |
| advanced | 4 (clamped to each ladder's top rung) |

The clamp guards future mapping/ladder tuning; today advanced → 4 lands exactly on the serve ladder's top rung.

## Exclusions and Authoring Backlog

- **Lifecycle-only drills stay off-ladder by design**: d25, d26 (recovery), d28 (warmup). No ladder exists for those focuses and contextual-interference rungs do not apply. (The v1 "non-candidate rows stay un-rung" exclusion is superseded by `D160` — every scoped-tag drill now holds a rung; non-candidates' rungs are runtime-inert, see above.)
- **Authoring invariant (`D160`)**: every new scoped-tag catalog drill ships with a same-commit ladder rung plus a one-line placement rationale. `scoped_drill_off_ladder` in `validateDrillCatalog` enforces this at test time; M002.2's authoring wave inherits it as the placement procedure.
- **Named authoring backlog** (missing rungs from the founder's example ladder, not blockers): pass-to-setter-to-hit sequences, dive/emergency passing, deeper serve-pressure formats. Author only where a ladder proves too sparse to step in dogfood — serve's single-drill rungs 1 and 3 are the visible thin spots.

### Roster-depth backlog (M002.2, source-cited) — FILLED 2026-06-21

The 2026-06-21 roster-depth wave (`docs/plans/2026-06-21-002-feat-roster-depth-source-backed-drills-plan.md`) authored seven source-backed drills under `D130` founder-as-coach mode, one per thin rung, each obeying the courtside-copy authoring checklist and shipping its rung + chain membership in the same change (`D160`):

| Rung | New drill | Source anchor |
|------|-----------|---------------|
| pass 1 (constant) | `d52` Pass Back and Forth | BAB Plan 1 Drill 1 (pass back and forth, 10 each) |
| serve 1 (constant) | `d53` Deep Serve Practice | FIVB 2.3 Deep Serve Practice |
| serve 2 (serial) | `d54` Four Corner Serving | BAB Plan 2 Drill 3 (Serving Spots Around the World, 4-zone) |
| serve 3 (varied + pressure) | `d55` Sideline Serving Challenge | BAB Plan 2 Drills 5–7 (Server vs Passer) |
| set 2 (serial) | `d56` Set and Move | FIVB 4.1 Set and Move (adds the solo route beside pair-only d41) |
| set 3 (varied) | `d57` Moving Target Setting | FIVB 4.4 High Rep Setting (Triangle) reduced + BAB footwork |
| set 4 (varied + pressure) | `d58` Two-Touch Set Choice | BAB Plan 6 Drill 2 (Corner to Corner) Steps 2 & 4 |

The parked (`m001Candidate: false`) reserve was re-evaluated against `docs/reviews/2026-04-28-m001-candidate-false-audit.md` and **none were activated** — no parked drill has a fresh `graduate-when` trigger, and the reserve stays gated on `D101` 3+ geometry, group mode, or unmodeled equipment. Depth came from new authored content, not flag flips. `auditRungDepth` now returns empty; it remains the live tracker if any rung later drops below 2.

## Update When

- A drill is added (it must take a rung in the same change), activates into, or retires from `m001Candidate` (inert ↔ live flips need no rung change, but candidacy notes here should stay honest).
- Dogfood evidence shows a rung assignment mis-steers sessions.
- M002.2 cue/criterion depth changes — keep the Progression Content section and the registry (`app/src/data/stressLadders.ts`) in sync; `rung_content_missing` enforces presence, not wording.
- A roster-depth backlog row is filled (new drill authored) or a parked drill clears a fresh `graduate-when` trigger — update the backlog table and the audit doc together.
