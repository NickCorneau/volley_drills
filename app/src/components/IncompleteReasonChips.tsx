import type { IncompleteReason } from '../model'
import { ToggleChip } from './ui'

const OPTIONS: { value: IncompleteReason; label: string }[] = [
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
  return (
    <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Why did you end early?">
      {OPTIONS.map((opt) => {
        const selected = value === opt.value
        return (
          <ToggleChip
            key={opt.value}
            label={opt.label}
            selected={selected}
            onTap={() => onChange(selected ? null : opt.value)}
            tone="warning"
            shape="pill"
            fill={false}
            className="px-4"
          />
        )
      })}
    </div>
  )
}
