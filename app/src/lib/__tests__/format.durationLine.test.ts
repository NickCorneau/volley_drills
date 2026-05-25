import { describe, expect, it } from 'vitest'
import type { ExecutionLog } from '../../model'
import { formatDurationLine, sessionDurationMinutes } from '../format'

/**
 * `formatDurationLine` / `sessionDurationMinutes` report *active* training
 * time, not the wall-clock start→end span. The active value is the
 * `actualDurationMinutes` the runner records via
 * `computeActualDurationMinutes` (sum of completed block durations + capped
 * active-block elapsed), which is immune to pause / interruption gaps.
 * Wall-clock is only the fallback for legacy records written before the
 * field existed.
 */

function log(overrides: Partial<ExecutionLog>): ExecutionLog {
  return {
    id: 'exec',
    planId: 'plan',
    status: 'completed',
    activeBlockIndex: 0,
    blockStatuses: [],
    startedAt: 0,
    ...overrides,
  }
}

describe('formatDurationLine / sessionDurationMinutes', () => {
  it('prefers actualDurationMinutes over the wall-clock span', () => {
    const now = Date.now()
    // Started 12 h ago, completed now (interrupted then resumed later):
    // wall-clock ≈ 720 min, but only 15 min were actually trained.
    const l = log({
      startedAt: now - 12 * 60 * 60_000,
      completedAt: now,
      actualDurationMinutes: 15,
    })
    expect(sessionDurationMinutes(l)).toBe(15)
    expect(formatDurationLine(l)).toBe('15 min')
  })

  it('rounds a float actualDurationMinutes to the nearest whole minute', () => {
    expect(formatDurationLine(log({ completedAt: 60_000, actualDurationMinutes: 22.5 }))).toBe(
      '23 min',
    )
    expect(formatDurationLine(log({ completedAt: 60_000, actualDurationMinutes: 8.4 }))).toBe(
      '8 min',
    )
  })

  it('applies a 1-min floor to a tiny non-zero actual duration', () => {
    expect(formatDurationLine(log({ completedAt: 60_000, actualDurationMinutes: 0.2 }))).toBe(
      '1 min',
    )
  })

  it('falls back to the wall-clock span for legacy records without actualDurationMinutes', () => {
    // 15 min start→completed span, no actualDurationMinutes field.
    expect(formatDurationLine(log({ startedAt: 0, completedAt: 15 * 60_000 }))).toBe('15 min')
  })

  it('falls back to pausedAt when there is no completedAt (legacy record)', () => {
    expect(formatDurationLine(log({ status: 'paused', startedAt: 0, pausedAt: 5 * 60_000 }))).toBe(
      '5 min',
    )
  })

  it('returns the sentinel when neither a stored duration nor an end timestamp exists', () => {
    expect(sessionDurationMinutes(log({ status: 'in_progress', startedAt: 0 }))).toBeNull()
    expect(formatDurationLine(log({ status: 'in_progress', startedAt: 0 }))).toBe('-')
  })
})
