---
id: brief-response-coach-pedagogy-translation-vendor-3-2026-06-02
title: "Vendor response: coach-pedagogy translation to self-coached (vendor 3, 2026-06-02)"
status: verbatim
stage: validation
type: brief-response
authority: "Verbatim record of vendor 3's response to the 2026-05-27 coach-pedagogy-translation brief; raw, not curated canon; distillation lives in `docs/research/coach-pedagogy-translation-self-coached.md`."
summary: "Vendor 3 rules Technique A 'partially translates under specific framings' at HIGH confidence and Technique B 'partially translates under specific framings' at moderate confidence — the most bullish and most citation-dense of the three. For A it insists on user-authored 'Open Goals' / micro-goals (never SMART/outcome goals, never app-generated): Schimpf et al. 2026 (N=470) shows LLM-authored goals score higher on SMART quality but collapse psychological ownership and two-week adherence (72.8% → 46.6%), so the UI friction of authoring is the active ingredient; rigid specific goals trigger Wegner ironic-monitoring and self-criticism with no coach to regulate. For B it frames expectancy as a neurophysiological placebo that alters corticospinal excitability (TMS study), so it translates via any credible delivery medium — but flags that the enhanced-expectancy base is inflated by publication bias (bias-adjusted estimate near zero) and that only subjective/affective, hard-to-disconfirm promises ('feel more confident') are safe; objective guarantees ('better passer') risk durable trust damage. Concludes the pair compounds positively under OPTIMAL theory (autonomy + enhanced expectancy + external focus) and should ship as one conversational pre-session routine with an end-of-session reflection as the accountability substitute."
last_updated: 2026-06-02
responds_to: docs/research/briefs/2026-05-27-brief-coach-pedagogy-translation-self-coached.md
distilled_in: docs/research/coach-pedagogy-translation-self-coached.md
depends_on:
  - docs/research/briefs/README.md
  - docs/research/coach-pedagogy-translation-self-coached.md
---

# Vendor response: coach-pedagogy translation to self-coached (vendor 3, 2026-06-02)

## Provenance and handling

- **Vendor:** vendor 3 (identifier preserved for the reconciliation pass; redact before any external share).
- **Received:** 2026-06-02 (responds to a brief authored 2026-05-27).
- **Responds to:** [`docs/research/briefs/2026-05-27-brief-coach-pedagogy-translation-self-coached.md`](../2026-05-27-brief-coach-pedagogy-translation-self-coached.md) — the coach-pedagogy-translation brief listed in [`docs/research/briefs/README.md`](../README.md).
- **Status:** `verbatim`. This file is the raw deliverable as received. Do not edit content; corrections and commentary live in the distillation note linked below. **One mechanical exception:** 14 inline base64-encoded effect-size/sample-size symbol images in the original were replaced with bracketed placeholder reference-definitions to avoid storing large binary blobs in the repo; the inline `![][imageN]` markers are left in place and no prose was altered.
- **Distilled in:** [`docs/research/coach-pedagogy-translation-self-coached.md`](../../coach-pedagogy-translation-self-coached.md) — use that note for repo-facing conclusions, cross-links, and decision implications.
- **Convention:** revision-by-replacement per `docs/research/briefs/README.md`. If vendor 3 submits a revised response, it ships as a new `-vendor-3-revised-<date>.md` file; this file is not edited in place.

## Verbatim response

# **Translation of Coach-Presence Pedagogy Techniques to Self-Administered Training Apps**

## **Executive Summary**

This report evaluates the pedagogical translation of two established coach-presence techniques—athlete-set per-session goals (Technique A) and forward-looking outcome promises (Technique B)—into a self-administered, local-first mobile training application. The target population consists of adult recreational athletes in skill-sports with two to five years of experience, engaging in one to three self-coached sessions per week.  
The central inquiry is whether the behavioral and skill-acquisition effects of these techniques survive the removal of the interpersonal coach, or whether the mechanisms underlying these techniques rely so heavily on social accountability and external gaze that application-mediated delivery introduces friction without behavioral lift.  
Based on an exhaustive synthesis of sport psychology, motor learning literature, cognitive psychology, and human-computer interaction (HCI) research, the fundamental conclusion is that the cognitive mechanisms underlying both techniques can survive translation, but only if they are radically reframed to account for the absence of a coach's real-time emotional regulation.

| Pedagogy Technique | Verdict | Confidence | Recommended Framing Paradigm | Core Mechanism of Translation |
| :---- | :---- | :---- | :---- | :---- |
| **A. Athlete-Set Per-Session Goal** | **Partially translates under specific framings.** | High | "Open Goals" or "Micro-Goals." The user must actively author or assemble the goal. | Self-authored goals generate psychological ownership and attentional narrowing. Open parameters prevent ironic monitoring distress. |
| **B. Forward-Looking Outcome Promise** | **Partially translates under specific framings.** | Moderate | Affective, state-based, or effort-linked promises (e.g., confidence, feel). | Verbal framing induces a top-down neurophysiological placebo effect (corticospinal excitability) that does not require social pressure. |

**Summary Rationale for Technique A:** The underlying mechanism of goal-setting facilitates motor learning and self-regulated behavior independent of social accountability.1 However, rigid, specific performance goals (e.g., "SMART" goals) in a self-administered context actively harm adult recreational learners. Stripped of a coach’s emotional regulation, specific goals trigger "ironic processes of mental control," wherein the athlete’s cognitive bandwidth is consumed by monitoring for failure, leading to self-criticism, anxiety, and motor degradation.3 Furthermore, highly optimized application-generated goals severely depress psychological ownership and subsequent execution.6 Translation is highly defensible and effective *only* if the app utilizes user-authored "open goals" or exploratory "micro-goals" that bypass the monitoring-distress loop.7  
**Summary Rationale for Technique B:** Outcome promises enhance motor learning not merely through social pressure, but through cognitive expectancy mechanisms that directly alter corticospinal excitability—essentially a placebo effect.9 Because this is a neurophysiological top-down enhancement, it can theoretically be triggered by an app. However, unfulfilled objective promises damage trust and drive disengagement.11 Recent meta-analyses also indicate that the baseline effect of expectancy on motor learning has been historically exaggerated by underpowered study designs and publication bias.13 Translation is defensible *only* if the app limits promises to subjective, affective states (e.g., "You will feel more confident") rather than objective skill acquisition, thereby creating an unfalsifiable placebo loop that enhances engagement without risking expectancy violation.15  
**Ship/No-Ship Recommendation:** Shipping both surfaces as a paired, pre-session routine is empirically supported, provided the user interface strictly constrains the pedagogical framing. The pair compounds positively under the OPTIMAL theory of motor learning (additive benefits of autonomy and enhanced expectancies) provided the goal remains exploratory and the promise remains affective.16

## **1\. Theoretical Foundation: The Psychology of the Self-Coached Amateur**

