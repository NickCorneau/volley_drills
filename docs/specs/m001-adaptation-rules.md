---
id: M001-adaptation
title: M001 Adaptation Rules
status: active
stage: validation
type: spec
authority: pass-first progress/hold/deload thresholds and rules
summary: "Rules-first progress/hold/deload thresholds for the pass-first loop."
last_updated: 2026-04-16
depends_on:
  - docs/milestones/m001-solo-session-loop.md
  - docs/specs/m001-review-micro-spec.md
  - docs/research/regulatory-boundary-pain-gated-training-apps.md
  - docs/research/srpe-load-adaptation-rules.md
decision_refs:
  - D11
  - D18
  - D21
  - D23
  - D63
  - D64
  - D65
  - D80
  - D84
  - D86
  - D104
  - D113
---

# M001 Adaptation Rules

## Governing decisions

D11 (rules-first adaptation), D63 (one dimension at a time), D64 (deload reduces serving/jumping), D65 (spacing rule), D84 (sRPE-load is the internal-load primitive), D113 (sharpened sRPE-load operating bands, `baseline3` + `peak30` + rolling-14d, minimum-history phases).

## Purpose

Define the first rules-first adaptation model for the passing-fundamentals / serve-receive loop, including the minimum safety contract that gates and shapes every session.

This is a planning default for M001, not a claim that the thresholds are perfect forever. The sRPE-load change caps are no longer placeholders: `D113` sharpens them against the post-ACWR literature (see `docs/research/srpe-load-adaptation-rules.md`), but the band widths and tester acceptance still need field validation per `D91`.

Favor trust and safety over sensitivity. A conservative system that explains itself is better than a "smart" system reacting to noisy self-report data.

## Safety contract

Safety in M001 is enforced by workflow structure — structured fast taps that gate the session and shape conservative defaults — not by copy-only disclaimers. See `docs/research/beach-training-resources.md` for the full evidence base.

### Regulatory positioning

The product is general training support, not medical advice. It does not diagnose injury, treat conditions, or claim to reduce injury risk through personalized risk scoring.

Cross-jurisdiction framing, feature-by-feature mapping, the avoid-phrase list, and copy banks live in `docs/research/regulatory-boundary-pain-gated-training-apps.md`. That note is authoritative for how `D86` is operationalized in surfaces and copy. Until target launch markets are chosen, the default posture is the **strictest credible interpretation** across US / EU / UK / Canada / Australia.

The product will **not**:

- diagnose or name specific injuries
- provide return-to-play guidance for specific conditions
- compute or display injury-risk scores (no ACWR "danger zone" messaging)
- claim to prevent injury through personalization
- present the pain-triggered session alternative as rehab, recovery from injury, or a pain-relief protocol
- generate interpreted alerts that infer a specific medical condition from user-specific data

Avoid-phrase list (applies to every user-visible surface, feature name, release note, marketing or app-store copy): `prescribe`, `dose`, `therapy`, `rehab / rehabilitation`, `treat pain`, `alleviate pain`, `pain relief`, `recover your injury`, `manage your injury`, `injury recovery plan`, `return-to-play / return-to-sport protocol`, `medically safe progression`, `clinical grade`, `clinically proven`, `detect / screen / red flag` (in the symptom-interpretation sense), `prevent injury`, `reduce injury risk`, `manage a condition`, `monitor your condition`, `our algorithm knows when you should seek care`. Preferred wellness vocabulary for pain-triggered alternatives: `lighter`, `lower-load`, `lower-impact`, `skip today`. The word `recovery` is only acceptable when it unambiguously refers to post-exercise physiological recovery (cool-down, rest day, sleep), not injury recovery.

Visible copy:

- "This is training guidance, not medical advice. You are responsible for your choices."
- Pain-gate body (re-routed session): "We've switched you to lower-load technique work today. You can also skip training if you prefer."
- Pain-gate override warning: "If pain is severe, new, worsening, or persistent, stop training and consult a qualified clinician."
- Stop/seek-help: fixed, generic symptom list as specified below; not interpreted per-user.

### Pre-session safety check

Before every session, the user answers 2-3 fast taps. These gate and shape the session before the warm-up block begins.

**Pain flag (mandatory):**

- Question (post-physio-review 2026-04-20, see `D129`): `Any pain that's sharp, localized, or makes you avoid a movement?`
- Secondary line under the question: `Regular muscle soreness is fine. We'll switch to a lighter session if yes.`
- Input: `yes / no`
- If yes: default to a recovery/technique-only session. User may override, but the default is conservative. Override-confirm copy names a concrete consequence ("can turn a minor issue into a long layoff") rather than generic legalese — friction via specificity, not a hard block.
- This is a binary safety gate, not a soreness questionnaire. Normal post-exercise soreness (DOMS) is expected; the rewording makes the DOMS-vs-guarding distinction explicit because the prior phrasing ("changes how you move") read to most users as "am I visibly limping," while the early warning sign is subtle avoidance.

