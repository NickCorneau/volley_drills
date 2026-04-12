export type RpeBand = 'easy' | 'moderate' | 'hard' | 'max'

const BANDS: {
  id: RpeBand
  label: string
  range: string
  value: number
}[] = [
  { id: 'easy', label: 'Easy', range: '0–3', value: 2 },
  { id: 'moderate', label: 'Moderate', range: '4–6', value: 5 },
  { id: 'hard', label: 'Hard', range: '7–9', value: 8 },
  { id: 'max', label: 'Max', range: '10', value: 10 },
]

type RpeSelectorProps = {
  value: number | null
  onChange: (sessionRpe: number) => void
}

export function RpeSelector({ value, onChange }: RpeSelectorProps) {
  return (
    <div
      className="grid grid-cols-4 gap-2"
      role="radiogroup"
      aria-labelledby="rpe-heading"
    >
      {BANDS.map((band) => {
        const selected = value === band.value
        return (
          <button
            key={band.id}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => onChange(band.value)}
            className={[
              'flex min-h-[54px] flex-col items-center justify-center rounded-[12px] px-1 py-2 text-center transition-colors',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2',
              selected
                ? 'bg-accent text-white'
                : 'bg-bg-warm text-text-primary',
            ].join(' ')}
          >
            <span className="text-sm font-semibold leading-tight">{band.label}</span>
            <span
              className={[
                'mt-0.5 text-xs',
                selected ? 'text-white/90' : 'text-text-secondary',
              ].join(' ')}
            >
              {band.range}
            </span>
          </button>
        )
      })}
    </div>
  )
}
