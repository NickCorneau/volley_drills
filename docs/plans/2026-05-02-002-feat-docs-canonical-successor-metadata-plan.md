---
id: docs-canonical-successor-metadata-plan-2026-05-02
title: "feat: Add docs canonical successor metadata"
status: complete
stage: validation
type: plan
summary: "Implementation plan for adding catalog-first successor metadata and validation so archived or superseded docs can route agents to current truth without a broad lifecycle schema."
date: 2026-05-02
origin: docs/brainstorms/2026-05-02-docs-canonical-successor-metadata-requirements.md
depends_on:
  - docs/catalog.json
  - scripts/validate-agent-docs.sh
  - scripts/test-validate-agent-docs.sh
  - docs/ops/agent-documentation-contract.md
  - docs/archive/README.md
---

# feat: Add Docs Canonical Successor Metadata

## Overview

Add a narrow, catalog-first successor metadata convention for archived or superseded docs. The change should let agents route from high-risk stale history to current truth without inventing a broad lifecycle schema or forcing every archived doc through a backfill.

The plan keeps the first implementation intentionally small: seed the highest-risk successor entries, validate opted-in metadata strictly, report missing successor candidates without failing CI, and document the convention where agents already look.

---

## Problem Frame

The archive pass now separates completed/superseded historical docs from active routing, and the validator protects `active_registry` markers for complete-but-live plan registries. What remains is a next-hop problem: an archived or superseded doc can be correctly labeled as historical while still failing to tell a reader what to use instead.

The origin requirements choose `canonical_successor` as the preferred agent-routing field, with `docs/catalog.json` as the canonical storage surface for cataloged docs. They also require a minimal no-single-successor counterpart for messy provenance docs and warning/report-first behavior for missing metadata.

---

## Requirements Trace

- R1-R4. Add catalog-first `canonical_successor` values using repo-relative paths that resolve to current routing docs.
- R5-R7. Support a minimal no-single-successor disposition with a short reason and mutual exclusion from `canonical_successor`.
- R8-R11. Limit the first pass to high-risk docs rather than broad archived-doc backfill.
- R12-R14. Preserve existing `superseded_by` as compatibility precedent, treat `supersedes` as reverse lineage, and do not rely on prose-only successor notes for machine routing.
- R15-R17. Report missing successor metadata, but hard-fail malformed opted-in metadata.
- R18-R20. Avoid broad lifecycle schema, status-vocabulary changes, or archive promotion.

**Origin actors:** A1 maintainer, A2 agent reader, A3 planning agent, A4 reviewer.

**Origin flows:** F1 archived doc has one current successor; F2 archived doc has no single successor; F3 existing supersession metadata is reconciled.

**Origin acceptance examples:** AE1-AE4 from `docs/brainstorms/2026-05-02-docs-canonical-successor-metadata-requirements.md`.

---

## Scope Boundaries

- Do not introduce `instruction_role`, audit verdict vocabulary, CODEOWNERS, scheduled stale-doc review, or a lifecycle triage queue.
- Do not require every file under `docs/archive/` to receive successor metadata.
- Do not promote archived docs back into active folders.
- Do not change the existing doc status vocabulary.
- Do not make missing successor metadata fail CI in the first slice.

### Deferred to Follow-Up Work

- Provenance/instruction role metadata remains a separate ideation survivor.
- Docs audit verdict vocabulary remains a separate ideation survivor.
- A lifecycle triage queue remains gated on repeated validator drift.

---

## Context & Research

### Relevant Code and Patterns

- `docs/catalog.json` is the machine-readable routing map and already carries `active_registry: true` for complete plan registries kept in active folders.
- `scripts/validate-agent-docs.sh` uses Bash orchestration plus embedded Python for JSON/frontmatter/catalog checks.
- `scripts/test-validate-agent-docs.sh` builds temporary fixture repos and asserts validator pass/fail behavior.
- `docs/ops/deploy-cloudflare-pages.md` is the current `superseded_by` precedent.
- `docs/archive/README.md` and `docs/ops/agent-documentation-contract.md` own archive lifecycle policy.

### Institutional Learnings

