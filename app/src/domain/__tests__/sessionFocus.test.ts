import { describe, expect, it } from 'vitest'
import type { SessionPlanBlock } from '../../model'
import { focusLabel, inferSessionFocus } from '../sessionFocus'

/**
 * Tier 1a Unit 5 (2026-04-20): focus-inference tests for the Home
 * last-3-sessions row. Covers:
 *   - Partial when no `main_skill` block.
 *   - Partial when `main_skill` drillName doesn't match the catalog.
 *   - Correct `skillFocus[0]` pickup for known drills across focuses
 *     (pass, serve, set - the three Tier 1a focus labels actually
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

  it('returns set when main_skill resolves to a Tier 1b setting drill', () => {
    const blocks = [
      block({ type: 'warmup', drillName: 'Beach Prep Three' }),
      block({ type: 'main_skill', drillName: 'Corner to Corner Setting' }),
    ]
    expect(inferSessionFocus(blocks)).toBe('set')
  })

  it('returns serve when main_skill resolves to a Tier 1b serving drill', () => {
    const blocks = [
      block({ type: 'warmup', drillName: 'Beach Prep Three' }),
      block({ type: 'main_skill', drillName: 'Self Toss Target Practice' }),
    ]
    expect(inferSessionFocus(blocks)).toBe('serve')
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
  /**
   * 2026-04-22 — the three volleyball-skill focuses render as gerunds
   * ("Passing" / "Serving" / "Setting") so that the Home recent-
   * workouts row's `focus` column cannot be misread as a status value
   * when it sits next to the `Done` / `Partial` status column. Field
   * evidence: `N3` in the Post-close partner mentions section of the
   * 2026-04-21 Tier 1a walkthrough ledger; traced to courtside-copy
   * rule §2 ("one-season rec player test"). See `sessionFocus.ts`
   * for the full rationale on why only the three volleyball cases
   * needed the rewrite.
   *
   * 2026-04-26 pre-D91 editorial polish (`F12`): the `'partial'`
   * focus fallback now renders as `Mixed` (not `Partial`) so a
   * partially-completed mixed-focus session does not render as the
   * visually-jarring `Yesterday Partial Partial` on the Home recent
   * row. Internal enum key `'partial'` is unchanged; only the
   * rendered label diverges. See
   * `docs/plans/2026-04-26-pre-d91-editorial-polish.md` Item 2.
   */
  it('renders skill focuses as gerunds and fallbacks in sentence case', () => {
    expect(focusLabel('pass')).toBe('Passing')
    expect(focusLabel('serve')).toBe('Serving')
    expect(focusLabel('set')).toBe('Setting')
    expect(focusLabel('movement')).toBe('Movement')
    expect(focusLabel('conditioning')).toBe('Conditioning')
    expect(focusLabel('recovery')).toBe('Recovery')
    expect(focusLabel('warmup')).toBe('Warm up')
    expect(focusLabel('partial')).toBe('Mixed')
  })
})
