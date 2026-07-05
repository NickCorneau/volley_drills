import { describe, expect, it } from 'vitest'
import { DRILLS } from '../../data/drills'
import { getStressRung, stressRungForDrill } from '../../data/stressLadders'
import { getBlockSkillFocus, resolveBlockRungReflection } from '../drillMetadata'
import type { SessionPlanBlock } from '../../model'

/**
 * `resolveBlockRungReflection` surfaces the authored per-rung `reflection`
 * string (the backward-looking "what that rep was doing to you" line) on
 * Drill Check behind the pull affordance (M002.2 coaching arc After beat,
 * D177, plan `docs/plans/2026-07-04-001-feat-m002-2-drill-check-reflection-plan.md`).
 *
 * Contract pinned here (mirrors `drillMetadata.rungIntent.test.ts` — the
 * resolvers are structurally identical by design):
 *   1. ladder-bearing block (primary focus pass/serve/set + on-ladder
 *      drillId) → the authored rung `reflection`,
 *   2. resolves against the drill's PRIMARY focus (dual-focus drills use
 *      their primary ladder, matching the eyebrow and the intent line),
 *   3. null for null/undefined blocks, non-surfaced focus (warmup/wrap),
 *      unknown drillId, and drillName-only legacy blocks (no drillId),
 *   4. never throws (a throw in a render body trips the app-root
 *      ErrorBoundary) and never returns a value the data layer disagrees
 *      with (exhaustive consistency sweep).
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

describe('resolveBlockRungReflection', () => {
  it('returns null for null / undefined block', () => {
    expect(resolveBlockRungReflection(null, 1)).toBeNull()
    expect(resolveBlockRungReflection(undefined, 1)).toBeNull()
  })

  it('resolves the pass rung-1 reflection for d01 Slap Hands (origin AE1)', () => {
    const block = makeBlock({ drillId: 'd01', variantId: 'd01-solo', drillName: 'Slap Hands' })
    expect(resolveBlockRungReflection(block, 1)).toBe(
      'That rep was wiring in one default contact your body can find on its own.',
    )
  })

  it('resolves a different string on a higher rung of the same focus (origin AE2)', () => {
    const rung1 = makeBlock({ drillId: 'd01', variantId: 'd01-solo', drillName: 'Slap Hands' })
    const rung5 = makeBlock({ drillId: 'd46', variantId: 'd46-solo', drillName: 'Spin Feed Passing' })
    const low = resolveBlockRungReflection(rung1, 1)
    const high = resolveBlockRungReflection(rung5, 1)
    expect(low).not.toBeNull()
    expect(high).not.toBeNull()
    expect(high).not.toBe(low)
    expect(high).toBe(getStressRung('pass', 5)?.reflection)
  })

  it('resolves the set rung-1 reflection for d38, not a pass/serve string', () => {
    const block = makeBlock({ drillId: 'd38', variantId: 'd38-pair', drillName: 'Bump Set Fundamentals' })
    expect(resolveBlockRungReflection(block, 2)).toBe(getStressRung('set', 1)?.reflection)
  })

  it('resolves a dual-focus drill against its primary ladder (d20 → pass, not set)', () => {
    // d20 skillFocus ['pass', 'set'] → primary pass → pass rung 4.
    const block = makeBlock({ drillId: 'd20', drillName: '3 Serve Pass to Attack' })
    const passRung4 = getStressRung('pass', 4)?.reflection
    const setRung4 = getStressRung('set', 4)?.reflection
    expect(resolveBlockRungReflection(block, 2)).toBe(passRung4)
    expect(resolveBlockRungReflection(block, 2)).not.toBe(setRung4)
  })

  it('returns null for the warmup drill d28 (no surfaced focus, off-ladder)', () => {
    const block = makeBlock({
      type: 'warmup',
      drillId: 'd28',
      variantId: 'd28-solo',
      drillName: 'Beach Prep Three',
    })
    expect(resolveBlockRungReflection(block, 1)).toBeNull()
  })

  it('returns null without throwing for an unknown drillId', () => {
    const block = makeBlock({
      drillId: 'd999-fake',
      variantId: 'd999-fake-pair',
      drillName: 'Synthetic Test Drill',
    })
    expect(() => resolveBlockRungReflection(block, 1)).not.toThrow()
    expect(resolveBlockRungReflection(block, 1)).toBeNull()
  })

  it('returns null for a drillName-only legacy block even when the name resolves a focus', () => {
    // No drillId: getBlockSkillFocus resolves 'serve' via the name
    // fallback, but the rung lookup keys off drillId, so the line is
    // intentionally absent rather than guessed for legacy plans.
    const block = makeBlock({ drillName: 'Around the World Serving' })
    expect(getBlockSkillFocus(block, 2)).toBe('serve')
    expect(resolveBlockRungReflection(block, 2)).toBeNull()
  })

  it('exhaustive sweep: every catalog drill returns string|null, never throws, and agrees with the data layer', () => {
    for (const drill of DRILLS) {
      const variant = drill.variants[0]
      if (!variant) continue
      const block = makeBlock({ drillId: drill.id, variantId: variant.id, drillName: drill.name })
      const playerCount = variant.participants.min === 2 ? 2 : 1

      let result: string | null = null
      expect(() => {
        result = resolveBlockRungReflection(block, playerCount)
      }, `drill ${drill.id} threw`).not.toThrow()

      const focus = getBlockSkillFocus(block, playerCount)
      const rung = focus ? stressRungForDrill(focus, drill.id) : undefined
      const expected =
        focus && rung !== undefined ? (getStressRung(focus, rung)?.reflection ?? null) : null
      expect(result, `drill ${drill.id} reflection disagrees with data layer`).toBe(expected)
    }
  })
})
