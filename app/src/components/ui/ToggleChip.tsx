import { cx } from '../../lib/cn'

export type ToggleChipTone = 'accent' | 'warning'
export type ToggleChipSize = 'lg' | 'sm'

export interface ToggleChipProps {
  label: string
  selected: boolean
  onTap: () => void
  /** Color treatment when `selected`. Defaults to `accent`. */
  tone?: ToggleChipTone
  /** `lg` = 54 px min height (default); `sm` = 48 px (nested rows). */
  size?: ToggleChipSize
  /** Optional aria-label override when the visible label is ambiguous. */
  ariaLabel?: string
}

const SIZE_CLASSES: Record<ToggleChipSize, string> = {
  lg: 'min-h-[54px] rounded-[16px] px-2 py-2 text-sm',
  sm: 'min-h-[48px] rounded-[12px] px-1 py-1 text-xs',
}

const SELECTED_TONE: Record<ToggleChipTone, string> = {
  accent:
    'border border-accent bg-info-surface text-accent focus-visible:ring-accent',
  warning:
    'border border-warning bg-warning-surface text-warning focus-visible:ring-warning',
}

const UNSELECTED_TONE: Record<ToggleChipTone, string> = {
  accent:
    'border border-gray-200 bg-bg-primary text-text-secondary hover:bg-bg-warm active:bg-bg-warm focus-visible:ring-accent',
  warning:
    'border border-gray-200 bg-bg-primary text-text-secondary hover:bg-bg-warm active:bg-bg-warm focus-visible:ring-warning',
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
  ariaLabel,
}: ToggleChipProps) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      aria-label={ariaLabel}
      onClick={onTap}
      className={cx(
        'flex-1 font-medium transition-colors',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1',
        SIZE_CLASSES[size],
        selected ? SELECTED_TONE[tone] : UNSELECTED_TONE[tone],
      )}
    >
      {label}
    </button>
  )
}
