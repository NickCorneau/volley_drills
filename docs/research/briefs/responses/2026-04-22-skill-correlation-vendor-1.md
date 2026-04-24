---
id: brief-response-skill-correlation-vendor-1-2026-04-22
title: "Vendor response: skill correlation (vendor 1, 2026-04-22)"
status: verbatim
stage: validation
type: brief-response
authority: "Verbatim record of vendor 1's response to the 2026-04-22 'Cross-skill correlation in amateur beach volleyball skill development' brief. Raw vendor output as received; not curated canon. The decision-relevant distillation lives in `docs/research/skill-correlation-amateur-beach.md`."
summary: "Vendor 1 concludes that cross-skill (pass / serve / set) correlation in adult recreational beach players with 2–5 years of experience most defensibly sits at r ≈ 0.35–0.60 (central ~0.45, low-to-moderate confidence), based on indirect triangulation from adjacent literature rather than direct measurement. Recommends per-skill vector storage with scalar projection on demand over a single scalar skill score. Flags four literature gaps."
last_updated: 2026-04-22
responds_to: docs/research/briefs/2026-04-22-brief-skill-correlation.md
distilled_in: docs/research/skill-correlation-amateur-beach.md
depends_on:
  - docs/research/briefs/README.md
  - docs/research/skill-correlation-amateur-beach.md
---

# Vendor response: skill correlation (vendor 1, 2026-04-22)

## Provenance and handling

- **Vendor:** vendor 1 (identifier preserved for the reconciliation pass; redact before any external share).
- **Received:** 2026-04-22.
- **Responds to:** [`docs/research/briefs/2026-04-22-brief-skill-correlation.md`](../2026-04-22-brief-skill-correlation.md) — the skill-correlation brief listed in [`docs/research/briefs/README.md`](../README.md).
- **Status:** `verbatim`. This file is the raw deliverable as received. Do not edit content; corrections and commentary live in the distillation note linked below.
- **Distilled in:** [`docs/research/skill-correlation-amateur-beach.md`](../../skill-correlation-amateur-beach.md) — use that note for repo-facing conclusions, cross-links, and decision implications.
- **Convention:** revision-by-replacement per `docs/research/briefs/README.md`. If vendor 1 submits a revised response, it ships as a new `-vendor-1-revised-<date>.md` file; this file is not edited in place.

## Verbatim response

# Skill correlation in amateur beach volleyball

**The peer-reviewed literature does not contain a directly usable Pearson correlation coefficient between passing, serving, and setting proficiency for adult recreational beach volleyball players with 2–5 years of experience.** Triangulating from adjacent evidence — adult-indoor skill-battery studies, beach performance-analysis work, factor-analytic work on youth volleyball, motor-learning theory, and coaching-methodology writings — the most defensible inference is that cross-skill correlation in this population sits in the **moderate range of roughly r ≈ 0.35–0.60 (central estimate ~0.45, low-to-moderate confidence)**. That range is driven upward by the beach format's structural enforcement of all-around play and by shared perceptual-cognitive demands, and driven downward by the specificity-of-learning principle, asymmetric prior-skill transfer from throwing sports, and wildly unequal repetition density in recreational play. For product architecture, that range lands squarely inside the zone where **a per-skill vector model is more defensible than a single scalar**, with edge-case qualifications developed below.

## Headline answer and confidence

The target population is narrow (adult, 2–5 years, rec-level, beach, 1–3 sessions/week, no coach), and **no located study maps onto it precisely**. The nearest empirical anchors are:

- **Zetou, Giatsis & Tzetzis (2005)** — a beach volleyball skill-test validation study on **N=40 mixed-age (13–26, M=17.2) beach players**, which reports high intraclass reliability per skill but whose inter-skill Pearson matrix is not published in open sources.
- **Giatsis et al. (2023)** — N=60 beach players stratified into 20 novices / 20 intermediates / 20 experts, reporting r = 0.956 between test score and proficiency rank; the coefficient-of-variation **collapses from 23.6% (novice) to 8.7% (expert)** — evidence that inter-individual dispersion in skill shrinks dramatically as level rises.
- **Cothran (1992, N=64 college amateurs, indoor)**, who concluded from discriminant analysis that *"the contribution of the four variables is very similar with no one single dominant test factor"* — evidence against a dominant general-ability factor in adult amateurs.
- **Kundu et al. (2020, N=200 junior females, indoor)** factor-analytic talent battery retained spiking, setting, serving, reception, passing, and blocking as **separable factors** — no single-factor solution emerged.

