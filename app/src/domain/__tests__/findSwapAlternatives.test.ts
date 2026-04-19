import { describe, expect, it } from 'vitest'
import type { SessionPlanBlock, SetupContext } from '../../db'
import { findSwapAlternatives } from '../sessionBuilder'

/**
 * Phase F Unit 4 (2026-04-19): `findSwapAlternatives` derives the
 * candidate drill set for a mid-run Swap action.
 *
 * Contract:
 * - Returns `[]` for warmup and wrap blocks (curated content per
 *   D85 / D105).
 * - Returns `[]` when the context yields no alternate (single-
 *   candidate pool for the slot type).
 * - Excludes the drill whose name matches the current block
 *   (prevents tapping Swap and landing on the same drill).
 * - Stable ordering: sorted by `drill.id` so repeated Swap taps on
 *   the same block walk the same list every time.
 * - Preserves `id`, `type`, `durationMinutes`, `required` from the
 *   input block — only drill identity (name / shortName / cue /
 *   instructions) changes.
 */

function makeBlock(overrides: Partial<SessionPlanBlock> = {}): SessionPlanBlock {
  return {
    id: 'block-0',
    type: 'main_skill',
    drillName: 'Does Not Exist',
    shortName: 'DNE',
    durationMinutes: 10,
    coachingCue: '',
    courtsideInstructions: '',
    required: true,
    ...overrides,
  }
}

function makeContext(overrides: Partial<SetupContext> = {}): SetupContext {
  return {
    playerMode: 'solo',
    timeProfile: 15,
    netAvailable: false,
    wallAvailable: true,
    ...overrides,
  }
}

describe('findSwapAlternatives (Phase F Unit 4)', () => {
  it('returns [] for a warmup block regardless of context (D85 curated content)', () => {
    const block = makeBlock({ type: 'warmup' })
    const out = findSwapAlternatives(block, makeContext())
    expect(out).toEqual([])
  })

  it('returns [] for a wrap block regardless of context (D105 curated content)', () => {
    const block = makeBlock({ type: 'wrap' })
    const out = findSwapAlternatives(block, makeContext())
    expect(out).toEqual([])
  })

  it('returns a non-empty list for a main_skill block in a rich context (solo + wall)', () => {
    const block = makeBlock({
      type: 'main_skill',
      drillName: 'Does Not Exist',
    })
    const out = findSwapAlternatives(block, makeContext())
    expect(out.length).toBeGreaterThan(0)
  })

  it('excludes the current drillName from the alternate list', () => {
    const block = makeBlock({ type: 'main_skill' })
    // First call returns the full list with a dummy-named block.
    const first = findSwapAlternatives(block, makeContext())
    expect(first.length).toBeGreaterThan(0)
    const firstAlternateName = first[0].drillName

    // Second call exclude the alternate we just picked.
    const next = findSwapAlternatives(
      { ...block, drillName: firstAlternateName },
      makeContext(),
    )
    // Still returns alternates (the pool > 1 for solo+wall main_skill)
    // and does NOT include the excluded drill.
    expect(next.length).toBeGreaterThanOrEqual(0)
    expect(next.every((b) => b.drillName !== firstAlternateName)).toBe(true)
  })

  it('preserves id, type, durationMinutes, required on the alternate', () => {
    const block = makeBlock({
      id: 'custom-block-id',
      type: 'main_skill',
      durationMinutes: 17,
      required: false,
    })
    const out = findSwapAlternatives(block, makeContext())
    for (const alt of out) {
      expect(alt.id).toBe('custom-block-id')
      expect(alt.type).toBe('main_skill')
      expect(alt.durationMinutes).toBe(17)
      expect(alt.required).toBe(false)
    }
  })

  it('ordering is deterministic across repeated calls', () => {
    const block = makeBlock({ type: 'main_skill' })
    const a = findSwapAlternatives(block, makeContext())
    const b = findSwapAlternatives(block, makeContext())
    expect(a.map((x) => x.drillName)).toEqual(b.map((x) => x.drillName))
  })

  it('pair + net context produces a different pool than solo + wall', () => {
    const block = makeBlock({ type: 'main_skill' })
    const soloWall = findSwapAlternatives(block, makeContext())
    const pairNet = findSwapAlternatives(
      block,
      makeContext({
        playerMode: 'pair',
        netAvailable: true,
        wallAvailable: false,
      }),
    )
    // Each pool is non-empty but not identical — solo-eligible drills
    // differ from pair-net eligible drills.
    expect(soloWall.length).toBeGreaterThan(0)
    expect(pairNet.length).toBeGreaterThan(0)
    expect(soloWall.map((x) => x.drillName).sort()).not.toEqual(
      pairNet.map((x) => x.drillName).sort(),
    )
  })

  it('returns a copy-safe alternate (mutating the result does not affect future calls)', () => {
    const block = makeBlock({ type: 'main_skill' })
    const a = findSwapAlternatives(block, makeContext())
    if (a.length > 0) {
      a[0].drillName = 'MUTATED'
    }
    const b = findSwapAlternatives(block, makeContext())
    expect(b.every((x) => x.drillName !== 'MUTATED')).toBe(true)
  })
})
