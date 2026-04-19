import { beforeEach, describe, expect, it } from 'vitest'
import { db } from '../../db'
import { expireReview, submitReview } from '../review'
import { skipReview } from '../session'
import {
  clearSoftBlockDismissed,
  markSoftBlockDismissed,
  readSoftBlockDismissed,
} from '../softBlock'

/**
 * A7 (approved red-team fix plan v3) — soft-block modal dismissal is keyed
 * by executionId so the D-C1 Home modal fires at most once per pending
 * review instance. The cleanup side of A7 deletes the key in the same
 * A3 transaction that writes the terminal review, so `storageMeta` stays
 * bounded.
 */

const EXEC_A = 'exec-softblock-a'
const EXEC_B = 'exec-softblock-b'

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

async function seed(execId: string) {
  await db.sessionPlans.put({
    id: `plan-${execId}`,
    presetId: 'solo_wall',
    presetName: 'Solo + Wall',
    playerCount: 1,
    blocks: [],
    safetyCheck: { painFlag: false, heatCta: false, painOverridden: false },
    createdAt: 0,
  })
  await db.executionLogs.put({
    id: execId,
    planId: `plan-${execId}`,
    status: 'completed',
    activeBlockIndex: 0,
    blockStatuses: [],
    startedAt: 0,
    completedAt: 0,
  })
}

beforeEach(async () => {
  await clearDb()
})

describe('softBlock helpers', () => {
  it('readSoftBlockDismissed returns false on a never-marked execId', async () => {
    expect(await readSoftBlockDismissed(EXEC_A)).toBe(false)
  })

  it('mark -> read round-trip: true after mark, false after clear', async () => {
    await markSoftBlockDismissed(EXEC_A)
    expect(await readSoftBlockDismissed(EXEC_A)).toBe(true)

    await clearSoftBlockDismissed(EXEC_A)
    expect(await readSoftBlockDismissed(EXEC_A)).toBe(false)
  })

  it('marking one execId does not affect another', async () => {
    await markSoftBlockDismissed(EXEC_A)
    expect(await readSoftBlockDismissed(EXEC_A)).toBe(true)
    expect(await readSoftBlockDismissed(EXEC_B)).toBe(false)
  })
})

describe('A7 cleanup integration with terminal-review writers', () => {
  it('submitReview clears softBlockDismissed for the execId', async () => {
    await seed(EXEC_A)
    await markSoftBlockDismissed(EXEC_A)
    expect(await readSoftBlockDismissed(EXEC_A)).toBe(true)

    await submitReview({
      executionLogId: EXEC_A,
      sessionRpe: 6,
      goodPasses: 10,
      totalAttempts: 15,
    })

    expect(await readSoftBlockDismissed(EXEC_A)).toBe(false)
  })

  it('skipReview clears softBlockDismissed for the execId', async () => {
    await seed(EXEC_A)
    await markSoftBlockDismissed(EXEC_A)

    await skipReview(EXEC_A)

    expect(await readSoftBlockDismissed(EXEC_A)).toBe(false)
  })

  it('expireReview clears softBlockDismissed for the execId', async () => {
    await seed(EXEC_A)
    await markSoftBlockDismissed(EXEC_A)

    await expireReview({ executionLogId: EXEC_A })

    expect(await readSoftBlockDismissed(EXEC_A)).toBe(false)
  })

  it('A7 cleanup only fires for the execId the writer targets', async () => {
    await seed(EXEC_A)
    await seed(EXEC_B)
    await markSoftBlockDismissed(EXEC_A)
    await markSoftBlockDismissed(EXEC_B)

    await submitReview({
      executionLogId: EXEC_A,
      sessionRpe: 5,
      goodPasses: 8,
      totalAttempts: 10,
    })

    expect(await readSoftBlockDismissed(EXEC_A)).toBe(false)
    expect(await readSoftBlockDismissed(EXEC_B)).toBe(true)
  })

  it('refused submit does NOT clear softBlockDismissed (record stays because conflict was not the user canceling)', async () => {
    await seed(EXEC_A)
    // Existing terminal submitted review.
    await submitReview({
      executionLogId: EXEC_A,
      sessionRpe: 6,
      goodPasses: 5,
      totalAttempts: 10,
    })
    // Mark the soft-block AFTER the terminal write (simulating a user who
    // dismissed the modal later, then re-entered and tried to submit a
    // second time).
    await markSoftBlockDismissed(EXEC_A)

    const result = await submitReview({
      executionLogId: EXEC_A,
      sessionRpe: 9,
      goodPasses: 99,
      totalAttempts: 99,
    })

    // H19 result carries existingStatus so ReviewScreen can render
    // differentiated copy. For this test the existing is 'submitted'.
    expect(result).toEqual({ status: 'refused', existingStatus: 'submitted' })
    expect(await readSoftBlockDismissed(EXEC_A)).toBe(true)
  })
})
