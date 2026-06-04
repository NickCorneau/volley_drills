---
id: brief-response-single-tracked-metric-vendor-1-2026-06-02
title: "Vendor response: single self-tracked metric (vendor 1, 2026-06-02)"
status: verbatim
stage: validation
type: brief-response
authority: "Verbatim record of vendor 1's response to the 2026-05-27 'Single self-tracked metric most predictive of adherence and improvement in amateur skill-sport athletes' brief. Raw vendor output as received; not curated canon. The decision-relevant distillation lives in `docs/research/single-tracked-metric-amateur-skill-apps.md`."
summary: "Vendor 1 concludes no single metric honestly carries both adherence and skill-improvement signal; recommends a Two-Metric Pair = Planned-vs-Completed session ratio (adherence anchor, zero noise floor) + Weekly Subjective Confidence rating (improvement anchor, grounded in OPTIMAL theory / self-efficacy). Ranks streaks 3rd and high-risk ('streak ghosting'); rejects sRPE for this dose (CV up to 28.1%). Most pro-confidence of the three vendors."
last_updated: 2026-06-02
responds_to: docs/research/briefs/2026-05-27-brief-single-tracked-metric-amateur-skill-apps.md
distilled_in: docs/research/single-tracked-metric-amateur-skill-apps.md
depends_on:
  - docs/research/briefs/README.md
  - docs/research/single-tracked-metric-amateur-skill-apps.md
---

# Vendor response: single self-tracked metric (vendor 1, 2026-06-02)

## Provenance and handling

- **Vendor:** vendor 1 (identifier preserved for the reconciliation pass; redact before any external share).
- **Received:** 2026-06-02 (responds to a brief authored 2026-05-27).
- **Responds to:** [`docs/research/briefs/2026-05-27-brief-single-tracked-metric-amateur-skill-apps.md`](../2026-05-27-brief-single-tracked-metric-amateur-skill-apps.md) — the single-tracked-metric brief listed in [`docs/research/briefs/README.md`](../README.md).
- **Status:** `verbatim`. This file is the raw deliverable as received. Do not edit content; corrections and commentary live in the distillation note linked below. **One mechanical exception:** three inline base64-encoded effect-size symbol images in the original were replaced with bracketed placeholders to avoid storing large binary blobs in the repo; no prose was altered.
- **Distilled in:** [`docs/research/single-tracked-metric-amateur-skill-apps.md`](../../single-tracked-metric-amateur-skill-apps.md) — use that note for repo-facing conclusions, cross-links, and decision implications.
- **Convention:** revision-by-replacement per `docs/research/briefs/README.md`. If vendor 1 submits a revised response, it ships as a new `-vendor-1-revised-<date>.md` file; this file is not edited in place.

## Verbatim response

# **Research Memo: Predictive Validity of Self-Tracked Metrics for Adherence and Skill Consolidation in Amateur Athletes**

## **Executive Summary**

This comprehensive synthesis addresses the core product architecture question: identifying the single self-tracked metric, surfaced weekly, that most reliably co-predicts 8–12 week training adherence and objective skill improvement in self-coached amateur athletes training one to three sessions per week in skill-dependent sports.  
An exhaustive review of cross-disciplinary literature—spanning motor learning theory, sports physiology, behavior-change psychology, and human-computer interaction (HCI)—demonstrates that **no single metric can honestly and reliably carry both adherence and skill-improvement signals simultaneously.** Behavioral adherence and neurological skill consolidation are governed by distinct, often conflicting mechanisms. Metrics optimizing for behavioral compliance frequently capture "junk volume" that fails to stimulate motor learning, while metrics optimizing for skill acquisition often demand deliberate practice that induces cognitive fatigue and subsequent program abandonment.  
Consequently, the most defensible architecture for a weekly product readout is a **Two-Metric Pair (Load \+ Skill Proxy)**. Evaluating the candidate metrics against the specific constraints of the target population yields the following top three rankings:

1. **Planned-vs-Completed Session Ratio (Ranked 1st for Adherence):** Grounded in the Health Action Process Approach (HAPA), this metric measures behavioral intent and compliance rather than raw volume. It avoids the catastrophic failure modes of uncapped streaks by forgiving absolute volume drops, accommodating the high-variance schedules of adult amateurs.  
2. **Weekly Subjective Confidence Rating (Ranked 1st for Improvement):** Rooted in the OPTIMAL theory of motor learning, self-efficacy is the most robust leading indicator of skill consolidation. In uncoached environments lacking objective kinematic feedback, subjective confidence effectively proxies the transition from the cognitive to the autonomous stage of motor learning.  
3. **Streak Length (Ranked 3rd for Adherence, High Risk):** While streak mechanics effectively leverage loss aversion to drive short-term adherence, they are highly susceptible to "streak ghosting." Peer-reviewed evidence indicates that broken streaks in long-term contexts actively suppress user engagement below baseline levels, leading to abandonment.

The literature explicitly cautions against traditional physiological metrics for this specific population. The Session Rating of Perceived Exertion (sRPE) exhibits an unacceptably high noise floor (coefficients of variation reaching 28.1% in free-living environments), rendering week-to-week comparisons statistically meaningless for athletes training only twice a week.  
This report provides a ranked menu of candidate metrics, per-metric evidence ladders, an analysis of over-instrumentation failure modes, and an explicit separation of peer-reviewed evidence from practitioner intuition to guide downstream analytics and product design.

## **1\. The Amateur Skill-Sport Paradigm and Population Constraints**

To accurately evaluate predictive metrics, it is imperative to define the physiological and psychological realities of the target population. The adult, self-coached amateur training in skill-dependent sports (e.g., tennis, golf, climbing) at a frequency of one to three sessions per week operates under a paradigm distinctly different from the populations typically studied in sports science literature.  
The overwhelming majority of endurance and strength training literature relies on data from high-volume, elite, or coached athletes training five to fifteen sessions per week.1 In such populations, total volume is the dominant performance bottleneck, and central nervous system (CNS) fatigue is a primary systemic threat. Consequently, metrics tracking internal load, acute:chronic workload ratios, and cumulative tonnage are highly predictive of both adherence (by mitigating overtraining and injury) and performance.5  
Conversely, for the amateur training one to three times per week, biological recovery is rarely the primary bottleneck. At this dosage, systemic physiological recovery is generally achieved by default between sessions. The primary outcome of interest is skill consolidation, which is the refinement of neural motor programs under variable conditions.7 Furthermore, because these athletes are self-coached, they operate in environments devoid of extrinsic, objective kinematic feedback. They must rely exclusively on intrinsic error-detection and self-regulation to progress through the cognitive, associative, and autonomous stages of motor learning.7  
Therefore, optimal metrics for this population must capture the psychological components of skill acquisition and the behavioral components of habit maintenance, rather than relying on physiological load markers that fall below the threshold of statistical significance at low training volumes.

