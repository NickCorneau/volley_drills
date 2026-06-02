---
date: 2026-05-27
topic: m002-receipt-training-only
version: 2.1
review_synthesis: docs/reviews/2026-05-27-m002-receipt-doc-review-synthesis.md
---

# M002 Receipt — Training-Only v1 with User-Authored Bridge (v2.1)

> **v2 revision note (2026-05-27, same day as v1).** v1 was reviewed by 6 parallel persona reviewers (~66 findings). v2 addresses the 3 convergent strategic concerns (cohort-evidence dual-read re-introduction; event-anchored cadence replacing weekly; strategic-shape fork surfaced as `Resolve Before Planning`) and applies ~12 mechanical/design fixes.
>
> **v2.1 patch note (2026-05-27, same day).** v2 was re-reviewed via `ce-doc-review` (round 2, same 6 personas; ~48 net-new findings). Round 1's applied items all verified landed. v2.1 applies safe_auto fixes (AE1/AE2 rewrites to conform to R13b, schema field list normalization across R16/F4/AE8) and appends gated/manual round-2 findings to Outstanding Questions for founder decision at plan-time. Full reviewer synthesis at `docs/reviews/2026-05-27-m002-receipt-doc-review-synthesis.md`.

## Summary

A small event-anchored "receipt" surface in M002 that reads only existing training data (per-drill captures, sessionFocus, ExecutionLog, SessionReview), presents it as a calm side-by-side of recent training focus + drill staleness, and produces at most one rule-driven suggestion sentence per receipt. The user can optionally voice-dictate a `BlockFocus` line to anchor the receipt's interpretation; if skipped, the receipt gracefully falls back to data-only presentation. The same persisted record serves as the founder-readable cohort-decision evidence artifact for the 2026-07-20 D130 re-eval. No new capture surface ships in v1; no notifications, no gamification, no AI inference, no charts on any surface.

---

## Problem Frame

A self-coached returning user finishes a training session, walks away, plays games during the week, comes back for the next training session, and has no surface in the app that helps them think "are we training right? what's actually working? what should this week's session even be for?" The current Home shows last-3 sessions non-tappably; Complete ends each session like a dead-end timer. The founder's actual reflection happens post-game in the car with Seb or alone, supported partly by vibes, partly by retrospectives, partly by occasional glances at training or game data. The training half of that retrospective has data substrate in the app today; the game half doesn't, and adding game capture would impose a "open the app to log stuff" obligation the founder explicitly resists.

The cost shape is twofold. First, without a between-session surface, the app stays a useful in-session tool rather than becoming a weekly training home — the founder reports no surface to anchor what's working or what to shift. Second, the 2026-07-20 D130 founder-use re-eval rides on M002 evidence per `D147` — without a structured persisted record that doubles as cohort-decision evidence, the founder will retro-build a diagnostic layer later, exactly the late-cycle debt `D147` warns against. The existing `services/export.ts` JSON dump is a raw table export, not a diagnostic surface, and does not fill this gap. Conversely, if the receipt overshoots into Strava territory (live charts, comparison, gamification) it fails the calm/respectful posture.

---

## Actors

- A1. **Returning user (self-coached, between sessions)** — opens the app between training sessions or games, glances at the receipt, uses it to decide whether/what to train next.
- A2. **Pair partner (Seb)** — does not directly read the receipt in v1, but is implicit in pair sessions captured today; pair-shared receipt is forward-compatible but deferred.
- A3. **Founder-as-diagnostician (D130 window-only)** — reads the same persisted records as a cohort-decision evidence artifact for the 2026-07-20 D130 re-eval. Same data, no separate UI surface in v1.

---

## Key Flows

