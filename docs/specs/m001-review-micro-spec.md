---
id: M001-review
title: M001 Review Micro-Spec
status: active
stage: validation
type: spec
date: 2026-04-11
authority: post-session review payload, UX rules, completion definition, deferred/skipped behavior
summary: "Post-session review payload, completion rules, and starter-metric defaults."
last_updated: 2026-04-27
depends_on:
  - docs/milestones/m001-solo-session-loop.md
  - docs/specs/m001-adaptation-rules.md
decision_refs:
  - D9
  - D23
  - D47
  - D70
  - D80
  - D104
  - D120
  - D133
related:
  - docs/research/2026-04-27-cca2-dogfeed-findings.md
  - docs/plans/2026-04-27-per-drill-capture-coverage.md
---

# M001 Review Micro-Spec

## Purpose

Define the smallest post-session review that still creates real learning for the next session.

The v0a validation prototype in `app/` currently implements a partial version of this spec. M001 full build remains gated by field testing. See `docs/research/2026-04-12-v0a-runner-probe-feedback.md` for as-built deviations.

## Time budget

Target completion time:

- under 60 seconds

## Completion definition

For M001, a review counts as complete when the user saves:

- `sessionRpe` (a non-null value in `[0, 10]`), **or** the review was auto-finalized via the expired path (`captureWindow = 'expired'`, `sessionRpe = null`, `eligibleForAdaptation = false`)
- the required skill-metric payload for that session, or an explicit `notCaptured` choice

Optional:

- `shortNote`
- `quickTag`

## Review payload

### Required

- `sessionRpe`
  - question shown to user (solo mode): `How hard was your session?`
  - question shown to user (pair mode, `playerCount === 2`): `How hard was this session for you?` with helper `One rating per device. Partner's score isn't required.` See `D120` for why v0b captures one device-holder rating only (no partner handoff, no per-player entries, no fabricated pair average).
  - scale: `0-10` CR10 style
  - UI control: a discrete **0–10 tappable chip grid** with sparse Borg anchors (`0 rest / 3 easy / 5 moderate / 7 hard / 10 max`). Single-tap selection; chips sized to the courtside 54–60 px touch-target baseline. Not a slider and not a 4-band collapse (tracked as `V0B-01`).
  - preferred timing: `10-30` minutes after session end
  - fallback: allow immediate capture, but persist that it was captured immediately rather than in the preferred delayed window
  - **capture-window model** (persisted on `SessionReview` as `captureWindow` + `captureDelaySeconds` + `eligibleForAdaptation`, tracked as `V0B-30`):
    - `0–30 min` → `captureWindow = 'immediate'`, `eligibleForAdaptation = true`. Best match to Foster's original method; terminal-segment inflation on hard sessions is noted but does not override the eligibility.
    - `30 min–2 h` → `captureWindow = 'same_session'`, `eligibleForAdaptation = true`. Same-day delay remains defensible in the literature.
    - `2 h–24 h` → `captureWindow = 'same_day'`, `eligibleForAdaptation = true` with a lower-confidence flag; history and export keep the record, but the M001-build adaptation engine treats it as secondary to fresher values.
    - `>24 h` → `captureWindow = 'next_day_plus'`, `eligibleForAdaptation = false`. Kept in history and export; never drives adaptation.
    - `> Finish-later cap (2 h)` while still unreviewed → `captureWindow = 'expired'`, `eligibleForAdaptation = false`. See *Deferred-review behavior* below.
  - `captureDelaySeconds` is derived from `ExecutionLog.completedAt` (or the recorded end timestamp for `ended_early`) to the moment the review is submitted. Recorded on every review, including partial and deferred paths.
  - v0b persists the fields but does **not** wire the confidence-bucket logic into any engine. M001-build consumes them alongside `D104` / `D113`.

