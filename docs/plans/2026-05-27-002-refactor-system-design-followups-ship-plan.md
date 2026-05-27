---
id: system-design-followups-ship-2026-05-27
title: "refactor: System-design follow-ups — implementation"
status: complete
stage: validation
type: plan
date: 2026-05-27
deepened: 2026-05-27
summary: "Implementation plan for the five actionable system-design follow-ups captured in `docs/plans/2026-05-27-001-refactor-system-design-followups-plan.md`. Ships U1 (split `patchReviewDraft` into per-owner APIs so Review's autosave cannot overwrite DrillCheck's captures — F1), U2 (collapse the duplicated `computeActualDurationMinutes` derivation in `useSessionRunner` into a `withActualDuration` helper — F7), U3 (two new `architecture:check` rules: `saveExecution` runner-only + `lib/` net-new-file allowlist — F2 + F5), and U4 (one-paragraph multi-tab limitation addendum to `local-first-pwa-constraints.md` — F6). F8 (zero-PII local error log) stays deferred per 001 — activation trigger is D91 reopen or stranger-cohort cycle. No product behavior changes; every unit is behavior-preserving or doc-only."
depends_on:
  - AGENTS.md
  - docs/catalog.json
  - app/README.md
  - docs/ops/app-architecture-guidance.md
  - docs/plans/2026-05-27-001-refactor-system-design-followups-plan.md
related:
  - docs/plans/2026-05-02-019-refactor-agent-architecture-cleanup-plan.md
---

# refactor: System-design follow-ups — implementation

## Overview

Ships the activated 2026-05-27 system-design follow-ups across four implementation units (after same-day revalidation deferred F8). Each unit is behavior-preserving or doc-only; no product behavior ships from this plan.

| Unit | Item(s) | Severity | Type |
|---|---|---|---|
| U1 | F1 — split `patchReviewDraft` by owner | P1 | code |
| U2 | F7 — `withActualDuration` single boundary | P2 | code |
| U3 | F2 + F5 — two `architecture:check` rules | P2 + P3 | tooling |
| U4 | F6 — multi-tab limitation addendum | P3 | doc-only |

F8 (zero-PII local error log) stays deferred per the 001 backlog plan — activation trigger is D91 reopen or stranger-cohort cycle. Not in this plan.

## Problem Frame

The 001 audit + revalidation confirmed the core v0b architecture is sound but identified five second-order risks that compound under contributor or scope growth. This plan turns each surviving risk into a concrete, scoped ship unit. Each unit is independent — they can ship in any order, with one recommended sequence below.

## Scope

- **In scope:** U1, U2, U3, U4.
- **Deferred to follow-up work:** F8 (error log) — captured in 001, activation-gated, not here.
- **Out of scope:** re-litigating the layer model, the `useSessionRunner` serial queue, the run-loop architecture, the schema-blocked overlay, `D118` durability copy, or any new product behavior. Also out of scope: refactoring `drillScores` ownership (lands with U1 only if it falls out naturally from the API split; otherwise stays untouched).

## Key Technical Decisions

- **Draft patch ownership is narrower than terminal review ownership.** U1 splits draft patch APIs so autosave / finish-later writes cannot cross owner boundaries, but terminal review submit remains the legitimate consolidation point for a completed review payload. The plan should preserve submit, expire, skip, and export behavior while making stale-capture overwrite risk explicit rather than pretending the draft split solves every terminal-path concern.
- **No public review-draft writer should casually span both owners.** If `saveReviewDraft` remains public after U1, its role must be documented as a compatibility / setup path rather than the preferred production write path; otherwise the split only moves the convention from controllers into service naming. Prefer removing or narrowing broad public write APIs when grep shows no production caller needs them.
- **Duration finalization stays a pure derivation helper, while timer lifecycle remains runner orchestration.** U2 may place `withActualDuration` in the domain layer only if it consumes a timer snapshot as data and does not own persistence or cleanup. `useSessionRunner` still owns the ordering of read timer -> derive final duration -> persist execution -> clear timer.
- **Architecture checks should encode policy with known parser limits.** U3 needs a named-binding-aware checker rule for `saveExecution`, plus explicit coverage choices for aliases, namespace imports, re-exports, tests, and allowlist root semantics. Advisory findings are enough; the value is making drift visible without pretending the checker is a full TypeScript compiler.
- **The multi-tab addendum accepts everyday write races; it does not use schema-upgrade safety as a proxy.** U4 should say clearly that `SchemaBlockedOverlay` covers upgrade blocking, while same-version multi-tab writes remain last-writer-wins under founder single-tab use.

