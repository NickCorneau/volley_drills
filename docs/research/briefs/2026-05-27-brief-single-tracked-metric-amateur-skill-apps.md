---
id: brief-single-tracked-metric-amateur-skill-apps-2026-05-27
title: "Research brief: Single self-tracked metric most predictive of adherence and improvement in amateur skill-sport athletes"
type: research
status: draft
stage: validation
authority: "Vendor-facing research brief. Content below the '--- BRIEF ---' marker is the text intended for the vendor; the frontmatter above is internal-only."
summary: "Self-contained research brief asking which single self-tracked metric, surfaced weekly, most reliably co-predicts (a) 8–12 week training adherence and (b) measurable skill improvement in adult amateur self-coached skill-sport athletes training 1–3 sessions/week. Deliverable is a 1,500–3,000 word memo with a ranked menu of candidate metrics, per-metric evidence ladders with sample sizes and effect sizes where available, documented over-instrumentation failure modes, an explicit two-metric pair (load + skill) defensibility section, and practitioner intuition clearly separated from peer-reviewed evidence."
last_updated: 2026-05-27
internal_motivation: "Directly unlocks the load-proxy + skill-proxy field picks for the M002 Weekly Confidence Loop's minimal weekly receipt (planned vs completed + one load proxy + one skill proxy), which is in active planning. Compounds into the Phase 1.5 dashboard scope, all downstream analytics/progress surfaces, the D91 cohort instrumentation criteria, and the cohort decision criteria at 2026-07-20. The 4-frame convergence in the 2026-05-27 deep-research-questions-for-analyst-desks ideation pass (pain, inversion, leverage, constraint-flip) all surfaced this as the single highest-leverage external-evidence question we have not yet commissioned. Passes the substitution-check from `docs/research/2026-04-22-research-sweep-meta-synthesis.md`: predictive validity of a metric across populations cannot be reconstructed from N=2 founder-use dogfood. Sibling brief 2 (subjective skill-confidence measurement validity) coordinates on the skill-proxy specifically; this brief covers the broader 'which single metric' question across both load and skill domains and is the upstream framing for the skill-confidence brief."
---

# Research brief: Single self-tracked metric most predictive of adherence and improvement in amateur skill-sport athletes

> This brief is intended to be sent to an external research vendor. The body below is self-contained — no prior project context is required. Copy or forward the content below the "--- BRIEF ---" marker as needed.

--- BRIEF ---

## Context

We are designing a local-first mobile training application for adult recreational athletes who train without a coach in skill-sports — sports where outcome depends on technical skill execution under variable conditions (e.g., volleyball, tennis, golf, climbing, racquet sports), as opposed to pure endurance (running, cycling) or pure strength (powerlifting). Target users are adults with two to five years of recreational experience, training one to three times per week, with no expert in the loop.

A core product surface we are designing is a **weekly readout** — a brief, calm summary the user sees once per week to reinforce that training is progressing. Because we are deliberately resisting feature bloat and metric fatigue, we want to ship the smallest defensible set of self-tracked metrics: ideally one number, possibly a paired two-number readout if the literature shows that a single metric cannot honestly carry both adherence and improvement signal at the same time.

This research informs which metric (or paired two-metric set) we surface in that weekly readout.

## Research question

For self-coached adult recreational skill-sport athletes training 1–3 sessions per week, what is the single self-tracked metric — surfaced weekly — that most reliably co-predicts both:

- **(a)** 8–12 week training adherence (does the user keep training?), and
- **(b)** measurable improvement in the trained skill over that same window?

We want a **ranked menu** of candidate metrics with documented over-instrumentation failure modes, not a single intuitive recommendation. The interesting answer may be that one metric ranks first for adherence and a different metric ranks first for measurable improvement — that finding alone would shape product design, because it would tell us a single-metric weekly readout is not honest and a two-metric pair is required.

## Why this is non-obvious

The endurance and strength training literatures have rich evidence for metrics like training load, session-RPE-week-sum, acute:chronic workload ratios, and tonnage — but these come overwhelmingly from coached or elite populations training five to fifteen sessions per week, where total volume is the dominant performance bottleneck and recovery is a first-class concern. The amateur skill-sport slice at one to three sessions per week is comparatively sparse in the literature: at this dose, neither volume nor recovery is the dominant bottleneck, and skill consolidation (motor-program refinement under variable conditions) is the primary outcome of interest.

