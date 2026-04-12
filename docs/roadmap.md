---
id: roadmap
title: Roadmap
status: draft
stage: planning
type: core
authority: phase sequencing, exit criteria, local-first capability ladder, validation experiments, risk mitigations
summary: "Phased delivery plan with exit criteria, validation experiments, and local-first capability ladder."
last_updated: 2026-04-12
depends_on:
  - docs/vision.md
  - docs/prd-foundation.md
  - docs/decisions.md
---

# Roadmap

## Agent Quick Scan

- Use this doc for phase sequencing, exit criteria, validation experiments, and what must happen before or after M001.
- Not this doc for product principles, decision status, or detailed object-model contracts; use `docs/vision.md`, `docs/decisions.md`, and `docs/prd-foundation.md` for those.
- If a task changes milestone ordering, validation gates, or post-M001 sequencing, update this doc and then sync any affected milestone or PRD language.

## Roadmap intent

This roadmap builds one product on one shared backbone with two intentionally connected paths:

- **Primary direction (self-coached)**: amateur beach players and pairs training without a coach, with solo as the lead activation path.
- **Secondary paid path (coach-led)**: coach-to-client or coach-led workflows layered onto the same structured planning and review loop.

The product is one system, not two apps. The self-coached path is the current first implementation target (see `docs/prd-foundation.md`), while Phase 0 continues to validate how far the coach-facing path should go and what paid model it should support.

The most plausible first coach-facing extension is a **coach clipboard**: assign a structured session, see whether it happened, get a tiny outcome signal, and adjust the next one. This extension is gated on M001 proving strong repeat usage and review completion for self-coached users. It should not enter active development until that gate clears.

## Local-first capability ladder

The product is local-first by principle (see `docs/vision.md`). The phases below sequence the local-first capabilities from simplest to most complex:

1. **Phase 1 — Single-device trust and courtside reliability.** The device is the only copy. All core workflows work without any network connection. Data is stored locally via IndexedDB/Dexie.
2. **Phase 1.5 — Ownership, export, and optional cloud-peer sync.** Users can export their full training history in a durable format. An optional cloud peer may store an encrypted backup and relay updates across devices, but it is never the source of truth.
3. **Phase 2 — Async coach share and review.** Coaches receive and comment on structured plan snapshots. Sharing is proposal-based, not live co-editing.
4. **Later — Real-time collaboration, only if validated.** CRDTs or similar technology adopted only when the product proves a need for concurrent multi-user editing on the same object.

## How to use this roadmap

This document is phase-level. It should guide sequencing and validation, but execution should happen through milestone charters under `docs/milestones/`.

Phases are not 2-week sprints. Milestones are outcome-based slices that can complete, block, or be deferred independently.

Current repo posture is still discovery-first and docs-first. Do not treat phase dates as a command to start implementation before the explicit gates in this roadmap and the milestone charters are met.

## Shared product backbone

The shared loop is:

- set goal
- assemble session from deterministic archetypes, templates, and constraints
- run session courtside
- review quickly
- adapt next session

This stays constant across both wedges.

## Product phases

### Phase 0 (now-45 days): Self-Coached Validation And Coach Workflow Discovery

Goal: validate the self-coached primary loop while learning which coach-facing workflow is worth layering onto the same backbone.

Scope:

- Discovery-first, not build-first
- Shared workflow prototype or concierge flow
- Separate landing copy, interview scripts, and scorecards for:
  - self-coached user
  - coach-led / coach-to-client user
- Shared drill and session object model kept lightweight enough for both wedges
- Manual or thin-prototype evidence capture is acceptable; productized analytics are not required in this phase
- If a prototype is built, keep it to one shared run/review loop and avoid fully separate product paths

Evidence standard:

Research (see `docs/research/beach-training-resources.md`, pre-build validation findings) establishes that stated interest and waitlists are insufficient evidence for building M001. The primary unknowns are behavioral and contextual — whether users will use a phone courtside, whether solo sessions work in real environments, and whether they return next week. The evidence bar for the self-coached path should be **actual repeat behavior** (second-session retention), not enthusiasm.

A compressed 1–2 week riskiest-assumptions test using a thin prototype / concierge loop is the recommended validation vehicle for the self-coached path. See `docs/discovery/phase-0-wedge-validation.md` for the concrete program.

Exit criteria:

- At least 5-8 meaningful validations for the self-coached path, including courtside field observations (not just interviews)
- At least 5 meaningful coach-facing validations
- Clear comparison of:
- self-coached activation speed and **actual repeat behavior** (measured against `D91` within 14 days)
  - coach willingness to pay and workflow fit
  - trust in deterministic generation and optional copy explanations
- Use path-specific scorecards, not one blended metric set:
  - self-coached: "Can I get a useful solo session and want to use this again next week?" — validated by observed repeat use, not stated intent
  - coach-led: "Does this help me plan, adjust, and justify progress for a real athlete without forcing a new system?"
