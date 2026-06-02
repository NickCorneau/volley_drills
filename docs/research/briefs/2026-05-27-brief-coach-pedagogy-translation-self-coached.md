---
id: brief-coach-pedagogy-translation-self-coached-2026-05-27
title: "Research brief: Translation of coach-presence pedagogy techniques to self-administered training apps"
type: research
status: draft
stage: validation
authority: "Vendor-facing research brief. Content below the '--- BRIEF ---' marker is the text intended for the vendor; the frontmatter above is internal-only."
summary: "Self-contained research brief asking whether two coach-presence pedagogy techniques — athlete-set per-session goal aligned to the practice focus, and coach-stated forward-looking outcome promise — retain their behavioral effect when delivered self-administered through a training app, or whether the effect is dominated by interpersonal coach-presence and so does not translate. Target population: adult recreational athletes in skill-sports, 2–5 years experience, 1–3 sessions/week, self-coached. Deliverable is a 1,500–3,000-word memo with per-technique verdict (translates / does not translate / partially translates / literature insufficient), confidence level, recommended framings if translation is defensible, and a pair-compounding section."
last_updated: 2026-05-27
internal_motivation: "Directly resolves O22 (per-session goal capture, BAB Coaches Guide Essay 3 — 'athletes set a personal goal aligned to the practice focus') and O23 (forward-looking outcome promise, BAB Coaches Guide Essay 2 — 'By the end of practice, you should feel more confident in this skill') in docs/decisions.md. Both are M002 design decisions currently underdetermined on the question 'does the coach pedagogy translate or not?'; BAB Coaches Guide source archive explicitly noted these as carry-forward for a post-M001 weekly-confidence surface. Compounds into all M002 reflection-surface design choices, future review-surface feedback design, Phase 2 coach-clipboard hypothesis grounding, and copy/voice decisions across the app. 2-frame convergence in the 2026-05-27 ideation pass (pain, leverage). Passes the substitution-check: pedagogy + adjacent-app evidence is precisely an outside scholar's territory; founder cannot produce this from inside the build, and dogfood will tell the team how a chosen surface feels for two users, not whether the underlying pedagogical mechanism translates."
---

# Research brief: Translation of coach-presence pedagogy techniques to self-administered training apps

> This brief is intended to be sent to an external research vendor. The body below is self-contained — no prior project context is required. Copy or forward the content below the "--- BRIEF ---" marker as needed.

--- BRIEF ---

## Context

We are designing a local-first mobile training application for adult recreational athletes in skill-sports who train without a coach. Target users are adults with two to five years of recreational experience, training one to three times per week, often alone or with a single training partner. The app guides the user through a structured session: the user picks a skill focus, runs a sequence of drills, and reviews the session afterward.

We are deciding whether to add two session-framing surfaces drawn from established coaching pedagogy. Both surfaces are well-documented in coached team-sport contexts but have not been clearly validated for self-administered delivery.

The two candidate surfaces are:

- **Technique A — Athlete-set per-session goal aligned to the practice focus.** At session start, the app prompts the user to write or select a personal goal tied to the chosen focus. Example wording from coached contexts: at the start of a passing-focused practice, the athlete writes a personal goal such as "work on platform stability" or "pass off the body line."
- **Technique B — Forward-looking outcome promise.** At session start, the app states a forward-looking outcome the user can expect by session end. Example wording from coached contexts: "Today we're concentrating on passing. By the end of practice, you should feel more confident in this skill."

Both moves are friction-bearing additions to a quick-start session loop. Both come from coach-pedagogy literature where an interpersonal coach is in the loop. We do not know whether the underlying behavioral effect transfers when these moves are delivered by an app.

This research informs whether we ship one, both, or neither — and if we ship, what specific framings we use.

## Research question

When two coach-presence pedagogy techniques — (A) athlete-set per-session goal aligned to the practice focus, and (B) coach-stated forward-looking outcome promise — are translated from a coached context to a self-administered training app, do they retain their behavioral effect, or is the effect dominated by interpersonal coach presence and accountability such that app-mediated delivery produces only friction?

For each technique, the verdict must be one of:

- **Translates** — the effect survives self-administered delivery with comparable magnitude under at least one well-supported framing.
- **Partially translates under specific framings** — the effect survives only under certain framings, which the brief names with citations.
- **Does not translate** — the effect is dominated by interpersonal mechanisms (coach gaze, social pressure, expected later questioning) and self-administered delivery is a hollow imitation that adds friction without behavioral lift.
- **Literature insufficient to answer** — the question has not been studied with enough rigor in the relevant population to support a verdict; the brief should say what study would close the gap.

