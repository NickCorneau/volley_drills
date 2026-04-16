---
id: pre-telemetry-validation-protocol
title: Pre-Telemetry Validation Protocol For Small Consumer Cohorts
status: active
stage: validation
type: research
authority: operational protocol for the 14-day M001 validation cohort — recruitment, consent, per-use logging, non-returner probes, pre-registered verdict memo, and the 5-page evidence packet artifact
summary: "Thin longitudinal protocol for a 5-20 person no-telemetry cohort: one narrow segment, one observed baseline, per-use micro-log, three signal-based pulses, aggressive non-returner follow-up, pre-registered decision memo, and a 5-page evidence packet. Pairs with D91 thresholds; does not replace them."
last_updated: 2026-04-16
depends_on:
  - docs/research/d91-retention-gate-evidence.md
  - docs/discovery/phase-0-wedge-validation.md
  - docs/discovery/phase-0-interview-guide.md
  - docs/milestones/m001-solo-session-loop.md
  - docs/decisions.md
related:
  - docs/research/README.md
  - docs/research/beach-training-resources.md
  - docs/research/solo-training-environments.md
  - docs/research/outdoor-courtside-ui-brief.md
  - research-output/pre-telemetry-validation-protocol.md
---

# Pre-Telemetry Validation Protocol For Small Consumer Cohorts

## Agent Quick Scan

- Use this note when **running** the M001 pre-build validation cohort: recruitment copy, consent script, per-use capture, non-returner probe, preregistration template, and the final 5-page evidence packet.
- Pairs with `docs/research/d91-retention-gate-evidence.md` (which answers *what thresholds mean*) and `docs/discovery/phase-0-wedge-validation.md` (which owns *the program schedule and decision gate*). This note is the execution layer underneath both.
- Stance: small cohorts are for building a **defensible decision case**, not for estimating population retention rates. Report counts and case histories, not percentages.
- Not this note for threshold rationale or banded-reading math (use `d91-retention-gate-evidence.md`), for wedge scorecards (use `phase-0-wedge-validation.md`), for interview script content (use `phase-0-interview-guide.md`), or for run-flow UI defaults (use `outdoor-courtside-ui-brief.md`).

## Bottom Line

For the M001 14-day, no-telemetry cohort the highest-signal structure is a **thin longitudinal protocol**:

- **One narrow segment per batch** — recruit people who face the problem weekly, have a real workaround, and can use the product independently on sand. Do not mix "might someday" with "weekly pain."
- **One observed baseline** at kickoff to capture current workflow before anything is said about the product.
- **One lightweight per-use micro-log** submitted after every meaningful attempt (completed, abandoned, or blocked) — participant-filled, ~2 minutes, researcher interpretation added later in a separate column.
- **Three signal-based pulses** (roughly days 3, 7, 11) instead of daily check-ins, to catch silent disengagement without fatiguing participants.
- **Aggressive non-returner probe** within 72 hours of a realistic missed opportunity — forced-choice + open text, sent before the final debrief. This is the single highest-value message in the whole study.
- **Pre-registered decision memo** frozen before kickoff. Write the verdict rules before the evidence arrives so "3 of 5 returned on three separate events" is either a pass or not — on the rules, not the vibe.
- **Role separation where possible**: the founder should not moderate, take notes, and decide the verdict alone. If the team is too small, someone else owns synthesis and the readout explicitly starts with disconfirming evidence.
- **5-page evidence packet** as the final artifact: preregistration memo, cohort roster with qualification notes, session ledger summary, evidence board with negative cases first, verdict memo. If an outside reader can reconstruct the decision from these five pages, the protocol worked.

Report **"3 of 5 qualified testers returned on at least three separate days"**, not **"60% retention"**. The small cohort cannot support that second claim and D91's banded reading already rejects pseudo-precise framing at n=5.

## Use This Note When

- Staffing or running the 14-day pre-build validation cohort described in `docs/discovery/phase-0-wedge-validation.md`.
- Writing the cohort's recruitment post, screener, kickoff script, or non-returner probe.
- Deciding what to capture per session, what to ask only at kickoff/debrief, and what counts as a disqualifying misrecruit vs legitimate attrition.
- Building the preregistered decision memo or the final 5-page evidence packet.
- Defending the protocol against "can't we just do two big interviews at the end?" or "we should replace the dropouts."

## Not For

