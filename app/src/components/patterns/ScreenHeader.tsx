import type { ReactNode } from 'react'
import { cx } from '../../lib/cn'
import { ScreenShell } from '../ui/ScreenShell'
import { BackButton } from './BackButton'

export type ScreenHeaderProps = {
  /** Visible label after the BackButton arrow (e.g. "Back", "Skill level"). */
  backLabel: string
  onBack: () => void
  title: ReactNode
  /**
   * Optional override for BackButton's accessible name. Defaults to
   * `"Back"` when `backLabel === "Back"` and `"Back to {backLabel}"` otherwise.
   */
  backAriaLabel?: string
  /**
   * Optional content for the right cell. Defaults to a spacer matching
   * BackButton's measured tap-target width so the centered title stays
   * optically balanced. Pass a real node (e.g. an action button) when
   * the screen has a top-right affordance.
   */
  right?: ReactNode
  /** Appended to the wrapping `ScreenShell.Header` className. */
  className?: string
}

/**
 * Plan U4 (2026-05-04): the canonical `BackButton + centered title +
 * spacer` row used across the pre-run/settings flow (SetupScreen,
 * SafetyCheckScreen, SettingsScreen, TuneTodayScreen).
 *
 * Distinct from `RunFlowHeader` (U5) which is the run-flow shape
 * (SafetyIcon + 3-grid eyebrow + counter). This one always carries a
 * BackButton; the run-flow header never does.
 *
 * The spacer (`w-12`) matches BackButton's `min-h-[44px] px-2 ~~48 px`
 * footprint so a centered `h1` stays optically centered. If BackButton's
 * width contract changes, update both in lockstep.
 */
export function ScreenHeader({
  backLabel,
  onBack,
  title,
  backAriaLabel,
  right,
  className,
}: ScreenHeaderProps) {
  return (
    <ScreenShell.Header className={cx('flex items-center gap-2 pt-2 pb-3', className)}>
      <BackButton label={backLabel} onClick={onBack} aria-label={backAriaLabel} />
      <h1 className="flex-1 text-center text-xl font-semibold tracking-tight text-text-primary">
        {title}
      </h1>
      {right ?? <div className="w-12" aria-hidden />}
    </ScreenShell.Header>
  )
}
