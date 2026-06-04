---
id: brief-response-subjective-skill-confidence-validity-vendor-3-2026-06-02
title: "Vendor response: subjective skill-confidence validity (vendor 3, 2026-06-02)"
status: verbatim
stage: validation
type: brief-response
authority: "Verbatim record of vendor 3's response to the 2026-05-27 subjective-skill-confidence-validity brief; raw, not curated canon. The decision-relevant distillation lives in `docs/research/subjective-skill-confidence-validity.md`."
summary: "Most skeptical of the three vendors. Concludes a weekly single-item self-rated skill-confidence reading carries weak and confounded construct validity as a longitudinal skill-development proxy and should NOT be the primary user-facing skill-progress signal (stated confidence: moderate-to-high for the negative claim, moderate for the positive design recommendations). Diagnoses a construct mismatch: the weekly item is a state measure dominated by recency / last-session outcome, mood, and fatigue/soreness, whose week-to-week swings are large relative to small, often perceptually sub-threshold true skill change at 1-3 sessions/week. Names two directional biases hitting the 2-5-year target squarely: beginner's-bubble / intermediate OVER-estimation (Sanchez & Dunning 2018) and plateau-blindness UNDER-detection of slow implicit gains. Recommends a behavioral proxy (practice volume / weakest-skill drill volume / any feasible objective outcome) as the headline progress metric, with confidence demoted to a secondary explicitly-framed reflection trace shown beside the behavioral trace so divergence becomes coachable. If a confidence item is used, prefers a single skill-specific state-framed 5-point or 11-point Likert (not VAS, not a retrospective change-anchor). Cites Duolingo's repeated removal of subjective progress proxies and HCI abandonment research."
last_updated: 2026-06-02
responds_to: docs/research/briefs/2026-05-27-brief-subjective-skill-confidence-validity.md
distilled_in: docs/research/subjective-skill-confidence-validity.md
depends_on:
  - docs/research/briefs/README.md
  - docs/research/subjective-skill-confidence-validity.md
---

# Vendor response: subjective skill-confidence validity (vendor 3, 2026-06-02)

## Provenance and handling

- **Vendor:** vendor 3 (identifier preserved for the reconciliation pass; redact before any external share).
- **Received:** 2026-06-02 (brief authored 2026-05-27).
- **Responds to:** [`docs/research/briefs/2026-05-27-brief-subjective-skill-confidence-validity.md`](../2026-05-27-brief-subjective-skill-confidence-validity.md) — the subjective-skill-confidence-validity brief listed in [`docs/research/briefs/README.md`](../README.md).
- **Status:** `verbatim`. This file is the raw deliverable as received. No base64 image data URIs or `citeturn` tokens were present in this response; prose is unaltered. Corrections and commentary live in the distillation note linked below.
- **Distilled in:** [`docs/research/subjective-skill-confidence-validity.md`](../../subjective-skill-confidence-validity.md) — use that note for repo-facing conclusions, cross-links, and decision implications.
- **Convention:** revision-by-replacement per `docs/research/briefs/README.md`. If vendor 3 submits a revised response, it ships as a new `-vendor-3-revised-<date>.md` file; this file is not edited in place.

## Verbatim response

# Weekly Self-Rated Skill Confidence as a Longitudinal Skill-Development Proxy: A Construct-Validity Memo for Self-Coaching Skill-Sport Apps

## EXECUTIVE SUMMARY

