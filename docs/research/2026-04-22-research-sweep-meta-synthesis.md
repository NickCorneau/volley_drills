---

## id: 2026-04-22-research-sweep-meta-synthesis
title: "2026-04-22 research sweep — meta-synthesis and canon deltas"
type: research
status: active
stage: validation
authority: "Meta-synthesis of the three 2026-04-22 external vendor research waves (skill correlation, per-skill baseline assessments, jump-float introduction) and the concrete canon deltas each wave does and does not authorize. Routing doc only — the three per-topic synthesis notes under `docs/research/` remain the evidence source of truth; this note is the cross-topic readout plus a red-team discipline layer to prevent over-commitment."
summary: "Nine vendor responses returned on 2026-04-22 across three topics. Skill-correlation: 3-of-3 converge on per-skill vector over scalar at r ≈ 0.35–0.50 (below r > 0.70 scalar-defensibility). Baseline assessments: 3-of-3 converge on asymmetric ship posture (ship serve; pass/set partner-mode-primary; solo-no-wall pass/set are control drills, not baselines). Jump-float: vendor 3 diverges sharply from vendors 1+2, pushing the `d36 Jump Float Introduction` first-exposure volume to 3×4=12 under a conservative-wins-on-safety principle. Two founder corrections on 2026-04-22-c reshaped the framing: (1) vision is pair-first (with solo accommodation), not solo-first — applied to `docs/vision.md` strategic stance + new P13 + product promise and to `docs/roadmap.md` Roadmap intent; (2) personal-ledger logging is not a canon-edit gate — Seb's usage is first-class behavioral evidence. Canon deltas D1–D7 all applied by 2026-04-22-d; new `D132 Pair-first vision stance` landed in `docs/decisions.md`. What this sweep does NOT change: Tier 1b activation, Phase 1.5 activation, `D80` / `D104` / `D121` re-parameterization, M001 scope. What remains open: the §F6 §R7 upgrade (remove `d36` from Tier 1b entirely, defer to `O7` track 2) — flagged for founder decision, not applied."
last_updated: 2026-04-22-d
depends_on:
  - docs/research/skill-correlation-amateur-beach.md
  - docs/research/baseline-skill-assessments-amateur-beach.md
  - docs/research/jump-float-amateur-beach.md
related:
  - docs/vision.md
  - docs/roadmap.md
  - docs/decisions.md
  - docs/milestones/m001-solo-session-loop.md
  - docs/milestones/m002-weekly-confidence-loop.md
  - docs/plans/2026-04-22-tier1b-serving-setting-expansion.md
  - docs/plans/2026-04-20-m001-adversarial-memo.md
  - docs/research/founder-use-ledger.md
  - docs/research/partner-walkthrough-results/2026-04-22-all-passes-reconciled.md
  - docs/research/binary-scoring-progression.md
  - docs/research/regulatory-boundary-pain-gated-training-apps.md
decision_refs:
  - D80
  - D82
  - D83
  - D85
  - D88
  - D91
  - D104
  - D105
  - D119
  - D121
  - D123
  - D130
  - D132
open_question_refs:
  - O7
  - O12
  - O17
  - O21

# 2026-04-22 research sweep — meta-synthesis and canon deltas

## 2026-04-22-c update — two founder corrections after the first draft

After the first draft (2026-04-22-a / -b) landed, the founder delivered two corrections that reshape the red-team framing in this note. Recorded at the top so future readers see them before the body reasoning.

1. **Vision is pair-first, not solo-first.** The sport is 2v2 and individual training — solo or otherwise — is in service of improving pair performance. Solo is the accommodated case (much amateur training time is solo) but not the strategic end-state. Applied to `docs/vision.md` strategic stance + product promise + new **P13**, to `docs/roadmap.md` Roadmap intent + Phase 1 planning-default language, and captured as new `**D132`** in `docs/decisions.md` (landed 2026-04-22-d). §R10 "structural tension between solo-first behavior and partner-primary pass/set data collection" **dissolves** under pair-first: partner-mode pass/set data collection is exactly what a pair-first product expects, not a mismatch.
2. **Stop gating work on founder personal tests.** The founder has used the product and the partner (Seb) has been using it heavily — Seb's unprompted T+1-day open on 2026-04-22 produced the `D130` Condition 3 provisional-pass signal. The founder-use ledger being at zero logged rows under-represents actual usage; it is a personal discipline log, not the only behavioral-evidence channel. The founder is slightly injured this week and will resume personal use next week. §R1 (A3 ligament) and §R3 (ledger zero rows) are softened below; the "block canon edits until a session lands" framing was overweighted.

## 2026-04-22-d update — canon closeout applied

