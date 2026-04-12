---
id: M001-adaptation
title: M001 Adaptation Rules
status: draft
stage: planning
type: spec
authority: pass-first progress/hold/deload thresholds and rules
summary: "Rules-first progress/hold/deload thresholds for the pass-first loop."
last_updated: 2026-04-12
depends_on:
  - docs/milestones/m001-solo-session-loop.md
  - docs/specs/m001-review-micro-spec.md
decision_refs:
  - D11
  - D18
  - D21
  - D23
  - D63
  - D64
  - D65
---

# M001 Adaptation Rules

## Governing decisions

D11 (rules-first adaptation), D63 (one dimension at a time), D64 (deload reduces serving/jumping), D65 (spacing rule).

## Purpose

Define the first rules-first adaptation model for the passing-fundamentals / serve-receive loop, including the minimum safety contract that gates and shapes every session.

This is a planning default for M001, not a claim that the thresholds are perfect forever. Exact progression/deload thresholds and sRPE-load change caps need expert review before public launch.

Favor trust and safety over sensitivity. A conservative system that explains itself is better than a "smart" system reacting to noisy self-report data.

## Safety contract

Safety in M001 is enforced by workflow structure — structured fast taps that gate the session and shape conservative defaults — not by copy-only disclaimers. See `docs/research/beach-training-resources.md` for the full evidence base.

### Regulatory positioning

The product is general training support, not medical advice. It does not diagnose injury, treat conditions, or claim to reduce injury risk through personalized risk scoring.

The product will **not**:

- diagnose or name specific injuries
- provide return-to-play guidance for specific conditions
- compute or display injury-risk scores (no ACWR "danger zone" messaging)
- claim to prevent injury through personalization

Visible copy: "This is training guidance, not medical advice. You are responsible for your choices."

### Pre-session safety check

Before every session, the user answers 2-3 fast taps. These gate and shape the session before the warm-up block begins.

**Pain flag (mandatory):**

- Question: `Any pain that changes how you move?`
- Input: `yes / no`
- If yes: default to a recovery/technique-only session. User may override, but the default is conservative.
- This is a binary safety gate, not a soreness questionnaire. Normal post-exercise soreness (DOMS) is expected; pain that changes movement patterns is the safety-critical signal.

**Training recency (mandatory):**

- Question: `Trained in last 7 days?`
- Input: `0 / 1 / 2+` (auto-derived from session history when available)
- If 0: automatically scale down session volume and intensity. A "normal" session after a layoff violates the "too much too soon" consensus.

**Heat awareness (contextual, beach-specific):**

- A single "hot day" CTA revealing heat exhaustion/stroke symptoms and "stop if…" guidance. Shown once per session on hot days, not as a quiz or gate.

### Stop/seek-help triggers

Accessible offline and visible without navigating into settings. Passive reference, not algorithmic triage.

- Chest pain or pressure
- Extreme or unusual breathlessness
- Irregular or racing heartbeat
- Dizziness, lightheadedness, or fainting
- Confusion or disorientation
- Heat stroke red flags: confusion, cessation of sweating, hot/dry skin
- Injury pain that persists, worsens, or changes how you move

Copy: "Stop training. If symptoms are severe or don't resolve quickly, call emergency services."

### Mandatory session structure

Every session must include:

- **Warm-up block** — cannot be removed; can be shortened to a minimum version. Content: ankle/landing preparation, shoulder activation, gradual intensity ramp.
- **Main work blocks**
- **Cool-down block** — cannot be removed; can be shortened to a minimum version. Content: gentle movement and light stretching.

Exact warm-up/cool-down content and minimum duration need volleyball coach review.

### Ankle history modifier

If the user reports ankle issues in the last 12 months (captured in onboarding or profile):

- Bias sessions toward controlled movement and proprioception basics
- Surface an optional "consider brace/tape" recommendation
- Conservative lateral movement and landing volume

### Conservative defaults for unknown preparedness

When preparedness is unknown (new user, first session, or long gap since last session):

- Default shorter duration and fewer high-intensity reps
- Bias toward technique-focused work
- Do not assume the user is ready for the volume or intensity their self-reported level might suggest

## Inputs

Use only lightweight, self-loggable inputs:

- `starterMetric`
  - first-session or control-drill metric before scored passing is introduced
  - examples: `successfulReps`, `targetCompleted`
- `goodPasses`
  - count of scored contacts marked `Good`
- `attemptCount`
  - total scored contacts for the same scored portion of the session
- `goodPassRate`
  - derived as `goodPasses / attemptCount`
- `sessionRpe`
  - whole-session effort on a `0-10` CR10-style scale
  - question wording: `How hard/intense was your session?`