## Units

### U1 — F1: Split `patchReviewDraft` by owner

**Goal.** Make it a compile error for `useReviewController` to write `perDrillCaptures`, and for `useDrillCheckController` to write `sessionRpe` / `incompleteReason` / form fields. The current `ReviewDraftPatch` union legitimately accepts both because the same function is called by both controllers (Review for the form, DrillCheck for the captures); the boundary is comment-only today.

**Files.**
- `app/src/services/review/drafts.ts` — split the public surface; keep the internal `if ('key' in patch)` merge logic intact.
- `app/src/services/review/index.ts` — re-export the two new functions.
- `app/src/screens/review/useReviewController.ts` — call `patchReviewForm` in autosave + `handleFinishLater`. Remove the load-bearing "intentionally omitted" comment (the type now does the work).
- `app/src/screens/drillCheck/useDrillCheckController.ts` — call `patchReviewCaptures` for capture writes.
- `app/src/services/__tests__/reviewDraftMerge.test.ts` — update any test patches that span both halves.
- `app/src/screens/__tests__/ReviewScreen.finish-later.test.tsx`, `DrillCheckScreen.perDrillCapture.test.tsx` — should not require behavioral changes; recompilation under the new types verifies the split.

**Approach.**

1. Introduce two narrower payload types in `drafts.ts`:
   ```ts
   export type ReviewFormPatch = Partial<{
     sessionRpe: number | null
     goodPasses: number
     totalAttempts: number
     borderlineCount: number | undefined
     incompleteReason: IncompleteReason | undefined
     quickTags: string[] | undefined
     shortNote: string | undefined
   }>

   export type ReviewCapturePatch = Partial<{
     perDrillCaptures: PerDrillCapture[] | undefined
   }>
   ```
2. Extract the existing merge body into a private helper:
   ```ts
   async function _patchReviewDraftInternal(
     execId: string,
     patch: ReviewFormPatch & ReviewCapturePatch,
   ): Promise<void> { /* current body */ }
   ```
3. Add two narrow-typed public wrappers:
   ```ts
   export async function patchReviewForm(execId: string, patch: ReviewFormPatch) {
     return _patchReviewDraftInternal(execId, patch)
   }
   export async function patchReviewCaptures(execId: string, patch: ReviewCapturePatch) {
     return _patchReviewDraftInternal(execId, patch)
   }
   ```
4. Mark the old `patchReviewDraft` `@deprecated` for one ship cycle, OR remove it if every internal caller migrates in this PR. Prefer removal — there is no external consumer to protect.
5. Decide the fate of `saveReviewDraft` in the same pass. If it remains exported for tests or legacy setup, document that it is not the production autosave/write surface; if no production caller needs the broad shape, narrow or remove it so the owner split is not bypassed by another public API.
6. Preserve terminal submit as the consolidation boundary: `submitReview` may still consume the completed review payload, including captures, because this plan targets draft patch ownership rather than changing review completion semantics.
7. Update the two controllers + the barrel export.

**Verification.**
- `npm run typecheck` clean.
- `npm run test src/services/review` green.
- `npm run test src/screens/__tests__/ReviewScreen.finish-later src/screens/__tests__/DrillCheckScreen.perDrillCapture` green.
- e2e (`npm run test:e2e -- e2e/session-flow.spec.ts`) green.
- Public API check: search production callers and confirm any remaining broad `saveReviewDraft` usage is test/setup compatibility only, or narrow/remove it in U1.
- Manual TS-only check: temporarily add `perDrillCaptures: []` to `useReviewController`'s autosave → typecheck must fail → revert.

