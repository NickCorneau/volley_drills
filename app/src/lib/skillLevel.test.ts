import { describe, expect, it } from 'vitest'
import type { PlayerLevel } from '../types/drill'
import {
  isSkillLevel,
  SKILL_LEVELS,
  SKILL_LEVEL_LABEL,
  skillLevelToDrillBand,
  type SkillLevel,
} from './skillLevel'

describe('skillLevelToDrillBand', () => {
  it('maps each functional band to a stable drill-metadata band', () => {
    const cases: Array<[SkillLevel, PlayerLevel]> = [
      ['foundations', 'beginner'],
      ['rally_builders', 'intermediate'],
      ['side_out_builders', 'intermediate'],
      ['competitive_pair', 'advanced'],
    ]
    for (const [level, expected] of cases) {
      expect(skillLevelToDrillBand(level)).toBe(expected)
    }
  })

  it('maps "Not sure yet" to the safest starting band (beginner), matching D-C4 / D121 opt-out semantics', () => {
    expect(skillLevelToDrillBand('unsure')).toBe('beginner')
  })

  it('is exhaustive over SKILL_LEVELS (new enum values fail TS compile, not runtime)', () => {
    for (const level of SKILL_LEVELS) {
      const band = skillLevelToDrillBand(level)
      expect(['beginner', 'intermediate', 'advanced']).toContain(band)
    }
  })
})

describe('SKILL_LEVELS', () => {
  it('lists the five canonical values in ability order with unsure last', () => {
    expect(SKILL_LEVELS).toEqual([
      'foundations',
      'rally_builders',
      'side_out_builders',
      'competitive_pair',
      'unsure',
    ])
  })

  it('has a label for every enum value and no extras', () => {
    const labelKeys = Object.keys(SKILL_LEVEL_LABEL).sort()
    const enumKeys = [...SKILL_LEVELS].sort()
    expect(labelKeys).toEqual(enumKeys)
  })
})

describe('isSkillLevel', () => {
  it('accepts every canonical enum value', () => {
    for (const level of SKILL_LEVELS) {
      expect(isSkillLevel(level)).toBe(true)
    }
  })

  it('rejects legacy identity labels and anything else', () => {
    const rejects: unknown[] = [
      'beginner',
      'intermediate',
      'advanced',
      'skipped',
      '',
      'FOUNDATIONS',
      null,
      undefined,
      0,
      42,
      { level: 'foundations' },
      ['foundations'],
    ]
    for (const value of rejects) {
      expect(isSkillLevel(value)).toBe(false)
    }
  })
})
