---
id: per-drill-capture-coverage-2026-04-27
title: "Per-drill capture coverage gaps (post-D133 / cca2 dogfeed)"
type: plan
status: active
stage: build
authority: "Implementation routing for the two per-drill capture coverage gaps surfaced by the 2026-04-27 cca2 dogfeed: gap 2b (count-eligible drills at non-main_skill slots get no capture surface at all — **shipped 2026-04-28**) and gap 2a (non-count main_skill / pressure drills capture Difficulty only, with no rep-shaped data captured even when the drill carries a meaningful per-rep metric like a longest streak or a 0-3 grade — **still gated**). Spec contract amended in `docs/specs/m001-review-micro-spec.md` §'Per-drill required field' and §'Non-count drills at main_skill / pressure (gap 2a)'."
summary: "Two gaps, two phases. Phase 1 (gap 2b) widens the Drill Check capture gate so count-eligible passing drills at technique / movement_proxy slots stop falling silent — **shipped 2026-04-28** as part of the architecture pass U2 (`11fed34`); the gate is now keyed off the metric-type strategy registry in `app/src/domain/capture/eligibility.ts` rather than `block.type ∈ {main_skill, pressure}`. Phase 2 (gap 2a) authors per-`successMetric.type` capture stories so streak / points-to-target / pass-grade-avg / composite drills gain a rep-shaped capture surface beyond the Difficulty chip; **still gated** on (i) Phase 1 live for ≥4 sessions, OR (ii) ≥2 founder-ledger sessions where Difficulty-only is explicitly noted as insufficient, OR (iii) partner walkthrough ≥P1 specifically on the gap. Trigger evidence: `docs/research/2026-04-27-cca2-dogfeed-findings.md` F1 + F2."
last_updated: 2026-04-28
depends_on:
  - docs/specs/m001-review-micro-spec.md
  - docs/decisions.md
  - docs/plans/2026-04-26-pair-rep-capture-tier1b.md
  - docs/research/2026-04-27-cca2-dogfeed-findings.md
related:
  - docs/research/founder-use-ledger.md
  - docs/research/2026-04-26-pair-rep-capture-options.md
  - docs/plans/2026-04-20-m001-tier1-implementation.md
  - docs/plans/2026-04-20-m001-adversarial-memo.md
decision_refs:
  - D104
  - D120
  - D131
  - D133
open_question_refs:
  - O12
---

# Per-drill capture coverage gaps

## Agent Quick Scan

- **Two gaps, two phases.** Phase 1 closes the slot-type gap (count-eligible drills at technique / movement_proxy slots stop falling silent). Phase 2 closes the metric-type gap (non-count main-skill drills gain a per-rep capture story, not just a Difficulty chip).
- **Spec contract changes already landed** in `docs/specs/m001-review-micro-spec.md` §"Per-drill required field" and §"Non-count drills at main_skill / pressure (gap 2a)" (`last_updated: 2026-04-27`). This plan is implementation routing.
- **Trigger evidence:** `docs/research/2026-04-27-cca2-dogfeed-findings.md` F1 + F2. Cca2 dogfeed produced one `perDrillCapture` row out of three count-eligible passing drills + one streak main_skill drill in a 25-min pair pass session.
- **Authoring budget:** zero new drill records. Phase 1 consumes one Tier 1b authoring-attention slot (alongside `docs/plans/2026-04-26-pair-rep-capture-tier1b.md`). Phase 2 is held until Phase 1 ships.
- **Telemetry constraint:** `D131` posture preserved — no remote calls; all new fields are local Dexie only.

## Why this plan exists in its current shape

The 2026-04-27 cca2 dogfeed (founder + Seb, pair pass session, plan `4212f2a3-…`, 25 min, Bump Set swapped in at main_skill) produced exactly one `perDrillCapture` row across five blocks. The trace:

- **Block 1 (technique):** `d10-pair` 6-Legged Monster, `successMetric.type: 'pass-rate-good'` — count-eligible. Got no Drill Check capture because `DrillCheckScreen.tsx:90` gates on `block.type ∈ {main_skill, pressure}`.
- **Block 2 (movement_proxy):** `d03-pair` Continuous Passing, `successMetric.type: 'pass-rate-good'` — count-eligible. Same gate, same result.
- **Block 3 (main_skill, swapped):** `d38-pair` Bump Set Fundamentals, `successMetric.type: 'streak'` — not in `COUNT_BASED_METRIC_TYPES`. Got Difficulty chip but no count surface (because `streak` is excluded by `policies.ts:69-72` and `PerDrillCapture.tsx:120` gates `Add counts` on count-eligible types only).

Net: the founder ran three real passing reps and one setting rep, and the system captured one chip total. The two gaps compounding here are distinct and have distinct fixes.

## Gap 2b — count-eligible drills at non-main_skill slots (Phase 1, **shipped 2026-04-28**)

### As-built notes (2026-04-28)

Shipped as part of the 2026-04-28 architecture pass U2 capture-domain consolidation (`11fed34`). The implementation diverged from the original plan in one structural way: instead of widening an inline gate inside `DrillCheckScreen.tsx`, U2 lifted the entire eligibility decision into `app/src/domain/capture/eligibility.ts::resolveDrillCheckCaptureEligibility`, keyed off the metric-type strategy registry (`metricCapturesCounts`). The new resolver returns three states:

- `eligible_counts` — drill is count-eligible (`metricCapturesCounts(metricType) === true`); fires regardless of slot type, except `warmup` / `wrap`. This is the gap-2b widening.
- `eligible_difficulty_only` — drill is `main_skill` or `pressure` but not count-eligible; renders Difficulty chips only. This is the gap-2a holding posture.
- `bypass` — anything else (warmup / wrap / non-count support slots / skipped / missing catalog ids / completed session).

Net effect: a count-eligible passing drill at the `technique` slot (e.g., `d10-pair` 6-Legged Monster) or the `movement_proxy` slot (e.g., `d03-pair` Continuous Passing) now triggers `eligible_counts` and renders the full Difficulty + optional Good/Total surface. The cca2 dogfeed scenario (`docs/research/2026-04-27-cca2-dogfeed-findings.md` F1 + F2 gap 2b) is closed.

Coverage proven by:

- `app/src/domain/__tests__/drillCheckCapture.test.ts` (8 cases): pins `eligible_counts` for `d10-pair` at `technique`, `d03-pair` at `movement_proxy`, and `d33-pair` at `pressure`; pins `eligible_difficulty_only` for `d38-pair` at `main_skill` (`streak`); pins `bypass` for `d38-pair` at `technique` (non-count support slot), skipped previous block, missing catalog ids, and completed session.
- `app/src/screens/__tests__/DrillCheckScreen.perDrillCapture.test.tsx`: pins the screen-tier wiring (Continue gating, draft persistence, hydration) using the count-eligible technique fixture (`d10-pair`).
- `app/src/domain/__tests__/drillMetadata.test.ts`: pins variant-resolution agreement between `getBlockMetricType` and `getBlockSuccessRule` so the count-eligibility decision and the rendered success rule can never disagree.

Spec sync: `docs/specs/m001-review-micro-spec.md` §"Per-drill required field" reads "regardless of slot type (technique / movement_proxy / main_skill / pressure)" and the §"Surface coverage history (2026-04-27)" addendum names the gap and the widened gate.

### Problem

The Drill Check capture gate hard-codes `block.type ∈ {main_skill, pressure}`. The original `D133` spec language read "after completed main-skill blocks" and the implementation took that literally as a slot-type gate. But count-eligible drills (`successMetric.type ∈ {pass-rate-good, reps-successful}`) carry meaningful per-rep data **regardless of which slot they occupy** — a passing drill at the technique slot is still a passing drill. Today's pair pass session ran two count-eligible passing drills at technique / movement_proxy and got nothing.

