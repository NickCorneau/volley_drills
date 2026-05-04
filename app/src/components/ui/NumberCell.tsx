import { useId, useState } from 'react'
import { cx } from '../../lib/cn'

export type NumberCellProps = {
  /**
   * Visible label rendered above the input. Acts as the accessible name
   * via `<label htmlFor>`.
   */
  label: string
  /**
   * The committed numeric value owned by the parent. Renders as the
   * placeholder when `value === 0` (the empty-zero rule, see notes).
   */
  value: number
  /**
   * Called with the parsed number when the user blurs the field or
   * presses Enter. The cell does NOT forward each keystroke; only the
   * commit fires.
   *
   * If `validate` is provided, the parent sees the validated/clamped
   * result. If `validate` returns `null`, the cell shows
   * `invalidMessage` and calls `onCommit(null)` so the parent can
   * skip persisting; the typed text stays visible so the user can fix it.
   */
  onCommit: (next: number | null) => void
  /**
   * Optional transform / reject hook applied at commit time. Return the
   * (clamped/transformed) integer to commit, or `null` to reject.
   * PassMetricInput uses this to clamp Good ≤ Total; PerDrillCapture
   * uses it to range-check the streak via `validateStreakLongest`.
   *
   * When omitted, the parsed integer commits unchanged (subject to the
   * non-negative + integer-shape check below).
   */
  validate?: (parsed: number) => number | null
  disabled?: boolean
  /**
   * Placeholder text for the empty (committed-zero) state. Defaults to `'0'`
   * — courtside readers see a faint zero so the slot reads as "no value
   * yet" rather than "empty form field."
   */
  placeholder?: string
  /**
   * Surfaced beneath the input when `validate` returns `null` for
   * non-empty input. Stays empty otherwise. Empty input never triggers
   * this — empty commits as `null` silently.
   */
  invalidMessage?: string
  /**
   * Optional helper paragraph rendered below the input (and below the
   * invalid message when present). Use for inline guidance like
   * "Leave blank if unsure."
   */
  helperText?: string
  /** Forwarded to the input element. */
  testId?: string
  /**
   * Appended to the input className. Lets the caller tune width / height
   * for tighter grids while keeping the cell's chrome intact.
   */
  inputClassName?: string
}

const DEFAULT_INPUT_CLASS =
  'h-16 w-28 rounded-[12px] border-2 border-text-primary/20 bg-bg-primary text-center text-3xl font-bold tabular-nums text-text-primary placeholder:text-text-primary/30 focus-visible:border-accent focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-40'

/**
 * Plan U10 (2026-05-04): the canonical large-numeric tap-to-type input.
 * Replaces the parallel implementations in `PassMetricInput.NumberCell`
 * and `PerDrillCapture.StreakInput`.
 *
 * # Empty-zero rule
 *
 * `value === 0` renders as an empty input + placeholder (default `'0'`)
 * instead of the literal string `'0'`. Pre-fix, a fresh capture surface
 * rendered "0" / "0" centered in both Good and Total cells, which on
 * first glance read as "the user already entered zero" rather than "no
 * value yet" (a recurring partner-walkthrough misread that made the
 * screen feel prefilled). The empty-string-commits-to-0 invariant is
 * preserved by `commit()`: an empty blur calls `onCommit(0)` so the
 * parent's domain value lands at `0` even though the field stays
 * visually empty.
 *
 * # Local text state and the resync effect
 *
 * Local `text` state lets the user type a partial value (empty string,
 * leading zero, etc.) without the parent's `value` fighting them
 * mid-edit. When the parent's `value` changes (notCaptured toggle, Good
 * auto-bumped Total, draft rehydration), the effect re-syncs the
 * displayed text. This shape is approved under the eslint
 * `react-hooks/set-state-in-effect` rule because the derivation is
 * purely from the prop, not from `prev` state.
 *
 * # Integer-shape and validate hook
 *
 * The cell up-front rejects non-integer-shaped strings (e.g. `1.5`,
 * `-3`, `5e2`, `5px`); `parseInt` would silently truncate `1.5` to `1`,
 * hiding the input mistake. After the integer check, the optional
 * `validate` hook can further clamp/reject. PassMetricInput passes a
 * clamp-to-good lambda; PerDrillCapture's StreakInput passes
 * `validateStreakLongest`.
 *
 * Empty input commits `null` silently; the parent decides whether to
 * persist a row or not.
 */