- `primarySkillMetric`
  - for the initial passing-fundamentals / serve-receive track, default metric is one of:
    - total successful reps if using a starter or solo control drill
    - target completed / not completed for a short starter challenge
    - `goodPassRate`, derived from `goodPasses / attemptCount`, for scored pass drills
  - the session template should define which one metric is shown for that session; the user should not choose from multiple metric systems in M001
  - when pass quality is scored, define `Good` as `ball reached the target zone or left the intended next contact playable`
  - the **drill check surface (post-`D133`)** must present this as a **forced-criterion prompt** with an explicit anti-generosity nudge: show the one-sentence success rule for that drill **sourced from `variant.successMetric.description` (not hard-coded passing copy)**, and immediately follow with `If unsure, don't count it as Good.` (reformulated 2026-04-19 from the original `If unsure, count it as Not Good.` phrasing after a non-player field look read the "Not Good" vocabulary as a phantom button; the `BinaryPassScore = 'good' | 'not-good'` type still uses the internal vocabulary, but the user-facing anti-generosity clause now matches the actual Good / Total counter affordance without weakening the D104 layer-1 correction. See `docs/research/2026-04-19-v0b-starter-loop-feedback.md`.) Implements the first layer of the D104 three-layer self-scoring bias correction. Tracked as `V0B-28` in `docs/plans/2026-04-12-v0a-to-v0b-transition.md`. **Surface-move history (2026-04-27)**: this rule originally specified the Review surface; under `D133` capture moved to `DrillCheckScreen` (`/run/check`), and the prompt was re-homed to render inside the optional `Add counts` body inside `PerDrillCapture`, sourcing the rule from the drill record so it generalizes across pass / serve / set drills. The legacy `ReviewScreen` fallback path keeps its hard-coded passing copy unchanged because that branch is reached only by non-`D133` legacy sessions. See `docs/plans/2026-04-27-per-drill-success-criterion.md`.
  - avoid `setter options` wording in the first pass metric
  - do not use a full `0-3` pass-quality rubric as the default M001 metric
  - store `attemptCount` alongside the rate so adaptation can reject low-signal sessions
  - **persist `goodPasses` and `attemptCount` at drill-variant grain inside the review payload**, not only as a session-level aggregate. Required so `D104` can aggregate a progression window across sessions per drill-variant, and so post-hoc `O12` analysis can replay rolling `N = 20/50/80/100`. Tracked as `V0B-12` in `docs/plans/2026-04-12-v0a-to-v0b-transition.md`.
  - **Capture surface, per `D133` (2026-04-26)**: drill-grain `goodPasses` / `attemptCount` are captured **on the Drill Check screen after completed blocks**, not on the Review screen at session end. The Review screen no longer renders the session-level `Good passes / Total attempts` card for count-style drills (`successMetric.type` ∈ `pass-rate-good` / `reps-successful`); the per-drill values aggregate into the session-level totals on the Complete screen. Drill-grain capture is **optional**, gated behind a collapsed `Add counts` affordance below the always-required per-drill Difficulty tag. When the user fills it, `V0B-12` is satisfied for that drill-variant; when they don't, the field is `null` and the `D104` fallback (next bullet) applies.
  - **`D104` graceful-degradation rule, per `D133`**: a drill-variant for which the optional Good/Total counts were not captured does not advance progression on that drill-variant — `D104` aggregates only filled rolling windows. The session-level RPE remains the engine's signal of overall load. Progression is held, not regressed, when count data is absent — consistent with the existing "If review is still pending… preserve the current adaptation level rather than inventing a harder or easier next session" rule below in *Output to next session*.
  - any UI that displays a percentage (review, session summary, future weekly receipt) must show `N` alongside it, e.g., `72% (18 passes)`. Low-N honesty rule per `D104` and `D89`; tracked as `V0B-13`.
  - if the user cannot reasonably capture a drill, they may leave the per-drill capture untouched (Difficulty tag still required, counts skipped); the Review screen also retains the existing session-level `notCaptured` choice for drill types where counts make no semantic sense (`successMetric.type` ∈ `streak` / `points-to-target` / `pass-grade-avg` / `composite` / `completion`).

### Optional (schema-reserved; UI wired in M001)