### Fix

Widen the `captureTarget` gate in `app/src/screens/DrillCheckScreen.tsx`:

```tsx
// Before (pre-2026-04-27)
const captureTarget: SessionPlanBlock | null =
  prevBlock &&
  prevBlockStatus?.status === 'completed' &&
  (prevBlock.type === 'main_skill' || prevBlock.type === 'pressure') &&
  prevBlock.drillId &&
  prevBlock.variantId
    ? prevBlock
    : null

// After (Phase 1)
const captureTargetMetricType =
  prevBlock && prevBlock.drillId && prevBlock.variantId
    ? getBlockMetricType(prevBlock, playerCount)
    : null
const isCountEligible =
  captureTargetMetricType !== null && COUNT_BASED_METRIC_TYPES.has(captureTargetMetricType)
const captureTarget: SessionPlanBlock | null =
  prevBlock &&
  prevBlockStatus?.status === 'completed' &&
  prevBlock.drillId &&
  prevBlock.variantId &&
  // EXCLUDE warmup + wrap (no skill content to score) and recovery blocks
  prevBlock.type !== 'warmup' &&
  prevBlock.type !== 'wrap' &&
  // INCLUDE main_skill / pressure unconditionally (existing behavior)
  // OR INCLUDE technique / movement_proxy when the drill is count-eligible
  (prevBlock.type === 'main_skill' ||
    prevBlock.type === 'pressure' ||
    isCountEligible)
    ? prevBlock
    : null
```

This keeps warmup and wrap silent (no skill content to score), keeps main_skill / pressure unconditional, and adds technique / movement_proxy to the capture surface when the drill is count-eligible. Bypass logic in the `useEffect` redirect at `DrillCheckScreen.tsx:269-288` works unchanged because it keys on `captureTarget === null`.

### Files touched (Phase 1)

- `app/src/screens/DrillCheckScreen.tsx` — widen the `captureTarget` gate as above.
- `app/src/screens/__tests__/DrillCheckScreen.perDrillCapture.test.tsx` — add coverage for technique-slot count-eligible drills (`d10-pair` 6-Legged Monster, `d03-pair` Continuous Passing) showing the chip; add coverage for technique-slot non-count drills (e.g., a hypothetical `streak` drill at technique) bypassing as before.
- `docs/specs/m001-review-micro-spec.md` — already updated (2026-04-27); this plan codifies the implementation.
- `docs/research/founder-use-ledger.md` — already updated (2026-04-27 row points at this plan).

### Files NOT touched (Phase 1)

- `app/src/components/PerDrillCapture.tsx` — no change. The component already takes `showCounts` and `successRuleDescription` props that flow from drill metadata; widening the upstream gate doesn't change the component contract.
- `app/src/db/schema.ts` — no Dexie migration. The `perDrillCaptures` shape (Dexie v5) already accommodates technique / movement_proxy captures via `blockIndex`; the schema is metric-type-agnostic and slot-type-agnostic.
- `app/src/services/review.ts` — no write-path change. The aggregation already iterates `perDrillCaptures` regardless of which block index produced each entry.
- `app/src/screens/CompleteScreen.tsx`, `app/src/screens/ReviewScreen.tsx` — no change. They consume the Dexie field, not the slot type.
- `app/src/domain/sessionBuilder.ts`, `app/src/data/archetypes.ts`, `app/src/data/drills.ts` — no change. The fix is on the capture surface, not on session assembly.

### Tests (Phase 1)

