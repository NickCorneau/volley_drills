import { describe, expect, it } from 'vitest'
import type { EyebrowSkillFocus } from '../../domain/drillMetadata'
import { blockEyebrowLabel, phaseLabel, skillLabel } from '../format'
import type { BlockSlotType } from '../../types/session'

/**
 * 2026-04-27 cca2 dogfeed F1 (`docs/research/2026-04-27-cca2-dogfeed-
 * findings.md`): un-collapsed `phaseLabel` from the F8-era three-label
 * shape (`Warm up` / `Work` / `Downshift` — where the four mid-session
 * slot types all shared `Work`) to the full six-label shape, so
 * structural role becomes visible on the run-flow header eyebrow.
 *
 * The labels are user-facing courtside copy. This test pins the exact
 * vocabulary so a silent re-collapse or copy drift can't slip through.
 * Vocabulary call (founder, 2026-04-27) chose direct over softer:
 * `Technique` over `Foundation`, `Movement` over `Footwork`, `Main
 * drill` over `Today's main`, `Pressure` over `Challenge`. Sentence
 * case (Phase F8); no all-caps; no trailing punctuation.
 */

describe('phaseLabel', () => {
  it.each<[BlockSlotType, string]>([
    ['warmup', 'Warm up'],
    ['technique', 'Technique'],
    ['movement_proxy', 'Movement'],
    ['main_skill', 'Main drill'],
    ['pressure', 'Pressure'],
    ['wrap', 'Downshift'],
  ])('renders the un-collapsed role label for %s', (type, expected) => {
    expect(phaseLabel(type)).toBe(expected)
  })

  it('does not return the F8-era collapsed `Work` label for any mid-session slot type', () => {
    const midSessionTypes: BlockSlotType[] = [
      'technique',
      'movement_proxy',
      'main_skill',
      'pressure',
    ]
    for (const type of midSessionTypes) {
      expect(phaseLabel(type)).not.toBe('Work')
    }
  })

  it('keeps sentence case (no all-caps, no trailing punctuation)', () => {
    const types: BlockSlotType[] = [
      'warmup',
      'technique',
      'movement_proxy',
      'main_skill',
      'pressure',
      'wrap',
    ]
    for (const type of types) {
      const label = phaseLabel(type)
      expect(label).toBe(label.charAt(0).toUpperCase() + label.slice(1).toLowerCase())
      expect(label).not.toMatch(/[.!?]$/)
    }
  })
})

/**
 * 2026-04-27 cca2 dogfeed F8 follow-up: the eyebrow now composes slot
 * role + drill skill (`Main drill · Serve`) so the courtside reader
 * sees the skill on first glance. Vocabulary tests pin the three
 * surfaced skills and the compose-rule edge cases (warmup / wrap stay
 * skill-omitted by design; null skill collapses to the bare slot
 * label).
 */
describe('skillLabel', () => {
  it.each<[EyebrowSkillFocus, string]>([
    ['pass', 'Pass'],
    ['serve', 'Serve'],
    ['set', 'Set'],
  ])('renders the user-facing label for %s', (skill, expected) => {
    expect(skillLabel(skill)).toBe(expected)
  })
})

describe('blockEyebrowLabel', () => {
  it('returns just the slot label for warmup (skill omitted by design)', () => {
    expect(blockEyebrowLabel('warmup', null)).toBe('Warm up')
    // Even if a skill is somehow passed, warmup still ignores it
    // (the `skillFocus: ['warmup']` on the catalog drill won't
    // resolve to an EyebrowSkillFocus, but the contract should hold
    // even if a future caller passes a non-null skill).
    expect(blockEyebrowLabel('warmup', 'pass')).toBe('Warm up')
  })

  it('returns just the slot label for wrap (skill omitted by design)', () => {
    expect(blockEyebrowLabel('wrap', null)).toBe('Downshift')
    expect(blockEyebrowLabel('wrap', 'pass')).toBe('Downshift')
  })

  it.each<[BlockSlotType, EyebrowSkillFocus, string]>([
    ['technique', 'pass', 'Technique · Pass'],
    ['technique', 'serve', 'Technique · Serve'],
    ['technique', 'set', 'Technique · Set'],
    ['movement_proxy', 'pass', 'Movement · Pass'],
    ['main_skill', 'pass', 'Main drill · Pass'],
    ['main_skill', 'serve', 'Main drill · Serve'],
    ['main_skill', 'set', 'Main drill · Set'],
    ['pressure', 'pass', 'Pressure · Pass'],
    ['pressure', 'serve', 'Pressure · Serve'],
  ])('composes %s × %s as `%s`', (type, skill, expected) => {
    expect(blockEyebrowLabel(type, skill)).toBe(expected)
  })

  it.each<BlockSlotType>(['technique', 'movement_proxy', 'main_skill', 'pressure'])(
    'falls back to bare slot label for %s when the skill is null (drill not in catalog / synthetic test)',
    (type) => {
      expect(blockEyebrowLabel(type, null)).toBe(phaseLabel(type))
    },
  )

  it('uses the canonical middle-dot separator (U+00B7), not a hyphen or pipe', () => {
    const composed = blockEyebrowLabel('main_skill', 'serve')
    expect(composed).toContain('\u00B7')
    expect(composed).not.toContain('|')
    expect(composed).not.toMatch(/(?<=\s)-(?=\s)/) // standalone hyphen
  })
})
