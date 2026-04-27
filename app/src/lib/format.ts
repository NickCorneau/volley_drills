import type { ExecutionLog, ExecutionStatus } from '../db'
import type { BlockSlotType } from '../types/session'

export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

export function formatDuration(minutes: number): string {
  return minutes === 1 ? '1 min' : `${minutes} min`
}

/**
 * 2026-04-27 reconciled-list `R13` (Settings investment footer): render
 * a non-negative minute count as `"H:MM"`, where minutes are zero-padded
 * and hours are not. Matches the `formatTime()` minutes:seconds shape so
 * the app's two `:`-separated time formats read consistently.
 *
 * Examples: 0 -> `"0:00"`, 11 -> `"0:11"`, 60 -> `"1:00"`, 750 -> `"12:30"`.
 *
 * Negative inputs clamp to 0 (defensive for any caller that subtracts
 * timestamps without a `Math.max` guard); non-integer inputs are rounded
 * down (the per-session minute math in `formatDurationLine` already
 * rounds, so the upstream sum is integer-valued in practice).
 */
export function formatTotalDurationLine(totalMinutes: number): string {
  const safe = Math.max(0, Math.floor(totalMinutes))
  const hours = Math.floor(safe / 60)
  const mins = safe % 60
  return `${hours}:${mins.toString().padStart(2, '0')}`
}

/** Sentinel rendered when a duration can't be computed (no completedAt /
 *  pausedAt). A plain hyphen over the em-dash per 2026-04-17 copy pass. */
const NO_VALUE = '-'

export function formatDurationLine(log: ExecutionLog): string {
  const end = log.completedAt ?? log.pausedAt
  if (!end) return NO_VALUE
  const mins = Math.max(1, Math.round((end - log.startedAt) / 60000))
  return `${mins} min`
}

export function formatInterruptedAgo(interruptedAt: number): string {
  const ms = Date.now() - interruptedAt
  const s = Math.floor(ms / 1000)
  if (s < 45) return 'just now'
  const m = Math.floor(s / 60)
  if (m < 60) return m === 1 ? 'about 1 min ago' : `about ${m} min ago`
  const h = Math.floor(m / 60)
  return h === 1 ? 'about 1 hr ago' : `about ${h} hr ago`
}

export function statusLabel(status: ExecutionStatus): string {
  switch (status) {
    case 'completed':
      return 'Complete'
    case 'ended_early':
      return 'Ended early'
    case 'in_progress':
      return 'In progress'
    case 'not_started':
      return 'Not started'
    case 'paused':
      return 'Paused'
    default: {
      const _exhaustive: never = status
      return _exhaustive
    }
  }
}

/**
 * V0B-13: every pass-rate display shows `N` alongside `%`. Returns
 * `"72% (18 of 25)"` for a normal rate, `"-"` (plain hyphen sentinel)
 * for a zero-attempt review. Used on CompleteScreen (C-2) and the
 * LastComplete card (C-5). Hyphen chosen over em-dash per 2026-04-17
 * copy pass.
 */
export function formatPassRateLine(good: number, total: number): string {
  if (total <= 0) return NO_VALUE
  const pct = Math.round((good / total) * 100)
  return `${pct}% (${good} of ${total})`
}

/**
 * 2026-04-27 pre-D91 editorial polish (plan Item 8): compose the
 * Complete-recap "Difficulty" row from a per-drill tag breakdown.
 *
 * The user taps a difficulty chip on the new `/run/check` screen after
 * each main-skill / pressure block; today those taps are persisted into
 * `perDrillCaptures[].difficulty` and consumed only by the adaptation
 * engine. Without a recap row the user-visible flow swallows the input
 * and the chip taps feel like data extraction. This formatter closes
 * the loop with one quiet line.
 *
 * Rendering rules:
 *   - Returns `null` when no chips were tapped (`drillsTagged === 0`);
 *     the consumer hides the row entirely. Pre-Tier-1b sessions and
 *     legacy reviews fall through this path unchanged.
 *   - Collapses to `"All <bucket>"` (e.g. `"All still learning"`) when
 *     every tapped chip went to the same bucket. Reads as a single
 *     courtside read instead of a numbered tally for the very common
 *     "I tapped the same chip on every drill" pattern.
 *   - Otherwise emits a dot-separated tally, omitting zero buckets and
 *     ordering by tag severity (`too_hard` first, then `still_learning`,
 *     then `too_easy`) so an at-a-glance scan surfaces the most
 *     actionable signal first. Example: `"2 too hard · 1 still learning"`.
 *
 * The tag labels here intentionally mirror the chip vocabulary used on
 * `PerDrillCapture` (`Too hard / Still learning / Too easy`); lowercase
 * because the recap line is sentence-case prose, not a chip label.
 */
