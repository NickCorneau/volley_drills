---

## id: m001-adversarial-memo
title: "M001 Adversarial Memo — Pre-Registered Falsification Conditions for D130"
type: plan
status: active
stage: build
authority: "Pre-registers the falsification conditions, decision rule, and ritual that install an adversary against D130's founder-use posture. Authored before Tier 1a begins so the hypotheses are locked in before ambiguous evidence arrives. Any deviation from the conditions below at the 2026-07-20 re-eval requires an explicit written amendment to this memo, co-signed by a named non-founder reader."
summary: "Three pre-registered falsification conditions (solo-first, trust-surface deferral, partner behavioral return), an asymmetric default decision rule at the re-eval, a weekly 3-minute trigger review ritual, and an authoring budget tied to dogfooding — installed together so the founder-use mode authorised by D130 cannot quietly become permanent."
last_updated: 2026-04-20
depends_on:
  - docs/vision.md
  - docs/decisions.md
  - docs/milestones/m001-solo-session-loop.md
  - docs/plans/2026-04-20-m001-tier1-implementation.md
  - docs/research/d91-retention-gate-evidence.md
  - docs/research/founder-use-ledger.md
  - docs/research/partner-walkthrough-script.md
related:
  - docs/reviews/2026-04-20-m001-red-team.md
decision_refs:
  - D91
  - D123
  - D130
  - D131
open_question_refs:
  - O5

# M001 Adversarial Memo — Pre-Registered Falsification Conditions for D130

## Agent Quick Scan