Given (a) the consistent finding that volleyball skills load on multiple factors rather than one, (b) motor-learning theory's strong specificity claim, (c) the beach format's partial compensatory coupling, and (d) the practitioner consensus on asymmetric amateur development, **a point estimate around r ≈ 0.45 with a 90% plausible range of 0.3–0.65** is the most defensible summary. **Confidence is low-moderate**: the number is an inference, not a measurement.

Critically, this is a **population-average** correlation. **Individual-subpopulation correlations vary systematically**: serve↔spike (shared overhead striking generalized motor program) should be noticeably higher, while pass↔set (entirely different effectors and motor primitives) should be noticeably lower.

## Empirical evidence summary

**Direct cross-skill correlations in the target population: absent.** Systematic search of Google Scholar, PubMed, ResearchGate, IJPAS, Journal of Human Kinetics, JSSM, Kinesiology, and the Ericsson/motor-learning corpus located no study that reports within-player Pearson r between passing, serving, and setting in adult amateur beach players. The Zetou-Giatsis-Tzetzis (2005) beach skill-test battery is the closest candidate methodologically; its reliability/validity figures are published but its cross-skill matrix is not accessible in open form.

**Adjacent adult-indoor evidence.** Bartlett, Smith, Davis & Peel (1991) validated the NCSU serve/forearm-pass/set battery on **N=313 college students** and declared it valid and reliable, but the published version in *JOPERD* reports judge-rating criterion validity rather than the inter-test Pearson matrix. Cothran's 1992 thesis (**N=64 adult college amateurs, indoor**) remains the single-best adult-amateur data point: it found *"no one single dominant test factor"* across AAHPER serve, AAHPERD pass-to-self, Brumbach serve, and AAHPERD wall-spike tests, which is direct evidence against a high single-scalar correlation in this population.

**Factor-analytic evidence.** Kundu et al. (2020, N=200 junior females) retained spiking, setting, serving, reception, passing, and blocking as separable items; item-sum validity r values of 0.73–0.79 indicate each skill captures meaningful variance beyond the composite. Katić, Grgantov & Jurko (2006, N=147 female juniors + 50 age-16–17) isolated two motor-ability factors (strength regulation and speed regulation) that predicted technical efficacy via canonical correlation — but the **within-technique correlations were not published**. No factor-analytic study in the located corpus reports percent-variance-explained by a first "general volleyball ability" factor in adult amateurs or beach players. **This absence is itself a finding**: if a strong g-factor existed, it would have been widely reported.

**Beach match-analysis evidence.** Palao & Ortega (2015, **13,939 rallies / 91 elite FIVB players**) found that winners had significantly higher efficacy across serve, reception, set, and side-out spike, concluding that *"success was achieved through the interaction of different game skills"* — a team-level pattern consistent with moderate coupling but not with a single-scalar identity. Grgantov, Katić & Marelić (2005, 203 Croatian elite sets) showed that rule changes altered which skills predicted winning — evidence that inter-skill coupling is rule-sensitive and context-specific. Medeiros et al. (2014, **~3,500 serves and attacks across U-19/U-21/senior elites**) showed skill-efficacy profiles diverge by age cohort, with senior profiles more balanced (shot vs. spike efficacy converge).

**Elite-versus-amateur asymmetry.** Palao, Santos & Ureña (2004, 33 men's + 23 women's matches Sydney 2000) found that top-ranked teams outperformed lower-ranked teams **simultaneously across reception, spike, block, and dig** — a rising-tide pattern. Drikos & Tsoukos (2018) benchmarked Greek League top-4 vs. 9–12 teams and found top teams uniformly better on serve, side-out attack, counter-attack, and reception ratios. Giatsis et al. (2023)'s CV compression from 23.6% to 8.7% as proficiency rises is the clearest quantitative signal that **elite players converge toward uniformly high performance across skills, while novices and intermediates carry much larger idiosyncratic profiles**. Because the target population is 2–5 years recreational — firmly in Giatsis's "novice-to-intermediate" bracket — **target-population cross-skill correlations should be estimated in the lower part of the plausible range, not the upper**.

