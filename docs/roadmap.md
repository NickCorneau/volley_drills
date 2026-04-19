---
id: roadmap
title: Roadmap
status: draft
stage: planning
type: core
authority: phase sequencing, exit criteria, local-first capability ladder, validation experiments, risk mitigations
summary: "Phased delivery plan with exit criteria, validation experiments, and local-first capability ladder."
last_updated: 2026-04-19
depends_on:
  - docs/vision.md
  - docs/prd-foundation.md
  - docs/decisions.md
  - docs/research/coach-facing-business-models.md
  - docs/research/persistent-team-identity.md
  - docs/research/srpe-load-adaptation-rules.md
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

The most plausible first coach-facing extension is a **BYOC-lite coach clipboard**: the athlete invites their existing external coach, and the coach gets a narrow surface — assign a structured session, see whether it happened, get a tiny outcome signal, and adjust the next one. The platform does not recruit, match, pay, or QA coaches. Monetization starts on the athlete side as a "coach-connected" tier; a coach seat SKU is not shipped until repeated weekly coach usage is observed (see `D106`, `D107`, `D108`). This extension is gated on M001 proving strong repeat usage and on the post-M001 self-coached layer showing real main-tool pull. It should not enter active development until that gate clears.

The self-coached path must win on **joy, trust, and investment**. The product should feel light on the surface, serious underneath: fast to start, calm to use, honest about why it made a choice, and worth returning to as a weekly training home rather than a pre-training form.

## Local-first capability ladder

The product is local-first by principle (see `docs/vision.md`). The phases below sequence the local-first capabilities from simplest to most complex:

1. **Phase 1 — Single-device trust and courtside reliability.** The device is the only copy. All core workflows work without any network connection. Data is stored locally via IndexedDB/Dexie.
2. **Phase 1.5 — Ownership, deeper adaptation, and optional cloud-peer sync.** Users can export their full training history in a durable format, see a deeper self-coached progression layer, and optionally use an encrypted cloud peer for backup and relay without changing the local-first source of truth.
3. **Phase 2 — Gated coach clipboard and async coach share.** Coaches receive and act on structured session snapshots only after the self-coached loop proves strong repeat use and main-tool pull.
4. **Later — Richer coach expansion and real-time collaboration, only if validated.** Academy tooling, advanced coach surfaces, and CRDT-style collaboration arrive only when the product proves a need for them.

## How to use this roadmap

This document is phase-level. It should guide sequencing and validation, but execution should happen through milestone charters under `docs/milestones/`.

Phases are not 2-week sprints. Milestones are outcome-based slices that can complete, block, or be deferred independently.

The v0b Starter Loop under `app/` is **feature-complete** as the D91 field-test artifact (see `D119` in `docs/decisions.md`); Phases A, B, C, E, and F all landed through 2026-04-19. The D91 field-test gate is now the blocking next step for M001. Milestone charters and explicit gates still govern sequencing.

## D91 artifact note

v0b is the **D91 field-test artifact**, not the full product contract. When v0b cuts or defers richer explanation surfaces, session history, or weekly-confidence layers to keep the field test clean, treat those as validation-time concessions rather than as long-term product rejection. The first post-D91 self-coached follow-on should restore the smallest versions that increase joy, trust, and investment without turning the app into a dashboard.

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

Goal: validate the self-coached primary loop while learning which coach-facing workflow is worth layering onto the same backbone, and determine whether the app feels good enough, trustworthy enough, and worth investing in as a weekly training tool.

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

Research (see `docs/research/beach-training-resources.md`, pre-build validation findings) establishes that stated interest and waitlists are insufficient evidence for building M001. The primary unknowns are behavioral and contextual — whether users will use a phone courtside, whether solo sessions work in real environments, whether they return next week, and whether the product feels like a tool they would actually adopt. The evidence bar for the self-coached path should start with **actual repeat behavior** (second-session retention), then be interpreted through joy, trust, and investment signals rather than enthusiasm alone.

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
- At least one self-coached participant shows a clear replacement or conviction signal (`would use this instead of notes/PDFs/memory`, `would be disappointed if it disappeared`, or `scheduled the next session without prompting`)
- At least one coach or sports physio review of initial sessions and deload logic
- Decision on:
  - the first coach-facing extension to support
  - confirmation that the coach extension should take the BYOC-lite shape (`D106`, `D107`) or, if evidence warrants, a revision of that shape; centralized expert access is explicitly not a default candidate
