---
id: brief-response-per-skill-baseline-tests-vendor-2-2026-04-22
title: "Vendor response: per-skill baseline tests (vendor 2, 2026-04-22)"
status: verbatim
stage: validation
type: brief-response
authority: "Verbatim record of vendor 2's response to the 2026-04-22 'Per-skill baseline skill assessments for amateur beach volleyball' brief. Raw vendor output as received; not curated canon. The decision-relevant distillation lives in `docs/research/baseline-skill-assessments-amateur-beach.md`."
summary: "Vendor 2 recommends a solo-first, Zetou-and-VSAT-anchored hybrid: Modified Zetou 10-serve protocol with a novel 5-left / 5-right side-switch to neutralize wind (mirroring beach-match 7-point side-swaps) + 3-level ordinal scoring (0 miss / 1 in-bounds / 2 target quadrant); Vertical Pass-to-Self endurance (≥1 m above head, 1 m footprint, continuous count capped at 30) as solo-pass default; Alternating Set-to-Self Positional Challenge (toss-move-set to antenna, 10 reps 5-per-side, binary success) as solo-set default. Insists rubrics strip all qualitative judgment — binary / rigid ordinal against physical markers only. Bias magnitude anchored on Cohen's d ≈ 0.29 from individual-sport self-scoring meta-analysis; introduces biphasic-bias concept (low-skill overestimate, near-mastery underestimate) as a distinct mechanism arguing against monotonic correction. Proposes a phone-video spin-check as a future mitigation for hand-set cleanness self-reporting. Flags three post-launch risks: sand viscosity, double-contact self-reporting, and validity ceiling for advanced amateurs."
last_updated: 2026-04-22
responds_to: docs/research/briefs/2026-04-22-brief-per-skill-baseline-tests.md
distilled_in: docs/research/baseline-skill-assessments-amateur-beach.md
depends_on:
  - docs/research/briefs/README.md
  - docs/research/baseline-skill-assessments-amateur-beach.md
---

# Vendor response: per-skill baseline tests (vendor 2, 2026-04-22)

## Provenance and handling

- **Vendor:** vendor 2 (identifier preserved for the reconciliation pass; redact before any external share).
- **Received:** 2026-04-22.
- **Responds to:** [`docs/research/briefs/2026-04-22-brief-per-skill-baseline-tests.md`](../2026-04-22-brief-per-skill-baseline-tests.md) — the per-skill-baseline-tests brief listed in [`docs/research/briefs/README.md`](../README.md).
- **Status:** `verbatim`. This file is the raw deliverable as received. Do not edit content; corrections and commentary live in the distillation note linked below.
- **Distilled in:** [`docs/research/baseline-skill-assessments-amateur-beach.md`](../../baseline-skill-assessments-amateur-beach.md) — use that note for repo-facing conclusions, cross-links, and decision implications.

---

# Baseline Skill Assessment Protocols for Amateur Beach Volleyball: A Comprehensive Synthesis for Courtside Mobile Application Design

## Introduction to Beach Volleyball Psychometrics and the Mobile Application Context

The evaluation of motor skills in beach volleyball presents a uniquely complex intersection of biomechanics, psychometrics, and environmental science. Unlike indoor volleyball, where atmospheric conditions are standardized and external variables are rigidly controlled, beach volleyball is performed on a highly compliant, unpredictable surface (sand) under dynamic and often volatile atmospheric conditions (wind, sun, and heat). Furthermore, the established academic testing literature has historically focused almost exclusively on scholastic, indoor, and coach-administered environments. Validated assessment instruments such as the American Alliance for Health, Physical Education, Recreation and Dance (AAHPERD) Volleyball Skills Test Battery, the Russell-Lange Volleyball Test, and the Brady Volleyball Test were explicitly designed for indoor gymnasiums and rely heavily on structured oversight and rigid equipment setups. Extrapolating these indoor metrics to an outdoor, self-administered context for amateur adults requires significant methodological adaptation and a critical awareness of the limitations inherent in such extrapolations.

The objective of establishing a courtside, self-administered baseline skill assessment for adult amateurs—specifically targeting the three core competencies of passing (reception), serving, and setting—demands a delicate and rigorously tested balance between scientific validity and practical utility. The target demographic consists of adult amateur players typically engaging in the sport one to three times a week, possessing two to five years of recreational experience. Crucially, these athletes operate without the supervisory presence of a coach, trainer, or independent observer. Consequently, any baseline assessment deployed via a local-first mobile training application must fit within a tight temporal constraint of three to five minutes per skill, require absolutely no specialized equipment beyond a volleyball and a net, and employ a scoring rubric that is mathematically resilient to the inevitable introduction of self-reporting bias.

This report provides an exhaustive mapping of existing, adapted, and theoretical skill assessments tailored to this specific demographic. It evaluates the test-retest reliability, inter-rater reliability, and construct validity of candidate tests, defines the minimum viable dose of repetitions required for statistical stability, quantifies the magnitude of self-scoring bias, and establishes rigorous protocols for standardizing environmental variables. Finally, it synthesizes these findings into actionable recommendations for application design, detailing the specific compromises each test makes between psychometric reliability, speed of execution, and solo-adaptability.

## Theoretical Foundations: Validity, Reliability, and the Ecological Challenge

### Reliability Evidence and Construct Validity in Sport Assessment

