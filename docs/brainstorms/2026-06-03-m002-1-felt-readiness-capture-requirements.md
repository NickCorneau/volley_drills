---
date: 2026-06-03
topic: m002-1-felt-readiness-capture
focus: "Resolve the M002.1 felt-readiness fork (R7/F5): derive vs capture vs defer. Sub-brainstorm of docs/brainstorms/2026-06-03-m002-thin-spine-and-milestone-series-requirements.md."
mode: repo-grounded
related:
  - docs/brainstorms/2026-06-03-m002-thin-spine-and-milestone-series-requirements.md
  - docs/research/subjective-skill-confidence-validity.md
  - docs/research/2026-06-02-m002-evidence-meta-synthesis.md
  - docs/solutions/design-patterns/low-dose-self-coached-progress-signal-design.md
governing_decisions:
  - D149
  - D150
---

# M002.1 Felt-Readiness Capture (R7/F5 fork resolution)

## Summary

Resolves the open M002.1 felt-readiness fork surfaced in the 2026-06-03 solution-space ideation (survivor #5) and left open by `D150`. **Recommendation: defer the self-reported felt-readiness signal from v1**, keep R8's free, honestly-labeled **felt-difficulty** proxy (derived from the existing per-drill difficulty-tag distribution), and reserve a clean, fully-specced **seam** for the research-correct readiness capture (weekly, off-session, skill-specific, 11-pt NRS) in a later M002 milestone. Explicitly **reject capturing felt-readiness at session review** — review is the contaminated post-session window the owning research says to avoid, so the cheapest capture is the least honest one.

## Problem Frame

`D149` reframed confidence to a **felt-readiness companion** (never skill proof, never single-week delta, dip never auto-read as failure) and made the weekly receipt behavioral-primary. M002.1's R7 wants that companion; F5 flagged it is **net-new capture** (no readiness field exists on `SessionReview`), and R8 wants one honest skill proxy from the already-captured difficulty-tag distribution. The ideation framed a two-way fork — **Bet A** (derive readiness from difficulty tags, zero capture) vs **Bet B** (one optional review-side field).

Two findings reframe the fork:

1. **Construct + window contamination (owning research).** `docs/research/subjective-skill-confidence-validity.md` is unanimous that an honest readiness signal must be **skill-specific, present-state "can-do," 11-pt NRS (0–10), fixed weekly cadence, administered OFF the immediate post-session window** (mood/fatigue/last-session-outcome contamination peaks right after a session; the backend computes deltas). F5's assumed "review-side field" *is* that contaminated window.
2. **Bet A is the wrong construct, doubly.** The per-drill difficulty tag measures **felt-difficulty of the drill that was served** — a different construct from readiness — captured per-drill in the same contaminated window, and using it as the readiness companion collapses R7 and R8 into one signal the research deliberately keeps distinct.

So the four honest shapes sit on an honesty-vs-cost axis: **Defer** (no self-report in v1) · **Derive-but-rename** (free, but call it felt-difficulty, not readiness — which is just R8) · **Capture-cheap** (review-side NRS; contaminated) · **Capture-honest** (weekly off-session NRS; research-correct but a new recurring surface). Felt-readiness is the **demoted** companion — the founder's #1 "see it adapting / 1% better" need is carried by the carry-forward + offered verdict (R4/R5), not a readiness number — so the cost bar for adding capture in v1 is high.

## Key Decisions

- **Defer the self-reported felt-readiness signal from M002.1 v1.** v1's receipt carries the behavioral-consistency headline (R6) + R8's honest felt-difficulty proxy + the carry-forward/verdict investment surface (R4/R5). No self-reported readiness number ships in v1. This is within the option space the parent requirements already sanctioned ("If the founder prefers zero new capture, confidence drops out of the v1 receipt and re-enters in a later milestone").
- **Keep R8 unchanged and honestly labeled.** The difficulty-tag distribution remains the single skill proxy, surfaced as **felt-difficulty** ("your serve drills have felt harder lately"), relative-to-you, never an objective skill grade, never future-predicted. It is *not* relabeled "readiness."
- **Reserve a clean readiness seam (specced now, built later).** When readiness ships, it ships as the research-correct shape, not the cheap one (see Reserved Seam below). This mirrors R10 reserving the drill-score seam for M002.3.
- **Reject capture-at-review (Bet B-review).** Shipping a contaminated, per-session readiness number violates the calm/honesty invariants (`low-dose-self-coached-progress-signal-design.md`: never auto-read a dip as failure; never skill proof) and would have to be re-built honestly later anyway.
- **`D149` meaning-reframe still holds.** Deferring the *self-report* does not reopen the confidence→felt-readiness meaning change; v1 simply does not surface a readiness number yet, and nothing in v1 implies confidence is skill proof.

## Reserved Seam — readiness capture (future M002 milestone, not v1)

Specced now so the later build is a drop-in and the v1 receipt formatter leaves room for it:

- **Construct:** present-state skill-specific self-efficacy ("how confident are you that you can execute [skill] reliably in a normal practice right now?"). Never global, never a retrospective "since last week" change-anchor.
- **Format:** 11-pt NRS (0–10) — the only format inside all three vendors' acceptable sets.
- **Cadence + placement:** fixed **weekly**, administered **off** the immediate post-session window — a Home/receipt-side weekly prompt, **not** at session review and **not** a pre-run route (R11/`D137`-safe). One reading per skill per week.
- **Display (already constrained by R7):** rolling 2–4-week band, never a single-week delta, dip framed as "weather, not failure," labeled felt-readiness/engagement, never "your skill improved." Backend computes any delta.
- **Persistence (per `D150`):** when built, it is a persisted *user input* (skill, value, week, timestamp) replayed through the formatter — consistent with derive-don't-persist (inputs are stored; the receipt is regenerated from them).
- **Pairing:** always shown beside the behavioral headline; high-behavior / flat-readiness divergence is *coachable context*, never a failure flag.

## Success Criteria (v1)

- v1's receipt reads as a calm investment surface using behavioral consistency + felt-difficulty + visible adaptation, with **no** surface implying confidence/readiness is skill improvement.
- No new capture moment is added to v1; the quick-start and review flows are unchanged.
- The later readiness build is a drop-in: the receipt formatter and persistence model already accommodate a weekly skill-keyed NRS input without rework.

## Scope Boundaries

- **In v1:** behavioral headline (R6), felt-difficulty proxy (R8, derived), carry-forward + verdict (R4/R5). No self-reported readiness.
- **Deferred (reserved seam):** weekly off-session 11-pt NRS readiness capture + its rolling-band display, in a later M002 milestone.
- **Rejected:** review-side / per-session readiness capture (contaminated window); deriving readiness from difficulty tags and *calling* it readiness (wrong construct, collapses R7/R8).

## Dependencies / Assumptions

- Assumes the v1 receipt is satisfying enough as an investment surface without a self-reported readiness number, given carry-forward/verdict carry the #1 need. If founder dogfood shows the receipt feels flat without a readiness companion, pull the reserved seam forward (it is fully specced).
- Assumes a weekly off-session prompt is the right home for readiness when it ships — not review, not pre-run. Revisit only if a non-review, non-pre-run weekly surface proves infeasible.
- Consistent with `D149` (felt-readiness reframe), `D150` (derive-don't-persist; any future readiness field is a stored input), `D137` (no new pre-run route), `D146` (pair-first; readiness is per-person within the pair when built), R7/R8/R10/R11.

## Outstanding Questions

- **Founder ratify:** accept deferral, or pull the reserved weekly-readiness seam into v1 despite the new-surface cost? (Recommendation: defer.)
- **When the seam fires:** which later milestone owns it — alongside M002.3's drill score, or its own slot? (Defer to roadmap-lock / per-milestone planning.)
- **Pair shape:** is weekly readiness captured per-person or per-pair? (Defer to the readiness build; `D146` pair-first suggests per-person with a pair roll-up.)

## Sources / Research

- `docs/research/subjective-skill-confidence-validity.md` — the owning synthesis: state-not-trait, contamination is the blocker, 11-pt NRS, skill-specific, present-state, weekly, off-session.
- `docs/research/2026-06-02-m002-evidence-meta-synthesis.md` — behavioral-primary, confidence-as-companion.
- `docs/solutions/design-patterns/low-dose-self-coached-progress-signal-design.md` — never single-week delta, dip ≠ failure, reserve clean seams.
- `docs/brainstorms/2026-06-03-m002-thin-spine-and-milestone-series-requirements.md` — R7/R8/R10/R11, F5/F6, the parent v1 scope; `D149`, `D150`.
