# Pre-telemetry validation protocol for small consumer cohorts

> Raw research input received 2026-04-16. Frozen provenance. Curated synthesis lives in `docs/research/pre-telemetry-validation-protocol.md`; durable conclusions flow into `docs/discovery/phase-0-wedge-validation.md` and cross-link with `docs/research/d91-retention-gate-evidence.md`.

## Conclusion

For a five-to-twenty person consumer validation cohort with no built-in telemetry, the highest-signal structure is not "talk to everyone a few times and trust the vibe." It is a **thin longitudinal protocol**: one narrow segment, one observed baseline use, one lightweight per-use log, a small number of prompted check-ins, an aggressive non-returner follow-up, and a **pre-registered decision memo** that forces the team to judge the cohort against rules written before the evidence comes in. The protocol should optimize for three things at once: **behavioral evidence of return**, **completion of the core job**, and **structured reasons for non-return**. It should also explicitly separate **confirmatory evidence** from **interesting anecdotes** so founders cannot "win the argument" by cherry-picking their favorite quotes. citeturn23view0turn23view2turn19search3turn19search10turn30search0

The biggest mistake at this scale is pretending that a sample of five or eight gives trustworthy population metrics. Small cohorts are excellent for identifying concrete usability problems, repeated friction patterns, and whether a narrow group of people *pulls* the product into real life. They are bad for claiming precise adoption or retention rates. So the right artifact is not a fake dashboard. It is a **case-backed evidence packet** that reports exact counts, exact session histories, exact dropouts, and exact quotes, with a clear verdict rule. Report "3 of 5 qualified testers returned on at least three separate days," not "60% retention," because the latter implies statistical precision the cohort cannot support. citeturn28view4turn28view5turn29view0turn30search0

## What the documented cases actually show

The public cases with the most methodological detail all converge on the same pattern: **high-touch contact with a narrow segment, aggressive note capture, and structured synthesis after each conversation**. In Superhuman's pre-launch phase, entity["people","Rahul Vohra","startup founder"] used a four-question survey based on entity["people","Sean Ellis","growth marketer"]'s product-market-fit question, then segmented respondents, analyzed "what type of people" benefited most, extracted the main benefit from open text, and turned missing-feature feedback into roadmap priorities. Separately, Superhuman's earliest human-led onboarding sessions ran up to ninety minutes; the team used the first thirty minutes for discovery and spent the rest capturing feature requests, bugs, and friction points, often leaving each conversation with around ten pages of notes plus multiple feature requests and bugs. That is the clearest published example of a pre-telemetry system producing a defensible artifact stream instead of "founder intuition." citeturn7view1turn7view2turn7view4

Basecamp's public material is less explicit about early cohort reporting, but the strongest lesson from *Shape Up* is still highly relevant: when uncertainty is high, teams should build the **smallest real slice** that lets them judge whether a core interaction "makes sense in practice," and they should use deliberately rough artifacts rather than polish. The book shows an early internal app for capturing customer-interview data with hard-coded values, raw links, and minimal styling, specifically so the team could test important tradeoffs early and cheaply. That is exactly the right mentality for evidence collection in a no-telemetry cohort: instrument the evidence process just enough to learn, not enough to create a second product. citeturn5view0

Figma's public writing on early alpha work is also revealing. During FigJam's path from inception to GA, the team tested the product in day-to-day internal use, collected feedback in an internal Slack channel, and later aggregated early alpha feedback visually inside FigJam itself, grouping it into themes, building a decision tree, and opening it to async review and voting. Earlier beta work on Team Library was described in similar terms: a long beta period, close attention to how people used it, and changes informed by what the team learned during that period. The useful precedent here is not "launch a beta." It is **capture feedback in a structure that makes later synthesis possible**. citeturn9view0turn9view1turn9view2

Ink & Switch's local-first work shows the observational side of the same pattern. In Upwelling, the lab interviewed writers and editors in varied environments, surfaced concrete themes such as the "fishbowl effect," and used those findings to shape the prototype's collaboration model, especially around private drafts, review, and merge behavior. The public artifact is not a KPI table but a **traceable chain from interview evidence to design findings**. That is the right model when a cohort is too small for real quant but large enough to expose repeated behavioral constraints. citeturn12view0

