/**
 * Session-grain clock calibration (2026-06-11 session-truth plan, KTD5).
 *
 * Pure fold over already-persisted execution logs joined to their plans
 * (D150: nothing new is written). Each qualifying sample is a CLEAN
 * COMPLETE — terminal `completed` with no skipped tail — so the planned
 * total was fully executed and span ÷ planned is apples-to-apples
 * (wraps and cut-shorts would bias the ratio downward). The per-sample
 * ratio is the clamped wall-clock span (U4 read) over the plan's total
 * minutes; the fold takes the median over a recent window, floors at
 * 1.0 (upward-only — the Shorten control deliberately produces short
 * sessions that would poison downward calibration), clamps at 1.5×,
 * and stays inert below 3 samples.
 *
 * Pure domain: imports only model + sibling domain, mirroring
 * `adaptation/stressPosition.ts`.
 */
import type { ExecutionLog, SessionPlan } from '../../model'
import { clampedSessionSpanMinutes } from '../executionState'
import { hasSkippedBlocks, isTerminalSession } from '../executionPredicates'

/** Calibration is inert (ratio pinned to 1.0) below this many samples. */
export const CALIBRATION_MIN_SAMPLES = 3

/** Upper clamp on the overhead ratio (KTD5). Plan-time default, tunable. */
export const CALIBRATION_RATIO_CLAMP = 1.5

/**
 * Recent-window size: only the most recent N qualifying sessions feed
 * the median, so calibration tracks current reality rather than every
 * session ever recorded. Plan-time default, tunable.
 */
export const CALIBRATION_WINDOW = 10

export interface SessionCalibration {
  /**
   * Effective overhead ratio in [1.0, CALIBRATION_RATIO_CLAMP]. Already
   * floored/clamped and pinned to 1.0 while inert — callers can divide
   * the time-profile budget by it unconditionally.
   */
  readonly overheadRatio: number
  /** Qualifying clean completes inside the window (0..CALIBRATION_WINDOW). */
  readonly sampleCount: number
  /** Echo of CALIBRATION_WINDOW for the founder-export read (KTD9). */
  readonly windowSize: number
}

export const INERT_CALIBRATION: SessionCalibration = {
  overheadRatio: 1,
  sampleCount: 0,
  windowSize: CALIBRATION_WINDOW,
}

function median(sorted: readonly number[]): number {
  const mid = Math.floor(sorted.length / 2)
  return sorted.length % 2 === 1 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2
}

/**
 * Derive the session-grain overhead calibration from persisted records.
 *
 * Deterministic: the same records always fold to the same ratio. The
 * window is selected by terminal recency (`completedAt`), then ratios
 * are sorted for the median.
 */
export function deriveSessionCalibration(
  logs: readonly ExecutionLog[],
  plans: readonly SessionPlan[],
): SessionCalibration {
  const plansById = new Map(plans.map((plan) => [plan.id, plan]))

  const qualifying: { completedAt: number; ratio: number }[] = []
  for (const log of logs) {
    if (log.status !== 'completed') continue
    if (!isTerminalSession(log)) continue
    if (hasSkippedBlocks(log)) continue
    const plan = plansById.get(log.planId)
    if (!plan) continue
    const span = clampedSessionSpanMinutes(log, plan)
    if (span == null) continue
    const plannedTotal = plan.blocks.reduce((sum, block) => sum + block.durationMinutes, 0)
    if (plannedTotal <= 0) continue
    qualifying.push({ completedAt: log.completedAt ?? log.startedAt, ratio: span / plannedTotal })
  }

  const windowed = qualifying
    .sort((a, b) => b.completedAt - a.completedAt)
    .slice(0, CALIBRATION_WINDOW)

  if (windowed.length < CALIBRATION_MIN_SAMPLES) {
    return { ...INERT_CALIBRATION, sampleCount: windowed.length }
  }

  const ratios = windowed.map((sample) => sample.ratio).sort((a, b) => a - b)
  const folded = Math.min(Math.max(median(ratios), 1), CALIBRATION_RATIO_CLAMP)
  return {
    overheadRatio: folded,
    sampleCount: windowed.length,
    windowSize: CALIBRATION_WINDOW,
  }
}
