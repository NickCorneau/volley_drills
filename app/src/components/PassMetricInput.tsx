import { useEffect, useId, useState } from 'react'

type PassMetricInputBaseProps = {
  good: number
  total: number
  onGoodChange: (next: number) => void
  onTotalChange: (next: number) => void
}

/**
 * C-1 Unit 7 / R8: when the tester couldn't cleanly count reps, this
 * chip tags the review with `quickTags: ['notCaptured']` and zeros the
 * metric. Submit is still gated on RPE only.
 *
 * The chip and its state are paired (kieran-typescript finding K-TS-3):
 * a caller that passes only one half accidentally leaves the input in
 * a disabled / un-recoverable state. The discriminated union forces
 * callers to pass both or neither.
 */
type PassMetricInputProps = PassMetricInputBaseProps &
  (
    | { notCaptured?: undefined; onToggleNotCaptured?: undefined }
    | { notCaptured: boolean; onToggleNotCaptured: () => void }
  )

/**
 * V0B-02 / B5 / H13 (red-team fix plan v3): tap-to-type is the SOLE
 * pass-metric control on the Review screen. No +, no -, no ±5 / ±10.
 * One control, one interaction pattern - adding a third pattern is the
 * thesis-extension H6 that H13 explicitly rules out.
 *
 * Uses a numeric `<input>` with `inputMode="numeric"` + `pattern="[0-9]*"`
 * so iOS raises the numeric keypad. Commit happens on blur or Enter;
 * typing `good > total` auto-bumps `total` to match at commit time
 * (preserving the invariant that `good <= total`). Negatives clamp to 0.
 */
export function PassMetricInput({
  good,
  total,
  onGoodChange,
  onTotalChange,
  notCaptured = false,
  onToggleNotCaptured,
}: PassMetricInputProps) {
  const rate = total > 0 ? Math.round((good / total) * 100) : null

  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-2 gap-4">
        <NumberCell
          label="Good"
          value={good}
          disabled={notCaptured}
          onCommit={(next) => {
            const clamped = Math.max(0, next)
            if (clamped > total) onTotalChange(clamped)
            onGoodChange(clamped)
          }}
        />
        <NumberCell
          label="Total"
          value={total}
          disabled={notCaptured}
          onCommit={(next) => {
            const clamped = Math.max(good, Math.max(0, next))
            onTotalChange(clamped)
          }}
        />
      </div>
      {rate != null && !notCaptured && (
        <p className="text-center text-sm font-semibold text-accent">{rate}% good pass rate</p>
      )}
      {onToggleNotCaptured && (
        <button
          type="button"
          onClick={onToggleNotCaptured}
          aria-pressed={notCaptured}
          className={[
            'mx-auto min-h-[44px] rounded-[12px] px-4 py-2 text-sm font-medium transition-colors',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent',
            notCaptured
              ? 'border border-accent bg-info-surface text-accent'
              : 'text-text-secondary underline-offset-2 hover:underline',
          ].join(' ')}
        >
          Couldn&rsquo;t capture reps this time
        </button>
      )}
    </div>
  )
}

/**
 * 2026-04-26 pre-D91 editorial polish (`F7`): `0` renders as an
 * empty input + `placeholder="0"`; any other numeric value renders
 * as its decimal string. Centralized so the `useState` initializer
 * and the `useEffect` resync use exactly the same mapping (and so
 * the rule reads in one place if the contract is ever revisited).
 */
function valueToDisplayText(value: number): string {
  return value === 0 ? '' : String(value)
}

function NumberCell({
  label,
  value,
  disabled,
  onCommit,
}: {
  label: string
  value: number
  disabled: boolean
  onCommit: (next: number) => void
}) {
  const id = useId()
  // Local text state so the user can type a partial value (empty string,
  // leading zero, etc.) without the parent's `value` fighting them mid-edit.
  //
  // 2026-04-26 pre-D91 editorial polish (`F7`): zero is rendered as
  // an empty input with `placeholder="0"` instead of the literal
  // string `"0"`. Pre-fix, a fresh Review screen rendered "0" / "0"
  // centered in both Good and Total cells, which on first glance
  // read as "the user already entered zero" rather than "no value
  // yet" (a recurring partner-walkthrough misread that made the
  // screen feel prefilled).
  //
  // The empty-string-commits-to-0 invariant is preserved by
  // `commit()` below: an empty blur calls `onCommit(0)` so the
  // parent's domain value lands at `0` even though the field stays
  // visually empty. Whenever the parent reports `value === 0` —
  // first mount, notCaptured toggle, negative clamp, draft
  // rehydration, or auto-bump — we render the placeholder. The
  // placeholder text is itself "0", so a courtside reader still
  // sees a "0" sign in the field; only the visual weight changes
  // (greyed placeholder vs. bold typed text). See
  // `docs/plans/2026-04-26-pre-d91-editorial-polish.md` Item 3.
  const [text, setText] = useState(() => valueToDisplayText(value))

  // Keep local text in sync when the parent's value changes (e.g.
  // notCaptured toggled, Good auto-bumped Total, or draft rehydration).
  // The eslint `react-hooks/set-state-in-effect` rule accepts this
  // shape (deriving the next state purely from a prop, not from
  // `prev`); the previous callback-form variant tripped the rule.
  useEffect(() => {
    setText(valueToDisplayText(value))
  }, [value])

  const commit = () => {
    if (text.trim() === '') {
      onCommit(0)
      // Stay empty-rendered: the parent will re-push `value === 0`
      // through the effect above, which `valueToDisplayText` maps to
      // `''` so the placeholder remains visible.
      return
    }
    const parsed = Number.parseInt(text, 10)
    if (Number.isNaN(parsed)) {
      setText(valueToDisplayText(value))
      return
    }
    onCommit(parsed)
    // The parent will push its clamped value back through the useEffect
    // above, so no manual setText here - this avoids a stale-text flash.
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <label htmlFor={id} className="text-sm font-medium text-text-primary">
        {label}
      </label>
      <input
        id={id}
        type="number"
        inputMode="numeric"
        pattern="[0-9]*"
        value={text}
        placeholder="0"
        disabled={disabled}
        min={0}
        onChange={(e) => setText(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault()
            ;(e.target as HTMLInputElement).blur()
          }
        }}
        className="h-16 w-28 rounded-[12px] border-2 border-text-primary/20 bg-bg-primary text-center text-3xl font-bold tabular-nums text-text-primary placeholder:text-text-primary/30 focus-visible:border-accent focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-40"
      />
    </div>
  )
}
