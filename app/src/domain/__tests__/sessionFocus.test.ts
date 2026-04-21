import { describe, expect, it } from 'vitest'
import type { SessionPlanBlock } from '../../db'
import { focusLabel, inferSessionFocus } from '../sessionFocus'

/**
 * Tier 1a Unit 5 (2026-04-20): focus-inference tests for the Home
 * last-3-sessions row. Covers:
 *   - Partial when no `main_skill` block.
 *   - Partial when `main_skill` drillName doesn't match the catalog.
 *   - Correct `skillFocus[0]` pickup for known drills across focuses
 *     (pass, serve, set — the three Tier 1a focus labels actually
 *     used in the authored catalog).
 *   - `focusLabel` renders human-readable sentence case.
 *
 * See `docs/plans/2026-04-20-m001-tier1-implementation.md` Unit 5.
 */

function block(
  partial: Partial<SessionPlanBlock> & Pick<SessionPlanBlock, 'type'>,
): SessionPlanBlock {
  return {
    id: partial.id ?? 'b',
    type: partial.type,
    drillName: partial.drillName ?? 'Unknown',
    shortName: partial.shortName ?? 'Unknown',
    durationMinutes: partial.durationMinutes ?? 1,
    coachingCue: partial.coachingCue ?? '',
    courtsideInstructions: partial.courtsideInstructions ?? '',
    required: partial.required ?? true,
    rationale: partial.rationale,
  }
}

describe('inferSessionFocus (Tier 1a Unit 5)', () => {
  it('returns partial when no main_skill block is present', () => {
    const blocks = [block({ type: 'warmup' }), block({ type: 'wrap' })]
    expect(inferSessionFocus(blocks)).toBe('partial')
  })

  it('returns partial when the main_skill drillName does not match the catalog', () => {
    const blocks = [
      block({ type: 'warmup' }),
      block({ type: 'main_skill', drillName: 'A Drill That Does Not Exist' }),
    ]
    expect(inferSessionFocus(blocks)).toBe('partial')
  })

  it('returns set when main_skill resolves to d38 Bump Set Fundamentals', () => {
    const blocks = [
      block({ type: 'warmup', drillName: 'Beach Prep Three' }),
      block({ type: 'main_skill', drillName: 'Bump Set Fundamentals' }),
    ]
    expect(inferSessionFocus(blocks)).toBe('set')
  })

  it('returns set when main_skill resolves to d41 Partner Set Back-and-Forth', () => {
    const blocks = [
      block({ type: 'warmup', drillName: 'Beach Prep Three' }),
      block({ type: 'main_skill', drillName: 'Partner Set Back-and-Forth' }),
    ]
    expect(inferSessionFocus(blocks)).toBe('set')
  })

  it('returns pass when main_skill resolves to a pass-focus catalog drill', () => {
    // d01 Pass & Slap Hands has skillFocus: ['pass'].
    const blocks = [
      block({ type: 'warmup', drillName: 'Beach Prep Three' }),
      block({ type: 'main_skill', drillName: 'Pass & Slap Hands' }),
    ]
    expect(inferSessionFocus(blocks)).toBe('pass')
  })
})

describe('focusLabel (Tier 1a Unit 5)', () => {
  it('renders all skill focuses in sentence case', () => {
    expect(focusLabel('pass')).toBe('Pass')
    expect(focusLabel('serve')).toBe('Serve')
    expect(focusLabel('set')).toBe('Set')
    expect(focusLabel('movement')).toBe('Movement')
    expect(focusLabel('conditioning')).toBe('Conditioning')
    expect(focusLabel('recovery')).toBe('Recovery')
    expect(focusLabel('warmup')).toBe('Warm up')
    expect(focusLabel('partial')).toBe('Partial')
  })
})