**Training recency (mandatory):**

- Primary question: `When did you last train?`
- Primary input: `0 days / 1 day / 2+ / First time` (`First time` filtered out once any `ExecutionLog` exists on device). `0 days` is visually warning-tinted.
- Post-physio-review 2026-04-20 (see `D129`): `2+` is a progressive-disclosure trigger, not a submittable answer. Tapping `2+` reveals a layoff sub-row (`2–7 days / 1–4 wks / 1–3 mo / 3+ mo`), and the persisted `trainingRecency` is the sub-bucket string. Selecting `3+ months` shows a soft inline nudge about a clinician check-in — prompt, not gate.
- If `0 days` or `First time` (or sub-bucket `1–3 months`+): automatically scale down session volume and intensity. A "normal" session after a layoff violates the "too much too soon" consensus; granularity on longer layoffs exists so the D91 read-out can see whether long-gap returners behave differently.

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

- **Warm-up block** — cannot be removed; can be shortened to a minimum version. Content: ankle/landing preparation, shoulder activation, gradual intensity ramp, plus one short "read today's conditions" element (track a lofted ball in the wind, feel the sand, note the sun angle) so the session starts with environmental calibration rather than cold technique. The reading element reinforces the wind capture from `D93` with a practice behavior, not just a metadata tag.
- **Main work blocks**
- **Downshift block** (renamed from Cool-down per `D105`; see `docs/specs/m001-session-assembly.md`) — cannot be removed; can be shortened to a minimum version. Content: gentle movement and light stretching framed as transition and comfort, not as recovery or injury prevention.

Exact warm-up / Downshift content and minimum duration need volleyball coach review.

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
  - **v0b note (per C4 / v3 red-team fix plan):** `reviewTiming` is NOT persisted on `SessionReview`. Derive it at export/readout time from `submittedAt - ExecutionLog.completedAt`. The persisted timing field is `captureWindow` (V0B-30), which carries the bucketed RPE-capture semantics `immediate` / `same_session` / `same_day` / `next_day_plus` / `expired`. `reviewTiming` as a two-value `immediate` / `delayed` derivation is an engine-facing concept and is computed at consume-time, not stored.
- `sessionCompletion`
  - `completed` or `ended_early`
- `incompleteReason`
  - required when `sessionCompletion = ended_early`
  - options: `time`, `fatigue`, `pain`, `other`

Safety note:

- `painFlag` belongs in the pre-session safety check, not in the post-session adaptation score. It gates the session before work begins.
- `daysSinceLastSession` shapes the session's default volume/intensity, not the post-session adaptation outcome.

## sRPE-load as the internal load primitive

Compute: `sRPE-load = sessionRpe × sessionDurationMinutes` (abbreviated `session_load`, units **AU**).

This is the minimum viable internal load signal. It is well-validated across multiple sports, requires no wearables, and combines intensity and duration into a single number. It replaces raw RPE alone as the primary load signal for between-session adaptation.

Use sRPE-load for:

- Detecting back-to-back hard sessions
- Enforcing conservative change caps against the athlete's own recent baseline
- Triggering automatic deload after high-load or novelty-peak sessions
- Scaling down sessions when returning from a gap

### Derived variables (engine contract)

| Variable | Deterministic definition |
|---|---|
| `session_load` | `sessionRpe × sessionDurationMinutes` |
| `eligible_session` | non-missing sRPE and minutes, completed, no symptom-driven stop, no moderate/worsening pain flag, review present |
| `baseline3` | median of the last 3 **eligible** sessions within the prior 42 days |
| `peak30` | maximum of all completed `session_load` values in the prior 30 days |
| `curr14` | sum of completed `session_load` values in the rolling 14-day window including the current session |
| `prev14` | sum of completed `session_load` values in the immediately preceding 14-day window |
| `trusted_history` | at least 5 eligible sessions and at least 28 days of coverage |
| `emerging_history` | 3-4 eligible sessions over at least 14 days |

Rolling 14-day windows (not calendar weeks) are used because target users train 1-3 times per week, so ISO-week buckets are too sparse and jittery. See `docs/research/srpe-load-adaptation-rules.md` for the literature synthesis.

### Absolute session envelope (product guardrail)

