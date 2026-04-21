import { beforeEach, describe, expect, it } from 'vitest'
import { db } from '../../db'
import type { SessionPlan, ExecutionStatus } from '../../db'
import { getRecentSessions } from '../session'

/**
 * Tier 1a Unit 5 (2026-04-20): contract tests for `getRecentSessions`.
 *
 * Covers the filter/sort rules that back the Home last-3-sessions
 * row:
 *   - `completed` and `ended_early` included; other statuses excluded.
 *   - `endedEarlyReason === 'discarded_resume'` excluded (A8).
 *   - Ordering by `completedAt ?? startedAt` desc.
 *   - `limit` clamps the returned array length.
 *   - Plans missing from Dexie drop silently; query fills up to
 *     `limit` from the next-best candidate.
 *
 * See `docs/plans/2026-04-20-m001-tier1-implementation.md` Unit 5.
 */

async function clearDb() {
  await Promise.all([
    db.sessionPlans.clear(),
    db.executionLogs.clear(),
    db.sessionReviews.clear(),
    db.timerState.clear(),
    db.sessionDrafts.clear(),
    db.storageMeta.clear(),
  ])
}

function makePlan(id: string): SessionPlan {
  return {
    id,
    presetId: 'solo_wall',
    presetName: 'Solo + Wall',
    playerCount: 1,
    blocks: [
      {
        id: `${id}-b0`,
        type: 'warmup',
        drillName: 'Beach Prep Three',
        shortName: 'Beach Prep',
        durationMinutes: 3,
        coachingCue: '',
        courtsideInstructions: '',
        required: true,
      },
    ],
    safetyCheck: { painFlag: false, heatCta: false, painOverridden: false },
    createdAt: 0,
  }
}

interface ExecOpts {
  id: string
  planId: string
  status: ExecutionStatus
  startedAt: number
  completedAt?: number
  endedEarlyReason?: string
}

async function seedExec(opts: ExecOpts) {
  await db.executionLogs.put({
    id: opts.id,
    planId: opts.planId,
    status: opts.status,
    activeBlockIndex: 0,
    blockStatuses: [],
    startedAt: opts.startedAt,
    completedAt: opts.completedAt,
    endedEarlyReason: opts.endedEarlyReason,
  })
}

beforeEach(async () => {
  await clearDb()
})

