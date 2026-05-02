---
id: generated-plan-diagnostics-next-steps-ideation-2026-05-01
title: "Ideation: generated-plan diagnostics next steps"
status: active
stage: validation
type: ideation
summary: "Ranked ideation for turning generated-plan diagnostic observations into a sequenced catalog, generator, and test-gating workflow."
authority: "Ideation only; identifies promising next-step directions after the generated-plan diagnostics report without authorizing catalog changes."
last_updated: 2026-05-02
depends_on:
  - docs/reviews/2026-05-01-generated-plan-diagnostics-report.md
  - docs/reviews/2026-04-30-focus-coverage-gap-cards.md
  - docs/archive/plans/2026-05-01-001-feat-generated-plan-diagnostics-plan.md
  - docs/brainstorms/2026-04-30-focus-coverage-catalog-readiness-requirements.md
  - docs/plans/2026-05-01-002-feat-generated-diagnostics-triage-workflow-plan.md
---

# Ideation: Generated-Plan Diagnostics Next Steps

## Grounding Context

The generated-plan diagnostics report covers 540 seeded cells across the current supported Tune today surface: Passing, Serving, Setting; five setup configurations; beginner/intermediate/advanced levels; 15/25/40-minute profiles; and four deterministic seeds.

Current snapshot:

- Clean cells: 119
- Observation-only cells: 421
- Hard-failure cells: 0
- Routeable observation groups: 53

The strongest current groups are duration-envelope signals, not automatic content-change orders:

- `d25-solo` wrap under-authored-min pressure.
- `d47`, `d33`, and `d46` over-authored-max / over-fatigue-cap pressure, often tied to optional slot redistribution.

Repo constraints:

- Hard failures block readiness.
- Classified observations route to product/content policy.
- Catalog activation still requires source-backed gap cards, affected IDs, adaptation deltas, cap delta, verification commands, and checkpoint criteria.
- Future mixed-focus themes should use explicit theme contracts, not raw multi-select OR filtering.

External grounding:

- Exercise programming treats duration as one part of FITT-VP, so duration pressure may mean content, cap metadata, block shape, or progression intent is wrong.
- Recommender systems use catalog coverage and diversity metrics to distinguish inventory gaps from ranking/generation behavior.
- Volleyball practice templates often use natural longer chunks; not every over-cap block is inherently bad.

## Ranked Ideas

### 1. Observation Triage Workbench

**Description:** Turn the 53 routeable observation groups into a durable decision queue. Each group gets a status, route, affected cells, likely fix path, and next evidence needed.

**Rationale:** This directly answers "what do we do with this report?" without prematurely adding drills. It converts the report from a static snapshot into an operational catalog/generator triage surface.

**Downsides:** Adds a new maintenance surface. It must stay generated or lightly curated so it does not become stale.

**Confidence:** 92%

**Complexity:** Medium

**Status:** Explored

### 2. Finding Graduation Ladder

**Description:** Define how observations move from `observed` to `routed` to `allowed`, `cap_review`, `block_split`, `source_depth`, or `hard_fail_candidate`.

**Rationale:** It gives the team a way to make findings fail tests only after product policy has decided they should fail. This avoids turning 421 current observations into noisy red tests while still preventing indefinite drift.

**Downsides:** Requires discipline to keep dispositions current.

**Confidence:** 88%

**Complexity:** Low / Medium

**Status:** Explored

### 3. Dynamic Surface / New Focus Sentinel

**Description:** Add a diagnostic preflight for newly registered visible focuses, configurations, durations, skill levels, or future theme contracts. New surfaces must generate cells, fail closed, or declare explicit `not_applicable` reasons.

**Rationale:** This addresses the user's ideal state: new parameters should be picked up automatically and fail if the catalog is insufficient.

**Downsides:** Synthetic new-focus tests can become artificial if they do not reflect a real product-supported focus.

**Confidence:** 86%

**Complexity:** Medium

**Status:** Explored

### 4. Catalog Change Impact Preview

**Description:** Add a dry-run helper that shows how a proposed drill, variant, cap, or tag change affects readiness cells and generated-plan diagnostics.

