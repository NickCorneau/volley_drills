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
}: RunControlsProps) {
  if (isPaused) {
    return (
      <div className="flex flex-col gap-3">
        <Button variant="primary" fullWidth onClick={onResume}>
          Resume
        </Button>
        <div className="flex gap-3">
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
    <div className="flex gap-3">
      <Button variant="outline" className="flex-1" onClick={onPause}>
        Pause
      </Button>
      <Button variant="primary" className="flex-1" onClick={onNext}>
        Next
      </Button>
    </div>
  )
}
