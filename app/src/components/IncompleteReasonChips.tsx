import type { IncompleteReason } from '../db'

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
          <button
            key={opt.value}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => onChange(selected ? null : opt.value)}
            className={[
              'min-h-[54px] rounded-full px-4 py-2 text-sm font-semibold transition-colors',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-warning focus-visible:ring-offset-2',
              selected ? 'bg-warning text-white' : 'bg-bg-warm text-text-primary',
            ].join(' ')}
          >
            {opt.label}
          </button>
        )
      })}
    </div>
  )
}
