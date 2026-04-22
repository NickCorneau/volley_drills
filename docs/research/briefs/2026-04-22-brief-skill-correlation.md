---
id: brief-skill-correlation-2026-04-22
title: "Research brief: Cross-skill correlation in amateur beach volleyball skill development"
type: research
status: draft
stage: validation
authority: "Vendor-facing research brief. Content below the '--- BRIEF ---' marker is the text intended for the vendor; the frontmatter above is internal-only."
summary: "Self-contained research brief asking whether amateur beach volleyball players' skill levels across passing, serving, and setting are correlated enough to model with a single scalar, or independent enough to justify a per-skill vector model. Target population: adults, 2-5 years recreational, 1-3 sessions/week, no coach. Deliverable is a ~1500-3000-word memo with headline answer (correlation estimate with confidence), evidence summary, practitioner intuition, and product-design implications."
last_updated: 2026-04-22
internal_motivation: "Directly informs the per-skill user-level taxonomy decision (decisions.md O21). If cross-skill correlation is high (>0.75) the current single-scalar `storageMeta.onboarding.skillLevel` (D-C4 / D121) is the right long-term shape; if low (<0.4) the Phase 1.5 work needs to expand `PlayerProfileDoc` with per-skill bands. This is the highest strategic-architecture payoff of the three 2026-04-22 briefs."
---

# Research brief: Cross-skill correlation in amateur beach volleyball skill development

> This brief is intended to be sent to an external research vendor. The body below is self-contained — no prior project context is required. Copy or forward the content below the "--- BRIEF ---" marker as needed.

--- BRIEF ---

## Context

We are designing a local-first mobile training application for adult amateur beach volleyball players who train without a coach. Target users are adults with two to five years of recreational experience, training one to three times per week. The app assembles practice sessions from structured drill templates and adapts future sessions based on perceived difficulty and completion signals.

We are deciding how to model a user's skill state internally. The two candidate models are:

- **Single-scalar model**: one overall "level" value (e.g., beginner / intermediate / advanced) applies to all skills.
- **Per-skill vector model**: the user carries separate skill levels for passing, serving, and setting (e.g., a player could be "fundamentals setter, intermediate passer, advanced server").

The per-skill model is more flexible but significantly more complex to build, surface, and maintain. The single-scalar model is simpler but loses signal if real amateur players have genuinely asymmetric skill profiles.

This research informs that architectural decision.

## Research question

In amateur beach volleyball players (adult, 2–5 years recreational experience, training 1–3 times per week without a coach), what is the observed correlation between skill competencies across **passing (reception), serving, and setting**? Specifically: to what extent does improvement in one skill predict or accompany improvement in another, and to what extent are skill levels across these three dimensions independent versus coupled?

If cross-skill correlation is very high (e.g., Pearson r > 0.75) a single scalar captures most variance and per-skill modeling is over-engineering. If correlation is low (r < 0.4) per-skill tracking is justified and the product should build data structures and UX around the multi-dimensional model. Mid-range answers require qualitative context to adjudicate.

## Why this is non-obvious

Volleyball requires every player (especially in beach volleyball, which plays 2 versus 2) to pass, set, and attack in the same rally — unlike indoor, where specialization allows a libero to pass almost exclusively. This suggests coupled skill development by exposure. However, motor-learning literature suggests skills rooted in distinct motor patterns (e.g., a platform pass is a very different motor pattern from an overhead set or a serve toss) can develop at different rates. Amateur players with narrow practice time may prioritize certain skills and neglect others, amplifying asymmetry. Physical attributes (height for serving, reaction time for passing, fine motor control for setting) may also create uneven development.

We could not find a single authoritative answer to this question on first-pass search. We want an honest synthesis.

## Key sub-questions to address

