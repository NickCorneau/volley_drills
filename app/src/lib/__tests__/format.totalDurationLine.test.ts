import { describe, expect, it } from 'vitest'
import { formatTotalDurationLine } from '../format'

/**
 * 2026-04-27 reconciled-list `R13` (Settings investment footer): pin the
 * formatter behavior so the Settings footer total stays consistent across
 * releases.
 *
 * 2026-05-25 (plan A2 of `docs/plans/2026-05-25-005-polish-design-critique-
 * residuals-plan.md`, `D145`): updated from the earlier `"H:MM"` clock
 * shape to the `"N min"` / `"K h"` / `"K h M min"` human duration shape per
 * `brand-ux-guidelines.md` §3.5. The investment-footer total is a
 * *historical cumulative* read, not a countdown, so it should use the
 * canonical `min` / `h` unit voice the rest of the app uses (e.g. the
 * `Solo + Net · 15 min` meta line) — not the `formatTime()` countdown
 * voice.
 */

describe('formatTotalDurationLine', () => {
  it('renders zero as "0 min"', () => {
    expect(formatTotalDurationLine(0)).toBe('0 min')
  })

  it('renders sub-hour minutes as "N min"', () => {
    expect(formatTotalDurationLine(1)).toBe('1 min')
    expect(formatTotalDurationLine(7)).toBe('7 min')
    expect(formatTotalDurationLine(11)).toBe('11 min')
    expect(formatTotalDurationLine(15)).toBe('15 min')
    expect(formatTotalDurationLine(59)).toBe('59 min')
  })

  it('renders exact hours as "K h" (no trailing 0 min)', () => {
    expect(formatTotalDurationLine(60)).toBe('1 h')
    expect(formatTotalDurationLine(120)).toBe('2 h')
    expect(formatTotalDurationLine(600)).toBe('10 h')
  })

  it('renders past-the-hour totals as "K h M min"', () => {
    expect(formatTotalDurationLine(75)).toBe('1 h 15 min')
    expect(formatTotalDurationLine(91)).toBe('1 h 31 min')
    expect(formatTotalDurationLine(605)).toBe('10 h 5 min')
    expect(formatTotalDurationLine(750)).toBe('12 h 30 min')
  })

  // Defensive: callers shouldn't pass these, but the formatter must
  // not throw / produce `NaN` / `-1 min` if they do. Tally math already
  // clamps via Math.max, but pinning the contract here keeps the
  // formatter safe to reuse from any future caller.
  it('clamps negative inputs to "0 min"', () => {
    expect(formatTotalDurationLine(-5)).toBe('0 min')
    expect(formatTotalDurationLine(-1)).toBe('0 min')
  })

  it('floors fractional inputs', () => {
    expect(formatTotalDurationLine(60.9)).toBe('1 h')
    expect(formatTotalDurationLine(0.5)).toBe('0 min')
    expect(formatTotalDurationLine(75.4)).toBe('1 h 15 min')
  })
})
