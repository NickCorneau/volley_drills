/**
 * Cue cadence registry — static, frozen, authored metadata that
 * annotates entries in `app/src/data/drills.ts` `coachingCues[]` arrays
 * with state-aware cadence rules.
 *
 * Origin: `docs/ideation/2026-05-10-open-ideation.md` #2 ("A3 ⊕ B2 —
 * State-aware partner-readable cue registry + Rally Co-Driver
 * iconography"). This module owns the seed data; the typed shape lives
 * in `app/src/model/cueCadence.ts`.
 *
 * Predecessor plan (A3 wave 1):
 * `docs/plans/2026-05-10-004-feat-drill-first-time-runnability-assessment-plan.md`.
 *
 * This plan (A3 wave 2):
 * `docs/plans/2026-05-10-005-feat-cue-cadence-registry-foundation-plan.md`.
 *
 * Why a seed-of-one (`d33-pair`):
 *   The 2026-05-10 D130 session named `d33-pair` as the canonical
 *   "peak and flash / number drill" specimen — partner has a non-
 *   obvious cuing role and the first-time pair reader cannot tell
 *   who-does-what-when. Seeding just this variant proves the registry
 *   shape on the hardest case. A full-catalog sweep is explicitly
 *   deferred (see plan's `## Deferred to Follow-Up Work`) — additional
 *   seeds wait until the state-aware render layer ships and provides
 *   feedback on the cadence shapes that actually matter.
 *
 * Why this exists at all (and what it is NOT):
 *   The registry is *additive parallel metadata*. It does not change
 *   the `DrillVariant` schema, does not replace `coachingCues: string[]`,
 *   and is not yet consumed by any runtime path. The 2026-05-10-004 plan
 *   landed the rule substrate (rules 8-14 in `.cursor/rules/courtside-
 *   copy.mdc`) and the mechanical lints; this module is the foundational
 *   data primitive that future state-aware consumers will read.
 *
 * Layer rule: pure authored data + a small read helper. No `db/`, no
 * `services/`, no React, no platform code.
 */

import type { CueCadenceEntry } from '../model/cueCadence'

/**
 * The seed registry. Locked via `as const` plus a `readonly` type so
 * consumers cannot mutate it through the typed surface. ("Frozen" is
 * intentionally avoided in this comment — the lock is in the type
 * system, not at runtime via `Object.freeze`.)
 * Mirrors the shape of `SESSION_ARCHETYPES`
 * (`app/src/data/archetypes.ts`) and `SUBSTITUTION_RULES`
 * (`app/src/data/substitutionRules.ts`).
 *
 * Seed entry: `d33-pair` `coachingCues[0]` ("Shagger calls the zone
 * first.") — the partner-callout cue. The `partnerReadVariant` rule
 * carries the Aviation-CRM-style 6-zone callout vocabulary the ideation
 * names. The `ruleTag: 'R9'` points at the courtside-copy.mdc rule 8
 * (Either-reader role-tagged sentences for pair drills) that warrants
 * the partner-read treatment — the rule is labeled R9 in the
 * predecessor brainstorm's numbering, surfaced as "Rule 8" in the
 * canonical rule file.
 */
export const CUE_CADENCE_REGISTRY: readonly CueCadenceEntry[] = [
  {
    drillVariantId: 'd33-pair',
    cueText: 'Shagger calls the zone first.',
    ruleTag: 'R9',
    rules: [
      {
        kind: 'partnerReadVariant',
        // The 6-zone Aviation-CRM-style callout vocabulary the shagger
        // reads aloud in cycle order. Sourced from this variant's
        // `courtsideInstructions` "Zones from your side: ..." anchor.
        text:
          'Call the next zone aloud each rep, in order: ' +
          'Front-left! Front-middle! Front-right! ' +
          'Back-left! Back-middle! Back-right!',
      },
    ],
  },
] as const

/**
 * Return all registry entries for a given drill variant id.
 *
 * Returns an empty `readonly CueCadenceEntry[]` when the id is unknown
 * — never throws. Mirrors the lookup style used in
 * `data/substitutionRules.ts`. The current implementation is a simple
 * filter; if a future hot path requires Map-indexed lookup, add it
 * then (the registry is small enough today that the filter cost is
 * negligible).
 */
export function getCueCadenceEntries(
  drillVariantId: string,
): readonly CueCadenceEntry[] {
  return CUE_CADENCE_REGISTRY.filter(
    (entry) => entry.drillVariantId === drillVariantId,
  )
}
