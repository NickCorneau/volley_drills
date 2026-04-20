import { formatTime } from '../lib/format'

/**
 * Phase F10 (2026-04-19): the `font-mono` utility now resolves to
 * JetBrains Mono Variable (see `--font-mono` in `src/index.css`)
 * instead of the OS-default mono fallback. The inline
 * `fontFeatureSettings: '"zero" 1'` opts into JetBrains Mono's
 * slashed-zero variant so the digit `0` cannot be confused with `O`
 * at a glance in bright sun — aligned with the outdoor-legibility
 * contract in `docs/research/outdoor-courtside-ui-brief.md`. Every
 * other class on the countdown div is unchanged from pre-F10; this
 * is purely a display-face swap. See
 * `docs/plans/2026-04-19-feat-phase-f10-timer-display-face-plan.md`.
 */
type BlockTimerProps = {
  remainingSeconds: number
  totalSeconds: number
  isPaused: boolean
}

export function BlockTimer({ remainingSeconds, totalSeconds, isPaused }: BlockTimerProps) {
  const progress = totalSeconds > 0 ? 1 - remainingSeconds / totalSeconds : 0

  return (
    <div className="flex flex-col items-center gap-3" role="timer" aria-live="polite">
      <div
        className="font-mono text-[56px] font-bold leading-none text-text-primary tabular-nums"
        style={{ fontFeatureSettings: '"zero" 1' }}
      >
        {formatTime(remainingSeconds)}
      </div>
      {isPaused && (
        // 2026-04-19 non-player tester feedback: the "Paused" pill alone
        // read as "the timer is broken" when the pause came from Swap
        // (or Shorten) rather than from an explicit Pause tap — the
        // tester didn't connect her Swap action to the stopped timer
        // and had to trial-and-error Resume. The actionable subtitle
        // makes the cause/effect legible without tracking pause-reason
        // state: any paused state, regardless of trigger, now carries
        // the same recovery instruction. See
        // `docs/research/2026-04-19-v0b-starter-loop-feedback.md`.
        <div className="flex flex-col items-center gap-1">
          <span className="text-sm font-semibold uppercase tracking-wide text-accent">
            Paused
          </span>
          <span className="text-xs text-text-secondary">
            Tap Resume to continue
          </span>
        </div>
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
