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
        <p className="text-center text-base font-semibold text-accent">
          {rate}% good pass rate
        </p>
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
  const [text, setText] = useState(() => String(value))

  // Keep local text in sync when the parent's value changes (e.g.
  // notCaptured toggled, Good auto-bumped Total, or draft rehydration).
  useEffect(() => {
    setText(String(value))
  }, [value])

  const commit = () => {
    if (text.trim() === '') {
      onCommit(0)
      setText(String(0))
      return
    }
    const parsed = Number.parseInt(text, 10)
    if (Number.isNaN(parsed)) {
      setText(String(value))
      return
    }
    onCommit(parsed)
    // The parent will push its clamped value back through the useEffect
    // above, so no manual setText here - this avoids a stale-text flash.
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <label
        htmlFor={id}
        className="text-sm font-medium text-text-primary"
      >
        {label}
      </label>
      <input
        id={id}
        type="number"
        inputMode="numeric"
        pattern="[0-9]*"
        value={text}
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
        className="h-16 w-28 rounded-[12px] border-2 border-text-primary/20 bg-bg-primary text-center text-3xl font-bold tabular-nums text-text-primary focus-visible:border-accent focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-40"
      />
    </div>
  )
}
