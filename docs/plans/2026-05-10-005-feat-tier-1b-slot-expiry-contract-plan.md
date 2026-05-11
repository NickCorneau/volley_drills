---
id: tier-1b-slot-expiry-contract-plan-2026-05-10
title: "feat: Tier 1b Slot Expiry Contract"
type: feat
status: active
stage: validation
summary: "Convert the 6 unconsumed Tier 1b drill-cap slots into a structured kill-or-author contract with a hard 2026-07-20 expiry. Adds structured slot records + machine-readable cap-status-data JSON block in docs/status/post-m001-content-backlog.md, a cap_status_must_be_consistent validator in scripts/validate-agent-docs.sh, and cross-references from docs/status/m001-validation-overhang.md and the adversarial memo. Does not author or kill any slot."
date: 2026-05-10
origin: docs/ideation/2026-05-10-open-ideation.md
---

# feat: Tier 1b Slot Expiry Contract

## Summary

Convert the 6 unconsumed Tier 1b drill-cap slots from indefinite reservation into a structured kill-or-author contract with a hard expiry of 2026-07-20 (D130 founder-use window close). Each reserved slot will carry an explicit `slot_id`, `expiry`, `status` (`reserved` / `authored` / `killed`), required-trigger citation, and `last_checked` date inside `docs/status/post-m001-content-backlog.md`. A new validator function wired into `scripts/validate-agent-docs.sh` enforces structural contract integrity. Reserved-slot drift becomes structurally indistinguishable from cap-discipline failure: by 2026-07-20, every slot must have either a logged author-record citing trigger evidence (D135 source-validity gated) or a logged kill-record citing absence of trigger evidence.

---

## Problem Frame

The Tier 1b authoring cap (10 drill-record slots, anti-displacement-enforced by `docs/plans/2026-04-20-m001-adversarial-memo.md`) is the strongest signal-discipline mechanism in the repo. Layer A consumed 4 slots (`d31`, `d33`, `d40`, `d42`). The remaining 6 are reserved without explicit expiry — 4 are specifically named in `docs/status/post-m001-content-backlog.md` with cited triggers, 2 are unallocated reservation slack.

Today, the cap only generates evidence when a trigger fires. An unfired trigger generates **silence**, not evidence. With the D130 founder-use window closing in 73 days (2026-07-20), "cap held 4/10 with 6 silent reservations" is not a meaningful read for the founder-use mode re-eval; "cap held 4/10 with 6 logged kill-or-author decisions citing source evidence" is. D135 already frames founder feature-wishes as INPUT (not trigger hits) — but currently leaves indefinite reservation unmarked. This plan closes that gap by making no-trigger explicit and dated.

---

## Requirements

- R1. Every reserved Tier 1b cap slot has a structured record in `docs/status/post-m001-content-backlog.md` with a stable `slot_id`, an `expiry: 2026-07-20`, a `status` from a closed vocabulary, and a `last_checked` date.
- R2. The full 6 reserved slots are enumerated, including the 2 currently unallocated reservation slack slots (named explicitly as `unallocated`).
- R3. Each slot record names its required trigger source as a citation to an existing canonical doc (per D135 source-validity gating) — author-records cite trigger evidence, kill-records cite trigger-absence evidence, reserved records cite the unfired trigger contract.
- R4. A machine-readable cap-state block in `post-m001-content-backlog.md` mirrors the markdown narrative so the validator can read structured state without parsing prose.
- R5. The structural contract is validated by a function in `scripts/validate-agent-docs.sh` that fails closed if a slot's status falls outside the closed vocabulary, if a `reserved` slot lacks an `expiry`, if `expiry` has passed without status transition, or if an `authored`/`killed` record lacks the required citation field.
- R6. The contract is referenced from `docs/status/m001-validation-overhang.md` Calendar-Dated Reads so the 2026-07-20 read includes a Cap Status check, and from the adversarial memo's Amendment Log so the cap-account principle stays linked to its authority.
- R7. The plan delivers the contract structure and the validator; it does not propose authoring or killing any specific slot — those decisions remain owned by the partner-walkthrough / founder-ledger trigger sources cited in each slot record.