The app's own 10-20 minute at RPE 3-8 design implies a **30-160 AU** envelope. Product-envelope bands, **not** universal sport-science injury thresholds:

- **30-45 AU** — very light
- **45-100 AU** — usual
- **100-130 AU** — high for this product
- **>130 AU** — atypically high; never auto-Progress from this band

These bands matter mainly when individual history is sparse and the engine does not yet have a trustworthy `baseline3`.

### Change-band defaults (sharpened)

For this 1-3 sessions/week amateur skill-dominant population:

- **0% to +10% above `baseline3`** — default Progress zone
- **+10% to +15%** — conditional Progress only (no prior Progress in the last 3 eligible sessions; `session_load ≤ 1.10 × peak30`)
- **+15% to +20%** — Hold (single-session overshoot; do not progress from it)
- **>+20% short-term increase** (via `curr14 / prev14`) — Deload
- **>+10% above `peak30`** (single-session novelty spike) — Deload

Rationale: the post-ACWR literature supports individualized baselines and novelty-spike avoidance better than any single ratio; a 2025 5,205-runner cohort found that single sessions above +10% of the prior 30-day peak increased injury rates while ACWR and naïve weekly ratios did not. See `docs/research/srpe-load-adaptation-rules.md` and `D113`.

### Back-to-back and top-quartile hints

- Do not stack two sessions both above `baseline3` on consecutive calendar days without an override.
- If two **Progress** verdicts occurred in the last 3 eligible sessions, force one **Hold** before another upward step (rule 13 in the precedence table below).

## Precedence-ordered rule table

When several rows match, the **highest row wins** (rule 1 beats rule 15). This table is the authoritative decision spec for the sRPE-load engine; the prose `Progress` / `Hold` / `Deload` sections below remain correct but must not contradict this table.

| Rank | Condition | Verdict |
|---|---|---|
| 1 | Session stopped early for pain, injury, dizziness, or illness | **Deload** |
| 2 | Pain flag is more than mild, worsening, or still present the next day | **Deload** |
| 3 | Mild/transient pain flag only, no symptom-driven stop | **Hold** (load counts in `curr14`; session is **not** `eligible`) |
| 4 | Missing sRPE **or** missing minutes | **Hold** (exclude from rolling load and baseline; do not impute) |
| 5 | Review missing but sRPE and minutes present | **Hold** (load counts in `curr14`; session is **not** `eligible`) |
| 6 | Fewer than 3 eligible sessions in the prior 42 days | **Hold** (conservative mode; never auto-Progress) |
| 7 | `session_load > 1.10 × peak30` | **Deload** (novel peak exposure) |
| 8 | `session_load > 1.15 × baseline3` | **Deload** (single-session overshoot) |
| 9 | `curr14 > 1.20 × prev14`, with ≥2 completed sessions in each window | **Deload** |
| 10 | `1.05 × baseline3 < session_load ≤ 1.10 × baseline3`, no flags, last 2 eligible sessions symptom-free | **Progress** (default progress band) |
| 11 | `1.10 × baseline3 < session_load ≤ 1.15 × baseline3`, no flags, `session_load ≤ 1.10 × peak30`, and the **prior eligible verdict was Hold** | **Progress** (conditional; step-up-then-repeat shape) |
| 12 | `0.90 × baseline3 ≤ session_load ≤ 1.05 × baseline3` | **Hold** (baseline consolidation) |
| 13 | Two **Progress** verdicts in the last 3 eligible sessions | **Hold** (force one consolidation session) |
| 14 | Three consecutive eligible sessions each `< 0.85 × baseline3`, **or** `curr14 < 0.80 × prev14` with no pain/gap flags | **Progress** (under-stimulation) |
| 15 | `session_load > 130 AU` (high absolute band) | **Hold** by default; **Deload** if any other red flag also matches |

Engineering notes:

- Sessions that fall in rules 1, 3, 4, 5 add to recent exposure (`curr14`) but are **excluded** from `eligible_session` and therefore from `baseline3`.
- Rule 14 is an "under-stim drift-up" rule; it protects against an engine that defaults to Hold forever after a light stretch. It never fires when any red flag or gap condition is active.
- The drill-level binary progression gate (`D104`) sits in front of rule 10 / 11: even if sRPE-load qualifies for **Progress**, the drill's scored-contact window must also meet the D104 minimum before a difficulty or volume step is applied.

## Minimum-history phases

