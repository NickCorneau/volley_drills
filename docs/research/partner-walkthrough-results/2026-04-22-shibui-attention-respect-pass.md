# Second pass — shibui, attention, and respect for the amateur

**Date:** 2026-04-22
**Companion to:** `2026-04-22-manual-ui-design-review.md` (structural / visual pass). This doc deliberately does not repeat layout findings; it re-reads the same walkthrough through a narrower lens.

## The lens

One question, asked at every surface:

> Would a tired amateur — someone who came to touch the ball, not fill out a form — feel respected by this screen, or feel like the app is asking them to do the work?

Three sub-rubrics:

1. **Shibui.** Not "minimalism." Refined understatement. The coach who talks least while still being helpful is the most respected coach. Every on-screen sentence, label, or glyph that doesn't earn its place is noise, and noise breaks the shibui contract.
2. **Attention span / decision fatigue.** Every tap, every choice, every "pick a number" is a small tax. The only place this app gets paid is on the court. Everything else is overhead the athlete pays in attention.
3. **Respect for the amateur.** Do not assume fluency they don't have. Do not grade their workout. Do not take credit for your own choices. Do not put a clock on their post-workout moment.

## The decision-fatigue math

Counting explicit user decisions across one full loop (New-user → Setup → Safety → 4 blocks → Review → Complete). Not counting involuntary taps like "Start" or "Continue":

| Surface          | Decisions | Copy load (approx words) |
|------------------|-----------|--------------------------|
| Skill level      | 1 (of 5)  | ~35                      |
| Today's setup    | 5         | ~30                      |
| Safety           | 2 (+1 if `2+`) | ~60 (expander extra)|
| Run × 4 blocks   | ~8 (Pause/Next/Swap/expand note) | ~400–600 (drill + reason + note × 4) |
| Review           | **up to 17** (1 RPE + 2 counts + 4 tags + notCaptured + note + submit/finish) | ~100 |
| Complete         | 1         | ~55                      |
| **Total**        | **~34**   | **~650–850 words**       |

For comparison: a runner using Stopwatch makes **1 decision** and reads **0 words**. A Peloton-style guided workout reads ~0 words during the block and makes ~0 decisions — the coach drives. Volleycraft is self-coached, so some of this is unavoidable; the question is which items are earning their cost.

## The biggest single violation: "Chosen because: …"

On every Run screen, under the drill name, sits a line like:

> Chosen because: every session opens with a sand-specific warmup.
> Chosen because: today's main passing rep.
> Chosen because: low-intensity passing rep to groove the pattern.
> Chosen because: every session closes with a cooldown downshift.

This is the app **explaining itself to the athlete**. It is the opposite of shibui. A good coach does not, drill by drill, defend why this drill was chosen. They say "warm up." Then they say "pass up to yourself." Then they say "stretch." The athlete trusts them or they don't — trust is not won by footnotes.

Every one of these lines is:

- reading work the athlete didn't ask for, at the worst reading moment (about to start moving),
- a subtle "please rate my reasoning" ask,
- accent-colored gray noise between the H1 and the timer — the two things the athlete came to see.

**Recommendation:** Delete `Chosen because:` from Run entirely. Keep the reason-trace in the session object and surface it on-demand in one place (the Swap drill bottom sheet, or a future history screen) — that is where a tester who *wants* to audit the build would look, not mid-block. The Japanese direction note explicitly says "progressive disclosure instead of upfront explanation." This is the loudest upfront explanation in the app.

## The Review screen is asking an exhausted person to do the app's job

Fifteen tap targets, plus a textarea, on a screen reached 15–40 minutes after the athlete last sat down. In order:

1. **"How hard was your session?"** — 11 numbered tiles, 0 to 10. This is an RPE scale. RPE is a sports-science tool; most amateurs have never heard the acronym. Asking for 11-point granularity on an ordinal scale they don't formally use is precision theatre: the app gets a number, the amateur gets decision paralysis between 6 and 7.
2. **"Good passes" Good / Total.** Two numeric inputs. This requires the athlete to have **tracked counts during a workout where no feature asks for counts**. Nothing on the Run screen counts for you. Nothing beeps when you make a pass. So the amateur is being asked to reconstruct, from memory, after the fact, two numbers they have no reliable way to produce. Even the component's own JSDoc (read: the author) acknowledges this is "a guess at best" for most drill types.
3. **"Success rule: ball reached the target zone or the next contact was playable. If unsure, don't count it as Good."** — rules-lawyering, post-workout, negative-imperative. This one sentence does more damage than any other copy in the app. It reframes the workout as a test the athlete might fail at *grading*.
4. **Quick tags** (Too easy / About right / Too hard / Need partner) — four more chips, visually indistinguishable from plain text (see first-pass finding), optional but present.
5. **Short note (optional)** — textarea, optional, but visible.
6. **Submit** vs. **Finish later** — and "Finish later" is the smaller of the two, below the primary. The exit the tired athlete would use is secondary.
7. **"This session stops counting in about 2 hr, then it won't affect planning."** — a countdown for the athlete's feelings about the session. The one moment the app should not be putting a clock on them.

