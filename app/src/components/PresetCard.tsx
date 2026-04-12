export type SessionPreset = {
  id: string
  name: string
  env: string
  desc: string
  playerCount: 1 | 2
}

type PresetCardProps = {
  preset: SessionPreset
  selected: boolean
  onSelect: () => void
}

export function PresetCard({ preset, selected, onSelect }: PresetCardProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={[
        'w-full min-h-[56px] rounded-[12px] bg-bg-warm px-4 py-3 text-left',
        'border-l-4 transition-colors',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2',
        selected ? 'border-l-accent shadow-sm' : 'border-l-transparent',
      ].join(' ')}
    >
      <div className="font-semibold text-text-primary">{preset.name}</div>
      <div className="mt-0.5 text-sm text-text-secondary">{preset.env}</div>
      <div className="mt-1 text-sm text-text-secondary">{preset.desc}</div>
    </button>
  )
}
