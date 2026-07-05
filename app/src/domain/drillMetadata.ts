import { isLiveCueGuardProtected } from '../data/liveCueGuard'
import { getStressRung, stressRungForDrill, type StressRung } from '../data/stressLadders'
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

/**
 * The stress rung a planned block sits on — the shared core of the
 * three per-field resolvers below (`intent` / live-cue override /
 * `reflection`), so the block→rung resolution rule exists exactly once:
 *
 *   - PRIMARY focus via `getBlockSkillFocus` (the same source the
 *     run-flow eyebrow uses, so rung content and the eyebrow never
 *     disagree on focus; dual-focus drills use their primary ladder),
 *   - drill-actual rung via `stressRungForDrill` — no derived ladder
 *     position, steering, or verdict-offer state is read,
 *   - no block-type gate (KTD3): rung content stays phase-matched over
 *     the same blocks across all three coaching-arc beats.
 *
 * Returns `null` for any block that is not ladder-bearing: non-surfaced
 * focus (warmup, wrap, recovery, or a non-surfaced skill), missing
 * `drillId` (drillName-only legacy blocks stay content-free rather than
 * guessed), or a drill off its focus's ladder (synthetic / legacy
 * plan). Pure (no React, no Dexie) and null-safe, so render-body
 * callers never throw (a throw in the run-flow body trips the app-root
 * ErrorBoundary).
 */
function resolveBlockStressRung(
  block: SessionPlanBlock | null | undefined,
  playerCount: 1 | 2,
): StressRung | null {
  const focus = getBlockSkillFocus(block, playerCount)
  if (!focus) return null
  const drillId = block?.drillId
  if (!drillId) return null
  const rung = stressRungForDrill(focus, drillId)
  if (rung === undefined) return null
  return getStressRung(focus, rung) ?? null
}

/**
 * Resolve the authored stress-rung `intent` for a planned block — the
 * "what this rung trains" technique-how line surfaced on the run flow's
 * block-opening get-ready beat (M002.2 run-time technique-how, plan
 * `docs/plans/2026-06-22-007-feat-m002-2-technique-how-transition-intent-plan.md`;
 * D163, relocated by the D167 Stage-4 collapse).
 *
 * `null` off-ladder (see `resolveBlockStressRung`) so the caller
 * renders nothing.
 */
export function resolveBlockRungIntent(
  block: SessionPlanBlock | null | undefined,
  playerCount: 1 | 2,
): string | null {
  return resolveBlockStressRung(block, playerCount)?.intent ?? null
}

/**
 * Resolve the guarded live-cue override for a block — the rung's authored
 * `externalFocusCue`, returned ONLY when it should substitute for the
 * drill's own `coachingCues[0]` on the live "Now" surface (M002.2
 * rung-aware live cue, plan
 * `docs/plans/2026-06-30-001-feat-m002-2-rung-aware-live-cue-plan.md` U3).
 *
 * On top of the shared `resolveBlockStressRung` core this folds in
 * presence and the guard:
 *   - off-ladder (any core `null`) → `null`
 *   - the drill's own cue is guard-protected (`isLiveCueGuardProtected`,
 *     e.g. d07's gaze cue) → `null`, so that cue stays live
 *   - the rung carries no `externalFocusCue` (empty / whitespace) → `null`
 *   - otherwise → the rung's `externalFocusCue`
 *
 * This helper does NOT enforce the live-cue budget or the fallback
 * chain — those stay single-sourced in `selectNonSegmentedCurrentCue`,
 * which the override feeds as a preferred cue. The origin's "never
 * grows a Now slot" invariant is gated at the call site (`RunScreen`),
 * not here: this stays a pure presence+guard resolver.
 */
export function resolveBlockLiveCueOverride(
  block: SessionPlanBlock | null | undefined,
  playerCount: 1 | 2,
): string | null {
  if (block?.drillId && isLiveCueGuardProtected(block.drillId)) return null
  const cue = resolveBlockStressRung(block, playerCount)?.externalFocusCue.trim()
  return cue && cue.length > 0 ? cue : null
}

/**
 * Resolve the authored stress-rung `reflection` for a just-finished
 * block — the backward-looking "what that rep was doing to you" line
 * revealed on Drill Check behind the pull affordance (M002.2 coaching
 * arc After beat, D177, plan
 * `docs/plans/2026-07-04-001-feat-m002-2-drill-check-reflection-plan.md`).
 *
 * On top of the shared `resolveBlockStressRung` core this adds only
 * presence (absent / whitespace reflection → `null`) — no guard and no
 * budget: the reflection substitutes for nothing and renders only
 * behind the athlete's own pull. Surface coverage is bounded by where
 * Drill Check mounts (the capture-eligibility bypass set — warmup/wrap,
 * non-count support slots, missing catalog ids), an accepted edge owned
 * by the origin's R4.
 */
export function resolveBlockRungReflection(
  block: SessionPlanBlock | null | undefined,
  playerCount: 1 | 2,
): string | null {
  const reflection = resolveBlockStressRung(block, playerCount)?.reflection.trim()
  return reflection && reflection.length > 0 ? reflection : null
}

/**
 * Resolve the rung `intent` for the block at `index` ONLY when that block
 * opens its focus run — the "what this rung trains" line shows once when a
 * focus first appears in the session, then recedes for the rest of that
 * focus run (run-flow beat contract Stage 1, R6; spec
 * `docs/specs/run-flow-beat-contract.md`).
 *
 * A focus block "opens" at `index` when it has a surfaced skill focus
 * (`getBlockSkillFocus` is non-null) AND no EARLIER block in the session
 * already surfaced that same focus. The prefix scan (rather than a compare
 * against only the immediately-previous block) is deliberate: sessions are
 * single-skill-chain by intent (D141), but a focus-controlled support slot
 * can still resolve to a different primary focus than its neighbors — a
 * `['pass','set']` drill (d20 / d21) landing in a set session's technique
 * or movement slot, or a `['pass','serve']` drill (d08 / d18) in a serve
 * session, makes the focus sequence read e.g. `set → pass → set`. A
 * previous-block-only compare would then RE-OPEN the session's primary
 * focus on the block after that support slot; first-appearance keying
 * shows each focus's intent exactly once. Warmup / wrap (null focus) never
 * open a run. Off-ladder openers resolve to `null` via
 * `resolveBlockRungIntent`, so they surface nothing rather than an empty
 * line (an accepted Stage-1 edge for the rare on-ladder-successor case).
 *
 * Pure (no React, no Dexie) and null-safe: out-of-range indices, null
 * blocks, and an absent block list all return `null` without throwing.
 */
export function resolveBlockOpeningIntent(
  blocks: readonly (SessionPlanBlock | null | undefined)[] | null | undefined,
  index: number,
  playerCount: 1 | 2,
): string | null {
  const block = blocks?.[index]
  if (!block) return null
  const focus = getBlockSkillFocus(block, playerCount)
  if (!focus) return null
  for (let i = 0; i < index; i += 1) {
    if (getBlockSkillFocus(blocks?.[i], playerCount) === focus) return null
  }
  return resolveBlockRungIntent(block, playerCount)
}
