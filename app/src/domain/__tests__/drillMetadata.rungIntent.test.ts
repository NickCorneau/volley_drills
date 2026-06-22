import { describe, expect, it } from 'vitest'
import { DRILLS } from '../../data/drills'
import { getStressRung, stressRungForDrill } from '../../data/stressLadders'
import { getBlockSkillFocus, resolveBlockRungIntent } from '../drillMetadata'
import type { SessionPlanBlock } from '../../model'

/**
 * `resolveBlockRungIntent` surfaces the authored per-rung `intent` string
 * (the "what this rung trains" technique-how line) on TransitionScreen
 * (M002.2 run-time technique-how, plan
 * `docs/plans/2026-06-22-007-feat-m002-2-technique-how-transition-intent-plan.md`).
 *
 * Contract pinned here:
 *   1. ladder-bearing block (primary focus pass/serve/set + on-ladder
 *      drillId) → the authored rung `intent`,
 *   2. resolves against the drill's PRIMARY focus (dual-focus drills use
 *      their primary ladder, matching the eyebrow),
 *   3. null for null/undefined blocks, non-surfaced focus (warmup/wrap),
 *      unknown drillId, and drillName-only legacy blocks (no drillId),
 *   4. never throws (a throw in the run-flow body trips the app-root
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

describe('resolveBlockRungIntent', () => {
  it('returns null for null / undefined block', () => {
    expect(resolveBlockRungIntent(null, 1)).toBeNull()
    expect(resolveBlockRungIntent(undefined, 1)).toBeNull()
  })

  it('resolves the pass rung-3 intent for d24 Pass into a Corner (AE1)', () => {
    const block = makeBlock({ drillId: 'd24', variantId: 'd24-solo', drillName: 'Pass into a Corner' })
    expect(resolveBlockRungIntent(block, 1)).toBe(
      'Read where the ball is going, move to it, and still pass to one target.',
    )
  })

  it('resolves the set rung-1 intent for d38, not a pass/serve string (AE3)', () => {
    const block = makeBlock({ drillId: 'd38', variantId: 'd38-pair', drillName: 'Bump Set Fundamentals' })
    expect(resolveBlockRungIntent(block, 2)).toBe(
      'Build a clean, repeatable set shape on a predictable toss.',
    )
  })

  it('resolves a dual-focus drill against its primary ladder (d20 → pass, not set) (AE5)', () => {
    // d20 skillFocus ['pass', 'set'] → primary pass → pass rung 4.
    const block = makeBlock({ drillId: 'd20', drillName: '3 Serve Pass to Attack' })
    const passRung4 = getStressRung('pass', 4)?.intent
    const setRung4 = getStressRung('set', 4)?.intent
    expect(resolveBlockRungIntent(block, 2)).toBe(passRung4)
    expect(resolveBlockRungIntent(block, 2)).not.toBe(setRung4)
  })

  it('returns null for the warmup drill d28 (no surfaced focus, off-ladder) (AE2)', () => {
    const block = makeBlock({
      type: 'warmup',
      drillId: 'd28',
      variantId: 'd28-solo',
      drillName: 'Beach Prep Three',
    })
    expect(resolveBlockRungIntent(block, 1)).toBeNull()
  })

  it('returns null without throwing for an unknown drillId (AE4)', () => {
    const block = makeBlock({
      drillId: 'd999-fake',
      variantId: 'd999-fake-pair',
      drillName: 'Synthetic Test Drill',
    })
    expect(() => resolveBlockRungIntent(block, 1)).not.toThrow()
    expect(resolveBlockRungIntent(block, 1)).toBeNull()
  })

  it('returns null for a drillName-only legacy block even when the name resolves a focus', () => {
    // No drillId: getBlockSkillFocus resolves 'serve' via the name
    // fallback, but the rung lookup keys off drillId, so the line is
    // intentionally absent rather than guessed for legacy plans.
    const block = makeBlock({ drillName: 'Around the World Serving' })
    expect(getBlockSkillFocus(block, 2)).toBe('serve')
    expect(resolveBlockRungIntent(block, 2)).toBeNull()
  })

  it('exhaustive sweep: every catalog drill returns string|null, never throws, and agrees with the data layer', () => {
    for (const drill of DRILLS) {
      const variant = drill.variants[0]
      if (!variant) continue
      const block = makeBlock({ drillId: drill.id, variantId: variant.id, drillName: drill.name })
      const playerCount = variant.participants.min === 2 ? 2 : 1

      let result: string | null = null
      expect(() => {
        result = resolveBlockRungIntent(block, playerCount)
      }, `drill ${drill.id} threw`).not.toThrow()

      const focus = getBlockSkillFocus(block, playerCount)
      const rung = focus ? stressRungForDrill(focus, drill.id) : undefined
      const expected =
        focus && rung !== undefined ? (getStressRung(focus, rung)?.intent ?? null) : null
      expect(result, `drill ${drill.id} intent disagrees with data layer`).toBe(expected)
    }
  })
})
