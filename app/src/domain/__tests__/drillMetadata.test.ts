import { describe, expect, it } from 'vitest'
import type { SessionPlanBlock } from '../../db/types'
import { getBlockMetricType, getBlockSuccessRule } from '../drillMetadata'

/**
 * Pins the variant-resolution contract that powers the V0B-28
 * forced-criterion prompt on `/run/check`. Both helpers MUST resolve to
 * the same variant for any given (block, playerCount) pair so the
 * count-eligibility decision and the rule rendered above the inputs can
 * never disagree. See
 * `docs/plans/2026-04-27-per-drill-success-criterion.md` and
 * `docs/specs/m001-review-micro-spec.md` §Required line 78.
 */

function makeBlock(overrides: Partial<SessionPlanBlock>): SessionPlanBlock {
  return {
    id: 'block-1',
    type: 'main_skill',
    drillId: 'd31',
    variantId: 'd31-solo-open',
    drillName: 'Self Toss Target Practice',
    shortName: 'Target Serve',
    durationMinutes: 8,
    coachingCue: 'One target before each serve.',
    courtsideInstructions: 'Mark a 2 m target circle...',
    required: true,
    ...overrides,
  }
}

describe('getBlockMetricType', () => {
  it('returns the variant`s metric type for a known drill block', () => {
    const block = makeBlock({ drillId: 'd31', variantId: 'd31-solo-open' })
    expect(getBlockMetricType(block, 1)).toBe('reps-successful')
  })

  it('returns null for an unknown drillId', () => {
    const block = makeBlock({ drillId: 'd-does-not-exist' })
    expect(getBlockMetricType(block, 1)).toBeNull()
  })

  it('returns null for a null/undefined block', () => {
    expect(getBlockMetricType(null, 1)).toBeNull()
    expect(getBlockMetricType(undefined, 1)).toBeNull()
  })

  it('selects the variant whose participants envelope brackets the player count (pair)', () => {
    // d31 has both d31-solo-open (max=1) and d31-pair (min=2). Player
    // count 2 must resolve to the pair sibling so the metric and the
    // rule both come from the right variant. Both variants are
    // `reps-successful` here so the test is structural rather than
    // discriminating on the metric type itself.
    const block = makeBlock({ drillId: 'd31', variantId: 'd31-pair' })
    expect(getBlockMetricType(block, 2)).toBe('reps-successful')
  })
})

describe('getBlockSuccessRule', () => {
  it('returns the variant`s successMetric.description for a known drill block', () => {
    const block = makeBlock({ drillId: 'd31', variantId: 'd31-solo-open' })
    expect(getBlockSuccessRule(block, 1)).toBe(
      'Serves or serve-toss contacts landing in or near a marked target circle.',
    )
  })

  it('returns the per-attempt rule for d33 (re-worded under V0B-28 surface-move)', () => {
    // Pre-2026-04-27 d33 carried a session-level zone enumeration in
    // `description`; the V0B-28 surface-move requires a per-attempt
    // rule because the description renders inside the forced-criterion
    // prompt above per-rep Good/Total counts.
    const block = makeBlock({ drillId: 'd33' })
    expect(getBlockSuccessRule(block, 1)).toBe('Serve lands in the called zone.')
    expect(getBlockSuccessRule(block, 2)).toBe('Serve lands in the called zone.')
  })

  it('returns null for an unknown drillId', () => {
    const block = makeBlock({ drillId: 'd-does-not-exist' })
    expect(getBlockSuccessRule(block, 1)).toBeNull()
  })

  it('returns null for a null/undefined block', () => {
    expect(getBlockSuccessRule(null, 1)).toBeNull()
    expect(getBlockSuccessRule(undefined, 1)).toBeNull()
  })

  it('resolves the same variant as getBlockMetricType for the same input', () => {
    // The two helpers MUST agree on the variant they resolve, otherwise
    // the count-eligibility decision could fire while the criterion
    // came from the wrong variant. d05 has both Solo and Pair siblings
    // and both happen to use `pass-rate-good`; the descriptions differ
    // by variant ("partner-reachable without a step" only on the pair
    // sibling), so verifying they co-resolve is non-trivial.
    const soloBlock = makeBlock({ drillId: 'd05', variantId: 'd05-solo' })
    expect(getBlockMetricType(soloBlock, 1)).toBe('pass-rate-good')
    expect(getBlockSuccessRule(soloBlock, 1)).toMatch(/0–3 rubric/)

    const pairBlock = makeBlock({ drillId: 'd05', variantId: 'd05-pair' })
    expect(getBlockMetricType(pairBlock, 2)).toBe('pass-rate-good')
    expect(getBlockSuccessRule(pairBlock, 2)).toMatch(/partner-reachable without a step/)
  })

  it('prefers the exact variantId over the participants envelope when the two disagree (red-team adversarial finding 2026-04-27)', () => {
    // A block stored with `variantId: 'd31-pair'` but evaluated under
    // `playerCount: 1` (e.g. a restored solo plan, exporter hydration,
    // or mid-session player-count switch) MUST resolve to the exact
    // pair variant the session builder picked - not silently fall back
    // to `d31-solo-open` because the pair envelope is `{ min: 2, max: 2 }`
    // and the legacy solo envelope is `{ min: 1, max: 1 }`. The previous
    // resolution rule used only `participants.min..max` against
    // `playerCount`, so this scenario quietly flipped to the wrong
    // variant and changed the per-attempt rule the tester was being
    // scored against. Pinning the variantId-first rule prevents
    // regression.
    const block = makeBlock({ drillId: 'd31', variantId: 'd31-pair' })
    expect(getBlockSuccessRule(block, 1)).toMatch(/named by the shagger/)
    // And the symmetric case: a Solo block evaluated under playerCount 2
    // (a paired session that resumed a solo plan) stays on the Solo
    // variant rather than envelope-flipping to Pair.
    const soloBlock = makeBlock({ drillId: 'd31', variantId: 'd31-solo-open' })
    expect(getBlockSuccessRule(soloBlock, 2)).toMatch(
      /^Serves or serve-toss contacts landing in or near/,
    )
  })

  it('falls back to the participants envelope when variantId is absent (legacy plan)', () => {
    // Legacy session plans persisted before variantId was added rely on
    // the participants envelope. Confirm the fallback still works so
    // older ExecutionLogs continue to resolve. Use Object spread so we
    // can omit `variantId` despite the current required type.
    const block: SessionPlanBlock = {
      ...makeBlock({ drillId: 'd31' }),
    }
    delete (block as { variantId?: string }).variantId
    expect(getBlockSuccessRule(block, 2)).toMatch(/named by the shagger/)
  })
})
