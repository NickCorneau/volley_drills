---
id: brief-response-skill-correlation-vendor-3-2026-04-22
title: "Vendor response: skill correlation (vendor 3, 2026-04-22)"
status: verbatim
stage: validation
type: brief-response
authority: "Verbatim record of vendor 3's response to the 2026-04-22 'Cross-skill correlation in amateur beach volleyball skill development' brief. Raw vendor output as received; not curated canon. The decision-relevant distillation and reconciliation with vendors 1 and 2 live in `docs/research/skill-correlation-amateur-beach.md`."
summary: "Vendor 3 concludes that no peer-reviewed study directly measures within-player Pearson r between pass, serve, and set for the target population; triangulated estimate r ≈ 0.50 (range 0.35–0.65, low-to-moderate confidence). Recommends a per-skill internal model with a lightweight general factor, partial (not full) spillover across skills, general-factor initialization from onboarding priors (years played, self-rating, frequency), and a UI-level scalar projection — a hybrid of V1/V2's pure per-skill recommendation. Cites direct developmental-rate asymmetry data (Gabbett 2006, 8-week intervention N=26: +76% spike / +335% set / +40% pass / +15% serve accuracy gains), within-rally coupling from elite beach (Palao 2019, N=5,161 receptions), level-split setting-efficacy coupling (González-Silva 2016 U16 vs 2020 elite men). Distinguishes within-rally sequential dependency from person-level latent correlation and cross-sectional r from change-score r. Proposes a hierarchical latent-variable study (one general factor plus three skill-specific factors) as the definitive design."
last_updated: 2026-04-22
responds_to: docs/research/briefs/2026-04-22-brief-skill-correlation.md
distilled_in: docs/research/skill-correlation-amateur-beach.md
depends_on:
  - docs/research/briefs/README.md
  - docs/research/skill-correlation-amateur-beach.md
---

# Vendor response: skill correlation (vendor 3, 2026-04-22)

## Provenance and handling

- **Vendor:** vendor 3 (identifier preserved for the reconciliation pass; redact before any external share).
- **Received:** 2026-04-22.
- **Responds to:** [`docs/research/briefs/2026-04-22-brief-skill-correlation.md`](../2026-04-22-brief-skill-correlation.md) — the skill-correlation brief listed in [`docs/research/briefs/README.md`](../README.md).
- **Status:** `verbatim`. This file is the raw deliverable as received. Do not edit content; corrections and commentary live in the distillation note linked below.
- **Distilled in:** [`docs/research/skill-correlation-amateur-beach.md`](../../skill-correlation-amateur-beach.md) — use that note for repo-facing conclusions, cross-vendor reconciliation, cross-links, and decision implications.
- **Convention:** revision-by-replacement per `docs/research/briefs/README.md`. If vendor 3 submits a revised response, it ships as a new `-vendor-3-revised-<date>.md` file; this file is not edited in place.
- **Sibling responses:**
  - [`./2026-04-22-skill-correlation-vendor-1.md`](./2026-04-22-skill-correlation-vendor-1.md) (vendor 1, received 2026-04-22)
  - [`./2026-04-22-skill-correlation-vendor-2.md`](./2026-04-22-skill-correlation-vendor-2.md) (vendor 2, received 2026-04-22)
- **Tool-artifact note:** the verbatim body contains inline `citeturnXXviewN` / `citeturnXXsearchN` markers and `entity["organization","..."]` tokens. These are artifacts of the generating tool's internal citation / entity-resolution format; they are preserved as-is in the verbatim record. The reference list at the bottom contains the resolved named citations with DOIs where available.

## Verbatim response

# Cross-Skill Correlation in Amateur Beach Volleyball Skill Development

## Headline answer

The literature does **not** support a direct quantitative answer for adult recreational beach volleyball players with 2–5 years of experience who train 1–3 times per week without a coach. I did **not** locate a peer-reviewed study that directly reports Pearson correlations among passing, serving, and setting skill levels in that exact population.

My best defensible synthesis is therefore a **triangulated estimate**, not a measured one: cross-skill correlation is probably **moderate**, roughly **r ≈ 0.50**, with a plausible range of about **0.35 to 0.65**, and **low-to-moderate confidence**. That is high enough to justify a shared "general volleyball ability" component, but **not** high enough to conclude that one scalar captures most meaningful variance. In plain English: amateur beach players likely improve somewhat together across pass/serve/set because beach forces repeated exposure to all three skills, but the evidence also shows clear, recurring asymmetry in how these skills develop, which argues against a pure single-level model. citeturn24view0turn20view1turn26view0turn27view0turn16search3

