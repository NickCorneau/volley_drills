import type { MetricType, SessionPlanBlock } from '../model'
import { drillForBlock, variantForBlock } from './catalogLookup'

/**
 * Resolve the success-metric type for a planned block by walking the
 * drill catalog. See `variantForBlock` for the selection rule and
 * null-return contract.
 */
export function getBlockMetricType(
  block: SessionPlanBlock | null | undefined,
  playerCount: 1 | 2,
): MetricType | null {
  return variantForBlock(block, playerCount)?.successMetric.type ?? null
}

/**
 * Resolve the per-drill success rule (the one-sentence criterion the
 * tester scores each rep against) for a planned block by walking the
 * drill catalog. Returns the variant's `successMetric.description`, or
 * `null` when the block resolves to no variant.
 *
 * Used by `DrillCheckScreen` to render the V0B-28 forced-criterion
 * prompt above the optional Good/Total counts inside `PerDrillCapture`.
 * Sourcing from the drill record (vs hard-coded passing copy) is what
 * lets the prompt generalize across pass / serve / set drills as the
 * catalog grows. See `docs/specs/m001-review-micro-spec.md` §Required
 * (line 78) and `docs/archive/plans/2026-04-27-per-drill-success-criterion.md`.
 */
export function getBlockSuccessRule(
  block: SessionPlanBlock | null | undefined,
  playerCount: 1 | 2,
): string | null {
  return variantForBlock(block, playerCount)?.successMetric.description ?? null
}

/**
 * Resolve the run-flow eyebrow's **primary skill focus** for a planned
 * block. Returns one of `'pass' | 'serve' | 'set'` when the block's
 * drill carries that skill as its first `skillFocus` entry, or `null`
 * when:
 *   - The drill is unknown (synthetic test, legacy plan, missing
 *     drillId).
 *   - The drill's primary `skillFocus` is non-skill (`'warmup'`,
 *     `'recovery'`, `'movement'` standalone — though `movement`
 *     standalone doesn't ship in M001; `pass + movement` drills'
 *     primary is `pass`).
 *   - The drill carries a skill we don't yet surface in the eyebrow
 *     vocabulary (`'attack'`, `'block'`, `'dig'`, `'conditioning'`).
 *
 * Used by `RunScreen` and `TransitionScreen` to compose the header
 * eyebrow as `{phaseLabel} · {skillLabel}` for skill-bearing blocks
 * (the **2026-04-27 cca2 dogfeed F8 follow-up**: the founder asked
 * "is this a serving drill?" while looking at a setup-led courtside
 * paragraph; making the skill visible at the eyebrow answers it
 * before any body copy is read). Warmup / wrap blocks return `null`
 * here so the eyebrow stays just `Warm up` / `Downshift`.
 *
 * Returns the **drill-level** primary skillFocus, not a session-wide
 * focus, because v0b doesn't yet carry an explicit `sessionFocus`
 * field (Tier 1c). When Tier 1c lands, the eyebrow can additionally
 * cite the user-selected `sessionFocus` and verify it matches the
 * resolved per-block skillFocus.
 */
export type EyebrowSkillFocus = 'pass' | 'serve' | 'set'

const EYEBROW_SKILL_FOCUSES: ReadonlySet<string> = new Set(['pass', 'serve', 'set'])

export function getBlockSkillFocus(
  block: SessionPlanBlock | null | undefined,
  playerCount: 1 | 2,
): EyebrowSkillFocus | null {
  // Variant-level resolution stays for parity with the other
  // `getBlockX` helpers, even though variants don't override
  // skillFocus today. If a future variant ever carries its own
  // skill override, the lookup happens at the same grain as the
  // success-rule and metric-type lookups.
  void variantForBlock(block, playerCount)
  const drill = drillForBlock(block)
  const primary = drill?.skillFocus[0]
  if (primary && EYEBROW_SKILL_FOCUSES.has(primary)) {
    return primary as EyebrowSkillFocus
  }
  return null
}
