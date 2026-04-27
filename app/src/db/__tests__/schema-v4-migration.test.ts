import { beforeEach, describe, expect, it } from 'vitest'
import { db } from '../../db'
import type { ExecutionLog, SessionReview } from '../../db'
import { backfillOnboardingCompletedAt, backfillSessionReviewStatus } from '../migrations/backfills'

async function clearDb(): Promise<void> {
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

function baseV3Review(
  overrides: Partial<SessionReview> & { id: string; executionLogId: string },
): SessionReview {
  return {
    goodPasses: 0,
    totalAttempts: 0,
    submittedAt: 1_700_000_000_000,
    sessionRpe: null,
    ...overrides,
  }
}

function baseExecution(
  overrides: Partial<ExecutionLog> & { id: string; planId: string },
): ExecutionLog {
  return {
    status: 'completed',
    activeBlockIndex: 0,
    blockStatuses: [],
    startedAt: 1_700_000_000_000,
    completedAt: 1_700_000_000_000,
    ...overrides,
  }
}

describe('backfillSessionReviewStatus', () => {
  it("maps sessionRpe: 7 to status: 'submitted'", async () => {
    await db.sessionReviews.put(
      baseV3Review({
        id: 'review-7',
        executionLogId: 'exec-7',
        sessionRpe: 7,
      }),
    )

    await db.transaction('rw', db.sessionReviews, async (tx) => {
      await backfillSessionReviewStatus(tx)
    })

    const row = await db.sessionReviews.get('review-7')
    expect(row?.status).toBe('submitted')
  })

  it("maps sessionRpe: 0 to status: 'submitted' (0 is valid CR10)", async () => {
    await db.sessionReviews.put(
      baseV3Review({
        id: 'review-0',
        executionLogId: 'exec-0',
        sessionRpe: 0,
      }),
    )

    await db.transaction('rw', db.sessionReviews, async (tx) => {
      await backfillSessionReviewStatus(tx)
    })

    const row = await db.sessionReviews.get('review-0')
    expect(row?.status).toBe('submitted')
  })

  it("maps sessionRpe: null to status: 'skipped'", async () => {
    await db.sessionReviews.put(
      baseV3Review({
        id: 'review-null',
        executionLogId: 'exec-null',
        sessionRpe: null,
      }),
    )

    await db.transaction('rw', db.sessionReviews, async (tx) => {
      await backfillSessionReviewStatus(tx)
    })

    const row = await db.sessionReviews.get('review-null')
    expect(row?.status).toBe('skipped')
  })

  it("maps legacy sessionRpe: -1 sentinel to status: 'skipped'", async () => {
    await db.sessionReviews.put(
      baseV3Review({
        id: 'review-neg1',
        executionLogId: 'exec-neg1',
        // legacy v0a sentinel; type is `number | null` now but Dexie stores
        // whatever landed historically
        sessionRpe: -1 as unknown as number,
      }),
    )

    await db.transaction('rw', db.sessionReviews, async (tx) => {
      await backfillSessionReviewStatus(tx)
    })

    const row = await db.sessionReviews.get('review-neg1')
    expect(row?.status).toBe('skipped')
  })

  it('leaves a record with existing status untouched (defense-in-depth)', async () => {
    await db.sessionReviews.put(
      baseV3Review({
        id: 'review-preset',
        executionLogId: 'exec-preset',
        sessionRpe: null,
        status: 'submitted',
      }),
    )

    await db.transaction('rw', db.sessionReviews, async (tx) => {
      await backfillSessionReviewStatus(tx)
    })

    const row = await db.sessionReviews.get('review-preset')
    expect(row?.status).toBe('submitted')
  })

  it('no-ops on an empty sessionReviews table', async () => {
    await expect(
      db.transaction('rw', db.sessionReviews, async (tx) => {
        await backfillSessionReviewStatus(tx)
      }),
    ).resolves.toBeUndefined()

    const count = await db.sessionReviews.count()
    expect(count).toBe(0)
  })
})

describe('backfillOnboardingCompletedAt', () => {
  it('writes onboarding.completedAt when an ExecutionLog exists and key is absent', async () => {
    await db.executionLogs.put(baseExecution({ id: 'exec-1', planId: 'plan-1' }))

    await db.transaction('rw', db.storageMeta, db.executionLogs, async (tx) => {
      await backfillOnboardingCompletedAt(tx)
    })

    const row = await db.storageMeta.get('onboarding.completedAt')
    expect(row).toBeDefined()
    expect(typeof row?.value).toBe('number')
    expect(typeof row?.updatedAt).toBe('number')
  })

  it('does not overwrite an existing onboarding.completedAt', async () => {
    await db.executionLogs.put(baseExecution({ id: 'exec-2', planId: 'plan-2' }))
    await db.storageMeta.put({
      key: 'onboarding.completedAt',
      value: 1_234_567_890,
      updatedAt: 1_234_567_890,
    })

    await db.transaction('rw', db.storageMeta, db.executionLogs, async (tx) => {
      await backfillOnboardingCompletedAt(tx)
    })

    const row = await db.storageMeta.get('onboarding.completedAt')
    expect(row?.value).toBe(1_234_567_890)
  })

  it('no-ops when no ExecutionLog exists', async () => {
    await db.transaction('rw', db.storageMeta, db.executionLogs, async (tx) => {
      await backfillOnboardingCompletedAt(tx)
    })

    const row = await db.storageMeta.get('onboarding.completedAt')
    expect(row).toBeUndefined()
  })
})
