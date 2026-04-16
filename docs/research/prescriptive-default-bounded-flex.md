---
id: prescriptive-default-bounded-flex
title: Prescriptive Default With Bounded Flexibility In Consumer Training Apps
status: active
stage: validation
type: research
authority: "evidence base for the 'opinionated default + bounded escape hatches' posture and the six structured-feedback patterns that tie into deterministic replanning"
summary: "What public evidence says about fully locked plans vs empty scaffolding in consumer training apps, which feedback shapes actually drive deterministic replanning, and how AI-as-explainer should be wired."
last_updated: 2026-04-16
depends_on:
  - docs/decisions.md
  - docs/roadmap.md
  - docs/plans/2026-04-12-v0a-to-v0b-transition.md
  - docs/specs/m001-adaptation-rules.md
  - docs/specs/m001-review-micro-spec.md
related:
  - docs/research/README.md
  - docs/research/binary-scoring-progression.md
  - docs/research/d91-retention-gate-evidence.md
  - docs/research/onboarding-safety-gate-friction.md
  - docs/research/periodization-post-framework.md
---

# Prescriptive Default With Bounded Flexibility In Consumer Training Apps

## Agent Quick Scan

- Use this note to check the directional evidence behind `D6`, `D11`, `D20`, `D21`, `D37`, `D43`–`D46`, `D74`, `D98`, and the v0b session-prep + session-summary surfaces.
- Not this note for the binary-score progression math (use `binary-scoring-progression.md`), the D91 retention read (use `d91-retention-gate-evidence.md`), the safety-gate placement question (use `onboarding-safety-gate-friction.md`), or the Phase 1.5 periodization vocabulary (use `periodization-post-framework.md`).
- Reinforces existing canon; does **not** overturn any `D*`. Seeds `O17` (should review add an explicit "too easy / just right / too hard" fit question with a reason bucket on the negative path, beyond sRPE + `goodPassRate`?).
- Sharpens `V0B-11` wording: the one-line adaptation output should surface the deterministic reason trace (signal + rule + change), not only a polished sentence.

## Bottom line

The strongest public evidence does **not** support either extreme. Fully locked plans (Zwift-style timing rigidity, expiring workouts) create avoidable friction when real life gets in the way, while empty scaffolding mainly works for self-directed users who already know how to program for themselves (Hevy, parts of Strava). The durable middle across strength, cycling, and running apps is an **opinionated default with bounded escape hatches**: the app owns the program spine, the user can adjust a few high-signal constraints (schedule, intensity, equipment, drill swap), and structured feedback changes future sessions in obvious ways.

This validates our current posture rather than forcing a new one. `D6` / `D11` / `D21` (deterministic only), `D37` (plan locks on start with swap/skip/end-early/pause/resume as divergence), `D98` (constrained starter-template path), and the v0b session-prep surface (swap drill, shorten block, switch archetype before lock) already sit on the validated branch of the market evidence. The one nuance worth tracking is that "prescriptive + structured feedback + deterministic replanning" has clearly worked **when** the feedback loop is short, low-friction, and tied to concrete changes in intensity, volume, schedule, and exercise selection. What is **not** well validated is the stronger version of that idea — multi-week plans that are meant to be followed "without user editing" except through feedback. Successful products keep adding controlled edit surfaces because users want help, not imprisonment.

Confidence: **high** on the directional conclusion (converging signals across Freeletics, Runna, TrainerRoad, Zwift, Future, Peloton, Fitbod). **Low-to-medium** on any specific delta for beach volleyball; the exact posture still needs `D91` field-test evidence.

## Spectrum map

The spectrum is less about ideology and more about which job the product is actually serving.

