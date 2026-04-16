---
id: v0-prototype-ladder-design
title: V0 Prototype Ladder Design
status: draft
stage: planning
type: spec
summary: "Comparative EDD for the v0 prototype ladder: validation runner, starter loop build target, and repeat loop."
authority: "V0 stage naming, prototype boundaries, state coverage, and gate logic connecting Phase 0 validation to the first build target."
last_updated: 2026-04-12
wireframe_assets: assets/wireframe-v0a-*.png, assets/wireframe-v0b-*.png, assets/wireframe-*.png
depends_on:
  - docs/vision.md
  - docs/decisions.md
  - docs/prd-foundation.md
  - docs/roadmap.md
  - docs/milestones/m001-solo-session-loop.md
  - docs/discovery/phase-0-readiness-assessment.md
  - docs/discovery/phase-0-wedge-validation.md
  - docs/specs/m001-courtside-run-flow.md
  - docs/specs/m001-home-and-sync-notes.md
  - docs/specs/m001-review-micro-spec.md
  - docs/specs/m001-adaptation-rules.md
  - docs/specs/m001-session-assembly.md
  - docs/specs/m001-quality-and-testing.md
decision_refs:
  - D74
  - D82
  - D83
  - D89
  - D90
  - D91
  - D92
  - D93
  - D94
  - D95
  - D96
open_question_refs:
  - O6
  - O7
---

# V0 Prototype Ladder Design

## Agent Quick Scan

> **Partially superseded (2026-04-16).** This doc predates `D97`-`D98` (no Session Prep screen in v0b), `D119` (v0b is the D91 field-test artifact, not a post-gate build), and the D94 palette update in `docs/decisions.md`. Where it disagrees with `docs/plans/2026-04-12-v0a-to-v0b-transition.md` or `docs/milestones/m001-solo-session-loop.md`, those docs win. The state coverage matrix and ladder concept remain useful context.

- Use this doc for `v0a` vs `v0b`, prototype boundaries, and the shared state coverage matrix.
- This doc reconciles newer decision-log canon against older PRD and discovery wording.
- This is not the implementation plan. It tells us what to build first and what can stay stubbed.
- `Runner Probe`, `Starter Loop`, and `Repeat Loop` are capability steps on one product backbone, not separate apps.
- `D91` is the authoritative M001 go/no-go threshold. Older discovery thresholds are supporting context only.

## Purpose

Define the comparative engineering design for the v0 prototype ladder:

- what the Phase 0 validation artifact must prove
- what the post-gate build target actually is
- which user states and trust contracts each prototype must cover
- how to move from validation evidence to the first implementation slice without widening scope

## Use This Doc When

- deciding whether the next artifact is `v0a` or `v0b`
- checking whether a requirement belongs in `Runner Probe`, `Starter Loop`, or `Repeat Loop`
- resolving drift between `docs/decisions.md` and older planning docs
- reviewing whether the ladder still matches the M001 pre-build gate

## Not This Doc For

- replacing `docs/decisions.md` as the decision authority
- replacing `docs/milestones/m001-solo-session-loop.md` as the pre-build gate
- replacing `docs/specs/` as the implementation-level behavior source
- designing coach clipboard, sync architecture, or Phase 1.5 longitudinal planning in detail

## Shared Product Backbone

The product remains one shared loop:

1. Set context for today's session.
2. Assemble or select a session.
3. Run the session courtside.
4. Capture a quick review.
5. Improve the next session.

What stays constant across the ladder:

- deterministic, no-AI critical path
- local-first, write-as-you-go durability
- warm-up and cool-down are mandatory
- sub-60-second review target
- visible stop/seek-help triggers
- one high-contrast, outdoor-readable mobile posture

What changes by prototype:

- how much of the loop is real versus stubbed
- whether planning is preset, starter-template, or repeat-aware
- whether adaptation is hidden, visible, or carried forward
- how much home-state complexity exists

## Stage Definitions

### `v0a`: Validation Runner

A Phase 0 field-test artifact: a bare-bones working PWA session runner used to answer the fatal questions around phone-on-sand viability, solo environment fit, review completion, and honest solo framing.

`v0a` is not M001 implementation.

### `v0b`: Starter Loop Build Target

The first post-gate implementation slice: a real product path that gets a new user to a believable starter session, honors the M001 trust contract, and becomes the default candidate once the pre-build gate clears.