---

## Scope Boundaries

- Does not author any new drill records or consume any Tier 1b slot.
- Does not kill any reserved slot — recording a slot as `reserved` with an unfired-trigger citation is the default state for every slot at landing time.
- Does not change the cap value (10) or anti-displacement enforcement; both remain owned by `docs/plans/2026-04-20-m001-adversarial-memo.md`.
- Does not relax D135 source-validity gating; the contract leans on D135, doesn't redefine it.
- Does not extend the same contract to Tier 1a (`d31`, `d33`, `d40`, `d42`) — those slots are `consumed/authored` historically; the contract is for the 6 unconsumed slots only. Logging Layer A consumption as historical `authored` records is optional polish, not required.
- Does not redesign or relocate the diagnostics report (`docs/reviews/2026-05-01-generated-plan-diagnostics-report.md`). The ideation's "Cap Status panel in the diagnostics report" instinct is rerouted to the cleaner home — `post-m001-content-backlog.md` already enumerates the slots and is the canonical authority; the diagnostics report is a generated-plan-shape artifact, not a backlog artifact.

### Deferred to Follow-Up Work

- Per-slot author plans when any of the 6 reserved slots' triggers fire (separate `feat:` plans citing the cap-status record by `slot_id`).
- 2026-07-20 read-out itself — the read happens against the contract this plan delivers, but the read is owned by the D130 re-eval ritual, not by this plan.
- Generalizing the contract to other cap-discipline surfaces (e.g., Phase 2B capture-shape reservations, externally gated drills `d36` / `d43`) — out of scope here; if the pattern proves useful, a follow-up plan can extend it.

---

## Context & Research

### Relevant Code and Patterns

- `docs/status/post-m001-content-backlog.md` — current home of the Tier 1b residual list. Pre-this-plan: 4 named slots with prose status notes, 6 reserved total per the section header ("remaining 6 slots are reserved"), but only 4 enumerated. This plan upgrades the 4 named records to structured form and adds 2 unallocated records.
- `scripts/validate-agent-docs.sh` — canonical pattern for repo-wide doc validators. Uses bash + python3 heredocs. The successor-metadata, canonical-frontmatter, and catalog-doc-paths validators are the closest precedents for the new cap-status validator.
- `app/scripts/validate-generated-plan-diagnostics-report.mjs` — pattern for embedding a machine-readable JSON block inside a markdown doc behind `<!-- diagnostic-report-data:start --> ... <!-- diagnostic-report-data:end -->` fences. The cap-status block will follow the same fence convention but live inside `post-m001-content-backlog.md`, not in a generated report.
- `docs/plans/2026-04-20-m001-adversarial-memo.md` lines 250–254, 289–293 — current prose record of Tier 1b trigger conditions and trigger-status updates. Source of truth for the trigger citations each slot record will carry.
- `docs/research/founder-use-ledger.md` — ledger source of trigger-firing evidence for slots whose triggers are founder-side. Referenced as the citation target in slot records whose trigger relies on founder-ledger row evidence.

### Institutional Learnings

- `docs/solutions/2026-05-04-source-backed-content-depth-activation-pattern.md` — establishes the D135-derived discipline that no content authoring fires without cited source-valid evidence. The slot-expiry contract is the no-trigger half of the same discipline: absence of evidence must also be cited and dated, not silent.
- The 2026-04-23 walkthrough closeout polish (memo Amendment Log) shipped 6 editorial-class items **without consuming cap slots** because the items were not new drill records. This precedent confirms that the cap is specifically the *drill-record* authoring cap, not a general feature cap. The slot record vocabulary inherits this distinction.

### External References