In the domain of sports science and motor learning, an assessment instrument is deemed reliable if it consistently produces the same results under the identical conditions, a metric typically measured via the Intraclass Correlation Coefficient (ICC). In standard psychometric evaluation, an ICC above 0.75 is generally considered high, while values exceeding 0.90 are classified as excellent. Construct validity, operating in tandem with reliability, measures whether the test accurately assesses the underlying skill it purports to evaluate and whether it can effectively discriminate between different established skill levels (e.g., distinguishing a beginner from an intermediate, or an intermediate from an advanced player).

The indoor testing literature provides robust ICCs for coach-administered tests. For instance, the AAHPERD serving and passing tests have consistently demonstrated test-retest reliability coefficients exceeding 0.80 across various demographics. Similarly, the Russell-Lange test for overhead passing reports a validity coefficient of 0.67 and an exceptional reliability coefficient of 0.915. More recently, beach-specific instruments have been developed to bridge the ecological gap. The Zetou Beach Volleyball Skill Test battery, which evaluates serving, passing, and setting in sand environments, has achieved exceptional reliability scores. In validation studies, the Zetou battery recorded ICCs at 0.980 for average measures and 0.961 for single measures. These figures indicate that when properly structured and administered, courtside skill tests can provide a highly stable and trustworthy signal.

However, maintaining this reliability in a self-administered context without video analysis, motion capture, or coach oversight requires rigid adherence to specific trial volumes and entirely unambiguous scoring criteria. The primary vulnerability in transitioning from a peer-reviewed methodology to an app-based consumer product lies in the deterioration of testing conditions.

### Explicit Flag: The Extrapolation of Indoor Validity to Beach Environments

It is imperative to explicitly flag a major methodological hazard in the current literature: the pervasive tendency to extrapolate beach volleyball validity from indoor volleyball evidence. Many baseline tests, such as the Brady Wall Volley Test or the Russell-Lange passing tests, have established their reliability coefficients entirely on hard indoor floors. The assumption that an athlete who performs well on a 60-second indoor wall volley will perform equally well in the sand is a fundamentally flawed extrapolation. Sand introduces a profound dampening effect on the stretch-shortening cycle of the lower limbs, radically altering the biomechanics of approaching the ball. Tests that rely on rapid footwork to maintain a continuous volley against a wall fail to account for the energy expenditure and delayed ground reaction forces characteristic of beach play. Therefore, any assessment recommended for this mobile application must either possess beach-specific validation (such as the Zetou battery) or be adapted in a way that minimizes the interference of sand-based locomotion, focusing instead on isolated upper-body mechanics and platform stability.

## The Minimum Viable Dose: Trial Volume and Statistical Stability

A critical variable in designing a mobile-app baseline test is determining the exact number of repetitions required to produce a stable, reliable score—referred to in testing methodology as the minimum viable dose. In motor learning literature, the number of trials directly influences the standard error of measurement. If an assessment is too short, the signal is lost in the noise of standard human movement variability. If it is too long, physiological fatigue corrupts the technical execution, invalidating the assessment of skill.

Research on change-of-direction and general agility skills suggests that taking the mean of four to six trials can produce substantial reliability (ICC > 0.68). Similarly, assessments in youth volleyball populations examining general motor competence have indicated that two trials of a generalized battery can sometimes substitute for three without losing significant reliability, reducing testing burden.

However, for sport-specific technical skills involving accuracy, trajectory control, and fine motor coordination (such as serving, passing, and setting), the literature consistently points to a much higher threshold for statistical stability. The Volleyball Skills Assessment Test (VSAT), an adaptation of AAHPERD designed for special populations, mandates exactly ten attempts for its serving, return of service, and forearm bump subtests. Similarly, the Zetou beach serve test explicitly requires ten consecutive trials to establish a reliable baseline measurement.

The rationale for the ten-repetition standard is multifaceted. First, from a purely mathematical standpoint, ten repetitions simplify the conversion to a percentage or a standardized score out of an ordinal maximum (e.g., 40 points in the Zetou rubric). Second, fewer than ten repetitions fail to adequately account for the inherent movement variability of amateur athletes. A lucky gust of wind, a momentary lapse in visual focus, or a single optimal contact can heavily skew a five-repetition test, resulting in a false positive for skill mastery. Conversely, tests requiring twenty or more repetitions introduce significant fatigue-induced technique degradation, particularly on a compliant sand surface which accelerates muscular exhaustion in the lower extremities.

Therefore, ten discrete repetitions—which take approximately three to five minutes to execute at a measured, deliberate pace—represent the absolute minimum viable dose to yield an ICC high enough (target > 0.80) to inform session difficulty calibration reliably. For continuous endurance tests (such as vertical passing to oneself), time-bound limits (e.g., 60 seconds) or execution ceilings (e.g., a maximum of 30 or 50 consecutive contacts) serve as the equivalent threshold to prevent fatigue from overriding skill assessment.

## The Psychology of Self-Scoring: Bias Magnitude and Mitigation

Deploying a skill assessment without an independent observer introduces the highly complex variable of self-scoring bias. Behavioral economics and cognitive psychology define self-serving attribution bias as the innate human tendency to attribute positive outcomes to intrinsic abilities and technical competence, while ascribing negative outcomes to external factors beyond the individual's control. In the context of beach volleyball, an amateur player is highly susceptible to this psychological phenomenon; they are statistically likely to attribute a missed serve or an errant pass to a sudden gust of wind, glaring sun, or bad sand, while attributing a perfectly placed ball entirely to their own technical prowess.

