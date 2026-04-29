---
id: per-move-pacing-indicator-requirements-2026-04-28
title: "Requirements: per-move pacing indicator (warmup/cooldown segments)"
type: requirements
status: active
stage: validation
authority: "Selected survivor V1 from docs/ideation/2026-04-28-per-move-pacing-indicator-ideation.md, with the user-directed re-framing to model warmup/cooldown drills as composed segments (each authored with its own duration) rather than as a single uniformly-ticked block. This doc is the brainstorm output; ce-plan turns it into an implementation plan."
summary: "Adds a `segments?: DrillSegment[]` composition field to DrillVariant so warmup (d28-solo) and cooldown (d25-solo, d26-solo) drills declare their internal moves as named, individually-timed segments. RunScreen renders the segments as a structured list with the current segment given a shibui highlight (left rule + 'Now' pill) and previous segments shown as completed; the per-segment duration drives a tick that beeps at the END of each segment. The existing uniform `subBlockIntervalSeconds` stays as the fallback channel for any future timed drill that doesn't author segments. The total of segment durations is anchored to the workload floor; overflow time honors the existing 'mirror / add bonus' copy on d26."
last_updated: 2026-04-28
related:
  - docs/ideation/2026-04-28-per-move-pacing-indicator-ideation.md
  - docs/ideation/2026-04-28-what-to-add-next-ideation.md
  - docs/research/2026-04-28-build17-pair-dogfeed-feedback.md
  - docs/research/2026-04-28-audio-pacing-reliability-investigation.md
  - docs/research/founder-use-ledger.md
  - docs/research/partner-walkthrough-results/2026-04-22-all-passes-reconciled.md
  - app/src/data/drills.ts
  - app/src/types/drill.ts
  - app/src/hooks/useBlockPacingTicks.ts
  - app/src/screens/RunScreen.tsx
  - app/src/model/draft.ts
  - app/src/model/session.ts
  - app/src/domain/sessionBuilder.ts
  - app/src/services/session/commands.ts
  - app/src/data/catalogValidation.ts
decision_refs:
  - D42
  - D105
  - D130
---

# Per-move pacing indicator — requirements

## Problem frame

Three M001-active timed drills today (`d28-solo` warmup, `d25-solo` and `d26-solo` cooldown) ship a numbered move list as `whitespace-pre-line` prose inside `courtsideInstructions`, and pace it with a uniform-interval audible tick driven by `subBlockIntervalSeconds`. The two channels are not coordinated: the audio tick has no concept of which move you're on, and the prose list has no concept of timing.

On the 2026-04-28 build-17 pair dogfeed (`docs/research/2026-04-28-build17-pair-dogfeed-feedback.md` §F3), Seb reported the cooldown / sub-block beeps were missing or inaudible and **fell back to watching the timer himself**, because there was no visible per-move position cue to fall back to. The follow-up investigation (`docs/research/2026-04-28-audio-pacing-reliability-investigation.md`) confirmed two narrow app fixes (wake-lock handoff, `d25-solo` metadata coverage) but left the core gap intact: there is no visible channel that says *which move you should be on right now*.

The user's ask: a small visual indicator beside each move on RunScreen that shows which move is current, computed from per-move time, paired with a beep when it's time to move on.

## Origin

`docs/ideation/2026-04-28-per-move-pacing-indicator-ideation.md` — sub-ideation under `S1` from the parent `docs/ideation/2026-04-28-what-to-add-next-ideation.md`. Selected survivor: **V1** (highlighted current row + structured segments + per-move boundary beep + bonus-overflow footnote), with the user re-framing the data side: model the warmup/cooldown drills as **composed of named sub-segments**, each carrying its own duration, with the total derived (or validated) against `workload.durationMinMinutes`.

## Actors

- **A1. Solo founder courtside.** Mid-warmup or mid-cooldown, phone in hand, sometimes phone-down with audio expected to carry pacing. Needs to know which move to be on without watching the timer count down.
- **A2. Pair courtside (founder + Seb / partner).** One person leading or both side-by-side; the screen is glanceable but not always read in detail. Needs a glanceable cue that survives audio failure (silent switch, lock state).
- **A3. Drill author (founder, content authoring time).** Writes `courtsideInstructions` and now also declares segments. Needs the authoring contract to be obvious and validated by the catalog rules so segment drift can't ship silently.

