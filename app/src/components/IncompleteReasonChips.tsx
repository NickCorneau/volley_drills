import type { IncompleteReason } from '../model'
import { ChoiceRow, type ChoiceRowOption } from './ui'

const OPTIONS: readonly ChoiceRowOption<IncompleteReason>[] = [
  { value: 'time', label: 'Time' },
  { value: 'fatigue', label: 'Fatigue' },
  { value: 'pain', label: 'Pain' },
  { value: 'other', label: 'Other' },
]

type IncompleteReasonChipsProps = {
  value: IncompleteReason | null
  onChange: (next: IncompleteReason | null) => void
}

export function IncompleteReasonChips({ value, onChange }: IncompleteReasonChipsProps) {
  // Plan U3 (2026-05-04): deselect-on-retap stays caller-owned. ChoiceRow's
  // onChange always receives a value; the wrapping lambda decides to forward
  // null when the tapped option is already selected.
  return (
    <ChoiceRow<IncompleteReason>
      value={value}
      onChange={(next) => onChange(value === next ? null : next)}
      options={OPTIONS}
      layout="grid-2"
      defaultTone="warning"
      ariaLabel="Why did you end early?"
    />
  )
}
