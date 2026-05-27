---
title: "docs: M001 executive closure + D132 ratification + M002 carry-forward"
type: docs
status: active
date: 2026-05-27
origin: docs/brainstorms/2026-05-27-attack-track-action-stack-requirements.md
---

# docs: M001 executive closure + D132 ratification + M002 carry-forward

## Summary

Two commits to `main`: first commit lands D132 ratification as a new dated decision row citing the founder's 2026-05-27 conversation prose. Second commit lands the M001 executive closure (new dated decision row, status doc transitions, AGENTS.md update, catalog updates) plus the M002 milestone doc update absorbing the carry-forward — ships as one atomic commit per the decision-debt-sweep pattern. No app code changes. The plan is entirely docs/decisions/status-doc edits with validator-pass as the verification spine.

---

## Problem Frame

Origin doc (`docs/brainstorms/2026-05-27-attack-track-action-stack-requirements.md`) captures the full Problem Frame: founder executive call on 2026-05-27 to close M001 today (not at 2026-07-20), absorb carry-forward into M002, ratify D132, defer Step 1 canonical-drill probe per Root B feasibility blockers. The plan executes that requirements doc; no plan-side reinvention of the closure shape.

---

## Requirements

- R1. D132 ratification decision row (D146) lands in `docs/decisions.md` with founder verbatim citation and "non-weakening clarification" framing (origin: R1-R4).
- R2. M001 executive closure decision row (D147) lands in `docs/decisions.md` with bypass disclosure, Path 1 prerequisite enumeration, trigger (e) honest status, Condition 1 honest read, pre-registered reversal condition (origin: R5-R9, R9a, R10-R12).
- R3. M001 milestone doc frontmatter transitions to `stage: complete` (existing enum value per `status_vocabularies.milestone_status.values`); Phase Posture section updates (origin: R10).
- R4. `docs/status/m001-validation-overhang.md` frontmatter transitions to `status: superseded`, pointing at `docs/status/current-state.md` (origin: R11).
- R5. `docs/status/current-state.md` gets a Recent Shipped History row for 2026-05-27 (origin: R12).
- R6. M002 milestone doc gets the R13 carry-forward section (Group A absorbed / Group B preserved-elsewhere) AND the R13a history-list dependency resolution in the same commit as R2-R5 (origin: R13, R13a).
- R7. AGENTS.md "Active milestone" + "Next milestone in queue" lines update; `docs/catalog.json` updates for M001 + m001-validation-overhang catalog entries (status + canonical_successor); validator suppression of SUCCESSOR_MISSING warning achieved (origin: R15a).
- R8. Tier 1b kill-or-author contract on the 6 reserved slots stays unchanged through 2026-07-20 (origin: R15, R22). No edits to `cap-status-data` JSON block in `docs/status/post-m001-content-backlog.md`.
- R9. 2026-07-20 D130 re-eval scope reframe is recorded in the M001 closure decision row only; no edit to the adversarial memo (origin: R14).
- R10. Step 6 (D132 ratification) ships before Step 3 (M001 closure) so the closure row can cite the D132 row's ID (origin: R18).
- R11. `bash scripts/validate-agent-docs.sh` passes after each commit (origin: R20).
- R12. Step 1 canonical-drill probe is NOT shipped under this plan (origin: "Explicitly deferred from today" + Scope Boundaries).

---

## Scope Boundaries

- No app code changes (no edits under `app/`).
- No new drill records.
- No schema changes (`attack` not added to `SkillFocus`; no `chain-attack` constant; no `sessionFocus` extension).
- No edits to `cap-status-data` JSON block — Tier 1b cap discipline preserved unchanged.
- No edits to the adversarial memo (`docs/plans/2026-04-20-m001-adversarial-memo.md`).
- No edits to `docs/status/post-m001-content-backlog.md` content — its Phase 2B and Tier 1b routing is preserved as the canonical authority (R6 Group B references it without absorbing).
- No `closed_executive` status-vocabulary extension in `docs/catalog.json` — uses the existing `complete` enum value.
- No new docs created beyond the two decision rows already enumerated. No new ideation, brainstorm, or research files.

### Deferred to Follow-Up Work

