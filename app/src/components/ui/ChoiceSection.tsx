import type { ReactNode } from 'react'
import { cx } from '../../lib/cn'

export type ChoiceSectionProps = {
  title: ReactNode
  /** Subhead under the heading; rendered as `text-sm text-text-secondary`. */
  description?: ReactNode
  /** Fine print under the chip row (same pattern as the Time clarifier). */
  footerNote?: string
  /** Append a regular-weight `(optional)` suffix span to the heading. */
  optional?: boolean
  className?: string
  children: ReactNode
}

/**
 * Shared layout for every choice row in the pre-run flow (Setup, Tune Today,
 * Safety): one heading scale (`text-base` semibold), shared gap, optional
 * description above the chips, optional footnote below.
 *
 * Use `ChoiceSubsection` for conditional follow-up rows that nest inside a
 * section (e.g. wall-or-fence after Solo + no net, layoff buckets after `2+`
 * recency).
 */
export function ChoiceSection({
  title,
  description,
  footerNote,
  optional,
  className,
  children,
}: ChoiceSectionProps) {
  return (
    <section className={cx('flex flex-col gap-3', className)}>
      <h2 className="text-base font-semibold text-text-primary">
        {title}
        {optional ? (
          <>
            {' '}
            <span className="font-normal text-text-secondary">(optional)</span>
          </>
        ) : null}
      </h2>
      {description ? <p className="text-sm text-text-secondary">{description}</p> : null}
      {children}
      {footerNote ? <p className="text-xs text-text-secondary">{footerNote}</p> : null}
    </section>
  )
}

export type ChoiceSubsectionProps = {
  /** Stable id for `aria-labelledby` on the nested radiogroup. */
  titleId: string
  title: ReactNode
  /** Optional description rendered between the h3 and the children. */
  description?: ReactNode
  children: ReactNode
}

/**
 * Conditional follow-up inside a `ChoiceSection` (e.g. wall after Solo + no net,
 * layoff buckets after `2+` recency). Same heading scale as the parent section
 * so it doesn't read as fine print, default `lg` chips inside.
 */
export function ChoiceSubsection({ titleId, title, description, children }: ChoiceSubsectionProps) {
  return (
    <div className="flex flex-col gap-3 rounded-[12px] bg-bg-warm/60 p-3">
      <h3 id={titleId} className="text-base font-semibold text-text-primary">
        {title}
      </h3>
      {description ? <p className="text-sm text-text-secondary">{description}</p> : null}
      {children}
    </div>
  )
}