**Rationale:** Future catalog changes become reviewable as measured quality deltas rather than subjective "this seems like a useful drill."

**Downsides:** More tooling. It may not pay off until the catalog changes frequently.

**Confidence:** 80%

**Complexity:** Medium / High

**Status:** Unexplored

### 5. Workload Envelope Authoring Guide

**Description:** Create rules for choosing `durationMinMinutes`, `durationMaxMinutes`, and `fatigueCap.maxMinutes` by drill intent, block type, level, setup, and session length.

**Rationale:** Many current observations may be cap metadata issues rather than missing drills. A guide lowers future catalog drift.

**Downsides:** Some duration decisions need real dogfood/coaching judgment, not just static rules.

**Confidence:** 78%

**Complexity:** Low

**Status:** Explored

### 6. Redistribution-Free Builder Comparison

**Description:** Add a diagnostic-only mode that compares current optional-slot redistribution against a no-redistribution or split-redistribution strategy.

**Rationale:** It separates "we need more drills" from "the generator is dumping skipped optional minutes into one block."

**Downsides:** It can turn into generator-policy work quickly. Keep it diagnostic-only until a policy decision is made.

**Confidence:** 74%

**Complexity:** Medium

**Status:** Unexplored

## Rejection Summary


| #   | Idea                                | Reason Rejected                                                                  |
| --- | ----------------------------------- | -------------------------------------------------------------------------------- |
| 1   | Add drills directly from top groups | Too blunt; observations need route decisions and source-backed gap cards first.  |
| 2   | Thousand-drill synthetic catalog    | Interesting but too expensive and artificial for the current stage.              |
| 3   | Fully manual coaching editor        | Useful later, but too much UI/product surface before the triage workflow exists. |
| 4   | Standalone heatmap                  | Folded into the stronger Observation Triage Workbench idea.                      |
| 5   | Everything fails until classified   | Too disruptive for 421 current observations; better as a graduation ladder.      |


## Recommended Sequence

1. Build the Observation Triage Workbench.
2. Add the Finding Graduation Ladder.
3. Add the Dynamic Surface / New Focus Sentinel.
4. Add Catalog Change Impact Preview.
5. Write the Workload Envelope Authoring Guide.
6. Explore Redistribution-Free Builder Comparison.

## Continuation: Post-Triage Workflow Selection

Later on 2026-05-01, the branch state changed: the triage workflow foundation from `docs/plans/2026-05-01-002-feat-generated-diagnostics-triage-workflow-plan.md` now has U1-U3 implemented.

Updated snapshot:

- U1 stable diagnostic triage identity: complete.
- U2 triage registry and workbench output: complete.
- U3 freshness and graduation gates: complete.
- Current triage workbench: 53 registry entries, 0 blockers, 0 warnings, 32 `defer` groups, and 21 `generator_policy_investigation` groups.
- Newly selected next plan unit: U4 decision-debt compression review.
- Remaining follow-up units after compression: U5 dynamic surface/new focus sentinel, U6 catalog change impact preview, U7 workload envelope guide, and U8 redistribution comparison diagnostic.

### Selected Handoff: Decision-Debt Compression Review

**Description:** Group the 32 deferred entries and 21 generator-policy investigations into a smaller set of human-sized decision prompts before any catalog or generator work.

**Rationale:** U1-U3 made observations durable and fail-closed for future drift, but the current workbench still leaves the maintainer with 53 row-level decisions. Compressing those rows by decision type can reveal whether the next meaningful action is human policy review, U5 sentinel work, U7 authoring guidance, or U8 redistribution evidence.

**Downsides:** This is mostly workflow/doc value unless it feeds back into the plan. Avoid turning it into a new UI surface or a broad decision framework.

**Confidence:** 90%

**Complexity:** Low / Medium

**Status:** Explored

### Updated Sequence Hypothesis

1. Close out and verify the completed U1-U3 slice.
2. Add U4 decision-debt compression before starting the remaining U5-U8 follow-ups.
3. Use that pass to decide whether the next implementation unit should be U5 dynamic surface sentinel, U8 redistribution comparison, or U7 workload envelope guidance.
4. Defer U6 catalog impact preview until a concrete gap card, cap edit, or candidate catalog change exists.

