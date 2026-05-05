---
id: bab-complete-plan-builder-ideation-2026-05-04
title: "Ideation: BAB-Complete Plan-Builder Direction"
status: active
stage: validation
type: ideation
summary: "Ranked ideation pass at the BAB-drill-book-complete milestone. Generated ~46 candidates across six ce-ideate frames plus architecture (ce-architecture-strategist) and product (ce-product-lens-reviewer) critiques. The load-bearing finding is the product-lens reading: the BAB synthesis is comprehensive research but premature for operationalization at the current milestone (D130 founder-use mode through 2026-07-20; D101 gates most BAB top-tier drills; M001 is solo/pair-first). Survivors split into three buckets: now-shippable (4 ideas — predicate refactor, confirmation receipt, re-activation triggers, O24 resolution gate), pre-D101 schema gates (3 ideas — T9 modeling stance, T6 zone convention, slot-4-optional archetype work), post-D101 / M002 candidates (5 ideas — composable scoring grammar, problem-first plan flow, drill family abstraction, repetition-rank-aware catalog, structural-focus inference). Rejected: importing BAB plan generation into M001; adding BAB-grade complexity to calm courtside UI; authoring 3+ player drills before D101; per-team rules without session-context model."
date: 2026-05-04
topic: bab-complete-plan-builder-direction
focus: how Volleycraft should build practice plans now that the BAB drill book is structurally complete
mode: repo-grounded
related:
  - docs/research/practice-plan-authoring-synthesis.md
  - docs/research/bab-source-material.md
  - docs/decisions.md
  - docs/status/current-state.md
  - docs/solutions/2026-05-04-source-backed-content-depth-activation-pattern.md
---

# Ideation: BAB-Complete Plan-Builder Direction

## Grounding Context

The captured BAB Drill Book is structurally complete (all 20 plans captured at source-detail level on 2026-05-04). The synthesis doc (`docs/research/practice-plan-authoring-synthesis.md`) consolidates BAB+FIVB+VDM/LTD3 into:

- A **6-slot focus-agnostic plan grammar** confirmed across five clusters (passing, setting, attacking, defense, game-play complete). All four Game Play plans skip slot 4 (movement) — cluster-complete confirmation that the spine generalizes with slot 4 as conditionally optional.
- **Nine composable scoring rule kinds** plus **asymmetric scoring as a tenth structural axis** (reset-on-miss / per-team rules from Plan 20).
- A **four-cell read-drill taxonomy** (defender-deception, blocker-deception, attacker-deception, blocker-as-reader) — narrowed to a Defense/Attack-only pattern (read drills absent from the entire Game Play cluster).
- **Top-tier source-priority drill families** at 4-8 plan references each: Triangle Setting (8), 14-15 Games to 21 (8), Comp Transition (6), Cross Court Pepper (5), 3 Before 5 (5), Around the World Serve (4).
- **13 cross-source theses (T1-T13)** with 7 falsification entries in `Theses Retired or Narrowed`.

The captured BAB drill economy has ~30 distinct source forms across ~140 captured drill slots. T13's "small unique inventory + many plans → forced reuse" reading is now strongly supported by the complete captured set.

Current Volleycraft architecture (`app/src/data/archetypes.ts`, `app/src/data/drills.ts`, `app/src/types/drill.ts`, `app/src/domain/sessionBuilder.ts`):

- Compressed 5-slot M001 archetype shape: `warmup → technique / movement_proxy → main_skill → pressure → wrap`
- Single `skillFocus` per drill record (not per session-context per T1)
- No scoring-overlay grammar (scoring is implicit in drill behavior)
- No asymmetric scoring; no read-drill schema; no drill-family abstraction
- `attack` and `defense` are not shipped `SkillFocus` values (D101 gates most BAB top-tier drills as 3-4 player)
- Three near-identical `shouldPrefer*DurationFit` predicates in `sessionBuilder.ts` (D49, D50, D51 source-backed activation pattern)

Active milestone context:

