---
date: 2026-06-11
topic: stress-substrate-visibility
focus: "should the invisible D154 stress substrate surface in the product — per-drill stress iconography during runs? quiet traces? core misdesign in data model / planning / UX? founder explicitly open to drastic changes"
mode: repo-grounded
related:
  - docs/ideation/2026-06-11-what-to-build-next-ideation.md
  - docs/brainstorms/2026-06-11-stress-substrate-requirements.md
  - docs/specs/stress-rung-taxonomy.md
  - docs/plans/2026-06-11-001-feat-stress-substrate-plan.md
---

# Ideation: Stress-Substrate Visibility (post-D154)

> Run 2026-06-11 at founder request, seeded by post-ship feedback on `D154` ("the stress substrate is invisible — by design, but watch it… the steering's proof is visible nowhere") plus two direct questions: per-drill stress iconography during runs? core misdesign in data model / planning / UX? 6 ideation frames → 48 raw candidates + 5 cross-cutting syntheses → 7 survivors + 3 honorable mentions. **Founder selected the recommended composite (survivors 1 + 2 + 3a/3b + 5a + the present-tense ruling from 7) as the brainstorm seed on 2026-06-11.** Raw candidates scratch: `/tmp/compound-engineering/ce-ideate/4f2c9a1e/`.

## Headline Findings

- **No core misdesign.** The substrate (ladders-on-drills, derived position, acceptance-gated movement) survived all six adversarial frames. What's missing is a set of *contracts on top of it*: a display contract, a consent-consequence contract, a disclosure doctrine, and honesty prerequisites.
- **Absolute rung iconography on the run face was independently rejected by every frame that touched it** — it exposes catalog structure as athlete state, invites the cross-focus comparison the taxonomy declares meaningless, is actively misleading across uneven ladder tops (serve max 4, pass/set max 5), and re-imports the metric-anxiety hazard the calm canon forbids.
- **One true near-misdesign found (survivor 4):** rung *semantics* (predictability, decision load, sequence coupling) live only in spec prose; `app/src` carries a bare integer — honest coach-language traces are currently unbuildable except as hardcoded prose.

## Grounding Context

### Codebase Context

- `D154` (shipped 2026-06-11): 1–5 ordinal stress rungs per focus in contextual-interference terms (explicitly NOT physiological intensity); rungs on drills, not variants; static ladders in `app/src/data/stressLadders.ts` (pass 5/11, serve 4/5, set 5/8); position derived (band start ±1 per ACCEPTED stress verdict, clamped) in `app/src/domain/adaptation/stressPosition.ts`; `pickForSlot` stable-sorts main-skill candidates by rung distance; steered callers = Home plan CTA + Setup preview; `repeatSession` verbatim. **Exposure deferred by design** — only visible trace is the carry-forward line; `composeCarryForwardLine` renders nothing for `keep` while steering is unconditional.
- Named v1 bypass (deliberate, in the plan): `lastCompletedByType` main-skill substitution and the DrillCheck mid-run swap are rung-blind.
- Canon in force: `P7` determinism, `D123` recommendation-first, `D150` derive-don't-persist, `D151` no self-reported readiness, `D137` Setup→Safety spine, calm/shibui + anti-gamification + READ-DO/DO-CONFIRM run-screen density, on-demand gloss pattern (AGENTS.md learned preference).
- M002 series seams: M002.2 cue/criterion depth on rungs; M002.3 rung-clear "1% better" score; M002.6 attack/tactics ladders. Founder export carries `stressPositions` (only read surface for position today).

### Past Learnings (docs/solutions/)

Behavioral-primary progress signals (visible plan adaptation is the honest "you can see it working" surface); the invisible-stress posture was a deliberate "vocabulary now, build later" call; READ-DO/DO-CONFIRM run-screen density discipline; thin pre-run spine precedent. Zero-hit: iconography conventions, invisible-system UX, D154 rung specifics.

### External Context (web research; summary-level — detail lost to subagent relay truncation, noted honestly)

- Invisible adaptation is not per se a misdesign. Two named hazards: **undisclosed adaptation discovered later** (game-DDA / FIFA-scripting trust breach) and **always-visible scores → metric anxiety** (orthosomnia pattern).
- Converged middle path: disclosed adaptation philosophy + relational labels (TrainerRoad "productive/stretch/breakthrough" relative to the athlete, visible accept-diff), calm zone bands (Gentler Streak).
- Kizilcec: explanation builds trust chiefly at expectation-violation moments; over-explaining when expectations are met erodes it.
- Challenge-point framework supports quiet "this is meant to stretch you" framing; ordinal iconography prior art (climbing grades, ski colors, ABRSM) attaches grades to the object, not the moment of performance — and climbing-grade chasing is the cautionary tale.

## Topic Axes

