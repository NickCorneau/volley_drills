---
id: M002
title: Weekly Confidence Loop
status: draft
stage: planning
type: milestone
authority: post-M001 self-coached follow-on scope, weekly confidence surfaces, and main-tool evidence bar
summary: "First post-M001 self-coached layer: visible carry-forward, shallow weekly planning, and minimal accumulation that make the app feel worth returning to."
last_updated: 2026-04-28
depends_on:
  - docs/vision.md
  - docs/prd-foundation.md
  - docs/roadmap.md
  - docs/milestones/m001-solo-session-loop.md
  - docs/decisions.md
decision_refs:
  - D15
  - D22
  - D26
  - D74
  - D123
  - D124
open_question_refs:
  - O2
  - O22
  - O23
  - O24
---

# M002: Weekly Confidence Loop

## Agent Quick Scan

- Use this doc for the first post-M001 self-coached milestone: the smallest layer that makes the app feel like a weekly training home rather than a one-session helper.
- This milestone comes **after** `M001` proves the runner loop and **before** any coach-connected build begins.
- In scope: visible carry-forward, shallow next-N planning, minimal weekly receipt, and lightweight accumulation.
- Not for: coach clipboard, full calendar planning, team identity, or rich analytics.

## Why this milestone exists

If `M001` proves that a self-coached user can get through one believable courtside loop, the next risk is not "can they finish a session?" but "does the product become their main training tool?"

A runner can be credible and still fail this bar. If the app ends each session like a dead-end timer, hides too much of its reasoning, or never lets the user feel what is accumulating over time, it will stay useful-but-optional.

This milestone exists to close that gap without turning the product into a dashboard, a spreadsheet, or a coach console.

## Milestone goal

Define the smallest self-coached follow-on that lets a returning user:

1. understand what happened this session
2. understand what the next step is
3. see the smallest useful weekly shape
4. feel that something is in the book
5. keep using the app as their training home without extra admin

## User and workflow target

- Primary user: self-coached amateur beach player who has already completed at least one session
- Core workflow: `Complete -> Home -> next session`
- Success posture: the app feels calm, trustworthy, and worth returning to weekly

## In scope

- A visible carry-forward from `Complete` and `Home` into the next session recommendation
- One bounded deterministic explanation for why the next session stayed the same, got lighter, or got harder
- Shallow next `2-6` session queue inside the existing flow, not a separate week planner or calendar surface
- Minimal weekly receipt: planned-vs-completed sessions, one load proxy, one skill proxy
- Lightweight accumulation surfaces that make "something is in the book" legible without becoming analytics-heavy
- Reuse existing session and review records to power carry-forward and the weekly receipt, with no standalone history surface in this milestone (the standalone history list is owned by **M001 Tier 2** — see `docs/milestones/m001-solo-session-loop.md` Tier 2 — so M002 layers carry-forward and the next-`N` queue on top of an already-existing list rather than introducing one here)
- Recommendation-first posture preserved: no new profiling gate that delays a believable next session

## Minimal surface contract

- `Complete` owns the immediate payoff: verdict, bounded reason, and next-step cue.
- `Home` owns the default next action: resume today's recommendation or continue from the carry-forward.
- `Queue` owns the shallow next `2-6` sessions view. It is secondary to `Home`, not a new planning destination.
- `Weekly receipt` owns the "something is in the book" readout: planned vs completed, one load proxy, one skill proxy.

This milestone does **not** add a standalone history route, a calendar planner, or a generalized planning surface. The standalone history list is owned by **M001 Tier 2**, not M002.

## Explicitly out of scope

- Coach clipboard or any coach-facing UI
- Full periodized calendar planning
- Durable `Team` object or persistent pair identity
- Rich analytics, benchmarking, or dashboards
- Open-ended AI coach chat
- Marketplace, academy, or roster tooling

## Planning defaults and assumptions

- Keep the surface calm. This milestone should deepen the product without making it feel heavier.
- Weekly confidence matters more than rich history. Show only the smallest layer that changes what the user does next.
- For M002, the planning metaphor is a shallow next `2-6` session queue. Broader week-shape or planner work stays in Phase 1.5 / `O2`.
- A weekly receipt is a confidence and investment surface, not an analytics destination.
- Deterministic reasoning should stay one-line and useful. Do not ship explanation density for its own sake.
- Use only already-captured session and review data for the weekly receipt and carry-forward. No new baseline-test flow, skill-assessment intake, or PoST framing in this milestone.
- The core quick-start loop must remain intact. If a new longitudinal surface slows session start or adds setup friction, it failed the milestone.

## Planning readiness

This milestone is ready to hand to implementation planning when:

- a returning user can see what to do next without rebuilding from scratch
- the next-step explanation is specific enough to trust and small enough not to feel like homework
- the queue and weekly receipt each have one clear job and do not require a new planner or history surface
- the coach clipboard is still clearly downstream of this self-coached layer, not competing with it

## Post-build validation

After implementation, this milestone is working if:

- the extra longitudinal layer does not degrade quick-start speed or review completion
- the weekly surface feels useful without turning into a dashboard
- users reuse the suggested next-step path rather than rebuilding from scratch
- users actually open and use the queue / weekly receipt rather than ignoring it
- at least one user reports the product replaced or meaningfully reduced notes, PDFs, or memory as their training workaround

## Likely design artifacts

Before implementation planning, this milestone likely needs:

- a shallow planning / weekly confidence spec
- a minimal weekly receipt / accumulation spec
- a home / complete carry-forward spec that covers next-step reasoning

Whether those live as one spec or a small cluster depends on how much the surfaces share state and copy.

## Review questions

- What is the smallest accumulation layer that makes the app feel like a training home?
- Which part of the weekly view actually changes behavior, and which part is dashboard noise?
- How much explanation is enough to build trust without slowing the loop down?
- What should remain hidden until the user asks for more detail?
