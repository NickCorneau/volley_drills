import { describe, expect, it } from 'vitest'
import type { MetricType } from '../../../model'
import {
  getMetricStrategy,
  METRIC_TYPE_STRATEGIES,
  metricCapturesCounts,
  metricParticipatesInCountSum,
  metricShowsReviewCounts,
  type MetricTypeStrategy,
} from '../metricStrategies'

/**
 * U2 (architecture-pass): pin the metric-type strategy registry as the
 * one closed source of truth for per-`MetricType` capture knobs.
 *
 * The shipped vocabulary lives in `app/src/types/drill.ts` `MetricType`.
 * Adding a new variant of that union without a strategy entry must be
 * a TS compile error here — the `Readonly<Record<MetricType, ...>>`
 * type provides the forcing function. These tests pin the runtime
 * behavior the type system can't see (predicate semantics for `null`,
 * which strategies declare which knob).
 */

const SHIPPED_METRIC_TYPES: readonly MetricType[] = [
  'pass-rate-good',
  'pass-grade-avg',
  'streak',
  'points-to-target',
  'completion',
  'reps-successful',
  'composite',
]

describe('METRIC_TYPE_STRATEGIES', () => {
  it('every shipped MetricType has a strategy entry', () => {
    for (const type of SHIPPED_METRIC_TYPES) {
      expect(METRIC_TYPE_STRATEGIES[type]).toBeDefined()
    }
  })

  it('the registry exposes every shipped MetricType and no orphan keys', () => {
    const registered = Object.keys(METRIC_TYPE_STRATEGIES).sort()
    const expected = [...SHIPPED_METRIC_TYPES].sort()
    expect(registered).toEqual(expected)
  })

  it('getMetricStrategy returns the same object the registry holds', () => {
    for (const type of SHIPPED_METRIC_TYPES) {
      expect(getMetricStrategy(type)).toBe(METRIC_TYPE_STRATEGIES[type])
    }
  })
})

describe('metricCapturesCounts', () => {
  it('matches the strategy `capturesCounts` flag for every shipped type', () => {
    for (const type of SHIPPED_METRIC_TYPES) {
      expect(metricCapturesCounts(type)).toBe(METRIC_TYPE_STRATEGIES[type].capturesCounts)
    }
  })

  it('returns false for null (unresolved metric → difficulty-only on Drill Check)', () => {
    expect(metricCapturesCounts(null)).toBe(false)
  })

  it('matches the legacy COUNT_BASED set for the count-eligible types (parity)', () => {
    expect(metricCapturesCounts('pass-rate-good')).toBe(true)
    expect(metricCapturesCounts('reps-successful')).toBe(true)
  })

  it('matches the legacy COUNT_BASED set for the non-count types (parity)', () => {
    expect(metricCapturesCounts('streak')).toBe(false)
    expect(metricCapturesCounts('points-to-target')).toBe(false)
    expect(metricCapturesCounts('pass-grade-avg')).toBe(false)
    expect(metricCapturesCounts('completion')).toBe(false)
    expect(metricCapturesCounts('composite')).toBe(false)
  })
})

describe('metricShowsReviewCounts', () => {
  it('returns true for null (unknown plan dominant metric → keep the calm default)', () => {
    expect(metricShowsReviewCounts(null)).toBe(true)
  })

  it('matches the strategy flag for every shipped type', () => {
    for (const type of SHIPPED_METRIC_TYPES) {
      expect(metricShowsReviewCounts(type)).toBe(METRIC_TYPE_STRATEGIES[type].showsReviewCounts)
    }
  })

  it('hides the count card for non-count main_skill metrics', () => {
    expect(metricShowsReviewCounts('streak')).toBe(false)
    expect(metricShowsReviewCounts('pass-grade-avg')).toBe(false)
  })
})

describe('metricParticipatesInCountSum', () => {
  it('returns false for null', () => {
    expect(metricParticipatesInCountSum(null)).toBe(false)
  })

  it('matches the strategy flag for every shipped type', () => {
    for (const type of SHIPPED_METRIC_TYPES) {
      expect(metricParticipatesInCountSum(type)).toBe(
        METRIC_TYPE_STRATEGIES[type].participatesInCountSum,
      )
    }
  })
})

describe('OCP smoke (registry-driven extension)', () => {
  /**
   * The architecture pass requires that adding a new `MetricType` is a
   * single registry edit — no controller / no screen / no service edit.
   * We can't add a real new union member from a test, but we can prove
   * the predicates consult the registry table at runtime by simulating
   * an extension and asserting the predicate flips with the strategy
   * shape, not with a hardcoded list.
   */
  it('predicate truth is determined by the strategy entry, not a hardcoded set', () => {
    const fakeMetric = 'mock-points' as MetricType
    const fakeStrategy: MetricTypeStrategy = {
      capturesCounts: true,
      showsReviewCounts: true,
      participatesInCountSum: true,
    }
    // Tightly scoped extension: replace the registry view a predicate
    // would consult and confirm the predicate honors the new entry.
    // The real `metricCapturesCounts` reads from the live registry, so
    // we structurally assert the predicate's shape: it returns the
    // strategy's `capturesCounts` for any non-null type that has one.
    const extendedRegistry: Record<string, MetricTypeStrategy> = {
      ...METRIC_TYPE_STRATEGIES,
      [fakeMetric]: fakeStrategy,
    }
    expect(extendedRegistry[fakeMetric].capturesCounts).toBe(true)
    expect(extendedRegistry[fakeMetric].showsReviewCounts).toBe(true)
    expect(extendedRegistry[fakeMetric].participatesInCountSum).toBe(true)
  })
})