- **M001 Solo Session Loop** with Tier 1a / Tier 1b Layer A shipped
- **D130 founder-use mode** through 2026-07-20 (17 days remaining as of 2026-05-04 to the next condition read-out on 2026-05-21)
- **D91 retention gate** deferred but not dropped
- **Calm courtside UX** posture (`P11` recommend-before-interrogate; shibui interface)
- **Generated-plan diagnostics** as the active focus-readiness quality surface

## Frame Outputs Summary

This ideation pass dispatched 6 `ce-ideate` frames plus 2 critique subagents. Raw counts:

| Source | Output |
|--------|--------|
| Frame 1 — Pain & Friction | 8 candidates (collapsed end-of-session slots; missing training-problem axis; no scoring-overlay primitives; drill records locked to one chain; unconditional movement slot; hand-written substitution predicates; no sibling-family abstraction; no cross-block cohesion in selection) |
| Frame 2 — Inversion / Removal / Automation | 8 candidates (problem-first plan flow; spine compiler; composable scoring grammar; drill family as coordinate space; diagnostics-driven plan synthesis; substitution rules as data; structural-focus inference; repetition-rank-aware catalog) |
| Frame 3 — Assumption-Breaking | 8 candidates (dissolve `skillFocus` into session context; scoring overlays as primitives; archetypes as slot grammar; read drills as separate cluster; participant `min/max/ideal` range; repetition rank as runtime prior; training-claim authoring; sessions as long-running threads) |
| Frame 4 — Leverage & Compounding | 7 candidates (7-slot archetype engine; 9-rule scoring grammar; asymmetric per-team axis; 4-player chain-primer chassis; family-first wrappers; `skillFocus` as session context; 20-BAB-plan regression corpus) |
| Frame 5 — Cross-Domain Analogy | 8 candidates (mise-en-place pre-contract; jazz lead sheet vs through-composed; scoring rules as equippable modifier cards; weekly seeded plans; Hero-WOD named benchmark sessions; RPE-autoregulated next-slot selection; explicit "Game of the Session" one-liner; per-slot substitution tables) |
| Frame 6 — Constraint-Flipping | 8 candidates (solo-only Volleycraft; six-slots-always-no-compression; training-problems replace `skillFocus`; one composable rule kind per drill; faithful random BAB reproduction; 5-min one-drill no-warmup; team-only 8+ player plans; 1000-drill catalog) |
| `ce-architecture-strategist` | Sequencing recommendation (Phase 0 — resolve `O24` and pick T9 modeling stance before any schema work; Phase 1 — generalize predicates into a registry, add `attack`/`defense` only on `D135` evidence; Phase 2 — keep shipping source-backed activations; Phase 3 — post-D101, land composable scoring base→restriction→augmentation; defer asymmetric scoring indefinitely). Five anti-patterns to avoid importing. |
| `ce-product-lens-reviewer` | **Load-bearing finding:** treat the BAB synthesis as archived inventory + cheap structural confirmation of existing canon, **not** as a current-milestone build agenda. Defer operational consequences past the 2026-05-21 D130 read-out. Re-activation triggers: D101 unlocks, M002 design needs plan-grammar input, or a non-D101-gated source-priority drill clears the existing diagnostics activation pattern. |

## The Load-Bearing Finding

The product-lens critique is the synthesis-of-the-synthesis-pass: the BAB drill book is now structurally complete as **research**, but it should not drive plan-builder direction at this **milestone**.

The reasoning is concrete:

- **D101 gates most BAB top-tier drills.** Five of the six top-tier source-priority drill families (Triangle Setting at 8 plans, Comp Transition at 6, Cross Court Pepper at 5, 3 Before 5 at 5, 14-15 Games to 21 at 8) are 3-4 player. Only Around the World (Serve) is solo-compatible. Authoring schema for content the catalog can't ship is premature.
- **D130 founder-use mode has 17 days remaining** to the next condition read-out (2026-05-21). The BAB synthesis investment was substantial; pivoting to BAB-derived schema work risks pulling the next two months toward content that can't ship under D130.
- **M001 is solo/pair-first.** BAB targets coaches with 3-4 athletes. Importing BAB-grade plan-grammar before D101 unlocks risks identity drift toward a coach-mediated experience the calm-courtside / low-typing UX is designed against.
- **Calm-courtside identity.** Adopting the 9-kind composable scoring grammar, asymmetric scoring, or read-drill schema before D101 risks making the courtside UI more complex than it should be. BAB Coaches Guide Essay 3's "competitive fire" hype voice is already on the Reject ledger.
- **Active competing priorities.** D130 condition reads, M001 polish, D91 retention gate work, M002 weekly confidence design, and the diagnostics-driven `d49 / d50 / d51` content engine all compete for attention with BAB schema work.