| Product | Primary job | Shipped posture | What actually adapts | Public sustainability or behavior signal |
|---|---|---|---|---|
| Freeletics | HIIT / strength generalism | Prescriptive core, now with more bounded flexibility | Coach adapts from profile, performance, and post-workout feedback; 2025 added exercise swaps plus weight/rep customization inside Ultimate Strength | Moved **away** from stricter lock-in toward more flexibility — the key signal. |
| Fitbod | Strength / hypertrophy | Highly prescriptive session generation | Sets, reps, weights, recovery status, logged changes, Max Effort sets, RiR-style intensity signals | 10M+ users and billions of logged exercises suggest durable demand for this posture in mechanical strength training; editor-vs-follower cohorts are not published. |
| Caliber | Strength coaching | Prescriptive coach-designed plans with human iteration | Coach check-ins several times weekly plus a weekly review of training and nutrition | Public signal is the coaching layer, not deterministic replanning. |
| Future | General fitness coaching | Very prescriptive plan, schedule-flexible because a coach can move things | Weekly feedback, schedule changes, travel, too easy / too hard / just right signals | Historically reported 90% retention in 2020; centers accountability plus plan refinement over user-side plan building. |
| Peloton | Content ecosystem / cross-training | Prescriptive roadmaps inside a large class library | Personalized weekly roadmaps and performance estimates | 1.8% avg net monthly connected-fitness churn in Q4 FY25; moat is ecosystem plus habit, not deterministic replanning alone. |
| TrainerRoad | Cycling | Middle of spectrum, increasingly machine-chosen | Workout performance, progression, schedule annotations, post-workout effort surveys; users can accept, decline, or overrule adaptations | Advanced users still care a lot about workout choice and flexibility when the system becomes more automatic. |
| Runna | Running | Structured plan with bounded edits | Schedule, volume, difficulty preferences, estimated race time, quick post-run reviews | Acquired by Strava; Strava is moving running plans to Runna — a market vote for guided-but-adjustable running plans. |
| Strava | Tracking + light plans | Lightweight scaffolding, not deep coaching | Intent-level recommendations and simple plans; running plans now shifted to Runna; cycling plans remain fixed email plans | Platform scale validates tracking/community. The running-plan shift implies its own lightweight planning layer was not the winning coaching posture. |
| Zwift | Endurance training | Started too locked; loosened over time | Plans now keep workouts unlocked once available, removed the 8-hour lock, added two extra weeks | Clearest public invalidation of hard lock-in: years of backlash on timing rigidity followed by a flexibility update. |
| Hevy | Strength logging / community | Empty scaffolding with routine creation | Routines, folders, copied workouts, social feed, progress stats | 12M+ athletes validate tracker/community demand, not guided longitudinal adherence. What "flexible" wins at: logging and social accountability. |

Across sports the sweet spot moves. In strength/hypertrophy, users tolerate more prescription because the problem is mechanical. In cycling and running, the session itself can still be prescriptive, but the **calendar** has to bend around fatigue, illness, missed workouts, and events. In tracker-first strength apps, empty scaffolding can scale because experienced users want a logbook and social proof, not a coach.

The practical reading: the market sweet spot is **not** "more flexibility is always better." It is "the app chooses by default, but users can easily adjust schedule, equipment, and difficulty without rebuilding everything." That is where Freeletics, Runna, TrainerRoad, and Zwift have all drifted.

## Edits-vs-retention, as far as public data goes

Audited public percentages for "what share of users edit their plans" across the major consumer apps do not exist. The absence is itself a signal: companies market personalization but rarely publish editor-versus-follower cohorts. So the answer has to come from product evolution, public behavior signals, and adjacent research rather than clean app-level percentages.

What the public record **does** show is that successful apps keep adding **bounded editing**, not plan authorship:

- Freeletics added exercise swaps and weight/rep customization.
- Runna added schedule adjustment plus difficulty and volume preferences.
- TrainerRoad lets users insert alternates, annotate time off / injury / illness, and either accept or reject adaptations.
- Zwift had to remove some lockouts after years of complaints.

The high-demand edits are not "let me rewrite the mesocycle"; they are "let me move this day, lower today's cost, or fit the workout to my context." That is exactly the shape v0b session prep already exposes.

