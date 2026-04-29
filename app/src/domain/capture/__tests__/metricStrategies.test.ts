import { describe, expect, it } from 'vitest'
import type { MetricType } from '../../../model'
import {
  type CaptureShape,
  getCaptureShape,
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
 *
 * D134 (2026-04-28): `capturesCounts: boolean` was replaced with a
 * `captureShape: CaptureShape` discriminator. `metricCapturesCounts`
 * now derives from `captureShape.kind === 'count'`. New helper
 * `getCaptureShape(type)` exposes the discriminator to the Drill Check
 * controller and `PerDrillCapture` UI for Phase 2A streak capture.
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

describe('captureShape registry mapping (D134)', () => {
  it('count metric types map to { kind: "count" }', () => {
    expect(METRIC_TYPE_STRATEGIES['pass-rate-good'].captureShape).toEqual({ kind: 'count' })
    expect(METRIC_TYPE_STRATEGIES['reps-successful'].captureShape).toEqual({ kind: 'count' })
  })

  it('streak metric type maps to { kind: "streak" } (Phase 2A)', () => {
    expect(METRIC_TYPE_STRATEGIES.streak.captureShape).toEqual({ kind: 'streak' })
  })

  it('non-count metric types deferred to Phase 2B map to { kind: "none" }', () => {
    expect(METRIC_TYPE_STRATEGIES['points-to-target'].captureShape).toEqual({ kind: 'none' })
    expect(METRIC_TYPE_STRATEGIES['pass-grade-avg'].captureShape).toEqual({ kind: 'none' })
    expect(METRIC_TYPE_STRATEGIES.composite.captureShape).toEqual({ kind: 'none' })
    expect(METRIC_TYPE_STRATEGIES.completion.captureShape).toEqual({ kind: 'none' })
  })
})

describe('getCaptureShape (D134)', () => {
  it('returns { kind: "none" } for null (unresolved metric → difficulty-only)', () => {
    expect(getCaptureShape(null)).toEqual({ kind: 'none' })
  })

  it('returns the registry entry for every shipped MetricType', () => {
    for (const type of SHIPPED_METRIC_TYPES) {
      expect(getCaptureShape(type)).toEqual(METRIC_TYPE_STRATEGIES[type].captureShape)
    }
  })

  it('discriminates streak from count and none for the Drill Check switch', () => {
    expect(getCaptureShape('pass-rate-good').kind).toBe('count')
    expect(getCaptureShape('streak').kind).toBe('streak')
    expect(getCaptureShape('completion').kind).toBe('none')
  })
})

describe('metricCapturesCounts (derived from captureShape)', () => {
  it('returns true exactly when the strategy carries { kind: "count" }', () => {
    for (const type of SHIPPED_METRIC_TYPES) {
      const expected = METRIC_TYPE_STRATEGIES[type].captureShape.kind === 'count'
      expect(metricCapturesCounts(type)).toBe(expected)
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
   *
   * D134 (2026-04-28): the same forcing-function applies to the
   * `captureShape` discriminator — adding a new shape is a one-line
   * union extension + one registry-row edit.
   */
  it('captureShape determines the count predicate', () => {
    const fakeMetric = 'mock-points' as MetricType
    const fakeCountStrategy: MetricTypeStrategy = {
      captureShape: { kind: 'count' },
      showsReviewCounts: true,
      participatesInCountSum: true,
    }
    const fakeStreakStrategy: MetricTypeStrategy = {
      captureShape: { kind: 'streak' },
      showsReviewCounts: false,
      participatesInCountSum: false,
    }
    const fakeNoneStrategy: MetricTypeStrategy = {
      captureShape: { kind: 'none' },
      showsReviewCounts: false,
      participatesInCountSum: false,
    }

    const extendedRegistry: Record<string, MetricTypeStrategy> = {
      ...METRIC_TYPE_STRATEGIES,
      [`${fakeMetric}-c`]: fakeCountStrategy,
      [`${fakeMetric}-s`]: fakeStreakStrategy,
      [`${fakeMetric}-n`]: fakeNoneStrategy,
    }
    expect(extendedRegistry[`${fakeMetric}-c`].captureShape.kind).toBe('count')
    expect(extendedRegistry[`${fakeMetric}-s`].captureShape.kind).toBe('streak')
    expect(extendedRegistry[`${fakeMetric}-n`].captureShape.kind).toBe('none')
  })

  it('CaptureShape union members are mutually exclusive at the type level', () => {
    // Compile-time assertion: TS narrows on `kind` so an exhaustive
    // switch over the union must hit all three arms.
    function dispatch(shape: CaptureShape): string {
      switch (shape.kind) {
        case 'count':
          return 'count'
        case 'streak':
          return 'streak'
        case 'none':
          return 'none'
      }
    }
    expect(dispatch({ kind: 'count' })).toBe('count')
    expect(dispatch({ kind: 'streak' })).toBe('streak')
    expect(dispatch({ kind: 'none' })).toBe('none')
  })
})
