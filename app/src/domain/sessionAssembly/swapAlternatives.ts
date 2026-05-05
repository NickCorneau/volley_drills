import { PROGRESSION_CHAINS } from '../../data/progressions'
import { SUBSTITUTION_RULES } from '../../data/substitutionRules'
import type {
  BlockSlot,
  BlockSlotType,
  PlayerLevel,
  SessionPlanBlock,
  SetupContext,
  SkillFocus,
} from '../../model'
import { findPreferredCandidate, findSubstitute } from '../drillSelection'
import { findCandidates } from './candidates'
import { FOCUS_CONTROLLED_SLOT_TYPES } from './effectiveFocus'
import { partitionByLevel } from './partitionByLevel'
import { deriveBlockRationale, deriveSubstitutionRationale } from './rationale'

const SKILL_TAGS_BY_TYPE: Record<BlockSlotType, readonly SkillFocus[]> = {
  warmup: ['pass', 'movement'],
  technique: ['pass'],
  movement_proxy: ['pass', 'movement'],
  main_skill: ['pass', 'serve', 'set'],
  pressure: ['pass', 'serve', 'set'],
  wrap: ['recovery'],
}

export type FindSwapAlternativesOptions = {
  readonly excludeDrillNames?: readonly string[]
  /**
   * Effective skill level for the active session. When provided, the
   * swap alternatives are sorted `[in-band-first, out-of-band-after]`
   * so the user's saved level shapes the visible order. When omitted
   * (e.g., legacy test fixtures), no level-based reordering is
   * applied. Per K5 of the
   * `2026-05-04-001-feat-skill-level-mutability-plan.md`, swap is
   * user-driven so this is sort-only — all alternatives stay visible.
   * The build-time `levelRelaxed` flag does NOT fire from this path.
   */
  readonly effectiveLevelValue?: PlayerLevel
}

function findPreferredProgressionTarget(drillId: string): string | undefined {
  for (const chain of PROGRESSION_CHAINS) {
    const link = chain.links.find(
      (candidate) => candidate.direction === 'progression' && candidate.fromDrillId === drillId,
    )
    if (link) return link.toDrillId
  }
  return undefined
}

export function findSwapAlternatives(
  block: SessionPlanBlock,
  context: SetupContext,
  options?: FindSwapAlternativesOptions,
): SessionPlanBlock[] {
  if (block.type === 'warmup' || block.type === 'wrap') return []

  const focused = computeAlternatives(block, context, options)
  if (focused.length > 0) return focused

  // 2026-04-30 focus fallback: when an explicit `sessionFocus`
  // narrowed the pool to empty for a focus-controlled slot, retry
  // with the focus stripped so mid-run Swap stays usable. Without
  // this, picking 'Setting' on Tune today would silently disable
  // Swap on `main_skill` / `pressure` blocks whenever the catalog
  // happens to have only one set drill in the current context. We
  // accept the small intent-violation (a passing alternate during
  // a "set session") because no-swap is a worse mid-run outcome and
  // the user can still see today's focus on the rest of the plan.
  const isFocusControlled = FOCUS_CONTROLLED_SLOT_TYPES.has(block.type)
  if (isFocusControlled && context.sessionFocus !== undefined) {
    const widenedContext: SetupContext = { ...context }
    delete widenedContext.sessionFocus
    return computeAlternatives(block, widenedContext, options)
  }

  return focused
}

