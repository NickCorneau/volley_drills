---
date: 2026-05-02
topic: docs-process-lifecycle
focus: "Next useful docs/process improvements after the docs validity and archive pass."
mode: repo-grounded
---

# Ideation: Docs Process Lifecycle

## Grounding Context

Volleycraft already has strong docs routing surfaces: `AGENTS.md`, `docs/catalog.json`, `README.md`, `docs/README.md`, and `docs/ops/agent-documentation-contract.md`. The archive pass created `docs/archive/<family>/` for completed/superseded historical docs, while active registries and shipped ledgers can remain in active folders.

The next risk is lifecycle drift: archived docs referenced as active, complete registries over-archived, catalog entries losing routing clarity, and future agents relying on prose when machine-readable routing is ambiguous.

## Ranked Ideas

### 1. Archive Policy Note Plus Eligibility Checklist

**Description:** Add a short archive policy section to `docs/ops/agent-documentation-contract.md`, mirrored or linked from `docs/archive/README.md`, that defines archive eligibility, registry exceptions, provenance-only references, and required pointer updates.

**Rationale:** This is the smallest useful move and directly addresses the post-archive gap. It makes the archive decisions repeatable without adding new machinery.

**Downsides:** It is prose-only, so it will not prevent future drift by itself.

**Confidence:** 92%

**Complexity:** Low

**Status:** Explored

### 2. Archive Drift Validator

**Description:** Extend `scripts/validate-agent-docs.sh` or a companion script to flag exact drift cases: archived docs with active-looking catalog status, moved docs referenced by old paths, active-folder completed docs without registry justification, and missing archive index/frontmatter fields.

**Rationale:** Validators already exist and are the repo's accepted enforcement point. This turns archive hygiene from a one-time manual sweep into a repeatable check.

**Downsides:** Needs careful allowlists to avoid false positives around legitimate live registries.

**Confidence:** 88%

**Complexity:** Medium

**Status:** Explored

### 3. Registry Exception Marker

**Description:** Add a machine-readable marker such as `active_registry: true` or a catalog field for complete docs that intentionally remain active because they are shipped ledgers or canonical implementation references.

**Rationale:** The hardest judgment in the archive pass was "complete but still active." A small marker keeps future agents from over-archiving those docs.

**Downsides:** Adds one more metadata concept and needs a migration/update pass for the few known registry docs.

**Confidence:** 84%

**Complexity:** Low-Medium

**Status:** Explored

### 4. Replacement Chain Metadata

**Description:** Require or encourage `superseded_by`, `supersedes`, or `canonical_successor` fields for superseded/archived docs and corresponding catalog entries.

**Rationale:** Agents need a deterministic path from history to current truth. This preserves provenance while reducing the chance stale plans become operational instructions again.

**Downsides:** Existing archived docs would need a targeted backfill, and some historical docs may have no single successor.

**Confidence:** 81%

**Complexity:** Medium

**Status:** Explored

### 5. Docs Audit Verdict Vocabulary

**Description:** Standardize archive/validity verdicts such as `keep_active`, `keep_registry`, `archive_complete`, `archive_superseded`, `provenance_only`, and `needs_owner_review`.

**Rationale:** This makes future docs passes reviewable and reduces taste-driven cleanup. It also matches the repo's successful generated-diagnostics triage style.

**Downsides:** Most valuable when paired with a template or validator; as prose alone it may be forgotten.

**Confidence:** 78%

**Complexity:** Low

**Status:** Unexplored

### 6. Docs Lifecycle Triage Queue

**Description:** Borrow the generated diagnostics pattern: group unresolved doc lifecycle findings under stable IDs and fail/warn when new untriaged groups appear.

**Rationale:** Strongest long-term maintenance idea. It creates a backlog for doc drift instead of relying on large cleanup sweeps.

**Downsides:** Higher process weight; likely premature until simpler policy and validator checks prove insufficient.

**Confidence:** 67%

**Complexity:** High

**Status:** Unexplored

## Rejection Summary

| Idea | Reason Rejected |
|---|---|
| Full lifecycle frontmatter pack (`owner`, `lifecycle`, `last_reviewed`, etc.) | Too broad for the next move; better introduced incrementally through registry/replacement fields. |
| CODEOWNERS for doc families | Useful in larger teams, but low value for current solo/founder workflow unless review ownership becomes a real bottleneck. |
| Scheduled stale-doc review | Good later, but recurring process before validator coverage may create calendar debt without better signals. |
| Hidden-but-reachable archive index expansion | Partly already covered by `docs/archive/README.md`; only worth expanding after replacement metadata exists. |
| No-trust-prose routing mode | Interesting and agent-native, but too abstract until catalog lifecycle fields exist. |
| Maintainer-zero archive sweep | Useful as a future dry-run tool, but too automated for a policy that is still being stabilized. |
| Postmortem action item ledger for docs passes | Adds process overhead; catalog delta and verdict vocabulary cover most of the value. |
| Admission ticket for archive re-promotion | Good edge-case guard, but lower priority than preventing drift in normal archive/reference flows. |
| Stale shelf review | Duplicates scheduled stale-doc review and is weaker than validator-backed drift detection. |
| Catalog delta requirement as standalone | Kept only as part of the policy/checklist idea; too small alone for top ranking. |

