---
id: coach-pedagogy-translation-self-coached
title: Translating Coach-Presence Pedagogy To A Self-Coached App
status: draft
stage: validation
type: research
authority: "Decision-relevant distillation of external vendor evidence on whether two coach-presence pedagogy techniques — an athlete-set per-session goal aligned to the focus (O22 / Technique A) and a forward-looking outcome promise (O23 / Technique B) — retain their behavioral effect when delivered self-administered by an app instead of by a coach. Frames the cue-ladder / within-skill-progression and pre-session-framing design space for M002 (D124). Not authoritative for the courtside-copy contract (that remains governed by `.cursor/rules/courtside-copy.mdc` and `docs/solutions/2026-05-10-drill-first-time-runnability-system.md`) nor for the metric question (that is `docs/research/single-tracked-metric-amateur-skill-apps.md`)."
summary: "Synthesis of three external vendor responses (all received 2026-06-02) on whether coach-presence pedagogy translates to a coachless app for adult recreational self-coached skill-sport athletes. Unanimous three-vendor verdict on both techniques: PARTIALLY TRANSLATES UNDER SPECIFIC FRAMINGS — neither fully translates, neither fully fails. The decisive shared mechanism finding is that interpersonal coach presence is an AMPLIFIER, not the sole active ingredient: the cognitive core of each technique (attentional narrowing + ownership for goals; response-expectancy/placebo priming for the promise) survives without a coach, but the social-accountability amplifier is largely lost and only partially rebuildable via recorded monitoring, partner visibility, and an end-of-session closure loop. Technique A translates ONLY as a user-authored, process/open goal (never SMART/outcome, never app-generated) with a session-end review; rigid quantitative goals actively backfire into self-criticism/avoidance in coachless amateurs. Technique B translates ONLY as a proximal, subjective, non-falsifiable affective cue ('you should feel more confident'); objective capability guarantees ('you'll be a better passer') risk durable trust damage, and the lab effect is likely inflated by publication bias so production lift is small. The pair compounds under OPTIMAL theory (autonomy + enhanced expectancy) only if kept extremely lean; vendors 1 and 2 say ship A first and A/B-test B, vendor 3 ships both as one conversational routine. No direct in-population A/B test exists — all three propose a factorial in-app field RCT (~240–500 users) as the decisive next study. Directly informs O22, O23, and the M002 cue-ladder / within-skill-progression layer (D124); flags tension with the ≤45-word READ-DO courtside-copy constraint."
last_updated: 2026-06-02
depends_on:
  - docs/research/briefs/README.md
  - docs/research/briefs/responses/2026-06-02-coach-pedagogy-translation-self-coached-vendor-1.md
  - docs/research/briefs/responses/2026-06-02-coach-pedagogy-translation-self-coached-vendor-2.md
  - docs/research/briefs/responses/2026-06-02-coach-pedagogy-translation-self-coached-vendor-3.md
related:
  - docs/research/single-tracked-metric-amateur-skill-apps.md
  - docs/research/prescriptive-default-bounded-flex.md
  - docs/research/solo-training-environments.md
  - docs/solutions/2026-05-10-drill-first-time-runnability-system.md
decision_refs:
  - O22
  - O23
  - D124
---

# Translating Coach-Presence Pedagogy To A Self-Coached App

## Agent Quick Scan

