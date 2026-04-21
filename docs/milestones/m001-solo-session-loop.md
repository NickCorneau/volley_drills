---
id: M001
title: Solo Session Loop
status: draft
stage: planning
type: milestone
authority: M001 thin-slice scope, acceptance evidence, pre-build validation gate
summary: "Thinnest believable end-to-end solo session loop for pass / serve-receive."
last_updated: 2026-04-20-d
depends_on:
  - docs/prd-foundation.md
  - docs/decisions.md
  - docs/roadmap.md
  - docs/discovery/phase-0-wedge-validation.md
  - docs/research/d91-retention-gate-evidence.md
  - docs/plans/2026-04-20-m001-tier1-implementation.md
  - docs/plans/2026-04-20-m001-adversarial-memo.md
  - docs/research/founder-use-ledger.md
  - docs/research/partner-walkthrough-script.md
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
  - D129
  - D130
open_question_refs:
  - O4
  - O5
  - O6
  - O7
---

# M001: Solo Session Loop

## Agent Quick Scan

- Use this doc when you need M001 scope, current gate status, acceptance evidence, or the smallest reliable statement of what belongs in the first build.
- **Current mode (2026-04-20, `D130`): founder-use mode.** M001 is being built for founder + partner weekly use. The `D91` retention gate is **deferred**, not dropped — it is preserved as the canonical bar for a future stranger launch and returns to the critical path at the 2026-07-20 re-eval. Build authority comes from founder conviction plus a partner walkthrough, not from D91 cohort data.
- Status: v0b Starter Loop is **feature-complete** as a D91 field-test artifact (`D119`); Phases A, B, C (C-0 → C-5), E, and F (F1 – F12) all landed through 2026-04-19. Under `D130` the build proceeds in tiers **against the full M001 product contract**, not against the v0b artifact shape. The tier structure was rescoped on 2026-04-20 after the red-team review (`docs/reviews/2026-04-20-m001-red-team.md`) surfaced scope-ballooning, SetupScreen formification, and architectural breaks in the earlier single-Tier-1 plan.
  - **Tier 1a (minimum shippable content + safety base):** warmup authoring bug fix (single drill `d28 Beach Prep Three`); setting minimum probe (3 drills — `d38 Bump Set Fundamentals`, `d39 Hand Set Fundamentals`, `d41 Partner Set Back-and-Forth` — with `chain-7-setting` and zero progression links in Tier 1a); skill-vocabulary audit with inline parenthetical definitions on first BAB-specialised-term occurrence; "Chosen because:" single-sentence rationale on each RunScreen block; last-3-sessions row on Home. **No new SetupScreen toggles** (P11 / D123 compliance). **No focus-routing architecture.** **No pair opening-block.** Full work breakdown in `docs/plans/2026-04-20-m001-tier1-implementation.md`. Source material archived in `docs/research/bab-source-material.md` (BAB) and `docs/research/fivb-source-material.md` (FIVB Beach Volleyball Drill-book — Jones & Dalanhese).
  - **Tier 1b (content expansion on logged demand):** capped at 10 additional drill records per `docs/plans/2026-04-20-m001-adversarial-memo.md` anti-displacement cap. Likely candidates: serving ladder `d31 Self Toss Target Practice`, `d33 Around the World Serving`, `d36 Jump Float Introduction`; setting chain `d40 Footwork for Setting`, `d42 Corner to Corner Setting`, `d43 Triangle Setting`. Progression links added to serving and setting chains with dead-end fixes (pair-vs-solo branching on Rung 1 of serving; parallel unlock of jump-float rung; default-unlocked setting fundamentals). Pair opening-block (`d30 Pair Pepper Progression` + `pair_long_warmup` archetype variant) ships here **only** if partner walkthrough returns it as ≥P1.
  - **Tier 1c (focus-toggle architecture, evidence-gated):** `sessionFocus` context field, dynamic `slot.skillTags` override in `sessionBuilder.ts::pickForSlot` AND `findSwapAlternatives`, Swap-Focus button on the draft screen (NOT SetupScreen, per P11). Ships **only** when founder-use ledger or partner walkthrough shows behavioural evidence of focus-switching friction. Trigger thresholds documented in the Tier 1 plan.
  - **Tier 2 (deferred-surfaces unblock):** "See why this session was chosen" modal, richer summary copy, full session history screen, recommendation-first onboarding polish. Starts when Tier 1a acceptance bar passes AND the adversarial-memo Condition 3 (partner unprompted open within 30 days) passes, OR the Condition 3 failure consequence repoints Tier 2 scope.
  - **Tier 3+ (M002 territory):** weekly receipt, next-N queue, carry-forward — governed by `docs/milestones/m002-weekly-confidence-loop.md`, not by this doc.
