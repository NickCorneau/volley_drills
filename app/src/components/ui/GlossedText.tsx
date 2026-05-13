import { useState } from 'react'
import { parseGlossedText, type GlossPart, type GlossedString } from '../../domain/glossedText'
import { cx } from '../../lib/cn'

/**
 * Inline-gloss tappable-term affordance for courtside drill prose.
 *
 * Renders a string with `term (= definition)` syntax (see
 * `.cursor/rules/courtside-copy.mdc` rule 2) as flowing prose where each
 * flagged term is a `<button>` whose definition reveals as a quiet line
 * below the paragraph that contains it. The data layer keeps the
 * authored `(= …)` form on disk; this component parses at render time
 * and the term-span resolution rule lives in `domain/glossedText.ts`.
 *
 * Visual contract (locked in round 4 of the design iteration):
 * - Term button: dotted underline at `border-text-secondary/60`,
 *   sits 2px below the baseline so it clears descenders cleanly.
 *   Inherits the surrounding font / color / leading via inline reset.
 * - Definition: `text-sm leading-snug text-text-secondary` paragraph
 *   directly below the prose paragraph that owns the open term, with
 *   a 6px (mt-1.5) top gap, prefixed by `↳ ` (U+21B3, mr-2,
 *   `text-text-secondary`, `aria-hidden`).
 * - Reveal: 120 ms ease-out fade + 1px settle via the
 *   `gloss-def-reveal` keyframe in `app/src/index.css`.
 * - Open scope: per-paragraph (one definition open per `\n\n`-split
 *   paragraph; opens in different paragraphs are independent).
 *
 * Composition note: the `Cue` block on TransitionScreen uses
 * `border-l-2 border-accent/70 pl-3` as its higher-priority left-rule
 * voice. This component stays deliberately quieter (dotted, secondary
 * color, no left rule) so the two surfaces don't compete for the eye.
 *
 * Multi-paragraph caveat: the component splits prose at `\n\n`
 * boundaries. Single-paragraph strings (the common case for
 * `courtsideInstructions` and `successMetric.description`) render as a
 * single paragraph block. Callers that want this primitive inside a
 * `<span>`-only context (e.g. inside the `SegmentList`'s flex grid
 * cells) need a `wrapperAs="span"` prop that has not been added yet —
 * SegmentList retains its inline `(= …)` literal rendering as a
 * deliberate exception per the DO-CONFIRM consumption mode in
 * `.cursor/rules/courtside-copy.mdc` rule 13.
 *
 * Prose-styling caveat: the prose `<p>` is hard-coded at
 * `text-base leading-relaxed text-text-primary`. Callers that render
 * the source string at a different register (e.g. `PerDrillCapture`
 * renders `successMetric.description` at `text-sm text-text-secondary`,
 * embedded inside a parent `<p>` with bold prefix/suffix) cannot use
 * this component without reshaping the host — the gloss reveal at
 * `text-sm text-text-secondary` would render at the same weight as the
 * surrounding prose, defeating the second-class-information hierarchy.
 * `PerDrillCapture` is intentionally NOT swapped in v1 for this reason.
 * If `successMetric.description` glosses ever need to surface there,
 * adding a `proseClassName` / `revealClassName` API + a parent-`<p>`
 * adapter is the right move — but it's deferred until a real call-site
 * forces the design decision rather than guessing.
 *
 * Accessibility:
 * - Each term is a real `<button type="button">` with `aria-expanded`.
 * - Focus-visible: `ring-2 ring-accent ring-offset-1` with
 *   `rounded-[2px]` for a subtle keyboard-focus indicator.
 * - The `↳` glyph is `aria-hidden`; screen readers get the bare
 *   definition text.
 * - The plain-text fallback (joining term + ` (= ` + definition + `)`)
 *   reproduces the original string, preserving copy-paste parity.
 */
export interface GlossedTextProps {
  /** Raw drill copy authored with inline `term (= definition)` glosses. */
  text: string
}

export function GlossedText({ text }: GlossedTextProps) {
  const parts = parseGlossedText(text)

  // One open definition per paragraph index, independent across
  // paragraphs. A reader can keep paragraph 1's definition visible
  // while opening paragraph 2's.
  const [paragraphOpens, setParagraphOpens] = useState<Record<number, string | null>>({})

  function isOpen(term: string, pIdx: number): boolean {
    return paragraphOpens[pIdx] === term
  }

  function toggle(term: string, pIdx: number) {
    setParagraphOpens((prev) => {
      const next = { ...prev }
      if (next[pIdx] === term) delete next[pIdx]
      else next[pIdx] = term
      return next
    })
  }

  // Split prose at `\n\n` paragraph boundaries so each paragraph can
  // own its own open-definition slot. Most call sites pass single-
  // paragraph strings, in which case `paragraphs.length === 1`.
  const paragraphs: GlossedString[] = []
  let current: GlossedString = []
  for (const part of parts) {
    if (part.type === 'text') {
      const segments = part.text.split(/\n\n+/)
      segments.forEach((seg, i) => {
        if (i > 0) {
          paragraphs.push(current)
          current = []
        }
        if (seg.length > 0) current.push({ type: 'text', text: seg })
      })
    } else {
      current.push(part)
    }
  }
  if (current.length > 0) paragraphs.push(current)

  // Empty input yields an empty fragment so callers that conditionally
  // pass `text=""` don't render an extra wrapper div.
  if (paragraphs.length === 0) return null

  return (
    <div className="space-y-3">
      {paragraphs.map((para, pIdx) => {
        const openHere = para.find(
          (p): p is Extract<GlossPart, { type: 'gloss' }> =>
            p.type === 'gloss' && isOpen(p.term, pIdx),
        )
        return (
          <div key={pIdx}>
            <p className="whitespace-pre-line text-base leading-relaxed text-text-primary">
              {para.map((p, i) => {
                if (p.type === 'text') return <span key={i}>{p.text}</span>
                return (
                  <button
                    key={i}
                    type="button"
                    aria-expanded={isOpen(p.term, pIdx)}
                    onClick={() => toggle(p.term, pIdx)}
                    className={cx(
                      // Inline reset: <button> defaults to inline-block,
                      // which leaks whitespace next to punctuation. Force
                      // inline + inherit font / color / leading so the
                      // term sits flush in the prose. `text-left`
                      // overrides the UA's `text-align: center` so multi-
                      // word terms wrap left-aligned (e.g. "lateral
                      // shuffles" breaking mid-term).
                      'inline cursor-pointer p-0 m-0 align-baseline text-left',
                      'bg-transparent border-0 font-inherit text-[inherit] leading-inherit',
                      'rounded-[2px]',
                      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-1',
                      // Quiet-but-visible dotted underline; sits 2px
                      // below baseline so dots clear descenders.
                      'border-b border-dotted border-text-secondary/60 pb-[2px]',
                    )}
                  >
                    {p.term}
                  </button>
                )
              })}
            </p>
            {openHere && (
              <p className="mt-1.5 animate-[gloss-def-reveal_120ms_ease-out] text-sm leading-snug text-text-secondary motion-reduce:animate-none">
                <span aria-hidden className="mr-2 text-text-secondary">
                  ↳
                </span>
                {openHere.definition}
              </p>
            )}
          </div>
        )
      })}
    </div>
  )
}
