---
date: 2026-06-11
topic: what-to-build-next
focus: "open first-principles pass on 'what's the right next thing to build?' post-M002.1 ship; prior M002 series ordering treated as background, not constraint (founder-selected fresh/surprise-me mode)"
mode: repo-grounded
related:
  - docs/ideation/2026-06-02-plan-and-adaptation-system-ideation.md
  - docs/brainstorms/2026-06-03-m002-thin-spine-and-milestone-series-requirements.md
---

# Ideation: What To Build Next (post-M002.1 first-principles pass)

> Run 2026-06-11 at founder request ("what's the right next thing to build, from first principles? i have ideas but curious for yours"). Founder explicitly chose a fresh pass over continuing the 2026-06-02 ideation: existing M002 conclusions were background, not constraint. 6 ideation frames → 48 raw candidates + 7 cross-cutting syntheses → 7 survivors. **Founder selected survivor #1 (Close the Loop For Real) as the brainstorm seed on 2026-06-11.** Raw candidates scratch: `/tmp/compound-engineering/ce-ideate/045f58c9/`.

## Grounding Context

### Codebase Context

- **Reality is ahead of the docs.** M001 closed 2026-05-27 (`D147`). **M002.1 thin-spine SHIPPED ~2026-06-04/05 and was dogfooded**: derived plan (`composePlan`), staleness-ordered focus backlog, carry-forward line, behavioral weekly receipt, felt-difficulty proxy, accept/keep adaptation verdict at review end, Home plan-launch CTA (`D152`). Dexie is **v7** in code (adds `offeredDelta` + `verdictChoice` on `SessionReview`); Snapshot/`AGENTS.md`/`llms.txt` still said v6 / "planning" at run time.
- **Named v1 gap (verbatim, D152 ship notes):** "accepted verdict delta is carry-forward presentation only — the launch does not modulate assembly with it."
- Recent decisions: `D147` M001 executive closure; `D149` M002 → milestone series "Weekly Training Home"; `D150` derive-don't-persist plan model; `D151` defer self-reported readiness; `D152` Home coherence.
- M002 series map (background for this run): M002.2 stress ladders + technique-"how"; M002.3 objective "1% better" score; M002.4 goals anchor; M002.5 bring others in; M002.6 attack + tactics; Phase 1.5 event/taper/cloud peer.
- Code findings (leverage frame): `app/src/data/progressions.ts` chains are fully authored but consumed only by `catalogValidation.ts` + tests (dormant substrate); difficulty is encoded in **five disjoint places** (levelMin/Max bands, RPE envelopes, feedType gradient, prose progression/regression strings, ProgressionChain links); `SkillVector` + `SessionParticipant[]` are reserved dormant seams; `composePlan` is a pure projection.
- Founder evidence (freshest): ~2×/week pair sessions; one 3s session **displaced outside the app** (2026-05-23); pains: receive→set→attack chain weak (partner-corroborated), technique-"how" depth missing (BAB camp), 3+/rotation, tactics, mid-session extend ask (Seb 2026-05-16, the only feature request ever made while playing), warmup/duration friction; a session marked `ended_early` that founder annotated "We did not end early." Founder willingness-to-recommend: currently NO. `D130` re-eval 2026-07-20 rides on M002 evidence.
- Dogfood (M002.1): adaptation loop coherent; verdict correctly silent without trend; anti-guilt quiet weeks pass; receipt "this week" label ambiguous for lapsed users (deferred).

### Past Learnings (docs/solutions/)

Behavioral-primary progress signals; series re-scope discipline; source-backed content-depth pipeline; drill runnability rubric; founder-feedback trigger discipline; dual-read evidence artifacts. Zero-hit greenfield: goals authoring, roster features, attack content, warmups, Dexie data-layer pitfalls.

### External Context (web research; summary-level — detail lost to subagent relay truncation, noted honestly)

- Training apps' second act after the core loop (TrainerRoad, Hevy, Lattice, Whoop) converged on **adaptive multi-week progression/foresight, not content expansion**.
- Dropout cliff ~week 14; strongest retention levers: progression visibility, goal anchoring, **partner accountability**.
- Motor-learning evidence favors progression/variety structure over technique-cueing depth (cueing literature weakened by publication bias).
- Gentler Streak defines the calm history/trends pattern. Pair-visibility features are grounded; roster-logistics features are an evidence-free bet.

## Topic Axes

Decomposition skipped — surprise-me mode.

### Run Methodology

6 ideation sub-agents (pain/friction, inversion/removal/automation, assumption-breaking, leverage/compounding, cross-domain analogy, constraint-flipping) × 8 ideas = 48 raw candidates; orchestrator synthesized 7 cross-cutting combinations; adversarial filter → 7 survivors + 3 honorable mentions. Notable convergence: **5 of 6 frames independently surfaced the inert-verdict gap**; 5 frames surfaced session-time elasticity; 4 frames surfaced pair data handoff.

## Ranked Ideas

