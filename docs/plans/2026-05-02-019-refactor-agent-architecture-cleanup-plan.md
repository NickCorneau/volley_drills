---
id: agent-architecture-cleanup-plan-2026-05-02
title: "refactor: Agent architecture cleanup pass"
status: complete
stage: validation
type: plan
date: 2026-05-02
summary: "Bounded architecture cleanup plan that makes app layer-boundary debt reportable, moves safe product type imports toward model, records a canonical cleanup queue, and avoids risky generated-diagnostics or data-monolith splits in the first pass."
depends_on:
  - AGENTS.md
  - docs/catalog.json
  - app/README.md
  - docs/ops/app-architecture-guidance.md
  - .cursor/rules/data-access.mdc
  - .cursor/rules/component-patterns.mdc
  - .cursor/rules/testing.mdc
---

# refactor: Agent architecture cleanup pass

## Overview

This plan turns the requested deep architecture, simplicity, red-team, DRY, and SOLID review into a bounded first cleanup pass for the `app/` workspace and its agent-facing docs. The goal is not to rewrite the codebase in one sweep. The goal is to make the existing architecture easier for future agents to discover, verify, and follow without adding a new framework or masking risky refactors behind broad churn.

The research pass found that the repo already has strong architecture guidance in `docs/ops/app-architecture-guidance.md`, but some of its rules are not mechanically visible. It also found several high-risk cleanup opportunities, especially generated diagnostics and catalog/session assembly data, that should be staged behind stronger guardrails before any large split.

---

## Problem Frame

Future agents can currently read the right architectural intent, but they still have to manually infer whether the working tree follows it. That makes cleanup work expensive: agents must load broad files, distinguish durable architecture rules from historical comments, and avoid copying older patterns that predate the controller/model split.

This pass should reduce that cognitive load by making layer boundaries reportable, moving low-risk type imports toward `model/`, pruning only opportunistic comment noise in files already touched for another reason, and adding one canonical cleanup queue in the architecture guide.

---

## Requirements Trace

- R1. Preserve the existing layer model: `data` / `model` / `domain` / `services` / `hooks` / `controllers` / `screens` and `components`, with `platform` and `contracts` at their documented boundaries.
- R2. Make architecture-boundary debt visible through a report-mode check before attempting hard enforcement.
- R3. Reduce scan cost only where cleanup is low-risk and already adjacent to implementation work; do not make comment pruning the center of the pass.
- R4. Move low-risk product type imports away from legacy `db` barrels where the file is not actually doing persistence work.
- R5. Capture high-risk follow-up refactors, especially generated diagnostics and e2e seeding helper consolidation, without starting them in this first pass.
- R6. Keep verification at the lowest useful tier: script checks for tooling, typecheck/focused tests for import cleanup, doc validation for routing, and browser testing only when user-visible run or modal surfaces are touched.

---

## Scope Boundaries

- In scope: report-mode architecture boundary tooling, package script wiring, focused docs/catalog updates, safe type-only import cleanup, and opportunistic comment pruning only in files already touched for implementation.
- Out of scope: splitting `generatedPlanDiagnosticTriage.ts`, splitting `drills.ts`, broad controller extraction, new state-management libraries, repositories, codegen, visual redesign, Dexie schema changes, generated diagnostics behavior changes, and broad format-only cleanup.

### Deferred to Follow-Up Work

- Generated diagnostics split: move dated decision packets and hardcoded payloads out of `app/src/domain/generatedPlanDiagnosticTriage.ts` in a separate characterization-heavy pass.
- E2E IndexedDB helper consolidation: add shared seeding helpers separately, including a `test-fixture-boundary` report family if screen/component tests keep copying direct DB patterns.
- Session assembly selection-policy home: centralize D01/D47/D48/D49 exceptions only if catalog-gap work keeps growing.
- Non-run-loop controller extraction: still P3 unless a concrete screen change proves orchestration duplication.
- Hard CI enforcement: enable only after baseline findings are clean, allowlisted, or budgeted.

---

## Context & Research

### Relevant Code and Patterns

