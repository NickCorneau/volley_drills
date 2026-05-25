---
id: triage-retire-and-compound-bundle-requirements-2026-05-25
title: "Triage Workflow Retire-and-Compound Bundle (S1 stubs + S2 D140 retirement + S3 mothball test grading + S4 three-gaps pattern docs) — Requirements"
status: active
stage: validation
type: requirements
summary: "Requirements for the CC1 bundle from the 2026-05-25 triage-workflow-rebuild-or-retire ideation: one atomic commit that retires the dead D47/D05/D01/D49 diagnostic-triage chain via replaced-by stubs (~90% file reduction with audit trail), retires D140 via the D137 supersession template + light D138 audit, grades the 50 skipped tests as Cat A/B/C with explicit fate per category, and captures three named docs/solutions/ pattern docs (markdown-as-API + test-skip discipline + decision-debt sweep) while the lived evidence from the just-shipped duration-honesty slice is fresh."
authority: "Requirements only. Authorizes (a) replacing ~25 inert build/format function bodies in pp/src/domain/generatedPlanDiagnosticTriage.ts with 	hrow replacedBy(...) stubs, (b) retiring D140 in docs/decisions.md via D137 template + auditing D138 for R1 drift, (c) grading and updating the 50 .skip tests in pp/src/domain/__tests__/generatedPlanDiagnosticTriage.test.ts per Cat A/B/C, and (d) writing three new pattern docs under docs/solutions/. Does NOT authorize building packet/build/format functions for the new coverage_gap_review lane, modifying the new finding emission code in generatedPlanDiagnostics.ts, creating a new D-ID anchor (D147), or imposing a decision-epitaph lint policy (Survivor 6) or single-lane collapse (Survivor 7)."
last_updated: 2026-05-25
depends_on:
 - docs/ideation/2026-05-25-triage-workflow-rebuild-or-retire-ideation.md
 - docs/plans/2026-05-24-001-feat-session-duration-honesty-plan.md
 - docs/solutions/architecture-patterns/d137-canonical-pre-run-spine-setup-safety-2026-05-07.md
 - docs/solutions/2026-05-04-source-backed-content-depth-activation-pattern.md
 - app/src/domain/generatedPlanDiagnosticTriage.ts
 - app/src/domain/__tests__/generatedPlanDiagnosticTriage.test.ts
 - app/src/domain/generatedPlanDiagnostics.ts
 - docs/decisions.md
---

# Triage Workflow Retire-and-Compound Bundle — Requirements

## Summary

Retire the dead D47/D05/D01/D49 diagnostic-triage chain in one atomic commit by composing four mutually-reinforcing moves: replaced-by stubs for ~25 inert build/format functions (S1, ~90% file reduction with audit trail), D140 retirement via D137 supersession template + light D138 audit (S2), Cat A/B/C grading for the 50 skipped tests with explicit fate per category (S3), and three new `docs/solutions/` pattern docs capturing markdown-as-API + test-skip discipline + decision-debt sweep (S4) while the lived evidence is fresh.

---

## Problem Frame

The 2026-05-24 session-duration-honesty slice (commits `1944e48` → `8adefbd`, shipped 2026-05-25) retired the `redistributedMinutes` path that produced the legacy `optional_slot_redistribution + over_authored_max + over_fatigue_cap` group-key fingerprints. The diagnostic-triage layer at `app/src/domain/generatedPlanDiagnosticTriage.ts` (4552 lines, ~25 build/format functions) all pivots on those legacy keys; under v8 no real session produces them. 50 tests are marked `.skip` with an explanatory top-of-file marker; D140 (`docs/decisions.md`) proposes a cap on a redistribution mechanism that no longer exists.

