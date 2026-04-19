---
id: d91-retention-gate-evidence
title: D91 Retention Gate Evidence
status: active
stage: validation
type: research
authority: evidence base and interpretive framing for the D91 M001 go/no-go threshold
summary: "Triangulated evidence on whether D91 (5+ testers, 2+ sessions in 14 days; kill if <3 of 5 return) is too strict, calibrated, or too lax. Kill-floor holds; go-bar is slightly lax because of novelty effect and n=5 uncertainty, and needs a banded reading plus enrichment signals."
last_updated: 2026-04-16
depends_on:
  - docs/decisions.md
  - docs/discovery/phase-0-wedge-validation.md
  - docs/milestones/m001-solo-session-loop.md
related:
  - docs/research/README.md
  - docs/research/beach-training-resources.md
  - research-output/d91-retention-gate-evidence.md
  - research-output/d91-retention-gate-evidence-small-n-math.md
---

# D91 Retention Gate Evidence

## Purpose

Give a narrow evidence base and a defensible interpretation for the `D91` M001 go/no-go retention gate. Separates the **kill-floor** question ("is the product dead on arrival?") from the **go-bar** question ("is the loop durable enough to green-light the full M001 build?"), and explains why novelty effect prevents a single return session from being treated as strong evidence of value.

## Use This Note When

- sizing the validation cohort or interpreting cohort results against `D91`
- defending the current threshold to a skeptic, or being asked "why that number?"
- designing the 14-day field-test program in `docs/discovery/phase-0-wedge-validation.md`
- writing acceptance criteria that reference "repeat usage" or "retention" for pre-build validation

## Not For

- post-launch retention modeling or PMF measurement; that belongs to Phase 1.5+ work once the self-coached loop has shipped
- coach clipboard gating (`D72`, `D73`), which uses a different, larger bar
- periodization or habit-formation program design; see `docs/research/periodization-post-framework.md` for that line of work

## Bottom line

- **Kill-floor is calibrated.** Fewer than 3 of 5 testers starting a second session within 14 days is a defensible no-go: a simple majority return in a tiny, handpicked, concierge-style cohort is consistent with small-pilot evidence from adjacent digital-health and physical-activity studies and with the self-coached outdoor context's extra friction.
- **Go-bar is slightly too lax on its own.** Passing `5+ testers, 2+ sessions in 14 days` is **permission to keep building and keep testing**, not proof of durable value. The novelty-effect literature says a single repeat visit inside two weeks can still be curiosity, not pull. `>50%` review completion is an **interpretation aid** (helpful for diagnosing why behavior is weak or strong), not an independent pass/fail gate — on five testers it is just three reviews.
- **Read n=5 in bands, not as a pass/fail binary.** Exact 95% binomial CIs mean `3/5` alone is compatible with a true return rate anywhere from ~15% to ~95%. Use a banded reading: `0-1/5` strong negative, `2/5` ambiguous, `3/5` weak pass of the floor, `4-5/5` the first genuinely encouraging outcome.
- **Framing fix beats threshold-churn.** Keep `D91`'s numbers; treat the headline quantitative bar as a **sanity-check for initial behavioral pull**, and require at least one qualitative **enrichment signal** plus clean instrumentation (self-initiated vs nudged, adherence dimensions, context logging) before calling the loop validated.
- **Contamination risk is founder-specific.** Concierge nudging during a validation cohort can manufacture accountability the product itself does not yet create. A 3-of-5 or 4-of-5 pass driven entirely by human prompting is noise; separate self-initiated from nudged returns explicitly in analysis.
- **Stratify returns by `playerCount`.** Pair sessions and solo sessions answer different questions; the dyadic-exercise adherence literature predicts that pair testers will return at a higher rate than solo testers, and that signal is only legible if the cohort readout splits the two. See *Pair-vs-solo stratified reading* below; planning band is **+25–60% relative** / **roughly +10–15 pp absolute** pair-over-solo uplift in this cohort size, with coordination-drag caveats.

## Evidence base

### Small-cohort pilot band (upper reference)

Researcher-supported, concierge-style two-week pilots in adjacent domains commonly show near-complete follow-through:

- 2024 digital health coaching usability test: **10 older adults**, daily access for two weeks across all participants.
- 2025 M-PAC physical-activity usability study: **14 inactive adults**, 2-week use with feedback from 13.
- 2023 SNapp walking intervention: **11 users**, 2-week pilot with weekly interviews, highly managed context.
- Habit app weight-loss pilot: **16 participants**, 2–3 uses per week average over 8 weeks; acceptability data from 15 of 16.

