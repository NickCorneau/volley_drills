import type { ReactNode } from 'react'
import { cx } from '../../lib/cn'

export type CalloutTone = 'info' | 'warning' | 'success'
export type CalloutEmphasis = 'flat' | 'hairline'
export type CalloutSize = 'md' | 'sm'

export type CalloutProps = {
  tone: CalloutTone
  /**
   * `'flat'` (default) renders a colored surface with no border (heat tips,
   * PainOverrideCard outer panel, Settings success message).
   * `'hairline'` adds a tone-matched border (heat warning panel — emphasises
   * stop-immediately severity).
   */
  emphasis?: CalloutEmphasis
  /**
   * `'md'` (default) is the standard `p-4` container used for body callouts.
   * `'sm'` is the centered `px-4 py-3` strip used for inline status messages
   * (StatusMessage's error variant body, Settings export-success row).
   */
  size?: CalloutSize
  /**
   * ARIA role override. `'alert'` for assertive announcements (used by
   * StatusMessage error variant); `'status'` for polite live regions
   * (Settings export-success). Omit for purely visual panels — the heat
   * warning carries semantic weight via its h3 heading instead.
   */
  role?: 'alert' | 'status'
  /** Appended to the wrapper className. */
  className?: string
  children: ReactNode
}

const TONE_FLAT: Record<CalloutTone, string> = {
  warning: 'bg-warning-surface text-warning',
  info: 'bg-info-surface text-text-secondary',
  success: 'bg-success/10 text-success',
}

const TONE_HAIRLINE: Record<CalloutTone, string> = {
  warning: 'border border-warning/30 bg-warning-surface text-warning',
  info: 'border border-info/30 bg-info-surface text-text-secondary',
  success: 'border border-success/30 bg-success/10 text-success',
}

const SIZE_CLASS: Record<CalloutSize, string> = {
  md: 'p-4',
  sm: 'px-4 py-3 text-center text-sm font-medium',
}

/**
 * Plan U9 (2026-05-04): the canonical "tone × emphasis × size" panel that
 * replaces the inline warning/info/success surfaces previously
 * hand-rolled across SafetyCheckScreen (heat warning + tips),
 * PainOverrideCard, SettingsScreen (export-success), and the body of
 * StatusMessage's error variant.
 *
 * `Callout` is purely visual; semantic role goes on the parent (h2/h3
 * heading naming the section) or via the `role` prop for live regions.
 *
 * # Distinct from `StatusMessage`
 *
 * `StatusMessage` is the page-load state primitive (loading / error /
 * empty); the error variant's body USES `Callout tone="warning"
 * size="sm" role="alert"` internally. Two abstractions, two
 * responsibilities — one is page state, the other is information
 * surface. Don't conflate them.
 */
export function Callout({
  tone,
  emphasis = 'flat',
  size = 'md',
  role,
  className,
  children,
}: CalloutProps) {
  const toneClass = emphasis === 'hairline' ? TONE_HAIRLINE[tone] : TONE_FLAT[tone]
  return (
    <div role={role} className={cx('rounded-[12px]', toneClass, SIZE_CLASS[size], className)}>
      {children}
    </div>
  )
}