1. run-face-presentation — what (if anything) shows on Run/DrillCheck/Transition during a session
2. steering-disclosure — where/when the system explains assembly was steered
3. position-legibility — whether the athlete ever sees ladder position/history over time
4. substrate-semantics — is the data model right for visibility; what changes visibility forces
5. trust-pedagogy — visibility vs accept/keep loop, anti-gamification, expectation-violation, gaming/anxiety

### Run Methodology

6 ideation sub-agents (pain/friction, inversion/removal/automation, assumption-breaking, leverage/compounding, cross-domain analogy, constraint-flipping) × 8 ideas = 48 raw candidates; orchestrator synthesized 5 cross-cutting combinations; adversarial filter → 7 survivors + 3 honorable mentions. Notable convergence: **6 of 6 frames rejected absolute-rung display and converged on relational vocabulary; 5 of 6 frames independently surfaced the uninformed-consent gap at the Review verdict.**

## Ranked Ideas

### 1. Consent with consequences: the accept-diff verdict
**Description:** The Review accept/keep verdict — the substrate's only consent surface — asks the athlete to approve "a bit more stress on setting," a delta on a scale they've never seen, anchored to a position they don't know exists. Make the offer concrete: "Accept → next setting sessions lean toward drills like *Set and Look*." Derivable at verdict time from existing assembly logic.
**Axis:** trust-pedagogy
**Basis:** `direct:` D154 — movement is user-accepted only; the offer copy is the abstract form (`replayAdaptation.ts`). `external:` TrainerRoad shows the concrete workout diff at its accept moment.
**Rationale:** If the choice the loop offers is illegible, verdicts degrade into noise-clicking — the one human checkpoint in the steering loop silently stops carrying information. 5-frame convergence; strongest single finding.
**Downsides:** Review gains a line of density; needs nearest-rung lookup at verdict time.
**Confidence:** 90% · **Complexity:** Low-Medium
**Status:** **Explored** — part of the recommended composite selected as brainstorm seed 2026-06-11

### 2. The relational display invariant: no UI ever renders a raw rung
**Description:** Permanent architectural invariant: display components only ever consume a derived relation — `groove / at / stretch` relative to the athlete's own position — never rung integers. Implemented as a derived `stressRelation` on assembled slots (computed inside `pickForSlot` today, then discarded) plus one domain selector as the single legal source for all future stress surfaces. Three-word vocabulary fixed once; M002.2/.3/.6 inherit. Companion ruling (absorbed from survivor 7): **visible position is always present-tense; history is never shown** — which also dissolves the ladder-versioning history-rewrite hazard.
**Axis:** substrate-semantics
**Basis:** `direct:` taxonomy spec — "cross-focus comparisons are meaningless"; relation computed and thrown away at assembly. `external:` TrainerRoad relational labels; climbing-grade chasing as cautionary pattern.
**Rationale:** Turns "what may we ever show?" from a per-feature debate into a grep-enforceable rule, same shape as the repo's layer rules. Cheapest, highest-leverage item on the board.
**Downsides:** Vocabulary naming is a one-way door; the relation must stay honest (see idea 5).
**Confidence:** 85% · **Complexity:** Low
**Status:** **Explored** — part of the recommended composite selected as brainstorm seed 2026-06-11

### 3. The disclosure doctrine: philosophy once, brief at Setup, speak on surprise
**Description:** Three-part doctrine replacing the single "quiet trace": (a) **one-time disclosure** at first steered plan ("Your plan quietly adjusts challenge as you train. You approve every change.") — kills the undisclosed-adaptation hazard class at the root; (b) **placement rule**: disclosure lives at the briefing boundary (Setup preview), execution surfaces stay sterile (aviation TEM-briefing pattern; READ-DO discipline); (c) **trigger rule**: recurring traces fire on expectation violation only — position moved, nearest-rung fallback substituted, steered-vs-repeat divergence — never ambiently. Includes quiet steered-vs-verbatim mode annunciation (the repeat path currently makes accepted deltas appear to do nothing). Built once as a `SteeringTrace` formatter primitive, pure derive-don't-persist.
**Axis:** steering-disclosure
**Basis:** `direct:` `composeCarryForwardLine` renders nothing for `keep`, yet steering is unconditional — the most common steered state has zero trace anywhere; the proof gap is structural. `external:` Kizilcec expectation-violation finding; flight-mode-annunciator / TEM doctrine.
**Rationale:** The founder's proposed trace keyed to *delta events*; the trust hazard keys to *steering acts*. The doctrine fixes the mismatch and gives every future adaptive feature an inherited rule.
**Downsides:** Violation predicate needs careful definition; one-time disclosure needs a storage flag.
**Confidence:** 85% · **Complexity:** Low-Medium
**Status:** **Explored** — parts (a)+(b) in the recommended composite (simple trigger v1; full violation-predicate machinery deferred), selected as brainstorm seed 2026-06-11

