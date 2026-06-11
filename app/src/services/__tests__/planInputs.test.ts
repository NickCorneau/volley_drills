import { db } from '../../db'
import { loadPlanInputs } from '../planInputs'
import type { SessionPlanBlock } from '../../db/types'

/**
 * Home-coherence: the executionLog -> sessionPlan join that feeds the
 * thin-spine formatters. Pins that the plan-ordering basis
 * (`trainedSessions`) is focus-attributed from terminal execution logs —
 * counting every session the user ran, review or not, while excluding
 * discarded-resume stubs — and that raw reviews still flow through for
 * the receipt's own eligibility filtering.
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

function mainSkillBlocks(drillName: string): SessionPlanBlock[] {
  return [
    {
      id: 'b1',
      type: 'main_skill',
      drillName,
      shortName: drillName,
      durationMinutes: 10,
      coachingCue: '',
      courtsideInstructions: '',
      required: true,
    },
  ]
}

async function seedSession(opts: {
  execId: string
  drillName: string
  submittedAt: number
  status?: 'submitted' | 'skipped'
  eligible?: boolean
  execStatus?: 'completed' | 'ended_early'
  endedEarlyReason?: string
  withReview?: boolean
  /** Default true: real sessions completed their block. False seeds a zero-work record. */
  blockCompleted?: boolean
}) {
  const planId = `plan-${opts.execId}`
  await db.sessionPlans.put({
    id: planId,
    presetId: 'solo_wall',
    presetName: 'Solo + Wall',
    playerCount: 1,
    blocks: mainSkillBlocks(opts.drillName),
    safetyCheck: { painFlag: false, heatCta: false, painOverridden: false },
    createdAt: 0,
  })
  await db.executionLogs.put({
    id: opts.execId,
    planId,
    status: opts.execStatus ?? 'completed',
    endedEarlyReason: opts.endedEarlyReason,
    activeBlockIndex: 0,
    blockStatuses:
      opts.blockCompleted === false
        ? [{ blockId: 'b1', status: 'skipped' }]
        : [{ blockId: 'b1', status: 'completed', completedAt: opts.submittedAt }],
    startedAt: opts.submittedAt,
    completedAt: opts.submittedAt,
  })
  if (opts.withReview === false) return
  await db.sessionReviews.put({
    id: `review-${opts.execId}`,
    executionLogId: opts.execId,
    sessionRpe: 5,
    goodPasses: 0,
    totalAttempts: 0,
    submittedAt: opts.submittedAt,
    status: opts.status ?? 'submitted',
    eligibleForAdaptation: opts.eligible ?? true,
  })
}

beforeEach(async () => {
  await clearDb()
})

describe('loadPlanInputs', () => {
  it('attributes terminal sessions to their plan focus via the join', async () => {
    await seedSession({ execId: 'e1', drillName: 'Continuous Passing', submittedAt: 100 })
    await seedSession({ execId: 'e2', drillName: 'First to 10 Serving', submittedAt: 200 })

    const { reviews, trainedSessions } = await loadPlanInputs()
    expect(reviews).toHaveLength(2)
    expect(trainedSessions).toEqual(
      expect.arrayContaining([
        { focus: 'pass', trainedAt: 100 },
        { focus: 'serve', trainedAt: 200 },
      ]),
    )
  })

  it('counts terminal sessions regardless of review status, but excludes discarded-resume stubs', async () => {
    // The plan-ordering basis is execution history: a skipped review or
    // even no review still counts (the user trained that focus); only a
    // discarded-resume stub is excluded (it was never a real session).
    await seedSession({ execId: 'ok', drillName: 'Continuous Passing', submittedAt: 100 })
    await seedSession({
      execId: 'skip',
      drillName: 'First to 10 Serving',
      submittedAt: 200,
      status: 'skipped',
    })
    await seedSession({
      execId: 'no-review',
      drillName: 'Continuous Passing',
      submittedAt: 300,
      withReview: false,
    })
    await seedSession({
      execId: 'discarded',
      drillName: 'Continuous Passing',
      submittedAt: 400,
      execStatus: 'ended_early',
      endedEarlyReason: 'discarded_resume',
      withReview: false,
    })

    const { trainedSessions } = await loadPlanInputs()
    expect(trainedSessions).toEqual(
      expect.arrayContaining([
        { focus: 'pass', trainedAt: 100 },
        { focus: 'serve', trainedAt: 200 },
        { focus: 'pass', trainedAt: 300 },
      ]),
    )
    expect(trainedSessions).toHaveLength(3)
    expect(trainedSessions.some((s) => s.trainedAt === 400)).toBe(false)
  })

  it('excludes zero-completed-block sessions from the trained basis (KTD2)', async () => {
    await seedSession({ execId: 'real', drillName: 'Continuous Passing', submittedAt: 100 })
    await seedSession({
      execId: 'zero-work',
      drillName: 'First to 10 Serving',
      submittedAt: 200,
      execStatus: 'ended_early',
      blockCompleted: false,
      withReview: false,
    })

    const { trainedSessions } = await loadPlanInputs()
    expect(trainedSessions).toEqual([{ focus: 'pass', trainedAt: 100 }])
  })

  it('returns empty trained sessions on a fresh DB', async () => {
    const { reviews, trainedSessions, lastAcceptedDelta } = await loadPlanInputs()
    expect(reviews).toEqual([])
    expect(trainedSessions).toEqual([])
    expect(lastAcceptedDelta).toBeNull()
  })

  it('surfaces the offered delta when the latest verdict was accepted', async () => {
    await seedSession({ execId: 'old', drillName: 'Continuous Passing', submittedAt: 100 })
    await seedSession({ execId: 'new', drillName: 'First to 10 Serving', submittedAt: 500 })
    await db.sessionReviews.update('review-old', {
      offeredDelta: { kind: 'stress', focus: 'pass', direction: 'less' },
      verdictChoice: 'kept_original',
    })
    await db.sessionReviews.update('review-new', {
      offeredDelta: { kind: 'stress', focus: 'serve', direction: 'more' },
      verdictChoice: 'accepted',
    })

    const { lastAcceptedDelta } = await loadPlanInputs()
    expect(lastAcceptedDelta).toEqual({ kind: 'stress', focus: 'serve', direction: 'more' })
  })

  it('a newer kept-original verdict supersedes an older accepted delta', async () => {
    await seedSession({ execId: 'old', drillName: 'Continuous Passing', submittedAt: 100 })
    await seedSession({ execId: 'new', drillName: 'First to 10 Serving', submittedAt: 500 })
    await db.sessionReviews.update('review-old', {
      offeredDelta: { kind: 'stress', focus: 'pass', direction: 'less' },
      verdictChoice: 'accepted',
    })
    // The user's most recent decision was to keep the original — the
    // earlier accepted delta must NOT keep showing on Home.
    await db.sessionReviews.update('review-new', {
      offeredDelta: { kind: 'stress', focus: 'serve', direction: 'more' },
      verdictChoice: 'kept_original',
    })

    const { lastAcceptedDelta } = await loadPlanInputs()
    expect(lastAcceptedDelta).toBeNull()
  })
})
