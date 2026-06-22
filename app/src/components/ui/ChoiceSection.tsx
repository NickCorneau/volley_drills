import type { ReactNode } from 'react'
import { cx } from '../../lib/cn'

export type ChoiceSectionProps = {
  title: ReactNode
  /**
   * Heading treatment. `default` is the shared pre-run scale
   * (`text-base` semibold) — Safety keeps this because its titles are
   * full questions. `micro` is the D158 Setup refine-cluster
   * treatment (founder-chosen `setup-01-returning-quiet-labels` comp):
   * a quiet uppercase micro-label that recedes so the focal resolved
   * line above the cluster carries the screen.
   */
  headingVariant?: 'default' | 'micro'
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
 * Shared layout for every choice row in the pre-run flow (Setup,
 * Safety): one heading scale per `headingVariant`, shared gap, optional
 * description above the chips, optional footnote below.
 *
 * Use `ChoiceSubsection` for conditional follow-up rows that nest inside a
 * section (e.g. wall-or-fence after Solo + no net, layoff buckets after `2+`
 * recency).
 */
export function ChoiceSection({
  title,
  headingVariant = 'default',
  description,
  footerNote,
  optional,
  className,
  children,
}: ChoiceSectionProps) {
  return (
    <section className={cx('flex flex-col gap-3', className)}>
      <h2
        className={
          headingVariant === 'micro'
            ? 'text-xs font-medium uppercase tracking-wider text-text-secondary'
            : 'text-base font-semibold text-text-primary'
        }
      >
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
  /** Same opt-in micro-label treatment as `ChoiceSection` (D158 Setup). */
  headingVariant?: 'default' | 'micro'
  /** Optional description rendered between the h3 and the children. */
  description?: ReactNode
  children: ReactNode
}

/**
 * Conditional follow-up inside a `ChoiceSection` (e.g. wall after Solo + no net,
 * layoff buckets after `2+` recency). Same heading scale as the parent section
 * so it doesn't read as fine print, default `lg` chips inside.
 */
export function ChoiceSubsection({
  titleId,
  title,
  headingVariant = 'default',
  description,
  children,
}: ChoiceSubsectionProps) {
  return (
    // T3 (2026-06-22 shibui audit): the warm card chrome (bg-warm +
    // rounded + padding) was removed so the nested follow-up reads as a
    // calm body in the pre-run flow, not a tinted panel. The reveal
    // animation (opacity + translateY) stays as the nesting affordance.
    <div className="flex animate-[choice-subsection-reveal_180ms_ease-out] flex-col gap-3 motion-reduce:animate-none">
      <h3
        id={titleId}
        className={
          headingVariant === 'micro'
            ? 'text-xs font-medium uppercase tracking-wider text-text-secondary'
            : 'text-base font-semibold text-text-primary'
        }
      >
        {title}
      </h3>
      {description ? <p className="text-sm text-text-secondary">{description}</p> : null}
      {children}
    </div>
  )
}
