// V0B-01 / D120 / 2026-04-23 walkthrough closeout polish:
//
// Three-chip effort picker (Easy / Right / Hard) that captures the
// session RPE as a canonical numeric band value. Collapses the prior
// 11-chip 0-10 grid per the merged Review proposal in
// `docs/research/partner-walkthrough-results/2026-04-22-trifold-synthesis.md`
// and the closeout polish plan
// `docs/archive/plans/2026-04-23-walkthrough-closeout-polish.md`.
//
// Why three and not eleven: the four 2026-04-22 synthesis passes
// (workflow, shibui, design review, trifold) and Seb P1-12 converged on
// the 0-10 scale reading as "RPE fluency assumption" - courtside
// decision-making does not need to distinguish a 6 from a 7, it needs
// a one-tap read of how the session felt. The persisted `sessionRpe`
// field remains a number in the 0-10 domain so Dexie records, the
// `composeSummary` thresholds in `app/src/domain/sessionSummary`, the
// `effortLabel` bands in `app/src/lib/format.ts`, the migration
// backfill in `phase-c0-schema-v4.spec.ts`, and the adaptation-engine
// tuning constants (`TUNING_FLOOR_ATTEMPTS` etc. in
// `app/src/domain/policies.ts`) all continue to operate on the same
// numeric range - the capture UI just stops asking for granularity it
// was never going to use.
//
// Chip-to-RPE mapping (canonical band anchors) lives in
// `rpeSelectorUtils.ts`:
//   Easy  -> 3  (Borg anchor "easy"     -> `effortLabel` band "Easy")
//   Right -> 5  (Borg anchor "moderate" -> `effortLabel` band "Moderate")
//   Hard  -> 7  (Borg anchor "hard"     -> `effortLabel` band "Hard")
//
// "Right" is the label per the merged proposal (not "Moderate"), to
// match the Quick-tags vocabulary that was simultaneously deleted
// ("About right" / "Too easy" / "Too hard") and read naturally at
// arm's length. Downstream summaries still say "Moderate" via
// `effortLabel(5)`; the capture label and the summary label live in
// different vocabulary spaces on purpose.
//
// Historical captures: existing records in Dexie may hold any value
// 0-10. Rehydration uses `pickChipForRpe` (see `rpeSelectorUtils.ts`)
// to snap a non-canonical stored value to the nearest chip for
// display, so a rehydrated draft with `sessionRpe: 6` lands on
// `Right` (nearest canonical 5). The stored value is not mutated
// until the user taps a different chip.

import { EFFORT_CHIPS, pickChipForRpe } from './rpeSelectorUtils'
import { ToggleChip } from './ui'

type RpeSelectorProps = {
  value: number | null
  onChange: (sessionRpe: number) => void
  /**
   * ID of the heading element labelling this control. Defaults to the
   * ReviewScreen heading (`rpe-heading`) but is overridable so the
   * component can be reused on other surfaces without silently losing
   * its label when a second instance renders. Red-team UX #13.
   */
  ariaLabelledBy?: string
}

export function RpeSelector({ value, onChange, ariaLabelledBy = 'rpe-heading' }: RpeSelectorProps) {
  const selectedValue = pickChipForRpe(value)
  return (
    <div className="grid grid-cols-3 gap-2" role="radiogroup" aria-labelledby={ariaLabelledBy}>
      {EFFORT_CHIPS.map((chip) => {
        const selected = selectedValue === chip.value
        return (
          <ToggleChip
            key={chip.label}
            label={chip.label}
            selected={selected}
            onTap={() => onChange(chip.value)}
            shape="rounded"
          />
        )
      })}
    </div>
  )
}
