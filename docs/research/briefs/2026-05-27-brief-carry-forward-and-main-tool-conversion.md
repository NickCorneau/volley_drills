---
id: brief-carry-forward-and-main-tool-conversion-2026-05-27
title: "Research brief: Continuity-across-sessions UX patterns and adherence interventions in self-coached low-frequency training apps"
type: research
status: draft
stage: validation
authority: "Vendor-facing research brief. Content below the '--- BRIEF ---' marker is the text intended for the vendor; the frontmatter above is internal-only."
summary: "Self-contained two-part research brief asking (a) which continuity-across-sessions UX patterns earned 'main-tool' status in self-coached training, health, or skill-acquisition apps used by adult amateurs at low practice frequency (1-3 sessions per week), and (b) which behavior-change intervention surfaces causally moved adherence vs. which look helpful but had null or negative effects in that population. Target population: self-coached adult amateurs, 1-3 sessions per week, skill-acquisition / training / health-adherent context (not entertainment, social, or pure consumption). Deliverable is a 1,500-3,000 word memo with separate headline answers and confidence levels for (A) and (B), a per-intervention effect-size table, a failure-mode catalog, a recommended starter pattern set, and a gaps section."
last_updated: 2026-05-27
internal_motivation: "Directly informs M002 (Weekly Confidence Loop) carry-forward UX design — specifically the visible carry-forward from Complete → Home → next session, the shallow 2-6 session queue, and the minimal weekly receipt. Operationalizes the D91 retention gate's success criterion: 'users report the product replaced or meaningfully reduced notes/PDFs/memory' (the literal main-tool-conversion question). Compounds into the cohort-decision criteria at 2026-07-20 and into all future analytics/progress surfaces. 2-3-frame convergence in the 2026-05-27 ideation pass (pain, leverage, cross-domain). Passes the substitution-check (No / Partial): the 2026-07-20 cohort will validate one chosen pattern but cannot survey alternatives across a category of apps; population-level intervention efficacy needs cross-app evidence. Folds in adjacent rejected candidates from the ideation pass: drill self-selection bias (intervention-correction angle), habit-formation cue architecture for low-frequency practice, non-streak wellness receipts, sparse-data confidence narratives."
---

# Research brief: Continuity-across-sessions UX patterns and adherence interventions in self-coached low-frequency training apps

> This brief is intended to be sent to an external research vendor. The body below is self-contained — no prior project context is required. Copy or forward the content below the "--- BRIEF ---" marker as needed.

--- BRIEF ---

## Context

We are designing a local-first mobile training application for adult amateur athletes who train without a coach. Target users are adults practicing one to three times per week who are responsible for selecting, sequencing, and reviewing their own practice. The application assembles practice sessions from structured templates, captures lightweight signals during and after each session, and is intended to become the user's primary record of their training over time — replacing the notes apps, paper notebooks, spreadsheets, photo libraries, and unaided memory that adult amateurs typically use today.

Two design questions drive this research, and they are scoped together because the answers interact:

- **Continuity across sessions.** What does the application show a returning user about their previous session, their planned next session, and their week as a whole? Candidate surfaces include a next-session prompt visible on the home screen, a "since last time" pane, deferred-decision capture (the application remembers what the user said they would work on next), partial-state resumption, journal-style continuity, weekly recaps in various formats, and several others. We need to know which of these patterns have earned "main-tool" status in shipped products — that is, which patterns are present in apps where users self-report that the app has replaced or meaningfully reduced their reliance on notes, spreadsheets, paper logs, or memory.
- **Adherence intervention.** Independent of surface design, which behavior-change intervention surfaces actually move adherence in self-coached adult amateurs at one to three sessions per week, and which look helpful but have null or negative effects in this population? Candidate interventions include outcome prediction, weekly review, streak displays, streak-with-recovery, intention-implementation prompts, calendar commitment, partner-accountability tethers, smart-default reminders, and social proof.

Both questions are real and interact. A surface that earns main-tool status by way of a calm, low-pressure posture may be undermined by an intervention that introduces guilt, comparison, or daily-cadence pressure. We want to choose continuity surfaces from one bucket and intervention surfaces from another, with explicit awareness of where they conflict.

