---
id: 2026-05-04-pair-serving-session-feedback
title: "Pair + Net Serving Session Feedback (founder + Seb, 40 min, post-Tune-today)"
status: active
stage: validation
type: research
authority: "Curated field feedback from the 2026-05-04 founder + Seb pair + net 40-minute session against the post-Tune-today build (assemblyAlgorithmVersion: 6). Captures positive validation of recent ships (Tune today, per-move pacing indicator, simpler drill copy) and the new wishlist surfaces — glossary, video links, session history, trends — without changing canon decisions or firing gated work by itself."
summary: "Seb's 2026-05-04 pair + net 40-min serving session is the first real-use exercise of the post-Tune-today (2026-04-30) build and validated the focus picker (Recommended-as-peer worked), the longer main_skill block (10-min Outside the Heart Serving), the per-move stretching/warmup segments, and the simpler 'dummy proof' drill copy. Two persistent frictions: warmup and cooldown timing still felt off (likely the planned-block-duration > segment-sum gap on 5-min slots), and the partner-side experience of the coach reading drill copy aloud felt 'inconvenient.' Four new wishlist surfaces named in a single session: clickable glossary for technical terms, optional YouTube example links per drill, a tappable session history with captured drill data, and a trends/dashboard view of skill progress over time. F10/F11 are partner-walkthrough-class evidence that the M001 Tier 2 'full session history screen' and M002 lightweight-accumulation surfaces are anticipated, not invented; F8/F9 are single-instance soft asks routed to the ideation backlog."
last_updated: 2026-05-04
depends_on:
  - docs/research/founder-use-ledger.md
  - docs/plans/2026-04-30-001-feat-pre-run-simplification-plan.md
  - docs/plans/2026-04-28-per-move-pacing-indicator.md
  - docs/plans/2026-04-20-m001-tier1-implementation.md
  - docs/milestones/m001-solo-session-loop.md
  - docs/milestones/m002-weekly-confidence-loop.md
related:
  - docs/research/2026-04-28-build17-pair-dogfeed-feedback.md
  - docs/research/2026-04-28-audio-pacing-reliability-investigation.md
  - docs/research/2026-04-27-cca2-dogfeed-findings.md
  - docs/ideation/2026-04-28-what-to-add-next-ideation.md
decision_refs:
  - D26
  - D27
  - D74
  - D124
  - D130
  - D133
  - D135
---

# Pair + Net Serving Session Feedback

## Agent Quick Scan

