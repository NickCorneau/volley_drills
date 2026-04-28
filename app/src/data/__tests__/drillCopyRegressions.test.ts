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
  describe('lead-with-skill invariant (cca2 dogfeed F8 sweep, 2026-04-27)', () => {
    /**
     * 2026-04-27 cca2 dogfeed F8 (`docs/research/2026-04-27-cca2-
     * dogfeed-findings.md`) + courtside-copy.mdc rule 6: every
     * `m001Candidate: true` drill whose `skillFocus[0]` is one of
     * `pass | serve | set` must lead its `courtsideInstructions`
     * with the skill verb (or an unambiguous compound — `bump-set`,
     * `hand-set`, `forearm-pass`). Setup that does not include the
     * skill verb belongs in the second sentence onward.
     *
     * Founder report on `d33-pair`: "Take turns. Each partner
     * works the full 6-zone order... is this a serving drill? It's
     * really not that clear." The same pattern recurred across most
     * skill drills (paired sweep landed 2026-04-27); this test pins
     * the rule for the whole catalog so any future authoring that
     * leads with logistics breaks before it ships.
     *
     * The test extracts the FIRST WORD of `courtsideInstructions`
     * (preserving compound forms like `bump-set`) and asserts it
     * matches the per-skill regex. The first-word check is
     * intentionally strict: per-walkthrough evidence is that "how
     * far into the paragraph the skill verb appears" determines
     * whether the courtside reader notices it. First-word leads
     * win uniformly.
     *
     * Out of scope:
     *   - `m001Candidate: false` drills (they re-enter scope when
     *     the authoring-budget cap permits, at which point they get
     *     the same treatment).
     *   - Drills whose `skillFocus[0]` is `'warmup'` or `'recovery'`
     *     (no skill verb to lead with — see rule 6 §"Out of scope").
     */
    type SkillRoot = 'pass' | 'serve' | 'set'
    const SKILL_VERB_REGEX: Record<SkillRoot, RegExp> = {
      // Word-leading match for the verb root, allowing the
      // common compound `forearm-pass` and inflected forms
      // (`pass`, `passes`, `passed`, `passing`).
      pass: /^(forearm-)?pass(?:es|ed|ing)?\b/i,
      serve: /^serve(?:s|d|ing)?\b/i,
      // Set drills lead with `set`, `bump-set`, or `hand-set` (also
      // inflected: `sets`, `setting`).
      set: /^(?:bump-|hand-)?set(?:s|ting)?\b/i,
    }

    const cases = DRILLS.flatMap((drill) => {
      if (!drill.m001Candidate) return []
      const primary = drill.skillFocus[0]
      if (primary !== 'pass' && primary !== 'serve' && primary !== 'set') return []
      return drill.variants.map((variant) => ({
        drillId: drill.id,
        drillName: drill.name,
        variantId: variant.id,
        skill: primary as SkillRoot,
        copy: variant.courtsideInstructions,
      }))
    })

    it.each(cases)(
      'first word of $variantId courtsideInstructions matches the $skill verb regex',
      ({ skill, copy, variantId }) => {
        const trimmed = copy.trimStart()
        const regex = SKILL_VERB_REGEX[skill]
        expect(
          regex.test(trimmed),
          `${variantId}: first word of courtsideInstructions does not match /${regex.source}/i. Copy starts with: "${trimmed.slice(0, 60)}..."`,
        ).toBe(true)
      },
    )

    it('catalog cap: at least one skill drill exists per surfaced skill (sweep coverage signal)', () => {
      const skillsWithDrills = new Set(
        cases.map((c) => c.skill).filter((s): s is SkillRoot => s !== undefined),
      )
      // A skill with zero m001Candidate drills means the eyebrow's
      // skillLabel for that skill never appears in any session.
      // Today we expect all three skills represented; if a future
      // catalog edit drops one entirely, this test surfaces that as
      // a planning concern (the sweep that adds a new skill drill
      // re-trips the test green).
      expect(skillsWithDrills.has('pass')).toBe(true)
      expect(skillsWithDrills.has('serve')).toBe(true)
      expect(skillsWithDrills.has('set')).toBe(true)
    })
  })

  describe('d26-solo wrap copy (cca2 dogfeed F5, 2026-04-27)', () => {
    /**
     * The cca2 dogfeed founder report flagged that `d26`'s
     * `courtsideInstructions` were calibrated to `~3 min on the timer`
     * while `workload` allowed 3-6 minutes — a 25-min pair pass session
     * landed a 4-min wrap and the prior copy left a ~1.5 min "what do
     * I do?" gap. Fix: rewrite the courtside copy to honor the 3-6 min
     * range honestly, with the three-move sequence as the floor and
     * mirror / glutes / adductors as the ceiling. Same variant id;
     * pure courtside-copy edit.
     *
     * The progressionDescription field already named the longer-wrap
     * additions but it is not user-facing copy. The fix here surfaces
     * that knowledge to the courtside reader. Per
     * `.cursor/rules/courtside-copy.mdc` invariant 2 (one-season rec
     * player test), `glutes` and `adductors` are glossed inline as
     * `(back of hips)` and `(inner thighs)` respectively — both terms
     * are common-enough but not first-language for a one-season rec
     * player.
     */
    const d26 = DRILLS.find((d) => d.id === 'd26')
    const solo = d26?.variants.find((v) => v.id === 'd26-solo')

    it('exists with workload allowing the 3-6 min range', () => {
      expect(d26).toBeDefined()
      expect(solo).toBeDefined()
      if (!solo) throw new Error('d26-solo variant missing')
      expect(solo.workload.durationMinMinutes).toBe(3)
      expect(solo.workload.durationMaxMinutes).toBe(6)
    })

    it('courtsideInstructions opens with the 3-6 min range, not a hard-coded ~3 min', () => {
      if (!solo) throw new Error('d26-solo variant missing')
      const text = solo.courtsideInstructions
      expect(text).toMatch(/3 to 6 minutes on the timer/)
      // Pre-fix copy hard-coded `~3 min on the timer`. Negative
      // assertion guards against a regression that re-introduces the
      // single-duration framing.
      expect(text).not.toMatch(/~3 min on the timer/)
    })

    it('names the longer-wrap additions (mirror, glutes, adductors) at courtside', () => {
      if (!solo) throw new Error('d26-solo variant missing')
      const text = solo.courtsideInstructions.toLowerCase()
      expect(text).toMatch(/mirror to the other side/)
      expect(text).toMatch(/glutes/)
      expect(text).toMatch(/adductors/)
    })

    it('glosses the anatomy terms inline (one-season rec-player test)', () => {
      if (!solo) throw new Error('d26-solo variant missing')
      const text = solo.courtsideInstructions
      // `glutes` is glossed as `(back of hips)`; `adductors` is
      // glossed as `(inner thighs)`. Both glosses match the
      // courtside-copy.mdc §2 jargon-gate pattern (plain-language
      // first or jargon-with-paren-gloss).
      expect(text).toMatch(/glutes \(back of hips\)/)
      expect(text).toMatch(/adductors \(inner thighs\)/)
    })

    it('keeps the three-move floor structure (calf / hamstring / hip flexor)', () => {
      if (!solo) throw new Error('d26-solo variant missing')
      const text = solo.courtsideInstructions
      // Numbered list still leads with the same three staples.
      // Anatomy glosses on hamstring / hip flexor stay landed
      // (per the 2026-04-26 jargon-gloss pass).
      expect(text).toMatch(/1\. Calf:/)
      expect(text).toMatch(/2\. Hamstring \(back of thigh\):/)
      expect(text).toMatch(/3\. Hip flexor \(front of upper thigh\):/)
    })

    it('uses no em-dashes in user-visible courtside prose', () => {
      if (!solo) throw new Error('d26-solo variant missing')
      // courtside-copy.mdc §4 forbids em-dashes (U+2014) in
      // user-visible courtside prose. Hyphen-minus (`-`) in compound
      // words and en-dashes (U+2013) in numeric ranges are allowed,
      // but neither appears unnecessarily in this drill's copy.
      expect(solo.courtsideInstructions).not.toContain('\u2014')
    })
  })

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
      // 2026-04-27 cca2 dogfeed F8 sweep relaxed the literal `take
      // turns` match to `tak(e|ing) turns` because the lead-with-
      // skill rewrite shifted the construction to "Serve through
      // the 6-zone order, taking turns" (gerund). The intent
      // (round-based turn-taking, NOT per-rep alternation) is
      // unchanged; the language form just shifted to fit the new
      // first-sentence structure.
      expect(text).toMatch(/\btak(?:e|ing) turns\b/)
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