The behavioral literature agrees. Customization in mHealth raises exercise engagement intent especially for users with stronger need for autonomy, and self-selected exercise intensity correlates with better enjoyment and likely better adherence than imposed intensity when the self-selected option stays inside sane bounds. The edit-retention relationship is likely **nonlinear**: too little autonomy creates reactance and missed-workout churn; too much autonomy turns the app into a blank spreadsheet. Heavy editing is ambiguous — agency in advanced users, plan mismatch in novices. The safe product stance is occasional, meaningful edits with the training spine intact.

One underappreciated finding from the 2026 Mammoth Hunters training-behavior analysis is that retention, frequency, and adherence were **not the same construct**. Users could have mediocre "adherence to planned frequency" yet still remain retained, and retention was more strongly associated with subscription status, prior activity level, and autonomous motivation than with simple frequency matching. This is consistent with our `D91` framing (see `d91-retention-gate-evidence.md`): we measure **second-session start**, not plan conformance.

## Six structured-feedback patterns that hold up

The strongest patterns are short, concrete, and operationally connected to a deterministic action. The weakest are broad reflective prompts that do not change anything.

1. **Overall workout difficulty on a tiny fixed scale.** TrainerRoad's post-workout survey asks users to rate effort from Easy to All Out, and the answer is explicitly used to individualize subsequent adaptations or to overrule the system's guess. This is probably the cleanest public example of structured subjective feedback feeding deterministic changes. Our equivalent: `sessionRpe` captured on the grouped segmented control per `D96` (Easy `0-3` / Moderate `4-6` / Hard `7-9` / Max `10`), then fed into the sRPE-load primitive per `D84`.
2. **Binary workout review plus a single reason code when negative.** Runna asks thumbs up / thumbs down; a negative answer drops into one specific reason such as "Paces too tough," "Workout felt too long," or "Not feeling 100%." One fast classification, then one actionable explanation bucket. Our nearest equivalent: `sessionCompletion = ended_early` plus the `incompleteReason` bucket (`time` / `fatigue` / `pain` / `other`) per `m001-adaptation-rules.md` inputs. The gap is that we do **not** currently ask this on a **completed** session — see `O17` below.
3. **Pre-session readiness gating.** TrainHeroic's short readiness check (sleep / mood / energy / stress / soreness) maps directly to session cost. Our equivalent is deliberately narrower by `D83`: pain flag + training recency + contextual heat CTA. The deliberate narrowness is what `onboarding-safety-gate-friction.md` already defends on activation grounds; this research reinforces it.
4. **Key-set intensity calibration instead of generic "how was it?"** Fitbod's Max Effort design and RiR-style framing tie the load-calibration signal to actual performed reps, not a post hoc vibe. Not applicable to passing fundamentals in M001. Worth re-examining when/if strength or jump work enters the catalog (Phase 1.5+).
5. **Weekly context-change check-ins.** Future asks whether sessions felt too easy, too hard, or just right, and whether travel / illness / schedule changes happened. High leverage because many missed-plan problems are context, not physiology. Direct fit with the Phase 1.5 weekly receipt shape from `D74`; no v0b change required.
6. **Periodic capability refreshers.** TrainerRoad's Ramp Test, Zwift's zone benchmarking, Runna's editable estimated race time — all refresh the pacing/intensity anchor so the deterministic engine is not adapting on stale assumptions. Our equivalent is `D104`'s minimum-attempt window and the `V0B-14` set-window marker as a real setup step; see `binary-scoring-progression.md`.

Likely theater: long after-action forms, broad motivation journaling, and granular set-by-set questioning for every session. The 2025 randomized smartphone-survey trial showed smaller, more frequent batches maintain higher response rates over 32 weeks than larger bundles, and broader mHealth literature is consistent that shorter surveys preserve response rates better than longer ones. The product rule is: **ask only questions you are prepared to act on deterministically within the next one to three sessions**. If a question does not change anything, it is decoration, not feedback. This reinforces `D9` (`<60s` review) and `D23` (first-pass review stays lightweight).

## Intake and recalibration

Baseline intake is useful only when it anchors a real training variable. In endurance, that means FTP, pace zones, or race time. TrainerRoad's Ramp Test is explicitly used to set FTP. Zwift ships ramp test + zone benchmarking as pre-plan work. Runna lets users update estimated race time and specifically warns against huge jumps. Those are not theater because they change workout targets directly.

