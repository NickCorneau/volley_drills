---
id: d46-pair-open-source-backed-gap-card-plan-2026-05-04
title: "feat: Add d46-pair-open Source-Backed Gap Card"
type: plan
status: complete
stage: validation
summary: "Plan for shipping a source-backed gap card for the d46-pair-open advanced spin-read serve receive pressure cluster, registering it in catalog/routing metadata, and naming the comparator-gated follow-up artefacts. Does not authorize catalog edits, cap widening, runtime changes, or D101 re-entry."
date: 2026-05-04
origin: docs/brainstorms/2026-05-04-pair-side-catalog-content-depth-requirements.md
depends_on:
  - docs/brainstorms/2026-05-04-pair-side-catalog-content-depth-requirements.md
  - docs/reviews/2026-04-30-focus-coverage-gap-cards.md
  - docs/reviews/2026-05-02-d47-source-backed-gap-card.md
  - docs/plans/2026-05-02-014-feat-d47-source-backed-catalog-implementation-plan.md
  - docs/reviews/2026-05-01-generated-plan-diagnostics-triage.md
  - app/src/data/drills.ts
---

# feat: Add d46-pair-open Source-Backed Gap Card

## Overview

Ship the highest-leverage pair-side catalog gap card derived from current generated diagnostics, modelled directly on `docs/reviews/2026-05-02-d47-source-backed-gap-card.md`. The slice is documentation-only: it produces an admissible gap card and registers it for routing, while explicitly deferring the comparator and catalog implementation work as named follow-up artefacts. No catalog content, drill caps, runtime behaviour, or D101 boundary changes here.

---

## Problem Frame

Per the brainstorm, the current redistribution causality receipt (after restricting to pair variants whose pressure does not disappear under the allocated-duration counterfactual) names `d46-pair-open` as the strongest pair-side catalog candidate: 8 pressure-disappears cells plus 8 pressure-remains cells, dominant action `pressure_remains_without_redistribution`. The current `d46` family covers FIVB 3.15 / 3.16 (`Pass and Look` / `Topspin Serve Off Box`) at a 5-8 minute envelope. When the generator allocates longer pair-open advanced passing blocks, `d46-pair-open` is asked to fill beyond its honest envelope.

This plan does not decide whether the right answer is a sibling drill, a cap widening, or a block-shape change. It only ships the gap card so a comparator can decide.

---

## Requirements Trace

- R1, R2, R3 (brainstorm). Use generated diagnostics evidence and limit to pressure-remains/mixed pair candidates; treat `d46-pair-open` as the primary candidate.
- R4, R5 (brainstorm). The gap card must name affected groups, current receipt facts, current catalog coverage, suspected content-depth gap, candidate IDs, likely fix type, rejected direct cap-widening note, and exact source references with adaptation deltas.
- R6, R7, R8 (brainstorm). The gap card must remain `not_authorized` and explicitly name the comparator gate and re-entry triggers.
- R9 (brainstorm). The plan must reuse the D47→D49 template structure where possible.

---

## Scope Boundaries

- Do not change catalog content, workload metadata, drill caps, copy, or `buildDraft()` behaviour.
- Do not author the comparator decision packet or the catalog implementation plan in this slice.
- Do not reopen the D101 (3+ player) boundary.
- Do not bundle `d31-pair-open`/`d31-pair` evidence into the d46 gap card.
- Do not introduce 3+ player source forms even as adaptation candidates.
- Do not modify generated diagnostic packets, D49 follow-up, or D47 closure logic.

### Deferred to Follow-Up Work

- Comparator decision packet for `d46-pair-open` vs no-change baseline (and optionally vs `d05` if re-entry triggers fire).
- Catalog implementation plan for the comparator winner (sibling drill, cap widening, or block-shape change).
- A second pair-side gap card for `d31-pair-open`/`d31-pair`.

---

## Activation Gate

This plan only ships documentation. There is no activation gate to clear inside the plan. The gap card it produces remains `source_candidate` with `not_authorized` activation status. Activation is gated by:

1. A comparator decision packet that selects a pair-side winner with current source/adaptation evidence.
2. A separate catalog implementation plan that lands behind its own activation gate and product acceptance criteria.

---

## Context & Research

### Relevant Files And Patterns