- `borderlineCount?: number`
  - count of `goodPasses` the athlete considers borderline. Implements the third layer of the D104 three-layer self-scoring bias correction (10-second borderline review, triggered only when a drill-variant window lands in the raw `36`–`42 / 50` boundary zone).
  - v0b reserves the field on the `SessionReview` Dexie record but **does not compute the near-boundary zone and does not prompt for this value**. v0b reviews leave it `undefined`. v0b JSON export (`V0B-15`) picks it up automatically once written.
  - M001-build adds the boundary-trigger logic and the one-tap `0 / 1 / 2 / 3+` review step on top of the reserved field without a Dexie migration. Tracked as `V0B-29` in `docs/plans/2026-04-12-v0a-to-v0b-transition.md`.
  - full three-layer correction rationale and the posterior rule that consumes this field live in `docs/research/binary-scoring-progression.md`.

- `incompleteReason`
  - required when the session ended early
  - one tap options:
    - `time`
    - `fatigue`
    - `pain`
    - `other`

### Optional

- `shortNote`
  - free text, one sentence max

- `quickTag`
  - **session-level**, optional preset tag. **Note (2026-04-23):** the `QuickTagChips` UI component was deleted from the Review screen in `docs/plans/2026-04-23-walkthrough-closeout-polish.md` item 3 because it duplicated the new 3-anchor RPE chips at session grain. The schema field stays reserved for non-UI uses (notably `quickTags: ['expired']` in *Deferred-review behavior* below) and for future revival if a session-level tag with non-RPE-duplicate semantics is needed. Do **not** confuse `quickTag` with the per-drill `perDrillDifficulty` enum captured on Drill Check under `D133` — the grain (session vs drill), the surface (Review vs Drill Check), and the meaning (load-rightness vs acquisition-stage) all differ.
  - historical preset values (no longer rendered):
    - `too easy`
    - `about right`
    - `too hard`
    - `need partner next time`
    - `weather issue`

## Per-drill capture at Drill Check (D133)

Per `D133` (2026-04-26), the post-session payload includes a **per drill-variant** capture step that lives on the Drill Check screen after completed blocks, not on the Review screen at session end. This realizes `V0B-12`'s drill-variant-grain requirement for the first time in M001 — Tier 1a UI was session-level only — and is the trigger-evidence response to the 2026-04-26 founder pair pass session (P2-3 Tier 1b unlock).

### Per-drill required field

- `perDrillDifficulty: 'too_hard' | 'still_learning' | 'too_easy'`
  - **Required** on the Drill Check screen for every completed count-eligible drill block (`successMetric.type` ∈ `pass-rate-good` / `reps-successful`) **regardless of slot type** (technique / movement_proxy / main_skill / pressure), and for every completed main_skill / pressure block regardless of metric type. Warmup and wrap blocks never capture. The block cannot advance past Drill Check until the user taps one of the three chips. **Surface coverage history (2026-04-27)**: pre-2026-04-27 the gate read "main_skill / pressure block-types only," which silently dropped Difficulty capture on count-eligible technique and movement_proxy drills (e.g., `d10-pair` at the technique slot, `d03-pair` at the movement_proxy slot in a pair pass session — both `pass-rate-good`). The 2026-04-27 cca2 dogfeed (`docs/research/2026-04-27-cca2-dogfeed-findings.md` F1 + F2 gap 2b) made the gap concrete: a 25-min pair pass session with three count-eligible passing drills produced one capture. The widened gate above lets *drill metric type* (not slot label) drive capture eligibility for the count-eligible class. See `docs/plans/2026-04-27-per-drill-capture-coverage.md` for implementation routing.
  - Three values, one tap. Labels are 3-anchor (matches the `Easy / Right / Hard` shape of the post-session RPE chips at session grain) but **labels and meaning differ deliberately** from the deleted session-level `QuickTagChips`:
    - `too_hard` reads as "the drill outpaced me on this block."
    - `still_learning` reads as "I am acquiring this — stage, not load." Distinct from the deleted `about right` because it carries an *acquisition-stage* meaning, not a *load-rightness* meaning.
    - `too_easy` reads as "I was past this drill at this band." Triggers the standard Swap path inside the existing Tier 1a Swap UI on next session, not a within-session swap.
  - Final user-facing copy is decided in the implementation plan's spec-patch step under `.cursor/rules/courtside-copy.mdc` invariants 2 (one-season rec player) and 5 (cool-down equal review weight).
  - Persisted on `SessionReview` as `perDrillCaptures: PerDrillCapture[]`, keyed by `drillVariantId` + `blockIndex`.

