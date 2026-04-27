import { describe, expect, it } from 'vitest'
import {
  currentPersistedExecutionLog,
  currentPersistedPlan,
  currentPersistedReview,
  legacyPersistedPlan,
} from './persistedRecords'

describe('persisted record test fixtures', () => {
  it('creates current plans with explicit block identity', () => {
    const plan = currentPersistedPlan({
      id: 'plan-current',
      blocks: [
        {
          id: 'block-1',
          type: 'main_skill',
          drillId: 'd03',
          variantId: 'd03-pair',
        },
      ],
    })

    expect(plan.id).toBe('plan-current')
    expect(plan.blocks[0]).toMatchObject({
      id: 'block-1',
      type: 'main_skill',
      drillId: 'd03',
      variantId: 'd03-pair',
    })
  })

  it('creates legacy plans that intentionally omit block identity', () => {
    const plan = legacyPersistedPlan()

    expect(plan.blocks[0].drillId).toBeUndefined()
    expect(plan.blocks[0].variantId).toBeUndefined()
  })

  it('creates execution logs tied to the requested plan', () => {
    const log = currentPersistedExecutionLog({
      id: 'exec-current',
      planId: 'plan-current',
      status: 'completed',
      completedAt: 2000,
    })

    expect(log).toMatchObject({
      id: 'exec-current',
      planId: 'plan-current',
      status: 'completed',
      completedAt: 2000,
    })
    expect(log.blockStatuses[0].status).toBe('completed')
  })

  it('creates submitted reviews with adaptation-eligible timing fields', () => {
    const review = currentPersistedReview({
      id: 'review-current',
      executionLogId: 'exec-current',
      sessionRpe: 6,
    })

    expect(review).toMatchObject({
      id: 'review-current',
      executionLogId: 'exec-current',
      sessionRpe: 6,
      status: 'submitted',
      captureWindow: 'immediate',
      eligibleForAdaptation: true,
    })
  })
})
