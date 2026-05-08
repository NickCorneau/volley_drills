---
title: "docs: A2 BAB canon-validating confirmation receipts in decisions.md"
type: docs
status: active
date: 2026-05-08
origin: docs/ideation/2026-05-04-bab-complete-plan-builder-ideation.md
---

# docs: A2 BAB canon-validating confirmation receipts in decisions.md

## Summary

Receipt the three remaining BAB canon-validating confirmations against `docs/decisions.md`. T1 -> O24 already received its receipt as `D141` on 2026-05-08. T2 -> D76, T5 -> D77, and T7 -> D101 are still unreceipted. This plan appends a short, dated **Confirmation receipt (2026-05-08)** clause to each of the three target rationale cells, citing the cross-source synthesis thesis and the ideation survivor as warrant. Pure documentation change; no schema, behavior, app code, or tests touched.

---

## Problem Frame

The 2026-05-04 ideation pass survivor A2 calls for a one-shot status receipt that records BAB practice-plan synthesis findings against canon already in place, so future agents reading `docs/research/practice-plan-authoring-synthesis.md` cold do not re-litigate decisions that already exist. T1 -> O24 was filed via `D141` on 2026-05-08 (which both confirms the integrative-focus reading and resolves the open question). T2 -> D76, T5 -> D77, and T7 -> D101 remain unreceipted. Without these receipts, the synthesis floats free of canon and a future agent could mistake T2/T5/T7 for new findings or new policy claims.

---

## Requirements

- R1. Append a Confirmation receipt clause to D76's rationale citing T2 (feed-type honesty) as external structural validation.
- R2. Append a Confirmation receipt clause to D77's rationale citing T5 (count attempts, not just successes) as external structural validation.
- R3. Append a Confirmation receipt clause to D101's rationale citing T7 (BAB pair / small-group native; Volleycraft must stay constraint-aware) as external structural validation.
- R4. Each receipt must explicitly state it is **receipt only** — confirms canon already in place, authorizes no new behavior, schema, or scope expansion.
- R5. Each receipt must cite the synthesis thesis section (`docs/research/practice-plan-authoring-synthesis.md` Tx) and the ideation survivor (`docs/ideation/2026-05-04-bab-complete-plan-builder-ideation.md` survivor A2) as warrant.
- R6. Frontmatter `last_updated` on `docs/decisions.md` stays at `2026-05-08` (already current).
- R7. The repo doc-validation script (`bash scripts/validate-agent-docs.sh`) passes after the change.

**Origin:** `docs/ideation/2026-05-04-bab-complete-plan-builder-ideation.md` Bucket A survivor A2.

---

## Scope Boundaries

- This plan does **not** receipt the spine-generalization confirmation referenced in A2 ("the existing `warmup -> technique / movement_proxy -> main_skill -> pressure -> wrap` archetype shape"). The user task list explicitly enumerated only T2 -> D76, T5 -> D77, T7 -> D101. The spine-generalization receipt has no single canonical D-number target (it validates the existing archetype layer, not one decision row); folding it in here without a clean target would dilute the receipt pattern.
- This plan does **not** modify `docs/research/practice-plan-authoring-synthesis.md` itself. The synthesis already names the canon links inline; the receipt direction is **decisions.md <- synthesis**, not the reverse.
- This plan does **not** add new D-numbers. T2/T5/T7 are external validations of decisions already in place; they are not new decisions.
- This plan does **not** touch app code, tests, schema, or migrations.
- This plan does **not** address `O24` (already resolved by `D141` on 2026-05-08) or any other open question.

### Deferred to Follow-Up Work

- Spine-generalization receipt: defer until a clear target surface exists (a future archetype-shape decision, an `M002` plan-grammar packet, or a dedicated "Confirmation Receipts" section in the synthesis doc itself). Tracked in the ideation survivor list under A2's "spine generalization" line.

---

## Context & Research

### Relevant code and patterns

- `docs/decisions.md` — canonical D / O log. Markdown table format `| ID | Decision | Rationale | Date |`. Cells routinely carry multi-paragraph content with `**Bold prefix.**` markers separating semantic sub-blocks (see D134, D141). Long rationales are normal; the column-width padding in the source is cosmetic and does not constrain content length.
- `D141` (line 160) is the working precedent for a 2026-05-08 BAB-validated receipt-style entry: it cites BAB Plan 1, the practice-plan synthesis, names an explicit **Authorization boundary.** clause, and explicitly forbids citing M001's current constraint as proof of broader product principle. The same posture (cite source, name boundary, refuse scope expansion) is the template for T2/T5/T7 receipts, even though those receipts append to existing decisions rather than create new ones.
- The receipt clause goes inside the existing `Rationale` cell using a `**Confirmation receipt (2026-05-08):**` bold prefix and `;`-separated clauses, matching the punctuation style of existing multi-clause rationales in the table.

