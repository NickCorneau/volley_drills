import { db } from '../../db'
import { loadPlanInputs } from '../planInputs'
import type { SessionPlanBlock } from '../../db/types'

/**
 * M002.1 KTD10: the review -> executionLog -> sessionPlan join that
 * feeds the thin-spine formatters. Pins that eligible sessions are
 * focus-attributed from their plan blocks, and that ineligible / skipped
 * rows are excluded from the attributed set (but still returned in raw
 * reviews for the receipt's own filtering).
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
    status: 'completed',
    activeBlockIndex: 0,
    blockStatuses: [],
    startedAt: 0,
    completedAt: 0,
  })
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
  it('attributes eligible sessions to their plan focus via the join', async () => {
    await seedSession({ execId: 'e1', drillName: 'Continuous Passing', submittedAt: 100 })
    await seedSession({ execId: 'e2', drillName: 'First to 10 Serving', submittedAt: 200 })

    const { reviews, attributedSessions } = await loadPlanInputs()
    expect(reviews).toHaveLength(2)
    expect(attributedSessions).toEqual(
      expect.arrayContaining([
        { focus: 'pass', trainedAt: 100 },
        { focus: 'serve', trainedAt: 200 },
      ]),
    )
  })

  it('excludes skipped / ineligible rows from the attributed set but keeps them in raw reviews', async () => {
    await seedSession({ execId: 'ok', drillName: 'Continuous Passing', submittedAt: 100 })
    await seedSession({
      execId: 'skip',
      drillName: 'Continuous Passing',
      submittedAt: 200,
      status: 'skipped',
    })
    await seedSession({
      execId: 'late',
      drillName: 'Continuous Passing',
      submittedAt: 300,
      eligible: false,
    })

    const { reviews, attributedSessions } = await loadPlanInputs()
    expect(reviews).toHaveLength(3)
    expect(attributedSessions).toEqual([{ focus: 'pass', trainedAt: 100 }])
  })

  it('returns empty attributed sessions on a fresh DB', async () => {
    const { reviews, attributedSessions, lastAcceptedDelta } = await loadPlanInputs()
    expect(reviews).toEqual([])
    expect(attributedSessions).toEqual([])
    expect(lastAcceptedDelta).toBeNull()
  })

  it('surfaces the offered delta from the most recent accepted verdict', async () => {
    await seedSession({ execId: 'old', drillName: 'Continuous Passing', submittedAt: 100 })
    await seedSession({ execId: 'new', drillName: 'First to 10 Serving', submittedAt: 500 })
    await db.sessionReviews.update('review-old', {
      offeredDelta: { kind: 'stress', focus: 'pass', direction: 'less' },
      verdictChoice: 'accepted',
    })
    // newer review kept-original -> should NOT become the carry-forward
    await db.sessionReviews.update('review-new', {
      offeredDelta: { kind: 'stress', focus: 'serve', direction: 'more' },
      verdictChoice: 'kept_original',
    })

    const { lastAcceptedDelta } = await loadPlanInputs()
    expect(lastAcceptedDelta).toEqual({ kind: 'stress', focus: 'pass', direction: 'less' })
  })
})
