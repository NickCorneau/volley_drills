---
id: M001
title: Solo Session Loop
status: draft
stage: planning
type: milestone
authority: M001 thin-slice scope, acceptance evidence, pre-build validation gate
summary: "Thinnest believable end-to-end solo session loop for pass / serve-receive."
last_updated: 2026-04-12
depends_on:
  - docs/prd-foundation.md
  - docs/decisions.md
  - docs/roadmap.md
  - docs/discovery/phase-0-wedge-validation.md
decision_refs:
  - D6
  - D21
  - D41
  - D43
  - D57
  - D69
  - D70
  - D71
  - D90
  - D91
open_question_refs:
  - O6
  - O7
---

# M001: Solo Session Loop

## Agent Quick Scan

- Use this doc when you need M001 scope, current gate status, acceptance evidence, or the smallest reliable statement of what belongs in the first build.
- Status: validation phase. A runnable v0a prototype exists under `app/`. Full M001 implementation is still blocked on the pre-build validation gate.
- In scope: starter session assembly, courtside run flow, one-minute review, deterministic adaptation, and write-as-you-go local persistence.
- Not for: implementation-level Dexie details, full sync architecture, or coach clipboard build work.
- Primary blockers: `O4`, `O5`, `O6`, `O7` in `docs/decisions.md`.

## Why this milestone exists

The product promise is to help a self-coached beach player build and run a better practice in minutes, then make the next session smarter using what actually happened.

Before any richer planning, coaching, or adaptation features matter, the product needs one believable end-to-end loop that works for a single user under real constraints.

The latest planning synthesis narrows that further:

- the lead activation path is solo-first
- the first trusted skill track is passing fundamentals for serve receive
- the first adaptation model must be purely rules-based and deterministic
- the broader Phase 1 product may grow into a shallow week-shape or next-N sessions queue and a minimal weekly receipt, but this milestone still defines the thinnest believable loop; coach overlays are gated on M001 repeat-usage evidence

## Milestone goal

Define the first implementation-ready slice that lets one self-coached user:

1. set a training context
2. assemble a realistic session from structured templates and drills
3. edit that session quickly
4. run it courtside on mobile
5. capture a one-minute review
6. return to the next session with minimal rebuild

## Current planning stance

This is a planning-stage milestone charter, not an active build brief.

Use it to lock the thin slice and the acceptance evidence before implementation planning begins.

Roadmap language about "no code yet" still applies. This document defines what should get built once that gate clears; it does not mean implementation has started.

## Pre-build validation gate (2026-04-12)

Research evidence (see `docs/research/beach-training-resources.md` and `research-output/m001-pre-build-validation-research.md`) identifies behavioral and contextual unknowns that must be resolved before M001 moves to implementation. The core risk is not "can we assemble a passing session" — content is abundant — but whether the target user will complete a phone-mediated loop courtside and return next week.

M001 should not move to active build until the following are validated through a thin prototype / concierge test (see `docs/discovery/phase-0-wedge-validation.md` for the concrete program):

- **Phone courtside viability**: users actually pull out their phone on sand and follow a structured runner (vs. memory, printouts, or going tech-free).
- **Solo feasibility**: the operational definition of "solo" works for users' real environments. Solo passing often depends on a wall or rebounder that many beaches lack; environment/equipment must be a first-class input.
- **Review completion**: the <60s post-session review is actually completed when tired/sweaty, and its signals produce a believable next-session adaptation.
- **Second-session retention**: the validation cohort meets the D91 repeat-use bar within 14 days. Stated interest or waitlists are not sufficient evidence.
- **Safety baseline**: initial sessions and deload logic have been reviewed by at least one coach or sports physio.

## Target user and mode

- Primary path: self-coached solo user
- Required fallback: lightweight pair fallback so the system does not overfit to solo-only assumptions
- Deferred: richer coach-led, coach-organizer, and small-group workflows
- Initial skill anchor: passing fundamentals for serve receive

## In scope

