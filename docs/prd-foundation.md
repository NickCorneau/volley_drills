---
id: prd-foundation
title: PRD Foundation
status: draft
stage: planning
type: core
authority: product scope, workflow, object model, MVP requirements, courtside UX requirements, drill metadata spec
summary: "PRD: user, workflow, object model, MVP scope, activation posture, and courtside UX requirements."
last_updated: 2026-04-19
depends_on:

- docs/vision.md
- docs/decisions.md
- docs/research/beach-training-resources.md
---

# PRD Foundation

## Agent Quick Scan

- Use this doc for current product scope, indispensable workflow, object model, drill metadata, and MVP requirements.
- Not this doc for what is officially decided or for phase sequencing; use `docs/decisions.md` and `docs/roadmap.md` for those.
- If a task changes scope, workflow, or data contracts, update this doc and then re-check the milestone and spec docs that depend on it.

## Product statement

A personal-first beach volleyball training OS that feels light on the surface and serious underneath: it helps self-coached users assemble, run, trust, and invest in structured practices under real on-court constraints using deterministic, explainable session rules.

## Primary user (v1)

Self-coached amateur beach player training 1-3 times per week without consistent access to a certified coach. Real training groups are fluid — solo one day, a regular partner the next, sometimes 3-4 people at the net. Solo use is the lead activation path; pair mode is a supported extension; 3+ player support is a tracked future requirement (see D101).

This is the chosen primary direction for the first build. Coach-led workflows should still be validated as shared-backbone extensions using the approach described in `docs/roadmap.md`.

## Secondary user (planned extension)

Beach coach running direct coach-to-client or small-group beach training on top of the same shared backbone.

This path matters because coaches may be a stronger paid buyer than self-guided users, but it should extend the same core objects and workflow rather than forcing a separate product.

## Core problem

Non-expert beach players cannot reliably convert goals, limited equipment, inconsistent partners, and real beach conditions into coherent practices that improve the right skills over time.

## Core jobs-to-be-done

- Turn "I need to get better at X" into a believable weekly training plan.
- Get a session that still works when I am training alone, and know when partner/net access unlocks more realistic transfer.
- Run a smooth practice on sand or at home with minimal phone friction.
- Capture one or two useful measures of progress without needing a coach.
- Know what to do next week without rebuilding from scratch.
- Understand why today's session fits and what the app will change next.
- Replace notes, PDFs, and memory with one tool I trust enough to keep using.

## Indispensable workflow (v1)