- Step 1 canonical-drill probe (FIVB 5.1 Stand and Spike) — deferred to M002 scope per the requirements doc's "Explicitly deferred from today" section. Any future authoring requires its own decision packet (D148-shape) with the schema work it actually requires.
- M002's eventual planning slice that engages with the carry-forward items (Tier 2 polish surfaces, cohort question, attack-content track shape) — owned by future M002 work.

---

## Context & Research

### Relevant Code and Patterns

- `docs/decisions.md` — single-row table format, sequentially numbered D-IDs (latest is D145; D146 + D147 are next available). New rows append to the end of the relevant table section.
- `docs/solutions/architecture-patterns/2026-05-25-decision-debt-sweep-pattern.md` — local precedent for decisions shipping bound to code/scope/doc changes in the same commit; M001 closure row + status-doc updates + M002 carry-forward must land together per R6.
- `docs/solutions/architecture-patterns/d137-canonical-pre-run-spine-setup-safety-2026-05-07.md` — local precedent for retroactive ratification (decision row landed after operative shape change). Less directly applicable here (executive close ships shape-and-decision-row together).
- `docs/milestones/m001-solo-session-loop.md` frontmatter: current `stage: build-complete-validating`; transitions to `stage: complete` per R3.
- `docs/status/m001-validation-overhang.md` frontmatter: current `status: active`; transitions to `status: superseded` per R4.
- `docs/milestones/m002-weekly-confidence-loop.md` lines 70 + 80: explicit "standalone history list is owned by M001 Tier 2" clauses — both must be resolved in U3 per R6.
- `docs/catalog.json` M001 catalog entry (current `status: active`) and m001-validation-overhang catalog entry (current `status: active`) — both need status updates per R7.
- `docs/catalog.json` `status_vocabularies.milestone_status.values: ['draft', 'ready', 'active', 'blocked', 'complete', 'deferred']` — confirms `complete` is valid; no enum extension needed.
- AGENTS.md "Current State" section (lines ~64-72) — "Active milestone" + "Next milestone in queue" lines.
- `scripts/validate-agent-docs.sh` — `cap_status_must_be_consistent` (preserved by R8), `successor_metadata_must_be_consistent` (R7 adds `canonical_successor` to suppress SUCCESSOR_MISSING warning).

### Institutional Learnings

- Source-backed content-depth activation pattern precedent (NOT applicable here — that pattern is for app code + drill records; this plan is entirely docs).
- Decision-debt-sweep pattern (applies directly — R6 commit binds decision row + status-doc updates + M002 doc edit).
- Route founder-use feedback without over-firing scope (D135 trigger discipline — confirms F1's first-class content-gap status is preserved as input to future M002 decisions, not load-bearing for this closure).

### External References

- None — entirely repo-internal docs work.

---

## Key Technical Decisions

- **Use existing `complete` enum value for M001 milestone `stage`** — extending the vocabulary to add `closed_executive` for one usage is framework-ahead-of-need per scope-guardian round 2 feedback. The executive-closure shape is captured in the decision row body + Phase Posture narrative, not in the enum value. Revisit only if a second executive-closure instance arises.
- **R6 M002 doc update lands in the same commit as R2-R5** — required by R13a in the requirements doc; required by decision-debt-sweep pattern. Splitting M002 edit into a separate commit would create a window where M001 is closed but M002's stated architecture still claims Tier 2 owns the history list.
- **R13a history-list resolution option** — Option (b) preferred: update M002's text to layer carry-forward + next-N queue directly on `ExecutionLog` records with no standalone history list precondition. Avoids expanding M002 core scope; avoids leaving Tier 2 as a permanent "discretionary post-M002-core" item that may never be reached. Option (a) expands M002 core; Option (c) creates a never-reached discretionary item.
- **Tier 1b cap-status JSON untouched** — R6 explicitly preserves the kill-or-author contract through 2026-07-20. Editing the JSON would risk the validator flagging cap inconsistency post-closure; leaving it untouched is the safe and correct preservation.
- **No adversarial memo edits** — R9 records the 2026-07-20 re-eval scope reframe in the M001 closure decision row only. The memo itself remains unedited; its weekly-review ritual and falsification conditions are preserved. Future weekly review entries can reference the closure decision row for context.
- **D146 + D147 sequencing** — U1 commits D146 first; U2 commits D147 + all status doc updates. The D147 row body references D146 by ID, so D146 must exist before D147 is authored.

---

## Open Questions

### Resolved During Planning

- "Exact `stage` value for milestone-doc frontmatter (origin Deferred to Planning item)" → Use existing `complete` per Key Technical Decisions above. The milestone-doc frontmatter `status` field ALSO transitions `active → complete` (both `status` and `stage` flip together to keep doc-vs-catalog consistency).
- "Exact frontmatter changes for `m001-validation-overhang.md` (origin Deferred to Planning item)" → Doc frontmatter: `status: active → superseded` (no `superseded_by` field — the validator only reads `canonical_successor` from catalog entries, and a `superseded_by: D147` value would hard-fail `successor_metadata_must_be_consistent` since D147 is not a doc path). Catalog entry: `status: superseded` + new `canonical_successor: docs/status/current-state.md` to suppress the SUCCESSOR_MISSING warning.
- "M002 history-list dependency resolution (origin R13a)" → Option (b) per Key Technical Decisions above.
- "AGENTS.md 'Next milestone in queue' post-closure target" → Keep the line; target stays `M002 (Weekly Confidence Loop, per D124)` — M002 is the queue-next regardless of whether it's `draft / planning` or `active`. M002 status remains `draft / planning` per U3 (M002 doesn't auto-activate on M001 closure).

