import { describe, expect, it } from 'vitest'
import { DRILLS } from '../../data/drills'
import { getBlockSkillFocus } from '../drillMetadata'
import type { SessionPlanBlock } from '../../model'

/**
 * 2026-04-27 cca2 dogfeed F8 follow-up
 * (`docs/research/2026-04-27-cca2-dogfeed-findings.md`):
 * `getBlockSkillFocus` resolves the run-flow eyebrow's primary skill
 * marker from the drill catalog. This file pins the resolution
 * contract:
 *
 *   1. drillId match (canonical path)
 *   2. drillName match (legacy / synthetic fallback)
 *   3. only `'pass' | 'serve' | 'set'` surface; non-surfaced skills
 *      (`'warmup'`, `'recovery'`, `'movement'` standalone, `'attack'`,
 *      `'block'`, `'dig'`, `'conditioning'`) return null
 *   4. unknown drills return null
 *   5. drills with a non-skill primary `skillFocus[0]` return null
 *
 * The eyebrow's compose layer (`blockEyebrowLabel` in `lib/format.ts`)
 * relies on this helper returning null whenever the skill should NOT
 * appear in the eyebrow (warmup blocks, unknown drills) so the
 * compose layer can render the bare slot label safely.
 */

function makeBlock(overrides: Partial<SessionPlanBlock>): SessionPlanBlock {
  return {
    id: 'b-test',
    type: 'main_skill',
    drillName: '',
    shortName: '',
    durationMinutes: 5,
    coachingCue: '',
    courtsideInstructions: '',
    required: true,
    ...overrides,
  }
}

describe('getBlockSkillFocus', () => {
  it('returns null for null / undefined block', () => {
    expect(getBlockSkillFocus(null, 1)).toBeNull()
    expect(getBlockSkillFocus(undefined, 1)).toBeNull()
  })

  it('resolves to the drill\'s primary skillFocus when the block carries a known drillId', () => {
    // d33 Around the World Serving — `skillFocus: ['serve']`
    const block = makeBlock({ drillId: 'd33', variantId: 'd33-pair', drillName: 'Around the World Serving' })
    expect(getBlockSkillFocus(block, 2)).toBe('serve')
  })

  it('returns null for the warmup drill d28 (skillFocus: ["warmup"] — non-surface skill)', () => {
    // d28 Beach Prep Three — primary skillFocus is `'warmup'`, not
    // a pass/serve/set skill the eyebrow surfaces.
    const block = makeBlock({
      type: 'warmup',
      drillId: 'd28',
      variantId: 'd28-solo',
      drillName: 'Beach Prep Three',
    })
    expect(getBlockSkillFocus(block, 1)).toBeNull()
  })

  it('returns null for the recovery / wrap drills d25 + d26 (skillFocus: ["recovery"])', () => {
    const wrap25 = makeBlock({
      type: 'wrap',
      drillId: 'd25',
      variantId: 'd25-solo',
      drillName: 'Downshift',
    })
    const wrap26 = makeBlock({
      type: 'wrap',
      drillId: 'd26',
      variantId: 'd26-solo',
      drillName: 'Lower-body Stretch Micro-sequence',
    })
    expect(getBlockSkillFocus(wrap25, 1)).toBeNull()
    expect(getBlockSkillFocus(wrap26, 1)).toBeNull()
  })

  it('resolves "pass" for d10 (skillFocus: ["pass", "movement"]) — primary is pass, not movement', () => {
    // d10 The 6-Legged Monster — `skillFocus: ['pass', 'movement']`
    // The primary (skillFocus[0]) is `'pass'`. The eyebrow shows
    // 'Pass', not 'Movement' (movement is secondary).
    const block = makeBlock({ drillId: 'd10', variantId: 'd10-pair', drillName: 'The 6-Legged Monster' })
    expect(getBlockSkillFocus(block, 2)).toBe('pass')
  })

  it('resolves "set" for d38 Bump Set Fundamentals (skillFocus: ["set"])', () => {
    const block = makeBlock({ drillId: 'd38', variantId: 'd38-pair', drillName: 'Bump Set Fundamentals' })
    expect(getBlockSkillFocus(block, 2)).toBe('set')
  })

  it('returns null when drillId references a non-existent drill', () => {
    const block = makeBlock({
      drillId: 'd999-fake',
      variantId: 'd999-fake-pair',
      drillName: 'Synthetic Test Drill',
    })
    expect(getBlockSkillFocus(block, 1)).toBeNull()
  })

  it('falls back to drillName when drillId is absent (legacy plan)', () => {
    // Legacy plans pre-Tier-1a-Unit-X may not carry drillId. The
    // resolver matches by drillName as a fallback.
    const block = makeBlock({ drillName: 'Around the World Serving' })
    expect(getBlockSkillFocus(block, 2)).toBe('serve')
  })

  it('returns null when drillName matches no drill in the catalog', () => {
    const block = makeBlock({ drillName: 'Synthetic Drill That Does Not Exist' })
    expect(getBlockSkillFocus(block, 1)).toBeNull()
  })

  it('exhaustive sweep: every M001-candidate drill resolves to either pass/serve/set or null (no rogue values)', () => {
    // Belt-and-suspenders: walk every drill in the catalog and
    // confirm the helper never returns a value outside the
    // documented union (`'pass' | 'serve' | 'set' | null`). Catches
    // a future skillFocus addition that accidentally surfaces in
    // the eyebrow without an explicit gate update.
    const allowed = new Set(['pass', 'serve', 'set', null] as const)
    for (const drill of DRILLS) {
      const variant = drill.variants[0]
      if (!variant) continue
      const block = makeBlock({
        drillId: drill.id,
        variantId: variant.id,
        drillName: drill.name,
      })
      const playerCount = variant.participants.min === 2 ? 2 : 1
      const result = getBlockSkillFocus(block, playerCount)
      expect(allowed.has(result), `drill ${drill.id} returned ${result}; not in allowed set`).toBe(
        true,
      )
    }
  })
})