These set a realistic upper band for what hand-recruited, supported early cohorts can achieve.

### Broad-market fitness retention (lower reference)

Launched consumer fitness apps decay fast once handholding is replaced by app-store funnels:

- OneSignal 2024 mobile benchmarks, Health & Fitness category: **~28% D1, ~18% D7, ~8.5% D30**.
- Adjust 2023 health-tracker report: **~23% D1, ~16% D3, ~12% D7**.

Not directly comparable to a handpicked alpha cohort, but a useful reminder that the curve falls fast in the absence of recruiting leverage.

### PMF and retention frameworks

- **Superhuman (Vohra / Sean Ellis)**: surveys are restricted to users who have used the product **at least twice in the last two weeks** before asking the "very disappointed" PMF question. "Two uses in 14 days" is a **minimum eligibility condition** for a meaningful value judgment, not itself a PMF threshold.
- **Reforge (Balfour)**: retention is an output. The actionable inputs are activation, engagement, and resurrection. The key points are the **setup moment → aha moment → habit moment** pipeline; a single successful use is not the goal.
- **Lenny Rachitsky** consumer PMF framing: the cleanest PMF signal is **cohort retention curves that flatten** above zero. A second session shows non-zero pull; it does not show that the curve has flattened.
- **YC-associated PMF guidance**: retention is a core product metric; "explosive usage" and spontaneous recommendations are what PMF looks like.

All four frameworks converge on the same structural point: behavioral retention beats stated intent, but **one return visit is not a habit loop**.

### Fitness analog cases

- **Future** (concierge personal training): at 2019 launch, beta cohorts reported **95% active at 3 months, 85% training at 6 months**, and the 1-month money-back guarantee had been redeemed once. High-touch concierge benchmark — stronger than anything a self-coached outdoor product should expect, but confirms founders leaned on hard repeat behavior.
- **Strava**: "inch wide, mile deep" into road cyclists; grassroots recruiting; the first customer stayed on the platform for 11 years. No public alpha gate, but the evaluation logic was durable repeated use from a narrow motivated niche.
- **Freeletics**: concept was repeatedly tested and improved based on community feedback. No formal threshold public; early signal was whether users kept incorporating workouts into real life.
- **Whoop, Tonal, Tempo, Ladder, Centr**: no clear public early alpha retention gates. Public material covers niche choice, distribution, and beta anecdotes, not pass/fail retention bars.

The public record does not contain an industry-standard number that `D91` could anchor to. The defense is a **framework-plus-analog argument**, not an off-the-shelf benchmark.

### Novelty-effect literature (the decisive input)

- **Shin et al. (Fitbit mixed-methods)**: two-stage use pattern with a **novelty period lasting ~3 months**; cites a 6-week Fitbit study in which half of participants abandoned within 2 weeks, and a prototype study in which only 97 of 256 adopters used the tracker for more than a week. Early use driven by curiosity about the data and the technology, not durable product value.
- **Lally et al. (habit formation)**: among participants whose habit curves could be modeled, time to reach 95% of asymptotic automaticity ranged from **18 to 254 days**. Two weeks is far below the scale at which habit inference is defensible regardless of cohort size.
- **JMIR 2022 attrition analysis**: a common early-attrition pattern is users who stay **initially out of curiosity** (novelty effect), then drop out, leaving only a stable core.
- **JMIR "effective engagement" paper**: what matters is enough engagement to drive behavior change, not raw frequency.
- **JMIR 2019 older-adult tracker focus groups**: former users' tracker use was **fueled by curiosity in quantifying activity, not the desire to increase activity**; initial positive response does not guarantee maintenance.
- **Adjacent 8-week exercise-app pilots**: 19 of 20 participants completing a home-exercise app study at 84% adherence; 73% of a text-coaching + Fitbit cohort setting ≥6 weekly goals; 7.24 vs 4.74 bouts app-vs-control by week 8; team conditions 66% more likely to sustain engagement than solo. These treat repeat behavior as frequency, persistence, or adherence over weeks — not a single second-session event.

Direct implication for `D91`: a second session in 14 days is **necessary** evidence that the first session was not actively bad, but only **weakly sufficient** evidence of recurring value. Curiosity explanations are still live at N=2.

### Small-sample uncertainty (what n=5 can and cannot prove)

Exact 95% binomial confidence intervals on a five-person cohort are wide by design, which is why the gate must be banded rather than treated as a single threshold. Observed return count → plausible true return rate:

