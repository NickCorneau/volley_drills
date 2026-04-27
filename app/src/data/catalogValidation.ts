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