1. First run: capture only the minimum context that changes the starter recommendation (`skill level` and today's player count)
2. Show a ready-to-run starter session immediately, with passing fundamentals for serve-receive improvement as the default first focus
3. Ask for extra setup only when it materially changes today's draft or the safety contract
4. Edit quickly when needed (swap, reorder, duration, solo/pair variant)
5. Run session courtside on mobile
6. Capture quick review (sRPE, one skill metric, short note)
7. Adapt the next session and, later, the broader weekly focus with explicit `progress / hold / deload` rules and a visible why

Deeper intake such as planning horizon, explicit goals, environment, equipment, and competition context still matters for the broader product, but it should be gathered progressively after the first useful session or when the user chooses to refine a plan.

## Activation posture (first run)

- Time-to-first-useful action should be under `3` minutes.
- Recommendation-first reveal: the user should see a believable session before the app feels like a form.
- Mandatory first-run inputs: `skill level` and today's player count.
- Default first focus: `passing fundamentals for serve receive`.
- Default first-run session length: `10-15` minutes.
- No mandatory account creation, sign-up, or permission prompts before the first starter session.
- Any additional required question must visibly change today's draft or belong to the safety contract.
- Do not require the `0-3` pass-quality scale in M001. When pass scoring appears, default to binary `Good` / `Not Good` against a target-zone or playable-next-contact standard.

### First-run reveal contract

This is the source-of-truth split for recommendation-first first-run behavior:

- **Before reveal:** `skill level`, today's `player count`
- **After reveal / refinement:** `time profile`, `net`, `wall or fence`, `balls`, `markers`, `wind`
- **Safety interrupt:** `pain flag`, `training recency`, contextual heat CTA

The D91 artifact may still package the reveal later to measure activation cost, but the long-term product contract should not change which inputs belong before the first believable session reveal.

## Trusted context refinement (after the first quick win)

Once the user edits a session, asks for a fresh one, or returns for repeat use, M001 should capture the smallest extra set of hard filters needed for trustworthy assembly. Treat these as **recommendation controls**, not profile completion:

- time profile (`15`, `25`, `40+`)
- net available (`yes`, `no`)
- wall or fence available (`yes`, `no`) — defaults to `no` for a beach-first product; wall is a minority environment for amateur beach users and wall-gated drills are conditional inventory (see D102 and `docs/research/solo-training-environments.md`)
- balls (`1`, `many`)
- markers (`none`, `improvised`, `cones`)
- wind (`calm`, `light wind`, `strong wind`)
- pain that changes how you move (`yes`, `no`) — this is the pre-session safety gate from D83, not the deferred soreness questionnaire

These are not all first-run mandatory, but they are required before the system claims a later draft is truly constraint-aware.

## Visible reasoning and carry-forward

The product contract is not only that the logic is deterministic, but that the user can feel that logic at the right moments.

- Draft-level reason: one bounded line on why today's session fits this context.
- Safety / change-of-plan reason: one bounded line when the app lightens, redirects, or narrows the plan for today.
- Next-step reason: one bounded line on why the next session stayed the same, got lighter, or got harder.
- Review and summary must end with a clear next step or next planning cue, not a dead-end confirmation.

The D91 field-test artifact may ship a thinner slice of these surfaces to keep cognitive load low, but the product contract remains visible deterministic reasoning where it helps trust and repeated use.

## Core object model (v1-focused)

- `SkillTrack` — multi-week focus area (e.g., "serve consistency" or "competition prep"); deferred until the single-session loop proves retention
- `CyclePlan` — placeholder for longitudinal planning; the first Phase 1 implementation is a next 2-6 sessions queue, not a full macro/meso/micro planner
- `TrainingContext` — constraints snapshot captured before planning: goal, level, current player count, time profile, environment access, equipment, wind, and condition notes
- `SessionArchetype` — fixed block template selected from current hard filters before drill ranking begins
- `Drill` — canonical drill family with structured participant, equipment, and environment requirements, objective, courtside steps, teaching points, and target metric
- `DrillVariantLink` — structured progression, regression, or lateral link between drill families or constraint-specific variants
- `Session` — plan container that becomes an immutable plan snapshot once execution starts
- `SessionBlock` — normalized planned block belonging to a session
- `SessionRunState` — durable execution cursor, lifecycle status, and timing anchors for pause, resume, and interruption recovery
- `SessionReview` — post-session capture: sRPE, one skill metric, short note, and the derived adaptation outcome
- `AdaptationState` — minimal durable carry-forward state per focus used to build the next session offline

Later objects:

- `MutationLog`
- `CoachClientLink`
- `CoachFeedback`
- `TrainingGroup`
- `Athlete`
- `Program`
- `ProgressionRule`
- `CoachShare`
- `SessionParticipant` — UUID-addressed participant row with `sideIndex`, `slotIndex`, `role`, `source`, nullable `localProfileId`, nullable `teamId`, and `displayNameSnapshot`; introduced when session records grow beyond `playerCount: 1 | 2`. Per `D115`, this is the mandatory shape when partner identity first lands; no ad-hoc partner-name fields on `Session`.
- `PlayerProfile` — optional durable local person identity (aliases, contact hints, discoverable flag, merged-into pointer, archive timestamp); no account layer, discoverability off by default.
- `Team` — first-class two-member durable object; only ships after the four `D117` graduation conditions are met (measurable recurrent-pair behavior, indirect team-affordance demand, healthy trust metrics, selection-bias-resistant uplift evidence). See `O13` and `docs/research/persistent-team-identity.md`.
- `TeamConsent` — append-only ledger of separate, independently revocable grants per scope (`link_identity`, `share_session_history`, `share_progression`, `share_recommendations`) with `status`, `scope`, `validFrom`, and `validTo`; required before any Team-adjacent sharing ships per `D116`.

## Canonical local-first contracts

These contracts are small enough to decide now and important enough not to defer:

- Local canonical source: the local database is the source of truth for reads and writes. Any future cloud peer syncs with it; it does not replace it.
- Record identity: persisted records use client-generated immutable string IDs. No auto-increment keys. No primary-key rewrites.
- Plan, execution, and review separation: the session plan, live execution, and review are separate concerns with separate statuses.
- Plan immutability after start: when a session starts, the ordered plan snapshot locks. After that, swap, skip, end-early, and pause/resume actions modify run state or create a new draft by duplication; they do not silently rewrite the original plan.
- Minimal execution statuses: `not_started`, `in_progress`, `paused`, `ended_early`, `completed`.
- Minimal block statuses: `planned`, `in_progress`, `skipped`, `completed`.
- Resume contract: persist execution status, active block ID, per-block status, and timing anchors frequently enough that app backgrounding or termination does not erase meaningful progress.
- Web durability baseline: on PWA plus IndexedDB builds, request persistent browser storage where supported and separate local-save language from future backup or sync language.
- Deletion and future sync baseline: use soft-delete or tombstone-friendly semantics and leave room for an append-only mutation log even before multi-device sync exists.

## Minimum drill metadata

Every drill family must carry generator-ready metadata for reliable selection, validation, adaptation, and swaps. The canonical contract stays small, but several fields should be structured objects rather than flat strings:

- name
- skill focus
- objective (may include goal tags)
- participants (`min`, `ideal`, `max`, plus role needs such as passer, toss/server, coach)
- feed type (`self-toss`, `partner-toss`, `live-serve`, `wall-rebound`, `coach-serve`): determines realism and what the drill can claim to train; required for honest swapping and solo-framing transparency
- level range (beginner, intermediate, advanced)
- courtside steps
- teaching points
- equipment (balls, markers, and net assumptions)
- environment suitability: structured flags (`needs-net`, `needs-wall`, `needs-lines`, `needs-cones`, `wind-friendly`, `low-screen-time`) that act as hard filters for session assembly, replacing the coarse sand/court/indoor label
- target metric (what to measure)
- workload envelope (planned duration, intensity band as RPE 0–10, difficulty tier, and **fatigue cap**: max dose per block such as "2 sets of 4" or "20 reps max" plus optional rest minimum, to protect technique under fatigue)
- variants (structured progression, regression, or lateral links; transfer notes when realism changes)
- variant parameter knobs (the dimensions that change between variants within a family): target size, distance, constraint type, rep count, rest ratio, wind adaptation. These create perceived variety and progression without inventing new drills.

This expands the original 12-field contract with feed type, structured environment flags, and an explicit fatigue cap — all required for safe swapping, honest solo-framing, and technique-protective load management. The variant-knob model is consistent with coaching-standard drill definitions (FIVB drillbook) and is the primary mechanism for session freshness in a small library.

### Teaching-points style

Teaching points prefer external, outcome-focused cues (target, ball behavior, set-window placement, environmental read) over internal body-part cues. Attentional-focus research (Wulf and colleagues) consistently finds external focus produces better retention and transfer once a basic movement pattern exists, which describes our self-coached amateur user after the first session. Body-part language belongs in warm-up content where joint preparation is the point (e.g., "load both ankles before landing"), not in skill drill cues.

Applied to `Drill.teachingPoints`:

- Prefer: "send the ball to the set-window marker", "pass lower and tighter in wind", "watch the ball land on the target", "serve at the seam".
- Avoid as primary cues: "rotate your shoulder", "keep your elbow here", "bend your knees more" unless the drill is explicitly a technique-isolation block.
- Treat the first two items in `teachingPoints` as active in-drill cues; remaining items are pre-block prep-screen context. This aligns with `D51` (one visible cue at a time) and respects the guidance hypothesis (fewer, better-placed cues beat constant correction).

See `docs/research/beach-training-resources.md` "Skill acquisition principles synthesis (2026-04-16)" for the evidence base and `O14` for the open question about cue cadence and fading.

The machine-readable source of truth for this contract is `app/src/types/drill.ts`. The structured drill catalog is `app/src/data/drills.ts` (26 drills with full metadata). Progression chains are `app/src/data/progressions.ts`. Session archetypes and block layouts are `app/src/data/archetypes.ts` with types in `app/src/types/session.ts`.

See `docs/research/beach-training-resources.md` for research context and `docs/specs/m001-session-assembly.md` for how these fields drive archetype selection and ranked fill.

## MVP scope (smallest useful)

The MVP envelope is broader than the first implementation-ready slice. Use `docs/milestones/m001-solo-session-loop.md` as the current thin-slice planning target.

### Must-have

- Ultra-lean first-run activation: `skill level` + today's player count, default passing-fundamentals-for-serve-receive focus, and a ready-to-run starter session
- One trusted passing-fundamentals track for serve-receive improvement, with partner + net sessions acting as the primary transfer path when available
- Constraint-first session creation for the current primary mode, with solo and pair fallback logic before a plan is considered trustworthy
- Drill metadata and validation (see drill metadata spec above)
- Deterministic session assembly from a selected archetype plus ranked drill families
- Template-based session assembly that supports a short `10-15` minute starter session first, then simple `15 / 25 / 40+` time profiles for trusted repeat use
- AI must not be used for session generation or load planning. If used, it is constrained to copy-only explanations of deterministic rules and rephrasing cues.
- Mobile run mode (large controls, timer, next, cues, score input)
- Local-first data ownership: all training data is device-primary, the local database is the source of truth, the app never requires a server to start, run, review, or adapt a session, Phase 1 requests persistent browser storage where available, and users can export their full training history in a durable format before any cloud dependency ships
- Session state contract: separate plan, execution, and review; lock the started plan snapshot; persist a durable active-block cursor and block statuses for resume
- Reliable courtside run under weak connectivity and interruption; exact multi-device sync architecture is deferred to implementation planning, but durability and resume semantics are not
- One-minute review (sRPE, one skill metric, short notes)
- Visible deterministic reasoning where it matters: one line for why today's session fits and one line for why the next step stayed the same, got lighter, or got harder
- Post-session handoff that leaves the athlete clearer about what to do next, not just that the session was saved
- Duplicate and edit previous sessions
- Trusted solo/pair fallback at the drill or session level before a plan is treated as usable
- Session validation: block durations sum to session duration, drills match participant and equipment feasibility, and workload fits level
- Safety contract: mandatory pre-session safety check (pain flag + training recency), sRPE-load as internal load primitive, mandatory warm-up/cool-down blocks, stop/seek-help triggers accessible offline, conservative defaults for unknown preparedness, and regulatory positioning as general training support (see D82-D88 and `docs/specs/m001-adaptation-rules.md`)

### Should-have

- Shallow longitudinal layer: a next 2-6 sessions queue, not a full calendar or periodized season builder
- Minimal weekly receipt: planned-vs-completed sessions, one load proxy (session RPE x minutes), one skill proxy; framed as a confidence and investment layer, not an analytics dashboard
- Lightweight accumulation / carry-forward surfaces that make "something is in the book" visible without turning the product into a dashboard
- Constraint-aware swap recommendations for partner no-shows, weather, and time cuts
- Simple baseline tests for serve, pass, and set tracks

### Should-have (gated on post-M001 self-coached strength)

- Coach clipboard on the shared backbone: assign a structured session, see whether it happened, get a tiny outcome signal, adjust the next session's progress/hold/deload — no roster admin, payments, or video

### Not now

- 3+ player session assembly and drill selection (tracked as D101 for post-M001; the system should eventually handle whoever shows up, but M001 scope is 1-2 players)
- Social/community feed or community challenges
- Recruiting/tournament tooling
- Heavy team administration suite
- Persistent partner / team identity layer (durable `Team` object, shared progression, tagging / sharing / invite / visibility UI) — tracked as `O13`; gated on all four `D117` conditions and on the forward-compatible hooks in `D115`/`D116`. M001 and v0b stay on `playerCount: 1 | 2` with no partner identity. See `docs/research/persistent-team-identity.md`.
- Full video analytics or computer vision stack
- Autonomous AI coaching decisions
- Open-ended AI coach chat as primary UX
- Centralized coach marketplace or on-demand expert network
- Rich gamification as a core retention system
- Monetization implementation (freemium/subscription/IAP — captured in research for later)

## Success metrics (first 90 days, draft hypotheses)

These are broader product hypotheses, not the literal go/no-go gate for Phase 1 completion. Phase-level exit criteria live in `docs/roadmap.md`.

- Median time-to-first-useful session start under 3 minutes for new users
- At least 40 percent of new users complete the starter session
- Median time-to-first-session-created under 5 minutes
- Median time-to-ready-to-run under 2 minutes for repeat users
- At least 60 percent of new users complete 2+ sessions in first 14 days
- At least 50 percent of completed sessions include post-session review
- At least 40 percent of active users log a skill metric in week 2
- At least 30 percent of repeat users start another session from the app's suggested next-step path within 7 days without human prompting
- At least 40 percent of repeat users report the app replaced or meaningfully reduced their use of notes, PDFs, or memory for training
- Week-8 retention above 30 percent among users who completed 2+ sessions

## Courtside UX requirements

These are non-negotiable for on-court usability (see research for full rationale):

- M001 defaults to one light, high-contrast theme. Dark mode is deferred until outdoor testing shows a real need.
- Live-session text should stay readable in direct sun / beach glare, with near-black text on white or off-white surfaces and strong contrast for timer digits, block titles, rep counts, and primary controls.
- Use the system sans stack. Body text never drops below `16px`, `18px` is preferred for run-mode labels, section headings are `20px+`, and timer / rep digits should land around `56-64px`.
- Touch targets use a `54-60px` baseline with `8-16px` spacing for sandy and sweaty hands.
- Minimal taps: one prominent `Next` to advance, adjacent `Pause`, and no typing during the active run flow.
- The active drill screen shows only the current block label, one cue, timer or rep target, current progress, and primary controls.
- Between-block, prep, and review views can add concise context, but they should still feel calm and tap-first rather than dashboard-like.
- Audio or haptic cues for countdowns and transitions are desirable if outdoor testing proves they are noticeable without becoming noisy.

## Product principles

Canonical principles live in `docs/vision.md`. The following are implementation-level guardrails:

- Human owns final plan; AI is excluded from the critical path and cannot affect session generation, volume, or progression logic.
- Every recommendation is constraint-aware.
- Setup questions are recommendation controls, not profile completion. If a question does not visibly change today's plan or satisfy safety, defer it.
- Feedback feeds forward into the next planning cycle.
- Review and summary must produce a visible carry-forward, not a dead-end confirmation screen.
- Safety and load awareness are default behavior, not optional features. Safety is enforced by workflow structure (pre-session gates that shape defaults), not by copy-only disclaimers. The product must gate sessions on a binary pain flag and training recency, compute sRPE-load (RPE × duration) as its internal load primitive, enforce mandatory warm-up/cool-down blocks, and make stop/seek-help triggers accessible from any session state. See `docs/specs/m001-adaptation-rules.md` for the full safety contract.
- The product is general training support, not medical advice. It does not diagnose injury, treat conditions, compute injury-risk scores, or provide return-to-play guidance. Copy follows standard fitness-industry "not medical advice" patterns. See D86.
- Device-primary storage: the local copy is the source of truth. Any future cloud layer is a supporting peer for sync and backup, not an authority the app depends on to function.
- Export and portability: users must be able to export their training history (sessions, reviews, metrics) in a standard durable format before the product introduces any cloud dependency.

## Resolved questions

These were previously open. Answers are drawn from research and product discussions.

- **Which skill tracks ship first?** The first implementation-ready slice stays in the pass / serve-receive family. For M001, solo sessions should be framed as passing fundamentals and pair + net sessions should carry the highest-trust serve-receive transfer work. Serve and set are near-following tracks, but they are not required for the thinnest initial milestone.
- **What minimum drill metadata is required?** See drill metadata section above. The contract stays at 12 required fields, but several of those fields must be structured objects so deterministic assembly can reason about goal tags, environment sensitivities, load flags, difficulty tier, and transfer realism.
- **Solo vs pair optimization?** Solo-first with pair-compatible variants. Drills should have solo variants wherever possible, be clearly marked when pair-only, and treat partner + net sessions as the primary route to true serve-receive transfer.
- **What environment does "solo" assume?** Default to **open sand with a ball** (archetype `solo_open`), not wall access. Wall-dependent drills are conditional inventory, available only when the user explicitly indicates a wall in the pre-session context. The solo archetype priority is `solo_net` > `solo_wall` > `solo_open` per D103: net wins when toggled, wall is reached only when explicitly toggled without net, and open is the default. See D102 and `docs/research/solo-training-environments.md`.
- **What adaptation logic ships first?** Rules-first. Transparent rule-based progression and deload logic is the only acceptable baseline.
- **What AI assistance belongs in Phase 1?** None in the critical path. It may only be used for optional, copy-only explanation of deterministic 'why' logic or rephrasing cues.
- **What are the first planning defaults for adaptation?** Use explicit pass-first `progress / hold / deload` rules. See `docs/specs/m001-adaptation-rules.md`.
- **What periodization depth belongs in the first build?** M001 stays focused on the single-session loop. The broader Phase 1 envelope may extend into a shallow next 2-6 sessions queue once the run/review loop is trusted, but not a full calendar or periodized season builder. Richer multi-week planning and competition-prep structures are Phase 1.5+ concerns.
- **What review inputs ship first for safety and adaptation?** Start with sRPE plus one skill metric. Use a `0-10` CR10-style sRPE prompt with delayed capture preferred when practical. Soreness and wellness inputs can be added later if they prove low-friction and useful.
- **What pass metric should M001 trust first?** Use binary `Good` / `Not Good` scoring with `attemptCount` for pass-scored sessions. Do not make the full `0-3` pass-quality rubric the default M001 metric.
- **What belongs in first-run onboarding?** Only the inputs that materially change the starter session: skill level and today's player count. Default the first focus to passing fundamentals for serve receive and defer broader intake until after first-session value is proven.
- **How deep must launch fallback go?** Use both metadata and curated solo/pair variants for drills where player mode changes execution.
- **Do demo clips or GIFs ship in M001?** No. Keep the first run loop text/cue/timer-first.
- **What is the target validation-phase stack?** Vite + React + TypeScript + Tailwind CSS + PWA shell, with IndexedDB via Dexie.js for local-first storage during the validation phase.
- **What minimum session-state contract must exist before implementation?** Separate plan, execution, and review; lock the plan at start; persist active block cursor, block statuses, and timing anchors for interruption-safe resume.
- **How durable must the web-first local store be?** Treat IndexedDB as canonical but still request persistent browser storage where supported, and keep user copy explicit about `Saved on device` versus any future backup or sync state.
- **How should drills encode solo feasibility?** Use structured participant roles, equipment requirements, environment sensitivities, transfer notes, and curated variants rather than relying on freeform instructions alone.
- **What is the seed drill-library target?** 20-25 launch drill families, enough to support a believable solo-first pass loop if each family has parameterized variants and swap-compatible alternatives.

## Open questions

- What exact coach premium model should follow the shared backbone? **Directional lean 2026-04-16**: BYOC-lite coach clipboard with athlete-side monetization first (`D106`, `D107`); centralized expert / Future-style access is explicitly not a default candidate. Open details are the pricing shape of the "coach-connected" athlete tier and the threshold of coach-side usage that would justify adding a coach seat SKU (see `D108` and `docs/research/coach-facing-business-models.md`).
- How opinionated should the first multi-week planning surface be for self-guided users versus coaches?
- What is the smallest useful weekly progress surface that supports multi-week plans without turning the product into a dashboard?
- What exact sRPE-load change caps and deload thresholds are appropriate for amateur beach sessions? (Needs sports scientist/S&C review)
- What minimum warm-up/cool-down content and duration is appropriate? (Needs volleyball coach review)
- What is the exact wording for pain flag, stop triggers, and disclaimer copy that maintains general-wellness intent? (Needs legal/compliance review)

## For agents

- **Authoritative for**: product scope, workflow, object model, MVP requirements, courtside UX requirements, drill metadata spec.
- **Edit when**: scope, object model, drill metadata contract, success metrics, or courtside UX requirements change.
- **Belongs elsewhere**: principles and strategic stance (`vision.md`), decision status (`decisions.md`), phase sequencing (`roadmap.md`), milestone-specific behavior (`docs/specs/`).
- **Outranked by**: `vision.md` and `decisions.md`.
- **Key patterns**: the object model names (e.g., `SessionArchetype`, `DrillVariantLink`) and the drill metadata field list are referenced by specs and implementation. Check `docs/specs/m001-session-assembly.md` and `docs/research/dexie-schema-and-architecture.md` when changing them.