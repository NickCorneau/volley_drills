---
date: 2026-05-27
topic: attack-track-and-m001-closure-shape
focus: "next step and right shape here based on all of this (attack-content track shape + M001 closure interaction, given F1 reclassification to first-class content-gap-evidence on 2026-05-27)"
mode: repo-grounded
---

# Ideation: Attack-Track Shape and M001 Closure Interaction

## Grounding Context

### Codebase Context (from in-conversation grounding, not a fresh codebase scan)

**Project**: Volleycraft, volleyball training app for self-coached amateurs. Phase 0 validation. Live PWA at <https://volleydrills.nicholascorneau.workers.dev>. Repo at `/home/nick/projects/volley_drills`. WSL/bash/python3 automation.

**M001 state** (read from `docs/status/m001-validation-overhang.md`, `docs/status/current-state.md`, `docs/milestones/m001-solo-session-loop.md`):
- Build phase **complete** as of 2026-05-08
- Validation phase **active** through 2026-07-20 D130 re-eval
- **Tier 2 polish gate unlocked 2026-05-23** per Condition 3 PASS
- Standard D130 Condition 1 (solo / set focus usage) **fail-trending** under standard read (solo 1/7 ~14%, set-focused 0/3) but **ambiguous** under D132 pair-first / solo-accommodating re-read
- Condition 2 PASS for 2-player scope
- Condition 3 PASS (partner unprompted-open within 30 days of Tier 1a walkthrough)

**Tier 1b cap discipline** (read from `docs/status/post-m001-content-backlog.md`):
- 10-drill anti-displacement cap, 4/10 consumed (`d31`, `d33`, `d40`, `d42`)
- 6 reserved slots with **2026-07-20 hard expiry** per kill-or-author contract
- Structural enforcement via `cap_status_must_be_consistent` in `scripts/validate-agent-docs.sh`

**Attack content evidence escalation** (today, 2026-05-27, captured in `docs/research/2026-05-27-attack-content-and-solo-friction-feedback.md` with same-day addendum):
- F1 attack-section ask reclassified from second-class to **first-class content-gap-evidence** under D135 clause 1
- Three hits in 5 days: 2026-05-22 F2 (wishful) + 2026-05-23 near-displacement leading indicator + 2026-05-27 explicit skill-weakness self-attestation
- **Partner-corroboration confirmed** via founder-channel-relay backed by founder direct real-game observation of Seb's play
- **Six specific named technical/tactical gaps** from real-game observation:
  1. Seb's arm swings aren't great (mechanics)
  2. General flow after receiving is bad (chain-of-play)
  3. Sets aren't great (chain-of-play, upstream of attack)
  4. Follow-on attacks are weak (chain execution)
  5. Seb doesn't do roll shots or deep corner shots (shot variety)
  6. Always just flicks it with his wrist (mechanics, no shot vocabulary)
