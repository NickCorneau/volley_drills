---
id: 2026-05-10-pair-net-serving-duration-feedback
title: "Pair + Net Serving Duration Feedback (founder + Seb, 40 min)"
status: active
stage: validation
type: research
authority: "Curated field feedback from the 2026-05-10 founder + Seb pair + net 40-minute session. Captures gate-relevant session data, per-drill capture quality, and the repeated warmup / duration-budget friction without changing canon decisions or authorizing implementation by itself."
summary: "The 2026-05-10 founder + Seb Pair + Net 40-minute session logged another real D130 founder-use session and sharpened the pacing read: the app recorded an ended_early execution with the wrap skipped, but the user note says the session did not really end early; instead, warmup timing is still wrong and the drills had too many minutes. Three per-drill captures (`d10-pair`, `d33-pair-open`, `d22-pair`) were all marked `still_learning`, with no Good/Total counts and no streak metric capture. Routing impact: updates weekly D130 counts to 7 logged sessions, keeps Condition 1 fail-trending under the standard read (solo share 1/7, set floor 0/3), adds one serve-focused pair session, strengthens the existing warmup / block-duration validation issue, and does not fire D134 or any new content scope."
last_updated: 2026-05-10
depends_on:
  - docs/research/founder-use-ledger.md
  - docs/plans/2026-04-20-m001-adversarial-memo.md
  - docs/status/m001-validation-overhang.md
  - docs/roadmap.md
  - docs/research/2026-05-04-pair-serving-session-feedback.md
related:
  - docs/research/2026-05-04-pair-serving-session-feedback.md
  - docs/research/2026-04-28-audio-pacing-reliability-investigation.md
  - docs/plans/2026-04-28-per-move-pacing-indicator.md
decision_refs:
  - D130
  - D133
  - D134
  - D135
---

# Pair + Net Serving Duration Feedback

## Agent Quick Scan

- Session: 2026-05-10, founder + Seb, **pair + net, 40-min profile, actualDurationMinutes 38, RPE 5**. Plan `5210a07e-...`, execution `9529becd-...`, `assemblyAlgorithmVersion: 6`, `swapCount: 1`.
- Export status says `ended_early` and the wrap block was skipped, but the review note says: "We did not end early - warmup timing still wrong. Too many minutes for drills."
- Main-skill block was swapped from `d11-pair` One-Arm Passing to `d33-pair-open` Around the World Serving. Capture rows landed for `d10-pair`, `d33-pair-open`, and `d22-pair`; all three were `still_learning`.
- Routing: this is a **serve-focused pair session** for weekly D130 counting. It updates counts and cadence; it does not authorize a new implementation plan by itself.
- The load-bearing product read is pacing: the previous 2026-05-04 note framed warmup/cooldown timing as three possible axes. Today's shorter note points more directly at **planned duration budgets**: warmup timing is still wrong, and the drill blocks feel overlong.

## Session Context

Source: Dexie export `volley-drills-export-2026-05-10.json` provided by the founder on 2026-05-10.

Plan composition:

- `block-0` warmup — `d28 Beach Prep Three` (5 min planned)
- `block-1` technique — `d07 Pass & Look` (6 min planned)
- `block-2` movement_proxy — `d10 The 6-Legged Monster` (6 min planned)
- `block-3` main_skill — planned `d11 One-Arm Passing Drill`, swapped to `d33-pair-open Around the World Serving` (10 min planned)
- `block-4` pressure — `d22 First to 10 Serving` (8 min planned)
- `block-5` wrap — `d26 Lower-body Stretch Micro-sequence` (5 min planned, skipped in the execution log)

Per-drill captures:

- `d10-pair`: `still_learning`
- `d33-pair-open`: `still_learning`
- `d22-pair`: `still_learning`

Review:

- `sessionRpe`: 5
- `goodPasses`: 0
- `totalAttempts`: 0
- `captureWindow`: `immediate`
- `eligibleForAdaptation`: true
- `shortNote`: "We did not end early - warmup timing still wrong. Too many minutes for drills"

## Findings