## Continuation: Post-U7 Next Work Selection

Later on 2026-05-01, U4 decision-debt compression and U7 workload envelope guidance were implemented and committed. The current next-step choice is no longer "write the guide"; it is which remaining diagnostic workflow guard should come next.

Grounding from the continuation pass:

- Codebase scan favored a small, high-signal workflow guard over another broad documentation pass.
- Prior learnings search found no `docs/solutions/` base, so this diagnostics workflow is new institutional territory.
- External analogues favored changed-surface gates, actionable review diagnostics, affected-set impact analysis, lineage previews, and sentinel-event learning loops.
- U6 impact preview is useful, but the strongest U6 shape is a proposal gate or receipt until a concrete catalog/cap proposal exists.

### Updated Ranked Survivors

#### 1. Dynamic Surface / New Focus Sentinel

**Description:** Add a diagnostic preflight that compares product-supported focuses, setup configurations, durations, levels, and future theme contracts against generated diagnostics coverage. New surfaces must be included, explicitly `not_applicable`, or deferred with a reason.

**Rationale:** This protects future branch work from silently adding supported surfaces that diagnostics do not cover. It is the closest repo analogue to "clean as you code": keep known debt routed, but fail closed on newly changed scope.

**Downsides:** Needs careful scope so synthetic surfaces do not become artificial tests disconnected from shipped product support.

**Confidence:** 91%

**Complexity:** Medium

**Status:** Explored

#### 2. Redistribution Causality Snapshot

**Description:** Add a diagnostic-only counterfactual that summarizes current redistribution-affected groups against a no-redistribution or isolated-redistribution run, without changing shipped `buildDraft()` behavior.

**Rationale:** The current generator-policy lane still contains 21 groups and 236 redistribution-affected cells. This would separate catalog-envelope pressure from optional-slot redistribution effects before any generator-policy change.

**Downsides:** More analytical than protective; it may be better immediately after the dynamic-surface sentinel unless redistribution is blocking a concrete decision.

**Confidence:** 86%

**Complexity:** Medium

**Status:** Unexplored

#### 3. Diagnostics Freshness Diff / Changed-Surface Baseline

**Description:** Add a compact regenerated-report diff that shows new, disappeared, worsened, or reclassified groups since the last generated report.

**Rationale:** Maintainers should review diagnostic deltas instead of rereading the whole matrix after every regeneration. This could pair well with U5 if the sentinel needs a changed-surface baseline.

**Downsides:** It needs a stable comparison source and could overlap with existing stale-fingerprint checks if scoped too broadly.

**Confidence:** 82%

**Complexity:** Low / Medium

**Status:** Unexplored

#### 4. U6 Proposal Gate / Catalog Blast-Radius Receipt

**Description:** Define the smallest concrete proposal shape needed before U6 preview tooling is worth building: affected group keys, changed catalog IDs, proposed metadata/content deltas, evidence path, expected diagnostics movement, and verification commands.

**Rationale:** This keeps U6 from becoming abstract tooling. It turns impact preview into something driven by a real gap card, cap edit, or activation manifest.

**Downsides:** It may feel like planning infrastructure rather than product diagnostics until a real catalog proposal appears.

**Confidence:** 78%

**Complexity:** Low / Medium

**Status:** Unexplored

#### 5. Maintainer Action Queue

**Description:** Produce a short next-action queue from compressed prompts: decide, gather evidence, route to U8, prepare U6 proposal, or no action.

**Rationale:** The hard part has shifted from seeing observations to choosing the next human move.

**Downsides:** Risks hiding judgment too early if the queue pretends to auto-pick policy outcomes.

**Confidence:** 74%

**Complexity:** Low

**Status:** Unexplored

#### 6. Sentinel Learning Loop / Workflow Pattern Capture

**Description:** After the next unit lands, capture the diagnostics workflow as a reusable pattern or learning: generated report -> stable identity -> triage registry -> compression -> policy guide -> sentinel/impact gate.