In strength, the best intake is lighter. Fitbod uses demographic profile, equipment, and training experience at onboarding, then tells users to correct early recommendations so the engine calibrates. Human-coach products (Future, Caliber) ask about goals, schedule, experience, and preferences rather than forcing a giant battery before the user ever exercises.

Activation delay is dangerous. In the 2026 Mammoth Hunters analysis, the median delay from registration to first training was under eight days and initiation frequency dropped steeply after ten days.

Rule: **short baseline, frequent recalibration**. If the intake does not feed a concrete parameter immediately, defer it until after the first completed workout. This is exactly `D43` / `D44` / `D45` / `D46` and the `D104` / `V0B-14` set-window recalibration cadence.

## AI as explainer, not planner

Inside training-plan apps there is surprisingly little fully public validation of the exact posture "AI explains the deterministic decision, but does not make it." Category leaders either market AI as part of the planning engine (TrainerRoad, Fitbod) or keep a human coach in the loop (Future, Caliber). Our proposed pattern is **more differentiated than proven** inside training apps proper.

The clearest adjacent validation comes from wearables:

- Oura has a deterministic Readiness Score with specific contributors (resting heart rate timing, body temperature, sleep quality, HRV balance, activity balance) and explicitly points users to Oura Advisor for personalized guidance based on that data. Public launch write-up reported 60% of pilot users used Advisor weekly, 83% said answers were reliable, more than half said it helped turn insights into action. That is very close to the pattern we want: **deterministic metric first, AI explanation second**.
- WHOOP is directionally similar. Recovery and Strain remain metric-driven; WHOOP Coach is an AI layer that explains and guides based on biometric trends and Journal inputs.

The trust literature adds an important warning label. Explainability can increase trust, actionability, and acceptance, but it does **not** reliably improve trust in every context. Complex or incoherent explanations can reduce trust, and polished explanations can increase acceptance even when the underlying recommendation is wrong. A 2025 CHI study found always-on structured explanations increased acceptance and reduced cognitive load, but users were less satisfied when the explanation felt too terse. Another 2025 study found richer explanations could raise acceptance of incorrect AI outputs.

Implications for our stack, consistent with `D6` / `D20` / `D21`:

- If AI is only translating free text into parameters and generating copy, the UI should expose the actual deterministic reason trace: **which user signals changed, which rule fired, and what changed in the plan**. The LLM can turn that into readable language, but it should not invent rationale.
- Safest implementation is templated explanation with AI polishing, plus a confirmation step whenever free text is converted into a plan-affecting parameter.
- For v0b specifically, the "one-line adaptation output with explanation" surface must name the signal that crossed threshold, the rule that fired, and what changed (including "nothing, not enough reps yet" per `V0B-11`). This is a sharpening of `V0B-11` wording, not new scope.

## Apply to current setup

### What this validates (no change required)

| Research claim | Canon it reinforces |
|---|---|
| Prescriptive default + bounded escape hatches is the validated posture | `D6`, `D11`, `D21` (deterministic); `D37` (plan locks on start); `D98` (constrained starter-template); v0b session prep (swap / shorten / switch archetype) |
| Short baseline, frequent recalibration beats heavy intake | `D43`, `D44`, `D45`, `D46`; `D104` + `V0B-14` set-window as rolling calibration anchor |
| Structured feedback only if it changes the next 1–3 sessions | `D9` (`<60s` review), `D23`, `D74` weekly receipt framing; user-facing explanation templates in `m001-adaptation-rules.md` |
| AI as explainer, not planner, with deterministic reason trace + confirmation on free-text → parameter conversion | `D6`, `D20`, `D21`; v0b one-line adaptation output surface |
| Adherence ≠ retention (Mammoth Hunters) | `D91`'s layered read — kill-floor / go-bar / enrichment signals, self-initiated vs prompted; `d91-retention-gate-evidence.md` |
| Long surveys decay | `D9`, `D23`; v0b explicitly excludes analytics dashboards |
| Zwift-style lock-in failure mode | Already mitigated by `D37` bounded edits (swap / skip / end-early / pause / resume) |
| Hevy-style empty-scaffold failure mode | Already mitigated by `D6` / `D11` / `D98` (app owns the spine) |