1. **Direct empirical evidence.** Do any studies report cross-skill correlation coefficients for amateur volleyball players (beach or indoor)? If so, what magnitudes? Include sample sizes and population descriptors. If beach-specific studies are absent, report indoor-adult-recreational data with clear extrapolation caveats.
2. **General-motor-ability evidence.** Does the literature distinguish a "general volleyball ability" factor from skill-specific technical development? How strong is the g-factor-equivalent in volleyball skill assessment? Any factor-analytic studies?
3. **Elite versus amateur asymmetry.** Does asymmetry across skills differ between elite and amateur populations? Do elite players converge (uniformly high across all skills) while amateurs diverge? Or the reverse?
4. **Skill-specific development rate.** For each skill: what factors drive development rate? Is serving more physical-attribute-dominated, passing more reaction-time-dominated, setting more fine-motor-dominated? Are any of these asymmetrically easier or harder to acquire?
5. **Beach-specific considerations.** Does the forced-3-touch beach format (no specialization, every player must pass/set/attack) cause tighter cross-skill coupling than indoor? Any observational or comparative evidence?
6. **Motor-learning theory.** What do Schmidt, Magill, Wulf, or equivalent motor-learning authorities say about skill transfer within related skills (striking, platform/forearm contact, overhead release)? Do these share motor primitives that force them to develop together, or are they distinct motor programs?
7. **Practitioner intuition.** What do established coaches say about skill-development asymmetry in amateur players? Specific quotes or methodology writings are valuable.

## Deliverable

A 1,500–3,000 word memo containing:

- **Headline answer** — a defensible point estimate (with a range and stated confidence level) of the cross-skill correlation among adult amateur beach volleyball players, OR a clearly stated "the literature does not support a quantitative answer" with a description of what would be needed to produce one.
- **Evidence summary** — what specific sources support the answer, with citations and brief paraphrases of key findings. Include sample sizes and population descriptors for every quantitative claim.
- **Practitioner intuition section** — what established coaches say about skill-development asymmetry in amateur players, clearly separated from empirical evidence.
- **Product-design implications section** — a 300–500 word discussion of whether a single-scalar or per-skill model is more defensible given the evidence. Include edge cases that would flip the answer (e.g., "if users are primarily in their first two years, per-skill matters more").
- **Gaps section** — what the literature does not answer, and what studies could answer it.
- **Full citation list** with DOIs or stable URLs.

## Priority sources

- **Tier 1 (peer-reviewed):** Motor-learning journals (Human Movement Science, Journal of Motor Behavior, Research Quarterly for Exercise and Sport), sports science journals (Journal of Sports Sciences, International Journal of Sports Science & Coaching), skill-acquisition and expertise literature.
- **Tier 2 (textbooks):** Schmidt & Lee (Motor Control and Learning), Magill (Motor Learning and Control), Wulf (Attention and Motor Skill Learning), Ericsson expertise research.
- **Tier 3 (sport-specific):** Volleyball coaching curricula that address skill-development sequencing (FIVB, USAV, AVCA, Volleyball Canada). Longitudinal development studies of volleyball players across any age cohort, with flags where extrapolation from elite or youth cohorts to amateur adults is required.
- **Tier 4 (practitioner):** Published methodology from established coaches. Cite as practitioner intuition, clearly distinguished from evidence.

## Constraints

- Scope explicitly to **adult amateur** players with **2–5 years of recreational experience**. Young-adolescent, youth-academy, and collegiate/elite data may inform but should not drive the answer. If the literature primarily addresses elite or youth populations, say so explicitly and explain the extrapolation being used.
- Sample-size reporting is mandatory: a correlation coefficient without a sample size or population descriptor is of limited value to us.

## Things to flag explicitly

- Any counterintuitive findings (e.g., certain subpopulations show unexpectedly asymmetric development).
- Any evidence that asymmetry shifts across the experience gradient (amateurs diverge, elite converge, or vice versa).
- Any known cultural or training-environment effects (e.g., European academy development patterns versus US recreational patterns).
- If the literature is systematically absent on this question, say so plainly — that itself is a useful finding for us.

## Success criteria

The memo is successful if a product architect can read it and:

- Pick between a single-scalar and per-skill user-skill model with defensible reasoning.
- Understand the population caveats that constrain the answer.
- Know which gap in the literature would most change the answer.
- Trace every quantitative claim to a cited source and sample size.

## Timeline and format

- Expected turnaround: 2–3 weeks. Please flag early if that's unrealistic for this scope.
- Format: single markdown document, plain prose plus tables where useful.
- Please include a one-page executive summary at the top.
- If the literature is systematically absent on the core question, that finding is itself valuable — please say so plainly rather than extrapolating from non-analogous populations.