- In scope: starter session assembly, courtside run flow, one-minute review, deterministic adaptation, and write-as-you-go local persistence — plus the Tier 1 and Tier 2 work now unblocked by `D130`.
- This doc distinguishes **D91 artifact compromises** from the intended M001 product contract. Under `D130` those compromises move from "preserved for later" to "Tier 2 work."
- Not for: implementation-level Dexie details, full sync architecture, or coach clipboard build work.
- Primary blockers: `O6`, `O7` in `docs/decisions.md`. `O4` (operational meaning of "solo") is operationally resolved by `D102` / `D103`; the remaining validation question there is deferred with `D91` under `D130`. `O5` (M001 evidence threshold) is superseded for the current decision point by `D130` and returns at the 2026-07-20 re-eval.

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

The v0b Starter Loop under `app/` is **feature-complete as a D91 field-test artifact** (`D119`). Phase A (schema), Phase B (test infra + SW safety), Phase C (schema → review contract → summary → onboarding → home priority → repeat path, plus red-team hardening and post-landing polish), Phase E (icons, JSON export, regulatory-copy audit, Brandmark), and Phase F (D91-validity hardening, Home CTA cleanup, Japanese-inspired calm pass, typography foundation, button + hover hygiene, brand hero + Inter self-host, UX consistency sweep) all landed 2026-04-17 → 2026-04-19. The v0b status registry lives in `docs/plans/2026-04-16-003-rest-of-v0b-plan.md` §1 and §6.

**Under `D130` (2026-04-20)** the product decision is no longer "ship v0b to a cohort, wait for D91 signal, then decide." The product decision is "ship the full M001 contract in tiers for founder + partner use, track the same retention signal locally, and re-evaluate the `D91`-stranger-launch question at the 2026-07-20 re-eval." The v0b artifact remains the code base being iterated on; the product contract being built against is M001, not v0b.

## D91 artifact vs M001 product contract (under D130)

v0b was intentionally smaller and quieter than the intended product so a D91 field test could answer the behavioral question cleanly. Under `D130` the four v0b simplifications move from "preserved for later" to **Tier 2 scope for the founder-use build**:

| v0b simplification | Status under `D130` | Tier |
| --- | --- | --- |
| No "See why this session was chosen" surface | Unblocked; build — one-sentence "Chosen because:" ships in Tier 1a (Unit 4); full See-Why modal is Tier 2 | Tier 1a (rationale) / Tier 2 (modal) |
| Minimum-honest summary copy instead of richer deterministic reasoning | Unblocked; build | Tier 2 |
| No session-history surface | Unblocked; build — last-3-sessions row on Home ships in Tier 1a (Unit 5); full history screen is Tier 2 | Tier 1a (row) / Tier 2 (full screen) |
| First-run risks feeling more form-first than recommendation-first | Unblocked; polish to `D123` posture | Tier 2 |
| No weekly receipt / minimal accumulation | **Stays deferred** — lives in `M002`, not here | M002 |

**The M001 product contract (unchanged under `D130`) still includes:**