### 1. Close the Loop For Real (act-or-delete)
**Description:** Accepted adaptation verdicts actually modulate `composePlan` (stress/focus/duration bias) under an **act-or-delete** rule: the app may not display a reading it won't act on. Bundles session-truth integrity (skip-wrap ≠ `ended_early`; chips instead of typed post-hoc prompts; clock calibrated from observed block durations) so the loop acts on honest data. Synthesizes 5-frame convergence (pain #2, inversion #4, assumption #4, leverage #2, constraint-flip #6) + session-truth (pain #4) + self-calibrating clock (inversion #7).
**Basis:** `direct:` D152 names the gap verbatim ("accepted verdict delta is carry-forward presentation only"); 2026-05-10 export said `ended_early` while the founder wrote "We did not end early"; dogfood found the loop "coherent" — i.e. the founder is accepting verdicts that are silently inert.
**Rationale:** Trust time-bomb in the product's stated second act. The 2026-07-20 re-eval needs evidence that adaptation *works*; a presentation-only verdict can never produce that evidence. Highest evidence-per-effort move available; built as a typed modifier channel, every later progression feature (ladders, goals, taper) becomes a new modifier producer rather than a new assembly fork.
**Downsides:** Less visibly "new" than a feature; with no ladder content yet, modulation is coarse-grained at first.
**Confidence:** 90% · **Complexity:** Medium
**Status:** **Shipped** — selected as the brainstorm seed on 2026-06-11; landed across `D154` (stress substrate: the accepted verdict delta now acts on assembly), `D155` (session-truth terminal semantics + clamped recorded duration + session-grain clock calibration), `D157` (stress-visibility trust loop), and `D159` (steering extended to the default Setup path + rung-aware substitution, closing the act-everywhere gap)

### 2. The Stress Rung, Derived
**Description:** One canonical difficulty axis on drill variants unifying the five disjoint encodings, rendered as a **finite graded syllabus** (ABRSM/étude-book shape, not endless library); rung position **derived** from history (never picked); degraded-input variants ("game days") as a second axis. M002.2/.3/.6 + verdict assembly all become consumers of one substrate.
**Basis:** `direct:` dormant `progressions.ts` chains; five difficulty encodings with no unifying axis; BAB stress ladder already named the organizing primitive.
**Rationale:** Three remaining milestones depend on a difficulty ordering; whoever builds M002.2 first will define this substrate accidentally under deadline pressure. The derived-rung pin avoids shipping a difficulty *setting* instead of a *coach's judgment*.
**Downsides:** Early schema commitment; content payoff lands a milestone later.
**Confidence:** 80% · **Complexity:** Medium-High · **Status:** **Substantially shipped** — `D154` shipped the canonical per-focus stress-rung axis (static ladders over the catalog), the **derived** ladder position (user-accepted verdicts only, never picked), and rung-steered assembly; `D160` broadened ladder membership to every scoped-tag drill with validation cross-checks. Remainder owned by M002.2: per-rung cue/content authoring (the graded-syllabus rendering), thin-rung backfill, and the degraded-input "game days" second axis

### 3. Chains Before Attack
**Description:** Ship the variant-level scenario/chain field the type system already predicts, then author the attack track *into* it; one-tap chain-split attribution ("which link broke?") at DrillCheck.
**Basis:** `direct:` founder's #1 corroborated pain is a chain (receive→set→attack), unrepresentable in the flat `SkillFocus` enum; `app/src/types/drill.ts`: "scenarios… belong on a future variant-level scenario field, not here."
**Rationale:** If attack ships as a 7th enum value, the transitions the founder actually named stay unrepresentable and tactics has no attachment point. A feedback loop can only correct at the resolution it measures.
**Downsides:** Reopens `D143`; taxonomy work before visible content.
**Confidence:** 80% · **Complexity:** Medium-High · **Status:** Unexplored

### 4. The Elastic Outing
**Description:** Session composition becomes re-entrant: real minutes in at Setup, honest assembled duration shown, "one more block?" at the final drill recomposes the remainder. Extends D150's projection boundary from "session start" to "now."
**Basis:** `direct:` Seb's 2026-05-16 mid-session extend ask (only feature request ever made while playing); 2-hit custom-time wish; repeated warmup-timing friction; `ended_early` misclassification.
**Rationale:** Five phrasings across five frames reduce to one mechanism. Dissolves the extend ask, custom-time ask, and duration-honesty category in one move rather than patching symptoms.
**Downsides:** Touches the run-flow state machine; riskiest refactor of the seven.
**Confidence:** 75% · **Complexity:** Medium-High · **Status:** Unexplored

### 5. Off-Script Capture
**Description:** ≤60-second retro-log ("We trained — log it") writing an `ExecutionLog`-grade record that feeds staleness, receipt, and carry-forward. The displaced 3s session becomes history instead of a hole.
**Basis:** `direct:` 2026-05-23 displaced 3s session (only *observed* displacement on record) currently both removes evidence and corrupts the staleness model; D152's trained-sessions basis means the ingestion seam exists.
**Rationale:** Neutralizes the worst consequence of the content gap at ~1/10th the cost of 3s content (which stays `D101`-gated). Protects the anti-guilt promise (receipt stops under-counting real training).
**Downsides:** Retro-logged data is coarser; needs honest labeling in the receipt.
**Confidence:** 85% · **Complexity:** Low · **Status:** Unexplored