- None. This is internal governance work grounded in existing repo decisions (D130, D135, the adversarial memo's anti-displacement enforcement). No external research adds value.

---

## Key Technical Decisions

- **Cap-status canonical home is `docs/status/post-m001-content-backlog.md`, not the diagnostics report.** The diagnostics report is a generated-plan-shape artifact (focuses × configurations × levels × durations × seeds, observation-only cells). The backlog doc is the canonical authority on trigger-gated content adds. Adding cap-state to the backlog keeps the citation chain short (slot → trigger source → canonical authority).
- **Machine-readable block uses a JSON code fence with `<!-- cap-status-data:start --> / <!-- cap-status-data:end -->` markers**, mirroring the diagnostics report's `<!-- diagnostic-report-data:start -->` pattern. This keeps the validator independent of markdown-table parsing fragility.
- **Status vocabulary is closed: `reserved` / `authored` / `killed`.** No `partial`, `pending`, `under_review`. Ambiguity is the failure mode the contract exists to prevent.
- **Slot IDs are stable and human-readable.** Format: `t1b-<short-name>` (e.g., `t1b-pair-opening-block`, `t1b-pair-role-swap-cue`, `t1b-rep-counter`, `t1b-stretch-demo`, `t1b-unallocated-5`, `t1b-unallocated-6`). The two unallocated slots are explicit, not implicit.
- **Expiry is hard-coded to `2026-07-20` for every reserved slot.** D130 window close is the binding gate; per-slot custom expiries would re-introduce drift. If a slot's trigger fires before expiry, it transitions to `authored` (with cited trigger evidence) and the expiry field is preserved as historical metadata.
- **Validator runs in `validate-agent-docs.sh` (single CI gate), not as a separate `npm run` target.** The backlog doc is a status surface, not an app-coupled artifact; co-locating with the agent-docs validator keeps the single source-of-truth for repo-level doc validity.
- **Calendar-time guard fires as a warning, not a hard failure, until 2026-07-20.** Hard failure post-expiry on any remaining `reserved` slot. Before expiry, the validator confirms structure only — `last_checked` staleness is not enforced (the weekly Monday ritual is the staleness mechanism).

---

## Open Questions

### Resolved During Planning

- **Where should the cap-status panel live?** → Resolved: `docs/status/post-m001-content-backlog.md`, not the diagnostics report. The backlog doc is already the canonical authority on trigger-gated content adds; the diagnostics report is a different surface (generated-plan-shape, not content-cap).
- **Should the validator extend to Tier 1a consumed slots (`d31`, `d33`, `d40`, `d42`)?** → Resolved: No. Those are historical `authored` records and the contract's purpose is the unconsumed reservation problem. Optional polish to log them as historical `authored` records may follow, but is not required by this plan.
- **Status vocabulary?** → Resolved: closed set `reserved` / `authored` / `killed`. No intermediate states.

### Deferred to Implementation

- Whether the validator should emit a warning when `last_checked` is more than 14 days stale on any `reserved` slot. Implementer's call — could be added as a non-blocking warning if cheap; not required for the contract.
- Exact JSON shape for the machine-readable block — implementer authors against the validator's expectations once the validator is written.

---

## Implementation Units

- U1. **Define cap-status data shape and slot records in `post-m001-content-backlog.md`**

**Goal:** Add structured, validator-readable slot records to the backlog doc covering all 6 unconsumed Tier 1b slots — 4 named candidates plus 2 explicit `unallocated` slots. Records include `slot_id`, `expiry`, `status: reserved`, `required_trigger`, `trigger_source`, and `last_checked: 2026-05-10`. Add a `<!-- cap-status-data:start --> / <!-- cap-status-data:end -->` JSON fence mirroring the prose so the validator reads structured state.

**Requirements:** R1, R2, R3, R4

**Dependencies:** None

**Files:**
- Modify: `docs/status/post-m001-content-backlog.md`

**Approach:**
- Promote the existing prose "Tier 1b Drill-Cap Residual" section's 4 named items to structured slot records with explicit fields. Existing prose narrative stays as context above the records; the records become the authoritative source. Update the section's introductory paragraph to point at the structured records and the cap-status JSON block.
- Add 2 explicit `unallocated` slot records with the same shape so the contract covers the full 6/10 unconsumed cap.
- Insert the `<!-- cap-status-data:start -->` JSON fence below the slot records. The JSON object includes `cap_total: 10`, `consumed: 4`, `reserved: 6`, `authored_records: [...]` (Layer A IDs logged as historical reference, optional but useful), `reserved_slots: [...]` (the 6 records), `expiry_date: "2026-07-20"`, and `last_validated: "2026-05-10"`.
- Update the doc's `last_updated` frontmatter to `2026-05-10`.

**Technical design:** *(directional, not specification)*

```json
{
  "cap_total": 10,
  "consumed": 4,
  "reserved": 6,
  "expiry_date": "2026-07-20",
  "last_validated": "2026-05-10",
  "authored_records": [
    { "slot_id": "t1a-d31", "drill_id": "d31", "tier": "1a", "status": "authored", "shipped_date": "..." }
  ],
  "reserved_slots": [
    {
      "slot_id": "t1b-pair-opening-block",
      "tier": "1b",
      "status": "reserved",
      "expiry": "2026-07-20",
      "last_checked": "2026-05-10",
      "required_trigger": "partner-walkthrough ≥P1 finding",
      "trigger_source": "docs/milestones/m001-solo-session-loop.md#tier-1b",
      "description": "Pair opening-block — d30 Pair Pepper Progression + pair_long_warmup archetype variant"
    }
  ]
}
```

**Patterns to follow:**
- `app/scripts/validate-generated-plan-diagnostics-report.mjs` for the JSON-block-inside-markdown convention.
- Existing frontmatter and section structure in `docs/status/post-m001-content-backlog.md`.

**Test scenarios:** None — this unit is doc content. Verification via U3 validator output and `bash scripts/validate-agent-docs.sh` exit code.

**Verification:**
- The doc parses as valid markdown.
- The JSON fence parses as valid JSON.
- All 6 unconsumed cap slots are enumerated; total reserved = 6; total consumed = 4; sum = 10.
- Each `reserved` slot carries `slot_id`, `expiry: "2026-07-20"`, `required_trigger`, `trigger_source`, and `last_checked: "2026-05-10"`.

---

- U2. **Add `cap_status_must_be_consistent` validator to `scripts/validate-agent-docs.sh`**

**Goal:** Extend the existing agent-doc validator with a new function that parses the cap-status JSON block from `post-m001-content-backlog.md` and enforces the contract: every `reserved` slot has expiry + last_checked + trigger fields; status is in the closed vocabulary; sum of consumed + reserved == cap_total; `authored` records cite a `drill_id` or `shipped_date`; `killed` records cite a `kill_reason` and date; expired `reserved` slots after 2026-07-20 are a hard failure; total cap field matches the documented Tier 1b cap of 10.

**Requirements:** R5

**Dependencies:** U1 (validator parses what U1 writes)

**Files:**
- Modify: `scripts/validate-agent-docs.sh`
- Test: `scripts/test-validate-agent-docs.sh` (extend the existing test harness with a new case)

**Approach:**
- Add a new bash function `cap_status_must_be_consistent` mirroring the existing `successor_metadata_must_be_consistent` and `archive_lifecycle_must_be_consistent` patterns (python3 heredoc reads the doc and JSON block, emits `__missing_X__` / `__bad_X__` markers, bash converts each marker into an `errors+=` entry).
- Define a small set of failure markers:
  - `__cap_status_block_missing__`
  - `__cap_status_block_invalid_json__`
  - `__cap_total_mismatch__:<expected>:<found>`
  - `__cap_sum_mismatch__:<consumed_plus_reserved>:<cap_total>`
  - `__bad_slot_status__:<slot_id>:<status>`
  - `__missing_slot_field__:<slot_id>:<field>`
  - `__bad_authored_record__:<slot_id>:<reason>`
  - `__bad_killed_record__:<slot_id>:<reason>`
  - `__expired_reserved_slot__:<slot_id>:<expiry>` (hard failure when today > expiry)
- Wire the new function into the validator script's main execution sequence (after `successor_metadata_must_be_consistent`).
- Today's date for the expiry check should come from the `date +%Y-%m-%d` shell call, not be hard-coded — the validator must remain time-aware.

**Patterns to follow:**
- `successor_metadata_must_be_consistent` function in `scripts/validate-agent-docs.sh` (heredoc + marker pattern).
- `catalog_doc_paths_must_exist_and_use_known_status` for the closed-vocabulary status pattern.

**Test scenarios:**
- Happy path: U1's landed file passes the validator cleanly (validator exits 0, no errors).
- Edge case (vocabulary): a slot record with `status: pending` (outside closed vocabulary) fails with `__bad_slot_status__`.
- Edge case (missing field): a `reserved` slot missing `expiry` fails with `__missing_slot_field__:t1b-...:expiry`.
- Edge case (cap sum): `consumed: 5, reserved: 6` (sum 11) with `cap_total: 10` fails with `__cap_sum_mismatch__:11:10`.
- Edge case (JSON malformed): the JSON block contains a trailing comma or unclosed brace; validator reports `__cap_status_block_invalid_json__`.
- Edge case (block missing): `<!-- cap-status-data:start -->` fence not present; validator reports `__cap_status_block_missing__`.
- Error path (expired): an `authored_record_date` set to a date in the past combined with a slot still marked `reserved` and `expiry: 2026-07-20` — when run with a simulated "today" > 2026-07-20, the validator reports `__expired_reserved_slot__` as a hard failure. Test via fixture-file approach (temp file, simulated today via a small wrapper or by checking the marker emission logic in isolation).
- Happy path (post-expiry transition): a slot transitioned to `killed` with a `killed_date` and `kill_reason` cited passes cleanly even after 2026-07-20.

**Execution note:** Add the failing fixture cases to `scripts/test-validate-agent-docs.sh` first (test-first for the validator behavior), then implement the validator function so each fixture's expected error is produced. The existing validator has no test-first execution posture, but adding one to a new validator function keeps the marker schema honest.

**Verification:**
- `bash scripts/test-validate-agent-docs.sh` passes with the new fixtures.
- `bash scripts/validate-agent-docs.sh` passes against the actual `post-m001-content-backlog.md` after U1.
- Each failure-mode fixture in the test harness produces the expected marker; no fixture produces unexpected errors.

---

- U3. **Cross-reference the contract from `m001-validation-overhang.md` and the adversarial memo**

**Goal:** Make the cap-status contract discoverable from the M001 validation scoreboard (so the 2026-07-20 read includes a Cap Status check) and from the adversarial memo's Amendment Log (so the contract's authority chain is intact).

