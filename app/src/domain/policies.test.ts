import { describe, expect, it } from 'vitest'
import {
  CAPTURE_WINDOW_IMMEDIATE_MS,
  CAPTURE_WINDOW_SAME_DAY_MS,
  CAPTURE_WINDOW_SAME_SESSION_MS,
  COUNT_BASED_METRIC_TYPES,
  CUE_COMPACT_MAX,
  FINISH_LATER_CAP_MS,
  TUNING_FLOOR_ATTEMPTS,
} from './policies'

describe('policies', () => {
  it('Finish Later cap is 2 hours and matches same_session bucket upper bound', () => {
    expect(FINISH_LATER_CAP_MS).toBe(2 * 60 * 60 * 1_000)
    expect(CAPTURE_WINDOW_SAME_SESSION_MS).toBe(FINISH_LATER_CAP_MS)
  })

  it('capture window boundaries are strictly ascending', () => {
    expect(CAPTURE_WINDOW_IMMEDIATE_MS).toBeLessThan(
      CAPTURE_WINDOW_SAME_SESSION_MS,
    )
    expect(CAPTURE_WINDOW_SAME_SESSION_MS).toBeLessThan(
      CAPTURE_WINDOW_SAME_DAY_MS,
    )
  })

  it('tuning floor is the attempt threshold below which rate is unstable', () => {
    expect(TUNING_FLOOR_ATTEMPTS).toBeGreaterThan(0)
    expect(Number.isInteger(TUNING_FLOOR_ATTEMPTS)).toBe(true)
  })

  it('compact cue max is a positive character count', () => {
    expect(CUE_COMPACT_MAX).toBeGreaterThan(0)
  })

  it('count-based metric types include the binary pass-rate and rep counters', () => {
    expect(COUNT_BASED_METRIC_TYPES.has('pass-rate-good')).toBe(true)
    expect(COUNT_BASED_METRIC_TYPES.has('reps-successful')).toBe(true)
  })

  it('count-based metric types exclude non-count shapes', () => {
    expect(COUNT_BASED_METRIC_TYPES.has('streak')).toBe(false)
    expect(COUNT_BASED_METRIC_TYPES.has('composite')).toBe(false)
    expect(COUNT_BASED_METRIC_TYPES.has('pass-grade-avg')).toBe(false)
  })
})