**If the goal is "capture enough signal to plan the next session,"** the app has far more signal than it needs here. Effort alone, binned to three buckets (easy / right / hard), is more than enough for adaptive planning. The rest is data-harvesting dressed as "quick review."

### What respectful Review looks like

Cut in the order that hurts least:

1. **Delete "Good passes" entirely by default.** The JSDoc already knows it's wrong for most drill types; the notCaptured pre-select is treating the symptom, not the cause. Bring it back only as an opt-in power-user surface, or when a specific drill asks for counts.
2. **Collapse RPE 0–10 into the three labelled anchors you already show** (easy / moderate / hard) — three tiles. If a power user wants the 11-point scale later, that's a setting. The labels the app already writes under the grid *are* the real information content.
3. **Delete the "Quick tags" card.** It duplicates what RPE + a note already captures ("Too easy" == effort 3, "Too hard" == effort 8, "Need partner" is out-of-scope for a solo-first loop and belongs on next session's setup, not last session's review).
4. **Delete the success-rule copy.** If Good/Total stays anywhere, replace the rule with a single verb: "Rough guess is fine."
5. **Move "Finish later" above Submit, same weight, outline style.** The tired athlete should see the graceful exit first. Submitting a review is the power move; skipping it is the default.
6. **Delete the 2-hour countdown copy.** The cap can still exist in the contract; it does not need to be read out to the athlete.

Net result: Review drops from ~17 decisions to **1 (effort)**, optionally 2 (note). Completion time drops from ~60 s of form-filling to ~5 s of "I'm done."

This single change is worth more than any typography or spacing work in either doc.

## Vocabulary that assumes fluency the amateur doesn't have

Spotted in this walkthrough alone:

- **"Side-out builders"** — skill-level option. "Side-out" is volleyball-specific; a beach-curious amateur will either guess or bail. "Can pass-set-attack once in a while" would carry the same meaning with zero jargon.
- **"Rally builders"** — less bad but still inside-baseball. "Can keep a few passes alive" is universal.
- **"Rebuild your platform"** — drill text. "Platform" is the forearm-pass surface. Beginners don't know this yet. "Forearms back together" says the thing.
- **"Athletic posture"** — coaching note. Real. Means nothing to a first-timer. "Knees soft, weight on balls of feet" is longer but teaches.
- **"Pass-grade-avg," "composite," "points-to-target"** — metric types (internal, but the UX decisions above leak from them). Keep them in the model, don't surface them.

This is not "dumbing down." This is respecting that a self-coached amateur is, by definition, someone who has not been coached yet. Vocabulary is the first thing a good coach teaches and the last thing a good coach tests.

## Accent color drift (a quiet shibui violation)

Orange is supposed to be "one accent, used deliberately for action or status." In practice orange is also carrying:

- phase labels (`Warm up`, `Work`, `Transition`) at the top of Run / Transition,
- session summary line on Safety (`Solo + Open · 15 min, 4 blocks`),
- `Today's verdict` eyebrow on Complete,
- `Chosen because:` reason text color,
- coaching-note body text,
- safety-screen `Heat & safety tips` link,
- the `←` back links everywhere.

That's one accent doing seven jobs. Every additional job dilutes the signal. The strict shibui read: **accent = this is the action you can take right now, or the state of the one thing you are doing right now.** Everything else — section labels, drill metadata, disclosure links, phase eyebrows — should be a quiet neutral or typographic-weight distinction, not accent-colored.

The cheapest win here is demoting `Chosen because:` (already proposed for deletion) and the phase eyebrow to `text-primary` at smaller scale. Orange stays for Next / Pause / Start next / Submit / Repeat this session. Action only.

## The app is asking for credit it shouldn't need

Four places where Volleycraft signals "I did something clever, please acknowledge":

1. **"Chosen because: …"** — the app volunteering its reasoning, drill by drill. (Fix above.)
2. **"We'll switch to a lighter session if yes"** on the pain question. This one is good — it tells the user what will happen to *them*. Keep.
3. **"0 days or First time means a shorter, lower-intensity start"** on recency. Same pattern: the app describing its own adaptation. The user only needs to know "today" or "first time." The consequence copy is the app asking for praise.
4. **Session-recap table on Complete.** "Drills completed: 4/4. Good passes: —. Effort: Moderate." The 4/4 is information; the rest is the app handing back what the user just entered. A session recap that reads "Nice session. Same kind next time?" would be warmer, shorter, and more respectful than a ledger of what the user did for the app.

Shibui coach: does not itemize their own choices.

## Respect for the amateur athlete (specific misses)

