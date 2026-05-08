---
id: d138-diagnostic-spine-canonicality-plan-2026-05-07
title: "D138 Diagnostic Spine Canonicality"
type: refactor
status: complete
stage: validation
date: 2026-05-07
last_updated: 2026-05-07
origin: docs/plans/2026-05-05-001-merge-focus-coverage-and-collapse-branches-plan.md
authority: "Implementation plan for D138 — retire `focusReadiness`'s parallel audit + remediation API, declare `focusCoverageAudit` canonical for catalog-coverage detection, keep only the dimension exports `generatedPlanDiagnostics` consumes."
depends_on:
  - docs/decisions.md
  - docs/plans/2026-05-05-001-merge-focus-coverage-and-collapse-branches-plan.md
  - docs/plans/2026-05-06-001-refactor-d137-tune-today-routing-cleanup-plan.md
  - docs/plans/2026-05-07-001-engine-two-pass-band-relax-plan.md
  - docs/status/current-state.md
summary: "Prune `focusReadiness.ts` to dimension exports only; delete `focusReadiness.test.ts`; declare `focusCoverageAudit` canonical for catalog-coverage detection. Closes the second open follow-up from the 2026-05-05 merge plan. Engine-only, no UI surface, no behavior change in any live diagnostic."
---

# D138 Diagnostic Spine Canonicality

## Summary

`focusReadiness` and `focusCoverageAudit` overlapped in intent post-2026-05-05 merge. Investigation showed the overlap was not "two complementary surfaces" but "two parallel implementations where one was already retired by attrition." `focusCoverageAudit` is the live detection diagnostic — snapshot regression test, markdown report, walks the user-facing 5-tier `SkillLevel`, has its risk-bucket vocabulary maintained by `D137`. `focusReadiness`'s audit logic and gap-card / activation-manifest remediation API were a parallel implementation authored on `feat/focus-coverage-readiness` whose only remaining consumers were its own tests; no script, plan, or product surface ever consumed the gap cards or activation manifests.

This plan declares `focusCoverageAudit` canonical for catalog-coverage detection, prunes `focusReadiness.ts` to the dimension constants and types still consumed by `generatedPlanDiagnostics.ts`, deletes `focusReadiness.test.ts`, and documents the spine in `D138`. Engine-only — zero behavior change in any live diagnostic; zero UI surface change.

---

## Problem Frame

Three diagnostics live on the M001 spine:

| Diagnostic | Live? | Question | Cells | Output | npm script |
|---|---|---|---|---|---|
| `focusCoverageAudit` (`app/src/data/`) | LIVE | Catalog depth-floor coverage by user-facing SkillLevel | 180 | snapshot regression test + markdown report at `docs/reviews/2026-05-04-focus-coverage-audit.md` | `npx vitest` (snapshot) + `app/scripts/generate-coverage-report.ts` |
| `generatedPlanDiagnostics` (`app/src/domain/`) | LIVE | Generated draft validity (hard failures + observation buckets) | 540 | markdown report + 53-entry triage registry | `diagnostics:report:check`, `diagnostics:triage:check` |
| `focusReadiness` (`app/src/domain/sessionAssembly/`) | mostly DEAD | Catalog readiness + gap-card / activation-manifest remediation workflow | 135 | none (only its own self-test) | none |

`generatedPlanDiagnostics.ts` imports the dimension constants and types from `focusReadiness.ts` (`READINESS_CONFIGURATIONS`, `VISIBLE_FOCUSES`, `PLAYER_LEVELS`, `READINESS_DURATIONS`, plus the `VisibleFocus`, `ReadinessConfiguration`, `ReadinessConfigurationId` types). That share is real and load-bearing.

Everything else in `focusReadiness.ts` — the audit logic (`buildFocusReadinessAudit`, `evaluateFocusReadinessCell`), the gap-card / activation-manifest workflow (`FocusReadinessGapCard`, `ActivationBatchManifest`, validators, status transitions, type guards), and the rich `ReadinessStatus` / `ReadinessRiskBucket` / `FocusReadinessCellReport` type tower — was consumed only by `focusReadiness.test.ts`. The remediation workflow was authored speculatively for a tracker that was never wired up; the audit was the parallel-implementation that lost the canonicality contest at merge time.

The 2026-05-05 merge plan flagged this as a follow-up: "reconcile feat's `focusReadiness` diagnostic output with the new `focusCoverageAudit` — they overlap in intent but produce different artifacts." The honest reconciliation is "one is canonical, the other is dead except for shared dimensions" — not "merge their outputs."

