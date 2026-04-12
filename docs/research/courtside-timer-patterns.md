---
id: courtside-timer-patterns
title: Courtside Timer and Run-Time Interaction Patterns
status: active
stage: planning
type: research
authority: timer and run-time interaction patterns for courtside use
summary: "Timer, transition, and interruption-recovery patterns for courtside run mode."
last_updated: 2026-04-12
depends_on:
  - docs/specs/m001-courtside-run-flow.md
---

# Courtside Timer and Run-Time Interaction Patterns

## Use This Note When

- you need the timer model or phase-transition defaults for M001 run mode
- you need to reason about auto-advance, wake lock, interruption recovery, or audio / haptic behavior
- you need to decide what the timer can safely promise in a PWA versus what must stay best-effort

## Executive Summary

A courtside training timer is a "guiding interaction": once started, it must run the session with minimal touches and high legibility. However, building this as a PWA (M001) comes with strict limitations regarding background execution, audio, and haptics.

This pushes M001 toward a **foreground-first** stance:
- The app expects the screen to stay on (using **Screen Wake Lock**).
- Backgrounding is treated as an interruption to be recovered from, rather than a supported running state.
- Interactions are reduced to block-level taps, avoiding per-rep tapping that fails in beach conditions.

## Key Findings & Constraints

1. **Timer UI**: The dominant pattern for interval/HIIT timers is a **countdown-first** display paired with large, high-contrast, full-screen visuals that are legible from a distance.
2. **Auto-Advance (Auto-Go)**: Timers auto-advance through phases (work/rest/prepare) to keep the session hands-free.
3. **Background Unreliability**: Browsers throttle timers (`setTimeout`) and pause `requestAnimationFrame` in hidden tabs. iOS PWAs specifically have known issues with background audio stopping when the app is backgrounded.
4. **Screen Wake Lock**: Now supported in iOS/iPadOS 18.4 home screen web apps. This is the primary mechanism to keep the screen awake courtside.
5. **Haptics**: Safari on iOS does not support the Vibration API. We cannot promise haptics for iPhone users in a PWA.
6. **Audio**: Autoplay policies require an explicit user action to start audio. Simple beeps via `<audio>` elements are more reliable on iOS than Web Audio API.

## Recommended M001 Implementation

### Timer & Counter Model
- **Countdown-first**: Each block counts down, with elapsed time as secondary metadata.
- **Auto-advance**: Sessions progress automatically. Include a brief "3-2-1" pre-roll cue before a WORK phase begins so the athlete can reset.
- **Set Marker vs Rep Tally**: For pass/serve-receive, per-rep tapping is unrealistic. Use a single-tap set completion/quality marker (e.g., `Good` / `Not Good`) during the rest phase instead.
- **Rest Handling**: Provide large controls during rest phases for "+15s" or "Skip Rest" (long-press to avoid accidental skips).

### Interruption Recovery
- Use **timestamp-based truth** (start time, phase start time, planned durations) rather than relying on `setInterval` accuracy.
- Save a session state snapshot locally at every transition.
- When the app is backgrounded or locked, mark it as Interrupted.
- On resume, if time has drifted, ask the user: **Resume (reconcile time)** or **Resume (pause elapsed)** (defaulting to pause elapsed for safety).

### Audio & Haptics
- **Audio**: Default off. Optional beeps (or voice) must be unlocked via a deliberate "Start / Test Sound" tap at the beginning.
- **Haptics**: Do not promise haptics on iPhone. Android can optionally use `navigator.vibrate()` for transitions.