The challenge of designing a local-first mobile training application for adult recreational skill-sport athletes lies in the psychological dissonance between coached and self-administered environments. In conventional coaching environments, the interpersonal relationship acts as a regulatory buffer. A coach provides not only pedagogical structure but also real-time emotional modulation, attentional anchoring, and external accountability.18 When an athlete becomes frustrated, the coach instinctively intervenes to lower cognitive load, perhaps by shifting the drill constraints or altering the goal criteria.19  
When the coach is removed, the athlete must rely entirely on internal self-regulatory mechanisms. Adult amateur athletes—typically training one to three times per week alongside competing professional and personal cognitive loads—often lack the robust self-regulatory frameworks inherent to elite or expert populations.21 According to Zimmerman’s socio-cognitive models of Self-Regulated Learning (SRL), novices display fundamentally distinct self-regulation profiles compared to experts.2 Novices struggle to interpret subtle progress, making them highly susceptible to motivational collapse when confronted with absolute failure metrics.1  
Consequently, pedagogical techniques that thrive in coached environments can unexpectedly fail or introduce severe psychological friction when blindly ported to a digital, self-guided interface. To determine the viability of Techniques A and B, this report systematically deconstructs the empirical evidence in coached contexts, isolates the underlying psychological and neurophysiological mechanisms, and evaluates translation evidence from human-computer interaction (HCI), digital mental health, and self-tracking application domains.

## **2\. Technique A: Athlete-Set Per-Session Goal Aligned to Practice Focus**

**Verdict:** Partially translates under specific framings.  
**Confidence Level:** High.  
The proposition of capturing a user-authored, per-session goal aligned to a specific practice focus is a direct translation of the "forethought" phase of self-regulated learning.2 The core inquiry is whether the frictional cost of this UI input yields a behavioral lift when the user knows no human coach will review the goal.

### **2.1 Evidence Ladder: Coached Contexts**

The efficacy of goal-setting in traditional athletic and motor-learning contexts is extensively documented. Rooted in Goal-Setting Theory, the act of articulating a target prior to execution is a primary driver of skill consolidation.1  
Within athletic populations, setting goals directs attention, mobilizes effort, enhances persistence, and promotes the development of new learning strategies.22 The baseline behavioral effect of goal-setting in sport is well-established.

| Study / Source | Population & Design | Key Findings | Effect Size / Metrics |
| :---- | :---- | :---- | :---- |
| **Kyllo & Landers (1995)** 25 | Meta-analysis of accessible research on goal-setting in sport/exercise. | Setting goals robustly improves sport performance. Moderate, absolute, and combined short/long-term goals yielded the greatest effects compared to non-specific or absent goals. | Overall ![][image1] to ![][image2] (depending on random-effects modeling updates). |
| **Shokri et al. (2023)** 27 | ![][image3] recreational male soccer players (aged 18-28). Quasi-experimental 3-arm trial (self-controlled goals, coach-controlled goals, control). 15 sessions. | Autonomy in goal setting significantly improved soccer passing skill retention and transfer. Self-controlled groups outperformed coach-controlled and control groups after a 72-hour delay. | Statistically significant differences in retention and transfer ANOVAs. |
| **SC vs. PR Feedback Meta-Analysis** 30 | 29 studies, ![][image4] participants. Meta-analysis of self-controlled (SC) vs passively received (PR) feedback. | Providing the learner with autonomy over their learning environment significantly facilitates motor skill learning consolidation. | Transfer phase: ![][image5] over PR; Retention phase: ![][image5] over PR. |

These data clearly demonstrate that goal-setting works, and crucially, that *autonomy* in goal-setting (the athlete setting the goal rather than the coach) yields superior retention and transfer of complex motor skills.27 This autonomy advantage is the first indicator that the cognitive mechanism can survive without top-down coach dictation.

### **2.2 Mechanism Evidence: The Dueling Architectures of Mental Control**

The survival of the goal-setting effect hinges on understanding whether the behavioral lift comes from internal cognitive priming or external social accountability. The literature strongly supports a dual mechanism, driven by two competing psychological architectures: Self-Determination Theory (SDT) and the Theory of Ironic Processes of Mental Control.  
**The Internal Driver: Psychological Ownership and Autonomy (SDT)** SDT posits that human motivation requires the satisfaction of three basic psychological needs: autonomy, competence, and relatedness.32 In the context of motor learning, self-authored goal-setting satisfies the need for autonomy.17 The cognitive priming achieved through self-authored goals narrows attentional focus, filtering out task-irrelevant stimuli.34 Because this attentional narrowing occurs internally—altering the user's interaction with the task rather than their interaction with an observer—it does not strictly require an interpersonal coach to function. The active ingredient is the cognitive friction of authoring the goal, which generates psychological ownership.  
**The Internal Threat: Ironic Processes of Mental Control** Conversely, goal-setting introduces profound psychological risk through Wegner’s Theory of Ironic Processes of Mental Control.3 Wegner postulates that intentional mental control requires two parallel cognitive systems:

1. **An Operating Process:** Actively searches for thoughts, emotions, and motor execution patterns consistent with the stated goal. This process is highly demanding of cognitive capacity.3  
2. **A Monitoring Process:** Subconsciously scans the environment and internal state for failures, errors, or inconsistencies with the goal. This process runs continuously in the background with a low cognitive cost.4

Under conditions of low cognitive load, the operating process successfully guides behavior toward the goal. However, under conditions of cognitive load—such as an adult amateur attempting to master a complex physical skill while fatigued or stressed—the operating process fails.3 The monitoring process, however, remains active.4 Consequently, the athlete's mind becomes hyper-sensitized to the exact errors they are trying to avoid.  
In a coached environment, the coach serves as an external emotional regulator. If a coach observes the athlete spiraling into ironic monitoring (evidenced by frustration, physical tension, or repeated identical errors), the coach actively intervenes, reframes the goal, or alters the drill to reduce cognitive load.20  
In a self-administered application, there is no emotional safety net. If an app prompts an amateur athlete to set a rigid, highly specific performance goal (e.g., "Complete 10 consecutive passes without dropping the racket head"), it hyper-activates the monitoring process. Without a coach to disrupt the cycle upon failure, this induces monitoring-distress, self-criticism, anxiety, and a paradoxical degradation in motor performance—a phenomenon widely recognized in sport psychology as "choking" under self-induced pressure.5

### **2.3 Evidence Ladder: Self-Administered Translation and Analogues**

When translated to self-administered human-computer interfaces, the design implementation of the goal-capture surface dramatically alters its efficacy. HCI research provides direct evidence regarding how digital goal-setting impacts adherence.  
**The Authorship and Ownership Penalty:** A critical 2026 preregistered experiment by Schimpf et al. explored what happens when goal-setting is delegated to an application, specifically using Large Language Models (LLMs) to generate goals based on user reflections.6 The results are highly counterintuitive and vital for application design.

| Construct Measured (Schimpf et al. 2026, N=470) | Self-Authored Goals | Application-Generated (LLM) Goals | Effect Size / Difference |
| :---- | :---- | :---- | :---- |
| **Objective Goal Quality (SMART criteria)** | Lower | Significantly Higher | LLM advantage: ![][image6] |
| **Psychological Ownership** | Significantly Higher | Lower | Self-authored advantage: ![][image7] |
| **Goal Commitment** | Significantly Higher | Lower | Self-authored advantage: ![][image7] |
| **Perceived Task Importance** | Significantly Higher | Lower | Self-authored advantage: ![][image7] |
| **Behavioral Adherence (Two-week follow-up)** | 72.8% acted on ![][image8] goals | 46.6% acted on ![][image8] goals | Massive adherence drop for LLM goals. |

