import { describe, expect, it } from 'vitest'
import { FLAGGED_TERMS } from '../flaggedTerms'
import { parseGlossedText } from '../glossedText'

describe('parseGlossedText', () => {
  describe('baseline shapes (canonical drills.ts fixtures)', () => {
    it('parses `Passes graded 2+ (= …)` with the registry term as the gloss', () => {
      const parts = parseGlossedText(
        'Passes graded 2+ (= ball lands within 1 m of the set window with enough arc to be settable).',
      )
      expect(parts).toEqual([
        { type: 'text', text: 'Passes ' },
        {
          type: 'gloss',
          term: 'graded 2+',
          definition: 'ball lands within 1 m of the set window with enough arc to be settable',
        },
        { type: 'text', text: '.' },
      ])
    })

    it('parses `pivot-back starts (= …)` with the plural form from the registry', () => {
      const parts = parseGlossedText(
        'Rep-paced at game tempo: quick side shuffles, then pivot-back starts (= pivot the inside foot and step back).',
      )
      expect(parts).toEqual([
        { type: 'text', text: 'Rep-paced at game tempo: quick side shuffles, then ' },
        {
          type: 'gloss',
          term: 'pivot-back starts',
          definition: 'pivot the inside foot and step back',
        },
        { type: 'text', text: '.' },
      ])
    })

    it('parses `shagger (= …)` mid-sentence with surrounding non-flagged punctuation intact', () => {
      const parts = parseGlossedText(
        'You serve toward a 2 m circle (mark it on the sand) named by your shagger (= partner across the net). Shagger calls; you toss and serve.',
      )
      expect(parts).toEqual([
        {
          type: 'text',
          text: 'You serve toward a 2 m circle (mark it on the sand) named by your ',
        },
        { type: 'gloss', term: 'shagger', definition: 'partner across the net' },
        { type: 'text', text: '. Shagger calls; you toss and serve.' },
      ])
    })
  })

  describe('multi-gloss + nested-paren cases', () => {
    it('parses two glosses in a single string (line 3320 shape)', () => {
      const parts = parseGlossedText(
        'Continuous: ankle hops (= small two-foot hops in place) then lateral shuffles (= quick sideways shuffle steps, feet never crossing).',
      )
      expect(parts).toEqual([
        { type: 'text', text: 'Continuous: ' },
        { type: 'gloss', term: 'ankle hops', definition: 'small two-foot hops in place' },
        { type: 'text', text: ' then ' },
        {
          type: 'gloss',
          term: 'lateral shuffles',
          definition: 'quick sideways shuffle steps, feet never crossing',
        },
        { type: 'text', text: '.' },
      ])
    })

    it('parses an inner gloss inside outer parentheses without consuming the outer close-paren (line 1947 shape)', () => {
      const parts = parseGlossedText(
        '(caller calls → you serve → caller shags (= brings the balls back) after the round) × 6 targets',
      )
      // The inner `(=` opens a gloss that closes at its own `)`, leaving
      // the outer `)` to render as plain text. The term span resolves
      // against `shags` from the registry (the verb form).
      expect(parts).toEqual([
        { type: 'text', text: '(caller calls → you serve → caller ' },
        { type: 'gloss', term: 'shags', definition: 'brings the balls back' },
        { type: 'text', text: ' after the round) × 6 targets' },
      ])
    })
  })

  describe('rightmost-wins on registry ambiguity (deferred-contract pin)', () => {
    /*
     * Lines 376 / 415 of `app/src/data/drills.ts` author successMetric.description
     * as `Passes graded 2+ on 0–3 rubric (= ball lands within 1 m…)`.
     * Both `graded 2+` and `0–3 rubric` are registry terms. Per the
     * parser contract (rightmost-wins), the term whose end is closest
     * to `(=` is chosen — that is `0–3 rubric`. The author's intended
     * target was `graded 2+`, so the catalog has been rewritten as
     * `Passes graded 2+ (= …) on the 0–3 rubric` to remove the ambiguity.
     *
     * This test pins the parser contract so that:
     *  - any future agent extending coverage to `successMetric.description`
     *    knows the rule before they ship;
     *  - any regression that shifts the rule (e.g. to leftmost-wins or
     *    "longest registry term") breaks here.
     */
    it('picks the registry term whose end is closest to `(= `', () => {
      const parts = parseGlossedText(
        'Passes graded 2+ on 0–3 rubric (= ball lands within 1 m of the set window with enough arc to be settable).',
      )
      const gloss = parts.find((p): p is { type: 'gloss'; term: string; definition: string } =>
        p.type === 'gloss',
      )
      expect(gloss).toBeDefined()
      expect(gloss?.term).toBe('0–3 rubric')
    })

    it('picks the longer term on a tied end position (synthetic; would arise if `shag` and `shagger` both end at the same position)', () => {
      // A synthetic case: registry contains 'foo' and 'barfoo'; prefix
      // ends with 'barfoo'. Both terms END at the same position (the end
      // of 'barfoo' is the same as the end of the embedded 'foo'). The
      // longer one wins. The catalog does not actually rely on this tie-
      // breaker, but the parser pins it for predictability.
      const registry = new Set(['foo', 'barfoo'])
      const parts = parseGlossedText('the barfoo (= a thing).', registry)
      const gloss = parts.find((p): p is { type: 'gloss'; term: string; definition: string } =>
        p.type === 'gloss',
      )
      expect(gloss?.term).toBe('barfoo')
    })
  })

  describe('fallback to last-word when no registry hit', () => {
    it('uses the last whitespace-delimited word as the term span', () => {
      const registry: ReadonlySet<string> = new Set()
      const parts = parseGlossedText('Tap the doohickey (= the small round button).', registry)
      expect(parts).toEqual([
        { type: 'text', text: 'Tap the ' },
        { type: 'gloss', term: 'doohickey', definition: 'the small round button' },
        { type: 'text', text: '.' },
      ])
    })

    it('emits the literal `(= …)` as text when the prefix is empty or only whitespace', () => {
      const registry: ReadonlySet<string> = new Set()
      const parts = parseGlossedText('(= an unanchored gloss)', registry)
      // No term to attach the gloss to — surface it as raw text so the
      // un-glossed authoring case is visible to a human reviewer.
      expect(parts).toEqual([{ type: 'text', text: '(= an unanchored gloss)' }])
    })
  })

  describe('edge cases', () => {
    it('returns the full string as a single text part when no `(= …)` matches exist', () => {
      const parts = parseGlossedText('Plain prose with no glosses.')
      expect(parts).toEqual([{ type: 'text', text: 'Plain prose with no glosses.' }])
    })

    it('returns an empty array on an empty input string', () => {
      expect(parseGlossedText('')).toEqual([])
    })

    it('preserves authored newlines in the surrounding text parts', () => {
      const parts = parseGlossedText(
        'First paragraph with graded 2+ (= a quick gloss).\n\nSecond paragraph follows.',
      )
      expect(parts).toEqual([
        { type: 'text', text: 'First paragraph with ' },
        { type: 'gloss', term: 'graded 2+', definition: 'a quick gloss' },
        { type: 'text', text: '.\n\nSecond paragraph follows.' },
      ])
    })

    it('recovers the original literal `(= …)` form when the parts are joined back to text', () => {
      // Plain-text fallback invariant: the renderer's `textContent`
      // (which joins term + ` (= ` + definition + `)`) reproduces the
      // original string. Important for screen-reader and copy-paste
      // round-trip parity.
      const original =
        'You serve toward a 2 m circle (mark it on the sand) named by your shagger (= partner across the net).'
      const parts = parseGlossedText(original)
      const recovered = parts
        .map((p) => (p.type === 'text' ? p.text : `${p.term} (= ${p.definition})`))
        .join('')
      expect(recovered).toBe(original)
    })
  })

  describe('FLAGGED_TERMS registry coverage', () => {
    /*
     * Sanity check that the canonical `FLAGGED_TERMS` set actually
     * resolves the catalog's most-repeated terms. If a term graduates
     * onto the rule 2 vocabulary table without being added to
     * `flaggedTerms.ts`, this test fails so the registry stays in sync.
     */
    it.each([
      'graded 2+',
      'shagger',
      'shags',
      'A-skip',
      'ankle hops',
      'lateral shuffles',
      'pivot-back starts',
      '0–3 rubric',
    ])('contains the canonical term `%s`', (term) => {
      expect(FLAGGED_TERMS.has(term)).toBe(true)
    })
  })
})
