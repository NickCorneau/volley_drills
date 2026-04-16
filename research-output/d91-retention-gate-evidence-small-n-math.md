# Calibrating an Early Repeat-Use Gate for a Sand-Based Consumer Fitness Test

> Raw research input received 2026-04-16 (second pass). Frozen provenance. Curated synthesis lives in `docs/research/d91-retention-gate-evidence.md`. This pass complements the earlier `research-output/d91-retention-gate-evidence.md` (pilot bands, OneSignal/Adjust benchmarks, Future/Strava/Freeletics analogues) with explicit small-n binomial math, a banded decision rule, a founder-nudging contamination risk, and an adherence-instrumentation framework.

## Bottom line

The cleanest conclusion is this: the **"fewer than 3 of 5 start a second session within 14 days" rule is reasonable as a kill floor, but not strong enough to serve as a positive go benchmark**. In this context, it is a **minimum survivability test**, not evidence of durable retention. The novelty-effect literature says a second use inside two weeks happens well before behavior settles into anything like a habit, while the small-n math says an observed 3-of-5 is still compatible with a very wide range of true retention rates. The right interpretation is therefore asymmetric: **0-1 of 5 is a serious negative signal, 2 of 5 is inconclusive, 3 of 5 is a cautious pass of the floor, and 4-5 of 5 is the first genuinely encouraging outcome**.

For a sand-based, outdoor, self-coached product, I would not make the bar harsher than 3-of-5 for the kill signal, because the product has more context friction than indoor, push-notified, account-based fitness apps. But I also would not let a 3-of-5 result stand on its own, because founder or concierge nudging can materially inflate early repeat behavior through accountability effects that belong to the humans, not the product. In other words: **keep the floor where it is; tighten the interpretation, not the threshold.**

## What public comparables actually document

Across public material on WHOOP, Strava, Future, Caliber, Ladder, Freeletics, Fitbod, Hevy, Peloton, and Centr, truly comparable **n<20 early-cohort repeat-use numbers are rare**. What is public is usually origin story, first-customer mix, launch mechanics, or later scale. The documentation I reviewed included: two elite athletes among WHOOP's first 100 users; Caliber's founders testing one-on-one coaching before the platform took shape; Fitbod's claim that it spent its first years focused on retention before marketing; Hevy's growth from single-digit downloads to more than 2 million in four years; Freeletics reaching nearly 1 million users in its first year; and a later retelling of a Ladder origin experiment in which roughly 100 people joined a hacked-together coach-led group at $100 per month and "nearly all" renewed. Only that Ladder anecdote directly resembles a repeat-use cohort, and even it is **second-hand and unaudited**, so it is useful as a directional story, not as a benchmark.

The same pattern shows up in other reviewed commercial histories. Strava's early-story material emphasizes a narrow starting niche, organic growth, and community rituals; Future's public interviews emphasize accountability and personalization as the core unlock in consumer fitness; and the reviewed Centr and Peloton materials are about positioning, product philosophy, and scale rather than auditable five-person retention. That matters for calibration: **the startup anecdotes are better for identifying mechanisms than for setting hard threshold numbers**. The mechanisms that recur are social accountability, narrow audience fit, and repeatable ritual — not "three of five came back" as a canonical industry standard.

The practical implication is blunt: if you want a defensible sanity-check, you cannot get it purely from founder stories. The public record for small consumer-fitness cohorts is too sparse and too selective for that. You have to anchor the decision in a blend of **behavioral-science evidence, adjacent exercise-app pilots, and explicit small-sample uncertainty**, while treating startup anecdotes only as supporting context.

## What the novelty literature implies

