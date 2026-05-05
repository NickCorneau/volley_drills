import { Button } from './ui'

type RunControlsProps = {
  isPaused: boolean
  isRequired: boolean
  onPause: () => void
  onResume: () => void
  onNext: () => void
  onSkip: () => void
  onShorten: () => void
  onEndSession: () => void
  /**
   * Phase F Unit 4 (2026-04-19): mid-run drill Swap. Optional prop -
   * parent (RunScreen) passes `undefined` when the current block has
   * no available alternates (warmup / wrap slots per D85/D105, or a
   * context with a single candidate in the slot pool). When absent
   * the button is hidden; the spec requires Swap be a first-class
   * courtside action only when it can succeed. See
   * `docs/specs/m001-courtside-run-flow.md` §3 and the Phase F plan
   * Unit 4 requirements.
   *
   * 2026-04-21 (founder pre-close review): a preview label showing
   * the next alternate's shortName (`Swap → {name}`) was prototyped
   * and rolled back. Seb's Pass 1 Q7: "Right gesture, felt intuitive."
   * The 13-swap frustration logged as P1-3 was script-induced (Task 2
   * asked him to reach serving content `solo_open` doesn't carry),
   * not a Swap-UX failure. Fixing the button on script-induced signal
   * risked distorting a control the partner actively liked. The
   * preview label, an undo toast, and a mid-run picker all stay
   * parked until there's an actual Swap-UX signal in the founder-use
   * ledger (swap-regret, "didn't know what it would do," or similar).
   */
  onSwap?: () => void
}

export function RunControls({
  isPaused,
  isRequired,
  onPause,
  onResume,
  onNext,
  onSkip,
  onShorten,
  onEndSession,
  onSwap,
}: RunControlsProps) {
  if (isPaused) {
    const pausedActions = [
      onSwap && {
        key: 'swap',
        label: 'Swap',
        onClick: onSwap,
      },
      {
        key: 'shorten',
        label: 'Shorten',
        onClick: onShorten,
      },
      !isRequired && {
        key: 'skip',
        label: 'Skip block',
        onClick: onSkip,
      },
      {
        key: 'end',
        label: 'End session',
        onClick: onEndSession,
        className: 'border-warning/20 text-warning',
      },
    ].filter(Boolean) as Array<{
      key: string
      label: string
      onClick: () => void
      className?: string
    }>
    const gridColumns =
      pausedActions.length >= 4
        ? 'grid-cols-4 gap-2'
        : pausedActions.length === 3
          ? 'grid-cols-3 gap-2'
          : 'grid-cols-2 gap-3'
    const compactButtonClass =
      pausedActions.length >= 4 ? 'min-w-0 whitespace-nowrap px-2 text-xs' : 'min-w-0'

    return (
      <div className="flex flex-col gap-3">
        <Button variant="primary" fullWidth onClick={onResume}>
          Resume
        </Button>
        <div className={`grid ${gridColumns}`}>
          {pausedActions.map((action) => (
            <Button
              key={action.key}
              variant="secondary"
              className={`${compactButtonClass} ${action.className ?? ''}`}
              onClick={action.onClick}
            >
              {action.label}
            </Button>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-3">
        <Button variant="outline" className="flex-1" onClick={onPause}>
          Pause
        </Button>
        <Button variant="primary" className="flex-1" onClick={onNext}>
          Next
        </Button>
      </div>
      {onSwap && (
        <Button variant="secondary" fullWidth onClick={onSwap} aria-label="Swap drill">
          Swap drill
        </Button>
      )}
    </div>
  )
}
