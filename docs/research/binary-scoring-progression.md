---
id: binary-scoring-progression
title: Binary Skill Scoring For Drill Progression
status: active
stage: validation
type: research
authority: minimum scored-contact thresholds, self-scoring bias guardrails, and product policy shape for the binary Good / Not Good progression gate
summary: "Curated evidence base for the binary-score progression gate: how many attempts support a trustworthy 'true rate ≥ 70%' statement, expected self-scoring bias direction and magnitude, and the operational policy shape that falls out under cost asymmetry."
last_updated: 2026-04-16
depends_on:
  - docs/decisions.md
  - docs/specs/m001-adaptation-rules.md
  - docs/research/beach-training-resources.md
related:
  - docs/research/README.md
---

# Binary Skill Scoring For Drill Progression

## Use This Note When

- deciding how many scored contacts are required before a progression/hold/deload outcome should trust the `Good` / `Not Good` signal
- deciding whether to raise the observed pass-rate threshold, apply a bias correction, or require multi-window confirmation when the metric is athlete self-scored
- comparing the product's progression gate to governing-body or consumer-product analogues
- sharpening `D80` (the 70% latent target) or closing out `O12` (minimum-attempt + self-score agreement question)

## Not For

- replacing `docs/specs/m001-adaptation-rules.md` as the implementation-ready adaptation spec
- replacing `docs/decisions.md` as the source of truth for decided policy
- broad training or drill-content research — use `docs/research/beach-training-resources.md`
- deriving injury-risk or ACWR claims — explicitly ruled out elsewhere

## Executive conclusion

A binary `Good` / `Not Good` drill metric is usable for progression, but only as a *noisy proxy*, and a raw observed 70% rate should **not** be the gate. Four takeaways from the literature:

1. Clearly defined binary sport coding is highly reliable when done by **trained observers or validated devices** (kappa/ICC in the good-to-excellent range across volleyball, basketball, wheelchair basketball, tennis, shooting, and archery studies). Device-based analogues show the outcome itself is usually scoreable; the open problem is the self-rater, not the task.
2. **Self-calibration is reliably directional**, not symmetric: athletes are roughly accurate on easy/objective tasks and become **generous/overconfident as task difficulty rises** (golf putting vs. chipping, tennis serve targets, dart-throw distance estimation, collegiate free-throw prediction, school-age basketball dribbling, volleyball serve judgments of learning). Positive bias is much more common than negative bias, and it clusters on the borderline attempts that matter most for a gate.
3. The statistically meaningful question is **not** "did the athlete hit 70% this window?" but **"given the corrected data, is P(true rate ≥ 70%) at least 80%?"** A raw 70% observed at the gate is barely better than a coin flip on the question we actually care about (posterior ≈ 0.49 at 35/50 and still ≈ 0.49 at 70/100). Raising `N` tightens the interval **around** 70%; it never turns observed-70% into evidence of **above**-70%.
4. Treating false progression as materially more costly than false hold (injury-sensitive drill families especially) gives a principled reason to demand a **0.80 posterior** at the gate. That corresponds to roughly a 4:1 cost asymmetry between false progression and false hold — a defensible default for training software that deliberately sits inside general-wellness framing and takes load seriously.

### Operational policy shape

- Fewer than **50** scored contacts in the same drill-variant + success-rule + fatigue context: **no progression signal**; default to `hold`.
- **50** scored contacts is the clean operational minimum for a gate. Use a Jeffreys beta-binomial posterior: progress only when `P(p_corrected ≥ 0.70 | x_corrected, n) ≥ 0.80`.
- With personalized bias correction available, the gate is **≥ 38 corrected `Good` reps out of 50** (boundary ≈ 76% corrected).
- Without personalized bias correction, the temporary pre-calibration proxy is **41 raw `Good` reps out of 50** for general drill families and **42 / 50** for injury-sensitive families.
- Never gate on a raw `35/50` rule. It is consistent with a true rate anywhere from the mid-50s through the low-80s and leaves posterior readiness near 0.49.
- Apply **hysteresis**: a near-miss gate session defaults to `hold`, not `deload`. Deload requires stronger evidence (e.g., two consecutive corrected windows below 60%, or an independent safety/fatigue signal).

