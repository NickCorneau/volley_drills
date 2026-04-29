import { describe, expect, it } from 'vitest'
import {
  buildPerDrillCaptureRecord,
  type BuildPerDrillCaptureInput,
  validateStreakLongest,
} from '../buildPerDrillCapture'

/**
 * D134 (2026-04-28): pin the pure-domain builders that are the only
 * sanctioned constructors of a `PerDrillCapture` row. The row union's
 * mutual-exclusion guarantees (no count + metricCapture, no
 * notCaptured + metricCapture) live here.
 */

const IDENTITY = {
  drillId: 'd38',
  variantId: 'd38-pair',
  blockIndex: 2,
  difficulty: 'still_learning' as const,
  capturedAt: 1_000,
}

describe('validateStreakLongest', () => {
  it('accepts whole numbers in [0, 99]', () => {
    expect(validateStreakLongest(0)).toBe(0)
    expect(validateStreakLongest(7)).toBe(7)
    expect(validateStreakLongest(99)).toBe(99)
  })

  it('rejects negative integers', () => {
    expect(validateStreakLongest(-1)).toBeNull()
    expect(validateStreakLongest(-100)).toBeNull()
  })

  it('rejects out-of-range positive integers', () => {
    expect(validateStreakLongest(100)).toBeNull()
    expect(validateStreakLongest(1_000_000)).toBeNull()
  })

  it('rejects non-integers', () => {
    expect(validateStreakLongest(1.5)).toBeNull()
    expect(validateStreakLongest(0.0001)).toBeNull()
    expect(validateStreakLongest(-0.5)).toBeNull()
  })

  it('rejects NaN and Infinity', () => {
    expect(validateStreakLongest(Number.NaN)).toBeNull()
    expect(validateStreakLongest(Number.POSITIVE_INFINITY)).toBeNull()
    expect(validateStreakLongest(Number.NEGATIVE_INFINITY)).toBeNull()
  })

  it('rejects non-number inputs', () => {
    expect(validateStreakLongest('7')).toBeNull()
    expect(validateStreakLongest(null)).toBeNull()
    expect(validateStreakLongest(undefined)).toBeNull()
    expect(validateStreakLongest({})).toBeNull()
    expect(validateStreakLongest(true)).toBeNull()
  })
})

describe('buildPerDrillCaptureRecord — count row', () => {
  it('produces a row with goodPasses + attemptCount and no metricCapture', () => {
    const row = buildPerDrillCaptureRecord({
      ...IDENTITY,
      kind: 'count',
      goodPasses: 7,
      attemptCount: 12,
    })
    expect(row.goodPasses).toBe(7)
    expect(row.attemptCount).toBe(12)
    expect(row.metricCapture).toBeUndefined()
    expect(row.notCaptured).toBeUndefined()
  })

  it('persists 0 / 0 as an explicit count row (user said "tried but missed all")', () => {
    const row = buildPerDrillCaptureRecord({
      ...IDENTITY,
      kind: 'count',
      goodPasses: 0,
      attemptCount: 0,
    })
    expect(row.goodPasses).toBe(0)
    expect(row.attemptCount).toBe(0)
  })
})

describe('buildPerDrillCaptureRecord — streak row', () => {
  it('produces a row with metricCapture and no count fields', () => {
    const row = buildPerDrillCaptureRecord({
      ...IDENTITY,
      kind: 'streak',
      streakLongest: 7,
    })
    expect(row.metricCapture).toEqual({ kind: 'streak', longest: 7 })
    expect(row.goodPasses).toBeUndefined()
    expect(row.attemptCount).toBeUndefined()
    expect(row.notCaptured).toBeUndefined()
  })

  it('accepts the boundary values 0 and 99', () => {
    const zero = buildPerDrillCaptureRecord({
      ...IDENTITY,
      kind: 'streak',
      streakLongest: 0,
    })
    expect(zero.metricCapture).toEqual({ kind: 'streak', longest: 0 })

    const top = buildPerDrillCaptureRecord({
      ...IDENTITY,
      kind: 'streak',
      streakLongest: 99,
    })
    expect(top.metricCapture).toEqual({ kind: 'streak', longest: 99 })
  })

  it('collapses to a difficulty-only row when streakLongest is invalid (defense in depth)', () => {
    const row = buildPerDrillCaptureRecord({
      ...IDENTITY,
      kind: 'streak',
      streakLongest: -1,
    })
    expect(row.metricCapture).toBeUndefined()
    expect(row.goodPasses).toBeUndefined()
    expect(row.notCaptured).toBeUndefined()
    expect(row.difficulty).toBe('still_learning')
  })

  it('collapses to a difficulty-only row when streakLongest is non-integer', () => {
    const row = buildPerDrillCaptureRecord({
      ...IDENTITY,
      kind: 'streak',
      streakLongest: 1.5,
    })
    expect(row.metricCapture).toBeUndefined()
  })
})