- If coach demand is promising, carry it forward as a shared-backbone extension rather than a product fork
- A final readout that includes a named joy / trust / investment interpretation alongside the D91 retention math

### Phase 1 (45-120 days): Shared-Core MVP — Single-Device Trust And Courtside Reliability

Goal: ship the smallest useful self-coached version that is trustworthy on one device, enjoyable enough to open again, and strong enough to preserve the shared backbone for later coach-led extension. Full scope defined in `docs/prd-foundation.md` MVP section.

Local-first focus: device-primary storage, zero server dependency for the core loop, and persistent browser storage where supported.

Current planning default for the first implementation-ready milestone: solo-first flow with lightweight pair fallback and a passing-fundamentals-for-serve-receive first track. The broader MVP envelope may grow into a shallow next-N session queue and a minimal weekly receipt, but coach-led overlays remain downstream of **M002 Weekly Confidence Loop** and the coach gate in Roadmap intent. Inside Phase 1, **M001** proves the runner loop and **M002 Weekly Confidence Loop** makes the product feel worth returning to before any coach-connected build begins.

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
- Bounded visible reasoning: one line for why today's session fits and one line for what happened to the next step
- Post-review handoff that leaves the athlete clearer about what to do next
- Shallow longitudinal layer: a next 2-6 sessions queue, not a full calendar or periodized season builder
- Minimal weekly receipt: planned-vs-completed sessions, one load proxy (session RPE x minutes), one skill proxy; framed as a confidence and investment layer, not an analytics dashboard
- Session object model kept extensible for future coach clipboard sharing, but no coach-facing UI or admin in Phase 1
- Device-primary local storage via IndexedDB/Dexie with no backend dependency; the entire core loop works offline
- Raw training-history export (JSON at minimum) is available before any cloud dependency or coach-share layer asks the user to treat the app as where training lives
- Persistent browser storage requested on a real user gesture (not at module load) where supported, with **posture-sensitive** `Saved on device` copy that distinguishes the three runtime durability states per `D118` (browser tab / installed-not-persisted / installed-persisted) and never uses `synced` or `backed up` language before a cloud peer exists
- Production-only storage diagnostics harness on the real HTTPS origin exercised against the four real-iPhone cohorts defined in `docs/research/local-first-pwa-constraints.md` (Safari tab / HSWA daily / HSWA idle / HSWA under storage pressure), plus the Safari→HSWA migration cohort, before release copy claims durability beyond `Saved on this device` (`O18`)

Exit criteria:

- Median time-to-first-useful session start under `3` minutes for new users
- At least `40` percent of new users complete the starter session
- Median time-to-first-session-created under 5 minutes
- Median time-to-ready-to-run under 2 minutes for repeat users
- At least 50 percent of completed sessions include review completion
- Strong repeat usage signal from the primary wedge
- Users trust deterministic drafting because outputs are editable and strictly follow safety rules
- Users understand why today's session fits and what the next step means without needing a dashboard explanation
- At least one user reports the product feels like a training home worth returning to, not just a timer they finished once
- At least one user can queue a week of sessions and see a weekly receipt without the experience degrading the quick session loop
- The full run/review loop works with no network connection
- An in-progress session can be resumed after app backgrounding or relaunch without silent loss of the active block
- Local-save copy is posture-sensitive (three states per `D118`); installed HSWA with `persisted() === true` reports the strongest local durability state WebKit exposes, and no surface claims more than that without a cloud peer

### Phase 1.5 (120-210 days): Ownership, Deeper Adaptation, And Optional Cloud-Peer Sync

