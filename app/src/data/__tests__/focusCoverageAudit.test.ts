import { describe, expect, it } from 'vitest'
import {
  runFocusCoverageAudit,
  summarizeCoverageForSnapshot,
  type CoverageRiskBucket,
} from '../focusCoverageAudit'

/**
 * Focus Coverage Audit regression test.
 *
 * The audit walks the focus × player-mode × net/wall × time-profile ×
 * skill-level matrix (3 × 5 × 3 × 4 = 180 cells) and reports whether
 * each cell meets the practical depth floor from
 * `docs/brainstorms/2026-04-30-focus-coverage-catalog-readiness-requirements.md`
 * (R6–R10).
 *
 * The snapshot below is the authoritative baseline. When a future
 * change to `app/src/data/drills.ts` (new variant, new drill,
 * eligibility relaxation) closes a gap, that cell's snapshot entry
 * flips from a risk-bucket string (e.g., `'level_unhonored'`) to
 * `'covered'` — `npm test -- -u` updates the snapshot, the diff
 * reads as "✗ → ✓ for cell X", and code review can confirm the
 * improvement is real. When a change opens a new gap (e.g., a
 * formerly-eligible variant gains an unmodeled requirement), the
 * snapshot fails loudly with the regressed cell highlighted.
 *
 * **Reading the snapshot:**
 * - `'covered'` — the cell meets all R6/R7/R8 thresholds.
 * - `'not_applicable'` — no archetype/layout exists for this combo
 *   (currently zero — every (config, timeProfile) pair has a layout).
 * - `'cannot_generate'` — main_skill family pool is empty across all
 *   levels; engine cannot build a focused main_skill block.
 * - `'level_unhonored'` — main families exist at other levels, but
 *   none in-band; engine would relax level on this slot.
 * - `'no_same_focus_swap'` — exactly 1 in-band main family; swap
 *   would re-pick the same drill.
 * - `'off_focus_support'` — no in-band technique/movement_proxy drill
 *   carries the chosen focus tag (the brainstorm's "long Serving
 *   session feels pass-flavored" gap, made explicit per cell).
 * - `'thin_pressure'` — pressure slot exists in the layout but no
 *   in-band pressure drill carries the chosen focus tag.
 * - Comma-joined string — multiple risks on the same cell, sorted
 *   alphabetically (e.g., `'cannot_generate,off_focus_support'`).
 *
 * **How to update the snapshot:** when shipping a change that
 * intentionally improves coverage, run
 * `npm --prefix app test -- focusCoverageAudit -u` and commit the
 * snapshot diff alongside the catalog change. Code review confirms
 * the improvement is real.
 */
describe('focusCoverageAudit', () => {
  it('matches the per-cell coverage snapshot', async () => {
    const result = runFocusCoverageAudit()
    const summary = summarizeCoverageForSnapshot(result)
    await expect(summary).toMatchFileSnapshot('./focusCoverageAudit.snapshot.json')
  })

  it('matches the summary counts snapshot', () => {
    const result = runFocusCoverageAudit()
    expect(result.summary).toMatchInlineSnapshot(`
      {
        "coveredCount": 45,
        "failingCount": 135,
        "notApplicableCount": 0,
        "riskBucketCounts": {
          "cannot_generate": 12,
          "level_unhonored": 54,
          "no_same_focus_swap": 18,
          "off_focus_support": 135,
          "thin_pressure": 22,
        },
        "totalCells": 180,
      }
    `)
  })

  it('every cell has a status, and risks reconcile to risk-bucket counts', () => {
    const result = runFocusCoverageAudit()

    expect(result.cells).toHaveLength(180)
    const validStatuses = new Set(['covered', 'failing', 'not_applicable'])
    for (const cell of result.cells) {
      expect(validStatuses.has(cell.status)).toBe(true)
      if (cell.status === 'covered' || cell.status === 'not_applicable') {
        expect(cell.risks).toHaveLength(0)
      } else {
        expect(cell.risks.length).toBeGreaterThan(0)
      }
    }

    // Reconcile risk-bucket totals.
    const computed: Record<CoverageRiskBucket, number> = {
      cannot_generate: 0,
      off_focus_support: 0,
      thin_pressure: 0,
      no_same_focus_swap: 0,
      level_unhonored: 0,
    }
    for (const cell of result.cells) {
      for (const risk of cell.risks) {
        computed[risk]++
      }
    }
    expect(computed).toEqual(result.summary.riskBucketCounts)
  })

  it('floor-floor sanity: a cell can only be covered with at least 2 in-band main families AND >=1 in-band support AND (no pressure slot OR >=1 in-band pressure)', () => {
    const result = runFocusCoverageAudit()
    for (const cell of result.cells) {
      if (cell.status !== 'covered') continue
      expect(cell.counts.mainFamiliesInBand).toBeGreaterThanOrEqual(2)
      expect(cell.counts.supportFamiliesInBand).toBeGreaterThanOrEqual(1)
      if (cell.counts.pressureApplicable) {
        expect(cell.counts.pressureFamiliesInBand).toBeGreaterThanOrEqual(1)
      }
    }
  })
})
