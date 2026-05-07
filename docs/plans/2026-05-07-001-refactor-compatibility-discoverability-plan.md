---
title: refactor: Improve compatibility scan discoverability
type: refactor
status: active
date: 2026-05-07
---

# refactor: Improve compatibility scan discoverability

## Summary

Improve the repo's agent-compatibility score by making the existing app quality gates, governance signals, and Cursor project shape discoverable from the repo root without restructuring the `app/` workspace or expanding product scope.

---

## Problem Frame

The compatibility scan scored the repo at 68/100. The app already has strong local scripts, CI, tests, and documentation, but the scanner cannot see several of those signals from the repository root because the runnable Node project lives under `app/`. The highest-value fix is to expose the existing maturity through thin root-level affordances and small hygiene files rather than changing the application architecture.

---

## Assumptions

*This plan was authored without synchronous user confirmation. The items below are agent inferences that fill gaps in the input — un-validated bets that should be reviewed before implementation proceeds.*

- The goal is to raise compatibility and agent ergonomics with the smallest behavior-neutral change, not to introduce new product telemetry, runtime logging infrastructure, or a broad governance program.
- License posture should be explicit but conservative: unless the repo already declares an open-source license elsewhere, package metadata should communicate private/unlicensed status rather than inventing an OSS license.
- Root scripts should delegate to `app/` commands using npm's prefix support and should not adopt a full npm workspace model unless implementation discovers it is already expected by tooling.
- Cursor MCP config should be minimal and project-local; it should not hardcode user-specific MCP plugin paths or credentials.

---

## Requirements

- R1. Expose build, lint, typecheck, test, and validation entrypoints from the repo root so agents and scanners can discover the existing quality gates.
- R2. Add an explicit app typecheck signal without changing the current production build behavior.
- R3. Add lightweight root hygiene/governance signals for secrets, security reporting, and license posture without leaking secrets or over-claiming public support guarantees.
- R4. Keep the app architecture, deployment assumptions, and existing CI semantics intact.
- R5. Update only the docs and CI paths that need to know about the new root entrypoints.

---

## Scope Boundaries

- Do not rewrite the app into a package workspace or move dependencies out of `app/`.
- Do not add production telemetry, metrics, tracing, or error-reporting infrastructure in this pass.
- Do not make an open-source licensing decision unless an existing canonical doc already states one.
- Do not shorten or substantially reorganize `AGENTS.md` as part of this implementation; treat that scanner complaint as follow-up unless there is a trivial pointer-only cleanup.
- Do not commit user-specific local configuration, credentials, tokens, or MCP plugin installation paths.

### Deferred to Follow-Up Work

- Observability improvements: a separate product/ops plan should decide whether the app needs runtime health, error reporting, analytics, or logging beyond current local-first validation needs.
- `AGENTS.md` compression: a focused docs pass can move detail into canonical docs if the scan score remains blocked by the concise-guidance heuristic after root discoverability fixes.

---

## Context & Research

### Relevant Code and Patterns

- `app/package.json` already owns app-local scripts for `build`, `lint`, `test`, Playwright, diagnostics, architecture checks, formatting, and deploy.
- `.github/workflows/app-ci.yml` installs from `app/package-lock.json` and runs CI with `working-directory: app`.
- `app/README.md` documents app-local run and verification commands, which root wrappers should mirror rather than replace.
- `scripts/validate-agent-docs.sh` is the canonical repo-level validation command for agent/doc surface changes.
- `.cursor/rules/` already holds project guidance; `.cursor/mcp.json` is absent.

### Institutional Learnings

- `docs/solutions/workflow-issues/route-founder-use-feedback-without-overfiring-scope-2026-05-04.md` applies: classify compatibility findings narrowly and avoid turning a bounded scan response into broad routing or documentation churn.
- `AGENTS.md` and `docs/ops/agent-documentation-contract.md` keep compatibility surfaces thin and point back to canonical docs rather than duplicating policy.

### External References

- None used. Local repo patterns are sufficient for this compatibility/discoverability pass.