The current state has four costs: (1) ~4000 lines of inert code in a domain module violates AGENTS.md calm-by-default and adds context-window tax to every agent assist; (2) 50 `.skip`'d tests are aspirational preservation with zero verification — silent rot waiting to be discovered; (3) D140 carries authorization invariants (`runtimeRedistribution`) referencing a mechanism that no longer exists, adding decision-debt to `docs/decisions.md` that compounds for every future curator; (4) the just-shipped slice generated lived evidence for three patterns the learnings researcher flagged as gaps in `docs/solutions/` — markdown-as-API choice, test-skip discipline, decision-debt sweep workflow — and that evidence loses recency-grounded clarity if not captured now.

The 2026-05-25 ideation pass (`docs/ideation/2026-05-25-triage-workflow-rebuild-or-retire-ideation.md`) produced 47 raw candidates across 6 frames, 7 survivors after adversarial critique, and identified CC1 (S1 + S2 + S3 + S4) as the recommended bundle. Five independent external literatures (feature-flag two-PR retirement, ESLint `meta.deprecated`/`replacedBy` schema, Delete-Driven Design, local-first observability-for-one, strangler-fig only when isomorphic) converge on retire-before-rebuild for D130 single-reader. The internal D137 tune-today retirement template is the directly-applicable internal precedent.

---

## Actors

- A1. **Founder** (sole reader through D130 / 2026-07-20). Consumer of `docs/decisions.md`, `docs/solutions/`, and the diagnostic-triage source file as context. Beneficiary of carrying-cost reduction.
- A2. **ce-plan / ce-work agents**. Will execute this slice; consume the stub message format, the Cat A/B/C rubric, the docs/solutions/ pattern doc structure, and the D137 supersession workflow as inputs.
- A3. **Future agents reading the triage file post-slice**. Encounter the replaced-by stubs; the forward-pointer message format is the contract that lets them navigate to `coverage_gap_review`.

---

## Requirements

**Stage 1: Replaced-By Stubs (S1)**

- R1. Every inert build/format function in `app/src/domain/generatedPlanDiagnosticTriage.ts` (the ~25 functions enumerated in the 50-`.skip` marker test file plus any whose-only-callers-are-those-tests — ce-work enumerates the exact list during execution) gets its body replaced with a one-line stub that throws a `replacedBy`-shaped error pointing at `coverage_gap_review` and the duration-honesty plan path.
- R2. The stub message format is uniform: `throw new Error('replacedBy: coverage_gap_review since=2026-05-24; see docs/plans/2026-05-24-001-feat-session-duration-honesty-plan.md')` or equivalent. ce-plan picks exact API shape (helper function vs inline `throw new Error`).
- R3. Function signatures, exports, and JSDoc above each function are preserved so `grep` for legacy finding kinds still hits a discoverable artifact.
- R4. Test file in `app/src/domain/__tests__/generatedPlanDiagnosticTriage.test.ts` retains the top-of-file marker (updated to reference this brainstorm/plan path) but no longer needs to contain explanatory text about WHY the tests are skipped — the stub bodies themselves are the documentation.

**Stage 2: D140 Retirement + D138 Audit (S2)**

- R5. D140 in `docs/decisions.md` (line 164 at writing) gets retired via the D137 supersession template (`docs/solutions/architecture-patterns/d137-canonical-pre-run-spine-setup-safety-2026-05-07.md`): immutable original preserved, supersession entry added pointing at `docs/plans/2026-05-24-001-feat-session-duration-honesty-plan.md` as the slice that retired the underlying mechanism.
- R6. Supersession entry includes a one-paragraph eulogy: birth date, death date, cause-of-death (`runtimeRedistribution` removed by R1 of duration-honesty plan), what survives (the source-backed-reroute registry; the diagnostic emitter for `slot_dropped` / `under_named_profile_duration`), what is buried (the `cap_redistribution_at_carrier_max` proposal direction; the authorization invariants for `runtimeRedistribution`, `cap`, `sourceDepth`, `d47Reopen`).
- R7. D138 (`docs/decisions.md`) is audited for R1 drift: read-through of its body checking whether any claims about `focusReadiness`, `focusCoverageAudit`, or diagnostic-spine canonicality referenced the retired redistribution paths. If drift is found, annotate inline rather than retire D138 in this slice. If no drift, record "audited 2026-05-25; no R1 drift found" as a one-line note.
- R8. No new D-ID is created in this slice; supersession points directly at the duration-honesty plan path. (If a second similar retirement happens later, that future slice can create the anchor.)