describe('buildPerDrillCaptureRecord — difficulty_only row', () => {
  it('produces a row with no count, no streak, no notCaptured', () => {
    const row = buildPerDrillCaptureRecord({
      ...IDENTITY,
      kind: 'difficulty_only',
    })
    expect(row.goodPasses).toBeUndefined()
    expect(row.attemptCount).toBeUndefined()
    expect(row.metricCapture).toBeUndefined()
    expect(row.notCaptured).toBeUndefined()
    expect(row.difficulty).toBe('still_learning')
  })
})

describe('buildPerDrillCaptureRecord — not_captured row', () => {
  it('produces a row with notCaptured: true and no other payload', () => {
    const row = buildPerDrillCaptureRecord({
      ...IDENTITY,
      kind: 'not_captured',
    })
    expect(row.notCaptured).toBe(true)
    expect(row.goodPasses).toBeUndefined()
    expect(row.attemptCount).toBeUndefined()
    expect(row.metricCapture).toBeUndefined()
  })
})

describe('buildPerDrillCaptureRecord — identity passthrough', () => {
  it('threads drillId, variantId, blockIndex, difficulty, capturedAt onto every shape', () => {
    const shapes: BuildPerDrillCaptureInput[] = [
      { ...IDENTITY, kind: 'difficulty_only' },
      { ...IDENTITY, kind: 'count', goodPasses: 5, attemptCount: 8 },
      { ...IDENTITY, kind: 'streak', streakLongest: 3 },
      { ...IDENTITY, kind: 'not_captured' },
    ]
    for (const shape of shapes) {
      const row = buildPerDrillCaptureRecord(shape)
      expect(row.drillId).toBe(IDENTITY.drillId)
      expect(row.variantId).toBe(IDENTITY.variantId)
      expect(row.blockIndex).toBe(IDENTITY.blockIndex)
      expect(row.difficulty).toBe(IDENTITY.difficulty)
      expect(row.capturedAt).toBe(IDENTITY.capturedAt)
    }
  })
})

describe('buildPerDrillCaptureRecord — type-level mutual exclusion', () => {
  /**
   * The TS union forces callers to pick one shape per call. These
   * runtime tests pin the *behavior* that no two arms produce the
   * same row.
   */
  it('count and streak shapes never overlap on the same row', () => {
    const count = buildPerDrillCaptureRecord({
      ...IDENTITY,
      kind: 'count',
      goodPasses: 3,
      attemptCount: 4,
    })
    const streak = buildPerDrillCaptureRecord({
      ...IDENTITY,
      kind: 'streak',
      streakLongest: 5,
    })
    expect(count.metricCapture).toBeUndefined()
    expect(streak.goodPasses).toBeUndefined()
    expect(streak.attemptCount).toBeUndefined()
  })

  it('not_captured row never carries a metricCapture or count fields', () => {
    const row = buildPerDrillCaptureRecord({ ...IDENTITY, kind: 'not_captured' })
    expect(row.notCaptured).toBe(true)
    expect(row.metricCapture).toBeUndefined()
    expect(row.goodPasses).toBeUndefined()
    expect(row.attemptCount).toBeUndefined()
  })
})