### `Repeat Loop`

A carry-forward experiment layered on the same backbone to test second-session behavior, purposeful repetition, and next-session trust. It is not a third product line and it must not pull Phase 1.5 scope into `v0b`.

## Canon Reconciliation

### Decision Authority

- `docs/vision.md` remains rank 1 in the source-of-truth hierarchy. This doc does not redefine that stack; it only reconciles drift below vision and decisions.
- `docs/decisions.md` outranks the PRD, roadmap, discovery docs, and specs when wording conflicts.
- `D91` is the authoritative M001 go/no-go rule.
- `D90` through `D93` are the authoritative session-time context decisions.
- `D74` remains authoritative for the post-M001 minimal weekly receipt direction.

### Session-Time Context Model

Older PRD text says first-run should capture `skill level` and `player mode`. Current canon resolves that as:

- `skill level` is still valid as a bootstrap input for the starter session.
- player configuration is not a fixed profile field. Per `D90`, current player count (`1-4`) is a session-time input.
- per `D92`, session-start context should be one structured step using:
  - a player-count row
  - equipment chips (`wall`, `net`, `cones`) pre-filled from the last session
  - optional one-tap wind capture
- per `D93`, wind is first-class at session creation with canonical labels `calm`, `light wind`, and `strong wind`

This EDD therefore treats older `player mode` language as shorthand for the starter session's initial headcount choice, not as a durable profile attribute.

For the current v0 scope, surface `1` and `2` players in the starter flow. That preserves the solo-first path and pair fallback without pretending small-group support belongs in the first slice.

### Gate Thresholds

`docs/discovery/phase-0-wedge-validation.md` and `docs/discovery/phase-0-readiness-assessment.md` include older example thresholds such as `>=6 recruited -> >=4 session 1 -> >=2 session 2`. Those remain useful for logistics and early signal, but they are not the canonical go/no-go bar.

The canonical M001 gate is `D91`:

- `5+` testers each complete `2+` sessions within `14` days
- kill signal if fewer than `3` of `5` start a second session within `14` days
- banded reading on the raw count (`0-1/5` strong negative, `2/5` ambiguous, `3/5` weak pass of floor, `4-5/5` first genuinely encouraging), at least one enrichment signal required, self-initiated vs human-prompted returns tracked explicitly
- `>50%` review completion is an interpretation aid, not an independent gate

See `docs/research/d91-retention-gate-evidence.md` for the binomial CI math, contamination mitigations, and full instrumentation list.

### `O4` / `O5`

`O4` and `O5` are now restored in `docs/decisions.md`:

- `O4`: what "solo" operationally means for passing fundamentals for serve receive — which environments and setups are honest and actually available to target users
- `O5`: whether the observed evidence is strong enough to justify moving from the validation runner into the first implementation slice without overfitting to founder or friend signal

`D91` defines the quantitative bar for `O5`; the operational question is whether field evidence meets that bar convincingly.

## Pre-Build Gate

M001 stays blocked until the following are validated through a thin prototype and field use:

- phone courtside viability: users actually pull out and use the phone on sand
- solo feasibility: the operational definition of solo works in real environments
- review completion: the review is completed in context and produces believable next-session inputs
- second-session retention: users return for a second session within the validation window (measured via concierge assistance pushing the second session link, as `v0a` has no organic next-session UI)
- safety baseline: initial sessions and deload logic have been reviewed before scaling beyond initial testers

This ladder only covers the self-coached build path. Phase 0 still includes coach clipboard interviews and scorecards per `docs/roadmap.md` and `docs/discovery/phase-0-wedge-validation.md`; those activities sit beside this ladder rather than inside it.

## Trust Contract

These invariants apply across the ladder even when the UI is thin:

- no generative AI in session generation, editing, progression logic, or load planning; optional copy-only explanation of deterministic logic remains allowed outside the critical path
- pre-session safety is `pain flag + training recency + contextual heat CTA`
- `pain = yes` defaults to a conservative recovery or technique-only path, with explicit override
- missing or insufficient review data cannot trigger progression
- in-progress session state is written locally at meaningful boundaries
- review data is stored on device before any future sync
- offline reuse works after first successful load
- update activation happens only at safe boundaries
- schema changes must preserve prior local data

## UX Interaction Constraints

To ensure the product promise of "minimal taps" and "no typing" courtside is maintained, the following interaction patterns must be strictly followed in wireframes and implementation:

- **Swap Drill:** Opens a bottom sheet with 1-2 curated deterministic alternatives. No freeform drill library browsing.
- **Shorten Block/Session:** Presents a 1-tap preset duration option or automatically drops the lowest priority block. No free-text time entry.
- **Quick Review Inputs:** 
  - `attemptCount`: Must use large-tap `- / +` steppers or a segmented control. No system keyboard.
  - `incompleteReason`: Must use 3-4 predefined chips (e.g., `Time`, `Fatigue`, `Pain`). No text fields.
- **Pain Override Flow:** If a user flags pain during the Pre-Session Safety check, present an inline warning or a bottom sheet with a clear explanation of the recovery-only default, along with a deliberate "Override" button. Do not navigate away from the setup flow.

## Visual Design Language (D94)

All wireframes and prototypes across the ladder use:

- **Accent**: warm orange `#E8732A` (primary), `#C55A1B` (pressed/dark)
- **Background**: `#FFFFFF` (white) or `#F5F5F0` (warm off-white for card surfaces)
- **Text primary**: `#1A1A1A` (near-black)
- **Text secondary**: `#6B7280` (medium gray)
- **Success**: `#059669` (green)
- **Warning/Pain**: `#DC2626` (red) on `#FEE2E2` (light red surface)
- **Info surface**: `#FEF3E8` (light orange tint)
- **Selection controls**: vertical card patterns with descriptions for choices like skill level; large tap cards for binary choices like solo/pair
- **Font**: Inter (web) / system sans-serif stack (fallback)
- **Radius**: 12px for cards, 16px for buttons, 40px for phone frame mock corners

This replaces the blue `#3B82F6` palette used in earlier wireframe experiments. Warm orange matches the beach/outdoor product identity and is consistent with the Figma prototype.

## Architecture Constraints

To ensure `v0a` and `v0b` safely climb the prototype ladder without throwaway rewrites, developers must enforce the following boundaries:

- **Relational Local-First Schema:** Model IndexedDB (Dexie) relationally from day 1, even in `v0a`. Create separate stores for `SessionPlans` (templates), `ExecutionLogs` (actual run data), and `SessionReviews` (user feedback). Do not use a monolithic session document. This makes `v0b`'s `review_pending` state naturally emerge as an `ExecutionLog` without a corresponding `SessionReview`.
- **Timer State Ledger (PWA Eviction Defense):** Mobile OS environments aggressively suspend PWAs. Do not rely solely on unmount or visibility events to save progress. Implement an interval flush or debounced write-ahead log (e.g., every 5 seconds) for the active timer state (`startedAt`, `accumulatedElapsed`, `status`). Cold-boots must hydrate from this continuous state.
- **Pure-Function Adaptation Logic:** The adaptation engine (`progress / hold / deload`) must be a pure TypeScript module (`(PreviousExecution, Review) => NextPlan`). It must have zero dependencies on React, the DOM, or IndexedDB to ensure exhaustive unit-testability.

## Prototype Ladder

### Runner Probe

Purpose:

- prove the phone-mediated loop is usable in real conditions (including screen dimming and thermal shutdown survival)
- test solo environment fit across the three prebuilt contexts
- test whether the review is tolerable after real training
- test honest messaging around "passing fundamentals for serve receive"

Screen order:

1. `Start` — pick today's player count (`1` or `2`), pick one of three prebuilt sessions, tap `Start`
2. `Pre-Session Safety` — pain flag, training recency, contextual heat CTA (same large-tap controls as run)
3. `Warm-Up` — first block, same run UI
4. `Run Block` — timer as dominant visual, one coaching cue, `Next` and `Pause` as primary controls (54-60px), secondary actions (`Skip block`, `End session`) in overflow or pause state
5. `Between-Block Transition` — next block label, duration, one cue, primary `Start next block` action
6. `Cool-Down` — last block, same run UI
7. `Quick Review` — sRPE (0-10 tap), binary `Good` / `Not Good` with attempt count, optional note, `incompleteReason` if ended early, `Done`
8. `Session Complete` — short summary, `Saved on device` confirmation

Required real surfaces:

- a working PWA shell with Add to Home Screen support
- the eight screen states above
- primary/secondary control hierarchy matching `docs/specs/m001-courtside-run-flow.md`: timer dominant, `Next` / `Pause` largest, secondary actions collapsed
- local persistence sufficient to survive a normal run, interruption, and review flow