---

## Requirements

**Diagnostic-spine declaration**
- R1. `focusCoverageAudit` is the canonical catalog-coverage detection diagnostic. It owns the snapshot test and the markdown report.
- R2. `generatedPlanDiagnostics` is the canonical generated-draft-validity diagnostic. It owns the diagnostics report check and the triage registry.
- R3. `focusReadiness` is retired as a detection / remediation surface. It exists only as a shared dimension export module for `generatedPlanDiagnostics`.
- R4. `D139` (validator script gating / compression) is unchanged by this plan. It remains separately deferred.

**Code surgery**
- R5. `focusReadiness.ts` keeps the dimension constants and types consumed by `generatedPlanDiagnostics.ts` (`VisibleFocus`, `ReadinessConfiguration`, `ReadinessConfigurationId`, `VISIBLE_FOCUSES`, `PLAYER_LEVELS`, `READINESS_DURATIONS`, `READINESS_CONFIGURATIONS`).
- R6. `focusReadiness.ts` deletes the audit logic (`buildFocusReadinessAudit`, `evaluateFocusReadinessCell`), the gap-card / activation-manifest remediation API (`FocusReadinessGapCard`, `ActivationBatchManifest`, `validateFocusReadinessGapCard`, `validateActivationBatchManifest`, `canTransitionReadinessStatus`, `isReadinessStatus`, `isReadinessRiskBucket`, `hasPerSlotSwapCoverage`), the supporting helpers (`findReadinessConfiguration`, `toCatalogIds`, `distinctDrillFamilies`, `coverageFromCandidates`, `slotCandidates`, `supportCandidatesBySlot`, `risksForCoverage`, `swapCoverageForFocusControlledSlots`, `emptyCoverage`, `hasText`), the status / risk-bucket / order constants (`READINESS_STATUSES`, `READINESS_RISK_BUCKETS`, `FORWARD_STATUS_ORDER`, `ACTIVATION_READY_STATUSES`, `BLOCKED_STATUSES`), and the `ReadinessStatus` / `ReadinessRiskBucket` / `FocusReadinessSlotType` / `SlotReadinessStatus` / `CatalogIdReference` / `FocusReadinessCellInput` / `SlotReadinessCoverage` / `FocusReadinessCellReport` / `FocusReadinessAuditReport` types.
- R7. `focusReadiness.ts` doc-comment is rewritten to declare its narrower role (shared dimensions for `generatedPlanDiagnostics`) and to point readers at `focusCoverageAudit` as the canonical detection diagnostic. The doc-comment also records why the remediation API was retired so future agents do not restore the deleted shape under the assumption it was load-bearing.
- R8. `focusReadiness.test.ts` is deleted entirely. The dimension constants are exercised through `generatedPlanDiagnostics.test.ts` (which imports them as the surface-contract dimensions).

**No regressions**
- R9. Typecheck, lint, full test suite, and `diagnostics:report:check` all stay green.
- R10. `focusCoverageAudit` snapshot remains 180/180 covered.
- R11. `generatedPlanDiagnostics` 540-cell surface unchanged.

**No UI surface**
- R12. No screen, no controller, no copy, no metadata, and no Dexie schema change. The product surface is untouched.

**Documentation surface**
- R13. `docs/decisions.md` adds a `D138` row recording the canonicality declaration with full retirement rationale.
- R14. `docs/status/current-state.md` records the change as a Recent Shipped History entry.
- R15. `docs/plans/2026-05-05-001-merge-focus-coverage-and-collapse-branches-plan.md` updates the second open follow-up from "still open" to "resolved 2026-05-07 by D138" with a back-pointer to this plan.
- R16. `docs/catalog.json` registers this plan with `active_registry: true`.

---

## Approach

Single-file code surgery. `focusReadiness.ts` is rewritten (overwritten) with only the dimension exports plus a substantial doc-comment explaining the retirement. `focusReadiness.test.ts` is deleted. No callers change because no code outside `focusReadiness.test.ts` ever consumed the deleted symbols.

Why "rewrite" rather than "selectively delete":
- The deleted surface area is ~85% of the file. A diff that keeps only ~15% reads more clearly as a fresh narrow module than as a heavy delete.
- The file's doc-comment is the load-bearing artifact for future agents. Anchoring the new role + retirement rationale at the top means a future cold-start agent reading the file can see why the speculative API is gone, and what the file now does (and does not) own.

