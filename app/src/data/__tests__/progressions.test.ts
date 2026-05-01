import { describe, expect, it } from 'vitest'
import { PROGRESSION_CHAINS } from '../progressions'
import { DRILLS } from '../drills'

/**
 * Catalogue-level invariants for `PROGRESSION_CHAINS`.
 *
 * Originally created alongside Tier 1a Unit 2 (setting minimum probe);
 * Tier 1b-A reshaped the serving and setting chains into the current
 * branching-graph form. These tests pin three things so future edits
 * fail loudly: chain-level catalog sanity, the Tier 1b-A serving graph
 * (multiple paths, not a single ladder), and the Tier 1b-A setting
 * chain after deferring d43 Triangle Setting to D101 3+ player support.
 * The focus-readiness batch adds FIVB-backed advanced d47/d48 without
 * reopening the deferred BAB triangle geometry.
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

  it("every drill listed in a progression chain declares the chain's id", () => {
    const drillById = new Map(DRILLS.map((d) => [d.id, d]))
    for (const chain of PROGRESSION_CHAINS) {
      for (const id of chain.drillIds) {
        const drill = drillById.get(id)
        expect(drill?.chainId, `${id} should declare ${chain.id}`).toBe(chain.id)
      }
    }
  })

  /**
   * Red-team remediation Phase 1.3: pin the single-chain assumption
   * that `findPreferredProgressionTarget` relies on. The helper walks
   * `PROGRESSION_CHAINS` and returns the first matching progression
   * link, so a drill that appears as `fromDrillId` in two different
   * chains would silently lose one branch. Multiple progressions
   * within the same chain (e.g. chain-4-serve-receive d15 → d16, d15
   * → d18) are an authored "branching graph" decision and are
   * tracked via dedicated tests, not via this helper.
   */
  it('no drill is a progression source in more than one chain', () => {
    const sourceChains = new Map<string, string[]>()
    for (const chain of PROGRESSION_CHAINS) {
      const localSources = new Set<string>()
      for (const link of chain.links) {
        if (link.direction !== 'progression') continue
        localSources.add(link.fromDrillId)
      }
      for (const fromDrillId of localSources) {
        const chains = sourceChains.get(fromDrillId) ?? []
        chains.push(chain.id)
        sourceChains.set(fromDrillId, chains)
      }
    }
    for (const [fromDrillId, chains] of sourceChains) {
      expect(
        chains.length,
        `${fromDrillId} appears as a progression source in multiple chains: ${chains.join(', ')}`,
      ).toBe(1)
    }
  })

  it('does not include unauthored or deferred drill ids in the catalog', () => {
    // d32 is a placeholder serving id never authored. d36 (Jump Float
    // Introduction) is held until R7 reachability is resolved. d43
    // (Triangle Setting) is deferred to D101 3+ player support.
    const drillIds = new Set(DRILLS.map((d) => d.id))
    expect(drillIds.has('d32')).toBe(false)
    expect(drillIds.has('d36')).toBe(false)
    expect(drillIds.has('d43')).toBe(false)
  })
})

describe('chain-6-serving (Tier 1b-A serving wave)', () => {
  const chain = PROGRESSION_CHAINS.find((c) => c.id === 'chain-6-serving')

  it('keeps the four authored serving drills and excludes unauthored placeholders', () => {
    expect(chain?.drillIds).toEqual(['d22', 'd31', 'd23', 'd33'])
    expect(chain?.drillIds).not.toContain('d32')
    expect(chain?.drillIds).not.toContain('d36')
  })

  it('routes both serving entry points to d33 instead of forcing a single linear ladder', () => {
    const progressions = chain?.links
      .filter((l) => l.direction === 'progression')
      .map((l) => [l.fromDrillId, l.toDrillId])

    // Branching graph: d22 (net + many balls) and d31 (no net) are
    // alternative entry points that both progress to d33 (net + 6
    // zones). Walking d31 → d33 is honest; d31 no longer claims a
    // direct progression to d23 (net-required, non-M001).
    expect(progressions).toEqual(
      expect.arrayContaining([
        ['d22', 'd33'],
        ['d31', 'd33'],
      ]),
    )
    expect(progressions).not.toContainEqual(['d31', 'd23'])
    expect(progressions).not.toContainEqual(['d23', 'd33'])
  })

  it('expresses d22 ↔ d31 as a lateral so context-aware planners can swap entry points', () => {
    const laterals = chain?.links
      .filter((l) => l.direction === 'lateral')
      .map((l) => [l.fromDrillId, l.toDrillId])
    expect(laterals).toContainEqual(['d22', 'd31'])
  })

  it('new serving drills carry serve focus and first-wave metadata', () => {
    const drillById = new Map(DRILLS.map((d) => [d.id, d]))

    expect(drillById.get('d31')?.skillFocus).toEqual(['serve'])
    expect(drillById.get('d31')?.m001Candidate).toBe(true)
    expect(drillById.get('d31')?.levelMin).toBe('beginner')
    expect(drillById.get('d31')?.levelMax).toBe('beginner')

    expect(drillById.get('d33')?.skillFocus).toEqual(['serve'])
    expect(drillById.get('d33')?.m001Candidate).toBe(true)
    expect(drillById.get('d33')?.levelMin).toBe('beginner')
    expect(drillById.get('d33')?.levelMax).toBe('advanced')
  })
})