- recommendation-first first-run and repeat-start posture (`D123`)
- visible deterministic reasoning where it helps trust
- review and summary that leave a clear next step
- a named post-M001 self-coached follow-on focused on weekly confidence before coach-connected work (`D124`)

**New in scope under `D130` Tier 1a (minimum shippable — full breakdown in the Tier 1 plan):**

- the `D105` warm-up authoring follow-up: author `d28 Beach Prep Three` with `skillFocus: ['warmup']`, extend the `SkillFocus` union, and fix `pickForSlot` to prefer warmup-focus drills in the warmup slot (the existing bug that surfaces pass drills in the warmup block is resolved)
- a **setting minimum probe**: three drill records (`d38`, `d39`, `d41`), a new `chain-7-setting` with no progression links yet, and a widening of `SKILL_TAGS_BY_TYPE.main_skill` and `.pressure` to include `'set'` so user-initiated Swap reaches setting content. The default session-generation path is **not** widened — single-focus-per-session remains the default behavior; setting is reachable only via the explicit Swap action.
- a **skill-vocabulary sweep** across `drills.ts` with inline parenthetical definitions on first occurrence of BAB-specialised terms (Pokey, Tomahawk, Sideout, High Line, Cut Shot, Pull Dig) so a partner who has not read the BAB glossary can follow every drill without pausing
- a **"Chosen because:" single-sentence rationale** on each RunScreen block, derived deterministically from the builder's ranking output (promoted from original Tier 2 scope because it is cheap and directly supports the partner walkthrough's trust-clarity signal)
- a **last-3-sessions row on Home**: date, inferred focus, completion Y/N, reading from Dexie `ExecutionLog` (promoted from original Tier 2 scope because it supports the adversarial memo's Condition 2 — keeps session history inside the app so the founder has no reason to keep it outside)

**Explicitly deferred out of Tier 1a (moved to Tier 1b, Tier 1c, or Tier 2 with specific behavioral triggers):**

- full 7-rung BAB serving ladder → Tier 1b, capped at ≤10 new drills total across Tier 1b
- full 8-rung setting chain → Tier 1b (same cap)
- pair opening-block option (`d30` + `pair_long_warmup` archetype variant) → Tier 1b, gated on partner walkthrough returning the need
- `Pass · Serve · Set` focus toggle → Tier 1c, and on the **draft screen** (not SetupScreen, per P11)
- `sessionFocus` routing architecture (dynamic `slot.skillTags` override) → Tier 1c
- "See why" modal, full session history screen, richer summary copy, recommendation-first first-run polish → Tier 2

## Pre-field launch checklist (v0b is code-complete; these remain)

Feature work on v0b is done. Status of the non-code items standing between the current build and the D91 cohort kickoff:

- [ ] Recruit the 5+ tester cohort per the operational protocol in `docs/research/pre-telemetry-validation-protocol.md` (recruitment script, consent, preregistered one-page decision memo frozen before kickoff).
- [~] **Founder export replay spot-check (partial — 2026-04-19).** Replayed `volley-drills-export-2026-04-19.json` (schemaVersion 4, one ended-early session from 2026-04-16 with an expired review swept on 2026-04-19). The envelope, plan snapshot, `ExecutionLog` shape, `V0B-30` capture-window fields, `V0B-31` expired stub, `D-C7` `status` field, and `H15` onboarding backfill all round-trip as specified. `actualDurationMinutes` is absent on that single log because the session ended 6.5 h **before** the Phase A commit (`8c7c92d`) landed `V0B-23`; the code path is correctly wired for new sessions (see `useSessionRunner.ts` + `computeActualDurationMinutes` in `services/session.ts`, with full Vitest coverage). Still worth a single post-Phase-F completion-with-RPE dogfeed export so the submitted-RPE + `captureWindow: 'immediate'` + `storageMeta.lastPlayerMode` path rides through at least once on real data.
- [ ] iOS 26 tinted/clear PWA icon spot-check on a real device (deferred from V0B-06 acceptance).
- [ ] Freeze the `docs/discovery/phase-0-wedge-validation.md` per-tester capture sheet and confirm which fields are in-app (auto-persisted) vs founder-tracked (out-of-band).
- [x] **"Add to Home Screen" install flow confirmed on the current public iOS line (2026-04-19).** Works well on the primary tested posture per `D57` (iOS 17+ with the current public iOS line at test time as the primary tested posture; as of April 2026, iOS 26.x).
- [x] App-store submission is **not required** — this is a PWA distributed via the Cloudflare Worker origin.

If any of these surface a real code bug (e.g., a broken export, a regression on current iOS), treat the fix as a v0b hotfix rather than a new phase.

## Pre-build validation gate (2026-04-12, superseded for the current decision by `D130`)

The original gate below was authored when a D91 cohort run was the precondition to M001 build. `D130` supersedes it for the current decision point: under founder-use mode, M001 builds in tiers on founder conviction + partner walkthrough, and the validation items below move to the **2026-07-20 re-eval** (or earlier if any `D130` early trigger fires). None of these items are rejected — they are the right checks for a stranger launch and remain canonical for that future decision.

Items preserved for the re-eval:

- **Phone courtside viability**: users actually pull out their phone on sand and follow a structured runner (vs. memory, printouts, or going tech-free). Founder + partner Tier 1 sessions supply n=2 signal in the meantime.
- **Solo feasibility**: the operational definition of "solo" works for users' real environments. Solo passing often depends on a wall or rebounder that many beaches lack; environment/equipment must be a first-class input.
- **Review completion**: the <60s post-session review is actually completed when tired/sweaty, and its signals produce a believable next-session adaptation.
- **Second-session retention**: a stranger cohort meets the D91 repeat-use bar within 14 days. Stated interest or waitlists are not sufficient evidence. A bare D91 pass is permission to keep testing, not proof of durable value; require at least one enrichment signal (unprompted return, >48h-gap second session, or third-session / concrete scheduling commitment) before treating the loop as validated. See `docs/research/d91-retention-gate-evidence.md`. This gate belongs to the **stranger-launch** question, not to the founder-use build.
- **Main-tool pull**: at least one tester shows a clear conviction or replacement signal (`I would use this instead of notes/PDFs/memory`, `I want the next session`, `I would miss this if it disappeared`) rather than only a one-off completion.
- **Safety baseline**: initial sessions and deload logic have been reviewed by at least one coach or sports physio. Physio review landed 2026-04-20 as `D129`; coach-review remains open and is one of the re-eval items.

## Target user and mode

- Primary path: self-coached solo user
- Required fallback: lightweight pair fallback so the system does not overfit to solo-only assumptions
- Deferred: richer coach-led, coach-organizer, and small-group workflows
- Initial skill anchor: passing fundamentals for serve receive

## In scope

- Ultra-lean first-run activation: skill level + today's player count, with passing fundamentals for serve receive as the default first focus
- A ready-to-run `10-15` minute starter session that feels like a real practice, not a setup wizard
- Broader context capture only when needed for edit or follow-on sessions: time profile, net, wall/fence, equipment, wind, and other trust-critical filters
- Mandatory pre-session safety check: binary pain flag (post-physio-review 2026-04-20 wording: "Any pain that's sharp, localized, or makes you avoid a movement?" with a DOMS-permission line — see `D129`), training recency with a progressive-disclosure layoff sub-row when "2+" is tapped, and contextual heat awareness CTA with warning-signs-first content (`D82`, `D83`, `D129`)
- Deterministic session assembly from fixed archetypes plus ranked fill from a structured drill library
- No AI in the critical path for session assembly or editing
- A starter drill pack centered on passing fundamentals for serve receive with solo-first drills and pair-compatible variants where appropriate
- **A BAB-authored serving ladder** on `chain-6-serving` (target shape: 7 rungs, float → jump-float, with BAB drill names and VDM stage naming; ships incrementally — existing 3 rungs (`d22`, `d23`, `d24`) in Tier 1a; likely early Tier 1b candidates `d31 Self Toss Target Practice`, `d33 Around the World Serving`, `d36 Jump Float Introduction`; full ladder is Tier 1b scope capped at 10 new drills across serving + setting; see Tier 1 plan deferred-scope table)
- **A BAB + VDM-anchored setting chain** (`chain-7-setting`) — target shape 8 rungs, but Tier 1a ships only the **minimum probe** of 3 rungs (`d38 Bump Set Fundamentals` solo, `d39 Hand Set Fundamentals` solo wall-optional, `d41 Partner Set Back-and-Forth` pair) with no progression links; the Bump Set / Hand Set split mirrors BAB Beginner's Guide Lesson 2; remaining rungs (`d40 Footwork for Setting`, `d42 Corner to Corner`, `d43 Triangle Setting`, `d44 Triangle Off Toss`, `d45 Pass/Set/Set/Set`) are Tier 1b content on logged demand
- **A session-focus single-focus invariant** (`Pass · Serve · Set`) — **not** surfaced as a SetupScreen toggle (P11 / D123 compliance); the Tier 1a posture is that the builder picks focus and the user may steer via the draft-screen Swap action. The full `sessionFocus` routing architecture plus a Swap-Focus button on the draft screen is Tier 1c scope, gated on behavioural evidence (see Tier 1 plan Tier 1c trigger section)
- **A pair opening-block option** — Tier 1b scope, gated on partner walkthrough returning ≥P1 need; when it ships it will be a new `pair_long_warmup` archetype variant carrying its own warmup budget, NOT a runtime compression of existing pair layouts (which would overflow 25-min session durations)
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

## Tier plan (under `D130` founder-use mode)

The scope above is the **M001 product contract**, unchanged. Under `D130` the build is staged so content can stabilize before surfaces and before any M002 work begins. Full Tier 1a / Tier 1b / Tier 1c work breakdown lives in `docs/plans/2026-04-20-m001-tier1-implementation.md`. Pre-registered falsification conditions and the re-eval decision rule live in `docs/plans/2026-04-20-m001-adversarial-memo.md`.

**Tier 1a — minimum shippable content + safety base** (active, 2026-04-20 onward):

- Warm-up authoring bug fix (`D105` follow-up): author `d28 Beach Prep Three`, extend `SkillFocus` to include `'warmup'`, fix `pickForSlot` warmup-slot preference. Single drill record in Tier 1a; `d27` and `d29` are Tier 1b.
- Setting minimum probe: three drill records (`d38`, `d39`, `d41`) in new `chain-7-setting` with no progression links; `SKILL_TAGS_BY_TYPE.main_skill` and `.pressure` expanded to include `'set'` so user-initiated Swap reaches setting content. Default session assembly unchanged.
- Skill-vocabulary sweep across `drills.ts` with inline parenthetical definitions on first occurrence of BAB-specialised terms.
- "Chosen because:" single-sentence rationale on each RunScreen block (promoted from original Tier 2 scope).
- Last-3-sessions row on Home reading from Dexie `ExecutionLog` (promoted from original Tier 2 scope).

Tier 1a acceptance (simplified — full list in the Tier 1 plan): founder logs ≥5 sessions in the founder-use ledger across ≥2 weeks with `d28` in every warmup; founder hits a setting drill via Swap at least once; partner walkthrough has been delivered and its ledger is legible; 30-day behavioural-return window has started; `npm run test / lint / build` all clean.

**Tier 1b — content expansion on logged demand** (gated on Tier 1a acceptance + logged content gaps):

- Capped at ≤10 new drill records per `docs/plans/2026-04-20-m001-adversarial-memo.md` anti-displacement cap.
- Likely candidates: `d31 Self Toss Target Practice`, `d33 Around the World Serving`, `d36 Jump Float Introduction`, `d40 Footwork for Setting`, `d42 Corner to Corner Setting`, `d43 Triangle Setting`. Order and inclusion depend on logged demand.
- Progression links in `chain-6-serving` and `chain-7-setting`, with the dead-end fixes documented in the Tier 1 plan: pair-vs-solo branching on Rung 1 of serving (no solo dead-end), parallel unlock of jump-float rungs 5 and 6 from rung 4, default-unlocked setting fundamentals.
- `d30 Pair Pepper Progression` + `pair_long_warmup` archetype variant ship here **only if** partner walkthrough returns the need as ≥P1. When they ship, the long warmup is a new archetype variant with its own layout (NOT dynamic compression of the existing pair layouts — which would overflow 25-min session durations).

**Tier 1c — focus-toggle architecture** (evidence-gated; ships only when founder-use ledger or partner walkthrough shows explicit focus-switching friction):

- `sessionFocus: 'pass' | 'serve' | 'set'` optional field on `SessionDraft.context` (defaults to undefined, preserving P11 recommend-first).
- Dynamic `slot.skillTags` override in `sessionBuilder.ts::pickForSlot` AND `findSwapAlternatives` (the current static `SKILL_TAGS_BY_TYPE` map becomes a default-fallback, not the canonical mapping).
- Swap-Focus button on the **draft screen** (NOT SetupScreen, per P11).
- Full trigger thresholds and architectural prerequisites documented in the Tier 1 plan.

**Tier 2 — deferred-surfaces unblock** (gated on Tier 1a acceptance + adversarial-memo Condition 3 pass + two weeks of weekly founder sessions):

- "See why this session was chosen" reasoning surface.
- Richer deterministic summary copy on `CompleteScreen`.
- Full session history screen (Tier 1a Unit 5 ships only the last-3 row on Home; Tier 2 ships the full list).
- Recommendation-first first-run polish to the `D123` posture.

Tier 2 scope explicitly does **not** include the weekly receipt, next-N queue, or carry-forward — those live in `M002`.

If the adversarial-memo Condition 3 fails (partner did not open the app unprompted within 30 days of the Tier 1a walkthrough), Tier 2 repoints at "what would have made the partner open it" rather than shipping See-Why and history as originally scoped. See the adversarial memo's Condition 3 consequence.

**Tier 3+ — M002 territory and beyond:** governed by `docs/milestones/m002-weekly-confidence-loop.md` and `docs/roadmap.md`, not by this milestone doc.

**Re-evaluation (2026-07-20 or earlier if a `D130` early trigger fires — including new trigger (d): Tier 1a shipped + ≥10 founder sessions + no open walkthrough P0).** Founder-use mode is **not** an escape hatch from external validation; `D130` pre-schedules a re-eval and the adversarial memo pre-registers the decision rule. At that point the default decision (when all three falsification conditions pass and Tier 1a + Tier 2 have shipped) is **option (a): friends-of-friends cohort** — one expansion stage before full `D91` stranger-launch. Continuing founder-only is no longer a default-available outcome; it requires a written falsifiable justification co-signed by a named non-founder reader, pasted into the adversarial memo's Amendment Log. Resuming `D91` preparation is always available as an opt-in alternative. Tier 1a and Tier 2 being complete is the minimum state for that conversation to be informed rather than speculative.

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

## Physio-review backlog (2026-04-20, deliberately deferred)

An outside physio reviewed the six pre-session safety surfaces on 2026-04-20. The shipped items are captured in `D129` (safety-copy refresh: pain wording, layoff sub-buckets, `PainOverrideCard` warning sharpening, `SafetyIcon` expansion, heat-tips warning-signs-first restructure). The items below were **intentionally deferred** to preserve the "light tool, not dense medical app" posture set by the user direction. Each is real — none are rejected — but each either needs a new product shape (drill-metadata, per-onboarding flag, weekly accumulation surface) or would spend first-open budget the `D91` gate has not yet cleared.

Track here, not on the critical path:

- **Region-aware pain follow-up.** When the user answers "yes" to the pain flag, ask body region (shoulder / elbow / wrist / low back / hip / knee / ankle / other) and whether it's new vs recurring. Use it to bias the lighter session away from the affected region (no overhead work if shoulder, no jumping if lower limb). Requires adding `affectedRegion` tags to drills in `app/src/data/drills.ts` and an exclusion filter in `buildRecoveryDraft`. Belongs in M001-build, after the thin slice proves repeat usage.
- **Ankle-sprain history flag.** One optional onboarding question ("Ankle sprain in the last 12 months, or more than two in the last three years?"). If yes: keep `Prime Ankles` always in the warm-up (already default per `D85` / `D105`, but would become non-shortenable) and apply a jump-volume soft cap for the first ~3 sessions. Strongest single predictor of future ankle sprain per the physio; beach is an ankle-hostile surface. Defer to M001-build / post-`D91`.
- **Overhead / shoulder load tracking.** Running count of serves + hits across sessions with a soft-cap prompt ("you've done ~200 serves in 3 sessions this week — consider a lighter day"). Highest-leverage single injury-prevention feature for volleyball per the physio. Natural home is `M002` Weekly Confidence Loop, not here; the `sRPE-load` primitive (`D84`) already exists to build on.
- **Post-shield-trigger next-session follow-up.** If a user hits the SafetyIcon for dizziness or ends a session early for pain, the next session Home surface prompts "you stopped last session for dizziness — any follow-up?" Requires a small `lastStopReason` field on the run flow and a Home state consuming it. Post-`D91`.
- **In-session hydration / heat check.** On hot days or longer sessions, a mid-session foreground nudge ("been 20 min, drink and check in"). Cheap to add on top of the existing foreground block-end cue (`D122`), but risk of cue noise — validate only after the D91 cohort reads the existing cue stack.
- **Onboarding pregnancy prompt.** Pregnancy changes joint laxity, balance, and heat tolerance materially for beach. The long disclaimer already covers "existing medical conditions" generically; an explicit onboarding question is warranted if the target user base skews relevant. Defer to M001-build once launch markets are chosen.
- **"Training alone?" one-liner.** Solo-first on a beach has a different emergency-response risk profile than training with a partner. Single line in onboarding or the long disclaimer ("Training alone? Tell someone where you are and when you'll be back."). Near-zero cost, but adds onboarding copy and must be weighed against first-run budget pre-`D91`.
- **Warm-up content additions.** Hip mobility / posterior-chain activation (glute + hamstring), progressive jumping ramp when the session includes jumps (pogo hops → countermovement → approach), and explicit thoracic rotation for overhead work. These are drill-library / warm-up-content refinements, not product-shape changes — slot into a drill-content polish pass, not a structural M001 change.
- **Warm-up floor bump (3 min → 5 min).** **Not adopted.** The physio themselves conceded that content matters more than duration and that 3 min of targeted work beats 10 min of static stretching. The existing `D105` ladder (`Beach Prep Two / Three / Five`) with `Three` as the default and `Five` surfaced on 25/40+ time profiles is defensible.

## Open questions carried forward

- What does "solo" operationally mean for passing fundamentals — on sand with only a ball, at-home with a wall, or near a rebounder/net? (See O4 in `docs/decisions.md`)
- Beyond the minimal foreground audio cue now in v0b (`D122`), what cue stack is actually helpful without becoming noisy or overbearing? (Research suggests the runner should be resilient to the user ignoring it for minutes at a time.)
- At the 2026-07-20 re-eval, does the Tier-1-plus-Tier-2 build warrant extending to a stranger cohort under `D91`, opening to a friends-of-friends cohort under a looser bar, or continuing founder + partner only? (See `D130` and `O5`.)

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