**Done-when.** Both controllers compile under the narrowed types; the comment "intentionally omitted from the patch" is removed; `patchReviewDraft` and `saveReviewDraft` cannot remain preferred production write paths that accept both Review-owned fields and DrillCheck-owned captures; tests green.

---

### U2 — F7: `withActualDuration` single boundary

**Goal.** Collapse the duplicated "read timer -> derive `partialSeconds` -> set `actualDurationMinutes`" pattern from `useSessionRunner.advanceBlock` (last-block branch) and `useSessionRunner.endSession` into one pure derivation helper. This is a dedupe and reviewability refactor, not a broader move of terminal lifecycle orchestration out of the runner.

**Files.**
- `app/src/domain/executionState.ts` — add the pure helper.
- `app/src/hooks/useSessionRunner.ts` — replace the two inline blocks.
- `app/src/services/session/index.ts` ? re-export the new helper alongside the existing `computeActualDurationMinutes` (do **not** remove the lower-level function; existing duration formatting consumes stored `actualDurationMinutes` and legacy fallback behavior must remain intact).
- `app/src/domain/executionState.test.ts` — pure unit test for the new helper covering: timer matches exec / timer mismatches exec / timer is `null`.

**Approach.**

1. New helper (pure):
   ```ts
   export function withActualDuration(
     exec: ExecutionLog,
     plan: SessionPlan,
     timer: TimerState | null,
   ): ExecutionLog {
     const partialSeconds =
       timer?.executionLogId === exec.id ? timer.accumulatedElapsed : undefined
     return {
       ...exec,
       actualDurationMinutes: computeActualDurationMinutes(exec, plan, partialSeconds),
     }
   }
   ```
2. `useSessionRunner.advanceBlock` last-block branch becomes:
   ```ts
   const timer = onLastBlock && status === 'skipped' ? await readTimerState() : undefined
   const { execution: updated, isLast } = buildAdvancedBlock(exec, p, status)
   const finalized = isLast ? withActualDuration(updated, p, timer ?? null) : updated
   await persist(finalized)
   await clearTimerState()
   return isLast
   ```
3. `useSessionRunner.endSession` becomes:
   ```ts
   const timer = await readTimerState()
   const ended = withActualDuration(buildEndedSession(exec, reason), p, timer)
   await persist(ended)
   await clearTimerState()
   ```
4. The skip-of-last-block path (current `advanceBlock` carrying `partialSeconds` only when `onLastBlock && status === 'skipped'`) is preserved exactly.

**Verification.**
- `npm run typecheck` clean.
- `npm run test src/domain/executionState.test.ts` green, including new helper truth table.
- `npm run test src/hooks/useSessionRunner.test.ts` green — duration-honesty assertions pass unchanged.
- `npm run test src/services/__tests__/session.v0b.test.ts` green.
- `npm run test src/lib/__tests__/format.durationLine.test.ts` green.

**Done-when.** `useSessionRunner.ts` has zero direct references to `computeActualDurationMinutes`; both call sites use `withActualDuration`. The lower-level function stays exported for the fallback path.

---

### U3 — F2 + F5: `architecture:check` rule extensions

**Goal.** Two new advisory rules in `app/scripts/check-architecture-boundaries.mjs`:
- `saveExecutionRunnerOnly` (F2) — flag any import of `saveExecution` from outside `hooks/useSessionRunner.ts`.
- `libNewTopLevelFile` (F5) — flag any net-new top-level file in `app/src/lib/` against a committed allowlist.

**Files.**
- `app/scripts/check-architecture-boundaries.mjs` — extend the `rules` object and the scan loop.
- `app/scripts/architecture-check-lib-allowlist.json` (new) — generated from the current `app/src/lib/` top-level tree.
- `docs/ops/app-architecture-guidance.md` §Current Cleanup Queue — document the new rules + the allowlist regeneration command.

**Approach.**