### Institutional learnings

- `.cursor/rules/machine-scannable-docs.mdc`: "When entrypoints or routing rules change, sync `docs/catalog.json`, `AGENTS.md`, relevant `.cursor/rules/*.mdc`, and any affected compatibility surfaces in the same pass." This change does not move routing or entrypoints; the catalog already references A2 (`docs/catalog.json` lines 441 and 999 mention A2 by name and reference T1/T2/T5/T7 against D76/D77/D101). No catalog update needed.
- Volleycraft single-branch flow (2026-05-05 onward, see `AGENTS.md`): work on `main`, push to `origin` after every commit. No feature branch required for this docs-only change.

### External references

- Practice-plan authoring synthesis Cross-Source Theses: `docs/research/practice-plan-authoring-synthesis.md` sections T2 (Feed-Type Honesty), T5 (Workload Caps Must Count Attempts), T7 (BAB Pair/Small-Group Native).
- 2026-05-04 ideation survivor A2 description: `docs/ideation/2026-05-04-bab-complete-plan-builder-ideation.md` lines 104-122.

---

## Key Technical Decisions

- **Inline receipt clause, no new D-number.** T2/T5/T7 are external structural validations of decisions already in place. Adding new D-numbers would imply new policy and break the receipt-only framing the ideation survivor specifies. Inline appends preserve the existing decision identity and keep canon stable.
- **Append-only edits.** The receipt clause is appended after the existing rationale text using `; **Confirmation receipt (2026-05-08):** ...`. The original rationale wording stays verbatim — the receipt extends, never overwrites.
- **No frontmatter date change required.** `docs/decisions.md` already has `last_updated: 2026-05-08`. Verify after edits; if any other in-progress edit moved it, restore to 2026-05-08.
- **No catalog update required.** `docs/catalog.json` already cites A2 against D76/D77/D101 (lines 441, 999). The receipts realize the citation; they do not change the routing.
- **No `.cursor/rules` update required.** No agent-facing routing surface changes.

---

## Open Questions

### Resolved during planning

- Where does the receipt go? -> Inline in the rationale cell of each target D-number, using a `**Confirmation receipt (2026-05-08):**` bold prefix.
- Is T1 -> O24 actually receipted? -> Yes, via `D141` (2026-05-08), which both confirms T1's integrative-focus reading and resolves O24. No further action needed for T1.
- Should spine-generalization land here? -> No, deferred. See Scope Boundaries.

### Deferred to implementation

- Final exact wording of each receipt clause may shift slightly in the work step to match in-cell punctuation. The structural shape is fixed; only minor copy edits are expected.

---

## Implementation Units

- U1. **Append Confirmation receipt to D76 rationale (T2 -> D76)**

**Goal:** Add the T2 (feed-type honesty) receipt clause to D76's rationale cell.

**Requirements:** R1, R4, R5.

**Dependencies:** None.

**Files:**

- Modify: `docs/decisions.md` (line 104, D76 row)

**Approach:**

- Locate the D76 row by its decision text "Feed type is a required field on every drill variant: self-toss, partner-toss, live-serve, wall-rebound, coach-serve".
- The current rationale ends with: `... cooperative passing does not transfer to serve reception without this distinction`.
- Append (preserving the existing trailing whitespace pattern in the cell) the clause:
  `; **Confirmation receipt (2026-05-08):** practice-plan authoring synthesis thesis T2 (Feed-Type Honesty Is The Core Transfer Boundary) externally validates this decision against BAB Plan 3 (toss -> serve sibling), FIVB Drills 3.4 / 3.6 / 3.13 / 3.15 (serve-receive specificity), and motor-learning literature on perception-action coupling. Receipt only — confirms canon already in place; authorizes no new behavior, schema, or feed-type axis change. See \`docs/research/practice-plan-authoring-synthesis.md\` T2 and \`docs/ideation/2026-05-04-bab-complete-plan-builder-ideation.md\` survivor A2 for warrant.`