export function NumberCell({
  label,
  value,
  onCommit,
  validate,
  disabled,
  placeholder = '0',
  invalidMessage,
  helperText,
  testId,
  inputClassName,
}: NumberCellProps) {
  const id = useId()
  const helperId = useId()
  const errorId = useId()

  const [text, setText] = useState(() => valueToDisplayText(value))
  const [showInvalid, setShowInvalid] = useState(false)

  // React "adjust state during render" pattern for syncing local text
  // when the parent's controlled value changes (rehydration, swap, auto-bump,
  // notCaptured toggle, etc). Tracking a snapshot of the prop and reacting
  // to changes during render — instead of inside `useEffect` — passes the
  // React 19 `react-hooks/set-state-in-effect` rule (which rejects
  // setState-in-effect even when purely derived from a prop). When the
  // parent's value changes we ALSO clear `showInvalid`: a fresh value
  // implies a successful commit (or upstream rehydration) so any prior
  // "Use a whole number" correction is no longer relevant.
  // See https://react.dev/learn/you-might-not-need-an-effect#adjusting-some-state-when-a-prop-changes
  const [valueSnapshot, setValueSnapshot] = useState(value)
  if (value !== valueSnapshot) {
    setValueSnapshot(value)
    setText(valueToDisplayText(value))
    setShowInvalid(false)
  }

  const commit = () => {
    const trimmed = text.trim()
    if (trimmed === '') {
      onCommit(null)
      setShowInvalid(false)
      return
    }
    if (!/^\d+$/.test(trimmed)) {
      onCommit(null)
      setShowInvalid(true)
      return
    }
    const parsed = Number.parseInt(trimmed, 10)
    if (Number.isNaN(parsed)) {
      setText(valueToDisplayText(value))
      return
    }
    if (validate) {
      const validated = validate(parsed)
      if (validated === null) {
        onCommit(null)
        setShowInvalid(true)
        return
      }
      setShowInvalid(false)
      onCommit(validated)
      return
    }
    setShowInvalid(false)
    onCommit(parsed)
  }

  const describedByIds = [helperText ? helperId : null, showInvalid ? errorId : null]
    .filter((s): s is string => s !== null)
    .join(' ')

  return (
    <div className="flex flex-col items-center gap-2">
      <label htmlFor={id} className="text-sm font-medium text-text-primary">
        {label}
      </label>
      <input
        id={id}
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        value={text}
        placeholder={placeholder}
        disabled={disabled}
        aria-describedby={describedByIds || undefined}
        aria-invalid={showInvalid}
        data-testid={testId}
        onChange={(e) => setText(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault()
            ;(e.target as HTMLInputElement).blur()
          }
        }}
        className={cx(DEFAULT_INPUT_CLASS, inputClassName)}
      />
      {showInvalid && invalidMessage && (
        <p id={errorId} className="text-sm text-text-secondary">
          {invalidMessage}
        </p>
      )}
      {helperText && (
        <p id={helperId} className="text-sm text-text-secondary">
          {helperText}
        </p>
      )}
    </div>
  )
}

/**
 * `0` renders as an empty input + placeholder; any other numeric value
 * renders as its decimal string. Centralized so the `useState` initializer
 * and the `useEffect` resync use exactly the same mapping.
 */
function valueToDisplayText(value: number): string {
  return value === 0 ? '' : String(value)
}
