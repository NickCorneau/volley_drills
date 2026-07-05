import { describe, expect, it } from 'vitest'
import { DRILLS } from '../../data/drills'
import { isLiveCueGuardProtected } from '../../data/liveCueGuard'
import { getStressRung, stressRungForDrill } from '../../data/stressLadders'
import { makeBlock } from '../../test-utils/blockFixture'
import { getBlockSkillFocus, resolveBlockLiveCueOverride } from '../drillMetadata'

/**
 * `resolveBlockLiveCueOverride` resolves the guarded rung `externalFocusCue`
 * that substitutes for the drill's own `coachingCues[0]` on the live "Now"
 * surface (M002.2 rung-aware live cue, plan
 * `docs/plans/2026-06-30-001-feat-m002-2-rung-aware-live-cue-plan.md` U3).
 *
 * Contract pinned here:
 *   1. ladder-bearing, unguarded block → the authored rung `externalFocusCue`
 *      (and the cue changes as the rung changes),
 *   2. resolves against the drill's PRIMARY focus (dual-focus drills use
 *      their primary ladder, matching the eyebrow and the rung-intent line),
 *   3. null for a guard-protected drill (its own cue stays live),
 *   4. null for null/undefined blocks, non-surfaced focus (warmup/wrap),
 *      unknown drillId, and drillName-only legacy blocks (no drillId),
 *   5. never throws, and folds guard + presence in agreement with the data
 *      layer across the whole catalog.
 * Budget + fallback are the selector's job; the "never grows a Now slot"
 * invariant is the call site's job (both tested elsewhere).
 */

describe('resolveBlockLiveCueOverride', () => {
  it('returns null for null / undefined block (no throw)', () => {
    expect(resolveBlockLiveCueOverride(null, 1)).toBeNull()
    expect(resolveBlockLiveCueOverride(undefined, 1)).toBeNull()
  })

  it('returns the authored rung external-focus cue for an unguarded pass drill (d24, rung 3)', () => {
    const block = makeBlock({ drillId: 'd24', drillName: 'Pass into a Corner' })
    expect(stressRungForDrill('pass', 'd24')).toBe(3)
    expect(isLiveCueGuardProtected('d24')).toBe(false)
    expect(resolveBlockLiveCueOverride(block, 1)).toBe(getStressRung('pass', 3)?.externalFocusCue)
  })

  it('resolves a distinct cue on a higher rung — the cue changes as you climb (d46, rung 5)', () => {
    const block = makeBlock({ drillId: 'd46', drillName: 'Serve Receive at Speed' })
    expect(stressRungForDrill('pass', 'd46')).toBe(5)
    const rung5 = resolveBlockLiveCueOverride(block, 2)
    expect(rung5).toBe(getStressRung('pass', 5)?.externalFocusCue)
    expect(rung5).not.toBe(getStressRung('pass', 3)?.externalFocusCue)
  })

  it('returns null for the warmup drill d28 (no surfaced focus, off-ladder)', () => {
    const block = makeBlock({
      type: 'warmup',
      drillId: 'd28',
      drillName: 'Beach Prep Three',
    })
    expect(resolveBlockLiveCueOverride(block, 1)).toBeNull()
  })

  it('returns null for a guard-protected gaze drill so its own cue stays live (d07)', () => {
    const block = makeBlock({ drillId: 'd07', drillName: 'Pass & Look' })
    expect(stressRungForDrill('pass', 'd07')).toBe(3)
    expect(isLiveCueGuardProtected('d07')).toBe(true)
    expect(resolveBlockLiveCueOverride(block, 2)).toBeNull()
  })

  it('returns null for the other guarded gaze drill (d48 Set and Look)', () => {
    const block = makeBlock({ drillId: 'd48', drillName: 'Set and Look' })
    expect(stressRungForDrill('set', 'd48')).toBe(5)
    expect(isLiveCueGuardProtected('d48')).toBe(true)
    expect(resolveBlockLiveCueOverride(block, 1)).toBeNull()
  })

  it('resolves a dual-focus drill against its primary ladder (d20 → pass rung 4, not set)', () => {
    const block = makeBlock({ drillId: 'd20', drillName: '3 Serve Pass to Attack' })
    const result = resolveBlockLiveCueOverride(block, 2)
    expect(result).toBe(getStressRung('pass', 4)?.externalFocusCue)
    expect(result).not.toBe(getStressRung('set', 4)?.externalFocusCue)
  })

  it('returns null without throwing for an unknown drillId', () => {
    const block = makeBlock({ drillId: 'd999-fake', drillName: 'Synthetic Test Drill' })
    expect(() => resolveBlockLiveCueOverride(block, 1)).not.toThrow()
    expect(resolveBlockLiveCueOverride(block, 1)).toBeNull()
  })

  it('returns null for a drillName-only legacy block (no drillId), even when the name resolves a focus', () => {
    const block = makeBlock({ drillName: 'Around the World Serving' })
    expect(getBlockSkillFocus(block, 2)).toBe('serve')
    expect(resolveBlockLiveCueOverride(block, 2)).toBeNull()
  })

  it('exhaustive sweep: every catalog drill returns string|null, never throws, and folds guard + presence', () => {
    for (const drill of DRILLS) {
      const variant = drill.variants[0]
      if (!variant) continue
      const block = makeBlock({ drillId: drill.id, variantId: variant.id, drillName: drill.name })
      const playerCount = variant.participants.min === 2 ? 2 : 1

      let result: string | null = null
      expect(() => {
        result = resolveBlockLiveCueOverride(block, playerCount)
      }, `drill ${drill.id} threw`).not.toThrow()

      const focus = getBlockSkillFocus(block, playerCount)
      const rung = focus ? stressRungForDrill(focus, drill.id) : undefined
      const cue =
        focus && rung !== undefined ? getStressRung(focus, rung)?.externalFocusCue?.trim() : undefined
      const expected =
        focus && rung !== undefined && !isLiveCueGuardProtected(drill.id) && cue && cue.length > 0
          ? cue
          : null
      expect(result, `drill ${drill.id} live-cue override disagrees with data layer`).toBe(expected)
    }
  })
})