| Phase | Criterion | Allowed verdicts |
|---|---|---|
| Conservative bootstrap | 0-2 eligible sessions, or less than 14 days of coverage | **Hold** or **Deload** only; never auto-Progress |
| Emerging baseline | 3-4 eligible sessions over ≥14 days | Progress only in the +5% to +10% band, only with 2 clean prior eligible sessions |
| Trusted baseline | ≥5 eligible sessions and ≥28 days of coverage | Full rule table active (rules 10, 11, 14 all available) |
| Re-entry after short gap | More than 14 but fewer than 28 days since last eligible session | Drop back one phase for the next 2 eligible sessions |
| Re-entry after long gap | ≥28 days since last eligible session | Treat as new user until 3 fresh eligible sessions are logged |

Engineering one-liner: **the engine should not trust its own progression signal until it has at least 3 eligible sessions spanning at least 14 days, and it should not fully trust it until 5 eligible sessions spanning at least 28 days.**

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

Authority note: the **Precedence-ordered rule table** above (with `baseline3`, `peak30`, and `curr14 / prev14`) is the authoritative decision surface for the sRPE-load gate. The prose `Progress` / `Hold` / `Deload` sections below describe the per-drill skill-metric gate (D80 / D104) and copy intent. When the two surfaces disagree numerically, the precedence table wins; the drill-level skill gate still sits in front of any `Progress` verdict that qualifies on sRPE-load grounds.

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
- the same result happens in `2` completed sessions on different calendar days (not two sessions on the same day)
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

When a drill uses a binary success metric (Good / Not Good), 70% success is the **latent** rate target for advancing to a harder variant (D80). The raw observed rate is **not** the gate: because a self-scored `goodPassRate` is a noisy, directionally-biased proxy, progression is gated by a minimum-attempt window plus a **Bayesian posterior rule** with explicit pre-calibration proxy numbers (D104). Full evidence base, math, and source citations live in `docs/research/binary-scoring-progression.md`.

Rules:

- **Minimum scored contacts**
  - fewer than `50` scored contacts in the window: **no progression signal**; default to `hold`
  - `50+` scored contacts in the same drill-variant + success-rule + stable-fatigue context is the minimum gate-eligible window; smaller blocks of `15`–`20` attempts remain legitimate for in-session coaching feedback but never open the gate
- **Bayesian posterior rule** (self-scored, with personal bias correction):
  - progress only when `P(p_true_corrected >= 0.70 | x_corrected, n) >= 0.80` under a Jeffreys beta-binomial prior
  - at `n = 50`, this means **`goodPassesCorrected >= 38`** (boundary ≈ `76%` corrected)
  - `x_corrected = round(goodPassRateRaw · attemptCount) - borderlineSubtraction - personalBiasSubtraction`, where `personalBiasSubtraction` comes from the periodic 20-attempt calibration anchor block (shrunk toward the `+5` pp generic / `+8` pp injury-sensitive prior and EWMA-updated across anchor blocks)
- **Pre-calibration raw proxy** (before personal bias calibration exists):
  - general drill families: **`>= 41` raw `Good` out of `50`** (≈ 82% raw)
  - injury-sensitive drill families (serving, jumping, high-load attacking): **`>= 42` raw `Good` out of `50`** (≈ 84% raw)
- **Coach-, app-, or video-scored progression** keeps the 70% latent target and the same 50-attempt posterior rule, without the self-score bias correction (no `personalBiasSubtraction`, no borderline-review step)
- **Hysteresis on the downside** (cost asymmetry):
  - a near-miss gate session (raw `36`–`42` / `50` or corrected below the 38 / 50 line) defaults to `hold`, not `deload`
  - deload requires stronger evidence — two consecutive corrected windows below `60%`, an independent readiness/pain signal, or ended-early for `fatigue` or `pain`
- Attempt counts aggregate across consecutive completed sessions for the same drill-variant context; sessions ended early for `fatigue` or `pain` do not contribute toward the minimum
- The session-level progression rules (moderate `sessionRpe`, review complete, two-day confirmation) still apply on top of the drill-level gate; meeting the drill gate is necessary but not sufficient

The framing is decision-theoretic: the question at the gate is not "did the athlete hit 70%?" (a raw observed 70% leaves `P(true p ≥ 0.70)` near `0.49` at any sample size), but "is `P(true rate ≥ 70%)` at least `0.80`?" That 0.80 threshold corresponds to false progression being ~4× more costly than false hold, which is defensible for a self-coached, load-aware beach app.

### Bias correction at score time

Three layers make the self-score worth gating on.

