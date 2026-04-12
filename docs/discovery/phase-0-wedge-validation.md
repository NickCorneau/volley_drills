---
id: phase-0-wedge-validation
title: Phase 0 Wedge Validation
status: draft
stage: planning
type: discovery
authority: wedge scorecards, evidence capture template, M001 pre-build validation program and decision gate
summary: "Dual-wedge scorecards, evidence capture, and Phase 0 decision rules."
last_updated: 2026-04-12
depends_on:
  - docs/roadmap.md
  - docs/prd-foundation.md
  - docs/decisions.md
  - docs/research/beach-training-resources.md
---

# Phase 0 Wedge Validation

## Goal

Validate the self-coached primary path for the first build while learning which coach-facing workflow is worth layering onto the same shared backbone.

## Wedges under test

- `Self-coached solo-first`
  - Amateur beach player training alone first, with optional pair fallback
- `Coach clipboard`
  - Beach coach assigning a structured session, seeing whether it happened, getting a tiny outcome signal, and adjusting the next one — without roster admin, payments, or video

## Shared backbone

Both wedges must be evaluated against the same product backbone:

1. Set context
2. Assemble session
3. Run session courtside
4. Capture quick review
5. Improve the next session

What stays constant:

- Structured drills and session blocks
- Constraint-first deterministic planning
- Mobile run mode
- One-minute review
- Lightweight adaptation logic

What changes by wedge:

- Landing copy
- Onboarding prompts
- Example session inputs
- Interview script
- Scorecard

## Phase 0 rule

Phase 0 is discovery-first, not build-first.

Allowed:

- concierge planning
- paper or Figma-like prototypes
- lightweight interactive prototype
- manual scorecards and interview notes

Not required:

- full analytics pipeline
- production-grade onboarding
- separate end-to-end apps per wedge

## Evidence capture

Capture the following for every participant:

- wedge
- user type
- current training workflow
- current workaround
- actual solo setup available (wall/fence, net, balls, markers)
- top pain moment
- time-to-first-useful-session
- did skill level plus today's player-count choice feel like enough first-run context
- did the short starter session feel believable
- did any goal / profile / sign-up ask feel premature
- was the first metric simple enough to tolerate
- was the binary `Good` / `Not Good` pass standard clear enough to trust
- would delayed sRPE capture actually get completed
- did the "passing fundamentals for serve receive" framing feel honest
- was the user willing to answer today's hard-filter toggles
- did early-end reason codes (`time`, `fatigue`, `pain`) feel fair
- did purposeful drill repetition feel productive or stale
- did `progress / hold / deload` labels make intuitive sense
- trust level after first walkthrough
- repeat intent
- willingness to pay
- blockers

## Scorecards

Score each criterion from `1` to `5`.

### Self-coached solo-first scorecard

| Criterion | What good looks like |
|---|---|
| Problem frequency | User has this problem weekly, not occasionally |
| Activation speed | User can get to a believable solo session fast |
| First-session win | User feels they got real training value before the app asked for much back |
| Training trust | User believes the plan is safe and useful without a coach, and accepts the solo work as honest rather than fake "full" serve receive |
| Repetition trust | User accepts purposeful drill repetition when the next step is explained |
| Repeat intent | User wants to use it again next week |
| Metric and context tolerance | User is willing to log binary-first skill metrics, answer delayed sRPE when prompted, and tolerate a small number of hard-filter toggles consistently |
| Weekly receipt value | A simple planned-vs-completed summary plus one load and one skill proxy feels useful enough to prompt the next session, without needing a dashboard |
| Shallow planning tolerance | A one-week shape or next 2-6 sessions queue feels like enough structure without feeling like a chore |
| Willingness to pay | User would plausibly pay for continued improvement confidence |
| Build simplicity | Product can solve this without heavy partner or coach infrastructure |

### Coach clipboard scorecard

