---
id: pair-rep-capture-tier1b-2026-04-26
title: "Tier 1b: Pair rep capture moves to per-drill Check (D133)"
type: plan
status: complete
stage: shipped
authority: "Tier 1b implementation plan for the post-2026-04-26 pair rep-capture work unlocked by the P2-3 founder-session trigger. Implements `D133` (Framing D from `docs/research/2026-04-26-pair-rep-capture-options.md`): a dedicated `/run/check` screen after completed blocks with required per-drill **Difficulty tag**, optional per-drill **Good/Total** affordance that reuses the existing `PassMetricInput` component, corresponding Review-screen card removal for count drills, Complete drill-grain aggregation, and the Dexie schema migration that lands the `perDrillCaptures` shape `V0B-12` already required."
summary: "Shipped 2026-04-27. Adds `perDrillCaptures: PerDrillCapture[]` to the `SessionReview` Dexie record, wires a 3-chip required `DifficultyTag` plus optional per-drill Good/Total capture on the dedicated `/run/check` (`DrillCheckScreen`) route, removes the session-level `PassMetricInput` from `ReviewScreen.tsx` for count drills (`successMetric.type` ∈ `pass-rate-good` / `reps-successful`), updates Complete to aggregate from drill-grain when present, and bumps the Dexie schema with a forward-only migration. Trigger formally met 2026-04-26 per `docs/research/founder-use-ledger.md`. Does **not** consume the drill-record authoring-budget cap (zero new drills); does consume one Tier 1b authoring-attention slot."
last_updated: 2026-04-27
depends_on:
  - docs/decisions.md
  - docs/specs/m001-review-micro-spec.md
  - docs/plans/2026-04-20-m001-tier1-implementation.md
  - docs/plans/2026-04-20-m001-adversarial-memo.md
  - docs/research/2026-04-26-pair-rep-capture-options.md
  - docs/research/founder-use-ledger.md
  - docs/research/partner-walkthrough-results/2026-04-22-all-passes-reconciled.md
related:
  - docs/plans/2026-04-22-tier1b-serving-setting-expansion.md
  - docs/plans/2026-04-23-walkthrough-closeout-polish.md
  - docs/plans/2026-04-26-pre-d91-editorial-polish.md
  - docs/plans/2026-04-27-per-drill-capture-coverage.md
  - docs/research/2026-04-27-cca2-dogfeed-findings.md
decision_refs:
  - D9
  - D80
  - D104
  - D120
  - D125
  - D130
  - D131
  - D132
  - D133
---

# Tier 1b: Pair rep capture moves to per-drill at Transition (D133)

## Agent Quick Scan

- **One product change, one Dexie migration, one new component, two screen edits, one screen card-removal.** Scope is narrow and shaped by the authoring-attention cap, not by what is technically possible.
- **Gated on the Tier 1b `P2-3` founder-session trigger.** Trigger formally met **2026-04-26** via `docs/research/founder-use-ledger.md` 2026-04-26 row (`pass-rate-good` pair session with explicit "fake count" flag).
- **Decision input:** `docs/research/2026-04-26-pair-rep-capture-options.md` (four-framing analysis). **Decision:** `D133` in `docs/decisions.md` (ratified Framing D, shipped 2026-04-27). **Spec contract:** `docs/specs/m001-review-micro-spec.md` §"Per-drill capture at Drill Check (D133)".
- **Authoring-budget consumption:** **zero new drill records** (the per-`docs/research/partner-walkthrough-results/2026-04-22-all-passes-reconciled.md` reconciled-list rule that "trigger-gated items involve metadata and UI, not new drill records"). Sibling plan `docs/plans/2026-04-22-tier1b-serving-setting-expansion.md` consumes 4/10 of the drill-record cap. This plan consumes one **Tier 1b authoring-attention slot** alongside that one.
- **Shipped shape:** dedicated Drill Check route after completed blocks, Review removal, Complete aggregate, Dexie bump, services/review write-path, and focused tests.

