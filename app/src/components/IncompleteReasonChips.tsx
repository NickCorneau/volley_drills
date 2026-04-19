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
              // Phase F11 (2026-04-19): both chip states are
              // clickable (tap to pick, tap again to clear). Hover
              // and press cues mirror `QuickTagChips` / `RpeSelector`
              // for consistency — selected chips use a
              // slightly-darker `bg-warning/90` on hover/press
              // (there is no pre-baked `warning-pressed` token, and
              // `brightness-*` on a saturated red would shift hue
              // noticeably), unselected chips keep warm tone via
              // `brightness-*`.
              selected
                ? 'bg-warning text-white hover:bg-warning/90 active:bg-warning/90'
                : 'bg-bg-warm text-text-primary hover:brightness-95 active:brightness-90',
            ].join(' ')}
          >
            {opt.label}
          </button>
        )
      })}
    </div>
  )
}