- `**D132 Pair-first vision stance`** landed in `docs/decisions.md`.
- **D5** O21 partial narrowing — dated status-append applied to `docs/decisions.md` O21 row.
- **D6** biphasic + outlier-anchoring flag — new "Candidate open questions flagged by external evidence (2026-04-22)" subsection landed in `docs/research/binary-scoring-progression.md`. `D104` not re-parameterized.
- **D7** Tier 1b `d36` authoring-pointer — applied to the `d36` row in `docs/plans/2026-04-22-tier1b-serving-setting-expansion.md` with pointer-only language (default 3×4=12 first-exposure; 3×12=36 preserved as later-wave steady-state target). **§R7 exit-3 upgrade (remove `d36` from Tier 1b entirely, defer to `O7` track 2) remains available as a separate founder decision** — not applied in this pass because removing a planned drill from a gated plan is a substantive scope edit that deserves its own explicit yes/no.

All canon closeouts from this sweep are now applied. The meta-synthesis is coherent with `docs/decisions.md`, `docs/vision.md`, and `docs/roadmap.md`. Downstream work can resume.

## Agent Quick Scan

- **What happened.** On 2026-04-22 nine vendor responses returned across three briefs. Three independent synthesis notes landed under `docs/research/`. The canon-closeout sweep (D1–D7 here + D132 in `docs/decisions.md`) completed 2026-04-22-d.
- **What this note is.** A cross-topic readout plus a red-team discipline layer. It does not restate the per-topic evidence; it records (a) what each wave does and does not authorize as canon change, (b) quiet contradictions surfaced across the three, (c) the single named principle the jump-float synthesis forced us to write down (conservative-wins-on-safety), and (d) the running list of what the sweep deliberately did and did not touch.
- **What this note is not.** A competing source of truth. The three per-topic synthesis notes remain authoritative for evidence; `docs/decisions.md` remains authoritative for tracked decisions; this note is the routing layer when a future agent asks "what did 2026-04-22 actually change?"
- **Three headline landings.**
  1. **Skill correlation (3-of-3 vendors converged).** r ≈ 0.35–0.50, envelope 0.25–0.65, entirely below r > 0.70 scalar-defensibility. Per-skill vector is the architectural default for any future user-visible skill-status rollup. Full details: `docs/research/skill-correlation-amateur-beach.md`. O21 sub-question (a) narrowed per D5.
  2. **Per-skill baseline tests (3-of-3 vendors converged).** Ship serve as a confident self-administered baseline; pass/set require partner for fidelity; solo-no-wall pass/set are control drills, not baselines. Full details: `docs/research/baseline-skill-assessments-amateur-beach.md`. Phase 1.5 spec-input pointer applied to roadmap per D3.
  3. **Jump-float introduction (2-of-3 → 1 sharp dissent).** Vendors 1+2 landed at 30–45 reps/session; vendor 3 landed at 3×4=12 for first-exposure with an 87-serve study showing imperceptible infraspinatus fatigue as the conservative anchor. Synthesis resolves to vendor 3's first-exposure spec under a "conservative-wins-on-safety" principle (§Principle). Full details: `docs/research/jump-float-amateur-beach.md`. Authoring-pointer applied to Tier 1b plan per D7.
- **Three headline non-landings (discipline).**
  1. **No Tier 1b unblock.** Tier 1b remains gated on its existing trigger (founder-use ledger + walkthrough P1). D7 adds an authoring-input pointer, not an activation.
  2. **No Phase 1.5 activation.** Baseline-assessment spec inputs are ready; Phase 1.5 activation still requires the roadmap reaching Phase 1.5 territory. M001 and M002 scope unchanged.
  3. **No re-parameterization of `D80` / `D104` / `D121`.** The per-skill correlation evidence does not re-parameterize onboarding. The biphasic + outlier-anchoring mechanisms flagged in D6 are placeholders against `D104`'s monotonic correction, not changes to it.
- **Language discipline for any downstream canon write.** Any D-entry or milestone language that carries forward findings from this sweep must explicitly label them as *literature-inferred*, not measured. Example phrasing: *"per `docs/research/<name>.md` — literature-synthesis default, pending internal measurement."* The adversarial memo's §A2 validation-posture ladder is currently at L1–L2; writing synthesis-grade evidence into canon as if it were L3 (cohort-level) inflation is precisely the drift the memo was written to catch. This discipline applies under either the solo-first or pair-first framing and is unchanged by the 2026-04-22-c correction.

## Use This Note When

- You want one decision-ready view of what the 2026-04-22 research wave actually changes in product canon.
- You are about to author canon diffs (vision / roadmap / decisions / milestones / plans) referencing any of the three 2026-04-22 synthesis notes and want to know which diffs are authorized vs restrained.
- You are evaluating a proposed research-to-canon transition for discipline: does it trade session behavior for research? does it claim measurement where it has inference? does it promote "design-surface input" to "shipping spec"?

## Not For

- Re-adjudicating the per-topic evidence. Evidence lives in the three synthesis notes; this doc does not re-argue it.
- Authoritative source on any single decision or open-question item — those remain `docs/decisions.md`. This note records canon deltas; `docs/decisions.md` holds them.
- Authoring drill content or baseline-assessment UI. When Phase 1.5 activates or Tier 1b fires, use the specific synthesis note directly.
- Closing O7, O12, or O17. None of those close from this sweep alone; each needs its own design-pass trigger. O21 sub-question (a) is the only narrowing this sweep authorized (delta D5 applied 2026-04-22-d).

