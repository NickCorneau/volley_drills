/**
 * Generates a human-readable markdown summary of the focus-coverage
 * audit at `docs/reviews/2026-05-04-focus-coverage-audit.md`.
 *
 * The Vitest snapshot at
 * `app/src/data/__tests__/focusCoverageAudit.snapshot.json` is the
 * authoritative regression baseline (per-cell, machine-readable).
 * This script produces a scan-friendly per-focus / per-level view
 * for human reviewers and gap-card authors. Re-run after any
 * catalog change that intentionally moves coverage:
 *
 *     npm --prefix app run audit:coverage
 */

import { writeFileSync } from 'node:fs'
import { resolve } from 'node:path'

import {
  CONFIGS,
  FOCUS_LEVELS,
  runFocusCoverageAudit,
  type CoverageCell,
} from '../src/data/focusCoverageAudit'

const FOCUSES = ['pass', 'serve', 'set'] as const
const TIME_PROFILES = [15, 25, 40] as const

const RISK_LABELS: Record<string, string> = {
  covered: '✓',
  not_applicable: '—',
  cannot_generate: 'CG',
  cannot_generate_at_level: 'CL',
  no_same_focus_swap: 'NS',
  off_focus_support: 'OS',
  thin_pressure: 'TP',
}

function statusCell(cell: CoverageCell): string {
  if (cell.status === 'covered') return '✓'
  if (cell.status === 'not_applicable') return '—'
  return cell.risks.map((r) => RISK_LABELS[r] ?? r).join('+')
}