| Observed 2nd-session starts | Exact 95% CI for underlying rate | Reading |
|---|---:|---|
| 0/5 | 0.0% to 52.2% | strong negative |
| 1/5 | 0.5% to 71.6% | concerning |
| 2/5 | 5.3% to 85.3% | ambiguous |
| 3/5 | 14.7% to 94.7% | weak pass of floor |
| 4/5 | 28.4% to 99.5% | genuinely promising |
| 5/5 | 47.8% to 100.0% | strong signal, still small-n |

Detection power is also asymmetric. If the true second-session rate were 20%, the probability of seeing ≥3 of 5 returners is ~5.8%; at 30% it is ~16.3%; at 60% it is ~68.3%. So observing 3/5 is moderate evidence against a near-dead product (~20% true rate) but weak evidence of a genuinely good one (~60%+ true rate). Observing 0-1 of 5 has only an ~8.7% probability under a 60% true rate, which is why the kill-floor is a serious negative signal even though the sample is tiny.

Practical reading for `D91`:

- **`0-1/5`**: strong negative; trip the kill-floor and revisit the wedge.
- **`2/5`**: ambiguous; neither a clean kill nor a pass. Extend the cohort or the window before advancing.
- **`3/5`**: weak pass of the floor; `continue investigating`, not `go`. Enrichment signals and self-initiated returns matter most in this band.
- **`4-5/5`, especially with unprompted returns and at least one third session**: the first result that looks meaningfully strong on behavior alone.

### Contamination risk from founder / concierge nudging

Human support can increase adherence precisely because users feel accountable to a trustworthy, benevolent, expert supporter. That is good if support is part of the real product, and misleading if it exists only because founders are hand-holding a five-person validation cohort through a 14-day window. A concierge-managed cohort can manufacture the very accountability the product itself does not yet create — which is exactly the accountability an unattended self-coached user in Phase 1.5+ will not have.

Mitigations the cohort protocol should enforce:

- Classify every second-session start as **self-initiated** or **human-prompted**. A pass driven entirely by reminders is not a pass.
- Hold founder-to-tester contact constant across the window; do not add extra nudging to testers who are drifting.
- Record the exact prompt surface (text, call, in-person, check-in question) when a nudge occurs; ambient presence and scheduled check-ins are different weights than ad-hoc chasing.
- Treat a 3-of-5 pass with 0 unprompted returns as a failure of the enrichment check, not a pass of the go-bar.

## Interpretive framing for D91

`D91` should be read in three layers, not two:

1. **Kill-floor (no-go screen):** if fewer than 3 of 5 testers start a second session within 14 days, the product has no pull and should not advance. Do not "build harder" past this point. Revisit the wedge — skill focus, solo definition, runner design, or phone-courtside viability.
2. **Go-bar (permission to keep going):** passing `5+ testers, 2+ sessions in 14 days` is permission to keep building and keep testing the loop. It is not by itself proof of durable value. `>50%` review completion is captured alongside as an interpretation aid (see below), not as an independent gate.
3. **Banded reading on the raw count:** `0-1/5` is a strong negative signal, `2/5` is ambiguous, `3/5` is a weak pass of the floor (read as `continue investigating`, not `go`), and `4-5/5` with unprompted self-initiation is the first result that looks meaningfully strong. See the small-sample uncertainty table above for the binomial CIs behind the bands.

To upgrade a bare "pass" into something closer to a validated loop, look for at least one **enrichment signal** inside the 14-day window. These are qualitative, not additional hard thresholds:

- **Unprompted return.** At least one tester starts their second session without a human reminder, nudge, or scheduled check-in.
- **Out-of-novelty-window return.** At least one second session occurs **>48 hours after the first**, not as an immediate next-day curiosity spike.
- **Third-session evidence.** At least one tester reaches a third session within 14 days, **or** makes a concrete scheduling commitment (booked court time, blocked calendar slot, invited a partner for a specific future session).

Any one of these materially reduces the novelty-effect objection. Absence of all three after a threshold pass means treat the result as "keep testing," not "green-light full build."

## Pair-vs-solo stratified reading

`D91` was designed before the session-first / forward-compatible-pair posture was locked in (`D114`–`D117`, `docs/research/persistent-team-identity.md`). It does not stratify returns by `playerCount`, and the headline bar treats five testers as a single pool. That collapses two different behavioral questions into one number. The dyadic-exercise adherence literature predicts the answers differ substantially, so the readout needs a stratified lens even though the thresholds do not change.

### Why to stratify

