import { describe, expect, it } from 'vitest'
import {
  RUN_FLOW_INTERACTION_CONTRACT,
  SUNSET_RUN_FLOW_CONTRACT,
  type RunFlowInteractionId,
} from '../runFlowInteractionContract'

const REQUIRED_IDS: readonly RunFlowInteractionId[] = [
  'run.preroll',
  'run.wake_lock_hint',
  'run.pause_settling_modal',
  'run.persistence_error',
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
  '../../screens/__tests__/*.test.ts',
  '../../screens/__tests__/*.test.tsx',
  '../../screens/run/__tests__/*.test.tsx',
  '../../hooks/*.test.ts',
  '../../components/__tests__/*.test.tsx',
  '../../domain/runFlow/__tests__/*.test.ts',
])

function contractTestExists(fileName: string): boolean {
  return Object.keys(TEST_MODULES).some((path) => path.endsWith(`/${fileName}`))
}

describe('run flow interaction contract (transitional spec — U7)', () => {
  it('covers every controller-sensitive run-flow state still on the active list', () => {
    const ids = RUN_FLOW_INTERACTION_CONTRACT.map((item) => item.id)
    expect(ids).toEqual(REQUIRED_IDS)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('keeps each invariant tied to an executable test surface', () => {
    for (const item of RUN_FLOW_INTERACTION_CONTRACT) {
      expect(item.invariant.trim().length).toBeGreaterThan(24)
      expect(item.coveredBy.length).toBeGreaterThan(0)
      expect(
        item.coveredBy.every((file) => file.endsWith('.test.ts') || file.endsWith('.test.tsx')),
      ).toBe(true)
      expect(item.coveredBy.every(contractTestExists)).toBe(true)
    }
  })
})

describe('sunset rule', () => {
  it('records at least one retired invariant', () => {
    expect(SUNSET_RUN_FLOW_CONTRACT.length).toBeGreaterThan(0)
  })

  it('removes every retired id from the active list', () => {
    const activeIds = new Set<string>(RUN_FLOW_INTERACTION_CONTRACT.map((c) => c.id))
    for (const sunset of SUNSET_RUN_FLOW_CONTRACT) {
      expect(activeIds.has(sunset.id)).toBe(false)
    }
  })

  it('points each retired invariant at a structural home and a covering test', () => {
    for (const sunset of SUNSET_RUN_FLOW_CONTRACT) {
      expect(sunset.movedTo.structuralHome.trim().length).toBeGreaterThan(16)
      expect(sunset.movedTo.coveredBy.length).toBeGreaterThan(0)
      expect(sunset.movedTo.coveredBy.every(contractTestExists)).toBe(true)
    }
  })

  it('confirms run.skip_route specifically migrated to the postBlockRoute domain policy', () => {
    const skipRoute = SUNSET_RUN_FLOW_CONTRACT.find((c) => c.id === 'run.skip_route')
    expect(skipRoute).toBeDefined()
    expect(skipRoute?.movedTo.structuralHome).toContain('postBlockRoute')
    expect(skipRoute?.movedTo.coveredBy).toContain('postBlockRoute.test.ts')
  })
})
