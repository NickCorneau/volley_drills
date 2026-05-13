import { GlossInline } from './GlossInline'
import { GlossReveal } from './GlossReveal'
import { useGloss } from './useGloss'
import type { GlossedString } from '../../domain/glossedText'

/**
 * Paragraph-prose convenience wrapper for inline gloss copy. Splits
 * the input string at `\n\n` boundaries and renders each paragraph
 * as a `<p>` containing inline term buttons, with a quiet `↳ `
 * definition reveal beneath the paragraph that owns the open term.
 *
 * # Architecture (2026-05-13 universalization)
 *
 * `<GlossedText>` is the paragraph-prose default. Surfaces with
 * non-paragraph layouts compose the primitives directly:
 *
 * - `useGloss(text)` — parser + per-scope open-state hook
 * - `<GlossInline>` — inline term buttons (no wrapper element)
 * - `<GlossReveal>` — the `↳ definition` line, with optional `as`
 *   and `className` for layout placement
 *
 * `app/src/components/run/SegmentList.tsx` and
 * `app/src/components/PerDrillCapture.tsx` are the canonical
 * compose-it-yourself examples (flex-grid row + nested-`<p>` host
 * respectively). Reach for `<GlossedText>` when the host is plain
 * paragraph prose; reach for the primitives when the host has its
 * own structural shape.
 *
 * # Visual contract (locked design iteration round 4)
 *
 * - Term button: dotted underline at `border-text-secondary/60`
 *   2 px below baseline; inherits font/color/leading from the host.
 * - Definition: `text-sm leading-snug text-text-secondary` line
 *   with `↳ ` (U+21B3, `aria-hidden`) prefix and a 6 px top gap.
 * - Reveal: 120 ms ease-out fade + 1 px settle via the
 *   `gloss-def-reveal` keyframe in `app/src/index.css`.
 *
 * # Open scope
 *
 * Per-paragraph: opening a term in paragraph 1 swaps any other
 * open term in paragraph 1; opening a term in paragraph 2 leaves
 * paragraph 1's open term alone. Each paragraph instantiates its
 * own `useGloss` instance to enforce this contract.
 *
 * # Composition note
 *
 * The Cue block on TransitionScreen uses `border-l-2 border-accent/70
 * pl-3` as its higher-priority left-rule voice. `<GlossedText>` stays
 * deliberately quieter (dotted, secondary color, no left rule) so the
 * two surfaces do not compete for the eye.
 *
 * # Accessibility
 *
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
  const paragraphs = splitParagraphs(text)
  if (paragraphs.length === 0) return null

  return (
    <div className="space-y-3">
      {paragraphs.map((paragraphText, pIdx) => (
        <GlossedParagraph key={pIdx} text={paragraphText} />
      ))}
    </div>
  )
}

/**
 * One paragraph == one `useGloss` scope. Lifting this into its own
 * component is what gives us the per-paragraph open contract: each
 * paragraph holds its own `openTerm` state, so opens in different
 * paragraphs do not interfere.
 */
function GlossedParagraph({ text }: { text: string }) {
  const { parts, openDefinition, isOpen, toggle } = useGloss(text)
  return (
    <div>
      <p className="whitespace-pre-line text-base leading-relaxed text-text-primary">
        <GlossInline parts={parts} isOpen={isOpen} onToggle={toggle} />
      </p>
      {openDefinition != null && <GlossReveal definition={openDefinition} />}
    </div>
  )
}

function splitParagraphs(text: string): string[] {
  if (text.length === 0) return []
  const segments = text.split(/\n\n+/)
  return segments.filter((seg) => seg.length > 0)
}

/**
 * Re-export the parsed-string type for callers that compose the
 * primitives manually and want to type their `parts` array. The
 * canonical type lives in `domain/glossedText.ts`.
 */
export type { GlossedString }
