import type { ReactNode } from 'react'
import { cx } from '../../lib/cn'

export type SetupChoiceSectionProps = {
  title: ReactNode
  /** Fine print under the chip row (same pattern as Time). */
  footerNote?: string
  className?: string
  children: ReactNode
}

/**
 * Shared layout for Today's setup (and similar) choice rows: one section heading
 * scale (`text-base` / semibold) plus chip row and optional footnote.
 */
export function SetupChoiceSection({ title, footerNote, className, children }: SetupChoiceSectionProps) {
  return (
    <section className={cx('flex flex-col gap-3', className)}>
      <h2 className="text-base font-semibold text-text-primary">{title}</h2>
      {children}
      {footerNote ? <p className="text-xs text-text-secondary">{footerNote}</p> : null}
    </section>
  )
}

export type SetupNestedChoiceBlockProps = {
  /** Stable id for `aria-labelledby` on the nested radiogroup. */
  titleId: string
  title: ReactNode
  children: ReactNode
}

/**
 * Conditional follow-up inside a setup section (e.g. wall after Solo + no net).
 * Uses the same typographic scale as primary setup headings so it does not read as fine print.
 */
export function SetupNestedChoiceBlock({ titleId, title, children }: SetupNestedChoiceBlockProps) {
  return (
    <div className="flex flex-col gap-3 rounded-[12px] bg-bg-warm/60 p-3">
      <h3 id={titleId} className="text-base font-semibold text-text-primary">
        {title}
      </h3>
      {children}
    </div>
  )
}
