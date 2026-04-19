import type { ReactNode } from 'react'
import { cx } from '../../lib/cn'

/**
 * Phase F2 (2026-04-19): shared focal-card surface token.
 *
 * Canonical calm-pass surface used across the app's primary content
 * blocks: white surface on the body background, subtle `shadow-sm` +
 * hairline `ring-1 ring-text-primary/5` instead of a hard border, and
 * `rounded-[16px]` corners. Consumers add their own padding / flex /
 * gap because usages differ (the Home secondary list, for example,
 * owns its own padding via `divide-y` child rows; a content card adds
 * `p-6 flex flex-col gap-4`).
 *
 * Originally introduced in Phase F1 on `HomePrimaryCard`; extracted
 * here so every "focal card" across the app draws from the same source
 * of truth and the Japanese-inspired visual direction can't drift
 * surface-by-surface.
 *
 * Do NOT apply to `RunScreen` or `TransitionScreen`: the outdoor
 * readability contract in `docs/research/outdoor-courtside-ui-brief.md`
 * requires hard contrast and large, unambiguous controls on active
 * blocks; subtle shadows + hairline rings are correct for calm review /
 * settings / onboarding surfaces but wrong for glare-readable run mode.
 */
export const FOCAL_SURFACE_CLASS =
  'rounded-[16px] bg-bg-primary shadow-sm ring-1 ring-text-primary/5'

type CardVariant = 'soft' | 'focal'

type CardProps = {
  /**
   * - `soft` (default, back-compat): warm supporting surface
   *   (`bg-bg-warm p-4`) used inside broader white-page screens for
   *   nested groupings (e.g., Review's RPE / pass-metric / quick-tag
   *   cards, Complete's session recap).
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
  soft: 'rounded-[12px] bg-bg-warm p-4',
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
