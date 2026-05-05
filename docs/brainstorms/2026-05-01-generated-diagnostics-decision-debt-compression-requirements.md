---
id: generated-diagnostics-decision-debt-compression-requirements-2026-05-01
title: "Generated Diagnostics Decision-Debt Compression Requirements"
status: active
stage: validation
type: requirements
summary: "Focused requirements for grouping generated-plan diagnostic triage entries into human-sized decision prompts before continuing with dynamic surface, workload, redistribution, or catalog preview work."
authority: "Requirements addendum for decision-debt compression after the generated diagnostics triage workflow U1-U3 slice; does not authorize catalog changes or runtime generator policy changes."
last_updated: 2026-05-01
depends_on:
  - docs/brainstorms/2026-05-01-generated-plan-diagnostics-next-steps-requirements.md
  - docs/ideation/2026-05-01-generated-plan-diagnostics-next-steps-ideation.md
  - docs/plans/2026-05-01-002-feat-generated-diagnostics-triage-workflow-plan.md
  - docs/reviews/2026-05-01-generated-plan-diagnostics-triage.md
---

# Generated Diagnostics Decision-Debt Compression Requirements

## Problem Frame

The generated diagnostics triage workflow now has a durable registry and freshness gates, but the current workbench still asks the maintainer to reason over 53 routeable groups one row at a time.

That is too granular for the next product decision. The next step should compress the 32 deferred groups and 21 generator-policy investigation groups into a smaller set of decision prompts so a maintainer can decide whether the next move is policy review, workload guidance, redistribution evidence, dynamic-surface guardrails, or a concrete catalog proposal.

---

## Actors

- A1. Founder / maintainer: reviews compressed decision prompts and chooses routes or follow-up work.
- A2. Agent: generates the compression, keeps it fresh with the triage workbench, and avoids promoting observations without evidence.
- A3. Future catalog author: uses compressed decisions to understand whether a catalog edit is justified before proposing one.

---

## Key Flows

- F1. Review compressed decision debt
  - **Trigger:** The generated diagnostics triage workbench is current and has unresolved `defer` or `generator_policy_investigation` groups.
  - **Actors:** A1, A2
  - **Steps:** Generate grouped decision prompts, review the highest-impact groups inside each prompt, record the next decision lane or follow-up, and leave unresolved prompts clearly marked.
  - **Outcome:** The maintainer can work from a small set of policy questions instead of scanning all 53 groups.
  - **Covered by:** R1, R2, R3

- F2. Keep compression tied to live diagnostics
  - **Trigger:** The diagnostics report or triage workbench changes.
  - **Actors:** A2
  - **Steps:** Rebuild the grouped prompts from current triage data, flag unknown or uncategorized prompt types, and keep row-level triage details available for audit.
  - **Outcome:** Compression helps review without hiding diagnostic drift.
  - **Covered by:** R4, R5

---

## Requirements

**Grouped review output**

- R1. The workflow should group unresolved triage entries by the decision a human actually needs to make, not only by drill, variant, or observation code.
- R2. Each compressed prompt should include a label, short question, affected group count, affected cell count, full group-key traceability or a deterministic row-level anchor, route mix, and the likely next evidence needed.
- R3. The first prompt set should cover at least these derived compression lanes: short-session cooldown minimum, technique under-min review, workload envelope review, generator redistribution investigation, source-backed content-depth candidate, low-volume watchlist, and unknown/unclassified.
- R4. Compression lane assignment should be derived from current triage data, with explicit matching precedence, a short "why this lane" explanation, and no manually maintained per-row compression state.

**Generated freshness**

- R5. The compression output should be generated or validated from the current triage registry/workbench so it does not become a hand-maintained second source of truth.
- R6. Validation should fail only for stale generated output, missing lane coverage, or groups that fall into unknown/unclassified unexpectedly; it should not fail because a prompt remains unresolved.

**Plan sequencing**

- R7. Decision-debt compression should run before new catalog changes, runtime generator policy changes, or catalog preview tooling.
- R8. The output should explicitly recommend which follow-up unit it unlocks by stable name and current plan unit: U5 dynamic surface sentinel, U7 workload guidance, U8 redistribution comparison, or deferred U6 catalog preview for a concrete proposal.

---

## Acceptance Examples

- AE1. **Covers R1, R2, R3.** Given the current `d25-solo` wrap under-min group, when compression runs, it appears under a short-session cooldown minimum prompt rather than as an immediate drill-add request.
- AE2. **Covers R1, R2, R8.** Given top groups with `optional_slot_redistribution`, `over_authored_max`, and `over_fatigue_cap`, when compression runs, they appear under a generator redistribution investigation prompt that points toward U8 before catalog edits.
- AE3. **Covers R5, R6.** Given a new routeable group whose observation pattern does not match any compression lane, validation flags the unknown/unclassified lane without making all existing observations fail.
- AE4. **Covers R7, R8.** Given no concrete gap card or cap edit exists, the compressed output does not recommend U6 catalog preview as the immediate next implementation unit.

---

## Success Criteria

- The maintainer can scan fewer than ten compressed prompts and understand the main decision debt behind the 53 current triage entries.
- The compression preserves row-level traceability back to group keys and affected-cell counts.
- The output makes the next follow-up choice clearer without authorizing direct catalog additions.
- Each compressed prompt either records a disposition such as `no_implementation_action_yet` or names the next evidence/action needed.
- The output recommends exactly one next implementation unit or a deliberate pause.
- Downstream planning does not need to invent the prompt lanes, validation strictness, or sequencing relationship to U5-U8.

---

## Scope Boundaries

- Do not add drills, variants, caps, or source-backed catalog activation from this compression pass.
- Do not change shipped `buildDraft()` behavior.
- Do not build a UI editor.
- Do not make unresolved compressed prompts fail diagnostics.
- Do not hide or replace the row-level triage workbench; compression is a review layer over it.
- Do not build full catalog impact preview machinery until there is a concrete proposal to preview.

---

## Key Decisions

- Stage all three useful outputs: start with a docs review aid, generate or validate it from the triage registry, and add a narrow validation gate only for unknown categories or stale output.
- Keep compression as a bridge between completed U1-U3 triage infrastructure and the remaining follow-up units, not as a replacement for U5-U8.
- Treat U8 redistribution comparison and U7 workload guidance as likely unlocked by compression; treat U6 catalog preview as deferred until a real proposal exists.
- Keep compression lanes derived from current triage data; do not persist a second row-level taxonomy unless a later maintainer pass proves that durable lane state is needed.

---

## Dependencies / Assumptions

- The current generated diagnostics triage workbench remains the row-level source of truth.
- The current branch keeps observations non-blocking unless explicitly promoted by the graduation workflow.
- `docs/plans/2026-05-01-002-feat-generated-diagnostics-triage-workflow-plan.md` will be updated to add this as a new sequenced unit.

---

## Outstanding Questions

### Deferred to Planning

- [Affects R3, R4][Technical] Should prompt lanes be hand-authored constants, generated from route/fix-path patterns, or a hybrid with explicit fallback?
- [Affects R5, R6][Technical] Should compression freshness ride the existing `diagnostics:report:check` command or a separate narrower check?

---

## Next Steps

-> Update `docs/plans/2026-05-01-002-feat-generated-diagnostics-triage-workflow-plan.md` so decision-debt compression becomes the next unit after U1-U3 and before U5-U8 follow-ups.