Why no rename to e.g. `diagnosticDimensions.ts`:
- `generatedPlanDiagnostics.ts` and its test currently import from `./sessionAssembly/focusReadiness`. A rename has churn cost (import-path updates across two files) without changing behavior. The file's narrowed role is documented in its top comment; the path stays where its consumers already point.
- If a future agent has reason to revisit the diagnostic spine (e.g., spinning up a real remediation tracker), they can rename then if it serves the change. Pre-emptive renames have no payoff.

Why delete the test file rather than slim it:
- Every assertion in `focusReadiness.test.ts` targets a deleted symbol. There is no subset to keep.
- The dimension constants are already exercised through `generatedPlanDiagnostics.test.ts` — that file has been the ongoing test pin for the shared dimensions since the merge.

---

## Acceptance Criteria

- [x] R1 / R2 / R3 / R4: spine declared in `D138`; canonicality assignments recorded; `D139` left untouched.
- [x] R5 / R6 / R7: `focusReadiness.ts` reduced to dimension exports + retirement doc-comment.
- [x] R8: `focusReadiness.test.ts` deleted.
- [x] R9: typecheck, lint, full test suite (150 files / 2116 tests), and `diagnostics:report:check` all green.
- [x] R10: `focusCoverageAudit` snapshot unchanged at 180/180 covered.
- [x] R11: `generatedPlanDiagnostics` 540-cell surface unchanged.
- [x] R12: no UI / controller / Dexie / model change.
- [x] R13 / R14 / R15 / R16: decisions, status, merge plan, and catalog updated.

---

## Out of Scope

- **Reviving the gap-card / activation-manifest workflow.** If a remediation tracker becomes worth building, re-author from the new context (likely a JSON gap registry under `docs/`, or a typed module composed against whichever live diagnostic is being remediated). The deleted shapes were speculative pre-implementation and we are not committed to them.
- **Renaming `focusReadiness.ts`.** Deferred. The path stays where `generatedPlanDiagnostics.ts` and its test point. Rename when a meaningful trigger arises.
- **Reconciling `D139` (validator script gating / compression).** Out of scope. Tracked separately.
- **Changing the dimensions themselves.** `VISIBLE_FOCUSES`, `PLAYER_LEVELS`, `READINESS_DURATIONS`, `READINESS_CONFIGURATIONS` keep their current shape because they are the surface contract of `generatedPlanDiagnostics`.
- **Touching `focusCoverageAudit`'s 5-tier `SkillLevel` walk vs `focusReadiness`'s 3-tier `PlayerLevel` walk.** Now moot — only `focusCoverageAudit` walks any cells. The 4-vs-3 vs 5-tier question is decided by which diagnostic is canonical (`focusCoverageAudit`), not by reconciling two outputs.

---

## Risks and Mitigations

| Risk | Mitigation |
| --- | --- |
| A future plan needs the gap-card / activation-manifest workflow | Re-author from the new context. The pre-2026-05-07 file is in git history if the previous shape ever turns out to be useful, but the doc-comment now records why the speculative API was retired so a future agent does not silently restore an unmaintained surface. |
| Some downstream doc references `buildFocusReadinessAudit` or `evaluateFocusReadinessCell` | Searched. References exist in `docs/reviews/2026-04-30-focus-coverage-readiness-audit.md` (a historical review of feat-branch behavior, not a live source-of-truth doc) and `docs/archive/plans/2026-05-01-001-feat-generated-plan-diagnostics-plan.md` (archived). Neither is canon; both are historical record. Leave as-is — rewriting historical reviews falsifies the historical record. The `D138` row in `docs/decisions.md` and the "Recent Shipped History" entry in `docs/status/current-state.md` are the canonical entry points for the post-prune state. |
| Renaming the file later breaks more imports | The file path is referenced in two import sites (`generatedPlanDiagnostics.ts` + its test). A future rename is a 2-file diff. Cheap. |
| Dimension constants drift later | Already at risk under the previous shape. The fix is the same in either case: update both consumers. The `D138` row records that the constants exist for `generatedPlanDiagnostics`'s surface contract. |

---

## Verification

- `npm run typecheck` — green.
- `npm run lint` — green.
- `npm run test -- --run` — 150 files / 2116 tests passing (was 151 / 2133 — the 17-test delta is exactly the deleted `focusReadiness.test.ts`).
- `npm run diagnostics:report:check` — `Generated plan diagnostics report is current. Generated plan diagnostics triage is current.`
- `bash scripts/validate-agent-docs.sh` — `Agent doc validation passed.`
- `focusCoverageAudit` snapshot test still passing without snapshot changes (180/180 covered).