## **2\. Ranked Menu of Candidate Metrics and Evidence Ladders**

The candidate metrics are evaluated based on their independent capacities to predict 8–12 week adherence and measurable skill improvement. The evidence is synthesized from controlled trials, observational studies, and meta-analyses.

### **2.1. Planned-vs-Completed Session Ratio**

The Planned-vs-Completed ratio operates on the psychological principles of action planning and the Health Action Process Approach (HAPA).10 By focusing on the ratio of intended behavior to executed behavior, it effectively normalizes for life variance.  
This metric is the strongest predictor of adherence. Meta-analytic reviews of randomized controlled trials demonstrate that action planning and the self-monitoring of planned versus completed tasks yield significant, small-to-moderate effect sizes for sustained physical activity.11 The metric actively predicts adherence because it measures compliance to a self-determined goal, thereby fostering autonomy—a key psychological need for sustained engagement.14 When patients or athletes dictate their own schedules and fulfill them, the resulting positive feedback loop reinforces the identity of an active participant, regardless of whether the absolute volume was one session or three.16  
However, its capacity to predict skill improvement is relatively weak. While completing planned sessions is a fundamental prerequisite for skill acquisition, raw behavioral compliance does not guarantee deliberate practice. An athlete can complete 100% of their planned sessions while executing movements with poor technique, thereby reinforcing suboptimal motor patterns and plateauing in their skill development.5

| Population & Sample Size | Evaluated Metric | Effect Size / Predictive Value | Key Finding & Source Citation |
| :---- | :---- | :---- | :---- |
| Meta-analysis of RCTs (thousands of adults) | Action planning / Planned-vs-Completed | Total effect ![][image1] \= 0.372; Direct effect ![][image1] \= 0.296 | Action planning and tracking intended behavior yields significant effect sizes for behavioral adherence. 10 |
| Tele-rehabilitation patients (N=not strictly bounded, cohort study) | Compliance to exercise prescription | High correlation with sustained engagement | Adherence measured by the ratio of prescribed vs completed sessions successfully predicted long-term engagement. 19 |

### **2.2. Weekly Subjective Confidence Rating (Self-Efficacy)**

Weekly subjective confidence serves as a direct proxy for task-specific self-efficacy. This metric is deeply rooted in the OPTIMAL (Optimizing Performance through Intrinsic Motivation and Attention for Learning) theory of motor learning, developed by Wulf and Lewthwaite.20 The theory posits that enhanced expectancies (confidence) directly facilitate motor learning by strengthening the coupling of goals to actions, establishing efficient functional connections across brain networks, and preventing learners from backsliding into non-task-focused states.20  
Subjective confidence ranks first for predicting skill improvement. In skill sports, higher self-efficacy correlates directly with superior motor control and error correction.21 Studies evaluating self-controlled practice environments demonstrate that interventions boosting perceived competence directly yield greater accuracy and reduced variability in retention and transfer tests.23 As learners transition from the mentally taxing cognitive stage to the fluid autonomous stage, their subjective confidence in executing the skill naturally rises.9  
This metric also ranks highly for predicting adherence. Task-specific self-efficacy is consistently identified as a primary predictor of exercise program adherence over 8–12 week periods. In multivariate models, baseline and progressive self-efficacy frequently explain substantial variance (e.g., up to 19%) in longitudinal adherence alongside other demographic factors.24

| Population & Sample Size | Evaluated Metric | Effect Size / Predictive Value | Key Finding & Source Citation |
| :---- | :---- | :---- | :---- |
| Adult rehab/exercise cohorts (N=23 breast cancer survivors; N=orthopedic outpatients) | Self-Efficacy | Explained \~19% of variance in intervention adherence | Self-efficacy uniformly predicts adherence and progressive action planning over 8–12 week periods. 24 |
| Novice motor learners (N=various experimental groups) | Self-Controlled Practice & Confidence | Significant performance variance (![][image2]) | Practices boosting perceived competence demonstrate greater accuracy and less variability in retention tests. 22 |
| Elite collegiate softball athletes (N=24) | OPTIMAL theory / Self-Efficacy | Null/Ceiling effect observed | While OPTIMAL predicts learning, highly advanced athletes exhibit ceiling effects in baseline self-efficacy, making it less predictive at the absolute elite level. 4 |

### **2.3. Streak Length (Consecutive Weeks/Sessions)**

Streak mechanics represent a gamification strategy that leverages early-stage accomplishment and late-stage loss aversion. By continuously incrementing a counter for consecutive behaviors, the system attempts to build a daily or weekly habit.28  
As an adherence predictor, streak length exhibits extremely high variance: it is exceptionally strong in the short term but potentially catastrophic in the long term. Telemetry from consumer applications indicates that short-term streaks (e.g., 7 days) can increase the likelihood of program completion by factors exceeding 3.6x.28 However, behavioral research by Silverman and Barasch demonstrates that unbroken streaks shift the user's motivation from the underlying activity to the maintenance of the metric itself. When a streak is eventually broken, users experience profound negative affect. If the user attributes the broken streak to their own failure, engagement plummets significantly below their baseline activity levels prior to using the application.31  
Regarding skill improvement, streaks offer virtually no predictive value. Because the primary psychological driver is preserving the metric, users frequently engage in "junk volume"—executing the bare minimum effort required to increment the counter. This lack of cognitive engagement fails to meet the threshold of the Challenge Point Framework, resulting in stalled motor learning.34

| Population & Sample Size | Evaluated Metric | Effect Size / Predictive Value | Key Finding & Source Citation |
| :---- | :---- | :---- | :---- |
| Behavioral lab studies (N=Extensive consumer trials) | Broken Streaks | Significant drop below baseline engagement | Consumers experience amplified negative affect and task abandonment when a streak breaks, especially if self-attributed. 31 |
| Language learning app telemetry (N \> 6 million users) | Maintained Streaks | 3.6x higher completion likelihood | Maintained short-term streaks drastically improve course completion probability. 28 |

### **2.4. Session-RPE-Week-Sum (sRPE)**