## Key flows

- **F1. Warmup ramp on d28-solo (3 min).** User taps Continue on Safety; preroll counts 3-2-1; the four Beach Prep segments (jog/skip · ankle hops · arm circles + trunk · side shuffles + pivot starts) render as a structured list with segment 1 highlighted as **Now**. At 45 s elapsed, a beep fires (end of segment 1), segment 1 collapses to a check, segment 2 highlights as **Now**. At 135 s elapsed, segment 4 highlights as **Now**. At 180 s, the existing block-end 3-2-1 + final beep fires.
- **F2. Cooldown stretch on d26-solo (3-min wrap).** Same shape, three segments (calf · hamstring · hip flexor), 60 s each. After segment 3 ends at 180 s, the indicator stops advancing and a small footnote stays visible: "Bonus: if time remains, mirror to the other side or add glutes / adductors." Block-end cues fire normally at the actual block duration.
- **F3. Cooldown stretch on d26-solo (6-min wrap).** Same three-segment list runs through 180 s; from 180 s to 360 s, the indicator shows all three segments checked + the bonus footnote, and the block-end cues fire at the actual block duration.
- **F4. Audio fails (silent switch on, headphones disconnected, lock-screen suspends Web Audio).** Visible segment list keeps advancing; the user can glance at the phone and see which move to be on. This is the load-bearing flow that motivated the brainstorm.
- **F5. User pauses mid-segment, resumes.** The indicator and the timer pause together; on resume, the segment math picks up where it left off (no double-fire of the segment-end beep).
- **F6. User taps Next/Skip mid-block.** Block ends; segment list freezes in whatever state it was in; transition fires normally.
- **F7. Drill without segments ships in the future.** Variant declares only `subBlockIntervalSeconds`; RunScreen renders the prose list as today (no segment chrome) and the uniform tick continues to fire. No regression for any future drill that opts out of structured segments.
- **F8. Drift / authoring error: segment durations don't sum to the workload floor.** `catalogValidation` flags it; CI fails; the drift cannot ship.

## Acceptance examples

- **AE1.** Given `d28-solo` ships with 4 segments (45 s × 4 = 180 s) and the planned block duration is 180 s (3 min). When the user starts the block. Then segment 1 is highlighted with a small "Now" pill at t=0; at t=45 s the segment-end beep fires and segment 1 transitions to checked / segment 2 to "Now"; at t=180 s the block-end 3-2-1 + final beep fires and Run hands off to Transition. Covers F1.
- **AE2.** Given `d26-solo` ships with 3 segments (60 s × 3 = 180 s) and the planned block duration is **240 s** (4 min, sampled inside the 3-6 min envelope). When the user starts the block. Then segments tick through normally; from t=180 s to t=240 s, all three segments show checked, the indicator does not advance, the bonus footnote stays visible, and no further per-segment beep fires before the block-end cues. Covers F2 / F3.
- **AE3.** Given the user pauses Run at t=20 s mid-segment-1 and resumes 15 s later. When pause→resume completes. Then the segment-end beep for segment 1 fires at the cumulative 45 s of *running* time, not at 30 s wall-clock from resume; the indicator stays on segment 1 throughout the pause. Covers F5.
- **AE4.** Given a future `d99-solo` ships with `subBlockIntervalSeconds: 30` and **no** segments. When the user runs `d99-solo`. Then RunScreen renders `courtsideInstructions` as today's `whitespace-pre-line` prose (no segment list, no "Now" pill), and the uniform sub-block tick fires every 30 s exactly as today. No regression. Covers F7.
- **AE5.** Given `d25-solo` ships with 6 segments whose durations sum to 180 s but the workload envelope says `durationMinMinutes: 2` (120 s). When the catalog validation runs in CI. Then `validateDrillCatalog` returns a `segment_duration_mismatch` issue with a path of `drills.d25.variants.d25-solo.segments` and CI fails. Covers F8.
- **AE6.** Given the user runs `d28-solo` with the phone's silent switch on and Wake Lock denied (so audio is suppressed and the screen may sleep). When the screen is briefly woken by a tap to glance. Then the segment list shows the correct current segment for the elapsed time, identical to what it would show with audio on. Visible state is independent of audio state. Covers F4.

