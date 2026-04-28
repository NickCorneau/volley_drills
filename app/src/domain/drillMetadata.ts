import { DRILLS } from '../data/drills'
import type { SessionPlanBlock } from '../db/types'
import type { Drill, DrillVariant, MetricType } from '../types/drill'

/**
 * Resolve the variant a planned block would render under.
 *
 * Resolution order (red-team adversarial finding, 2026-04-27):
 *   1. Exact `block.variantId` match. The session builder writes the
 *      chosen variant's id onto every block; downstream lookups must
 *      respect that decision rather than re-deriving from the
 *      participants envelope. Without this, the new pair variants land
 *      a participants envelope of `{ min: 2, max: 2 }` and the legacy
 *      solo variant a `{ min: 1, max: 1 }` envelope - so a stored
 *      `variantId: 'd38-pair'` block on a `playerCount = 1` projection
 *      (mid-session player-count switch, restored solo plan, exporter
 *      hydration) would silently flip to `d38-solo` and quietly change
 *      the success-metric type the tester is being scored against.
 *   2. Participants-envelope bracket against `playerCount` (legacy
 *      blocks with no `variantId`).
 *   3. First variant on the drill (synthetic / legacy fallback).
 *
 * Returns `null` when the block is unknown (synthetic drill names in
 * tests, legacy plans with no `drillId`, or a drillId that no longer
 * exists in `DRILLS`).
 *
 * Centralized here so the per-block lookup in `getBlockMetricType` and
 * `getBlockSuccessRule` cannot drift apart - the V0B-28 forced-criterion
 * prompt's correctness depends on the rule and the metric type both
 * coming from the same variant.
 */
function resolveBlockVariant(
  block: SessionPlanBlock | null | undefined,
  playerCount: 1 | 2,
): DrillVariant | null {
  if (!block) return null
  const drill = DRILLS.find((d) =>
    block.drillId ? d.id === block.drillId : d.name === block.drillName,
  )
  if (!drill) return null
  if (block.variantId) {
    const exact = drill.variants.find((v) => v.id === block.variantId)
    if (exact) return exact
  }
  return (
    drill.variants.find(
      (v) => v.participants.min <= playerCount && playerCount <= v.participants.max,
    ) ??
    drill.variants[0] ??
    null
  )
}

/**
 * Resolve the success-metric type for a planned block by walking the
 * drill catalog. See `resolveBlockVariant` for the selection rule and
 * null-return contract.
 */
export function getBlockMetricType(
  block: SessionPlanBlock | null | undefined,
  playerCount: 1 | 2,
): MetricType | null {
  return resolveBlockVariant(block, playerCount)?.successMetric.type ?? null
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
 * (line 78) and `docs/plans/2026-04-27-per-drill-success-criterion.md`.
 */
export function getBlockSuccessRule(
  block: SessionPlanBlock | null | undefined,
  playerCount: 1 | 2,
): string | null {
  return resolveBlockVariant(block, playerCount)?.successMetric.description ?? null
}

/**
 * Resolve the drill catalog row (not the variant) for a planned block.
 * Returns `null` when no drill matches the block's `drillId`.
 *
 * Used by `getBlockSkillFocus` (the run-flow eyebrow's skill marker)
 * because the **drill-level** `skillFocus` is the source-of-truth for
 * "what skill is this drill working" (D105 architectural invariant
 * 1: single skillFocus per drill). The variant carries
 * `participants` / `feedType` / `equipment` overrides but inherits
 * skill identity from the drill row above it.
 */
function resolveBlockDrill(
  block: SessionPlanBlock | null | undefined,
): Drill | null {
  if (!block) return null
  return (
    DRILLS.find((d) => (block.drillId ? d.id === block.drillId : d.name === block.drillName)) ??
    null
  )
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
  void resolveBlockVariant(block, playerCount)
  const drill = resolveBlockDrill(block)
  const primary = drill?.skillFocus[0]
  if (primary && EYEBROW_SKILL_FOCUSES.has(primary)) {
    return primary as EyebrowSkillFocus
  }
  return null
}
