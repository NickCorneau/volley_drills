import { describe, expect, it } from 'vitest'
import { DRILLS } from '../data/drills'
import { buildDraft, buildRecoveryDraft } from './sessionBuilder'
import type { SetupContext } from '../db/types'

const variantById = new Map(
  DRILLS.flatMap((drill) => drill.variants.map((variant) => [variant.id, variant] as const)),
)

describe('sessionBuilder', () => {
  it.each([
    [
      'solo wall',
      {
        playerMode: 'solo',
        timeProfile: 15,
        netAvailable: false,
        wallAvailable: true,
      } satisfies SetupContext,
      'solo_wall',
    ],
    [
      'solo net',
      {
        playerMode: 'solo',
        timeProfile: 15,
        netAvailable: true,
        wallAvailable: false,
      } satisfies SetupContext,
      'solo_net',
    ],
    [
      'solo open',
      {
        playerMode: 'solo',
        timeProfile: 25,
        netAvailable: false,
        wallAvailable: false,
      } satisfies SetupContext,
      'solo_open',
    ],
    [
      // D103 tie-break: when solo has both net and wall toggled, net wins.
      // A wall at a net-equipped facility is almost always incidental.
      'solo net+wall (net wins per D103)',
      {
        playerMode: 'solo',
        timeProfile: 15,
        netAvailable: true,
        wallAvailable: true,
      } satisfies SetupContext,
      'solo_net',
    ],
    [
      'pair net',
      {
        playerMode: 'pair',
        timeProfile: 15,
        netAvailable: true,
        wallAvailable: false,
      } satisfies SetupContext,
      'pair_net',
    ],
    [
      'pair open',
      {
        playerMode: 'pair',
        timeProfile: 25,
        netAvailable: false,
        wallAvailable: false,
      } satisfies SetupContext,
      'pair_open',
    ],
  ])('buildDraft creates a believable %s session', (_label, context, archetypeId) => {
    const draft = buildDraft(context)

    expect(draft).not.toBeNull()
    expect(draft?.archetypeId).toBe(archetypeId)
    expect(draft?.blocks.length).toBeGreaterThan(0)
    expect(draft?.blocks[0]?.type).toBe('warmup')
    expect(['d25', 'd26']).not.toContain(draft?.blocks[0]?.drillId)
    expect(draft?.blocks.at(-1)?.type).toBe('wrap')
    expect(['d25', 'd26']).toContain(draft?.blocks.at(-1)?.drillId)

    const totalMinutes = draft!.blocks.reduce((sum, block) => sum + block.durationMinutes, 0)
    expect(totalMinutes).toBe(context.timeProfile)

    for (const block of draft!.blocks) {
      const variant = variantById.get(block.variantId)
      expect(variant).toBeDefined()
      expect(variant!.environmentFlags.needsLines).toBe(false)
      expect(variant!.environmentFlags.needsCones).toBe(false)
      expect(variant!.equipment.balls).not.toBe('many')
    }
  })

  it('buildRecoveryDraft returns only warmup and wrap blocks', () => {
    const recovery = buildRecoveryDraft({
      playerMode: 'pair',
      timeProfile: 25,
      netAvailable: false,
      wallAvailable: false,
    })

    expect(recovery).not.toBeNull()
    expect(recovery!.blocks.length).toBeGreaterThan(0)
    expect(recovery!.blocks.every((block) => block.type === 'warmup' || block.type === 'wrap')).toBe(true)
  })
})