- `docs/reviews/2026-05-02-d47-source-backed-gap-card.md` — canonical gap card template; reuse section ordering verbatim.
- `docs/reviews/2026-04-30-focus-coverage-gap-cards.md` — canonical home for gap-card status; the new card may either be added inline or referenced from here.
- `docs/reviews/2026-05-01-generated-plan-diagnostics-triage.md` — current diagnostic source of truth; the gap card must cite group keys and receipt facts from this generated workbench.
- `docs/plans/2026-05-02-014-feat-d47-source-backed-catalog-implementation-plan.md` — canonical implementation plan template the future comparator-winner plan should reuse.
- `app/src/data/drills.ts` — current `d46` drill definition (lines around the `d46` constant) and existing variant caps.

### Source Candidate Pool

Per the brainstorm, allowable source candidates include (final selection happens during gap card authorship, not here):

- Better at Beach pair passing/serve receive drill collections (out-of-system serve receive, repeated platform-control work under fatigue).
- Junior Volleyball Association passing/serve receive habits content.
- The Art of Coaching Volleyball pass-and-go or pass-under-fatigue content.
- FIVB drill book serve-receive variations beyond 3.15/3.16.

Sources requiring 3+ players are supporting rationale only and must include a 1-2 player adaptation delta.

---

## Key Technical Decisions

- Keep the slice documentation-only. No app changes, no test changes, no generated-diagnostics changes.
- Mirror the D47 gap card section ordering exactly so future agents can diff the two cards and verify shape parity.
- Defer the comparator format to its own follow-up plan; only name the comparator as the next artefact in the gap card.
- Register the new gap card in `docs/catalog.json` with status `active`, `type: review`, and a `canonical_for` line that explicitly notes `not_authorized` activation.
- Do not bump the existing focus-coverage gap-cards review in this slice; that file already references `future-gap-block-stretch-pressure` and the new pair-side card is best authored as a standalone source-backed card alongside it.

---

## Implementation Units

- [x] U1. **Author d46-pair-open Source-Backed Gap Card**

**Goal:** Produce a complete, admissible source-backed gap card for `d46-pair-open` that mirrors the D47 gap card structure and remains `not_authorized` for activation.

**Requirements:** R1, R2, R3, R4, R5 (brainstorm).

**Dependencies:** None.

**Files:**
- Create: `docs/reviews/2026-05-04-d46-pair-open-source-backed-gap-card.md`

**Approach:**
- Reuse the D47 gap card section ordering verbatim: Purpose, Gap Card (`gap-d46-pair-open-advanced-pass-conditioning-depth`), Exact Source References, Adaptation Delta, Expected Diagnostic Movement, Verification Command, Checkpoint Criteria, Activation Manifest Stub.
- In the Gap Card section, set `Status: source_candidate`, `Activation readiness: not_authorized`, and an explicit `Comparator gate:` line naming the future comparator packet path.
- Cite the affected diagnostic groups by stable group key (`gpdg:v1:d46:d46-pair-open:main_skill:true:optional_slot_redistribution+over_authored_max+over_fatigue_cap` plus the `d46-solo-open` sibling group for context only).
- Quote current receipt facts directly from the generated triage workbench (8 pressure-disappears, 8 pressure-remains, 0 inconclusive, 0 non-redistribution pressure).
- Name the suspected content-depth gap as: current `d46-pair-open` is a 5-8 minute spin-read receive drill; the missing depth is a longer pair-open serve receive conditioning surface that trains repeated read/move/recover under fatigue without stretching `d46-pair-open` beyond its honest envelope.
- List candidate changed/missing IDs as planning placeholders only. Note that implementation must grep `app/src/data/drills.ts` and `app/src/data/__tests__/catalogValidation.test.ts` for collisions before reserving any ID.
- Cite at least one source from the candidate pool above per adaptation candidate, with an explicit 1-2 player adaptation delta and an explicit rejection of any 3+ player source form.
- Include a "Rejected direct D46 edit" note that explicitly rejects widening `d46-pair-open` beyond 8 minutes from this card alone.

**Test scenarios:**
- Documentation-only; no automated tests required for this unit. Verification is a structural diff against `docs/reviews/2026-05-02-d47-source-backed-gap-card.md`: same section ordering, same field names, same activation-status posture.

**Verification:**
- Manual structural read: every section that appears in the D47 gap card appears in the d46 card with the same name, in the same order, with `not_authorized` activation status.
- `bash scripts/validate-agent-docs.sh` passes for the new file.

---

- [x] U2. **Register the Gap Card in Catalog Routing Metadata**

**Goal:** Register the new gap card in `docs/catalog.json` so future agents can find it, and add it to the diagnostics generator dependency list so triage stays in sync.