**Rationale:** No prior `docs/solutions/` learning base exists, and this branch is creating a reusable diagnostics workflow.

**Downsides:** It is better as a close-out action after U5 or U8 than as the main next implementation unit.

**Confidence:** 70%

**Complexity:** Low

**Status:** Unexplored

### Rejection Summary


| #   | Idea                                  | Reason Rejected                                                      |
| --- | ------------------------------------- | -------------------------------------------------------------------- |
| 1   | Direct catalog edits from diagnostics | Still violates source-backed gap-card and U7 boundaries.             |
| 2   | Full U6 preview tool now              | Too abstract until a concrete catalog/cap proposal exists.           |
| 3   | Prompt disposition buttons as data    | Useful later, but premature without a stable human review loop.      |
| 4   | Threshold ownership map               | Valuable as a detail inside U5/U8, too thin as standalone next work. |
| 5   | Workload-envelope executable fixtures | U7 just landed; better after actual metadata proposal pressure.      |
| 6   | Runtime-catalog boundary guard        | Mostly covered by U7 guide and route fields.                         |
| 7   | Auto-pick next unit                   | Duplicates action queue and risks hiding human judgment too early.   |
| 8   | U5/U8 bridge                          | Good future integration, too broad for the immediate next unit.      |


### Updated Recommendation

Proceed to `/ce-plan` on **Dynamic Surface / New Focus Sentinel** using `docs/brainstorms/2026-05-02-generated-diagnostics-dynamic-surface-sentinel-requirements.md`. Keep U8 redistribution causality snapshot as the strongest alternate if generator-policy evidence becomes the immediate blocker.

## Continuation: Post-U5 Next Work Selection

On 2026-05-02, U5 dynamic surface/new focus sentinel was implemented and verified. The next-step question shifted from protecting future supported-surface drift to choosing the strongest remaining evidence gate before catalog or generator policy changes.

Grounding from the continuation pass:

- U1-U5 and U7 are now complete in `docs/plans/2026-05-01-002-feat-generated-diagnostics-triage-workflow-plan.md`.
- The generated triage workbench still has 53 routeable groups: 32 `defer` groups and 21 `generator_policy_investigation` groups.
- The generator redistribution compression lane has 21 groups, 251 total affected cells, 236 redistribution-affected cells, and recommends U8.
- U6 remains valuable, but the plan intentionally waits for a concrete gap card, cap edit, metadata edit, or catalog proposal.
- External analogues favored changed-scope/delta gates, schema compatibility checks, blast-radius reports, and owner-routed action queues.
- No `docs/solutions/` learning base exists for this workflow yet.

### Updated Ranked Survivors After U5

#### 1. U8 Redistribution Causality Receipt

**Description:** Add a diagnostic-only redistribution comparison receipt for the 21 generator-policy groups. It should separate cells that only look bad because optional slots redistributed minutes from cells that remain over cap or under minimum without redistribution.

**Rationale:** This is the most concrete remaining decision blocker. It directly follows the current compression lane and can produce evidence without changing shipped `buildDraft()` behavior.

**Downsides:** Counterfactual diagnostics can overclaim. The output must be framed as evidence, not generator policy.

**Confidence:** 91%

**Complexity:** Medium

**Status:** Explored

#### 2. Changed-Diagnostics Delta Gate

**Description:** Add a compact report-adjacent diff for new, disappeared, worsened, changed-route, changed-fingerprint, or changed-surface diagnostics since the prior generated report.

**Rationale:** U5 made surface drift fail-closed; the next leverage layer is reviewing diagnostic deltas instead of rereading the whole matrix.

**Downsides:** Needs a stable baseline and may overlap with existing stale-fingerprint checks if scoped too broadly.

**Confidence:** 84%

**Complexity:** Low / Medium

**Status:** Unexplored

#### 3. U6 Proposal Admission Ticket

**Description:** Define the minimum concrete proposal shape required before U6 preview tooling should run: changed IDs, expected metadata/content deltas, affected groups, evidence path, expected diagnostic movement, and verification hooks.

**Rationale:** Keeps U6 from becoming abstract comparison tooling before there is a real catalog/cap proposal.