- `docs/ops/app-architecture-guidance.md` owns the architecture layer model, DRY/OCP posture, SOLID/DIP posture, review gates, and cold-start path.
- `.cursor/rules/data-access.mdc` documents hard layer rules, including no `db/` imports in screens/components and no `db`, `services`, React, or `platform` imports in domain.
- `.cursor/rules/component-patterns.mdc` owns the thin-screen/controller pattern and shared UI primitive usage.
- `.cursor/rules/testing.mdc` owns the lowest-useful-tier testing policy.
- `app/README.md` gives the current app status and fast app architecture scan for future agents.
- `docs/plans/2026-04-26-app-architecture-pass.md` records the completed architecture systematization pass and its P3 follow-ups.
- `app/package.json` already has script slots for focused validation; adding a report-mode architecture script fits this pattern.

### Institutional Learnings

- No active `docs/solutions/` learning files were found for this repo.
- Durable guidance instead lives in `docs/ops/app-architecture-guidance.md`, `.cursor/rules/`, `app/README.md`, and the completed architecture pass.
- The strongest prior lesson is to avoid architecture theater: no repositories, global state framework, or codegen until duplication pressure proves the need.

### External References

- Not used. Local architecture guidance and reviewer findings are specific enough for this cleanup pass.

---

## Key Technical Decisions

- Start with report-mode boundary checking, not hard failure: the working tree is dirty and some existing debt may be intentional or deferred.
- Prefer a small Node script over ESLint restrictions for this pass: it can emit grouped, actionable findings without changing existing lint behavior.
- Include a regression contract even in report mode: new findings in touched files should be fixed or justified, and strict/baseline mode is future work after the first report exists.
- Define `lib/` as a legacy/mixed helper area for this pass, not a new architecture layer. Touch `lib/` only for clear product-type import cleanup, and record deeper ownership cleanup as follow-up.
- Narrow browser-runtime scanning at first: flag `navigator.vibrate` and wake-lock usage outside `platform` or known platform-owned implementation files; do not treat every `navigator.storage` read as product-runtime debt.
- Keep UI cleanup behavioral-neutral: only delete/compress comments classified as history-only or duplicated in docs, and preserve comments that encode current accessibility/layout invariants.

---

## Open Questions

### Resolved During Planning

- Should this pass attempt the generated diagnostics split now? No. Reviewers agreed it is high value but high blast radius; this first pass should create guardrails and record a follow-up.
- Should architecture rules become hard CI failures immediately? No. Start report-mode, then tighten after the report is clean, allowlisted, or budgeted.
- Should screen/controller extraction be broadened now? No. Existing docs classify non-run-loop extraction as P3 unless concrete duplication proves it.
- Should a new durable review doc be created? No by default. The canonical cleanup queue belongs in `docs/ops/app-architecture-guidance.md`; this plan can provide execution detail.

---

## Implementation Units

- [x] U1. **Add report-mode architecture boundary check**

**Goal:** Give future agents a fast command that reports layer-boundary debt without changing app behavior or blocking existing lint.

**Requirements:** R1, R2, R6

**Dependencies:** None

**Files:**

- Create: `app/scripts/check-architecture-boundaries.mjs`
- Modify: `app/package.json`

**Approach:**

- Scan non-test `app/src/**/*.{ts,tsx}` files with static import parsing sufficient for ordinary `import` statements.
- Report hard rule families first: domain importing forbidden outer layers, model importing React/Dexie/services/platform, platform importing product layers, screens/components importing `db`, and direct vibration/wake-lock runtime calls outside `platform` or known platform-owned implementation files.
- Treat screen/component `services` imports as advisory follow-up debt, not a primary violation, because non-run-loop controller extraction remains P3.
- Treat tests as out of scope for the first script, but document a future `test-fixture-boundary` report family for screen/component tests that copy DB fixture setup.
- Emit grouped output with rule id, severity/advisory level, file path, and import/call evidence.
- Exit non-zero only for script defects or an explicit future strict flag, not for existing findings.

**Known baseline contract:**

- Default report mode is informational.
- New findings in files touched by a future change should be fixed or justified in that change.
- Strict mode, baselines, or max-finding budgets are deferred until the first report has proven useful.

**Patterns to follow:**

- `app/scripts/validate-generated-plan-diagnostics-report.mjs` for script style and `package.json` command wiring.
- `.cursor/rules/data-access.mdc` for the first rule set.

**Test scenarios:**