- Ultra-lean first-run activation: skill level + today's player count, with passing fundamentals for serve receive as the default first focus
- A ready-to-run `10-15` minute starter session that feels like a real practice, not a setup wizard
- Broader context capture only when needed for edit or follow-on sessions: time profile, net, wall/fence, equipment, wind, and other trust-critical filters
- Mandatory pre-session safety check: binary pain flag ("pain that changes how you move?"), training recency, and contextual heat awareness CTA (D82-D83)
- Deterministic session assembly from fixed archetypes plus ranked fill from a structured drill library
- No AI in the critical path for session assembly or editing
- A starter drill pack centered on passing fundamentals for serve receive with solo-first drills and pair-compatible variants where appropriate
- Session validation rules consistent with `docs/prd-foundation.md`: duration totals, player-count fit, and intensity/level fit
- Quick edit actions: swap, reorder, duration tuning, solo/pair variant changes
- Courtside run mode with large controls and minimal tap overhead
- One-minute review with sRPE, one skill metric, and a short note
- Write-as-you-go local persistence for in-progress session and pending review state
- Duplicate/edit previous session as the first repeat-use mechanism
- Rules-first next-session adjustment logic based on one session-defined metric and session load, with binary-scored pass success as the default pass metric and without changing both difficulty and volume at once
- sRPE-load (RPE × duration) as the internal load primitive for between-session adaptation, with conservative change caps and no back-to-back hard sessions (D84)
- Mandatory warm-up and cool-down blocks in every session; users can shorten but not remove them (D85)
- Stop/seek-help triggers accessible offline from any session state (D88)
- Conservative defaults when preparedness is unknown: new users, first sessions, and returning-after-gap users get scaled-down volume/intensity (D87)
- General training support positioning with standard "not medical advice" copy (D86)
- Minimum instrumentation for activation, run completion, and review completion, without a dedicated analytics surface in the milestone itself

## Explicitly out of scope

- Multi-week skill tracks as part of the first implementation slice
- Coach-to-client workflow as a first-slice requirement
- Full coach-organizer tooling
- Broad small-group operations
- Open-ended AI coach chat
- AI-generated training plans of any kind
- Deep analytics, benchmarking, or social surfaces
- Demo clips or GIFs in the run flow
- Final multi-device sync and backend architecture decisions
- ACWR-based risk scoring or "danger zone" messaging
- Deep recovery analytics (HRV, wearable integrations)
- Return-to-play guidance for specific injuries
- Full soreness questionnaire or multi-item wellness survey (binary pain flag IS in scope; see D81/D83)

## Planning defaults and assumptions

- Use solo-first as the implementation planning default unless validation overturns it.
- Treat pair fallback as a trust requirement, not a separate product line. For launch drills, use both metadata and curated variants where player mode changes execution.
- Use passing fundamentals for serve receive as the anchor skill track for examples, starter drill packs, and first-run defaults.
- Optimize the new-user path for `<= 3` minutes to a believable starter session, not full intake completeness.
- Use the hybrid "fixed archetype + ranked fill" assembly model: select an archetype based on context, then fill each block via deterministic hard-filter + soft-scoring ranking. Hard filters: participant count, required equipment, safety exclusions. Soft scoring: skill tag match, spacing penalty for recent repeats, environment fit, progression fit. (D60)
- Model drills as families with parameterized variants (target size, distance, constraint type, rep count, rest ratio) so progression works without inventing new drills. (D62)
- Blended practice order within sessions: blocked/constant early (quality reps, technique), constrained variability later (game-like, scoring). (D68)
- Fallback when constraints eliminate too many drills: drop soft requirements (realism) first, allow proxy tags (movement proxy, self-toss) second, offer one-tap "broaden constraints" third. (D66)
- Deload sessions explicitly reduce serving and jumping volume when those actions are present, not just generic difficulty reduction. (D64)
- AI must not be used for session generation or load planning.
- Treat weak-connectivity reliability as a user outcome to preserve, while deferring exact sync architecture to implementation planning.
- Minimum context capture fields for session assembly use one structured tap step: current player count (current M001 scope: 1 or 2), time budget (15/25/40+ min), net available, wall/fence available, ball count (1 vs many), cones available, and wind level (calm / light wind / strong wind). These become hard-filter inputs for the assembly model.
- Pre-session safety check (separate from context capture): binary pain flag + training recency + contextual heat CTA. These gate and shape the session, not the assembly filters.
- Official iPhone support baseline for M001 is `iOS 17+`.
- Treat `Add to Home Screen` on `iOS 18.4+` as the primary tested posture for repeat-use trust, while keeping first-run usable in Safari with no install gate.