The application-generated goals were objectively superior to human-authored goals according to traditional criteria, showing a massive quality advantage (![][image6]).6 However, removing the friction of authoring the goal triggered a catastrophic collapse in user motivation. Mediation analyses identified psychological ownership as the precise mechanism: delegating the cognitive work to the app destroyed the user's ownership of the goal, which mediated the drop in execution.6  
This definitively proves that the UI friction of user-input is not a barrier to be optimized away; it is the active behavioral ingredient. If the app bypasses this friction by providing a pre-populated list of highly optimized, specific goals (e.g., tap to select "improve platform stability"), it severely depresses the likelihood of the athlete actually pursuing the goal.  
**Micro-Goals for Situated Action:** In the physical activity tracking domain, standard fixed-goal architectures (e.g., rigid daily step counts) frequently misalign with adult users' fluctuating schedules, leading to frustration and application abandonment.7 Gouveia et al. (2026) conducted a 27-day field study (![][image9]) testing a smartwatch app called *Mikro*, which replaced rigid daily goals with "micro-goals"—brief, situated, highly immediate targets set on-the-go.7 They found that shifting the framing to micro-goals encouraged frequent, flexible tailoring and helped users capitalize on small opportunities for movement without the psychological burden of long-term failure.7 This maps perfectly to the per-session skill-sport context: the goal must be small, immediate, and bound solely to the current session to prevent cognitive overload.

### **2.4 Failure Modes in Self-Administered Contexts**

The literature highlights several critical failure modes when translating goal-setting to un-monitored, self-coached populations:

1. **The Monitoring-Self-Criticism Loop:** As predicted by Wegner’s Ironic Processes, when amateurs set rigid specific goals without a coach present, they often spiral into unhealthy perfectionism.5 Perfectionistic strivings in self-administered contexts are heavily associated with worry, severe self-criticism, and accelerated athlete burnout.5  
2. **The "SMART" Goal Trap in Complex Motor Learning:** While SMART (Specific, Measurable, Achievable, Relevant, Time-bound) goals are standard in workplace productivity, rigid, highly specific targets actually impede progress in contexts requiring the learning of complex motor skills.44 A study of 247 participants found that rigid, specific goals stifled exploration, adaptation, and creative performance compared to open-ended goals.44 In skill-sports, where motor adaptation is paramount, rigid goals act as a straightjacket.  
3. **App Overload and Frictional Fatigue:** Over-structuring the goal-setting process at the start of a session introduces tool overload. If the cognitive friction of capturing the goal feels like administrative overhead rather than pedagogical priming, the user will abandon the application loop entirely.45

### **2.5 Recommended Framings: "Open Goals"**

Because the mechanism of goal-setting survives translation, but specific/SMART goals trigger self-criticism and ironic monitoring in self-administered amateur contexts, the application must utilize **Open Goals**.  
Open goals are defined in sport psychology as "nonspecific and phrased in an exploratory way, with measurable parameters, producing graded (rather than succeed-or-fail) outcomes".8 Research by Swann et al. (2025) across 12 expert sport psychology practitioners (averaging 13.4 years of experience) revealed that open goals are highly preferred for mitigating maladaptive psychological responses, particularly in situations of uncertainty, novelty, or amateur development.8  
Unlike specific goals (e.g., "Pass the ball to the target 90% of the time") or vague goals (e.g., "Do your best"), open goals anchor the user to a metric but remove the absolute failure threshold, entirely bypassing the monitoring-distress loop.8  
**Recommended Application Copy/Framing Patterns:**

