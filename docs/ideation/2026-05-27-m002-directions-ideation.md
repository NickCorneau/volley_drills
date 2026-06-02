---
date: 2026-05-27
topic: m002-directions
focus: "directions for M002 (Weekly Confidence Loop), including critique/revalidation of M002's already-scoped surfaces (carry-forward, shallow 2–6 queue, weekly receipt, bounded explanation, M001 Group A absorption)"
mode: repo-grounded
---

# Ideation: M002 Directions (Weekly Confidence Loop)

## Grounding Context

### Codebase Context

**M002 scope today** (`docs/milestones/m002-weekly-confidence-loop.md`, `D124`): visible carry-forward from `Complete` → `Home` into next session recommendation; one bounded deterministic "why next session?" explanation; shallow next 2–6 session queue (secondary to Home, not a separate planner); minimal weekly receipt (planned-vs-completed + RPE×min load proxy + skill proxy per `D74`); lightweight accumulation. Reuses `ExecutionLog` + `SessionReview`. Recommendation-first posture preserved. No new history route in core scope. **Group A absorbed** (discretionary post-M002-core): Tier 2 polish, friends-of-friends cohort question, attack-content track shape. **Explicitly out:** coach clipboard, calendar planner, durable Team object, analytics dashboards, AI chat.

**Surface inventory today:** `Complete` + `Home` exist; **no Queue, no Weekly Receipt, no History list, no See-why modal**. `Home` shows non-tappable last-3 sessions only via `RecentSessionsList`. Routes are bounded by the `D137` Setup → Safety canonical pre-run spine.

**Live decision constraints:**
- `D74` — receipt content contract: planned-vs-completed + load proxy + skill proxy (retention across days, not last-session hit rate)
- `D26` — weekly progress matters more than gamification
- `D123` — recommendation-first; no new gates that feel like a form
- `D124` — milestone charter
- `D130` — founder-use mode through 2026-07-20; **cohort decision rides on M002 evidence** at re-eval per `D147`
- `D132`/`D146` — pair-first ratified (2026-05-27); solo-low is accommodated, not failing
- `D137` — Setup → Safety canonical pre-run spine; `/tune-today` retired
- `D147` — M001 closed 2026-05-27 by founder executive call; M002 must not become "M001 leftovers + a weekly receipt"
- Open questions in play: `O2` (multi-week planning opinionation), `O22` (optional per-session goal vs `P11` friction), `O23` (pre-session outcome promise vs post-hoc carry-forward)

**Vision principles most load-bearing for evaluation:** `P1` (courtside friction), `P4` (flow > drill volume), `P9` (feedback feeds forward visibly), `P10` (local-first), `P11` (recommend before interrogate), `P12` (one action / one signal / one reason to return), `P13` (pair-first). Posture: joy / trust / investment, calm / shibui, "light on surface, serious underneath."

**M001 inheritance shipped:** Setup → Safety → Run → Check → Transition → Review → Complete; Dexie v6; focus on Setup; per-drill capture on `/run/check` (`D133`/`D134`); `sessionSummary`; m001-adaptation-rules spec; pair-first Complete copy. **Carry-forward:** Group A polish + cohort question + attack-track shape; Group B (Tier 1b cap, `D101`, Phase 2B captures) preserved in `docs/status/post-m001-content-backlog.md`.

**Founder-use evidence** (`docs/research/founder-use-ledger.md`): pair sessions ~2×/week with Seb + perceived improvement; solo ~1/7 + set 0/3 (D146-accommodated, not D130-failing); ledger under-counts vs "dozen+" actual sessions; F1 attack content gap first-class (2026-05-27 reclassification under D135); F4 3s/4s displacement-of-use (founder skipped app day for 3s); F1 mid-session-extend novel ask (2026-05-16); partner wishlist for tappable history + trends; warmup/cooldown timing friction.

