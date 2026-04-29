import { describe, expect, it } from 'vitest'
import type { ExecutionLog, SessionPlan } from '../../model'
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

  it('preserves stable drill and variant identity for completed blocks', () => {
    const plan = makePlan([{ id: 'b-1', minutes: 10, type: 'main_skill' }])
    plan.blocks[0].drillId = 'd03'
    plan.blocks[0].variantId = 'd03-pair'
    const log = makeLog(['completed'], ['b-1'])

    const draft = buildDraftFromCompletedBlocks(log, plan)

    expect(draft?.blocks[0].drillId).toBe('d03')
    expect(draft?.blocks[0].variantId).toBe('d03-pair')
  })

  it('preserves sub-block pacing for completed blocks', () => {
    const plan = makePlan([{ id: 'b-1', minutes: 3, type: 'warmup' }])
    plan.blocks[0].subBlockIntervalSeconds = 45
    const log = makeLog(['completed'], ['b-1'])

    const draft = buildDraftFromCompletedBlocks(log, plan)

    expect(draft?.blocks[0].subBlockIntervalSeconds).toBe(45)
  })

  /**
   * U1 of `docs/plans/2026-04-28-per-move-pacing-indicator.md`: the
   * `segments` snapshot field rides the same Repeat-what-you-did
   * carryover as `subBlockIntervalSeconds`. If any link in the
   * plumbing drops it, the segment indicator silently disappears
   * for repeated sessions.
   */
  it('preserves composed segments and bonus copy for completed blocks', () => {
    const plan = makePlan([{ id: 'b-1', minutes: 3, type: 'warmup' }])
    plan.blocks[0].segments = [
      { id: 'b-1-s1', label: 'Segment one', durationSec: 60 },
      { id: 'b-1-s2', label: 'Segment two', durationSec: 60 },
      { id: 'b-1-s3', label: 'Segment three', durationSec: 60 },
    ]
    plan.blocks[0].courtsideInstructionsBonus = 'Bonus prose for overflow.'
    const log = makeLog(['completed'], ['b-1'])

    const draft = buildDraftFromCompletedBlocks(log, plan)

    expect(draft?.blocks[0].segments).toHaveLength(3)
    expect(draft?.blocks[0].segments?.[0].id).toBe('b-1-s1')
    expect(draft?.blocks[0].segments?.[1].durationSec).toBe(60)
    expect(draft?.blocks[0].courtsideInstructionsBonus).toBe('Bonus prose for overflow.')
  })

  /**
   * Defensive: a plan-block authored without segments must round-trip
   * with `segments: undefined` (not null, not []), so the runner's
   * `currentBlock.segments?.length` guard takes the no-segments
   * fallback path. AE7 / R5 in the requirements doc.
   */
  it('round-trips legacy plans without segments as undefined (no-segments fallback)', () => {
    const plan = makePlan([{ id: 'b-1', minutes: 5, type: 'main_skill' }])
    const log = makeLog(['completed'], ['b-1'])

    const draft = buildDraftFromCompletedBlocks(log, plan)

    expect(draft?.blocks[0].segments).toBeUndefined()
    expect(draft?.blocks[0].courtsideInstructionsBonus).toBeUndefined()
  })

  it('keeps legacy completed blocks identity-empty when plan blocks have no ids', () => {
    const plan = makePlan([{ id: 'b-1', minutes: 10, type: 'main_skill' }])
    const log = makeLog(['completed'], ['b-1'])

    const draft = buildDraftFromCompletedBlocks(log, plan)

    expect(draft?.blocks[0].drillId).toBe('')
    expect(draft?.blocks[0].variantId).toBe('')
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

  /**
   * Phase 2.4 regression guard: build-time substitution lives only on
   * `buildDraft` (Phase 2.2). `buildDraftFromCompletedBlocks` is
   * "Repeat what you did" - it must reproduce the plan's actual
   * blocks verbatim, including their original rationales, even when
   * the inputs that would normally trigger substitution
   * (`drillId === 'd03'` with `netAvailable: false` blocking the
   * preferred d04 progression) are all present. Substituting here
   * would silently rewrite history.
   */
  it('preserves the plan\u2019s rationale verbatim and never re-runs substitution', () => {
    const plan = makePlan([
      { id: 'b-1', minutes: 3, type: 'warmup' },
      { id: 'b-2', minutes: 10, type: 'main_skill' },
    ])
    plan.blocks[1].drillId = 'd03'
    plan.blocks[1].variantId = 'd03-pair'
    plan.blocks[1].rationale = "Chosen because: today's main passing rep."
    plan.context = {
      playerMode: 'pair',
      timeProfile: 25,
      netAvailable: false,
      wallAvailable: false,
    }
    const log = makeLog(['completed', 'completed'], ['b-1', 'b-2'])

    const draft = buildDraftFromCompletedBlocks(log, plan)
    expect(draft).not.toBeNull()
    expect(draft!.blocks[1].drillId).toBe('d03')
    expect(draft!.blocks[1].variantId).toBe('d03-pair')
    expect(draft!.blocks[1].rationale).toBe("Chosen because: today's main passing rep.")
    for (const block of draft!.blocks) {
      expect(
        block.rationale ?? '',
        `${block.type} block leaked a substitution rationale`,
      ).not.toMatch(/is unavailable today, so this keeps/)
    }
  })

  it('is resilient to blockStatuses entries that don\u2019t match plan block IDs', () => {
    const plan = makePlan([
      { id: 'b-1', minutes: 3 },
      { id: 'b-2', minutes: 10 },
    ])
    // Stray entry with an unknown blockId (shouldn't matter - we
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