- Session: 2026-05-04, founder + Seb, **pair + net, 40 min, beginner level, RPE 5, completed**. Plan `d8b1ac8f-…`, execution `3d8ac8f9-…`, `assemblyAlgorithmVersion: 6`, `swapCount: 1`. Per-drill captures: 4 of 4 capture-eligible drills tagged `still_learning`, no Good/Total counts entered (consistent with `D133` optionality posture).
- **First real-use exercise of the post-Tune-today build** (`docs/plans/2026-04-30-001-feat-pre-run-simplification-plan.md`, shipped 2026-04-30) and the first observed Pair + Net 40-minute session with a serving `main_skill` (`d51 Outside the Heart Serving` at 10 min) under D130 founder-use mode.
- Positives validated: Tune today + Recommended-as-peer (could pick a focus, didn't have to), the longer main_skill block hierarchy, per-move stretching/warmup segments, and "dummy proof" drill copy. The whole session generated less coach commentary than prior pair sessions.
- Frictions repeated: warmup and cooldown still felt timing-off; reading drill copy aloud felt inconvenient on the partner side.
- New wishlist surfaces named: clickable glossary for technical terms (e.g. "set window"), optional YouTube example links per drill, tappable session history with captured drill data, trends/dashboard for skill progress over time.
- Routing: this note does not fire a new implementation plan by itself. F1–F5 are positive validation and require no action. F6 routes to the existing audio-pacing / segment-timing track. F7 is single-instance, soft, and parked. F8 and F9 are single-instance soft asks that route to the ideation backlog under D135 "founder feature wish vs content gap" framing. F10 and F11 are partner-walkthrough-class evidence that the M001 Tier 2 "full session history screen" surface and M002 lightweight-accumulation surfaces are anticipated by the user, not invented — they update the trigger reads in `docs/plans/2026-04-20-m001-tier1-implementation.md` §"Tier 2" and the rejection lines in `docs/ideation/2026-04-28-what-to-add-next-ideation.md`.

## Session Context

Source: founder voice memo transcribed into chat plus the Dexie export `volley-drills-export-2026-05-04.json`. The export was reviewed for plan shape, block timing, swap, and per-drill capture data. The voice memo was delivered immediately post-session with one short follow-up amendment.

Plan composition (Tune today flow, Pair + Net preset, 40-min time profile, beginner level, no pain, no heat):

- `block-0` warmup — `d28 Beach Prep Three` (5 min planned; segments cover 4×45 s = 3 min)
- `block-1` technique — `d05 Self-Toss Pass to Set Window` (6 min, pair variant)
- `block-2` movement_proxy — **swapped** from `d10 The 6-Legged Monster` to `d40 Footwork for Setting` (6 min, pair variant)
- `block-3` main_skill — `d51 Outside the Heart Serving` (10 min, pair variant)
- `block-4` pressure — `d03 Continuous Passing` (8 min, pair variant)
- `block-5` wrap — `d25 Downshift` (5 min planned; segments cover 60 + 30 + 60 + 30 + 60 = 4 min)

Block timing read from the execution log:

- warmup planned 5 min, ran ~3:07 (segments exhausted at ~3 min)
- wrap planned 5 min, ran ~4:16 (segments exhausted at ~4 min)
- main_skill ran the full 10 min
- session total: ~45 min wall clock from start to complete

Per-drill captures:

- `d05-pair`: `still_learning`
- `d40-pair`: `still_learning`
- `d51-pair`: `still_learning`
- `d03-pair`: `still_learning`

No `metricCapture` rows were entered. RPE 5 captured 13 s after submit.

The voice memo includes Nick's coach-side framing ("could pick a focus, including the recommended, so I didn't actually have to choose") plus Seb's partner-side reactions to the session and an extended segment about what Seb would want next ("see what I did last time," "graphs," "see improvements," "help the program recommend the best focusses"). One short follow-up clip added the "every time I open the app and I see my past sessions, I want to click on this" pull statement.

## Findings

### F1 — Tune today + Recommended-as-peer worked at courtside speed

**Claim.** "We could pick a focus, including the recommended, so I didn't actually have to choose if I didn't want to."

**Why it matters.** First real-use exercise of the post-2026-04-30 mandatory pre-safety Tune today step. The four-chip Recommended/Passing/Serving/Setting layout with Recommended as a peer chip lands as it was designed: choice is offered, default-to-no-choice is a valid path, and the user did not feel forced to make a decision. This validates the simplification posture in `docs/brainstorms/2026-04-30-pre-run-simplification-requirements.md` and the chip-set decisions in `docs/plans/2026-04-30-001-feat-pre-run-simplification-plan.md`.

**Routing.** Positive validation only. No new UI from this finding.

### F2 — The longer, more focused main_skill block was appreciated

**Claim.** "I liked that there was a main drill, which was longer than the others. Um, and slightly more focussed."

**Why it matters.** First observed real-use validation of the variable-duration block hierarchy on a 40-min session — a 10-min `main_skill` (Outside the Heart Serving) anchored the session against shorter technique/movement_proxy/pressure blocks. The hierarchy reads at courtside speed without any UI cue beyond block duration itself.

**Routing.** Positive validation only. No change. Worth recording for the next time the assembler's slot-duration arithmetic is touched.

### F3 — Whole session generated less confusion than prior pair sessions

**Claim.** "Everything felt much clearer and, um, I had a lot less questions on the whole thing, really." Overall positive: "the recent changes were really well received, actually."

**Why it matters.** Standing positive read across the recent ship sequence: Tune today simplification, the per-move pacing indicator (V1–V4), the V0B-28 per-drill success criterion, the cca2 F1/F8 role/skill eyebrow + skill-led courtside copy, the solo-vs-pair variant sweep, and the simpler drill copy work. The "less questions" framing is the same shape the partner-walkthrough Trust-clarity bar reads for. No specific surface to attribute this to; it is the cumulative read.

**Routing.** Positive validation only. Strengthens the directional read on the recent ship sequence; does not, by itself, fire any trigger.

### F4 — Stretching and warmup segments are direct enough now

**Claim.** "The exercises or the stretching is more direct. So there's no wondering what exactly I should be doing."

**Why it matters.** Direct partner-side validation of the per-move pacing indicator V1–V4 work shipped 2026-04-28 (`docs/plans/2026-04-28-per-move-pacing-indicator.md`): structured `DrillSegment[]` with active/past/future state on `<SegmentList>`, the `eachSide?: boolean` flag with the muted "(each side)" suffix, and the Shorten-aware down-only scaling. This is the courtside-readable "what to do right now" channel the V4 redesign was built to produce.

**Routing.** Positive validation only. See F6 for the asymmetric-scaling residual that the V3 design deliberately left open.

### F5 — Drill explanations are "dummy proof" and any partner can pick them up

**Claim.** "Same with the drills, the explanations are simpler and more dummy proof. So, anybody can really pick it up and do the drill."

**Why it matters.** Positive read on the cumulative drill-copy work — the 2026-04-21 BAB skill-vocabulary sweep with inline parenthetical definitions, the 2026-04-26 cooldown rewrite for `d26`, the 2026-04-27 cca2 F1/F8 follow-ups (skill-led courtside copy, removal of per-block rationale prose), the 2026-04-27 sweep across `m001Candidate` drill instructions, and the 2026-04-27 V0B-28 forced-criterion prompt. The partner-readability bar from the 2026-04-21 partner-walkthrough trifold synthesis is being met.

**Routing.** Positive validation only. Reinforces the courtside-copy invariants in `docs/research/outdoor-courtside-ui-brief.md` and the courtside-copy rule set in `.cursor/rules/courtside-copy.mdc`.

### F6 — Warmup and cooldown still had "some timing issues"

**Claim.** "Their warm-up and cool-down blocks still had some timing, um, issues. But otherwise, I think the flow went well."

**Why it matters.** Repeats the persistent warmup/cooldown timing concern from the 2026-04-27 cca2 dogfeed F5 (`d26` cooldown copy hard-coded ~3 min while workload allowed 3–6 min) and the 2026-04-28 build-17 dogfeed F3 (cooldown/sub-block beeps missing or inaudible). Today's voice memo did not specify which axis of "timing issue" — it could be one or more of:

- **Planned-block-duration > segment-sum gap.** On today's plan the warmup slot was 5 min planned but `d28` segments sum to 3 min, and the wrap slot was 5 min planned but `d25` segments sum to 4 min. The 2026-04-28 V3 design deliberately scales segments DOWN only, never UP; long warmup/wrap slots are intended to surface bonus copy in overflow territory. The actual block-end times in the execution log (warmup ~3:07, wrap ~4:16) line up with segment-exhaustion, not full timer expiry, which suggests the user advanced once segments completed rather than waiting for the planned timer.
- **Audio-pacing residual.** The 2026-04-28 audio-pacing investigation (`docs/research/2026-04-28-audio-pacing-reliability-investigation.md`) shipped a wake-lock fix and added `subBlockIntervalSeconds` metadata to `d25-solo`. Silent switch, manual lock, and unsupported/denied Wake Lock remain platform boundaries. Today's session was outside, on phone, with wind audible in the recording — silent switch and audibility were not confirmed either way.
- **Bonus-copy discoverability.** `d25-solo`'s `courtsideInstructionsBonus` reads "Drink water and note any pain.", which is more of a wrap-up reminder than a "what to do for the extra minute of cooldown" cue. If the user lands in overflow territory with no clear instruction beyond hydration, the experience can feel like "the timer is still going but I don't know what to do," which reads as a "timing issue" even if it is really a copy issue.

**Routing.** Update existing audio-pacing / segment-timing tracks. Specifically:

- Strengthens the `S1` line in `docs/ideation/2026-04-28-what-to-add-next-ideation.md` ("Audio-pacing infrastructure + visible block-end countdown chip") as still-fired.
- Suggests that the next pacing-related ship pass should also revisit the planned-block-duration > segment-sum gap as a candidate axis: either authoring more segment content for the long-tail durations, surfacing richer bonus copy under `<SegmentList>` after segments exhaust, or reconsidering the V3 down-only rule for the high-end of the slot range.
- Does **not** by itself unlock new work — confirm with one more session whether the residual is segment-overflow, audio, or a third axis.

### F7 — Coach reading drill copy aloud is "a little inconvenient" on the partner side

**Claim.** "Did you find it was a little hard to read the drill and then explain the drill to your partner? Um... A little, but if I write a word for word, my partner's paying attention, I shouldn't be, but, but yes, it's a little bit, it's not difficult, but... a little bit inconvenient."

**Why it matters.** New finding, lightly stated. The current courtside model assumes the holder of the phone reads the copy and the partner listens; in pair mode this means one partner is doing two things and the other has to pay close attention without seeing the screen. Possible directions in the abstract: text-to-speech for `courtsideInstructions`, a brief partner-readable "what you do" framing pulled out separately from the coach voice, or a rotation that hands the phone over for the partner's turn. None of these are designed today; capturing the friction is the only ask.

**Routing.** Single-instance soft signal. Park as a future-exploration thread; do not author requirements without a second hit on a different session, and treat any solution that touches `D27` local-first or adds platform-dependent capabilities (TTS API surfaces vary across iOS PWA / Android) with the standard caution. Does not fire any trigger today.

### F8 — Wish: clickable glossary for technical volleyball terms

**Claim.** "If certain technical words to the sport, I could click on, and it might explain to me exactly what that means... like, oh, what's a... again, like the set window. Yeah, I think maybe just some of the more technical terms."

**Why it matters.** The current model (M001 Tier 1a, shipped 2026-04-21) uses inline parenthetical definitions on first occurrence of BAB-specialised terms (Pokey, Tomahawk, Sideout, High Line, Cut Shot, Pull Dig). Today's example — "set window" — is already glossed inline in `d05`, `d10`, `d11` (e.g. `d10`'s `courtsideInstructions` reads "the set window (where the setter would stand, about 3 m off the net)"). Seb's ask is for the click-to-define next step: tap the glossed term to re-read the definition without scanning the prose for the parenthetical.