- Threshold math or banded-reading interpretation for `D91` (use `docs/research/d91-retention-gate-evidence.md`).
- Wedge scorecards, interview guide content, or Phase 0 schedule (use `docs/discovery/phase-0-wedge-validation.md` and `docs/discovery/phase-0-interview-guide.md`).
- Courtside UI defaults or run-flow spec (use `docs/research/outdoor-courtside-ui-brief.md` and `docs/specs/m001-courtside-run-flow.md`).
- Any claim that this cohort produces "population retention" or PMF-grade evidence; it produces a **decision case**.

## Why A Protocol Layer Exists

`D91` is a verdict threshold. The wedge-validation doc defines the program schedule and the decision gate. Neither specifies, in operational detail, how to recruit, how to consent, what to log per session, what to do when someone goes quiet, or how to write the memo that freezes the verdict rules before the evidence arrives. Without that layer, a 14-day cohort tends to collapse into founder-narrated anecdotes and cherry-picked quotes — exactly the failure mode `D91`'s banded reading and enrichment-signal requirement exist to prevent.

This note fills that gap. It is deliberately compatible with `D91`:

- `D91`'s verdict bar (`5+` testers, `2+` sessions in 14 days, banded with enrichment signals) is **unchanged** by this note.
- This note's default go/iterate/no-go for a 5-person cohort (see `Pre-registered verdict framework`) is a **stricter** operational reading that sits inside `D91`'s banded frame. Specifically, it requires at least one of the existing `D91` enrichment signals (unprompted return, >48h-gap second session, or third-session / scheduling commitment) in any pass that is going to be called `go` rather than `continue investigating`.
- Attrition is **evidence**, not noise. Silent dropouts are not replaced late in the study; they are included in the readout.

## The Three Things The Protocol Optimizes For

1. **Behavioral evidence of return.** Did qualified testers come back on their own, across time, for real reasons? Self-initiated vs nudged is a first-class field, not a narration.
2. **Completion of the core job.** Did the user actually finish the `Setup -> Safety -> Run -> Review` loop, or did they drop out mid-flow? Partial completions and abandonment points are as informative as completions.
3. **Structured reasons for non-return.** Silent non-return is the cleanest signal of weak pull; the protocol turns it into explicit, comparable data rather than hoping the final debrief will surface it.

The protocol deliberately separates **confirmatory evidence** (matches the preregistered verdict rules) from **interesting anecdotes** (colorful but non-binding). Both go in the packet; only the first category can move the verdict.

## Cohort Design

Recruit **one narrow segment only** per batch for M001:

- Currently plays or trains beach volleyball at least weekly in season.
- Has done solo or near-solo training (wall, self-toss, partner-of-convenience) recently, not just live doubles.
- Uses *some* current workflow to plan or remember what to practice (notes, memory, Instagram saves, coach messages, printouts).
- Can run a 10-25 minute session on their own phone, on sand or near-sand, inside the study window.
- Is **not** an employee, close friend, investor, or "professional tester" - friends-and-family testing is fine for the founder-first pilot (see `docs/discovery/phase-0-wedge-validation.md` "Rollout default: founder first"), but it does **not** count toward the D91 cohort.
- Can explain their experience in complete sentences when asked about the last time they trained.

If the product's value depends on setting (it does — outdoor, courtside, on sand), the tester must also agree to one observed in-context session between days 4 and 10.

**Do not recruit exactly five** when the D91 floor is 3-of-5. Overrecruit by 1-2 backups, because dropouts in longitudinal work are predictable and tiny cohorts are unusually exposed to them. If the cohort is already locked at five, **do not silently replace** attriters late in the study; treat attrition as evidence unless the participant was clearly misrecruited or never effectively entered the study.

## Recruitment Script

Keep product reveal minimal during recruitment to reduce acquiescence bias.

> Hi — I'm recruiting a small paid research cohort for people who currently **train or practice beach volleyball at least weekly, including some solo or near-solo sessions**. Over two weeks you would try an early product in your normal training life. We are not looking for compliments; we are trying to understand what makes people come back, what gets in the way, and why someone would stop using it. The study includes a kickoff call, quick logs after real training attempts, a few short check-ins, and a final debrief. Interested?

That wording screens for real behavior (weekly beach + some solo work), sets expectations for honesty, and avoids telling participants what answer is desired. Do **not** describe the session assembly, the adaptation logic, or the safety gate at this stage.

## Screener And Qualification Rules

Ask about **recent past behavior**, never attitudes toward the idea. The screener should establish:

- When was the last time they trained beach volleyball? (Specific, not "usually.")
- What did they do in that session? Who set it up? Where?
- What do they currently do to decide what to practice — ask a coach, copy a plan, make it up, follow a saved post, or nothing?
- How often is the problem of "what should I do today?" something they actually hit?
- Are they the decision-maker (self-coached) or an active end user (pair practice, friend-run)?

Mix open-ended prompts with distractors (e.g. ask a couple of gym-sports questions) so people cannot easily reverse-engineer what you are looking for.

**Valid disqualifications.** Misrecruit (wrong sport, indoor-only, unclear beach access), obvious incentive gaming, no real weekly need, inability to use independently, unwilling to allow an in-context session.

**Not valid disqualifications.** Negative first impression. A failed attempt, a short session caused by friction, or a silent dropout **all still count as evidence**. Removing them because "they didn't like it" is cherry-picking dressed as screening and invalidates the cohort for `D91` purposes.

## Consent And Expectation-Setting Script (verbatim at kickoff)

> Thanks for doing this. This is an early product and it may break, feel incomplete, or not fit your routine. That is useful for us to learn. We are evaluating the product, not evaluating you. Please use it only when you genuinely have a reason to train. If you stop using it, that is important evidence and we still want to hear about it. We will record calls and store your notes for research review. You can skip any question and stop at any time.

This framing explicitly:

- Reduces people-pleasing by labeling a rough product as expected.
- Normalizes churn as usable evidence so silent dropouts will still respond to the non-returner probe.
- Licenses the 72-hour probe before it happens so it does not feel like nagging.

Read it. Do not improvise.

## Study Cadence

Day 0 is a kickoff call. Everything after day 0 is mostly asynchronous.

### Kickoff and baseline interview (20-30 min)

- Capture current training workflow: what they did last session, where, alone or with whom, what they practiced, how they decided what to practice.
- Capture current workaround and competing behaviors: coach messages, IG saves, memory, printouts, ClubCoach, YouTube, nothing.
- Capture problem frequency and stakes: how often "what should I train on?" blocks or degrades a session; what they lose when it does.
- If possible, have them show the current workaround or last-session plan in the call. Observed baseline beats reported baseline.
- Consent script (above). Confirm backup contact channel for non-returner probe.
- Do **not** demo the product beyond the minimum needed to unblock independent use. The more product narrative they absorb from the founder, the less their in-life behavior is their own.

This is the baseline against which "return," "completion," and "superior to current behavior" are later judged.

### Per-use micro-log (event-based, ~2 min, participant-filled)

Submitted after every meaningful use attempt — completed, abandoned, or blocked. Keep burden low or participants will stop filling it. Participant fills these fields; the researcher appends interpretation later in a separate column.

- **Timestamp.**
- **Location / context.** Beach name or identifier, home, public court, which beach, conditions.
- **Trigger.** What made you reach for it right now?
- **Intended task.** What were you trying to do? (One sentence.)
- **Outcome.** Completed / partially completed / blocked / abandoned.
- **What else you used.** Nothing / memory / notes / friend / coach / competitor / workaround.
- **One quote.** A single line in your own words.
- **Attachment (optional).** Screenshot, photo of setup, 10-second voice note.

The researcher's session ledger then adds: self-initiated vs prompted, elapsed since previous session, adherence dimensions, context details, researcher interpretation, and confidence flag. See `Per-session evidence template` below.

### Signal-based pulses (not daily calls)

Three short pulses across the 14 days — around days 3, 7, and 11. Keep each to one message; do not use them to push usage.

> Since [date], did you have a real opportunity to train? If yes, what happened? If no, why not?

Daily "how was it?" prompts fatigue participants and distort the natural return rate. Three pulses is enough to catch silent disengagement and missed context without manufacturing accountability. If a pulse reveals a missed opportunity, trigger the non-returner probe rather than a phone call.

### Observed in-context session (one per tester, days 4-10)

One field observation between days 4 and 10. The M001 product's value is context-heavy (sand, wind, sun, phone-in-pocket, one-ball, shared courts), so remote moderation is not a full substitute. If a tester cannot host an observed in-person session, do a remote moderated session that covers the *same* session they would have run anyway.

Capture, in descriptive-before-interpretive order:

- Physical setting: surface, sun exposure, wind, court crowding, nearest wall / fence / rebounder.
- Social context: alone, with a partner, with a pickup group, around other groups.
- Setup burden: phone-to-pocket, mounting, balls, water, where the phone actually lived during the session.
- Friction and recovery: what broke or confused them, what they did next, how long recovery took.
- Safety / ergonomics: sun, heat, wet hands, sand on phone, screen legibility.
- Workarounds: anything they did outside the app to make it work (verbal counts, timer on watch, asking a partner to count).

Keep a strict separation: field notes are purely descriptive; interpretation goes in a separate column in the session ledger.

### Non-returner probe (72-hour window)

If a tester has no logged use for roughly **72 hours after a realistic use opportunity** (weather-permitting training day on their usual schedule), send a neutral probe immediately — do not wait for the final debrief.

> Quick check — I noticed no use since [date]. Which is closest?
>
> - I didn't have a reason to use it.
> - I thought about it but chose something else.
> - I tried and bounced.
> - Setup / access got in the way.
> - I'm not interested enough to keep going.
> - Other: ______
>
> What happened?

The forced-choice component converts silent non-return into comparable data across the cohort; the open text keeps a space for the one reason you did not anticipate. This probe is often the single most valuable message in the whole study, because silent non-return is the cleanest evidence of weak pull that a no-telemetry cohort can produce.

### Final debrief (30-45 min)

Reconstruct the 14-day timeline from the session ledger in front of them, then ask — in this order, not reordered:

1. The first use that felt promising.
2. The moment they most nearly quit.
3. The last time they chose the product over their old behavior (what the "old behavior" was, specifically).
4. What would have had to be different for them to return more.
5. What, specifically, they would miss if the product disappeared tomorrow.

If the Ellis / Superhuman "how disappointed would you be if you could no longer use this?" question is asked, use it as a **qualitative discriminator** (what benefit drove that answer, what blocked deeper use), not a headline percentage. At n=5-20 the quote matters more than the rate. This matches the post-qualification conviction check in `docs/research/d91-retention-gate-evidence.md`.

## Per-Session Evidence Template

Every use event becomes one row in the session ledger. Fields:

| Field | Source | Notes |
|---|---|---|
| Participant ID | researcher | pseudonymous; keep a separate identity key |
| Date and local time | participant | pulled from micro-log |
| Self-initiated or prompted | researcher classification | if prompted, record the exact prompt surface (text, call, in-person, scheduled check-in) |
| Context | participant | location, surface, wind, who was there |
| Trigger | participant | what made them reach for the product |
| Intended job | participant | the real task they were trying to do |
| Start and stop | participant or observer | rough duration or abandonment point |
| Outcome | participant | completed / partially completed / blocked / abandoned |
| Assistance | participant | none / friend / founder / support / workaround / competitor |
| Return signal | participant or debrief | would they naturally use it again for this job |
| Quote | participant | one verbatim line |
| Evidence attachment | participant or observer | screenshot, photo, audio clip, field note |
| Researcher interpretation | researcher | **separate column**; never merged with raw description |
| Confidence flag | researcher | **High** if directly observed or evidenced / **Medium** if self-report but detailed / **Low** if vague or reconstructed later |

For compatibility with `D91`'s banded reading, also maintain a per-tester adherence roll-up alongside the ledger:

- Elapsed hours between session 1 and session 2.
- Whether any third session occurred in the 14-day window.
- Total active minutes per session; fully completed vs abandoned mid-flow.
- Whether the full intended flow (`Setup -> Safety -> Run -> Review`) was engaged or only a narrow slice.
- Context log per **completed and missed** session (weather, location, alone vs with others, exact blocker when missed).
- Post-qualification conviction check (only for testers who crossed the 2+ sessions in 14 days line).

These are the same fields requested in `docs/research/d91-retention-gate-evidence.md` "Apply to current setup" and `docs/discovery/phase-0-wedge-validation.md` "Capture per tester across the 14-day window"; this note collapses them into a single per-row ledger schema so a researcher does not have to reconcile three lists.

## Pre-Registered Verdict Framework

Before the first kickoff, write a **one-page decision memo** and freeze it. This is not optional; preregistration is the cheapest bias control in the stack and has the largest effect on whether the verdict survives skeptical review.

The memo must include:

- **Target segment.** Exactly who qualifies (see `Cohort design`).
- **Core user job.** The thin-slice loop the cohort is testing: assemble a believable passing session -> run it courtside -> capture the one-minute review -> return next week.
- **Definitions.** What counts as "meaningful use" (completed at least through a non-trivial portion of the run flow), "repeat use" (full `Setup -> Safety -> Run -> Review` completed on a separate day), "completion" (all four steps finished in one session within the time budget).
- **Valid-session rules.** Minimum active minutes, what friction caused abandonment still counts, what logistical blocks do not (e.g. beach closed, tester traveling).
- **Disqualification rules.** Misrecruit vs negative reaction — negative reactions do not disqualify.
- **Contact cadence.** Frozen founder-to-tester contact plan; extra nudging to drifting testers invalidates the self-initiated-return count (see `D91` contamination controls).
- **Verdict thresholds.** Go / Iterate / No-Go, at the default values below.
- **Readout ordering rule.** The final readout begins with disconfirming evidence — silent dropouts first, then failed completions, then enthusiastic cases. Reordering to lead with the positive is a preregistration violation.

### Default thresholds for a 5-person M001 cohort

These are stricter than a bare `D91` pass and sit inside its banded frame. They are the operational "what counts as green-light" rules for this note; `D91`'s numbers in `docs/decisions.md` remain the canonical kill-floor / go-bar.

**Go.**

- At least **4 of 5** qualified testers complete the core loop end-to-end (`Setup -> Safety -> Run -> Review`) at least once without live researcher rescue after kickoff.
- At least **3 of 5** return on **three or more separate days or use events** within the 14-day window, with **at least one `D91` enrichment signal** present (unprompted return, >48h-gap second session, or third-session / concrete scheduling commitment).
- At least **2 of 5** testers independently describe concrete superiority over their current workaround (named, not generic).
- **No unresolved fatal issue** around trust, safety (pain-gate / stop-triggers), or basic courtside usability.

A qualified dropout can still be compatible with `Go` if the other four testers meet the above and the dropout is clearly attributable to logistics or segment mismatch, not weak value. Do not backfill.

**Iterate and rerun.**

- Only **3 of 5** complete the core loop, **or** only **2 of 5** show repeat use, **and** the negative evidence clusters tightly around 1-2 fixable issues (onboarding friction, setup burden, a single missing capability, a single piece of confusing copy).
- Output: a short fix list plus a commitment to rerun the same protocol on the same segment. "Iterate" is not "maybe"; it is "fix the named thing and run the same study again."

**No-go or re-segment.**

- **0-1 of 5** true repeaters, **or**
- Multiple testers say — directly or behaviorally — that the problem is too infrequent, too low-stakes, or not worth switching behavior for, **or**
- Most apparent "usage" only happens after prompting, founder nudging, or special study attention. This is weak pull, not success. The `D91` contamination controls exist precisely to detect this.

Scale thresholds linearly for 10-20 person cohorts, but keep reporting **counts and case histories, not percentages**. "Six repeaters, eight completers, two silent non-returners, one fatal trust issue" is the right sentence. "60% retention and 80% completion" is the wrong one, unless the study is large and designed enough to defend those intervals.

## Bias Controls

The stack of controls, in descending order of impact-per-effort:

1. **Preregistration** of verdict rules and readout ordering. Cheap, decisive.
2. **Audit trail**: raw notes, recordings, coded excerpts, session ledger, synthesis snapshots, and any change to the verdict rules are preserved. An outside reviewer should be able to reconstruct the decision.
3. **Triangulation**: compare session ledger + observed session + debrief account. No single enthusiastic call is allowed to stand in for the cohort.
4. **Role separation**: ideally moderator != note-taker != verdict reviewer, and the verdict reviewer is the least emotionally attached person available. If the team is too small for three roles, at minimum the founder does **not** own both moderation and synthesis, and the readout explicitly begins with disconfirming evidence.
5. **Hold contact cadence constant.** Do not add extra nudging to drifting testers. The M001 cohort is explicitly exposed to this failure mode because the founder can see who is going quiet; see `D91` contamination controls.
6. **Minimize product reveal during recruiting.** Tell them what behavior is required of them, not what result the study hopes to show.
7. **Ask about past behavior, never hypothetical future intent.** "Would you use this?" is banned; "when did you last face this problem and what did you do?" replaces it.

## Final Artifact: The 5-Page Evidence Packet

The output of the cohort is a short, boring, reviewable packet. Five pages is a target, not a limit.