### Per-drill optional fields (collapsed by default)

Below the required Difficulty tag, a single `Add counts` affordance expands to render the same `PassMetricInput` UI used historically on the Review screen. This is the Framing-B sub-component of `D133`'s Framing D, kept as the founder's opt-in lane for drills where capturing counts makes the data more honest.

- `goodPasses?: number`
  - Per drill-variant, optional. Same semantics as the existing session-level `goodPasses` (`Good = ball reached the target zone or left the intended next contact playable`), now scoped to a single block.
- `attemptCount?: number`
  - Per drill-variant, optional. Same semantics as the existing session-level `attemptCount`, scoped to a single block.
- `notCaptured?: true`
  - Per drill-variant, optional. Mirrors the existing session-level `notCaptured` toggle. Defaults to `true` for non-count drills (`successMetric.type` ∈ `points-to-target` / `pass-grade-avg` / `composite` / `completion`) so the user is never asked to invent counts on drills where counts are semantically wrong, consistent with the 2026-04-22 `notCaptured`-default landing. **D134 (2026-04-28):** `streak` drills no longer fall into this fallback at `main_skill` / `pressure` — they render their own optional `Add longest streak (optional)` drawer instead, which writes a `metricCapture: { kind: 'streak'; longest: number }` field rather than a count. `notCaptured` is still implied at the row-shape level for streak rows that submit no `longest` value.
- `metricCapture?: { kind: 'streak'; longest: number }`
  - Per drill-variant, optional. **Added in `D134` (2026-04-28).** Discriminated-union container for non-count optional capture shapes; the `streak` arm carries the longest unbroken-chain integer the user entered on `/run/check`. Mutually exclusive with `goodPasses` / `attemptCount` (a single per-drill-capture row never carries both shapes at once, enforced by the `domain/capture/buildPerDrillCapture.ts` pure builder). Empty / blank streak input collapses to a difficulty-only row with `metricCapture` absent. Future shapes (e.g., `points-to-target`, `pass-grade-avg`) extend this discriminator under a Phase 2B follow-up.

When the optional counts are filled, the values aggregate into the session-level `goodPasses` / `attemptCount` displayed on `CompleteScreen.tsx` and into `D104`'s rolling-window math at drill-variant grain. When they are skipped, `D104` does not advance progression on that drill-variant for that session (per the *graceful-degradation rule* under `primarySkillMetric` above). The session-level RPE chip on Review still drives load adaptation independently.

### Non-count drills at main_skill / pressure (gap 2a)

For drills whose `successMetric.type` is **not** in `COUNT_BASED_METRIC_TYPES` (`pass-rate-good` / `reps-successful`), the Drill Check screen previously rendered the **Difficulty chips only**; the `Add counts` affordance did not render at all. This is the correct posture (`docs/research/2026-04-26-pair-rep-capture-options.md` honesty test: never ask the user to invent count-shaped data on a drill where counts are semantically wrong), but it left a coverage gap on `streak` drills (e.g., `d38-pair` Bump Set Fundamentals at chain-7) that produced no rep-grain data at all — only a difficulty tag. **2026-04-27 cca2 dogfeed F2 gap 2a (`docs/research/2026-04-27-cca2-dogfeed-findings.md`)** named this concretely.

