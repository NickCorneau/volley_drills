---
id: M001
title: Solo Session Loop
status: draft
stage: planning
type: milestone
authority: M001 thin-slice scope, acceptance evidence, pre-build validation gate
summary: "Thinnest believable end-to-end solo session loop for pass / serve-receive."
last_updated: 2026-04-19
depends_on:
  - docs/prd-foundation.md
  - docs/decisions.md
  - docs/roadmap.md
  - docs/discovery/phase-0-wedge-validation.md
  - docs/research/d91-retention-gate-evidence.md
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
  - D123
  - D124
open_question_refs:
  - O2
  - O6
  - O7
---

# M001: Solo Session Loop

## Agent Quick Scan

- Use this doc when you need M001 scope, current gate status, acceptance evidence, or the smallest reliable statement of what belongs in the first build.
- Status: v0b build in progress. A runnable v0a prototype exists under `app/`; v0b is the field-test artifact (`D119`). Full M001 implementation is gated on D91 field-test evidence against v0b.
- In scope: starter session assembly, courtside run flow, one-minute review, deterministic adaptation, and write-as-you-go local persistence.
- This doc distinguishes **D91 artifact compromises** from the intended M001 product contract so v0b cuts are not mistaken for long-term product rejection.
- Not for: implementation-level Dexie details, full sync architecture, or coach clipboard build work.
- Primary blockers: `O4`, `O5`, `O6`, `O7` in `docs/decisions.md`.

## Why this milestone exists

The product promise is to help a self-coached beach player build and run a better practice in minutes, then make the next session smarter using what actually happened.

Before any richer planning, coaching, or adaptation features matter, the product needs one believable end-to-end loop that works for a single user under real constraints and feels good enough to want again.

The latest planning synthesis narrows that further:

- the lead activation path is solo-first
- the first trusted skill track is passing fundamentals for serve receive
- the first adaptation model must be purely rules-based and deterministic
- the broader Phase 1 product may grow into a shallow next-N sessions queue and a minimal weekly receipt, but this milestone still defines the thinnest believable loop; coach overlays stay downstream of the post-M001 self-coached follow-on

## Milestone goal

Define the first implementation-ready slice that lets one self-coached user:

1. set a training context
2. assemble a realistic session from structured templates and drills
3. edit that session quickly
4. run it courtside on mobile
5. capture a one-minute review
6. return to the next session with minimal rebuild
7. leave the user clearer about what to do next and willing to come back

## Current planning stance

A v0a validation prototype exists under `app/`; v0b build is in progress as the D91 field-test artifact (`D119`). M001 full implementation remains gated on D91 field validation against v0b (O4-O7).

## D91 artifact vs M001 product contract

v0b is intentionally smaller and quieter than the intended product so the D91 field test can answer the behavioral question cleanly.

**Treat these as D91 artifact simplifications, not long-term product rejection:**

- no dedicated "See why this session was chosen" surface
- minimum-honest summary copy instead of richer deterministic reasoning
- no weekly receipt, minimal accumulation, and no session-history surface
- first-run flow that still risks feeling more form-first than recommendation-first

**The M001 product contract still includes:**

- recommendation-first first-run and repeat-start posture (`D123`)
- visible deterministic reasoning where it helps trust
- review and summary that leave a clear next step
- a named post-M001 self-coached follow-on focused on weekly confidence before coach-connected work (`D124`)

## Pre-build validation gate (2026-04-12)

Research evidence (see `docs/research/beach-training-resources.md` and `research-output/m001-pre-build-validation-research.md`) identifies behavioral and contextual unknowns that must be resolved before M001 moves to implementation. The core risk is not "can we assemble a passing session" — content is abundant — but whether the target user will complete a phone-mediated loop courtside and return next week.

M001 should not move to full build until the following are validated through v0b field testing (`D119`; see `docs/discovery/phase-0-wedge-validation.md` for the concrete program):

- **Phone courtside viability**: users actually pull out their phone on sand and follow a structured runner (vs. memory, printouts, or going tech-free).
- **Solo feasibility**: the operational definition of "solo" works for users' real environments. Solo passing often depends on a wall or rebounder that many beaches lack; environment/equipment must be a first-class input.
- **Review completion**: the <60s post-session review is actually completed when tired/sweaty, and its signals produce a believable next-session adaptation.
- **Second-session retention**: the validation cohort meets the D91 repeat-use bar within 14 days. Stated interest or waitlists are not sufficient evidence. A bare D91 pass is permission to keep testing, not proof of durable value; require at least one enrichment signal (unprompted return, >48h-gap second session, or third-session / concrete scheduling commitment) before treating the loop as validated. See `docs/research/d91-retention-gate-evidence.md`.
- **Main-tool pull**: at least one tester shows a clear conviction or replacement signal (`I would use this instead of notes/PDFs/memory`, `I want the next session`, `I would miss this if it disappeared`) rather than only a one-off completion.
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
- Mandatory warm-up and Downshift blocks in every session; users can shorten but not remove them. Default warm-up is `Beach Prep Three` (~3 min); `Beach Prep Five` is the opt-in longer version; `Beach Prep Two` is a compliance fallback. Downshift is framed as transition and comfort, not recovery or injury prevention. (D85, D105)
- Stop/seek-help triggers accessible offline from any session state (D88)
- Conservative defaults when preparedness is unknown: new users, first sessions, and returning-after-gap users get scaled-down volume/intensity (D87)
- General training support positioning with standard "not medical advice" copy (D86)
- Minimum instrumentation for activation, run completion, and review completion, without a dedicated analytics surface in the milestone itself

