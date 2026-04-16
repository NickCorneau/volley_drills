export type PlayerCount = 1 | 2

type PlayerToggleProps = {
  value: PlayerCount
  onChange: (value: PlayerCount) => void
}

export function PlayerToggle({ value, onChange }: PlayerToggleProps) {
  return (
    <div className="grid grid-cols-2 gap-3" role="group" aria-label="Players today">
      <button
        type="button"
        aria-pressed={value === 1}
        onClick={() => onChange(1)}
        className={[
          'min-h-[56px] rounded-[12px] px-4 py-3 text-center text-sm font-medium transition-colors',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2',
          value === 1 ? 'bg-accent text-white shadow-sm' : 'bg-bg-warm text-text-primary',
        ].join(' ')}
      >
        <span className="block font-semibold">Solo</span>
        <span className="block text-xs opacity-90">1 player</span>
      </button>
      <button
        type="button"
        aria-pressed={value === 2}
        onClick={() => onChange(2)}
        className={[
          'min-h-[56px] rounded-[12px] px-4 py-3 text-center text-sm font-medium transition-colors',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2',
          value === 2 ? 'bg-accent text-white shadow-sm' : 'bg-bg-warm text-text-primary',
        ].join(' ')}
      >
        <span className="block font-semibold">Pair</span>
        <span className="block text-xs opacity-90">2 players</span>
      </button>
    </div>
  )
}
