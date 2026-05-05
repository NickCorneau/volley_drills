import { describe, expect, it } from 'vitest'
import type { Drill, DrillVariant } from '../../../model'
import type { SelectionCandidate } from '../../drillSelection'
import { partitionByLevel } from '../partitionByLevel'

function makeCandidate(
  id: string,
  levelMin: Drill['levelMin'],
  levelMax: Drill['levelMax'],
): SelectionCandidate {
  const drill = {
    id,
    name: id,
    shortName: id,
    skillFocus: ['pass'],
    objective: '',
    levelMin,
    levelMax,
    chainId: 'chain-test',
    sourceRefs: [],
    m001Candidate: true,
    variants: [],
  } as unknown as Drill
  const variant = { id: `${id}-v` } as unknown as DrillVariant
  return { drill, variant }
}

describe('partitionByLevel', () => {
  describe('band-contains predicate', () => {
    it("includes drills whose [min, max] band contains 'beginner'", () => {
      const candidates = [
        makeCandidate('a', 'beginner', 'beginner'),
        makeCandidate('b', 'beginner', 'intermediate'),
        makeCandidate('c', 'beginner', 'advanced'),
      ]
      const { inBand, outOfBand } = partitionByLevel(candidates, 'beginner')
      expect(inBand.map((c) => c.drill.id)).toEqual(['a', 'b', 'c'])
      expect(outOfBand).toEqual([])
    })

    it("includes drills whose band contains 'intermediate'", () => {
      const candidates = [
        makeCandidate('a', 'beginner', 'beginner'),
        makeCandidate('b', 'beginner', 'intermediate'),
        makeCandidate('c', 'intermediate', 'intermediate'),
        makeCandidate('d', 'intermediate', 'advanced'),
        makeCandidate('e', 'advanced', 'advanced'),
      ]
      const { inBand, outOfBand } = partitionByLevel(candidates, 'intermediate')
      expect(inBand.map((c) => c.drill.id)).toEqual(['b', 'c', 'd'])
      expect(outOfBand.map((c) => c.drill.id)).toEqual(['a', 'e'])
    })

    it("includes drills whose band contains 'advanced'", () => {
      const candidates = [
        makeCandidate('a', 'beginner', 'beginner'),
        makeCandidate('b', 'beginner', 'intermediate'),
        makeCandidate('c', 'beginner', 'advanced'),
        makeCandidate('d', 'intermediate', 'advanced'),
        makeCandidate('e', 'advanced', 'advanced'),
      ]
      const { inBand, outOfBand } = partitionByLevel(candidates, 'advanced')
      expect(inBand.map((c) => c.drill.id)).toEqual(['c', 'd', 'e'])
      expect(outOfBand.map((c) => c.drill.id)).toEqual(['a', 'b'])
    })
  })

  describe('preserves input order within each partition', () => {
    it('keeps the original ordering of in-band candidates', () => {
      const candidates = [
        makeCandidate('z', 'beginner', 'intermediate'),
        makeCandidate('a', 'beginner', 'intermediate'),
        makeCandidate('m', 'beginner', 'intermediate'),
      ]
      const { inBand } = partitionByLevel(candidates, 'beginner')
      expect(inBand.map((c) => c.drill.id)).toEqual(['z', 'a', 'm'])
    })
  })

  describe('edge cases', () => {
    it('returns empty partitions for empty input', () => {
      const { inBand, outOfBand } = partitionByLevel([], 'intermediate')
      expect(inBand).toEqual([])
      expect(outOfBand).toEqual([])
    })

    it("classifies all drills as out-of-band when no drill spans 'advanced' (today's catalog reality for focus-controlled drills)", () => {
      const candidates = [
        makeCandidate('a', 'beginner', 'intermediate'),
        makeCandidate('b', 'intermediate', 'intermediate'),
      ]
      const { inBand, outOfBand } = partitionByLevel(candidates, 'advanced')
      expect(inBand).toEqual([])
      expect(outOfBand.map((c) => c.drill.id)).toEqual(['a', 'b'])
    })
  })
})