### 6. The Pair Bundle
**Description:** Local-first courier-model session handoff (share-sheet/QR) so both Dexie instances converge on the same pair history; partner gains thumb-level inputs (difficulty tag, two-thumb verdict, pair-visible receipt). The full per-pair plan model ("the pair is the athlete") is the noted deep end, deferred until handoff proves merge semantics.
**Basis:** `direct:` real session stranded on Seb's device ("export pending"); manual Dexie-export ritual documented. `external:` partner accountability strongest retention lever; pair-visibility grounded vs roster-logistics evidence-free.
**Rationale:** Pair-first product (`D146`), single-player data model — adaptation math runs on half the pair's sessions; the most likely first recommendee has no artifact of his own training.
**Downsides:** Merge semantics and record identity are one-way doors.
**Confidence:** 75% · **Complexity:** Medium-High · **Status:** Unexplored

### 7. The Benchmark Kata
**Description:** Pull M002.3's objective score forward as rare, ceremonial, fixed-condition benchmark sessions (belt-grading / CrossFit "Fran" pattern) — trustworthy because conditions are pinned, calm because rare. Meanwhile delete uninformative per-drill asks in favor of behavioral inference.
**Basis:** `external:` TrainerRoad/Hevy/Lattice all anchored adaptation on a repeated standardized measurement before shipping the engine. `direct:` every logged `perDrillCapture` to date is `still_learning` — a constant-output, uninformative sensor.
**Rationale:** Resolves the measurement-vs-anti-gamification tension; gives "1% better" its first objective trace before ladders need an advancement gate.
**Downsides:** Challenges the M002.2→.3 ordering; benchmark drill design is real work.
**Confidence:** 70% · **Complexity:** Medium · **Status:** Unexplored

## Honorable Mentions

- **Season Arc / horizon line** (3-frame convergence): externally strongest (week-14 dropout cliff lands ≈ 2026-07-20 re-eval; "app remembers my training" vs "app is taking us somewhere") but the founder deliberately deferred anchors on 2026-06-02 with a defined re-entry condition. The timing argument is genuinely new info to weigh at re-eval.
- **Ears-First / Pocket Plan** (modality cluster): real screen-babysitting evidence (mute-switch/wake-lock saga, partner read-aloud friction); a modality decision better taken inside run-surface work.
- **Evidence Flywheel**: app emits its own founder-ledger row at session end (one tap to copy/share); cheap, gate-relevant, rides along with whatever ships next — the ledger materially under-counts and the 2026-07-20 gate reads it.

## Rejection Summary

| # | Idea | Reason Rejected |
|---|------|-----------------|
| 1 | Verdict-acts duplicates (inversion #4, assumption #4, leverage #2, flip #6) | folded into survivor 1 (strongest form) |
| 2 | Session Truth + Self-Calibrating Clock | folded into survivor 1 (data-integrity preconditions of an honest loop) |
| 3 | Derived Rung / Graded Syllabus / Game Days / Constraint Algebra / Drill Grammar | folded into survivor 2 (facets of one substrate decision) |
| 4 | Content Compiler (authoring pipeline) | folded into survivor 2; premature until rung/chain schema settled |
| 5 | Attack Chain Track + Chain Splits | folded into survivor 3 (attack authored into the chain model) |
| 6 | Elastic Session ×5 phrasings | folded into survivor 4 (one mechanism) |
| 7 | Minimal 3s Mode | more expensive response to the same displacement evidence; content stays D101-gated; survivor 5 neutralizes the data loss first |
| 8 | Pair handoff ×4 phrasings + Partner's Thumb | folded into survivor 6 |
| 9 | Pair-as-Athlete (per-pair plan model) | deep end of survivor 6; premature before handoff proves merge semantics |
| 10 | Participant Substrate (`SessionParticipant[]` activation) | substrate without an authorized consumer while D101 gated |
| 11 | Silent Capture | folded into survivor 7 (sensor strategy) |
| 12 | CRM Pair Pre-Brief | compelling, but a brainstorm variant within survivor 3's chain work |
| 13 | Side-Out Repertoire (chess) | depends on survivor 3's chain/grammar substrate existing first |
| 14 | Teach-Back Cards (surgical) | protocol answer to technique-how; brainstorm variant within survivor 2's syllabus shape |
| 15 | Season Arc cluster | honorable mention: founder deferred anchors 2026-06-02 with explicit re-entry condition; no founder-use evidence yet that the anchor is missed |
| 16 | Stranger-Ready cold start | front-runs the cohort decision the 2026-07-20 gate exists to make |
| 17 | Ears-First / Pocket Plan | honorable mention: modality call belongs inside run-surface work |
| 18 | The "How" Layer (technique content) | folded into survivors 2/3 content shape; see also teach-back note |
| 19 | Evidence Flywheel (app writes the ledger / field-note chips) | honorable mention: operator-facing value; rides along rather than leading |
