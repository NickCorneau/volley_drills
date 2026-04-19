import { beforeEach, describe, expect, it } from 'vitest'
import { db } from '../../db'
import type { ExecutionLog, SessionPlan, SessionPlanBlock } from '../../db'
import { swapActiveBlock } from '../session'

/**
 * Phase F Unit 4 (2026-04-19): `swapActiveBlock` atomically replaces
 * `plan.blocks[activeBlockIndex]` with the caller-supplied alternate
 * and increments `execution.swapCount`.
 *
 * Both writes (the plan mutation and the counter bump) land inside a
 * single `rw` transaction so the UI never observes a state where the
 * counter is ahead of the plan or vice versa.
 */

async function clearDb() {
  await Promise.all([
    db.sessionPlans.clear(),
    db.executionLogs.clear(),
  ])
}

function makePlan(): SessionPlan {
  return {
    id: 'plan-swap',
    presetId: 'solo_wall',
    presetName: 'Solo + Wall',
    playerCount: 1,
    blocks: [
      {
        id: 'b-0',
        type: 'warmup',
        drillName: 'Beach Prep',
        shortName: 'Warm',
        durationMinutes: 3,
        coachingCue: '',
        courtsideInstructions: '',
        required: true,
      },
      {
        id: 'b-1',
        type: 'main_skill',
        drillName: 'Original Drill',
        shortName: 'Orig',
        durationMinutes: 10,
        coachingCue: '',
        courtsideInstructions: '',
        required: true,
      },
      {
        id: 'b-2',
        type: 'wrap',
        drillName: 'Downshift',
        shortName: 'Down',
        durationMinutes: 2,
        coachingCue: '',
        courtsideInstructions: '',
        required: true,
      },
    ],
    safetyCheck: { painFlag: false, heatCta: false, painOverridden: false },
    context: {
      playerMode: 'solo',
      timeProfile: 15,
      netAvailable: false,
      wallAvailable: true,
    },
    createdAt: 1_700_000_000_000,
  }
}

function makeExec(activeBlockIndex = 1): ExecutionLog {
  return {
    id: 'exec-swap',
    planId: 'plan-swap',
    status: 'in_progress',
    activeBlockIndex,
    blockStatuses: [
      { blockId: 'b-0', status: 'completed' },
      { blockId: 'b-1', status: 'in_progress' },
      { blockId: 'b-2', status: 'planned' },
    ],
    startedAt: 1_700_000_000_000,
  }
}

const REPLACEMENT: SessionPlanBlock = {
  id: 'b-1',
  type: 'main_skill',
  drillName: 'Swapped Drill',
  shortName: 'Swap',
  durationMinutes: 10,
  coachingCue: 'swapped cue',
  courtsideInstructions: 'swapped instructions',
  required: true,
}

describe('swapActiveBlock (Phase F Unit 4)', () => {
  beforeEach(async () => {
    await clearDb()
  })

  it('replaces plan.blocks[activeBlockIndex] with the supplied alternate', async () => {
    const plan = makePlan()
    const exec = makeExec(1)
    await db.sessionPlans.put(plan)
    await db.executionLogs.put(exec)

    const { updatedPlan } = await swapActiveBlock(exec, plan, REPLACEMENT)

    expect(updatedPlan.blocks[1]).toEqual(REPLACEMENT)
    // Other blocks untouched.
    expect(updatedPlan.blocks[0].drillName).toBe('Beach Prep')
    expect(updatedPlan.blocks[2].drillName).toBe('Downshift')

    // Persisted shape matches.
    const persisted = await db.sessionPlans.get('plan-swap')
    expect(persisted!.blocks[1].drillName).toBe('Swapped Drill')
  })

  it('increments execution.swapCount from undefined (first swap) to 1', async () => {
    const plan = makePlan()
    const exec = makeExec(1)
    await db.sessionPlans.put(plan)
    await db.executionLogs.put(exec)

    const { updatedExecution } = await swapActiveBlock(
      exec,
      plan,
      REPLACEMENT,
    )
    expect(updatedExecution.swapCount).toBe(1)

    const persisted = await db.executionLogs.get('exec-swap')
    expect(persisted!.swapCount).toBe(1)
  })

  it('increments swapCount across successive calls (1 -> 2 -> 3)', async () => {
    const plan = makePlan()
    const exec = makeExec(1)
    await db.sessionPlans.put(plan)
    await db.executionLogs.put(exec)

    const r1 = await swapActiveBlock(exec, plan, REPLACEMENT)
    expect(r1.updatedExecution.swapCount).toBe(1)

    const r2 = await swapActiveBlock(r1.updatedExecution, r1.updatedPlan, {
      ...REPLACEMENT,
      drillName: 'Swapped Drill 2',
    })
    expect(r2.updatedExecution.swapCount).toBe(2)

    const r3 = await swapActiveBlock(r2.updatedExecution, r2.updatedPlan, {
      ...REPLACEMENT,
      drillName: 'Swapped Drill 3',
    })
    expect(r3.updatedExecution.swapCount).toBe(3)
  })

  it('preserves blockStatuses (indexes stay aligned, status values untouched)', async () => {
    const plan = makePlan()
    const exec = makeExec(1)
    await db.sessionPlans.put(plan)
    await db.executionLogs.put(exec)

    const { updatedExecution } = await swapActiveBlock(
      exec,
      plan,
      REPLACEMENT,
    )
    expect(updatedExecution.blockStatuses).toEqual(exec.blockStatuses)
  })

  it('preserves the block id across the swap so blockStatuses still pair up', async () => {
    const plan = makePlan()
    const exec = makeExec(1)
    await db.sessionPlans.put(plan)
    await db.executionLogs.put(exec)

    const { updatedPlan, updatedExecution } = await swapActiveBlock(
      exec,
      plan,
      REPLACEMENT,
    )

    // Block id stays 'b-1' — preserves the pairing with
    // blockStatuses[1].blockId === 'b-1'.
    expect(updatedPlan.blocks[1].id).toBe('b-1')
    expect(updatedExecution.blockStatuses[1].blockId).toBe('b-1')
  })

  it('atomic write: plan mutation and swapCount bump land together on the same call', async () => {
    const plan = makePlan()
    const exec = makeExec(1)
    await db.sessionPlans.put(plan)
    await db.executionLogs.put(exec)

    await swapActiveBlock(exec, plan, REPLACEMENT)

    const persistedPlan = await db.sessionPlans.get('plan-swap')
    const persistedExec = await db.executionLogs.get('exec-swap')
    // If the transaction failed mid-flight we would see one updated and
    // the other stale. Both reads confirm the atomic write succeeded.
    expect(persistedPlan!.blocks[1].drillName).toBe('Swapped Drill')
    expect(persistedExec!.swapCount).toBe(1)
  })
})