The Session Rating of Perceived Exertion (sRPE) calculates internal training load by multiplying a subjective exertion rating (1–10) by the duration of the session in minutes.35 It is extensively validated against heart-rate-based Training Impulse (TRIMP) scores in endurance and team sports.35  
For the target demographic, its predictive validity for adherence is relatively low. While universally utilized in sports science to prevent overtraining syndrome, athletes training 1–3 times per week rarely achieve non-functional overreaching. Therefore, sRPE functions merely as a descriptive variable rather than a predictive threshold for dropout.38  
Its prediction of skill improvement is similarly weak. In skill-dominant sports, high sRPE does not equate to high skill acquisition. High internal physical loads are often accompanied by systemic fatigue, which actively impairs cognitive performance, working memory, movement efficiency, and the subsequent consolidation of motor sequences.5

| Population & Sample Size | Evaluated Metric | Effect Size / Predictive Value | Key Finding & Source Citation |
| :---- | :---- | :---- | :---- |
| Recreational athletes in HIFT (N=10) | sRPE | Adherence rate \= 87.9 ± 8.3% | sRPE is valid for quantifying load, but its magnitude does not directly predict long-term adherence in low-frequency athletes. 36 |
| Elite foil fencers (N=7, over 1 season) | sRPE | CV \= 6.0% (highly controlled) | Valid internal load marker, but largely decoupled from pure skill acquisition metrics in free-living environments. 3 |

### **2.5. Single-Task Perceived Effort (NASA-TLX)**

Measuring mental workload or single-task perceived effort attempts to quantify the cognitive demands of motor learning. According to the Challenge Point Framework, optimal skill acquisition occurs when task difficulty appropriately matches the learner's skill level, generating a moderate-to-high cognitive load.34  
This metric ranks highly as a predictor of skill improvement. Research utilizing the NASA Task Load Index (NASA-TLX) demonstrates that as learners acquire a skill and transition toward automaticity, their perceived mental and temporal demand drops significantly, even if physical demand remains constant.43  
However, it is a remarkably poor predictor of adherence. Continuously measuring and targeting high mental effort induces cognitive fatigue. Athletes intrinsically value needs satisfaction over needs frustration; imposing perpetual high mental demand leads to rapid psychological burnout and withdrawal from the sport.45 Furthermore, the burden of frequently logging multidimensional mental load surveys causes distinct HCI failures, leading users to abandon the tracking application entirely.48

| Population & Sample Size | Evaluated Metric | Effect Size / Predictive Value | Key Finding & Source Citation |
| :---- | :---- | :---- | :---- |
| Motor sequence learners (N=Various trials) | NASA-TLX Mental Demand | Significant time ![][image3] condition interaction | Decreases in perceived mental effort correlate directly with motor skill consolidation and automaticity. 43 |
| Adult sports participants | Deliberate Practice & Cognitive Load | High correlation with dropout | Forced, high-cognitive-load deliberate practice without intrinsic motivation leads to sport withdrawal. 18 |

## **3\. Explicit Flags and Contextual Nuances**

The research brief requires specific attention to several systemic divergences, counterintuitive findings, and experience-gradient shifts that influence the interpretation of these metrics.

### **3.1. Subjective vs. Behavioral Divergence**

A critical finding in the literature is that behavioral metrics (session counts, streaks) and subjective cognitive metrics (perceived confidence, mental effort) systematically diverge in amateur populations. An individual can exhibit perfect behavioral adherence (e.g., logging three sessions per week without fail) while experiencing zero skill improvement due to a lack of mental engagement or the reinforcement of poor technique.5 Conversely, an athlete might experience significant leaps in subjective confidence and motor capability following a highly focused, mentally demanding session, but subsequently require a prolonged break due to cognitive fatigue, leading to a drop in behavioral metrics.43 Because these domains decouple so frequently, an honest weekly readout cannot merge them into a single score without masking critical failure modes.

### **3.2. Experience-Gradient Shifts**

The predictive validity of specific metrics shifts dynamically as the athlete moves across the experience gradient.

* **Novices (Cognitive Stage):** For beginners, behavioral consistency is paramount. At this stage, self-efficacy is inherently low, and the mental effort required to execute tasks is highly taxing.9 Surfacing subjective confidence or mental load to a novice may demoralize them. The *Planned-vs-Completed* ratio is the superior metric here, as it rewards the mere act of showing up.  
* **Intermediates (Associative Stage):** As the athlete refines their skills, raw behavioral volume yields diminishing returns. Intrinsic error-detection becomes the primary driver of progress. Here, the *Weekly Subjective Confidence Rating* becomes the optimal predictor of improvement, as it tracks the transition toward automaticity.9  
* **Advanced Amateurs (Autonomous Stage):** For highly experienced amateurs, a ceiling effect in self-efficacy is often observed. As demonstrated in studies of elite collegiate athletes, advanced performers already possess high confidence and naturally adopt external attentional focus.4 At this stage, subjective metrics lose their variance, and athletes may require more granular, objective kinematic data to break plateaus.

### **3.3. Counterintuitive Findings**

Two findings directly challenge conventional product design intuition. First, gamified streaks—often viewed as the gold standard for retention—actively destroy long-term adherence when broken. By shifting the user's psychological attachment from the joy of the sport to the preservation of a digital counter, the application engineers a fragile dependency. When inevitable life disruptions break the streak, the resulting shame causes users to "ghost" the app entirely.31  
Second, while deliberate practice (highly focused, mentally demanding repetition) is the fastest vector for skill improvement, forcing self-coached amateurs into constant deliberate practice induces burnout. Athletes engaged in high-friction "practice to learn" scenarios exhibit worse immediate performance and higher frustration than those in "practice to maintain" scenarios. Unrelenting cognitive load without periods of unstructured "deliberate play" actively predicts withdrawal from the sport.18

### **3.4. Shipped-Then-Removed Product Post-Mortems**

The most instructive post-mortems regarding over-instrumentation come from established habit-tracking and learning applications. Duolingo, after observing the catastrophic churn associated with broken infinite streaks, was forced to fundamentally alter their architecture. They introduced "Streak Freezes"—grace periods that allow users to miss a day without resetting their progress. This intervention to reduce metric rigidity actually increased the relative number of active daily learners by \+0.38%, proving that leniency outperforms strict compliance in long-term retention.28 Similarly, platforms like Habitica discovered that point systems penalizing users for missed behaviors created counterproductive psychological effects, leading them to re-evaluate arbitrary penalty mechanics.53 These post-mortems confirm that rigid behavioral tracking backfires in adult consumer populations.

## **4\. Over-Instrumentation Failure Modes**

Surfacing detailed metrics on a weekly cadence introduces distinct HCI and psychological failure modes. Product architects must design the weekly readout to explicitly avoid these documented hazards.

