---
id: M001-review
title: M001 Review Micro-Spec
status: active
stage: validation
type: spec
date: 2026-04-11
authority: post-session review payload, UX rules, completion definition, deferred/skipped behavior
summary: "Post-session review payload, completion rules, and starter-metric defaults."
last_updated: 2026-04-16
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

- `sessionRpe`
- the required skill-metric payload for that session, or an explicit `notCaptured` choice

Optional:

- `shortNote`
- `quickTag`

## Review payload

### Required

- `sessionRpe`
  - question shown to user: `How hard/intense was your session?`
  - scale: `0-10` CR10 style
  - preferred timing: `10-30` minutes after session end
  - fallback: allow immediate capture, but persist that it was captured immediately rather than in the preferred delayed window

- `primarySkillMetric`
  - for the initial passing-fundamentals / serve-receive track, default metric is one of:
    - total successful reps if using a starter or solo control drill
    - target completed / not completed for a short starter challenge
    - `goodPassRate`, derived from `goodPasses / attemptCount`, for scored pass drills
  - the session template should define which one metric is shown for that session; the user should not choose from multiple metric systems in M001
  - when pass quality is scored, define `Good` as `ball reached the target zone or left the intended next contact playable`
  - the review surface must present this as a **forced-criterion prompt** with an explicit anti-generosity nudge: show the one-sentence success rule for that drill, and immediately follow with `If unsure, count it as Not Good.` Implements the first layer of the D104 three-layer self-scoring bias correction. Tracked as `V0B-20` in `docs/plans/2026-04-12-v0a-to-v0b-transition.md`.
  - avoid `setter options` wording in the first pass metric
  - do not use a full `0-3` pass-quality rubric as the default M001 metric
  - store `attemptCount` alongside the rate so adaptation can reject low-signal sessions
  - **persist `goodPasses` and `attemptCount` at drill-variant grain inside the review payload**, not only as a session-level aggregate. Required so `D104` can aggregate a progression window across sessions per drill-variant, and so post-hoc `O12` analysis can replay rolling `N = 20/50/80/100`. Tracked as `V0B-12` in `docs/plans/2026-04-12-v0a-to-v0b-transition.md`.
  - any UI that displays a percentage (review, session summary, future weekly receipt) must show `N` alongside it, e.g., `72% (18 passes)`. Low-N honesty rule per `D104` and `D89`; tracked as `V0B-13`.
  - if the user cannot reasonably capture it, they may choose `notCaptured` and still complete the review

### Optional (schema-reserved; UI wired in M001)

- `borderlineCount?: number`
  - count of `goodPasses` the athlete considers borderline. Implements the third layer of the D104 three-layer self-scoring bias correction (10-second borderline review, triggered only when a drill-variant window lands in the raw `36`–`42 / 50` boundary zone).
  - v0b reserves the field on the `SessionReview` Dexie record but **does not compute the near-boundary zone and does not prompt for this value**. v0b reviews leave it `undefined`. v0b JSON export (`V0B-15`) picks it up automatically once written.
  - M001-build adds the boundary-trigger logic and the one-tap `0 / 1 / 2 / 3+` review step on top of the reserved field without a Dexie migration. Tracked as `V0B-21` in `docs/plans/2026-04-12-v0a-to-v0b-transition.md`.
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
  - optional preset tag such as:
    - `too easy`
    - `about right`
    - `too hard`
    - `need partner next time`
    - `weather issue`

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
2. `primarySkillMetric`
3. `incompleteReason` when relevant
4. `quickTag`
5. `shortNote`
6. `Submit review`

## Partial-session behavior

If the user ends early:

- still show review
- label it as a partial session
- keep the same required fields
- require `incompleteReason`
- treat `time` as neutral by default
- treat `fatigue` and `pain` as overload signals that bias the next session toward `deload`

## Deferred-review behavior

User may choose `Finish later`.

If they do:

- preserve session state
- show a reminder badge on home
- treat analytics state as `review_pending`, not `review_skipped`
- prefer one later nudge on home over repeated interruption prompts
- do not advance adaptation state until the review is submitted
- prefer delayed `sessionRpe` capture in this state when the user is still inside the `10-30` minute window

## Skipped-review behavior

If the user dismisses and never returns:

- mark analytics state as `review_skipped`
- do not block future session starts
- do not guess a progression outcome from missing review data; default the next session to `hold` or duplicate-last behavior until new review data exists

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

The adaptation logic should only depend on fields this review can reliably collect.

If review is still pending or was skipped entirely, preserve the current adaptation level rather than inventing a harder or easier next session.

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