## Explicitly out of scope

- 3+ player session assembly and drill selection (tracked as D101 for post-M001; real training groups are fluid but M001 handles 1-2 players only)
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
- Trusted repeat-use drafts use one structured tap step for the broader assembly context: current player count (current M001 scope: 1 or 2), time budget (15/25/40+ min), net available, wall/fence available, ball count (1 vs many), cones available, and wind level (calm / light wind / strong wind). These become hard-filter inputs for the assembly model after the first recommendation reveal; they are not the minimum before-value contract for a first-ever run.
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
- the first-run flow reveals a believable recommendation before it feels like a form
- the safety contract (pre-session check, sRPE-load, warm-up / Downshift, stop triggers, conservative defaults, regulatory positioning) is specified in the adaptation rules and run flow specs
- the user can understand why today's session fits and what the next step means without needing a dense dashboard
- the post-session handoff leaves the user with a clear next move and a reason to return
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

## Post-M001 sequencing (updated 2026-04-19)

The post-M001 ordering is no longer open. See `docs/roadmap.md`, `docs/decisions.md` `D124`, and the next milestone charter in `docs/milestones/m002-weekly-confidence-loop.md`.

- **M002 Weekly Confidence Loop (always first):** shallow next 2-6 session queue, minimal weekly receipt, visible carry-forward, and the smallest accumulation surfaces that make the app feel like the user's training home.
- **Coach clipboard (gated after the self-coached layer is stronger):** assign a structured session, see whether it happened, get a tiny outcome signal, adjust the next one. Development should not begin until the self-coached loop shows strong repeat usage and main-tool pull.
- **If the gate does not clear:** focus entirely on hardening the self-coached loop and data ownership before extending to any coach workflow.

## v0b implementation decisions (2026-04-15)

The following decisions constrain the first v0b implementation slice that builds on v0a:

- **D97**: Singleton `SessionDraft` — one current pre-start draft at a time, not multi-draft.
- **D98**: Constrained starter-template builder — context → archetype + time profile → fixed layout → curated drill mapping. Not full ranked-fill yet.
- **D99**: ~~Superseded~~ — pain/fatigue stays exclusively in SafetyCheck (D83). No Setup-level pain input.
- **D100**: Minimal `review_pending` home state — detect unreviewed executions and surface "Finish review" CTA.
- **D101**: 3+ player support tracked for post-M001; M001/v0b handles 1-2 players only.

v0b flow is `Home -> Skill Level (first open only) -> Today's Setup -> Safety -> Run -> Review -> Complete`. No Session Prep screen, no dedicated rationale/preview surface, and no Session History surface. See the v0b trimmed plan for details.

## Open questions carried forward

- What does "solo" operationally mean for passing fundamentals — on sand with only a ball, at-home with a wall, or near a rebounder/net? (See O4 in `docs/decisions.md`)
- Beyond the minimal foreground audio cue now in v0b (`D122`), what cue stack is actually helpful without becoming noisy or overbearing? (Research suggests the runner should be resilient to the user ignoring it for minutes at a time.)

## Working defaults already decided

- Seed drill-library target: 20-25 drill families for launch credibility
- Validation-phase stack: web-first PWA with local-first storage
- Pass-first adaptation defaults live in `docs/specs/m001-adaptation-rules.md`
- M001 review stays lightweight: sRPE plus one skill metric, without soreness or wellness fields (the binary pain flag is a pre-session safety gate, not a review input)
- Safety contract: pre-session pain flag + training recency, sRPE-load as load primitive, mandatory warm-up / Downshift, stop/seek-help triggers, conservative defaults for unknown preparedness, general training support positioning (D82-D88, D105)

## Review questions

- Is this truly the smallest useful slice, or is anything here still trying to prove too much at once?
- Does the first-run flow ask for any input that could safely be deferred until after the first useful session?
- Does the milestone preserve the shared backbone without dragging richer coach-led workflows into the first build?
- Would a self-coached player trust this loop after one session, or are we missing a key fallback, a more honest solo-transfer explanation, or a clearer rules-based adaptation explanation?
