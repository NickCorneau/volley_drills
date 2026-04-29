import type { Drill, DrillVariant, ProgressionChain } from '../types/drill'

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

export interface DrillCatalogIssue {
  code: DrillCatalogIssueCode
  path: string
  message: string
}

interface ValidateDrillCatalogInput {
  drills: readonly Drill[]
  progressionChains: readonly ProgressionChain[]
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

  return issues
}
