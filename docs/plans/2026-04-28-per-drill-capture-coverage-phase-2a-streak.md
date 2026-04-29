---
id: per-drill-capture-coverage-phase-2a-streak-2026-04-28
title: "Per-drill capture coverage Phase 2A — optional streak capture on Drill Check"
type: plan
status: active
stage: build
authority: "Implementation routing for Phase 2A of `docs/plans/2026-04-27-per-drill-capture-coverage.md`. Scopes the gap-2a coverage work to a single optional `streak`-shape input on `/run/check` for non-count `main_skill` / `pressure` blocks whose drill is `streak`-typed. Defers `points-to-target`, `pass-grade-avg`, and `composite` to a future Phase 2B. Pulled forward as a bounded D130 founder-use exception: the strict Phase 2 trigger (Phase 1 live for ≥4 sessions OR ≥2 founder-ledger sessions where Difficulty-only is explicitly noted as insufficient OR partner walkthrough ≥P1 specifically on the gap) has not fired; structural catalog evidence + Tier 1c proximity is the basis. Carries a falsification gate: if streak capture is skipped or feels like bookkeeping in the next eligible sessions, Phase 2B stays frozen and the streak drawer may be removed."
summary: "Ship one optional `Add longest streak (optional)` drawer on Drill Check for `streak`-typed `main_skill` / `pressure` drills. Add a `captureShape` discriminator to the metric-strategy registry, an additive Dexie v6 `metricCapture?: { kind: 'streak'; longest: number }` field on `PerDrillCapture`, pure-domain builders that forbid impossible rows, and a quiet `Longest streak: N` receipt line on Complete. Difficulty stays the focal required decision; Continue never blocks on the optional input. Phase 2B is gated on a falsification gate codified in the new `D###` row and cited from the founder-use ledger."
last_updated: 2026-04-28
depends_on:
  - docs/plans/2026-04-27-per-drill-capture-coverage.md
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
  - D130
  - D131
  - D133
open_question_refs:
  - O12
---

# Phase 2A — optional streak capture on Drill Check

## Agent Quick Scan

- **Scope is one shape, one drill family.** Adds an optional streak input on `/run/check` for `streak`-typed `main_skill` / `pressure` drills (`d01-solo`, `d01-pair`, `d38-pair`, `d41-pair`). All other non-count metric types defer to a later Phase 2B.
- **Difficulty stays focal.** Required chip row is unchanged. Streak input is a collapsed-by-default optional drawer, parallel to the existing `Add counts (optional)` affordance for count drills.
- **Architecture seam, not a feature pile.** Adds `captureShape` discriminator to the strategy registry (semantic, no UI copy), an additive Dexie v6 `metricCapture?` field, and pure-domain builders that forbid impossible rows by construction.
- **Pulled forward under a bounded D130 founder-use exception.** Strict Phase 2 trigger has not fired; the new `D###` row records the exception explicitly and pre-registers a falsification gate that freezes Phase 2B if the streak input is skipped or feels like bookkeeping in the next eligible sessions.
- **Authoring budget unchanged.** Zero new drill records authored. Consumes one Tier 1b authoring-attention slot.
- **Telemetry posture preserved.** `D131` local-first window unchanged: streak values land in Dexie only; export and CoachPayload do **not** carry `metricCapture` in Phase 2A.

## Why this plan exists in its current shape

Catalog audit of M001-active `streak`-typed drills:

- `d01-solo`, `d01-pair` — Pass & Slap Hands (technique slot in Tier 1a passing flows; `main_skill` in solo wall sessions)
- `d38-pair` — Bump Set Fundamentals (`main_skill`, the chain-7 cca2 dogfeed exemplar)
- `d41-pair` — Partner Set (`main_skill`)

`d01` fires on most Tier 1a passing sessions. With Phase 1 (gap 2b) live as of 2026-04-28, the count-eligible passing drills at technique / movement_proxy slots now capture cleanly — but the `streak` main_skill drills still produce only a Difficulty chip. Net behavior: every passing session today silently drops the rep-shaped signal that would feed `D104`'s 50-contact rolling window for setting drills under `O12`.

