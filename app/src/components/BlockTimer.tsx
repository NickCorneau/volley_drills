import { formatTime } from '../lib/format'

/**
 * Phase F10 (2026-04-19): the `font-mono` utility now resolves to
 * JetBrains Mono Variable (see `--font-mono` in `src/index.css`)
 * instead of the OS-default mono fallback. The inline
 * `fontFeatureSettings: '"zero" 1'` opts into JetBrains Mono's
 * slashed-zero variant so the digit `0` cannot be confused with `O`
 * at a glance in bright sun - aligned with the outdoor-legibility
 * contract in `docs/research/outdoor-courtside-ui-brief.md`. Every
 * other class on the countdown div is unchanged from pre-F10; this
 * is purely a display-face swap. See
 * `docs/plans/2026-04-19-feat-phase-f10-timer-display-face-plan.md`.
 *
 * Pre-close 2026-04-21 (thought 3b from founder pre-close review):
 * when `remainingSeconds <= 3.5` the digits flip to accent color as
 * the visible half of the block-end 3-sec countdown. The audio half
 * (3 / 2 / 1 ticks + block-end beep) fires from `RunScreen`'s poll
 * loop. Outdoor-UI brief cue-stack invariant: "Visual first, always.
 * Audio is reinforcement." The `3.5` threshold (not `3`) ensures the
 * flip lands when `ceil(remaining)` is 3 - i.e. on the same frame the
 * audio tick for "3" fires - so visual and audio arrive together.
 *
 * 2026-04-26 progress-bar treatment (was reconciled-list item #8 /
 * design review A4): the bar height grew from `h-2` (~8 px) to
 * `h-3` (~12 px) so the bar reads as a real time signal at 2 m
 * courtside, not as decoration. The thicker bar is the surviving
 * half of the A4 design call.
 *
 * 2026-04-26 (post-ship reversal of the chip half of A4): the
 * trailing `"X:XX left"` chip that originally shipped alongside
 * the thicker bar has been removed. On the live Run screen the
 * digits are `text-[56px]` (Phase F10) and sit immediately above
 * the bar; the chip restated the same `formatTime(remaining)`
 * value the digits already carry, which read as a redundant time
 * string courtside ("3:53 / 3:53 left" — pick one). The bar at
 * `h-3` is thick enough to read as a relative-progress sense
 * without needing an explicit textual gloss; the digits remain the
 * primary read; the digits' accent flip in the final 3 seconds is
 * still the single visual countdown tick. Restraint over
 * redundancy. Future contributors: do NOT re-add the chip without
 * fresh courtside evidence that the bar alone fails. See
 * `docs/plans/2026-04-26-pre-d91-editorial-polish.md` Post-ship
 * amendment §"Item 7".
 */
type BlockTimerProps = {
  remainingSeconds: number
  totalSeconds: number
  isPaused: boolean
}

export function BlockTimer({ remainingSeconds, totalSeconds, isPaused }: BlockTimerProps) {
  const progress = totalSeconds > 0 ? 1 - remainingSeconds / totalSeconds : 0
  const isCountingDown =
    !isPaused && remainingSeconds > 0 && remainingSeconds <= 3.5

  return (
    <div className="flex flex-col items-center gap-3" role="timer" aria-live="polite">
      <div
        className={`font-mono text-[56px] font-bold leading-none tabular-nums transition-colors ${
          isCountingDown ? 'text-accent' : 'text-text-primary'
        }`}
        style={{ fontFeatureSettings: '"zero" 1' }}
        data-testid="block-timer-digits"
        data-countdown={isCountingDown ? 'true' : 'false'}
      >
        {formatTime(remainingSeconds)}
      </div>
      {isPaused && (
        // 2026-04-19 non-player tester feedback: the "Paused" pill alone
        // read as "the timer is broken" when the pause came from Swap
        // (or Shorten) rather than from an explicit Pause tap - the
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
      <div
        className="h-3 w-full overflow-hidden rounded-full bg-bg-warm"
        data-testid="block-timer-bar"
      >
        <div
          className="h-full rounded-full bg-accent"
          style={{ width: `${Math.min(100, progress * 100)}%` }}
        />
      </div>
    </div>
  )
}