- Keep successor metadata narrow and catalog-first.
- Preserve `active_registry` as the marker for complete-but-live plan registries.
- Treat missing successor metadata as reportable drift before making it fail.
- Defer broader lifecycle machinery until simple validator-backed checks show repeated drift.

### External References

- No new external research is needed for this implementation. The work is repo-specific docs validation, and local patterns are strong enough.

---

## Key Technical Decisions

- **Bump `docs/catalog.json` schema to v5 atomically with validator support:** Adding routing semantics to catalog entries changes the machine-readable contract enough to warrant a schema bump, but the bump must land with the validator expectation and fixture catalog updates in the same implementation unit.
- **Catalog is authoritative for cataloged docs:** `canonical_successor`, `successor_disposition`, and `successor_reason` live in `docs/catalog.json` for cataloged docs. Frontmatter may keep existing `superseded_by` as compatibility metadata, but catalog values win.
- **Current terminal successors only:** A valid `canonical_successor` should resolve to exactly one cataloged doc that is not archived, is not `status: superseded`, and carries no forward successor metadata of its own. Stricter status checks beyond that should stay warning-only unless implementation proves they are necessary.
- **Warning/report for missing metadata, hard fail for malformed opted-in metadata:** Missing high-risk successor metadata should be visible but non-blocking; invalid successor paths, cycles, mutually exclusive fields, duplicate catalog identities, and catalog/frontmatter divergence should fail.
- **Chain compression over multi-hop traversal:** If A is superseded by B and B is superseded by C, A should point directly to C rather than relying on agents to walk a chain.

---

## Open Questions

### Resolved During Planning

- **Where does successor metadata live?** `docs/catalog.json` is canonical for cataloged docs; frontmatter compatibility is allowed only where already present or explicitly mirrored.
- **What successor targets are valid?** Cataloged docs that are not archived, not superseded, and not forward-successor links themselves are valid terminal targets; stricter status checks can warn but should not block this slice without evidence.
- **Does missing metadata fail validation?** No. Missing metadata is warning/report-only in this slice.

### Deferred to Implementation

- Exact warning text and output stream for non-blocking successor reports.
- Final field placement for mirrored frontmatter if implementation finds a strong reason to support it.
- The exact inventory of high-risk docs after implementing the report logic.

---

## High-Level Technical Design

> *This illustrates the intended approach and is directional guidance for review, not implementation specification. The implementing agent should treat it as context, not code to reproduce.*

```mermaid
flowchart LR
  A[docs/catalog.json docs[] entry] --> B{Successor metadata}
  B -->|canonical_successor| C[Validate target exists and is terminal]
  B -->|successor_disposition: no_single_successor| D[Validate successor_reason]
  B -->|missing but high-risk| E[Warn/report only]
  C -->|malformed| F[Validation error]
  D -->|malformed| F
```

---

## Implementation Units

- [x] U1. **Catalog schema and validator contract**

**Goal:** Add schema v5 support for successor metadata without leaving the repo invalid mid-change.

**Requirements:** R1-R7, R12-R17; F1-F3; AE1-AE4.

**Dependencies:** None.

**Files:**
- Modify: `docs/catalog.json`
- Modify: `scripts/validate-agent-docs.sh`
- Modify: `scripts/test-validate-agent-docs.sh`

**Approach:**
- Bump `schema_version` from `4` to `5`.
- Update the validator expected schema version to `5` in the same unit.
- Update the fixture catalog generator in `scripts/test-validate-agent-docs.sh` to write schema v5, while keeping the stale-schema test by setting an older value.
- Add the parser/validation contract for the new optional fields without requiring real catalog entries to be populated yet.
- Validate path normalization for opted-in successor values: reject absolute paths, Windows backslashes, `.`/`..` traversal, URL schemes, fragments, and targets outside cataloged docs.

**Patterns to follow:**
- Existing `active_registry: true` catalog entries.
- Embedded Python catalog checks in `catalog_doc_paths_must_exist_and_use_known_status`.

**Test scenarios:**
- Valid schema v5 fixture passes.
- Schema v4 fixture fails the stale-schema test.
- Invalid successor path formats fail once a fixture opts into `canonical_successor`.

