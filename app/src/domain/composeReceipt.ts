/**
 * M002.1 U7 — behavioral-consistency weekly receipt (R6, R8; KTD3).
 *
 * A calm, frozen-on-close weekly read: how many eligible sessions the
 * just-completed local week held, plus the per-focus felt-difficulty
 * bands (U6). Pure domain: no Dexie, no React. Consumes the SAME
 * `eligibleTrainingSessions` helper as the staleness backlog (KTD10) so
 * the receipt's session count can never drift from what the plan treats
 * as training.
 *
 * Anti-guilt framing (F5): below a minimum history the receipt shows a
 * plain absolute count with no comparison. Above it, the read is a
 * neutral band — `steady` (covers in-range AND quiet weeks; never a
 * deficit/down-direction) or `strong` (a positive call-out for a week
 * notably ahead of the user's own rhythm). "Below your usual" is never
 * rendered — that is a personalized quota and is forbidden.
 *
 * Frozen-on-close + local boundary (F10): the headline reflects the
 * last *completed* local week, not a live current-week number, and week
 * boundaries are computed in local time (Monday start), not raw UTC.
 */
import type { SessionReview } from '../model'
import { eligibleTrainingSessions, type ScopedFocus } from './eligibleSessions'
import { feltDifficultyProxy, type FeltDifficultyBand } from './feltDifficultyProxy'

/** Prior weeks-with-data required before a rhythm comparison is shown. */
const MIN_PRIOR_WEEKS = 2
/** How many prior weeks of rhythm to average. */
const LOOKBACK_WEEKS = 4
/** Rolling window (in weeks) the felt-difficulty proxy reads over. */
const PROXY_WINDOW_WEEKS = 4

export type ConsistencyRead =
  | { kind: 'absolute'; count: number }
  | { kind: 'banded'; count: number; band: 'steady' | 'strong' }

export interface ReceiptOutput {
  /** Behavioral headline for the last completed local week. */
  consistency: ConsistencyRead
  /** Per-focus felt-difficulty bands over the rolling proxy window (U6). */
  feltDifficulty: Record<ScopedFocus, FeltDifficultyBand>
  /** Bounded ≤45-word calm copy for the behavioral headline. */
  headline: string
}

/** Local-time start-of-week (Monday 00:00) for the week containing `ts`.
 * Exported for tests so they can place sessions on real week boundaries
 * rather than guessing the weekday of a fixed `now`. */
export function startOfLocalWeek(ts: number): number {
  const d = new Date(ts)
  d.setHours(0, 0, 0, 0)
  const daysSinceMonday = (d.getDay() + 6) % 7
  d.setDate(d.getDate() - daysSinceMonday)
  return d.getTime()
}

/** Step back one local week from a week-start, DST-safe. */
function previousWeekStart(weekStart: number): number {
  return startOfLocalWeek(weekStart - 1)
}

function countInRange(reviews: readonly SessionReview[], start: number, end: number): number {
  return reviews.filter((r) => r.submittedAt >= start && r.submittedAt < end).length
}

function consistencyCopy(read: ConsistencyRead): string {
  const noun = read.count === 1 ? 'session' : 'sessions'
  if (read.kind === 'absolute') return `${read.count} ${noun} logged so far.`
  if (read.band === 'strong') return `${read.count} ${noun} this week, ahead of your rhythm.`
  return `${read.count} ${noun} this week.`
}

export function composeReceipt(reviews: readonly SessionReview[], now: number): ReceiptOutput {
  const eligible = eligibleTrainingSessions(reviews)

  // Frozen-on-close: headline is the last COMPLETED local week.
  const currentWeekStart = startOfLocalWeek(now)
  const closedWeekStart = previousWeekStart(currentWeekStart)
  const closedWeekEnd = currentWeekStart
  const weekCount = countInRange(eligible, closedWeekStart, closedWeekEnd)

  // Rhythm: mean count over prior weeks-with-data within the lookback.
  const priorCounts: number[] = []
  let cursor = closedWeekStart
  for (let i = 0; i < LOOKBACK_WEEKS; i += 1) {
    const start = previousWeekStart(cursor)
    const count = countInRange(eligible, start, cursor)
    if (count > 0) priorCounts.push(count)
    cursor = start
  }

  let consistency: ConsistencyRead
  if (priorCounts.length < MIN_PRIOR_WEEKS) {
    consistency = { kind: 'absolute', count: weekCount }
  } else {
    const typical = priorCounts.reduce((a, b) => a + b, 0) / priorCounts.length
    // `strong` only when clearly ahead; everything else is neutral
    // `steady` (never a deficit direction).
    const band = weekCount > Math.ceil(typical) ? 'strong' : 'steady'
    consistency = { kind: 'banded', count: weekCount, band }
  }

  // Felt-difficulty proxy over the rolling multi-week window.
  let proxyWindowStart = closedWeekEnd
  for (let i = 0; i < PROXY_WINDOW_WEEKS; i += 1) {
    proxyWindowStart = previousWeekStart(proxyWindowStart)
  }
  const windowCaptures = eligible
    .filter((r) => r.submittedAt >= proxyWindowStart && r.submittedAt < closedWeekEnd)
    .flatMap((r) => r.perDrillCaptures ?? [])

  return {
    consistency,
    feltDifficulty: feltDifficultyProxy(windowCaptures),
    headline: consistencyCopy(consistency),
  }
}