The 2026-04-28 founder session was count-only, so the strict Phase 2 trigger has **not** fired:

- Phase 1 is live for 0 sessions, not ≥4.
- The 2026-04-28 session did not exercise a `streak` drill, so Difficulty-only-is-insufficient is unobserved.
- No partner walkthrough ≥P1 on the gap.

Pulling Phase 2A forward is a **bounded D130 founder-use exception**, not a new evidence standard. The architectural reason: Tier 1c (focus-routing) is approaching trigger threshold, and locking the per-metric capture vocabulary now is cheaper than retrofitting after focus-picked sessions exercise the streak path. The behavioral risk is real (the founder may not actually open the drawer in practice) — that risk is the falsification gate's job.

## Scope in one paragraph

Add a `captureShape` discriminator to the metric-strategy registry (semantic only, no UI copy). Add an additive Dexie v6 `metricCapture?: { kind: 'streak'; longest: number }` field on `PerDrillCapture`, with pure-domain builders that forbid impossible rows. Render one optional `Add longest streak (optional)` drawer on `/run/check` for non-count `main_skill` / `pressure` blocks whose drill is `streak`-typed. Keep Difficulty as the focal required decision. Continue never blocks on the optional input. Add a quiet receipt line on Complete so a logged streak is not invisible. Document a falsification gate: if the input is skipped or feels like bookkeeping in the next eligible sessions, Phase 2B stays frozen.

## Items to ship

### 1. Decision row in `docs/decisions.md` — proposed `D134`

**Title:** "Phase 2A optional streak capture on Drill Check under D130 founder-use exception."

**Body:** authorizes the registry extension + Dexie v6 + UI under D130 founder-use. Names the exception explicitly: strict Phase 2 trigger has not fired; structural catalog evidence is the basis. Records the falsification gate (below). Cites `D104` layer-1 (forced-criterion already lives above the input), `D130` (founder-use mode), `D131` (telemetry stays off; export omits `metricCapture` in Phase 2A), `D133` (Drill Check is the surface), `O12` (50-contact rolling window math is the future engine consumer). Does **not** modify any falsification condition in the adversarial memo; consumes one Tier 1b authoring-attention slot.

### 2. Strategy registry extension — `app/src/domain/capture/metricStrategies.ts`

Add a semantic-only `captureShape` field. Replace `capturesCounts` boolean with a derived predicate so there is one source of truth.

```ts
export type CaptureShape =
  | { kind: 'count' }    // pass-rate-good, reps-successful
  | { kind: 'streak' }   // streak
  | { kind: 'none' }     // points-to-target, pass-grade-avg, composite, completion (Phase 2A)

export interface MetricTypeStrategy {
  captureShape: CaptureShape  // canonical knob
  showsReviewCounts: boolean
  participatesInCountSum: boolean
}

export function metricCapturesCounts(type: MetricType | null): boolean {
  return type !== null && METRIC_TYPE_STRATEGIES[type].captureShape.kind === 'count'
}

export function getCaptureShape(type: MetricType | null): CaptureShape {
  return type === null ? { kind: 'none' } : METRIC_TYPE_STRATEGIES[type].captureShape
}
```

No UI labels or placeholders in the registry. Phase 2B adds `'points'` and `'grade'` to the union as one-line additions when triggers fire.

### 3. Model extension + pure builders — `app/src/model/capture.ts` and a new `app/src/domain/capture/buildPerDrillCapture.ts`

Add an additive optional field to the existing tagged union; do not transform legacy v5 rows.

```ts
export type MetricCapture = { kind: 'streak'; longest: number }

interface PerDrillCaptureBase {
  drillId: string
  variantId: string
  blockIndex: number
  difficulty: DifficultyTag
  capturedAt: number
  metricCapture?: MetricCapture  // NEW (Phase 2A)
}
```

Pure builders enforce mutual exclusion at the boundary:

- `buildPerDrillCaptureRecord(input)` returns either a count row, a streak row, a not-captured row, or a difficulty-only row. Refuses (TS-level) to construct a row with both `goodPasses` and `metricCapture`, or `notCaptured: true` plus a `metricCapture`.
- `validateStreakLongest(value)` clamps to `0..99`, rejects non-integers, `NaN`, `Infinity`.

Controllers always go through these helpers; no hand-assembled rows.

### 4. Dexie v6 migration — `app/src/db/schema.ts`

Purely additive on `perDrillCaptures.metricCapture`. v5 readers ignore the unknown field; rollback is safe. No transformation of existing rows.

### 5. Eligibility resolver update — `app/src/domain/capture/eligibility.ts`

Keep the three statuses (`eligible_counts`, `eligible_difficulty_only`, `bypass`). Extend `eligible_difficulty_only` with an optional `optionalCaptureShape: CaptureShape` so the controller knows whether to render the streak drawer.

The streak drawer renders only when `block.type` is `main_skill` or `pressure` AND `optionalCaptureShape.kind === 'streak'`. Streak at non-main_skill/non-pressure slots stays bypassed (no widening of non-count capture beyond the slot rule).

### 6. UI shape — `app/src/components/PerDrillCapture.tsx`

Branch on `captureShape.kind`. Both branches share the V0B-28 success-rule render above the input.

| Shape | Affordance | Body | Honesty copy above input |
|---|---|---|---|
| `count` | `Add counts (optional)` (unchanged) | `PassMetricInput` (unchanged) | `Success rule: <rule>. If unsure, don't count it as Good.` (unchanged) |
| `streak` | `Add longest streak (optional)` | One numeric input, label `Longest streak`, helper `If you counted, enter your best unbroken streak. Leave blank if unsure.` | `Success rule: <rule>.` (no anti-generosity nudge — does not apply to streak) |

Input constraints (streak):

- `<input type="text" inputMode="numeric" pattern="[0-9]*" />` (NOT `type="number"` — avoids browser exponent / decimal / negative behavior)
- Whole numbers only, range `0..99`
- Empty input commits nothing (no row written; Difficulty still persists)
- Invalid value shows inline `Use a whole number. This result will be skipped unless fixed.` and does not persist
- Continue is never disabled by an empty or invalid optional value
- Drawer is collapsed by default; no missing-result hint, no warning styling, no required indicator
- Keyboard does not open until the user taps the affordance

### 7. Controller wiring — `app/src/screens/drillCheck/useDrillCheckController.ts`

Local state extends with `captureStreakLongest: number | null`. Reads `optionalCaptureShape` from the eligibility resolver and threads `captureShape` + the right local state into `PerDrillCapture`. On flush, calls `buildPerDrillCaptureRecord` with the right inputs; pure builder picks the row shape.

Hydration reads either flat fields (legacy count) or `metricCapture.longest` (new streak) from the existing draft. Merge function `mergePerDrillCaptures` is shape-agnostic; no change needed.

### 8. Complete-screen receipt-only display — `app/src/screens/CompleteScreen.tsx`

When a per-drill capture has `metricCapture: { kind: 'streak', longest: N }`, append a quiet line under the drill name in the per-drill summary: `Longest streak: N`. No comparison, no badges, no recommendations, no "not captured" apology when blank. If the existing "Counts not logged for any drill" line would render but a streak result was logged, suppress that line for that drill.

No change to `aggregateDrillCaptures` summing logic. Streak does not roll up to a session-level total.

### 9. Spec patch — `docs/specs/m001-review-micro-spec.md`

Replace the §"Non-count drills at main_skill / pressure (gap 2a)" deferral language with the streak-shipped reality. Note explicitly that V0B-28 forced-criterion prompt renders above the streak input, but the anti-generosity clause is dropped because it does not apply. Cite this plan and the new `D###` row.

### 10. Tests — split by tier