**Beach-versus-indoor coupling.** No formal within-player comparison exists, but structurally: indoor rules allow six-position specialization (libero, setter, OH, MB, opposite) plus unlimited substitutions, so an indoor player's pass/serve/set profile is allowed to be wildly asymmetric by design. Beach's 2v2 format eliminates that option — every player passes, sets, and attacks every rally. Kiraly & Shewman's *Beach Volleyball* (Human Kinetics, 1999) teaches every technique to every reader, with no position-specific chapter split. **The structural prediction is that beach tightens cross-skill coupling relative to indoor.** The only beach specialization (blocker/defender) is anthropometric and defense-phase, not a passing/setting/serving specialization.

## Motor-learning theory

The dominant theoretical position across Schmidt, Magill, Wulf, Ericsson, Bernstein, and Newell is **specificity of learning**: motor skills transfer weakly except where generalized motor programs are genuinely shared. Serving and spiking share a five-phase overhead striking GMP (approach/cocking/acceleration/contact/follow-through) and should show elevated transfer. **Forearm passing (platform contact, proximal effectors, redirection rather than striking) and overhead hand-setting (bilateral finger coordination, ~72 ms contact window, stretch-shortening cycle of the wrists) are each distinct motor programs with limited transfer to each other or to overhead striking.**

Ericsson's deliberate-practice framework reinforces this: hours are non-fungible across skills. A rec-league adult who plays 2 games per week and serves 20 times but never touches a clean hand-set will see serving improve on a separate trajectory from setting. Carl McGown's Gold Medal Squared methodology, grounded in Schmidt and Henry's specificity principle, explicitly rejects "general athletic ability" as a meaningful construct for volleyball skill acquisition: *"Skills are very specific and there's little transfer from one environment to another."*

Wulf's attentional-focus work adds a useful wrinkle: **optimal external focus is skill-specific**, and the right attentional coupling for forearm passing does not transfer to setting — reinforcing the distinctness of the motor programs at the control level. Bernstein's degrees-of-freedom framework and Newell's constraints-led approach both predict that each skill's coordination solution must be discovered through skill-specific practice.

This body of theory predicts **low cross-skill correlations at the motor-execution level**, partially offset by moderate correlations at the shared perceptual-cognitive level (reading the ball, judging trajectory, anticipating opponent intent). The net prediction: moderate, not high, cross-skill correlation — consistent with the empirical estimate above.

## Practitioner intuition

Established coaches converge on a clear asymmetric-development picture for adult recreational players, clearly distinguished from the empirical evidence above:

**John Kessel (USA Volleyball)** teaches **serving first** to novices — explicitly because it is the most controllable self-paced skill and because forearm passing hurts new players' arms and teaches nothing about game-reading. *"Specificity is the most important principle for learning a motor skill."* Kessel's methodological stance directly implies that amateur skill profiles will be asymmetric because repetition density is asymmetric.

**Carl McGown (BYU, Gold Medal Squared)** argued that *"the maximum benefits of a training stimulus can only be obtained when it replicates the movements and energy systems involved"* — training effects are *"so specific that even minor departures… result in undesirable training effects."* McGown's central lesson was that general athletic ability does not fungibly transfer to volleyball skills; each must be trained separately.

**Karch Kiraly** emphasizes that *"beginners, Olympians and everyone in between must excel at forearm passing"* but treats serving, passing, setting, hitting, blocking, and digging as separate technical chapters. His frequent position: measurement is essential (*"you can't manage what you're not measuring"*) — implicitly arguing that separate per-skill metrics are necessary.

**Mark Lebedew** frames volleyball as "100% technical" and *"a game of precision"* where each skill demands its own *"precise preparation, organization, execution."*

