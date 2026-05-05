---
id: docs-canonical-successor-metadata-requirements-2026-05-02
title: "Docs Canonical Successor Metadata Requirements"
status: active
stage: validation
type: requirements
summary: "Requirements for adding narrow successor metadata so archived or superseded docs can route agents to current truth without a broad lifecycle schema."
authority: "Requirements for docs lifecycle successor metadata; does not authorize a full lifecycle schema, docs triage queue, or broad archived-doc backfill."
last_updated: 2026-05-02
depends_on:
  - docs/ideation/2026-05-02-docs-process-lifecycle-ideation.md
  - docs/ops/agent-documentation-contract.md
  - docs/archive/README.md
  - docs/catalog.json
  - scripts/validate-agent-docs.sh
---

# Docs Canonical Successor Metadata Requirements

## Problem Frame

The docs archive pass moved completed and superseded historical docs out of active planning paths. The follow-up lifecycle work added archive policy notes, `active_registry: true` markers for complete-but-live plans, and archive drift validation.

That still leaves one high-friction gap: archived or superseded docs can tell agents "do not use this as current instruction" without also giving a deterministic next hop. The recent archive pass already produced concrete cases: `docs/archive/plans/2026-04-29-001-feat-tune-today-focus-picker-plan.md` is superseded by `docs/plans/2026-04-30-001-feat-pre-run-simplification-plan.md`, while `docs/ops/deploy-cloudflare-pages.md` already uses one-off `superseded_by` frontmatter to point at `docs/ops/deploy-cloudflare-worker.md`.

Those examples prove the routing need, but the shape is inconsistent: some successors live in prose, one uses `superseded_by`, and cataloged archived docs do not have one preferred machine-readable next-hop field. The preferred field should be `canonical_successor` because it describes the agent routing job directly and covers both "superseded by" docs and complete historical docs whose current route is a registry or shipped ledger.

This slice defines the narrow successor metadata needed before broader lifecycle roles, audit verdicts, or triage queues are considered.

---

## Actors

- A1. Maintainer: Decides whether a historical doc has a clear current successor or should remain provenance-only.
- A2. Agent reader: Uses machine-scannable metadata to route from archived/superseded history to current docs.
- A3. Planning agent: Uses the requirements to plan a bounded docs/catalog validation change without inventing broader lifecycle policy.
- A4. Reviewer: Checks that successor metadata improves routing without creating fake lineage.

---

## Key Flows

- F1. Archived doc has one current successor
  - **Trigger:** A historical doc remains referenced or likely discoverable, and one current doc now owns the instruction path.
  - **Actors:** A1, A2, A4
  - **Steps:** The maintainer records the successor path in machine-scannable metadata, keeps historical prose intact unless misleading, and validates that the successor path exists.
  - **Outcome:** An agent landing on the old doc can deterministically route to current truth.
  - **Covered by:** R1, R2, R3, R4, R8, R9, R10
- F2. Archived doc has no single successor
  - **Trigger:** A historical doc is useful provenance, but its current truth split across multiple docs or no active replacement exists.
  - **Actors:** A1, A2, A4
  - **Steps:** The maintainer records an explicit no-single-successor disposition and a short reason instead of forcing a fake chain.
  - **Outcome:** Agents know the absence of a successor is intentional.
  - **Covered by:** R5, R6, R7, R11
- F3. Existing supersession metadata is reconciled
  - **Trigger:** A doc already uses `superseded_by`, `supersedes`, or prose-only successor language.
  - **Actors:** A1, A3, A4
  - **Steps:** Planning maps existing forward links (`superseded_by`) to the new canonical field or compatibility rule, treats `supersedes` as reverse lineage rather than a next-hop route, then updates validation guidance without breaking existing docs unnecessarily.
  - **Outcome:** The repo gets one preferred routing shape while preserving useful precedent.
  - **Covered by:** R12, R13, R14, R15, R16, R17

---

## Requirements

**Successor metadata**

- R1. The successor model should introduce one preferred field named `canonical_successor` for archived or superseded docs that have one clear current successor.
- R2. For cataloged docs, `docs/catalog.json` should be the canonical storage surface for `canonical_successor`; frontmatter may mirror the same value only when planning explicitly chooses to support dual-surface compatibility.
- R3. `canonical_successor` values should be repo-relative paths, not absolute paths.
- R4. `canonical_successor` should point to an existing doc that owns current routing or current context for the superseded topic.
- R5. The no-single-successor counterpart should use the minimal shape `successor_disposition: no_single_successor` plus `successor_reason`.
- R6. `successor_disposition: no_single_successor` and `canonical_successor` should be mutually exclusive.
- R7. `successor_reason` should be short prose explaining why one successor would be misleading, not a hidden list of replacement paths or a new routing mechanism.

**Scope control**

