import { describe, expect, it } from 'vitest'

import { DRILLS } from '../drills'

type ActiveCopySurface = {
  drillId: string
  variantId: string
  field: string
  text: string
}

function activeCopySurfaces(): ActiveCopySurface[] {
  return DRILLS.flatMap((drill) =>
    drill.m001Candidate
      ? [
          {
            drillId: drill.id,
            variantId: 'drill',
            field: 'name',
            text: drill.name,
          },
          {
            drillId: drill.id,
            variantId: 'drill',
            field: 'shortName',
            text: drill.shortName,
          },
          {
            drillId: drill.id,
            variantId: 'drill',
            field: 'objective',
            text: drill.objective,
          },
          ...drill.teachingPoints.map((point, index) => ({
            drillId: drill.id,
            variantId: 'drill',
            field: `teachingPoints[${index}]`,
            text: point,
          })),
          {
            drillId: drill.id,
            variantId: 'drill',
            field: 'progressionDescription',
            text: drill.progressionDescription,
          },
          {
            drillId: drill.id,
            variantId: 'drill',
            field: 'regressionDescription',
            text: drill.regressionDescription,
          },
          ...drill.variants.flatMap((variant) => {
            const surfaces: ActiveCopySurface[] = [
              {
                drillId: drill.id,
                variantId: variant.id,
                field: 'successMetric.description',
                text: variant.successMetric.description,
              },
              {
                drillId: drill.id,
                variantId: variant.id,
                field: 'successMetric.target',
                text: variant.successMetric.target ?? '',
              },
              {
                drillId: drill.id,
                variantId: variant.id,
                field: 'courtsideInstructions',
                text: variant.courtsideInstructions,
              },
              ...(variant.courtsideInstructionsBonus
                ? [
                    {
                      drillId: drill.id,
                      variantId: variant.id,
                      field: 'courtsideInstructionsBonus',
                      text: variant.courtsideInstructionsBonus,
                    },
                  ]
                : []),
              ...variant.coachingCues.map((cue, index) => ({
                drillId: drill.id,
                variantId: variant.id,
                field: `coachingCues[${index}]`,
                text: cue,
              })),
              ...(variant.segments ?? []).map((segment, index) => ({
                drillId: drill.id,
                variantId: variant.id,
                field: `segments[${index}].label`,
                text: segment.label,
              })),
            ]

            return surfaces
          }),
        ]
      : [],
  )
}

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
  describe('active drill copy contract', () => {
    it.each(activeCopySurfaces())(
      '$drillId:$variantId $field uses no em-dashes in user-visible copy',
      ({ text, drillId, variantId, field }) => {
        expect(
          text,
          `${drillId}:${variantId} ${field} contains an em-dash. Use punctuation or rewrite per courtside-copy.mdc.`,
        ).not.toContain('\u2014')
      },
    )

    it('every active variant has a concrete success metric description and target', () => {
      const issues = DRILLS.flatMap((drill) =>
        drill.m001Candidate
          ? drill.variants.flatMap((variant) => {
              const description = variant.successMetric.description.trim()
              const target = variant.successMetric.target?.trim() ?? ''
              const unresolved = /level-dependent|\bX\b/i
              return [
                description.length === 0
                  ? `${drill.id}:${variant.id} has an empty successMetric.description`
                  : undefined,
                target.length === 0
                  ? `${drill.id}:${variant.id} has an empty successMetric.target`
                  : undefined,
                unresolved.test(target)
                  ? `${drill.id}:${variant.id} has an unresolved successMetric.target: ${target}`
                  : undefined,
                unresolved.test(description)
                  ? `${drill.id}:${variant.id} has an unresolved successMetric.description: ${description}`
                  : undefined,
              ].filter((issue): issue is string => issue !== undefined)
            })
          : [],
      )

      expect(issues).toEqual([])
    })
  })

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
    // 2026-05-10 first-time-runnability sweep: rule 8 (role-tagged
    // sentences for pair drills) made `"You [skill-verb]; partner ..."`
    // the canonical pair-drill opener. The skill verb appears as word
    // 2 (after `"You"`), not word 1. Accept both shapes:
    //   - solo / pre-rule-8 style: `"Pass..."`, `"Serve..."`, `"Set..."`
    //   - rule-8 pair style:       `"You pass..."`, `"You serve..."`,
    //                              `"You set..."`
    // Rule 6's textual rule says the first **sentence** must CONTAIN
    // the skill verb; rule 8 makes "You" a permitted lead-in. Both
    // surface the skill verb early enough to land courtside.
    const SKILL_VERB_REGEX: Record<SkillRoot, RegExp> = {
      pass: /^(?:you\s+)?(?:forearm-)?pass(?:es|ed|ing)?\b/i,
      serve: /^(?:you\s+)?serve(?:s|d|ing)?\b/i,
      set: /^(?:you\s+)?(?:bump-|hand-)?set(?:s|ting)?\b/i,
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

  describe('first-time-runnability lints (2026-05-10 extension)', () => {
    /**
     * 2026-05-10 D130 founder session evidence + the strengthened
     * first-time-runnability rubric in
     * `docs/brainstorms/2026-05-10-drill-first-time-runnability-requirements.md`
     * + `.cursor/rules/courtside-copy.mdc` rules 8-14.
     *
     * These tests are mechanical lints for the rules that admit a
     * stable, low-false-positive regex check. The non-mechanical rules
     * (R10 cue->action coupling, R11 5-question logistics checklist,
     * R12 spatial POV anchor, R13 triple-only readability, R15(b-d) cue
     * ordering) remain authoring-checklist items reviewed in the per-
     * drill assessment artifact at
     * `docs/reviews/2026-05-10-drill-first-time-runnability-assessment.md`.
     *
     * Expected to surface real failures on today's catalog (this is
     * the empirical input to the per-drill assessment). U5's drill
     * copy sweep is the green-bar gate; this describe block stays in
     * the suite afterward as the regression pin.
     */

    function sentencesOf(text: string): string[] {
      // Split on sentence terminators OR semicolons followed by
      // whitespace. Semicolons in courtside copy commonly compose two
      // independent clauses (e.g., "You pass; partner flashes a
      // number..."); each clause needs to be addressable as a "sentence"
      // for the role-tagged-sentence heuristic so a partner referenced
      // after a semicolon counts as a grammatical subject.
      return text
        .split(/(?<=[.!?;])\s+/)
        .map((s) => s.trim())
        .filter(Boolean)
    }

    function firstContentWord(sentence: string): string {
      // Strip leading quotes / parens / asterisks then return the first
      // whitespace-separated token, lowercased, with trailing
      // punctuation removed.
      const stripped = sentence.replace(/^[\s"'(*]+/, '')
      const first = stripped.split(/\s+/)[0] ?? ''
      return first.toLowerCase().replace(/[.,;:!?")]+$/, '')
    }

    function wordCount(text: string): number {
      return text.trim().split(/\s+/).filter(Boolean).length
    }

    function findFirstOccurrence(haystack: string, needle: string): number {
      // Case-insensitive. Treats single-word tokens as word-bounded.
      const hayLower = haystack.toLowerCase()
      const needleLower = needle.toLowerCase()
      if (needleLower.includes(' ') || needleLower.includes('-')) {
        // Multi-word or hyphenated token: substring match is fine
        return hayLower.indexOf(needleLower)
      }
      // Word-bounded match for single-word tokens to avoid catching
      // "around" when looking for "round" or "shagger" when looking
      // for "shag".
      const re = new RegExp(`\\b${needleLower.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`)
      const match = re.exec(hayLower)
      return match ? match.index : -1
    }

    function hasGlossWithin(haystack: string, idx: number, windowChars = 120): boolean {
      // A "gloss" is a parenthetical `(...)` appearing within the window
      // after the token. The opening paren may be preceded by `is` or
      // `means` or `=` (e.g., "A-skip (= skip forward...)").
      if (idx < 0) return true // token not present
      const window = haystack.substring(idx, idx + windowChars)
      return /\(/.test(window)
    }

    /**
     * R9 (rule 8): Either-reader role-tagged sentences for pair drills.
     *
     * Heuristic: for each pair drill (`participants.roles.length >= 2`),
     * confirm that BOTH roles appear as the first content word of at
     * least one sentence in `courtsideInstructions`. Accepted synonyms:
     * `"you"` for the first listed role (the doer-by-default), and
     * `"partner"` for any non-first role.
     *
     * When `participants.roles[0] === participants.roles[1]` (e.g.,
     * d22-pair has `['server', 'server']`), the test requires BOTH
     * `"you"` AND `"partner"` to appear, since the role string alone
     * cannot distinguish the two readers.
     */
    const pairDrillCases = DRILLS.flatMap((drill) =>
      drill.m001Candidate
        ? drill.variants
            .filter((v) => (v.participants.roles?.length ?? 0) >= 2)
            .map((variant) => ({
              drillId: drill.id,
              variantId: variant.id,
              roles: variant.participants.roles as string[],
              copy: variant.courtsideInstructions,
            }))
        : [],
    )

    it.each(pairDrillCases)(
      'r9: $variantId courtsideInstructions names every role as a grammatical subject',
      ({ variantId, roles, copy }) => {
        const sentences = sentencesOf(copy)
        const firstWords = sentences.map(firstContentWord)
        const role1 = roles[0]?.toLowerCase()
        const role2 = roles[1]?.toLowerCase()

        const role1Covered = firstWords.some((w) => w === role1 || w === 'you')
        const role2Covered =
          role1 === role2
            ? firstWords.includes('you') && firstWords.includes('partner')
            : firstWords.some((w) => w === role2 || w === 'partner')

        expect(
          role1Covered,
          `${variantId}: role '${role1}' is not the first word of any sentence in courtsideInstructions (accepted: '${role1}' or 'you'). First words seen: ${JSON.stringify(firstWords)}`,
        ).toBe(true)
        expect(
          role2Covered,
          `${variantId}: role '${role2}' is not the first word of any sentence in courtsideInstructions (accepted: '${role2}' or 'partner'${role1 === role2 ? "; same-role pair drills require both 'you' and 'partner'" : ''}). First words seen: ${JSON.stringify(firstWords)}`,
        ).toBe(true)
      },
    )

    /**
     * R14 (rule 14): courtsideInstructions aloud-read ceiling.
     *
     * 45-word hard ceiling per variant. Overflow must route into
     * structured fields (segments, successMetric.description,
     * coachingCues[], participants.roles).
     *
     * No exception mechanism in this first cut. If a legitimate
     * exception emerges from U5, switch to a comment-based opt-out
     * (`// r14-exception: <reason>`) per the rule text.
     */
    const wordCountCases = DRILLS.flatMap((drill) =>
      drill.m001Candidate
        ? drill.variants.map((variant) => ({
            drillId: drill.id,
            variantId: variant.id,
            copy: variant.courtsideInstructions,
          }))
        : [],
    )

    it.each(wordCountCases)(
      'r14: $variantId courtsideInstructions stays within 45-word aloud-read ceiling',
      ({ variantId, copy }) => {
        const count = wordCount(copy)
        expect(
          count,
          `${variantId}: courtsideInstructions is ${count} words (>45). Route overflow into segments, successMetric.description, coachingCues[], or participants.roles per rule 14.`,
        ).toBeLessThanOrEqual(45)
      },
    )

    /**
     * Rule 2 extension (movement-vocabulary): first occurrence of any
     * flagged movement-vocabulary token in `courtsideInstructions` or
     * `segments[].label` must be followed within 120 characters by a
     * parenthetical (the gloss).
     */
    const MOVEMENT_VOCAB_TOKENS = [
      'a-skip',
      'ankle hops',
      'lateral shuffles',
      'lateral shuffle',
      'pivot-back start',
      "runner's lunge",
      'half-kneel',
      'hip flexor',
      'rdl',
    ]

    it.each(wordCountCases)(
      'r2-movement: $variantId glosses any movement-vocabulary token on first use',
      ({ drillId, variantId, copy }) => {
        const variant = DRILLS.find((d) => d.id === drillId)?.variants.find(
          (v) => v.id === variantId,
        )
        if (!variant) throw new Error(`${variantId} missing`)
        const allCopy =
          copy + '\n' + (variant.segments ?? []).map((s) => s.label).join('\n')
        for (const token of MOVEMENT_VOCAB_TOKENS) {
          const idx = findFirstOccurrence(allCopy, token)
          if (idx === -1) continue
          expect(
            hasGlossWithin(allCopy, idx + token.length, 120),
            `${variantId}: movement-vocabulary token '${token}' appears at char ${idx} without an inline gloss (parenthetical) within 120 chars. Apply rule 2 movement-vocabulary column from .cursor/rules/courtside-copy.mdc.`,
          ).toBe(true)
        }
      },
    )

    /**
     * Rule 2 extension (logistics-jargon): first occurrence of any
     * flagged logistics token in `courtsideInstructions` must be
     * followed within 120 characters by a parenthetical (the gloss).
     *
     * `round` and `turn` and `switch` are common English words; the
     * word-bounded match keeps the false-positive rate manageable, but
     * the heuristic still catches some legitimate uses where the
     * surrounding context disambiguates. Bias: surface failures, let
     * U5 / authoring-review judge.
     */
    const LOGISTICS_VOCAB_TOKENS = [
      'shag',
      'shags',
      'shagger',
    ]
    // Note: `round`, `turn`, `switch`, `swap`, `rotate`, `attempt`,
    // `miss`, `reset` are deferred to authoring-checklist review (rule
    // 10's 5-question logistics checklist) rather than lint, because
    // they are common English with too many legitimate unglossed uses
    // to lint cleanly. `shag` is unambiguously sport-specific and
    // unfamiliar to a one-season rec player.

    it.each(wordCountCases)(
      'r2-logistics: $variantId glosses sport-specific logistics tokens on first use',
      ({ variantId, copy }) => {
        for (const token of LOGISTICS_VOCAB_TOKENS) {
          const idx = findFirstOccurrence(copy, token)
          if (idx === -1) continue
          // For "shag" / "shags" / "shagger", accept either a same-
          // sentence parenthetical OR an inline definition (e.g.,
          // "shag the ball — collect it from the receiver's side").
          // The 120-char window after the token covers the same-
          // sentence case.
          expect(
            hasGlossWithin(copy, idx + token.length, 120),
            `${variantId}: logistics token '${token}' at char ${idx} lacks an inline gloss within 120 chars. Apply rule 2 logistics-vocabulary column from .cursor/rules/courtside-copy.mdc, e.g., "shag (collect the balls from the receiver's side and bring them back)".`,
          ).toBe(true)
        }
      },
    )

    /**
     * Rule 2 extension (scoring-vocabulary): when any of `courtsideInstructions`
     * or `successMetric.description` uses graded vocabulary, an operational
     * definition must appear inline in the same string (parenthetical or
     * `=` definition).
     *
     * 2026-05-10 final-audit polish: scope expanded from
     * `successMetric.description` only to all user-visible drill copy strings,
     * because graded vocab leaks through `courtsideInstructions` too (caught
     * `d18-pair`'s `"Grade each pass 0-3"` in the final audit). Token list
     * also extended with hyphenated `"good-pass"` and the numeric scale
     * `"0-3"` so the lint catches both phrasings.
     */
    const SCORING_VOCAB_TOKENS = [
      'grade 2+',
      'graded 2+',
      'grade 3+',
      'graded 3+',
      'grade 3 pass',
      'good pass',
      'good-pass',
      'controlled set',
      'in-system',
      '0-3 rubric',
      '0-3 scale',
    ]

    const scoringScopeCases = DRILLS.flatMap((drill) =>
      drill.m001Candidate
        ? drill.variants.map((variant) => ({
            drillId: drill.id,
            variantId: variant.id,
            description: variant.successMetric.description,
            courtsideInstructions: variant.courtsideInstructions,
          }))
        : [],
    )

    it.each(scoringScopeCases)(
      'r2-scoring: $variantId successMetric.description self-contains any graded vocabulary',
      ({ variantId, description }) => {
        for (const token of SCORING_VOCAB_TOKENS) {
          const idx = findFirstOccurrence(description, token)
          if (idx === -1) continue
          const hasParenthetical = description.includes('(')
          const hasEquals = description.includes('=')
          expect(
            hasParenthetical || hasEquals,
            `${variantId}: successMetric.description uses graded vocabulary '${token}' without an inline operational definition (parenthetical or '='). Apply rule 2 scoring-vocabulary column, e.g., "Passes graded 2+ (= ball lands within 1 m of the set window with enough arc to be settable)".`,
          ).toBe(true)
        }
      },
    )

    it.each(scoringScopeCases)(
      'r2-scoring: $variantId courtsideInstructions self-contains any graded vocabulary',
      ({ variantId, courtsideInstructions }) => {
        for (const token of SCORING_VOCAB_TOKENS) {
          const idx = findFirstOccurrence(courtsideInstructions, token)
          if (idx === -1) continue
          // Local-window check: a gloss appears within 120 chars after
          // the token (same-sentence gloss). Whole-string check is too
          // permissive for prose because a parenthetical elsewhere in
          // the same instructions string might not be the gloss for
          // this occurrence.
          const ok = hasGlossWithin(courtsideInstructions, idx + token.length, 120)
          expect(
            ok,
            `${variantId}: courtsideInstructions uses graded vocabulary '${token}' at char ${idx} without an inline operational definition within 120 chars. Apply rule 2 scoring-vocabulary column at point of use.`,
          ).toBe(true)
        }
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

    it('uses round-based turn-taking language (one collect per round, not per rep)', () => {
      if (!pair) throw new Error('pair variant missing')
      const text = pair.courtsideInstructions.toLowerCase()
      // 2026-05-10 first-time-runnability sweep rewrote the copy to
      // open with `"You serve; shagger ... calls the zone, then
      // collects after the 6-zone round."`. The same anti-regression
      // the 2026-04-27 finding cared about (one collect per round,
      // not per-rep server alternation) is now expressed as "after
      // the 6-zone round" + an explicit role-swap at end. The 2026-
      // 04-27 form ("taking turns" + "shags after the round") is no
      // longer in the copy; the round-based intent is preserved.
      expect(text).toMatch(/after the 6-zone round/)
      expect(text).toMatch(/switch roles/)
    })

    it('does not claim per-rep server alternation (incompatible with one ball)', () => {
      if (!pair) throw new Error('pair variant missing')
      const text = pair.courtsideInstructions.toLowerCase()
      expect(text).not.toMatch(/alternate servers each rep/)
      expect(text).not.toMatch(/switch every serve/)
    })

    it('keeps the 6-zone ladder + miss-handling rule in the courtside copy', () => {
      if (!pair) throw new Error('pair variant missing')
      const text = pair.courtsideInstructions.toLowerCase()
      expect(text).toContain('front-left')
      expect(text).toContain('front-middle')
      expect(text).toContain('front-right')
      expect(text).toContain('back-left')
      expect(text).toContain('back-middle')
      expect(text).toContain('back-right')
      // 2026-05-10 first-time-runnability sweep: miss-handling
      // language shifted from "miss repeats the same zone" to the
      // more compact "Miss → repeat; after 3 misses, move on."
      // (rule 10 5-question logistics checklist requires an escape
      // clause for unbounded miss-loops). The repeat-on-miss
      // anti-regression is preserved; the escape clause is new.
      expect(text).toMatch(/miss\s*[—→-]\s*repeat/)
      expect(text).toMatch(/after 3 misses/)
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
