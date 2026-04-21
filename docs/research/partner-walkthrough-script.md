---

## id: partner-walkthrough-script

title: Partner Walkthrough Script (Two-Pass, Founder-Use Mode)
status: active
stage: validation
type: research
authority: "Operational two-pass partner walkthrough protocol under `D130`. Pass 1 = solo async questionnaire the partner runs alone. Pass 2 = paired courtside run-through. Outputs one field-note ledger plus a 30-day unprompted-open outcome that feeds the `docs/plans/2026-04-20-m001-adversarial-memo.md` Condition 3."
summary: "Action-format script. Pass 1: send partner the paste block + tasks + questionnaire; they run alone. Pass 2: founder and partner run a pair session on sand, brief debrief. 30-day quiet window starts at Pass 2 close. One ledger, binary return outcome."
last_updated: 2026-04-21-a
depends_on:

- docs/decisions.md
- docs/milestones/m001-solo-session-loop.md
- docs/plans/2026-04-20-m001-tier1-implementation.md
- docs/plans/2026-04-20-m001-adversarial-memo.md
related:
- docs/research/pre-telemetry-validation-protocol.md
- docs/research/d91-retention-gate-evidence.md
- docs/research/founder-use-ledger.md
decision_refs:
- D91
- D123
- D129
- D130

# Partner Walkthrough Script (Two-Pass, Founder-Use Mode)

## TL;DR

- **Pass 1:** partner alone on their phone. Two solo sessions + an 11-question questionnaire. Async, ~25 min.
- **Pass 2:** founder + partner together on sand. One pair session + a 5-question debrief. Synchronous, ~30 min.
- **30-day quiet window** starts at Pass 2 close. Founder says nothing about the app; outcome is binary (did the partner open it unprompted, yes/no).
- One ledger file covers both passes + the 30-day outcome. Frame it as a test the app can fail — not feedback gathering.

## Preconditions (founder checklist)

- Tier 1a merged; founder ran ≥2 full sessions on sand.
- Install URL is live on Cloudflare (not localhost).
- Partner has not seen this build before.
- Court booked for Pass 2 within 2–10 days of Pass 1 delivery.
- Founder commits to the 30-day quiet window. If not sure, don't run it yet.

---

## Pass 1 — Solo (async, partner alone)

### Send this to the partner (paste block)

> Hey — I built a beach volley app and I want to test it honestly with you, not run a feedback session.
>
> It's **two parts, ~45 min total**:
>
> - **Part 1 (alone, ~25 min):** you open it cold, run two short sessions, fill in a short questionnaire. No me in the room.
> - **Part 2 (together, ~20 min):** we run one pair session on sand.
>
> **Before you open it, answer this honestly:** if Part 1 is actually useful to you today, would you open the app on your own in the next couple of weeks without me asking? Not a promise — just your read right now. Send me a one-liner before you tap the link.
>
> Then:
>
> 1. Open the link on your phone. Add to Home Screen when prompted.
> 2. Run the two tasks below. Don't ask me anything during — confusion is the data.
> 3. Answer the 11 questions at the bottom. Voice notes fine. Be brutal.
> 4. Text me when you're done. We book Part 2.
>
> After Part 2 I won't bring the app up for 30 days. If you open it, cool. If not, that's the real answer.
>
> **This is a test the app can fail.**
>
> Install URL: `<paste>`
>
> ---
>
> **Task 1 — first-open, solo default session**
>
> 1. Open the link. Add to Home Screen.
> 2. Set up a **solo, 15-min session today**. Let the app pick the focus.
> 3. Go through the safety check honestly.
> 4. Run the full session. Don't skip blocks. Driveway or living-room floor is fine.
> 5. Complete the review.
> 6. Screenshot the `Complete` screen and send it.
>
> **Task 2 — solo, steer to a different main drill**
>
> 1. Close the app. Reopen from the Home Screen icon.
> 2. Set up another **solo, 15-min session**.
> 3. On the draft screen, if the main drill is the same one you ran in Task 1, tap **Swap** once to see a different drill. Tap again if you want to try another. Note which drill you ran and roughly how many Swaps you tapped.
> 4. Run it. Complete the review.
>
> *(Founder note: Task 2 intentionally uses "a different main drill" rather than "a serving drill." Serving drills are gated on `netAvailable = yes`; running Task 2 on `solo_open` with no net will never surface one, and partner steering toward a specific focus becomes a swap-loop rather than a Swap-UX test. See `docs/research/partner-walkthrough-results/2026-04-21-tier-1a-walkthrough.md` P1-3.)*
>
> ---
>
> **Questionnaire (one or two sentences each; voice notes fine):**
>
> 1. Did using the app change your opening "would I open it again?" answer? Which direction?
> 2. First reaction on opening — did you know what to do, or did you have to figure it out?
> 3. The pain question — clear? If a teammate with sore shoulder from weights saw it, would they know how to answer?
> 4. The first block (Beach Prep) — would you actually do those four things before a real practice, or is that warmup-app filler?
> 5. Each block had a one-sentence "why this drill" line. Did you read them? Useful, noise, or didn't notice?
> 6. The main-skill drills — do they look like what you've done in real practice, or generic? Any name you recognized? Any that sounded made up?
> 7. When you tapped Swap — did that feel like the right gesture, or did you expect a focus toggle?
> 8. After each session, Home shows your recent sessions. Did you notice? Useful or just more stuff?
> 9. The after-session review — would you fill it out every time, sometimes, never?
> 10. One thing you'd change about the solo flow?
> 11. Anything I didn't ask about?

