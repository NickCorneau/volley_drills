import { describe, expect, it } from 'vitest'
import {
  AVOID_PHRASES,
  FORBIDDEN_RE,
  scanElementForForbidden,
  scanForForbidden,
} from './copyGuard'

describe('copyGuard (V0B-18)', () => {
  describe('FORBIDDEN_RE positive cases', () => {
    it.each(AVOID_PHRASES)('matches %s as a whole word', (phrase) => {
      expect(FORBIDDEN_RE.test(`You'll see your ${phrase} soon.`)).toBe(true)
    })

    it('matches "first N days" with any digit', () => {
      expect(FORBIDDEN_RE.test('In the first 7 days...')).toBe(true)
      expect(FORBIDDEN_RE.test('In the first 14 days...')).toBe(true)
      expect(FORBIDDEN_RE.test('In the first 2 days...')).toBe(true)
    })

    it('is case-insensitive', () => {
      expect(FORBIDDEN_RE.test('Compared to last session')).toBe(true)
      expect(FORBIDDEN_RE.test('SPIKE in effort')).toBe(true)
    })
  })

  describe('FORBIDDEN_RE negative cases', () => {
    it('does NOT match compound / prefixed forms', () => {
      expect(FORBIDDEN_RE.test('progression matrix')).toBe(false)
      expect(FORBIDDEN_RE.test('spikes of coffee')).toBe(false) // plural
      expect(FORBIDDEN_RE.test('baselines plural')).toBe(false)
      expect(FORBIDDEN_RE.test('overloaded socket')).toBe(false)
    })

    it('does NOT match innocent adjacent words', () => {
      expect(FORBIDDEN_RE.test('first time')).toBe(false)
      expect(FORBIDDEN_RE.test('early bird')).toBe(false)
      expect(FORBIDDEN_RE.test('injured finger')).toBe(false) // no "risk"
      expect(FORBIDDEN_RE.test('trending topic')).toBe(false)
    })

    it('does NOT match "first N days" without digits', () => {
      expect(FORBIDDEN_RE.test('first few days')).toBe(false)
      expect(FORBIDDEN_RE.test('first some days')).toBe(false)
    })

    it('does NOT match on innocuous session copy', () => {
      expect(
        FORBIDDEN_RE.test('Set your RPE when the session is over.'),
      ).toBe(false)
      expect(
        FORBIDDEN_RE.test('Finish Review / Skip review / Same as last time'),
      ).toBe(false)
    })
  })

  describe('scanForForbidden', () => {
    it('returns every match, not just the first', () => {
      const matches = scanForForbidden(
        'This is a spike and an overload warning.',
      )
      expect(matches.map((m) => m.toLowerCase())).toEqual(['spike', 'overload'])
    })

    it('returns empty array on clean copy', () => {
      expect(scanForForbidden('Nothing forbidden here.')).toEqual([])
    })
  })

  describe('scanElementForForbidden', () => {
    it('catches matches in ARIA attributes that bare text sweeps miss', () => {
      const el = document.createElement('div')
      el.innerHTML = `
        <p>Clean body copy.</p>
        <button aria-label="View your progress">i</button>
      `
      // textContent misses aria-label.
      expect(scanForForbidden(el.textContent ?? '')).toEqual([])
      // scanElementForForbidden catches it.
      expect(scanElementForForbidden(el).map((m) => m.toLowerCase())).toContain(
        'progress',
      )
    })

    it('catches matches in title and alt attributes too', () => {
      const el = document.createElement('div')
      el.innerHTML = `
        <span title="Compared to yesterday">?</span>
        <img alt="Injury risk heatmap" />
      `
      const matches = scanElementForForbidden(el).map((m) => m.toLowerCase())
      expect(matches).toContain('compared')
      expect(matches).toContain('injury risk')
    })

    it('returns empty when body + attributes are clean', () => {
      const el = document.createElement('div')
      el.innerHTML = `
        <p>Finish Review</p>
        <button aria-label="Back">&larr;</button>
      `
      expect(scanElementForForbidden(el)).toEqual([])
    })
  })
})
