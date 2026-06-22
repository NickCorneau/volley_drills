import type { ReactNode } from 'react'
import { cx } from '../../lib/cn'
import { ELEVATED_PANEL_SURFACE, FOCAL_SURFACE_CLASS, SOFT_SURFACE_CLASS } from './surfaces'

// Back-compat re-exports. The tokens themselves moved to `./surfaces.ts`
// 2026-05-04 (plan U1) so non-Card consumers (`SkillLevelScreen` option
// rows, `ActionOverlay` panel, `home/cardStyles.ts`) don't have to import
// from a Card module to reach a class string. New code should import
// directly from `./surfaces`. `SOFT_SURFACE_CLASS` joined them 2026-06-22
// (T7) so `SettingsScreen` sections share the warm surface this variant uses.
export { ELEVATED_PANEL_SURFACE, FOCAL_SURFACE_CLASS, SOFT_SURFACE_CLASS }

type CardVariant = 'soft' | 'focal'

type CardProps = {
  /**
   * - `soft` (default, back-compat): warm supporting surface
   *   (`bg-bg-warm p-4`) used inside broader white-page screens for
   *   nested groupings (e.g., Review's RPE / pass-metric / quick-tag
   *   cards, Complete's session recap). Naming note (audit U2,
   *   2026-05-25): distinct from Button's `soft` variant, which is a
   *   warm *filled button*; here `soft` is a warm *surface*.
   * - `focal`: the Phase F1 / F2 calm-pass focal card (`bg-bg-primary`
   *   + soft shadow + hairline ring + `p-6 gap-4`). Use for the ONE
   *   primary content block on a screen that should read as the focal
   *   zone.
   */
  variant?: CardVariant
  className?: string
  children: ReactNode
  'aria-label'?: string
}

const VARIANT_CLASS: Record<CardVariant, string> = {
  soft: SOFT_SURFACE_CLASS,
  // Phase F2: focal variant layers the shared surface class with
  // F1-matched internal rhythm (p-6 padding + gap-4). Kept inline so
  // the single-source-of-truth surface class stays padding-agnostic
  // and other consumers (e.g., HomeScreen's secondary list) can reuse
  // it without inheriting padding they do not want.
  focal: `flex flex-col gap-4 p-6 ${FOCAL_SURFACE_CLASS}`,
}

export function Card({
  variant = 'soft',
  className,
  children,
  'aria-label': ariaLabel,
}: CardProps) {
  return (
    <div className={cx(VARIANT_CLASS[variant], className)} aria-label={ariaLabel}>
      {children}
    </div>
  )
}