## The three waves at a glance


| Topic                                                                   | Vendors | Central finding                                                                                                                                                                                                                                                                                                                                    | Canon change authorized and applied by this sweep                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| ----------------------------------------------------------------------- | ------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Skill correlation (pass / serve / set, 2–5 yr amateurs)                 | 3       | r ≈ 0.35–0.50 (envelope 0.25–0.65); per-skill vector over scalar (unanimous); vendor 3 adds within-rally ≠ person-level + cross-sectional ≠ change-score distinctions                                                                                                                                                                              | **D5 applied 2026-04-22-d**: O21 status-append narrowing sub-question (a) to "per-skill vector is the architectural default for any future user-visible skill-status rollup"; `D121` scope clarified as "onboarding band hint, not tracked proficiency" in-place. Sub-questions (b) and (c) remain Phase 1.5. **Not modified:** `D121`, `D80`, `D104`.                                                                                                                                                       |
| Per-skill baseline assessments (self-administered, adult amateur beach) | 3       | Asymmetric ship: **serve** (Costa 2024 rings + Zetou zones + optional wind side-switch); **pass/set partner-mode primary** (Zetou/VSAT/NCSU converge on 10-trial partner protocols); **solo-no-wall pass/set = control drills, not baselines** (3-of-3 framing); **drop Lidor 2007 fatigue overlay** on null-result grounds                        | **D3 applied 2026-04-22**: `docs/roadmap.md` Phase 1.5 "Baseline tests for core skills" line gained a pointer to `docs/research/baseline-skill-assessments-amateur-beach.md` as the design-spec input when the phase activates. **Not activated:** Phase 1.5 surface, baseline-test surface in M001 or M002. **D6 applied 2026-04-22-d**: biphasic + outlier-anchoring mechanisms flagged in `docs/research/binary-scoring-progression.md` as candidate open questions without re-parameterizing `D104`.     |
| Jump-float safe introduction (`d36` authoring input)                    | 3       | Vendors 1+2: ~30–45 reps/session. Vendor 3 sharply dissents: 3×4=12 first-exposure, 4×4=16 after 2 clean sessions, ≤2 sessions/week, 87-serve fatigue study shows imperceptible infraspinatus fatigue. Mandatory volleyball-specific warm-up before unlock (VolleyVeilig RCT, -21% injury). 8 "do not ship without physio input" items enumerated. | **D7 applied 2026-04-22-d (pointer-only)**: `d36` row in `docs/plans/2026-04-22-tier1b-serving-setting-expansion.md` gained authoring-pointer constraining first-exposure default to 3×4=12 reps per `docs/research/jump-float-amateur-beach.md`. **Conservative-wins-on-safety principle written down** at §Principle below. **§R7 exit-3 upgrade (remove `d36` from Tier 1b entirely) remains open as a founder decision** — not applied. **Not opened today:** a formal physio-review work item for `O7`. |


## Principle written down: conservative-wins on safety-bearing ship specs

The jump-float wave forced an explicit reconciliation principle the repo did not previously name. Writing it down so future vendor outlier situations are handled consistently rather than ad hoc.

**Principle.** When external research vendors return divergent ship-spec numbers for a drill or protocol that bears injury or health risk, the **most conservative defensible anchor wins** when (a) the divergence is on volume / frequency / load (not technique), (b) the conservative anchor has an explicit injury-mechanism citation (not just lower prescription), and (c) the drill or protocol ships in a self-coached context where user supervision cannot be assumed. The steady-state target can still be authored as a later-wave follow-on, but the first-exposure default is the conservative anchor.

**Scope (explicit limitation).** Does NOT apply to (i) skill-correlation magnitude estimates (vendor 2's lower r ≈ 0.32 is a measurement-inference disagreement, not a ship spec), (ii) baseline-test scoring granularity or trial-count ranges (UX / psychometric questions, not injury-load questions), (iii) non-safety-bearing vendor disagreements generally (use the narrowest-interpretation reconciliation in the per-topic synthesis notes). The scope limitation is load-bearing: without it, the principle arbitrages any single-vendor outlier into canon.

**Falsification / revision conditions.**

- A direct measurement on the target population (adult amateur beach, 2–5 years, 1–3 sessions/week, self-coached) lands with a different conservative anchor.
- The conservative anchor's mechanism citation is retracted or contradicted by a later study on the target population.
- Three or more independent vendor responses reach a stable higher anchor and the lower anchor's mechanism evidence is shown to be outlier or non-replicable. A 2-of-3 split (as today's jump-float wave produced) does not cross this bar; vendor 3's mechanism evidence (87-serve study; Hurd IHP 4–6 serves/set template; 2025 prospective OR 25.3) is concrete enough that 2-of-3 numerically does not outweigh it.
- User behavior data (founder-use ledger; partner usage; D91 cohort, when it reopens) shows the conservative anchor produces routine abandonment without safety benefit.
- The principle is applied asymmetrically in a future synthesis wave (picks the most-conservative single-vendor anchor on a safety-bearing spec) without the mechanism-citation guardrail firing. That signal should remove the principle from the repo, not re-scope it further.