**Past learnings that bear on M002** (`docs/solutions/`): `D137` Setup → Safety spine constrains new routes; drill-first-time-runnability copy contract (READ-DO / DO-CONFIRM, ≤45-word ceiling, observe/reinforce/question register); `D135` founder-use feedback routing (capture without firing the gate); markdown-as-API (receipt should start as markdown emission, not typed builder); **6 zero-hit categories** (carry-forward continuity, bounded-reason surfaces, queue/list patterns, weekly accumulation, ExecutionLog gotchas, "training home / joy" surfaces) — M002 is greenfield for each, so plan `/ce-compound` capture after first founder session.

### External Context (web research)

- **TrainerRoad "Predicted Workout Difficulty" (2025–2026)** — single plain-language label (Easy / Moderate / Hard / Very Hard / Maximal) per workout + probability-distribution drill-down behind one tap. Reasoning lives in the label, not narrated. Most rigorously documented "label + drill-down" pattern in the training-app literature.
- **Whoop** — one question per screen; three numbers on home; charts behind tap (925studios design breakdown, Bootcamp/Medium 2026). "Does your product get smarter the longer someone uses it?" longitudinal-value thesis.
- **Hevy Monthly Report** — published only *after* the month closes, frozen artifact (vs live dashboard). Strongest known "accumulation not analytics" pattern.
- **Strava Weekly Snapshot (2024–2025) — anti-pattern.** road.cc and Strava-subreddit users called it "actively making my experience worse." 2025 PMC mixed-methods study (n=225) confirmed always-live calendar-anchored surfaces produce comparison stress, performance pressure, and workout-deletion in users with mixed/injured weeks. Chris Z critique: "If Strava wanted to make something meaningful, they would create a feature that asks you questions instead of displaying your numbers."
- **Duolingo decoupling experiment (Lenny's, Dec 2024)** — separating minimum-viable-action (one lesson = streak) from daily goal raised retention +3.3% Day-14, +1% DAU, +10.5% over 20 days. "Continue" → "commit to my goal" copy testing decisive.
- **Implementation intentions (Cohen's d ≈ 0.65, 94 studies)** + **self-selected habits +37% vs assigned** (Singh 2024 meta-analysis) — the single strongest behavioral levers in the literature; argue against pure recommendation-only flow.
- **FSRS for motor skills — mostly unvalidated.** The volleyball-specific finding that holds up (Frontiers 2025; IJERPH/MDPI 2022) is **contextual interference / variability schedule** (mixed > blocked for retention). Motor-consolidation literature favors 24–48h spacing, not FSRS geometric intervals. Buszard 2023 meta-analysis cautions: lab CI effects often don't transfer to real sports practice — argue for soft variability nudge, not opinionated scheduler.
- **Boundary-object framing** (Pancher 2026 on Excel) + **Whoop longitudinal-value thesis** — accumulation surfaces become switching cost no feature list can replicate.

### Run Methodology

6 ideation sub-agents (pain/friction, inversion/removal/automation, assumption-breaking, leverage/compounding, cross-domain analogy, constraint-flipping) generated 48 raw candidates. Orchestrator synthesized 4 cross-cutting combinations. 52 total candidates filtered by Phase 3 adversarial pass to 7 survivors + 3 honorable mentions. Raw candidate scratch lives at `/tmp/compound-engineering/ce-ideate/0b7c983f/raw-candidates.md`.

## Ranked Ideas

### 1. Release-notes weekly receipt as dual-read cohort-evidence artifact (CC-1)

**Description:** Make the weekly receipt M002's primary load-bearing surface (not one of four equal surfaces). Format it as OSS-style release notes — **Shipped** (sessions completed) / **In progress** (sessions partial) / **Next up** (queue) / **Known issues** (focus you've been avoiding). Freeze at week-close into a tappable list of past weeks (Hevy Monthly Report pattern + FKT logbook). Same persisted schema is read two ways: user sees calm shibui receipt; founder reads the same record as the 2026-07-20 cohort-decision evidence. Diagnostics-as-product. Synthesizes F2-2 + F4-4 + F5-3 + F5-8 from the raw list.

**Warrant:** `direct:` `D147` reframes the 2026-07-20 D130 re-eval to ride on M002 evidence; Carry-Forward Backlog survivor #5 ("founder-use mode means diagnostics are product"); `docs/status/current-state.md` already names generated-plan diagnostics as the active focus-readiness surface. `external:` Hevy Monthly Report (frozen-after-close artifact pattern); FKT logbook tradition; OSS release-notes discipline; Strava Weekly Snapshot anti-pattern (always-live receipts produce shame and KPI-graph guilt — road.cc 2024, PMC n=225 study 2025); TrainerRoad PWD pattern (label visible, drill-down behind tap).

**Rationale:** The 2026-07-20 cohort decision rides on M002 evidence per `D147`. If the receipt isn't *also* the evidence, the founder will retro-build a diagnostics layer later — exactly the late-cycle debt `D147` warns against. Frozen receipts (vs live dashboard) is the single best-documented "accumulation not analytics" pattern in the external research, and OSS release-notes is the cleanest qualitative format that maps to "weekly confidence" without becoming Strava-shaped. Also: makes the M002 charter's three named surfaces (carry-forward + receipt + queue) re-orderable around a clear primary, instead of pretending all three are coequal.

**Downsides:** Pushes the receipt up M002's priority stack (currently specced as one of four equal surfaces). Requires committing to a structured schema early (vs. starting with markdown emission per the markdown-as-API solutions pattern and iterating). Risks dual-reader complexity if user-receipt and founder-evidence schemas diverge over time. Pulls weight away from the carry-forward surface (which the partner explicitly wished for).

**Confidence:** 85%
**Complexity:** Medium-High
**Status:** **Explored** — selected as the brainstorm seed on 2026-05-27, handing off to `ce-brainstorm`

---

### 2. TrainerRoad-shaped carry-forward stack (CC-2)

**Description:** `Home` shows ONE carry-forward sentence at the top ("Last time you did X, so next is Y because Z"). Tap reveals a See-why modal with structured reasoning (RPE, basis, drill-staleness, evidence refs). The whole stack reads from a single typed substrate — `SessionCarryForward { change: 'lighter'|'same'|'harder', basis: 'load'|'fatigue'|'streak'|'skill'|'staleness', evidenceRefs: ExecutionLogRef[], copy: string }` — emitted once and consumed by `Complete` (next-step cue), `Home` (carry-forward line), See-why modal (body), queue ordering (rationale), and (later) coach clipboard. Promotes the See-why modal from Tier 2 polish to M002 core. Synthesizes F1-3 + F1-4 + F3-7 + F4-2.

**Warrant:** `direct:` M002 in-scope list calls for "visible carry-forward" + "one bounded deterministic explanation"; Carry-Forward Backlog survivor #2 (Recommended-as-posture); current `Home` doesn't say what's next or why. `external:` TrainerRoad PWD pattern (label visible by default, drill-down behind tap — primary product research). `reasoned:` three parallel string renderers across `Complete` / `Home` / See-why / queue is the failure mode if carry-forward isn't typed substrate.

**Rationale:** `D124` calls for one bounded deterministic explanation. Building it as string-per-surface forces re-derivation everywhere. Building it as typed substrate means the next four surfaces (and coach clipboard later) are *formatters*, not features. The TrainerRoad pattern is the most rigorously documented "label + drill-down" interaction in the training-app space — it walks the line between helpful and chatbot-noisy that the literature is clearest on.

**Downsides:** Promotes See-why modal from Tier 2 polish to core (consumes M002 budget that could go elsewhere). Forces a schema commitment for `SessionCarryForward` early. Risks over-engineering if the label alone is enough for the returning-user moment and the modal is rarely tapped.

**Confidence:** 80%
**Complexity:** Medium
**Status:** Unexplored

---

### 3. Pair-first M002 in code, not just copy (CC-3)

**Description:** Treat M002 as pair-first by default at every surface, *structurally* — not just in copy. Receipt voice defaults to "we" (solo sessions collapse to a quiet sub-line). Carry-forward record is partner-readable (the data shape itself, not just the message). Surfaces split into pair-thread and solo-thread with different default shapes (pair-thread: shared receipt, "we" voice, partner-tappable; solo-thread: private receipt, individual carry-forward). Re-target the M002 returning-user persona from "self-coached individual returning Monday" to "the pair returning Sunday after a weekend session." Synthesizes F2-8 + F3-8 + F4-5 + F6-6.

**Warrant:** `direct:` `D146` ratifies pair-first / solo-accommodating definitively (2026-05-27); founder-use reality is ~2× pair sessions/week with Seb; partner unprompted-open evidence (Condition 3 PASS); partner wishlist for tappable history. `reasoned:` `D146` stays only in vision-doc copy if every new surface re-litigates the question.

**Rationale:** Pair-first was ratified in code two days ago and hasn't yet propagated structurally. M002 is the right moment to commit it before the receipt/queue/carry-forward shapes are set. Compounds: every future surface (coach clipboard included) inherits pair-first structurally instead of needing a per-surface decision. Also positions M002's "is this app a training home?" question correctly — the founder-use evidence is that the home IS the pair, not the individual.

**Downsides:** Requires deciding partner-readable data semantics in M002 (export shape, local-first sync question). May feel premature given there's no actual partner-side surface yet (just founder relaying). Risks reading too aggressively as "pair-required" and creating cold-state friction for solo onboarding (which `D128` already flipped to solo-first per `D146` nuance).

**Confidence:** 75%
**Complexity:** Medium-High
**Status:** Unexplored

---

### 4. REVALIDATION — Drop the next-2-6 queue from core scope, ship "next + one alternate" (F4-7)

**Description:** The currently-scoped shallow next 2–6 session queue is low-compounding. Users rarely look past the next session; queue ordering algorithm becomes throwaway code if the surface is ignored; "shallow queue" still adds a planning destination that competes with `Home`. Replace with "next session + one alternate" — a cheap alternate covers the "I don't feel like that today" exit. The alternate's logic generalizes to wrong-fit Swap (already shipped per `D122`), so it compounds with existing code rather than birthing a new surface. Subsumes F2-1.

**Warrant:** `direct:` M002 doc itself says queue is "secondary to Home, not a new planning destination" and Carry-Forward Backlog rejects new planner surfaces; `D147` absorbs Tier 2 polish into discretionary follow-on (signal that the team's tolerance for new destinations is low). `reasoned:` queue ordering effort is wasted if the destination is unused; planner posture conflicts with calm/shibui; Garmin / Whoop / TrainerRoad converge on "one prominent recommendation + one optional alternate," not a list of N.

**Rationale:** Two of M002's three named surfaces (carry-forward + receipt) compound aggressively; the queue does not. De-scoping it shifts effort to the surfaces that pay back. If kept, the queue is the most likely M002 surface to ship as static cruft. The "next + alternate" substitute preserves the user-choice affordance (self-selected habits +37%, per Singh 2024) without becoming a planner.

**Downsides:** Drops a piece of currently-promised scope; the queue was the M002 stand-in for "shallow planning" per `D15`/`D22`. Removes the surface where `O2` (how opinionated multi-week planning should be) gets exercised. Loses the partner's "trends/history" wishlist's most natural home.

**Confidence:** 70%
**Complexity:** Low (scope-reduction; alternate logic generalizes from Swap)
**Status:** Unexplored

---

### 5. REVALIDATION — Remove M001 Group A absorption from M002 scope (F2-4)

**Description:** M002 currently absorbs M001 Group A items (Tier 2 polish surfaces, friends-of-friends cohort question, attack-content track shape question) as discretionary post-M002-core follow-on. Drop the absorption. Each Group A item gets its own decision packet (or stays in its existing routing — `docs/status/post-m001-content-backlog.md`, `docs/ideation/2026-05-27-attack-track-and-m001-closure-shape-ideation.md`). M002 stays narrow on the three weekly-confidence surfaces — no "leftovers + a weekly receipt" risk.

**Warrant:** `direct:` `D147` says explicitly "M002 plan does NOT begin work on any Group A item until at least one M002 core surface has shipped — this discipline protects M002 from becoming 'M001 leftovers + a weekly receipt'" — but the doc *still names them as absorbed*. The discipline-warning and the absorption-claim are in structural tension. Removing the absorption from the milestone itself preserves the same outcome with no enforcement cost.

**Rationale:** `D147`'s prose discipline ("M002 doesn't start Group A until core ships") will be hard to enforce in flight. The discipline-as-doc-rule is the kind of constraint that erodes under pressure. Removing the absorption from the milestone itself preserves the same outcome with no enforcement cost. Group A items each have a real home elsewhere (Tier 2 → post-M001 polish; cohort → 2026-07-20 re-eval; attack-track → its own ideation doc).

**Downsides:** Loses the cross-narrative benefit of M002 reading as "the milestone that finishes M001 + adds weekly." Risks Tier 2 polish drifting indefinitely without a clear home. Cohort question and attack-track question need explicit alternative routings or they'll quietly disappear.

**Confidence:** 70%
**Complexity:** Low (milestone-doc edit + routing handoffs)
**Status:** Unexplored

---

### 6. REVALIDATION — Anti-calendar cadence (trailing-N or event-anchored) (CC-5)

**Description:** Replace the "weekly receipt + week boundary" framing entirely. Two viable substitutes: (a) **trailing-N sessions** — receipt shows the last 3 (or 5) sessions in a sliding window, always fresh, never "missed week"; (b) **event-anchored** — receipt fires after every Nth completed session OR 7 days after the *last* completed session, not on calendar Sundays. Either eliminates the "missed week" failure mode and the calendar-Sunday-dread that the Strava Weekly Snapshot critique documents. Synthesizes F1-8 + F6-5 + F3-1.

**Warrant:** `external:` Strava Weekly Snapshot critique (road.cc 2024; PMC n=225 mixed-methods study 2025 — calendar-anchored receipts produce shame, performance-comparison stress, workout-deletion); motor-learning 24–48h consolidation literature (Buszard 2023 meta-analysis); Hevy Monthly Report pattern (period-closed artifact at any granularity); volleyball-specific contextual-interference studies (Frontiers 2025) — session-pair spacing matters more than weekly aggregation. `reasoned:` "weekly" was inherited from the milestone name (Weekly Confidence Loop), not chosen from evidence.

**Rationale:** The milestone name baked in "weekly" as a premise. External research is the clearest on this single point: calendar-anchored aggregation surfaces are the most-documented anti-pattern in the literature, and the working examples (Hevy, FKT) freeze artifacts at any natural-period close, not on the calendar. Trailing-N is the cleanest escape because it preserves all the receipt's accumulation value without any calendar coupling.

**Downsides:** Re-opens a milestone-name question (would need to rename to "Confidence Loop" or "Returning-user Loop"). Trailing-N is less intuitive than "this week" for some users. Loses the natural rhythm of Sunday-evening reflection that many self-directed-training apps lean on.

**Confidence:** 70%
**Complexity:** Low (a cadence/threshold decision; affects copy and ordering, not architecture)
**Status:** Unexplored

---

### 7. Zero-new-screens M002 constraint (F6-1)

**Description:** Adopt a hard constraint: M002 ships **zero new routes**. All M002 work lands as modifications to existing surfaces — `Home` (carry-forward cell + queue-as-expand or "next + alternate"), `Complete` (richer next-step cue), `Run` (optional briefing in preroll), `Review` (one-line accumulation), `Settings` (receipt history list). The `D137` Setup → Safety spine stays intact. No `/queue` route, no `/week` route, no `/receipt` route. The constraint is a forcing function — every M002 surface has to defend why it deserves its own square inch of an existing screen.

**Warrant:** `direct:` `D137` names Setup → Safety as the canonical pre-run spine and explicitly removed `/tune-today`; M002 doc says "this milestone does not add a standalone history route, a calendar planner, or a generalized planning surface as part of its core scope"; `D147` warns against M002 becoming "M001 leftovers + a weekly receipt." `reasoned:` minimum-surface constraints tend to produce sharper designs than budget-driven ones; pairs naturally with the CC-1 dual-read pattern (receipt-as-Settings-tab works under this constraint).

**Rationale:** M002's natural failure mode is over-building — three new surfaces (queue, receipt, See-why) on top of the existing six routes is a 50% route increase for a single milestone. The constraint forces every M002 surface to defend its place on an existing screen, which tends to produce more legible products and reduces the "new screen no one visits" failure mode. Also acts as the implementation-discipline glue under any of the above survivors (CC-1 receipt lives in Settings; CC-2 carry-forward lives on Home; F4-7 alternate lives on Home).

**Downsides:** Constraint may bind too tight — there's a legitimate case for a dedicated history/receipt list route that the partner explicitly wished for. Forces some compromises (the receipt-as-Settings-tab option is less discoverable than its own route). Risks "everything's on Home" mush if not balanced against other survivors.

**Confidence:** 65%
**Complexity:** Constraint (no inherent complexity; affects everything else)
**Status:** Unexplored

---

## Honorable Mentions

### HM1. Substrate-first M002 — ship typed primitives, surfaces are formatters (CC-4)

**Description:** Frame M002 as primarily an architectural milestone: ship 3 typed primitives in `domain/` — `SessionSummary` (crystallized read of `ExecutionLog` records), `SessionCarryForward` (the carry-forward substrate from survivor #2), and `drillStaleness` (FSRS-substrate adapter for "this drill is due"). Optionally add `PracticeBlock` as a fourth. All M002 user-facing surfaces become thin formatters over these primitives. Coach clipboard (M003) inherits the substrate for free. Synthesizes F4-1 + F4-2 + F4-3 + F3-6.

**Warrant:** `direct:` Dexie v6 with per-drill capture already present (substrate is derivable without schema migration); `D147` risk that M002 becomes "M001 leftovers + receipt" — substrate-first is the discipline move against that risk. `external:` FSRS spaced-repetition framing has named academic and production substrate; Whoop's "does your product get smarter the longer someone uses it?" framing. `reasoned:` one well-chosen primitive vs. N ad-hoc readers is leverage.

**Rationale:** Overlaps significantly with survivor #2 (which already includes `SessionCarryForward`). The reason it's an honorable mention rather than a top survivor: the broader "ship primitives, not features" position is real and worth the team's time, but it reads more as an *implementation discipline* answer than a product-direction answer. If the brainstorm answer leans architectural, promote this from HM to top.

**Confidence:** 78%
**Complexity:** Medium
**Status:** Unexplored

---

### HM2. User-authored carry-forward (F6-3)

**Description:** Instead of auto-generating the carry-forward sentence, prompt the user to write ONE line at `Complete` — "what's the one thing you want to remember from this session?" — and surface that line as the carry-forward shown next time. Manual, not generated. The user-authored line replaces (or annotates) the deterministic explanation.

**Warrant:** `external:` self-selected habits show ~37% higher success than assigned (Singh 2024 meta-analysis); implementation-intentions ("if-then planning") have Cohen's d ≈ 0.65 across 94 studies — the strongest single behavioral lever in the literature. `reasoned:` auto-generation is the obvious move; the literature consistently favors user-authored framing for retention.

**Rationale:** Direct alternative to survivor #2's auto-generated carry-forward. Worth surfacing because the research bias is consistent, but it conflicts with Volleycraft's "no typing courtside" preference. Honorable-mention rather than top survivor because it would require user-typing at `Complete` (against the calm/shibui posture for the final screen).

**Confidence:** 60%
**Complexity:** Low
**Status:** Unexplored

---

### HM3. Single courtside-trivial subjective capture at Complete (CBT/SOAP S-line)

**Description:** Add ONE zero-typing tap at `Complete` — a single subjective stamp ("good / fine / off" or the CBT/SOAP S-line equivalent). Over time, the S-line becomes load-bearing data for the receipt (qualitative arc, not metric average) and the carry-forward (subjective basis). As a side effect, it closes the founder-use ledger's known under-count problem. Synthesizes F5-6 + F2-5 + F4-6.

**Warrant:** `direct:` Carry-Forward Backlog survivor #6 (still-learning chip is the honest-answer attractor); founder-use ledger under-count vs. "dozen+" actual sessions. `external:` CBT SOAP-note S-line tradition.

**Rationale:** Cleanest framing for "add one new capture" cluster. Honorable-mention because it adds a new capture point to `Complete` (the screen the M002 doc treats as the immediate-payoff surface where adding friction is dangerous). If survivor #6 (anti-calendar) or HM1 (substrate-first) advance, this becomes more attractive as the substrate feed.

**Confidence:** 65%
**Complexity:** Low
**Status:** Unexplored

---

## Sequencing Read

- **Survivors #5 (drop Group A) + #4 (drop queue) + #6 (anti-calendar) + #7 (zero-new-screens) are all revalidations** — they would re-scope M002 before any new work starts. Discuss as a cluster first; if any land, the additive survivors (#1, #2, #3) ship into a smaller, sharper milestone.
- **Survivors #1 + #2 + #3 are the three big direction questions** — receipt-as-primary (CC-1), carry-forward UX shape (CC-2), and pair-first commitment (CC-3). They are not mutually exclusive; CC-3 in particular layers on top of either CC-1 or CC-2.
- **Cheapest single-move starting point** is **survivor #5 (remove Group A absorption)** — resolves a structural tension in `D147` itself and unblocks clear thinking about #1–#4. Worth doing before any other M002 work.

## Rejection Summary

| # | Idea | Reason Rejected |
|---|------|-----------------|
| R1 | F1-1 Partner-shareable pair snapshot | Tactical instance subsumed by CC-3 pair-first cluster |
| R2 | F1-2 Off-app session capture stub | Below ambition floor — adds a courtside-tap the user must remember; brainstorm-time refinement |
| R3 | F1-3 Home carry-forward cell (standalone) | Subsumed by CC-2 |
| R4 | F1-4 Toggleable why-expand (standalone) | Subsumed by CC-2 |
| R5 | F1-5 Mid-session-extend → queue connector | Tactical instance; below meeting-test floor as direction |
| R6 | F1-6 Attack-gap slot in carry-forward | Subsumed by HM1 drill-staleness signal |
| R7 | F1-7 Carry-forward freshness half-life | Real failure mode but better as brainstorm-time refinement of CC-2 |
| R8 | F1-8 Event-anchored receipt | Subsumed by survivor #6 (anti-calendar cluster) |
| R9 | F2-1 Delete the queue | Duplicates stronger F4-7 (has substitute proposal) |
| R10 | F2-2 Receipt-as-milestone | Subsumed by CC-1 (synthesis of receipt-as-primary position) |
| R11 | F2-3 Automate the week boundary | Inferring boundary from cadence is feature-in-search-of-problem; F6-5 trailing-N avoids the question |
| R12 | F2-5 Complete feeling-tap (standalone) | Subsumed by HM3 |
| R13 | F2-6 Strip Home choice / recommendation-only | Conflicts with shipped 4-row precedence model |
| R14 | F2-7 In-app D130 diagnostics surface | Subsumed by CC-1 (dual-read receipt IS the diagnostics surface) |
| R15 | F2-8 Pair returning Sunday (standalone) | Subsumed by CC-3 |
| R16 | F3-1 Weekly → session-pair cadence | Subsumed by survivor #6 |
| R17 | F3-2 Receipt → letter | Qualitative-receipt cluster collapsed into CC-1 release-notes synthesis |
| R18 | F3-3 Carry-forward → carry-toward | Reframe of CC-2; better surfaced as O23 escalation than standalone direction |
| R19 | F3-4 Four surfaces → one Home sentence | Subsumed by survivor #7 (zero-new-screens captures scope-cut energy) |
| R20 | F3-5 Founder-use → cohort-recruitment artifact | Subsumed by CC-1 (cohort-evidence dual-read) |
| R21 | F3-6 One `PracticeBlock` shape | Subsumed by HM1 substrate-first cluster |
| R22 | F3-7 No-default + See-why modal (standalone) | Subsumed by CC-2 |
| R23 | F3-8 Pair-thread ⊕ solo-thread | Subsumed by CC-3 |
| R24 | F4-1 `SessionSummary` primitive (standalone) | Subsumed by HM1 substrate-first |
| R25 | F4-2 `SessionCarryForward` substrate (standalone) | Subsumed by CC-2 (and HM1) |
| R26 | F4-3 Drill-staleness adapter (standalone) | Subsumed by HM1 substrate-first |
| R27 | F4-4 Receipt = cohort-evidence (standalone) | Subsumed by CC-1 |
| R28 | F4-5 Pair-shared receipt by default (standalone) | Subsumed by CC-3 |
| R29 | F4-6 One Complete capture closes ledger gap | Subsumed by HM3 |
| R30 | F4-8 Replace D74 three-proxy receipt | Subsumed by CC-1 (release-notes format addresses the same critique) |
| R31 | F5-1 Aviation pre-flight briefing | Subsumed by F6-2; F6-2 rejected as breaking D137 spine |
| R32 | F5-2 Surgical M&M conference review | Qualitative-receipt variant; subsumed by CC-1 |
| R33 | F5-3 OSS release-notes (standalone) | Canonical form became CC-1 |
| R34 | F5-4 Coleman garden journal | Qualitative-receipt variant; subsumed by CC-1 |
| R35 | F5-5 Jazz transcription log | Below meeting-test as direction; tactical receipt-copy variant |
| R36 | F5-7 D&D session recap on Home | Recap-first framing is a copy variant of CC-2 carry-forward |
| R37 | F5-8 FKT logbook closed-week (standalone) | Subsumed by CC-1 (frozen artifact pattern is its core) |
| R38 | F6-2 Run-preroll carry-forward | Conflicts with `D137` spine (Run preroll is a tight UX surface; multi-line briefing breaks first-time-runnability) |
| R39 | F6-4 Image-only receipt | Auto-generating meaningful images is heavy lift; below ambition floor as standalone |
| R40 | F6-6 Pair-shared carry-forward as data shape | Subsumed by CC-3 |
| R41 | F6-7 100-founder cohort line | Brainstorm prompt, not a direction proposal |
| R42 | F6-8 24-hour loud strawman | Methodological forcing function, not a direction proposal |

---

## Handoff

Survivor #1 (Release-notes weekly receipt as dual-read cohort-evidence artifact, CC-1) is the brainstorm seed. Loading `ce-brainstorm` next to define the surface precisely — the brainstorm produces requirements at the granularity `ce-plan` can consume.

## Parked Adjacent Vision (added 2026-05-27 during CC-1 brainstorm)

The CC-1 brainstorm surfaced a substantially larger vision in the founder's head than CC-1 was framed for: a **plan-and-adaptation system** with tournaments, longer-horizon skill goals, timing availability, active-season context, pre-commitments, scheduling help, plan-building, and feedback-driven plan adaptation. The founder explicitly permitted parking it ("this does not need to be done in this phase either if its too large").

Captured as a seed at `docs/ideation/2026-05-27-plan-and-adaptation-system-seed.md`. That seed is the input to a separate `/ce-ideate` run when the topic is picked up. M002 stays scoped per the milestone doc; the CC-1 brainstorm continues narrowly on the receipt surface as a small forward-compatible artifact that *hints* at plan context without trying to be the plan-system.
