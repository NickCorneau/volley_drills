---
id: brief-response-single-tracked-metric-vendor-3-2026-06-02
title: "Vendor response: single self-tracked metric (vendor 3, 2026-06-02)"
status: verbatim
stage: validation
type: brief-response
authority: "Verbatim record of vendor 3's response to the 2026-05-27 'Single self-tracked metric most predictive of adherence and improvement in amateur skill-sport athletes' brief. Raw vendor output as received; not curated canon. The decision-relevant distillation lives in `docs/research/single-tracked-metric-amateur-skill-apps.md`."
summary: "Vendor 3 reaches the same no-single-metric conclusion but diverges on the skill side: it argues against weekly subjective confidence (Dunning-Kruger divergence, possibly NEGATIVE for improvement) and recommends a structured-practice-quality metric (single-task perceived effort on a deliberate block, or weakest-skill targeted-contact count) as the only candidate family with a defensible improvement claim at this dose. Recommended pair: 'sessions vs plan' + 'focused practice on your priority skill'. Most anti-confidence / pro-practice-quality of the three vendors; richest on noise floors and forgiveness mechanics."
last_updated: 2026-06-02
responds_to: docs/research/briefs/2026-05-27-brief-single-tracked-metric-amateur-skill-apps.md
distilled_in: docs/research/single-tracked-metric-amateur-skill-apps.md
depends_on:
  - docs/research/briefs/README.md
  - docs/research/single-tracked-metric-amateur-skill-apps.md
---

# Vendor response: single self-tracked metric (vendor 3, 2026-06-02)

## Provenance and handling

- **Vendor:** vendor 3 (identifier preserved for the reconciliation pass; redact before any external share).
- **Received:** 2026-06-02 (responds to a brief authored 2026-05-27).
- **Responds to:** [`docs/research/briefs/2026-05-27-brief-single-tracked-metric-amateur-skill-apps.md`](../2026-05-27-brief-single-tracked-metric-amateur-skill-apps.md) — the single-tracked-metric brief listed in [`docs/research/briefs/README.md`](../README.md).
- **Status:** `verbatim`. This file is the raw deliverable as received. Do not edit content; corrections and commentary live in the distillation note linked below.
- **Distilled in:** [`docs/research/single-tracked-metric-amateur-skill-apps.md`](../../single-tracked-metric-amateur-skill-apps.md) — use that note for repo-facing conclusions, cross-links, and decision implications.
- **Convention:** revision-by-replacement per `docs/research/briefs/README.md`. If vendor 3 submits a revised response, it ships as a new `-vendor-3-revised-<date>.md` file; this file is not edited in place.

## Verbatim response

# Weekly Readout Metric Selection for a Self-Coached Skill-Sport Training App: A Ranked Evidence Memo

## Executive Summary