This is **founder feature wish** by `D135`'s definition (a stated "I think we should add" rather than an observed friction during real use). However, the underlying observation — that the parenthetical, once glossed on first occurrence, is not always in line of sight when the term reappears later in the same block — is real and partner-side. The Tier 1a sweep solved the first-occurrence problem; today's ask is about re-access.

**Routing.** Single-instance, single-direction soft ask. Park as input to any future skill-vocabulary or terminology pass; do not author a glossary surface from this note alone. The closest existing track is the courtside-copy invariants and the BAB / FIVB source material catalog (`docs/research/bab-source-material.md`, `docs/research/fivb-source-material.md`), which already curate the term list. Does not fire any trigger today.

### F9 — Wish: optional YouTube example links per drill

**Claim.** "I know we don't have videos for anything, but maybe a YouTube link to examples. If you weren't sure."

**Why it matters.** New direction. Conflicts with `D27` (local-first as a product principle, not just a storage choice) and the rejected-items table in `docs/decisions.md` ("Video analytics / computer vision" — different scope but similar third-party-content posture). Conflicts less directly with the current shibui / decision-fatigue posture: a YouTube link is a way out of the app and into a high-decision attention environment.

**Routing.** Single-instance soft ask under `D135` founder-feature-wish framing. Do not author requirements. Worth recording as a recurring shape of "I'd watch a video" if it appears again in future sessions; if it does, the right response is probably a short inline visual primitive (e.g. a stick-figure SVG) rather than an external-link strategy that sends the user out of the app mid-session.

