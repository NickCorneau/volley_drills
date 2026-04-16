const QUICK_TAGS = ['Too easy', 'About right', 'Too hard', 'Need partner'] as const

type QuickTagChipsProps = {
  selected: string[]
  onChange: (tags: string[]) => void
}

export function QuickTagChips({ selected, onChange }: QuickTagChipsProps) {
  const toggle = (tag: string) => {
    if (selected.includes(tag)) {
      onChange(selected.filter((t) => t !== tag))
    } else {
      onChange([...selected, tag])
    }
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