- R8. The first pass should target high-risk docs, not every archived file.
- R9. The first automated missing-successor report should cover catalog entries with `status: superseded`; broader high-risk discovery such as active-doc references to archived docs, compatibility-surface references, and prose-only supersession language should remain deferred until the status-based report proves useful.
- R10. A mere catalog entry for an archived historical doc should not by itself force successor metadata unless the doc is superseded, actively referenced, or otherwise carries concrete routing risk.
- R11. Provenance-only docs without active references may remain untouched unless a planner identifies a concrete routing risk.

**Compatibility and validation**

- R12. Existing `superseded_by` frontmatter should be treated as a compatibility precedent, not a failure, until planning decides whether to migrate or alias it.
- R13. Existing `supersedes` metadata should be treated as reverse lineage; it should not satisfy a current next-hop requirement unless paired with `canonical_successor` or compatible forward metadata.
- R14. Prose-only supersession notes should not be considered sufficient for machine routing when the doc is cataloged as superseded and has a clear successor.
- R15. Missing successor metadata should start as a warning or explicit report, not a hard failure.
- R16. Malformed opted-in successor metadata should hard-fail validation: non-existent successor paths, absolute paths, successor cycles, catalog/frontmatter divergence when both surfaces are used, and successor targets that are themselves archived or superseded without chain compression or an explicit exemption.
- R17. Any validator or report should distinguish "missing successor" from "explicitly no single successor" so cleanup work stays actionable.

**Non-goals**

- R18. This slice should not introduce a full docs lifecycle schema, replacement-chain graph, CODEOWNERS workflow, or scheduled stale-doc review.
- R19. This slice should not change product docs status vocabulary (`draft`, `active`, `complete`, `superseded`).
- R20. This slice should not promote archived docs back into active routing.

---

## Acceptance Examples

- AE1. **Covers R1, R2, R3, R4.** Given `docs/archive/plans/2026-04-29-001-feat-tune-today-focus-picker-plan.md` is superseded by `docs/plans/2026-04-30-001-feat-pre-run-simplification-plan.md`, when successor metadata is added, the catalog entry points to the active plan using a repo-relative `canonical_successor`.
- AE2. **Covers R5, R6, R7, R11.** Given an archived historical polish plan contains useful provenance but no single active successor, when reviewed, it can record `successor_disposition: no_single_successor` plus a short `successor_reason` instead of a false replacement path.
- AE3. **Covers R12, R13, R14, R15, R17.** Given `docs/ops/deploy-cloudflare-pages.md` already uses `superseded_by`, when validation is added, the existing field is recognized as precedent while the planner decides whether to migrate to or alias `canonical_successor`.
- AE4. **Covers R16.** Given a catalog entry opts into `canonical_successor`, when the successor path is missing, absolute, archived without exemption, superseded without chain compression, cyclic, or divergent from mirrored frontmatter, validation fails rather than merely warning.

---

## Success Criteria

- Agents can route from the highest-risk archived/superseded docs to current truth without reading stale body prose.
- Requirements let planning choose a small metadata/validation implementation without inventing scope boundaries.
- The change adds deterministic routing for clear successors while avoiding fake lineage for messy historical docs.

---

## Scope Boundaries

- Include only docs lifecycle successor metadata and light validation/reporting.
- Exclude full lifecycle roles such as `instruction_role`; that remains a separate ideation survivor.
- Exclude docs audit verdict vocabulary; that remains a separate ideation survivor.
- Exclude generated lifecycle triage queues unless repeated validator drift proves they are needed.
- Exclude broad archive backfill beyond high-risk referenced or cataloged docs.

---

## Key Decisions

- Use `canonical_successor` as the recommended field because it communicates the agent routing job more clearly than generic `successor` and is broader than the existing `superseded_by` precedent.
- Use `docs/catalog.json` as the canonical storage surface for cataloged docs because it is already the machine-readable routing map.
- Allow a minimal no-single-successor disposition because many historical docs are provenance bundles, not one-to-one deprecations.
- Start missing-metadata validation as warning/reporting, but hard-fail malformed opted-in metadata because broken successor metadata is worse than no successor metadata.

---

## Dependencies / Assumptions

- `docs/catalog.json` remains the machine-readable routing map.
- `docs/ops/agent-documentation-contract.md` owns lifecycle policy.
- `scripts/validate-agent-docs.sh` remains the existing validation entry point for agent-facing docs.

---

## Outstanding Questions

### Resolve Before Planning

- None.

### Deferred to Planning

- [Affects R2, R12][Technical] Decide whether mirrored frontmatter is supported in addition to catalog storage, and if so how divergence is reported.
- [Affects R12][Technical] Decide whether existing `superseded_by` is migrated, aliased, or left as an accepted compatibility field.
- [Affects R15-R17][Technical] Decide the exact validator output format for warnings versus failures.

---

## Next Steps

-> /ce-plan for structured implementation planning.