**Verification:**
- The repo remains valid after the schema bump because catalog, validator expectation, and fixture generator change together.

- [x] U2. **Successor validator core and seed metadata**

**Goal:** Validate opted-in successor metadata and seed the first high-risk catalog entries.

**Requirements:** R1-R17; F1-F3; AE1-AE4.

**Dependencies:** U1.

**Files:**
- Modify: `docs/catalog.json`
- Modify: `docs/ideation/2026-05-02-docs-process-lifecycle-ideation.md`
- Modify: `scripts/validate-agent-docs.sh`
- Test: `scripts/test-validate-agent-docs.sh`

**Approach:**
- Add successor validation near `archive_lifecycle_must_be_consistent`.
- Validate:
  - `canonical_successor` is a non-empty repo-relative path using forward slashes.
  - The target path exists in the repo and maps to exactly one catalog entry.
  - The target is terminal: not under `docs/archive/`, not `status: superseded`, and not carrying forward successor metadata of its own.
  - Source and target do not form self-cycles or multi-node cycles.
  - `canonical_successor` is mutually exclusive with `successor_disposition: no_single_successor`.
  - `successor_disposition: no_single_successor` requires a short non-empty `successor_reason`.
  - Existing `superseded_by` is accepted as compatibility metadata. When a cataloged doc has both `superseded_by` and catalog `canonical_successor`, they must match exactly.
  - `supersedes` is reverse lineage and never satisfies a forward successor requirement.
  - Duplicate `docs[].path` or `docs[].id` entries that make successor lookup ambiguous fail validation.
- Add `canonical_successor` to clear successor entries, starting with:
  - `docs/archive/plans/2026-04-29-001-feat-tune-today-focus-picker-plan.md` -> `docs/plans/2026-04-30-001-feat-pre-run-simplification-plan.md`
  - `docs/archive/brainstorms/2026-04-29-skill-scope-reservation-requirements.md` -> `docs/plans/2026-04-30-001-feat-pre-run-simplification-plan.md`, unless implementation review proves the `2026-04-30` requirements doc is the terminal route for Track 4 only
  - `docs/ops/deploy-cloudflare-pages.md` -> `docs/ops/deploy-cloudflare-worker.md`
- Use `successor_disposition: no_single_successor` plus `successor_reason` only when a reviewed high-risk doc truly has no one route.
- Mark the successor-metadata ideation survivor as explored if not already done.

**Patterns to follow:**
- Embedded Python catalog checks in `catalog_doc_paths_must_exist_and_use_known_status`.
- Existing error collection style via `errors+=`.
- Existing `superseded_by` frontmatter in `docs/ops/deploy-cloudflare-pages.md`.

**Test scenarios:**
- Covers AE1. Cataloged archived doc with a valid `canonical_successor` to an active plan passes.
- Covers AE2. Cataloged archived doc with `successor_disposition: no_single_successor` and `successor_reason` passes.
- Covers AE3. Existing `superseded_by` compatibility metadata does not fail validation.
- Covers AE4. Missing successor path, absolute path, backslash path, archived target, superseded target, self-cycle, multi-node cycle, and mutually exclusive fields fail.
- `superseded_by` and `canonical_successor` with matching targets passes; mismatched targets fail.
- Duplicate catalog path/id entries fail when they would make successor lookup ambiguous.

**Verification:**
- Validator tests prove malformed opted-in metadata fails while valid successor and no-single-successor metadata passes.

- [x] U3. **Missing-successor report path**

**Goal:** Surface superseded catalog entries that appear to need successor metadata without failing validation.

**Requirements:** R8-R12, R15, R17; F1-F3.

**Dependencies:** U2.

**Files:**
- Modify: `scripts/validate-agent-docs.sh`
- Test: `scripts/test-validate-agent-docs.sh`

