import { beforeEach, describe, expect, it } from 'vitest'
import { db } from '../../db'
import type { ExecutionLog, SessionPlan } from '../../db'
import { buildDraft } from '../../domain/sessionBuilder'
import {
  computeActualDurationMinutes,
  createSessionFromDraft,
  expireStaleReviews,
  findPendingReview,
  findResumableSession,
  getCurrentDraft,
  getLastComplete,
  getLastContext,
  hasEverStartedSession,
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
    db.storageMeta.clear(),
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
    expect(plan[0].assemblySeed).toBe(draft!.assemblySeed)
    expect(plan[0].assemblyAlgorithmVersion).toBe(draft!.assemblyAlgorithmVersion)
    expect(plan[0].safetyCheck.trainingRecency).toBe('1 day')
    expect(execution[0].blockStatuses).toHaveLength(draft!.blocks.length)
    expect(plan[0].blocks.map((b) => b.drillId)).toEqual(draft!.blocks.map((b) => b.drillId))
    expect(plan[0].blocks.map((b) => b.variantId)).toEqual(draft!.blocks.map((b) => b.variantId))

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

  it('findPendingReview returns the latest unreviewed session within the 2h cap and skipReview clears it', async () => {
    // V0B-31 / D120: findPendingReview enforces the 2 h Finish Later cap by
    // end-time. Use `now`-relative timestamps so the records fall inside it.
    const now = Date.now()
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
        startedAt: now - 30 * 60_000,
        completedAt: now - 25 * 60_000,
      },
      {
        id: 'exec-new',
        planId: 'plan-1',
        status: 'ended_early',
        activeBlockIndex: 0,
        blockStatuses: [],
        startedAt: now - 10 * 60_000,
        completedAt: now - 5 * 60_000,
      },
    ])

    const pending = await findPendingReview()
    expect(pending?.executionId).toBe('exec-new')

    await skipReview('exec-new')
    const nextPending = await findPendingReview()
    expect(nextPending?.executionId).toBe('exec-old')
  })

  it('findPendingReview returns a log whose only review is status: draft (A1)', async () => {
    const now = Date.now()
    await db.sessionPlans.put({
      id: 'plan-draft',
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
    await db.executionLogs.put({
      id: 'exec-draft',
      planId: 'plan-draft',
      status: 'completed',
      activeBlockIndex: 0,
      blockStatuses: [],
      startedAt: now - 10 * 60_000,
      completedAt: now - 5 * 60_000,
    })
    await db.sessionReviews.put({
      id: 'review-exec-draft',
      executionLogId: 'exec-draft',
      sessionRpe: 5,
      goodPasses: 0,
      totalAttempts: 0,
      submittedAt: now - 2 * 60_000,
      status: 'draft',
    })

    const pending = await findPendingReview(now)
    expect(pending?.executionId).toBe('exec-draft')
  })

  it('findPendingReview skips a discarded-resume log (A8)', async () => {
    const now = Date.now()
    await db.sessionPlans.put({
      id: 'plan-discarded',
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
    await db.executionLogs.put({
      id: 'exec-discarded',
      planId: 'plan-discarded',
      status: 'ended_early',
      activeBlockIndex: 0,
      blockStatuses: [],
      startedAt: now - 10 * 60_000,
      completedAt: now - 5 * 60_000,
      endedEarlyReason: 'discarded_resume',
    })

    const pending = await findPendingReview(now)
    expect(pending).toBeNull()
  })

  it('expireStaleReviews overwrites a past-cap draft with a skipped stub (A1)', async () => {
    const now = Date.now()
    await db.sessionPlans.put({
      id: 'plan-stale-draft',
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
    await db.executionLogs.put({
      id: 'exec-stale-draft',
      planId: 'plan-stale-draft',
      status: 'completed',
      activeBlockIndex: 0,
      blockStatuses: [],
      startedAt: now - 3 * 60 * 60_000,
      completedAt: now - 3 * 60 * 60_000,
    })
    await db.sessionReviews.put({
      id: 'review-exec-stale-draft',
      executionLogId: 'exec-stale-draft',
      sessionRpe: 6,
      goodPasses: 4,
      totalAttempts: 7,
      submittedAt: now - 2 * 60 * 60_000,
      status: 'draft',
    })

    const expired = await expireStaleReviews(now)
    expect(expired).toBe(1)

    const terminal = await db.sessionReviews
      .where('executionLogId')
      .equals('exec-stale-draft')
      .first()
    expect(terminal?.status).toBe('skipped')
    expect(terminal?.quickTags).toContain('expired')
    // Draft payload is preserved into the terminal stub (adv-1/adv-2 fix).
    // Adaptation-engine ignorance is guaranteed by captureWindow='expired'
    // + eligibleForAdaptation=false + status='skipped', so we can safely
    // keep the tester's data around for honest V0B-15 export / history.
    expect(terminal?.captureWindow).toBe('expired')
    expect(terminal?.eligibleForAdaptation).toBe(false)
    expect(terminal?.sessionRpe).toBe(6)
    expect(terminal?.goodPasses).toBe(4)
    expect(terminal?.totalAttempts).toBe(7)
  })

  it('expireStaleReviews continues past a single failing record and still expires the rest (rel-6 fix)', async () => {
    const { expireReview } = await import('../review')
    const now = Date.now()
    // Seed two past-cap logs with no reviews. Stub expireReview to fail
    // once (first call) then succeed. Without per-record try/catch, the
    // first rejection would abort the whole sweep and the second log
    // would never get a stub.
    for (const suffix of ['a', 'b']) {
      await db.sessionPlans.put({
        id: `plan-${suffix}`,
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
      await db.executionLogs.put({
        id: `exec-${suffix}`,
        planId: `plan-${suffix}`,
        status: 'completed',
        activeBlockIndex: 0,
        blockStatuses: [],
        startedAt: now - 3 * 60 * 60_000,
        completedAt: now - 3 * 60 * 60_000,
      })
    }

    const { vi } = await import('vitest')
    const reviewModule = await import('../review')
    const realExpire = expireReview
    let calls = 0
    const spy = vi.spyOn(reviewModule, 'expireReview').mockImplementation(async (data) => {
      calls += 1
      if (calls === 1) {
        throw new Error('simulated transient IDB failure on exec-a')
      }
      return realExpire(data)
    })

    try {
      const expired = await expireStaleReviews(now)
      // The second log must have been processed despite the first failure.
      expect(calls).toBe(2)
      expect(expired).toBe(1) // second call succeeded; first rejected
      const recordB = await db.sessionReviews.where('executionLogId').equals('exec-b').first()
      expect(recordB?.status).toBe('skipped')
    } finally {
      spy.mockRestore()
    }
  })

  it('getLastComplete returns null on an empty DB', async () => {
    expect(await getLastComplete()).toBeNull()
  })

  // ---- hasEverStartedSession: gates the "First time" recency chip ----
  //
  // Semantic: has the tester ever created an ExecutionLog in this app
  // install? Any terminal or in-progress log counts. A discarded-resume
  // log still counts - the tester engaged with the app even if they
  // bailed. Returns `false` only for a truly fresh install where no
  // ExecutionLog rows exist at all.
  it('hasEverStartedSession returns false on an empty DB (genuine first install)', async () => {
    expect(await hasEverStartedSession()).toBe(false)
  })

  it('hasEverStartedSession returns true when any ExecutionLog exists (completed)', async () => {
    const now = Date.now()
    await db.executionLogs.put({
      id: 'exec-any',
      planId: 'plan-any',
      status: 'completed',
      activeBlockIndex: 0,
      blockStatuses: [],
      startedAt: now - 20 * 60_000,
      completedAt: now - 5 * 60_000,
    })
    expect(await hasEverStartedSession()).toBe(true)
  })

  it('hasEverStartedSession returns true for a discarded-resume log too', async () => {
    // Contract: the tester engaged with the app even if they bailed.
    // A discard still means "no longer a first-timer" for the Safety
    // recency-chip affordance.
    const now = Date.now()
    await db.executionLogs.put({
      id: 'exec-discarded',
      planId: 'plan-any',
      status: 'ended_early',
      activeBlockIndex: 0,
      blockStatuses: [],
      startedAt: now - 30 * 60_000,
      completedAt: now - 10 * 60_000,
      endedEarlyReason: 'discarded_resume',
    })
    expect(await hasEverStartedSession()).toBe(true)
  })

  it('hasEverStartedSession returns true for an in-progress (resumable) log', async () => {
    const now = Date.now()
    await db.executionLogs.put({
      id: 'exec-inprog',
      planId: 'plan-any',
      status: 'in_progress',
      activeBlockIndex: 0,
      blockStatuses: [],
      startedAt: now - 10 * 60_000,
      pausedAt: now - 5 * 60_000,
    })
    expect(await hasEverStartedSession()).toBe(true)
  })

  it('getLastComplete returns the newest terminal log with a submitted/skipped review', async () => {
    const now = Date.now()
    // Three terminal logs; one with a submitted review, one with a skipped
    // review, one with NO review. Newest of the two finalized ones should win.
    await db.sessionPlans.put({
      id: 'plan-last',
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
        id: 'exec-old-submitted',
        planId: 'plan-last',
        status: 'completed',
        activeBlockIndex: 0,
        blockStatuses: [],
        startedAt: now - 3 * 60 * 60_000,
        completedAt: now - 2 * 60 * 60_000,
      },
      {
        id: 'exec-newer-skipped',
        planId: 'plan-last',
        status: 'completed',
        activeBlockIndex: 0,
        blockStatuses: [],
        startedAt: now - 30 * 60_000,
        completedAt: now - 25 * 60_000,
      },
      {
        id: 'exec-newest-no-review',
        planId: 'plan-last',
        status: 'completed',
        activeBlockIndex: 0,
        blockStatuses: [],
        startedAt: now - 10 * 60_000,
        completedAt: now - 5 * 60_000,
      },
    ])

    await db.sessionReviews.bulkPut([
      {
        id: 'review-exec-old-submitted',
        executionLogId: 'exec-old-submitted',
        sessionRpe: 6,
        goodPasses: 8,
        totalAttempts: 12,
        submittedAt: now - 2 * 60 * 60_000 + 60_000,
        status: 'submitted',
      },
      {
        id: 'review-exec-newer-skipped',
        executionLogId: 'exec-newer-skipped',
        sessionRpe: null,
        goodPasses: 0,
        totalAttempts: 0,
        quickTags: ['skipped'],
        submittedAt: now - 24 * 60_000,
        status: 'skipped',
      },
    ])

    const last = await getLastComplete()
    expect(last).not.toBeNull()
    // Newer-skipped beats older-submitted by completedAt; the newest log
    // with no review is ignored (not finalized).
    expect(last!.log.id).toBe('exec-newer-skipped')
    expect(last!.review.status).toBe('skipped')
    expect(last!.plan.id).toBe('plan-last')
  })

  it('getLastComplete skips a log whose only review is status: draft (not yet terminal)', async () => {
    const now = Date.now()
    await db.sessionPlans.put({
      id: 'plan-draft-only',
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
    await db.executionLogs.put({
      id: 'exec-draft-only',
      planId: 'plan-draft-only',
      status: 'completed',
      activeBlockIndex: 0,
      blockStatuses: [],
      startedAt: now - 10 * 60_000,
      completedAt: now - 5 * 60_000,
    })
    await db.sessionReviews.put({
      id: 'review-exec-draft-only',
      executionLogId: 'exec-draft-only',
      sessionRpe: 4,
      goodPasses: 2,
      totalAttempts: 5,
      submittedAt: now - 3 * 60_000,
      status: 'draft',
    })

    const last = await getLastComplete()
    expect(last).toBeNull()
  })

  it('getLastComplete excludes discarded-resume logs (A8 consistency)', async () => {
    const now = Date.now()
    await db.sessionPlans.put({
      id: 'plan-discarded-lc',
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
    await db.executionLogs.put({
      id: 'exec-discarded-lc',
      planId: 'plan-discarded-lc',
      status: 'ended_early',
      activeBlockIndex: 0,
      blockStatuses: [],
      startedAt: now - 10 * 60_000,
      completedAt: now - 5 * 60_000,
      endedEarlyReason: 'discarded_resume',
    })
    // Even if somehow a submitted review is attached, the log's
    // discarded-resume status means the LastComplete card should never
    // offer a Repeat of that session - the user explicitly abandoned it.
    await db.sessionReviews.put({
      id: 'review-exec-discarded-lc',
      executionLogId: 'exec-discarded-lc',
      sessionRpe: 5,
      goodPasses: 1,
      totalAttempts: 2,
      submittedAt: now - 4 * 60_000,
      status: 'submitted',
    })

    const last = await getLastComplete()
    expect(last).toBeNull()
  })

  it('expireStaleReviews skips a past-cap discarded-resume log (A8)', async () => {
    const now = Date.now()
    await db.sessionPlans.put({
      id: 'plan-discarded-stale',
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
    await db.executionLogs.put({
      id: 'exec-discarded-stale',
      planId: 'plan-discarded-stale',
      status: 'ended_early',
      activeBlockIndex: 0,
      blockStatuses: [],
      startedAt: now - 3 * 60 * 60_000,
      completedAt: now - 3 * 60 * 60_000,
      endedEarlyReason: 'discarded_resume',
    })

    const expired = await expireStaleReviews(now)
    expect(expired).toBe(0)

    const review = await db.sessionReviews
      .where('executionLogId')
      .equals('exec-discarded-stale')
      .first()
    expect(review).toBeUndefined()
  })

  it('findPendingReview ignores unreviewed sessions past the 2h Finish Later cap', async () => {
    // V0B-31 / D120: a session that ended more than 2 h ago should not be
    // returned to the home pending-review state. expireStaleReviews()
    // finalizes it as a terminal expired stub on the next home resolve.
    const now = Date.now()
    await db.sessionPlans.put({
      id: 'plan-expired',
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

    await db.executionLogs.put({
      id: 'exec-stale',
      planId: 'plan-expired',
      status: 'completed',
      activeBlockIndex: 0,
      blockStatuses: [],
      startedAt: now - 5 * 60 * 60_000,
      completedAt: now - 5 * 60 * 60_000,
    })

    const pending = await findPendingReview(now)
    expect(pending).toBeNull()
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

describe('createSessionFromDraft: lastPlayerMode write (Phase F Unit 2)', () => {
  beforeEach(async () => {
    await db.sessionPlans.clear()
    await db.executionLogs.clear()
    await db.sessionDrafts.clear()
    await db.storageMeta.clear()
  })

  it('persists storageMeta.lastPlayerMode === "solo" for a solo draft', async () => {
    const draft = buildDraft({
      playerMode: 'solo',
      timeProfile: 15,
      netAvailable: false,
      wallAvailable: true,
    })
    expect(draft).not.toBeNull()
    await saveDraft(draft!)
    await createSessionFromDraft({
      draft: draft!,
      painFlag: false,
      trainingRecency: '1 day',
      heatCta: false,
      painOverridden: false,
    })

    const row = await db.storageMeta.get('lastPlayerMode')
    expect(row).toBeDefined()
    expect(row!.value).toBe('solo')
  })

  it('persists storageMeta.lastPlayerMode === "pair" for a pair draft', async () => {
    const draft = buildDraft({
      playerMode: 'pair',
      timeProfile: 25,
      netAvailable: true,
      wallAvailable: false,
    })
    expect(draft).not.toBeNull()
    await saveDraft(draft!)
    await createSessionFromDraft({
      draft: draft!,
      painFlag: false,
      trainingRecency: '1 day',
      heatCta: false,
      painOverridden: false,
    })

    const row = await db.storageMeta.get('lastPlayerMode')
    expect(row).toBeDefined()
    expect(row!.value).toBe('pair')
  })

  it('lastPlayerMode write shares its updatedAt timestamp with the plan createdAt (single transaction)', async () => {
    const draft = buildDraft({
      playerMode: 'solo',
      timeProfile: 15,
      netAvailable: false,
      wallAvailable: true,
    })
    expect(draft).not.toBeNull()
    await saveDraft(draft!)
    await createSessionFromDraft({
      draft: draft!,
      painFlag: false,
      trainingRecency: '1 day',
      heatCta: false,
      painOverridden: false,
    })

    const plans = await db.sessionPlans.toArray()
    const row = await db.storageMeta.get('lastPlayerMode')
    expect(plans).toHaveLength(1)
    expect(row).toBeDefined()
    // Both writes capture the same `Date.now()` snapshot inside the
    // transaction - proves the atomic co-write rather than two
    // independent IDB ops that could race.
    expect(row!.updatedAt).toBe(plans[0].createdAt)
  })

  it('lastPlayerMode update overwrites the prior value on subsequent sessions (solo -> pair)', async () => {
    // First session: solo. Writes lastPlayerMode = 'solo'.
    const soloDraft = buildDraft({
      playerMode: 'solo',
      timeProfile: 15,
      netAvailable: false,
      wallAvailable: true,
    })
    await saveDraft(soloDraft!)
    await createSessionFromDraft({
      draft: soloDraft!,
      painFlag: false,
      heatCta: false,
      painOverridden: false,
    })
    expect((await db.storageMeta.get('lastPlayerMode'))!.value).toBe('solo')

    // Second session: pair. Overwrites to 'pair'.
    const pairDraft = buildDraft({
      playerMode: 'pair',
      timeProfile: 25,
      netAvailable: true,
      wallAvailable: false,
    })
    await saveDraft(pairDraft!)
    await createSessionFromDraft({
      draft: pairDraft!,
      painFlag: false,
      heatCta: false,
      painOverridden: false,
    })
    expect((await db.storageMeta.get('lastPlayerMode'))!.value).toBe('pair')
  })
})
