---
id: single-tracked-metric-amateur-skill-apps
title: Single Self-Tracked Weekly Metric For Adherence And Skill Improvement (Amateur Skill-Sport)
status: draft
stage: validation
type: research
authority: "Decision-relevant distillation of external vendor evidence on which single self-tracked metric, surfaced weekly, most reliably co-predicts both 8-12 week training adherence and measurable skill improvement for self-coached adult amateurs training 1-3 sessions/week in skill-sports. Sets the load-proxy + skill-proxy field picks for the M002 Weekly Confidence Loop's minimal weekly receipt and the design default for any future weekly readout / progress surface. Not authoritative for the receipt's UI shape (governed by M002 planning), for onboarding-band taxonomy (D121), or for per-drill progression-gate math (D80/D104)."
summary: "Synthesis of three independent vendor responses (all received 2026-06-02) to the 2026-05-27 single-tracked-metric brief. UNANIMOUS headline: no single metric honestly carries both adherence and skill-improvement signal at this dose; ship a two-metric pair. UNANIMOUS adherence pick: Planned-vs-Completed session ratio (zero/low noise floor, dose-flexible, best-supported adherence lever; best single metric if forced to one). UNANIMOUS rejections: streaks as hero metric (streak-ghosting; use forgiveness mechanics if at all), and sRPE-week-sum as a user-facing metric for this dose (noise floor too high, CV up to 28.1%; imports an elite-volume mental model). KEY DISAGREEMENT on the skill-side metric: vendor 1 backs weekly subjective confidence (OPTIMAL theory / self-efficacy); vendor 2 backs confidence as the best low-burden proxy but names a single repeated structured drill score as the better future upgrade; vendor 3 argues AGAINST confidence (Dunning-Kruger divergence, possibly negative) and FOR a structured-practice-quality metric (single-task perceived effort on a deliberate block, or weakest-skill targeted-contact count). All three flag the target population as under-researched (every improvement ranking is extrapolation) and recommend instrumenting to build the missing evidence internally. Directly bears on M002 being named 'Weekly Confidence Loop' and on the current within-skill-progression brainstorm's open 'how do you earn the next rung' question."
last_updated: 2026-06-02
depends_on:
  - docs/research/briefs/README.md
  - docs/research/briefs/2026-05-27-brief-single-tracked-metric-amateur-skill-apps.md
  - docs/research/briefs/responses/2026-06-02-single-tracked-metric-amateur-skill-apps-vendor-1.md
  - docs/research/briefs/responses/2026-06-02-single-tracked-metric-amateur-skill-apps-vendor-2.md
  - docs/research/briefs/responses/2026-06-02-single-tracked-metric-amateur-skill-apps-vendor-3.md
related:
  - docs/research/briefs/2026-05-27-brief-subjective-skill-confidence-validity.md
  - docs/research/srpe-load-adaptation-rules.md
  - docs/research/binary-scoring-progression.md
  - docs/research/pre-telemetry-validation-protocol.md
  - docs/research/periodization-post-framework.md
  - docs/ideation/2026-06-02-plan-and-adaptation-system-ideation.md
  - docs/research/founder-use-ledger.md
decision_refs:
  - D91
  - D124
  - D130
  - D131
---

# Single Self-Tracked Weekly Metric For Adherence And Skill Improvement (Amateur Skill-Sport)

## Agent Quick Scan

- **Bottom line (3-vendor unanimous).** No single self-tracked metric honestly carries **both** the adherence signal and the objective-skill-improvement signal at the target dose (adult, self-coached, 2-5 yrs experience, 1-3 sessions/week, skill-sport). Adherence and improvement load on **different, weakly-correlated constructs**. Ship a **two-metric pair**, kept visually and semantically distinct, never summed into one score. This is precisely the answer the brief flagged as decision-shaping: a single-metric weekly readout is **not** defensible.
- **Adherence anchor (3-vendor unanimous).** **Planned-vs-Completed session ratio** (a "consistency vs your own plan" framing). Near-zero noise floor (binomial, self-calibrating), dose-flexible (1 planned / 1 done = 1.0, same as 3/3), and the best-supported behavioral lever (action planning + self-monitoring + goal attainment). **It is also the single best metric if forced to ship only one** — all three say so explicitly. Caveat: it is an *indirect* improvement signal (it tracks whether intended practice happened, not whether skill rose).
- **Skill anchor — THE disagreement.** This is the one place the vendors split, and it matters because **M002 is currently named the "Weekly Confidence Loop."**
  - **Vendor 1 (pro-confidence):** Weekly Subjective Confidence rating, grounded in OPTIMAL theory / self-efficacy; ranks it #1 for improvement.
  - **Vendor 2 (confidence-as-floor):** Confidence is the best *low-burden* skill proxy available, but explicitly *second-best* to an objective **single repeated structured drill score**; recommends confidence now, drill-score later.
  - **Vendor 3 (anti-confidence):** Argues confidence is a weak and possibly **negative** learning signal (Dunning-Kruger; self-rating diverges from objective skill; confidence-prompt avoidance), and recommends a **structured-practice-quality** metric instead — single-task perceived effort on one deliberate block, or weakest-skill targeted-contact count.
  - **Reconciled read:** confidence is defensible as a *low-burden v1 proxy* (vendor 1 + vendor 2), but it is **not** a clean objective-learning signal (all three concede this; vendor 3 makes it the headline). The honest upgrade path everyone points to is a **repeated structured drill score on a focal skill** (same task, same scoring rule, measured often enough to beat noise).
