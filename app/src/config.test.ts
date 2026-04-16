import { describe, it, expect } from 'vitest'
import {
  PREROLL_SECONDS,
  PREROLL_TICK_MS,
  TIMER_FLUSH_INTERVAL_MS,
  SHORTEN_MIN_SECONDS,
  VIBRATE_TICK,
  VIBRATE_BLOCK_COMPLETE,
} from './config'

describe('config constants', () => {
  it('preroll is a positive integer', () => {
    expect(PREROLL_SECONDS).toBeGreaterThan(0)
    expect(Number.isInteger(PREROLL_SECONDS)).toBe(true)
  })

  it('tick interval is 1 second', () => {
    expect(PREROLL_TICK_MS).toBe(1000)
  })

  it('flush interval is reasonable', () => {
    expect(TIMER_FLUSH_INTERVAL_MS).toBeGreaterThanOrEqual(1000)
    expect(TIMER_FLUSH_INTERVAL_MS).toBeLessThanOrEqual(30000)
  })

  it('shorten minimum is positive', () => {
    expect(SHORTEN_MIN_SECONDS).toBeGreaterThan(0)
  })

  it('vibrate patterns are valid', () => {
    expect(VIBRATE_TICK).toBeGreaterThan(0)
    expect(VIBRATE_BLOCK_COMPLETE.length).toBeGreaterThan(0)
    expect(VIBRATE_BLOCK_COMPLETE.every((v) => v > 0)).toBe(true)
  })
})