describe('chain-4-serve-receive advanced branch', () => {
  const chain = PROGRESSION_CHAINS.find((c) => c.id === 'chain-4-serve-receive')

  it('keeps the FIVB spin-read progression on the reserved advanced id', () => {
    expect(chain?.drillIds).toEqual(['d15', 'd16', 'd46', 'd17', 'd18'])
    expect(
      chain?.links
        .filter((link) => link.direction === 'progression')
        .map((link) => [link.fromDrillId, link.toDrillId]),
    ).toContainEqual(['d16', 'd46'])
  })
})

describe('chain-7-setting (Tier 1b-A setting progression)', () => {
  const chain = PROGRESSION_CHAINS.find((c) => c.id === 'chain-7-setting')

  it('exists in the progression catalog', () => {
    expect(chain).toBeDefined()
  })

  it('has the authored setting drills with d43 deferred to 3+ player support', () => {
    expect(chain?.drillIds).toEqual(['d38', 'd39', 'd40', 'd41', 'd42', 'd47', 'd48'])
    expect(chain?.drillIds).not.toContain('d43')
  })

  it('keeps d38, d39, and d40 default-unlocked as setting fundamentals', () => {
    const incomingProgressions = chain?.links
      .filter((l) => l.direction === 'progression')
      .filter((l) => ['d38', 'd39', 'd40'].includes(l.toDrillId))

    expect(incomingProgressions).toEqual([])
  })

  it('links pair setting progression through the FIVB-backed advanced branch', () => {
    const progressions = chain?.links
      .filter((l) => l.direction === 'progression')
      .map((l) => [l.fromDrillId, l.toDrillId])

    expect(progressions).toEqual([
      ['d41', 'd42'],
      ['d42', 'd47'],
      ['d47', 'd48'],
    ])
  })

  it('every drill in the chain declares skillFocus set', () => {
    const drillById = new Map(DRILLS.map((d) => [d.id, d]))
    for (const id of chain?.drillIds ?? []) {
      const drill = drillById.get(id)
      expect(drill).toBeDefined()
      expect(drill!.skillFocus).toContain('set')
    }
  })

  it('new setting drills carry first-wave metadata', () => {
    const drillById = new Map(DRILLS.map((d) => [d.id, d]))

    expect(drillById.get('d40')?.m001Candidate).toBe(true)
    expect(drillById.get('d40')?.levelMin).toBe('beginner')
    expect(drillById.get('d40')?.levelMax).toBe('intermediate')

    expect(drillById.get('d42')?.m001Candidate).toBe(true)
    expect(drillById.get('d42')?.levelMin).toBe('intermediate')
    expect(drillById.get('d42')?.levelMax).toBe('intermediate')

    expect(drillById.get('d47')?.m001Candidate).toBe(true)
    expect(drillById.get('d47')?.levelMin).toBe('intermediate')
    expect(drillById.get('d47')?.levelMax).toBe('advanced')

    expect(drillById.get('d48')?.m001Candidate).toBe(true)
    expect(drillById.get('d48')?.levelMin).toBe('advanced')
    expect(drillById.get('d48')?.levelMax).toBe('advanced')
  })
})