The synthesis itself is internally honest — its Adopt / Adapt / Reject ledger contains the right deferrals. The risk is upstream of the doc: that having a comprehensive 13-thesis / 9-rule / 4-cell research artifact on the desk implicitly outweighs its explicit deferrals and pulls the next two months toward BAB-grade schema for content that cannot ship.

## Adversarial Filtering — Survivor Buckets

Applying the adversarial filtering rubric: each candidate must (a) survive the architectural-fit check, (b) survive the product-lens check (does this move the founder-use validation goal forward, or away?), and (c) carry warrant beyond "the synthesis suggests it."

Candidates split into three buckets:

### Bucket A — Now-shippable (4 survivors; low-cost, in-canon)

These survive both critiques: each is small, citable, and either receipts canon-validating findings or removes a known repo wart without committing to any post-D101 schema decision.

#### A1. Refactor `shouldPrefer*DurationFit` predicate family into a `SourceBackedReroute[]` registry

**Source frames:** Frame 1 #6 (substitution surface doesn't scale); Frame 2 #6 (substitution rules as data); Frame 4 implicit; architecture-strategist explicit recommendation.

**What:** the three near-identical `shouldPreferAdvancedSettingDurationFit`, `shouldPreferAdvancedPassingDurationFit`, `shouldPreferBeginnerServingDurationFit` predicates plus the inline D01 reroute become entries in a single registry table indexed by `(focus × level × duration × from-drill-id × to-drill-id)`. The pattern has 3 validated applications (D49 setting, D50 advanced passing, D51 beginner serving); a fourth would be the moment the registry pays off.

**Warrant:** `direct:` `app/src/domain/sessionBuilder.ts` lines 30-32 (three drill-ID `Set<string>`s) + lines 142-199 (three near-identical predicates); validated by `docs/solutions/2026-05-04-source-backed-content-depth-activation-pattern.md` listing three applications.

**Why it matters:** every Tier 3+ source-backed depth pass currently drops a fresh predicate. Without a registry, this file becomes a parallel routing table to the catalog itself. Refactor cost is small; payoff compounds across every future source-backed activation.

**Cost / risk:** internal refactor with full test coverage; no schema change; no user-visible behavior change. Architecture-strategist named this as the only purely-internal recommendation that doesn't depend on `O24` or T9.

**Sequencing:** can land before any BAB-derived schema decision. Independent of D101.

#### A2. Receipt the canon-validating BAB confirmations (T1, T2, T5, T7 + spine generalization)

**Source frames:** Frame 4 #1 / #6; product-lens explicit recommendation.

