import type { GlossedString } from '../../domain/glossedText'
import { cx } from '../../lib/cn'

/**
 * Layout-agnostic atom that renders parsed gloss parts as inline
 * `<span>` text + dotted-underline term `<button>`s. No wrapper
 * element is emitted, so the atom is composable inside any host —
 * a `<p>`, a flex-grid `<span>` cell, a list item — without forcing
 * a structural shape on the caller.
 *
 * Visual contract (locked in design iteration round 4 of the v1
 * GlossedText work):
 * - Term button: dotted underline at `border-text-secondary/60`,
 *   2 px below the baseline so it clears descenders cleanly.
 *   Inherits the surrounding font / color / leading via inline reset.
 * - `text-left` overrides the UA's `text-align: center` so multi-
 *   word terms wrap left-aligned (e.g. "lateral shuffles" breaking
 *   mid-term).
 * - Focus-visible: `ring-2 ring-accent ring-offset-1` with
 *   `rounded-[2px]` for a subtle keyboard-focus indicator.
 *
 * State lives one level up via `useGloss` (`openTerm`, `toggle`).
 * The atom is fully controlled.
 */

export interface GlossInlineProps {
  parts: GlossedString
  isOpen: (term: string) => boolean
  onToggle: (term: string) => void
}

export function GlossInline({ parts, isOpen, onToggle }: GlossInlineProps) {
  if (parts.length === 0) return null

  return (
    <>
      {parts.map((p, i) => {
        if (p.type === 'text') return <span key={i}>{p.text}</span>
        return (
          <button
            key={i}
            type="button"
            aria-expanded={isOpen(p.term)}
            onClick={() => onToggle(p.term)}
            className={cx(
              // Inline reset: <button> defaults to inline-block,
              // which leaks whitespace next to punctuation. Force
              // inline + inherit font / color / leading so the
              // term sits flush in the prose.
              'inline cursor-pointer p-0 m-0 align-baseline text-left',
              'bg-transparent border-0 font-inherit text-[inherit] leading-inherit',
              'rounded-[2px]',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-1',
              // Quiet-but-visible dotted underline; sits 2 px below
              // baseline so dots clear descenders.
              'border-b border-dotted border-text-secondary/60 pb-[2px]',
            )}
          >
            {p.term}
          </button>
        )
      })}
    </>
  )
}