**Phase 2A landed (D134, 2026-04-28):** `streak` drills at the `main_skill` and `pressure` slots now offer an **optional** `Add longest streak (optional)` drawer below the Difficulty chips on `/run/check`. The drawer renders the V0B-28 forced success-rule prompt above it (sourced from `variant.successMetric.description`, with the anti-generosity nudge **suppressed** for streak — the rule itself is the unbroken-chain definition; restating "be honest" on a streak count is redundant and not the failure mode `D131` was hardening against). The input accepts integers `0-99`, snaps invalid values back to `null`, and persists as `metricCapture: { kind: 'streak'; longest: number }` on the per-drill capture row. Difficulty stays the only required field; leaving the streak blank is fully supported and produces a difficulty-only row identical to the pre-D134 Phase 1 behavior. See `docs/plans/2026-04-28-per-drill-capture-coverage-phase-2a-streak.md` and `D134` in `docs/decisions.md`.

`points-to-target` / `pass-grade-avg` / `composite` / `completion` drills remain Difficulty-only at Drill Check (Phase 2B and beyond, gated on the same trigger conditions or a future founder-use exception). Streak does **not** roll up into the session-level Good/Total sum; the Complete-screen recap renders a quiet `Longest streak: N` row alongside the existing rate row.

### Why Drill Check, not Review

Per the 2026-04-26 founder report ("the 'passes and good passes' bit at the end is too hard to track and fill out post workout"), and per the `D133` rationale row in `docs/decisions.md`, the literal complaint is post-session typing on a count that has gone stale. Drill Check captures the same data while it is still fresh and replaces a hard ask (typing) with an easy one (1-tap tag) for the required field. The optional counts inherit the freshness improvement without making counts mandatory.

### Why not session-level only

The Tier 1a session-level Good/Total card on Review deviates from `V0B-12`'s drill-variant-grain requirement and cannot feed `D104`'s same-drill-variant rolling-window math. `D133` realizes the drill-grain capture the spec already required, and uses the post-block Drill Check surface to do it without raising the per-block authoring-attention cost.

## UX rules

- Default to one screen.
- Prefer tap choices over typing.
- Prefer large buttons or segmented choices over precision-heavy controls when possible.
- Keep primary actions and review inputs within the same `54-60px` touch-target baseline used in run mode.
- Pre-fill what can be inferred from the session.
- If the metric uses counts, precompute the derived rate for the user instead of asking them to do math.
- Do not require a note to submit.

Recommended field order:

1. `sessionRpe`
2. `primarySkillMetric` — for count drills (`successMetric.type` ∈ `pass-rate-good` / `reps-successful`), the per-drill capture under `D133` happens on Drill Check and the Review screen does **not** render this card; the session-level `goodPasses` / `attemptCount` aggregate displays on the Complete screen instead. For non-count drills, the existing `notCaptured`-default card stays on Review.
3. `incompleteReason` when relevant
4. `shortNote`
5. `Submit review`

## Partial-session behavior

If the user ends early:

- still show review
- label it as a partial session
- keep the same required fields
- require `incompleteReason`
- treat `time` as neutral by default
- treat `fatigue` and `pain` as overload signals that bias the next session toward `deload`

## Deferred-review behavior

User may choose `Finish later`. This is an **escape hatch**, not a peer option:

- the `Finish later` affordance is a text link, not a primary button
- the primary action stays `Submit review`
- deferral is **hard-capped at 2 hours** from `ExecutionLog.completedAt`

While inside the 2-hour cap (`review_pending`):

- preserve session state
- show a reminder on home (home-state priority `ReviewPending` per `docs/specs/m001-home-and-sync-notes.md`)
- treat analytics state as `review_pending`, not `review_skipped`
- prefer one later nudge on home over repeated interruption prompts
- do not advance adaptation state until the review is submitted
- on re-entry, prefer delayed `sessionRpe` capture when the user is still inside the `10-30` minute window

After the 2-hour cap (`review_expired`, tracked as `V0B-31`):