**Requirements:** R6

**Dependencies:** U1 (the cross-reference target must exist)

**Files:**
- Modify: `docs/status/m001-validation-overhang.md`
- Modify: `docs/plans/2026-04-20-m001-adversarial-memo.md`

**Approach:**
- In `m001-validation-overhang.md` Calendar-Dated Reads table, add a "Reads from" pointer in the 2026-07-20 row referencing the cap-status JSON block in `docs/status/post-m001-content-backlog.md`. Do not add a new row — the 2026-07-20 row already covers the gate.
- Add a small section "Cap Status Contract" below Calendar-Dated Reads with a one-paragraph summary citing `post-m001-content-backlog.md` as authority and naming the validator (`scripts/validate-agent-docs.sh#cap_status_must_be_consistent`).
- In `docs/plans/2026-04-20-m001-adversarial-memo.md`, append an Amendment Log entry for 2026-05-10 ("Tier 1b slot expiry contract landed") citing the plan path and the canonical authority (`post-m001-content-backlog.md`).

**Patterns to follow:**
- Existing Amendment Log entries in the adversarial memo (dated sub-sections with **Posture**, **Justification**, **Re-eval impact** structure).
- Existing Calendar-Dated Reads "Reads from" cells in `m001-validation-overhang.md` (citation-heavy, no restatement).