## Why this plan exists in its current shape

The 2026-04-26 founder pair pass session (Seb + founder, `d11` + `d03` + `d10`, 25 min, `pass-rate-good`) reported that post-session Good/Total capture felt fake — the founder told the agent in chat that the count "is too hard to track and fill out post workout" and that completed reviews "often resulting in 'fake' counts." That single message satisfies the explicit pre-registered Tier 1b unlock condition recorded in `docs/research/partner-walkthrough-results/2026-04-22-all-passes-reconciled.md` §"Tier 1b — gated by founder-session trigger":

> **In-session running rep counter** for pair drills. Trigger: founder logs ≥2 sessions where the `notCaptured` default feels wrong, OR ≥1 `pass-rate-good` session where the guess was explicitly noted as fake.
> **Full drill-metadata-driven capture UI** on Review (hide Good/Total entirely for non-count drills; branch `PassMetricInput` on capture style). Same trigger as above.

Two distinct items. The trigger fires both. This plan addresses the **second** ("Full drill-metadata-driven capture UI"), reshaped under `D133`'s Framing D so the new surface is Transition rather than Review and the required field is a per-drill Difficulty tag rather than per-drill counts. The **first** (in-session running rep counter on `RunScreen.tsx`) is **explicitly deferred** under a tighter re-trigger condition (see §"What is NOT in this plan").

The reshape is recorded in `docs/research/2026-04-26-pair-rep-capture-options.md` (four-framing analysis: A per-drill tag at Transition; B per-drill Good/Total at Transition; C in-session counter on RunScreen; D hybrid tag-required + counts-optional, both at Transition). Framing D wins on the honesty test (the user's literal complaint was that counts feel fake — making counts optional removes the obligation to invent) and on `D104` math preservation (counts when filled satisfy `V0B-12` exactly; absent counts trigger the spec's documented graceful-degradation rule rather than breaking the engine).

## Gate status (2026-04-26)

Per `docs/plans/2026-04-20-m001-tier1-implementation.md` Tier 1b trigger model + `docs/research/partner-walkthrough-results/2026-04-22-all-passes-reconciled.md` §"Tier 1b — gated by founder-session trigger":

- **Tier 1a acceptance bar passes.** Met (Tier 1a shipped 2026-04-20 onward; units 1-5 landed; 2026-04-22 partner-walkthrough polish and 2026-04-23 walkthrough-closeout polish both landed).
- **`P2-3` single-session trigger condition.** Met **2026-04-26** — `docs/research/founder-use-ledger.md` 2026-04-26 row records a `pass-rate-good` pair pass session with the explicit "fake count" flag (`d11 One-Arm Passing Drill`, `d03 Continuous Passing`, `d10 The 6-Legged Monster`).
- **`D133` decision row ratified.** Met — see `docs/decisions.md` `D133` (2026-04-27).
- **Spec patch in place.** Met — see `docs/specs/m001-review-micro-spec.md` §"Per-drill capture at Drill Check (D133)" (`last_updated: 2026-04-27`, `D133` added to `decision_refs`).

