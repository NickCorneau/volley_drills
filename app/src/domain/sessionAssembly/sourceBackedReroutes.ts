import type { BlockSlot, BlockSlotType, PlayerLevel, SetupContext, SkillFocus } from '../../model'
import { candidateCanCarryTargetDuration, type CandidateVariant } from './candidates'

/**
 * One declarative entry in the source-backed reroute registry. Each entry
 * names a trigger condition under which the redistribution branch in
 * `buildDraftResult` should re-pick the main-skill slot using
 * `preferTargetDurationFit: true` so a longer-envelope sibling drill can
 * absorb the planned duration.
 *
 * Field semantics:
 * - `id`: stable identifier used in tests and diagnostics. Format
 *   `<from>-to-<to>` for source-backed activations (e.g. `d47-d48-to-d49`)
 *   or `<from>-duration-fit` for the default-leaf D01 case.
 * - `description`: short human-readable rationale; carried forward from
 *   the original predicate's JSDoc so the source-backed pattern's intent
 *   does not drop on the floor.
 * - `fromDrillIds`: drills that, when selected for a main-skill slot,
 *   trigger the reroute when they cannot carry the planned duration.
 * - `destinationDrillIds`: metadata only — names the source-backed
 *   sibling(s) the reroute is expected to land on. Runtime does NOT
 *   target these drills explicitly; `pickForSlot(..., preferTargetDurationFit:
 *   true)` chooses from the candidate pool. Empty for D01 (no specific
 *   sibling — pickForSlot just re-picks any duration-fitting drill).
 * - `sessionFocus` / `playerLevel`: optional gates. Both undefined means
 *   the entry fires for any focus/level (D01 case). When set, both must
 *   match the current `SetupContext`.
 * - `slotType`: defaults to `'main_skill'` because every current trigger
 *   only fires from the main-skill redistribution branch. Field exists
 *   so a future non-main-skill entry is one-line additive.
 *
 * See `docs/solutions/2026-05-04-source-backed-content-depth-activation-pattern.md`
 * for the workflow this registry codifies.
 */
interface SourceBackedReroute {
  readonly id: string
  readonly description: string
  readonly fromDrillIds: ReadonlySet<string>
  readonly destinationDrillIds: readonly string[]
  readonly sessionFocus?: Extract<SkillFocus, 'pass' | 'serve' | 'set'>
  readonly playerLevel?: PlayerLevel
  readonly slotType?: BlockSlotType
}

/**
 * Source-backed reroute registry.
 *
 * Each entry replaces a previously-inline `shouldPrefer*DurationFit`
 * predicate (or the inline D01 over-cap check) in `sessionBuilder.ts`.
 * Adding a fifth source-backed activation is one entry below; no
 * `sessionBuilder.ts` change is required.
 */
export const SOURCE_BACKED_REROUTES: readonly SourceBackedReroute[] = [
  {
    id: 'd01-duration-fit',
    description:
      'D01 is the default-leaf passing drill; its workload envelope cannot honestly carry redistributed long allocations. When D01 is selected for a main-skill slot it cannot carry, prefer any duration-fitting sibling.',
    fromDrillIds: new Set(['d01']),
    destinationDrillIds: [],
  },
  {
    id: 'd47-d48-to-d49',
    description:
      'Advanced setting main-skill blocks above D47/D48 envelope used to silently over-stretch those drills. D49 (Set and Recover, FIVB 4.7 inspiration) is the source-backed long-envelope sibling; this entry triggers the reroute when D47 or D48 was selected for an advanced setting block it cannot carry.',
    fromDrillIds: new Set(['d47', 'd48']),
    destinationDrillIds: ['d49'],
    sessionFocus: 'set',
    playerLevel: 'advanced',
  },
  {
    id: 'd46-to-d50',
    description:
      "Advanced pair-open / solo-open passing main-skill blocks above D46's 8-minute envelope used to silently over-stretch D46 (FIVB 3.16 spin-read receive). D50 (FIVB 3.13 Short/Deep, 8-14 min envelope) is the source-backed long-envelope sibling.",
    fromDrillIds: new Set(['d46']),
    destinationDrillIds: ['d50'],
    sessionFocus: 'pass',
    playerLevel: 'advanced',
  },
  {
    id: 'd31-to-d51',
    description:
      "Beginner serving main-skill blocks above D31's 8-minute envelope used to silently over-stretch D31 (BAB Self-Toss Target Practice). D51 (FIVB 2.2 Outside the Heart, 8-14 min envelope) is the source-backed long-envelope sibling — third application of the source-backed content-depth activation pattern, first at the beginner level.",
    fromDrillIds: new Set(['d31']),
    destinationDrillIds: ['d51'],
    sessionFocus: 'serve',
    playerLevel: 'beginner',
  },
]

/**
 * Returns true when the given main-skill slot selection should be
 * rerouted to a longer-envelope sibling because the selected variant
 * cannot carry the planned duration.
 *
 * Defensive: returns false immediately for non-main-skill slots and
 * when the selected candidate already carries the planned duration,
 * so the registry-driven check is byte-equivalent to the four
 * helpers it replaced (`shouldPreferAdvancedSettingDurationFit`,
 * `shouldPreferAdvancedPassingDurationFit`,
 * `shouldPreferBeginnerServingDurationFit`, plus the inline D01 check).
 */
export function shouldRerouteForSourceBackedSibling(
  slot: BlockSlot,
  context: SetupContext,
  selected: CandidateVariant,
  plannedDurationMinutes: number,
): boolean {
  if (candidateCanCarryTargetDuration(selected, plannedDurationMinutes)) return false

  return SOURCE_BACKED_REROUTES.some((entry) => {
    const entrySlotType = entry.slotType ?? 'main_skill'
    if (slot.type !== entrySlotType) return false
    if (entry.sessionFocus !== undefined && context.sessionFocus !== entry.sessionFocus) return false
    if (entry.playerLevel !== undefined && context.playerLevel !== entry.playerLevel) return false
    return entry.fromDrillIds.has(selected.drill.id)
  })
}
