---
id: d139-validator-script-ci-gating-plan-2026-05-07
title: "D139 Validator Script CI Gating"
type: ops
status: complete
stage: validation
date: 2026-05-07
last_updated: 2026-05-07
authority: "Implementation plan for D139 — gate `architecture:check --strict`, `typography:guardrails:check`, and `diagnostics:report:check` in `app-ci.yml`. No npm-script compression."
depends_on:
  - docs/decisions.md
  - docs/plans/2026-05-05-001-merge-focus-coverage-and-collapse-branches-plan.md
  - docs/plans/2026-05-06-001-refactor-d137-tune-today-routing-cleanup-plan.md
  - docs/plans/2026-05-07-001-engine-two-pass-band-relax-plan.md
  - docs/plans/2026-05-07-002-d138-diagnostic-spine-canonicality-plan.md
  - docs/status/current-state.md
summary: "Resolve the D139 slot reserved by D137. Add `architecture:check -- --strict`, `typography:guardrails:check`, and `diagnostics:report:check` as CI gates in `.github/workflows/app-ci.yml`'s `build-and-lint` job. No npm-script compression. Total CI overhead ~1.1s. Zero code change, zero docs-routing change."
---

# D139 Validator Script CI Gating

## Summary

`D137` reserved `D139` for "validator script gating or compression." Investigation showed four validator-style scripts beyond `tsc -b` / `eslint` / `vitest` / `npm run build` / `prettier --check` / Playwright. Two are already gated in `.github/workflows/agent-validation.yml`. The other three (`architecture:check`, `typography:guardrails:check`, `diagnostics:report:check`) are sub-second, all green today, and run only in local development. This plan promotes them to CI gates in `app-ci.yml`.

The "compression" angle was investigated and dismissed as a no-op: `diagnostics:triage:check` is byte-identical to `diagnostics:report:check` because the underlying script validates both report and triage in one invocation, but the alias exists for keyword discoverability and harms nothing.

---

## Problem Frame

### Validator-style scripts in this repo

| Script | Path | Runtime | Gated pre-D139? |
| --- | --- | --- | --- |
| `bash scripts/validate-agent-docs.sh` | `scripts/validate-agent-docs.sh` | ~400ms | YES (`agent-validation.yml`) |
| `bash scripts/test-validate-agent-docs.sh` | `scripts/test-validate-agent-docs.sh` | ~ms-range | YES (`agent-validation.yml`) |
| `npm run architecture:check[ -- --strict]` | `app/scripts/check-architecture-boundaries.mjs` | ~350ms | NO |
| `npm run typography:guardrails:check` | `app/scripts/validate-typography-guardrails.mjs` | ~80ms | NO |
| `npm run diagnostics:report:check` | `app/scripts/validate-generated-plan-diagnostics-report.mjs` | ~650ms | NO |
| `npm run diagnostics:triage:check` | (alias of above) | ~650ms | NO (byte-identical) |
| `npm run audit:coverage` | `app/scripts/generate-coverage-report.ts` | report regenerator (write-only) | N/A — paired snapshot test in `app/src/data/__tests__/focusCoverageAudit.test.ts` is the gate |

### What "gating / compression" means in scope

`D137`'s row in `docs/decisions.md` reserves `D139` with the phrase "validator script gating or compression." The 2026-05-06 D137 brainstorm at `docs/brainstorms/2026-05-06-001-d137-tune-today-routing-resolution-requirements.md` (KD7) sharpens it: "Whether architecture, typography, or diagnostics scripts become CI gates becomes D139." The agent-doc validator is already gated, so this scope is specifically the three app-side scripts.

### Why all three pass today and yet aren't gated

Historical accident, not deliberate policy:
- `architecture:check` (added during the 2026-04-28 architecture pass U10) was authored as an advisory tool first; its `--strict` mode existed for opt-in CI use but was never wired up.
- `typography:guardrails:check` (added during the 2026-05-03 typography system plan) was authored as a developer-facing reminder; CI gating wasn't asserted in the plan.
- `diagnostics:report:check` (added during the 2026-05-01 generated-plan-diagnostics plan) shipped with `:update` for human use; the freshness check was always intended to be a CI gate but never landed.

### Compression investigation

`app/package.json` contains:

```json
"diagnostics:report:check": "node scripts/validate-generated-plan-diagnostics-report.mjs",
"diagnostics:triage:check": "node scripts/validate-generated-plan-diagnostics-report.mjs",
"diagnostics:report:update": "node scripts/validate-generated-plan-diagnostics-report.mjs --write",
```

