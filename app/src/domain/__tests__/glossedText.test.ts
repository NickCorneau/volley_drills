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

    it('parses an inner gloss inside outer parentheses without consuming the outer close-paren (nested-gloss-in-parens shape)', () => {
      const parts = parseGlossedText(
        '(caller calls → you serve → caller shags (= brings the balls back) after the round) × 6 targets',
      )
      // The inner `(=` opens a gloss that closes at its own `)`, leaving
      // the outer `)` to render as plain text. The term span resolves
      // against `shags` from the registry (the verb form). Synthetic
      // specimen: the catalog no longer authors this shape after the
      // 2026-06-30 d33-pair-open readability rewrite, but the parser must
      // still handle a nested gloss defensively, so the pin stays.
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

  describe('case-insensitive registry matching (D175 capitalized segment leads)', () => {
    /*
     * D175 (2026-06-30): segment rows lead sentence-case so the live
     * SegmentList reads as properly capitalized under its capitalized
     * cadence header. The registry enumerates terms lowercase, so the
     * parser matches case-insensitively and slices the ORIGINAL prefix for
     * the displayed term. Without this, a capitalized multi-word term at a
     * row start (e.g. `Hip flexor`) fell back to its last word (`flexor`),
     * shrinking the gloss underline. These pin the d26-s3 + d28-s1 shapes.
     */
    it('resolves a capitalized multi-word registry term at a sentence start (keeps original casing)', () => {
      const parts = parseGlossedText(
        'Hip flexor (= front of upper thigh): half-kneel (= one knee on the ground, other foot in front), squeeze the back-leg glute.',
      )
      expect(parts).toEqual([
        { type: 'gloss', term: 'Hip flexor', definition: 'front of upper thigh' },
        { type: 'text', text: ': ' },
        {
          type: 'gloss',
          term: 'half-kneel',
          definition: 'one knee on the ground, other foot in front',
        },
        { type: 'text', text: ', squeeze the back-leg glute.' },
      ])
    })

    it('resolves a single registry term after a capitalized non-term lead (A-skip survives `Jog or`)', () => {
      const parts = parseGlossedText(
        'Jog or A-skip (= skip forward, lifting the front knee) around the loop.',
      )
      expect(parts).toEqual([
        { type: 'text', text: 'Jog or ' },
        { type: 'gloss', term: 'A-skip', definition: 'skip forward, lifting the front knee' },
        { type: 'text', text: ' around the loop.' },
      ])
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
