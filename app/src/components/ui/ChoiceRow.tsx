import { cx } from '../../lib/cn'
import { ToggleChip, type ToggleChipSize, type ToggleChipTone } from './ToggleChip'

/**
 * One choosable option in a `ChoiceRow`. Per-option `tone` overrides the
 * row's `defaultTone` (the SafetyCheckScreen Recency row's `0 days` chip
 * uses `tone: 'warning'` while siblings render with `accent`).
 */
export type ChoiceRowOption<T extends string> = {
  value: T
  label: string
  tone?: ToggleChipTone
  size?: ToggleChipSize
  ariaLabel?: string
}

export type ChoiceRowLayout = 'flex' | 'grid-2' | 'grid-3'

/**
 * Common props shared across the ChoiceRow API. Aria labelling is split
 * into the two mutually-exclusive shapes below so callers can't supply
 * both / neither at compile time (TypeScript narrowing enforces exactly
 * one).
 */
type ChoiceRowBaseProps<T extends string> = {
  value: T | null
  /**
   * Called with the tapped option's value. Wrap in the parent if you
   * want deselect-on-retap behavior (`IncompleteReasonChips` does this:
   * `onChange={(next) => onChange(value === next ? null : next)}`).
   */
  onChange: (next: T) => void
  options: readonly ChoiceRowOption<T>[]
  /**
   * `'flex'` (default) renders chips with `flex-1` width inside a
   * `flex gap-2` row. `'grid-2'` / `'grid-3'` render in a CSS grid; in
   * those layouts the chips are forced to `min-w-0 w-full` and their
   * `flex-1` is dropped so short-label chips (RpeSelector's
   * Easy/Right/Hard) still fill their cells.
   */
  layout?: ChoiceRowLayout
  /**
   * Tone applied when an option doesn't carry its own `tone`. Defaults
   * to `'accent'`. Per-option `tone` always wins.
   */
  defaultTone?: ToggleChipTone
  /** Adds to the wrapping `<div role="radiogroup">` className. */
  className?: string
}

type ChoiceRowAriaLabelProps = { ariaLabel: string; ariaLabelledBy?: never }
type ChoiceRowAriaLabelledByProps = { ariaLabel?: never; ariaLabelledBy: string }

export type ChoiceRowProps<T extends string> = ChoiceRowBaseProps<T> &
  (ChoiceRowAriaLabelProps | ChoiceRowAriaLabelledByProps)

const LAYOUT_CLASSES: Record<ChoiceRowLayout, string> = {
  flex: 'flex gap-2',
  'grid-2': 'grid grid-cols-2 gap-2',
  'grid-3': 'grid grid-cols-3 gap-2',
}

/**
 * Plan U3 (2026-05-04): atomic primitive for the `<div role="radiogroup">
 * + .map(ToggleChip)` pattern that was inlined across 8+ call sites
 * (SetupScreen ×5, SafetyCheckScreen ×2, TuneTodayScreen, RpeSelector,
 * IncompleteReasonChips, PerDrillCapture). Sibling to `ChoiceSection`
 * — `ChoiceSection` owns heading + description + footnote + opaque
 * children; `ChoiceRow` owns the chip-row body and its accessibility
 * wiring.
 *
 * The radiogroup role and the `aria-label` / `aria-labelledby` link
 * become structural here instead of caller-courtesy. The ESLint guardrail
 * in plan U12 will fail at edit time if `role="radiogroup"` reappears
 * outside this component.
 */
export function ChoiceRow<T extends string>({
  value,
  onChange,
  options,
  layout = 'flex',
  defaultTone = 'accent',
  ariaLabel,
  ariaLabelledBy,
  className,
}: ChoiceRowProps<T>) {
  const isGrid = layout !== 'flex'
  return (
    <div
      role="radiogroup"
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledBy}
      className={cx(LAYOUT_CLASSES[layout], className)}
    >
      {options.map((opt) => (
        <ToggleChip
          key={opt.value}
          label={opt.label}
          selected={value === opt.value}
          onTap={() => onChange(opt.value)}
          tone={opt.tone ?? defaultTone}
          size={opt.size}
          ariaLabel={opt.ariaLabel}
          // In grid layouts, drop `flex-1` (it's a no-op on grid parents
          // and stops short-label chips from filling cells via `w-full`).
          // In flex layouts, keep `fill=true` so chips share row width.
          fill={!isGrid}
          className={isGrid ? 'min-w-0 w-full' : undefined}
        />
      ))}
    </div>
  )
}