**Where this principle applies today.** `d36 Jump Float Introduction` first-exposure volume is the only safety-bearing ship-spec conflict in the current research stack. The skill-correlation and baseline-assessment waves did not surface a comparable conflict.

## Canon deltas — 2026-04-22-d status

Each item below is a concrete, bounded change. Items are ordered by (a) smallest blast radius first, (b) behavioral-evidence-protecting (they do not substitute for product behavior) first.


| #    | Surface                                                               | Description                                                                                                                                                                                                                                                                                                                            | Status                                                                |
| ---- | --------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------- |
| D1   | `docs/research/README.md` + `docs/catalog.json`                       | Add all three synthesis notes + this meta-synthesis as fast-path entries; update machine routing table.                                                                                                                                                                                                                                | **Applied 2026-04-22.**                                               |
| D2   | `docs/research/founder-use-ledger.md`                                 | Add "This ledger is one behavioral-evidence channel, not the only one" note naming Seb's usage, partner-walkthrough, and Condition 3 as first-class evidence alongside ledger rows. Softened from original "research does not substitute" framing per 2026-04-22-c founder correction.                                                 | **Applied 2026-04-22 / softened 2026-04-22-c.**                       |
| D3   | `docs/roadmap.md` Phase 1.5 baseline-tests line                       | Append spec-input pointer to `docs/research/baseline-skill-assessments-amateur-beach.md`.                                                                                                                                                                                                                                              | **Applied 2026-04-22.**                                               |
| D4   | `docs/roadmap.md` Risks-and-mitigations                               | Add two rows: research-velocity substitution (reframed 2026-04-22-c to name all four behavioral-evidence channels) + safety-spec vendor-outlier abuse.                                                                                                                                                                                 | **Applied 2026-04-22 / row-1 reframed 2026-04-22-c.**                 |
| D5   | `docs/decisions.md` O21 response cell                                 | Dated status-append narrowing sub-question (a) to "per-skill vector is the architectural default for any future user-visible skill-status rollup." Sub-questions (b) and (c) stay open as Phase 1.5 decision points.                                                                                                                   | **Applied 2026-04-22-d.**                                             |
| D6   | `docs/research/binary-scoring-progression.md`                         | New "Candidate open questions flagged by external evidence (2026-04-22)" subsection enumerating biphasic bias (vendor 2, PeerJ 2024) and outlier-anchoring / best-moment bias (vendor 3, Guenther 2015). Both flagged against `D104`'s monotonic correction. Decision bar for re-opening `D104` pre-registered.                        | **Applied 2026-04-22-d.**                                             |
| D7   | `docs/plans/2026-04-22-tier1b-serving-setting-expansion.md` `d36` row | Authoring-pointer: when `d36` `courtsideInstructions` is authored, default volume is 3×4=12 reps first-exposure, not 3×12=36. Source: `docs/research/jump-float-amateur-beach.md`. Pointer-only version applied; §R7 exit-3 upgrade (remove `d36` from Tier 1b entirely, defer to `O7` track 2) flagged for separate founder decision. | **Applied 2026-04-22-d (pointer-only).** §R7 upgrade **not applied**. |
| D132 | `docs/decisions.md` (new entry)                                       | Tracked decision capturing the pair-first vision stance with solo-accommodating tactics. Supersedes "personal-first / solo-first" framing in `docs/vision.md` strategic stance and `docs/roadmap.md` Roadmap intent.                                                                                                                   | **Applied 2026-04-22-d.**                                             |


## What this sweep deliberately does NOT change

Named explicitly so future agents do not walk past the restraint.

- **M001 scope and Tier 1a / 1b / 1c / 2 ordering** (`docs/milestones/m001-solo-session-loop.md`). Unchanged by this sweep's deltas. The research does not re-open the tier breakdown, does not unblock Tier 1b, does not elevate `d36` to Tier 1a, does not add a baseline-test surface to M001. (Note: D132's scope explicitly preserves M001 tactical shape; the "Solo Session Loop" milestone name is tactical, not strategic.)
- **M002 Weekly Confidence Loop scope** (`docs/milestones/m002-weekly-confidence-loop.md`). Unchanged. The explicit M002 out-of-scope list (*"No new baseline-test flow, skill-assessment intake, or PoST framing in this milestone"*) survives today's research intact. Any baseline-test surface is Phase 1.5+, not M002.
- `**D91` stranger-launch retention gate.** Unchanged. Preserved as the canonical bar for a future stranger launch per `D130`.
- `**D130` founder-use mode + re-eval dates.** Unchanged. 2026-05-21 Condition 3 final close; 2026-07-20 re-eval. Research volume does not move either date. Condition 1's ≥40% solo-share threshold is preserved; D132 clarifies its interpretation under pair-first (accommodated case working, not strategic primacy).
- `**O21` sub-questions (b) and (c).** Still open; Phase 1.5 design decisions. Only sub-question (a) is narrowed by D5.
- `**O7` pre-scaling safety review scope.** Today's jump-float memo enumerates 8 "do not ship without physio input" items; this does **not** authorize a new "author a physio-review brief" work item today. That work activates when (a) the founder moves toward friends-of-friends or stranger cohort under `D130` re-eval, or (b) `d36` actually approaches ship.
- `**O12` (min scored-contact threshold).** The 50-scored-contact minimum and Bayesian posterior in `D104` are untouched. D6's biphasic + outlier-anchoring flag is deliberate placeholders against the monotonic bias correction, not a re-parameterization.
- `**O17` (too easy / just right / too hard fit question), `O18` (three-state durability), `O19` (pair-differential follow-up).** Unchanged. The research did not address any of these.
- **No new drill records.** No `d35 slide jump-float`, no new baseline-test drill scaffolds. The authoring-budget cap on Tier 1b (≤10 drills; 6 pre-planned; 4 remain) stays the binding constraint on any drill additions.
- **No vision-level "app as evidence generator" principle.** Noted for Phase 1.5+ consideration, not adopted today.