Meta-analyses examining the magnitude of self-serving biases in athletic outcomes reveal significant differences based on the nature of the sport and the objectivity of the measurement. The bias effect size (measured via Cohen's d) is substantially higher in individual sports (0.29) compared to team sports (0.14), and similarly higher when athletes self-report subjective performance (0.29) versus objective measures (0.14). Because an amateur practicing solo operates functionally as an individual-sport athlete, application designers must anticipate a baseline bias magnitude of approximately 0.29. This means that, left to subjective interpretation, players will systematically inflate their performance scores by nearly a third of a standard deviation. Furthermore, measurement literature distinguishes between monophasic bias—which skews data in a consistent direction across all levels—and biphasic bias, which changes direction at a specific threshold. Amateurs may drastically overestimate their abilities at the lower end of the skill spectrum while becoming hyper-critical and underestimating their performance as they approach mastery.

Comparisons between self-assessment reports and behavioral observer scales demonstrate remarkably low correlation on individual, subjective questionnaire items. When players are asked qualitative questions such as "How well did you pass?" or "Did your platform feel stable?", the resulting data is invariably noisy and unreliable. However, when the assessment is constrained to binary or rigid ordinal outcomes—such as "Did the ball land within the marked 6-foot zone?"—the discrepancy between self-assessment and observer assessment shrinks considerably.

To mitigate the ~0.29 magnitude bias, the application must strip all qualitative judgment from the user. Rubrics must not ask for an evaluation of form, platform shape, footwork, or biomechanical "feel"; they must exclusively ask for the physical outcome of the ball's trajectory relative to static, undeniable environmental markers (e.g., court lines, the net tape, or the sand surface).

## Environmental Adjustments: Standardizing the Outdoor Baseline

Unlike indoor testing, beach volleyball assessments are held hostage by the outdoor environment. Academic literature emphasizes that atmospheric parameters—specifically wind speed, sun trajectory, and sand granulometry—profoundly alter biomechanical execution and tactical decision-making. Implementing a self-administered test requires a standardized protocol for mitigating these variables so that a player's score reflects true technical skill rather than environmental fortune. If these factors are not controlled within the testing protocol, longitudinal tracking (answering the user's question, "Did I improve this month?") becomes mathematically impossible, as score fluctuations will reflect weather changes rather than skill acquisition.

### Wind Standardization Protocols

Wind is universally referred to as the "great equalizer" in beach volleyball, capable of completely disrupting the trajectory of float serves, high passes, and sets. Players are taught to adapt their techniques drastically based on whether they are on the "good side" (with the wind blowing directly into their face) or the "bad side" (with the wind blowing from behind them). When serving or attacking into the wind, the ball encounters aerodynamic resistance and drops faster, requiring a lower, more powerful trajectory; conversely, when serving with the wind, a higher float is utilized to let the tailwind carry the ball deep into the opponent's court.

Match data from elite beach volleyball play indicates that wind speeds varying between 7.01 and 18.00 km/h significantly alter physical performance metrics and movement distances. For a baseline assessment to be reliable, testing entirely from the "bad side" will artificially suppress scores, while testing entirely from the "good side" will artificially inflate them. To standardize wind effects during a ten-repetition baseline test, the application's protocol must mandate a side switch. The player should perform five repetitions from one side of the net, actively note the wind direction, and perform the remaining five repetitions from the opposite side. This perfectly mirrors the regulatory necessity of switching sides every seven points in official beach matches, effectively neutralizing the aerodynamic variable across the aggregate score.

### Sand and Surface Compliance

The physical composition of the sand dictates lower-body movement dynamics. Deep, soft sand significantly increases the energy cost of movement, limits lateral acceleration, and reduces vertical jump height, while packed, wet, or shallow sand behaves more like an indoor floor. The Fédération Internationale de Volleyball (FIVB) maintains strict standards for sand quality in elite competition, but local municipal courts vary wildly. Because the mobile application cannot control or uniformly measure the sand quality at the user's location, mobility-dependent tests (such as passing tests requiring the player to sprint five meters to a tossed ball) introduce unmanageable environmental variance. If a player scores poorly on a dynamic passing drill, it is computationally impossible to determine whether they possess poor platform control, slow reaction speed, or were simply bogged down by uncharacteristically deep sand. Consequently, for pure baseline calibration, stationary or highly limited-movement assessments provide a cleaner, more reliable signal of upper-body mechanics and hand-eye coordination, separating technique from localized environmental friction.

### Sun and Glare Management

Overhead setting and high trajectory passing are heavily impaired when a player is forced to look directly into the sun. Standardizing for solar glare requires a simple orientational rule within the app's protocol instructions: tests involving upward visual tracking (specifically setting and vertical passing) should be aligned perpendicular to the sun's azimuth whenever possible. Alternatively, the application must explicitly instruct the player to wear polarized sunglasses during the assessment to normalize visual contrast and depth perception.

## Per-Skill Assessment Catalog: Passing (Reception)

Passing in beach volleyball demands the rapid integration of visual processing, movement, platform formation, and trajectory calculation. Because the sand limits explosive lateral movement, passing assessments must evaluate an athlete's ability to position their body efficiently and angle their forearms to direct the ball to the setter's optimal "Point of Preparation" (POP).

