import { useMemo, useState } from 'react'
import { parseGlossedText, type GlossPart, type GlossedString } from '../../domain/glossedText'

/**
 * State + parser hook for inline gloss surfaces. One hook call ==
 * one open-scope. Surfaces with multiple independent open-scopes
 * (e.g. `<GlossedText>` per paragraph, `<SegmentList>` per row,
 * `<PerDrillCapture>` per success-rule line) instantiate the hook
 * once per scope so opens never interfere across scopes.
 *
 * The hook is a pure composition over the canonical parser in
 * `domain/glossedText.ts` and intentionally owns no styling — that
 * lives on `<GlossInline>` (term buttons, dotted underline) and
 * `<GlossReveal>` (the `↳ definition` line). Callers that want the
 * default paragraph-prose layout should keep using `<GlossedText>`,
 * which composes this hook + the two atoms internally.
 */

export interface UseGlossResult {
  /** Parsed alternating text + gloss parts (memoized on `text`). */
  parts: GlossedString
  /** The currently open term, or `null` when nothing is expanded. */
  openTerm: string | null
  /**
   * The definition for the currently open term, or `null` when
   * nothing is open or when `openTerm` does not resolve to a parsed
   * gloss part (defensive default — the renderer just won't show a
   * reveal in that case).
   */
  openDefinition: string | null
  /**
   * Toggle predicate: returns true when the given term is the
   * currently open one. Surfaces use this to drive `aria-expanded`
   * on the term button.
   */
  isOpen: (term: string) => boolean
  /**
   * Flip the open scope on the given term. Tapping the open term
   * collapses it back to `null`; tapping a different term swaps it
   * (the per-scope single-open contract).
   */
  toggle: (term: string) => void
}

export function useGloss(text: string): UseGlossResult {
  const parts = useMemo(() => parseGlossedText(text), [text])

  const [openTerm, setOpenTerm] = useState<string | null>(null)

  const openDefinition = useMemo<string | null>(() => {
    if (openTerm == null) return null
    const match = parts.find(
      (p): p is Extract<GlossPart, { type: 'gloss' }> =>
        p.type === 'gloss' && p.term === openTerm,
    )
    return match ? match.definition : null
  }, [parts, openTerm])

  function isOpen(term: string): boolean {
    return openTerm === term
  }

  function toggle(term: string) {
    setOpenTerm((prev) => (prev === term ? null : term))
  }

  return { parts, openTerm, openDefinition, isOpen, toggle }
}