**Bottom line:** A weekly single-item self-rated *skill confidence* reading carries **weak and confounded construct validity** as a longitudinal proxy for actual skill development in adult recreational skill-sport athletes (2–5 years' experience, 1–3 sessions/week, self-coached, non-competitive, non-clinical). It should **not** be shipped as the *primary* user-facing skill-progress signal. Stated confidence in this recommendation: **moderate-to-high** for the negative claim (the confounding evidence is robust and converges across five independent literatures), and **moderate** for the positive design recommendations (because there is a near-total absence of studies on this exact population, cadence, and self-administration mode — most evidence requires explicit, flagged extrapolation).

The core problem is a **construct mismatch**. A weekly "how confident do you feel" item measures a *state* dominated by recency, mood, fatigue/soreness, and last-session outcome — confounds whose week-to-week swings are large relative to the small, often perceptually sub-threshold true skill change available at 1–3 sessions/week. Meanwhile, two systematic, *directional* biases attack exactly the target population: the **beginner's-bubble / intermediate-overconfidence** pattern (Sanchez & Dunning, 2018), and **plateau-blindness**, in which real motor improvement is a slow, largely *implicit* between-session refinement that the performer does not consciously notice.

**Strongest alternative:** behavioral proxies — primarily **session count / practice-time tracking**, with **weakest-skill drill volume** and any feasible objective outcome (serve-in %, climbing grade sent) as secondary signals — are lower-friction, mood-immune, harder to confound, and have a defensible (if modest) evidentiary link to skill change. The recommended architecture is **a behavioral signal as the headline progress metric, with subjective confidence demoted to a secondary, explicitly-framed "how you're feeling about skill X" reflection trace** — never labeled "progress," and shown beside the behavioral trace so that divergence (high practice, flat confidence) becomes a coachable feature rather than a contradiction.

---

## RECOMMENDED SCALE FORMAT AND ITEM WORDING

If a subjective confidence item is included at all — as a *secondary* reflection signal, not the progress headline — the evidence supports:

**Format:** A single-item **0–10 numeric rating (11-point)** *or* **5-point Likert**, **not** a VAS, and **not** a retrospective change-anchored item.
- VAS and Likert have comparable reliability — Celenza & Rogers (2011) report test–retest ICC ≈ .51–.54 for VAS vs .58 for the Likert-type scale, Cronbach's α .79–.91 (VAS) vs .79–.81 (Likert), and a VAS–Likert correlation of r ≈ .89 — but VAS adds on-phone friction with no reliability gain, and respondents prefer and find Likert easiest to complete (van Laerhoven et al., 2004).
- **Avoid the "more / same / less confident than last week" descriptive-change anchor** despite its intuitive appeal: retrospective change ratings systematically *overestimate* improvement and are contaminated by recall bias and a "present-state effect." In a 550-patient trauma study, retrospective change was significantly larger than prospectively-computed change and the two agreed only fairly (ICC ≈ .48–.49). A change-anchored item *manufactures* a progress narrative rather than measuring one.

**Recommended exact item text (skill-specific, state-framed, low-stakes):**
> *"Thinking about your [topspin backhand] this week, how confident do you feel that you can execute it the way you want? (0 = not at all, 10 = completely)"*

**Why skill-specific, not global:** Concordance — matching the specificity of the belief measure to the specific skill and outcome — is the single most important moderator of the self-efficacy/performance relationship (Moritz, Feltz, Fahrbach & Mack, 2000). A global "how confident are you in your overall game right now" item is the **weakest** framing: most trait-contaminated, most mood-reactive, least diagnostic.

---

## EVIDENCE SUMMARY PER SUB-QUESTION

### 1. State vs trait confidence — which does a weekly single-item self-report measure?

A weekly "how confident do you feel this week" item is a **state** measure. The foundational distinction is Vealey's (1986) interactional model, validated across **666 high-school, college, and adult athletes**, splitting sport-confidence into the Trait Sport-Confidence Inventory (TSCI) and State Sport-Confidence Inventory (SSCI) — each **13 items on a 9-point scale**, with strong internal consistency (SSCI Cronbach's α = .95; TSCI α = .93). These are **multi-item, competition-oriented, sub-elite/elite** instruments; their psychometrics do **not** transfer to a single weekly item in a recreational app. A counterintuitive flag: in Vealey's own validation, **state sport-confidence did not correlate significantly with performance in a sample of 48 elite gymnasts** — even the gold-standard state instrument failed to track performance in its developer's hands. For *single-item* state confidence in adult self-coached recreational skill-sport athletes there is **no published test-retest or convergent-validity study at all** — the reliability picture must be inferred from adjacent single-item literatures (§2). That absence is itself a primary finding.

### 2. Scale-format evidence under repeated weekly self-administration