### Deferred to Implementation

- Exact wording of the D147 row's pre-registered reversal condition (origin R9a): the row should name 1-2 specific observable outcomes at 2026-07-20 that would force a reopen-consideration log to the Amendment Log. The implementer drafts the wording from the requirements doc R9a language; review at apply-time.
- Exact placement of the M002 carry-forward section in the M002 milestone doc body — probably after "Explicitly out of scope" and before "Planning defaults and assumptions," but the implementer chooses placement that flows cleanly with the existing structure.
- Exact catalog entry placement for the new decision rows (D146, D147) — `docs/catalog.json` does not have per-decision entries for prior D-IDs (D140-D145 land implicitly under the `docs/decisions.md` entry). The implementer follows the existing convention: no new top-level `docs[]` entries; the `docs/decisions.md` entry's `last_updated` may be bumped.

---

## Implementation Units

- U1. **D132 ratification commit (Step 6)**

**Goal:** Land D146 as the D132 ratification decision row in `docs/decisions.md`, citing founder verbatim and recording non-weakening framing.

**Requirements:** R1, R10, R11

**Dependencies:** None — first commit in the sequence.

**Files:**
- Modify: `docs/decisions.md`

**Approach:**
- Add a new row D146 in the relevant decisions table section (probably appended to the latest table containing D145).
- Row body cites the founder's 2026-05-27 verbatim (both quotes: "Its true, we dont use Solo that much..." and "for solo its either just hard solo or training solo isnt where my time is spent, idk yet - i think the app does a decent job at solo training though...").
- Row body names both D132 sub-options (sport-hard / context-of-use) as routing to the same D132 frame; records the "idk yet" as named sub-ambiguity that does not block ratification.
- Row body explicitly confirms non-weakening: D132 was an active decision since 2026-04-22; this ratification clarifies a pending interpretive question without altering D132's falsification conditions, evidence requirements, or scope. No co-signer required under the adversarial-memo amendment rule.
- Row body cross-references D130 Condition 1's "ambiguous under D132 pair-first re-read" reading — confirms the ratification settles that ambiguity at the D132-frame level.
- Commit message: `docs(decisions): ratify D132 (D146) — pair-first / solo-accommodating frame settled from founder 2026-05-27 conversation prose`.

**Execution note:** None.

**Patterns to follow:**
- D141 (also a `O*`-resolution-style decision row from 2026-05-08) — similar shape: cites founder evidence, names what was settled, names what was NOT authorized.
- D137 retire-`/tune-today` pattern — shape for retroactive ratification of an already-active state.

**Test scenarios:**
- Test expectation: none — docs-only change; no app behavior or test surface affected.