| Criterion | What good looks like |
|---|---|
| Problem frequency | Coach regularly assigns sessions, checks whether they happened, and adjusts plans — and feels real friction doing this via notes, spreadsheets, PDFs, or messaging |
| Assignment fit | Coach can assign a structured session from the same drill library and constraints used in M001 |
| Completion visibility | Coach can tell whether the athlete ran the session and see a tiny outcome signal (compliance, load, one skill proxy) |
| Adjust loop | Coach can approve or modify the next session's progress/hold/deload based on the outcome signal |
| Operational fit | Works without forcing full roster/admin/payments/video software |
| Repeat intent | Coach wants to use it for the next real athlete or session cycle |
| Willingness to pay | Coach sees a believable paid value proposition for just the clipboard loop |
| Build simplicity | Product can deliver this on the shared backbone without a marketplace or heavy operations suite |

## Decision rule

Use Phase 0 to answer:

1. Does the self-coached loop show strong repeat signal and trust as the primary path?
2. Is the coach clipboard (assign, see completion, tiny outcome signal, adjust next) compelling enough for coaches to adopt without the usual bundle of messaging, scheduling, payments, and video?
3. Does the clipboard reuse the shared backbone with minimal extra complexity?

Tie-breakers:

1. Founder pull: which wedge the founder will actually use weekly
2. Distribution access: which users are easier to recruit and learn from
3. Product clarity: which extension keeps the MVP story cleanest

## Anti-patterns

- Do not compare one concierge-heavy wedge against one product-heavy wedge.
- Do not use one blended onboarding flow and assume the results are meaningful.
- Do not force full goal or profile intake before the first-session prototype; it confounds activation signal.
- Do not let the coach wedge force admin, marketplace, or roster tooling into discovery.
- Do not let the self-coached wedge drift into generic fitness or motivational fluff.
- Do not claim solo wall or self-toss work is the same as live serve receive.

## Output of Phase 0

By the end of Phase 0, we should have:

- confirmed evidence for the self-coached primary path (repeat behavior, not just stated intent)
- a go/no-go on the coach clipboard as the first extension, based on whether coaches find the assign-complete-signal-adjust loop compelling without roster/admin/payments/video
- evidence on whether a weekly receipt and shallow next-N planning are enough to keep self-coached users coming back
- a decision on whether premium coaching should be direct coach-to-client, centralized expert access, or deferred
- a short memo explaining why
- updates reflected in `docs/decisions.md`, `docs/prd-foundation.md`, and `docs/roadmap.md`

## M001 pre-build validation program (2026-04-12)

Research evidence (see `research-output/m001-pre-build-validation-research.md` and `docs/research/beach-training-resources.md`) identifies four behavioral unknowns that desk research cannot resolve. These must be tested before committing to build M001.

### Riskiest assumptions to test

Score each by impact (if wrong, does M001 fail?) and uncertainty (can desk research resolve it?). The top assumptions for a compressed test:

| # | Assumption | Impact | Uncertainty |
|---|---|---|---|
| A1 | Users will use a phone courtside on sand during training | Fatal if wrong | High — some players go tech-free outdoors |
| A2 | Solo passing sessions are feasible within the environments users actually have | High — limits addressable user base | Medium — depends on wall/fence/net access and available space |
| A3 | Post-session review takes <60s and is completed when tired/sweaty | High — breaks adaptation loop if skipped | Medium — plausible but untested |
| A4 | Users return for a second session within the D91 14-day window | Fatal if wrong — no retention = no product | High — attrition is predictable |
| A5 | Offline use matters for target training locations | Medium — drives architecture cost | Medium — varies by location |
| A6 | Users accept "passing fundamentals for serve receive" as an honest promise for solo work | High — trust collapses if the skill promise feels fake | High — desk research cannot answer messaging trust |
| A7 | Purposeful drill repetition stays acceptable when progression is obvious | Medium — repetition is required, but staleness can erode repeat use | High — no clear desk threshold |

### Validation method: thin prototype + concierge loop