| Tier | File | What it pins |
|---|---|---|
| Domain | `app/src/domain/capture/__tests__/metricStrategies.test.ts` (extend) | Each `MetricType` resolves to the right `CaptureShape`; `metricCapturesCounts` derives correctly; `getCaptureShape(null) === { kind: 'none' }`. |
| Domain | new `app/src/domain/capture/__tests__/buildPerDrillCapture.test.ts` | Builder produces correct row shape per input; refuses impossible combinations; `validateStreakLongest` clamps `0..99`, rejects non-integers / `NaN` / `Infinity`. |
| Domain | `app/src/domain/__tests__/drillCheckCapture.test.ts` (extend) | `d38-pair@main_skill` returns `eligible_difficulty_only` with `optionalCaptureShape.kind === 'streak'`; `d38-pair@technique` still bypasses with `non_count_support_slot`; `d01-pair@main_skill` returns `eligible_difficulty_only` with streak shape. |
| Component | `app/src/components/__tests__/PerDrillCapture.test.tsx` (extend) | Streak drawer renders with right label/helper; collapsed by default; Continue not disabled by blank/invalid streak; invalid value shows correction text and does not persist; success rule renders without the anti-generosity nudge. |
| Services | `app/src/services/__tests__/review.perDrillCaptures.test.ts` (extend) | Round-trip a streak capture through `patchReviewDraft` / `loadReviewDraft`; v5 row reads cleanly under v6 reader; v6 row with `metricCapture` reads cleanly without contaminating count fields. |
| Screen | `app/src/screens/__tests__/DrillCheckScreen.perDrillCapture.test.tsx` (extend) | One streak path: navigate to `/run/check` with `d38-pair` completed, tap Difficulty chip, expand `Add longest streak`, type `7`, tap Continue, assert persisted `metricCapture: { kind: 'streak', longest: 7 }`. |
| Screen | `app/src/screens/__tests__/CompleteScreen.perDrillAggregate.test.tsx` (extend) | Receipt line `Longest streak: 7` renders when the row has streak data; no line when blank; "Counts not logged" line suppressed for streak-logged drills. |

## Wireframe acceptance gate

Six text-mocks at 390 × 844 (iPhone 12/13 baseline). The gate is satisfied when each state honors the four acceptance criteria below. Whiteboard-grade is the bar; these textual mocks are the founder-use equivalent under `D130`.

### State 1 — Collapsed Drill Check, Difficulty selected

```
+------------------------------------------------+  <- 390 px wide
| [shield]      Drill check         Last: 3/5   |  header band
+------------------------------------------------+
|                                                |
|  +------------------------------------------+  |  green check pill
|  | [✓]  Bump Set Fundamentals  Complete    |  |
|  +------------------------------------------+  |
|                                                |
|  +------------------------------------------+  |  PerDrillCapture card
|  | QUICK TAG                               |  |
|  | How was Bump Set Fundamentals?          |  |  <- focal H2 (sm/semibold)
|  |                                         |  |
|  | [ Too hard ] [ Still learning✓] [ Too easy] |  <- 3-col radio chips
|  |                                         |  |     (selected: accent fill)
|  | + Add longest streak (optional)         |  |  <- text-link affordance
|  +------------------------------------------+  |     (accent text, smaller)
|                                                |
|                                                |
|                                                |
|                                                |
|                                                |
|  [           Continue            ]            |  pinned footer CTA
+------------------------------------------------+
```

Visual hierarchy left-to-right, top-to-bottom: header (lightest) → completion pill (success-tinted) → drill question (primary text) → 3-chip row (accent on selected, ample whitespace) → optional drawer affordance (accent link, single line, no border, no bg) → CTA (full-width primary). The streak affordance is two visual steps below the chips and reads as a linked secondary action, not a parallel required field.

### State 2 — Expanded streak drawer, empty input