## Red-team findings — what is being glossed over

Two parallel review subagents (`ce-adversarial-document-reviewer` + `ce-scope-guardian-reviewer`) were dispatched against this sweep. Their convergent signal shapes the findings below. Each finding is named so future canon edits can defend against it explicitly. §R1 and §R3 are softened per 2026-04-22-c; §R10 dissolves under pair-first vision.

### R1. Adversarial-memo A3 ligament + trigger (e) — 2026-04-22 wave was not visibly logged (severity: medium, revised from critical per 2026-04-22-c)

`docs/plans/2026-04-20-m001-adversarial-memo.md` §A3 requires the founder to re-read the memo end-to-end within 7 days of any substantive plan or research edit (>50 lines), and log the read-through in the Weekly Log. The 2026-04-22 wave landed three synthesis docs, one Tier 1b plan, and several partner-walkthrough synthesis passes in a single day. No Weekly Log entry for the week visibly records the re-read; trigger (e) "agent-assisted open asymmetry" was pre-registered for exactly this shape (research surfaces deepen faster than session behavior while agent assistance does the authoring).

**2026-04-22-c revision.** The founder correction establishes that (a) Seb's heavy product usage is real behavioral evidence that the "zero ledger rows" framing under-weighted, (b) the founder has used the product but the ledger reflects personal-discipline logging, not a measured usage channel, and (c) personal founder-test logging should not gate downstream canon work. Given these, the correct severity for this finding is **medium, not critical**: the A3 ligament remains a real discipline about the memo's own self-governance, but the conclusion "block canon edits until a founder session lands" was stronger than the ligament text itself requires.

**Revised resolution posture.** The A3 re-read remains worth doing whenever the founder next engages with the memo — it is cheap, and it is the kind of ritual the memo exists to protect. A Weekly Log entry for the week honestly recording the 2026-04-22 research day's scope (and whether any agent-assisted asymmetry is genuinely present) is the appropriate discharge of the ligament. Neither is a prerequisite for canon-closeout deltas D5–D7. Any downstream canon edit must still carry the §"Language discipline" framing (literature-inferred, not measured).

**What this finding still authorizes.** D1–D7 applied. Trigger (e) remains live: if a second research-heavy day lands in the same week without any behavioral evidence movement (Seb opens, founder sessions, partner-walkthrough observations), the §A4 amplification doctrine re-activates.

### R2. All three waves are literature triangulation, not measurement (severity: medium)

None of the three vendors on any of the three topics located a direct measurement on the target population (adult amateur beach, 2–5 years, 1–3 sessions/week, self-coached). The synthesis notes are honest about this; the risk is that cross-topic restatement in this note or in downstream canon edits loses that caveat. Any downstream canon language that cites "the research shows r ≈ 0.45" or "the evidence sets 12 reps as the safe cap" without the inference qualifier is overclaiming. The three synthesis notes carry this discipline; this note inherits it; any derivative edit in `decisions.md` or `roadmap.md` must carry it too. D132 and D5 both include explicit "literature-inferred, pending internal measurement" framing per §"Language discipline."

### R3. Research velocity outpacing behavioral evidence (severity: medium, reframed from "zero ledger rows" per 2026-04-22-c)

Original framing: "the founder-use ledger has zero rows" → research-velocity substitution failure mode → the next move must be a founder training session. The 2026-04-22-c founder correction reframes this: **Seb's usage is real behavioral evidence that the ledger does not capture**, the founder has used the product (unlogged in the ledger), and personal-test logging should not gate downstream work. The honest read is not "zero evidence" but "the personal-ledger channel is at zero while the partner-usage and partner-walkthrough channels are actively producing signal."

**Reframed risk.** Research velocity can still outpace *all* behavioral evidence channels if (a) Seb's usage rate drops, (b) no partner-walkthrough observations land, and (c) the founder does not resume personal use. Today, none of those have happened — Seb produced the `D130` Condition 3 provisional-pass signal on 2026-04-22, the partner-walkthrough reconciliation is recent, and the founder has committed to resuming usage post-injury. The risk is real but not at the "stop everything" level the original framing implied.