### **4.1. The "Streak Ghosting" Phenomenon**

As detailed above, the implementation of rigid, uncapped streaks creates a binary psychological state: perfect success or absolute failure. Users develop all-or-nothing thinking, wherein a missed session nullifies weeks of prior effort.52 This phenomenon is exacerbated when the user attributes the failure to internal factors (e.g., lack of discipline) rather than external factors (e.g., a family emergency).33 The resulting digital shame causes the user to abandon the application rather than confront the reset metric. To mitigate this, practitioners advise implementing capped streaks (e.g., resetting challenges every week) or integrating explicit grace periods.28

### **4.2. Perceived-Effort Fatigue and Measurement Burden**

Attempting to track the precise quality of skill acquisition through complex cognitive load metrics introduces severe measurement burden. Research into the abandonment of personal health-tracking technologies reveals that the cognitive friction of filling out subjective surveys leads directly to user fatigue.48 If a weekly readout requires complex, multi-scale inputs (e.g., independently rating mental demand, physical demand, and temporal demand as seen in NASA-TLX), the tracking mechanism itself becomes an extraneous cognitive load. Users will begin to avoid logging their sessions simply to avoid the survey burden, creating a data vacuum.

### **4.3. sRPE Interpretation Error and Health Anxiety**

While sports scientists view sRPE as a descriptive quantification of external load, amateur populations frequently misinterpret the metric. Rather than viewing it as a trailing indicator, amateurs often interpret sRPE as a prescriptive limit.39 If an athlete perceives a session as harder than their historical average (a mismatch between predicted and momentary RPE), it can trigger acute psychological frustration.55 Furthermore, surfacing week-to-week sRPE variance can induce unwarranted health anxiety; users may mistake normal physiological variance (driven by poor sleep or occupational stress) for non-functional overreaching, leading them to unnecessarily skip planned sessions.

## **5\. Noise Floors and Statistical Viability**

A critical constraint for any product metric is its statistical validity at the user's actual training dose. The application must not ship a metric whose week-to-week movements are mathematically indistinguishable from sampling noise.  
For the target population of 1–3 sessions per week, the noise floor of sRPE is fundamentally prohibitive. The Coefficient of Variation (CV) for sRPE fluctuates wildly depending on the predictability of the environment. In highly controlled, repetitive environments (e.g., elite fencing footwork drills), the sRPE CV can be as low as 6.0%.3 However, in free-living conditions with mixed modalities—which perfectly describes the environment of a recreational skill-sport amateur—the test-retest reliability of sRPE degrades rapidly, with CVs reported as high as 28.1%.56  
At a training frequency of two sessions a week, a 20% shift in a user's weekly sRPE is statistically meaningless. The variance is highly susceptible to external life stressors rather than true training state signals.57 If the application surfaces a 15% drop in sRPE and labels it as a "downward trend," it is effectively lying to the user based on statistical noise.  
Conversely, the *Planned-vs-Completed Ratio* possesses a noise floor of zero. It is a discrete, binomial measurement. A completion rate of 67% (two out of three planned sessions) is an absolute, noise-free representation of behavioral compliance. Subjective confidence, while ordinal, also functions with high intra-rater reliability when evaluated on simple Likert scales, making it far superior to calculated load variances at low frequencies.

## **6\. The Two-Metric Pair Framing: Defensibility of Load \+ Skill**

The central inquiry of the research brief asks whether a single metric can honestly carry both adherence and improvement signals. The cross-disciplinary evidence unequivocally indicates that it cannot. A single-metric readout for amateur skill-sport athletes is not intellectually defensible.  
If an application surfaces only a load or behavioral metric (e.g., Session Count, Streaks), it inadvertently incentivizes "empty" participation. The athlete is rewarded for simply showing up, even if they execute skills poorly in an automated but incorrect state. Under this architecture, adherence is achieved, but measurable skill improvement is stalled, eventually leading to long-term churn due to stagnation.5  
Conversely, if the application surfaces only a skill or cognitive metric (e.g., Mental Effort, Drill-Completion Rate), it incentivizes highly demanding deliberate practice. Forced deliberate practice rapidly depletes cognitive resources and strips the intrinsic joy from the sport, leading to frustration, psychological burnout, and eventual dropout.18 Here, improvement is optimized momentarily, but adherence is destroyed.  
To resolve this dichotomy, the literature strongly supports a paired framing that captures both behavioral intent and psychological skill state, without triggering the failure modes associated with raw volume or cognitive overload.

### **The Recommended Pair: Intent \+ Confidence**

**Metric 1 (Load/Behavior Proxy): The Planned-vs-Completed Ratio** This metric serves as the adherence anchor. By normalizing for volume, it accommodates the realities of adult life. Whether the user plans one session or three, success is defined by following through on the intention. If a user anticipates a busy week and plans only one session, completing that session yields a 100% success rate. This preserves the user's identity as an "active athlete" and avoids the shame mechanics of broken streaks, generating positive reinforcement that drives 8–12 week adherence.11  
**Metric 2 (Skill Proxy): Weekly Subjective Confidence Rating** This metric serves as the improvement anchor. In the absence of an objective coach to measure kinematics or error rates, perceived self-efficacy is the most valid proxy for motor skill acquisition.22 Under the OPTIMAL theory, as learners transition from high-friction cognitive states to fluid autonomous execution, their subjective confidence naturally and reliably rises.9 Surfacing this metric weekly forces the athlete to engage in brief self-reflection regarding their motor competency, triggering the intrinsic error-detection that is vital for self-coached athletes.

## **7\. Practitioner Intuition vs. Peer-Reviewed Evidence**

It is necessary to delineate academic findings from the empirical telemetry gathered by industry practitioners. In digital product design, practitioner post-mortems and A/B test telemetry frequently precede academic consensus and offer crucial pragmatic insights.

### **Practitioner Intuition and Telemetry**

* **Flexible Consistency over Rigid Streaks:** Industry architects working on habit-formation apps (e.g., Duolingo) have empirically validated the academic theories regarding loss aversion. Practitioners recognize that monetizing anxiety through infinite streaks drives short-term revenue but erodes long-term trust. To combat this, they heavily advocate for "slack"—the intentional design of grace periods and forgiveness mechanics.28 The consensus among top-tier product builders is to implement capped streaks or "bootleg quests" that reset weekly, providing the dopamine spike of accomplishment without the terminal risk of long-term streak breakage.29  
* **Visualizing Intent:** Practitioners designing platforms for coaches and self-guided athletes (e.g., Goodcoach.app, Athlete Space) rely extensively on visualizing the "Planned vs. Completed" ratio. They report that when athletes experience life disruptions, seeing raw volume drop causes them to churn. Visualizing proportional completion allows the user to retain a sense of control and efficacy during low-volume weeks.16  
* **The Danger of Over-Quantification:** Founders in the Quantified Self space frequently note that surfacing too many physiological metrics (e.g., daily readiness scores, sRPE) often induces "nocebo" effects, where users feel worse simply because their app indicated a sub-optimal metric. Practitioners advocate for qualitative, reflective inputs (like subjective confidence) over hyper-granular load tracking for amateur populations.