`:check` and `:triage:check` are byte-identical. The underlying script validates BOTH the report (`docs/reviews/2026-05-01-generated-plan-diagnostics-report.md`) AND the triage (`docs/reviews/2026-05-01-generated-plan-diagnostics-triage.md`) in one run. The alias exists because the triage workflow landed after the report and the alias makes both surfaces discoverable by keyword. Removing the alias would touch every plan / brainstorm / review that names `diagnostics:triage:check` — a churn cost with no behavior payoff. Keep both; gate one.

---

## Requirements

**CI gating**
- R1. `architecture:check -- --strict` runs as a CI step in `.github/workflows/app-ci.yml`'s `build-and-lint` job after `lint`. Strict mode fails on `level: 'error'` findings only; existing `screenComponentServiceImport` advisories (level `advisory`) report but do not fail.
- R2. `typography:guardrails:check` runs as a CI step in the same job, immediately after R1.
- R3. `diagnostics:report:check` runs as a CI step in the same job, immediately after R2 and before `npm test`. The single invocation validates both the report and the triage.
- R4. Step ordering is cheap-to-expensive: `lint` → `architecture:check (--strict)` → `typography:guardrails:check` → `diagnostics:report:check` → `npm test` → `npm run build` → prettier check.

**No new gates outside `app-ci.yml`**
- R5. `agent-validation.yml` is unchanged — it already gates `scripts/validate-agent-docs.sh` and `scripts/test-validate-agent-docs.sh`.
- R6. No pre-commit hook, husky, or lefthook is added — Cursor-first repo, no opt-in local hook system today, founder-use mode prefers post-push CI feedback over pre-commit friction.

**No npm-script compression**
- R7. `diagnostics:triage:check` is preserved as a byte-identical alias for `diagnostics:report:check`. The underlying script's two-line success output ("Generated plan diagnostics report is current. / Generated plan diagnostics triage is current.") makes the dual-validation explicit at the command line; the alias gives keyword discoverability for the triage surface.

**Strict-mode advisory preservation**
- R8. `architecture:check`'s 21 existing `screenComponentServiceImport` advisories continue to report (visible in CI logs) without failing the gate. Promoting any to `error` level is out of scope for `D139`; the controller-debt triage that would flip them is its own future work.

**Friction acknowledgement**
- R9. The plan documents that `diagnostics:report:check` is content-coupled — drill-catalog or generator changes that drift the committed report require running `npm run diagnostics:report:update` before pushing. This is already documented in plan flows (e.g., `docs/plans/2026-05-04-003-feat-d50-advanced-passing-depth-plan.md`, `docs/plans/2026-05-04-004-feat-d51-beginner-serving-tactical-zone-depth-plan.md`); the gate makes the freshness contract enforced rather than aspirational.

**Documentation surface**
- R10. `docs/decisions.md` adds a `D139` row recording the gating decision and the no-compression finding.
- R11. `docs/status/current-state.md` records the change as a Recent Shipped History entry.
- R12. `docs/catalog.json` registers this plan with `active_registry: true`.
- R13. The 2026-05-05 merge plan is NOT updated — `D139` was reserved by `D137`, not tracked as a 2026-05-05 merge follow-up.

---

## Approach

Single-file ops change. `.github/workflows/app-ci.yml`'s `build-and-lint` job gains three new steps between `Lint` and `Test`. No code change. No npm-script change. No docs routing change.

Why three separate steps rather than one combined step:
- GitHub Actions UI shows step names individually. A combined step like `node scripts/check-architecture-boundaries.mjs --strict && node scripts/validate-typography-guardrails.mjs && node scripts/validate-generated-plan-diagnostics-report.mjs` would log all three under one collapsed step, making failures harder to attribute at a glance.
- Step-level failure attribution matters more than the ~50ms saved by combining. CI overhead today is ~1.1s; the marginal cost of three steps over one is dominated by Node startup, which would be paid anyway.

Why `--strict` for architecture and not bare:
- Bare `architecture:check` exits 0 even when `level: 'error'` findings exist (it always reports, never fails). The advisory layer (`screenComponentServiceImport`) is always tolerated in either mode; the difference is that `--strict` flips errors from "report-only" to "exit 1".
- The script's own self-test exercises strict-mode failure paths via fixtures, so we know the strict path works.

Why `diagnostics:report:check` over `:triage:check`:
- They're identical. The `:report` name is the canonical handle in the script's filename and matches the markdown report's primary identity. Pick one for CI consistency; choose the canonical name.

---

## Acceptance Criteria

