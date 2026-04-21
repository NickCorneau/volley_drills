import { describe, expect, it } from 'vitest'
import { PROGRESSION_CHAINS } from '../progressions'
import { DRILLS } from '../drills'

/**
 * Catalogue-level invariants for `PROGRESSION_CHAINS`.
 *
 * Created alongside Tier 1a Unit 2 (setting minimum probe). Primary
 * motivation is to pin the Tier 1a-specific assertion that chain-7 is
 * a 3-rung probe with zero progression links; generalized catalog
 * sanity checks live here too so future chain edits fail loudly.
 */
describe('PROGRESSION_CHAINS catalog', () => {
  it('has unique chain ids', () => {
    const ids = PROGRESSION_CHAINS.map((c) => c.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('references only drill ids that exist in the drills catalog', () => {
    const drillIds = new Set(DRILLS.map((d) => d.id))
    for (const chain of PROGRESSION_CHAINS) {
      for (const id of chain.drillIds) {
        expect(drillIds.has(id), `${chain.id} references unknown drill ${id}`).toBe(true)
      }
    }
  })

  it("progression links only reference drills that are in the chain's drillIds", () => {
    for (const chain of PROGRESSION_CHAINS) {
      const chainDrillIds = new Set(chain.drillIds)
      for (const link of chain.links) {
        expect(
          chainDrillIds.has(link.fromDrillId),
          `${chain.id} link fromDrillId ${link.fromDrillId} not in chain`,
        ).toBe(true)
        expect(
          chainDrillIds.has(link.toDrillId),
          `${chain.id} link toDrillId ${link.toDrillId} not in chain`,
        ).toBe(true)
      }
    }
  })
})

describe('chain-7-setting (Tier 1a Unit 2: minimum probe)', () => {
  const chain = PROGRESSION_CHAINS.find((c) => c.id === 'chain-7-setting')

  it('exists in the progression catalog', () => {
    expect(chain).toBeDefined()
  })

  it('has exactly three drill ids: d38, d39, d41', () => {
    expect(chain?.drillIds).toEqual(['d38', 'd39', 'd41'])
  })

  it('has zero progression links (Tier 1a probe - Tier 1b authors links)', () => {
    expect(chain?.links).toEqual([])
  })

  it('has zero regression links (same reason)', () => {
    const regressions = chain?.links.filter((l) => l.direction === 'regression') ?? []
    expect(regressions).toEqual([])
  })

  it('every drill in the chain declares skillFocus set', () => {
    const drillById = new Map(DRILLS.map((d) => [d.id, d]))
    for (const id of chain?.drillIds ?? []) {
      const drill = drillById.get(id)
      expect(drill).toBeDefined()
      expect(drill!.skillFocus).toContain('set')
    }
  })
})
