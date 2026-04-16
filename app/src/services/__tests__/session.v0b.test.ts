import { beforeEach, describe, expect, it } from 'vitest'
import { db } from '../../db'
import type { ExecutionLog, SessionPlan } from '../../db'
import { buildDraft } from '../../domain/sessionBuilder'
import {
  computeActualDurationMinutes,
  createSessionFromDraft,
  findPendingReview,
  findResumableSession,
  getCurrentDraft,
  getLastContext,
  saveDraft,
  skipReview,
} from '../session'

async function clearDb() {
  await Promise.all([
    db.sessionPlans.clear(),
    db.executionLogs.clear(),
    db.sessionReviews.clear(),
    db.timerState.clear(),
    db.sessionDrafts.clear(),
  ])
}

beforeEach(async () => {
  await clearDb()
})

describe('v0b session services', () => {
  it('round-trips a draft into a persisted session and clears current draft', async () => {
    const draft = buildDraft({
      playerMode: 'solo',
      timeProfile: 15,
      netAvailable: false,
      wallAvailable: true,
    })

    expect(draft).not.toBeNull()

    await saveDraft(draft!)
    expect(await getCurrentDraft()).not.toBeNull()

    const execId = await createSessionFromDraft({
      draft: draft!,
      painFlag: false,
      trainingRecency: '1 day',
      heatCta: false,
      painOverridden: false,
    })

    expect(execId).toBeTruthy()
    expect(await getCurrentDraft()).toBeNull()

    const plan = await db.sessionPlans.toArray()
    const execution = await db.executionLogs.toArray()

    expect(plan).toHaveLength(1)
    expect(execution).toHaveLength(1)
    expect(plan[0].context).toEqual(draft!.context)
    expect(plan[0].safetyCheck.trainingRecency).toBe('1 day')
    expect(execution[0].blockStatuses).toHaveLength(draft!.blocks.length)

    const resumable = await findResumableSession()
    expect(resumable?.execution.id).toBe(execId)
    expect(resumable?.plan.id).toBe(plan[0].id)
  })

  it('returns the newest saved context even when the newest plan lacks context', async () => {
    const olderWithContext: SessionPlan = {
      id: 'plan-with-context',
      presetId: 'solo_wall',
      presetName: 'Solo + Wall',
      playerCount: 1,
      blocks: [],
      safetyCheck: {
        painFlag: false,
        heatCta: false,
        painOverridden: false,
      },
      context: {
        playerMode: 'solo',
        timeProfile: 25,
        netAvailable: false,
        wallAvailable: true,
      },
      createdAt: 100,
    }

    const newerWithoutContext: SessionPlan = {
      id: 'plan-without-context',
      presetId: 'legacy',
      presetName: 'Legacy Session',
      playerCount: 1,
      blocks: [],
      safetyCheck: {
        painFlag: false,
        heatCta: false,
        painOverridden: false,
      },
      createdAt: 200,
    }

    await db.sessionPlans.bulkPut([olderWithContext, newerWithoutContext])

    expect(await getLastContext()).toEqual(olderWithContext.context)
  })

  it('findPendingReview returns the latest unreviewed session and skipReview clears it', async () => {
    await db.sessionPlans.put({
      id: 'plan-1',
      presetId: 'solo_wall',
      presetName: 'Solo + Wall',
      playerCount: 1,
      blocks: [],
      safetyCheck: {
        painFlag: false,
        heatCta: false,
        painOverridden: false,
      },
      createdAt: 1,
    })

    await db.executionLogs.bulkPut([
      {
        id: 'exec-old',
        planId: 'plan-1',
        status: 'completed',
        activeBlockIndex: 0,
        blockStatuses: [],
        startedAt: 10,
        completedAt: 20,
      },
      {
        id: 'exec-new',
        planId: 'plan-1',
        status: 'ended_early',
        activeBlockIndex: 0,
        blockStatuses: [],
        startedAt: 30,
        completedAt: 40,
      },
    ])

    const pending = await findPendingReview()
    expect(pending?.executionId).toBe('exec-new')

    await skipReview('exec-new')
    const nextPending = await findPendingReview()
    expect(nextPending?.executionId).toBe('exec-old')
  })
})

