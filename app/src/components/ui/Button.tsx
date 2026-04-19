import type { ButtonHTMLAttributes } from 'react'
import { cx } from '../../lib/cn'

export type ButtonVariant =
  | 'primary'
  | 'outline'
  | 'secondary'
  | 'danger'
  | 'ghost'
  | 'soft'

type ButtonProps = {
  variant?: ButtonVariant
  fullWidth?: boolean
} & ButtonHTMLAttributes<HTMLButtonElement>

const focusRing =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2'

const variantStyles: Record<ButtonVariant, string> = {
  primary: cx(
    'min-h-[56px] rounded-[16px] px-4 py-3 text-base font-semibold',
    'bg-accent text-white active:bg-accent-pressed',
    'disabled:cursor-not-allowed disabled:opacity-50',
    focusRing,
    'focus-visible:ring-accent',
  ),
  outline: cx(
    'min-h-[54px] rounded-[16px] px-4 py-3 text-base font-semibold',
    'border-2 border-text-secondary/30 text-text-primary',
    'hover:bg-bg-warm active:bg-bg-warm',
    focusRing,
    'focus-visible:ring-accent',
  ),
  secondary: cx(
    'min-h-[54px] rounded-[12px] px-3 py-2 text-sm font-medium',
    'border border-text-secondary/20 text-text-primary',
    // Phase F7 (2026-04-19): press feedback to match `primary`,
    // `outline`, and `danger` — secondary + ghost were the two
    // variants with no tactile press state, so they felt dead
    // compared to the rest of the button family.
    'active:bg-bg-warm',
    focusRing,
    'focus-visible:ring-accent',
  ),
  danger: cx(
    'min-h-[54px] rounded-[16px] px-4 py-3 text-base font-semibold',
    'border-2 border-warning/30 bg-warning-surface text-warning',
    'active:bg-warning/10',
    focusRing,
    'focus-visible:ring-warning',
  ),
  ghost: cx(
    'min-h-[54px] px-4 text-sm font-medium text-accent',
    // Phase F7 (2026-04-19): press feedback. Ghost has no background
    // to darken (by design — used inside HomeSecondaryRow and other
    // list rows that own their own surface), so darkening the accent
    // text color on press gives the tactile cue without adding a
    // visual box. Matches the `primary` variant's `accent-pressed`
    // convention.
    'active:text-accent-pressed',
    focusRing,
    'focus-visible:ring-accent',
  ),
  soft: cx(
    'min-h-[54px] rounded-[16px] px-4 py-3 text-sm font-semibold',
    'bg-bg-warm text-text-primary',
    focusRing,
    'focus-visible:ring-accent',
  ),
}

export function Button({
  variant = 'primary',
  fullWidth,
  className,
  type = 'button',
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cx(
        'transition-colors',
        variantStyles[variant],
        fullWidth && 'w-full',
        className,
      )}
      {...props}
    >
      {children}
    </button>
  )
}
