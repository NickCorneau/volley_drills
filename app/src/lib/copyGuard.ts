/**
 * V0B-18 (Phase E Unit 3): D86 avoid-phrase list + matching helpers.
 *
 * Source of truth for `docs/research/regulatory-boundary-pain-gated-training-apps.md`.
 * Any Phase C screen that renders copy touching pain, symptoms, or
 * physiology imports `scanForForbidden` in its regression test and
 * asserts the rendered body + ARIA attributes contain no matches.
 *
 * Adding a phrase here MUST come with a sweep across consuming tests
 * to confirm no current surface violates the rule. If something
 * violates, fix the copy — not the regex.
 *
 * The list is intentionally narrow:
 * - `compared`, `trend`, `progress`: avoid implying a longitudinal
 *   comparison the tester hasn't opted into (D86).
 * - `spike`, `overload`: training-load jargon with regulatory-adjacent
 *   readings.
 * - `injury risk`: the high-value phrase regulators look for in
 *   pain-gated apps.
 * - `baseline`, `early sessions`: imply pre-post framing v0b doesn't
 *   want to promise.
 * - `first N days` (N any digits): the most common variant of the
 *   "early sessions" framing that slips through without the regex
 *   boundary.
 */

export const AVOID_PHRASES = [
  'compared',
  'trend',
  'progress',
  'spike',
  'overload',
  'injury risk',
  'baseline',
  'early sessions',
  // `first N days` — see regex group.
] as const

/**
 * Case-insensitive, word-boundary-scoped match. `first N days` is
 * handled inline via `\d+` so the literal phrase list above stays
 * human-readable.
 */
export const FORBIDDEN_RE =
  /\b(compared|trend|progress|spike|overload|injury\s+risk|first\s+\d+\s+days|baseline|early\s+sessions)\b/i

/**
 * Returns every forbidden match in `text`. Global flag so callers see
 * ALL matches in a single assertion rather than only the first.
 */
export function scanForForbidden(text: string): string[] {
  const matches: string[] = []
  const global = new RegExp(FORBIDDEN_RE.source, 'gi')
  for (const m of text.matchAll(global)) matches.push(m[0])
  return matches
}

/**
 * Scan a live DOM subtree for forbidden vocabulary in both visible text
 * AND accessibility attributes (`aria-label`, `title`, `alt`). Catches
 * copy that lives in screen-reader-only labels — the previous
 * `document.body.textContent` sweeps missed these.
 */
export function scanElementForForbidden(root: ParentNode): string[] {
  const bodyText = root.textContent ?? ''
  const matches = scanForForbidden(bodyText)
  const attributed = root.querySelectorAll<HTMLElement>(
    '[aria-label], [title], [alt]',
  )
  for (const el of attributed) {
    for (const attr of ['aria-label', 'title', 'alt'] as const) {
      const value = el.getAttribute(attr)
      if (value) matches.push(...scanForForbidden(value))
    }
  }
  return matches
}
