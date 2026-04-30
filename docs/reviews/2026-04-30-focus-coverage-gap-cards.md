---
id: focus-coverage-gap-cards-2026-04-30
title: "Focus Coverage Gap Cards"
status: active
stage: validation
type: review
summary: "Grouped source-backed gap cards produced by the 2026-04-30 focus coverage readiness audit. Cards identify failing user-visible cells, candidate source material, blockers, and whether the expected fix is variant repair, reserve activation, or new source-backed drill work."
authority: "Durable gap-card backlog for Tune today focus coverage readiness; no catalog activation is authorized without exact source references and a batch manifest."
last_updated: 2026-04-30
depends_on:
  - docs/reviews/2026-04-30-focus-coverage-readiness-audit.md
  - docs/brainstorms/2026-04-30-focus-coverage-catalog-readiness-requirements.md
  - app/src/domain/sessionAssembly/focusReadiness.ts
  - app/src/data/drills.ts
decision_refs:
  - D81
  - D101
  - D130
  - D135
---

# Focus Coverage Gap Cards

## Purpose

Turn failing readiness cells into durable follow-up work without pretending the catalog is fixed. These cards are intentionally grouped by repeated failure pattern instead of listing all 105 failing cells one by one.

Activation requires a follow-up batch manifest that names exact `drillId` / `variantId` changes, cap delta, exact source references, adaptation deltas, verification commands, and checkpoint criteria.

## Status Vocabulary

- `failing`: confirmed generated-readiness failure
- `source_candidate`: candidate source direction exists, but activation evidence is incomplete
- `blocked_by_source`: no exact source/reference has been selected yet
- `blocked_by_product_gate`: product capability or scope gate blocks activation
- `fixed_pending_verification`: implemented but not verified
- `verified`: fixed and passing the readiness audit

## Gap Cards

### gap-advanced-focus-main-coverage

- **Status:** `source_candidate`
- **Risk buckets:** `cannot_generate`, `no_same_focus_swap`, `thin_long_session`
- **Affected cells:** advanced level across Passing, Serving, and Setting for current configurations and fixed durations; strongest visible risk is advanced named-focus generation.
- **Missing slots:** `main_skill`, `pressure`, same-focus swaps.
- **Candidate source material:** Volleyball Canada Development Matrix stage progressions, FIVB skill progressions, Better at Beach advanced variations where they preserve M001 simplicity.
- **Exact source reference:** not activation-ready yet.
- **Likely fix type:** source-backed variant repair first; new active drill records only if advanced-suitable variants cannot honestly extend existing families.
- **Affected catalog IDs:** existing beginner/intermediate families such as `d31`, `d33`, `d40`, and `d42` are candidates to inspect, but this card does not authorize changing them.
- **Blockers:** exact source references and adaptation deltas are not yet recorded; advanced drill suitability must not be invented from current beginner/intermediate rows.

### gap-serving-support-and-swaps

- **Status:** `source_candidate`
- **Risk buckets:** `off_focus_support`, `no_same_focus_swap`, `cannot_generate`
- **Affected cells:** Serving focus across solo/pair and net/no-net configurations, especially pair open/no-net and 40-minute sessions.
- **Missing slots:** focus-reinforcing `technique` / `movement_proxy` support, same-focus swaps, and some no-net serving main/pressure depth.
- **Candidate source material:** Better at Beach serving homework / drill-book serving variants, FIVB serve mechanics and serving design types, Volleyball Canada serving acquisition/consolidation language.
- **Exact source reference:** not activation-ready yet.
- **Likely fix type:** variant-first serving support options and no-net serving-mechanics variants before new drill records.
- **Affected catalog IDs:** inspect `d22`, `d31`, `d33`, and reserve `d23`; new IDs may be required for source-backed no-net serving support.
- **Blockers:** no-net Serving must not claim net clearance or live serve pressure; exact source references and adaptation deltas are required before activation.

### gap-setting-support-and-swaps

- **Status:** `source_candidate`
- **Risk buckets:** `off_focus_support`, `no_same_focus_swap`, `cannot_generate`
- **Affected cells:** Setting focus across all current configurations and levels.
- **Missing slots:** focus-reinforcing support, second main family in many contexts, same-focus swap depth, and pressure/game-like setting option where pressure applies.
- **Candidate source material:** existing BAB/FIVB setting source material behind `d40`, `d41`, `d42`, and deferred `d43`; Volleyball Canada setting stage language.
- **Exact source reference:** not activation-ready yet.
- **Likely fix type:** source-backed setting variants first; reserve activation only when participant/equipment gates are honest.
- **Affected catalog IDs:** inspect `d40`, `d41`, `d42`; `d43` remains gated by `D101` if its source geometry needs 3+ players.
- **Blockers:** current support slots are pass-shaped; pair/group geometry must stay honest; D101 blocks 3+ adaptations.

### gap-long-session-variety

- **Status:** `source_candidate`
- **Risk buckets:** `thin_long_session`, `no_same_focus_swap`, `off_focus_support`
- **Affected cells:** 40-minute named-focus sessions, especially Serving and Setting.
- **Missing slots:** pressure variety, same-focus swaps for both `main_skill` and `pressure`, and focus-reinforcing support that prevents long sessions from reading like stretched pass sessions.
- **Candidate source material:** FIVB drill design types and BAB scoring/constraint variations that create distinct training problems without adding a new focus taxonomy.
- **Exact source reference:** not activation-ready yet.
- **Likely fix type:** material variant repair first; new records only if variants would be renamed repeats.
- **Affected catalog IDs:** depends on the focus-specific cards above.
- **Blockers:** material distinction must be documented; same-family variants do not count twice without a source/setup/scoring/constraint rationale.

## Activation Batch Manifest

No activation batch is applied in this pass.

Before any follow-up activates drill content, create a manifest with:

- Included gap card IDs
- New or changed `drillId` / `variantId` values
- Cap delta
- Exact source references
- Adaptation deltas
- Verification command
- Checkpoint criteria before the next activation batch