**Downsides:** It is enabling workflow, not the full impact preview.

**Confidence:** 81%

**Complexity:** Low / Medium

**Status:** Unexplored

#### 4. Maintainer Decision Queue

**Description:** Convert compressed prompts into a short queue of human decisions: accept policy allowance, gather evidence, route to U8, prepare U6 proposal, or no action.

**Rationale:** The workflow now has durable diagnostics, triage, compression, guidance, and sentinel gates; the human next action is still partly implicit.

**Downsides:** Can hide judgment if it pretends to decide outcomes automatically.

**Confidence:** 78%

**Complexity:** Low

**Status:** Unexplored

#### 5. Diagnostics Compatibility Policy Matrix

**Description:** Define which generated diagnostics changes are allowed silently, which require a baseline update, which require proposal preview, and which fail closed.

**Rationale:** External schema/new-code analogies point to explicit compatibility modes as the way to keep gates trusted and low-noise.

**Downsides:** Could become policy paperwork unless tied to U8/U6/delta outputs.

**Confidence:** 74%

**Complexity:** Low / Medium

**Status:** Unexplored

#### 6. Diagnostics Workflow Pattern Capture

**Description:** Capture the reusable generated diagnostics workflow as the first `docs/solutions` learning: report -> identity -> triage -> graduation -> compression -> guidance/sentinel -> causality/impact gates.

**Rationale:** This branch has created an institutional pattern and no `docs/solutions` baseline exists yet.

**Downsides:** Better as closeout or companion work than the main next implementation unit.

**Confidence:** 70%

**Complexity:** Low

**Status:** Unexplored

### Rejection Summary

| #   | Idea                          | Reason Rejected                                                                |
| --- | ----------------------------- | ------------------------------------------------------------------------------ |
| 1   | Direct catalog edits          | Still violates source-backed gap-card and U7 boundaries.                       |
| 2   | Full U6 preview tool now      | Too abstract without a concrete proposal.                                      |
| 3   | Broad owner-routed queue      | Useful later, but premature before the remaining evidence gates are clearer.   |
| 4   | Deferred workload heat strip  | Mostly duplicates U7 plus existing compression lanes.                          |
| 5   | Workflow fixture pack         | Good implementation detail inside U8/U6/delta work, not the main next idea.    |
| 6   | Surface change ledger         | Mostly absorbed by U5 and the stronger changed-diagnostics delta gate.         |
| 7   | Machine-only routing receipt  | Useful as part of action queue/delta output, too thin standalone.              |
| 8   | Generator policy pain ledger  | Duplicates U8 without the counterfactual evidence that makes U8 valuable.      |

### Updated Recommendation

U8 has now been brainstormed, planned, and implemented as a redistribution causality receipt in the generated diagnostics report and triage workbench. Use the generated receipt to decide whether specific groups route toward future generator-policy decisions, workload/block-shape review, source-backed proposal work, U6 proposal admission, or no implementation action. Keep the changed-diagnostics delta gate as the best remaining alternate if the next bottleneck shifts from generator-policy evidence to report-review ergonomics.

---

## Continuation: Post-U8 Proposal Admission Selection

### Grounding

- U8 produced a generated redistribution causality receipt with 21 groups and 251 total affected cells.
- The strongest concrete proposal candidate is `gpdg:v1:d47:d47-solo-open:main_skill:true:optional_slot_redistribution+over_authored_max+over_fatigue_cap`.
- That group maps to `d47` / `d47-solo-open` (Four Great Sets / Solo open) and carries mixed evidence: 30 affected cells, 12 pressure-disappears cells, 18 pressure-remains cells, and 6 non-redistribution pressure cells.
- U6 remains intentionally gated on a concrete gap card, cap edit, workload metadata edit, or catalog proposal; the next move should define admission criteria before preview tooling.
- External analogues favored RFC/KEP-style admission, API diff gates, catalog validation, merge queues, and experiment guardrails.

### Fresh Ranked Survivors After U8

#### 1. U6 Proposal Admission Ticket For D47

**Description:** Define the minimum proposal package for `d47-solo-open`: group key, changed IDs, proposed workload/block/content delta, evidence path, expected diagnostic movement, and verification hooks.

