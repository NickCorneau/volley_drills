// Effort tags are a "how did that feel" pick-one signal — "Too easy" and
// "Too hard" being selected together corrupts downstream summarisation.
// Keep them mutually exclusive. Independent tags (e.g. "Need partner") are
// additive context and stay multi-select. Red-team UX #11.
const EFFORT_TAGS = ['Too easy', 'About right', 'Too hard'] as const
const INDEPENDENT_TAGS = ['Need partner'] as const
const QUICK_TAGS: readonly string[] = [...EFFORT_TAGS, ...INDEPENDENT_TAGS]

type QuickTagChipsProps = {
  selected: string[]
  onChange: (tags: string[]) => void
}

export function QuickTagChips({ selected, onChange }: QuickTagChipsProps) {
  const toggle = (tag: string) => {
    const isEffort = (EFFORT_TAGS as readonly string[]).includes(tag)
    if (selected.includes(tag)) {
      onChange(selected.filter((t) => t !== tag))
      return
    }
    if (isEffort) {
      const withoutEffort = selected.filter(
        (t) => !(EFFORT_TAGS as readonly string[]).includes(t),
      )
      onChange([...withoutEffort, tag])
      return
    }
    onChange([...selected, tag])
  }

  return (
    <div className="flex flex-wrap gap-2" role="group" aria-label="Quick tags">
      {QUICK_TAGS.map((tag) => {
        const isOn = selected.includes(tag)
        return (
          <button
            key={tag}
            type="button"
            aria-pressed={isOn}
            onClick={() => toggle(tag)}
            className={[
              'min-h-[54px] rounded-full px-4 py-2 text-sm font-semibold transition-colors',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2',
              isOn ? 'bg-accent text-white' : 'bg-bg-warm text-text-primary',
            ].join(' ')}
          >
            {tag}
          </button>
        )
      })}
    </div>
  )
}