- [x] R1 / R2 / R3 / R4: three new steps land in `.github/workflows/app-ci.yml`'s `build-and-lint` job in the cheap-to-expensive order.
- [x] R5: `agent-validation.yml` unchanged.
- [x] R6: no pre-commit / husky / lefthook added.
- [x] R7: `diagnostics:triage:check` preserved as byte-identical alias.
- [x] R8: existing 21 `screenComponentServiceImport` advisories continue to report without failing CI.
- [x] R9: friction documented in this plan + `D139` row.
- [x] R10 / R11 / R12 / R13: decisions, status, catalog updated; merge plan untouched.
- [x] All three gates pass green locally:
  - `npm run architecture:check -- --strict` exits 0
  - `npm run typography:guardrails:check` exits 0
  - `npm run diagnostics:report:check` exits 0
- [x] `bash scripts/validate-agent-docs.sh` passes.
- [x] Full test suite remains 150/150 files / 2116/2116 tests.

---

## Out of Scope

- **Promoting `screenComponentServiceImport` from advisory to error.** Separate controller-debt triage. The 21 current advisories are documented in `docs/ops/app-architecture-guidance.md` as known controller-debt that hasn't been refactored to thread services through controllers yet. `D139` deliberately preserves the advisory tier.
- **Adding a pre-commit hook (husky, lefthook, etc).** Cursor-first repo with single-branch flow on `main`; founder-use mode prefers fast push + CI feedback over pre-commit friction. If the founder later opts into a local hook system, that is its own decision row.
- **Compressing the `diagnostics:triage:check` alias.** Byte-identical to `:report:check`; alias exists for keyword discoverability; removal has churn cost (every plan / brainstorm / review naming it would need updating) without behavior payoff.
- **Adding `audit:coverage` as a CI gate.** It's a write-only report regenerator; the freshness contract is already enforced by the snapshot test in `app/src/data/__tests__/focusCoverageAudit.test.ts`, which `npm test` already gates.
- **Changing the `paths` filter on `app-ci.yml`.** Existing filter (`app/**`, `package.json`, `.env.example`, `SECURITY.md`, `.cursor/mcp.json`, `README.md`, `.github/workflows/app-ci.yml`) already triggers when the validator scripts under `app/scripts/` change.
- **Adding new validator scripts.** Out of scope — `D139` is about gating what exists.

---

## Risks and Mitigations

| Risk | Mitigation |
| --- | --- |
| Founder pushes a drill-catalog change without running `diagnostics:report:update` → red CI | Recoverable. CI fails with the explicit error message "Generated plan diagnostics report is stale. Run npm run diagnostics:report:update." Single command fix, push again. The friction is documented in plan flows and is the explicit cost of moving the freshness contract from aspirational to enforced. |
| A future plan introduces a real `level: 'error'` architecture finding without intending to | Strict-mode CI fails the PR with the rule and file in the log. The plan author either fixes the violation or, if intentional, escalates to a decision (not a CI bypass) — same pattern as a breaking lint rule. |
| Typography guardrails false-positive on a deliberately-styled timer surface | Allowlists in `app/scripts/validate-typography-guardrails.mjs` are explicit per-file-per-token. Adding a new approved usage means a one-line allowlist patch, same as before D139. The CI gate doesn't change the authoring path; it just enforces it. |
| New `level: 'error'` rule added to architecture script later breaks CI on existing code | Same recovery path as introducing a new lint rule: fix or grandfather. The `screenComponentServiceImport` advisory tier is the canonical pattern for "report but don't gate" — additions follow the same shape. |
| Vite SSR cold-start in `diagnostics:report:check` slows CI on cold runners | ~650ms locally; CI runners have similar startup. Real cost is dominated by `npm ci`, `npx playwright install`, and Vitest. Three sub-second gates are noise inside a multi-minute CI run. |
| The duplicate `diagnostics:triage:check` alias is misread as a missing distinct check | The script's success output explicitly prints both "Generated plan diagnostics report is current." and "Generated plan diagnostics triage is current." on every run, so the dual-validation is visible at the command line. The plan documents the alias in the decision row and in this plan. |

---

## Verification

- `cd app && npm run architecture:check -- --strict` — exits 0, prints 21 advisory findings.
- `cd app && npm run typography:guardrails:check` — exits 0, prints `Typography guardrails passed.`.
- `cd app && npm run diagnostics:report:check` — exits 0, prints `Generated plan diagnostics report is current. / Generated plan diagnostics triage is current.`.
- `cd app && npm run typecheck && npm run lint && npm run test -- --run` — all green.
- `bash scripts/validate-agent-docs.sh` — `Agent doc validation passed.`
- `cat .github/workflows/app-ci.yml` — confirms three new steps in the `build-and-lint` job, ordered cheap → expensive between `Lint` and `Test`.