- **Unanimous rejections.** (1) **Streaks** as the hero metric — short-term motivator that backfires on break ("streak ghosting"; engagement drops *below baseline* after a self-attributed miss). If used at all, use forgiveness mechanics (Duolingo Streak Freeze precedent) and capped/weekly resets. (2) **sRPE-week-sum** as a user-facing metric at this dose — noise floor prohibitive (CV up to ~28% in free-living conditions), and it imports an elite-volume recovery-management mental model into a population whose bottleneck is *under-training*, not overload. Keep sRPE as backend telemetry only.
- **Noise-floor discipline (unanimous).** At 1-3 sessions/week, do **not** display precise week-to-week movements as if they were signal. Use **rolling 2-4 week windows**; treat single-item Likerts and small contact-counts as noisy; set display floors; never call a one-week dip a "trend."
- **Biggest caveat (unanimous).** The exact target population is **systematically under-researched** — there is no controlled 1-3 sessions/week dose-response against a validated skill test in adult recreational skill-sport amateurs. Every *improvement*-side ranking is extrapolation from adjacent populations (elite/coached athletes, weight-loss/rehab adherence, lab motor-learning). The standing recommendation: **instrument from day one** so the cohort becomes the study that doesn't yet exist (compounds into `D91` cohort instrumentation and the 2026-07-20 re-eval).
- **Scope of this note.** Vendor 1, vendor 2, vendor 3 all folded in (all received 2026-06-02). 3-of-N state; structure accommodates more responses without rewriting.

## Use This Note When

- picking the load-proxy + skill-proxy for the **M002 Weekly Confidence Loop** minimal weekly receipt (planned-vs-completed + one skill proxy)
- deciding whether any weekly/progress surface should show **one** number or a **pair**, and whether to show a streak
- setting **noise-floor / rolling-window** rules for any user-facing weekly metric at 1-3 sessions/week
- choosing the **advancement / "am I getting better" signal** for the plan-and-adaptation work (see the current within-skill-progression brainstorm) — this note grades self-call vs light-criteria vs repeated-drill-score
- defining `D91` cohort instrumentation so the missing dose-response evidence accrues internally

## Not For

- the receipt's exact **UI shape, copy, or cadence** — that is M002 planning, not this note
- replacing `D121` onboarding-band taxonomy or `D80`/`D104` per-drill progression-gate math
- elite / coached / 4+ sessions-per-week users — at higher dose the ranking flips and load metrics (sRPE) regain relevance
- authorizing a schema change, a new `SkillFocus`, or any scope decision — this is evidence, not a decision

## Executive conclusion

Three independent vendor analyses converge hard on the **shape** of the answer and split only on the **skill-side metric**.

- **Convergence (all three):**
  1. A single metric cannot honestly carry both signals → **two-metric pair required**.
  2. **Planned-vs-Completed session ratio** is the adherence anchor and the best single metric if forced to one.
  3. **Streaks** are dangerous as a hero metric; **sRPE** is wrong for this dose.
  4. **Noise floors** forbid precise week-to-week display at 1-3 sessions/week.
  5. The population is **under-studied**; improvement rankings are extrapolative; **instrument to learn**.
- **Divergence (skill side only):** confidence (vendor 1) vs confidence-now-drill-score-later (vendor 2) vs structured-practice-quality-not-confidence (vendor 3). The union view: confidence is an acceptable *low-burden v1 proxy* for "readiness to express skill," but the *objective* improvement signal everyone trusts more is a **repeated structured drill score on a focal skill**.

## Per-vendor evidence ladders

