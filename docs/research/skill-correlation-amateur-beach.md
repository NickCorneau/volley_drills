---
id: skill-correlation-amateur-beach
title: Cross-Skill Correlation In Adult Recreational Beach Volleyball
status: draft
stage: validation
type: research
authority: "Decision-relevant distillation of external vendor evidence on how correlated passing, serving, and setting proficiency are in adult recreational beach players (2–5 years experience, 1–3 sessions/week, self-coached). Frames the per-skill-vector vs single-scalar architectural choice for any future user-visible 'skill status' surface. Not authoritative for onboarding-band taxonomy (D121) or for per-drill progression (D80, D104); those remain governed by their own decisions and research notes."
summary: "Synthesis of external vendor evidence on whether passing, setting, and serving are correlated enough in adult recreational beach players (2–5 years, 1–3 sessions/week, self-coached) to justify a single-scalar skill model. Three vendors folded in (all received 2026-04-22). None has a direct measurement; all three place the cross-skill r well below the r > 0.70 scalar-defensibility threshold. Vendor 1 centers r ≈ 0.45 (range 0.30–0.65); vendor 2 centers r ≈ 0.32 (range 0.25–0.40); vendor 3 centers r ≈ 0.50 (range 0.35–0.65). Reconciled working estimate: r ≈ 0.35–0.50 (median central ≈ 0.45, mean ≈ 0.42) with plausible envelope r ≈ 0.25–0.65. Three-vendor unanimity on the storage recommendation: store per-skill, project to scalar on demand. Vendor 3 adds (a) a hybrid refinement — per-skill vector + general-factor onboarding prior + partial spillover + UI-only scalar projection — compatible with V1/V2 and structurally aligned with how `D121` already operates; (b) direct developmental-rate asymmetry evidence (Gabbett 2006, +76% spike / +335% set / +40% pass / +15% serve (ns) over 8 weeks); (c) the **within-rally coupling ≠ person-level correlation** distinction; (d) the **cross-sectional r ≠ change-score r** distinction. Vendor 3 triggered the pre-registered Bar 2 (inside-envelope recenter + new evidence types) without crossing Bar 1 (scalar-defensibility). Validates existing per-skill drill / chain / progression-gate architecture; sets the design default for any future user-visible 'skill status' rollup."
last_updated: 2026-04-22-d
depends_on:
  - docs/research/briefs/README.md
  - docs/research/briefs/responses/2026-04-22-skill-correlation-vendor-1.md
  - docs/research/briefs/responses/2026-04-22-skill-correlation-vendor-2.md
  - docs/research/briefs/responses/2026-04-22-skill-correlation-vendor-3.md
related:
  - docs/research/binary-scoring-progression.md
  - docs/research/fivb-coaches-manual-crosscheck.md
  - docs/research/vdm-development-matrix-takeaways.md
  - docs/research/ltd3-development-matrix-synthesis.md
  - docs/research/prescriptive-default-bounded-flex.md
  - docs/research/pre-telemetry-validation-protocol.md
decision_refs:
  - D80
  - D104
  - D121
---

# Cross-Skill Correlation In Adult Recreational Beach Volleyball

## Agent Quick Scan