- Validated that phone courtside is viable for the target user (field-tested in real sun/sand conditions)
- Operational definition of "solo" resolved: what environment and equipment the solo path assumes
- At least one coach or sports physio review of initial sessions and deload logic
- Decision on:
  - the first coach-facing extension to support
  - whether premium coaching should be direct coach-to-client, centralized expert access, or deferred
- If coach demand is promising, carry it forward as a shared-backbone extension rather than a product fork

### Phase 1 (45-120 days): Shared-Core MVP — Single-Device Trust And Courtside Reliability

Goal: ship the smallest useful self-coached version while preserving the shared backbone for coach-led extension. Full scope defined in `docs/prd-foundation.md` MVP section.

Local-first focus: device-primary storage, zero server dependency for the core loop, and persistent browser storage where supported.

Current planning default for the first implementation-ready milestone: solo-first flow with lightweight pair fallback and a passing-fundamentals-for-serve-receive first track. The broader MVP envelope may grow into a shallow next-N session queue and a minimal weekly receipt, but coach-led overlays are gated on M001 repeat-usage evidence (see Roadmap intent).

Scope:

- Fast first-run activation plus progressive intake support
- Constraint-first deterministic session generation
- Default pass-first `10-15` minute starter session for new users, with solo-first as the activation path and pair fallback available before run
- No AI in session generation/editing; optional AI for copy-only explanation of rules
- Structured drill library with generator-ready metadata, drill families, and variants (see `docs/prd-foundation.md`)
- Mobile run mode meeting courtside UX requirements (see `docs/prd-foundation.md` and `docs/research/beach-training-resources.md`)
- One-minute review (sRPE plus one skill metric plus notes)
- Duplicate/edit previous sessions
- Session validation (block durations, participant and equipment feasibility, workload fit)
- Shallow longitudinal layer: a one-week shape or next 2-6 sessions queue, not a full calendar or periodized season builder
- Minimal weekly receipt: planned-vs-completed sessions, one load proxy (session RPE x minutes), one skill proxy; framed as a retention feature, not an analytics dashboard
- Session object model kept extensible for future coach clipboard sharing, but no coach-facing UI or admin in Phase 1
- Device-primary local storage via IndexedDB/Dexie with no backend dependency; the entire core loop works offline
- Persistent browser storage requested where supported, with user copy that distinguishes `Saved on device` from any future backup or sync state

Exit criteria:

- Median time-to-first-useful session start under `3` minutes for new users
- At least `40` percent of new users complete the starter session
- Median time-to-first-session-created under 5 minutes
- Median time-to-ready-to-run under 2 minutes for repeat users
- At least 50 percent of completed sessions include review completion
- Strong repeat usage signal from the primary wedge
- Users trust deterministic drafting because outputs are editable and strictly follow safety rules
- At least one user can queue a week of sessions and see a weekly receipt without the experience degrading the quick session loop
- The full run/review loop works with no network connection
- An in-progress session can be resumed after app backgrounding or relaunch without silent loss of the active block

### Phase 1.5 (120-210 days): Ownership, Export, Adaptation, And Gated Coach Clipboard

Goal: deepen self-coached longitudinal value, give users durable data ownership, and — if the M001 repeat-usage gate clears — ship the first coach clipboard extension on the same backbone.

Local-first focus: export/backup guarantees, optional cloud peer for cross-device sync.

Validation gate for coach clipboard: Phase 1.5 coach work should only begin if M001 evidence shows strong repeat usage (multiple sessions per user across weeks) and review completion above 50 percent. If the gate does not clear, Phase 1.5 should focus entirely on hardening the self-coached loop and data ownership.

Scope (self-coached, always):

- Slightly more opinionated week-shape planning and transparent progression/deload suggestions
- Baseline tests for core skills
- Constraint-aware substitutions by intent
- Full training-history export in a standard durable format (JSON at minimum)
- Optional cloud peer for encrypted backup and cross-device relay; the cloud peer is never the source of truth

Scope (coach clipboard, gated):

- Coach assigns a structured session from the same drill library and constraints
- Athlete runs it courtside and submits the standard <60s review
- Coach sees whether the session happened, the tiny outcome signal (compliance, load, skill proxy), and can approve or modify the next session's progress/hold/deload
- Async, proposal-based sharing on local-first rails; no live co-editing, no roster admin, no payments

Exit criteria:

- Self-coached users who use the weekly receipt retain meaningfully better than session-only users
- Users report higher confidence in what to train next
- Safety and trust complaints remain low
- If coach clipboard shipped: coaches can assign, review, and adjust sessions without forcing a separate product surface
- Users can export their complete training history without data loss
- If a cloud peer is added, the app continues to function fully when the peer is unreachable

Note:

- These are the phase gates. Broader product KPI hypotheses live in `docs/prd-foundation.md`.

### Phase 2 (210+ days): Coach Share, Second Wedge Expansion, And Optional Advanced Features

Goal: extend the validated backbone to the second wedge after the primary loop is proven, and introduce async coach-player sharing.

Local-first focus: async coach share and review on local-first rails. Real-time collaborative editing is deferred until validated.