### Founder actions after Pass 1

- Write up Pass 1 section of the ledger (observations + wording-check outcomes + questionnaire responses).
- **If any P0 surfaced: fix and redeploy before Pass 2 runs.** Pass 2 can't verify on top of a broken artifact.
- Book Pass 2.

---

## Pass 2 — Courtside (synchronous, on sand when possible)

### Pass 2 preconditions

- Pass 1 ledger section written; any P0 fixed and deployed.
- Beach court booked. Non-sand fallback (grass/hard court) is allowed but flagged in the ledger — Q3 signal is weaker.
- Don't reschedule on mild wind (that IS the test). Do reschedule on lightning or heat emergency.
- Ball. Net preferred, not required.

### Founder opener (paraphrase, don't read verbatim)

> Same honesty rule as Part 1. I drive the phone, you play. If the app says something that doesn't match what you'd actually do, say so. If you can't read the copy at arm's length, say so. If you'd normally put the phone down and hit, do that — tell me when it lost you.

### Pass 2 task — pair 25-min session

1. Founder opens the app. Sets up **pair, 25-min session**. Net availability + wind honest.
2. Both go through the safety check (founder answers for themselves; partner verbally if they want).
3. Run the session. Founder reads block copy aloud for the first rep of each block only; then lets the partner execute. **No Swap mid-session.**
4. Partner can say "stop" at any time — that's the signal, not a failure.
5. Both complete the review independently.
6. Move to shade.

### Pass 2 debrief (5 questions)

1. If you were here without me, would you pull out the phone to follow this, or put it down and hit?
2. When I read block copy aloud — was that helpful, or was the text actually unreadable at arm's length?
3. Was the pair session genuinely useful, or were we going through the motions?
4. Anything that was easy at home but awkward on sand — or the reverse? (If Pass 2 ran on grass or a non-sand fallback, substitute the actual surface.)
5. One thing you'd change about the pair flow?

### Founder actions after Pass 2

- Log debrief into the ledger within 24h. Same-day strongly preferred.
- Start the 30-day clock now.

---

## 30-day quiet window

**Clock starts at Pass 2 close.** (If Pass 2 is skipped within 10 days, walkthrough ends as Pass-1-only and clock starts at Pass 1 close.)

**Don't:**

- Mention the app to the partner in any context.
- Ask "did you try it again?" or anything equivalent.
- Send updates, reminders, or bug-fix pings (exception: a real P0 ship note — and that note counts as prompting).

**Do:**

- Keep the URL live and unchanged.
- Check Dexie export (or the Home last-3-sessions row if visible) once a week.
- Log any unsolicited partner mentions or partner-initiated questions, with approx date.

**Record (at the 30-day mark):**

- Clock-start date + end date.
- Binary outcome: unprompted open, yes/no. If yes: count, session setup, completion.
- Partner mentions / questions during the window.
- Condition 3 status: pass (yes) | fail (no).

---

## Wording checks (verify against the live app)

Screenshot each one where possible.


| Surface                  | Expected (post-`D129`, Tier 1a)                                                              | Verified in     | Pass if…                                                                |
| ------------------------ | -------------------------------------------------------------------------------------------- | --------------- | ----------------------------------------------------------------------- |
| Pain flag                | "Any pain that's sharp, localized, or makes you avoid a movement?" + DOMS line               | Pass 1          | Partner answers without asking what "localized" means                   |
| Layoff prompt (tap "2+") | Progressive-disclosure sub-row (`D129`)                                                      | Pass 1          | Partner picks a sub-bucket without scrolling away                       |
| `PainOverrideCard`       | Concrete-consequence warning (`D129`)                                                        | Pass 1          | Partner doesn't dismiss it as generic medical copy                      |
| `SafetyIcon` expanded    | Emergency list (`D129`)                                                                      | Pass 1          | Partner finds the emergency cue in <5s                                  |
| Heat tips                | Warning-signs-first (`D129`)                                                                 | Pass 2          | Partner can recognize heat exhaustion from the copy alone, in real heat |
| Beach Prep Three         | Four components: ramp / ankles / shoulder+trunk / sand movement                              | Pass 2          | Partner knows what to do in each 45-s window on sand                    |
| "Chosen because:"        | One deterministic sentence (Tier 1a Unit 4)                                                  | Pass 1 + Pass 2 | Partner nods or flags as noise — either is a valid read                 |
| Last-3-sessions row      | 2+ rows after Task 2 (date / focus / Y-N) (Tier 1a Unit 5)                                   | Pass 1          | Partner finds it when asked; bonus if noticed unprompted                |
| BAB vocabulary           | Pokey, Tomahawk, Sideout, High Line, Cut Shot — defined inline on first use (Tier 1a Unit 3) | Pass 1          | Partner reads past the word without stopping                            |
| Regulatory disclaimer    | Standard "not medical advice" (`D86`)                                                        | Pass 1          | Partner doesn't bounce                                                  |


