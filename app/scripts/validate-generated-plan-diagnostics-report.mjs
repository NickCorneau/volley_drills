// @ts-check

import { readFileSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createServer } from 'vite'

const __dirname = dirname(fileURLToPath(import.meta.url))
const reportPath = resolve(
  __dirname,
  '../../docs/reviews/2026-05-01-generated-plan-diagnostics-report.md',
)
const triagePath = resolve(
  __dirname,
  '../../docs/reviews/2026-05-01-generated-plan-diagnostics-triage.md',
)
const shouldWrite = process.argv.includes('--write')

function snakeCaseCell(cell) {
  return {
    focus: cell.focus,
    configuration: cell.configuration,
    level: cell.level,
    duration: cell.duration,
    seed: cell.seed,
    block_id: cell.blockId,
    planned_minutes: cell.plannedMinutes,
    allocated_minutes: cell.allocatedMinutes,
    authored_min_minutes: cell.authoredMinMinutes,
    authored_max_minutes: cell.authoredMaxMinutes,
    fatigue_max_minutes: cell.fatigueMaxMinutes,
    observation_codes: cell.observationCodes,
    redistribution: snakeCaseRedistribution(cell.redistribution),
  }
}

function snakeCaseRedistribution(redistribution) {
  if (!redistribution) return undefined
  return {
    source: redistribution.source,
    redistributed_minutes: redistribution.redistributedMinutes,
    skipped_optional_layout_indexes: redistribution.skippedOptionalLayoutIndexes,
    redistribution_layout_index: redistribution.redistributionLayoutIndex,
    redistributedMinutes: redistribution.redistributedMinutes,
    skippedOptionalLayoutIndexes: redistribution.skippedOptionalLayoutIndexes,
    redistributionLayoutIndex: redistribution.redistributionLayoutIndex,
  }
}

function snakeCaseNotApplicableCell(cell) {
  return {
    focus: cell.focus,
    configuration: cell.configuration,
    level: cell.level,
    duration: cell.duration,
    seed: cell.seed,
    reason: cell.reason,
  }
}

function snakeCaseSurfaceContract(report) {
  return {
    included: {
      focuses: report.included.focuses,
      configurations: report.included.configurations,
      levels: report.included.levels,
      durations: report.included.durations,
      seed_ids: report.included.seedIds,
    },
    excluded: report.excluded.map((entry) => ({
      state: entry.state,
      dimension: entry.dimension,
      value: entry.value,
      reason: entry.reason,
      authority: entry.authority,
      revisit_trigger: entry.revisitTrigger,
    })),
    validation_issues: report.validationIssues.map((issue) => ({
      code: issue.code,
      dimension: issue.dimension,
      value: issue.value,
      message: issue.message,
    })),
  }
}

function snakeCaseGroup(group) {
  return {
    drill_id: group.drillId,
    variant_id: group.variantId,
    block_type: group.blockType,
    required: group.required,
    authored_min_minutes: group.authoredMinMinutes,
    authored_max_minutes: group.authoredMaxMinutes,
    fatigue_max_minutes: group.fatigueMaxMinutes,
    affected_cell_count: group.affectedCellCount,
    observation_codes: group.observationCodes,
    likely_fix_paths: group.likelyFixPaths,
    example_affected_cells: group.affectedCells.slice(0, 3).map(snakeCaseCell),
  }
}

function snakeCaseRedistributionCausalityCounts(counts) {
  return {
    total_affected_cell_count: counts.totalAffectedCellCount,
    redistribution_affected_cell_count: counts.redistributionAffectedCellCount,
    current_over_authored_max_cell_count: counts.currentOverAuthoredMaxCellCount,
    current_over_fatigue_cap_cell_count: counts.currentOverFatigueCapCellCount,
    current_under_authored_min_cell_count: counts.currentUnderAuthoredMinCellCount,
    allocated_over_authored_max_cell_count: counts.allocatedOverAuthoredMaxCellCount,
    allocated_over_fatigue_cap_cell_count: counts.allocatedOverFatigueCapCellCount,
    allocated_under_authored_min_cell_count: counts.allocatedUnderAuthoredMinCellCount,
    non_redistribution_over_cap_cell_count: counts.nonRedistributionOverCapCellCount,
    non_redistribution_under_min_cell_count: counts.nonRedistributionUnderMinCellCount,
    pressure_disappears_cell_count: counts.pressureDisappearsCellCount,
    pressure_remains_cell_count: counts.pressureRemainsCellCount,
    comparison_inconclusive_cell_count: counts.comparisonInconclusiveCellCount,
    redistribution_without_pressure_cell_count: counts.redistributionWithoutPressureCellCount,
    counterfactual_unfilled_minutes: counts.counterfactualUnfilledMinutes,
  }
}