Goal: deepen self-coached longitudinal value, give users durable data ownership, and sharpen adaptation once the weekly-confidence layer is working.

Local-first focus: export/backup guarantees, optional cloud peer for cross-device sync.

Scope (self-coached, always):

- Slightly more opinionated week-shape planning and transparent progression/deload suggestions. When activated, use the PoST framework (Coordination -> Skill Adaptability -> Performance) as the periodization macro vocabulary layered on top of the deterministic sRPE-load micro governor defined in `D113` (`baseline3` / `peak30` / rolling-14d bands and history phases in `docs/specs/m001-adaptation-rules.md`). See `docs/research/periodization-post-framework.md` for the macro mapping and `docs/research/srpe-load-adaptation-rules.md` for the micro bands. This resolves `O2` without inventing a new framework.
- Baseline tests for core skills. Frame the weekly-receipt skill proxy (`D74`) as retention across non-consecutive days, not last-session hit rate, so the signal tracks skill rather than same-day grooved reps.
- Constraint-aware substitutions by intent
- Full training-history export in a standard durable format (JSON at minimum)
- Optional cloud peer for encrypted backup and cross-device relay; the cloud peer is never the source of truth

Exit criteria:

- Self-coached users who use the weekly receipt retain meaningfully better than session-only users
- Users report higher confidence in what to train next
- Users report stronger replacement signals ("this is where my training lives") than they did at the M001 gate
- Safety and trust complaints remain low
- Users can export their complete training history without data loss
- If a cloud peer is added, the app continues to function fully when the peer is unreachable

Note:

- These are the phase gates. Broader product KPI hypotheses live in `docs/prd-foundation.md`.

### Phase 2 (210+ days): Gated Coach Clipboard On The Shared Backbone

Goal: extend the proven self-coached main-tool loop to a BYOC-lite coach connection without degrading the core solo workflow.

Local-first focus: async coach share and review on local-first rails. Real-time collaborative editing is deferred until validated.

Validation gate for coach clipboard: Phase 2 coach work should only begin if self-coached evidence shows strong repeat usage (multiple sessions per user across weeks), review completion above 50 percent, and behavioral main-tool pull in the weekly-confidence layer (for example: suggested-next-step reuse, queue use, or stronger multi-week retention among users who completed 2+ sessions). If that gate does not clear, remain in self-coached hardening rather than advancing to coach build.

Candidate scope:

- Athlete invites their existing external coach via email or share-code; permissions are scoped to that athlete only
- Coach assigns a structured session from the same drill library and constraints
- Athlete runs it courtside and submits the standard <60s review
- Coach sees whether the session happened, the tiny outcome signal (compliance, load, skill proxy), and can approve or modify the next session's progress/hold/deload
- Async, proposal-based sharing on local-first rails; no live co-editing, no roster admin, no payments, no coach discovery, no coach matching, no take rate
- Monetization remains **athlete-side only** in this phase (a "coach-connected" athlete tier per `D107`). No coach seat SKU

Decision metrics (per `D108`, required before any richer coach-side expansion is scheduled):

- Attach rate among paid athletes (fraction who invite a coach)
- Invited-coach activation rate (fraction of invited coaches performing at least one assign / comment / completion-check action)
- Weekly coach actions per attached athlete (live rail vs dead infrastructure)
- Retention delta between matched athlete cohorts with vs without a connected coach (is coach presence lifting `D91`-style repeat use)

Guardrail:

- No expansion should degrade the speed, reliability, or simplicity of the core run loop.
- Coach sharing must not make the cloud a required dependency for the solo user's core loop.
- Real-time collaborative editing (CRDTs, OT) is only adopted if the product validates a concrete need for concurrent multi-user editing on the same object.

### Later: Richer Coach Expansion And Optional Advanced Features

Candidate scope:

- Richer coach-led and coach-organizer support
- Optional premium coach access if the model proves real demand
- Optional video import hooks
- Deeper analytics and benchmarking

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
- Visible carry-forward and next-step confidence surfaces
- Baseline skill tests
- Constraint-aware swap recommendations
- Template packs for common intents

