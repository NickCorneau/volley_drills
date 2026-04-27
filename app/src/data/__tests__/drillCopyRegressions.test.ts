import { describe, expect, it } from 'vitest'

import { DRILLS } from '../drills'

/**
 * Focused regression pins for drill catalog copy that the red-team
 * review caught after a sweep landed. Each test names the finding and
 * the date so a future sweep that re-introduces the same mismatch
 * (e.g. by copying a sibling variant's voice without re-grounding it
 * against the variant's own equipment / participants envelope) breaks
 * before it ships.
 *
 * Not a general invariant. A general "one-ball pair-cadence honesty"
 * rule is hard to express without false positives (some Pair variants
 * legitimately alternate per-rep when the shagger is the next-up
 * server, which only works with `equipment.balls > 1`). These tests
 * pin the specific copy shapes the red-team flagged so the catalog
 * stays honest about what each variant actually looks like courtside.
 */

describe('drill copy regressions', () => {
  describe('d33-pair (red-team adversarial finding 2026-04-27)', () => {
    /**
     * The 2026-04-27 solo-vs-pair sweep originally shipped d33-pair
     * with `Alternate servers each rep; shagger stays across the net
     * to call the next zone and shag between rounds.` The two halves
     * of that sentence cannot both be true with `equipment.balls: 1`:
     *  - "Alternate servers each rep" implies the ball is back in the
     *    next server's hand after every serve, which only works with
     *    a second ball or a per-rep shag-and-throw-back pattern.
     *  - "shag between rounds" implies the ball stays across the net
     *    until the round ends and the shagger collects it once.
     *
     * The corrected copy commits to round-based turn-taking (each
     * partner runs the full 6-zone ladder; partner shags after the
     * round) so the shagger has one shag per round and the cadence
     * matches the one-ball reality.
     */
    const d33 = DRILLS.find((d) => d.id === 'd33')
    const pair = d33?.variants.find((v) => v.id === 'd33-pair')

    it('exists and is a Pair variant with one ball + two participants', () => {
      expect(d33).toBeDefined()
      expect(pair).toBeDefined()
      if (!pair) throw new Error('pair variant missing')
      expect(pair.label).toBe('Pair')
      expect(pair.equipment.balls).toBe(1)
      expect(pair.participants).toMatchObject({ min: 2, ideal: 2, max: 2 })
    })

    it('uses round-based turn-taking language (one shag per round, not per rep)', () => {
      if (!pair) throw new Error('pair variant missing')
      const text = pair.courtsideInstructions.toLowerCase()
      expect(text).toMatch(/\btake turns\b/)
      expect(text).toMatch(/\bshags? after the round\b/)
    })

    it('does not claim per-rep server alternation (incompatible with one ball)', () => {
      if (!pair) throw new Error('pair variant missing')
      const text = pair.courtsideInstructions.toLowerCase()
      expect(text).not.toMatch(/alternate servers each rep/)
      expect(text).not.toMatch(/switch every serve/)
    })

    it('keeps the 6-zone ladder + miss-repeat rule in the courtside copy', () => {
      if (!pair) throw new Error('pair variant missing')
      const text = pair.courtsideInstructions.toLowerCase()
      expect(text).toContain('front-left')
      expect(text).toContain('front-middle')
      expect(text).toContain('front-right')
      expect(text).toContain('back-left')
      expect(text).toContain('back-middle')
      expect(text).toContain('back-right')
      expect(text).toMatch(/miss repeats the same zone/)
    })

    /**
     * `.cursor/rules/courtside-copy.mdc` §Invariant 4 forbids em-dashes
     * in user-visible courtside copy. The prior d33-pair copy used a
     * semicolon, but rewrites under time pressure occasionally
     * reintroduce em-dashes; pin it so the regression is visible.
     */
    it('uses period punctuation, no em-dashes (courtside-copy §Invariant 4)', () => {
      if (!pair) throw new Error('pair variant missing')
      expect(pair.courtsideInstructions).not.toContain('—')
      expect(pair.coachingCues.join(' ')).not.toContain('—')
    })
  })
})