* **Pattern 1: The Exploratory Threshold.** "Let's see how \[adjective\] you can make your \[skill\] feel today." (e.g., *Let's see how stable you can make your platform feel today.*) This pattern maintains focus but frames the session as an experiment rather than a test.8  
* **Pattern 2: The Range Goal.** "Aim to land between \[X\] and successful reps this session." Range goals contain upper and lower quantitative values, forming reference points that provide flexibility and protect against failure monitoring.47  
* **UI Implementation Rule:** The application *must* require the user to type or actively assemble the goal. To preserve the psychological ownership effect (![][image10]) observed by Schimpf et al., the UI must not auto-populate a default SMART goal.6 The friction of inputting the open goal is the mechanism of action.

## **3\. Technique B: Forward-Looking Outcome Promise**

**Verdict:** Partially translates under specific framings.  
**Confidence Level:** Moderate.  
At session start, having the app state a forward-looking outcome the user can expect by session end (e.g., "By the end of practice, you should feel more confident in this skill") attempts to digitalize a coach's pre-performance priming. The central question is whether users intuitively reject digital promises as algorithmic marketing, or whether the cognitive priming effect supersedes the delivery medium.

### **3.1 Evidence Ladder: Coached Contexts and the OPTIMAL Theory**

The practice of a coach providing a forward-looking outcome promise is deeply rooted in the OPTIMAL (Optimizing Performance through Intrinsic Motivation and Attention for Learning) theory of motor learning, proposed by Wulf and Lewthwaite (2016).34  
OPTIMAL theory asserts that enhancing a learner's expectancies (EE) for future successful outcomes facilitates motor skill acquisition by strengthening the coupling of goals to actions.16 When a coach provides an outcome promise, it theoretically decreases the learner’s perception of task difficulty, fostering reward anticipation at the neural level, which increases the cognitive resources devoted to motor programming.16  
Initial meta-analytic evaluations of enhanced expectancies in motor learning painted a highly optimistic picture.

| Study / Source | Population & Design | Key Findings | Effect Size / Metrics |
| :---- | :---- | :---- | :---- |
| **Bacelar et al. (2022)** 16 | Meta-analysis of 6 types of manipulations to enhance expectancies in motor learning. | Enhancing learners' expectancies has a significant positive effect on skill retention. | ![][image11] (95% CI \[0.38, 0.70\]) for skill retention. |
| **Wulf et al. / OPTIMAL Framework** 34 | Synthesis of motor learning trials utilizing enhanced expectancies and autonomy support. | Positive statements, social-comparative feedback, and performance promises facilitate motor skill acquisition and increase confidence. | Varied positive effects across multiple discrete skill trials. |

**The Methodological Crisis in Motor Learning Expectancy:** The confidence level for this technique is downgraded to *Moderate* due to a severe methodological reckoning currently occurring within the specific literature surrounding enhanced expectancies. Subsequent re-evaluations of the exact same body of literature by McKay, Bacelar, and Parma (2022–2024) revealed that the original estimates were heavily inflated by publication bias, selective reporting, and systematically underpowered study designs.14  
When adjusted for reporting bias via weight-function models and p-curve analyses, the true average effect of enhanced expectancies and self-controlled practice on motor learning dropped to a trivially small estimate that was statistically indistinguishable from zero (![][image12], 95% CI \[0.047, 0.18\]).54  
Furthermore, a 2024 systematic review by Parma et al. examining 166 experiments in the OPTIMAL literature found that only 21% actually measured motivation as an outcome. Of those, only 23% found group-level effects on motivation.13 This directly undermines the foundational claim that outcome promises operate primarily by increasing conscious motivation, suggesting that if outcome promises work, they do so through a different mechanism entirely.13

### **3.2 Mechanism Evidence: Expectancy as a Neurophysiological Placebo**

If the conscious motivational pathway is statistically tenuous, why do outcome promises appear to work in real-world coaching? The mechanism driving Technique B is not purely social pressure or conscious motivation, but rather a top-down neurophysiological *placebo effect* that alters corticospinal excitability.  
Because a placebo effect requires only the *belief* in an outcome, it does not strictly require an interpersonal human relationship; it only requires a credible delivery mechanism. A landmark study applying transcranial magnetic stimulation (TMS) during a motor task isolated this phenomenon.9  
Healthy volunteers (![][image13]) performed a motor task by pressing a piston. The experimental groups were given a placebo intervention (inert TENS electrical stimulation) paired with the verbal promise that the stimulation would improve movement execution.9 The control groups received no such promise.

* **Behavioral Result:** The experimental groups reached higher levels of force, reported less perceived fatigability, and expected to perform better.9  
* **Neurophysiological Result:** Crucially, TMS readings showed an actual enhanced excitability of the corticospinal system in the specific muscle involved in the task (evidenced by increased amplitude of motor evoked potentials and decreased duration of the cortical silent period).9

The verbal promise alone structurally primed the motor cortex for superior performance.9 This demonstrates that the mechanism *does* translate. An application can deliver a verbal or textual promise that primes the motor cortex, provided the application holds sufficient credibility to induce the placebo belief in the user.

### **3.3 Evidence Ladder: Self-Administered Translation and Analogues**

In digital Human-Computer Interaction (HCI) and Computer-Supported Cooperative Work (CSCW) applications, conversational agents and health platforms frequently utilize pre-task outcome promises and motivational framing.11  
A core finding in HCI mental health and behavioral application design is the strict distinction between *evaluative* algorithmic feedback and *motivational/affective* framing. Conversational agents that provide empathetic, supportive framing (e.g., "The way you’ve reflected is powerful, you’re building toward something stronger") are generally perceived positively, build therapeutic alliance, and sustain engagement.11  
However, delivering an outcome promise via a digital application introduces a unique vulnerability not present with a human coach: the absolute threshold for trust damage.

### **3.4 Failure Modes: Expectancy Violation and Trust Damage**

If an application delivers a concrete, objective forward-looking promise (e.g., "By the end of this session, your passing accuracy will improve by 10%"), it enters a perilous gamble with the user's trust.

1. **Expectancy Violation:** If the objective outcome does not materialize, the user experiences a severe expectancy violation. Unlike a human coach—who possesses the social capital to quickly reframe the failure ("You didn't get the accuracy, but your elbow angle was much better")—the application is left as a static, unfulfilled promiser. Repeated expectancy violations systematically destroy the application's credibility.12 Once credibility is lost, the placebo mechanism detailed in Section 3.2 ceases to function, rendering the pre-session promise as annoying, motivational fluff.  
2. **Algorithmic Aversion:** Users hold digital systems to stricter accuracy standards than humans. If an app makes a promise about physical skill acquisition that feels overly deterministic, users intuitively reject it as corporate marketing or algorithmically hollow.11 This aversion prevents the placebo priming from ever taking root.

### **3.5 Recommended Framings: Affective and State-Based Promises**

To safely translate Technique B, the application must utilize the placebo-priming effect without risking expectancy violation. This is achieved by framing the outcome promise around internal, subjective, *affective states* rather than objective skill benchmarks. Because affective states are subjective, the promise becomes inherently un-falsifiable by the user, creating a closed-loop placebo effect.  
**Recommended Application Copy/Framing Patterns:**

* **Pattern 1: The Affective/Confidence Promise.** "Today we're concentrating on passing. By the end of practice, you should feel more confident in this skill." (This exactly matches the brief's example and is highly supported. Confidence is a subjective state; the mere suggestion acts as a self-fulfilling placebo that primes corticospinal excitability without risking objective failure).15  
* **Pattern 2: The Effort-Linked Promise.** "Focus on your footwork today. The effort you put into this session will lay the groundwork for better stability next time." (This ties the expectancy directly to the user's effort, shifting the locus of control back to the user and preventing algorithmic aversion).60  
* **What to Strictly Avoid:** "By the end of practice, you will be a better passer." (Objective, highly falsifiable, risks trust damage if the user has an objectively poor session).

## **4\. Pair-Compounding (Techniques A \+ B Together)**

When Technique A (user-set goal) and Technique B (app-stated promise) are shipped in the same pre-session loop, the literature suggests they **compound positively**, rather than compete for attention, provided their pedagogical framings are aligned.  
This compounding effect is the exact structural basis of the OPTIMAL theory of motor learning.17 Wulf and Lewthwaite’s framework rests on three interacting pillars that must operate simultaneously for maximum effect:

1. **Autonomy Support:** Satisfied by Technique A (Athlete sets the goal).  
2. **Enhanced Expectancies:** Satisfied by Technique B (App promises a positive outcome).  
3. **External Focus of Attention:** Driven by the specific external constraints of the drill.

Studies testing these variables in isolation versus in combination consistently demonstrate additive benefits.17 Providing autonomy independently increases self-efficacy.17 Providing an outcome promise independently increases positive affect and motor excitability.9 When paired sequentially—for instance, the user inputs their goal, and the app immediately responds with a confirming outcome promise—the learner's perception of task difficulty decreases, intrinsic motivation increases, and "Goal-Action Coupling" is maximally strengthened.16  
**Design Implication for the Application Loop:**  
To maximize compounding and minimize UI surface clutter, the two techniques should function as a conversational pairing rather than two disconnected administrative forms.

* **Step 1 (Technique A \- The Input):** The app prompts the user to set an Open Goal ("What are we exploring today?"). The user types or assembles their micro-goal.  
* **Step 2 (Technique B \- The Validation):** The app validates the input and provides the affective promise ("Great focus. By the end of this session, you should feel more confident in that area.").  
* **Step 3 (Post-Session Reflection \- The Accountability Substitute):** To substitute for the social accountability of a coach, the end-of-session reflection must close the loop by asking the user to self-assess their internal state relative to the open goal.63 This structural reflection provides the necessary psychological closure without requiring interpersonal review.64

## **5\. Practitioner Intuition: Translating the Human Element**

Expert coaching curricula and applied sport psychology practitioners maintain a highly nuanced view of self-administered amateur training that strongly aligns with the empirical findings above.  
Practitioners frequently observe that standard, coach-directed models (where the coach identifies the problem, prescribes the fix, and evaluates the outcome) produce competent athletes, but critically fail to produce athletes who can effectively "coach themselves".19 When amateurs are forced to train alone, they naturally default to high-volume repetition or harsh self-criticism because they lack the pedagogical tools to evaluate nuance and forgive failure.5  
Experienced sport psychologists emphasize that the goal of a self-coaching tool should not be to perfectly mimic a human coach’s judgmental gaze, but to teach the athlete how to redirect their own attention.20 Therefore, practitioners heavily advocate for "process over outcome" and routinely integrate mindfulness and self-compassion frameworks into solo training regimens.66  
If an athlete sets a goal and fails to meet it during a solo session, an app cannot step in to physically stop them from spiraling into frustration. Practitioners advise that any self-guided goal-setting must be accompanied by explicit permission to fail, framing the session as an "experiment" rather than a "test".20 This applied intuition heavily supports the use of "open goals" (Technique A) and affective, non-judgmental outcome promises (Technique B), reinforcing the concept of "compassionate debriefing" as a vital component of digital health tool design.58

## **6\. Gaps in the Literature and Proposed Future Research**

While the components of this research question can be triangulated through motor learning theory, cognitive psychology, and HCI data, there remains a distinct gap in the empirical literature explicitly evaluating the translation of these *combined* pedagogical techniques to a digital, self-administered environment for skill-sport athletes.  
The literature is systematically absent on the specific intersection of:

1. **Population:** Adult, non-elite recreational skill-sport athletes (2–5 years experience). Much of the goal-setting and OPTIMAL theory data relies on university-aged novices in artificial laboratory settings (e.g., throwing beanbags, balancing on stabilometers, indoor golf putting) 33, or clinical rehabilitation populations.71  
2. **Intervention:** Purely app-mediated (no human-in-the-loop) pre-session pedagogical framing combining goal-setting and expectancy. Conversely, the HCI literature exploring digital goal-setting relies predominantly on general fitness (e.g., automated step counting) 7 or digital mental health apps 12, which do not demand the complex, high-bandwidth motor execution requirements of a skill-sport.  
3. **Outcomes:** Longitudinal behavioral adherence and objective motor skill consolidation tracked simultaneously.

**Proposed Study to Close the Gap:**  
To definitively answer the translation question and provide exact effect sizes for the product team, a 6-week randomized controlled trial (RCT) in the wild is required.

* **Population:** ![][image14] adult recreational skill-sport athletes (e.g., amateur tennis, squash, or climbing enthusiasts, 2–5 years experience).  
* **Design:** A 3-arm longitudinal field study using a stripped-down beta version of the training application.  
  * *Group 1 (Control):* Quick-start loop (no goal capture, no pre-session promises).  
  * *Group 2 (Specific/SMART Framing):* App prompts for a specific performance goal \+ provides an objective, falsifiable outcome promise.  
  * *Group 3 (Open/Affective Framing):* App prompts for an open goal \+ provides a state-based affective outcome promise (The recommended paradigm).  
* **Measures:**  
  1. *Behavioral Adherence:* Within-session engagement and longitudinal app retention at 3 and 6 weeks.  
  2. *Psychological State:* Self-reported monitoring-distress, self-efficacy, and psychological ownership (measured via validated ecological momentary assessment instruments weekly).  
  3. *Skill Consolidation:* Objective pre- and post-intervention video analysis of a targeted foundational skill, graded by blinded human coaches.

This proposed study would isolate whether the specific wording of the application mitigates the ironic monitoring distress inherent in self-coached populations, providing definitive, context-specific effect sizes to validate the long-term product strategy.

## **7\. Conclusion**

Translating coach-presence pedagogy to a self-administered digital application is entirely defensible, provided the product design explicitly respects the psychological vulnerabilities of the solo adult athlete. The absence of an interpersonal coach removes the external emotional regulation necessary to protect athletes from the anxiety, self-criticism, and ironic monitoring inherent in rigid performance tracking.  
Therefore, **Technique A (athlete-set goals)** must be implemented using **Open Goals** that require active user authorship. This protects the user from ironic monitoring while preserving the massive psychological ownership benefit that drives behavioral engagement. **Technique B (outcome promises)** must be implemented using **Affective, State-Based Promises** that leverage top-down neurophysiological placebo mechanisms without risking the fatal trust damage of unfulfilled objective guarantees.  
When constrained by these precise linguistic and pedagogical framings, the two techniques compound effectively, substituting the social accountability of a human coach with the cognitive priming of an optimized, self-regulatory digital loop.

#### **Works cited**

1. Self-Regulated \- ResearchGate, accessed June 2, 2026, [https://www.researchgate.net/profile/Barry\_Zimmerman/publication/237065878\_Becoming\_a\_Self-Regulated\_Learner\_An\_Overview/links/549483c30cf2ec133757e74d.pdf](https://www.researchgate.net/profile/Barry_Zimmerman/publication/237065878_Becoming_a_Self-Regulated_Learner_An_Overview/links/549483c30cf2ec133757e74d.pdf)  
2. A Review of Self-regulated Learning: Six Models and Four Directions for Research \- PMC, accessed June 2, 2026, [https://pmc.ncbi.nlm.nih.gov/articles/PMC5408091/](https://pmc.ncbi.nlm.nih.gov/articles/PMC5408091/)  
3. Ironic Mental Processes in Sport: Implications for Sport Psychologists in \- Human Kinetics Journals, accessed June 2, 2026, [https://journals.humankinetics.com/view/journals/tsp/13/2/article-p201.xml](https://journals.humankinetics.com/view/journals/tsp/13/2/article-p201.xml)  
4. Ironic Processes of Mental Control \- Daniel Gilbert, accessed June 2, 2026, [https://dtg.sites.fas.harvard.edu/DANWEGNER/pub/Wegner%20Ironic%20Processes%201994.pdf](https://dtg.sites.fas.harvard.edu/DANWEGNER/pub/Wegner%20Ironic%20Processes%201994.pdf)  
5. The Two Faces of Perfectionism in Sport — Sport Psychology Training | Zelico Performance, accessed June 2, 2026, [https://www.zelicoperformance.com/blog/the-two-faces-of-perfectionism-in-sport](https://www.zelicoperformance.com/blog/the-two-faces-of-perfectionism-in-sport)  
6. Lyle Ungar's research works | University of Pennsylvania and other places \- ResearchGate, accessed June 2, 2026, [https://www.researchgate.net/scientific-contributions/Lyle-Ungar-2118737173](https://www.researchgate.net/scientific-contributions/Lyle-Ungar-2118737173)  
7. Breaking it Down: Micro Goals in Physical Activity Tracking \- Rúben Gouveia, accessed June 2, 2026, [https://www.rubengouveia.com/papers/chi26c-sub9519-cam-i16.pdf](https://www.rubengouveia.com/papers/chi26c-sub9519-cam-i16.pdf)  
8. Using Nonspecific Goals in Sport: Guidance for Sport Psychology Practitioners \- Taylor & Francis, accessed June 2, 2026, [https://www.tandfonline.com/doi/pdf/10.1080/21520704.2026.2662222](https://www.tandfonline.com/doi/pdf/10.1080/21520704.2026.2662222)  
9. Placebo-Induced Changes in Excitatory and Inhibitory Corticospinal Circuits during Motor Performance | Journal of Neuroscience, accessed June 2, 2026, [https://www.jneurosci.org/content/34/11/3993](https://www.jneurosci.org/content/34/11/3993)  
10. The effect of motor and cognitive placebos on the serial reaction time task \- PubMed, accessed June 2, 2026, [https://pubmed.ncbi.nlm.nih.gov/33587782/](https://pubmed.ncbi.nlm.nih.gov/33587782/)  
11. Exploring the Challenges and Design Opportunities of Asynchronous AI Interviewers \- arXiv, accessed June 2, 2026, [https://arxiv.org/pdf/2601.02775](https://arxiv.org/pdf/2601.02775)  
12. Compassion apps for better mental health: qualitative review \- PMC, accessed June 2, 2026, [https://pmc.ncbi.nlm.nih.gov/articles/PMC10486246/](https://pmc.ncbi.nlm.nih.gov/articles/PMC10486246/)  
13. OPTIMAL theory's claims about motivation lack evidence in the motor learning literature, accessed June 2, 2026, [https://pubmed.ncbi.nlm.nih.gov/38908415/](https://pubmed.ncbi.nlm.nih.gov/38908415/)  
14. The combination of reporting bias and underpowered study designs has substantially exaggerated the motor learning benefits of self-controlled practice and enhanced expectancies: a meta-analysis | Request PDF \- ResearchGate, accessed June 2, 2026, [https://www.researchgate.net/publication/370924555\_The\_combination\_of\_reporting\_bias\_and\_underpowered\_study\_designs\_has\_substantially\_exaggerated\_the\_motor\_learning\_benefits\_of\_self-controlled\_practice\_and\_enhanced\_expectancies\_a\_meta-analysis](https://www.researchgate.net/publication/370924555_The_combination_of_reporting_bias_and_underpowered_study_designs_has_substantially_exaggerated_the_motor_learning_benefits_of_self-controlled_practice_and_enhanced_expectancies_a_meta-analysis)  
15. Enhanced Expectancies Improve Performance Under Pressure \- PMC \- NIH, accessed June 2, 2026, [https://pmc.ncbi.nlm.nih.gov/articles/PMC3265760/](https://pmc.ncbi.nlm.nih.gov/articles/PMC3265760/)  
16. I made it\! Effects of perceptions of success and enhanced expectancies on motor learning and its underlying mechanisms \- AUETD Home, accessed June 2, 2026, [https://auetd.auburn.edu/handle/10415/8796](https://auetd.auburn.edu/handle/10415/8796)  
17. Easy Task and Choice: Motivational Interventions Facilitate Motor Skill Learning in Children in \- Human Kinetics Journals, accessed June 2, 2026, [https://journals.humankinetics.com/view/journals/jmld/10/1/article-p61.xml](https://journals.humankinetics.com/view/journals/jmld/10/1/article-p61.xml)  
18. The Coach-Athlete Relationship is a Performance Factor, accessed June 2, 2026, [https://www.athleteassessments.com/coach-athlete-relationship-performance-factor/](https://www.athleteassessments.com/coach-athlete-relationship-performance-factor/)  
19. What We Mean by "Learning to Coach Yourself" \- Sparks, accessed June 2, 2026, [https://www.sparks.net/blog/what-we-mean-by-learning-to-coach-yourself](https://www.sparks.net/blog/what-we-mean-by-learning-to-coach-yourself)  
20. Five Keys to Beating Distress and Burnout \- Premier Sport Psychology, accessed June 2, 2026, [https://premiersportpsychology.com/2022/04/09/five-keys-to-beating-distress-and-burnout/](https://premiersportpsychology.com/2022/04/09/five-keys-to-beating-distress-and-burnout/)  
21. Becoming a Self-Regulated Learner: An Overview \- Leiderschapsdomeinen, accessed June 2, 2026, [https://www.leiderschapsdomeinen.nl/wp-content/uploads/2016/12/Zimmerman-B.-2002-Becoming-Self-Regulated-Learner.pdf](https://www.leiderschapsdomeinen.nl/wp-content/uploads/2016/12/Zimmerman-B.-2002-Becoming-Self-Regulated-Learner.pdf)  
22. Self-regulation in sports learning and performance \- Pure, accessed June 2, 2026, [https://pure-oai.bham.ac.uk/ws/files/43378404/Kitsantas\_et\_al\_IN\_PRINT\_2017.pdf](https://pure-oai.bham.ac.uk/ws/files/43378404/Kitsantas_et_al_IN_PRINT_2017.pdf)  
23. Unique Effects of Setting Goals on Behavior Change: Systematic Review and Meta-Analysis \- Ovid, accessed June 2, 2026, [https://www.ovid.com/journals/jccpy/pdf/10.1037/ccp0000260\~unique-effects-of-setting-goals-on-behavior-change](https://www.ovid.com/journals/jccpy/pdf/10.1037/ccp0000260~unique-effects-of-setting-goals-on-behavior-change)  
24. The Hidden Dimension of Personal Competence Self-Regulated Learning and Practice \- ResearchGate, accessed June 2, 2026, [https://www.researchgate.net/profile/Barry\_Zimmerman/publication/232506053\_The\_Hidden\_Dimension\_of\_Personal\_Competence\_Self-Regulated\_Learning\_and\_Practice/links/5699436508ae6169e55177d9/The-Hidden-Dimension-of-Personal-Competence-Self-Regulated-Learning-and-Practice.pdf](https://www.researchgate.net/profile/Barry_Zimmerman/publication/232506053_The_Hidden_Dimension_of_Personal_Competence_Self-Regulated_Learning_and_Practice/links/5699436508ae6169e55177d9/The-Hidden-Dimension-of-Personal-Competence-Self-Regulated-Learning-and-Practice.pdf)  
25. Goal Setting in Sport and Exercise: A Research Synthesis to Resolve the Controversy in, accessed June 2, 2026, [https://journals.humankinetics.com/view/journals/jsep/17/2/article-p117.xml](https://journals.humankinetics.com/view/journals/jsep/17/2/article-p117.xml)  
26. From the Crowd to the Podium \- Goal Setting in Sport and Exercise: A Meta-Analysis. \- Student Exemplar Repository, accessed June 2, 2026, [https://sear.unisq.edu.au/52884/](https://sear.unisq.edu.au/52884/)  
27. The Effect of Self-Controlled and Coach-Controlled Performance Goal Setting on Soccer Passing Skill Learning \- رشد و یادگیری حرکتی ورزشی, accessed June 2, 2026, [https://jsmdl.ut.ac.ir/article\_91528\_f94a5779b48d8dbbbc7142c6ea5db2f3.pdf](https://jsmdl.ut.ac.ir/article_91528_f94a5779b48d8dbbbc7142c6ea5db2f3.pdf)  
28. The Effect of Self-Controlled and Coach-Controlled Performance Goal Setting on Soccer Passing Skill Learning \- ResearchGate, accessed June 2, 2026, [https://www.researchgate.net/profile/Mohammad-Taghi-Aghdasi/publication/377487726\_The\_Effect\_of\_Self-Controlled\_and\_Coach-Controlled\_Performance\_Goal\_Setting\_on\_Soccer\_Passing\_Skill\_Learning\_Application\_of\_Choice\_Theory/links/65a935dcbf5b00662e199615/The-Effect-of-Self-Controlled-and-Coach-Controlled-Performance-Goal-Setting-on-Soccer-Passing-Skill-Learning-Application-of-Choice-Theory.pdf](https://www.researchgate.net/profile/Mohammad-Taghi-Aghdasi/publication/377487726_The_Effect_of_Self-Controlled_and_Coach-Controlled_Performance_Goal_Setting_on_Soccer_Passing_Skill_Learning_Application_of_Choice_Theory/links/65a935dcbf5b00662e199615/The-Effect-of-Self-Controlled-and-Coach-Controlled-Performance-Goal-Setting-on-Soccer-Passing-Skill-Learning-Application-of-Choice-Theory.pdf)  
29. Examining performance changes using multiple goal setting with a focus on the SMART principle \- PMC, accessed June 2, 2026, [https://pmc.ncbi.nlm.nih.gov/articles/PMC12796429/](https://pmc.ncbi.nlm.nih.gov/articles/PMC12796429/)  
30. Self-Controlled Feedback and Behavioral Outcomes in Motor Skill Learning: A Meta-Analysis \- PubMed, accessed June 2, 2026, [https://pubmed.ncbi.nlm.nih.gov/41009321/](https://pubmed.ncbi.nlm.nih.gov/41009321/)  
31. Self-Controlled Feedback and Behavioral Outcomes in Motor Skill Learning: A Meta-Analysis \- MDPI, accessed June 2, 2026, [https://www.mdpi.com/2076-328X/15/9/1291](https://www.mdpi.com/2076-328X/15/9/1291)  
32. Designing for Motivation, Engagement and Wellbeing in Digital Experience \- Frontiers, accessed June 2, 2026, [https://www.frontiersin.org/journals/psychology/articles/10.3389/fpsyg.2018.00797/full](https://www.frontiersin.org/journals/psychology/articles/10.3389/fpsyg.2018.00797/full)  
33. Autonomy support and enhanced expectancy in motor learning: An investigation in older adults \- R Discovery, accessed June 2, 2026, [https://discovery.researcher.life/article/autonomy-support-and-enhanced-expectancy-in-motor-learning-an-investigation-in-older-adults/cee1e76d48c9378c90d27ab9a494db60](https://discovery.researcher.life/article/autonomy-support-and-enhanced-expectancy-in-motor-learning-an-investigation-in-older-adults/cee1e76d48c9378c90d27ab9a494db60)  
34. The OPTIMAL Theory of Motor Learning \- Levitate\!, accessed June 2, 2026, [https://levitatepianoimagery.com/the-optimal-theory-of-motor-learning](https://levitatepianoimagery.com/the-optimal-theory-of-motor-learning)  
35. Ironic Processes of Mental Control \- ResearchGate, accessed June 2, 2026, [https://www.researchgate.net/publication/278911223\_Ironic\_processes\_of\_mental\_control](https://www.researchgate.net/publication/278911223_Ironic_processes_of_mental_control)  
36. Brief Therapy Based on Interrupting Ironic Processes: The Palo Alto Model \- PMC, accessed June 2, 2026, [https://pmc.ncbi.nlm.nih.gov/articles/PMC2789564/](https://pmc.ncbi.nlm.nih.gov/articles/PMC2789564/)  
37. Full article: A systematic review of ironic effects of motor task performance under pressure: The past 25 years \- Taylor & Francis, accessed June 2, 2026, [https://www.tandfonline.com/doi/full/10.1080/1750984X.2023.2193966](https://www.tandfonline.com/doi/full/10.1080/1750984X.2023.2193966)  
38. The Effects of Avoiding Instructions Under Pressure: An Examination of the Volleyball Serving Task \- PMC, accessed June 2, 2026, [https://pmc.ncbi.nlm.nih.gov/articles/PMC8120970/](https://pmc.ncbi.nlm.nih.gov/articles/PMC8120970/)  
39. Optimized but Unowned: How AI-Authored Goals Undermine the Motivation They Are Meant to Drive \- arXiv, accessed June 2, 2026, [https://arxiv.org/html/2605.12344v1](https://arxiv.org/html/2605.12344v1)  
40. Optimized but Unowned: How AI-Authored Goals Undermine the Motivation They Are Meant to Drive \- arXiv, accessed June 2, 2026, [https://arxiv.org/pdf/2605.12344](https://arxiv.org/pdf/2605.12344)  
41. \[2605.12344\] Optimized but Unowned: How AI-Authored Goals Undermine the Motivation They Are Meant to Drive \- arXiv, accessed June 2, 2026, [https://arxiv.org/abs/2605.12344](https://arxiv.org/abs/2605.12344)  
42. Full article: “It's not handcuffing the athlete to success or failure”: Sport psychology practitioners' use of nonspecific goals in applied contexts \- Taylor & Francis, accessed June 2, 2026, [https://www.tandfonline.com/doi/full/10.1080/10413200.2025.2457986](https://www.tandfonline.com/doi/full/10.1080/10413200.2025.2457986)  
43. The impact of Emotion-focused training for emotion couching delivered as mobile app on self-compassion and self-criticism \- Frontiers, accessed June 2, 2026, [https://www.frontiersin.org/journals/psychology/articles/10.3389/fpsyg.2022.1047022/full](https://www.frontiersin.org/journals/psychology/articles/10.3389/fpsyg.2022.1047022/full)  
44. New Research Suggests a Smarter Approach to Goal Setting, accessed June 2, 2026, [https://www.evidencebasedmentoring.org/new-research-suggests-a-smarter-approach-to-goal-setting/](https://www.evidencebasedmentoring.org/new-research-suggests-a-smarter-approach-to-goal-setting/)  
45. Best Personal Development Apps for Your Goals in 2026, accessed June 2, 2026, [https://goalsandprogress.com/best-personal-development-apps-and-resources/](https://goalsandprogress.com/best-personal-development-apps-and-resources/)  
46. Defining open goals for the promotion of health behaviours: a critical conceptual review, accessed June 2, 2026, [https://www.tandfonline.com/doi/abs/10.1080/17437199.2025.2467695](https://www.tandfonline.com/doi/abs/10.1080/17437199.2025.2467695)  
47. “It's not handcuffing the athlete to success or failure”: Sport psychology practitioners' use of nonspecific goals in applied contexts \- Taylor & Francis, accessed June 2, 2026, [https://www.tandfonline.com/doi/abs/10.1080/10413200.2025.2457986](https://www.tandfonline.com/doi/abs/10.1080/10413200.2025.2457986)  
48. Full article: Using Nonspecific Goals in Sport: Guidance for Sport Psychology Practitioners, accessed June 2, 2026, [https://www.tandfonline.com/doi/full/10.1080/21520704.2026.2662222](https://www.tandfonline.com/doi/full/10.1080/21520704.2026.2662222)  
49. Optimizing performance through intrinsic motivation and attention for learning: The OPTIMAL theory of motor learning \- Semantic Scholar, accessed June 2, 2026, [https://www.semanticscholar.org/paper/Optimizing-performance-through-intrinsic-motivation-Wulf-Lewthwaite/1bc9b4acdc80ffcb0ff71a242cbd79975bfa5d68](https://www.semanticscholar.org/paper/Optimizing-performance-through-intrinsic-motivation-Wulf-Lewthwaite/1bc9b4acdc80ffcb0ff71a242cbd79975bfa5d68)  
50. Optimizing performance through intrinsic motivation and attention for learning: The OPTIMAL theory of motor learning \- PubMed, accessed June 2, 2026, [https://pubmed.ncbi.nlm.nih.gov/26833314/](https://pubmed.ncbi.nlm.nih.gov/26833314/)  
51. The combination of reporting bias and underpowered study designs has substantially exaggerated the motor learning benefits of self-controlled practice and enhanced expectancies: a meta-analysis \- Boise State University, accessed June 2, 2026, [https://experts.boisestate.edu/en/publications/the-combination-of-reporting-bias-and-underpowered-study-designs-/](https://experts.boisestate.edu/en/publications/the-combination-of-reporting-bias-and-underpowered-study-designs-/)  
52. (PDF) Low prevalence of a priori power analyses in motor behavior research, accessed June 2, 2026, [https://www.researchgate.net/publication/361956978\_Low\_prevalence\_of\_a\_priori\_power\_analyses\_in\_motor\_behavior\_research](https://www.researchgate.net/publication/361956978_Low_prevalence_of_a_priori_power_analyses_in_motor_behavior_research)  
53. Assessing the Evidential Value of Mental Fatigue and Exercise Research \- PMC \- NIH, accessed June 2, 2026, [https://pmc.ncbi.nlm.nih.gov/articles/PMC10687172/](https://pmc.ncbi.nlm.nih.gov/articles/PMC10687172/)  
54. Meta-Analytic Findings of the Self-Controlled Motor Learning Literature: Underpowered, Biased, and Lacking Evidential Value \- LnuOpen, accessed June 2, 2026, [https://open.lnu.se/index.php/metapsychology/article/view/2803](https://open.lnu.se/index.php/metapsychology/article/view/2803)  
55. Meta-Analytic Findings in the Self-Controlled Motor Learning Literature: Underpowered, Biased, and Lacking Evidential Value \- OSF, accessed June 2, 2026, [https://osf.io/preprints/psyarxiv/8d3nb\_v1](https://osf.io/preprints/psyarxiv/8d3nb_v1)  
56. Holistic Analysis on User Engagement Challenges in Mobile Mental Health \- AWS, accessed June 2, 2026, [https://astlyi.s3.ap-northeast-2.amazonaws.com/2025/2025\_CHI\_TAPS.pdf](https://astlyi.s3.ap-northeast-2.amazonaws.com/2025/2025_CHI_TAPS.pdf)  
57. Embodied Conversational Agents in Clinical Psychology: A Scoping Review, accessed June 2, 2026, [https://www.jmir.org/2017/5/e151/citations](https://www.jmir.org/2017/5/e151/citations)  
58. ROOM to Grow, a Mobile Well-Being Intervention for University Students: Overview of the Design Process and Outcomes \- JMIR Formative Research, accessed June 2, 2026, [https://formative.jmir.org/2025/1/e63325](https://formative.jmir.org/2025/1/e63325)  
59. Positive feedback enhances motivation and skill learning in adolescents, accessed June 2, 2026, [https://optimalmotorlearning.org/wp-content/uploads/2024/02/Martinez\_pos\_feedback\_motivation\_learning\_LM\_2024.pdf](https://optimalmotorlearning.org/wp-content/uploads/2024/02/Martinez_pos_feedback_motivation_learning_LM_2024.pdf)  
60. Leadership in Athletics: Expectancy Theory | Lead Read Today \- Fisher College of Business, accessed June 2, 2026, [https://fisher.osu.edu/blogs/leadreadtoday/blog/leadership-in-athletics-expectancy-theory](https://fisher.osu.edu/blogs/leadreadtoday/blog/leadership-in-athletics-expectancy-theory)  
61. The Framing Effect in Sports: Unveiling How Presentation Shapes Performance Choices, accessed June 2, 2026, [https://www.drpaulmccarthy.com/post/the-framing-effect-in-sports-unveiling-how-presentation-shapes-performance-choices](https://www.drpaulmccarthy.com/post/the-framing-effect-in-sports-unveiling-how-presentation-shapes-performance-choices)  
62. Enhanced expectancies improve movement efficiency in runners | Request PDF \- ResearchGate, accessed June 2, 2026, [https://www.researchgate.net/publication/221968503\_Enhanced\_expectancies\_improve\_movement\_efficiency\_in\_runners](https://www.researchgate.net/publication/221968503_Enhanced_expectancies_improve_movement_efficiency_in_runners)  
63. A Longitudinal Goal Setting Model for Addressing Complex Personal Problems in Mental Health \- PMC, accessed June 2, 2026, [https://pmc.ncbi.nlm.nih.gov/articles/PMC11210183/](https://pmc.ncbi.nlm.nih.gov/articles/PMC11210183/)  
64. What Does Success Look Like? Catalyzing Meeting Intentionality with AI-Assisted Prospective Reflection \- Microsoft, accessed June 2, 2026, [https://www.microsoft.com/en-us/research/wp-content/uploads/2025/05/2025\_CHIWORK\_MPA\_\_What-Does-Success-Look-Like-FinalPrePrint.pdf](https://www.microsoft.com/en-us/research/wp-content/uploads/2025/05/2025_CHIWORK_MPA__What-Does-Success-Look-Like-FinalPrePrint.pdf)  
65. Practitioners' Insights on Integrating Goal Setting Tools in Personal Informatics, accessed June 2, 2026, [https://www.scienceopen.com/hosted-document?doi=10.14236/ewic/BCSHCI2025.63](https://www.scienceopen.com/hosted-document?doi=10.14236/ewic/BCSHCI2025.63)  
66. 8 Techniques Sports Psychologists Use to Transform Self-Doubt, accessed June 2, 2026, [https://drmichellecleere.com/blog/sports-psychologist-techniques/](https://drmichellecleere.com/blog/sports-psychologist-techniques/)  
67. Developing a Mental Game Plan: Mental Periodization for Achieving a “Flow” State for the Track and Field Throws Athlete \- The Sport Journal, accessed June 2, 2026, [https://thesportjournal.org/article/developing-a-mental-game-plan-mental-periodization-for-achieving-a-flow-state-for-the-track-and-field-throws-athlete/](https://thesportjournal.org/article/developing-a-mental-game-plan-mental-periodization-for-achieving-a-flow-state-for-the-track-and-field-throws-athlete/)  
68. Emotion-Focused Mobile App for Promoting Self-Compassion, Self-Protection, and Self-Criticism \- PMC, accessed June 2, 2026, [https://pmc.ncbi.nlm.nih.gov/articles/PMC9658678/](https://pmc.ncbi.nlm.nih.gov/articles/PMC9658678/)  
69. A Qualitative Study Exploring the Impact the Self-Compassion App Has on Levels of Compassion, Self-Criticism, and Wellbeing \- lidsen, accessed June 2, 2026, [https://www.lidsen.com/journals/icm/icm-07-03-045](https://www.lidsen.com/journals/icm/icm-07-03-045)  
70. Motor skill learning and summer sports \- drowningintheshallow, accessed June 2, 2026, [https://drowningintheshallow.wordpress.com/2015/05/04/motor-skill-learning-research-and-summer-sports/](https://drowningintheshallow.wordpress.com/2015/05/04/motor-skill-learning-research-and-summer-sports/)  
71. Goal setting and strategies to enhance goal pursuit in adult rehabilitation: summary of a Cochrane systematic review and meta-analysis \- PubMed, accessed June 2, 2026, [https://pubmed.ncbi.nlm.nih.gov/26771917/](https://pubmed.ncbi.nlm.nih.gov/26771917/)  
72. (PDF) "I Don't Know Why I Should Use This App": Holistic Analysis on User Engagement Challenges in Mobile Mental Health \- ResearchGate, accessed June 2, 2026, [https://www.researchgate.net/publication/391240035\_I\_Don't\_Know\_Why\_I\_Should\_Use\_This\_App\_Holistic\_Analysis\_on\_User\_Engagement\_Challenges\_in\_Mobile\_Mental\_Health](https://www.researchgate.net/publication/391240035_I_Don't_Know_Why_I_Should_Use_This_App_Holistic_Analysis_on_User_Engagement_Challenges_in_Mobile_Mental_Health)

[image1]: # "inline base64 effect-size/sample-size symbol stripped to avoid storing a binary blob"

[image2]: # "inline base64 effect-size/sample-size symbol stripped to avoid storing a binary blob"

[image3]: # "inline base64 effect-size/sample-size symbol stripped to avoid storing a binary blob"

[image4]: # "inline base64 effect-size/sample-size symbol stripped to avoid storing a binary blob"

[image5]: # "inline base64 effect-size/sample-size symbol stripped to avoid storing a binary blob"

[image6]: # "inline base64 effect-size/sample-size symbol stripped to avoid storing a binary blob"

[image7]: # "inline base64 effect-size/sample-size symbol stripped to avoid storing a binary blob"

[image8]: # "inline base64 effect-size/sample-size symbol stripped to avoid storing a binary blob"

[image9]: # "inline base64 effect-size/sample-size symbol stripped to avoid storing a binary blob"

[image10]: # "inline base64 effect-size/sample-size symbol stripped to avoid storing a binary blob"

[image11]: # "inline base64 effect-size/sample-size symbol stripped to avoid storing a binary blob"

[image12]: # "inline base64 effect-size/sample-size symbol stripped to avoid storing a binary blob"

[image13]: # "inline base64 effect-size/sample-size symbol stripped to avoid storing a binary blob"

[image14]: # "inline base64 effect-size/sample-size symbol stripped to avoid storing a binary blob"
