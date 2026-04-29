import type {
  DifficultyTag,
  MetricCapture,
  PerDrillCapture,
} from '../../model'
import type { CaptureShape } from './metricStrategies'

/**
 * Pure-domain builders for per-drill capture rows (D134, 2026-04-28).
 *
 * Why this module exists:
 *
 *   `PerDrillCapture` is a discriminated union with three valid
 *   "filled" states (count row, metric-capture row, difficulty-only
 *   row) plus the `notCaptured` row. Pre-D134, controllers built
 *   these rows inline by spreading conditional objects, which works
 *   for two states but compounds at three or more. The Phase 2A
 *   addition of `metricCapture: { kind: 'streak'; longest: number }`
 *   makes the inline assembly genuinely error-prone — a single
 *   misplaced spread could produce a row with both `goodPasses` and
 *   `metricCapture`, or a `notCaptured: true` row that nonetheless
 *   carries a streak.
 *
 *   These helpers are the *only* sanctioned constructors of a
 *   `PerDrillCapture` row outside the persistence layer's "read it
 *   back" path. They take normalized inputs and return one of the
 *   four valid row shapes, refusing impossible combinations at the
 *   type level.
 *
 *   Layer rule: pure. No Dexie, no React, no platform IO. Inputs are
 *   model-level values; outputs are values.
 */

const STREAK_LONGEST_MIN = 0
const STREAK_LONGEST_MAX = 99

/**
 * Validate and normalize a streak `longest` input.
 *
 * Returns the clamped integer when the value is a finite whole number
 * inside `[0, 99]`; returns `null` for `NaN`, `Infinity`,
 * non-integers (including `1.5` and string "abc"), and out-of-range
 * values. Controllers persist a streak row only when this returns a
 * non-null value; otherwise the row falls through to a difficulty-
 * only row.
 *
 * Range: `0..99` matches the physical reality of a streak counter at
 * an amateur drill (founder dogfeed has shown streaks topping out at
 * single digits to low teens; the `99` ceiling protects against a
 * runaway free-text input without truncating any plausible real
 * value). The ceiling is encoded once here rather than in the UI.
 */
export function validateStreakLongest(value: unknown): number | null {
  if (typeof value !== 'number') return null
  if (!Number.isFinite(value)) return null
  if (!Number.isInteger(value)) return null
  if (value < STREAK_LONGEST_MIN || value > STREAK_LONGEST_MAX) return null
  return value
}

/**
 * Identifying fields shared by every `PerDrillCapture` row regardless
 * of variant. The builder accepts these as a single payload so call
 * sites do not have to thread them through every conditional branch.
 */
interface PerDrillCaptureIdentity {
  drillId: string
  variantId: string
  blockIndex: number
  difficulty: DifficultyTag
  capturedAt: number
}

/**
 * Closed input variants for `buildPerDrillCaptureRecord`. The TS union
 * is the forcing function: a caller cannot pass both `goodPasses` /
 * `attemptCount` *and* a `metricCapture`, nor combine `notCaptured`
 * with either, because each input variant disjointly omits the
 * fields it forbids. Adding a new shape (Phase 2B `points`, `grade`)
 * is a one-line union extension here plus a one-line registry-row
 * edit; the controllers keep their existing branch-on-shape pattern.
 *
 * Drift hazard: this union mirrors `CaptureShape` from `metricStrategies.ts`
 * (`'count' | 'streak' | 'none'`) plus the `'not_captured'` and
 * `'difficulty_only'` arms which have no metric-strategy analogue.
 * Phase 2B that adds `'points'` to `CaptureShape` MUST also add
 * `'points'` here; the TS exhaustiveness check in
 * `buildPerDrillCaptureRecord` is the forcing function — but two
 * commits separated by months can still drift, so reviewers checking
 * a Phase 2B PR should cross-reference both files.
 */
export type BuildPerDrillCaptureInput = PerDrillCaptureIdentity &
  (
    | {
        kind: 'difficulty_only'
      }
    | {
        kind: 'count'
        goodPasses: number
        attemptCount: number
      }
    | {
        kind: 'streak'
        streakLongest: number
      }
    | {
        kind: 'not_captured'
      }
  )

/**
 * Build a `PerDrillCapture` row from a normalized input. The pure
 * builder is the only sanctioned constructor outside the persistence-
 * read path; controllers MUST go through this so the row union's
 * mutual-exclusion guarantees stay enforced as new shapes land.
 *
 * Inputs are assumed pre-validated:
 *
 *   - `count` rows pass `goodPasses` and `attemptCount` as
 *     non-negative integers (controllers already clamp these via
 *     `PassMetricInput`).
 *   - `streak` rows pass `streakLongest` after `validateStreakLongest`
 *     has accepted the value. Passing an invalid value here is
 *     defended against by the builder collapsing to a
 *     difficulty-only row, but call sites should validate first so
 *     the controller can show the inline correction text.
 *
 * The builder never invents counts. A `count` row with
 * `goodPasses === 0 && attemptCount === 0` *is* persisted as a count
 * row (the user explicitly chose to record a "tried but didn't get
 * any" outcome); a `difficulty_only` row is what the controller
 * should pass when no count was entered at all.
 */
export function buildPerDrillCaptureRecord(
  input: BuildPerDrillCaptureInput,
): PerDrillCapture {
  const base = {
    drillId: input.drillId,
    variantId: input.variantId,
    blockIndex: input.blockIndex,
    difficulty: input.difficulty,
    capturedAt: input.capturedAt,
  }

  switch (input.kind) {
    case 'count':
      return {
        ...base,
        goodPasses: input.goodPasses,
        attemptCount: input.attemptCount,
      }
    case 'streak': {
      // Defense in depth: even if a caller skipped the validator,
      // the builder refuses to construct an out-of-range streak row.
      // It collapses to the same row shape as the explicit
      // `'difficulty_only'` arm below (no count fields, no
      // metricCapture, no notCaptured) so the persistence-read path
      // sees a single-shape "tag-only" row regardless of which input
      // arm produced it. This matches the "invalid optional input
      // does not persist" UX rule on `/run/check`.
      const normalized = validateStreakLongest(input.streakLongest)
      if (normalized === null) {
        return { ...base }
      }
      const metricCapture: MetricCapture = { kind: 'streak', longest: normalized }
      return { ...base, metricCapture }
    }
    case 'not_captured':
      return { ...base, notCaptured: true }
    case 'difficulty_only':
      return { ...base }
  }
}

/**
 * Re-export `CaptureShape` so callers of the builder can pattern-
 * match on the same discriminator the registry exposes without
 * importing two paths.
 */
export type { CaptureShape }
