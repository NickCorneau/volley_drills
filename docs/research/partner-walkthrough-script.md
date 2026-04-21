---
id: partner-walkthrough-script
title: Partner Walkthrough Script (Async, Founder-Use Mode)
status: active
stage: validation
type: research
authority: "Operational script for the async partner usability and behavioral-return pass authorized by `D130`. Captures a first-use honest test plus a 30-day unprompted-open check, not just a wording-and-clarity ledger. Frames the walkthrough as a real test the product can fail, not as design feedback gathering."
summary: "Async partner walkthrough for the founder-use M001 build. Opens with an upfront behavioural commitment, runs three short tasks plus a debrief, then holds a 30-day quiet window to observe whether the partner opens the app unprompted. Outputs a field-note ledger (usability, wording clarity, first-run feel) AND a 30-day behavioural return outcome that feeds the `docs/plans/2026-04-20-m001-adversarial-memo.md` Condition 3."
last_updated: 2026-04-20-d
depends_on:
  - docs/decisions.md
  - docs/milestones/m001-solo-session-loop.md
  - docs/plans/2026-04-20-m001-tier1-implementation.md
  - docs/plans/2026-04-20-m001-adversarial-memo.md
related:
  - docs/research/pre-telemetry-validation-protocol.md
  - docs/research/d91-retention-gate-evidence.md
  - docs/research/founder-use-ledger.md
  - docs/discovery/phase-0-wedge-validation.md
  - docs/research/onboarding-safety-gate-friction.md
  - docs/research/beach-training-resources.md
decision_refs:
  - D91
  - D123
  - D129
  - D130
---

# Partner Walkthrough Script (Async, Founder-Use Mode)

## Agent Quick Scan

- Use this script when the founder hands the app to the training partner for the **first time** after each Tier of the M001 founder-use build (currently Tier 1a; later Tier 1b / Tier 2).
- **This is not a `D91` cohort run.** It is a usability + first-run clarity pass on n=1 **plus a 30-day behavioral-return observation**. Do not compute retention percentages from it.
- The walkthrough is framed to the partner as an **honest first-use test of a product that can fail**, not as design-feedback collection. This matters — politeness bias from "I'm gathering feedback" is the failure mode of a walkthrough of this kind. The wording template below is calibrated for honesty, not enthusiasm.
- Delivery is async: send the partner the install link plus the task list, let them run the tasks on their own schedule, then debrief over messaging. **No hovering over their shoulder while they tap.** Live observation corrupts first-run feel.
- Output is two things, not one:
  1. A **field-note ledger** (`## Field-note ledger` template below) with each observation tagged `P0` / `P1` / `P2` / `wontfix`.
  2. A **30-day behavioral-return outcome** (see `## 30-day behavioural return window`) — binary: did the partner open the app unprompted within 30 days of the walkthrough delivery, yes or no. This outcome feeds directly into the adversarial memo's Condition 3 and is gating for Tier 2.
- Authoritative for: the async partner walkthrough protocol (tasks, debrief, ledger format, behavioral-return window) under `D130`.

## Purpose

`D130` makes founder conviction plus a partner-walkthrough behavioral signal the build authority for M001 Tier 1a, in place of the deferred `D91` stranger-cohort gate. The partner's walkthrough has to answer **five** questions — four are capturable during the walkthrough itself, the fifth is capturable only during the quiet 30-day window that follows.

1. **First-run clarity.** On a cold open with nothing in the app, can the partner get to a believable session without needing the founder to explain?
2. **Wording trust.** Do the safety-check prompts, drill courtside copy, and warm-up framing read as helpful-and-honest, or as either underspecified or overreaching (medical-app-sounding)?
3. **Courtside believability.** Does the run flow look like something the partner would actually follow on sand, or does it look like a form they would skip?
4. **Content honesty.** When the partner runs a serving or setting session, do the drills match what a real beach practice looks like, or do they feel generic?
5. **Behavioral return (captured over 30 days, not during the walkthrough).** Does the partner open the app unprompted at least once in the 30 days after the walkthrough? This is the single signal a partner walkthrough can produce that is not contaminated by politeness bias, because it happens without the founder in the room.