- F1. **Read the receipt between sessions.**
  - **Trigger:** A1 opens the app between training sessions (e.g., Tuesday after a Saturday training + a Sunday game day).
  - **Actors:** A1
  - **Steps:** A1 lands on Home → sees a "Since last session" cell at the top → optionally taps to expand inline, OR navigates to Settings → Receipts list to see the latest receipt + past snapshots.
  - **Outcome:** A1 has read the training focus mix, per-drill staleness, drill-capture trends, and (if rules fire) one suggestion sentence. A1 makes their own decision about whether to train next and for what.
  - **Covered by:** R1, R2, R3, R4, R5, R12, R13, R14, R15

- F2. **Set / refresh a `BlockFocus` (optional, any time).**
  - **Trigger:** A1 chooses to anchor the current block with a named focus (e.g., "platform angle in receive"). A single calm affordance is visible when no `BlockFocus` is set; never required, never escalates.
  - **Actors:** A1
  - **Steps:** A1 taps the "Set focus for this block" affordance → text field opens with native keyboard mic available → A1 dictates ~5 seconds of free text → saved. A1 may edit or replace at any time.
  - **Outcome:** Subsequent receipts anchor their suggestion sentence to this focus when the rule's keyword-detection matches a `SkillFocus` enum word in the dictated text.
  - **Covered by:** R5, R6, R8, R9, R10

- F3. **Receipt falls back when `BlockFocus` is absent or non-matching.**
  - **Trigger:** A1 reads the receipt without having set a `BlockFocus`, OR the dictated `BlockFocus` text contains no `SkillFocus` enum keyword.
  - **Actors:** A1
  - **Steps:** Receipt renders without the focus-anchored sentence; suggestion sentence (if generated) derives from sessionFocus aggregation only; no "your focus is X" framing; the calm affordance to set `BlockFocus` remains visible but does not escalate.
  - **Outcome:** Receipt is thinner but still useful — data presentation + possibly one suggestion sentence — without nagging A1.
  - **Covered by:** R5, R8, R9

- F4. **Founder reads the same record as cohort-decision evidence (D130-window-only).**
  - **Trigger:** A3 reads accumulated receipts during D130 founder-use window evaluation (default through 2026-07-20).
  - **Actors:** A3
  - **Steps:** A3 reads the same persisted `Receipt` records that A1 reads — no separate export, no separate UI surface. The schema is designed so the record carries both user-facing copy and the structured signal needed for cohort-decision evidence (focus mix, suggestion-fired-rule-id-or-null, BlockFocus presence/content, period-start/end timestamps, sessions-included-by-id). A3 may read via the existing JSON export pathway extended to include `Receipt` records.
  - **Outcome:** Cohort-decision evidence for 2026-07-20 D130 re-eval is grounded in the same artifact A1 reads — no parallel diagnostic surface, no schema divergence.
  - **Covered by:** R16, R17

---

## Requirements

**Receipt content (read-only surface)**

- R1. The receipt aggregates training-session data from the existing app substrate only (`ExecutionLog`, `SessionReview`, per-drill captures via `app/src/domain/capture/`, `sessionFocus`). It MUST NOT depend on any new capture surface in v1.
- R2. The receipt presents at minimum: (a) training focus mix over the receipt period, (b) per-drill staleness (drills not run for N or more sessions), (c) any per-drill capture trends that are unambiguous (e.g., a drill that moved from "still learning" to "comfortable"). All three are pure data presentation, no inference.
- R3. The receipt MUST NOT include comparison-shaped surfaces or charts on any surface in v1: no week-vs-week deltas, no streaks, no rank, no goals-vs-actual progress bars, no sparklines, no trend charts even behind a tap. v1 is text-and-list only.
- R4. The receipt MUST NOT include retrospective tallying that does not connect to a forward-looking move (no "stats for the sake of stats").
- R4b. The receipt MUST handle the empty / thin-data state explicitly. When the receipt period contains 0 or 1 training sessions, the receipt renders an affirmative "no training this period — that's fine" framing, NOT a blank state, error, or implied-nag.

**Suggestion layer (rule-driven, optional, at most one sentence)**

