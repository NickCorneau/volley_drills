/**
 * Cue cadence — typed primitive for state-aware coaching cue annotation.
 *
 * Origin: `docs/ideation/2026-05-10-open-ideation.md` #2 in the recommended
 * 6-pack ("A3 ⊕ B2 — State-aware partner-readable cue registry + Rally
 * Co-Driver iconography"). A3's first half is to promote the 14-rule
 * courtside-copy contract (`.cursor/rules/courtside-copy.mdc`) from per-
 * string lint to a registry that knows session state — drill index,
 * repeat count, partner context, fatigue band, time-into-block — with
 * cadence rules (fade-on-repeat, partner-read variant, time-into-block
 * escalation) authored once per cue. This module owns the typed shape
 * those future state-aware consumers will read.
 *
 * Predecessor plan (A3 wave 1 — lint substrate + copy sweep + assessment):
 * `docs/plans/2026-05-10-004-feat-drill-first-time-runnability-assessment-plan.md`.
 *
 * This plan (A3 wave 2 — registry primitive):
 * `docs/plans/2026-05-10-005-feat-cue-cadence-registry-foundation-plan.md`.
 *
 * Layer rule: pure product type. Domain may consume; persistence is not
 * involved (the registry is static authored data; see
 * `app/src/data/cueCadenceRegistry.ts`). No Dexie, no React, no
 * services, no platform code.
 *
 * Consumers should treat `CueCadenceRule.kind` as a closed-for-now,
 * extensible-as-needed discriminated union. Future cadence kinds add to
 * the union without breaking existing consumers; exhaustive switches
 * (per `.cursor/rules/typescript-exhaustive-switch`) surface new kinds
 * at type-check time.
 */

/**
 * State inputs a state-aware cue consumer may use to pick between
 * cadence rule outcomes. Every field is optional — different cadence
 * kinds care about different subsets of state, and consumers should
 * tolerate missing context (today's RunScreen does not yet provide any
 * of these, and the foundational primitive must not block on it).
 *
 * Field semantics:
 * - `drillIndex` — zero-based position of the current block in the
 *   session plan's `blocks[]` array.
 * - `repeatCount` — number of times the current cue has fired before
 *   this read (zero on first display). Drives `fadeOnRepeat`.
 * - `partnerContext` — `'solo'` when the current block has one role,
 *   `'pair'` when `participants.roles.length >= 2`. Drives whether
 *   `partnerReadVariant` rules are active.
 * - `fatigueBand` — early / mid / late position in the session, derived
 *   from `drillIndex` plus the plan's total block count. Reserved for
 *   future `fatigueDownshift`-style cadence kinds.
 * - `timeIntoBlockSeconds` — seconds elapsed inside the current block.
 *   Drives `timeIntoBlockEscalation`.
 */
export interface CueCadenceContext {
  readonly drillIndex?: number
  readonly repeatCount?: number
  readonly partnerContext?: 'solo' | 'pair'
  readonly fatigueBand?: 'early' | 'mid' | 'late'
  readonly timeIntoBlockSeconds?: number
}

/**
 * A single cadence rule attached to a cue. Discriminated by `kind` so
 * consumers can exhaustively switch and so future cadence kinds extend
 * the union without breaking existing consumers.
 *
 * Initial set (warranted by the 2026-05-10 ideation + brainstorm):
 * - `fadeOnRepeat` — after the cue has fired `afterReps` times, future
 *   reads may downweight or hide the cue. Originates from R15(a) (one-
 *   cue default render) generalized into rep-aware fade.
 * - `partnerReadVariant` — when `participants.roles.length >= 2`, the
 *   partner's read-aloud line for this cue. Originates from R9 (role-
 *   tagged sentences) + the ideation's "Aviation CRM-style 3-5 phrase
 *   pair callout vocabulary."
 * - `timeIntoBlockEscalation` — once the block has run for `seconds`,
 *   swap the cue text to `escalated`. Originates from FIVB feedback-
 *   cadence rules + R14 (read-aloud ceiling) — long blocks benefit from
 *   tightening the cue over time.
 *
 * Adding a new kind: extend this union with a new `{ kind: '...'; ... }`
 * variant. Consumers using exhaustive `switch (rule.kind)` will surface
 * a TypeScript error on the new kind until they handle it.
 */
export type CueCadenceRule =
  | { readonly kind: 'fadeOnRepeat'; readonly afterReps: number }
  | { readonly kind: 'partnerReadVariant'; readonly text: string }
  | {
      readonly kind: 'timeIntoBlockEscalation'
      readonly seconds: number
      readonly escalated: string
    }

/**
 * A registry entry. Pairs a base cue string (which MUST appear verbatim
 * in the referenced `DrillVariant.coachingCues[]` array — the registry
 * is additive metadata, not a replacement) with its cadence rules and
 * a `ruleTag` pointing at the courtside-copy.mdc rule that warrants
 * the cadence treatment.
 *
 * Field semantics:
 * - `drillVariantId` — must match a real `DrillVariant.id` in
 *   `app/src/data/drills.ts`. Validator R5(a) enforces this.
 * - `cueText` — must appear verbatim in `variant.coachingCues[]`.
 *   Validator R5(b) enforces this. Whitespace, capitalization, and
 *   punctuation are part of the contract; any drift between this
 *   field and the catalog fails the validator.
 * - `ruleTag` — short string identifier for the courtside-copy.mdc
 *   rule the cadence treatment is warranted by. Examples: `'R9'`,
 *   `'R15(c)'`. Free-form string today; a tighter enum can come later
 *   if authoring conventions tighten.
 * - `rules` — the cadence rules attached to this cue. Frozen at
 *   authoring time. A future state-aware render layer iterates this
 *   list, matches against the `CueCadenceContext`, and picks the
 *   appropriate display.
 */
export interface CueCadenceEntry {
  readonly drillVariantId: string
  readonly cueText: string
  readonly ruleTag: string
  readonly rules: readonly CueCadenceRule[]
}