- Happy path: a synthetic domain file importing from `model` reports no finding.
- Error path: a synthetic domain file importing from `services` reports the correct rule id and path.
- Error path: a synthetic component importing from `db` reports a screen/component boundary finding.
- Edge case: a synthetic screen importing a service is advisory, not a hard boundary finding.
- Edge case: known platform-owned files do not produce noisy wake-lock/vibration findings.

**Verification:**

- The command produces a readable architecture-boundary report from `app/`.
- Existing lint/test scripts remain unchanged except for the added script entry.

---

- [x] U2. **Move low-risk type imports to model**

**Goal:** Reduce reliance on the legacy `db` barrel in runtime code where files only need product types.

**Requirements:** R1, R4, R6

**Dependencies:** U1

**Files:**

- Modify: selected files under `app/src/components/` and `app/src/hooks/` that import type-only product shapes from `app/src/db`.
- Modify: selected `app/src/lib/` helpers only when the helper is clearly formatting/product-type code and not persistence/platform code.
- Test: existing focused tests for touched files, plus typecheck.

**Approach:**

- Search for `from '../db'`, `from '../../db'`, and equivalent `db` imports in non-service runtime code.
- Change only imports that are type-only or product-type-only to the corresponding `model` import.
- Leave persistence code, service code, schema code, platform-owned browser helpers, and fixture-heavy tests alone.

**Patterns to follow:**

- `docs/plans/2026-04-26-app-architecture-pass.md` U10, which already fixed controller type imports from `db` to `model`.

**Test scenarios:**

- Happy path: touched files typecheck with imports coming from `model`.
- Edge case: no service/schema/test fixture loses access to row-specific persistence types.
- Edge case: no `lib/` helper is moved into architecture enforcement unless its ownership is clear.

**Verification:**

- Typecheck or focused tests prove the moved imports still resolve.
- The architecture-boundary report has fewer product-type import findings after the change.

---

- [x] U3. **Prune stale implementation-history comments opportunistically**

**Goal:** Make future-agent code reading faster only where the implementation is already being touched and comment cleanup is obviously safe.

**Requirements:** R3, R6

**Dependencies:** U2

**Files:**

- Modify: files already touched by U2 if they contain stale history-only comments.
- Optional modify: `app/src/components/SkipReviewModal.tsx` or `app/src/components/ui/Button.tsx` only if the pass touches them for another reason or the stale comments are isolated enough to remove without behavior churn.

**Approach:**

- For each removed comment, classify it before deletion as `history-only`, `duplicated-in-docs`, or `current-invariant`.
- Delete only `history-only` or clearly `duplicated-in-docs` comments.
- Preserve or relocate current invariants for dialog role, initial focus, focus trap, Escape close, focus restore, touch target, focus-visible, disabled state, and pinned layout behavior.
- Do not change JSX, class names, props, copy, or event handlers as part of this unit.

**Patterns to follow:**

- `.cursor/rules/component-patterns.mdc` for what belongs in code comments versus shared primitives/docs.

**Test scenarios:**

- Test expectation: none for pure comment deletion; run existing focused tests when a touched file has behavioral coverage.

**Verification:**

- Diff is limited to comment deletion/compression in this unit.
- No component semantics, styles, or accessibility behavior are altered.

---

- [x] U4. **Document the canonical cleanup queue for future agents**

**Goal:** Convert the deep architecture/simplicity findings into one durable, discoverable follow-up list so future agents do not re-derive the same audit.

**Requirements:** R2, R5

**Dependencies:** U1

**Files:**

- Modify: `docs/ops/app-architecture-guidance.md`
- Modify: `docs/catalog.json`

**Approach:**

- Add a short dated cleanup queue to the architecture guide with owner/status/sunset guidance.
- Point to this plan for execution detail, but keep the architecture guide as the canonical queue after the pass lands.
- Name deferred high-risk refactors without duplicating all review evidence.
- Catalog this plan and preserve `docs/ops/app-architecture-guidance.md` as the canonical app architecture route.

**Patterns to follow:**

- `docs/ops/agent-documentation-contract.md` for routing-critical doc updates.

**Test scenarios:**

- Happy path: docs/catalog metadata points future agents to the active cleanup plan.
- Error path: doc validation catches malformed frontmatter or catalog drift.

**Verification:**