### **Synthesis**

The academic literature identifies the *causal mechanisms* for user behavior (e.g., attribution of failure, enhanced expectancies, cognitive load theories).20 Industry practitioners identify the *structural solutions* to navigate those mechanisms (e.g., streak freezes, flexible denominators).28 Both domains converge on the identical conclusion: rigid, volume-based metrics and high-friction tracking are fundamentally incompatible with the sustainable engagement of adult consumer populations.

## **8\. Gaps in the Literature**

While the synthesis provides a robust foundation for product architecture, several blind spots exist within the peer-reviewed literature that require measured extrapolation:

1. **The Frequency Gap:** The vast majority of sports science literature evaluating load monitoring and motor learning utilizes populations training four to six times per week (e.g., collegiate athletes, clinical rehabilitation cohorts, elite fencers).3 The distinct physiological and psychological state of the true 1–3 session/week amateur skill-sport athlete is systematically under-researched. We must extrapolate the irrelevance of systemic CNS fatigue for this cohort based on established physiological recovery timelines.  
2. **Objective Skill Measurement in the Wild:** In academic research, "measurable skill improvement" is evaluated via highly controlled, objective kinematic tests (e.g., throwing accuracy at a standardized target, measuring gait velocity with sensors).4 Outside the laboratory, self-coached recreational athletes lack access to objective skill-measurement tools. Consequently, product architecture must rely on subjective self-efficacy as an operational proxy for objective skill improvement, justified by the strong correlations validated by the OPTIMAL theory.20  
3. **Longitudinal HCI Tracking Abandonment:** While CSCW literature details the immediate causes of health app abandonment (loss of motivation, data-entry fatigue), there is a distinct lack of 12+ month longitudinal survival analyses specifically isolating how different dashboard visualizations (e.g., single metrics vs. paired metrics) influence lapsing behavior in purely recreational sports environments.54

## **9\. Vendor's Ranked Recommendation and Decision Criteria**

Based on an exhaustive synthesis of the available evidence across sports science, psychology, and HCI, the vendor's explicit recommendation for the weekly readout is to abandon the single-metric constraint and implement the **Two-Metric Pair: Planned-vs-Completed Ratio \+ Weekly Subjective Confidence**.  
If engineering or design constraints absolutely force the implementation of a single metric, the ranking must be dictated by the specific objective of the application phase:

* **If the primary objective is pure 8–12 week behavioral retention:** The single best metric is the **Planned-vs-Completed Session Ratio**. It provides a zero-noise, highly flexible behavioral anchor that relies on intention rather than volume, avoiding the ghosting effects of rigid streaks.  
* **If the primary objective is pure motor learning and skill consolidation:** The single best metric is the **Weekly Subjective Confidence Rating**. It leverages the OPTIMAL theory's enhanced expectancies, providing a highly reliable leading indicator of the transition to autonomous skill execution without the measurement burden of cognitive load surveys.

### **Decision Criteria that Flip the Rankings**

The optimal metric choice shifts dynamically based on specific user contexts:

1. **Experience Level (Novice vs. Advanced):** For pure novices in the cognitive stage of learning, subjective confidence may be demoralizingly low and highly volatile. For this cohort, *Planned-vs-Completed* is infinitely superior. For advanced amateurs, who often exhibit ceiling effects in confidence, granular *Single-Task Perceived Effort* or objective *Drill-Completion Rates* may be necessary to stimulate the Challenge Point Framework.  
2. **Weekly Dose Shift:** If an amateur user permanently shifts their training volume from 1–3 sessions per week up to 5+ sessions per week, the ranking entirely flips. At 5+ sessions, systemic CNS fatigue and non-functional overreaching become genuine threats. In this high-dose context, *Session-RPE-Week-Sum (sRPE)* becomes the most critical self-tracked metric to prevent injury and burnout, overriding subjective confidence.

By deploying the Two-Metric Pair, the product architecture successfully navigates the high noise floors of traditional physiological load tracking at low frequencies, neutralizes the gamification failure modes of uncapped streaks, and provides an intellectually honest, scientifically defensible reflection of the amateur athlete's journey.

#### **Works cited**

