---
id: brief-subjective-skill-confidence-validity-2026-05-27
title: "Research brief: Construct validity of weekly self-rated skill confidence as a longitudinal skill-development proxy in adult recreational athletes"
type: research
status: draft
stage: validation
authority: "Vendor-facing research brief. Content below the '--- BRIEF ---' marker is the text intended for the vendor; the frontmatter above is internal-only."
summary: "Self-contained research brief asking whether a single-item weekly self-rated skill confidence reading carries usable construct validity as a longitudinal skill-development proxy for adult recreational athletes in skill-sports (volleyball, tennis, golf, climbing, racquet sports), training 1-3 sessions/week, self-coached. Specifically: does weekly self-rated confidence track real skill change, or is it dominated by recency, mood, soreness, and last-session-outcome confounds? Deliverable is a ~1500-3000-word memo with headline answer (with confidence), recommended single-item scale format and wording, known failure modes, comparison to behavioral proxies, practitioner intuition, and gaps."
last_updated: 2026-05-27
internal_motivation: "Directly informs O21 sub-question (b) state-establishment mechanism and (c) storage shape for the per-skill user-level taxonomy. Gates O23's forward-looking outcome promise design — only ship a 'by end of practice you should feel more confident' promise if weekly confidence is a defensible readout, not noise. Coordinates with sibling brief 1 (`single-tracked-metric-amateur-skill-apps`) on M002's skill-proxy field choice: this brief specifically addresses the validity of the subjective-confidence option, while the keystone-metric brief covers the broader 'which metric' ranking. The Mabe & West 1982 athletics self-scoring anchor (r ≈ 0.47) already cited in `docs/research/baseline-skill-assessments-amateur-beach.md` covers *performance* self-scoring, not *confidence* self-rating — different psychometric question. 3-frame convergence in the 2026-05-27 ideation pass (pain, inversion, leverage). Compounds into all future review surfaces, baseline-test rollups, and any 'skill status' rollup component. Passes the substitution-check: psychometric construct validity needs population-level evidence; founder + Seb dogfood cannot establish whether a given format holds up at N>2."
---

# Research brief: Construct validity of weekly self-rated skill confidence as a longitudinal skill-development proxy in adult recreational athletes

> This brief is intended to be sent to an external research vendor. The body below is self-contained — no prior project context is required. Copy or forward the content below the "--- BRIEF ---" marker as needed.

--- BRIEF ---

## Context

We are designing a local-first mobile training application for adult recreational athletes in skill-sports — volleyball, tennis, golf, climbing, racquet sports, and similar movement-skill domains. Target users are adults with two to five years of recreational experience, training one to three times per week, self-coached (no expert in the loop), with no clinical context. Sessions are typically assembled from structured drill templates, and the app aims to give users a weekly user-facing readout of how their skill is developing over time.

We are deciding whether to ship a weekly self-rated **skill confidence** reading as that user-facing progress signal. The candidate is a single-item self-report — a Likert scale, a visual analog scale (VAS), or a descriptive-anchor scale — asked at a fixed weekly cadence (not in-session, not pre/post-competitive-event), and shown back to the user as a longitudinal trace.

The alternative is to drop subjective confidence and instead surface a behavioral proxy (e.g., session count, drill-completion rate, weakest-skill drill volume). Subjective confidence is appealing because it is one-tap, generalizes across sports, and may correlate with intrinsic motivation. The risk is that it is dominated by short-horizon noise — last session's outcome, mood, soreness, recency bias — and therefore communicates nothing useful about real skill change at week-to-week granularity.

This research informs that product decision and, if the answer is "ship it", the specific scale format and item wording.

## Research question

For adult recreational athletes in skill-sports (training 1–3 sessions/week, self-coached), what is the construct validity of weekly self-rated skill confidence — measured via a single-item Likert, VAS, or descriptive-anchor scale — as a longitudinal proxy for actual skill development?

Specifically: does week-to-week self-rated confidence track real skill change, or is it dominated by recency, mood, soreness, and last-session-outcome confounds?

A defensible answer requires distinguishing:

- **State** confidence (today / this week) from **trait** confidence (general / dispositional).
- **Confidence** rating ("how confident do you feel in this skill") from **performance self-scoring** ("rate your last performance"). These are different psychometric constructs and the prior literature on the latter does not automatically transfer to the former.
- **Weekly** self-administration from **session-end** momentary self-administration and from **pre/post-event** administration. The cadence and context materially change what is being measured.

## Why this is non-obvious