## Research question

In self-coached training, health, or skill-acquisition apps used by adult amateurs at low practice frequency (one to three sessions per week):

- **(A, descriptive)** Which continuity-across-sessions UX patterns earned "main-tool" status — i.e., users self-report replacing notes, spreadsheets, paper logs, or memory as their primary record of practice?
- **(B, mechanism)** Which behavior-change intervention surfaces actually moved adherence, and which look helpful but had null or negative effects in this population?

We want both answers, separately, with confidence levels stated for each. The interesting outcome may be that the design surfaces should be picked from the (A) bucket while the intervention design is picked from the (B) bucket — and that some intuitive cross-overs (e.g., streak mechanics) are load-bearing in one bucket and counterproductive in the other.

## Why this is non-obvious

Consumer-app retention literature is large but mostly addresses entertainment and social apps where the conversion question is "does the user open this every day?" The skill-acquisition and training subgenre asks a different question: "does the user *rely* on this as their primary record of their practice?" That conversion event is harder to detect from behavioral analytics alone — it shows up in qualitative reports ("I deleted my notes app and just use this now"), in cross-product substitution behavior, and in long-tail retention curves rather than in daily-active-user counts.

The adjacent academic literatures all touch the question but rarely with paired evidence:

- **Habit-formation research** (Lally, Wood, Verplanken) is largely framed around daily or near-daily habits. One-to-three-times-per-week is below the frequency where the standard cue-routine-reward formation literature applies cleanly.
- **Behavior-change literature** (Michie's Behavior Change Wheel, the Annals of Behavioral Medicine corpus) catalogs intervention components and their effect sizes but is mostly evaluated in clinical contexts, not in self-directed consumer-app contexts.
- **Sport-adherence and exercise-psychology literature** addresses the closest population but rarely with paired UX-pattern evidence.
- **HCI and quantified-self literature** documents specific applications and their design choices, but post-mortems with cleanly-attributed adherence effects are sparse.

The literature gaps may be informative findings in themselves: if there are no published effect-size studies for a given intervention surface in a self-coached low-frequency adult amateur population, that itself constrains the design choice and should be stated plainly.

## Key sub-questions to address

For **(A) descriptive — main-tool-conversion UX patterns**:

1. **Case-study evidence.** Which training, health, or skill-acquisition applications have documented evidence (post-mortems, founder retrospectives, peer-reviewed case studies, longitudinal user research) of achieving "main-tool" status — users self-reporting that the application replaced their previous record of practice? What surface patterns did each ship? What is the published behavioral signature of users who converted (early-cohort session count, days-to-conversion, qualitative reports)?
2. **Carry-forward patterns.** Specific carry-forward surfaces and their documented effect: a next-session prompt visible on the home screen, "since last time" panes, deferred-decision capture (the application remembers what the user said they would do next), partial-state resumption, journal-style continuity, calendar-style continuity. Which of these earned mention in post-mortems as load-bearing for the main-tool experience? Which were tried and removed?
3. **Weekly-receipt formats.** Specific weekly-receipt designs and their documented effect: planned-vs-completed counts, qualitative reflection prompts, streak displays, "what you learned this week" recaps, calm formats without streak mechanics, badge or achievement frameworks. Which are load-bearing in main-tool products versus which were removed for being noisy, anxiety-producing, or cosmetic?
4. **Early-cohort signatures.** Are there retention-curve shapes, session-count thresholds, or qualitative behaviors (e.g., reading the carry-forward, completing the weekly review) that empirically predict main-tool conversion within the first weeks of use? Is the conversion signature the same as the general-retention signature, or different?

For **(B) mechanism — adherence interventions**:

5. **Effect-size table.** For each major intervention surface — outcome prediction, weekly review, streak, streak-with-recovery, intention-implementation prompts, calendar commitment, partner-accountability tether, smart-default reminders, social proof — what is the published effect-size evidence in self-directed adult amateur populations practicing one to three times per week? Which interventions have published effect-size data in this exact population? Which only have evidence from high-frequency or coached populations? Which are null or negative when extrapolated to this population?
6. **Failure modes.** Documented cases where a shipped intervention surface reduced retention or adherence — for example, streak loss producing churn after a missed day, paternalistic reminders producing silence and uninstall, social proof producing comparison anxiety, gamification producing extrinsic-motivation crowding-out of intrinsic motivation. Effect sizes and contexts where available.
7. **Activity self-selection bias.** Do self-coached adult amateurs systematically gravitate away from the activities they need most (e.g., toward what they already enjoy or are already good at)? Which intervention designs have evidence of correcting that drift without producing alienation, condescension, or churn? Which look helpful but have null effect on actual practice composition?
8. **Habit formation at low frequency.** What does the habit-formation literature actually say about cue architectures at one to three sessions per week, as opposed to daily or near-daily cadence? What works, what fails, and what role does pair-anchoring or partner-as-cue play when the user's practice partner is the temporal anchor rather than a fixed time of day?

For the **interaction**:

9. **Compounding and conflict.** Where do the patterns from (A) and the interventions from (B) compound, and where do they conflict? For example: does a streak-style intervention undermine the calm, low-pressure posture that earned main-tool status in some products? Does a heavy weekly-receipt design that is load-bearing in (A) become counterproductive when paired with an outcome-prediction intervention from (B)?

## Deliverable

A 1,500–3,000 word memo containing:

- **Executive summary (one page).** Headline answer for (A) and (B) separately, with confidence levels for each. The reader should be able to walk away from this page with a defensible top-level recommendation and a calibrated sense of how much of the answer is supported by evidence vs. extrapolation.
- **Sub-question A section.** Ranked list of UX patterns that have documented evidence of contributing to main-tool conversion, with case-study citations. A menu of carry-forward shapes and weekly-receipt formats with cited examples for each. Early-cohort signature evidence: what predicts main-tool conversion within the first few weeks of use, and whether that signature is the same as or different from general-retention signatures.
- **Sub-question B section.** A per-intervention effect-size table with population, sample size, study type, and effect direction for each cited finding. A failure-mode catalog with documented removals and null-effect cases. An activity self-selection-bias section with whatever correction-design evidence exists. A low-frequency habit-formation section addressing one-to-three-times-per-week cadence specifically.
- **Interaction section.** Where (A) and (B) compound, where they conflict, and a candidate framework for choosing surfaces from each bucket without internal contradiction.
- **Recommended starter pattern set.** A small, opinionated list of UX patterns plus intervention surfaces that have the strongest combined evidence for the target population. Each item must carry an explicit citation, an explicit population caveat, and an explicit failure mode to monitor.
- **Failure-modes section.** Consolidated list of documented removals, null-effect cases, and cases where an intervention worked in one population but failed in this one.
- **Gaps section.** Where the literature does not answer the question, and what observational study or experimental design would close the gap.
- **Full citation list.** DOIs or stable URLs for every quantitative claim. Sample sizes and population descriptors mandatory.

## Priority sources

- **Tier 1 (peer-reviewed).** HCI venues (CHI, CSCW, UIST, DIS); behavior-change and health-psychology literature (Annals of Behavioral Medicine, Health Psychology Review, Behaviour Research and Therapy); habit-formation research (Lally, Wood, Verplanken, Gardner); sport-adherence and exercise-psychology journals (Journal of Sport and Exercise Psychology, Psychology of Sport and Exercise); skill-acquisition and motor-learning journals where they address self-directed practice.
- **Tier 2 (foundational and authored books).** Wood (*Good Habits, Bad Habits*), Duhigg (*The Power of Habit*) used critically, Fogg (*Tiny Habits*), Eyal (*Hooked*) used critically, Michie (*Behavior Change Wheel*), academic work in the quantified-self / personal-informatics tradition (Forlizzi, Dey, Li and colleagues), Csíkszentmihályi flow literature where directly relevant to self-directed amateur practice.
- **Tier 3 (industry analyses).** Reforge cohort analyses, public retention case studies, Sensor Tower / App Annie / App Radar published retention reports, published founder retrospectives and post-mortems from training and health applications. Specific products worth examining if data is available include Strava, MyFitnessPal, Strong, Hevy, Whoop, Future, Caliber, Duolingo, Yousician, Anki, Headspace, Calm, Streaks, Habitica, RunKeeper, Sworkit, Peloton Digital, Couch to 5K, Zombies Run, Forest, Notion-as-training-journal community usage, Apple Fitness Plus, Garmin Connect, Coros training plans.
- **Tier 4 (practitioner).** Design and product writing from designers and product managers in the self-coached training space; quantified-self community writing; published cross-app reviews comparing self-coached training applications in adjacent sports, hobbies, and health domains.

Where evidence in this area is fragmented or absent for the target population, please draw conservatively from adjacent populations (high-frequency, coached, or clinical) and explicitly flag the extrapolation rather than skipping the question.

## Constraints

- **Scope.** Self-coached, training / health / skill-acquisition, adult amateur, one to three sessions per week. Entertainment applications, social applications, pure information-consumption applications, and applications that depend on a coach or trainer being in the loop are out of scope. Where evidence comes from a coached or high-frequency context, please say so and reason explicitly about extrapolation.
- **Sample sizes mandatory.** Any quantitative claim must report sample size and population descriptor. A retention coefficient or effect size without a population descriptor is not useful.
- **Distinguish vanity from main-tool signals.** Daily-active-user and monthly-active-user metrics are not the dependent variable here. The signal of interest is qualitative main-tool conversion — users self-reporting that the application replaced notes, spreadsheets, paper logs, or memory as their primary record of practice. Where DAU/MAU is the only available signal, please flag it as a vanity metric and reason about how it relates (or fails to relate) to the main-tool signal.
- **Force explicit verdicts.** For each major intervention surface, please commit to one of: "moves adherence" / "null effect" / "negative effect" / "literature insufficient." The default verdict is "literature insufficient" if cross-population evidence is the only available evidence.

## Things to flag explicitly

- **Counterintuitive findings.** Anything where the standard product-design intuition is wrong in this population — for example, streak mechanics reducing retention in low-frequency contexts despite working in daily-habit contexts, weekly-receipt heaviness producing churn despite generating engagement, social proof reducing adherence despite improving acquisition.
- **Documented removals.** Any case where a published post-mortem or founder retrospective documented removing a feature that the team had shipped and would otherwise have kept. Removals are particularly informative because they reflect real adverse evidence rather than absence of evidence.
- **Distinct signatures.** Any evidence that the early-cohort signature predicting main-tool conversion is different from the early-cohort signature predicting general retention. If the signatures are different, the design implications differ accordingly.
- **Pair-anchored cadence.** Any patterns specific to applications used by people who train with a partner — where the partner is the cue, the accountability surface, or the temporal anchor for practice. This is a meaningful subpopulation in the target domain and is rarely addressed in the literature focused on solo daily habits.
- **Systematic gaps.** Where the literature is systematically silent on a sub-question, please say so plainly. Absence of evidence in this area is itself a usable finding.

## Success criteria

The memo is successful if a product designer can read it and:

- Pick a defensible continuity-across-sessions UX pattern (carry-forward shape and weekly-receipt format) for a low-frequency self-coached adult amateur application, with explicit cited evidence per choice.
- Pick a defensible behavior-change intervention surface for the same application, with explicit cited evidence and explicit failure-mode awareness.
- Identify which combinations of (A) and (B) compound and which conflict, and avoid the conflicting combinations.
- State a quantitative target for what main-tool conversion looks like in user behavior — at minimum, a candidate operational definition (e.g., "user self-reports replacing prior notes / records," "user has logged N consecutive sessions including a weekly review across M weeks," or whatever the literature actually supports).
- Trace every quantitative claim to a cited source with sample size and population descriptor.

## Timeline and format

- Expected turnaround: two to three weeks. Please flag early if that is unrealistic for this scope.
- Format: a single markdown document, plain prose plus tables where useful (the per-intervention effect-size table is required; other tables are at your discretion).
- One-page executive summary at the top.
- If the literature is systematically absent on the core questions for this exact population, that finding is itself valuable. Please say so plainly and propose what observational study, instrumented-cohort design, or cross-app comparative study would close the gap, rather than extrapolating heavily from non-analogous populations.