**1. The VSAT Return of Service / Forearm Bump Test**

Overview: Derived from the AAHPERD test battery, the Volleyball Skills Assessment Test (VSAT) provides a highly structured passing assessment. It requires a coach or a dedicated partner to serve or toss the ball into a 6-foot diameter circle where the athlete is stationed. The athlete must pass the ball back over the net into specific, numbered scoring zones.

- What it Measures: Movement integration, platform angle under pressure, and passing accuracy relative to the net.
- Scoring Rubric: Ordinal. 0 points for a total miss; 1 point for a touch; 2 points if the ball travels over the net; 2 points plus the zone value (ranging from 1 to 4) if the ball lands in a designated target area.
- Reliability: High. ICCs for the VSAT subtests routinely exceed 0.80 when 10 attempts are utilized across diverse populations.
- Suitability for Solo Amateur Use: Low. The fatal flaw of the VSAT in the context of this specific product brief is its absolute reliance on a partner to deliver the ball. A solo player cannot self-administer a true serve-receive test, rendering this gold-standard assessment entirely disqualified for the solo use case.

**2. The Brady Volleyball Test / Russell-Lange Adaptation (Wall Volley)**

Overview: The Brady Volleyball Test and the Russell-Lange Volleyball Test are foundational assessments in physical education. The Russell-Lange test utilizes a firm, upright wall with a horizontal net line drawn at 7.5 feet high, requiring the athlete to repeatedly volley the ball against the target for 30-to-60 second intervals.

- What it Measures: Hand-eye coordination, rapid platform readjustment, forearm pass consistency, and continuous rhythm.
- Scoring Rubric: Ratio/Continuous. The score is the absolute number of legal volleys completed above the line within the strict time limit.
- Reliability: High. Continuous wall tests strip out environmental variables such as wind and isolate mechanical consistency, yielding high test-retest stability (Russell-Lange reports a reliability of 0.915).
- Suitability for Solo Amateur Use: Medium-Low. While it is entirely solo-adaptable and highly reliable, its beach validity is fundamentally compromised. Wall volleys mimic indoor speed and lack the high, parabolic trajectory required of a true beach pass. Furthermore, outdoor beach courts rarely feature an adjacent, perfectly flat, solid wall, violating the "courtside" constraint and severely limiting user accessibility.

**3. The Vertical Pass-to-Self Endurance Protocol (Solo Adapted)**

Overview: To solve the solo-beach constraint, established practitioners and coaches rely heavily on vertical passing drills. The athlete assumes an athletic stance in the sand and passes the ball straight up into the air continuously, attempting to keep the ball from hitting the ground without moving their feet out of a small footprint.

- What it Measures: Platform shape consistency, microscopic footwork adjustments, and vertical ball control. In beach volleyball, keeping the pass high and tight to the body's midline is essential for giving the partner adequate time to transition through the sand.
- Scoring Rubric: Ratio/Continuous counting. The athlete counts how many consecutive vertical passes they can execute before the ball drops or they are forced to take more than one step out of their original footprint.
- Reliability: Medium. Without an observer to judge whether the pass was "high enough," athletes may resort to low, rapid micro-touches to artificially inflate their score, invoking self-scoring bias.
- Suitability for Solo Amateur Use: High. It requires zero equipment, no partner, and minimal court space. To improve reliability and mitigate bias, the app must strictly constrain the rubric: e.g., "Pass the ball at least three feet above the head; how many consecutive passes can you complete, up to a maximum of 30?".

**Explicit Flag: Validity Ceiling for Advanced Amateurs**

It is crucial to flag that the Vertical Pass-to-Self Endurance Protocol possesses a known validity ceiling above the intermediate level. While it perfectly discriminates a beginner (who cannot string together 5 passes) from an intermediate (who can hit 15-20), an advanced amateur (Better at Beach Level 4 or 5) will easily hit the ceiling of 30 or 50 passes without error. Therefore, this test cannot discriminate intermediate from advanced play, making it a pure baseline tool for the lower end of the target demographic.

## Per-Skill Assessment Catalog: Serving

The serve is the only closed-loop motor skill in beach volleyball, meaning the athlete has complete, unbothered control over the timing, ball placement, and initial biomechanical execution. This makes serving tests inherently easier to self-administer and highly reliable.

In the amateur beach volleyball demographic (2 to 5 years of experience), players are generally transitioning from basic standing overhand serves to zone-targeted standing float serves. Jump-float and jump-topspin serves are typically reserved for advanced club-level and elite players. Consequently, an effective assessment must evaluate placement and consistency rather than sheer serve pressure or velocity.

**Explicit Flag: Disqualification of Velocity-Based Metrics**

Any test designed to measure serve pressure via velocity (often correlated with jump-topspin serves) requires equipment that amateurs do not typically carry, such as radar guns, high-speed multi-camera setups, or wearable force/IMU devices like the VERT monitor. Because the prompt constrains the user to holding or glancing at a phone, all velocity-based assessment protocols are strictly disqualified. The focus must remain entirely on spatial accuracy.

**1. The Zetou Beach Serve Skill Instrument**

Overview: Developed specifically for the unique dimensions and rules of beach volleyball, the Zetou instrument evaluates a player's ability to serve the ball over the net and into designated target areas. The player performs ten consecutive serves from behind the baseline.