## Acceptance evidence for this milestone

This milestone is ready to hand to implementation planning when:

- the thin slice is unambiguous enough that it can be described without pulling in multi-week track or coach tooling
- a new user can reach a believable starter session in `<= 3` minutes with no account or permission gate
- the courtside run flow and outdoor legibility defaults are explicit enough to design and test
- the review step is small enough to plausibly complete in under one minute
- the trust invariants for offline durability, update safety, migration safety, and deterministic adaptation are explicit enough to verify without guessing
- the solo-first path still preserves believable pair fallback
- the first-run flow does not require teaching a multi-bucket pass-quality rubric before one useful session is complete
- the safety contract (pre-session check, sRPE-load, warm-up/cool-down, stop triggers, conservative defaults, regulatory positioning) is specified in the adaptation rules and run flow specs
- `docs/roadmap.md`, `docs/prd-foundation.md`, and `docs/vision.md` no longer disagree on what belongs in the first slice

## Design artifacts that should exist before implementation

- A simple courtside run flow spec: `docs/specs/m001-courtside-run-flow.md`
- A review micro-spec with required vs optional fields: `docs/specs/m001-review-micro-spec.md`
- A navigation / home-state note for the first mobile surface: `docs/specs/m001-home-and-sync-notes.md`
- A deterministic session-assembly spec for archetypes, ranking, fallbacks, and swap behavior: `docs/specs/m001-session-assembly.md`
- A short sync-state note explaining the user-visible expectation under weak connectivity: included in `docs/specs/m001-home-and-sync-notes.md`
- A rules-first adaptation default for the pass-first loop: `docs/specs/m001-adaptation-rules.md`
- A quality-and-testing note that makes M001 trust invariants and minimum verification explicit: `docs/specs/m001-quality-and-testing.md`
- A validation scorecard and dual-wedge interview pack: `docs/discovery/phase-0-wedge-validation.md` and `docs/discovery/phase-0-interview-guide.md`

## Post-M001 sequencing (decided 2026-04-12)

The post-M001 ordering is no longer open. See `docs/roadmap.md` Phase 1.5 and `docs/decisions.md` D72-D75.

- **Self-coached longitudinal layer (always ships):** a shallow one-week shape or next 2-6 sessions queue, plus a minimal weekly receipt (planned-vs-completed, one load proxy, one skill proxy). This is a retention feature, not an analytics dashboard.
- **Coach clipboard (gated):** assign a structured session, see whether it happened, get a tiny outcome signal, adjust the next one. Development should not begin until M001 shows strong repeat usage (multiple sessions per user across weeks) and review completion above 50 percent.
- **If the gate does not clear:** focus entirely on hardening the self-coached loop and data ownership before extending to any coach workflow.

## Open questions carried forward

- What does "solo" operationally mean for passing fundamentals — on sand with only a ball, at-home with a wall, or near a rebounder/net? (See O4 in `docs/decisions.md`)
- Should audio/haptic cues be part of the runner from day one to reduce phone-touch frequency? (Research suggests the runner should be resilient to the user ignoring it for minutes at a time.)

## Working defaults already decided

- Seed drill-library target: 20-25 drill families for launch credibility
- Validation-phase stack: web-first PWA with local-first storage
- Pass-first adaptation defaults live in `docs/specs/m001-adaptation-rules.md`
- M001 review stays lightweight: sRPE plus one skill metric, without soreness or wellness fields (the binary pain flag is a pre-session safety gate, not a review input)
- Safety contract: pre-session pain flag + training recency, sRPE-load as load primitive, mandatory warm-up/cool-down, stop/seek-help triggers, conservative defaults for unknown preparedness, general training support positioning (D82-D88)

## Review questions

- Is this truly the smallest useful slice, or is anything here still trying to prove too much at once?
- Does the first-run flow ask for any input that could safely be deferred until after the first useful session?
- Does the milestone preserve the shared backbone without dragging richer coach-led workflows into the first build?
- Would a self-coached player trust this loop after one session, or are we missing a key fallback, a more honest solo-transfer explanation, or a clearer rules-based adaptation explanation?