No head-to-head reliability study exists for *weekly confidence* across 5/7/11-point Likert, VAS, and change-anchor in this population. Transferable evidence:
- **Single-item reliability is estimable and often "good enough":** Wanous, Reichers & Hudy (1997), meta-analyzing **28 correlations / 17 studies / 7,682 people**, found single-item overall job satisfaction correlated r = .63 uncorrected (.67 corrected) with multi-item scales; estimated minimum single-item reliability .45–.69. Wanous & Reichers (1996) place a realistic conservative single-item reliability floor at ≈ .70.
- **Repeated single-item test–retest is highly variable:** Fisher et al. (2016), 18 single-item measures in **302 organizational workers**, one-month r = .46–.78, three-month r = .35–.77 — strongly item-dependent.
- **VAS vs Likert:** comparable, slight edge to Likert (Celenza & Rogers, 2011, above).
- **State self-efficacy scales:** the 6-item ESES-S showed only *moderate* test–retest (ICC = 0.59, **n = 84** rheumatoid-arthritis patients with stable health), implying a single-item state-confidence item will sit at the lower end.

**Net:** A single 5-point or 11-point Likert is defensible on reliability grounds (~.5–.7), comparable to VAS, and superior to a change-anchor on validity.

### 3. Known confounds and their relative size

The dominant confounds on a weekly state-confidence item — **last-session outcome, mood, and fatigue/soreness** — are large relative to plausible weekly true skill change at 1–3 sessions/week:
- **Last-session outcome dominates.** Gagnon-Dolbec, McKelvie & Eastwood (2019, *Current Psychology* 38:1622–1633), **50 male lacrosse players**: "Over trials, self-reported confidence increased with positive (winning) feedback and decreased with negative (losing) feedback, but lacrosse performance remained stable… These results are inconsistent with the claim that confidence influences performance." Confidence tracked the *outcome*, not the *skill*.
- **Fatigue/soreness produce large state swings.** Thorpe et al. (2016, English Premier League soccer) found post-match mornings registered **35–40% worse** self-rated fatigue, sleep quality, and soreness than pre-match mornings; a systematic review of single-item team-sport wellbeing measures confirms such single items are sensitive to these state changes.
- **Mood/recency bias.** Retrospective self-reports are systematically distorted by peak-end and recency weighting (ecological momentary assessment literature).

By contrast, **true weekly skill change is small**: motor skill consolidates as a slow between-session reduction in movement variability accruing over roughly 5–10 spaced sessions (Karni et al., 1998, PNAS). So in any given week, confound-driven variance plausibly **swamps** true-signal variance, and **last-session outcome is the single most dominant confound** at this cadence.

### 4. Novice overestimation and plateau-blindness — direction and symmetry

Two **directional** biases hit the 2–5-year intermediate squarely:
- **Beginner's bubble / intermediate overconfidence (directional: OVER-estimation).** Sanchez & Dunning (2018, *Journal of Personality and Social Psychology* 114(1):10–28), across **6 studies**, found beginners "rapidly surged to a 'beginner's bubble' of overconfidence… traced to exuberant and error-filled theorizing… formed after just a few learning experiences," with the companion finding that "confidence grows much faster than knowledge… with the largest confidence gaps appearing at intermediate knowledge levels." The 2–5-year recreational player sits in exactly this danger zone. Classic Kruger & Dunning (1999, *JPSP* 77(6):1121–1134): bottom-quartile performers (actual ≈ 12th percentile) rated themselves near the 62nd.
- **Plateau-blindness (directional: UNDER-detection of real gains).** Intermediate improvement is slow and largely *implicit*: sensorimotor-learning work shows implicit adaptation "involves the fine-tuning of movement kinematics to gradually and unconsciously counteract sensory prediction errors," with these kinematic changes remaining robust even when participants are not consciously aware of them (Tsay et al., 2024, *eLife*; Taylor et al., 2014). Genuine but sub-perceptual-threshold gains therefore will **not** register in a weekly confidence reading — the player feels "stuck" while improving.
- **Net effect (asymmetric, not canceling):** transition phases over-read (bubble); steady-state intermediates under-read true slow gains (plateau-blindness). Neither is documented in *self-coached recreational skill-sport* samples specifically — flagged as extrapolation.

### 5. Framings that hold up vs collapse

- **"Confidence in skill X" (state, skill-specific):** moderate validity if skill-specific (concordance, Moritz et al. 2000) — the most defensible framing.
- **"Improvement in skill X since last week" (retrospective change):** **collapses** — overestimates improvement; recall + present-state bias; only fair agreement with computed change (ICC ≈ .48).
- **"How today's session changed your confidence" (session-end momentary):** maximally recency/outcome-confounded; usable as in-the-moment reflection, invalid as a skill-progress signal.
- **"How confident in your overall game right now" (global/trait-ish):** weakest — least concordant, most mood-reactive.

