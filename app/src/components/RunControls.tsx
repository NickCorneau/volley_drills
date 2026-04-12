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

const btnBase =
  'rounded-[16px] px-4 py-3 text-base font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2'
const btnPrimary = `${btnBase} min-h-[54px] w-full bg-accent text-white active:bg-accent-pressed`
const btnOutline = `${btnBase} min-h-[54px] flex-1 border-2 border-text-secondary/30 text-text-primary`
const btnSecondary =
  'min-h-[44px] flex-1 rounded-[12px] border border-text-secondary/20 px-3 py-2 text-sm font-medium text-text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2'

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
        <button type="button" onClick={onResume} className={btnPrimary}>
          Resume
        </button>
        <div className="flex gap-3">
          <button type="button" onClick={onShorten} className={btnSecondary}>
            Shorten
          </button>
          {!isRequired && (
            <button type="button" onClick={onSkip} className={btnSecondary}>
              Skip Block
            </button>
          )}
          <button
            type="button"
            onClick={onEndSession}
            className={`${btnSecondary} border-warning/20 text-warning`}
          >
            End Session
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex gap-3">
      <button type="button" onClick={onPause} className={btnOutline}>
        Pause
      </button>
      <button
        type="button"
        onClick={onNext}
        className={`${btnBase} min-h-[54px] flex-1 bg-accent text-white active:bg-accent-pressed`}
      >
        Next
      </button>
    </div>
  )
}