## Continuation: Beyond The First Three

### Grounding Delta

The first three ideas are now explored: archive lifecycle policy notes, `active_registry: true` catalog markers for complete-but-live plan registries, and archive drift validation. The remaining useful surface is not more archive mechanics, but deterministic routing from stale/superseded history to current truth, reviewable audit language, and traceability that stays inside existing catalog/PR/docs workflows. Heavy lifecycle triage should remain deferred until validator output shows repeated drift.

## Follow-Up Ranked Ideas

### 1. Canonical Successor Metadata

**Description:** Add `canonical_successor` for archived or superseded docs when a single active doc now owns the instruction path. Allow an explicit no-single-successor note for messy provenance docs.

**Rationale:** This is the clearest next move because the archive policy already says "route through the active successor," but the successor is not machine-readable.

**Downsides:** Requires a targeted backfill and not every historical doc has one clean successor.

**Confidence:** 90%

**Complexity:** Medium

**Status:** Unexplored

### 2. Provenance/Instruction Role Metadata

**Description:** Add a small catalog/frontmatter role such as `instruction_role: current | registry | provenance | superseded_context` for routing-sensitive docs.

**Rationale:** `status` and folder path do not fully tell agents how to use a doc. A role field separates historical evidence from active instructions.

**Downsides:** Overlaps with `active_registry`; needs careful naming so it does not become a second status vocabulary.

**Confidence:** 82%

**Complexity:** Medium

**Status:** Unexplored

### 3. Docs Audit Verdict Vocabulary

**Description:** Standardize review outcomes like `keep_current`, `keep_registry`, `archive_complete`, `archive_superseded`, `provenance_only`, `needs_successor`, and `needs_owner_review`.

**Rationale:** Future docs passes become comparable and reviewable without changing canonical `status` values.

**Downsides:** Mostly useful when a future pass or template actually uses the vocabulary.

**Confidence:** 79%

**Complexity:** Low

**Status:** Unexplored

### 4. Routing Receipt Block

**Description:** For routing-critical doc changes, require a tiny receipt in the PR/body or affected doc: old path, new path/status, successor, catalog updated, direct refs updated, validator command.

**Rationale:** Captures traceability without creating a standing docs lifecycle queue.

**Downsides:** If put in docs instead of PRs, it can create extra historical clutter.

**Confidence:** 75%

**Complexity:** Low-Medium

**Status:** Unexplored

### 5. Successor Coverage Validator Warning

**Description:** Extend validation to warn, not fail, when archived or superseded docs lack `canonical_successor`, `superseded_by`, or an explicit no-single-successor/provenance marker.

**Rationale:** Builds pressure toward deterministic routing while avoiding a giant metadata migration.

**Downsides:** The current validator is fail-oriented; adding warnings may require output convention changes.

**Confidence:** 72%

**Complexity:** Medium

**Status:** Unexplored

### 6. No Queue Until Repeated Drift Rule

**Description:** Codify that a docs lifecycle triage queue only becomes justified after repeated validator warnings in the same category across two or more passes.

**Rationale:** Preserves the earlier triage idea while making anti-overprocess explicit.

**Downsides:** It is a guardrail, not a direct improvement to routing correctness.

**Confidence:** 70%

**Complexity:** Low

**Status:** Unexplored

## Follow-Up Rejection Summary

| Idea | Reason Rejected |
|---|---|
| Full `supersedes` / `superseded_by` pair metadata everywhere | Useful later, but `canonical_successor` is simpler and directly supports agent routing. |
| Archive index successor table | Duplicates catalog responsibility and risks becoming stale. |
| Package-style deprecation banners on every archived doc | Good human UX, but heavy backfill for low current value. |
| Historical citation prefixes | Useful as prose convention, but weaker than metadata plus successor links. |
| Tiny docs debt labels in catalog | Too close to a triage queue; defer until validator findings prove repeated debt. |
| Archive promotion receipt | Edge-case guard; less valuable than successor metadata for normal reads. |
| Catalog lifecycle mini-schema | Too much schema surface now; let `canonical_successor` and verdict vocabulary prove value first. |
| No-trust-prose instruction classifier | Interesting, but role metadata covers the pragmatic subset. |