function snakeCaseRedistributionCausalityReceipt(receipt) {
  return {
    comparison_mode: receipt.comparisonMode,
    runtime_boundary: receipt.runtimeBoundary,
    group_count: receipt.groupCount,
    counts: snakeCaseRedistributionCausalityCounts(receipt.counts),
    groups: receipt.groups.map((group) => ({
      group_key: group.groupKey,
      diagnostic_fingerprint: group.diagnosticFingerprint,
      triage_status: group.triageStatus,
      triage_route: group.triageRoute,
      reviewed_report_id: group.reviewedReportId,
      drill_id: group.drillId,
      variant_id: group.variantId,
      block_type: group.blockType,
      observation_codes: group.observationCodes,
      action_state: group.actionState,
      dominant_cell_state: group.dominantCellState,
      has_incomplete_evidence: group.hasIncompleteEvidence,
      follow_up_routes: group.followUpRoutes,
      counts: snakeCaseRedistributionCausalityCounts(group.counts),
    })),
  }
}

function reportMarkdown(data) {
  return `---
id: generated-plan-diagnostics-report-2026-05-01
title: "Generated Plan Diagnostics Report"
status: active
stage: validation
type: review-data
summary: "Machine-readable generated-plan diagnostics summary for the current Tune today focus-readiness surface."
authority: "Current generated-plan diagnostic snapshot for seeded buildDraft() stretch-pressure and duration-envelope classification."
last_updated: 2026-05-02
depends_on:
  - app/src/domain/generatedPlanDiagnostics.ts
  - app/src/domain/sessionBuilder.ts
  - docs/archive/plans/2026-05-01-001-feat-generated-plan-diagnostics-plan.md
  - docs/brainstorms/2026-05-02-generated-diagnostics-dynamic-surface-sentinel-requirements.md
  - docs/brainstorms/2026-05-02-generated-diagnostics-redistribution-causality-receipt-requirements.md
---

# Generated Plan Diagnostics Report

## Purpose

Record the current generated-plan diagnostic snapshot for the Tune today supported surface. This file is fully generated and validated by \`npm run diagnostics:report:check\`.

## Summary

- Total seeded cells: ${data.surface.cell_count}
- Clean cells: ${data.status_counts.clean}
- Observation-only cells: ${data.status_counts.observation_only}
- Hard-failure cells: ${data.status_counts.hard_failure}
- Routeable observation groups: ${data.routeable_observation_group_count}

## Interpretation

Hard failures block readiness. Routeable observations are policy/content signals, not automatic product failures. Catalog changes still require gap cards and source references before activation.

The committed report intentionally keeps top routeable groups plus examples only. Use \`buildGeneratedPlanObservationGroups(buildGeneratedPlanDiagnostics())\` from \`app/src/domain/generatedPlanDiagnostics.ts\` when a full affected-cell export is needed for deeper analysis.

## Machine-Readable Data

<!-- diagnostic-report-data:start -->
\`\`\`json
${JSON.stringify(data, null, 2)}
\`\`\`
<!-- diagnostic-report-data:end -->
`
}

function extractTriageRegistry(markdown) {
  const match = markdown.match(
    /<!-- diagnostic-triage-registry:start -->\n```json\n([\s\S]*?)\n```\n<!-- diagnostic-triage-registry:end -->/,
  )
  if (!match) {
    throw new Error('Generated plan diagnostics triage registry is missing.')
  }
  return JSON.parse(match[1])
}

