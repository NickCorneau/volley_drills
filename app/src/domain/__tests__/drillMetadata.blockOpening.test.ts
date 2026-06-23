import { describe, expect, it } from 'vitest'
import { getStressRung } from '../../data/stressLadders'
import { resolveBlockOpeningIntent, resolveBlockRungIntent } from '../drillMetadata'
import type { SessionPlanBlock } from '../../model'

/**
 * `resolveBlockOpeningIntent` gates the authored rung `intent` to the
 * block-opening Transition only — the run-flow beat contract Stage 1 rule
 * that the "what this rung trains" line shows once when a focus block opens
 * and recedes for the rest of that focus run (R6; spec
 * `docs/specs/run-flow-beat-contract.md`). The off-ladder nuance is
 * delegated to `resolveBlockRungIntent` (pinned in
 * `drillMetadata.rungIntent.test.ts`).
 */

const PASS_RUNG_3_INTENT = 'Read where the ball is going, move to it, and still pass to one target.'

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

const warmup = makeBlock({ id: 'b-0', type: 'warmup', drillId: 'd28', variantId: 'd28-solo', drillName: 'Beach Prep Three' })
const passMain = makeBlock({ id: 'b-1', type: 'main_skill', drillId: 'd24', variantId: 'd24-solo', drillName: 'Pass into a Corner' })
const passSecond = makeBlock({ id: 'b-2', type: 'pressure', drillId: 'd20', drillName: '3 Serve Pass to Attack' })
const setMain = makeBlock({ id: 'b-3', type: 'main_skill', drillId: 'd38', variantId: 'd38-pair', drillName: 'Bump Set Fundamentals' })

// Set focus run interrupted by a pass-focus support block, then resumed.
// A focus-controlled support slot can resolve to a different primary focus
// than its set neighbors (d24 is pass-primary, like d20/d21 in a set
// session's technique/movement slot), so the focus sequence reads
// set → pass → set.
const setOpen = makeBlock({ id: 'b-10', type: 'technique', drillId: 'd38', variantId: 'd38-pair', drillName: 'Bump Set Fundamentals' })
const passInterleave = makeBlock({ id: 'b-11', type: 'movement_proxy', drillId: 'd24', variantId: 'd24-solo', drillName: 'Pass into a Corner' })
const setResume = makeBlock({ id: 'b-12', type: 'main_skill', drillId: 'd41', variantId: 'd41-pair', drillName: 'Partner Set Back-and-Forth' })

describe('resolveBlockOpeningIntent', () => {
  it('returns the intent at a focus-block opening (warmup → pass)', () => {
    const blocks = [warmup, passMain]
    expect(resolveBlockOpeningIntent(blocks, 1, 1)).toBe(PASS_RUNG_3_INTENT)
  })

  it('suppresses the intent mid-block when the focus matches the previous block', () => {
    // index 2 (pass) follows index 1 (pass): same focus run → no opening,
    // even though the pressure block is itself on the pass ladder.
    const blocks = [warmup, passMain, passSecond]
    expect(resolveBlockOpeningIntent(blocks, 2, 2)).toBeNull()
  })

  it('treats index 0 with a surfaced focus as an opening', () => {
    const blocks = [passMain]
    expect(resolveBlockOpeningIntent(blocks, 0, 1)).toBe(PASS_RUNG_3_INTENT)
  })

  it('returns null when the block has no surfaced focus (warmup)', () => {
    const blocks = [warmup, passMain]
    expect(resolveBlockOpeningIntent(blocks, 0, 1)).toBeNull()
  })

  it('returns the new focus intent when the focus changes (pass → set)', () => {
    // index 1 (set) follows index 0 (pass): focus change → opening → set intent.
    const blocks = [passMain, setMain]
    const setIntent = getStressRung('set', 1)?.intent ?? null
    expect(resolveBlockOpeningIntent(blocks, 1, 2)).toBe(setIntent)
    expect(setIntent).not.toBeNull()
  })

  it('does not re-open a focus when a different-focus support block interleaves the run', () => {
    // set → pass → set: the resumed set block (index 2) must NOT re-open its
    // intent. A previous-block-only compare would, because the interleaved
    // pass block differs from set; first-appearance keying suppresses it.
    const blocks = [setOpen, passInterleave, setResume]
    // The opening set block surfaces its intent...
    expect(resolveBlockOpeningIntent(blocks, 0, 2)).toBeTruthy()
    // ...the interleaved pass block opens its own (different) focus once...
    expect(resolveBlockOpeningIntent(blocks, 1, 2)).toBeTruthy()
    // ...and the resumed set block is suppressed even though it has a real,
    // non-null rung intent of its own (proving the null is gating, not a
    // missing rung).
    expect(resolveBlockRungIntent(setResume, 2)).toBeTruthy()
    expect(resolveBlockOpeningIntent(blocks, 2, 2)).toBeNull()
  })

  it('is null-safe for an absent list or out-of-range index', () => {
    expect(resolveBlockOpeningIntent(undefined, 0, 1)).toBeNull()
    expect(resolveBlockOpeningIntent(null, 0, 1)).toBeNull()
    expect(() => resolveBlockOpeningIntent([warmup], 9, 1)).not.toThrow()
    expect(resolveBlockOpeningIntent([warmup], 9, 1)).toBeNull()
  })
})
