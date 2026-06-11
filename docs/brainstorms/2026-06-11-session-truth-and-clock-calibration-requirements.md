---
id: brainstorm-session-truth-clock
title: Session Truth and Clock Calibration — Honest-Recording Slice
status: complete
stage: implemented
type: requirements
date: 2026-06-11
topic: session-truth-and-clock-calibration
summary: "Stop recording deliberately wrapped sessions as abandonment and calibrate plan durations against observed time. The honest-recording remainder of the Close the Loop ideation after D154 shipped verdict-steered assembly. No new exposure surfaces; derived reads per D150. Consumed planning history: shipped 2026-06-11 as D155 via docs/plans/2026-06-11-002-feat-session-truth-and-clock-calibration-plan.md (AE5 re-pinned at session grain; calibration is session-grain, not per-block)."
authority: requirements input for planning; subordinate to docs/decisions.md and the M002 series requirements
last_updated: 2026-06-11
depends_on:
  - docs/ideation/2026-06-11-what-to-build-next-ideation.md
  - docs/brainstorms/2026-06-11-stress-substrate-requirements.md
  - docs/decisions.md
---

# Session Truth and Clock Calibration — Requirements

## Summary

Two recording dishonesties survive now that `D154` made accepted adaptation verdicts act on assembly. First, a session the user deliberately wraps early is recorded and re-presented as abandonment — `ended_early` status, a forced "Why did you end early?" pick at Review. Second, the plan's time promise never learns: assembled durations are static authored minutes, and even the recorded "actual duration" sums planned minutes rather than observed time. This slice fixes both. No new exposure surfaces; all new reads are derived per `D150`.

## Problem Frame

The founder's 2026-05-10 export recorded a session as `ended_early`; the founder annotated it "We did not end early." The app has one end-of-session affordance and it always records abandonment: ending after the work that mattered marks every remaining block skipped, stamps `ended_early`, and Review then refuses to submit until the user picks a reason they "ended early" — a forced false confession. Meanwhile skipping through the same remaining blocks one at a time records `completed`: two courtside-equivalent wraps, opposite records.

On time: the 2026-06-11 red-team review found the trust pillar attacked from three sides, with duration budgeting flagged in 2/2 founder field sessions — and notes this was already absorbed into M002 carry-forward, so the finding "adds urgency, not new scope." Observed per-block time is already captured (block start/complete timestamps), but nothing reads it: assembly re-promises the same authored minutes, and the recorded session duration is computed from planned minutes for completed blocks.

The adaptation loop now acts on this data (`D154` rung-steered assembly; eligibility and receipt reads gate on session records). A loop that acts on falsely recorded ends and uncalibrated time promises is acting on dirty inputs — this slice is the "record nothing false" half of the honest loop, the remaining debt after `D154` cashed the "act on what you show" half.

One claim from the originating ideation is stale and dropped: the end-early reason prompt already uses chips (`time` / `fatigue` / `pain` / `other`), not typed input. No work there.

---

## Key Decisions

- **Capture end intent at the end moment, not by post-hoc reclassification.** Ending a session distinguishes "done — wrapped deliberately" from "cut short" when the user ends it, with at most one extra low-typing tap. Downstream surfaces honor that intent; nothing infers it later from block patterns.
- **Courtside-equivalent actions record equivalent truth.** Wrapping by skipping remaining blocks and wrapping via the end affordance converge on the same recorded meaning.
- **Calibration is a derived read.** Observed-duration reads and any plan-duration adjustment are pure folds over existing execution records — no persisted calibration artifact, per `D150`.
- **Internal-first posture inherited from `D154`.** No new exposure surface. The assembled plan's duration display and existing status labels are the only visible traces of calibration and end-intent honesty.
- **Verdict→assembly is out of scope — already shipped.** `D154` closed `D152`'s accepted-delta-does-nothing gap with rung-steered assembly. This slice does not touch adaptation mechanics.

---

## Requirements

**Session-end truth**

- R1. Ending a session before all blocks run captures whether the user is done (deliberate wrap) or cut short, at the end moment, with at most one additional tap and no typing.
- R2. A deliberately wrapped session is not presented as abandonment anywhere it is read: Home/Recent, Review header, and the founder export do not label it ended-early or incomplete.
- R3. Review requires an end-early reason only for genuinely cut-short sessions; the existing reason chips are untouched for that case.
- R4. Wrapping by skipping the remaining blocks and wrapping via the end affordance produce records with the same meaning.
- R5. Existing persisted records are not retroactively reclassified; the distinction applies to sessions recorded after this ships.

