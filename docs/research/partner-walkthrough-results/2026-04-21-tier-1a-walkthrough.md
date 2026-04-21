---
id: partner-walkthrough-2026-04-21-tier-1a
title: "Partner Walkthrough Results — Tier 1a — 2026-04-21 (Seb)"
status: active
stage: validation
type: research
summary: "Two-pass ledger for M001 Tier 1a partner walkthrough with Seb: Pass 1 (two solo sessions + 11-question questionnaire) and Pass 2 (pair session on grass + 5-question debrief). 30-day quiet window runs 2026-04-21 → 2026-05-21. Pass 1 Q1 says predicted behavior unchanged; Pass 2 Q1 says Seb would follow the program alone."
authority: "Ledger of record for the first partner walkthrough. Outranks nothing; informs Tier 1a/1b scope prioritization and the `D130` adversarial-memo Condition 3 30-day outcome."
last_updated: 2026-04-21
depends_on:
  - docs/research/partner-walkthrough-script.md
  - docs/plans/2026-04-20-m001-adversarial-memo.md
  - docs/plans/2026-04-20-m001-tier1-implementation.md
  - docs/milestones/m001-solo-session-loop.md
related:
  - docs/research/founder-use-ledger.md
  - docs/research/d91-retention-gate-evidence.md
decision_refs:
  - D91
  - D123
  - D129
  - D130
  - D131
---

# Partner Walkthrough Results — Tier 1a — 2026-04-21 (Seb)

## Agent Quick Scan

- **What this is.** The first partner walkthrough ledger against the Tier 1a build. Covers Pass 1 (async solo questionnaire, Seb), Pass 2 (paired courtside session, on grass), and the 30-day quiet-window tracker.
- **What it gates.** Feeds `D130` Condition 3 (partner behavioral return) for the 2026-07-20 re-eval; informs Tier 1a → Tier 1b scope reordering where P0/P1 findings warrant it.
- **Headline outcomes.**
  - No P0s surfaced. Nine P1s and five P2s surfaced across Pass 1 and Pass 2.
  - Seb's pre-use and post-Pass-1 "would I open it unprompted?" answers both say **yes**. Post-Pass-2 answer is an implicit **yes** (he'd follow the program alone).
  - **Protocol deviations** (see Context): Pass 1 Task 2 was partly synchronous (founder was present and explained the skill-level screen mid-Pass-1); Pass 2 ran on **grass not sand**; Pass 2's founder-reads-block-copy-aloud step was skipped. All three weaken the signal they were meant to generate and are flagged in-line.
- **Machine reads.** Pass 1 artifact ids: plans `8bb71919-274e-497e-a62a-058b3e7ff00b` (Solo Task 1, completed) and `f634f683-895e-46a8-9dad-e50915ef0a14` (Solo Task 2, ended early after 13 swaps on the main slot). Pass 2 plan id: `4f5a0d2e-9596-4660-9543-b96bf6dec4f6` (Pair 25-min, completed). Raw export: `volley-drills-export-2026-04-21.json`.

## Context

- Build: Tier 1a deployment on `https://volleydrills.nicholascorneau.workers.dev` as of 2026-04-21. Commit sha not captured; to backfill from deploy log.
- Tier: 1a.
- Install: iOS Safari, Add-to-Home-Screen (confirmed verbally; version not captured).
- Prior exposure: first open of this build; Seb has never seen any prior build.
- Pass 1 delivered: 2026-04-21.
- Pass 1 closed: 2026-04-21 (same day as Pass 2).
- Pass 2 date + location: 2026-04-21 · **grass (non-sand fallback)**. No sand venue available. Flagged per script — Pass 2 Q3 signal is weaker.
- Pre-use answer (before opening): "Yes. Very well." (Seb, verbatim paraphrase from the framing exchange — Nick: *"if Part 1 is actually useful to you today, would you open the app on your own in the next couple of weeks without me asking?"* Seb: *"Yes."*)
- **Protocol deviations from `docs/research/partner-walkthrough-script.md`:**
  1. **Pass 1 was not fully async.** Founder was present during the post-Task-1 questionnaire and during Task 2, explained the onboarding skill-level screen after Seb had already completed Task 1, and sat next to Seb while Task 2 swap-looped. This both contaminates Task 2 "confusion is the data" and may have inflated Seb's confidence on several questionnaire answers.
  2. **Pass 2 was on grass,** not sand. Wind not captured; no venue permit friction.
  3. **Pass 2 read-aloud step was skipped.** Seb's answer to the readability question ("text is not readable at arm's length") therefore came from his own attempt to read at arm's length, not from a direct A/B against founder reading aloud.
  4. **Pass 2 debrief Q4 ("sand vs. your couch?") was flagged as confusingly worded** — Seb: *"that's a weird question... I'm not sure what this question means."* The question doesn't work as written. (See proposed fix under Pass 2 observation P2-3.)

