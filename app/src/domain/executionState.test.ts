import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type {
  ExecutionLog,
  ExecutionLogBlockStatus,
  SessionPlan,
  SessionPlanBlock,
} from '../model'
import {
  buildAdvancedBlock,
  buildEndedSession,
  buildPausedExecution,
  buildResumedExecution,
  buildStartedBlock,
  buildWrappedSession,
  computeActualDurationMinutes,
  withActualDuration,
} from './executionState'
import {
  currentPersistedExecutionLog,
  currentPersistedPlan,
} from '../test-utils/persistedRecords'

const FIXED_NOW = 1_700_000_000_000

beforeEach(() => {
  vi.useFakeTimers()
  vi.setSystemTime(FIXED_NOW)
})

afterEach(() => {
  vi.useRealTimers()
})

function block(id: string, durationMinutes = 5): SessionPlanBlock {
  return {
    id,
    type: 'main_skill',
    drillName: `Drill ${id}`,
    shortName: id,
    durationMinutes,
    coachingCue: '',
    courtsideInstructions: '',
    required: false,
  }
}

function plan(blocks: SessionPlanBlock[]): SessionPlan {
  return {
    id: 'p1',
    presetId: 'solo_open',
    presetName: 'Solo Open',
    playerCount: 1,
    blocks,
    safetyCheck: {
      painFlag: false,
      heatCta: false,
      painOverridden: false,
    },
    createdAt: FIXED_NOW,
  }
}

function log(
  overrides: Partial<ExecutionLog> = {},
  blockStatuses?: ExecutionLogBlockStatus[],
): ExecutionLog {
  return {
    id: 'e1',
    planId: 'p1',
    status: 'not_started',
    activeBlockIndex: 0,
    blockStatuses: blockStatuses ?? [
      { blockId: 'b1', status: 'planned' },
      { blockId: 'b2', status: 'planned' },
    ],
    startedAt: 0,
    ...overrides,
  }
}

describe('buildStartedBlock', () => {
  it('returns null when the active index is out of bounds', () => {
    const p = plan([block('b1')])
    const exec = log({ activeBlockIndex: 5 })
    expect(buildStartedBlock(exec, p)).toBeNull()
  })

  it('returns null when the block is already in progress', () => {
    const p = plan([block('b1')])
    const exec = log({ activeBlockIndex: 0 }, [
      { blockId: 'b1', status: 'in_progress', startedAt: 1 },
    ])
    expect(buildStartedBlock(exec, p)).toBeNull()
  })

  it('flips active block to in_progress and stamps startedAt on first start', () => {
    const p = plan([block('b1'), block('b2')])
    const exec = log({ startedAt: 0 })
    const out = buildStartedBlock(exec, p)!
    expect(out.status).toBe('in_progress')
    expect(out.blockStatuses[0].status).toBe('in_progress')
    expect(out.blockStatuses[0].startedAt).toBe(FIXED_NOW)
    expect(out.startedAt).toBe(FIXED_NOW)
    expect(out.pausedAt).toBeUndefined()
  })

  it('does not overwrite an existing session startedAt', () => {
    const p = plan([block('b1')])
    const exec = log({ startedAt: 123 })
    const out = buildStartedBlock(exec, p)!
    expect(out.startedAt).toBe(123)
  })
})

describe('buildPausedExecution / buildResumedExecution', () => {
  it('pauses and records pausedAt', () => {
    const out = buildPausedExecution(log({ status: 'in_progress' }))
    expect(out.status).toBe('paused')
    expect(out.pausedAt).toBe(FIXED_NOW)
  })

  it('resumes by clearing pausedAt and setting in_progress', () => {
    const out = buildResumedExecution(log({ status: 'paused', pausedAt: FIXED_NOW - 1 }))
    expect(out.status).toBe('in_progress')
    expect(out.pausedAt).toBeUndefined()
  })
})

