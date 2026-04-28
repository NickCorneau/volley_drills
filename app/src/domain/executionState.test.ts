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
  computeActualDurationMinutes,
} from './executionState'

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