Candidate scope:

- Async coach share and review: coaches receive structured plan snapshots, comment, and propose changes without live co-editing
- Richer coach-led and coach-organizer support
- Optional premium coach access if the model proves real demand
- Optional video import hooks
- Deeper analytics and benchmarking

Guardrail:

- No expansion should degrade the speed, reliability, or simplicity of the core run loop.
- Coach sharing must not make the cloud a required dependency for the solo user's core loop.
- Real-time collaborative editing (CRDTs, OT) is only adopted if the product validates a concrete need for concurrent multi-user editing on the same object.

## P0 - Must exist for early validation

- Shared training context model
- Self-coached validation scorecard and coach-facing scorecard
- Separate framing and interview scripts for each path
- Manual session-planning artifacts or thin prototype for the shared loop
- Notes and lightweight evidence capture sufficient to compare self-coached repeat signal and coach willingness to pay
- Clear record of what was concierge-assisted versus product-driven

## P1 - Shared-core follow-ons (ordered)

- Shallow week-shape or next-N session queue
- Minimal weekly receipt (compliance, load proxy, skill proxy)
- Baseline skill tests
- Constraint-aware swap recommendations
- Template packs for common intents
- Coach clipboard (gated on M001 repeat-usage evidence): assign, review completion, adjust next session

## P2 - Later expansion

- Centralized coach marketplace / expert access
- Collaboration and sharing features
- Video/stat ecosystem hooks
- Rich longitudinal analytics
- Heavier gamification

## Validation experiments

### Pre-build (Phase 0 — riskiest assumptions first)

- Phone courtside viability test: will target users actually pull out their phone on sand and follow a structured runner, or do they prefer memory, printouts, or going tech-free?
- Solo feasibility test: can users complete a solo passing session in their real environment, or does "solo" depend on a wall/rebounder that many beaches lack?
- Second-session retention test: does the validation cohort meet the `D91` repeat-use bar within 14 days without redefining success around softer signals? (The critical gate for M001 green-light.)
- Reflection compliance test (in-context): does one-minute review hit at least 50 percent completion when the user is tired and sweaty courtside?
- Offline relevance test: do target users actually hit connectivity issues at their training locations often enough to justify offline-first architecture cost in M001?

### Product-level (Phase 0 and Phase 1)

- Self-coached usability test: can a solo player or pair get to a believable session without outside help?
- First-run activation test: can a new user reach a believable starter session in `<= 3` minutes with only skill level and today's player-count choice up front?
- Onboarding flow test: does a `2-screen` versus `3-screen` setup improve trust without hurting activation speed?
- Coach clipboard usability test: can a coach assign a structured session, see whether it happened, get a tiny outcome signal, and adjust the next one — without roster/admin/payments/video?
- Weekly receipt retention test: does a planned-vs-completed weekly summary plus one load and one skill proxy keep self-coached users coming back more than session-only users?
- Trust test: are deterministic drafts accepted, and do users understand the 'See why' explanations?
- Coach commercial model test: is direct coach-to-client, centralized expert access, or neither the more believable premium path?

## Risks and mitigations

- Self-coached loop gets diluted by coach requirements: keep the shared backbone, but stage coach overlays after the core run/review loop is trusted
- Coach demand pushes toward a marketplace too early: validate paid coach workflows before building supply/demand mechanics
- Over-complex UX: keep screens task-first and remove low-frequency controls
- Weak data quality: enforce minimum metadata and validation at object boundaries (12 required drill fields)
- AI reliability concerns: exclude generative AI from load planning; use purely deterministic rules
- Logging fatigue: keep review capture under 60 seconds and pre-fill where possible
- Activation friction: defer nonessential intake, sign-up, permissions, and rich metric education until after the first quick win
- Scope creep: do not build rich coach admin, marketplace, or media extras before the shared self-coached loop is trustworthy
- The next concrete milestone after doc consolidation is an implementation-ready plan for `M001`, followed by a thin prototype on the chosen web stack

## Cross-references

- Product principles: `docs/vision.md`
- MVP scope, object model, and drill metadata: `docs/prd-foundation.md`
- Research, periodization, competitive landscape, UX specs: `docs/research/beach-training-resources.md`
- Raw deep research: `research-output/beach-volleyball-self-coached-prd.md`

## For agents

- **Authoritative for**: phase sequencing, exit criteria, local-first capability ladder, validation experiments, risk mitigations.
- **Edit when**: phase sequencing, exit criteria, or validation experiments change.
- **Belongs elsewhere**: product scope and object model (`prd-foundation.md`), principles (`vision.md`), specific decisions (`decisions.md`), milestone-level scope (`docs/milestones/`).
- **Outranked by**: `vision.md`, `decisions.md`, and `prd-foundation.md`.
- **Key pattern**: phases use prose headers (`### Phase 0`, `### Phase 1`, etc.). Reference them as `Phase 0`, `Phase 1`, `Phase 1.5`, `Phase 2` when cross-linking.