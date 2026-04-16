import { describe, it, expect } from 'vitest'
import { PRESETS, buildPresetBlocks, getPresetsForPlayerCount } from './presets'

describe('PRESETS', () => {
  it('has unique ids', () => {
    const ids = PRESETS.map((p) => p.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('contains at least one solo and one pair preset', () => {
    expect(PRESETS.some((p) => p.playerCount === 1)).toBe(true)
    expect(PRESETS.some((p) => p.playerCount === 2)).toBe(true)
  })
})

describe('buildPresetBlocks', () => {
  it('returns blocks for every known preset', () => {
    for (const preset of PRESETS) {
      const blocks = buildPresetBlocks(preset.id)
      expect(blocks.length).toBeGreaterThan(0)
    }
  })

  it('returns empty array for unknown preset', () => {
    expect(buildPresetBlocks('nonexistent')).toEqual([])
  })

  it('every block has required fields', () => {
    for (const preset of PRESETS) {
      const blocks = buildPresetBlocks(preset.id)
      for (const block of blocks) {
        expect(block.id).toBeTruthy()
        expect(block.drillName).toBeTruthy()
        expect(block.shortName).toBeTruthy()
        expect(block.durationMinutes).toBeGreaterThan(0)
        expect(block.coachingCue).toBeTruthy()
        expect(typeof block.required).toBe('boolean')
      }
    }
  })

  it('includes warmup and wrap blocks', () => {
    for (const preset of PRESETS) {
      const blocks = buildPresetBlocks(preset.id)
      const types = blocks.map((b) => b.type)
      expect(types).toContain('warmup')
      expect(types).toContain('wrap')
    }
  })
})

describe('getPresetsForPlayerCount', () => {
  it('filters by player count 1', () => {
    const solo = getPresetsForPlayerCount(1)
    expect(solo.length).toBeGreaterThan(0)
    expect(solo.every((p) => p.playerCount === 1)).toBe(true)
  })

  it('filters by player count 2', () => {
    const pair = getPresetsForPlayerCount(2)
    expect(pair.length).toBeGreaterThan(0)
    expect(pair.every((p) => p.playerCount === 2)).toBe(true)
  })
})