- **Bottom line.** Three independent external vendors, each triangulating from adjacent literature (none has a direct measurement on the target cohort), converge on the same architectural recommendation: **store per-skill (pass / set / serve), project to a scalar only on demand**. The reconciled working estimate is **r ≈ 0.35–0.50 (low-to-moderate confidence), with a plausible envelope of r ≈ 0.25–0.65** — entirely below the ~0.70 threshold where a single-scalar model becomes defensible. Direction is **very strong** (three-vendor unanimity); magnitude is **weak** (all three estimates are inferences, spread across a range of ~0.2 r).
- **Per-vendor headline estimates.** Vendor 1: r ≈ 0.45 (range 0.30–0.65, low-to-moderate confidence). Vendor 2: r ≈ 0.32 (range 0.25–0.40, stated 85 % confidence). Vendor 3: r ≈ 0.50 (range 0.35–0.65, low-to-moderate confidence). None is a measurement; all three are inferences. Median central ≈ 0.45.
- **What it changes in this repo.** Validates the existing per-skill posture of the drill and chain layer (drills carry `skillFocus`; chains are per-skill; progression gates are per-chain per `D80` / `D104`). Does **not** change `D121` — vendor 3 *explicitly* describes the structurally identical "shared onboarding prior from years played, self-rating, recent frequency" as the correct initialization mechanism, which strengthens the current `D121` posture. Sets a design default: if a user-visible "skill status" rollup (review, summary, home state, ladder, ranker) is ever surfaced, **default to per-skill display with explicit scalar projection**, not a single composite.
- **What vendor 3 adds that vendors 1 and 2 did not.** (a) A hybrid architectural refinement — per-skill vector **plus a lightweight general factor, partial spillover in update logic, and UI-level scalar projection**; compatible with (not contradictory to) V1/V2. (b) Direct developmental-rate asymmetry data (Gabbett 2006, N=26 juniors, 8 weeks: +76% spike / +335% set / +40% pass / +15% serve (ns)) — the cleanest published per-skill growth-rate asymmetry anyone has produced. (c) Within-rally coupling data from elite beach (Palao 2019, N=5,161 receptions) with an explicit **within-rally ≠ person-level** conceptual separation. (d) The **cross-sectional r ≠ change-score r** distinction — a player can have correlated skill *levels* while having weakly correlated skill *growth rates* over time.
- **What would flip the recommendation.** See [Synthesis stability](#synthesis-stability-what-would-change-this) — pre-registered so future vendor responses or new evidence can be evaluated against an explicit bar. Vendor 3 triggered **Bar 2** (inside-envelope recenter + new evidence types) per the pre-registered protocol; it did **not** cross **Bar 1** (scalar-defensibility). No repo-facing reversal.
- **Scope of this note.** Vendor 1, vendor 2, and vendor 3 all folded in (all received 2026-04-22). 3-of-N state. The structure (per-vendor evidence ladders, Reconciliation with a Repo-facing column, Synthesis-stability bars) accommodates additional responses without rewriting. If no further vendor arrives, this note stands as the final synthesis at the 3-of-N state.

## Use This Note When

- deciding whether a future user-visible rollup of per-skill state (e.g., a "Skill Status" panel, a weekly summary digest, or a single ladder/rank number) should be a single scalar or a per-skill breakdown
- evaluating architectural proposals that would collapse per-skill state into a single number at the storage layer
- reasoning about how much information a single onboarding band (`D121`) captures relative to per-skill state
- designing a measurement protocol (e.g., a `pre-telemetry-validation-protocol`-style cohort study) that could replace this inference with direct evidence

## Not For

- replacing `D121` onboarding-band taxonomy — that decision is about a coarse starting-band pre-onboarding hint, not about tracked proficiency state
- replacing `D80` / `D104` progression-gate math — that is governed by `docs/research/binary-scoring-progression.md`
- authoring new drill content or chain structure — use `docs/research/fivb-coaches-manual-crosscheck.md`, `docs/research/vdm-development-matrix-takeaways.md`, and `docs/research/ltd3-development-matrix-synthesis.md`
- elite / competitive-pair users — the vendor 1 evidence applies explicitly to the novice-to-intermediate band; elite convergence may push cross-skill r > 0.7 and make a scalar defensible, but that is not the target population

## Executive conclusion

Three independent vendor triangulations, arriving at overlapping but non-identical magnitude estimates, converge on the same directional recommendation. None of the three vendors located a direct Pearson r measurement in the target population; all three build inference from adjacent literature and theory.

- **Vendor 1** lands at r ≈ 0.45 (90% plausible range 0.30–0.65, low-to-moderate confidence).
- **Vendor 2** lands at r ≈ 0.32 (range 0.25–0.40, stated 85% confidence).
- **Vendor 3** lands at r ≈ 0.50 (range 0.35–0.65, low-to-moderate confidence).
- **Union range (r ≈ 0.25–0.65)** sits entirely below the r > 0.70 zone where a single-scalar model becomes architecturally defensible. **Median central ≈ 0.45, mean central ≈ 0.42.** This is the decision-relevant finding: the recommendation is robust to the magnitude disagreement across three independent analyses.

Seven independent arrows, each cited by at least one vendor and most by at least two, point the same direction:

1. **Motor-learning theory** (Schmidt, Magill, Wulf, Ericsson, Bernstein, Newell; Lee, Young; Henry; specificity of learning; generalized motor programs): forearm passing, overhead hand-setting, and overhead striking are distinct motor programs with distinct control primitives. Transfer is low at the motor-execution level, moderate at the shared perceptual-cognitive level. Vendor 2 strengthens this with contextual-interference framing and the "especial skill effect" — isolated massed practice (e.g., standing float serves against a wall) produces a highly parameterized motor primitive that does not transfer to other GMPs. Vendor 3 adds direct experimental reinforcement via the contextual-interference volleyball literature (French/Rink/Werner 1990 N=139 HS; Jones & French 2007 N=60 amateur male uni; Kalkhoran & Shariati 2012) — researchers routinely treat pass / set / serve as separate skills for practice-schedule experiments.
2. **Factor-analytic evidence** in volleyball (Kundu 2020 juniors; Katić 2006 juniors; Cothran 1992 adult amateurs; vendor 2 adds ESEM/CFA literature and block-jump-height factor analyses): repeatedly fails to retain a dominant single "general volleyball ability" factor. Cothran: *"no one single dominant test factor."* Vendor 3 adds a meta-observation: the existence of the NCSU battery (Bartlett 1991, N=313) and Zetou 2005 beach battery (N=40) measuring serve / pass / set as **separate constructs without publishing inter-skill correlations** is itself informative — researchers would publish a correlation matrix if they thought the skills were interchangeable manifestations of one construct.
3. **Biological-bottleneck framing** (vendor 2): serving loads on anthropometry plus ballistic upper-body power; passing loads on visual-search speed and lower-body agility; setting loads on kinesthetic differentiation and fine-motor precision. Because these are three functionally independent physical substrates, a single amateur rarely possesses all three at a uniform baseline, which mathematically forces asymmetric vector development. Framing is theoretically coherent and complements the motor-learning-theory argument; precise bottleneck structure is a plausible narrative, not a directly measured causal chain.
4. **Practitioner consensus** (Kessel, McGown, Kiraly, Lebedew, McCutcheon, community coaching material per vendor 1; UBVR and "Better at Beach" rating rubrics per vendor 2; **FIVB Beach Drill Book, USA Volleyball lesson plans, Volleyball Canada Development Matrix, AVP educational content** per vendor 3): amateur rec players develop **asymmetrically** — serving ahead (self-paced, closed, transfers from throwing sports), setting behind (narrow tolerance window, no everyday analog, high avoidance rate), passing middling. Federation-level materials rotate athletes through server / passer / setter roles within drills (shared exposure) but stage the three skills separately in development matrices (separate tracks). Commercial rating systems refuse to collapse to a single scalar. A single scalar cannot represent asymmetric growth rates or practitioner rubric reality.
5. **Population-specific CV evidence** (Giatsis 2023, N=60 stratified novice/intermediate/expert, cited by vendor 1): coefficient of variation collapses from 23.6% at novice level to 8.7% at expert level. The target population sits in the high-dispersion novice-to-intermediate band, which is precisely where per-skill granularity carries the most information. Vendor 2 reinforces this with the "amateur divergence" framing — unstructured play-practice accelerates preferred skills and stagnates avoided ones, so the 2–5-year band is actively *diverging* in profile shape, not converging.
6. **Direct developmental-rate asymmetry** (vendor 3, net-new): Gabbett et al. 2006 (*JSCR*, N=26 juniors, 8 weeks, 3×/week) measured per-skill accuracy gains of **+76% spike / +335% set / +40% pass / +15% serve (ns)** under a shared training block. Only spike (+24%) and pass (+29%) technique ratings improved significantly; set (+14%) and serve (+17%) showed nonsignificant trends. This is the cleanest published per-skill growth-rate-asymmetry evidence on the stack. Junior indoor, not adult rec beach, but strictly better than vendors 1 and 2's "asymmetric development is plausible" framing.
7. **Within-rally coupling vs. person-level correlation** (vendor 3, net-new): Palao et al. 2019 (*MJSSM*, N=5,161 receptions / 91 players / 84 FIVB World Tour matches) shows max-option receptions yield 60.7% rally-win rate vs. 38.8% for limited-option receptions — high within-rally coupling at the sequence layer. Vendor 3 explicitly separates this from person-level latent correlation; conflating them produces false confidence in a single-scalar model. González-Silva 2020 (elite World Championship N=1,371 sequences) vs 2016 (U16 N=5,842 actions) shows **level-split coupling**: serve predictive weight on setting efficacy drops at elite levels, consistent with expert cross-action compensation rather than lockstep improvement.

The **counter-pull** (all three vendors acknowledge it, none finds it decisive for this cohort):

- Beach's 2v2 format structurally forces all-around play (no position specialization) and raises expected r relative to indoor.
- Shared perceptual-cognitive "reading the ball" demands couple skills at the cognitive layer.
- Elite players converge to uniformly high performance via selection bias and coached deficit-correction. Vendor 2 calls extrapolating this elite convergence to recreational users "a dangerous fallacy." Vendor 3 refines the mechanism: elite convergence is partly **cross-action compensation**, not lockstep improvement — target population is not elite *and* would not benefit from a scalar even if it were.

Vendor 2's **match-play paradox** (forced exposure surfaces asymmetry but compensatory moves in-rally — bump-setting instead of hand-setting; favoring the strong side on receive — *highlight* rather than *resolve* it) survives vendor 3's arrival unchanged. Vendor 3 adds a complementary framing: **within-rally coupling** is real and product-relevant at the rally layer (pass quality changes the setter's option set), but it does not imply a high person-level cross-skill correlation.

**Practical implication for this repo:** the per-skill architecture already present at the drill and chain layers is well-founded, and the recommendation is **further strengthened** (not just confirmed) by having three independent vendors converge directionally from three partially overlapping evidence bases. No change is required today. Any future proposal to surface a user-visible single "skill score" — in review, summary, home state, ladder, or ranking — should default to per-skill display with scalar projection as an explicit design choice, not a default. Vendor 3's "partial spillover in update logic + general-factor initialization from onboarding prior + UI-level scalar projection" is **available** as a design-surface refinement when such a surface is next scoped; it is not adopted by this note alone.

## Vendor 1 evidence ladder (2026-04-22)

Condensed from [`docs/research/briefs/responses/2026-04-22-skill-correlation-vendor-1.md`](./briefs/responses/2026-04-22-skill-correlation-vendor-1.md). Full citations, caveats, and verbatim quotes live in that file.

| Evidence layer | Strength for per-skill | Representative anchor | Why it applies (or doesn't) |
|---|---|---|---|
| Direct measurement in target population | — | None located | The study that would settle the question does not exist in open literature. |
| Adjacent adult-indoor skill batteries | Moderate, supports per-skill | Cothran (1992, N=64 college amateurs): "no one single dominant test factor" | Different environment (indoor) but matched age and skill-range; directly tests the scalar hypothesis and rejects it. |
| Factor-analytic talent batteries | Moderate, supports per-skill | Kundu (2020, N=200 junior females): six skills retained as separable factors with item-sum validity r 0.73–0.79 | Juniors not adults, but the methodological signal is clean — no single-factor solution emerged. |
| Beach match-analysis | Moderate, supports per-skill with coupling caveat | Palao & Ortega (2015, 13,939 rallies / 91 elite FIVB): winners better across serve, reception, set, spike — via "interaction of different game skills" | Elite-level data; the "interaction" framing is consistent with moderate coupling, not single-scalar identity. |
| Elite-vs-amateur asymmetry | Strong, sharpens target-band estimate | Giatsis (2023, N=60 stratified): CV collapses 23.6 % → 8.7 % from novice to expert | Target population sits in the high-CV novice-to-intermediate band; supports estimating **lower** in the plausible range. |
| Beach-vs-indoor coupling | Moderate, pulls estimate up | Kiraly & Shewman (1999) teaches every technique to every reader; 2v2 format eliminates positional specialization | Structural argument, not measurement. Raises expected r relative to indoor but does not collapse it. |
| Motor-learning theory | Strong, supports per-skill at execution | Schmidt, Magill, Ericsson, McGown: specificity of learning; distinct motor programs for pass / set / overhead strike | Theory-level. Predicts low motor-execution transfer, partially offset by shared perceptual-cognitive layer. |
| Practitioner intuition | Strong, supports asymmetric development | Kessel, McGown, Kiraly, Lebedew, McCutcheon | Consistent across sources: serving acquired fastest, setting slowest, passing middle — incompatible with a high single-scalar correlation. |

### Vendor 1 headline numbers

- **Central inference:** r ≈ 0.45 (pass / serve / set cross-skill average, adult rec beach, 2–5 years).
- **90 % plausible range:** r ≈ 0.30 – 0.65.
- **Confidence:** low-to-moderate (inference, not measurement).
- **Subpopulation structure:** serve ↔ spike noticeably higher (shared overhead striking generalized motor program); pass ↔ set noticeably lower (different effectors and motor primitives).
- **Elite-tail behavior:** r likely > 0.7 for AVP / FIVB / 4+ year tournament players; target population is explicitly not that tail.

### Vendor 1 literature gaps (pre-registered as open for future evidence)

1. Direct observational study, N = 50–200, adult rec beach, 2–5 years, self-coached, adapted Zetou / Bartlett battery, reporting the full 3×3 Pearson matrix. Single highest-leverage study.
2. Longitudinal tracking over 12–24 months to distinguish cross-section uncorrelated from actively diverging.
3. Factor-analytic study of adult amateur batteries reporting variance explained by the first principal component.
4. Comparative beach-vs-indoor matched-experience adult study.

Vendor 1 also notes that pre-2000 AAHPERD-era test batteries (Brady, Russell-Lange, Bassett-Glassow-Locke, Cunningham-Garrison, Helman) likely carry inter-skill correlation matrices in their original *Research Quarterly* print form; physical-archive retrieval could surface directionally useful (if imperfect) data.

## Vendor 2 evidence ladder (2026-04-22)

Condensed from [`docs/research/briefs/responses/2026-04-22-skill-correlation-vendor-2.md`](./briefs/responses/2026-04-22-skill-correlation-vendor-2.md). Full quotes, tables, and study designs live in that file.

| Evidence layer | Strength for per-skill | Representative anchor | Why it applies (or doesn't) |
|---|---|---|---|
| Direct measurement in target population | — | None located | Vendor 2 independently confirms vendor 1: the study that would settle the question does not exist. |
| Standardized indoor skill batteries (VSAT, NCSU, AAHPERD) | Moderate, supports per-skill | VSAT (N=130): per-skill intraclass reliability 0.83–0.88; passing + spiking dominate discriminant classification (67–68%) over setting and serving | Vendor 2 reads the predictive-weight asymmetry as evidence that no uniform per-skill weight exists for a single-scalar rollup. Indoor, college / amateur, not adult rec beach. Source citation is missing in vendor 2's writeup — treat the specific numeric table with caution (see Reconciliation below). |
| Junior-squad talent-ID discriminant analysis | Moderate, indirect | N=28 junior squad: passing + serving technique the only significant variables in final discriminant model (89.5% classification accuracy) | Suggests setting and attacking do not scale uniformly with passing and serving even under coached juniors. Sample size is small; vendor 2 does not cite the source study by name. |
| Cognitive-motor coupling with cumulated-score aggregation | Weak-to-moderate | N=43 female youth volleyball players (mean 11.2 yrs): individual volley-specific skill r=0.295 (ns) with cognitive baseline; only the *cumulated* aggregate reaches r=0.451 (p=0.002) | Vendor 2's interpretation: if individual skills were tightly coupled (r > 0.75), any one would proxy for the aggregate; the fact that aggregation is required implies within-player skill decoupling. Population is youth female indoor, not adult rec beach. |
| Factor-analytic / ESEM / CFA evidence | Moderate, supports per-skill | Block-jump-height study: anthropometry and jumping performance load on separate factors (74.46% and 95.69% of variance, respectively) | Vendor 2 generalizes to "physical g-factor does not emerge when real skill batteries are factored." Plausible but the precise statistic is uncited. |
| Motor-learning theory (GMP, contextual interference, especial skill effect) | Strong, supports per-skill | Schmidt / Magill / Lee on GMPs; Keetch / Schmidt on especial skills | Pass / set / serve are three distinct GMPs with different control primitives. Isolated massed practice (wall serves) produces localized parameterization that does not transfer. Aligns with vendor 1's specificity-of-learning framing. |
| Biological-bottleneck framing | Moderate, novel lens | Anthropometry/power for serving; visual-search and agility for passing; kinesthetic differentiation and fine-motor for setting | Coherent theoretical framing — the three skills load on three functionally independent physical substrates. Not a direct measurement; complements rather than replaces motor-learning-theory evidence. |
| Commercial rating-rubric structure | Strong, supports per-skill | UBVR; "Better at Beach" matrices; intermediate "B-level" players rubric-described as asymmetric (e.g., intermediate-to-advanced serve alongside novice receive-footwork) | Industry-operated rubrics already refuse to collapse to a single scalar — the market operates on an asymmetric reality. Vendor 2 treats this as a revealed preference in favor of per-skill modeling. |
| Beach-specific environmental argument | Moderate, decouples further | 2v2 forced exposure (every player touches every rally) vs. "match-play paradox" (players default to compensatory moves without coached correction); Ottawa indoor-sand transition and triple-extension biomechanical disruption | Vendor 2's argument: forced exposure surfaces asymmetry but does not resolve it without coaching — the gap a training app must fill. Aligns with vendor 1's beach-coupling-but-not-collapse framing. |
| Amateur-divergence framing | Strong, supports per-skill | Unstructured "play-practice" in the 2–5-year band; psychological avoidance of weak skills (e.g., wrist-stiffness avoidance → hand-setting stagnation); asymmetry-index fluctuation in non-elite cohorts | Vendor 2's core behavioral argument for why amateur cross-skill r should be estimated *low*: preferred strengths grow disproportionately while neglected weaknesses stagnate. |

### Vendor 2 headline numbers

- **Central inference:** r ≈ 0.32 (midpoint of 0.25–0.40 stated range, pass / serve / set cross-skill, adult rec beach, 2–5 years).
- **Stated range:** r ≈ 0.25 – 0.40.
- **Stated confidence level:** 85% (vendor 2's framing; see Reconciliation for how this relates to vendor 1's "low-to-moderate confidence" language).
- **Elite-tail behavior:** vendor 2 attributes elite cross-skill r to selection bias and coached deficit-correction, not biological coupling. Calls extrapolating elite convergence to recreational users "a dangerous fallacy."
- **Edge case:** vendor 2 identifies the 0–6-month absolute-beginner window as the single regime where a scalar may be momentarily acceptable. Target population is explicitly past this window.

### Vendor 2 literature gaps and proposed study

Vendor 2 converges with vendor 1 on the highest-leverage missing study, with a more specific design:

- **Population:** 200 adult amateur beach players (ages 21–40), 1–3 sessions/week, no formal coaching, sourced from local recreational leagues (Ottawa example).
- **Protocol:** beach-adapted standardized battery isolating the three skills: mechanical-serve-machine passing accuracy to target grid; machine-toss overhead hand-sets to antenna zones; player serves to spatial targets with radar-tracked velocity + placement.
- **Timepoints:** baseline, 6 months, 12 months.
- **Analysis:** cross-sectional r at baseline for the population-level asymmetry; longitudinal correlation of delta scores (ΔPass vs. ΔServe vs. ΔSet) to test whether developmental trajectories are coupled or independent over time.

## Vendor 3 evidence ladder (2026-04-22)

Condensed from [`docs/research/briefs/responses/2026-04-22-skill-correlation-vendor-3.md`](./briefs/responses/2026-04-22-skill-correlation-vendor-3.md). Full quotes, DOIs, and reasoning live in that file.

| Evidence layer | Strength for per-skill | Representative anchor | Why it applies (or doesn't) |
|---|---|---|---|
| Direct measurement in target population | — | None located | Vendor 3 independently confirms vendors 1 and 2: the study that would settle the question has not been published. |
| Direct developmental-rate asymmetry (net-new) | Strong, supports per-skill | Gabbett et al. 2006 (*JSCR*, N=26 junior volleyball, 3×/week for 8 weeks): accuracy gains +76% spike / +335% set / +40% pass / **+15% serve (ns)**; technique gains significant only for spike (+24%) and pass (+29%), not set or serve | Direct evidence that a shared training block moves skills in the same general direction but by very different magnitudes and with different significance profiles. Junior indoor, not adult rec beach, but it is the cleanest published per-skill growth-rate asymmetry anyone has produced. |
| Talent-ID discriminant with complete specification (net-new sourcing) | Moderate, supports per-skill | Gabbett et al. 2007 (*J Sports Sci*, N=28 juniors): passing technique + serving technique enter final discriminant model (78.6% accuracy); **setting drops out** | Vendor 3 provides the cited source that vendor 2 referenced anonymously; the raw means (passing accuracy 9.1 vs 6.7; serving technique 3.7 vs 2.8; passing technique 4.0 vs 2.7; setting technique 3.4 vs 2.8 n.s.) are now traceable. |
| Historical adult-amateur + HS battery evidence | Moderate, supports per-skill | Cothran 1992 (N=64 college amateurs, 6 skill tests, 4 discriminate game performers); Thissen-Milder & Mayhew 1991 (N=50 HS, multi-variable combinations classify team level at 68%, starters at 78%) | Researchers repeatedly need multiple skill variables, not one omnibus score, to explain playing level. Cothran overlaps with vendor 1's anchor; Thissen-Milder is net-new. |
| Beach and indoor skill-battery culture | Moderate (absence result) | Bartlett et al. 1991 NCSU battery (N=313) and Zetou et al. 2005 beach battery (N=40) measure serve / pass / set as **separate constructs** but neither publishes inter-skill correlations | Vendor 3's interpretation: "the literature culture itself is informative" — investigators keep measuring these skills separately, which is what you would expect if they are not interchangeable manifestations of one scalar competence. |
| Motor-learning theory + contextual-interference experiments | Strong, supports partial transfer | Magill & Hall 1990; Hall & Magill 1995; French/Rink/Werner 1990 (N=139 HS); Jones & French 2007 (N=60 amateur male uni); Kalkhoran & Shariati 2012 | CI benefits appear when task variations are governed by **different GMPs**; volleyball learning studies routinely treat pass / set / serve as separate skills for schedule experiments. Theoretical default: **partial transfer, not full co-development**. Vendor 3's "shared general factor plus skill-specific states" recommendation follows from this. |
| Within-rally sequential coupling (net-new) | Moderate-to-strong, pulls estimate up but does not collapse it | Palao et al. 2019 (*MJSSM*, N=5,161 receptions / 91 players / 84 FIVB World Tour matches): max-option receptions → 60.7% rally-win rate; limited-option receptions → 38.8% | Strong evidence that **pass quality materially changes the setter's and attacker's option set** inside a rally. Vendor 3 explicitly separates **within-rally sequential dependency** (high) from **person-level latent correlation** (moderate) — a distinction vendors 1 and 2 did not draw cleanly. |
| Level-split coupling pattern (net-new) | Moderate, sharpens edge-case framing | González-Silva et al. 2020 (*Frontiers in Psychology*, N=1,371 elite men's World Championship sequences): reception + set characteristics predict setting efficacy; serve does **not**. González-Silva et al. 2016 (*J Hum Kinetics*, N=5,842 U16): serve matters more in youth male play than in elite men | Coupling **changes with level**. Expert setters get better at compensating for imperfect previous touches — elite "convergence" is partly cross-action compensation, not lockstep skill improvement. Refines the elite-tail framing without flipping the target-cohort recommendation. |
| Beach-specific structural argument | Moderate, raises expected r | FIVB beach rules: both players always in play, no determined positions; Palao 2019 reception asymmetry (power jumps create downstream pressure but amateur passing suffers specifically under lateral movement and interference-zone conditions) | Exposure-based argument: beach players see all three skills often, which raises covariance. Vendor 3's qualifier: "exposure is not the same thing as identical development." Aligns with vendor 1 / vendor 2 on the coupling-without-collapse frame. |
| Federation and practitioner stage separation | Strong, supports per-skill | FIVB Beach Drill Book rotates athletes through server / passer / setter roles *within* drills; USA Volleyball lesson plans stage serve, overhead pass/set, forearm pass as separate skills; Volleyball Canada Development Matrix stages serve / pass / set separately; AVP content uses distinct level descriptors per skill | Shared-exposure + separate-development-track pattern across governing-body materials. Reinforces vendor 1's Kessel / Kiraly anchors and vendor 2's UBVR / "Better at Beach" rubric anchors with federation-level evidence. |

### Vendor 3 headline numbers and recommendation

- **Central inference:** r ≈ 0.50 (pass / serve / set cross-skill, adult rec beach, 2–5 years).
- **Plausible range:** r ≈ 0.35 – 0.65.
- **Confidence:** low-to-moderate (inference, not measurement).
- **Architectural recommendation (refined hybrid, net-new framing):** per-skill internal vector **plus a lightweight general factor**, with four concrete design primitives:
  1. Internal vector with at least pass / set / serve dimensions.
  2. Shared onboarding prior initializes all dimensions (years played, self-rating, recent frequency). *Structurally identical to how `D121` already operates.*
  3. **Partial spillover**, not full spillover: a session that succeeds in a passing-heavy context may nudge the setting estimate up slightly via shared ball-reading / general comfort, but much less than the passing estimate.
  4. A simplified "overall level" is exposed in UI **only as a projection**, never as the source of truth. Matches vendor 1 / vendor 2's "store per-skill, project to scalar on demand."
- **Conceptual distinctions worth recording:**
  - **Within-rally sequential coupling** (high in beach, per Palao 2019) ≠ **person-level latent cross-skill correlation** (moderate). Confusing these conflates "good passes help the setter now" with "good passers are good setters."
  - **Cross-sectional r** (coupled *levels* at a snapshot) ≠ **change-score r** (coupled *growth rates* over time). A player can have correlated skill levels but weakly correlated skill growth rates. The product cares about both.
- **Elite-tail reframing:** elite convergence is partly **cross-action compensation** (expert setters rescue imperfect prior touches) rather than lockstep skill improvement. Does not flip the target-cohort recommendation; does refine the edge case.

### Vendor 3 literature gap and proposed study

Vendor 3 converges with vendors 1 and 2 on the highest-leverage missing study, with two additional analytical specifications:

- **Population:** a few hundred adult recreational beach players, 6–12 months, standardized skill tests for serve / pass / set plus drill logs and self-reported practice mix.
- **Analysis A:** estimate both **cross-sectional r** (coupled levels) *and* **change-score r** (coupled growth rates) — different questions.
- **Analysis B:** fit a **hierarchical latent-variable model** — one general volleyball factor plus three skill-specific factors. If the general factor explains most of the variance, the scalar case wins. If the skill-specific residuals stay large after controlling for the general factor, the vector case is decisively justified.
- **Meta-observation:** vendor 3 notes that the literature's weakness on adult-amateur-beach person-level correlation is itself actionable — a modest in-product validation study would generate better evidence than what currently exists.

## Reconciliation

Three independent vendors, arriving at overlapping but non-identical magnitude estimates via partially overlapping methodologies. The reconciliation matters because the product recommendation needs to be robust across all three.

### Where the vendors agree (high-confidence takeaways)

- **No direct measurement exists.** All three vendors independently conclude that the cross-skill Pearson r for the exact target population has not been published.
- **Direction:** per-skill vector over single scalar. All three vendors reach the same storage-layer recommendation. Vendor 3 adds a hybrid refinement (general-factor initialization + partial spillover + UI-level scalar projection) that is compatible with, not contradictory to, vendors 1 and 2.
- **Mechanism:** motor-learning specificity plus distinct GMPs / motor primitives for pass / set / serve. All three vendors cite the Schmidt / Magill / Lee / Wulf corpus and treat it as the primary theoretical anchor. Vendor 3 adds the contextual-interference experimental literature (French 1990, Jones & French 2007, Kalkhoran & Shariati 2012, Magill & Hall 1990) as direct experimental reinforcement.
- **No g-factor in volleyball.** All three vendors read the factor-analytic / battery literature as failing to retain a dominant single "volleyball ability" factor. Vendor 3 adds a meta-observation: "the literature culture itself is informative" — researchers keep measuring these skills separately, which is what you would expect if they are not interchangeable manifestations of one scalar competence.
- **Elite convergence is a selection / environmental artefact**, not a biological coupling. All three vendors explicitly warn against extrapolating elite cross-skill r to recreational users. Vendor 3 **refines** this: elite convergence is partly **cross-action compensation** (expert setters rescue imperfect prior touches), not lockstep skill improvement — a mechanism-level explanation the prior two vendors did not surface.
- **Beach's 2v2 format couples skills structurally but doesn't collapse them.** All three vendors acknowledge the format raises expected r relative to indoor but none treats this as sufficient to push r into the scalar-defensible zone for this cohort. Vendor 3 sharpens this with Palao 2019 direct beach-rally evidence (N=5,161 receptions; max-option receptions produce 60.7% rally-win rate vs. 38.8% for limited-option receptions) — the cleanest within-rally coupling data on the stack.
- **Absolute-beginner window** is the one regime where a scalar may be acceptable. Vendor 1 and vendor 2 frame this as "first 0–6 months" of experience; vendor 3 frames it as "true beginners under ~2 years of experience." Target population (2–5 years) sits past even vendor 3's broader beginner boundary. All three vendors treat this as an edge case, not a counter-recommendation.
- **Highest-leverage missing study.** Vendor 1: N=50–200 cross-sectional with adapted Zetou / Bartlett battery. Vendor 2: N=200 longitudinal at baseline + 6 + 12 months with mechanical-serve-machine, radar-tracked serves, and machine-toss sets. Vendor 3: 6–12 month cohort with standardized battery plus drill logs, analyzing both **cross-sectional r** (coupled levels) and **change-score r** (coupled growth rates) as distinct questions, with a **hierarchical latent-variable model** (one general factor + three skill-specific factors) as the definitive design. Vendor 3's analytical framing is the most rigorous; vendor 2's instrumentation is the most concrete; treat vendor 3's analytical design + vendor 2's instrumentation as the reference protocol if the repo ever scopes such a study.

### Net-new conceptual distinctions vendor 3 added (not previously surfaced)

These do not change the recommendation direction but materially improve how future evidence is interpreted. Capture them in the repo posture so downstream design work inherits them.

- **Within-rally coupling ≠ person-level latent correlation.** Pass quality strongly changes the setter's and attacker's option set *inside a rally* (Palao 2019). That is a high-coupling observation at the rally layer, and it is separate from the question of whether good passers are also good setters across the population. Conflating the two produces false confidence in a single-scalar model.
- **Cross-sectional r ≠ change-score r.** A player can have correlated skill *levels* at a snapshot while having weakly correlated skill *growth rates* over time. The product cares about both — cross-sectional r informs onboarding-band seeding and scalar-projection plausibility; change-score r informs per-skill progression algebra. If a future cohort study surfaces a high cross-sectional r alongside a low change-score r, that pattern *still* favors per-skill storage because progression logic tracks deltas.
- **Expert setters compensate, they do not homogenize.** González-Silva 2016 (U16) vs 2020 (elite) shows that the serve's predictive weight on setting efficacy **drops** at elite levels and that elite setters increasingly compensate for imperfect prior touches. Read elite "convergence" evidence through this lens: it is cross-action compensation, not a latent g-factor becoming dominant.
- **Direct developmental-rate asymmetry is measurable.** Gabbett 2006 (N=26 juniors, 8 weeks, 3×/week) produced the cleanest published per-skill growth-rate asymmetry: +76% spike / +335% set / +40% pass / **+15% serve (ns)** accuracy gains under a shared training block. Junior indoor is one step removed from the target population, but this is strictly better than the "asymmetric development is plausible" framing vendors 1 and 2 rested on.

### Where the vendors disagree

*Vendor-N convention: add one column per new vendor to the left of the Repo-facing reconciliation column; update the rightmost cell only when the new vendor's evidence materially shifts the reconciled take. Do not rewrite existing cells unless a prior vendor's framing is contradicted.*

| Dimension | Vendor 1 | Vendor 2 | Vendor 3 | Repo-facing reconciliation |
|---|---|---|---|---|
| Central r estimate | ≈ 0.45 | ≈ 0.32 (midpoint of 0.25–0.40) | ≈ 0.50 (range 0.35–0.65) | Union range ≈ 0.25–0.65 (unchanged by vendor 3). **Magnitude disagreement does not flip the recommendation** because all three estimates sit well below r > 0.70 scalar-defensibility. Reconciled central estimate **r ≈ 0.35–0.50, low-to-moderate confidence** — a band that now spans all three vendors' central points (median ≈ 0.45, mean ≈ 0.42). Vendor 3 recenters the synthesis slightly upward relative to the 2-vendor state but does not shift the envelope or flip the recommendation. |
| Confidence framing | "Low-to-moderate confidence" (linguistic, humble) | "Confidence level: 85%" (numeric, asserted) | "Low-to-moderate confidence" (linguistic, humble) | Two of three vendors converge on humble linguistic framing; vendor 2 stands alone in claiming a numeric 85% that is not a computed confidence interval. Retain the linguistic framing as the repo-facing confidence posture. |
| Citation density | High: named authors, journal + year + N for each claim; reports when N / matrix is unavailable | Lower: specific-looking numeric tables (VSAT N=130 reliability/validity; N=43 cognitive-motor; N=28 discriminant; block-jump-height factor structure) presented without named sources | High: DOIs for most primary claims; the tool-artifact `citeturnXXviewN` / `entity[...]` markers are preserved verbatim but the resolved reference list at the bottom is fully attributed. Vendor 3 names the Gabbett 2007 discriminant study that vendor 2 referenced anonymously (N=28, 78.6% classification, passing + serving technique only), resolving the provenance gap. | Vendor 1 and vendor 3 are roughly peers on citation quality; vendor 2 remains the outlier. Vendor 3 partly **retires** the vendor-2 citation-quality caveat on the N=28 discriminant anchor (now traceable via Gabbett 2007), but the other vendor-2 tables (VSAT N=130; N=43 cognitive-motor; block-jump-height factor structure) remain unsourced within vendor 2's writeup. Continue to treat vendor 2's specific numbers as directional; prefer vendor 1 or vendor 3 anchors for downstream quantitative claims. |
| Magnitude argument chain | Motor-learning theory + factor-analytic + practitioner + CV-compression (Giatsis 2023); range pulled down to lower end by novice-to-intermediate band evidence | Motor-learning theory + factor-analytic + practitioner + biological-bottleneck framing + commercial-rubric structure | Motor-learning theory + contextual-interference experiments + **direct developmental-rate asymmetry** (Gabbett 2006, 8-week intervention) + **within-rally sequential coupling** (Palao 2019, N=5,161 beach receptions) + **level-split coupling** (González-Silva 2016 U16 vs 2020 elite) + federation-level stage separation | Each vendor contributes an argument the others did not surface. Vendor 1's CV-compression, vendor 2's biological-bottleneck / commercial-rubric, and vendor 3's direct-developmental-asymmetry / within-rally-vs-person-level / cross-sectional-vs-change-score distinctions are all complementary. Vendor 3's within-rally coupling evidence is the closest thing to direct beach-coupling data anyone provided; vendor 3's Gabbett 2006 data is the cleanest published per-skill growth-rate-asymmetry evidence. Fold all three argument chains into the Executive conclusion rather than picking one. |
| Edge-case breadth | Five explicit edge cases where scalar may be acceptable (first 3–6 months; elite tail; ranker/matchmaking loop; throwing-sport transplants invert to strengthen per-skill; storage simplicity favors vector anyway) | One explicit edge case (first 0–6 months) | Three explicit edge cases (true beginners under ~2 years; balanced full-skill-only practice mix; adaptation signals too sparse to attribute outcomes per skill) — all three are scalar-friendly edges that vendor 1 partly covers | Retain vendor 1's broader edge-case analysis as the backbone; vendor 3 adds "balanced full-skill-only practice mix" and "signal-attribution sparsity" as new edges worth capturing (Apply To Current Setup table absorbs them). |
| Prescription strength | "Per-skill vector is more defensible" | "Single-scalar is a critical architectural vulnerability" (strong) | "Pure single-scalar is too lossy" — but recommends a **hybrid refinement**: per-skill vector **with a lightweight general factor + partial spillover + UI-level scalar projection** | Vendor 3's hybrid is compatible with vendors 1 and 2's pure per-skill recommendation, not contradictory. It adds three concrete design primitives — general-factor onboarding prior (structurally identical to how `D121` already works), partial-spillover update rule, scalar projection as UI-only projection. Repo-facing reconciliation: **keep the per-skill vector as the storage posture; record vendor 3's partial-spillover and general-factor-initializer framings as design-surface refinements available to any future "skill status" rollup design pass**, without promoting them to canon. |
| Architectural framing | Pure per-skill vector with scalar projection on demand | Pure per-skill vector as non-negotiable architectural requirement | Per-skill vector + general-factor prior + partial spillover + UI-level scalar projection (hybrid) | Vendor 3's hybrid is a superset of vendors 1 and 2's recommendation — the pure per-skill vector is still the storage shape; the refinement lives in *update semantics* (partial spillover) and *initialization semantics* (general-factor prior). None of the three vendors proposes a storage-layer single scalar. The reconciled repo posture is the intersection: **per-skill storage, scalar projection on demand**; vendor 3's partial-spillover and general-factor-initializer framings stay available as opt-in refinements when a concrete design surface forces the question. |

### What the reconciliation does not change

- No decision in `docs/decisions.md` is modified. `D121` remains a coarse starting-band hint, not tracked proficiency — vendor 3 *explicitly* describes the structurally identical "shared onboarding prior from years played, self-rating, recent frequency" as the correct initialization mechanism, which *strengthens* the current `D121` posture without changing its scope. `D80` / `D104` progression math remain governed by `docs/research/binary-scoring-progression.md`. The vendor evidence does not authorize unilateral changes to any `D*` item.
- No code changes land from this distillation alone. The per-skill posture already present at the drill and chain layers is validated, not altered. Vendor 3's "partial spillover" update-algebra refinement is **available** but not adopted — treat it as a design-surface option when a concrete future surface (e.g., a user-visible "skill status" rollup) forces the question.
- The synthesis does not manufacture a consensus number. **The reconciled working estimate is r ≈ 0.35–0.50 (low-to-moderate confidence), with a plausible-values envelope of r ≈ 0.25–0.65 spanning all three vendors' stated ranges** (vendor 1 central 0.45 inside envelope; vendor 2 central 0.32 inside envelope; vendor 3 central 0.50 inside envelope). Any downstream claim citing a single number should cite this envelope, not pick one vendor.

## Synthesis stability: what would change this

The current recommendation (per-skill vector over single scalar, for the 2–5-year adult rec beach cohort) is robust to magnitude disagreement across all three vendors. A vendor 4 response, a new direct-measurement study, or evidence produced internally would **change the recommendation** only if it crossed one of the following pre-registered bars. Evaluate future evidence against these bars rather than re-litigating the whole synthesis.

### Evaluation trace: vendor 3 (2026-04-22)

Recorded in-place per the pre-registered protocol so future readers can see how the bars were applied.

- **Bar 1 (would flip to single scalar): NOT crossed.** Vendor 3 central r ≈ 0.50 with range 0.35–0.65 is nowhere near the r > 0.70 / CIs-exclude-0.60 threshold. Vendor 3 explicitly writes: "not high enough to conclude that one scalar captures most meaningful variance."
- **Bar 2 (would shift magnitude within envelope + new evidence types): CROSSED, both sub-cases.** (2.1) Vendor 3 central r ≈ 0.50 lands inside the prior 0.25–0.65 envelope; reconciled central recentered slightly upward (median ≈ 0.45, mean ≈ 0.42 across three vendors), envelope unchanged. (2.3) Vendor 3 contributes new evidence types: direct developmental-rate asymmetry (Gabbett 2006, N=26, 8 weeks), within-rally sequential coupling (Palao 2019, N=5,161 beach receptions), level-split coupling (González-Silva 2016 U16 vs 2020 elite), the contextual-interference experimental literature (French 1990, Jones & French 2007), and federation-level stage-separation material (FIVB Drill Book, USA Volleyball, Volleyball Canada, AVP). New ladder rows added; Executive conclusion re-scored (5 arrows → 7); no reversal of prior rows.
- **Bar 3 (narrow scope): partial.** Vendor 3's "expert setters compensate, they do not homogenize" framing (González-Silva 2016 vs 2020) refines the elite-tail edge case with a mechanism-level explanation (cross-action compensation rather than lockstep improvement). Does not change the target-cohort recommendation; does enrich how elite-tail evidence is interpreted.
- **Bar 4 (prompt internal measurement): reinforced.** Vendor 3 independently converges with vendors 1 and 2 on the conclusion that the literature has hit its ceiling on this exact question. Vendor 3's analytical design — cross-sectional r + change-score r + hierarchical latent-variable model (one general factor + three skill-specific factors) — becomes the canonical reference analysis if the repo ever scopes an internal cohort measurement, paired with vendor 2's instrumentation spec. No M001-scope change.

No repo-facing recommendation was reversed by vendor 3. The synthesis state advanced from 2-of-N to 3-of-N.

### Bar 1 — Would flip to "single scalar is defensible"

- A direct within-player Pearson matrix on the target population (adult, 2–5 years, 1–3 sessions/week, self-coached beach) showing **r > 0.70 across all three pairwise pass-set-serve correlations, with confidence intervals that exclude r < 0.60**. Both vendors effectively frame this as the threshold. Nothing in the current evidence approaches it.
- **OR** a factor-analytic study on the target population where the first principal component retains **≥ 70 % of variance across the three skills** and no systematically asymmetric residuals. Neither vendor located such a result; its absence in the adult-amateur literature is itself treated as evidence against a strong g-factor.

If either of these lands, reopen the architectural default and weigh it against the union of existing vendor evidence — do not flip on a single new study without a plausibility check against prior literature and the Giatsis 2023 CV-compression pattern.

### Bar 2 — Would shift the magnitude estimate without flipping the recommendation

- A vendor 3 central estimate that lands **inside** the current r ≈ 0.25–0.65 envelope: update the reconciled working estimate (recenter, potentially narrow), keep the per-skill recommendation, no other change.
- A vendor 3 central estimate that lands **outside** the current envelope but still below r ≈ 0.70: widen the envelope, note the disagreement in the Reconciliation table, keep the per-skill recommendation. Flag the widening as reduced confidence.
- A vendor 3 contributing **new evidence types** not already in the ladders (e.g., a direct longitudinal adult-rec-beach dataset, a competitive-ladder panel study, a practitioner rating-dataset audit): add an evidence-layer row to the relevant vendor ladder, re-score the union arrows in the Executive conclusion, and update the confidence framing.

### Bar 3 — Would narrow or complicate the scope

- Evidence that the **elite tail (4+ year tournament players) converges to r > 0.7** specifically in beach — expected, already framed as an edge case. If this lands, annotate the "Edge cases" section and the `Apply To Current Setup` table; do not change the target-cohort recommendation.
- Evidence that the **first 0–6 months** regime shows r > 0.7 at baseline — already framed as an edge case by both vendors. Same handling.
- Evidence that **a subcategory of the target cohort** (e.g., throwing-sport-background transplants) shows substantially different r structure — add a subcohort row to `Apply To Current Setup`; the product default stays per-skill because it already accommodates subcohort heterogeneity better than a scalar.

### Bar 4 — Would prompt an internal measurement, not a literature update

- Any vendor response reinforcing that the literature-inference approach has hit its ceiling. Both vendor 1 and vendor 2 effectively land here: further literature search is unlikely to surface a direct measurement on the target cohort because the study has not been published. The next quality-increasing move is **an internal measurement on the product's own cohort**, scaffolded on `docs/research/pre-telemetry-validation-protocol.md` and extended to capture per-skill signals across at least two drill families for the same participants. That is out of M001 scope; note it in `Open Questions Flagged For Future Consideration` for a post-M001 cohort.

### Stability check: where the current synthesis could be fragile

Three honest weak points worth naming rather than hiding:

1. **Neither vendor has a direct measurement.** The entire synthesis is an inference from adjacent literature and theory. A single well-designed direct study would outweigh the entire current evidence stack.
2. **Vendor 2's specific numeric tables are unsourced** (see the citation-quality caveat in Scope and provenance). The directional argument survives without them; a third vendor re-citing the same numbers with proper attribution would strengthen the evidence base, while a third vendor failing to reproduce them would further weaken vendor 2's specific anchors (but not the directional recommendation, which rests independently on motor-learning theory and factor-analytic evidence).
3. **Population-fit extrapolation.** The strongest evidence anchors (Cothran 1992 adult amateurs; Kundu 2020 juniors; Giatsis 2023 stratified beach) are each one step removed from the exact target cohort. The reconciled recommendation is directionally robust but rests on the claim that these anchor populations generalize; a third vendor surfacing population-specific evidence (adult amateur beach, 2–5 years, self-coached, Canada / northern US seasonal context) would materially strengthen the synthesis regardless of the r magnitude reported.

## Product implications for this repo

### What this evidence confirms (no change needed)

- **Drill-level architecture is correct.** Drills carry per-skill `skillFocus` in `app/src/data/drills.ts`; chains are per-skill (`chain-6-serving`, `chain-7-setting`, and the passing chains). The vendor evidence validates this posture.
- **Progression gates are correct per `D80` / `D104`.** The binary Good / Not Good gate operates per-drill-variant per the posterior model in `docs/research/binary-scoring-progression.md`. Per-skill state is already present where it matters for adaptation.
- **Asymmetric content authoring is correct.** The 2026-04-22 Tier 1b plan authors serving and setting chains separately (`docs/plans/2026-04-22-tier1b-serving-setting-expansion.md`). The vendor evidence supports treating serving and setting as independent development trajectories.
- **Motor-learning specificity posture is correct.** `docs/research/fivb-coaches-manual-crosscheck.md` already adopts the Fitts & Posner three-stage model, one-cue-at-a-time rule, and the whole-practice bias with four exceptions. Vendor 1 cites the same specificity literature (Schmidt, Henry, McGown).

### What this evidence sharpens (open as a design question, not a decision today)

- **User-visible "skill status" rollup design.** When the product eventually surfaces a single user-facing summary of the athlete's skill state (e.g., in the `CompleteScreen`, a weekly digest, a home-state ribbon, or a ladder / ranking surface), default to **per-skill breakdown with an explicit scalar projection** rather than a single composite number. The vendor evidence is strong enough to make the default direction clear but not strong enough to close the design space.
- **`D121` onboarding band remains a coarse starting-band hint, not tracked proficiency.** The D121 enum (`foundations` / `rally_builders` / `side_out_builders` / `competitive_pair` / `unsure`) is a one-shot cold-state affordance to seed defaults, not a tracked skill-state representation. The vendor evidence does not contradict `D121`; it does argue that any future *tracked* proficiency surface should be per-skill. Treat `D121` and per-skill tracked state as separate concerns.
- **Baseline assessment protocol (if adopted).** If a baseline skill-assessment surface is adopted later (see the sibling brief on per-skill baseline tests), per-skill is the expected shape per this vendor's recommendation. That brief has not yet been returned by any vendor; reconcile then.

### What this evidence does not settle

- **Magnitude of correlation for this app's actual cohort.** The central inference (r ≈ 0.45) is an external-literature triangulation, not a measurement on the product's users. A direct measurement would require the pre-telemetry-validation-protocol cohort (see `docs/research/pre-telemetry-validation-protocol.md`) to capture per-skill signals across at least two drill families for the same participants, which is not in the current M001 scope.
- **Rank / ladder / match-making decisions.** Vendor 1 explicitly notes that for match-making or ladder ranking a single scalar may be operationally sufficient. The product does not currently surface ranking; if it later does, revisit.
- **Elite-tail behavior.** For 4+ year tournament users (outside the target band), r may exceed 0.7 and a scalar may become defensible. The current user base is not in that tail and the evidence does not cover it directly.

## Apply To Current Setup

| Surface | Current posture | Change required by reconciled vendor evidence? | Notes |
|---|---|---|---|
| `app/src/data/drills.ts` — per-drill `skillFocus` | per-skill | No | Posture validated by all three vendors. |
| Chain structure (serving, setting, passing chains) | per-skill | No | Posture validated by all three vendors. |
| Progression gate (`D80` / `D104`, binary Good / Not Good) | per-drill-variant + fatigue context | No | Already per-skill at the unit that matters. Vendor 3's partial-spillover update-algebra proposal is **available as a design option** but not adopted by this note — surfaces a candidate open question (#2) for post-M001 if / when a user-visible skill-state rollup lands. |
| `D121` onboarding `skillLevel` enum | single-scalar coarse band with "unsure" escape | No | Starting-band hint, not tracked proficiency. Vendor 3 **explicitly describes** the structurally identical mechanism ("shared onboarding prior from years played, self-rating, recent frequency") as the correct initialization for a per-skill vector — which *strengthens* the current `D121` framing rather than contradicting it. Treat `D121` as the general-factor initializer per vendor 3's mental model. |
| Future "skill status" rollup (not yet surfaced) | undefined | **Yes (design default)** | Default to per-skill display with scalar projection as an explicit choice, not a default. Unanimous across all three vendors. Vendor 3's hybrid (per-skill vector + general-factor init + partial spillover + UI-only scalar projection) is the most specific design proposal on the stack; weigh against a pure per-skill vector when the question lands. |
| Baseline assessment (if adopted) | undefined | **Yes (design default)** | Per-skill is the expected shape. Reconcile with the per-skill baseline brief's vendor responses when they arrive. Vendor 3's analytical design (cross-sectional r + change-score r + hierarchical latent-variable model with 1 general + 3 skill-specific factors) is the reference analysis. |
| Progression-gate signal attribution | per-drill, per-variant, per-fatigue-context | No | Vendor 3 flags "adaptation signals too sparse to attribute outcomes per skill" as a scenario where a scalar could be acceptable. The current progression gate already operates per-drill-variant with explicit `skillFocus`, so signal attribution is not sparse; vendor 3's edge case does not apply. |

No code changes land from this note alone. No decisions in `docs/decisions.md` change from this note alone. The note's job is to record the evidence direction so the next design question in this space starts from the right default.

## Open Questions Flagged For Future Consideration

These are candidate open questions surfaced by the reconciled vendor 1 + vendor 2 + vendor 3 evidence. They are **not** added to `docs/decisions.md` as formal `O*` items from this note; raise them there when a downstream design surface forces the question.

1. **User-visible skill-status rollup shape.** When the app next surfaces a consolidated user-facing skill-state view, which axes are shown and which are projected? Default per this evidence: three axes (pass / serve / set) with an optional scalar rollup; revisit if UI constraints force collapse. Vendor 3's hybrid (general-factor initialization + partial-spillover update rule + UI-only scalar projection) is the concrete design primitive to weigh against a pure per-skill vector when this question lands.
2. **Partial-spillover update algebra (vendor 3 contribution).** Vendor 3 proposes that when a player succeeds in a passing-heavy session, the setting estimate should rise *slightly* (shared ball-reading and general comfort) but much less than the passing estimate. Per-drill progression (`D80` / `D104`) currently has no cross-skill nudge. Open: does partial spillover improve progression-gate signal-to-noise, and if so, what is the defensible spillover coefficient? Out of M001 scope; worth a lightweight experimental test post-D91 if the product surfaces a user-visible skill-state rollup.
3. **Direct measurement of r on the product's cohort.** Worth adding as a secondary signal in a post-M001 cohort study (the kind of lift `docs/research/pre-telemetry-validation-protocol.md` already scaffolds). The reference protocol is vendor 2's instrumentation (mechanical-serve-machine passing; machine-toss setting to antenna zones; radar-tracked serving to spatial targets) paired with vendor 3's analytical design (**both** cross-sectional r and change-score r, plus a **hierarchical latent-variable model** — one general factor + three skill-specific factors). Would replace a literature inference with a measurement.
4. **Cross-sectional r vs change-score r are different questions (vendor 3 contribution).** A player can have correlated skill *levels* at a snapshot while having weakly correlated skill *growth rates* over time. The product cares about both — cross-sectional r informs onboarding-band seeding and scalar-projection plausibility; change-score r informs per-skill progression algebra and the spillover question above. Any internal cohort study should report both; any downstream claim that cites "the correlation" should specify which.
5. **Elite-tail behavior and the cross-action-compensation mechanism.** If / when the product attracts 4+ year tournament users at volume, the cross-skill correlation regime may shift and the scalar vs vector default may flip for that subcohort. Vendor 3 adds a mechanism-level refinement: elite "convergence" is partly cross-action compensation (expert setters rescuing imperfect prior touches), not lockstep skill improvement. Downstream implication: even if elite r > 0.7 is observed, it may not translate to the *same* product simplifications a genuine g-factor would.
6. **Subcohort heterogeneity not yet tested.** Throwing-sport transplants, indoor-to-sand-transition players, short-outdoor-season users (the Ottawa seasonal pattern vendor 2 flagged), and balanced-full-skill-only vs lopsided-practice users (vendor 3's edge case) may each carry systematically different per-skill profiles. The per-skill vector accommodates subcohort heterogeneity by construction; no action until a product surface needs to distinguish subcohorts.

## Scope and provenance

- **State of this synthesis:** 3-of-N vendors folded in (vendor 1, vendor 2, and vendor 3, all received 2026-04-22). Bar 2 of the Synthesis-stability protocol was triggered and handled cleanly; no repo-facing reversal. The note is **usable standalone at this state** — the reconciled recommendation and Synthesis-stability section are written to stand whether or not any further responses arrive. If no further response arrives, this is the final synthesis as written.
- **How vendor 4+ folds in without rewriting** (same convention used successfully for vendor 3):
  1. File the verbatim response under `docs/research/briefs/responses/<date>-skill-correlation-vendor-4.md` (naming per `docs/research/briefs/README.md`).
  2. Add a `## Vendor 4 evidence ladder` section mirroring the vendor 1 / vendor 2 / vendor 3 shape; do not modify existing ladders.
  3. Add a `Vendor 4` column to the "Where the vendors disagree" table (between `Vendor 3` and `Repo-facing reconciliation`). Update the rightmost column cells only if vendor 4 materially shifts the reconciled take; otherwise leave them as-is.
  4. Evaluate vendor 4's evidence against the pre-registered bars in Synthesis stability and add a dated evaluation-trace block inside that section. Update Agent Quick Scan, Executive conclusion, and the summary frontmatter only if one of those bars is crossed.
  5. Bump `last_updated` and append a one-line entry to the depends_on block.
- **Verbatim sources:**
  - Vendor 1: [`docs/research/briefs/responses/2026-04-22-skill-correlation-vendor-1.md`](./briefs/responses/2026-04-22-skill-correlation-vendor-1.md)
  - Vendor 2: [`docs/research/briefs/responses/2026-04-22-skill-correlation-vendor-2.md`](./briefs/responses/2026-04-22-skill-correlation-vendor-2.md)
  - Vendor 3: [`docs/research/briefs/responses/2026-04-22-skill-correlation-vendor-3.md`](./briefs/responses/2026-04-22-skill-correlation-vendor-3.md)
  - Those files are the authoritative record of what each vendor actually said; this note is the repo-facing distillation. If the two layers drift, the verbatim files are correct and this note is stale.
- **Revision-by-replacement convention** (`docs/research/briefs/README.md`) does not apply to this note — this note is internal curated research, not a vendor-facing artifact. Edit in place as evidence accumulates.
- **Citation-quality notes across vendors:**
  - **Vendor 1** and **vendor 3** are peers on citation quality: both name primary sources with journal / year / N and (for vendor 3) DOIs. Prefer these as anchors for downstream quantitative claims.
  - **Vendor 2** remains the outlier on citation quality. Several of vendor 2's specific numeric claims — the VSAT N=130 reliability/validity table, the N=43 cognitive-motor study, the block-jump-height factor structure with 74.46 % / 95.69 % variance — are presented without named source citations within vendor 2's writeup. One previously-opaque vendor-2 anchor (the N=28 discriminant analysis) is now traceable via vendor 3 to Gabbett et al. 2007 (*J Sports Sci*, 78.6 % classification); the rest remain unsourced.
  - **Vendor 3** also carries tool-artifact formatting (inline `citeturnXXviewN` / `citeturnXXsearchN` markers and `entity["organization","..."]` tokens). These are preserved verbatim in the returned-response file; the resolved reference list at the bottom of that file contains the attributed citations. The artifacts do not affect the substance of the argument.