If you force me to choose between your two architectures, the evidence favors **a per-skill internal model with a lightweight general factor**, not a single scalar alone. The strongest reason is not one spectacular correlation paper. It is the opposite: the research base repeatedly shows that pass, serve, and set are **related but non-lockstep**, and the few developmental studies that track multiple volleyball skills at once show visibly different rates of change by skill. citeturn24view0turn20view1turn33view0turn31view0

## What the direct evidence actually says

The cleanest developmental study I found is the 8-week skill-based training intervention by Gabbett and colleagues in **26 talented junior volleyball players** with mean age **15.5 ± 0.2 years**. After three skill-based sessions per week, **spiking, setting, and passing accuracy** improved significantly, but **serving accuracy did not**; specifically, reported gains were about **+76%** for spiking accuracy, **+335%** for setting accuracy, **+40%** for passing accuracy, and only **+15%** for serving accuracy, which was not significant. On technique ratings, only **spiking (+24%)** and **passing (+29%)** improved significantly, while **serving (+17%)** and **setting (+14%)** showed only nonsignificant trends. That is the opposite of lockstep development. A shared training block moved the skills in the same general direction, but by **very different magnitudes** and with **different statistical significance profiles**. citeturn22view0turn24view0turn23view1turn23view2

A second Gabbett study looked at **28 junior volleyball players** (mean age **15.5 years**) competing for selection to a talent-identification squad. The selected group differed from the non-selected group in **passing accuracy** and in **spiking, serving, and passing technique**, but **not** in setting accuracy or setting technique. In the discriminant analysis, only **passing technique** and **serving technique** entered the final model, yielding **78.6% overall classification accuracy**; setting dropped out. The raw means make the asymmetry concrete: passing accuracy **9.1 vs 6.7**, serving technique **3.7 vs 2.8**, passing technique **4.0 vs 2.7**, while setting technique was **3.4 vs 2.8** and not among the key discriminators. Again, the pattern is "partly coupled, partly independent," not "one underlying level explains everything." citeturn19view0turn20view1turn20view2turn20view3

Older indoor-volleyball assessment studies point the same way. In a **college introductory volleyball course** study, **64 subjects** completed six volleyball skill tests; four tests, led by serving and wall-volley skills, significantly discriminated good, average, and poor game performers. In a separate high-school study, **50 volleyball players** were tested on specific ball-handling and general motor tests; the combination of **forearm pass, overhead volley, vertical jump, and weight** classified team level with **68%** accuracy, while **bump-set, height, weight, and shoulder flexibility** classified starters versus nonstarters with **78%** accuracy. These are not correlation coefficients, but they matter because they show researchers repeatedly needed **multiple skill variables**, not one omnibus score, to explain playing level. citeturn10view0turn11view3turn12search1

There is also a revealing "absence" result. The well-known **North Carolina State University Volleyball Skills Test Battery** was developed on **313 students** and explicitly measured **serve, forearm pass, and set** as separate constructs. That paper is often cited because it is practical and game-like, but it does **not** report an inter-skill correlation matrix. Likewise, the beach-specific skill-test paper by Zetou and colleagues built **separate beach tests for set, pass, and serve** in a mixed sample of **40 beach volleyball players** aged **13–26** and concluded that those separate tests were valid and reliable. The literature culture itself is informative: investigators keep measuring these skills separately, which is what you would expect if coaches and researchers do **not** see them as interchangeable manifestations of one scalar competence. citeturn15search0turn41view0

## What motor-learning theory and match analysis imply

The standard motor-learning reading is that transfer depends on **shared elements**, but specificity remains powerful. The classic review by Magill and Hall states that contextual-interference benefits are most likely when task variations are governed by **different generalized motor programs**, whereas variability benefits within a task class matter more when movements are parameter variations of the **same** program. Subsequent work by Hall and Magill reinforced that distinction. In volleyball-learning studies, researchers routinely treat the **forearm pass, set, and overhead serve** as separate skills for practice-schedule experiments, not as mere parameter tweaks of one motor program. That does not mean there is zero transfer among them; it means the default theoretical expectation is **partial transfer, not full co-development**. citeturn35search20turn35search16turn35search19turn33view0turn31view0