### 4. Speak coach, not numbers: CI-dimension tags on rungs
**Description:** The taxonomy defines rungs via predictability / decision load / sequence coupling — but only in spec prose; code carries a bare integer (grep: zero occurrences of the CI dimensions in `app/src`). Tag ladder steps with 1–2 CI dimensions now (24 drills) so traces, M002.2 cue depth, and feeder-facing instructions (pair-first: contextual interference is operationally produced by the feeder) all speak coach language ("more reading the play on serve today") instead of arithmetic or hardcoded prose.
**Axis:** substrate-semantics
**Basis:** `direct:` grep evidence; taxonomy "Update When" already queues M002.2 cue-depth extension. `external:` challenge-point framework — difficulty communicated as named constraint changes, never scalars.
**Rationale:** The one true near-misdesign. Cost curve inverts with catalog growth — cheap at 24 drills, prohibitive after M002.6 authors attack ladders against bare ordinals.
**Downsides:** Authoring work; extends the registry schema (data-layer only).
**Confidence:** 75% · **Complexity:** Medium
**Status:** Deferred with intent → M002.2 (record now: traces must speak coach language, so M002.2 authors tags, not prose)

### 5. Honesty prerequisites: the visibility gate
**Description:** A visible claim that is sometimes false is worse than invisibility. Before any visibility ships: (a) close the `lastCompletedByType` substitution bypass + rung-blind DrillCheck swap; (b) decide ladder-versioning semantics — position replays against *current* ladders, so every ladder edit rewrites any visible past (the unstated D150 invariant is ladder immutability; M002.6 will break it) — resolved cheaply by idea 2's present-tense ruling; (c) automate the taxonomy's rung-audit revision trigger through the existing diagnostics pipeline (the ladder author is the right first audience); (d) define the replay stream (closed: accepted verdicts only vs open: ordered position-affecting events) before more event types accrete.
**Axis:** substrate-semantics
**Basis:** `direct:` plan names the bypass deliberately; D150/D154 text. `reasoned:` pure replay over mutable rules is referentially transparent only while the rules are frozen; exposing replay output as user-facing state converts rule edits into retroactive history edits.
**Rationale:** Reframes "should we show stress?" into "what must be true before showing stress is safe?" — the sequencing constraint every other idea rests on.
**Downsides:** Delays visible payoff; versioning decision pressures derive-don't-persist's spirit if history ever ships.
**Confidence:** 80% · **Complexity:** Medium
**Status:** **Explored (part a)** — substitution-bypass closure in the recommended composite as the gate before the Setup trace ships; (b) resolved via idea 2's ruling; (c)+(d) deferred riders

### 6. The run-face fork: exception-only stretch mark vs courtside silence
**Description:** The frames genuinely split; the deciding criterion is **capture integrity**, falsifiable in dogfood. *For a mark:* an unmarked stretch gets misattributed and the athlete taps "too hard," feeding back a suggestion to lower the very stretch that was working as designed — a single relational word at DrillCheck ("stretch"), exception-only, silence-as-default, cleans the loop's own input. *Against any mark:* pre-disclosed difficulty anchors self-report (demand characteristics; Lichess hides puzzle ratings until attempted for exactly this reason) and changes motor behavior — capture stays honest only if blind, with the retrospective trace at Review. Either way: relational word only, never on the Run screen itself, never absolute rungs.
**Axis:** run-face-presentation
**Basis:** `external:` challenge-point framing vs Lichess blind-until-attempted — same capture-integrity concern, opposite conclusions. `direct:` capture lives at `/run/check`, the same screen the misattributed signal is recorded on.
**Rationale:** The precise residue of the founder's iconography question once absolute badges are eliminated — decidable by evidence, not argument.
**Downsides:** Either branch forecloses the other's benefit until revisited.
**Confidence:** 70% (in the fork framing) · **Complexity:** Low either way
**Status:** Deferred — courtside silence wins v1 by default; reopen if dogfood shows "too hard" taps on drills working as designed

### 7. Position legibility: coarse, ceremonial, on-demand, no history
**Description:** The athlete may pull (never be pushed) a current-state-only read, voiced as place vocabulary from the rung anchors the spec already names ("Setting: at the *varied* stage these days"), re-rendered only after accepted verdicts (belt-promotion shape); no charts, trends, or dates — display inherits derive-don't-persist. Separable and cheaper: the ladder *mechanism* is editorial content (a static "how sessions are steered" gloss), independent of personal-position disclosure.
**Axis:** position-legibility
**Basis:** `direct:` anchors named in `stress-rung-taxonomy.md`; on-demand gloss pattern ratified in AGENTS.md; position currently readable only via founder export — no error-correction loop exists. `external:` belt-visibility norms; Gentler Streak state-without-trend; orthosomnia hazard.
**Rationale:** Pre-decides the boundary before M002.3's score work makes it urgent. Tension logged: M002.3's "1% better" arm must respect the no-history posture or explicitly reopen it.
**Downsides:** Pre-empts a future progress view some users may want.
**Confidence:** 75% · **Complexity:** Low-Medium
**Status:** Partially absorbed — the present-tense/no-history ruling joins the composite via idea 2; the pull-gloss itself deferred

