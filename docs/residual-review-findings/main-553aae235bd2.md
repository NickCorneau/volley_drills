# Residual Review Findings — main @ 553aae235bd2

**Source:** ce-correctness-reviewer pass against `docs/plans/2026-05-08-002-docs-a2-bab-receipt-confirmations-plan.md`
**Commit under review:** `553aae235bd2` (`docs(decisions): A2 BAB confirmation receipts (T2/T5/T7 -> D76/D77/D101)`)
**Branch:** `main` (single-branch flow per `AGENTS.md` 2026-05-05 onward)
**Sink rationale:** No open PR for `main`; single-branch flow does not use feature-branch PRs. `gh` CLI is also unauthenticated in this environment. Recording here as the durable no-PR sink.

## Residual Review Findings

- **[Low] `docs/decisions.md:129` (D101 receipt) ↔ `docs/research/practice-plan-authoring-synthesis.md:231` (T7 evidence base) — D101 receipt cites "captured 20 plans" while T7 evidence-base sentence still says "across all 14 captured plans".**
  The diff implements plan U3 verbatim with `BAB drill participant counts across the captured 20 plans`. The T7 evidence-base sentence in `docs/research/practice-plan-authoring-synthesis.md` line 231 still reads `BAB drill participant counts across all 14 captured plans`. The synthesis is internally inconsistent: line 137 (cluster summary table) and T13 (line 333) both use `all 20 captured plans` and explicitly note the captured book is structurally complete, while T7's evidence-base line was apparently not updated when capture extended from 14 → 20 plans. The receipt is more current than the specific paragraph it points at. The plan's scope boundary forbids modifying the synthesis, so this is not autofixable. Owner judgment among three options:
  - (a) accept the discrepancy as the receipt outpacing a stale T7 evidence-base line that the synthesis itself has elsewhere updated
  - (b) tighten the receipt to `across the captured plans` (drop the count entirely so it stops naming a number that conflicts with T7)
  - (c) file a separate follow-up to refresh T7's evidence-base sentence to `20 captured plans` once the synthesis is back in scope
  Recommendation: option (c) is cleanest long-term (the synthesis is already inconsistent with itself); option (a) is fine if the synthesis owner intends T13's "20 plans" framing to be the binding count and treats T7 line 231 as known stale.