- Use `StrReplace` keyed on a uniquely identifying substring of the rationale cell so the edit is unambiguous.

**Patterns to follow:**

- D141 (line 160) for precedent on date-stamped, source-citing, scope-bounded inline content.
- Existing multi-clause rationales (D74, D134) for `;`-separated clause punctuation.

**Test scenarios:**

- Test expectation: none — pure documentation change, no behavioral surface. Verification is `bash scripts/validate-agent-docs.sh` plus manual diff review.

**Verification:**

- `git diff docs/decisions.md` shows exactly one append on the D76 row, no other rows touched.
- `bash scripts/validate-agent-docs.sh` exits 0.
- `rg -n "Confirmation receipt \(2026-05-08\):.*T2" docs/decisions.md` returns the new clause once.

---

- U2. **Append Confirmation receipt to D77 rationale (T5 -> D77)**

**Goal:** Add the T5 (workload caps must count attempts) receipt clause to D77's rationale cell.

**Requirements:** R2, R4, R5.

**Dependencies:** None (independent of U1; can land in same commit).

**Files:**

- Modify: `docs/decisions.md` (line 105, D77 row)

**Approach:**

- Locate the D77 row by its decision text "Fatigue cap (max dose per block plus optional rest minimum) is a required field on every drill variant".
- The current rationale ends with: `... the system cannot protect the user without encoding it`.
- Append the clause:
  `; **Confirmation receipt (2026-05-08):** practice-plan authoring synthesis thesis T5 (Workload Caps Must Count Attempts, Not Just Successes) externally validates this decision against BAB repeat-until-hit drill structures (multiple plans), FIVB Drill 3.13 Diamond Passing 2-set-of-4 cap, and FIVB spike-exhaustion warnings. Receipt only — confirms canon already in place; authorizes no new behavior, schema, or fatigue-cap axis change. See \`docs/research/practice-plan-authoring-synthesis.md\` T5 and \`docs/ideation/2026-05-04-bab-complete-plan-builder-ideation.md\` survivor A2 for warrant.`

**Patterns to follow:**

- Same as U1.

**Test scenarios:**

- Test expectation: none — pure documentation change.

**Verification:**

- `git diff docs/decisions.md` shows the D77 append cleanly.
- `bash scripts/validate-agent-docs.sh` exits 0.
- `rg -n "Confirmation receipt \(2026-05-08\):.*T5" docs/decisions.md` returns the new clause once.

---

- U3. **Append Confirmation receipt to D101 rationale (T7 -> D101)**

**Goal:** Add the T7 (BAB pair / small-group native; constraint-aware) receipt clause to D101's rationale cell.

**Requirements:** R3, R4, R5.

**Dependencies:** None (independent of U1 and U2).

**Files:**

- Modify: `docs/decisions.md` (line 129, D101 row)

**Approach:**

- Locate the D101 row by its decision text "3+ player session assembly and drill selection is a tracked future requirement, not M001/v0b scope; M001 handles 1-2 players with D90 dynamic player-count input".
- Read the full D101 rationale content first to ensure the append target is unambiguous.
- Append the clause:
  `; **Confirmation receipt (2026-05-08):** practice-plan authoring synthesis thesis T7 (BAB Is Pair / Small-Group Native; Volleycraft Must Stay Constraint-Aware) externally validates this decision against BAB drill participant counts across the captured 20 plans (most highest-transfer drills need 3-4 players: triangle passing, triangle setting, 6 Serve Speed Ball, defensive retreatment, cross-court pepper, off-pass correction setting, wash games) and FIVB drill participant ranges. Receipt only — confirms canon already in place; authorizes no new participant-honesty axis, no D101 unlock, and no 3+ player scope expansion. See \`docs/research/practice-plan-authoring-synthesis.md\` T7 and \`docs/ideation/2026-05-04-bab-complete-plan-builder-ideation.md\` survivor A2 for warrant.`

**Patterns to follow:**

- Same as U1 and U2.
- Reinforce the D130 founder-use mode and D101-as-tracked-future-requirement framing — receipt must not imply D101 is now open or in-scope.

**Test scenarios:**

- Test expectation: none — pure documentation change.

**Verification:**

- `git diff docs/decisions.md` shows the D101 append cleanly.
- `bash scripts/validate-agent-docs.sh` exits 0.
- `rg -n "Confirmation receipt \(2026-05-08\):.*T7" docs/decisions.md` returns the new clause once.