Questions outside this list (retention math, main-tool pull, solo feasibility in unfamiliar environments, medical reviewer concerns, etc.) belong to the 2026-07-20 `D130` re-eval or to `docs/research/pre-telemetry-validation-protocol.md` when a stranger cohort is run.

## Preconditions

Run the walkthrough **only after all of these hold**:

- Tier 1a work units are merged per `docs/plans/2026-04-20-m001-tier1-implementation.md` and the founder has completed **≥2 full end-to-end Tier 1a sessions** locally without a build error (not just a smoke test — actually ran them on sand or a close analog).
- The install link is a real Cloudflare-Worker-hosted URL (not localhost) so "Add to Home Screen" works.
- The partner has a phone with the current public iOS line or a recent Android equivalent.
- The partner has not already seen the app since its last major change (if they previously clicked around a different build, note this in the ledger — familiarity will bias first-run signal).
- **The founder has committed to the 30-day quiet window.** Specifically: the founder will not mention the app to the partner, ask if they opened it, send reminders, or bring it up in any context between the walkthrough debrief and 30 days out. The only permitted exception: if the partner asks a question about it unprompted, the founder can answer — and that exchange becomes itself a data point in the 30-day window observation. If the founder does not trust themselves to honor this, do not run the walkthrough yet.

## Framing template (what the partner actually sees)

**Messaging template (paste and send exactly this — the wording matters):**