### Storage/instrumentation confirmation (from JSON export)

- `onboarding.completedAt`: 2026-04-21 ~16:42 EDT.
- `onboarding.skillLevel`: `unsure` — set ~24 minutes after onboarding completed, i.e., not on first pass through the screen. Matches Seb's verbal account that he initially picked "Foundations" thinking it was a focus, then Nick explained it was a skill-level screen, and Seb changed it to `unsure`.
- `lastPlayerMode`: `pair` (last action before export).
- Session counts match: Solo Task 1 (4 blocks, 15 min, completed, RPE 3, 12/20 passes), Solo Task 2 (ended early at block 2, 7 actual min, **13 swaps** on the main slot), Pair (5 blocks, 25 min, completed, RPE 3, `notCaptured`).

## Pass 1 observations

| # | Task | Severity | Observation | Partner quote | Proposed fix |
| - | ---- | -------- | ----------- | ------------- | ------------ |
| P1-1 | Onboarding / skill-level screen | P1 | The four-option onboarding screen (Foundations / Rally Builders / … / Not sure yet) does not read as a skill-level assessment. On first pass Seb interpreted it as a session-focus picker and selected "Foundations." He did not notice "Not sure yet" on his first scan. Only switched to `unsure` after Nick explained what the screen was for. Also: screen is not editable afterwards (documented gap — D-level decision deferred). | *"I wasn't sure exactly which thing I was, whether I should choose Foundation, Rally Builders, or which one of the four options... there is a not-sure-yet option, which I didn't notice at the start."* / *"I didn't understand this as my 'what is your skill set?'"* | Rewrite screen copy so the question ("what level do you consider yourself?") is the headline, not the four option labels. Surface "Not sure yet" higher / make it the visual default. Confirm the post-Tier-1a editability story (was parked; partner bumped it). |
| P1-2 | Home / post-session navigation | P1 | After completing Task 1, Seb could not recognize which screen was home. He perceived the setup/session-selection screen as home and spent time trying to "leave" the post-session screen. He specifically asked where "home" was. The Home last-3-sessions row exists (Tier 1a Unit 5) but the hierarchy did not read to him. | *"I kept trying to figure out how to leave this screen. I didn't realize this was, like, the home. The landing screen of, like, your skill selection felt like [home]."* | Either (a) explicit "Home" affordance (label/icon) persistent across Setup and Post-Session, (b) a "Done → Home" CTA at the end of the review flow, or (c) investigate whether onboarding landing and Home are visually too similar. Likely (b) + small nav polish is cheapest. |
| P1-3 | Task 2 steering → serving | P1 | Task 2 scripted partner to tap **Swap** until the main drill is a serving drill. Seb was on `solo_open` (no net). The `solo_open` archetype has no serving drill in its `m001Candidate` pool. Seb swapped **13 times** with no feedback that serving would never appear, eventually skipped the main slot and the cooldown and ended the session early (`status: ended_early`, 7 actual min). This was the mechanical source of the truncated session, not genuine quit. | Swap count 13 in execution log `22aa9db7-37d5-48c3-8aa8-c22b6fde41c3`; partner narrated: *"there's no 3-second... my runs, which would be nice"* during the loop. | One of: (a) Swap surfaces cross-archetype options with a disclosure ("you'd need a net for this focus"); (b) script-side, rewrite Task 2 to either prompt partner to toggle `netAvailable=yes` first, or steer toward a focus that `solo_open` actually covers; (c) a subtle "no more options" state after N swaps. (c) is lowest risk. |
| P1-4 | Beach Prep vocabulary | P1 | Beach Prep Three courtside copy uses **"shuffle and drop-step at game pace"**. Partner did not know what the drop-step was and flagged it as one of two confusing terms in Block 0. Relevant surface: `docs/research/partner-walkthrough-script.md` wording-check row for Beach Prep Three (pass target: "partner knows what to do in each 45-s window on sand"). Did not pass. | *"There was some confusion around some of the terms used. Specifically, the shuffle and drop-step."* | Inline definition or micro-image on first encounter. Cheap: rename to something self-describing ("quick side-to-side + plant-and-turn"). |
| P1-5 | "Set window" / "pass window" vocabulary | P1 | Coach cue and courtside instructions use "set window" (Self-Toss Pass to Set Window drill; also surfaces in 6-Legged Monster coach cue "Receiver passes to set window"). Partner flagged it as unfamiliar to non-coach players and asked for it to be tappable/defined. | *"'Set window' is a confusing term. Haven't seen that. Maybe to make it clickable."* / *"The term 'pass window' might be confusing for some."* | Inline short definition on first use; tap-to-expand glossary; or rename to "set target" + a one-line "where the setter stands" gloss on first reference. |
| P1-6 | 6-Legged Monster coach cue ambiguity | P1 | Coach cue "Lower inside shoulder, raise outside for wide balls" was read twice and still didn't land. Partner specifically called out that a brand-new player would misread it. (Block also appeared in Pass 2; same finding.) | *"The coach's cues could be a little ambiguous or confusing for somebody who might be like a brand-new player, specifically 'the lower inside shoulder, raise outside for wide balls'."* | Plain-language rewrite. E.g., "drop the shoulder nearer the ball; lift the far shoulder on wide balls." Validate in Tier 1b. |
| P1-7 | 6-Legged Monster toss matrix | P1 | Courtside instructions describe the tosser matrix as "6 locations: left/right × (in front / to side / slightly behind)". Partner: understandable once seen, but "a bit mathematical" for casual readers. | *"It kind of makes sense once you see it, but it's a bit mathematical for the average player."* | Replace the combinatoric description with either an enumerated list (6 bullets) or a small diagram. |
| P1-8 | Cool-down stretch abstraction | P1 | Wrap block "Lower-body Stretch Micro-sequence" courtside copy names six stretches (calf straight, calf bent, hamstring, hip flexor, glute, adductor) at 20–30 s each, with no demo/image/description. Partner, who is an athlete with volleyball history, still got stuck figuring out form. Specifically flagged that a brand-new player would be worse off. | *"I got stuck having to figure out what stretches may be. A selection or predetermined [option]... even if you just click on it, and it shows, like, these are some things you can do. Maybe, like, targeted to what was done in the session."* | Add tap-to-expand per stretch (short description or a single-frame illustration). Scope gate: this is cooldown-block content, not main-skill drill content, so it can live in the wrap-block micro-spec rather than requiring a drill-catalog change. |
| P1-9 | Task 2 swap-loop UX feedback gap | P1 | Separate from P1-3 (which is about the script + catalog): while swapping, partner noted there was no quick preview/countdown between swaps ("no 3-second..."). Swapping feels like committing before seeing what's next. | *"There's no 3-second... my runs, which would be nice."* (fragmentary) | Lightweight: small preview tile on Swap card ("next: Self-Toss Pass") before the swap commits; or a 3-s undo toast after swap. Verify what the partner meant before building; quote is partial. |
| P1-10 | Session duration framing | P2 | Partner did not expect warm-up and cool-down to count inside the 15-min total. Expected 15 min of main/technique work. Not a blocker; a labeling expectation mismatch. | *"I didn't necessarily expect a warm-up and cool-down to be part of the 15 minutes."* | Relabel the time picker or add an "includes warm-up + cool-down" microcopy line on SetupScreen. |
| P1-11 | "Chosen because:" line read | P2 | When Seb was asked "did you read the one-sentence why-this-drill line?" he said yes but described reading the coach's cues, not the "Chosen because:" sentence. Suggests the deterministic rationale did not register as distinct from coach cues. Tier 1a Unit 4 pass target ("partner nods or flags as noise — either is a valid read") technically passed by "nods," but the conflation itself is the signal. | *"I did read it. Every time, opened the coach's cues and read what it said."* | Confirm visual/typographic separation between coach-cue cluster and the "Chosen because:" sentence on the block-detail screen. If separation is already present, this becomes wontfix and the finding is "partner merged them anyway" — still a read for the D123 trust-surface tracker. |
| P1-12 | Review-screen RPE scale labels | P2 | The "easy / light / ..." labels under the RPE scale were not obvious to Seb on first encounter. He noted they are useful once seen. | *"Didn't notice the easy/light wording underneath, but that is good, though... maybe a little more obvious."* | Tighten label visibility (larger/lighter-weight/closer to the number). |