```
+------------------------------------------------+
| [shield]      Drill check         Last: 3/5   |
+------------------------------------------------+
|                                                |
|  +------------------------------------------+  |
|  | [✓]  Bump Set Fundamentals  Complete    |  |
|  +------------------------------------------+  |
|                                                |
|  +------------------------------------------+  |
|  | QUICK TAG                               |  |
|  | How was Bump Set Fundamentals?          |  |
|  |                                         |  |
|  | [ Too hard ] [ Still learning✓] [ Too easy] |
|  |                                         |  |
|  | Streak (optional)                       |  |  <- collapsed-state title
|  | Success rule: 7 clean contacts in a     |  |     gone; rule renders here
|  |   row before a mishit.                  |  |
|  |                                         |  |
|  | Longest streak                          |  |  <- input label (sm/medium)
|  | +-----+                                 |  |
|  | |     |                                 |  |  <- numeric input
|  | +-----+                                 |  |     (pattern=[0-9]*)
|  | If you counted, enter your best         |  |  <- helper (sm/secondary)
|  |   unbroken streak. Leave blank          |  |
|  |   if unsure.                            |  |
|  +------------------------------------------+  |
|                                                |
|  [           Continue            ]            |  <- never disabled by blank
+------------------------------------------------+
```

The success-rule text matches the same voice as the count-drill version (sourced from `variant.successMetric.description` via `getBlockSuccessRule`), but the anti-generosity nudge ("If unsure, don't count it as Good.") is **dropped** because it does not apply to streak counting (streak is intrinsically conservative — a missed contact ends the streak).

### State 3 — Expanded streak drawer, filled with `7`

```
| Longest streak                          |
| +-----+                                 |
| |  7  |                                 |  <- value rendered as plain text
| +-----+                                 |     (no zero-as-placeholder
| If you counted, enter your best         |      issues here; empty → blank)
|   unbroken streak. Leave blank          |
|   if unsure.                            |
```

Continue stays enabled. On tap, the controller persists `metricCapture: { kind: 'streak', longest: 7 }`.

### State 4 — Expanded streak drawer, invalid value (`-1` or `1.5`)

```
| Longest streak                          |
| +-----+                                 |
| | 1.5 |                                 |  <- value as user typed it
| +-----+                                 |
| Use a whole number. This result will    |  <- inline correction
|   be skipped unless fixed.              |     (text-secondary, no warning red)
| If you counted, enter your best         |
|   unbroken streak. Leave blank          |
|   if unsure.                            |
```

Continue is **not** disabled — invalid optional input drops the streak field but Difficulty still persists. No warning iconography (`D86` compliance).

### State 5 — Keyboard-open

```
+------------------------------------------------+
| (Drill check header)                          |
| (drill name pill)                             |
| (chips row, selection visible)                |
| (success rule)                                |
| Longest streak                                |
| +-----+                                       |
| |  7| |  <- focused                           |
| +-----+                                       |
| (helper line)                                 |
+------------------------------------------------+
| numeric keyboard occupies bottom ~291 px       |
+------------------------------------------------+
```

Keyboard does not open until the user taps the affordance. iOS `inputmode="numeric"` shows the number-pad keyboard, not the full QWERTY. The Continue CTA is hidden behind the keyboard, which is acceptable: the field commit happens on blur, and dismissing the keyboard restores the CTA below the helper line.

### State 6 — Keyboard-dismissed after entry

```
| (header)                                      |
| (drill name pill)                             |
| (chips row)                                   |
| (success rule)                                |
| Longest streak                                |
| +-----+                                       |
| |  7  |                                       |
| +-----+                                       |
| (helper line)                                 |
| (whitespace)                                  |
| [           Continue            ]            |  <- restored to footer
+------------------------------------------------+
```

Acceptance:

- **Difficulty is the first focal decision.** The chip row carries the largest visual weight on every state above; the streak drawer is a smaller secondary affordance one or two visual steps below.
- **Streak drawer is visibly secondary.** No bold container, no required-asterisk treatment, no missing-result hint. Collapsed by default behind a single linked affordance line.
- **No collapsed-state scroll on 390 × 844.** The collapsed mock fits within the 844 px viewport: header band (~64), pill (~64), chip card (~180), affordance line (~32), spacing (~24), footer + CTA (~80) = ~444 px. Plenty of room.
- **Continue is not obscured after keyboard dismissal.** State 6 verifies that the CTA returns to its footer position.
- **No Transition/next-drill content leaks into Drill Check.** The body only references the just-finished drill (`captureTarget.drillName`); no Up Next prose, no upcoming drill name, no rationale.