### F10 — Strong partner-side pull to view past sessions and see what was done

**Claim (extended; from the main memo + the follow-up clip).** "If I could go into my past sessions and see what drills were done once the data is captured, like good, good passing and stuff, like if I could track all of that and also see how I created that session compared to new ones. I think that would be awesome." And: "Every time I open the app and I see my past sessions, I want to be like, ugh, I want to click on this and see what I did last time."

**Why it matters.** This is partner-walkthrough-class evidence that the **M001 Tier 2 "full session history screen"** surface (`docs/milestones/m001-solo-session-loop.md` Tier 2; Tier 1a Unit 5 ships only the last-3-sessions row on Home, the full list is Tier 2) is anticipated by the user, not invented. Two specific things are asked:

1. **A tappable past session.** The current Home last-3-sessions row is a row of cards; the partner-side framing is "I want to click on this." If the row is not currently a tap target leading to a session-detail view, this is a P2-class discoverability or completeness gap for the Home Tier 1a surface.
2. **Visibility of captured per-drill data.** "See what drills were done... like good, good passing and stuff." `D133` per-drill capture (`PerDrillCapture` rows) and the optional `Good / Total` count are stored, but no current surface re-reads them outside the immediate `Complete` screen and the deterministic adaptation pipeline.

In the wish list, item (1) is also implicitly satisfied if the M001 Tier 2 "full session history screen" ships as designed (a screen of past sessions that can be tapped through to a per-session detail view). Item (2) is naturally satisfied by the per-session detail view if it surfaces the `PerDrillCapture` rows and the session-level review.