1. Add `saveExecutionRunnerOnly` rule:
   ```js
   saveExecutionRunnerOnly: {
     level: 'advisory',
     message: '`saveExecution` must only be imported from hooks/useSessionRunner.ts (serial-queue invariant).',
   },
   ```
   Detection: extend the import scan beyond module specifiers so the checker can see bindings. Coverage policy: flag named imports of `saveExecution`, including aliases; flag namespace imports from the session barrel outside the runner because they can access `saveExecution`; flag re-exports that expose `saveExecution`; keep the existing test/fixture ignore behavior unless the checker self-test explicitly opts fixtures back in.
2. Generate the lib allowlist once:
   ```bash
   ls app/src/lib/*.{ts,tsx} 2>/dev/null \
     | xargs -n1 basename \
     | jq -R . \
     | jq -s '{"top_level": .}' \
     > app/scripts/architecture-check-lib-allowlist.json
   ```
   (Or equivalent — committed alongside the rule.)
3. Add `libNewTopLevelFile` rule:
   ```js
   libNewTopLevelFile: {
     level: 'advisory',
     message: 'Net-new top-level files in app/src/lib/ should land in an existing layer; update the allowlist explicitly to override.',
   },
   ```
   Detection: at file-discovery time, every top-level `app/src/lib/*.{ts,tsx}` checked against the allowlist; emit a finding for any not present. Resolve the allowlist path against the checker root so `--root` and self-test fixtures behave predictably.
4. Document both rules + the allowlist regeneration command in §Current Cleanup Queue of `app-architecture-guidance.md`.

**Verification.**
- `npm run architecture:check` runs clean against the current tree (no false positives).
- Durable regression check: extend the checker self-test (or equivalent scripted fixture) so a non-runner `saveExecution` import reports, `hooks/useSessionRunner.ts` is allowed, an allowlisted top-level `app/src/lib/` file is silent, and an unallowlisted top-level `app/src/lib/` file reports.
- Manual regression checks may still be used while developing the rule, but the plan should not rely on temporary edits as the only proof.
- `bash scripts/validate-agent-docs.sh` passes after the ops-doc edit.

**Done-when.** Both rules fire correctly under synthetic regressions and stay silent on the current tree. Allowlist is committed.

---

### U4 — F6: Multi-tab limitation addendum (doc-only)

**Goal.** One-paragraph addendum to `docs/research/local-first-pwa-constraints.md` accepting the multi-tab everyday-write limitation under current use and naming the re-evaluation trigger.

**Files.**
- `docs/research/local-first-pwa-constraints.md` — new subsection or paragraph in the appropriate sync / multi-tab section.

**Approach.** Write a paragraph that names:
1. What is modeled today: schema-upgrade races handled via `db.on('versionchange' | 'blocked')` + `SchemaBlockedOverlay`.
2. What is **not** modeled today: multi-tab non-schema writes (concurrent draft mutation, simultaneous run starts, two tabs racing `saveExecution`).
3. Why it's accepted under current use: courtside / founder use is single-tab. Schema-upgrade races are bounded by the overlay, but ordinary same-version writes are not; concurrent draft mutation, simultaneous run starts, and two tabs racing `saveExecution` remain accepted last-writer-wins limitations until the trigger below fires.
4. The re-evaluation trigger: stranger-cohort use, shared-device cycle, or any UX that asks the user to open the PWA in a second tab.
5. Future implementation note: `BroadcastChannel('volleycraft')` carrying `session_started` / `draft_mutated` events is one likely path if/when needed, but the actual follow-up must include merge/version conflict handling rather than notifications alone.

**Verification.**
- `bash scripts/validate-agent-docs.sh` passes (frontmatter still valid).
- The paragraph cross-links to `app/src/db/schema.ts` (`versionchange` / `blocked` handlers) for grounding.

**Done-when.** The addendum is in place and the re-evaluation trigger is named explicitly.

---

## System-Wide Impact