The most useful YC material is not a glamorous founder story but entity["people","Eric Migicovsky","tech founder"]'s concrete interview playbook. He tells founders not to pitch the product in interviews, not to ask hypotheticals, and not to dominate the conversation. Instead, he recommends specific prompts about the hardest part of the problem, the last time it happened, why it was hard, what people already do to solve it, and what they dislike about current solutions. He also advises founders to take detailed notes, capture as much information as possible, iterate in batches rather than doing a giant interview binge, and use hard numbers about current cost, frequency, and budget when deciding whether a prospect is a good first customer. That is practical pre-telemetry evidence collection, not just generic startup advice. citeturn32view1

Whoop's public record is useful mainly for **recruitment logic**, not for artifact design. entity["people","Will Ahmed","startup founder"] has described starting with elite athletes, including some of the first hundred users, because they had intense need, would use future iterations, and could fall in love with the promise even when early versions were rough. That supports a key protocol choice for small cohorts: recruit from a narrow, high-need subgroup that will tolerate rough edges in exchange for meaningful value. The published material I reviewed does **not** describe a rich early evidence artifact stack comparable to Superhuman's. citeturn15view0turn15view1

Across these examples, one pattern dominates. The best early teams did **not** rely on one big end-of-study interview or a single satisfaction survey. They produced a chain of artifacts: structured interview notes, per-session or per-conversation capture, periodic synthesis, and a roadmap or decision memo grounded in that evidence. citeturn7view4turn9view1turn12view0turn32view1

## What method literature supports at very small samples

The strongest practical guidance comes from entity["organization","Nielsen Norman Group","ux research firm"], entity["people","Erika Hall","ux researcher and author"], entity["people","Steve Portigal","user research consultant"], and entity["people","Jeanette Mellinger","ux research leader"]. The important distinction is simple: **small-n qualitative work is for finding issues and understanding behaviors, not for estimating rates**. NN/g's classic guidance still holds for formative work: five users can uncover most major usability issues if the goal is identifying problems and iterating quickly. But NN/g is equally explicit that numbers from such small qualitative studies should not be treated as trustworthy population estimates. Quantitative work aimed at generalizable success or completion rates usually needs far more participants. citeturn28view4turn28view5turn29view0turn30search0

That means the right question for a five-person or ten-person validation cohort is not "what is retention?" It is "**did enough real people independently return, complete the core job, and explain that behavior in a way that survives skeptical review?**" Put differently: use the small cohort to create a defensible **decision case**, not to mimic growth analytics before you have the sample size for growth analytics. citeturn29view0turn30search0

For recruitment, the literature is blunt: bad participants destroy small studies. Hall argues that with small samples, participant quality matters disproportionately; good recruiting "puts the quality in your qualitative research," and participants should represent the target, articulate their thoughts, and be appropriately familiar with the relevant technology. NN/g similarly defines the right participants as actual users or representative users with the same behavioral and demographic characteristics as the intended audience, and recommends screeners that avoid revealing the study's purpose too directly. Portigal adds a useful operational twist: teams can screen for baseline articulateness and build rapport before the session so participants arrive ready to tell stories, not just answer questions. citeturn35view0turn28view0turn28view1turn28view3turn34view1

For study shape, Mellinger's guidance is especially well suited to startup conditions. She recommends doing research in **small sprints of roughly five to eight conversations**, narrowing each sprint to one segment or one hypothesis, and following each interview with a short debrief while the evidence is still fresh. She also advises recording every session, using a note-taking template that marks both confirming and disconfirming evidence, and then doing weekly synthesis across the batch. That is exactly the cadence a fourteen-day cohort needs. citeturn26view0turn27view1turn27view2turn27view3

The literature also supports using **context methods** when return behavior depends on real-life environment. Diary studies are designed for habits, frequency, motivations, and longitudinal experience; they can be event-based, interval-based, or signal-based. For a small discovery project with a fairly homogeneous group and a relatively small problem space, NN/g gives a rough diary-study range of about five to twelve participants, which maps closely to the cohort size in your question. Just as important, diary entries should stay short — roughly five to ten minutes — or participants start skipping questions and dropping out. citeturn24view0turn23view1

