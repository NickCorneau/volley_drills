import { describe, expect, it } from 'vitest'
import { DRILLS } from '../../data/drills'
import { SUBSTITUTION_RULES } from '../../data/substitutionRules'
import {
  findPreferredCandidate,
  findSubstitute,
  isConstraintActive,
  type SelectionCandidate,
} from '../drillSelection'
import type { SetupContext } from '../../model'

function candidateForVariant(variantId: string): SelectionCandidate {
  for (const drill of DRILLS) {
    const variant = drill.variants.find((v) => v.id === variantId)
    if (variant) return { drill, variant }
  }
  throw new Error(`Missing test variant ${variantId}`)
}

function makeContext(overrides: Partial<SetupContext> = {}): SetupContext {
  return {
    playerMode: 'pair',
    timeProfile: 25,
    netAvailable: false,
    wallAvailable: false,
    ...overrides,
  }
}

describe('isConstraintActive', () => {
  it('reports needsNet active when netAvailable is false', () => {
    expect(isConstraintActive('needsNet', makeContext({ netAvailable: false }))).toBe(true)
  })

  it('reports needsNet inactive when netAvailable is true', () => {
    expect(isConstraintActive('needsNet', makeContext({ netAvailable: true }))).toBe(false)
  })

  it('reports needsWall active when wallAvailable is false', () => {
    expect(isConstraintActive('needsWall', makeContext({ wallAvailable: false }))).toBe(true)
  })

  it('reports needsWall inactive when wallAvailable is true', () => {
    expect(isConstraintActive('needsWall', makeContext({ wallAvailable: true }))).toBe(false)
  })
})

describe('findPreferredCandidate', () => {
  it('returns the candidate matching the preferred drill id', () => {
    const preferred = candidateForVariant('d04-pair')
    const other = candidateForVariant('d10-pair')

    expect(findPreferredCandidate('d04', [other, preferred])).toBe(preferred)
  })

  it('returns undefined when the preferred drill is absent from the pool', () => {
    const other = candidateForVariant('d10-pair')

    expect(findPreferredCandidate('d04', [other])).toBeUndefined()
  })
})

describe('findSubstitute', () => {
  it('returns undefined when no rule matches the current drill', () => {
    const candidate = candidateForVariant('d10-pair')
    const result = findSubstitute(
      'd99',
      [candidate],
      makeContext({ netAvailable: false }),
      SUBSTITUTION_RULES,
    )
    expect(result).toBeUndefined()
  })

  it('returns undefined when a matching rule exists but the constraint is inactive today', () => {
    const candidate = candidateForVariant('d10-pair')
    const result = findSubstitute(
      'd03',
      [candidate],
      makeContext({ netAvailable: true }),
      SUBSTITUTION_RULES,
    )
    expect(result).toBeUndefined()
  })

  it('returns the substitute when the rule fires and the substitute is in the pool', () => {
    const candidate = candidateForVariant('d10-pair')
    const result = findSubstitute(
      'd03',
      [candidate],
      makeContext({ netAvailable: false }),
      SUBSTITUTION_RULES,
    )
    expect(result?.candidate.drill.id).toBe('d10')
    expect(result?.rule.fromDrillId).toBe('d03')
    expect(result?.rule.preferredToDrillId).toBe('d04')
    expect(result?.rule.blockedBy).toBe('needsNet')
  })

  it('returns undefined when a rule fires but no substitute is in the pool', () => {
    const unrelated = candidateForVariant('d11-pair')
    const result = findSubstitute(
      'd03',
      [unrelated],
      makeContext({ netAvailable: false }),
      SUBSTITUTION_RULES,
    )
    expect(result).toBeUndefined()
  })

  it('iterates substituteDrillIds in authored order; first match wins', () => {
    const second = candidateForVariant('d11-pair')
    const first = candidateForVariant('d10-pair')
    const result = findSubstitute('d03', [second, first], makeContext({ netAvailable: false }), [
      {
        fromDrillId: 'd03',
        preferredToDrillId: 'd04',
        blockedBy: 'needsNet',
        substituteDrillIds: ['d10', 'd11'],
        preservedIntent: 'synthetic ordered substitute test',
        transfer: 'partial',
      },
    ])
    expect(result?.candidate.drill.id).toBe('d10')
  })

  it('is deterministic across repeated calls with identical inputs', () => {
    const candidates = [candidateForVariant('d11-pair'), candidateForVariant('d10-pair')]
    const ctx = makeContext({ netAvailable: false })

    const a = findSubstitute('d03', candidates, ctx, SUBSTITUTION_RULES)
    const b = findSubstitute('d03', candidates, ctx, SUBSTITUTION_RULES)

    expect(a?.candidate.drill.id).toBe(b?.candidate.drill.id)
    expect(a?.rule).toBe(b?.rule)
  })

  it('is unaffected by which constraint is active when only one matches the rule', () => {
    const candidate = candidateForVariant('d10-pair')
    const onlyWallBlocked = makeContext({
      netAvailable: true,
      wallAvailable: false,
    })
    const result = findSubstitute('d03', [candidate], onlyWallBlocked, SUBSTITUTION_RULES)
    expect(result).toBeUndefined()
  })
})
