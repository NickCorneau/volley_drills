import { cx } from '../../lib/cn'

export type ToggleChipTone = 'accent' | 'warning' | 'success'
export type ToggleChipSize = 'lg' | 'sm'
export type ToggleChipShape = 'rounded' | 'pill'

export interface ToggleChipProps {
  label: string
  selected: boolean
  onTap: () => void
  /** Color treatment when `selected`. Defaults to `accent`. */
  tone?: ToggleChipTone
  /** `lg` = 54 px min height (default); `sm` = 48 px (nested rows). */
  size?: ToggleChipSize
  /** Rounded rectangle by default; pills fit short wrap rows. */
  shape?: ToggleChipShape
  /** Fill the available row cell by default. Disable for wrap rows. */
  fill?: boolean
  /** Optional aria-label override when the visible label is ambiguous. */
  ariaLabel?: string
  className?: string
}

const SIZE_CLASSES: Record<ToggleChipSize, string> = {
  lg: 'min-h-[54px] px-2 py-2 text-sm',
  sm: 'min-h-[48px] px-1 py-1 text-xs',
}

const SHAPE_CLASSES: Record<ToggleChipShape, Record<ToggleChipSize, string>> = {
  rounded: {
    lg: 'rounded-[16px]',
    sm: 'rounded-[12px]',
  },
  pill: {
    lg: 'rounded-full',
    sm: 'rounded-full',
  },
}

const SELECTED_TONE: Record<ToggleChipTone, string> = {
  accent: 'border-2 border-accent bg-info-surface text-accent focus-visible:ring-accent',
  warning: 'border-2 border-warning bg-warning-surface text-warning focus-visible:ring-warning',
  success: 'border-2 border-success bg-bg-warm text-success focus-visible:ring-success',
}

const UNSELECTED_TONE: Record<ToggleChipTone, string> = {
  accent:
    'border border-text-primary/10 bg-bg-primary text-text-secondary hover:bg-bg-warm active:bg-bg-warm focus-visible:ring-accent',
  warning:
    'border border-text-primary/10 bg-bg-primary text-text-secondary hover:bg-bg-warm active:bg-bg-warm focus-visible:ring-warning',
  success:
    'border border-text-primary/10 bg-bg-primary text-text-secondary hover:bg-bg-warm active:bg-bg-warm focus-visible:ring-success',
}

/**
 * Shared single-select chip used by Setup / Safety check groups.
 *
 * Unselected state is tone-neutral (quiet outline + warm hover);
 * selected state adopts the chosen `tone`. Pairs with a `role="radiogroup"`
 * container on the caller side.
 */
export function ToggleChip({
  label,
  selected,
  onTap,
  tone = 'accent',
  size = 'lg',
  shape = 'rounded',
  fill = true,
  ariaLabel,
  className,
}: ToggleChipProps) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      aria-label={ariaLabel}
      onClick={onTap}
      className={cx(
        fill && 'flex-1',
        'font-medium transition-colors',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1',
        SIZE_CLASSES[size],
        SHAPE_CLASSES[shape][size],
        selected ? SELECTED_TONE[tone] : UNSELECTED_TONE[tone],
        className,
      )}
    >
      {label}
    </button>
  )
}