- `sessionDurationMinutes`
  - actual session duration from the timer (required for sRPE-load computation)
- `painFlag`
  - pre-session binary: "pain that changes how you move" (yes/no)
- `daysSinceLastSession`
  - auto-derived from session history; falls back to pre-session tap if history unavailable
- `reviewTiming`
  - `delayed` is preferred (`10-30` minutes after session end)
  - `immediate` is allowed as a fallback when delayed capture would likely be missed
- `sessionCompletion`
  - `completed` or `ended_early`
- `incompleteReason`
  - required when `sessionCompletion = ended_early`
  - options: `time`, `fatigue`, `pain`, `other`

Safety note:

- `painFlag` belongs in the pre-session safety check, not in the post-session adaptation score. It gates the session before work begins.
- `daysSinceLastSession` shapes the session's default volume/intensity, not the post-session adaptation outcome.

## sRPE-load as the internal load primitive

Compute: `sRPE-load = sessionRpe × sessionDurationMinutes`

This is the minimum viable internal load signal. It is well-validated across multiple sports, requires no wearables, and combines intensity and duration into a single number. It replaces raw RPE alone as the primary load signal for between-session adaptation.

Use sRPE-load for:

- Detecting back-to-back hard sessions
- Enforcing conservative week-to-week change caps
- Triggering automatic deload after high-load sessions
- Scaling down sessions when returning from a gap

Planning defaults (exact thresholds need expert calibration):

- If last session sRPE-load was in the top quartile of the user's recent history, default the next session to hold or deload
- Week-to-week sRPE-load should not increase by more than ~20-30% (placeholder pending expert review)
- No back-to-back sessions where both exceed the user's recent median sRPE-load unless the user explicitly overrides

## Scoring stance

- M001 does not use a `0-3` pass-quality scale as its primary pass metric.
- When pass quality is scored, use a binary `Good` / `Not Good` rule.
- `Good` must be tied to a clear target-zone or playable-next-contact standard, not "setter options" language.
- Progression should never depend on a session with too few scored contacts to trust the signal.

### Set-window as the physical basis for "Good"

The user places a marker roughly 2 m off the net and 1 m inside midcourt before the session (30-second setup). This is the "set window" — the physical reference point for scoring.

- **Good:** the ball peaks or lands within ~2–3 big steps of the marker with a controllable trajectory. This maps to grades 2–3 on the full 0–3 scale (see D78).
- **Not Good:** the ball lands outside that zone, requires a chase, or is an error. This maps to grades 0–1.

The binary split at grade 2 means `goodPassRate` directly corresponds to "percent of passes graded 2+" in the full scale, which is consistent with the 70% progression gating heuristic from Volleyball Canada (D80).

### Wind adjustment

FIVB explicitly notes that as wind increases, pass trajectory should be lower and tighter. In wind:

- A lower, tighter pass to the set-window zone is still "Good," not a flaw.
- The set-window position stays fixed, but acceptable trajectory changes.
- Wind level should be captured at session start (calm / light wind / strong wind) so the review can contextualize the outcome.

### Later expansion to 0–3

The full 0–3 scale (3 = within ~1 step, 2 = within 2–3 steps, 1 = outside 2–3 steps, 0 = error) is defined in D78 and documented in `docs/research/beach-training-resources.md`. It should be introduced after validation shows users tolerate the binary version courtside and want finer-grained feedback. The binary Good/Not Good is the safe M001 default per D47.

## Decision outcomes

- `progress`
- `hold`
- `deload`

## Rules

### Starter-session bootstrap

For first-run starter sessions or drills that do not yet use pass scoring:

- bias toward `hold`, not immediate progression
- use `progress` only when the user clearly hit the starter target, completed the session, and `sessionRpe` stayed moderate
- use `deload` when the user stopped early for `fatigue` or `pain`, or reported very high effort

This keeps the first adaptation explainable without turning the first session into a scoring lesson.

### Progress

Move the next session slightly harder only if:

- the session has a trusted metric for that drill type
- `attemptCount` meets the session minimum required to trust the signal, or the starter metric clearly met its target
- `goodPassRate` meets or exceeds the session's pass target when pass scoring is in play
- `sessionRpe` is in a moderate range such as `4-6`
- the same result happens in `2` consecutive completed sessions
- the review is complete; missing data never triggers progress

Allowed progression changes (pick **one**, not multiple):

- slightly smaller target
- slightly harder drill variant
- one modest rep or set increase

Only change one dimension per progression step (difficulty or volume, not both simultaneously). This keeps the signal clean for the next review.
Prefer difficulty before volume.

### Hold

Repeat the same level next session if:

- the user logged too few scored contacts
- `goodPassRate` is below the progress target but not clearly poor
- `sessionRpe` is high enough to question readiness but not severe
- the review is missing or still pending
- the session ended early for `time` or another neutral reason