Use a Wizard-of-Oz / concierge approach: test a believable end-to-end session loop with minimal software, substituting manual effort for planning and adaptation. This avoids over-building "session generation" while directly testing "courtside execution" and "repeat behavior."

The prototype is less "an app" and more "a field-testable session runner":

- 2–3 prebuilt passing sessions (solo + partner variants) with explicit equipment/environment requirements
- A runner UI with gigantic touch targets and almost no typing (could be a simple mobile web flow saved to home screen)
- A <60s review capturing 1–2 actionable signals (session RPE + pass quality), sufficient to manually drive progress/hold/deload
- At least one wording variant that frames solo work as "passing fundamentals for serve receive" rather than full live serve receive

### Rollout default: founder first

Use a phased rollout instead of jumping straight to a broad cohort:

1. founder self-test on a real phone in real conditions
2. founder + friends small pilot
3. broader expansion only if the founder would personally keep using it and the first friend sessions feel promising

This founder/friend pilot is a **pre-gate filter**, not the full M001 evidence standard. It exists to avoid wasting recruiting effort on a prototype the founder would not use.

### Compressed 1–2 week schedule

**Days 1–2: risk framing + prototype skeleton + founder self-test**

- Run assumption surfacing + risk scoring; select top 5 assumptions from the table above
- Build bare runner prototype: giant buttons, "next drill," timer, pause, and a 3-question review. Enforce almost no typing (pickers/toggles only)
- Assemble 2–3 prebuilt passing sessions from known drills (FIVB drill book, community resources) with explicit solo and partner variants
- Have the founder run the prototype in a real environment before recruiting anyone else; capture where the runner feels annoying, unclear, or fake

**Days 3–5: founder + friends first field runs**

- Run the founder through repeated field sessions across the most relevant contexts (wall, open sand, pair if available)
- Invite a small friend cohort for the first external runs
- Observe where users refuse to touch the phone, mis-tap, or abandon the runner
- Iterate immediately between runs (multiple small tests > one big test)
- If the founder/friend signal is weak, pause broader recruiting and fix the runner first

**Days 6–10: expand only if early signal is positive**

- Expand toward the broader `6–12` participant target only if the founder and friend pilot feels strong enough to justify it

- For each concierge participant:
  - Minimal context capture (≤30 seconds): today's player count, equipment chips, and optional wind tap
  - Deliver a passing session that matches their constraints
  - Have them run it within 3 days
  - Collect <60s review immediately after
- Manually label adaptation outcome: progress / hold / deload using review signals

**Days 11–14: forced "week two" test (the retention gate)**

- Push an adapted next session to every participant and measure:
  - Who runs it unprompted?
  - Who runs it only with reminders?
  - Who drops? (Treat this as expected attrition; quantify it.)

### Decision gate

Official threshold:

- Founder would personally keep using the runner and wants the next session
- `D91`: `5+` testers each complete `2+` sessions within `14` days with `>50%` review completion
- Kill signal: fewer than `3` of `5` start a second session within `14` days
- At least 2 users explicitly asking for the next session or inviting a partner remains useful supporting evidence, not the canonical threshold

If session-2 retention is missed: do not "build harder." Revisit the wedge — skill focus, solo definition, runner design, or even whether phone courtside is viable.

### Expert safety review

Before scaling beyond the initial testers, get a single coach or sports physio review of:

- The initial passing sessions (volume, intensity, progression)
- The deload logic in `docs/specs/m001-adaptation-rules.md`
- Whether the safety disclaimers are adequate

### What this validation intentionally skips

- Multi-week planning, rich analytics, video analysis, social/community, coach workflows, backend sync
- AI generation beyond manually assembling sessions from known drills
- Production-grade onboarding or offline architecture

These can become retention multipliers later but are not needed to validate the core "plan → run → review → adapt → repeat" loop.

## Related docs

- `docs/roadmap.md`
- `docs/prd-foundation.md`
- `docs/decisions.md`
- `docs/research/beach-training-resources.md`
- `research-output/m001-pre-build-validation-research.md`