> Hey — I built a beach volley training app and I want to run a real honest test on it with you, not a feedback session. Before you look at it, can you tell me: **if you tried this for 20 minutes today and it was actually useful to you, would you open it again on your own in the next couple of weeks without me asking you to?** Not a promise, just your honest read. I'm trying to learn whether this works as a product, and that question only works if you answer it before you see it.
>
> Once you've answered, here's how it works:
>
> 1. Open the link below on your phone. No account, no signup. Add it to your home screen when it prompts.
> 2. Run through the three tasks below whenever you have time (they don't have to be back-to-back). Don't ask me anything during — if something is confusing or wrong, that's what I want to catch.
> 3. When you're done, send me voice notes or a message answering the short debrief at the end. Brutal honesty. If something annoyed you, I want to hear it.
>
> Then here's the important part: **I'm not going to bring the app up again for 30 days.** If you open it on your own during that window, cool. If you don't, that's also the real answer. Either is fine, but I'll know which one it is.
>
> Total time: ~30 minutes for the tasks + debrief. No stakes. This is a test the app can fail.

Then paste: install URL + Tasks A/B/C below + Debrief prompts below.

**Why the upfront commitment question (Q1 of the debrief promoted to the opening).** A partner who predicts "yes I'd open it again" in the abstract, then does not, gives you a much sharper disconfirming signal than a partner who was only ever asked at the end. The upfront ask is the Condition-3 behavior gate made legible to both parties.

**Why "a test the app can fail."** The founder is gathering behavioral evidence, not gathering feedback. Framing the walkthrough as feedback-gathering invites the politeness bias this walkthrough exists to escape. The partner being told "this can fail" gives them permission to honestly disengage, which is the only way the 30-day signal is informative.

## Tasks

### Task A — First-open to first session (solo, default focus)

**Goal for the partner**: open the app for the first time and reach the end of one session.

Steps (for the partner to do unguided; do **not** annotate the steps with screenshots or hints):

1. Open the install link. If prompted to "Add to Home Screen," do it.
2. From the first screen, set yourself up for a **solo, 15-minute session today**. The app will pick what you train today; that is by design.
3. Go through the safety check honestly. (Partner: answer as yourself, not as a test user.)
4. Run the full session. Don't skip blocks. If the timer cues something, follow it if you can — you don't need a net or wall.
5. When the session ends, complete the review (RPE + skill metric + optional note).
6. Stop on the `Complete` screen. Take a screenshot of that screen and send it back.

**What the founder is looking for** (do not share this list with the partner):

- Does the partner reach a believable session without asking the founder a question?
- Does `Beach Prep Three` (`d28`) show up as the warmup block with the four-component courtside copy (whole-body ramp, ankle proprioception, shoulder/trunk, sand movement rehearsal)? This is the Tier 1a Unit 1 acceptance check.
- Does the main_skill block populate from `chain-1-platform` through `chain-4-serve-receive` for a solo 15-min session (the default behavior under Tier 1a: no focus toggle; builder picks a pass-focus default)?
- Does the safety prompt wording ("Any pain that's sharp, localized, or makes you avoid a movement?" plus the DOMS line) land as clear or as confusing?
- Does the "Chosen because:" single-sentence rationale on each block (Tier 1a Unit 1d) read as honest and useful, or as noise?
- Does the Home screen's last-3-sessions row (Tier 1a Unit 1e) show this session after completion?
- Does the review feel completable in under a minute, or does it feel like a form?

### Task B — Serving session (solo, different day)

**Goal for the partner**: set up a solo session and intentionally steer toward serving content using the draft-screen Swap action, then complete a 15-min session.

Steps:

1. Open the app fresh (close and reopen from the home-screen icon, not the browser tab).
2. Set up a **solo, 15-minute session**.
3. On the draft screen, look at the `main_skill` block. If it is not a serving drill, tap Swap once. Note which drill came up. Tap Swap again if you want to try a different one. (Partner: do what you'd actually do.)
4. Run the session with whatever main_skill drill ends up being selected.
5. Later that day or a different day, repeat steps 1–4. Note whether the main_skill block shows a **different** drill the second time.

**What the founder is looking for**:

- Does Swap on main_skill surface serving drills from the existing `chain-6-serving` content (`d22`, `d23`, `d24`), and — if a setting drill appears — does it come from the new Tier 1a `chain-7-setting` content (`d38`, `d39`, `d41`)?
- Does the Swap interaction feel like the right way to steer focus, or does the partner ask where the focus toggle is? (That question is the Tier 1c architectural trigger; log it if it's asked.)
- Does the drill's courtside copy use BAB vocabulary honestly (Sideout, Transition, Cut Shot, High Line) with inline definitions on first occurrence (e.g. "Pokey (open-knuckle tip)"), or does it use generic "attack / slam / throw" language that would tell a real beach player the content is thin?

### Task C — Pair session (done together with the founder)

**Goal for the partner**: with the founder, run one pair-focused session of the partner's choosing. The founder drives the app; the partner executes.

Steps:

1. Founder opens the app and sets up **pair, 25-minute session**.
2. Run the session together. Do not use the Swap action during the session itself; Swap is a draft-screen tool, not a courtside one.
3. After the session, both complete the review independently (founder scores their own touches, partner scores theirs).

**What the founder is looking for**:

- Does the pair 25-min layout actually yield a session two people can do together without pausing to reconcile what the app wants?
- Does any setting drill surface in main_skill or pressure via the default selection, or is the app still generating a pass-focused pair session? (Under Tier 1a the answer is likely "pass-focused by default." That is known and expected. What matters is how the partner reacts to that.)
- When the partner sees a drill's courtside copy on the founder's phone at arm's length, can they actually follow it? Or does the founder end up reading it out loud?
- Is the safety-check wording well-calibrated for the pair context, or does it feel over-prescribed for a partner who is not the founder?

## Debrief prompts

Send these after the partner has completed all three tasks. Ask for voice notes if they're willing — voice catches hedging and "uhh, the thing was kind of…" moments that text edits out.

1. **Revisit the upfront commitment.** "Before you saw the app, you told me whether you'd open it again unprompted in the next couple of weeks. Now that you've used it — what's your current honest read? Did using it change your answer?"
2. **First-open feel.** "What was your very first reaction on opening the app? Did you feel like you knew what to do next, or did you have to figure it out?"
3. **Safety-check wording.** "The pain question — did it feel clear to you? If a teammate who just had a sore shoulder from weights answered that, would they know whether to say yes or no?"
4. **Warmup believability.** "The first block was called Beach Prep. Would you actually do those four things on the sand before a real practice, or is that what a warmup app wrote?"
5. **Courtside feel.** "If you were actually on the beach with a ball, would you pull out your phone to follow this, or would you put it down and just hit?"
6. **Drill honesty.** "The serving drills — do they look like what you've done in real practice, or do they sound generic? Any name you recognized? Any name that sounded made up?"
7. **Pair session.** "Was the pair session actually useful for us, or were we going through the motions because I asked you to?"
8. **Review pain.** "The after-session review — would you fill it out every time, sometimes, or never?"
9. **One-change question.** "If you could change one thing about the whole flow, what would it be?"
10. **Open mic.** "Anything you noticed that I didn't ask about?"

**Do not ask the partner** whether the app is "a good product," whether they "would pay for it," or whether they "would recommend it." Those questions produce enthusiasm-not-evidence under the Phase 0 evidence standard (`docs/roadmap.md` Phase 0) and are out of scope for a partner walkthrough.

## 30-day behavioural return window

After the debrief is complete, record the date as the **walkthrough delivery date**. A 30-day clock starts from that date.

**What the founder does during the 30-day window:**

- **Do not** mention the app to the partner. Not in person, not in messaging, not in passing.
- **Do not** ask "did you try it again?" or anything with equivalent content.
- **Do not** send reminders, updates, bug-fix notifications, or "hey, new drills dropped" messages. If a real P0 ships that the partner must know about (e.g. a safety copy regression), that is the only permitted message, and it counts as prompting for the purposes of this window — if the partner then opens the app, it is a **prompted** open and does not count as an unprompted open.
- **Do** keep the app functional and reachable at the same install URL. If the URL changes, that is a prompt event (the partner needs the new URL) and contaminates the window.
- **Do** check the app's Dexie export (or equivalent instrumentation if Tier 1e last-3-sessions tells you) once per week to see whether the partner opened the app. The partner does not log sessions into this repo; the founder infers opens from whatever signal the app surfaces.

**What gets recorded:**

- **Date of walkthrough delivery** (day zero).
- **Binary outcome at 30 days**: partner opened app unprompted (yes / no). If yes, also record: how many times, what session setup each time, completed or abandoned.
- **Any unsolicited mentions from the partner during the window**: what they said, approximate date.
- **Any partner-initiated questions to the founder about the app during the window**: what they asked, what the founder answered. A question from the partner is not prompting; the partner asking is itself the signal. The founder's reply, however, can become a prompt event if it extends beyond answering the specific question.

**Recording format.** Append a `## 30-day outcome` section to the walkthrough ledger (`docs/research/partner-walkthrough-results/YYYY-MM-DD-tier-N-walkthrough.md`) at the end of the 30-day window. Do not wait until the founder-use re-eval to write it up — the signal is freshest within a day or two of the 30-day mark.

**What the outcome feeds.** The adversarial-memo Condition 3 reads directly from this field. Yes → Condition 3 passes for this tier. No → Condition 3 fails for this tier, and the Tier 2 recommendation-first polish effort is repointed per the adversarial memo's falsification consequence.

**What the outcome does NOT feed.** D91 numerical thresholds. A partner walkthrough plus a 30-day window is a single-partner signal; the kill-floor, go-bar, and banded reading in `docs/research/d91-retention-gate-evidence.md` still require stranger-cohort data and are out of reach of this protocol.

## Wording checks (explicit)

These specific prompts must be verified word-for-word against what the partner actually sees on their device during Task A. Screenshot each one if possible:

| Surface | Expected wording (post-`D129`, Tier 1a) | Partner check |
| --- | --- | --- |
| Pain flag | "Any pain that's sharp, localized, or makes you avoid a movement?" with the DOMS-permission line | Partner can read and answer without asking what "localized" means |
| Layoff prompt (when "2+" is tapped) | Progressive-disclosure layoff sub-row (see `D129`) | Partner understands sub-buckets without scrolling away |
| `PainOverrideCard` | Concrete-consequence warning (post-`D129`) | Partner does not dismiss it as generic medical copy |
| `SafetyIcon` expanded state | Expanded emergency list (post-`D129`) | Partner can find the emergency cue within 5 seconds |
| Heat tips | Warning-signs-first restructure (post-`D129`) | Partner can recognize heat exhaustion from the copy alone |
| Beach Prep Three warmup block | Four-component copy (whole-body ramp, ankle proprioception, shoulder/trunk, sand movement rehearsal) | Partner understands what to do in each 45-second window |
| "Chosen because:" block annotation | Single deterministic sentence derived from the builder's ranking output (Tier 1a Unit 1d) | Partner reads it and either nods or flags it as noise; either is a legit data point |
| Home last-3-sessions row | After Task A completes, three rows on Home showing date + focus + completion Y/N (Tier 1a Unit 1e) | Partner finds it when told "check Home after" — but not prompted to |
| BAB vocabulary with inline definitions | First occurrence of Pokey, Tomahawk, Sideout, High Line, Cut Shot includes parenthetical brief definition (Tier 1a Unit 1c) | Partner does not stop on the word; reads past it |
| Regulatory disclaimer | Standard "not medical advice" copy (`D86`) | Partner reads past it without bouncing |

Any mismatch between expected and actual wording goes in the ledger at `P1` or `P0` depending on safety weight.

## Field-note ledger (output format)

Write one ledger in `docs/research/partner-walkthrough-results/` (create the folder if absent) named `YYYY-MM-DD-tier-N-walkthrough.md`. Template:

```
---
id: partner-walkthrough-YYYY-MM-DD-tier-N
title: Partner Walkthrough Results — Tier N — YYYY-MM-DD
status: archival
stage: validation
type: research
summary: "Field-note ledger plus 30-day behavioral-return outcome from the async partner walkthrough for M001 Tier N."
last_updated: YYYY-MM-DD
---

# Partner Walkthrough Results — Tier N — YYYY-MM-DD

## Context

- Build commit: <git sha>
- Tier: N
- Install posture: <iOS version / Android build>
- Prior exposure: <first open | has seen older build | has seen this build>
- Session cadence: <all in one evening | spread across 3 days | etc.>
- Partner's upfront answer to "would you open it again unprompted?" (pre-use): <yes | no | "it depends, honestly" — capture exact wording>

## Observations

| # | Source task | Severity | Observation | Quoted partner wording | Proposed fix |
| --- | --- | --- | --- | --- | --- |
| 1 | A | P1 | Partner hesitated on safety-check pain prompt | "I dunno, I just did legs yesterday, does sore count?" | Consider adding a second example to the DOMS-permission line |
| 2 | B | P2 | Partner asked where the focus toggle was | "Wait, how do I pick serving?" | Tier 1c architectural trigger — log and move on |

## Debrief Q1 vs. actual 30-day outcome

Fill in after the 30-day window closes:

- **Pre-use prediction:** <copied from Context row>
- **Post-use prediction (debrief Q1):** <from voice note or text>
- **Actual unprompted open within 30 days:** <yes | no>
- **Delta:** <align | pre-use was more optimistic | post-use was more optimistic | partner was honestly uncertain and that's fine>

## 30-day outcome

- Walkthrough delivery date: YYYY-MM-DD
- 30-day window ends: YYYY-MM-DD
- Unprompted open observed: <yes | no>
- If yes: <how many opens, what they did, completion status per session, any partner mentions>
- If no: <any unsolicited mentions during window | any questions asked>
- Condition 3 status (adversarial memo): <pass | fail>

## Founder response

Per observation, founder fills in:

- **Accept**: fix lands before next session.
- **Tier 1b / 2 / 1c**: legitimate but belongs to a later surface; name the tier.
- **Wontfix**: acknowledged, explicitly not changing (state why).

## Partner summary

One paragraph in the partner's own words if they provided it, otherwise a brief paraphrase flagged as such.
```

## Severity tags

- **P0** — blocks the next founder or partner session. Fix before using the app again. Examples: safety copy that's missing or wrong, session builder returning an error, a drill appearing in the wrong block slot.
- **P1** — wording or flow confusion that a second user would also hit. Fix during the current Tier. Examples: a drill step that can't be followed without the founder explaining, a safety prompt that's ambiguous on an edge case the partner hit.
- **P2** — polish, noted and scheduled to a later Tier. Examples: a toggle that's functional but hard to discover, a summary line that's honest but dry.
- **wontfix** — explicitly not changing under `D130`. Example: partner wants a cloud-synced history, which is `Phase 1.5` not Tier 2. Document the reason in the ledger so the decision is visible.

## Gate interaction with Condition 3

Per `docs/plans/2026-04-20-m001-adversarial-memo.md` Condition 3, the 30-day outcome is itself a P-severity signal: **a "no unprompted open" outcome escalates any P1 or P2 in the ledger to effective P0 for the purposes of Tier 2 gating.** That is — a walkthrough can end with only polish-level findings but still fail Tier 2 acceptance if the partner never opened the app unprompted. The ledger's severity tags are about code fixes; the 30-day outcome is about whether the product is worth using. The two are scored separately and both gate Tier 2.

## What is **not** in scope for this walkthrough

- **Retention math.** One partner running three tasks plus a 30-day window produces no data on cohort second-session retention. Do not compute or cite any percentage from this walkthrough as evidence against the `D91` gate. The 30-day unprompted-open outcome is qualitative behavioral evidence for `D130`, not `D91`.
- **Main-tool pull evaluation.** "Would you use this instead of notes/PDFs/memory?" is intentionally absent from the debrief. Asking it of a partner who is in the loop with the founder produces a politeness bias. The 30-day behavior substitutes for this question.
- **Medical review.** `D129` already landed physio review; biomechanics coach review is scheduled for the 2026-07-20 re-eval. The partner is not a substitute for either.
- **Feature brainstorming.** The partner may propose features; capture them in the ledger as `P2` or `wontfix`. Do not treat them as Tier 1a scope changes.
- **Repeat walkthroughs for Tier 1a polish.** Tier 1a runs **one** walkthrough round. Subsequent walkthroughs are reserved for Tier 1b and Tier 2 — they are not a means to re-test the same build after wording fixes. If Tier 1a produces P0s that require a second walkthrough, that is itself a Tier 1a acceptance failure and is noted in the adversarial memo's weekly log.

## For agents

- **Authoritative for**: the async partner-walkthrough task list, debrief prompts, wording checks, ledger format, and 30-day behavioral-return window used under `D130`.
- **Edit when**: the task list, the debrief prompt set, the ledger format, or the 30-day window protocol changes; or a new Tier adds surfaces that the partner should exercise.
- **Belongs elsewhere**: stranger-cohort validation protocol (`docs/research/pre-telemetry-validation-protocol.md`), decision rationale for deferring `D91` (`docs/decisions.md` `D130`), Tier scope (`docs/milestones/m001-solo-session-loop.md` and `docs/plans/2026-04-20-m001-tier1-implementation.md`), founder session log (`docs/research/founder-use-ledger.md`), pre-registered falsification conditions (`docs/plans/2026-04-20-m001-adversarial-memo.md`).
- **Outranked by**: `docs/decisions.md`, `docs/milestones/m001-solo-session-loop.md`, `docs/plans/2026-04-20-m001-adversarial-memo.md` (Condition 3 reads from this file's 30-day outcome and outranks any ledger-severity interpretation here).
- **Key pattern**: a new ledger file per Tier walkthrough under `docs/research/partner-walkthrough-results/YYYY-MM-DD-tier-N-walkthrough.md`. One ledger per walkthrough run; append the 30-day outcome to the same file after the window closes rather than creating a separate file.