**Clock calibration**

- R6. The recorded session duration reflects observed time, not planned minutes summed over completed blocks.
- R7. Assembled plan durations calibrate against observed block time, so the session-length promise tracks courtside reality.
- R8. With sparse or absent observed history, authored planned durations stand unchanged — calibration never extrapolates from too little data.
- R9. Calibration reads are deterministic and pure: same records, same durations (`P7`, `D150`).

**Constraints**

- R10. The only new persisted write is the R1 end-intent input (a human input that cannot be derived, inside `D150`'s persistence floor); no other schema growth, no new capture surfaces (`D151`).
- R11. No new user-facing surface; existing duration and status displays are the only visible traces (`D154` internal-first posture).

---

## Acceptance Examples

- AE1. **Covers R1, R2, R3.** The founder finishes the work that mattered, skips the tail, and ends the session as done. Home and the export show a finished session; Review never asks "Why did you end early?" — the inverse of the 2026-05-10 "We did not end early" annotation.
- AE2. **Covers R1, R3.** A session genuinely cut short by pain: end as cut-short, Review requires a reason via the existing chips, record reads as incomplete — unchanged from today.
- AE3. **Covers R4.** One user skips the remaining two blocks one at a time; another taps end-as-done at the same point. Both records carry the same meaning on every read surface.
- AE4. **Covers R6.** A session whose two completed blocks took 26 observed minutes against 20 planned records ~26, not 20.
- AE5. **Covers R7, R8.** After several sessions where warmup consistently runs over its authored minutes, the next assembled plan's warmup duration reflects observed time; with only one prior session, assembled durations are unchanged.

---

## Scope Boundaries

**Deferred for later**

- Mid-session extend / re-entrant recomposition (Elastic Outing — named follow-up in the 2026-06-11 ideation doc).
- Tap-deep "why" exposure of adaptation reasoning — parked until rung-steered assembly has dogfood evidence, honoring `D154`'s internal-first posture.
- `D154`'s named rung-steering gaps (build-time substitution bypass, swap-path rung-awareness) — stay on that plan's follow-up list.
- Attack/tactics content; 3s/4s and rotation support.

**Outside this slice's identity**

- Physiological load management — calibration here is wall-clock honesty, never sRPE re-parameterization.
- Any adaptation movement without user acceptance (`D154` pedagogy stands).

---

## Dependencies / Assumptions

- `D150` (derive-don't-persist) and `D151` (no new capture beyond named inputs) bind; the R1 end-intent input is the only candidate new write.
- Verified: per-block `startedAt`/`completedAt` timestamps exist on execution block statuses, so observed block durations are derivable from existing records. Pause handling within a block is a planning-time question.
- Founder evidence basis: the 2026-05-10 export annotation ("We did not end early"); duration budgeting flagged in 2/2 founder field sessions (2026-06-11 red-team review).

---

## Outstanding Questions

**Deferred to planning**

- How historical `ended_early` records read under the new distinction (display-time mapping vs leaving them as-is; R5 forbids rewriting them).
- Pause-aware derivation of observed block duration.
- Calibration grain: per block-type, per drill, or per plan-slot.
- The sparse-history threshold below which R8 holds planned durations.
- The end-affordance shape that carries R1's one-tap distinction (within the existing end flow; no new route per `D137`).

---

## Sources

- `docs/ideation/2026-06-11-what-to-build-next-ideation.md` — originating ideation; survivor 1 (Close the Loop For Real) and the session-truth/clock fold.
- `docs/decisions.md` — `D150`, `D151`, `D152`, `D154` (the shipped "act" half), `D137`.
- `docs/brainstorms/2026-06-11-stress-substrate-requirements.md` + `docs/plans/2026-06-11-001-feat-stress-substrate-plan.md` — the substrate this slice complements; internal-first posture.
- `docs/reviews/2026-06-11-red-team-review.md` — duration-budgeting field signal; trust-pillar framing.
- `app/src/domain/executionState.ts` — `buildEndedSession` (always `ended_early`), `buildAdvancedBlock` (skip-wrap yields `completed`), `computeActualDurationMinutes` (sums planned minutes).
- `app/src/screens/review/useReviewController.ts` — forced reason gate (`needsIncompleteReason`); existing reason chips.
