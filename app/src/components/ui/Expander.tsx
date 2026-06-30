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
    // Compute the next state and fire the side effect OUTSIDE the
    // `setOpen` updater. Calling `onOpenChange` inside the updater ran a
    // parent `setState` (SafetyCheckScreen's heatCta) during render,
    // which React flags as "Cannot update a component while rendering a
    // different component." The updater must stay pure.
    const next = !open
    setOpen(next)
    onOpenChange?.(next)
  }

  return (
    <>
      <button
        type="button"
        onClick={handleToggle}
        aria-expanded={open}
        aria-label={ariaLabel}
        className={cx(
          // Calm settings-list row: full width with the chevron pushed to
          // the right edge, and quiet secondary ink rather than accent.
          // Accent is reserved for primary action/status (brand §2); a
          // disclosure is secondary by nature, so it should not compete with
          // the screen's CTA. Callers house Expanders in one contained list
          // surface (see SafetyCheckScreen) so the rows read as a group.
          'flex min-h-[54px] w-full items-center justify-between gap-2 text-sm font-medium text-text-secondary transition-colors hover:text-text-primary active:text-text-primary',
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
