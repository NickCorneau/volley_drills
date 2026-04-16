import { describe, expect, it } from 'vitest'
import { selectArchetype } from './archetypes'

// Directly exercises the D102/D103 selection rules so the intent is pinned
// independently of downstream drill-assembly behavior in buildDraft.
describe('selectArchetype (D102/D103)', () => {
  describe('solo priority: net > wall > open', () => {
    it('returns solo_net when only net is available', () => {
      expect(
        selectArchetype({ playerMode: 'solo', netAvailable: true, wallAvailable: false })?.id,
      ).toBe('solo_net')
    })

    it('returns solo_wall when only wall is available', () => {
      expect(
        selectArchetype({ playerMode: 'solo', netAvailable: false, wallAvailable: true })?.id,
      ).toBe('solo_wall')
    })

    it('returns solo_open when neither is available (D102 default)', () => {
      expect(
        selectArchetype({ playerMode: 'solo', netAvailable: false, wallAvailable: false })?.id,
      ).toBe('solo_open')
    })

    it('returns solo_net when both net and wall are available (D103 tie-break)', () => {
      // A wall at a net-equipped facility is almost always incidental;
      // net-led serve-receive transfer is the better default.
      expect(
        selectArchetype({ playerMode: 'solo', netAvailable: true, wallAvailable: true })?.id,
      ).toBe('solo_net')
    })
  })

  describe('pair priority: net > open', () => {
    it('returns pair_net when net is available', () => {
      expect(
        selectArchetype({ playerMode: 'pair', netAvailable: true, wallAvailable: false })?.id,
      ).toBe('pair_net')
    })

    it('returns pair_open when net is not available', () => {
      expect(
        selectArchetype({ playerMode: 'pair', netAvailable: false, wallAvailable: false })?.id,
      ).toBe('pair_open')
    })

    it('ignores wallAvailable for pair mode', () => {
      expect(
        selectArchetype({ playerMode: 'pair', netAvailable: false, wallAvailable: true })?.id,
      ).toBe('pair_open')
    })
  })
})