The volleyball contextual-interference studies back that up. In one study, **139 high-school students** practiced forearm pass, set, and overhead serve under random, random-blocked, or blocked schedules across nine class periods; all groups improved, but practice condition had no clear retention advantage, suggesting the real-world class environment added noise and skill complexity. In another study, **60 amateur male university students** with no volleyball-practice experience learned the same three skills; random and serial practice improved retention and transfer more than blocked practice across all three skills. The takeaway for your product question is narrow but useful: the literature treats these skills as **learnable together**, yet still **distinct enough** that practice organization matters for each. That fits a model with a shared general factor plus skill-specific states. citeturn33view0turn31view0

Beach and indoor match analysis add a different layer: not latent skill correlation, but **sequential dependency inside rallies**. In an elite men's beach study, Palao and colleagues analyzed **5,161 receptions** by **91 players** across **84 World Tour matches**. They report that in beach volleyball, reception efficacy is high enough that roughly **nine out of ten receptions** still allow the team to build an attack, but the *quality* of the reception sharply changes what comes next. Receptions that yielded **max attack options** accounted for **60.7%** of rallies the team went on to win, versus **38.8%** for receptions that limited attack options. Put bluntly: in beach, pass quality materially changes the setter's and attacker's option set. That is strong **within-rally coupling**, even if it does not tell us the latent person-level correlation between pass skill and set skill. citeturn26view0

The indoor literature shows the same pattern and also suggests that coupling changes with level. In world-class men's indoor volleyball, González-Silva and colleagues analyzed **1,371 serve–reception–set sequences** from **23 matches** involving the top **12 teams** at the World Championship. Reception efficacy, setting zone, set type, set area, and tempo predicted setting efficacy; serve characteristics did **not**. In a developmental U16 study using **5,842 game actions** from Spanish championship teams, reception efficacy, setting technique, and set tempo predicted setting efficacy in both sexes, and the serve mattered more in youth male play than in elite men. The pattern is subtle but important: as level rises, expert setters appear somewhat **better at compensating for imperfect previous touches**. That is not evidence of one scalar skill. It is evidence that elite performance includes better **cross-action compensation**. citeturn27view0turn38search0turn38search2

A final beach-specific point: the official rules of entity["organization","FIVB","world volleyball federation"] state that **both players must always be in play** and that there are **no determined positions** on the court. This almost certainly raises cross-skill exposure relative to indoor volleyball. But exposure is not the same thing as identical development. Beach players see all three skills often; that should increase covariance. It does **not** erase the technical differences among platform passing, overhead/fine-touch setting, and serve toss–contact mechanics. citeturn16search3turn16search9

## What seems to differ by skill

Passing appears to be the most clearly constrained by **ball reading, footwork, platform control, and movement under uncertainty**. In the beach reception study, reception quality dropped when the serve forced lateral movement or hit the interference zone between receivers; the authors explicitly link some of that to the difficulty of moving in sand and to communication problems between players. Passing also showed up repeatedly in developmental discrimination studies: it improved significantly with skill-based training, it separated selected from non-selected juniors, and it helped classify high-school playing level. citeturn26view0turn20view1turn20view3turn11view3

Serving looks more constrained by a blend of **ball-striking mechanics, consistency, and physical output**. In beach, power jump serves were the serve type that most reduced reception efficacy, but they also produced more reception errors and no-options balls precisely because of speed and movement demands on the receiver. Yet in the junior training intervention, serving accuracy was the skill least responsive to the short training block. That combination makes intuitive sense: serving can create downstream pressure, but it may require more repetitions or cleaner feedback to stabilize than passing does. citeturn26view0turn24view0

Setting has the clearest **fine-motor and precision** profile. The beach technique literature notes that a good player must master both overhand and forearm setting, and beach players often rely on forearm setting more than overhand setting because of context and officiating stringency. In the junior intervention, setting accuracy jumped dramatically, but setting technique did not improve significantly. One plausible interpretation is that learners can improve target outcomes quite rapidly with better spatial calibration and repetition, while hand mechanics and stable under-pressure technique mature more slowly. That could produce precisely the kind of "good passer, mediocre setter" asymmetry your product is worried about. citeturn16search9turn24view0