Minimum `v0a` trust floor:

- no lost progress in a normal run: session state written at start, block transitions, and review submit
- resume after backgrounding or accidental close: timestamp-based safe pause, explicit resume prompt on return
- clear `Saved on device` messaging after review submit
- no mid-session refresh or forced reload
- if persistent storage is unavailable, do not block usage but keep copy honest

Review evidence limitations:

- `v0a` uses immediate review only; it does not test delayed sRPE capture, `Finish later`, or home `review_pending` re-entry
- `D91` review-completion evidence from `v0a` reflects the easy path; Starter Loop must re-validate review compliance under delayed and deferred conditions before treating review metrics as fully representative

Allowed stubs:

- full ranked-fill sophistication
- full home-state matrix
- full repeat-user adaptation UI
- deep edit flows
- delayed review / `Finish later` / home review-pending state
- coach clipboard
- backend or sync
- analytics beyond what validation needs

Minimal archetype-aware ranked fill is allowed inside `v0a` if it is the cheapest way to generate the three fixed validation sessions. The user-facing scope remains "pick a preset and run it."

#### v0a Preset Definitions (D95)

The three presets map directly to `D67` archetypes and cover the realistic environments target users train in:


| Preset               | Archetype      | Players | Equipment           | Duration | Blocks                                                           |
| -------------------- | -------------- | ------- | ------------------- | -------- | ---------------------------------------------------------------- |
| Wall Pass Workout    | solo + wall    | 1       | Ball, wall/fence    | ~12 min  | Warm-up (3 min), Wall Pass Drill (6 min), Cool-down (3 min)      |
| Open Sand Workout    | solo + no wall | 1       | Ball, cones/markers | ~12 min  | Warm-up (3 min), Self-Toss Pass Drill (6 min), Cool-down (3 min) |
| Partner Pass Workout | pair + net     | 2       | Ball, net           | ~15 min  | Warm-up (3 min), Partner Pass Drill (9 min), Cool-down (3 min)   |


Exact drill content within each preset needs volleyball coach review. The presets should feel like three believable "pick one and go" options, not three variations of the same thing.

The deload archetype from `D67` is not a v0a preset. Deload sessions emerge from adaptation rules in `v0b`.

### Starter Loop

Purpose:

- prove fast activation to a believable first session
- prove that the safety gate, starter defaults, and deterministic assembly feel trustworthy
- provide the first real build target if the gate clears

First-run screen sequence:

1. `Home/NewUser` — `Start first workout`, one-line focus copy ("passing fundamentals for serve receive"), no account or permission gate
2. `Skill Level` — one tap: beginner / intermediate / advanced
3. `Today's Setup` — one compact step combining `D90`-`D93`: player count (`1` or `2`), equipment chips (`wall`, `net`, `cones`) with sensible first-run defaults from the starter archetype, optional one-tap wind capture. Target: 2-4 taps total. This is the single "today" moment, not a second onboarding screen.
4. `Session Prep` — calm summary card: title, duration, focus, environment, equipment fit. Primary: `Start now`. Secondary: `Swap drill`, `Shorten`, `Switch solo/pair`.
5. `Pre-Session Safety` — same gate as Runner Probe
6. `Run` — full run flow per `docs/specs/m001-courtside-run-flow.md` with locked plan semantics
7. `Quick Review` — full review per `docs/specs/m001-review-micro-spec.md` including `Finish later` and deferred sRPE timing
8. `Session Summary` — result, one-line adaptation output, primary: `Done` / return to home

Repeat-session path: `Home/Draft` or `Home/LastComplete` -> `Today's Setup` (pre-filled from last session, approach zero-config) -> `Session Prep` -> same run and review flow.

The `Today's Setup` step replaces the older "refine hard filters later" model from the PRD. Remaining assembly inputs (time profile, balls, markers) appear in `Session Prep` as editable defaults, not as separate questions. This keeps the first path under 3 minutes while still producing a constraint-aware session.

Activation acceptance bar: Starter Loop must meet the `docs/roadmap.md` and `docs/prd-foundation.md` activation metrics with `D90`-`D93` in the path. If the structured context step blows the 3-minute activation budget, simplify the step or defer non-critical chips rather than shipping a trust-heavy gate that fails the speed promise.

Required real surfaces:

