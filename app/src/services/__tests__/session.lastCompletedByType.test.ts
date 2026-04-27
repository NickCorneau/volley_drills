import { beforeEach, describe, expect, it } from 'vitest'
import { db } from '../../db'
import type {
  ExecutionLogBlockStatus,
  ExecutionStatus,
  SessionPlan,
  SessionPlanBlock,
} from '../../db'
import { findLastCompletedDrillIdsByType } from '../session'

/**
 * Red-team remediation Phase 2.1 / 3.2: contract tests for the
 * build-time substitution input.
 * `findLastCompletedDrillIdsByType` is the only piece of session
 * history the build path consults; everything else stays pure. The
 * query must:
 *   - return {} on a fresh install
 *   - skip non-terminal sessions and discarded-resume stubs
 *   - skip blocks whose status is not `completed`
 *   - skip legacy blocks that lack `drillId`
 *   - prefer the most recently completed block per type by
 *     `blockStatus.completedAt`, falling back to session end time
 *   - bound work to `recencyLimit` recent terminal sessions
 *   - tolerate plans that are missing for a given executionLog
 *
 * If the contract changes, the build-time wiring in `buildDraft`
 * must be audited - this query is the substitution rule key.
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

function makeBlock(overrides: Partial<SessionPlanBlock>): SessionPlanBlock {
  return {
    id: 'b',
    type: 'warmup',
    drillName: 'placeholder',
    shortName: 'placeholder',
    durationMinutes: 5,
    coachingCue: '',
    courtsideInstructions: '',
    required: true,
    ...overrides,
  }
}

function makePlan(id: string, blocks: SessionPlanBlock[], createdAt: number = 0): SessionPlan {
  return {
    id,
    presetId: 'solo_wall',
    presetName: 'Solo + Wall',
    playerCount: 1,
    blocks,
    safetyCheck: { painFlag: false, heatCta: false, painOverridden: false },
    createdAt,
  }
}

interface ExecOpts {
  id: string
  planId: string
  status: ExecutionStatus
  startedAt: number
  completedAt?: number
  endedEarlyReason?: string
  blockOverrides?: Record<number, SessionPlanBlock>
  blockStatuses: ExecutionLogBlockStatus[]
}

async function seedExec(opts: ExecOpts) {
  await db.executionLogs.put({
    id: opts.id,
    planId: opts.planId,
    status: opts.status,
    activeBlockIndex: 0,
    blockStatuses: opts.blockStatuses,
    startedAt: opts.startedAt,
    completedAt: opts.completedAt,
    endedEarlyReason: opts.endedEarlyReason,
    blockOverrides: opts.blockOverrides,
  })
}

beforeEach(async () => {
  await clearDb()
})

describe('findLastCompletedDrillIdsByType', () => {
  it('returns {} on a fresh install', async () => {
    expect(await findLastCompletedDrillIdsByType()).toEqual({})
  })

  it('returns the drillId of a completed main_skill block under the main_skill key', async () => {
    const plan = makePlan('p1', [
      makeBlock({ id: 'p1-b0', type: 'warmup' }),
      makeBlock({
        id: 'p1-b1',
        type: 'main_skill',
        drillId: 'd03',
        variantId: 'd03-pair',
        drillName: 'Continuous Passing',
      }),
      makeBlock({ id: 'p1-b2', type: 'wrap' }),
    ])
    await db.sessionPlans.put(plan)
    await seedExec({
      id: 'e1',
      planId: 'p1',
      status: 'completed',
      startedAt: 1000,
      completedAt: 2000,
      blockStatuses: [
        { blockId: 'p1-b0', status: 'completed', completedAt: 1100 },
        { blockId: 'p1-b1', status: 'completed', completedAt: 1500 },
        { blockId: 'p1-b2', status: 'completed', completedAt: 2000 },
      ],
    })

    const result = await findLastCompletedDrillIdsByType()
    expect(result.main_skill).toBe('d03')
  })

  it('omits the main_skill key when the main_skill block was not completed', async () => {
    const plan = makePlan('p1', [
      makeBlock({
        id: 'p1-b1',
        type: 'main_skill',
        drillId: 'd03',
        variantId: 'd03-pair',
      }),
    ])
    await db.sessionPlans.put(plan)
    await seedExec({
      id: 'e1',
      planId: 'p1',
      status: 'completed',
      startedAt: 1000,
      completedAt: 2000,
      blockStatuses: [{ blockId: 'p1-b1', status: 'skipped' }],
    })

    const result = await findLastCompletedDrillIdsByType()
    expect(result.main_skill).toBeUndefined()
  })

  it('skips legacy blocks that lack a drillId', async () => {
    const plan = makePlan('p1', [
      makeBlock({
        id: 'p1-b1',
        type: 'main_skill',
        drillName: 'Continuous Passing (legacy)',
      }),
    ])
    await db.sessionPlans.put(plan)
    await seedExec({
      id: 'e1',
      planId: 'p1',
      status: 'completed',
      startedAt: 1000,
      completedAt: 2000,
      blockStatuses: [{ blockId: 'p1-b1', status: 'completed', completedAt: 1500 }],
    })

    expect(await findLastCompletedDrillIdsByType()).toEqual({})
  })

  it('returns multiple keys when different block types are completed', async () => {
    const plan = makePlan('p1', [
      makeBlock({
        id: 'p1-b1',
        type: 'technique',
        drillId: 'd09',
        variantId: 'd09-pair',
      }),
      makeBlock({
        id: 'p1-b2',
        type: 'main_skill',
        drillId: 'd03',
        variantId: 'd03-pair',
      }),
      makeBlock({
        id: 'p1-b3',
        type: 'pressure',
        drillId: 'd05',
        variantId: 'd05-solo',
      }),
    ])
    await db.sessionPlans.put(plan)
    await seedExec({
      id: 'e1',
      planId: 'p1',
      status: 'completed',
      startedAt: 1000,
      completedAt: 2000,
      blockStatuses: [
        { blockId: 'p1-b1', status: 'completed', completedAt: 1100 },
        { blockId: 'p1-b2', status: 'completed', completedAt: 1500 },
        { blockId: 'p1-b3', status: 'completed', completedAt: 1800 },
      ],
    })

    expect(await findLastCompletedDrillIdsByType()).toEqual({
      technique: 'd09',
      main_skill: 'd03',
      pressure: 'd05',
    })
  })

  it('returns the most-recently-completed drill per type across multiple sessions', async () => {
    await db.sessionPlans.bulkPut([
      makePlan('p1', [
        makeBlock({
          id: 'p1-b1',
          type: 'main_skill',
          drillId: 'd05',
          variantId: 'd05-solo',
        }),
      ]),
      makePlan('p2', [
        makeBlock({
          id: 'p2-b1',
          type: 'main_skill',
          drillId: 'd03',
          variantId: 'd03-pair',
        }),
      ]),
    ])
    await seedExec({
      id: 'e-old',
      planId: 'p1',
      status: 'completed',
      startedAt: 1000,
      completedAt: 2000,
      blockStatuses: [{ blockId: 'p1-b1', status: 'completed', completedAt: 1500 }],
    })
    await seedExec({
      id: 'e-new',
      planId: 'p2',
      status: 'completed',
      startedAt: 5000,
      completedAt: 6000,
      blockStatuses: [{ blockId: 'p2-b1', status: 'completed', completedAt: 5500 }],
    })

    const result = await findLastCompletedDrillIdsByType()
    expect(result.main_skill).toBe('d03')
  })

  it('excludes discarded-resume sessions even if they have completed blocks', async () => {
    await db.sessionPlans.put(
      makePlan('p1', [
        makeBlock({
          id: 'p1-b1',
          type: 'main_skill',
          drillId: 'd03',
          variantId: 'd03-pair',
        }),
      ]),
    )
    await seedExec({
      id: 'e-discarded',
      planId: 'p1',
      status: 'ended_early',
      endedEarlyReason: 'discarded_resume',
      startedAt: 1000,
      completedAt: 2000,
      blockStatuses: [{ blockId: 'p1-b1', status: 'completed', completedAt: 1500 }],
    })

    expect(await findLastCompletedDrillIdsByType()).toEqual({})
  })

  it('excludes non-terminal sessions (in_progress, paused, not_started)', async () => {
    await db.sessionPlans.put(
      makePlan('p1', [
        makeBlock({
          id: 'p1-b1',
          type: 'main_skill',
          drillId: 'd03',
          variantId: 'd03-pair',
        }),
      ]),
    )
    await seedExec({
      id: 'e-active',
      planId: 'p1',
      status: 'in_progress',
      startedAt: 1000,
      blockStatuses: [{ blockId: 'p1-b1', status: 'completed', completedAt: 1500 }],
    })

    expect(await findLastCompletedDrillIdsByType()).toEqual({})
  })

  it('falls back to session end time when blockStatus.completedAt is missing', async () => {
    await db.sessionPlans.bulkPut([
      makePlan('p1', [
        makeBlock({
          id: 'p1-b1',
          type: 'main_skill',
          drillId: 'd05',
          variantId: 'd05-solo',
        }),
      ]),
      makePlan('p2', [
        makeBlock({
          id: 'p2-b1',
          type: 'main_skill',
          drillId: 'd03',
          variantId: 'd03-pair',
        }),
      ]),
    ])
    await seedExec({
      id: 'e-old',
      planId: 'p1',
      status: 'completed',
      startedAt: 1000,
      completedAt: 2000,
      blockStatuses: [{ blockId: 'p1-b1', status: 'completed' }],
    })
    await seedExec({
      id: 'e-new',
      planId: 'p2',
      status: 'completed',
      startedAt: 5000,
      completedAt: 6000,
      blockStatuses: [{ blockId: 'p2-b1', status: 'completed' }],
    })

    const result = await findLastCompletedDrillIdsByType()
    expect(result.main_skill).toBe('d03')
  })

  it('respects recencyLimit by ignoring older terminal sessions', async () => {
    // Older session has main_skill = d05, newer session has d03.
    // With recencyLimit=1 only the newest session is considered, so
    // d05 must NOT leak through; with recencyLimit=2 both are
    // considered and the newer (d03) still wins on completedAt. The
    // first assertion is the bounding behaviour we care about.
    await db.sessionPlans.bulkPut([
      makePlan('p-old', [
        makeBlock({
          id: 'po-b1',
          type: 'main_skill',
          drillId: 'd05',
          variantId: 'd05-solo',
        }),
      ]),
      makePlan('p-new', [
        makeBlock({
          id: 'pn-b1',
          type: 'main_skill',
          drillId: 'd03',
          variantId: 'd03-pair',
        }),
      ]),
    ])
    await seedExec({
      id: 'e-old',
      planId: 'p-old',
      status: 'completed',
      startedAt: 1000,
      completedAt: 2000,
      blockStatuses: [{ blockId: 'po-b1', status: 'completed', completedAt: 1500 }],
    })
    await seedExec({
      id: 'e-new',
      planId: 'p-new',
      status: 'completed',
      startedAt: 5000,
      completedAt: 6000,
      blockStatuses: [{ blockId: 'pn-b1', status: 'completed', completedAt: 5500 }],
    })

    const limited = await findLastCompletedDrillIdsByType(1)
    expect(limited.main_skill).toBe('d03')

    const unlimited = await findLastCompletedDrillIdsByType(10)
    expect(unlimited.main_skill).toBe('d03')
  })

  it('tolerates orphaned execution logs whose plan row is missing', async () => {
    // Seed an execution log with no matching plan row, alongside a
    // healthy session. The orphan should be silently skipped, and
    // the healthy session's main_skill should still surface.
    await db.sessionPlans.put(
      makePlan('p-good', [
        makeBlock({
          id: 'pg-b1',
          type: 'main_skill',
          drillId: 'd03',
          variantId: 'd03-pair',
        }),
      ]),
    )
    await seedExec({
      id: 'e-orphan',
      planId: 'p-missing',
      status: 'completed',
      startedAt: 1000,
      completedAt: 2000,
      blockStatuses: [{ blockId: 'phantom', status: 'completed', completedAt: 1500 }],
    })
    await seedExec({
      id: 'e-good',
      planId: 'p-good',
      status: 'completed',
      startedAt: 5000,
      completedAt: 6000,
      blockStatuses: [{ blockId: 'pg-b1', status: 'completed', completedAt: 5500 }],
    })

    const result = await findLastCompletedDrillIdsByType()
    expect(result.main_skill).toBe('d03')
  })

  it('uses block overrides when identifying the most recently completed drill', async () => {
    const original = makeBlock({
      id: 'p1-b1',
      type: 'main_skill',
      drillId: 'd03',
      variantId: 'd03-pair',
    })
    const override = makeBlock({
      id: 'p1-b1',
      type: 'main_skill',
      drillId: 'd99',
      variantId: 'd99-solo',
      drillName: 'Swapped Drill',
    })
    await db.sessionPlans.put(makePlan('p1', [original]))
    await seedExec({
      id: 'e-swapped',
      planId: 'p1',
      status: 'completed',
      startedAt: 1000,
      completedAt: 2000,
      blockOverrides: { 0: override },
      blockStatuses: [{ blockId: 'p1-b1', status: 'completed', completedAt: 1500 }],
    })

    expect(await findLastCompletedDrillIdsByType()).toEqual({
      main_skill: 'd99',
    })

    const stored = await db.sessionPlans.get('p1')
    expect(stored?.blocks[0].drillId).toBe('d03')
  })
})