describe('getRecentSessions (Tier 1a Unit 5)', () => {
  it('returns [] on a fresh install', async () => {
    expect(await getRecentSessions()).toEqual([])
  })

  it('filters out non-terminal statuses (in_progress, paused, not_started)', async () => {
    const t = Date.now()
    await db.sessionPlans.put(makePlan('p1'))
    await seedExec({
      id: 'x-inprogress',
      planId: 'p1',
      status: 'in_progress',
      startedAt: t - 1000,
    })
    await seedExec({
      id: 'x-paused',
      planId: 'p1',
      status: 'paused',
      startedAt: t - 2000,
    })
    await seedExec({
      id: 'x-notstarted',
      planId: 'p1',
      status: 'not_started',
      startedAt: t - 3000,
    })
    expect(await getRecentSessions()).toEqual([])
  })

  it('includes both completed and ended_early, with completed flag set correctly', async () => {
    const t = Date.now()
    await db.sessionPlans.put(makePlan('p1'))
    await seedExec({
      id: 'x-completed',
      planId: 'p1',
      status: 'completed',
      startedAt: t - 10_000,
      completedAt: t - 5_000,
    })
    await seedExec({
      id: 'x-ended-early',
      planId: 'p1',
      status: 'ended_early',
      startedAt: t - 20_000,
      completedAt: t - 15_000,
    })
    const recent = await getRecentSessions()
    expect(recent).toHaveLength(2)
    const byId = new Map(recent.map((r) => [r.execId, r]))
    expect(byId.get('x-completed')?.completed).toBe(true)
    expect(byId.get('x-ended-early')?.completed).toBe(false)
  })

  it('excludes discarded_resume stubs (A8)', async () => {
    const t = Date.now()
    await db.sessionPlans.put(makePlan('p1'))
    await seedExec({
      id: 'x-discarded',
      planId: 'p1',
      status: 'ended_early',
      startedAt: t - 10_000,
      completedAt: t - 5_000,
      endedEarlyReason: 'discarded_resume',
    })
    await seedExec({
      id: 'x-real',
      planId: 'p1',
      status: 'completed',
      startedAt: t - 20_000,
      completedAt: t - 15_000,
    })
    const recent = await getRecentSessions()
    expect(recent.map((r) => r.execId)).toEqual(['x-real'])
  })

  it('orders newest first by completedAt ?? startedAt', async () => {
    const t = Date.now()
    await db.sessionPlans.put(makePlan('p1'))
    await seedExec({
      id: 'x-oldest',
      planId: 'p1',
      status: 'completed',
      startedAt: t - 300_000,
      completedAt: t - 200_000,
    })
    await seedExec({
      id: 'x-newest',
      planId: 'p1',
      status: 'completed',
      startedAt: t - 100_000,
      completedAt: t - 50_000,
    })
    await seedExec({
      id: 'x-middle',
      planId: 'p1',
      status: 'ended_early',
      startedAt: t - 200_000,
      completedAt: t - 150_000,
    })
    const recent = await getRecentSessions()
    expect(recent.map((r) => r.execId)).toEqual([
      'x-newest',
      'x-middle',
      'x-oldest',
    ])
  })

  it('falls back to startedAt when completedAt is missing', async () => {
    const t = Date.now()
    await db.sessionPlans.put(makePlan('p1'))
    // Synthetic: ended_early stub with no completedAt ordered by startedAt.
    await seedExec({
      id: 'x-nocompleted',
      planId: 'p1',
      status: 'ended_early',
      startedAt: t - 10_000,
    })
    await seedExec({
      id: 'x-completed',
      planId: 'p1',
      status: 'completed',
      startedAt: t - 100_000,
      completedAt: t - 50_000,
    })
    const recent = await getRecentSessions()
    expect(recent[0]?.execId).toBe('x-nocompleted')
    expect(recent[1]?.execId).toBe('x-completed')
  })

  it('clamps to limit=3 by default', async () => {
    const t = Date.now()
    await db.sessionPlans.put(makePlan('p1'))
    for (let i = 0; i < 5; i++) {
      await seedExec({
        id: `x-${i}`,
        planId: 'p1',
        status: 'completed',
        startedAt: t - (i + 1) * 10_000,
        completedAt: t - (i + 1) * 10_000 + 5_000,
      })
    }
    const recent = await getRecentSessions()
    expect(recent).toHaveLength(3)
    // Newest three: x-0, x-1, x-2.
    expect(recent.map((r) => r.execId)).toEqual(['x-0', 'x-1', 'x-2'])
  })

  it('honors explicit limit', async () => {
    const t = Date.now()
    await db.sessionPlans.put(makePlan('p1'))
    for (let i = 0; i < 4; i++) {
      await seedExec({
        id: `x-${i}`,
        planId: 'p1',
        status: 'completed',
        startedAt: t - (i + 1) * 10_000,
        completedAt: t - (i + 1) * 10_000 + 5_000,
      })
    }
    expect(await getRecentSessions(1)).toHaveLength(1)
    expect(await getRecentSessions(2)).toHaveLength(2)
    expect(await getRecentSessions(0)).toEqual([])
  })

  it('drops records whose plan row is missing but fills from next candidate', async () => {
    const t = Date.now()
    await db.sessionPlans.put(makePlan('p-present'))
    // x-orphan references p-missing which is never inserted.
    await seedExec({
      id: 'x-orphan',
      planId: 'p-missing',
      status: 'completed',
      startedAt: t - 5_000,
      completedAt: t - 2_000,
    })
    await seedExec({
      id: 'x-ok-a',
      planId: 'p-present',
      status: 'completed',
      startedAt: t - 50_000,
      completedAt: t - 40_000,
    })
    await seedExec({
      id: 'x-ok-b',
      planId: 'p-present',
      status: 'completed',
      startedAt: t - 100_000,
      completedAt: t - 90_000,
    })
    const recent = await getRecentSessions(3)
    // Orphan drops; the two valid records remain in desc order.
    expect(recent.map((r) => r.execId)).toEqual(['x-ok-a', 'x-ok-b'])
  })
})
