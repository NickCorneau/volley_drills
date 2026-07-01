import { CUE_COMPACT_MAX } from '../domain/policies'
import { CUE_SEPARATOR } from '../lib/format'
import type { Drill, DrillVariant, ProgressionChain } from '../types/drill'
import type { StressLadderFocus, StressRung } from './stressLadders'

export type DrillCatalogIssueCode =
  | 'duplicate_drill_id'
  | 'duplicate_variant_id'
  | 'variant_drill_id_mismatch'
  | 'invalid_duration_range'
  | 'invalid_rpe_range'
  | 'invalid_sub_block'
  | 'unknown_chain_drill'
  | 'chain_id_mismatch'
  | 'unknown_progression_source'
  | 'unknown_progression_target'
  | 'link_outside_chain'
  | 'm001_candidate_without_variant'
  | 'participants_label_mismatch'
  | 'duplicate_segment_id'
  | 'invalid_segment_duration'
  | 'segment_duration_mismatch'
  | 'drill_chain_membership_missing'
  | 'ladder_unknown_drill'
  | 'ladder_duplicate_drill'
  | 'scoped_drill_off_ladder'
  | 'rung_content_missing'

export interface DrillCatalogIssue {
  code: DrillCatalogIssueCode
  path: string
  message: string
}

const SCOPED_FOCUSES: readonly StressLadderFocus[] = ['pass', 'serve', 'set']

interface ValidateDrillCatalogInput {
  drills: readonly Drill[]
  progressionChains: readonly ProgressionChain[]
  /**
   * Per-focus stress ladders (D160). When provided, the ladder↔catalog
   * cross-checks run: every ladder entry must name a known drill, no
   * drill twice on one ladder, and every scoped-tag drill must hold a
   * rung on each of its focus ladders (the D160 authoring invariant).
   */
  stressLadders?: Record<StressLadderFocus, readonly StressRung[]>
}

function issue(code: DrillCatalogIssueCode, path: string, message: string): DrillCatalogIssue {
  return { code, path, message }
}

function hasM001EligibleVariant(variants: readonly DrillVariant[]): boolean {
  return variants.some(
    (variant) => variant.participants.min <= 2 && !variant.environmentFlags.needsWall,
  )
}