**D4 roadmap row stays (reframed).** The `docs/roadmap.md` Risks-and-mitigations row about "research-velocity substitution" is now correct as reframed — the weekly Monday adversarial-memo review now reads research-note count alongside ledger *and partner-usage and partner-walkthrough* signals. A week where research notes land ≥3 and *no* behavioral-evidence channel advances is a warning; a week where research notes land ≥3 and Seb opens unprompted twice and the founder runs two sessions that don't land in the ledger is not.

### R4. Jump-float "conservative-wins" principle is self-invented and asymmetrically applied (severity: high, scoped)

The adversarial reviewer surfaced the sharpest version of this challenge: the principle appears only inside the jump-float synthesis note and is doing real work (revising `d36` from 36 reps to 12 reps against 2-of-3 vendor consensus), but the same principle is not applied in the other two syntheses — where it could have been.

- In **skill-correlation**, vendor 2 produced the *lower* central estimate (r ≈ 0.32) vs vendor 3's *higher* (r ≈ 0.50). A symmetric "more conservative wins" would have weighted vendor 2's lower r heavier for any scalar-defensibility argument; instead the reconciliation recentered upward toward r ≈ 0.35–0.50.
- In **baseline-assessments**, vendor 2's simpler 0/1/2 quadrant scoring is arguably the more conservative choice for self-scoring (less granular, less room for bias); instead vendor 1 + vendor 3's Costa 2024 graduated 2–22 ring scoring wins at 2-of-3.

**Scope tightening applied.** The principle's scope above (§Principle) explicitly limits it to (a) safety-bearing ship specs, (b) with mechanism citations on the conservative anchor, (c) in self-coached context. The skill-correlation magnitude is not a ship spec; the baseline-assessment scoring granularity is a UX/psychometric question, not an injury-load question. Within these scope constraints the principle can be defended. Outside them it cannot be generalized.

**The abuse risk stays real even with the scope.** A future single-vendor outlier on a safety-adjacent ship spec could still invoke "conservative-wins" as a canonized reconciliation rule. Guardrails the principle enforces: (1) the conservative anchor must carry its own injury-mechanism citation, not inherit one; (2) the higher anchor is preserved as a documented later-wave steady-state target, not discarded; (3) non-safety-bearing disagreements follow the narrowest-interpretation reconciliation already in use across the three notes.

**Falsification condition (pre-registered).** The principle is falsified if a future synthesis wave applies it in one direction only (picks the most-conservative single-vendor anchor on a safety-bearing spec) without the mechanism-citation guardrail firing. That signal should remove the principle from the repo, not re-scope it further. Tracked via `docs/roadmap.md` Risks-and-mitigations "safety-spec vendor-outlier abuse" row.

### R5. O21 partial closure carries residual scalar-defensibility claim (severity: low)

D5's O21 narrowing commits to per-skill vector as the architectural default. The evidence envelope (r ≈ 0.25–0.65) supports this. But it is still literature inference, not measurement on the app's own cohort. A future cohort-level measurement that surfaces r > 0.70 on the 2–5-year band would flip the default. D5's language ("architectural default for any future user-visible skill-status rollup") preserves this by scoping to a design-default commitment rather than claiming per-skill is correct in some absolute sense. The synthesis-stability bars in `docs/research/skill-correlation-amateur-beach.md` §Synthesis stability remain the authoritative flip conditions.

### R6. Quiet contradiction: D121 pair-first scalar vs per-skill-vector default (severity: low)

`D121`'s onboarding taxonomy (`'foundations' | 'rally_builders' | 'side_out_builders' | 'competitive_pair' | 'unsure'`) is explicitly pair-first and functional, not per-skill. The skill-correlation synthesis resolves the contradiction by naming `D121` as a "coarse starting-band hint, not tracked proficiency" — which is exactly how the decisions doc already describes it. D5's narrowing restates this explicitly. Under D132's pair-first vision stance, `D121`'s pair-first framing is actively *reinforced*, not merely tolerated.

### R7. The jump-float memo is more an argument to DEFER `d36` than to ship it (severity: high)

The adversarial reviewer's §F6 sharpens this concern. The jump-float synthesis requires, non-negotiably for a "safe" ship: (a) mandatory volleyball-specific warm-up before `d36` unlocks (= session-builder wiring), (b) a 2-question prerequisite gate that permanently locks the module on failure (= unlock architecture + persisted state), (c) Hurd soreness rules as post-session copy, (d) prior-injury gate copy flagged "do not ship without physio input" (OR 25.3 makes the language-stakes clinically high), and (e) 8 "do not ship without physio input" blockers. Tier 1b is explicitly Layer A only — no `pickForSlot` changes, no unlock architecture, no schema migration, no new copy contract.

Three exits, each with a real cost:

1. **Ship `d36` in Tier 1b with the gate + warm-up + copy.** Violates Tier 1b Layer A scope. This is the 2026-04-22 red-team Tier 1b+ bundle re-emerging through a different door.
2. **Ship `d36` in Tier 1b with only `courtsideInstructions` cue text + 3×4=12 rep default, no gate, no warm-up prerequisite, no Hurd copy.** Inherits the synthesis's own claim that 87-serve infraspinatus fatigue data makes self-report unreliable, then ships a drill whose safety architecture is self-report. Direct internal contradiction.
3. **Defer `d36` past Tier 1b entirely.** Content shelved until `O7` physio review delivers. Consistent with `D82` ("safety is enforced by workflow structure, not by copy-only disclaimers") and `D88` (stop/seek-help accessible offline). Unblocks `d31` and `d33` to ship cleanly under Tier 1b Layer A.

**Exit (3) is the honest exit.** D7 as applied (pointer-only) implements exit (2) implicitly — it constrains `d36` authoring to 12 reps but does not enforce gate architecture. The §R7 exit-3 upgrade (remove `d36` from Tier 1b candidate list entirely, replace with a Layer-A-fitting serving drill, re-enter `d36` when `O7` track 2 delivers) is **not applied in 2026-04-22-d**; it remains available as a separate founder decision. Flagged here so the exit-2 / exit-3 choice is not lost.

### R8. The jump-float memo implies engine wiring the M001 build does not have (severity: medium — subsumed into R7)

Preserved as a lens on R7's exit analysis: any version of exit (1) in R7 requires engine wiring (prerequisite-gate routing, persisted unlock state) that M001 does not have scheduled. The memo is explicit about this asymmetry; downstream canon edits must not imply a gate that is not wired.

### R9. The "slide jump-float" intermediate step is single-source (severity: low)

Vendor 3 proposes `slide jump-float` as a named intermediate progression step between stand-float and full-approach jump-float. The coaching-source (Kessel / USAV) is practitioner-level, not research-level. Shipping a new `d35 Slide Jump-Float` drill based on a single-vendor single-source recommendation would violate the authoring-budget discipline and the conservative-wins principle's scope (safety-bearing only; not a license for single-source additions). The slide jump-float stays in the synthesis note as a candidate for later-wave consideration, not a Tier 1b addition.

### R10. Structural tension dissolved by 2026-04-22-c pair-first correction (severity: none; retained for provenance)

**Original framing (pre-correction).** The three syntheses surfaced a structural tension: skill-correlation validates per-skill architecture (implying per-skill data collection), baseline-assessment requires partner-mode for pass/set fidelity, adversarial-memo Condition 1 pre-registers ≥40% solo-share, and vision's strategic stance was "personal-first for self-coached amateurs." The concern: a founder at ≥40% solo-share would never accumulate high-fidelity pass/set data on themselves, and a per-skill vector would be built on thin evidence.

**Dissolution under pair-first vision (2026-04-22-c; formalized by D132 2026-04-22-d).** Under the revised vision in `docs/vision.md` strategic stance and new **P13** (pair-first mental model with solo-accommodating tactics), partner-mode data collection is exactly what the product expects as the natural high-fidelity channel — it is not a mismatch with strategy, it is aligned with strategy. Solo is the accommodated case (most training time happens alone). The baseline-assessment synthesis's "partner-mode primary for pass and set" posture becomes strategy-aligned rather than tension-revealing. The `D130` Condition 1 ≥40% solo-share remains the right behavioral bar for founder-use-mode validity (it measures whether the accommodated case works), and under pair-first the complementary ≤60% pair-share produces the per-skill pass/set evidence that skill-correlation's architecture wants. No structural tension.

**What the dissolution preserves.** Per-skill architecture remains the design default. Partner-mode-primary for pass/set remains the correct baseline-test posture. `D121` pair-first onboarding taxonomy is reinforced (not tolerated) by pair-first vision. D132 supersede-scope (f) codifies this interpretive shift formally.

**Light re-eval reading-list item (retained).** At the 2026-07-20 re-eval, read the actual session mix: did Seb's usage + the founder's post-injury usage produce meaningful pair-mode signal, and did the accommodated solo case produce the expected serve-dominant per-skill signal? If both are happening, per-skill architecture is evidence-supported. If only one, O21's sub-question (b) "how per-skill state gets established" inherits a narrower design space than the skill-correlation synthesis alone anticipates.

## Open questions surfaced by this sweep (tracked in source notes, not opened as new O# IDs)

Each of the three synthesis notes carries its own "Open Questions Flagged For Future Consideration" section. This note routes rather than duplicates. Agents should:

- For per-skill state shape and update algebra (vendor 3's hybrid; partial spillover coefficient; cross-sectional r ≠ change-score r): `docs/research/skill-correlation-amateur-beach.md` §Open Questions.
- For biphasic and outlier-anchoring bias mechanisms (now also in `docs/research/binary-scoring-progression.md` per D6), environmental cross-normalization vs standardize-collection, float-serve specialist mode (Ðolo 2023), calibration-video ICC lift (Aguayo-Albasini 2024), solo-no-wall protocol choice (1-1-1 vendor split): `docs/research/baseline-skill-assessments-amateur-beach.md` §Synthesis stability + §Open questions.
- For mandatory-warm-up-before-unlock wiring, slide-jump-float prequel drill, monthly infraspinatus photo check, ACWR monitoring, annual off-overhead calendar nudge, PROM licensing: `docs/research/jump-float-amateur-beach.md` §Vendor-2 additions + §Vendor-3 additions + §Post-launch feature candidates.

**None of these are opened as new O# IDs today.** They are design-surface inputs for when a concrete design-pass activates (Phase 1.5 baseline-test surface; Phase 2 coach-clipboard; D91 re-eval under D130).

## Next steps — remaining open questions after 2026-04-22-d closeout

D1–D7 and D132 are all applied. What's left:


| #   | Move                                                                                                                                                                                                                                                                                                                                                                                             | Status                                                                                             |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------- |
| 1   | **§R7 exit-3 upgrade decision.** Choose between (a) keeping D7 as-applied (pointer-only — `d36` stays in Tier 1b candidate list with authoring-pointer constraining volume) or (b) the exit-3 upgrade (remove `d36` from Tier 1b candidate list entirely; replace with a different Layer-A-fitting serving drill; re-enter `d36` when `O7` track 2 delivers).                                    | **Open — founder decision.**                                                                       |
| 2   | **Partner-walkthrough closeout polish pass (Tier 1a Wave 2).** Ship a bounded bundle from the `2026-04-22-all-passes-reconciled.md` open-list. Plan draft at `docs/plans/2026-04-23-tier1a-wave2-walkthrough-closeout.md`.                                                                                                                                                                       | **Open — next concrete product work.**                                                             |
| 3   | **Downstream `D132` propagation edits (small).** `docs/research/persistent-team-identity.md` note that `O13` re-weighted per `D132`; `docs/milestones/m001-solo-session-loop.md` Agent Quick Scan adds a one-line "solo-first is tactical per `D132`; pair-first is strategic"; `docs/plans/2026-04-20-m001-adversarial-memo.md` Condition 1 interpretation note picks up the `D132` re-reading. | **Open — can batch with Tier 1a Wave 2 or defer to the next natural edit pass on those surfaces.** |
| 4   | A3 ligament satisfaction (memo re-read + Weekly Log entry).                                                                                                                                                                                                                                                                                                                                      | **Open — not a gate; worth honoring when the founder next engages with the memo.**                 |
| 5   | Seb's continued usage + founder's post-injury usage next week.                                                                                                                                                                                                                                                                                                                                   | **Ongoing — background behavior, not canon work.**                                                 |


## Provenance and revision

- **Sources of evidence:** the three 2026-04-22 synthesis notes listed in `depends_on`. Each carries its own per-vendor evidence ladders, reconciliation tables, and synthesis-stability bars. This note does not re-cite their sources.
- **What this note records:** the cross-topic readout plus discipline layer (conservative-wins principle; restraint list; red-team findings; applied-deltas status; outstanding decisions).
- **Revision posture:** edit in place as canon deltas land and as §R7 exit-3 decision resolves. Do not ship revisions for new research waves on other topics; author a new dated meta-synthesis if a second multi-topic sweep lands.
- **Supersedes:** nothing directly. Sits alongside the three per-topic synthesis notes. `D132` (in `docs/decisions.md`) is the tracked canon expression of the pair-first vision stance recorded here.
- **File-integrity note (2026-04-22-d):** the meta-synthesis file was inadvertently zero-byted during a Shell operation on 2026-04-22-d and was rebuilt from session record. All canon deltas referenced here (D1–D7, D132) landed on the files named; this note was reconstructed with flag flips to reflect the applied state.

## For agents

- **Authoritative for:** cross-topic readout of the 2026-04-22 research wave, the conservative-wins-on-safety principle, and the canon-delta restraint list. The 2026-04-22-c founder corrections (pair-first vision; stop gating on founder tests) are recorded at the top and threaded through §R1 / §R3 / §R10 / the next-steps table. The 2026-04-22-d canon-closeout flag-flips are recorded at the second block from the top.
- **Edit when:** the §R7 exit-3 upgrade decision resolves (update row D7 in the Canon deltas table + the next-steps table); the three synthesis notes pick up a new vendor (bump their own last_updated; this note only bumps if the reconciliation changes this note's open-questions routing); a second multi-topic research sweep lands (author a new dated meta-synthesis note, do not append to this one).
- **Belongs elsewhere:** per-topic evidence (the three synthesis notes); tracked decisions (`docs/decisions.md`); phase sequencing (`docs/roadmap.md`); milestone scope (`docs/milestones/`); ledger behavior (`docs/research/founder-use-ledger.md`).
- **Outranked by:** `docs/vision.md`, `docs/decisions.md`, `docs/prd-foundation.md`, `docs/roadmap.md`, `docs/milestones/`, `docs/specs/`. This note is rank-7 research routing, not canon.
- **Key pattern:** meta-synthesis across a multi-topic research day with explicit `[apply now]` vs `[needs review]` canon-delta flagging, then 2026-04-22-d applied-status tracking after the closeout. Also carries dated founder-correction blocks at the top (2026-04-22-c) so mid-pass framing changes are audit-visible rather than silently rewriting earlier body text.