- lock the review form; the user sees a read-only summary labeled `Saved too late for planning`, not the editable review screen
- write a terminal `SessionReview` stub with `status = 'skipped'` (per D-C7), `sessionRpe = null`, `captureWindow = 'expired'`, `eligibleForAdaptation = false`, and `quickTags: ['expired']` (not `shortNote`; `quickTags` is the canonical channel per landed code in `services/review.ts`) so the session is considered reviewed and the home-state priority falls through to `LastComplete`
- keep the session in history and in the `V0B-15` JSON export
- never let an expired record drive adaptation

Why a hard cap rather than an open-ended deferral: public EMA / diary completion rates (≈60% field, ≈74% recent review, ≈80% across 2025 meta) are best-case estimates for *primary* reporting tasks; a post-workout follow-up is a secondary task and will eventually complete at materially lower rates. The v0b posture is that an open-ended deferral mostly launders dropout into "pending" without giving the engine usable data. 2 hours captures same-session and reasonable same-day recall while staying inside the literature-supported window (`D120`).

## Skipped-review behavior

If the user dismisses and never returns:

- mark analytics state as `review_skipped`
- do not block future session starts
- do not guess a progression outcome from missing review data; default the next session to `hold` or duplicate-last behavior until new review data exists

## Review payoff contract

Review is not only data capture. It must feel worth doing.

- On successful submit, the user should get one verdict, one bounded reason, and one clear next-step cue.
- The user should understand whether the next session is `progress`, `hold`, or `deload`, and the smallest believable why.
- The output should leave the athlete clearer about what to do next, not just confirm that the review was saved.

**v0b D91 artifact note:** v0b intentionally keeps this payoff narrow — the 3-case summary matrix and minimal next-step language — to keep the field-test loop low-load. The broader M001 product contract still includes richer visible reasoning and a more motivating carry-forward once the field-test gate clears.

## First-slice metric defaults

For M001, favor only one visible pass-focused metric per session:

- First-run starter sessions should prefer:
  - `successfulReps`
  - `targetCompleted`
- Pass-scored sessions should prefer:
  - `goodPasses`
  - `attemptCount`
  - derived `goodPassRate`

`Good` should mean a pass hit the target zone or made the intended next touch playable. M001 should not require users to learn a multi-bucket pass-quality rubric.

Derived values can exist later, but should not increase review effort in M001.

## Pair-session scope

v0b captures **one `sessionRpe` per session** regardless of `playerCount`. The only pair-mode change is copy (prompt pronoun `for you` + helper line), tracked as `V0B-32`. Explicitly **not** in v0b:

- no `sessionRpeEntries[]` array
- no partner-handoff secondary action ("Add partner's score")
- no derived or displayed pair-averaged RPE
- no partner name, profile, or participant row

When subjective load eventually becomes per-participant, it MUST ride on the `SessionParticipant[]` shape required by `D115`, and any pair-level scalar stays derived-only (`max_of_available_entries` with a `source_confidence` provenance tag). See `D120` for the full policy and `D114`–`D117` for the persistent-identity posture this preserves.

## Not in M001

- soreness questionnaire
- wellness or readiness survey
- multiple visible metrics on one review
- coach-authored feedback as a blocking part of review completion
- the `0-3` pass-quality scale as a primary review metric

## Output to next session

The review should produce one simple adaptation outcome:

- `progress`
- `hold`
- `deload`

This outcome should be explainable in plain language:

- `You handled this well; next time gets slightly harder.`
- `Stay at this level once more.`
- `Back off a bit next session and rebuild quality.`

This outcome should be surfaced immediately after review, not buried only in storage.

The adaptation logic should only depend on fields this review can reliably collect.

If review is still pending, was skipped entirely, or finalized with `eligibleForAdaptation = false` (expired deferral or `>24 h` late capture), preserve the current adaptation level rather than inventing a harder or easier next session.

## Success bar

This review spec is working if:

- users do not feel punished for reviewing
- the data is enough to support one believable next-session adjustment
- completion stays plausible under courtside conditions
- delayed `sessionRpe` capture is possible without collapsing compliance

## Related docs

- `docs/specs/m001-courtside-run-flow.md`
- `docs/specs/m001-adaptation-rules.md`
- `docs/prd-foundation.md`
- `docs/decisions.md`