Sport psychology has decades of self-efficacy and sport-confidence work — Bandura's self-efficacy framework, Vealey's Sport Confidence Inventory and its successors, Feltz on self-efficacy in sport — but the bulk of this literature was developed for competitive elite or sub-elite populations, focuses on trait confidence rather than weekly state confidence, and uses multi-item scales that exceed the one-tap, courtside-friction budget of an amateur self-tracking app. Whether a single-item weekly confidence reading carries usable construct validity in a low-stakes, low-frequency, app-mediated context is much sparser in the literature.

Adjacent literatures hint at specific failure modes but rarely with effect sizes at the target population:

- **Dunning–Kruger and novice overestimation.** Low-skill performers tend to overestimate their ability and may not detect early-stage improvement at the rate expected.
- **Plateau-blindness in intermediate performers.** Mid-experience players in skill-sports often experience real-but-slow improvement that sits below the perception threshold for weeks at a time, producing flat or even declining subjective confidence during periods of real gain.
- **Recency bias and state-measure confounds.** Single-item weekly self-reports of subjective state measures (mood, fatigue, confidence) are well-documented to be sensitive to the most recent salient event, time of day, soreness, mood, and contextual mood priming.

The literature also does not, to our knowledge on first-pass search, converge on a recommended scale format (5-point Likert vs 7-point Likert vs 11-point Likert vs VAS vs descriptive-anchor change scales like "less confident / same / more confident than last week") for this specific use case. Effect sizes for the trade-off between sensitivity and noise across these formats, at this population and cadence, would materially change the product decision.

We could not find a single authoritative answer to this question on first-pass search. We want an honest synthesis.

## Key sub-questions to address

1. **State versus trait confidence.** What is the empirical distinction between weekly state confidence (today / this week) and trait confidence (general / dispositional)? Which one does a weekly single-item self-report actually measure, and what is the test-retest reliability and convergent-validity evidence for state confidence in adult recreational populations specifically? Report sample sizes and population descriptors.
2. **Scale format evidence.** Across single-item formats — 5-point Likert, 7-point Likert, 11-point Likert, visual analog scale (VAS), and descriptive-anchor change scales (e.g., "less confident / same / more confident than last week") — what is the comparative test-retest reliability under repeated weekly self-administration? Report intraclass correlation coefficients (ICCs), Cronbach's alpha if applicable across short batteries, or other reliability statistics with sample sizes.
3. **Known confounds.** What are the published effect sizes for recency, mood, soreness/fatigue, last-session-outcome, and other state confounds on weekly self-rated confidence in adult amateur populations? Which confound dominates, and how large is its effect relative to plausible week-to-week true skill change at this training frequency (1–3 sessions/week)?
4. **Novice overestimation and plateau-blindness.** What is the evidence for Dunning–Kruger-style novice overestimation in adult amateur skill-sport contexts? What is the evidence for plateau-blindness in intermediate (2–5 year) players — where real but slow improvement falls below the subjective-perception threshold? Are these biases symmetric or directional, and are they observed in self-coached populations specifically?
5. **Framings that hold up versus framings that collapse.** What specific weekly self-report item framings have published evidence of holding construct validity under low-stakes self-tracking, and which framings have published evidence of collapsing? Of particular interest: "rate your confidence in skill X" versus "rate your improvement in skill X since last week" versus "rate how today's session changed your confidence in skill X" versus a global "how confident are you in your overall game right now". Effect sizes or qualitative findings either way.
6. **Comparison to behavioral proxies.** Does weekly self-rated confidence have higher, lower, or comparable construct validity to behavioral proxies (session count, drill-completion rate, weakest-skill volume, longitudinal practice-time tracking) as a longitudinal skill-development indicator at this population? If both are available, do they correlate? Diverge? Capture different things?
7. **Practitioner intuition.** What do established sport-psychology practitioners working with adult recreational populations say about whether to include subjective confidence on a weekly user-facing readout? What do designers of shipped self-coaching apps with relevant readouts (e.g., music-practice apps with self-rated mastery, language-learning apps with confidence-style features, meditation apps with mood traces, sport-specific recreational training apps) say about which framings they kept versus abandoned, and why?

## Deliverable

A 1,500–3,000 word memo containing:

- **Executive summary (≤ 1 page).** Headline answer to the core question: does weekly self-rated skill confidence carry usable construct validity at the target population, under what framing, with what stated confidence level? If the answer is no, what behavioral proxy is the strongest alternative?
- **Recommended scale format and item wording.** A specific recommendation — single-item format, anchor labels, exact item text — with cited evidence for the choice. If multiple formats are equally defensible, present them with trade-offs.
- **Evidence summary per sub-question.** Each sub-question above should have a paragraph (or short subsection) summarising the evidence, with sample sizes and population descriptors for every quantitative claim.
- **Known failure-modes section.** Which confounds dominate at this population and cadence, which subpopulations show systematic bias (direction included — over- or under-estimation), and what design mitigations are supported by published evidence.
- **Comparison-to-behavioral-proxies section.** Construct-validity comparison between subjective confidence and the strongest behavioral alternatives, with an opinionated recommendation if the evidence supports one.
- **Practitioner intuition section.** Clearly separated from peer-reviewed evidence. Specific quotes or methodology writings are valuable.
- **Gaps section.** What the literature does not answer, and what studies would be needed to answer it.
- **Full citation list** with DOIs or stable URLs.