## Scope boundaries

- **In scope.**
  - Add an optional `segments?: DrillSegment[]` field to `DrillVariant` (new type `DrillSegment { id, label, durationSec, cue? }` — `cue?` reserved for future use, not surfaced in v1).
  - Author segments on `d25-solo`, `d26-solo`, and `d28-solo`.
  - Snapshot `segments` through the existing `subBlockIntervalSeconds` pipeline: variant → `pickForSlot` → `DraftBlock` → `SessionPlanBlock` → swap/restore → buildDraftFromCompletedBlocks → `useRunController`.
  - RunScreen: render structured segments as a list when present, replacing the prose numbered list (the prose intro / outro lines stay as a separate paragraph above the list).
  - Pacing math: per-segment cumulative-time advancement; end-of-segment beep replaces the uniform tick when segments are present.
  - Bonus-overflow handling on `d26-solo` (and any future variant whose workload max exceeds the segment sum): segment list freezes in checked state; bonus footnote stays visible; block-end cues fire at the actual block duration.
  - Catalog validation: new issue code `segment_duration_mismatch` requires `sum(segments[].durationSec)` to equal `workload.durationMinMinutes * 60` exactly. Plus duplicate-segment-id and invalid-segment-duration checks.
  - Pause/resume/skip semantics for the segment indicator.
  - Vitest coverage at the lowest useful tier per `.cursor/rules/testing.mdc` (domain pacing math, controller wiring, catalog validation, drill copy regression for the three updated variants).

- **Outside this product's identity.**
  - Any "compose drills out of other drills" promotion of segments to first-class `Drill` records. Segments are sub-block timing structure, not stand-alone training prescriptions. They never enter session assembly, swap, or any drill-level surface (Settings, Home, Review history). This is the rejection that protects against turning a pacing primitive into a content-multiplier.
  - Per-segment Difficulty, success metric, or capture surface. Drill Check capture is per-block; segments are pre-block authoring structure only.
  - Animated rings, spinners, or progress bars. The chosen visual is **shibui** — left rule + "Now" pill + checkmarks for completed segments. No motion. (V2/V3 from the ideation can be revisited later if dogfeed shows V1 is too subtle outdoors.)
  - TransitionScreen rendering of structured segments. Transition keeps today's static courtside copy; no live indicator.
  - Settings opt-in / off toggle. The indicator is on for any drill with segments; no user-facing setting.
  - Per-segment beep palette / distinct sounds per segment type. One beep at end of each segment, identical to today's sub-block tick sound (or a slightly distinguishable variant — decide in `ce-plan`).

- **Deferred for later.**
  - Per-segment cue text rendering (`DrillSegment.cue?`). The field is reserved in the type but unused at runtime in v1 to keep the surface minimal. Author the field on segments where natural; render in a future polish ship if dogfeed asks for it.
  - Retroactive segment authoring on any future timed drill (`d27`, `d29`, etc.). Each such drill authors segments at its own ship time with its own trigger.
  - Lock-screen MediaSession presence (still post-D91; called out in `app/src/lib/audio.ts` comments).
  - Variable-time segments (e.g., 30-60 s ranges, user-paced). Single fixed `durationSec` per segment is the v1 contract.

## Dependencies / assumptions

