import { formatTime } from '../lib/format'

type BlockTimerProps = {
  remainingSeconds: number
  totalSeconds: number
  isPaused: boolean
}

export function BlockTimer({ remainingSeconds, totalSeconds, isPaused }: BlockTimerProps) {
  const progress = totalSeconds > 0 ? 1 - remainingSeconds / totalSeconds : 0

  return (
    <div className="flex flex-col items-center gap-3" role="timer" aria-live="polite">
      <div className="font-mono text-[56px] font-bold leading-none text-text-primary tabular-nums">
        {formatTime(remainingSeconds)}
      </div>
      {isPaused && (
        <span className="text-sm font-semibold uppercase tracking-wide text-accent">Paused</span>
      )}
      <div className="h-2 w-full overflow-hidden rounded-full bg-bg-warm">
        <div
          className="h-full rounded-full bg-accent"
          style={{ width: `${Math.min(100, progress * 100)}%` }}
        />
      </div>
    </div>
  )
}