function triageMarkdown(workbenchMarkdown, registry) {
  return `---
id: generated-plan-diagnostics-triage-2026-05-01
title: "Generated Plan Diagnostics Triage"
status: active
stage: validation
type: review
summary: "Docs-first triage workbench and decision-debt compression review for generated-plan routeable observation groups."
authority: "Current triage snapshot for generated-plan diagnostic observation groups; validates stable group identity, conservative routes, stale fingerprint review, and derived decision-debt compression lanes."
last_updated: 2026-05-02
depends_on:
  - app/src/domain/generatedPlanDiagnostics.ts
  - app/src/domain/generatedPlanDiagnosticTriage.ts
  - docs/reviews/2026-05-01-generated-plan-diagnostics-report.md
  - docs/brainstorms/2026-05-02-generated-diagnostics-redistribution-causality-receipt-requirements.md
  - docs/brainstorms/2026-05-02-generated-diagnostics-d47-u6-proposal-admission-requirements.md
  - docs/brainstorms/2026-05-02-generated-diagnostics-d47-gap-closure-ledger-requirements.md
  - docs/brainstorms/2026-05-02-generated-diagnostics-d01-comparator-gap-fill-proposal-requirements.md
  - docs/brainstorms/2026-05-02-generated-diagnostics-d01-workload-block-shape-proposal-requirements.md
  - docs/brainstorms/2026-05-02-generated-diagnostics-d01-block-shape-fill-requirements.md
  - docs/brainstorms/2026-05-02-generated-diagnostics-d01-redistribution-handoff-requirements.md
  - docs/brainstorms/2026-05-02-generated-diagnostics-d01-cap-catalog-fork-requirements.md
  - docs/brainstorms/2026-05-02-gap-closure-selection-workbench-requirements.md
  - docs/brainstorms/2026-05-02-generated-diagnostics-d47-reentry-selection-requirements.md
  - docs/brainstorms/2026-05-02-generated-diagnostics-d47-concrete-delta-proposal-requirements.md
  - docs/reviews/2026-05-02-d47-source-backed-gap-card.md
  - docs/reviews/2026-05-02-d47-d05-comparator-evaluation-payload.md
  - docs/plans/2026-05-02-001-feat-d47-proposal-admission-ticket-plan.md
  - docs/plans/2026-05-02-003-feat-d47-gap-closure-ledger-plan.md
  - docs/plans/2026-05-02-004-feat-d01-gap-fill-proposal-plan.md
  - docs/plans/2026-05-02-006-feat-d01-workload-block-shape-proposal-plan.md
  - docs/plans/2026-05-02-007-feat-d01-block-shape-fill-plan.md
  - docs/plans/2026-05-02-008-feat-d01-redistribution-handoff-plan.md
  - docs/plans/2026-05-02-010-feat-d01-cap-catalog-fork-plan.md
  - docs/plans/2026-05-02-011-feat-gap-closure-selection-workbench-plan.md
  - docs/plans/2026-05-02-012-feat-d47-d05-comparator-decision-packet-plan.md
  - docs/plans/2026-05-02-013-feat-d47-d05-comparator-evaluation-payload-plan.md
  - docs/plans/2026-05-02-018-feat-d49-residual-follow-up-plan.md
  - docs/plans/2026-05-03-001-feat-d49-next-work-selection-plan.md
---

# Generated Plan Diagnostics Triage

## Purpose

Record the current docs-first triage workbench for generated-plan routeable observation groups. This file is fully generated and validated by \`npm run diagnostics:report:check\`.

## Interpretation

This workbench does not authorize catalog changes. It routes generated-plan observations into conservative decision lanes and compresses unresolved rows into derived human review prompts so maintainers can decide whether a group is a policy allowance, cap review, block split, source-backed content-depth item, or generator-policy investigation.

${workbenchMarkdown}
## Machine-Readable Registry

<!-- diagnostic-triage-registry:start -->
\`\`\`json
${JSON.stringify(registry, null, 2)}
\`\`\`
<!-- diagnostic-triage-registry:end -->
`
}

function normalizeMarkdown(markdown) {
  return markdown.replace(/\r\n/g, '\n')
}

function writeMarkdownIfChanged(path, expectedMarkdown) {
  const currentMarkdown = readFileSync(path, 'utf8')
  if (normalizeMarkdown(currentMarkdown) === normalizeMarkdown(expectedMarkdown)) return false
  writeFileSync(path, expectedMarkdown)
  return true
}

const server = await createServer({
  root: resolve(__dirname, '..'),
  logLevel: 'silent',
  server: { middlewareMode: true },
})