- This memo is the pre-registered adversary against `D130` founder-use mode. Read it before writing any Tier 1a code and again every Monday during the 90-day re-eval window.
- Authoritative for: the three falsification conditions, the default decision rule at the 2026-07-20 re-eval, the weekly trigger-review ritual, and the authoring-budget cap.
- Not authoritative for: Tier 1a scope (that's `docs/plans/2026-04-20-m001-tier1-implementation.md`), the D91 numerical bar (that's `docs/research/d91-retention-gate-evidence.md`), or the partner walkthrough protocol (that's `docs/research/partner-walkthrough-script.md`).
- Amendment rule: this memo can be edited, but **the three falsification conditions cannot be weakened** without a written justification naming the specific evidence that made the previous condition too strict, co-signed by a named non-founder reader. That rule exists to prevent the gradual drift that is the single thing founder-use mode is most at risk of.

## Why this memo exists

`D130` removed the D91 retention gate as a blocker for M001 build, authorizing founder-use mode with a 2026-07-20 re-evaluation. The red-team review (`docs/reviews/2026-04-20-m001-red-team.md`) surfaced one structural risk stronger than any individual plan bug: **founder-use mode has no adversary in the room by default**. The founder is builder, sole user, evaluator, and scribe. All three of D130's original early triggers point down (under-use); none point up (success-by-founder-only is still a risk state). The re-eval has no decision rule. There is no mechanism for a finding of "this actually worked" to force external validation.

This memo installs the adversary. The founder wrote it while building the plan. If at the re-eval the founder notices the temptation to narrate around these conditions — that temptation itself is one of the signals this memo is meant to catch.

## Three falsification conditions (pre-registered)

Each condition states a **specific behavioral threshold** and a **specific consequence if the threshold is missed**. The consequences are pre-committed, not up for debate at the re-eval.

### Condition 1 — Solo-first activation is load-bearing

**Pre-registered claim.** The product vision and roadmap treat solo-first as the primary activation path (`D22`, `D60`; `docs/vision.md` P-whatever on solo-first; `docs/roadmap.md` Phase 0 solo-first anchor). Founder-use mode's validity as a stand-in for real validation depends on the founder actually training solo a majority of the time.

**Threshold.** Across the 90-day re-eval window (2026-04-20 → 2026-07-20):

- **≥40%** of founder-logged sessions in `docs/research/founder-use-ledger.md` have `playerMode: solo`.
- AND **≥3** logged sessions have `sessionFocus: set` (regardless of playerMode) — the minimum to say setting content is touched, not shelved.

**Falsification consequence.** If solo share falls below 40% OR if fewer than 3 set-focused sessions are logged, **Tier 2 must re-sequence to put pair-first activation ahead of solo-first trust surfaces**. Specifically: the `D123` "recommendation-first first-run" polish is repointed at a pair-default first-run instead of solo-default. The founder does not get to say "but I personally preferred pair" and proceed with solo-first — the behavioral data said the vision's solo-first premise is wrong for the actual use pattern, and the product has to follow the behavior.

**Why this threshold.** Solo-first is the hardest premise to confirm from n=1, because a founder with a willing partner will naturally drift to pair. 40% is low enough to accommodate realistic drift; below that, the premise is behaviorally falsified even if the founder feels otherwise. The 3-set-session floor is separate because set content could otherwise be authored-and-shelved without being falsified.

### Condition 2 — Trust surfaces deferred to Tier 2 are not silently routed around

**Pre-registered claim.** Tier 1a intentionally defers "See why this session was chosen," richer summary copy, and full session history to Tier 2. This deferral only holds if the founder does not route around those surfaces by keeping session planning or history in another tool (Notes, paper, spreadsheet, another app).

**Threshold.** Across the 90-day window:

- The founder plans **zero** sessions outside the app. A session is "planned outside the app" if the founder writes down what they will do before opening the app, or if the founder decides what to do mid-session by consulting any source other than the app.
- The founder maintains **zero** session history outside the app. "Session history outside the app" includes a running note of dates trained, drills run, or RPE, if that note is being referred back to later.

**Falsification consequence.** If *any* outside-app planning or history-keeping occurs, **Tier 2 trust surfaces move forward into Tier 1b, not Tier 2**. Specifically: the one-line "chosen because" annotation and the 3-row history list (both promoted into Tier 1a per `docs/plans/2026-04-20-m001-tier1-implementation.md`) are not sufficient; the richer See-Why surface and the full session history screen ship before any further content authoring. The reasoning: the outside-app artifact is evidence that Tier 1a's trust surfaces are under-specified for the founder's real needs, and shipping more content on top of an under-specified trust base is building on sand.

**Why this threshold.** Zero is the right number because the founder cannot be partially out-of-app. Any notes-app fallback is the founder saying the product doesn't meet a real need; the response has to be to meet the need, not to accumulate more content. This is the hardest condition to honor. The founder should expect to fail it once and respond honestly.

### Condition 3 — Partner behavioral return (post-walkthrough)

**Pre-registered claim.** The partner walkthrough (`docs/research/partner-walkthrough-script.md`) is not a D91 cohort and cannot measure retention. It *can* measure whether the partner chose to open the app unprompted after the walkthrough — a weak but real behavioral signal.

**Threshold.** Within 30 days after the Tier 1a walkthrough delivery date:

- The partner opens the app **≥1x unprompted** — defined as without the founder asking, reminding, or referring to it in conversation. A "did you try the app?" counts as prompting and invalidates the signal for that 30-day window.

**Falsification consequence.** If the partner does not open the app unprompted within 30 days, **the partner walkthrough ledger is treated as regardless-of-severity P0** for the purpose of Tier 2 gating, and the Tier 2 recommendation-first polish effort is repointed at "what would have made the partner open it." This applies even if the walkthrough ledger itself contained only P1 and P2 observations. The reasoning: the walkthrough's stated purpose is to generate build authority for Tier 2; if the partner's behavior says the app wasn't worth opening, no ledger of wording fixes substitutes for that signal.

**Why this threshold.** 30 days is long enough to let ordinary forgetfulness pass and still capture intent. "Unprompted" is the entire signal — prompted opens are evidence of partner politeness, not product pull. One unprompted open is a weak-but-real signal; zero is strong-and-negative.

**Telemetry constraint (pre-registered with this condition, codified in `D131`).** Condition 3's signal requires that the partner have plausible deniability that no one is counting opens. Adding any remote telemetry, app-open counter, or shared "admin view" during the 90-day window corrupts the signal, because consent disclosure turns an unprompted open into a possibly-socially-obligated open, and a partner who knows opens are counted is no longer testing product pull. Therefore, **no telemetry, no network call on session end, no remote counter of any kind ships during the 90-day window**, full stop. Local `ExecutionLog` / `SessionReview` in Dexie remain the only session record; founder self-inspection happens through `docs/research/founder-use-ledger.md`, not through an in-app analytics surface.

This constraint is **a pre-registered falsification-condition prerequisite, not a product-taste preference**. Adding telemetry inside the window — even "just a silent counter for me to see" — has the same amendment requirements as weakening any other falsification condition: a written justification naming the specific evidence that made the previous position wrong, a named non-founder co-signer, and an entry in the Amendment Log below. "I just want to know if they opened it" is not a valid justification; that is the exact temptation Condition 3 is designed to make unavailable. See `D131` in `docs/decisions.md` for the full staged-unlock plan (opt-in JSON export at friends-of-friends cohort, remote telemetry only at `D91` stranger-launch preparation).

## Default decision rule at the 2026-07-20 re-eval

The re-eval MUST produce a written decision memo. The decision rule below is asymmetric against inertia on purpose.

**Inputs to the decision (all must be recorded in the memo):**

1. Founder-use ledger session count, solo share, focus breakdown.
2. Partner walkthrough ledger (Tier 1a at minimum; Tier 2 if shipped).
3. Partner behavioral return outcome (from Condition 3 above).
4. Status of Tier 1a, Tier 1b, Tier 2 — shipped, in-progress, not-started.
5. Founder's own narrative answer to the three falsification conditions: passed / failed / ambiguous, with one sentence per condition.

**Decision tree (default-against-inertia):**

- **If Condition 1 is failed** → Tier 2 re-sequences (see Condition 1 consequence). Return to Tier 1b authoring with the re-sequenced Tier 2 plan ready to start when Tier 1b acceptance passes.
- **If Condition 2 is failed** → Tier 1b pauses; See-Why and full session history ship next. Return to the re-eval when those surfaces have seen 30 days of founder use.
- **If Condition 3 is failed** → Tier 2 repoints (see Condition 3 consequence). If Tier 2 has not started yet, start it on the repointed target. If Tier 2 has shipped, the next Tier 2 iteration is gated on re-running the partner walkthrough and observing a post-walkthrough unprompted open.
- **If all three conditions pass AND Tier 1a + Tier 2 have shipped AND combined founder+partner sessions >12** → **default decision is option (a): friends-of-friends cohort** (3–5 beach volleyball friends, two-week window, ledger captured per tester, no D91 numerical bar — this is one more expansion stage before D91 stranger-launch). Continuing founder-only (the third option) is available but requires a written justification co-signed by a named non-founder reader, pasted into this memo's Amendment Log below. The justification must state a specific behavioral outcome that would overturn the decision (falsifiable) and the review date on which that outcome will be assessed.
- **If all three conditions pass AND Tier 1a + Tier 2 have shipped AND combined sessions ≤12** → **default decision is continue Tier 2 iteration for another 30 days** and re-assess. Not a green light for friends-of-friends yet; the session volume is too low to distinguish founder conviction from founder novelty.
- **If Tier 1a has not shipped by 2026-07-20** → the re-eval is not a go/no-go; it is a diagnosis memo. Write what blocked Tier 1a, whether the blocker is technical, motivational, or environmental, and whether founder-use mode has failed-by-non-execution. In that state, the default decision is to ship whatever subset of Tier 1a is shippable and re-eval again in 30 days.

**Option (b) — resume D91 stranger-launch preparation** — is always available as an opt-in path when Conditions 1, 2, 3 all pass and the founder has stranger-launch conviction independent of the friends-of-friends step. It is not the default, but it is a valid selection from this memo.

**What the decision rule explicitly rejects.** At the re-eval, the founder cannot:

- Narrate a condition as "technically passed with caveats." Pass or fail; ambiguous defaults to fail.
- Cite "the content isn't ready yet" as a reason to continue founder-only without a co-signer. "Not ready" is a Tier-1b/Tier-2 authoring concern, not a validation concern.
- Skip the decision memo. If the re-eval date arrives and no memo is written, the default decision is option (b) (resume D91 preparation) — chosen not as the founder's preference but as the asymmetric-against-inertia fallback.

## Weekly trigger-review ritual (3 minutes, Mondays)

Every Monday during the 90-day window, the founder pastes into this memo's Weekly Log below:

```
## YYYY-MM-DD (week N of 13)
- Sessions logged this past week: <n> (running total: <n/13-week-target>)
- Solo share so far: <%>
- Focus breakdown so far: <pass n / serve n / set n>
- Outside-app planning this week: <yes/no — if yes, what>
- D130 early triggers check:
  - (a) <5 sessions in 45 days: currently <x/5, y days elapsed>
  - (b) 3-week silence: <most recent session date>
  - (c) invited anyone outside partner: <y/n>
  - (d) Tier 1a + ≥10 sessions + no open P0: <status>
- Falsification conditions status:
  - 1: pass / fail / ambiguous
  - 2: pass / fail / ambiguous
  - 3: pass / fail / ambiguous (only applies post-walkthrough)
- One-line note: <founder's honest read of the week>
```

The ritual is designed to take three minutes and be impossible to skip without leaving a visible gap. If three consecutive Mondays are missed, that is itself evidence the founder-use premise is underwater; trigger a re-eval at the next weekly slot.

## Authoring-budget cap (anti-displacement)

The red-team review identified **content authoring as displacement activity** as a specific failure mode of founder-use mode: the founder authors new drill records in place of dogfooding the existing library.

**Cap.** No more than **10 new drill records** may be authored between Tier 1a acceptance and the founder's 5th post-Tier-1a session logged in `docs/research/founder-use-ledger.md`. This cap is the entire Tier 1b budget. After the 5th session:

- The next 10 drills may be authored only in response to a specific logged session gap ("I wanted X and couldn't find it").
- No drill may be authored before the founder has attempted to find a workable substitute in the existing library and logged the attempt.
- Partner walkthrough findings do not override the cap — they feed into it as one class of logged gap.

**Why this cap.** 10 is slightly more than the 8 drills that a typical BAB practice plan would author in one sitting; it is explicitly below the 19 drills the original Tier 1 plan proposed to author before any founder dogfood. The cap forces the founder to distinguish "I need this to train" from "I would like this to exist."

## Fourth D130 trigger — codified here, referenced in decisions.md

The D130 amendment adds trigger (d): "Tier 1a has shipped AND ≥10 founder sessions logged AND the partner walkthrough has returned with no open P0s → re-eval MUST fire, default outcome is to resume `D91` preparation." See the amended D130 cell in `docs/decisions.md`.

This trigger exists because the three original D130 triggers all point down (under-use). Without an up-trigger, a successful founder-use run has no mechanism for forcing external validation. Trigger (d) is the up-trigger.

The `D91` preparation here means returning to the operational protocol in `docs/research/pre-telemetry-validation-protocol.md` and `docs/discovery/phase-0-wedge-validation.md`, not rejecting founder-use mode retrospectively. Founder-use mode was the right call for 2026-04-20; trigger (d) is the right condition to end it.

## What falsifies *this memo*

Meta-check: the memo itself has failure modes.

- If a condition is missed, and the amendment log contains a justification whose stated falsifiable outcome later also failed, that is evidence this memo is being used as a ratchet rather than an adversary. The founder should notice that pattern and either stop amending, or refer the amendment to an external reviewer before merging it.
- If the weekly log is routinely filled out with identical contents week-over-week ("no change"), that is evidence either (i) nothing is happening and the ritual has become decorative, or (ii) the ritual's granularity is too coarse. Re-read `docs/reviews/2026-04-20-m001-red-team.md` section "Re-eval is decorative" and adjust.
- If the 2026-07-20 re-eval produces a memo that selects "continue founder-only" with a justification that is not falsifiable (no specific observable outcome whose absence would overturn the decision), the correct action is for the co-signer to reject the justification as not a justification.

## Weekly log

Append one block per Monday during the 90-day window. The first entry is the week of 2026-04-20 itself.







## Amendment log

Any edit that weakens a falsification condition, shifts a threshold, or changes the decision rule gets recorded here with date, what changed, the justification, and the co-signer.







## For agents

- **Authoritative for**: the three falsification conditions, the default decision rule at the 2026-07-20 re-eval, the weekly trigger-review ritual, and the anti-displacement authoring-budget cap.
- **Edit when**: a weekly log entry is due (Monday), a falsification condition is observed as failed (record it in the Weekly Log and propagate the consequence into the relevant plan), or a properly co-signed amendment is proposed.
- **Belongs elsewhere**: Tier 1a scope (`docs/plans/2026-04-20-m001-tier1-implementation.md`), D130 decision text (`docs/decisions.md`), the D91 numerical bar (`docs/research/d91-retention-gate-evidence.md`), partner walkthrough protocol (`docs/research/partner-walkthrough-script.md`), founder-use ledger schema (`docs/research/founder-use-ledger.md`).
- **Outranked by**: `docs/decisions.md` (if D130 itself is amended), `docs/vision.md` (if the product vision is amended and this memo's premises fall out of sync).
- **Key pattern**: a pre-registered adversarial memo, not a template. This is a one-off artifact for the D130 window. When `D91` preparation resumes or Tier 2 ships, this memo's role narrows to historical record; archive it rather than rewriting it.