---

- U4. **Final verification pass**

**Goal:** Confirm all three receipts are present, frontmatter is intact, and the validator is happy.

**Requirements:** R6, R7.

**Dependencies:** U1, U2, U3.

**Files:**

- Read: `docs/decisions.md` frontmatter (lines 1-22).
- Read: `docs/decisions.md` rows for D76, D77, D101.

**Approach:**

- Confirm `last_updated: 2026-05-08` is intact.
- Run `bash scripts/validate-agent-docs.sh` and read its exit code.
- Manually `git diff docs/decisions.md` to confirm only three lines changed (the D76, D77, D101 rows) and no unintended edits anywhere else in the table.
- Confirm `rg -n "Confirmation receipt \(2026-05-08\)" docs/decisions.md` returns exactly four matches (the new T2, T5, T7 clauses plus any pre-existing receipt phrasing — expected count is **3** if no prior receipts; verify count and explain any discrepancy).

**Test scenarios:**

- Test expectation: none — pure verification step.

**Verification:**

- Validator exits 0.
- Diff is minimal and confined to the three target rows.
- `last_updated` frontmatter stays at 2026-05-08.

---

## System-Wide Impact

- **Interaction graph:** None. Documentation change with no runtime, schema, or agent-routing surface.
- **Error propagation:** N/A.
- **State lifecycle risks:** None.
- **API surface parity:** None.
- **Integration coverage:** None.
- **Unchanged invariants:** D76, D77, D101 decisions remain in their existing form — receipts are append-only and explicitly receipt-only. `D130` founder-use mode, the deferred `D91` retention gate, and `D101`'s tracked-future-requirement status are all unchanged. The only doc surface affected is `docs/decisions.md`; no `.cursor/rules`, `docs/catalog.json`, `AGENTS.md`, or compatibility surfaces require updates.

---

## Risks & Dependencies

| Risk | Mitigation |
| ---- | ---------- |
| Edit accidentally overwrites or reorders existing rationale text in a long table cell. | Use `StrReplace` with a unique trailing-clause anchor for each row (e.g., the final phrase of the existing rationale) and verify with `git diff` before finalizing. Read the current rationale cell content before editing. |
| Receipt language is over-claimed and reads as authorizing new behavior or scope expansion. | Each receipt explicitly carries "Receipt only — confirms canon already in place; authorizes no new behavior, schema, or [axis name] change." Mirrors D141's "Authorization boundary" discipline. |
| Future agent reads receipt as an unlock signal for D101 / D77 / D76 schema work. | The "no [axis name] change" wording is explicit. The ideation survivor A2's framing ("external structural validations of canon already in place") is preserved in each receipt. |
| Markdown table renders break because of long cell content. | Existing rationales (D74, D134, D141) already carry comparable or longer content. Markdown tables tolerate variable cell width; the source padding is cosmetic only. |
| Doc validator fails due to frontmatter or contract drift. | U4 runs the validator and gates completion on its exit code. |

---

## Documentation / Operational Notes

- After the receipts land, `docs/research/practice-plan-authoring-synthesis.md` does not need to be re-touched — the synthesis already cites the canon links inline. The receipt direction is **decisions.md <- synthesis**, completing the round-trip citation.
- `docs/catalog.json` does not need an update; it already references A2 against D76/D77/D101 in the synthesis and ideation entries.
- `AGENTS.md` does not need an update; it does not enumerate D-level decisions.
- This plan does not require a worktree or feature branch (single-branch flow on `main`, see `AGENTS.md`).

---

## Sources & References

- **Origin document:** [docs/ideation/2026-05-04-bab-complete-plan-builder-ideation.md](../ideation/2026-05-04-bab-complete-plan-builder-ideation.md) Bucket A survivor A2.
- **Source synthesis:** [docs/research/practice-plan-authoring-synthesis.md](../research/practice-plan-authoring-synthesis.md) sections T2, T5, T7.
- **Target file:** [docs/decisions.md](../decisions.md) rows D76, D77, D101.
- **Receipt precedent:** D141 (line 160 of `docs/decisions.md`, dated 2026-05-08), the T1 -> O24 confirmation that established the receipt pattern for this batch.
- **Catalog cross-references:** `docs/catalog.json` lines 441 and 999 (synthesis and ideation entries that already cite A2 against D76/D77/D101).