- Two clarifiers resolved today: partner-corroboration (YES); shape clarifier narrowed (path (a) dropped; (b) vs (c) remaining; agent's lean is (b))

**Source material convergence** (from `docs/research/bab-source-material.md`, `docs/research/fivb-source-material.md`, web research on beach-volleyball attack pedagogy):
- BAB Drill Book: 5 of 20 plans dedicated to Attacking (Plans 7-11), internal 7-slot grammar, chain-integrated via Triangle Setting primer
- FIVB Drill Book: dedicated Chapter 5 (8 drills + essay), three-level progression (beginner → intermediate → advanced)
- BAB Attacking MasterClass (commercial 8-week course): mechanics → variety → situational
- JVA 8-practice program: attack threaded across practices, not isolated
- **Three-layer attack pedagogy is universal across authoritative sources**: mechanics fundamentals → shot variety → chain/situational

**Local pattern precedent** (from `docs/solutions/`):
- **Source-backed content-depth activation pattern** (2026-05-04) is the validated local precedent for shipping standalone drills outside cap discipline as a separate-track shape — same as `d49`/`d50`/`d51` already shipped
- **Route founder-use feedback without over-firing scope** (2026-05-04, D135 trigger discipline) — evidence can be captured durably without firing the gate
- **Decision-debt sweep pattern** (2026-05-25) — decisions ship bound to code/scope in same commit; no local precedent for `docs/decisions.md` packets that authorize work weeks ahead of any code slice

**Key open questions in the decision space**:
- Shape: (b) D148-shape new attack-chain track outside Tier 1b cap vs (c) Tier 1b cap expansion
- Sequencing: in-M001-extended vs parallel-to-M001 vs post-M001-but-decided
- M001 closure interaction
- Track scope: just-attack vs receive→set→attack chain
- Layer A size: 2-3 mechanics drills vs 4-6 mechanics+variety vs 6-9 full three-layer
- Cap-accounting: outside Tier 1b cap vs inside cap vs cap expansion
- D132 ratification timing
- Behavioral evidence channel weighting at re-eval

**Founder posture commitment** (2026-05-27, explicit):

> "well in that case note that I am explicitly agreeing that smaller is better for now, and we can validate and build out more later on"

This commits the decision space to a **smaller-first posture**: prefer probes over commitments, prefer reframes over new artifacts, prefer collecting existing text over authoring new text, prefer one-drill ships over multi-drill tracks. The "validate and build out more later" clause preserves expansion as the explicit pre-registered next move conditional on probe evidence.

## Ranked Ideas

### 1. Action Stack 6 → 3 → 1 — ratify D132 from existing chat text, close M001 with F1 as closure artifact, ship one canonical-drill probe

**Description**: A coherent three-step sequence that resolves the three most-stuck pieces of the decision space using the smallest meaningful moves available. Step 1 (Survivor 6): extract the founder's 2026-05-27 conversation prose on solo usage as the D132 ratification text and land it in `docs/decisions.md`. Step 2 (Survivor 3): close M001 by naming F1 (first-class content-gap evidence from real-game observation, partner-corroborated, six specific named gaps) as the closure artifact — F1 IS proof the founder-use mode's premise (founder finds real gaps in real practice) was met. Step 3 (Survivor 1): author one canonical attack-mechanics drill (FIVB 5.1 "Stand and Spike") outside the Tier 1b cap via the source-backed content-depth activation pattern, observe founder + Seb response in 1-2 sessions, then decide whether full three-layer attack track is warranted. Each step is independent enough to ship in any order if one stalls; together they answer both "next step" and "right shape" cleanly without pre-committing to a multi-drill track.

**Warrant**: `direct:` All three components have direct grounding:
- Step 1: founder verbatim 2026-05-27 — "Its true, we dont use Solo that much. maybe because its harder to train solo, though" and "for solo its either just hard solo or training solo isnt where my time is spent, idk yhet - i think the app does a decent job at solo training though at least in my limited exp with it"
- Step 2: `docs/research/founder-use-ledger.md` "Why this file exists" — D130 premise is "founder has personal conviction for the product"; F1 is the strongest sustained-use-finds-real-gap evidence the founder-use window has produced
- Step 3: `docs/solutions/2026-05-04-source-backed-content-depth-activation-pattern.md` — validated local precedent for shipping standalone drills outside Tier 1b cap; Stand-and-Spike is FIVB 5.1's canonical beginner attack drill matching founder gaps 1 (arm swing) and 6 (wrist-flick)

**Rationale**: Smallest move that resolves the most stuck pieces. Doesn't pre-commit to three-layer track (Survivor 7's source-laundering critique remains valid). Doesn't require omnibus packet authoring (Survivor 5's risk). Preserves optionality at every step. Matches founder's explicit smaller-first posture commitment. Action stack 6 → 3 → 1 also has a natural ordering: 6 is cheapest (collect text); 3 reframes a stuck decision; 1 starts data collection for future track-shape decision.

