---
id: plan-2026-06-22-t5-verdict-card-density
title: "refactor: T5 — cap the Review verdict card at 3 prose lines (drop the readiness line on a more offer)"
status: active
stage: build
type: plan
summary: "Fix theme T5 from the 2026-06-22 minimalism/shibui audit: the just-shipped Review verdict card is dense at the edge (heading + 4 prose lines + control) on a more offer. Suppress the graduationFeel readiness line whenever the accept-consequence renders, capping the card at 3 prose lines (offer -> reflection -> accept-consequence). Readiness stays as the forward line only when no accept-consequence renders. Revisits the D161 readiness-line choice (founder call, made via this LFG invocation). Render-time suppression only; no schema/route/assembly/domain-data change."
origin: docs/design/reviews/2026-06-22-minimalism-shibui-audit.md
last_updated: 2026-06-22
depends_on:
  - docs/design/reviews/2026-06-22-minimalism-shibui-audit.md
  - docs/plans/2026-06-22-001-feat-m002-2-progression-read-on-review-plan.md
  - docs/specs/stress-rung-taxonomy.md
  - docs/decisions.md
  - app/src/screens/review/useReviewController.ts
  - app/src/screens/ReviewScreen.tsx
  - app/src/domain/adaptation/progressionRead.ts
decision_refs:
  - D154
  - D157
  - D161
---

# refactor: T5 — verdict card density on a `more` offer

## Summary

Theme T5 of the 2026-06-22 shibui audit: the just-shipped Review "Next time" verdict card is confirmed at the dense edge on a `more` offer — **heading + 4 prose lines + control** (offer line → reflection line → [choice] → readiness line → accept-consequence line). Both the review reviewer and a prior live dogfood agree the `graduationFeel` **readiness line is the prime trim**: on a `more` offer it overlaps the carry-forward offer line ("you're ready for more"), and on an on-target landing it partially overlaps the reflection line.

Apply the audit recommendation: **cap the card at 3 prose lines (offer → one reflective line → accept-consequence), suppressing the readiness line whenever the accept-consequence renders.** The accept-consequence (the concrete drill exemplar) and the reflection (what to notice about the rung just trained) both earn their place; the readiness line is the redundant one in this layout. Readiness survives only as the forward line in the edge case where no accept-consequence renders (legacy/no-`context` plans), so the `more` card still carries a step-up read and stays at ≤3 prose lines in every branch.

This **revisits a `D161` design choice** (`D161` shipped the readiness line on every `more` offer). It is a founder-judgment call per the audit; this LFG invocation is that call. The change is render-time only.

## Problem Frame

`D161` (plan `docs/plans/2026-06-22-001`) surfaced two authored per-rung fields into the verdict-gated "Next time" card: a direction-agnostic **reflection** (`explorationCriterion`, keyed to the trained rung) and a `more`-only **readiness** line (`graduationFeel`, keyed to the offer position). On the common `more` + on-target landing, all four prose lines render at once, so the card hits the dense edge. The audit's read: in this layout the readiness line is redundant against the offer line (which already says "a bit more stress … next time" / "you're ready for more") and the reflection line, while the accept-consequence carries the one piece of forward information the others do not (a concrete drill the athlete would actually meet).

## Constraints honored

- **Data honesty / no raw rungs (`D157`).** No rung numbers render; this only removes one already-authored prose line in one layout branch. The accept-consequence (`D157` exemplar) and the user-accepted verdict (`D154`) are untouched.
- **Accessibility.** The accept-consequence stays the single `aria-describedby` consequence on the "Try it" option (it already is — the readiness line was never wired into `aria-describedby`). Dropping the readiness `<p>` removes no accessible name or described relationship.
- **No envelope change.** No Dexie/schema, route, assembly, persisted-field, or `STRESS_LADDERS` data change. `composeProgressionRead` and `resolveTrainedRung` (pure domain) are unchanged — the suppression is a controller-level presentation decision, so the "data-only composer" claim for `progressionRead.ts` stays true.
- **Courtside-copy.** No new strings; pure subtraction of an existing authored line in one branch.

## Key Technical Decisions

