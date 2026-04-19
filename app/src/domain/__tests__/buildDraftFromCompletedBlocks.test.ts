import { describe, expect, it } from 'vitest'
import type { ExecutionLog, SessionPlan } from '../../db'
import { buildDraftFromCompletedBlocks } from '../sessionBuilder'

/**
 * C-5 Unit 3: "Repeat what you did" rebuilds a draft from the subset of
 * plan blocks whose corresponding `ExecutionLog.blockStatuses[i].status`
 * is `completed`. Per-session safety answers are NOT carried (D83). The
 * block order from the original plan is preserved.
 */

function makePlan(
  blockSpecs: Array<{ id: string; minutes: number; type?: 'warmup' | 'main_skill' | 'wrap' }>,
): SessionPlan {
  return {
    id: 'plan-test',
    presetId: 'solo_wall',
    presetName: 'Solo + Wall',
    playerCount: 1,
    blocks: blockSpecs.map((b) => ({
      id: b.id,
      type: b.type ?? 'main_skill',
      drillName: `Drill ${b.id}`,
      shortName: b.id,
      durationMinutes: b.minutes,
      coachingCue: '',
      courtsideInstructions: '',
      required: true,
    })),
    safetyCheck: {
      painFlag: false,
      heatCta: false,
      painOverridden: false,
    },
    context: {
      playerMode: 'solo',
      timeProfile: 25,
      netAvailable: false,
      wallAvailable: true,
    },
    createdAt: 1,
  }
}

function makeLog(
  statuses: Array<'completed' | 'skipped' | 'in_progress' | 'planned'>,
  blockIds: string[],
): ExecutionLog {
  return {
    id: 'exec-test',
    planId: 'plan-test',
    status: 'ended_early',
    activeBlockIndex: 0,
    blockStatuses: statuses.map((status, i) => ({
      blockId: blockIds[i],
      status,
    })),
    startedAt: 1,
    completedAt: 2,
    endedEarlyReason: 'time',
  }
}

describe('buildDraftFromCompletedBlocks (C-5 Unit 3)', () => {
  it('filters plan blocks to only those marked completed, preserving order', () => {
    const plan = makePlan([
      { id: 'b-1', minutes: 3, type: 'warmup' },
      { id: 'b-2', minutes: 10, type: 'main_skill' },
      { id: 'b-3', minutes: 10, type: 'main_skill' },
      { id: 'b-4', minutes: 2, type: 'wrap' },
    ])
    const log = makeLog(
      ['completed', 'completed', 'skipped', 'in_progress'],
      ['b-1', 'b-2', 'b-3', 'b-4'],
    )

    const draft = buildDraftFromCompletedBlocks(log, plan)
    expect(draft).not.toBeNull()
    expect(draft!.blocks.map((b) => b.id)).toEqual(['b-1', 'b-2'])
    expect(draft!.blocks[0].durationMinutes).toBe(3)
    expect(draft!.blocks[1].durationMinutes).toBe(10)
  })

  it('preserves original block order even when completed blocks are non-contiguous', () => {
    const plan = makePlan([
      { id: 'b-1', minutes: 3 },
      { id: 'b-2', minutes: 5 },
      { id: 'b-3', minutes: 7 },
      { id: 'b-4', minutes: 11 },
    ])
    // Only b-1 and b-4 completed (weird but possible if user skipped mid-session).
    const log = makeLog(
      ['completed', 'skipped', 'skipped', 'completed'],
      ['b-1', 'b-2', 'b-3', 'b-4'],
    )

    const draft = buildDraftFromCompletedBlocks(log, plan)
    expect(draft!.blocks.map((b) => b.id)).toEqual(['b-1', 'b-4'])
  })

  it('returns null when zero blocks completed (nothing worth repeating)', () => {
    const plan = makePlan([
      { id: 'b-1', minutes: 3 },
      { id: 'b-2', minutes: 10 },
    ])
    const log = makeLog(['skipped', 'in_progress'], ['b-1', 'b-2'])

    expect(buildDraftFromCompletedBlocks(log, plan)).toBeNull()
  })

  it('returns null when the plan has no persisted context (can\u2019t honor Repeat)', () => {
    const plan = makePlan([{ id: 'b-1', minutes: 5 }])
    // Simulate a legacy v3 plan that was persisted before context was
    // captured on SessionPlan.
    delete (plan as Partial<SessionPlan>).context

    const log = makeLog(['completed'], ['b-1'])
    expect(buildDraftFromCompletedBlocks(log, plan)).toBeNull()
  })

  it('carries context from the plan (solo, 25 min, wall=true) onto the new draft', () => {
    const plan = makePlan([{ id: 'b-1', minutes: 5 }])
    const log = makeLog(['completed'], ['b-1'])

    const draft = buildDraftFromCompletedBlocks(log, plan)
    expect(draft!.context.playerMode).toBe('solo')
    expect(draft!.context.timeProfile).toBe(25)
    expect(draft!.context.wallAvailable).toBe(true)
  })

  it('is resilient to blockStatuses entries that don\u2019t match plan block IDs', () => {
    const plan = makePlan([
      { id: 'b-1', minutes: 3 },
      { id: 'b-2', minutes: 10 },
    ])
    // Stray entry with an unknown blockId (shouldn't matter — we
    // iterate the plan and index into statuses by position).
    const log: ExecutionLog = {
      ...makeLog(['completed', 'skipped'], ['b-1', 'b-2']),
      blockStatuses: [
        { blockId: 'b-1', status: 'completed' },
        { blockId: 'b-2', status: 'skipped' },
        { blockId: 'stray', status: 'completed' },
      ],
    }
    const draft = buildDraftFromCompletedBlocks(log, plan)
    expect(draft!.blocks.map((b) => b.id)).toEqual(['b-1'])
  })
})