**Stage 3: Mothball Cat A/B/C for the 50 Skipped Tests (S3)**

- R9. ce-work grades each of the 50 `.skip`'d tests in `app/src/domain/__tests__/generatedPlanDiagnosticTriage.test.ts` per the Cat A/B/C rubric below.
- R10. **Cat A** — test exercises a finding shape that a plausible future v9-class diagnostic might restore (e.g., the test asserts on a fingerprint pattern that could legitimately re-emerge under a new finding-emission contract). Keep the test, change it from `.skip` to a smoke test that asserts the call signature compiles and the function throws the `replacedBy`-shaped error from R1. Cost: a few ms per test, deterministic green.
- R11. **Cat B** — test exercises a primitive (helper function, type guard, fingerprint formatter) still useful under the new lane. Extract the primitive into the new `coverage_gap_review`-related code path (or its own utility module if the home isn't obvious); migrate the test to point at the new home; un-`.skip` it.
- R12. **Cat C** — test exercises an inert workflow with no plausible reactivation. Delete the test alongside the corresponding stub deletion (which doesn't happen in this slice; stubs are preserved per R1-R3). Actually: in this slice, Cat C tests are still deleted because the stub remains as the forward-pointer; the test was exercising the workflow body which is now `throw`. Delete the Cat C test.
- R13. No test goes uncategorized. If ce-work hits a case that doesn't cleanly fit A / B / C, that's a follow-up surfaced separately, not absorbed silently.

**Stage 4: Three-Gaps Pattern Doc Capture (S4)**

- R14. Write three new pattern docs under `docs/solutions/`, each filling one of the three named gaps from the 2026-05-25 ideation:
  - `docs/solutions/2026-05-25-markdown-as-api-choice.md` — when to keep TypeScript builders for markdown output vs emit markdown directly. Worked example: the just-retired triage layer's 25 markdown-renderer functions vs the (alternative) direct-emit shape.
  - `docs/solutions/2026-05-25-test-skip-discipline.md` — when `.skip` is acceptable, what markers must accompany it (top-of-file or per-block explanatory), how long it can live, when to delete. Worked example: the 50-test marker that triggered this whole question + the Cat A/B/C rubric from R9-R12.
  - `docs/solutions/2026-05-25-decision-debt-sweep-pattern.md` — the workflow for applying D137 retirement template to a cluster of mechanism-retired decisions in one pass. Worked example: D140 retirement (and the D138 audit pass) from R5-R8.
- R15. Each doc follows the existing `docs/solutions/` frontmatter shape (`id`, `title`, `status`, `stage`, `type`, `summary`, `authority`, `last_updated`, `depends_on`) and is ~1-2 pages long.
- R16. Each doc names a "second-instance trigger": when does this pattern get re-applied? (e.g., the markdown-as-API doc says "re-apply when a new diagnostic surface is being designed".)

**Atomicity**

- R17. All four stages land in **one atomic commit** on `main`. Per AGENTS.md lock-step discipline, the commit is pushed to `origin` immediately. No staging, no feature branch.
- R18. The commit message follows the conventional-commit pattern used in recent history; subject names the bundle (`retire(triage): apply CC1 bundle` or similar); body enumerates the four stages with file counts and key references.

---

## Acceptance Examples

- AE1. **Covers R1, R2, R3.** Given the current 4552-line `generatedPlanDiagnosticTriage.ts`, when this slice ships, then the file is < 1000 lines (target ~600-800), every former build/format function still exists by name with the `replacedBy`-style throw body, and `grep -rn slot_dropped app/src/domain` still finds the legacy reference points.
- AE2. **Covers R5, R6.** Given D140 in `docs/decisions.md`, when this slice ships, then D140's original body is preserved (immutable per D137 template) and a supersession entry with the eulogy from R6 has been added pointing at the duration-honesty plan path.
- AE3. **Covers R7.** Given D138 in `docs/decisions.md`, when this slice ships, then D138 either has an inline annotation noting R1-related drift or a one-line "audited 2026-05-25; no R1 drift found" note. Neither annotation is absent.
- AE4. **Covers R9, R10, R11, R12, R13.** Given the 50 `.skip`'d tests, when this slice ships, then every test has been assigned a Cat (A, B, or C) with the corresponding action taken (smoke test rewrite for A, migration for B, deletion for C). The total `.skip` count in the test file is 0.
- AE5. **Covers R14, R15, R16.** Given the absence of pattern docs for the three named gaps, when this slice ships, then three new docs exist under `docs/solutions/` with the named filenames, the `docs/solutions/`-standard frontmatter, and a second-instance trigger named in each.
- AE6. **Covers R17, R18.** Given the working tree, when this slice ships, then exactly one commit on `main` contains all the changes; it has been pushed to `origin`; the commit message subject names the bundle.

---

## Success Criteria

- The 4000-line carrying cost is gone (file under 1000 lines).
- D140 is no longer mentally annotated as "wait, is this still live?" when reading `docs/decisions.md`.
- The 50 `.skip` marker is gone (every test has an explicit Cat outcome).
- A future ce-learnings-researcher dispatch on "decision-debt sweep" or "markdown-as-API" or "test-skip discipline" returns the new docs.
- A downstream agent reading this requirements doc + ce-plan output can implement the slice with no further product/scope decisions to make.
- The slice ships as one atomic commit on `main`, pushed to `origin`, per AGENTS.md lock-step.

---

## Scope Boundaries

- **Not building packet/build/format functions for the `coverage_gap_review` lane.** The lane has routing wiring; building rich packets is speculative until a real use case surfaces.
- **Not modifying `generatedPlanDiagnostics.ts`.** The finding emission code (which produces `slot_dropped` + `under_named_profile_duration`) just shipped; leave it.
- **Not creating D147 or any new D-ID as a retirement anchor.** Supersession points directly at the duration-honesty plan; future similar retirements can create their own anchors.
- **Not imposing a Decision Epitaph lint policy** (Survivor 6 from ideation). Adjacent ongoing policy worth surfacing later if a second similar retirement happens.
- **Not collapsing to a Single-Lane Monoculture** (Survivor 7 from ideation). Premature; not enough field evidence on the `slot_dropped` / `under_named_profile_duration` distinction yet.
- **Not pre-grading the 50 skipped tests by the founder.** ce-work handles per-test grading via the Cat A/B/C rubric during S3 execution.
- **Not retiring decisions other than D140.** D04/D05/D47/D49 referenced in the ideation doc were a misread; those uppercase D-IDs don't exist as decisions tied to redistribution (the lowercase d04/d05/d47/d49 in the triage workflow are drill IDs).
- **Not editing the new `coverage_gap_review` lane's routing logic.** Routing wiring is already in place from the 2026-05-24 slice.
- **Not addressing the `coverage_gap_review` lane's eventual workflow shape.** That's a separate brainstorm if/when a real use case surfaces.

---

## Key Decisions

- **One atomic commit, not four sequential.** Per user's `all_four_one_pr` pick: the four moves compound by landing together. Sequential commits would lose the compounding-together feel.
- **S2 narrows to D140 retirement + D138 audit; no new D-ID anchor.** The ideation doc's "D04/D05/D47/D49" cluster was a misread of drill IDs vs decision IDs. Actual decision-retirement scope is just D140; D138 audit is the cheap safety pass.
- **Replaced-by stubs over scorched-earth deletion.** The ESLint-precedent forward-pointer (Survivor 1) preserves discoverable archaeology at ~600-800 lines vs scorched-earth's zero-archaeology at zero lines. The audit-trail value matters for founder-mode single-reader memory across weeks.
- **Cat A/B/C rubric, not MUSTIE.** Survivor 5's 6-category library-science rubric was rejected in favor of the simpler naval 3-category rubric (Survivor 3) for the same job.
- **Three separate pattern docs, not one combined doc.** Each gap is a distinct pattern with its own second-instance trigger; combining them buries the searchability.
- **D137 template followed exactly for D140 retirement.** The template is the canonical retire-after-upstream-simplification pattern; deviating now would weaken the institutional precedent.
- **No new lane workflow code.** Worth confirming directly: the new `coverage_gap_review` routing lane exists (lines 1121-1125, 1244, 1253-1256, 1299-1307, 1459, 1608 of `generatedPlanDiagnosticTriage.ts`) but no packet/build/format functions are wired to it. This slice deliberately does NOT wire them. The current diagnostic report is the only surface for `slot_dropped` + `under_named_profile_duration` findings; that's sufficient for D130 single-reader founder-mode through 2026-07-20.

---

## Dependencies / Assumptions

- The 2026-05-24 duration-honesty slice is fully shipped (commits `1944e48` → `8adefbd`, plus the 2026-05-25 ideation commit `7a51375`). Verified.
- `docs/decisions.md` contains D140 at approximately line 164 (verified 2026-05-25 via grep).
- The 50 `.skip`'d tests in `generatedPlanDiagnosticTriage.test.ts` are stable post-2026-05-25 shipment of the duration-honesty slice. ce-work re-counts during execution to catch any drift.
- The D137 template's supersession pattern is documented in `docs/solutions/architecture-patterns/d137-canonical-pre-run-spine-setup-safety-2026-05-07.md`; ce-plan reads it.
- `coverage_gap_review` routing is in place in the triage layer's `compressionLaneForGeneratedPlanTriageItem` function and related routing maps; ce-plan verifies.
- The just-shipped slice generates lived evidence for the three pattern-doc gaps. If ce-work finds that evidence is too thin for any of the three docs, the doc can be deferred and noted as a follow-up.

---

## Outstanding Questions

### Resolved Here

- **Bundle composition:** all four survivors (S1+S2+S3+S4). Atomic commit.
- **S2 scope:** D140 retirement via D137 template + D138 audit. No D147 anchor.
- **Stub message format:** `throw new Error('replacedBy: ...')`-shaped; exact API deferred to ce-plan.
- **Cat A/B/C rubric:** defined above; ce-work grades per-test during execution.
- **S4 doc structure:** three separate files filling three named gaps; each ~1-2 pages with second-instance trigger.

### Deferred to Planning

- [Affects R1, R2][Technical] Should the `replacedBy` message format use a helper function (e.g., a new `replacedBy()` utility) or an inline `throw new Error('...')`? The helper compounds if a second retirement of this shape happens; the inline is simpler.
- [Affects R9][Technical] Cat A smoke tests — should they live in the same `generatedPlanDiagnosticTriage.test.ts` file, or migrate to a new `generatedPlanDiagnosticTriage.legacy.test.ts` sibling? Same-file is simpler; separate-file makes the "these test inert workflows" contract more obvious.
- [Affects R14] Each pattern doc's exact `docs/solutions/` placement (subfolder vs flat). Existing `docs/solutions/` has both shapes (flat files + an `architecture-patterns/` subfolder); ce-plan picks per-doc.

---

## Next Steps

→ `/ce-plan docs/brainstorms/2026-05-25-triage-retire-and-compound-bundle-requirements.md` after optional `/ce-doc-review`.