Force the choice per technique. Do not split the difference. State a confidence level for each verdict.

## Why this is non-obvious

Both techniques have published evidence of behavioral effect in coached contexts. The sport-psychology goal-setting literature is large; the literature on coach framing, expectancy, and pre-performance priming exists.

The mechanism question is the hard part. The behavioral effect in coached contexts may be carried by:

- the goal-setting or framing act itself (cognitive priming, attentional narrowing, expectancy);
- the interpersonal accountability — the coach's gaze, social pressure, the felt expectation that the athlete will be asked about the goal or the promised outcome later;
- some combination of the two, with the mix differing by population and by framing.

If interpersonal accountability is doing most of the work, app-mediated delivery removes the active ingredient and leaves a hollow ritual that adds friction without behavioral lift. If the cognitive component survives translation under specific framings, then the team needs those specific framings cited. The same logic applies to both techniques but the mix may differ between them; one may translate while the other does not.

We could not find a single authoritative answer to this question on first-pass search. We want an honest synthesis that addresses the mechanism question explicitly.

## Key sub-questions to address

### For Technique A (athlete-set per-session goal aligned to the practice focus)

1. **Empirical evidence in coached contexts.** Effect-size data for athlete-set per-session goals on (a) within-session focus and engagement, (b) skill consolidation, (c) longitudinal adherence. Sample sizes and population descriptors required for every quantitative claim.
2. **Mechanism evidence.** Is the effect attributable to goal-setting per se, to coach-mediated accountability, or to both? Cite studies that decomposed the mechanism — e.g., goal-setting with versus without coach review, written-goal-only conditions, anonymous-goal conditions.
3. **Translation evidence.** Studies, programs, or apps where athlete-set per-session goals were delivered self-administered (without a coach reviewing them) and the behavioral effect was measured. What framings worked? What framings failed? Effect sizes and sample sizes throughout.
4. **Adjacent self-administered analogues.** In non-sport self-coaching domains — language-learning apps, music-practice apps, meditation apps, productivity apps, fitness apps — what session-start goal-setting patterns have shipped and shown durable effect? What design moves accompany them (goal review at session end, goal carry-forward across sessions, goal accountability via streak, public commitment, partner visibility)?
5. **Failure modes.** Documented cases where self-administered session-goal capture added friction without measurable behavioral lift, or where it drove users away. Any evidence of monitoring-self-criticism loops in amateur populations where the act of goal-setting becomes a recurring source of self-criticism rather than direction.

### For Technique B (forward-looking outcome promise)

6. **Empirical evidence in coached contexts.** Effect-size data for coach-stated outcome promises on (a) session engagement, (b) post-session perceived value, (c) self-rated confidence change, (d) longitudinal retention or adherence. Sample sizes and population descriptors required.
7. **Mechanism evidence.** Is this expectancy/placebo, framing effect, social pressure, or genuine attentional priming? Cite studies that compared neutral-description framing against forward-looking outcome framing under controlled conditions, and any that decomposed the placebo / priming / accountability components.
8. **Translation evidence.** Cases where app-mediated outcome promises were delivered to users and measured against control framings (neutral description vs forward-looking promise vs goal-fulfillment framing). What framings worked? What framings rang hollow or damaged trust?
9. **Adjacent analogues.** In non-sport apps — mood / meditation apps, learning apps, fitness apps, sleep apps — what pre-session forward-looking framings have shipped, and what evidence supports them? Specifically: any A/B-tested copy patterns from shipped products with published results.
10. **Failure modes.** Documented cases where outcome promises rang as motivational fluff to self-administered users; where they damaged trust if the promised outcome did not materialize; where users disengaged after repeated unfulfilled promises.

### For the pair (A + B together)

11. **Compound or compete?** If both ship in the same loop (input goal at session start + output promise at session start + post-session reflection that closes the loop on both), does the pair compound (mutually reinforcing surfaces around a focused session) or do they compete for attention and produce surface clutter? Any literature on the pair specifically — for example, studies of pre-performance routines that combined goal-setting with expectancy framing.

## Deliverable

A 1,500–3,000 word memo containing:

- **Executive summary (one page).** Per-technique verdict (translates / partially translates under specific framings / does not translate / literature insufficient) with stated confidence level. The summary alone should be enough for a product designer to make the ship/no-ship call for each technique.
- **Per-technique evidence ladder.** For each of Technique A and Technique B: mechanism evidence, translation evidence, adjacent-analogue evidence, and failure-mode evidence — with sample sizes and effect sizes throughout. Coached-context evidence and self-administered evidence must be visually or structurally separated so the reader can see at a glance which body of evidence is carrying the verdict.
- **Recommended framings (if translation is defensible).** For any technique judged to translate fully or partially, give exact item wording or copy patterns with citations to the specific studies or shipped programs that support each pattern. Where a pattern is recommended on practitioner authority rather than empirical evidence, label it clearly.
- **Pair-compounding section.** Whether shipping both together is supported, neutral, or counterproductive — with whatever evidence exists. Where evidence is absent, say so plainly.
- **Practitioner intuition section.** What experienced sport-psychology practitioners and coaches say about translating these techniques to self-administered contexts. Clearly separated from peer-reviewed evidence.
- **Gaps section.** What the literature does not answer, and what specific study (population, design, sample size) could answer it.
- **Full citation list** with DOIs or stable URLs.

## Priority sources

- **Tier 1 (peer-reviewed).** Sport-psychology journals (Journal of Sport & Exercise Psychology, Psychology of Sport and Exercise, International Journal of Sport Psychology, The Sport Psychologist); goal-setting literature (Locke & Latham); coaching-effectiveness literature (Côté, Gilbert); motor-learning (Schmidt/Lee, Wulf); behavior-change literature (Annals of Behavioral Medicine, Health Psychology Review, Journal of Behavioral Medicine); HCI venues for self-tracking and self-coaching (CHI, CSCW, IJHCS).
- **Tier 2 (foundational texts).** Locke & Latham (A Theory of Goal Setting & Task Performance), Côté on coaching effectiveness, Magill (Motor Learning and Control), Wulf (Attention and Motor Skill Learning), Zimmerman on self-regulation in learning, Fogg (Tiny Habits), Michie (Behavior Change Wheel).
- **Tier 3 (sport-specific).** Established coaching curricula on session-framing and athlete-goal-setting, drawn from federations across racquet, court, and skill sports. Cite where the curriculum is the source.
- **Tier 4 (practitioner).** Published methodology from sport-psychology practitioners; design writing and post-mortems from self-coaching apps that have shipped session-start goal-capture or session-start framing — language apps, music-practice apps, meditation apps, fitness apps, climbing apps. Published post-mortems where these features were removed are particularly valuable.

## Constraints

- Scope explicitly to **adult recreational, self-coached, 1–3 sessions/week, skill-sport** users. Elite or coached or clinical evidence may inform the synthesis but should not drive the verdict. Where the literature primarily addresses elite or coached populations, say so explicitly and reason carefully about which mechanisms transfer.
- **Sample-size and effect-size reporting is mandatory** for every quantitative claim. A coefficient or claim without a sample size and population descriptor is of limited value.
- **Force the verdict per technique.** The verdict for each of Technique A and Technique B must be one of: translates / partially translates under specific framings / does not translate / literature insufficient. Do not split the difference. State a confidence level.

## Things to flag explicitly

- **Counterintuitive findings.** For example: goal-setting backfires in self-administered amateur populations because of monitoring-self-criticism loops; or outcome promises improve subjective experience but worsen retention.
- **Asymmetric translation.** Any evidence that one of the two techniques translates while the other does not.
- **Direct app post-mortems.** Any case where the published post-mortem of a shipped self-coaching feature directly tested one of these techniques.
- **Substitutes for social accountability.** Any evidence that the social-accountability mechanism can be partially substituted by structured app surfaces — a visible commitment to a training partner, a public training log, a paired-with-friend mode, an end-of-session reflection that asks the user to assess against their stated goal.
- **Framing-specific findings.** Evidence that one framing works and an adjacent framing fails — for example, "by the end of practice you should feel more confident" working while "by the end of practice you will be a better passer" fails. Where such gradients exist, the brief should report them with the exact wording compared.

## Success criteria

The memo is successful if a product designer can read it and:

- Decide whether to ship per-session goal-capture, the forward-looking outcome promise, both, or neither — with cited evidence for the call.
- If shipping, take a recommended item wording or copy pattern off the page with citation.
- If not shipping, defend the rationale to a stakeholder pushing for the feature.
- Trace every quantitative claim to a cited source, sample size, and population descriptor.
- Understand which gap in the literature would most change the answer.

## Timeline and format

- Expected turnaround: 2–3 weeks. Please flag early if that is unrealistic for this scope.
- Format: single markdown document, plain prose plus tables where useful.
- Please include a one-page executive summary at the top.
- If the literature is systematically absent on the self-administered translation question for either technique, that finding is itself valuable — please say so plainly rather than extrapolating from coached or elite populations, and propose the specific study (population, design, sample size) that would close the gap.
