---
id: spec-stress-rung-taxonomy
title: Stress-Rung Taxonomy
status: active
stage: validation
type: spec
summary: "Ordinal stress-rung scale (progressive contextual interference) and the authored per-focus ladders over the m001Candidate drill catalog; gates all rung annotation."
authority: canonical definition of stress-rung semantics, per-focus ladder orderings, and the skill-band starting-rung mapping
last_updated: 2026-06-11
depends_on:
  - docs/decisions.md
  - docs/brainstorms/2026-06-11-stress-substrate-requirements.md
  - docs/plans/2026-06-11-001-feat-stress-substrate-plan.md
decision_refs:
  - D68
  - D149
  - D150
  - D154
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

## Per-Focus Ladders (authored, v1)

Scope: every `m001Candidate` drill whose `skillFocus` includes the focus. Assembly-blocked drills (`d09`, `d15`, `d18` — equipment/line filters) are placed for completeness; nearest-rung fallback handles their unavailability. The dual-focus drill `d18` carries an independently authored rung per ladder.

### Pass (5 rungs, 11 drills)

| Rung | Drills | Rationale |
|------|--------|-----------|
| 1 | d01 Pass & Slap Hands | constant: predictable toss, single-rep reset |
| 2 | d03 Continuous Passing · d05 Self-Toss Pass to Set Window | serial: continuous rally / fixed window target |
| 3 | d07 Pass & Look · d09 Passing Around the Lines · d10 The 6-Legged Monster | varied: scan-then-act, movement courses |
| 4 | d11 One-Arm Passing · d15 Short/Deep Serve-Receive Reaction | constrained tools / reactive depth reads |
| 5 | d18 Serve & Pass Ladder · d46 Spin-Read Serve Receive · d50 Short/Deep Pass Read | live-read serve receive |

### Serve (4 rungs, 5 drills)

| Rung | Drills | Rationale |
|------|--------|-----------|
| 1 | d31 Self Toss Target Practice | constant: single zone, no pressure |
| 2 | d51 Outside the Heart Serving | serial: zone sequencing, long envelope |
| 3 | d22 First to 10 Serving | varied + outcome pressure: score constraint |
| 4 | d18 Serve & Pass Ladder · d33 Around the World Serving | constrained sequence / serve into live receive |

### Set (5 rungs, 8 drills)

| Rung | Drills | Rationale |
|------|--------|-----------|
| 1 | d38 Bump Set Fundamentals · d39 Hand Set Fundamentals · d40 Footwork for Setting | constant fundamentals (parallel entry rung) |
| 2 | d41 Partner Set Back-and-Forth | serial: continuous rally |
| 3 | d42 Corner to Corner Setting | varied: movement + direction |
| 4 | d47 Four Great Sets | constrained: quality-graded multi-target |
| 5 | d48 Set and Look · d49 Set and Recover | live-read perception / recover-and-repeat chaos |

## Skill-Band Starting Rung

For a focus with no accepted verdicts, position starts from the onboarding drill band (`skillLevelToDrillBand`):

| Band | Starting rung |
|------|---------------|
| beginner (incl. `unsure`) | 1 |
| intermediate | 2 |
| advanced | 4 (clamped to each ladder's top rung) |

The clamp guards future mapping/ladder tuning; today advanced → 4 lands exactly on the serve ladder's top rung.

## Exclusions and Authoring Backlog

- **Non-candidate rows stay un-rung** until activated: d02, d04, d06, d08, d12, d13, d14, d16, d17, d19, d20, d21, d23, d24 (all `m001Candidate: false`). Activating any of them requires placing it on its focus ladder(s) in the same change.
- **Named authoring backlog** (missing rungs from the founder's example ladder, not blockers): pass-to-setter-to-hit sequences, dive/emergency passing, deeper serve-pressure formats. Author only where a ladder proves too sparse to step in dogfood.

## Update When

- A drill is added, activated, or retires from `m001Candidate`.
- Dogfood evidence shows a rung assignment mis-steers sessions.
- M002.2 attaches cue/criterion depth to rungs (extend the rung rows here first).