## Practitioner intuition

Practitioner materials are remarkably consistent on one point: beach players must be trained as **all-rounders**, but coaches still treat the core skills as **separate developmental tracks**.

The federation's official beach drill book rotates athletes through **server, passer, and setter** roles inside the same drill sequences. That is a strong practical argument for **shared exposure**. At the same time, the same body of coaching material still breaks practice planning into distinct technical buckets, which is a practical acknowledgement that players can be ahead in one bucket and behind in another. citeturn25search4turn16search3

Official materials from entity["organization","USA Volleyball","us governing body"] list **serving, overhead passing/setting, and forearm passing** as separate core skills in lesson plans, while entity["organization","Volleyball Canada","canadian federation"] development matrices and skills resources also stage **serve, pass, and set** separately over time. That is not proof of low correlation. It is strong coach-facing evidence that the applied community expects **meaningful asymmetry** even in broad-based development. citeturn14search15turn14search11turn9search4

On the beach side, entity["organization","AVP","us beach volleyball tour"] educational content and established beach-coaching curricula continue to describe passing, setting, and serving with distinct level descriptors, and elite beach systems still commonly divide partners into blocker/defender tendencies. In other words, the beach world absolutely wants players to do everything, but it does **not** behave as though all players develop everything equally. Treat this as practitioner intuition, not hard causal evidence. citeturn40search7turn16search13turn40search4

## Product-design implications

For your architecture decision, a **pure single-scalar model is too lossy**. The literature does not say the three skills are independent silos; it says they are **moderately coupled, sequentially interdependent in rallies, and developmentally uneven**. That is exactly the profile where a hidden per-skill vector is worth the implementation cost, even if the user-facing UX initially looks simpler. citeturn24view0turn20view1turn26view0turn27view0

The most defensible product design is:

Use an internal vector with at least **pass / serve / set** dimensions.

Initialize those dimensions from a shared onboarding prior such as years played, self-rating, and recent frequency.

Allow **partial spillover**, not full spillover. If a player succeeds in a passing-heavy session, their setting estimate might rise a little because of shared ball-reading and general comfort, but not nearly as much as passing.

Expose a simplified "overall level" in the UI **only as a projection**, not as the source of truth.

That gives you most of the implementation leverage of the richer model without forcing the full complexity into the user experience on day one. It also fits your local-first setup: separate skill states can still be updated with simple rules from perceived difficulty and completion signals. You do not need a giant ML system to justify the representation. citeturn24view0turn20view1turn33view0

The main edge cases that would flip me toward a single scalar are narrow. If your users are mostly **true beginners** under roughly two years of experience, if sessions are almost always **balanced full-skill practices**, and if your adaptation signals are sparse enough that the app cannot reliably attribute outcomes to pass versus serve versus set, then a scalar plus a few coarse tags may be the better launch decision. Conversely, if users already have stable recreational identities such as "good server, shaky setter," if the app tracks drill-level outcomes by skill, or if many users come from beach environments where one partner tends to defend and another blocks more often, then per-skill modeling becomes even more valuable. The current evidence pulls harder toward the second case than the first for your stated target population. citeturn16search3turn16search13turn40search4

## Gaps and what would most change the answer

The biggest gap is simple: we need a **longitudinal adult recreational beach study**, not more youth indoor inference. The study that would most change your decision is a 6–12 month cohort of at least a few hundred adult beach players, using standardized skill tests for serve, serve-receive/pass, and set, plus drill logs and self-reported practice mix. The analysis should estimate both **cross-sectional correlations** and **change-score correlations**. Those are different questions. A player can have correlated skill *levels* but weakly correlated skill *growth rates*. Your app cares about both.

A second high-value design would use a **hierarchical latent-variable model**: one general volleyball factor plus three skill-specific factors. If the general factor explained most variance in recreational beach adults, then the scalar case would win. If the skill-specific residuals stayed large after controlling for the general factor, the vector case would be decisively justified.

The current literature is strongest on elite rally dependencies and youth developmental asymmetry, and weakest on adult amateur beach person-level correlation. That weakness itself is an actionable finding: if you ever run even a modest in-product validation study, you could generate better evidence than the published literature currently provides.

## Full citation list

