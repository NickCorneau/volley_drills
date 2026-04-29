---
id: per-move-pacing-indicator-2026-04-28
title: "Ideation: per-move pacing indicator (warmup/cooldown visible channel)"
type: ideation
status: active
stage: validation
authority: "Sub-ideation under S1 of docs/ideation/2026-04-28-what-to-add-next-ideation.md. Explores variant shapes for a per-move visible pacing indicator on RunScreen for warmup (d28) and cooldown (d25, d26) blocks. Does not author requirements; ce-brainstorm picks one survivor and defines it."
summary: "11 candidate shapes generated across 5 axes (visual treatment, data source, reconciliation when sum-of-moves != block duration, scope/where it renders, audio coupling). 4 survive the evidence-and-cap-discipline critique. The recommended starter is V1 (structured pacingSegments + highlighted current row + per-move boundary beep) because it makes the existing prose-only numbered list machine-readable, gives the visible channel S1 named, and keeps the schema additive and forward-only."
last_updated: 2026-04-28
related:
  - docs/ideation/2026-04-28-what-to-add-next-ideation.md
  - docs/research/2026-04-28-build17-pair-dogfeed-feedback.md
  - docs/research/2026-04-28-audio-pacing-reliability-investigation.md
  - docs/research/founder-use-ledger.md
  - docs/research/partner-walkthrough-results/2026-04-22-all-passes-reconciled.md
  - app/src/data/drills.ts
  - app/src/hooks/useBlockPacingTicks.ts
  - app/src/screens/RunScreen.tsx
  - app/src/types/drill.ts
decision_refs:
  - D42
  - D105
  - D130
---

# Ideation: per-move pacing indicator

## Purpose

Pick a shape for the visible-channel half of `S1` (the audio-pacing-infrastructure cluster from `docs/ideation/2026-04-28-what-to-add-next-ideation.md`). Specifically: the user's idea of a **spinner / current-step indicator beside each move** in the warmup / cooldown copy on RunScreen, with the time-per-move driving both the indicator and a beep when it's time to move on.

This is the artifact that hands off to `ce-brainstorm` for the chosen variant.

## Use This File When

- choosing the shape of the visible per-move pacing indicator before writing requirements
- assessing whether a variant is evidence-fired vs over-engineered
- triaging future visible-pacing ideas after this one ships

## Not For