- the screen sequence above
- deterministic starter session selection or template-based assembly
- full review including pending, skipped, and deferred-sRPE behavior per `docs/specs/m001-review-micro-spec.md`
- duplicate and edit previous
- home-state priorities per `docs/specs/m001-home-and-sync-notes.md`

Allowed stubs:

- deeper weekly planning
- coach clipboard
- cloud or sync
- broad library expansion beyond what validation needs
- richer analytics or onboarding experiments beyond the starter path

### Repeat Loop

Purpose:

- prove second-session behavior and next-session trust
- test whether purposeful repetition plus rules-based adaptation feels helpful rather than stale
- de-risk the later shallow longitudinal layer without building it too early

Required real surfaces:

- repeat-user home priorities
- pending-review recovery
- adaptation state carried across sessions
- a clearly named carry-forward surface
- duplicate and edit previous plus deterministic next-step logic

The default carry-forward surface is:

- a repeat-user home card showing the next suggested session
- the last session result
- one-line explanation of why the next step stayed the same, progressed, or deloaded
- an optional minimal weekly receipt strip if that is the clearest way to test repeat value

This doc leaves `Repeat Loop` intentionally unnumbered. It is the first post-`v0b` retention experiment, not a promised `v0c` roadmap commitment.

Allowed stubs:

- coach share
- marketplace or payments
- full macro or meso planning
- complex dashboards
- cloud peer sync

## Prototype State Coverage Matrix


| State / Concern             | Runner Probe                                              | Starter Loop                                  | Repeat Loop                                                  |
| --------------------------- | --------------------------------------------------------- | --------------------------------------------- | ------------------------------------------------------------ |
| `Home/NewUser`              | Stubbed: single start surface only                        | Implemented: starter CTA and focus copy       | N/A: repeat cohort only; falls back to Starter on cold start |
| `Home/Resume`               | Implemented: minimum resume entry                         | Implemented: explicit resume priority         | Implemented: explicit resume priority                        |
| `Home/ReviewPending`        | Out of scope: one-pass flow                               | Implemented: minimal return-to-review state   | Implemented: full priority order                             |
| `Session Prep`              | Out of scope: choose preset only                          | Implemented: calm summary plus quick edits    | Implemented: full prep and fallback behavior                 |
| `Pre-Session Safety`        | Implemented: pain, recency, heat CTA                      | Implemented: full gate and shaping            | Implemented: same contract                                   |
| `Warm-Up`                   | Implemented: included in presets                          | Implemented: required first block             | Implemented: required first block                            |
| `Run Current Block`         | Implemented: core validation surface                      | Implemented                                   | Implemented                                                  |
| `Between-Block Transition`  | Implemented: minimal label + cue + primary action         | Implemented: clear next-step transition       | Implemented                                                  |
| `Cool-Down`                 | Implemented: included in presets                          | Implemented: required last block              | Implemented                                                  |
| `Quick Review`              | Implemented: sRPE plus one metric                         | Implemented                                   | Implemented                                                  |
| `Review Later`              | Out of scope: immediate review only                       | Implemented: delayed return allowed           | Implemented: same, with home priority                        |
| `Review Skipped`            | Out of scope                                              | Implemented: no false progression             | Implemented: no false progression                            |
| `Session Summary`           | Implemented: short complete screen                        | Implemented                                   | Implemented                                                  |
| `Resume After Interruption` | Implemented: timestamp-based safe resume                  | Implemented: explicit recovery semantics      | Implemented                                                  |
| `Visible Adaptation Output` | Out of scope or mocked                                    | Implemented: one-line next-step result        | Implemented: carried onto repeat home                        |
| `Deterministic Assembly`    | Out of scope: fixed sessions only                         | Implemented: starter template or limited fill | Implemented: repeat-aware fill and spacing                   |
| `Local Durability`          | Implemented: v0a trust floor (start, transitions, review) | Implemented: trust invariant                  | Implemented                                                  |
| `Offline / Update Safety`   | Implemented: no mid-session refresh, resume after close   | Implemented: safe-boundary behavior           | Implemented                                                  |


## What `v0a` Evidence Can And Cannot Conclude

`Runner Probe` is an honest field test for phone-on-sand viability, solo environment fit, courtside review tolerance, and honest solo framing. It is not a full test of the shipped UX. Specifically:


| Signal                             | `v0a` can conclude                                  | `v0a` cannot conclude                                                               |
| ---------------------------------- | --------------------------------------------------- | ----------------------------------------------------------------------------------- |
| Phone courtside viability          | Yes: real sun, sand, sweat, glare                   |                                                                                     |
| Solo environment fit               | Yes: three prebuilt contexts cover wall, open, pair |                                                                                     |
| Immediate review tolerance         | Yes: sRPE + binary metric after real fatigue        |                                                                                     |
| Delayed review compliance          |                                                     | No: `v0a` is immediate-only; deferred sRPE and `Finish later` start in Starter Loop |
| Home re-entry after pending review |                                                     | No: `v0a` has no `review_pending` home state                                        |
| Full between-block rhythm          | Partial: minimal transition exists                  | Full transition fidelity starts in Starter Loop                                     |
| First-run activation speed         |                                                     | No: `v0a` uses presets, not the real onboarding + assembly path                     |
| Constraint-aware assembly trust    |                                                     | No: `v0a` is fixed sessions only                                                    |
| Repeat-session next-step trust     |                                                     | No: adaptation UI starts in Starter Loop, carry-forward starts in Repeat Loop       |


When interpreting `D91` review-completion evidence from `v0a`, treat it as an upper bound on the easy path. Starter Loop must re-validate review compliance under delayed-capture and deferred-review conditions before treating the metric as fully representative of the shipped product.

## Pain-Override Flow

When the user taps `Yes` on the pain flag during Pre-Session Safety:

1. The screen stays in the safety flow (no navigation away).
2. An inline warning card appears below the pain question explaining the recovery-only default: "Your session has been adjusted to recovery-only technique work. This protects you while you're dealing with pain."
3. The adjusted session summary appears: shorter duration, technique-only drills, no high-load variants.
4. Two actions:
  - `Continue with recovery session` (primary, default)
  - `Override — use my original session` (secondary, deliberate — smaller, requires a distinct tap, not adjacent to the primary)
5. If overridden, a brief confirmation: "You chose to override the recovery default. Listen to your body and stop if pain worsens."

This flow must be wireframed and tested in `v0a`. The override is intentionally harder to tap than the safe default.

## Mandatory Block Skip Restrictions

Per `D85`, warm-up and cool-down blocks cannot be skipped entirely. Between-block transition screens must enforce this:

- When the next block is warm-up or cool-down: show `Shorten block` as the only secondary action. Do not show `Skip block`.
- When the next block is a main work block: show both `Shorten block` and `Skip block`.
- During cool-down: the `End session` action in the overflow should warn that cool-down will be cut short and prompt confirmation.

## Persistent Safety Affordance

Per `D88`, the stop/seek-help reference must be accessible from every screen during an active session:

- Run, Transition, Pause, Review, and Summary screens must all include a persistent safety icon (e.g., a shield or cross icon in the top bar or overflow).
- Tapping it reveals the stop/seek-help symptom list and emergency copy.
- This affordance must work offline and must not require navigating into settings.

## High-Risk Transitions To Call Out

- background or lock while the timer is running: `v0a` uses timestamp-based safe resume; full recovery contract starts in Starter Loop
- immediate vs delayed `sessionRpe`: `v0a` is immediate only; Starter Loop must follow `docs/specs/m001-review-micro-spec.md` for delayed timing, persistence, and deferred-review home priority
- end early -> review -> adaptation: `incompleteReason` must exist if the run ends early; fatigue and pain bias toward deload
- first review -> next session: after first completed review, Starter Loop home shows next suggested session from adaptation rules plus one-line explanation; fallback when adaptation is `hold` is duplicate-last with a minor parameter rotation per `docs/specs/m001-adaptation-rules.md`

## Prototype Comparison Scorecard