**Test scenarios:** None — doc cross-references. Verification by `bash scripts/validate-agent-docs.sh` (frontmatter integrity preserved) and visual confirmation that the references resolve.

**Verification:**
- `m001-validation-overhang.md` 2026-07-20 row's "Reads from" cell cites `docs/status/post-m001-content-backlog.md` cap-status JSON block.
- Adversarial memo Amendment Log carries a 2026-05-10 entry for the contract.
- `bash scripts/validate-agent-docs.sh` passes.

---

- U4. **Update `docs/catalog.json` summary on `post-m001-content-backlog.md`**

**Goal:** Refresh the catalog entry for `post-m001-content-backlog.md` so the `canonical_for` summary names the new cap-status contract responsibility. Existing entry omits the contract-and-validator role this plan introduces.

**Requirements:** R6 (catalog discoverability)

**Dependencies:** U1, U2, U3 (catalog summary names what the doc actually does after this plan)

**Files:**
- Modify: `docs/catalog.json`

**Approach:**
- Locate the existing `post-m001-content-backlog` entry in `docs.docs[]` and `research_routing[]`.
- Append a short clause to `canonical_for` naming the cap-status contract: "Also owns the Tier 1b slot expiry contract (`<!-- cap-status-data -->` JSON block + `cap_status_must_be_consistent` validator) under D135 source-validity gating; reserved-slot drift becomes structurally indistinguishable from cap-discipline failure at 2026-07-20."