- **Bottom line.** Three independent external vendors, working from sport-psychology, motor-learning, and HCI literature, converge on the **same verdict for both techniques: "partially translates under specific framings."** Neither the athlete-set per-session goal (Technique A / `O22`) nor the forward-looking outcome promise (Technique B / `O23`) fully translates, and neither fully fails. Direction is **very strong** (three-vendor unanimity on the verdict and on the active framings); magnitude is **weak-to-moderate** (production effect sizes are likely small, and no direct in-population evidence exists).
- **The one mechanism finding that drives everything:** interpersonal coach presence is an **amplifier, not the sole active ingredient**. The *cognitive* core of each technique survives a coachless app; the *social-accountability* layer is largely lost and only partially rebuildable.
- **Technique A translates only in a narrow shape.** Ship a **user-authored, process/"open" goal** (e.g., "let's see how stable you can make your platform today"), never a SMART/outcome target, never an app-generated/pre-filled goal, and **always with an end-of-session closure** ("did you use the cue / how did it feel?"). The authoring friction is the active ingredient (vendor 3's Schimpf 2026, N=470: app-authored goals score higher on SMART quality but collapse ownership and two-week adherence 72.8% → 46.6%). Rigid quantitative goals in coachless amateurs reliably backfire into self-criticism, shame, and avoidance (vendor 2's Bondaronek tweet analysis; vendor 1's tracker-attrition + rumination evidence; vendor 3's Wegner ironic-monitoring).
- **Technique B translates only as a subjective, non-falsifiable, proximal cue.** "Today we're focusing on passing — by the end you should feel more confident with this skill" is defensible; "by the end you'll be a better passer" is **not** (durable trust damage on unmet objective promises). The active ingredient is **response-expectancy/placebo** directed at the performer (vendor 2's sharpest reframe: this is NOT the interpersonal Pygmalion coach-expectancy mechanism, which genuinely does not translate). Expectancy is real but **likely small in production** — vendor 3 surfaces the McKay/Bacelar/Parma reckoning that bias-adjusts the enhanced-expectancy effect toward ~zero, and the cleanest app analogue (Schienle & Unger PMR app, vendor 1) lifted completion but not felt benefit and raised dropout.
- **The pair compounds, but only if lean.** OPTIMAL theory (autonomy support + enhanced expectancy + external focus) predicts additive benefit, and a factorial study (Wulf/Chiviacowsky/Cardozo, N=64) shows it. But session-start friction is itself an abandonment driver. **Vendors 1 and 2: ship A first, A/B-test B.** **Vendor 3: ship both as one short conversational routine.** Reconciled posture: treat A+B as a single motivational frame, not two chores.
- **What it means for M002.** Both `O22` and `O23` should resolve toward **"ship, but only in the constrained framing above"** — not toward the raw coach-context wording in the BAB source material. The same evidence underwrites a **cue-ladder / within-skill-progression** layer: external-focus cues, self-controlled/reduced feedback, and bridged progression steps **can** be delivered coachlessly, but as *user-owned, process-framed, exploratory* surfaces, never as prescriptive pass/fail tests.
- **Live tension to manage, not override.** The recommended framings add words and a session-end surface, which pushes against the **≤45-word READ-DO courtside-copy constraint** and the quick-start loop (`P11` "recommend before you interrogate"). See [Decision implications](#decision-implications). The cue-ordering rule already in the copy contract (external-focus, gaze-first) is *aligned* with the evidence; the friction budget is where the conflict sits.
- **Scope.** Vendor 1, vendor 2, vendor 3 all folded in (all received 2026-06-02). 3-of-N state. Per-vendor evidence ladders + a Reconciliation table with a Repo-facing column + Synthesis-stability bars accommodate later responses without rewriting.

## Use This Note When

- resolving `O22` (per-session goal capture) or `O23` (forward-looking outcome promise) for the M002 Weekly Confidence Loop
- designing any pre-session framing surface, session-goal capture, or session-end reflection in the M002 loop
- scoping a **cue-ladder / within-skill "technique-how" depth** feature: deciding how external-focus cues, feedback scheduling, and progression scaffolding are delivered without a coach present
- writing or reviewing motivational / promise / goal copy and needing the evidence-backed boundary between defensible and trust-damaging framings

## Not For

- replacing the courtside-copy contract — the ≤45-word READ-DO rule, jargon gates, and cue-ordering invariants stay governed by `.cursor/rules/courtside-copy.mdc` and `docs/solutions/2026-05-10-drill-first-time-runnability-system.md`
- the single-tracked-metric question (weekly confidence as a *tracked metric* vs as a *promise/reflection surface*) — that is `docs/research/single-tracked-metric-amateur-skill-apps.md`
- changing any `D*` decision unilaterally; this note records evidence direction so `O22`/`O23` and the M002 plan start from the right default
- elite or coached populations — the verdicts are scoped to adult recreational, self-coached, 1–3 sessions/week skill-sport users

## Executive conclusion

Three independent vendor syntheses, arriving via overlapping but non-identical evidence bases, return the **same per-technique verdict** and the **same active framings**. None located a direct A/B test of these techniques in the target population; all three build from coached/lab mechanism evidence plus adjacent digital-health and self-tracking evidence, and all three explicitly flag population-fit as the dominant limitation.

**Per-technique verdicts (unanimous):**

| Technique | Verdict | Confidence (V1 / V2 / V3) |
|---|---|---|
| **A — athlete-set per-session goal** (`O22`) | Partially translates under specific framings | moderate / moderate / **high** |
| **B — forward-looking outcome promise** (`O23`) | Partially translates under specific framings | low-to-moderate / low-to-moderate / moderate |
| **A + B together** | Compound, not compete — but only if lean | ship-A-first, A/B-test-B (V1, V2) · ship-both-as-one-routine (V3) |

**The shared mechanism spine (all three vendors):**

1. **Coach presence is an amplifier, not the sole ingredient.** Goal-setting and expectancy effects do not collapse to zero when the coach disappears. The cognitive core survives; the interpersonal-accountability amplifier (the felt expectation of being asked later) is largely lost.
2. **For Technique A, the active ingredient is attentional narrowing + psychological ownership, not the coach's gaze.** Process goals move performance (vendor 2: Williamson process d=1.36 vs outcome d=0.09); self-authored goals plus a reflective loop improve learning without a real coaching loop (vendor 1: Zimmerman & Kitsantas; vendor 3: self-controlled-practice advantage). The **authoring friction is the mechanism** — delegating it to the app destroys ownership and adherence (vendor 3: Schimpf 2026, N=470).
3. **For Technique B, the active ingredient is response-expectancy/placebo, not interpersonal Pygmalion.** Vendor 2's cleanest contribution: the promise *to the performer* is a self-directed expectancy manipulation (OPTIMAL theory), distinct from the coach-expectancy/Pygmalion mechanism that works by changing the coach's behavior and genuinely does not translate. Lab work induces the effect with framing alone — a single sentence, a "success" criterion, a visual illusion, even an inert TMS-paired verbal promise that measurably raised corticospinal excitability (vendor 3). So the ingredient is app-portable in principle.
4. **But the surviving effects are small and fragile in production.** Goal-setting is smaller in adults and experienced performers (vendor 1: Williamson). Enhanced expectancy is contested and likely inflated by publication bias / underpowered designs — vendor 3 reports the bias-adjusted estimate dropping to ~zero (g≈0.1, CI near 0); vendor 1 and 2 echo the small-study concern. The one direct app analogue for B (Schienle & Unger PMR app) raised completion but not felt benefit and increased dropout.
5. **The failure modes are real and population-specific.** In *coachless amateurs*, rigid/quantitative/outcome goals and objective promises are not merely weak — they actively harm: monitoring-self-criticism loops, shame, deliberate non-logging to avoid negative feedback, rumination, attrition (vendor 1: Attig & Franke, Eikey; vendor 2: Bondaronek 58,881-tweet analysis; vendor 3: Wegner ironic processes + perfectionism/burnout). The coach's absent role is **emotional regulation after failure**; the app must design around its absence, not imitate the gaze.

**What translates vs what does not (the headline the brief asked for):**

- **Translates (cognitive core, coachlessly):** goal-setting's attentional-narrowing + ownership effect — *delivered as a user-authored process/open goal with a session-end closure*; expectancy/placebo priming — *delivered as a proximal, subjective, non-falsifiable affective cue*.
- **Does NOT translate (or actively harms):** the interpersonal accountability amplifier / coach gaze (only partially rebuildable via recorded monitoring + partner visibility + closure loop); the Pygmalion coach-expectancy mechanism (irrelevant to an app); rigid SMART/outcome goals and objective capability guarantees (these *backfire* in the coachless amateur context).

## Vendor 1 evidence ladder (2026-06-02)

Condensed from [`docs/research/briefs/responses/2026-06-02-coach-pedagogy-translation-self-coached-vendor-1.md`](./briefs/responses/2026-06-02-coach-pedagogy-translation-self-coached-vendor-1.md). Full citations and `citeturn…` tokens live in that file. **Stance:** most cautious of the three on copy; weights direct self-administered evidence over lab mechanism.

| Evidence layer | Technique | Representative anchor (sample / effect as given) | Why it applies |
|---|---|---|---|
| Coached-context goal effect | A | Williamson et al. 2022 meta-analysis, 27 studies / 100 effect sizes, overall g ≈ 0.50; **smaller in adults and experienced performers**; structured > loose self-set | The adult/self-set part of the curve is exactly where "just write a goal" looks least robust. |
| Mechanism (goal survives coachlessly) | A | Zimmerman & Kitsantas 1997, N=90 HS girls: process goals + self-evaluation beat outcome goals with no real coaching loop | Active ingredient = process cue narrowing attention + reflective loop, not goal declaration alone. |
| Digital translation | A | Zhou 2018 (N=64, personalized step goals net +960 steps/day over fixed); Nuijten 2022 (N=176, goal-setters +1.6–2.2 app-days/wave); Gordon 2019 MyFitnessPal (1.4M users — early self-monitoring patterns matter more than the goal artifact) | Self-administered goals work, but assigned/adaptive often beat fully self-set, and success depends on the monitoring loop, not the aspiration. |
| Failure modes | A | Attig & Franke (N=159 ex-tracker users — abandonment from lost motivation / useless data / anti-quantification); Eikey rumination synthesis | A compulsory blank goal field becomes recurring self-criticism. |
| Mechanism (expectancy is real) | B | Hurst 2020 placebo/nocebo review (32 studies / 1,513 participants, d ≈ 0.38); Bacelar 2024 enhanced-expectancy meta (48 studies / 56 ES, g ≈ 0.54 **but likely inflated**); McKay 2012 (N=31, lean expectancy line improved pressured accuracy) | Expectancy affects performance without a dense coaching relationship — "a sentence can be enough." |
| App translation (cautionary) | B | Schienle & Unger 2021, N=160: open-label placebo expectancy raised exercises completed (9.75 vs 8.15) but **no relaxation gain, higher dropout, some negative reactions** | App-mediated promises can lift completion while failing to improve felt value and risking trust. |
| Pair | A+B | Wulf, Chiviacowsky & Cardozo 2014, N=64 factorial: autonomy and expectancy each improve retention/transfer; combined best (combined accuracy 38.8 vs control 20.7) | Compound when the two surfaces target different needs (A = autonomy/attention, B = expectancy). |

**Vendor 1 recommendation:** ship Technique A only as a structured process-goal picker (constrained options, easy skip, end-of-session closure — "if you cannot afford the closure, the case for capture weakens materially"); ship Technique B only as a proximal/truthful/non-guaranteed cue (hedge "confidence" to "a clearer sense of what confident execution feels like"); treat the pair as one motivational frame. Decisive next study: factorial field RCT (A on/off × B on/off) in the shipped app, ~**400–500** participants, powered for small effects.

## Vendor 2 evidence ladder (2026-06-02)

Condensed from [`docs/research/briefs/responses/2026-06-02-coach-pedagogy-translation-self-coached-vendor-2.md`](./briefs/responses/2026-06-02-coach-pedagogy-translation-self-coached-vendor-2.md). **Stance:** middle of the spectrum; its distinctive contribution is the **mechanism reframe for Technique B**.

| Evidence layer | Technique | Representative anchor (sample / effect as given) | Why it applies |
|---|---|---|---|
| Goal-type decomposition | A | Williamson 2022 (27 studies, 1,764 participants): **process d=1.36 vs performance d=0.44 vs outcome d=0.09**; BYU 2024 review (22 studies, d=0.38) | How-you-execute goals move performance; outcome goals barely do. The single most important framing result for A. |
| Self-set vs assigned | A | Locke & Latham (participative ≈ assigned when difficulty held constant); skill-sport retention nulls (Corrêa 2006 N=44 volleyball; Corrêa 2009 N=100) | Self-set advantage is weaker than product intuition assumes; caution against over-claiming. |
| Unique effect net of accountability | A | Epton 2017 (141 papers, 384 ES, N=16,523): unique goal effect **d=0.34**; best when difficult, public, group-based, externally monitored | ~d≈0.3–0.4 survives without a coach, but the amplifiers are exactly what an app strips out. |
| Accountability rebuild | A | Harkin 2016 (138 studies, N=19,951): progress monitoring d⁺=0.40; **larger when reported/public and physically recorded** | Physical recording is what an app does natively — partial rebuild of the lost amplifier. |
| Shipped self-coaching data | A | Duolingo A/B: decoupling daily goal from streak raised D14 retention 3.3%; "Commit to My Goal" button beat "Continue"; user-set goal beat assigned | User-set goals + commitment language are retention-positive in self-administered settings. |
| Failure modes | A | Bondaronek 2025 (AI analysis of 58,881 tweets on top fitness apps): rigid, quantitative, algorithm-set goals → shame, avoidance (deliberate non-logging), demoralization | In self-coached amateurs a poorly framed goal becomes recurring self-criticism. |
| **Mechanism reframe** | B | Pygmalion (coach-expectancy) changes the *coach's* behavior → does NOT translate; the promise *to the performer* is response-expectancy (OPTIMAL, Wulf & Lewthwaite 2016) → DOES translate | Decision-relevant: the coach's embodied presence is not the carrier; framing alone induces it. |
| Expectancy by framing alone | B | Palmer 2016 (N=34, larger "success" circle, η²p=.14 retention); Pascua 2015 (N=52, η²p=.45 retention); Wulf 2012 (single opening line); Chauvel 2015 (visual illusion, no social agent); Crum & Langer 2007 (N=84 hotel staff, framing-only physiological change) | No coaching relationship required for the expectancy effect. |
| Boundary conditions | B | Non-replications (Ong 2015/2019; Ziv 2019; Cañal-Bruland 2016); boundary = "success with challenge"; expectancy alone may not survive overnight without an attentional manipulation | Empty/too-easy promises null the effect; hedge confidence accordingly. |
| Trust failure mode | B | Promise-breaking literature + Dhuliawala 2023 (a few confidently-wrong AI outputs damaged trust with slow recovery) | A falsifiable objective promise is dangerous; a subjective self-fulfilling one is safe. |
| Pair | A+B | OPTIMAL additivity; Pascua 2015 (expectancy + external focus additive); Rupprecht 2021 pre-performance-routine g=0.64 (not moderated by skill level) **but** a bowling field study found no increment from combining components | Theoretically coherent, incrementally unproven → A/B-test the addition of B. |

**Vendor 2 recommendation (staged):** Stage 1 ship process-framed user-set goal + end-of-session review (never rigid quantitative / streak punishment). Stage 2 A/B-test the subjective confidence promise (never a capability guarantee; calibrate session for "success with challenge"). Stage 3 substitute lost social accountability via recorded logs, optional partner visibility, end-of-session reflection. Decisive study: 3–4-arm RCT, ~**N=240** recreational adults, powered for d=0.30.

## Vendor 3 evidence ladder (2026-06-02)

Condensed from [`docs/research/briefs/responses/2026-06-02-coach-pedagogy-translation-self-coached-vendor-3.md`](./briefs/responses/2026-06-02-coach-pedagogy-translation-self-coached-vendor-3.md). **Stance:** most bullish and most citation-dense; deepest on mechanism (neurophysiology + Wegner ironic processes + the OPTIMAL "methodological crisis"). The original carried 14 inline base64 effect-size images, replaced with placeholders in the verbatim file (mechanical exception noted there).

| Evidence layer | Technique | Representative anchor (sample / effect as given) | Why it applies |
|---|---|---|---|
| Autonomy advantage | A | Shokri 2023 (recreational male soccer; self-controlled > coach-controlled goals on retention/transfer after 72h); SC-vs-PR feedback meta (29 studies: learner autonomy facilitates consolidation) | Autonomy in goal-setting yields superior retention — first sign the cognitive mechanism survives coachlessly. |
| **Ownership penalty (net-new, decisive)** | A | Schimpf 2026 preregistered, **N=470**: LLM-authored goals score **higher** on SMART quality but **lower** ownership/commitment and **collapse adherence (72.8% → 46.6%)**; ownership mediates the drop | The UI friction of authoring is the active ingredient, not a barrier to optimize away. Do **not** auto-populate goals. |
| Ironic-monitoring threat | A | Wegner ironic processes: under cognitive load the operating process fails while the monitoring process keeps scanning for failure; no coach to interrupt the spiral | Rigid specific goals hyper-activate failure-monitoring → self-criticism / choking in coachless amateurs. |
| Open-goal remedy | A | Swann 2025 (12 expert practitioners, ~13.4 yrs): open goals (exploratory, graded, no absolute failure threshold) preferred for novelty/amateur development; range-goal evidence | The recommended framing: exploratory "let's see how [adjective] you can make your [skill] feel" / range goals. |
| Micro-goals | A | Gouveia 2026 (27-day field study, *Mikro* smartwatch app): situated micro-goals beat rigid daily goals, reduce long-term-failure burden | Per-session goal must be small, immediate, session-bound. |
| **Expectancy as neurophysiological placebo** | B | TMS study: inert TENS + verbal promise raised force, lowered perceived fatigue, and **measurably increased corticospinal excitability** (MEP amplitude up, silent period down) | The promise structurally primes the motor cortex — translates via any credible delivery medium, no social agent needed. |
| **Methodological reckoning (net-new)** | B | Bacelar 2022 (g≈0.54 retention) vs McKay/Parma re-analysis: bias-adjusted enhanced-expectancy + self-controlled effect drops to **g≈0.1 (CI ~0.05–0.18)**, statistically near zero; only 21% of 166 OPTIMAL experiments measured motivation, 23% of those found effects | Downgrades B to moderate confidence; the conscious-motivation pathway is statistically tenuous. |
| App translation + trust | B | HCI: motivational/affective framing builds alliance; objective/deterministic promises trigger expectancy violation + algorithmic aversion → credibility loss → placebo stops working | Affective unfalsifiable promise is safe; objective guarantee is a trust gamble. |
| Pair | A+B | OPTIMAL three pillars (autonomy = A; enhanced expectancy = B; external focus = drill constraints) consistently additive | Ship as one conversational pairing: set open goal → app gives affective promise → session-end reflection closes the loop. |

**Vendor 3 recommendation:** Technique A as user-authored **Open Goals / micro-goals** (UI must require typing/assembly; never auto-populate a SMART goal); Technique B as **affective / state-based / effort-linked** promises ("feel more confident"), never objective ("better passer"); ship both as a paired pre-session routine with an end-of-session reflection as the accountability substitute. Decisive study: 3-arm 6-week in-the-wild RCT (control / SMART+objective / open+affective) with EMA + blinded video skill grading.

## Reconciliation

Three vendors, one verdict per technique, three different routes to it. The reconciliation matters because the product call needs to be robust across all three.

### Where the vendors agree (high-confidence takeaways)

- **Both techniques "partially translate under specific framings."** Unanimous verdict and unanimous direction.
- **Coach presence is an amplifier, not the sole ingredient.** The cognitive core survives; the accountability layer is the part that does not, and it is only partially rebuildable.
- **Technique A must be process/open and user-authored, with a session-end closure.** All three reject the blank "write your goal" field and reject rigid SMART/outcome goals for this population; all three want the reflective loop.
- **Technique B must be subjective/affective and non-falsifiable; never an objective capability guarantee.** All three independently land on "you should feel more confident" as safe and "you'll be a better passer" as dangerous.
- **The pair compounds rather than competes — if lean.** All three cite OPTIMAL additivity; the only disagreement is sequencing (see below).
- **No direct in-population evidence exists; a factorial in-app field RCT is the decisive next study.** All three propose essentially the same design (A×B arms, ~240–500 users, powered for small effects, EMA + retention + skill outcomes).

### Net-new contributions (one per vendor, not previously surfaced)

- **Vendor 2 — the Pygmalion vs response-expectancy split.** The single most decision-relevant reframe: the stakeholder intuition that "coach presence carries the promise" conflates two mechanisms. Pygmalion (interpersonal, changes the coach) does not translate; response-expectancy (self-directed) does. This is why B is more app-portable than the brief's "hollow ritual" worry assumed.
- **Vendor 3 — the ownership penalty and the methodological reckoning.** Schimpf 2026 (N=470) makes "authoring friction is the active ingredient" an empirical claim, not a hunch, and directly forbids app-generated goals. Separately, the bias-adjusted near-zero enhanced-expectancy estimate is the strongest reason to keep B small and A/B-gated.
- **Vendor 1 — the cleanest cautionary app analogue.** Schienle & Unger (PMR app) is the closest thing to a direct test: an app-mediated expectancy intervention raised completion but not felt benefit and *increased* dropout with some negative reactions. It is the empirical anchor for "overclaiming is the failure mode."

### Where the vendors differ

*Vendor-N convention: add one column per new vendor to the left of the Repo-facing column; update the rightmost cell only when the new vendor materially shifts the reconciled take.*

| Dimension | Vendor 1 | Vendor 2 | Vendor 3 | Repo-facing reconciliation |
|---|---|---|---|---|
| Confidence on Technique A | moderate | moderate | **high** | Treat as **moderate-to-high**. Two of three say moderate; vendor 3's "high" rests on the strong Schimpf ownership result. Ship A in constrained form; the disagreement is about confidence, not direction. |
| Confidence on Technique B | low-to-moderate | low-to-moderate | moderate | Reconciled **low-to-moderate**. Keep B behind an A/B gate; the bias-adjusted near-zero estimate (vendor 3) and the cautionary app analogue (vendor 1) dominate. |
| Pair sequencing | ship A first, A/B-test B | ship A first, A/B-test B | ship both as one routine | **Default to ship-A-first, A/B-test-B** (2 of 3, and the more conservative call given B's weak production evidence). Vendor 3's "one conversational routine" is the *target UI shape if B passes its A/B gate* — adopt the lean conversational framing, not the un-gated launch. |
| Why B works | expectancy "a sentence can be enough" | response-expectancy ≠ Pygmalion | neurophysiological placebo (corticospinal) | All three are the same mechanism at different resolutions. Record vendor 2's Pygmalion split as the repo-facing framing; vendor 3's neurophysiology is supporting depth. |
| Strength of expectancy effect | real, small-study concerns | real, contested, boundary-conditioned | **likely near-zero after bias adjustment** | Adopt the most conservative read: assume small/uncertain production lift for B. This is *why* B is A/B-gated, not default-shipped. |
| Goal framing language | "structured process-goal picker" | "process goal from a constrained menu" | "user-authored Open Goal / micro-goal, must type/assemble" | Reconcile to: **user-authored, process/open, low-friction but not auto-populated**. Vendor 3's "must author it" + vendors 1/2's "constrained menu to reduce blank-page friction" combine as: constrained *scaffold* the user *completes/edits*, not a pre-filled default. |
| Decisive study N | ~400–500 | ~240 | 3-arm 6-week, EMA + blinded video | Converge on a factorial/multi-arm in-app field RCT; size for small effects (≥~240, ideally ~400+). Out of current scope; record as the highest-leverage validation move. |

### What the reconciliation does not change

- No `D*` decision is modified by this note. `O22` and `O23` remain **open**; this note supplies the evidence-backed default for their resolution (ship-in-constrained-framing for A; ship-A/B-gated for B), not a unilateral close.
- No code lands from this distillation alone. The courtside-copy contract and quick-start loop are unchanged; any goal/promise surface must reconcile with them (see Decision implications).
- The synthesis does not manufacture a precise effect size. The honest read is: **direction is robust (3/3); production magnitude is small and unmeasured in-population.**

## Synthesis stability: what would change this

Pre-registered so later vendor responses or new evidence can be scored against an explicit bar rather than re-litigating the whole synthesis.

### Bar 1 — Would flip a verdict to "does not translate" / "translates fully"
- **To "does not translate":** a well-powered in-population field RCT showing the constrained-framing version of A *or* B produces **no behavioral lift and net friction** (lower completion/retention) vs a quick-start control. Nothing in current evidence approaches this; the closest (Schienle & Unger) is mixed, not null-with-harm.
- **To "translates fully":** an in-population RCT showing the technique works **across framings** (including objective/SMART) with no self-criticism/trust cost. Strongly contradicted by present evidence (rigid framings backfire).

### Bar 2 — Would shift framing/confidence without flipping the verdict
- A new vendor or study that **recenters confidence** (e.g., a direct adult-rec-skill-sport replication of the enhanced-expectancy effect at non-trivial size) → update the confidence cell and the B A/B-gate posture; keep the verdict.
- New **evidence types** (e.g., a shipped skill-sport-app post-mortem directly testing one technique; a head-to-head copy A/B with published results) → add an evidence-ladder row, re-score the mechanism spine.

### Bar 3 — Would narrow/complicate scope
- Evidence that a **subcohort** (e.g., high-self-criticism users, or users with sports-psych familiarity) responds oppositely → add a subcohort note; the constrained-framing default already hedges toward the cautious case.

### Bar 4 — Would prompt internal measurement rather than more literature
- Any response reinforcing that the literature has hit its ceiling on the *self-administered translation* question (all three already land here). The next quality-increasing move is the **in-app factorial RCT** the vendors converge on — out of current founder-use-mode scope, but the canonical validation design if M002 ships A and/or B.

### Where this synthesis is fragile (named, not hidden)
1. **No direct in-population evidence.** Every verdict is an inference from coached/lab + adjacent-digital evidence. One good field RCT would outweigh the stack.
2. **Technique B's effect may be near zero in production.** Vendor 3's bias-adjusted estimate plus the mixed app analogue mean B could be friction-for-nothing if shipped un-gated.
3. **Population extrapolation.** The strongest anchors are students/novices on lab tasks, fitness/health-behavior apps, or coached athletes — each one step from adult rec self-coached skill-sport.

## Decision implications

### `O22` — per-session goal capture (Technique A)
- **Default toward "ship, but only as a user-authored process/open goal with a session-end closure."** Not a blank free-text field; not a SMART/outcome target; not an app-generated/pre-filled goal. A constrained scaffold the user *completes or edits* (preserving authoring friction = ownership), anchored to the focus chip, easy to skip.
- **The closure loop is load-bearing, not optional.** All three vendors tie the goal's effect to a session-end reflection ("did you use the cue / how did it feel?"). Per vendor 1, without the closure the case for start-of-session capture weakens materially. This maps cleanly onto the M002 weekly-confidence/reflection surface (`D124`) — the goal should be *recalled and reflected against* at review, satisfying the vision's "investment" beat that `O23` notes is currently only served after-the-fact.
- **Timing.** The evidence favors a *low-friction* placement. Given `P11` ("recommend before you interrogate") and the M002 "keep the quick-start loop intact" default, a selection-from-list anchored to the focus chip (vendor 1/2's constrained menu) reconciles the ownership requirement with the friction budget better than a typed-at-start blank field.

### `O23` — forward-looking outcome promise (Technique B)
- **Default toward "ship only A/B-gated, and only as a proximal, subjective, non-falsifiable affective cue."** Defensible: "Today we're focusing on passing — by the end you should feel more confident with this skill" (matches the BAB Essay 2 wording the brief cited, which is *the safe form*). Forbidden: any objective/capability guarantee ("you'll be a better passer"), and any repeated promise that can be disconfirmed.
- **Hold confidence low.** The production effect may be small-to-zero; do not default-ship. Treat B as the *increment to test on top of A*, not a baseline surface.
- **The accountability substitute is the design move, not a faux coach voice.** Recorded session logs, optional training-partner visibility, and the end-of-session reflection are how the lost "someone will ask me later" function is partially rebuilt (vendor 2's Harkin evidence; all three on closure). This aligns with the repo's pair-native posture.

### Cue-ladder / within-skill "technique-how" progression (the live M002 direction)
This is where the brief's two techniques generalize. The same evidence underwrites a within-skill progression / cue-ladder layer, **with the same constraints**:
- **(a) Can external-focus cueing, feedback scheduling, and progression scaffolding be delivered without a coach?** Yes — conditionally. External-focus cues are exactly the *content* of a process/open goal ("let's see how stable you can make your platform" is an external-focus open goal). Self-controlled / reduced / summary feedback **is** the autonomy-supportive mechanism the vendors say survives coachlessly (vendor 3's self-controlled-feedback meta; OPTIMAL autonomy pillar). Progression scaffolding survives as *micro-goals / range goals / bridged steps* — small, session-bound, exploratory. What does **not** translate is prescriptive, pass/fail, coach-graded correction; delivered coachlessly it triggers the monitoring-self-criticism loop.
- **(b) What this means for the cue-ladder feature in M002:** build it as a **user-owned, process-framed, exploratory** ladder — the user selects/edits the cue and the next bridged step; the app frames steps as "try this / see how it feels," not "you must hit X to pass." Pair the cue with an end-of-session reflection that closes the loop on the chosen cue. Keep any forward-looking "what you'll get" copy subjective and proximal, and A/B-gate it. Deliver feedback on a *self-controlled / reduced* schedule, not after every rep.

### Tension with existing canon (flag, do not silently override)
- **≤45-word READ-DO courtside-copy constraint** (`.cursor/rules/courtside-copy.mdc` rule 14; `docs/solutions/2026-05-10-drill-first-time-runnability-system.md`). The recommended framings add words (an open-goal prompt, an affective promise) and a session-end surface. The courtside RunScreen is **DO-CONFIRM** (≤6 fields, load-bearing triple) — these pedagogy surfaces belong on **pre-run (TransitionScreen, READ-DO)** and **post-run (review/reflection)** surfaces, not on the active-run screen. Resolve by placing goal-capture and the promise on pre-/post-run surfaces and keeping the run screen untouched; do not let pedagogy copy bloat the courtside triple.
- **Alignment (not just tension):** the copy contract's cue-ordering rule (rule 12: one-cue default, **external focus**, gaze-first, doer-POV) is *exactly* what this evidence endorses for the cue content. The cue-ladder feature should inherit that rule rather than invent a parallel one.
- **`P11` / quick-start loop / `D130` founder-use mode.** Any added pre-session surface competes with the recommend-before-interrogate default and the "keep the quick-start loop intact" M002 constraint. The friction budget is the real constraint; the evidence says the *closure loop* earns its keep more than the *start-of-session promise*, which argues for sequencing A (with closure) ahead of B.

## Gaps

- **No direct in-population A/B test** of neutral vs process-goal vs SMART-goal, or neutral vs affective-promise vs capability-guarantee, in a self-coached adult recreational skill-sport app. This is the single largest gap; all three vendors name it and propose essentially the same factorial field RCT (≥~240, ideally ~400+ users, EMA + retention + blinded skill outcomes).
- **Technique B's true production effect size** is unknown and possibly near zero after bias adjustment. Whether a subjective affective promise produces *any* durable lift in this context is unresolved.
- **The pair increment** (does adding B to A beat A alone?) is unproven; one field study found no increment from combining pre-performance-routine components.
- **Population fit** of every anchor (students/novices on lab tasks, fitness/health-behavior apps, coached athletes) — none is adult rec self-coached skill-sport at 1–3 sessions/week. The decisive evidence would be internal, on the product's own cohort, once a goal/promise/cue-ladder surface ships in M002.

## Scope and provenance

- **State:** 3-of-N vendors folded in (vendor 1, vendor 2, vendor 3, all received 2026-06-02). Usable standalone at this state.
- **How vendor 4+ folds in without rewriting:** file the verbatim response under `docs/research/briefs/responses/<date>-coach-pedagogy-translation-self-coached-vendor-4.md`; add a `## Vendor 4 evidence ladder` section; add a `Vendor 4` column to the "Where the vendors differ" table (left of Repo-facing); score against the Synthesis-stability bars; bump `last_updated` and `depends_on`.
- **Verbatim sources** (authoritative record of what each vendor said; this note is the repo-facing distillation — if they drift, the verbatim files are correct):
  - Vendor 1: [`docs/research/briefs/responses/2026-06-02-coach-pedagogy-translation-self-coached-vendor-1.md`](./briefs/responses/2026-06-02-coach-pedagogy-translation-self-coached-vendor-1.md)
  - Vendor 2: [`docs/research/briefs/responses/2026-06-02-coach-pedagogy-translation-self-coached-vendor-2.md`](./briefs/responses/2026-06-02-coach-pedagogy-translation-self-coached-vendor-2.md)
  - Vendor 3: [`docs/research/briefs/responses/2026-06-02-coach-pedagogy-translation-self-coached-vendor-3.md`](./briefs/responses/2026-06-02-coach-pedagogy-translation-self-coached-vendor-3.md)
- **Vendor-number assignment:** 1/2/3 follow file order, which also tracks a mild spectrum from **most cautious → most bullish** (vendor 1 most conservative on copy; vendor 3 highest-confidence and ships the most) and from **leanest → most citation-dense** (vendor 3 is the most academic, carrying base64 effect-size images and the deepest OPTIMAL methodological critique). The verdicts themselves are identical across vendors.
- **Citation-handling notes:** vendor 1's source carries inline `citeturn…` tool-citation tokens (preserved verbatim). Vendor 2's source has plain numbered/DOI citations (no mechanical exception). Vendor 3's source carried 14 inline base64 effect-size/sample-size images, replaced with bracketed placeholder reference-definitions to avoid storing binary blobs (inline `![][imageN]` markers left in place; no prose altered) — exception noted in that file's Status bullet.
- **Revision-by-replacement** (`docs/research/briefs/README.md`) does not apply to this note — it is internal curated research; edit in place as evidence accumulates.