### Sharpen (small, no new scope)

- **`V0B-11` wording in `docs/plans/2026-04-12-v0a-to-v0b-transition.md`:** the session summary output must surface the **signal that crossed threshold, the rule that fired, and what changed**, not only a polished sentence. The V0B-11 no-signal floor ("not enough reps yet to trust the rate") is one instance of this pattern, not the whole rule.

### Validate later (`O17`)

- **`O17`:** Should review add a one-tap "too easy / just right / too hard" fit question with a reason bucket on "too hard" (Runna / Future shape), beyond `sessionRpe` + `goodPassRate`? Paired with `O12` / `O15` / `D91`. Gated behind tester feedback from the `D91` cohort; not v0b scope. The argument against adding it now is real: `D23` keeps first-pass review lightweight and `sessionRpe` plus `goodPassRate` already carry most of the information. The argument for adding it later is that Runna / Future show a user-mental-model framing ("fit for me") that is cleaner than "effort on a 0–10 scale plus pass rate" for triggering `progress / hold / deload` in plain language.

### Do not do

- Do not open an editable mesocycle / periodization surface in M001 or v0b. Bounded edits live at session-prep and in-session divergence, not at the plan-authorship level. Multi-week planning is Phase 1.5 territory via the PoST framework stub (`periodization-post-framework.md`).
- Do not add a weekly "context-change" check-in to v0b. That is `D74` weekly-receipt territory at Phase 1.5, not v0b.
- Do not expand the safety gate into a TrainHeroic-style readiness survey. `D83` is deliberately narrower for activation reasons; see `onboarding-safety-gate-friction.md`.
- Do not let AI copy invent rationale. Templated explanation with AI polishing only, with the deterministic reason trace visible.

## Failure patterns to avoid

From the flexible side: empty scaffolding, too many options up front, no obvious next-best session.

From the prescribed side: expiring workouts, schedule rigidity, heavy surveys, opaque adaptations that feel arbitrary.

These are bracketing risks for our posture; both are already tracked as risks in `docs/roadmap.md` (locked-plan failure mode and empty-scaffold failure mode). The six feedback patterns above are the best public-evidence-backed way to stay between them.

## Open questions

- `O17` (new, see above): should review add an explicit fit question with a reason bucket on the negative path, beyond `sessionRpe` + `goodPassRate`? Validate with the `D91` cohort, not before.
- How does the "AI explains, deterministic rules decide" split feel to our testers once the v0b session summary surface is in front of them? No canonical answer in the public literature; needs in-product read.

## Cross-references

- `docs/decisions.md` — `D6`, `D9`, `D11`, `D20`, `D21`, `D23`, `D37`, `D43`, `D44`, `D45`, `D46`, `D74`, `D84`, `D91`, `D96`, `D98`, `D104`; adds `O17`.
- `docs/roadmap.md` — risk bullets for locked-plan and empty-scaffold failure modes.
- `docs/plans/2026-04-12-v0a-to-v0b-transition.md` — `V0B-11` wording sharpened (signal + rule + change trace).
- `docs/specs/m001-adaptation-rules.md` — `User-facing explanation` section already carries the deterministic reason trace pattern; this note is the external evidence base.
- `docs/research/binary-scoring-progression.md` — minimum-attempt window and self-scoring bias guardrails that make the "short, concrete, deterministic" feedback rule defensible at low N.
- `docs/research/d91-retention-gate-evidence.md` — why retention ≠ adherence and why we measure second-session start.
- `docs/research/onboarding-safety-gate-friction.md` — why the safety gate stays narrow despite the "pre-session readiness gating" pattern from the six-pattern list.
- `docs/research/periodization-post-framework.md` — where multi-week prescription would land if Phase 1.5 activates it.