- R5. When the receipt renders, the suggestion layer MAY emit AT MOST one sentence per receipt. The suggestion comes from a deterministic rule set (target: 3–5 rules; suggested starter set: longest-stale focus → suggest as gap; per-drill staleness above threshold → suggest revisit; drill captures trending up → name positively; heavy unbalanced focus mix → suggest balance). The exact rule set and thresholds are deferred to planning. When no rule fires, the receipt MUST NOT generate a filler sentence to fill the space.
- R6. When a `BlockFocus` is set for the active block AND the dictated `BlockFocus` text contains a `SkillFocus` enum keyword (case-insensitive simple match; planning resolves whether a synonym table is needed), the suggestion layer anchors to it where applicable (e.g., "your focus is platform angle; you've run 2 of 4 sessions on receive — on track"). When no keyword matches, R6 does not fire and the receipt falls back to the unanchored rule set.
- R7. The suggestion sentence MUST be auditable: a developer reading the source MUST be able to identify which rule produced any given suggestion. No opaque inference, no AI calls, no network dependency, no LLM.
- R7b. The suggestion sentence MUST conform to the receipt-specific copy contract (R13b below). Generic-feeling, fortune-cookie-shaped, or imperative-shaped suggestions are explicitly out.

**User-authored `BlockFocus`**

- R8. A1 MAY set a `BlockFocus` for the active block. The `BlockFocus` is a single user-authored free-text line, voice-dictation-friendly via the device keyboard's native microphone affordance. It is never required.
- R9. When no `BlockFocus` is set, the receipt MUST NOT nag, prompt aggressively, or block any other functionality. A single calm affordance ("Set focus for this block — optional") is acceptable. The affordance MUST NOT escalate based on the number of receipts read or sessions completed without one set.
- R10. The `BlockFocus` is persisted locally per the existing Dexie pattern (specific schema deferred to planning) and is forward-compatible with the parked plan-and-adaptation system (`docs/ideation/2026-05-27-plan-and-adaptation-system-seed.md`). State machine: never-set, just-set (editable any time), persisted (editable any time), explicitly-cleared. No automatic expiry; no "stale" state in v1; user clears or replaces explicitly.

**Calm-posture floor (non-negotiable)**

- R11. The receipt MUST NOT trigger notifications of any kind (push notifications, PWA notification API, in-app modals, badges, email, SMS) in v1.
- R12. The receipt MUST NOT include any gamification element: streaks, badges, scores, levels, leaderboards, social comparison, "year in sport"-style stat reels, period-comparison framing.
- R13. The receipt's copy MUST follow the courtside-copy contract (`docs/solutions/2026-05-10-drill-first-time-runnability-system.md`) where applicable: ≤45 words per surface unit; observe/reinforce/question register.
- R13b. The suggestion sentence MUST additionally conform to a receipt-specific copy anti-pattern list. v1 floor:
  - No number appears without a qualifier (e.g., "3 sessions" is acceptable; "3" alone is not)
  - No percentages
  - No comparative adverbs ("better", "worse", "more", "less" — use "different" or restructure)
  - No streak language
  - No goal-vs-actual framing
  - No imperative "you should" — use "worth checking", "consider", or a question

**Cadence and surface**

- R14. The receipt's cadence is **event-anchored**: the receipt regenerates after each completed training session, readable at any time on Home and in Settings → Receipts. There is no fixed calendar boundary (no Sunday regen, no week-of framing). Past receipts are snapshots at the moment of regeneration; subsequent training sessions create new receipts without altering past ones.
- R15. The receipt surfaces in two places only: (a) a "Since last session" cell at the top of Home (inline-expandable, no modal sheet, no new route), (b) a Settings → Receipts list showing the latest plus snapshots of past receipts. No third surface, no dedicated route, no Home reshuffle of the existing 4-row precedence model (the cell sits above it as a top-of-list addition).

**Cohort-decision evidence (D130-window-only)**