For outdoor, courtside, or otherwise context-heavy products, direct observation and contextual inquiry matter because what users *say* they do and what they *actually* do often diverge. NN/g describes contextual inquiry as in-depth observation plus interview in the user's natural environment, specifically valuable for uncovering hidden steps, interruptions, and workarounds that interviews miss. Rapid ethnography literature reaches the same conclusion under time pressure: constrain scope tightly, use key informants, capture rich field data, involve multiple observers where possible, and analyze collaboratively. Field-note guidance is similarly consistent: record behaviorally, keep interpretation separate from description, and write up notes immediately. citeturn21view0turn21view1turn21view2turn20search4

## Bias controls that are worth the extra effort

Founder bias is real here, and the easiest way to see it is to look at the failure modes the literature keeps repeating. Mellinger warns against confirmation bias, acquiescence bias, and hindsight bias: founders hear what they want to hear, reveal too much about the product too early, and ask future-facing questions like "would you use this?" instead of grounding in past behavior. NN/g adds that leading questions distort both answers and later behavior in the session. Portigal adds a moderator trap: once you start correcting, explaining, defending, or answering product questions as the "expert," your research quality drops because the participant starts orienting toward *you* instead of toward their own experience. citeturn26view4turn18search18turn19search4turn34view0

So the minimum viable bias control stack is this. First, **write the verdict criteria before the study starts**. Preregistration exists precisely to reduce interpretation bias and to keep confirmatory analysis separate from post-hoc storytelling. Qualitative work can borrow that logic even when it is not a formal academic preregistration: define ahead of time what counts as repeat use, what counts as a valid completion, what counts as a disqualifying misrecruit, and what threshold produces go, iterate, or no-go. Second, keep an **audit trail**: raw notes, recordings, coded excerpts, synthesis snapshots, and decision changes should all be preserved so an outside reviewer can trace how the conclusion was reached. Third, use **triangulation**: compare session logs, observed behavior, and debrief accounts instead of letting one enthusiastic call stand in for the whole cohort. citeturn19search3turn19search6turn19search10turn19search7turn19search11

Operationally, the best bias control is **role separation**. If possible, the founder should not moderate, take notes, and decide the verdict alone. One person moderates, another captures notes and timestamps, and a third person — ideally not the founder and not emotionally attached to the feature — reviews the evidence board and the negative cases first. If the team is too small for that, the founder can participate, but only if someone else owns the synthesis and the final packet explicitly begins with non-returners, silent dropouts, and disconfirming evidence. citeturn27view1turn34view0turn19search7

## Ready-to-execute protocol

The protocol below is the structure I would actually run for a fourteen-day, no-telemetry consumer cohort. It is designed to be light enough to execute and strict enough to withstand founder optimism. It borrows from diary studies, contextual inquiry, short post-session debriefs, and pre-analysis logic, while avoiding fake quant. citeturn24view0turn23view1turn21view0turn27view1turn19search3

### Cohort design

Recruit **one narrow segment only** for each batch. Do not mix "people who might someday want this" with "people who already feel the problem weekly." A valid tester should meet all of these conditions: they currently experience the problem at a realistic frequency; they already use a workaround or competing behavior; they can use the product independently in the study window; they are not employees, close friends, investors, or "professional testers"; and they can explain their experience in complete sentences. If the product is best understood in a real setting, they must also be willing to allow one observed in-context session. citeturn35view0turn28view0turn28view3turn34view1turn32view1

If the true target is five completions, do not recruit exactly five. Overrecruit or maintain at least one backup participant, because dropouts are common in longitudinal work and especially painful in tiny cohorts. If you are already locked into exactly five people, do **not** silently replace attriters late in the study; treat attrition as part of the evidence unless the participant was clearly misrecruited or never actually entered the study. citeturn28view2turn24view0

### Recruitment script

Use minimal product reveal during recruitment to reduce acquiescence bias.

