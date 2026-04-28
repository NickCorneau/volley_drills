import { beforeEach, describe, expect, it } from 'vitest'
import { db } from '../../db'
import type {
  ExecutionLog,
  PerDrillCapture,
  SessionPlan,
  SessionReview,
} from '../../model'

/**
 * U4 of the architecture pass — model layer round-trip.
 *
 * The DIP-fix in U4 demoted `db/` to a persistence adapter and made
 * `model/` the canonical home for product types. This test pins the
 * invariant that callers can author a value as a `model/` type, write
 * it through Dexie, and read it back as an equivalent `model/` value
 * with no fixture / shape changes. If a future commit accidentally
 * introduces a persistence-only field that callers must populate to
 * write, this test catches the regression at the services tier.
 *
 * Coverage choices:
 * - `SessionPlan` plus an `ExecutionLog` linking back: the most
 *   common shape in domain tests.
 * - `SessionReview` carrying a non-empty `perDrillCaptures` array:
 *   the U2 capture-domain payload that flows through Dexie.
 *
 * Why services tier (and not unit-domain): the round trip is meaningful
 * only when the persistence boundary participates. A pure-domain test
 * would just type-check assignability, which the TS compiler already
 * does on every other test.
 */

const PLAN_ID = 'plan-model-round-trip'
const EXEC_ID = 'exec-model-round-trip'

async function clearDb() {
  await Promise.all([
    db.sessionPlans.clear(),
    db.executionLogs.clear(),
    db.sessionReviews.clear(),
  ])
}

beforeEach(async () => {
  await clearDb()
})

describe('model ↔ persistence round-trip', () => {
  it('persists and reloads a SessionPlan equal to the model value', async () => {
    const plan: SessionPlan = {
      id: PLAN_ID,
      presetId: 'pair_open',
      presetName: 'Pair + Open',
      playerCount: 2,
      assemblySeed: 'seed-1',
      assemblyAlgorithmVersion: 1,
      blocks: [
        {
          id: 'block-warmup',
          type: 'warmup',
          drillId: 'd25',
          variantId: 'd25-any',
          drillName: 'Beach Prep',
          shortName: 'Warm up',
          durationMinutes: 5,
          coachingCue: 'Easy.',
          courtsideInstructions: 'Lower-half wake-up.',
          required: true,
        },
        {
          id: 'block-main',
          type: 'main_skill',
          drillId: 'd03',
          variantId: 'd03-pair',
          drillName: 'Continuous Passing',
          shortName: 'Continuous',
          durationMinutes: 8,
          coachingCue: 'Aim for partner.',
          courtsideInstructions: 'Pair pass continuous.',
          required: true,
        },
      ],
      safetyCheck: {
        painFlag: false,
        heatCta: false,
        painOverridden: false,
      },
      context: {
        playerMode: 'pair',
        timeProfile: 25,
        netAvailable: false,
        wallAvailable: false,
        wind: 'calm',
      },
      createdAt: 1_700_000_000_000,
    }

    await db.sessionPlans.put(plan)
    const loaded = await db.sessionPlans.get(PLAN_ID)

    expect(loaded).toEqual(plan)
  })

  it('persists and reloads an ExecutionLog equal to the model value', async () => {
    const log: ExecutionLog = {
      id: EXEC_ID,
      planId: PLAN_ID,
      status: 'completed',
      activeBlockIndex: 1,
      blockStatuses: [
        { blockId: 'block-warmup', status: 'completed', startedAt: 0, completedAt: 300_000 },
        { blockId: 'block-main', status: 'completed', startedAt: 300_000, completedAt: 780_000 },
      ],
      startedAt: 0,
      completedAt: 780_000,
      actualDurationMinutes: 13,
      swapCount: 0,
    }

    await db.executionLogs.put(log)
    const loaded = await db.executionLogs.get(EXEC_ID)

    expect(loaded).toEqual(log)
  })

  it('persists and reloads a SessionReview with perDrillCaptures equal to the model value', async () => {
    const captures: PerDrillCapture[] = [
      {
        drillId: 'd03',
        variantId: 'd03-pair',
        blockIndex: 0,
        difficulty: 'still_learning',
        capturedAt: 800_000,
        goodPasses: 6,
        attemptCount: 10,
      },
      {
        drillId: 'd03',
        variantId: 'd03-pair',
        blockIndex: 1,
        difficulty: 'too_hard',
        capturedAt: 1_500_000,
        notCaptured: true,
      },
    ]
    const review: SessionReview = {
      id: `review-${EXEC_ID}`,
      executionLogId: EXEC_ID,
      sessionRpe: 6,
      goodPasses: 6,
      totalAttempts: 10,
      perDrillCaptures: captures,
      submittedAt: 1_500_000,
      capturedAt: 1_500_000,
      captureDelaySeconds: 720,
      captureWindow: 'immediate',
      eligibleForAdaptation: true,
      status: 'submitted',
    }

    await db.sessionReviews.put(review)
    const loaded = await db.sessionReviews
      .where('executionLogId')
      .equals(EXEC_ID)
      .first()

    expect(loaded).toEqual(review)
    expect(loaded?.perDrillCaptures).toEqual(captures)
  })
})
