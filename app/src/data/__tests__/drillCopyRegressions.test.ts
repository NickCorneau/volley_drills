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

    it('names the accessory bonus additions (glutes, adductors) in the bonus copy', () => {
      if (!solo) throw new Error('d26-solo variant missing')
      // 2026-04-28 (`docs/plans/2026-04-28-per-move-pacing-indicator.md`):
      // the bonus copy renders below the segment list ONLY when all
      // three segments have completed (overflow / bonus territory).
      // Post-each-side iteration the bonus dropped the "mirror to
      // the other side" clause because mirroring is now built into
      // each segment via `eachSide: true` (~30 s per side within
      // the 60 s segment time). Bonus is now purely accessory.
      const bonus = solo.courtsideInstructionsBonus?.toLowerCase() ?? ''
      expect(bonus).toMatch(/glutes/)
      expect(bonus).toMatch(/adductors/)
      // Negative assertion: the "mirror" clause must NOT reappear
      // post each-side iteration; if it does, the floor and bonus
      // are out of sync.
      expect(bonus).not.toMatch(/mirror to the other side/)
    })

    it('glosses the anatomy terms inline (one-season rec-player test)', () => {
      if (!solo) throw new Error('d26-solo variant missing')
      // `glutes` is glossed as `(back of hips)`; `adductors` is
      // glossed as `(inner thighs)` — both inside the bonus copy
      // post-segment-split. The segment labels gloss `back of thigh`
      // and `front of upper thigh` for hamstring / hip flexor.
      // Both follow the courtside-copy.mdc §2 jargon-gate pattern.
      const bonus = solo.courtsideInstructionsBonus ?? ''
      expect(bonus).toMatch(/glutes \(back of hips\)/)
      expect(bonus).toMatch(/adductors \(inner thighs\)/)
      const segmentLabels = (solo.segments ?? []).map((s) => s.label).join('\n')
      expect(segmentLabels).toMatch(/Hamstring \(back of thigh\):/)
      expect(segmentLabels).toMatch(/Hip flexor \(front of upper thigh\):/)
    })

    it('marks all three stretches as eachSide (each-side iteration: mirror is built into the floor)', () => {
      if (!solo) throw new Error('d26-solo variant missing')
      // 2026-04-28 dogfeed: every d26 stretch is unilateral. The
      // 3-min floor now covers both sides (~30 s per side within
      // the authored 60 s segment time). SegmentList renders an
      // "(each side)" suffix so the user knows to switch sides.
      expect(solo.segments).toBeDefined()
      for (const seg of solo.segments ?? []) {
        expect(seg.eachSide).toBe(true)
      }
    })

    it('keeps the three-move floor structure as authored segments (calf / hamstring / hip flexor)', () => {
      if (!solo) throw new Error('d26-solo variant missing')
      // 2026-04-28: the three staples now live on `segments`, each
      // with its own authored 60 s duration. RunScreen renders them
      // as a position-aware list with the active row highlighted.
      // The numbered prose list is no longer authored on
      // `courtsideInstructions` (that's now intro-only).
      expect(solo.segments).toBeDefined()
      expect(solo.segments).toHaveLength(3)
      expect(solo.segments?.[0].label).toMatch(/^Calf:/)
      expect(solo.segments?.[1].label).toMatch(/^Hamstring \(back of thigh\):/)
      expect(solo.segments?.[2].label).toMatch(/^Hip flexor \(front of upper thigh\):/)
      expect(solo.segments?.every((s) => s.durationSec === 60)).toBe(true)
    })

    it('uses no em-dashes in user-visible courtside prose (intro, bonus, segment labels)', () => {
      if (!solo) throw new Error('d26-solo variant missing')
      // courtside-copy.mdc §4 forbids em-dashes (U+2014) in
      // user-visible courtside prose. Hyphen-minus (`-`) in compound
      // words and en-dashes (U+2013) in numeric ranges are allowed.
      // Post-split, the check covers the intro, the bonus copy, and
      // every segment label.
      expect(solo.courtsideInstructions).not.toContain('\u2014')
      expect(solo.courtsideInstructionsBonus ?? '').not.toContain('\u2014')
      for (const segment of solo.segments ?? []) {
        expect(segment.label).not.toContain('\u2014')
      }
    })
  })

  describe('active warmup and wrap pacing metadata (build-17 F3, 2026-04-28)', () => {
    /**
     * Build-17 pair dogfeed F3 repeated the cooldown / sub-block beep
     * complaint after the wake-lock + audio-primer work shipped.
     *
     * 2026-04-28 ship (`docs/plans/2026-04-28-per-move-pacing-indicator.md`):
     * the three M001-active timed drills now declare structured
     * `segments` instead of the uniform `subBlockIntervalSeconds`.
     * Each segment carries a label + integer duration, the per-segment
     * end beep replaces the uniform tick, and RunScreen renders the
     * segments as a position-aware list. Catalog validation enforces
     * `sum(segments[].durationSec) === workload.durationMinMinutes * 60`,
     * so this regression test only needs to assert presence + the
     * authored interval cadence (proxy: every segment's `durationSec`).
     *
     * U3 lands `d28-solo`; U4 lands `d26-solo`; U5 lands `d25-solo`.
     */
    const segmentCases = [
      {
        drillId: 'd28',
        variantId: 'd28-solo',
        expectedSegmentCount: 4,
        expectedDurationSec: 45,
      },
      {
        drillId: 'd26',
        variantId: 'd26-solo',
        expectedSegmentCount: 3,
        expectedDurationSec: 60,
      },
      {
        drillId: 'd25',
        variantId: 'd25-solo',
        expectedSegmentCount: 5,
        // d25-solo segments are not uniform; assertion below uses the
        // total-sum check instead of the per-segment expectedDurationSec.
        expectedDurationSec: undefined,
      },
    ]

    it.each(segmentCases)(
      '$variantId declares structured segments and retires subBlockIntervalSeconds',
      ({ drillId, variantId, expectedSegmentCount, expectedDurationSec }) => {
        const drill = DRILLS.find((d) => d.id === drillId)
        const variant = drill?.variants.find((v) => v.id === variantId)

        expect(drill).toBeDefined()
        expect(variant).toBeDefined()
        if (!variant) throw new Error(`${variantId} variant missing`)

        expect(variant.subBlockIntervalSeconds).toBeUndefined()
        expect(variant.segments).toBeDefined()
        expect(variant.segments).toHaveLength(expectedSegmentCount)
        for (const segment of variant.segments ?? []) {
          expect(segment.id.startsWith(`${variantId}-s`)).toBe(true)
          expect(segment.label.length).toBeGreaterThan(0)
          expect(Number.isInteger(segment.durationSec) && segment.durationSec > 0).toBe(true)
          if (expectedDurationSec !== undefined) {
            expect(segment.durationSec).toBe(expectedDurationSec)
          }
        }

        // Catalog-validation also checks this, but pinning it here
        // makes the per-drill regression self-explanatory.
        const sum = (variant.segments ?? []).reduce((s, x) => s + x.durationSec, 0)
        expect(sum).toBe(variant.workload.durationMinMinutes * 60)
      },
    )

    /*
     * Drills that have not yet been migrated to `segments` retain the
     * legacy `subBlockIntervalSeconds` contract. U4 / U5 will move
     * these cases into `segmentCases` above as each ships.
     */
    /*
     * All three M001-active timed drills (d25, d26, d28) shipped
     * structured segments in 2026-04-28's `per-move-pacing-indicator`
     * plan. There are no remaining drills on the legacy uniform-tick
     * path. The empty array stays as a placeholder so any future
     * timed drill that ships pre-segment metadata gets a consistent
     * regression home; remove it when no future need is anticipated.
     */
    const legacyPacingCases: Array<{ drillId: string; variantId: string; interval: number }> = []

    it.each(legacyPacingCases)(
      '$variantId carries legacy pacing metadata for Run-screen sub-block ticks (pre-segment)',
      ({ drillId, variantId, interval }) => {
        const drill = DRILLS.find((d) => d.id === drillId)
        const variant = drill?.variants.find((v) => v.id === variantId)

        expect(drill).toBeDefined()
        expect(variant).toBeDefined()
        if (!variant) throw new Error(`${variantId} variant missing`)
        expect(variant.subBlockIntervalSeconds).toBe(interval)
      },
    )
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