**Downsides**: Defers the bigger track-shape question; founder may later want commitment, not probe. Requires explicit discipline ("after N sessions of using the canonical drill, we read the result and decide on track shape"). M001 closure with F1 as artifact requires writing the closure narration carefully — over-claiming F1 as "proof" risks a future failure mode if downstream authoring stalls.

**Confidence**: 80%
**Complexity**: Low (per step)
**Status**: **Explored** — selected as the brainstorm seed on 2026-05-27 under the founder's explicit smaller-first posture commitment

---

### 2. Canonical-drill probe — ship Stand and Spike before D148

**Description**: Author one canonical attack-mechanics drill (FIVB 5.1 "Stand and Spike") outside the Tier 1b cap, using the source-backed content-depth activation pattern (`docs/solutions/2026-05-04-source-backed-content-depth-activation-pattern.md`) — same shape as `d49`/`d50`/`d51` already shipped under this exact pattern. Observe founder + Seb response in 1-2 real sessions. Then decide whether the full three-layer track is warranted, or whether one canonical drill substantially closed the gap.

**Warrant**: `direct:` Source-backed activation pattern is the validated local precedent for shipping standalone drills outside cap discipline. Stand-and-Spike is FIVB 5.1's canonical beginner attack drill — direct match for founder gaps 1 (arm swing) and 6 (wrist-flick-only).

**Rationale**: Inverts the "decision packet first, authoring second" assumption. Treats authoring as evidence-gathering rather than decision-execution.

**Downsides**: Defers the bigger question; requires building shape-decision discipline.

**Confidence**: 80%
**Complexity**: Low
**Status**: Unexplored (rolls up into Idea 1 action stack)

---

### 3. Decouple M001 closure from attack-track decision

**Description**: Treat the two questions as orthogonal. M001 closes on its own evidence; attack-track shape decides on F1. Neither blocks the other.

**Warrant**: `reasoned:` The decisions live in different planes (milestone-completion vs content-authoring-discipline). The entanglement is conversational, not structural.

**Rationale**: Eliminates the false constraint that closure must "name" the attack track.

**Downsides**: Loses cross-narrative benefit; requires explicit discipline.

**Confidence**: 75%
**Complexity**: Low
**Status**: Unexplored (partially captured by Idea 1)

---

### 4. F1 IS the M001 closure artifact

**Description**: Reframe F1 as proof M001's product-validation premise was met. Close M001 by naming F1 as completion evidence, not by deferring closure until F1's downstream authoring resolves.

**Warrant**: `direct:` D130 premise is "founder has personal conviction for the product." F1 is the strongest sustained-use-finds-real-gap evidence produced.

**Rationale**: Reframes F1 from "blocker to closure" to "completion of closure."

**Downsides**: Risks reading F1 as victory too quickly; sets up failure mode if post-closure authoring stalls.

**Confidence**: 70%
**Complexity**: Low
**Status**: Unexplored (rolls up into Idea 1 action stack)

---

### 5. Founder authors D148 in own voice

**Description**: Founder writes the decision in 200-500 words in their own voice; agent provides synthesis as draft. Final text is founder-direct.

**Warrant**: `direct:` Founder explicitly delegated shape choice ("i guess you choose") then asked agent to verify against source material — that sequence indicates founder wants agent to gather + propose but make the final call.

**Rationale**: Addresses agent-asymmetry risk (trigger e). Founder-voice decisions are durable evidence of founder-direct authority for the 2026-07-20 re-eval.

**Downsides**: Adds friction (founder writing vs founder approving); may feel ceremonial.

**Confidence**: 75%
**Complexity**: Low
**Status**: Unexplored (compatible with Idea 1; applies to D132 ratification step and M001 closure narration step in particular)

---

### 6. Omnibus packet resolving 5+ entangled decisions together

**Description**: One decision packet (`D148`) resolves the joint state of attack-track shape, sequencing, M001 closure form, D132 ratification, and chain-integration boundary.

**Warrant**: `direct:` The decisions are textually entangled. Decision-debt-sweep pattern precedent: one packet, one neighborhood.