**Patterns to follow:**
- Existing `canonical_for` clauses in catalog entries for status docs (`m001-validation-overhang`, `current-state`).

**Test scenarios:** None — JSON edit. Verification by `bash scripts/validate-agent-docs.sh` (catalog parse + entry-path-exists checks).

**Verification:**
- `docs/catalog.json` parses as valid JSON.
- `bash scripts/validate-agent-docs.sh` passes.
- Catalog entry for `post-m001-content-backlog.md` mentions the cap-status contract in its `canonical_for` text.

---

- U5. **Record initial cap state and run end-to-end validation**

**Goal:** Confirm the full pipeline works against current state: doc reads correctly, validator passes, cross-references resolve, catalog is consistent.

**Requirements:** R5, R7

**Dependencies:** U1, U2, U3, U4

**Files:**
- No new files; runs verification commands and confirms outputs.

**Approach:**
- Run `bash scripts/test-validate-agent-docs.sh` (validator unit tests with fixtures).
- Run `bash scripts/validate-agent-docs.sh` (full repo agent-doc validation including the new cap-status check).
- Run `python3 -c "import json; json.load(open('docs/status/post-m001-content-backlog.md').read().split('<!-- cap-status-data:start -->')[1].split('<!-- cap-status-data:end -->')[0].strip().lstrip('\`\`\`json').rstrip('\`\`\`'))"` (or equivalent in-script extraction) to confirm the JSON block parses.
- Confirm the validator emits no false positives against today's state (all 6 slots `reserved`, none expired, all citations present).

**Test scenarios:** None — verification step.

**Verification:**
- `bash scripts/test-validate-agent-docs.sh` exits 0.
- `bash scripts/validate-agent-docs.sh` prints "Agent doc validation passed." and exits 0.
- The cap-status JSON block parses cleanly.
- All 6 reserved slots have valid records; total consumed + reserved == 10.

---

## System-Wide Impact

- **Interaction graph:** The cap-status validator joins the existing repo-doc validators in `scripts/validate-agent-docs.sh`. It runs as part of the standard pre-commit/CI validation surface. No app runtime impact.
- **Error propagation:** Validator failures block the agent-doc validation script's success state — same blast radius as existing catalog/frontmatter failures. Failures surface as named markers in stderr.
- **State lifecycle risks:** The `last_checked` field is human-maintained and could drift. Mitigation: the Monday adversarial-memo ritual (already enforced) updates `last_checked` as part of the weekly read; the validator does not enforce freshness (only structural integrity), so drift is visible but not blocking.
- **API surface parity:** None — this is internal governance, no external consumers.
- **Integration coverage:** The validator is integration-tested via fixture files in `scripts/test-validate-agent-docs.sh`.
- **Unchanged invariants:** The Tier 1b cap value (10) is unchanged. Anti-displacement enforcement is unchanged. D135 source-validity gating is unchanged. The trigger conditions for each named slot are unchanged. This plan does not author or kill any slot.

