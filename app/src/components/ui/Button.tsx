import type { ButtonHTMLAttributes } from 'react'
import { cx } from '../../lib/cn'

export type ButtonVariant =
  | 'primary'
  | 'outline'
  | 'secondary'
  | 'danger'
  | 'ghost'
  | 'soft'
  | 'link'

type ButtonProps = {
  variant?: ButtonVariant
  fullWidth?: boolean
} & ButtonHTMLAttributes<HTMLButtonElement>

const focusRing = 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2'

// Phase F11 (2026-04-19): hover states added to every clickable
// variant. The Phase F9 rollback correctly removed hover darkening
// from the whole-card `PRIMARY_CARD_CLASS` / `SECONDARY_ROW_CLASS`
// (cards aren't click targets), but individual `Button`s ARE click
// targets - so desktop-pointer users should get the same "yes, this
// is clickable" affordance that the Phase F7 `active:` states already
// give on press. Each variant pairs `hover:` with its existing
// `active:` token so hover and press land on the same darker shade;
// on mobile there is no hover pseudo-state, but `active:` still fires
// during the press-but-not-release window (mousedown / touchstart)
// and provides the tactile cue.
const variantStyles: Record<ButtonVariant, string> = {
  primary: cx(
    'min-h-[56px] rounded-[16px] px-4 py-3 text-sm font-semibold',
    'bg-accent text-white hover:bg-accent-pressed active:bg-accent-pressed',
    focusRing,
    'focus-visible:ring-accent',
  ),
  outline: cx(
    'min-h-[54px] rounded-[16px] px-4 py-3 text-sm font-semibold',
    'border-2 border-text-secondary/30 text-text-primary',
    'hover:bg-bg-warm active:bg-bg-warm',
    focusRing,
    'focus-visible:ring-accent',
  ),
  secondary: cx(
    'min-h-[54px] rounded-[12px] px-3 py-2 text-sm font-medium',
    'border border-text-secondary/20 text-text-primary',
    // Phase F7 (2026-04-19): press feedback to match `primary`,
    // `outline`, and `danger` - secondary + ghost were the two
    // variants with no tactile press state, so they felt dead
    // compared to the rest of the button family.
    // Phase F11 (2026-04-19): hover darkening mirrors the press
    // state so desktop pointers get the same clickability cue.
    'hover:bg-bg-warm active:bg-bg-warm',
    focusRing,
    'focus-visible:ring-accent',
  ),
  danger: cx(
    'min-h-[54px] rounded-[16px] px-4 py-3 text-sm font-semibold',
    'border-2 border-warning/30 bg-warning-surface text-warning',
    'hover:bg-warning/10 active:bg-warning/10',
    focusRing,
    'focus-visible:ring-warning',
  ),
  ghost: cx(
    'min-h-[54px] px-4 text-sm font-medium text-accent',
    // Phase F7 (2026-04-19): press feedback. Ghost has no background
    // to darken (by design - used inside HomeSecondaryRow and other
    // list rows that own their own surface), so darkening the accent
    // text color on press gives the tactile cue without adding a
    // visual box. Matches the `primary` variant's `accent-pressed`
    // convention.
    'hover:text-accent-pressed active:text-accent-pressed',
    focusRing,
    'focus-visible:ring-accent',
  ),
  soft: cx(
    'min-h-[54px] rounded-[16px] px-4 py-3 text-sm font-semibold',
    'bg-bg-warm text-text-primary',
    // Phase F11 (2026-04-19): `soft` was the only Button variant with
    // no hover or press feedback. Using the filter-based
    // `brightness-*` pair preserves the warm base tone (which a
    // `hover:bg-...` swap would replace) while still giving a
    // perceivable darken on pointer hover and during press.
    'hover:brightness-95 active:brightness-90',
    focusRing,
    'focus-visible:ring-accent',
  ),
  // Phase F9 (2026-04-19): tertiary text-link variant. Consolidates
  // the five inline text-link buttons scattered across
  // `HomePrimaryCard` (Skip review / Change setup / Start a
  // different session), `SkillLevelScreen` (Not sure yet), and
  // `ReviewScreen` (Finish later) onto a single shared treatment:
  // 44 px tap target, content-width with `mx-auto`, muted
  // text-secondary with a permanent underline at a comfortable
  // offset, and `active:text-text-primary` for press feedback.
  // Content-width (not full-width) signals tertiary intent against
  // the full-width primary CTA that usually sits just above.
  // Phase F11 (2026-04-19): matching `hover:text-text-primary` so a
  // desktop pointer gets the same "darken to primary" cue before the
  // click, not only during the press.
  link: cx(
    'min-h-[44px] mx-auto px-3',
    'text-sm font-medium text-text-secondary',
    'underline underline-offset-2',
    'hover:text-text-primary active:text-text-primary',
    focusRing,
    'focus-visible:ring-accent',
  ),
}

const disabledStyles: Record<ButtonVariant, string> = {
  primary: cx(
    // Disabled primary CTAs read as neutral "not yet", not lightly active.
    'cursor-not-allowed bg-text-secondary/10 text-text-secondary/70',
    'hover:bg-text-secondary/10 active:bg-text-secondary/10',
  ),
  outline: 'cursor-not-allowed opacity-50',
  secondary: 'cursor-not-allowed opacity-50',
  danger: 'cursor-not-allowed opacity-50',
  ghost: 'cursor-not-allowed opacity-50',
  soft: 'cursor-not-allowed opacity-50',
  link: 'cursor-not-allowed opacity-50',
}

export function Button({
  variant = 'primary',
  fullWidth,
  className,
  type = 'button',
  disabled,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled}
      className={cx(
        'transition-colors',
        variantStyles[variant],
        disabled && disabledStyles[variant],
        fullWidth && 'w-full',
        className,
      )}
      {...props}
    >
      {children}
    </button>
  )
}