### Vendor 1 — pro-confidence (OPTIMAL theory)
- **Recommended pair:** Planned-vs-Completed ratio (adherence) + **Weekly Subjective Confidence** (improvement).
- **Adherence #1 = Planned-vs-Completed:** HAPA / action-planning; meta-analytic RCT effects (total β ≈ 0.372, direct β ≈ 0.296); zero noise floor (binomial); fosters autonomy regardless of absolute volume.
- **Improvement #1 = Confidence:** OPTIMAL theory (Wulf & Lewthwaite) — enhanced expectancies facilitate learning; self-efficacy explains up to ~19% of adherence variance; rises as learners move cognitive→autonomous. Notes ceiling effects at elite level (collegiate softball N=24).
- **Streaks:** ranked 3rd, **high risk** — 3.6x short-term completion (Duolingo, >6M users) but broken streaks suppress engagement below baseline (Silverman & Barasch).
- **sRPE:** rejected for dose — CV up to 28.1% free-living; descriptive not predictive at 1-3 sessions/week.
- **Posture:** most willing of the three to treat subjective confidence as the improvement signal.

### Vendor 2 — confidence-as-floor, drill-score-as-ceiling
- **If one metric:** **Planned-vs-Completed ratio** (cleanest link to long-horizon adherence; first-week goal attainment predicts later adherence; normalizes dose better than raw count).
- **If two:** ratio + **weekly skill confidence/self-efficacy**, with an explicit caveat: confidence predicts **performance expression**, not clean learning (state self-confidence ↔ performance r ≈ 0.24-0.31).
- **Best future upgrade (named):** a **single repeated structured drill score** for the focal weakness — same task, same scoring rule, measured often enough to beat noise. Cites consumer-skill-app pattern (Yousician precision/timing feedback) of pairing an adherence loop with a skill-feedback loop.
- **Improvement evidence base:** deliberate-practice volume ↔ sports performance r ≈ .43 (~18% variance; Macnamara) — practice *exposure* is the strongest documented behavioral route, not load accounting.
- **Streaks / sRPE:** do not use as primary; sRPE is backend telemetry at best.
- **Posture:** moderate — confidence is the pragmatic v1 pick; objective drill score is where to go next.

### Vendor 3 — anti-confidence, pro structured-practice-quality
- **Recommended pair:** "**sessions completed vs your plan**" (consistency) + "**focused practice on your priority skill**" (a structured block logged as done/effortful, or weakest-skill targeted-contact count above a display floor).
- **Top-3:** (1) Planned-vs-Completed ratio (adherence; goal-setting d=0.55; logging-day dropout HRs; AUC=0.72 early-dropout prediction); (2) **structured/focused-practice quality** (the *only* candidate family with a defensible improvement claim at this dose — contextual-interference transfer SMD=0.55, though field SMD=0.34 ns; deliberate-practice r≈0.61 music); (3) confidence — *"Low and possibly NEGATIVE for improvement."*
- **Against confidence:** Dunning-Kruger miscalibration; self-confidence↔performance r≈0.24-0.25; confidence prompts can induce avoidance on anticipated-low weeks (16-wk N=335: self-report monitoring lowered early intrinsic motivation/satisfaction).
- **Richest on:** noise floors (integer 0-3 counts are schedule noise; show rolling ratio), forgiveness mechanics (Lally: one miss is harmless → punishing streaks are mis-calibrated), and "instrument for the missing study" staged thresholds.
- **Posture:** most insistent that confidence ≠ learning and that the improvement metric must be practice-quality, not self-rating.

## Reconciliation

| Question | Vendor 1 | Vendor 2 | Vendor 3 | Reconciled / repo-facing |
| --- | --- | --- | --- | --- |
| Single metric enough? | No | No | No | **No — ship a pair. Robust 3/3.** |
| Best single if forced | Planned-vs-Completed | Planned-vs-Completed | Planned-vs-Completed | **Planned-vs-Completed ratio. Robust 3/3.** |
| Adherence anchor | Planned-vs-Completed | Planned-vs-Completed | Planned-vs-Completed | **Planned-vs-Completed ratio.** |
| Skill anchor | Confidence | Confidence now; drill-score later | Structured-practice-quality (not confidence) | **Confidence is a defensible low-burden v1 proxy for *readiness*, NOT objective learning. Plan the upgrade to a repeated structured drill score on a focal skill.** |
| Streaks | 3rd, high-risk | Avoid as primary | Do not use (forgiveness only) | **Not the hero metric. If used, forgiving/capped only.** |
| sRPE | Reject for dose | Backend only | Do not ship primary | **Backend telemetry only; never the weekly hero.** |
| Noise discipline | Likert ok, sRPE noisy | Smooth/aggregate | Rolling windows, display floors | **Rolling 2-4 wk windows; no precise weekly-delta display.** |
| Population fit | Extrapolative | Low-moderate confidence | Explicit measurement vacuum | **Under-researched; instrument to learn. Robust 3/3.** |

## The skill-side fork (decision-relevant)

The brief explicitly wanted to know if "one metric ranks first for adherence and a *different* metric ranks first for improvement" — because that finding alone forces a two-metric pair. **It does.** And the improvement metric is exactly where the vendors disagree:

- **Confidence is cheap and motivating but epistemically weak.** Even vendor 1 (its strongest advocate) concedes ceiling effects; vendor 2 calls it readiness-to-express not learning; vendor 3 says it can be *negatively* related to objective skill and can drive avoidance. So a receipt that leans on confidence is honest only if it is framed as *felt readiness*, never as *proof you improved*.
- **The signal all three trust more is a repeated structured drill score.** Same focal skill, same scoring rule, same difficulty band, sampled often enough to beat noise. This is higher capture cost but the only candidate with a defensible objective-improvement claim at this dose.

**This directly challenges the M002 name.** "Weekly Confidence Loop" encodes a skill metric (confidence) the strongest evidence now says is the *weakest* of the candidates for the improvement axis. M002's premise (planned-vs-completed + confidence) is *defensible for v1* but the evidence says: keep confidence as a low-burden readiness proxy, and **explicitly plan the objective-drill-score upgrade** rather than treating confidence as the durable answer.

## Shared cautions (over-instrumentation failure modes)

1. **Streak ghosting.** Binary resets create "quit moments." Even Duolingo relies on freezes/amulets, not raw streaks. Lally: missing one opportunity does not materially harm habit formation → a one-miss-punishing streak is behaviorally mis-calibrated.
2. **sRPE misread as a prescription.** Amateurs read a load number as "I'm overtrained / train less," suppressing the volume they actually need.
3. **Rating-burden fatigue.** Multi-item subjective surveys (NASA-TLX-style) cause data-entry fatigue and abandonment; keep any subjective input to a single light item.
4. **Confidence-induced avoidance.** Users may skip the week they expect to feel less confident.
5. **Subjective/behavioral divergence.** Never arithmetically combine a subjective metric (confidence) with a behavioral one (sessions vs plan). Label them distinctly.

## Synthesis stability — what would change this

- **Bar 1 (reversal):** a controlled 1-3 sessions/week dose-response in adult recreational skill-sport athletes showing a *single* metric reliably co-predicts both adherence and a validated skill test. None of the three found one; this would overturn the "pair required" conclusion.
- **Bar 2 (recenter, no reversal):** new evidence that shifts the *skill-side* pick (e.g., a low-burden confidence variant that tracks objective skill, or a repeated-drill-score design cheap enough for v1). Would update the skill anchor without touching the adherence anchor or the pair conclusion.
- **Population-shift flip:** a user segment training 4+ sessions/week — sRPE/load regains relevance for that segment only.

## Decision implications

- **M002 weekly receipt (active planning):** adopt **Planned-vs-Completed ratio** as the adherence half (rolling window, not a punishing streak). For the skill half, **confidence is an acceptable v1 proxy if framed as felt readiness**, but the receipt design should leave a clean seam for a **repeated structured drill score on a focal skill** as the objective-improvement upgrade. Revisit the "Weekly Confidence Loop" framing in light of this.
- **Current within-skill-progression brainstorm (the open "how do you earn the next rung" question):** this evidence grades the three advancement-signal options I put to the founder:
  - *Self-call* (felt "solid/shaky") ≈ confidence → low burden, high ownership, but weakest/possibly-negative as an objective-learning signal.
  - *Light criteria on a fixed drill* (e.g., 8/10 clean sets) ≈ the repeated structured drill score all three vendors point to → the most defensible "1% better" signal, at the cost of courtside capture.
  - *Reps/time-based* → simplest, proves nothing.
  - **Implication:** if within-skill progression must *feel real* (the founder's stated #1), the evidence favors a **light-criteria / repeated-drill-score** advancement signal over pure self-call — or a **hybrid** (self-call default, optional light criterion when the user wants harder proof). This is the single highest-leverage input to that brainstorm decision.
- **`D91` cohort instrumentation:** log both retention and any available objective skill proxy from day one (per all three vendors' "instrument for the missing study"), so the 2026-07-20 re-eval reads real dose-response signal rather than extrapolation. Consistent with `D130`/`D131` local-first staging.

## Gaps the literature does not close

1. No controlled 1-3 sessions/week dose-response vs a validated skill test in adult recreational skill-sport amateurs (confirmed absent in tennis, golf, badminton).
2. No study pairs a self-tracked weekly metric with **both** 8-12 week adherence **and** objective skill improvement in this population.
3. Almost no skill-sport-specific self-tracking-app retention research (most is language-learning, step-count, weight-loss).
4. Confidence/avoidance dynamics for weekly self-rating in self-coached amateurs are theorized, not directly measured.

**Study that would close them:** a 12-week trial in adult recreational players randomizing the weekly-readout metric (consistency-only vs consistency+quality vs forgiving streak), measuring both retention and a validated skill test, with secondary arms varying weekly dose — i.e., the dose-response curve the field lacks, which the cohort instrumentation above can begin to approximate.
