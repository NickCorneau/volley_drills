---
id: cue-cadence-registry-foundation-plan-2026-05-10
title: "feat: cueCadenceRegistry foundational primitive (A3⊕B2 wave 2)"
type: feat
status: active
stage: validation
date: 2026-05-10
origin: docs/ideation/2026-05-10-open-ideation.md
summary: "Foundational typed primitive for the state-aware cue registry called out in docs/ideation/2026-05-10-open-ideation.md #2 (A3 ⊕ B2). Adds CueCadenceContext, CueCadenceRule (discriminated union: fadeOnRepeat / partnerReadVariant / timeIntoBlockEscalation), and CueCadenceEntry types under app/src/model/cueCadence.ts, plus a seed-of-one CUE_CADENCE_REGISTRY for d33-pair (today's peak-and-flash specimen) under app/src/data/cueCadenceRegistry.ts, plus R5/R6 shape-validator regression tests. Zero runtime UI changes; state-aware rendering, iconography (B2), and swipe gestures are deferred to follow-up plans. Wave 1 of A3 (rule substrate + lints + copy sweep) shipped under docs/plans/2026-05-10-004-feat-drill-first-time-runnability-assessment-plan.md."
---

# feat: cueCadenceRegistry foundational primitive (A3⊕B2 wave 2)

## Summary

Lay down the **typed data primitive** for the state-aware cue registry called out in `docs/ideation/2026-05-10-open-ideation.md` recommended 6-pack item #2 ("A3 ⊕ B2 — State-aware partner-readable cue registry + Rally Co-Driver iconography"). Wave 1 of A3 (rules 8–14 in `.cursor/rules/courtside-copy.mdc`, mechanical lints, copy sweep) is landing under `docs/plans/2026-05-10-004-feat-drill-first-time-runnability-assessment-plan.md`. This plan adds the missing **registry shape** the ideation calls for — a tiny additive `CueCadenceRule` model + a seed registry for `d33-pair` (today's session canonical specimen) + shape-validator tests. Zero runtime UI changes: the registry is foundational data only; state-aware rendering, iconography (B2), and swipe gestures are explicitly deferred to follow-up plans.

---

## Problem Frame

The 2026-05-10 open-ideation 6-pack item #2 (`A3 ⊕ B2`) frames the next ship for the strengthened first-time-runnability rubric as:

- **A3** — promote the 14-rule courtside-copy contract from per-string lint to a **`cueCadenceRegistry` that knows state** (drill index, repeat count, partner-context, fatigue band, time-into-block), with cadence rules (fade-on-repeat, partner-read variant, time-into-block escalation) authored once per cue. The 14 rules become validators on the registry.
- **B2** — concrete UI primitive (rally-co-driver-scale iconography + swipe-anywhere gestures).

The 2026-05-10-004 plan (in-flight; courtside-copy.mdc, lints, drill copy sweep, R15(a) one-cue render, assessment artifact, solutions doc) lands A3's **lint substrate** and triple-only discipline. It does **not** introduce the data shape the registry needs to hang from, nor any pictogram primitive.

Because the registry's *shape* is what every later layer (state-aware rendering, fade-on-repeat, partner-read variants, iconography rendering, swipe-anywhere gestures) will hang from, getting the type contract right early is the highest-leverage micro-move. Once the type is in place, follow-up work can extend incrementally (one new cadence rule, one new render variant, one new validator) without re-shaping the universe.

This plan is intentionally **foundational and zero-runtime-risk**. The registry adds a *new* data file (`cueCadenceRegistry.ts`) and a *new* model file (`model/cueCadence.ts`); it does NOT mutate `coachingCues: string[]` on `DrillVariant`, does NOT change `RunScreen`, and does NOT touch any user-visible surface. The follow-up plans wire it in.

---

## Requirements