## P2 - Coach-connected and later expansion

- Coach clipboard (gated on M001 + post-M001 self-coached strength): assign, review completion, adjust next session
- Local academy / multi-athlete tooling (scheduling, packages, group sessions, simple rosters) — considered only after the four `D108` decision metrics move materially on the BYOC-lite clipboard
- Coach seat SKU — considered only after repeated weekly coach usage is observed across multiple athletes (`D107`)
- Priced hybrid marketplace surface, if ever added, must be treated as a separate acquisition business with explicit coach-attributed vs platform-attributed economics (TrainHeroic template)
- Collaboration and sharing features
- Persistent pair identity (`Team` entity, shared progression, layered consent ledger) — gated on all four `D117` conditions (measurable recurrent-pair behavior from session participant data, indirect team-affordance demand, healthy trust metrics, selection-bias-resistant uplift evidence); implemented on the forward-compatible `SessionParticipant[]` / `PlayerProfile` / `TeamConsent` shapes defined in `D115`/`D116`, not on ad-hoc partner-name fields. Should not ship before coach-share (`D106`) and multi-week planning (`O2`). See `docs/research/persistent-team-identity.md`.
- Video/stat ecosystem hooks
- Rich longitudinal analytics
- Heavier gamification

Explicitly not a P2 candidate:

- Centralized coach marketplace / platform-sourced coach network (Future-style on-demand expert access). Listed in `docs/decisions.md` "Ruled out (for now)" per `D106` and `docs/research/coach-facing-business-models.md`; revisitable only on strong post-clipboard pull evidence.

## Validation experiments

### Pre-build (Phase 0 — riskiest assumptions first)

- Phone courtside viability test: will target users actually pull out their phone on sand and follow a structured runner, or do they prefer memory, printouts, or going tech-free?
- Solo feasibility test: can users complete a solo passing session in their real environment, or does "solo" depend on a wall/rebounder that many beaches lack? The operational default is now `solo_open` (self-toss on open sand) per D102, so the test is specifically: does the open-sand default session feel complete and trainable, and how often do testers actually toggle `wall available = yes`? Split tester self-reports by `beach / open sand / indoor / home` to validate the environment mix estimated in `docs/research/solo-training-environments.md` before any UI weighting leans on the percentages.
- Second-session retention test: does the validation cohort meet the `D91` repeat-use bar within 14 days without redefining success around softer signals? (The critical gate for M001 green-light.)
- Reflection compliance test (in-context): does one-minute review hit at least 50 percent completion when the user is tired and sweaty courtside?
- Offline relevance test: do target users actually hit connectivity issues at their training locations often enough to justify offline-first architecture cost in M001?
- Binary-score progression-gate validation (`O12`): at rolling N = 20/50/80/100 per drill-variant, does the Bayesian posterior rule `D104` relies on (gate at `P(p_corrected ≥ 0.70) ≥ 0.80` — i.e., `38/50` corrected, `41/50` raw pre-calibration proxy, `42/50` for injury-sensitive) match tester behavior, and does self-scored agreement against partner or video review actually sit near the `+5` pp generic / `+8` pp injury-sensitive bias priors? Also: do 50 scored contacts accumulate responsively enough at 1–2 sessions/week, and does the 10-second borderline-count review survive real courtside attention? Resolution depends on v0b shipping V0B-12 (drill-variant review grain) and V0B-15 (raw review-records JSON export) so tester data can be replayed at rolling N. See `docs/research/binary-scoring-progression.md` and `docs/plans/2026-04-12-v0a-to-v0b-transition.md`.
- Warm-up dose compliance (`D85`, `D105`): do testers actually complete the default 3-min `Beach Prep Three` warm-up, or do they routinely shorten, skip, or end-early inside the wrap block? Measure completion rate, average elapsed time, and end-early reasons for the `warmup` and `wrap` blocks alongside session-level retention. Also collect qualitative reads on whether the Downshift framing matches what users expect from a post-session block. Secondary signal for whether the 25-min archetype should ever expand its warm-up ceiling (Phase 1.5 question, explicitly out of v0b per V0B-19). See `docs/research/warmup-cooldown-minimum-protocols.md`.
- sRPE-load band tester-acceptance (`D113`): replay the `D91` cohort's `ExecutionLog` + `SessionReview` + (once `V0B-23` lands) `actualDurationMinutes` through the precedence table in `docs/specs/m001-adaptation-rules.md`. Do the default +5-10% Progress band, the +10-15% conditional Progress band, the `peak30 × 1.10` novelty-spike rule, and the `curr14 / prev14 > 1.20` 14-day cap actually correspond to tester behavior (completion patterns, ended-early rates, self-reported fatigue, pain-flag recurrence)? Also: does the Conservative-bootstrap / Emerging-baseline / Trusted-baseline phase progression produce "Hold by default" reads that feel fair rather than patronizing, or do testers push back on never being auto-Progressed until session 5? Answered through `V0B-15` export + offline replay; no live engine required in v0b. See `docs/research/srpe-load-adaptation-rules.md`.