describe('buildAdvancedBlock', () => {
  it('advances to the next block when not last', () => {
    const p = plan([block('b1'), block('b2')])
    const exec = log({ status: 'in_progress', activeBlockIndex: 0 })
    const { execution, isLast } = buildAdvancedBlock(exec, p, 'completed')
    expect(isLast).toBe(false)
    expect(execution.activeBlockIndex).toBe(1)
    expect(execution.blockStatuses[0].status).toBe('completed')
    expect(execution.blockStatuses[0].completedAt).toBe(FIXED_NOW)
    expect(execution.status).toBe('in_progress')
    expect(execution.completedAt).toBeUndefined()
  })

  it('marks completed on the final block and stamps completedAt', () => {
    const p = plan([block('b1')])
    const exec = log({ status: 'in_progress', activeBlockIndex: 0 }, [
      { blockId: 'b1', status: 'in_progress', startedAt: 1 },
    ])
    const { execution, isLast } = buildAdvancedBlock(exec, p, 'completed')
    expect(isLast).toBe(true)
    expect(execution.status).toBe('completed')
    expect(execution.completedAt).toBe(FIXED_NOW)
  })

  it('promotes paused status to in_progress on advance when not last', () => {
    const p = plan([block('b1'), block('b2')])
    const exec = log({ status: 'paused', pausedAt: 99, activeBlockIndex: 0 })
    const { execution } = buildAdvancedBlock(exec, p, 'skipped')
    expect(execution.status).toBe('in_progress')
  })

  it('derives ended_early when every block was skipped (zero-work rule, KTD2)', () => {
    // Skipping every block one-by-one used to record a "Done" session
    // with zero work. Pinned: the last advance derives cut-short.
    const p = plan([block('b1'), block('b2')])
    const first = buildAdvancedBlock(
      log({ status: 'in_progress', activeBlockIndex: 0 }, [
        { blockId: 'b1', status: 'in_progress', startedAt: 1 },
        { blockId: 'b2', status: 'planned' },
      ]),
      p,
      'skipped',
    )
    const { execution, isLast } = buildAdvancedBlock(first.execution, p, 'skipped')
    expect(isLast).toBe(true)
    expect(execution.status).toBe('ended_early')
    expect(execution.completedAt).toBe(FIXED_NOW)
  })

  it('keeps completed status when blocks were skipped mid-session but work was done', () => {
    const p = plan([block('b1'), block('b2')])
    const first = buildAdvancedBlock(
      log({ status: 'in_progress', activeBlockIndex: 0 }, [
        { blockId: 'b1', status: 'in_progress', startedAt: 1 },
        { blockId: 'b2', status: 'planned' },
      ]),
      p,
      'skipped',
    )
    const { execution } = buildAdvancedBlock(first.execution, p, 'completed')
    expect(execution.status).toBe('completed')
  })

  it('is a no-op past the end of the plan - no malformed blockStatus row (red-team adversarial finding ADV-1, 2026-06-11)', () => {
    // Bug shape: a double advance on the final block left
    // `activeBlockIndex === blocks.length`; the second call spread
    // `blockStatuses[idx]` past the array end and appended a
    // `{ status, completedAt }` row with NO blockId, which persisted
    // into the ExecutionLog and flowed into exports.
    const p = plan([block('b1')])
    const completed = log({ status: 'completed', activeBlockIndex: 1 }, [
      { blockId: 'b1', status: 'completed', completedAt: 50 },
    ])
    const { execution, isLast } = buildAdvancedBlock(completed, p, 'completed')
    expect(isLast).toBe(true)
    expect(execution).toBe(completed)
    expect(execution.blockStatuses).toHaveLength(1)
    expect(execution.blockStatuses.every((bs) => typeof bs.blockId === 'string')).toBe(true)
  })
})