- Agent doc validation passes.
- Future app-work cold start surfaces the cleanup queue through `docs/ops/app-architecture-guidance.md` without requiring agents to rediscover the audit.

---

## Browser Verification Matrix

- If `RunScreen`, `ActionOverlay`, modal stack files, or user-visible Run controls are touched: run one mobile-width browser smoke. Expected observations: session can reach Run, Run face remains visible, pause/resume still works, end/skip modal opens, safe-primary focus behavior remains intact, Escape/cancel closes, destructive confirm remains reachable, and footer stays pinned.
- If only script, docs, package script, and type-import/comment-only edits outside Run/modal surfaces land: document why browser smoke is skipped and rely on script/typecheck/focused tests.

---

## System-Wide Impact

- **Interaction graph:** No runtime route, Dexie, timer, review, or generated-diagnostics behavior should change in this first pass.
- **Error propagation:** The new architecture script reports findings; it does not alter app error handling.
- **State lifecycle risks:** None expected; no persistence schema or service transaction changes are in scope.
- **API surface parity:** The `model` import move should preserve existing exported types and public component props.
- **Integration coverage:** Script checks, typecheck, focused tests, and conditional browser smoke are enough for this first pass.
- **Unchanged invariants:** Local-first Dexie behavior, P12 screen contracts, route paths, Run timer mechanics, generated diagnostics output, and catalog/session assembly logic remain unchanged.

---

## Risks & Dependencies

| Risk                                                                    | Mitigation                                                                                                                                 |
| ----------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| Boundary script false positives create noise for agents                 | Start report-mode, group findings by rule, and document advisory findings and known platform-owned files.                                  |
| Non-blocking report becomes ignored noise                               | Add a baseline contract: touched-file findings should be fixed or justified; strict/budget mode follows later.                             |
| `lib/` becomes an architecture escape hatch                             | Treat `lib/` as legacy/mixed in this pass; touch only clearly owned product-type helpers and record deeper ownership cleanup as follow-up. |
| Type-import cleanup accidentally touches persistence-specific row types | Limit to product-shaped type imports in runtime code; leave services, schema, platform-owned helpers, and fixture tests alone.             |
| Comment pruning removes useful invariants                               | Classify comments before deletion and preserve accessibility/layout/current-behavior comments.                                             |
| Docs/catalog update creates routing drift                               | Update frontmatter and `docs/catalog.json` in the same pass and run agent-doc validation.                                                  |
| Dirty working tree causes accidental broad churn                        | Use focused edits only and avoid format-only changes across unrelated files.                                                               |

---

## Alternative Approaches Considered

- Hard ESLint enforcement immediately: rejected for this pass because the dirty branch likely has known debt and false positives that should be reported before enforced.
- Split generated diagnostics first: rejected because the file is high blast radius and already under active generated-diagnostics work; a separate plan should handle it with characterization tests.
- Broad controller extraction: rejected because the prior architecture pass recorded it as P3 unless concrete orchestration duplication appears.
- Separate cleanup review doc: rejected for this pass because it would add another durable surface; the architecture guide should own the cleanup queue.
- Pure documentation-only cleanup: rejected because the strongest agent ergonomic gap is that architecture rules are readable but not quickly reportable.

---

## Success Metrics

- A future agent can run one app command and see architecture-boundary findings grouped by rule and advisory level.
- New findings in touched files have a clear fix-or-justify contract.
- The app architecture guide names the next cleanup queue without requiring agents to rediscover the same audit.
- The first pass lands without generated diagnostics, Dexie schema, route, or timer behavior changes.

---

## Documentation / Operational Notes

- Catalog this plan in `docs/catalog.json`.
- Run `bash scripts/validate-agent-docs.sh` after docs/catalog changes.
- Run the narrowest relevant app checks after implementation.
- Run browser smoke only under the trigger conditions in the Browser Verification Matrix.

---

## Sources & References

- User request: deep architecture, simplicity, red-team, DRY, SOLID cleanup for future-agent usability.
- Related architecture guide: `docs/ops/app-architecture-guidance.md`
- Related app status: `app/README.md`
- Related completed pass: `docs/plans/2026-04-26-app-architecture-pass.md`
- Layer rules: `.cursor/rules/data-access.mdc`
- Component rules: `.cursor/rules/component-patterns.mdc`
- Testing rules: `.cursor/rules/testing.mdc`