## Out of scope (parking lot for Phase 2B)

| Item | Reason |
|---|---|
| `points-to-target` capture shape (`d22-solo`, `d22-pair`) | One drill, two variants. Wait for Tier 1c to produce serve-focused sessions or for explicit founder-ledger demand. |
| `pass-grade-avg` capture shape (`d18-pair`) | One variant. Honest grade UI needs rubric anchors and a decision on whether it's average or overall. Defer. |
| `composite` capture shape | Zero M001-active drills. Registry slot is `{ kind: 'none' }`; re-opens as a one-line change when a composite drill enters M001. |
| `completion` capture shape | Implicit via `blockStatuses[i].status === 'completed'`. No work. |
| D104 engine consumption of streak signals | M001-build engine work. v0b persists raw values only. |
| Founder JSON export (`services/export.ts`) carrying `metricCapture` | Explicit decision: export omits `metricCapture` in Phase 2A. Re-opens with Phase 2B. Test pins the omission so it does not silently drift. |
| `CoachPayload` extension for `metricCapture` | Phase 2 / `D106` work; Phase 2A explicitly does not extend the coach seam. |
| Backfilling historical v5 rows | Forward-only per `D131`. |
| In-session running counter on `RunScreen.tsx` (Framing C) | Different surface, separately re-trigger-gated per `docs/plans/2026-04-26-pair-rep-capture-tier1b.md`. |
| Per-block RPE | `D120` posture: one `sessionRpe` per session in v0b. |

## Falsification gate

Phase 2A is pulled forward without the strict Phase 2 trigger firing. The new `D134` row records this as a bounded D130 founder-use exception. **Phase 2B stays frozen** unless ALL of the following hold across the next eligible sessions:

- The streak drawer is opened on at least 50% of `streak`-drill Drill Check screens the founder hits.
- At least one streak result is entered (not blank-skipped) within 4 eligible sessions.
- The founder ledger `note` field does not flag the input as bookkeeping, friction, or memory-test in any session.

If any of those fail by the 5th eligible streak session, the decision row's reverse condition fires:

- Phase 2B (`points-to-target`, `pass-grade-avg`) is not authored.
- Phase 2A copy or input is reconsidered before any Phase 2B unblock.
- The streak drawer may be removed if the data quality is suspect.

This gate is recorded in the new `D134` row and cited in `docs/research/founder-use-ledger.md` so future agents read the gate alongside the trigger conditions.

## Verification commands

- `npm test` (target: 1065 + new tests passing)
- `npm run lint` clean
- `npm run build` clean
- `bash scripts/validate-agent-docs.sh` clean
- Manual smoke (Windows Cursor + WSL): launch dev server, run a session with a `d38-pair` block, expand `Add longest streak` on `/run/check`, type `7`, tap Continue, confirm Dexie row has `metricCapture: { kind: 'streak', longest: 7 }`, navigate to `/complete`, confirm `Longest streak: 7` renders quietly under the drill summary.

## Adversarial-memo accounting

- One Tier 1b authoring-attention slot consumed (recorded next Monday).
- Zero new drill records authored. Authoring-budget cap stays at 4/10.
- Trigger-override justification recorded in the plan body and in the new `D134` row.
- Falsification gate (above) is the asymmetric-against-inertia rule for Phase 2B.
- No falsification condition in the adversarial memo modified.

## Implementation order (atomic-commit shape)

1. Plan doc lands (this file).
2. Wireframe acceptance gate (textual mocks above).
3. Decision row in `docs/decisions.md` (`D134`).
4. Strategy registry extension + derived predicate + domain tests.
5. Model layer extension + pure builders + builder tests.
6. Dexie v6 migration + services round-trip test.
7. Eligibility resolver shape change + capture-domain tests.
8. `PerDrillCapture` streak branch + component tests.
9. `useDrillCheckController` wiring + screen-tier test.
10. Complete-screen receipt line + screen-tier test.
11. Spec patch + plan doc as-built + founder-ledger gate citation.
