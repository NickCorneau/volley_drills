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
  const daysDiff = Math.round(
    (startOfLocalDay(now) - startOfLocalDay(timestamp)) / MS_PER_DAY,
  )
  if (daysDiff === 0) return 'Today'
  if (daysDiff === 1) return 'Yesterday'
  if (daysDiff >= 2 && daysDiff <= 6) {
    return new Intl.DateTimeFormat(undefined, { weekday: 'long' }).format(
      new Date(timestamp),
    )
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
  switch (type) {
    case 'warmup':
      return 'WARM UP'
    case 'wrap':
      return 'DOWNSHIFT'
    case 'technique':
    case 'movement_proxy':
    case 'main_skill':
    case 'pressure':
      return 'WORK'
    default: {
      const _exhaustive: never = type
      return _exhaustive
    }
  }
}