**Bottom line:** No single self-tracked metric honestly carries BOTH adherence and objective skill-improvement signal at the target dose (adult, self-coached, 2–5 years' experience, 1–3 sessions/week in skill-sports). The evidence forces a **two-number paired readout**: a behavioral-consistency metric to carry adherence, and a structured-practice-quality metric to carry improvement. A single number will over-claim on whichever axis it does not actually measure.

The deeper, decision-shaping finding: the metric that ranks #1 for adherence (planned-vs-completed session ratio, framed as consistency) is NOT the metric that best co-predicts objective skill improvement (focused/deliberate-practice quality, not raw volume). These are different constructs with different and weakly-correlated evidence bases, so a single-metric readout is not defensible. This is the answer the team asked the memo to test for explicitly — and it lands on the "two-metric pair is required" side.

**Top 3 ranked candidates:**

1. **Planned-vs-completed session ratio (a "consistency" framing of session count)** — *Confidence: Moderate-High for adherence; Low for improvement.* Behavioral self-monitoring + goal-attainment is the most robust, best-replicated predictor of continued behavior in the behavior-change literature; the ratio/consistency framing avoids the streak failure mode. It does NOT by itself predict skill gain.

2. **Focused/structured-practice quality (single-task perceived effort on a deliberate block, or weakest-skill targeted-contact count)** — *Confidence: Moderate for improvement; Low-Moderate for adherence.* The motor-learning and deliberate-practice literatures consistently credit quality/structure of practice — not volume — with objective skill improvement, especially once weekly volume is low. This is the only candidate family with a defensible improvement claim at this dose.

3. **Weekly subjective confidence/self-efficacy rating** — *Confidence: Moderate for adherence; Low and possibly NEGATIVE for improvement.* Self-efficacy is a replicated adherence predictor, but self-rated confidence diverges from objective skill (Dunning-Kruger), is noisy as a single item, and may induce avoidance on low-confidence weeks.

**Recommendation:** Ship a paired readout — **(1) sessions completed vs. your plan this week** (adherence) **+ (2) a focused-practice quality check on your priority skill** (improvement). Do NOT ship a streak as the primary surface.

---

## Population Caveat (read first)

The core question — does a self-tracked weekly metric co-predict 8–12-week adherence AND objective skill improvement in adult amateurs training 1–3×/week in skill-sports — is **systematically under-served by the literature**. The two richest bodies of evidence both miss this population:

- **Training-load / session-RPE research** is overwhelmingly from coached, elite, or high-volume (5–15 sessions/week) athletes, where total volume is the performance bottleneck and recovery is a first-class concern.
- **Behavior-change / self-monitoring research** is overwhelmingly from weight-loss, physical-activity (step-count), and clinical-adherence populations, not skill-sports.
- **Motor-learning research** uses controlled lab tasks and short windows, mostly in novices.

A dedicated search of the skill-sport dose-response literature confirmed that **a controlled dose-response of 1–3 sessions/week against a validated skill test in adult recreational amateurs essentially does not exist** in tennis, golf, or badminton. The closest peer-reviewed adult, ~2-sessions/week, objective-test study (Ngo, Hoe & Mat Rosly 2026, *JMIR Serious Games*, n=66 adult novices, 12 weeks, validated Hewitt tennis test, large gains with partial η² ≥ 0.14) compares training *type*, not weekly *frequency dose*. Every improvement ranking below therefore involves an explicit extrapolation, which I flag throughout. This gap is itself a finding: the team is shipping into a measurement vacuum and should instrument to build the missing evidence internally.

---

## Per-Metric Evidence Ladder

### 1. Session count per week (raw count)
- **Adherence:** Behavioral logging frequency is a robust attrition predictor. In the 10,000 Steps Australia program (n=11,651 members with ≥3 months tenure), 50.0% stopped logging after 30 days; Cox regression found more physical-activity logging days reduced non-usage attrition (HR=0.921, 95% CI 0.919–0.922, P<.001), and app-only users showed lower attrition than web-only users (HR=0.63, 95% CI 0.58–0.68, P<.001). Early-count models predict dropout: a tobacco-cessation replication (EX intervention, N=70,265 web users) predicted 1-year dropout from first-week engagement with AUC=0.72 (95% CI 0.71–0.73).
- **Improvement:** Raw count is a volume proxy. Deliberate-practice meta-analyses find volume explains a minority of performance variance — 21% for music, 18% for sports (Macnamara, Hambrick & Oswald 2014, *Psychological Science* 25(8):1608–1618, multi-domain). At low dose the bottleneck is consolidation/quality, not count. A 257-golfer retrospective (Golf Insider, **non-peer-reviewed**, 12-month window, mean start handicap 18.9) found improvers practiced *fewer* hours (2.82 h/wk) than those who got worse (3.37 h/wk) — raw volume did not predict handicap change.
- **Noise floor:** At 1–3 sessions/week, integer counts of 0–3 have coarse resolution; ±1 session week-to-week is dominated by life-schedule noise, not training-state signal.

### 2. Session-RPE-week-sum (sRPE)
- **Validity/reliability:** sRPE (Foster et al. 2001: RPE × duration) is a well-validated internal-load measure; a Frontiers review (Haddad et al. 2017) found 950 studies citing the method and 36 validating it, with good reliability (e.g., one study reported ICC=0.94, typical error=0.49, CV=7.7%). But validation is overwhelmingly in athletes / team-sport / elite contexts.
- **Adherence:** No evidence sRPE predicts adherence in self-coached amateurs. It is a load descriptor, not a behavioral-commitment measure.
- **Improvement:** sRPE-load → performance links derive from high-volume periodized athletes where managing load/recovery IS the bottleneck. At 1–3 sessions/week this premise fails: under-training, not over-load, is the constraint, so the construct sRPE is built to manage is largely absent.
- **Over-instrumentation risk:** HIGH — users misread a load number as a recovery prescription.
- **Verdict:** Do not ship as a primary amateur skill-sport metric. It imports an elite-volume mental model into a population that does not have an elite-volume problem.

### 3. Planned-vs-completed session ratio
- **Adherence:** This is the operational form of self-monitoring + goal-setting, the two behavior-change techniques with the most consistent meta-analytic support. Goal-setting for physical activity shows a medium effect (McEwan et al., Cohen d=0.55, 95% CI 0.43–0.67). In a digital weight-loss study (n≈59 analyzed), greater self-monitoring adherence predicted greater weight loss across targets (e.g., physical-activity self-monitoring t57=3.23, P=.002; eating t57=4.47, P<.001). Goal-attainment trajectories show a graded association with outcomes (mHealth weight-loss RCT, N=502, 79% female, mean age 45.0±14.4; four MVPA adherence trajectories, better trajectories → greater 12-month weight loss, p<0.0001).
- **Improvement:** Indirect only — completing planned sessions is necessary but not sufficient; quality within sessions is what the motor-learning literature credits.
- **Noise floor:** A ratio (e.g., 2/3 = 0.67) is less coarse than raw count and references the user's own plan, making it self-calibrating.
- **Verdict:** Best single adherence candidate; honest because it measures commitment-to-plan rather than a vanity volume number.

### 4. Drill-completion rate within sessions
- **Adherence:** Within-session metric; weak evidence as a standalone 8–12-week adherence predictor.
- **Improvement:** Closer to skill content than session count, IF the planned drills embody structured/variable practice. Motor-learning evidence (contextual interference, variable practice) shows practice STRUCTURE drives retention/transfer: a meta-analysis found random practice superior for transfer (Czyż, Wójcik & Solarská 2024, *Frontiers in Psychology* 15:1377122, 34 studies; pooled SMD=0.55, 95% CI 0.25–0.86, p<0.001). Critically, the effect was strong in laboratory settings (SMD=0.75) but **non-significant in applied/field settings (SMD=0.34)** — a caution that the lab-derived structure benefit attenuates in the real-world conditions this app targets.
- **Noise floor:** Single-session rate over a small number of drills is dominated by sampling variance; needs aggregation across the week.

### 5. Weekly subjective confidence rating
- **Adherence:** Self-efficacy is a replicated adherence predictor (McAuley 2003: reliable predictor of exercise behavior at 6- and 18-month follow-up; Oman & King: baseline self-efficacy predicted activity at 2-year follow-up). In a cardiac cohort (N=801 across 3 centers), self-efficacy predicted 6-month behavior, but only autonomous motivation remained a significant predictor at 12 months.
- **Improvement:** Diverges from objective skill. Dunning-Kruger: low performers overestimate, and the *middle* of the skill distribution is best-calibrated — relevant because 2–5-year intermediates sit closer to that better-calibrated middle than novices. The self-confidence–performance link is modest: Woodman & Hardy 2003 (*Journal of Sports Sciences* 21:443–457, k=48) reported a self-confidence mean effect of r=0.24 (P<0.001); an updated meta-analysis (Lochbaum et al. 2022, *Int. J. Environ. Res. Public Health* 19:6381, 41 studies / 3,711 athletes) found r=0.25 (95% CI 0.19–0.30), moderated by outcome type — stronger for objective performance (r=0.29) than subjective (r=0.14).
- **Over-instrumentation risk:** Confidence ratings may induce avoidance on weeks the user expects to feel less confident.

### 6. Weekly self-rated improvement
- Same divergence problem as #5, amplified — it directly asks for a judgment intermediates/novices are poorly calibrated to make, and carries high single-item measurement error. Useful as engagement reflection, not as an honest improvement signal. Do not arithmetically combine with behavioral metrics.

### 7. Weakest-skill contact count
- **Improvement:** Strongest conceptual link to objective skill among volume-type metrics, because it operationalizes targeted/deliberate practice on an identified weakness — the deliberate-practice prescription. Music meta-analysis: accumulated deliberate practice correlated with objectively/expert-graded achievement at corrected r≈0.61 (Platz, Kopiez, Lehmann & Wolf 2014, *Frontiers in Psychology* 5:646, 13 studies, aggregate N=788; uncorrected r=0.44, described as a large overall effect).
- **Adherence:** Weak as a standalone adherence driver.
- **Noise floor:** Contact counts need a display floor; small numbers are sampling noise.

### 8. Weekly variance / consistency (low SD across last 4 weeks)
- **Adherence:** Conceptually aligned with habit formation — Lally et al. 2010 (*European Journal of Social Psychology* 40:998–1009, 96 volunteers, 12 weeks, 82 analyzed) found automaticity builds with context-stable repetition (median 66 days to plateau, range 18–254 days) and, crucially, that **"missing one opportunity to perform the behaviour did not materially affect the habit formation process."** That single finding is the strongest scientific argument *against* punishing streaks.
- **Improvement:** Indirect.
- **Noise floor:** SD across only 4 data points of 0–3 sessions is statistically fragile; present as a qualitative band, not a precise number.

### 9. Streak length
- **Adherence (short-term):** A powerful short-term engagement driver. Duolingo's own A/B testing found that learners offered the "Weekend Amulet" streak protection were "4% more likely to come back a week later and 5% less likely to lose their streak"; the Streak Freeze item lifts long-term retention by a reported ~10% by removing the catastrophic-failure state without removing daily pressure. Streaks were one of the mechanics behind Duolingo lifting Current User Retention Rate (CURR), its North Star metric.
- **Adherence (long-horizon) — COUNTERINTUITIVE FAILURE:** Practitioner consensus (Octalysis/Yu-kai Chou, Nuance Behavior, Mind the Product) is that binary streak resets create "quit moments, not restart moments" — the reset destroys the identity the streak built, and a meaningful share of users abandon after a long break. Notably, even Duolingo's solution is *forgiveness mechanics* (freezes, amulets), not pure streaks. The same source warns that bingeing/over-pacing predicts abandonment: "learners who binge on Duolingo lessons were much more likely to abandon the app than learners who pace themselves."
- **Improvement:** None directly; can incentivize showing up over improving — "showing up is easier than improving" (Yousician/Duolingo retention critique).
- **Verdict:** Do NOT use as the primary surface. If used at all, use forgiving/capped mechanics with grace periods.

### 10. Single-task perceived effort (quality-of-effort proxy on a structured block)
- **Improvement:** The most defensible improvement *proxy* because it indexes effortful, focused practice rather than volume — aligning with deliberate-practice and desirable-difficulty findings. Distinct from sRPE: it is scoped to one focused block, not whole-session load, so it does not import the recovery-prescription failure mode.
- **Adherence:** Modest.
- **Noise floor:** Single item per week; needs stable anchoring and smoothing.

---

## Two-Metric Pair Framing

The literature supports a paired readout more strongly than any single metric because adherence and improvement load on different, weakly-correlated constructs:

- **Adherence axis** is best served by behavioral self-monitoring + goal-attainment (planned-vs-completed ratio) — the most replicated behavior-change levers, with meta-analytic support (goal-setting d=0.55) and prospective dropout evidence (logging-day HRs; AUC=0.72 dropout prediction).
- **Improvement axis** is best served by a structured-practice-quality signal (focused-effort block or weakest-skill targeted practice), because motor-learning (random-practice transfer SMD=0.55) and deliberate-practice evidence (music r≈0.61; sports variance 18%) credit practice quality/structure — not volume — with objective skill gain at low dose.

A digital weight-loss study explicitly concluded that **self-monitoring should be treated as a target-specific behaviour rather than a unitary construct** — direct support for separating the two signals rather than collapsing them into one number. The marginal predictive value of the second (skill) metric over the first (adherence) is high precisely because the first carries no honest improvement signal: they are not substitutes.

**Recommended pair:** "Sessions vs. plan this week" (consistency) + "Focused practice on your priority skill" (skill focus), kept visually and semantically distinct.

---

## Over-Instrumentation Failure Modes (documented)

1. **Streak ghosting (shipped-then-mitigated):** Breaking a long streak produces abandonment rather than restart; the binary reset destroys the built identity. Even Duolingo, the canonical streak operator, mitigates with Streak Freeze / Weekend Amulet forgiveness mechanics (≈10% long-term retention lift; +4% week-later return) rather than relying on raw streaks. Lally's habit data (one miss is harmless) shows a one-miss-punishing streak is behaviorally mis-calibrated.
2. **sRPE misread as recovery prescription:** Load numbers designed for elite load-management get interpreted by amateurs as "train less / I'm overtrained," suppressing the very volume the 1–3×/week user actually needs.
3. **Rating-burden / perceived-effort fatigue:** Repeated subjective ratings degrade in quality; single-item measures carry high per-response measurement error (random noise from mood, interpretation, fat-finger error), so weekly single-point moves are often within noise.
4. **Confidence-induced avoidance:** Confidence ratings may trigger avoidance on anticipated-low weeks; subjective self-perception diverges from behavior and from objective skill (Dunning-Kruger; confidence–performance r≈0.24–0.25).
5. **Self-tracking abandonment generally:** HCI "lived informatics" work (Epstein et al. 2015/2016; Li et al.) documents lapsing and abandonment as *normal* tool-use phases (people lapse by forgetting, upkeep burden, intentional skipping, or suspending). Designs must support lapsing and resuming, not punish them — the "device in the drawer" problem.

---

## Noise Floors (the dose problem)

At 1–3 sessions/week, several candidate metrics move within their own measurement error week-to-week and cannot honestly be shown as precise weekly-changing numbers:
- **Session count:** integer 0–3 — ±1 movement is schedule noise. Surface as a 2–4-week rolling ratio, not a raw weekly count.
- **sRPE-week-sum:** typical sRPE CV ≈ 7.7%; at 1–3 sessions the weekly sum is dominated by session-presence, not intensity signal.
- **Single-item Likert (confidence/improvement/effort):** high measurement error per response; 5-point scales are standard and not outperformed by 7- or 10-point; week-to-week single-point moves are within noise. Aggregate or smooth.
- **Drill/contact counts:** small-N within a session is sampling variance; set a minimum-contacts floor before displaying a rate.
- **SD-based consistency over 4 weeks:** only 4 data points — statistically fragile; present as a qualitative band.

General principle from sport-science target-setting: any metric whose smallest worthwhile change is smaller than its typical error/noise at this dose should not be displayed as a precise weekly-moving number (the SWC-vs-typical-error logic).

---

## Experience-Gradient and Sport-Type Shifts (what flips the ranking)

- **Novice vs. intermediate:** Novices are most miscalibrated (Dunning-Kruger), so subjective confidence/self-rated-improvement are least honest for novices and become more usable toward the better-calibrated middle of the skill distribution where the target 2–5-year intermediates sit. Contextual-interference/structured-practice benefits also scale with skill level — high contextual interference helps more once a base exists — so the improvement metric's framing should scale with experience.
- **Weekly dose:** If a user trains 4+ sessions/week, load metrics (sRPE) regain relevance and recovery becomes a real concern; below that, quality dominates and load metrics mislead.
- **Sport type:** In open/variable skill-sports (tennis, volleyball, climbing) where execution under variable conditions matters, a variable/structured-practice quality metric is more diagnostic than raw contact volume. In closed-skill or endurance-flavored activity, volume regains weight. The applied-vs-lab attenuation in the contextual-interference meta-analysis (field SMD=0.34, non-significant) is a caution that structure benefits are smaller in real conditions than lab studies imply.

---

## Subjective vs. Behavioral Divergence (flag)

An honest readout must not silently mix subjective and behavioral metrics. Behavioral metrics (sessions vs. plan, targeted contacts) are objectively verifiable; subjective metrics (confidence, self-rated improvement) diverge systematically from both behavior and objective skill in this population and carry single-item noise. If both are shown, label them distinctly and never arithmetically combine them into one score.

---

## Gaps the Literature Does Not Close

1. No controlled 1–3 sessions/week dose-response against a validated skill test in adult recreational skill-sport amateurs (confirmed absent in tennis, golf, badminton).
2. No study pairs self-tracked weekly metrics with BOTH 8–12-week adherence AND objective skill improvement in this population.
3. Almost no skill-sport-specific self-tracking-app retention research; most retention evidence is language-learning (Duolingo), step-count, or weight-loss.
4. Confidence/avoidance dynamics for weekly self-rating in self-coached amateurs are theorized, not directly measured.

**Studies that would close them:** a 12-week RCT in adult recreational players (e.g., tennis or golf) randomizing the weekly-readout metric (consistency-only vs. consistency+quality vs. forgiving streak), measuring BOTH retention/adherence AND a validated skill test (e.g., Hewitt tennis test; putting goal-attainment). Secondary arms could vary weekly dose (1 vs 2 vs 3 sessions) to finally produce the missing low-frequency dose-response curve.

---

## Recommendations (staged)

1. **Ship now:** A two-number weekly readout — **sessions completed vs. your weekly plan** (rolling 2–4-week ratio, not a raw count, not a punishing streak) + **a focused-practice quality check on a user-named priority skill** (a single structured block logged as done/effortful, or targeted-contact count above a display floor). Label them "consistency" and "skill focus," kept visually distinct and never summed.
2. **Avoid:** infinite/binary streaks as the hero metric; sRPE-week-sum as a primary amateur surface; arithmetic blending of subjective and behavioral numbers; precise week-to-week display of any metric below its noise floor.
3. **Forgiveness by default:** grace periods and no binary reset, consistent with Lally (one miss is harmless) and the streak-abandonment evidence (even Duolingo relies on freezes/amulets).
4. **Instrument for the missing study:** log both retention and any available objective skill proxy from day one so you can internally build the dose-response evidence the field lacks — this turns your user base into the study that doesn't yet exist.
5. **Thresholds that change the plan:**
   - If internal data shows confidence ratings *precede* skipped weeks (avoidance signature), demote confidence to optional reflection only.
   - If a 4+ sessions/week segment emerges, surface a load/recovery metric *for that segment only*.
   - If the quality metric shows no association with self-reported or tested improvement after one cohort, replace it with weakest-skill targeted-contact count.
   - If the consistency ratio's week-to-week movement proves indistinguishable from schedule noise in your telemetry, lengthen the rolling window before any further metric work.

---

## Caveats
- Every *improvement* ranking rests on extrapolation from adjacent populations (elite athletes, students, weight-loss, lab motor-learning); the exact target population — adult, self-coached, 1–3×/week, skill-sport — is genuinely under-studied. Treat confidence levels as provisional.
- Several industry retention figures (Duolingo CURR/streak A/B results, Strava engagement claims, gamification-consultancy abandonment percentages) are vendor-reported or non-peer-reviewed and are used here as practitioner signal, not as evidence on par with the peer-reviewed sources.
- The strongest improvement-dose evidence (music deliberate-practice meta-analyses, r≈0.61) is cross-sectional expertise correlation, not amateur-improvement-over-time, and should not be over-read as proof that logging targeted practice will produce measurable gains for your specific users.

---

## Citations (peer-reviewed unless flagged)

**Behavior change / adherence / self-monitoring**
- Lally P, van Jaarsveld CHM, Potts HWW, Wardle J (2010). How are habits formed: Modelling habit formation in the real world. *European Journal of Social Psychology* 40:998–1009. DOI: 10.1002/ejsp.674
- McEwan D et al. goal-setting meta-analysis (d=0.55, 95% CI 0.43–0.67), cited in JMIR Human Factors (2025) 1:e66208. https://humanfactors.jmir.org/2025/1/e66208
- Digital self-monitoring target-specificity study. *PMC7156825.* https://pmc.ncbi.nlm.nih.gov/articles/PMC7156825/
- Trajectories of Adherence to Study-Prescribed Physical Activity Goals (N=502 mHealth RCT). *PMC12736852.* https://www.ncbi.nlm.nih.gov/pmc/articles/PMC12736852/
- Engagement and Nonusage Attrition with 10,000 Steps Australia (N=11,651). *PMC4526999.* https://www.ncbi.nlm.nih.gov/pmc/articles/PMC4526999/
- Predicting Early Dropout in a Digital Tobacco Cessation Intervention (N=70,265; AUC=0.72). *PMC11635322.* https://www.ncbi.nlm.nih.gov/pmc/articles/PMC11635322/

**Self-efficacy / adherence**
- McAuley E et al. (2003), self-efficacy as predictor of exercise behavior at 6/18 months; and cardiac cohort N=801 (PubMed 25133848). https://pubmed.ncbi.nlm.nih.gov/25133848/
- Exercise Self-Efficacy and Control Beliefs Predict Exercise Behavior. *PMC3740728.* https://pmc.ncbi.nlm.nih.gov/articles/PMC3740728/

**HCI self-tracking / abandonment**
- Epstein DA, Ping A, Fogarty J, Munson SA (2015). A Lived Informatics Model of Personal Informatics. *UbiComp '15.* https://depstein.net/assets/pubs/depstein_ubi15.pdf
- Epstein DA et al. (2016). Beyond Abandonment to Next Steps. *CHI '16.* PMID 28503678. https://pubmed.ncbi.nlm.nih.gov/28503678/
- Epstein DA et al. (2016). Reconsidering the Device in the Drawer: Lapses as a Design Opportunity. *UbiComp '16.* DOI: 10.1145/2971648.2971656

**Motor learning / deliberate practice / improvement**
- Czyż S, Wójcik A, Solarská P (2024). The effect of contextual interference on transfer in motor learning: systematic review and meta-analysis. *Frontiers in Psychology* 15:1377122 (SMD=0.55, 95% CI 0.25–0.86; field SMD=0.34 ns). DOI: 10.3389/fpsyg.2024.1377122
- Buszard T, Reid M, Krause L, Kovalchik S, Farrow D (2017). Quantifying Contextual Interference and Its Effect on Skill Transfer in Skilled Youth Tennis Players. *Frontiers in Psychology* 8:1931. *PMC5676081.*
- Platz F, Kopiez R, Lehmann AC, Wolf A (2014). The influence of deliberate practice on musical achievement: a meta-analysis. *Frontiers in Psychology* 5:646 (corrected r≈0.61). DOI: 10.3389/fpsyg.2014.00646
- Macnamara BN, Hambrick DZ, Oswald FL (2014). Deliberate Practice and Performance in Music, Games, Sports, Education, and Professions: A Meta-Analysis. *Psychological Science* 25(8):1608–1618 (sports 18%, music 21% variance). DOI: 10.1177/0956797614535810
- Macnamara BN, Moreau D, Hambrick DZ (2016). The Relationship Between Deliberate Practice and Performance in Sports: A Meta-Analysis. *Perspectives on Psychological Science* 11(3):333–350. DOI: 10.1177/1745691616635591
- Ngo JS, Hoe SZ, Mat Rosly M (2026). Effects of Exergaming Tennis on Players' Tennis Skills and Mental State in Adult Players. *JMIR Serious Games* 14:e73732 (n=66; Hewitt test; ηp²≥0.14). DOI: 10.2196/73732

**Confidence / calibration**
- Woodman T, Hardy L (2003). The relative impact of cognitive anxiety and self-confidence upon sport performance: a meta-analysis. *Journal of Sports Sciences* 21:443–457 (self-confidence r=0.24, k=48).
- Lochbaum M et al. (2022). Self-confidence and sport performance meta-analysis (r=0.25, 95% CI 0.19–0.30; 41 studies, 3,711 athletes). *Int. J. Environ. Res. Public Health* 19:6381.
- Kruger & Dunning (1999) and follow-ups on self-assessment calibration (low performers overestimate; mid-distribution best-calibrated).

**Training load / sRPE (elite/coached — used as contrast)**
- Foster C et al. (2001), session-RPE method, as reviewed in Haddad M et al. (2017). Session-RPE Method for Training Load Monitoring. *Frontiers in Neuroscience* 11:612 (950 citing studies; 36 validating; reliability incl. ICC=0.94, CV=7.7%). DOI: 10.3389/fnins.2017.00612

**Single-item measurement reliability**
- Single Item Measures in Psychological Science: A Call to Action. *European Journal of Psychological Assessment* 38(1). DOI: 10.1027/1015-5759/a000699
- Comparison of reliability estimation methods for single-item assessment (5-point not outperformed by 7/10-point). *Frontiers in Psychology* (2024) 15:1482016.

**Smallest worthwhile change / noise**
- Science for Sport, Smallest Worthwhile Change. https://www.scienceforsport.com/smallest-worthwhile-change/

**Industry / practitioner (NON-peer-reviewed — practitioner signal only)**
- Mazal J, "How Duolingo reignited user growth" (CURR North Star; streak mechanics). Lenny's Newsletter. https://www.lennysnewsletter.com/p/how-duolingo-reignited-user-growth
- Duolingo Blog, "Meaningful metrics: How data sharpened the focus of product teams." https://blog.duolingo.com/growth-model-duolingo/
- Yu-kai Chou (Octalysis), Streak Design / Recovery-First Streak Design. https://yukaichou.com/gamification-analysis/streak-design-gamification-motivation-burnout/
- Nuance Behavior / Mind the Product, "Designing Streaks for Long-Term User Growth." https://www.mindtheproduct.com/designing-streaks-for-long-term-user-growth/
- Golf Insider, "How To Lower Your Handicap [Data Study]" (257 golfers; **non-peer-reviewed, retrospective, self-reported**). https://golfinsideruk.com/how-to-lower-your-handicap/