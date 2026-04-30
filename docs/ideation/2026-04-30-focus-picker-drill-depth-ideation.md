---
id: focus-picker-drill-depth-2026-04-30
title: "Ideation: focus-picker drill depth and swap coverage"
type: ideation
status: active
stage: validation
authority: "Ranked ideation answering whether the new Tune today focus picker has enough source-backed drill depth for believable practices and swaps across pass/serve/set, solo/pair, equipment, and long-session configurations."
summary: "Ground-up audit plus synthesis of recent focus/skill ideation. Finds that Passing is broadly covered, Setting is buildable but thin, and Serving is fragile: pair/no-net serving likely cannot build a focused main-skill block, long serving sessions still get pass-flavored technique/movement support blocks, and skill level is not currently modeled by assembly. Recommends a coverage audit grid, serving-focus credibility pass, focus-aligned support-block definition, thin-focus honesty contract, long-session simulator, source-backed backlog cards, and variant-level provenance/adaptation checklist."
last_updated: 2026-04-30
related:
  - docs/ideation/2026-04-28-what-to-add-next-ideation.md
  - docs/ideation/2026-04-29-skill-scope-and-game-layers-ideation.md
  - docs/brainstorms/2026-04-30-focus-coverage-catalog-readiness-requirements.md
  - docs/brainstorms/2026-04-29-session-focus-picker-requirements.md
  - docs/plans/2026-04-30-001-feat-pre-run-simplification-plan.md
  - docs/research/fivb-source-material.md
  - docs/research/bab-source-material.md
  - docs/research/fivb-coaches-manual-crosscheck.md
  - docs/research/vdm-development-matrix-takeaways.md
decision_refs:
  - D81
  - D101
  - D130
  - D135
---

# Ideation: focus-picker drill depth and swap coverage

## Purpose

Answer whether the newly added Tune today focus picker has enough active, source-backed drill depth to create believable practices and swaps across configurations.

This ideation starts from the recent focus-picker and skill-scope docs, then re-checks the live catalog and source material from the ground up. It is not a requirements doc and does not authorize new drill authoring.

## Brainstorm resolution (2026-04-30)

This ideation was consumed by `docs/brainstorms/2026-04-30-focus-coverage-catalog-readiness-requirements.md`.

The user resolved the product posture more strongly than the original survivor list: **Volleycraft should not have planned thin or unavailable visible focus states.** Passing, Serving, and Setting should be fully catalog-backed across the required setup/skill/duration/swap matrix. The requirements doc therefore rejects the "Thin-Focus Honesty Contract" as a steady-state product answer and replaces it with a full catalog-readiness bar.

## Grounding Context

### Codebase context

- Explicit `sessionFocus` currently supports `pass`, `serve`, and `set`.
- The shared focus resolver applies explicit focus only to `main_skill` and `pressure` slots in `app/src/domain/sessionAssembly/effectiveFocus.ts`.
- `technique` and `movement_proxy` remain recommendation-owned in `app/src/data/archetypes.ts`; today those slots are pass/movement-shaped even in a Serving or Setting focused session.
- Candidate pools are hard-filtered by `m001Candidate`, participants, net/wall requirements, and unmodeled equipment in `app/src/domain/sessionAssembly/candidates.ts`.
- The app has `TimeProfile = 15 | 25 | 40`; there is no separate 45-minute profile. The 40-minute profile is the long-session proxy.
- Drill records carry `levelMin` and `levelMax`, but current session assembly does not filter by skill level. The product cannot yet guarantee beginner/intermediate/advanced drill coverage by focus.

### Coverage read

- **Passing:** broadly buildable across solo/pair and net/wall/open configurations, with the strongest source-backed catalog depth.
- **Setting:** buildable across many contexts through active `d38`-`d42` material, but still thinner than passing and heavily dependent on a small number of family variants.
- **Serving:** fragile. Active assembly-ready serving is effectively concentrated in `d31` and `d33` after current filters. `d22` is filtered by `balls: 'many'`; `d18` and other serve-receive shapes are multi-ball or group-shaped; `d23` is inactive. Pair + no net + Serving likely cannot produce a focused `main_skill` block.
- **Swaps:** focused swaps can widen after the focused pool is empty, preserving mid-run usefulness but risking off-focus alternatives during a focused session.
- **Long serving example:** a long Serving session can generate some serving main/pressure work in net-supported contexts, but it does not currently produce a serving-adjacent `technique` block. The support blocks can still feel like a passing practice.

### Source context

- FIVB's beach drill book contains 104 drills: 7 serving, 16 passing, 9 setting, 15 modified games, plus warmup/attack/block/defense content. Its structure implies a credible focus practice needs several repetition, pressure, and game-like shapes rather than one tagged drill.
- FIVB also reinforces participant/equipment honesty: many beginner drills assume a coach/partner, multiple balls, a net, or lines/cones. Source availability is not the same as current M001 eligibility.
- Better at Beach's archive contains 37 essential drills across 20 practice plans and a practice-planning principle: all drills should reinforce the session focus. That directly challenges pass-flavored support blocks in a serving-focused session.
- Volleyball Canada supplies stage/progression vocabulary and realistic consolidation expectations, but the current builder does not model skill stage or skill level as a filter.

## Ranked Ideas

### 1. Focus Coverage Audit Grid