- authoring requirements (that's `ce-brainstorm` on the chosen survivor)
- authoring an implementation plan (that's `ce-plan`)
- changing audio-pacing infra scope — that lives in the parent S1 ideation
- replacing the parent ideation's ranking — this is a sub-ideation, not a new top-level pass

## Method

- **Mode**: repo-grounded
- **Volume**: focused (≈11 candidates → 4 survivors)
- **Frames covered**: visual treatment · data source · reconciliation under variable block length · scope/where it renders · audio coupling
- **Phase 1 dispatch skipped**: grounding already loaded (catalog, RunScreen, useBlockPacingTicks, drill type, build-17 F3, audio investigation note, S1 cluster). External research not needed: this is a UI-pacing pattern with strong local context.

## Source materials referenced

- `docs/ideation/2026-04-28-what-to-add-next-ideation.md` §S1 (parent cluster: audio reliability + visible chip)
- `docs/research/2026-04-28-build17-pair-dogfeed-feedback.md` §F3 ("had to watch the timer himself")
- `docs/research/2026-04-28-audio-pacing-reliability-investigation.md` (no separate cooldown cue; pacing pulse, not per-segment schedule)
- `docs/research/partner-walkthrough-results/2026-04-22-all-passes-reconciled.md` §"Genuinely-open Tier 1b bundle" (timer-end / audio-suspend anxiety)
- `app/src/data/drills.ts` — `d25-solo` (Downshift, 30 s tick, 6 prose moves), `d26-solo` (Stretch, 30 s tick, 3 prose moves), `d28-solo` (Beach Prep Three, 45 s tick, 4 prose moves)
- `app/src/hooks/useBlockPacingTicks.ts` (current pacing logic — uniform interval ticks)
- `app/src/screens/RunScreen.tsx` (current courtside rendering — `whitespace-pre-line` prose)
- `app/src/types/drill.ts` (`DrillVariant.subBlockIntervalSeconds?: number`)

## Anchor problem (one paragraph)

Three M001-active timed drills (`d25`, `d26`, `d28`) ship a numbered move list inside `courtsideInstructions` — pure prose with `\n` separators rendered with `whitespace-pre-line`. A separate uniform `subBlockIntervalSeconds` fires a generic audible tick every N seconds during run. The two channels are not coordinated: the audio tick has no concept of which move you're on, and the prose list has no concept of timing. On the build-17 pair session, the audio dropped (silent switch / lock state platform residual) and Seb fell back to *watching the timer himself* — there is no visible per-move position cue to fall back to. The cooldown surface is the worst hit because cooldown audio shares the same cue stack with no separate "started cooldown" indication. The user's ask is the missing visible channel.

## Frame 1 — Visual treatment

Variants for what the per-move indicator actually looks like.

- **V-A. Highlighted current row.** Numbered list as today, but the *current* line gets a left rule + bolder weight + small inline pill ("Now") and previous lines get a muted check; future lines stay neutral. Lowest-vis change; readable at arm's length.
- **V-B. Per-move spinner / progress ring.** Each line carries a small ring on its left edge that fills proportionally to elapsed time inside that move; previous lines show a complete check, future lines show a hollow ring. Closest match to the user's ask. More pixels, more motion, more risk of looking busy.
- **V-C. Per-move horizontal bar.** Each line carries a thin underline or background-fill bar that animates left-to-right as the move's time elapses. Compact, calm, scannable. Can read like a download progress bar at a glance.
- **V-D. Single global progress bar with move tick marks.** One bar at the top of the body with notches at each move-boundary; a single moving cursor tells you which segment is active. Lowest-clutter; loses per-move proximity (the list and the bar are far apart).
- **V-E. "Move N of M" eyebrow + countdown chip.** Small `Move 2 of 4 · 0:18` line above the courtside list, no per-row decoration. Cheapest to build, but doesn't put the indicator *beside each move* — defeats half the user's intent.

## Frame 2 — Data source for per-move durations

How does the indicator know each move's start/end?

- **D-A. Structured `pacingSegments: [{label, durationSec}, …]` field on `DrillVariant`.** Add an optional new field. When present, the indicator renders against it; `courtsideInstructions` stays as prose for any move list embedded in surrounding context (intro/outro lines), and structured segments are rendered separately as a list with indicators. Forward-only schema add. Single source of truth for "what should the user be doing right now."
- **D-B. Parse the numbered list out of `courtsideInstructions` prose at render time.** No schema change. Brittle: copy formats vary (`d25` has 6 lines, `d26` opens with an intro paragraph then 3 lines, `d28` has an intro then 4 lines). Drift risk between the audio-pacing tick math and the parsed list. **Anti-substitution check:** this is the seductive shortcut that looks free but bakes a hidden contract into the copy authoring rules.
- **D-C. Uniform-interval marching: keep `subBlockIntervalSeconds`, advance the indicator one row every N seconds.** Already-shipped data. Works for `d28` (4 moves × 45 s ≈ 3 min block) but breaks for `d25` (the comment in `drills.ts` already concedes "the first two ticks may both belong to the initial walking segment on a 3+ minute wrap; this is a pacing pulse, not a richer per-segment schedule"). Honesty-bound to lie about cooldown.
- **D-D. Hybrid: `pacingSegments` when present, else fall back to uniform-interval marching against the prose row count.** Lets us ship `d25/d26/d28` deliberately and not block on retroactive metadata for any future timed drill that ships only the prose. Same surface, two evidence levels.

## Frame 3 — Reconciliation when sum-of-moves != block duration

The block duration comes from the session plan (`d26` wrap can be 3 min or 6 min). The move list is intrinsic to the drill. They will not always match.

- **R-A. Proportional scaling.** Compute the segment's share of the total move-time, multiply by the actual block duration. Always fits exactly. Distorts the authored times — a 30 s calf stretch becomes a 60 s calf stretch on a 6-min wrap. Wrong for stretches.
- **R-B. Honor authored times; spend overflow on the last segment.** Each move runs for its authored duration; if the block is longer, the last segment stretches. Matches `d28`'s stable shape. Awkward for `d26` where the *intent* of overflow is "mirror to other side, then add glutes/adductors" — i.e., extra moves, not extra time on the last move.
- **R-C. Honor authored times; loop / cycle the list when block is longer.** Walks through the moves once, then again if time remains. Wrong for stretches and ankle hops; right for nothing actually authored today.
- **R-D. Honor authored times; show "Bonus: mirror or add" when overflow exists.** Each move runs its authored time; once the list is done, the indicator hides and the block continues silently to the end-countdown, with a small footnote in the segment list (`Bonus: if time remains, mirror to other side or add glutes/adductors`). Matches the existing copy intent for `d26` and is honest when no extra structure exists for `d28`/`d25`.
- **R-E. Author each variant's overflow behavior explicitly per drill** (`overflowMode: 'stretch-last' | 'extra-segment' | 'silent'`). Most flexible; smallest authoring lever; small enum.

## Frame 4 — Scope (where the indicator renders)

- **S-A. RunScreen only, all timed drills with `subBlockIntervalSeconds` or `pacingSegments`.** Smallest blast radius. Today's three drills.
- **S-B. RunScreen + TransitionScreen preview.** Transition currently shows the courtside copy too; mirroring the structured list keeps voice consistent across the two adjacent screens (called out as a P12 surface pair in the architecture pass). Bigger change.
- **S-C. RunScreen, cooldown only.** Highest-evidence subset (build-17 F3 explicitly named cooldown). But `d28` warmup is on the same surface; carving cooldown out feels arbitrary.
- **S-D. RunScreen, gated by user opt-in toggle.** Adds a Settings switch. No evidence the indicator is unwanted; opt-in is the over-cautious shape.

## Frame 5 — Audio coupling

- **A-A. Add a per-move boundary beep; keep existing sub-block tick OR retire it.** When the indicator advances to the next row, fire a beep. If `pacingSegments` are present, the beep fires at segment boundaries (variable cadence); the uniform `subBlockIntervalSeconds` becomes a fallback for drills without structured segments. Closest to the user's intent ("beep when it's time to move on") and treats audio + visible as one coordinated channel.
- **A-B. Keep the uniform tick unchanged; the indicator is a separate layer.** Two truths. Risk of the visible cue saying "now on move 3" while the beep fires generically every 30 s mid-segment — drives confusion the indicator was meant to remove.
- **A-C. Distinct sound per move type (e.g., walk-tick vs stretch-tick).** Polish-class; no evidence of demand; out of scope.
- **A-D. No audio change at all; visible indicator only.** Honest fallback if audio pacing infra changes are in scope under a separate ship. But in the same ideation, A-A unifies the channels for free.

## Cross-cutting observations

- **The user's ask reads cleanly as V-B + D-A + R-D + S-A + A-A.** "Spinner beside each move" → V-B; "calculate this indicator from the time per move" → D-A (per-move durations explicit); "beep when it's time to move on" → A-A (move-boundary beep replaces uniform-tick semantics for structured drills).
- **The `d26` overflow case is the only honest design constraint.** Any survivor must answer "what happens when the wrap is 6 min and the authored times sum to ~3 min?"
- **Cap impact: zero.** This is infrastructure on three already-authored drills; no new drill records.
- **Anti-substitution check.** Did this ideation surface a clever way to ship drill content under a different label? Only if D-A balloons into authoring 8 retroactive `pacingSegments` blobs across the catalog. Bound by scope: `d25 + d26 + d28` only — the three M001-active timed drills. Any future timed drill authors its own `pacingSegments` at ship time.
- **Schema discipline.** D-A is forward-only and additive. The existing `subBlockIntervalSeconds` stays in place as the fallback channel and as the legible authoring contract for any drill that doesn't need per-move boundaries.

## Survivors

Ranked by leverage × evidence-fired × cap honesty. **All survivors consume zero authoring-cap slots.**

### V1 — Highlighted current row + structured pacingSegments + per-move beep + bonus-overflow footnote (recommended starter)

- **Composition**: V-A (highlighted row) · D-A (`pacingSegments` schema add) · R-D (bonus footnote on overflow) · S-A (RunScreen only) · A-A (per-move boundary beep replaces uniform tick when segments present).
- **Shape**: add an optional `pacingSegments?: { label: string; durationSec: number }[]` field to `DrillVariant`. Author it on `d25-solo` (6 segments), `d26-solo` (3 segments + bonus copy unchanged), `d28-solo` (4 segments). RunScreen renders structured segments as a list where the *current* row is highlighted (left-rule + medium weight + a small "Now" pill); previous rows show a check; future rows are neutral. The per-segment beep replaces the uniform-tick beep on structured drills (uniform tick remains the default for any future timed drill that doesn't ship segments).
- **Why this first**: lowest-clutter visual that still satisfies "beside each move," cleanest data contract, honors authored times, and gives the visible channel `S1` named without rebuilding the audio infra.
- **Evidence**: build-17 F3 (cooldown beeps inaudible → fell back to watching timer); two consecutive sessions of negative evidence on the audio side; partner-walkthrough P2-2 already named visible-pacing as a genuinely-open item.
- **Cap impact**: none. No drill records.
- **Trigger status**: fired (build-17 F3 + 2026-04-22 all-passes-reconciled bundle).
- **Risk**: schema add ripples into `model/draft.ts` plan-block snapshot if pacing data needs to survive plan persistence; mitigated by either (a) only reading `pacingSegments` from the live drill catalog at render (the runner already reads variants live for many fields) or (b) snapshotting alongside `subBlockIntervalSeconds`. Decide in `ce-brainstorm`.
- **Failure mode**: if author drift produces `pacingSegments` totals that don't match `workload.durationMinMinutes`, the indicator silently misaligns. Mitigate with a `catalogValidation` rule.

### V2 — V1 with per-move progress ring (V-B) instead of highlighted row

- **Composition**: V-B (progress ring) · D-A · R-D · S-A · A-A.
- **Shape**: same data contract as V1, but the visual is a small progress ring on the left edge of the current row that fills proportionally to elapsed time within the segment. Previous rows show a complete check; future rows show a hollow ring.
- **Why a survivor**: closest literal match to the user's "spinner beside each move."
- **Risk vs V1**: more motion at courtside. The outdoor-UI brief and partner-walkthrough density polish both pushed *less* visual chrome on Run. The ring competes for attention with the BlockTimer in the cockpit footer; two animated time displays may read as noise.
- **When to prefer**: if dogfeed shows V1's "Now" pill is too subtle outdoors. Cheap to swap in later — the data contract is identical.

### V3 — V1 with horizontal per-move progress bar (V-C) instead of highlighted row

- **Composition**: V-C (horizontal bar) · D-A · R-D · S-A · A-A.
- **Shape**: each segment row gets a thin left-to-right fill bar inside its own row chrome. Lowest-motion of the per-row variants.
- **Why a survivor**: keeps "beside each move" but reduces motion footprint vs V2.
- **Risk vs V1**: per-row bars can read as a download UI — wrong vibe for a cooldown stretch sequence.

### V4 — V1 minus structured data: D-D hybrid

- **Composition**: V-A · D-D (use `pacingSegments` when present, else uniform-interval marching against parsed prose row count) · R-D · S-A · A-A.
- **Shape**: same visual treatment as V1, but if a drill ships only `subBlockIntervalSeconds` (no `pacingSegments`), the indicator parses the numbered list out of `courtsideInstructions` and advances one row every N seconds.
- **Why a survivor**: insurance against retroactively forgetting to author `pacingSegments` on a future timed drill.
- **Risk**: the prose-parsing path is exactly D-B's brittleness behind a feature flag. Bakes a hidden contract into copy authoring (numbered lists must exist; format must be stable).
- **When to prefer**: if `ce-plan` shows that authoring `pacingSegments` for the three drills is somehow blocked by another in-flight change. Otherwise, V1 is cleaner.

## Rejected (with reasons)

| Cluster | Verdict | Reason |
|---|---|---|
| V-D global progress bar with notches | Reject | Loses "beside each move," the half of the user's intent that survives audio failure |
| V-E `Move N of M` eyebrow only | Reject | Doesn't put the indicator beside each move; defeats the design intent |
| D-B parse prose at render | Reject | Bakes a hidden authoring contract into copy formatting; brittle across drill copy updates |
| D-C uniform-interval marching as primary | Reject | Already known-wrong on `d25` per the explicit comment in `drills.ts` |
| R-A proportional scaling | Reject | Distorts authored stretch times; wrong for cooldown |
| R-C loop the list | Reject | Wrong for every drill currently authored |
| R-E per-drill overflow enum | Reject (pre-mature) | One enum value matters today (`R-D`); add the enum when a second case fires |
| S-B add to TransitionScreen | Reject (defer) | Transition shows static copy; live indicator there has no fired need |
| S-D opt-in toggle | Reject | No evidence the indicator is unwanted; opt-in adds Settings clutter |
| A-C per-move sound palette | Reject | Polish-class; no demand |
| A-D no audio change | Reject (within this ideation) | Survivor V1 unifies channels for free; punting audio coupling re-creates the today-problem |

## Stopped lines (anti-substitution check)

The cap discipline asks: did this surface a clever way to ship drill content under a different label? **No.** The candidates here all decorate or instrument the *existing* three timed drills. The one shape that could drift in that direction (D-B prose-parsing) is rejected explicitly so any future timed drill must declare its own structured segments at ship time, not have them inferred.

## Cap and trigger posture

- **Cap impact**: zero across all survivors.
- **D130 founder-use mode**: this work is squarely inside D130. It is courtside infrastructure, not new behavior surface; no D130-condition reads change.
- **D134 falsification gate (2026-05-12)**: V1 ships before that read; if pacing reliability remains a complaint after V1, it's now a platform/device-state question, not a missing-app-affordance question. That sharpens the gate.
- **D91 retention gate**: deferred; V1 does not move the gate evaluation.

## Cross-cutting observations

- **V1 is the recommended starter.** Highlighted row is the lowest-clutter visual that still satisfies "beside each move," and the per-move beep + structured segments give the audio tick honest meaning instead of generic pulse.
- **V2/V3 are visual swaps over V1's data contract.** If V1 dogfeeds as too subtle outdoors, swap the visual; the schema and timing math are unchanged.
- **V4 is V1 with a fallback path.** Keep in reserve; pull if a future drill ships pacing without segments.
- **The `d26` overflow case is solved by R-D.** The bonus footnote ("if time remains, mirror to other side or add glutes/adductors") is already in the courtside copy; the indicator just respects the authored 3-segment list and stops advancing when those are done.

## Handoff

`ce-brainstorm` picks one survivor (recommended: **V1**) and produces a requirements doc under `docs/brainstorms/` named `2026-04-28-per-move-pacing-indicator-requirements.md`. After requirements land, `ce-plan` turns it into an implementation plan under `docs/plans/`.

Open questions to resolve in brainstorm:

- **OQ1.** Where does `pacingSegments` data live in the runner snapshot — read live from the catalog, or snapshotted alongside `subBlockIntervalSeconds` in the plan/execution log?
- **OQ2.** What's the visual treatment for the *first* segment before the timer starts (preroll state)? Highlighted as "Now," or all-neutral until preroll completes?
- **OQ3.** Should the per-move beep fire at the *end* of each segment (signaling "move on now") or the *start* of the next segment? Both are defensible; pick one and stay consistent.
- **OQ4.** Catalog validation: should `sum(pacingSegments[].durationSec)` be required to equal one of the workload boundaries, or just produce a warning?

## For agents

- **Authoritative for**: the ranked variant menu for the per-move pacing indicator under S1.
- **Edit when**: a survivor is selected and consumed by `ce-brainstorm`; a rejected variant acquires firing evidence; the audio-coupling shape changes upstream in S1.
- **Belongs elsewhere**: the broader S1 cluster ranking (`docs/ideation/2026-04-28-what-to-add-next-ideation.md`); audio-pacing reliability boundary (`docs/research/2026-04-28-audio-pacing-reliability-investigation.md`); cap state (`docs/plans/2026-04-20-m001-adversarial-memo.md`).
- **Outranked by**: `docs/decisions.md`; the parent ideation doc when survivors there shift.
- **Refresh by**: 2026-05-21 (D130 Condition 3 final close) at the latest, or when a survivor is consumed.