### Product-level (Phase 0 and Phase 1)

- Self-coached usability test: can a solo player or pair get to a believable session without outside help?
- First-run activation test: can a new user reach a believable starter session in `<= 3` minutes with only skill level and today's player-count choice up front?
- Recommendation-first onboarding test (`O11`, `O16`): does the user see a believable session before the app feels like a form, and which packaging of setup + safety preserves that feeling best? Run **sequentially**, not as a concurrent three-arm A/B. The `D91` cohort (5 testers) cannot support three arms without reducing each to noise. Phase 0 ships Variant A (`Skill Level -> Today's Setup -> Safety -> Run`, today's v0b first-open baseline) specifically to measure the cost of the **later reveal** versus the intended product contract. Measure first-value reveal, time-to-first-warm-up, per-step drop-off, pain-branch completion, and qualitative "useful vs in the way" reads. Variant B (folded safety inside `Today's Setup`, branching only on a red flag) is a **Phase 0 follow-on**, run against a separate cohort only if Variant A evidence shows the standalone safety step is a real activation cost. Variant C (minimum-gate before Run plus a post-first-session profile prompt) is a **Phase 1 or Phase 1.5** question; it needs enough population to split without losing signal and introduces scope (post-session profile surface) that v0b intentionally does not ship. See `docs/research/onboarding-safety-gate-friction.md`.
- Coach clipboard usability test: can a coach assign a structured session, see whether it happened, get a tiny outcome signal, and adjust the next one — without roster/admin/payments/video?
- Weekly receipt retention test: does a planned-vs-completed weekly summary plus one load and one skill proxy keep self-coached users coming back more than session-only users?
- Trust test: are deterministic drafts accepted, and do users understand why today's session fits and what the next step means, even with bounded explanations?
- Review payoff test: does finishing review feel worth the effort because it leaves the user clearer about what to do next?
- Main-tool pull test: do users say they would use this instead of notes, PDFs, or memory, and do they schedule or start the next session without prompting?
- Coach commercial model test: does BYOC-lite (athlete invites their existing coach, athlete-paid "coach-connected" tier) read as a believable premium path? Centralized expert access is no longer a default candidate (`D106`, ruled-out list); if a coach interview unprompted asks for platform-sourced matching, capture it as anomalous evidence rather than route the product toward it.

## Risks and mitigations

- Self-coached loop gets diluted by coach requirements: keep the shared backbone, but stage coach overlays after the core run/review loop is trusted
- Coach demand pushes toward a marketplace too early: validate paid coach workflows before building supply/demand mechanics
- Over-complex UX: keep screens task-first and remove low-frequency controls
- Weak data quality: enforce minimum metadata and validation at object boundaries (12 required drill fields)
- AI reliability concerns: exclude generative AI from load planning; use purely deterministic rules
- Logging fatigue: keep review capture under 60 seconds and pre-fill where possible
- Activation friction: defer nonessential intake, sign-up, permissions, and rich metric education until after the first quick win
- Scope creep: do not build rich coach admin, marketplace, or media extras before the shared self-coached loop is trustworthy
- Over-coaching failure mode: for a self-coached product, the app is effectively the coach. Dense in-drill cues, feedback on every touch, and long technical checklists blunt the athlete's own error detection and hurt retention (guidance-hypothesis literature). Mitigate by limiting active cues per block (D51 plus the two-active-cues editorial rule in `docs/prd-foundation.md`), validating cue cadence in tester sessions (`O14`), and treating verbal feedback as a scarce resource rather than continuous narration.
- Retention illusion: drills that look clean in-session can fail to retain across non-consecutive days. Progressing on same-day cleanliness produces false confidence and brittle next sessions. Mitigate by the "2 completed sessions on different calendar days" progression gate (`docs/specs/m001-adaptation-rules.md`) and by framing the weekly-receipt skill proxy (`D74`) as retention across non-consecutive days, not last-session hit rate.
- Low-N progression illusion: a single-session "70% `Good`" looks like progress but is dominated by binomial noise and directional self-scoring lenience (generous on harder/ambiguous tasks; operational priors `+5` pp generic / `+8` pp injury-sensitive). Even at observed 70%, `P(true p ≥ 0.70)` stays near `0.49` at any sample size. Mitigate by `D104`'s 50-attempt Bayesian posterior gate (`38/50` corrected, `41/50` raw pre-calibration proxy, `42/50` for injury-sensitive) with `P(p ≥ 0.70) ≥ 0.80`, hysteresis on the downside (near-miss holds rather than deloads), and by v0b backlog items V0B-11 (no-signal floor on session summary), V0B-13 (show N alongside any %), and V0B-14 (set-window marker as a real setup step, not a spec-only artifact). Evidence: `docs/research/binary-scoring-progression.md`.
- Novelty-spike illusion on sRPE-load: a "crushed it" session whose `session_load` exceeds +10% of the prior 30-day peak is exactly the shape the post-ACWR literature associates with higher injury rates in runners, and is also the shape a naïve "progress on good feelings" heuristic would silently reward. Mitigate by `D113`'s precedence-ordered rule table in `docs/specs/m001-adaptation-rules.md` (rule 7: `session_load > 1.10 × peak30` → Deload; rule 8: `> 1.15 × baseline3` → Deload; rule 9: `curr14 > 1.20 × prev14` → Deload) plus the minimum-history phases (bootstrap never auto-Progresses, emerging caps Progress at +5-10%), the product-envelope "high absolute" guardrail (`> 130 AU` never auto-Progresses), and by using `V0B-15` export + `V0B-23` `actualDurationMinutes` to replay the rule before any richer user-facing explanation claims more confidence than v0b earns. Evidence: `docs/research/srpe-load-adaptation-rules.md`.
- Locked-plan failure mode (prescribed side): expiring workouts, schedule rigidity, heavy surveys, and opaque adaptations that feel arbitrary drive churn even when the programming itself is good (Zwift backlash on timing rigidity, subsequent flexibility update; Freeletics drift toward more bounded flexibility in 2025). Mitigate by keeping edits bounded but real at session-prep (swap drill, shorten block, switch archetype before lock) and in-session divergence (swap, skip, end-early, pause, resume per `D37`), by surfacing bounded deterministic why at the moments that exist today (answer-first safety copy, summary copy, repeat/setup banners), and by restoring richer draft-level and next-step explanations in the post-D91 self-coached layer rather than leaving them cut permanently.
- Empty-scaffold failure mode (flexible side): a capable logger with no obvious next-best session offloads programming back onto the user, which only works for the self-directed experienced segment (Hevy, parts of Strava). Mitigate by keeping the app authoritative on session assembly (`D6`, `D11`, `D98`), by always having a believable starter for first-run users (`D46`), and by gating any reduction in opinionatedness on actual field evidence that users want more control rather than assuming they do. Evidence: `docs/research/prescriptive-default-bounded-flex.md`.
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