- R16. The persisted `Receipt` record schema MUST be designed so that the same record A1 reads as user-facing copy ALSO carries structured signal usable as cohort-decision evidence (focus mix, suggestion-fired-rule-id-or-null, BlockFocus presence/content, period-start/end timestamps, sessions-included-by-id). Schema specifics deferred to planning.
- R17. The existing JSON export pathway (`services/export.ts`) MUST be extended to include `Receipt` records when invoked. This is the founder's diagnostic-read surface for the D130 window; no separate diagnostic UI ships in v1.

---

## Acceptance Examples

- AE1. **Covers R2, R5, R13b.** Given A1 has trained 3 times in the past 2 weeks (1× serve, 1× movement, 1× pass), and the most-stale focus is "set" (not run in 4 weeks), when A1 opens the receipt, the receipt renders the focus mix as "3 sessions: 1 serve, 1 movement, 1 pass" and emits one suggestion sentence: "Set hasn't run in 4 weeks — worth considering for the next session." (Note: this example sentence is illustrative; final wording is deferred to planning and dogfood iteration. Does not use superlatives, soft deadlines, comparative adverbs, or imperatives per R13b.)
- AE2. **Covers R6, R8.** Given A1 has dictated a `BlockFocus` containing the verbatim enum word "pass" (or a planning-resolved synonym map maps the dictated text to `SkillFocus = pass`), and has run a pass-focused session since, when A1 opens the receipt, the receipt frames an observational sentence anchored to the block focus: "Pass: 1 session aligned with your block focus." (Note: this example assumes either verbatim-enum matching OR the planning-resolved synonym map per AE7. Final wording deferred to planning; does NOT use goal-vs-actual framing per R13b item 5.)
- AE3. **Covers R5, R7, R4.** Given the rule set produces no firing rule for the current state (e.g., focus is well-balanced, no drills are stale, no captures trended), when A1 opens the receipt, the receipt renders data only without an inserted suggestion sentence. It MUST NOT generate a filler/generic suggestion to fill the space.
- AE4. **Covers R9.** Given A1 has never set a `BlockFocus`, when A1 has opened the receipt 5 times in the past 2 weeks, the app MUST NOT have generated a notification, badge, or any escalating prompt encouraging A1 to set one. The calm affordance MAY remain visible; it MUST NOT escalate.
- AE5. **Covers R4b.** Given A1 has trained 0 times in the past 2 weeks (busy in-season period with games but no training), when A1 opens the receipt, the receipt renders an affirmative "no training this period — that's fine" framing with no implied criticism, no streak-broken indicator, no suggestion sentence (the suggestion layer suppresses on thin data).
- AE6. **Covers R14.** Given A1 completes a training session at 7pm Wednesday, when A1 opens the receipt at 7:05pm Wednesday, the receipt has already regenerated and includes that session. The next training session (e.g., Saturday morning) triggers another regeneration; Wednesday's receipt is preserved as a snapshot in Settings → Receipts and is not altered.
- AE7. **Covers R6, R10 (BlockFocus → SkillFocus bridge).** Given A1 dictates a `BlockFocus` of "footwork timing on transitions" (the text contains the keyword "movement" via the planning-resolved synonym map — OR does not contain any `SkillFocus` enum keyword), when the receipt renders, R6 either anchors to `SkillFocus = movement` (if the synonym map fires) OR R6 silently does not fire and the receipt falls back to the unanchored rule set. The decision between synonym-map-extension vs verbatim-only-match is deferred to planning per Outstanding Questions.
- AE8. **Covers R16, R17.** Given A1 has accumulated 6 receipts over 4 weeks of founder use, when A3 invokes the existing JSON export pathway, the export includes the 6 `Receipt` records with their structured signal fields (focus mix, suggestion-fired-rule-id-or-null, BlockFocus presence/content, period-start/end timestamps, sessions-included-by-id) — sufficient as cohort-decision evidence material for the 2026-07-20 D130 re-eval without requiring a separate diagnostic surface.

---

## Success Criteria