Gabbett et al., "Changes in Skill and Physical Fitness Following Training in Talent-Identified Volleyball Players," *Journal of Strength and Conditioning Research*, 2006. **DOI:** 10.1519/R-16814.1. citeturn22view0turn24view0

Gabbett et al., "The Use of Physiological, Anthropometric, and Skill Data to Predict Selection in a Talent-Identified Junior Volleyball Squad," *Journal of Sports Sciences*, 2007. **DOI:** 10.1080/02640410601188777. citeturn19view0turn20view1

Gabbett and Georgieff, "The Development of a Standardized Skill Assessment for Junior Volleyball Players," *International Journal of Sports Physiology and Performance*, 2006. **DOI:** 10.1123/ijspp.1.2.95. citeturn11view3

Thissen-Milder and Mayhew, "Selection and Classification of High School Volleyball Players from Performance Tests," *Journal of Sports Medicine and Physical Fitness*, 1991. Stable abstract source via PubMed. citeturn12search1turn11view3

Cothran, "Six Volleyball Skill Tests as a Predictor of Game Performance," master's thesis, 1992. Stable institutional repository source. citeturn10view0

Bartlett et al., "Development of a Valid Volleyball Skills Test Battery," *Journal of Physical Education, Recreation and Dance*, 1991. **DOI:** 10.1080/07303084.1991.10606554. citeturn15search0turn15search10

French, Rink, and Werner, "Effects of Contextual Interference on Retention of Three Volleyball Skills," *Perceptual and Motor Skills*, 1990. **DOI:** 10.2466/pms.1990.71.1.179. citeturn33view0

Jones and French, "Effects of Contextual Interference on Acquisition and Retention of Three Volleyball Skills," *Perceptual and Motor Skills*, 2007. **DOI:** 10.2466/pms.105.3.883-890. citeturn32search0turn32search18

Kalkhoran and Shariati, "The Effects of Contextual Interference on Learning Volleyball Motor Skills," *Journal of Physical Education and Sport*, 2012. **DOI:** 10.7752/jpes.2012.04081. citeturn31view0

Magill and Hall, "A Review of the Contextual Interference Effect in Motor Skill Acquisition," *Human Movement Science*, 1990. **DOI:** 10.1016/0167-9457(90)90005-X. citeturn35search20

Hall and Magill, "Variability of Practice and the Contextual Interference Effect in Motor Skill Learning," *Journal of Motor Behavior*, 1995. Stable abstract source via PubMed/Semantic Scholar. citeturn34search17turn35search19

Wulf and Schmidt, "Variability in Practice: Facilitation in Retention and Transfer Through Schema Formation or Context Effects?" *Journal of Motor Behavior*, 1988. Stable abstract source. citeturn34search2

Wulf, "Attentional Focus and Motor Learning: A Review of 15 Years," *International Review of Sport and Exercise Psychology*, 2013. **DOI:** 10.1080/1750984X.2012.723728. citeturn36search0turn36search12

Palao et al., "Manner of Execution and Efficacy of Reception in Men's Beach Volleyball," *Montenegrin Journal of Sports Science and Medicine*, 2019. **DOI:** 10.26773/mjssm.190903. citeturn26view0

González-Silva et al., "Characteristics of Serve, Reception and Set That Determine the Setting Efficacy in Men's Volleyball," *Frontiers in Psychology*, 2020. **DOI:** 10.3389/fpsyg.2020.00222. citeturn27view0

González-Silva et al., "Analysis of Setting Efficacy in Young Male and Female Volleyball Players," *Journal of Human Kinetics*, 2016. **DOI:** 10.1515/hukin-2016-0022. citeturn38search0turn38search2

Zetou, Giatsis, and Tzetzis, "Validation and Reliability of Beach Volleyball Skill Test Instruments," *Journal of Human Movement Studies*, 2005. Stable source via ResearchGate abstract page. citeturn41view0

entity["organization","FIVB","world volleyball federation"], *Official Beach Volleyball Rules 2025–2028*. Stable official rules document. citeturn16search3

The federation, *Beach Volleyball Drill-Book*. Stable official coaching document. citeturn25search4

entity["organization","USA Volleyball","us governing body"], "Lesson Plans for Teachers and Coaches." Stable official coaching page. citeturn14search15

entity["organization","Volleyball Canada","canadian federation"], "Skills Matrix" / "Volleyball Development Matrix." Stable official development resources. citeturn14search11turn9search4
