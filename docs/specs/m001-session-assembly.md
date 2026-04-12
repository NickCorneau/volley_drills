---
id: M001-session-assembly
title: M001 Session Assembly
status: draft
stage: planning
type: spec
authority: deterministic session-assembly model, slot system, template structure
summary: "Deterministic session assembly model with archetypes, slot system, and ranked fill."
last_updated: 2026-04-12
depends_on:
  - docs/milestones/m001-solo-session-loop.md
  - docs/prd-foundation.md
  - docs/decisions.md
  - docs/specs/m001-adaptation-rules.md
decision_refs:
  - D60
  - D61
  - D62
  - D63
  - D65
  - D66
  - D67
  - D68
  - D93
---

# M001 Session Assembly

## Agent Quick Scan

- Use this doc for deterministic session-assembly rules: archetypes, hard filters, block layouts, ranking, spacing, and fallback behavior.
- Not this doc for review payload shape or adaptation thresholds; use `docs/specs/m001-review-micro-spec.md` and `docs/specs/m001-adaptation-rules.md` for those.
- Governing decisions live in `docs/decisions.md`, especially D60 and D62-D68.

## Purpose

Define the first deterministic session-assembly model for M001.

This spec covers how a trusted repeat-use session is assembled after the first quick win. It does not require first-run onboarding to capture every hard filter up front.

## Governing decisions

D60 (hybrid archetype + ranked fill), D61 (solo SR framing), D62 (drill families), D66 (fallback policy), D67 (3-4 archetypes), D68 (blended practice order).

## Core stance

- Session assembly should be deterministic, explainable, and editable. (D60)
- Use a fixed `SessionArchetype` plus ranked drill fill, not open-ended AI planning. (D60, D67)
- Solo sessions train passing fundamentals: platform, angle control, movement, and realistic proxies. (D61)
- Partner + net sessions provide the highest-trust serve-receive transfer because they include live reading. (D61)
- Drills are families with parameterized variants, not flat independent entries. (D62)
- AI, if present, may explain or rephrase the deterministic output. It does not choose around the rules.

## Assembly flow

1. Capture hard-filter context.
2. Select one `SessionArchetype`.
3. Select the block layout for the chosen time profile.
4. Rank drill candidates within each block.
5. Parameterize the selected drills using `progress`, `hold`, or `deload`.
6. Surface `2-3` swap alternatives from the same filtered pool plus a one-line rationale.
7. If the candidate pool is too small, apply fallback rules before broadening constraints.

## Hard-filter context

Capture as fast taps, not free text:

- player count: `1` or `2` in current M001 scope
- time profile: `15`, `25`, `40+`
- net available: `yes` or `no`
- wall or fence available: `yes` or `no`
- balls: `1` or `many`
- markers: `none`, `improvised`, or `cones`
- wind: `calm`, `light wind`, or `strong wind`
- pain or fatigue today: `none` or `some`

These fields are hard filters because they change feasibility, safety, or realism.

## Session archetypes

M001 should start with a small, explicit set:

- `solo_wall`
  - Best for platform reps, angle control, and touch volume.
- `solo_open`
  - Best for self-toss, movement, and no-infrastructure proxies.
- `pair_net`
  - Best for live serve-receive transfer and pressure work.
- `pair_open`
  - Best for toss-based pair work when a net is unavailable.

Use `deload` as an overlay on top of any archetype rather than as a fully separate planner.

## Block layouts by time profile

Starter sessions can stay shorter and simpler, but trusted repeat-use sessions should follow explicit block layouts:

- `15`
  - `warmup` -> `technique` -> `main_skill` -> `wrap`
- `25`
  - `warmup` -> `technique` -> `movement_proxy` -> `main_skill` -> `wrap`
- `40+`
  - `warmup` -> `technique` -> `movement_proxy` -> `main_skill` -> `pressure` -> `wrap`

Block intent:

- `warmup`
  - Raise temperature, establish easy success, and screen for obvious pain.
- `technique`
  - Emphasize platform shape, angle control, and repeatable quality.
- `movement_proxy`
  - Add footwork, first-step movement, or reading proxies before the harder block.
- `main_skill`
  - Use the highest-trust drill available for the current archetype.
- `pressure`
  - Add scoring, variability, or simple constraints without turning the session random.
- `wrap`
  - End cleanly, prep review, and avoid dashboard sprawl.

## Candidate ranking rules

### Hard filters

Reject any drill that fails:

- player-count fit
- time fit
- required equipment or markers
- net or wall/fence requirement
- safety exclusions from pain or fatigue
- level mismatch

### Soft ranking priorities

Among the remaining candidates, rank in this order:

1. goal match for the current block
2. archetype fit
3. environment fit, including wind
4. repeat spacing
5. progression fit for the current `progress / hold / deload` state
6. realism or pressure fit when the archetype can support it

Ties should resolve deterministically, not randomly.

## Variety and repetition policy

- Repetition is acceptable when the drill is an anchor and the next step is explainable.
- Do not repeat the exact same drill in the exact same block across the last `2` sessions unless the user is on `hold` or the session is intentionally anchored.
- When possible, freshness should come from variants, constraints, order, or scoring, not from swapping in unrelated drills.
- Do not use randomization as a freshness substitute.

## `progress / hold / deload` mapping

### Progress

- Increase one primary dimension only:
  - harder constraint, or
  - more volume
- Prefer raising difficulty before raising volume.

### Hold

- Preserve the main challenge.
- Rotate a minor parameter when possible:
  - order
  - target size
  - rest length
  - movement entry

### Deload

- Reduce volume and simplify constraints.
- Remove higher-load serve or jump exposure first when present.
- Prefer lower-chaos mechanics or proxy work over realistic pressure.

## Fallback policy

When a block has fewer than `2` viable candidates:

1. Downgrade realism before breaking feasibility.
2. Allow proxy tags such as `movement_proxy` or `mechanics`.
3. Prefer same-family lateral variants before unrelated drills.
4. Expose a one-tap `broaden constraints` option rather than silently violating hard rules.

Never break safety or hard equipment constraints just to preserve a more "realistic" drill.

## User-facing explanation

The system should always be able to explain the result in one sentence:

- Session-level example: `Built for solo wall work, 25 minutes, light wind conditions, and today's hold state.`
- Block-level example: `Chosen because it fits platform-angle work and adds a small variation from last time.`

Swaps should stay in the same goal family whenever possible.

## Not in M001

- hidden scoring systems
- open-ended AI assembly
- weekly periodization logic inside the session builder
- per-rep live logging requirements
- full random-practice optimization

## Evidence base

The hybrid archetype + ranked fill model and the blended practice order are supported by desk research on deterministic session assembly (see `research-output/deterministic-session-assembly.md`). Key findings:

- Small-library fitness products (StrongLifts A/B, Couch to 5K, 7 Minute Workout) succeed with repetition when progression is purposeful and explainable.
- Motor learning meta-analyses (Czyz et al. 2024; Ammar et al. 2023) show limited transfer benefit from full randomization in real sports settings, supporting blocked quality reps early and constrained variability later.
- The FIVB drillbook structures drills with objective, equipment, participants, teaching points, and explicit variations/modifications, which directly maps to the drill-family + variant-knob model.
- Fitbod's algorithm demonstrates constraint-driven ranking with fallback behavior for equipment/time collisions.
- USA Volleyball coaching guidance establishes that serve-receive success depends on pre-contact reading, validating the framing split between solo fundamentals and partner transfer.

## Decision links

Key decisions that constrain this spec (grep `docs/decisions.md` for full rationale):

- D60 -- fixed archetypes plus ranked fill
- D61 -- solo sessions framed as passing fundamentals
- D62 -- drill families with parameterized variants
- D63 -- one-dimension-at-a-time adaptation
- D65 -- default spacing rule (no same-slot repeat within 2 sessions unless Hold)
- D66 -- fallback policy: downgrade realism before breaking feasibility
- D67 -- session archetypes (solo_wall, solo_open, pair_net, pair_open)
- D68 -- blended practice order (blocked early, variable later)

## Related docs

- `docs/prd-foundation.md`
- `docs/milestones/m001-solo-session-loop.md`
- `docs/specs/m001-adaptation-rules.md`
- `docs/specs/m001-courtside-run-flow.md`
- `docs/research/beach-training-resources.md` (session assembly model synthesis)
- `research-output/deterministic-session-assembly.md` (raw research)

## Machine-readable data

- `app/src/types/drill.ts` — canonical drill metadata types
- `app/src/types/session.ts` — session archetype, block slot, and pass-grade types
- `app/src/data/drills.ts` — 26-drill seed catalog with full metadata
- `app/src/data/progressions.ts` — 7 progression chains with gating criteria
- `app/src/data/archetypes.ts` — 4 session archetypes with block layouts by time profile
