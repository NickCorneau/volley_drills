import { useState, type ReactNode } from 'react'
import { cx } from '../../lib/cn'

export type ExpanderProps = {
  /**
   * Trigger content rendered inside the toggle button. Caller owns the
   * styling (icon + label composition varies — SafetyCheckScreen uses
   * a heat icon + "Heat & safety tips"). The chevron is appended by
   * `Expander` itself.
   */
  trigger: ReactNode
  /** Content shown when expanded; hidden when collapsed. */
  children: ReactNode
  /** Optional override for the toggle button's accessible name. */
  ariaLabel?: string
  /**
   * Optional callback that fires whenever the open state flips. Used by
   * SafetyCheckScreen to surface the heat-expander engagement signal as
   * `heatCta` on session creation; otherwise omit and let `Expander`
   * own its open state silently.
   */
  onOpenChange?: (open: boolean) => void
  /** Appended to the trigger button's className. */
  triggerClassName?: string
  /** Appended to the children-wrapper className. */
  contentClassName?: string
}

/**
 * Plan U7 (2026-05-04): collapse/expand with the trigger STAYING VISIBLE.
 * Used by SafetyCheckScreen's "Heat & safety tips" disclosure.
 *
 * Distinct from `Disclosure` (sibling primitive) where the trigger is
 * REPLACED by the children on expand. The two shapes are deliberately
 * separate primitives — don't unify behind a `replaceTrigger` prop.
 *
 * Wires `aria-expanded` on the trigger and rotates the chevron 180°
 * when open (matches existing SafetyCheckScreen behavior).
 */
export function Expander({
  trigger,
  children,
  ariaLabel,
  onOpenChange,
  triggerClassName,
  contentClassName,
}: ExpanderProps) {
  const [open, setOpen] = useState(false)

  const handleToggle = () => {
    setOpen((prev) => {
      const next = !prev
      onOpenChange?.(next)
      return next
    })
  }

  return (
    <>
      <button
        type="button"
        onClick={handleToggle}
        aria-expanded={open}
        aria-label={ariaLabel}
        className={cx(
          'flex min-h-[54px] items-center gap-2 text-sm font-medium text-accent transition-colors hover:text-accent-pressed active:text-accent-pressed',
          triggerClassName,
        )}
      >
        {trigger}
        <span className={cx('transition-transform', open && 'rotate-180')} aria-hidden>
          ▾
        </span>
      </button>
      {open && <div className={cx('mt-3', contentClassName)}>{children}</div>}
    </>
  )
}