1. From Lab to Field: Self-Regulation Mechanisms and Performance Optimization in Sport and Motor Learning \- Frontiers, accessed June 2, 2026, [https://www.frontiersin.org/research-topics/77748/from-lab-to-field-self-regulation-mechanisms-and-performance-optimization-in-sport-and-motor-learning](https://www.frontiersin.org/research-topics/77748/from-lab-to-field-self-regulation-mechanisms-and-performance-optimization-in-sport-and-motor-learning)  
2. On the self-regulation of sport practice: Moving the narrative from theory and assessment toward practice \- PMC, accessed June 2, 2026, [https://pmc.ncbi.nlm.nih.gov/articles/PMC10086193/](https://pmc.ncbi.nlm.nih.gov/articles/PMC10086193/)  
3. Ecological Validity of the Session Rating of Perceived Exertion for Quantifying Internal Training Load in Fencing in \- Human Kinetics Journals, accessed June 2, 2026, [https://journals.humankinetics.com/view/journals/ijspp/12/1/article-p124.xml](https://journals.humankinetics.com/view/journals/ijspp/12/1/article-p124.xml)  
4. Skilled Throwing Performance: A Test of the OPTIMAL Theory \- PMC \- NIH, accessed June 2, 2026, [https://pmc.ncbi.nlm.nih.gov/articles/PMC8136597/](https://pmc.ncbi.nlm.nih.gov/articles/PMC8136597/)  
5. Scalable Readiness Monitoring in Tactical Populations: From Elite Sport to the Fireground, accessed June 2, 2026, [https://www.o2x.com/blog/scalable-readiness-monitoring-in-tactical-populations-from-elite-sport-to-the-fireground](https://www.o2x.com/blog/scalable-readiness-monitoring-in-tactical-populations-from-elite-sport-to-the-fireground)  
6. Relationship of Individual Athlete External Load, Session Rating of Perceived Exertion, and Athlete Playing Status Across a Collegiate Women's Basketball Season \- PMC, accessed June 2, 2026, [https://pmc.ncbi.nlm.nih.gov/articles/PMC11679511/](https://pmc.ncbi.nlm.nih.gov/articles/PMC11679511/)  
7. Skill Acquisition \- Science for Sport, accessed June 2, 2026, [https://www.scienceforsport.com/skill-acquisition/](https://www.scienceforsport.com/skill-acquisition/)  
8. The Basics of Motor Learning: How Athletes Learn New Sport Skills & Movements, accessed June 2, 2026, [https://cortxperformance.com/articles/the-basics-of-motor-learning-how-athletes-learn-new-sport-skills-movements/](https://cortxperformance.com/articles/the-basics-of-motor-learning-how-athletes-learn-new-sport-skills-movements/)  
9. Motor Learning & Control In Athletic Performance \- NSCA CSCS \- GIFTED Academics, accessed June 2, 2026, [https://gifted-academics.com/motor-learning-and-control-nsca-cscs/](https://gifted-academics.com/motor-learning-and-control-nsca-cscs/)  
10. The Effectiveness of Planning Interventions for Improving Physical Activity in the General Population: A Systematic Review and Meta-Analysis of Randomized Controlled Trials \- PMC, accessed June 2, 2026, [https://pmc.ncbi.nlm.nih.gov/articles/PMC9223740/](https://pmc.ncbi.nlm.nih.gov/articles/PMC9223740/)  
11. The influence of adolescents' perceived task value in sport on exercise adherence: the chain mediating roles of general self-efficacy and action planning \- Frontiers, accessed June 2, 2026, [https://www.frontiersin.org/journals/psychology/articles/10.3389/fpsyg.2026.1828334/pdf](https://www.frontiersin.org/journals/psychology/articles/10.3389/fpsyg.2026.1828334/pdf)  
12. Adherence Support Strategies for Physical Activity Interventions in People With Chronic Musculoskeletal Pain—A Systematic Review and Meta-Analysis in \- Human Kinetics Journals, accessed June 2, 2026, [https://journals.humankinetics.com/view/journals/jpah/22/1/article-p4.xml](https://journals.humankinetics.com/view/journals/jpah/22/1/article-p4.xml)  
13. A meta-analytic review of the effect of implementation intentions on, accessed June 2, 2026, [https://www.tandfonline.com/doi/abs/10.1080/17437199.2011.560095?mi=3icuj5](https://www.tandfonline.com/doi/abs/10.1080/17437199.2011.560095?mi=3icuj5)  
14. If exercise is medicine, where is the dose? A call to ... \- Frontiers, accessed June 2, 2026, [https://www.frontiersin.org/journals/sports-and-active-living/articles/10.3389/fspor.2026.1777261/full](https://www.frontiersin.org/journals/sports-and-active-living/articles/10.3389/fspor.2026.1777261/full)  
15. If exercise is medicine, where is the dose? A call to improve reporting and monitoring of exercise interventions in fibromyalgia research \- PMC, accessed June 2, 2026, [https://pmc.ncbi.nlm.nih.gov/articles/PMC13132841/](https://pmc.ncbi.nlm.nih.gov/articles/PMC13132841/)  
16. For coaches \- Good Coach App, accessed June 2, 2026, [https://goodcoach.app/en/coach](https://goodcoach.app/en/coach)  
17. Designing and Evaluating Adapted Exercise and Sport Interventions: Toward a Pragmatic, Standardized, and Scalable Framework for Clinical and Community Practice \- Preprints.org, accessed June 2, 2026, [https://www.preprints.org/manuscript/202511.0259](https://www.preprints.org/manuscript/202511.0259)  
18. The Hidden Pattern Behind Elite Athletes: Deliberate Practice in Sport Psychology Supervision \- Dr Paul McCarthy, accessed June 2, 2026, [https://www.drpaulmccarthy.com/post/the-hidden-pattern-behind-elite-athletes-deliberate-practice-in-sport-psychology-supervision](https://www.drpaulmccarthy.com/post/the-hidden-pattern-behind-elite-athletes-deliberate-practice-in-sport-psychology-supervision)  
19. Heart Failure Patients' Adherence to Hybrid Comprehensive Telerehabilitation and Its Impact on Prognosis Based on Data from TELEREH-HF Randomized Clinical Trial \- MDPI, accessed June 2, 2026, [https://www.mdpi.com/2076-3417/12/5/2595](https://www.mdpi.com/2076-3417/12/5/2595)  
20. Optimizing performance through intrinsic motivation and attention for learning: The OPTIMAL theory of motor learning \- Gabriele Wulf, accessed June 2, 2026, [https://gwulf.faculty.unlv.edu/wp-content/uploads/2014/05/Wulf-Lewthwaite-2016-OPTIMAL-Theory.pdf](https://gwulf.faculty.unlv.edu/wp-content/uploads/2014/05/Wulf-Lewthwaite-2016-OPTIMAL-Theory.pdf)  
21. Optimize Your Students' Learning with OPTIMAL Theory \- The Snow Pros \- PSIA-AASI, accessed June 2, 2026, [https://thesnowpros.org/2026/03/optimize-your-students-learning-with-optimal-theory/](https://thesnowpros.org/2026/03/optimize-your-students-learning-with-optimal-theory/)  
22. Learning Benefits of Self-Controlled Knowledge of Results in 10-Year-Old Children \- Gabriele Wulf, accessed June 2, 2026, [https://gwulf.faculty.unlv.edu/wp-content/uploads/2014/05/Chiviacowsky\_Wulf\_S-C\_children\_2008.pdf](https://gwulf.faculty.unlv.edu/wp-content/uploads/2014/05/Chiviacowsky_Wulf_S-C_children_2008.pdf)  
23. Self-Controlled Learning: The Importance of Protecting Perceptions of Competence \- Frontiers, accessed June 2, 2026, [https://www.frontiersin.org/journals/psychology/articles/10.3389/fpsyg.2012.00458/full](https://www.frontiersin.org/journals/psychology/articles/10.3389/fpsyg.2012.00458/full)  
24. A Qualitative Examination of Hope and Physical Activity in the No, accessed June 2, 2026, [https://www.researchgate.net/publication/321933060\_A\_Qualitative\_Examination\_of\_Hope\_and\_Physical\_Activity\_in\_the\_No\_Limits\_Running\_Program](https://www.researchgate.net/publication/321933060_A_Qualitative_Examination_of_Hope_and_Physical_Activity_in_the_No_Limits_Running_Program)  
25. Demographic, Clinical, and Psychosocial Predictors of Exercise Adherence: The STRRIDE Trials \- PMC, accessed June 2, 2026, [https://pmc.ncbi.nlm.nih.gov/articles/PMC10553264/](https://pmc.ncbi.nlm.nih.gov/articles/PMC10553264/)  
26. a digitial health action process approach intervention to promote resistance training in healthy adult \- ProQuest, accessed June 2, 2026, [https://search.proquest.com/openview/6c212a86d0ab21d569d4ee97318b1caf/1.pdf?pq-origsite=gscholar\&cbl=18750\&diss=y](https://search.proquest.com/openview/6c212a86d0ab21d569d4ee97318b1caf/1.pdf?pq-origsite=gscholar&cbl=18750&diss=y)  
27. Self-Controlled Learning: The Importance of Protecting Perceptions of Competence \- PMC, accessed June 2, 2026, [https://pmc.ncbi.nlm.nih.gov/articles/PMC3487418/](https://pmc.ncbi.nlm.nih.gov/articles/PMC3487418/)  
28. The Duolingo Streak Uses Habit Research to Keep You Motivated, accessed June 2, 2026, [https://blog.duolingo.com/how-duolingo-streak-builds-habit/](https://blog.duolingo.com/how-duolingo-streak-builds-habit/)  
29. Streak Design: Motivation Without Burnout | Yu-kai Chou, accessed June 2, 2026, [https://yukaichou.com/gamification-analysis/streak-design-gamification-motivation-burnout/](https://yukaichou.com/gamification-analysis/streak-design-gamification-motivation-burnout/)  
30. Spaced Repetition With Gamification For Learning Retention \- eLearning Industry, accessed June 2, 2026, [https://elearningindustry.com/the-learning-retention-formula](https://elearningindustry.com/the-learning-retention-formula)  
31. Hot streak\! Inferences and predictions about goal adherence \- IDEAS/RePEc, accessed June 2, 2026, [https://ideas.repec.org/a/eee/jobhdp/v179y2023ics0749597823000572.html](https://ideas.repec.org/a/eee/jobhdp/v179y2023ics0749597823000572.html)  
32. Jackie Silverman \- Baker Retailing Center \- University of Pennsylvania, accessed June 2, 2026, [https://bakerretail.wharton.upenn.edu/phd-grants/jackie-silverman-2/](https://bakerretail.wharton.upenn.edu/phd-grants/jackie-silverman-2/)  
33. On or Off Track: How (Broken) Streaks Affect Consumer Decisions \- Oxford Academic, accessed June 2, 2026, [https://academic.oup.com/jcr/article-abstract/49/6/1095/6623414](https://academic.oup.com/jcr/article-abstract/49/6/1095/6623414)  
34. Use of the challenge point framework to guide motor learning of stepping reactions for improved balance control in people with stroke: a case series \- PubMed, accessed June 2, 2026, [https://pubmed.ncbi.nlm.nih.gov/24363337/](https://pubmed.ncbi.nlm.nih.gov/24363337/)  
35. Research application of session-RPE in monitoring the training load of elite endurance athletes \- Frontiers, accessed June 2, 2026, [https://www.frontiersin.org/journals/neuroscience/articles/10.3389/fnins.2024.1341972/full](https://www.frontiersin.org/journals/neuroscience/articles/10.3389/fnins.2024.1341972/full)  
36. Research application of session-RPE in monitoring the training load of elite endurance athletes \- PMC, accessed June 2, 2026, [https://pmc.ncbi.nlm.nih.gov/articles/PMC11155691/](https://pmc.ncbi.nlm.nih.gov/articles/PMC11155691/)  
37. Ecological Validity of the Session Rating of Perceived Exertion for Quantifying Internal Training Load in Fencing \- PubMed, accessed June 2, 2026, [https://pubmed.ncbi.nlm.nih.gov/27140957/](https://pubmed.ncbi.nlm.nih.gov/27140957/)  
38. (PDF) Does education improve adherence to a training monitoring ..., accessed June 2, 2026, [https://www.researchgate.net/publication/358083894\_Does\_education\_improve\_adherence\_to\_a\_training\_monitoring\_program\_in\_recreational\_athletes](https://www.researchgate.net/publication/358083894_Does_education_improve_adherence_to_a_training_monitoring_program_in_recreational_athletes)  
39. Session Rating of Perceived Exertion Is a Superior Method to Monitor Internal Training Loads of Functional Fitness Training Sessions Performed at Different Intensities When Compared to Training Impulse \- PMC, accessed June 2, 2026, [https://pmc.ncbi.nlm.nih.gov/articles/PMC7435063/](https://pmc.ncbi.nlm.nih.gov/articles/PMC7435063/)  
40. The Effect of Motor, Cognitive, and Combined Fatigue on Motor Performance and Learning, and Transfer. A Dissertation Presented \- Tennessee Research and Creative Exchange (TRACE), accessed June 2, 2026, [https://trace.tennessee.edu/server/api/core/bitstreams/d4b84de9-1720-467b-838c-252f0f16314e/content](https://trace.tennessee.edu/server/api/core/bitstreams/d4b84de9-1720-467b-838c-252f0f16314e/content)  
41. Validity, Reliability, and Application of the Session-RPE Method for Quantifying Training Loads during High Intensity Functional Training \- PMC, accessed June 2, 2026, [https://pmc.ncbi.nlm.nih.gov/articles/PMC6162783/](https://pmc.ncbi.nlm.nih.gov/articles/PMC6162783/)  
42. Use of the Challenge Point Framework to Guide Motor Learning of Stepping Reactions for Improved Balance Control in People With Stroke: A Case Series | Physical Therapy | Oxford Academic, accessed June 2, 2026, [https://academic.oup.com/ptj/article/94/4/562/2735678](https://academic.oup.com/ptj/article/94/4/562/2735678)  
43. Perception of effort decreases with motor sequence learning \- PMC, accessed June 2, 2026, [https://pmc.ncbi.nlm.nih.gov/articles/PMC12727923/](https://pmc.ncbi.nlm.nih.gov/articles/PMC12727923/)  
44. Changes in Perceived Mental Load and Motor Performance during Practice-to-Learn and Practice-to-Maintain in Basketball \- PMC, accessed June 2, 2026, [https://pmc.ncbi.nlm.nih.gov/articles/PMC10001915/](https://pmc.ncbi.nlm.nih.gov/articles/PMC10001915/)  
45. Practice or play in sport: What is best for creating champions? \- BelievePerform, accessed June 2, 2026, [https://members.believeperform.com/practice-or-play-in-sport-what-is-best-for-creating-champions/](https://members.believeperform.com/practice-or-play-in-sport-what-is-best-for-creating-champions/)  
46. Understanding Needs Satisfaction and Frustration in Young Athletes: Factor Structure and Invariance Analysis \- PMC, accessed June 2, 2026, [https://pmc.ncbi.nlm.nih.gov/articles/PMC7312040/](https://pmc.ncbi.nlm.nih.gov/articles/PMC7312040/)  
47. Deliberate Practice, Functional Performance and Psychological Characteristics in Young Basketball Players: A Bayesian Multilevel Analysis \- PMC, accessed June 2, 2026, [https://pmc.ncbi.nlm.nih.gov/articles/PMC7312187/](https://pmc.ncbi.nlm.nih.gov/articles/PMC7312187/)  
48. Thinking Out Loud: A Qualitative Study of Health Information User Experience in People with Disabilities | medRxiv, accessed June 2, 2026, [https://www.medrxiv.org/content/10.64898/2026.03.28.26349601v1.full-text](https://www.medrxiv.org/content/10.64898/2026.03.28.26349601v1.full-text)  
49. Detection of Mental Fatigue in the General Population: Feasibility Study of Keystroke Dynamics as a Real-world Biomarker \- PMC, accessed June 2, 2026, [https://pmc.ncbi.nlm.nih.gov/articles/PMC11041424/](https://pmc.ncbi.nlm.nih.gov/articles/PMC11041424/)  
50. University of Groningen Effects of task difficulty and old age on motor learning and its neural mechanisms Bootsma, Margot, accessed June 2, 2026, [https://research.rug.nl/files/179363691/Chapter\_2.pdf](https://research.rug.nl/files/179363691/Chapter_2.pdf)  
51. Deliberate Practice: The Key to Expert Skill Development \- Psychology Today, accessed June 2, 2026, [https://www.psychologytoday.com/us/blog/sport-between-the-ears/202409/deliberate-practice-the-key-to-expert-skill-development](https://www.psychologytoday.com/us/blog/sport-between-the-ears/202409/deliberate-practice-the-key-to-expert-skill-development)  
52. The Psychology of Hot Streak Game Design: How to Keep Players Coming Back Every Day Without Shame \- UX Magazine, accessed June 2, 2026, [https://uxmag.medium.com/the-psychology-of-hot-streak-game-design-how-to-keep-players-coming-back-every-day-without-shame-3dde153f239c](https://uxmag.medium.com/the-psychology-of-hot-streak-game-design-how-to-keep-players-coming-back-every-day-without-shame-3dde153f239c)  
53. Gamification of Behavior Change: Mathematical Principle and Proof-of-Concept Study, accessed June 2, 2026, [https://pmc.ncbi.nlm.nih.gov/articles/PMC10998180/](https://pmc.ncbi.nlm.nih.gov/articles/PMC10998180/)  
54. How Self-tracking and the Quantified Self Promote Health and Well-being: Systematic Review \- PMC, accessed June 2, 2026, [https://pmc.ncbi.nlm.nih.gov/articles/PMC8493454/](https://pmc.ncbi.nlm.nih.gov/articles/PMC8493454/)  
55. Predicted, Momentary and Session RPE | Musculoskeletal Key, accessed June 2, 2026, [https://musculoskeletalkey.com/predicted-momentary-and-session-rpe/](https://musculoskeletalkey.com/predicted-momentary-and-session-rpe/)  
56. Establishing the criterion validity and reliability of common methods for quantifying training load \- PubMed, accessed June 2, 2026, [https://pubmed.ncbi.nlm.nih.gov/24662229/](https://pubmed.ncbi.nlm.nih.gov/24662229/)  
57. Heart Rate Variability and Stress Recovery Responses during a Training Camp in Elite Young Canoe Sprint Athletes \- PMC, accessed June 2, 2026, [https://pmc.ncbi.nlm.nih.gov/articles/PMC6571616/](https://pmc.ncbi.nlm.nih.gov/articles/PMC6571616/)  
58. (PDF) Session Rating of Perceived Exertion (sRPE) Load and Training Impulse Are Strongly Correlated to GPS-Derived Measures of External Load in NCAA Division I Women's Soccer Athletes \- ResearchGate, accessed June 2, 2026, [https://www.researchgate.net/publication/355877047\_Session\_Rating\_of\_Perceived\_Exertion\_sRPE\_Load\_and\_Training\_Impulse\_Are\_Strongly\_Correlated\_to\_GPS-Derived\_Measures\_of\_External\_Load\_in\_NCAA\_Division\_I\_Women's\_Soccer\_Athletes](https://www.researchgate.net/publication/355877047_Session_Rating_of_Perceived_Exertion_sRPE_Load_and_Training_Impulse_Are_Strongly_Correlated_to_GPS-Derived_Measures_of_External_Load_in_NCAA_Division_I_Women's_Soccer_Athletes)  
59. Self-controlled learning of a complex motor skill: Effects of the learners' preferences on performance and self-efficacy, accessed June 2, 2026, [https://uol.de/f/4/inst/sport/download/andreasbund/publikationen/Publikation\_25.pdf](https://uol.de/f/4/inst/sport/download/andreasbund/publikationen/Publikation_25.pdf)  
60. The Psychology of Streaks: How Sylvi Weaponized Duolingo's Best Feature Against Them \- Trophy, accessed June 2, 2026, [https://trophy.so/blog/the-psychology-of-streaks-how-sylvi-weaponized-duolingos-best-feature-against-them](https://trophy.so/blog/the-psychology-of-streaks-how-sylvi-weaponized-duolingos-best-feature-against-them)  
61. Athlete Space \- App Store, accessed June 2, 2026, [https://apps.apple.com/us/app/athlete-space/id6758096470](https://apps.apple.com/us/app/athlete-space/id6758096470)  
62. Survival of the Fittest? Examining Lapsing Behaviour in the Context of Elderly People and the Use of Physical Activity Tracker A \- ScholarSpace, accessed June 2, 2026, [https://scholarspace.manoa.hawaii.edu/bitstreams/52ba325a-1512-457b-808f-f3acb3f882ae/download](https://scholarspace.manoa.hawaii.edu/bitstreams/52ba325a-1512-457b-808f-f3acb3f882ae/download)

[image1]: # "inline base64 effect-size symbol (β) stripped to avoid storing a binary blob"
[image2]: # "inline base64 effect-size symbol (eta-squared) stripped to avoid storing a binary blob"

[image3]: # "inline base64 effect-size symbol (time x condition) stripped to avoid storing a binary blob"
