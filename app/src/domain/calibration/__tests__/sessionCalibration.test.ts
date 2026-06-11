import { describe, expect, it } from 'vitest'
import type { ExecutionLog, SessionPlan } from '../../../model'
import {
  currentPersistedExecutionLog,
  currentPersistedPlan,
} from '../../../test-utils/persistedRecords'
import {
  CALIBRATION_MIN_SAMPLES,
  CALIBRATION_RATIO_CLAMP,
  CALIBRATION_WINDOW,
  deriveSessionCalibration,
} from '../sessionCalibration'

const MIN = 60_000
const BASE = 1_700_000_000_000

/**
 * One clean complete: a single-block plan of `plannedMinutes` and a
 * terminal `completed` log spanning `plannedMinutes * ratio` wall
 * minutes, ending at `endedAt`.
 */
function cleanComplete(
  id: string,
  opts: { plannedMinutes?: number; ratio: number; endedAt?: number },
): { log: ExecutionLog; plan: SessionPlan } {
  const plannedMinutes = opts.plannedMinutes ?? 20
  const endedAt = opts.endedAt ?? BASE
  const plan = currentPersistedPlan({
    id: `plan-${id}`,
    blocks: [{ durationMinutes: plannedMinutes }],
  })
  const log = currentPersistedExecutionLog({
    id: `exec-${id}`,
    planId: `plan-${id}`,
    status: 'completed',
    blockStatuses: [{ status: 'completed' }],
    startedAt: endedAt - plannedMinutes * opts.ratio * MIN,
    completedAt: endedAt,
  })
  return { log, plan }
}

function fold(samples: { log: ExecutionLog; plan: SessionPlan }[]) {
  return deriveSessionCalibration(
    samples.map((s) => s.log),
    samples.map((s) => s.plan),
  )
}

describe('deriveSessionCalibration (U5/KTD5)', () => {
  it('stays inert below the minimum sample count', () => {
    const two = [
      cleanComplete('a', { ratio: 1.3 }),
      cleanComplete('b', { ratio: 1.3, endedAt: BASE + MIN }),
    ]
    const result = fold(two)
    expect(result.overheadRatio).toBe(1)
    expect(result.sampleCount).toBe(2)
    expect(fold([]).overheadRatio).toBe(1)
    expect(fold([]).sampleCount).toBe(0)
  })

  it('folds three clean completes at ~1.3x into a ~1.3 median ratio (AE5 basis)', () => {
    const samples = [
      cleanComplete('a', { ratio: 1.2, endedAt: BASE }),
      cleanComplete('b', { ratio: 1.3, endedAt: BASE + MIN }),
      cleanComplete('c', { ratio: 1.4, endedAt: BASE + 2 * MIN }),
    ]
    const result = fold(samples)
    expect(result.overheadRatio).toBeCloseTo(1.3, 5)
    expect(result.sampleCount).toBe(CALIBRATION_MIN_SAMPLES)
    expect(result.windowSize).toBe(CALIBRATION_WINDOW)
  })

  it('is deterministic: the same records fold to the same ratio', () => {
    const samples = [
      cleanComplete('a', { ratio: 1.15 }),
      cleanComplete('b', { ratio: 1.25, endedAt: BASE + MIN }),
      cleanComplete('c', { ratio: 1.45, endedAt: BASE + 2 * MIN }),
    ]
    expect(fold(samples)).toEqual(fold(samples))
    // Input order does not matter — window selection sorts by recency.
    expect(fold([...samples].reverse())).toEqual(fold(samples))
  })

  it('floors at 1.0 when clean completes run faster than planned (upward-only)', () => {
    const samples = [
      cleanComplete('a', { ratio: 0.7 }),
      cleanComplete('b', { ratio: 0.8, endedAt: BASE + MIN }),
      cleanComplete('c', { ratio: 0.9, endedAt: BASE + 2 * MIN }),
    ]
    expect(fold(samples).overheadRatio).toBe(1)
  })

  it('clamps a pathological over-run at the ratio ceiling', () => {
    const samples = [
      cleanComplete('a', { ratio: 1.9 }),
      cleanComplete('b', { ratio: 1.9, endedAt: BASE + MIN }),
      cleanComplete('c', { ratio: 1.9, endedAt: BASE + 2 * MIN }),
    ]
    expect(fold(samples).overheadRatio).toBe(CALIBRATION_RATIO_CLAMP)
  })

  it('excludes wraps and cut-shorts from the fold', () => {
    const wrap = cleanComplete('wrap', { ratio: 1.4, endedAt: BASE + 3 * MIN })
    wrap.log.blockStatuses = [
      { blockId: 'block-main', status: 'completed' },
      { blockId: 'block-2', status: 'skipped' },
    ]
    const cutShort = cleanComplete('cut', { ratio: 1.4, endedAt: BASE + 4 * MIN })
    cutShort.log.status = 'ended_early'
    cutShort.log.endedEarlyReason = 'user_quit'

    const result = fold([
      cleanComplete('a', { ratio: 1.2 }),
      cleanComplete('b', { ratio: 1.2, endedAt: BASE + MIN }),
      wrap,
      cutShort,
    ])
    // Only the two clean completes qualify -> below minimum -> inert.
    expect(result.sampleCount).toBe(2)
    expect(result.overheadRatio).toBe(1)
  })

  it('excludes discarded-resume stubs, missing plans, and records without a usable span', () => {
    const discarded = cleanComplete('disc', { ratio: 1.4, endedAt: BASE + 3 * MIN })
    discarded.log.status = 'ended_early'
    discarded.log.endedEarlyReason = 'discarded_resume'

    const orphan = cleanComplete('orphan', { ratio: 1.4, endedAt: BASE + 4 * MIN })
    orphan.log.planId = 'plan-not-exported'

    const stampless = cleanComplete('stampless', { ratio: 1.4, endedAt: BASE + 5 * MIN })
    delete stampless.log.completedAt

    const samples = [
      cleanComplete('a', { ratio: 1.2 }),
      cleanComplete('b', { ratio: 1.2, endedAt: BASE + MIN }),
    ]
    const result = deriveSessionCalibration(
      [...samples.map((s) => s.log), discarded.log, orphan.log, stampless.log],
      [...samples.map((s) => s.plan), discarded.plan, stampless.plan],
    )
    expect(result.sampleCount).toBe(2)
    expect(result.overheadRatio).toBe(1)
  })

  it('only folds the most recent window of qualifying sessions', () => {
    // CALIBRATION_WINDOW recent samples at 1.2 preceded by a flood of
    // older pathological 1.9s — the old samples must fall out.
    const old = Array.from({ length: 6 }, (_, i) =>
      cleanComplete(`old-${i}`, { ratio: 1.9, endedAt: BASE - (i + 1) * MIN }),
    )
    const recent = Array.from({ length: CALIBRATION_WINDOW }, (_, i) =>
      cleanComplete(`recent-${i}`, { ratio: 1.2, endedAt: BASE + (i + 1) * MIN }),
    )
    const result = fold([...old, ...recent])
    expect(result.sampleCount).toBe(CALIBRATION_WINDOW)
    expect(result.overheadRatio).toBeCloseTo(1.2, 5)
  })
})