1. **DrillCheck shows the Difficulty chips for `d10-pair` (technique, `pass-rate-good`).** Build a plan with 6-Legged Monster at the technique slot, mark the block completed, navigate to `/run/check`, assert `data-testid="per-drill-capture"` renders.
2. **DrillCheck shows the `Add counts` affordance for `d03-pair` (movement_proxy, `pass-rate-good`).** Same shape; assert `data-testid="per-drill-add-counts"` is present.
3. **DrillCheck still bypasses on warmup / wrap.** Assert the screen redirects to `/run/transition` for both block types.
4. **DrillCheck still bypasses on a hypothetical technique-slot non-count drill.** Build a plan with a synthetic `streak`-shaped technique drill; assert bypass behavior preserved (Phase 2 lifts this).
5. **DrillCheck still captures unconditionally for main_skill / pressure.** Regression: existing test for `d38-pair` at main_skill (streak) keeps the chip-only surface unchanged.
6. **Continue button gating.** Difficulty chip required to advance, regardless of slot type. Existing gating-hint test extends.

### Acceptance (Phase 1)

- 6-finding ship checklist:
  - Phase 1 implements gate widening as specified. **Done** (via U2 capture-domain consolidation; resolver lifted into `domain/capture/eligibility.ts`).
  - Existing tests pass; new test cases land. **Done** (`drillCheckCapture.test.ts` covers all three eligibility branches; 1065/1065 Vitest pass).
  - `npm run lint` clean; `npm run build` clean. **Done.**
  - `docs/specs/m001-review-micro-spec.md` already amended (no further changes needed). **Done.**
  - One pair-flow Playwright spec extended at most. **Not extended** (coverage proven at the domain + screen-integration tier; redundant at e2e).
  - No drill-record authoring-budget consumption (zero new drills). **Done.**
  - One Tier 1b authoring-attention slot consumed (acknowledged in next adversarial-memo Weekly Log). **Done.**

## Gap 2a — non-count main-skill drills capture Difficulty only (Phase 2, gated)

### Problem

`COUNT_BASED_METRIC_TYPES` excludes `streak`, `points-to-target`, `pass-grade-avg`, `composite`, and `completion`. For a session like today's where the main_skill was Bump Set (`d38-pair`, `streak`), the `Add counts` affordance does not render — by spec — because asking for Good/Total on a streak drill is semantically wrong (a streak is one number, not a ratio). But that leaves the per-rep data surface empty: the Difficulty chip alone tells `D104` nothing about *what happened during the rep*.

This is a real coverage gap, not just a UX inconvenience. `D104`'s 50-contact rolling-window math (`O12`) needs *some* per-rep signal on these drills. Difficulty alone is too coarse-grained.

### Why deferred to Phase 2

The fix is **not** "show Good/Total on streak drills anyway." That re-introduces the honesty failure that Framing D in `docs/research/2026-04-26-pair-rep-capture-options.md` was designed to remove. The fix requires authoring per-`successMetric.type` capture stories:

| `successMetric.type` | Proposed capture shape | One-input form? |
| --- | --- | --- |
| `streak` | Longest unbroken streak this block | Yes (single integer input, e.g., `"Longest rally: __ sets"`) |
| `points-to-target` | Points scored this block | Yes (single integer input) |
| `pass-grade-avg` | Average grade this block | Yes (0.0-3.0 stepper or single chip from a 4-anchor row) |
| `composite` | Per-component subset (deferred) | No — needs spec authoring |
| `completion` | Already binary; covered by `blockStatuses[i].status === 'completed'` | Implicit; no form needed |

This is a decision-row-class change, not just an implementation tweak. The capture shapes need:

1. A **decision row** in `docs/decisions.md` (proposed `D###`) for whether the new shapes ship in v0b or wait for M001-build proper.
2. A **spec patch** on `docs/specs/m001-review-micro-spec.md` §"Per-drill capture at Drill Check (D133)" extending the optional-fields list with the per-metric-type shapes.
3. A **Dexie schema bump** (v6) adding the new optional fields on `PerDrillCapture` (e.g., `streakLongest?: number`, `pointsScored?: number`, `passGrade?: 0 | 1 | 2 | 3`).
4. A **`PerDrillCapture.tsx` component branch** rendering the appropriate input by metric type when the user expands `Add counts`.
5. A **`policies.ts` update** — likely a per-`successMetric.type` capture-shape lookup that replaces the binary `COUNT_BASED_METRIC_TYPES` set.
6. A **`D104` engine readiness check** — whether the rolling-window math can consume heterogeneous per-metric-type signals or whether the engine itself needs to branch.