**This finding also has direct effect on the rejection lines in `docs/ideation/2026-04-28-what-to-add-next-ideation.md`:**

- "Per-block 'last attempt' eyebrow" was rejected as "tier-2 polish; lives in M002 history surface; out of M001 scope." Today's "I want to click on this and see what I did last time" pull is the kind of behavioral signal that polish was anticipating; the rejection line stays correct under D135 (single-session, partner-walkthrough-class) but the pull is now logged.
- "Settings skill heat-map (28-day)" was rejected as "polish-class; defer until a session note explicitly flags monoculture training." Today's note does not flag monoculture, but it does flag the broader trend-visibility shape (see F11), which is the same family.

**Routing.** Update existing trigger reads:

- **M001 Tier 2 trigger (`docs/milestones/m001-solo-session-loop.md` §"Tier 2"):** today's session is **first-class behavioral input** for the "full session history screen" reading of Tier 2 scope. The Tier 2 trigger gates remain Tier 1a acceptance + Condition 3 pass — today's session does not unlock Tier 2 by itself.
- **Adversarial-memo Condition 2:** the underlying behavior — the partner repeatedly opening the app and reaching for the past-sessions list — is exactly the in-app retention shape Condition 2 reads for. Worth surfacing in the next Monday adversarial-memo review.
- **04-28 ideation refresh:** the next refresh of `docs/ideation/2026-04-28-what-to-add-next-ideation.md` should re-read the "Per-block last attempt eyebrow" and "Settings skill heat-map" rejection rows against today's evidence, but the existing rejection rationale (tier-2 polish, polish-class, no firing trigger) does not flip on a single session.

### F11 — Wish: trends/dashboard for skill progress over time and as input to focus recommendations

**Claim (extended).** "Maybe eventually could actually be like a little dashboard page. Like, you can see, like, your improvements on a graph or something. either like on the macro skills and then like the macro, the micro kind of drills that you're doing to improve that skill." And on use: "It would kind of let me... It would be interesting to see if I am progressing over time. Um, regardless of, like, my impression at the end of the session, because I might think I did worse one day than I did another day, but there's still improvement... it would also help me track, like, what... things I did differently or are helping or worsening my game. Um, could even, let me see, like, if I'm over training or under training certain things... appropriately choosing a focus. I mean, alternatively, that data would also, I guess, help the program maybe recommend the best focusses as well."

**Why it matters.** Direct partner-side validation of `D26` ("Weekly progress visibility matters more than gamification in the first MVP envelope") and a strong articulation of the **M002 Weekly Confidence Loop** target user behavior: "does the product become their main training tool?" The user names four specific use cases the trends surface should answer:

1. **Am I progressing over time, independent of session-level vibes?** ("Regardless of my impression at the end of the session.")
2. **Did the things I changed make a difference?** ("Corroborate if things I did differently are helping or worsening my game.")
3. **Am I over- or under-training certain things?** Direct mapping to the deterministic load model under `D74` (load proxy = session RPE × minutes) and the `D80`/`D104` progression / hold / deload rules.
4. **Should the past data inform the recommended focus?** Direct mapping to `D124` ("Adaptation rules use the smallest believable signal") and the recommendation-first posture (`D123`).