---

## Key Technical Decisions

- Add root wrappers instead of restructuring the monorepo: this satisfies root discoverability while preserving the current `app/` ownership boundary and deploy assumptions.
- Add `typecheck` as an app-level script and wire root `typecheck` to it: the app build already invokes TypeScript, but a named command is easier for scanners, CI, and agents to reason about.
- Use explicit private/unlicensed package metadata if no canonical license exists: this addresses license discoverability without inventing a legal posture.
- Keep secret hygiene declarative and low-risk: `.env.example`, ignore patterns, and security guidance should describe expected handling without adding secrets or requiring new services.
- Treat `.cursor/mcp.json` as project capability metadata only: add a safe minimal config if useful, but do not encode machine-local MCP plugin details.

---

## Open Questions

### Resolved During Planning

- Should the work touch app behavior? No. The scan findings are mostly machine-discoverability issues, and the app already has mature app-local commands and tests.
- Should the root become a full npm workspace? No. Research found no existing workspace model; thin wrappers deliver the benefit with less churn.

### Deferred to Implementation

- Exact root script names: implementation should choose names that align with existing `app/package.json` scripts and do not create surprising aliases.
- Exact `.cursor/mcp.json` content: implementation should keep it schema-valid and safe, but may omit it if a minimal config would be misleading.
- Exact license metadata placement: implementation should prefer root `package.json` and optionally mirror into `app/package.json` only if it improves scanner clarity without duplicating conflicting metadata.

---

## Implementation Units

- U1. **Root command wrappers**

**Goal:** Make the existing app build, lint, test, typecheck, and repo validation commands discoverable from the repository root.

**Requirements:** R1, R2, R4

**Dependencies:** None

**Files:**
- Create: `package.json`
- Modify: `app/package.json`

**Approach:**
- Add a private root package manifest with no dependencies and scripts that delegate to `app/` or existing repo scripts.
- Add an explicit `typecheck` script under `app/` and make root `typecheck` delegate to it.
- Include a root `validate` script that composes the lightweight repo checks most relevant to agents, while keeping heavyweight e2e separate.

**Patterns to follow:**
- `app/package.json`
- `app/README.md`
- `scripts/validate-agent-docs.sh`

**Test scenarios:**
- Happy path: running root `typecheck` should execute the app TypeScript check and exit successfully.
- Happy path: running root `lint` should delegate to the app lint command without requiring a root dependency install.
- Happy path: running root `test` should delegate to the app Vitest suite.
- Integration: running root document validation should still use `scripts/validate-agent-docs.sh`.

**Verification:**
- Root scripts exist and delegate to the same app-owned quality gates already used locally and in CI.
- App build behavior remains unchanged.

---

- U2. **Root hygiene and governance signals**

**Goal:** Add low-risk files and metadata that communicate secret handling, security reporting, and license posture to agents and scanners.

**Requirements:** R3, R4

**Dependencies:** U1

**Files:**
- Create: `.env.example`
- Create: `SECURITY.md`
- Modify: `.gitignore`
- Modify: `package.json`
- Modify: `app/package.json`

**Approach:**
- Add a root `.env.example` that states local app development does not require secrets and documents optional deploy secret names as placeholders only.
- Extend `.gitignore` with common local env files while preserving the committed example file.
- Add concise `SECURITY.md` guidance for private validation-phase reporting and secret handling.
- Add explicit private/unlicensed metadata in package manifests where appropriate.

**Patterns to follow:**
- `docs/ops/deploy-cloudflare-worker.md`
- `.gitignore`
- `app/package.json`

**Test scenarios:**
- Error path: common local env files should be ignored while `.env.example` remains trackable.
- Governance check: package manifests should not claim a public OSS license unless a canonical source supports it.
- Secret hygiene check: `.env.example` should contain placeholders and no real token values.

**Verification:**
- Secret and security signals are root-visible and do not introduce sensitive data.
- Package metadata is explicit and internally consistent.

---