**Hugh McCutcheon** distinguishes skill acquisition (motor pattern) from skill application (decision-making under game pressure) as separate learning objectives per skill.

**Community practitioner consensus (coaching blogs, forums, AVCA material)**: serving is easiest for adult beginners to acquire (self-paced, closed skill, transfers from throwing-sport backgrounds); overhead hand-setting is hardest (narrow tolerance window, no everyday-life analog, rule-constrained by double/lift calls); forearm passing is middling to do but very hard to do consistently under pressure. This produces a **predictable asymmetric development curve in rec adults — serving ahead, passing middle, setting behind** — and is the single most consistent practitioner observation across sources.

This practitioner picture is *weakly* compatible with a single scalar (all skills grow from zero over time) but *strongly* incompatible with a high single-scalar correlation (because the growth rates differ).

## Product-design implications

**Recommendation: adopt the per-skill vector model (option b) as the default, with a derived single-scalar rollup available as a view.** The weight of evidence falls into the 0.4–0.75 mid-range where the brief requires qualitative adjudication, and every qualitative dimension tips the same way:

Motor-learning theory says the three skills are distinct motor programs with low motor-execution transfer. Factor-analytic evidence in volleyball does not find a dominant general-ability factor. Practitioner consensus says amateurs develop asymmetrically, with serving ahead and setting behind. The target population sits in the novice-to-intermediate band where Giatsis's CV data predicts maximum inter-individual profile dispersion. All four arrows point toward separable per-skill dimensions carrying real information.

The **counter-arguments for a single scalar** are real but weaker: the beach format structurally couples skills more than indoor; perceptual-cognitive reading is shared; elite convergence shows that at the ceiling the skills *do* become nearly redundant. A single-scalar model would be approximately correct for users in the elite tail (Pearson r likely > 0.7 there), but the target population is explicitly not that tail.

**Edge cases that would flip the recommendation:**

- **If users are primarily in their first 3–6 months**, skill variance is so compressed (everyone near zero) that a single scalar captures almost everything by construction. Per-skill granularity adds overhead with no signal. Single scalar acceptable.
- **If users are primarily competitive AVP/FIVB-level or longtime 4+ year tournament players**, elite convergence pushes r > 0.7 and a single scalar becomes defensible. Per-skill becomes over-engineering.
- **If the app's core loop is drill recommendation** (what should this user practice next?), per-skill is non-negotiable — recommending "do setting drills" to a user whose setting lags their serving requires per-skill state, regardless of correlation magnitude.
- **If the core loop is match-making or ladder ranking**, a single scalar is operationally sufficient; per-skill detail is noise for the ranker.
- **If users are adults coming from heavy throwing-sport backgrounds** (baseball, handball, tennis), serve and spike will load ahead of pass and set asymmetrically — per-skill captures this well; a scalar masks it.
- **If local-first storage or UI simplicity is a binding constraint**, a three-dimensional vector is barely more expensive than a scalar (three floats per user) and is trivially computable as a mean when a scalar view is needed. The architectural asymmetry favors the vector: you can always project down to a scalar, but you cannot project up from one.

The engineering-judgment heuristic: **store per-skill, display scalar-or-vector per context**. This preserves optionality with negligible cost.

## Literature gaps

Four specific gaps, in priority order, would most change this analysis:

A direct observational study on 50–200 adult recreational beach players (2–5 years experience, training 1–3x/week without a coach) using a validated skill battery (adapted from Zetou-Giatsis-Tzetzis 2005 plus a setting test adapted from Bartlett et al. 1991), reporting the full 3×3 Pearson matrix with confidence intervals. This is the single study that would replace the indirect inference with a measurement. Estimated effort: modest (single-site, cross-sectional).

A longitudinal study on amateur adults over 12–24 months tracking differential rates of improvement per skill — necessary to distinguish whether the three skills are merely uncorrelated at a cross-section or are actively decoupling over time (amateurs diverge). Medeiros et al. (2014) hints at this pattern in elite age cohorts but amateur data is absent.

A factor-analytic study of adult amateur volleyball test batteries reporting percent variance explained by the first principal component. Absence of this in the literature is itself evidence against a strong g-factor, but a direct null result would be more persuasive.

