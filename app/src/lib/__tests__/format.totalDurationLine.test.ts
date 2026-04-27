import { describe, expect, it } from 'vitest'
import { formatTotalDurationLine } from '../format'

/**
 * 2026-04-27 reconciled-list `R13` (Settings investment footer):
 * pin the `H:MM` formatter behavior so the Settings footer total
 * stays consistent across releases. The format mirrors the
 * `formatTime()` minute:second shape (zero-padded right side, plain
 * left side) because the app already uses that visual rhythm
 * elsewhere — the footer line should read as another `:`-separated
 * time stamp, not a different format.
 */

describe('formatTotalDurationLine', () => {
  it('renders zero as 0:00', () => {
    expect(formatTotalDurationLine(0)).toBe('0:00')
  })

  it('zero-pads single-digit minutes under an hour', () => {
    expect(formatTotalDurationLine(1)).toBe('0:01')
    expect(formatTotalDurationLine(7)).toBe('0:07')
    expect(formatTotalDurationLine(11)).toBe('0:11')
  })

  it('renders 59 minutes without an hour', () => {
    expect(formatTotalDurationLine(59)).toBe('0:59')
  })

  it('renders an exact hour as H:00', () => {
    expect(formatTotalDurationLine(60)).toBe('1:00')
    expect(formatTotalDurationLine(120)).toBe('2:00')
  })

  it('renders sub-hour minutes after the hour boundary', () => {
    expect(formatTotalDurationLine(75)).toBe('1:15')
    expect(formatTotalDurationLine(91)).toBe('1:31')
  })

  it('does NOT pad the hours digit (left side stays plain)', () => {
    expect(formatTotalDurationLine(750)).toBe('12:30')
    expect(formatTotalDurationLine(605)).toBe('10:05')
  })

  // Defensive: callers shouldn't pass these, but the formatter must
  // not throw / produce `NaN:NaN` or `-1:??` if they do. Tally math
  // already clamps via Math.max, but pinning the contract here keeps
  // the formatter safe to reuse from any future caller.
  it('clamps negative inputs to 0:00', () => {
    expect(formatTotalDurationLine(-5)).toBe('0:00')
    expect(formatTotalDurationLine(-1)).toBe('0:00')
  })

  it('floors fractional inputs', () => {
    expect(formatTotalDurationLine(60.9)).toBe('1:00')
    expect(formatTotalDurationLine(0.5)).toBe('0:00')
  })
})
