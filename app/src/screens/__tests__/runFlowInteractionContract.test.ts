import { describe, expect, it } from 'vitest'
import {
  RUN_FLOW_INTERACTION_CONTRACT,
  type RunFlowInteractionId,
} from '../runFlowInteractionContract'

const REQUIRED_IDS: readonly RunFlowInteractionId[] = [
  'run.preroll',
  'run.wake_lock_hint',
  'run.pause_settling_modal',
  'run.persistence_error',
  'run.skip_route',
  'run.swap_error',
  'drill_check.disabled_continue_hint',
  'drill_check.save_pending',
  'drill_check.save_error',
  'drill_check.bypass_without_flicker',
  'transition.skip_route',
  'transition.swap_error',
  'review.disabled_submit_hint',
  'review.finish_later_persistence',
  'review.route_outcomes',
] as const

const TEST_MODULES = import.meta.glob([
  './*.test.ts',
  './*.test.tsx',
  '../run/__tests__/*.test.tsx',
  '../../hooks/*.test.ts',
  '../../components/__tests__/*.test.tsx',
])

function contractTestExists(fileName: string): boolean {
  return Object.keys(TEST_MODULES).some((path) => path.endsWith(`/${fileName}`))
}

describe('run flow interaction contract', () => {
  it('covers every controller-sensitive run-flow state before screen extraction', () => {
    const ids = RUN_FLOW_INTERACTION_CONTRACT.map((item) => item.id)
    expect(ids).toEqual(REQUIRED_IDS)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('keeps each invariant tied to an executable test surface', () => {
    for (const item of RUN_FLOW_INTERACTION_CONTRACT) {
      expect(item.invariant.trim().length).toBeGreaterThan(24)
      expect(item.coveredBy.length).toBeGreaterThan(0)
      expect(item.coveredBy.every((file) => file.endsWith('.test.ts') || file.endsWith('.test.tsx'))).toBe(
        true,
      )
      expect(item.coveredBy.every(contractTestExists)).toBe(true)
    }
  })
})