- **Every rep (forced-criterion prompt).** Do not ask "Was that good?" Ask the drill's observable success rule as one sentence, and instruct: **"If you are unsure, score Not Good."**
- **Periodic calibration anchor (every few weeks or every few gate-eligible windows).** A 20-attempt block in which the athlete self-scores and an expert / trusted video audit also scores the same attempts. Raw `b = selfRate - expertRate` is shrunk toward the `+5` pp / `+8` pp prior and EWMA-updated; the result is the user's current `personalBiasSubtraction`.
- **10-second borderline review (only near the boundary).** When the window's raw count lands in the `36`–`42 / 50` boundary zone, re-show the success rule and ask: **"How many of the reps you marked Good were borderline?"** (`0 / 1 / 2 / 3+`). Subtract that count before computing the posterior. When video is available, replace the question with two fast expert-scored anchor clips followed by the same tap.

## What still needs validation

- whether the D104 50-attempt posterior rule (`38 / 50` corrected, `41 / 50` raw pre-calibration proxy, `42 / 50` for injury-sensitive) agrees with tester behavior, and whether the `+5` pp generic / `+8` pp injury-sensitive bias priors actually bracket what self-scores do against partner or video review on beach passing; the reasoning and comparable-product analogues are in `docs/research/binary-scoring-progression.md`, but the field signal for beach amateurs is still outstanding (`O12`)
- exact pass-rate targets by drill family and level (70% is a working default from Volleyball Canada, not a proven threshold for this product)
- delayed `sessionRpe` compliance versus immediate capture
- whether two-session confirmation feels fair rather than slow
- whether self-scored `Good` / `Not Good` agrees closely enough with partner or video review
- field validation of the sharpened sRPE-load bands (`D113`): whether the +5% to +10% default progress band, the +10% to +15% conditional band, the `peak30 × 1.10` novelty spike, and the `curr14 / prev14 > 1.20` cap feel fair and safe for the 1-3 sessions/week beach amateur cohort; derivation and source synthesis in `docs/research/srpe-load-adaptation-rules.md`
- warm-up and Downshift content and minimum duration (volleyball coach review)
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

## Pair complexity ceiling (reserved)

The engine does not yet consume pair-level skill — v0b persists the onboarding Skill Level band (`D-C4`, `D121`) but no code path gates on it. This section reserves the rule so when M001-build wires assembly and progression against skill level, the shape is already agreed.

**Rule when activated:**

- When `SessionPlan.playerCount === 2`, the pair's viable drill-variant complexity ceiling is **`lower-of-two`** over the individual bands of the two players — not their average, not their max.
- When only one band is available (the device holder's), treat it as the pair band. v0b is in this state for the entire `D91` cohort.
- When the optional pair-differential follow-up eventually ships ("about even / one a step newer / one a step stronger", deferred to M001-build per `D121`), a declared differential of "one newer" biases **rep allocation** toward the newer player (more attempts of the same variant, not a harder variant for the stronger player); a differential of "one stronger" biases **role difficulty within the same drill** (harder toss, wider movement start, tougher serve pressure) while keeping the shared variant's complexity capped at `lower-of-two`.
- Onboarding "Not sure yet" (`unsure`) maps to `foundations` / `beginner` for assembly purposes per `skillLevelToDrillBand()` in `app/src/lib/skillLevel.ts`. **v0b does not call `skillLevelToDrillBand()`** (per D-C4 and H4): the onboarding enum is collected for D91 retention correlation, but no v0b assembly code gates on it. Consumption is deferred to M001-build.

**Why `lower-of-two`, not average:** beach volleyball's core chain is partnered. If one player cannot yet stabilize first or second contact at the required speed, the pair's viable drill complexity is capped there no matter how strong the other player is. Averaging is the right rule for forecasting match outcome (DUPR's team rating is a defensible example) and the wrong rule for protecting the continuity of reps in a coupled skill chain. The engine question here is not "who wins this match" but "does the three-contact chain survive the rep density" — and that question has an `AND` gate, not a `MEAN` gate.

**Explicitly not in v0b:** the pair-differential question itself, any rep-allocation bias, any role-difficulty split, any per-drill-variant pair-band lookup. v0b captures only the band; field evidence from the `D91` cohort should decide whether the differential question earns its screen time before M001-build commits to the UI.

See `docs/decisions.md` `D121` for the rationale and the comparator-set evidence behind the rule.

## Related docs

- `docs/prd-foundation.md`
- `docs/decisions.md`
- `docs/specs/m001-review-micro-spec.md`
- `docs/specs/m001-courtside-run-flow.md`
- `docs/specs/m001-session-assembly.md` (environment defaults and solo archetype priority per `D102`/`D103`)
- `docs/research/beach-training-resources.md`
- `docs/research/solo-training-environments.md` (why wall access is not a safe default; what "solo" operationally means)