Note the load-bearing insight: the user explicitly distinguishes **trend reads from session-level impression**, which is the exact failure mode the deterministic adaptation system in `docs/specs/m001-adaptation-rules.md` is designed to insulate against ("missing or insufficient review data biases toward deload" = `D89`; multi-session reads beat single-session vibes). Surfacing this insulation back to the user as a trend they can read is what the M002 weekly receipt was scoped to do.

**Routing.** Update existing trigger reads:

- **M002 weekly receipt (`docs/milestones/m002-weekly-confidence-loop.md`):** today's session is partner-side input into the M002 weekly-receipt scope (`D74`: planned-vs-completed sessions, one load proxy, one skill proxy). Does not unlock M002 by itself; M002 is gated by `M001` completion. Worth recording for the next M002 scope-read pass that the partner-side framing of the weekly receipt explicitly named "graphs," "macro skills," and "micro drills" — useful inputs for the minimum-receipt design without committing to chart UIs early.
- **Adaptation as recommendation input (D124):** the user's "help the program recommend the best focusses" framing aligns with the existing recommendation-first posture and the deterministic load model. No design change today; record the framing for the M002 scope-read.
- **Founder-use-mode lens:** Seb framed this as something he explicitly wanted, with a clear use story ("track whether or not I'm truly improving and how frequently I should be training"). This is partner-walkthrough-class behavioral evidence that the M002 retention thesis (the app feels like a main training tool, not a one-session helper) reads correctly.

## Non-Findings

- The voice memo did not specify which Tune today chip Nick or Seb actually pressed. The session composition (serve as `main_skill`, set as the swap-in `movement_proxy`, pass at technique and pressure) is consistent with picking "Recommended" on a Pair + Net 40-min beginner build, but it does not by itself confirm which chip was tapped. If the chip selected is needed for any future trigger read, ask in the next session.
- The "warmup/cooldown timing issue" in F6 has at least three plausible axes (planned-block-duration > segment-sum gap, audio-pacing residual under platform boundaries, bonus-copy discoverability) and the voice memo does not disambiguate. Confirm in the next session before designing a fix.
- The voice memo does not establish whether the partner ever tried to interact with the Home last-3-sessions row (as a tap target). F10's "I want to click on this" implies he wanted to and could not, but does not confirm whether he tried and failed or simply imagined it.
- The voice memo does not establish whether the wishlist asks (F8 / F9 / F10 / F11) were prompted by Nick's interview prompts or surfaced spontaneously. The transcript shape ("Did anything confuse you... Is there anything you wish a map had in it...") suggests at least F8 was prompted; the others appear to have built on that prompt without further prompting.
- Today's session does not satisfy any of the formal `D130` falsification gates by itself. It strengthens Condition 2 evidence (in-app retention shape) and adds first-class founder-use-mode trigger input under `D135` for several existing surfaces, but does not flip any decision row.

## For Agents

- **Authoritative for**: the 2026-05-04 pair + net 40-min serving-session field feedback, including the F1–F11 finding set, the timing-axis hypotheses for F6, and the partner-walkthrough-class labelling for F10 and F11.
- **Edit when**: a follow-up session refines one of F6's timing axes; a partner walkthrough or follow-up note disambiguates whether F8 / F9 / F10 / F11 are recurring asks or single-instance.
- **Belongs elsewhere**: append-only behavioral session row (`docs/research/founder-use-ledger.md`); current-state field-evidence entry (`docs/status/current-state.md` Recent Shipped History); decision rows (`docs/decisions.md`); milestone trigger reads (`docs/milestones/m001-solo-session-loop.md`, `docs/milestones/m002-weekly-confidence-loop.md`); next-chunk ideation (`docs/ideation/2026-04-28-what-to-add-next-ideation.md` refresh, when due).
- **Outranked by**: `docs/decisions.md`, `docs/specs/`, validated execution-log evidence, partner-walkthrough scripted reconciliation results, and any future session that refutes a finding here.