The novelty evidence argues strongly against treating "started a second session within 14 days" as anything more than an **early re-engagement signal**. A mixed-methods study of activity-tracker use led by Grace Shin found two stages of use and estimated the novelty period at **about three months**. In the same paper's review of prior tracker studies, one six-week Fitbit study found **half of participants abandoned after two weeks**, and another prototype study found that only **97 of 256 adopters used the tracker for more than a week**. Separately, the core habit-formation study led by Phillippa Lally found that, among participants whose habit-formation curves could be modeled, time to reach 95% of asymptotic automaticity ranged from **18 to 254 days**. That is the right scale to keep in mind: two weeks is far too early for stable habit inference.

Adjacent exercise-app pilots point the same way. In an 8-week weight-loss app study, acceptable use meant roughly **two to three uses per week**. In an 8-week theory-based exercise-app pilot, the app group recorded **7.24 exercise bouts** versus **4.74** in controls by week 8. In an 8-week group-versus-solo mobile wellness study, team conditions were **66% more likely to engage longer** than solo conditions. In an 8-week home-exercise app pilot, **19 of 20 participants completed the study** and mean adherence was **84%**. In an 8-week text-coaching plus Fitbit pilot, **73%** of participants set at least **6 weekly goals**. None of these are perfect commercial analogues, but they all measure engagement over **weeks, not just a first return**, and they treat repeat behavior as frequency, persistence, or adherence — not a single second-session event.

So the right novelty-aware interpretation is simple. **Session 2 within 14 days is necessary, but not remotely sufficient.** It tells you the product cleared the friction of first re-engagement. It does **not** tell you that the experience has survived the "this is new, I'll try it again" phase.

## What the PMF frameworks actually commit to

The closest thing to a hard early-stage threshold in the public framework literature comes from Superhuman and Sean Ellis. Superhuman adopted Ellis's PMF survey, but it did something highly relevant here: it **only surveyed users who had used the product at least twice in the last two weeks**. Then it used **40% "very disappointed"** as the actual benchmark. That distinction matters. "Used twice in two weeks" was a **qualification filter** for who was worth surveying, not the success bar itself. Said differently: the best-known public PMF process treats your "2 sessions in 14 days" rule as the beginning of measurement, not the end of it.

The rest of the framework landscape is notably less committal on fixed small-n retention ratios. Y Combinator frames retention around cohort analysis and the **appropriate time frame for successful use**, which depends on the product's natural cadence. Reforge similarly frames retention around defining the retention loop and activation path correctly, not around arbitrary universal day-counts. A startup-validation interview published through Lenny's channel emphasizes **inbound demand** and real pain more than any specific early-cohort repeat ratio. And Basecamp's *Shape Up* is fundamentally a shaping and betting system — timeboxes, appetite, problem definition — not a PMF retention-calibration framework.

That means there is **no credible framework-level authority** saying that 3-of-5 second-session starts in 14 days is the "right" generic rule. The frameworks that actually commit to a number commit either to **survey conviction** or to **natural-cadence retention analysis**. They do not canonize ultra-small cohort repeat-use counts. Your current bar is therefore best defended as a **first-principles operating heuristic**, not as something the framework canon has already validated.

## What five testers can and cannot prove

With **n=5**, the uncertainty is brutal. If you observe **3 of 5** testers starting a second session, the exact 95% binomial confidence interval for the underlying return probability is approximately **14.7% to 94.7%**. That is not a typo. The sample is so small that the observation is compatible with almost any real world that is not literally near-zero or near-one.

Using the binomial model directly:

- If the true second-session rate were **20%**, the chance of seeing **3 or more of 5** returners is **5.8%**.
- If the true second-session rate were **30%**, that chance rises to **16.3%**.
- If the true second-session rate were **60%**, the chance of seeing **3 or more of 5** is **68.3%**.
- Observing **0 or 1 of 5** returners has probability **8.7%** if the true rate is **60%**.

So a result of **3/5** is **moderate evidence against a truly broken product** if you define "broken" as something like a 20% underlying second-session rate. But it is **not** strong evidence that you have a genuinely good one.