### F1 — The weekly D130 count advances, but the solo / set gates do not

This is the second logged session in the week of 2026-05-04 and the seventh logged founder/joint session in the D130 window. It improves cadence and keeps the 45-day low-cadence trigger clear.

It does **not** improve the two sharpest Condition 1 sub-reads:

- solo share becomes 1 of 7, about 14 percent, still below the standard 40 percent bar
- set-focused session count remains 0 of 3

Because the session's main and pressure work were serving and the support blocks were passing, the ledger should count this as `serve`, not `mixed`.

### F2 — The export's `ended_early` status and the user note disagree

The execution log says `status: ended_early`, with the wrap block skipped. The review note explicitly says the session did not end early. This is an interpretation problem, not just a data problem.

Likely reading: from the user's perspective, the session reached the meaningful work and then stopped because the planned duration budget was too heavy; from the app's state machine, skipping the wrap still records an early ending.

Routing implication: future validation reads should not treat `ended_early` alone as abandonment. For long pair sessions, inspect the review note, actual duration, skipped block type, and which blocks completed before deciding whether this is a motivation failure, a pacing failure, or ordinary courtside adaptation.

### F3 — Warmup timing remains a live issue

The 2026-05-04 note already named warmup/cooldown timing as unresolved, with possible causes including planned-block-duration greater than segment-sum, audio-pacing residual, and bonus-copy discoverability.

Today's note is narrower: "warmup timing still wrong." That points back to the same warmup-duration budget issue rather than to a new drill-content ask.

Routing implication: the next pacing pass should prioritize the warmup block read before inventing new surfaces. In particular, verify whether `d28` on 5-minute pair-net sessions gives enough visible work for the full planned slot, or whether the user experiences the extra time as dead air.

### F4 — Drill blocks may be over-budgeted for this long pair session shape

"Too many minutes for drills" is a stronger statement than the 2026-05-04 "timing issues" note. The session included a 10-minute serving main_skill and an 8-minute serving pressure block after two passing-oriented support blocks.

This does not mean 40-minute pair sessions are wrong. It means the current long-session budget can overshoot the beginner / still-learning partner experience when multiple still-learning drills stack in one run.

Routing implication: treat this as validation input for duration-envelope review, not as immediate authorization to change the 40-minute profile. One more session should disambiguate whether the issue is:

- block-duration budgets on 40-minute pair-net sessions
- too many distinct still-learning drills in one session
- serving pressure stacked after serving main_skill
- wrap being lost because useful work already felt complete

### F5 — Per-drill difficulty remains the right low-friction capture shape

All three captured drills were marked `still_learning`; no Good/Total counts were entered. That is coherent with `D133`: difficulty is required, counts are optional.

There is no evidence here that Difficulty-only was insufficient. There is also no `streak` drill in the captured rows, so this session does not add evidence for or against the `D134` optional-streak falsification gate.

## Non-Findings

- This session does not prove that the partner opened the app unprompted. It is partner usage evidence, not a Condition 3 final read by itself.
- This session does not fire D134. No captured drill used the optional streak shape.
- This session does not authorize custom 90-minute timing, D101 3+ player support, or new drill records.
- This session does not decide whether 40-minute profiles should be removed. It says the current 40-minute pair-net budget deserves scrutiny.

## For Agents

- **Authoritative for**: the 2026-05-10 pair + net session evidence, weekly-count update, and pacing / duration-budget interpretation.
- **Edit when**: a follow-up session clarifies whether the duration issue is warmup-specific, long-profile-specific, still-learning-stack-specific, or serving-pressure-specific.
- **Belongs elsewhere**: append-only session row and week rollup (`docs/research/founder-use-ledger.md`), weekly ritual counts (`docs/plans/2026-04-20-m001-adversarial-memo.md`), gate scoreboard (`docs/status/m001-validation-overhang.md`), and phase-level validation framing (`docs/roadmap.md`).
- **Outranked by**: `docs/decisions.md`, `docs/milestones/m001-solo-session-loop.md`, and future sessions that disambiguate today's timing note.