- **Assumption.** The shipped wake-lock + audio-primer behavior from 2026-04-24 and the 2026-04-28 wake-lock-handoff fix continues to work as documented in `docs/research/2026-04-28-audio-pacing-reliability-investigation.md`. This work does not re-litigate the audio-reliability boundary; it adds the visible channel that survives that boundary.
- **Assumption.** `useBlockPacingTicks` is the right home for per-segment math (it already owns end-of-block 3-2-1 + uniform sub-block tick; segment math is the same shape). `ce-plan` confirms vs splitting into a separate hook.
- **Dependency.** `subBlockIntervalSeconds` already pipes through the full snapshot pipeline (`model/draft.ts` → `model/session.ts` → `services/session/commands.ts` → `domain/sessionBuilder.ts` → `domain/sessionAssembly/swapAlternatives.ts` → `useRunController`). The new `segments` field rides exactly the same rails — no new persistence shape.
- **Dependency.** Dexie schema: `SessionPlanBlock.segments` is a new optional field on a stored shape. **Forward-only**: existing persisted plans without segments continue to work (the field is optional on read; absent → uniform tick path is taken). **No schema bump required** because Dexie's schema versions key on table+index changes, not stored object shape, and `sessionPlans` already stores arbitrary plan blocks. `ce-plan` verifies this against `app/src/db/schema.ts`.
- **Dependency.** Catalog validation runs in CI on every commit per `app/src/data/__tests__/catalogValidation.test.ts`. Adding the `segment_duration_mismatch` rule is mechanically straightforward; the existing `invalid_sub_block` code is the closest existing pattern.
- **Constraint.** `D130` founder-use mode is binding. This work consumes zero authoring-cap slots (segments are not drill records). No cap state changes.
- **Constraint.** Outdoor-UI brief: 16 px body floor, high contrast, glanceable. The "Now" pill must read at arm's length on iPhone PWA.

## Success criteria

