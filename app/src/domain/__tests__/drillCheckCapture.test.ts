import { describe, expect, it } from 'vitest'
import type { ExecutionLog, SessionPlan, SessionPlanBlock } from '../../db'
import { resolveDrillCheckCaptureEligibility } from '../drillCheckCapture'

function block(overrides: Partial<SessionPlanBlock> = {}): SessionPlanBlock {
  return {
    id: 'block-prev',
    type: 'main_skill',
    drillId: 'd03',
    variantId: 'd03-pair',
    drillName: 'Continuous Passing',
    shortName: 'Continuous',
    durationMinutes: 8,
    coachingCue: '',
    courtsideInstructions: '',
    required: true,
    ...overrides,
  }
}

function plan(prevBlock: SessionPlanBlock, overrides: Partial<SessionPlan> = {}): SessionPlan {
  return {
    id: 'plan-capture',
    presetId: 'pair_open',
    presetName: 'Pair + Open',
    playerCount: 2,
    blocks: [
      prevBlock,
      block({
        id: 'block-next',
        type: 'wrap',
        drillId: 'd25',
        variantId: 'd25-any',
        drillName: 'Downshift',
      }),
    ],
    safetyCheck: { painFlag: false, heatCta: false, painOverridden: false },
    createdAt: 0,
    ...overrides,
  }
}

function execution(
  overrides: Partial<ExecutionLog> & { prevStatus?: 'completed' | 'skipped' } = {},
): ExecutionLog {
  const prevStatus = overrides.prevStatus ?? 'completed'
  return {
    id: 'exec-capture',
    planId: 'plan-capture',
    status: 'in_progress',
    activeBlockIndex: 1,
    blockStatuses: [
      { blockId: 'block-prev', status: prevStatus },
      { blockId: 'block-next', status: 'planned' },
    ],
    startedAt: 0,
    ...overrides,
  }
}

describe('resolveDrillCheckCaptureEligibility', () => {
  it('captures count-eligible technique blocks with counts', () => {
    const result = resolveDrillCheckCaptureEligibility({
      plan: plan(block({ type: 'technique', drillId: 'd10', variantId: 'd10-pair' })),
      execution: execution(),
      currentBlockIndex: 1,
    })

    expect(result.status).toBe('eligible_counts')
    if (result.status === 'eligible_counts') {
      expect(result.block.type).toBe('technique')
      expect(result.metricType).toBe('pass-rate-good')
    }
  })

  it('captures count-eligible movement_proxy blocks with counts', () => {
    const result = resolveDrillCheckCaptureEligibility({
      plan: plan(block({ type: 'movement_proxy', drillId: 'd03', variantId: 'd03-pair' })),
      execution: execution(),
      currentBlockIndex: 1,
    })

    expect(result.status).toBe('eligible_counts')
    if (result.status === 'eligible_counts') {
      expect(result.block.type).toBe('movement_proxy')
      expect(result.metricType).toBe('pass-rate-good')
    }
  })

  it('captures reps-successful pressure blocks with counts', () => {
    const result = resolveDrillCheckCaptureEligibility({
      plan: plan(block({ type: 'pressure', drillId: 'd33', variantId: 'd33-pair' })),
      execution: execution(),
      currentBlockIndex: 1,
    })

    expect(result.status).toBe('eligible_counts')
    if (result.status === 'eligible_counts') {
      expect(result.block.type).toBe('pressure')
      expect(result.metricType).toBe('reps-successful')
    }
  })

  it('keeps non-count technique blocks bypassed until Phase 2 metric shapes ship', () => {
    const result = resolveDrillCheckCaptureEligibility({
      plan: plan(block({ type: 'technique', drillId: 'd38', variantId: 'd38-pair' })),
      execution: execution(),
      currentBlockIndex: 1,
    })

    expect(result).toEqual({ status: 'bypass', reason: 'non_count_support_slot' })
  })

  it('keeps main_skill non-count blocks eligible for difficulty-only capture', () => {
    const result = resolveDrillCheckCaptureEligibility({
      plan: plan(block({ type: 'main_skill', drillId: 'd38', variantId: 'd38-pair' })),
      execution: execution(),
      currentBlockIndex: 1,
    })

    expect(result.status).toBe('eligible_difficulty_only')
    if (result.status === 'eligible_difficulty_only') {
      expect(result.metricType).toBe('streak')
    }
  })

  it('bypasses skipped blocks', () => {
    const result = resolveDrillCheckCaptureEligibility({
      plan: plan(block({ type: 'main_skill', drillId: 'd03', variantId: 'd03-pair' })),
      execution: execution({ prevStatus: 'skipped' }),
      currentBlockIndex: 1,
    })

    expect(result).toEqual({ status: 'bypass', reason: 'previous_block_not_completed' })
  })

  it('bypasses blocks without catalog identifiers', () => {
    const result = resolveDrillCheckCaptureEligibility({
      plan: plan(block({ type: 'main_skill', drillId: undefined, variantId: undefined })),
      execution: execution(),
      currentBlockIndex: 1,
    })

    expect(result).toEqual({ status: 'bypass', reason: 'missing_catalog_ids' })
  })

  it('routes completed sessions to review instead of capturing the last block', () => {
    const result = resolveDrillCheckCaptureEligibility({
      plan: plan(block({ type: 'main_skill', drillId: 'd03', variantId: 'd03-pair' })),
      execution: execution({ status: 'completed', activeBlockIndex: 2 }),
      currentBlockIndex: 2,
    })

    expect(result).toEqual({ status: 'bypass', reason: 'session_complete' })
  })
})