A comparative beach-versus-indoor study using identical within-player metrics on matched-experience adult populations. This would quantify the structural coupling hypothesis instead of inferring it from rules differences.

Additionally, the older AAHPERD-era test batteries (Brady, Russell-Lange, Bassett-Glassow-Locke, Cunningham-Garrison, Helman) likely contain inter-skill correlation matrices in their original *Research Quarterly* print form. Physical-archive retrieval of those papers could surface 1940s–1970s correlation data on college-amateur indoor populations — imperfect but directionally useful.

## Conclusion

The population-appropriate answer is that cross-skill correlation in adult recreational beach players is **moderate and positive, but not high enough to justify collapsing to a single scalar**. Motor-learning theory and factor-analytic evidence both argue against a dominant general-ability factor. Practitioner observation describes a consistent asymmetric-development pattern (serving ahead, setting behind) that a scalar model cannot represent. Beach's structural coupling pulls correlations up relative to indoor but does not eliminate skill-level divergence in the 2–5-year band. The defensible product choice is per-skill vector storage, with a scalar projection computed on demand — an architecture that buys optionality at trivial cost and aligns with how coaches themselves diagnose and prescribe. The single piece of research that would most cleanly settle the question — a direct Pearson matrix on the target population — does not yet exist.

### Full citations

Bartlett, J., Smith, L., Davis, K., & Peel, J. (1991). Development of a Valid Volleyball Skills Test Battery. *Journal of Physical Education, Recreation & Dance*, 62(2), 19–21. https://doi.org/10.1080/07303084.1991.10606554

Bernstein, N. A. (1967). *The Co-ordination and Regulation of Movements*. Pergamon Press.