- What it Measures: Serve consistency, aerodynamic control (the ability to push a float serve through the wind), and spatial placement.
- Scoring Rubric: Ordinal. The opposing court is divided into four graded target sections using simple visual markers (like towels, bags, or lines drawn deeply in the sand). The score is based on where the ball lands, yielding a maximum score of 40 points (10 trials x 4 points). Crucially, if the ball hits the net but still lands in a scoring zone, the points are awarded, replicating true game conditions.
- Reliability: Excellent. The Zetou battery boasts exceptional intraclass correlation coefficients, recorded at 0.980 for average measures and 0.961 for single measures.
- Suitability for Solo Amateur Use: High. The test requires no partner. A solo player can draw targets in the sand, serve ten balls, walk to the other side to retrieve them, and score the outcome based purely on where the ball indented the sand. This eliminates self-scoring bias because the outcome is entirely objective and physically verifiable.

**2. The VSAT Serve Test**

Overview: Similar to the Zetou protocol, the VSAT requires ten serves. However, its scoring is slightly more binary at the lower end of performance. Points are awarded only if the ball lands in a defined scoring area; no partial credit is given for merely crossing the net if it ultimately lands out of bounds.

- What it Measures: Pure in-court consistency and targeted accuracy under penalty.
- Scoring Rubric: Ordinal summation. Points from the zones are tallied and multiplied by five to create a standardized score. Line balls are generously awarded the higher point value.
- Reliability: High. ICCs consistently remain above 0.80 across varying genders and skill levels.
- Suitability for Solo Amateur Use: High. It shares the same solo-friendly physical mechanics as the Zetou test but utilizes a more punitive scoring system for out-of-bounds errors. This may be demoralizing for true beginners but is highly discriminative for intermediate players.

**3. AAHPERD Serve Accuracy Test**

Overview: The standard scholastic indoor test, focusing on consistent, repeated serving into highly complex, demarcated grids.

- What it Measures: Serving consistency and micro-directional control.
- Scoring Rubric: Points awarded based on concentric or multi-grid targets taped to the floor.
- Suitability for Solo Amateur Use: Low-Medium. Translating complex indoor grid systems to an outdoor sand court is incredibly cumbersome for a casual amateur looking for a 3-minute drill. The simplified, quadrant-based zones of Zetou or VSAT are vastly preferable for courtside deployment.

## Per-Skill Assessment Catalog: Setting

Setting on the beach is a highly specialized skill subject to strict regulatory constraints. Unlike indoor volleyball, where hand setting is ubiquitous and relatively forgiving, beach volleyball penalizes minor double-contacts (evident by the spin on the ball upon release) severely. Consequently, many elite and amateur players prefer bump setting (forearm setting) for its absolute safety and consistency under pressure. An effective baseline assessment must allow the user to test their preferred method—hand or bump—while accurately capturing the trajectory and location of the set.

**1. Target Setting Assessment (AAHPERD / VSAT Adapted)**

Overview: The player receives a tossed ball from a partner and must set it (via hands or forearms) to a specific "Point of Preparation" (POP) on the net.

- What it Measures: Precision, depth perception, trajectory management, and the ability to square the shoulders to the target.
- Scoring Rubric: Ordinal. A physical target (e.g., an antenna, a hoop, or a marked net zone) is placed at the net. Points are awarded based on the proximity of the set's apex to the target.
- Reliability: High (ICC > 0.80) when administered by a coach or reliable partner.
- Suitability for Solo Amateur Use: Low. Like the passing tests, an ecologically valid setting test requires an incoming pass. A self-tossed ball into a set does not replicate the complex biomechanics of moving to a passed ball and squaring up to the target.

**2. Solo Vertical Set Endurance Test**

Overview: The player begins by lying on their back, sitting in the sand to isolate the upper body, or standing in a static athletic position. They hand-set the ball continuously straight up in the air.

- What it Measures: Hand-wrist mechanics, isometric core stability, and release consistency without the interference of lower-body positioning or environmental wind load.
- Scoring Rubric: Ratio/Continuous. The player counts the number of clean, spin-free sets achieved consecutively, up to a mathematical ceiling (e.g., 30 or 50 reps).
- Reliability: Medium-High. Research indicates that continuous repetitive tasks possess high internal consistency. However, self-assessing the "cleanliness" (lack of spin) of a hand set introduces massive subjective bias. An amateur may count dozens of sets that a licensed referee would flag for a double-contact.
- Suitability for Solo Amateur Use: High. It can be performed anywhere on the beach, requires only a ball, and easily fits within a three-minute temporal window.

**Explicit Flag: Reliability Issues Regarding Rule Enforcement**

Any hand-setting test self-administered by an amateur possesses known reliability issues that make "did I improve?" answers incredibly noisy. If a player scores 40 vertical sets in Week 1 with poor, spin-heavy form, and scores 20 vertical sets in Week 4 with strict, spin-free form, the data will falsely indicate a regression in skill. The app must account for this by either relaxing the criteria (allowing bump setting) or relying on binary positional targets rather than qualitative form checks.

**3. Alternating Bounce-Set Drill**

Overview: The player hand sets the ball high into the air, allows it to bounce once in the sand (or on an adjacent solid surface), moves under it, and hand sets it again, looping this sequence continuously.

- What it Measures: Footwork to the ball, squaring up, and setting under the ball's center of gravity.
- Scoring Rubric: Ratio/Continuous. Count of consecutive successful cycles.
- Suitability for Solo Amateur Use: Low-Medium. The bounce height on sand is highly variable depending on sand compaction. A soft sand patch will instantly kill the bounce, abruptly ending the test and ruining the score's reliability through absolutely no fault of the player's technique.

