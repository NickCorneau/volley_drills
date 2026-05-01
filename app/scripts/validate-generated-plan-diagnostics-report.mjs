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
    observation_codes: cell.observationCodes,
    redistribution: cell.redistribution,
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

function reportMarkdown(data) {
  return `---
id: generated-plan-diagnostics-report-2026-05-01
title: "Generated Plan Diagnostics Report"
status: active
stage: validation
type: review-data
summary: "Machine-readable generated-plan diagnostics summary for the current Tune today focus-readiness surface."
authority: "Current generated-plan diagnostic snapshot for seeded buildDraft() stretch-pressure and duration-envelope classification."
last_updated: 2026-05-01
depends_on:
  - app/src/domain/generatedPlanDiagnostics.ts
  - app/src/domain/sessionBuilder.ts
  - docs/plans/2026-05-01-001-feat-generated-plan-diagnostics-plan.md
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
summary: "Docs-first triage workbench for generated-plan routeable observation groups."
authority: "Current triage snapshot for generated-plan diagnostic observation groups; validates stable group identity, conservative routes, and stale fingerprint review."
last_updated: 2026-05-01
depends_on:
  - app/src/domain/generatedPlanDiagnostics.ts
  - app/src/domain/generatedPlanDiagnosticTriage.ts
  - docs/reviews/2026-05-01-generated-plan-diagnostics-report.md
---

# Generated Plan Diagnostics Triage

## Purpose

Record the current docs-first triage workbench for generated-plan routeable observation groups. This file is fully generated and validated by \`npm run diagnostics:report:check\`.

## Interpretation

This workbench does not authorize catalog changes. It routes generated-plan observations into conservative decision lanes so maintainers can decide whether a group is a policy allowance, cap review, block split, source-backed content-depth item, or generator-policy investigation.

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
  const groups = diagnostics.buildGeneratedPlanObservationGroups(results)
  const currentTriageMarkdown = shouldWrite ? undefined : readFileSync(triagePath, 'utf8')
  const triageRegistry = shouldWrite
    ? triage.buildInitialGeneratedPlanTriageRegistry(groups)
    : extractTriageRegistry(currentTriageMarkdown)
  const triageValidation = triage.validateGeneratedPlanTriageCoverage(groups, triageRegistry)
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
      seed_count: summary.surface.seedCount,
      cell_count: summary.surface.cellCount,
      applicable_count: summary.surface.applicableCount,
      not_applicable_count: summary.surface.notApplicableCount,
    },
    status_counts: summary.statusCounts,
    hard_failure_count: summary.hardFailureCount,
    observation_count: summary.observationCount,
    hard_failure_counts: summary.hardFailureCounts,
    observation_counts: summary.observationCounts,
    routeable_observation_group_count: groups.length,
    top_routeable_observation_groups: groups.slice(0, 5).map(snakeCaseGroup),
    policy: {
      hard_failures_block_readiness: true,
      routeable_observations_are_not_product_failures: true,
      catalog_changes_require_gap_cards_and_source_references: true,
    },
  }

  const expectedMarkdown = reportMarkdown(data)

  if (shouldWrite) {
    writeFileSync(reportPath, expectedMarkdown)
    writeFileSync(triagePath, expectedTriageMarkdown)
    console.log(`Wrote ${reportPath}`)
    console.log(`Wrote ${triagePath}`)
  } else {
    const currentMarkdown = readFileSync(reportPath, 'utf8')
    if (normalizeMarkdown(currentMarkdown) !== normalizeMarkdown(expectedMarkdown)) {
      throw new Error('Generated plan diagnostics report is stale. Run npm run diagnostics:report:update.')
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