- **R1.** A user running `d28-solo` (warmup), `d26-solo` (cooldown stretch), or `d25-solo` (cooldown downshift) sees a structured segment list on RunScreen with exactly one segment marked **Now** at any given moment of the timer running, computed from cumulative running time and authored per-segment durations.
- **R2.** When a segment ends, a single audible beep fires and the **Now** marker advances to the next segment within ≤ 250 ms of segment boundary (matching today's `pollIntervalMs`).
- **R3.** When the planned block duration exceeds the sum of segment durations (e.g., `d26-solo` running on a 4-6 min wrap), the segment list freezes with all segments shown as checked once their durations have elapsed; the bonus footnote remains visible until the block ends; the block-end cues fire at the actual block duration.
- **R4.** Pause / resume preserves segment state. Skip / Next ends the block immediately and freezes the segment list; no replay, no rewind.
- **R5.** A drill variant that ships only `subBlockIntervalSeconds` and no `segments` renders RunScreen exactly as today (prose list, uniform tick). No regression on any future timed drill that opts out of segments.
- **R6.** Catalog validation rejects, in CI, any variant whose `sum(segments[].durationSec) !== workload.durationMinMinutes * 60` (when `segments` is present). Duplicate segment IDs within a variant are also rejected.
- **R7.** The visible state of the segment list is independent of audio state. Silent switch on, lock state, and unsupported / denied Wake Lock do not change which segment renders as **Now**.
- **R8.** No new Drill, DrillVariant, or session-assembly behavior. Segments are a sub-block authoring concern only and never enter `pickForSlot`, `findSwapAlternatives`, Settings, Home, or Review.

## Key decisions resolved here

- **Variant: V1 (shibui).** Highlighted current row with "Now" pill and check-marks for completed segments. No animated rings (V2) or progress bars (V3).
- **Beep timing: end of segment.** Signals "time to move on." Matches user wording ("beep when it's time to move on") and avoids double-fire confusion at segment boundaries.
- **Data model: `DrillSegment[]` as a new bounded type, authored on `DrillVariant.segments?`.** Not promoted to first-class `Drill` records. Not a "drill-of-drills" composition. Segments have no skill focus, no level, no success metric, no participants — they're pure pacing structure.
- **Snapshot model: rides the existing `subBlockIntervalSeconds` snapshot pipeline.** Plan-block stores segments at session creation; the runner reads from the snapshot. Mirrors today's pattern; no new persistence shape.
- **Total-duration anchor: `sum(segments[].durationSec) === workload.durationMinMinutes * 60`.** The min boundary is the segment-list's "natural length"; overflow up to `durationMaxMinutes` is bonus territory matching today's `progressionDescription` voice on `d26`.
- **`subBlockIntervalSeconds` posture on the three updated drills.** Retire from `d25-solo`, `d26-solo`, `d28-solo` once `segments` ships there. Remains the default channel for any future timed drill that opts out of structured segments. (`ce-plan` decides whether to retain temporarily for one ship cycle as a backstop.)

## Open questions deferred to ce-plan

- **OQ-P1.** Where in `useBlockPacingTicks` does the segment-advance logic sit — extend the existing hook with a third responsibility, or split into a new sibling hook (`useSegmentTicks`)? Pyramid policy suggests the lowest tier; segment math is pure and can be unit-tested at the domain tier first, then wired into the hook.
- **OQ-P2.** Sound for the per-segment end beep: identical to today's `playSubBlockTick` (low risk, indistinguishable from existing) or a slightly distinct timbre to signal "segment end" vs the block-end 3-2-1 + final? Recommend identical for v1; revisit if dogfeed asks.
- **OQ-P3.** Visual treatment for the **first** segment during preroll (before the timer starts). Highlight as "Now" through preroll, or all-neutral until preroll completes? Recommend "Now" through preroll so the user can read the upcoming move during the 3-2-1 count-in.
- **OQ-P4.** Live segment count vs snapshotted segment count when the catalog updates mid-session. Today's pattern is snapshot-on-create; segments follow that. (User-directed.)
- **OQ-P5.** Test pyramid placement: domain unit (`computeCurrentSegment(elapsedSec, segments)`), hook unit (`useBlockPacingTicks` with segments), controller wiring (`useRunController` → segments), screen integration (RunScreen renders structured list when segments present). One test per tier; no duplication.
- **OQ-P6.** `cue?: string` reservation on `DrillSegment` — author it now on segments where the courtside copy carries a distinct cue per move (e.g., `d26` calf vs hamstring vs hip flexor) or strictly omit until rendered? Recommend reserve in the type; omit from the authored data until the rendering ship.

## Risks

- **R-risk-1. Silent author drift.** A future variant author adds segments whose durations don't match the workload floor. **Mitigation**: catalog validation rule + drill copy regression test per the existing pattern in `app/src/data/__tests__/drillCopyRegressions.test.ts`.
- **R-risk-2. Confusing voice between segments and prose.** The current `courtsideInstructions` for `d26-solo` mixes intro paragraph + numbered list + bonus instruction; if segments render *and* the prose list still renders, the user sees the same content twice. **Mitigation**: when `segments` is present, render the segments structured and only render the **non-list** parts of `courtsideInstructions` (intro and bonus paragraph). `ce-plan` defines the parsing rule. Alternative: split `courtsideInstructions` for these three drills into `intro` / segments / `bonus` fields explicitly. The drill type already isolates these three drills as the affected surface; refactoring their copy storage is acceptable.
- **R-risk-3. Audio-reliability regression by removing the uniform tick on the three drills.** If end-of-segment beeps are functionally less audible (different cadence vs uniform 30 s) the audio-pacing perceived-reliability could regress. **Mitigation**: reuse the same `playSubBlockTick` sound; segment cadence on `d28` (45 s) and `d26`/`d25` (variable but ≥30 s typical) is in the same ballpark as today. Validate on next dogfeed.
- **R-risk-4. Plan-snapshot bloat.** Snapshotting an array of segments on every plan block adds JSON weight. **Mitigation**: only the three timed drills ship segments today; the field is optional on every other block. Negligible.
- **R-risk-5. Pause/resume edge cases.** Cumulative-elapsed math on segment boundaries during pause has a known class of bugs (off-by-one segment, double-beep on resume). **Mitigation**: domain-tier pure unit test for `computeCurrentSegment(elapsedSec, segments)` covering the boundary cases (exact-boundary, < 250 ms before/after, immediate-pause-on-resume, last-segment-overflow). `ce-plan` enumerates the cases.

## System-wide impact

- **Catalog & types** (`app/src/types/drill.ts`, `app/src/data/drills.ts`, `app/src/data/catalogValidation.ts`): new `DrillSegment` type, new optional `DrillVariant.segments`, new `segment_duration_mismatch` issue code, new validation logic.
- **Model** (`app/src/model/draft.ts`, `app/src/model/session.ts`): `DraftBlock.segments?` and `SessionPlanBlock.segments?` fields ride alongside `subBlockIntervalSeconds`.
- **Domain** (`app/src/domain/sessionBuilder.ts`, `app/src/domain/sessionAssembly/swapAlternatives.ts`, `app/src/domain/__tests__/buildDraftFromCompletedBlocks.test.ts`): segments propagate through the same touch points as `subBlockIntervalSeconds`. New pure helper `computeCurrentSegment` (likely in `app/src/domain/runFlow/` or `app/src/hooks/useBlockPacingTicks` extracted to a pure helper for unit testing).
- **Services** (`app/src/services/session/commands.ts`): segment field carried on `createSessionFromDraft`'s plan-block write.
- **Hooks** (`app/src/hooks/useBlockPacingTicks.ts`): extended (or paired with sibling hook) to handle segment advancement and end-of-segment beep firing.
- **Controllers** (`app/src/screens/run/useRunController.ts`): wires `currentBlock.segments` into the pacing hook; exposes current-segment-index to RunScreen.
- **Screens** (`app/src/screens/RunScreen.tsx`): renders segment list when `segments` present, with shibui highlight on the current segment.
- **Platform / audio** (`app/src/lib/audio.ts`, `app/src/platform/`): no change; reuses existing `playSubBlockTick`.
- **Tests** (Vitest + drill copy regressions + catalog validation): one test per tier per the pyramid policy.

## Visual sketch

```
RunScreen body, mid-warmup on d28-solo (segment 2 active, ~60 s elapsed):

  Beach Prep · Warmup
  Beach Prep Three

  Four quick blocks, ~45 s each. End warmer than you started.

  ✓ Jog or A-skip around your sand box.            45s
  ▎ Ankle hops and lateral shuffles.    [ Now ]   45s
  ○ Arm circles and trunk rotations.                45s
  ○ Quick side shuffles and pivot-back starts.      45s

  ─ Cue ────
  Short hops, loud feet.

  [ cockpit footer: BlockTimer + RunControls ]
```

Voice notes for `ce-plan`:
- `▎` is the 2 px accent left rule used elsewhere in the app for the active row.
- `[ Now ]` is a small inline pill at the body-text scale, accent-bg + neutral text.
- `✓` is a small accent check; `○` is a muted neutral circle. No motion on either.
- Per-segment durations render at the right edge as a subtle muted suffix (`45s`) so the user can see at a glance how long the current move is supposed to last.
- Intro paragraph above the list ("Four quick blocks...") stays as today; the numbered prose list is **replaced** by the structured segments.

## Sources & references

- Origin ideation: `docs/ideation/2026-04-28-per-move-pacing-indicator-ideation.md`
- Parent cluster: `docs/ideation/2026-04-28-what-to-add-next-ideation.md` §S1
- Field signal: `docs/research/2026-04-28-build17-pair-dogfeed-feedback.md` §F3
- Audio boundary: `docs/research/2026-04-28-audio-pacing-reliability-investigation.md`
- Walkthrough provenance: `docs/research/partner-walkthrough-results/2026-04-22-all-passes-reconciled.md` §"Genuinely-open Tier 1b bundle"
- Schema today: `app/src/types/drill.ts` (`DrillVariant.subBlockIntervalSeconds?`), `app/src/model/session.ts` (`SessionPlanBlock`), `app/src/model/draft.ts` (`DraftBlock`)
- Pacing today: `app/src/hooks/useBlockPacingTicks.ts`, `app/src/screens/run/useRunController.ts`
- Render today: `app/src/screens/RunScreen.tsx`
- Catalog rules: `app/src/data/catalogValidation.ts`
- Drill-copy regression home: `app/src/data/__tests__/drillCopyRegressions.test.ts`