- **Interaction graph:** U1 affects draft autosave in `useReviewController`, per-drill capture writes in `useDrillCheckController`, and the review service barrel. It must not change terminal submit, expire, skip, or export flows except to make their ownership assumptions clearer.
- **Error propagation:** U2 keeps finalization persistence and timer cleanup in `useSessionRunner`; failures should still surface through the existing runner paths, with timer cleanup happening only after the finalized execution write succeeds.
- **State lifecycle risks:** U1 prevents Review-vs-DrillCheck draft overwrites but does not solve two tabs writing the same owner-owned payload. U2 preserves the accepted stale-timer risk if execution persistence succeeds and timer cleanup later fails.
- **API surface parity:** Broad review-draft APIs (`patchReviewDraft`, `saveReviewDraft`) are the main parity risk; the implementation should leave no preferred production write path that accepts both Review-owned fields and DrillCheck-owned captures.
- **Integration coverage:** U1 needs service-level merge preservation plus controller-level autosave/capture coverage; U2 needs runner coverage for terminal paths and downstream duration readers; U3 needs checker self-test or equivalent regression coverage for both new advisory rules.
- **Unchanged invariants:** The local-first storage model, Dexie schema version, run-loop serial queue, terminal record refusal behavior, and current single-tab founder-use assumption remain unchanged.

---

## Test plan

Per-unit verification lives inside each unit. A holistic post-ship gate runs from the repo root (WSL):

```bash
cd app && npm run typecheck && npm run lint && npm test
cd app && npm run architecture:check
bash scripts/validate-agent-docs.sh
```

E2E (`npm run test:e2e`) is recommended after U1 and U2 to confirm the run + review + capture flows still pass end-to-end. U3 and U4 don't touch runtime behavior.

## Sequencing

Recommended order (each unit is independent; any order works):

1. **U1** (F1 capture-ownership API split) — highest signal-to-effort; prevents silent data loss.
2. **U2** (F7 `withActualDuration`) — behavior-preserving refactor with cohesion win.
3. **U3** (F2 + F5 `architecture:check` rules) — pure tooling; ship as one PR.
4. **U4** (F6 multi-tab limitation doc) — fastest; can ship anytime.

A reasonable two-PR bundle:
- **PR 1:** U1 + U2 (code refactors). Verified by typecheck + unit + RTL + e2e.
- **PR 2:** U3 + U4 (tooling + doc). Verified by `architecture:check` + `validate-agent-docs.sh`.

## Risk register

| Risk | Unit | Mitigation |
|---|---|---|
| External test files still call `patchReviewDraft` directly. | U1 | Grep for callers before removal; keep `@deprecated` alias for one cycle if grep finds any. |
| The `withActualDuration` extraction subtly changes the timer-read ordering in `advanceBlock`. | U2 | The helper is purely the `actualDurationMinutes` assignment; `clearTimerState` stays in the runner; runner tests guard the lifecycle. |
| `architecture:check` allowlist drifts when files are renamed without updating it. | U3 | Document the regeneration command in §Current Cleanup Queue; rules are `advisory` so they surface drift without blocking. |
| U4's addendum reads as "BroadcastChannel coming soon." | U4 | Explicit "deferred unless trigger fires" language; cite the trigger conditions. |

## Post-ship

When all four units ship:
- Update `docs/plans/2026-05-27-001-refactor-system-design-followups-plan.md` to mark F1, F2, F5, F6, and F7 shipped by this implementation plan, while leaving F8 deferred with its activation trigger.
- Do not add `canonical_successor` to a `complete`/`active_registry` catalog entry. If 001 is later marked `superseded`, move or catalog F8 into a separate future backlog route first, then add successor metadata under the repo doc rules.
- Mark this plan status `complete` and set `active_registry: true` in the catalog only after all four units ship.
- Update the Current Cleanup Queue bullet in `docs/ops/app-architecture-guidance.md` to reflect shipped status.

## Related

- `docs/plans/2026-05-27-001-refactor-system-design-followups-plan.md` — the audit + revalidated backlog this plan implements.
- `docs/plans/2026-05-02-019-refactor-agent-architecture-cleanup-plan.md` — precedent for architecture-cleanup plans.
- `docs/ops/app-architecture-guidance.md` §Layer Model, §Anti-Patterns — the durable rules these units encode mechanically.