try {
  const diagnostics = await server.ssrLoadModule('/src/domain/generatedPlanDiagnostics.ts')
  const triage = await server.ssrLoadModule('/src/domain/generatedPlanDiagnosticTriage.ts')
  const matrix = diagnostics.buildGeneratedPlanMatrix()
  const results = diagnostics.buildGeneratedPlanDiagnostics()
  const summary = diagnostics.summarizeGeneratedPlanDiagnostics(results, matrix)
  const surfaceContract = diagnostics.DEFAULT_GENERATED_PLAN_SURFACE_CONTRACT
  const surfaceContractValidation =
    diagnostics.validateGeneratedPlanSurfaceContract(surfaceContract)
  if (surfaceContractValidation.blockingIssues.length > 0) {
    throw new Error(
      `Generated plan diagnostics surface contract has ${surfaceContractValidation.blockingIssues.length} blocking validation issue(s).`,
    )
  }
  const groups = diagnostics.buildGeneratedPlanObservationGroups(results)
  const currentTriageMarkdown = shouldWrite ? undefined : readFileSync(triagePath, 'utf8')
  const triageRegistry = shouldWrite
    ? triage.buildInitialGeneratedPlanTriageRegistry(groups)
    : extractTriageRegistry(currentTriageMarkdown)
  const triageValidation = triage.validateGeneratedPlanTriageCoverage(groups, triageRegistry)
  const redistributionCausalityReceipt = triage.buildGeneratedPlanRedistributionCausalityReceipt(
    groups,
    triageRegistry,
  )
  const expectedTriageMarkdown = triageMarkdown(
    triage.buildGeneratedPlanTriageWorkbenchMarkdown(groups, triageRegistry),
    triageRegistry,
  )
  const data = {
    id: 'generated-plan-diagnostics-report-2026-05-01',
    title: 'Generated Plan Diagnostics Report',
    status: 'active',
    stage: 'validation',
    type: 'review-data',
    source: {
      module: 'app/src/domain/generatedPlanDiagnostics.ts',
      summary_helper:
        'summarizeGeneratedPlanDiagnostics(buildGeneratedPlanDiagnostics(), buildGeneratedPlanMatrix())',
      group_helper: 'buildGeneratedPlanObservationGroups(buildGeneratedPlanDiagnostics())',
      test_file: 'app/src/domain/__tests__/generatedPlanDiagnostics.test.ts',
    },
    surface: {
      focuses: summary.surface.focuses,
      configurations: summary.surface.configurations,
      levels: summary.surface.levels,
      durations: summary.surface.durations,
      seed_ids: summary.surface.seedIds,
      seed_count: summary.surface.seedCount,
      cell_count: summary.surface.cellCount,
      applicable_count: summary.surface.applicableCount,
      not_applicable_count: summary.surface.notApplicableCount,
      not_applicable_cells: summary.notApplicable.map(snakeCaseNotApplicableCell),
    },
    surface_contract: snakeCaseSurfaceContract(
      diagnostics.buildGeneratedPlanSurfaceContractReport(surfaceContract),
    ),
    status_counts: summary.statusCounts,
    hard_failure_count: summary.hardFailureCount,
    observation_count: summary.observationCount,
    hard_failure_counts: summary.hardFailureCounts,
    observation_counts: summary.observationCounts,
    routeable_observation_group_count: groups.length,
    top_routeable_observation_groups: groups.slice(0, 5).map(snakeCaseGroup),
    redistribution_causality_receipt: snakeCaseRedistributionCausalityReceipt(
      redistributionCausalityReceipt,
    ),
    policy: {
      hard_failures_block_readiness: true,
      routeable_observations_are_not_product_failures: true,
      catalog_changes_require_gap_cards_and_source_references: true,
    },
  }

  const expectedMarkdown = reportMarkdown(data)

  if (shouldWrite) {
    const wroteReport = writeMarkdownIfChanged(reportPath, expectedMarkdown)
    const wroteTriage = writeMarkdownIfChanged(triagePath, expectedTriageMarkdown)
    console.log(`${wroteReport ? 'Wrote' : 'Already current'} ${reportPath}`)
    console.log(`${wroteTriage ? 'Wrote' : 'Already current'} ${triagePath}`)
  } else {
    const currentMarkdown = readFileSync(reportPath, 'utf8')
    if (normalizeMarkdown(currentMarkdown) !== normalizeMarkdown(expectedMarkdown)) {
      throw new Error(
        'Generated plan diagnostics report is stale. Run npm run diagnostics:report:update.',
      )
    }
    if (triageValidation.blockingIssues.length > 0) {
      throw new Error(
        `Generated plan diagnostics triage has ${triageValidation.blockingIssues.length} blocking validation issue(s). Run npm run diagnostics:report:update after reviewing the triage routes.`,
      )
    }
    if (normalizeMarkdown(currentTriageMarkdown) !== normalizeMarkdown(expectedTriageMarkdown)) {
      throw new Error(
        'Generated plan diagnostics triage is stale. Run npm run diagnostics:report:update.',
      )
    }
    console.log('Generated plan diagnostics report is current.')
    console.log('Generated plan diagnostics triage is current.')
  }
} finally {
  await server.close()
}
