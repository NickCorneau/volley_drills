import { describe, expect, it } from 'vitest'
import type { BlockSlotType, SetupContext, SkillFocus } from '../../../model'
import { effectiveSkillTags } from '../effectiveFocus'

const baseContext: SetupContext = {
  playerMode: 'pair',
  timeProfile: 25,
  netAvailable: true,
  wallAvailable: false,
}

function resolve(
  slotType: BlockSlotType,
  sessionFocus: SetupContext['sessionFocus'],
  fallback: readonly SkillFocus[] | undefined = ['pass', 'serve'],
) {
  return effectiveSkillTags(slotType, { ...baseContext, sessionFocus }, fallback)
}

describe('effectiveSkillTags', () => {
  it('narrows main-skill tags to explicit session focus', () => {
    expect(resolve('main_skill', 'serve')).toEqual(['serve'])
  })

  it('narrows pressure tags to explicit session focus', () => {
    expect(resolve('pressure', 'pass')).toEqual(['pass'])
  })

  it('keeps support slots recommendation-owned', () => {
    expect(resolve('warmup', 'serve', ['warmup', 'movement'])).toEqual(['warmup', 'movement'])
    expect(resolve('wrap', 'serve', ['recovery'])).toEqual(['recovery'])
  })

  it('returns fallback when no session focus is set', () => {
    expect(resolve('main_skill', undefined)).toEqual(['pass', 'serve'])
    expect(resolve('pressure', undefined)).toEqual(['pass', 'serve'])
  })

  it('narrows to focus even when focus is not in the fallback tags', () => {
    expect(resolve('main_skill', 'serve', ['pass'])).toEqual(['serve'])
  })

  it('preserves undefined fallback for recommendation-owned slots', () => {
    expect(effectiveSkillTags('technique', { ...baseContext, sessionFocus: 'serve' }, undefined)).toBeUndefined()
  })
})