**Plan authoring is permitted; implementation is permitted contingent on founder ratification of `D133`.** The agent-proposed posture in `D133` records the rollback path: if the founder downgrades to Framing B (per-drill counts at Transition, no required tag) before implementation lands, this plan amends in place — the §"Scope" Difficulty-tag rows drop, the §"Implementation" `DifficultyTag` component is dropped, and §"Tests" loses the tag-required cases. The Dexie migration shape stays valid because `perDrillCaptures.difficulty` becomes optional rather than required. Ratification can be implicit (founder reads the plan, doesn't push back, agent ships) or explicit (founder edits `D133` row to remove the agent-proposed posture).

## Scope

### Surface change 1: Drill Check screen gains per-drill capture

`app/src/screens/DrillCheckScreen.tsx` (`/run/check`, after completed drill blocks and before Transition/Up Next) gains a card titled `How was that drill?` (final copy decided in courtside-copy review, not here). Card contains:

- **Required: 3-chip Difficulty selector.** Internal enum `DifficultyTag = 'too_hard' | 'still_learning' | 'too_easy'`. User-facing labels TBD in courtside-copy review under `.cursor/rules/courtside-copy.mdc` invariants 2 (one-season rec player) and 5 (cool-down equal review weight). Initial proposed labels: `Too hard`, `Still learning`, `Too easy` — the spec patch flagged that `still_learning` deliberately distinguishes the per-drill tag from the deleted session-level `QuickTagChips` `About right` (load-rightness vs acquisition-stage). Card cannot advance until one chip is tapped.
- **Optional: collapsed `Add counts` affordance.** Below the Difficulty chips. Tap to expand → renders the existing `PassMetricInput` component for this drill-variant, with the same `Good passes` / `Total attempts` / `notCaptured` controls. Default expanded state for count drills (`successMetric.type` ∈ `pass-rate-good` / `reps-successful`): collapsed (per `D133` rationale that the user should never feel obligated to invent counts). Default for non-count drills: not rendered at all (the existing `notCaptured`-default rule on Review applies; Transition does not duplicate the choice).
- **Card placement:** above the existing Transition-screen content ("Up next: …" preview, audio-test affordance), not below, so the per-drill capture is the dominant prompt while the just-finished drill is fresh.
- **Block advance:** the existing "Next block" button is gated on the Difficulty chip having been tapped. Skipping the optional counts is fine; skipping the tag is not.

### Surface change 2: Review-screen Good/Total card hides for count drills

`app/src/screens/ReviewScreen.tsx`: when the session's main-skill drill has `successMetric.type` ∈ `pass-rate-good` / `reps-successful`, the existing session-level `PassMetricInput` card no longer renders. The session-level `Good passes` / `Total attempts` aggregate is computed from `perDrillCaptures` on read and shown as a read-only summary chip below the RPE chips (e.g., `42 / 60 (3 drills)`).

For non-count drills, the existing `notCaptured`-default behavior is unchanged. The Review screen continues to render the session-level `notCaptured`-toggle card on `streak` / `points-to-target` / `pass-grade-avg` / `composite` / `completion` drills, exactly as it did pre-2026-04-26.

### Surface change 3: Complete-screen aggregation

`app/src/screens/CompleteScreen.tsx`: if `perDrillCaptures` has any entries with `goodPasses` / `attemptCount` filled, aggregate them into the session-level total displayed by `formatPassRateLine`. If none have counts, fall back to the existing session-level `goodPasses` / `attemptCount` (which remain populated for back-compat and for any drill that still goes through the Review-screen card).

### Surface change 4: Dexie migration

`app/src/db/schema.ts`: bump `VolleycraftDB` version. Add a new field on the `SessionReview` table:

```ts
perDrillCaptures?: PerDrillCapture[]
```

where:

```ts
type PerDrillCapture = {
  drillVariantId: string;
  blockIndex: number;
  difficulty: DifficultyTag;
  goodPasses?: number;
  attemptCount?: number;
  notCaptured?: true;
};
```

Forward-only migration. Existing reviews keep `perDrillCaptures: undefined`; readers handle absence as "session-level fallback applies." No backfill of historical reviews. No telemetry per `D131`.

### Surface change 5: Service write-path

`app/src/services/review.ts`: extend the review-write path to accept `perDrillCaptures[]` from the Drill Check screen, persist it on the `SessionReview` record at session end. Aggregation read-path in `CompleteScreen` and `ReviewScreen` consumes the field via a small helper (`aggregateDrillCaptures(perDrillCaptures)` returning `{ goodPasses, attemptCount, drillCount }`).

State during the session itself (between blocks, not yet at session end): the runner accumulates captures before routing through Transition. Captures persist to Dexie only at session end with the rest of the review payload, exactly as the existing flow already does for `sessionRpe`.

### Vocabulary work (small)

Per the spec patch, `DifficultyTag` user-facing labels need a courtside-copy review pass before they ship. The labels carry semantic weight (`still_learning` is deliberately not `about_right`), so this is not a free copy edit — it's a labeled-thing review under invariants 2 and 5. Bundle this into the implementation PR as a single courtside-copy file change.

### What is NOT in this plan

| Item | Reason | Where it goes |
|---|---|---|
| Framing C — in-session running tally on `RunScreen.tsx` | Same Tier 1b bucket per `docs/research/partner-walkthrough-results/2026-04-22-all-passes-reconciled.md` §"Tier 1b — gated", but distinct affordance with higher courtside-attention cost (a tap per rep on the critical reading surface) and higher authoring cost (new live-counter component, new `liveTally` storage shape, edit affordance on Complete). Re-trigger condition: founder logs ≥2 additional sessions after `D133` ships where the per-drill Good/Total optional card *also* felt fake or was systematically skipped on a session where the founder wanted the data. Then re-evaluate Framing C against the post-`D133` baseline rather than the pre-`D133` baseline. | Future Tier 1b plan, separate decision row |
| Pair role-swap audio cue (`variant.roleSwapAtMinute?` metadata) | Different `P2-2` trigger ("founder logs ≥2 pair sessions with unclear role transitions"). Not fired. | `docs/research/partner-walkthrough-results/2026-04-22-all-passes-reconciled.md` §"Tier 1b — gated", own future plan |
| Tap-to-expand per-stretch demo on wrap block | Different `P1-8` trigger. Not fired. | Same |
| Delete `Chosen because:` from Run + Swap-sheet re-home | Different trifold T1 trigger. Not fired. | Same |
| Backfill historical session reviews to drill-grain | Forward-only is the right posture for `D131` (no remote, local-first); existing session-level data stays as session-level and the spec patch's graceful-degradation rule covers historical readers. | Out of scope, not planned |
| `D104` engine wiring (50-contact rolling-window math against drill-grain capture) | The engine itself is M001-build, not Tier 1b. This plan persists the data the engine will need; it does not advance the adaptation engine's progression-emission logic. | M001-build proper |
| `pickForSlot` / `findSwapAlternatives` filter changes | Out of scope. Same architectural-shape concern called out in `docs/plans/2026-04-22-tier1b-serving-setting-expansion.md` §"What is NOT in this plan". | Separate Tier 1c work, separate decision |
| Revival of session-level `QuickTagChips` | The 2026-04-23 deletion stands per spec patch. The per-drill `DifficultyTag` is grain-different (per-drill not per-session) and meaning-different (acquisition-stage not load-rightness), not a reversal. | Not in scope; design discipline |
| Per-block RPE | `D120` keeps one `sessionRpe` per session in v0b. Per-block subjective load is `D120`'s "eventually" track, gated on `SessionParticipant[]` shape from `D115`. | Not in scope |
| New drill records | This plan authors zero. Sibling plan `docs/plans/2026-04-22-tier1b-serving-setting-expansion.md` carries the drill-record cap (currently 4/10). | Not in scope |

## Implementation

### Files touched

- `app/src/db/schema.ts` — bump version; add `perDrillCaptures?: PerDrillCapture[]` field on `SessionReview` table; add `PerDrillCapture` and `DifficultyTag` type exports.
- `app/src/screens/DrillCheckScreen.tsx` — add `<PerDrillCapture />` card on `/run/check`; wire to in-session draft state; gate continuing to Transition on `difficulty` being set.
- `app/src/components/PerDrillCapture.tsx` — **new** component. Renders the Difficulty 3-chip selector (required) and the collapsed `Add counts` affordance (optional, expands to `<PassMetricInput />` for the just-completed drill-variant).
- `app/src/components/PassMetricInput.tsx` — make the existing component embeddable per-drill (it already takes per-instance props; verify nothing assumes session-level singleton).
- `app/src/screens/ReviewScreen.tsx` — for count drills (`successMetric.type` ∈ `pass-rate-good` / `reps-successful`), **do not render** the session-level `PassMetricInput`; render a read-only `aggregateDrillCaptures` summary chip instead. For non-count drills, leave existing rendering unchanged.
- `app/src/screens/CompleteScreen.tsx` — `formatPassRateLine` consumes `aggregateDrillCaptures(perDrillCaptures)` when entries are present; falls back to session-level when not.
- `app/src/services/review.ts` — extend `submitReview` write-path to persist `perDrillCaptures[]`; add `aggregateDrillCaptures` helper.
- `app/src/services/__tests__/review.test.ts` (or equivalent) — new write-path coverage.
- `app/src/screens/__tests__/DrillCheckScreen.test.tsx` — new tests for the per-drill capture card.
- `app/src/screens/__tests__/ReviewScreen.*.test.tsx` — extend existing tests for the count-drill-card-hidden case.
- `app/src/screens/__tests__/CompleteScreen.summary.test.tsx` — extend for the drill-grain aggregate path.
- `app/src/components/__tests__/PerDrillCapture.test.tsx` — new component-level tests.
- `app/e2e/*.spec.ts` — extend at most one existing pair-flow Playwright spec to cover the Transition card. Do **not** add new e2e files — the unit tests carry the load.

### Files NOT touched

- `app/src/screens/RunScreen.tsx` — no in-session counter (Framing C is out of scope).
- `app/src/screens/SetupScreen.tsx`, `SafetyCheckScreen.tsx`, `SkillLevelScreen.tsx` — no upstream changes.
- `app/src/data/drills.ts`, `archetypes.ts`, `progressions.ts` — no content authoring.
- `app/src/lib/voiceFromContext.ts` — no voice changes; the per-drill card uses neutral copy that reads in both solo and pair voice.
- `app/src/types/drill.ts` — no schema changes (the new types live in `app/src/db/schema.ts` near the existing `SessionReview` shape).
- `app/wrangler.jsonc` — no deployment-config changes.
- `docs/research/founder-use-ledger.md` — only updated post-implementation if the founder runs a session that exercises the new capture, per the post-ship-follow-ups list below.

### Tests

**`PerDrillCapture.test.tsx`** (new component-level coverage):

1. Renders three Difficulty chips with the planned labels (`Too hard` / `Still learning` / `Too easy`); ARIA roles correct; chips are 54-60px courtside-touch-target compliant per `D8`.
2. Tapping a chip selects it; selection persists in component state; `onSelect` callback fires with the internal `DifficultyTag` enum value.
3. `Add counts` affordance is collapsed by default for count drills.
4. `Add counts` does not render at all for non-count drills.
5. Expanding `Add counts` renders an embedded `PassMetricInput` for the current drill-variant.

**`DrillCheckScreen.test.tsx`** (extend):

6. Per-drill capture card renders above the "Up next" preview.
7. Next-block button is disabled until a Difficulty chip is selected.
8. Selecting a chip enables Next-block.
9. Filling the optional counts persists them in draft state across the Next-block transition.
10. Non-count drills do not render the `Add counts` affordance.

**`ReviewScreen.*.test.tsx`** (extend):

11. For a `pass-rate-good` main-skill drill with `perDrillCaptures` entries, the session-level `PassMetricInput` does **not** render; a read-only aggregate summary chip renders in its place.
12. For a `streak` main-skill drill (non-count), the existing session-level `notCaptured`-default card still renders unchanged (regression).
13. For a `pass-rate-good` main-skill drill with empty `perDrillCaptures`, the read-only chip shows `Not captured` (back-compat fallback).

**`CompleteScreen.summary.test.tsx`** (extend):

14. `formatPassRateLine` aggregates from `perDrillCaptures` when entries are present (e.g., 3 drills with 18/24, 12/15, 12/21 → `42 / 60` displayed).
15. Falls back to session-level `goodPasses` / `attemptCount` when `perDrillCaptures` is absent (regression).

**`services/review.test.ts`** (extend):

16. `submitReview` persists `perDrillCaptures[]` to Dexie on a count-drill session.
17. `submitReview` writes `perDrillCaptures: undefined` (or empty) on a non-count-drill session and the read-path handles absence.
18. Dexie schema migration: simulate an existing `SessionReview` row from the previous version; assert the read-path treats absent `perDrillCaptures` as the back-compat case.

**Regression suite:**

- Existing pre-`D133` tests continue to pass unchanged. In particular the recently-landed `RunScreen` countdown-chip test (`BlockTimer.progress-chip.test.tsx`), the post-2026-04-23 RPE chip tests, and the session-level `notCaptured`-default test should be unaffected by this work.
- `npm run lint` clean.
- `npm run build` clean.
- `npm run test:e2e` clean (with the one extended pair-flow spec).

## Acceptance

Tier 1b ships when **all** of the following hold:

1. **Trigger fires.** Met **2026-04-26** per `docs/research/founder-use-ledger.md` 2026-04-26 row.
2. **`D133` is ratified** (founder reads the row and either accepts the agent-proposed posture or downgrades to Framing B; the plan amends in place if the latter).
3. **Spec patch is in place.** Met — `docs/specs/m001-review-micro-spec.md` §"Per-drill capture at Drill Check (D133)" exists; `last_updated: 2026-04-27`; `D133` is in `decision_refs`.
4. The 5 surface changes above land in their respective files; types are exported from `app/src/db/schema.ts`; the Dexie schema version bumps cleanly.
5. The `PerDrillCapture.tsx` component lands; the `PassMetricInput` component is embeddable per drill without regressions.
6. All new + regression tests pass locally (units, screens, services, one extended e2e).
7. `npm run lint` and `npm run build` clean.
8. Tier 1a acceptance items remain unaffected: `d28` warmup default, Chosen-because annotations on every block, 3-row Home trailer, `SKILL_TAGS_BY_TYPE` includes `'set'`, the post-2026-04-23 RPE chip ship, the post-2026-04-22 polish landings.
9. **No drill-record authoring-budget consumption.** Sibling plan `docs/plans/2026-04-22-tier1b-serving-setting-expansion.md` consumes 4/10 of the cap; this plan adds 0/10. **One Tier 1b authoring-attention slot is consumed** alongside that plan; weekly adversarial-memo review acknowledges this.
10. **No telemetry change.** `D131` posture is preserved — all new fields are local Dexie only; no network calls; no observer effect on Condition 3.
11. **Courtside-copy review** of the `DifficultyTag` user-facing labels passes `.cursor/rules/courtside-copy.mdc` invariants 2 + 5 before merge.

## Post-ship follow-ups (track, do not bundle)

- **Update `docs/research/founder-use-ledger.md`** with the first founder session that uses the new Transition capture. Record whether the per-drill Difficulty tag felt right, whether the optional counts were filled, and whether the Review-screen card removal felt missed. **Done** — `docs/research/founder-use-ledger.md` 2026-04-27 row records the cca2 dogfeed result; full findings in `docs/research/2026-04-27-cca2-dogfeed-findings.md`.
- **Re-trigger condition for Framing C.** If ≥2 additional sessions after `D133` ships report the per-drill Good/Total optional card *also* felt fake or was systematically skipped on a session where the data was wanted, re-evaluate Framing C (in-session counter on RunScreen) under a separate plan. Do **not** retroactively reshape this plan; treat the next decision as forward-only. Per `D135` (2026-04-28, walkthrough-equivalence is source-validity gated, not script gated), evidence sources for these hits include the founder-use ledger, founder chat / voice-memo content-gap reports tied to real sessions, and partner voice memos / notes / Dexie exports paired with debrief commentary — the test is source-validity (real session, real build, real observation), not which user produced the report. **Status (2026-04-28): 1 of ≥2 hits accumulated, plus countervailing optionality validation** — cca2 dogfeed (founder + Seb pair pass session) returned a "not sold on counting passes because of memory/awareness" report; the 2026-04-28 build-17 dogfeed then returned Seb's positive read that the option to count was useful precisely because counting was not forced. One more session with the same fake/skipped-count flag fires the re-trigger formally, but any Framing C design must preserve this optionality constraint.
- **Capture coverage gaps (2026-04-27).** The cca2 dogfeed surfaced two distinct gaps that this plan's surface didn't anticipate: (gap 2a) non-count main-skill drills like Bump Set (`d38-pair`, `streak`) capture Difficulty only, with no rep-grain data for the engine; (gap 2b) count-eligible drills at non-main_skill slots (e.g., `d10-pair` 6-Legged Monster at the technique slot, `d03-pair` Continuous Passing at movement_proxy) capture nothing at all because the gate hard-codes `block.type ∈ {main_skill, pressure}`. Routing: `docs/plans/2026-04-27-per-drill-capture-coverage.md` (Phase 1 gate-widening for 2b ships under one Tier 1b authoring-attention slot; Phase 2 per-`successMetric.type` capture stories for 2a are gated behind a separate trigger). Spec contract amended in `docs/specs/m001-review-micro-spec.md` §"Per-drill required field" + §"Non-count drills at main_skill / pressure (gap 2a)".
- **`D104` engine wiring readiness.** When M001-build proper begins on the binary-success progression engine (50-contact rolling-window math), `perDrillCaptures` is the data shape it consumes. The `aggregateDrillCaptures` helper added here generalizes to the engine's window-aggregation function.
- **Adversarial-memo Weekly Log entry.** The Monday-after-ship adversarial-memo review should record this plan's landing under Authoring-budget cap §5 (one Tier 1b authoring-attention slot consumed) and confirm the plan-list invariants are still upheld.

## For agents

- **Authoritative for**: Tier 1b implementation scope and acceptance for the post-2026-04-26 pair rep-capture work; the explicit not-in-scope list (notably Framing C re-trigger condition); the 5-surface-change boundary; the Dexie migration shape.
- **Edit when**: founder ratifies or downgrades `D133` (amend in place if the latter); implementation begins (update gate-status to "implementing"); a future Framing C plan is authored (cross-link from §"Post-ship follow-ups").
- **Belongs elsewhere**: the Tier 1b trigger model itself (`docs/plans/2026-04-20-m001-tier1-implementation.md`); the authoring-budget cap (`docs/plans/2026-04-20-m001-adversarial-memo.md` §5); the four-framing analysis (`docs/research/2026-04-26-pair-rep-capture-options.md`); the spec contract (`docs/specs/m001-review-micro-spec.md`); the decision row (`docs/decisions.md` `D133`); the sibling drill-content Tier 1b plan (`docs/plans/2026-04-22-tier1b-serving-setting-expansion.md`).
- **Outranked by**: `docs/decisions.md` `D133` (and any future amendment); `docs/specs/m001-review-micro-spec.md` (contract); `docs/plans/2026-04-20-m001-tier1-implementation.md` (Tier 1b trigger conditions); `docs/plans/2026-04-20-m001-adversarial-memo.md` (authoring-budget cap, falsification conditions).
- **Key pattern**: same plan shape as `docs/plans/2026-04-22-tier1b-serving-setting-expansion.md` (trigger evidence → gate status → scope → not-in-scope table → implementation → tests → acceptance → post-ship follow-ups → for agents). Different scope (UI + storage, not drill content) but the same discipline.