## Priority sources

- **Tier 1 (peer-reviewed).** Sport-psychology journals (Journal of Sport & Exercise Psychology, Psychology of Sport and Exercise, International Journal of Sport Psychology, The Sport Psychologist); measurement-science journals (Educational and Psychological Measurement, Psychological Methods, Psychological Assessment); HCI for self-tracking (CHI, CSCW, Personal and Ubiquitous Computing).
- **Tier 2 (foundational texts).** Bandura (Self-Efficacy: The Exercise of Control); Vealey's Sport Confidence Inventory and follow-on work; Feltz (Self-Efficacy in Sport); Schmidt & Lee (Motor Control and Learning) and Magill (Motor Learning and Control) for skill-development priors.
- **Tier 3 (sport-specific).** Established self-confidence assessment instruments in adult recreational sport contexts. Note that most published instruments target elite or clinical-adjacent contexts; flag explicitly where extrapolation to the target population is required.
- **Tier 4 (practitioner).** Published methodology from sport-psychology practitioners working with adult recreational athletes. Design writing from self-coaching apps that have shipped and iterated on confidence-style, mood-style, or self-rated-mastery readouts (e.g., music-practice, language-learning, meditation, recreational sport-training apps). Post-mortems, public design retrospectives, and engineering blog posts are in scope.

## Constraints

- Scope explicitly to **adult recreational** athletes with **2–5 years of experience** in **skill-sports** (volleyball, tennis, golf, climbing, racquet sports, and similar movement-skill domains — **not** pure endurance, **not** pure strength), training **1–3 sessions/week**, **self-administered weekly** (**not** in-session, **not** pre/post-competitive-event, **not** competitive context, **not** clinical).
- Distinguish weekly **state** confidence from session-end **momentary** confidence — these are different questions and the evidence rarely transfers cleanly.
- Distinguish **confidence rating** from **performance self-scoring** — the latter is a different psychometric question with its own established literature, and a claim about one does not automatically support a claim about the other.
- **Sample-size reporting is mandatory for every quantitative claim.** A reliability coefficient, correlation, or effect size without a sample size and population descriptor is of limited value.
- If the target-population evidence is thin, say so plainly and reason carefully about which adjacent-population evidence transfers and which does not. Extrapolation is acceptable; silent extrapolation is not.

## Things to flag explicitly

- **Counterintuitive findings.** For example, a scale format that works well in elite populations but collapses in amateurs, or vice versa. A framing that is intuitive to designers but has published evidence of degrading validity.
- **Framing-conditional validity.** Any evidence that construct validity is materially higher under specific item framings — e.g., "since last week" change-anchored framings versus "right now" momentary framings versus "in general" trait framings.
- **Systematic bias direction.** Whether novices systematically over- or under-estimate, whether intermediates show plateau-blindness in a particular direction, whether there are gender, age, or sport-specific systematic biases at the target population.
- **Shipped post-mortems.** Cases of published self-coaching-app or self-tracking-app retrospectives where a confidence-style or self-rated-mastery readout was shipped and subsequently removed, deprecated, or substantially reframed. What did they observe? What replaced it?
- **Literature absence.** If the literature is systematically absent on the target population at this cadence and self-administration mode, say so plainly. That itself is a useful finding.

## Success criteria

The memo is successful if a product architect can read it and:

- Decide whether to ship a weekly self-rated skill-confidence readout as the user-facing skill-progress signal, with defensible reasoning and a cited evidence base.
- Pick a specific scale format and item wording (single-item, anchor labels, exact item text) with rationale.
- Anticipate the known failure modes well enough to design mitigations (e.g., debiasing prompts, framing choices, or selective subpopulation suppression) or to pick a behavioral alternative instead.
- Compare the subjective option fairly against the strongest behavioral proxy alternative.
- Trace every quantitative claim to a cited source, sample size, and population descriptor.

## Timeline and format

- Expected turnaround: 2–3 weeks. Please flag early if that's unrealistic for this scope.
- Format: single markdown document, plain prose plus tables where useful.
- Please include a one-page executive summary at the top.
- If the literature is systematically absent on the target population at this cadence and self-administration mode, that finding is itself valuable — please say so plainly rather than extrapolating silently from non-analogous populations.
