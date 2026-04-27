import { beforeEach, describe, expect, it } from 'vitest'
import { db } from '../../../db'
import type { ExecutionLog, SessionPlan } from '../../../db'
import { getSessionTallySummary } from '../queries'

/**
 * 2026-04-27 reconciled-list `R13` (Settings investment footer):
 * pin the count + summed-minutes contract for the
 * `Logged: N sessions · H:MM total` row on SettingsScreen.
 *
 * Per-session minute math must match `formatDurationLine()` exactly
 * (Math.max(1, Math.round((endedAt(log) - log.startedAt) / 60_000)))
 * so the footer total agrees with the per-row durations the user
 * sees on Complete / Recent Sessions surfaces. Discarded-resume
 * stubs are excluded via `isTerminalSession` (`A8`); paused /
 * in-progress sessions are excluded by the upstream
 * `getTerminalExecutionLogs` selector.
 */

async function clearDb() {
  await Promise.all([db.executionLogs.clear(), db.sessionPlans.clear()])
}

function fakePlan(id: string): SessionPlan {
  return {
    id,
    presetId: 'solo_wall',
    presetName: 'Solo + Wall',
    playerCount: 1,
    blocks: [],
    safetyCheck: { painFlag: false, heatCta: false, painOverridden: false },
    createdAt: 1,
  }
}

function completedLog(
  id: string,
  startedAt: number,
  completedAt: number,
): ExecutionLog {
  return {
    id,
    planId: id,
    status: 'completed',
    activeBlockIndex: 0,
    blockStatuses: [],
    startedAt,
    completedAt,
  }
}

describe('getSessionTallySummary (R13)', () => {
  beforeEach(async () => {
    await clearDb()
  })

  it('returns count=0, totalMinutes=0 when no sessions exist', async () => {
    const summary = await getSessionTallySummary()
    expect(summary).toEqual({ count: 0, totalMinutes: 0 })
  })

  it('counts completed and ended_early sessions, summing minutes per session', async () => {
    const now = Date.now()
    await db.sessionPlans.bulkPut([fakePlan('a'), fakePlan('b'), fakePlan('c')])
    await db.executionLogs.bulkPut([
      // 30 min completed
      completedLog('a', now - 60 * 60_000, now - 30 * 60_000),
      // 15 min completed
      completedLog('b', now - 20 * 60_000, now - 5 * 60_000),
      // 5 min ended_early
      {
        id: 'c',
        planId: 'c',
        status: 'ended_early',
        activeBlockIndex: 0,
        blockStatuses: [],
        startedAt: now - 10 * 60_000,
        completedAt: now - 5 * 60_000,
      },
    ])

    const summary = await getSessionTallySummary()
    expect(summary.count).toBe(3)
    expect(summary.totalMinutes).toBe(30 + 15 + 5)
  })

  it('rounds each session to the nearest minute, with a 1 min floor (matches formatDurationLine)', async () => {
    const now = Date.now()
    await db.sessionPlans.bulkPut([fakePlan('a'), fakePlan('b'), fakePlan('c')])
    await db.executionLogs.bulkPut([
      // 0:30 -> floors to 1 min via the 1-min floor
      completedLog('a', now - 30_000, now),
      // 0:90 -> rounds to 2 min
      completedLog('b', now - 90_000, now),
      // 119s -> rounds to 2 min
      completedLog('c', now - 119_000, now),
    ])

    const summary = await getSessionTallySummary()
    expect(summary).toEqual({ count: 3, totalMinutes: 1 + 2 + 2 })
  })

  it('excludes discarded_resume stubs (A8)', async () => {
    const now = Date.now()
    await db.sessionPlans.bulkPut([fakePlan('a'), fakePlan('b')])
    await db.executionLogs.bulkPut([
      completedLog('a', now - 20 * 60_000, now - 10 * 60_000),
      // discarded resume should not contribute
      {
        id: 'b',
        planId: 'b',
        status: 'ended_early',
        endedEarlyReason: 'discarded_resume',
        activeBlockIndex: 0,
        blockStatuses: [],
        startedAt: now - 30 * 60_000,
        completedAt: now - 25 * 60_000,
      },
    ])

    const summary = await getSessionTallySummary()
    expect(summary.count).toBe(1)
    expect(summary.totalMinutes).toBe(10)
  })

  it('excludes non-terminal sessions (paused / in_progress / not_started)', async () => {
    const now = Date.now()
    await db.sessionPlans.bulkPut([fakePlan('a'), fakePlan('b'), fakePlan('c'), fakePlan('d')])
    await db.executionLogs.bulkPut([
      completedLog('a', now - 20 * 60_000, now - 10 * 60_000),
      {
        id: 'b',
        planId: 'b',
        status: 'paused',
        activeBlockIndex: 0,
        blockStatuses: [],
        startedAt: now - 30 * 60_000,
      },
      {
        id: 'c',
        planId: 'c',
        status: 'in_progress',
        activeBlockIndex: 0,
        blockStatuses: [],
        startedAt: now - 5 * 60_000,
      },
      {
        id: 'd',
        planId: 'd',
        status: 'not_started',
        activeBlockIndex: 0,
        blockStatuses: [],
        startedAt: now,
      },
    ])

    const summary = await getSessionTallySummary()
    expect(summary.count).toBe(1)
    expect(summary.totalMinutes).toBe(10)
  })
})