- A classic dyadic adherence study of married-pair vs married-individual enrolment in a fitness program found sharply lower dropout for the pair-enrolled arm over the programme window. A later spouse-based class study found involving a spouse improved adherence. Buddy-assisted interventions and family/social gamification studies keep finding the same directional effect.
- The Philadelphia six-month step-incentive RCT cited earlier in this note is the sharpest causal design on the solo side of that split: combined individual-and-team incentives beat team-only and control, while team-only did not outperform control. The predictive signal for our n=5 cohort is therefore "relationships help people show up," not "a team construct by itself helps."
- Pair-native consumer accountability products (Sweatmates: shared check-ins, instant partner visibility, "literally 10 seconds" completion friction) win early retention on the same mechanism: a named partner expects you to show up.
- None of these are beach-volleyball-specific, and none are pre/post-launch retention reporting from a pair-sport app. Treat the band as a **directional planning prior**, not a benchmark.

### Planning band

Expect pair testers to return at a **higher rate than solo testers within the 14-day window**, with the following bands:

- **Relative uplift:** roughly **+25% to +60%** (pair D14 rate vs solo D14 rate), center-of-mass around **+40%**.
- **Absolute uplift in an n=5-ish cohort:** roughly **+10 to +15 percentage points**, not a miraculous doubling.
- **Noise floor:** an observed gap smaller than about **+5 pp** in a cohort this small is not evidence on its own; it has to travel with qualitative pair-specific reads (partner named the session, partner mentioned as a return reason, pair retention co-occurs with a partner's own second session).
- **Confidence:** low. No published beach-volleyball pair-app benchmark exists; the band is an inference from dyadic-exercise adherence evidence, social-accountability evidence in digital fitness, and pair-native consumer products. Use the band to read direction, not to declare a pass or fail.

### Coordination drag (the caveat that matters)

Pair-native framing carries a failure mode the solo framing does not: a partner cancels, and a pair user can miss the retention window even though product pull is real. A raw D14 number can therefore understate pair demand if the app does not gracefully support fallback solo use. So:

- Do not only ask "did the tester return?"
- Ask: **did a planned pair session convert into another pair session, a solo fallback session, or nothing?**
- If pair users often come back as solo when coordination breaks, that is still evidence the pair-first framing is working — coordination drag, not product failure.

### How to apply in the readout

- Label every session's `playerCount` in the per-tester ledger; label every return either `pair→pair`, `pair→solo`, `solo→solo`, or `solo→pair`.
- Report the D91 raw count both **overall** and **stratified by the tester's first-session `playerCount`**. With a cohort of five, each stratum may be one to three testers — the stratified reading is qualitative, but it is legible, and it is the only way to tell whether the pair hypothesis is doing work.
- When reading the enrichment signals (unprompted return, out-of-novelty-window return, third-session evidence), note which ones occur in pair mode, which in solo mode, and which involve a named partner. Partner-attributed unprompted returns are the strongest pair-specific signal the cohort can produce.
- Keep the headline `D91` thresholds unchanged. This is a reading lens on top of the existing gate, not a new gate.

## Secondary instrumentation (how to sharpen a weak gate)

Because `D91` is necessarily weak at n=5, the surrounding instrumentation carries most of the interpretive weight. Three additions make the cohort readable beyond the raw return count:

1. **Adherence dimensions (length / breadth / depth / interaction).** For each tester, capture: elapsed hours between session 1 and session 2; whether a third session started before day 14; total active minutes; whether each session was completed fully or abandoned mid-flow; whether the tester engaged with the full intended flow (context → safety → run → review) or only a narrow slice. This distinguishes "tried it twice because you asked" from "is already starting to incorporate it."
2. **Context logging.** For every missed or completed session, record location, surface, weather, time-of-day, whether the tester was alone or with someone else, and the exact blocker that prevented participation. Outdoor self-coached products are especially exposed to context friction (weather, beach access, equipment), and without these notes the cohort will mis-classify "bad beach access on a windy day" as "product didn't resonate."
3. **Post-qualification conviction check.** Once a tester has crossed the two-sessions-in-14-days line, ask the Ellis/Superhuman "how disappointed would you be if you could no longer use this?" question and capture short open text on what benefit mattered most and what blocked deeper use. This is the Superhuman qualifier-then-survey pattern: two uses are the minimum eligibility condition for asking whether value has been experienced, not the success bar itself. It is a much sharper lens than review completion alone on whether returners are merely compliant or actually attached.

`>50% review completion` is an interpretation aid, not a gating metric. In a five-person cohort it just means three reviews. Useful for diagnosing why behavior is weak or mixed; not a rescue mechanism for bad behavior.

## Apply to current setup

- The `D91` thresholds in `docs/decisions.md` stay as written. The rationale and interpretive frame are what change.
- `docs/discovery/phase-0-wedge-validation.md` "Decision gate" gets the kill-floor vs go-bar split, the banded reading, the enrichment-signal list, and the expanded per-tester capture fields.
- `docs/milestones/m001-solo-session-loop.md` "Pre-build validation gate" keeps its current bullet on second-session retention and adds the novelty caveat in one line.
- When running the 14-day field test, capture per-tester:
  - **Return attribution:** was the second session self-initiated or human-prompted; if prompted, the exact prompt surface (text, call, in-person, scheduled check-in).
  - **Adherence dimensions:** elapsed hours between session 1 and session 2; whether a third session started before day 14 or a concrete scheduling commitment was made; total active minutes per session; whether the session was completed fully or abandoned mid-flow; whether the full intended flow (context → safety → run → review) was engaged.
  - **Context log per session (completed or missed):** location, surface, weather, time-of-day, alone vs with someone else, and the exact blocker when a session was missed.
  - **Mode and mode transitions:** every session's `playerCount` (1 or 2); every return labeled as `pair→pair`, `pair→solo`, `solo→solo`, or `solo→pair`. When a tester names a partner for a pair session, log the partner name as free text in the ledger so recurring-partner behavior is legible in post-hoc review (this is ledger-side capture; no v0b code change is required — see `docs/research/persistent-team-identity.md` and the v0b exclusion bullet in `docs/plans/2026-04-12-v0a-to-v0b-transition.md`).
  - **Post-qualification conviction check:** once a tester has crossed the two-sessions-in-14-days line, ask the Ellis/Superhuman "how disappointed would you be?" question plus short open text on what mattered most and what blocked deeper use. Do not ask testers who never qualified — it contaminates the filter.
- Hold founder-to-tester contact constant across the window. Do not add extra nudging to testers who are drifting; extra nudging invalidates the self-initiated-return count.
- Report the D91 raw count overall **and** stratified by first-session `playerCount`. Apply the *Pair-vs-solo stratified reading* band (+25–60% relative / +10–15 pp absolute uplift, +5 pp noise floor) qualitatively; do not promote it into an independent gate.

## Open questions deferred

- What cohort size makes the go-bar strong enough on its own to skip enrichment signals? (Likely `N >= 10–12` with majority unprompted return; stub question only, not blocking.)
- Does concierge-style founder proximity to testers materially inflate the kill-floor pass rate, and if so, by how much? The contamination mitigations above are the current answer; if multiple cohorts show consistent `3/5` passes driven entirely by nudging, the banded reading should tighten `3/5` from `weak pass` toward `ambiguous`.
- When the coach clipboard gate (`D72`/`D73`) is evaluated, does the same kill-floor vs go-bar frame apply, or does the coach surface need a longer window and a larger cohort to meaningfully separate pull from trial? (Parked until M001 clears its own gate.)

## Sources

Raw provenance:

- `research-output/d91-retention-gate-evidence.md` (first pass, received 2026-04-16): adjacent small-cohort pilot bands, OneSignal/Adjust broad-market benchmarks, Future/Strava/Freeletics/WHOOP analogues, and the initial kill-floor vs go-bar framing.
- `research-output/d91-retention-gate-evidence-small-n-math.md` (follow-up pass, received 2026-04-16): explicit n=5 binomial math and banded decision rule, Lally habit-formation scale, adjacent 8-week exercise-app pilot stats, founder/concierge contamination risk, and the adherence-dimensions + context-logging + post-qualification conviction instrumentation framework.

Both files preserve the inline citation markers from their respective research passes; the curated note above is the durable summary that other docs should link to.

## Change log

- 2026-04-16 — note created from the first `d91-retention-gate-evidence.md` research pass. Keeps `D91` thresholds unchanged; introduces the kill-floor vs go-bar split and the enrichment-signal list as the durable interpretation.
- 2026-04-16 — integrated the follow-up small-n-math research pass. Added the banded reading on the raw return count (with binomial CIs), the adherence-dimensions / context-logging / post-qualification conviction instrumentation framework, and the founder/concierge contamination risk. Sharpened the per-tester capture list in `Apply to current setup` accordingly. `D91` numbers remain unchanged.
- 2026-04-16 — added the *Pair-vs-solo stratified reading* section: rationale from dyadic-exercise adherence evidence and pair-native consumer products (Sweatmates), planning band (+25–60% relative / +10–15 pp absolute / +5 pp noise floor), coordination-drag caveat (pair testers returning as solo still counts as pair framing working), and how to apply the lens in the cohort readout. Added mode and mode-transition fields plus partner-name free-text capture to the per-tester ledger. `D91` numbers and all existing thresholds unchanged; this is a reading lens layered on top of the gate.