export function validateDrillCatalog({
  drills,
  progressionChains,
  stressLadders,
}: ValidateDrillCatalogInput): DrillCatalogIssue[] {
  const issues: DrillCatalogIssue[] = []
  const drillIds = new Set<string>()
  const duplicateDrillIds = new Set<string>()
  const variantIds = new Set<string>()
  const duplicateVariantIds = new Set<string>()

  for (const drill of drills) {
    if (drillIds.has(drill.id) && !duplicateDrillIds.has(drill.id)) {
      issues.push(
        issue('duplicate_drill_id', `drills.${drill.id}`, `Duplicate drill id ${drill.id}`),
      )
      duplicateDrillIds.add(drill.id)
    }
    drillIds.add(drill.id)

    if (drill.m001Candidate && !hasM001EligibleVariant(drill.variants)) {
      issues.push(
        issue(
          'm001_candidate_without_variant',
          `drills.${drill.id}`,
          `${drill.id} is marked M001 but has no one-or-two-player eligible variant`,
        ),
      )
    }

    for (const variant of drill.variants) {
      if (variantIds.has(variant.id) && !duplicateVariantIds.has(variant.id)) {
        issues.push(
          issue(
            'duplicate_variant_id',
            `variants.${variant.id}`,
            `Duplicate variant id ${variant.id}`,
          ),
        )
        duplicateVariantIds.add(variant.id)
      }
      variantIds.add(variant.id)

      if (variant.drillId !== drill.id) {
        issues.push(
          issue(
            'variant_drill_id_mismatch',
            `drills.${drill.id}.variants.${variant.id}`,
            `${variant.id} declares drillId ${variant.drillId} but belongs to ${drill.id}`,
          ),
        )
      }

      if (
        !Number.isFinite(variant.workload.durationMinMinutes) ||
        !Number.isFinite(variant.workload.durationMaxMinutes) ||
        variant.workload.durationMinMinutes <= 0 ||
        variant.workload.durationMaxMinutes < variant.workload.durationMinMinutes
      ) {
        issues.push(
          issue(
            'invalid_duration_range',
            `drills.${drill.id}.variants.${variant.id}.workload`,
            `${variant.id} has an invalid duration range`,
          ),
        )
      }

      if (
        !Number.isFinite(variant.workload.rpeMin) ||
        !Number.isFinite(variant.workload.rpeMax) ||
        variant.workload.rpeMin < 0 ||
        variant.workload.rpeMax > 10 ||
        variant.workload.rpeMax < variant.workload.rpeMin
      ) {
        issues.push(
          issue(
            'invalid_rpe_range',
            `drills.${drill.id}.variants.${variant.id}.workload`,
            `${variant.id} has an invalid RPE range`,
          ),
        )
      }

      if (
        variant.subBlockIntervalSeconds !== undefined &&
        (!Number.isInteger(variant.subBlockIntervalSeconds) || variant.subBlockIntervalSeconds <= 0)
      ) {
        issues.push(
          issue(
            'invalid_sub_block',
            `drills.${drill.id}.variants.${variant.id}.subBlockIntervalSeconds`,
            `${variant.id} has an invalid sub-block interval`,
          ),
        )
      }

      /*
       * 2026-04-28 (`docs/plans/2026-04-28-per-move-pacing-indicator.md` U2):
       * structured pacing segments must declare positive integer
       * durations, unique IDs within the variant, and sum exactly to
       * `workload.durationMinMinutes * 60`. The min boundary is the
       * segment-list's natural length; overflow up to durationMaxMinutes
       * is bonus territory matched by the existing
       * progressionDescription voice (e.g., d26 mirror / glutes /
       * adductors). Mirrors the `invalid_sub_block` shape above.
       */
      if (variant.segments !== undefined) {
        const segmentIds = new Set<string>()
        const reportedDuplicateIds = new Set<string>()
        let totalSegmentSeconds = 0

        for (let segIndex = 0; segIndex < variant.segments.length; segIndex++) {
          const segment = variant.segments[segIndex]

          if (segmentIds.has(segment.id) && !reportedDuplicateIds.has(segment.id)) {
            issues.push(
              issue(
                'duplicate_segment_id',
                `drills.${drill.id}.variants.${variant.id}.segments[${segIndex}].id`,
                `${variant.id} segment id ${segment.id} is duplicated within the variant`,
              ),
            )
            reportedDuplicateIds.add(segment.id)
          }
          segmentIds.add(segment.id)

          if (!Number.isInteger(segment.durationSec) || segment.durationSec <= 0) {
            issues.push(
              issue(
                'invalid_segment_duration',
                `drills.${drill.id}.variants.${variant.id}.segments[${segIndex}].durationSec`,
                `${variant.id} segment ${segment.id} has an invalid duration (${segment.durationSec})`,
              ),
            )
          } else {
            totalSegmentSeconds += segment.durationSec
          }
        }

        const expectedSeconds = variant.workload.durationMinMinutes * 60
        if (
          Number.isFinite(expectedSeconds) &&
          expectedSeconds > 0 &&
          totalSegmentSeconds !== expectedSeconds
        ) {
          issues.push(
            issue(
              'segment_duration_mismatch',
              `drills.${drill.id}.variants.${variant.id}.segments`,
              `${variant.id} segment durations sum to ${totalSegmentSeconds}s but workload.durationMinMinutes implies ${expectedSeconds}s`,
            ),
          )
        }
      }

      // 2026-04-27 solo-vs-pair sweep: participants envelope must
      // match the variant label so the session builder can route by
      // playerCount without solo voice leaking into pair sessions
      // (and vice versa). Symmetric rule: Solo => max=1, Pair => min=2.
      const labelLower = variant.label.toLowerCase()
      if (labelLower.startsWith('solo') && variant.participants.max !== 1) {
        issues.push(
          issue(
            'participants_label_mismatch',
            `drills.${drill.id}.variants.${variant.id}.participants`,
            `${variant.id} is labelled Solo but participants.max is ${variant.participants.max} (expected 1)`,
          ),
        )
      }
      if (labelLower.startsWith('pair') && variant.participants.min !== 2) {
        issues.push(
          issue(
            'participants_label_mismatch',
            `drills.${drill.id}.variants.${variant.id}.participants`,
            `${variant.id} is labelled Pair but participants.min is ${variant.participants.min} (expected 2)`,
          ),
        )
      }
    }
  }

  const drillById = new Map(drills.map((drill) => [drill.id, drill]))

  for (const chain of progressionChains) {
    const chainDrillIds = new Set(chain.drillIds)

    for (const drillId of chain.drillIds) {
      const drill = drillById.get(drillId)
      if (!drill) {
        issues.push(
          issue(
            'unknown_chain_drill',
            `progressionChains.${chain.id}.drillIds.${drillId}`,
            `${chain.id} references unknown drill ${drillId}`,
          ),
        )
        continue
      }

      if (drill.chainId !== chain.id) {
        issues.push(
          issue(
            'chain_id_mismatch',
            `drills.${drill.id}.chainId`,
            `${drill.id} declares ${drill.chainId} but appears in ${chain.id}`,
          ),
        )
      }
    }

    for (const link of chain.links) {
      if (!drillIds.has(link.fromDrillId)) {
        issues.push(
          issue(
            'unknown_progression_source',
            `progressionChains.${chain.id}.links.${link.fromDrillId}`,
            `${chain.id} link references unknown source ${link.fromDrillId}`,
          ),
        )
      }

      if (!drillIds.has(link.toDrillId)) {
        issues.push(
          issue(
            'unknown_progression_target',
            `progressionChains.${chain.id}.links.${link.toDrillId}`,
            `${chain.id} link references unknown target ${link.toDrillId}`,
          ),
        )
      }

      if (!chainDrillIds.has(link.fromDrillId) || !chainDrillIds.has(link.toDrillId)) {
        issues.push(
          issue(
            'link_outside_chain',
            `progressionChains.${chain.id}.links`,
            `${chain.id} link ${link.fromDrillId} -> ${link.toDrillId} is outside chain drillIds`,
          ),
        )
      }
    }
  }

  // Bidirectional chain membership (D160): a drill whose chainId names
  // an existing chain object must appear in that chain's drillIds (the
  // d24/chain-2 drift class). Declared chain ids with no chain object
  // (e.g. d28's chain-warmup) stay legal as authoring groups.
  const chainById = new Map(progressionChains.map((chain) => [chain.id, chain]))
  for (const drill of drills) {
    const declaredChain = chainById.get(drill.chainId)
    if (declaredChain && !declaredChain.drillIds.includes(drill.id)) {
      issues.push(
        issue(
          'drill_chain_membership_missing',
          `drills.${drill.id}.chainId`,
          `${drill.id} declares ${drill.chainId} but is missing from that chain's drillIds`,
        ),
      )
    }
  }

  if (stressLadders) {
    for (const focus of SCOPED_FOCUSES) {
      const seenOnLadder = new Set<string>()
      for (const rung of stressLadders[focus]) {
        for (const drillId of rung.drillIds) {
          if (!drillIds.has(drillId)) {
            issues.push(
              issue(
                'ladder_unknown_drill',
                `stressLadders.${focus}.${rung.rung}.${drillId}`,
                `${focus} ladder rung ${rung.rung} references unknown drill ${drillId}`,
              ),
            )
          }
          if (seenOnLadder.has(drillId)) {
            issues.push(
              issue(
                'ladder_duplicate_drill',
                `stressLadders.${focus}.${rung.rung}.${drillId}`,
                `${drillId} appears more than once on the ${focus} ladder`,
              ),
            )
          }
          seenOnLadder.add(drillId)
        }
      }

      for (const drill of drills) {
        if (drill.skillFocus.includes(focus) && !seenOnLadder.has(drill.id)) {
          issues.push(
            issue(
              'scoped_drill_off_ladder',
              `drills.${drill.id}.skillFocus.${focus}`,
              `${drill.id} carries the ${focus} tag but holds no rung on the ${focus} ladder (D160: scoped-tag drills ship with a same-commit rung)`,
            ),
          )
        }
      }

      // M002.2: every rung ships authored progression content. A rung
      // missing any of intent / external-focus cue / exploration
      // criterion / graduation feel is a hard authoring failure (the
      // rung-content invariant in docs/specs/stress-rung-taxonomy.md).
      for (const rung of stressLadders[focus]) {
        const missing = (
          [
            ['intent', rung.intent],
            ['externalFocusCue', rung.externalFocusCue],
            ['explorationCriterion', rung.explorationCriterion],
            ['graduationFeel', rung.graduationFeel],
          ] as const
        ).filter(([, value]) => value.trim().length === 0)
        for (const [field] of missing) {
          issues.push(
            issue(
              'rung_content_missing',
              `stressLadders.${focus}.${rung.rung}.${field}`,
              `${focus} rung ${rung.rung} is missing ${field} (M002.2: every rung ships intent + external-focus cue + exploration criterion + graduation feel)`,
            ),
          )
        }
      }
    }
  }

  return issues
}