| Prototype    | Primary purpose                                | Answers first                                                             | Required real surfaces                                                              | Allowed stubs                                                   | Success evidence                                                             | Kill signals                                                               | Engineering weight |
| ------------ | ---------------------------------------------- | ------------------------------------------------------------------------- | ----------------------------------------------------------------------------------- | --------------------------------------------------------------- | ---------------------------------------------------------------------------- | -------------------------------------------------------------------------- | ------------------ |
| Runner Probe | Falsify phone-on-sand and review risks quickly | `A1`, `A2`, `A3`, `A6`, working `O4`, `O6`                                | Working PWA, fixed sessions, run, review, complete, minimum interruption recovery   | Full assembly sophistication, deep edit, repeat UI, coach flows | Founder and friend signal strong enough to expand; users complete field runs | Users refuse phone, solo setups fail, review feels too annoying            | Lowest             |
| Starter Loop | Prove believable first-session product value   | `D90` to `D93`, `D82` to `D83`, activation honesty, safety, starter trust | Starter home, structured session-start context, prep, run, review, starter assembly | Multi-week planning, coach clipboard, cloud, broad analytics    | Users reach useful session quickly and trust the result                      | First-run friction, unsafe-feeling defaults, infeasible sessions           | Medium             |
| Repeat Loop  | Prove retention and next-session trust         | `A4`, `A7`, `D89`, working `O5`, `O7` timing, `D74` direction             | Repeat home, pending review recovery, carried adaptation state, visible next step   | Coach share, marketplace, full longitudinal system              | Users complete second session within window; repeat path feels useful        | Second-session retention misses `D91`; repetition feels stale or arbitrary | Highest            |


## Tradeoffs

`Runner Probe` is the fastest way to kill a bad wedge, but it does not prove full product truth. `Starter Loop` is the smallest build candidate that feels like the actual product promise, but it costs more engineering and can still miss retention. `Repeat Loop` is the only place where second-session trust becomes legible, but it is also where scope can quietly expand into Phase 1.5 if it is not tightly constrained.

The ladder works only if each step stays honest:

- `Runner Probe` is a validation instrument, not a disguised MVP
- `Starter Loop` is a build target, not a full weekly planner
- `Repeat Loop` is a retention experiment, not a longitudinal platform

## `O7` Timing Table


| Timing point                                     | What must be true                                                                                                  |
| ------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------ |
| Before first prototype tester sessions           | Workflow-level safety gates are present: pain, recency, heat CTA, stop/seek-help visibility, warm-up and cool-down |
| Before broader cohort scaling                    | At least one coach or sports physio has reviewed initial sessions and deload logic                                 |
| Before approving `v0b` / M001 implementation     | `D91` and the broader pre-build gate are satisfied; workflow safety gates already cover prototype testers          |
| Before scaling materially beyond initial testers | The broader `O7` review tracks no longer block expansion beyond the early cohort                                   |


## Checkpoints

1. `Canon Reconciled`
  - `D90` to `D93`, `D91`, `O4`, and `O5` are explicitly resolved and consistent with `docs/decisions.md`.
2. `Runner Probe State Coverage Locked`
  - The matrix makes clear what `v0a` implements, stubs, or omits.
3. `Phase 0 Evidence Evaluated Against D91`
  - The validation recommendation uses the authoritative threshold, not the older example band.
4. `Safety Review / Pre-scaling Cleared`
  - `O7` timing is explicit and non-ambiguous.
5. `Starter Loop Handoff Approved`
  - The recommendation to build `v0b` only happens after the gate clears.

## Recommendation

Build `v0a` first. It is the fastest honest way to test whether the wedge is viable at all and whether the phone-mediated runner survives real courtside use. Do not treat `v0a` as M001 implementation.

Recommend `v0b` as the preferred build target only if the broader gate clears. When it does, `Starter Loop` is the right first build slice because it tests the real product promise without prematurely dragging in a broader weekly planning surface.

Treat `Repeat Loop` as the first retention-oriented extension on the same backbone. It is worth designing now so `v0a` and `v0b` do not paint the system into a corner, but it should not widen into a separate track or delay the first hard go/no-go call.

## Invalidation Rules

Revisit the wedge rather than adding scope if:

- users do not actually use the phone courtside, or the device overheats/dims rendering it unusable
- the solo definition fails in real environments
- review completion collapses under real fatigue
- second-session retention misses `D91` (even with concierge prompting in Phase 0)
- safety review identifies material issues in the starter sessions or deload logic

## For Agents

- **Authoritative for**: `v0a` / `v0b` stage naming, prototype boundaries, state coverage, and the decision logic connecting validation to the first build target.
- **Edit when**: the go/no-go rule changes, the ladder changes, or `O4` / `O5` status changes in `docs/decisions.md`.
- **Belongs elsewhere**: implementation details (`docs/specs/`), explicit decision status (`docs/decisions.md`), milestone acceptance (`docs/milestones/m001-solo-session-loop.md`), and field-program details (`docs/discovery/phase-0-wedge-validation.md`).