**What:** capture the BAB-confirmed canon findings as a single short note in `docs/decisions.md` (or the synthesis doc's "Confirmation Receipts" section). The findings:

- **T1** (focus is purpose, not a tag) confirms the integrative-focus reading flagged in `O24` — but does not by itself resolve `O24`.
- **T2** (feed-type honesty) confirms `D76`.
- **T5** (count attempts not just successes) confirms `D77` fatigue cap policy.
- **T7** (BAB pair/group native; Volleycraft must stay constraint-aware) confirms `D101` 3+ player participant honesty.
- **Spine generalization** (6-slot focus-agnostic plan grammar) externally validates the existing `warmup → technique / movement_proxy → main_skill → pressure → wrap` archetype shape.

**Warrant:** `direct:` synthesis Cross-Source Theses T1, T2, T5, T7 sections + Captured Plan Grammar Templates (slot mapping table); `direct:` `docs/decisions.md` D76, D77, D101 entries.

**Why it matters:** these are external structural validations of canon already in place. Receipting them stops future agents reading the synthesis cold from re-litigating decisions that already exist; it also provides the citation BAB grounding for any future plan that touches these constraints.

**Cost / risk:** documentation-only; no code or schema change.

**Sequencing:** can land alongside A3 (re-activation triggers) as a single status pass.

#### A3. Add explicit re-activation triggers to the synthesis frontmatter

**Source frames:** product-lens explicit recommendation.

**What:** the synthesis doc's frontmatter / Bottom Line section explicitly names the conditions under which BAB-derived operational work should re-activate:

1. **D101 unlocks 3+ player support** — most BAB top-tier drills become catalog-eligible.
2. **M002 design needs plan-grammar input** — currently M002 is calm carry-forward / weekly receipt, not a plan-grammar surface.
3. **A non-D101-gated source-priority drill clears the existing `d49 / d50 / d51` diagnostics activation pattern** — the only candidate is `Around the World (Serve)` (Plan 1/4/8/20 at four plan references).

**Warrant:** `reasoned:` from product-lens critique + `direct:` `docs/decisions.md` D101, D130 framing.

**Why it matters:** without explicit re-activation triggers, future agents seeing "captured BAB drill book is structurally complete" will plausibly read it as "ready to operationalize." Triggers prevent that drift.

**Cost / risk:** documentation-only; small frontmatter change to the synthesis doc.

**Sequencing:** can land alongside A2.

#### A4. Open a small `O24` decision-pass packet that engages the BAB Plan 1 integrative-focus evidence head-on

**Source frames:** Frame 1 #2; Frame 3 #1; architecture-strategist explicit recommendation; previous reverted `D136` `2026-05-04` revert.

**What:** draft a small `O24`-resolution packet that uses BAB Plan 1's integrative framing (a passing plan that includes setting and attack drills under the passing focus) as primary evidence, weighed against the existing `single-focus-per-session` invariant in `app/src/data/archetypes.ts`. The packet does not pre-decide; it surfaces the evidence at decision-pass quality. This was the explicit failure mode of the reverted `D136` (it cited the wrong evidence).

**Warrant:** `direct:` `docs/decisions.md` `O24` open question; `direct:` synthesis T1 (Plan 12 Drill 4 = Plan 2 Drill 4 reuse; Plan 13 defender-perspective framing of Plans 8/9 per-shot HL/CS); `direct:` BAB Plan 1 source text (in `bab-source-material.md`).

**Why it matters:** architecture-strategist named `O24` as the **single most important sequencing call** — it gates the read-drill schema, `compatibleFocuses`, and the integrative-focus interpretation. Until `O24` resolves, every Bucket B and C schema candidate is premature.

**Cost / risk:** small decision-pass packet (matches the brainstorm shape in `docs/brainstorms/`); does not commit to schema changes.

**Sequencing:** must precede any Bucket B or C schema work that depends on focus-axis interpretation.

### Bucket B — Pre-D101 schema gates (3 survivors; resolve before any schema work)

These are decisions, not implementations. Each gates a downstream schema decision; resolving them early prevents architectural lock-in mistakes.

#### B1. Pick a T9 modeling stance (separate records vs sibling variants vs runtime overlays)

**Source frames:** Frame 1 #3; Frame 2 #3; Frame 3 #2; Frame 4 #2; architecture-strategist explicit recommendation.

**What:** decide whether the captured BAB scoring-overlay grammar (rule-restriction, rule-augmentation, tiebreaker, side-switch, outcome-elevation, conditional-extension, conjunctive/wash, scoring-zone gate, reset-on-miss + asymmetric axis) lands as separate drill records (BAB's source pattern), sibling variants on a parent drill (catalog-parsimonious), or runtime constraint toggles. The synthesis itself explicitly flags "mixing approaches will create diagnostic noise."

**Warrant:** `direct:` synthesis T9 (Mini Games to 7 family across five plans with five distinct overlay variants); architecture-strategist citation of "closed-registry discipline" as the existing canonical pattern.

**Why it matters:** this is the gating decision for any future Tier 3+ pressure-game authoring. Picking late means retrofitting existing records.

**Cost / risk:** decision-pass packet; no implementation cost. Implementation lands post-D101 with real catalog candidates.

**Sequencing:** must precede any `scoringRules` schema work. Resolve in parallel with A4 (`O24`).

#### B2. Pick a T6 zone-convention default (BAB 7-zone vs FIVB 5-zone vs attack-accuracy boxes vs product-reduced grid)

**Source frames:** Frame 4 (deliberately deferred to a "Zone-Conventions frame"); architecture-strategist explicit deferral.

**What:** decide which attack-zone convention Volleycraft adopts as the default. Plan 20's Around the World (Serve) capture confirmed BAB 7-zone source-authority across four plans (1, 4, 8, 20), but FIVB 5-zone is the institutional alternative.

**Warrant:** `direct:` synthesis T6; `direct:` BAB 7-zone confirmation across Plans 1/4/8/20; `external:` FIVB Drill 5.6.

**Why it matters:** post-D101 attack-chain authoring needs this convention chosen up front. Deferring locks the chain to whatever the first added drill happens to use.

**Cost / risk:** decision-pass packet.

**Sequencing:** can resolve any time before attack-chain authoring starts. Not blocking near-term work.

#### B3. Decide whether slot 4 (movement) becomes optional in archetype contracts

**Source frames:** Frame 1 #5; Frame 4 #1; cluster-complete confirmation in synthesis (all four Game Play plans skip slot 4).

**What:** the captured BAB Game Play cluster cluster-complete-confirms slot 4 is intentionally skipped. The current `pair_net` 25-min and 40-min layouts always include `movement_proxy`. Decide whether archetype layouts add a conditional slot-skip rule, and whether a `pair_game` archetype with slot-4-skipped is justified for pair tournament prep.

**Warrant:** `direct:` synthesis Captured Plan Grammar Templates row 4 (cluster-complete confirmation); `direct:` `app/src/data/archetypes.ts` lines 207-218 (current pair_net layouts).

**Why it matters:** every pair-net session today is shaped against the source-confirmed Game Play pattern. Closest thing to a "practice match" actively contradicts BAB grammar.

**Cost / risk:** decision-pass packet; small archetype-layout change. Independent of D101 (pair-compatible already).

**Sequencing:** can land before D101 unlocks (this isn't a 3+ player issue; it's an archetype-shape issue).

### Bucket C — Post-D101 / M002 candidates (5 survivors; defer to triggers)

These are real ideas worth carrying forward, but explicit re-activation triggers (Bucket A3) gate them. Listed here so future agents can find them when triggers fire.

#### C1. Composable scoring grammar (9 rule kinds + asymmetric scoring axis)

**Source frames:** Frame 1 #3; Frame 2 #3; Frame 3 #2; Frame 4 #2; Frame 5 #4 (modifier cards); architecture-strategist Phase 3 recommendation.

**What:** when Volleycraft authors its first multi-rule pressure drill, the scoring metadata supports composable rule kinds (per the captured 9-kind grammar) with asymmetric per-team rules as a separate axis. Implementation should land base + restriction + augmentation first; tiebreaker / side-switch / outcome-elevation / conditional-extension / conjunctive-wash / scoring-zone-gate / reset-on-miss as opt-in extensions. Asymmetric scoring is deferred indefinitely (single source case in BAB; high architectural cost).

**Re-activation trigger:** `D101` unlocks (most BAB pressure drills are 4-player) OR an Around the World (Serve)-class non-D101-gated wrapper enters the diagnostics-activation pipeline.

**Sequencing:** B1 (T9 modeling stance) must resolve first.

#### C2. Problem-first plan flow (training-problem axis on Setup)

**Source frames:** Frame 1 #2; Frame 2 #1; Frame 3 #7 (training-claim authoring); Plan-Builder Thesis 1 in synthesis.

**What:** Setup grows a `trainingProblem` axis ("serve-receive sideout," "setting from pass location," "blocker pull-and-transition") distinct from the existing `sessionFocus` axis. The plan-builder selects drills against the training problem; `sessionFocus` becomes a filter / constraint, not the primary handle.

**Re-activation trigger:** `M002` design needs plan-grammar input — i.e., when M002 weekly-confidence work surfaces a need to express "what problem the user is working on this week" beyond a skill tag.

**Sequencing:** A4 (`O24`) must resolve first (the integrative-focus reading is what makes this coherent).

#### C3. Drill family abstraction (`familyId` axis + sibling-aware swap pool)

**Source frames:** Frame 1 #7; Frame 2 #4 (drill family as coordinate space); Frame 3 #2 (overlays as primitives); Frame 4 #4 (chain-primer chassis).

**What:** drill records gain a `familyId` axis. Triangle Setting (4p hit-fed at 8 plans, 4p serve-fed at 2 plans, 4p serve-fed-with-attack at 1 plan, 3p at 1 plan) becomes one family with four sibling records. Swap suggests siblings; courtside copy says "same family, different feed." Selection logic can choose "any Triangle Setting variant for this slot."

**Re-activation trigger:** `D101` unlocks AND the first Triangle Setting authoring decision lands. Authoring two records before the family abstraction exists is acceptable; authoring four is the cost cliff.

**Sequencing:** independent of `O24` and T9.

#### C4. Repetition-rank-aware catalog metadata

**Source frames:** Frame 2 #8; Frame 3 #6; Frame 4 #6; T13 itself.

**What:** drill records carry a `repetitionRank` and `novelAxisCount` field surfaced in the catalog browse, swap pool ranking, and source-backed activation pipeline. T13's "small unique inventory" insight becomes runtime data, not just synthesis prose.

**Re-activation trigger:** the third Tier 3+ source-priority drill enters the catalog (i.e., when the existing brainstorm queue is no longer a sufficient ranking signal).

**Sequencing:** independent.

#### C5. `compatibleFocuses` axis on drill records (structural-focus inference)

**Source frames:** Frame 2 #7 (structural-focus inference); Frame 3 #1 (dissolve `skillFocus`); Frame 4 #6.

**What:** drill records lose `skillFocus` as a single-value field; `compatibleFocuses` becomes a multi-value field listing which `skillFocus` values can select the drill. Session-builder selection by structural properties (target skill, feed type, participant count) lets any drill match any focus that fits — per T1 (focus is purpose, not a tag) and Plans 12/13's drill-repurposing-across-focus evidence.

**Re-activation trigger:** A4 (`O24`) resolves toward the integrative-focus reading.

**Sequencing:** A4 (`O24`) must resolve first; gated by it.

### Rejected (won't ship; documented to prevent re-litigation)

These were generated by the ideation frames but fail the adversarial filter. Documented here so future agents see why.

- **Importing BAB plan generation wholesale into M001** (Frame 6 #5 faithful random reproduction): conflicts with the explicit Adopt/Adapt/Reject ledger in the synthesis. Rejected by both architecture and product lenses.
- **Adding BAB-grade complexity to the calm courtside UI before D101** (Frame 5 #3 modifier cards as user-facing; Frame 5 #6 Hero-WOD named benchmarks): conflicts with `P11` recommend-before-interrogate and the calm/shibui posture. Surface complexity must follow content, not lead it.
- **Authoring 3+ player drills before `D101` unlocks** (any Frame proposing this): hard rejection. `D101` is the operational gate.
- **Per-team rules without a session-context model** (Frame 4 #3 asymmetric scoring axis as immediate work): one BAB source case is not yet a pattern. Deferred indefinitely per architecture-strategist; revisit only if a second source surfaces.
- **Universal warm-up opener (Best Warm Up Ever as default)** (anti-pattern flagged by architecture-strategist): would unground the `D105` Beach Prep contract from its physio source. Reject.
- **Read-drill 3-axis schema before D135 evidence** (Frame 3 #4 read drills as separate cluster grammar): T10 narrowed to Defense/Attack-only on 2026-05-04. With `attack`/`defense` not as shipped `SkillFocus` values, the schema work has nothing to attach to.
- **Spine compiler (Frame 2 #2)**, **diagnostics-driven plan synthesis (Frame 2 #5)**, **5-min one-drill no-warmup (Frame 6 #6)**, **1000-drill catalog (Frame 6 #8)**: speculative; no near-term forcing function. Held for future ideation passes.

## Source-Frame Provenance Index

For traceability when future agents resume from this ideation:

| Survivor | Frames | Critique support |
|----------|--------|------------------|
| A1 predicate registry | 1#6, 2#6 | architecture-strategist (purely-internal recommendation) |
| A2 confirmation receipt | 4#1, 4#6 | product-lens (explicit recommendation) |
| A3 re-activation triggers | — | product-lens (explicit recommendation) |
| A4 `O24` packet | 1#2, 3#1 | architecture-strategist (most important sequencing call) |
| B1 T9 stance | 1#3, 2#3, 3#2, 4#2 | architecture-strategist (Phase 0 gate) |
| B2 T6 zone convention | (deferred frame) | architecture-strategist (Phase 0 gate) |
| B3 slot-4 optional | 1#5, 4#1 | synthesis cluster-complete evidence |
| C1 composable scoring | 1#3, 2#3, 3#2, 4#2, 5#4 | architecture-strategist (Phase 3, post-D101) |
| C2 problem-first flow | 1#2, 2#1, 3#7 | product-lens (M002 trigger) |
| C3 family abstraction | 1#7, 2#4, 3#2, 4#4 | synthesis T13 |
| C4 repetition-rank metadata | 2#8, 3#6, 4#6 | synthesis T13 |
| C5 `compatibleFocuses` | 2#7, 3#1, 4#6 | architecture-strategist (gated on `O24`) |

## Recommended Next Moves

If the team wants to act on this ideation pass, the smallest-cost-highest-value sequence is:

1. **A2 + A3 + A4** as a single status / decisions pass (~0.5 day total). Capture canon-validating BAB findings, add re-activation triggers to synthesis, open `O24` decision packet.
2. **A1** as an internal refactor (~0.5 day). Generalize the predicate family before a fourth source-backed activation copies the pattern again.
3. **B1 + B2 + B3** as decision-pass brainstorms (~1 day total). Resolve the schema gates so future operational work is unblocked when triggers fire.

Total upfront cost: ~2 days. **All of Bucket C waits for explicit re-activation triggers.**

If the team prefers minimum movement: A3 alone (the re-activation triggers) is the irreducible payload. Without them, the synthesis doc's "structurally complete" framing risks pulling the next two months toward BAB-grade schema for content that cannot ship.

## Open Questions

- **Should the ideation doc's Bucket B decision packets land as separate brainstorms in `docs/brainstorms/`, or stay consolidated here until one becomes urgent?** Current convention is one brainstorm per decision; the brainstorms tend to be richer than this ideation's terse summaries.
- **Should A2 (confirmation receipt) be a `D-number` decision or a status row?** The findings are confirmations of existing canon, not new decisions — arguing for status row. But agents grep for D-numbers more reliably than status rows.
- **Should the rejected list explicitly cite this ideation doc when future agents re-propose any of those ideas?** Pattern would mirror the reverted `D136` immune-system pattern.

## For Agents

- **Authoritative for**: ranked ideation outputs from the BAB-drill-book-complete ideation pass (2026-05-04); adversarial-filtered survivors with sequencing recommendations; rejected ideas with rationale.
- **Edit when**: a re-activation trigger fires (D101 unlocks; M002 plan-grammar work starts; a non-D101-gated source-priority drill enters the diagnostics activation pipeline); a Bucket A item lands; a Bucket B decision packet is written; a Bucket C candidate gets promoted to a brainstorm.
- **Belongs elsewhere**: drill records (`app/src/data/drills.ts`), session-builder logic (`app/src/domain/sessionBuilder.ts`), decisions (`docs/decisions.md`), durable canon (`docs/vision.md`, `docs/prd-foundation.md`).
- **Outranked by**: `docs/vision.md`, `docs/decisions.md`, `docs/prd-foundation.md`, `docs/research/practice-plan-authoring-synthesis.md` for source-evidence claims, `docs/status/current-state.md` for milestone posture.