/**
 * Default depth target (KTD6): a rung wants at least this many
 * assembly-eligible (`m001Candidate: true`) drills so stepping onto it
 * picks genuinely different work. Advisory, not a hard gate — legitimate
 * thin rungs (7 under target today: pass 1, serve 1/2/3, set 2/3/4) have
 * no source-backed sibling yet and must not fail CI. See the depth-target
 * and roster-depth-backlog sections of docs/specs/stress-rung-taxonomy.md.
 */
export const RUNG_DEPTH_TARGET = 2

export interface RungDepthAdvisory {
  focus: StressLadderFocus
  rung: number
  /** Count of `m001Candidate: true` drills placed on this rung. */
  eligibleCount: number
  target: number
  message: string
}

/**
 * Surface rungs below the depth target. Separate from
 * `validateDrillCatalog` on purpose: this is an advisory the catalog can
 * carry while thin rungs await source-backed content, not a hard failure
 * the `toEqual([])` catalog gate would trip on.
 */
export function auditRungDepth({
  drills,
  stressLadders,
  target = RUNG_DEPTH_TARGET,
}: {
  drills: readonly Drill[]
  stressLadders: Record<StressLadderFocus, readonly StressRung[]>
  target?: number
}): RungDepthAdvisory[] {
  const candidateById = new Map(drills.map((drill) => [drill.id, drill.m001Candidate]))
  const advisories: RungDepthAdvisory[] = []
  for (const focus of SCOPED_FOCUSES) {
    for (const rung of stressLadders[focus]) {
      const eligibleCount = rung.drillIds.filter((id) => candidateById.get(id) === true).length
      if (eligibleCount < target) {
        advisories.push({
          focus,
          rung: rung.rung,
          eligibleCount,
          target,
          message: `${focus} rung ${rung.rung} has ${eligibleCount} assembly-eligible drill(s); depth target is ${target}`,
        })
      }
    }
  }
  return advisories
}