### Pass 1 wording-check reconciliation

| Surface | Expected pass criterion | Verified | Outcome |
| ------- | ----------------------- | -------- | ------- |
| Pain flag | Partner answers without asking what "localized" means. DOMS line lands. | Pass 1 Task 1 | **Pass.** Seb: *"There was a prompt that said, If you have normal muscle fatigue from exercise, that it was normal, and the app would account for it."* |
| Layoff prompt (tap "2+") | Partner picks a sub-bucket without scrolling away | Pass 1 Task 2 | **Not exercised.** `trainingRecency` was 0 days on both solo plans. Seb and Nick discussed the 2+ path verbally but didn't run it. |
| `PainOverrideCard` | Partner doesn't dismiss it as generic medical copy | Pass 1 Task 2 (probe) | **Pass (weak).** Seb tapped Yes on pain as a probe, saw the lower-load path, and read it as concrete. Note: duration did not shorten — that's by design per `D113` adaptation-engine bands, but Seb asked about it, so a one-line microcopy ("we lower the load, not the time — your pick") may be worth Tier 1b. |
| `SafetyIcon` expanded | Partner finds the emergency cue in <5s | Pass 1 | **Not observed.** No emergency probe occurred. |
| "Chosen because:" | Partner nods or flags as noise | Pass 1 | See P1-11 above. **Merged with coach cues**; ambiguous outcome, noted rather than pass/fail. |
| Last-3-sessions row | Partner finds it when asked; bonus if noticed unprompted | Pass 1 | **Ambiguous.** Seb completed both solo sessions and the pair session (3 sessions' worth of row content exists in IndexedDB). He did not note the row unprompted. P1-2 home-screen confusion suggests he didn't locate it even when he was trying to "go back." |
| BAB vocabulary (Pokey/Tomahawk/Sideout/High Line/Cut Shot) | Partner reads past without stopping | Pass 1 | **Not exercised.** None of these terms appear in the three plans Seb ran (solo_open and pair_open default pool). Vocabulary test carries forward to a later walkthrough with a different archetype. |
| Regulatory disclaimer | Partner doesn't bounce | Pass 1 | **Not flagged.** Seb did not mention it either way. |

## Pass 1 questionnaire (11 answers, paraphrased from voice notes)

Paraphrase throughout; direct quotes marked with double-quotes.

1. **Did using the app change your opening "would I open it again?" answer? Which direction?** — No change. *"No, it did not change my predicted behaviour."*
2. **First reaction on opening — did you know what to do, or did you have to figure it out?** — Took a second; figured it out. The friction was the onboarding skill-level screen, which he didn't recognize as a skill-level question (see P1-1). Initially picked "Foundations" as if it were a focus.
3. **The pain question — clear?** — Yes. Explicitly reassured by the DOMS line.
4. **The first block (Beach Prep) — would you actually do those four things?** — Yes, would do them. Flagged vocabulary confusion ("shuffle and drop-step"). See P1-4.
5. **Each block's one-sentence "why this drill" line — did you read them?** — Yes; however the narrative described the coach-cue cluster, not the "Chosen because:" sentence. See P1-11.
6. **The main-skill drills — do they look like what you've done in real practice, or generic?** — Recognizable. Specifically: one-arm passing and pass-to-a-specific-spot match real practice. Vocabulary caveat: "pass window" / "set window" is confusing for non-coach readers. See P1-5.
7. **When you tapped Swap — did that feel like the right gesture, or did you expect a focus toggle?** — Right gesture, felt intuitive. (See P1-3 / P1-9 for the downstream problem Swap ran into on Task 2.)
8. **After each session, Home shows your recent sessions. Did you notice? Useful or just more stuff?** — Useful in principle. But he couldn't find Home; the setup screen felt like home to him. See P1-2.
9. **The after-session review — would you fill it out every time, sometimes, never?** — Sometimes. Personal preference, not a product flag.
10. **One thing you'd change about the solo flow?** — Duration framing (P1-10). Otherwise flow felt natural.
11. **Anything I didn't ask about?** — Cool-down stretches need demonstration/selection for new players (P1-8).

## Pass 2 observations

| # | Task | Severity | Observation | Partner quote | Proposed fix |
| - | ---- | -------- | ----------- | ------------- | ------------ |
| P2-1 | Courtside readability | P1 | Body text not readable at arm's length. Confirmed from self-test, not from the script's read-aloud A/B (that step was skipped — see Context deviation #3). Still a real finding. | *"Text is not readable at arm's length, I think. Yeah. Agreed."* | Bump courtside font size on the run screen; consider an outdoor-mode typography variant (e.g., min 18–20pt for block body, 24pt+ for the active coach cue). Validate under real sand + sun, not just grass. |
| P2-2 | Pacing audio for timed sub-blocks | P1 | Warm-up (Beach Prep, four 45-s mini-blocks) and cool-down (Downshift, multiple 30–60-s segments) have no audible pacing. Partner asked for a 30-s beep throughout both. Pair flow additionally needs an audible "swap roles" cue so the two players don't have to stare at the phone to know when to switch tosser/receiver. | *"A beep every 30 seconds during the cool down would help... could also be implemented for the warm up. Would also be another kind of audible indicator to prompt the pairs to switch who is doing the tossing and who is doing the drill."* | Implement 30-s pacing beep on warm-up and cool-down blocks; add a distinct "swap roles" cue at the halfway mark of pair drills where the protocol alternates roles. Respect silent-mode preferences. |
| P2-3 | Rep capture in pair flow | P2 | Pair review came back with `notCaptured` quick-tag. Partner confirmed rep capture is hard in pair, especially without a hard-cap prompt. Not broken — the `notCaptured` path works — but the pair review carries less signal than the solo review. | *"Could not capture reps this time accurately... it's not an easy thing to track."* | Lower the friction: either (a) a visible running tally with a single-tap increment on the run screen for pair, (b) a post-block "how many" modal instead of only a global review entry, or (c) accept `notCaptured` as first-class and stop treating it as a degraded review. |
| P2-4 | Pair debrief Q4 wording | P2 | Script's Pass 2 debrief Q4 ("Anything that felt different on sand vs. your couch?") does not parse. Partner flagged it directly. (Not an app issue — a script issue; still worth fixing before the next tier.) | *"That's a weird question... I'm not sure what this question means."* | Rewrite in `docs/research/partner-walkthrough-script.md` to something like: "Was anything easier at home than here, or harder here than at home?" |
| P2-5 | 6-Legged Monster positive note | info | Pair found the 6-Legged Monster drill fun and noticed real improvement during the session. Counter-signal to the vocabulary complaints on the same drill. | *"I think the six-legged monster drill was fun to do. It was fun to do. I enjoyed it."* / Nick, during session: *"we got better... actually like, quite a bit."* | No fix. Record as positive evidence that the drill design is good when the vocabulary is readable. |

## Pass 2 debrief (5 answers, paraphrased)

1. **If you were here without me, would you pull out the phone to follow this, or put it down and hit?** — Would follow the program. *"I would follow up the program. Yes."*
2. **When I read block copy aloud — was that helpful, or was the text unreadable at arm's length?** — Read-aloud step was skipped (deviation #3). Independently, text was not readable at arm's length; partner agreed without hesitation. See P2-1.
3. **Was the pair session genuinely useful, or were we going through the motions?** — Useful. Acknowledged that he and Nick share a long volleyball history so the pair felt routine, but the structure itself was useful. 6-Legged Monster was fun; real improvement observed mid-session (see P2-5).
4. **Anything that felt different on sand vs. your couch?** — Question was flagged as confusingly worded (see P2-4). Substantively: ran on **grass**, not sand. Warmups felt easier on grass than they would have on sand; nothing felt harder on grass. No sand-specific signal captured this pass.
5. **One thing you'd change about the pair flow?** — Same terminology complaints as Pass 1 (P1-4 / P1-5 / P1-6). Add 30-s pacing beeps for warm-up and cool-down, plus an audible tosser/receiver swap cue (P2-2).

## Commitment-question track

- **Pre-use** (before opening the app): *"Yes."* Would open it unprompted in the next couple of weeks if Part 1 were useful.
- **Post-Pass-1 (questionnaire Q1):** Unchanged. *"No, it did not change my predicted behaviour."* — i.e., still **yes**.
- **Post-Pass-2 (debrief Q1):** Not a direct restatement of intent-to-open; partner said he would follow the program if here without the founder. Read as an implicit **yes** for the 30-day behavioral question.
- **Actual 30-day unprompted open:** to fill in on or after 2026-05-21.
- **Delta:** to assess at 30-day close — align / pre-use too optimistic / post-use too optimistic / honestly uncertain.

## 30-day outcome (live tracker)

- **Clock start:** 2026-04-21 (Pass 2 close).
- **Window ends:** 2026-05-21.
- **Unprompted open:** _pending_. If yes, record count, session setup (playerMode / timeProfile / focus / environment toggles), and whether review was completed.
- **Partner mentions / questions during window:** _log here as they occur, with date._
- **Condition 3 status (`docs/plans/2026-04-20-m001-adversarial-memo.md` §Condition 3):** _pending at 2026-05-21._
- **Founder quiet-window invariants** (founder to self-audit weekly):
  - Keep URL live and unchanged. ✅ so far.
  - Do not mention the app to Seb. _founder to uphold._
  - Check Dexie export / Home last-3-sessions row at most once per week for partner activity. _track each check below._
  - Log any unsolicited mentions from Seb, with approx date. _log below._
- **Weekly check log** (founder edits each Monday):
  - 2026-04-27 — _to fill_.
  - 2026-05-04 — _to fill_.
  - 2026-05-11 — _to fill_.
  - 2026-05-18 — _to fill_.
  - 2026-05-21 — close out; record Condition 3 pass/fail.

## Founder response

Decision surface; to be filled in by the founder. Per script: each row is one of `Accept` (land in the active tier) / `Tier 1b` / `Tier 1c` / `Tier 2` / `Wontfix` (with reason). Leaving as _TBD_ below to avoid overstepping.

| # | Finding | Severity | Proposed disposition | Rationale |
| - | ------- | -------- | -------------------- | --------- |
| P1-1 | Skill-level screen not readable as a skill-level question | P1 | _TBD_ | |
| P1-2 | Home / post-session navigation confusion | P1 | _TBD_ | |
| P1-3 | Task 2 swap-to-serving impossible on solo_open | P1 | _TBD — script-side fix is cheap; (c) "no more options" state in app is the higher-trust answer._ | |
| P1-4 | Beach Prep vocabulary ("drop-step") | P1 | _TBD_ | |
| P1-5 | "Set window" / "pass window" vocabulary | P1 | _TBD_ | |
| P1-6 | 6-Legged Monster coach cue ambiguity | P1 | _TBD_ | |
| P1-7 | 6-Legged Monster toss matrix too mathematical | P1 | _TBD_ | |
| P1-8 | Cool-down stretch abstraction | P1 | _TBD_ | |
| P1-9 | Swap preview / 3-s undo | P1 (weak — quote fragmentary) | _TBD — confirm partner intent before building_ | |
| P1-10 | Duration framing (warm-up + cool-down inside 15 min) | P2 | _TBD_ | |
| P1-11 | "Chosen because:" merged with coach cues | P2 | _TBD_ | |
| P1-12 | RPE scale labels visibility | P2 | _TBD_ | |
| P2-1 | Courtside text not readable at arm's length | P1 | _TBD — needs sand validation before committing to a typography change_ | |
| P2-2 | 30-s pacing beeps + pair swap-roles cue | P1 | _TBD_ | |
| P2-3 | Pair rep capture friction | P2 | _TBD_ | |
| P2-4 | Script Pass 2 Q4 wording | P2 | _TBD — fix in `docs/research/partner-walkthrough-script.md` before next tier_ | |
| P2-5 | 6-Legged Monster fun / observed improvement | info | _Keep as positive evidence; no action._ | |

## Partner summary

Paraphrased; founder-written from the voice notes rather than Seb's own words.

Seb entered the walkthrough saying he would open the app unprompted in the next couple of weeks, ran two solo sessions and one pair session, and came out saying the same thing. The flow felt natural for a 15-min solo and a 25-min pair. The two clusters of friction were **onboarding / navigation** (skill-level screen didn't read as a skill-level screen; he couldn't tell what "home" was) and **vocabulary** (drop-step, set window, the 6-Legged Monster toss matrix, and one specific coach cue). A secondary cluster lives in the **wrap block**, where the stretches list names six targets but doesn't show anything, leaving a non-beginner athlete stuck figuring out form. Cool-down pacing without an audible beep is the other cool-down complaint; pair-side it extends into "beep when we swap tosser/receiver." The pair session specifically landed — the 6-Legged Monster was fun and both players noticed real improvement during it — which suggests the drill design carries its weight once the copy is legible. Task 2's intended "steer to serving" never produced a serving drill because the `solo_open` archetype has none, and that cost Seb 13 swaps and the tail of his session. The script deviations (partly synchronous Pass 1, grass instead of sand for Pass 2, skipped read-aloud step) weaken the signal on three specific questions and are the reason several rows above are flagged "ambiguous" rather than pass/fail.

## Change log

- 2026-04-21 — ledger created from Seb's Pass 1 + Pass 2 voice notes and the `volley-drills-export-2026-04-21.json` export. 30-day quiet window opened; clock end 2026-05-21.
