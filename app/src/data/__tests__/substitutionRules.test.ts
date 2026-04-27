import { DRILLS } from '../drills'
import { PROGRESSION_CHAINS } from '../progressions'
import { SUBSTITUTION_RULES } from '../substitutionRules'

const drillById = new Map(DRILLS.map((drill) => [drill.id, drill]))

function drillNeedsBlockedConstraint(
  drillId: string,
  blockedBy: (typeof SUBSTITUTION_RULES)[number]['blockedBy'],
): boolean {
  const drill = drillById.get(drillId)
  if (!drill) return true

  return drill.variants.some((variant) => {
    switch (blockedBy) {
      case 'needsNet':
        return variant.environmentFlags.needsNet
      case 'needsWall':
        return variant.environmentFlags.needsWall
    }
  })
}

describe('SUBSTITUTION_RULES catalog', () => {
  it('references only existing drills', () => {
    for (const rule of SUBSTITUTION_RULES) {
      expect(drillById.has(rule.fromDrillId), `${rule.fromDrillId} missing`).toBe(true)
      expect(drillById.has(rule.preferredToDrillId), `${rule.preferredToDrillId} missing`).toBe(true)
      for (const substituteId of rule.substituteDrillIds) {
        expect(drillById.has(substituteId), `${substituteId} missing`).toBe(true)
      }
    }
  })

  it('has non-empty, unique substitutes that do not point back to the source drill', () => {
    for (const rule of SUBSTITUTION_RULES) {
      expect(rule.substituteDrillIds.length).toBeGreaterThan(0)
      expect(new Set(rule.substituteDrillIds).size).toBe(
        rule.substituteDrillIds.length,
      )
      expect(rule.substituteDrillIds).not.toContain(rule.fromDrillId)
    }
  })

  it('only substitutes around authored preferred progression links', () => {
    const progressionPairs = new Set(
      PROGRESSION_CHAINS.flatMap((chain) =>
        chain.links
          .filter((link) => link.direction === 'progression')
          .map((link) => `${link.fromDrillId}->${link.toDrillId}`),
      ),
    )

    for (const rule of SUBSTITUTION_RULES) {
      expect(progressionPairs.has(`${rule.fromDrillId}->${rule.preferredToDrillId}`)).toBe(true)
    }
  })

  it('keeps substitute drills in the same broad skill family', () => {
    for (const rule of SUBSTITUTION_RULES) {
      const source = drillById.get(rule.fromDrillId)!
      const preferred = drillById.get(rule.preferredToDrillId)!
      const allowedFocus = new Set([...source.skillFocus, ...preferred.skillFocus])

      for (const substituteId of rule.substituteDrillIds) {
        const substitute = drillById.get(substituteId)!
        expect(
          substitute.skillFocus.some((focus) => allowedFocus.has(focus)),
          `${substituteId} should share focus with ${rule.fromDrillId} or ${rule.preferredToDrillId}`,
        ).toBe(true)
      }
    }
  })

  it('does not point substitutes at drills blocked by the same constraint', () => {
    for (const rule of SUBSTITUTION_RULES) {
      for (const substituteId of rule.substituteDrillIds) {
        expect(
          drillNeedsBlockedConstraint(substituteId, rule.blockedBy),
          `${substituteId} should not also be blocked by ${rule.blockedBy}`,
        ).toBe(false)
      }
    }
  })

  it('only claims a blocked constraint when the preferred target is actually blocked by it', () => {
    for (const rule of SUBSTITUTION_RULES) {
      expect(
        drillNeedsBlockedConstraint(rule.preferredToDrillId, rule.blockedBy),
        `${rule.preferredToDrillId} should be blocked by ${rule.blockedBy}`,
      ).toBe(true)
    }
  })

  it('keeps substitutes in the M001 candidate pool', () => {
    for (const rule of SUBSTITUTION_RULES) {
      for (const substituteId of rule.substituteDrillIds) {
        expect(drillById.get(substituteId)?.m001Candidate).toBe(true)
      }
    }
  })

  it('carries explicit transfer and preserved-intent metadata', () => {
    for (const rule of SUBSTITUTION_RULES) {
      expect(rule.preservedIntent.trim()).not.toBe('')
      expect(['direct', 'partial', 'proxy']).toContain(rule.transfer)
    }
  })

  it('does not target deferred safety-gated drills', () => {
    for (const rule of SUBSTITUTION_RULES) {
      expect(rule.preferredToDrillId).not.toBe('d36')
      expect(rule.substituteDrillIds).not.toContain('d36')
    }
  })

  it("each rule's fromDrillId has exactly one preferred progression in the catalog", () => {
    // `findPreferredProgressionTarget` resolves a single
    // `preferredToDrillId` per source drill. If a rule's `fromDrillId`
    // had multiple preferred progressions (e.g. chain-4-serve-receive
    // d15 → d16 and d15 → d18), the helper would silently pick the
    // first and the rule could disagree with the helper's pick. Until
    // the helper becomes context-aware, every authored rule's source
    // must be unambiguous.
    for (const rule of SUBSTITUTION_RULES) {
      const matches = PROGRESSION_CHAINS.flatMap((chain) =>
        chain.links.filter(
          (link) =>
            link.direction === 'progression' &&
            link.fromDrillId === rule.fromDrillId,
        ),
      )
      expect(
        matches.length,
        `${rule.fromDrillId} is the source of ${matches.length} preferred progressions; rules require exactly one`,
      ).toBe(1)
      expect(matches[0]?.toDrillId).toBe(rule.preferredToDrillId)
    }
  })

  it('only uses blocked constraints with a corresponding SetupContext field', () => {
    // Per the red-team remediation plan: every BlockedConstraint must be
    // gateable against a real `SetupContext` field. Today only `needsNet`
    // (`context.netAvailable`) and `needsWall` (`context.wallAvailable`)
    // qualify. Adding `needsLines`, `needsCones`, or `equipment` requires
    // the matching context field to exist first; otherwise the build
    // path can't tell whether the constraint is actually blocking.
    const supported = new Set(['needsNet', 'needsWall'])
    for (const rule of SUBSTITUTION_RULES) {
      expect(
        supported.has(rule.blockedBy),
        `rule ${rule.fromDrillId}->${rule.preferredToDrillId} uses unsupported blockedBy=${rule.blockedBy}`,
      ).toBe(true)
    }
  })
})