**Human outcome**
- A1 reports the receipt feels calm, intentional, and helpful — specifically that it helps them decide whether/what to train without feeling like a chore or a dashboard.
- A1 returns to the receipt at least once between sessions without being prompted to (no notification triggers; pull-based behavior).
- A1's car-ride retrospectives with Seb refer to the receipt at least occasionally as an anchor (the receipt augments the existing reflection rather than replacing it).
- A1 reports the suggestion sentence (when it fires) feels honest and observation-shaped — not fortune-cookie, not nagging, not Strava-shaped.

**Downstream-agent handoff quality**
- `ce-plan` can take this requirements doc and produce an implementation plan without needing to invent rule semantics, the calm-posture floor, the BlockFocus shape, the cohort-evidence schema-dual-read, or the surface location decisions.
- The implementation produces a receipt that visibly respects every requirement in the calm-posture floor (R11–R13b) — verified by manual mobile dogfood per the user's stated preference for dogfood testing with screenshots.

**Cohort-decision evidence**
- At 2026-07-20 D130 re-eval, the persisted `Receipt` records (per R16) provide structured evidence that materially informs the cohort decision — not a single data point, but a multi-week longitudinal record A3 can read directly from the JSON export.

---

## Scope Boundaries

- No game-data capture surface ships in v1 (no post-game tap, no game-as-session-type extension to Setup, no per-game subjective stamps). The training-only receipt is the intentional v1 floor.
- No AI inference of any kind ships in v1 (no API calls to Workers AI, no on-device Whisper, no LLM-generated suggestions). AI as a long-run correlation surface is parked in `docs/ideation/2026-05-27-plan-and-adaptation-system-seed.md`.
- No tournament-cycle anchoring ships in v1 (no tournament dates, no countdown, no per-cycle aggregation). Tournament context is parked in the plan-and-adaptation seed.
- No partner-shared receipt ships in v1 (D146 pair-first is honored in copy where natural, not in data shape). Partner-readable receipts are a survivor-#3 candidate for M003 or later.
- No notifications, no gamification of any kind, no charts on any surface (not even behind a tap), no period-comparison framing (per R11–R13b).
- No new route ships in v1; the receipt lives on existing surfaces only (Home + Settings) per R15.
- No new schema beyond `BlockFocus` and `Receipt` (Receipt designed as the dual-read artifact per R16; specific schemas deferred to planning).
- No coach clipboard, no calendar planner, no Team object, no marketplace (per M002 milestone doc, unchanged).

---

## Key Decisions

