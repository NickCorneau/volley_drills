import { beforeEach, describe, expect, it } from 'vitest'
import { db } from '../../db'
import { expireReview, submitReview } from '../../services/review'
import { skipReview } from '../../services/session'

// Historical filename: this started as the Phase C-0 v4 invariant suite.
// Keep the path stable for older docs, but assert the current v6 boundary
// (D134 / 2026-04-28 added the Phase 2A `metricCapture` field on a
// purely additive v6 migration; readers + writers continue to work
// against the same `perDrillCaptures` array path).

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

async function seedTerminalExec(
  executionLogId: string,
  completedAt: number = Date.now(),
): Promise<void> {
  await db.sessionPlans.put({
    id: `plan-${executionLogId}`,
    presetId: 'solo_wall',
    presetName: 'Solo + Wall',
    playerCount: 1,
    blocks: [],
    safetyCheck: {
      painFlag: false,
      heatCta: false,
      painOverridden: false,
    },
    createdAt: completedAt,
  })
  await db.executionLogs.put({
    id: executionLogId,
    planId: `plan-${executionLogId}`,
    status: 'completed',
    activeBlockIndex: 0,
    blockStatuses: [],
    startedAt: completedAt - 60_000,
    completedAt,
  })
}

beforeEach(async () => {
  await clearDb()
})

describe('writer contract: status emission (A5 / D-C7)', () => {
  it("submitReview writes status === 'submitted'", async () => {
    await seedTerminalExec('exec-submit')

    await submitReview({
      executionLogId: 'exec-submit',
      sessionRpe: 6,
      goodPasses: 18,
      totalAttempts: 25,
    })

    const review = await db.sessionReviews.where('executionLogId').equals('exec-submit').first()
    expect(review?.status).toBe('submitted')
  })

  it("expireReview writes status === 'skipped' AND quickTags === ['expired']", async () => {
    await seedTerminalExec('exec-expire')

    await expireReview({ executionLogId: 'exec-expire' })

    const review = await db.sessionReviews.where('executionLogId').equals('exec-expire').first()
    expect(review?.status).toBe('skipped')
    expect(review?.quickTags).toEqual(['expired'])
  })

  it("skipReview writes status === 'skipped' AND quickTags === ['skipped']", async () => {
    await seedTerminalExec('exec-skip')

    await skipReview('exec-skip')

    const review = await db.sessionReviews.where('executionLogId').equals('exec-skip').first()
    expect(review?.status).toBe('skipped')
    expect(review?.quickTags).toEqual(['skipped'])
  })

  it("writer-produced 'skipped' stubs carry goodPasses === 0 and totalAttempts === 0", async () => {
    await seedTerminalExec('exec-stub-1')
    await seedTerminalExec('exec-stub-2')

    await expireReview({ executionLogId: 'exec-stub-1' })
    await skipReview('exec-stub-2')

    const stubs = await Promise.all([
      db.sessionReviews.where('executionLogId').equals('exec-stub-1').first(),
      db.sessionReviews.where('executionLogId').equals('exec-stub-2').first(),
    ])

    for (const stub of stubs) {
      expect(stub?.status).toBe('skipped')
      expect(stub?.goodPasses).toBe(0)
      expect(stub?.totalAttempts).toBe(0)
      expect(stub?.sessionRpe).toBeNull()
    }
  })
})

describe('fresh v6 DB shape', () => {
  it('opens the current Dexie schema at version 6', () => {
    expect(db.verno).toBe(6)
  })

  it('has an empty storageMeta table', async () => {
    const count = await db.storageMeta.count()
    expect(count).toBe(0)
  })

  it('round-trips optional perDrillCaptures on SessionReview records', async () => {
    await seedTerminalExec('exec-per-drill')

    await db.sessionReviews.put({
      id: 'review-per-drill',
      executionLogId: 'exec-per-drill',
      sessionRpe: null,
      goodPasses: 0,
      totalAttempts: 0,
      submittedAt: Date.now(),
      status: 'draft',
      perDrillCaptures: [
        {
          drillId: 'd03',
          variantId: 'd03-pair',
          blockIndex: 1,
          difficulty: 'still_learning',
          goodPasses: 7,
          attemptCount: 10,
          capturedAt: Date.now(),
        },
      ],
    })

    const review = await db.sessionReviews.where('executionLogId').equals('exec-per-drill').first()
    expect(review?.perDrillCaptures).toEqual([
      expect.objectContaining({
        drillId: 'd03',
        variantId: 'd03-pair',
        blockIndex: 1,
        difficulty: 'still_learning',
        goodPasses: 7,
        attemptCount: 10,
      }),
    ])
  })
})

describe('storageMeta round-trip across primitive + structured values', () => {
  const cases: Array<{ label: string; value: unknown }> = [
    { label: 'string', value: 'onboarding:foundations' },
    { label: 'number', value: 1_700_000_000_000 },
    { label: 'boolean true', value: true },
    { label: 'boolean false', value: false },
    { label: 'empty string', value: '' },
    { label: 'zero', value: 0 },
    {
      label: 'nested object',
      value: { a: 1, b: { c: 'two', d: [3, 4, 5] } },
    },
    { label: 'array', value: [1, 'two', true] },
  ]

  for (const { label, value } of cases) {
    it(`round-trips ${label}`, async () => {
      await db.storageMeta.put({
        key: `case.${label}`,
        value,
        updatedAt: 0,
      })
      const row = await db.storageMeta.get(`case.${label}`)
      expect(row?.value).toEqual(value)
    })
  }
})