> Hi — I'm recruiting a small paid research cohort for people who currently **[do the real behavior / face the real problem]**. Over two weeks you would try an early product in your normal life. We are not looking for compliments; we are trying to understand what makes people come back, what gets in the way, and why someone would stop using it. The study includes a kickoff call, quick logs after real use attempts, a few short check-ins, and a final debrief. Interested?

That wording screens for real behavior, sets expectations for honesty, and avoids telling participants what answer you want. citeturn26view4turn32view1turn28view3

### Screener and qualification rules

Ask about **recent past behavior**, not attitudes toward the idea. The screener should establish: the last time they encountered the problem; what they currently do instead; how often the problem occurs; why that matters; and whether they are the decision-maker or active end user. Use open-ended prompts and distractors so people cannot easily reverse-engineer the "right" answer. citeturn28view3turn32view1

Disqualify only for genuine invalidity, not for negative product reaction. That means misrecruit, obvious incentive gaming, no real need, or inability to use independently. A **failed attempt** still counts as evidence. A **short session caused by friction** still counts as evidence. A **silent dropout** absolutely counts as evidence unless you can clearly show it was caused by logistics outside the product. citeturn28view0turn30search0

### Consent and expectation-setting copy

Use a short script and read it verbatim at kickoff.

> Thanks for doing this. This is an early product and it may break, feel incomplete, or not fit your routine. That is useful for us to learn. We are evaluating the product, not evaluating you. Please use it only when you genuinely have a reason to. If you stop using it, that is important evidence and we still want to hear about it. We will record calls and store your notes for research review. You can skip any question and stop at any time.

This framing reduces people-pleasing, normalizes churn as usable evidence, and sets up later non-returner outreach. citeturn34view0turn26view4turn35view3

### Study cadence

Run a **kickoff on day zero**, then shift to a mostly asynchronous structure.

**Kickoff and baseline interview:** twenty to thirty minutes. Capture current workflow, current workaround, frequency, stakes, and the last real instance of the problem. If relevant, have the participant show the current workaround or competitor in use. This is your baseline against which "return" and "better than current behavior" will later be judged. citeturn32view1turn21view0

**Per-use micro-log:** event-based, submitted after each meaningful use or failed use attempt. Keep it to two minutes. Ask for: timestamp; location/context; what triggered use; intended task; whether the task was completed, abandoned, or blocked; what else they used; one quote in their own words; and, when feasible, a screenshot or photo. The participant fills the log; the researcher appends interpretation later in a separate column. This hybrid preserves ecological validity while controlling burden. citeturn24view0turn23view1turn23view2turn20search4

**Prompted check-ins:** do **not** run daily "how was it?" calls. Daily prompts can fatigue participants and distort natural return behavior. Instead, use three short signal-based pulses across the two weeks — for example around days three, seven, and eleven — only to catch missed context and silent disengagement. A good pulse is: "Since [date], did you have a real opportunity to use it? If yes, what happened? If no, why not?" This aligns with diary-study guidance: combine event-based logging with signal-based prompts when you worry participants may forget, but keep repeat prompts short enough to avoid dropoff. citeturn24view0turn23view1

**Observed in-context session:** one per tester between days four and ten if the product's value depends on environment — outdoor, courtside, on the move, socially embedded, or physically awkward. Otherwise, do one remote moderated session around the first independent use. Observation should capture physical setting, interruptions, social context, prep burden, handoffs, safety/ergonomics, recovery behavior after friction, and any workarounds. Keep descriptive notes separate from interpretation. citeturn21view0turn21view1turn21view2turn20search4

**Non-returner probe:** if there is no logged use for roughly seventy-two hours after a realistic use opportunity, send a neutral probe instead of waiting for the final debrief. The best script is a forced-choice plus open text:

> Quick check — I noticed no use since [date]. Which is closest?
> I didn't have a reason to use it.
> I thought about it but chose something else.
> I tried and bounced.
> Setup/access got in the way.
> I'm not interested enough to keep going.
> Other: ______
> What happened?

This is the most valuable message in the whole study. Silent non-return is often the cleanest signal of weak pull. citeturn23view2turn24view0turn26view4