- U3. **Cursor and scanner capability metadata**

**Goal:** Add safe Cursor project metadata only where it improves compatibility without embedding local machine details.

**Requirements:** R3, R4

**Dependencies:** U1

**Files:**
- Create: `.cursor/mcp.json`

**Approach:**
- Add a schema-shaped project MCP config if a minimal empty or documented project-local config is valid for Cursor.
- Do not include absolute local paths, plugin cache paths, auth tokens, or user-specific server commands.
- If implementation finds that an empty config would be misleading or invalid, skip this file and document the decision in the final handoff.

**Patterns to follow:**
- `.cursor/rules/`
- `.cursor/settings.json`

**Test scenarios:**
- Config validity: the MCP config should parse as JSON.
- Safety: the MCP config should not contain absolute paths or credential-like values.

**Verification:**
- Cursor project metadata is present only if it is valid and portable.

---

- U4. **CI and documentation alignment**

**Goal:** Ensure automated checks and human docs point to the new root-level affordances without breaking app-local workflows.

**Requirements:** R1, R4, R5

**Dependencies:** U1, U2, U3

**Files:**
- Modify: `.github/workflows/app-ci.yml`
- Modify: `README.md`
- Modify: `app/README.md`

**Approach:**
- Update CI path triggers to notice root wrapper and hygiene file changes where appropriate.
- Prefer keeping CI execution in `app/` unless root wrappers are needed to prove discoverability.
- Update README quick-start/verification text so agents and humans can choose root commands or app-local commands without ambiguity.

**Patterns to follow:**
- `README.md`
- `app/README.md`
- `.github/workflows/app-ci.yml`

**Test scenarios:**
- Integration: CI should still install with `app/package-lock.json` and run app-owned checks.
- Documentation: root README should include the root verification path, while `app/README.md` should preserve app-local commands.
- Regression: deploy docs and app-local deploy commands should remain app-rooted.

**Verification:**
- CI still reflects the app as the runnable package.
- Documentation now makes root validation discoverable.

---

## System-Wide Impact

- **Interaction graph:** Root scripts become the agent-facing entrypoint and delegate into existing app and docs scripts.
- **Error propagation:** Script failures should preserve the underlying app/docs command exit code.
- **State lifecycle risks:** No runtime state or persisted Dexie data should be touched.
- **API surface parity:** App-local scripts remain available; root scripts are additive wrappers.
- **Integration coverage:** Root wrapper execution proves cross-directory command wiring; app tests continue proving app behavior.
- **Unchanged invariants:** `app/` remains the deploy/build root for Cloudflare Worker workflows; product routes, data schema, and app architecture are unchanged.

---

## Risks & Dependencies

| Risk | Mitigation |
|------|------------|
| Root wrappers drift from app scripts | Delegate directly with npm prefix support and avoid duplicate command bodies. |
| License metadata over-claims legal posture | Use private/unlicensed metadata unless a canonical license exists. |
| `.env.example` accidentally implies required secrets | State that local dev/test requires no secrets and mark deploy values as optional placeholders. |
| CI trigger changes cause noisy runs | Only add paths that materially affect validation or scanner-visible project setup. |
| Empty `.cursor/mcp.json` is invalid or misleading | Validate JSON shape and skip the file if no safe portable config exists. |

---

## Documentation / Operational Notes

- This plan intentionally targets compatibility discoverability, not app feature behavior.
- If the compatibility score remains low after implementation, rerun the scan and decide whether the next highest-value follow-up is AGENTS.md compression, observability design, or security scanning integration.

---

## Sources & References

- Compatibility scan summary from current LFG invocation.
- Related code: `app/package.json`
- Related code: `.github/workflows/app-ci.yml`
- Related docs: `app/README.md`
- Related docs: `docs/ops/deploy-cloudflare-worker.md`
- Related docs: `docs/ops/agent-documentation-contract.md`
- Institutional learning: `docs/solutions/workflow-issues/route-founder-use-feedback-without-overfiring-scope-2026-05-04.md`