Cothran, D. J. (1992). *Six Volleyball Skill Tests as a Predictor of Game Performance* [Master's thesis, Western Kentucky University]. https://digitalcommons.wku.edu/theses/1656

Drikos, S., Kountouris, P., Laios, A., & Laios, Y. (2009). Correlates of team performance in Volleyball. *International Journal of Performance Analysis in Sport*, 9(2), 149–156.

Drikos, S., & Tsoukos, A. (2018). Data benchmarking through a longitudinal study in high-level men's volleyball. *International Journal of Performance Analysis in Sport*, 18(3), 470–480.

Ericsson, K. A., Krampe, R. T., & Tesch-Römer, C. (1993). The role of deliberate practice in the acquisition of expert performance. *Psychological Review*, 100, 363–406.

Ericsson, K. A., & Charness, N. (1994). Expert performance: Its structure and acquisition. *American Psychologist*, 49, 725–747.

Gabbett, T. J., & Georgieff, B. (2006). The development of a standardized skill assessment for junior volleyball players. *International Journal of Sports Physiology and Performance*, 1(2), 95–107. https://doi.org/10.1123/ijspp.1.2.95

Gabbett, T., Georgieff, B., & Domrow, N. (2007). The use of physiological, anthropometric, and skill data to predict selection in a talent-identified junior volleyball squad. *Journal of Sports Sciences*, 25(12), 1337–1344. https://doi.org/10.1080/02640410601188777

Giatsis, G., Lola, A., Hatzimanouil, D., & Tzetzis, G. (2023). Evaluation of a beach volleyball skill instrument for the line shot attack. *Journal of Physical Education (Maringá)*, 34, e3409.

Grgantov, Z., Katić, R., & Marelić, N. (2005). Effect of New Rules on the Correlation between Situation Parameters and Performance in Beach Volleyball. *Collegium Antropologicum*, 29(2), 717–722. https://hrcak.srce.hr/5349

Henry, F. M. (1968). Specificity vs. generality in learning motor skill. In R. C. Brown & G. S. Kenyon (Eds.), *Classical Studies on Physical Activity*. Prentice-Hall.

Katić, R., Grgantov, Z., & Jurko, D. (2006). Motor structures in female volleyball players aged 14–17 according to technique quality and performance. *Collegium Antropologicum*, 30(1), 103–112. PMID 16617583.

Kessel, J. (multiple). USA Volleyball Grassroots and Coach Education blog posts. https://www.usavolleyball.org

Kiraly, K., & Shewman, B. (1999). *Beach Volleyball*. Human Kinetics. ISBN 0880118369.

Koch, C., & Tilp, M. (2009). Beach volleyball techniques and tactics. *Kinesiology*, 41(1), 52–59.

Kundu, B., Bose, S., Mondal, S., Saha, S., & Islam, M. S. (2020). Introduction of a test battery for identification of talent in female volleyball players. *European Journal of Physical Education and Sport Science*, 6(7).

Lidor, R., & Ziv, G. (2010). Physical characteristics and physiological attributes of adolescent volleyball players – a review. *Pediatric Exercise Science*, 22(1), 114–134. https://doi.org/10.1123/pes.22.1.114

Magill, R. A., & Anderson, D. I. (2018). *Motor Learning and Control: Concepts and Applications* (11th ed.). McGraw-Hill.

McCutcheon, H. (2022). *Championship Behaviors: A Model for Competitive Excellence in Sports*. Triumph Books.

McGown, C. (1994). *Science of Coaching Volleyball*. Human Kinetics.

McGown, C., & Bain, S. (2010). Motor Learning Principles and the Superiority of Whole Training in Volleyball. AVCA *Coaching Volleyball*.

Medeiros, A. I. A., Mesquita, I. M., Marcelino, R. O., & Palao, J. M. (2014). Effects of technique, age and player's role on serve and attack efficacy in high level beach volleyball players. *International Journal of Performance Analysis in Sport*, 14(3), 680–691.

Mesquita, I., Palao, J. M., Marcelino, R., & Afonso, J. (2013). Performance analysis in indoor volleyball and beach volleyball. In McGarry, O'Donoghue, & Sampaio (Eds.), *Routledge Handbook of Sports Performance Analysis* (pp. 367–379). Routledge.

Newell, K. M. (1986). Constraints on the development of coordination. In M. G. Wade & H. T. A. Whiting (Eds.), *Motor Skill Acquisition in Children* (pp. 341–360).

Palao, J. M., & Ortega, E. (2015). Skill efficacy in men's beach volleyball. *International Journal of Performance Analysis in Sport*, 15(1), 125–134. https://doi.org/10.1080/24748668.2015.11868781

Palao, J. M., Santos, J. A., & Ureña, A. (2004). Effect of team level on skill performance in volleyball. *International Journal of Performance Analysis in Sport*, 4(2), 50–60.

Pérez-Turpin, J. A., Campos-Gutiérrez, L. M., Elvira-Aranda, C., Gomis-Gomis, M. J., Suárez-Llorca, C., & Andreu-Cabrera, E. (2019). Performance indicators in young elite beach volleyball players. *Frontiers in Psychology*, 10, 2712. https://doi.org/10.3389/fpsyg.2019.02712

Schmidt, R. A. (1975). A schema theory of discrete motor skill learning. *Psychological Review*, 82, 225–260.

Schmidt, R. A., Lee, T. D., Winstein, C. J., Wulf, G., & Zelaznik, H. N. (2019). *Motor Control and Learning: A Behavioral Emphasis* (6th ed.). Human Kinetics.

Thorndike, E. L., & Woodworth, R. S. (1901). The influence of improvement in one mental function upon the efficiency of other functions. *Psychological Review*, 8, 247–261.

Wulf, G. (2013). Attentional focus and motor learning: A review of 15 years. *International Review of Sport and Exercise Psychology*, 6, 77–104.

Wulf, G., McConnel, N., Gärtner, M., & Schwarz, A. (2002). Enhancing the learning of sport skills through external-focus feedback. *Journal of Motor Behavior*, 34, 171–182.

Wulf, G., & Shea, C. H. (2002). Principles derived from the study of simple skills do not generalize to complex skill learning. *Psychonomic Bulletin & Review*, 9(2), 185–211.

Zetou, E., Giatsis, G., & Tzetzis, G. (2005). Validation and reliability of beach volleyball skill test instruments. *Journal of Human Movement Studies*, 49(3), 215–230.