### Trigger condition for Phase 2

Phase 2 fires when **any** of the following occurs:

- Founder logs ≥2 sessions on a `streak` / `points-to-target` / `pass-grade-avg` / `composite` main_skill drill where the Difficulty-only capture is explicitly noted as "I wanted to record what happened during the rep."
- Partner walkthrough ≥P1 flag specifically on a non-count main-skill drill capture being insufficient.
- Phase 1 has been live for ≥4 sessions and `docs/research/founder-use-ledger.md` rows confirm the gap 2b widening is landing as intended (no regressions on count-eligible coverage).

The third condition is a *readiness* check, not a *demand* check: Phase 2 should not author new capture surfaces while Phase 1's coverage widening is still being validated.

### What Phase 2 does NOT do (parking lot)

| Item | Reason |
| --- | --- |
| In-session running rep counter on `RunScreen.tsx` (Framing C) | Different surface, different decision row. See `docs/plans/2026-04-26-pair-rep-capture-tier1b.md` §"What is NOT in this plan" — separately re-trigger-gated. |
| Per-block RPE | `D120` posture: one `sessionRpe` per session in v0b. |
| Backfilling historical reviews to drill-grain or per-metric-type capture | Forward-only is the right `D131` posture. |
| Multi-component composite-metric capture | Spec-authoring work. Deferred until at least one Phase 2 metric ships and gets validated. |

## Cross-cutting concerns

### Accessibility

The widened gate in Phase 1 means more screens carry the Difficulty radiogroup. The existing `role="radiogroup"` + `aria-checked` + 54px touch targets in `PerDrillCapture.tsx:95-118` carry through unchanged.

### Adversarial-memo discipline

This plan does **not** change any falsification condition. It does consume one Tier 1b authoring-attention slot for Phase 1; the next Monday adversarial-memo Weekly Log entry should record the consumption alongside `docs/plans/2026-04-26-pair-rep-capture-tier1b.md` and `docs/plans/2026-04-22-tier1b-serving-setting-expansion.md`.

### Migration safety

Phase 1: zero migration risk. The gate widening only affects which screens render; it does not change the persisted shape.

Phase 2 (when fired): forward-only Dexie v6 migration; existing `perDrillCaptures` rows keep `streakLongest` / `pointsScored` / `passGrade` as `undefined`. Readers handle absence as "session captured under v5 schema; no per-metric-type data available."

## For agents

- **Authoritative for**: per-drill capture coverage gap routing (gap 2a + 2b) post-`D133`; the Phase 1 / Phase 2 split; the trigger condition for Phase 2.
- **Edit when**: Phase 1 ships (mark gate-widened, update with as-built notes); Phase 2 trigger fires (record evidence, advance status to `active`).
- **Belongs elsewhere**: the spec contract (`docs/specs/m001-review-micro-spec.md`); the original `D133` decision row (`docs/decisions.md` `D133`); the four-framing analysis (`docs/research/2026-04-26-pair-rep-capture-options.md`); the cca2 dogfeed evidence (`docs/research/2026-04-27-cca2-dogfeed-findings.md`).
- **Outranked by**: `docs/decisions.md`; `docs/specs/m001-review-micro-spec.md`; `docs/plans/2026-04-20-m001-tier1-implementation.md` (Tier 1b/1c trigger conditions); `docs/plans/2026-04-20-m001-adversarial-memo.md` (authoring-budget cap).
- **Key pattern**: same plan shape as `docs/plans/2026-04-26-pair-rep-capture-tier1b.md` (trigger evidence → gate status → scope → not-in-scope → implementation → tests → acceptance → for agents). Phased here because Phase 1 is small and pure; Phase 2 is contract-shaping and gated.