function generate(): string {
  const result = runFocusCoverageAudit()
  const lines: string[] = []

  lines.push('---')
  lines.push('id: focus-coverage-audit-2026-05-04')
  lines.push('title: "Focus Coverage Audit (2026-05-04, post-skill-level-mutability)"')
  lines.push('status: active')
  lines.push('stage: validation')
  lines.push('type: review')
  lines.push(
    'authority: "Generated diagnostic from `app/src/data/focusCoverageAudit.ts` walking the focus × player-mode × net/wall × time-profile × skill-level matrix against the practical depth floor in `docs/brainstorms/2026-04-30-focus-coverage-catalog-readiness-requirements.md` (R6-R10). The Vitest snapshot at `app/src/data/__tests__/focusCoverageAudit.snapshot.json` is the authoritative regression baseline; this markdown is the scan-friendly human view."',
  )
  lines.push(
    `summary: "Current generated audit: ${result.summary.totalCells} cells total, ${result.summary.coveredCount} covered, ${result.summary.failingCount} failing, ${result.summary.notApplicableCount} not applicable. The audit is a Vitest-backed diagnostic; snapshot diffs expose coverage regressions or intentional catalog improvements."`,
  )
  lines.push('last_updated: 2026-05-04')
  lines.push('related:')
  lines.push('  - docs/brainstorms/2026-04-30-focus-coverage-catalog-readiness-requirements.md')
  lines.push('  - docs/ideation/2026-04-30-focus-picker-drill-depth-ideation.md')
  lines.push('  - docs/plans/2026-05-04-001-feat-skill-level-mutability-plan.md')
  lines.push('  - app/src/data/focusCoverageAudit.ts')
  lines.push('  - app/src/data/__tests__/focusCoverageAudit.test.ts')
  lines.push('  - app/src/data/__tests__/focusCoverageAudit.snapshot.json')
  lines.push('decision_refs:')
  lines.push('  - D81')
  lines.push('  - D101')
  lines.push('  - D130')
  lines.push('  - D135')
  lines.push('---')
  lines.push('')
  lines.push('# Focus Coverage Audit (2026-05-04, post-skill-level-mutability)')
  lines.push('')
  lines.push('## Summary')
  lines.push('')
  lines.push(`- **Total cells audited:** ${result.summary.totalCells}`)
  lines.push(
    `- **Covered:** ${result.summary.coveredCount} (${Math.round((result.summary.coveredCount / result.summary.totalCells) * 100)}%)`,
  )
  lines.push(
    `- **Failing:** ${result.summary.failingCount} (${Math.round((result.summary.failingCount / result.summary.totalCells) * 100)}%)`,
  )
  lines.push(`- **Not applicable:** ${result.summary.notApplicableCount}`)
  lines.push('')
  lines.push('### Risk-bucket counts')
  lines.push('')
  lines.push('| Risk bucket | Count | Meaning |')
  lines.push('| --- | --- | --- |')
  lines.push(
    `| \`cannot_generate\` (CG) | ${result.summary.riskBucketCounts.cannot_generate} | No main-skill family exists in any band for this slot+context. Engine cannot build a focused main_skill block. |`,
  )
  lines.push(
    `| \`cannot_generate_at_level\` (CL) | ${result.summary.riskBucketCounts.cannot_generate_at_level} | Main families exist at other levels, but none in-band. The engine cannot generate this focused slot at the saved level. |`,
  )
  lines.push(
    `| \`no_same_focus_swap\` (NS) | ${result.summary.riskBucketCounts.no_same_focus_swap} | Exactly 1 in-band main family. Swap would re-pick the same drill (R9 fails). |`,
  )
  lines.push(
    `| \`off_focus_support\` (OS) | ${result.summary.riskBucketCounts.off_focus_support} | No in-band technique/movement_proxy drill carries the chosen focus tag (the brainstorm's "Serving session feels pass-flavored" gap, made explicit per cell). |`,
  )
  lines.push(
    `| \`thin_pressure\` (TP) | ${result.summary.riskBucketCounts.thin_pressure} | Pressure slot present in the 40-min layout, but no in-band pressure drill carries the chosen focus tag. |`,
  )
  lines.push('')
  lines.push('## Current diagnostic read')
  lines.push('')
  if (result.summary.failingCount === 0) {
    lines.push(
      'All audited cells meet the current practical depth floor. Risk buckets remain in the report as regression sentinels for future drill-catalog changes.',
    )
  } else {
    lines.push(
      'One or more cells are failing. Use the risk-bucket counts and per-focus matrices below to locate the exact focus × level × configuration cells before changing catalog content.',
    )
  }
  lines.push('')
  lines.push('## Per-focus matrices')
  lines.push('')
  lines.push(
    'Each cell shows the worst-status risk-bucket abbreviation (CG, CL, NS, OS, TP) joined by `+` when multiple risks apply. `✓` is a covered cell.',
  )
  lines.push('')

  // Per-focus tables
  for (const focus of FOCUSES) {
    lines.push(`### Focus: ${focus.toUpperCase()}`)
    lines.push('')
    for (const skillLevel of FOCUS_LEVELS) {
      lines.push(`#### Skill level: \`${skillLevel}\``)
      lines.push('')
      const headerTime = TIME_PROFILES.map((t) => `${t}-min`).join(' | ')
      lines.push(`| Config | ${headerTime} |`)
      lines.push(`| --- | ${TIME_PROFILES.map(() => '---').join(' | ')} |`)
      for (const config of CONFIGS) {
        const row = TIME_PROFILES.map((tp) => {
          const cell = result.cells.find(
            (c) =>
              c.focus === focus &&
              c.skillLevel === skillLevel &&
              c.configId === config.id &&
              c.timeProfile === tp,
          )
          return cell ? statusCell(cell) : '?'
        }).join(' | ')
        lines.push(`| \`${config.id}\` | ${row} |`)
      }
      lines.push('')
    }
  }

  // Detailed failing-cell index
  lines.push('## Failing-cell index')
  lines.push('')
  lines.push('Sorted by focus → skill level → config → time profile.')
  lines.push('')
  lines.push(
    '| Focus | Skill level | Config | Time | Risks | Main in-band / total | Support in-band | Pressure in-band / total |',
  )
  lines.push('| --- | --- | --- | ---: | --- | ---: | ---: | ---: |')
  for (const cell of result.cells) {
    if (cell.status !== 'failing') continue
    const risks = cell.risks.join(', ')
    const pressureCell = cell.counts.pressureApplicable
      ? `${cell.counts.pressureFamiliesInBand} / ${cell.counts.pressureFamiliesAnyBand}`
      : '—'
    lines.push(
      `| ${cell.focus} | ${cell.skillLevel} | \`${cell.configId}\` | ${cell.timeProfile} | ${risks} | ${cell.counts.mainFamiliesInBand} / ${cell.counts.mainFamiliesAnyBand} | ${cell.counts.supportFamiliesInBand} | ${pressureCell} |`,
    )
  }
  lines.push('')

  lines.push('## How to update this report')
  lines.push('')
  lines.push(
    'Re-run `npm --prefix app run audit:coverage` after a catalog change that intentionally moves coverage. The Vitest snapshot at `app/src/data/__tests__/focusCoverageAudit.snapshot.json` is the regression check; a snapshot mismatch fails CI loudly. Update the snapshot via `npm --prefix app test -- focusCoverageAudit -u` and commit the diff alongside the catalog change.',
  )
  lines.push('')
  lines.push('## How to extend the audit')
  lines.push('')
  lines.push(
    'The matrix dimensions live as constants in `app/src/data/focusCoverageAudit.ts` (`FOCUSES`, `FOCUS_LEVELS`, `CONFIGS`, `TIME_PROFILES`). Adding a new dimension (e.g., a Tier 1c attack focus) means adding the value to one of the constants. Risk buckets live in the `CoverageRiskBucket` union; adding a new check means extending the union and updating `evaluateCell` and the per-cell snapshot serializer.',
  )
  lines.push('')
  lines.push('## For agents')
  lines.push('')
  lines.push(
    '- **Authoritative for**: scan-friendly snapshot of catalog readiness against the R6-R10 floor at the post-skill-level-mutability state.',
  )
  lines.push(
    '- **Edit when**: re-run after a catalog change intentionally moves coverage. Do not hand-edit the matrix — it is generated.',
  )
  lines.push(
    '- **Belongs elsewhere**: regression check (`app/src/data/__tests__/focusCoverageAudit.test.ts`); requirements (`docs/brainstorms/2026-04-30-focus-coverage-catalog-readiness-requirements.md`); gap-card authoring (future).',
  )
  lines.push('')

  return lines.join('\n')
}

const outPath = resolve(import.meta.dirname, '../../docs/reviews/2026-05-04-focus-coverage-audit.md')
writeFileSync(outPath, generate(), 'utf-8')
console.log(`Wrote ${outPath}`)