**Requirements:** R6, R7 (brainstorm).

**Dependencies:** U1.

**Files:**
- Modify: `docs/catalog.json`
- Modify: `app/scripts/validate-generated-plan-diagnostics-report.mjs` (add new gap card and this plan to `depends_on`)
- Modify: `docs/plans/2026-05-04-001-feat-d46-pair-open-source-backed-gap-card-plan.md` (mark units complete)

**Approach:**
- Add a `docs/catalog.json` entry for the new gap card with `id: "d46-pair-open-source-backed-gap-card-2026-05-04"`, `type: "review"`, `status: "active"`, `active_registry: true`, and a `canonical_for` line that explicitly notes `not_authorized` activation and the comparator gate.
- Add a second `docs/catalog.json` entry for this plan with `type: "plan"`, `status: "complete"`, and a `canonical_for` line that names the gap card as the produced artefact.
- Update the generated triage doc's `depends_on` list (in `app/scripts/validate-generated-plan-diagnostics-report.mjs`) to include both the new gap card and this plan.
- Regenerate the triage doc and confirm freshness checks pass.
- Mark U1 and U2 complete in this plan.

**Test scenarios:**
- `npm run diagnostics:report:check` passes after regeneration.
- `bash scripts/validate-agent-docs.sh` passes (catalog frontmatter rules, complete plans require `active_registry: true`, etc.).

**Verification:**
- `cd app && npm run diagnostics:report:check`
- `cd app && npm run build`
- `bash scripts/validate-agent-docs.sh`

---

## System-Wide Impact

- **Domain logic:** None. No code changes.
- **Runtime:** None. No user-facing behaviour change.
- **Catalog content:** None. No drill or variant changes.
- **Docs:** Adds one new review file, two new `docs/catalog.json` entries, and one `depends_on` update. Generated triage doc is regenerated to refresh the dependency list and date.
- **Unchanged invariants:** D101 boundary remains in force. D47/D49 follow-up tracks remain unchanged. Generated diagnostic packets remain diagnostic-only.

---

## Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| The gap card drifts from the D47 template and confuses future agents. | Mirror the D47 section ordering verbatim; verification step explicitly diffs structure. |
| Reviewers misread the gap card as activation approval. | Explicit `Activation readiness: not_authorized`, `Comparator gate:` line, and "Rejected direct D46 edit" note. |
| Source citations are 3+ player forms with no real 1-2 player adaptation. | Brainstorm R5 requires a 1-2 player adaptation delta per cited source; gap card must reject inadmissible source forms inline. |
| The new gap card blocks routing because catalog metadata is stale. | U2 explicitly registers the new file in `docs/catalog.json` and updates the diagnostics generator dependency list. |
| Pre-existing dirty tree mixes this slice with unrelated work. | Plan ships untracked docs only; staging happens before commit, scoped to the new files plus the catalog/diagnostics-generator updates. |

---

## Implementation Result

The d46-pair-open source-backed gap card lives at `docs/reviews/2026-05-04-d46-pair-open-source-backed-gap-card.md` with `Status: source_candidate`, `Activation readiness: not_authorized`, and an explicit `Comparator gate:` line naming the next required artefact (a `d46-pair-open` vs no-change comparator decision packet, optionally vs `d05` if D05 re-entry triggers fire). The card mirrors the D47 gap card section ordering verbatim. It is registered in `docs/catalog.json` as both a `requirements` entry (for the brainstorm) and a `review` entry (for the gap card itself), plus a `plan` entry for this slice. The diagnostics generator dependency list is updated to include the new gap card and this plan, and the regenerated triage doc carries the updated dependency footprint.

No catalog content, drill caps, runtime behaviour, or D101 boundary changes occurred in this slice. The follow-up artefacts named by the brainstorm — comparator decision packet and catalog implementation plan — remain to be authored only if and when a maintainer decides to advance the pair-side path.

## Sources & References

- `docs/brainstorms/2026-05-04-pair-side-catalog-content-depth-requirements.md`
- `docs/reviews/2026-05-04-d46-pair-open-source-backed-gap-card.md`
- `docs/reviews/2026-05-02-d47-source-backed-gap-card.md`
- `docs/reviews/2026-04-30-focus-coverage-gap-cards.md`
- `docs/reviews/2026-05-01-generated-plan-diagnostics-triage.md`
- `docs/plans/2026-05-02-014-feat-d47-source-backed-catalog-implementation-plan.md`
- `app/src/data/drills.ts`
