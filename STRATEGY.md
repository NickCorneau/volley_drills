---
id: strategy
name: Volleycraft
title: Volleycraft Strategy
status: active
stage: validation
type: strategy
authority: top-level strategic anchor (target problem, approach, persona, key metrics, tracks); orients but does NOT outrank docs/vision.md, docs/decisions.md, or docs/prd-foundation.md
summary: "Repo-root strategy anchor: aggregate authoritative volleyball sources + team's own data into structured plans, instead of AI slop. Three tracks (self-coached weekly loop, curated content engine, plan/progression engine). Founder-use mode through 2026-07-20; metrics deliberately minimal."
last_updated: 2026-05-27
depends_on:
  - docs/vision.md
  - docs/decisions.md
  - docs/prd-foundation.md
  - docs/status/current-state.md
---

# Volleycraft Strategy

## Target problem

Amateur volleyball players — especially 2s/beach players — have no app-native equivalent of RP Hypertrophy or ATG: no structured, periodized, progressive way to actually get better at the sport. The obvious workaround — finding a real coach — is also broken: vetted coaches for amateur pair volleyball are scarce and hard to find in any given local area.

## Our approach

Trust and guide the team by aggregating authoritative volleyball sources from across the web and integrating them with the team's own practice data, goals, plans, and schedule to build the best training plan possible — instead of leaning on AI slop to randomize what to do day by day.

## Who it's for

**Primary:** Serious amateur volleyball players (currently focused on 2s/beach pairs — embodied today by the founder and his partner Seb under `D130` founder-use mode) who are already investing significant time in the sport, want to practice but aren't sure what to run, and love progressively improving instead of doing random work.

They're hiring Volleycraft to offload the mental overload of research and session planning, capture data from session to session, and help them build and run training sessions that actually compound over time — without hiring a coach they probably can't find anyway.

## Key metrics

Volleycraft is in `D130` founder-use mode through 2026-07-20; metrics are deliberately minimal and qualitative-leaning, not a dashboard.

- **Repeat usage** — Now: founder + Seb keep opening the app for real sessions week after week, measured against `docs/research/founder-use-ledger.md`, not a counter. Later (post-`D130`): cohort-frame reads under `D91` (second session within 14 days, self-initiated vs prompted).
- **Founder-willingness-to-recommend** — Qualitative threshold: would the founder send this to a friend and say "just use this"? Currently *no* — gaps in content, planning, and progression-over-time. Crossing this threshold is what unlocks the cohort question at the `D130` re-eval.
- **Review completion rate** — Leading indicator that the sesh-to-sesh capture loop is alive. If review completion craters, repeat usage will follow. `D73` named >50% as a precondition for downstream coach work.

## Tracks

### Self-coached weekly loop

The M001 → M002 → ... arc that turns a believable single-session into a believable weekly training home. Owns carry-forward, the next-N queue, the weekly receipt, and bounded "why" explanations.

_Why it serves the approach:_ Without a believable weekly loop, even the best curated plan dies on first contact with reality — this is the surface where trust gets earned.

### Curated content engine

The drill library and source-aggregation work rooted in `docs/research/beach-training-resources.md`, plus Tier 1b reserved slots, Phase 2B per-drill capture shapes, and the open attack-content track-shape question. Owns *what* the user trains on.

_Why it serves the approach:_ This is the "aggregate authoritative sources from across the web" half of the approach — without it, the structure has nothing to plan from.

### Plan / progression engine

The deterministic engine that takes user data + curated content + goals/schedule → a session that actually progresses week over week. Generator policy, focus inference, session shape, and the explicit `progress / hold / deload` rules.

_Why it serves the approach:_ This is the "no AI slop" half — the system that produces structured plans by rule, not by hallucination.

## Milestones

- **2026-07-20** — `D130` founder-use window close + friends-of-friends cohort decision on M002 evidence (per `D147`). Pre-registered M001 reversal condition: if the cohort question can't be decided cleanly under M002 evidence, M001 reopens for Tier 2 repoint.

## Not working on

- AI-generated training plans or open-ended coach chat — excluded by `P7` and the "no AI slop" bet. The temptation will keep returning.
- Coach pairing / marketplace as an active build — downstream of the self-coached layer per `D72`/`D73`/`D124`; unlocks only after M002 has run.
- Social / creator content platform, generic fitness tracker, full team operations suite, video-first analytics — `vision.md` non-goals; named here because they will keep being suggested.
- Monetization mechanics in v1.
