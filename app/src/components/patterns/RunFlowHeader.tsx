import type { ReactNode } from 'react'
import { cx } from '../../lib/cn'
import { SafetyIcon } from '../SafetyIcon'
import { ScreenShell } from '../ui/ScreenShell'

export type RunFlowHeaderProps = {
  /**
   * Center-cell content. Caller owns the typography because the focal-vs-status
   * distinction is intentional: RunScreen uses `text-sm font-semibold text-accent`
   * (focal), Transition / DrillCheck use `text-sm font-medium text-text-secondary`
   * (calm status marker). Don't unify — see RunScreen header comment for context.
   */
  eyebrow: ReactNode
  /** Right-cell content (typically a "N/M" or "Last: N/M" / "Next: N/M" counter). */
  counter: ReactNode
  /** Appended to the wrapping `ScreenShell.Header` className. */
  className?: string
}

/**
 * Plan U5 (2026-05-04): the canonical run-flow header used by `RunScreen`,
 * `TransitionScreen`, and `DrillCheckScreen`: SafetyIcon left, centered
 * eyebrow, right counter, all on a 3-cell grid (NOT flex justify-between).
 *
 * # Why grid not flex
 *
 * `flex justify-between` keeps the gap-left of the middle item equal to
 * the gap-right but does NOT center the middle item relative to the
 * container — the middle item drifts off true center by
 * `(left_child_width - right_child_width) / 2`. With `SafetyIcon` at
 * `h-14 w-14` (56 px) and a short counter `N/M` (~22 px), the math is
 * `+17 px` right of center on RunScreen — visible as misalignment when
 * comparing across run-flow screens (TransitionScreen has the wider
 * `Next: N/M` counter and reads visually centered by accident).
 *
 * `grid-cols-3` + per-cell `justify-self-{start,center,end}` forces the
 * middle column to center on the container regardless of side-cell
 * widths. Symmetric column widths also let the eyebrow auto-truncate
 * cleanly if a future label (e.g. Tier 1c `Main drill · serve`
 * composition) ever exceeds the column width — the `truncate` class is
 * reserved for that eventuality without changing this layout.
 *
 * # Distinct from `ScreenHeader`
 *
 * `ScreenHeader` (U4) is the pre-run/settings shape (BackButton +
 * centered title + spacer) and always carries a BackButton. This one
 * never does — once the run flow starts, "back" lives behind the
 * end-session confirm sheet, not in the header chrome.
 */
export function RunFlowHeader({ eyebrow, counter, className }: RunFlowHeaderProps) {
  return (
    <ScreenShell.Header className={cx('grid grid-cols-3 items-center pt-2 pb-3', className)}>
      <div className="justify-self-start">
        <SafetyIcon />
      </div>
      <span className="justify-self-center">{eyebrow}</span>
      <span className="justify-self-end">{counter}</span>
    </ScreenShell.Header>
  )
}
