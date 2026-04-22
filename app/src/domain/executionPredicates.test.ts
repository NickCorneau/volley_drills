import { describe, expect, it } from 'vitest'
import type { ExecutionLog } from '../db/types'
import { byRecentEndedAt, isTerminalSession } from './executionPredicates'

function log(overrides: Partial<ExecutionLog> = {}): ExecutionLog {
  return {
    id: overrides.id ?? 'e1',
    planId: 'p1',
    status: overrides.status ?? 'completed',
    activeBlockIndex: 0,
    blockStatuses: [],
    startedAt: overrides.startedAt ?? 1_000,
    ...overrides,
  }
}

describe('isTerminalSession', () => {
  it('accepts completed sessions', () => {
    expect(isTerminalSession(log({ status: 'completed' }))).toBe(true)
  })

  it('accepts ended_early sessions', () => {
    expect(isTerminalSession(log({ status: 'ended_early' }))).toBe(true)
  })

  it('rejects in_progress / paused / not_started', () => {
    expect(isTerminalSession(log({ status: 'in_progress' }))).toBe(false)
    expect(isTerminalSession(log({ status: 'paused' }))).toBe(false)
    expect(isTerminalSession(log({ status: 'not_started' }))).toBe(false)
  })

  it('excludes discarded-resume sessions (A8)', () => {
    expect(
      isTerminalSession(
        log({ status: 'ended_early', endedEarlyReason: 'discarded_resume' }),
      ),
    ).toBe(false)
  })

  it('includes other ended_early reasons', () => {
    expect(
      isTerminalSession(
        log({ status: 'ended_early', endedEarlyReason: 'missing_plan' }),
      ),
    ).toBe(true)
  })
})

describe('byRecentEndedAt', () => {
  it('sorts by completedAt descending', () => {
    const a = log({ id: 'a', completedAt: 100 })
    const b = log({ id: 'b', completedAt: 200 })
    expect([a, b].sort(byRecentEndedAt).map((l) => l.id)).toEqual(['b', 'a'])
  })

  it('falls back to startedAt when completedAt missing', () => {
    const a = log({ id: 'a', startedAt: 100, completedAt: undefined })
    const b = log({ id: 'b', startedAt: 200, completedAt: undefined })
    expect([a, b].sort(byRecentEndedAt).map((l) => l.id)).toEqual(['b', 'a'])
  })

  it('prefers completedAt over startedAt when both present', () => {
    const a = log({ id: 'a', startedAt: 500, completedAt: 100 })
    const b = log({ id: 'b', startedAt: 50, completedAt: 200 })
    expect([a, b].sort(byRecentEndedAt).map((l) => l.id)).toEqual(['b', 'a'])
  })
})