Any mismatch → ledger at `P1` or `P0` depending on safety weight.

---

## Ledger template

One file per Tier walkthrough at `docs/research/partner-walkthrough-results/YYYY-MM-DD-tier-N-walkthrough.md`.

```
---
id: partner-walkthrough-YYYY-MM-DD-tier-N
title: Partner Walkthrough Results — Tier N — YYYY-MM-DD
status: archival
stage: validation
type: research
summary: "Two-pass ledger + 30-day behavioral outcome for M001 Tier N."
last_updated: YYYY-MM-DD
---

# Partner Walkthrough Results — Tier N — YYYY-MM-DD

## Context
- Build commit: <sha>
- Tier: N
- Install: <iOS/Android version>
- Prior exposure: first open | older build | this build
- Pass 1 delivered: YYYY-MM-DD
- Pass 1 closed: YYYY-MM-DD
- Pass 2 date + location: YYYY-MM-DD · sand | non-sand | skipped
- Pre-use answer ("would you open it unprompted?"): <verbatim>

## Protocol deviations

List every place the execution of this walkthrough deviated from the script above, and which rows the deviation weakens. Leave the section with the single line "None." if the walkthrough ran clean. This section is required; silent deviations are the dominant failure mode of founder-executed research.

Common deviations to check against:
- Pass 1 not fully async (founder present during tasks or questionnaire).
- Pass 2 on a non-sand surface.
- Read-aloud step skipped, or block copy read aloud for more than the first rep.
- Swap used mid-pair-session.
- 30-day window started late, or the founder prompted the partner during the window.

## Pass 1 observations
| # | Task | Severity | Observation | Partner quote | Proposed fix |
| - | ---- | -------- | ----------- | ------------- | ------------ |

## Pass 1 questionnaire (11 answers)
Paste verbatim or paraphrase voice, flagged as such.

## Pass 2 observations
| # | Task | Severity | Observation | Partner quote | Proposed fix |
| - | ---- | -------- | ----------- | ------------- | ------------ |

## Pass 2 debrief (5 answers)

## Commitment-question track
- Pre-use: <from framing>
- Post-Pass-1 (Q1): <from questionnaire>
- Post-Pass-2 (debrief Q1): <from debrief>
- Actual 30-day unprompted open: yes | no
- Delta: align | pre-use too optimistic | post-use too optimistic | honestly uncertain

## 30-day outcome
- Clock start: YYYY-MM-DD
- Window ends: YYYY-MM-DD
- Unprompted open: yes | no (if yes: count, setup, completion)
- Partner mentions / questions during window:
- Condition 3: pass | fail

## Founder response
Per observation: Accept | Tier 1b/1c/2 | Wontfix (with reason).

## Partner summary
One paragraph. Partner's words if possible, otherwise paraphrase (flagged).
```

---

## Rules of the road

- **Severity**: `P0` blocks the next session (fix before any further use). `P1` = confusion a second user would also hit (fix this Tier). `P2` = polish (later Tier). `wontfix` = acknowledged, not changing — state why.
- **Pass 1 P0s block Pass 2.** Fix and redeploy before the court day.
- **Condition 3 escalation:** a "no unprompted open" 30-day outcome escalates **every P1 and P2 in the ledger to effective P0 for Tier 2 gating**, regardless of pass. Code-severity and product-worth are scored separately; both gate Tier 2.
- **Do not ask** whether the app is "good," "worth paying for," or "recommendable." Those produce enthusiasm, not evidence.
- **One walkthrough per Tier.** A post-fix Pass 2 continues the same walkthrough; it is not a re-run. A required re-walkthrough IS itself a Tier acceptance failure.

## Out of scope

- Retention math (n=1; the 30-day outcome is qualitative for `D130`, not `D91`).
- Main-tool pull evaluation (politeness bias; 30-day behavior substitutes).
- Medical review (physio done under `D129`; biomech scheduled 2026-07-20).
- Feature brainstorming (log as `P2` or `wontfix`, don't scope-creep Tier 1a).

## For agents

- **Authoritative for**: Pass 1 paste block, Pass 1 questionnaire (11 Qs), Pass 2 task + debrief (5 Qs), 30-day window rules, ledger format, pass-skip fallback.
- **Edit when**: pass structure, task list, question set, ledger shape, or 30-day rules change; or a new Tier adds partner-facing surfaces.
- **Outranked by**: `docs/decisions.md`, `docs/milestones/m001-solo-session-loop.md`, `docs/plans/2026-04-20-m001-adversarial-memo.md` (Condition 3 reads this file's 30-day outcome).
- **Key pattern**: one ledger file per Tier; Pass 1 + Pass 2 + 30-day outcome live in the same file.