- **KTD1 — suppression lives in the controller, not the composer.** `composeProgressionRead` stays a pure, accept-consequence-unaware data function. The 3-line cap is a layout coupling between two independently-composed lines (readiness vs. accept-consequence), which the controller (the thin UI-state assembler) owns. Derive the exposed `progressionReadinessLine` as `acceptConsequenceLine ? null : progressionRead.readiness`.
- **KTD2 — readiness is the fallback, not deleted.** Conditioning on accept-consequence presence (not "always on `more`") preserves a forward step-up read when no accept-consequence renders (`plan.context` undefined, or `composeAcceptConsequence` returns null for an ineligible prospective rung). In that branch the card is offer → reflection → readiness = 3 lines; in the common branch it is offer → reflection → accept-consequence = 3 lines. Either way ≤3 prose lines.
- **KTD3 — screen JSX needs no logic change.** `ReviewScreen.tsx` already guards both lines (`{progressionReadinessLine && …}`, `{acceptConsequenceLine && …}`) inside the lower group. Suppressing readiness in the controller is sufficient; only the explanatory comments on the card update to describe the cap. The reflection line (above the choice) is unchanged.
- **KTD4 — keying proof moves to the domain tier for readiness.** The screen-level "readiness keys off the offer position" assertion (current test 3) is lost in the common fixtures because accept-consequence renders there and suppresses readiness. That keying is already proven at the domain tier (`progressionRead.test.ts` → "sources readiness from the OFFER position on a more offer"), so coverage is preserved at the lowest useful tier; the screen tests now pin the **cap** instead.

## Implementation Units

### U1 — Suppress readiness when the accept-consequence renders

- **Files:** `app/src/screens/review/useReviewController.ts`, `app/src/screens/ReviewScreen.tsx`
- **Goal:** cap the verdict card at 3 prose lines by dropping the `graduationFeel` readiness line whenever the accept-consequence line renders.
- **Approach:**
  - In `useReviewController.ts`, after both `acceptConsequenceLine` and `progressionRead` are computed, expose `progressionReadinessLine = acceptConsequenceLine ? null : progressionRead.readiness` (instead of the current direct `progressionRead.readiness`). Add a comment naming T5 / the `D161` revisit and the 3-line cap rationale. `progressionReflectionLine` is unchanged.
  - In `ReviewScreen.tsx`, update the two explanatory comments on the "Next time" card (the offer/reflection group comment and the lower readiness/accept-consequence group comment) to describe the cap: readiness renders only as the forward line when no accept-consequence is present. No JSX control-flow change — the existing `{progressionReadinessLine && …}` and `{acceptConsequenceLine && …}` guards already produce the right output once the controller suppresses readiness.
- **Requirements:** T5 (audit); honors `D157`/`D154`/`D161`-revisit.
- **Test scenarios:** covered at the screen tier by U2 (the controller output is only observable through the rendered card).
- **Verification:** on a `more` + on-target offer with a context-bearing plan, the card shows offer + reflection + accept-consequence and no `graduationFeel` line; on a `more` offer with no accept-consequence, the readiness line still shows.

### U2 — Update the Review verdict screen tests

- **Files:** `app/src/screens/__tests__/ReviewScreen.verdict.test.tsx`
- **Goal:** repin the verdict-card tests to the 3-line cap; keep the `D161` P1 reflection-keying proof; add the no-accept-consequence fallback case.
- **Approach:**
  - **Rewrite** the existing `'on a "more" offer, renders both the reflection and the readiness line (on-target rung)'` case → `'on a "more" offer with a concrete next-drill consequence, caps the card: reflection + accept-consequence, readiness suppressed'`. Same `more` on-target fixture (`D03`, `context` present so accept-consequence renders). Assert: reflection (`getStressRung('pass', 2)!.explorationCriterion`) present; accept-consequence caption present and `id="verdict-accept-consequence"` with the "Try it" `aria-describedby` intact; readiness (`getStressRung('pass', 2)!.graduationFeel`) **not** present.
  - **Amend** the `'keys the reflection off the TRAINED rung, not the offer position (off-target landing)'` case: keep the reflection-divergence assertions (trained rung 3 present, offer-position rung 2 explorationCriterion absent — the P1 fix). Replace the two readiness assertions: since accept-consequence renders in this fixture, assert the offer-position `graduationFeel` is **not** present (suppressed by the cap). Add a one-line comment that the readiness→offer-position keying itself is proven in `progressionRead.test.ts`.
  - **Add** a case `'on a "more" offer with no accept-consequence, the readiness line is the forward line (fallback, still 3 lines)'`: seed a `more` offer whose current-session plan has `context: undefined` so `acceptConsequenceLine` is null. Assert: reflection present; readiness (`graduationFeel`) present; no `verdict-accept-consequence` node. (Add a `passPlanNoContext` / `seedCurrentSession(..., { noContext: true })` helper variant; the offer still loads because focus comes from `inferSessionFocus(plan.blocks)`, which does not need `context`.)
  - The `'less'`-offer case is unaffected (readiness is already null on `less`); confirm it stays green.
