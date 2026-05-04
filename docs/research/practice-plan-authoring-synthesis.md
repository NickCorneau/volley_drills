---

## id: practice-plan-authoring-synthesis

title: Practice Plan Authoring Synthesis
status: active
stage: planning
type: research
authority: cross-source synthesis for how Volleycraft should understand and eventually build practice plans from BAB, FIVB, and Volleyball Canada / VDM source material
summary: "Cross-source synthesis of **all 20 BAB practice plans** (passing 1-3 + partial 4, setting 5-6, attacking 7-11 — full cluster, defense 12-16 — full cluster, **plus Plans 17-20 — complete Game Play cluster**) plus FIVB drill-book / coaches-manual and Volleyball Canada VDM/LTD3 sources. **The captured BAB drill book is now structurally complete at source-detail level — research-complete, but the 2026-05-04 ideation pass adversarial-filter found this is NOT milestone-ready.** A `ce-ideate` pass with `ce-architecture-strategist` and `ce-product-lens-reviewer` adversarial subagents (output: `docs/ideation/2026-05-04-bab-complete-plan-builder-ideation.md`) confirmed the BAB synthesis is archived inventory + structural confirmation of canon (T1/T2/T5/T7 confirm D76/D77/D101 + existing archetype shape), not a current-milestone build agenda. Re-activation triggers: D101 unlocks 3+ player support; M002 design needs plan-grammar input; or a non-D101-gated source-priority drill clears the existing diagnostics activation pattern. Names a six-slot focus-agnostic plan grammar confirmed across all five clusters with slot 4 (movement) cluster-complete-skipped in Game Play. Synthesizes 13 cross-source theses (T1-T13) with 7 falsification entries: T9 sharpened **four consecutive times** to nine composable rule kinds plus asymmetric scoring axis; T10 narrowed from universal to Defense/Attack-only; T12 graduated to two-source pattern. Survivor buckets from ideation: now-shippable (4 — predicate refactor, confirmation receipt, re-activation triggers, O24 packet); pre-D101 schema gates (3 — T9 stance, T6 zone convention, slot-4 optional); post-D101 / M002 candidates (5 — composable scoring, problem-first flow, family abstraction, repetition-rank metadata, compatibleFocuses)."
last_updated: 2026-05-04
depends_on:

- docs/research/bab-source-material.md
- docs/research/fivb-source-material.md
- docs/research/fivb-coaches-manual-crosscheck.md
- docs/research/vdm-development-matrix-takeaways.md
- docs/research/ltd3-development-matrix-synthesis.md
- docs/research/beach-training-resources.md
- docs/vision.md
- docs/decisions.md

# Practice Plan Authoring Synthesis

## Agent Quick Scan

- Use this note when asking **how BAB practice plans are built**, what their repeated grammar implies, and how that should inform future Volleycraft plan-building work.
- **Research-complete ≠ milestone-ready (2026-05-04 ideation pass):** the captured BAB drill book is structurally complete, but the synthesis is **archived inventory and structural confirmation of existing canon**, not a current-milestone build agenda. The 2026-05-04 ideation pass (`docs/ideation/2026-05-04-bab-complete-plan-builder-ideation.md`) applied `ce-architecture-strategist` and `ce-product-lens-reviewer` adversarial filters to ~46 candidate ideas across six `ce-ideate` frames; the load-bearing finding is that BAB-derived schema work should defer past the 2026-05-21 D130 condition read-out and the 2026-07-20 D130 re-eval. **Re-activation triggers** (any one of):
  1. `D101` unlocks 3+ player support (most BAB top-tier drills are 3-4 player and currently gated).
  2. M002 design needs plan-grammar input (currently M002 is calm carry-forward / weekly receipt, not a plan-grammar surface).
  3. A non-`D101`-gated source-priority drill clears the existing `d49 / d50 / d51` source-backed activation pattern (the only candidate is `Around the World (Serve)` at four plan references).