/**
 * Body-part / internal-focus tokens that disqualify an external-focus
 * cue (Wulf; courtside-copy rule 12b). Mirrors the same list the
 * `stressLadders.test.ts` body-part lint pins; kept here so the shipping
 * advisory (not just a test) can flag an unfit rung cue before the
 * trunk promotes it to the sole live slot. A cue must name an outcome
 * or environmental referent (ball flight, target, landing, partner
 * reach), never a body part or internal sensation.
 */
export const LIVE_CUE_INTERNAL_FOCUS_TOKENS: readonly string[] = [
  'platform',
  'knee',
  'elbow',
  'wrist',
  'shoulder',
  'forearm',
  'hips',
  'whole body',
]

export type LiveCueFitnessReason = 'over-budget' | 'multi-clause' | 'internal-focus'

export interface LiveCueFitnessAdvisory {
  /** The live-eligible surface the flagged cue came from. */
  source: 'rung-external-focus-cue' | 'ladder-coaching-cue'
  /** Why the cue is unfit for the sole live slot. */
  reason: LiveCueFitnessReason
  /** The offending text (first clause for length; full string for phrasing/shape). */
  cue: string
  /** Locator, e.g. `stressLadders.pass.2.externalFocusCue` or `drills.d07.variants.d07-pair.coachingCues[0]`. */
  path: string
  message: string
}

/**
 * The clauses the live "Now" selector would split a cue into:
 * `selectNonSegmentedCurrentCue` splits on `CUE_SEPARATOR` and leads
 * with the first clause. Mirrored here (not imported from
 * `screens/run/currentCue.ts`) so the data-layer floor never reaches up
 * into a screen; the selector's own tests pin the rendering contract.
 */
function liveCueClauses(cue: string): string[] {
  return cue
    .split(CUE_SEPARATOR)
    .map((part) => part.trim())
    .filter((part) => part.length > 0)
}

function liveCueFirstClause(cue: string): string {
  return liveCueClauses(cue)[0] ?? ''
}

function namesInternalFocus(cue: string): boolean {
  const lowered = cue.toLowerCase()
  return LIVE_CUE_INTERNAL_FOCUS_TOKENS.some((token) => lowered.includes(token))
}