## Synthesis Comparison Table

The following table synthesizes the candidate assessments across key operational dimensions critical for mobile application integration.

| Assessment / Protocol | Target Skill | Est. Duration | Equipment Needed | Partner Required | Scoring Rubric Type | Reliability Rating (ICC) | Solo-Adaptability Rating |
|---|---|---|---|---|---|---|---|
| Zetou Beach Serve Test | Serving | 3-4 mins | Ball, Net, Target markers (towels/lines) | No | Ordinal (40 pt max, 10 reps) | Excellent (>0.96) | High. Ideal for solo players. |
| VSAT Serve Test | Serving | 3-4 mins | Ball, Net | No | Ordinal (Zone pts x 5, 10 reps) | High (>0.80) | High. Features strict out-of-bounds penalties. |
| Brady / Russell-Lange Wall Volley | Passing / Setting | 1-2 mins | Ball, Solid flat wall | No | Continuous count (30-60s) | High (>0.80) | Low. Regulation walls are rarely available courtside at beaches. |
| VSAT Forearm Pass | Passing | 4-5 mins | Ball, Net | Yes | Ordinal (Zone pts, 10 reps) | High (>0.80) | Low. Cannot be self-administered. |
| Vertical Pass Endurance | Passing | 2 mins | Ball only | No | Continuous count (Max ceiling) | Medium (~0.60-0.70) | High. Can be executed anywhere in the sand. |
| Target Setting Assessment | Setting | 4-5 mins | Ball, Net, Partner | Yes | Ordinal (Proximity to target) | High (>0.80) | Low. Requires an accurate incoming pass to initiate. |
| Vertical Set Endurance | Setting | 2 mins | Ball only | No | Continuous count (Max ceiling) | Medium-High (~0.75) | High. Subject to severe self-scoring double-contact bias. |

## Recommended Protocol Framework for Application Design

If a mobile application must deploy exactly one 3-to-5 minute baseline assessment per skill that an amateur can self-administer courtside and fundamentally trust, the product design must prioritize mechanical simplicity, absolute objectivity in the rubric, and solo viability. The following recommendations represent the optimal, defensible compromises between academic psychometric validity and field reality.

### 1. Serving: The Modified Zetou 10-Serve Protocol

Recommendation: The application should implement a structurally modified Zetou Beach Serve Test. The player divides the opponent's court into two halves (Left/Right) and a short/deep line using their feet or gym bags in the sand. The player must serve exactly ten balls. Crucially, to mitigate environmental wind bias, five serves must be executed from the left side of the baseline, and five from the right.