- **Requirements:** pins KTD1, KTD2, KTD4; preserves the `D161` reflection P1 fix.
- **Test scenarios:**
  - Happy path (cap, common): `more` + context → reflection + accept-consequence, no readiness.
  - Edge (fallback): `more` + no context → reflection + readiness, no accept-consequence.
  - Regression (P1 keying): off-target landing → reflection keys to trained rung; offer-position readiness suppressed under the cap.
  - Edge (unchanged): `less` offer → reflection only, no readiness (already true).
- **Verification:** `npx vitest run app/src/screens/__tests__/ReviewScreen.verdict.test.tsx` green; full suite green.

### U3 — Docs + decision row

- **Files:** `docs/decisions.md`, `docs/specs/stress-rung-taxonomy.md`, `docs/design/reviews/2026-06-22-minimalism-shibui-audit.md`, `docs/status/current-state.md`, `docs/catalog.json`
- **Goal:** record the `D161` revisit and keep the canonical surfaces consistent.
- **Approach:**
  - **`docs/decisions.md`:** add a decision row (next unused id, `D162`) recording the T5 readiness-line cut: on a `more` offer the `graduationFeel` readiness line is suppressed whenever the accept-consequence renders, capping the verdict card at 3 prose lines; readiness remains only as the forward fallback when no accept-consequence renders. Note it revises the `D161` "readiness on every `more` offer" choice (founder call via the 2026-06-22 shibui audit T5), that no raw rungs render (`D157` holds) and movement stays user-accepted (`D154`), and that the field stays authored (data unchanged). Bump the file's `last_updated`.
  - **`docs/specs/stress-rung-taxonomy.md`:** amend the "Partial rendering shipped 2026-06-22 (`D161`)" paragraph so `graduationFeel` is described as rendering on a `more` offer **only when the accept-consequence does not** (3-line cap, `D162`), not on every `more` offer.
  - **`docs/design/reviews/2026-06-22-minimalism-shibui-audit.md`:** mark the T5 theme + the "Cap the Review verdict card at 3 lines (T5)" highest-leverage item + the T5 founder-judgment-call line as resolved, citing this plan and `D162` (it is a working findings log; a short resolved note is appropriate).
  - **`docs/status/current-state.md`:** add a Recent Shipped History entry for the T5 cap / `D162`.
  - **`docs/catalog.json`:** register this plan file.
- **Requirements:** machine-scannable-docs + docs-editorial-workflow rules (decisions-first, then propagate; catalog kept in sync).
- **Test scenarios:** none (docs). `Test expectation: none -- documentation + decision-log update.`
- **Verification:** `bash scripts/validate-agent-docs.sh` passes.

## Verification

- `npx vitest run` (full suite green — verdict screen tests touched) + `npx tsc --noEmit` + `npm run lint`.
- `npm run diagnostics:report:check` (must stay current — render-time-only proof; no assembly/generator change).
- `bash scripts/validate-agent-docs.sh`.
- 390px mobile dogfood: seed an accepted-verdict history that yields a `more` offer; confirm the "Next time" card reads as one calm arc at 3 prose lines (offer → reflection → accept-consequence) with the readiness line gone; spot-check a `less` offer (unchanged) and, if reachable, the no-context fallback (readiness present, accept-consequence absent).

## Out of Scope (named follow-ons)

- The other audit themes (T1–T4, T6–T8) and the one real bug (em-dash) — tracked in their own plans (`2026-06-22-002` T1, `2026-06-22-003` T4) or separately.
- The run-time technique-how half (`intent` + `externalFocusCue` on Run / Transition / Drill Check) — the M002.2 spine follow-on; unchanged here.
- "Easing is legitimate" felt read on `less` offers — still a named follow-on.
- Any always-on / no-step reflective read — out of scope.