1. **The post-workout countdown clock.** "This session stops counting in about 2 hr." The athlete just finished a workout. The one time they should not be on a clock. Delete the sentence; keep the cap in the model.
2. **Asking training recency after the first session exists.** The app can count days since the last logged session itself. Asking "when did you last train?" when the answer is literally in its own Dexie tables is a tax on the user and a small confession that the app doesn't trust its own data. For returning users: auto-fill, show "Today — tap to change." For first-timers only: ask.
3. **Asking `Wind`, `Net`, `Wall` every session.** Wind can change day to day, reasonable to ask. Net and Wall almost never change — they are properties of your home court. Ask once, remember, offer a one-tap "conditions different today?" escape. Current design asks all three every session. For a 3× / week user that is 6 unnecessary taps per week.
4. **The two-row Yes/No muscle-memory trap on Safety** (already flagged in Player 3 note and first-pass doc). Two boolean questions in a row with the same chip layout is a respect-miss: it assumes the user reads before tapping, and penalizes them for the completely human act of skimming.
5. **The "5 options" starting screen for a solo-first product.** Skill level as the *first* onboarding question puts an identity claim on the amateur before they've touched the ball. Many amateurs genuinely don't know which band they're in, and "Not sure yet" — while humane — is the fifth option, visually tied with the others. A shibui onboarding would default to "Not sure yet → start light" and make the skill pick an optional thing to adjust from Settings after the first session. The app already has "Not sure yet" copy that says exactly this: *"We'll size a light starter — you can change this after."* Make that the path, not the escape.
6. **Run screen carries four textual regions** (drill body, numbered steps, coaching note card, "Chosen because") plus timer and controls. Shibui Run would carry: drill name, timer, one 3–6-word cue, Pause / Next. Everything else on expand. The outdoor brief (`docs/research/outdoor-courtside-ui-brief.md`) makes the same point structurally; this is the attention-respect framing of the same critique.

## Where the app already gets this right (do not touch)

- **The Transition screen.** One thing finished, one thing next, one button. Textbook shibui. No copy defending itself. No extra asks.
- **The Complete-screen verdict copy** ("Session 1. One more in the book. Ready when you are."). Eight words, one warm image, zero asks. This is the voice the rest of the app should match.
- **The save-status line** on Complete. It says the exact true thing, and gets out of the way. Trust, built in one sentence.
- **The `═` ornament above the verdict.** One piece of jewelry, earned. Do not add a second.
- **Settings minimalism.** One card, one button. Correct.
- **The `notCaptured` pre-select on non-count drills.** The author already knows Review is asking too much; the pre-select is a patch. Turn the patch into the default by cutting the card (see Review section).

## Prioritized cuts

Ordered by "attention tax recovered per line of code changed":

1. **Delete "Chosen because: …" from Run.** ~5 min of work. Biggest single shibui win in the app. (Preserve the reason-trace in the data model.)
2. **Collapse RPE 0–10 → 3 anchors (easy / moderate / hard) by default.** Power users keep the 11-point as a setting. Removes 8 decisions from Review.
3. **Hide "Good passes" card by default**, show only when the drill's `successMetric.type` is count-based. Remove the success-rule sentence entirely.
4. **Delete the Quick-tags card.** RPE + note already carry its signal.
5. **Move "Finish later" above "Submit" with outline-button weight.** The graceful exit is the default; the data is the upsell.
6. **Delete the "stops counting in ~2 hr" copy.** Keep the cap in the model.
7. **Remember `net` / `wall` across sessions.** Ask only on first setup and on explicit "conditions different today."
8. **Auto-fill training recency** from the app's own logs for returning users.
9. **Demote accent color** on `Chosen because:`, phase eyebrows, session-summary subhead, and section labels. Reserve orange for action only.
10. **Rewrite "Side-out builders" → "Can pass-set-attack once in a while"** and the three other jargon labels flagged above.

## What the product voice should sound like after this pass

Before (today's Review):

> How hard was your session?
> Tap a number to rate effort
> [0 1 2 3 4 5]
> [6 7 8 9 10]
>
> Good passes
> Success rule: ball reached the target zone or the next contact was playable. If unsure, don't count it as Good.
> [Good: 0]   [Total: 0]
> Couldn't capture reps this time
>
> Quick tags
> Too easy · About right · Too hard · Need partner
>
> Short note (optional)
> [Anything else?]
>
> [Submit review]  (disabled)
> Finish later
> This session stops counting in about 2 hr, then it won't affect planning.

After:

> How did that feel?
> [Easy]  [Right]  [Hard]
>
> [ Done ]
> (Add a note) · (Skip this)

One question. One tap. Two quiet escapes. Same signal the planner actually uses. A respected athlete. A finished workout.

That is the real definition of "joy to use" in 2026 — not delight features, not micro-interactions, not a clever ornament. Permission to stop.