### 6. Comparison to behavioral proxies

Behavioral proxies have **comparable-or-better** construct validity and far lower friction:
- **Practice volume.** Macnamara, Moreau & Hambrick (2016, *Perspectives on Psychological Science* 11(3):333–350): "deliberate practice accounted for 18% of the variance in sports performance. However… deliberate practice accounted for only 1% of the variance in performance among elite-level performers." In music, accumulated deliberate practice correlates r ≈ .48 (95% CI .38–.56). A *modest* predictor — but objective and non-confoundable by mood.
- **Self-efficacy/performance** is r ≈ .38 (Moritz et al. 2000, **45 studies / 102 correlations**) — comparable magnitude, but that is *concordant self-efficacy*, not a generic weekly confidence feeling, and the recency/directionality problems above degrade the weekly version.
- **Self-evaluation of ability vs performance** is only r ≈ .29 (Mabe & West 1982, **55 studies**, SD = .25), with measurement conditions explaining most variance (R = .64) — self-rating validity is highly design-dependent.
- **HCI evidence favors behavioral signals on stickiness:** Epstein, Ping, Fogarty & Munson (2015, *UbiComp '15*) report that effortful self-report is abandoned fastest ("18% of past trackers used their tool for less than one week"), whereas a low-effort behavioral signal endures ("75% of current location trackers report using their tools for at least a year").

**Do they correlate or diverge?** They capture *different* things: behavioral proxies measure *input/effort*; confidence measures *felt state*. They will diverge precisely during plateaus (high practice, flat confidence) — exactly when an honest progress signal matters most. **Verdict: behavioral proxy as primary; show both side-by-side so divergence becomes a coachable feature.**

### 7. Practitioner intuition and shipped-app evidence — see dedicated section below.

---

## KNOWN FAILURE-MODES

| Failure mode | Population / cadence | Direction | Supported mitigation |
|---|---|---|---|
| Last-session-outcome contamination | All; weekly | Tracks outcome, not skill | Skill-specific item; decouple from win/loss |
| Fatigue/soreness state confound | All; post-session weeks | Depresses rating | Collect separate fatigue item; annotate/covary |
| Mood / recency / peak-end bias | All | Either | Fixed weekly cadence (not session-end); show trend, not point |
| Beginner's bubble / intermediate overconfidence | 2–5-yr intermediates (target) | **Over**-estimation | Calibration prompts; pair with objective drill outcome |
| Plateau-blindness | Steady-state intermediates | **Under**-detection of real gains | Surface behavioral progress to counter "I'm stuck" |
| Retrospective-change inflation | Any change-anchored item | **Over**-estimation of improvement | State framing; compute change server-side |

**Subpopulation suppression:** consider suppressing or re-framing the confidence headline for users in rapid early progression (bubble risk) and for users on long flat behavioral plateaus (plateau-blindness risk). No published evidence establishes gender/age/sport-specific bias magnitudes at this exact population — flagged as a gap.

---

## COMPARISON TO BEHAVIORAL PROXIES — RECOMMENDATION

**Ship a behavioral proxy as the primary skill-progress signal.** The strongest single proxy is **practice volume (session count × estimated quality)**, with **weakest-skill drill volume** as a secondary diagnostic and any feasible **objective outcome** (serve-in %, grade sent, drill-completion accuracy) preferred over volume where available. Rationale:
1. Objective, mood-immune, near-zero added friction (often auto-logged).
2. Modest but real construct link to skill (18% of performance variance; r ≈ .48 in music).
3. Stickier than self-report (Epstein et al. 2015).
4. *Honest during plateaus* — it shows "you did the work" even when felt confidence is flat, directly counteracting plateau-blindness.

Limitation: practice volume measures *input*, not *attainment*, and loses predictive power at high skill (1% at elite). For recreational 2–5-year players this ceiling is not yet binding, so the proxy remains usable.

---

## PRACTITIONER INTUITION *(clearly separated from peer-reviewed evidence)*

This section is design/practitioner intuition and trade-press, **not** peer-reviewed evidence, except where a peer-reviewed source is explicitly named:

- **Athlete-monitoring practitioners** widely use single-item daily wellness Likerts (fatigue, soreness, mood, sleep) and treat them as *readiness/awareness* tools interpreted against an individual baseline (e.g., flag a drop > 1.5 SD), **not** as progress scores — and warn that buy-in collapses if questionnaires "land on deaf ears" (SimpliFaster practitioner writing).
- **Music-practice app Modacity KEPT a self-rated 1–5 "mastery" star**, and its founder advocates rating mastery every session — but Modacity's own teacher guidance concedes the rating is **ambiguous**: "Do you want to rate quality of effort? Current mastery? Subjective impression of the session? Be consistent." This *supports* the memo's skepticism: a self-rating works only with a fixed rubric. Reviewers additionally lean on *recordings* (objective) to verify progress.
- **Music apps generally favor objective AI scoring** — Tonara, Trala, and Yousician grade pitch/rhythm via signal processing rather than self-rated confidence. I found **no documented case of a music app shipping then abandoning a self-rated mastery feature.**
- **Duolingo** has **repeatedly removed subjective/self-referential progress proxies** — the "fluency %" (criticized in third-party commentary as "misleading… based on Duolingo practice rather than actual skill"), then skill-strength bars ("strength is not shown on Duolingo"), then crowns — converging on an **objective, CEFR-aligned Duolingo Score** explicitly intended to replace "vague statements" about self-perceived level (Duocon 2025). *(Sources: third-party blogs and community wikis; primary company forum posts are archived but not directly quoted — sourcing caveat.)* No evidence Duolingo ever shipped a literal user self-rated confidence slider.
- **Mood-tracking research (peer-reviewed):** Schueller, Neary, Lai & Epstein (2021, *JMIR Mental Health* 8(8):e29368, **22 interviewees**) found users **selectively avoid logging negative moods** — biasing the trace — and that mood tracking serves **self-awareness, not progress scoring**. Daylio (company framing) presents mood as a **correlational input**, not a progress headline.
- **Personal-informatics theory (peer-reviewed):** Epstein et al. (2016, *CHI*, survey **n = 193**, 12 interviews) catalog why people abandon self-tracking — manual-entry "hassle" and, critically, **discouragement when the metric shows lack of progress** ("felt discouraged with my lack of progress") — both acute risks for a weekly confidence readout that goes flat during a plateau. Their conclusion: "Abandonment is… not always indicative of failure… but could rather be a sign of diminishing returns or a redefinition of goals."

The practitioner/design consensus thus **converges with the peer-reviewed evidence**: subjective self-ratings are awareness tools that require fixed rubrics; mature self-coaching products tend to anchor *progress* on objective/behavioral signals.

---

## GAPS

1. **No study measures a single-item weekly skill-confidence item in adult, self-coached, recreational skill-sport athletes (2–5 yr, 1–3 sessions/wk, non-competitive, non-clinical).** Every quantitative claim here is extrapolated from competitive/elite sport-confidence, organizational single-item, clinical self-efficacy, motor-learning, or HCI literatures.
2. **No effect-size decomposition** of confound variance vs true-skill variance in weekly confidence at this cadence.
3. **No documented case** of a consumer app shipping then killing a literal self-rated *skill confidence* feature — the design argument is by analogy.
4. **No published gender/age/sport-specific bias magnitudes** at the target population.

**Studies needed:** (a) a 12–16-week longitudinal study of 2–5-year recreational players logging weekly single-item skill confidence *and* an objective skill criterion (serve-in %, grade sent) *and* mood/fatigue covariates, computing within-person confidence–skill coupling and confound partial-correlations; (b) a format RCT (5-pt vs 11-pt vs VAS vs change-anchor) for weekly test–retest ICC; (c) an in-app A/B test of behavioral-primary vs confidence-primary progress readouts on retention and calibration.

---

## FULL CITATION LIST

- Vealey, R. S. (1986). Conceptualization of sport-confidence and competitive orientation. *Journal of Sport Psychology, 8*(3), 221–246. https://journals.humankinetics.com/view/journals/jsep/8/3/article-p221.xml
- Moritz, S. E., Feltz, D. L., Fahrbach, K. R., & Mack, D. E. (2000). The relation of self-efficacy measures to sport performance: A meta-analytic review. *Research Quarterly for Exercise and Sport, 71*(3), 280–294. https://doi.org/10.1080/02701367.2000.10608908
- Mabe, P. A., & West, S. G. (1982). Validity of self-evaluation of ability: A review and meta-analysis. *Journal of Applied Psychology, 67*(3), 280–296. https://doi.org/10.1037/0021-9010.67.3.280
- Wanous, J. P., Reichers, A. E., & Hudy, M. J. (1997). Overall job satisfaction: How good are single-item measures? *Journal of Applied Psychology, 82*(2), 247–252. https://doi.org/10.1037/0021-9010.82.2.247
- Wanous, J. P., & Reichers, A. E. (1996). Estimating the reliability of a single-item measure. *Psychological Reports, 78*(2), 631–634. https://doi.org/10.2466/pr0.1996.78.2.631
- Sanchez, C., & Dunning, D. (2018). Overconfidence among beginners: Is a little learning a dangerous thing? *Journal of Personality and Social Psychology, 114*(1), 10–28. https://doi.org/10.1037/pspa0000102
- Kruger, J., & Dunning, D. (1999). Unskilled and unaware of it. *Journal of Personality and Social Psychology, 77*(6), 1121–1134. https://doi.org/10.1037/0022-3514.77.6.1121
- Gagnon-Dolbec, A., McKelvie, S. J., & Eastwood, J. (2019). Sport confidence and performance in lacrosse. *Current Psychology, 38*, 1622–1633. https://doi.org/10.1007/s12144-017-9719-0
- Macnamara, B. N., Moreau, D., & Hambrick, D. Z. (2016). The relationship between deliberate practice and performance in sports: A meta-analysis. *Perspectives on Psychological Science, 11*(3), 333–350. https://doi.org/10.1177/1745691616635591
- Karni, A., et al. (1998). The acquisition of skilled motor performance: Fast and slow experience-driven changes in primary motor cortex. *PNAS, 95*(3), 861–868. https://doi.org/10.1073/pnas.95.3.861
- Tsay, J. S., et al. (2024). Fundamental processes in sensorimotor learning. *eLife.* (Implicit-adaptation account; see also Taylor, Krakauer & Ivry, 2014, *Journal of Neuroscience*.)
- Celenza, A., & Rogers, I. R. (2011). Comparison of visual analogue and Likert scales. *Emergency Medicine Australasia, 23*(1). https://pubmed.ncbi.nlm.nih.gov/21284816/
- van Laerhoven, H., et al. (2004). A comparison of Likert scale and VAS as response options in children's questionnaires. https://pubmed.ncbi.nlm.nih.gov/15244235/
- Nordin et al. (2016). The Swedish Exercise Self-Efficacy Scale (ESES-S). https://www.ncbi.nlm.nih.gov/pmc/articles/PMC4720053/
- Thorpe, R. T., et al. (2016). Tracking morning fatigue status across in-season training weeks in elite soccer players. *International Journal of Sports Physiology and Performance, 11*(7), 947–952.
- Govus / Saw et al. — Single-item self-report measures of team-sport athlete wellbeing and their relationship with training load: a systematic review. https://pmc.ncbi.nlm.nih.gov/articles/PMC7534939/
- Epstein, D. A., Ping, A., Fogarty, J., & Munson, S. A. (2015). A lived informatics model of personal informatics. *UbiComp '15*, 731–742. https://doi.org/10.1145/2750858.2804250
- Epstein, D. A., et al. (2016). Beyond abandonment to next steps. *CHI '16*, 1–10. https://doi.org/10.1145/2858036.2858045
- Schueller, S. M., Neary, M., Lai, J., & Epstein, D. A. (2021). Understanding people's use of and perspectives on mood-tracking apps: Interview study. *JMIR Mental Health, 8*(8), e29368. https://mental.jmir.org/2021/8/e29368
- Modacity blog, "Why It's Incredibly Important to Rate Your Mastery." https://www.modacity.co/blog/why-its-important-to-rate-mastery/

*Note on scope: this memo is scoped to weekly, self-administered, non-competitive, non-clinical use by adult recreational skill-sport athletes with 2–5 years' experience training 1–3 sessions/week. Wherever target-population data did not exist (the majority of cases), the source population is named and the extrapolation flagged explicitly in-text.*