- **Honest framing:** this is a **BAB-dominant synthesis with FIVB and VDM/LTD3 as guardrails**, not a balanced tri-source synthesis. Most theses (T1, T6, T8, T9, T10's structural schema, T11, T12, T13) derive their structural claim from BAB plans; FIVB and VDM/LTD3 contribute corroborating vocabulary, fatigue/cue-density rules, and stage framing rather than co-equal structural evidence. The Cross-Source Convergence Map below names where each source actually leads.
- Source coverage as of 2026-05-04: **all 20 BAB practice plans captured** at source-detail level — the captured BAB drill book is structurally complete (Plans 1-3 passing + partial Plan 4, Plans 5-6 setting, Plans 7-11 attacking — full cluster — Plans 12-16 defense — full cluster — Plans 17-20 game play — full cluster). Various partial captures within plans (Plan 4 Drills 5-6 source-detail; Plan 9 Drill 6 captured via Plan 11 Drill 5; Plans 10-20 Drill 1 name-only; Plans 15-18 Drill 2 name-only; Plan 20 Drill 2 truncated source).
- **Depth balance achieved:** captured-cluster depth is now: passing has ~3.5 plans, setting has 2, attacking has 5, defense has 5, **and Game Play has 4 (Plans 17, 18, 19, 20) — the cluster is now complete**. The Game Play cluster was the cluster best positioned to falsify the "BAB plan grammar is focus-agnostic" claim; **all four Game Play plans fit the spine with slot 4 (movement) intentionally skipped**, **cluster-completing** the slot-4-skip pattern as a confirmed Game Play structural feature. The four plans together added six new composable scoring rule kinds (outcome-elevation, side-switch trigger, conditional-extension from Plan 17; conjunctive/wash from Plan 18; scoring-zone gate from Plan 19; reset-on-miss / consecutive-streak-required from Plan 20) plus asymmetric scoring as a new structural axis (Plan 20), expanding T9's captured rule-grammar from two-pattern symmetry to **nine rule kinds plus asymmetric scoring axis** in four consecutive sharpenings — see `Theses Retired or Narrowed` for the resulting falsification entries. The "spine generalizes to Game Play" claim is now **strongly supported across the entire cluster**, not just three of four plans. Future Volleycraft session-builder work can treat the captured BAB drill book as the authoritative reference for plan-grammar generalization.
- **Effective unique-drill count is much smaller than plan-count.** Roughly 30 distinct source forms account for ~120 captured drill slots; cross-cluster reuse is high (`Best Warm Up Ever` ≈ 14 plans, `Triangle Setting` family ≈ 5 plans, `Mini Games to 7` family ≈ 5 plans, `14-15 Games to 21` ≈ 6 plans). The synthesis weights claims by repetition rank (T13) but should not be read as if 14 plans = 14 independent observations.
- **High-leverage sections for plan-builder work:**
  - `Captured Plan Grammar Templates` — six-slot spine across all four captured clusters (passing, setting, attacking, defense), with focus-specific content per slot.
  - `Cross-Source Convergence Map` — explicit table of where BAB / FIVB / VDM-LTD3 agree, disagree, or fill different gaps across 12 topics.
  - `Cross-Source Theses` (T1-T13) — the thirteen synthesized theses, including T13 on repetition vs novelty signals for catalog vs schema decisions.
  - `Candidate Routing` — the per-drill disposition map (near-term content polish / future D101 / Tier 3+ session-shape).
- This is a synthesis note, not a source archive. Use `docs/research/bab-source-material.md` for drill-level BAB provenance, `docs/research/fivb-source-material.md` for FIVB drill-book provenance, and `docs/research/vdm-development-matrix-takeaways.md` / `docs/research/ltd3-development-matrix-synthesis.md` for Volleyball Canada stage framing.
- Not this note for authorizing catalog additions. Source-backed catalog work still needs decision/spec gates, `D101` participant honesty, `D76` feed-type honesty, `D77` fatigue caps, and the source-backed activation path in `docs/solutions/2026-05-04-source-backed-content-depth-activation-pattern.md`.

## Ideation Pass Receipt — 2026-05-04 (BAB-drill-book-complete)

After the captured BAB drill book reached structural completeness on 2026-05-04, a `ce-ideate` ideation pass was run with two delegated adversarial subagents (`ce-architecture-strategist`, `ce-product-lens-reviewer`). Output: `docs/ideation/2026-05-04-bab-complete-plan-builder-ideation.md`.

**Load-bearing finding from the product-lens critique:** the BAB synthesis is comprehensive **research** but should not drive plan-builder direction at this **milestone**. D101 gates most BAB top-tier drills (5 of 6 source-priority families are 3-4 player); D130 founder-use mode has 17 days remaining to the 2026-05-21 condition read-out; M001 is solo/pair-first; the calm-courtside identity argues against importing BAB-grade schema complexity before content can ship.

**Survivor buckets after adversarial filtering (~46 raw candidates → 12 survivors):**

- **Bucket A — Now-shippable (4 survivors; low-cost, in-canon):** A1 refactor `shouldPrefer*DurationFit` predicates into a `SourceBackedReroute[]` registry (3 validated applications now); A2 receipt the canon-validating BAB confirmations (T1, T2, T5, T7 + spine generalization confirm `D76`, `D77`, `D101`, and the existing archetype shape — externally validated, not new decisions); A3 re-activation triggers in this synthesis frontmatter (above); A4 small `O24` decision-pass packet that engages BAB Plan 1 integrative-focus evidence head-on.
- **Bucket B — Pre-D101 schema gates (3 decisions, no implementation):** B1 pick a T9 modeling stance (separate records vs sibling variants vs runtime overlays) before any `scoringRules` schema work; B2 pick a T6 zone-convention default (BAB 7-zone vs FIVB 5-zone vs attack-accuracy boxes vs product-reduced grid); B3 decide whether slot 4 (movement) becomes optional in archetype contracts.
- **Bucket C — Post-D101 / M002 candidates (5 ideas; gated by re-activation triggers):** C1 composable scoring grammar (9 rule kinds + asymmetric scoring axis); C2 problem-first plan flow (training-problem axis on Setup); C3 drill family abstraction (`familyId` axis); C4 repetition-rank-aware catalog metadata (T13 runtime axes); C5 `compatibleFocuses` axis on drill records (gated on `O24`).

**Sequencing recommendation (architecture-strategist):** the single most important sequencing call is to **resolve `O24` before any schema work** — it gates the read-drill schema, `compatibleFocuses`, and the integrative-focus interpretation. The smallest-cost-highest-value sequence (~2 days total) is A2 + A3 + A4 as a single status / decisions pass; A1 as an internal refactor; B1 + B2 + B3 as decision-pass brainstorms. All of Bucket C waits for explicit re-activation triggers.

**Anti-patterns to avoid importing (architecture-strategist):**

- Per-team rules without a session-context model (single BAB source case in Plan 20; high architectural cost)
- Per-shot drills as duplicate records (T8 sibling-variants approach is the cheaper structure)
- The universal warm-up opener as Volleycraft default (would unground the `D105` Beach Prep contract from its physio source)
- Credit-inflating BAB scoring grammar over FIVB Modified Games (the controlled-feed→live-point→rule-overlay structure may be FIVB framing rebranded)
- Read drills as overloaded `pass`/`set` "scenarios" (T10's narrowing to Defense/Attack-only argues against squeezing into the existing schema)
- Alias-aware schema (the simpler response to drill-name aliasing is to normalize once and pick a canonical name)

**Rejected ideas with rationale:** importing BAB plan generation wholesale into M001; adding BAB-grade complexity to the calm courtside UI before D101; authoring 3+ player drills before `D101` unlocks; per-team rules without a session-context model; universal warm-up opener as Volleycraft default; read-drill 3-axis schema before D135 evidence. See ideation doc for full rationale.

## Bottom Line

BAB gives Volleycraft the clearest **practical practice grammar**: a repeated opener, a named focus, short technical primers, controlled drills, live-feed transfer, then pressure or game wrappers. FIVB gives the guardrails that prevent copying BAB too literally: feed specificity, whole-practice bias, moving-triangle passing, cue density, feedback cadence, measurement vocabulary, and fatigue cautions. Volleyball Canada / VDM gives the stage and time-horizon realism: Initiation -> Acquisition -> Consolidation -> Refinement, 3-month consolidation expectations at 2-3 sessions/week, and structural-tolerance framing.

After capturing **all 20 BAB practice plans** (passing 1-3 and partial 4, setting 5-6, attacking 7-11, defense 12-16, **plus Plans 17-20 — the complete Game Play cluster**), the captured BAB drill book is structurally complete and large enough to reveal **structural patterns that hold across focus areas** rather than only within them. The five captured cluster grammars (passing, setting, attacking, defense, game-play complete) share a common spine — opener → primer → controlled-feed → live-feed transfer → pressure/game wrapper — with focus-specific content filling each slot. **All four Game Play plans (17, 18, 19, 20) fit the spine with slot 4 (movement) intentionally skipped — cluster-completing the slot-4-skip pattern as a confirmed Game Play structural feature.** The within-Game-Play slot 2 primer is "any 4-player chain primer" (Triangle Setting in Plans 17/18/20, Cross Court Pepper in Plan 19). The drill economy is heavily reuse-based: roughly 30 distinct source forms account for ~140 captured drill slots across the 20 plans, confirming Thesis T13's "small unique inventory + many plans → forced reuse" reading. Triangle Setting (4p hit-fed) and 14-15 Games to 21 are tied at **eight plan references each** as the most-repeated source forms; Comp Transition HL/CS Live (six plans), Cross Court Pepper (five plans), `3 Before 5` family (five plans across three clusters), and Around the World (Serve) (four plans) round out the top tier of source-priority candidates per Thesis T13. The captured BAB scoring grammar has **nine composable rule kinds plus asymmetric scoring** as a tenth structural axis.

The most important product thesis is:

> A Volleycraft plan should be **focus-coherent, not skill-isolated**. A passing plan may include setting, serving, and attack elements when they reinforce the sideout / serve-receive problem. The app should preserve the session's training purpose while staying honest about participant count, feed type, workload, and current product scope.

Three other product theses now have strong source support:

- **Drill records should be reusable across focus areas** (T1, evidenced strongly by Plans 12-13 reframing Plans 2 and 8/9 drills under defensive focus).
- **Read drills are a distinct subkind** with a three-axis schema (`readerRole` × `deceiverRole` × `cueSource`) — the captured BAB set fills four cells of that schema (T10).
- **Repetition signals priority; novelty signals architecture** (T13, new). The drills BAB repeats most often are the strongest source-priority candidates for catalog adds; the drills BAB introduces once are the strongest source-architecture candidates for new schema axes.

## How BAB Plans Are Built

Across Plans 1-6, BAB repeats a recognizable plan grammar rather than inventing a new structure each time:

1. **Universal ball-control opener.** `Best Warm Up Ever` appears across passing and setting plans. It is not only mobility; it is a fast cooperative contact ramp that touches pass, set, tomahawk, pokey, pepper, game serves, and beach-specific reads.
2. **Focus-specific primer.** Passing plans use `Basic S/R Footwork`, quadrant control, or triangle passing. Setting plans use `Footwork for Setting` or `Corner to Corner Setting`.
3. **Controlled representative drill.** Plans often stabilize the shape with toss-fed or partner-fed work before live feed: `Passing Triangle from Toss` before `Passing Triangle from Serve`, or basic triangle setting before serve/off-pass variants.
4. **Live-feed or pressure transfer.** Server-vs-passer, live-serve triangle passing, `6 Serve Speed Ball`, and 3-before-5 wrappers preserve perception-action information that solo or self-toss drills cannot.
5. **Competitive/game wrapper.** `3 Before 5`, `+3/-3`, mini games, and wash drills convert technical work into a score or rally constraint.
6. **Repeated families, not isolated one-offs.** BAB reuses `6 Guns`, `Basic S/R Footwork`, `Triangle Setting`, `Around the World`, `Server vs Passer`, and `3 Before 5` with small variations in feed, scoring, player count, or target.

Plan variation mostly happens along a few axes:

- **Feed progression:** self/partner/toss control -> live serve -> full rally.
- **Target progression:** broad control -> marked zones -> tactical sideline/seam/off-pass/back-set targets.
- **Pressure progression:** reps/time -> repeat-until-hit -> point race -> wash/game scoring.
- **Player-count progression:** pair-compatible fundamentals -> 3-player reset loops -> 4-player triangle/target drills -> team/game formats.
- **Cognitive progression:** one movement cue -> late call/read -> correction setting -> constrained game decision.

## Captured Plan Grammar Templates

The five captured cluster grammars (passing, setting, attacking, defense, **complete Game Play cluster via Plans 17-20**) share a common spine. Each cluster fills the spine's six slots with focus-specific content. This is the most actionable finding for future Volleycraft plan-builder work: the spine is **focus-agnostic** (cluster-confirmed across all five captured clusters including the complete Game Play cluster of four consecutive plans), but the content per slot is **focus-specific**.


| Slot                                  | Passing (Plans 1-4)                                                        | Setting (Plans 5-6)                                                             | Attacking (Plans 7-11)                                                                                    | Defense (Plans 12-16)                                                                               | Game Play (Plans 17-20)                                                                                                                                                                                                    |
| ------------------------------------- | -------------------------------------------------------------------------- | ------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1. Opener                             | `Best Warm Up Ever`                                                        | `Best Warm Up Ever`                                                             | `Best Warm Up Ever`                                                                                       | `Best Warm Up Ever` (Plan 13 frames as `(Dig from Knees)`)                                          | `Best Warm Up Ever` (18 plans now — cluster-universal)                                                                                                                                                                     |
| 2. Primer                             | `Basic S/R Footwork`, `7 Drills 4 Quadrants`, `6 Guns`                     | `Footwork for Setting`, `Corner to Corner Setting`, Triangle Setting (3p / 4p)  | Triangle Setting (4p hit-fed), Cross Court Pepper, `3 Touch Vision Pepper`                                | Triangle Setting (4p hit-fed)                                                                       | Plans 17/18/20: Triangle Setting; Plan 19: Cross Court Pepper — slot 2 is "any 4-player chain primer"                                                                                                                      |
| 3. Per-shot / per-skill technique     | `Server vs Passer (Sideline / Seam)`                                       | Bump set, Hand set, footwork-by-side                                            | `Hitting a HL / CS` ≡ `Offensive Accuracy - HL / CS`, `Around the World (Toss)`                           | `Partner Toss Dig to Cut Shot`, `Dig from Knees`, `Toss to HL / CS`, `Hand Dig / Platform Dig Set`  | Plan 17: `Race to 5 HL and CS` (attacking); Plan 18: `Triangle Setting (Serve)` (setting); Plan 19: `+3/-3 Highlines` (attacking); Plan 20: `Around the World (Serve)` (serving) — slot 3 spans all four sub-skills        |
| 4. Movement / position                | (folded into primer)                                                       | `Footwork for Setting`, off-foot/net-foot footwork                              | (often skipped — attack drills assume technique)                                                          | `4 Steps to Paradise`, Pull line / Pull angle                                                       | **(intentionally skipped — confirmed across all four Plans 17, 18, 19, 20 — cluster-complete)**                                                                                                                            |
| 5. Read / decision / pressure overlay | `Server vs Passer (+3/-3) (No Attack)`, `Passing Triangle from Toss/Serve` | `Triangle Setting Off Serve - Off Pass / Back Sets`, `Defensive Retreatment`    | `+3/-3 HL/CS box` (with/without Blocker), `Beat the Blocker`, `Shuffle to HL/CS Dig` (smack-misdirection) | `Pull Digs to Set`, `Shuffle to HL/CS Dig`, `Threat or No Threat` (toss-fed/serve-fed sibling pair) | Plan 17: `10 Sideouts`; Plan 18: `Triangle Setting with Attack (Serve)`; Plan 19: `Comp Transition HL/CS Live`; Plan 20: `3 Before 5 (Serve 1 Player)` (base form)                                                         |
| 6. Live-feed / live-point transfer    | `3 Before 5 (Serve 1 Player)`, `6 Serve Speed Ball`                        | `Triangle Setting from Serve`, modified games                                   | `Open Net Swing`, `2 Ball Side Out`, `Comp Transition HL - CS - Live`                                     | `Shuffle to HL/CS to Live Play`, `Threat or No Threat with Serve`                                   | Plan 17: `3 Before 5` with `BIG point` outcome-elevation; Plan 18: `Add In/Add Out` conjunctive/wash; Plan 19: `Small Court Mini Games` scoring-zone gate; Plan 20: `16-18 Run with It` reset-on-miss + asymmetric scoring |
| 7. Competitive wrapper                | `3 Before 5`, `Mini Games to 7`                                            | `Mini Games to 7 (Two Players Battle)`, `Open Net, High Line, Free. Wash Drill` | `14-15 Games to 21`, `Set to 21`, `Mini Games to 7 (Round N ONLY)`                                        | `Mini Games to 7 (SHOTS ONLY)`, `14-15 Games to 21`, `Best of 3, Match to 21`                       | Plan 17: `Games to 21` with conditional-extension; Plan 18: `14-15 Games to 21, Best of 5`; Plan 19: `Game to 21 (no regulations)` minimal-overlay; Plan 20: `14-15 Games to 21, Best of 3`                                |


Seven observations matter for future Volleycraft session-builder logic:

1. **The spine is consistent across all five captured cluster grammars, with the Game Play cluster now complete (4-of-4 plans confirmed).** Future Volleycraft session archetypes can encode this six-slot spine once and let `skillFocus` select content per slot. The current M001 archetype shape (`warmup` → `technique` / `movement_proxy` → `main_skill` → `pressure` → `wrap`) already encodes a compressed version of this spine; the BAB capture **strongly validates** that shape generalizes across all five captured focus clusters.
2. **Slot 4 (movement) is conditionally skipped — cluster-complete confirmation across all four Game Play plans.** Plans 17, 18, 19, and 20 all skipped slot 4. The slot-4-skip pattern is a confirmed Game Play structural feature, not a partial pattern or anomaly. Future Volleycraft session-builder logic should treat slot 4 as **optional** rather than required; Game Play archetypes should default to slot-4-skipped.
3. **Slot 2 (primer) is "any 4-player chain primer," confirmed across the Game Play cluster.** Plans 17, 18, 20 used Triangle Setting; Plan 19 used Cross Court Pepper. Triangle Setting (4p hit-fed) is the more common primer (3 of 4 plans); Cross Court Pepper is the alternative. Future Game Play archetypes should support multiple primer choices with Triangle Setting as the default.
4. **Slot 3 (per-skill technique) spans all four sub-skills across the Game Play cluster.** Plan 17 (attacking accuracy), Plan 18 (setting under serve), Plan 19 (attacking accuracy with blocker), Plan 20 (serving accuracy). Future Game Play archetypes should support per-skill technique selection at slot 3 across passing / setting / attacking / serving.
5. **Slots 5 and 6 are where decision-or-pressure drills and novel scoring overlays live.** All four Game Play plans use slot 6 to introduce a novel scoring overlay: BIG point (Plan 17), wash (Plan 18), scoring-zone gate (Plan 19), reset-on-miss + asymmetric (Plan 20). Slot 5 carries diverse drill subkinds: measurement format (Plan 17 10 Sideouts), whole-chain technique (Plan 18 Triangle Setting with Attack), competitive-transition (Plan 19 Comp Transition), sideout pressure (Plan 20 3 Before 5). Slots 5 and 6 are the **innovation slots** in the captured BAB Game Play cluster.
6. **Slot 7's competitive wrapper is mostly focus-agnostic with composable overlays.** `Mini Games to 7`, `14-15 Games to 21`, and `Game to 21` appear across multiple focus areas with rule-restriction / rule-augmentation / tiebreaker / side-switch / outcome-elevation / conditional-extension / conjunctive-wash / scoring-zone-gate / reset-on-miss overlays per focus. The wrapper family has a base form (Plan 19's `Game to 21 (no regulations)`) plus the **nine** composable overlay rule kinds.
7. **Triangle Setting and 14-15 Games to 21 are tied at eight plan references each as the source-priority leaders.** Plan 20 extends both to eight plan references. Comp Transition HL/CS Live (six plans), Cross Court Pepper (five plans), `3 Before 5` family (five plans across three clusters), and Around the World (Serve) (four plans) round out the top tier per Thesis T13. **These six drill families are the highest-priority catalog-add candidates** in the Tier 3+ backlog once `D101` 3+ player support unlocks.

## Cross-Source Convergence Map

The captured set now lets us map where BAB, FIVB, and Volleyball Canada (VDM / LTD3) converge, where they diverge, and where each fills a gap the others don't.


| Topic                               | BAB                                                                                                                                                                               | FIVB                                                                                                                                                                                   | Volleyball Canada (VDM / LTD3)                                                                                                         | Volleycraft alignment                                                                                                                                                    |
| ----------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Practice-plan grammar**           | Six-slot spine across all 20 captured plans                                                                                                                                       | Coaches Guide-style template (Bill Neville / Carl McGown, Level I Ch VII) — converges on whole-practice bias and four exception cases                                                  | LTD3 / Active-for-Life session ratios (practice:compete) — different abstraction layer                                                 | Spine generalizes; FIVB's whole-practice bias is the guardrail (T3)                                                                                                      |
| **Drill measurement / scoring**     | Per-shot binary (in box / out), `+3/-3`, `3 Before 5`, `Mini Games to 7` with rule-restriction overlays, `14-15 Games to 21`, `Best of 3, Match to 21` with composable extensions | Six measurement modes (Level I Ch VII): Timed / Successful reps / Successful reps in a row / Timed block + required reps / Reps with minuses for unforced errors / Athlete termination | 70% threshold (D104) for progression; structural tolerance framing for load (D84/D113)                                                 | BAB scoring is composable (T9, T13); FIVB measurement vocabulary names the modes; VDM 70% gate operationalizes them                                                      |
| **Cue density / coaching cues**     | Implicit via drill structure; Coaches Guide's `Establishing a Focus` essay                                                                                                        | One key cue at a time for beginners (Level II Ch III.3); 2-3 cues for intermediate/advanced                                                                                            | Initiation → Acquisition → Consolidation → Refinement skill stages (VDM pp. 31, 34, 36)                                                | T4 stage-gating combines all three: VDM stage taxonomy + FIVB cue-density rule + BAB plan structure                                                                      |
| **Feedback cadence**                | Implicit (drill-internal)                                                                                                                                                         | "2-3 trials between feedback prompts" (Level II Ch III.8); positive in high-intensity, corrective in low-intensity                                                                     | Not directly addressed                                                                                                                 | FIVB cadence rule sharpens the Volleycraft prescriptive-default-bounded-flex posture                                                                                     |
| **Whole-practice vs part-practice** | Whole-practice bias (Coaches Guide Essay 1, "all drills designed to reinforce this focus")                                                                                        | Whole-practice bias (Level I Ch VII p. 121, McGown); four exceptions (fear / danger / frustration / too-complex)                                                                       | Not directly addressed                                                                                                                 | BAB/FIVB converge; T3 cites both                                                                                                                                         |
| **Fatigue / load**                  | Repeat-until-hit → workload risk (T5); "okay to get blocked" framing                                                                                                              | Diamond Passing 2-set-of-4 cap (FIVB Drill 3.13); Spike Exhaustion / Continuous Spiking shoulder-load warnings                                                                         | Structural Tolerance framing; VDM 3×/week minimum; LTD3 Active-for-Life sleep row                                                      | All three converge on caps; T5 enforces "count attempts, not just successes"; D77 is the operational policy                                                              |
| **Zone conventions**                | 7-zone attacking (Plans 1, 4, 8); 4/6/8-zone serving (scalable per level, Plan 2); 4×4 / two-shot accuracy boxes (Plan 7)                                                         | 5-zone attacking (Drill 5.6); 6-zone serving                                                                                                                                           | Not addressed                                                                                                                          | Future attack-chain decision needs to pick one (T6); BAB 7-zone has the most repeated source authority                                                                   |
| **Read drills (look-and-react)**    | Four read-drill cells: defender-deception (Plan 9), blocker-deception (Plan 11), attacker-deception (Plan 14), blocker-as-reader with team-context cue (Plan 16)                  | "Quick look" cue (Drills 3.15 `Pass and Look`, 4.9 `Set and Look`); blocker hand-signal convention                                                                                     | Cue-reading / decision-making / execution as Player Pillar demands taxonomy (VDM pp. 30, 48-49)                                        | Strongest cross-source convergence (T10); three-axis schema (`readerRole` × `deceiverRole` × `cueSource`) needed                                                         |
| **Player-count realism**            | Most BAB drills assume 3-4 players + coach                                                                                                                                        | Many "beginner" drills specify "1 athlete + coach assisting" — coach-dependent                                                                                                         | LTD3 / VDM stage tables don't enforce participant count                                                                                | T7 + D101 keep Volleycraft pair/solo honest; FIVB confirms coach-dependence is the source-form default                                                                   |
| **Pressure scoring formats**        | `3 Before 5`, `+3/-3`, `Mini Games to 7` with overlays, `14-15 Games to 21`, `Best of 3 Match to 21`, `Set to 21`                                                                 | Modified Games chapter (15 rule-variant games)                                                                                                                                         | LTD3 practice:compete ratios (e.g., 70:30 for Learn to Train)                                                                          | BAB scoring is composable (T9 + T13); FIVB Modified Games is the broader template; LTD3 sets the macro ratio                                                             |
| **Goal-setting / motivation**       | Coaches Guide Essay 3 ("Keeping the Competitive Fire") — coach-mediated goal alignment per practice                                                                               | Not addressed                                                                                                                                                                          | Person Pillar Guidebook framing (LTD3 source)                                                                                          | O22 (M002 weekly confidence) tracks the carry-forward; coach-hype voice rejected (T-Adapt)                                                                               |
| **Stage / age progression**         | Implicit (Beginners catch / Intermediate-Advanced continuous, Plan 10)                                                                                                            | Fitts & Posner three-stage model (Cognitive → Associative → Autonomous, Level II Ch III.2)                                                                                             | LTD3 stage framework (Active Start → Active for Life); VDM 4-stage skill model (Initiation / Acquisition / Consolidation / Refinement) | T4 + T12 layer all three; VDM 4-stage is the skill-level vocabulary, FIVB Fitts/Posner is the cognitive overlay, BAB level-scaled rules show the rule-by-level mechanism |


Convergence patterns worth naming:

- **All three sources agree on whole-practice bias and per-skill cue density.** This is canon-eligible if Volleycraft ever needs to cite an outside authority for the prescriptive-default approach.
- **All three converge on workload caps** but from different angles: BAB drill-level (Diamond Passing 2-set-of-4 cap), FIVB Spike-Exhaustion warnings, VDM Structural Tolerance framing.
- **BAB and FIVB diverge on zone counts** (7 vs 5 attack); VDM is silent. Volleycraft needs a deliberate decision (T6).
- **VDM is the only source with explicit time horizons** (~3 months at 2-3×/week to consolidate). BAB and FIVB are silent on macrocycle realism.
- **BAB is the only source with detailed read-drill content.** FIVB has the "look" cue concept but not the four-cell read-drill taxonomy. VDM names cue-reading as a demand category but doesn't enumerate drill subkinds. T10's three-axis schema is largely BAB-derived.

Divergence patterns worth naming:

- **Source bias differs.** BAB is North American beach-coaching practice; FIVB is international institutional volleyball; VDM/LTD3 is Canadian developmental framework. Volleycraft should privilege BAB for plan-grammar and drill content, FIVB for guardrails and cue rules, VDM for stage and time-horizon framing — and never default to one source when another disagrees.
- **Coach role differs.** BAB assumes a head coach actively running the practice; FIVB assumes "coach + N athletes" with the coach as the feeder; VDM assumes club / NSO coaching infrastructure. Volleycraft is self-coached; T7 and D101 keep that constraint visible.
- **Player count differs.** BAB defaults to 3-4 athletes per drill; FIVB drills span 1-coach-plus-N athletes; VDM doesn't enforce. Volleycraft is pair/solo native; T7 + D101 are the operational gates.

## Cross-Source Theses

Each thesis is tagged with its **evidence base**: which sources contribute structural evidence (versus corroborating vocabulary), how many independent cases support the claim, and what the strongest competing reading would be. The tags are deliberate epistemic transparency — if a thesis is BAB-only with 1-2 cases, it is not yet license to seed Volleycraft schema decisions; it is license to open a question and watch for corroborating evidence.

### T1. Practice Focus Is A Purpose, Not A Tag

**Evidence base:** BAB Plans 12 (drill reuse) and 13 (defender-perspective framing) — 2 BAB cases. No FIVB or VDM corroboration of "drill-as-focus-agnostic-record." **Competing reading:** BAB has a small drill inventory (~30 unique source forms across 20 plans) and reuses them across plans because authoring a separate drill per focus would inflate the source. The reuse may be authoring economy, not pedagogy.

BAB labels Plans 1-4 as passing, but those plans repeatedly include setting and attack because the practical beach problem is sideout quality. Plan 5 and Plan 6 are setting plans, but setting is tested through pass quality, dig-set-attack rhythm, off-pass correction, and wash-game scoring. Plans 12-13 (defense) further confirm the pattern: they include Triangle Setting and Mini Games to 7 (drills that originated in Plans 5 and 7) under defensive-focus framing.

Plans 12 and 13 supply the cleanest BAB evidence for this pattern, in two escalating forms:

- **Plan 12 (drill reuse with structural reframing):** Plan 12 Drill 4 (`Serve a Spot - Dig Set Hit`) is the same physical drill as Plan 2 Drill 4 (`Serve Spot, Dig Set Hit`) — Plan 2 frames it for passing emphasis, Plan 12 frames it for defensive emphasis, and the drill itself is unchanged. BAB authors a single drill once and cites it across plans with different focus framing rather than creating per-focus duplicates.
- **Plan 13 (drill reuse with explicit perspective shift):** Plan 13 Drills 5 and 6 (`Toss to HL` / `Toss to Cut Shot`) are the same per-shot HL/CS technique drills as Plans 8/9 (`Hitting a High Line` / `Offensive Accuracy - HL` and the cut-shot siblings), but Plan 13 explicitly re-frames the named focus character from the attacker (`Player 2 hits a high-line shot`) to the defender (`Player 1 reacts and catches shot`). The drill is structurally identical; the practice context shifts from attack-focus to defense-focus by **renaming the named focus character**. This is the strongest source evidence in the captured set that BAB sees focus as a property of the *practice context*, not the *drill record*.

Volleycraft implication: session focus should eventually mean "the practice problem we are solving" rather than "every block has the same `skillFocus`." Future plan-building should support both focus-coherent integrated blocks **and** drill records that can be selected for different `skillFocus` values when the practice problem changes — without authoring duplicate records per focus area. The session builder should be able to select the same drill record for different `skillFocus` values, with the focus framing carried by the practice context (session archetype, named focus, courtside copy emphasis) rather than by the drill record itself. Current M001 can stay simpler, but the schema should not preclude this pattern — and any future `compatibleFocuses` axis should support multi-focus selection rather than locking a drill to a single focus.

### T2. Feed-Type Honesty Is The Core Transfer Boundary

**Evidence base:** BAB Plan 3 (toss → serve sibling), FIVB Drills 3.4 / 3.6 / 3.13 / 3.15 (serve-receive specificity), motor-learning literature on perception-action coupling (well-established outside BAB). Multi-source corroboration; this thesis would hold without BAB. **Competing reading:** none worth naming — feed-type honesty is canonical motor-learning theory, not a BAB finding.

BAB's best progressions change one thing at a time: Plan 3 keeps triangle geometry and target constant while changing feed from toss to serve. FIVB and motor-learning research reinforce that live serve and game-like feeds carry perception-action information that self-toss cannot reproduce.

Volleycraft implication: keep feed variants as sibling variants in a family, not unrelated drills. A solo/open-court version may be useful, but it must be labeled as a reduced control drill rather than true serve-receive or sideout transfer.

### T3. Whole-Chain Work Should Be The Default, With Primers As Exceptions

**Evidence base:** FIVB Level I Coaches Manual Ch VII p. 121 (McGown's whole-practice essay) — the *primary* source. BAB exhibits the pattern; it does not originate it. Multi-source corroboration. **Competing reading:** none — this is canonical coaching pedagogy.

FIVB coaches-manual notes argue for whole-practice bias, with part-practice justified for fear, danger, frustration, or excessive complexity. BAB behaves similarly: it uses primers, then returns to pass-set-attack, dig-set-attack, or score-constrained games.

Volleycraft implication: plan assembly should avoid stacks of isolated drills with no return to the chain. Even a short session should have a "why this supports the real pair problem" line.

### T4. Stage Gating Needs Both Source Vocabulary And Product Conservatism

**Evidence base:** VDM 4-stage skill model (Initiation / Acquisition / Consolidation / Refinement, pp. 31, 34, 36); FIVB Level II Ch III.3 cue-density rule; Plan 10's level-scaled rule sentence. **Competing reading:** the VDM takeaways doc explicitly says the 4-stage vocabulary should not be operationalized into a runtime gate without an explicit D-number, and the 3-month consolidation quote is "expectation-setting, not a progression rule." T4 below names the *authoring shape* the vocabulary suggests, not a runtime gate; promoting T4's per-stage variation rules into runtime behavior requires a separate decision that this synthesis does not authorize.

VDM's Initiation / Acquisition / Consolidation / Refinement vocabulary explains why beginner, intermediate, and advanced variants should not merely be longer versions of the same drill. FIVB's cue-density rule says beginners get one cue at a time; VDM's consolidation quote warns that durable progress can take months, not one clean session.

Volleycraft implication (**authoring shape only, not runtime gate**): future plan-builder *authoring* should treat stage as an axis for selecting variation **kind**, not just dose. The shapes below are authoring guidance for source-backed variant generation, not runtime behavior the session builder enforces:

- **Initiation:** simple target, low cue density, low cognitive load, clear completion metric.
- **Acquisition:** controlled variability, short marked targets, generous rest, simple binary success.
- **Consolidation:** live feed, pressure scoring, left/right or short/deep variation, still capped.
- **Refinement:** tactical reads, correction settings, wash games, role specialization, and game constraints.

Operationalizing these shapes as runtime stage gates requires a separate decision and would conflict with `docs/research/vdm-development-matrix-takeaways.md` Item 1's explicit constraint. Until then, treat T4 as a guide for *authoring per-stage variants* rather than a rule for *runtime selection of those variants*.

### T5. Workload Caps Must Count Attempts, Not Just Successes

**Evidence base:** BAB repeat-until-hit drill structures (multiple plans); FIVB Drill 3.13 Diamond Passing 2-set-of-4 cap; FIVB spike-exhaustion warnings; D77 fatigue cap policy in `docs/decisions.md`. Multi-source corroboration; D77 already operationalizes this in repo canon. **Competing reading:** none — T5 is a restatement of D77 with source backing.

BAB often uses repeat-until-hit or redo-invalid-serve rules. That is a good coaching shape but risky product copy if total attempts are uncapped. FIVB's fatigue cautions and `D77` both point the same way: retries are workload.

Volleycraft implication: any repeat-until-success drill needs a max-attempt cap, max-minute cap, and stop-on-technique-drop wording. A drill cannot be considered well-authored if only the successful reps are bounded.

### T6. Zone Conventions Are Not Portable Across Skills

**Evidence base:** BAB Plans 1, 4, 8 (7-zone attack); BAB Plan 7 (attack-accuracy boxes); BAB Plan 2 (4/6/8-zone serving); FIVB Drill 5.6 (5-zone attack). Cross-source disagreement. **Competing reading:** the "BAB 7-zone has the strongest source-authority" framing relies on counting BAB internal repetitions as votes, which weights one author's pedagogical preference inappropriately against FIVB's institutional authority. Both BAB and FIVB are valid sources; the convention question is a Volleycraft decision driven by cognitive-load / measurability / product trade-offs, not by repetition count.

BAB uses `Around the World` for both serving and attacking, but the zones differ: BAB serving scales 4 / 6 / 8 by level, BAB attacking uses 7 zones (now confirmed verbatim across Plans 1, 4, and 8), and FIVB attacking uses 5 zones. Plan 7 adds a fourth pattern: **attack-accuracy boxes** — a single 4×4 marked rectangle for one shot at a time (Drill 4) or two boxes per attacker for an alternating high-line / cut-shot drill (Drill 6). These boxes are not interchangeable with numbered-zone ladders; they ask the attacker to repeat one shot to a fixed accuracy target rather than march through a sequence of zones.

Volleycraft implication: do not reuse a serving grid for attack, do not silently collapse the BAB and FIVB attack grids, and do not assume an Around-the-World ladder and a per-shot accuracy box are the same drill family. Future attack-chain work needs an explicit convention decision among at least four candidates (BAB 7-zone, FIVB 5-zone, BAB attack-accuracy boxes, or a product-specific reduced grid) based on cognitive load, measurability, source authority, and catalog consistency. The 7-zone version now has the strongest source-authority weight in the captured set (three verbatim appearances across BAB Plans 1, 4, and 8); that does not automatically settle the convention question, but it is the working default until a decision pass picks one.

### T7. BAB Is Pair/Small-Group Native; Volleycraft Must Stay Constraint-Aware

**Evidence base:** BAB drill participant counts across all 14 captured plans (most highest-transfer drills need 3-4 players); FIVB drills span 1-coach-plus-N athletes; D101 (3+ player support) policy in `docs/decisions.md`. Multi-source corroboration; D101 already operationalizes this in repo canon. **Competing reading:** none — T7 is a restatement of D101 with source backing.

Many of the highest-transfer BAB drills need 3-4 players: triangle passing, triangle setting, `6 Serve Speed Ball`, defensive retreatment, cross-court pepper, off-pass correction setting, and wash games. This is not a flaw in BAB; it reflects a coach/practice environment different from M001.

Volleycraft implication: do not compress 3+ player source forms into pair-native drills without changing the claim. Keep them as `D101` candidates until the product has honest participant/role support.

### T8. Per-Shot Drills Are Sibling Variants, Not Configurable Parameters

**Evidence base:** BAB Plan 8 Drills 2-3 (`Hitting a HL/CS`); Plan 9 Drills 4-5 (`Offensive Accuracy - HL/CS`); Plan 12 Drill 2 (`Partner Toss Dig to Cut Shot`); Plan 13 Drills 5-6 (defender-perspective HL/CS); Plan 8 Drill 8 round-set; Plan 7 Drill 4 per-shot box. ~6-8 BAB cases; no FIVB or VDM corroboration of the "sibling variants over parameters" *modeling* preference. **Competing reading on aliasing sub-claim:** the drill-name aliasing observation (Plan 8 ↔ Plan 9 ↔ Plan 13 word-for-word identical except for name) may be **authoring drift in a 20-plan source written by the same author(s)** rather than a deliberate pedagogical pattern. The simpler response is to normalize once and pick one canonical name per drill family in the cross-reference, not to build alias-aware schema.

BAB consistently authors per-shot work as separate drill records, not as one parameterized drill. `Hitting a High Line` and `Hitting a Cut Shot` (Plan 8 Drills 2 and 3) are word-for-word identical except for the named shot. The same pattern appears in `Server vs Passer (Sideline / Seam / +3/-3)` (Plan 2), the per-shot-target boxes in Plan 7 Drill 4 (`+3/-3 Highlines - Cut Shots / HL`), the per-round shot menu in Plan 8 Drill 8 (`Round 1 Cut Shot, Round 2 High Line, Round 3 Hard Angle, Round 4 Hard Line`), and the renamed `Offensive Accuracy - HL / CS` (Plan 9 Drills 4/5).

Plan 9 also confirms a related observation: **the same source-form drill can carry different names across plans**. Plan 8 `Hitting a High Line / Cut Shot` and Plan 9 `Offensive Accuracy - HL / CS` are word-for-word identical except for the drill name. This means the cross-reference table cannot be one-to-one — a single Volleycraft drill family may need to map to multiple BAB names, and grep-discoverability matters when authoring or reviewing.

Volleycraft implication: a future attack chain should preserve the per-shot variant model — one variant per named shot — rather than collapse all shots into one configurable drill. The tactical claim, the accuracy target, the cue density, and the typical defender read differ per shot. Configurable parameters look cheaper at authoring time but lose the per-shot honesty in courtside copy, success metric, and progression gating. Where the same source-form drill has multiple BAB names, the Volleycraft drill record should declare both names in provenance comments and the cross-reference should map both names to the same future drill family.

### T9. Rule-Restricted And Rule-Augmented Variants Are A First-Class Authoring Pattern

**Evidence base:** BAB Plan 8 (`SHOTS ONLY`, `Round 1 and 2 ONLY`, `(only shots)`); Plan 11 Drill 4 (rule-augmented `+3/-3 with Blocker`); Plan 15 Drill 7 (`SHOTS ONLY` with `win by 2`); Plan 16 Drill 7 (`third-to-15` tiebreaker); Plan 17 Drill 5 (`BIG point` outcome-elevation, side-switch trigger); Plan 17 Drill 6 (conditional-extension); Plan 18 Drill 5 (`Add In/Add Out` conjunctive/wash scoring); Plan 19 Drill 5 (`Small Court: Mini Games to 7` scoring-zone gate); **Plan 20 Drill 5 (`16-18 Run with It` reset-on-miss / consecutive-streak-required + asymmetric scoring)**; Mini Games to 7 family across Plans 5/8/12/15/19. ~13 BAB cases across all five captured clusters. FIVB Modified Games chapter (15 drills) is a **structurally identical** pattern — rule deltas applied to a normal game — but the synthesis credits BAB rather than naming FIVB as the institutional source. **Sharpening (Plans 17 + 18 + 19 + 20 triggers):** see `Theses Retired or Narrowed` for the four 2026-05-04 sharpenings that broadened T9 first from "two patterns with sign-flip symmetry" to "six composable rule kinds" (Plan 17), then from six to "seven" (Plan 18 conjunctive/wash), then from seven to "eight" (Plan 19 scoring-zone gate), then from eight to **nine composable rule kinds plus asymmetric scoring as a tenth structural axis** (Plan 20 reset-on-miss/streak-required + per-team rule mechanism). The original two-pattern framing is retired in favor of the nine-kind-plus-asymmetric framing. **Competing reading:** the controlled-feed→live-point→rule-overlay structure may be FIVB's modified-games framing rebranded; BAB instantiates it without cross-citing FIVB.

BAB Plan 8 introduces a clean pattern for taking an existing drill and constraining it to keep the practice on the named focus: `(only shots)` on `Comp Transition HL - CS - Live`, `(SHOTS ONLY)` on `3 Before 5 (Serve 1 Player)`, and `Round 1 and 2 ONLY` on `Mini Games to 7`. Plan 11 Drill 4 adds the inverse pattern: a **rule-augmented variant** that extends a parent drill with a new scoring rule (`+3/-3 Highlines (CS / HL with Blocker)` adds a blocker-touch -1 penalty to Plan 7 Drill 4's `+3/-3 Highlines - Cut Shots / HL`). Plan 15 Drill 7 adds yet another Mini Games to 7 variant (`SHOTS ONLY` with a composable `win by 2` scoring extension), bringing the captured Mini Games to 7 family to **four documented rule-restriction variants**: First Ball Focused Shot / Two Players Battle (Plan 5/12), Round 1 and 2 ONLY (Plan 8), SHOTS ONLY (Plan 15), and the bare base form. BAB lists each as a distinct drill in the practice flow, not as a runtime toggle. FIVB's modified-games chapter shares the structural shape: rule deltas applied to a normal point.

The Mini Games to 7 family is now the **strongest source case** for the single-base-drill-with-parameter-overlays modeling approach. Splitting the family across four separate records would consume four rows of the authoring-budget cap for what are functionally near-duplicates. The "win by 2" scoring extension also signals that scoring rules should be **composable** (base game-to-N format + extension like win-by-margin) rather than enumerated as separate scoring types.

The two patterns are inverse but structurally identical:

- **Rule-restricted variants** (Plan 8): the variant **subsets** the parent drill's behavior (only certain shots count; only certain rounds are played).
- **Rule-augmented variants** (Plan 11): the variant **extends** the parent drill's behavior with an additional scoring rule (blocker-touch penalty added).

Both are constraint overlays on a parent drill. Volleycraft should treat them symmetrically.

Volleycraft implication: pick **one** modeling approach for rule-restricted/augmented variants across the catalog rather than treating each constraint as a unique drill. Three viable options exist, each with different consequences:

- **Separate drill records** (BAB's source pattern): clearest in catalogs and diagnostics, but consumes the authoring-budget cap for what are functionally near-duplicates.
- **Sibling variants on a parent drill**: catalog-parsimonious, easy to swap, but requires variant metadata to express the constraint cleanly.
- **Runtime constraint toggles**: most user-controlled, smallest catalog footprint, but adds runtime complexity to the swap pool, success-metric resolution, and diagnostic classification.

The choice should be deliberate and consistent — mixing all three across the catalog will create diagnostic noise. Whichever approach is chosen must support **both** restriction and augmentation symmetrically; supporting only one of the two patterns will force authoring back into duplicate-record territory for the unsupported direction.

### T10. Read/Look-And-React Drills Are A Distinct Drill Subkind

**Evidence base for the drill-subkind claim:** BAB Plans 9 / 11 / 14 / 16 (4 BAB drills) + FIVB Drills 3.15 (`Pass and Look`) and 4.9 (`Set and Look`) — the FIVB pair contributes the "look" vocabulary cue but does not contribute the structural schema. **Evidence base for the three-axis schema:** 4 BAB drills mapped to 4 cells of a 3-axis schema. **Cluster-distribution evidence (post-Plan-20):** **read drills are absent from the entire Game Play cluster (Plans 17-20).** All four captured BAB read drills appear in Defense (Plans 14, 16) or Attacking (Plans 9, 11) clusters; zero read drills appear across the four captured Game Play plans. **Narrowing:** T10's "drill subkind" claim is **narrowed** from "a universal pattern across all clusters" to **"a Defense / Attack pattern that does not recur in pure Game Play."** Future Volleycraft session-builder logic for Game Play archetypes should not assume read drills are part of the Game Play cluster grammar. The four-cell read-drill taxonomy may be **complete for the captured BAB set** — no Game Play plans contributed new cells. **Competing reading:** a categorical schema with 3 axes built from 4 training cases is still a hypothesis built on small evidence; the Defense/Attack-only narrowing strengthens the claim's stability but does not increase the per-cell evidence base. Treat the three-axis proposal as a **working hypothesis confined to Defense and Attack drill content** rather than a universal Volleycraft pattern.

BAB Plan 9 Drill 3 (`3 Touch Vision Pepper`) and FIVB Drills 3.15 (`Pass and Look`) and 4.9 (`Set and Look`) converge on a drill pattern that is structurally different from straight technique or accuracy work: the player must **read** something — defender hand position, open court, blocker move, set quality — and choose accordingly. The decision is the scored skill, not just the contact.

The captured BAB set now includes **four positions across two axes** for read drills:

- **Plan 9 Drill 3 (`3 Touch Vision Pepper`):** reader = attacker; deceiver = defender (hand position); cue source = opponent action.
- **Plan 11 Drill 5 (`Beat the Blocker`):** reader = attacker; deceiver = blocker (grab / line / cross choice); cue source = opponent action.
- **Plan 14 Drills 4–5 (`Shuffle to HL/CS Dig`):** reader = defender; deceiver = attacker (smack-misdirection); cue source = opponent action.
- **Plan 16 Drills 5–6 (`Threat or No Threat`):** reader = blocker; deceiver = none; cue source = **team-context** (teammate's set quality).

Plan 16 is the structurally novel addition: the first BAB drill where the read cue is a **team-context cue** (teammate's contact quality) rather than an opponent action, and the first BAB drill where the **blocker is the reader**. This expands the read-drill taxonomy from a single rotating "deceiver role" axis (Plan 14's framing) to a **three-axis schema**:

- `**readerRole`** (`'defender' | 'blocker' | 'attacker' | 'none'`): who is reading the cue.
- `**deceiverRole`** (`'defender' | 'blocker' | 'attacker' | 'none'`): who (if anyone) is the deceiver. May be empty when the cue is team-context rather than opponent action.
- `**cueSource**` (`'opponent-action' | 'team-context'`): whether the cue comes from opponent behavior or from a teammate's contact quality.

Volleycraft implication: when attack or defense content lands, treat read drills as a distinct subkind from technique drills (`Hitting a HL / CS`), accuracy drills (`+3/-3 HL/CS box`), and pure dig-technique drills (`Partner Toss Dig to Cut Shot`). They likely need:

- **A scored decision metric**, not just a scored contact. "Did the player read correctly?" is the primary success criterion; the contact quality is secondary.
- **A three-axis schema** (`readerRole`, `deceiverRole`, `cueSource`) — the BAB taxonomy of read drills covers all four cells of the reader×cueSource matrix that have been captured so far. Future read drills should specify all three values explicitly.
- **A `feedPattern` axis distinct from `feedType`** for drills like Plan 14's smack-misdirection where the feed itself is deliberately deceptive. `feedType` is who feeds; `feedPattern` is how the feed signals or conceals the actual contact.
- **Sequencing after technique foundations**, not before. The read overlay assumes the player can already produce the choices being read for.
- **Cross-source citation discipline**, because BAB and FIVB use different vocabulary for the same concept (BAB: "vision," "look," "smack," "threat / no threat"; FIVB: "quick look," "pass and look," "set and look"). Future drill copy should pick one term per concept and stick with it.

This is the cleanest cross-source convergence in the captured set so far on a drill pattern that today's catalog doesn't express at all.

### T11. Defender Position Is Relative To The Blocker, Not Absolute (And The Blocker Can Be Fixed Or Reactive)

**Evidence base:** Plan 10 Drills 4–7 (fixed-blocker matrix, 1 source pattern); Plan 11 Drill 5 (reactive blocker, 1 source). **2 BAB drills total.** No FIVB or VDM corroboration of the "blocker-defender coupling matrix" or the fixed-vs-reactive blocker axis. **Competing reading:** two drills are not yet a taxonomy. The "blocker can be fixed or reactive" sub-claim rests on a single comparison; calling it a schema axis (`blockerBehavior`) is premature. Treat T11 as a **provisional taxonomy** that needs at least a third corroborating BAB drill or a second-source confirmation before authoring the proposed schema axes (`blockerPosition`, `blockerBehavior`, `defenderPickupZone`).

BAB Plan 10 Drills 4–7 form a four-cell matrix where the same drill skeleton (serve to receiver, receiver hits a named shot, defense reacts) varies by **attacker shot × blocker position × defender pickup zone**. The Drill 5 / Drill 6 contrast is the load-bearing source: when the blocker takes line, the defender takes the cut shot; when the blocker takes cross, the defender takes the highline. The blocker-defender pair is a single defensive unit, and the defender's pickup zone is determined by what the blocker is taking away.

Plan 11 Drill 5 (`Beat the Blocker`) adds a second blocker-behavior mode: the **reactive blocker**. Instead of taking a fixed position named in the drill spec, the blocker chooses among grab / block line / block cross in real time, and the attacker must read the blocker and either challenge (swing at the block) or avoid (swing away). This is structurally distinct from Plan 10's fixed-blocker matrix; future Volleycraft content needs both modes.

Volleycraft implication: any future attack or defense content needs metadata that can express the blocker-defender pairing rule **and** the blocker behavior. At minimum:

- `**blockerPresence`** axis (`open` / `blocked`) from Plan 7 Drill 5's open-net swing.
- `**blockerPosition`** axis (`line` / `cross` / `none`) from Plan 10 Drills 5 and 6 (fixed-blocker case).
- `**blockerBehavior**` axis (`fixed` / `reactive`) from Plan 11 Drill 5's reactive-blocker case. Reactive blockers cycle through positions during the drill; fixed blockers commit to one position named in the drill spec.
- `**defenderPickupZone**` axis or a derived value computed from blocker position and shot. With reactive blockers, the defender pickup zone may also be reactive (the defender adjusts to what the blocker takes in real time).
- **A coupling rule** that prevents authoring a `blocker-blocks-line + defender-picks-up-highline` combination, which is incoherent against the BAB source.

Plan 10 Drills 4–7 should be modeled as one drill family with sibling variants spanning the fixed-blocker matrix; Plan 11 Drill 5 should be modeled as the reactive-blocker counterpart in the same family or as a sibling family. This is the beach-defense analog of the moving-triangle passing theory: position is relative to teammates, not to the court.

### T12. Some Drill Rules Scale By Level, Not By Parameter

**Evidence base:** BAB Plan 10 Drill 2 (Triangle Setting hit-fed: "Beginners should catch after the set. Intermediate/Advanced should try to make this continuous"); **BAB Plan 19 Drill 5** (Small Court Mini Games to 7: "For beginners/intermediate, the serve can go to either player. For advanced players the serve should be served to the same players for the entire game"). Two BAB cases across two plans — graduated from sample-of-one to two-source pattern. No FIVB or VDM corroboration. **Competing reading:** two sentences across two drills is still a small evidence base; the pattern is real but the sample is shallow. The two cases are structurally similar (per-level rule changes within a single drill description) but differ in mechanism: Plan 10's level-scale changes the chain-completion rule (catch vs continuous); Plan 19's level-scale changes the serve-target rule (any player vs same player). Treat T12 as a confirmed two-source pattern, with the "three modeling options" recommendation now warranted but still not over-decided — the next plan capture's level-scaled rule (if any) would test whether the pattern is broader.

BAB Plan 10 Drill 2 (`Triangle Setting (4-player hit-fed)`) is the first BAB source that specifies different drill **behavior** by level inside a single drill description: "Beginners should catch after the set. Intermediate/Advanced should try to make this continuous by hitting the set back to the passer." This is structurally distinct from per-level **parameter** scaling (Plan 2's 4 / 6 / 8 serving zones) and from the static skillStage VDM vocabulary (Initiation / Acquisition / Consolidation / Refinement) — Plan 10 changes what the drill *does*, not how hard it is.

Volleycraft implication: level-scaled rules within a single drill description need an explicit modeling decision. Three viable options:

- **Sibling variants** at different `level` bands (mirrors the BAB source pattern; consumes catalog rows).
- **Runtime difficulty toggles** on a parameterized drill (smallest catalog footprint; adds runtime complexity).
- **Authored progression / regression links** between two records that differ only in the rule (uses existing schema; doubles catalog rows but keeps each record honest).

The choice should align with the T8 / T9 modeling decisions for per-shot variants and rule-restricted variants — same authoring philosophy across the catalog. Mixing approaches will create diagnostic noise and inconsistent swap-pool composition.

### T13. Repetition Signals Priority; Novelty Signals Architecture

**Evidence base:** count of distinct source forms vs drill slots across **all 20 captured BAB plans** (~30 forms / ~140 slots) — captured BAB drill book is now structurally complete. BAB-only meta-claim about authoring economy. **Plans 17 + 18 + 19 + 20 confirmation:** all four Game Play plans follow the predicted pattern — Plan 17 has three structurally novel drills plus one augmentation; Plan 18 has two structurally novel drills plus four repeats; Plan 19 has one structurally novel drill plus five repeats; Plan 20 has one structurally novel drill plus five repeats. The novelty-per-plan rate is decreasing across consecutive Game Play captures (4 → 2 → 1 → 1) — strongly consistent with T13's "small unique inventory + many plans → forced reuse" reading. **Repetition-rank leadership (post-Plan-20):** Triangle Setting (4p hit-fed) and 14-15 Games to 21 are tied at **eight plan references each**; Comp Transition HL/CS Live at **six plan references** (most-aliased single drill source-text); Cross Court Pepper at **five plan references**; `3 Before 5` family at **five plan references** across three clusters with three distinct scoring-overlay variants; Around the World (Serve) at **four plan references**; Best Warm Up Ever at 18 plan references (cluster-universal opener). Per T13's repetition-rank-as-catalog-priority signal, these are the **top six source-priority candidates** — the highest-priority Tier 3+ catalog-add candidates once `D101` 3+ player support unlocks. **Competing reading:** the high cross-cluster reuse rate suggests BAB's *unique* drill inventory is much smaller than the 20-plan count implies — confirmed across the complete captured set. T13 names this directly; the open question of whether the small-inventory pattern is BAB-specific (which would limit T13's generalizability) or general to coaching books remains open pending other coaching-book captures (FIVB modified games chapter as a possible second source).

Across the captured set (14 of 20 plans), the BAB authoring economy is heavily reuse-based. Roughly **30 distinct source-form drills** account for the ~120 drill slots across plans, meaning the average source form appears 4 times. The reuse pattern is not random:

- **High-repetition drills are the strongest source-priority candidates for catalog adds.** `Triangle Setting (4-player hit-fed)` appears in five plans (10, 11, 14 — and structurally extended in defense plans). `14-15 Games to 21` appears in five plans. `Cross Court Pepper` appears in four plans (10, 12, 13, 14). `Mini Games to 7` appears in five plans across the captured set. These are not novel patterns; they are well-rehearsed templates BAB falls back on. Volleycraft should treat repetition rank as one input to authoring priority — if the source authors return to a drill across multiple plans, the source-priority signal is strong.
- **Once-only / novel drills are the strongest source-architecture candidates for new schema axes.** `Threat or No Threat` (Plan 16) is the only blocker-as-reader drill in the captured set, but it forces a new `cueSource = team-context` axis on the read-drill schema. `Beat the Blocker` (Plan 11) is the only reactive-blocker drill, but it forces a new `blockerBehavior = reactive` axis. `Pull Digs to Set` (Plan 14) is the only pull-block-and-transition-set drill, but it forces a new `blockerRole = pulled-blocker-becomes-setter` chain. The novel drills are where the schema needs to grow.

The two signals are **complementary, not competitive**: high-repetition drills argue for *catalog-add priority* against the authoring-budget cap; once-only drills argue for *schema-extension priority* against the data-model budget. Future authoring should treat them separately — schema growth driven by once-only patterns, drill-record growth driven by repetition rank — so a single novel drill doesn't force ten near-duplicate authoring decisions on a base drill the schema isn't ready for.

Volleycraft implication: when reading the captured BAB set for catalog work, sort by both axes:

- **By repetition rank (descending):** identifies the source-priority candidates that the data model already supports and that should be authored first.
- **By novel-axis count (ascending):** identifies the source-architecture candidates that need schema work *before* authoring — premature authoring of these drills locks in a partial data model.

The most economical authoring path is: ship high-repetition drills first against the existing schema; collect novel drills as schema-pressure evidence and resolve schema decisions before authoring them; only then author novel drills against the resolved schema. The opposite path (author each novel drill as an ad-hoc one-off) tends to produce parallel half-implementations that are expensive to consolidate later.

## Patterns That May Be Coaching Template, Not BAB-Specific

Three of the patterns the synthesis credits to BAB are likely **standard coaching pedagogy** that any decent volleyball source would reproduce. Surfacing these explicitly so the synthesis doesn't claim more than the captured set earns:

- **The six-slot plan grammar** (warm-up → primer → controlled feed → live transfer → pressure / game wrapper) closely mirrors the **FIVB chapter ordering** (Warm-Up → Serving → Passing → Setting → Attacking → Blocking → Defense → Modified Games) and the structure suggested in `docs/research/fivb-coaches-manual-crosscheck.md` (Bill Neville's Coaches Guide essay; Carl McGown's whole-practice essay). BAB *exhibits* the grammar; it does not originate it. Future plan-builder work can credit the grammar to coaching pedagogy more broadly rather than to BAB.
- **The controlled-feed → live-point → rule-overlay sequence** (named in T9 and recurring across attack and defense clusters) is structurally identical to **FIVB's Modified Games chapter** (Chapter 8, 15 drills) — take a normal point, overlay a rule constraint. BAB instantiates this pattern without cross-citing FIVB. Future work that uses this pattern should cite the broader coaching framing rather than treating it as a BAB-specific finding.
- **The universal warm-up opener** (`Best Warm Up Ever` across all 14 captured plans) may be **one author's habitual session opener** rather than evidence that warm-up content is structurally central. The repetition is the author's authorial preference; it does not by itself justify Volleycraft prescribing one universal opener.

These are not arguments against the patterns being useful. They are arguments against **attribution inflation** — Volleycraft should not credit BAB for patterns that are standard coaching pedagogy or FIVB framing.

## Theses Retired or Narrowed

This section is a structural slot for **falsification**: when a subsequent BAB capture or cross-source check disconfirms or narrows an existing thesis, the change should be recorded here rather than silently absorbed into the thesis text.

### 2026-05-04 — T9 sharpened a fourth time from "eight rule kinds" to "nine rule kinds plus asymmetric scoring axis" (Plan 20 trigger)

**Prior claim (post-Plan-19):** T9 had been sharpened to capture eight composable rule kinds in BAB's scoring grammar (rule-restriction, rule-augmentation, tiebreaker, side-switch trigger, outcome-elevation gate, conditional-extension-if-time-allows, conjunctive/wash with cancellation, scoring-zone gate).

**What changed:** Plan 20 Drill 5 (`16-18 Run with It`) introduces:

1. **Ninth rule kind: reset-on-miss / consecutive-streak-required scoring.** Team A starts at 16, must reach 21 by scoring **consecutively**; missing a point resets the score to 16. Distinct from existing `successMetric.type: streak` (which counts consecutive successes without a numeric base/target structure) and from the eight earlier-captured rule kinds.
2. **Asymmetric scoring as a tenth structural axis.** Different teams have different scoring rules in the same drill — Team A subject to reset-on-miss; Team B subject to accumulating-normal scoring. **First BAB source for per-team-rule mechanism** — distinct from any earlier captured rule kind because earlier rules applied symmetrically to both teams.

**Narrowing:** T9 now spans **nine composable rule kinds** plus an **asymmetric scoring axis** (a new structural mechanism rather than another rule kind):

1. Rule-restriction (Plan 8)
2. Rule-augmentation (Plans 11/15)
3. Tiebreaker (Plan 16)
4. Side-switch trigger (Plans 9/17)
5. Outcome-elevation gate (Plan 17)
6. Conditional-extension-if-time-allows (Plan 17)
7. Conjunctive/wash with cancellation (Plan 18)
8. Scoring-zone gate (Plan 19)
9. **Reset-on-miss / consecutive-streak-required (Plan 20)** — new

Plus **asymmetric scoring axis (Plan 20)** — per-team-rule mechanism: `scoringRules: { teamA: ..., teamB: ... }` rather than a single drill-level rule.

**Lesson for future captures:** T9 was sharpened **four consecutive times in four consecutive Game Play plan captures** (Plans 17, 18, 19, 20 — once per plan). The rate has been consistent across the entire Game Play cluster. The captured BAB drill book is now complete; further T9 sharpening from BAB sources would require new BAB content (e.g., a 2025 edition or beach-volleyball-specific lesson content not in the 2024 drill book). The synthesis should treat the nine-kind-plus-asymmetric framing as **the captured BAB scoring grammar**, with the open question of whether broader coaching literature (FIVB Modified Games, VDM, etc.) contains additional rule kinds.

### 2026-05-04 — T10 (read drills) narrowed from universal pattern to Defense/Attack-only (Plan 20 trigger; cluster-complete confirmation)

**Prior claim (post-Plan-19):** T10's three-axis read-drill schema (`readerRole` × `deceiverRole` × `cueSource`) was confirmed across 4 BAB drills (Plans 9, 11, 14, 16) all from Defense and Attacking clusters. Plans 17, 18, and 19 contained zero read drills, but the synthesis kept T10 framed as a "drill subkind" that might be a universal pattern.

**What changed:** Plan 20 also contains zero read drills. **All four Game Play plans (17, 18, 19, 20) lack read drills entirely** — cluster-complete confirmation that read drills are a Defense / Attack pattern, not a universal pattern across all clusters.

**Narrowing:** T10's claim is now **narrowed** from "Read/Look-And-React Drills Are A Distinct Drill Subkind (universal pattern)" to **"Read/Look-And-React Drills Are A Distinct Drill Subkind (Defense/Attack pattern, absent from Game Play)."** Future Volleycraft session-builder logic for Game Play archetypes should not assume read drills are part of the Game Play cluster grammar; read drills are domain-specific to Defense and Attacking emphasis.

**Schema implications:** the four-cell read-drill taxonomy (defender-deception, blocker-deception, attacker-deception, blocker-as-reader-with-team-context-cue) appears to be **complete for the captured BAB set**. No Game Play plans contributed new cells. The three-axis schema remains a **working hypothesis** but is now domain-confined to Defense and Attacking content.

**Adversarial-review prediction outcome:** the 2026-05-04 adversarial review predicted Game Play capture might falsify or narrow T10. **Plan 20 confirmed the narrowing** — T10 is not falsified (the four-cell taxonomy holds within Defense/Attack), but the universal-pattern claim is **narrowed to a domain-specific pattern**.

### 2026-05-04 — Game Play spine generalization cluster-complete (Plan 20 trigger)

**Prior claim (post-Plan-19):** Plans 17, 18, and 19 all fit the spine with slot 4 (movement) skipped. The slot-4-skip pattern was confirmed across three consecutive Game Play plans but Plan 20 remained the final cluster-completion test.

**What changed:** Plan 20 also fits five of six slots and also skips slot 4 (movement). **All four Game Play plans (17, 18, 19, 20) follow the slot-4-skip pattern — cluster-complete confirmation.**

**Narrowing-as-strengthening:** the synthesis can now make the **strongest possible claim within the captured BAB set**: the slot-4-skip is a Game Play structural feature confirmed across the **entire cluster** (4-of-4 plans). Game Play archetypes should default to slot-4-skipped in future Volleycraft session-builder logic, with confidence backed by cluster-complete evidence.

**Captured Game Play cluster grammar template (cluster-complete):**

- **Slots 1, 2, 4, 7 are structurally consistent across the cluster:** opener (Best Warm Up Ever), 4-player chain primer (Triangle Setting in 3-of-4 plans, Cross Court Pepper in 1), slot 4 skipped, Game-to-21-family wrapper.
- **Slot 3 (per-skill technique under pressure) varies across all four sub-skills:** attacking accuracy (Plan 17 Race to 5; Plan 19 +3/-3 Highlines), setting under serve (Plan 18 Triangle Setting Serve), serving accuracy (Plan 20 Around the World Serve).
- **Slots 5 and 6 are the "innovation slots":** all four plans introduce a novel scoring overlay at slot 6 (BIG point in Plan 17, wash in Plan 18, scoring-zone gate in Plan 19, reset-on-miss + asymmetric in Plan 20). Slot 5 carries diverse drill subkinds (measurement format, whole-chain technique, competitive transition, sideout pressure base).

**Future Volleycraft Game Play archetypes can encode the slot structure once and let drill selection vary per session.** The grammar is structurally consistent at the slot level (same six slots, slot 4 skipped) but drill-content-variable at slots 3, 5, 6 — exactly what a generalizable plan grammar should look like.

### 2026-05-04 — T9 sharpened a third time from "seven rule kinds" to "eight rule kinds" (Plan 19 trigger)

**Prior claim (post-Plan-18):** T9 had been sharpened to capture seven composable rule kinds in BAB's scoring grammar (rule-restriction, rule-augmentation, tiebreaker, side-switch trigger, outcome-elevation gate, conditional-extension-if-time-allows, conjunctive/wash with cancellation).

**What changed:** Plan 19 Drill 5 (`Small Court: Mini Games to 7`) introduces an **eighth rule kind**: scoring-zone gate. Points only score when the rally terminates with a specific spatial outcome — the ball must land on the designated half of the court for the rally outcome to count. Distinct from rule-restriction (which constrains *behavior* — players can still hit anywhere; only the outcome zone matters), outcome-elevation (no sub-game), and conjunctive/wash (no multi-event conjunction).

**Narrowing:** T9 now spans eight composable rule kinds:

1. Rule-restriction (Plan 8 `SHOTS ONLY`, `Round N ONLY`, `(only shots)`)
2. Rule-augmentation (Plan 11 with-blocker -1, Plan 15 `win by 2`)
3. Tiebreaker (Plan 16 `third-to-15`)
4. Side-switch trigger (Plan 9 `at 7s`, Plan 17 `at 2 BIG points`)
5. Outcome-elevation gate (Plan 17 `BIG point` sub-game)
6. Conditional-extension-if-time-allows (Plan 17 `final set to 15 regardless`)
7. Conjunctive / wash scoring with cancellation (Plan 18 `Add In/Add Out`)
8. **Scoring-zone gate (Plan 19 `Small Court Mini Games`)** — new

The scoring-zone gate is structurally different from rule-restriction in a load-bearing way: rule-restriction narrows what players can *do* (e.g., SHOTS ONLY disallows hard hits); scoring-zone gate leaves player behavior unchanged but narrows where the rally outcome must land for a point to score. Both are constraint overlays, but they constrain different things (behavior vs spatial outcome).

**Lesson for future captures:** T9 has now been sharpened **three consecutive times in three consecutive plan captures** (Plan 17 from two to six; Plan 18 from six to seven; Plan 19 from seven to eight). The rate is itself a strong signal that the captured BAB scoring grammar has multiple independent composable axes that didn't surface until enough source cases accumulated. Plan 20 (uncaptured) is the final cluster test for whether further T9 sharpening occurs — if Plan 20 introduces a ninth rule kind, the synthesis should expect even more composable axes to remain unsurfaced in the broader BAB source. If Plan 20 instead reuses already-captured rule kinds, the captured eight-kind grammar may be approaching saturation for the BAB cluster.

### 2026-05-04 — T9 sharpened a second time from "six rule kinds" to "seven rule kinds" (Plan 18 trigger)

**Prior claim (post-Plan-17):** T9 had been sharpened to capture six composable rule kinds in BAB's scoring grammar (rule-restriction, rule-augmentation, tiebreaker, side-switch trigger, outcome-elevation gate, conditional-extension-if-time-allows).

**What changed:** Plan 18 Drill 5 (`Add In/Add Out`) introduces a **seventh rule kind**: conjunctive/wash scoring with cancellation. Points only score when both halves of a serve-then-receive cycle are won by the same team; if conditions split, the result "washes" and no points are scored.

**Narrowing:** T9 now spans seven composable rule kinds:

1. Rule-restriction (Plan 8 `SHOTS ONLY`, `Round N ONLY`, `(only shots)`)
2. Rule-augmentation (Plan 11 with-blocker -1, Plan 15 `win by 2`)
3. Tiebreaker (Plan 16 `third-to-15`)
4. Side-switch trigger (Plan 9 `at 7s`, Plan 17 `at 2 BIG points`)
5. Outcome-elevation gate (Plan 17 `BIG point` sub-game)
6. Conditional-extension-if-time-allows (Plan 17 `final set to 15 regardless`)
7. **Conjunctive / wash scoring with cancellation (Plan 18 `Add In/Add Out`)** — new

The conjunctive rule kind is structurally distinct from outcome-elevation (Plan 17's `BIG point`) because the dependency is **concurrent and independent** (both halves must be won; failure of either halves the result) rather than **sequential** (the win condition triggers a sub-game whose outcome scores). The wash result on a split is the structurally novel piece — it cancels rather than narrowing or extending or gating.

T9's modeling implications scale up correspondingly: future Volleycraft scoring metadata should support all seven rule kinds as composable parameters. The wash kind also surfaces a **new metric-shape requirement** for the future Volleycraft `successMetric` taxonomy: conjunctive/multi-event success (distinct from `streak` for consecutive single events and `reps-successful` for cumulative single events). Existing metric types score single events; wash drills require checking conjunctions of independent events.

**Lesson for future captures:** T9 has been sharpened twice in two consecutive plan captures (Plan 17 from two to six, Plan 18 from six to seven). This rate of sharpening is a strong signal that the captured BAB scoring grammar has **multiple independent composable axes** that didn't surface until enough source cases accumulated. Plans 19-20 may surface additional rule kinds — synthesis should expect further T9 sharpening if the pattern continues.

### 2026-05-04 — T9 sharpened from "two-pattern" to "at-least-six-rule-kinds" (Plan 17 trigger)

**Original claim:** T9 framed BAB scoring overlays as **two patterns** with sign-flip symmetry — rule-restriction (Plan 8 `SHOTS ONLY`, `Round N ONLY`) and rule-augmentation (Plan 11 with-blocker -1 penalty, Plan 15 `win by 2`).

**What changed:** Plan 17's BIG point mechanic, side-switch trigger, and conditional-extension rule, combined with Plan 16's tiebreaker rule and Plan 9's existing side-switch-at-7s, surfaced **at least six independent composable rule kinds** in BAB's captured scoring grammar — not two.

**Narrowing:** T9's "rule-restriction ↔ rule-augmentation" symmetry framing is **incomplete**. The captured BAB scoring grammar has at least six composable rule kinds (later sharpened to seven by Plan 18 — see entry above):

1. Rule-restriction (Plan 8 `SHOTS ONLY`, `Round N ONLY`, `(only shots)`)
2. Rule-augmentation (Plan 11 with-blocker -1, Plan 15 `win by 2`)
3. Tiebreaker (Plan 16 `third-to-15`)
4. Side-switch trigger (Plan 9 `at 7s`, Plan 17 `at 2 BIG points`)
5. Outcome-elevation gate (Plan 17 `BIG point` sub-game)
6. Conditional-extension-if-time-allows (Plan 17 `final set to 15 regardless`)

T9's modeling implications **scale up correspondingly**: the choice between "separate records / sibling variants / runtime constraint toggles" should be made for **all six rule kinds** symmetrically, not just the two captured at the time of the original T9. The Mini Games to 7 family remains the strongest source case for the single-base-drill-with-parameter-overlays approach, but the parameter set is larger than the original T9 framing implied.

### 2026-05-04 — Game Play spine generalization confirmed across three consecutive plans + slot 2 narrowed (Plan 19 trigger)

**Prior claim (post-Plan-18):** Plans 17 and 18 both fit the spine with slot 4 (movement) skipped. The slot-4-skip pattern was confirmed across two data points but Plan 20 remained the final test. The within-Game-Play primer (slot 2) appeared to be Triangle Setting (Plans 17 and 18 both used it), suggesting the primer might be Triangle-Setting-specific in Game Play.

**What changed:** Plan 19 also fits five of six slots and also skips slot 4 (movement), making **three consecutive Game Play plans** with the slot-4-skip pattern. Plan 19 also uses **Cross Court Pepper as the slot 2 primer** (not Triangle Setting), narrowing the within-Game-Play slot 2 hypothesis.

**Narrowing-as-strengthening (slot 4):** the synthesis can now make the **strong claim** that the slot-4-skip is a Game Play structural feature, not a Plan 17 anomaly or a Plans-17-and-18 coincidence. Three consecutive confirmations across three plans is sufficient evidence to treat the slot-4-skip as the cluster-default. Game Play archetypes should default to slot-4-skipped in future Volleycraft session-builder logic. Plan 20 remains the cluster-completion test, but the pattern is now strongly supported.

**Narrowing (slot 2 primer):** Plans 17 and 18 used Triangle Setting at slot 2; Plan 19 used Cross Court Pepper. The within-Game-Play slot 2 hypothesis narrows from **"Triangle Setting only" to "any 4-player chain primer"** — both Triangle Setting (4p hit-fed) and Cross Court Pepper are 4-player drills that warm up the integrated chain. Future Game Play archetypes should support multiple primer choices at slot 2.

**Plan 19 also confirms the within-Game-Play grammar's diversity at slots 5 and 6:** the three captured Game Play plans use structurally different slot 5/6 content:

- **Plan 17 slot 5:** `10 Sideouts` (per-player sideout-rate measurement format).
- **Plan 17 slot 6:** `3 Before 5` with `BIG point` overlay (outcome-elevation).
- **Plan 18 slot 5:** `Triangle Setting with Attack (Serve)` (whole-chain technique completion).
- **Plan 18 slot 6:** `Add In/Add Out` (conjunctive/wash with cancellation).
- **Plan 19 slot 5:** `Comp Transition HL/CS Live` (modified-game with rule delta).
- **Plan 19 slot 6:** `Small Court: Mini Games to 7` (scoring-zone gate).

The Game Play cluster grammar is **structurally consistent at the slot level** (same six slots, slot 4 skipped) but **drill-content-variable** at slots 3-7 — exactly what a generalizable plan grammar should look like. Future Volleycraft Game Play archetypes can encode the slot structure once and let drill selection vary per session.

### 2026-05-04 — T12 graduates from single-source observation to two-source pattern (Plan 19 trigger)

**Prior claim (post-Plan-10):** T12 (Some Drill Rules Scale By Level, Not By Parameter) was based on a single drill, a single sentence in Plan 10 Drill 2 ("Beginners should catch after the set. Intermediate/Advanced should try to make this continuous"). The synthesis flagged this as sample-of-one and treated T12 as an **observation**, not a pattern.

**What changed:** Plan 19 Drill 5 has a second source case — the level-scaled serve rule ("For beginners/intermediate, the serve can go to either player. For advanced players the serve should be served to the same players for the entire game"). T12 graduates from sample-of-one to **two-source pattern** across two plans (10, 19).

**Narrowing-as-strengthening:** T12 can now be cited as a confirmed pattern, not a single observation. The "three modeling options" recommendation (sibling variants / runtime difficulty toggles / authored progression-regression links) is now warranted with two source cases backing it. The two cases are structurally similar (per-level rule changes within a single drill description) but use different mechanisms:

- **Plan 10 case:** level-scale changes the chain-completion rule (catch vs continuous).
- **Plan 19 case:** level-scale changes the serve-target rule (any player vs same player).

Both fit T12's framing of "drill rules scale by level, not by parameter." The variation across the two cases suggests level-scaled rules can attach to different parts of a drill (chain completion / target / behavior), which strengthens T12 as a general pattern rather than a Triangle-Setting-specific quirk.

**Caveat:** two cases is still a small evidence base. T12 should be cited as a pattern but not as a frequent occurrence — only ~12% of captured drills (2 of ~17 source-detail-captured Plan 1-19 drills with explicit per-level rules) exhibit this pattern. Future Volleycraft drill metadata should support level-scaled rules but should not assume they're the default.

### 2026-05-04 — Game Play spine generalization confirmed across two consecutive plans (Plan 18 trigger)

**Prior claim (post-Plan-17):** Plan 17 partially confirmed the focus-agnostic-spine claim by fitting five of six slots and skipping slot 4 (movement). The strongest claim Plan 17 alone supported was "the spine fits **one** Game Play plan with movement skipped"; the slot-4-skip might have been a Plan 17 anomaly rather than a structural feature.

**What changed:** Plan 18 also fits five of six slots and also skips slot 4 (movement). **Two consecutive Game Play plans both follow the slot-4-skip pattern** — strengthening the spine-generalization claim from "one data point" to "consistent across the two captured Game Play plans."

**Narrowing-as-strengthening:** the synthesis can now make the stronger claim that **the slot-4-skip is a Game Play structural feature**, not a Plan 17 anomaly. Game Play archetypes should default to slot-4-skipped in future Volleycraft session-builder logic. The original "spine generalizes across all focus areas" claim is now confirmed across all five captured clusters with a structurally honest within-cluster variation: Game Play uses 6 slots minus slot-4. Plans 19-20 remain the final test for whether this pattern holds across all four Game Play plans.

**Plan 18 also confirms the within-Game-Play grammar pattern:** Both captured Game Play plans follow the same shape — opener → Triangle Setting primer → setting variant under pressure (per-shot accuracy in Plan 17 / serve-fed Triangle Setting in Plan 18) → competitive sideout drill with novel scoring rule (3 Before 5 with BIG points in Plan 17 / Add In/Add Out wash in Plan 18) → competitive wrapper (Games to 21 in Plan 17 / 14-15 Games to 21 in Plan 18). This **within-Game-Play grammar template** is now captured as a working hypothesis pending Plans 19-20.

### 2026-05-04 — Game Play spine generalization partially confirmed (Plan 17 trigger)

**Adversarial-review prediction (P5 / M-spine-claim):** Plans 17-20 (Game Play) are the cluster "best positioned to falsify the focus-agnostic-spine claim" because the explicit focus *is* the game. The synthesis's claim that the BAB plan grammar is focus-agnostic was therefore provisional pending Game Play capture.

**What Plan 17 shows:** Plan 17 **fits five of the six spine slots** (opener / primer / per-shot technique / decision-or-pressure overlay / live-feed transfer / competitive wrapper) and **intentionally skips slot 4 (movement)**. The strongest claim Plan 17 supports against the adversarial prediction is "the spine fits a Game Play plan with one slot (movement) intentionally skipped" — which is a partial confirmation, not a full validation. *(Plan 18 has since extended this to two consecutive confirmations — see entry above.)*

**Narrowing:** the spine claim is sharpened in two ways:

- **Slot 4 (movement) is conditionally skipped, not always present.** Defense uses it heavily; Attack often skips it; Game Play (Plan 17) explicitly skips it. Slot 4 should be modeled as **optional** in future Volleycraft session-builder logic.
- **Slot 5 is a generic "decision-or-pressure overlay" slot, not a read-only slot.** Plan 17's `10 Sideouts` is a sideout-rate measurement format, not a read drill. T10 (read drills) is one population of slot-5 drills; measurement-format drills are another. Future plan-builder selection logic should not assume slot 5 always carries a read drill.

**Not retired:** the spine generalization claim itself is **not** falsified by Plan 17. Plans 18-20 remain uncaptured and could still falsify the claim (e.g., if any of those plans use a structurally different ordering or skip multiple slots). Treat the spine claim as **partially validated** pending Plans 18-20 capture.

### Adversarial-review-predicted falsifications that did NOT materialize across Plans 17-20 (Game Play cluster complete)

The 2026-05-04 adversarial review predicted Plan 17-20 capture would falsify or narrow T1, T9, and T10. **Game Play cluster now complete (4-of-4 plans captured);** actual effects:

- **T1 (drill-repurposing across focus):** **Repeatedly confirmed across all four Game Play plans**, not falsified. Plan 17 reuses `3 Before 5` (passing-focus origin); Plan 18 reuses `Triangle Setting (Serve)` (setting-focus origin); Plan 19 reuses `+3/-3 Highlines` (attacking-focus origin); **Plan 20 reuses `Around the World (Serve)` (passing/attacking origin), `3 Before 5` (passing origin), and `Triangle Setting` (setting origin)** — three reuses in one plan. Four-plan confirmation of T1 within the Game Play cluster, with reuses spanning all four other captured clusters. **T1 is now strongly confirmed across all five captured cluster framings.**
- **T9 (rule-restriction/augmentation):** **Sharpened four consecutive times in four consecutive plan captures — once per plan.** Plan 17 broadened T9 from two patterns to six rule kinds; Plan 18 broadened from six to seven (conjunctive/wash); Plan 19 broadened from seven to eight (scoring-zone gate); **Plan 20 broadened from eight to nine** (reset-on-miss/streak-required) **plus introduced asymmetric scoring as a tenth structural axis**. Not falsified; broadened four times. The captured BAB drill book is now complete; further T9 sharpening from BAB sources would require new BAB content. The current nine-rule-kinds-plus-asymmetric framing is **the captured BAB scoring grammar**.
- **T10 (read drills):** **Narrowed (not falsified) — read drills confirmed absent from the entire Game Play cluster.** All four Game Play plans contain zero read drills; the four-cell read-drill taxonomy (Plans 9, 11, 14, 16) spans only Defense and Attack clusters. T10's "drill subkind" claim is **narrowed from a universal pattern to a Defense/Attack-only pattern**. Future Volleycraft session-builder logic for Game Play archetypes should not assume read drills are part of the Game Play cluster grammar.
- **T13 (repetition vs novelty):** **Confirmed across all four Game Play plans, with decreasing novelty-per-plan rate.** Plan 17: 4 novel items; Plan 18: 2 novel items; Plan 19: 1 novel item; Plan 20: 1 novel item. Strongly consistent with T13's "small unique inventory + many plans → forced reuse" reading. Post-Plan-20 source-priority leaders: Triangle Setting (4p hit-fed) at 8 plans, 14-15 Games to 21 at 8 plans, Comp Transition HL/CS Live at 6 plans, Cross Court Pepper at 5 plans, `3 Before 5` family at 5 plans across three clusters, Around the World (Serve) at 4 plans, Best Warm Up Ever at 18 plans (cluster-universal opener). **The captured BAB drill economy is now fully mapped: ~30 distinct source forms accounting for ~140 captured drill slots across 20 plans.**

### Empty falsification slots remaining (post-Plan-17)

The slot is no longer empty, but the synthesis still has not narrowed or retired:

- **T1** — drill-repurposing across focus: still open to falsification by a Game Play plan that authors brand-new drills not seen in earlier clusters. If Plans 18-20 introduce drills that have no earlier-cluster equivalent, T1's "BAB reuses drills across focus framings" framing would need narrowing.
- **T2-T7** — these are multi-source corroborated theses that would require cross-source disconfirmation, not just BAB-internal contradiction. Less likely to be falsified by remaining BAB captures.
- **T10** — read drills: as noted above, untested by Plan 17. A Plan 18-20 read drill that doesn't fit the three-axis schema would narrow T10. A Plan 18-20 *absence* of read drills would *broaden* T10 to "read drills are a Defense / Attack pattern."
- **T11, T12** — provisional theses with sample-of-one or sample-of-few evidence. Most likely to be falsified or narrowed if a future BAB capture provides counter-evidence on blocker/defender coupling or level-scaled rules.

When Plans 18-20 are captured, the resulting synthesis pass should explicitly look for falsification candidates and record narrowed/retired theses here — even if none materialize.

## Adopt, Adapt, Reject

### Adopt

- **Practice families over single records.** `Server vs Passer`, `Triangle Setting`, `Around the World`, and `3 Before 5` should be treated as families with feed/target/scoring variants.
- **Controlled -> live sibling structure.** Plan 3's toss-to-serve triangle is the clearest source pattern for this.
- **Named pressure wrappers.** BAB's scoring formats are memorable and courtside-friendly when the tracking burden is low.
- **Compact source vocabulary.** Terms like seam, sideline serve, off pass, correction set, wash drill, and speed ball are useful future metadata/copy anchors.

### Adapt

- **BAB warm-up.** Keep it as source evidence for a pair ball-control opener, but do not replace the shorter VDM/physio-shaped M001 warm-up contract.
- **BAB time blocks.** 15-30 minute blocks are a coaching-practice norm, not always M001-safe. Compress with caps.
- **Competitive fire.** Convert coach-energy advice into structured goals, pressure wrappers, and review prompts. Do not import a hype-coach voice into the calm courtside UI.
- **Goal setting.** BAB's aligned goal idea belongs in M002-style weekly confidence or optional focus refinement, not as a first-run questionnaire.

### Reject For Now

- **Catalog adds solely because BAB repeats a drill.** Repetition raises priority, not authorization.
- **3+ player source forms inside M001 pair/solo mode.** Defer until `D101` support.
- **Attack/game/wash drills before attack taxonomy and game-scoring support.** They are valuable Tier 3+ sources, not current setting or passing fundamentals.
- **Raw BAB repeat-until-hit dosing.** It needs attempt caps and fatigue caps before product use.

## Plan-Builder Theses For Volleycraft

These are **product-shape preferences** for future plan-builder work, not source findings. Most are restatements of existing repo canon (D101, D77, D130, D76, the source-backed activation pattern) framed in plan-builder language. Theses 9 and 10 are the only ones derived from this synthesis pass directly. Surfacing the distinction so future agents don't read these as evidence-backed claims they aren't.

**Existing repo canon restated for plan-builder context:**

1. **The plan builder should pick a training problem first.** Examples: "serve-receive sideout," "setting from pass location," "serve tactical zones." Skill tags are filters and constraints, not the user-facing reason the plan exists.
2. **Each session should have a spine.** Warm-up / condition read → primer → controlled representative work → transfer or pressure → downshift/review. The captured BAB six-slot spine (opener / primer / per-shot technique / movement / read-or-pressure overlay / live-feed transfer / competitive wrapper) generalizes across passing, setting, attacking, and defense — making the spine a focus-agnostic session archetype with focus-specific content per slot. **Caveat:** the Game Play cluster (Plans 17-20) is uncaptured and is the cluster best positioned to test whether the spine is genuinely focus-agnostic.
3. **Every drill slot should declare its claim.** Is this control, transfer, pressure, or game-like? This prevents solo drills from masquerading as live serve-receive.
4. **Variants should be generated from a family model.** Feed type, participant count, environment, target grid, scoring wrapper, and dose should vary explicitly.
5. **The user's stage should change the kind of variation, not only the dose.** Beginner plans simplify targets and cues; advanced plans introduce reads, correction, pressure, and tactical zones.
6. **Pressure comes after enough setup to understand what is being pressured.** BAB often teaches the target or movement first, then scores it.
7. **Source-backed expansion should stay diagnostics-aware.** When a generated-plan pressure group needs content depth, use the existing source-backed activation pattern: candidate source → source-evidence payload → implementation plan → diagnostic movement check → rollback if no movement.
8. **Pair-native remains the strategic north star.** Solo fallbacks are useful, but the plan should still explain how the work maps back to pair performance.

**Synthesis-derived (T13):**

1. **Repetition rank and novel-axis count are separate prioritization signals (T13).** When choosing what to author next from the captured set, sort by repetition rank for catalog-add priority and by novel-axis count for schema-extension priority. Premature authoring of novel drills against an unready schema produces parallel half-implementations.
2. **Composable scoring rules over enumerated formats.** Plan 15's `win by 2` and Plan 16's `Best of 3 Match to 21` with `third-to-15` tiebreaker confirm BAB scoring is composed from independent rule fragments (base game-to-N + tiebreaker-to-M + win-by-margin extension + best-of-N envelope). Future Volleycraft scoring should be a composable rule grammar, not an enumerated `scoreFormat` enum. **Caveat:** this is also FIVB modified-games chapter framing; the composability finding is not BAB-specific.

## Candidate Routing

Near-term content-polish candidates that look most compatible with current constraints:

- `Basic S/R Footwork` as a BAB-named movement/passing primer, already partially covered by `d09`-`d14`.
- `7 Drills 4 Quadrants` / `4 Quadrant Ball Control` as solo/pair ball-control and movement control.
- `6 Guns` as a pair pepper / emergency-contact family, if high-tempo workload is capped.
- Level-scaled `d33` polish for 4-zone beginner / 8-zone advanced serving if serving-zone UX needs more depth.

Future D101 candidates:

- `Passing Triangle from Toss` and `Passing Triangle from Serve`.
- `Triangle Setting`, `Triangle Setting (Serve/Toss)`, off-pass correction setting, and run-through/back-set variants.
- `6 Legged Monster Passing`, `6 Serve Speed Ball`, `Defensive Retreatment`, and `Cross Court Pepper`.

Tier 3+ / game-layer candidates:

- `Around the World` attack variants, after resolving BAB 7-zone vs FIVB 5-zone vs Plan 7 attack-accuracy-box convention.
- `Pass Set Spike to Perimeter`, `Serve Spot, Dig Set Hit`, mini games, and wash drills.
- BAB Plan 7 attack-accuracy drills: `+3/-3 Highlines - Cut Shots / HL` (single-box scoring), `Highlines - Cuts - Open Net Swing` (open-net swing under defender pressure), `2 Ball Side Out` (two-shot alternating accuracy), and `Comp Transition HL - CS - Live` (rule-delta sideout with a 15-ft short-attack constraint).
- BAB Plan 8 per-shot technique drills: `Hitting a High Line` and `Hitting a Cut Shot` (≡ Plan 9 `Offensive Accuracy - HL / CS`) as the foundation rungs that should sequence below Plan 7's accuracy work.
- BAB Plan 8 rule-restricted variants: `(only shots)` and `(SHOTS ONLY)` overlays plus `Round 1 and 2 ONLY` round-set restrictions, modeled as constraint flags / sibling variants / runtime toggles per the T9 modeling decision.
- BAB Plan 9 vision/read attack-pepper: `3 Touch Vision Pepper` as the read-and-choose drill subkind; sequence after per-shot technique drills, alongside FIVB 3.15 / 4.9 "Look" cues per Thesis T10.
- BAB Plan 9 / Plan 11 past-blocker attack: `Beat the Blocker Cross/Line` ≡ `Beat the Blocker` (Plan 11 Drill 5 supplies the full source detail that closes the Plan 9 name-only gap) as the **reactive-blocker** complement to Plan 7 Drill 5's open-net swing and Plan 10 Drills 5–6's fixed-blocker variants. Hard-hit attack drill with two big scoring squares on Line and Angle; "okay to get blocked" framing for courtside copy.
- BAB Plan 10 defender-aware attack matrix (Drills 4–7): one drill family with sibling variants spanning attacker shot × blocker position × defender pickup zone, per Thesis T11 fixed-blocker case.
- BAB Plan 10 sideout-to-free-ball transition (`Serve to Free Ball`): pair-vs-pair drill that chains a serve-receive sideout and a free-ball-transition sideout to the other player; argues for separating serve reception from free-ball reception in catalog metadata.
- BAB Plan 10 fourth Triangle Setting source form (4-player hit-fed): a level-scaled-rule drill (T12) distinct from `d43` (3-player) and the Plan 6 4-player serve-fed source form; future authoring requires naming discipline because there are now four distinct Triangle Setting source forms.
- BAB Plan 11 rule-augmented variant (`+3/-3 Highlines (CS / HL with Blocker)`): sibling but inverse to Plan 8's rule-restricted variants — Plan 11 Drill 4 augments Plan 7 Drill 4's `+3/-3 HL/CS` with a blocker-touch -1 penalty. Models as a `blockerPresence: 'passive'` variant of the Plan 7 parent.
- BAB Plan 12 per-shot dig-technique drill (`Partner Toss Dig to Cut Shot` ≡ Plan 13 `Toss to Dig Cut/HL Shot`): first per-shot defensive technique drill captured; dig-side analog of Plan 8's `Hitting a HL / CS`. Author as sibling per-shot variant alongside a future `Partner Toss Dig to High Line` (not yet captured but structurally implied), per Thesis T8.
- BAB Plan 12 defensive movement drill (`4 Steps to Paradise`): foundation rung for a future defense chain; defense-side analog of `Footwork for Setting` (`d40` in M001). Source-detail captured in Plan 12 Drill 3, closing the previously name-only cross-reference entry.
- BAB Plan 13 emergency-extension defensive drill (`Dig from Knees`): isolated low-ball one-handed scoop dig with `sand angel` reach-assessment pre-drill ritual. Sibling to Plan 12 Drill 2 — the pair forms the defensive technique foundation (low-ball-from-low / lateral-from-low).
- BAB Plan 13 multi-touch defensive sequence (`Hand Dig / Platform Dig Set - 2 sets`): hand-dig (overhand at chest/head) + set return + transition release back to defense + second dig. Distinct from isolated dig drills because it trains continuous defensive engagement. New vocabulary: hand dig, platform dig (contrast), release back to defense.
- BAB Plan 14 pull-block-and-transition-set drill (`Pull Digs to Set`): 4-player pull-block-dig with two named scenarios (pull-line, pull-angle) and a transition-setting variant where the blocker becomes the setter on the third contact. First BAB source for pull-block-dig source-detail beyond glossary level.
- BAB Plan 14 attacker-deception read drill (`Shuffle to HL / CS Dig` ≡ Plan 15 Drills 4-5): smack-misdirection sibling per-shot pair. The attacker fakes a hard hit with a smack, then actually tosses a finesse shot; defenders must read late and change direction. Sibling to Plan 9 Drill 3 (defender-deception) and Plan 11 Drill 5 (blocker-deception) per Thesis T10.
- BAB Plan 15 live-point integration drill (`Shuffle to High Line/Cut Shot to Live Play`): live-point extension of the Plan 14 Shuffle drills. 4-player drill where Team A digs CS (Round 1) and HL (Round 2) from Team B's tossed shots, then plays out the point live. First BAB source for the live-point integration of the Shuffle drills. Pair with Plan 14 Drills 4-5 in session-builder logic so controlled-feed and live-play versions sequence together for transfer.
- BAB Plan 15 fourth Mini Games to 7 rule-restriction variant (`Mini Games to 7 (SHOTS ONLY)` with `win by 2`): models the strongest source case yet for the T9 single-base-drill-with-parameter-overlays modeling approach. The `SHOTS ONLY` and `win by 2` rules are composable parameters on the parent Mini Games to 7 drill — supports both restriction (no hard-driven attacks) and scoring extension (win by margin instead of straight to 7).
- BAB Plan 16 blocker-as-reader read drill pair (`Threat or No Threat` toss-fed and serve-fed siblings): first BAB source for read drills where the blocker reads set quality (team-context cue) and decides between blocking and pulling off net to dig. Adds new `readerRole` and `cueSource` axes to the read-drill schema. Toss-fed and serve-fed siblings form a recurring BAB authoring pattern (also seen in Plan 3's `Passing Triangle from Toss/Serve`).
- BAB Plan 16 `Best of 3, Match to 21` competitive wrapper format with `third-to-15` tiebreaker: composable with Plan 15's `win by 2` extension. Together they confirm scoring rules should be modeled as composable parameters (base game-to-N + tiebreaker-to-M + win-by-margin extension as three independent rules).
- FIVB modified games as rule-delta templates for pressure blocks; BAB Plan 7 Drill 7 and Plan 8 Drills 6–8 are the strongest BAB evidence for this template pattern.

Tier 3+ session-shape candidates (not drill records):

- BAB Plan 9 Drills 7 and 8: `14-15 Games to 21` (compressed competitive game) and `Set to 21` (full set with switches at 7s) belong in archetype/session-template territory, not as rows in `app/src/data/drills.ts`. Plan 10 Drill 9 (`14-15 Games to 21, Best of 3`) and Plan 11 Drill 6 (`14-15 Games to 21, Best of 5`) are the same wrapper with different locked best-of parameter values; future authoring should expose best-of as a configurable parameter on a single wrapper, not three separate records.

## Open Questions

These open questions are organized by which thesis surfaces the question. They block decisions, not exploration: the synthesis is intentionally non-prescriptive on how Volleycraft should resolve them, because each touches the data model, authoring economics, or the user-facing UX.

**Schema-level questions (gate authoring of novel drills per T13):**

- **T1 (drill-repurposing across focus areas):** Should Volleycraft drill records expose a `compatibleFocuses` axis listing which `skillFocus` values can select the drill, or should the session-builder select drills by structural properties (target skill, feed type, participant count) and let any drill match any focus that fits? The BAB pattern (one drill cited across plans with different framing) suggests the latter is cleaner; the former is simpler to reason about for session diagnostics. The decision affects swap-pool composition, focus-readiness audits, and whether `skillFocus` is a property of the drill or of the session-builder selection.
- **T6 (zone conventions):** For attack-chain authoring, should Volleycraft choose BAB's 7-zone attack grid, FIVB's 5-zone attack grid, BAB Plan 7's per-shot attack-accuracy boxes, or a product-specific reduced grid? Should the catalog support more than one convention (e.g., per-shot accuracy boxes for early rungs, numbered-zone ladders for advanced rungs), or pick one for the entire chain?
- **T8 (per-shot variants):** Should per-shot drill families land as one drill with a shot-name parameter, sibling variants under one parent, or fully separate records (BAB's pattern)? The decision should align with the T9 / T12 modeling decisions so the same authoring philosophy applies across the catalog.
- **T8 (drill-name aliasing):** Should the cross-reference table evolve from a one-name-per-row format to one that explicitly records aliases, so future BAB captures don't quietly create duplicate-looking rows for what is the same source-form drill?
- **T9 (rule-restricted ↔ rule-augmented variants):** Should Volleycraft model `SHOTS ONLY` / `Round N ONLY` / `with Blocker (-1)` as separate drill records, sibling variants on the parent drill, or runtime constraint toggles? Should the chosen mechanism treat restriction and augmentation as the same mechanism with a sign flip, or as two distinct mechanisms?
- **T10 (read drills):** What should the scored decision metric look like in the Volleycraft `successMetric` taxonomy? Existing metric types (`reps-successful`, `points-to-target`, `streak`) score outcomes; a "correct read" criterion is closer to a binary classification. Should a `feedPattern` axis be added separately from `feedType` (the smack-misdirection case)?
- **T11 (blocker-defender coupling):** Should the Volleycraft drill schema add explicit `blockerPosition`, `blockerBehavior`, and `defenderPickupZone` axes, or model coupling as a higher-level "defensive shape" enum? Should `blockerBehavior` be a separate axis from `blockerPosition`, or should `blockerPosition` accept a `'reactive'` value?
- **T12 (level-scaled rules):** Should level changes be modeled as separate drill records linked by `progression`/`regression`, sibling variants on a parent, or runtime difficulty toggles?
- **T-Plan-Builder-10 (composable scoring):** Should the scoring grammar expose base game-to-N + tiebreaker-to-M + win-by-margin extension + best-of-N envelope as four independent composable rules, or as an enumerated `scoreFormat` enum with the four BAB-captured combinations baked in?

**Product-shape questions (do not require schema changes; gate UX decisions):**

- Should Volleycraft model session focus as an explicit **training-problem axis** distinct from `skillFocus`, so a passing-focus session can honestly include setting/attack support blocks?
- When `D101` unlocks 3+ player support, should the first 3+ plan-builder slice prioritize passing triangles, setting triangles, or pressure games? T13 ranks by repetition: Triangle Setting (4p hit-fed) appears in five plans (10, 11, 14, plus structural references), Cross Court Pepper appears in four (10, 12, 13, 14), and Mini Games to 7 appears in five (5, 8, 12, 15, 18+ TOC).
- Should future drill metadata carry VDM skill stage as a persisted field, or remain an authoring convention until a user-facing surface consumes it?
- Should `+3/-3` be modeled as a generic cross-skill scoring wrapper (BAB uses it for both pass quality in Plan 2 and attack accuracy in Plan 7), or as separate per-skill drills?
- Which pressure wrappers are trackable enough on a sweaty phone: `3 Before 5`, `+3/-3`, first-to-N, wash scoring, or simplified binary sideout counts?

**Cross-source questions (gate which source authority leads):**

- For drill-grammar disagreement between BAB and FIVB (e.g., zone counts in T6), should Volleycraft default to BAB's source-priority weight (most repeated in the captured set) or FIVB's institutional authority? The Cross-Source Convergence Map's source-bias note (BAB / FIVB / VDM each privileged for different domains) is the working answer; a stable decision pass would lock it in.
- For drill-content gaps where only BAB has detail (e.g., T10 read drills), is a single-source authoritative thesis acceptable, or should novel BAB-only patterns be deferred until a second source confirms them? The risk is BAB-bias in the catalog; the cost of waiting is catalog content lag.

## For Agents

- **Authoritative for**: high-level practice-plan authoring synthesis and plan-builder theses from BAB/FIVB/VDM.
- **Edit when**: new BAB practice plans are captured, FIVB/VDM cross-source conclusions change, or a plan-builder decision consumes one of these theses.
- **Belongs elsewhere**: raw source detail (`docs/research/bab-source-material.md`, `docs/research/fivb-source-material.md`), decisions (`docs/decisions.md`), implementation plans (`docs/plans/`), drill records (`app/src/data/drills.ts`), and progression rules (`docs/specs/m001-adaptation-rules.md`).
- **Outranked by**: `docs/vision.md`, `docs/decisions.md`, `docs/prd-foundation.md`, roadmap/milestone/spec docs, and source archives for exact provenance.