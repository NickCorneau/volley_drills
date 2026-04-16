import { beforeEach, describe, expect, it } from 'vitest'
import { db } from '../../db'
import type { SessionPlan } from '../../db'
import { buildDraft } from '../../domain/sessionBuilder'
import {
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