- Rubric: 1 point for crossing the net and landing in bounds; 2 points for landing in the designated target quadrant; 0 points for a miss or out of bounds.
- The Compromise: This test perfectly balances high reliability and speed. It requires the player to retrieve the balls (which consumes time), but it entirely eliminates self-scoring bias. The outcome is binary and physically observable (it landed in the zone or it didn't), mathematically nullifying the ~0.29 magnitude self-serving bias.

### 2. Passing (Reception): The 30-Contact Vertical Pass Ceiling

Recommendation: Because a true, ecologically valid serve-receive test absolutely requires a partner to simulate realistic ball flight and velocity, a strictly solo application must pivot to measuring foundational platform mechanics and ball control. The app should prompt the user to execute continuous vertical forearm passes while standing in the sand.

- Rubric: The player counts consecutive passes that travel at least one meter above their head without the ball touching the ground or the player stepping out of a one-meter footprint. The test hard-caps at 30 consecutive passes to prevent fatigue skew. If the player drops the ball at 14, their recorded score is 14.
- The Compromise: This heavily trades construct validity for solo-adaptability. Vertical passing does not measure a player's ability to read a server's arm swing, nor does it test lateral movement under a heavy wind load. However, it provides a highly reliable assessment of foundational forearm platform stability. For an amateur, failure to string together 10 vertical passes indicates a severe mechanical deficit that must be addressed via app programming before dynamic serve-receive can be mastered.

### 3. Setting: The Alternating Set-to-Self Positional Challenge

Recommendation: Recognizing the fierce debate between hand setting and bump setting in beach culture, the app should allow the user to select their preferred style to test. The player stands approximately three meters off the net, parallel to it. They toss the ball high to themselves, move their feet to square up to the net, and set the ball parallel to the net tape toward the antenna.

- Rubric: Binary success count out of 10 attempts (five facing the left antenna, five facing the right). A success is defined strictly as the ball traveling an arching height and landing within one meter of the antenna, without crossing the vertical plane of the net.
- The Compromise: This simulates the crucial "Point of Preparation" (POP) movement. It requires self-tossing, which is artificial, but it forces the player to execute the vital footwork of squaring shoulders to the target. The compromise relies on the athlete honestly judging if the ball crossed the net (a strict error in beach volleyball), shifting the focus from subjective "spin" to objective spatial trajectory.

## Gaps, Open Questions, and Post-Launch Risks

While the academic literature provides robust statistical foundations for indoor, observed testing, the transition to purely self-administered mobile tracking uncovers several gaps that product designers must actively monitor post-launch. Failure to account for these variables will result in degraded user trust.

**The Sand Viscosity Variable:** The literature extensively documents that sand quality (granulometry, depth, moisture content) drastically alters movement efficiency, jump height, and sprint times. A user who tests at a high-quality, FIVB-standard deep sand facility will exhibit slower lateral movement than a user testing on tightly packed, municipal dirt-sand. If the application tracks longitudinal progress ("Did I improve this month?"), changing beaches could produce wildly noisy data.

Study Design to Resolve: The app could ask users to rate the sand condition on a simple Likert scale (Hard, Medium, Deep) prior to testing. Data scientists could then run regression analyses to normalize baseline scores against these surface compliance indices, creating a localized handicap.

**Double-Contact Self-Reporting in Setting:** Hand setting in beach volleyball is subjected to highly stringent regulations regarding the ball's rotation upon release. Self-scoring bias literature heavily suggests that an amateur will not accurately or honestly self-report their own double-contacts. A player might score a 10/10 on a spatial setting test while executing technically illegal sets.

Study Design to Resolve: Implementing a brief computer-vision check—where the user props their phone against their bag to record a short burst of the ball's spin on release—could bridge the gap between subjective self-reporting and objective biomechanical reality, automatically invalidating reps with excessive rotation.

**Validity Ceiling for Advanced Amateurs:** The proposed vertical passing and setting endurance tests will undoubtedly suffer from a severe ceiling effect for upper-intermediate players (Better at Beach Level 4). A player with three to four years of dedicated experience will easily cap out at 30 vertical passes, rendering the test useless for discriminating between an intermediate and an advanced player.

Study Design to Resolve: The application must utilize branching logic. Once a user consistently maxes out the solo baseline over two consecutive testing cycles, the app must unlock and prompt dynamic, partner-dependent testing (like the full VSAT) to continue charting progression, acknowledging that advanced beach volleyball cannot be accurately measured in a vacuum.

## References

Special Olympics Kansas. (2018). Volleyball Skills Assessment Test (VSAT). https://soks.org/wp-content/uploads/2022/10/2018-Volleyball-Skills-Assessment-Test-VSAT.pdf

International Journal of Research and Innovation in Social Science. Imagery Training in Volleyball Serve Performance. https://rsisinternational.org/journals/ijriss/Digital-Library/volume-9-issue-3/522-536.pdf

PubMed Central. AAHPERD Volleyball Skill Test Manual Adaptation. https://pmc.ncbi.nlm.nih.gov/articles/PMC8507990/

ResearchGate. Service Techniques To Improve Volleyball Games. https://www.researchgate.net/publication/352073658_Service_Techniques_To_Improve_Volyball_GameS

Horizon Research Publishing. Russell-Lange Repeated Volleyball Test Instrument. https://www.hrpub.org/download/SoftCopy/SoftCopy-SAJ9.2.pdf

European Journal of Educational Research. Standardized objective skill tests in Volleyball. https://oapub.org/edu/index.php/ejep/article/download/2781/5419

ResearchGate. Brady Volleyball Test for Accuracy. https://www.researchgate.net/publication/397109152_The_impact_of_part-whole_passing_training_on_passing_accuracy_in_volleyball_athletes_aged_10-14_years

ResearchGate. Validity, Objectivity, and Reliability of Volleyball Skills Instrument. https://www.researchgate.net/publication/388151262_Validity_Objectivity_and_Reliability_of_Volleyball_Skills_Instrument

International Journal of Creative Research Thoughts. Brady Volleyball Test and Helman Volleyball Test Applications. https://www.ijcrt.org/papers/IJCRT2411674.pdf

Scribd. Reliability of Data in Volleyball Skill Execution. https://www.scribd.com/document/647347799/BHANWAR

SciELO. Reliability of Beach Volleyball Measurement Instruments. https://www.scielo.br/j/jpe/a/JpzPS4bJwXL5Lvt7b9kGXFN/

Zetou, E., Tzetzis, G., & Giatsis, G. (2005). Validation and reliability of beach volleyball skill test instruments. Journal of Human Movement Studies. https://www.researchgate.net/publication/286941116_Validation_and_reliability_of_beach_volleyball_skill_test_instruments

PubMed Central. Inter- and Intra-reliability of Volleyball Performance Analysis. https://pmc.ncbi.nlm.nih.gov/articles/PMC12654878/

USA Volleyball. USA Volleyball Coach Academy Excerpt: Fundamental Beach Skills. https://usavolleyball.org/resource/coach-academy-excerpt-fundamental-beach-skills/

Better at Beach. Beach Volleyball: How to Play in Windy Conditions. https://www.betteratbeach.com/blog/beach-volleyball-how-to-play-in-windy-conditions

US Sports Camps. Beach Volleyball Tip: Passing on the Beach (Wind, Sand, Sun). https://www.ussportscamps.com/tips/volleyball/beach-volleyball-tip-passing-on-the-beach-wind-sand-sun

Better at Beach / YouTube. Don't Feel Lost In The Wind - Beach Volleyball Training. https://www.youtube.com/watch?v=eY2IftvBBo8

Beach Training. Bump Setting vs Hand Setting. https://beachtraining.com/bump-setting-vs-hand-setting/

AVP. Setting 101: Bump Setting vs. Hand Setting. https://avp.com/news/setting-101/

Adapted Physical Activity Quarterly. Validating a Special Olympics Volleyball Skills Assessment Test. https://journals.humankinetics.com/downloadpdf/journals/apaq/13/2/article-p166.pdf

PubMed Central. Reliability of MCA battery in youth volleyball players. https://pmc.ncbi.nlm.nih.gov/articles/PMC9297583/

ResearchGate. Test-Retest and Inter-Rater Reliability of Volleyball Accuracy Tests. https://www.researchgate.net/publication/387163032_TEST-RETEST_AND_INTER-RATER_RELIABILITY_OF_VOLLEYBALL_ACCURACY_TESTS_IN_SCHOOL_CHILDREN

PhysActiv. Reliability of Stopping the Rolling Ball Test in Volleyball. https://www.physactiv.eu/wp-content/uploads/2022/01/2022_1019.pdf

MDPI. Evaluation of Sand Properties for Beach Volleyball Courts. https://www.mdpi.com/2076-3417/12/14/6985

ResearchGate. Evaluation of a beach volleyball skill instrument for the line shot attack. https://www.researchgate.net/publication/369467936_Evaluation_of_a_beach_volleyball_skill_instrument_for_the_line_shot_attack

PubMed Central. Validation of Wearable Jump Monitors in Volleyball. https://pmc.ncbi.nlm.nih.gov/articles/PMC10142445/

ResearchGate. Approaches to team performance assessment: self-assessment reports and behavioral observer scales. https://www.researchgate.net/publication/318929123_Approaches_to_team_performance_assessment_a_comparison_of_self-assessment_reports_and_behavioral_observer_scales

Taylor & Francis Online. Magnitude of bias in athlete self-scoring. https://www.tandfonline.com/doi/full/10.1080/1750984X.2025.2556393

PubMed Central. Confidence-Performance Relationship Moderation by Sport Type. https://pmc.ncbi.nlm.nih.gov/articles/PMC9180271/

PubMed Central. Self-serving bias and athletic expectations. https://pmc.ncbi.nlm.nih.gov/articles/PMC8886887/

Dr. Paul McCarthy. Self-Serving Bias and Its Influence on Athletic Performance. https://www.drpaulmccarthy.com/post/self-serving-bias-and-its-influence-on-athletic-performance-a-comprehensive-analysis

Better at Beach. Tip #1: Adjust Your Serve in Windy Conditions. https://www.betteratbeach.com/blog/beach-volleyball-how-to-play-in-windy-conditions

US Sports Camps. Adjusting Passing to Wind, Sun, and Sand. https://www.ussportscamps.com/tips/volleyball/beach-volleyball-tip-passing-on-the-beach-wind-sand-sun

Fireball Beach Volleyball. How to Adjust to Windy Conditions in Beach Volleyball. https://fireballbeachvolleyball.com/how-to-adjust-to-windy-conditions-in-beach-volleyball/

US Sports Camps. One-Man Volleyball Drills You Can Do At Home. https://www.ussportscamps.com/tips/volleyball/one-man-volleyball-drills-you-can-do-at-home

Better at Beach. Our Favorite Beach Volleyball Drills (Solo). https://www.betteratbeach.com/blog/bestbeachvolleyballdrills

Zetou, E., Tzetzis, G., & Giatsis, G. Development and Description of Serve Skill Test Instrument. https://www.researchgate.net/profile/Eleni_Zetou/publication/286941116_Validation_and_reliability_of_beach_volleyball_skill_test_instruments/links/5681932b08ae1975838f8db3/Validation-and-reliability-of-beach-volleyball-skill-test-instruments.pdf

ResearchGate. Number of trials necessary to achieve reliable change-of-direction measurement. https://www.researchgate.net/publication/322527987_Number_of_trials_necessary_to_achieve_reliable_change-of-direction_measurement_in_amateur_basketball_players

PeerJ. Monophasic and biphasic bias in self-assessment. https://peerj.com/articles/17789/

ResearchGate. Validity, Objectivity, and Reliability of Volleyball Skills Instrument. https://www.researchgate.net/publication/388151262_Validity_Objectivity_and_Reliability_of_Volleyball_Skills_Instrument

PubMed Central. Match demands and physical performance in beach volleyball. https://pmc.ncbi.nlm.nih.gov/articles/PMC12522762/

PubMed Central. Exercise Performance and Thermoregulatory Responses in the Heat. https://pmc.ncbi.nlm.nih.gov/articles/PMC12031097/

EFSUPIT. Duration of rallies and time between rallies in beach volleyball. https://efsupit.ro/images/stories/martie2021/Art%20108.pdf

Akinesiologica. Motor coordination and physical activity in childhood. https://akinesiologica.com/wp-content/uploads/2017/11/AA10S1.pdf

ResearchGate. Validation of the VERT wearable jump monitor device in elite youth volleyball players. https://www.researchgate.net/publication/317259691_Validation_of_the_VERT_wearable_jump_monitor_device_in_elite_youth_volleyball_players

Better at Beach. What Beach Volleyball Level Am I? Complete Skill Assessment Guide. https://www.betteratbeach.com/blog/what-beach-volleyball-level-am-i

FIVB. Beach Volleyball Drill-Book. https://www.fivb.com/wp-content/uploads/2024/03/FIVB_Beachvolley_Drill-Book_EN.pdf

Special Olympics Kansas. Volleyball Skills Assessment Test (VSAT) Details. https://soks.org/wp-content/uploads/2022/10/2018-Volleyball-Skills-Assessment-Test-VSAT.pdf
