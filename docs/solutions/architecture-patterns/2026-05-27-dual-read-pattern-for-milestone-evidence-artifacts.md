---
title: Dual-read pattern for milestone-evidence artifacts
date: 2026-05-27
category: docs/solutions/architecture-patterns
module: requirements-design + milestone-evidence
problem_type: architecture_pattern
component: documentation
severity: high
applies_when:
  - A milestone's evidence base depends on a structured user-facing artifact (e.g., a weekly receipt, a session summary, a check-in record)
  - The same data needs to be read in two modes — user-facing (with copy and framing) and diagnostic (structured signal for re-eval / cohort decisions / quality reads)
  - The founder is in a D130-style founder-use window where validation evidence rides on the user-facing artifact's accumulation
tags: [architecture, evidence-artifact, dual-read, diagnostics-as-product, founder-use, milestone-validation, schema-design]
related:
  - docs/solutions/2026-05-10-drill-first-time-runnability-system.md
---

# Dual-read pattern for milestone-evidence artifacts

## Context

During the M002 (Weekly Confidence Loop) brainstorm, the CC-1 ideation seed proposed a weekly receipt that doubled as the 2026-07-20 D130 re-eval cohort-decision evidence artifact — same persisted record, read two ways (user sees calm shibui receipt; founder reads same record as structured cohort-decision signal). The v1 requirements doc **dropped** this dual-read framing during brainstorm dialogue because "the user didn't surface it as a felt need."

Round-1 `ce-doc-review` flagged the drop as **CRITICAL** from two reviewers (adversarial + product-lens). Their convergent argument:

1. `D147` reframes the 2026-07-20 D130 re-eval to ride on M002 evidence — the cohort decision needs the receipt-shaped artifact's accumulation
2. The existing `services/export.ts` JSON dump (cited in v1 as covering the founder's diagnostic read) is a **raw table dump**, not a diagnostic surface. It exports rows without aggregation, framing, or interpretation — not the same artifact as a receipt-shaped record
3. Dropping the dual-read without a real replacement leaves the founder to retro-build a diagnostic layer later — exactly the late-cycle debt `D147` warns against
4. The dual-read was the doc's structural answer to "why is this M002-worthy rather than M001 polish?"

v2 re-introduced the dual-read via Decision 6, R16, R17, A3 actor, F4 flow, and AE8 — same persisted Receipt record carries both user-facing copy AND the structured signal needed for cohort-decision evidence, both readable via the JSON export pathway.

## Guidance

When designing a structured user-facing artifact whose accumulation IS or WILL BE the evidence base for a future milestone-validation decision, **design dual-read into the artifact's schema from the start**. Specifically:

1. **Identify the future-evidence read explicitly.** Name the decision the artifact's accumulation will inform (e.g., "2026-07-20 D130 cohort decision," "stage-gate at end of pilot," "subjective vs measured outcome reconciliation at retro"). If you can't name a decision, the dual-read pattern doesn't apply — defer.
2. **Design one persisted record carrying both reads.** The schema includes both user-facing fields (copy, framing, voice, register) AND structured signal fields (enum values, fired-rule ids, presence/absence flags, period-start/end timestamps, source-record IDs). These are not separate records — the founder's diagnostic read of the same record IS the future-evidence base.
3. **Surface the user-facing read via the normal product UI; surface the diagnostic read via the existing export pathway (or a thin extension).** Don't ship a separate diagnostic UI in v1 — that's parallel scope and tends to compound. The export-pathway extension is small, audit-able, and doesn't require a second route/screen.
4. **Name the actor explicitly** in the requirements doc (e.g., "Founder-as-diagnostician (D130 window-only)") so the dual-read is structurally documented, not implicit. The actor names the future-evidence read; the surface (export) names how that actor reads it.
5. **Acknowledge the read may be window-bound.** If the diagnostic read is only relevant during a founder-use window (e.g., until the cohort decision lands), document the sunset condition — the dual-read may collapse to user-only after the window closes.

The pattern is distinct from:

- **Analytics dashboards** (separate UI surface, separate schema, separate read-path — heavier scope)
- **Logging** (event-level, not artifact-level; logs don't carry user-facing copy)
- **A/B test telemetry** (instrumentation around an artifact, not the artifact itself)
- **Generic data export** (raw rows without aggregation or framing — what `services/export.ts` currently is)

## Why This Matters

When the dual-read is NOT designed in from the start, two failure modes emerge:

1. **Retro-built diagnostic layer (late-cycle debt).** The founder reaches the cohort-decision moment without the structured artifact they need to make the call. They retro-build a diagnostic surface — a separate dashboard, a one-off export script, a manual aggregation — exactly the kind of late-cycle work that costs disproportionately because it's competing with stage-gate pressure. Worse, the retro-built layer is divergent from the user-facing surface, so the two read-paths drift over time and contradict each other.
2. **Cohort-decision blocked on missing evidence.** If no artifact accumulates and no retro-build happens in time, the founder reaches the gate with founder-felt-friction signal only — soft, not measurable, not falsifiable. The gate either passes on weak signal (false positive) or fails on missing-evidence-not-failed-validation (false negative). Both are bad gate outcomes.

The dual-read pattern prevents both. The user-facing surface provides ongoing product value; the diagnostic read provides ongoing evidence accumulation; both come from the same record so they can't drift.

The pattern compounds with other M002+ work: if M003 ships a coach clipboard, the coach reads the same dual-read receipt as a third actor. If M002.5 adds AI-correlation, the AI reads the structured-signal half. Each new actor inherits the artifact for free rather than requiring a new persistence shape.

## When to Apply

- Milestone validation depends on an artifact's accumulation (not point-in-time event signal)
- The artifact is structured enough to carry diagnostic signal (not pure narrative)
- A founder-use or pilot window has a known decision-date the evidence base feeds
- The user-facing surface has its own product-value justification (the dual-read can't be the only reason it ships)
- The product is calm/respectful posture and cannot ship a parallel diagnostic UI without violating posture (the dual-read is the discipline move against the parallel UI temptation)

Skip when:

- No future-evidence decision is named (the dual-read is speculative substrate)
- The user-facing surface is unstructured (narrative, free-form) — diagnostic read won't have signal
- The future decision is far enough away that schema flexibility matters more than dual-read commitment

## Examples

**Anti-pattern (single-read artifact, retro-built diagnostic later):**

> M002 receipt v1 (pre-review): "Weekly receipt is a calm user-facing surface. Founder reads the existing JSON export at services/export.ts for diagnostic needs."
>
> Result on review: JSON export is a raw table dump, not a diagnostic surface. Founder retro-builds a diagnostic aggregation later under cohort-decision pressure → late-cycle debt, drift between user-facing receipt and retro-aggregation.

**Pattern (dual-read from the start):**

> M002 receipt v2: same Receipt record carries `{ user_copy, focus_mix, suggestion_fired_rule_id, block_focus, period_start, period_end, included_session_ids }`. A1 reads via Home cell and Settings → Receipts list. A3 (founder-as-diagnostician, D130-window-only) reads via JSON export pathway extended to include Receipt records.
>
> Result: same persisted record powers both reads. No retro-build. No drift. When 2026-07-20 D130 re-eval fires, the founder reads the accumulated Receipts as structured cohort-decision evidence directly from the existing export pathway.

## Related

- `docs/brainstorms/2026-05-27-m002-receipt-training-only-requirements.md` (v2 dual-read implementation: Decision 6, R16, R17, A3, F4, AE8)
- `docs/reviews/2026-05-27-m002-receipt-doc-review-synthesis.md` (the review synthesis that surfaced the round-1 CRITICAL drop)
- `docs/decisions.md` D147 (M001 closure + 2026-07-20 D130 re-eval reframing)
- `docs/research/founder-use-ledger.md` (the founder-use mode this pattern supports)
- `docs/solutions/2026-05-10-drill-first-time-runnability-system.md` (sibling pattern: READ-DO / DO-CONFIRM dual-context framing for drill cards — different domain, similar structural intuition that one artifact can serve two reads)