Consumer-app retention literature (e.g., Reforge case studies, app-store analyst reports) ranks vanity-vs-leading-indicator metrics for engagement and retention, but rarely with paired adherence + objective-improvement evidence in skill-sport contexts. The behavior-change and habit-formation literatures speak to streaks, self-monitoring, and goal-setting in adherence terms but rarely link these directly to objective skill improvement.

The interesting question is what falls out when those literatures are combined and filtered through the amateur-skill-sport population specifically. We could not find a single authoritative answer to that combined question on first-pass search. We want an honest synthesis.

## Candidate metrics to rank

The following candidate metrics should be evaluated against both criteria (adherence and improvement). The vendor is encouraged to add candidates if the literature surfaces them.

- **Session count per week.** Raw count of training sessions completed in a calendar week.
- **Session-RPE-week-sum (sRPE).** Rate of perceived exertion (typically 1–10) multiplied by session duration in minutes, summed across the week.
- **Planned-vs-completed session ratio.** The ratio of completed sessions to a recommended weekly count (e.g., 2 of 3 = 0.67).
- **Drill-completion rate within sessions.** The fraction of planned drills inside a session that the user actually completes.
- **Weekly subjective confidence rating.** A single Likert-scale self-rating of "how confident I feel about my [skill] this week" (e.g., 1–5 or 1–7).
- **Weekly self-rated improvement.** A single Likert-scale self-rating of "how much I improved this week."
- **Weakest-skill contact count.** Volume (e.g., reps or contacts) on the skill the user has identified as weakest.
- **Weekly variance / consistency.** The consistency of session timing or count across weeks (e.g., low standard deviation across the last 4 weeks).
- **Streak length.** Consecutive weeks meeting a target (e.g., consecutive weeks of ≥2 sessions).
- **Single-task perceived effort.** Perceived effort on a focused, structured drill or block within a session, treated as a quality-of-effort proxy rather than a volume proxy.

## Key sub-questions to address

1. **Per candidate metric: adherence prediction.** Published evidence ranking each candidate as a predictor of 8–12 week adherence in self-coached amateur populations. Effect sizes where available (e.g., odds ratios, hazard ratios, regression coefficients). Sample sizes and population descriptors for every quantitative claim.
2. **Per candidate metric: improvement prediction.** Published evidence ranking each candidate as a predictor of objective skill improvement over an 8–12 week window. Where possible, distinguish improvement measured against an objective performance test from improvement measured purely by self-report.
3. **Documented over-instrumentation failures.** Cases where surfacing a metric weekly back-fired in a similar population. Examples to investigate: streak mechanics reducing retention after a missed week ("ghosting after a broken streak"), sRPE being interpreted by users as a recovery prescription rather than a load descriptor, perceived-effort fatigue (rating burden reducing rating quality), confidence ratings inducing avoidance behavior on weeks the user expects to feel less confident.
4. **Noise floors.** Threshold floor below which a given metric is dominated by noise in this population (e.g., "week-to-week sRPE variance below N% reflects measurement noise, not training-state signal" or "single-session drill-completion rate below N drills is dominated by sampling variance"). This matters because we cannot ship a metric whose week-to-week movements are statistically meaningless at the user's actual training dose.
5. **Vendor's ranked recommendation.** The vendor's ranked recommendation for the single metric most likely to predict both adherence AND improvement at the target population, with explicit decision-criteria — i.e., which contexts flip the ranking (e.g., novice vs. intermediate, weekly dose, sport type).
6. **Two-metric pair framing.** Whether the literature supports a "two-metric pair" framing (one load metric + one skill metric) as more defensible than any single metric. If so, what are the documented pairs in similar populations? What is the marginal predictive value of the second metric over the first?
7. **Practitioner intuition section.** What well-known training-app builders, sports-tech writers, and self-coached-amateur coaches say about single-metric vs. multi-metric weekly surfaces. This section is wanted explicitly even though it is not peer-reviewed evidence — practitioner post-mortems on metric design have repeatedly preceded the academic literature in this space.

## Deliverable

A 1,500–3,000 word memo containing:

- **Executive summary (1 page).** Ranking the top 3 candidate metrics with confidence levels and a one-line reasoning for each. Explicit call-out of whether a single-metric or paired-metric weekly readout is more defensible given the evidence.
- **Per-metric evidence ladder.** For each candidate metric, a structured summary of the published evidence with sample sizes, populations, effect sizes (where available), and source citations. A claim without a sample size or population descriptor is of limited value to us.
- **Over-instrumentation failure modes section.** Documented cases where weekly surfacing of a metric produced unintended behavior. Where post-mortems exist (product teams that shipped a metric weekly and then removed or de-emphasized it), surface them — those are gold.
- **Two-metric pair framing section.** Whether one-load + one-skill is more defensible than any single metric. If so, the recommended pair and its evidence.
- **Practitioner intuition section.** Clearly separated from peer-reviewed evidence. Quote-level fidelity preferred where practitioners have written explicitly on this.
- **Gaps section.** What the literature does not answer for this population, and what studies could.
- **Full citation list** with DOIs or stable URLs.

## Priority sources

- **Tier 1 (peer-reviewed).** Sport-science journals (Journal of Sports Sciences, International Journal of Sports Science & Coaching, Medicine & Science in Sports & Exercise, European Journal of Sport Science). Human-computer interaction and self-tracking venues (CHI, CSCW). Behavior-change literature (Annals of Behavioral Medicine, Behaviour Research and Therapy, Health Psychology).
- **Tier 2 (textbooks, used critically).** Bompa (Periodization), Issurin (Block Periodization), Schmidt & Lee (Motor Control and Learning), Fogg (Tiny Habits), Wood (Good Habits, Bad Habits), Eyal (Hooked).
- **Tier 3 (industry case studies).** Reforge retention case studies; published founder retrospectives from training- and health-app companies (e.g., Strava, MyFitnessPal, Strong, Whoop, Future, Caliber, Duolingo, Yousician, Headspace); public app-store / Sensor Tower / App Annie retention reports where they intersect skill-practice or fitness apps.
- **Tier 4 (practitioner).** Established training-app builders' writing on metric design. Quantified-self community writing and academic work from Forlizzi, Li, Dey and equivalents on self-tracking design, abandonment, and the lapsing-user problem.

## Constraints

- Scope explicitly to **adult amateur self-coached athletes** training **1–3 sessions per week** in **skill-sports**. Elite, coached, and high-volume (5+ sessions/week) evidence may inform but should not drive the ranking. Where the literature primarily addresses elite or coached populations, the brief must say so explicitly and explain the extrapolation being used.
- Sample-size and population-descriptor reporting is mandatory for every quantitative claim.
- If the literature is systematically absent on the core question for the target population, say so plainly. That finding itself is useful — it tells us we are shipping into a measurement gap and need to design accordingly.

## Things to flag explicitly

- **Counterintuitive findings.** Any metric that ranks high for adherence but actively destroys measurable improvement, or vice versa. (Example hypothesis worth checking: streaks rank high for short-term adherence but reduce long-horizon retention after a broken streak.)
- **Experience-gradient shifts.** Any evidence that the right ranking shifts across the experience gradient (novices vs. intermediates vs. advanced amateurs).
- **Subjective vs. behavioral divergence.** Any evidence that subjective metrics (perceived confidence, perceived improvement) systematically diverge from behavioral metrics (session count, drill-completion rate) in this population. This matters because an honest weekly readout cannot mix the two without a defensible reason.
- **Shipped-then-removed product post-mortems.** Any well-documented cases where a metric was shipped weekly and then removed or de-emphasized in a similar product. Include the team's stated reasons where available.

## Success criteria

The memo is successful if a product architect can read it and:

- Pick a defensible single metric (or a defensible two-metric pair) for a weekly user-facing readout, with cited evidence behind the choice.
- Trace every ranking and every quantitative claim to a cited source with a sample size and population descriptor.
- See the known over-instrumentation failure modes for the chosen metric in advance, so the team can ship with eyes open.
- Understand which population shifts (experience level, weekly dose, sport type) would flip the ranking.

## Timeline and format

- Expected turnaround: 2–3 weeks. Please flag early if that is unrealistic for this scope.
- Format: single markdown document, plain prose plus tables where useful.
- Include a one-page executive summary at the top.
- If the literature is systematically absent on the core question for the target population, that finding is itself valuable — please say so plainly rather than extrapolating from non-analogous populations.