This is materially more defensible than "70% once, at any N" and stays compatible with the federation-aligned 70% concept by treating 70% as the **latent target** while gating on corrected evidence.

## What the binomial math actually says

The sampling model is binomial. At an observed 70% rate, 95% intervals (Wilson, Agresti-Coull, and Bayesian Jeffreys) collapse to roughly:

| Attempts | Observed | Wilson 95% | Agresti–Coull 95% | Jeffreys 95% |
|---|---|---|---|---|
| 10 | 7/10 | 0.397–0.892 | 0.392–0.897 | 0.394–0.907 |
| 20 | 14/20 | 0.481–0.855 | 0.479–0.857 | 0.483–0.864 |
| 50 | 35/50 | 0.562–0.809 | 0.562–0.810 | 0.564–0.813 |
| 100 | 70/100 | 0.604–0.781 | 0.604–0.781 | 0.605–0.783 |

Two things fall out of this.

First, at 10 and 20 attempts the uncertainty is enormous; even at 50 attempts a recorded 70% is still consistent with the mid-50s through low-80s. Short-session feedback is fine. Short-session *gating* is not.

Second — and this is the decisive point — when the observed rate equals the threshold, the posterior probability that the **true** rate exceeds 70% never leaves coin-flip territory:

| Observation | P(true p ≥ 0.70 \| x, n), Jeffreys prior |
|---|---|
| 7/10 | ≈ 0.481 |
| 14/20 | ≈ 0.487 |
| 35/50 | ≈ 0.492 |
| 70/100 | ≈ 0.494 |

Shipping "progress when session ≥ 70%" therefore never becomes a trustworthy ready/not-ready decision. Larger `N` shrinks the interval *around* 70%; it does not make observed-70% convincing evidence of being *above* 70%.

The right question is: given the (bias-corrected) data, what is the posterior probability that the athlete's true rate is at least 70%? Requiring that posterior to be at least 0.80 gives the following minimum corrected success counts:

| Attempts | Min corrected successes for `P(p ≥ 0.70) ≥ 0.80` | Boundary rate | False-progress rate if true p = 0.60 | Trigger rate if true p = 0.80 |
|---|---|---|---|---|
| 20 | 16 / 20 | 0.800 | 0.051 | 0.630 |
| 30 | 24 / 30 | 0.800 | 0.017 | 0.607 |
| 40 | 31 / 40 | 0.775 | 0.016 | 0.732 |
| 50 | 38 / 50 | 0.760 | 0.013 | 0.814 |

Fifty is the first row where the gate is simultaneously conservative against false progression (~1.3% trigger rate against a true-60% athlete) **and** usable for genuinely ready athletes (~81% trigger rate against a true-80% athlete). Twenty-attempt gates can only be made safe by demanding 80%, which then becomes much less usable in practice. **Fifteen-to-twenty attempts is fine for coaching feedback. It is not fine for progression control.**

The same math shows why a naked "60 / 70 / 80" threshold menu is misleading if `N` is not specified. At 50 attempts a raw 60% gate lets a true-60% athlete clear it ~56% of the time; a raw 70% gate still lets a true-60% athlete clear it ~9.6% of the time and says nothing decisive about being above 70%; a raw 80% gate is very safe but overly punitive on athletes who are truly in the high-70s without bias correction. The coherent compromise is: **70% as the latent target, ~76% corrected (38/50) as the progression boundary, ~82% raw (41/50) as the pre-calibration proxy.**

### Cost asymmetry and the 0.80 threshold

An expected-loss rule says to progress only when posterior readiness `q` exceeds

```
q* = C_FP / (C_FP + C_FN)
```

where `C_FP` is the cost of progressing when not ready and `C_FN` is the cost of holding when ready. For a self-coached beach app that sits inside a general-wellness framing and takes load seriously, a roughly 4× asymmetry (`C_FP ≈ 4·C_FN`) is defensible: a false progression risks overload, injury, and trust; a false hold costs one additional working session at the current level. That gives `q* ≈ 0.80`, which is exactly why the 80% posterior rule is the right gate for this product. The asymmetry also implies **hysteresis** on the downside: near-miss sessions should hold, not deload, and deload should require stronger evidence than progression denial.

