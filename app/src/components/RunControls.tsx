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
   * Phase F Unit 4 (2026-04-19): mid-run drill Swap. Optional prop —
   * parent (RunScreen) passes `undefined` when the current block has
   * no available alternates (warmup / wrap slots per D85/D105, or a
   * context with a single candidate in the slot pool). When absent
   * the button is hidden; the spec requires Swap be a first-class
   * courtside action only when it can succeed. See
   * `docs/specs/m001-courtside-run-flow.md` §3 and the Phase F plan
   * Unit 4 requirements.
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
    return (
      <div className="flex flex-col gap-3">
        <Button variant="primary" fullWidth onClick={onResume}>
          Resume
        </Button>
        <div className="flex gap-3">
          {onSwap && (
            <Button variant="secondary" className="flex-1" onClick={onSwap}>
              Swap
            </Button>
          )}
          <Button variant="secondary" className="flex-1" onClick={onShorten}>
            Shorten
          </Button>
          {!isRequired && (
            <Button variant="secondary" className="flex-1" onClick={onSkip}>
              Skip Block
            </Button>
          )}
          <Button
            variant="secondary"
            className="flex-1 border-warning/20 text-warning"
            onClick={onEndSession}
          >
            End Session
          </Button>
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
        <Button
          variant="secondary"
          fullWidth
          onClick={onSwap}
          aria-label="Swap drill"
        >
          Swap drill
        </Button>
      )}
    </div>
  )
}
