import { describe, expect, it } from 'vitest'
import { computeShortened, SHORTEN_MIN_REMAINING_SECONDS } from './shorten'

describe('computeShortened (red-team bug #2)', () => {
  it('halves a comfortable mid-block remaining', () => {
    // 10-minute block, 5 minutes remaining -> shorten to 2m30s remaining,
    // total 7m30s.
    const r = computeShortened(600, 300)
    expect(r.newRemainingSeconds).toBe(150)
    expect(r.newDurationSeconds).toBe(450)
  })

  it('clamps at the 10 s floor when halving would undercut it', () => {
    // 10-minute block, 15 s remaining. Halved = 7.5, floored to 10, but 10
    // is still <= current 15, so we accept it.
    const r = computeShortened(600, 15)
    expect(r.newRemainingSeconds).toBe(10)
    // Total trimmed by (15 - 10) = 5 s.
    expect(r.newDurationSeconds).toBe(595)
  })

  it('never extends the block when remaining is below the floor', () => {
    // 5 s remaining, floor is 10 -> the old code returned 10 here and
    // silently *added* 5 s to the total. Guard: newRemaining must stay
    // <= current remaining, so this becomes a no-op shorten.
    const r = computeShortened(600, 5)
    expect(r.newRemainingSeconds).toBe(5)
    expect(r.newDurationSeconds).toBe(600)
  })

  it('never extends the block at exactly the floor', () => {
    const r = computeShortened(600, SHORTEN_MIN_REMAINING_SECONDS)
    expect(r.newRemainingSeconds).toBe(SHORTEN_MIN_REMAINING_SECONDS)
    expect(r.newDurationSeconds).toBe(600)
  })

  it('treats a negative remaining as zero', () => {
    const r = computeShortened(600, -5)
    expect(r.newRemainingSeconds).toBe(0)
    expect(r.newDurationSeconds).toBe(600)
  })

  it('preserves the invariant on back-to-back shortens', () => {
    // Tap Shorten twice from a 10 min block paused at 5 min remaining.
    const first = computeShortened(600, 300)
    const second = computeShortened(first.newDurationSeconds, first.newRemainingSeconds)
    // 150 -> 75 remaining, total trimmed another 75 s.
    expect(second.newRemainingSeconds).toBe(75)
    expect(second.newDurationSeconds).toBe(375)
    // Invariant: elapsed stays constant across shorten.
    const elapsedBefore = 600 - 300
    const elapsedAfterSecond = second.newDurationSeconds - second.newRemainingSeconds
    expect(elapsedAfterSecond).toBe(elapsedBefore)
  })
})