## What self-scoring bias looks like in the literature

The direct literature on attempt-level binary self-scoring by self-coached amateurs is thinner than it should be. Two useful buckets exist.

**Reliability of the outcome itself, when scored by an observer or device.** Basketball's Basketball Jump Shooting Accuracy Test showed near-perfect intra-rater agreement (κ = 0.85) and substantial inter-rater agreement (κ = 0.70). In shooting, TargetScan ISSF Pistol & Rifle posted ICC = 0.999 against official scores for air pistol and ICC = 0.998 for air rifle. Archery scoring-system validation produced scores not significantly different from judges'. Elite volleyball coding, elite wheelchair basketball coding, elite tennis coding, and basketball possession coding all cluster at κ ≈ 0.83–0.98 inter-rater and similar intra-rater ranges. The outcome is usually scoreable; the *self-rater* is the problem.

**Calibration of athletes' self-judgments.** Much less comforting.

- *Golf.* Golfers were roughly well calibrated on an easier putting task but positively biased on harder chipping: estimated success 48.5% vs. actual 41.3% on trial 1, and 49.4% vs. 41.8% on trial 2 — a generosity shift of ~7–8 percentage points. The same golfers were overconfident on rules knowledge by roughly 14 points (80.8% confidence vs. 66.9% correct).
- *Tennis.* Players were well calibrated on an easier serve-target task but overconfident on a smaller, harder target; expertise only partly helped on the difficult version.
- *Basketball (school-based dribbling).* Students in both grades overestimated performance; mean calibration bias ≈ +5.3 cones (5th grade) and +3.0 cones (6th grade).
- *Volleyball serve judgments of learning.* The majority of students overestimated their abilities.
- *Dart-throwing perceptual-motor task.* Participants were poorly calibrated at all three throwing distances; their estimates had little relationship to actual landing error.
- *Recreational basketball.* Players were mostly overconfident about shooting performance.
- *Free throws (PLOS One).* Collegiate shooters were significantly more biased than recreational shooters toward predicting their own shots as "in," with a large effect size; they were worse than chance at predicting their own misses (correctly identifying only 41%).

The distribution is not "some generous, some conservative, it all cancels out." The defensible read is: **accurate on easy/objective tasks, generous on hard/ambiguous tasks, with positive bias more common than negative bias.** That is exactly the wrong environment for a raw 70% self-score gate, because the bias is not noise — it is directional drift that gets worse precisely when the task becomes more demanding.

Recency and fatigue add a second confound: social-cognition reviews note prior performances shape later evaluations, and a basketball mental-fatigue study showed significantly fewer makes under fatigue. Scoring a drill late in a fatiguing session risks both a dip in actual success *and* a drift in the grading threshold.

### Magnitude estimate (product prior, not a volleyball constant)

No published dataset cleanly states "amateur volleyball players over-credit themselves by X points on good/not-good passing." The operational prior (to shrink personal calibration estimates toward) is:

- **Clear outcomes** (made/missed, in/out): bias modest — low-to-mid single digits on disagreement.
- **Borderline evaluative outcomes** (pass quality): bias more likely to matter, direction favorable to athlete. **Generic prior: +5 percentage points** inflation on self-scored binary rates.
- **Injury-sensitive drill families** (serve volume, jumping volume, high-load attack repetitions): use a more conservative **+8 percentage points** prior.
- Larger errors possible on especially ambiguous drills or late in fatiguing sessions.

Treat these as inferred product priors, not measured constants. They are used explicitly to shrink empirical calibration estimates rather than to swap in a fixed offset.

## Bias correction that fits a 10-second workflow

Three patterns from the self-assessment literature outside sport are useful:

- **Feedback improves self-assessment accuracy** on average; a recent meta-analysis found a positive overall effect of feedback on self-assessment accuracy of about `g = 0.34`.
- **Anchoring vignettes** are a standard way to correct reporting-style bias by having raters score fixed exemplars and then adjusting self-ratings relative to those exemplars.
- **Forced-choice formats** are widely used to reduce response-style bias compared with unconstrained self-report.

Translated into a beach-courtside-sized workflow, that gives three layers:

**1. Score-time structure (every rep).**
- Do **not** ask "Was that good?"
- Ask a forced, criterion-tied question: **"Did this rep meet the drill's observable success rule?"**
- Add one hard instruction: **"If you are unsure, score Not Good."**
- The success rule must be one sentence tied to the set-window marker geometry in `docs/specs/m001-adaptation-rules.md`.

**2. Personal calibration anchor (periodic, ~20 attempts).**
At onboarding, and then every few weeks or every few completed gate windows, run a 20-attempt anchor block in which the athlete self-scores and an expert / coach / trusted video audit also scores the same attempts. Estimate generosity bias as

```
b_hat = self-score rate − expert-score rate
```

Do **not** use the raw anchor difference directly; shrink it toward the conservative default (+5 pp generic, +8 pp injury-sensitive) and update it with an exponentially weighted moving average across anchor blocks. The corrected session rate is

```
p_corr = p_raw − b_hat
```

The Bayesian posterior gate then runs on `x_corrected = round(p_corr · n)`. This is the sports-simplified analogue of the anchoring-vignettes pattern.

**3. 10-second borderline review (only near the boundary).**
When a session's raw count lands inside a boundary zone (by default 36–42 `Good` out of 50), trigger a fast review:

1. Re-display the one-sentence success rule.
2. Ask: **"How many of the reps you marked Good were borderline?"**
3. Offer `0 / 1 / 2 / 3+`.
4. Subtract that count from the raw success count before computing the posterior.

If video is available, replace the question with two fast expert-scored anchor clips (one clear `Good`, one clear `Not Good`) followed by the same borderline-count question. The goal is a small, systematic anti-generosity correction, not a psychometric exercise.

## Do binary skill proxies track real outcomes?

Yes, if the proxy is defined well and sampled long enough. Elite men's volleyball research shows reception outcome predicts attack outcome, and high-quality receptions predict both organized attacking options and side-out probability. The standardized basketball shooting task (60 free throws + timed segment) correlates at r ≈ 0.81 with both expert rank and live-play shooting percentage. Volleyball Canada's development matrix uses 70% success rate as a progression threshold. So the underlying concept is legitimate; the product question is not "is a binary proxy meaningful?" but "how do we make it statistically and behaviorally safe?"

## What comparable products and systems do

The product pattern splits two ways.

**Products that automate measurement.** HomeCourt (basketball) markets instant shot capture, analysis, and personalized workouts based on "true skill level" — the right instinct when the app can observe outcomes itself. Target-sport validation studies (TargetScan ISSF, archery scoring tech) do the same work: validate automated scoring against official scores or judges before publishing progression logic.

**Products that log manually and avoid hard progression gates.** Basketball trackers (Make Or Miss, Hoops), golf stats apps (TheGrint), and archery apps (ArcherySuccess, MyTargets) focus on logging outcomes, streaks, round history, and long-run trends. Their product decision is to emphasize trend dashboards and benchmarking over time, not transparent progression statistics.

Governing-body and adjacent examples that *do* gate tend to use large samples or repeated confirmation:

- **Dr. Dish "One Count Challenge"**: 70 makes out of 100 catch-and-shoot threes — same metric shape, same 70% neighborhood, enforced over `N = 100`.
- **USGA World Handicap System (golf)**: 54 holes before issuing a Handicap Index; stabilizes on best 8 of last 20 score differentials.
- **Arccos Golf**: minimum-round rules (e.g., ≥ 8 rounds for year-end comparisons; separate improvement tables for 10-round vs. 20-round samples).
- **Zenniz (tennis)**: monitor serve reliability, raise speed only while keeping reliability > 70%.

