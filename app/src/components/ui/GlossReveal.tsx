import { cx } from '../../lib/cn'

/**
 * Layout-agnostic atom that renders the `↳ definition` reveal line
 * paired with a `<GlossInline>` term button. The default styling
 * stack is the locked v1 visual contract (`text-sm leading-snug
 * text-text-secondary` with the `↳` glyph at 6 px gap and a 120 ms
 * `gloss-def-reveal` fade), and the optional `className` prop
 * appends to it so surfaces can supply layout-specific positioning
 * (e.g. `<SegmentList>` passes `col-start-2 col-span-2` to anchor
 * the reveal under the row's label column).
 *
 * The element is rendered as a `<p>` by default. Surfaces whose
 * host is itself a `<p>` (HTML invariant — no `<p>` inside `<p>`)
 * pass `as="div"` to swap the element type while preserving the
 * styling.
 *
 * The `↳` glyph is `aria-hidden`; screen readers receive the bare
 * definition text.
 */

export interface GlossRevealProps {
  definition: string
  /**
   * Element type to render the reveal as. Default is `<p>`. Pass
   * `'div'` when the host is already a `<p>` to keep the HTML
   * invariant (no `<p>` inside `<p>`).
   */
  as?: 'p' | 'div'
  /**
   * Appended to the default styling stack. Surfaces use this for
   * layout-specific positioning (grid placement, custom margins,
   * register overrides) without rebuilding the visual contract.
   */
  className?: string
}

export function GlossReveal({ definition, as = 'p', className }: GlossRevealProps) {
  const Tag = as
  return (
    <Tag
      className={cx(
        'mt-1.5 animate-[gloss-def-reveal_120ms_ease-out] text-sm leading-snug text-text-secondary motion-reduce:animate-none',
        className,
      )}
    >
      <span aria-hidden className="mr-2 text-text-secondary">
        ↳
      </span>
      {definition}
    </Tag>
  )
}
