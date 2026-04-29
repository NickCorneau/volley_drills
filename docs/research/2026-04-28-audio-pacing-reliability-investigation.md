---
id: 2026-04-28-audio-pacing-reliability-investigation
title: "Audio Pacing Reliability Investigation"
type: research
status: active
stage: validation
authority: "Follow-up investigation for the build-17 F3 cooldown/sub-block beep report. Separates confirmed app regressions from iOS/PWA platform boundaries and records the narrow fix applied."
summary: "The build-17 F3 report exposed two confirmed app-side reliability gaps: Run released the Safety-primed wake lock before preroll/timer start, and active recovery drill d25 lacked sub-block pacing metadata while d26 and d28 had it. The fix holds wake lock while the active block is planned/prerolling/running and adds 30 s pacing metadata to d25. Silent switch, manual lock, and unsupported wake lock remain platform/device residuals."
last_updated: 2026-04-28
depends_on:
  - docs/research/2026-04-28-build17-pair-dogfeed-feedback.md
  - docs/roadmap.md
  - app/src/screens/run/useRunController.ts
  - app/src/data/drills.ts
decision_refs:
  - D42
  - D105
  - D130
---

# Audio Pacing Reliability Investigation

## Agent Quick Scan

- Trigger: build-17 F3 reported missing or inaudible cooldown/sub-block beeps after the 2026-04-24 wake-lock + audio-primer ship.
- Confirmed app-side gaps: Run released the Safety-primed wake lock before preroll/timer start; `d25-solo` had no `subBlockIntervalSeconds`.
- Fix applied: hold wake lock while the active block is planned, prerolling, or running; add 30 s pacing metadata to `d25-solo`.
- Still residual: iOS silent switch can suppress Web Audio, manual lock suspends PWA timer/audio, and unsupported/denied Screen Wake Lock remains best-effort.

## Purpose

Close the investigation loop requested by `docs/roadmap.md` for the screen-lock audio-suspend risk. This note records what was verified in code, what remains device-state evidence, and which product claims are now honest.

## Use This Note When

- checking whether the build-17 F3 audio-pacing report was app-side or platform-boundary
- deciding what downstream copy can honestly claim about Run-screen audio cues
- debugging future reports of missing cooldown, sub-block, or block-end beeps
- routing follow-up work on richer per-segment cooldown pacing

## Investigation Inputs

- Field signal: `docs/research/2026-04-28-build17-pair-dogfeed-feedback.md` F3.
- Prior platform boundary: `docs/research/founder-use-ledger.md` operating notes on iOS silent mode and manual lock.
- Runtime path: `app/src/screens/SafetyCheckScreen.tsx`, `app/src/screens/run/useRunController.ts`, `app/src/lib/screenWakeLock.ts`, `app/src/lib/audio.ts`, `app/src/hooks/useBlockPacingTicks.ts`.
- Metadata path: `app/src/data/drills.ts`, `app/src/domain/sessionBuilder.ts`, `app/src/services/session/commands.ts`.

## Confirmed Findings

### Wake-lock handoff had an app-side regression

`SafetyCheckScreen` correctly calls `primeAudioForGesture()` and `primeScreenWakeLockForGesture()` from the Continue tap. That part of the intended gesture-bound path exists.

The gap was in Run: `useRunController` released wake lock whenever `timer.isRunning` was false. On a new active block, the timer is false while the active block is still `planned` and preroll is about to begin, so the Safety-primed wake lock could be released before the block actually started.

Fix: Run now holds or requests wake lock while the active block is `planned`, while preroll is visible, or while the timer is running. It still releases on pause, transition/unmount, and non-preroll non-running states.

### Active pacing metadata was incomplete

The Run pacing hook schedules sub-block ticks only when `currentBlock.subBlockIntervalSeconds` exists.

- `d28-solo` Beach Prep Three: covered at 45 s.
- `d26-solo` Stretch: covered at 30 s.
- `d25-solo` Downshift: active M001 recovery candidate, but previously uncovered.

Fix: `d25-solo` now carries 30 s pacing metadata. The first two ticks may both belong to the initial walking segment on a 3+ minute wrap; this is a pacing pulse, not a richer per-segment schedule.

Forward-only residual: the catalog fix applies to newly built drafts/plans. Already persisted local drafts or not-started plans that copied `d25-solo` before this fix can still lack the field unless rebuilt.

### Cooldown audio exists, but not as a separate phase cue

There is no dedicated "cooldown started" audio cue. Existing cues are:

- preroll ticks at block start,
- sub-block pacing ticks when metadata exists,
- block-end 3-2-1 countdown ticks,
- block-end beep when the timer completes or the user taps Next/Skip.

That means cooldown reliability should be claimed as "wrap blocks have the same timer/end cues, and covered wrap drills can have sub-block pacing ticks," not as a separate cooldown-phase audio system.

## Device-State Evidence Still Needed

The build-17 memo did not include enough runtime evidence to confirm:

- silent switch state,
- browser tab vs Home Screen PWA,
- manual lock vs screen-up posture,
- whether the Run wake-lock warning appeared,
- whether block-end countdown ticks fired while sub-block ticks did not.

Those remain the next real-device checks if audio is reported missing again.

## Verification

- Red tests first:
  - `useRunController` released wake lock before preroll/timer start.
  - `d25-solo` lacked pacing metadata.
- Green after fix:
  - `npm test -- src/screens/run/__tests__/useRunController.test.tsx src/data/__tests__/drillCopyRegressions.test.ts`

## Product Claim Boundary

Honest downstream claim after this fix:

> The app keeps the screen awake where the browser allows it and provides audible foreground cues for preroll, block end, and covered sub-block pacing.

Do not claim:

> Audio works through silent mode, manual phone lock, or unsupported/denied Wake Lock.