Across the consumer-sport materials reviewed, no published Wilson/Bayesian minimum-attempt rule or explicit asymmetric-cost progression logic was disclosed. The de facto market pattern is **trend dashboards yes, transparent progression statistics no**. That absence is an opportunity: we can ship a statistically auditable, bias-aware, cost-asymmetric rule most consumer sports products don't bother to write down.

## Recommended operating rule

**Minimum attempts.**
Use **50 attempts** as the minimum evidence window before a drill can trigger progression. Those 50 attempts must come from the same drill difficulty, same success rule, and a stable fatigue context. If 50 straight reps would change the task because of fatigue, split into two 25-attempt blocks or two consecutive sessions with unchanged settings. Use smaller blocks only for coaching feedback, never for progression.

**Threshold.**
Keep 70% as the **latent corrected readiness threshold** (`D80`). Progress only when

```
P(p_true_corrected ≥ 0.70 | x_corrected, n) ≥ 0.80
```

At 50 attempts: **38 corrected `Good` reps** (boundary ≈ 76% corrected).

If personalized bias correction is not yet available, use the pre-calibration proxy:
- **41 raw `Good` reps out of 50** for general drill families.
- **42 raw `Good` reps out of 50** for injury-sensitive drill families (serving, jumping, high-load attacking).

Plain-language interpretation:
- **Below ~60% corrected**: athlete is not ready; simplify or deload only if this repeats.
- **~60% to ~75% corrected**: hold the current drill.
- **≥ ~76% corrected on 50 attempts**: progression is allowed.
- **Never progress on raw 35 / 50.**

**Hysteresis (false progression is more costly than false hold).**
A near-miss progression session usually means **hold**, not **deload**. Reserve deload for stronger evidence — e.g., two consecutive corrected windows below 60%, a separate readiness/pain signal, or end-early for fatigue / pain. Upward gate strict; middle hold zone wide; downward trigger repeated, not instantaneous.

**Bias correction (three layers as above).**
Forced-criterion prompt every rep, periodic 20-attempt anchor block with shrinkage-prior + EWMA bias update, and a 10-second borderline review when the session lands inside the boundary zone (raw 36–42 / 50).

If the whole policy has to fit in one sentence: **gate progression on 50 attempt-level scores, correct the raw self-score for personal generosity bias, and only progress when the corrected data make "true skill at least 70%" an 80%-probability statement.**

## Apply To Current Setup

- `D80` remains the underlying **latent** target (70% true corrected success).
- `D104` is the operational decision covering minimum attempts, posterior rule, pre-calibration proxy, cost asymmetry, and hysteresis. Both live in `docs/decisions.md`.
- `docs/specs/m001-adaptation-rules.md` "Drill-level progression gating" section names the 50-attempt window, the 38/50-corrected Bayesian boundary, the 41/50 (or 42/50 injury-sensitive) pre-calibration proxy, and the near-miss-holds hysteresis rule.
- `docs/specs/m001-review-micro-spec.md` already stores `attemptCount` alongside `goodPassRate` — no schema change needed to enforce these gates. Persisting per-drill-variant counts (`V0B-12`) and an optional `borderlineCount` field are the only schema additions the three-layer correction needs.
- `app/src/data/progressions.ts`'s `defaultGatingThreshold: 0.7` is correct as the latent target. The eventual progression engine must additionally apply the minimum-attempt check and the posterior rule (with the pre-calibration raw proxy until personal bias estimates exist). `V0B-11` already enforces the `N < 50 → hold` floor at the summary surface and is consistent with this framework.

## Validate Later (field testing)

- Whether amateur self-scored `Good` agreement against partner/video review actually sits near the +5 pp (generic) / +8 pp (injury-sensitive) priors for beach passing.
- Whether 50 scored contacts accumulate quickly enough across a realistic 1–2 session/week cadence to feel responsive rather than slow.
- Whether the **41 / 50 raw** pre-calibration default feels fair courtside versus the **38 / 50 corrected** personalized default once calibration data exist.
- Whether bias drifts measurably with session fatigue or session order (late-drill leniency).
- Whether the 10-second borderline review survives real courtside attention or is routinely skipped.
- Whether the personal anchor block pattern (20 self- + expert-scored attempts every few weeks) is tolerable as a recurring ask or needs to fall back to video-only anchors.

