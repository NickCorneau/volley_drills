// V0B-01 / D120: Discrete 0-10 RPE chip grid.
//
// Replaces the v0a 4-band Easy/Moderate/Hard/Max collapse with an 11-chip
// 0-10 tappable grid plus sparse Borg anchors (`0 rest / 3 easy /
// 5 moderate / 7 hard / 10 max`). Single-tap selection; chips meet the
// courtside 54-60 px touch-target baseline (D8, UX-01).
//
// Why discrete chips and not a slider: slider controls produce higher
// nonresponse and lower mean scores than discrete buttons in survey
// experiments, and one-handed mobile targets perform better when they are
// big and discrete (NN/g ~1 cm minimum; Conradi 14x14 mm). Serious training
// precedent (TrainingPeaks 10-point, Garmin 1-10, Fitbod discrete per-exercise)
// supports discrete-grid over slider. See docs/specs/m001-review-micro-spec.md
// and docs/plans/2026-04-12-v0a-to-v0b-transition.md (V0B-01).
//
// Phase F11 (2026-04-19): anchor words moved out of the individual chips
// into a single legend rail below the grid. Pre-F11, five of the eleven
// chips (0, 3, 5, 7, 10) rendered a two-line anchor; the other six
// reserved a blank line to keep baselines aligned (F7). That produced an
// uneven visual rhythm — anchor words landed at irregular column
// positions (1/4/6 on row one, 2/5 on row two) and made anchored chips
// read heavier than unanchored ones, implying a tier the interaction
// model doesn't have. "MODERATE" also routinely overflowed its cell at
// the 54 px target width. The legend rail carries the full Borg scale
// as a single-line caption so every chip can collapse to a clean
// number, and the live `aria-label` on each button continues to carry
// "3, easy" etc. for screen readers.

const RPE_VALUES = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10] as const

// Sparse Borg anchors displayed beneath the grid. Semantic labels keyed by
// value so the control stays a primary numeric affordance and the anchors
// are supportive captions, not replacement vocabulary.
const ANCHORS: Record<number, string> = {
  0: 'rest',
  3: 'easy',
  5: 'moderate',
  7: 'hard',
  10: 'max',
}

const SELECTED_HINT: Record<number, string> = {
  0: 'No effort',
  1: 'Very light',
  2: 'Light',
  3: 'Easy',
  4: 'Moderate-easy',
  5: 'Moderate',
  6: 'Moderate-hard',
  7: 'Hard',
  8: 'Very hard',
  9: 'Near max',
  10: 'Max effort',
}

type RpeSelectorProps = {
  value: number | null
  onChange: (sessionRpe: number) => void
  /**
   * ID of the heading element labelling this control. Defaults to the
   * ReviewScreen heading (`rpe-heading`) but is overridable so the
   * component can be reused on other surfaces without silently losing its
   * label when a second instance renders. Red-team UX #13.
   */
  ariaLabelledBy?: string
}

export function RpeSelector({
  value,
  onChange,
  ariaLabelledBy = 'rpe-heading',
}: RpeSelectorProps) {
  return (
    <div className="flex flex-col gap-3">
      <div
        className="grid grid-cols-6 gap-2"
        role="radiogroup"
        aria-labelledby={ariaLabelledBy}
      >
        {RPE_VALUES.map((n) => {
          const selected = value === n
          const anchor = ANCHORS[n]
          return (
            <button
              key={n}
              type="button"
              role="radio"
              aria-checked={selected}
              aria-label={anchor ? `${n}, ${anchor}` : `${n}`}
              onClick={() => onChange(n)}
              className={[
                'flex min-h-[54px] items-center justify-center rounded-[12px] px-1 py-1 text-center transition-colors',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2',
                // Phase F11 (2026-04-19): RPE chips are clickable in
                // either state (tap to pick, tap a different chip to
                // change). Mirrors `QuickTagChips`: selected chips
                // darken via `accent-pressed`; unselected chips use
                // `brightness-*` so the warm base tone survives the
                // hover / press cue.
                selected
                  ? 'bg-accent text-white hover:bg-accent-pressed active:bg-accent-pressed'
                  : 'bg-bg-warm text-text-primary hover:brightness-95 active:brightness-90',
              ].join(' ')}
            >
              <span className="text-lg font-semibold leading-none tabular-nums">
                {n}
              </span>
            </button>
          )
        })}
      </div>
      {/* Legend rail. `aria-hidden` keeps this decorative — the per-
          button `aria-label` ("3, easy") is the sole accessible
          carrier of Borg anchor meaning. `flex-wrap` degrades
          gracefully on narrow screens: the rail breaks to a second
          line rather than clipping. 12 px (`text-xs`) is the
          principled minimum for decorative captions per the outdoor
          brief (`docs/research/outdoor-courtside-ui-brief.md`). */}
      <div
        aria-hidden="true"
        className="flex flex-wrap items-baseline justify-center gap-x-3 gap-y-1 text-xs text-text-secondary"
      >
        {RPE_VALUES.filter((n) => ANCHORS[n] !== undefined).flatMap(
          (n, i) => {
            const entry = (
              <span key={n} className="whitespace-nowrap">
                <span className="font-semibold tabular-nums text-text-primary">
                  {n}
                </span>{' '}
                {ANCHORS[n]}
              </span>
            )
            if (i === 0) return [entry]
            return [
              <span key={`sep-${n}`} className="text-text-secondary/60">
                &middot;
              </span>,
              entry,
            ]
          },
        )}
      </div>
      <p
        className="min-h-[1.25rem] text-center text-xs text-text-secondary"
        aria-live="polite"
      >
        {value !== null ? SELECTED_HINT[value] : 'Tap a number to rate effort'}
      </p>
    </div>
  )
}
