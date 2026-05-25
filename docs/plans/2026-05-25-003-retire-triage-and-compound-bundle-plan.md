---
title: "retire(triage): apply CC1 retire-and-compound bundle (S1 stubs + S2 D140 retirement + S3 Cat A/B/C test grading + S4 three pattern docs)"
type: retire
status: active
date: 2026-05-25
origin: docs/brainstorms/2026-05-25-triage-retire-and-compound-bundle-requirements.md
---

# retire(triage): CC1 retire-and-compound bundle

## Summary

One atomic commit on `main` that retires the dead D47/D05/D01/D49 diagnostic-triage chain via four mutually-reinforcing moves: replaced-by stubs for the inert build/format functions in `generatedPlanDiagnosticTriage.ts` (~90% file reduction with audit trail), D140 retirement via the D137 supersession pattern plus a light D138 drift-check, Cat A/B/C grading for the 44 `.skip`'d tests with explicit fate per category, and three new `docs/solutions/` pattern docs capturing markdown-as-API + test-skip discipline + decision-debt sweep while the lived evidence from the just-shipped 2026-05-24 duration-honesty slice is fresh.

---

## Problem Frame

Per the origin brainstorm (`docs/brainstorms/2026-05-25-triage-retire-and-compound-bundle-requirements.md`): the 2026-05-24 duration-honesty slice (commits `1944e48` → `8adefbd`) retired the `redistributedMinutes` mechanism that produced the legacy `optional_slot_redistribution + over_authored_max + over_fatigue_cap` group-key fingerprints. The triage layer at `app/src/domain/generatedPlanDiagnosticTriage.ts` (4552 lines, ~25 build/format functions, 189 raw `redistribut*` references confirmed via grep on 2026-05-25) pivots on those legacy keys; under v8 no real session produces them. 44 tests in `app/src/domain/__tests__/generatedPlanDiagnosticTriage.test.ts` are marked `.skip` with an explanatory top-of-file marker (verified count on 2026-05-25; the brainstorm's "50" reference was a directional estimate from the implementation subagent at the time the bundle was authored). D140 in `docs/decisions.md:164` proposes `cap_redistribution_at_carrier_max` for a mechanism that no longer exists.

The four costs (per origin brainstorm Problem Frame): ~4000 lines of inert code violating AGENTS.md calm-by-default + agent context-window tax; 44 `.skip`'d tests as silent rot; D140 carrying authorization invariants for retired mechanisms; recency-grounded clarity on three named pattern-doc gaps decaying if not captured now.

---

## Requirements

Plan requirements trace 1:1 to origin doc R-IDs. Three plan-time notes from user pre-planning are applied where flagged.

**Stage 1: Replaced-By Stubs (S1)**

- R1. Every inert build/format function in `app/src/domain/generatedPlanDiagnosticTriage.ts` (the ~25 functions whose only callers are the 44 `.skip`'d tests — ce-work enumerates the exact list during U1 execution) gets its body replaced with a one-line stub that throws a `replacedBy`-shaped error pointing at `coverage_gap_review` and the duration-honesty plan path (see origin: R1).
- R2. The stub message format is uniform inline `throw new Error('replacedBy: coverage_gap_review since=2026-05-24; see docs/plans/2026-05-24-001-feat-session-duration-honesty-plan.md')` — see Key Technical Decisions below for why inline over helper (see origin: R2).
- R3. Function signatures, exports, and JSDoc above each function are preserved so `grep -rn` for legacy finding kinds still hits a discoverable artifact (see origin: R3).
- R4. The triage test file retains a single concise top-of-file marker pointing at this plan's path; per-test explanatory text is removed once the stub bodies themselves carry the contract (see origin: R4).

**Stage 2: D140 Retirement + D138 Drift-Check (S2)**

- R5. D140 in `docs/decisions.md` (currently at line 164) gets retired via the D137 supersession pattern (`docs/solutions/architecture-patterns/d137-canonical-pre-run-spine-setup-safety-2026-05-07.md`): immutable original preserved, supersession annotation added pointing at `docs/plans/2026-05-24-001-feat-session-duration-honesty-plan.md` as the slice that retired the underlying mechanism (see origin: R5).
- R6. The supersession annotation includes a one-paragraph eulogy: birth date (2026-05-07), death date (2026-05-25), cause-of-death (`runtimeRedistribution` removed by R1 of duration-honesty plan), what survives (source-backed-reroute registry; `slot_dropped` / `under_named_profile_duration` finding emitters), what is buried (`cap_redistribution_at_carrier_max` proposal direction; authorization invariants for `runtimeRedistribution` / `cap` / `sourceDepth` / `d47Reopen`) (see origin: R6).
- R7. **[NOTE A applied]** D138 in `docs/decisions.md` gets a one-line drift-check note: read-through confirms D138 is about `focusCoverageAudit` vs `focusReadiness` reconciliation with no documented connection to the redistribution mechanism; the note records "audited 2026-05-25; no R1 drift" inline at the end of the D138 cell or as a footnote-style addition (see origin: R7, downgraded from substantive audit per user pre-planning note).
- R8. No new D-ID is created in this slice; supersession points directly at the duration-honesty plan path (see origin: R8).

**Stage 3: Cat A/B/C Grading for the 44 Skipped Tests (S3)**

- R9. **[NOTE B applied]** ce-work grades each of the **44** `.skip`'d tests in `app/src/domain/__tests__/generatedPlanDiagnosticTriage.test.ts` per the Cat A/B/C rubric below. (Origin doc said "50"; verified count on 2026-05-25 is 44 — the brainstorm authored from an in-flight subagent estimate. Per R13 below, the per-test rubric handles the actual count naturally.) (see origin: R9).
- R10. **Cat A** — test exercises a finding shape that a plausible future v9-class diagnostic might restore. Keep the test, change it from `.skip` to a smoke test that asserts the call throws the `replacedBy`-shaped error from R1. Cost: deterministic green, a few ms (see origin: R10).
- R11. **Cat B** — test exercises a primitive (helper function, type guard, fingerprint formatter) still useful under the new lane. Extract the primitive to its own utility module if no obvious home exists; migrate the test to point at the new home; un-`.skip` (see origin: R11).
- R12. **Cat C** — test exercises an inert workflow with no plausible reactivation. Delete the test outright; the stub body remains as the forward-pointer (see origin: R12).
- R13. No test goes uncategorized. If ce-work hits a case that doesn't cleanly fit A / B / C, that's a follow-up surfaced separately (in the commit body or a tracked note), not absorbed silently (see origin: R13).

**Stage 4: Three-Gaps Pattern Doc Capture (S4)**

- R14. Write three new pattern docs under `docs/solutions/`, each filling one of the three named gaps from the 2026-05-25 ideation. Subfolder placement decided per doc per Key Technical Decisions below:
  - `docs/solutions/architecture-patterns/2026-05-25-markdown-as-api-choice.md`
  - `docs/solutions/workflow-issues/2026-05-25-test-skip-discipline.md`
  - `docs/solutions/architecture-patterns/2026-05-25-decision-debt-sweep-pattern.md` (see origin: R14).
- R15. Each doc follows the existing `docs/solutions/` frontmatter pattern (`title`, `date`, `category`, `module`, `problem_type`, `component`, `severity`, `applies_when`, `tags`) and is ~1-2 pages long (see origin: R15).
- R16. Each doc names a "second-instance trigger": when does this pattern get re-applied? (see origin: R16).

**Atomicity**

- R17. All four stages land in one atomic commit on `main`. Per AGENTS.md lock-step discipline, the commit is pushed to `origin` immediately. No staging, no feature branch (see origin: R17).
- R18. The commit message subject names the bundle (`retire(triage): apply CC1 retire-and-compound bundle`); body enumerates the four stages with file counts and key references (see origin: R18).

**Origin actors:** A1 Founder (sole reader through D130 / 2026-07-20). A2 ce-plan / ce-work agents (execute the slice). A3 Future agents reading the triage file post-slice (encounter stubs as forward-pointers).

**Origin acceptance examples:** AE1 (R1, R2, R3 — file < 1000 lines, signatures preserved, grep still works); AE2 (R5, R6 — D140 supersession annotation with eulogy); AE3 (R7 — D138 one-line drift-check note, simplified per note A); AE4 (R9, R10, R11, R12, R13 — every test assigned a Cat with action taken; total `.skip` count = 0); AE5 (R14, R15, R16 — three docs with frontmatter + second-instance trigger); AE6 (R17, R18 — one atomic commit pushed to `origin`).

---

## Scope Boundaries

- Not building packet/build/format functions for the `coverage_gap_review` lane (per origin Scope Boundaries).
- Not modifying `generatedPlanDiagnostics.ts` (per origin Scope Boundaries) — **this is what defers note (c) below**.
- Not creating D147 or any new D-ID as a retirement anchor.
- Not imposing a Decision Epitaph lint policy (Survivor 6 from ideation).
- Not collapsing to a Single-Lane Monoculture (Survivor 7 from ideation).
- Not pre-grading the 44 skipped tests by the founder — ce-work handles per-test grading via Cat A/B/C during U3 execution.
- Not retiring decisions other than D140.
- Not editing the new `coverage_gap_review` lane's routing logic (already in place from 2026-05-24 slice).
- Not addressing the `coverage_gap_review` lane's eventual workflow shape (separate brainstorm if/when a real use case surfaces).

### Deferred to Follow-Up Work

- **[NOTE C applied — DEFERRED]** **Strip `redistributedMinutes` / `redistributionLayoutIndex` from the assembly-trace type and zero-fill writes.** The user's pre-planning note asked whether these 6 references in `sessionBuilder.ts` (type fields at `:97-98`, zero-fill writes at `:378-379`, plus explanatory comments) should also be retired in the same atomic commit. Verification showed `generatedPlanDiagnostics.ts:712-720` actively reads `trace.redistributedMinutes` and `trace.redistributionLayoutIndex` as load-bearing control flow (under R1 the values are always `0`/`undefined` so the function short-circuits to `return undefined`, but the type fields are still consumed). Stripping the trace fields therefore requires modifying `generatedPlanDiagnostics.ts` — which the origin brainstorm Scope Boundaries explicitly forbid. **Recorded as a follow-up slice** that bundles: (a) stripping the trace fields from `sessionBuilder.ts`, (b) removing the short-circuit branch from `generatedPlanDiagnostics.ts:707-721`, (c) regenerating any affected test fixtures, (d) updating `app/scripts/validate-generated-plan-diagnostics-report.mjs:40-46` which also references the field names. ~10-20 LOC scattered across 4 files; suitable as a small standalone slice. Adding to this atomic commit would expand its blast radius into the just-shipped emitter code, which carries unjustified regression risk for the carrying-cost benefit (~6 dead type fields).

---

## Context & Research

### Relevant Code and Patterns

- `app/src/domain/generatedPlanDiagnosticTriage.ts` (4552 lines) — the target file. ~189 `redistribut*` references confirmed via grep on 2026-05-25; the ~25 build/format functions enumerated below.
- `app/src/domain/__tests__/generatedPlanDiagnosticTriage.test.ts` (2751 lines) — 44 `.skip`'d tests confirmed via grep. Top-of-file marker (lines 1-23) explains the U4 escalation; the marker stays per R4 but the per-test rubric replaces its inline status.
- `app/src/domain/generatedPlanDiagnostics.ts:163-167, 707-721` — live consumer of `trace.redistributedMinutes` and `trace.redistributionLayoutIndex`. **Out of scope per Scope Boundaries; touched by deferred-follow-up only.**
- `app/src/domain/sessionBuilder.ts:97-98, 378-379` — `AssemblyTrace` type fields and zero-fill writes. **Out of scope per Scope Boundaries; touched by deferred-follow-up only.**
- `app/scripts/validate-generated-plan-diagnostics-report.mjs:40-46` — validator script consuming both camelCase and snake_case names. **Out of scope per Scope Boundaries; touched by deferred-follow-up only.**
- `docs/decisions.md:164` — D140 cell, target of R5/R6 supersession annotation.
- `docs/decisions.md:166` — D138 cell, target of R7 one-line drift-check note.
- `docs/solutions/architecture-patterns/d137-canonical-pre-run-spine-setup-safety-2026-05-07.md` — the D137 supersession pattern reference for R5/R6. The actual structural pattern: original decision body is preserved; a new supersession note is added that names the slice that retired the underlying mechanism.
- `docs/solutions/architecture-patterns/` — existing subfolder; right home for "markdown-as-API" and "decision-debt-sweep" pattern docs (both are architecture-class patterns about code shape and docs-shape).
- `docs/solutions/workflow-issues/` — existing subfolder containing `route-founder-use-feedback-without-overfiring-scope-2026-05-04.md`; right home for "test-skip-discipline" (workflow-class pattern about test hygiene).
- `docs/solutions/2026-05-04-source-backed-content-depth-activation-pattern.md` + `docs/solutions/2026-05-10-drill-first-time-runnability-system.md` — existing flat-file pattern docs; precedent for the YAML frontmatter shape the three new docs should follow (with the actual frontmatter shape derived from the D137 doc since it's the closest peer).

### Institutional Learnings

- `docs/solutions/architecture-patterns/d137-canonical-pre-run-spine-setup-safety-2026-05-07.md` — the canonical retirement-after-upstream-simplification pattern; directly applied in U2 (S2). Item 4 ("Delete dead verticals together") is the precedent for one-atomic-commit bundle shape.
- `docs/solutions/2026-05-04-source-backed-content-depth-activation-pattern.md` — informs the new `2026-05-25-decision-debt-sweep-pattern.md` doc's structure; the 2026-05-25 fifth-addendum at line 169 is itself a worked example of pattern-doc evolution (cite as a "patterns compound" sub-point).
- `.cursor/rules/docs-editorial-workflow.mdc` — frontmatter shape for `docs/solutions/` follows the same `id` / `title` / `status` / `stage` / `type` / `summary` shape used for `docs/brainstorms/`; verify on file write.
- `.cursor/rules/testing.mdc` — testing pyramid; U3 (S3) Cat A smoke tests stay at the same domain tier as the existing test file.
- `.cursor/rules/data-access.mdc` — domain stays pure; U1 (S1) stays within `app/src/domain/`; U3 (S3) Cat B extraction stays within `app/src/domain/` if any utility module is created.

### External References

External research skipped — the brainstorm's grounding subagent already surfaced 5 convergent external literatures (feature-flag two-PR retirement, ESLint `meta.deprecated`/`replacedBy` schema, Delete-Driven Design, local-first observability-for-one, strangler-fig only when isomorphic). All directly applied via S1 stubs and S2 D137 template.

---

## Key Technical Decisions

- **Stub format: inline `throw new Error('replacedBy: ...')`, not a helper function.** Origin Deferred-to-Planning item #1. The helper compounds only if a second retirement of this shape happens; ~25 inline throws is ~25 LOC and matches the ESLint precedent shape directly. Adding a helper is over-abstraction for a one-time retirement.
- **Cat A smoke tests stay in `generatedPlanDiagnosticTriage.test.ts`, no sibling file.** Origin Deferred-to-Planning item #2. The top-of-file marker (updated per R4) is the contract that says "tests in this file exercise inert workflows"; migrating Cat A tests to a sibling adds a new file for marginal clarity. Same-file is simpler and easier to find via the existing import patterns.
- **`docs/solutions/` subfolder placement per pattern.** Origin Deferred-to-Planning item #3.
  - `architecture-patterns/2026-05-25-markdown-as-api-choice.md` — code-shape pattern about when to use TypeScript builders for markdown output vs emit directly. Belongs with D137 (also architecture-patterns).
  - `workflow-issues/2026-05-25-test-skip-discipline.md` — workflow pattern about when `.skip` is acceptable and how long it can live. Belongs with the existing `route-founder-use-feedback-without-overfiring-scope-*` doc (both are workflow-class).
  - `architecture-patterns/2026-05-25-decision-debt-sweep-pattern.md` — docs/architecture pattern about applying D137 template in clusters. Belongs with D137 (the pattern it generalizes from).
- **D138 drift-check is a single inline annotation, not a substantive audit pass.** Note A applied — D138 reads as wholly about `focusCoverageAudit` vs `focusReadiness`; no R1-related drift surface to audit. R7 becomes a one-line note ("audited 2026-05-25; no R1 drift") added inline at the end of the D138 cell.
- **Test count is 44, not 50.** Note B applied — origin "50" was a directional subagent estimate; verified count on 2026-05-25 is 44. R9 prose tightened; the per-test rubric naturally handles whatever the actual count is at U3 execution time (R13 already covers count drift).
- **Trace-field strip is deferred to a separate follow-up slice.** Note C applied — `generatedPlanDiagnostics.ts:707-721` and `app/scripts/validate-generated-plan-diagnostics-report.mjs:40-46` both consume the trace fields actively; stripping requires modifying the live emitter, which the brainstorm scope explicitly forbids. The carrying cost of ~6 dead type fields does not justify the regression risk of touching the just-shipped emitter in this same commit. Recorded as a known follow-up under Scope Boundaries → Deferred to Follow-Up Work.
- **One atomic commit on `main`, no PR.** Per AGENTS.md single-branch flow + origin R17. Commit message subject `retire(triage): apply CC1 retire-and-compound bundle`.

---

## Open Questions

### Resolved During Planning

- **Stub format** (origin Deferred-to-Planning #1): inline `throw new Error('replacedBy: ...')`. See Key Technical Decisions above.
- **Cat A smoke test file placement** (origin Deferred-to-Planning #2): same-file, no sibling. See Key Technical Decisions above.
- **Pattern doc subfolder placement** (origin Deferred-to-Planning #3): per-doc per Key Technical Decisions above. Two architecture-patterns + one workflow-issues.
- **D138 audit scope** (plan-time note A): one-line drift-check, no substantive audit.
- **Test count** (plan-time note B): 44, not 50. R9 tightened.
- **Trace-field strip** (plan-time note C): deferred to follow-up slice. Scope Boundaries → Deferred to Follow-Up Work.

### Deferred to Implementation

- Exact list of the ~25 inert build/format functions to stub: enumerable during U1 by reading `generatedPlanDiagnosticTriage.test.ts` import list (lines 32-50 shown in plan-time read) and cross-referencing against `.skip`'d tests' call targets. ce-work enumerates during execution.
- Per-test Cat A/B/C verdict for each of the 44 tests: ce-work grades during U3 execution per the rubric in R10-R12. If any test resists categorization, R13 covers the follow-up path.
- Exact wording of the three pattern docs' second-instance triggers: derive from the actual lived evidence during U4 writing, not pre-decided here.

---

## Implementation Units

All four units land in **one atomic commit** per R17. Unit ordering below is the recommended write-order; commit happens after all four are complete.

- U1. **S1 — Replaced-By Stubs**

**Goal:** Replace the body of every inert build/format function in `app/src/domain/generatedPlanDiagnosticTriage.ts` with `throw new Error('replacedBy: coverage_gap_review since=2026-05-24; see docs/plans/2026-05-24-001-feat-session-duration-honesty-plan.md')`. Preserve signatures, exports, and JSDoc. Target: file shrinks from 4552 lines to ~600-800 lines.

**Requirements:** R1, R2, R3

**Dependencies:** None (U1 can land first within the bundle)

**Files:**
- Modify: `app/src/domain/generatedPlanDiagnosticTriage.ts` (replace ~25 function bodies)

**Approach:**
- First pass: enumerate the inert functions. Read `generatedPlanDiagnosticTriage.test.ts:32-50` import list, identify functions consumed only by `.skip`'d tests (cross-reference against active call sites elsewhere via grep `import.*build.*from.*generatedPlanDiagnosticTriage`). Verify each candidate has zero live callers before stubbing.
- Second pass: replace each function body with the uniform `throw new Error('replacedBy: ...')` one-liner. Preserve the function signature exactly (parameter types, return type, exports). Preserve the JSDoc block above each function as-is — it documents the legacy contract for archaeology.
- Third pass: confirm `npm run typecheck` passes (signatures preserved means types still resolve). Confirm `npm run lint` passes (no unused-import warnings from removed function bodies — JSDoc and signature preservation means imports stay used). Confirm file line count is < 1000 (per AE1).

**Execution note:** Type-check after every ~5 function stubs to catch any accidentally-live caller. If a function turns out to have a live caller (i.e., a non-`.skip`'d test or another module imports it), leave the body intact and add it to the "exclude from stubbing" set with a note in the commit body.

**Test scenarios:**
- Verification: `grep -c 'replacedBy' app/src/domain/generatedPlanDiagnosticTriage.ts` ≈ 25. **Covers AE1 (partial — counts the stubs).**
- Verification: `wc -l app/src/domain/generatedPlanDiagnosticTriage.ts` < 1000. **Covers AE1 (size half).**
- Verification: `grep -rn 'slot_dropped' app/src/domain/` still finds the legacy reference points (signatures + JSDoc preserved). **Covers AE1 (archaeology half).**
- Integration: `npm run typecheck` passes (no broken signatures).
- Integration: `npm run lint` passes.
- Integration: `npm run architecture:check` passes (no layer violations introduced).

**Verification:**
- File line count under 1000.
- ~25 `replacedBy:` throws present in the file.
- Type-check + lint + architecture-check all green.
- All non-skipped tests in the test suite still pass (the stubbed functions are only called by `.skip`'d tests, which won't execute).

---

- U2. **S2 — D140 Retirement + D138 Drift-Check Annotation**

**Goal:** Annotate D140 in `docs/decisions.md` with a D137-style supersession note (eulogy format from R6); annotate D138 with a one-line "audited 2026-05-25; no R1 drift" note. No new D-ID, no body rewrite of either decision.

**Requirements:** R5, R6, R7, R8

**Dependencies:** None

**Files:**
- Modify: `docs/decisions.md` (D140 cell at line 164 and D138 cell at line 166 — line numbers approximate; ce-work re-reads to confirm)

**Approach:**
- First pass: read D140's cell in full. Add a supersession annotation at the end of the cell body in the form: `**Superseded 2026-05-25** by the 2026-05-24 session-duration-honesty slice (commits 1944e48 → 8adefbd; plan: docs/plans/2026-05-24-001-feat-session-duration-honesty-plan.md). [Eulogy paragraph per R6: birth date 2026-05-07, death date 2026-05-25, cause-of-death — runtimeRedistribution mechanism removed by R1 of the duration-honesty plan; what survives — source-backed-reroute registry, slot_dropped / under_named_profile_duration finding emitters; what is buried — cap_redistribution_at_carrier_max proposal direction, authorization invariants for runtimeRedistribution / cap / sourceDepth / d47Reopen.]`
- Second pass: read D138's cell. Add a one-line note at the end: `_(Audited 2026-05-25 against R1 of the duration-honesty plan: no drift found — D138 governs focusCoverageAudit vs focusReadiness reconciliation, no documented connection to the retired redistribution mechanism.)_`
- Third pass: confirm `bash scripts/validate-agent-docs.sh` passes. The decisions file is part of the validator's scope.

**Execution note:** Preserve D140's original body verbatim — the supersession is appended, not a rewrite. D137 template precedent (file at `docs/solutions/architecture-patterns/d137-canonical-pre-run-spine-setup-safety-2026-05-07.md`) is the structural reference for what "supersession" means in this repo: original decision text stays in place, supersession context is added inline. This preserves the audit trail.

**Test scenarios:**
- Verification: `grep -A 2 'Superseded 2026-05-25' docs/decisions.md` shows the D140 annotation. **Covers AE2.**
- Verification: `grep 'Audited 2026-05-25' docs/decisions.md` shows the D138 note. **Covers AE3.**
- Verification: D140's original body text (the `cap_redistribution_at_carrier_max` proposal language) is still present in the file (immutability check).
- Integration: `bash scripts/validate-agent-docs.sh` passes.

**Verification:**
- D140 has the supersession annotation with eulogy.
- D138 has the one-line drift-check note.
- D140's original body is intact (no destructive edit).
- `validate-agent-docs.sh` passes.

---

- U3. **S3 — Cat A/B/C Grading for the 44 Skipped Tests**

**Goal:** Grade each of the 44 `.skip`'d tests in `app/src/domain/__tests__/generatedPlanDiagnosticTriage.test.ts` per the Cat A/B/C rubric (R10-R12). End state: total `.skip` count in the file = 0; each test has an explicit Cat outcome (smoke-test rewrite, primitive-extract migration, or outright deletion).

**Requirements:** R9, R10, R11, R12, R13

**Dependencies:** U1 (the stubs are what Cat A smoke tests assert against)

**Files:**
- Modify: `app/src/domain/__tests__/generatedPlanDiagnosticTriage.test.ts` (regrade all 44 `.skip`'d tests)
- Possibly create: `app/src/domain/<utility-module>.ts` if any Cat B primitive needs a new home (ce-work decides during execution; if no Cat B primitive surfaces, this file isn't created)
- Update: top-of-file marker (lines 1-23) to reference this plan's path instead of the U4-escalation framing

**Approach:**
- First pass: read each `.skip`'d test body. For each, decide Cat A / B / C per the rubric:
  - **Cat A** if the test asserts on a fingerprint pattern or finding shape that a plausible v9-class diagnostic might restore (e.g., asserts that a function exists and returns a structured shape).
  - **Cat B** if the test exercises a primitive (helper, type guard, fingerprint formatter) still useful under the new `coverage_gap_review` lane.
  - **Cat C** if the test exercises an inert workflow with no plausible reactivation.
- Second pass: execute per category.
  - Cat A: change `.skip` → live; rewrite the test body to assert that calling the corresponding stubbed function throws an Error whose message starts with `replacedBy: coverage_gap_review`. ~1-3 lines per test.
  - Cat B: extract the primitive to a new utility module (or co-locate with an existing module if the home is obvious), migrate the test to point at the new home, un-`.skip`.
  - Cat C: delete the test outright.
- Third pass: update the top-of-file marker to point at this plan (`docs/plans/2026-05-25-003-retire-triage-and-compound-bundle-plan.md`) instead of the U4-escalation marker. The marker becomes a concise pointer; the per-test grading is the documentation.
- Fourth pass: confirm 0 `.skip` count via grep.
- If any test resists categorization (R13), record it in the commit body as a tracked follow-up.

**Execution note:** Grade conservatively toward Cat C unless the test has clear v9 reuse value (Cat A) or extractable primitive value (Cat B). Founder-mode single-reader through 2026-07-20 means deletion is the default; preservation needs justification, not the other way around.

**Test scenarios:**
- Verification: `grep -c '\.skip(' app/src/domain/__tests__/generatedPlanDiagnosticTriage.test.ts` = 0. **Covers AE4 (skip-count half).**
- Verification: every former `.skip` test either now asserts against a `replacedBy:` throw (Cat A), exists at a new home (Cat B), or has been deleted (Cat C). **Covers AE4 (per-test fate half).**
- Integration: `npm test` passes (all Cat A smoke tests green; Cat B migrations green; Cat C deletions don't break the suite).

**Verification:**
- Zero `.skip` in the file.
- Test suite passes.
- Top-of-file marker updated to point at this plan.
- Commit body lists any R13-tracked uncategorizable tests (expected: zero).

---

- U4. **S4 — Three Pattern Docs**

**Goal:** Write three new pattern docs under `docs/solutions/` capturing markdown-as-API + test-skip discipline + decision-debt sweep, each with the `docs/solutions/` standard frontmatter and a "second-instance trigger" section.

**Requirements:** R14, R15, R16

**Dependencies:** U1, U2, U3 (the lived evidence the docs cite is the work the prior units land)

**Files:**
- Create: `docs/solutions/architecture-patterns/2026-05-25-markdown-as-api-choice.md`
- Create: `docs/solutions/workflow-issues/2026-05-25-test-skip-discipline.md`
- Create: `docs/solutions/architecture-patterns/2026-05-25-decision-debt-sweep-pattern.md`

**Approach:**
- For each doc:
  - Frontmatter following the D137 doc shape (`title`, `date`, `category`, `module`, `problem_type`, `component`, `severity`, `applies_when`, `tags`). `category` matches the subfolder (architecture-patterns or workflow-issues).
  - Body sections: Context (the friction this pattern solves, with the just-shipped slice as the worked example), Guidance (numbered list of how-to-apply steps), Why This Matters (~3-5 bullets), When To Apply (the second-instance trigger per R16), Examples (code snippets or anchored references from the just-shipped slice).
  - Length: ~1-2 pages (mirrors existing `docs/solutions/` doc sizes).
- Per-doc emphasis:
  - **markdown-as-api-choice.md** — the worked example is the just-retired 25 markdown-renderer functions vs the (alternative) direct-emit shape that `generatedPlanDiagnostics.ts` uses for the new `slot_dropped` + `under_named_profile_duration` findings. Second-instance trigger: "Re-apply when a new diagnostic surface is being designed and the choice between TypeScript builders for markdown output vs emit markdown directly is open."
  - **test-skip-discipline.md** — worked example is the 44-test marker that triggered this whole question, plus the Cat A/B/C rubric from R10-R12. Second-instance trigger: "Re-apply when a `.skip` cluster larger than ~5 tests accumulates with a shared explanatory marker — the cluster is a signal that the underlying contract has shifted."
  - **decision-debt-sweep-pattern.md** — worked example is the D140 retirement (and the D138 audit pass) from R5-R8, plus a citation of the D137 template as the canonical retirement-after-upstream-simplification pattern this generalizes. Second-instance trigger: "Re-apply when a slice retires a mechanism that has decision-level authorization in `docs/decisions.md` — the slice is the right moment to retire the decision, not a later cleanup pass."

**Execution note:** Write each doc from the lived evidence of this bundle, not abstract principle. If evidence for any doc feels too thin during writing (e.g., decision-debt-sweep is a one-instance pattern — D137 + D140 is two but they're related), surface in commit body and defer that doc to a follow-up rather than padding with speculation.

**Test scenarios:**
- Verification: three files exist at the named paths.
- Verification: each has the required frontmatter fields per R15.
- Verification: each has a "When To Apply" or "Second-instance trigger" section per R16.
- Integration: `bash scripts/validate-agent-docs.sh` passes after the three files land.

**Verification:**
- Three files exist with the required structure.
- `validate-agent-docs.sh` passes.
- Each doc cites the just-shipped slice as the worked example.

---

## System-Wide Impact

- **Interaction graph:** `generatedPlanDiagnosticTriage.ts`'s ~25 build/format functions had exactly two caller cohorts: the 44 `.skip`'d tests (U3 retires them per Cat A/B/C) and any live code path elsewhere. U1's "verify zero live callers before stubbing" pass enforces the precondition; if a live caller is discovered, the function is excluded from stubbing.
- **Error propagation:** the new `replacedBy:` throws will surface only if a Cat A smoke test calls the stub (expected, green) or if some unexpected live caller exists (caught at typecheck time during U1 third pass). No runtime path can reach the stubs in production — the source code paths that consumed the legacy findings are dead under v8.
- **State lifecycle risks:** None. No state shape changes; the AssemblyTrace fields stay as-is (deferred follow-up).
- **API surface parity:** Function signatures and exports preserved per R3 — no consumer of the triage module breaks. JSDoc preserved for archaeology.
- **Integration coverage:** U3 covers the triage test file boundary explicitly. U1 covers the typecheck/lint/architecture-check boundary explicitly.
- **Unchanged invariants:**
  - `generatedPlanDiagnostics.ts` finding emission (the `slot_dropped` + `under_named_profile_duration` lane). Per Scope Boundaries.
  - `coverage_gap_review` routing logic in the triage file. Per Scope Boundaries.
  - `sessionBuilder.ts` AssemblyTrace type fields and zero-fill writes. Deferred to follow-up slice.
  - `app/scripts/validate-generated-plan-diagnostics-report.mjs` field references. Deferred to follow-up slice.
  - All shipped behavior from the 2026-05-24 duration-honesty slice. Untouched.

---

## Risks & Dependencies

| Risk | Mitigation |
|------|------------|
| A function appears inert (only consumed by `.skip`'d tests) but actually has a live caller elsewhere (e.g., another module imports it for a side-effect or it's referenced in a script). U1 stubs it, runtime breaks. | U1 first pass enumerates candidates via grep across `app/src/`; second pass type-checks after every ~5 stubs; third pass runs `npm test` + `npm run architecture:check`. Any unexpected breakage triggers exclusion of that function from stubbing and a note in the commit body. |
| Cat A/B/C grading is genuinely ambiguous for some tests (e.g., a test that exercises both an inert workflow and a still-useful primitive). | R13 covers the explicit follow-up path: surface in commit body, don't absorb silently. Bias toward Cat C unless preservation has named justification. |
| D140's supersession annotation accidentally edits or shortens the original cell body (violating the D137-template immutability principle). | U2 first pass explicitly preserves original body verbatim; supersession is appended, not interpolated. ce-work re-reads the post-edit cell to verify. |
| The three pattern docs are written too speculatively, padding the one-instance pattern (decision-debt-sweep) with abstract principle that hasn't yet been proven by a second instance. | U4 execution note says: if evidence feels thin during writing, surface in commit body and defer that doc to a follow-up. Don't pad. |
| The "atomic commit" discipline (R17) collides with the working-tree state — uncommitted `RunScreen.tsx` modifications and `.fix-c1.py` artifact present at planning time. | ce-work stages only the bundle's specific paths (`git add <path>`); confirms `git status` shows only bundle-related files in the staged delta before committing. Pre-existing dirty paths stay in the working tree, untouched. |
| The `.fix-c1.py` artifact in the working tree is a stale tool output from the previous duration-honesty session and could be accidentally staged. | ce-work treats it as a working-tree-only file; explicitly does not `git add` it. (Worth a one-line note to the founder post-commit asking whether to remove or `.gitignore`.) |

---

## Documentation / Operational Notes

- Per origin Success Criteria: after this slice ships, a future `ce-learnings-researcher` dispatch on "decision-debt sweep" or "markdown-as-API" or "test-skip discipline" should return the three new docs. No additional indexing is required; the existing `docs/solutions/` glob covers the new paths.
- The deferred trace-field-strip follow-up (Scope Boundaries → Deferred to Follow-Up Work) is worth a short brainstorm note when ready, not a full brainstorm-doc cycle — it's a ~10-20 LOC mechanical cleanup across 4 files. Suitable as a one-shot ce-work slice when the founder decides to schedule it.
- The `.fix-c1.py` file in the working tree at planning time is a leftover from the duration-honesty implementation session. Worth a separate cleanup question to the founder (out of scope here).
- No `docs/catalog.json` updates expected — pattern docs under `docs/solutions/` are not individually cataloged in the existing pattern (verified against `docs/solutions/2026-05-04-source-backed-content-depth-activation-pattern.md` which is also not in the catalog).
- No `AGENTS.md` updates expected — the slice doesn't change repo-wide read order, source-of-truth order, or operational constraints.
- No deploy / migration / feature-flag concerns. Pure docs + dead-code retirement.

---

## Sources & References

- **Origin document:** [docs/brainstorms/2026-05-25-triage-retire-and-compound-bundle-requirements.md](../brainstorms/2026-05-25-triage-retire-and-compound-bundle-requirements.md)
- **Originating ideation:** [docs/ideation/2026-05-25-triage-workflow-rebuild-or-retire-ideation.md](../ideation/2026-05-25-triage-workflow-rebuild-or-retire-ideation.md)
- **Upstream slice that created the cleanup opportunity:** [docs/plans/2026-05-24-001-feat-session-duration-honesty-plan.md](2026-05-24-001-feat-session-duration-honesty-plan.md) (commits `1944e48` → `8adefbd`)
- **Canonical pattern reference for U2:** [docs/solutions/architecture-patterns/d137-canonical-pre-run-spine-setup-safety-2026-05-07.md](../solutions/architecture-patterns/d137-canonical-pre-run-spine-setup-safety-2026-05-07.md)
- **Related pattern docs (sibling shape for U4):** [docs/solutions/2026-05-04-source-backed-content-depth-activation-pattern.md](../solutions/2026-05-04-source-backed-content-depth-activation-pattern.md), [docs/solutions/2026-05-10-drill-first-time-runnability-system.md](../solutions/2026-05-10-drill-first-time-runnability-system.md)
- **Target files:** `app/src/domain/generatedPlanDiagnosticTriage.ts`, `app/src/domain/__tests__/generatedPlanDiagnosticTriage.test.ts`, `docs/decisions.md`
- **Out-of-scope (deferred-follow-up) files:** `app/src/domain/sessionBuilder.ts:97-98,378-379`, `app/src/domain/generatedPlanDiagnostics.ts:163-167,707-721`, `app/scripts/validate-generated-plan-diagnostics-report.mjs:40-46`
