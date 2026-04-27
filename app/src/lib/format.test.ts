import { describe, expect, it } from 'vitest'
import { formatDayName, formatPassRateLine } from './format'

describe('formatPassRateLine (V0B-13)', () => {
  it('returns "72% (18 of 25)" for a normal rate', () => {
    expect(formatPassRateLine(18, 25)).toBe('72% (18 of 25)')
  })

  it('returns "0% (0 of 10)" when nothing was a good pass', () => {
    expect(formatPassRateLine(0, 10)).toBe('0% (0 of 10)')
  })

  it('rounds half-up via Math.round', () => {
    // 2/3 = 66.666... → 67 per Math.round
    expect(formatPassRateLine(2, 3)).toBe('67% (2 of 3)')
  })

  it('returns a hyphen sentinel when total is 0 (no NaN, no "0%")', () => {
    expect(formatPassRateLine(0, 0)).toBe('-')
  })

  it('returns a hyphen sentinel when total is negative (defensive)', () => {
    expect(formatPassRateLine(0, -1)).toBe('-')
  })
})

describe('formatDayName (C-5 Unit 1)', () => {
  // Anchor to a known mid-week local date so the expected weekday name
  // is deterministic regardless of the CI host's current calendar
  // day. 2026-04-17 is a Friday in UTC *and* in US/PT local, so the
  // arithmetic below is safe across the common CI timezones.
  const FRIDAY_2026_04_17_NOON_LOCAL = new Date(
    2026,
    3, // April (0-indexed)
    17,
    12,
    0,
    0,
  ).getTime()
  const ONE_DAY_MS = 24 * 60 * 60 * 1000

  it('returns "Today" for the same calendar date', () => {
    expect(formatDayName(FRIDAY_2026_04_17_NOON_LOCAL, FRIDAY_2026_04_17_NOON_LOCAL)).toBe('Today')
  })

  it('returns "Today" even if the timestamp is earlier in the same calendar day', () => {
    const earlierToday = FRIDAY_2026_04_17_NOON_LOCAL - 10 * 60 * 60 * 1000 // 2 am
    expect(formatDayName(earlierToday, FRIDAY_2026_04_17_NOON_LOCAL)).toBe('Today')
  })

  it('returns "Yesterday" for the previous calendar date', () => {
    const thursdayNoon = FRIDAY_2026_04_17_NOON_LOCAL - ONE_DAY_MS
    expect(formatDayName(thursdayNoon, FRIDAY_2026_04_17_NOON_LOCAL)).toBe('Yesterday')
  })

  it('returns the weekday name for 3 days ago (within the last 7)', () => {
    const tuesdayNoon = FRIDAY_2026_04_17_NOON_LOCAL - 3 * ONE_DAY_MS
    // Tuesday when the reference is Friday.
    expect(formatDayName(tuesdayNoon, FRIDAY_2026_04_17_NOON_LOCAL)).toBe('Tuesday')
  })

  it('returns the weekday name for 6 days ago (within the last 7)', () => {
    const saturdayPriorNoon = FRIDAY_2026_04_17_NOON_LOCAL - 6 * ONE_DAY_MS
    expect(formatDayName(saturdayPriorNoon, FRIDAY_2026_04_17_NOON_LOCAL)).toBe('Saturday')
  })

  it('falls back to a short date for anything older than 7 days', () => {
    const tenDaysAgo = FRIDAY_2026_04_17_NOON_LOCAL - 10 * ONE_DAY_MS
    const result = formatDayName(tenDaysAgo, FRIDAY_2026_04_17_NOON_LOCAL)
    // Deliberately loose: Intl output varies slightly by locale; assert
    // that it's neither "Today"/"Yesterday" nor a weekday name.
    expect(result).not.toMatch(
      /^(Today|Yesterday|Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday)$/,
    )
    // Should at least contain a month token (short or long).
    expect(result).toMatch(/[A-Za-z]+/)
  })

  it('handles near-midnight boundaries in local time correctly', () => {
    const fridayJustAfterMidnight = new Date(2026, 3, 17, 0, 5, 0, 0).getTime()
    const thursdayJustBeforeMidnight = new Date(2026, 3, 16, 23, 55, 0, 0).getTime()
    // Across midnight in local time these are different calendar days,
    // so the 10-minute-older timestamp reads as "Yesterday".
    expect(formatDayName(thursdayJustBeforeMidnight, fridayJustAfterMidnight)).toBe('Yesterday')
  })
})