describe('buildWrappedSession', () => {
  it('records completed with a visible skipped tail when work was done (AE1)', () => {
    // 2 of 4 blocks completed, third in flight: deliberate wrap.
    const exec = log({ status: 'in_progress', activeBlockIndex: 2 }, [
      { blockId: 'b1', status: 'completed', completedAt: 10 },
      { blockId: 'b2', status: 'completed', completedAt: 20 },
      { blockId: 'b3', status: 'in_progress', startedAt: 30 },
      { blockId: 'b4', status: 'planned' },
    ])
    const out = buildWrappedSession(exec)
    expect(out.status).toBe('completed')
    expect(out.completedAt).toBe(FIXED_NOW)
    expect(out.endedEarlyReason).toBeUndefined()
    expect(out.blockStatuses[2].status).toBe('skipped')
    expect(out.blockStatuses[2].completedAt).toBe(FIXED_NOW)
    expect(out.blockStatuses[3].status).toBe('skipped')
  })

  it('converges with skip-wrapping the same remaining blocks (AE3)', () => {
    const p = plan([block('b1'), block('b2'), block('b3')])
    const base: ExecutionLogBlockStatus[] = [
      { blockId: 'b1', status: 'completed', completedAt: 10 },
      { blockId: 'b2', status: 'in_progress', startedAt: 20 },
      { blockId: 'b3', status: 'planned' },
    ]
    const wrapped = buildWrappedSession(log({ status: 'in_progress', activeBlockIndex: 1 }, base))

    // Same session skip-wrapped one block at a time.
    const skipOnce = buildAdvancedBlock(
      log({ status: 'in_progress', activeBlockIndex: 1 }, base),
      p,
      'skipped',
    )
    const skipTwice = buildAdvancedBlock(skipOnce.execution, p, 'skipped')

    expect(skipTwice.execution.status).toBe(wrapped.status)
    expect(skipTwice.execution.blockStatuses.map((bs) => bs.status)).toEqual(
      wrapped.blockStatuses.map((bs) => bs.status),
    )
  })

  it('wraps the same way while paused', () => {
    const exec = log({ status: 'paused', pausedAt: 50, activeBlockIndex: 1 }, [
      { blockId: 'b1', status: 'completed', completedAt: 10 },
      { blockId: 'b2', status: 'in_progress', startedAt: 20 },
    ])
    const out = buildWrappedSession(exec)
    expect(out.status).toBe('completed')
    expect(out.blockStatuses[1].status).toBe('skipped')
  })

  it('derives ended_early for a zero-work wrap (nothing completed)', () => {
    const exec = log({ status: 'in_progress', activeBlockIndex: 0 }, [
      { blockId: 'b1', status: 'in_progress', startedAt: 1 },
      { blockId: 'b2', status: 'planned' },
    ])
    const out = buildWrappedSession(exec)
    expect(out.status).toBe('ended_early')
    expect(out.blockStatuses.every((bs) => bs.status === 'skipped')).toBe(true)
  })
})

describe('buildEndedSession', () => {
  it('marks the active in-progress block skipped and stamps the session', () => {
    const exec = log({ status: 'in_progress', activeBlockIndex: 0 }, [
      { blockId: 'b1', status: 'in_progress', startedAt: 1 },
      { blockId: 'b2', status: 'planned' },
    ])
    const out = buildEndedSession(exec, 'user_ended')
    expect(out.status).toBe('ended_early')
    expect(out.completedAt).toBe(FIXED_NOW)
    expect(out.endedEarlyReason).toBe('user_ended')
    expect(out.blockStatuses[0].status).toBe('skipped')
    expect(out.blockStatuses[0].completedAt).toBe(FIXED_NOW)
    expect(out.blockStatuses[1].status).toBe('skipped')
  })

  it('leaves previously-completed blocks untouched', () => {
    const exec = log({ activeBlockIndex: 2 }, [
      { blockId: 'b1', status: 'completed', completedAt: 10 },
      { blockId: 'b2', status: 'completed', completedAt: 20 },
      { blockId: 'b3', status: 'in_progress', startedAt: 30 },
    ])
    const out = buildEndedSession(exec)
    expect(out.blockStatuses[0].status).toBe('completed')
    expect(out.blockStatuses[1].status).toBe('completed')
    expect(out.blockStatuses[2].status).toBe('skipped')
  })

  it('records ended_early even with completed blocks — cut-short is explicit', () => {
    const exec = log({ status: 'in_progress', activeBlockIndex: 1 }, [
      { blockId: 'b1', status: 'completed', completedAt: 10 },
      { blockId: 'b2', status: 'in_progress', startedAt: 20 },
    ])
    expect(buildEndedSession(exec, 'too_tired').status).toBe('ended_early')
  })
})

describe('computeActualDurationMinutes', () => {
  it('sums completed block durations', () => {
    const p = plan([block('b1', 5), block('b2', 10)])
    const exec = log({}, [
      { blockId: 'b1', status: 'completed' },
      { blockId: 'b2', status: 'completed' },
    ])
    expect(computeActualDurationMinutes(exec, p)).toBe(15)
  })

  it('adds a partial-active-block elapsed capped at its planned duration', () => {
    const p = plan([block('b1', 5), block('b2', 10)])
    const exec = log({ activeBlockIndex: 1 }, [
      { blockId: 'b1', status: 'completed' },
      { blockId: 'b2', status: 'in_progress' },
    ])
    // 5 min + min(180, 10 min) = 5 + 3 = 8
    expect(computeActualDurationMinutes(exec, p, 180)).toBe(8)
    // Runaway timer (1 hr) is capped at the planned 10 min
    expect(computeActualDurationMinutes(exec, p, 3_600)).toBe(15)
  })

  it('ignores non-finite or non-positive partial elapsed inputs', () => {
    const p = plan([block('b1', 5)])
    const exec = log({}, [{ blockId: 'b1', status: 'completed' }])
    expect(computeActualDurationMinutes(exec, p, Number.NaN)).toBe(5)
    expect(computeActualDurationMinutes(exec, p, -1)).toBe(5)
    expect(computeActualDurationMinutes(exec, p, Number.POSITIVE_INFINITY)).toBe(5)
  })
})