**Verification:**
- `bash scripts/validate-agent-docs.sh` passes after the commit.
- D146 row visible in `docs/decisions.md`.
- D146 row body matches the requirements doc R1-R4 contract.
- Commit lands on `main` per single-branch flow; push to `origin` per AGENTS.md Operational Constraints.

---

- U2. **M001 executive closure commit (Step 3, first half — decision row + M001-side doc updates)**

**Goal:** Land D147 as the M001 executive closure decision row, plus all M001-side downstream status doc updates (M001 milestone, m001-validation-overhang, current-state.md, AGENTS.md, catalog.json M001 + overhang entries).

**Requirements:** R2, R3, R4, R5, R7, R9, R10, R11

**Dependencies:** U1 (D146 must exist before D147 cites it).

**Files:**
- Modify: `docs/decisions.md` (add D147 row)
- Modify: `docs/milestones/m001-solo-session-loop.md` (frontmatter: `stage: build-complete-validating → complete` AND `status: active → complete`; Phase Posture section updates; `decision_refs:` adds D146 + D147)
- Modify: `docs/status/m001-validation-overhang.md` (frontmatter: `status: active → superseded`; pointer prose to `docs/status/current-state.md` in body; `decision_refs:` adds D147. **Do NOT add `superseded_by` field** — validator's `frontmatter_superseded_by` check would hard-fail on a non-doc-path value like `D147`; the catalog entry's `canonical_successor` carries the routing role)
- Modify: `docs/status/current-state.md` (add Recent Shipped History row for 2026-05-27; update Snapshot section's "Active milestone" bullet to reflect post-closure state)
- Modify: `AGENTS.md` (Current State section: "Active milestone" transitions `M001 → M002`; "Next milestone in queue" stays `M002 per D124` since M002 is still the queue-next; do NOT delete the line)
- Modify: `docs/roadmap.md` (update line ~134 "Under D130, Phase 1's M001 was built in tiers... and is now build-complete-validating" — replace with post-closure framing citing D147; the "Tier 2 polish is gated on the 2026-05-21 Condition 3 read-out" clause is also stale and should be updated)
- Modify: `docs/catalog.json` (M001 catalog entry: `status: active → complete`, `canonical_for` description rewrite naming D147 executive closure + pointing routing queries at `docs/status/current-state.md`; m001-validation-overhang catalog entry: `status: active → superseded` + new `canonical_successor: docs/status/current-state.md` field + `canonical_for` description rewrite reflecting `superseded` state; top-level `repo_state.active_milestone: "M001" → "M002"`; `_meta.last_updated: "2026-05-25" → "2026-05-27"`)

**Approach:**
- D147 row body (drafted from requirements doc R5-R9 + R9a + R14):
  - Cite founder verbatim executive call.
  - Enumerate Path 1's full preconditions (all 3 Falsification Conditions passing, Tier 1a + Tier 2 shipped, cohort move initiated) — bypass auditable.
  - Acknowledge the cost of departing from D130's 90-day novelty/VDM rationale per requirements doc Problem Frame.
  - Record trigger (e) status per memo's 2026-05-23 read ("not firing; clean"); explicitly does NOT claim (e) mitigation; pre-registered (e) consequence (A3 ligament + re-measure) named for transparency.
  - Record Condition 1 honest reads: fail-trending-under-standard-read / ambiguous-under-D132 / superseded-by-executive-call. Condition 2 + Condition 3 retain PASS.
  - Cite D146 (D132 ratification) as the basis for the D132-frame reading.
  - Pre-registered reversal condition: if 2026-07-20 cohort question cannot be decided cleanly under M002 evidence, M001 reopens for Tier 2 repoint per memo's Condition 1/3 consequences; log to Amendment Log.
  - Record 2026-07-20 re-eval scope reframe (D130 window close + cohort question on M002 evidence; does NOT re-read M001 closure).
- M001 milestone doc Phase Posture update: name the closure as executive on 2026-05-27; cite D147; record the bypass disclosure pointer.
- m001-validation-overhang Sources & References: add the closure decision row as the canonical successor for posture queries.
- current-state.md Recent Shipped History row: 1-2 paragraph entry summarizing the closure shape and the carry-forward routing.
- AGENTS.md update: "Active milestone" transitions from M001 to M002 (now `draft / planning`); "Next milestone in queue" updates to reflect M002 is now the active focus.
- catalog.json updates: M001 entry `status` matches milestone-doc value (`complete`); m001-validation-overhang entry `status: superseded` + `canonical_successor: docs/status/current-state.md`.
- Commit message: `docs(closure): M001 executive closure (D147) + status-doc + catalog updates`.

**Execution note:** Single atomic commit. Decision-debt-sweep pattern requires all M001-side doc updates land with the D147 row. Per R6, the M002 milestone doc edit (U3) ALSO lands in this same commit — see U3 for the M002-side content.

**Patterns to follow:**
- D137 retire-`/tune-today` pattern (`docs/solutions/architecture-patterns/d137-canonical-pre-run-spine-setup-safety-2026-05-07.md`) — closest precedent for retiring a surface (M001 milestone) with bound status-doc updates.
- Decision-debt-sweep pattern (`docs/solutions/architecture-patterns/2026-05-25-decision-debt-sweep-pattern.md`) — five-rule discipline: find decisions citing the changed mechanism, preserve original bodies, write eulogy (closure narrative), light drift-check adjacent, ship same-commit.

**Test scenarios:**
- Test expectation: none — docs-only change; no app behavior or test surface affected.

**Verification:**
- `bash scripts/validate-agent-docs.sh` passes after the commit (including `cap_status_must_be_consistent` — unchanged since cap-status JSON not touched; `successor_metadata_must_be_consistent` — no SUCCESSOR_MISSING warning for the overhang entry since `canonical_successor` is set).
- D147 row visible in `docs/decisions.md`, cites D146.
- M001 milestone-doc frontmatter `stage: complete`; Phase Posture section narrates executive closure.
- m001-validation-overhang frontmatter `status: superseded`; pointer to current-state.md present.
- current-state.md has Recent Shipped History row for 2026-05-27.
- AGENTS.md "Active milestone" line reflects post-closure state.
- `docs/catalog.json` M001 + m001-validation-overhang entries reflect post-closure status.
- Commit lands on `main`; push to `origin`.

---

- U3. **M002 carry-forward + history-list resolution (Step 3, second half — ships in same commit as U2)**

**Goal:** Update M002 milestone doc to absorb the M001 carry-forward (Group A / Group B split per R13) and resolve the history-list dependency (R13a Option (b): M002 layers on `ExecutionLog` records directly, no Tier 2 history-list precondition).

**Requirements:** R6 (origin: R13, R13a)

**Dependencies:** None at commit level — U3 ships in the **same atomic commit** as U2 per R6 + decision-debt-sweep pattern + R13a's "the closure commit must not ship without this M002 doc edit landing alongside R13's new section." Within that single commit, the D147 row body (authored by U2) must be drafted before the M002 doc text (authored by U3) cross-references it.

**Files:**
- Modify: `docs/milestones/m002-weekly-confidence-loop.md`

**Approach:**
- **R13 carry-forward section**: insert a new section (probably between "Explicitly out of scope" and "Planning defaults and assumptions"). Section header proposal: `## M001 carry-forward (post-2026-05-27 executive closure)`. Body contains the two-group split from requirements doc R13:
  - **Group A — Absorbed into M002 scope (discretionary post-M002-core follow-on)**: Tier 2 polish surfaces (See-Why modal, richer summary copy, recommendation-first onboarding polish — note: full session history screen removed from Group A per R13a Option (b)); friends-of-friends cohort question; attack-content track shape question.
  - **Group B — Preserved under existing routing**: Conditional Phase 2B per-drill capture shapes (owned by `docs/status/post-m001-content-backlog.md`); Tier 1b reserved-slot kill-or-author contract (owned by `docs/status/post-m001-content-backlog.md`).
  - Cross-reference D147 as the closure decision authorizing this section.
- **R13a history-list dependency resolution (Option (b))**: edit the existing "standalone history list is owned by M001 Tier 2" clauses (M002 milestone doc lines 70 + 80) to remove the M001 Tier 2 ownership claim. Replace with text reflecting that M002 layers carry-forward and next-N queue directly on `ExecutionLog` records (no standalone history list precondition). The Tier 2 history surface becomes one of the discretionary Group A items, not a precondition for M002's start.
- M002 milestone-doc frontmatter: `last_updated` bumped to 2026-05-27. `status` remains `draft` and `stage` remains `planning` — M002 doesn't activate just because M001 closed; M002 activates when its own planning happens.
- Optional: add an entry to `decision_refs` for D147 (the closure that authorized the carry-forward).
- Commit: same commit as U2 — both lands together.

**Execution note:** None.

**Patterns to follow:**
- M002 milestone doc's existing structure (Agent Quick Scan / Why this milestone exists / Milestone goal / In scope / Minimal surface contract / Explicitly out of scope / Planning defaults / Planning readiness / Post-build validation / Likely design artifacts / Review questions). Insert the new section between existing sections in a way that preserves the doc's flow.
- D147 row's carry-forward enumeration — the M002 doc edit mirrors that enumeration in M002-side prose.

**Test scenarios:**
- Test expectation: none — docs-only change; no app behavior or test surface affected.

**Verification:**
- `bash scripts/validate-agent-docs.sh` passes after the commit.
- M002 milestone doc has new carry-forward section with Group A + Group B split.
- M002 milestone doc lines 70 + 80 no longer claim "M001 Tier 2 owns history list"; instead reflect Option (b) `ExecutionLog`-layered carry-forward.
- M002 frontmatter `last_updated` updated; `status` + `stage` unchanged (M002 not auto-activated).
- D147 cross-reference present.
- M002 catalog entry in `docs/catalog.json` may need `last_updated` bump if entry has that field; otherwise no catalog change.

---

## System-Wide Impact

- **Interaction graph:** No app code touched; no callbacks, middleware, observers, or entry points affected.
- **Error propagation:** N/A — docs-only change.
- **State lifecycle risks:** Validator state: `cap_status_must_be_consistent` preserved (cap-status JSON untouched); `successor_metadata_must_be_consistent` preserved (new `canonical_successor` field added to the m001-validation-overhang catalog entry — NOT to doc frontmatter — to suppress SUCCESSOR_MISSING warning); `frontmatter_superseded_by` validator check NOT touched (no `superseded_by` field added to any doc frontmatter as part of this plan).
- **API surface parity:** N/A.
- **Integration coverage:** Cross-doc consistency: M001 milestone-doc frontmatter (`status: complete`, `stage: complete`) matches M001 catalog entry `status: complete`; m001-validation-overhang doc frontmatter `status: superseded` matches overhang catalog entry `status: superseded` + has `canonical_successor` set in catalog; AGENTS.md "Active milestone" matches the post-closure state and catalog's `repo_state.active_milestone`; `docs/roadmap.md` line 134 post-closure framing matches; `current-state.md` Snapshot bullet updated. Cross-references between D147 ↔ D146 ↔ founder-use ledger ↔ research notes ↔ ideation doc all preserved.
- **Unchanged invariants:**
  - Tier 1b cap discipline (cap-status JSON unchanged; kill-or-author contract through 2026-07-20 binds).
  - D130 founder-use window through 2026-07-20 (D147 names the reframed scope but does not cancel the date).
  - Adversarial memo (untouched; weekly-review ritual continues; falsification conditions preserved).
  - F1 first-class content-gap-evidence status (recorded in `docs/research/2026-05-27-attack-content-and-solo-friction-feedback.md`; preserved as input to future M002 content-priority decisions).
  - All other `docs/decisions.md` rows (no edits to existing decisions; only D146 + D147 added).
  - `docs/specs/m001-*.md` files (latent drift acknowledged; the validator does not enforce spec content alignment with milestone status; if any spec needs an update, it lands as separate cleanup work).
  - app/ tree (zero edits).

---

## Risks & Dependencies

| Risk | Mitigation |
|------|------------|
| `bash scripts/validate-agent-docs.sh` fails after U2 due to unexpected validator behavior on the catalog entry status transition | Run validator immediately after the U2 commit; if it fails, revert the commit (single revert restores prior state), debug the specific check that failed, and re-attempt. The `successor_metadata_must_be_consistent` check is the most likely failure point; the `canonical_successor` field addition is the explicit mitigation. |
| D147 row's pre-registered reversal condition wording is unclear or unfalsifiable as drafted | Per Open Questions: implementer drafts from requirements doc R9a language; review at apply-time before commit. If the wording is unsatisfactory at review time, iterate before commit. Reversal condition is on the critical path for round 2 reviewer Root E concern; getting it right at first commit is preferable to fixing in a follow-up. |
| M002 milestone doc edits accidentally expand M002 core scope (Group A items mis-classified as core) | Per R6: Group A items must be tagged as "discretionary post-M002-core follow-on"; the M002 doc edit explicitly preserves M002's existing core scope (weekly receipt + next-N queue + carry-forward). Review the M002 doc edit at apply-time for scope-purity. |
| 2026-07-20 re-eval scope-reframe causes confusion vs. the existing adversarial memo's pre-registered re-eval text | The D147 row reframes scope **in the closure decision row only** (per R9). The adversarial memo itself is untouched. Future weekly review entries referencing the memo will read both the original re-eval text and the closure-reframe text and resolve any apparent tension via the D147 reference. |
| Catalog validator (`cap_status_must_be_consistent`) flags inconsistency post-closure | Mitigation: cap-status JSON explicitly untouched (R8). The validator is keyed on JSON file presence and shape, not on milestone status — closing M001 does not move the validator's input. |
| Founder later wants to revert M001 closure (e.g., after the round-2 reviewer Root E reversal trigger fires at 2026-07-20) | Reversal mechanism is pre-registered in the D147 row (per R9a). Reverting requires a new decision row that re-opens M001 + flips m001-validation-overhang back to `status: active` + flips milestone-doc back to a non-complete stage + Amendment Log entry. Higher disclosure cost than U1/U2 forward commits but procedurally clean. |

---

## Documentation / Operational Notes

- No deployment impact (docs-only).
- No monitoring impact.
- Future agents reading `docs/decisions.md` for M001 status post-closure should find D147 as the canonical M001 closure record. D146 is the D132 ratification.
- The 2026-07-20 D130 re-eval still runs per the adversarial memo's existing schedule; D147 documents the reframed scope.
- M002 planning will engage with the carry-forward Group A items as discretionary post-M002-core work; planners should reference D147 for context.

---

## Sources & References

- **Origin document:** [docs/brainstorms/2026-05-27-attack-track-action-stack-requirements.md](../brainstorms/2026-05-27-attack-track-action-stack-requirements.md)
- **F1 evidence base:** [docs/research/2026-05-27-attack-content-and-solo-friction-feedback.md](../research/2026-05-27-attack-content-and-solo-friction-feedback.md)
- **Decision precedent (decision-debt-sweep):** [docs/solutions/architecture-patterns/2026-05-25-decision-debt-sweep-pattern.md](../solutions/architecture-patterns/2026-05-25-decision-debt-sweep-pattern.md)
- **Decision precedent (D137 retire pattern):** [docs/solutions/architecture-patterns/d137-canonical-pre-run-spine-setup-safety-2026-05-07.md](../solutions/architecture-patterns/d137-canonical-pre-run-spine-setup-safety-2026-05-07.md)
- **D132 context:** `docs/decisions.md` D132 row (the decision being ratified by D146)
- **D130 context:** `docs/decisions.md` D130 row (the founder-use window being closed via executive call)
- **Adversarial memo:** `docs/plans/2026-04-20-m001-adversarial-memo.md` (unchanged; the closure references it but does not edit it)
- **M001 milestone:** `docs/milestones/m001-solo-session-loop.md` (edited by U2)
- **M002 milestone:** `docs/milestones/m002-weekly-confidence-loop.md` (edited by U3)
- **M001 validation overhang:** `docs/status/m001-validation-overhang.md` (edited by U2 — status → superseded)
- **Current state:** `docs/status/current-state.md` (Recent Shipped History row added by U2)
- **AGENTS.md:** Current State section (edited by U2)
- **Catalog:** `docs/catalog.json` (M001 + m001-validation-overhang entries edited by U2)
- **Ideation context:** [docs/ideation/2026-05-27-attack-track-and-m001-closure-shape-ideation.md](../ideation/2026-05-27-attack-track-and-m001-closure-shape-ideation.md)
- **Founder posture:** founder verbatim 2026-05-27 conversation prose (captured in requirements doc Problem Frame and in D146/D147 row bodies)