/**
 * Floor for the rung-aware live cue (M002.2, plan
 * `docs/plans/2026-06-30-001-feat-m002-2-rung-aware-live-cue-plan.md`
 * U1): flag every live-eligible cue that would not survive the "Now"
 * slot — a rung `externalFocusCue` (or a ladder-bearing drill's
 * `coachingCues[0]` live fallback) whose first clause exceeds the
 * live-cue budget, or a rung `externalFocusCue` that names a body part
 * / internal focus.
 *
 * Separate from `validateDrillCatalog` on purpose (mirrors
 * `auditRungDepth`): this is an advisory the catalog carries and the
 * suite pins, never a hard failure the `toEqual([])` gate trips on. It
 * runs BEFORE the trunk (R8) so an unfit cue is rewritten before it can
 * be promoted to the single live cue.
 *
 * Scope split (deliberate):
 *   - `externalFocusCue` lane: length, single-clause shape, AND
 *     external-focus phrasing. The single-clause check (rule 12a: one
 *     cue at arm's length) matters because the live selector renders
 *     only the first clause while the "Drill details" overlay's
 *     `overrideWon` guard compares against the full string — a
 *     multi-clause rung cue would silently reintroduce the R9 overlay
 *     torn read (KTD5), so the floor rejects it at authoring time.
 *   - `coachingCues[0]` lane: length ONLY. The position-aware
 *     `evaluateCue0` detector (`drillCopyRegressions.test.ts`) already
 *     owns `coachingCues[0]` phrasing and correctly passes an
 *     object-position body-part mention (e.g. d07's rule-12c gaze cue,
 *     "…your platform meets the ball"). Re-running a naive substring
 *     check here would false-flag the exact cue the live-cue guard
 *     exists to keep live, so the floor does not.
 */
export function auditLiveCueFitness({
  drills,
  stressLadders,
  max = CUE_COMPACT_MAX,
}: {
  drills: readonly Drill[]
  stressLadders: Record<StressLadderFocus, readonly StressRung[]>
  max?: number
}): LiveCueFitnessAdvisory[] {
  const advisories: LiveCueFitnessAdvisory[] = []

  // Lane 1: every rung externalFocusCue — length + single-clause shape + external-focus phrasing.
  for (const focus of SCOPED_FOCUSES) {
    for (const rung of stressLadders[focus]) {
      const cue = rung.externalFocusCue
      const clauses = liveCueClauses(cue)
      const firstClause = clauses[0] ?? ''
      if (firstClause.length > max) {
        advisories.push({
          source: 'rung-external-focus-cue',
          reason: 'over-budget',
          cue: firstClause,
          path: `stressLadders.${focus}.${rung.rung}.externalFocusCue`,
          message: `${focus} rung ${rung.rung} externalFocusCue first clause is ${firstClause.length} chars; the live-cue budget is ${max}`,
        })
      }
      if (clauses.length > 1) {
        advisories.push({
          source: 'rung-external-focus-cue',
          reason: 'multi-clause',
          cue,
          path: `stressLadders.${focus}.${rung.rung}.externalFocusCue`,
          message: `${focus} rung ${rung.rung} externalFocusCue has ${clauses.length} clauses; a live cue must be one glanceable clause (rule 12a). The selector renders only the first clause, so a multi-clause cue reintroduces the R9 overlay torn read`,
        })
      }
      if (namesInternalFocus(cue)) {
        advisories.push({
          source: 'rung-external-focus-cue',
          reason: 'internal-focus',
          cue,
          path: `stressLadders.${focus}.${rung.rung}.externalFocusCue`,
          message: `${focus} rung ${rung.rung} externalFocusCue names a body part / internal focus (Wulf / rule 12b); name an outcome or referent instead`,
        })
      }
    }
  }

  // Lane 2: ladder-bearing drills' coachingCues[0] live fallback — length only.
  const ladderDrillIds = new Set<string>()
  for (const focus of SCOPED_FOCUSES) {
    for (const rung of stressLadders[focus]) {
      for (const id of rung.drillIds) ladderDrillIds.add(id)
    }
  }
  for (const drill of drills) {
    if (!ladderDrillIds.has(drill.id)) continue
    for (const variant of drill.variants) {
      const cue0 = variant.coachingCues[0]
      if (!cue0) continue
      const firstClause = liveCueFirstClause(cue0)
      if (firstClause.length > max) {
        advisories.push({
          source: 'ladder-coaching-cue',
          reason: 'over-budget',
          cue: firstClause,
          path: `drills.${drill.id}.variants.${variant.id}.coachingCues[0]`,
          message: `${variant.id} coachingCues[0] first clause is ${firstClause.length} chars; the live-cue fallback budget is ${max}`,
        })
      }
    }
  }

  return advisories
}