## Recommended Composite (founder-selected brainstorm seed)

1. **Ratify (zero code):** idea 2's display invariant + the present-tense/no-history ruling (one decision row; dissolves the versioning hazard).
2. **Ship the trust loop:** idea 1 (accept-diff at Review) + idea 3a/3b (one-time philosophy disclosure + quiet Setup-preview steering line keyed to steering acts; simple trigger v1).
3. **Gate:** idea 5a (make the substitution bypass rung-aware or trace-suppressing) before the Setup trace ships.
4. **Defer with intent:** idea 4 → M002.2 (with the coach-language requirement recorded now); idea 6 → dogfood-decided; idea 5c (rung-audit diagnostics) → rider on next diagnostics work.

Net effect: closes the trust loop at the two moments the athlete already reads deliberately (verdict + Setup brief), keeps the run face READ-DO clean, zero schema impact, fully D150-clean — and answers the original questions: **no run-face iconography in v1; no core misdesign.**

## Honorable Mentions

- **Auto-apply + visible undo** (inversion#1, flip#3): visibility and consent are substitutes — auto-move the rung, always show the diff, offer undo; dissolves verdict ceremony. Rejected for contradicting the ratified user-accepted-only pedagogy without dogfood evidence; revisit if verdict fatigue appears.
- **The familiarity axis** (assumption#7): nominal vs functional difficulty — a rung-3 drill seen ten times stresses less than one never seen; derivable from ExecutionLog exposure counts, D150-clean; better assembly tie-breaks within a rung. Real but a model extension deserving its own brainstorm.
- **Mid-session downshift** (flip#8): too-hard at DrillCheck re-resolves remaining same-focus drills one rung down, visibly ("Swapped Set and Look for Hand Set Fundamentals — easing off"). Strongest proof-by-behavior; touches the run-flow state machine and needs a consent-exemption policy fork.

## Rejection Summary

| # | Idea | Reason Rejected |
|---|------|-----------------|
| 1 | Accept-diff duplicates (pain#1, assumption#8, leverage#7, analogy#8b, flip#3) | folded into survivor 1 (5-frame convergence) |
| 2 | Relational-display duplicates (inversion#5, assumption#2, leverage#2/#3, analogy#7, flip#4) | folded into survivor 2 (6-frame convergence) |
| 3 | Setup-briefing placement (pain#3, inversion#2, analogy#3, flip#5) | folded into survivor 3b |
| 4 | Expectation-violation trigger (inversion#6, assumption#3, leverage#4, flip#7) | folded into survivor 3c |
| 5 | One-time philosophy disclosure (pain#8, assumption#4, analogy#8a, flip#1-part) | folded into survivor 3a |
| 6 | Mode annunciator / repeat-divergence disclosure (analogy#4, pain#5) | folded into survivor 3 |
| 7 | Cue-voice / dynamics markings / feeder CI payloads (assumption#1, analogy#1, flip#6) | folded into survivor 4 |
| 8 | Rung-audit diagnostics, substitution bypass, ladder versioning, label dry-run grain audit (inversion#8, leverage#8, pain#7, assumption#6) | folded into survivor 5 |
| 9 | DrillCheck stretch tag vs capture contamination (pain#4, inversion#3, inversion#4, analogy#2) | folded into survivor 6 as the fork |
| 10 | On-demand peek / belt norms / vocabulary-as-place / ladder atlas (pain#6, inversion#7, assumption#5, analogy#5, flip#1) | folded into survivor 7 |
| 11 | Catalog-metadata rung glyphs on Setup rows / drill library (leverage#5) | placement variant within survivors 2/6 |
| 12 | Position-history gloss for M002.3 (leverage#6) | conflicts with survivor 7's no-history posture; M002.3 seam noted in survivor 7 |
| 13 | Manual gearbox — athlete-set rung dial (flip#2) | contradicts D123 recommendation-first + derived-position philosophy; replay-stream definition residue kept in survivor 5d |
| 14 | Auto-apply + undo (inversion#1, flip#3) | honorable mention — contradicts ratified consent covenant without evidence |
| 15 | Familiarity axis (assumption#7) | honorable mention — model extension beyond visibility scope |
| 16 | Mid-session downshift (flip#8) | honorable mention — own policy fork + riskiest refactor |
| 17 | Capture de-confound tap — "body" vs "reads/decisions" (pain#2) | brainstorm variant within survivor 6's capture-integrity criterion |