**Description:** Create a durable matrix across focus, player mode, net/wall state, time profile, slot type, candidate count, and swap count.

**Rationale:** This turns "do we have enough?" into an objective health check. It should distinguish total catalog count from eligible candidates after current hard filters.

**Downsides:** Diagnostic first; it does not add content by itself.

**Confidence:** 95%

**Complexity:** Low-Medium

**Status:** Explored

### 2. Serving Focus Credibility Pass

**Description:** Treat Serving as the first focus-depth repair target. Separate active assembly-ready serving drills from source-backed but inactive, multi-ball, safety-gated, or net-dependent serving drills.

**Rationale:** Serving is the focus most exposed by Tune today. It has the sharpest user-facing failure mode: pair/no-net contexts and long serving sessions do not have enough focused support.

**Downsides:** Any new active drill or active variant must respect D130 authoring discipline and the existing cap/trigger posture.

**Confidence:** 90%

**Complexity:** Medium

**Status:** Explored

### 3. Focus-Aligned Support Blocks

**Description:** Define what `technique` and `movement_proxy` should mean when the user chooses Serving or Setting. Support blocks do not need to match the focus tag literally, but they should reinforce the focus in source-backed ways.

**Rationale:** The user's 45-minute serving example fails mainly because support slots remain pass-shaped. BAB's practice-planning guide explicitly warns against scattered drills that do not reinforce the intended focus.

**Downsides:** Requires careful source grounding so "support" does not become generic filler.

**Confidence:** 88%

**Complexity:** Medium

**Status:** Explored

### 4. Thin-Focus Honesty Contract

**Description:** Give the product a vocabulary for buildable, thin, and unavailable focus states. A thin focus may remain tappable, but the app should not imply full practice depth when it can only partially honor the intent.

**Rationale:** Honest scarcity preserves trust better than fake agency, silent off-focus swaps, or generic Recommended fallback.

**Downsides:** May require revisiting the current all-enabled fail-on-tap posture from the pre-run simplification plan.

**Confidence:** 82%

**Complexity:** Medium

**Status:** Rejected by follow-up brainstorm. Thin/unavailable focus states should not be a planned steady state; catalog readiness should make every visible focus fully supported.

### 5. 45-Minute Readiness Simulator

**Description:** Use the long-session profile as a stress test. Generate dry-run drafts across all common contexts and report repeated drills, off-focus support slots, empty pressure slots, and swap shortages.

**Rationale:** Short sessions can hide thin catalog pools. Long sessions expose whether a focus has practice depth, not just one valid main drill.

**Downsides:** Overlaps with the audit grid unless framed as the executable test harness for it.

**Confidence:** 84%

**Complexity:** Medium

**Status:** Explored

### 6. Source-Backed Catalog Backlog Cards

**Description:** For each catalog gap, create a small backlog card with source hook, target configuration, slot filled, participant geometry, blockers, and trigger required.

**Rationale:** FIVB, BAB, and Volleyball Canada provide enough future material, but source-backed availability needs a disciplined conversion path before it becomes active catalog coverage.

**Downsides:** Documentation can become overhead unless it feeds the next authoring pass.

**Confidence:** 80%

**Complexity:** Low

**Status:** Explored

### 7. Variant-Level Provenance And Adaptation Checklist

**Description:** Track source drill name, source participant assumptions, adaptation confidence, and "what changed for solo/pair" at the variant level.

**Rationale:** The current gaps are mostly variant-level. A drill family can exist while one context remains empty because the eligible variant is absent, inactive, or filtered out.

**Downsides:** Adds schema or documentation overhead; best paired with the audit and backlog rather than shipped alone.

**Confidence:** 76%

**Complexity:** Medium

**Status:** Explored

## Rejection Summary

| Idea | Reason rejected |
| --- | --- |
| Just add lots of drills | Source-backed depth matters, but uncontrolled content growth violates the current cap discipline. |
| Hide all thin focus chips immediately | Too strong before the repo quantifies actual pools and decides product posture. |
| Treat focus as the whole session | Conflicts with current Tune today requirements and warmup/wrap invariants. |
| Expand to attack or scenario chips now | Distracts from pass/serve/set coverage and is already deferred by the skill-scope policy. |
| Rely on Recommended fallback | Avoids failures but under-delivers on the D135 user ask. |
| Use raw total drill count | Misleading because feasibility filters, participant variants, equipment, and swap depth are what matter. |
| Build a 100-drill saturation catalog | Interesting benchmark, but too expensive for M001 and not evidence-fired. |
| No-swap mode | Makes focused sessions less flexible exactly when thin pools need transparency. |

## Recommended Brainstorm Direction

Brainstorm all seven survivors as one integrated requirements problem:

> Define a source-backed focus coverage and catalog-readiness system that tells Volleycraft when Passing, Serving, and Setting are buildable, thin, or unavailable across setup contexts, and that turns the highest-priority gaps into disciplined backlog items without authoring new drills prematurely.

The likely requirements doc should decide:

- what "enough drills" means per focus/configuration
- whether Serving gets a special first credibility pass
- how support slots should reinforce Serving and Setting
- how long-session readiness is tested
- how future source-backed drill candidates are captured without activating them

## Handoff

Use `/ce-brainstorm` to turn the integrated direction above into requirements. Do not skip directly to `/ce-plan`; planning would still need to invent thresholds, scope boundaries, and product posture.
