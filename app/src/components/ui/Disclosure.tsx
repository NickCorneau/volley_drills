import { useState, type ReactNode } from 'react'
import { cx } from '../../lib/cn'

export type DisclosureProps = {
  /** Trigger label (also the accessible name). */
  label: string
  /** Content shown after the user expands. */
  children: ReactNode
  /** Optional `data-testid` forwarded to the collapsed trigger button. */
  testId?: string
  /** Appended to the trigger button's className. */
  className?: string
}

/**
 * Plan U7 (2026-05-04): collapsed-by-default reveal that REPLACES its
 * trigger on expand. The PerDrillCapture drawers ("Add counts (optional)" /
 * "Add longest streak (optional)") are the canonical shape — once the
 * drawer opens, the trigger is gone and the collapsed state is no longer
 * reachable until the surface unmounts.
 *
 * Distinct from `Expander` (same file's sibling primitive) where the
 * trigger stays visible after expanding (chevron rotates) and the user
 * can re-collapse — different shape, different contract.
 *
 * The 44px tap target + underlined-accent visual matches the existing
 * inline pattern verbatim so PerDrillCapture's `data-testid="per-drill-add-counts"`
 * / `data-testid="per-drill-add-streak"` continue to resolve when forwarded
 * via the `testId` prop.
 */
export function Disclosure({ label, children, testId, className }: DisclosureProps) {
  const [open, setOpen] = useState(false)

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        data-testid={testId}
        className={cx(
          'inline-flex min-h-[44px] self-start items-center text-sm font-medium text-accent underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent',
          className,
        )}
      >
        {label}
      </button>
    )
  }

  return <>{children}</>
}