**Final debrief:** thirty to forty-five minutes. Reconstruct the two-week timeline, then ask in this order: the first use that felt promising; the moment they most nearly quit; the last time they chose the product over their old behavior; what would have had to be different for them to return more; and what, specifically, they would miss if the product disappeared tomorrow. If you want to borrow Superhuman's "very disappointed" question, use it as a qualitative discriminator, not as a headline percentage. At this sample size, the quote matters more than the rate. citeturn7view1turn30search0

### Per-session evidence template

Each use event should generate one row in a session ledger with these fields:

**Participant ID.**
**Date and local time.**
**Self-initiated or prompted.**
**Context.** Where they were and what else was going on.
**Trigger.** What made them reach for the product.
**Intended job.** The real task they wanted done.
**Start and stop.** Rough duration or abandonment point.
**Outcome.** Completed, partially completed, blocked, or abandoned.
**Assistance.** None, friend, founder, support, workaround, competitor.
**Return signal.** Would they naturally use it again for the same task.
**Quote.** One verbatim line.
**Evidence attachment.** Screenshot, photo, audio clip, or observer note.
**Researcher interpretation.** Separate from raw description.
**Confidence flag.** High if directly observed or evidenced; medium if self-report but detailed; low if vague or reconstructed later.

This is the minimum viable telemetry substitute: not because it is statistically powerful, but because it creates a reviewable chain of evidence across the whole cohort. citeturn23view0turn21view0turn20search4turn34view0

## Pre-registered verdict framework

Before the first kickoff, write a one-page decision memo and freeze it. Include the target segment, the core user job, the definitions of "meaningful use," "repeat use," and "completion," the valid-session rules, the disqualification rules, the check-in cadence, and the verdict thresholds. Also include one rule that is easy to forget but matters enormously: **the final readout starts with disconfirming evidence** — silent dropouts first, then failed completions, then enthusiastic cases. That one ordering choice materially reduces founder cherry-picking. citeturn19search3turn19search10turn27view1

For a five-person cohort, I would use the following default thresholds.

**Go:** at least **four** qualified testers complete the core task or review without live researcher rescue after kickoff; at least **three** qualified testers return on **three or more separate days or use events**; at least **two** testers independently describe concrete superiority over the current workaround; and there is **no unresolved fatal issue** around trust, safety, or basic usability. If one person drops out, the dropout is still reviewed, but the verdict can remain go if the other evidence is strong and the dropout is clearly attributable to logistics or segment mismatch rather than weak value. citeturn32view1turn7view1turn30search0

**Iterate and rerun:** only **three** complete the core task or only **two** show repeat use, but the negative evidence clusters tightly around one or two fixable issues such as onboarding friction, setup burden, or an obvious missing capability. In this case, the output is not "maybe." It is a short list of fixes and a commitment to rerun the same protocol on the same segment. citeturn7view2turn27view2

**No-go or re-segment:** **zero or one** true repeater, or multiple testers state — directly or behaviorally — that the problem is too infrequent, too low-stakes, or not worth switching behavior for. Likewise, if most apparent "usage" happens only after prompting, founder nudging, or special study attention, treat that as weak pull, not success. citeturn32view1turn23view2turn30search0

Scale those thresholds linearly for larger cohorts, but keep reporting **counts and case histories**, not faux-precise percentages. A ten-person batch should still say "six repeaters, eight completers, two silent non-returners, one fatal trust issue," not "60% retention and 80% completion," unless you are prepared to defend the confidence intervals and the study design as quantitative work. citeturn29view0turn30search0

The final artifact should be a short packet, not a slide deck full of vibes. I would make it five pages: the frozen preregistration memo; the cohort roster with qualification notes; the session ledger summary; the evidence board with repeated themes, negative cases, and exact quotes; and the verdict memo with one paragraph on why the team is moving forward, iterating, or stopping. If an external advisor or skeptical teammate can read those five pages and reconstruct why the decision was made, the protocol worked. If the conclusion depends on hearing the founder narrate the evidence, it did not. citeturn19search7turn19search11turn34view0turn27view3