| Observed second-session starts | Exact 95% CI for underlying return rate | Best reading |
|---|---:|---|
| 0/5 | 0.0% to 52.2% | strong negative signal |
| 1/5 | 0.5% to 71.6% | concerning |
| 2/5 | 5.3% to 85.3% | ambiguous |
| 3/5 | 14.7% to 94.7% | weak pass of floor |
| 4/5 | 28.4% to 99.5% | genuinely promising |
| 5/5 | 47.8% to 100.0% | strong signal, still small-n |

That table is why the decision rule should be **banded**, not binary. A five-person cohort can identify obvious failure. It cannot estimate retention precisely, and it definitely cannot prove durable habit.

## Calibration for this product context

Your specific context pulls the threshold in opposite directions. Outdoor sand-based training has more friction than indoor or sofa-native fitness apps because it depends on weather, location, setup, and the user's willingness to move into a specific environment; weather and environmental conditions are well-documented barriers to outdoor physical activity. No push notifications removes one of the few consistently useful engagement levers available to apps. A no-account flow also strips away some commitment-device and endowment effects that can help people follow through. Self-coaching removes the supportive accountability that human guidance can add. All of those factors argue for **not setting the required second-session bar too high**.

But the contamination risk runs the other way. Human support can increase adherence precisely because users feel accountable to a trustworthy, benevolent, expert supporter. That is good if support is part of the real product, and misleading if it exists only because founders are hand-holding five testers through a validation cohort. In a product like this, a concierge-managed cohort can make a weak product look stronger than it is by manufacturing the very accountability the product itself does not yet create. That is why I would **keep 3-of-5 as the kill threshold, but insist on separating self-initiated returns from nudged returns**.

My verdict on the full gate is therefore:

- **The 3-of-5 second-session kill signal is appropriately calibrated.**
- **The "all five complete 2+ sessions in 14 days" success bar is too demanding if treated as a universal go requirement for this product context.**
- **A plain 3-of-5 outcome should not trigger "go"; it should trigger "continue investigating."**
- **A 4-of-5 or 5-of-5 result, especially with low-nudge self-initiation and at least some third-session behavior, is the first result that looks meaningfully strong.**

In plainer terms: **your bar is too strict for a positive green light, but about right for an early red-light floor**.

## Secondary signals that sharpen interpretation

Because the primary gate is necessarily weak at n=5, the supporting instrumentation matters a lot. The best addition is to collect usage in the same dimensions the adherence literature uses: **length, breadth, depth, and interaction**. For this cohort, that translates to: whether the second session was self-initiated or prompted; the number of days between session 1 and session 2; whether a **third session** happened before day 14 or shortly after; total active minutes; whether the session was completed fully or abandoned mid-flow; and whether the user engaged with only one narrow slice of the experience or with the full intended flow. This lets you distinguish "tried it twice because you asked" from "is already starting to incorporate it."

The second addition is **context logging**. For every missed or completed session, record location, surface, weather, time-of-day, whether the user was alone or with someone else, and the exact blocker that prevented participation. Outdoor products are especially exposed to context friction, and without these notes you will misclassify "bad beach access on a windy day" as "product didn't resonate."

The third addition is a **post-qualification conviction check**. After a tester has crossed the "used twice in the last two weeks" line, ask the classic "How disappointed would you be if you could no longer use this?" question and capture open text on what benefit mattered most and what blocked deeper use. This does not replace behavior. It tells you whether the returners are merely compliant or actually attached. That is a much sharper lens than review completion alone.

Finally, treat **>50% review completion** as an interpretation aid, not a gating metric. In a five-person cohort, that just means three reviews. Useful, yes. Decisive, no. If behavior is weak, reviews cannot rescue the product. If behavior is mixed, reviews can explain whether the problem is novelty decay, context friction, instruction quality, or missing accountability.

In the end, this cohort can answer one narrow question well: **is the product obviously failing to earn a first repeat use under real-world conditions?** It cannot answer the broader question of durable retention. For that, you need either a larger cohort or a longer window, because **"3 of 5 started a second session within 14 days" is a useful smoke alarm, not a proof of product-market fit.**