- **Decision 1: Receipt is training-only in v1.** Rationale: explicit user pushback against new app-open-for-data-entry obligations; game half of the Waitzkin bridge is parked in the plan-and-adaptation seed; existing M001 training substrate already supports a meaningful receipt without new capture.
- **Decision 2: Suggestion layer is rule-based (3–5 rules), not AI-based, in v1.** Rationale: AI hallucinates more on sparse data, not less; local-first PWA constraint conflicts with network calls; audit-ability matters in the D130 founder-use window; AI suggestion is the right shape long-run but explicitly parked in the plan-and-adaptation seed. The rule set is small enough not to feel mechanical and is explicitly designed to be replaced by AI when the data substrate is richer.
- **Decision 3: `BlockFocus` is user-authored, voice-friendly, optional.** Rationale: implementation-intentions Cohen's d ≈ 0.65 + self-selected habits +37% (Singh 2024) are the strongest behavioral-design levers; voice via native keyboard dictation costs zero new code; optional-not-required honors the calm posture; forward-compatible primitive for the parked plan-and-adaptation system.
- **Decision 4 (v2-revised): Cadence is event-anchored.** Rationale: founder's actual reflection cadence is post-game / event-driven, not weekly; ideation survivor #6 named "weekly" as the Strava Weekly Snapshot anti-pattern shape with primary-research citations; the M002 milestone name's "Weekly" was inherited convention, not evidence-derived. Event-anchored regeneration (after each completed training session) preserves the calm posture (no calendar dread, no missed-week guilt, no Sunday-evening notification trigger) and matches the Hevy Monthly Report / FKT logbook "frozen at period close" pattern at the appropriate granularity.
- **Decision 5: Surface location is Home cell + Settings → Receipts list.** Rationale: zero-new-screens constraint (per M002 ideation survivor #7); Home cell satisfies the "between-sessions glance" without disrupting the existing 4-row precedence model (cell sits above it); Settings → Receipts list satisfies the partner-wished-for tappable history; respects D137 Setup→Safety spine; no new route required.
- **Decision 6 (v2-revised): Cohort-evidence dual-read is preserved as a structural feature of v1.** Rationale: v1's first draft dropped this and reviewers correctly flagged it as CRITICAL: the JSON export at `services/export.ts` is a raw table dump, not a diagnostic surface; D147 reframes the 2026-07-20 D130 re-eval to ride on M002 evidence; dropping the dual-read leaves the founder retro-building a diagnostic layer later (exactly the late-cycle debt D147 warns against). The dual-read is structural — same persisted Receipt record carries both user-facing copy and the signal A3 needs as cohort-decision evidence. No separate diagnostic UI ships in v1; the JSON export pathway is extended to include Receipt records (R17).
- **Decision 7 (v2-added): No charts on any surface in v1, even behind a tap.** Rationale: scope-guardian flagged v1's "charts behind a tap" door as inconsistent with the user's "no gamification (yet)" floor; v1 stays text-and-list only; reopen if founder use surfaces real demand.

---

## Dependencies / Assumptions

- The existing per-drill capture system (`app/src/domain/capture/`) and `SessionReview` flow produce the data atoms the receipt reads. No changes to capture infrastructure are required for v1.
- The existing Dexie v6 schema supports adding `BlockFocus` and `Receipt` as small new shapes without migration risk (verified via repo scan; planning should confirm exact migration shape, likely v7).
- The current `SkillFocus` enum (`app/src/types/drill.ts`: `pass | serve | set | movement | conditioning | recovery | warmup`) is the grain at which the receipt aggregates focus. No `attack` or finer-grained sub-skill tagging exists today; the receipt does not attempt grain finer than this enum in v1.
- The device keyboard's native microphone affordance is available on iOS Safari, Android Chrome, and the primary target PWA environments. No additional voice-input infrastructure is needed for v1.
- The existing JSON export pathway (`services/export.ts`) can be extended to include `Receipt` records without breaking the existing export contract.
- The receipt does not depend on game data, tournament data, or any artifact from the parked plan-and-adaptation system. The two can ship independently.

---

## Outstanding Questions

### Resolve Before Planning

- **[Affects S3 strategic shape] [User decision]** The multi-persona review surfaced that the receipt's shape is contested from both directions. The founder should resolve before `ce-plan` proceeds. Three named alternatives, with the reviewer arguments distilled:
  1. **Current shape (this doc's v2)** — training-only receipt + optional `BlockFocus` + 3–5 rule suggestion + Settings → Receipts list + cohort-evidence dual-read. Defensible middle-ground; engages multiple convergent reviewer concerns but is contested.
  2. **Max-cut (scope-guardian)** — drop `BlockFocus` (premature abstraction justified primarily by forward-compat with a parked system); drop the 3–5 rule suggestion layer (fails the founder's "no overload" posture); drop Settings → Receipts list (justified by partner-wish, not founder-stated need). Ship one Home cell with raw data only, zero new schema, zero new routes. Maximum calm, maximum scope-discipline, but loses the cohort-evidence dual-read substrate.
  3. **Plan-system slice (product-lens)** — accept that the parked plan-and-adaptation seed is the founder's actual stated vision and that training-only receipt ships safe-not-valuable; redo the brainstorm against a small slice of the plan-system instead (tournaments + `BlockFocus` + minimal scheduling). Bigger M002 scope but materially closer to the loudest founder evidence (F1 attack-content gap).

  **Recommended path:** founder reviews this doc + `docs/reviews/2026-05-27-m002-receipt-doc-review-synthesis.md` + the parked `docs/ideation/2026-05-27-plan-and-adaptation-system-seed.md`, then picks. If current shape (option 1) is chosen, planning proceeds with this doc. If max-cut (option 2) or plan-system slice (option 3) is chosen, this doc gets rewritten or replaced before planning.

### From 2026-05-27 round-2 review (Resolve Before Planning)

These items came out of the `ce-doc-review` round-2 pass on v2 and require founder judgment (not orchestrator pick) before planning starts. Each cites the reviewer(s) that raised it.

- **[Affects R2, R4b, R16] [Needs definition — coherence + adversarial]** Define "receipt period." The term is used 4+ times and is a structured field on the `Receipt` schema (R16) but is never defined. R14 implies "since last training session"; AE examples model a trailing 2 weeks. Pick one and add a one-line glossary at the top of the doc OR in R2. This will block planning on the R16 schema if unresolved.
- **[Affects R16, R17, F4, AE8, Success Criteria] [Needs definition — adversarial + product-lens]** Define the "cohort decision" question. Load-bearing in 7+ places but never specified — what's the actual question A3 is reading the receipts to answer? Without this, R16's structured-signal field list is arbitrary, and the "materially informs the cohort decision" success criterion is unfalsifiable. Add a 1–3-line specification (likely cross-referencing D147 and the parked plan-and-adaptation seed).
- **[Affects R4b, R14] [Needs resolution — adversarial + coherence]** R4b's thin-data state (0 or 1 sessions in receipt period) is unreachable under R14's "regenerate after each completed training session." Three resolutions: (a) revise R14 so the receipt also regenerates on Home-read or on a time interval; (b) narrow R4b to 0-sessions only; (c) accept that R4b only fires when the receipt period is ≥2 weeks and the user trained 0 or 1 times in that window. Pick one.
- **[Affects R13b, AE1] [Needs founder review — design-lens + coherence]** R13b's anti-pattern list is missing rules for **superlatives** (longest, most, oldest), **soft deadlines** ("if you train this week"), **exclamation marks**, and **emoji**. The v2.1 AE1 rewrite avoids these but R13b doesn't yet ban them. Add to R13b explicitly OR accept that the founder will catch them in dogfood.
- **[Affects R15, HomeScreen] [Needs design — feasibility F3]** R15 says the "Since last session" cell is a "top-of-list addition" to Home, but the existing `HomeScreen.tsx` codifies a Resume single-action rule (the existing Tier 1a `RecentSessionsList` is gated on `!flags.resume`). Specify the cell's behavior when Resume is the primary action: hidden, collapsed-below-Resume, shown-above-Resume, or other.
- **[Affects R17] [Needs scope acknowledgment — feasibility F1]** R17 understates the export-contract change. `services/export.ts` has `schemaVersion: 4` as a literal type, tests pin the exact key set, and the comment names external founder replay scripts. Adding `Receipt` requires a coordinated three-way change (Dexie v7 migration + export schemaVersion 5 + founder replay-script update). Update Dependencies/Assumptions to acknowledge this, and add a planning-time coordination note.
- **[Affects Resolve Before Planning §1] [Needs founder review — product-lens + design-lens]** The §1 strategic-shape fork framing is asymmetric. Alt #1 (current shape) is written in detail; alts #2 (max-cut) and #3 (plan-system slice) only in summary. v2's structural investment in alt #1 (R16/R17/F4/AE8/Decision 6) pre-loads the founder's choice via sunk-cost momentum. The "recommended path" sentence also favors alt #1. Two improvements: (a) re-balance the detail across the three alternatives, and (b) convert to a comparison table with axes (scope, capture cost, schema cost, cohort-evidence coverage, founder-vision alignment) so the trade-offs are scannable instead of buried in prose. This is a presentation fix to the doc, not a re-decision of the fork itself.
- **[Affects R15] [Needs design — design-lens F6]** Add an explicit Home → Settings → Receipts affordance. R15 names two surfaces but defines no entry point from the Home cell to the past-receipts list, so A1's reflection-read use case is structurally broken. Suggest a "See past receipts" link in the expanded Home cell content.

### Deferred to Planning

- **[Affects R5] [Needs design]** The exact 3–5 rules and their thresholds. Suggested starter set is named in R5; planning should converge with founder review on the final set, the threshold values, and the precise copy template for each rule's output sentence (subject to R13b anti-pattern list).
- **[Affects R6] [Needs design]** Whether the `BlockFocus` → `SkillFocus` keyword detection uses a curated synonym map (e.g., "platform angle" → `pass`; "footwork" → `movement`) OR accepts that R6 only fires on verbatim enum-word matches. Per AE7.
- **[Affects R8, R10, R16] [Technical]** The exact Dexie shape and lifecycle for `BlockFocus` and `Receipt` records. Per-block identity, edit semantics for past-block focus, the `Receipt` schema's user-facing-copy + structured-signal dual carriage, and the relationship to the parked plan-and-adaptation system's future `BlockFocus`-equivalent primitive should be resolved during planning.
- **[Affects F1, R15] [Needs design]** The exact UI shape of the Home "Since last session" cell and the Settings → Receipts list. Cell density, expand-inline interaction, copy register, past-receipt list ordering — planning + manual mobile dogfood iteration.
- **[Affects R14] [Needs evidence]** Whether event-anchored cadence (regen after each training session) is the right cadence once founder use surfaces real read-cadence data. Re-evaluate after 2–3 weeks of founder use; alternative cadences (post-game with new capture, period-close on tournament cycle, trailing-N sessions) are sketched in the parked plan-and-adaptation seed if a stronger signal emerges. The training-event-anchored default avoids both the Strava-weekly trap and the new-capture-for-games trap.
- **[Affects R17] [Technical]** The exact JSON export extension for `Receipt` records. Existing export pathway in `services/export.ts` (V0B-15 founder table dump) needs the new record type added; planning resolves field naming and back-compat.
- **[Affects R14] [Technical — feasibility F2]** No existing "compute-and-persist on session completion" pattern in the codebase. Planning must pick the hook location: extend `submitReview`'s transaction (`services/review/`), lazy-on-Home-read (compute when A1 opens Home), or fire-and-forget post-Complete. Each has different durability and offline-behavior implications.
- **[Affects R10] [Technical — feasibility F4]** Dexie v6 → v7 migration coupled with export `schemaVersion: 4` → 5 bump. The two were deliberately decoupled at M001 (v5/v6 stayed at schemaVersion 4 because they were additive within existing tables); adding `Receipt` forces both bumps plus the F1 founder-script update. Plan all three together.
- **[Affects R5, R8] [Needs design — design-lens]** BlockFocus clear/edit affordance is undefined — R10 says editable any time with no auto-expiry, but the doc doesn't specify whether there's an explicit clear button, an edit affordance vs. replace, or undo. Planning + dogfood iteration.
- **[Affects R2(c), R3] [Needs design — design-lens]** Per-drill trend rendering pattern. R2(c) requires "drill capture trends" but R3 forbids charts on any surface. Planning resolves whether trends render as text strings ("d33: still learning → comfortable"), state-transition glyphs, or list rows. No new R-ID needed; specify at plan-time.
- **[Affects A3, R16, R17] [Needs evaluation — product-lens advisory]** A3 actor may be scaffolding — A3 reads the same JSON A1 could read with no role-switching surface, no filter, no diagnostic UI. Consider whether A3 earns its keep as a named actor in v1 or whether the cohort-evidence read is just "founder uses the existing JSON export pathway, which now includes Receipts" without a named-actor abstraction. Doesn't block planning; revisit at re-read.
- **[Affects Decision 3] [Needs honesty — product-lens advisory]** Decision 3's BlockFocus rationale cites implementation-intentions Cohen's d ≈ 0.65 and self-selected habits +37%. Product-lens flagged that those measures apply to action-bearing primitives, not read-surface anchors like the BlockFocus-as-receipt-frame. The evidence is real but measures a different mechanism. Re-word the rationale to be honest about the inferential leap.
