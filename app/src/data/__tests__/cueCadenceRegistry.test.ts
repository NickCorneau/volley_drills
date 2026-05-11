import { describe, expect, it } from 'vitest'
import type { DrillVariant } from '../../types/drill'
import {
  CUE_CADENCE_REGISTRY,
  getCueCadenceEntries,
} from '../cueCadenceRegistry'
import { DRILLS } from '../drills'

/**
 * Shape-validator regression tests for the cueCadenceRegistry primitive.
 *
 * Origin: `docs/plans/2026-05-10-005-feat-cue-cadence-registry-foundation-plan.md`
 * U3. The registry is additive metadata over `app/src/data/drills.ts` — these
 * tests pin the contract that every entry resolves to a real variant, every
 * `cueText` matches an existing `coachingCues[]` entry verbatim, and cadence
 * rules respect their structural preconditions (e.g., `partnerReadVariant`
 * only attaches to multi-role variants).
 *
 * The tests intentionally iterate the registry directly rather than testing
 * a single seed entry — adding future entries to the registry is silently
 * covered by the same assertions.
 */

function findVariant(drillVariantId: string): DrillVariant | undefined {
  for (const drill of DRILLS) {
    for (const variant of drill.variants) {
      if (variant.id === drillVariantId) {
        return variant
      }
    }
  }
  return undefined
}

describe('cueCadenceRegistry shape validators', () => {
  it('seeds at least one entry (foundational primitive ships non-empty)', () => {
    expect(CUE_CADENCE_REGISTRY.length).toBeGreaterThan(0)
  })

  describe('R5(a) drillVariantId resolves in drills.ts', () => {
    for (const entry of CUE_CADENCE_REGISTRY) {
      it(`entry for "${entry.cueText}" references a real variant (${entry.drillVariantId})`, () => {
        const variant = findVariant(entry.drillVariantId)
        expect(
          variant,
          `cueCadenceRegistry entry references drillVariantId="${entry.drillVariantId}" ` +
            `but no DrillVariant with that id exists in app/src/data/drills.ts. ` +
            `Either fix the id or add the variant.`,
        ).toBeDefined()
      })
    }
  })

  describe('R5(b) cueText matches an existing coachingCues[] entry verbatim', () => {
    for (const entry of CUE_CADENCE_REGISTRY) {
      it(`entry's cueText appears verbatim in ${entry.drillVariantId}.coachingCues[]`, () => {
        const variant = findVariant(entry.drillVariantId)
        if (!variant) {
          throw new Error(
            `Precondition failed: variant ${entry.drillVariantId} not found ` +
              `(see R5(a) test above for the actionable failure).`,
          )
        }
        expect(
          variant.coachingCues.includes(entry.cueText),
          `cueCadenceRegistry entry for ${entry.drillVariantId} has ` +
            `cueText="${entry.cueText}" but that string does not appear in ` +
            `the variant's coachingCues[] array: ` +
            `${JSON.stringify(variant.coachingCues)}. ` +
            `The registry is additive metadata over the catalog — the cue ` +
            `must match verbatim (whitespace, capitalization, punctuation).`,
        ).toBe(true)
      })
    }
  })

  describe('R5(c) partnerReadVariant rules require participants.roles.length >= 2', () => {
    for (const entry of CUE_CADENCE_REGISTRY) {
      const partnerRules = entry.rules.filter(
        (rule) => rule.kind === 'partnerReadVariant',
      )
      if (partnerRules.length === 0) {
        continue
      }
      it(`entry for ${entry.drillVariantId} attaches partnerReadVariant only on multi-role variants`, () => {
        const variant = findVariant(entry.drillVariantId)
        if (!variant) {
          throw new Error(
            `Precondition failed: variant ${entry.drillVariantId} not found.`,
          )
        }
        const roleCount = variant.participants.roles?.length ?? 0
        expect(
          roleCount,
          `cueCadenceRegistry entry for ${entry.drillVariantId} ` +
            `("${entry.cueText}") attaches a partnerReadVariant rule, but ` +
            `the variant has ${roleCount} authored role(s) ` +
            `(${JSON.stringify(variant.participants.roles ?? [])}). ` +
            `partnerReadVariant only makes sense on drills with two or more ` +
            `partner-coordinating roles.`,
        ).toBeGreaterThanOrEqual(2)
      })
    }
  })

  describe('R5(d) timeIntoBlockEscalation.seconds is positive', () => {
    const escalationRules = CUE_CADENCE_REGISTRY.flatMap((entry) =>
      entry.rules
        .filter((rule) => rule.kind === 'timeIntoBlockEscalation')
        .map((rule) => ({ entry, rule })),
    )

    if (escalationRules.length === 0) {
      // Foundational primitive ships with `partnerReadVariant` only; this
      // shape validator activates as soon as a `timeIntoBlockEscalation`
      // rule is added to the registry. Skipping (rather than asserting a
      // vacuously-true `[] === []`) keeps the test count honest.
      it.skip(
        'no timeIntoBlockEscalation rules currently seeded — validator will activate when one is added',
        () => {},
      )
      return
    }

    for (const { entry, rule } of escalationRules) {
      if (rule.kind !== 'timeIntoBlockEscalation') {
        continue
      }
      it(`entry for ${entry.drillVariantId} has positive seconds on timeIntoBlockEscalation`, () => {
        expect(
          rule.seconds,
          `cueCadenceRegistry entry for ${entry.drillVariantId} ` +
            `("${entry.cueText}") has a timeIntoBlockEscalation rule ` +
            `with seconds=${rule.seconds}; expected a positive number.`,
        ).toBeGreaterThan(0)
      })
    }
  })

  describe('R6 getCueCadenceEntries lookup', () => {
    it('returns a non-empty list for every seeded drillVariantId, with each entry actually scoped to that id', () => {
      // Positive-contract assertions: confirm the helper finds the seeded
      // entries AND that every returned entry's drillVariantId matches the
      // query. This catches a hypothetical regression where the helper
      // filtered on the wrong key (e.g., `entry.drillId` instead of
      // `entry.drillVariantId`) — a bug the prior `.toEqual(filter)`
      // tautology could not surface.
      const seededIds = Array.from(
        new Set(CUE_CADENCE_REGISTRY.map((entry) => entry.drillVariantId)),
      )
      expect(seededIds.length).toBeGreaterThan(0)
      for (const id of seededIds) {
        const result = getCueCadenceEntries(id)
        expect(
          result.length,
          `getCueCadenceEntries("${id}") returned no entries even though the ` +
            `registry contains seeds for this drillVariantId.`,
        ).toBeGreaterThan(0)
        for (const entry of result) {
          expect(entry.drillVariantId).toBe(id)
        }
      }
    })

    it('returns an empty array for an unknown id (no throw)', () => {
      const result = getCueCadenceEntries(
        'this-variant-id-does-not-exist-xyz-123',
      )
      expect(result).toEqual([])
    })
  })
})