function computeAlternatives(
  block: SessionPlanBlock,
  context: SetupContext,
  options: FindSwapAlternativesOptions | undefined,
): SessionPlanBlock[] {
  const slot: BlockSlot = {
    type: block.type,
    durationMinMinutes: block.durationMinutes,
    durationMaxMinutes: block.durationMinutes,
    intent: '',
    required: block.required,
    skillTags: SKILL_TAGS_BY_TYPE[block.type],
  }
  const candidates = findCandidates(slot, context).sort((a, b) =>
    a.drill.id.localeCompare(b.drill.id),
  )

  const currentIndex = candidates.findIndex(
    (candidate) => candidate.drill.id === block.drillId || candidate.drill.name === block.drillName,
  )
  const baseFiltered =
    currentIndex >= 0
      ? [...candidates.slice(currentIndex + 1), ...candidates.slice(0, currentIndex)].filter(
          (candidate) => candidate.drill.name !== block.drillName,
        )
      : candidates.filter((candidate) => candidate.drill.name !== block.drillName)

  const extraExcludes = new Set(
    options?.excludeDrillNames?.filter((name) => name !== block.drillName) ?? [],
  )
  let filtered = baseFiltered
  if (extraExcludes.size > 0) {
    const neighborFiltered = baseFiltered.filter(
      (candidate) => !extraExcludes.has(candidate.drill.name),
    )
    if (neighborFiltered.length > 0) {
      filtered = neighborFiltered
    }
  }

  const rationaleByDrillId = new Map<string, string>()
  if (block.drillId) {
    const preferredToDrillId = findPreferredProgressionTarget(block.drillId)
    const preferred = preferredToDrillId
      ? findPreferredCandidate(preferredToDrillId, filtered)
      : undefined
    if (preferred) {
      filtered = [preferred, ...filtered.filter((candidate) => candidate !== preferred)]
    } else {
      const substitute = findSubstitute(block.drillId, filtered, context, SUBSTITUTION_RULES)
      if (substitute) {
        filtered = [
          substitute.candidate,
          ...filtered.filter((candidate) => candidate !== substitute.candidate),
        ]
        rationaleByDrillId.set(
          substitute.candidate.drill.id,
          deriveSubstitutionRationale(substitute.rule),
        )
      }
    }
  }

  // K5: apply level partition LAST (after preferred-progression and
  // substitute promotion). Promotion wins ties; level breaks order
  // among unrelated drills. Only sorts when an effectiveLevelValue
  // was provided so legacy callers and test fixtures see no
  // ordering change.
  //
  // Critical: the promoted target (preferred-progression next or
  // blocked-progression substitute) must stay at index 0 even when
  // it falls in the out-of-band partition, otherwise level sorting
  // would bury the user's natural next progression behind every
  // in-band alternative. Capture the promoted candidate before
  // partitioning, partition the rest, prepend the promoted candidate.
  if (options?.effectiveLevelValue !== undefined && filtered.length > 0) {
    const promotedIds = new Set(rationaleByDrillId.keys())
    // The preferred-progression-target promotion (above) does not
    // populate `rationaleByDrillId`; check the head element for that
    // case by detecting whether `findPreferredProgressionTarget`
    // landed at index 0.
    const head = filtered[0]
    const isPromotedHead =
      promotedIds.has(head.drill.id) ||
      (block.drillId !== undefined &&
        findPreferredProgressionTarget(block.drillId) === head.drill.id)
    const promoted = isPromotedHead ? head : undefined
    const tail = isPromotedHead ? filtered.slice(1) : filtered
    const { inBand, outOfBand } = partitionByLevel(tail, options.effectiveLevelValue)
    filtered = promoted ? [promoted, ...inBand, ...outOfBand] : [...inBand, ...outOfBand]
  }

  return filtered.map((candidate) => ({
    id: block.id,
    type: block.type,
    drillId: candidate.drill.id,
    variantId: candidate.variant.id,
    drillName: candidate.drill.name,
    shortName: candidate.drill.shortName,
    durationMinutes: block.durationMinutes,
    coachingCue:
      candidate.variant.coachingCues.length > 0
        ? candidate.variant.coachingCues.join(' · ')
        : candidate.drill.name,
    courtsideInstructions: candidate.variant.courtsideInstructions,
    courtsideInstructionsBonus: candidate.variant.courtsideInstructionsBonus,
    required: block.required,
    rationale:
      rationaleByDrillId.get(candidate.drill.id) ??
      deriveBlockRationale(block.type, candidate.drill, context),
    subBlockIntervalSeconds: candidate.variant.subBlockIntervalSeconds,
    segments: candidate.variant.segments,
  }))
}