## Open Questions

- `O12` remains a field-validation question: whether the 50-attempt minimum, the posterior rule, and the +5 / +8 pp priors agree with observed tester data at rolling N on real beach sessions. This note provides the planning default, not the validated answer.
- Whether a pre-estimation tap (`O15`) shifts bias direction enough to relax the pre-calibration proxy safely.
- Whether the borderline-review tap should itself be gated (e.g., only on the first gate-eligible session in a window) to avoid habituation.

## Sources (summary)

Reliability of outcome / observer / device scoring:
- Basketball Jump Shooting Accuracy Test (κ = 0.85 intra-rater, 0.70 inter-rater).
- TargetScan ISSF Pistol & Rifle validation (ICC = 0.999 / 0.998 vs. official scores).
- Archery scoring-system validation (no significant difference vs. judges).
- Elite volleyball coding reliability (PLOS One 2025); wheelchair basketball 109-variable template.
- Basketball possession coding reliability (κ 0.92–0.95).
- Singles tennis observational instrument (min reliability 0.81).
- Standardized basketball shooting task (60 FT + timed; ICC 0.77–0.86; r ≈ 0.81 vs. expert rank / live shooting).
- Youth elite tennis serve test (ICC = 0.674 on accuracy at N = 5 — small-N precision collapse).
- SwingVision vs. certified human analyst (κ ≈ 0.81, ~92.7% agreement at optimal angle).

Athlete self-calibration and judgment bias:
- Golf putting vs. chipping calibration (7–8 pp generosity on harder task); rules-knowledge overconfidence (~14 pp).
- Tennis serve-target calibration: accurate on easy target, overconfident on hard target.
- School-based basketball dribbling calibration (+5.3 / +3.0 cones).
- Volleyball serve judgments of learning (majority overestimate).
- Dart-throwing perceptual-motor calibration (poor at all distances).
- Recreational basketball shooting overconfidence.
- PLOS One collegiate vs. recreational free-throw prediction bias; "own shot" bias.
- Wimbledon officiating error pattern (84% in-called-out); AI-oversight tennis umpiring closest-ball error shift.
- Social-cognition review of sport performance judgments; basketball mental-fatigue shooting.

Self-assessment correction literature:
- Feedback-on-self-assessment meta-analysis (`g ≈ 0.34`).
- Anchoring-vignettes methodology for reporting-style bias.
- Forced-choice formats vs. response-style bias in psychometrics.

Statistical tooling:
- Wilson / Agresti-Coull / Jeffreys beta-binomial binomial-interval references (NIST and standard treatments). Used for the attempts-vs-interval and posterior tables above.

Volleyball-specific outcome validity:
- Reception-to-attack-outcome predictive work; attack-efficacy determinants in elite men's volleyball.
- Volleyball Canada Development Matrix (70% progression heuristic).

Comparable products:
- HomeCourt (basketball), Dr. Dish "One Count Challenge" (70/100), Zenniz (tennis), SwingVision.
- Make Or Miss, Hoops (basketball log/trend); TheGrint (golf); ArcherySuccess, MyTargets, Archery GB roundup.
- USGA World Handicap System (54-hole minimum; best-8-of-20 rule); Arccos Golf minimum-round summaries.

Full citations are preserved in the source research memos in `research-output/`; this curated note intentionally avoids verbatim citation strings to stay scan-friendly.

## Related docs

- `docs/decisions.md` (`D47`, `D80`, `D89`, `D104`, `O12`, `O15`)
- `docs/specs/m001-adaptation-rules.md` — "Drill-level progression gating" and "Missing-data policy"
- `docs/specs/m001-review-micro-spec.md` — `attemptCount` + `goodPassRate` payload (plus optional `borderlineCount` for the boundary-zone review)
- `docs/plans/2026-04-12-v0a-to-v0b-transition.md` — V0B-11..V0B-15 wiring this framework into v0b surfaces
- `docs/research/beach-training-resources.md` — "70% success as progression gating heuristic", "Self-reported metrics feasibility synthesis"