Intent:

- preserve trust
- avoid fake progress
- let quality stabilize before increasing difficulty
- default safely when data is incomplete or noisy
- rotate a minor parameter when possible instead of cloning the last session exactly

### Deload

Reduce difficulty or volume next session if:

- the session ended early for `fatigue` or `pain`
- `sessionRpe >= 9`
- enough scored contacts were logged and `goodPassRate` was clearly below the session's acceptable floor
- the user hit the in-session stop rule and still finished with clear overload signals

Allowed deload changes:

- reduce total volume by roughly `20-40%`
- easier drill variant
- fewer reps or sets
- shorter session block
- remove higher-load serve or jump exposure first when present

Volleyball-specific load concern: overuse shoulder injuries are load-sensitive. When a deload session includes serving or jumping drills, reduce their volume or replace them with lower-load alternatives, not just generic "easier" variants.

## Missing-data policy

- If the skill metric is `notCaptured`, default to `hold` unless the incomplete reason or `sessionRpe` points to clear overload.
- If `attemptCount` is below the session minimum, treat the session as `insufficient_data` and default to `hold`.
- If `sessionRpe` is missing, do not progress even if quality improved.
- If the review is skipped entirely, duplicate-last or `hold`; never invent a harder plan.

## In-session stop rule

Suggest ending the current drill early if any of these happen:

- quality drops across `2` consecutive scoring windows
- perceived effort jumps by `2+` points within the session
- the user reports pain

## Spacing and repetition rule

Do not repeat the exact same drill configuration in the same block slot within the last `2` sessions unless the user chose `hold` and explicitly wants repetition.

Rationale: repetition is necessary for skill learning, but perceived monotony reduces adherence. Evidence does not provide a clean threshold, so this is a conservative default that should be validated in prototype testing and relaxed if needed.

When `hold` is the outcome:

- keep the same difficulty level
- rotate a minor parameter when possible (for example target placement, rep scheme, or rest ratio) instead of cloning the exact same configuration

## What this model intentionally avoids

- opaque AI recommendations
- hidden weighting systems
- injury-risk scoring, ACWR-style ratios, or "danger zone" messaging
- long-term periodization logic in M001
- device-dependent load metrics (wearables, HRV)
- changing both difficulty and volume in the same step
- medical diagnosis or return-to-play guidance
- deep recovery analytics

## Drill-level progression gating

When a drill uses a binary success metric (Good / Not Good), 70% success across a block is the working threshold for advancing to a harder variant (D80). This is consistent with the session-level progression rules (which require `goodPassRate` to meet or exceed the session's pass target) and provides a concrete default when exact per-drill targets have not been calibrated.

## What still needs validation

- minimum `attemptCount` needed before `goodPassRate` is stable enough to trust
- exact pass-rate targets by drill family and level (70% is a working default from Volleyball Canada, not a proven threshold for this product)
- delayed `sessionRpe` compliance versus immediate capture
- whether two-session confirmation feels fair rather than slow
- whether self-scored `Good` / `Not Good` agrees closely enough with partner or video review
- exact sRPE-load change caps for amateur beach sessions (sports scientist / S&C review)
- warm-up and cool-down content and minimum duration (volleyball coach review)
- pain flag phrasing: whether "pain that changes how you move" is correctly interpreted by users (prototype testing)
- courtside friction of pre-session safety taps in bright sun with sand/sweat
- tolerance for conservative defaults: whether users feel patronized or appreciate the caution
- set-window geometry: default marker position for different sides/handedness and common amateur beach systems (expert coach review)
- whether users will actually place a set-window marker before each session (courtside prototype testing)
- final wording of disclaimers and risk-related copy for general-wellness intent (legal/compliance review)

## User-facing explanation

The system should always be able to explain the outcome in plain language:

- `You hit the target often enough twice in a row, so next time gets a little harder.`
- `We kept this the same because there was not enough signal to trust a change.`
- `You ended early for fatigue, so next time backs off a bit.`

## Progression dimension rule

Each adaptation step should change **one** dimension, not multiple:

- `progress` changes either difficulty (harder variant, tighter constraint) **or** volume (more reps/sets), not both
- `deload` reduces either difficulty **or** volume as the primary change; serving or jumping volume reduction is additive when those actions are present

This keeps the cause-effect relationship between session changes and outcomes legible, and avoids compounding changes that make it hard to tell what helped or hurt.

## Related docs

- `docs/prd-foundation.md`
- `docs/decisions.md`
- `docs/specs/m001-review-micro-spec.md`
- `docs/specs/m001-courtside-run-flow.md`
- `docs/research/beach-training-resources.md`

