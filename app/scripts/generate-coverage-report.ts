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
  level_unhonored: 'LU',
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
    'summary: "First-run audit after the 2026-05-04 skill-level mutability ship made the engine read effective skill level for the first time. 180 cells total: 45 covered (25%), 135 failing (75%). Every failing cell carries `off_focus_support` (the strict R7 read — no support drill in technique/movement_proxy carries the chosen focus tag directly). 12 cells are unbuildable (`cannot_generate`) — all `serve` × `pair_open` (no net). 54 cells fail with `level_unhonored` — every `competitive_pair` (mapped to advanced) user hits this for at least pass + serve focuses. 22 cells fail with `thin_pressure` (40-min layouts where pressure slot lacks an in-band focused option). 18 cells fail with `no_same_focus_swap` (only 1 in-band main family — mostly `serve` × foundations/rally_builders × solo). The audit is a Vitest test; CI fails on regression."')
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
    `| \`level_unhonored\` (LU) | ${result.summary.riskBucketCounts.level_unhonored} | Main families exist at other levels, but none in-band. Engine relaxes level on this slot. Tune today eyebrow fires. |`,
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
  lines.push('## Headline gaps (scan-first)')
  lines.push('')
  lines.push('### 1. `off_focus_support` is universal (135/135 failing cells)')
  lines.push('')
  lines.push(
    'Every failing cell carries `off_focus_support`. The strict R7 read — a support drill must include the chosen focus tag in its `skillFocus` — surfaces that **no current `technique` or `movement_proxy` drill carries `serve` or `set`** in its `skillFocus`. Pass-focused sessions pass R7 because the existing technique drills (d05, d10, d11, etc.) are all `pass`-tagged.',
  )
  lines.push('')
  lines.push(
    'This is the brainstorm\'s "long Serving session still has pass-flavored support blocks" gap (`docs/ideation/2026-04-30-focus-picker-drill-depth-ideation.md` Idea #3 "Focus-Aligned Support Blocks"). Resolution path: either (a) author serve-reinforcing technique/movement_proxy drills, or (b) relax R7 to allow source-backed adjacent tags (e.g., movement work counts for serving via footwork-routine reinforcement).',
  )
  lines.push('')
  lines.push('### 2. `serve` × `pair_open` is unbuildable at every level (12 cells)')
  lines.push('')
  lines.push(
    "Pair + open sand (no net) cannot generate a serving main_skill block — the brainstorm flagged this. Resolution path: source-backed pair-without-net serving drill (e.g., target practice with a partner shagging) or accept this as a permanent `not_applicable` per the brainstorm's `D101` 3+ player gating.",
  )
  lines.push('')
  lines.push('### 3. `competitive_pair` users hit `level_unhonored` on 54 cells')
  lines.push('')
  lines.push(
    'Catalog inspection: zero drills with `levelMax: \'advanced\'` carry `pass | serve | set` focus. Every `competitive_pair` (mapped to `advanced`) user hits the relaxation eyebrow for any focused session. Resolution path: source-backed advanced variants (FIVB Level II coaches manual, BAB advanced material) or accept the eyebrow as the honest signal.',
  )
  lines.push('')
  lines.push(
    '### 4. Serve × foundations/rally_builders × solo configurations have only 1 main family',
  )
  lines.push('')
  lines.push(
    "18 cells fall into `no_same_focus_swap`. The brainstorm's serving credibility pass (Idea #2) targets this directly.",
  )
  lines.push('')
  lines.push('## Per-focus matrices')
  lines.push('')
  lines.push(
    'Each cell shows the worst-status risk-bucket abbreviation (CG, LU, NS, OS, TP) joined by `+` when multiple risks apply. `✓` is a covered cell.',
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