1. **Frozen preregistration memo** (page 1). The one-page decision memo written before kickoff. Any subsequent change is logged below it with date and reason; unlogged changes are protocol failures.
2. **Cohort roster** (page 2). Pseudonymous IDs, qualification notes, recruit source, attrition status, founder-proximity classification (close friend / acquaintance / stranger / other). The founder-proximity field exists to flag contamination risk during readout.
3. **Session ledger summary** (page 3). The per-session rows collapsed into per-tester rows + the cohort-level adherence roll-up. Include self-initiated vs prompted counts, elapsed-hour distributions, and missed-session blockers.
4. **Evidence board** (page 4). Repeated themes, negative cases **first**, then confirming cases, with exact quotes. Flag each theme with the confidence level of the rows it rests on.
5. **Verdict memo** (page 5). One paragraph: Go / Iterate / No-Go and why, in the preregistered terms. If `Iterate`, the fix list. If `No-Go or re-segment`, the next wedge to probe. No slide-deck framing, no hero quotes at the top.

If an outside advisor or a skeptical teammate can read those five pages and reconstruct why the decision was made, the protocol worked. If the conclusion depends on hearing the founder narrate the evidence, it did not.

## Apply To Current Setup

This note does not change `D91`, milestone scope, or any shipping spec. It changes **how the 14-day cohort is run**. Concrete implications:

- `docs/discovery/phase-0-wedge-validation.md` is the program-schedule doc; it should cross-link here for the operational details (recruitment script, consent script, non-returner probe, session ledger schema, preregistration, 5-page packet).
- The "daily check-in" implication some readers might infer from `docs/discovery/phase-0-wedge-validation.md` is explicitly rejected — use three signal-based pulses (days 3 / 7 / 11) plus the 72-hour non-returner probe.
- The capture-per-tester list in `docs/research/d91-retention-gate-evidence.md` "Apply to current setup" and `docs/discovery/phase-0-wedge-validation.md` "Capture per tester across the 14-day window" are operationalized by the per-session ledger schema above. No contradiction; this note is the row-level template that feeds the existing lists.
- Role separation is a **recommendation** for this repo (one founder, small surface area). The minimum enforceable version is: readouts begin with disconfirming evidence, and the verdict memo is written against the preregistration before the founder narrates anything.
- The founder-first pilot (`docs/discovery/phase-0-wedge-validation.md` "Rollout default: founder first") still runs before the cohort. Founder + close-friend usage does not count toward the `D91` cohort counts; it is a pre-gate filter.

## Validate Later

- Does the 72-hour probe threshold hold for beach volleyball seasonality? Rain, wind, and sand conditions can legitimately delay training by several days; the probe may need a conditional ("since [date] when conditions were fine") in practice.
- Does the cohort produce enough signal at `N = 5-6` for the `Go` threshold to be reachable, or does the enrichment-signal requirement plus `3 of 5 on 3+ separate events` effectively force cohort sizes toward the 8-10 range? Parked until the first real run.
- Does the 5-page packet format survive contact with a real verdict, or does the evidence board want to be longer than one page in practice? Update on first use.

## Open Questions Deferred

- What cohort size lets the protocol skip the enrichment-signal requirement and rely on behavioral counts alone? The companion `D91` note flags `N >= 10-12` with majority unprompted return as a candidate; this is a shared open question across both notes, not a new one.
- Should post-M001 coach clipboard validation (`D72`/`D73`) reuse this protocol unchanged, or does a coach-assignment loop need a longer window and larger cohort to separate pull from trial? Parked until M001 clears its own gate.

## Sources

Raw provenance:

- `research-output/pre-telemetry-validation-protocol.md` (received 2026-04-16): consolidated protocol write-up covering Superhuman / Basecamp / Figma / Ink & Switch / YC / Whoop precedents, NN/g + Hall + Portigal + Mellinger method literature on small-n qualitative work, diary-study and contextual-inquiry cadence guidance, preregistration / audit-trail / triangulation / role-separation bias controls, and the ready-to-execute protocol (cohort design, recruitment script, screener, consent script, per-use micro-log, three signal-based pulses, observed in-context session, 72-hour non-returner probe, final debrief, per-session evidence template, pre-registered verdict framework, and 5-page packet artifact).

The raw file preserves inline citation markers from its research pass; this curated note is the durable operational summary that other docs should link to.

## Change Log

- 2026-04-16 — note created. Adds the operational protocol layer underneath `D91`. Keeps `D91` thresholds unchanged; introduces the preregistered decision memo, the per-session ledger schema (including the confidence flag and separate researcher-interpretation column), the 72-hour non-returner probe, the three-pulse check-in cadence (explicitly replacing any implied daily-call pattern), the role-separation and readout-ordering rules, and the 5-page evidence packet as the final artifact.
