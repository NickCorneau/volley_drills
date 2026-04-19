// Pure math for the "Shorten block" action. Lives outside RunScreen so it
// can be unit-tested directly — red-team bug #2 regressed on a subtle
// condition (clamping newRemaining below the 10 s floor silently extending
// the block) and the screen itself is hard to reach from vitest.
//
// Contract:
//  - Return a new remaining value that is always <= current remaining.
//  - Favour halving, but never below a small floor so the resume isn't
//    instantaneous.
//  - Adjust the total duration by the same delta so the progress bar and
//    persisted timer-state stay consistent.

export const SHORTEN_MIN_REMAINING_SECONDS = 10

export interface ShortenResult {
  newRemainingSeconds: number
  newDurationSeconds: number
}

export function computeShortened(
  activeDurationSeconds: number,
  remainingSeconds: number,
  floor: number = SHORTEN_MIN_REMAINING_SECONDS,
): ShortenResult {
  const current = Math.max(0, remainingSeconds)
  const halved = current / 2
  // Clamp to the floor but never above what's actually left on the clock:
  // a sub-floor tap would otherwise *add* time to the block.
  const newRemainingSeconds = Math.min(current, Math.max(floor, halved))
  const delta = current - newRemainingSeconds
  const newDurationSeconds = Math.max(0, activeDurationSeconds - delta)
  return { newRemainingSeconds, newDurationSeconds }
}
