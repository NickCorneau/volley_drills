import { FLAGGED_TERMS } from './flaggedTerms'

/**
 * Pure parser for the inline-gloss `term (= definition)` syntax
 * authored in `app/src/data/drills.ts` per `.cursor/rules/courtside-copy.mdc`
 * rule 2. Splits a raw string into alternating text + gloss parts that
 * `<GlossedText>` renders as prose with tappable terms.
 *
 * Term-span resolution (rightmost-wins on ambiguity):
 *
 * 1. For each `(= …)` match in the input string, look at the prefix
 *    text immediately before it.
 * 2. Search the prefix for any registry term occurrence. The MATCH
 *    WHOSE END IS CLOSEST TO `(=` wins (rightmost-end). On a tie of
 *    end positions, the longer term wins.
 * 3. If no registry hit, fall back to "last 1 whitespace-delimited word
 *    before `(=`" as the term span.
 *
 * The rightmost-wins rule is the contract for ambiguous cases like
 * `Passes graded 2+ on 0–3 rubric (= ball lands within 1 m…)` —
 * both `"graded 2+"` and `"0–3 rubric"` are registry terms; the parser
 * picks `0–3 rubric` because its end is closest to `(=`. The author's
 * intended target was `graded 2+`, so the catalog rewrites those sites
 * as `Passes graded 2+ (= …) on the 0–3 rubric` to remove the ambiguity
 * (see `app/src/data/drills.ts` lines 376 / 415 + the pinned test
 * `glossedText.test.ts > resolves rightmost-wins on registry ambiguity`).
 *
 * Nested-paren handling: the regex stops at the first `)` after `(= `,
 * so a gloss inside outer parentheses parses correctly. See line 1947 of
 * `drills.ts`: `(caller calls → you serve → caller shags (= brings the
 * balls back) after the round) × 6 targets`.
 *
 * Multi-gloss handling: the regex is global — every `(= …)` match in the
 * string yields its own term span and gloss. See line 3320: a single
 * segment label with two glosses (`ankle hops` then `lateral shuffles`).
 */

export type GlossPart =
  | { type: 'text'; text: string }
  | { type: 'gloss'; term: string; definition: string }

export type GlossedString = GlossPart[]

const GLOSS_PATTERN = /\(=\s+([^)]+)\)/g

/**
 * Walk the prefix text from end to start, looking for the registry term
 * whose end is closest to the prefix's end. On a tie of end positions,
 * the longer term wins. Returns null if no registry term appears in the
 * prefix at all.
 */
function findRightmostRegistryTerm(
  prefix: string,
  registry: ReadonlySet<string>,
): { start: number; end: number; term: string } | null {
  let best: { start: number; end: number; term: string } | null = null

  for (const term of registry) {
    let searchFrom = 0
    let idx = -1
    while ((idx = prefix.indexOf(term, searchFrom)) !== -1) {
      const end = idx + term.length
      if (
        !best ||
        end > best.end ||
        (end === best.end && term.length > best.end - best.start)
      ) {
        best = { start: idx, end, term }
      }
      searchFrom = idx + 1
    }
  }

  return best
}

/**
 * Fallback term span when no registry term appears in the prefix:
 * "last whitespace-delimited word before `(= `". Trims trailing
 * whitespace, then walks back to the previous whitespace boundary.
 *
 * Returns null when the prefix is empty or only whitespace (in which
 * case there is no term to gloss and the parser emits the gloss as a
 * standalone tail-text — preserving the literal `(= …)` form so a
 * future authoring fix surfaces it).
 */
function fallbackLastWordSpan(
  prefix: string,
): { start: number; end: number; term: string } | null {
  // Trim trailing whitespace tracked via length so `start` indices line
  // up with the original prefix.
  let end = prefix.length
  while (end > 0 && /\s/.test(prefix[end - 1])) end--
  if (end === 0) return null

  let start = end
  while (start > 0 && !/\s/.test(prefix[start - 1])) start--
  if (start === end) return null

  return { start, end, term: prefix.slice(start, end) }
}

/**
 * Parse a string with inline `term (= definition)` glosses into
 * alternating text + gloss parts.
 *
 * The default `registry` is `FLAGGED_TERMS`; tests inject a narrower
 * registry to pin behavior for specific cases.
 */
export function parseGlossedText(
  text: string,
  registry: ReadonlySet<string> = FLAGGED_TERMS,
): GlossedString {
  const parts: GlossedString = []

  let cursor = 0
  GLOSS_PATTERN.lastIndex = 0
  let match: RegExpExecArray | null

  while ((match = GLOSS_PATTERN.exec(text)) !== null) {
    const matchStart = match.index
    const matchEnd = matchStart + match[0].length
    const prefix = text.slice(cursor, matchStart)
    const definition = match[1].trim()

    const span =
      findRightmostRegistryTerm(prefix, registry) ?? fallbackLastWordSpan(prefix)

    if (span) {
      // Emit text up to the term span, then the gloss part.
      const leading = prefix.slice(0, span.start)
      if (leading.length > 0) parts.push({ type: 'text', text: leading })
      parts.push({ type: 'gloss', term: span.term, definition })

      // Anything between the term span and the `(= ` opener (typically
      // a single space) is consumed silently — the renderer reproduces
      // " " between the term button and the definition reveal naturally.
    } else {
      // No registry hit and no fallback word (prefix is empty or only
      // whitespace). Emit the prefix as text and the literal `(= …)` as
      // text too; this preserves the source faithfully so the un-glossed
      // case is visible to authors.
      if (prefix.length > 0) parts.push({ type: 'text', text: prefix })
      parts.push({ type: 'text', text: match[0] })
    }

    cursor = matchEnd
  }

  // Tail text after the last gloss (or the whole string if no glosses).
  const tail = text.slice(cursor)
  if (tail.length > 0) parts.push({ type: 'text', text: tail })

  return parts
}