---

## Risks & Dependencies

| Risk | Mitigation |
|------|------------|
| Validator becomes a burden if it fires false positives (e.g., a temporary state during a trigger-firing transition) | Closed vocabulary is small; transitions are atomic (a slot moves `reserved` → `authored` or `reserved` → `killed` in one edit). Pre-2026-07-20, expiry check is structural only, not time-blocking. |
| Cap-status JSON block drift from prose narrative | Single doc, both surfaces edited together; validator confirms the JSON is parseable and structurally consistent, but does not enforce prose-JSON equivalence. The prose is human-readable narrative; the JSON is the machine source of truth. Mitigate via Monday ritual reminder. |
| Post-2026-07-20 expired slots cause CI failures during the read-out window | This is the intended behavior — at expiry, every `reserved` slot must be `authored` or `killed`. The hard failure forces a real decision, which is the entire point of the contract. |
| Risk of pressuring premature authoring near 2026-07-20 if a trigger almost fires | D135 source-validity gating must hold. The validator does not relax D135 — a `status: authored` record without a real `trigger_source` citation pointing to existing evidence fails the validator. |
| 2 `unallocated` slots may be the wrong count if the underlying cap accounting in `post-m001-content-backlog.md` ("6 slots reserved") is itself inaccurate | The plan inherits the existing prose count (6 reserved, 4 named, 2 unallocated). If the accounting is off, the JSON block surfaces it visibly — which is a feature, not a bug. Pre-landing sanity check: cross-confirm against the adversarial memo's most recent "still 4 of 10 from Tier 1b Layer A" reading. |

---

## Documentation / Operational Notes

- The Monday adversarial-memo ritual (per `docs/status/m001-validation-overhang.md` Calendar-Dated Reads) gains a small new chore: update `last_checked` on each `reserved` slot during the weekly pass. This is a one-line mechanical edit per slot, no decision needed unless a trigger fires.
- The 2026-07-20 D130 re-eval reads the cap-status block as one of its inputs (per U3's cross-reference). If any slot is still `reserved` after expiry, the validator emits a hard failure that surfaces in the re-eval prep work.
- Future cap-discipline surfaces (e.g., Phase 2B capture-shape reservations) can follow the same pattern: structured slot records + machine-readable block + validator function. This plan is intentionally narrow — the pattern is a precedent, not a generalization.

---

## Sources & References

- **Origin document:** `docs/ideation/2026-05-10-open-ideation.md` (A5 survivor — Tier 1b Slot Expiry Contract)
- **Authority chain:** `docs/plans/2026-04-20-m001-adversarial-memo.md` (cap value + anti-displacement); `docs/decisions.md` D130, D135 (gating window + source-validity framing); `docs/status/post-m001-content-backlog.md` (canonical authority on Tier 1b residual)
- **Related plans:** `docs/plans/2026-04-20-m001-tier1-implementation.md` (Tier 1b trigger list); `docs/plans/2026-04-27-per-drill-capture-coverage.md` (D134 Phase 2A precedent for trigger-gated content adds)
- **Related research:** `docs/research/founder-use-ledger.md` (trigger-firing evidence source for founder-side slots); `docs/research/partner-walkthrough-results/2026-04-22-all-passes-reconciled.md` (Tier 1b reconciled bundle)
- **Validator precedents:** `scripts/validate-agent-docs.sh` (`successor_metadata_must_be_consistent`, `archive_lifecycle_must_be_consistent`, `catalog_doc_paths_must_exist_and_use_known_status`); `app/scripts/validate-generated-plan-diagnostics-report.mjs` (machine-readable-block-in-markdown convention)
