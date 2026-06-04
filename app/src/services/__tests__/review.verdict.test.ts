import { db } from '../../db'
import type { AdaptationDelta } from '../../db/types'
import { submitReview } from '../review'

/**
 * M002.1 U4 (D150/D151): verdict persistence on the SessionReview row.
 *
 * Pins:
 *   - `offeredDelta` + `verdictChoice` round-trip through submitReview.
 *   - A submit with no verdict leaves both fields undefined (older /
 *     keep-original rows read as "no verdict").
 *   - The schema opens at v7 (the labelled boundary), additive-only.
 *   - The A3 terminal-row guard still refuses to overwrite a verdict.
 */

const EXEC = 'exec-verdict-test'

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

async function seed() {
  await db.sessionPlans.put({
    id: `plan-${EXEC}`,
    presetId: 'solo_wall',
    presetName: 'Solo + Wall',
    playerCount: 1,
    blocks: [],
    safetyCheck: { painFlag: false, heatCta: false, painOverridden: false },
    createdAt: 0,
  })
  await db.executionLogs.put({
    id: EXEC,
    planId: `plan-${EXEC}`,
    status: 'completed',
    activeBlockIndex: 0,
    blockStatuses: [],
    startedAt: 0,
    completedAt: 0,
  })
}

const ACCEPTED_DELTA: AdaptationDelta = { kind: 'stress', focus: 'pass', direction: 'less' }

beforeEach(async () => {
  await clearDb()
  await seed()
})

describe('submitReview — verdict persistence (U4)', () => {
  it('round-trips offeredDelta + verdictChoice onto the terminal row', async () => {
    const result = await submitReview({
      executionLogId: EXEC,
      sessionRpe: 6,
      goodPasses: 0,
      totalAttempts: 0,
      offeredDelta: ACCEPTED_DELTA,
      verdictChoice: 'accepted',
      capturedAt: 1000,
    })
    expect(result.status).toBe('ok')

    const row = await db.sessionReviews.get(`review-${EXEC}`)
    expect(row?.offeredDelta).toEqual(ACCEPTED_DELTA)
    expect(row?.verdictChoice).toBe('accepted')
  })

  it('leaves both fields undefined when no verdict is supplied', async () => {
    await submitReview({
      executionLogId: EXEC,
      sessionRpe: 5,
      goodPasses: 0,
      totalAttempts: 0,
      capturedAt: 1000,
    })
    const row = await db.sessionReviews.get(`review-${EXEC}`)
    expect(row).toBeDefined()
    expect(row?.offeredDelta).toBeUndefined()
    expect(row?.verdictChoice).toBeUndefined()
  })

  it('opens the database at the v7 labelled boundary', () => {
    expect(db.verno).toBe(7)
  })

  it('does not overwrite an existing verdict (A3 terminal-row guard)', async () => {
    await submitReview({
      executionLogId: EXEC,
      sessionRpe: 6,
      goodPasses: 0,
      totalAttempts: 0,
      offeredDelta: ACCEPTED_DELTA,
      verdictChoice: 'accepted',
      capturedAt: 1000,
    })
    const second = await submitReview({
      executionLogId: EXEC,
      sessionRpe: 2,
      goodPasses: 0,
      totalAttempts: 0,
      verdictChoice: 'kept_original',
      capturedAt: 2000,
    })
    expect(second).toEqual({ status: 'refused', existingStatus: 'submitted' })
    const row = await db.sessionReviews.get(`review-${EXEC}`)
    expect(row?.verdictChoice).toBe('accepted')
  })
})