**Rationale**: Cuts through the entanglement by deciding the joint state in one pass.

**Downsides**: Higher upfront cost; risks bundling decisions that should stay separable.

**Confidence**: 65%
**Complexity**: Medium
**Status**: Unexplored (rejected in favor of Idea 1's smaller-stack shape under the smaller-first posture commitment)

---

### 7. D132 ratification text is already in this conversation — collect it now

**Description**: Founder verbatim on 2026-05-27 contains a draft D132 ratification: sport-hard OR context-of-use, NOT product-friction. Extract that text into a dated decision row in `docs/decisions.md` and stop carrying D132 as a pending ambiguity.

**Warrant**: `direct:` Founder verbatim above. The "idk yet" between sport-hard and context-of-use doesn't block ratification — both options route to D132 frame.

**Rationale**: Removes one of the 5 entangled questions from the decision space. Cheapest meaningful move available.

**Downsides**: Premature ratification if founder later disambiguates differently. But both sub-options route to D132, so ratification is robust.

**Confidence**: 85%
**Complexity**: Low
**Status**: Unexplored (rolls up into Idea 1 action stack as step 1)

---

### 8. Source-laundering critique — three-layer pedagogy may not be evidence-derived

**Description**: The agent's three-layer recommendation is heavily sourced from BAB/FIVB/commercial coaching. Source authority structures attack pedagogy for *beginners*. Seb is not a beginner — mid-real-game with named technical weaknesses. Mechanics-first for someone already playing games may be the wrong default ordering. Founder's six named gaps don't actually demand three layers organized that way.

**Warrant**: `reasoned:` Three-layer mapping was the agent's own synthesis. Source authority structures attack pedagogically for beginners. Founder + Seb are mid-real-game; the gaps describe one chain, not three drills.

**Rationale**: Surfaces a real flaw in the agent's prior recommendation. If gaps actually demand 2-3 drills (one mechanics for gaps 1+6, one variety for gap 5, one chain for gaps 2/3/4), that's a smaller, sharper authoring scope.

**Downsides**: Conflicts with cross-source authoritative convergence. Risks under-authoring if mechanics turn out to need their own layer.

**Confidence**: 60%
**Complexity**: Low (reframes scope without changing authoring shape)
**Status**: Unexplored (compatible with Idea 1 — informs the canonical-drill probe scope question)

---

### 9. M002 absorbs attack-chain integration (honorable mention HM1)

**Description**: Re-sequence pedagogy across milestones. M002's weekly receipt + carry-forward scope structurally maps to chain-of-play. Mechanics + variety as small post-M001 track; chain integration into M002.

**Warrant**: `reasoned:` M002's existing scope structurally maps to chain-of-play questions.

**Rationale**: Changes the post-M001 sequencing question entirely.

**Downsides**: Bigger structural change; conflicts with the smaller-first posture.

**Confidence**: 55%
**Complexity**: Medium-High
**Status**: Unexplored (parked for future consideration if probe data warrants larger-scope thinking)

---

### 10. Agent-choosing-shape is itself the asymmetry to flag (honorable mention HM2)

**Description**: Agent has been doing heavy lifting on decision shape throughout this conversation. That pattern matches trigger (e) agent-asymmetry in the adversarial memo.

**Warrant**: `direct:` Trigger (e) language: "repo / agent conversation is being used as a substitute for the app itself."

**Rationale**: Not at firing threshold but worth surfacing as a quality check.

**Downsides**: Meta-observation; may not change concrete next moves.

**Confidence**: 60%
**Complexity**: Low (just a flag, no artifact required)
**Status**: Unexplored (raised as quality check — partially mitigated by Idea 5's founder-authored decision shape)

---

## Founder Posture Commitment

**Date**: 2026-05-27
**Verbatim**: "well in that case note that I am explicitly agreeing that smaller is better for now, and we cna validate and build out more later on"
**Interpretation**: Smaller-first posture for the attack-track + M001 closure decision space. Prefer probes over commitments, reframes over new artifacts, collecting existing text over authoring new text, one-drill ships over multi-drill tracks. The "validate and build out more later" clause preserves expansion as the explicit pre-registered next move conditional on probe evidence.
**Scope**: Binds the immediate decision space (attack track, M001 closure, D132 ratification). Does NOT bind unrelated future decisions or future evidence-gated work.
**Read at re-eval**: The 2026-07-20 D130 re-eval should read this commitment as a dated founder-direct posture, not an agent default. If Idea 1 action stack ships and probe data warrants expansion, the "build out more later" clause is the pre-registered authorization to consider larger-scope moves (full attack track, omnibus packet, M002 chain-integration absorption) at that point.

---

## Rejection Summary

| # | Idea | Reason Rejected |
|---|------|-----------------|
| R1 | Ship Layer A this week (3 drills) | Pre-commits to three-layer scope before canonical-drill probe and source-laundering critique can be tested |
| R2 | Layer A ships before M001 closure | Subsumed by Idea 1 step 2 (F1 as closure artifact); F1 reframe is more elegant |
| R3 | Bridge drill (post-receive-to-set) | Specific drill choice; would be a candidate within Idea 1 step 3 |
| R4 | Drill IS the decision packet | Duplicates Idea 1 step 3 (probe IS evidence) |
| R5 | Ugly M001 close (Condition 1 fail-trending honest) | Subsumed by Idea 1 step 2 (F1 reframe) and Idea 1 step 1 (D132 handles Condition 1) |
| R6 | 3-state M001 closure | Subsumed by Idea 1 steps 1+2 |
| R7 | Clinical-trial protocol amendment lock M001 criteria | Strong analogy but Idea 6 omnibus packet captures the discipline more directly; Idea 1 action stack is smaller still |
| R8 | Architecture Certificate of Substantial Completion | Variant of clinical-trial analogy |
| R9 | Retire Tier 1b cap entirely | Premature; cap discipline served a real purpose; below ambition floor without separate evidence |
| R10 | Discharge kill-or-author contract on 6 reserved slots today | Conflates two questions; separate discipline decision |
| R11 | Pre-allocate 6 reserved Tier 1b slots as 2-2-2 attack split | Conflicts with path (b) "outside cap" framing; consumes cap that may have other triggers |
| R12 | Real-Game Gap Loop replacing Tier system | Bold reframe but high implementation burden + Tier system isn't broken |
| R13 | D148-as-reusable-template | Useful secondary effect of Idea 6; not a standalone move |
| R14 | D135 auto-promotion sub-clause | Procedural over-engineering; D135 reads work case-by-case |
| R15 | Wildfire incident-command transition briefing | Duplicates clinical-trial / certificate analogies |
| R16 | Postgres-style release-train discipline | Counter-argument to opening M001; subsumed by Idea 3 (decouple) |
| R17 | Expedition pre-set turn-back time | Sequencing-discipline; subsumed by Idea 3 |
| R18 | Beethoven late-style (sign closure first) | Variant of release-train discipline |
| R19 | Toyota andon-vs-SPC test | Strong analogy but duplicates packet-shape question |
| R20 | Seb-as-validation-subject compact | Nice-to-have but not a substantive shape decision |
| R21 | Chain/variety before mechanics | Subsumed by Idea 8 (source-laundering critique); same insight, sharper framing |
| R22 | A3 memo re-read as forcing function | Already covered by A3 contract |
| R23 | Cap-accounting ledger | Over-engineering; existing cap-status-data JSON serves the function |
| R24 | Cap expansion as only coherent shape (path c default) | Counter to local precedent; below ambition floor without separate evidence |
| R25 | Single-source Layer A authoring | Implementation detail within Idea 1 step 3 |
| R26 | Path (c) cap expansion default | Same as R24 |

---

## Handoff

Idea 1 (Action Stack 6 → 3 → 1) is the brainstorm seed. Loading `ce-brainstorm` next to define each step precisely — the brainstorm produces requirements at the granularity `ce-plan` can consume.