**Rationale:** This is the strongest bridge from U8 evidence to proposal planning without prematurely building full U6 preview tooling.

**Downsides:** It is workflow scaffolding and proposal framing, not the actual preview implementation.

**Confidence:** 91%

**Complexity:** Low / Medium

**Status:** Explored

#### 2. Mixed-Evidence Split For Pressure-Remains Groups

**Description:** Split a mixed receipt into generator-policy evidence, remaining workload/block pressure, and non-redistribution pressure.

**Rationale:** `d47-solo-open` has multiple true signals; one fix path would overclaim.

**Downsides:** Can duplicate U8 receipt output unless scoped as proposal input.

**Confidence:** 88%

**Complexity:** Low

**Status:** Unexplored

#### 3. D47 Source-Backed Block/Workload Proposal Stub

**Description:** Create a proposal stub for Four Great Sets / Solo open that evaluates workload envelope, block shape, and source-backed content depth without prescribing a fix.

**Rationale:** It turns the receipt-backed candidate into a concrete brainstorm target while preserving the no-direct-catalog-edit boundary.

**Downsides:** Needs care not to jump straight to catalog edits.

**Confidence:** 84%

**Complexity:** Low / Medium

**Status:** Unexplored

#### 4. Changed-Diagnostics Delta Gate

**Description:** Add a compact report-adjacent diff for new, disappeared, worsened, changed-fingerprint, changed-route, changed-receipt, and changed-surface diagnostics.

**Rationale:** Strong next leverage if the bottleneck is reviewing future report changes, not this specific d47 proposal.

**Downsides:** Less directly tied to the immediate proposal plan.

**Confidence:** 82%

**Complexity:** Medium

**Status:** Unexplored

#### 5. Maintainer Decision Queue

**Description:** Compile triage compression plus U8 routes into a short queue of decisions: accept policy, prepare U6 proposal, request source evidence, defer generator policy, or no action.

**Rationale:** The workflow now has evidence, but the human next action remains partly implicit.

**Downsides:** Could become ceremony if it tries to decide automatically.

**Confidence:** 78%

**Complexity:** Low / Medium

**Status:** Unexplored

#### 6. Diagnostics Compatibility Policy Matrix

**Description:** Define which generated diagnostic changes are silent, baseline-update-only, proposal-gated, policy-gated, or fail-closed.

**Rationale:** Helps keep diagnostics trusted as the matrix and receipt outputs evolve.

**Downsides:** Better after one or two proposal workflows expose real change categories.

**Confidence:** 73%

**Complexity:** Low / Medium

**Status:** Unexplored

#### 7. Diagnostics Workflow Pattern Capture

**Description:** Capture the generated diagnostics workflow as the first reusable `docs/solutions` learning.

**Rationale:** There are no prior learnings, and this branch has created a reusable pattern.

**Downsides:** Closeout/compounding work, not the highest-leverage next product step.

**Confidence:** 70%

**Complexity:** Low

**Status:** Unexplored

### Fresh Rejection Summary

| #   | Idea                              | Reason Rejected                                                                      |
| --- | --------------------------------- | ------------------------------------------------------------------------------------ |
| 1   | Full U6 preview now               | Still too abstract before a concrete proposal exists.                                |
| 2   | Generic automated admission linter | Better after the first admission ticket proves the shape.                            |
| 3   | Shadow proposal object            | Useful implementation variant of the d47 admission ticket, not a standalone idea.    |
| 4   | Generator-policy experiment guardrail | Important later, but less immediate than pressure that remains without redistribution. |
| 5   | Negative theme coverage contract  | Mostly covered by U5.                                                                |
| 6   | 10x diagnostics volume budget     | Useful later, not the next bottleneck.                                               |
| 7   | Stable proposal identity          | Good convention inside the admission ticket, not a standalone idea.                  |

### Fresh Recommendation

Proceed to `/ce-brainstorm` on **U6 Proposal Admission Ticket For D47**. The brainstorm should produce a focused requirements addendum that defines what a receipt-backed candidate must contain before U6 preview planning begins.