- R1. Define a typed `CueCadenceContext` capturing the state inputs the ideation names: drill index (sequencing in plan), repeat count (rep-within-block), partner-context (solo vs pair), fatigue band (early / mid / late in session), and time-into-block (seconds). Keep optional fields actually optional — the type must compose with today's `coachingCues: string[]` without requiring every dimension to be authored.
- R2. Define a typed `CueCadenceRule` with at minimum the three cadence shapes the ideation calls out: `fadeOnRepeat`, `partnerReadVariant`, `timeIntoBlockEscalation`. The shape must be extensible (open discriminated union) so future cadence kinds (e.g., `fatigueDownshift`) can be added without rewriting consumers.
- R3. Define a typed `CueCadenceEntry` that pairs a base cue string with its cadence rules and metadata (the `drillVariantId` it belongs to, plus the rule tag carried from `.cursor/rules/courtside-copy.mdc` that warrants the cue — e.g., `[DO-CONFIRM]`, `R15(c)`).
- R4. Seed the registry with at least one entry per canonical 2026-05-10 specimen: `d33-pair` (today's session "peak and flash" exemplar). The seed must include at least one `partnerReadVariant` cadence rule (the partner-readable callout vocabulary the ideation explicitly names).
- R5. Shape-validator regression tests must enforce: (a) every `CueCadenceEntry.drillVariantId` points at a real `DrillVariant` in `app/src/data/drills.ts`; (b) every entry's base cue text appears in the variant's existing `coachingCues[]` array (registry is additive metadata over today's source-of-truth, not a replacement); (c) `partnerReadVariant` rules only attach to entries whose variant has `participants.roles.length ≥ 2`; (d) `timeIntoBlockEscalation` rule's `seconds` value is positive.
- R6. The registry module exports a single read-only frozen `CUE_CADENCE_REGISTRY` value and a typed lookup helper `getCueCadenceEntries(drillVariantId: string): readonly CueCadenceEntry[]` so consumers do not need to know the registry shape to use it. Constant name follows the SCREAMING_SNAKE_CASE convention used by every authored sibling registry in `app/src/data/` (`DRILLS`, `SESSION_ARCHETYPES`, `SUBSTITUTION_RULES`, etc.).
- R7. The new files honor the data-access layer rules: `model/cueCadence.ts` is a pure type module (no Dexie, no React, no services); `data/cueCadenceRegistry.ts` reads `drills.ts` only at type level, never imports `db/` or `services/`, and the export shape mirrors existing `data/` files (`archetypes.ts`, `substitutionRules.ts`).

**Origin actors:** A1 courtside player (consumer of future state-aware renders), A2 future catalog author (authors registry entries alongside drill copy), A3 reviewing agent or maintainer (runs shape validators).
**Origin flows:** F3 pair-drill first-read flow (the `partnerReadVariant` rule type warrants this), F4 returning-reader re-glance flow (the `fadeOnRepeat` and `timeIntoBlockEscalation` rule types warrant this).
**Origin acceptance examples:** AE5 (partner-read variant pattern — `d07-pair` style; carried into `d33-pair` seed in U2), AE8 (cue-ordering rule — `coachingCues[0]` already enforced by 2026-05-10-004 U3; this plan's seed entry for `d33-pair` cue[0] carries the rule-tag annotation).

---

## Scope Boundaries

- Do not change the `DrillVariant` schema, the `Drill` schema, or any existing `coachingCues: string[]` data on drills. The registry is parallel, additive metadata.
- Do not wire the registry into `RunScreen`, `TransitionScreen`, `DrillCheckScreen`, or any other render path. State-aware rendering is explicitly the next wave.
- Do not introduce iconography (B2 pictogram primitives, rally-co-driver arrows) — pictogram component design is its own plan.
- Do not introduce swipe-anywhere gestures (B2 second pillar) — gesture system needs accessibility review and is its own plan.
- Do not seed the registry for every drill. Seed only `d33-pair` (today's specimen). The seed exists to prove the shape works; a full sweep is its own plan once the rendering layer ships.
- Do not introduce a Dexie migration. The registry is static authored data, identical in shape to `archetypes.ts` and `substitutionRules.ts`.
- Do not introduce new authoring-checklist items in `.cursor/rules/courtside-copy.mdc`. The existing rules 8–14 plus the new shape validators are sufficient guardrails for this primitive.

### Deferred to Follow-Up Work

- **State-aware RunScreen render** (the second half of A3): consume `cueCadenceRegistry` in `RunScreen.tsx` so cues fade-on-repeat, partner-read variants swap in when `participants.roles.length ≥ 2`, and time-into-block escalation tightens cue density. Separate plan once this primitive lands and a small UX prototype is reviewed.
- **B2 iconography primitive** (rally-co-driver-scale glyphs, topo-style card, equipment-row glyph): a design + render plan of its own. Likely an accessibility / typography review precedes.
- **B2 swipe-anywhere gesture system**: a gesture-engine + accessibility plan of its own. Needs to coexist with existing primary controls and the P12 contract.
- **Full drill seed sweep** for the registry across all 26 M001-candidate drills: a sweep plan once the rendering layer makes seeds visibly useful and the seed authoring shape stabilizes.
- **Incident register** (the ideation's "stand up an incident register logging every confusion-class read-aloud failure mapped to the copy rule it falsifies"): separate doc-tooling plan. The 2026-05-10-004 assessment artifact serves as the manual analog today.
- **Aviation CRM-style 3–5 phrase pair callout vocabulary per drill** (A3's third pillar): the `partnerReadVariant` cadence rule introduced here is the *home* for that vocabulary, but authoring it for all pair drills is a separate copy-authoring sweep, not part of this primitive plan.

---

## Context & Research

### Relevant Code and Patterns

- `app/src/types/drill.ts` — `DrillVariant.coachingCues: string[]` is today's source-of-truth for cue strings. The registry's `CueCadenceEntry.cueText` must match an existing entry in that array (shape validator R5(b)).
- `app/src/data/drills.ts` — the authored catalog. The registry references variants by `id`.
- `app/src/data/archetypes.ts` and `app/src/data/substitutionRules.ts` — existing precedent for "static authored data in `data/` with a typed export and a frozen value." `cueCadenceRegistry.ts` follows the same shape.
- `app/src/model/skillVector.ts` — existing precedent for a pure model module that declares a typed shape consumed elsewhere (domain reads, services persist). `model/cueCadence.ts` follows the same shape.
- `app/src/data/__tests__/catalogValidation.test.ts` — existing precedent for "structural validators over authored data." The new registry tests follow the same style: pure data-shape assertions, no Dexie, no RTL.
- `.cursor/rules/courtside-copy.mdc` rule 12 ("Cue ordering rule for `coachingCues[]`") — the rule tags (`R15(a)–(d)`) the registry will carry on each entry come from here.
- `.cursor/rules/data-access.mdc` — layer rules. The new files honor the inward-pointing dependency graph.

### Institutional Learnings

- Volleycraft's pattern is **typed product primitives first, runtime integration later**. `SkillVector` shipped as a type before any aggregator consumed it; `D121` calls this out explicitly as forward-compat seam discipline. The cueCadenceRegistry follows the same pattern: shape stabilizes first, consumers follow.
- The 2026-05-10-004 plan deliberately scoped to "copy-only sweep, schema-later." This plan honors that boundary by adding **separate, parallel** data, not by extending the `DrillVariant` schema.
- Static authored data with shape validators (over snapshots) is the durable test pattern. Catalog validation has been stable; the registry tests should mirror its style.
- The drill catalog's `m001Candidate: true` boundary (currently 26 drills, ~48 variants) is the meaningful subset for any registry seed. Reserve drills are out of scope.

### External References

- Ideation artifact: `docs/ideation/2026-05-10-open-ideation.md` (#2 in the recommended 6-pack — A3⊕B2 framing, "registry that knows state," cadence rule shapes, partner-readable callout vocabulary).
- Predecessor brainstorm: `docs/brainstorms/2026-05-10-drill-first-time-runnability-requirements.md` (R9 role-tagged sentences warrants the `partnerReadVariant` rule; R15 cue ordering carries the rule-tag taxonomy).
- Predecessor plan: `docs/plans/2026-05-10-004-feat-drill-first-time-runnability-assessment-plan.md` (rule 8–14 substrate; lints; copy sweep; assessment artifact). This plan stacks on top.
- Solutions doc: `docs/solutions/2026-05-10-drill-first-time-runnability-system.md` (created under 2026-05-10-004 U7; the cueCadenceRegistry is named as the next-layer pattern the solutions doc points toward).

---

## Key Technical Decisions

- **Registry is additive, not a schema migration.** The simplest forward-compat seam is a parallel typed structure (one `data/cueCadenceRegistry.ts`, one `model/cueCadence.ts`) that references drill variants by `id`. No change to `DrillVariant`. No Dexie migration. No author-ergonomics rewrite. Mirrors the `SkillVector` pattern.
- **Discriminated union for `CueCadenceRule` kinds.** `kind: 'fadeOnRepeat' | 'partnerReadVariant' | 'timeIntoBlockEscalation'` keeps each variant's payload type-distinct (e.g., `partnerReadVariant` carries the alternative text; `timeIntoBlockEscalation` carries the `seconds` threshold). Future cadence kinds extend the union; consumers use exhaustive switch handling (per `.cursor/rules/typescript-exhaustive-switch`).
- **Validators live in `data/__tests__/`, not in a runtime "validator" module.** Following the 2026-05-10-004 plan's bias ("mechanical lints over subjective snapshots") and the existing `catalogValidation.test.ts` precedent. No new runtime validator class; the tests *are* the contract.
- **Seed `d33-pair` only, not the full catalog.** The 2026-05-10-004 assessment artifact already names `d33-pair` as a rewrite-tier specimen (the "peak and flash" exemplar). Seeding just that variant proves the shape on the hardest case without committing to authoring effort across 48 variants — which would be wasted work until the rendering layer ships and gives feedback on the cue-cadence shapes that actually matter.
- **`CueCadenceEntry.cueText` must match an existing `coachingCues[]` entry verbatim.** Avoids invisible drift between the registry and today's source-of-truth. If a future authoring pass wants to introduce a partner-read variant string that does *not* live in `coachingCues[]`, that authoring decision goes through the rendering plan, not this primitive plan.
- **Rule-tag annotation on every entry.** Each `CueCadenceEntry` carries a `ruleTag: string` (e.g., `'R15(c)'`, `'R9'`) that points at the courtside-copy.mdc rule that warrants the cue's cadence treatment. This is the bridge from the lint layer (where the rule originates) to the registry layer (where the cadence-aware enforcement happens). Authoring-time linting in a follow-up plan can read the registry and cross-check rule coverage.

---

## Open Questions

### Resolved During Planning

- **Should this plan touch `DrillVariant`?** No. Additive parallel data. Confirmed by the 2026-05-10-004 plan's "copy-only sweep, schema-later" framing and by the `SkillVector` precedent.
- **Should the registry seed every drill?** No. `d33-pair` only. Full sweep follows the rendering layer.
- **Should the registry be consumed by `RunScreen` in this plan?** No. Render integration is the next wave.
- **Should `CueCadenceRule` be an open type / extensible enum?** Yes — discriminated union with `kind`, exhaustive switch in consumers. Future kinds added without breaking changes.
- **Where do `model/cueCadence.ts` and `data/cueCadenceRegistry.ts` go architecturally?** `model/` for the types (pure), `data/` for the authored seed (no Dexie / React / services). Honors `.cursor/rules/data-access.mdc`.

### Deferred to Implementation

- **Exact `fadeOnRepeat` payload shape.** Today's understanding: a numeric `afterReps: number` field (the rep count at which the cue should fade). Decide during U1 prototype — the seed for `d33-pair` may not even need a `fadeOnRepeat` rule; if not, defer payload finalization to the first drill that does (still author the discriminator now).
- **Exact wording of the `d33-pair` `partnerReadVariant` text.** The ideation's "Aviation CRM-style 3–5 phrase pair callout vocabulary" suggests `"Front-left!"`, `"Back-middle!"`, etc. for the 6-zone serving ladder, but the final wording should match the drill's `courtsideInstructions` after the 2026-05-10-004 U5 sweep settles. Use the post-sweep text as the source.
- **Should `CueCadenceEntry` carry a `priority: number` or rely on registry array order?** Defer; today's `coachingCues[]` is implicitly priority-ordered by array index, and the registry only enriches that order. Add priority explicitly if a real authoring case demonstrates it's needed.

---

## High-Level Technical Design

> *This sketch communicates the intended shape; it is directional guidance for review, not implementation specification. The implementing agent should treat it as context, not code to reproduce.*

```text
                              ┌────────────────────────────────────┐
                              │ model/cueCadence.ts                 │
                              │  - CueCadenceContext (state inputs) │
                              │  - CueCadenceRule (discriminated)   │
                              │  - CueCadenceEntry (cue + rules +   │
                              │    drillVariantId + ruleTag)        │
                              └─────────────┬──────────────────────┘
                                            │ types only
                                            ▼
                    ┌───────────────────────────────────────────────┐
                    │ data/cueCadenceRegistry.ts                     │
                    │  - const CUE_CADENCE_REGISTRY: readonly Entry[]│
                    │    (frozen; today seeded with d33-pair only)   │
                    │  - getCueCadenceEntries(drillVariantId): R[]   │
                    └─────────────┬─────────────────────────────────┘
                                  │
                                  │ shape validators only
                                  ▼
                    ┌───────────────────────────────────────────────┐
                    │ data/__tests__/cueCadenceRegistry.test.ts      │
                    │  - drillVariantId resolves in drills.ts        │
                    │  - cueText matches an entry in coachingCues[]  │
                    │  - partnerReadVariant requires roles.length≥2  │
                    │  - timeIntoBlockEscalation.seconds > 0         │
                    │  - getCueCadenceEntries lookup roundtrips      │
                    └───────────────────────────────────────────────┘

                              (NO RunScreen wiring — deferred to follow-up)
                              (NO iconography primitive — deferred to follow-up)
                              (NO swipe gesture engine — deferred to follow-up)
```

The minimal shape sketched (for review-time clarity only — not the implementation):

```text
CueCadenceContext (all fields optional):
  drillIndex?: number          // sequencing within plan
  repeatCount?: number         // rep within current block
  partnerContext?: 'solo' | 'pair'
  fatigueBand?: 'early' | 'mid' | 'late'
  timeIntoBlockSeconds?: number

CueCadenceRule (discriminated union on `kind`):
  | { kind: 'fadeOnRepeat'; afterReps: number }
  | { kind: 'partnerReadVariant'; text: string }      // the partner's read-aloud line
  | { kind: 'timeIntoBlockEscalation'; seconds: number; escalated: string }

CueCadenceEntry:
  drillVariantId: string       // must resolve in drills.ts
  cueText: string              // must appear verbatim in variant.coachingCues[]
  ruleTag: string              // e.g., 'R15(c)', 'R9'
  rules: readonly CueCadenceRule[]
```

The seed entry for `d33-pair` will exercise at least the `partnerReadVariant` shape (warranted by rule 9 in courtside-copy.mdc: pair-drill role-tagged sentences and the partner-callout zone vocabulary).

---

## Implementation Units

- U1. **`model/cueCadence.ts` — pure typed primitive**

**Goal:** Land the typed shape (`CueCadenceContext`, `CueCadenceRule` discriminated union, `CueCadenceEntry`) in a new pure-type module under `app/src/model/`. No runtime values, no imports beyond `app/src/types/drill.ts` for the `SkillFocus` / `DrillVariant` id type if needed.

**Requirements:** R1, R2, R3, R7.

**Dependencies:** None.

**Files:**
- Create: `app/src/model/cueCadence.ts`
- Modify: `app/src/model/index.ts` (re-export new types if `index.ts` re-exports model types; check during implementation — only modify if the existing pattern requires it).

**Approach:**
- Define `CueCadenceContext` with five optional fields per R1 (`drillIndex`, `repeatCount`, `partnerContext`, `fatigueBand`, `timeIntoBlockSeconds`).
- Define `CueCadenceRule` as a discriminated union keyed on `kind`, with the three initial variants per R2 (`fadeOnRepeat`, `partnerReadVariant`, `timeIntoBlockEscalation`). Each variant carries the minimal payload the deferred-to-implementation question resolved (`afterReps` for fade, `text` for partner variant, `{ seconds, escalated }` for time escalation).
- Define `CueCadenceEntry` per R3 (`drillVariantId`, `cueText`, `ruleTag`, `rules: readonly CueCadenceRule[]`).
- Add JSDoc on every export explaining: what the type is, why it exists (cite the ideation `#2` and the 2026-05-10-004 predecessor), and how consumers should use it (typed `getCueCadenceEntries`, exhaustive switch over `kind`).
- Honor `.cursor/rules/data-access.mdc`: no `db/`, no `services/`, no React, no `platform/`.
- Honor `.cursor/rules/typescript-exhaustive-switch`: the discriminated union is shaped so consumers can use exhaustive switches; document the intent in JSDoc.

**Patterns to follow:**
- `app/src/model/skillVector.ts` — same module style (header comment with `D121` citation; pure typed primitive; no runtime).
- `app/src/model/participant.ts` — same shape for additive, layer-correct primitives.

**Test scenarios:**
- Test expectation: none — pure-type module. Type-checking exercises the shape; runtime behavior is in U2/U3.

**Verification:**
- `tsc` passes after adding the module.
- A consumer can write an exhaustive switch over `CueCadenceRule.kind` without a TypeScript error.
- The JSDoc orients a new author without consulting this plan.

---

- U2. **`data/cueCadenceRegistry.ts` — seed registry + lookup helper**

**Goal:** Build a frozen `CUE_CADENCE_REGISTRY` array of `CueCadenceEntry` seeded with the `d33-pair` canonical specimen and export the typed `getCueCadenceEntries(drillVariantId)` helper per R6. The seed must demonstrate at least one `partnerReadVariant` rule per R4. Constant name follows the SCREAMING_SNAKE_CASE convention used by sibling registries in `app/src/data/`.

**Requirements:** R4, R6, R7.

**Dependencies:** U1.

**Files:**
- Create: `app/src/data/cueCadenceRegistry.ts`

**Approach:**
- Import the types from `app/src/model/cueCadence.ts`.
- Define `const CUE_CADENCE_REGISTRY: readonly CueCadenceEntry[]` and freeze it via `Object.freeze` or by declaring `as const`. Mirror the freezing pattern used by `data/archetypes.ts` and `data/substitutionRules.ts`. Use SCREAMING_SNAKE_CASE to align with `SESSION_ARCHETYPES`, `SUBSTITUTION_RULES`, `DRILLS`, etc.
- Seed at least one entry for `d33-pair`. The entry should reference an existing `coachingCues[]` string from `d33-pair` verbatim (look up the post-2026-05-10-004-U5-sweep version in `app/src/data/drills.ts`). Attach a `partnerReadVariant` rule carrying the partner's read-aloud zone-call line (e.g., the called zone in the 6-zone ladder). Tag with `ruleTag: 'R15(c)'` (gaze-target perceptual cue) or `'R9'` (role-tagged sentence) depending on which cue is being annotated; pick the one whose warrant is clearest in the post-sweep text.
- Export `getCueCadenceEntries(drillVariantId: string): readonly CueCadenceEntry[]` as a small filter helper. Implement as a simple `.filter()` over the registry; no caching, no Map indexing for v1 (the registry is small and the call surface is currently zero — premature optimization is the deferred work).
- Add a top-of-file JSDoc block explaining: what the registry is, why it exists (cite the ideation `#2`), why it's seeded with `d33-pair` only, and where the follow-up sweep + render integration is tracked (in `## Deferred to Follow-Up Work` of this plan).
- Honor `.cursor/rules/data-access.mdc`: no `db/`, no `services/`, no React.

**Patterns to follow:**
- `app/src/data/archetypes.ts` — for the "frozen, typed, statically-authored data with a small helper" shape.
- `app/src/data/substitutionRules.ts` — for the lookup-helper style (named export of helper + named export of data).

**Test scenarios:**
- Covers R4. Happy path: `getCueCadenceEntries('d33-pair')` returns at least one entry.
- Covers R6. Happy path: `getCueCadenceEntries('nonexistent-id')` returns an empty array (no thrown error).
- Edge case: the seed entry's `cueText` field appears verbatim in `d33-pair`'s `coachingCues[]` array in `drills.ts`. (Validated structurally in U3; the seed must be authored to satisfy this.)

**Verification:**
- The module exports a frozen `CUE_CADENCE_REGISTRY` value of the right type.
- `getCueCadenceEntries('d33-pair')` returns a non-empty list at runtime.
- `getCueCadenceEntries(...)` is `readonly` (typing prevents callers from pushing into the returned array).

---

- U3. **`data/__tests__/cueCadenceRegistry.test.ts` — shape-validator regression tests**

**Goal:** Pin the registry's shape contract with mechanical regression tests per R5. Tests are pure data-shape assertions: no Dexie, no React, no `platform/`. Catch drift between the registry and `drills.ts` early.

**Requirements:** R5, R6.

**Dependencies:** U1, U2.

**Files:**
- Create: `app/src/data/__tests__/cueCadenceRegistry.test.ts`

**Approach:**
- Import `CUE_CADENCE_REGISTRY` and `getCueCadenceEntries` from `data/cueCadenceRegistry.ts`.
- Import `drills` (or the named export the catalog uses) from `app/src/data/drills.ts`.
- Implement five test cases mapping to R5(a)–(d) + R6:
  - **R5(a) — `drillVariantId` resolves in `drills.ts`.** For every entry in the registry, find a `DrillVariant` whose `id === entry.drillVariantId`. Fail with a message naming the entry's `drillVariantId` if no variant is found.
  - **R5(b) — `cueText` matches an existing `coachingCues[]` entry verbatim.** For every entry, look up the variant from R5(a)'s match, then assert `variant.coachingCues.includes(entry.cueText)`. Fail with a message naming the entry's `cueText` and the variant's `coachingCues[]` array if no match is found.
  - **R5(c) — `partnerReadVariant` rules require `participants.roles.length ≥ 2`.** For every entry whose `rules[]` contains a `partnerReadVariant` rule, look up the variant and assert `variant.participants.roles.length >= 2`. Fail with a message naming the entry if the variant's roles array is shorter.
  - **R5(d) — `timeIntoBlockEscalation.seconds > 0`.** For every entry whose `rules[]` contains a `timeIntoBlockEscalation` rule, assert the `seconds` payload is a positive number. Fail with a message naming the entry if not.
  - **R6 — `getCueCadenceEntries` positive-contract assertions.** For every unique `drillVariantId` in the registry, assert `getCueCadenceEntries(drillVariantId)` returns a non-empty list AND that every returned entry has `drillVariantId === id`. This catches a regression where the helper filtered on the wrong key (e.g., `entry.drillId` instead of `entry.drillVariantId`) — a bug a tautological `.toEqual(filter)` self-comparison would not catch. Also assert `getCueCadenceEntries('nonexistent-id-xyz')` returns an empty array.
- Use the same Vitest globals style as `catalogValidation.test.ts` — `describe`, `it`, `expect` without imports.
- Tests must run as part of the regular `npm test` invocation in `app/`; no additional configuration.

**Execution note:** Test-first — write the validator tests with the seed entry not yet present, watch them pass (vacuously) or fail (if seed already exists from U2), then ensure U2's seed satisfies every assertion.

**Patterns to follow:**
- `app/src/data/__tests__/catalogValidation.test.ts` — for "pure data-shape regression test over authored static data" idioms.
- `app/src/data/__tests__/drillCopyRegressions.test.ts` — for the "iterate every variant, assert a predicate, fail with a clear message naming the failing variant" pattern that the 2026-05-10-004 U2 lints follow.

**Test scenarios:**
- Covers R5(a). Happy path: the seed entry's `drillVariantId: 'd33-pair'` matches a real variant in `drills.ts`. Error path: if the seed entry uses a typo'd id like `'d33-pair-typo'`, the test fails with a message naming the id.
- Covers R5(b). Happy path: the seed entry's `cueText` appears verbatim in the `d33-pair` `coachingCues[]` array. Error path: if the seed cue text drifts (whitespace, capitalization, punctuation), the test fails with a message showing the seed text and the actual array.
- Covers R5(c). Happy path: the seed entry's `partnerReadVariant` rule is valid because `d33-pair` has two roles. Error path: if a future entry tries to attach `partnerReadVariant` to a solo variant, the test fails.
- Covers R5(d). Happy path: if any entry carries a `timeIntoBlockEscalation` rule, its `seconds` is positive. Edge case: a `seconds: 0` value fails the test with a clear message.
- Covers R6. Happy path: `getCueCadenceEntries('d33-pair')` returns the seed entry. Happy path: `getCueCadenceEntries('nonexistent-id')` returns an empty array.

**Verification:**
- `npm test` in `app/` includes the new test file and all assertions pass with the U2 seed in place.
- Deliberately introducing a drift (e.g., changing the seed's `cueText` to a non-matching string) makes the relevant assertion fail with a clear message naming the entry.
- Existing tests (currently 2422 passing) remain green; the new file is purely additive.

---

## System-Wide Impact

- **Interaction graph:** None — the registry is not yet consumed by any runtime path. `RunScreen`, `TransitionScreen`, `DrillCheckScreen`, and every controller are untouched.
- **Error propagation:** None — `getCueCadenceEntries` returns `[]` for unknown ids; no thrown errors. The validator tests catch drift at test time, not at runtime.
- **State lifecycle risks:** None — no Dexie schema change, no migration, no persistence. The registry is static authored data, identical to `archetypes.ts` and `substitutionRules.ts` in lifecycle shape.
- **API surface parity:** None — no public API, no exported model contract change, no breaking change. Internal types only, scoped to `app/src/`.
- **Integration coverage:** The new tests in `data/__tests__/cueCadenceRegistry.test.ts` cover the registry's shape contract end-to-end at the data tier (the lowest useful tier per `.cursor/rules/testing.mdc`).
- **Unchanged invariants:** `DrillVariant` schema; `Drill` schema; `coachingCues: string[]` field shape; Dexie schema v6; `RunScreen` render contract; P12 route contracts; the 7 + 7 = 14 courtside-copy rules (the registry annotates rule tags but does not redefine them); generated-plan diagnostics report shape.

---

## Risks & Dependencies

| Risk | Mitigation |
|------|------------|
| Seed `cueText` drifts from `coachingCues[]` due to a future copy edit | R5(b) shape validator catches the drift at test time. Authors who edit `coachingCues[]` for a seeded variant will see a red test naming the seed entry and the changed array. |
| `CueCadenceRule` discriminated union shape is wrong for future cadence kinds (e.g., needs a different discriminator strategy) | Defer payload finalization to the first cadence-kind consumer that ships; today's three kinds are warranted by the ideation language. Extending the union is a non-breaking change. |
| Authors confuse the registry with the rule file and try to extend rules in the wrong place | The U2 JSDoc explicitly routes: rules go in `.cursor/rules/courtside-copy.mdc`; registry entries are cadence-aware annotations on cues that already exist in the catalog. The U7 follow-up plan (state-aware render) will cement this distinction. |
| The seed-of-one (`d33-pair` only) feels insufficient and tempts a parallel sweep | Scope-discipline guardrail: the rendering layer is the warrant for a full sweep. Until the render consumer ships, additional seeds are wasted authoring. Documented in `## Deferred to Follow-Up Work`. |
| `getCueCadenceEntries` lookup gets called from a hot path before any consumer exists | No hot path consumes it today; if a future consumer needs Map-indexed lookup, add it then. Premature optimization is deferred. |
| The plan accidentally ships next to in-flight 2026-05-10-004 work and the diff becomes hard to review | The 2026-05-10-004 work is *predecessor* (rule substrate + lints + copy sweep + assessment + solutions doc). This plan adds only three new files (`model/cueCadence.ts`, `data/cueCadenceRegistry.ts`, `data/__tests__/cueCadenceRegistry.test.ts`) and modifies at most one existing file (`model/index.ts` if it re-exports model types). The PR diff for this plan is cleanly separable. |

---

## Documentation / Operational Notes

- The plan is registered in `docs/catalog.json` under id `cue-cadence-registry-foundation-plan-2026-05-10` per `.cursor/rules/machine-scannable-docs.mdc` (canonical doc additions update the catalog in the same pass).
- The follow-up rendering plan will update `docs/solutions/2026-05-10-drill-first-time-runnability-system.md` to point at the registry once the render layer ships.
- No `.cursor/rules/` updates — the rule substrate landed via 2026-05-10-004 U1; this plan does not change rule text.
- Authors of new drill variants do not need to add a `CUE_CADENCE_REGISTRY` entry today — the registry is opt-in metadata. Follow-up plans will introduce authoring guidance when the rendering layer needs it.

---

## Sources & References

- **Origin ideation (#2):** [docs/ideation/2026-05-10-open-ideation.md](../ideation/2026-05-10-open-ideation.md) — A3 ⊕ B2 framing.
- **Predecessor plan (A3 wave 1 — lint substrate):** [docs/plans/2026-05-10-004-feat-drill-first-time-runnability-assessment-plan.md](2026-05-10-004-feat-drill-first-time-runnability-assessment-plan.md).
- **Predecessor brainstorm (rules 8–14 requirements):** [docs/brainstorms/2026-05-10-drill-first-time-runnability-requirements.md](../brainstorms/2026-05-10-drill-first-time-runnability-requirements.md).
- **Assessment artifact (per-drill rubric pass):** [docs/reviews/2026-05-10-drill-first-time-runnability-assessment.md](../reviews/2026-05-10-drill-first-time-runnability-assessment.md).
- **Solutions pattern doc:** [docs/solutions/2026-05-10-drill-first-time-runnability-system.md](../solutions/2026-05-10-drill-first-time-runnability-system.md).
- **Layer rules:** `.cursor/rules/data-access.mdc`, `.cursor/rules/typescript-exhaustive-switch.mdc`.
- **Pattern precedent (typed product primitive):** `app/src/model/skillVector.ts`.
- **Pattern precedent (frozen authored data + helper):** `app/src/data/archetypes.ts`, `app/src/data/substitutionRules.ts`.
- **Pattern precedent (data-tier shape regression test):** `app/src/data/__tests__/catalogValidation.test.ts`.