**Approach:**
- Add a non-blocking warnings/report collection separate from `errors`.
- Report likely missing successor metadata for catalog entries with `status: superseded`.
- Treat compatible `superseded_by` as forward compatibility metadata that suppresses "missing successor" warnings, while still allowing a separate migration note if implementation wants one.
- Defer broader high-risk discovery for active-doc references to archived docs, compatibility-surface references, and prose-only supersession language until the status-based report proves useful.
- Print warnings in a way that keeps exit code `0` when no hard errors exist.
- Add a capture/assert helper in `scripts/test-validate-agent-docs.sh` so tests can assert warning output instead of only exit codes.
- Use stable warning codes or predictable prefixes so future agents can interpret report lines.

**Patterns to follow:**
- Existing validator output clarity, but preserve `Agent doc validation passed.` for clean runs.

**Test scenarios:**
- Superseded catalog entry without `canonical_successor`, compatible `superseded_by`, or no-single-successor disposition emits a warning/report and exits `0`.
- Superseded catalog entry with compatible `superseded_by` emits no missing-successor warning.
- Catalog summaries mentioning "superseded" as historical context do not emit warnings.
- Provenance-only archived complete doc with no active references emits no warning.
- Hard errors still exit non-zero even when warnings are present.

**Verification:**
- Fixture tests prove warnings do not fail CI, while hard errors still do.

- [x] U4. **Policy and routing docs sync**

**Goal:** Document the successor metadata convention in the existing docs lifecycle surfaces.

**Requirements:** R1-R20; Success Criteria.

**Dependencies:** U1, U2, U3.

**Files:**
- Modify: `docs/ops/agent-documentation-contract.md`
- Modify: `docs/archive/README.md`
- Modify: `.cursor/rules/machine-scannable-docs.mdc`
- Modify: `docs/catalog.json`

**Approach:**
- Extend archive lifecycle guidance with `canonical_successor`, `successor_disposition: no_single_successor`, and `successor_reason`.
- Clarify that catalog is canonical for cataloged docs.
- Clarify that missing successor metadata starts as report-only, while malformed opted-in metadata fails.
- Update `doc_conventions.preferred_patterns` if useful.

**Patterns to follow:**
- Existing archive lifecycle text in `docs/ops/agent-documentation-contract.md`.
- Existing machine-scannable docs rule for `active_registry`.

**Test scenarios:**
- Test expectation: no separate behavior tests; doc validation covers frontmatter/catalog consistency.

**Verification:**
- Agent docs validation passes and a reader can find the convention from both the docs contract and archive index.

- [x] U5. **Final validation and scope guard**

**Goal:** Prove the plan's boundaries held and the new metadata did not expand into a broader lifecycle system.

**Requirements:** R13-R20; Scope Boundaries.

**Dependencies:** U1, U2, U3, U4.

**Files:**
- Modify: `docs/plans/2026-05-02-002-feat-docs-canonical-successor-metadata-plan.md`

**Approach:**
- Verify the implementation only introduced successor metadata and warning/report validation.
- Confirm no `instruction_role`, audit verdict vocabulary, lifecycle triage queue, scheduled review, or broad archive backfill was added.
- Record any implementation-time deviations in the plan or follow-up note if the work discovers a sharper boundary.

**Patterns to follow:**
- Existing plan closeout notes in current docs plans.

**Test scenarios:**
- Test expectation: none; this is a plan closeout/scope verification unit.

**Verification:**
- `bash scripts/test-validate-agent-docs.sh`
- `bash scripts/validate-agent-docs.sh`
- `python3 -m json.tool docs/catalog.json`
- `git diff --check`

---

## Risk Analysis & Mitigation

- **Risk: metadata sprawl.** Mitigation: only `canonical_successor`, `successor_disposition`, and `successor_reason` are in scope.
- **Risk: false successor chains.** Mitigation: exact catalog target lookup, terminal-target validation, `superseded_by` agreement checks, and cycle checks.
- **Risk: warning noise.** Mitigation: keep missing-successor warnings bounded to high-risk docs and report-only in this slice.
- **Risk: catalog/frontmatter divergence.** Mitigation: catalog wins for cataloged docs, and existing `superseded_by` must match `canonical_successor` when both are present.

---

## Verification Plan

- `bash scripts/test-validate-agent-docs.sh`
- `bash scripts/validate-agent-docs.sh`
- `python3 -m json.tool docs/catalog.json`
- `git diff --check`