/**
 * U4 (2026-06-11 session-truth plan, KTD3/KTD4): recorded duration is
 * the clamped wall-clock session span (`startedAt` -> terminal
 * `completedAt`) whenever both stamps exist. Pauses and post-beep play
 * live inside the span deliberately; the clamp (a multiple of the
 * planned total) bounds the app-kill/resume-hours inflation class.
 * Records missing the terminal stamp keep the planned-minutes rule.
 */
describe('computeActualDurationMinutes - wall-clock span (U4)', () => {
  const MIN = 60_000

  it('records the wall span when the session overruns the planned total (AE4)', () => {
    const p = plan([block('b1', 10), block('b2', 10)])
    const exec = log(
      {
        status: 'completed',
        startedAt: FIXED_NOW - 26 * MIN,
        completedAt: FIXED_NOW,
      },
      [
        { blockId: 'b1', status: 'completed' },
        { blockId: 'b2', status: 'completed' },
      ],
    )
    expect(computeActualDurationMinutes(exec, p)).toBe(26)
  })

  it('counts paused time inside the span (pinned semantic)', () => {
    const p = plan([block('b1', 10), block('b2', 10)])
    const exec = log(
      {
        status: 'completed',
        startedAt: FIXED_NOW - 30 * MIN,
        pausedAt: FIXED_NOW - 15 * MIN,
        completedAt: FIXED_NOW,
      },
      [
        { blockId: 'b1', status: 'completed' },
        { blockId: 'b2', status: 'completed' },
      ],
    )
    expect(computeActualDurationMinutes(exec, p)).toBe(30)
  })

  it('clamps the app-kill / resume-hours class to the ceiling, not 721 minutes', () => {
    const p = plan([block('b1', 5), block('b2', 5), block('b3', 5)])
    const exec = log(
      {
        status: 'completed',
        startedAt: FIXED_NOW - 12 * 60 * MIN,
        completedAt: FIXED_NOW,
      },
      [
        { blockId: 'b1', status: 'completed' },
        { blockId: 'b2', status: 'completed' },
        { blockId: 'b3', status: 'completed' },
      ],
    )
    // 15 planned -> ceiling 30, not the 720-min raw span.
    expect(computeActualDurationMinutes(exec, p)).toBe(30)
  })

  it('uses the span for a cut-short session (honest partial duration)', () => {
    const p = plan([block('b1', 10), block('b2', 10)])
    const exec = log(
      {
        status: 'ended_early',
        endedEarlyReason: 'user_quit',
        startedAt: FIXED_NOW - 9 * MIN,
        completedAt: FIXED_NOW,
      },
      [
        { blockId: 'b1', status: 'completed' },
        { blockId: 'b2', status: 'skipped' },
      ],
    )
    expect(computeActualDurationMinutes(exec, p)).toBe(9)
  })

  it('ends the span at the wrap stamp for a mid-block wrap', () => {
    const p = plan([block('b1', 5), block('b2', 10)])
    const exec = log(
      {
        status: 'completed',
        startedAt: FIXED_NOW - 7.5 * MIN,
        completedAt: FIXED_NOW,
      },
      [
        { blockId: 'b1', status: 'completed' },
        { blockId: 'b2', status: 'skipped' },
      ],
    )
    expect(computeActualDurationMinutes(exec, p)).toBe(7.5)
  })

  it('keeps the planned-minutes rule when the terminal stamp is missing', () => {
    const p = plan([block('b1', 5), block('b2', 10)])
    const exec = log({ startedAt: FIXED_NOW - 26 * MIN }, [
      { blockId: 'b1', status: 'completed' },
      { blockId: 'b2', status: 'completed' },
    ])
    expect(computeActualDurationMinutes(exec, p)).toBe(15)
  })

  it('falls back when the span is non-positive or the planned total is zero', () => {
    const sameInstant = log(
      { status: 'completed', startedAt: FIXED_NOW, completedAt: FIXED_NOW },
      [{ blockId: 'b1', status: 'completed' }],
    )
    expect(computeActualDurationMinutes(sameInstant, plan([block('b1', 5)]))).toBe(5)

    const emptyPlan = plan([])
    const spanned = log(
      { status: 'completed', startedAt: FIXED_NOW - 10 * MIN, completedAt: FIXED_NOW },
      [{ blockId: 'b1', status: 'completed' }],
    )
    expect(computeActualDurationMinutes(spanned, emptyPlan)).toBe(0)
  })

  it('applies the wall-span rule to historical persisted records (read evolution, R5 untouched)', () => {
    // Records untouched, reads evolve: a pre-U4 record re-read today gets
    // the span interpretation - no special-casing by record age.
    const histPlan = currentPersistedPlan({ blocks: [{ durationMinutes: 8 }] })
    const histLog = currentPersistedExecutionLog({
      status: 'completed',
      startedAt: 1000,
      completedAt: 1000 + 26 * MIN,
      blockStatuses: [{ status: 'completed' }],
    })
    // 8 planned -> ceiling 16; the 26-min historical span clamps, and the
    // record's own fields are never rewritten by the read.
    expect(computeActualDurationMinutes(histLog, histPlan)).toBe(16)
    expect(histLog.actualDurationMinutes).toBeUndefined()
  })
})