describe('computeActualDurationMinutes', () => {
  const makePlan = (durations: number[]): SessionPlan => ({
    id: 'plan-1',
    presetId: 'preset-1',
    presetName: 'Test',
    playerCount: 1,
    blocks: durations.map((d, i) => ({
      id: `block-${i}`,
      type: 'main_skill' as const,
      drillName: `Drill ${i}`,
      shortName: `D${i}`,
      durationMinutes: d,
      coachingCue: '',
      courtsideInstructions: '',
      required: true,
    })),
    safetyCheck: { painFlag: false, heatCta: false, painOverridden: false },
    createdAt: 1,
  })

  const makeExec = (overrides: Partial<ExecutionLog>): ExecutionLog => ({
    id: 'exec-1',
    planId: 'plan-1',
    status: 'completed',
    activeBlockIndex: 0,
    blockStatuses: [],
    startedAt: 1,
    ...overrides,
  })

  it('sums planned durations for all completed blocks', () => {
    const plan = makePlan([3, 8, 5])
    const exec = makeExec({
      activeBlockIndex: 3,
      status: 'completed',
      blockStatuses: [
        { blockId: 'block-0', status: 'completed' },
        { blockId: 'block-1', status: 'completed' },
        { blockId: 'block-2', status: 'completed' },
      ],
    })

    expect(computeActualDurationMinutes(exec, plan)).toBe(16)
  })

  it('adds partial block elapsed for end-early', () => {
    const plan = makePlan([3, 8])
    const exec = makeExec({
      activeBlockIndex: 1,
      status: 'ended_early',
      blockStatuses: [
        { blockId: 'block-0', status: 'completed' },
        { blockId: 'block-1', status: 'skipped' },
      ],
    })

    const result = computeActualDurationMinutes(exec, plan, 90)
    expect(result).toBe(4.5)
  })

  it('returns 0 when no blocks completed and no timer', () => {
    const plan = makePlan([3, 8])
    const exec = makeExec({
      status: 'ended_early',
      blockStatuses: [
        { blockId: 'block-0', status: 'skipped' },
        { blockId: 'block-1', status: 'skipped' },
      ],
    })

    expect(computeActualDurationMinutes(exec, plan)).toBe(0)
  })

  it('returns 0 when all blocks skipped', () => {
    const plan = makePlan([5, 10])
    const exec = makeExec({
      status: 'ended_early',
      blockStatuses: [
        { blockId: 'block-0', status: 'skipped' },
        { blockId: 'block-1', status: 'skipped' },
      ],
    })

    expect(computeActualDurationMinutes(exec, plan)).toBe(0)
  })

  it('rounds to 0.1 minute granularity', () => {
    const plan = makePlan([3])
    const exec = makeExec({
      status: 'ended_early',
      blockStatuses: [{ blockId: 'block-0', status: 'skipped' }],
    })

    const result = computeActualDurationMinutes(exec, plan, 45)
    expect(result).toBe(0.8)
  })

  // Red-team RT-5: input validation on currentBlockElapsedSeconds.
  it('ignores NaN currentBlockElapsedSeconds', () => {
    const plan = makePlan([3, 8])
    const exec = makeExec({
      activeBlockIndex: 1,
      status: 'ended_early',
      blockStatuses: [
        { blockId: 'block-0', status: 'completed' },
        { blockId: 'block-1', status: 'skipped' },
      ],
    })

    const result = computeActualDurationMinutes(exec, plan, Number.NaN)
    expect(result).toBe(3)
    expect(Number.isNaN(result)).toBe(false)
  })

  it('ignores negative currentBlockElapsedSeconds', () => {
    const plan = makePlan([3, 8])
    const exec = makeExec({
      activeBlockIndex: 1,
      status: 'ended_early',
      blockStatuses: [
        { blockId: 'block-0', status: 'completed' },
        { blockId: 'block-1', status: 'skipped' },
      ],
    })

    expect(computeActualDurationMinutes(exec, plan, -120)).toBe(3)
  })

  it('caps partial elapsed at the active block planned duration', () => {
    // If a stale timer from a different block somehow passes through, we should
    // never add more than one block's worth of partial time.
    const plan = makePlan([3, 8])
    const exec = makeExec({
      activeBlockIndex: 1,
      status: 'ended_early',
      blockStatuses: [
        { blockId: 'block-0', status: 'completed' },
        { blockId: 'block-1', status: 'skipped' },
      ],
    })

    // 99999 seconds would add absurd minutes; should be capped at block-1's 8*60=480s.
    const result = computeActualDurationMinutes(exec, plan, 99999)
    expect(result).toBe(3 + 8)
  })

  it('clamps when blockStatuses has more entries than plan.blocks', () => {
    const plan = makePlan([3, 8])
    const exec = makeExec({
      activeBlockIndex: 2,
      status: 'completed',
      blockStatuses: [
        { blockId: 'block-0', status: 'completed' },
        { blockId: 'block-1', status: 'completed' },
        { blockId: 'block-phantom', status: 'completed' },
      ],
    })

    // Only the first two entries have a corresponding plan block; the phantom
    // status must not contribute (it would crash otherwise without the clamp).
    expect(computeActualDurationMinutes(exec, plan)).toBe(11)
  })
})