type TagBreakdown = {
  too_hard: number
  still_learning: number
  too_easy: number
}

const DIFFICULTY_LINE_ORDER: ReadonlyArray<{
  key: keyof TagBreakdown
  singular: string
}> = [
  { key: 'too_hard', singular: 'too hard' },
  { key: 'still_learning', singular: 'still learning' },
  { key: 'too_easy', singular: 'too easy' },
]

export function formatDifficultyBreakdownLine(breakdown: TagBreakdown): string | null {
  const total = breakdown.too_hard + breakdown.still_learning + breakdown.too_easy
  if (total === 0) return null

  // Single-bucket collapse: when every tap landed on one chip, "All X"
  // reads as a single observation rather than a tally. Falls back to
  // the dot-separated form for any mixed distribution.
  for (const { key, singular } of DIFFICULTY_LINE_ORDER) {
    if (breakdown[key] === total) {
      return `All ${singular}`
    }
  }

  // Mixed: dot-separated, omit zeros, ordered by severity. Uses a
  // middle-dot ("·") rather than a comma to match the existing
  // multi-fact pattern in the recap card and to read as a glanceable
  // visual rhythm at courtside type sizes.
  const parts: string[] = []
  for (const { key, singular } of DIFFICULTY_LINE_ORDER) {
    const count = breakdown[key]
    if (count === 0) continue
    parts.push(`${count} ${singular}`)
  }
  return parts.join(' · ')
}

/**
 * C-5 Unit 1: human day name for the stale-context banner ("Setup
 * pre-filled from {dayName}"). Uses the host's LOCAL timezone because
 * calendar boundaries matter more than UTC windows for "Today" /
 * "Yesterday" copy. Falls back to a short date for anything older than
 * 6 calendar days (unreachable in the 14-day D91 window per H11 / C15
 * age cut, but defensive).
 *
 * The `now` parameter is explicit for testability (`Date.now()` is a
 * side-effecting read; injecting it keeps the function pure).
 */
export function formatDayName(timestamp: number, now: number = Date.now()): string {
  const startOfLocalDay = (ms: number): number => {
    const d = new Date(ms)
    d.setHours(0, 0, 0, 0)
    return d.getTime()
  }
  const MS_PER_DAY = 24 * 60 * 60 * 1000
  const daysDiff = Math.round((startOfLocalDay(now) - startOfLocalDay(timestamp)) / MS_PER_DAY)
  if (daysDiff === 0) return 'Today'
  if (daysDiff === 1) return 'Yesterday'
  if (daysDiff >= 2 && daysDiff <= 6) {
    return new Intl.DateTimeFormat(undefined, { weekday: 'long' }).format(new Date(timestamp))
  }
  // Older than a week: short month + day. "Apr 9" on en-US; locales may
  // render differently but the output stays concise.
  return new Intl.DateTimeFormat(undefined, {
    month: 'short',
    day: 'numeric',
  }).format(new Date(timestamp))
}

export function effortLabel(rpe: number | null): string {
  // V0B-31 / D120: `null` appears on expired-deferral and skipped-review
  // stubs; the session summary should read that state as "not captured"
  // rather than invent an easy/moderate/hard label.
  if (rpe == null) return NO_VALUE
  if (rpe < 4) return 'Easy'
  if (rpe < 7) return 'Moderate'
  if (rpe < 10) return 'Hard'
  return 'Max'
}

export function phaseLabel(type: BlockSlotType): string {
  // Phase F8 (2026-04-19): sentence-case in source. Pre-F8 these were
  // all-caps literals paired with a CSS `uppercase tracking-wider`
  // class on the RunScreen phase pill - classic dashboard-eyebrow
  // voice the typography audit flagged as off-thesis for the calm,
  // shibui-leaning direction. Case is the source of truth now; the
  // pill drops its `uppercase` utility in the same pass. See
  // `docs/plans/2026-04-19-feat-phase-f8-typography-foundation-plan.md`.
  switch (type) {
    case 'warmup':
      return 'Warm up'
    case 'wrap':
      return 'Downshift'
    case 'technique':
    case 'movement_proxy':
    case 'main_skill':
    case 'pressure':
      return 'Work'
    default: {
      const _exhaustive: never = type
      return _exhaustive
    }
  }
}