describe('withActualDuration', () => {
  it('adds owned timer elapsed to the computed actual duration', () => {
    const p = plan([block('b1', 3), block('b2', 5)])
    const exec = log(
      { id: 'exec-owned', activeBlockIndex: 1 },
      [
        { blockId: 'b1', status: 'completed' },
        { blockId: 'b2', status: 'skipped' },
      ],
    )

    const out = withActualDuration(exec, p, {
      id: 'active',
      executionLogId: 'exec-owned',
      blockIndex: 1,
      startedAt: FIXED_NOW,
      accumulatedElapsed: 120,
      status: 'running',
      lastFlushedAt: FIXED_NOW,
    })

    expect(out.actualDurationMinutes).toBe(5)
    expect(out).not.toBe(exec)
  })

  it('ignores a timer owned by another execution', () => {
    const p = plan([block('b1', 3), block('b2', 5)])
    const exec = log(
      { id: 'exec-current', activeBlockIndex: 1 },
      [
        { blockId: 'b1', status: 'completed' },
        { blockId: 'b2', status: 'skipped' },
      ],
    )

    const out = withActualDuration(exec, p, {
      id: 'active',
      executionLogId: 'exec-other',
      blockIndex: 1,
      startedAt: FIXED_NOW,
      accumulatedElapsed: 120,
      status: 'running',
      lastFlushedAt: FIXED_NOW,
    })

    expect(out.actualDurationMinutes).toBe(3)
  })

  it('handles a missing timer snapshot', () => {
    const p = plan([block('b1', 3), block('b2', 5)])
    const exec = log(
      { id: 'exec-no-timer', activeBlockIndex: 1 },
      [
        { blockId: 'b1', status: 'completed' },
        { blockId: 'b2', status: 'skipped' },
      ],
    )

    expect(withActualDuration(exec, p, null).actualDurationMinutes).toBe(3)
  })
})


describe('withActualDuration timer ownership edge cases', () => {
  it('caps a post-advance final skipped block by the timer block duration', () => {
    const p = plan([block('b1', 3), block('b2', 5)])
    const exec = log(
      { id: 'exec-owned', activeBlockIndex: 2 },
      [
        { blockId: 'b1', status: 'completed' },
        { blockId: 'b2', status: 'skipped' },
      ],
    )

    const out = withActualDuration(
      exec,
      p,
      {
        id: 'active',
        executionLogId: 'exec-owned',
        blockIndex: 1,
        startedAt: FIXED_NOW,
        accumulatedElapsed: 999_999,
        status: 'running',
        lastFlushedAt: FIXED_NOW,
      },
      1,
    )

    expect(out.actualDurationMinutes).toBe(8)
  })

  it('ignores a same-execution timer from a different block', () => {
    const p = plan([block('b1', 3), block('b2', 5)])
    const exec = log(
      { id: 'exec-owned', activeBlockIndex: 1 },
      [
        { blockId: 'b1', status: 'completed' },
        { blockId: 'b2', status: 'skipped' },
      ],
    )

    const out = withActualDuration(
      exec,
      p,
      {
        id: 'active',
        executionLogId: 'exec-owned',
        blockIndex: 0,
        startedAt: FIXED_NOW,
        accumulatedElapsed: 120,
        status: 'running',
        lastFlushedAt: FIXED_NOW,
      },
      1,
    )

    expect(out.actualDurationMinutes).toBe(3)
  })
})
